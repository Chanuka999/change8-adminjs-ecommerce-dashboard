import React, { useEffect, useState } from "react";

const cellStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minHeight: "56px",
};

const imageStyle = {
  width: "64px",
  height: "42px",
  objectFit: "cover",
  borderRadius: "10px",
  border: "1px solid rgba(148, 163, 184, 0.35)",
  background: "#f8fafc",
  flexShrink: 0,
};

const fallbackStyle = {
  width: "64px",
  height: "42px",
  borderRadius: "10px",
  border: "1px dashed rgba(148, 163, 184, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px",
  color: "#64748b",
  background: "#f8fafc",
  flexShrink: 0,
};

const textStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};

const getOptimizedImageUrl = (url, width = 320, quality = "auto") => {
  const source = String(url || "").trim();
  if (!source) {
    return "";
  }

  if (!source.includes("res.cloudinary.com") || !source.includes("/upload/")) {
    return source;
  }

  return source.replace(
    "/upload/",
    `/upload/f_auto,q_${quality},w_${width},c_limit,dpr_auto/`,
  );
};

const ProductImage = (props) => {
  const imageUrl = props?.record?.params?.[props?.property?.path];
  const optimizedImageUrl = getOptimizedImageUrl(imageUrl);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  if (!imageUrl) {
    return <div style={fallbackStyle}>No image</div>;
  }

  if (hasError) {
    return (
      <div style={cellStyle}>
        <div style={fallbackStyle}>Invalid</div>
        <div style={textStyle}>
          <span style={{ fontWeight: 600, color: "#0f172a" }}>Image URL</span>
          <a
            href={imageUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontSize: "12px",
            }}
          >
            Open link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={cellStyle}>
      <img
        src={optimizedImageUrl || imageUrl}
        alt="Product"
        style={imageStyle}
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
      />
      <div style={textStyle}>
        <span style={{ fontWeight: 600, color: "#0f172a" }}>Preview</span>
        <a
          href={imageUrl}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#2563eb", textDecoration: "none", fontSize: "12px" }}
        >
          Open image
        </a>
      </div>
    </div>
  );
};

export default ProductImage;
