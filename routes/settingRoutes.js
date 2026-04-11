import express from "express";
import {
  createSetting,
  getSettings,
  getSettingById,
  updateSetting,
  deleteSetting,
} from "../controllers/settingController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware, requireRole("admin"));

router.post("/", createSetting);
router.get("/", getSettings);
router.get("/:id", getSettingById);
router.put("/:id", updateSetting);
router.delete("/:id", deleteSetting);

export default router;
