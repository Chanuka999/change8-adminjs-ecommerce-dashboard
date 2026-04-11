import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const uploadedImage = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
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

      Readable.from(req.file.buffer).pipe(uploadStream);
    });

    return res.json({
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
