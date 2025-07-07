import type { FC } from "react";
import { useState } from "react";
import { FileInput, Card, Alert, Spinner, HelperText } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import * as deliveryApi from "../../api/deliveryApi";
import type { FilePreviewResponse, ColumnMapping } from "../../types/api.types";
import { ProductDataTable } from "../../ProductDataTable";
import { DeliveryDetailsForm } from "../../components/deliveries/DeliveryDetailsForm";
import { ColumnMappingForm } from "../../components/deliveries/ColumnMappingForm";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

const SupplierAddDeliveryPage: FC = () => {
  const [file, setFile] = useState<File | null>(null);
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
        "Plik został przeanalizowany. Sprawdź podgląd i potwierdź mapowanie.",
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewData(null);
      previewFileMutation({ file: selectedFile });
    }
  };

  const handleMappingConfirm = (newMapping: ColumnMapping) => {
    if (file) {
      previewFileMutation({ file, mapping: newMapping });
    }
  };

  const handleFinalSubmit = async (details: { deliveryNumber: string }) => {
    if (!file || !previewData?.columnMapping) return;
    try {
      await deliveryApi.uploadAndProcessFile(
        file,
        previewData.columnMapping,
        details.deliveryNumber,
      );
      toast.success("Dostawa została pomyślnie dodana!");
      setFile(null);
      setPreviewData(null);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Wystąpił błąd podczas finalnego zapisu dostawy.",
      );
    }
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

          {previewData.analysisStatus === "WYMAGA_MAPOWANIA" && (
            <ColumnMappingForm
              availableColumns={previewData.availableColumns}
              guessedMapping={previewData.columnMapping}
              onConfirm={handleMappingConfirm}
            />
          )}

          {previewData.products && previewData.products.length > 0 && (
            <ProductDataTable products={previewData.products} />
          )}

          {(previewData.analysisStatus === "SUKCES" ||
            previewData.analysisStatus === "WYMAGA_POTWIERDZENIA") && (
            <DeliveryDetailsForm
              onSubmit={handleFinalSubmit}
              initialDeliveryNumber={previewData.deliveryNumber || ""}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SupplierAddDeliveryPage;
