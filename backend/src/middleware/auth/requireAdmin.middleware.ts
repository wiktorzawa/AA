import { requireRole } from "./requireRole.middleware";

export const requireAdmin = requireRole("admin");
