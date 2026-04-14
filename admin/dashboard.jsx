import React, { useEffect, useMemo, useState } from "react";

const formatCurrency = (value) => {
  return `Rs.${Number(value || 0).toLocaleString()}`;
};

const Dashboard = () => {
  const [data, setData] = useState({
    users: 0,
    categories: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    featuredGems: 0,
    criticalStock: 0,
    recentProducts: [],
    categoryDistribution: [],
  });

  useEffect(() => {
    const loadDashboard = async () => {
      const response = await fetch("/admin/api/dashboard");
      const payload = await response.json();
      setData(payload || {});
    };

    loadDashboard();
  }, []);

  const topCategories = useMemo(() => {
    const distribution = data.categoryDistribution || [];
    const max = Math.max(...distribution.map((item) => item.count), 1);

    return distribution.map((item) => ({
      ...item,
      width: `${Math.max(8, Math.round((item.count / max) * 100))}%`,
    }));
  }, [data.categoryDistribution]);

  const completionRate = useMemo(() => {
    const total = Number(data.products || 0);
    if (total === 0) {
      return 0;
    }

    const healthy = Math.max(total - Number(data.criticalStock || 0), 0);
    return Math.round((healthy / total) * 100);
  }, [data.products, data.criticalStock]);

  return (
    <div className="change8-dashboard">
      <style>{`
        .change8-dashboard {
          --bg-1: var(--change8-bg-1, #050914);
          --bg-2: var(--change8-bg-2, #0b1a38);
          --grad-end: var(--change8-grad-end, #04070f);
          --gold: var(--change8-gold, #e2bf66);
          --text-main: var(--change8-text-main, #f8fafc);
          --text-muted: var(--change8-text-muted, #9aa8c1);
          --line: var(--change8-line, rgba(226, 191, 102, 0.22));
          --card-bg: var(--change8-card-bg, linear-gradient(160deg, rgba(21, 34, 66, 0.96) 0%, rgba(10, 18, 36, 0.96) 100%));
          --shadow: var(--change8-shadow, 0 8px 26px rgba(0, 0, 0, 0.3));
          --radial-1: var(--change8-radial-1, rgba(34, 93, 180, 0.35));
          --radial-2: var(--change8-radial-2, rgba(226, 191, 102, 0.16));

          min-height: 100vh;
          padding: 36px;
          color: var(--text-main);
          background:
            radial-gradient(circle at 8% 0%, var(--radial-1) 0%, rgba(34, 93, 180, 0) 38%),
            radial-gradient(circle at 85% 12%, var(--radial-2) 0%, rgba(226, 191, 102, 0) 42%),
            linear-gradient(120deg, var(--bg-1) 0%, var(--bg-2) 48%, var(--grad-end) 100%);
          font-family: "Poppins", "Segoe UI", sans-serif;
        }

        html[data-admin-theme='light'] .change8-dashboard {
          --change8-bg-1: #f0f6ff;
          --change8-bg-2: #ffffff;
          --change8-grad-end: #f8fbff;
          --change8-gold: #c08b0f;
          --change8-text-main: #0f172a;
          --change8-text-muted: #475569;
          --change8-line: rgba(15, 23, 42, 0.08);
          --change8-card-bg: #ffffff;
          --change8-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
          --change8-radial-1: rgba(34, 93, 180, 0.08);
          --change8-radial-2: rgba(192, 139, 15, 0.05);
        }

        .change8-dashboard-inner {
          width: min(100%, 1440px);
          margin: 0 auto;
        }

        .change8-header {
          margin-bottom: 30px;
          animation: fade-up 520ms ease;
        }

        .change8-kicker {
          letter-spacing: 0.36em;
          font-size: 11px;
          font-weight: 700;
          color: var(--gold);
          text-transform: uppercase;
        }

        .change8-title {
          margin: 8px 0 6px;
          line-height: 1.06;
          font-weight: 700;
          font-size: clamp(32px, 5vw, 56px);
        }

        .change8-subtitle {
          margin: 0;
          color: var(--text-muted);
          font-size: 14px;
        }

        .change8-metric-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(170px, 1fr));
          gap: 22px;
          margin-top: 24px;
          margin-bottom: 48px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(226, 191, 102, 0.12);
        }

        html[data-admin-theme='light'] .change8-metric-grid {
          border-bottom-color: rgba(15, 23, 42, 0.1);
        }

        .change8-card {
          border: 1px solid var(--line);
          border-radius: 24px;
          padding: 24px 24px 22px;
          background: var(--card-bg);
          box-shadow: var(--shadow);
          backdrop-filter: blur(4px);
          animation: fade-up 560ms ease;
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .change8-card:hover {
          transform: translateY(-4px);
          border-color: rgba(226, 191, 102, 0.34);
          box-shadow: 0 16px 34px rgba(0, 0, 0, 0.34);
        }

        .change8-card-label {
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 11px;
          margin-bottom: 8px;
        }

        .change8-card-value {
          font-size: clamp(24px, 2.8vw, 38px);
          font-weight: 700;
          line-height: 0.95;
          letter-spacing: -0.03em;
          overflow-wrap: anywhere;
        }

        .change8-card-hint {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 12px;
          line-height: 1.5;
        }

        .change8-card--stacked {
          gap: 2px;
        }

        .change8-card--stacked .change8-card-hint {
          margin-top: 6px;
        }

        .change8-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          margin-bottom: 32px;
          align-items: start;
          padding-top: 12px;
        }

        .change8-full-width-section {
          margin-bottom: 24px;
        }

        .change8-card--tall {
          min-height: 100%;
          padding-bottom: 24px;
        }

        .change8-section-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(226, 191, 102, 0), rgba(226, 191, 102, 0.28), rgba(226, 191, 102, 0));
          margin: 20px 0;
        }

        .change8-progress-wrap {
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .change8-progress-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-muted);
          font-size: 12px;
          margin-bottom: 6px;
        }

        .change8-progress-track {
          height: 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          overflow: hidden;
        }

        html[data-admin-theme='light'] .change8-progress-track {
          background: rgba(15, 23, 42, 0.12);
        }

        .change8-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #f5df90 0%, #e2bf66 100%);
          transition: width 320ms ease;
        }

        .change8-recent-list {
          margin-top: 14px;
          display: grid;
          gap: 10px;
        }

        .change8-recent-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        html[data-admin-theme='light'] .change8-recent-item {
          border-bottom: 1px solid rgba(15, 23, 42, 0.12);
        }

        .change8-recent-item:last-child {
          border-bottom: none;
        }

        .change8-name {
          font-weight: 600;
          font-size: 15px;
        }

        .change8-date {
          color: var(--text-muted);
          font-size: 12px;
          margin-top: 2px;
        }

        .change8-price {
          color: var(--gold);
          font-weight: 700;
          font-size: 15px;
          white-space: nowrap;
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

        @media (max-width: 1180px) {
          .change8-metric-grid {
            grid-template-columns: repeat(2, minmax(180px, 1fr));
          }

          .change8-layout {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 720px) {
          .change8-dashboard {
            padding: 20px 16px 28px;
          }

          .change8-metric-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-top: 18px;
            margin-bottom: 22px;
          }

          .change8-layout {
            gap: 16px;
            margin-bottom: 18px;
          }

          .change8-card {
            padding: 20px 18px 18px;
          }
        }
      `}</style>

      <div className="change8-dashboard-inner">
        <div className="change8-header">
          <div className="change8-kicker">Section View</div>
          <h1 className="change8-title">Dashboard</h1>
          <p className="change8-subtitle">
            Track your commerce health at a glance with live inventory and order
            signals.
          </p>
        </div>

        <div className="change8-metric-grid">
          <div className="change8-card change8-card--stacked">
            <div className="change8-card-label">Revenue Stream</div>
            <div className="change8-card-value">
              {formatCurrency(data.revenue)}
            </div>
            <div className="change8-card-hint">Across all orders</div>
          </div>

          <div className="change8-card change8-card--stacked">
            <div className="change8-card-label">Inventory Size</div>
            <div className="change8-card-value">{data.products || 0}</div>
            <div className="change8-card-hint">Total active catalog items</div>
          </div>

          <div className="change8-card change8-card--stacked">
            <div className="change8-card-label">Featured Gems</div>
            <div className="change8-card-value">{data.featuredGems || 0}</div>
            <div className="change8-card-hint">Currently visible products</div>
          </div>

          <div className="change8-card change8-card--stacked">
            <div className="change8-card-label">Critical Stock</div>
            <div className="change8-card-value">{data.criticalStock || 0}</div>
            <div className="change8-card-hint">Items needing urgent refill</div>
          </div>
        </div>

        <div className="change8-layout">
          <div className="change8-card change8-card--tall">
            <div className="change8-card-label">Category Distribution</div>
            <div className="change8-card-hint">Inventory split by segment</div>

            <div className="change8-section-divider" />

            <div className="change8-progress-wrap">
              <div className="change8-progress-head">
                <span>Healthy stock level</span>
                <strong>{completionRate}%</strong>
              </div>
              <div className="change8-progress-track">
                <div
                  className="change8-progress-fill"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {(topCategories || []).length === 0 ? (
              <div className="change8-card-hint">No category data yet.</div>
            ) : (
              (topCategories || []).map((category) => (
                <div key={category.name} className="change8-progress-wrap">
                  <div className="change8-progress-head">
                    <span>{category.name}</span>
                    <strong>{category.count}</strong>
                  </div>
                  <div className="change8-progress-track">
                    <div
                      className="change8-progress-fill"
                      style={{ width: category.width }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="change8-card change8-card--tall">
            <div className="change8-card-label">Recent Additions</div>
            <div className="change8-card-hint">
              Latest products entering the catalog
            </div>

            <div className="change8-section-divider" />

            {(data.recentProducts || []).length === 0 ? (
              <div className="change8-card-hint" style={{ marginTop: "12px" }}>
                No products added yet.
              </div>
            ) : (
              <div className="change8-recent-list">
                {(data.recentProducts || []).map((product) => (
                  <div className="change8-recent-item" key={product.id}>
                    <div>
                      <div className="change8-name">{product.name}</div>
                      <div className="change8-date">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="change8-price">
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="change8-full-width-section">
          <div className="change8-card change8-card--tall">
            <div className="change8-card-label">Orders Overview</div>
            <div className="change8-card-hint">
              Summary of all orders and transactions
            </div>

            <div className="change8-section-divider" />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginTop: "12px",
              }}
            >
              <div>
                <div className="change8-card-label">Total Orders</div>
                <div
                  className="change8-card-value"
                  style={{ marginTop: "8px" }}
                >
                  {data.orders || 0}
                </div>
              </div>
              <div>
                <div className="change8-card-label">Total Users</div>
                <div
                  className="change8-card-value"
                  style={{ marginTop: "8px" }}
                >
                  {data.users || 0}
                </div>
              </div>
              <div>
                <div className="change8-card-label">Total Revenue</div>
                <div
                  className="change8-card-value"
                  style={{ marginTop: "8px", color: "var(--gold)" }}
                >
                  {formatCurrency(data.revenue)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
