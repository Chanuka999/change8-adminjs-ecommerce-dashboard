import React, { useEffect, useState } from "react";

const OrderShow = (props) => {
  const { record, resource } = props;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (record && record.params) {
      setOrder(record.params);
    }
  }, [record]);

  if (!order) {
    return <div className="order-show-loading">Loading...</div>;
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

  const getStatusColor = (status) => {
    const colors = {
      pending: {
        bg: "rgba(251, 191, 36, 0.2)",
        color: "#fbbf24",
        border: "rgba(251, 191, 36, 0.4)",
      },
      paid: {
        bg: "rgba(34, 197, 94, 0.2)",
        color: "#22c55e",
        border: "rgba(34, 197, 94, 0.4)",
      },
      processing: {
        bg: "rgba(59, 130, 246, 0.2)",
        color: "#3b82f6",
        border: "rgba(59, 130, 246, 0.4)",
      },
      shipped: {
        bg: "rgba(139, 92, 246, 0.2)",
        color: "#8b5cf6",
        border: "rgba(139, 92, 246, 0.4)",
      },
      completed: {
        bg: "rgba(16, 185, 129, 0.2)",
        color: "#10b981",
        border: "rgba(16, 185, 129, 0.4)",
      },
      cancelled: {
        bg: "rgba(239, 68, 68, 0.2)",
        color: "#ef4444",
        border: "rgba(239, 68, 68, 0.4)",
      },
    };
    return colors[status] || colors.pending;
  };

  const statusColors = getStatusColor(order.status);

  return (
    <div className="order-show-container">
      <style>{`
        .order-show-container {
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

        html[data-admin-theme='light'] .order-show-container {
          --change8-bg-1: #f0f6ff;
          --change8-gold: #c08b0f;
          --change8-text-main: #0f172a;
          --change8-text-muted: #475569;
          --change8-line: rgba(15, 23, 42, 0.08);
          --change8-card-bg: #ffffff;
          --change8-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
        }

        .order-show-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .order-show-header {
          margin-bottom: 32px;
        }

        .order-show-header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 12px;
        }

        .order-show-kicker {
          font-size: 11px;
          font-weight: 700;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.36em;
          margin-bottom: 12px;
        }

        .order-show-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 700;
          line-height: 1.1;
          margin: 0;
          word-break: break-all;
        }

        .order-show-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .order-show-card {
          border: 1px solid var(--line);
          border-radius: 24px;
          padding: 32px;
          background: var(--card-bg);
          box-shadow: var(--shadow);
          backdrop-filter: blur(4px);
          margin-bottom: 24px;
          animation: fade-up 560ms ease;
        }

        .order-show-section-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--gold);
          margin-bottom: 20px;
          margin-top: 0;
        }

        .order-show-section {
          margin-bottom: 28px;
        }

        .order-show-section:last-child {
          margin-bottom: 0;
        }

        .order-show-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .order-show-field {
          padding: 16px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          border: 1px solid var(--line);
        }

        html[data-admin-theme='light'] .order-show-field {
          background: rgba(15, 23, 42, 0.03);
        }

        .order-show-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--text-muted);
          margin-bottom: 8px;
          display: block;
        }

        .order-show-value {
          font-size: 16px;
          color: var(--text-main);
          line-height: 1.6;
          word-break: break-word;
        }

        .order-show-value.highlight {
          color: var(--gold);
          font-weight: 700;
          font-size: 24px;
        }

        .order-show-address {
          background: rgba(0, 0, 0, 0.2);
          border-left: 3px solid var(--gold);
          padding: 16px 20px;
          border-radius: 8px;
          line-height: 1.7;
          font-size: 15px;
          white-space: pre-wrap;
          word-break: break-word;
        }

        html[data-admin-theme='light'] .order-show-address {
          background: rgba(15, 23, 42, 0.05);
        }

        .order-show-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(226, 191, 102, 0), rgba(226, 191, 102, 0.28), rgba(226, 191, 102, 0));
          margin: 24px 0;
        }

        .order-show-summary {
          background: rgba(226, 191, 102, 0.08);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        html[data-admin-theme='light'] .order-show-summary {
          background: rgba(192, 139, 15, 0.05);
        }

        .order-show-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
        }

        .order-show-summary-label {
          color: var(--text-muted);
          font-weight: 500;
        }

        .order-show-summary-value {
          font-weight: 700;
          font-size: 18px;
          color: var(--gold);
        }

        .order-show-status-timeline {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .order-show-timeline-item {
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          border-left: 3px solid rgba(226, 191, 102, 0.3);
          font-size: 13px;
        }

        .order-show-timeline-label {
          color: var(--text-muted);
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }

        .order-show-timeline-value {
          color: var(--text-main);
          font-weight: 500;
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
          .order-show-container {
            padding: 20px 16px;
          }

          .order-show-card {
            padding: 24px 20px;
          }

          .order-show-grid {
            grid-template-columns: 1fr;
          }

          .order-show-header-top {
            flex-direction: column;
            align-items: flex-start;
          }

          .order-show-status {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="order-show-inner">
        <div className="order-show-header">
          <div className="order-show-kicker">Order Details</div>
          <div className="order-show-header-top">
            <h1 className="order-show-title">Order #{order.id || "—"}</h1>
            <div
              className="order-show-status"
              style={{
                background: statusColors.bg,
                color: statusColors.color,
                border: `1px solid ${statusColors.border}`,
              }}
            >
              <span>●</span>
              {order.status?.toUpperCase() || "—"}
            </div>
          </div>
        </div>

        <div className="order-show-summary">
          <div className="order-show-summary-row">
            <span className="order-show-summary-label">Total Amount</span>
            <span className="order-show-summary-value">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>

        <div className="order-show-card">
          <div className="order-show-section">
            <h3 className="order-show-section-title">Order Information</h3>

            <div className="order-show-grid">
              <div className="order-show-field">
                <label className="order-show-label">Order ID</label>
                <div
                  className="order-show-value highlight"
                  style={{ fontSize: "20px" }}
                >
                  {order.id || "—"}
                </div>
              </div>

              <div className="order-show-field">
                <label className="order-show-label">Total Amount</label>
                <div className="order-show-value highlight">
                  {formatCurrency(order.totalAmount)}
                </div>
              </div>

              <div className="order-show-field">
                <label className="order-show-label">Payment Method</label>
                <div className="order-show-value">
                  {order.paymentMethod
                    ? order.paymentMethod.charAt(0).toUpperCase() +
                      order.paymentMethod.slice(1)
                    : "—"}
                </div>
              </div>

              <div className="order-show-field">
                <label className="order-show-label">Status</label>
                <div
                  className="order-show-value"
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                  }}
                >
                  {order.status || "—"}
                </div>
              </div>

              <div className="order-show-field">
                <label className="order-show-label">User ID</label>
                <div
                  className="order-show-value"
                  style={{ fontFamily: "monospace", fontSize: "14px" }}
                >
                  {order.userId || "—"}
                </div>
              </div>
            </div>
          </div>

          {order.shippingAddress && (
            <>
              <div className="order-show-divider" />

              <div className="order-show-section">
                <h3 className="order-show-section-title">Shipping Address</h3>
                <div className="order-show-address">
                  {order.shippingAddress}
                </div>
              </div>
            </>
          )}

          <div className="order-show-divider" />

          <div className="order-show-section">
            <h3 className="order-show-section-title">Timeline</h3>

            <div className="order-show-status-timeline">
              <div className="order-show-timeline-item">
                <div className="order-show-timeline-label">Created</div>
                <div className="order-show-timeline-value">
                  {formatDate(order.createdAt)}
                </div>
              </div>

              <div className="order-show-timeline-item">
                <div className="order-show-timeline-label">Last Updated</div>
                <div className="order-show-timeline-value">
                  {formatDate(order.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderShow;
