import express from "express";
import bcrypt from "bcryptjs";
import { body } from "express-validator";
import admin from "firebase-admin";
import { pool as db } from "../config/db.js";
import { sendOtpEmail } from "../services/mailerService.js";
import {
  authenticateToken,
  setAuthCookie,
} from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { handleDatabaseError } from "../utils/http.js";
import { isProduction } from "../config/env.js";

const router = express.Router();

router.get("/auth/me", authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [req.user.id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.status(200).json({ authenticated: true, user: result.rows[0] });
  } catch (error) {
    return handleDatabaseError(res, error);
  }
});

router.post("/auth/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

router.post(
  "/signup",
  [
    body("name").trim().notEmpty().withMessage("Name is required.").escape(),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email is required.")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters."),
    validateRequest,
  ],
  async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const existing = await db.query("SELECT id FROM users WHERE email = $1", [
        email,
      ]);
      if (existing.rows.length > 0) {
        return res
          .status(400)
          .json({ error: "User already exists with this email." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const insert = await db.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
        [name, email, hashedPassword],
      );

      const userId = insert.rows[0].id;
      await db.query(
        "INSERT INTO user_profiles (user_id, name) VALUES ($1, $2)",
        [userId, name],
      );

      const user = { id: userId, name, email, role: "user" };
      setAuthCookie(res, { id: userId, email, role: "user" });

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user,
      });
    } catch (error) {
      return handleDatabaseError(res, error);
    }
  },
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email is required.")
      .normalizeEmail(),
    body("password").trim().notEmpty().withMessage("Password is required."),
    validateRequest,
  ],
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (result.rows.length === 0) {
        return res.status(400).json({ error: "Invalid credentials." });
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials." });
      }

      setAuthCookie(res, {
        id: user.id,
        email: user.email,
        role: user.role || "user",
      });

      res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      return handleDatabaseError(res, error);
    }
  },
);

router.post(
  "/auth/forgot-password",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email is required.")
      .normalizeEmail(),
    validateRequest,
  ],
  async (req, res) => {
    const { email } = req.body;

    try {
      const userResult = await db.query("SELECT id FROM users WHERE email = $1", [
        email,
      ]);
      if (userResult.rows.length === 0) {
        return res.status(200).json({
          success: true,
          message: "If an account with that email exists, an OTP has been sent.",
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await db.query(
        `INSERT INTO password_resets (email, otp, expires_at)
         VALUES ($1, $2, $3)
         ON CONFLICT (email)
         DO UPDATE SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at`,
        [email, otp, expiresAt],
      );

      await sendOtpEmail(email, otp);

      res.status(200).json({
        success: true,
        message: "If an account with that email exists, an OTP has been sent.",
      });
    } catch (error) {
      console.error("Failed to process forgot password:", error);
      return handleDatabaseError(res, error);
    }
  },
);

router.post(
  "/auth/reset-password",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email is required.")
      .normalizeEmail(),
    body("otp").trim().notEmpty().withMessage("OTP is required."),
    body("newPassword")
      .trim()
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters."),
    validateRequest,
  ],
  async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
      const resetResult = await db.query(
        "SELECT * FROM password_resets WHERE email = $1 AND otp = $2 AND expires_at > NOW()",
        [email, otp],
      );

      if (resetResult.rows.length === 0) {
        return res.status(400).json({ error: "Invalid or expired OTP." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await db.query("UPDATE users SET password = $1 WHERE email = $2", [
        hashedPassword,
        email,
      ]);
      await db.query("DELETE FROM password_resets WHERE email = $1", [email]);

      res
        .status(200)
        .json({ success: true, message: "Password reset successfully." });
    } catch (error) {
      return handleDatabaseError(res, error);
    }
  },
);

router.get("/csrf-token", (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

router.post(
  "/auth/google",
  [body("idToken").notEmpty().withMessage("ID token is required."), validateRequest],
  async (req, res) => {
    const { idToken } = req.body;

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { email, name } = decodedToken;

      let userResult = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      let user;
      if (userResult.rows.length === 0) {
        const insert = await db.query(
          "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
          [name || email, email, "firebase_auth", "user"],
        );
        const userId = insert.rows[0].id;
        await db.query(
          "INSERT INTO user_profiles (user_id, name) VALUES ($1, $2)",
          [userId, name || email],
        );
        user = { id: userId, name: name || email, email, role: "user" };
      } else {
        user = userResult.rows[0];
      }

      setAuthCookie(res, {
        id: user.id,
        email: user.email,
        role: user.role || "user",
      });

      res.status(200).json({
        success: true,
        message: "Logged in with Google successfully",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      console.error("Firebase auth error:", error);
      return res.status(400).json({ error: "Invalid Google token" });
    }
  },
);

export default router;
