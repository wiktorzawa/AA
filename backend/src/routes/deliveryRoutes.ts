import { Router, Request } from "express";
import multer, { type FileFilterCallback } from "multer";
import deliveryController from "../controllers/deliveryController";
import {
  authenticateToken,
  requireRole,
  validateNewDeliveryData,
  validateDeliveryStatusUpdate,
  validateConfirmDeliveryData,
  checkSupplierDeliveryAccess,
  checkDeliveryModifyPermissions,
  checkDeliveryDeletePermissions,
  checkDeliveryViewAccess,
  validateDeliveryFile,
  validateConfirmConsistency,
} from "../middleware";

const router = Router();

// Konfiguracja multer dla upload'u plików - podstawowa walidacja, szczegółowa w middleware
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    // Minimalna walidacja - szczegółowa jest w validateDeliveryFile middleware
    const fileExtension = file.originalname
      .toLowerCase()
      .slice(file.originalname.lastIndexOf("."));

    if ([".xlsx", ".xls", ".xlsm"].includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(null, false); // Zostawiamy szczegółowe błędy dla middleware
    }
  },
});

// Middleware autoryzacji dla wszystkich routes dostaw
router.use(authenticateToken);

/**
 * @route   GET /api/deliveries
 * @desc    Pobiera wszystkie dostawy z filtrami i paginacją
 * @access  Admin, Staff, Supplier (supplier widzi tylko swoje)
 * @query   id_dostawcy, status_weryfikacji, data_od, data_do, nazwa_pliku, page, limit, sortBy, sortOrder
 */
router.get("/", deliveryController.getAllDeliveries);

/**
 * @route   GET /api/deliveries/stats
 * @desc    Pobiera statystyki dostaw
 * @access  Admin, Staff
 */
router.get(
  "/stats",
  requireRole("admin", "staff"),
  deliveryController.getDeliveryStats,
);

/**
 * @route   GET /api/deliveries/supplier/:supplierId
 * @desc    Pobiera dostawy dla konkretnego dostawcy
 * @access  Admin, Staff, Supplier (supplier tylko swoje)
 */
router.get("/supplier/:supplierId", deliveryController.getDeliveriesBySupplier);

/**
 * @route   GET /api/deliveries/status/:status
 * @desc    Pobiera dostawy według statusu
 * @access  Admin, Staff
 */
router.get(
  "/status/:status",
  requireRole("admin", "staff"),
  deliveryController.getDeliveriesByStatus,
);

/**
 * @route   GET /api/deliveries/:id
 * @desc    Pobiera dostawę po ID z relacjami
 * @access  Admin, Staff, Supplier (supplier tylko swoje)
 * @query   include (true/false) - czy dołączyć relacje
 */
router.get("/:id", deliveryController.getDeliveryById);

/**
 * @route   GET /api/deliveries/:deliveryId/products
 * @desc    Pobiera produkty dla konkretnej dostawy
 * @access  Admin, Staff, Supplier (supplier tylko swoje)
 */
router.get(
  "/:deliveryId/products",
  checkDeliveryViewAccess,
  deliveryController.getProductsByDeliveryId,
);

/**
 * @route   POST /api/deliveries
 * @desc    Tworzy nową dostawę
 * @access  Admin, Staff, Supplier
 */
router.post(
  "/",
  validateNewDeliveryData,
  checkSupplierDeliveryAccess,
  deliveryController.createDelivery,
);

/**
 * @route   PATCH /api/deliveries/:id/status
 * @desc    Aktualizuje status dostawy
 * @access  Admin, Staff
 */
router.patch(
  "/:id/status",
  validateDeliveryStatusUpdate,
  checkDeliveryModifyPermissions,
  deliveryController.updateDeliveryStatus,
);

/**
 * @route   DELETE /api/deliveries/:id
 * @desc    Usuwa dostawę
 * @access  Admin
 */
router.delete(
  "/:id",
  checkDeliveryDeletePermissions,
  deliveryController.deleteDelivery,
);

/**
 * @route   POST /api/deliveries/upload
 * @desc    Przesyła i przetwarza plik dostawy
 * @access  Admin, Staff, Supplier
 */
router.post(
  "/upload",
  upload.fields([
    { name: "deliveryFile", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  validateDeliveryFile,
  checkSupplierDeliveryAccess,
  deliveryController.uploadDeliveryFile,
);

/**
 * @route   POST /api/deliveries/upload/preview
 * @desc    Podgląd pliku dostawy bez zapisywania do bazy
 * @access  Admin, Staff, Supplier
 */
router.post(
  "/upload/preview",
  upload.fields([
    { name: "deliveryFile", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  validateDeliveryFile,
  checkSupplierDeliveryAccess,
  deliveryController.previewDeliveryFile,
);

/**
 * @route   POST /api/deliveries/upload/confirm
 * @desc    Potwierdza i zapisuje dostawę po weryfikacji
 * @access  Admin, Staff, Supplier
 */
router.post(
  "/upload/confirm",
  upload.fields([
    { name: "deliveryFile", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  validateDeliveryFile,
  validateConfirmDeliveryData,
  validateConfirmConsistency,
  checkSupplierDeliveryAccess,
  deliveryController.confirmDelivery,
);

export default router;
