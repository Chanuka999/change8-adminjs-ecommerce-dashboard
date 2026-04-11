import React, { useEffect, useMemo, useState } from "react";

const cardStyle = {
  background: "linear-gradient(160deg, #1a2235 0%, #0f172a 100%)",
  border: "1px solid rgba(214, 174, 70, 0.18)",
  borderRadius: "18px",
  padding: "20px",
  color: "#f8fafc",
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
};

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

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        color: "#f8fafc",
        background:
          "radial-gradient(circle at 10% 0%, #1f2e56 0%, #0b1222 45%, #080d19 100%)",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          letterSpacing: "0.3em",
          fontSize: "11px",
          fontWeight: 600,
          color: "#d6ae46",
          marginBottom: "10px",
        }}
      >
        SECTION VIEW
      </div>
      <h1 style={{ marginTop: 0, fontSize: "42px", marginBottom: "26px" }}>
        Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div style={cardStyle}>
          <div
            style={{
              color: "#98a2b3",
              fontSize: "12px",
              letterSpacing: "0.2em",
            }}
          >
            REVENUE STREAM
          </div>
          <div style={{ fontSize: "42px", fontWeight: 700, marginTop: "8px" }}>
            {formatCurrency(data.revenue)}
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              color: "#98a2b3",
              fontSize: "12px",
              letterSpacing: "0.2em",
            }}
          >
            INVENTORY SIZE
          </div>
          <div style={{ fontSize: "42px", fontWeight: 700, marginTop: "8px" }}>
            {data.products || 0}
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              color: "#98a2b3",
              fontSize: "12px",
              letterSpacing: "0.2em",
            }}
          >
            FEATURED GEMS
          </div>
          <div style={{ fontSize: "42px", fontWeight: 700, marginTop: "8px" }}>
            {data.featuredGems || 0}
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              color: "#98a2b3",
              fontSize: "12px",
              letterSpacing: "0.2em",
            }}
          >
            CRITICAL STOCK
          </div>
          <div style={{ fontSize: "42px", fontWeight: 700, marginTop: "8px" }}>
            {data.criticalStock || 0}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 2fr) minmax(260px, 1fr)",
          gap: "16px",
        }}
      >
        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "6px" }}>
            Category Distribution
          </h2>
          <div style={{ color: "#98a2b3", marginBottom: "16px" }}>
            Inventory breakdown by segment
          </div>

          {(topCategories || []).length === 0 ? (
            <div style={{ color: "#98a2b3" }}>No category data yet.</div>
          ) : (
            (topCategories || []).map((category) => (
              <div key={category.name} style={{ marginBottom: "14px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                    color: "#e2e8f0",
                  }}
                >
                  <span>{category.name}</span>
                  <span>{category.count}</span>
                </div>
                <div
                  style={{
                    height: "10px",
                    background: "rgba(255, 255, 255, 0.08)",
                    borderRadius: "999px",
                  }}
                >
                  <div
                    style={{
                      width: category.width,
                      height: "100%",
                      borderRadius: "999px",
                      background:
                        "linear-gradient(90deg, #d6ae46 0%, #f6db81 100%)",
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "14px" }}>
            Recent Additions
          </h2>

          {(data.recentProducts || []).length === 0 ? (
            <div style={{ color: "#98a2b3" }}>No products added yet.</div>
          ) : (
            (data.recentProducts || []).map((product) => (
              <div
                key={product.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{product.name}</div>
                  <div style={{ color: "#98a2b3", fontSize: "13px" }}>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ color: "#d6ae46", fontWeight: 700 }}>
                  {formatCurrency(product.price)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
