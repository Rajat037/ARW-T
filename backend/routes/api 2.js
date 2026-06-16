import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import { body, validationResult } from "express-validator";
import { pool as db } from "../lib/db.js";
import { sendContactNotification, sendOtpEmail } from "../lib/mailer.js";
import admin from "firebase-admin";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_123";
if (
  !process.env.JWT_SECRET ||
  process.env.JWT_SECRET === "your_super_secret_key_123"
) {
  console.warn(
    "\x1b[33m[SECURITY WARNING]\x1b[0m JWT_SECRET is not set or is using the default value. " +
      "Generate a strong random secret: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
  );
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 60 * 60 * 1000, // 1 hour
  path: "/",
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";
const router = express.Router();

const ensureRazorpayKeys = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error(
      "Razorpay configuration missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.",
    );
  }
};

const handleDatabaseError = (res, error) => {
  console.error(error);
  return res
    .status(500)
    .json({ error: error.message || "Internal server error" });
};

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((error) => ({
        field: error.path || error.param,
        message: error.msg,
      })),
    });
  }
  next();
};

const isValidGmail = (value) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(value);
const normalizePhone = (value = "") => value.replace(/[\s()-]/g, "");
const isValidIndianMobile = (value) =>
  /^(?:\+91|91)?[6-9]\d{9}$/.test(normalizePhone(value));

// Middleware to authenticate via httpOnly cookie
const authenticateToken = (req, res, next) => {
  const token = req.cookies?.auth_token;

  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
};

// Role-based access control middleware
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: insufficient permissions" });
    }
    next();
  };
};

// Helper to create and set JWT cookie
const setAuthCookie = (res, payload) => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  res.cookie("auth_token", token, COOKIE_OPTIONS);
  return token;
};

// --- Auth Routes ---

// Check current session
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

