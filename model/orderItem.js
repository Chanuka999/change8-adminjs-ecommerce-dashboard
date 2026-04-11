import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "OrderItems",
    timestamps: true,
  },
);

export default OrderItem;
