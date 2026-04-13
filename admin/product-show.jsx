import React from "react";

const pageStyle = {
  display: "grid",
  gap: "18px",
  color: "#e2e8f0",
};

const heroStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(280px, 360px) 1fr",
  gap: "18px",
  alignItems: "stretch",
};

const panelStyle = {
  borderRadius: "20px",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  background:
    "linear-gradient(160deg, rgba(11, 26, 56, 0.96) 0%, rgba(9, 22, 47, 0.96) 100%)",
  boxShadow: "0 20px 40px rgba(2, 6, 23, 0.24)",
  overflow: "hidden",
};

const imageWrapStyle = {
  minHeight: "360px",
  background: "#0f172a",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const heroBodyStyle = {
  padding: "22px",
  display: "grid",
  gap: "16px",
};

const titleStyle = {
  margin: 0,
  fontSize: "clamp(28px, 4vw, 46px)",
  lineHeight: 1.05,
  color: "#f8fafc",
};

const subtitleStyle = {
  margin: 0,
  color: "#94a3b8",
  fontSize: "14px",
};

const badgeStyle = (active) => ({
  display: "inline-flex",
  alignItems: "center",
  width: "fit-content",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  color: active ? "#14532d" : "#7f1d1d",
  background: active ? "#bbf7d0" : "#fecaca",
});

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(160px, 1fr))",
  gap: "12px",
};

const statCardStyle = {
  borderRadius: "16px",
  border: "1px solid rgba(148, 163, 184, 0.15)",
  background: "rgba(15, 23, 42, 0.58)",
  padding: "14px",
};

const statLabelStyle = {
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  color: "#94a3b8",
  marginBottom: "8px",
};

const statValueStyle = {
  fontSize: "16px",
  fontWeight: 700,
  color: "#f8fafc",
  wordBreak: "break-word",
};

const sectionGridStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 0.9fr)",
  gap: "18px",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "14px",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#f5df90",
};

const contentCardStyle = {
  borderRadius: "20px",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  background: "rgba(11, 26, 56, 0.9)",
  padding: "18px",
  boxShadow: "0 16px 28px rgba(2, 6, 23, 0.16)",
};

const infoListStyle = {
  display: "grid",
  gap: "12px",
};

const infoRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  paddingBottom: "10px",
  borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
};

const infoLabelStyle = {
  color: "#94a3b8",
  fontSize: "13px",
};

const infoValueStyle = {
  color: "#f8fafc",
  fontWeight: 600,
  textAlign: "right",
  fontSize: "13px",
};

const descriptionStyle = {
  color: "#cbd5e1",
  lineHeight: 1.7,
  fontSize: "14px",
  whiteSpace: "pre-wrap",
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `Rs. ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const ProductShow = (props) => {
  const record = props?.record;
  const params = record?.params || {};

  const name = params?.name || "Unnamed product";
  const sku = params?.sku || "-";
  const category = params?.categoryId || "-";
  const imageUrl = params?.imageUrl || "";
  const stock = Number(params?.stock || 0);
  const isActive = Boolean(params?.isActive);
  const price = formatCurrency(params?.price);
  const description =
    params?.description || "No description available for this product.";

  return (
    <div style={pageStyle}>
      <style>
        {`
          @media (max-width: 980px) {
            .change8-product-show-hero,
            .change8-product-show-sections {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <div className="change8-product-show-hero" style={heroStyle}>
        <div style={panelStyle}>
          <div style={imageWrapStyle}>
            {imageUrl ? (
              <img src={imageUrl} alt={name} style={imageStyle} />
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                }}
              >
                No image available
              </div>
            )}
          </div>
        </div>

        <div style={panelStyle}>
          <div style={heroBodyStyle}>
            <div>
              <h1 style={titleStyle}>{name}</h1>
              <p style={subtitleStyle}>
                Clean product overview for quick review and management.
              </p>
            </div>

            <div style={badgeStyle(isActive)}>
              {isActive ? "ACTIVE" : "INACTIVE"}
            </div>

            <div style={statsGridStyle}>
              <div style={statCardStyle}>
                <div style={statLabelStyle}>Price</div>
                <div style={statValueStyle}>{price}</div>
              </div>
              <div style={statCardStyle}>
                <div style={statLabelStyle}>Stock</div>
                <div style={statValueStyle}>{stock}</div>
              </div>
              <div style={statCardStyle}>
                <div style={statLabelStyle}>SKU</div>
                <div style={statValueStyle}>{sku}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="change8-product-show-sections" style={sectionGridStyle}>
        <div style={contentCardStyle}>
          <h2 style={sectionTitleStyle}>Description</h2>
          <div style={{ height: 12 }} />
          <div style={descriptionStyle}>{description}</div>
        </div>

        <div style={contentCardStyle}>
          <h2 style={sectionTitleStyle}>Product Details</h2>
          <div style={{ height: 12 }} />
          <div style={infoListStyle}>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Category</span>
              <span style={infoValueStyle}>{category}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Created At</span>
              <span style={infoValueStyle}>
                {formatDate(params?.createdAt)}
              </span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Updated At</span>
              <span style={infoValueStyle}>
                {formatDate(params?.updatedAt)}
              </span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Record ID</span>
              <span style={infoValueStyle}>
                {params?.id || record?.id || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShow;
