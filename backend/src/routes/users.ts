import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// GET /api/users - Get all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, phone: true, address: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: users, count: users.length });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch users" });
  }
});

// GET /api/users/:id - Get user with their orders
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        orders: {
          include: { items: { include: { product: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch user" });
  }
});

// POST /api/users/login - Login a user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, error: "Incorrect password" });
    }

    // Don't return password in response
    const userData = { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address, createdAt: user.createdAt, updatedAt: user.updatedAt };
    res.json({ success: true, data: userData });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to login" });
  }
});

// POST /api/users - Create a user
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "name, email and password are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, error: "User with this email already exists" });
    }

    const user = await prisma.user.create({
      data: { name, email, password, phone, address },
    });

    // Don't return password in response
    const userData = { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address, createdAt: user.createdAt, updatedAt: user.updatedAt };
    res.status(201).json({ success: true, data: userData });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create user" });
  }
});

// PATCH /api/users/:id - Update user
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { name, phone, address } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, phone, address },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update user" });
  }
});

export default router;

