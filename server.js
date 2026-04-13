import express from "express";
import sequelize from "./config/database.js";
import adminRouter from "./admin/admin.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import orderItemRoutes from "./routes/orderItemRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import "./model/index.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use("/custom", express.static(path.join(__dirname, "admin-assets")));
app.use("/public", express.static(path.join(__dirname, "public")));

// AdminJS route
app.get("/admin/register", (req, res) => {
  res.sendFile(path.join(__dirname, "admin-assets", "register.html"));
});
app.use("/admin", adminRouter);
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/uploads", uploadRoutes);
sequelize
  .sync({ alter: { drop: false } })
  .then(() => {
    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
      console.log("AdminJS: http://localhost:5000/admin");
    });
  })
  .catch((error) => {
    console.error("Database sync failed:", error);
    process.exit(1);
  });
