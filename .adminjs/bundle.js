(function (React) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const formatCurrency$1 = value => {
    return `Rs.${Number(value || 0).toLocaleString()}`;
  };
  const formatDate$3 = value => {
    if (!value) {
      return "-";
    }
    try {
      return new Date(value).toLocaleDateString();
    } catch (error) {
      return "-";
    }
  };
  const productImage = product => {
    return product?.image || product?.imageUrl || product?.thumbnail || product?.cover || "/public/img1.jpg";
  };
  const productLabel = product => {
    const name = String(product?.name || "product");
    return name.split(" ").slice(0, 2).map(part => part[0]).join("").toUpperCase();
  };
  const Dashboard = () => {
    const [data, setData] = React.useState({
      users: 0,
      categories: 0,
      products: 0,
      orders: 0,
      revenue: 0,
      featuredGems: 0,
      criticalStock: 0,
      recentProducts: [],
      categoryDistribution: []
    });
    React.useEffect(() => {
      const loadDashboard = async () => {
        const response = await fetch("/admin/api/dashboard");
        const payload = await response.json();
        setData(payload || {});
      };
      loadDashboard();
    }, []);
    const topCategories = React.useMemo(() => {
      const distribution = data.categoryDistribution || [];
      const max = Math.max(...distribution.map(item => item.count), 1);
      return distribution.map(item => ({
        ...item,
        width: `${Math.max(8, Math.round(item.count / max * 100))}%`
      }));
    }, [data.categoryDistribution]);
    const completionRate = React.useMemo(() => {
      const total = Number(data.products || 0);
      if (total === 0) {
        return 0;
      }
      const healthy = Math.max(total - Number(data.criticalStock || 0), 0);
      return Math.round(healthy / total * 100);
    }, [data.products, data.criticalStock]);
    const revenueRate = React.useMemo(() => {
      const revenue = Number(data.revenue || 0);
      const pseudoTarget = Math.max(revenue, 1000) * 1.35;
      return Math.max(6, Math.min(100, Math.round(revenue / pseudoTarget * 100)));
    }, [data.revenue]);
    const chartSegments = React.useMemo(() => {
      const items = (data.categoryDistribution || []).slice(0, 5);
      const total = items.reduce((sum, item) => sum + Number(item.count || 0), 0);
      if (total === 0) {
        return "#2a3e66 0 100%";
      }
      const palette = ["#f4d889", "#86b8ff", "#7a6fde", "#54d2c7", "#f7998a"];
      let start = 0;
      return items.map((item, index) => {
        const percent = Number(item.count || 0) / total * 100;
        const end = start + percent;
        const segment = `${palette[index % palette.length]} ${start}% ${end}%`;
        start = end;
        return segment;
      }).join(", ");
    }, [data.categoryDistribution]);
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-dashboard"
    }, /*#__PURE__*/React__default.default.createElement("style", null, `
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
      `), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-dashboard-inner"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-header"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-kicker"
    }, "Section View"), /*#__PURE__*/React__default.default.createElement("h1", {
      className: "change8-title"
    }, "Dashboard"), /*#__PURE__*/React__default.default.createElement("p", {
      className: "change8-subtitle"
    }, "Track your commerce health at a glance with live inventory and order signals.")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-metric-hero"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card change8-card--hero change8-card--stacked change8-card-glow",
      style: {
        ["--rev-rate"]: `${revenueRate}%`
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Revenue Stream"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-revenue-ring"
    }, /*#__PURE__*/React__default.default.createElement("span", null, formatCurrency$1(data.revenue))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Across all orders")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card change8-card--hero change8-card-glow"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-split-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-split-col change8-split-col--left"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-split-top"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Inventory & Featured"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-split-icons",
      "aria-hidden": "true"
    }, /*#__PURE__*/React__default.default.createElement("svg", {
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M7 6v12M17 6v12M4 10h16M4 14h16"
    })), /*#__PURE__*/React__default.default.createElement("svg", {
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M5 12h14M12 5v14"
    })))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-metric-line"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value"
    }, data.products || 0), /*#__PURE__*/React__default.default.createElement("svg", {
      className: "change8-spark",
      viewBox: "0 0 100 30",
      "aria-hidden": "true"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M2 20 L18 20 L28 13 L40 16 L52 8 L64 19 L76 15 L88 12 L98 6"
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Total active catalog items")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-split-divider"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-mid-chip",
      "aria-hidden": "true"
    }, "\u2194"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-split-col change8-split-col--right"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-split-top"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Featured Gems"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-split-icons",
      "aria-hidden": "true"
    }, /*#__PURE__*/React__default.default.createElement("svg", {
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M4 16l6-6 4 4 6-6"
    })), /*#__PURE__*/React__default.default.createElement("svg", {
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M13 5h6v6M19 5l-8 8"
    })))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-metric-line"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value"
    }, data.featuredGems || 0), /*#__PURE__*/React__default.default.createElement("svg", {
      className: "change8-spark",
      viewBox: "0 0 100 30",
      "aria-hidden": "true"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M2 21 L20 21 L32 14 L48 17 L60 11 L72 18 L84 13 L96 7"
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Currently visible products")))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card change8-card--hero change8-card--stacked change8-card-glow"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Critical Stock"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value change8-card-value--critical"
    }, data.criticalStock || 0), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Items needing urgent refill"))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-layout"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card change8-card--normal"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Category Distribution"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Inventory split by segment"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-section-divider"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-donut-wrap",
      style: {
        ["--donut-segments"]: chartSegments
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-donut"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-donut-legend"
    }, (topCategories || []).length === 0 ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "No category data yet.") : (topCategories || []).map((category, index) => {
      const colors = ["#f4d889", "#86b8ff", "#7a6fde", "#54d2c7", "#f7998a"];
      return /*#__PURE__*/React__default.default.createElement("div", {
        key: category.name,
        className: "change8-legend-row"
      }, /*#__PURE__*/React__default.default.createElement("span", {
        className: "change8-dot",
        style: {
          background: colors[index % colors.length]
        }
      }), /*#__PURE__*/React__default.default.createElement("span", null, category.name), /*#__PURE__*/React__default.default.createElement("strong", null, category.count));
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-progress-wrap"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-progress-head"
    }, /*#__PURE__*/React__default.default.createElement("span", null, "Healthy stock level"), /*#__PURE__*/React__default.default.createElement("strong", null, completionRate, "%")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-progress-track"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-progress-fill",
      style: {
        width: `${completionRate}%`
      }
    })))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card change8-card--normal"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Recent Additions"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Latest products entering the catalog"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-section-divider"
    }), (data.recentProducts || []).length === 0 ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint",
      style: {
        marginTop: "12px"
      }
    }, "No products added yet.") : /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-recent-list"
    }, (data.recentProducts || []).map(product => /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-recent-item",
      key: product.id
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-thumb"
    }, productImage(product) ? /*#__PURE__*/React__default.default.createElement("img", {
      src: productImage(product),
      alt: product.name || "product"
    }) : /*#__PURE__*/React__default.default.createElement("span", null, productLabel(product))), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-name"
    }, product.name || "Untitled product"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-date"
    }, formatDate$3(product.createdAt)), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-price"
    }, formatCurrency$1(product.price)))))))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-full-width-section"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card change8-card--normal"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Orders Overview"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Summary of all orders and transactions"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-section-divider"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-order-overview"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-order-box"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Total Orders"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value",
      style: {
        marginTop: "8px"
      }
    }, data.orders || 0)), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-order-box"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Total Users"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value",
      style: {
        marginTop: "8px"
      }
    }, data.users || 0)), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-order-box"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Total Revenue"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value",
      style: {
        marginTop: "8px",
        color: "var(--gold)"
      }
    }, formatCurrency$1(data.revenue))))))));
  };

  const Register = () => {
    const [formState, setFormState] = React.useState({
      name: "",
      email: "",
      password: ""
    });
    const [message, setMessage] = React.useState({
      type: "",
      text: ""
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    React.useEffect(() => {
      document.body.style.margin = "0";
    }, []);
    const handleChange = event => {
      setFormState(current => ({
        ...current,
        [event.target.name]: event.target.value
      }));
    };
    const handleSubmit = async event => {
      event.preventDefault();
      setMessage({
        type: "",
        text: ""
      });
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formState)
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }
        setMessage({
          type: "success",
          text: "Account created successfully! Redirecting..."
        });
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 2000);
      } catch (error) {
        setMessage({
          type: "error",
          text: error.message
        });
        setIsSubmitting(false);
      }
    };
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "register-page"
    }, /*#__PURE__*/React__default.default.createElement("style", null, `
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            linear-gradient(rgba(15, 23, 42, 0.35), rgba(15, 23, 42, 0.35)),
            url('/public/img2.jpg') center / cover fixed;
          font-family: "Plus Jakarta Sans", "Segoe UI", sans-serif;
        }

        .register-card {
          width: min(100%, 520px);
          padding: 60px;
          border-radius: 28px;
          background: rgba(15, 23, 42, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(30px);
          color: #fff;
        }

        .register-logo {
          margin-bottom: 30px;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .register-logo span {
          color: #6366f1;
        }

        .register-field {
          margin-bottom: 20px;
        }

        .register-label {
          display: block;
          margin-bottom: 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }

        .register-input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          font-size: 15px;
          outline: none;
          transition: all 0.3s ease;
        }

        .register-input:focus {
          border-color: #6366f1;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
        }

        .register-button {
          width: 100%;
          margin-top: 10px;
          padding: 16px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
        }

        .register-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .register-message {
          margin-bottom: 20px;
          padding: 12px;
          border-radius: 10px;
          font-size: 13px;
          display: none;
        }

        .register-message.is-visible {
          display: block;
        }

        .register-message.error {
          color: #f87171;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .register-message.success {
          color: #4ade80;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .register-footer {
          margin-top: 25px;
          text-align: center;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .register-footer a {
          color: #6366f1;
          text-decoration: none;
          font-weight: 600;
        }

        .register-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 850px) {
          .register-card {
            padding: 40px;
          }
        }
      `), /*#__PURE__*/React__default.default.createElement("div", {
      className: "register-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "register-logo"
    }, "Register our site"), /*#__PURE__*/React__default.default.createElement("div", {
      className: `register-message ${message.type} ${message.text ? "is-visible" : ""}`
    }, message.text), /*#__PURE__*/React__default.default.createElement("form", {
      onSubmit: handleSubmit
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "register-field"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "register-label",
      htmlFor: "name"
    }, "Full Name"), /*#__PURE__*/React__default.default.createElement("input", {
      className: "register-input",
      type: "text",
      id: "name",
      name: "name",
      placeholder: "Enter your full name",
      value: formState.name,
      onChange: handleChange,
      required: true
    })), /*#__PURE__*/React__default.default.createElement("div", {
      className: "register-field"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "register-label",
      htmlFor: "email"
    }, "Email Address"), /*#__PURE__*/React__default.default.createElement("input", {
      className: "register-input",
      type: "email",
      id: "email",
      name: "email",
      placeholder: "example@email.com",
      value: formState.email,
      onChange: handleChange,
      required: true
    })), /*#__PURE__*/React__default.default.createElement("div", {
      className: "register-field"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "register-label",
      htmlFor: "password"
    }, "Password"), /*#__PURE__*/React__default.default.createElement("input", {
      className: "register-input",
      type: "password",
      id: "password",
      name: "password",
      placeholder: "At least 6 characters",
      minLength: 6,
      value: formState.password,
      onChange: handleChange,
      required: true
    })), /*#__PURE__*/React__default.default.createElement("button", {
      className: "register-button",
      type: "submit",
      disabled: isSubmitting
    }, isSubmitting ? "Creating account..." : "Create Account")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "register-footer"
    }, "Already have an account? ", /*#__PURE__*/React__default.default.createElement("a", {
      href: "/admin/login"
    }, "Log in"))));
  };

  const gridStyle$2 = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px"
  };
  const cardStyle$3 = {
    borderRadius: "16px",
    border: "1px solid rgba(148, 163, 184, 0.28)",
    background: "linear-gradient(160deg, #0b1a38 0%, #09162f 100%)",
    color: "#f8fafc",
    overflow: "hidden",
    boxShadow: "0 12px 22px rgba(2, 6, 23, 0.25)"
  };
  const imageWrapStyle$1 = {
    width: "100%",
    height: "200px",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px"
  };
  const imageStyle$5 = {
    width: "100%",
    height: "100%",
    objectFit: "contain"
  };
  const bodyStyle = {
    padding: "14px",
    display: "grid",
    gap: "8px"
  };
  const metaStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    fontSize: "13px",
    color: "#cbd5e1"
  };
  const badgeStyle$3 = isActive => ({
    width: "fit-content",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    padding: "5px 10px",
    borderRadius: "999px",
    color: isActive ? "#14532d" : "#7f1d1d",
    background: isActive ? "#bbf7d0" : "#fecaca"
  });
  const linkStyle = {
    display: "inline-block",
    marginTop: "4px",
    color: "#93c5fd",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer"
  };
  const emptyStyle$2 = {
    padding: "18px",
    borderRadius: "12px",
    border: "1px dashed rgba(148, 163, 184, 0.45)",
    color: "#cbd5e1"
  };
  const formatPrice = value => {
    const amount = Number(value || 0);
    if (!Number.isFinite(amount)) {
      return "0.00";
    }
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  const getRecordId = record => {
    return record?.params?.id || record?.id || record?.param?.id || "";
  };
  const getShowHref = (record, resourceId) => {
    const recordActions = record?.recordActions || record?.actions || [];
    const showAction = recordActions.find(action => action?.name === "show");
    const rawHref = showAction?.href || record?.href || "";
    if (rawHref) {
      return rawHref;
    }
    const id = getRecordId(record);
    return id ? `/admin/resources/${encodeURIComponent(resourceId)}/records/${encodeURIComponent(id)}/show` : "";
  };
  const ProductCardsList = props => {
    const [apiRecords, setApiRecords] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [loadError, setLoadError] = React.useState("");
    const resourceId = props?.resource?.id === "Product" ? "Products" : props?.resource?.id || "Products";
    const propRecords = props?.records || [];
    React.useEffect(() => {
      if (propRecords.length) {
        return;
      }
      let isMounted = true;
      const loadRecords = async () => {
        setLoading(true);
        setLoadError("");
        try {
          const response = await fetch(`/admin/api/resources/${encodeURIComponent(resourceId)}/actions/list`, {
            credentials: "same-origin"
          });
          const payload = await response.json();
          if (!response.ok) {
            throw new Error(payload?.message || "Failed to load products");
          }
          if (isMounted) {
            setApiRecords(payload?.records || []);
          }
        } catch (error) {
          if (isMounted) {
            setLoadError(error?.message || "Failed to load products");
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
      loadRecords();
      return () => {
        isMounted = false;
      };
    }, [propRecords.length, resourceId]);
    const records = React.useMemo(() => {
      return propRecords.length ? propRecords : apiRecords;
    }, [propRecords, apiRecords]);
    if (loading) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: emptyStyle$2
      }, "Loading products...");
    }
    if (loadError) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: emptyStyle$2
      }, loadError);
    }
    if (!records.length) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: emptyStyle$2
      }, "No products found.");
    }
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: gridStyle$2
    }, records.map(record => {
      const params = record?.params || {};
      const id = getRecordId(record);
      const name = params?.name || "Unnamed product";
      const category = params?.categoryId || "-";
      const imageUrl = params?.imageUrl || "";
      const stock = Number(params?.stock || 0);
      const isActive = Boolean(params?.isActive);
      const detailsHref = getShowHref(record, resourceId);
      const openDetails = () => {
        if (detailsHref) {
          window.location.assign(detailsHref);
        }
      };
      return /*#__PURE__*/React__default.default.createElement("article", {
        key: id,
        style: cardStyle$3
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: imageWrapStyle$1
      }, imageUrl ? /*#__PURE__*/React__default.default.createElement("img", {
        src: imageUrl,
        alt: name,
        style: imageStyle$5
      }) : /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          fontSize: "13px"
        }
      }, "No image")), /*#__PURE__*/React__default.default.createElement("div", {
        style: bodyStyle
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          fontSize: "18px",
          fontWeight: 700
        }
      }, name), /*#__PURE__*/React__default.default.createElement("div", {
        style: metaStyle
      }, /*#__PURE__*/React__default.default.createElement("div", null, "Category: ", category), /*#__PURE__*/React__default.default.createElement("div", null, "Stock: ", stock), /*#__PURE__*/React__default.default.createElement("div", null, "Price: Rs. ", formatPrice(params?.price))), /*#__PURE__*/React__default.default.createElement("span", {
        style: badgeStyle$3(isActive)
      }, isActive ? "ACTIVE" : "INACTIVE"), /*#__PURE__*/React__default.default.createElement("a", {
        href: detailsHref || "#",
        style: linkStyle,
        onClick: event => {
          event.preventDefault();
          openDetails();
        },
        "aria-disabled": !detailsHref
      }, "View details")));
    }));
  };

  const pageStyle$3 = {
    display: "grid",
    gap: "18px",
    color: "#e2e8f0"
  };
  const heroStyle = {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 360px) 1fr",
    gap: "18px",
    alignItems: "stretch"
  };
  const panelStyle = {
    borderRadius: "20px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "linear-gradient(160deg, rgba(11, 26, 56, 0.96) 0%, rgba(9, 22, 47, 0.96) 100%)",
    boxShadow: "0 20px 40px rgba(2, 6, 23, 0.24)",
    overflow: "hidden"
  };
  const imageWrapStyle = {
    minHeight: "360px",
    background: "#0f172a"
  };
  const imageStyle$4 = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block"
  };
  const heroBodyStyle = {
    padding: "22px",
    display: "grid",
    gap: "16px"
  };
  const titleStyle$2 = {
    margin: 0,
    fontSize: "clamp(28px, 4vw, 46px)",
    lineHeight: 1.05,
    color: "#f8fafc"
  };
  const subtitleStyle$1 = {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px"
  };
  const badgeStyle$2 = active => ({
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    color: active ? "#14532d" : "#7f1d1d",
    background: active ? "#bbf7d0" : "#fecaca"
  });
  const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(160px, 1fr))",
    gap: "12px"
  };
  const statCardStyle = {
    borderRadius: "16px",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    background: "rgba(15, 23, 42, 0.58)",
    padding: "14px"
  };
  const statLabelStyle = {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    color: "#94a3b8",
    marginBottom: "8px"
  };
  const statValueStyle = {
    fontSize: "16px",
    fontWeight: 700,
    color: "#f8fafc",
    wordBreak: "break-word"
  };
  const sectionGridStyle = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 0.9fr)",
    gap: "18px"
  };
  const sectionTitleStyle$3 = {
    margin: 0,
    fontSize: "14px",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#f5df90"
  };
  const contentCardStyle = {
    borderRadius: "20px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(11, 26, 56, 0.9)",
    padding: "18px",
    boxShadow: "0 16px 28px rgba(2, 6, 23, 0.16)"
  };
  const infoListStyle = {
    display: "grid",
    gap: "12px"
  };
  const infoRowStyle$2 = {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    paddingBottom: "10px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)"
  };
  const infoLabelStyle = {
    color: "#94a3b8",
    fontSize: "13px"
  };
  const infoValueStyle = {
    color: "#f8fafc",
    fontWeight: 600,
    textAlign: "right",
    fontSize: "13px"
  };
  const descriptionStyle = {
    color: "#cbd5e1",
    lineHeight: 1.7,
    fontSize: "14px",
    whiteSpace: "pre-wrap"
  };
  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "14px 18px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 16px rgba(99, 102, 241, 0.3)"
  };
  const buttonHoverStyle = {
    ...buttonStyle,
    transform: "translateY(-2px)",
    boxShadow: "0 12px 24px rgba(99, 102, 241, 0.4)"
  };
  const formatCurrency = value => {
    const amount = Number(value || 0);
    return `Rs. ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
  };
  const formatDate$2 = value => {
    if (!value) {
      return "-";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };
  const ProductShow = props => {
    const record = props?.record;
    const params = record?.params || {};
    const name = params?.name || "Unnamed product";
    const sku = params?.sku || "-";
    const category = params?.categoryId || "-";
    const imageUrl = params?.imageUrl || "";
    const stock = Number(params?.stock || 0);
    const isActive = Boolean(params?.isActive);
    const price = formatCurrency(params?.price);
    const description = params?.description || "No description available for this product.";
    const [buttonHovered, setButtonHovered] = React__default.default.useState(false);
    const handleOrderClick = () => {
      const productId = params?.id || record?.id || "";
      const newOrderUrl = `/admin/resources/Orders/actions/new?productId=${encodeURIComponent(String(productId))}`;
      window.location.assign(newOrderUrl);
    };
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: pageStyle$3
    }, /*#__PURE__*/React__default.default.createElement("style", null, `
          @media (max-width: 980px) {
            .change8-product-show-hero,
            .change8-product-show-sections {
              grid-template-columns: 1fr !important;
            }
          }
        `), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-product-show-hero",
      style: heroStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: panelStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: imageWrapStyle
    }, imageUrl ? /*#__PURE__*/React__default.default.createElement("img", {
      src: imageUrl,
      alt: name,
      style: imageStyle$4
    }) : /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8"
      }
    }, "No image available"))), /*#__PURE__*/React__default.default.createElement("div", {
      style: panelStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: heroBodyStyle
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("h1", {
      style: titleStyle$2
    }, name), /*#__PURE__*/React__default.default.createElement("p", {
      style: subtitleStyle$1
    }, "Clean product overview for quick review and management.")), /*#__PURE__*/React__default.default.createElement("div", {
      style: badgeStyle$2(isActive)
    }, isActive ? "ACTIVE" : "INACTIVE"), /*#__PURE__*/React__default.default.createElement("div", {
      style: statsGridStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: statCardStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: statLabelStyle
    }, "Price"), /*#__PURE__*/React__default.default.createElement("div", {
      style: statValueStyle
    }, price)), /*#__PURE__*/React__default.default.createElement("div", {
      style: statCardStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: statLabelStyle
    }, "Stock"), /*#__PURE__*/React__default.default.createElement("button", {
      style: buttonHovered ? buttonHoverStyle : buttonStyle,
      onMouseEnter: () => setButtonHovered(true),
      onMouseLeave: () => setButtonHovered(false),
      onClick: handleOrderClick,
      title: "Click to create a new order for this product"
    }, /*#__PURE__*/React__default.default.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React__default.default.createElement("circle", {
      cx: "9",
      cy: "21",
      r: "1"
    }), /*#__PURE__*/React__default.default.createElement("circle", {
      cx: "20",
      cy: "21",
      r: "1"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
    })), "Order Now"), /*#__PURE__*/React__default.default.createElement("div", {
      style: statValueStyle
    }, stock)), /*#__PURE__*/React__default.default.createElement("div", {
      style: statCardStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: statLabelStyle
    }, "SKU"), /*#__PURE__*/React__default.default.createElement("div", {
      style: statValueStyle
    }, sku)))))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-product-show-sections",
      style: sectionGridStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: contentCardStyle
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle$3
    }, "Description"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 12
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: descriptionStyle
    }, description)), /*#__PURE__*/React__default.default.createElement("div", {
      style: contentCardStyle
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle$3
    }, "Product Details"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 12
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoListStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle$2
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: infoLabelStyle
    }, "Category"), /*#__PURE__*/React__default.default.createElement("span", {
      style: infoValueStyle
    }, category)), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle$2
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: infoLabelStyle
    }, "Created At"), /*#__PURE__*/React__default.default.createElement("span", {
      style: infoValueStyle
    }, formatDate$2(params?.createdAt))), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle$2
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: infoLabelStyle
    }, "Updated At"), /*#__PURE__*/React__default.default.createElement("span", {
      style: infoValueStyle
    }, formatDate$2(params?.updatedAt))), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle$2
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: infoLabelStyle
    }, "Record ID"), /*#__PURE__*/React__default.default.createElement("span", {
      style: infoValueStyle
    }, params?.id || record?.id || "-"))))));
  };

  const pageStyle$2 = {
    display: "grid",
    gap: "20px",
    color: "#e2e8f0"
  };
  const headerStyle$2 = {
    display: "grid",
    gap: "6px"
  };
  const titleStyle$1 = {
    margin: 0,
    fontSize: "34px",
    lineHeight: 1.08,
    color: "#f8fafc"
  };
  const descStyle = {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px"
  };
  const cardStyle$2 = {
    borderRadius: "18px",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    background: "linear-gradient(150deg, rgba(10, 23, 48, 0.94) 0%, rgba(8, 18, 38, 0.94) 100%)",
    boxShadow: "0 14px 28px rgba(2, 6, 23, 0.22)",
    padding: "18px"
  };
  const sectionTitleStyle$2 = {
    margin: "0 0 14px 0",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#f5df90",
    fontWeight: 800
  };
  const layoutStyle = {
    display: "grid",
    gridTemplateColumns: "minmax(300px, 0.95fr) minmax(420px, 1.25fr)",
    gap: "16px"
  };
  const stackStyle = {
    display: "grid",
    gap: "16px"
  };
  const labelStyle = {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#cbd5e1"
  };
  const inputStyle = {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    borderRadius: "12px",
    border: "1px solid rgba(148, 163, 184, 0.26)",
    background: "rgba(15, 23, 42, 0.62)",
    color: "#f8fafc",
    padding: "11px 13px",
    fontSize: "14px",
    fontFamily: "inherit"
  };
  const rowStyle = {
    display: "grid",
    gap: "8px",
    minWidth: 0
  };
  const grid2Style = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
    alignItems: "start"
  };
  const customerInfoStyle = {
    display: "grid",
    gap: "10px"
  };
  const customerRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    fontSize: "13px",
    paddingBottom: "8px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)"
  };
  const mutedStyle = {
    color: "#94a3b8"
  };
  const strongStyle = {
    color: "#f8fafc",
    fontWeight: 700,
    textAlign: "right"
  };
  const lineItemRowStyle = {
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "14px",
    padding: "12px",
    display: "grid",
    gap: "12px",
    background: "rgba(15, 23, 42, 0.44)"
  };
  const lineItemTopStyle = {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "10px",
    alignItems: "center"
  };
  const productPreviewStyle = {
    display: "grid",
    gridTemplateColumns: "56px 1fr",
    gap: "10px",
    alignItems: "center"
  };
  const imageStyle$3 = {
    width: "56px",
    height: "56px",
    borderRadius: "10px",
    objectFit: "cover",
    background: "#0f172a",
    border: "1px solid rgba(148, 163, 184, 0.25)"
  };
  const addButtonStyle = {
    border: "1px solid rgba(148, 163, 184, 0.35)",
    borderRadius: "10px",
    padding: "9px 12px",
    background: "rgba(99, 102, 241, 0.18)",
    color: "#dbeafe",
    cursor: "pointer",
    fontWeight: 700
  };
  const removeButtonStyle = {
    border: "1px solid rgba(239, 68, 68, 0.5)",
    borderRadius: "10px",
    padding: "8px 10px",
    background: "rgba(127, 29, 29, 0.25)",
    color: "#fecaca",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700
  };
  const totalsRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "7px 0",
    fontSize: "13px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)"
  };
  const totalStyle = {
    ...totalsRowStyle,
    fontSize: "17px",
    fontWeight: 800,
    color: "#f8fafc",
    borderBottom: "none",
    paddingTop: "12px"
  };
  const actionBarStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px"
  };
  const actionButtonStyle = primary => ({
    borderRadius: "12px",
    border: primary ? "none" : "1px solid rgba(148, 163, 184, 0.28)",
    padding: "12px 14px",
    fontWeight: 700,
    cursor: "pointer",
    background: primary ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "rgba(148, 163, 184, 0.12)",
    color: primary ? "#fff" : "#d1d5db"
  });
  const mapLinkStyle = {
    color: "#93c5fd",
    fontSize: "12px",
    textDecoration: "none"
  };
  const paymentOptionGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px"
  };
  const paymentOptionStyle = active => ({
    borderRadius: "12px",
    border: active ? "1px solid rgba(99, 102, 241, 0.9)" : "1px solid rgba(148, 163, 184, 0.24)",
    background: active ? "rgba(99, 102, 241, 0.22)" : "rgba(15, 23, 42, 0.48)",
    color: "#f8fafc",
    padding: "10px 12px",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 700
  });
  const securityChipWrapStyle = {
    marginTop: "12px",
    display: "grid",
    gap: "8px"
  };
  const securityChipStyle = {
    border: "1px solid rgba(34, 197, 94, 0.42)",
    borderRadius: "999px",
    background: "rgba(20, 83, 45, 0.24)",
    color: "#86efac",
    padding: "7px 10px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.03em"
  };
  const responsiveCss = `
.change8-order-grid-2 {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 10px !important;
}

.change8-order-grid-2 > * {
  min-width: 0 !important;
}

.change8-order-grid-2 input,
.change8-order-grid-2 select,
.change8-order-grid-2 textarea {
  width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
}

@media (max-width: 1024px) {
  .change8-order-layout {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 760px) {
  .change8-order-grid-2 {
    grid-template-columns: 1fr !important;
  }
}
`;
  const paymentOptions = [{
    value: "Card",
    label: "Card Payment",
    icon: "💳"
  }, {
    value: "Cash on Delivery",
    label: "Cash on Delivery",
    icon: "📦"
  }];
  const itemSizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const shippingMethods = ["PickMe Flash", "Pronto", "Domex", "Registered Courier"];
  const toNumber = value => {
    const num = Number(value || 0);
    return Number.isFinite(num) ? num : 0;
  };
  const formatMoney$2 = value => {
    return `Rs. ${toNumber(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
  };
  const createEmptyItem = () => ({
    productId: "",
    size: "M",
    quantity: 1,
    unitPrice: 0
  });
  const OrderCreate = () => {
    const [users, setUsers] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [orderCountByUser, setOrderCountByUser] = React.useState({});
    const [sessionUser, setSessionUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [submitting, setSubmitting] = React.useState(false);
    const [formData, setFormData] = React.useState({
      userId: "",
      status: "pending",
      paymentMethod: "Card",
      paymentStatus: "pending",
      transactionId: "",
      shippingName: "",
      shippingPhone: "",
      shippingAddress: "",
      shippingMethod: "PickMe Flash",
      trackingNumber: "",
      shippingFee: 0,
      tax: 0,
      discount: 0
    });
    const [lineItems, setLineItems] = React.useState([createEmptyItem()]);
    React.useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const preProductId = params.get("productId") || "";
      const fetchData = async () => {
        try {
          const contextRes = await fetch(`/admin/context/order-create${preProductId ? `?productId=${encodeURIComponent(preProductId)}` : ""}`, {
            credentials: "same-origin"
          });
          const contextData = contextRes.ok ? await contextRes.json() : {};
          const usersData = Array.isArray(contextData?.users) ? contextData.users : [];
          const productsList = Array.isArray(contextData?.products) ? contextData.products : [];
          setUsers(usersData);
          setProducts(productsList);
          setOrderCountByUser(contextData?.orderCountByUser || {});
          setSessionUser(contextData?.currentUser || null);
          if (contextData?.currentUser?.id) {
            setFormData(prev => ({
              ...prev,
              userId: prev.userId || String(contextData.currentUser.id)
            }));
          }
          if (contextData?.selectedProduct?.id) {
            setLineItems([{
              productId: String(contextData.selectedProduct.id),
              size: "M",
              quantity: 1,
              unitPrice: toNumber(contextData.selectedProduct.price)
            }]);
            return;
          }
          if (preProductId && productsList.some(p => String(p.id) === String(preProductId))) {
            const selected = productsList.find(p => String(p.id) === String(preProductId));
            setLineItems([{
              productId: String(preProductId),
              size: "M",
              quantity: 1,
              unitPrice: toNumber(selected?.price)
            }]);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);
    const selectedCustomer = React.useMemo(() => {
      return users.find(u => String(u.id) === String(formData.userId)) || null;
    }, [users, formData.userId]);
    const customerOrderCount = React.useMemo(() => {
      if (!selectedCustomer) {
        return 0;
      }
      return Number(orderCountByUser[String(selectedCustomer.id)] || 0);
    }, [orderCountByUser, selectedCustomer]);
    React.useEffect(() => {
      if (!selectedCustomer) {
        return;
      }
      setFormData(prev => ({
        ...prev,
        shippingName: prev.shippingName || selectedCustomer.name || "",
        shippingPhone: prev.shippingPhone || selectedCustomer.phone || selectedCustomer.mobile || ""
      }));
    }, [selectedCustomer]);
    const lineTotals = React.useMemo(() => {
      const subtotal = lineItems.reduce((sum, item) => {
        return sum + toNumber(item.quantity) * toNumber(item.unitPrice);
      }, 0);
      const shippingFee = toNumber(formData.shippingFee);
      const tax = toNumber(formData.tax);
      const discount = toNumber(formData.discount);
      const grandTotal = Math.max(subtotal + shippingFee + tax - discount, 0);
      return {
        subtotal,
        shippingFee,
        tax,
        discount,
        grandTotal
      };
    }, [lineItems, formData.shippingFee, formData.tax, formData.discount]);
    const handleFormChange = event => {
      const {
        name,
        value
      } = event.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
    const handleLineItemChange = (index, key, value) => {
      setLineItems(prev => {
        const next = [...prev];
        const item = {
          ...next[index]
        };
        if (key === "productId") {
          item.productId = value;
          const product = products.find(p => String(p.id) === String(value));
          item.unitPrice = toNumber(product?.price);
        } else if (key === "size") {
          item.size = value;
        } else if (key === "quantity") {
          item.quantity = Math.max(1, toNumber(value));
        } else if (key === "unitPrice") {
          item.unitPrice = Math.max(0, toNumber(value));
        }
        next[index] = item;
        return next;
      });
    };
    const addLineItem = () => {
      setLineItems(prev => [...prev, createEmptyItem()]);
    };
    const removeLineItem = index => {
      setLineItems(prev => {
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter((_, i) => i !== index);
      });
    };
    const mapsHref = React.useMemo(() => {
      if (!formData.shippingAddress?.trim()) {
        return "";
      }
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.shippingAddress.trim())}`;
    }, [formData.shippingAddress]);
    const handleSubmit = async event => {
      event.preventDefault();
      const validItems = lineItems.filter(item => item.productId && toNumber(item.quantity) > 0);
      if (!formData.userId) {
        alert("Please select a customer.");
        return;
      }
      if (validItems.length === 0) {
        alert("At least one product line item is required.");
        return;
      }
      setSubmitting(true);
      try {
        const orderPayload = {
          userId: Number(formData.userId),
          status: formData.status,
          paymentMethod: formData.paymentMethod,
          paymentStatus: formData.paymentStatus,
          transactionId: formData.transactionId || null,
          shippingName: formData.shippingName || null,
          shippingPhone: formData.shippingPhone || null,
          shippingMethod: formData.shippingMethod,
          trackingNumber: formData.trackingNumber || null,
          subtotal: lineTotals.subtotal.toFixed(2),
          shippingFee: lineTotals.shippingFee.toFixed(2),
          tax: lineTotals.tax.toFixed(2),
          discount: lineTotals.discount.toFixed(2),
          totalAmount: lineTotals.grandTotal.toFixed(2),
          shippingAddress: formData.shippingAddress || null,
          lineItems: validItems.map(item => ({
            productId: Number(item.productId),
            size: item.size || null,
            quantity: Math.max(1, toNumber(item.quantity)),
            unitPrice: Math.max(0, toNumber(item.unitPrice)).toFixed(2)
          }))
        };
        const submitForm = new FormData();
        submitForm.append("payload", JSON.stringify(orderPayload));
        const orderRes = await fetch("/admin/context/order-create/submit", {
          method: "POST",
          credentials: "same-origin",
          body: submitForm
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok) {
          throw new Error(orderData?.message || "Failed to create order");
        }
        window.location.assign(`/admin/resources/Orders/records/${orderData.id}/show`);
      } catch (error) {
        alert(error.message || "Failed to create order");
      } finally {
        setSubmitting(false);
      }
    };
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: pageStyle$2
    }, /*#__PURE__*/React__default.default.createElement("style", null, responsiveCss), /*#__PURE__*/React__default.default.createElement("div", {
      style: headerStyle$2
    }, /*#__PURE__*/React__default.default.createElement("h1", {
      style: titleStyle$1
    }, "Create New Order"), /*#__PURE__*/React__default.default.createElement("p", {
      style: descStyle
    }, "Customer details, line items, payment, shipping, and totals in one guided flow.")), /*#__PURE__*/React__default.default.createElement("form", {
      onSubmit: handleSubmit,
      style: {
        display: "grid",
        gap: "16px"
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-order-layout",
      style: layoutStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: stackStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle$2
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle$2
    }, "Customer Details"), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Select Customer *"), /*#__PURE__*/React__default.default.createElement("select", {
      name: "userId",
      value: formData.userId,
      onChange: handleFormChange,
      style: inputStyle,
      required: true,
      disabled: loading || sessionUser?.role === "user"
    }, /*#__PURE__*/React__default.default.createElement("option", {
      value: ""
    }, loading ? "Loading customers..." : "Select a customer"), users.map(user => /*#__PURE__*/React__default.default.createElement("option", {
      key: user.id,
      value: user.id
    }, user.name, " (#", user.id, ")")))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 12
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: customerInfoStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: customerRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: mutedStyle
    }, "Customer Name & ID"), /*#__PURE__*/React__default.default.createElement("span", {
      style: strongStyle
    }, selectedCustomer ? `${selectedCustomer.name} (#${selectedCustomer.id})` : "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: customerRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: mutedStyle
    }, "Email"), /*#__PURE__*/React__default.default.createElement("span", {
      style: strongStyle
    }, selectedCustomer?.email || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: customerRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: mutedStyle
    }, "Phone Number"), /*#__PURE__*/React__default.default.createElement("span", {
      style: strongStyle
    }, selectedCustomer?.phone || selectedCustomer?.mobile || "Not available")), /*#__PURE__*/React__default.default.createElement("div", {
      style: customerRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: mutedStyle
    }, "Order History"), /*#__PURE__*/React__default.default.createElement("span", {
      style: strongStyle
    }, customerOrderCount, " previous orders")))), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle$2
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle$2
    }, "Payment & Billing"), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Payment Options"), /*#__PURE__*/React__default.default.createElement("div", {
      style: paymentOptionGridStyle
    }, paymentOptions.map(option => {
      const active = formData.paymentMethod === option.value;
      return /*#__PURE__*/React__default.default.createElement("button", {
        key: option.value,
        type: "button",
        style: paymentOptionStyle(active),
        onClick: () => setFormData(prev => ({
          ...prev,
          paymentMethod: option.value
        }))
      }, /*#__PURE__*/React__default.default.createElement("span", null, option.icon), /*#__PURE__*/React__default.default.createElement("span", null, option.label));
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 10
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-order-grid-2",
      style: grid2Style
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Selected Method"), /*#__PURE__*/React__default.default.createElement("input", {
      value: formData.paymentMethod,
      style: inputStyle,
      readOnly: true
    })), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Payment Status"), /*#__PURE__*/React__default.default.createElement("select", {
      name: "paymentStatus",
      value: formData.paymentStatus,
      onChange: handleFormChange,
      style: inputStyle
    }, /*#__PURE__*/React__default.default.createElement("option", {
      value: "pending"
    }, "Pending"), /*#__PURE__*/React__default.default.createElement("option", {
      value: "paid"
    }, "Paid")))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 10
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Transaction ID"), /*#__PURE__*/React__default.default.createElement("input", {
      name: "transactionId",
      value: formData.transactionId,
      onChange: handleFormChange,
      style: inputStyle,
      placeholder: "e.g. TXN-2026-000124"
    })))), /*#__PURE__*/React__default.default.createElement("div", {
      style: stackStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle$2
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "8px"
      }
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: {
        ...sectionTitleStyle$2,
        marginBottom: 0
      }
    }, "Product Line Items (Required)"), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      onClick: addLineItem,
      style: addButtonStyle
    }, "+ Add Item")), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 12
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: "grid",
        gap: "10px"
      }
    }, lineItems.map((item, index) => {
      const selectedProduct = products.find(p => String(p.id) === String(item.productId));
      const itemTotal = toNumber(item.quantity) * toNumber(item.unitPrice);
      return /*#__PURE__*/React__default.default.createElement("div", {
        key: `line-item-${index}`,
        style: lineItemRowStyle
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: lineItemTopStyle
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: rowStyle
      }, /*#__PURE__*/React__default.default.createElement("label", {
        style: labelStyle
      }, "Product"), /*#__PURE__*/React__default.default.createElement("select", {
        value: item.productId,
        onChange: event => handleLineItemChange(index, "productId", event.target.value),
        style: inputStyle,
        required: true
      }, /*#__PURE__*/React__default.default.createElement("option", {
        value: ""
      }, "Select product"), products.map(product => /*#__PURE__*/React__default.default.createElement("option", {
        key: product.id,
        value: product.id
      }, product.name, " (SKU: ", product.sku, ")")))), /*#__PURE__*/React__default.default.createElement("button", {
        type: "button",
        style: removeButtonStyle,
        onClick: () => removeLineItem(index)
      }, "Remove")), /*#__PURE__*/React__default.default.createElement("div", {
        style: productPreviewStyle
      }, selectedProduct?.imageUrl ? /*#__PURE__*/React__default.default.createElement("img", {
        src: selectedProduct.imageUrl,
        alt: selectedProduct.name,
        style: imageStyle$3
      }) : /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          ...imageStyle$3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          fontSize: "11px"
        }
      }, "No image"), /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: "grid",
          gap: "3px"
        }
      }, /*#__PURE__*/React__default.default.createElement("strong", {
        style: {
          fontSize: "14px",
          color: "#f8fafc"
        }
      }, selectedProduct?.name || "Select a product"), /*#__PURE__*/React__default.default.createElement("span", {
        style: {
          fontSize: "12px",
          color: "#94a3b8"
        }
      }, "SKU/ID:", " ", selectedProduct ? `${selectedProduct.sku} / #${selectedProduct.id}` : "-"), /*#__PURE__*/React__default.default.createElement("span", {
        style: {
          fontSize: "12px",
          color: "#cbd5e1"
        }
      }, "Size: ", item.size || "-", " | Qty: ", item.quantity))), /*#__PURE__*/React__default.default.createElement("div", {
        style: rowStyle
      }, /*#__PURE__*/React__default.default.createElement("label", {
        style: labelStyle
      }, "Size"), /*#__PURE__*/React__default.default.createElement("select", {
        value: item.size || "M",
        onChange: event => handleLineItemChange(index, "size", event.target.value),
        style: inputStyle
      }, itemSizeOptions.map(sizeOption => /*#__PURE__*/React__default.default.createElement("option", {
        key: sizeOption,
        value: sizeOption
      }, sizeOption)))), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-order-grid-2",
        style: grid2Style
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: rowStyle
      }, /*#__PURE__*/React__default.default.createElement("label", {
        style: labelStyle
      }, "Quantity"), /*#__PURE__*/React__default.default.createElement("input", {
        type: "number",
        min: "1",
        value: item.quantity,
        onChange: event => handleLineItemChange(index, "quantity", event.target.value),
        style: inputStyle,
        required: true
      })), /*#__PURE__*/React__default.default.createElement("div", {
        style: rowStyle
      }, /*#__PURE__*/React__default.default.createElement("label", {
        style: labelStyle
      }, "Unit Price"), /*#__PURE__*/React__default.default.createElement("input", {
        type: "number",
        min: "0",
        step: "0.01",
        value: item.unitPrice,
        onChange: event => handleLineItemChange(index, "unitPrice", event.target.value),
        style: inputStyle,
        required: true
      }))), /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          ...totalsRowStyle,
          borderBottom: "none",
          paddingBottom: 0
        }
      }, /*#__PURE__*/React__default.default.createElement("span", {
        style: mutedStyle
      }, "Line Total"), /*#__PURE__*/React__default.default.createElement("strong", {
        style: {
          color: "#f8fafc"
        }
      }, formatMoney$2(itemTotal))));
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle$2
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle$2
    }, "Shipping & Tracking"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-order-grid-2",
      style: grid2Style
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Shipping Contact Name *"), /*#__PURE__*/React__default.default.createElement("input", {
      name: "shippingName",
      value: formData.shippingName,
      onChange: handleFormChange,
      style: inputStyle,
      placeholder: "Receiver full name",
      required: true
    })), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Shipping Phone Number *"), /*#__PURE__*/React__default.default.createElement("input", {
      name: "shippingPhone",
      value: formData.shippingPhone,
      onChange: handleFormChange,
      style: inputStyle,
      placeholder: "07X XXX XXXX",
      required: true
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 10
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Shipping Address *"), /*#__PURE__*/React__default.default.createElement("textarea", {
      name: "shippingAddress",
      value: formData.shippingAddress,
      onChange: handleFormChange,
      style: {
        ...inputStyle,
        minHeight: "86px",
        resize: "vertical"
      },
      placeholder: "House number, street, city, postal code",
      required: true
    }), mapsHref ? /*#__PURE__*/React__default.default.createElement("a", {
      href: mapsHref,
      target: "_blank",
      rel: "noreferrer",
      style: mapLinkStyle
    }, "Open on Google Maps") : null), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 10
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-order-grid-2",
      style: grid2Style
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Shipping Method"), /*#__PURE__*/React__default.default.createElement("select", {
      name: "shippingMethod",
      value: formData.shippingMethod,
      onChange: handleFormChange,
      style: inputStyle
    }, shippingMethods.map(item => /*#__PURE__*/React__default.default.createElement("option", {
      key: item,
      value: item
    }, item)))), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Tracking Number"), /*#__PURE__*/React__default.default.createElement("input", {
      name: "trackingNumber",
      value: formData.trackingNumber,
      onChange: handleFormChange,
      style: inputStyle,
      placeholder: "TRK-XXXXXX"
    })))), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle$2
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle$2
    }, "Order Summary / Totals"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-order-grid-2",
      style: grid2Style
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Shipping Fee"), /*#__PURE__*/React__default.default.createElement("input", {
      type: "number",
      step: "0.01",
      min: "0",
      name: "shippingFee",
      value: formData.shippingFee,
      onChange: handleFormChange,
      style: inputStyle
    })), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Tax / VAT"), /*#__PURE__*/React__default.default.createElement("input", {
      type: "number",
      step: "0.01",
      min: "0",
      name: "tax",
      value: formData.tax,
      onChange: handleFormChange,
      style: inputStyle
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 10
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Discount / Coupon"), /*#__PURE__*/React__default.default.createElement("input", {
      type: "number",
      step: "0.01",
      min: "0",
      name: "discount",
      value: formData.discount,
      onChange: handleFormChange,
      style: inputStyle
    })), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 12
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: totalsRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: mutedStyle
    }, "Subtotal"), /*#__PURE__*/React__default.default.createElement("strong", null, formatMoney$2(lineTotals.subtotal))), /*#__PURE__*/React__default.default.createElement("div", {
      style: totalsRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: mutedStyle
    }, "Shipping Fee"), /*#__PURE__*/React__default.default.createElement("strong", null, formatMoney$2(lineTotals.shippingFee))), /*#__PURE__*/React__default.default.createElement("div", {
      style: totalsRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: mutedStyle
    }, "Tax / VAT"), /*#__PURE__*/React__default.default.createElement("strong", null, formatMoney$2(lineTotals.tax))), /*#__PURE__*/React__default.default.createElement("div", {
      style: totalsRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: mutedStyle
    }, "Discount"), /*#__PURE__*/React__default.default.createElement("strong", null, "- ", formatMoney$2(lineTotals.discount))), /*#__PURE__*/React__default.default.createElement("div", {
      style: totalStyle
    }, /*#__PURE__*/React__default.default.createElement("span", null, "Grand Total"), /*#__PURE__*/React__default.default.createElement("span", null, formatMoney$2(lineTotals.grandTotal))), /*#__PURE__*/React__default.default.createElement("div", {
      style: securityChipWrapStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: securityChipStyle
    }, "Secure Payment Protected"), /*#__PURE__*/React__default.default.createElement("div", {
      style: securityChipStyle
    }, "Encrypted Checkout Channel"), /*#__PURE__*/React__default.default.createElement("div", {
      style: securityChipStyle
    }, "Trusted Delivery Tracking"))))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        ...cardStyle$2,
        paddingTop: "14px"
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: actionBarStyle
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      style: actionButtonStyle(false),
      onClick: () => window.history.back(),
      disabled: submitting
    }, "Cancel"), /*#__PURE__*/React__default.default.createElement("button", {
      type: "submit",
      style: actionButtonStyle(true),
      disabled: submitting
    }, submitting ? "Creating Order..." : "Create Order")))));
  };

  const pageStyle$1 = {
    display: "grid",
    gap: "16px",
    color: "#e2e8f0"
  };
  const cardStyle$1 = {
    borderRadius: "18px",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    background: "linear-gradient(155deg, rgba(10, 23, 48, 0.94) 0%, rgba(8, 18, 38, 0.94) 100%)",
    boxShadow: "0 14px 30px rgba(2, 6, 23, 0.2)",
    padding: "18px"
  };
  const headerStyle$1 = {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center"
  };
  const headingStyle = {
    margin: 0,
    color: "#f8fafc",
    fontSize: "34px",
    lineHeight: 1.1
  };
  const subTextStyle = {
    color: "#94a3b8",
    fontSize: "13px",
    marginTop: "4px"
  };
  const badgeStyle$1 = status => {
    const val = String(status || "pending").toLowerCase();
    const styleByStatus = {
      pending: {
        bg: "#fef3c7",
        fg: "#7c2d12"
      },
      paid: {
        bg: "#bbf7d0",
        fg: "#14532d"
      },
      processing: {
        bg: "#bfdbfe",
        fg: "#1e3a8a"
      },
      shipped: {
        bg: "#ddd6fe",
        fg: "#4c1d95"
      },
      completed: {
        bg: "#a7f3d0",
        fg: "#064e3b"
      },
      cancelled: {
        bg: "#fecaca",
        fg: "#7f1d1d"
      }
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
      color: selected.fg
    };
  };
  const sectionTitleStyle$1 = {
    margin: "0 0 12px 0",
    color: "#f5df90",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.11em",
    textTransform: "uppercase"
  };
  const gridStyle$1 = {
    display: "grid",
    gridTemplateColumns: "minmax(300px, 1fr) minmax(320px, 1fr)",
    gap: "16px"
  };
  const infoGridStyle$1 = {
    display: "grid",
    gap: "8px"
  };
  const infoRowStyle$1 = {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
    paddingBottom: "8px",
    fontSize: "13px"
  };
  const tableStyle = {
    display: "grid",
    gap: "10px"
  };
  const lineItemStyle$1 = {
    border: "1px solid rgba(148, 163, 184, 0.22)",
    borderRadius: "14px",
    padding: "10px",
    background: "rgba(15, 23, 42, 0.44)",
    display: "grid",
    gridTemplateColumns: "60px 1fr auto",
    gap: "10px",
    alignItems: "center"
  };
  const imageStyle$2 = {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid rgba(148, 163, 184, 0.22)",
    background: "#0f172a"
  };
  const totalBoxStyle = {
    display: "grid",
    gap: "8px"
  };
  const totalRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
    paddingBottom: "7px"
  };
  const grandStyle = {
    ...totalRowStyle,
    borderBottom: "none",
    paddingTop: "6px",
    fontWeight: 800,
    fontSize: "18px",
    color: "#f8fafc"
  };
  const emptyStyle$1 = {
    border: "1px dashed rgba(148, 163, 184, 0.35)",
    borderRadius: "12px",
    padding: "14px",
    color: "#cbd5e1"
  };
  const formatMoney$1 = value => {
    const n = Number(value || 0);
    return `Rs. ${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
  };
  const formatDate$1 = value => {
    if (!value) {
      return "-";
    }
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) {
      return String(value);
    }
    return dt.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };
  const OrderShow = ({
    record
  }) => {
    const [details, setDetails] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const orderId = record?.params?.id || record?.id;
    React.useEffect(() => {
      if (!orderId) {
        setLoading(false);
        setError("Order id not found");
        return;
      }
      const loadDetails = async () => {
        try {
          setError("");
          const response = await fetch(`/admin/context/orders/${encodeURIComponent(String(orderId))}/details`, {
            credentials: "same-origin"
          });
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
    const totals = React.useMemo(() => {
      const subtotal = Number(details?.subtotal || 0);
      const shippingFee = Number(details?.shippingFee || 0);
      const tax = Number(details?.tax || 0);
      const discount = Number(details?.discount || 0);
      const totalAmount = Number(details?.totalAmount || 0);
      return {
        subtotal,
        shippingFee,
        tax,
        discount,
        totalAmount
      };
    }, [details]);
    if (loading) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: emptyStyle$1
      }, "Loading order details...");
    }
    if (error) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: emptyStyle$1
      }, error);
    }
    if (!details) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: emptyStyle$1
      }, "Order details not available.");
    }
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: pageStyle$1
    }, /*#__PURE__*/React__default.default.createElement("style", null, `@media (max-width: 1040px) { .change8-order-show-grid { grid-template-columns: 1fr !important; } }`), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle$1
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: headerStyle$1
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("h1", {
      style: headingStyle
    }, "Order #", details.id), /*#__PURE__*/React__default.default.createElement("div", {
      style: subTextStyle
    }, "Created ", formatDate$1(details.createdAt), " | Updated", " ", formatDate$1(details.updatedAt))), /*#__PURE__*/React__default.default.createElement("span", {
      style: badgeStyle$1(details.status)
    }, details.status || "pending"))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-order-show-grid",
      style: gridStyle$1
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle$1
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle$1
    }, "Customer & Shipping"), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoGridStyle$1
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Customer"), /*#__PURE__*/React__default.default.createElement("strong", null, details?.user?.name || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Shipping Contact"), /*#__PURE__*/React__default.default.createElement("strong", null, details?.shippingName || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Shipping Phone"), /*#__PURE__*/React__default.default.createElement("strong", null, details?.shippingPhone || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Email"), /*#__PURE__*/React__default.default.createElement("strong", null, details?.user?.email || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Payment Method"), /*#__PURE__*/React__default.default.createElement("strong", null, details?.paymentMethod || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Payment Status"), /*#__PURE__*/React__default.default.createElement("strong", null, details?.paymentStatus || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Transaction ID"), /*#__PURE__*/React__default.default.createElement("strong", null, details?.transactionId || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Shipping Method"), /*#__PURE__*/React__default.default.createElement("strong", null, details?.shippingMethod || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Tracking Number"), /*#__PURE__*/React__default.default.createElement("strong", null, details?.trackingNumber || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: "13px",
        color: "#cbd5e1",
        lineHeight: 1.6
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: "#94a3b8",
        marginBottom: "4px"
      }
    }, "Shipping Address"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        whiteSpace: "pre-wrap"
      }
    }, details?.shippingAddress || "-")))), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle$1
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle$1
    }, "Order Summary / Totals"), /*#__PURE__*/React__default.default.createElement("div", {
      style: totalBoxStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: totalRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Subtotal"), /*#__PURE__*/React__default.default.createElement("strong", null, formatMoney$1(totals.subtotal))), /*#__PURE__*/React__default.default.createElement("div", {
      style: totalRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Shipping Fee"), /*#__PURE__*/React__default.default.createElement("strong", null, formatMoney$1(totals.shippingFee))), /*#__PURE__*/React__default.default.createElement("div", {
      style: totalRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Tax / VAT"), /*#__PURE__*/React__default.default.createElement("strong", null, formatMoney$1(totals.tax))), /*#__PURE__*/React__default.default.createElement("div", {
      style: totalRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Discount"), /*#__PURE__*/React__default.default.createElement("strong", null, "- ", formatMoney$1(totals.discount))), /*#__PURE__*/React__default.default.createElement("div", {
      style: grandStyle
    }, /*#__PURE__*/React__default.default.createElement("span", null, "Grand Total"), /*#__PURE__*/React__default.default.createElement("span", null, formatMoney$1(totals.totalAmount)))))), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle$1
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle$1
    }, "Product Line Items"), /*#__PURE__*/React__default.default.createElement("div", {
      style: tableStyle
    }, (details?.items || []).length === 0 ? /*#__PURE__*/React__default.default.createElement("div", {
      style: emptyStyle$1
    }, "No line items in this order.") : (details.items || []).map(item => /*#__PURE__*/React__default.default.createElement("div", {
      key: item.id,
      style: lineItemStyle$1
    }, item?.product?.imageUrl ? /*#__PURE__*/React__default.default.createElement("img", {
      src: item.product.imageUrl,
      alt: item?.product?.name || "Product",
      style: imageStyle$2
    }) : /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        ...imageStyle$2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        color: "#94a3b8"
      }
    }, "No image"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: "grid",
        gap: "4px"
      }
    }, /*#__PURE__*/React__default.default.createElement("strong", {
      style: {
        color: "#f8fafc",
        fontSize: "14px"
      }
    }, item?.product?.name || "Unnamed product"), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8",
        fontSize: "12px"
      }
    }, "SKU: ", item?.product?.sku || "-", " | Product ID: #", item?.productId), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#cbd5e1",
        fontSize: "12px"
      }
    }, "Size: ", item?.size || "-", " | Qty: ", item.quantity, " x", " ", formatMoney$1(item.unitPrice))), /*#__PURE__*/React__default.default.createElement("strong", {
      style: {
        color: "#f8fafc",
        fontSize: "15px"
      }
    }, formatMoney$1(item.totalPrice)))))));
  };

  const pageStyle = {
    display: "grid",
    gap: "16px",
    color: "#e2e8f0"
  };
  const cardStyle = {
    borderRadius: "18px",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    background: "linear-gradient(155deg, rgba(10, 23, 48, 0.94) 0%, rgba(8, 18, 38, 0.94) 100%)",
    boxShadow: "0 14px 30px rgba(2, 6, 23, 0.2)",
    padding: "18px"
  };
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center"
  };
  const titleStyle = {
    margin: 0,
    fontSize: "34px",
    lineHeight: 1.1,
    color: "#f8fafc"
  };
  const subtitleStyle = {
    margin: "6px 0 0 0",
    color: "#94a3b8",
    fontSize: "13px"
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
    background: "#bbf7d0"
  };
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "minmax(300px, 0.95fr) minmax(320px, 1.05fr)",
    gap: "16px"
  };
  const sectionTitleStyle = {
    margin: "0 0 12px 0",
    color: "#f5df90",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.11em",
    textTransform: "uppercase"
  };
  const infoGridStyle = {
    display: "grid",
    gap: "8px"
  };
  const infoRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
    paddingBottom: "8px",
    fontSize: "13px"
  };
  const imageStyle$1 = {
    width: "100%",
    height: "280px",
    objectFit: "cover",
    borderRadius: "14px",
    background: "#0f172a",
    border: "1px solid rgba(148, 163, 184, 0.22)"
  };
  const lineItemStyle = {
    display: "grid",
    gridTemplateColumns: "84px 1fr auto",
    gap: "12px",
    alignItems: "center",
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    background: "rgba(15, 23, 42, 0.44)"
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
    fontSize: "11px"
  };
  const emptyStyle = {
    border: "1px dashed rgba(148, 163, 184, 0.35)",
    borderRadius: "12px",
    padding: "14px",
    color: "#cbd5e1"
  };
  const formatMoney = value => {
    const n = Number(value || 0);
    return `Rs. ${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
  };
  const formatDate = value => {
    if (!value) {
      return "-";
    }
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) {
      return String(value);
    }
    return dt.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };
  const OrderItemShow = ({
    record
  }) => {
    const [details, setDetails] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const orderItemId = record?.params?.id || record?.id;
    React.useEffect(() => {
      if (!orderItemId) {
        setLoading(false);
        setError("Order item id not found");
        return;
      }
      const loadDetails = async () => {
        try {
          setError("");
          const response = await fetch(`/admin/context/order-items/${encodeURIComponent(String(orderItemId))}/details`, {
            credentials: "same-origin"
          });
          const payload = await response.json();
          if (!response.ok) {
            throw new Error(payload?.message || "Failed to load order item details");
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
    const calculatedTotal = React.useMemo(() => {
      return Number(details?.totalPrice || 0);
    }, [details]);
    if (loading) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: emptyStyle
      }, "Loading order item details...");
    }
    if (error) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: emptyStyle
      }, error);
    }
    if (!details) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: emptyStyle
      }, "Order item details not available.");
    }
    const product = details?.product || {};
    const order = details?.order || {};
    const customer = order?.user || {};
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: pageStyle
    }, /*#__PURE__*/React__default.default.createElement("style", null, `@media (max-width: 1040px) { .change8-order-item-grid { grid-template-columns: 1fr !important; } }`), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: headerStyle
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("h1", {
      style: titleStyle
    }, product?.name || "Order Item"), /*#__PURE__*/React__default.default.createElement("p", {
      style: subtitleStyle
    }, "Order #", order?.id || "-", " \u2022 Item #", details?.id || "-")), /*#__PURE__*/React__default.default.createElement("span", {
      style: badgeStyle
    }, "Active Item"))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-order-item-grid",
      style: gridStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle
    }, product?.imageUrl ? /*#__PURE__*/React__default.default.createElement("img", {
      src: product.imageUrl,
      alt: product?.name || "Product",
      style: imageStyle$1
    }) : /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        ...imageStyle$1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8"
      }
    }, "No image available"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 14
      }
    }), /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle
    }, "Product Snapshot"), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoGridStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Product Name"), /*#__PURE__*/React__default.default.createElement("strong", null, product?.name || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "SKU"), /*#__PURE__*/React__default.default.createElement("strong", null, product?.sku || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Product ID"), /*#__PURE__*/React__default.default.createElement("strong", null, "#", product?.id || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Current Stock"), /*#__PURE__*/React__default.default.createElement("strong", null, product?.stock ?? "-")))), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle
    }, "Order & Customer"), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoGridStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Customer"), /*#__PURE__*/React__default.default.createElement("strong", null, customer?.name || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Email"), /*#__PURE__*/React__default.default.createElement("strong", null, customer?.email || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Order ID"), /*#__PURE__*/React__default.default.createElement("strong", null, "#", order?.id || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Order Status"), /*#__PURE__*/React__default.default.createElement("strong", null, order?.status || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Payment Method"), /*#__PURE__*/React__default.default.createElement("strong", null, order?.paymentMethod || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Shipping Method"), /*#__PURE__*/React__default.default.createElement("strong", null, order?.shippingMethod || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Tracking Number"), /*#__PURE__*/React__default.default.createElement("strong", null, order?.trackingNumber || "-")), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Created At"), /*#__PURE__*/React__default.default.createElement("strong", null, formatDate(details.createdAt)))))), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle
    }, "Pricing Details"), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoGridStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Quantity"), /*#__PURE__*/React__default.default.createElement("strong", null, details.quantity)), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Unit Price"), /*#__PURE__*/React__default.default.createElement("strong", null, formatMoney(details.unitPrice))), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8"
      }
    }, "Line Total"), /*#__PURE__*/React__default.default.createElement("strong", null, formatMoney(calculatedTotal))))), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle
    }, "Quick Summary"), /*#__PURE__*/React__default.default.createElement("div", {
      style: lineItemStyle
    }, product?.imageUrl ? /*#__PURE__*/React__default.default.createElement("img", {
      src: product.imageUrl,
      alt: product?.name || "Product",
      style: {
        width: "84px",
        height: "84px",
        objectFit: "cover",
        borderRadius: "12px"
      }
    }) : /*#__PURE__*/React__default.default.createElement("div", {
      style: emptyImageStyle
    }, "No image"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: "grid",
        gap: "4px"
      }
    }, /*#__PURE__*/React__default.default.createElement("strong", {
      style: {
        color: "#f8fafc",
        fontSize: "16px"
      }
    }, product?.name || "Unnamed product"), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#94a3b8",
        fontSize: "12px"
      }
    }, "SKU: ", product?.sku || "-"), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: "#cbd5e1",
        fontSize: "12px"
      }
    }, "Qty ", details.quantity, " x ", formatMoney(details.unitPrice))), /*#__PURE__*/React__default.default.createElement("strong", {
      style: {
        color: "#f8fafc",
        fontSize: "16px"
      }
    }, formatMoney(calculatedTotal)))));
  };

  const cellStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minHeight: "56px"
  };
  const imageStyle = {
    width: "64px",
    height: "42px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid rgba(148, 163, 184, 0.35)",
    background: "#f8fafc",
    flexShrink: 0
  };
  const fallbackStyle = {
    width: "64px",
    height: "42px",
    borderRadius: "10px",
    border: "1px dashed rgba(148, 163, 184, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    color: "#64748b",
    background: "#f8fafc",
    flexShrink: 0
  };
  const textStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "2px"
  };
  const ProductImage = props => {
    const imageUrl = props?.record?.params?.[props?.property?.path];
    const [hasError, setHasError] = React.useState(false);
    React.useEffect(() => {
      setHasError(false);
    }, [imageUrl]);
    if (!imageUrl) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: fallbackStyle
      }, "No image");
    }
    if (hasError) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: cellStyle
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: fallbackStyle
      }, "Invalid"), /*#__PURE__*/React__default.default.createElement("div", {
        style: textStyle
      }, /*#__PURE__*/React__default.default.createElement("span", {
        style: {
          fontWeight: 600,
          color: "#0f172a"
        }
      }, "Image URL"), /*#__PURE__*/React__default.default.createElement("a", {
        href: imageUrl,
        target: "_blank",
        rel: "noreferrer",
        style: {
          color: "#2563eb",
          textDecoration: "none",
          fontSize: "12px"
        }
      }, "Open link")));
    }
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: cellStyle
    }, /*#__PURE__*/React__default.default.createElement("img", {
      src: imageUrl,
      alt: "Product",
      style: imageStyle,
      onError: () => setHasError(true)
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: textStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontWeight: 600,
        color: "#0f172a"
      }
    }, "Preview"), /*#__PURE__*/React__default.default.createElement("a", {
      href: imageUrl,
      target: "_blank",
      rel: "noreferrer",
      style: {
        color: "#2563eb",
        textDecoration: "none",
        fontSize: "12px"
      }
    }, "Open image")));
  };

  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  };
  const previewStyle = {
    width: "140px",
    height: "96px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid rgba(148, 163, 184, 0.35)",
    background: "#f8fafc"
  };
  const hintStyle = {
    fontSize: "12px",
    color: "#64748b"
  };
  const ProductImageUpload = props => {
    const {
      onChange,
      record
    } = props;
    const currentValue = record?.params?.imageUrl || "";
    const currentPublicId = record?.params?.imagePublicId || "";
    const [previewUrl, setPreviewUrl] = React.useState(currentValue);
    const [publicId, setPublicId] = React.useState(currentPublicId);
    const [uploading, setUploading] = React.useState(false);
    const [error, setError] = React.useState("");
    React.useEffect(() => {
      setPreviewUrl(currentValue);
      setPublicId(currentPublicId);
    }, [currentValue, currentPublicId]);
    const handleUpload = async event => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      setUploading(true);
      setError("");
      try {
        const formData = new FormData();
        formData.append("image", file);
        const response = await fetch("/api/uploads/image", {
          method: "POST",
          body: formData
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.message || "Image upload failed");
        }
        const uploadedUrl = payload.url || "";
        const uploadedPublicId = payload.publicId || "";
        setPreviewUrl(uploadedUrl);
        setPublicId(uploadedPublicId);
        onChange?.("imageUrl", uploadedUrl);
        onChange?.("imagePublicId", uploadedPublicId);
        onChange?.("uploadImage", uploadedUrl);
      } catch (uploadError) {
        setError(uploadError.message);
      } finally {
        setUploading(false);
        event.target.value = "";
      }
    };
    const handleRemove = () => {
      setPreviewUrl("");
      setPublicId("");
      onChange?.("imageUrl", "");
      onChange?.("imagePublicId", "");
      onChange?.("uploadImage", "");
    };
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: wrapperStyle
    }, /*#__PURE__*/React__default.default.createElement("input", {
      type: "file",
      accept: "image/*",
      onChange: handleUpload
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: hintStyle
    }, uploading ? "Uploading to Cloudinary..." : "Choose an image file to upload"), previewUrl ? /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement("img", {
      src: previewUrl,
      alt: "Product preview",
      style: previewStyle
    }), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      onClick: handleRemove,
      style: {
        width: "fit-content",
        padding: "6px 10px",
        borderRadius: "8px",
        border: "1px solid #ef4444",
        color: "#ef4444",
        background: "#fff",
        cursor: "pointer"
      }
    }, "Remove image")) : null, error ? /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        ...hintStyle,
        color: "#dc2626"
      }
    }, error) : null, /*#__PURE__*/React__default.default.createElement("input", {
      type: "hidden",
      name: "imageUrl",
      value: previewUrl,
      readOnly: true
    }), /*#__PURE__*/React__default.default.createElement("input", {
      type: "hidden",
      name: "imagePublicId",
      value: publicId,
      readOnly: true
    }));
  };

  const CategoryShow = props => {
    const {
      record,
      resource
    } = props;
    const [category, setCategory] = React.useState(null);
    React.useEffect(() => {
      if (record && record.params) {
        setCategory(record.params);
      }
    }, [record]);
    if (!category) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        className: "category-show-loading"
      }, "Loading...");
    }
    const formatDate = date => {
      if (!date) return "—";
      try {
        return new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      } catch {
        return "—";
      }
    };
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-container"
    }, /*#__PURE__*/React__default.default.createElement("style", null, `
        .category-show-container {
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

        html[data-admin-theme='light'] .category-show-container {
          --change8-bg-1: #f0f6ff;
          --change8-gold: #c08b0f;
          --change8-text-main: #0f172a;
          --change8-text-muted: #475569;
          --change8-line: rgba(15, 23, 42, 0.08);
          --change8-card-bg: #ffffff;
          --change8-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
        }

        .category-show-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .category-show-header {
          margin-bottom: 32px;
        }

        .category-show-kicker {
          font-size: 11px;
          font-weight: 700;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.36em;
          margin-bottom: 12px;
        }

        .category-show-title {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 700;
          line-height: 1.1;
          margin: 0 0 8px;
        }

        .category-show-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .category-show-status.active {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.4);
        }

        .category-show-status.inactive {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }

        .category-show-card {
          border: 1px solid var(--line);
          border-radius: 24px;
          padding: 32px;
          background: var(--card-bg);
          box-shadow: var(--shadow);
          backdrop-filter: blur(4px);
          margin-bottom: 24px;
          animation: fade-up 560ms ease;
        }

        .category-show-section-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--gold);
          margin-bottom: 20px;
          margin-top: 0;
        }

        .category-show-section {
          margin-bottom: 28px;
        }

        .category-show-section:last-child {
          margin-bottom: 0;
        }

        .category-show-field {
          margin-bottom: 20px;
        }

        .category-show-field:last-child {
          margin-bottom: 0;
        }

        .category-show-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--text-muted);
          margin-bottom: 8px;
          display: block;
        }

        .category-show-value {
          font-size: 16px;
          color: var(--text-main);
          line-height: 1.6;
          word-break: break-word;
        }

        .category-show-value.gold {
          color: var(--gold);
          font-weight: 600;
        }

        .category-show-description {
          background: rgba(0, 0, 0, 0.2);
          border-left: 3px solid var(--gold);
          padding: 16px 20px;
          border-radius: 8px;
          line-height: 1.7;
          font-size: 15px;
        }

        html[data-admin-theme='light'] .category-show-description {
          background: rgba(15, 23, 42, 0.05);
        }

        .category-show-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-top: 16px;
        }

        .category-show-detail-item {
          padding: 16px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          border: 1px solid var(--line);
        }

        html[data-admin-theme='light'] .category-show-detail-item {
          background: rgba(15, 23, 42, 0.03);
        }

        .category-show-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(226, 191, 102, 0), rgba(226, 191, 102, 0.28), rgba(226, 191, 102, 0));
          margin: 24px 0;
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
          .category-show-container {
            padding: 20px 16px;
          }

          .category-show-card {
            padding: 24px 20px;
          }

          .category-show-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `), /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-inner"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-header"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-kicker"
    }, "Category Overview"), /*#__PURE__*/React__default.default.createElement("h1", {
      className: "category-show-title"
    }, category.name || "—"), /*#__PURE__*/React__default.default.createElement("div", {
      className: `category-show-status ${category.isActive ? "active" : "inactive"}`
    }, /*#__PURE__*/React__default.default.createElement("span", null, "\u25CF"), category.isActive ? "Active" : "Inactive")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-section"
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      className: "category-show-section-title"
    }, "Description"), category.description ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-description"
    }, category.description) : /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-value",
      style: {
        color: "var(--text-muted)"
      }
    }, "No description provided")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-divider"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-section"
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      className: "category-show-section-title"
    }, "Details"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-details-grid"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-detail-item"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "category-show-label"
    }, "Category ID"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-value gold",
      style: {
        fontFamily: "monospace",
        fontSize: "14px"
      }
    }, category.id || "—")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-detail-item"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "category-show-label"
    }, "Slug"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-value"
    }, category.slug || "—")))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-divider"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-section"
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      className: "category-show-section-title"
    }, "Timeline"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-details-grid"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-detail-item"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "category-show-label"
    }, "Created"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-value"
    }, formatDate(category.createdAt))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-detail-item"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "category-show-label"
    }, "Last Updated"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "category-show-value"
    }, formatDate(category.updatedAt))))))));
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.Dashboard = Dashboard;
  AdminJS.UserComponents.Register = Register;
  AdminJS.UserComponents.ProductCardsList = ProductCardsList;
  AdminJS.UserComponents.ProductShow = ProductShow;
  AdminJS.UserComponents.OrderCreate = OrderCreate;
  AdminJS.UserComponents.OrderShow = OrderShow;
  AdminJS.UserComponents.OrderItemShow = OrderItemShow;
  AdminJS.UserComponents.ProductImage = ProductImage;
  AdminJS.UserComponents.ProductImageUpload = ProductImageUpload;
  AdminJS.UserComponents.CategoryShow = CategoryShow;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9hZG1pbi9kYXNoYm9hcmQuanN4IiwiLi4vYWRtaW4vcmVnaXN0ZXIuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1jYXJkcy1saXN0LmpzeCIsIi4uL2FkbWluL3Byb2R1Y3Qtc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1jcmVhdGUuanN4IiwiLi4vYWRtaW4vb3JkZXItc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1pdGVtLXNob3cuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS5qc3giLCIuLi9hZG1pbi9wcm9kdWN0LWltYWdlLXVwbG9hZC5qc3giLCIuLi9hZG1pbi9jYXRlZ29yeS1zaG93LmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBmb3JtYXRDdXJyZW5jeSA9ICh2YWx1ZSkgPT4ge1xyXG4gIHJldHVybiBgUnMuJHtOdW1iZXIodmFsdWUgfHwgMCkudG9Mb2NhbGVTdHJpbmcoKX1gO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiBcIi1cIjtcclxuICB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gbmV3IERhdGUodmFsdWUpLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXR1cm4gXCItXCI7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgcHJvZHVjdEltYWdlID0gKHByb2R1Y3QpID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgcHJvZHVjdD8uaW1hZ2UgfHxcclxuICAgIHByb2R1Y3Q/LmltYWdlVXJsIHx8XHJcbiAgICBwcm9kdWN0Py50aHVtYm5haWwgfHxcclxuICAgIHByb2R1Y3Q/LmNvdmVyIHx8XHJcbiAgICBcIi9wdWJsaWMvaW1nMS5qcGdcIlxyXG4gICk7XHJcbn07XHJcblxyXG5jb25zdCBwcm9kdWN0TGFiZWwgPSAocHJvZHVjdCkgPT4ge1xyXG4gIGNvbnN0IG5hbWUgPSBTdHJpbmcocHJvZHVjdD8ubmFtZSB8fCBcInByb2R1Y3RcIik7XHJcbiAgcmV0dXJuIG5hbWVcclxuICAgIC5zcGxpdChcIiBcIilcclxuICAgIC5zbGljZSgwLCAyKVxyXG4gICAgLm1hcCgocGFydCkgPT4gcGFydFswXSlcclxuICAgIC5qb2luKFwiXCIpXHJcbiAgICAudG9VcHBlckNhc2UoKTtcclxufTtcclxuXHJcbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcclxuICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZSh7XHJcbiAgICB1c2VyczogMCxcclxuICAgIGNhdGVnb3JpZXM6IDAsXHJcbiAgICBwcm9kdWN0czogMCxcclxuICAgIG9yZGVyczogMCxcclxuICAgIHJldmVudWU6IDAsXHJcbiAgICBmZWF0dXJlZEdlbXM6IDAsXHJcbiAgICBjcml0aWNhbFN0b2NrOiAwLFxyXG4gICAgcmVjZW50UHJvZHVjdHM6IFtdLFxyXG4gICAgY2F0ZWdvcnlEaXN0cmlidXRpb246IFtdLFxyXG4gIH0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgbG9hZERhc2hib2FyZCA9IGFzeW5jICgpID0+IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hZG1pbi9hcGkvZGFzaGJvYXJkXCIpO1xyXG4gICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBzZXREYXRhKHBheWxvYWQgfHwge30pO1xyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkRGFzaGJvYXJkKCk7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCB0b3BDYXRlZ29yaWVzID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBkYXRhLmNhdGVnb3J5RGlzdHJpYnV0aW9uIHx8IFtdO1xyXG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZGlzdHJpYnV0aW9uLm1hcCgoaXRlbSkgPT4gaXRlbS5jb3VudCksIDEpO1xyXG5cclxuICAgIHJldHVybiBkaXN0cmlidXRpb24ubWFwKChpdGVtKSA9PiAoe1xyXG4gICAgICAuLi5pdGVtLFxyXG4gICAgICB3aWR0aDogYCR7TWF0aC5tYXgoOCwgTWF0aC5yb3VuZCgoaXRlbS5jb3VudCAvIG1heCkgKiAxMDApKX0lYCxcclxuICAgIH0pKTtcclxuICB9LCBbZGF0YS5jYXRlZ29yeURpc3RyaWJ1dGlvbl0pO1xyXG5cclxuICBjb25zdCBjb21wbGV0aW9uUmF0ZSA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3QgdG90YWwgPSBOdW1iZXIoZGF0YS5wcm9kdWN0cyB8fCAwKTtcclxuICAgIGlmICh0b3RhbCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBoZWFsdGh5ID0gTWF0aC5tYXgodG90YWwgLSBOdW1iZXIoZGF0YS5jcml0aWNhbFN0b2NrIHx8IDApLCAwKTtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKChoZWFsdGh5IC8gdG90YWwpICogMTAwKTtcclxuICB9LCBbZGF0YS5wcm9kdWN0cywgZGF0YS5jcml0aWNhbFN0b2NrXSk7XHJcblxyXG4gIGNvbnN0IHJldmVudWVSYXRlID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBjb25zdCByZXZlbnVlID0gTnVtYmVyKGRhdGEucmV2ZW51ZSB8fCAwKTtcclxuICAgIGNvbnN0IHBzZXVkb1RhcmdldCA9IE1hdGgubWF4KHJldmVudWUsIDEwMDApICogMS4zNTtcclxuICAgIHJldHVybiBNYXRoLm1heChcclxuICAgICAgNixcclxuICAgICAgTWF0aC5taW4oMTAwLCBNYXRoLnJvdW5kKChyZXZlbnVlIC8gcHNldWRvVGFyZ2V0KSAqIDEwMCkpLFxyXG4gICAgKTtcclxuICB9LCBbZGF0YS5yZXZlbnVlXSk7XHJcblxyXG4gIGNvbnN0IGNoYXJ0U2VnbWVudHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gKGRhdGEuY2F0ZWdvcnlEaXN0cmlidXRpb24gfHwgW10pLnNsaWNlKDAsIDUpO1xyXG4gICAgY29uc3QgdG90YWwgPSBpdGVtcy5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4gc3VtICsgTnVtYmVyKGl0ZW0uY291bnQgfHwgMCksIDApO1xyXG5cclxuICAgIGlmICh0b3RhbCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gXCIjMmEzZTY2IDAgMTAwJVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBhbGV0dGUgPSBbXCIjZjRkODg5XCIsIFwiIzg2YjhmZlwiLCBcIiM3YTZmZGVcIiwgXCIjNTRkMmM3XCIsIFwiI2Y3OTk4YVwiXTtcclxuICAgIGxldCBzdGFydCA9IDA7XHJcblxyXG4gICAgcmV0dXJuIGl0ZW1zXHJcbiAgICAgIC5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGVyY2VudCA9IChOdW1iZXIoaXRlbS5jb3VudCB8fCAwKSAvIHRvdGFsKSAqIDEwMDtcclxuICAgICAgICBjb25zdCBlbmQgPSBzdGFydCArIHBlcmNlbnQ7XHJcbiAgICAgICAgY29uc3Qgc2VnbWVudCA9IGAke3BhbGV0dGVbaW5kZXggJSBwYWxldHRlLmxlbmd0aF19ICR7c3RhcnR9JSAke2VuZH0lYDtcclxuICAgICAgICBzdGFydCA9IGVuZDtcclxuICAgICAgICByZXR1cm4gc2VnbWVudDtcclxuICAgICAgfSlcclxuICAgICAgLmpvaW4oXCIsIFwiKTtcclxuICB9LCBbZGF0YS5jYXRlZ29yeURpc3RyaWJ1dGlvbl0pO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWRhc2hib2FyZFwiPlxyXG4gICAgICA8c3R5bGU+e2BcclxuICAgICAgICAuY2hhbmdlOC1kYXNoYm9hcmQge1xyXG4gICAgICAgICAgLS1iZy0xOiB2YXIoLS1jaGFuZ2U4LWJnLTEsICMwNTA5MTQpO1xyXG4gICAgICAgICAgLS1iZy0yOiB2YXIoLS1jaGFuZ2U4LWJnLTIsICMwYjFhMzgpO1xyXG4gICAgICAgICAgLS1ncmFkLWVuZDogdmFyKC0tY2hhbmdlOC1ncmFkLWVuZCwgIzA0MDcwZik7XHJcbiAgICAgICAgICAtLWdvbGQ6IHZhcigtLWNoYW5nZTgtZ29sZCwgI2UyYmY2Nik7XHJcbiAgICAgICAgICAtLXRleHQtbWFpbjogdmFyKC0tY2hhbmdlOC10ZXh0LW1haW4sICNmOGZhZmMpO1xyXG4gICAgICAgICAgLS10ZXh0LW11dGVkOiB2YXIoLS1jaGFuZ2U4LXRleHQtbXV0ZWQsICM5YWE4YzEpO1xyXG4gICAgICAgICAgLS1saW5lOiB2YXIoLS1jaGFuZ2U4LWxpbmUsIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4yKSk7XHJcbiAgICAgICAgICAtLWxpbmUtc29mdDogdmFyKC0tY2hhbmdlOC1saW5lLXNvZnQsIHJnYmEoMTQzLCAxNzUsIDIzMCwgMC4yKSk7XHJcbiAgICAgICAgICAtLWJsdWUtZ2xvdzogdmFyKC0tY2hhbmdlOC1ibHVlLWdsb3csIHJnYmEoMTA2LCAxNTMsIDI1NSwgMC4yMikpO1xyXG4gICAgICAgICAgLS1yb3NlLWdsb3c6IHZhcigtLWNoYW5nZTgtcm9zZS1nbG93LCByZ2JhKDIxNCwgMTM2LCAyNTUsIDAuMTYpKTtcclxuICAgICAgICAgIC0tY2FyZC1iZzogdmFyKC0tY2hhbmdlOC1jYXJkLWJnLCBsaW5lYXItZ3JhZGllbnQoMTY1ZGVnLCByZ2JhKDIwLCAzNCwgNjYsIDAuOTIpIDAlLCByZ2JhKDEzLCAyNCwgNDksIDAuOSkgNTYlLCByZ2JhKDI4LCAyMCwgNTEsIDAuODgpIDEwMCUpKTtcclxuICAgICAgICAgIC0tc2hhZG93OiB2YXIoLS1jaGFuZ2U4LXNoYWRvdywgMCA4cHggMjZweCByZ2JhKDAsIDAsIDAsIDAuMykpO1xyXG4gICAgICAgICAgLS1yYWRpYWwtMTogdmFyKC0tY2hhbmdlOC1yYWRpYWwtMSwgcmdiYSgzNCwgOTMsIDE4MCwgMC4zNSkpO1xyXG4gICAgICAgICAgLS1yYWRpYWwtMjogdmFyKC0tY2hhbmdlOC1yYWRpYWwtMiwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjE2KSk7XHJcblxyXG4gICAgICAgICAgbWluLWhlaWdodDogMTAwdmg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAzNnB4O1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbWFpbik7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOlxyXG4gICAgICAgICAgICByYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDglIDAlLCB2YXIoLS1yYWRpYWwtMSkgMCUsIHJnYmEoMzQsIDkzLCAxODAsIDApIDM4JSksXHJcbiAgICAgICAgICAgIHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgODUlIDEyJSwgdmFyKC0tcmFkaWFsLTIpIDAlLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDApIDQyJSksXHJcbiAgICAgICAgICAgIGxpbmVhci1ncmFkaWVudCgxMTJkZWcsIHZhcigtLWJnLTEpIDAlLCB2YXIoLS1iZy0yKSA0OCUsIHZhcigtLWdyYWQtZW5kKSAxMDAlKTtcclxuICAgICAgICAgIGZvbnQtZmFtaWx5OiBcIlBvcHBpbnNcIiwgXCJTZWdvZSBVSVwiLCBzYW5zLXNlcmlmO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jaGFuZ2U4LWRhc2hib2FyZCB7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtYmctMTogI2YwZjZmZjtcclxuICAgICAgICAgIC0tY2hhbmdlOC1iZy0yOiAjZmZmZmZmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWdyYWQtZW5kOiAjZjhmYmZmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWdvbGQ6ICNjMDhiMGY7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtdGV4dC1tYWluOiAjMGYxNzJhO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXRleHQtbXV0ZWQ6ICM0NzU1Njk7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtbGluZTogcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgICAgICAgIC0tY2hhbmdlOC1saW5lLXNvZnQ6IHJnYmEoMTUsIDIzLCA0MiwgMC4wOCk7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtY2FyZC1iZzogI2ZmZmZmZjtcclxuICAgICAgICAgIC0tY2hhbmdlOC1zaGFkb3c6IDAgNHB4IDIwcHggcmdiYSgxNSwgMjMsIDQyLCAwLjA2KTtcclxuICAgICAgICAgIC0tY2hhbmdlOC1yYWRpYWwtMTogcmdiYSgzNCwgOTMsIDE4MCwgMC4wOCk7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtcmFkaWFsLTI6IHJnYmEoMTkyLCAxMzksIDE1LCAwLjA1KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWRhc2hib2FyZC1pbm5lciB7XHJcbiAgICAgICAgICB3aWR0aDogbWluKDEwMCUsIDE0NDBweCk7XHJcbiAgICAgICAgICBtYXJnaW46IDAgYXV0bztcclxuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWRhc2hib2FyZC1pbm5lcjo6YmVmb3JlIHtcclxuICAgICAgICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICBsZWZ0OiAyMiU7XHJcbiAgICAgICAgICByaWdodDogNCU7XHJcbiAgICAgICAgICB0b3A6IDI3MHB4O1xyXG4gICAgICAgICAgaGVpZ2h0OiA4MHB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IGNlbnRlciwgcmdiYSgxMDcsIDE2NiwgMjU1LCAwLjMpLCByZ2JhKDEwNywgMTY2LCAyNTUsIDApKTtcclxuICAgICAgICAgIGZpbHRlcjogYmx1cigxOHB4KTtcclxuICAgICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gICAgICAgICAgei1pbmRleDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWRhc2hib2FyZC1pbm5lciA+ICoge1xyXG4gICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgICAgei1pbmRleDogMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWhlYWRlciB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxOHB4O1xyXG4gICAgICAgICAgYW5pbWF0aW9uOiBmYWRlLXVwIDUyMG1zIGVhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1raWNrZXIge1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMzZlbTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtdGl0bGUge1xyXG4gICAgICAgICAgbWFyZ2luOiA4cHggMCA2cHg7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMS4wNjtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA4MDA7XHJcbiAgICAgICAgICBmb250LXNpemU6IGNsYW1wKDQ0cHgsIDUuMnZ3LCA3MnB4KTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAtMC4wMmVtO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDk2ZGVnLCAjOWViNWZmIDQlLCAjZjVjZmM1IDU0JSwgI2Y5ZWRiMiA5NiUpO1xyXG4gICAgICAgICAgLXdlYmtpdC1iYWNrZ3JvdW5kLWNsaXA6IHRleHQ7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNsaXA6IHRleHQ7XHJcbiAgICAgICAgICBjb2xvcjogdHJhbnNwYXJlbnQ7XHJcbiAgICAgICAgICB0ZXh0LXNoYWRvdzogMCAwIDMycHggcmdiYSgxMzMsIDE2NiwgMjU1LCAwLjI1KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXN1YnRpdGxlIHtcclxuICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgICAgICAgIG1heC13aWR0aDogNzIwcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1tZXRyaWMtaGVybyB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBtaW5tYXgoMjYwcHgsIDFmcikgMmZyIG1pbm1heCgyMzBweCwgMC45ZnIpO1xyXG4gICAgICAgICAgZ2FwOiAxOHB4O1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMjBweDtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDQ0cHg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogc3RyZXRjaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQge1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAyNnB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMjRweCAyNHB4IDIycHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOlxyXG4gICAgICAgICAgICBsaW5lYXItZ3JhZGllbnQoMTU4ZGVnLCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDcpLCByZ2JhKDI1NSwgMjU1LCAyNTUsIDApIDM4JSksXHJcbiAgICAgICAgICAgIHZhcigtLWNhcmQtYmcpO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogdmFyKC0tc2hhZG93KTtcclxuICAgICAgICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig3cHgpO1xyXG4gICAgICAgICAgYW5pbWF0aW9uOiBmYWRlLXVwIDU2MG1zIGVhc2U7XHJcbiAgICAgICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMTgwbXMgZWFzZSwgYm9yZGVyLWNvbG9yIDE4MG1zIGVhc2UsIGJveC1zaGFkb3cgMTgwbXMgZWFzZTtcclxuICAgICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQtLWhlcm8ge1xyXG4gICAgICAgICAgbWluLWhlaWdodDogMTk4cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxM3B4IDE1cHggMTJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQ6OmFmdGVyIHtcclxuICAgICAgICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICBsZWZ0OiAxOHB4O1xyXG4gICAgICAgICAgcmlnaHQ6IDE4cHg7XHJcbiAgICAgICAgICB0b3A6IDA7XHJcbiAgICAgICAgICBoZWlnaHQ6IDFweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyNTUsIDI1NSwgMjU1LCAwKSwgcmdiYSgxNjcsIDE4OSwgMjU1LCAwLjUpLCByZ2JhKDI1NSwgMjU1LCAyNTUsIDApKTtcclxuICAgICAgICAgIG9wYWNpdHk6IDAuODtcclxuICAgICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtY2FyZDpob3ZlciB7XHJcbiAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTRweCk7XHJcbiAgICAgICAgICBib3JkZXItY29sb3I6IHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4zNCk7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDE2cHggMzRweCByZ2JhKDAsIDAsIDAsIDAuMzQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtY2FyZC1sYWJlbCB7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMThlbTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQtdmFsdWUge1xyXG4gICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgyNHB4LCAyLjh2dywgMzhweCk7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDAuOTU7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogLTAuMDNlbTtcclxuICAgICAgICAgIG92ZXJmbG93LXdyYXA6IGFueXdoZXJlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtY2FyZC12YWx1ZS0tY3JpdGljYWwge1xyXG4gICAgICAgICAgY29sb3I6ICNmZjhkOWU7XHJcbiAgICAgICAgICB0ZXh0LXNoYWRvdzogMCAwIDIycHggcmdiYSgyNTUsIDExNiwgMTM4LCAwLjI4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQtZ2xvdzo6YmVmb3JlIHtcclxuICAgICAgICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICB3aWR0aDogMjIwcHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDIyMHB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmFkaWFsLWdyYWRpZW50KGNpcmNsZSwgdmFyKC0tYmx1ZS1nbG93KSwgcmdiYSgyNDQsIDIxNiwgMTM3LCAwKSk7XHJcbiAgICAgICAgICByaWdodDogLTc2cHg7XHJcbiAgICAgICAgICB0b3A6IC04NnB4O1xyXG4gICAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1jYXJkLWdsb3c6OmFmdGVyIHtcclxuICAgICAgICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICB3aWR0aDogMTkwcHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDE5MHB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmFkaWFsLWdyYWRpZW50KGNpcmNsZSwgdmFyKC0tcm9zZS1nbG93KSwgcmdiYSgyMTQsIDEzNiwgMjU1LCAwKSk7XHJcbiAgICAgICAgICBsZWZ0OiAtNzRweDtcclxuICAgICAgICAgIGJvdHRvbTogLTk4cHg7XHJcbiAgICAgICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQtaGludCB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiA0cHg7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMS4zNTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQtLXN0YWNrZWQge1xyXG4gICAgICAgICAgZ2FwOiAycHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1jYXJkLS1zdGFja2VkIC5jaGFuZ2U4LWNhcmQtaGludCB7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiA2cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zcGxpdC1jYXJkIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxcHggMWZyO1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDk0cHg7XHJcbiAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgICBjb2x1bW4tZ2FwOiAxNHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc3BsaXQtY2FyZDo6YmVmb3JlIHtcclxuICAgICAgICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICBsZWZ0OiAxNCU7XHJcbiAgICAgICAgICByaWdodDogMTQlO1xyXG4gICAgICAgICAgdG9wOiA0NCU7XHJcbiAgICAgICAgICBoZWlnaHQ6IDM4cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOlxyXG4gICAgICAgICAgICByYWRpYWwtZ3JhZGllbnQoZWxsaXBzZSBhdCAyOCUgNTAlLCByZ2JhKDExNSwgMTczLCAyNTUsIDAuNCksIHJnYmEoMTE1LCAxNzMsIDI1NSwgMCkpLFxyXG4gICAgICAgICAgICByYWRpYWwtZ3JhZGllbnQoZWxsaXBzZSBhdCA3MCUgNTAlLCByZ2JhKDIxMCwgMTMwLCAyNTUsIDAuMjgpLCByZ2JhKDIxMCwgMTMwLCAyNTUsIDApKTtcclxuICAgICAgICAgIGZpbHRlcjogYmx1cig4cHgpO1xyXG4gICAgICAgICAgb3BhY2l0eTogMC44NjtcclxuICAgICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc3BsaXQtdG9wIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgZ2FwOiA2cHg7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAycHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zcGxpdC10b3AgLmNoYW5nZTgtY2FyZC1sYWJlbCB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xyXG4gICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjE2ZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zcGxpdC1pY29ucyB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBnYXA6IDhweDtcclxuICAgICAgICAgIGNvbG9yOiAjOWNiMWQ5O1xyXG4gICAgICAgICAgb3BhY2l0eTogMC45NTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNwbGl0LWljb25zIHN2ZyB7XHJcbiAgICAgICAgICB3aWR0aDogMTVweDtcclxuICAgICAgICAgIGhlaWdodDogMTVweDtcclxuICAgICAgICAgIHN0cm9rZTogY3VycmVudENvbG9yO1xyXG4gICAgICAgICAgZmlsbDogbm9uZTtcclxuICAgICAgICAgIHN0cm9rZS13aWR0aDogMS45O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc3Bhcmsge1xyXG4gICAgICAgICAgd2lkdGg6IDc0cHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDIwcHg7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc3BhcmsgcGF0aCB7XHJcbiAgICAgICAgICBmaWxsOiBub25lO1xyXG4gICAgICAgICAgc3Ryb2tlOiAjZTVjYjdhO1xyXG4gICAgICAgICAgc3Ryb2tlLXdpZHRoOiAyLjQ7XHJcbiAgICAgICAgICBzdHJva2UtbGluZWNhcDogcm91bmQ7XHJcbiAgICAgICAgICBzdHJva2UtbGluZWpvaW46IHJvdW5kO1xyXG4gICAgICAgICAgZmlsdGVyOiBkcm9wLXNoYWRvdygwIDFweCA0cHggcmdiYSgyMjksIDIwMywgMTIyLCAwLjMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LW1pZC1jaGlwIHtcclxuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgIGxlZnQ6IDUwJTtcclxuICAgICAgICAgIHRvcDogNTAlO1xyXG4gICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XHJcbiAgICAgICAgICB3aWR0aDogMjdweDtcclxuICAgICAgICAgIGhlaWdodDogMjdweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgxNjEsIDE4MiwgMjMwLCAwLjM1KTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxNTBkZWcsIHJnYmEoMjUsIDQwLCA3OCwgMC45NSksIHJnYmEoMzgsIDMyLCA3NCwgMC45MykpO1xyXG4gICAgICAgICAgY29sb3I6ICNkYmU3ZmY7XHJcbiAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDZweCAxOHB4IHJnYmEoNSwgMTAsIDI2LCAwLjQpO1xyXG4gICAgICAgICAgei1pbmRleDogMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNwbGl0LWNvbCB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgICAgICAgIGdhcDogNHB4O1xyXG4gICAgICAgICAgbWluLWhlaWdodDogMTAwJTtcclxuICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc3BsaXQtY29sLS1sZWZ0IHtcclxuICAgICAgICAgIGdyaWQtY29sdW1uOiAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc3BsaXQtY29sLS1yaWdodCB7XHJcbiAgICAgICAgICBncmlkLWNvbHVtbjogMztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LW1ldHJpYy1saW5lIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICAgICAgZ2FwOiA4cHg7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAzcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1tZXRyaWMtbGluZSAuY2hhbmdlOC1jYXJkLXZhbHVlIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogNDBweDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAwLjg2O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc3BsaXQtZGl2aWRlciB7XHJcbiAgICAgICAgICB3aWR0aDogMXB4O1xyXG4gICAgICAgICAgYWxpZ24tc2VsZjogc3RyZXRjaDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxODBkZWcsIHJnYmEoMTUzLCAxNzcsIDIyNywgMCksIHJnYmEoMTUzLCAxNzcsIDIyNywgMC40NSksIHJnYmEoMTUzLCAxNzcsIDIyNywgMCkpO1xyXG4gICAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgICAgZ3JpZC1jb2x1bW46IDI7XHJcbiAgICAgICAgICBncmlkLXJvdzogMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXRyZW5kIHtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDA7XHJcbiAgICAgICAgICB3aWR0aDogNzZweDtcclxuICAgICAgICAgIGhlaWdodDogMjJweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZS1zb2Z0KTtcclxuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgICBjb2xvcjogI2Y0ZDg4OTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjA2ZW07XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDgsIDI0LCA1MiwgMC40NSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1yZXZlbnVlLXJpbmcge1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMnB4O1xyXG4gICAgICAgICAgd2lkdGg6IDEwOHB4O1xyXG4gICAgICAgICAgaGVpZ2h0OiAxMDhweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBwbGFjZS1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogY29uaWMtZ3JhZGllbnQoI2Y1ZDU2ZSAwIHZhcigtLXJldi1yYXRlKSwgcmdiYSgyNDUsIDIxMywgMTEwLCAwLjEpIHZhcigtLXJldi1yYXRlKSAxMDAlKTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMCAyNHB4IHJnYmEoMCwgMCwgMCwgMC4yOCk7XHJcbiAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1yZXZlbnVlLXJpbmc6OmFmdGVyIHtcclxuICAgICAgICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICBpbnNldDogMTRweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxNDVkZWcsIHJnYmEoOSwgMjEsIDQ2LCAwLjk2KSwgcmdiYSgxOCwgMzUsIDY4LCAwLjkpKTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjQ0LCAyMTYsIDEzNywgMC4xOCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNoYW5nZTgtcmV2ZW51ZS1yaW5nOjphZnRlciB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTQ1ZGVnLCByZ2JhKDI0NiwgMjUxLCAyNTUsIDAuOTQpLCByZ2JhKDIyOSwgMjM4LCAyNDgsIDAuODYpKTtcclxuICAgICAgICAgIGJvcmRlci1jb2xvcjogcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXJldmVudWUtcmluZyBzcGFuIHtcclxuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgIHotaW5kZXg6IDE7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgdGV4dC1zaGFkb3c6IDAgMnB4IDEwcHggcmdiYSgyNDQsIDIxNiwgMTM3LCAwLjM0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWxheW91dCB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xyXG4gICAgICAgICAgZ2FwOiAxOHB4O1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMTRweDtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDI4cHg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogc3RhcnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1mdWxsLXdpZHRoLXNlY3Rpb24ge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjRweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQtLW5vcm1hbCB7XHJcbiAgICAgICAgICBwYWRkaW5nLWJvdHRvbTogMThweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNlY3Rpb24tZGl2aWRlciB7XHJcbiAgICAgICAgICBoZWlnaHQ6IDFweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyMjYsIDE5MSwgMTAyLCAwKSwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjI4KSwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwKSk7XHJcbiAgICAgICAgICBtYXJnaW46IDE0cHggMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWRvbnV0LXdyYXAge1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMTBweDtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IG1pbm1heCgxNzBweCwgMjMwcHgpIDFmcjtcclxuICAgICAgICAgIGdhcDogMThweDtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1kb251dCB7XHJcbiAgICAgICAgICB3aWR0aDogbWluKDIyMHB4LCAxMDAlKTtcclxuICAgICAgICAgIGFzcGVjdC1yYXRpbzogMTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGNvbmljLWdyYWRpZW50KHZhcigtLWRvbnV0LXNlZ21lbnRzKSk7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saW5lLXNvZnQpO1xyXG4gICAgICAgICAgbWFyZ2luLWlubGluZTogYXV0bztcclxuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWRvbnV0OjphZnRlciB7XHJcbiAgICAgICAgICBjb250ZW50OiBcIlwiO1xyXG4gICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgaW5zZXQ6IDI4JTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoNywgMTgsIDM5LCAwLjk1KTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjQ0LCAyMTYsIDEzNywgMC4yNCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNoYW5nZTgtZG9udXQ6OmFmdGVyIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICNmOGZiZmY7XHJcbiAgICAgICAgICBib3JkZXItY29sb3I6IHJnYmEoMTUsIDIzLCA0MiwgMC4wOSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1kb251dC1sZWdlbmQge1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIGdhcDogMTBweDtcclxuICAgICAgICAgIG1heC1oZWlnaHQ6IDIxMHB4O1xyXG4gICAgICAgICAgb3ZlcmZsb3c6IGF1dG87XHJcbiAgICAgICAgICBwYWRkaW5nLXJpZ2h0OiA0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1kb3Qge1xyXG4gICAgICAgICAgd2lkdGg6IDEwcHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDEwcHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgICAgICAgICBmbGV4OiAwIDAgMTBweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWxlZ2VuZC1yb3cge1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMTBweCAxZnIgYXV0bztcclxuICAgICAgICAgIGdhcDogMTBweDtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9ncmVzcy13cmFwIHtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZ3Jlc3MtaGVhZCB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDZweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2dyZXNzLXRyYWNrIHtcclxuICAgICAgICAgIGhlaWdodDogMTJweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEyKTtcclxuICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNoYW5nZTgtcHJvZ3Jlc3MtdHJhY2sge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNSwgMjMsIDQyLCAwLjEyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2dyZXNzLWZpbGwge1xyXG4gICAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsICNmNWRmOTAgMCUsICNlMmJmNjYgMTAwJSk7XHJcbiAgICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCAzMjBtcyBlYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcmVjZW50LWxpc3Qge1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogOHB4O1xyXG4gICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgIG92ZXJmbG93LXg6IGF1dG87XHJcbiAgICAgICAgICBwYWRkaW5nLWJvdHRvbTogNnB4O1xyXG4gICAgICAgICAgZ2FwOiAxMnB4O1xyXG4gICAgICAgICAgc2Nyb2xsYmFyLXdpZHRoOiB0aGluO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcmVjZW50LWl0ZW0ge1xyXG4gICAgICAgICAgZmxleDogMCAwIDE1NHB4O1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZS1zb2Z0KTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiA5cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTY1ZGVnLCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDcpLCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpKTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDAgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT0nbGlnaHQnXSAuY2hhbmdlOC1yZWNlbnQtaXRlbSB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTY1ZGVnLCByZ2JhKDE1LCAyMywgNDIsIDAuMDIpLCByZ2JhKDE1LCAyMywgNDIsIDAuMDEpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXRodW1iIHtcclxuICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgYXNwZWN0LXJhdGlvOiAxLjQ1O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcclxuICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTQwZGVnLCByZ2JhKDc5LCAxMDYsIDE2NSwgMC42KSwgcmdiYSg1NywgNDYsIDExMCwgMC41NikpO1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiA5cHg7XHJcbiAgICAgICAgICBjb2xvcjogI2ZmZmZmZjtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMDRlbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXRodW1iIGltZyB7XHJcbiAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICAgIG9iamVjdC1maXQ6IGNvdmVyO1xyXG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1uYW1lIHtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG4gICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtZGF0ZSB7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAycHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcmljZSB7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDE7XHJcbiAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogNHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtb3JkZXItb3ZlcnZpZXcge1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDMsIG1pbm1heCgxNzBweCwgMWZyKSk7XHJcbiAgICAgICAgICBnYXA6IDE0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1vcmRlci1ib3gge1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZS1zb2Z0KTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxNnB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDE2MGRlZywgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSwgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAxKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1vcmRlci1ib3ggLmNoYW5nZTgtY2FyZC12YWx1ZSB7XHJcbiAgICAgICAgICBmb250LXNpemU6IGNsYW1wKDI4cHgsIDMuOHZ3LCA0MnB4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBrZXlmcmFtZXMgZmFkZS11cCB7XHJcbiAgICAgICAgICBmcm9tIHtcclxuICAgICAgICAgICAgb3BhY2l0eTogMDtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDhweCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0byB7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAxMTgwcHgpIHtcclxuICAgICAgICAgIC5jaGFuZ2U4LW1ldHJpYy1oZXJvIHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbGF5b3V0IHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcmVjZW50LWxpc3Qge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCBtaW5tYXgoMTMwcHgsIDFmcikpO1xyXG4gICAgICAgICAgICBvdmVyZmxvdzogdmlzaWJsZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1yZWNlbnQtaXRlbSB7XHJcbiAgICAgICAgICAgIGZsZXg6IGluaXRpYWw7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtb3JkZXItb3ZlcnZpZXcge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCBtaW5tYXgoMTUwcHgsIDFmcikpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDcyMHB4KSB7XHJcbiAgICAgICAgICAuY2hhbmdlOC1kYXNoYm9hcmQge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAyMHB4IDE2cHggMjhweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1zdWJ0aXRsZSB7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC10aXRsZSB7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogY2xhbXAoMzRweCwgMTN2dywgNTJweCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtc3BsaXQtY2FyZCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFweCAxZnI7XHJcbiAgICAgICAgICAgIGNvbHVtbi1nYXA6IDEwcHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtc3BsaXQtdG9wIC5jaGFuZ2U4LWNhcmQtbGFiZWwge1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEwcHg7XHJcbiAgICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjEyZW07XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbWV0cmljLWxpbmUgLmNoYW5nZTgtY2FyZC12YWx1ZSB7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogNDJweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1zcGFyayB7XHJcbiAgICAgICAgICAgIHdpZHRoOiA2NnB4O1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDIwcHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbWlkLWNoaXAge1xyXG4gICAgICAgICAgICB3aWR0aDogMjZweDtcclxuICAgICAgICAgICAgaGVpZ2h0OiAyNnB4O1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtc3BsaXQtZGl2aWRlciB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWRvbnV0LXdyYXAge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1yZWNlbnQtbGlzdCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LW9yZGVyLW92ZXJ2aWV3IHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbGF5b3V0IHtcclxuICAgICAgICAgICAgZ2FwOiAxNnB4O1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxOHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWNhcmQge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAyMHB4IDE4cHggMThweDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIGB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1kYXNoYm9hcmQtaW5uZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtaGVhZGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgta2lja2VyXCI+U2VjdGlvbiBWaWV3PC9kaXY+XHJcbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwiY2hhbmdlOC10aXRsZVwiPkRhc2hib2FyZDwvaDE+XHJcbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjaGFuZ2U4LXN1YnRpdGxlXCI+XHJcbiAgICAgICAgICAgIFRyYWNrIHlvdXIgY29tbWVyY2UgaGVhbHRoIGF0IGEgZ2xhbmNlIHdpdGggbGl2ZSBpbnZlbnRvcnkgYW5kIG9yZGVyXHJcbiAgICAgICAgICAgIHNpZ25hbHMuXHJcbiAgICAgICAgICA8L3A+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1tZXRyaWMtaGVyb1wiPlxyXG4gICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQgY2hhbmdlOC1jYXJkLS1oZXJvIGNoYW5nZTgtY2FyZC0tc3RhY2tlZCBjaGFuZ2U4LWNhcmQtZ2xvd1wiXHJcbiAgICAgICAgICAgIHN0eWxlPXt7IFtcIi0tcmV2LXJhdGVcIl06IGAke3JldmVudWVSYXRlfSVgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+UmV2ZW51ZSBTdHJlYW08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXJldmVudWUtcmluZ1wiPlxyXG4gICAgICAgICAgICAgIDxzcGFuPntmb3JtYXRDdXJyZW5jeShkYXRhLnJldmVudWUpfTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5BY3Jvc3MgYWxsIG9yZGVyczwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQgY2hhbmdlOC1jYXJkLS1oZXJvIGNoYW5nZTgtY2FyZC1nbG93XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1zcGxpdC1jYXJkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXNwbGl0LWNvbCBjaGFuZ2U4LXNwbGl0LWNvbC0tbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXNwbGl0LXRvcFwiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPkludmVudG9yeSAmIEZlYXR1cmVkPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1zcGxpdC1pY29uc1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk03IDZ2MTJNMTcgNnYxMk00IDEwaDE2TTQgMTRoMTZcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk01IDEyaDE0TTEyIDV2MTRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW1ldHJpYy1saW5lXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+e2RhdGEucHJvZHVjdHMgfHwgMH08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPHN2Z1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtc3BhcmtcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAwIDMwXCJcclxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yIDIwIEwxOCAyMCBMMjggMTMgTDQwIDE2IEw1MiA4IEw2NCAxOSBMNzYgMTUgTDg4IDEyIEw5OCA2XCIgLz5cclxuICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5cclxuICAgICAgICAgICAgICAgICAgVG90YWwgYWN0aXZlIGNhdGFsb2cgaXRlbXNcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtc3BsaXQtZGl2aWRlclwiIC8+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW1pZC1jaGlwXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHJcbiAgICAgICAgICAgICAgICDihpRcclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXNwbGl0LWNvbCBjaGFuZ2U4LXNwbGl0LWNvbC0tcmlnaHRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1zcGxpdC10b3BcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5GZWF0dXJlZCBHZW1zPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1zcGxpdC1pY29uc1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk00IDE2bDYtNiA0IDQgNi02XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTMgNWg2djZNMTkgNWwtOCA4XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1tZXRyaWMtbGluZVwiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC12YWx1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtkYXRhLmZlYXR1cmVkR2VtcyB8fCAwfVxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPHN2Z1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtc3BhcmtcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAwIDMwXCJcclxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yIDIxIEwyMCAyMSBMMzIgMTQgTDQ4IDE3IEw2MCAxMSBMNzIgMTggTDg0IDEzIEw5NiA3XCIgLz5cclxuICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5cclxuICAgICAgICAgICAgICAgICAgQ3VycmVudGx5IHZpc2libGUgcHJvZHVjdHNcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkIGNoYW5nZTgtY2FyZC0taGVybyBjaGFuZ2U4LWNhcmQtLXN0YWNrZWQgY2hhbmdlOC1jYXJkLWdsb3dcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5Dcml0aWNhbCBTdG9jazwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC12YWx1ZSBjaGFuZ2U4LWNhcmQtdmFsdWUtLWNyaXRpY2FsXCI+XHJcbiAgICAgICAgICAgICAge2RhdGEuY3JpdGljYWxTdG9jayB8fCAwfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPkl0ZW1zIG5lZWRpbmcgdXJnZW50IHJlZmlsbDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1sYXlvdXRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkIGNoYW5nZTgtY2FyZC0tbm9ybWFsXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+Q2F0ZWdvcnkgRGlzdHJpYnV0aW9uPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5JbnZlbnRvcnkgc3BsaXQgYnkgc2VnbWVudDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXNlY3Rpb24tZGl2aWRlclwiIC8+XHJcblxyXG4gICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1kb251dC13cmFwXCJcclxuICAgICAgICAgICAgICBzdHlsZT17eyBbXCItLWRvbnV0LXNlZ21lbnRzXCJdOiBjaGFydFNlZ21lbnRzIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtZG9udXRcIiAvPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1kb251dC1sZWdlbmRcIj5cclxuICAgICAgICAgICAgICAgIHsodG9wQ2F0ZWdvcmllcyB8fCBbXSkubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+Tm8gY2F0ZWdvcnkgZGF0YSB5ZXQuPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAodG9wQ2F0ZWdvcmllcyB8fCBbXSkubWFwKChjYXRlZ29yeSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2xvcnMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICBcIiNmNGQ4ODlcIixcclxuICAgICAgICAgICAgICAgICAgICAgIFwiIzg2YjhmZlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgXCIjN2E2ZmRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBcIiM1NGQyYzdcIixcclxuICAgICAgICAgICAgICAgICAgICAgIFwiI2Y3OTk4YVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtjYXRlZ29yeS5uYW1lfSBjbGFzc05hbWU9XCJjaGFuZ2U4LWxlZ2VuZC1yb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LWRvdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZDogY29sb3JzW2luZGV4ICUgY29sb3JzLmxlbmd0aF0gfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2NhdGVnb3J5Lm5hbWV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPntjYXRlZ29yeS5jb3VudH08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9ncmVzcy13cmFwXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWhlYWRcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuPkhlYWx0aHkgc3RvY2sgbGV2ZWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3Ryb25nPntjb21wbGV0aW9uUmF0ZX0lPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLXRyYWNrXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtZmlsbFwiXHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBgJHtjb21wbGV0aW9uUmF0ZX0lYCB9fVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZCBjaGFuZ2U4LWNhcmQtLW5vcm1hbFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPlJlY2VudCBBZGRpdGlvbnM8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPlxyXG4gICAgICAgICAgICAgIExhdGVzdCBwcm9kdWN0cyBlbnRlcmluZyB0aGUgY2F0YWxvZ1xyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1zZWN0aW9uLWRpdmlkZXJcIiAvPlxyXG5cclxuICAgICAgICAgICAgeyhkYXRhLnJlY2VudFByb2R1Y3RzIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiIHN0eWxlPXt7IG1hcmdpblRvcDogXCIxMnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICBObyBwcm9kdWN0cyBhZGRlZCB5ZXQuXHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXJlY2VudC1saXN0XCI+XHJcbiAgICAgICAgICAgICAgICB7KGRhdGEucmVjZW50UHJvZHVjdHMgfHwgW10pLm1hcCgocHJvZHVjdCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcmVjZW50LWl0ZW1cIiBrZXk9e3Byb2R1Y3QuaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC10aHVtYlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAge3Byb2R1Y3RJbWFnZShwcm9kdWN0KSA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17cHJvZHVjdEltYWdlKHByb2R1Y3QpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFsdD17cHJvZHVjdC5uYW1lIHx8IFwicHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3Byb2R1Y3RMYWJlbChwcm9kdWN0KX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbmFtZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdC5uYW1lIHx8IFwiVW50aXRsZWQgcHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtZGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShwcm9kdWN0LmNyZWF0ZWRBdCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcmljZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0Q3VycmVuY3kocHJvZHVjdC5wcmljZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtZnVsbC13aWR0aC1zZWN0aW9uXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZCBjaGFuZ2U4LWNhcmQtLW5vcm1hbFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPk9yZGVycyBPdmVydmlldzwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+XHJcbiAgICAgICAgICAgICAgU3VtbWFyeSBvZiBhbGwgb3JkZXJzIGFuZCB0cmFuc2FjdGlvbnNcclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtc2VjdGlvbi1kaXZpZGVyXCIgLz5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1vdmVydmlld1wiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1ib3hcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+VG90YWwgT3JkZXJzPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC12YWx1ZVwiXHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IG1hcmdpblRvcDogXCI4cHhcIiB9fVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICB7ZGF0YS5vcmRlcnMgfHwgMH1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1ib3hcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+VG90YWwgVXNlcnM8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCJcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgbWFyZ2luVG9wOiBcIjhweFwiIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtkYXRhLnVzZXJzIHx8IDB9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItYm94XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPlRvdGFsIFJldmVudWU8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCJcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgbWFyZ2luVG9wOiBcIjhweFwiLCBjb2xvcjogXCJ2YXIoLS1nb2xkKVwiIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtmb3JtYXRDdXJyZW5jeShkYXRhLnJldmVudWUpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZDtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IFJlZ2lzdGVyID0gKCkgPT4ge1xyXG4gIGNvbnN0IFtmb3JtU3RhdGUsIHNldEZvcm1TdGF0ZV0gPSB1c2VTdGF0ZSh7XHJcbiAgICBuYW1lOiBcIlwiLFxyXG4gICAgZW1haWw6IFwiXCIsXHJcbiAgICBwYXNzd29yZDogXCJcIixcclxuICB9KTtcclxuICBjb25zdCBbbWVzc2FnZSwgc2V0TWVzc2FnZV0gPSB1c2VTdGF0ZSh7IHR5cGU6IFwiXCIsIHRleHQ6IFwiXCIgfSk7XHJcbiAgY29uc3QgW2lzU3VibWl0dGluZywgc2V0SXNTdWJtaXR0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUubWFyZ2luID0gXCIwXCI7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCBoYW5kbGVDaGFuZ2UgPSAoZXZlbnQpID0+IHtcclxuICAgIHNldEZvcm1TdGF0ZSgoY3VycmVudCkgPT4gKHtcclxuICAgICAgLi4uY3VycmVudCxcclxuICAgICAgW2V2ZW50LnRhcmdldC5uYW1lXTogZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgfSkpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZVN1Ym1pdCA9IGFzeW5jIChldmVudCkgPT4ge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIHNldE1lc3NhZ2UoeyB0eXBlOiBcIlwiLCB0ZXh0OiBcIlwiIH0pO1xyXG4gICAgc2V0SXNTdWJtaXR0aW5nKHRydWUpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvYXBpL3JlZ2lzdGVyXCIsIHtcclxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZm9ybVN0YXRlKSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLm1lc3NhZ2UgfHwgXCJSZWdpc3RyYXRpb24gZmFpbGVkXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZXRNZXNzYWdlKHtcclxuICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcclxuICAgICAgICB0ZXh0OiBcIkFjY291bnQgY3JlYXRlZCBzdWNjZXNzZnVsbHkhIFJlZGlyZWN0aW5nLi4uXCIsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9hZG1pbi9sb2dpblwiO1xyXG4gICAgICB9LCAyMDAwKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHNldE1lc3NhZ2UoeyB0eXBlOiBcImVycm9yXCIsIHRleHQ6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICAgIHNldElzU3VibWl0dGluZyhmYWxzZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItcGFnZVwiPlxyXG4gICAgICA8c3R5bGU+e2BcclxuICAgICAgICAucmVnaXN0ZXItcGFnZSB7XHJcbiAgICAgICAgICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgICBwYWRkaW5nOiAyNHB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDpcclxuICAgICAgICAgICAgbGluZWFyLWdyYWRpZW50KHJnYmEoMTUsIDIzLCA0MiwgMC4zNSksIHJnYmEoMTUsIDIzLCA0MiwgMC4zNSkpLFxyXG4gICAgICAgICAgICB1cmwoJy9wdWJsaWMvaW1nMi5qcGcnKSBjZW50ZXIgLyBjb3ZlciBmaXhlZDtcclxuICAgICAgICAgIGZvbnQtZmFtaWx5OiBcIlBsdXMgSmFrYXJ0YSBTYW5zXCIsIFwiU2Vnb2UgVUlcIiwgc2Fucy1zZXJpZjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1jYXJkIHtcclxuICAgICAgICAgIHdpZHRoOiBtaW4oMTAwJSwgNTIwcHgpO1xyXG4gICAgICAgICAgcGFkZGluZzogNjBweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDI4cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDE1LCAyMywgNDIsIDAuODIpO1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCA1MHB4IDEwMHB4IC0yMHB4IHJnYmEoMCwgMCwgMCwgMC44KTtcclxuICAgICAgICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cigzMHB4KTtcclxuICAgICAgICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWxvZ28ge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMzBweDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMjRweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA4MDA7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogLTAuMDFlbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1sb2dvIHNwYW4ge1xyXG4gICAgICAgICAgY29sb3I6ICM2MzY2ZjE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItZmllbGQge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1sYWJlbCB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcbiAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMWVtO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItaW5wdXQge1xyXG4gICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxNHB4IDE4cHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KTtcclxuICAgICAgICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgICAgICAgb3V0bGluZTogbm9uZTtcclxuICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItaW5wdXQ6Zm9jdXMge1xyXG4gICAgICAgICAgYm9yZGVyLWNvbG9yOiAjNjM2NmYxO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA4KTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDRweCByZ2JhKDk5LCAxMDIsIDI0MSwgMC4yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1idXR0b24ge1xyXG4gICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAxMHB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMTZweDtcclxuICAgICAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNjM2NmYxLCAjYTg1NWY3KTtcclxuICAgICAgICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMTBweCAyNXB4IC01cHggcmdiYSg5OSwgMTAyLCAyNDEsIDAuNCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItYnV0dG9uOmRpc2FibGVkIHtcclxuICAgICAgICAgIG9wYWNpdHk6IDAuNjtcclxuICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbWVzc2FnZSB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMTJweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLW1lc3NhZ2UuaXMtdmlzaWJsZSB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1tZXNzYWdlLmVycm9yIHtcclxuICAgICAgICAgIGNvbG9yOiAjZjg3MTcxO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyMzksIDY4LCA2OCwgMC4xKTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjM5LCA2OCwgNjgsIDAuMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbWVzc2FnZS5zdWNjZXNzIHtcclxuICAgICAgICAgIGNvbG9yOiAjNGFkZTgwO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgzNCwgMTk3LCA5NCwgMC4xKTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMzQsIDE5NywgOTQsIDAuMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItZm9vdGVyIHtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDI1cHg7XHJcbiAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWZvb3RlciBhIHtcclxuICAgICAgICAgIGNvbG9yOiAjNjM2NmYxO1xyXG4gICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1mb290ZXIgYTpob3ZlciB7XHJcbiAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA4NTBweCkge1xyXG4gICAgICAgICAgLnJlZ2lzdGVyLWNhcmQge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiA0MHB4O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgYH08L3N0eWxlPlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWdpc3Rlci1jYXJkXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWdpc3Rlci1sb2dvXCI+UmVnaXN0ZXIgb3VyIHNpdGU8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdlxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtgcmVnaXN0ZXItbWVzc2FnZSAke21lc3NhZ2UudHlwZX0gJHtcclxuICAgICAgICAgICAgbWVzc2FnZS50ZXh0ID8gXCJpcy12aXNpYmxlXCIgOiBcIlwiXHJcbiAgICAgICAgICB9YH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7bWVzc2FnZS50ZXh0fVxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlU3VibWl0fT5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItZmllbGRcIj5cclxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWxhYmVsXCIgaHRtbEZvcj1cIm5hbWVcIj5cclxuICAgICAgICAgICAgICBGdWxsIE5hbWVcclxuICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmVnaXN0ZXItaW5wdXRcIlxyXG4gICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICBpZD1cIm5hbWVcIlxyXG4gICAgICAgICAgICAgIG5hbWU9XCJuYW1lXCJcclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIHlvdXIgZnVsbCBuYW1lXCJcclxuICAgICAgICAgICAgICB2YWx1ZT17Zm9ybVN0YXRlLm5hbWV9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cclxuICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWdpc3Rlci1maWVsZFwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwicmVnaXN0ZXItbGFiZWxcIiBodG1sRm9yPVwiZW1haWxcIj5cclxuICAgICAgICAgICAgICBFbWFpbCBBZGRyZXNzXHJcbiAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWlucHV0XCJcclxuICAgICAgICAgICAgICB0eXBlPVwiZW1haWxcIlxyXG4gICAgICAgICAgICAgIGlkPVwiZW1haWxcIlxyXG4gICAgICAgICAgICAgIG5hbWU9XCJlbWFpbFwiXHJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJleGFtcGxlQGVtYWlsLmNvbVwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1TdGF0ZS5lbWFpbH1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxyXG4gICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLWZpZWxkXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJyZWdpc3Rlci1sYWJlbFwiIGh0bWxGb3I9XCJwYXNzd29yZFwiPlxyXG4gICAgICAgICAgICAgIFBhc3N3b3JkXHJcbiAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWlucHV0XCJcclxuICAgICAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxyXG4gICAgICAgICAgICAgIGlkPVwicGFzc3dvcmRcIlxyXG4gICAgICAgICAgICAgIG5hbWU9XCJwYXNzd29yZFwiXHJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJBdCBsZWFzdCA2IGNoYXJhY3RlcnNcIlxyXG4gICAgICAgICAgICAgIG1pbkxlbmd0aD17Nn1cclxuICAgICAgICAgICAgICB2YWx1ZT17Zm9ybVN0YXRlLnBhc3N3b3JkfVxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XHJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicmVnaXN0ZXItYnV0dG9uXCJcclxuICAgICAgICAgICAgdHlwZT1cInN1Ym1pdFwiXHJcbiAgICAgICAgICAgIGRpc2FibGVkPXtpc1N1Ym1pdHRpbmd9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHtpc1N1Ym1pdHRpbmcgPyBcIkNyZWF0aW5nIGFjY291bnQuLi5cIiA6IFwiQ3JlYXRlIEFjY291bnRcIn1cclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZm9ybT5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWdpc3Rlci1mb290ZXJcIj5cclxuICAgICAgICAgIEFscmVhZHkgaGF2ZSBhbiBhY2NvdW50PyA8YSBocmVmPVwiL2FkbWluL2xvZ2luXCI+TG9nIGluPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RlcjtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IGdyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcInJlcGVhdChhdXRvLWZpbGwsIG1pbm1heCgyNDBweCwgMWZyKSlcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgY2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxNnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjgpXCIsXHJcbiAgYmFja2dyb3VuZDogXCJsaW5lYXItZ3JhZGllbnQoMTYwZGVnLCAjMGIxYTM4IDAlLCAjMDkxNjJmIDEwMCUpXCIsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG4gIG92ZXJmbG93OiBcImhpZGRlblwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDEycHggMjJweCByZ2JhKDIsIDYsIDIzLCAwLjI1KVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VXcmFwU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIGhlaWdodDogXCIyMDBweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgcGFkZGluZzogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvbnRhaW5cIixcclxufTtcclxuXHJcbmNvbnN0IGJvZHlTdHlsZSA9IHtcclxuICBwYWRkaW5nOiBcIjE0cHhcIixcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBtZXRhU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbn07XHJcblxyXG5jb25zdCBiYWRnZVN0eWxlID0gKGlzQWN0aXZlKSA9PiAoe1xyXG4gIHdpZHRoOiBcImZpdC1jb250ZW50XCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDVlbVwiLFxyXG4gIHBhZGRpbmc6IFwiNXB4IDEwcHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiOTk5cHhcIixcclxuICBjb2xvcjogaXNBY3RpdmUgPyBcIiMxNDUzMmRcIiA6IFwiIzdmMWQxZFwiLFxyXG4gIGJhY2tncm91bmQ6IGlzQWN0aXZlID8gXCIjYmJmN2QwXCIgOiBcIiNmZWNhY2FcIixcclxufSk7XHJcblxyXG5jb25zdCBsaW5rU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtYmxvY2tcIixcclxuICBtYXJnaW5Ub3A6IFwiNHB4XCIsXHJcbiAgY29sb3I6IFwiIzkzYzVmZFwiLFxyXG4gIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgZm9udFdlaWdodDogNjAwLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBlbXB0eVN0eWxlID0ge1xyXG4gIHBhZGRpbmc6IFwiMThweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjQ1KVwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdFByaWNlID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgYW1vdW50ID0gTnVtYmVyKHZhbHVlIHx8IDApO1xyXG4gIGlmICghTnVtYmVyLmlzRmluaXRlKGFtb3VudCkpIHtcclxuICAgIHJldHVybiBcIjAuMDBcIjtcclxuICB9XHJcblxyXG4gIHJldHVybiBhbW91bnQudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBnZXRSZWNvcmRJZCA9IChyZWNvcmQpID0+IHtcclxuICByZXR1cm4gcmVjb3JkPy5wYXJhbXM/LmlkIHx8IHJlY29yZD8uaWQgfHwgcmVjb3JkPy5wYXJhbT8uaWQgfHwgXCJcIjtcclxufTtcclxuXHJcbmNvbnN0IGdldFNob3dIcmVmID0gKHJlY29yZCwgcmVzb3VyY2VJZCkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZEFjdGlvbnMgPSByZWNvcmQ/LnJlY29yZEFjdGlvbnMgfHwgcmVjb3JkPy5hY3Rpb25zIHx8IFtdO1xyXG4gIGNvbnN0IHNob3dBY3Rpb24gPSByZWNvcmRBY3Rpb25zLmZpbmQoKGFjdGlvbikgPT4gYWN0aW9uPy5uYW1lID09PSBcInNob3dcIik7XHJcbiAgY29uc3QgcmF3SHJlZiA9IHNob3dBY3Rpb24/LmhyZWYgfHwgcmVjb3JkPy5ocmVmIHx8IFwiXCI7XHJcblxyXG4gIGlmIChyYXdIcmVmKSB7XHJcbiAgICByZXR1cm4gcmF3SHJlZjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGlkID0gZ2V0UmVjb3JkSWQocmVjb3JkKTtcclxuICByZXR1cm4gaWRcclxuICAgID8gYC9hZG1pbi9yZXNvdXJjZXMvJHtlbmNvZGVVUklDb21wb25lbnQocmVzb3VyY2VJZCl9L3JlY29yZHMvJHtlbmNvZGVVUklDb21wb25lbnQoaWQpfS9zaG93YFxyXG4gICAgOiBcIlwiO1xyXG59O1xyXG5cclxuY29uc3QgUHJvZHVjdENhcmRzTGlzdCA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnN0IFthcGlSZWNvcmRzLCBzZXRBcGlSZWNvcmRzXSA9IHVzZVN0YXRlKFtdKTtcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgW2xvYWRFcnJvciwgc2V0TG9hZEVycm9yXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG5cclxuICBjb25zdCByZXNvdXJjZUlkID1cclxuICAgIHByb3BzPy5yZXNvdXJjZT8uaWQgPT09IFwiUHJvZHVjdFwiXHJcbiAgICAgID8gXCJQcm9kdWN0c1wiXHJcbiAgICAgIDogcHJvcHM/LnJlc291cmNlPy5pZCB8fCBcIlByb2R1Y3RzXCI7XHJcbiAgY29uc3QgcHJvcFJlY29yZHMgPSBwcm9wcz8ucmVjb3JkcyB8fCBbXTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChwcm9wUmVjb3Jkcy5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBpc01vdW50ZWQgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IGxvYWRSZWNvcmRzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICBzZXRMb2FkaW5nKHRydWUpO1xyXG4gICAgICBzZXRMb2FkRXJyb3IoXCJcIik7XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgICAgICBgL2FkbWluL2FwaS9yZXNvdXJjZXMvJHtlbmNvZGVVUklDb21wb25lbnQocmVzb3VyY2VJZCl9L2FjdGlvbnMvbGlzdGAsXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihwYXlsb2FkPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgcHJvZHVjdHNcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXNNb3VudGVkKSB7XHJcbiAgICAgICAgICBzZXRBcGlSZWNvcmRzKHBheWxvYWQ/LnJlY29yZHMgfHwgW10pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBpZiAoaXNNb3VudGVkKSB7XHJcbiAgICAgICAgICBzZXRMb2FkRXJyb3IoZXJyb3I/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gbG9hZCBwcm9kdWN0c1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWRSZWNvcmRzKCk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgaXNNb3VudGVkID0gZmFsc2U7XHJcbiAgICB9O1xyXG4gIH0sIFtwcm9wUmVjb3Jkcy5sZW5ndGgsIHJlc291cmNlSWRdKTtcclxuXHJcbiAgY29uc3QgcmVjb3JkcyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgcmV0dXJuIHByb3BSZWNvcmRzLmxlbmd0aCA/IHByb3BSZWNvcmRzIDogYXBpUmVjb3JkcztcclxuICB9LCBbcHJvcFJlY29yZHMsIGFwaVJlY29yZHNdKTtcclxuXHJcbiAgaWYgKGxvYWRpbmcpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5Mb2FkaW5nIHByb2R1Y3RzLi4uPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKGxvYWRFcnJvcikge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9Pntsb2FkRXJyb3J9PC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKCFyZWNvcmRzLmxlbmd0aCkge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9Pk5vIHByb2R1Y3RzIGZvdW5kLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtncmlkU3R5bGV9PlxyXG4gICAgICB7cmVjb3Jkcy5tYXAoKHJlY29yZCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9O1xyXG4gICAgICAgIGNvbnN0IGlkID0gZ2V0UmVjb3JkSWQocmVjb3JkKTtcclxuICAgICAgICBjb25zdCBuYW1lID0gcGFyYW1zPy5uYW1lIHx8IFwiVW5uYW1lZCBwcm9kdWN0XCI7XHJcbiAgICAgICAgY29uc3QgY2F0ZWdvcnkgPSBwYXJhbXM/LmNhdGVnb3J5SWQgfHwgXCItXCI7XHJcbiAgICAgICAgY29uc3QgaW1hZ2VVcmwgPSBwYXJhbXM/LmltYWdlVXJsIHx8IFwiXCI7XHJcbiAgICAgICAgY29uc3Qgc3RvY2sgPSBOdW1iZXIocGFyYW1zPy5zdG9jayB8fCAwKTtcclxuICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IEJvb2xlYW4ocGFyYW1zPy5pc0FjdGl2ZSk7XHJcbiAgICAgICAgY29uc3QgZGV0YWlsc0hyZWYgPSBnZXRTaG93SHJlZihyZWNvcmQsIHJlc291cmNlSWQpO1xyXG4gICAgICAgIGNvbnN0IG9wZW5EZXRhaWxzID0gKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGRldGFpbHNIcmVmKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oZGV0YWlsc0hyZWYpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICA8YXJ0aWNsZSBrZXk9e2lkfSBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW1hZ2VXcmFwU3R5bGV9PlxyXG4gICAgICAgICAgICAgIHtpbWFnZVVybCA/IChcclxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtpbWFnZVVybH0gYWx0PXtuYW1lfSBzdHlsZT17aW1hZ2VTdHlsZX0gLz5cclxuICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICBObyBpbWFnZVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtib2R5U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6IFwiMThweFwiLCBmb250V2VpZ2h0OiA3MDAgfX0+e25hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17bWV0YVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXY+Q2F0ZWdvcnk6IHtjYXRlZ29yeX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXY+U3RvY2s6IHtzdG9ja308L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXY+UHJpY2U6IFJzLiB7Zm9ybWF0UHJpY2UocGFyYW1zPy5wcmljZSl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2JhZGdlU3R5bGUoaXNBY3RpdmUpfT5cclxuICAgICAgICAgICAgICAgIHtpc0FjdGl2ZSA/IFwiQUNUSVZFXCIgOiBcIklOQUNUSVZFXCJ9XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgICAgICBocmVmPXtkZXRhaWxzSHJlZiB8fCBcIiNcIn1cclxuICAgICAgICAgICAgICAgIHN0eWxlPXtsaW5rU3R5bGV9XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgb3BlbkRldGFpbHMoKTtcclxuICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICBhcmlhLWRpc2FibGVkPXshZGV0YWlsc0hyZWZ9XHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgVmlldyBkZXRhaWxzXHJcbiAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICApO1xyXG4gICAgICB9KX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0Q2FyZHNMaXN0O1xyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBwYWdlU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjE4cHhcIixcclxuICBjb2xvcjogXCIjZTJlOGYwXCIsXHJcbn07XHJcblxyXG5jb25zdCBoZXJvU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJtaW5tYXgoMjgwcHgsIDM2MHB4KSAxZnJcIixcclxuICBnYXA6IFwiMThweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwic3RyZXRjaFwiLFxyXG59O1xyXG5cclxuY29uc3QgcGFuZWxTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMjBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjE4KVwiLFxyXG4gIGJhY2tncm91bmQ6XHJcbiAgICBcImxpbmVhci1ncmFkaWVudCgxNjBkZWcsIHJnYmEoMTEsIDI2LCA1NiwgMC45NikgMCUsIHJnYmEoOSwgMjIsIDQ3LCAwLjk2KSAxMDAlKVwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDIwcHggNDBweCByZ2JhKDIsIDYsIDIzLCAwLjI0KVwiLFxyXG4gIG92ZXJmbG93OiBcImhpZGRlblwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VXcmFwU3R5bGUgPSB7XHJcbiAgbWluSGVpZ2h0OiBcIjM2MHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjMGYxNzJhXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gIGRpc3BsYXk6IFwiYmxvY2tcIixcclxufTtcclxuXHJcbmNvbnN0IGhlcm9Cb2R5U3R5bGUgPSB7XHJcbiAgcGFkZGluZzogXCIyMnB4XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcImNsYW1wKDI4cHgsIDR2dywgNDZweClcIixcclxuICBsaW5lSGVpZ2h0OiAxLjA1LFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IHN1YnRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBiYWRnZVN0eWxlID0gKGFjdGl2ZSkgPT4gKHtcclxuICBkaXNwbGF5OiBcImlubGluZS1mbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gIHBhZGRpbmc6IFwiNnB4IDEycHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiOTk5cHhcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4wOGVtXCIsXHJcbiAgY29sb3I6IGFjdGl2ZSA/IFwiIzE0NTMyZFwiIDogXCIjN2YxZDFkXCIsXHJcbiAgYmFja2dyb3VuZDogYWN0aXZlID8gXCIjYmJmN2QwXCIgOiBcIiNmZWNhY2FcIixcclxufSk7XHJcblxyXG5jb25zdCBzdGF0c0dyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcInJlcGVhdCgzLCBtaW5tYXgoMTYwcHgsIDFmcikpXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxufTtcclxuXHJcbmNvbnN0IHN0YXRDYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE2cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xNSlcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTUsIDIzLCA0MiwgMC41OClcIixcclxuICBwYWRkaW5nOiBcIjE0cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHN0YXRMYWJlbFN0eWxlID0ge1xyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xNmVtXCIsXHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIG1hcmdpbkJvdHRvbTogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHN0YXRWYWx1ZVN0eWxlID0ge1xyXG4gIGZvbnRTaXplOiBcIjE2cHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG4gIHdvcmRCcmVhazogXCJicmVhay13b3JkXCIsXHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uR3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwibWlubWF4KDAsIDEuNGZyKSBtaW5tYXgoMjgwcHgsIDAuOWZyKVwiLFxyXG4gIGdhcDogXCIxOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uVGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgZm9udFNpemU6IFwiMTRweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTJlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgY29sb3I6IFwiI2Y1ZGY5MFwiLFxyXG59O1xyXG5cclxuY29uc3QgY29udGVudENhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMjBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjE4KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSgxMSwgMjYsIDU2LCAwLjkpXCIsXHJcbiAgcGFkZGluZzogXCIxOHB4XCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTZweCAyOHB4IHJnYmEoMiwgNiwgMjMsIDAuMTYpXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvTGlzdFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCIxMHB4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvTGFiZWxTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb1ZhbHVlU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZvbnRXZWlnaHQ6IDYwMCxcclxuICB0ZXh0QWxpZ246IFwicmlnaHRcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCBkZXNjcmlwdGlvblN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxuICBsaW5lSGVpZ2h0OiAxLjcsXHJcbiAgZm9udFNpemU6IFwiMTRweFwiLFxyXG4gIHdoaXRlU3BhY2U6IFwicHJlLXdyYXBcIixcclxufTtcclxuXHJcbmNvbnN0IGJ1dHRvblN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiaW5saW5lLWZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgcGFkZGluZzogXCIxNHB4IDE4cHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTRweFwiLFxyXG4gIGJvcmRlcjogXCJub25lXCIsXHJcbiAgYmFja2dyb3VuZDogXCJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNjM2NmYxIDAlLCAjOGI1Y2Y2IDEwMCUpXCIsXHJcbiAgY29sb3I6IFwiI2ZmZmZmZlwiLFxyXG4gIGZvbnRTaXplOiBcIjE1cHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxuICB0cmFuc2l0aW9uOiBcImFsbCAwLjNzIGVhc2VcIixcclxuICBib3hTaGFkb3c6IFwiMCA4cHggMTZweCByZ2JhKDk5LCAxMDIsIDI0MSwgMC4zKVwiLFxyXG59O1xyXG5cclxuY29uc3QgYnV0dG9uSG92ZXJTdHlsZSA9IHtcclxuICAuLi5idXR0b25TdHlsZSxcclxuICB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWSgtMnB4KVwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDEycHggMjRweCByZ2JhKDk5LCAxMDIsIDI0MSwgMC40KVwiLFxyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0Q3VycmVuY3kgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBhbW91bnQgPSBOdW1iZXIodmFsdWUgfHwgMCk7XHJcbiAgcmV0dXJuIGBScy4gJHthbW91bnQudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSl9YDtcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUpID0+IHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gXCItXCI7XHJcbiAgfVxyXG5cclxuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpO1xyXG4gIGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSB7XHJcbiAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgZGF0ZVN0eWxlOiBcIm1lZGl1bVwiLFxyXG4gICAgdGltZVN0eWxlOiBcInNob3J0XCIsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0U2hvdyA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnN0IHJlY29yZCA9IHByb3BzPy5yZWNvcmQ7XHJcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge307XHJcblxyXG4gIGNvbnN0IG5hbWUgPSBwYXJhbXM/Lm5hbWUgfHwgXCJVbm5hbWVkIHByb2R1Y3RcIjtcclxuICBjb25zdCBza3UgPSBwYXJhbXM/LnNrdSB8fCBcIi1cIjtcclxuICBjb25zdCBjYXRlZ29yeSA9IHBhcmFtcz8uY2F0ZWdvcnlJZCB8fCBcIi1cIjtcclxuICBjb25zdCBpbWFnZVVybCA9IHBhcmFtcz8uaW1hZ2VVcmwgfHwgXCJcIjtcclxuICBjb25zdCBzdG9jayA9IE51bWJlcihwYXJhbXM/LnN0b2NrIHx8IDApO1xyXG4gIGNvbnN0IGlzQWN0aXZlID0gQm9vbGVhbihwYXJhbXM/LmlzQWN0aXZlKTtcclxuICBjb25zdCBwcmljZSA9IGZvcm1hdEN1cnJlbmN5KHBhcmFtcz8ucHJpY2UpO1xyXG4gIGNvbnN0IGRlc2NyaXB0aW9uID1cclxuICAgIHBhcmFtcz8uZGVzY3JpcHRpb24gfHwgXCJObyBkZXNjcmlwdGlvbiBhdmFpbGFibGUgZm9yIHRoaXMgcHJvZHVjdC5cIjtcclxuXHJcbiAgY29uc3QgW2J1dHRvbkhvdmVyZWQsIHNldEJ1dHRvbkhvdmVyZWRdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICBjb25zdCBoYW5kbGVPcmRlckNsaWNrID0gKCkgPT4ge1xyXG4gICAgY29uc3QgcHJvZHVjdElkID0gcGFyYW1zPy5pZCB8fCByZWNvcmQ/LmlkIHx8IFwiXCI7XHJcbiAgICBjb25zdCBuZXdPcmRlclVybCA9IGAvYWRtaW4vcmVzb3VyY2VzL09yZGVycy9hY3Rpb25zL25ldz9wcm9kdWN0SWQ9JHtlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKHByb2R1Y3RJZCkpfWA7XHJcbiAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKG5ld09yZGVyVXJsKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17cGFnZVN0eWxlfT5cclxuICAgICAgPHN0eWxlPlxyXG4gICAgICAgIHtgXHJcbiAgICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogOTgwcHgpIHtcclxuICAgICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LWhlcm8sXHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1zZWN0aW9ucyB7XHJcbiAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgIWltcG9ydGFudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGB9XHJcbiAgICAgIDwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdC1zaG93LWhlcm9cIiBzdHlsZT17aGVyb1N0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtwYW5lbFN0eWxlfT5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2ltYWdlV3JhcFN0eWxlfT5cclxuICAgICAgICAgICAge2ltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICAgIDxpbWcgc3JjPXtpbWFnZVVybH0gYWx0PXtuYW1lfSBzdHlsZT17aW1hZ2VTdHlsZX0gLz5cclxuICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgTm8gaW1hZ2UgYXZhaWxhYmxlXHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17cGFuZWxTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtoZXJvQm9keVN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aDEgc3R5bGU9e3RpdGxlU3R5bGV9PntuYW1lfTwvaDE+XHJcbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3N1YnRpdGxlU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgQ2xlYW4gcHJvZHVjdCBvdmVydmlldyBmb3IgcXVpY2sgcmV2aWV3IGFuZCBtYW5hZ2VtZW50LlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtiYWRnZVN0eWxlKGlzQWN0aXZlKX0+XHJcbiAgICAgICAgICAgICAge2lzQWN0aXZlID8gXCJBQ1RJVkVcIiA6IFwiSU5BQ1RJVkVcIn1cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0c0dyaWRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdENhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0TGFiZWxTdHlsZX0+UHJpY2U8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRWYWx1ZVN0eWxlfT57cHJpY2V9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdENhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0TGFiZWxTdHlsZX0+U3RvY2s8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtidXR0b25Ib3ZlcmVkID8gYnV0dG9uSG92ZXJTdHlsZSA6IGJ1dHRvblN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHNldEJ1dHRvbkhvdmVyZWQodHJ1ZSl9XHJcbiAgICAgICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17KCkgPT4gc2V0QnV0dG9uSG92ZXJlZChmYWxzZSl9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZU9yZGVyQ2xpY2t9XHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlPVwiQ2xpY2sgdG8gY3JlYXRlIGEgbmV3IG9yZGVyIGZvciB0aGlzIHByb2R1Y3RcIlxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICA8c3ZnXHJcbiAgICAgICAgICAgICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg9XCIxOFwiXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiMThcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxyXG4gICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMi41XCJcclxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjlcIiBjeT1cIjIxXCIgcj1cIjFcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCIyMFwiIGN5PVwiMjFcIiByPVwiMVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xIDFoNGwyLjY4IDEzLjM5YTIgMiAwIDAgMCAyIDEuNjFoOS43MmEyIDIgMCAwIDAgMi0xLjYxTDIzIDZINlwiIC8+XHJcbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICBPcmRlciBOb3dcclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdFZhbHVlU3R5bGV9PntzdG9ja308L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0Q2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRMYWJlbFN0eWxlfT5TS1U8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRWYWx1ZVN0eWxlfT57c2t1fTwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LXNob3ctc2VjdGlvbnNcIiBzdHlsZT17c2VjdGlvbkdyaWRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17Y29udGVudENhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5EZXNjcmlwdGlvbjwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTIgfX0gLz5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2Rlc2NyaXB0aW9uU3R5bGV9PntkZXNjcmlwdGlvbn08L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17Y29udGVudENhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5Qcm9kdWN0IERldGFpbHM8L2gyPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvTGlzdFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PkNhdGVnb3J5PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvVmFsdWVTdHlsZX0+e2NhdGVnb3J5fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9MYWJlbFN0eWxlfT5DcmVhdGVkIEF0PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvVmFsdWVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShwYXJhbXM/LmNyZWF0ZWRBdCl9XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PlVwZGF0ZWQgQXQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIHtmb3JtYXREYXRlKHBhcmFtcz8udXBkYXRlZEF0KX1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvTGFiZWxTdHlsZX0+UmVjb3JkIElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvVmFsdWVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICB7cGFyYW1zPy5pZCB8fCByZWNvcmQ/LmlkIHx8IFwiLVwifVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdFNob3c7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBwYWdlU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjIwcHhcIixcclxuICBjb2xvcjogXCIjZTJlOGYwXCIsXHJcbn07XHJcblxyXG5jb25zdCBoZWFkZXJTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBmb250U2l6ZTogXCIzNHB4XCIsXHJcbiAgbGluZUhlaWdodDogMS4wOCxcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBkZXNjU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBjYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE4cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yKVwiLFxyXG4gIGJhY2tncm91bmQ6XHJcbiAgICBcImxpbmVhci1ncmFkaWVudCgxNTBkZWcsIHJnYmEoMTAsIDIzLCA0OCwgMC45NCkgMCUsIHJnYmEoOCwgMTgsIDM4LCAwLjk0KSAxMDAlKVwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDE0cHggMjhweCByZ2JhKDIsIDYsIDIzLCAwLjIyKVwiLFxyXG4gIHBhZGRpbmc6IFwiMThweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdGlvblRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiBcIjAgMCAxNHB4IDBcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTJlbVwiLFxyXG4gIGNvbG9yOiBcIiNmNWRmOTBcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbn07XHJcblxyXG5jb25zdCBsYXlvdXRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgzMDBweCwgMC45NWZyKSBtaW5tYXgoNDIwcHgsIDEuMjVmcilcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc3RhY2tTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgbGFiZWxTdHlsZSA9IHtcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xZW1cIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGlucHV0U3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIG1pbldpZHRoOiAwLFxyXG4gIGJveFNpemluZzogXCJib3JkZXItYm94XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yNilcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTUsIDIzLCA0MiwgMC42MilcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgcGFkZGluZzogXCIxMXB4IDEzcHhcIixcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbiAgZm9udEZhbWlseTogXCJpbmhlcml0XCIsXHJcbn07XHJcblxyXG5jb25zdCByb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbiAgbWluV2lkdGg6IDAsXHJcbn07XHJcblxyXG5jb25zdCBncmlkMlN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwicmVwZWF0KDIsIG1pbm1heCgwLCAxZnIpKVwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJzdGFydFwiLFxyXG59O1xyXG5cclxuY29uc3QgY3VzdG9tZXJJbmZvU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGN1c3RvbWVyUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiOHB4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbn07XHJcblxyXG5jb25zdCBtdXRlZFN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxufTtcclxuXHJcbmNvbnN0IHN0cm9uZ1N0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgdGV4dEFsaWduOiBcInJpZ2h0XCIsXHJcbn07XHJcblxyXG5jb25zdCBsaW5lSXRlbVJvd1N0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIpXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE0cHhcIixcclxuICBwYWRkaW5nOiBcIjEycHhcIixcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSgxNSwgMjMsIDQyLCAwLjQ0KVwiLFxyXG59O1xyXG5cclxuY29uc3QgbGluZUl0ZW1Ub3BTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjFmciBhdXRvXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgcHJvZHVjdFByZXZpZXdTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjU2cHggMWZyXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI1NnB4XCIsXHJcbiAgaGVpZ2h0OiBcIjU2cHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjI1KVwiLFxyXG59O1xyXG5cclxuY29uc3QgYWRkQnV0dG9uU3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMzUpXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBwYWRkaW5nOiBcIjlweCAxMnB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDk5LCAxMDIsIDI0MSwgMC4xOClcIixcclxuICBjb2xvcjogXCIjZGJlYWZlXCIsXHJcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbn07XHJcblxyXG5jb25zdCByZW1vdmVCdXR0b25TdHlsZSA9IHtcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMjM5LCA2OCwgNjgsIDAuNSlcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIHBhZGRpbmc6IFwiOHB4IDEwcHhcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTI3LCAyOSwgMjksIDAuMjUpXCIsXHJcbiAgY29sb3I6IFwiI2ZlY2FjYVwiLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxufTtcclxuXHJcbmNvbnN0IHRvdGFsc1Jvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBwYWRkaW5nOiBcIjdweCAwXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG59O1xyXG5cclxuY29uc3QgdG90YWxTdHlsZSA9IHtcclxuICAuLi50b3RhbHNSb3dTdHlsZSxcclxuICBmb250U2l6ZTogXCIxN3B4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBib3JkZXJCb3R0b206IFwibm9uZVwiLFxyXG4gIHBhZGRpbmdUb3A6IFwiMTJweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYWN0aW9uQmFyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGFjdGlvbkJ1dHRvblN0eWxlID0gKHByaW1hcnkpID0+ICh7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IHByaW1hcnkgPyBcIm5vbmVcIiA6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yOClcIixcclxuICBwYWRkaW5nOiBcIjEycHggMTRweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIGJhY2tncm91bmQ6IHByaW1hcnlcclxuICAgID8gXCJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNjM2NmYxIDAlLCAjOGI1Y2Y2IDEwMCUpXCJcclxuICAgIDogXCJyZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgY29sb3I6IHByaW1hcnkgPyBcIiNmZmZcIiA6IFwiI2QxZDVkYlwiLFxyXG59KTtcclxuXHJcbmNvbnN0IG1hcExpbmtTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjOTNjNWZkXCIsXHJcbiAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIixcclxufTtcclxuXHJcbmNvbnN0IHBheW1lbnRPcHRpb25HcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IHBheW1lbnRPcHRpb25TdHlsZSA9IChhY3RpdmUpID0+ICh7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IGFjdGl2ZVxyXG4gICAgPyBcIjFweCBzb2xpZCByZ2JhKDk5LCAxMDIsIDI0MSwgMC45KVwiXHJcbiAgICA6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yNClcIixcclxuICBiYWNrZ3JvdW5kOiBhY3RpdmUgPyBcInJnYmEoOTksIDEwMiwgMjQxLCAwLjIyKVwiIDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNDgpXCIsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG4gIHBhZGRpbmc6IFwiMTBweCAxMnB4XCIsXHJcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxuICB0ZXh0QWxpZ246IFwibGVmdFwiLFxyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxufSk7XHJcblxyXG5jb25zdCBzZWN1cml0eUNoaXBXcmFwU3R5bGUgPSB7XHJcbiAgbWFyZ2luVG9wOiBcIjEycHhcIixcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzZWN1cml0eUNoaXBTdHlsZSA9IHtcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMzQsIDE5NywgOTQsIDAuNDIpXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDIwLCA4MywgNDUsIDAuMjQpXCIsXHJcbiAgY29sb3I6IFwiIzg2ZWZhY1wiLFxyXG4gIHBhZGRpbmc6IFwiN3B4IDEwcHhcIixcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4wM2VtXCIsXHJcbn07XHJcblxyXG5jb25zdCByZXNwb25zaXZlQ3NzID0gYFxyXG4uY2hhbmdlOC1vcmRlci1ncmlkLTIge1xyXG4gIGRpc3BsYXk6IGdyaWQgIWltcG9ydGFudDtcclxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCBtaW5tYXgoMCwgMWZyKSkgIWltcG9ydGFudDtcclxuICBnYXA6IDEwcHggIWltcG9ydGFudDtcclxufVxyXG5cclxuLmNoYW5nZTgtb3JkZXItZ3JpZC0yID4gKiB7XHJcbiAgbWluLXdpZHRoOiAwICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5jaGFuZ2U4LW9yZGVyLWdyaWQtMiBpbnB1dCxcclxuLmNoYW5nZTgtb3JkZXItZ3JpZC0yIHNlbGVjdCxcclxuLmNoYW5nZTgtb3JkZXItZ3JpZC0yIHRleHRhcmVhIHtcclxuICB3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG4gIG1pbi13aWR0aDogMCAhaW1wb3J0YW50O1xyXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3ggIWltcG9ydGFudDtcclxufVxyXG5cclxuQG1lZGlhIChtYXgtd2lkdGg6IDEwMjRweCkge1xyXG4gIC5jaGFuZ2U4LW9yZGVyLWxheW91dCB7XHJcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gIH1cclxufVxyXG5cclxuQG1lZGlhIChtYXgtd2lkdGg6IDc2MHB4KSB7XHJcbiAgLmNoYW5nZTgtb3JkZXItZ3JpZC0yIHtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7XHJcbiAgfVxyXG59XHJcbmA7XHJcblxyXG5jb25zdCBwYXltZW50T3B0aW9ucyA9IFtcclxuICB7IHZhbHVlOiBcIkNhcmRcIiwgbGFiZWw6IFwiQ2FyZCBQYXltZW50XCIsIGljb246IFwi8J+Ss1wiIH0sXHJcbiAgeyB2YWx1ZTogXCJDYXNoIG9uIERlbGl2ZXJ5XCIsIGxhYmVsOiBcIkNhc2ggb24gRGVsaXZlcnlcIiwgaWNvbjogXCLwn5OmXCIgfSxcclxuXTtcclxuXHJcbmNvbnN0IGl0ZW1TaXplT3B0aW9ucyA9IFtcIlhTXCIsIFwiU1wiLCBcIk1cIiwgXCJMXCIsIFwiWExcIiwgXCJYWExcIl07XHJcbmNvbnN0IHNoaXBwaW5nTWV0aG9kcyA9IFtcclxuICBcIlBpY2tNZSBGbGFzaFwiLFxyXG4gIFwiUHJvbnRvXCIsXHJcbiAgXCJEb21leFwiLFxyXG4gIFwiUmVnaXN0ZXJlZCBDb3VyaWVyXCIsXHJcbl07XHJcblxyXG5jb25zdCB0b051bWJlciA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IG51bSA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG51bSkgPyBudW0gOiAwO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0TW9uZXkgPSAodmFsdWUpID0+IHtcclxuICByZXR1cm4gYFJzLiAke3RvTnVtYmVyKHZhbHVlKS50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlRW1wdHlJdGVtID0gKCkgPT4gKHtcclxuICBwcm9kdWN0SWQ6IFwiXCIsXHJcbiAgc2l6ZTogXCJNXCIsXHJcbiAgcXVhbnRpdHk6IDEsXHJcbiAgdW5pdFByaWNlOiAwLFxyXG59KTtcclxuXHJcbmNvbnN0IE9yZGVyQ3JlYXRlID0gKCkgPT4ge1xyXG4gIGNvbnN0IFt1c2Vycywgc2V0VXNlcnNdID0gdXNlU3RhdGUoW10pO1xyXG4gIGNvbnN0IFtwcm9kdWN0cywgc2V0UHJvZHVjdHNdID0gdXNlU3RhdGUoW10pO1xyXG4gIGNvbnN0IFtvcmRlckNvdW50QnlVc2VyLCBzZXRPcmRlckNvdW50QnlVc2VyXSA9IHVzZVN0YXRlKHt9KTtcclxuICBjb25zdCBbc2Vzc2lvblVzZXIsIHNldFNlc3Npb25Vc2VyXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gIGNvbnN0IFtzdWJtaXR0aW5nLCBzZXRTdWJtaXR0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgY29uc3QgW2Zvcm1EYXRhLCBzZXRGb3JtRGF0YV0gPSB1c2VTdGF0ZSh7XHJcbiAgICB1c2VySWQ6IFwiXCIsXHJcbiAgICBzdGF0dXM6IFwicGVuZGluZ1wiLFxyXG4gICAgcGF5bWVudE1ldGhvZDogXCJDYXJkXCIsXHJcbiAgICBwYXltZW50U3RhdHVzOiBcInBlbmRpbmdcIixcclxuICAgIHRyYW5zYWN0aW9uSWQ6IFwiXCIsXHJcbiAgICBzaGlwcGluZ05hbWU6IFwiXCIsXHJcbiAgICBzaGlwcGluZ1Bob25lOiBcIlwiLFxyXG4gICAgc2hpcHBpbmdBZGRyZXNzOiBcIlwiLFxyXG4gICAgc2hpcHBpbmdNZXRob2Q6IFwiUGlja01lIEZsYXNoXCIsXHJcbiAgICB0cmFja2luZ051bWJlcjogXCJcIixcclxuICAgIHNoaXBwaW5nRmVlOiAwLFxyXG4gICAgdGF4OiAwLFxyXG4gICAgZGlzY291bnQ6IDAsXHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IFtsaW5lSXRlbXMsIHNldExpbmVJdGVtc10gPSB1c2VTdGF0ZShbY3JlYXRlRW1wdHlJdGVtKCldKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICBjb25zdCBwcmVQcm9kdWN0SWQgPSBwYXJhbXMuZ2V0KFwicHJvZHVjdElkXCIpIHx8IFwiXCI7XHJcblxyXG4gICAgY29uc3QgZmV0Y2hEYXRhID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRleHRSZXMgPSBhd2FpdCBmZXRjaChcclxuICAgICAgICAgIGAvYWRtaW4vY29udGV4dC9vcmRlci1jcmVhdGUke1xyXG4gICAgICAgICAgICBwcmVQcm9kdWN0SWQgPyBgP3Byb2R1Y3RJZD0ke2VuY29kZVVSSUNvbXBvbmVudChwcmVQcm9kdWN0SWQpfWAgOiBcIlwiXHJcbiAgICAgICAgICB9YCxcclxuICAgICAgICAgIHsgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiB9LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRleHREYXRhID0gY29udGV4dFJlcy5vayA/IGF3YWl0IGNvbnRleHRSZXMuanNvbigpIDoge307XHJcblxyXG4gICAgICAgIGNvbnN0IHVzZXJzRGF0YSA9IEFycmF5LmlzQXJyYXkoY29udGV4dERhdGE/LnVzZXJzKVxyXG4gICAgICAgICAgPyBjb250ZXh0RGF0YS51c2Vyc1xyXG4gICAgICAgICAgOiBbXTtcclxuICAgICAgICBjb25zdCBwcm9kdWN0c0xpc3QgPSBBcnJheS5pc0FycmF5KGNvbnRleHREYXRhPy5wcm9kdWN0cylcclxuICAgICAgICAgID8gY29udGV4dERhdGEucHJvZHVjdHNcclxuICAgICAgICAgIDogW107XHJcblxyXG4gICAgICAgIHNldFVzZXJzKHVzZXJzRGF0YSk7XHJcbiAgICAgICAgc2V0UHJvZHVjdHMocHJvZHVjdHNMaXN0KTtcclxuICAgICAgICBzZXRPcmRlckNvdW50QnlVc2VyKGNvbnRleHREYXRhPy5vcmRlckNvdW50QnlVc2VyIHx8IHt9KTtcclxuICAgICAgICBzZXRTZXNzaW9uVXNlcihjb250ZXh0RGF0YT8uY3VycmVudFVzZXIgfHwgbnVsbCk7XHJcblxyXG4gICAgICAgIGlmIChjb250ZXh0RGF0YT8uY3VycmVudFVzZXI/LmlkKSB7XHJcbiAgICAgICAgICBzZXRGb3JtRGF0YSgocHJldikgPT4gKHtcclxuICAgICAgICAgICAgLi4ucHJldixcclxuICAgICAgICAgICAgdXNlcklkOiBwcmV2LnVzZXJJZCB8fCBTdHJpbmcoY29udGV4dERhdGEuY3VycmVudFVzZXIuaWQpLFxyXG4gICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHREYXRhPy5zZWxlY3RlZFByb2R1Y3Q/LmlkKSB7XHJcbiAgICAgICAgICBzZXRMaW5lSXRlbXMoW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgcHJvZHVjdElkOiBTdHJpbmcoY29udGV4dERhdGEuc2VsZWN0ZWRQcm9kdWN0LmlkKSxcclxuICAgICAgICAgICAgICBzaXplOiBcIk1cIixcclxuICAgICAgICAgICAgICBxdWFudGl0eTogMSxcclxuICAgICAgICAgICAgICB1bml0UHJpY2U6IHRvTnVtYmVyKGNvbnRleHREYXRhLnNlbGVjdGVkUHJvZHVjdC5wcmljZSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIHByZVByb2R1Y3RJZCAmJlxyXG4gICAgICAgICAgcHJvZHVjdHNMaXN0LnNvbWUoKHApID0+IFN0cmluZyhwLmlkKSA9PT0gU3RyaW5nKHByZVByb2R1Y3RJZCkpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHByb2R1Y3RzTGlzdC5maW5kKFxyXG4gICAgICAgICAgICAocCkgPT4gU3RyaW5nKHAuaWQpID09PSBTdHJpbmcocHJlUHJvZHVjdElkKSxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBzZXRMaW5lSXRlbXMoW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgcHJvZHVjdElkOiBTdHJpbmcocHJlUHJvZHVjdElkKSxcclxuICAgICAgICAgICAgICBzaXplOiBcIk1cIixcclxuICAgICAgICAgICAgICBxdWFudGl0eTogMSxcclxuICAgICAgICAgICAgICB1bml0UHJpY2U6IHRvTnVtYmVyKHNlbGVjdGVkPy5wcmljZSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZmV0Y2hEYXRhKCk7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCBzZWxlY3RlZEN1c3RvbWVyID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICByZXR1cm4gdXNlcnMuZmluZCgodSkgPT4gU3RyaW5nKHUuaWQpID09PSBTdHJpbmcoZm9ybURhdGEudXNlcklkKSkgfHwgbnVsbDtcclxuICB9LCBbdXNlcnMsIGZvcm1EYXRhLnVzZXJJZF0pO1xyXG5cclxuICBjb25zdCBjdXN0b21lck9yZGVyQ291bnQgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGlmICghc2VsZWN0ZWRDdXN0b21lcikge1xyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gTnVtYmVyKG9yZGVyQ291bnRCeVVzZXJbU3RyaW5nKHNlbGVjdGVkQ3VzdG9tZXIuaWQpXSB8fCAwKTtcclxuICB9LCBbb3JkZXJDb3VudEJ5VXNlciwgc2VsZWN0ZWRDdXN0b21lcl0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKCFzZWxlY3RlZEN1c3RvbWVyKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRGb3JtRGF0YSgocHJldikgPT4gKHtcclxuICAgICAgLi4ucHJldixcclxuICAgICAgc2hpcHBpbmdOYW1lOiBwcmV2LnNoaXBwaW5nTmFtZSB8fCBzZWxlY3RlZEN1c3RvbWVyLm5hbWUgfHwgXCJcIixcclxuICAgICAgc2hpcHBpbmdQaG9uZTpcclxuICAgICAgICBwcmV2LnNoaXBwaW5nUGhvbmUgfHxcclxuICAgICAgICBzZWxlY3RlZEN1c3RvbWVyLnBob25lIHx8XHJcbiAgICAgICAgc2VsZWN0ZWRDdXN0b21lci5tb2JpbGUgfHxcclxuICAgICAgICBcIlwiLFxyXG4gICAgfSkpO1xyXG4gIH0sIFtzZWxlY3RlZEN1c3RvbWVyXSk7XHJcblxyXG4gIGNvbnN0IGxpbmVUb3RhbHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IHN1YnRvdGFsID0gbGluZUl0ZW1zLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiB7XHJcbiAgICAgIHJldHVybiBzdW0gKyB0b051bWJlcihpdGVtLnF1YW50aXR5KSAqIHRvTnVtYmVyKGl0ZW0udW5pdFByaWNlKTtcclxuICAgIH0sIDApO1xyXG5cclxuICAgIGNvbnN0IHNoaXBwaW5nRmVlID0gdG9OdW1iZXIoZm9ybURhdGEuc2hpcHBpbmdGZWUpO1xyXG4gICAgY29uc3QgdGF4ID0gdG9OdW1iZXIoZm9ybURhdGEudGF4KTtcclxuICAgIGNvbnN0IGRpc2NvdW50ID0gdG9OdW1iZXIoZm9ybURhdGEuZGlzY291bnQpO1xyXG4gICAgY29uc3QgZ3JhbmRUb3RhbCA9IE1hdGgubWF4KHN1YnRvdGFsICsgc2hpcHBpbmdGZWUgKyB0YXggLSBkaXNjb3VudCwgMCk7XHJcblxyXG4gICAgcmV0dXJuIHsgc3VidG90YWwsIHNoaXBwaW5nRmVlLCB0YXgsIGRpc2NvdW50LCBncmFuZFRvdGFsIH07XHJcbiAgfSwgW2xpbmVJdGVtcywgZm9ybURhdGEuc2hpcHBpbmdGZWUsIGZvcm1EYXRhLnRheCwgZm9ybURhdGEuZGlzY291bnRdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlRm9ybUNoYW5nZSA9IChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgeyBuYW1lLCB2YWx1ZSB9ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgc2V0Rm9ybURhdGEoKHByZXYpID0+ICh7IC4uLnByZXYsIFtuYW1lXTogdmFsdWUgfSkpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZUxpbmVJdGVtQ2hhbmdlID0gKGluZGV4LCBrZXksIHZhbHVlKSA9PiB7XHJcbiAgICBzZXRMaW5lSXRlbXMoKHByZXYpID0+IHtcclxuICAgICAgY29uc3QgbmV4dCA9IFsuLi5wcmV2XTtcclxuICAgICAgY29uc3QgaXRlbSA9IHsgLi4ubmV4dFtpbmRleF0gfTtcclxuXHJcbiAgICAgIGlmIChrZXkgPT09IFwicHJvZHVjdElkXCIpIHtcclxuICAgICAgICBpdGVtLnByb2R1Y3RJZCA9IHZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyh2YWx1ZSkpO1xyXG4gICAgICAgIGl0ZW0udW5pdFByaWNlID0gdG9OdW1iZXIocHJvZHVjdD8ucHJpY2UpO1xyXG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJzaXplXCIpIHtcclxuICAgICAgICBpdGVtLnNpemUgPSB2YWx1ZTtcclxuICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwicXVhbnRpdHlcIikge1xyXG4gICAgICAgIGl0ZW0ucXVhbnRpdHkgPSBNYXRoLm1heCgxLCB0b051bWJlcih2YWx1ZSkpO1xyXG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJ1bml0UHJpY2VcIikge1xyXG4gICAgICAgIGl0ZW0udW5pdFByaWNlID0gTWF0aC5tYXgoMCwgdG9OdW1iZXIodmFsdWUpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbmV4dFtpbmRleF0gPSBpdGVtO1xyXG4gICAgICByZXR1cm4gbmV4dDtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGFkZExpbmVJdGVtID0gKCkgPT4ge1xyXG4gICAgc2V0TGluZUl0ZW1zKChwcmV2KSA9PiBbLi4ucHJldiwgY3JlYXRlRW1wdHlJdGVtKCldKTtcclxuICB9O1xyXG5cclxuICBjb25zdCByZW1vdmVMaW5lSXRlbSA9IChpbmRleCkgPT4ge1xyXG4gICAgc2V0TGluZUl0ZW1zKChwcmV2KSA9PiB7XHJcbiAgICAgIGlmIChwcmV2Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBwcmV2O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcHJldi5maWx0ZXIoKF8sIGkpID0+IGkgIT09IGluZGV4KTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG1hcHNIcmVmID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBpZiAoIWZvcm1EYXRhLnNoaXBwaW5nQWRkcmVzcz8udHJpbSgpKSB7XHJcbiAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBgaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9tYXBzL3NlYXJjaC8/YXBpPTEmcXVlcnk9JHtlbmNvZGVVUklDb21wb25lbnQoZm9ybURhdGEuc2hpcHBpbmdBZGRyZXNzLnRyaW0oKSl9YDtcclxuICB9LCBbZm9ybURhdGEuc2hpcHBpbmdBZGRyZXNzXSk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZVN1Ym1pdCA9IGFzeW5jIChldmVudCkgPT4ge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBjb25zdCB2YWxpZEl0ZW1zID0gbGluZUl0ZW1zLmZpbHRlcihcclxuICAgICAgKGl0ZW0pID0+IGl0ZW0ucHJvZHVjdElkICYmIHRvTnVtYmVyKGl0ZW0ucXVhbnRpdHkpID4gMCxcclxuICAgICk7XHJcblxyXG4gICAgaWYgKCFmb3JtRGF0YS51c2VySWQpIHtcclxuICAgICAgYWxlcnQoXCJQbGVhc2Ugc2VsZWN0IGEgY3VzdG9tZXIuXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZhbGlkSXRlbXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGFsZXJ0KFwiQXQgbGVhc3Qgb25lIHByb2R1Y3QgbGluZSBpdGVtIGlzIHJlcXVpcmVkLlwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFN1Ym1pdHRpbmcodHJ1ZSk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgb3JkZXJQYXlsb2FkID0ge1xyXG4gICAgICAgIHVzZXJJZDogTnVtYmVyKGZvcm1EYXRhLnVzZXJJZCksXHJcbiAgICAgICAgc3RhdHVzOiBmb3JtRGF0YS5zdGF0dXMsXHJcbiAgICAgICAgcGF5bWVudE1ldGhvZDogZm9ybURhdGEucGF5bWVudE1ldGhvZCxcclxuICAgICAgICBwYXltZW50U3RhdHVzOiBmb3JtRGF0YS5wYXltZW50U3RhdHVzLFxyXG4gICAgICAgIHRyYW5zYWN0aW9uSWQ6IGZvcm1EYXRhLnRyYW5zYWN0aW9uSWQgfHwgbnVsbCxcclxuICAgICAgICBzaGlwcGluZ05hbWU6IGZvcm1EYXRhLnNoaXBwaW5nTmFtZSB8fCBudWxsLFxyXG4gICAgICAgIHNoaXBwaW5nUGhvbmU6IGZvcm1EYXRhLnNoaXBwaW5nUGhvbmUgfHwgbnVsbCxcclxuICAgICAgICBzaGlwcGluZ01ldGhvZDogZm9ybURhdGEuc2hpcHBpbmdNZXRob2QsXHJcbiAgICAgICAgdHJhY2tpbmdOdW1iZXI6IGZvcm1EYXRhLnRyYWNraW5nTnVtYmVyIHx8IG51bGwsXHJcbiAgICAgICAgc3VidG90YWw6IGxpbmVUb3RhbHMuc3VidG90YWwudG9GaXhlZCgyKSxcclxuICAgICAgICBzaGlwcGluZ0ZlZTogbGluZVRvdGFscy5zaGlwcGluZ0ZlZS50b0ZpeGVkKDIpLFxyXG4gICAgICAgIHRheDogbGluZVRvdGFscy50YXgudG9GaXhlZCgyKSxcclxuICAgICAgICBkaXNjb3VudDogbGluZVRvdGFscy5kaXNjb3VudC50b0ZpeGVkKDIpLFxyXG4gICAgICAgIHRvdGFsQW1vdW50OiBsaW5lVG90YWxzLmdyYW5kVG90YWwudG9GaXhlZCgyKSxcclxuICAgICAgICBzaGlwcGluZ0FkZHJlc3M6IGZvcm1EYXRhLnNoaXBwaW5nQWRkcmVzcyB8fCBudWxsLFxyXG4gICAgICAgIGxpbmVJdGVtczogdmFsaWRJdGVtcy5tYXAoKGl0ZW0pID0+ICh7XHJcbiAgICAgICAgICBwcm9kdWN0SWQ6IE51bWJlcihpdGVtLnByb2R1Y3RJZCksXHJcbiAgICAgICAgICBzaXplOiBpdGVtLnNpemUgfHwgbnVsbCxcclxuICAgICAgICAgIHF1YW50aXR5OiBNYXRoLm1heCgxLCB0b051bWJlcihpdGVtLnF1YW50aXR5KSksXHJcbiAgICAgICAgICB1bml0UHJpY2U6IE1hdGgubWF4KDAsIHRvTnVtYmVyKGl0ZW0udW5pdFByaWNlKSkudG9GaXhlZCgyKSxcclxuICAgICAgICB9KSksXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBzdWJtaXRGb3JtID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgIHN1Ym1pdEZvcm0uYXBwZW5kKFwicGF5bG9hZFwiLCBKU09OLnN0cmluZ2lmeShvcmRlclBheWxvYWQpKTtcclxuXHJcbiAgICAgIGNvbnN0IG9yZGVyUmVzID0gYXdhaXQgZmV0Y2goXCIvYWRtaW4vY29udGV4dC9vcmRlci1jcmVhdGUvc3VibWl0XCIsIHtcclxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXHJcbiAgICAgICAgYm9keTogc3VibWl0Rm9ybSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBvcmRlckRhdGEgPSBhd2FpdCBvcmRlclJlcy5qc29uKCk7XHJcbiAgICAgIGlmICghb3JkZXJSZXMub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3Iob3JkZXJEYXRhPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGNyZWF0ZSBvcmRlclwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihcclxuICAgICAgICBgL2FkbWluL3Jlc291cmNlcy9PcmRlcnMvcmVjb3Jkcy8ke29yZGVyRGF0YS5pZH0vc2hvd2AsXHJcbiAgICAgICk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBhbGVydChlcnJvci5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGNyZWF0ZSBvcmRlclwiKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNldFN1Ym1pdHRpbmcoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+e3Jlc3BvbnNpdmVDc3N9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2hlYWRlclN0eWxlfT5cclxuICAgICAgICA8aDEgc3R5bGU9e3RpdGxlU3R5bGV9PkNyZWF0ZSBOZXcgT3JkZXI8L2gxPlxyXG4gICAgICAgIDxwIHN0eWxlPXtkZXNjU3R5bGV9PlxyXG4gICAgICAgICAgQ3VzdG9tZXIgZGV0YWlscywgbGluZSBpdGVtcywgcGF5bWVudCwgc2hpcHBpbmcsIGFuZCB0b3RhbHMgaW4gb25lXHJcbiAgICAgICAgICBndWlkZWQgZmxvdy5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0gc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCIxNnB4XCIgfX0+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWxheW91dFwiIHN0eWxlPXtsYXlvdXRTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGFja1N0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5DdXN0b21lciBEZXRhaWxzPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TZWxlY3QgQ3VzdG9tZXIgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJ1c2VySWRcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudXNlcklkfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtsb2FkaW5nIHx8IHNlc3Npb25Vc2VyPy5yb2xlID09PSBcInVzZXJcIn1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtsb2FkaW5nID8gXCJMb2FkaW5nIGN1c3RvbWVycy4uLlwiIDogXCJTZWxlY3QgYSBjdXN0b21lclwifVxyXG4gICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAge3VzZXJzLm1hcCgodXNlcikgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXt1c2VyLmlkfSB2YWx1ZT17dXNlci5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICB7dXNlci5uYW1lfSAoI3t1c2VyLmlkfSlcclxuICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVySW5mb1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVyUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+Q3VzdG9tZXIgTmFtZSAmIElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17c3Ryb25nU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZEN1c3RvbWVyXHJcbiAgICAgICAgICAgICAgICAgICAgICA/IGAke3NlbGVjdGVkQ3VzdG9tZXIubmFtZX0gKCMke3NlbGVjdGVkQ3VzdG9tZXIuaWR9KWBcclxuICAgICAgICAgICAgICAgICAgICAgIDogXCItXCJ9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5FbWFpbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0cm9uZ1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRDdXN0b21lcj8uZW1haWwgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5QaG9uZSBOdW1iZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtzdHJvbmdTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkQ3VzdG9tZXI/LnBob25lIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEN1c3RvbWVyPy5tb2JpbGUgfHxcclxuICAgICAgICAgICAgICAgICAgICAgIFwiTm90IGF2YWlsYWJsZVwifVxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVyUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+T3JkZXIgSGlzdG9yeTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0cm9uZ1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICB7Y3VzdG9tZXJPcmRlckNvdW50fSBwcmV2aW91cyBvcmRlcnNcclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5QYXltZW50ICYgQmlsbGluZzwvaDI+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+UGF5bWVudCBPcHRpb25zPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3BheW1lbnRPcHRpb25HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICB7cGF5bWVudE9wdGlvbnMubWFwKChvcHRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmUgPSBmb3JtRGF0YS5wYXltZW50TWV0aG9kID09PSBvcHRpb24udmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17b3B0aW9uLnZhbHVlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3BheW1lbnRPcHRpb25TdHlsZShhY3RpdmUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNldEZvcm1EYXRhKChwcmV2KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ucHJldixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheW1lbnRNZXRob2Q6IG9wdGlvbi52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57b3B0aW9uLmljb259PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57b3B0aW9uLmxhYmVsfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMCB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItZ3JpZC0yXCIgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNlbGVjdGVkIE1ldGhvZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5wYXltZW50TWV0aG9kfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlYWRPbmx5XHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+UGF5bWVudCBTdGF0dXM8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInBheW1lbnRTdGF0dXNcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5wYXltZW50U3RhdHVzfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBlbmRpbmdcIj5QZW5kaW5nPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBhaWRcIj5QYWlkPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMCB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlRyYW5zYWN0aW9uIElEPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICBuYW1lPVwidHJhbnNhY3Rpb25JZFwiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS50cmFuc2FjdGlvbklkfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZS5nLiBUWE4tMjAyNi0wMDAxMjRcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGFja1N0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICBnYXA6IFwiOHB4XCIsXHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxoMiBzdHlsZT17eyAuLi5zZWN0aW9uVGl0bGVTdHlsZSwgbWFyZ2luQm90dG9tOiAwIH19PlxyXG4gICAgICAgICAgICAgICAgICBQcm9kdWN0IExpbmUgSXRlbXMgKFJlcXVpcmVkKVxyXG4gICAgICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2FkZExpbmVJdGVtfVxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17YWRkQnV0dG9uU3R5bGV9XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICsgQWRkIEl0ZW1cclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTIgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ2FwOiBcIjEwcHhcIiB9fT5cclxuICAgICAgICAgICAgICAgIHtsaW5lSXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZFByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKFxyXG4gICAgICAgICAgICAgICAgICAgIChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhpdGVtLnByb2R1Y3RJZCksXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1Ub3RhbCA9XHJcbiAgICAgICAgICAgICAgICAgICAgdG9OdW1iZXIoaXRlbS5xdWFudGl0eSkgKiB0b051bWJlcihpdGVtLnVuaXRQcmljZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtgbGluZS1pdGVtLSR7aW5kZXh9YH0gc3R5bGU9e2xpbmVJdGVtUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17bGluZUl0ZW1Ub3BTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlByb2R1Y3Q8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnByb2R1Y3RJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxpbmVJdGVtQ2hhbmdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicHJvZHVjdElkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjdCBwcm9kdWN0PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdHMubWFwKChwcm9kdWN0KSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtwcm9kdWN0LmlkfSB2YWx1ZT17cHJvZHVjdC5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3Byb2R1Y3QubmFtZX0gKFNLVToge3Byb2R1Y3Quc2t1fSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3JlbW92ZUJ1dHRvblN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHJlbW92ZUxpbmVJdGVtKGluZGV4KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlbW92ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Byb2R1Y3RQcmV2aWV3U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRQcm9kdWN0Py5pbWFnZVVybCA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM9e3NlbGVjdGVkUHJvZHVjdC5pbWFnZVVybH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdD17c2VsZWN0ZWRQcm9kdWN0Lm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmltYWdlU3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCIzcHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogXCIxNHB4XCIsIGNvbG9yOiBcIiNmOGZhZmNcIiB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZFByb2R1Y3Q/Lm5hbWUgfHwgXCJTZWxlY3QgYSBwcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IFwiMTJweFwiLCBjb2xvcjogXCIjOTRhM2I4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTS1UvSUQ6e1wiIFwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGAke3NlbGVjdGVkUHJvZHVjdC5za3V9IC8gIyR7c2VsZWN0ZWRQcm9kdWN0LmlkfWBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIi1cIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IFwiMTJweFwiLCBjb2xvcjogXCIjY2JkNWUxXCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaXplOiB7aXRlbS5zaXplIHx8IFwiLVwifSB8IFF0eToge2l0ZW0ucXVhbnRpdHl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TaXplPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnNpemUgfHwgXCJNXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxpbmVJdGVtQ2hhbmdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaXplXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7aXRlbVNpemVPcHRpb25zLm1hcCgoc2l6ZU9wdGlvbikgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e3NpemVPcHRpb259IHZhbHVlPXtzaXplT3B0aW9ufT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NpemVPcHRpb259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItZ3JpZC0yXCIgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5RdWFudGl0eTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2l0ZW0ucXVhbnRpdHl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVMaW5lSXRlbUNoYW5nZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInF1YW50aXR5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlVuaXQgUHJpY2U8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnVuaXRQcmljZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxpbmVJdGVtQ2hhbmdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidW5pdFByaWNlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLi4udG90YWxzUm93U3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nQm90dG9tOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+TGluZSBUb3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdE1vbmV5KGl0ZW1Ub3RhbCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlNoaXBwaW5nICYgVHJhY2tpbmc8L2gyPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItZ3JpZC0yXCIgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIENvbnRhY3QgTmFtZSAqPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nTmFtZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnNoaXBwaW5nTmFtZX1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlJlY2VpdmVyIGZ1bGwgbmFtZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIFBob25lIE51bWJlciAqPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nUGhvbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5zaGlwcGluZ1Bob25lfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMDdYIFhYWCBYWFhYXCJcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMCB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIEFkZHJlc3MgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWFcclxuICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nQWRkcmVzc1wiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3N9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLmlucHV0U3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWluSGVpZ2h0OiBcIjg2cHhcIixcclxuICAgICAgICAgICAgICAgICAgICByZXNpemU6IFwidmVydGljYWxcIixcclxuICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJIb3VzZSBudW1iZXIsIHN0cmVldCwgY2l0eSwgcG9zdGFsIGNvZGVcIlxyXG4gICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIHttYXBzSHJlZiA/IChcclxuICAgICAgICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgICAgICBocmVmPXttYXBzSHJlZn1cclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXttYXBMaW5rU3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICBPcGVuIG9uIEdvb2dsZSBNYXBzXHJcbiAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICkgOiBudWxsfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWdyaWQtMlwiIHN0eWxlPXtncmlkMlN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TaGlwcGluZyBNZXRob2Q8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nTWV0aG9kXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuc2hpcHBpbmdNZXRob2R9XHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICB7c2hpcHBpbmdNZXRob2RzLm1hcCgoaXRlbSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2l0ZW19IHZhbHVlPXtpdGVtfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW19XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5UcmFja2luZyBOdW1iZXI8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwidHJhY2tpbmdOdW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS50cmFja2luZ051bWJlcn1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlRSSy1YWFhYWFhcIlxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5PcmRlciBTdW1tYXJ5IC8gVG90YWxzPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWdyaWQtMlwiIHN0eWxlPXtncmlkMlN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TaGlwcGluZyBGZWU8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nRmVlXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuc2hpcHBpbmdGZWV9XHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5UYXggLyBWQVQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInRheFwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnRheH1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5EaXNjb3VudCAvIENvdXBvbjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcclxuICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJkaXNjb3VudFwiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5kaXNjb3VudH1cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5TdWJ0b3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGxpbmVUb3RhbHMuc3VidG90YWwpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5TaGlwcGluZyBGZWU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leShsaW5lVG90YWxzLnNoaXBwaW5nRmVlKX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbHNSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+VGF4IC8gVkFUPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkobGluZVRvdGFscy50YXgpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5EaXNjb3VudDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmc+LSB7Zm9ybWF0TW9uZXkobGluZVRvdGFscy5kaXNjb3VudCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj5HcmFuZCBUb3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuPntmb3JtYXRNb25leShsaW5lVG90YWxzLmdyYW5kVG90YWwpfTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c2VjdXJpdHlDaGlwV3JhcFN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3NlY3VyaXR5Q2hpcFN0eWxlfT5TZWN1cmUgUGF5bWVudCBQcm90ZWN0ZWQ8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3NlY3VyaXR5Q2hpcFN0eWxlfT5FbmNyeXB0ZWQgQ2hlY2tvdXQgQ2hhbm5lbDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c2VjdXJpdHlDaGlwU3R5bGV9PlRydXN0ZWQgRGVsaXZlcnkgVHJhY2tpbmc8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyAuLi5jYXJkU3R5bGUsIHBhZGRpbmdUb3A6IFwiMTRweFwiIH19PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17YWN0aW9uQmFyU3R5bGV9PlxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgc3R5bGU9e2FjdGlvbkJ1dHRvblN0eWxlKGZhbHNlKX1cclxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB3aW5kb3cuaGlzdG9yeS5iYWNrKCl9XHJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICBDYW5jZWxcclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcclxuICAgICAgICAgICAgICBzdHlsZT17YWN0aW9uQnV0dG9uU3R5bGUodHJ1ZSl9XHJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICB7c3VibWl0dGluZyA/IFwiQ3JlYXRpbmcgT3JkZXIuLi5cIiA6IFwiQ3JlYXRlIE9yZGVyXCJ9XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZm9ybT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlckNyZWF0ZTtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHBhZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG4gIGNvbG9yOiBcIiNlMmU4ZjBcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMThweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIpXCIsXHJcbiAgYmFja2dyb3VuZDpcclxuICAgIFwibGluZWFyLWdyYWRpZW50KDE1NWRlZywgcmdiYSgxMCwgMjMsIDQ4LCAwLjk0KSAwJSwgcmdiYSg4LCAxOCwgMzgsIDAuOTQpIDEwMCUpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTRweCAzMHB4IHJnYmEoMiwgNiwgMjMsIDAuMilcIixcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGhlYWRlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBoZWFkaW5nU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBmb250U2l6ZTogXCIzNHB4XCIsXHJcbiAgbGluZUhlaWdodDogMS4xLFxyXG59O1xyXG5cclxuY29uc3Qgc3ViVGV4dFN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgbWFyZ2luVG9wOiBcIjRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IChzdGF0dXMpID0+IHtcclxuICBjb25zdCB2YWwgPSBTdHJpbmcoc3RhdHVzIHx8IFwicGVuZGluZ1wiKS50b0xvd2VyQ2FzZSgpO1xyXG4gIGNvbnN0IHN0eWxlQnlTdGF0dXMgPSB7XHJcbiAgICBwZW5kaW5nOiB7IGJnOiBcIiNmZWYzYzdcIiwgZmc6IFwiIzdjMmQxMlwiIH0sXHJcbiAgICBwYWlkOiB7IGJnOiBcIiNiYmY3ZDBcIiwgZmc6IFwiIzE0NTMyZFwiIH0sXHJcbiAgICBwcm9jZXNzaW5nOiB7IGJnOiBcIiNiZmRiZmVcIiwgZmc6IFwiIzFlM2E4YVwiIH0sXHJcbiAgICBzaGlwcGVkOiB7IGJnOiBcIiNkZGQ2ZmVcIiwgZmc6IFwiIzRjMWQ5NVwiIH0sXHJcbiAgICBjb21wbGV0ZWQ6IHsgYmc6IFwiI2E3ZjNkMFwiLCBmZzogXCIjMDY0ZTNiXCIgfSxcclxuICAgIGNhbmNlbGxlZDogeyBiZzogXCIjZmVjYWNhXCIsIGZnOiBcIiM3ZjFkMWRcIiB9LFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNlbGVjdGVkID0gc3R5bGVCeVN0YXR1c1t2YWxdIHx8IHN0eWxlQnlTdGF0dXMucGVuZGluZztcclxuICByZXR1cm4ge1xyXG4gICAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gICAgcGFkZGluZzogXCI2cHggMTJweFwiLFxyXG4gICAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxyXG4gICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICAgIGJhY2tncm91bmQ6IHNlbGVjdGVkLmJnLFxyXG4gICAgY29sb3I6IHNlbGVjdGVkLmZnLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uVGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiMCAwIDEycHggMFwiLFxyXG4gIGNvbG9yOiBcIiNmNWRmOTBcIixcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMWVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxufTtcclxuXHJcbmNvbnN0IGdyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgzMDBweCwgMWZyKSBtaW5tYXgoMzIwcHgsIDFmcilcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0dyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI4cHhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0YWJsZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBsaW5lSXRlbVN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgcGFkZGluZzogXCIxMHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNDQpXCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCI2MHB4IDFmciBhdXRvXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2MHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjYwcHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG59O1xyXG5cclxuY29uc3QgdG90YWxCb3hTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0b3RhbFJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI3cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGdyYW5kU3R5bGUgPSB7XHJcbiAgLi4udG90YWxSb3dTdHlsZSxcclxuICBib3JkZXJCb3R0b206IFwibm9uZVwiLFxyXG4gIHBhZGRpbmdUb3A6IFwiNnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGZvbnRTaXplOiBcIjE4cHhcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBlbXB0eVN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggZGFzaGVkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdE1vbmV5ID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgbiA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gYFJzLiAke24udG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSl9YDtcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUpID0+IHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gXCItXCI7XHJcbiAgfVxyXG5cclxuICBjb25zdCBkdCA9IG5ldyBEYXRlKHZhbHVlKTtcclxuICBpZiAoTnVtYmVyLmlzTmFOKGR0LmdldFRpbWUoKSkpIHtcclxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGR0LnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgZGF0ZVN0eWxlOiBcIm1lZGl1bVwiLFxyXG4gICAgdGltZVN0eWxlOiBcInNob3J0XCIsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBPcmRlclNob3cgPSAoeyByZWNvcmQgfSkgPT4ge1xyXG4gIGNvbnN0IFtkZXRhaWxzLCBzZXREZXRhaWxzXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIGNvbnN0IG9yZGVySWQgPSByZWNvcmQ/LnBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZDtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghb3JkZXJJZCkge1xyXG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgc2V0RXJyb3IoXCJPcmRlciBpZCBub3QgZm91bmRcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsb2FkRGV0YWlscyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBzZXRFcnJvcihcIlwiKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9jb250ZXh0L29yZGVycy8ke2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcob3JkZXJJZCkpfS9kZXRhaWxzYCxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZD8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGRldGFpbHNcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXREZXRhaWxzKHBheWxvYWQpO1xyXG4gICAgICB9IGNhdGNoIChmZXRjaEVycm9yKSB7XHJcbiAgICAgICAgc2V0RXJyb3IoZmV0Y2hFcnJvcj8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGRldGFpbHNcIik7XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbG9hZERldGFpbHMoKTtcclxuICB9LCBbb3JkZXJJZF0pO1xyXG5cclxuICBjb25zdCB0b3RhbHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IHN1YnRvdGFsID0gTnVtYmVyKGRldGFpbHM/LnN1YnRvdGFsIHx8IDApO1xyXG4gICAgY29uc3Qgc2hpcHBpbmdGZWUgPSBOdW1iZXIoZGV0YWlscz8uc2hpcHBpbmdGZWUgfHwgMCk7XHJcbiAgICBjb25zdCB0YXggPSBOdW1iZXIoZGV0YWlscz8udGF4IHx8IDApO1xyXG4gICAgY29uc3QgZGlzY291bnQgPSBOdW1iZXIoZGV0YWlscz8uZGlzY291bnQgfHwgMCk7XHJcbiAgICBjb25zdCB0b3RhbEFtb3VudCA9IE51bWJlcihkZXRhaWxzPy50b3RhbEFtb3VudCB8fCAwKTtcclxuXHJcbiAgICByZXR1cm4geyBzdWJ0b3RhbCwgc2hpcHBpbmdGZWUsIHRheCwgZGlzY291bnQsIHRvdGFsQW1vdW50IH07XHJcbiAgfSwgW2RldGFpbHNdKTtcclxuXHJcbiAgaWYgKGxvYWRpbmcpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5Mb2FkaW5nIG9yZGVyIGRldGFpbHMuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT57ZXJyb3J9PC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKCFkZXRhaWxzKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+T3JkZXIgZGV0YWlscyBub3QgYXZhaWxhYmxlLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+e2BAbWVkaWEgKG1heC13aWR0aDogMTA0MHB4KSB7IC5jaGFuZ2U4LW9yZGVyLXNob3ctZ3JpZCB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7IH0gfWB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17aGVhZGVyU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGgxIHN0eWxlPXtoZWFkaW5nU3R5bGV9Pk9yZGVyICN7ZGV0YWlscy5pZH08L2gxPlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdWJUZXh0U3R5bGV9PlxyXG4gICAgICAgICAgICAgIENyZWF0ZWQge2Zvcm1hdERhdGUoZGV0YWlscy5jcmVhdGVkQXQpfSB8IFVwZGF0ZWR7XCIgXCJ9XHJcbiAgICAgICAgICAgICAge2Zvcm1hdERhdGUoZGV0YWlscy51cGRhdGVkQXQpfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9e2JhZGdlU3R5bGUoZGV0YWlscy5zdGF0dXMpfT5cclxuICAgICAgICAgICAge2RldGFpbHMuc3RhdHVzIHx8IFwicGVuZGluZ1wifVxyXG4gICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1zaG93LWdyaWRcIiBzdHlsZT17Z3JpZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+Q3VzdG9tZXIgJiBTaGlwcGluZzwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+Q3VzdG9tZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8udXNlcj8ubmFtZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlNoaXBwaW5nIENvbnRhY3Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8uc2hpcHBpbmdOYW1lIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgUGhvbmU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8uc2hpcHBpbmdQaG9uZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkVtYWlsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnVzZXI/LmVtYWlsIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UGF5bWVudCBNZXRob2Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8ucGF5bWVudE1ldGhvZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlBheW1lbnQgU3RhdHVzPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnBheW1lbnRTdGF0dXMgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5UcmFuc2FjdGlvbiBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy50cmFuc2FjdGlvbklkIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgTWV0aG9kPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnNoaXBwaW5nTWV0aG9kIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VHJhY2tpbmcgTnVtYmVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnRyYWNraW5nTnVtYmVyIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiBcIjEzcHhcIiwgY29sb3I6IFwiI2NiZDVlMVwiLCBsaW5lSGVpZ2h0OiAxLjYgfX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiLCBtYXJnaW5Cb3R0b206IFwiNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICBTaGlwcGluZyBBZGRyZXNzXHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIgfX0+XHJcbiAgICAgICAgICAgICAgICB7ZGV0YWlscz8uc2hpcHBpbmdBZGRyZXNzIHx8IFwiLVwifVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+T3JkZXIgU3VtbWFyeSAvIFRvdGFsczwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbEJveFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlN1YnRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KHRvdGFscy5zdWJ0b3RhbCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgRmVlPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KHRvdGFscy5zaGlwcGluZ0ZlZSl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VGF4IC8gVkFUPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KHRvdGFscy50YXgpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkRpc2NvdW50PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+LSB7Zm9ybWF0TW9uZXkodG90YWxzLmRpc2NvdW50KX08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2dyYW5kU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuPkdyYW5kIFRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuPntmb3JtYXRNb25leSh0b3RhbHMudG90YWxBbW91bnQpfTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlByb2R1Y3QgTGluZSBJdGVtczwvaDI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17dGFibGVTdHlsZX0+XHJcbiAgICAgICAgICB7KGRldGFpbHM/Lml0ZW1zIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9Pk5vIGxpbmUgaXRlbXMgaW4gdGhpcyBvcmRlci48L2Rpdj5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgIChkZXRhaWxzLml0ZW1zIHx8IFtdKS5tYXAoKGl0ZW0pID0+IChcclxuICAgICAgICAgICAgICA8ZGl2IGtleT17aXRlbS5pZH0gc3R5bGU9e2xpbmVJdGVtU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAge2l0ZW0/LnByb2R1Y3Q/LmltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjPXtpdGVtLnByb2R1Y3QuaW1hZ2VVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgYWx0PXtpdGVtPy5wcm9kdWN0Py5uYW1lIHx8IFwiUHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbWFnZVN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAuLi5pbWFnZVN0eWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIE5vIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZ3JpZFwiLCBnYXA6IFwiNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAge2l0ZW0/LnByb2R1Y3Q/Lm5hbWUgfHwgXCJVbm5hbWVkIHByb2R1Y3RcIn1cclxuICAgICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIFNLVToge2l0ZW0/LnByb2R1Y3Q/LnNrdSB8fCBcIi1cIn0gfCBQcm9kdWN0IElEOiAjXHJcbiAgICAgICAgICAgICAgICAgICAge2l0ZW0/LnByb2R1Y3RJZH1cclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjY2JkNWUxXCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICBTaXplOiB7aXRlbT8uc2l6ZSB8fCBcIi1cIn0gfCBRdHk6IHtpdGVtLnF1YW50aXR5fSB4e1wiIFwifVxyXG4gICAgICAgICAgICAgICAgICAgIHtmb3JtYXRNb25leShpdGVtLnVuaXRQcmljZSl9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNXB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgIHtmb3JtYXRNb25leShpdGVtLnRvdGFsUHJpY2UpfVxyXG4gICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlclNob3c7XHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgcGFnZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbiAgY29sb3I6IFwiI2UyZThmMFwiLFxyXG59O1xyXG5cclxuY29uc3QgY2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxOHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMilcIixcclxuICBiYWNrZ3JvdW5kOlxyXG4gICAgXCJsaW5lYXItZ3JhZGllbnQoMTU1ZGVnLCByZ2JhKDEwLCAyMywgNDgsIDAuOTQpIDAlLCByZ2JhKDgsIDE4LCAzOCwgMC45NCkgMTAwJSlcIixcclxuICBib3hTaGFkb3c6IFwiMCAxNHB4IDMwcHggcmdiYSgyLCA2LCAyMywgMC4yKVwiLFxyXG4gIHBhZGRpbmc6IFwiMThweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaGVhZGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IHRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcIjM0cHhcIixcclxuICBsaW5lSGVpZ2h0OiAxLjEsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3Qgc3VidGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiNnB4IDAgMCAwXCIsXHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGJhZGdlU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICBwYWRkaW5nOiBcIjZweCAxMnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgY29sb3I6IFwiIzE0NTMyZFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2JiZjdkMFwiLFxyXG59O1xyXG5cclxuY29uc3QgZ3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwibWlubWF4KDMwMHB4LCAwLjk1ZnIpIG1pbm1heCgzMjBweCwgMS4wNWZyKVwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uVGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiMCAwIDEycHggMFwiLFxyXG4gIGNvbG9yOiBcIiNmNWRmOTBcIixcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMWVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9HcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb1Jvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiOHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjI4MHB4XCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE0cHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yMilcIixcclxufTtcclxuXHJcbmNvbnN0IGxpbmVJdGVtU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCI4NHB4IDFmciBhdXRvXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIHBhZGRpbmc6IFwiMTJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMilcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTUsIDIzLCA0MiwgMC40NClcIixcclxufTtcclxuXHJcbmNvbnN0IGVtcHR5SW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI4NHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjg0cHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxufTtcclxuXHJcbmNvbnN0IHRvdGFsUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjdweFwiLFxyXG59O1xyXG5cclxuY29uc3QgZ3JhbmRTdHlsZSA9IHtcclxuICAuLi50b3RhbFJvd1N0eWxlLFxyXG4gIGJvcmRlckJvdHRvbTogXCJub25lXCIsXHJcbiAgcGFkZGluZ1RvcDogXCI2cHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgZm9udFNpemU6IFwiMThweFwiLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IGVtcHR5U3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgcGFkZGluZzogXCIxNHB4XCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0TW9uZXkgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBuID0gTnVtYmVyKHZhbHVlIHx8IDApO1xyXG4gIHJldHVybiBgUnMuICR7bi50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiBcIi1cIjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGR0ID0gbmV3IERhdGUodmFsdWUpO1xyXG4gIGlmIChOdW1iZXIuaXNOYU4oZHQuZ2V0VGltZSgpKSkge1xyXG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZHQudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBkYXRlU3R5bGU6IFwibWVkaXVtXCIsXHJcbiAgICB0aW1lU3R5bGU6IFwic2hvcnRcIixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IE9yZGVySXRlbVNob3cgPSAoeyByZWNvcmQgfSkgPT4ge1xyXG4gIGNvbnN0IFtkZXRhaWxzLCBzZXREZXRhaWxzXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIGNvbnN0IG9yZGVySXRlbUlkID0gcmVjb3JkPy5wYXJhbXM/LmlkIHx8IHJlY29yZD8uaWQ7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoIW9yZGVySXRlbUlkKSB7XHJcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICBzZXRFcnJvcihcIk9yZGVyIGl0ZW0gaWQgbm90IGZvdW5kXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbG9hZERldGFpbHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgc2V0RXJyb3IoXCJcIik7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgICAgIGAvYWRtaW4vY29udGV4dC9vcmRlci1pdGVtcy8ke2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcob3JkZXJJdGVtSWQpKX0vZGV0YWlsc2AsXHJcbiAgICAgICAgICB7IGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgcGF5bG9hZD8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGl0ZW0gZGV0YWlsc1wiLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldERldGFpbHMocGF5bG9hZCk7XHJcbiAgICAgIH0gY2F0Y2ggKGZldGNoRXJyb3IpIHtcclxuICAgICAgICBzZXRFcnJvcihmZXRjaEVycm9yPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgb3JkZXIgaXRlbSBkZXRhaWxzXCIpO1xyXG4gICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWREZXRhaWxzKCk7XHJcbiAgfSwgW29yZGVySXRlbUlkXSk7XHJcblxyXG4gIGNvbnN0IGNhbGN1bGF0ZWRUb3RhbCA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgcmV0dXJuIE51bWJlcihkZXRhaWxzPy50b3RhbFByaWNlIHx8IDApO1xyXG4gIH0sIFtkZXRhaWxzXSk7XHJcblxyXG4gIGlmIChsb2FkaW5nKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+TG9hZGluZyBvcmRlciBpdGVtIGRldGFpbHMuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT57ZXJyb3J9PC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKCFkZXRhaWxzKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+T3JkZXIgaXRlbSBkZXRhaWxzIG5vdCBhdmFpbGFibGUuPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcHJvZHVjdCA9IGRldGFpbHM/LnByb2R1Y3QgfHwge307XHJcbiAgY29uc3Qgb3JkZXIgPSBkZXRhaWxzPy5vcmRlciB8fCB7fTtcclxuICBjb25zdCBjdXN0b21lciA9IG9yZGVyPy51c2VyIHx8IHt9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17cGFnZVN0eWxlfT5cclxuICAgICAgPHN0eWxlPntgQG1lZGlhIChtYXgtd2lkdGg6IDEwNDBweCkgeyAuY2hhbmdlOC1vcmRlci1pdGVtLWdyaWQgeyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50OyB9IH1gfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2hlYWRlclN0eWxlfT5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxoMSBzdHlsZT17dGl0bGVTdHlsZX0+e3Byb2R1Y3Q/Lm5hbWUgfHwgXCJPcmRlciBJdGVtXCJ9PC9oMT5cclxuICAgICAgICAgICAgPHAgc3R5bGU9e3N1YnRpdGxlU3R5bGV9PlxyXG4gICAgICAgICAgICAgIE9yZGVyICN7b3JkZXI/LmlkIHx8IFwiLVwifSDigKIgSXRlbSAje2RldGFpbHM/LmlkIHx8IFwiLVwifVxyXG4gICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxzcGFuIHN0eWxlPXtiYWRnZVN0eWxlfT5BY3RpdmUgSXRlbTwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItaXRlbS1ncmlkXCIgc3R5bGU9e2dyaWRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgIHtwcm9kdWN0Py5pbWFnZVVybCA/IChcclxuICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgIHNyYz17cHJvZHVjdC5pbWFnZVVybH1cclxuICAgICAgICAgICAgICBhbHQ9e3Byb2R1Y3Q/Lm5hbWUgfHwgXCJQcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIC4uLmltYWdlU3R5bGUsXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgTm8gaW1hZ2UgYXZhaWxhYmxlXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTQgfX0gLz5cclxuXHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5Qcm9kdWN0IFNuYXBzaG90PC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5Qcm9kdWN0IE5hbWU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57cHJvZHVjdD8ubmFtZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlNLVTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntwcm9kdWN0Py5za3UgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5Qcm9kdWN0IElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+I3twcm9kdWN0Py5pZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkN1cnJlbnQgU3RvY2s8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57cHJvZHVjdD8uc3RvY2sgPz8gXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5PcmRlciAmIEN1c3RvbWVyPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5DdXN0b21lcjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntjdXN0b21lcj8ubmFtZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkVtYWlsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2N1c3RvbWVyPy5lbWFpbCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19Pk9yZGVyIElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+I3tvcmRlcj8uaWQgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5PcmRlciBTdGF0dXM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57b3JkZXI/LnN0YXR1cyB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlBheW1lbnQgTWV0aG9kPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e29yZGVyPy5wYXltZW50TWV0aG9kIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgTWV0aG9kPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e29yZGVyPy5zaGlwcGluZ01ldGhvZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlRyYWNraW5nIE51bWJlcjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntvcmRlcj8udHJhY2tpbmdOdW1iZXIgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5DcmVhdGVkIEF0PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdERhdGUoZGV0YWlscy5jcmVhdGVkQXQpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UHJpY2luZyBEZXRhaWxzPC9oMj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvR3JpZFN0eWxlfT5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5RdWFudGl0eTwvc3Bhbj5cclxuICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscy5xdWFudGl0eX08L3N0cm9uZz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlVuaXQgUHJpY2U8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGRldGFpbHMudW5pdFByaWNlKX08L3N0cm9uZz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkxpbmUgVG90YWw8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGNhbGN1bGF0ZWRUb3RhbCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlF1aWNrIFN1bW1hcnk8L2gyPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2xpbmVJdGVtU3R5bGV9PlxyXG4gICAgICAgICAge3Byb2R1Y3Q/LmltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgc3JjPXtwcm9kdWN0LmltYWdlVXJsfVxyXG4gICAgICAgICAgICAgIGFsdD17cHJvZHVjdD8ubmFtZSB8fCBcIlByb2R1Y3RcIn1cclxuICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiODRweFwiLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjg0cHhcIixcclxuICAgICAgICAgICAgICAgIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17ZW1wdHlJbWFnZVN0eWxlfT5ObyBpbWFnZTwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCI0cHhcIiB9fT5cclxuICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIsIGZvbnRTaXplOiBcIjE2cHhcIiB9fT5cclxuICAgICAgICAgICAgICB7cHJvZHVjdD8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwifVxyXG4gICAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgU0tVOiB7cHJvZHVjdD8uc2t1IHx8IFwiLVwifVxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiNjYmQ1ZTFcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgIFF0eSB7ZGV0YWlscy5xdWFudGl0eX0geCB7Zm9ybWF0TW9uZXkoZGV0YWlscy51bml0UHJpY2UpfVxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNnB4XCIgfX0+XHJcbiAgICAgICAgICAgIHtmb3JtYXRNb25leShjYWxjdWxhdGVkVG90YWwpfVxyXG4gICAgICAgICAgPC9zdHJvbmc+XHJcblxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlckl0ZW1TaG93O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgY2VsbFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBtaW5IZWlnaHQ6IFwiNTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2NHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjQycHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZsZXhTaHJpbms6IDAsXHJcbn07XHJcblxyXG5jb25zdCBmYWxsYmFja1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjY0cHhcIixcclxuICBoZWlnaHQ6IFwiNDJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjYpXCIsXHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgY29sb3I6IFwiIzY0NzQ4YlwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZsZXhTaHJpbms6IDAsXHJcbn07XHJcblxyXG5jb25zdCB0ZXh0U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcclxuICBnYXA6IFwiMnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0SW1hZ2UgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCBpbWFnZVVybCA9IHByb3BzPy5yZWNvcmQ/LnBhcmFtcz8uW3Byb3BzPy5wcm9wZXJ0eT8ucGF0aF07XHJcbiAgY29uc3QgW2hhc0Vycm9yLCBzZXRIYXNFcnJvcl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBzZXRIYXNFcnJvcihmYWxzZSk7XHJcbiAgfSwgW2ltYWdlVXJsXSk7XHJcblxyXG4gIGlmICghaW1hZ2VVcmwpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtmYWxsYmFja1N0eWxlfT5ObyBpbWFnZTwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChoYXNFcnJvcikge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBzdHlsZT17Y2VsbFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtmYWxsYmFja1N0eWxlfT5JbnZhbGlkPC9kaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IFwiIzBmMTcyYVwiIH19PkltYWdlIFVSTDwvc3Bhbj5cclxuICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgIGhyZWY9e2ltYWdlVXJsfVxyXG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICBjb2xvcjogXCIjMjU2M2ViXCIsXHJcbiAgICAgICAgICAgICAgdGV4dERlY29yYXRpb246IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgT3BlbiBsaW5rXHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtjZWxsU3R5bGV9PlxyXG4gICAgICA8aW1nXHJcbiAgICAgICAgc3JjPXtpbWFnZVVybH1cclxuICAgICAgICBhbHQ9XCJQcm9kdWN0XCJcclxuICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX1cclxuICAgICAgICBvbkVycm9yPXsoKSA9PiBzZXRIYXNFcnJvcih0cnVlKX1cclxuICAgICAgLz5cclxuICAgICAgPGRpdiBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBcIiMwZjE3MmFcIiB9fT5QcmV2aWV3PC9zcGFuPlxyXG4gICAgICAgIDxhXHJcbiAgICAgICAgICBocmVmPXtpbWFnZVVybH1cclxuICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXHJcbiAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiBcIiMyNTYzZWJcIiwgdGV4dERlY29yYXRpb246IFwibm9uZVwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICBPcGVuIGltYWdlXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0SW1hZ2U7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCB3cmFwcGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG59O1xyXG5cclxuY29uc3QgcHJldmlld1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjE0MHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjk2cHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3QgaGludFN0eWxlID0ge1xyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBjb2xvcjogXCIjNjQ3NDhiXCIsXHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0SW1hZ2VVcGxvYWQgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCB7IG9uQ2hhbmdlLCByZWNvcmQgfSA9IHByb3BzO1xyXG4gIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHJlY29yZD8ucGFyYW1zPy5pbWFnZVVybCB8fCBcIlwiO1xyXG4gIGNvbnN0IGN1cnJlbnRQdWJsaWNJZCA9IHJlY29yZD8ucGFyYW1zPy5pbWFnZVB1YmxpY0lkIHx8IFwiXCI7XHJcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoY3VycmVudFZhbHVlKTtcclxuICBjb25zdCBbcHVibGljSWQsIHNldFB1YmxpY0lkXSA9IHVzZVN0YXRlKGN1cnJlbnRQdWJsaWNJZCk7XHJcbiAgY29uc3QgW3VwbG9hZGluZywgc2V0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgc2V0UHJldmlld1VybChjdXJyZW50VmFsdWUpO1xyXG4gICAgc2V0UHVibGljSWQoY3VycmVudFB1YmxpY0lkKTtcclxuICB9LCBbY3VycmVudFZhbHVlLCBjdXJyZW50UHVibGljSWRdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlVXBsb2FkID0gYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF07XHJcblxyXG4gICAgaWYgKCFmaWxlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSk7XHJcbiAgICBzZXRFcnJvcihcIlwiKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXCJpbWFnZVwiLCBmaWxlKTtcclxuXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvYXBpL3VwbG9hZHMvaW1hZ2VcIiwge1xyXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgYm9keTogZm9ybURhdGEsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZC5tZXNzYWdlIHx8IFwiSW1hZ2UgdXBsb2FkIGZhaWxlZFwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdXBsb2FkZWRVcmwgPSBwYXlsb2FkLnVybCB8fCBcIlwiO1xyXG4gICAgICBjb25zdCB1cGxvYWRlZFB1YmxpY0lkID0gcGF5bG9hZC5wdWJsaWNJZCB8fCBcIlwiO1xyXG4gICAgICBzZXRQcmV2aWV3VXJsKHVwbG9hZGVkVXJsKTtcclxuICAgICAgc2V0UHVibGljSWQodXBsb2FkZWRQdWJsaWNJZCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVVybFwiLCB1cGxvYWRlZFVybCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVB1YmxpY0lkXCIsIHVwbG9hZGVkUHVibGljSWQpO1xyXG4gICAgICBvbkNoYW5nZT8uKFwidXBsb2FkSW1hZ2VcIiwgdXBsb2FkZWRVcmwpO1xyXG4gICAgfSBjYXRjaCAodXBsb2FkRXJyb3IpIHtcclxuICAgICAgc2V0RXJyb3IodXBsb2FkRXJyb3IubWVzc2FnZSk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpO1xyXG4gICAgICBldmVudC50YXJnZXQudmFsdWUgPSBcIlwiO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZVJlbW92ZSA9ICgpID0+IHtcclxuICAgIHNldFByZXZpZXdVcmwoXCJcIik7XHJcbiAgICBzZXRQdWJsaWNJZChcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVVybFwiLCBcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVB1YmxpY0lkXCIsIFwiXCIpO1xyXG4gICAgb25DaGFuZ2U/LihcInVwbG9hZEltYWdlXCIsIFwiXCIpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt3cmFwcGVyU3R5bGV9PlxyXG4gICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e2hhbmRsZVVwbG9hZH0gLz5cclxuICAgICAgPGRpdiBzdHlsZT17aGludFN0eWxlfT5cclxuICAgICAgICB7dXBsb2FkaW5nXHJcbiAgICAgICAgICA/IFwiVXBsb2FkaW5nIHRvIENsb3VkaW5hcnkuLi5cIlxyXG4gICAgICAgICAgOiBcIkNob29zZSBhbiBpbWFnZSBmaWxlIHRvIHVwbG9hZFwifVxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHtwcmV2aWV3VXJsID8gKFxyXG4gICAgICAgIDw+XHJcbiAgICAgICAgICA8aW1nIHNyYz17cHJldmlld1VybH0gYWx0PVwiUHJvZHVjdCBwcmV2aWV3XCIgc3R5bGU9e3ByZXZpZXdTdHlsZX0gLz5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVJlbW92ZX1cclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwiNnB4IDEwcHhcIixcclxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IFwiOHB4XCIsXHJcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjZWY0NDQ0XCIsXHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiI2VmNDQ0NFwiLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiI2ZmZlwiLFxyXG4gICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIFJlbW92ZSBpbWFnZVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC8+XHJcbiAgICAgICkgOiBudWxsfVxyXG5cclxuICAgICAge2Vycm9yID8gKFxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgLi4uaGludFN0eWxlLCBjb2xvcjogXCIjZGMyNjI2XCIgfX0+e2Vycm9yfTwvZGl2PlxyXG4gICAgICApIDogbnVsbH1cclxuXHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImltYWdlVXJsXCIgdmFsdWU9e3ByZXZpZXdVcmx9IHJlYWRPbmx5IC8+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImltYWdlUHVibGljSWRcIiB2YWx1ZT17cHVibGljSWR9IHJlYWRPbmx5IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdEltYWdlVXBsb2FkO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgQ2F0ZWdvcnlTaG93ID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgeyByZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wcztcclxuICBjb25zdCBbY2F0ZWdvcnksIHNldENhdGVnb3J5XSA9IHVzZVN0YXRlKG51bGwpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHJlY29yZCAmJiByZWNvcmQucGFyYW1zKSB7XHJcbiAgICAgIHNldENhdGVnb3J5KHJlY29yZC5wYXJhbXMpO1xyXG4gICAgfVxyXG4gIH0sIFtyZWNvcmRdKTtcclxuXHJcbiAgaWYgKCFjYXRlZ29yeSkge1xyXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1sb2FkaW5nXCI+TG9hZGluZy4uLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGZvcm1hdERhdGUgPSAoZGF0ZSkgPT4ge1xyXG4gICAgaWYgKCFkYXRlKSByZXR1cm4gXCLigJRcIjtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlKS50b0xvY2FsZURhdGVTdHJpbmcoXCJlbi1VU1wiLCB7XHJcbiAgICAgICAgeWVhcjogXCJudW1lcmljXCIsXHJcbiAgICAgICAgbW9udGg6IFwibG9uZ1wiLFxyXG4gICAgICAgIGRheTogXCJudW1lcmljXCIsXHJcbiAgICAgICAgaG91cjogXCIyLWRpZ2l0XCIsXHJcbiAgICAgICAgbWludXRlOiBcIjItZGlnaXRcIixcclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgcmV0dXJuIFwi4oCUXCI7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1jb250YWluZXJcIj5cclxuICAgICAgPHN0eWxlPntgXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctY29udGFpbmVyIHtcclxuICAgICAgICAgIC0tYmctMTogdmFyKC0tY2hhbmdlOC1iZy0xLCAjMDUwOTE0KTtcclxuICAgICAgICAgIC0tZ29sZDogdmFyKC0tY2hhbmdlOC1nb2xkLCAjZTJiZjY2KTtcclxuICAgICAgICAgIC0tdGV4dC1tYWluOiB2YXIoLS1jaGFuZ2U4LXRleHQtbWFpbiwgI2Y4ZmFmYyk7XHJcbiAgICAgICAgICAtLXRleHQtbXV0ZWQ6IHZhcigtLWNoYW5nZTgtdGV4dC1tdXRlZCwgIzlhYThjMSk7XHJcbiAgICAgICAgICAtLWxpbmU6IHZhcigtLWNoYW5nZTgtbGluZSwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjIyKSk7XHJcbiAgICAgICAgICAtLWNhcmQtYmc6IHZhcigtLWNoYW5nZTgtY2FyZC1iZywgbGluZWFyLWdyYWRpZW50KDE2MGRlZywgcmdiYSgyMSwgMzQsIDY2LCAwLjk2KSAwJSwgcmdiYSgxMCwgMTgsIDM2LCAwLjk2KSAxMDAlKSk7XHJcbiAgICAgICAgICAtLXNoYWRvdzogdmFyKC0tY2hhbmdlOC1zaGFkb3csIDAgOHB4IDI2cHggcmdiYSgwLCAwLCAwLCAwLjMpKTtcclxuXHJcbiAgICAgICAgICBwYWRkaW5nOiAzMnB4O1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbWFpbik7XHJcbiAgICAgICAgICBmb250LWZhbWlseTogXCJQb3BwaW5zXCIsIFwiU2Vnb2UgVUlcIiwgc2Fucy1zZXJpZjtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMjBkZWcsIHZhcigtLWJnLTEpIDAlLCByZ2JhKDExLCAyNiwgNTYsIDAuOCkgNTAlLCB2YXIoLS1iZy0xKSAxMDAlKTtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jYXRlZ29yeS1zaG93LWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtYmctMTogI2YwZjZmZjtcclxuICAgICAgICAgIC0tY2hhbmdlOC1nb2xkOiAjYzA4YjBmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXRleHQtbWFpbjogIzBmMTcyYTtcclxuICAgICAgICAgIC0tY2hhbmdlOC10ZXh0LW11dGVkOiAjNDc1NTY5O1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWxpbmU6IHJnYmEoMTUsIDIzLCA0MiwgMC4wOCk7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtY2FyZC1iZzogI2ZmZmZmZjtcclxuICAgICAgICAgIC0tY2hhbmdlOC1zaGFkb3c6IDAgNHB4IDIwcHggcmdiYSgxNSwgMjMsIDQyLCAwLjA2KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWlubmVyIHtcclxuICAgICAgICAgIG1heC13aWR0aDogOTAwcHg7XHJcbiAgICAgICAgICBtYXJnaW46IDAgYXV0bztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWhlYWRlciB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAzMnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3cta2lja2VyIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMzZlbTtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEycHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy10aXRsZSB7XHJcbiAgICAgICAgICBmb250LXNpemU6IGNsYW1wKDMycHgsIDV2dywgNDhweCk7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDEuMTtcclxuICAgICAgICAgIG1hcmdpbjogMCAwIDhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXN0YXR1cyB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBnYXA6IDhweDtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDEycHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiA2cHggMTJweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjEyZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1zdGF0dXMuYWN0aXZlIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMzQsIDE5NywgOTQsIDAuMik7XHJcbiAgICAgICAgICBjb2xvcjogIzIyYzU1ZTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMzQsIDE5NywgOTQsIDAuNCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1zdGF0dXMuaW5hY3RpdmUge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyMzksIDY4LCA2OCwgMC4yKTtcclxuICAgICAgICAgIGNvbG9yOiAjZWY0NDQ0O1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyMzksIDY4LCA2OCwgMC40KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWNhcmQge1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAyNHB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMzJweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWNhcmQtYmcpO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogdmFyKC0tc2hhZG93KTtcclxuICAgICAgICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjRweDtcclxuICAgICAgICAgIGFuaW1hdGlvbjogZmFkZS11cCA1NjBtcyBlYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctc2VjdGlvbi10aXRsZSB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjE4ZW07XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXNlY3Rpb24ge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXNlY3Rpb246bGFzdC1jaGlsZCB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctZmllbGQge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWZpZWxkOmxhc3QtY2hpbGQge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWxhYmVsIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMThlbTtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDhweDtcclxuICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctdmFsdWUge1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbWFpbik7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMS42O1xyXG4gICAgICAgICAgd29yZC1icmVhazogYnJlYWstd29yZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXZhbHVlLmdvbGQge1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLWdvbGQpO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWRlc2NyaXB0aW9uIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4yKTtcclxuICAgICAgICAgIGJvcmRlci1sZWZ0OiAzcHggc29saWQgdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxNnB4IDIwcHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMS43O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jYXRlZ29yeS1zaG93LWRlc2NyaXB0aW9uIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMTUsIDIzLCA0MiwgMC4wNSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1kZXRhaWxzLWdyaWQge1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMjAwcHgsIDFmcikpO1xyXG4gICAgICAgICAgZ2FwOiAyNHB4O1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMTZweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtIHtcclxuICAgICAgICAgIHBhZGRpbmc6IDE2cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMSk7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNhdGVnb3J5LXNob3ctZGV0YWlsLWl0ZW0ge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNSwgMjMsIDQyLCAwLjAzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWRpdmlkZXIge1xyXG4gICAgICAgICAgaGVpZ2h0OiAxcHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjI2LCAxOTEsIDEwMiwgMCksIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4yOCksIHJnYmEoMjI2LCAxOTEsIDEwMiwgMCkpO1xyXG4gICAgICAgICAgbWFyZ2luOiAyNHB4IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAa2V5ZnJhbWVzIGZhZGUtdXAge1xyXG4gICAgICAgICAgZnJvbSB7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg4cHgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdG8ge1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNzIwcHgpIHtcclxuICAgICAgICAgIC5jYXRlZ29yeS1zaG93LWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDIwcHggMTZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2F0ZWdvcnktc2hvdy1jYXJkIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMjRweCAyMHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jYXRlZ29yeS1zaG93LWRldGFpbHMtZ3JpZCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgYH08L3N0eWxlPlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWlubmVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWhlYWRlclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWtpY2tlclwiPkNhdGVnb3J5IE92ZXJ2aWV3PC9kaXY+XHJcbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy10aXRsZVwiPntjYXRlZ29yeS5uYW1lIHx8IFwi4oCUXCJ9PC9oMT5cclxuICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgY2F0ZWdvcnktc2hvdy1zdGF0dXMgJHtjYXRlZ29yeS5pc0FjdGl2ZSA/IFwiYWN0aXZlXCIgOiBcImluYWN0aXZlXCJ9YH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPHNwYW4+4pePPC9zcGFuPlxyXG4gICAgICAgICAgICB7Y2F0ZWdvcnkuaXNBY3RpdmUgPyBcIkFjdGl2ZVwiIDogXCJJbmFjdGl2ZVwifVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1jYXJkXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctc2VjdGlvblwiPlxyXG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1zZWN0aW9uLXRpdGxlXCI+RGVzY3JpcHRpb248L2gzPlxyXG4gICAgICAgICAgICB7Y2F0ZWdvcnkuZGVzY3JpcHRpb24gPyAoXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRlc2NyaXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICB7Y2F0ZWdvcnkuZGVzY3JpcHRpb259XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy12YWx1ZVwiXHJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS10ZXh0LW11dGVkKVwiIH19XHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgTm8gZGVzY3JpcHRpb24gcHJvdmlkZWRcclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kaXZpZGVyXCIgLz5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctc2VjdGlvblwiPlxyXG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1zZWN0aW9uLXRpdGxlXCI+RGV0YWlsczwvaDM+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGV0YWlscy1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1sYWJlbFwiPkNhdGVnb3J5IElEPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy12YWx1ZSBnb2xkXCJcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogXCJtb25vc3BhY2VcIiwgZm9udFNpemU6IFwiMTRweFwiIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtjYXRlZ29yeS5pZCB8fCBcIuKAlFwifVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kZXRhaWwtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctbGFiZWxcIj5TbHVnPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy12YWx1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICB7Y2F0ZWdvcnkuc2x1ZyB8fCBcIuKAlFwifVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRpdmlkZXJcIiAvPlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXNlY3Rpb24tdGl0bGVcIj5UaW1lbGluZTwvaDM+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGV0YWlscy1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1sYWJlbFwiPkNyZWF0ZWQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXZhbHVlXCI+XHJcbiAgICAgICAgICAgICAgICAgIHtmb3JtYXREYXRlKGNhdGVnb3J5LmNyZWF0ZWRBdCl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1sYWJlbFwiPkxhc3QgVXBkYXRlZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctdmFsdWVcIj5cclxuICAgICAgICAgICAgICAgICAge2Zvcm1hdERhdGUoY2F0ZWdvcnkudXBkYXRlZEF0KX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDYXRlZ29yeVNob3c7XHJcbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IERhc2hib2FyZCBmcm9tICcuLi9hZG1pbi9kYXNoYm9hcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRhc2hib2FyZCA9IERhc2hib2FyZFxuaW1wb3J0IFJlZ2lzdGVyIGZyb20gJy4uL2FkbWluL3JlZ2lzdGVyJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5SZWdpc3RlciA9IFJlZ2lzdGVyXG5pbXBvcnQgUHJvZHVjdENhcmRzTGlzdCBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LWNhcmRzLWxpc3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RDYXJkc0xpc3QgPSBQcm9kdWN0Q2FyZHNMaXN0XG5pbXBvcnQgUHJvZHVjdFNob3cgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1zaG93J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0U2hvdyA9IFByb2R1Y3RTaG93XG5pbXBvcnQgT3JkZXJDcmVhdGUgZnJvbSAnLi4vYWRtaW4vb3JkZXItY3JlYXRlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlckNyZWF0ZSA9IE9yZGVyQ3JlYXRlXG5pbXBvcnQgT3JkZXJTaG93IGZyb20gJy4uL2FkbWluL29yZGVyLXNob3cnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLk9yZGVyU2hvdyA9IE9yZGVyU2hvd1xuaW1wb3J0IE9yZGVySXRlbVNob3cgZnJvbSAnLi4vYWRtaW4vb3JkZXItaXRlbS1zaG93J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlckl0ZW1TaG93ID0gT3JkZXJJdGVtU2hvd1xuaW1wb3J0IFByb2R1Y3RJbWFnZSBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LWltYWdlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0SW1hZ2UgPSBQcm9kdWN0SW1hZ2VcbmltcG9ydCBQcm9kdWN0SW1hZ2VVcGxvYWQgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS11cGxvYWQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RJbWFnZVVwbG9hZCA9IFByb2R1Y3RJbWFnZVVwbG9hZFxuaW1wb3J0IENhdGVnb3J5U2hvdyBmcm9tICcuLi9hZG1pbi9jYXRlZ29yeS1zaG93J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DYXRlZ29yeVNob3cgPSBDYXRlZ29yeVNob3ciXSwibmFtZXMiOlsiZm9ybWF0Q3VycmVuY3kiLCJ2YWx1ZSIsIk51bWJlciIsInRvTG9jYWxlU3RyaW5nIiwiZm9ybWF0RGF0ZSIsIkRhdGUiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJlcnJvciIsInByb2R1Y3RJbWFnZSIsInByb2R1Y3QiLCJpbWFnZSIsImltYWdlVXJsIiwidGh1bWJuYWlsIiwiY292ZXIiLCJwcm9kdWN0TGFiZWwiLCJuYW1lIiwiU3RyaW5nIiwic3BsaXQiLCJzbGljZSIsIm1hcCIsInBhcnQiLCJqb2luIiwidG9VcHBlckNhc2UiLCJEYXNoYm9hcmQiLCJkYXRhIiwic2V0RGF0YSIsInVzZVN0YXRlIiwidXNlcnMiLCJjYXRlZ29yaWVzIiwicHJvZHVjdHMiLCJvcmRlcnMiLCJyZXZlbnVlIiwiZmVhdHVyZWRHZW1zIiwiY3JpdGljYWxTdG9jayIsInJlY2VudFByb2R1Y3RzIiwiY2F0ZWdvcnlEaXN0cmlidXRpb24iLCJ1c2VFZmZlY3QiLCJsb2FkRGFzaGJvYXJkIiwicmVzcG9uc2UiLCJmZXRjaCIsInBheWxvYWQiLCJqc29uIiwidG9wQ2F0ZWdvcmllcyIsInVzZU1lbW8iLCJkaXN0cmlidXRpb24iLCJtYXgiLCJNYXRoIiwiaXRlbSIsImNvdW50Iiwid2lkdGgiLCJyb3VuZCIsImNvbXBsZXRpb25SYXRlIiwidG90YWwiLCJoZWFsdGh5IiwicmV2ZW51ZVJhdGUiLCJwc2V1ZG9UYXJnZXQiLCJtaW4iLCJjaGFydFNlZ21lbnRzIiwiaXRlbXMiLCJyZWR1Y2UiLCJzdW0iLCJwYWxldHRlIiwic3RhcnQiLCJpbmRleCIsInBlcmNlbnQiLCJlbmQiLCJzZWdtZW50IiwibGVuZ3RoIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwic3R5bGUiLCJ2aWV3Qm94IiwiZCIsImNhdGVnb3J5IiwiY29sb3JzIiwia2V5IiwiYmFja2dyb3VuZCIsIm1hcmdpblRvcCIsImlkIiwic3JjIiwiYWx0IiwiY3JlYXRlZEF0IiwicHJpY2UiLCJjb2xvciIsIlJlZ2lzdGVyIiwiZm9ybVN0YXRlIiwic2V0Rm9ybVN0YXRlIiwiZW1haWwiLCJwYXNzd29yZCIsIm1lc3NhZ2UiLCJzZXRNZXNzYWdlIiwidHlwZSIsInRleHQiLCJpc1N1Ym1pdHRpbmciLCJzZXRJc1N1Ym1pdHRpbmciLCJkb2N1bWVudCIsImJvZHkiLCJtYXJnaW4iLCJoYW5kbGVDaGFuZ2UiLCJldmVudCIsImN1cnJlbnQiLCJ0YXJnZXQiLCJoYW5kbGVTdWJtaXQiLCJwcmV2ZW50RGVmYXVsdCIsIm1ldGhvZCIsImhlYWRlcnMiLCJKU09OIiwic3RyaW5naWZ5Iiwib2siLCJFcnJvciIsInNldFRpbWVvdXQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJvblN1Ym1pdCIsImh0bWxGb3IiLCJwbGFjZWhvbGRlciIsIm9uQ2hhbmdlIiwicmVxdWlyZWQiLCJtaW5MZW5ndGgiLCJkaXNhYmxlZCIsImdyaWRTdHlsZSIsImRpc3BsYXkiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwiZ2FwIiwiY2FyZFN0eWxlIiwiYm9yZGVyUmFkaXVzIiwiYm9yZGVyIiwib3ZlcmZsb3ciLCJib3hTaGFkb3ciLCJpbWFnZVdyYXBTdHlsZSIsImhlaWdodCIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsInBhZGRpbmciLCJpbWFnZVN0eWxlIiwib2JqZWN0Rml0IiwiYm9keVN0eWxlIiwibWV0YVN0eWxlIiwiZm9udFNpemUiLCJiYWRnZVN0eWxlIiwiaXNBY3RpdmUiLCJmb250V2VpZ2h0IiwibGV0dGVyU3BhY2luZyIsImxpbmtTdHlsZSIsInRleHREZWNvcmF0aW9uIiwiY3Vyc29yIiwiZW1wdHlTdHlsZSIsImZvcm1hdFByaWNlIiwiYW1vdW50IiwiaXNGaW5pdGUiLCJ1bmRlZmluZWQiLCJtaW5pbXVtRnJhY3Rpb25EaWdpdHMiLCJtYXhpbXVtRnJhY3Rpb25EaWdpdHMiLCJnZXRSZWNvcmRJZCIsInJlY29yZCIsInBhcmFtcyIsInBhcmFtIiwiZ2V0U2hvd0hyZWYiLCJyZXNvdXJjZUlkIiwicmVjb3JkQWN0aW9ucyIsImFjdGlvbnMiLCJzaG93QWN0aW9uIiwiZmluZCIsImFjdGlvbiIsInJhd0hyZWYiLCJlbmNvZGVVUklDb21wb25lbnQiLCJQcm9kdWN0Q2FyZHNMaXN0IiwicHJvcHMiLCJhcGlSZWNvcmRzIiwic2V0QXBpUmVjb3JkcyIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwibG9hZEVycm9yIiwic2V0TG9hZEVycm9yIiwicmVzb3VyY2UiLCJwcm9wUmVjb3JkcyIsInJlY29yZHMiLCJpc01vdW50ZWQiLCJsb2FkUmVjb3JkcyIsImNyZWRlbnRpYWxzIiwiY2F0ZWdvcnlJZCIsInN0b2NrIiwiQm9vbGVhbiIsImRldGFpbHNIcmVmIiwib3BlbkRldGFpbHMiLCJhc3NpZ24iLCJvbkNsaWNrIiwicGFnZVN0eWxlIiwiaGVyb1N0eWxlIiwicGFuZWxTdHlsZSIsIm1pbkhlaWdodCIsImhlcm9Cb2R5U3R5bGUiLCJ0aXRsZVN0eWxlIiwibGluZUhlaWdodCIsInN1YnRpdGxlU3R5bGUiLCJhY3RpdmUiLCJzdGF0c0dyaWRTdHlsZSIsInN0YXRDYXJkU3R5bGUiLCJzdGF0TGFiZWxTdHlsZSIsInRleHRUcmFuc2Zvcm0iLCJtYXJnaW5Cb3R0b20iLCJzdGF0VmFsdWVTdHlsZSIsIndvcmRCcmVhayIsInNlY3Rpb25HcmlkU3R5bGUiLCJzZWN0aW9uVGl0bGVTdHlsZSIsImNvbnRlbnRDYXJkU3R5bGUiLCJpbmZvTGlzdFN0eWxlIiwiaW5mb1Jvd1N0eWxlIiwicGFkZGluZ0JvdHRvbSIsImJvcmRlckJvdHRvbSIsImluZm9MYWJlbFN0eWxlIiwiaW5mb1ZhbHVlU3R5bGUiLCJ0ZXh0QWxpZ24iLCJkZXNjcmlwdGlvblN0eWxlIiwid2hpdGVTcGFjZSIsImJ1dHRvblN0eWxlIiwidHJhbnNpdGlvbiIsImJ1dHRvbkhvdmVyU3R5bGUiLCJ0cmFuc2Zvcm0iLCJkYXRlIiwiaXNOYU4iLCJnZXRUaW1lIiwiZGF0ZVN0eWxlIiwidGltZVN0eWxlIiwiUHJvZHVjdFNob3ciLCJza3UiLCJkZXNjcmlwdGlvbiIsImJ1dHRvbkhvdmVyZWQiLCJzZXRCdXR0b25Ib3ZlcmVkIiwiaGFuZGxlT3JkZXJDbGljayIsInByb2R1Y3RJZCIsIm5ld09yZGVyVXJsIiwib25Nb3VzZUVudGVyIiwib25Nb3VzZUxlYXZlIiwidGl0bGUiLCJ4bWxucyIsImZpbGwiLCJzdHJva2UiLCJzdHJva2VXaWR0aCIsInN0cm9rZUxpbmVjYXAiLCJzdHJva2VMaW5lam9pbiIsImN4IiwiY3kiLCJyIiwidXBkYXRlZEF0IiwiaGVhZGVyU3R5bGUiLCJkZXNjU3R5bGUiLCJsYXlvdXRTdHlsZSIsInN0YWNrU3R5bGUiLCJsYWJlbFN0eWxlIiwiaW5wdXRTdHlsZSIsIm1pbldpZHRoIiwiYm94U2l6aW5nIiwiZm9udEZhbWlseSIsInJvd1N0eWxlIiwiZ3JpZDJTdHlsZSIsImN1c3RvbWVySW5mb1N0eWxlIiwiY3VzdG9tZXJSb3dTdHlsZSIsIm11dGVkU3R5bGUiLCJzdHJvbmdTdHlsZSIsImxpbmVJdGVtUm93U3R5bGUiLCJsaW5lSXRlbVRvcFN0eWxlIiwicHJvZHVjdFByZXZpZXdTdHlsZSIsImFkZEJ1dHRvblN0eWxlIiwicmVtb3ZlQnV0dG9uU3R5bGUiLCJ0b3RhbHNSb3dTdHlsZSIsInRvdGFsU3R5bGUiLCJwYWRkaW5nVG9wIiwiYWN0aW9uQmFyU3R5bGUiLCJhY3Rpb25CdXR0b25TdHlsZSIsInByaW1hcnkiLCJtYXBMaW5rU3R5bGUiLCJwYXltZW50T3B0aW9uR3JpZFN0eWxlIiwicGF5bWVudE9wdGlvblN0eWxlIiwic2VjdXJpdHlDaGlwV3JhcFN0eWxlIiwic2VjdXJpdHlDaGlwU3R5bGUiLCJyZXNwb25zaXZlQ3NzIiwicGF5bWVudE9wdGlvbnMiLCJsYWJlbCIsImljb24iLCJpdGVtU2l6ZU9wdGlvbnMiLCJzaGlwcGluZ01ldGhvZHMiLCJ0b051bWJlciIsIm51bSIsImZvcm1hdE1vbmV5IiwiY3JlYXRlRW1wdHlJdGVtIiwic2l6ZSIsInF1YW50aXR5IiwidW5pdFByaWNlIiwiT3JkZXJDcmVhdGUiLCJzZXRVc2VycyIsInNldFByb2R1Y3RzIiwib3JkZXJDb3VudEJ5VXNlciIsInNldE9yZGVyQ291bnRCeVVzZXIiLCJzZXNzaW9uVXNlciIsInNldFNlc3Npb25Vc2VyIiwic3VibWl0dGluZyIsInNldFN1Ym1pdHRpbmciLCJmb3JtRGF0YSIsInNldEZvcm1EYXRhIiwidXNlcklkIiwic3RhdHVzIiwicGF5bWVudE1ldGhvZCIsInBheW1lbnRTdGF0dXMiLCJ0cmFuc2FjdGlvbklkIiwic2hpcHBpbmdOYW1lIiwic2hpcHBpbmdQaG9uZSIsInNoaXBwaW5nQWRkcmVzcyIsInNoaXBwaW5nTWV0aG9kIiwidHJhY2tpbmdOdW1iZXIiLCJzaGlwcGluZ0ZlZSIsInRheCIsImRpc2NvdW50IiwibGluZUl0ZW1zIiwic2V0TGluZUl0ZW1zIiwiVVJMU2VhcmNoUGFyYW1zIiwic2VhcmNoIiwicHJlUHJvZHVjdElkIiwiZ2V0IiwiZmV0Y2hEYXRhIiwiY29udGV4dFJlcyIsImNvbnRleHREYXRhIiwidXNlcnNEYXRhIiwiQXJyYXkiLCJpc0FycmF5IiwicHJvZHVjdHNMaXN0IiwiY3VycmVudFVzZXIiLCJwcmV2Iiwic2VsZWN0ZWRQcm9kdWN0Iiwic29tZSIsInAiLCJzZWxlY3RlZCIsInNlbGVjdGVkQ3VzdG9tZXIiLCJ1IiwiY3VzdG9tZXJPcmRlckNvdW50IiwicGhvbmUiLCJtb2JpbGUiLCJsaW5lVG90YWxzIiwic3VidG90YWwiLCJncmFuZFRvdGFsIiwiaGFuZGxlRm9ybUNoYW5nZSIsImhhbmRsZUxpbmVJdGVtQ2hhbmdlIiwibmV4dCIsImFkZExpbmVJdGVtIiwicmVtb3ZlTGluZUl0ZW0iLCJmaWx0ZXIiLCJfIiwiaSIsIm1hcHNIcmVmIiwidHJpbSIsInZhbGlkSXRlbXMiLCJhbGVydCIsIm9yZGVyUGF5bG9hZCIsInRvRml4ZWQiLCJ0b3RhbEFtb3VudCIsInN1Ym1pdEZvcm0iLCJGb3JtRGF0YSIsImFwcGVuZCIsIm9yZGVyUmVzIiwib3JkZXJEYXRhIiwicm9sZSIsInVzZXIiLCJvcHRpb24iLCJyZWFkT25seSIsIml0ZW1Ub3RhbCIsInNpemVPcHRpb24iLCJzdGVwIiwicmVzaXplIiwicmVsIiwiaGlzdG9yeSIsImJhY2siLCJoZWFkaW5nU3R5bGUiLCJzdWJUZXh0U3R5bGUiLCJ2YWwiLCJ0b0xvd2VyQ2FzZSIsInN0eWxlQnlTdGF0dXMiLCJwZW5kaW5nIiwiYmciLCJmZyIsInBhaWQiLCJwcm9jZXNzaW5nIiwic2hpcHBlZCIsImNvbXBsZXRlZCIsImNhbmNlbGxlZCIsImluZm9HcmlkU3R5bGUiLCJ0YWJsZVN0eWxlIiwibGluZUl0ZW1TdHlsZSIsInRvdGFsQm94U3R5bGUiLCJ0b3RhbFJvd1N0eWxlIiwiZ3JhbmRTdHlsZSIsIm4iLCJkdCIsIk9yZGVyU2hvdyIsImRldGFpbHMiLCJzZXREZXRhaWxzIiwic2V0RXJyb3IiLCJvcmRlcklkIiwibG9hZERldGFpbHMiLCJmZXRjaEVycm9yIiwidG90YWxzIiwidG90YWxQcmljZSIsImVtcHR5SW1hZ2VTdHlsZSIsIk9yZGVySXRlbVNob3ciLCJvcmRlckl0ZW1JZCIsImNhbGN1bGF0ZWRUb3RhbCIsIm9yZGVyIiwiY3VzdG9tZXIiLCJjZWxsU3R5bGUiLCJmbGV4U2hyaW5rIiwiZmFsbGJhY2tTdHlsZSIsInRleHRTdHlsZSIsImZsZXhEaXJlY3Rpb24iLCJQcm9kdWN0SW1hZ2UiLCJwcm9wZXJ0eSIsInBhdGgiLCJoYXNFcnJvciIsInNldEhhc0Vycm9yIiwib25FcnJvciIsIndyYXBwZXJTdHlsZSIsInByZXZpZXdTdHlsZSIsImhpbnRTdHlsZSIsIlByb2R1Y3RJbWFnZVVwbG9hZCIsImN1cnJlbnRWYWx1ZSIsImN1cnJlbnRQdWJsaWNJZCIsImltYWdlUHVibGljSWQiLCJwcmV2aWV3VXJsIiwic2V0UHJldmlld1VybCIsInB1YmxpY0lkIiwic2V0UHVibGljSWQiLCJ1cGxvYWRpbmciLCJzZXRVcGxvYWRpbmciLCJoYW5kbGVVcGxvYWQiLCJmaWxlIiwiZmlsZXMiLCJ1cGxvYWRlZFVybCIsInVybCIsInVwbG9hZGVkUHVibGljSWQiLCJ1cGxvYWRFcnJvciIsImhhbmRsZVJlbW92ZSIsImFjY2VwdCIsIkZyYWdtZW50IiwiQ2F0ZWdvcnlTaG93Iiwic2V0Q2F0ZWdvcnkiLCJ5ZWFyIiwibW9udGgiLCJkYXkiLCJob3VyIiwibWludXRlIiwic2x1ZyIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUVBLE1BQU1BLGdCQUFjLEdBQUlDLEtBQUssSUFBSztJQUNoQyxPQUFPLENBQUEsR0FBQSxFQUFNQyxNQUFNLENBQUNELEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQ0UsY0FBYyxFQUFFLENBQUEsQ0FBRTtFQUNwRCxDQUFDO0VBRUQsTUFBTUMsWUFBVSxHQUFJSCxLQUFLLElBQUs7SUFDNUIsSUFBSSxDQUFDQSxLQUFLLEVBQUU7RUFDVixJQUFBLE9BQU8sR0FBRztFQUNaLEVBQUE7SUFFQSxJQUFJO01BQ0YsT0FBTyxJQUFJSSxJQUFJLENBQUNKLEtBQUssQ0FBQyxDQUFDSyxrQkFBa0IsRUFBRTtJQUM3QyxDQUFDLENBQUMsT0FBT0MsS0FBSyxFQUFFO0VBQ2QsSUFBQSxPQUFPLEdBQUc7RUFDWixFQUFBO0VB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNB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
