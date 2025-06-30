import express from "express";
import authRoutes from "./auth/authRoutes";
import staffRoutes from "./auth/staffRoutes";
import supplierRoutes from "./auth/supplierRoutes";
import deliveryRoutes from "./deliveryRoutes";
import allegroRoutes from "./allegroRoutes";
import adsPowerRoutes from "./adsPowerRoutes";
import brightDataRoutes from "./brightDataRoutes";

const router = express.Router();

// Trasy do uwierzytelniania
router.use("/auth", authRoutes);

// Trasy dla pracowników
router.use("/staff", staffRoutes);

// Trasy dla dostawców
router.use("/suppliers", supplierRoutes);

// Trasy dla dostaw
router.use("/deliveries", deliveryRoutes);

// Trasy dla Allegro
router.use("/allegro", allegroRoutes);

// Trasy dla AdsPower
router.use("/adspower", adsPowerRoutes);

// Trasy dla Bright Data
router.use("/brightdata", brightDataRoutes);

export default router;
