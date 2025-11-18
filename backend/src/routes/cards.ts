import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";
import { sendSuccess } from "../utils/response.js";
import { z } from "zod";

const router = Router();

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "CLOSED"]).optional(),
});

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { page, limit, search, status } = querySchema.parse(req.query);
    const where = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { holderName: { contains: search, mode: "insensitive" } },
              { customer: { fullName: { contains: search, mode: "insensitive" } } },
              { cardNumber: { contains: search } },
            ],
          }
        : {}),
    };

    const [cards, total] = await Promise.all([
      prisma.card.findMany({
        where,
        include: { customer: { select: { id: true, fullName: true, email: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.card.count({ where }),
    ]);

    return sendSuccess(
      res,
      cards.map((card) => ({
        id: card.id,
        holderName: card.holderName,
        provider: card.provider,
        status: card.status,
        balance: card.balance,
        creditLimit: card.creditLimit,
        currency: card.currency,
        customer: card.customer,
        last4: card.last4,
        expiresOn: card.expiresOn,
        updatedAt: card.updatedAt,
      })),
      {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      }
    );
  } catch (error) {
    next(error);
  }
});

export default router;
