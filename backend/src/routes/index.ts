import { Router } from "express";
import authRoutes from "./auth.js";
import cardRoutes from "./cards.js";
import customerRoutes from "./customers.js";
import healthRoutes from "./health.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cards", cardRoutes);
router.use("/customers", customerRoutes);
router.use("/health", healthRoutes);

export default router;
