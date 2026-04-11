import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

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

export default Product;
