import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
