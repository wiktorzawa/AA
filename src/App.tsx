import { type FC } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { AdminLayout } from "@/layouts/AdminLayout";
import { StaffLayout } from "@/layouts/StaffLayout";
import { SupplierLayout } from "@/layouts/SupplierLayout";
import { useAuthStore } from "@/stores/authStore";
import { logger } from "@/utils/logger";
import ForgotPasswordPage from "@/pages/authentication/forgot-password";
import ProfileLockPage from "@/pages/authentication/profile-lock";
import ResetPasswordPage from "@/pages/authentication/reset-password";
import SignInBackgroundPage from "@/pages/authentication/sign-in-background";
import SignUpPage from "@/pages/authentication/sign-up";

import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";
import { AdminTablesPage } from "@/pages/admin/AdminTablesPage";
import { AdminAddDeliveryPage } from "@/pages/admin/AdminAddDeliveryPage";
import StaffDashboardPage from "@/pages/staff/StaffDashboardPage";
import StaffTasksPage from "@/pages/staff/StaffTasksPage";
import { StaffAddDeliveryPage } from "@/pages/staff/StaffAddDeliveryPage";
import SupplierDashboardPage from "@/pages/supplier/SupplierDashboardPage";
import SupplierDeliveriesPage from "@/pages/supplier/SupplierDeliveriesPage";
import { SupplierAddDeliveryPage } from "@/pages/supplier/SupplierAddDeliveryPage";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

// Test import productData
import { productData } from "@/data/products";

const RoleBasedRedirect: FC = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  logger.info("RoleBasedRedirect", { user });

  if (!isAuthenticated || !user) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  switch (user.rola_uzytkownika) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "staff":
      return <Navigate to="/staff" replace />;
    case "supplier":
      return <Navigate to="/supplier" replace />;
    default:
      return <Navigate to="/authentication/sign-in" replace />;
  }
};

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication routes */}
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
        <Route path="/" element={<RoleBasedRedirect />} />

        {/* Admin routes */}
        <Route
          path="/test"
          element={
            <div style={{ padding: "20px", background: "red", color: "white" }}>
              TEST ROUTE WORKS!
            </div>
          }
        />

        <Route
          path="/test-productdata"
          element={
            <div style={{ padding: "20px" }}>
              <h1>Product Data Test</h1>
              <p>
                Product count: {productData ? productData.length : "undefined"}
              </p>
              <p>First product: {productData?.[0]?.name || "No data"}</p>
            </div>
          }
        />
        <Route
          path="/test-simple-dashboard"
          element={
            <div style={{ padding: "20px" }}>
              <h1>Simple Dashboard Test</h1>
              <p>If you see this, basic JSX works</p>
            </div>
          }
        />
        <Route
          path="/test-minimal-dashboard"
          element={
            <div
              style={{ padding: "20px", background: "green", color: "white" }}
            >
              <h1>Minimal Dashboard</h1>
              <p>Testing without imports</p>
            </div>
          }
        />
        <Route path="/test-dashboard" element={<AdminDashboardPage />} />
        <Route
          path="/test-layout"
          element={
            <AdminLayout>
              <div
                style={{ padding: "20px", background: "blue", color: "white" }}
              >
                LAYOUT TEST
              </div>
            </AdminLayout>
          }
        />
        <Route
          path="/admin-test"
          element={
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          }
        />
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
          path="/admin/deliveries"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <div>Wszystkie Dostawy</div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <div>Zarządzanie Użytkownikami</div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <div>Zarządzanie Personelem</div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/suppliers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <div>Zarządzanie Dostawcami</div>
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
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <div>Zamówienia</div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <div>Klienci</div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <div>Magazyn</div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <div>Raporty</div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/database"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <div>Baza Danych</div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <div>Ustawienia Systemu</div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tables/default"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <div>Default Table</div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tables/comparison"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <div>Comparison Table</div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Staff routes */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffLayout>
                <StaffDashboardPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffLayout>
                <StaffDashboardPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/tasks"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffLayout>
                <StaffTasksPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/deliveries/add"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffLayout>
                <StaffAddDeliveryPage />
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/deliveries"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffLayout>
                <div>Wszystkie Dostawy</div>
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/tasks/assigned"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffLayout>
                <div>Przypisane do Mnie</div>
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/tasks/completed"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffLayout>
                <div>Ukończone Zadania</div>
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/orders"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffLayout>
                <div>Wszystkie Zamówienia</div>
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/orders/processing"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffLayout>
                <div>Zamówienia W Realizacji</div>
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/orders/shipped"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffLayout>
                <div>Zamówienia Wysłane</div>
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/reports"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffLayout>
                <div>Raporty</div>
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/profile"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffLayout>
                <div>Mój Profil</div>
              </StaffLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/settings"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffLayout>
                <div>Ustawienia</div>
              </StaffLayout>
            </ProtectedRoute>
          }
        />

        {/* Supplier routes */}
        <Route
          path="/supplier"
          element={
            <ProtectedRoute allowedRoles={["supplier", "admin"]}>
              <SupplierLayout>
                <SupplierDashboardPage />
              </SupplierLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/dashboard"
          element={
            <ProtectedRoute allowedRoles={["supplier", "admin"]}>
              <SupplierLayout>
                <SupplierDashboardPage />
              </SupplierLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/deliveries"
          element={
            <ProtectedRoute allowedRoles={["supplier", "admin"]}>
              <SupplierLayout>
                <SupplierDeliveriesPage />
              </SupplierLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/deliveries/add"
          element={
            <ProtectedRoute allowedRoles={["supplier", "admin"]}>
              <SupplierLayout>
                <SupplierAddDeliveryPage />
              </SupplierLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/deliveries/pending"
          element={
            <ProtectedRoute allowedRoles={["supplier", "admin"]}>
              <SupplierLayout>
                <div>Dostawy Oczekujące</div>
              </SupplierLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/deliveries/completed"
          element={
            <ProtectedRoute allowedRoles={["supplier", "admin"]}>
              <SupplierLayout>
                <div>Dostawy Zrealizowane</div>
              </SupplierLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/products"
          element={
            <ProtectedRoute allowedRoles={["supplier", "admin"]}>
              <SupplierLayout>
                <div>Katalog Produktów</div>
              </SupplierLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/products/inventory"
          element={
            <ProtectedRoute allowedRoles={["supplier", "admin"]}>
              <SupplierLayout>
                <div>Stan Magazynowy</div>
              </SupplierLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/products/pricing"
          element={
            <ProtectedRoute allowedRoles={["supplier", "admin"]}>
              <SupplierLayout>
                <div>Cennik</div>
              </SupplierLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/profile"
          element={
            <ProtectedRoute allowedRoles={["supplier", "admin"]}>
              <SupplierLayout>
                <div>Mój Profil</div>
              </SupplierLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/settings"
          element={
            <ProtectedRoute allowedRoles={["supplier", "admin"]}>
              <SupplierLayout>
                <div>Ustawienia</div>
              </SupplierLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
