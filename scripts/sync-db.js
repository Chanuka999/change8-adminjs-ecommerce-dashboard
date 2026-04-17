import dotenv from "dotenv";
import sequelize from "../config/database.js";
import "../model/index.js";

dotenv.config();

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return String(value).trim().toLowerCase() === "true";
};

const run = async () => {
  const useAlter = parseBoolean(process.env.DB_SYNC_ALTER, false);

  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    await sequelize.sync({ alter: useAlter, force: false });
    console.log(`Database sync completed successfully (alter=${useAlter}).`);

    process.exit(0);
  } catch (error) {
    console.error("Database sync failed:", error?.message || error);
    process.exit(1);
  }
};

run();
