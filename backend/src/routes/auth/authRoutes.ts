import express from "express";
import authController from "../../controllers/auth/authController";
import { authenticateToken, validateLoginData } from "../../middleware";

const router = express.Router();

// Trasy autoryzacji
router.post("/login", validateLoginData, authController.login);
router.post("/logout", authenticateToken, authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.post("/verify-token", authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});
router.get("/profile/:email", authenticateToken, authController.getUserProfile);

export default router;
