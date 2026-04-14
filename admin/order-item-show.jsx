import React, { useEffect, useState } from "react";

const OrderItemShow = (props) => {
  const { record } = props;
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (record && record.params) {
      setItem(record.params);
    }
  }, [record]);

  if (!item) {
    return <div className="order-item-show-loading">Loading...</div>;
  }

  const formatDate = (date) => {
    if (!date) return "—";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  const formatCurrency = (value) => {
    return `Rs.${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const unitPrice = Number(item.unitPrice || 0);
  const quantity = Number(item.quantity || 0);
  const totalPrice = Number(item.totalPrice || 0);
  const savingsPerItem =
    unitPrice > 0
      ? (
          ((unitPrice * quantity - totalPrice) / (unitPrice * quantity)) *
          100
        ).toFixed(2)
      : 0;

  return (
    <div className="order-item-show-container">
      <style>{`
        .order-item-show-container {
          --bg-1: var(--change8-bg-1, #050914);
          --gold: var(--change8-gold, #e2bf66);
          --text-main: var(--change8-text-main, #f8fafc);
          --text-muted: var(--change8-text-muted, #9aa8c1);
          --line: var(--change8-line, rgba(226, 191, 102, 0.22));
          --card-bg: var(--change8-card-bg, linear-gradient(160deg, rgba(21, 34, 66, 0.96) 0%, rgba(10, 18, 36, 0.96) 100%));
          --shadow: var(--change8-shadow, 0 8px 26px rgba(0, 0, 0, 0.3));

          padding: 32px;
          color: var(--text-main);
          font-family: "Poppins", "Segoe UI", sans-serif;
          background: linear-gradient(120deg, var(--bg-1) 0%, rgba(11, 26, 56, 0.8) 50%, var(--bg-1) 100%);
          min-height: 100vh;
        }

        html[data-admin-theme='light'] .order-item-show-container {
          --change8-bg-1: #f0f6ff;
          --change8-gold: #c08b0f;
          --change8-text-main: #0f172a;
          --change8-text-muted: #475569;
          --change8-line: rgba(15, 23, 42, 0.08);
          --change8-card-bg: #ffffff;
          --change8-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
        }

        .order-item-show-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .order-item-show-header {
          margin-bottom: 32px;
        }

        .order-item-show-kicker {
          font-size: 11px;
          font-weight: 700;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.36em;
          margin-bottom: 12px;
        }

        .order-item-show-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 700;
          line-height: 1.1;
          margin: 0 0 8px;
        }

        .order-item-show-subtitle {
          color: var(--text-muted);
          font-size: 14px;
          margin-top: 8px;
        }

        .order-item-show-card {
          border: 1px solid var(--line);
          border-radius: 24px;
          padding: 32px;
          background: var(--card-bg);
          box-shadow: var(--shadow);
          backdrop-filter: blur(4px);
          margin-bottom: 24px;
          animation: fade-up 560ms ease;
        }

        .order-item-pricing-card {
          border: 1px solid rgba(226, 191, 102, 0.3);
          border-radius: 20px;
          padding: 28px;
          background: rgba(226, 191, 102, 0.06);
          margin-bottom: 24px;
        }

        html[data-admin-theme='light'] .order-item-pricing-card {
          background: rgba(192, 139, 15, 0.04);
          border-color: rgba(192, 139, 15, 0.2);
        }

        .order-item-show-section-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--gold);
          margin-bottom: 20px;
          margin-top: 0;
        }

        .order-item-show-section {
          margin-bottom: 28px;
        }

        .order-item-show-section:last-child {
          margin-bottom: 0;
        }

        .order-item-pricing-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid rgba(226, 191, 102, 0.15);
        }

        .order-item-pricing-row:last-child {
          border-bottom: none;
        }

        .order-item-pricing-label {
          color: var(--text-muted);
          font-weight: 500;
          font-size: 14px;
        }

        .order-item-pricing-value {
          font-weight: 700;
          font-size: 16px;
          color: var(--text-main);
        }

        .order-item-pricing-value.total {
          font-size: 24px;
          color: var(--gold);
        }

        .order-item-pricing-value.savings {
          color: #10b981;
        }

        .order-item-show-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 16px;
        }

        .order-item-show-field {
          padding: 16px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          border: 1px solid var(--line);
        }

        html[data-admin-theme='light'] .order-item-show-field {
          background: rgba(15, 23, 42, 0.03);
        }

        .order-item-show-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--text-muted);
          margin-bottom: 8px;
          display: block;
        }

        .order-item-show-value {
          font-size: 16px;
          color: var(--text-main);
          line-height: 1.6;
          word-break: break-word;
        }

        .order-item-show-value.highlight {
          color: var(--gold);
          font-weight: 700;
          font-size: 22px;
        }

        .order-item-show-value.large {
          font-size: 20px;
          font-weight: 600;
        }

        .order-item-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(226, 191, 102, 0), rgba(226, 191, 102, 0.28), rgba(226, 191, 102, 0));
          margin: 24px 0;
        }

        .order-item-status-timeline {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .order-item-timeline-item {
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          border-left: 3px solid rgba(226, 191, 102, 0.3);
          font-size: 13px;
        }

        .order-item-timeline-label {
          color: var(--text-muted);
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 6px;
        }

        .order-item-timeline-value {
          color: var(--text-main);
          font-weight: 500;
          font-size: 13px;
        }

        .order-item-quantity-box {
          background: rgba(226, 191, 102, 0.1);
          border: 2px solid rgba(226, 191, 102, 0.3);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
        }

        html[data-admin-theme='light'] .order-item-quantity-box {
          background: rgba(192, 139, 15, 0.06);
          border-color: rgba(192, 139, 15, 0.2);
        }

        .order-item-quantity-number {
          font-size: 48px;
          font-weight: 700;
          color: var(--gold);
          line-height: 1;
          margin: 0;
        }

        .order-item-quantity-label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 8px;
          font-weight: 600;
        }

        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 720px) {
          .order-item-show-container {
            padding: 20px 16px;
          }

          .order-item-show-card {
            padding: 24px 20px;
          }

          .order-item-show-grid {
            grid-template-columns: 1fr;
          }

          .order-item-pricing-card {
            padding: 20px;
          }
        }
      `}</style>

      <div className="order-item-show-inner">
        <div className="order-item-show-header">
          <div className="order-item-show-kicker">Order Item Details</div>
          <h1 className="order-item-show-title">Item #{item.id || "—"}</h1>
          <p className="order-item-show-subtitle">
            Order ID: <strong>#{item.orderId || "—"}</strong> • Product:{" "}
            <strong>{item.productId || "—"}</strong>
          </p>
        </div>

        <div className="order-item-pricing-card">
          <div
            className="order-item-show-section-title"
            style={{ marginBottom: "16px" }}
          >
            Pricing Breakdown
          </div>

          <div className="order-item-pricing-row">
            <span className="order-item-pricing-label">Unit Price</span>
            <span className="order-item-pricing-value">
              {formatCurrency(unitPrice)}
            </span>
          </div>

          <div className="order-item-pricing-row">
            <span className="order-item-pricing-label">Quantity</span>
            <span className="order-item-pricing-value">
              {quantity} {quantity === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="order-item-pricing-row">
            <span className="order-item-pricing-label">Subtotal</span>
            <span className="order-item-pricing-value">
              {formatCurrency(unitPrice * quantity)}
            </span>
          </div>

          <div
            className="order-item-pricing-row"
            style={{
              borderBottom: "2px solid rgba(226, 191, 102, 0.3)",
              paddingTop: "16px",
              paddingBottom: "16px",
            }}
          >
            <span className="order-item-pricing-label">Total Price</span>
            <span className="order-item-pricing-value total">
              {formatCurrency(totalPrice)}
            </span>
          </div>

          {savingsPerItem > 0 && (
            <div
              className="order-item-pricing-row"
              style={{ borderBottom: "none", paddingTop: "12px" }}
            >
              <span className="order-item-pricing-label">Discount Applied</span>
              <span className="order-item-pricing-value savings">
                -{savingsPerItem}%
              </span>
            </div>
          )}
        </div>

        <div className="order-item-show-card">
          <div className="order-item-show-section">
            <h3 className="order-item-show-section-title">Item Information</h3>

            <div className="order-item-show-grid">
              <div className="order-item-show-field">
                <label className="order-item-show-label">Item ID</label>
                <div
                  className="order-item-show-value highlight"
                  style={{ fontSize: "20px" }}
                >
                  {item.id || "—"}
                </div>
              </div>

              <div className="order-item-show-field">
                <label className="order-item-show-label">Product ID</label>
                <div className="order-item-show-value large">
                  {item.productId || "—"}
                </div>
              </div>

              <div className="order-item-show-field">
                <label className="order-item-show-label">Order ID</label>
                <div className="order-item-show-value large">
                  {item.orderId || "—"}
                </div>
              </div>

              <div className="order-item-show-field">
                <label className="order-item-show-label">Unit Price</label>
                <div className="order-item-show-value highlight">
                  {formatCurrency(unitPrice)}
                </div>
              </div>
            </div>
          </div>

          <div className="order-item-divider" />

          <div className="order-item-show-section">
            <h3 className="order-item-show-section-title">Quantity & Totals</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div className="order-item-quantity-box">
                <p className="order-item-quantity-number">{quantity}</p>
                <p className="order-item-quantity-label">Units Ordered</p>
              </div>

              <div className="order-item-quantity-box">
                <p
                  style={{
                    color: "var(--gold)",
                    fontSize: "28px",
                    fontWeight: "700",
                    margin: "0 0 8px",
                  }}
                >
                  {formatCurrency(totalPrice)}
                </p>
                <p className="order-item-quantity-label">Total Amount</p>
              </div>
            </div>
          </div>

          <div className="order-item-divider" />

          <div className="order-item-show-section">
            <h3 className="order-item-show-section-title">Timeline</h3>

            <div className="order-item-status-timeline">
              <div className="order-item-timeline-item">
                <div className="order-item-timeline-label">Added</div>
                <div className="order-item-timeline-value">
                  {formatDate(item.createdAt)}
                </div>
              </div>

              <div className="order-item-timeline-item">
                <div className="order-item-timeline-label">Last Updated</div>
                <div className="order-item-timeline-value">
                  {formatDate(item.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItemShow;
