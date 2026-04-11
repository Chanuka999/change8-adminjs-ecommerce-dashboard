import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from "@adminjs/sequelize";

import sequelize from "../config/database.js";

// Models
import {
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Setting,
} from "../model/index.js";

// register adapter
AdminJS.registerAdapter(AdminJSSequelize);

const admin = new AdminJS({
  databases: [sequelize],
  rootPath: "/admin",

  resources: [User, Category, Product, Order, OrderItem, Setting],
});

const router = AdminJSExpress.buildAuthenticatedRouter(admin, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (user && user.role === "admin") {
      return user;
    }
    return null;
  },
  cookieName: "adminjs",
  cookiePassword: "secretcookie",
});

export default router;
