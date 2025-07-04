import {
  Alert,
  Button,
  Card,
  FileInput,
  Label,
  Select,
  Textarea,
  TextInput,
  Spinner,
} from "flowbite-react";
import { useState, useEffect, type FC } from "react";
import { HiCheck, HiX } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import { pobierzDostawcow } from "@/api/supplierApi";
import { QUERY_KEYS } from "@/constants";
import { useAuthStore } from "../../stores/authStore";
import { previewDeliveryFile, uploadDeliveryFile } from "@/api/deliveryApi";
import { logger } from "@/utils/logger";

// Interface dla danych podglądu dostawy
interface DeliveryPreviewData {
  fileName: string;
  detectedDeliveryNumber?: string;
  totalProducts: number;
  estimatedValue?: number;
  validationWarnings?: string[];
  status?: string;
}

export const AdminAddDeliveryPage: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState<string>("");
  const [deliveryNotes, setDeliveryNotes] = useState<string>("");
  const [previewData, setPreviewData] = useState<DeliveryPreviewData | null>(
    null,
  );
  const [confirmDeliveryNumber, setConfirmDeliveryNumber] =
    useState<string>("");

  const user = useAuthStore((state) => state.user);

  // Pobieranie listy dostawców z API
  const {
    data: suppliers,
    isLoading: isSuppliersLoading,
    isError: isSuppliersError,
  } = useQuery({
    queryKey: QUERY_KEYS.SUPPLIERS,
    queryFn: pobierzDostawcow,
  });

  useEffect(() => {
    // Jeśli zalogowany jest dostawca, automatycznie ustaw jego ID
    // Wykonaj to po pomyślnym załadowaniu danych dostawców
    if (user?.rola_uzytkownika === "supplier" && suppliers) {
      setSupplierId(user.id_uzytkownika);
    }
  }, [user, suppliers]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
    ];
    if (
      !allowedTypes.includes(file.type) &&
      !/\.(xls|xlsx|xlsm)$/i.test(file.name)
    ) {
      setUploadError("Tylko pliki Excel (.xls, .xlsx, .xlsm) są dozwolone.");
      return;
    }

    setFile(file);
    setUploadError(null);
    setPreviewData(null);
    setIsProcessing(true);

    try {
      const result = await previewDeliveryFile(file);
      if (result.success) {
        setPreviewData(result.data);
        if (result.data?.status === "requires_manual_input") {
          setUploadError(
            "Nie udało się automatycznie wykryć numeru dostawy. Wprowadź go ręcznie.",
          );
        }
      } else {
        setUploadError(result.error || "Błąd podczas analizy pliku.");
      }
    } catch {
      setUploadError("Wystąpił krytyczny błąd podczas przetwarzania pliku.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !supplierId) {
      setUploadError("Proszę wybrać plik i dostawcę.");
      return;
    }
    if (
      previewData?.status === "requires_manual_input" &&
      !confirmDeliveryNumber
    ) {
      setUploadError("Proszę potwierdzić numer dostawy.");
      return;
    }

    setIsProcessing(true);
    setUploadError(null);

    try {
      const result = await uploadDeliveryFile({
        file: file,
        supplierId: supplierId,
        confirmDeliveryNumber: confirmDeliveryNumber || undefined,
      });

      if (result.success) {
        setUploadSuccess(true);
        setFile(null);
        setPreviewData(null);
        setConfirmDeliveryNumber("");
        setDeliveryNotes("");
        setTimeout(() => setUploadSuccess(false), 5000);
      } else {
        setUploadError(
          result.error || "Wystąpił błąd podczas przesyłania pliku.",
        );
      }
    } catch (error) {
      logger.error("Upload failed", { error });
      setUploadError("Wystąpił krytyczny błąd serwera.");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderFilePreview = () => (
    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        Podgląd Pliku
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <p>
          <span className="font-semibold">Nazwa Pliku:</span>{" "}
          {previewData.fileName}
        </p>
        <p>
          <span className="font-semibold">Wykryty Nr Dostawy:</span>{" "}
          {previewData.detectedDeliveryNumber || "Brak"}
        </p>
        <p>
          <span className="font-semibold">Liczba Produktów:</span>{" "}
          {previewData.totalProducts}
        </p>
        <p>
          <span className="font-semibold">Szacowana Wartość:</span>{" "}
          {previewData.estimatedValue?.toFixed(2)} EUR
        </p>
      </div>
      {previewData.validationWarnings?.length > 0 && (
        <Alert color="warning" withBorderAccent className="mt-4">
          <h3 className="font-semibold">Sugestie:</h3>
          <ul className="list-inside list-disc">
            {previewData.validationWarnings.map((warn: string, i: number) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </Alert>
      )}
    </div>
  );

  return (
    <section className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Dodaj Nową Dostawę
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Prześlij plik Excel, aby zaimportować dane nowej dostawy do systemu.
        </p>

        {uploadSuccess && (
          <Alert
            color="success"
            onDismiss={() => setUploadSuccess(false)}
            className="mb-6"
          >
            <HiCheck className="h-5 w-5" />
            <span className="ml-2 font-medium">
              Dostawa została pomyślnie dodana!
            </span>
          </Alert>
        )}
        {uploadError && (
          <Alert
            color="failure"
            onDismiss={() => setUploadError(null)}
            className="mb-6"
          >
            <HiX className="h-5 w-5" />
            <span className="ml-2 font-medium">{uploadError}</span>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Sekcja Wyboru Dostawcy */}
              <div className="md:col-span-2">
                <Label
                  htmlFor="supplier"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Wybierz dostawcę
                </Label>
                <Select
                  id="supplier"
                  required
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  disabled={
                    isProcessing ||
                    isSuppliersLoading ||
                    user?.rola_uzytkownika === "supplier"
                  }
                >
                  <option value="" disabled>
                    {isSuppliersLoading
                      ? "Ładowanie..."
                      : "-- Wybierz z listy --"}
                  </option>
                  {suppliers?.map((supplier) => (
                    <option
                      key={supplier.id_dostawcy}
                      value={supplier.id_dostawcy}
                    >
                      {supplier.nazwa_firmy}
                    </option>
                  ))}
                </Select>
                {isSuppliersError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Błąd podczas ładowania listy dostawców
                  </p>
                )}
              </div>

              {/* Sekcja Uploadu Pliku */}
              <div className="md:col-span-2">
                <Label
                  htmlFor="file-upload"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Plik dostawy
                </Label>
                <FileInput
                  id="file-upload"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  Tylko pliki Excel: XLS, XLSX, XLSM (MAX. 10MB)
                </p>
              </div>

              {isProcessing && !previewData && (
                <p className="text-center md:col-span-2">
                  Analizowanie pliku...
                </p>
              )}

              {previewData && (
                <div className="md:col-span-2">{renderFilePreview()}</div>
              )}

              {previewData?.status === "requires_manual_input" && (
                <div className="md:col-span-2">
                  <Label
                    htmlFor="confirm-delivery-number"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Potwierdź numer dostawy
                  </Label>
                  <TextInput
                    id="confirm-delivery-number"
                    placeholder="Wprowadź numer dostawy, np. PL12345678"
                    value={confirmDeliveryNumber}
                    onChange={(e) => setConfirmDeliveryNumber(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Sekcja Uwag */}
              <div className="md:col-span-2">
                <Label
                  htmlFor="delivery-notes"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Uwagi do dostawy (opcjonalnie)
                </Label>
                <Textarea
                  id="delivery-notes"
                  placeholder="Dodaj dodatkowe informacje dotyczące tej dostawy..."
                  rows={4}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            </div>

            {/* Przyciski Akcji */}
            <div className="mt-6 flex items-center justify-end space-x-4 border-t border-gray-200 pt-4 dark:border-gray-700">
              <Button type="button" color="gray" disabled={isProcessing}>
                Anuluj
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing && <Spinner size="sm" className="mr-3" />}
                Zatwierdź dostawę
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </section>
  );
};
