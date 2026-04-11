import { Product, Category } from "../model/index.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const uploadImageToCloudinary = (fileBuffer, folder = "products") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

export const createProduct = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (req.file?.buffer) {
      const uploadedImage = await uploadImageToCloudinary(req.file.buffer);
      payload.imageUrl = uploadedImage.secure_url;
      payload.imagePublicId = uploadedImage.public_id;
    }

    const product = await Product.create(payload);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, as: "category" }],
      order: [["id", "DESC"]],
    });

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: "category" }],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const payload = { ...req.body };

    if (req.file?.buffer) {
      const uploadedImage = await uploadImageToCloudinary(req.file.buffer);
      payload.imageUrl = uploadedImage.secure_url;
      payload.imagePublicId = uploadedImage.public_id;
    }

    await product.update(payload);
    return res.json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    return res.json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
