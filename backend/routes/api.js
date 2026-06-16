import express from "express";
import authRoutes from "./authRoutes.js";
import contentRoutes from "./contentRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import serviceRoutes from "./serviceRoutes.js";

const router = express.Router();

router.use(authRoutes);
router.use(contentRoutes);
router.use(paymentRoutes);
router.use(serviceRoutes);

export default router;
