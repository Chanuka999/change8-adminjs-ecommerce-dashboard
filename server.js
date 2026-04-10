import express from "express";
import sequelize from "./config/database.js";
import adminRouter from "./admin/admin.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

// AdminJS route
app.use("/admin", adminRouter);

sequelize.sync({ alter: true }).then(() => {
  app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
    console.log("AdminJS: http://localhost:5000/admin");
  });
});
