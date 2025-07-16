import { type FC } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import { StaffLayout } from "@/layouts/StaffLayout";
import { SupplierLayout } from "@/layouts/SupplierLayout";
import { ProtectedRoute } from "@/components/authentication/ProtectedRoute";
import { PublicRoute } from "@/components/authentication/PublicRoute";
import RoleBasedRedirect from "@/components/authentication/RoleBasedRedirect";

// Authentication pages
import SignInBackgroundPage from "@/pages/authentication/sign-in-background";
import SignUpPage from "@/pages/authentication/sign-up";
import ForgotPasswordPage from "@/pages/authentication/forgot-password";
import ResetPasswordPage from "@/pages/authentication/reset-password";
import ProfileLockPage from "@/pages/authentication/profile-lock";

// Admin pages
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminLandingPage from "@/pages/admin/AdminLandingPage";
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";
import { AdminTablesPage } from "@/pages/admin/AdminTablesPage";
import { AdminAddDeliveryPage } from "@/pages/admin/AdminAddDeliveryPage";
import { ProductsListPage } from "@/pages/admin/ProductsListPage";
import { DeliveryProductsPage } from "@/pages/admin/DeliveryProductsPage";

// Staff pages
import StaffDashboardPage from "@/pages/staff/StaffDashboardPage";
import { StaffTasksPage } from "@/pages/staff/StaffTasksPage";
import { StaffAddDeliveryPage } from "@/pages/staff/StaffAddDeliveryPage";

// Supplier pages
import SupplierDashboardPage from "@/pages/supplier/SupplierDashboardPage";
import { SupplierDeliveriesPage } from "@/pages/supplier/SupplierDeliveriesPage";
import { SupplierAddDeliveryPage } from "@/pages/supplier/SupplierAddDeliveryPage";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication routes */}
        <Route path="/" element={<SignInBackgroundPage />} />
        <Route
          path="/authentication/sign-in"
          element={<SignInBackgroundPage />}
        />
        <Route path="/authentication/sign-up" element={<SignUpPage />} />
        <Route
          path="/authentication/forgot-password"
          element={<ForgotPasswordPage />}
        />
        <Route
          path="/authentication/reset-password"
          element={<ResetPasswordPage />}
        />
        <Route
          path="/authentication/profile-lock"
          element={<ProfileLockPage />}
        />

        {/* Role-based redirect */}
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
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/admin/landing"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminLandingPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminProductsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/list"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <ProductsListPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tables"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminTablesPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/deliveries"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminAddDeliveryPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/deliveries/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminAddDeliveryPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/deliveries/:id/products"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <DeliveryProductsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Staff routes */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffLayout>
                <StaffDashboardPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/staff/tasks"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffLayout>
                <StaffTasksPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/deliveries"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffLayout>
                <StaffAddDeliveryPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/deliveries/add"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffLayout>
                <StaffAddDeliveryPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />

        {/* Supplier routes */}
        <Route
          path="/supplier"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <SupplierLayout>
                <SupplierDashboardPage />
              </SupplierLayout>
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/supplier/deliveries"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <SupplierLayout>
                <SupplierDeliveriesPage />
              </SupplierLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/deliveries/add"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <SupplierLayout>
                <SupplierAddDeliveryPage />
              </SupplierLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
