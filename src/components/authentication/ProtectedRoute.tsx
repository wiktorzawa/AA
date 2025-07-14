import type { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
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
  const appRole = useAuthStore((state) => state.appRole);
  const location = useLocation();

  logger.info("[ProtectedRoute] render", {
    isAuthenticated,
    appRole,
    allowedRoles,
    currentPath: location.pathname,
  });

  if (!isAuthenticated) {
    logger.warn(
      "[ProtectedRoute] User not authenticated. Redirecting to sign-in.",
      {
        isAuthenticated,
        appRole,
        allowedRoles,
      },
    );
    return <Navigate to="/authentication/sign-in" replace />;
  }

  if (!appRole || !allowedRoles.includes(appRole)) {
    logger.warn(
      "[ProtectedRoute] User appRole not allowed. Redirecting to sign-in.",
      {
        isAuthenticated,
        appRole,
        allowedRoles,
      },
    );
    return <Navigate to="/authentication/sign-in" replace />;
  }

  logger.info("[ProtectedRoute] Access granted", {
    isAuthenticated,
    appRole,
    allowedRoles,
  });
  return <>{children}</>;
};
