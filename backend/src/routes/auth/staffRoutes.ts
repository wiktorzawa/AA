import express from "express";
import staffController from "../../controllers/auth/staffController";
import {
  authenticateToken,
  requireRole,
  validateStaffData,
} from "../../middleware";

const router = express.Router();

router.use(authenticateToken, requireRole("admin"));

// Pobieranie wszystkich pracowników
router.get("/", staffController.getAllStaff);

// Pobieranie pracownika po ID
router.get("/:id", staffController.getStaffById);

// Tworzenie nowego pracownika (zawsze z kontem logowania i hasłem)
router.post("/", validateStaffData, staffController.createStaff);

// Aktualizacja pracownika
router.put("/:id", validateStaffData, staffController.updateStaff);

// Usunięcie pracownika
router.delete("/:id", staffController.deleteStaff);

export default router;
