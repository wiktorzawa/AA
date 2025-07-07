import express from "express";
import authRoutes from "./auth/authRoutes";
import staffRoutes from "./auth/staffRoutes";
import supplierRoutes from "./auth/supplierRoutes";
import deliveryRoutes from "./deliveryRoutes";
import productRoutes from "./productRoutes"; // <-- DODAJ TEN IMPORT

const router = express.Router();

// Trasy do uwierzytelniania
router.use("/auth", authRoutes);

// Trasy dla pracowników
router.use("/staff", staffRoutes);

// Trasy dla dostawców
router.use("/suppliers", supplierRoutes);

// Trasy dla dostaw
router.use("/deliveries", deliveryRoutes);

// Trasy dla produktów
router.use("/products", productRoutes); // <-- DODAJ TĘ LINIĘ

export default router;
