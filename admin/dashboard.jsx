import React, { useEffect, useMemo, useState } from "react";

const formatCurrency = (value) => {
  return `Rs.${Number(value || 0).toLocaleString()}`;
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  try {
    return new Date(value).toLocaleDateString();
  } catch (error) {
    return "-";
  }
};

const productImage = (product) => {
  return (
    product?.image ||
    product?.imageUrl ||
    product?.thumbnail ||
    product?.cover ||
    "/public/img1.jpg"
  );
};

const productLabel = (product) => {
  const name = String(product?.name || "product");
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
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

  const revenueRate = useMemo(() => {
    const revenue = Number(data.revenue || 0);
    const pseudoTarget = Math.max(revenue, 1000) * 1.35;
    return Math.max(
      6,
      Math.min(100, Math.round((revenue / pseudoTarget) * 100)),
    );
  }, [data.revenue]);

  const chartSegments = useMemo(() => {
    const items = (data.categoryDistribution || []).slice(0, 5);
    const total = items.reduce((sum, item) => sum + Number(item.count || 0), 0);

    if (total === 0) {
      return "#2a3e66 0 100%";
    }

    const palette = ["#f4d889", "#86b8ff", "#7a6fde", "#54d2c7", "#f7998a"];
    let start = 0;

    return items
      .map((item, index) => {
        const percent = (Number(item.count || 0) / total) * 100;
        const end = start + percent;
        const segment = `${palette[index % palette.length]} ${start}% ${end}%`;
        start = end;
        return segment;
      })
      .join(", ");
  }, [data.categoryDistribution]);

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
          --line: var(--change8-line, rgba(226, 191, 102, 0.2));
          --line-soft: var(--change8-line-soft, rgba(143, 175, 230, 0.2));
          --blue-glow: var(--change8-blue-glow, rgba(106, 153, 255, 0.22));
          --rose-glow: var(--change8-rose-glow, rgba(214, 136, 255, 0.16));
          --card-bg: var(--change8-card-bg, linear-gradient(165deg, rgba(20, 34, 66, 0.92) 0%, rgba(13, 24, 49, 0.9) 56%, rgba(28, 20, 51, 0.88) 100%));
          --shadow: var(--change8-shadow, 0 8px 26px rgba(0, 0, 0, 0.3));
          --radial-1: var(--change8-radial-1, rgba(34, 93, 180, 0.35));
          --radial-2: var(--change8-radial-2, rgba(226, 191, 102, 0.16));

          min-height: 100vh;
          padding: 36px;
          color: var(--text-main);
          background:
            radial-gradient(circle at 8% 0%, var(--radial-1) 0%, rgba(34, 93, 180, 0) 38%),
            radial-gradient(circle at 85% 12%, var(--radial-2) 0%, rgba(226, 191, 102, 0) 42%),
            linear-gradient(112deg, var(--bg-1) 0%, var(--bg-2) 48%, var(--grad-end) 100%);
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
          --change8-line-soft: rgba(15, 23, 42, 0.08);
          --change8-card-bg: #ffffff;
          --change8-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
          --change8-radial-1: rgba(34, 93, 180, 0.08);
          --change8-radial-2: rgba(192, 139, 15, 0.05);
        }

        .change8-dashboard-inner {
          width: min(100%, 1440px);
          margin: 0 auto;
          position: relative;
        }

        .change8-dashboard-inner::before {
          content: "";
          position: absolute;
          left: 22%;
          right: 4%;
          top: 270px;
          height: 80px;
          border-radius: 999px;
          background: radial-gradient(circle at center, rgba(107, 166, 255, 0.3), rgba(107, 166, 255, 0));
          filter: blur(18px);
          pointer-events: none;
          z-index: 0;
        }

        .change8-dashboard-inner > * {
          position: relative;
          z-index: 1;
        }

        .change8-header {
          margin-bottom: 18px;
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
          font-weight: 800;
          font-size: clamp(44px, 5.2vw, 72px);
          letter-spacing: -0.02em;
          background: linear-gradient(96deg, #9eb5ff 4%, #f5cfc5 54%, #f9edb2 96%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 32px rgba(133, 166, 255, 0.25);
        }

        .change8-subtitle {
          margin: 0;
          color: var(--text-muted);
          font-size: 16px;
          max-width: 720px;
        }

        .change8-metric-hero {
          display: grid;
          grid-template-columns: minmax(260px, 1fr) 2fr minmax(230px, 0.9fr);
          gap: 18px;
          margin-top: 20px;
          margin-bottom: 44px;
          align-items: stretch;
        }

        .change8-card {
          border: 1px solid var(--line);
          border-radius: 26px;
          padding: 24px 24px 22px;
          background:
            linear-gradient(158deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0) 38%),
            var(--card-bg);
          box-shadow: var(--shadow);
          backdrop-filter: blur(7px);
          animation: fade-up 560ms ease;
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .change8-card--hero {
          min-height: 198px;
          padding: 13px 15px 12px;
        }

        .change8-card::after {
          content: "";
          position: absolute;
          left: 18px;
          right: 18px;
          top: 0;
          height: 1px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(167, 189, 255, 0.5), rgba(255, 255, 255, 0));
          opacity: 0.8;
          pointer-events: none;
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

        .change8-card-value--critical {
          color: #ff8d9e;
          text-shadow: 0 0 22px rgba(255, 116, 138, 0.28);
        }

        .change8-card-glow::before {
          content: "";
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--blue-glow), rgba(244, 216, 137, 0));
          right: -76px;
          top: -86px;
          pointer-events: none;
        }

        .change8-card-glow::after {
          content: "";
          position: absolute;
          width: 190px;
          height: 190px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--rose-glow), rgba(214, 136, 255, 0));
          left: -74px;
          bottom: -98px;
          pointer-events: none;
        }

        .change8-card-hint {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 4px;
          line-height: 1.35;
        }

        .change8-card--stacked {
          gap: 2px;
        }

        .change8-card--stacked .change8-card-hint {
          margin-top: 6px;
        }

        .change8-split-card {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          align-items: center;
          min-height: 94px;
          position: relative;
          column-gap: 14px;
        }

        .change8-split-card::before {
          content: "";
          position: absolute;
          left: 14%;
          right: 14%;
          top: 44%;
          height: 38px;
          background:
            radial-gradient(ellipse at 28% 50%, rgba(115, 173, 255, 0.4), rgba(115, 173, 255, 0)),
            radial-gradient(ellipse at 70% 50%, rgba(210, 130, 255, 0.28), rgba(210, 130, 255, 0));
          filter: blur(8px);
          opacity: 0.86;
          pointer-events: none;
        }

        .change8-split-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 6px;
          margin-bottom: 2px;
        }

        .change8-split-top .change8-card-label {
          margin-bottom: 0;
          white-space: nowrap;
          letter-spacing: 0.16em;
        }

        .change8-split-icons {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #9cb1d9;
          opacity: 0.95;
        }

        .change8-split-icons svg {
          width: 15px;
          height: 15px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.9;
        }

        .change8-spark {
          width: 74px;
          height: 20px;
          margin-bottom: 0;
        }

        .change8-spark path {
          fill: none;
          stroke: #e5cb7a;
          stroke-width: 2.4;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter: drop-shadow(0 1px 4px rgba(229, 203, 122, 0.3));
        }

        .change8-mid-chip {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 27px;
          height: 27px;
          border-radius: 999px;
          border: 1px solid rgba(161, 182, 230, 0.35);
          background: linear-gradient(150deg, rgba(25, 40, 78, 0.95), rgba(38, 32, 74, 0.93));
          color: #dbe7ff;
          display: grid;
          place-items: center;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 6px 18px rgba(5, 10, 26, 0.4);
          z-index: 2;
        }

        .change8-split-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-height: 100%;
          justify-content: center;
        }

        .change8-split-col--left {
          grid-column: 1;
        }

        .change8-split-col--right {
          grid-column: 3;
        }

        .change8-metric-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 3px;
        }

        .change8-metric-line .change8-card-value {
          font-size: 40px;
          line-height: 0.86;
        }

        .change8-split-divider {
          width: 1px;
          align-self: stretch;
          background: linear-gradient(180deg, rgba(153, 177, 227, 0), rgba(153, 177, 227, 0.45), rgba(153, 177, 227, 0));
          margin: 0;
          grid-column: 2;
          grid-row: 1;
        }

        .change8-trend {
          margin-top: 0;
          width: 76px;
          height: 22px;
          border-radius: 999px;
          border: 1px solid var(--line-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f4d889;
          font-size: 12px;
          letter-spacing: 0.06em;
          background: rgba(8, 24, 52, 0.45);
        }

        .change8-revenue-ring {
          margin-top: 2px;
          width: 108px;
          height: 108px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: conic-gradient(#f5d56e 0 var(--rev-rate), rgba(245, 213, 110, 0.1) var(--rev-rate) 100%);
          box-shadow: inset 0 0 24px rgba(0, 0, 0, 0.28);
          position: relative;
        }

        .change8-revenue-ring::after {
          content: "";
          position: absolute;
          inset: 14px;
          border-radius: 50%;
          background: linear-gradient(145deg, rgba(9, 21, 46, 0.96), rgba(18, 35, 68, 0.9));
          border: 1px solid rgba(244, 216, 137, 0.18);
        }

        html[data-admin-theme='light'] .change8-revenue-ring::after {
          background: linear-gradient(145deg, rgba(246, 251, 255, 0.94), rgba(229, 238, 248, 0.86));
          border-color: rgba(15, 23, 42, 0.08);
        }

        .change8-revenue-ring span {
          position: relative;
          z-index: 1;
          font-size: 14px;
          font-weight: 700;
          text-shadow: 0 2px 10px rgba(244, 216, 137, 0.34);
        }

        .change8-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-top: 14px;
          margin-bottom: 28px;
          align-items: start;
        }

        .change8-full-width-section {
          margin-bottom: 24px;
        }

        .change8-card--normal {
          padding-bottom: 18px;
        }

        .change8-section-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(226, 191, 102, 0), rgba(226, 191, 102, 0.28), rgba(226, 191, 102, 0));
          margin: 14px 0;
        }

        .change8-donut-wrap {
          margin-top: 10px;
          display: grid;
          grid-template-columns: minmax(170px, 230px) 1fr;
          gap: 18px;
          align-items: center;
        }

        .change8-donut {
          width: min(220px, 100%);
          aspect-ratio: 1;
          border-radius: 50%;
          background: conic-gradient(var(--donut-segments));
          border: 1px solid var(--line-soft);
          margin-inline: auto;
          position: relative;
        }

        .change8-donut::after {
          content: "";
          position: absolute;
          inset: 28%;
          border-radius: 50%;
          background: rgba(7, 18, 39, 0.95);
          border: 1px solid rgba(244, 216, 137, 0.24);
        }

        html[data-admin-theme='light'] .change8-donut::after {
          background: #f8fbff;
          border-color: rgba(15, 23, 42, 0.09);
        }

        .change8-donut-legend {
          display: grid;
          gap: 10px;
          max-height: 210px;
          overflow: auto;
          padding-right: 4px;
        }

        .change8-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex: 0 0 10px;
        }

        .change8-legend-row {
          display: grid;
          grid-template-columns: 10px 1fr auto;
          gap: 10px;
          align-items: center;
          font-size: 13px;
          color: var(--text-muted);
        }

        .change8-progress-wrap {
          margin-top: 10px;
          margin-bottom: 10px;
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
          margin-top: 8px;
          display: flex;
          overflow-x: auto;
          padding-bottom: 6px;
          gap: 12px;
          scrollbar-width: thin;
        }

        .change8-recent-item {
          flex: 0 0 154px;
          border: 1px solid var(--line-soft);
          border-radius: 16px;
          padding: 9px;
          background: linear-gradient(165deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
        }

        html[data-admin-theme='light'] .change8-recent-item {
          background: linear-gradient(165deg, rgba(15, 23, 42, 0.02), rgba(15, 23, 42, 0.01));
        }

        .change8-thumb {
          width: 100%;
          aspect-ratio: 1.45;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(140deg, rgba(79, 106, 165, 0.6), rgba(57, 46, 110, 0.56));
          display: grid;
          place-items: center;
          margin-bottom: 9px;
          color: #ffffff;
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .change8-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .change8-name {
          font-weight: 600;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .change8-date {
          color: var(--text-muted);
          font-size: 12px;
          margin-top: 2px;
        }

        .change8-price {
          color: var(--gold);
          font-weight: 700;
          font-size: 20px;
          line-height: 1;
          white-space: nowrap;
          margin-top: 4px;
        }

        .change8-order-overview {
          display: grid;
          grid-template-columns: repeat(3, minmax(170px, 1fr));
          gap: 14px;
        }

        .change8-order-box {
          border: 1px solid var(--line-soft);
          border-radius: 16px;
          padding: 16px;
          background: linear-gradient(160deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
        }

        .change8-order-box .change8-card-value {
          font-size: clamp(28px, 3.8vw, 42px);
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
          .change8-metric-hero {
            grid-template-columns: 1fr;
          }

          .change8-layout {
            grid-template-columns: 1fr;
          }

          .change8-recent-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(130px, 1fr));
            overflow: visible;
          }

          .change8-recent-item {
            flex: initial;
          }

          .change8-order-overview {
            grid-template-columns: repeat(2, minmax(150px, 1fr));
          }
        }

        @media (max-width: 720px) {
          .change8-dashboard {
            padding: 20px 16px 28px;
          }

          .change8-subtitle {
            font-size: 14px;
          }

          .change8-title {
            font-size: clamp(34px, 13vw, 52px);
          }

          .change8-split-card {
            grid-template-columns: 1fr 1px 1fr;
            column-gap: 10px;
          }

          .change8-split-top .change8-card-label {
            font-size: 10px;
            letter-spacing: 0.12em;
          }

          .change8-metric-line .change8-card-value {
            font-size: 42px;
          }

          .change8-spark {
            width: 66px;
            height: 20px;
          }

          .change8-mid-chip {
            width: 26px;
            height: 26px;
            font-size: 12px;
          }

          .change8-split-divider {
            display: block;
          }

          .change8-donut-wrap {
            grid-template-columns: 1fr;
          }

          .change8-recent-list {
            grid-template-columns: 1fr;
          }

          .change8-order-overview {
            grid-template-columns: 1fr;
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

        <div className="change8-metric-hero">
          <div
            className="change8-card change8-card--hero change8-card--stacked change8-card-glow"
            style={{ ["--rev-rate"]: `${revenueRate}%` }}
          >
            <div className="change8-card-label">Revenue Stream</div>
            <div className="change8-revenue-ring">
              <span>{formatCurrency(data.revenue)}</span>
            </div>
            <div className="change8-card-hint">Across all orders</div>
          </div>

          <div className="change8-card change8-card--hero change8-card-glow">
            <div className="change8-split-card">
              <div className="change8-split-col change8-split-col--left">
                <div className="change8-split-top">
                  <div className="change8-card-label">Inventory & Featured</div>
                  <div className="change8-split-icons" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M7 6v12M17 6v12M4 10h16M4 14h16" />
                    </svg>
                    <svg viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5v14" />
                    </svg>
                  </div>
                </div>
                <div className="change8-metric-line">
                  <div className="change8-card-value">{data.products || 0}</div>
                  <svg
                    className="change8-spark"
                    viewBox="0 0 100 30"
                    aria-hidden="true"
                  >
                    <path d="M2 20 L18 20 L28 13 L40 16 L52 8 L64 19 L76 15 L88 12 L98 6" />
                  </svg>
                </div>
                <div className="change8-card-hint">
                  Total active catalog items
                </div>
              </div>

              <div className="change8-split-divider" />
              <div className="change8-mid-chip" aria-hidden="true">
                ↔
              </div>

              <div className="change8-split-col change8-split-col--right">
                <div className="change8-split-top">
                  <div className="change8-card-label">Featured Gems</div>
                  <div className="change8-split-icons" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M4 16l6-6 4 4 6-6" />
                    </svg>
                    <svg viewBox="0 0 24 24">
                      <path d="M13 5h6v6M19 5l-8 8" />
                    </svg>
                  </div>
                </div>
                <div className="change8-metric-line">
                  <div className="change8-card-value">
                    {data.featuredGems || 0}
                  </div>
                  <svg
                    className="change8-spark"
                    viewBox="0 0 100 30"
                    aria-hidden="true"
                  >
                    <path d="M2 21 L20 21 L32 14 L48 17 L60 11 L72 18 L84 13 L96 7" />
                  </svg>
                </div>
                <div className="change8-card-hint">
                  Currently visible products
                </div>
              </div>
            </div>
          </div>

          <div className="change8-card change8-card--hero change8-card--stacked change8-card-glow">
            <div className="change8-card-label">Critical Stock</div>
            <div className="change8-card-value change8-card-value--critical">
              {data.criticalStock || 0}
            </div>
            <div className="change8-card-hint">Items needing urgent refill</div>
          </div>
        </div>

        <div className="change8-layout">
          <div className="change8-card change8-card--normal">
            <div className="change8-card-label">Category Distribution</div>
            <div className="change8-card-hint">Inventory split by segment</div>

            <div className="change8-section-divider" />

            <div
              className="change8-donut-wrap"
              style={{ ["--donut-segments"]: chartSegments }}
            >
              <div className="change8-donut" />
              <div className="change8-donut-legend">
                {(topCategories || []).length === 0 ? (
                  <div className="change8-card-hint">No category data yet.</div>
                ) : (
                  (topCategories || []).map((category, index) => {
                    const colors = [
                      "#f4d889",
                      "#86b8ff",
                      "#7a6fde",
                      "#54d2c7",
                      "#f7998a",
                    ];
                    return (
                      <div key={category.name} className="change8-legend-row">
                        <span
                          className="change8-dot"
                          style={{ background: colors[index % colors.length] }}
                        />
                        <span>{category.name}</span>
                        <strong>{category.count}</strong>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

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
          </div>

          <div className="change8-card change8-card--normal">
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
                    <div className="change8-thumb">
                      {productImage(product) ? (
                        <img
                          src={productImage(product)}
                          alt={product.name || "product"}
                        />
                      ) : (
                        <span>{productLabel(product)}</span>
                      )}
                    </div>
                    <div>
                      <div className="change8-name">
                        {product.name || "Untitled product"}
                      </div>
                      <div className="change8-date">
                        {formatDate(product.createdAt)}
                      </div>
                      <div className="change8-price">
                        {formatCurrency(product.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="change8-full-width-section">
          <div className="change8-card change8-card--normal">
            <div className="change8-card-label">Orders Overview</div>
            <div className="change8-card-hint">
              Summary of all orders and transactions
            </div>

            <div className="change8-section-divider" />

            <div className="change8-order-overview">
              <div className="change8-order-box">
                <div className="change8-card-label">Total Orders</div>
                <div
                  className="change8-card-value"
                  style={{ marginTop: "8px" }}
                >
                  {data.orders || 0}
                </div>
              </div>
              <div className="change8-order-box">
                <div className="change8-card-label">Total Users</div>
                <div
                  className="change8-card-value"
                  style={{ marginTop: "8px" }}
                >
                  {data.users || 0}
                </div>
              </div>
              <div className="change8-order-box">
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
