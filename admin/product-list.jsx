import React, { useState, useEffect } from "react";

const listContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
  padding: "20px",
};

const cardStyle = {
  borderRadius: "16px",
  overflow: "hidden",
  backgroundColor: "#1a2332",
  color: "#ffffff",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const cardHoverStyle = {
  ...cardStyle,
  transform: "translateY(-4px)",
  boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
};

const imageContainerStyle = {
  width: "100%",
  height: "200px",
  backgroundColor: "#f1f5f9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const cardContentStyle = {
  padding: "16px",
};

const productNameStyle = {
  fontSize: "16px",
  fontWeight: 700,
  marginBottom: "8px",
  lineHeight: "1.4",
  minHeight: "32px",
};

const categoryStyle = {
  fontSize: "12px",
  color: "#94a3b8",
  marginBottom: "8px",
};

const metricsRowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "8px",
  marginBottom: "12px",
};

const metricStyle = {
  fontSize: "12px",
};

const metricLabelStyle = {
  color: "#94a3b8",
  fontSize: "10px",
  textTransform: "uppercase",
  marginBottom: "2px",
};

const metricValueStyle = {
  fontSize: "14px",
  fontWeight: 700,
};

const priceStyle = {
  fontSize: "14px",
  fontWeight: 700,
  marginBottom: "12px",
  color: "#10b981",
};

const badgeStyle = {
  display: "inline-block",
  backgroundColor: "#10b981",
  color: "#ffffff",
  padding: "4px 8px",
  borderRadius: "6px",
  fontSize: "10px",
  fontWeight: 700,
  marginBottom: "12px",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #4b5563",
  backgroundColor: "#2d3748",
  color: "#60a5fa",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "12px",
  transition: "background-color 0.2s",
};

const ProductListView = (props) => {
  const { records = [] } = props;
  const [hoveredId, setHoveredId] = useState(null);

  const handleViewDetails = (record) => {
    const recordId = record?.id || record?.params?.id;
    if (recordId) {
      window.location.href = `/admin/resources/Products/records/${recordId}/show`;
    }
  };

  if (!records || records.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>
        No products found
      </div>
    );
  }

  return (
    <div style={listContainerStyle}>
      {records.map((record) => {
        // Handle both direct record object and AdminJS RecordJSON
        const recordData = record?.params || record;
        const productId = recordData?.id;
        const name = recordData?.name || "Unnamed Product";
        const category = recordData?.categoryId || "-";
        const stock = Number(recordData?.stock || 0);
        const price = Number(recordData?.price || 0);
        const imageUrl = recordData?.imageUrl || "";
        const isActive = Boolean(recordData?.isActive);

        const formatPrice = (val) => {
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(val);
        };

        const isHovered = hoveredId === productId;

        return (
          <div
            key={productId}
            style={isHovered ? cardHoverStyle : cardStyle}
            onMouseEnter={() => setHoveredId(productId)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div style={imageContainerStyle}>
              {imageUrl ? (
                <img src={imageUrl} alt={name} style={imageStyle} />
              ) : (
                <div style={{ color: "#cbd5e1", fontSize: "12px" }}>
                  No Image
                </div>
              )}
            </div>

            <div style={cardContentStyle}>
              <div style={productNameStyle}>{name}</div>

              <div style={categoryStyle}>Category: {category}</div>

              <div style={metricsRowStyle}>
                <div style={metricStyle}>
                  <div style={metricLabelStyle}>Stock</div>
                  <div style={metricValueStyle}>{stock}</div>
                </div>
                <div style={metricStyle}>
                  <div style={metricLabelStyle}>Price</div>
                  <div style={metricValueStyle}>{formatPrice(price)}</div>
                </div>
              </div>

              <div style={priceStyle}>Rs. {price.toFixed(2)}</div>

              {isActive && <div style={badgeStyle}>ACTIVE</div>}

              <button
                type="button"
                style={buttonStyle}
                onClick={() => handleViewDetails(record)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#374151";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#2d3748";
                }}
              >
                View details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductListView;
