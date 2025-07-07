import type { FC } from "react";
import { useState, useEffect } from "react";
import { Select, Card, Button } from "flowbite-react";

const MAPPABLE_FIELDS = {
  productName: "Nazwa Produktu (wymagane)",
  quantity: "Ilość (wymagane)",
  price: "Cena (wymagane)",
  ean: "Kod EAN",
  paletteNumber: "Numer Palety",
  asin: "ASIN",
  lpn: "LPN",
  condition: "Stan produktu",
};

type Mapping = Partial<Record<keyof typeof MAPPABLE_FIELDS, string>>;

interface ColumnMappingFormProps {
  availableColumns: string[];
  guessedMapping: Mapping;
  onConfirm: (mapping: Mapping) => void;
}

export const ColumnMappingForm: FC<ColumnMappingFormProps> = ({
  availableColumns,
  guessedMapping,
  onConfirm,
}) => {
  const [currentMapping, setCurrentMapping] = useState<Mapping>(guessedMapping);

  useEffect(() => {
    setCurrentMapping(guessedMapping);
  }, [guessedMapping]);

  const handleMappingChange = (field: string, value: string) => {
    setCurrentMapping((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="mb-6">
      <h3 className="mb-2 text-xl font-semibold dark:text-white">
        Mapowanie Kolumn
      </h3>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        System nie był w stanie automatycznie rozpoznać wszystkich kolumn.
        Sprawdź i przypisz poniższe pola do odpowiednich kolumn z Twojego pliku.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.entries(MAPPABLE_FIELDS).map(([field, label]) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              {label}
            </label>
            <Select
              id={field}
              value={currentMapping[field as keyof Mapping] || ""}
              onChange={(e) => handleMappingChange(field, e.target.value)}
            >
              <option value="">-- Wybierz kolumnę --</option>
              {availableColumns.map((col, index) => (
                <option key={`${col}-${index}`} value={col}>
                  {col}
                </option>
              ))}
            </Select>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={() => onConfirm(currentMapping)}>
          Zastosuj i Przetwórz Ponownie
        </Button>
      </div>
    </Card>
  );
};
