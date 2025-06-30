import express from "express";
import supplierController from "../../controllers/auth/supplierController";
import { validateSupplierData } from "../../middleware"; // Import nowego middleware

const router = express.Router();

// Pobieranie wszystkich dostawców
router.get("/", supplierController.getAllSuppliers);

// Pobieranie dostawcy po ID
router.get("/:id", supplierController.getSupplierById);

// Pobieranie dostawcy po NIP
router.get("/nip/:nip", supplierController.getSupplierByNip);

// Sprawdzanie dostępności NIP
router.get("/check-nip/:nip", supplierController.checkNipAvailability);

// Sprawdzanie dostępności email
router.get("/check-email/:email", supplierController.checkEmailAvailability);

// Dodawanie nowego dostawcy (bez konta logowania)
router.post("/", validateSupplierData, supplierController.createSupplier);

// Dodawanie nowego dostawcy z automatycznie wygenerowanym hasłem
router.post("/with-password", validateSupplierData, supplierController.createSupplierWithPassword);

// Aktualizacja dostawcy
router.put("/:id", validateSupplierData, supplierController.updateSupplier);

// Usunięcie dostawcy
router.delete("/:id", supplierController.deleteSupplier);

export default router;
