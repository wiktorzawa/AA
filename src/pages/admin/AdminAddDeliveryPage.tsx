import {
  Alert,
  Card,
  FileInput,
  Label,
  Select,
  Spinner,
  HelperText,
} from "flowbite-react";
import type { FC } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HiInformationCircle } from "react-icons/hi";

import * as deliveryApi from "@/api/deliveryApi";
import { pobierzDostawcow } from "@/api/supplierApi";
import { ColumnMappingForm } from "@/components/deliveries/ColumnMappingForm";
import { DeliveryDetailsForm } from "@/components/deliveries/DeliveryDetailsForm";
import { ProductDataTable } from "@/ProductDataTable";
import { QUERY_KEYS } from "@/constants";
import type { FilePreviewResponse, ColumnMapping } from "@/types/api.types";

export const AdminAddDeliveryPage: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<FilePreviewResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState<string>("");

  const { data: suppliers, isLoading: isSuppliersLoading } = useQuery({
    queryKey: QUERY_KEYS.SUPPLIERS,
    queryFn: pobierzDostawcow,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!supplierId) {
        setError("Proszę najpierw wybrać dostawcę.");
        event.target.value = ""; // Reset file input
        return;
      }
      setFile(selectedFile);
      handlePreview(selectedFile);
    }
  };

  const handlePreview = async (
    fileToPreview: File,
    mapping?: ColumnMapping,
  ) => {
    setIsLoading(true);
    setError(null);
    setPreviewData(null);
    try {
      const data = await deliveryApi.previewFile(fileToPreview, mapping);
      setPreviewData(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Wystąpił nieoczekiwany błąd podczas podglądu pliku.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingConfirm = (newMapping: ColumnMapping) => {
    if (file) {
      handlePreview(file, newMapping);
    }
  };

  const handleFinalSubmit = async (details: { deliveryNumber: string }) => {
    if (!file || !previewData || !supplierId) return;
    setIsLoading(true);
    setError(null);
    try {
      await deliveryApi.uploadAndProcessFile(
        file,
        previewData.columnMapping,
        details.deliveryNumber,
        supplierId, // Przekazanie ID dostawcy
      );
      alert("Dostawa została pomyślnie dodana!");
      setFile(null);
      setPreviewData(null);
      // Opcjonalnie reset dostawcy: setSupplierId("");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Wystąpił błąd podczas finalnego zapisu dostawy.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold dark:text-white">
          Dodaj Nową Dostawę (Admin)
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="supplier">Wybierz dostawcę</Label>
            </div>
            <Select
              id="supplier"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              required
              disabled={isLoading || isSuppliersLoading}
            >
              <option value="" disabled>
                {isSuppliersLoading ? "Ładowanie..." : "-- Wybierz z listy --"}
              </option>
              {suppliers?.map((supplier) => (
                <option key={supplier.id_dostawcy} value={supplier.id_dostawcy}>
                  {supplier.nazwa_firmy}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="file">Wybierz plik z dostawą</Label>
            </div>
            <FileInput
              id="file"
              onChange={handleFileChange}
              accept=".xls,.xlsx,.csv"
              disabled={!supplierId || isLoading}
            />
            <HelperText>
              Najpierw wybierz dostawcę, następnie plik z dostawą.
            </HelperText>
          </div>
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
          {error}
        </Alert>
      )}

      {previewData && (
        <div className="space-y-6">
          {previewData.analysisStatus === "WYMAGA_MAPOWANIA" && (
            <ColumnMappingForm
              availableColumns={previewData.availableColumns}
              guessedMapping={{
                productName: previewData.columnMapping.productName || "",
                quantity: previewData.columnMapping.quantity || "",
                price: previewData.columnMapping.price || "",
                ean: previewData.columnMapping.ean || "",
                paletteNumber: previewData.columnMapping.paletteNumber || "",
                asin: previewData.columnMapping.asin || "",
                lpn: previewData.columnMapping.lpn || "",
                condition: previewData.columnMapping.condition || "",
              }}
              onConfirm={handleMappingConfirm}
            />
          )}

          {previewData.products.length > 0 && (
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

export default AdminAddDeliveryPage;
