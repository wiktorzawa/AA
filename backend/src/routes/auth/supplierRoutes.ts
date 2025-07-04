import express from "express";
import supplierController from "../../controllers/auth/supplierController";
import {
  authenticateToken,
  requireRole,
  validateSupplierData,
} from "../../middleware";

const router = express.Router();

router.use(authenticateToken);

// Dostęp dla admina do wszystkich operacji
router.get("/", requireRole("admin"), supplierController.getAllSuppliers);
router.delete("/:id", requireRole("admin"), supplierController.deleteSupplier);

// Dostęp dla admina i dostawcy (do swoich danych)
router.get(
  "/:id",
  requireRole("admin", "supplier"),
  supplierController.getSupplierById,
);
router.put(
  "/:id",
  validateSupplierData,
  requireRole("admin", "supplier"),
  supplierController.updateSupplier,
);

// Endpointy publiczne do sprawdzania NIP i email
router.get("/check-nip/:nip", supplierController.checkNipAvailability);
router.get("/check-email/:email", supplierController.checkEmailAvailability);

// Endpoint publiczny do tworzenia konta dostawcy
router.post("/", validateSupplierData, supplierController.createSupplier);

export default router;
