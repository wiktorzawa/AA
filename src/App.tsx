import { BrowserRouter, Route, Routes } from "react-router-dom";
import type { FC } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import SignInPage from "./pages/authentication/sign-in";
import SignUpPage from "./pages/authentication/sign-up";
import ForgotPasswordPage from "./pages/authentication/forgot-password";
import ResetPasswordPage from "./pages/authentication/reset-password";
import ProfileLockPage from "./pages/authentication/profile-lock";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import StaffDashboardPage from "./pages/staff/StaffDashboardPage";
import SupplierDashboardPage from "./pages/supplier/SupplierDashboardPage";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import DashboardHomePage from "./pages/DashboardHomePage";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/authentication/sign-in" element={<SignInPage />} />
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

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff", "supplier"]}>
              <DashboardLayout>
                <DashboardHomePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <AdminDashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <DashboardLayout>
                <StaffDashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier"
          element={
            <ProtectedRoute allowedRoles={["supplier", "admin"]}>
              <DashboardLayout>
                <SupplierDashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
