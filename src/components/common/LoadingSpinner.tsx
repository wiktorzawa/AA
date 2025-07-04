import { Spinner } from "flowbite-react";
import type { FC } from "react";

export const LoadingSpinner: FC = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner size="xl" />
    </div>
  );
};
