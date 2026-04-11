import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Setting = sequelize.define(
  "Setting",
  {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "string",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Settings",
    timestamps: true,
  },
);

export default Setting;
