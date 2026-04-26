import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// GET /api/products - Get all products
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, inStock, search } = req.query;

    const where: any = {};

    if (category) where.category = String(category);
    if (inStock !== undefined) where.inStock = inStock === "true";
    if (search) {
      where.name = {
        contains: String(search),
        mode: "insensitive",
      };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: products, count: products.length });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, error: "Failed to fetch products" });
  }
});

// GET /api/products/categories - Get unique categories
router.get("/categories", async (req: Request, res: Response) => {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    res.json({ success: true, data: categories.map((c) => c.category) });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch categories" });
  }
});

// GET /api/products/:id - Get single product
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch product" });
  }
});

// POST /api/products - Create a product
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, price, image, category, description, unit, inStock } = req.body;

    if (!name || price === undefined || !image) {
      return res.status(400).json({ success: false, error: "name, price, and image are required" });
    }

    const product = await prisma.product.create({
      data: { name, price: Number(price), image, category, description, unit, inStock },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create product" });
  }
});

// PATCH /api/products/:id - Update a product
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update product" });
  }
});

// DELETE /api/products/:id - Delete a product
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete product" });
  }
});

export default router;
