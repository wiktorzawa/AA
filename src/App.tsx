import { type FC } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { AdminLayout } from "@/layouts/AdminLayout";
import { StaffLayout } from "@/layouts/StaffLayout";
import { SupplierLayout } from "@/layouts/SupplierLayout";
import ProtectedRoute from "@components/authentication/ProtectedRoute";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import ForgotPasswordPage from "@pages/authentication/forgot-password";
import ProfileLockPage from "@pages/authentication/profile-lock";
import ResetPasswordPage from "@pages/authentication/reset-password";
import SignInBackgroundPage from "@pages/authentication/sign-in-background";
import SignUpPage from "@pages/authentication/sign-up";

import AdminDashboardPage from "@pages/admin/AdminDashboardPage";
import { AdminProductsPage } from "@pages/admin/AdminProductsPage";
import { AdminTablesPage } from "@pages/admin/AdminTablesPage";
import { AdminAddDeliveryPage } from "@pages/admin/AdminAddDeliveryPage";

import StaffDashboardPage from "@pages/staff/StaffDashboardPage";
import StaffTasksPage from "@pages/staff/StaffTasksPage";
import { StaffAddDeliveryPage } from "@pages/staff/StaffAddDeliveryPage";

import SupplierDashboardPage from "@pages/supplier/SupplierDashboardPage";
import SupplierDeliveriesPage from "@pages/supplier/SupplierDeliveriesPage";
import { SupplierAddDeliveryPage } from "@pages/supplier/SupplierAddDeliveryPage";

import { NeonThemeDemo } from "@components/blocks/NeonThemeDemo";

// Komponent do przekierowania na podstawie roli
const RoleBasedRedirect: FC = () => {
  const { user, isAuthenticated } = useAuth();

  console.log("RoleBasedRedirect - user:", user);

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

const App: FC = function () {
  return (
    <AuthProvider>
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

          {/* Neon Theme Demo - Dostępne bez autoryzacji */}
          <Route path="/neon-demo" element={<NeonThemeDemo />} />

          {/* Root Route - Przekierowanie na podstawie roli */}
          <Route path="/" element={<RoleBasedRedirect />} />

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
                      path="deliveries/add"
                      element={<AdminAddDeliveryPage />}
                    />
                    <Route
                      path="deliveries"
                      element={<div>Wszystkie Dostawy</div>}
                    />
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
                <StaffLayout>
                  <Routes>
                    <Route path="/" element={<StaffDashboardPage />} />
                    <Route path="dashboard" element={<StaffDashboardPage />} />
                    <Route path="tasks" element={<StaffTasksPage />} />
                    <Route
                      path="deliveries/add"
                      element={<StaffAddDeliveryPage />}
                    />
                    <Route
                      path="deliveries"
                      element={<div>Wszystkie Dostawy</div>}
                    />
                    <Route
                      path="tasks/assigned"
                      element={<div>Przypisane do Mnie</div>}
                    />
                    <Route
                      path="tasks/completed"
                      element={<div>Ukończone Zadania</div>}
                    />
                    <Route
                      path="orders"
                      element={<div>Wszystkie Zamówienia</div>}
                    />
                    <Route
                      path="orders/processing"
                      element={<div>Zamówienia W Realizacji</div>}
                    />
                    <Route
                      path="orders/shipped"
                      element={<div>Zamówienia Wysłane</div>}
                    />
                    <Route path="reports" element={<div>Raporty</div>} />
                    <Route path="profile" element={<div>Mój Profil</div>} />
                    <Route path="settings" element={<div>Ustawienia</div>} />
                  </Routes>
                </StaffLayout>
              </ProtectedRoute>
            }
          />

          {/* Supplier Module Routes */}
          <Route
            path="/supplier/*"
            element={
              <ProtectedRoute allowedRoles={["supplier", "admin"]}>
                <SupplierLayout>
                  <Routes>
                    <Route path="/" element={<SupplierDashboardPage />} />
                    <Route
                      path="dashboard"
                      element={<SupplierDashboardPage />}
                    />
                    <Route
                      path="deliveries"
                      element={<SupplierDeliveriesPage />}
                    />
                    <Route
                      path="deliveries/add"
                      element={<SupplierAddDeliveryPage />}
                    />
                    <Route
                      path="deliveries/pending"
                      element={<div>Dostawy Oczekujące</div>}
                    />
                    <Route
                      path="deliveries/completed"
                      element={<div>Dostawy Zrealizowane</div>}
                    />
                    <Route
                      path="products"
                      element={<div>Katalog Produktów</div>}
                    />
                    <Route
                      path="products/inventory"
                      element={<div>Stan Magazynowy</div>}
                    />
                    <Route
                      path="products/pricing"
                      element={<div>Cennik</div>}
                    />
                    <Route
                      path="orders"
                      element={<div>Wszystkie Zamówienia</div>}
                    />
                    <Route
                      path="orders/new"
                      element={<div>Nowe Zamówienia</div>}
                    />
                    <Route
                      path="orders/processing"
                      element={<div>Zamówienia W Realizacji</div>}
                    />
                    <Route path="payments" element={<div>Płatności</div>} />
                    <Route path="reports" element={<div>Raporty</div>} />
                    <Route path="profile" element={<div>Mój Profil</div>} />
                    <Route path="settings" element={<div>Ustawienia</div>} />
                  </Routes>
                </SupplierLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback Route - dla nieznanych ścieżek */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
