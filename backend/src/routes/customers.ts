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
});

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { page, limit, search } = querySchema.parse(req.query);

    const where = search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          cards: {
            select: { id: true, provider: true, status: true, creditLimit: true, balance: true, last4: true },
            take: 5,
            orderBy: { updatedAt: "desc" },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fullName: "asc" },
      }),
      prisma.customer.count({ where }),
    ]);

    return sendSuccess(
      res,
      customers.map((customer) => ({
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        cards: customer.cards,
        totalCards: customer.cards.length,
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
