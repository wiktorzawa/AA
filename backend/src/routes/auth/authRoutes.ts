import express, { Request, Response } from "express";
import authController from "../../controllers/auth/authController";
import { authenticateToken, validateLoginData } from "../../middleware";

const router = express.Router();

// Trasy autoryzacji
router.post("/login", validateLoginData, authController.login);
router.post("/logout", authenticateToken, authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.post(
  "/verify-token",
  authenticateToken,
  (req: Request, res: Response) => {
    res.json({ success: true, user: req.user });
  },
);
router.get("/profile", authenticateToken, authController.getUserProfile);

/**
 * @desc    Pobiera status zalogowanego użytkownika
 * @access  Private
 */
router.get("/status", authenticateToken, authController.status);

export default router;
