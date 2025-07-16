import { Button, Card } from "flowbite-react";
import { useAuthStore } from "../stores/authStore";
import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

/**
 * Komponent diagnostyczny do wyświetlania stanu autoryzacji
 */
export const DebugAuthStatus = () => {
  const { user, token, isAuthenticated } = useAuthStore();
  const [showTokens, setShowTokens] = useState(false);

  return (
    <Card className="mb-4 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-300">
          Debug: Status Autoryzacji
        </h3>
        <Button
          size="xs"
          color="light"
          onClick={() => setShowTokens(!showTokens)}
        >
          {showTokens ? (
            <HiEyeOff className="mr-2" />
          ) : (
            <HiEye className="mr-2" />
          )}
          {showTokens ? "Ukryj token" : "Pokaż token"}
        </Button>
      </div>

      <div className="space-y-1 text-sm">
        <p className="flex justify-between">
          <span className="font-semibold">Status:</span>
          <span className={isAuthenticated ? "text-green-600" : "text-red-600"}>
            {isAuthenticated ? "Zalogowany" : "Niezalogowany"}
          </span>
        </p>

        {user && (
          <>
            <p className="flex justify-between">
              <span className="font-semibold">Użytkownik:</span>
              <span>{user.email}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold">ID:</span>
              <span>{user.id}</span>
            </p>
          </>
        )}

        {showTokens && (
          <p className="flex flex-col">
            <span className="font-semibold">Token JWT:</span>
            <span className="mt-1 rounded bg-gray-100 p-1 text-xs break-all dark:bg-gray-800">
              {token || "Brak tokenu"}
            </span>
          </p>
        )}
      </div>
    </Card>
  );
};

export default DebugAuthStatus;
