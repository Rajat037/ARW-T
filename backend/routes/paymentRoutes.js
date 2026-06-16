import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { body } from "express-validator";
import { pool as db } from "../config/db.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

const ensureRazorpayKeys = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error(
      "Razorpay configuration missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.",
    );
  }
};

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

export default router;
