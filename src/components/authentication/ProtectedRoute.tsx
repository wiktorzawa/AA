import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { logger } from "@/utils/logger";

/**
 * Props dla komponentu ProtectedRoute.
 * @param children - Komponenty React, które mają być renderowane, jeśli użytkownik ma dostęp.
 * @param allowedRoles - Tablica ról (stringów), które mają dostęp do danej trasy.
 */
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

/**
 * Komponent-wrapper, który chroni trasy w aplikacji.
 * Sprawdza, czy użytkownik jest zalogowany i czy jego rola
 * pasuje do jednej z dozwolonych ról.
 */
export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    logger.warn(
      "ProtectedRoute: User not authenticated. Redirecting to sign-in.",
    );
    return <Navigate to="/authentication/sign-in" replace />;
  }

  const userRole = user?.role?.name?.toLowerCase();

  if (!userRole || !allowedRoles.includes(userRole)) {
    logger.warn("ProtectedRoute: User role not allowed. Redirecting to root.", {
      userRole,
      allowedRoles,
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
