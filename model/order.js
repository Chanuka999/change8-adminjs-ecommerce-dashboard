import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define(
  "Order",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "paid",
        "processing",
        "shipped",
        "completed",
        "cancelled",
      ),
      defaultValue: "pending",
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Orders",
    timestamps: true,
  },
);

export default Order;
