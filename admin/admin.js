import AdminJS, { ComponentLoader } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from "@adminjs/sequelize";
import { Op } from "sequelize";
import { fileURLToPath } from "url";
import path from "path";

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

const isAdmin = ({ currentAdmin }) =>
  currentAdmin && currentAdmin.role === "admin";

const restrictToAdmin = {
  list: { isAccessible: isAdmin },
  show: { isAccessible: isAdmin },
  new: { isAccessible: isAdmin },
  edit: { isAccessible: isAdmin },
  delete: { isAccessible: isAdmin },
  bulkDelete: { isAccessible: isAdmin },
};

const shopNavigation = {
  name: "Shop Management",
  icon: "Store",
};

// register adapter
AdminJS.registerAdapter(AdminJSSequelize);

const componentLoader = new ComponentLoader();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const Components = {
  Dashboard: componentLoader.add(
    "Dashboard",
    path.join(__dirname, "dashboard.jsx"),
  ),
  ProductCardsList: componentLoader.add(
    "ProductCardsList",
    path.join(__dirname, "product-cards-list.jsx"),
  ),
  ProductShow: componentLoader.add(
    "ProductShow",
    path.join(__dirname, "product-show.jsx"),
  ),
  ProductImage: componentLoader.add(
    "ProductImage",
    path.join(__dirname, "product-image.jsx"),
  ),
  ProductImageUpload: componentLoader.add(
    "ProductImageUpload",
    path.join(__dirname, "product-image-upload.jsx"),
  ),
};

const productResource = {
  resource: Product,
  options: {
    navigation: shopNavigation,
    actions: {
      list: {
        component: Components.ProductCardsList,
      },
      show: {
        isAccessible: () => true,
        component: Components.ProductShow,
      },
      new: { isAccessible: isAdmin },
      edit: { isAccessible: isAdmin },
      delete: { isAccessible: isAdmin },
      bulkDelete: { isAccessible: isAdmin },
    },
    listProperties: [
      "name",
      "categoryId",
      "imageUrl",
      "stock",
      "price",
      "isActive",
    ],
    showProperties: [
      "id",
      "name",
      "sku",
      "categoryId",
      "isActive",
      "imageUrl",
      "stock",
      "price",
      "description",
      "createdAt",
      "updatedAt",
    ],
    editProperties: [
      "name",
      "sku",
      "categoryId",
      "isActive",
      "uploadImage",
      "imagePublicId",
      "stock",
      "price",
      "description",
    ],
    filterProperties: ["name", "categoryId", "isActive", "stock", "price"],
    properties: {
      uploadImage: {
        type: "string",
        isVisible: {
          list: false,
          filter: false,
          show: false,
          edit: true,
        },
        label: "Upload Image",
        components: {
          edit: Components.ProductImageUpload,
        },
      },
      imageUrl: {
        description:
          "Upload an image file and save only the Cloudinary URL in PostgreSQL",
        isVisible: {
          list: true,
          filter: false,
          show: true,
          edit: false,
        },
        components: {
          list: Components.ProductImage,
          show: Components.ProductImage,
        },
      },
      imagePublicId: {
        isVisible: {
          list: false,
          filter: false,
          show: false,
          edit: false,
        },
      },
    },
  },
};

const admin = new AdminJS({
  rootPath: "/admin",
  componentLoader,
  branding: {
    companyName: "Shop Management",
    withMadeWithLove: false,
  },
  locale: {
    translations: {
      labels: {
        navigation: "Shop Management",
      },
    },
  },
  assets: {
    styles: ["/custom/admin-theme.css?v=10.0"],
    scripts: ["/custom/admin-theme.js?v=10.0"],
  },
  dashboard: {
    component: Components.Dashboard,
    handler: async () => {
      const [users, categories, products, orders, featuredGems, criticalStock] =
        await Promise.all([
          User.count(),
          Category.count(),
          Product.count(),
          Order.count(),
          Product.count({ where: { isActive: true } }),
          Product.count({ where: { stock: { [Op.lte]: 5 } } }),
        ]);

      const totalRevenueRaw = await Order.sum("totalAmount");

      const recentProducts = await Product.findAll({
        attributes: ["id", "name", "price", "createdAt"],
        order: [["createdAt", "DESC"]],
        limit: 4,
      });

      const allCategories = await Category.findAll({
        attributes: ["id", "name"],
        order: [["name", "ASC"]],
      });

      const categoryDistribution = await Promise.all(
        allCategories.map(async (category) => {
          const count = await Product.count({
            where: { categoryId: category.id },
          });
          return { name: category.name, count };
        }),
      );

      return {
        users,
        categories,
        products,
        orders,
        featuredGems,
        criticalStock,
        revenue: Number(totalRevenueRaw || 0),
        recentProducts: recentProducts.map((product) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price || 0),
          createdAt: product.createdAt,
        })),
        categoryDistribution,
      };
    },
  },

  resources: [
    {
      resource: User,
      options: { actions: restrictToAdmin },
    },
    {
      resource: Category,
      options: {
        navigation: shopNavigation,
        actions: {
          new: { isAccessible: isAdmin },
          edit: { isAccessible: isAdmin },
          delete: { isAccessible: isAdmin },
          bulkDelete: { isAccessible: isAdmin },
        },
      },
    },
    productResource,
    {
      resource: Order,
      options: {
        navigation: shopNavigation,
      },
    },
    {
      resource: OrderItem,
      options: {
        navigation: shopNavigation,
      },
    },
    {
      resource: Setting,
      options: { actions: restrictToAdmin },
    },
  ],
});

if (process.env.NODE_ENV !== "production") {
  admin.watch();
}

const router = AdminJSExpress.buildAuthenticatedRouter(admin, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (user && (user.role === "admin" || user.role === "user")) {
      return user;
    }
    return null;
  },
  cookieName: "adminjs",
  cookiePassword: "secretcookie",
});

export default router;
