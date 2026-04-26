import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

const SEED_PRODUCTS = [
  // Fruits & Vegetables
  { name: "Organic Tomatoes", price: 45, image: "/images/product_tomatoes.png", category: "Fruits & Vegetables", description: "Farm-fresh organic tomatoes, rich in lycopene.", unit: "500g", inStock: true },
  { name: "Fresh Spinach", price: 30, image: "/images/product_spinach.png", category: "Fruits & Vegetables", description: "Tender baby spinach leaves, washed and ready to eat.", unit: "250g", inStock: true },
  { name: "Bananas", price: 55, image: "/images/product_bananas.png", category: "Fruits & Vegetables", description: "Sweet and ripe Cavendish bananas.", unit: "6 pcs", inStock: true },
  { name: "Red Onions", price: 40, image: "/images/product_onion.png", category: "Fruits & Vegetables", description: "Fresh red onions with crispy texture.", unit: "1 kg", inStock: true },
  { name: "Green Capsicum", price: 35, image: "/images/product_capsicum.png", category: "Fruits & Vegetables", description: "Crunchy green bell peppers.", unit: "3 pcs", inStock: true },
  { name: "Carrots", price: 38, image: "/images/product_carrots.png", category: "Fruits & Vegetables", description: "Vitamin-rich fresh carrots.", unit: "500g", inStock: true },

  // Dairy & Eggs
  { name: "Fresh Milk", price: 60, image: "/images/product_milk.png", category: "Dairy & Eggs", description: "Full-fat fresh cow's milk, pasteurized and homogenized.", unit: "1L", inStock: true },
  { name: "Amul Butter", price: 55, image: "/images/product_butter.png", category: "Dairy & Eggs", description: "Creamy salted butter from Amul.", unit: "100g", inStock: true },
  { name: "Paneer", price: 85, image: "/images/product_paneer.png", category: "Dairy & Eggs", description: "Fresh soft cottage cheese.", unit: "200g", inStock: true },
  { name: "Eggs (Farm Fresh)", price: 90, image: "/images/product_eggs.png", category: "Dairy & Eggs", description: "Free-range farm-fresh eggs.", unit: "12 pcs", inStock: true },
  { name: "Greek Yogurt", price: 120, image: "/images/product_yogurt.png", category: "Dairy & Eggs", description: "Thick and creamy Greek-style yogurt.", unit: "400g", inStock: true },

  // Bakery & Bread
  { name: "Whole Wheat Bread", price: 45, image: "/images/product_bread.png", category: "Bakery & Bread", description: "Soft whole wheat sandwich bread, no added preservatives.", unit: "400g loaf", inStock: true },
  { name: "Croissants", price: 80, image: "/images/product_croissant.png", category: "Bakery & Bread", description: "Flaky, buttery French croissants.", unit: "4 pcs", inStock: true },

  // Snacks & Beverages
  { name: "Lay's Classic Chips", price: 30, image: "/images/product_chips.png", category: "Snacks & Beverages", description: "Classic salted potato chips.", unit: "90g", inStock: true },
  { name: "Tropicana Orange Juice", price: 120, image: "/images/product_juice.png", category: "Snacks & Beverages", description: "100% pure orange juice, no added sugar.", unit: "1L", inStock: true },
  { name: "Nescafé Gold", price: 350, image: "/images/product_coffee.png", category: "Snacks & Beverages", description: "Premium instant coffee blend.", unit: "100g", inStock: true },

  // Staples
  { name: "Basmati Rice", price: 180, image: "/images/product_rice.png", category: "Staples", description: "Long-grain premium aged basmati rice.", unit: "1 kg", inStock: true },
  { name: "Toor Dal", price: 140, image: "/images/product_dal.png", category: "Staples", description: "High-protein split pigeon peas.", unit: "1 kg", inStock: true },
  { name: "Aashirvaad Atta", price: 320, image: "/images/product_atta.png", category: "Staples", description: "100% whole wheat flour, superior quality.", unit: "5 kg", inStock: true },

  // Personal Care
  { name: "Dove Body Wash", price: 220, image: "/images/product_bodywash.png", category: "Personal Care", description: "Moisturizing body wash with natural oils.", unit: "500ml", inStock: true },
  { name: "Colgate Max Fresh", price: 95, image: "/images/product_toothpaste.png", category: "Personal Care", description: "Whitening toothpaste with mint crystals.", unit: "150g", inStock: false },
];

// POST /api/seed - Seed the database with initial data
router.post("/", async (req: Request, res: Response) => {
  try {
    // Clear existing products
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();

    // Insert seed products
    const created = await prisma.product.createMany({
      data: SEED_PRODUCTS,
      skipDuplicates: true,
    });

    res.json({
      success: true,
      message: `Database seeded successfully! Created ${created.count} products.`,
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ success: false, error: "Failed to seed database" });
  }
});

// GET /api/seed/status - Check if DB has data
router.get("/status", async (req: Request, res: Response) => {
  try {
    const [productCount, orderCount, userCount] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
    ]);
    res.json({
      success: true,
      data: { products: productCount, orders: orderCount, users: userCount },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to get DB status" });
  }
});

export default router;
