import { type FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/authentication/ProtectedRoute";

import ForgotPasswordPage from "./pages/authentication/forgot-password";
import ProfileLockPage from "./pages/authentication/profile-lock";
import ResetPasswordPage from "./pages/authentication/reset-password";
import SignInBackgroundPage from "./pages/authentication/sign-in-background";
import SignUpPage from "./pages/authentication/sign-up";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import DashboardHomePage from "./pages/DashboardHomePage";
import StaffDashboardPage from "./pages/staff/StaffDashboardPage";
import SupplierDashboardPage from "./pages/supplier/SupplierDashboardPage";

const App: FC = () => {
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
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <AdminDashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <DashboardLayout>
                <StaffDashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/dashboard"
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
