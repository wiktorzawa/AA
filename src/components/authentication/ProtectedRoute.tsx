import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "flowbite-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Pokaż spinner podczas ładowania
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  // Jeśli użytkownik nie jest zalogowany, przekieruj do logowania
  if (!isAuthenticated || !user) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  // Sprawdź czy użytkownik ma odpowiednią rolę
  if (!allowedRoles.includes(user.rola_uzytkownika)) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
