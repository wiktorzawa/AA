import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const userRole = localStorage.getItem("userRole");

  if (!userRole || !allowedRoles.includes(userRole)) {
    // User not logged in or does not have the required role, redirect to login page
    return <Navigate to="/authentication/sign-in" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
