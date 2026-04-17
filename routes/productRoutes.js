import express from "express";
import multer from "multer";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public read routes for storefront/user views.
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-only write routes.
router.use(authMiddleware, requireRole("admin"));
router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
