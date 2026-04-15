import React, { useEffect } from "react";

const pageStyle = {
  minHeight: "100%",
  padding: "24px",
  color: "#111827",
  background: "#ffffff",
};

const topBarStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "18px",
  flexWrap: "wrap",
};

const backLinkStyle = {
  color: "#111827",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  fontWeight: 700,
};

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(320px, 1.05fr) minmax(360px, 0.95fr)",
  gap: "18px",
  alignItems: "start",
};

const cardStyle = {
  borderRadius: "22px",
  border: "1px solid rgba(17, 24, 39, 0.08)",
  background: "#ffffff",
  boxShadow: "0 18px 34px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
};

const imageCardStyle = {
  ...cardStyle,
  display: "grid",
  gridTemplateRows: "1fr auto",
  minHeight: "500px",
};

const imageWrapStyle = {
  background: "#f8fafc",
  minHeight: "340px",
  display: "grid",
  placeItems: "center",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const imageFallbackStyle = {
  width: "100%",
  height: "100%",
  display: "grid",
  placeItems: "center",
  color: "#64748b",
  background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
  fontSize: "14px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const imageFooterStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  padding: "16px 18px 18px",
  background: "#ffffff",
  borderTop: "1px solid rgba(17, 24, 39, 0.08)",
  flexWrap: "wrap",
};

const titleStyle = {
  margin: 0,
  fontSize: "clamp(30px, 4vw, 54px)",
  lineHeight: 1,
  fontWeight: 800,
  color: "#111827",
  textTransform: "capitalize",
};

const subtitleStyle = {
  margin: "8px 0 0",
  color: "#6b7280",
  fontSize: "14px",
};

const pillStyle = (active) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  width: "fit-content",
  padding: "7px 12px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: active ? "#14532d" : "#7f1d1d",
  background: active ? "#bbf7d0" : "#fecaca",
});

const pillDotStyle = (active) => ({
  width: "8px",
  height: "8px",
  borderRadius: "999px",
  background: active ? "#22c55e" : "#ef4444",
});

const infoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "12px",
  marginTop: "18px",
};

const infoCardStyle = {
  borderRadius: "16px",
  border: "1px solid rgba(17, 24, 39, 0.08)",
  background: "#f8fafc",
  padding: "14px",
};

const infoLabelStyle = {
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  color: "#6b7280",
  marginBottom: "8px",
};

const infoValueStyle = {
  fontSize: "17px",
  fontWeight: 700,
  color: "#111827",
  wordBreak: "break-word",
};

const contentCardStyle = {
  ...cardStyle,
  padding: "20px",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "13px",
  fontWeight: 800,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#111827",
};

const descriptionStyle = {
  marginTop: "12px",
  color: "#374151",
  fontSize: "15px",
  lineHeight: 1.8,
  whiteSpace: "pre-wrap",
};

const detailsGridStyle = {
  display: "grid",
  gap: "10px",
  marginTop: "12px",
};

const detailRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  paddingBottom: "10px",
  borderBottom: "1px solid rgba(17, 24, 39, 0.08)",
};

const detailLabelStyle = {
  color: "#6b7280",
  fontSize: "13px",
};

const detailValueStyle = {
  color: "#111827",
  fontWeight: 600,
  textAlign: "right",
  fontSize: "13px",
};

const actionRowStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const primaryButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  minWidth: "180px",
  padding: "14px 18px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 10px 18px rgba(99, 102, 241, 0.3)",
};

const secondaryButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  minWidth: "180px",
  padding: "14px 18px",
  borderRadius: "14px",
  border: "1px solid rgba(17, 24, 39, 0.12)",
  background: "#ffffff",
  color: "#111827",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
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

const getProductImage = (params) => {
  return (
    params?.imageUrl ||
    params?.image ||
    params?.thumbnail ||
    params?.cover ||
    ""
  );
};

