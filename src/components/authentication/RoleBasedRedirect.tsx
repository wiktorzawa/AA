import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { logger } from "@/utils/logger";

const RoleBasedRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const role = user.role.name.toLowerCase();
      logger.info(`User authenticated with role: ${role}. Redirecting...`);

      switch (role) {
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        case "staff":
          navigate("/staff/dashboard", { replace: true });
          break;
        case "supplier":
          navigate("/supplier/dashboard", { replace: true });
          break;
        default:
          logger.warn(`Unknown role: ${role}. Redirecting to sign-in.`);
          navigate("/authentication/sign-in", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  return null; // Ten komponent nic nie renderuje
};

export default RoleBasedRedirect;
