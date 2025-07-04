import type { FC } from "react";
import { useState } from "react";
import { Button, Card, Label, Alert, FileInput } from "flowbite-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiCloudUpload, HiCheck, HiX } from "react-icons/hi";
import { useAuthStore } from "../../stores/authStore";
import { uploadDeliveryFile } from "../../api/deliveryApi";
import { logger } from "../../utils/logger";

export const SupplierAddDeliveryPage: FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const user = useAuthStore((state) => state.user);

  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: uploadDeliveryFile,
    onSuccess: (result) => {
      logger.info("SupplierUpload: Upload zakończony sukcesem", { result });
      setUploadSuccess(true);
      setSelectedFiles([]);

      // Unieważnienie zapytań deliveries - automatyczne odświeżenie listy dostaw
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });

      // Ukrycie komunikatu sukcesu po 5 sekundach
      setTimeout(() => setUploadSuccess(false), 5000);
    },
    onError: (error) => {
      logger.error("SupplierUpload: Błąd uploadu", { error });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const excelFiles = files.filter(
        (file) =>
          file.type === "application/vnd.ms-excel" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "application/vnd.ms-excel.sheet.macroEnabled.12" ||
          file.name.endsWith(".xls") ||
          file.name.endsWith(".xlsx") ||
          file.name.endsWith(".xlsm"),
      );

      if (excelFiles.length !== files.length) {
        // Można dodać toast notification lub inny sposób powiadomienia
        console.warn("Tylko pliki Excel są dozwolone");
        return;
      }

      setSelectedFiles((prev) => [...prev, ...excelFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      console.warn("Proszę wybrać przynajmniej jeden plik Excel");
      return;
    }

    if (!user) {
      console.error("Brak zalogowanego użytkownika, nie można wysłać pliku.");
      return;
    }

    // Przesyłanie pierwszego pliku przez useMutation
    logger.info("SupplierUpload: Rozpoczynam upload pliku", {
      fileName: selectedFiles[0].name,
      supplierId: user.id_uzytkownika,
    });

    uploadMutation.mutate({
      file: selectedFiles[0],
      supplierId: user.id_uzytkownika,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dodaj Nową Dostawę
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Prześlij pliki Excel z danymi dostawy
          </p>
        </div>

        {uploadSuccess && (
          <Alert color="success" className="mb-6">
            <HiCheck className="h-4 w-4" />
            <span className="ml-2">
              Dostawa została pomyślnie dodana do systemu!
            </span>
          </Alert>
        )}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dropzone - Flowbite Pro Pattern */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Pliki Excel dostawy
              </h3>

              <div className="flex w-full items-center justify-center">
                <Label
                  htmlFor="dropzone-file"
                  className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <HiCloudUpload className="mb-3 h-10 w-10 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">
                        Kliknij aby przesłać
                      </span>{" "}
                      lub przeciągnij i upuść
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Tylko pliki Excel: XLS, XLSX, XLSM (MAX. 50MB na plik)
                    </p>
                  </div>
                  <FileInput
                    id="dropzone-file"
                    className="hidden"
                    multiple
                    accept=".xls,.xlsx,.xlsm"
                    onChange={handleFileSelect}
                  />
                </Label>
              </div>

              {uploadMutation.isError && (
                <Alert color="failure" className="mt-4">
                  <HiX className="h-4 w-4" />
                  <span className="ml-2">
                    {uploadMutation.error instanceof Error
                      ? uploadMutation.error.message
                      : "Wystąpił błąd podczas przesyłania pliku"}
                  </span>
                </Alert>
              )}

              {/* Lista wybranych plików */}
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Wybrane pliki ({selectedFiles.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                {file.name.split(".").pop()?.toUpperCase() ||
                                  "XLS"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => removeFile(index)}
                          disabled={uploadMutation.isPending}
                        >
                          <HiX className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Przyciski akcji */}
            <div className="flex justify-end space-x-4 border-t pt-6 dark:border-gray-700">
              <Button
                type="button"
                color="gray"
                disabled={uploadMutation.isPending}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                disabled={
                  uploadMutation.isPending || selectedFiles.length === 0
                }
              >
                {uploadMutation.isPending ? "Przesyłanie..." : "Dodaj Dostawę"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
