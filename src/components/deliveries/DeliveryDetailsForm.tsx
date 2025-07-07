import { Button, Label, TextInput, Card } from "flowbite-react";
import type { FC } from "react";

interface DeliveryDetailsFormProps {
  onSubmit: (details: { deliveryNumber: string }) => void;
  initialDeliveryNumber?: string;
}

export const DeliveryDetailsForm: FC<DeliveryDetailsFormProps> = ({
  onSubmit,
  initialDeliveryNumber = "",
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const deliveryNumber = formData.get("deliveryNumber") as string;
    onSubmit({ deliveryNumber });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <h3 className="mb-4 text-xl font-semibold dark:text-white">
          Szczegóły Dostawy
        </h3>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Potwierdź lub wprowadź numer dostawy/lotu. Jest on kluczowy do
          identyfikacji tej dostawy w systemie.
        </p>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label
              htmlFor="deliveryNumber"
              className="mb-2 block dark:text-white"
            >
              Numer Dostawy / Lotu
            </Label>
            <TextInput
              id="deliveryNumber"
              name="deliveryNumber"
              placeholder="np. DOSTAWA-123, Lot-456"
              required
              defaultValue={initialDeliveryNumber}
            />
          </div>
        </div>
        <Button type="submit" className="mt-6">
          Potwierdź i Zapisz Dostawę
        </Button>
      </form>
    </Card>
  );
};
