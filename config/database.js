import { Sequelize } from "sequelize";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const useSsl =
  Boolean(databaseUrl) ||
  String(process.env.DB_SSL || "")
    .trim()
    .toLowerCase() === "true";

const baseOptions = {
  dialect: "postgres",
  logging: false,
  dialectModule: pg,
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
};

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, baseOptions)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        ...baseOptions,
        host: process.env.DB_HOST,
      },
    );

export default sequelize;
