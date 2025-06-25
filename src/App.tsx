import { type FC } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import ProtectedRoute from "@components/authentication/ProtectedRoute";

import ForgotPasswordPage from "@pages/authentication/forgot-password";
import ProfileLockPage from "@pages/authentication/profile-lock";
import ResetPasswordPage from "@pages/authentication/reset-password";
import SignInBackgroundPage from "@pages/authentication/sign-in-background";
import SignUpPage from "@pages/authentication/sign-up";

import AdminDashboardPage from "@pages/admin/AdminDashboardPage";
import { AdminProductsPage } from "@pages/admin/AdminProductsPage";
import { AdminTablesPage } from "@pages/admin/AdminTablesPage";
import StaffDashboardPage from "@pages/staff/StaffDashboardPage";
import SupplierDashboardPage from "@pages/supplier/SupplierDashboardPage";

// Komponent do przekierowania na podstawie roli
const RoleBasedRedirect: FC = () => {
  const userRole = localStorage.getItem("userRole");

  switch (userRole) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "staff":
      return <Navigate to="/staff/dashboard" replace />;
    case "supplier":
      return <Navigate to="/supplier/dashboard" replace />;
    default:
      return <Navigate to="/authentication/sign-in" replace />;
  }
};

const App: FC = function () {
  return (
    <BrowserRouter>
      <Routes>
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

        {/* Root Route - Przekierowanie na podstawie roli */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff", "supplier"]}>
              <RoleBasedRedirect />
            </ProtectedRoute>
          }
        />

        {/* Admin Module Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminDashboardPage />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="tables" element={<AdminTablesPage />} />
                  <Route
                    path="users"
                    element={<div>Zarządzanie Użytkownikami</div>}
                  />
                  <Route
                    path="staff"
                    element={<div>Zarządzanie Personelem</div>}
                  />
                  <Route
                    path="suppliers"
                    element={<div>Zarządzanie Dostawcami</div>}
                  />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="orders" element={<div>Zamówienia</div>} />
                  <Route path="customers" element={<div>Klienci</div>} />
                  <Route path="inventory" element={<div>Magazyn</div>} />
                  <Route path="reports" element={<div>Raporty</div>} />
                  <Route path="database" element={<div>Baza Danych</div>} />
                  <Route
                    path="settings"
                    element={<div>Ustawienia Systemu</div>}
                  />
                  <Route
                    path="tables/default"
                    element={<div>Default Table</div>}
                  />
                  <Route
                    path="tables/comparison"
                    element={<div>Comparison Table</div>}
                  />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Staff Module Routes */}
        <Route
          path="/staff/*"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <DashboardLayout userRole="staff">
                <Routes>
                  <Route path="dashboard" element={<StaffDashboardPage />} />
                  <Route path="tasks" element={<div>Moje Zadania</div>} />
                  <Route
                    path="orders/new"
                    element={<div>Nowe Zamówienia</div>}
                  />
                  <Route
                    path="orders/processing"
                    element={<div>Zamówienia W Realizacji</div>}
                  />
                  <Route
                    path="orders/completed"
                    element={<div>Zamówienia Zakończone</div>}
                  />
                  <Route path="inventory" element={<div>Magazyn</div>} />
                  <Route path="reports" element={<div>Raporty</div>} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Supplier Module Routes */}
        <Route
          path="/supplier/*"
          element={
            <ProtectedRoute allowedRoles={["supplier", "admin"]}>
              <DashboardLayout userRole="supplier">
                <Routes>
                  <Route path="dashboard" element={<SupplierDashboardPage />} />
                  <Route path="deliveries" element={<div>Moje Dostawy</div>} />
                  <Route path="products" element={<div>Lista Produktów</div>} />
                  <Route
                    path="products/add"
                    element={<div>Dodaj Produkt</div>}
                  />
                  <Route
                    path="inventory"
                    element={<div>Stan Magazynowy</div>}
                  />
                  <Route path="orders" element={<div>Zamówienia</div>} />
                  <Route path="invoices" element={<div>Faktury</div>} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
