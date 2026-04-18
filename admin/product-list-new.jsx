import React, { useState, useEffect } from "react";

const listContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
  padding: "20px",
  minHeight: "400px",
};

const loadingStyle = {
  padding: "20px",
  textAlign: "center",
  color: "#64748b",
  gridColumn: "1 / -1",
};

const emptyStyle = {
  padding: "40px 20px",
  textAlign: "center",
  color: "#64748b",
  gridColumn: "1 / -1",
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

const getOptimizedImageUrl = (url, width = 560, quality = "auto") => {
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

const ProductListView = (props) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products?lean=true&limit=60", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(Array.isArray(data) ? data : data.products || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewDetails = (productId) => {
    if (productId) {
      window.location.href = `/admin/resources/Products/records/${productId}/show`;
    }
  };

  if (loading) {
    return (
      <div style={listContainerStyle}>
        <div style={loadingStyle}>Loading products...</div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={listContainerStyle}>
        <div style={emptyStyle}>
          <p>No products found</p>
        </div>
      </div>
    );
  }

  return (
    <div style={listContainerStyle}>
      {products.map((product) => {
        const productId = product?.id;
        const name = product?.name || "Unnamed Product";
        const category = product?.categoryId || "-";
        const stock = Number(product?.stock || 0);
        const price = Number(product?.price || 0);
        const imageUrl = product?.imageUrl || "";
        const isActive = Boolean(product?.isActive);

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
                <img
                  src={getOptimizedImageUrl(imageUrl) || imageUrl}
                  alt={name}
                  style={imageStyle}
                  loading="lazy"
                  decoding="async"
                />
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
                onClick={() => handleViewDetails(productId)}
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
