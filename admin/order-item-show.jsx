import React, { useEffect, useMemo, useState } from "react";

const pageStyle = {
  display: "grid",
  gap: "16px",
  color: "#e2e8f0",
};

const cardStyle = {
  borderRadius: "18px",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  background:
    "linear-gradient(155deg, rgba(10, 23, 48, 0.94) 0%, rgba(8, 18, 38, 0.94) 100%)",
  boxShadow: "0 14px 30px rgba(2, 6, 23, 0.2)",
  padding: "18px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "center",
};

const titleStyle = {
  margin: 0,
  fontSize: "34px",
  lineHeight: 1.1,
  color: "#f8fafc",
};

const subtitleStyle = {
  margin: "6px 0 0 0",
  color: "#94a3b8",
  fontSize: "13px",
};

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  width: "fit-content",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#14532d",
  background: "#bbf7d0",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(300px, 0.95fr) minmax(320px, 1.05fr)",
  gap: "16px",
};

const sectionTitleStyle = {
  margin: "0 0 12px 0",
  color: "#f5df90",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.11em",
  textTransform: "uppercase",
};

const infoGridStyle = {
  display: "grid",
  gap: "8px",
};

const infoRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
  paddingBottom: "8px",
  fontSize: "13px",
};

const imageStyle = {
  width: "100%",
  height: "280px",
  objectFit: "cover",
  borderRadius: "14px",
  background: "#0f172a",
  border: "1px solid rgba(148, 163, 184, 0.22)",
};

const lineItemStyle = {
  display: "grid",
  gridTemplateColumns: "84px 1fr auto",
  gap: "12px",
  alignItems: "center",
  padding: "12px",
  borderRadius: "14px",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  background: "rgba(15, 23, 42, 0.44)",
};

const emptyImageStyle = {
  width: "84px",
  height: "84px",
  borderRadius: "12px",
  background: "#0f172a",
  border: "1px solid rgba(148, 163, 184, 0.22)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#94a3b8",
  fontSize: "11px",
};

const totalRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "13px",
  borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
  paddingBottom: "7px",
};

const grandStyle = {
  ...totalRowStyle,
  borderBottom: "none",
  paddingTop: "6px",
  fontWeight: 800,
  fontSize: "18px",
  color: "#f8fafc",
};

const emptyStyle = {
  border: "1px dashed rgba(148, 163, 184, 0.35)",
  borderRadius: "12px",
  padding: "14px",
  color: "#cbd5e1",
};

const formatMoney = (value) => {
  const n = Number(value || 0);
  return `Rs. ${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) {
    return String(value);
  }

  return dt.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const OrderItemShow = ({ record }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const orderItemId = record?.params?.id || record?.id;

  useEffect(() => {
    if (!orderItemId) {
      setLoading(false);
      setError("Order item id not found");
      return;
    }

    const loadDetails = async () => {
      try {
        setError("");
        const response = await fetch(
          `/admin/context/order-items/${encodeURIComponent(String(orderItemId))}/details`,
          { credentials: "same-origin" },
        );

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(
            payload?.message || "Failed to load order item details",
          );
        }

        setDetails(payload);
      } catch (fetchError) {
        setError(fetchError?.message || "Failed to load order item details");
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [orderItemId]);

  const calculatedTotal = useMemo(() => {
    return Number(details?.totalPrice || 0);
  }, [details]);

  if (loading) {
    return <div style={emptyStyle}>Loading order item details...</div>;
  }

  if (error) {
    return <div style={emptyStyle}>{error}</div>;
  }

  if (!details) {
    return <div style={emptyStyle}>Order item details not available.</div>;
  }

  const product = details?.product || {};
  const order = details?.order || {};
  const customer = order?.user || {};

  return (
    <div style={pageStyle}>
      <style>{`@media (max-width: 1040px) { .change8-order-item-grid { grid-template-columns: 1fr !important; } }`}</style>

      <div style={cardStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>{product?.name || "Order Item"}</h1>
            <p style={subtitleStyle}>
              Order #{order?.id || "-"} • Item #{details?.id || "-"}
            </p>
          </div>
          <span style={badgeStyle}>Active Item</span>
        </div>
      </div>

      <div className="change8-order-item-grid" style={gridStyle}>
        <div style={cardStyle}>
          {product?.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product?.name || "Product"}
              style={imageStyle}
            />
          ) : (
            <div
              style={{
                ...imageStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
              }}
            >
              No image available
            </div>
          )}

          <div style={{ height: 14 }} />

          <h2 style={sectionTitleStyle}>Product Snapshot</h2>
          <div style={infoGridStyle}>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Product Name</span>
              <strong>{product?.name || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>SKU</span>
              <strong>{product?.sku || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Product ID</span>
              <strong>#{product?.id || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Current Stock</span>
              <strong>{product?.stock ?? "-"}</strong>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Order & Customer</h2>
          <div style={infoGridStyle}>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Customer</span>
              <strong>{customer?.name || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Email</span>
              <strong>{customer?.email || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Order ID</span>
              <strong>#{order?.id || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Order Status</span>
              <strong>{order?.status || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Payment Method</span>
              <strong>{order?.paymentMethod || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Shipping Method</span>
              <strong>{order?.shippingMethod || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Tracking Number</span>
              <strong>{order?.trackingNumber || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Created At</span>
              <strong>{formatDate(details.createdAt)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Pricing Details</h2>
        <div style={infoGridStyle}>
          <div style={infoRowStyle}>
            <span style={{ color: "#94a3b8" }}>Quantity</span>
            <strong>{details.quantity}</strong>
          </div>
          <div style={infoRowStyle}>
            <span style={{ color: "#94a3b8" }}>Unit Price</span>
            <strong>{formatMoney(details.unitPrice)}</strong>
          </div>
          <div style={infoRowStyle}>
            <span style={{ color: "#94a3b8" }}>Line Total</span>
            <strong>{formatMoney(calculatedTotal)}</strong>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Quick Summary</h2>
        <div style={lineItemStyle}>
          {product?.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product?.name || "Product"}
              style={{
                width: "84px",
                height: "84px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          ) : (
            <div style={emptyImageStyle}>No image</div>
          )}
          <div style={{ display: "grid", gap: "4px" }}>
            <strong style={{ color: "#f8fafc", fontSize: "16px" }}>
              {product?.name || "Unnamed product"}
            </strong>
            <span style={{ color: "#94a3b8", fontSize: "12px" }}>
              SKU: {product?.sku || "-"}
            </span>
            <span style={{ color: "#cbd5e1", fontSize: "12px" }}>
              Qty {details.quantity} x {formatMoney(details.unitPrice)}
            </span>
          </div>
          <strong style={{ color: "#f8fafc", fontSize: "16px" }}>
            {formatMoney(calculatedTotal)}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default OrderItemShow;