// Logout (clear auth cookie)
router.post("/auth/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// Get Free Consultation
router.post(
  "/consultation",
  [
    body("name").trim().notEmpty().withMessage("Name is required.").escape(),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email is required.")
      .normalizeEmail(),
    body("service").optional({ checkFalsy: true }).trim().escape(),
    body("message").optional({ checkFalsy: true }).trim().escape(),
    validateRequest,
  ],
  async (req, res) => {
    const { name, email, service, message } = req.body;

    try {
      const sql = `INSERT INTO consultations (name, email, service, message) VALUES ($1, $2, $3, $4) RETURNING id`;
      const result = await db.query(sql, [
        name,
        email,
        service || null,
        message || null,
      ]);
      res.status(201).json({
        success: true,
        message: "Consultation request received successfully",
        id: result.rows[0].id,
      });
    } catch (error) {
      return handleDatabaseError(res, error);
    }
  },
);

router.post(
  "/payments/create-order",
  [
    body("planId").trim().notEmpty().withMessage("Plan ID is required."),
    body("planName").trim().notEmpty().withMessage("Plan name is required."),
    body("amount")
      .isInt({ gt: 0 })
      .withMessage("Amount must be a positive integer."),
    validateRequest,
  ],
  async (req, res) => {
    const { planId, planName, amount } = req.body;
    try {
      ensureRazorpayKeys();

      const data = {
        amount,
        currency: "INR",
        receipt: `order_rcptid_${Date.now()}`,
        payment_capture: 1,
      };
      const order = await razorpay.orders.create(data);

      await db.query(
        `INSERT INTO payment_orders (plan_name, plan_code, amount, currency, razorpay_order_id, status, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          planName,
          planId,
          amount,
          data.currency,
          order.id,
          "created",
          JSON.stringify({ createdAt: new Date().toISOString() }),
        ],
      );

      return res.status(201).json({
        success: true,
        order,
        key: process.env.RAZORPAY_KEY_ID || "",
      });
    } catch (error) {
      console.error("Razorpay order creation failed:", error);
      const message =
        error?.error?.description || error?.message || "Payment gateway error.";
      return res.status(502).json({
        error: `Payment gateway error: ${message}`,
      });
    }
  },
);

router.post(
  "/payments/verify",
  [
    body("razorpay_order_id")
      .trim()
      .notEmpty()
      .withMessage("Razorpay order ID is required."),
    body("razorpay_payment_id")
      .trim()
      .notEmpty()
      .withMessage("Razorpay payment ID is required."),
    body("razorpay_signature")
      .trim()
      .notEmpty()
      .withMessage("Razorpay signature is required."),
    validateRequest,
  ],
  async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    try {
      ensureRazorpayKeys();

      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          error: "Payment verification failed.",
        });
      }

      await db.query(
        `UPDATE payment_orders SET status = $1, razorpay_payment_id = $2, razorpay_signature = $3, updated_at = NOW() WHERE razorpay_order_id = $4`,
        ["paid", razorpay_payment_id, razorpay_signature, razorpay_order_id],
      );

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully.",
      });
    } catch (error) {
      console.error("Razorpay payment verification failed:", error);
      const message =
        error?.error?.description || error?.message || "Payment gateway error.";
      return res.status(502).json({
        error: `Payment gateway error: ${message}`,
      });
    }
  },
);

// Start Tax Filing Flow (Mock)
router.post(
  "/file-taxes",
  [
    body("userId").isInt({ gt: 0 }).withMessage("Valid user ID is required."),
    validateRequest,
  ],
  async (req, res) => {
    const { userId } = req.body;

    try {
      const sql = `INSERT INTO tax_filings (user_id, status) VALUES ($1, $2) RETURNING id`;
      const result = await db.query(sql, [
        Number(userId),
        "Document Collection",
      ]);
      res.status(201).json({
        success: true,
        message: "Tax filing initiated",
        filingId: result.rows[0].id,
      });
    } catch (error) {
      return handleDatabaseError(res, error);
    }
  },
);

// Contact Form Submission
router.post(
  "/contact",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required.")
      .isLength({ min: 2, max: 80 })
      .withMessage("Name must be between 2 and 80 characters.")
      .escape(),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Gmail address is required.")
      .custom(isValidGmail)
      .withMessage("Enter a valid Gmail address.")
      .normalizeEmail(),
    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required.")
      .custom(isValidIndianMobile)
      .withMessage("Enter a valid Indian mobile number.")
      .customSanitizer(normalizePhone)
      .escape(),
    body("service").trim().notEmpty().withMessage("Service is required.").escape(),
    body("otherDetails")
      .if(body("service").equals("Other Services"))
      .trim()
      .notEmpty()
      .withMessage("Please specify the service you need.")
      .isLength({ max: 120 })
      .withMessage("Service details must be 120 characters or fewer.")
      .escape(),
    body("otherDetails")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 120 })
      .withMessage("Service details must be 120 characters or fewer.")
      .escape(),
    body("comments")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Comments must be 1000 characters or fewer.")
      .escape(),
    validateRequest,
  ],
  async (req, res) => {
    const { name, phone, email, service, otherDetails, comments } = req.body;

    try {
      const sql = `INSERT INTO contacts (name, phone, email, service, other_details, comments) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const result = await db.query(sql, [
        name,
        phone || null,
        email,
        service || null,
        otherDetails || null,
        comments || null,
      ]);

      const contact = result.rows[0];

      // Send email in background without blocking response
      sendContactNotification(contact).catch((err) => {
        console.error("Email sending failed:", err);
      });

      res.status(201).json({
        success: true,
        message: "Contact form submitted successfully",
        id: contact.id,
      });
    } catch (error) {
      return handleDatabaseError(res, error);
    }
  },
);

// User Signup
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

// User Login
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

// Forgot Password - Send OTP
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
      // Check if user exists
      const userResult = await db.query("SELECT id FROM users WHERE email = $1", [email]);
      if (userResult.rows.length === 0) {
        // Return 200 even if user not found to prevent email enumeration
        return res.status(200).json({ success: true, message: "If an account with that email exists, an OTP has been sent." });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      // Store OTP in password_resets table
      await db.query(
        `INSERT INTO password_resets (email, otp, expires_at) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (email) 
         DO UPDATE SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at`,
        [email, otp, expiresAt]
      );

      // Send Email
      await sendOtpEmail(email, otp);

      res.status(200).json({ success: true, message: "If an account with that email exists, an OTP has been sent." });
    } catch (error) {
      console.error("Failed to process forgot password:", error);
      return handleDatabaseError(res, error);
    }
  }
);

