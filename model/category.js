import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Category = sequelize.define(
  "Category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "Categories",
    timestamps: true,
  },
);

export default Category;
