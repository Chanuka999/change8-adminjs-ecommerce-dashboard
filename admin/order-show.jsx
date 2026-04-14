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

const headingStyle = {
  margin: 0,
  color: "#f8fafc",
  fontSize: "34px",
  lineHeight: 1.1,
};

const subTextStyle = {
  color: "#94a3b8",
  fontSize: "13px",
  marginTop: "4px",
};

const badgeStyle = (status) => {
  const val = String(status || "pending").toLowerCase();
  const styleByStatus = {
    pending: { bg: "#fef3c7", fg: "#7c2d12" },
    paid: { bg: "#bbf7d0", fg: "#14532d" },
    processing: { bg: "#bfdbfe", fg: "#1e3a8a" },
    shipped: { bg: "#ddd6fe", fg: "#4c1d95" },
    completed: { bg: "#a7f3d0", fg: "#064e3b" },
    cancelled: { bg: "#fecaca", fg: "#7f1d1d" },
  };

  const selected = styleByStatus[val] || styleByStatus.pending;
  return {
    display: "inline-flex",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    background: selected.bg,
    color: selected.fg,
  };
};

const sectionTitleStyle = {
  margin: "0 0 12px 0",
  color: "#f5df90",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.11em",
  textTransform: "uppercase",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(300px, 1fr) minmax(320px, 1fr)",
  gap: "16px",
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

const tableStyle = {
  display: "grid",
  gap: "10px",
};

const lineItemStyle = {
  border: "1px solid rgba(148, 163, 184, 0.22)",
  borderRadius: "14px",
  padding: "10px",
  background: "rgba(15, 23, 42, 0.44)",
  display: "grid",
  gridTemplateColumns: "60px 1fr auto",
  gap: "10px",
  alignItems: "center",
};

const imageStyle = {
  width: "60px",
  height: "60px",
  objectFit: "cover",
  borderRadius: "10px",
  border: "1px solid rgba(148, 163, 184, 0.22)",
  background: "#0f172a",
};

const totalBoxStyle = {
  display: "grid",
  gap: "8px",
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

const OrderShow = ({ record }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const orderId = record?.params?.id || record?.id;

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("Order id not found");
      return;
    }

    const loadDetails = async () => {
      try {
        setError("");
        const response = await fetch(
          `/admin/context/orders/${encodeURIComponent(String(orderId))}/details`,
          {
            credentials: "same-origin",
          },
        );

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.message || "Failed to load order details");
        }

        setDetails(payload);
      } catch (fetchError) {
        setError(fetchError?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [orderId]);

  const totals = useMemo(() => {
    const subtotal = Number(details?.subtotal || 0);
    const shippingFee = Number(details?.shippingFee || 0);
    const tax = Number(details?.tax || 0);
    const discount = Number(details?.discount || 0);
    const totalAmount = Number(details?.totalAmount || 0);

    return { subtotal, shippingFee, tax, discount, totalAmount };
  }, [details]);

  if (loading) {
    return <div style={emptyStyle}>Loading order details...</div>;
  }

  if (error) {
    return <div style={emptyStyle}>{error}</div>;
  }

  if (!details) {
    return <div style={emptyStyle}>Order details not available.</div>;
  }

  return (
    <div style={pageStyle}>
      <style>{`@media (max-width: 1040px) { .change8-order-show-grid { grid-template-columns: 1fr !important; } }`}</style>

      <div style={cardStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={headingStyle}>Order #{details.id}</h1>
            <div style={subTextStyle}>
              Created {formatDate(details.createdAt)} | Updated{" "}
              {formatDate(details.updatedAt)}
            </div>
          </div>
          <span style={badgeStyle(details.status)}>
            {details.status || "pending"}
          </span>
        </div>
      </div>

      <div className="change8-order-show-grid" style={gridStyle}>
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Customer & Shipping</h2>
          <div style={infoGridStyle}>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Customer</span>
              <strong>{details?.user?.name || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Shipping Contact</span>
              <strong>{details?.shippingName || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Shipping Phone</span>
              <strong>{details?.shippingPhone || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Email</span>
              <strong>{details?.user?.email || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Payment Method</span>
              <strong>{details?.paymentMethod || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Payment Status</span>
              <strong>{details?.paymentStatus || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Transaction ID</span>
              <strong>{details?.transactionId || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Shipping Method</span>
              <strong>{details?.shippingMethod || "-"}</strong>
            </div>
            <div style={infoRowStyle}>
              <span style={{ color: "#94a3b8" }}>Tracking Number</span>
              <strong>{details?.trackingNumber || "-"}</strong>
            </div>
            <div
              style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.6 }}
            >
              <div style={{ color: "#94a3b8", marginBottom: "4px" }}>
                Shipping Address
              </div>
              <div style={{ whiteSpace: "pre-wrap" }}>
                {details?.shippingAddress || "-"}
              </div>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Order Summary / Totals</h2>
          <div style={totalBoxStyle}>
            <div style={totalRowStyle}>
              <span style={{ color: "#94a3b8" }}>Subtotal</span>
              <strong>{formatMoney(totals.subtotal)}</strong>
            </div>
            <div style={totalRowStyle}>
              <span style={{ color: "#94a3b8" }}>Shipping Fee</span>
              <strong>{formatMoney(totals.shippingFee)}</strong>
            </div>
            <div style={totalRowStyle}>
              <span style={{ color: "#94a3b8" }}>Tax / VAT</span>
              <strong>{formatMoney(totals.tax)}</strong>
            </div>
            <div style={totalRowStyle}>
              <span style={{ color: "#94a3b8" }}>Discount</span>
              <strong>- {formatMoney(totals.discount)}</strong>
            </div>
            <div style={grandStyle}>
              <span>Grand Total</span>
              <span>{formatMoney(totals.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Product Line Items</h2>
        <div style={tableStyle}>
          {(details?.items || []).length === 0 ? (
            <div style={emptyStyle}>No line items in this order.</div>
          ) : (
            (details.items || []).map((item) => (
              <div key={item.id} style={lineItemStyle}>
                {item?.product?.imageUrl ? (
                  <img
                    src={item.product.imageUrl}
                    alt={item?.product?.name || "Product"}
                    style={imageStyle}
                  />
                ) : (
                  <div
                    style={{
                      ...imageStyle,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      color: "#94a3b8",
                    }}
                  >
                    No image
                  </div>
                )}

                <div style={{ display: "grid", gap: "4px" }}>
                  <strong style={{ color: "#f8fafc", fontSize: "14px" }}>
                    {item?.product?.name || "Unnamed product"}
                  </strong>
                  <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                    SKU: {item?.product?.sku || "-"} | Product ID: #
                    {item?.productId}
                  </span>
                  <span style={{ color: "#cbd5e1", fontSize: "12px" }}>
                    Size: {item?.size || "-"} | Qty: {item.quantity} x{" "}
                    {formatMoney(item.unitPrice)}
                  </span>
                </div>

                <strong style={{ color: "#f8fafc", fontSize: "15px" }}>
                  {formatMoney(item.totalPrice)}
                </strong>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderShow;
