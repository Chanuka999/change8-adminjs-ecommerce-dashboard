import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import cloudinary from "../config/cloudinary.js";

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
  const oldPublicId = product.previous("imagePublicId");
  const newPublicId = product.get("imagePublicId");
  const newImageUrl = product.get("imageUrl");

  const imageRemoved = oldPublicId && !newImageUrl;
  const imageReplaced =
    oldPublicId && newPublicId && oldPublicId !== newPublicId;
  const publicIdCleared = oldPublicId && !newPublicId;

  if (imageRemoved || imageReplaced || publicIdCleared) {
    await deleteFromCloudinary(oldPublicId);
  }

  if (imageRemoved && !newPublicId) {
    product.set("imagePublicId", null);
  }
});

Product.beforeDestroy(async (product) => {
  await deleteFromCloudinary(product.imagePublicId);
});

export default Product;
