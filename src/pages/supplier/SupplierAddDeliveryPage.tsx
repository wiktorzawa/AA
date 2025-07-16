import type { FC } from "react";
import { useState } from "react";
import { FileInput, Card, Alert, Spinner, HelperText } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import * as deliveryApi from "../../api/deliveryApi";
import type { FilePreviewResponse, ColumnMapping } from "../../api/deliveryApi";
import { ProductDataTable } from "../../ProductDataTable";
import { DeliveryDetailsForm } from "../../components/deliveries/DeliveryDetailsForm";
import { ColumnMappingForm } from "../../components/deliveries/ColumnMappingForm";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/authStore";
import type { SupplierProfile } from "@/types/app.types";

const SupplierAddDeliveryPage: FC = () => {
  const profile = useAuthStore((state) => state.profile);

  function isSupplier(p: any): p is SupplierProfile {
    return p && typeof p.supplierId === "string";
  }

  const supplierId = isSupplier(profile) ? profile.supplierId : null;

  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(0); // Do reset inputa
  const [previewData, setPreviewData] = useState<FilePreviewResponse | null>(
    null,
  );

  const {
    mutate: previewFileMutation,
    isPending: isLoading,
    error,
  } = useMutation<
    FilePreviewResponse,
    Error,
    { file: File; mapping?: ColumnMapping }
  >({
    mutationFn: (variables) =>
      deliveryApi.previewFile(variables.file, variables.mapping),
    onSuccess: (response) => {
      toast.success(
        "Plik został przeanalizowany. Sprawdź podgląd i uzupełnij dane.",
      );
      setPreviewData(response);
    },
    onError: (err) => {
      const errorMessage =
        err.message || "Wystąpił nieznany błąd podczas przetwarzania pliku.";
      toast.error(errorMessage);
      setPreviewData(null);
    },
  });

  const { mutate: createDeliveryMutation, isPending: isCreatingDelivery } =
    useMutation<
      deliveryApi.DeliveryUploadResponse,
      Error,
      {
        file: File;
        mapping: ColumnMapping;
        deliveryNumber: string;
        financeData: {
          kurs_wymiany: number;
          procent_wartosci: number;
          stawka_vat: number;
          waluta: string;
        };
        supplierId: string | null; // Dodajemy supplierId
      }
    >({
      mutationFn: async (variables) => {
        // Sprawdź czy plik jest nadal dostępny
        if (!variables.file || variables.file.size === 0) {
          throw new Error(
            "Plik nie jest dostępny. Spróbuj ponownie wybrać plik.",
          );
        }

        if (!variables.supplierId) {
          throw new Error(
            "Brak ID dostawcy. Upewnij się, że jesteś poprawnie zalogowany.",
          );
        }

        console.log("Creating delivery - policy will auto-set supplier ID");

        // Najpierw utwórz dostawę
        const deliveryResult = await deliveryApi.uploadAndProcessFile(
          variables.file,
          variables.mapping,
          variables.deliveryNumber,
          variables.supplierId, // Przekaż ID dostawcy
        );

        // Następnie utwórz dane finansowe
        if (deliveryResult.data?.id_dostawy) {
          await deliveryApi.createFinances(
            deliveryResult.data.id_dostawy,
            variables.financeData,
          );
        }

        return deliveryResult;
      },
      onSuccess: () => {
        toast.success(
          "Dostawa z danymi finansowymi została utworzona pomyślnie!",
        );

        // Reset całego stanu
        setFile(null);
        setPreviewData(null);
        setFileInputKey((prev) => prev + 1); // Reset input
      },
      onError: (err) => {
        toast.error(err.message || "Błąd podczas tworzenia dostawy");

        // W przypadku błędu związanego z plikiem, zresetuj input
        if (err.message?.includes("plik") || err.message?.includes("file")) {
          setFileInputKey((prev) => prev + 1);
        }
      },
    });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Sprawdź czy plik jest prawidłowy
      if (selectedFile.size === 0) {
        toast.error("Wybrany plik jest pusty. Wybierz prawidłowy plik.");
        return;
      }

      // Sprawdź typ pliku
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
        "text/csv", // .csv
      ];

      if (
        !allowedTypes.includes(selectedFile.type) &&
        !selectedFile.name.match(/\.(xlsx|xls|csv)$/i)
      ) {
        toast.error(
          "Nieprawidłowy typ pliku. Wybierz plik .xlsx, .xls lub .csv",
        );
        return;
      }

      console.log("File selected:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        lastModified: selectedFile.lastModified,
      });

      setFile(selectedFile);
      setPreviewData(null);
      previewFileMutation({ file: selectedFile });
    }
  };

  const handleMappingConfirm = (newMapping: ColumnMapping) => {
    if (file && previewData) {
      // Sprawdź czy plik jest nadal dostępny
      if (!file || file.size === 0) {
        toast.error("Plik nie jest dostępny. Wybierz plik ponownie.");
        setFileInputKey((prev) => prev + 1);
        return;
      }

      // Konwertuj nazwy kolumn na indeksy dla backend
      const indexMapping = {
        productName: previewData.availableColumns.indexOf(
          newMapping.productName || "",
        ),
        quantity: previewData.availableColumns.indexOf(
          newMapping.quantity || "",
        ),
        price: previewData.availableColumns.indexOf(newMapping.price || ""),
        ean: previewData.availableColumns.indexOf(newMapping.ean || ""),
        palette: previewData.availableColumns.indexOf(
          newMapping.paletteNumber || "",
        ), // Uwaga: paletteNumber -> palette
        asin: previewData.availableColumns.indexOf(newMapping.asin || ""),
        lpn: previewData.availableColumns.indexOf(newMapping.lpn || ""),
        condition: previewData.availableColumns.indexOf(
          newMapping.condition || "",
        ),
      };

      // Zamień -1 (nie znaleziono) na undefined lub -1 w zależności od potrzeby backend
      const cleanedMapping = Object.fromEntries(
        Object.entries(indexMapping).map(([key, value]) => [
          key,
          value >= 0 ? value : -1, // Backend oczekuje -1 dla brakujących kolumn
        ]),
      );

      previewFileMutation({ file, mapping: cleanedMapping });
    }
  };

  const handleFinalSubmit = (details: {
    deliveryNumber: string;
    financeData: {
      kurs_wymiany: number;
      procent_wartosci: number;
      stawka_vat: number;
      waluta: string;
    };
  }) => {
    if (!file || !previewData?.columnMapping) {
      toast.error("Brak pliku lub danych mapowania. Spróbuj ponownie.");
      return;
    }

    // Sprawdź czy plik jest nadal dostępny
    if (file.size === 0) {
      toast.error("Plik nie jest dostępny. Wybierz plik ponownie.");
      setFileInputKey((prev) => prev + 1);
      return;
    }

    console.log("Final submit with file:", {
      name: file.name,
      size: file.size,
      type: file.type,
      mapping: previewData.columnMapping,
      details,
    });

    createDeliveryMutation({
      file,
      mapping: previewData.columnMapping,
      deliveryNumber: details.deliveryNumber,
      financeData: details.financeData,
      supplierId: supplierId, // Przekaż ID dostawcy z hooka
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold dark:text-white">
          Dodaj Nową Dostawę
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Wybierz plik z danymi dostawy (np. Excel, CSV), a system spróbuje go
          automatycznie przetworzyć.
        </p>
        <div id="fileUpload" className="max-w-md">
          <FileInput
            id="file"
            onChange={handleFileChange}
            accept=".xls,.xlsx,.csv"
            disabled={isCreatingDelivery}
            key={fileInputKey}
          />
          <HelperText>Wybierz plik w formacie .xls, .xlsx lub .csv</HelperText>
        </div>
      </Card>

      {isLoading && (
        <div className="text-center">
          <Spinner aria-label="Ładowanie podglądu" size="xl" />
          <p>Przetwarzanie pliku...</p>
        </div>
      )}

      {error && (
        <Alert color="failure" icon={HiInformationCircle}>
          {error.message}
        </Alert>
      )}

      {previewData && (
        <div className="space-y-6">
          {previewData.analysisStatus === "BŁĄD" && (
            <Alert color="failure" icon={HiInformationCircle}>
              <h3 className="font-semibold">
                Wystąpiły błędy podczas przetwarzania pliku:
              </h3>
              <ul className="mt-2 list-inside list-disc">
                {previewData.validationDetails?.criticalErrors.map(
                  (err, index) => (
                    <li key={index}>
                      {err.message} (wiersz: {err.rowNumber || "N/A"})
                    </li>
                  ),
                )}
              </ul>
            </Alert>
          )}

          {previewData.analysisStatus === "WYMAGA_NUMERU_LOTU" && (
            <Alert color="warning" icon={HiInformationCircle}>
              <h3 className="font-semibold">Wymagany numer lotu</h3>
              <p className="mt-2">
                Nie wykryto numeru lotu w nazwie pliku. Proszę uzupełnić numer
                lotu w formularzu poniżej.
              </p>
            </Alert>
          )}

          {previewData.analysisStatus === "WYMAGA_DANYCH_FINANSOWYCH" && (
            <Alert color="info" icon={HiInformationCircle}>
              <h3 className="font-semibold">Gotowy do uzupełnienia</h3>
              <p className="mt-2">
                Plik został przeanalizowany pomyślnie. Uzupełnij numer lotu i
                dane finansowe w formularzu poniżej, aby utworzyć kompletną
                dostawę.
              </p>
            </Alert>
          )}

          {previewData.analysisStatus === "WYMAGA_MAPOWANIA" && (
            <ColumnMappingForm
              availableColumns={previewData.availableColumns}
              guessedMapping={{
                // Backend zwraca indeksy, ale musimy zmapować na nazwy kolumn
                productName:
                  previewData.columnMapping.productName >= 0
                    ? previewData.availableColumns[
                        previewData.columnMapping.productName
                      ] || ""
                    : "",
                quantity:
                  previewData.columnMapping.quantity >= 0
                    ? previewData.availableColumns[
                        previewData.columnMapping.quantity
                      ] || ""
                    : "",
                price:
                  previewData.columnMapping.price >= 0
                    ? previewData.availableColumns[
                        previewData.columnMapping.price
                      ] || ""
                    : "",
                ean:
                  previewData.columnMapping.ean >= 0
                    ? previewData.availableColumns[
                        previewData.columnMapping.ean
                      ] || ""
                    : "",
                paletteNumber:
                  previewData.columnMapping.palette >= 0
                    ? previewData.availableColumns[
                        previewData.columnMapping.palette
                      ] || ""
                    : "",
                asin:
                  previewData.columnMapping.asin >= 0
                    ? previewData.availableColumns[
                        previewData.columnMapping.asin
                      ] || ""
                    : "",
                lpn:
                  previewData.columnMapping.lpn >= 0
                    ? previewData.availableColumns[
                        previewData.columnMapping.lpn
                      ] || ""
                    : "",
                condition:
                  previewData.columnMapping.condition >= 0
                    ? previewData.availableColumns[
                        previewData.columnMapping.condition
                      ] || ""
                    : "",
              }}
              onConfirm={handleMappingConfirm}
            />
          )}

          {(previewData.analysisStatus === "SUKCES" ||
            previewData.analysisStatus === "WYMAGA_POTWIERDZENIA" ||
            previewData.analysisStatus === "WYMAGA_NUMERU_LOTU" ||
            previewData.analysisStatus === "WYMAGA_DANYCH_FINANSOWYCH") && (
            <DeliveryDetailsForm
              onSubmit={handleFinalSubmit}
              initialDeliveryNumber={previewData.deliveryNumber || ""}
              estimatedValue={previewData.estimatedValue || 0}
              totalProducts={previewData.totalProducts || 0}
            />
          )}

          {previewData.products && previewData.products.length > 0 && (
            <ProductDataTable products={previewData.products} />
          )}

          {isCreatingDelivery && (
            <div className="text-center">
              <Spinner aria-label="Tworzenie dostawy" size="xl" />
              <p>Tworzenie dostawy z danymi finansowymi...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupplierAddDeliveryPage;

// Named export dla spójności z innymi komponentami
export { SupplierAddDeliveryPage };
