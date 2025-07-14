import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { logger } from "@/utils/logger";

const RoleBasedRedirect = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const appRole = useAuthStore((state) => state.appRole);

  useEffect(() => {
    if (isAuthenticated && appRole) {
      logger.info(
        `User authenticated with appRole: ${appRole}. Redirecting...`,
      );

      let targetPath = "";
      switch (appRole) {
        case "admin":
          targetPath = "/admin/dashboard";
          break;
        case "staff":
          targetPath = "/staff/dashboard";
          break;
        case "supplier":
          targetPath = "/supplier/dashboard";
          break;
        default:
          logger.warn(`Unknown appRole: ${appRole}. Redirecting to sign-in.`);
          targetPath = "/authentication/sign-in";
      }

      logger.info(`Navigating to: ${targetPath}`);
      navigate(targetPath, { replace: true });
    }
  }, [isAuthenticated, appRole, navigate]);

  return null; // Ten komponent nic nie renderuje
};

export default RoleBasedRedirect;
