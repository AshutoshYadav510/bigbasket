import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// GET /api/orders - Get all orders (with items + product details)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId, status } = req.query;
    const where: any = {};
    if (userId) where.userId = String(userId);
    if (status) where.status = String(status);

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: { product: true },
        },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: orders, count: orders.length });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, error: "Failed to fetch orders" });
  }
});

// GET /api/orders/:id - Get single order
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: { product: true },
        },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch order" });
  }
});

// POST /api/orders - Create a new order (checkout)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, items, address } = req.body;

    // items: Array of { productId: string, quantity: number }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "items array is required" });
    }

    // Fetch products to get current prices
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({ success: false, error: "One or more products not found" });
    }

    // Check stock availability
    const outOfStock = products.filter((p) => !p.inStock);
    if (outOfStock.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Out of stock: ${outOfStock.map((p) => p.name).join(", ")}`,
      });
    }

    // Calculate total
    const total = items.reduce((sum: number, item: any) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: userId || null,
          total,
          address: address || null,
          status: "CONFIRMED",
          items: {
            create: items.map((item: any) => {
              const product = products.find((p) => p.id === item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
              };
            }),
          },
        },
        include: {
          items: { include: { product: true } },
        },
      });
      return newOrder;
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
});

// PATCH /api/orders/:id/status - Update order status
router.patch("/:id/status", async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { items: { include: { product: true } } },
    });

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update order status" });
  }
});

// DELETE /api/orders/:id - Cancel/delete an order
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.order.update({
      where: { id: req.params.id },
      data: { status: "CANCELLED" },
    });
    res.json({ success: true, message: "Order cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to cancel order" });
  }
});

export default router;
