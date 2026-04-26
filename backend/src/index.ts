import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";
import userRoutes from "./routes/users";
import seedRoutes from "./routes/seed";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

export const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "https://bigbasket-six.vercel.app"],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "BigBasket API is running 🚀", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/seed", seedRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

// Start server
async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to Neon PostgreSQL database");
    app.listen(PORT, () => {
      console.log(`🚀 BigBasket Backend running at http://localhost:${PORT}`);
      console.log(`📦 API base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🔌 Disconnected from database");
  process.exit(0);
});
