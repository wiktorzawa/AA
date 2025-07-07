import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

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
  // 1. Pobieramy stan autoryzacji z naszego magazynu Zustand.
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // 2. Jeśli użytkownik NIE jest zalogowany, przekierowujemy go do strony logowania.
  if (!isAuthenticated) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  // 3. Jeśli użytkownik jest zalogowany, ale jego rola nie znajduje się
  //    w tablicy dozwolonych ról, przekierowujemy go na stronę główną.
  //    (user?.rola_uzytkownika to bezpieczne sprawdzenie, czy user istnieje)
  if (!user || !allowedRoles.includes(user.rola_uzytkownika)) {
    return <Navigate to="/" replace />;
  }

  // 4. Jeśli oba powyższe warunki są spełnione, renderujemy chronioną zawartość.
  return <>{children}</>;
};
