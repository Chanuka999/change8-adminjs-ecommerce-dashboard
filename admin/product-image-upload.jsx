import React, { useEffect, useState } from "react";

const wrapperStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const previewStyle = {
  width: "140px",
  height: "96px",
  objectFit: "cover",
  borderRadius: "12px",
  border: "1px solid rgba(148, 163, 184, 0.35)",
  background: "#f8fafc",
};

const hintStyle = {
  fontSize: "12px",
  color: "#64748b",
};

const ProductImageUpload = (props) => {
  const { onChange, record } = props;
  const currentValue = record?.params?.imageUrl || "";
  const currentPublicId = record?.params?.imagePublicId || "";
  const [previewUrl, setPreviewUrl] = useState(currentValue);
  const [publicId, setPublicId] = useState(currentPublicId);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPreviewUrl(currentValue);
    setPublicId(currentPublicId);
  }, [currentValue, currentPublicId]);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/uploads/image", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Image upload failed");
      }

      const uploadedUrl = payload.url || "";
      const uploadedPublicId = payload.publicId || "";
      setPreviewUrl(uploadedUrl);
      setPublicId(uploadedPublicId);
      onChange?.("imageUrl", uploadedUrl);
      onChange?.("imagePublicId", uploadedPublicId);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemove = () => {
    setPreviewUrl("");
    setPublicId("");
    onChange?.("imageUrl", "");
    onChange?.("imagePublicId", "");
  };

  return (
    <div style={wrapperStyle}>
      <input type="file" accept="image/*" onChange={handleUpload} />
      <div style={hintStyle}>
        {uploading
          ? "Uploading to Cloudinary..."
          : "Choose an image file to upload"}
      </div>

      {previewUrl ? (
        <>
          <img src={previewUrl} alt="Product preview" style={previewStyle} />
          <button
            type="button"
            onClick={handleRemove}
            style={{
              width: "fit-content",
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid #ef4444",
              color: "#ef4444",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Remove image
          </button>
        </>
      ) : null}

      {error ? (
        <div style={{ ...hintStyle, color: "#dc2626" }}>{error}</div>
      ) : null}

      <input type="hidden" name="imageUrl" value={previewUrl} readOnly />
      <input type="hidden" name="imagePublicId" value={publicId} readOnly />
    </div>
  );
};

export default ProductImageUpload;
