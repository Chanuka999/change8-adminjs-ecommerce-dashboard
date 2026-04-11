import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import cloudinary from "../config/cloudinary.js";

const extractPublicIdFromUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    return null;
  }

  try {
    const parsed = new URL(imageUrl);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = parts.findIndex((segment) => segment === "upload");

    if (uploadIndex === -1) {
      return null;
    }

    let cloudinaryPath = parts.slice(uploadIndex + 1);

    // Drop transformation/version prefixes if present.
    while (cloudinaryPath.length > 0) {
      const head = cloudinaryPath[0];
      if (/^v\d+$/.test(head)) {
        cloudinaryPath.shift();
        break;
      }

      if (head.includes(",") || head.includes("_")) {
        cloudinaryPath.shift();
        continue;
      }

      break;
    }

    if (cloudinaryPath.length === 0) {
      return null;
    }

    const last = cloudinaryPath[cloudinaryPath.length - 1];
    cloudinaryPath[cloudinaryPath.length - 1] = last.replace(/\.[^.]+$/, "");

    return decodeURIComponent(cloudinaryPath.join("/"));
  } catch {
    return null;
  }
};

const resolvePublicId = (productLike) => {
  return (
    productLike?.imagePublicId ||
    extractPublicIdFromUrl(productLike?.imageUrl) ||
    null
  );
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (error) {
    // Do not block DB operations if cloud cleanup fails.
    console.error("Cloudinary delete failed:", error.message);
  }
};

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imagePublicId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Products",
    timestamps: true,
  },
);

Product.beforeUpdate(async (product) => {
  const oldPublicId =
    product.previous("imagePublicId") ||
    extractPublicIdFromUrl(product.previous("imageUrl"));
  const newPublicId =
    product.get("imagePublicId") ||
    extractPublicIdFromUrl(product.get("imageUrl"));

  if (oldPublicId && oldPublicId !== newPublicId) {
    await deleteFromCloudinary(oldPublicId);
  }

  if (!product.get("imageUrl")) {
    product.set("imagePublicId", null);
  }
});

Product.beforeDestroy(async (product) => {
  await deleteFromCloudinary(resolvePublicId(product));
});

Product.beforeBulkDestroy(async (options) => {
  if (!options?.where) {
    return;
  }

  const products = await Product.findAll({
    where: options.where,
    attributes: ["id", "imageUrl", "imagePublicId"],
  });

  await Promise.all(
    products.map(async (product) => {
      await deleteFromCloudinary(resolvePublicId(product));
    }),
  );
});

export default Product;
