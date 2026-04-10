import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from "@adminjs/sequelize";

import sequelize from "../config/database.js";

// Models
import User from "../model/user.js";
// import Product from "../models/product.js";
// import Category from "../models/category.js";
// import Order from "../models/order.js";
// import OrderItem from "../models/orderItem.js";
// import Setting from "../models/setting.js";

// register adapter
AdminJS.registerAdapter(AdminJSSequelize);

const admin = new AdminJS({
  resources: [
    { resource: User, options: { navigation: "User Management" } },
    // { resource: Product, options: { navigation: "Store" } },
    // { resource: Category, options: { navigation: "Store" } },
    // { resource: Order, options: { navigation: "Sales" } },
    // { resource: OrderItem, options: { navigation: "Sales" } },
    // { resource: Setting, options: { navigation: "Configuration" } },
  ],
  rootPath: "/admin",
});

const router = AdminJSExpress.buildRouter(admin);

export default router;
