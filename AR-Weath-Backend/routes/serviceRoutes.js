import express from "express";
import { body } from "express-validator";
import { pool as db } from "../config/db.js";
import { sendContactNotification } from "../services/mailerService.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { handleDatabaseError } from "../utils/http.js";
import {
  isValidGmail,
  isValidIndianMobile,
  normalizePhone,
} from "../utils/validators.js";

const router = express.Router();

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

export default router;
