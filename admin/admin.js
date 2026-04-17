import AdminJS, { ComponentLoader } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from "@adminjs/sequelize";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";
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

const slugify = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const parseSizeStock = (rawValue) => {
  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return {};
  }

  let source = rawValue;
  if (typeof source === "string") {
    const trimmed = source.trim();
    if (!trimmed) {
      return {};
    }

    try {
      source = JSON.parse(trimmed);
    } catch {
      throw new Error("Size stock format is invalid");
    }
  }

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new Error("Size stock must be an object");
  }

  const normalized = {};

  for (const [rawSize, rawQty] of Object.entries(source)) {
    const size = String(rawSize || "")
      .trim()
      .toUpperCase();

    if (!size) {
      continue;
    }

    const qty = Number(rawQty);
    if (!Number.isFinite(qty)) {
      throw new Error(`Invalid stock value for size ${size}`);
    }

    if (qty < 0) {
      throw new Error(`Stock cannot be negative for size ${size}`);
    }

    normalized[size] = Math.trunc(qty);
  }

  return normalized;
};

const sanitizeProductPayload = (request) => {
  if (request?.method !== "post") {
    return request;
  }

  const payload = { ...(request.payload || {}) };

  const rawCategoryId =
    payload.categoryId ??
    payload["category.id"] ??
    payload["categoryId.id"] ??
    payload?.category?.id ??
    null;
  const categoryId = Number(rawCategoryId);
  if (!Number.isFinite(categoryId) || categoryId <= 0) {
    throw new Error("Category is required for product");
  }

  payload.categoryId = categoryId;

  if (typeof payload.name === "string") {
    payload.name = payload.name.trim();
  }

  if (typeof payload.sku === "string") {
    payload.sku = payload.sku.trim();
  }

  if (!payload.name) {
    throw new Error("Product name is required");
  }

  if (!payload.sku) {
    throw new Error("SKU is required");
  }

  if (payload.price === "") {
    payload.price = 0;
  }

  if (payload.stock === "") {
    payload.stock = 0;
  }

  if (payload.price !== undefined && payload.price !== null) {
    const price = Number(payload.price);
    if (!Number.isFinite(price)) {
      throw new Error("Price must be a valid number");
    }
    payload.price = price;
  }

  if (payload.stock !== undefined && payload.stock !== null) {
    const stock = Number(payload.stock);
    if (!Number.isFinite(stock)) {
      throw new Error("Stock must be a valid number");
    }
    payload.stock = stock;
  }

  if (payload.imageUrl === "") {
    payload.imageUrl = null;
  }

  if (payload.imagePublicId === "") {
    payload.imagePublicId = null;
  }

  if (payload.uploadImage === "") {
    delete payload.uploadImage;
  }

  const sizeStockPayload =
    payload.sizeStockText !== undefined
      ? payload.sizeStockText
      : payload.sizeStock;
  const parsedSizeStock = parseSizeStock(sizeStockPayload);
  payload.sizeStock = parsedSizeStock;

  if (Object.keys(parsedSizeStock).length > 0) {
    payload.stock = Object.values(parsedSizeStock).reduce(
      (sum, qty) => sum + Number(qty || 0),
      0,
    );
  } else {
    // If no sizeStock defined, ensure stock is at least 0
    if (payload.stock === undefined || payload.stock === null) {
      payload.stock = 0;
    }
  }

  // uploadImage is a virtual AdminJS field; never persist it.
  for (const key of Object.keys(payload)) {
    if (key === "uploadImage" || key.startsWith("uploadImage.")) {
      delete payload[key];
    }

    if (key === "sizeStockText" || key.startsWith("sizeStockText.")) {
      delete payload[key];
    }
  }

  request.payload = payload;
  return request;
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
  ProductSizeStockInput: componentLoader.add(
    "ProductSizeStockInput",
    path.join(__dirname, "product-size-stock-input.jsx"),
  ),
  CategoryShow: componentLoader.add(
    "CategoryShow",
    path.join(__dirname, "category-show.jsx"),
  ),
  About: componentLoader.add("About", path.join(__dirname, "about.jsx")),
};

