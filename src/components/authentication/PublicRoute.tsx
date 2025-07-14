import { type FC, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/constants";

interface PublicRouteProps {
  children: ReactNode;
}

export const PublicRoute: FC<PublicRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    // Jeśli użytkownik jest zalogowany, przekieruj go na stronę główną,
    // gdzie RoleBasedRedirect zdecyduje, co dalej.
    return <Navigate to={ROUTES.ROOT} replace />;
  }

  return <>{children}</>;
};
