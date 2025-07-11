import { Button, Label, TextInput, Card, Select, Alert } from "flowbite-react";
import type { FC } from "react";
import { useState } from "react";
import { HiInformationCircle } from "react-icons/hi";

interface DeliveryDetailsFormProps {
  onSubmit: (details: {
    deliveryNumber: string;
    financeData: {
      kurs_wymiany: number;
      procent_wartosci: number;
      stawka_vat: number;
      waluta: string;
    };
  }) => void;
  initialDeliveryNumber?: string;
  estimatedValue?: number;
  totalProducts?: number;
}

export const DeliveryDetailsForm: FC<DeliveryDetailsFormProps> = ({
  onSubmit,
  initialDeliveryNumber = "",
  estimatedValue = 0,
  totalProducts = 0,
}) => {
  const [formData, setFormData] = useState({
    deliveryNumber: initialDeliveryNumber,
    kurs_wymiany: "",
    procent_wartosci: "",
    stawka_vat: "0.23",
    waluta: "EUR",
  });

  const [preview, setPreview] = useState<{
    wartosc_ze_specyfikacji_suma: number;
    wartosc_ze_specyfikacji_suma_pln: number;
    koszt_netto: number;
    koszt_brutto: number;
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Oblicz podgląd kalkulacji
    if (estimatedValue > 0) {
      const kurs = parseFloat(newFormData.kurs_wymiany) || 0;
      const procent = parseFloat(newFormData.procent_wartosci) || 0;
      const vat = parseFloat(newFormData.stawka_vat) || 0;

      const wartosc_ze_specyfikacji_suma = estimatedValue;
      const wartosc_ze_specyfikacji_suma_pln = estimatedValue * kurs;
      const koszt_netto = wartosc_ze_specyfikacji_suma_pln * procent;
      const koszt_brutto = koszt_netto * (1 + vat);

      setPreview({
        wartosc_ze_specyfikacji_suma,
        wartosc_ze_specyfikacji_suma_pln,
        koszt_netto,
        koszt_brutto,
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const financeData = {
      kurs_wymiany: parseFloat(formData.kurs_wymiany),
      procent_wartosci: parseFloat(formData.procent_wartosci),
      stawka_vat: parseFloat(formData.stawka_vat),
      waluta: formData.waluta,
    };

    onSubmit({
      deliveryNumber: formData.deliveryNumber,
      financeData,
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <h3 className="mb-4 text-xl font-semibold dark:text-white">
          Szczegóły Dostawy i Dane Finansowe
        </h3>

        <Alert color="info" icon={HiInformationCircle} className="mb-6">
          <span className="font-medium">Wymagane dane!</span>
          <p className="mt-2 text-sm">
            Potwierdź numer lotu i uzupełnij dane finansowe. Wszystkie pola są
            wymagane do utworzenia dostawy i kalkulacji kosztów.
          </p>
        </Alert>

        {/* Sekcja szczegółów dostawy */}
        <div className="mb-8">
          <h4 className="mb-4 text-lg font-medium dark:text-white">
            1. Szczegóły Dostawy
          </h4>

          {estimatedValue > 0 && (
            <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Liczba produktów:
                  </span>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                    {totalProducts}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Wartość ze specyfikacji (suma):
                  </span>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                    {estimatedValue.toFixed(2)} EUR
                  </span>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label
              htmlFor="deliveryNumber"
              className="mb-2 block dark:text-white"
            >
              Numer Lotu
            </Label>
            <TextInput
              id="deliveryNumber"
              name="deliveryNumber"
              placeholder="np. PL10023419, LH456, CARGO123"
              required
              value={formData.deliveryNumber}
              onChange={(e) =>
                handleInputChange("deliveryNumber", e.target.value)
              }
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Numer lotu jest kluczowy do identyfikacji dostawy w systemie
            </p>
          </div>
        </div>

        {/* Sekcja danych finansowych */}
        <div className="mb-8">
          <h4 className="mb-4 text-lg font-medium dark:text-white">
            2. Dane Finansowe
          </h4>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="waluta" className="mb-2 block dark:text-white">
                Waluta (z Unit retail)
              </Label>
              <Select
                id="waluta"
                name="waluta"
                value={formData.waluta}
                onChange={(e) => handleInputChange("waluta", e.target.value)}
                required
              >
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - Dolar amerykański</option>
                <option value="GBP">GBP - Funt brytyjski</option>
                <option value="PLN">PLN - Złoty polski</option>
              </Select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Waluta cen produktów w pliku dostawcy
              </p>
            </div>

            <div>
              <Label
                htmlFor="kurs_wymiany"
                className="mb-2 block dark:text-white"
              >
                Kurs wymiany na PLN
              </Label>
              <TextInput
                id="kurs_wymiany"
                name="kurs_wymiany"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="np. 4.36"
                value={formData.kurs_wymiany}
                onChange={(e) =>
                  handleInputChange("kurs_wymiany", e.target.value)
                }
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Aktualny kurs wymiany {formData.waluta} → PLN
              </p>
            </div>

            <div>
              <Label
                htmlFor="procent_wartosci"
                className="mb-2 block dark:text-white"
              >
                Procent wartości sprzedaży
              </Label>
              <TextInput
                id="procent_wartosci"
                name="procent_wartosci"
                type="number"
                step="0.01"
                min="0.01"
                max="1"
                placeholder="np. 0.18"
                value={formData.procent_wartosci}
                onChange={(e) =>
                  handleInputChange("procent_wartosci", e.target.value)
                }
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Procent wartości sprzedaży (np. 0.18 = 18%)
              </p>
            </div>

            <div>
              <Label
                htmlFor="stawka_vat"
                className="mb-2 block dark:text-white"
              >
                Stawka VAT
              </Label>
              <TextInput
                id="stawka_vat"
                name="stawka_vat"
                type="number"
                step="0.01"
                min="0"
                max="1"
                placeholder="np. 0.23"
                value={formData.stawka_vat}
                onChange={(e) =>
                  handleInputChange("stawka_vat", e.target.value)
                }
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Stawka podatku VAT (np. 0.23 = 23%)
              </p>
            </div>
          </div>
        </div>

        {/* Podgląd kalkulacji */}
        {preview && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <h4 className="mb-3 font-medium text-blue-900 dark:text-blue-100">
              Podgląd Kalkulacji Finansowej
            </h4>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Wartość ze specyfikacji (suma):
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {preview.wartosc_ze_specyfikacji_suma.toFixed(2)}{" "}
                    {formData.waluta}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Wartość ze specyfikacji (suma PLN):
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {preview.wartosc_ze_specyfikacji_suma_pln.toFixed(2)} PLN
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Koszt netto:
                  </span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {preview.koszt_netto.toFixed(2)} PLN
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Koszt brutto:
                  </span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {preview.koszt_brutto.toFixed(2)} PLN
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <Button type="submit" className="mt-6 w-full">
          Potwierdź i Utwórz Dostawę z Danymi Finansowymi
        </Button>
      </form>
    </Card>
  );
};
