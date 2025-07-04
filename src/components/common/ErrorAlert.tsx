import { Alert } from "flowbite-react";
import type { FC } from "react";
import { HiX } from "react-icons/hi";

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorAlert: FC<ErrorAlertProps> = ({ message, onDismiss }) => {
  return (
    <Alert color="failure" onDismiss={onDismiss} className="my-4">
      <div className="flex items-center">
        <HiX className="h-5 w-5" />
        <span className="ml-2 font-medium">{message}</span>
      </div>
    </Alert>
  );
};
