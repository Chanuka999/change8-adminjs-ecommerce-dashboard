import express from "express";
import sequelize from "./config/database.js";
import adminRouter from "./admin/admin.js";
import dotenv from "dotenv";
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

app.use(express.json());

// AdminJS route
app.use("/admin", adminRouter);
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/uploads", uploadRoutes);
sequelize.sync({ alter: true }).then(() => {
  app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
    console.log("AdminJS: http://localhost:5000/admin");
  });
});