// Reset Password - Verify OTP & Update Password
router.post(
  "/auth/reset-password",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email is required.")
      .normalizeEmail(),
    body("otp")
      .trim()
      .notEmpty()
      .withMessage("OTP is required."),
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
        [email, otp]
      );

      if (resetResult.rows.length === 0) {
        return res.status(400).json({ error: "Invalid or expired OTP." });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await db.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);

      // Delete OTP
      await db.query("DELETE FROM password_resets WHERE email = $1", [email]);

      res.status(200).json({ success: true, message: "Password reset successfully." });
    } catch (error) {
      return handleDatabaseError(res, error);
    }
  }
);

router.get("/csrf-token", (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

// Google Auth
router.post(
  "/auth/google",
  [
    body("idToken").notEmpty().withMessage("ID token is required."),
    validateRequest,
  ],
  async (req, res) => {
    const { idToken } = req.body;

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid, email, name, picture } = decodedToken;

      // Check if user exists
      let userResult = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [email],
      );

      let user;
      if (userResult.rows.length === 0) {
        // Create new user
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

// Get User Profile
router.get("/profile", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const sql = `
      SELECT p.name, u.email, p.mobile_no, p.whatsapp_subscribed, p.company_name, p.state, p.billing_mobile, p.billing_email
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = $1
    `;
    const result = await db.query(sql, [userId]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    if (
      result.rows[0].mobile_no === null &&
      result.rows[0].company_name === null
    ) {
      await db.query(
        `INSERT INTO user_profiles (user_id, name)
         SELECT $1, (SELECT name FROM users WHERE id = $1)
         WHERE NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = $1)`,
        [userId],
      );
    }

    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.status(200).json(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(res, error);
  }
});

// Update User Profile
router.put(
  "/profile",
  authenticateToken,
  [
    body("name").optional({ checkFalsy: true }).trim().escape(),
    body("mobile_no").optional({ checkFalsy: true }).trim().escape(),
    body("whatsapp_subscribed").optional().toBoolean(),
    body("company_name").optional({ checkFalsy: true }).trim().escape(),
    body("state").optional({ checkFalsy: true }).trim().escape(),
    body("billing_mobile").optional({ checkFalsy: true }).trim().escape(),
    body("billing_email")
      .optional({ checkFalsy: true })
      .isEmail()
      .withMessage("Valid billing email is required.")
      .normalizeEmail(),
    validateRequest,
  ],
  async (req, res) => {
    const userId = req.user.id;
    const {
      name,
      mobile_no,
      whatsapp_subscribed,
      company_name,
      state,
      billing_mobile,
      billing_email,
    } = req.body;

    try {
      const profileSql = `
        UPDATE user_profiles
        SET name = $1, mobile_no = $2, whatsapp_subscribed = $3, company_name = $4, state = $5, billing_mobile = $6, billing_email = $7
        WHERE user_id = $8
      `;
      const profileValues = [
        name || "",
        mobile_no || "",
        whatsapp_subscribed ? true : false,
        company_name || "",
        state || "",
        billing_mobile || "",
        billing_email || "",
        userId,
      ];

      await db.query(profileSql, profileValues);
      res
        .status(200)
        .json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
      return handleDatabaseError(res, error);
    }
  },
);

// Fetch Testimonials
router.get("/testimonials", (req, res) => {
  const testimonials = [
    {
      id: 1,
      name: "Rohan K.",
      role: "Tech YouTuber",
      content:
        "A.R. Wealth & Tax Co. completely took the anxiety out of filing taxes.",
      rating: 5,
    },
    {
      id: 2,
      name: "Sneha M.",
      role: "Lifestyle Influencer",
      content: "As a freelancer, I had no idea how GST applied to PR packages.",
      rating: 5,
    },
  ];

  res.set("Cache-Control", "public, max-age=3600");
  res.status(200).json(testimonials);
});

export default router;
