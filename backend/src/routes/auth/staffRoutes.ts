import express from "express";
import staffController from "../../controllers/auth/staffController";
import { validateStaffData } from "../../middleware"; // Import nowego middleware

const router = express.Router();

// Pobieranie wszystkich pracowników
router.get("/", staffController.getAllStaff);

// Pobieranie pracownika po ID
router.get("/:id", staffController.getStaffById);

// Dodawanie nowego pracownika (bez konta logowania)
router.post("/", validateStaffData, staffController.createStaff);

// Dodawanie nowego pracownika z automatycznie wygenerowanym hasłem
router.post("/with-password", validateStaffData, staffController.createStaffWithPassword);

// Aktualizacja pracownika
router.put("/:id", validateStaffData, staffController.updateStaff);

// Usunięcie pracownika
router.delete("/:id", staffController.deleteStaff);

export default router;