const ProductShow = (props) => {
  const record = props?.record;
  const params = record?.params || {};

  const productId = params?.id || record?.id || "";
  const name = params?.name || "Unnamed product";
  const sku = params?.sku || "-";
  const category = params?.categoryId || "-";
  const imageUrl = getProductImage(params);
  const stock = Number(params?.stock || 0);
  const isActive = Boolean(params?.isActive);
  const price = formatCurrency(params?.price);
  const description =
    params?.description || "No description available for this product.";

  const editUrl = productId
    ? `/admin/resources/Products/records/${encodeURIComponent(String(productId))}/edit`
    : "";

  const orderUrl = productId
    ? `/admin/resources/Orders/actions/new?productId=${encodeURIComponent(String(productId))}`
    : "";

  const handleOrderClick = () => {
    if (orderUrl) {
      window.location.assign(orderUrl);
    }
  };

  const handleEditClick = () => {
    if (editUrl) {
      window.location.assign(editUrl);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.add("change8-product-show-active");
    body?.classList.add("change8-product-show-active");

    return () => {
      root.classList.remove("change8-product-show-active");
      body?.classList.remove("change8-product-show-active");
    };
  }, []);

  return (
    <div style={pageStyle}>
      <style>{`
        html.change8-product-show-active,
        html.change8-product-show-active body,
        html.change8-product-show-active #app,
        html.change8-product-show-active .adminjs_Layout,
        html.change8-product-show-active [data-testid="layout"],
        html.change8-product-show-active [data-css="layout"],
        html.change8-product-show-active main,
        body.change8-product-show-active,
        body.change8-product-show-active #app,
        body.change8-product-show-active .adminjs_Layout,
        body.change8-product-show-active [data-testid="layout"],
        body.change8-product-show-active [data-css="layout"],
        body.change8-product-show-active main {
          background: #ffffff !important;
          background-color: #ffffff !important;
          background-image: none !important;
        }

        html.change8-product-show-active body::before,
        html.change8-product-show-active::before,
        body.change8-product-show-active::before {
          content: none !important;
          display: none !important;
          background: none !important;
          background-image: none !important;
        }

        html.change8-product-show-active [data-testid="sidebar"],
        html.change8-product-show-active .adminjs_Sidebar,
        html.change8-product-show-active section[data-css="sidebar"],
        html.change8-product-show-active aside[data-css="sidebar"],
        html.change8-product-show-active nav[data-css="sidebar"] {
          display: none !important;
          width: 0 !important;
          min-width: 0 !important;
          max-width: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          border: 0 !important;
          overflow: hidden !important;
          box-shadow: none !important;
        }

        html.change8-product-show-active .adminjs_Layout,
        html.change8-product-show-active [data-testid="layout"],
        html.change8-product-show-active [data-css="layout"] {
          grid-template-columns: 1fr !important;
        }

        html.change8-product-show-active .adminjs_Layout > *:not([data-testid="sidebar"]),
        html.change8-product-show-active [data-testid="layout"] > *:not([data-testid="sidebar"]),
        html.change8-product-show-active [data-css="layout"] > *:not([data-testid="sidebar"]) {
          width: 100% !important;
          max-width: 100% !important;
        }

        html.change8-product-show-active [data-testid="topbar"],
        html.change8-product-show-active .adminjs_TopBar,
        html.change8-product-show-active header[data-css="topbar"],
        html.change8-product-show-active section[data-css="topbar"] {
          display: none !important;
        }

        html:has(.change8-product-show-page),
        body:has(.change8-product-show-page),
        #app:has(.change8-product-show-page),
        .adminjs_Layout:has(.change8-product-show-page),
        [data-testid="layout"]:has(.change8-product-show-page),
        [data-css="layout"]:has(.change8-product-show-page),
        main:has(.change8-product-show-page) {
          background: #ffffff !important;
          background-color: #ffffff !important;
          background-image: none !important;
        }

        html:has(.change8-product-show-page) [data-testid="sidebar"],
        html:has(.change8-product-show-page) .adminjs_Sidebar,
        html:has(.change8-product-show-page) section[data-css="sidebar"],
        html:has(.change8-product-show-page) aside[data-css="sidebar"],
        html:has(.change8-product-show-page) nav[data-css="sidebar"] {
          display: none !important;
          width: 0 !important;
          min-width: 0 !important;
          max-width: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          border: 0 !important;
          overflow: hidden !important;
          box-shadow: none !important;
        }

        html:has(.change8-product-show-page) .adminjs_Layout,
        html:has(.change8-product-show-page) [data-testid="layout"],
        html:has(.change8-product-show-page) [data-css="layout"] {
          grid-template-columns: 1fr !important;
        }

        html:has(.change8-product-show-page) .adminjs_Layout > *:not([data-testid="sidebar"]),
        html:has(.change8-product-show-page) [data-testid="layout"] > *:not([data-testid="sidebar"]),
        html:has(.change8-product-show-page) [data-css="layout"] > *:not([data-testid="sidebar"]) {
          width: 100% !important;
          max-width: 100% !important;
        }

        html:has(.change8-product-show-page) [data-testid="topbar"],
        html:has(.change8-product-show-page) .adminjs_TopBar,
        html:has(.change8-product-show-page) header[data-css="topbar"],
        html:has(.change8-product-show-page) section[data-css="topbar"] {
          display: none !important;
        }

        .change8-product-show-shell {
          display: grid;
          gap: 18px;
        }

        .change8-product-show-meta-scroll {
          max-height: 320px;
          overflow-y: auto;
          padding-right: 6px;
        }

        .change8-product-show-meta-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .change8-product-show-meta-scroll::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.8);
          border-radius: 999px;
        }

        .change8-product-show-meta-scroll::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.9);
          border-radius: 999px;
        }

        @media (max-width: 1100px) {
          .change8-product-show-layout {
            grid-template-columns: 1fr !important;
          }

          .change8-product-show-info-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .change8-product-show-meta-scroll {
            max-height: none;
            overflow-y: visible;
            padding-right: 0;
          }
        }

        @media (max-width: 720px) {
          .change8-product-show-info-grid {
            grid-template-columns: 1fr !important;
          }

          .change8-product-show-page {
            padding: 16px !important;
            background: #ffffff !important;
          }
        }
      `}</style>

      <div className="change8-product-show-shell change8-product-show-page">
        <div style={topBarStyle}>
          <a
            href="/admin/resources/Products/actions/list"
            style={backLinkStyle}
          >
            <span aria-hidden="true">‹</span>
            Back to Products
          </a>

          <div style={pillStyle(isActive)}>
            <span style={pillDotStyle(isActive)} />
            {isActive ? "Active" : "Inactive"}
          </div>
        </div>

        <div className="change8-product-show-layout" style={layoutStyle}>
          <section style={imageCardStyle}>
            <div style={imageWrapStyle}>
              {imageUrl ? (
                <img src={imageUrl} alt={name} style={imageStyle} />
              ) : (
                <div style={imageFallbackStyle}>No image available</div>
              )}
            </div>

            <div style={imageFooterStyle}>
              <div>
                <div style={{ color: "#64748b", fontSize: "12px" }}>
                  Product ID
                </div>
                <div style={{ color: "#111827", fontWeight: 700 }}>
                  {productId || "-"}
                </div>
              </div>

              <div>
                <div style={{ color: "#64748b", fontSize: "12px" }}>Price</div>
                <div style={{ color: "#111827", fontWeight: 700 }}>{price}</div>
              </div>
            </div>
          </section>

          <section style={cardStyle}>
            <div style={{ padding: "22px" }}>
              <h1 style={titleStyle}>{name}</h1>
              <p style={subtitleStyle}>
                Clean product detail view with quick actions and record info.
              </p>

              <div
                className="change8-product-show-info-grid"
                style={infoGridStyle}
              >
                <div style={infoCardStyle}>
                  <div style={infoLabelStyle}>Price</div>
                  <div style={infoValueStyle}>{price}</div>
                </div>

                <div style={infoCardStyle}>
                  <div style={infoLabelStyle}>Stock</div>
                  <div style={infoValueStyle}>{stock}</div>
                </div>

                <div style={infoCardStyle}>
                  <div style={infoLabelStyle}>SKU</div>
                  <div style={infoValueStyle}>{sku}</div>
                </div>
              </div>

              <div style={actionRowStyle}>
                <button
                  type="button"
                  style={primaryButtonStyle}
                  onClick={handleOrderClick}
                >
                  Create Order
                </button>

                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={handleEditClick}
                >
                  Edit Product
                </button>
              </div>

              <div
                className="change8-product-show-meta-scroll"
                style={{
                  marginTop: "22px",
                  paddingTop: "20px",
                  borderTop: "1px solid rgba(17, 24, 39, 0.08)",
                  display: "grid",
                  gap: "18px",
                }}
              >
                <div>
                  <h2 style={sectionTitleStyle}>Description</h2>
                  <div style={descriptionStyle}>{description}</div>
                </div>

                <div>
                  <h2 style={sectionTitleStyle}>Product Details</h2>
                  <div style={detailsGridStyle}>
                    <div style={detailRowStyle}>
                      <span style={detailLabelStyle}>Category</span>
                      <span style={detailValueStyle}>{category}</span>
                    </div>

                    <div style={detailRowStyle}>
                      <span style={detailLabelStyle}>Created At</span>
                      <span style={detailValueStyle}>
                        {formatDate(params?.createdAt)}
                      </span>
                    </div>

                    <div style={detailRowStyle}>
                      <span style={detailLabelStyle}>Updated At</span>
                      <span style={detailValueStyle}>
                        {formatDate(params?.updatedAt)}
                      </span>
                    </div>

                    <div style={detailRowStyle}>
                      <span style={detailLabelStyle}>Record ID</span>
                      <span style={detailValueStyle}>{productId || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductShow;
