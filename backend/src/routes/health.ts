import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { sendSuccess } from "../utils/response.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return sendSuccess(res, { status: "ok", timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

export default router;
