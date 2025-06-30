import { Router, Request } from "express";
import multer from "multer";
import deliveryController from "../controllers/deliveryController";
import { authenticateToken } from "../middleware/auth/authenticateToken.middleware";
import { requireRole } from "../middleware/auth/requireRole.middleware";
import {
  validateNewDeliveryData,
  validateDeliveryStatusUpdate,
  checkSupplierDeliveryAccess,
  checkDeliveryModifyPermissions,
  checkDeliveryDeletePermissions,
} from "../middleware/deliveries";
import { AppError } from "../utils/AppError";

const router = Router();

// Konfiguracja multer dla upload'u plików
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "application/vnd.ms-excel.sheet.macroEnabled.12", // .xlsm
      "application/vnd.ms-excel.sheet.macroenabled.12", // .xlsm (alternatywny MIME type)
      "application/zip", // .xlsm może być wykrywany jako ZIP
    ];

    const allowedExtensions = [".xlsx", ".xls", ".xlsm"];
    const fileExtension = file.originalname
      .toLowerCase()
      .slice(file.originalname.lastIndexOf("."));

    if (
      allowedMimeTypes.includes(file.mimetype) ||
      allowedExtensions.includes(fileExtension)
    ) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          "Nieprawidłowy format pliku. Obsługiwane formaty: .xlsx, .xls, .xlsm",
          400,
        ),
      );
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
  checkSupplierDeliveryAccess,
  deliveryController.previewDeliveryFile,
);

export default router;
