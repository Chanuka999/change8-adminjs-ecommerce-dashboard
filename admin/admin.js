import AdminJS, { ComponentLoader } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from "@adminjs/sequelize";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
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
  Register: componentLoader.add(
    "Register",
    path.join(__dirname, "register.jsx"),
  ),
  ProductCardsList: componentLoader.add(
    "ProductCardsList",
    path.join(__dirname, "product-cards-list.jsx"),
  ),
  ProductShow: componentLoader.add(
    "ProductShow",
    path.join(__dirname, "product-show.jsx"),
  ),
  OrderCreate: componentLoader.add(
    "OrderCreate",
    path.join(__dirname, "order-create.jsx"),
  ),
  OrderShow: componentLoader.add(
    "OrderShow",
    path.join(__dirname, "order-show.jsx"),
  ),
  OrderItemShow: componentLoader.add(
    "OrderItemShow",
    path.join(__dirname, "order-item-show.jsx"),
  ),
  ProductImage: componentLoader.add(
    "ProductImage",
    path.join(__dirname, "product-image.jsx"),
  ),
  ProductImageUpload: componentLoader.add(
    "ProductImageUpload",
    path.join(__dirname, "product-image-upload.jsx"),
  ),
  CategoryShow: componentLoader.add(
    "CategoryShow",
    path.join(__dirname, "category-show.jsx"),
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
        "Shop Management": "Shop Management",
        Orders: "Orders",
        OrderItems: "Order Items",
      },
    },
  },
  assets: {
    styles: ["/custom/admin-theme.css?v=11.1"],
    scripts: ["/custom/admin-theme.js?v=11.1"],
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
          show: {
            component: Components.CategoryShow,
          },
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
        actions: {
          new: {
            component: Components.OrderCreate,
          },
          show: {
            component: Components.OrderShow,
          },
        },
      },
    },
    {
      resource: OrderItem,
      options: {
        navigation: shopNavigation,
        actions: {
          show: {
            component: Components.OrderItemShow,
          },
        },
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
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const rawPassword = String(password || "");

    if (!normalizedEmail || !rawPassword) {
      return null;
    }

    const user = await User.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("email")),
        normalizedEmail,
      ),
    });

    if (!user || !(user.role === "admin" || user.role === "user")) {
      return null;
    }

    // Accept bcrypt hashed passwords and legacy plain-text values.
    const isBcryptMatch = await bcrypt
      .compare(rawPassword, user.password)
      .catch(() => false);
    const isLegacyPlainMatch = user.password === rawPassword;

    if (!isBcryptMatch && !isLegacyPlainMatch) {
      return null;
    }

    return user;
  },
  cookieName: "adminjs",
  cookiePassword: "secretcookie",
});

