import { type FC } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import { StaffLayout } from "@/layouts/StaffLayout";
import { SupplierLayout } from "@/layouts/SupplierLayout";
import { ProtectedRoute } from "@/components/authentication/ProtectedRoute";
import { PublicRoute } from "@/components/authentication/PublicRoute";
import RoleBasedRedirect from "@/components/authentication/RoleBasedRedirect";
import SignInBackgroundPage from "@/pages/authentication/sign-in-background";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import StaffDashboardPage from "@/pages/staff/StaffDashboardPage";
import SupplierDashboardPage from "@/pages/supplier/SupplierDashboardPage";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Strona logowania jako domyślna */}
        <Route path="/" element={<SignInBackgroundPage />} />

        {/* Role-based redirect na osobnej trasie */}
        <Route
          path="/home"
          element={
            <PublicRoute>
              <RoleBasedRedirect />
            </PublicRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        {/* Staff routes */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffLayout>
                <StaffDashboardPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        {/* Supplier routes */}
        <Route
          path="/supplier/dashboard"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <SupplierLayout>
                <SupplierDashboardPage />
              </SupplierLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