const productResource = {
  resource: Product,
  options: {
    navigation: shopNavigation,
    actions: {
      list: {
        isAccessible: isAdmin,
      },
      show: {
        isAccessible: () => true,
        component: Components.ProductShow,
      },
      new: { isAccessible: isAdmin, before: sanitizeProductPayload },
      edit: { isAccessible: isAdmin, before: sanitizeProductPayload },
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
      "sizeStock",
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
      "sizeStockText",
      "price",
      "description",
    ],
    filterProperties: ["name", "categoryId", "isActive", "stock", "price"],
    properties: {
      categoryId: {
        reference: "Categories",
        isRequired: true,
      },
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
      sizeStock: {
        type: "mixed",
        isVisible: {
          list: false,
          filter: false,
          show: true,
          edit: false,
        },
      },
      sizeStockText: {
        type: "string",
        isVisible: {
          list: false,
          filter: false,
          show: false,
          edit: true,
        },
        label: "Sizes & Stock",
        components: {
          edit: Components.ProductSizeStockInput,
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
    styles: ["/custom/admin-theme.css?v=11.14"],
    scripts: ["/custom/admin-theme.js?v=13.5"],
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
  pages: {
    About: {
      label: "About",
      component: Components.About,
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
          new: {
            isAccessible: isAdmin,
            before: async (request) => {
              if (request?.method === "post") {
                const payload = { ...(request.payload || {}) };
                if (!payload.slug && payload.name) {
                  payload.slug = slugify(payload.name);
                }
                request.payload = payload;
              }

              return request;
            },
          },
          edit: {
            isAccessible: isAdmin,
            before: async (request) => {
              if (request?.method === "post") {
                const payload = { ...(request.payload || {}) };
                if (!payload.slug && payload.name) {
                  payload.slug = slugify(payload.name);
                }
                request.payload = payload;
              }

              return request;
            },
          },
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

const shouldWatchAdmin =
  String(process.env.ADMIN_WATCH || "")
    .trim()
    .toLowerCase() === "true";

if (shouldWatchAdmin) {
  admin.watch();
}

const SequelizeSessionStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeSessionStore({
  db: sequelize,
  tableName: "AdminSessions",
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 12 * 60 * 60 * 1000,
});

sessionStore.sync().catch((error) => {
  console.error("Admin session store sync failed:", error?.message || error);
});

const adminCookieSecret =
  process.env.SESSION_SECRET ||
  process.env.JWT_SECRET ||
  "change8-admin-cookie-secret";

const router = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
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
    cookiePassword: adminCookieSecret,
  },
  null,
  {
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure:
        String(process.env.NODE_ENV || "")
          .trim()
          .toLowerCase() === "production",
      maxAge: 12 * 60 * 60 * 1000,
    },
  },
);

router.get("/context/current-user", async (req, res) => {
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

    return res.json({
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
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
        attributes: [
          "id",
          "name",
          "sku",
          "price",
          "imageUrl",
          "isActive",
          "stock",
          "sizeStock",
        ],
        order: [["id", "DESC"]],
      }),
      Order.findAll({ attributes: ["userId"], raw: true }),
      productId
        ? Product.findByPk(productId, {
            attributes: [
              "id",
              "name",
              "sku",
              "price",
              "imageUrl",
              "isActive",
              "stock",
              "sizeStock",
            ],
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

    const normalizedItems = lineItems
      .map((item) => {
        const quantity = Math.max(1, Number(item.quantity || 1));
        const unitPrice = Math.max(0, Number(item.unitPrice || 0));
        const totalPrice = quantity * unitPrice;

        return {
          productId: Number(item.productId || 0),
          size: item.size ? String(item.size).trim().toUpperCase() : null,
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

    const productIds = Array.from(
      new Set(normalizedItems.map((item) => Number(item.productId))),
    );

    const products = await Product.findAll({
      where: { id: productIds },
      attributes: ["id", "name", "stock", "sizeStock"],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    const productMap = new Map(
      products.map((product) => [Number(product.id), product]),
    );

    for (const item of normalizedItems) {
      const product = productMap.get(Number(item.productId));
      if (!product) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "One or more products are invalid" });
      }

      const rawSizeStock = product.get("sizeStock");
      const parsedSizeStock =
        rawSizeStock &&
        typeof rawSizeStock === "object" &&
        !Array.isArray(rawSizeStock)
          ? { ...rawSizeStock }
          : {};
      const sizeKeys = Object.keys(parsedSizeStock);

      if (sizeKeys.length > 0) {
        const selectedSize = String(item.size || "")
          .trim()
          .toUpperCase();

        if (!selectedSize) {
          await transaction.rollback();
          return res.status(400).json({
            message: `Please select a size for ${product.get("name") || "the selected product"}`,
          });
        }

        if (
          !Object.prototype.hasOwnProperty.call(parsedSizeStock, selectedSize)
        ) {
          await transaction.rollback();
          return res.status(400).json({
            message: `Size ${selectedSize} is not available for ${product.get("name") || "the selected product"}`,
          });
        }

        const availableQty = Math.max(
          0,
          Number(parsedSizeStock[selectedSize] || 0),
        );
        if (item.quantity > availableQty) {
          await transaction.rollback();
          return res.status(400).json({
            message: `${product.get("name") || "Product"} (${selectedSize}) has only ${availableQty} in stock`,
          });
        }

        parsedSizeStock[selectedSize] = availableQty - item.quantity;
        const recalculatedStock = Object.values(parsedSizeStock).reduce(
          (sum, qty) => sum + Math.max(0, Number(qty || 0)),
          0,
        );

        product.set("sizeStock", parsedSizeStock);
        product.set("stock", recalculatedStock);
      } else {
        const currentStock = Math.max(0, Number(product.get("stock") || 0));
        if (item.quantity > currentStock) {
          await transaction.rollback();
          return res.status(400).json({
            message: `${product.get("name") || "Product"} has only ${currentStock} in stock`,
          });
        }

        product.set("stock", currentStock - item.quantity);
      }
    }

    await Promise.all(
      Array.from(productMap.values()).map(async (product) => {
        await product.save({ transaction });
      }),
    );

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

    await OrderItem.bulkCreate(
      normalizedItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      { transaction },
    );

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