router.get("/context/order-create", async (req, res) => {
  try {
    const rawSessionAdmin = req?.session?.adminUser;
    const sessionAdmin =
      typeof rawSessionAdmin === "string"
        ? JSON.parse(rawSessionAdmin)
        : rawSessionAdmin;

    if (!sessionAdmin?.email && !sessionAdmin?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const currentUser = await User.findOne({
      where: {
        [Op.or]: [
          sessionAdmin?.id ? { id: Number(sessionAdmin.id) } : null,
          sessionAdmin?.email ? { email: sessionAdmin.email } : null,
        ].filter(Boolean),
      },
      attributes: ["id", "name", "email", "role"],
    });

    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    const productId = req.query?.productId;

    const [users, products, orderRows, selectedProduct] = await Promise.all([
      currentUser.role === "admin"
        ? User.findAll({
            attributes: ["id", "name", "email", "role"],
            order: [["id", "DESC"]],
          })
        : Promise.resolve([currentUser]),
      Product.findAll({
        attributes: ["id", "name", "sku", "price", "imageUrl", "isActive"],
        order: [["id", "DESC"]],
      }),
      Order.findAll({ attributes: ["userId"], raw: true }),
      productId
        ? Product.findByPk(productId, {
            attributes: ["id", "name", "sku", "price", "imageUrl", "isActive"],
          })
        : Promise.resolve(null),
    ]);

    const orderCountByUser = orderRows.reduce((acc, row) => {
      const key = String(row.userId);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return res.json({
      currentUser,
      users,
      products,
      selectedProduct,
      orderCountByUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/context/order-create/submit", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const rawSessionAdmin = req?.session?.adminUser;
    const sessionAdmin =
      typeof rawSessionAdmin === "string"
        ? JSON.parse(rawSessionAdmin)
        : rawSessionAdmin;

    if (!sessionAdmin?.email && !sessionAdmin?.id) {
      await transaction.rollback();
      return res.status(401).json({ message: "Unauthorized" });
    }

    const currentUser = await User.findOne({
      where: {
        [Op.or]: [
          sessionAdmin?.id ? { id: Number(sessionAdmin.id) } : null,
          sessionAdmin?.email ? { email: sessionAdmin.email } : null,
        ].filter(Boolean),
      },
      attributes: ["id", "role"],
      transaction,
    });

    if (!currentUser) {
      await transaction.rollback();
      return res.status(404).json({ message: "Current user not found" });
    }

    const rawPayload =
      (req.body && Object.keys(req.body).length ? req.body : null) ||
      req.fields ||
      {};

    const payload =
      typeof rawPayload?.payload === "string"
        ? JSON.parse(rawPayload.payload)
        : rawPayload;

    const lineItems = Array.isArray(payload.lineItems) ? payload.lineItems : [];

    if (!lineItems.length) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "At least one line item is required" });
    }

    const resolvedUserId =
      currentUser.role === "user"
        ? currentUser.id
        : Number(payload.userId || 0);

    if (!resolvedUserId) {
      await transaction.rollback();
      return res.status(400).json({ message: "Customer is required" });
    }

    const order = await Order.create(
      {
        userId: resolvedUserId,
        status: payload.status || "pending",
        paymentMethod: payload.paymentMethod || null,
        paymentStatus: payload.paymentStatus || "pending",
        transactionId: payload.transactionId || null,
        shippingName: payload.shippingName || null,
        shippingPhone: payload.shippingPhone || null,
        shippingMethod: payload.shippingMethod || null,
        trackingNumber: payload.trackingNumber || null,
        subtotal: payload.subtotal ?? 0,
        shippingFee: payload.shippingFee ?? 0,
        tax: payload.tax ?? 0,
        discount: payload.discount ?? 0,
        totalAmount: payload.totalAmount ?? 0,
        shippingAddress: payload.shippingAddress || null,
      },
      { transaction },
    );

    const normalizedItems = lineItems
      .map((item) => {
        const quantity = Math.max(1, Number(item.quantity || 1));
        const unitPrice = Math.max(0, Number(item.unitPrice || 0));
        const totalPrice = quantity * unitPrice;

        return {
          orderId: order.id,
          productId: Number(item.productId || 0),
          size: item.size ? String(item.size).trim() : null,
          quantity,
          unitPrice,
          totalPrice,
        };
      })
      .filter((item) => item.productId > 0);

    if (!normalizedItems.length) {
      await transaction.rollback();
      return res.status(400).json({ message: "Valid line items are required" });
    }

    await OrderItem.bulkCreate(normalizedItems, { transaction });

    await transaction.commit();
    return res.status(201).json({ id: order.id });
  } catch (error) {
    await transaction.rollback();
    return res.status(400).json({ message: error.message });
  }
});

router.get("/context/orders/:id/details", async (req, res) => {
  try {
    const rawSessionAdmin = req?.session?.adminUser;
    const sessionAdmin =
      typeof rawSessionAdmin === "string"
        ? JSON.parse(rawSessionAdmin)
        : rawSessionAdmin;

    if (!sessionAdmin?.email && !sessionAdmin?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const currentUser = await User.findOne({
      where: {
        [Op.or]: [
          sessionAdmin?.id ? { id: Number(sessionAdmin.id) } : null,
          sessionAdmin?.email ? { email: sessionAdmin.email } : null,
        ].filter(Boolean),
      },
      attributes: ["id", "role"],
    });

    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "sku", "imageUrl", "price"],
            },
          ],
        },
      ],
      order: [[{ model: OrderItem, as: "items" }, "id", "ASC"]],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      currentUser.role === "user" &&
      Number(order.userId) !== Number(currentUser.id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/context/order-items/:id/details", async (req, res) => {
  try {
    const rawSessionAdmin = req?.session?.adminUser;
    const sessionAdmin =
      typeof rawSessionAdmin === "string"
        ? JSON.parse(rawSessionAdmin)
        : rawSessionAdmin;

    if (!sessionAdmin?.email && !sessionAdmin?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const currentUser = await User.findOne({
      where: {
        [Op.or]: [
          sessionAdmin?.id ? { id: Number(sessionAdmin.id) } : null,
          sessionAdmin?.email ? { email: sessionAdmin.email } : null,
        ].filter(Boolean),
      },
      attributes: ["id", "role", "name", "email"],
    });

    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    const orderItem = await OrderItem.findByPk(req.params.id, {
      include: [
        {
          model: Order,
          as: "order",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email", "role"],
            },
          ],
        },
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "sku", "imageUrl", "price", "stock"],
        },
      ],
    });

    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    if (
      currentUser.role === "user" &&
      Number(orderItem?.order?.userId) !== Number(currentUser.id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(orderItem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
