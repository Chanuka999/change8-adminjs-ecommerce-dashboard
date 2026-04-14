(function (React) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const formatCurrency$1 = value => {
    return `Rs.${Number(value || 0).toLocaleString()}`;
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
      className: "change8-metric-grid"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card change8-card--stacked"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Revenue Stream"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value"
    }, formatCurrency$1(data.revenue)), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Across all orders")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card change8-card--stacked"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Inventory Size"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value"
    }, data.products || 0), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Total active catalog items")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card change8-card--stacked"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Featured Gems"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value"
    }, data.featuredGems || 0), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Currently visible products")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card change8-card--stacked"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Critical Stock"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value"
    }, data.criticalStock || 0), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Items needing urgent refill"))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-layout"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card change8-card--tall"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Category Distribution"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Inventory split by segment"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-section-divider"
    }), /*#__PURE__*/React__default.default.createElement("div", {
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
    }))), (topCategories || []).length === 0 ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "No category data yet.") : (topCategories || []).map(category => /*#__PURE__*/React__default.default.createElement("div", {
      key: category.name,
      className: "change8-progress-wrap"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-progress-head"
    }, /*#__PURE__*/React__default.default.createElement("span", null, category.name), /*#__PURE__*/React__default.default.createElement("strong", null, category.count)), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-progress-track"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-progress-fill",
      style: {
        width: category.width
      }
    }))))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card change8-card--tall"
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
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-name"
    }, product.name), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-date"
    }, new Date(product.createdAt).toLocaleDateString())), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-price"
    }, formatCurrency$1(product.price))))))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-full-width-section"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card change8-card--tall"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Orders Overview"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Summary of all orders and transactions"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-section-divider"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginTop: "12px"
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Total Orders"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value",
      style: {
        marginTop: "8px"
      }
    }, data.orders || 0)), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Total Users"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value",
      style: {
        marginTop: "8px"
      }
    }, data.users || 0)), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Total Revenue"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value",
      style: {
        marginTop: "8px",
        color: "var(--gold)"
      }
    }, formatCurrency$1(data.revenue))))))));
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px"
  };
  const cardStyle = {
    borderRadius: "16px",
    border: "1px solid rgba(148, 163, 184, 0.28)",
    background: "linear-gradient(160deg, #0b1a38 0%, #09162f 100%)",
    color: "#f8fafc",
    overflow: "hidden",
    boxShadow: "0 12px 22px rgba(2, 6, 23, 0.25)"
  };
  const imageWrapStyle$1 = {
    width: "100%",
    height: "160px",
    background: "#0f172a"
  };
  const imageStyle$2 = {
    width: "100%",
    height: "100%",
    objectFit: "cover"
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
  const badgeStyle$1 = isActive => ({
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
  const emptyStyle = {
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
        style: emptyStyle
      }, "Loading products...");
    }
    if (loadError) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: emptyStyle
      }, loadError);
    }
    if (!records.length) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: emptyStyle
      }, "No products found.");
    }
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: gridStyle
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
        style: cardStyle
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: imageWrapStyle$1
      }, imageUrl ? /*#__PURE__*/React__default.default.createElement("img", {
        src: imageUrl,
        alt: name,
        style: imageStyle$2
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
        style: badgeStyle$1(isActive)
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

  const pageStyle = {
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
  const imageStyle$1 = {
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
  const titleStyle = {
    margin: 0,
    fontSize: "clamp(28px, 4vw, 46px)",
    lineHeight: 1.05,
    color: "#f8fafc"
  };
  const subtitleStyle = {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px"
  };
  const badgeStyle = active => ({
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
  const sectionTitleStyle = {
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
  const infoRowStyle = {
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
  const formatCurrency = value => {
    const amount = Number(value || 0);
    return `Rs. ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
  };
  const formatDate = value => {
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
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: pageStyle
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
      style: imageStyle$1
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
      style: titleStyle
    }, name), /*#__PURE__*/React__default.default.createElement("p", {
      style: subtitleStyle
    }, "Clean product overview for quick review and management.")), /*#__PURE__*/React__default.default.createElement("div", {
      style: badgeStyle(isActive)
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
    }, "Stock"), /*#__PURE__*/React__default.default.createElement("div", {
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
      style: sectionTitleStyle
    }, "Description"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 12
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: descriptionStyle
    }, description)), /*#__PURE__*/React__default.default.createElement("div", {
      style: contentCardStyle
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle
    }, "Product Details"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 12
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoListStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: infoLabelStyle
    }, "Category"), /*#__PURE__*/React__default.default.createElement("span", {
      style: infoValueStyle
    }, category)), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: infoLabelStyle
    }, "Created At"), /*#__PURE__*/React__default.default.createElement("span", {
      style: infoValueStyle
    }, formatDate(params?.createdAt))), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: infoLabelStyle
    }, "Updated At"), /*#__PURE__*/React__default.default.createElement("span", {
      style: infoValueStyle
    }, formatDate(params?.updatedAt))), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: infoLabelStyle
    }, "Record ID"), /*#__PURE__*/React__default.default.createElement("span", {
      style: infoValueStyle
    }, params?.id || record?.id || "-"))))));
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

  const OrderShow = props => {
    const {
      record,
      resource
    } = props;
    const [order, setOrder] = React.useState(null);
    React.useEffect(() => {
      if (record && record.params) {
        setOrder(record.params);
      }
    }, [record]);
    if (!order) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        className: "order-show-loading"
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
    const formatCurrency = value => {
      return `Rs.${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
    };
    const getStatusColor = status => {
      const colors = {
        pending: {
          bg: "rgba(251, 191, 36, 0.2)",
          color: "#fbbf24",
          border: "rgba(251, 191, 36, 0.4)"
        },
        paid: {
          bg: "rgba(34, 197, 94, 0.2)",
          color: "#22c55e",
          border: "rgba(34, 197, 94, 0.4)"
        },
        processing: {
          bg: "rgba(59, 130, 246, 0.2)",
          color: "#3b82f6",
          border: "rgba(59, 130, 246, 0.4)"
        },
        shipped: {
          bg: "rgba(139, 92, 246, 0.2)",
          color: "#8b5cf6",
          border: "rgba(139, 92, 246, 0.4)"
        },
        completed: {
          bg: "rgba(16, 185, 129, 0.2)",
          color: "#10b981",
          border: "rgba(16, 185, 129, 0.4)"
        },
        cancelled: {
          bg: "rgba(239, 68, 68, 0.2)",
          color: "#ef4444",
          border: "rgba(239, 68, 68, 0.4)"
        }
      };
      return colors[status] || colors.pending;
    };
    const statusColors = getStatusColor(order.status);
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-container"
    }, /*#__PURE__*/React__default.default.createElement("style", null, `
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
      `), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-inner"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-header"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-kicker"
    }, "Order Details"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-header-top"
    }, /*#__PURE__*/React__default.default.createElement("h1", {
      className: "order-show-title"
    }, "Order #", order.id || "—"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-status",
      style: {
        background: statusColors.bg,
        color: statusColors.color,
        border: `1px solid ${statusColors.border}`
      }
    }, /*#__PURE__*/React__default.default.createElement("span", null, "\u25CF"), order.status?.toUpperCase() || "—"))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-summary"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-summary-row"
    }, /*#__PURE__*/React__default.default.createElement("span", {
      className: "order-show-summary-label"
    }, "Total Amount"), /*#__PURE__*/React__default.default.createElement("span", {
      className: "order-show-summary-value"
    }, formatCurrency(order.totalAmount)))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-section"
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      className: "order-show-section-title"
    }, "Order Information"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-grid"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-field"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "order-show-label"
    }, "Order ID"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-value highlight",
      style: {
        fontSize: "20px"
      }
    }, order.id || "—")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-field"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "order-show-label"
    }, "Total Amount"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-value highlight"
    }, formatCurrency(order.totalAmount))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-field"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "order-show-label"
    }, "Payment Method"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-value"
    }, order.paymentMethod ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1) : "—")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-field"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "order-show-label"
    }, "Status"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-value",
      style: {
        textTransform: "uppercase",
        fontWeight: "600",
        letterSpacing: "0.05em"
      }
    }, order.status || "—")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-field"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "order-show-label"
    }, "User ID"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-value",
      style: {
        fontFamily: "monospace",
        fontSize: "14px"
      }
    }, order.userId || "—")))), order.shippingAddress && /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-divider"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-section"
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      className: "order-show-section-title"
    }, "Shipping Address"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-address"
    }, order.shippingAddress))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-divider"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-section"
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      className: "order-show-section-title"
    }, "Timeline"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-status-timeline"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-timeline-item"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-timeline-label"
    }, "Created"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-timeline-value"
    }, formatDate(order.createdAt))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-timeline-item"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-timeline-label"
    }, "Last Updated"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-show-timeline-value"
    }, formatDate(order.updatedAt))))))));
  };

  const OrderItemShow = props => {
    const {
      record
    } = props;
    const [item, setItem] = React.useState(null);
    React.useEffect(() => {
      if (record && record.params) {
        setItem(record.params);
      }
    }, [record]);
    if (!item) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        className: "order-item-show-loading"
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
    const formatCurrency = value => {
      return `Rs.${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
    };
    const unitPrice = Number(item.unitPrice || 0);
    const quantity = Number(item.quantity || 0);
    const totalPrice = Number(item.totalPrice || 0);
    const savingsPerItem = unitPrice > 0 ? ((unitPrice * quantity - totalPrice) / (unitPrice * quantity) * 100).toFixed(2) : 0;
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-container"
    }, /*#__PURE__*/React__default.default.createElement("style", null, `
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
      `), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-inner"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-header"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-kicker"
    }, "Order Item Details"), /*#__PURE__*/React__default.default.createElement("h1", {
      className: "order-item-show-title"
    }, "Item #", item.id || "—"), /*#__PURE__*/React__default.default.createElement("p", {
      className: "order-item-show-subtitle"
    }, "Order ID: ", /*#__PURE__*/React__default.default.createElement("strong", null, "#", item.orderId || "—"), " \u2022 Product:", " ", /*#__PURE__*/React__default.default.createElement("strong", null, item.productId || "—"))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-pricing-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-section-title",
      style: {
        marginBottom: "16px"
      }
    }, "Pricing Breakdown"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-pricing-row"
    }, /*#__PURE__*/React__default.default.createElement("span", {
      className: "order-item-pricing-label"
    }, "Unit Price"), /*#__PURE__*/React__default.default.createElement("span", {
      className: "order-item-pricing-value"
    }, formatCurrency(unitPrice))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-pricing-row"
    }, /*#__PURE__*/React__default.default.createElement("span", {
      className: "order-item-pricing-label"
    }, "Quantity"), /*#__PURE__*/React__default.default.createElement("span", {
      className: "order-item-pricing-value"
    }, quantity, " ", quantity === 1 ? "item" : "items")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-pricing-row"
    }, /*#__PURE__*/React__default.default.createElement("span", {
      className: "order-item-pricing-label"
    }, "Subtotal"), /*#__PURE__*/React__default.default.createElement("span", {
      className: "order-item-pricing-value"
    }, formatCurrency(unitPrice * quantity))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-pricing-row",
      style: {
        borderBottom: "2px solid rgba(226, 191, 102, 0.3)",
        paddingTop: "16px",
        paddingBottom: "16px"
      }
    }, /*#__PURE__*/React__default.default.createElement("span", {
      className: "order-item-pricing-label"
    }, "Total Price"), /*#__PURE__*/React__default.default.createElement("span", {
      className: "order-item-pricing-value total"
    }, formatCurrency(totalPrice))), savingsPerItem > 0 && /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-pricing-row",
      style: {
        borderBottom: "none",
        paddingTop: "12px"
      }
    }, /*#__PURE__*/React__default.default.createElement("span", {
      className: "order-item-pricing-label"
    }, "Discount Applied"), /*#__PURE__*/React__default.default.createElement("span", {
      className: "order-item-pricing-value savings"
    }, "-", savingsPerItem, "%"))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-section"
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      className: "order-item-show-section-title"
    }, "Item Information"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-grid"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-field"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "order-item-show-label"
    }, "Item ID"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-value highlight",
      style: {
        fontSize: "20px"
      }
    }, item.id || "—")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-field"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "order-item-show-label"
    }, "Product ID"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-value large"
    }, item.productId || "—")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-field"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "order-item-show-label"
    }, "Order ID"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-value large"
    }, item.orderId || "—")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-field"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "order-item-show-label"
    }, "Unit Price"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-value highlight"
    }, formatCurrency(unitPrice))))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-divider"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-section"
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      className: "order-item-show-section-title"
    }, "Quantity & Totals"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px"
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-quantity-box"
    }, /*#__PURE__*/React__default.default.createElement("p", {
      className: "order-item-quantity-number"
    }, quantity), /*#__PURE__*/React__default.default.createElement("p", {
      className: "order-item-quantity-label"
    }, "Units Ordered")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-quantity-box"
    }, /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        color: "var(--gold)",
        fontSize: "28px",
        fontWeight: "700",
        margin: "0 0 8px"
      }
    }, formatCurrency(totalPrice)), /*#__PURE__*/React__default.default.createElement("p", {
      className: "order-item-quantity-label"
    }, "Total Amount")))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-divider"
    }), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-show-section"
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      className: "order-item-show-section-title"
    }, "Timeline"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-status-timeline"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-timeline-item"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-timeline-label"
    }, "Added"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-timeline-value"
    }, formatDate(item.createdAt))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-timeline-item"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-timeline-label"
    }, "Last Updated"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "order-item-timeline-value"
    }, formatDate(item.updatedAt))))))));
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.Dashboard = Dashboard;
  AdminJS.UserComponents.ProductCardsList = ProductCardsList;
  AdminJS.UserComponents.ProductShow = ProductShow;
  AdminJS.UserComponents.ProductImage = ProductImage;
  AdminJS.UserComponents.ProductImageUpload = ProductImageUpload;
  AdminJS.UserComponents.CategoryShow = CategoryShow;
  AdminJS.UserComponents.OrderShow = OrderShow;
  AdminJS.UserComponents.OrderItemShow = OrderItemShow;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9hZG1pbi9kYXNoYm9hcmQuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1jYXJkcy1saXN0LmpzeCIsIi4uL2FkbWluL3Byb2R1Y3Qtc2hvdy5qc3giLCIuLi9hZG1pbi9wcm9kdWN0LWltYWdlLmpzeCIsIi4uL2FkbWluL3Byb2R1Y3QtaW1hZ2UtdXBsb2FkLmpzeCIsIi4uL2FkbWluL2NhdGVnb3J5LXNob3cuanN4IiwiLi4vYWRtaW4vb3JkZXItc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1pdGVtLXNob3cuanN4IiwiZW50cnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IGZvcm1hdEN1cnJlbmN5ID0gKHZhbHVlKSA9PiB7XHJcbiAgcmV0dXJuIGBScy4ke051bWJlcih2YWx1ZSB8fCAwKS50b0xvY2FsZVN0cmluZygpfWA7XHJcbn07XHJcblxyXG5jb25zdCBEYXNoYm9hcmQgPSAoKSA9PiB7XHJcbiAgY29uc3QgW2RhdGEsIHNldERhdGFdID0gdXNlU3RhdGUoe1xyXG4gICAgdXNlcnM6IDAsXHJcbiAgICBjYXRlZ29yaWVzOiAwLFxyXG4gICAgcHJvZHVjdHM6IDAsXHJcbiAgICBvcmRlcnM6IDAsXHJcbiAgICByZXZlbnVlOiAwLFxyXG4gICAgZmVhdHVyZWRHZW1zOiAwLFxyXG4gICAgY3JpdGljYWxTdG9jazogMCxcclxuICAgIHJlY2VudFByb2R1Y3RzOiBbXSxcclxuICAgIGNhdGVnb3J5RGlzdHJpYnV0aW9uOiBbXSxcclxuICB9KTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnN0IGxvYWREYXNoYm9hcmQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvYWRtaW4vYXBpL2Rhc2hib2FyZFwiKTtcclxuICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgc2V0RGF0YShwYXlsb2FkIHx8IHt9KTtcclxuICAgIH07XHJcblxyXG4gICAgbG9hZERhc2hib2FyZCgpO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgY29uc3QgdG9wQ2F0ZWdvcmllcyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3QgZGlzdHJpYnV0aW9uID0gZGF0YS5jYXRlZ29yeURpc3RyaWJ1dGlvbiB8fCBbXTtcclxuICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLmRpc3RyaWJ1dGlvbi5tYXAoKGl0ZW0pID0+IGl0ZW0uY291bnQpLCAxKTtcclxuXHJcbiAgICByZXR1cm4gZGlzdHJpYnV0aW9uLm1hcCgoaXRlbSkgPT4gKHtcclxuICAgICAgLi4uaXRlbSxcclxuICAgICAgd2lkdGg6IGAke01hdGgubWF4KDgsIE1hdGgucm91bmQoKGl0ZW0uY291bnQgLyBtYXgpICogMTAwKSl9JWAsXHJcbiAgICB9KSk7XHJcbiAgfSwgW2RhdGEuY2F0ZWdvcnlEaXN0cmlidXRpb25dKTtcclxuXHJcbiAgY29uc3QgY29tcGxldGlvblJhdGUgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IHRvdGFsID0gTnVtYmVyKGRhdGEucHJvZHVjdHMgfHwgMCk7XHJcbiAgICBpZiAodG90YWwgPT09IDApIHtcclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaGVhbHRoeSA9IE1hdGgubWF4KHRvdGFsIC0gTnVtYmVyKGRhdGEuY3JpdGljYWxTdG9jayB8fCAwKSwgMCk7XHJcbiAgICByZXR1cm4gTWF0aC5yb3VuZCgoaGVhbHRoeSAvIHRvdGFsKSAqIDEwMCk7XHJcbiAgfSwgW2RhdGEucHJvZHVjdHMsIGRhdGEuY3JpdGljYWxTdG9ja10pO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWRhc2hib2FyZFwiPlxyXG4gICAgICA8c3R5bGU+e2BcclxuICAgICAgICAuY2hhbmdlOC1kYXNoYm9hcmQge1xyXG4gICAgICAgICAgLS1iZy0xOiB2YXIoLS1jaGFuZ2U4LWJnLTEsICMwNTA5MTQpO1xyXG4gICAgICAgICAgLS1iZy0yOiB2YXIoLS1jaGFuZ2U4LWJnLTIsICMwYjFhMzgpO1xyXG4gICAgICAgICAgLS1ncmFkLWVuZDogdmFyKC0tY2hhbmdlOC1ncmFkLWVuZCwgIzA0MDcwZik7XHJcbiAgICAgICAgICAtLWdvbGQ6IHZhcigtLWNoYW5nZTgtZ29sZCwgI2UyYmY2Nik7XHJcbiAgICAgICAgICAtLXRleHQtbWFpbjogdmFyKC0tY2hhbmdlOC10ZXh0LW1haW4sICNmOGZhZmMpO1xyXG4gICAgICAgICAgLS10ZXh0LW11dGVkOiB2YXIoLS1jaGFuZ2U4LXRleHQtbXV0ZWQsICM5YWE4YzEpO1xyXG4gICAgICAgICAgLS1saW5lOiB2YXIoLS1jaGFuZ2U4LWxpbmUsIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4yMikpO1xyXG4gICAgICAgICAgLS1jYXJkLWJnOiB2YXIoLS1jaGFuZ2U4LWNhcmQtYmcsIGxpbmVhci1ncmFkaWVudCgxNjBkZWcsIHJnYmEoMjEsIDM0LCA2NiwgMC45NikgMCUsIHJnYmEoMTAsIDE4LCAzNiwgMC45NikgMTAwJSkpO1xyXG4gICAgICAgICAgLS1zaGFkb3c6IHZhcigtLWNoYW5nZTgtc2hhZG93LCAwIDhweCAyNnB4IHJnYmEoMCwgMCwgMCwgMC4zKSk7XHJcbiAgICAgICAgICAtLXJhZGlhbC0xOiB2YXIoLS1jaGFuZ2U4LXJhZGlhbC0xLCByZ2JhKDM0LCA5MywgMTgwLCAwLjM1KSk7XHJcbiAgICAgICAgICAtLXJhZGlhbC0yOiB2YXIoLS1jaGFuZ2U4LXJhZGlhbC0yLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMTYpKTtcclxuXHJcbiAgICAgICAgICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICAgICAgICAgIHBhZGRpbmc6IDM2cHg7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tYWluKTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6XHJcbiAgICAgICAgICAgIHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgOCUgMCUsIHZhcigtLXJhZGlhbC0xKSAwJSwgcmdiYSgzNCwgOTMsIDE4MCwgMCkgMzglKSxcclxuICAgICAgICAgICAgcmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCA4NSUgMTIlLCB2YXIoLS1yYWRpYWwtMikgMCUsIHJnYmEoMjI2LCAxOTEsIDEwMiwgMCkgNDIlKSxcclxuICAgICAgICAgICAgbGluZWFyLWdyYWRpZW50KDEyMGRlZywgdmFyKC0tYmctMSkgMCUsIHZhcigtLWJnLTIpIDQ4JSwgdmFyKC0tZ3JhZC1lbmQpIDEwMCUpO1xyXG4gICAgICAgICAgZm9udC1mYW1pbHk6IFwiUG9wcGluc1wiLCBcIlNlZ29lIFVJXCIsIHNhbnMtc2VyaWY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgIC0tY2hhbmdlOC1iZy0xOiAjZjBmNmZmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWJnLTI6ICNmZmZmZmY7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtZ3JhZC1lbmQ6ICNmOGZiZmY7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtZ29sZDogI2MwOGIwZjtcclxuICAgICAgICAgIC0tY2hhbmdlOC10ZXh0LW1haW46ICMwZjE3MmE7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtdGV4dC1tdXRlZDogIzQ3NTU2OTtcclxuICAgICAgICAgIC0tY2hhbmdlOC1saW5lOiByZ2JhKDE1LCAyMywgNDIsIDAuMDgpO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWNhcmQtYmc6ICNmZmZmZmY7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtc2hhZG93OiAwIDRweCAyMHB4IHJnYmEoMTUsIDIzLCA0MiwgMC4wNik7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtcmFkaWFsLTE6IHJnYmEoMzQsIDkzLCAxODAsIDAuMDgpO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXJhZGlhbC0yOiByZ2JhKDE5MiwgMTM5LCAxNSwgMC4wNSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1kYXNoYm9hcmQtaW5uZXIge1xyXG4gICAgICAgICAgd2lkdGg6IG1pbigxMDAlLCAxNDQwcHgpO1xyXG4gICAgICAgICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1oZWFkZXIge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMzBweDtcclxuICAgICAgICAgIGFuaW1hdGlvbjogZmFkZS11cCA1MjBtcyBlYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgta2lja2VyIHtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjM2ZW07XHJcbiAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLWdvbGQpO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXRpdGxlIHtcclxuICAgICAgICAgIG1hcmdpbjogOHB4IDAgNnB4O1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDEuMDY7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgzMnB4LCA1dncsIDU2cHgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc3VidGl0bGUge1xyXG4gICAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtbWV0cmljLWdyaWQge1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDQsIG1pbm1heCgxNzBweCwgMWZyKSk7XHJcbiAgICAgICAgICBnYXA6IDIycHg7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAyNHB4O1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogNDhweDtcclxuICAgICAgICAgIHBhZGRpbmctYm90dG9tOiAyMHB4O1xyXG4gICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4xMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNoYW5nZTgtbWV0cmljLWdyaWQge1xyXG4gICAgICAgICAgYm9yZGVyLWJvdHRvbS1jb2xvcjogcmdiYSgxNSwgMjMsIDQyLCAwLjEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtY2FyZCB7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saW5lKTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDI0cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAyNHB4IDI0cHggMjJweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWNhcmQtYmcpO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogdmFyKC0tc2hhZG93KTtcclxuICAgICAgICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xyXG4gICAgICAgICAgYW5pbWF0aW9uOiBmYWRlLXVwIDU2MG1zIGVhc2U7XHJcbiAgICAgICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMTgwbXMgZWFzZSwgYm9yZGVyLWNvbG9yIDE4MG1zIGVhc2UsIGJveC1zaGFkb3cgMTgwbXMgZWFzZTtcclxuICAgICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtY2FyZDpob3ZlciB7XHJcbiAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTRweCk7XHJcbiAgICAgICAgICBib3JkZXItY29sb3I6IHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4zNCk7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDE2cHggMzRweCByZ2JhKDAsIDAsIDAsIDAuMzQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtY2FyZC1sYWJlbCB7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMThlbTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQtdmFsdWUge1xyXG4gICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgyNHB4LCAyLjh2dywgMzhweCk7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDAuOTU7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogLTAuMDNlbTtcclxuICAgICAgICAgIG92ZXJmbG93LXdyYXA6IGFueXdoZXJlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtY2FyZC1oaW50IHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDEycHg7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMS41O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtY2FyZC0tc3RhY2tlZCB7XHJcbiAgICAgICAgICBnYXA6IDJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQtLXN0YWNrZWQgLmNoYW5nZTgtY2FyZC1oaW50IHtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDZweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWxheW91dCB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xyXG4gICAgICAgICAgZ2FwOiAyOHB4O1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMzJweDtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBzdGFydDtcclxuICAgICAgICAgIHBhZGRpbmctdG9wOiAxMnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtZnVsbC13aWR0aC1zZWN0aW9uIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDI0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1jYXJkLS10YWxsIHtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgICBwYWRkaW5nLWJvdHRvbTogMjRweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNlY3Rpb24tZGl2aWRlciB7XHJcbiAgICAgICAgICBoZWlnaHQ6IDFweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyMjYsIDE5MSwgMTAyLCAwKSwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjI4KSwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwKSk7XHJcbiAgICAgICAgICBtYXJnaW46IDIwcHggMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2dyZXNzLXdyYXAge1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMTZweDtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9ncmVzcy1oZWFkIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogNnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZ3Jlc3MtdHJhY2sge1xyXG4gICAgICAgICAgaGVpZ2h0OiAxMnB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMTIpO1xyXG4gICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT0nbGlnaHQnXSAuY2hhbmdlOC1wcm9ncmVzcy10cmFjayB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDE1LCAyMywgNDIsIDAuMTIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZ3Jlc3MtZmlsbCB7XHJcbiAgICAgICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgI2Y1ZGY5MCAwJSwgI2UyYmY2NiAxMDAlKTtcclxuICAgICAgICAgIHRyYW5zaXRpb246IHdpZHRoIDMyMG1zIGVhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1yZWNlbnQtbGlzdCB7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAxNHB4O1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIGdhcDogMTBweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXJlY2VudC1pdGVtIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgZ2FwOiAxNnB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMTRweCAwO1xyXG4gICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT0nbGlnaHQnXSAuY2hhbmdlOC1yZWNlbnQtaXRlbSB7XHJcbiAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgxNSwgMjMsIDQyLCAwLjEyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXJlY2VudC1pdGVtOmxhc3QtY2hpbGQge1xyXG4gICAgICAgICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LW5hbWUge1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWRhdGUge1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJpY2Uge1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLWdvbGQpO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAa2V5ZnJhbWVzIGZhZGUtdXAge1xyXG4gICAgICAgICAgZnJvbSB7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg4cHgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdG8ge1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogMTE4MHB4KSB7XHJcbiAgICAgICAgICAuY2hhbmdlOC1tZXRyaWMtZ3JpZCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgxODBweCwgMWZyKSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbGF5b3V0IHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDcyMHB4KSB7XHJcbiAgICAgICAgICAuY2hhbmdlOC1kYXNoYm9hcmQge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAyMHB4IDE2cHggMjhweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1tZXRyaWMtZ3JpZCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gICAgICAgICAgICBnYXA6IDE2cHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDE4cHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIycHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbGF5b3V0IHtcclxuICAgICAgICAgICAgZ2FwOiAxNnB4O1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxOHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWNhcmQge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAyMHB4IDE4cHggMThweDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIGB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1kYXNoYm9hcmQtaW5uZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtaGVhZGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgta2lja2VyXCI+U2VjdGlvbiBWaWV3PC9kaXY+XHJcbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwiY2hhbmdlOC10aXRsZVwiPkRhc2hib2FyZDwvaDE+XHJcbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjaGFuZ2U4LXN1YnRpdGxlXCI+XHJcbiAgICAgICAgICAgIFRyYWNrIHlvdXIgY29tbWVyY2UgaGVhbHRoIGF0IGEgZ2xhbmNlIHdpdGggbGl2ZSBpbnZlbnRvcnkgYW5kIG9yZGVyXHJcbiAgICAgICAgICAgIHNpZ25hbHMuXHJcbiAgICAgICAgICA8L3A+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1tZXRyaWMtZ3JpZFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQgY2hhbmdlOC1jYXJkLS1zdGFja2VkXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+UmV2ZW51ZSBTdHJlYW08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtdmFsdWVcIj5cclxuICAgICAgICAgICAgICB7Zm9ybWF0Q3VycmVuY3koZGF0YS5yZXZlbnVlKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5BY3Jvc3MgYWxsIG9yZGVyczwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQgY2hhbmdlOC1jYXJkLS1zdGFja2VkXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+SW52ZW50b3J5IFNpemU8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtdmFsdWVcIj57ZGF0YS5wcm9kdWN0cyB8fCAwfTwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+VG90YWwgYWN0aXZlIGNhdGFsb2cgaXRlbXM8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkIGNoYW5nZTgtY2FyZC0tc3RhY2tlZFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPkZlYXR1cmVkIEdlbXM8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtdmFsdWVcIj57ZGF0YS5mZWF0dXJlZEdlbXMgfHwgMH08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPkN1cnJlbnRseSB2aXNpYmxlIHByb2R1Y3RzPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZCBjaGFuZ2U4LWNhcmQtLXN0YWNrZWRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5Dcml0aWNhbCBTdG9jazwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC12YWx1ZVwiPntkYXRhLmNyaXRpY2FsU3RvY2sgfHwgMH08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPkl0ZW1zIG5lZWRpbmcgdXJnZW50IHJlZmlsbDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1sYXlvdXRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkIGNoYW5nZTgtY2FyZC0tdGFsbFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPkNhdGVnb3J5IERpc3RyaWJ1dGlvbjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+SW52ZW50b3J5IHNwbGl0IGJ5IHNlZ21lbnQ8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1zZWN0aW9uLWRpdmlkZXJcIiAvPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLXdyYXBcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtaGVhZFwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+SGVhbHRoeSBzdG9jayBsZXZlbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e2NvbXBsZXRpb25SYXRlfSU8L3N0cm9uZz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtdHJhY2tcIj5cclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9ncmVzcy1maWxsXCJcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IGAke2NvbXBsZXRpb25SYXRlfSVgIH19XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIHsodG9wQ2F0ZWdvcmllcyB8fCBbXSkubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5ObyBjYXRlZ29yeSBkYXRhIHlldC48L2Rpdj5cclxuICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAodG9wQ2F0ZWdvcmllcyB8fCBbXSkubWFwKChjYXRlZ29yeSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBrZXk9e2NhdGVnb3J5Lm5hbWV9IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3Mtd3JhcFwiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtaGVhZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPntjYXRlZ29yeS5uYW1lfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPntjYXRlZ29yeS5jb3VudH08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9ncmVzcy10cmFja1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtZmlsbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogY2F0ZWdvcnkud2lkdGggfX1cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICkpXHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZCBjaGFuZ2U4LWNhcmQtLXRhbGxcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5SZWNlbnQgQWRkaXRpb25zPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5cclxuICAgICAgICAgICAgICBMYXRlc3QgcHJvZHVjdHMgZW50ZXJpbmcgdGhlIGNhdGFsb2dcclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtc2VjdGlvbi1kaXZpZGVyXCIgLz5cclxuXHJcbiAgICAgICAgICAgIHsoZGF0YS5yZWNlbnRQcm9kdWN0cyB8fCBbXSkubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIiBzdHlsZT17eyBtYXJnaW5Ub3A6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgTm8gcHJvZHVjdHMgYWRkZWQgeWV0LlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1yZWNlbnQtbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgeyhkYXRhLnJlY2VudFByb2R1Y3RzIHx8IFtdKS5tYXAoKHByb2R1Y3QpID0+IChcclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXJlY2VudC1pdGVtXCIga2V5PXtwcm9kdWN0LmlkfT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW5hbWVcIj57cHJvZHVjdC5uYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWRhdGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge25ldyBEYXRlKHByb2R1Y3QuY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoKX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcmljZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdEN1cnJlbmN5KHByb2R1Y3QucHJpY2UpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1mdWxsLXdpZHRoLXNlY3Rpb25cIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkIGNoYW5nZTgtY2FyZC0tdGFsbFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPk9yZGVycyBPdmVydmlldzwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+XHJcbiAgICAgICAgICAgICAgU3VtbWFyeSBvZiBhbGwgb3JkZXJzIGFuZCB0cmFuc2FjdGlvbnNcclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtc2VjdGlvbi1kaXZpZGVyXCIgLz5cclxuXHJcbiAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgICAgICAgICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcInJlcGVhdChhdXRvLWZpdCwgbWlubWF4KDIwMHB4LCAxZnIpKVwiLFxyXG4gICAgICAgICAgICAgICAgZ2FwOiBcIjIwcHhcIixcclxuICAgICAgICAgICAgICAgIG1hcmdpblRvcDogXCIxMnB4XCIsXHJcbiAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPlRvdGFsIE9yZGVyczwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtdmFsdWVcIlxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBtYXJnaW5Ub3A6IFwiOHB4XCIgfX1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAge2RhdGEub3JkZXJzIHx8IDB9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5Ub3RhbCBVc2VyczwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtdmFsdWVcIlxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBtYXJnaW5Ub3A6IFwiOHB4XCIgfX1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAge2RhdGEudXNlcnMgfHwgMH1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPlRvdGFsIFJldmVudWU8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCJcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgbWFyZ2luVG9wOiBcIjhweFwiLCBjb2xvcjogXCJ2YXIoLS1nb2xkKVwiIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtmb3JtYXRDdXJyZW5jeShkYXRhLnJldmVudWUpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZDtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IGdyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcInJlcGVhdChhdXRvLWZpbGwsIG1pbm1heCgyNDBweCwgMWZyKSlcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgY2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxNnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjgpXCIsXHJcbiAgYmFja2dyb3VuZDogXCJsaW5lYXItZ3JhZGllbnQoMTYwZGVnLCAjMGIxYTM4IDAlLCAjMDkxNjJmIDEwMCUpXCIsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG4gIG92ZXJmbG93OiBcImhpZGRlblwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDEycHggMjJweCByZ2JhKDIsIDYsIDIzLCAwLjI1KVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VXcmFwU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIGhlaWdodDogXCIxNjBweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IGJvZHlTdHlsZSA9IHtcclxuICBwYWRkaW5nOiBcIjE0cHhcIixcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBtZXRhU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbn07XHJcblxyXG5jb25zdCBiYWRnZVN0eWxlID0gKGlzQWN0aXZlKSA9PiAoe1xyXG4gIHdpZHRoOiBcImZpdC1jb250ZW50XCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDVlbVwiLFxyXG4gIHBhZGRpbmc6IFwiNXB4IDEwcHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiOTk5cHhcIixcclxuICBjb2xvcjogaXNBY3RpdmUgPyBcIiMxNDUzMmRcIiA6IFwiIzdmMWQxZFwiLFxyXG4gIGJhY2tncm91bmQ6IGlzQWN0aXZlID8gXCIjYmJmN2QwXCIgOiBcIiNmZWNhY2FcIixcclxufSk7XHJcblxyXG5jb25zdCBsaW5rU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtYmxvY2tcIixcclxuICBtYXJnaW5Ub3A6IFwiNHB4XCIsXHJcbiAgY29sb3I6IFwiIzkzYzVmZFwiLFxyXG4gIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgZm9udFdlaWdodDogNjAwLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBlbXB0eVN0eWxlID0ge1xyXG4gIHBhZGRpbmc6IFwiMThweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjQ1KVwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdFByaWNlID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgYW1vdW50ID0gTnVtYmVyKHZhbHVlIHx8IDApO1xyXG4gIGlmICghTnVtYmVyLmlzRmluaXRlKGFtb3VudCkpIHtcclxuICAgIHJldHVybiBcIjAuMDBcIjtcclxuICB9XHJcblxyXG4gIHJldHVybiBhbW91bnQudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBnZXRSZWNvcmRJZCA9IChyZWNvcmQpID0+IHtcclxuICByZXR1cm4gcmVjb3JkPy5wYXJhbXM/LmlkIHx8IHJlY29yZD8uaWQgfHwgcmVjb3JkPy5wYXJhbT8uaWQgfHwgXCJcIjtcclxufTtcclxuXHJcbmNvbnN0IGdldFNob3dIcmVmID0gKHJlY29yZCwgcmVzb3VyY2VJZCkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZEFjdGlvbnMgPSByZWNvcmQ/LnJlY29yZEFjdGlvbnMgfHwgcmVjb3JkPy5hY3Rpb25zIHx8IFtdO1xyXG4gIGNvbnN0IHNob3dBY3Rpb24gPSByZWNvcmRBY3Rpb25zLmZpbmQoKGFjdGlvbikgPT4gYWN0aW9uPy5uYW1lID09PSBcInNob3dcIik7XHJcbiAgY29uc3QgcmF3SHJlZiA9IHNob3dBY3Rpb24/LmhyZWYgfHwgcmVjb3JkPy5ocmVmIHx8IFwiXCI7XHJcblxyXG4gIGlmIChyYXdIcmVmKSB7XHJcbiAgICByZXR1cm4gcmF3SHJlZjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGlkID0gZ2V0UmVjb3JkSWQocmVjb3JkKTtcclxuICByZXR1cm4gaWRcclxuICAgID8gYC9hZG1pbi9yZXNvdXJjZXMvJHtlbmNvZGVVUklDb21wb25lbnQocmVzb3VyY2VJZCl9L3JlY29yZHMvJHtlbmNvZGVVUklDb21wb25lbnQoaWQpfS9zaG93YFxyXG4gICAgOiBcIlwiO1xyXG59O1xyXG5cclxuY29uc3QgUHJvZHVjdENhcmRzTGlzdCA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnN0IFthcGlSZWNvcmRzLCBzZXRBcGlSZWNvcmRzXSA9IHVzZVN0YXRlKFtdKTtcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgW2xvYWRFcnJvciwgc2V0TG9hZEVycm9yXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG5cclxuICBjb25zdCByZXNvdXJjZUlkID1cclxuICAgIHByb3BzPy5yZXNvdXJjZT8uaWQgPT09IFwiUHJvZHVjdFwiXHJcbiAgICAgID8gXCJQcm9kdWN0c1wiXHJcbiAgICAgIDogcHJvcHM/LnJlc291cmNlPy5pZCB8fCBcIlByb2R1Y3RzXCI7XHJcbiAgY29uc3QgcHJvcFJlY29yZHMgPSBwcm9wcz8ucmVjb3JkcyB8fCBbXTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChwcm9wUmVjb3Jkcy5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBpc01vdW50ZWQgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IGxvYWRSZWNvcmRzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICBzZXRMb2FkaW5nKHRydWUpO1xyXG4gICAgICBzZXRMb2FkRXJyb3IoXCJcIik7XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgICAgICBgL2FkbWluL2FwaS9yZXNvdXJjZXMvJHtlbmNvZGVVUklDb21wb25lbnQocmVzb3VyY2VJZCl9L2FjdGlvbnMvbGlzdGAsXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihwYXlsb2FkPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgcHJvZHVjdHNcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXNNb3VudGVkKSB7XHJcbiAgICAgICAgICBzZXRBcGlSZWNvcmRzKHBheWxvYWQ/LnJlY29yZHMgfHwgW10pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBpZiAoaXNNb3VudGVkKSB7XHJcbiAgICAgICAgICBzZXRMb2FkRXJyb3IoZXJyb3I/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gbG9hZCBwcm9kdWN0c1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWRSZWNvcmRzKCk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgaXNNb3VudGVkID0gZmFsc2U7XHJcbiAgICB9O1xyXG4gIH0sIFtwcm9wUmVjb3Jkcy5sZW5ndGgsIHJlc291cmNlSWRdKTtcclxuXHJcbiAgY29uc3QgcmVjb3JkcyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgcmV0dXJuIHByb3BSZWNvcmRzLmxlbmd0aCA/IHByb3BSZWNvcmRzIDogYXBpUmVjb3JkcztcclxuICB9LCBbcHJvcFJlY29yZHMsIGFwaVJlY29yZHNdKTtcclxuXHJcbiAgaWYgKGxvYWRpbmcpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5Mb2FkaW5nIHByb2R1Y3RzLi4uPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKGxvYWRFcnJvcikge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9Pntsb2FkRXJyb3J9PC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKCFyZWNvcmRzLmxlbmd0aCkge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9Pk5vIHByb2R1Y3RzIGZvdW5kLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtncmlkU3R5bGV9PlxyXG4gICAgICB7cmVjb3Jkcy5tYXAoKHJlY29yZCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9O1xyXG4gICAgICAgIGNvbnN0IGlkID0gZ2V0UmVjb3JkSWQocmVjb3JkKTtcclxuICAgICAgICBjb25zdCBuYW1lID0gcGFyYW1zPy5uYW1lIHx8IFwiVW5uYW1lZCBwcm9kdWN0XCI7XHJcbiAgICAgICAgY29uc3QgY2F0ZWdvcnkgPSBwYXJhbXM/LmNhdGVnb3J5SWQgfHwgXCItXCI7XHJcbiAgICAgICAgY29uc3QgaW1hZ2VVcmwgPSBwYXJhbXM/LmltYWdlVXJsIHx8IFwiXCI7XHJcbiAgICAgICAgY29uc3Qgc3RvY2sgPSBOdW1iZXIocGFyYW1zPy5zdG9jayB8fCAwKTtcclxuICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IEJvb2xlYW4ocGFyYW1zPy5pc0FjdGl2ZSk7XHJcbiAgICAgICAgY29uc3QgZGV0YWlsc0hyZWYgPSBnZXRTaG93SHJlZihyZWNvcmQsIHJlc291cmNlSWQpO1xyXG4gICAgICAgIGNvbnN0IG9wZW5EZXRhaWxzID0gKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGRldGFpbHNIcmVmKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oZGV0YWlsc0hyZWYpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICA8YXJ0aWNsZSBrZXk9e2lkfSBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW1hZ2VXcmFwU3R5bGV9PlxyXG4gICAgICAgICAgICAgIHtpbWFnZVVybCA/IChcclxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtpbWFnZVVybH0gYWx0PXtuYW1lfSBzdHlsZT17aW1hZ2VTdHlsZX0gLz5cclxuICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICBObyBpbWFnZVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtib2R5U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6IFwiMThweFwiLCBmb250V2VpZ2h0OiA3MDAgfX0+e25hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17bWV0YVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXY+Q2F0ZWdvcnk6IHtjYXRlZ29yeX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXY+U3RvY2s6IHtzdG9ja308L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXY+UHJpY2U6IFJzLiB7Zm9ybWF0UHJpY2UocGFyYW1zPy5wcmljZSl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2JhZGdlU3R5bGUoaXNBY3RpdmUpfT5cclxuICAgICAgICAgICAgICAgIHtpc0FjdGl2ZSA/IFwiQUNUSVZFXCIgOiBcIklOQUNUSVZFXCJ9XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgICAgICBocmVmPXtkZXRhaWxzSHJlZiB8fCBcIiNcIn1cclxuICAgICAgICAgICAgICAgIHN0eWxlPXtsaW5rU3R5bGV9XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgb3BlbkRldGFpbHMoKTtcclxuICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICBhcmlhLWRpc2FibGVkPXshZGV0YWlsc0hyZWZ9XHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgVmlldyBkZXRhaWxzXHJcbiAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICApO1xyXG4gICAgICB9KX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0Q2FyZHNMaXN0O1xyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBwYWdlU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjE4cHhcIixcclxuICBjb2xvcjogXCIjZTJlOGYwXCIsXHJcbn07XHJcblxyXG5jb25zdCBoZXJvU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJtaW5tYXgoMjgwcHgsIDM2MHB4KSAxZnJcIixcclxuICBnYXA6IFwiMThweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwic3RyZXRjaFwiLFxyXG59O1xyXG5cclxuY29uc3QgcGFuZWxTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMjBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjE4KVwiLFxyXG4gIGJhY2tncm91bmQ6XHJcbiAgICBcImxpbmVhci1ncmFkaWVudCgxNjBkZWcsIHJnYmEoMTEsIDI2LCA1NiwgMC45NikgMCUsIHJnYmEoOSwgMjIsIDQ3LCAwLjk2KSAxMDAlKVwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDIwcHggNDBweCByZ2JhKDIsIDYsIDIzLCAwLjI0KVwiLFxyXG4gIG92ZXJmbG93OiBcImhpZGRlblwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VXcmFwU3R5bGUgPSB7XHJcbiAgbWluSGVpZ2h0OiBcIjM2MHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjMGYxNzJhXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gIGRpc3BsYXk6IFwiYmxvY2tcIixcclxufTtcclxuXHJcbmNvbnN0IGhlcm9Cb2R5U3R5bGUgPSB7XHJcbiAgcGFkZGluZzogXCIyMnB4XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcImNsYW1wKDI4cHgsIDR2dywgNDZweClcIixcclxuICBsaW5lSGVpZ2h0OiAxLjA1LFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IHN1YnRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBiYWRnZVN0eWxlID0gKGFjdGl2ZSkgPT4gKHtcclxuICBkaXNwbGF5OiBcImlubGluZS1mbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gIHBhZGRpbmc6IFwiNnB4IDEycHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiOTk5cHhcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4wOGVtXCIsXHJcbiAgY29sb3I6IGFjdGl2ZSA/IFwiIzE0NTMyZFwiIDogXCIjN2YxZDFkXCIsXHJcbiAgYmFja2dyb3VuZDogYWN0aXZlID8gXCIjYmJmN2QwXCIgOiBcIiNmZWNhY2FcIixcclxufSk7XHJcblxyXG5jb25zdCBzdGF0c0dyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcInJlcGVhdCgzLCBtaW5tYXgoMTYwcHgsIDFmcikpXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxufTtcclxuXHJcbmNvbnN0IHN0YXRDYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE2cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xNSlcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTUsIDIzLCA0MiwgMC41OClcIixcclxuICBwYWRkaW5nOiBcIjE0cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHN0YXRMYWJlbFN0eWxlID0ge1xyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xNmVtXCIsXHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIG1hcmdpbkJvdHRvbTogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHN0YXRWYWx1ZVN0eWxlID0ge1xyXG4gIGZvbnRTaXplOiBcIjE2cHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG4gIHdvcmRCcmVhazogXCJicmVhay13b3JkXCIsXHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uR3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwibWlubWF4KDAsIDEuNGZyKSBtaW5tYXgoMjgwcHgsIDAuOWZyKVwiLFxyXG4gIGdhcDogXCIxOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uVGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgZm9udFNpemU6IFwiMTRweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTJlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgY29sb3I6IFwiI2Y1ZGY5MFwiLFxyXG59O1xyXG5cclxuY29uc3QgY29udGVudENhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMjBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjE4KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSgxMSwgMjYsIDU2LCAwLjkpXCIsXHJcbiAgcGFkZGluZzogXCIxOHB4XCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTZweCAyOHB4IHJnYmEoMiwgNiwgMjMsIDAuMTYpXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvTGlzdFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCIxMHB4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvTGFiZWxTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb1ZhbHVlU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZvbnRXZWlnaHQ6IDYwMCxcclxuICB0ZXh0QWxpZ246IFwicmlnaHRcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCBkZXNjcmlwdGlvblN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxuICBsaW5lSGVpZ2h0OiAxLjcsXHJcbiAgZm9udFNpemU6IFwiMTRweFwiLFxyXG4gIHdoaXRlU3BhY2U6IFwicHJlLXdyYXBcIixcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdEN1cnJlbmN5ID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgYW1vdW50ID0gTnVtYmVyKHZhbHVlIHx8IDApO1xyXG4gIHJldHVybiBgUnMuICR7YW1vdW50LnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gIH0pfWA7XHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXREYXRlID0gKHZhbHVlKSA9PiB7XHJcbiAgaWYgKCF2YWx1ZSkge1xyXG4gICAgcmV0dXJuIFwiLVwiO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKTtcclxuICBpZiAoTnVtYmVyLmlzTmFOKGRhdGUuZ2V0VGltZSgpKSkge1xyXG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0ZS50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIGRhdGVTdHlsZTogXCJtZWRpdW1cIixcclxuICAgIHRpbWVTdHlsZTogXCJzaG9ydFwiLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgUHJvZHVjdFNob3cgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCByZWNvcmQgPSBwcm9wcz8ucmVjb3JkO1xyXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9O1xyXG5cclxuICBjb25zdCBuYW1lID0gcGFyYW1zPy5uYW1lIHx8IFwiVW5uYW1lZCBwcm9kdWN0XCI7XHJcbiAgY29uc3Qgc2t1ID0gcGFyYW1zPy5za3UgfHwgXCItXCI7XHJcbiAgY29uc3QgY2F0ZWdvcnkgPSBwYXJhbXM/LmNhdGVnb3J5SWQgfHwgXCItXCI7XHJcbiAgY29uc3QgaW1hZ2VVcmwgPSBwYXJhbXM/LmltYWdlVXJsIHx8IFwiXCI7XHJcbiAgY29uc3Qgc3RvY2sgPSBOdW1iZXIocGFyYW1zPy5zdG9jayB8fCAwKTtcclxuICBjb25zdCBpc0FjdGl2ZSA9IEJvb2xlYW4ocGFyYW1zPy5pc0FjdGl2ZSk7XHJcbiAgY29uc3QgcHJpY2UgPSBmb3JtYXRDdXJyZW5jeShwYXJhbXM/LnByaWNlKTtcclxuICBjb25zdCBkZXNjcmlwdGlvbiA9XHJcbiAgICBwYXJhbXM/LmRlc2NyaXB0aW9uIHx8IFwiTm8gZGVzY3JpcHRpb24gYXZhaWxhYmxlIGZvciB0aGlzIHByb2R1Y3QuXCI7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+XHJcbiAgICAgICAge2BcclxuICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA5ODBweCkge1xyXG4gICAgICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LXNob3ctaGVybyxcclxuICAgICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LXNlY3Rpb25zIHtcclxuICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgYH1cclxuICAgICAgPC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LXNob3ctaGVyb1wiIHN0eWxlPXtoZXJvU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3BhbmVsU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW1hZ2VXcmFwU3R5bGV9PlxyXG4gICAgICAgICAgICB7aW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgPGltZyBzcmM9e2ltYWdlVXJsfSBhbHQ9e25hbWV9IHN0eWxlPXtpbWFnZVN0eWxlfSAvPlxyXG4gICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICBObyBpbWFnZSBhdmFpbGFibGVcclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtwYW5lbFN0eWxlfT5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2hlcm9Cb2R5U3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxoMSBzdHlsZT17dGl0bGVTdHlsZX0+e25hbWV9PC9oMT5cclxuICAgICAgICAgICAgICA8cCBzdHlsZT17c3VidGl0bGVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICBDbGVhbiBwcm9kdWN0IG92ZXJ2aWV3IGZvciBxdWljayByZXZpZXcgYW5kIG1hbmFnZW1lbnQuXHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2JhZGdlU3R5bGUoaXNBY3RpdmUpfT5cclxuICAgICAgICAgICAgICB7aXNBY3RpdmUgPyBcIkFDVElWRVwiIDogXCJJTkFDVElWRVwifVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRzR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0Q2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRMYWJlbFN0eWxlfT5QcmljZTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdFZhbHVlU3R5bGV9PntwcmljZX08L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0Q2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRMYWJlbFN0eWxlfT5TdG9jazwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdFZhbHVlU3R5bGV9PntzdG9ja308L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0Q2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRMYWJlbFN0eWxlfT5TS1U8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRWYWx1ZVN0eWxlfT57c2t1fTwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LXNob3ctc2VjdGlvbnNcIiBzdHlsZT17c2VjdGlvbkdyaWRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17Y29udGVudENhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5EZXNjcmlwdGlvbjwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTIgfX0gLz5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2Rlc2NyaXB0aW9uU3R5bGV9PntkZXNjcmlwdGlvbn08L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17Y29udGVudENhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5Qcm9kdWN0IERldGFpbHM8L2gyPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvTGlzdFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PkNhdGVnb3J5PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvVmFsdWVTdHlsZX0+e2NhdGVnb3J5fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9MYWJlbFN0eWxlfT5DcmVhdGVkIEF0PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvVmFsdWVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShwYXJhbXM/LmNyZWF0ZWRBdCl9XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PlVwZGF0ZWQgQXQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIHtmb3JtYXREYXRlKHBhcmFtcz8udXBkYXRlZEF0KX1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvTGFiZWxTdHlsZX0+UmVjb3JkIElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvVmFsdWVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICB7cGFyYW1zPy5pZCB8fCByZWNvcmQ/LmlkIHx8IFwiLVwifVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdFNob3c7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBjZWxsU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIG1pbkhlaWdodDogXCI1NnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjY0cHhcIixcclxuICBoZWlnaHQ6IFwiNDJweFwiLFxyXG4gIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMzUpXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZjhmYWZjXCIsXHJcbiAgZmxleFNocmluazogMCxcclxufTtcclxuXHJcbmNvbnN0IGZhbGxiYWNrU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiNjRweFwiLFxyXG4gIGhlaWdodDogXCI0MnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBib3JkZXI6IFwiMXB4IGRhc2hlZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuNilcIixcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBjb2xvcjogXCIjNjQ3NDhiXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZjhmYWZjXCIsXHJcbiAgZmxleFNocmluazogMCxcclxufTtcclxuXHJcbmNvbnN0IHRleHRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLFxyXG4gIGdhcDogXCIycHhcIixcclxufTtcclxuXHJcbmNvbnN0IFByb2R1Y3RJbWFnZSA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnN0IGltYWdlVXJsID0gcHJvcHM/LnJlY29yZD8ucGFyYW1zPy5bcHJvcHM/LnByb3BlcnR5Py5wYXRoXTtcclxuICBjb25zdCBbaGFzRXJyb3IsIHNldEhhc0Vycm9yXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIHNldEhhc0Vycm9yKGZhbHNlKTtcclxuICB9LCBbaW1hZ2VVcmxdKTtcclxuXHJcbiAgaWYgKCFpbWFnZVVybCkge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2ZhbGxiYWNrU3R5bGV9Pk5vIGltYWdlPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKGhhc0Vycm9yKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IHN0eWxlPXtjZWxsU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2ZhbGxiYWNrU3R5bGV9PkludmFsaWQ8L2Rpdj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt0ZXh0U3R5bGV9PlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogNjAwLCBjb2xvcjogXCIjMGYxNzJhXCIgfX0+SW1hZ2UgVVJMPC9zcGFuPlxyXG4gICAgICAgICAgPGFcclxuICAgICAgICAgICAgaHJlZj17aW1hZ2VVcmx9XHJcbiAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXHJcbiAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxyXG4gICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBcIiMyNTYzZWJcIixcclxuICAgICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsXHJcbiAgICAgICAgICAgICAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBPcGVuIGxpbmtcclxuICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e2NlbGxTdHlsZX0+XHJcbiAgICAgIDxpbWdcclxuICAgICAgICBzcmM9e2ltYWdlVXJsfVxyXG4gICAgICAgIGFsdD1cIlByb2R1Y3RcIlxyXG4gICAgICAgIHN0eWxlPXtpbWFnZVN0eWxlfVxyXG4gICAgICAgIG9uRXJyb3I9eygpID0+IHNldEhhc0Vycm9yKHRydWUpfVxyXG4gICAgICAvPlxyXG4gICAgICA8ZGl2IHN0eWxlPXt0ZXh0U3R5bGV9PlxyXG4gICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IFwiIzBmMTcyYVwiIH19PlByZXZpZXc8L3NwYW4+XHJcbiAgICAgICAgPGFcclxuICAgICAgICAgIGhyZWY9e2ltYWdlVXJsfVxyXG4gICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcclxuICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxyXG4gICAgICAgICAgc3R5bGU9e3sgY29sb3I6IFwiIzI1NjNlYlwiLCB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIE9wZW4gaW1hZ2VcclxuICAgICAgICA8L2E+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RJbWFnZTtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHdyYXBwZXJTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBwcmV2aWV3U3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTQwcHhcIixcclxuICBoZWlnaHQ6IFwiOTZweFwiLFxyXG4gIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMzUpXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBoaW50U3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gIGNvbG9yOiBcIiM2NDc0OGJcIixcclxufTtcclxuXHJcbmNvbnN0IFByb2R1Y3RJbWFnZVVwbG9hZCA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnN0IHsgb25DaGFuZ2UsIHJlY29yZCB9ID0gcHJvcHM7XHJcbiAgY29uc3QgY3VycmVudFZhbHVlID0gcmVjb3JkPy5wYXJhbXM/LmltYWdlVXJsIHx8IFwiXCI7XHJcbiAgY29uc3QgY3VycmVudFB1YmxpY0lkID0gcmVjb3JkPy5wYXJhbXM/LmltYWdlUHVibGljSWQgfHwgXCJcIjtcclxuICBjb25zdCBbcHJldmlld1VybCwgc2V0UHJldmlld1VybF0gPSB1c2VTdGF0ZShjdXJyZW50VmFsdWUpO1xyXG4gIGNvbnN0IFtwdWJsaWNJZCwgc2V0UHVibGljSWRdID0gdXNlU3RhdGUoY3VycmVudFB1YmxpY0lkKTtcclxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBzZXRQcmV2aWV3VXJsKGN1cnJlbnRWYWx1ZSk7XHJcbiAgICBzZXRQdWJsaWNJZChjdXJyZW50UHVibGljSWQpO1xyXG4gIH0sIFtjdXJyZW50VmFsdWUsIGN1cnJlbnRQdWJsaWNJZF0pO1xyXG5cclxuICBjb25zdCBoYW5kbGVVcGxvYWQgPSBhc3luYyAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXTtcclxuXHJcbiAgICBpZiAoIWZpbGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFVwbG9hZGluZyh0cnVlKTtcclxuICAgIHNldEVycm9yKFwiXCIpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgIGZvcm1EYXRhLmFwcGVuZChcImltYWdlXCIsIGZpbGUpO1xyXG5cclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hcGkvdXBsb2Fkcy9pbWFnZVwiLCB7XHJcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihwYXlsb2FkLm1lc3NhZ2UgfHwgXCJJbWFnZSB1cGxvYWQgZmFpbGVkXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB1cGxvYWRlZFVybCA9IHBheWxvYWQudXJsIHx8IFwiXCI7XHJcbiAgICAgIGNvbnN0IHVwbG9hZGVkUHVibGljSWQgPSBwYXlsb2FkLnB1YmxpY0lkIHx8IFwiXCI7XHJcbiAgICAgIHNldFByZXZpZXdVcmwodXBsb2FkZWRVcmwpO1xyXG4gICAgICBzZXRQdWJsaWNJZCh1cGxvYWRlZFB1YmxpY0lkKTtcclxuICAgICAgb25DaGFuZ2U/LihcImltYWdlVXJsXCIsIHVwbG9hZGVkVXJsKTtcclxuICAgICAgb25DaGFuZ2U/LihcImltYWdlUHVibGljSWRcIiwgdXBsb2FkZWRQdWJsaWNJZCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJ1cGxvYWRJbWFnZVwiLCB1cGxvYWRlZFVybCk7XHJcbiAgICB9IGNhdGNoICh1cGxvYWRFcnJvcikge1xyXG4gICAgICBzZXRFcnJvcih1cGxvYWRFcnJvci5tZXNzYWdlKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNldFVwbG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9IFwiXCI7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlUmVtb3ZlID0gKCkgPT4ge1xyXG4gICAgc2V0UHJldmlld1VybChcIlwiKTtcclxuICAgIHNldFB1YmxpY0lkKFwiXCIpO1xyXG4gICAgb25DaGFuZ2U/LihcImltYWdlVXJsXCIsIFwiXCIpO1xyXG4gICAgb25DaGFuZ2U/LihcImltYWdlUHVibGljSWRcIiwgXCJcIik7XHJcbiAgICBvbkNoYW5nZT8uKFwidXBsb2FkSW1hZ2VcIiwgXCJcIik7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3dyYXBwZXJTdHlsZX0+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17aGFuZGxlVXBsb2FkfSAvPlxyXG4gICAgICA8ZGl2IHN0eWxlPXtoaW50U3R5bGV9PlxyXG4gICAgICAgIHt1cGxvYWRpbmdcclxuICAgICAgICAgID8gXCJVcGxvYWRpbmcgdG8gQ2xvdWRpbmFyeS4uLlwiXHJcbiAgICAgICAgICA6IFwiQ2hvb3NlIGFuIGltYWdlIGZpbGUgdG8gdXBsb2FkXCJ9XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAge3ByZXZpZXdVcmwgPyAoXHJcbiAgICAgICAgPD5cclxuICAgICAgICAgIDxpbWcgc3JjPXtwcmV2aWV3VXJsfSBhbHQ9XCJQcm9kdWN0IHByZXZpZXdcIiBzdHlsZT17cHJldmlld1N0eWxlfSAvPlxyXG4gICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgb25DbGljaz17aGFuZGxlUmVtb3ZlfVxyXG4gICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgIHdpZHRoOiBcImZpdC1jb250ZW50XCIsXHJcbiAgICAgICAgICAgICAgcGFkZGluZzogXCI2cHggMTBweFwiLFxyXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCI4cHhcIixcclxuICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkICNlZjQ0NDRcIixcclxuICAgICAgICAgICAgICBjb2xvcjogXCIjZWY0NDQ0XCIsXHJcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCIjZmZmXCIsXHJcbiAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgUmVtb3ZlIGltYWdlXHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8Lz5cclxuICAgICAgKSA6IG51bGx9XHJcblxyXG4gICAgICB7ZXJyb3IgPyAoXHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyAuLi5oaW50U3R5bGUsIGNvbG9yOiBcIiNkYzI2MjZcIiB9fT57ZXJyb3J9PC9kaXY+XHJcbiAgICAgICkgOiBudWxsfVxyXG5cclxuICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiaW1hZ2VVcmxcIiB2YWx1ZT17cHJldmlld1VybH0gcmVhZE9ubHkgLz5cclxuICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiaW1hZ2VQdWJsaWNJZFwiIHZhbHVlPXtwdWJsaWNJZH0gcmVhZE9ubHkgLz5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0SW1hZ2VVcGxvYWQ7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBDYXRlZ29yeVNob3cgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCB7IHJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzO1xyXG4gIGNvbnN0IFtjYXRlZ29yeSwgc2V0Q2F0ZWdvcnldID0gdXNlU3RhdGUobnVsbCk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAocmVjb3JkICYmIHJlY29yZC5wYXJhbXMpIHtcclxuICAgICAgc2V0Q2F0ZWdvcnkocmVjb3JkLnBhcmFtcyk7XHJcbiAgICB9XHJcbiAgfSwgW3JlY29yZF0pO1xyXG5cclxuICBpZiAoIWNhdGVnb3J5KSB7XHJcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWxvYWRpbmdcIj5Mb2FkaW5nLi4uPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZm9ybWF0RGF0ZSA9IChkYXRlKSA9PiB7XHJcbiAgICBpZiAoIWRhdGUpIHJldHVybiBcIuKAlFwiO1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUpLnRvTG9jYWxlRGF0ZVN0cmluZyhcImVuLVVTXCIsIHtcclxuICAgICAgICB5ZWFyOiBcIm51bWVyaWNcIixcclxuICAgICAgICBtb250aDogXCJsb25nXCIsXHJcbiAgICAgICAgZGF5OiBcIm51bWVyaWNcIixcclxuICAgICAgICBob3VyOiBcIjItZGlnaXRcIixcclxuICAgICAgICBtaW51dGU6IFwiMi1kaWdpdFwiLFxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICByZXR1cm4gXCLigJRcIjtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWNvbnRhaW5lclwiPlxyXG4gICAgICA8c3R5bGU+e2BcclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1jb250YWluZXIge1xyXG4gICAgICAgICAgLS1iZy0xOiB2YXIoLS1jaGFuZ2U4LWJnLTEsICMwNTA5MTQpO1xyXG4gICAgICAgICAgLS1nb2xkOiB2YXIoLS1jaGFuZ2U4LWdvbGQsICNlMmJmNjYpO1xyXG4gICAgICAgICAgLS10ZXh0LW1haW46IHZhcigtLWNoYW5nZTgtdGV4dC1tYWluLCAjZjhmYWZjKTtcclxuICAgICAgICAgIC0tdGV4dC1tdXRlZDogdmFyKC0tY2hhbmdlOC10ZXh0LW11dGVkLCAjOWFhOGMxKTtcclxuICAgICAgICAgIC0tbGluZTogdmFyKC0tY2hhbmdlOC1saW5lLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMjIpKTtcclxuICAgICAgICAgIC0tY2FyZC1iZzogdmFyKC0tY2hhbmdlOC1jYXJkLWJnLCBsaW5lYXItZ3JhZGllbnQoMTYwZGVnLCByZ2JhKDIxLCAzNCwgNjYsIDAuOTYpIDAlLCByZ2JhKDEwLCAxOCwgMzYsIDAuOTYpIDEwMCUpKTtcclxuICAgICAgICAgIC0tc2hhZG93OiB2YXIoLS1jaGFuZ2U4LXNoYWRvdywgMCA4cHggMjZweCByZ2JhKDAsIDAsIDAsIDAuMykpO1xyXG5cclxuICAgICAgICAgIHBhZGRpbmc6IDMycHg7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tYWluKTtcclxuICAgICAgICAgIGZvbnQtZmFtaWx5OiBcIlBvcHBpbnNcIiwgXCJTZWdvZSBVSVwiLCBzYW5zLXNlcmlmO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEyMGRlZywgdmFyKC0tYmctMSkgMCUsIHJnYmEoMTEsIDI2LCA1NiwgMC44KSA1MCUsIHZhcigtLWJnLTEpIDEwMCUpO1xyXG4gICAgICAgICAgbWluLWhlaWdodDogMTAwdmg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNhdGVnb3J5LXNob3ctY29udGFpbmVyIHtcclxuICAgICAgICAgIC0tY2hhbmdlOC1iZy0xOiAjZjBmNmZmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWdvbGQ6ICNjMDhiMGY7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtdGV4dC1tYWluOiAjMGYxNzJhO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXRleHQtbXV0ZWQ6ICM0NzU1Njk7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtbGluZTogcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgICAgICAgIC0tY2hhbmdlOC1jYXJkLWJnOiAjZmZmZmZmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXNoYWRvdzogMCA0cHggMjBweCByZ2JhKDE1LCAyMywgNDIsIDAuMDYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctaW5uZXIge1xyXG4gICAgICAgICAgbWF4LXdpZHRoOiA5MDBweDtcclxuICAgICAgICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctaGVhZGVyIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDMycHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1raWNrZXIge1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4zNmVtO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXRpdGxlIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogY2xhbXAoMzJweCwgNXZ3LCA0OHB4KTtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMS4xO1xyXG4gICAgICAgICAgbWFyZ2luOiAwIDAgOHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctc3RhdHVzIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGdhcDogOHB4O1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMTJweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDZweCAxMnB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMjBweDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMTJlbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXN0YXR1cy5hY3RpdmUge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgzNCwgMTk3LCA5NCwgMC4yKTtcclxuICAgICAgICAgIGNvbG9yOiAjMjJjNTVlO1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgzNCwgMTk3LCA5NCwgMC40KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXN0YXR1cy5pbmFjdGl2ZSB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDIzOSwgNjgsIDY4LCAwLjIpO1xyXG4gICAgICAgICAgY29sb3I6ICNlZjQ0NDQ7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDIzOSwgNjgsIDY4LCAwLjQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctY2FyZCB7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saW5lKTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDI0cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAzMnB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tY2FyZC1iZyk7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiB2YXIoLS1zaGFkb3cpO1xyXG4gICAgICAgICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDRweCk7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xyXG4gICAgICAgICAgYW5pbWF0aW9uOiBmYWRlLXVwIDU2MG1zIGVhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1zZWN0aW9uLXRpdGxlIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMThlbTtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctc2VjdGlvbiB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyOHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctc2VjdGlvbjpsYXN0LWNoaWxkIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1maWVsZCB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctZmllbGQ6bGFzdC1jaGlsZCB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctbGFiZWwge1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xOGVtO1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogOHB4O1xyXG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy12YWx1ZSB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tYWluKTtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjY7XHJcbiAgICAgICAgICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctdmFsdWUuZ29sZCB7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctZGVzY3JpcHRpb24ge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjIpO1xyXG4gICAgICAgICAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgIHBhZGRpbmc6IDE2cHggMjBweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjc7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNhdGVnb3J5LXNob3ctZGVzY3JpcHRpb24ge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNSwgMjMsIDQyLCAwLjA1KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWRldGFpbHMtZ3JpZCB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoYXV0by1maXQsIG1pbm1heCgyMDBweCwgMWZyKSk7XHJcbiAgICAgICAgICBnYXA6IDI0cHg7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAxNnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctZGV0YWlsLWl0ZW0ge1xyXG4gICAgICAgICAgcGFkZGluZzogMTZweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xKTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saW5lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT0nbGlnaHQnXSAuY2F0ZWdvcnktc2hvdy1kZXRhaWwtaXRlbSB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDE1LCAyMywgNDIsIDAuMDMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctZGl2aWRlciB7XHJcbiAgICAgICAgICBoZWlnaHQ6IDFweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyMjYsIDE5MSwgMTAyLCAwKSwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjI4KSwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwKSk7XHJcbiAgICAgICAgICBtYXJnaW46IDI0cHggMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBrZXlmcmFtZXMgZmFkZS11cCB7XHJcbiAgICAgICAgICBmcm9tIHtcclxuICAgICAgICAgICAgb3BhY2l0eTogMDtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDhweCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0byB7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA3MjBweCkge1xyXG4gICAgICAgICAgLmNhdGVnb3J5LXNob3ctY29udGFpbmVyIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMjBweCAxNnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jYXRlZ29yeS1zaG93LWNhcmQge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAyNHB4IDIwcHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNhdGVnb3J5LXNob3ctZGV0YWlscy1ncmlkIHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBgfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctaW5uZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctaGVhZGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3cta2lja2VyXCI+Q2F0ZWdvcnkgT3ZlcnZpZXc8L2Rpdj5cclxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXRpdGxlXCI+e2NhdGVnb3J5Lm5hbWUgfHwgXCLigJRcIn08L2gxPlxyXG4gICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICBjbGFzc05hbWU9e2BjYXRlZ29yeS1zaG93LXN0YXR1cyAke2NhdGVnb3J5LmlzQWN0aXZlID8gXCJhY3RpdmVcIiA6IFwiaW5hY3RpdmVcIn1gfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICA8c3Bhbj7il488L3NwYW4+XHJcbiAgICAgICAgICAgIHtjYXRlZ29yeS5pc0FjdGl2ZSA/IFwiQWN0aXZlXCIgOiBcIkluYWN0aXZlXCJ9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXNlY3Rpb24tdGl0bGVcIj5EZXNjcmlwdGlvbjwvaDM+XHJcbiAgICAgICAgICAgIHtjYXRlZ29yeS5kZXNjcmlwdGlvbiA/IChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGVzY3JpcHRpb25cIj5cclxuICAgICAgICAgICAgICAgIHtjYXRlZ29yeS5kZXNjcmlwdGlvbn1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXZhbHVlXCJcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLXRleHQtbXV0ZWQpXCIgfX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICBObyBkZXNjcmlwdGlvbiBwcm92aWRlZFxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRpdmlkZXJcIiAvPlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXNlY3Rpb24tdGl0bGVcIj5EZXRhaWxzPC9oMz5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kZXRhaWxzLWdyaWRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGV0YWlsLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWxhYmVsXCI+Q2F0ZWdvcnkgSUQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXZhbHVlIGdvbGRcIlxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiBcIm1vbm9zcGFjZVwiLCBmb250U2l6ZTogXCIxNHB4XCIgfX1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAge2NhdGVnb3J5LmlkIHx8IFwi4oCUXCJ9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1sYWJlbFwiPlNsdWc8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXZhbHVlXCI+XHJcbiAgICAgICAgICAgICAgICAgIHtjYXRlZ29yeS5zbHVnIHx8IFwi4oCUXCJ9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGl2aWRlclwiIC8+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXNlY3Rpb25cIj5cclxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctc2VjdGlvbi10aXRsZVwiPlRpbWVsaW5lPC9oMz5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kZXRhaWxzLWdyaWRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGV0YWlsLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWxhYmVsXCI+Q3JlYXRlZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctdmFsdWVcIj5cclxuICAgICAgICAgICAgICAgICAge2Zvcm1hdERhdGUoY2F0ZWdvcnkuY3JlYXRlZEF0KX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGV0YWlsLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWxhYmVsXCI+TGFzdCBVcGRhdGVkPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy12YWx1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShjYXRlZ29yeS51cGRhdGVkQXQpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IENhdGVnb3J5U2hvdztcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IE9yZGVyU2hvdyA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnN0IHsgcmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW29yZGVyLCBzZXRPcmRlcl0gPSB1c2VTdGF0ZShudWxsKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChyZWNvcmQgJiYgcmVjb3JkLnBhcmFtcykge1xyXG4gICAgICBzZXRPcmRlcihyZWNvcmQucGFyYW1zKTtcclxuICAgIH1cclxuICB9LCBbcmVjb3JkXSk7XHJcblxyXG4gIGlmICghb3JkZXIpIHtcclxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctbG9hZGluZ1wiPkxvYWRpbmcuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBjb25zdCBmb3JtYXREYXRlID0gKGRhdGUpID0+IHtcclxuICAgIGlmICghZGF0ZSkgcmV0dXJuIFwi4oCUXCI7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gbmV3IERhdGUoZGF0ZSkudG9Mb2NhbGVEYXRlU3RyaW5nKFwiZW4tVVNcIiwge1xyXG4gICAgICAgIHllYXI6IFwibnVtZXJpY1wiLFxyXG4gICAgICAgIG1vbnRoOiBcImxvbmdcIixcclxuICAgICAgICBkYXk6IFwibnVtZXJpY1wiLFxyXG4gICAgICAgIGhvdXI6IFwiMi1kaWdpdFwiLFxyXG4gICAgICAgIG1pbnV0ZTogXCIyLWRpZ2l0XCIsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIHJldHVybiBcIuKAlFwiO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGZvcm1hdEN1cnJlbmN5ID0gKHZhbHVlKSA9PiB7XHJcbiAgICByZXR1cm4gYFJzLiR7TnVtYmVyKHZhbHVlIHx8IDApLnRvTG9jYWxlU3RyaW5nKFwiZW4tSU5cIiwge1xyXG4gICAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIH0pfWA7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZ2V0U3RhdHVzQ29sb3IgPSAoc3RhdHVzKSA9PiB7XHJcbiAgICBjb25zdCBjb2xvcnMgPSB7XHJcbiAgICAgIHBlbmRpbmc6IHtcclxuICAgICAgICBiZzogXCJyZ2JhKDI1MSwgMTkxLCAzNiwgMC4yKVwiLFxyXG4gICAgICAgIGNvbG9yOiBcIiNmYmJmMjRcIixcclxuICAgICAgICBib3JkZXI6IFwicmdiYSgyNTEsIDE5MSwgMzYsIDAuNClcIixcclxuICAgICAgfSxcclxuICAgICAgcGFpZDoge1xyXG4gICAgICAgIGJnOiBcInJnYmEoMzQsIDE5NywgOTQsIDAuMilcIixcclxuICAgICAgICBjb2xvcjogXCIjMjJjNTVlXCIsXHJcbiAgICAgICAgYm9yZGVyOiBcInJnYmEoMzQsIDE5NywgOTQsIDAuNClcIixcclxuICAgICAgfSxcclxuICAgICAgcHJvY2Vzc2luZzoge1xyXG4gICAgICAgIGJnOiBcInJnYmEoNTksIDEzMCwgMjQ2LCAwLjIpXCIsXHJcbiAgICAgICAgY29sb3I6IFwiIzNiODJmNlwiLFxyXG4gICAgICAgIGJvcmRlcjogXCJyZ2JhKDU5LCAxMzAsIDI0NiwgMC40KVwiLFxyXG4gICAgICB9LFxyXG4gICAgICBzaGlwcGVkOiB7XHJcbiAgICAgICAgYmc6IFwicmdiYSgxMzksIDkyLCAyNDYsIDAuMilcIixcclxuICAgICAgICBjb2xvcjogXCIjOGI1Y2Y2XCIsXHJcbiAgICAgICAgYm9yZGVyOiBcInJnYmEoMTM5LCA5MiwgMjQ2LCAwLjQpXCIsXHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbXBsZXRlZDoge1xyXG4gICAgICAgIGJnOiBcInJnYmEoMTYsIDE4NSwgMTI5LCAwLjIpXCIsXHJcbiAgICAgICAgY29sb3I6IFwiIzEwYjk4MVwiLFxyXG4gICAgICAgIGJvcmRlcjogXCJyZ2JhKDE2LCAxODUsIDEyOSwgMC40KVwiLFxyXG4gICAgICB9LFxyXG4gICAgICBjYW5jZWxsZWQ6IHtcclxuICAgICAgICBiZzogXCJyZ2JhKDIzOSwgNjgsIDY4LCAwLjIpXCIsXHJcbiAgICAgICAgY29sb3I6IFwiI2VmNDQ0NFwiLFxyXG4gICAgICAgIGJvcmRlcjogXCJyZ2JhKDIzOSwgNjgsIDY4LCAwLjQpXCIsXHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGNvbG9yc1tzdGF0dXNdIHx8IGNvbG9ycy5wZW5kaW5nO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHN0YXR1c0NvbG9ycyA9IGdldFN0YXR1c0NvbG9yKG9yZGVyLnN0YXR1cyk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctY29udGFpbmVyXCI+XHJcbiAgICAgIDxzdHlsZT57YFxyXG4gICAgICAgIC5vcmRlci1zaG93LWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAtLWJnLTE6IHZhcigtLWNoYW5nZTgtYmctMSwgIzA1MDkxNCk7XHJcbiAgICAgICAgICAtLWdvbGQ6IHZhcigtLWNoYW5nZTgtZ29sZCwgI2UyYmY2Nik7XHJcbiAgICAgICAgICAtLXRleHQtbWFpbjogdmFyKC0tY2hhbmdlOC10ZXh0LW1haW4sICNmOGZhZmMpO1xyXG4gICAgICAgICAgLS10ZXh0LW11dGVkOiB2YXIoLS1jaGFuZ2U4LXRleHQtbXV0ZWQsICM5YWE4YzEpO1xyXG4gICAgICAgICAgLS1saW5lOiB2YXIoLS1jaGFuZ2U4LWxpbmUsIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4yMikpO1xyXG4gICAgICAgICAgLS1jYXJkLWJnOiB2YXIoLS1jaGFuZ2U4LWNhcmQtYmcsIGxpbmVhci1ncmFkaWVudCgxNjBkZWcsIHJnYmEoMjEsIDM0LCA2NiwgMC45NikgMCUsIHJnYmEoMTAsIDE4LCAzNiwgMC45NikgMTAwJSkpO1xyXG4gICAgICAgICAgLS1zaGFkb3c6IHZhcigtLWNoYW5nZTgtc2hhZG93LCAwIDhweCAyNnB4IHJnYmEoMCwgMCwgMCwgMC4zKSk7XHJcblxyXG4gICAgICAgICAgcGFkZGluZzogMzJweDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW1haW4pO1xyXG4gICAgICAgICAgZm9udC1mYW1pbHk6IFwiUG9wcGluc1wiLCBcIlNlZ29lIFVJXCIsIHNhbnMtc2VyaWY7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTIwZGVnLCB2YXIoLS1iZy0xKSAwJSwgcmdiYSgxMSwgMjYsIDU2LCAwLjgpIDUwJSwgdmFyKC0tYmctMSkgMTAwJSk7XHJcbiAgICAgICAgICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT0nbGlnaHQnXSAub3JkZXItc2hvdy1jb250YWluZXIge1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWJnLTE6ICNmMGY2ZmY7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtZ29sZDogI2MwOGIwZjtcclxuICAgICAgICAgIC0tY2hhbmdlOC10ZXh0LW1haW46ICMwZjE3MmE7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtdGV4dC1tdXRlZDogIzQ3NTU2OTtcclxuICAgICAgICAgIC0tY2hhbmdlOC1saW5lOiByZ2JhKDE1LCAyMywgNDIsIDAuMDgpO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWNhcmQtYmc6ICNmZmZmZmY7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtc2hhZG93OiAwIDRweCAyMHB4IHJnYmEoMTUsIDIzLCA0MiwgMC4wNik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItc2hvdy1pbm5lciB7XHJcbiAgICAgICAgICBtYXgtd2lkdGg6IDkwMHB4O1xyXG4gICAgICAgICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItc2hvdy1oZWFkZXIge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMzJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1zaG93LWhlYWRlci10b3Age1xyXG4gICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xyXG4gICAgICAgICAgZ2FwOiAyMHB4O1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1zaG93LWtpY2tlciB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLWdvbGQpO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjM2ZW07XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxMnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLXNob3ctdGl0bGUge1xyXG4gICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgyOHB4LCA0dncsIDQycHgpO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjE7XHJcbiAgICAgICAgICBtYXJnaW46IDA7XHJcbiAgICAgICAgICB3b3JkLWJyZWFrOiBicmVhay1hbGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItc2hvdy1zdGF0dXMge1xyXG4gICAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgZ2FwOiA4cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiA4cHggMTZweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjEyZW07XHJcbiAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG4gICAgICAgICAgZmxleC1zaHJpbms6IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItc2hvdy1jYXJkIHtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxpbmUpO1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMjRweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDMycHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jYXJkLWJnKTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IHZhcigtLXNoYWRvdyk7XHJcbiAgICAgICAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoNHB4KTtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDI0cHg7XHJcbiAgICAgICAgICBhbmltYXRpb246IGZhZGUtdXAgNTYwbXMgZWFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1zaG93LXNlY3Rpb24tdGl0bGUge1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xOGVtO1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLWdvbGQpO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItc2hvdy1zZWN0aW9uIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDI4cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItc2hvdy1zZWN0aW9uOmxhc3QtY2hpbGQge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1zaG93LWdyaWQge1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMjAwcHgsIDFmcikpO1xyXG4gICAgICAgICAgZ2FwOiAyMHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLXNob3ctZmllbGQge1xyXG4gICAgICAgICAgcGFkZGluZzogMTZweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xKTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saW5lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT0nbGlnaHQnXSAub3JkZXItc2hvdy1maWVsZCB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDE1LCAyMywgNDIsIDAuMDMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLXNob3ctbGFiZWwge1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xOGVtO1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogOHB4O1xyXG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItc2hvdy12YWx1ZSB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tYWluKTtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjY7XHJcbiAgICAgICAgICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLXNob3ctdmFsdWUuaGlnaGxpZ2h0IHtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItc2hvdy1hZGRyZXNzIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4yKTtcclxuICAgICAgICAgIGJvcmRlci1sZWZ0OiAzcHggc29saWQgdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxNnB4IDIwcHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMS43O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgICAgICAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xyXG4gICAgICAgICAgd29yZC1icmVhazogYnJlYWstd29yZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT0nbGlnaHQnXSAub3JkZXItc2hvdy1hZGRyZXNzIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMTUsIDIzLCA0MiwgMC4wNSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItc2hvdy1kaXZpZGVyIHtcclxuICAgICAgICAgIGhlaWdodDogMXB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDApLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMjgpLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDApKTtcclxuICAgICAgICAgIG1hcmdpbjogMjRweCAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLXNob3ctc3VtbWFyeSB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMDgpO1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMjRweDtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDI0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLm9yZGVyLXNob3ctc3VtbWFyeSB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDE5MiwgMTM5LCAxNSwgMC4wNSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItc2hvdy1zdW1tYXJ5LXJvdyB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIHBhZGRpbmc6IDEycHggMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1zaG93LXN1bW1hcnktbGFiZWwge1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1zaG93LXN1bW1hcnktdmFsdWUge1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMThweDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1zaG93LXN0YXR1cy10aW1lbGluZSB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoYXV0by1maXQsIG1pbm1heCgxNTBweCwgMWZyKSk7XHJcbiAgICAgICAgICBnYXA6IDEycHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItc2hvdy10aW1lbGluZS1pdGVtIHtcclxuICAgICAgICAgIHBhZGRpbmc6IDEycHggMTZweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xKTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgICAgICAgIGJvcmRlci1sZWZ0OiAzcHggc29saWQgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjMpO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxM3B4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLXNob3ctdGltZWxpbmUtbGFiZWwge1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xZW07XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiA0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItc2hvdy10aW1lbGluZS12YWx1ZSB7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tYWluKTtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAa2V5ZnJhbWVzIGZhZGUtdXAge1xyXG4gICAgICAgICAgZnJvbSB7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg4cHgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdG8ge1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNzIwcHgpIHtcclxuICAgICAgICAgIC5vcmRlci1zaG93LWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDIwcHggMTZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAub3JkZXItc2hvdy1jYXJkIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMjRweCAyMHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5vcmRlci1zaG93LWdyaWQge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAub3JkZXItc2hvdy1oZWFkZXItdG9wIHtcclxuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLm9yZGVyLXNob3ctc3RhdHVzIHtcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgYH08L3N0eWxlPlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1zaG93LWlubmVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1zaG93LWhlYWRlclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1zaG93LWtpY2tlclwiPk9yZGVyIERldGFpbHM8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItc2hvdy1oZWFkZXItdG9wXCI+XHJcbiAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJvcmRlci1zaG93LXRpdGxlXCI+T3JkZXIgI3tvcmRlci5pZCB8fCBcIuKAlFwifTwvaDE+XHJcbiAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJvcmRlci1zaG93LXN0YXR1c1wiXHJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHN0YXR1c0NvbG9ycy5iZyxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBzdGF0dXNDb2xvcnMuY29sb3IsXHJcbiAgICAgICAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtzdGF0dXNDb2xvcnMuYm9yZGVyfWAsXHJcbiAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxzcGFuPuKXjzwvc3Bhbj5cclxuICAgICAgICAgICAgICB7b3JkZXIuc3RhdHVzPy50b1VwcGVyQ2FzZSgpIHx8IFwi4oCUXCJ9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItc2hvdy1zdW1tYXJ5XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctc3VtbWFyeS1yb3dcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwib3JkZXItc2hvdy1zdW1tYXJ5LWxhYmVsXCI+VG90YWwgQW1vdW50PC9zcGFuPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJvcmRlci1zaG93LXN1bW1hcnktdmFsdWVcIj5cclxuICAgICAgICAgICAgICB7Zm9ybWF0Q3VycmVuY3kob3JkZXIudG90YWxBbW91bnQpfVxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1zaG93LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItc2hvdy1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJvcmRlci1zaG93LXNlY3Rpb24tdGl0bGVcIj5PcmRlciBJbmZvcm1hdGlvbjwvaDM+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctZ3JpZFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItc2hvdy1maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctbGFiZWxcIj5PcmRlciBJRDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctdmFsdWUgaGlnaGxpZ2h0XCJcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IFwiMjBweFwiIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtvcmRlci5pZCB8fCBcIuKAlFwifVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItc2hvdy1maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctbGFiZWxcIj5Ub3RhbCBBbW91bnQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1zaG93LXZhbHVlIGhpZ2hsaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICB7Zm9ybWF0Q3VycmVuY3kob3JkZXIudG90YWxBbW91bnQpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItc2hvdy1maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctbGFiZWxcIj5QYXltZW50IE1ldGhvZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctdmFsdWVcIj5cclxuICAgICAgICAgICAgICAgICAge29yZGVyLnBheW1lbnRNZXRob2RcclxuICAgICAgICAgICAgICAgICAgICA/IG9yZGVyLnBheW1lbnRNZXRob2QuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgb3JkZXIucGF5bWVudE1ldGhvZC5zbGljZSgxKVxyXG4gICAgICAgICAgICAgICAgICAgIDogXCLigJRcIn1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctZmllbGRcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJvcmRlci1zaG93LWxhYmVsXCI+U3RhdHVzPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwib3JkZXItc2hvdy12YWx1ZVwiXHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBcIjYwMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wNWVtXCIsXHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtvcmRlci5zdGF0dXMgfHwgXCLigJRcIn1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctZmllbGRcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJvcmRlci1zaG93LWxhYmVsXCI+VXNlciBJRDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctdmFsdWVcIlxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiBcIm1vbm9zcGFjZVwiLCBmb250U2l6ZTogXCIxNHB4XCIgfX1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAge29yZGVyLnVzZXJJZCB8fCBcIuKAlFwifVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAge29yZGVyLnNoaXBwaW5nQWRkcmVzcyAmJiAoXHJcbiAgICAgICAgICAgIDw+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1zaG93LWRpdmlkZXJcIiAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctc2VjdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctc2VjdGlvbi10aXRsZVwiPlNoaXBwaW5nIEFkZHJlc3M8L2gzPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1zaG93LWFkZHJlc3NcIj5cclxuICAgICAgICAgICAgICAgICAge29yZGVyLnNoaXBwaW5nQWRkcmVzc31cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Lz5cclxuICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1zaG93LWRpdmlkZXJcIiAvPlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItc2hvdy1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJvcmRlci1zaG93LXNlY3Rpb24tdGl0bGVcIj5UaW1lbGluZTwvaDM+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctc3RhdHVzLXRpbWVsaW5lXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1zaG93LXRpbWVsaW5lLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItc2hvdy10aW1lbGluZS1sYWJlbFwiPkNyZWF0ZWQ8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItc2hvdy10aW1lbGluZS12YWx1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShvcmRlci5jcmVhdGVkQXQpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItc2hvdy10aW1lbGluZS1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLXNob3ctdGltZWxpbmUtbGFiZWxcIj5MYXN0IFVwZGF0ZWQ8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItc2hvdy10aW1lbGluZS12YWx1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShvcmRlci51cGRhdGVkQXQpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9yZGVyU2hvdztcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IE9yZGVySXRlbVNob3cgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCB7IHJlY29yZCB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW2l0ZW0sIHNldEl0ZW1dID0gdXNlU3RhdGUobnVsbCk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAocmVjb3JkICYmIHJlY29yZC5wYXJhbXMpIHtcclxuICAgICAgc2V0SXRlbShyZWNvcmQucGFyYW1zKTtcclxuICAgIH1cclxuICB9LCBbcmVjb3JkXSk7XHJcblxyXG4gIGlmICghaXRlbSkge1xyXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItaXRlbS1zaG93LWxvYWRpbmdcIj5Mb2FkaW5nLi4uPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZm9ybWF0RGF0ZSA9IChkYXRlKSA9PiB7XHJcbiAgICBpZiAoIWRhdGUpIHJldHVybiBcIuKAlFwiO1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUpLnRvTG9jYWxlRGF0ZVN0cmluZyhcImVuLVVTXCIsIHtcclxuICAgICAgICB5ZWFyOiBcIm51bWVyaWNcIixcclxuICAgICAgICBtb250aDogXCJsb25nXCIsXHJcbiAgICAgICAgZGF5OiBcIm51bWVyaWNcIixcclxuICAgICAgICBob3VyOiBcIjItZGlnaXRcIixcclxuICAgICAgICBtaW51dGU6IFwiMi1kaWdpdFwiLFxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICByZXR1cm4gXCLigJRcIjtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBmb3JtYXRDdXJyZW5jeSA9ICh2YWx1ZSkgPT4ge1xyXG4gICAgcmV0dXJuIGBScy4ke051bWJlcih2YWx1ZSB8fCAwKS50b0xvY2FsZVN0cmluZyhcImVuLUlOXCIsIHtcclxuICAgICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICB9KX1gO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHVuaXRQcmljZSA9IE51bWJlcihpdGVtLnVuaXRQcmljZSB8fCAwKTtcclxuICBjb25zdCBxdWFudGl0eSA9IE51bWJlcihpdGVtLnF1YW50aXR5IHx8IDApO1xyXG4gIGNvbnN0IHRvdGFsUHJpY2UgPSBOdW1iZXIoaXRlbS50b3RhbFByaWNlIHx8IDApO1xyXG4gIGNvbnN0IHNhdmluZ3NQZXJJdGVtID1cclxuICAgIHVuaXRQcmljZSA+IDBcclxuICAgICAgPyAoXHJcbiAgICAgICAgICAoKHVuaXRQcmljZSAqIHF1YW50aXR5IC0gdG90YWxQcmljZSkgLyAodW5pdFByaWNlICogcXVhbnRpdHkpKSAqXHJcbiAgICAgICAgICAxMDBcclxuICAgICAgICApLnRvRml4ZWQoMilcclxuICAgICAgOiAwO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXNob3ctY29udGFpbmVyXCI+XHJcbiAgICAgIDxzdHlsZT57YFxyXG4gICAgICAgIC5vcmRlci1pdGVtLXNob3ctY29udGFpbmVyIHtcclxuICAgICAgICAgIC0tYmctMTogdmFyKC0tY2hhbmdlOC1iZy0xLCAjMDUwOTE0KTtcclxuICAgICAgICAgIC0tZ29sZDogdmFyKC0tY2hhbmdlOC1nb2xkLCAjZTJiZjY2KTtcclxuICAgICAgICAgIC0tdGV4dC1tYWluOiB2YXIoLS1jaGFuZ2U4LXRleHQtbWFpbiwgI2Y4ZmFmYyk7XHJcbiAgICAgICAgICAtLXRleHQtbXV0ZWQ6IHZhcigtLWNoYW5nZTgtdGV4dC1tdXRlZCwgIzlhYThjMSk7XHJcbiAgICAgICAgICAtLWxpbmU6IHZhcigtLWNoYW5nZTgtbGluZSwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjIyKSk7XHJcbiAgICAgICAgICAtLWNhcmQtYmc6IHZhcigtLWNoYW5nZTgtY2FyZC1iZywgbGluZWFyLWdyYWRpZW50KDE2MGRlZywgcmdiYSgyMSwgMzQsIDY2LCAwLjk2KSAwJSwgcmdiYSgxMCwgMTgsIDM2LCAwLjk2KSAxMDAlKSk7XHJcbiAgICAgICAgICAtLXNoYWRvdzogdmFyKC0tY2hhbmdlOC1zaGFkb3csIDAgOHB4IDI2cHggcmdiYSgwLCAwLCAwLCAwLjMpKTtcclxuXHJcbiAgICAgICAgICBwYWRkaW5nOiAzMnB4O1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbWFpbik7XHJcbiAgICAgICAgICBmb250LWZhbWlseTogXCJQb3BwaW5zXCIsIFwiU2Vnb2UgVUlcIiwgc2Fucy1zZXJpZjtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMjBkZWcsIHZhcigtLWJnLTEpIDAlLCByZ2JhKDExLCAyNiwgNTYsIDAuOCkgNTAlLCB2YXIoLS1iZy0xKSAxMDAlKTtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5vcmRlci1pdGVtLXNob3ctY29udGFpbmVyIHtcclxuICAgICAgICAgIC0tY2hhbmdlOC1iZy0xOiAjZjBmNmZmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWdvbGQ6ICNjMDhiMGY7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtdGV4dC1tYWluOiAjMGYxNzJhO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXRleHQtbXV0ZWQ6ICM0NzU1Njk7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtbGluZTogcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgICAgICAgIC0tY2hhbmdlOC1jYXJkLWJnOiAjZmZmZmZmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXNoYWRvdzogMCA0cHggMjBweCByZ2JhKDE1LCAyMywgNDIsIDAuMDYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLWl0ZW0tc2hvdy1pbm5lciB7XHJcbiAgICAgICAgICBtYXgtd2lkdGg6IDkwMHB4O1xyXG4gICAgICAgICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItaXRlbS1zaG93LWhlYWRlciB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAzMnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLWl0ZW0tc2hvdy1raWNrZXIge1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4zNmVtO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1pdGVtLXNob3ctdGl0bGUge1xyXG4gICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgyOHB4LCA0dncsIDQycHgpO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjE7XHJcbiAgICAgICAgICBtYXJnaW46IDAgMCA4cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItaXRlbS1zaG93LXN1YnRpdGxlIHtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1pdGVtLXNob3ctY2FyZCB7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saW5lKTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDI0cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAzMnB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tY2FyZC1iZyk7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiB2YXIoLS1zaGFkb3cpO1xyXG4gICAgICAgICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDRweCk7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xyXG4gICAgICAgICAgYW5pbWF0aW9uOiBmYWRlLXVwIDU2MG1zIGVhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItaXRlbS1wcmljaW5nLWNhcmQge1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjMpO1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMjBweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDI4cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMDYpO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjRweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT0nbGlnaHQnXSAub3JkZXItaXRlbS1wcmljaW5nLWNhcmQge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxOTIsIDEzOSwgMTUsIDAuMDQpO1xyXG4gICAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2JhKDE5MiwgMTM5LCAxNSwgMC4yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1pdGVtLXNob3ctc2VjdGlvbi10aXRsZSB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjE4ZW07XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1pdGVtLXNob3ctc2VjdGlvbiB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyOHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLWl0ZW0tc2hvdy1zZWN0aW9uOmxhc3QtY2hpbGQge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1pdGVtLXByaWNpbmctcm93IHtcclxuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgcGFkZGluZzogMTRweCAwO1xyXG4gICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4xNSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItaXRlbS1wcmljaW5nLXJvdzpsYXN0LWNoaWxkIHtcclxuICAgICAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItaXRlbS1wcmljaW5nLWxhYmVsIHtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItaXRlbS1wcmljaW5nLXZhbHVlIHtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tYWluKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1pdGVtLXByaWNpbmctdmFsdWUudG90YWwge1xyXG4gICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLWdvbGQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLWl0ZW0tcHJpY2luZy12YWx1ZS5zYXZpbmdzIHtcclxuICAgICAgICAgIGNvbG9yOiAjMTBiOTgxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLWl0ZW0tc2hvdy1ncmlkIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpdCwgbWlubWF4KDE2MHB4LCAxZnIpKTtcclxuICAgICAgICAgIGdhcDogMTZweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1pdGVtLXNob3ctZmllbGQge1xyXG4gICAgICAgICAgcGFkZGluZzogMTZweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xKTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saW5lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT0nbGlnaHQnXSAub3JkZXItaXRlbS1zaG93LWZpZWxkIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMTUsIDIzLCA0MiwgMC4wMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItaXRlbS1zaG93LWxhYmVsIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMThlbTtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDhweDtcclxuICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLWl0ZW0tc2hvdy12YWx1ZSB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tYWluKTtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjY7XHJcbiAgICAgICAgICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLWl0ZW0tc2hvdy12YWx1ZS5oaWdobGlnaHQge1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLWdvbGQpO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMjJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1pdGVtLXNob3ctdmFsdWUubGFyZ2Uge1xyXG4gICAgICAgICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1pdGVtLWRpdmlkZXIge1xyXG4gICAgICAgICAgaGVpZ2h0OiAxcHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjI2LCAxOTEsIDEwMiwgMCksIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4yOCksIHJnYmEoMjI2LCAxOTEsIDEwMiwgMCkpO1xyXG4gICAgICAgICAgbWFyZ2luOiAyNHB4IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAub3JkZXItaXRlbS1zdGF0dXMtdGltZWxpbmUge1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMTUwcHgsIDFmcikpO1xyXG4gICAgICAgICAgZ2FwOiAxMnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLWl0ZW0tdGltZWxpbmUtaXRlbSB7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxMnB4IDE2cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMSk7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICAgICAgICBib3JkZXItbGVmdDogM3B4IHNvbGlkIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4zKTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTNweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1pdGVtLXRpbWVsaW5lLWxhYmVsIHtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMWVtO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogNnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLWl0ZW0tdGltZWxpbmUtdmFsdWUge1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbWFpbik7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNTAwO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxM3B4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLWl0ZW0tcXVhbnRpdHktYm94IHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4xKTtcclxuICAgICAgICAgIGJvcmRlcjogMnB4IHNvbGlkIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4zKTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAyMHB4O1xyXG4gICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5vcmRlci1pdGVtLXF1YW50aXR5LWJveCB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDE5MiwgMTM5LCAxNSwgMC4wNik7XHJcbiAgICAgICAgICBib3JkZXItY29sb3I6IHJnYmEoMTkyLCAxMzksIDE1LCAwLjIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLm9yZGVyLWl0ZW0tcXVhbnRpdHktbnVtYmVyIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogNDhweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMTtcclxuICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5vcmRlci1pdGVtLXF1YW50aXR5LWxhYmVsIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xZW07XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiA4cHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQGtleWZyYW1lcyBmYWRlLXVwIHtcclxuICAgICAgICAgIGZyb20ge1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoOHB4KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRvIHtcclxuICAgICAgICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDcyMHB4KSB7XHJcbiAgICAgICAgICAub3JkZXItaXRlbS1zaG93LWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDIwcHggMTZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAub3JkZXItaXRlbS1zaG93LWNhcmQge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAyNHB4IDIwcHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLm9yZGVyLWl0ZW0tc2hvdy1ncmlkIHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLm9yZGVyLWl0ZW0tcHJpY2luZy1jYXJkIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMjBweDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIGB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItaXRlbS1zaG93LWlubmVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXNob3ctaGVhZGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tc2hvdy1raWNrZXJcIj5PcmRlciBJdGVtIERldGFpbHM8L2Rpdj5cclxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXNob3ctdGl0bGVcIj5JdGVtICN7aXRlbS5pZCB8fCBcIuKAlFwifTwvaDE+XHJcbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXNob3ctc3VidGl0bGVcIj5cclxuICAgICAgICAgICAgT3JkZXIgSUQ6IDxzdHJvbmc+I3tpdGVtLm9yZGVySWQgfHwgXCLigJRcIn08L3N0cm9uZz4g4oCiIFByb2R1Y3Q6e1wiIFwifVxyXG4gICAgICAgICAgICA8c3Ryb25nPntpdGVtLnByb2R1Y3RJZCB8fCBcIuKAlFwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgPC9wPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tcHJpY2luZy1jYXJkXCI+XHJcbiAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tc2hvdy1zZWN0aW9uLXRpdGxlXCJcclxuICAgICAgICAgICAgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiBcIjE2cHhcIiB9fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBQcmljaW5nIEJyZWFrZG93blxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXByaWNpbmctcm93XCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tcHJpY2luZy1sYWJlbFwiPlVuaXQgUHJpY2U8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tcHJpY2luZy12YWx1ZVwiPlxyXG4gICAgICAgICAgICAgIHtmb3JtYXRDdXJyZW5jeSh1bml0UHJpY2UpfVxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tcHJpY2luZy1yb3dcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwib3JkZXItaXRlbS1wcmljaW5nLWxhYmVsXCI+UXVhbnRpdHk8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tcHJpY2luZy12YWx1ZVwiPlxyXG4gICAgICAgICAgICAgIHtxdWFudGl0eX0ge3F1YW50aXR5ID09PSAxID8gXCJpdGVtXCIgOiBcIml0ZW1zXCJ9XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItaXRlbS1wcmljaW5nLXJvd1wiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXByaWNpbmctbGFiZWxcIj5TdWJ0b3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwib3JkZXItaXRlbS1wcmljaW5nLXZhbHVlXCI+XHJcbiAgICAgICAgICAgICAge2Zvcm1hdEN1cnJlbmN5KHVuaXRQcmljZSAqIHF1YW50aXR5KX1cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXByaWNpbmctcm93XCJcclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICBib3JkZXJCb3R0b206IFwiMnB4IHNvbGlkIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4zKVwiLFxyXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IFwiMTZweFwiLFxyXG4gICAgICAgICAgICAgIHBhZGRpbmdCb3R0b206IFwiMTZweFwiLFxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXByaWNpbmctbGFiZWxcIj5Ub3RhbCBQcmljZTwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwib3JkZXItaXRlbS1wcmljaW5nLXZhbHVlIHRvdGFsXCI+XHJcbiAgICAgICAgICAgICAge2Zvcm1hdEN1cnJlbmN5KHRvdGFsUHJpY2UpfVxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICB7c2F2aW5nc1Blckl0ZW0gPiAwICYmIChcclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tcHJpY2luZy1yb3dcIlxyXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGJvcmRlckJvdHRvbTogXCJub25lXCIsIHBhZGRpbmdUb3A6IFwiMTJweFwiIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXByaWNpbmctbGFiZWxcIj5EaXNjb3VudCBBcHBsaWVkPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tcHJpY2luZy12YWx1ZSBzYXZpbmdzXCI+XHJcbiAgICAgICAgICAgICAgICAte3NhdmluZ3NQZXJJdGVtfSVcclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXNob3ctY2FyZFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXNob3ctc2VjdGlvblwiPlxyXG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwib3JkZXItaXRlbS1zaG93LXNlY3Rpb24tdGl0bGVcIj5JdGVtIEluZm9ybWF0aW9uPC9oMz5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItaXRlbS1zaG93LWdyaWRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tc2hvdy1maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tc2hvdy1sYWJlbFwiPkl0ZW0gSUQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXNob3ctdmFsdWUgaGlnaGxpZ2h0XCJcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IFwiMjBweFwiIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtpdGVtLmlkIHx8IFwi4oCUXCJ9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXNob3ctZmllbGRcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXNob3ctbGFiZWxcIj5Qcm9kdWN0IElEPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItaXRlbS1zaG93LXZhbHVlIGxhcmdlXCI+XHJcbiAgICAgICAgICAgICAgICAgIHtpdGVtLnByb2R1Y3RJZCB8fCBcIuKAlFwifVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItaXRlbS1zaG93LWZpZWxkXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwib3JkZXItaXRlbS1zaG93LWxhYmVsXCI+T3JkZXIgSUQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXNob3ctdmFsdWUgbGFyZ2VcIj5cclxuICAgICAgICAgICAgICAgICAge2l0ZW0ub3JkZXJJZCB8fCBcIuKAlFwifVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItaXRlbS1zaG93LWZpZWxkXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwib3JkZXItaXRlbS1zaG93LWxhYmVsXCI+VW5pdCBQcmljZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tc2hvdy12YWx1ZSBoaWdobGlnaHRcIj5cclxuICAgICAgICAgICAgICAgICAge2Zvcm1hdEN1cnJlbmN5KHVuaXRQcmljZSl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tZGl2aWRlclwiIC8+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXNob3ctc2VjdGlvblwiPlxyXG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwib3JkZXItaXRlbS1zaG93LXNlY3Rpb24tdGl0bGVcIj5RdWFudGl0eSAmIFRvdGFsczwvaDM+XHJcblxyXG4gICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gICAgICAgICAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyXCIsXHJcbiAgICAgICAgICAgICAgICBnYXA6IFwiMjBweFwiLFxyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tcXVhbnRpdHktYm94XCI+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXF1YW50aXR5LW51bWJlclwiPntxdWFudGl0eX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXF1YW50aXR5LWxhYmVsXCI+VW5pdHMgT3JkZXJlZDwvcD5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXF1YW50aXR5LWJveFwiPlxyXG4gICAgICAgICAgICAgICAgPHBcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1nb2xkKVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBcIjI4cHhcIixcclxuICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBcIjcwMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogXCIwIDAgOHB4XCIsXHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtmb3JtYXRDdXJyZW5jeSh0b3RhbFByaWNlKX1cclxuICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tcXVhbnRpdHktbGFiZWxcIj5Ub3RhbCBBbW91bnQ8L3A+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLWRpdmlkZXJcIiAvPlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItaXRlbS1zaG93LXNlY3Rpb25cIj5cclxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tc2hvdy1zZWN0aW9uLXRpdGxlXCI+VGltZWxpbmU8L2gzPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXN0YXR1cy10aW1lbGluZVwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItaXRlbS10aW1lbGluZS1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tdGltZWxpbmUtbGFiZWxcIj5BZGRlZDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXRpbWVsaW5lLXZhbHVlXCI+XHJcbiAgICAgICAgICAgICAgICAgIHtmb3JtYXREYXRlKGl0ZW0uY3JlYXRlZEF0KX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tdGltZWxpbmUtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvcmRlci1pdGVtLXRpbWVsaW5lLWxhYmVsXCI+TGFzdCBVcGRhdGVkPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yZGVyLWl0ZW0tdGltZWxpbmUtdmFsdWVcIj5cclxuICAgICAgICAgICAgICAgICAge2Zvcm1hdERhdGUoaXRlbS51cGRhdGVkQXQpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9yZGVySXRlbVNob3c7XHJcbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IERhc2hib2FyZCBmcm9tICcuLi9hZG1pbi9kYXNoYm9hcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRhc2hib2FyZCA9IERhc2hib2FyZFxuaW1wb3J0IFByb2R1Y3RDYXJkc0xpc3QgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1jYXJkcy1saXN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0Q2FyZHNMaXN0ID0gUHJvZHVjdENhcmRzTGlzdFxuaW1wb3J0IFByb2R1Y3RTaG93IGZyb20gJy4uL2FkbWluL3Byb2R1Y3Qtc2hvdydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdFNob3cgPSBQcm9kdWN0U2hvd1xuaW1wb3J0IFByb2R1Y3RJbWFnZSBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LWltYWdlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0SW1hZ2UgPSBQcm9kdWN0SW1hZ2VcbmltcG9ydCBQcm9kdWN0SW1hZ2VVcGxvYWQgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS11cGxvYWQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RJbWFnZVVwbG9hZCA9IFByb2R1Y3RJbWFnZVVwbG9hZFxuaW1wb3J0IENhdGVnb3J5U2hvdyBmcm9tICcuLi9hZG1pbi9jYXRlZ29yeS1zaG93J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DYXRlZ29yeVNob3cgPSBDYXRlZ29yeVNob3dcbmltcG9ydCBPcmRlclNob3cgZnJvbSAnLi4vYWRtaW4vb3JkZXItc2hvdydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuT3JkZXJTaG93ID0gT3JkZXJTaG93XG5pbXBvcnQgT3JkZXJJdGVtU2hvdyBmcm9tICcuLi9hZG1pbi9vcmRlci1pdGVtLXNob3cnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLk9yZGVySXRlbVNob3cgPSBPcmRlckl0ZW1TaG93Il0sIm5hbWVzIjpbImZvcm1hdEN1cnJlbmN5IiwidmFsdWUiLCJOdW1iZXIiLCJ0b0xvY2FsZVN0cmluZyIsIkRhc2hib2FyZCIsImRhdGEiLCJzZXREYXRhIiwidXNlU3RhdGUiLCJ1c2VycyIsImNhdGVnb3JpZXMiLCJwcm9kdWN0cyIsIm9yZGVycyIsInJldmVudWUiLCJmZWF0dXJlZEdlbXMiLCJjcml0aWNhbFN0b2NrIiwicmVjZW50UHJvZHVjdHMiLCJjYXRlZ29yeURpc3RyaWJ1dGlvbiIsInVzZUVmZmVjdCIsImxvYWREYXNoYm9hcmQiLCJyZXNwb25zZSIsImZldGNoIiwicGF5bG9hZCIsImpzb24iLCJ0b3BDYXRlZ29yaWVzIiwidXNlTWVtbyIsImRpc3RyaWJ1dGlvbiIsIm1heCIsIk1hdGgiLCJtYXAiLCJpdGVtIiwiY291bnQiLCJ3aWR0aCIsInJvdW5kIiwiY29tcGxldGlvblJhdGUiLCJ0b3RhbCIsImhlYWx0aHkiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJzdHlsZSIsImxlbmd0aCIsImNhdGVnb3J5Iiwia2V5IiwibmFtZSIsIm1hcmdpblRvcCIsInByb2R1Y3QiLCJpZCIsIkRhdGUiLCJjcmVhdGVkQXQiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJwcmljZSIsImRpc3BsYXkiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwiZ2FwIiwiY29sb3IiLCJncmlkU3R5bGUiLCJjYXJkU3R5bGUiLCJib3JkZXJSYWRpdXMiLCJib3JkZXIiLCJiYWNrZ3JvdW5kIiwib3ZlcmZsb3ciLCJib3hTaGFkb3ciLCJpbWFnZVdyYXBTdHlsZSIsImhlaWdodCIsImltYWdlU3R5bGUiLCJvYmplY3RGaXQiLCJib2R5U3R5bGUiLCJwYWRkaW5nIiwibWV0YVN0eWxlIiwiZm9udFNpemUiLCJiYWRnZVN0eWxlIiwiaXNBY3RpdmUiLCJmb250V2VpZ2h0IiwibGV0dGVyU3BhY2luZyIsImxpbmtTdHlsZSIsInRleHREZWNvcmF0aW9uIiwiY3Vyc29yIiwiZW1wdHlTdHlsZSIsImZvcm1hdFByaWNlIiwiYW1vdW50IiwiaXNGaW5pdGUiLCJ1bmRlZmluZWQiLCJtaW5pbXVtRnJhY3Rpb25EaWdpdHMiLCJtYXhpbXVtRnJhY3Rpb25EaWdpdHMiLCJnZXRSZWNvcmRJZCIsInJlY29yZCIsInBhcmFtcyIsInBhcmFtIiwiZ2V0U2hvd0hyZWYiLCJyZXNvdXJjZUlkIiwicmVjb3JkQWN0aW9ucyIsImFjdGlvbnMiLCJzaG93QWN0aW9uIiwiZmluZCIsImFjdGlvbiIsInJhd0hyZWYiLCJocmVmIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiUHJvZHVjdENhcmRzTGlzdCIsInByb3BzIiwiYXBpUmVjb3JkcyIsInNldEFwaVJlY29yZHMiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImxvYWRFcnJvciIsInNldExvYWRFcnJvciIsInJlc291cmNlIiwicHJvcFJlY29yZHMiLCJyZWNvcmRzIiwiaXNNb3VudGVkIiwibG9hZFJlY29yZHMiLCJjcmVkZW50aWFscyIsIm9rIiwiRXJyb3IiLCJtZXNzYWdlIiwiZXJyb3IiLCJjYXRlZ29yeUlkIiwiaW1hZ2VVcmwiLCJzdG9jayIsIkJvb2xlYW4iLCJkZXRhaWxzSHJlZiIsIm9wZW5EZXRhaWxzIiwid2luZG93IiwibG9jYXRpb24iLCJhc3NpZ24iLCJzcmMiLCJhbHQiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJvbkNsaWNrIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInBhZ2VTdHlsZSIsImhlcm9TdHlsZSIsInBhbmVsU3R5bGUiLCJtaW5IZWlnaHQiLCJoZXJvQm9keVN0eWxlIiwidGl0bGVTdHlsZSIsIm1hcmdpbiIsImxpbmVIZWlnaHQiLCJzdWJ0aXRsZVN0eWxlIiwiYWN0aXZlIiwic3RhdHNHcmlkU3R5bGUiLCJzdGF0Q2FyZFN0eWxlIiwic3RhdExhYmVsU3R5bGUiLCJ0ZXh0VHJhbnNmb3JtIiwibWFyZ2luQm90dG9tIiwic3RhdFZhbHVlU3R5bGUiLCJ3b3JkQnJlYWsiLCJzZWN0aW9uR3JpZFN0eWxlIiwic2VjdGlvblRpdGxlU3R5bGUiLCJjb250ZW50Q2FyZFN0eWxlIiwiaW5mb0xpc3RTdHlsZSIsImluZm9Sb3dTdHlsZSIsInBhZGRpbmdCb3R0b20iLCJib3JkZXJCb3R0b20iLCJpbmZvTGFiZWxTdHlsZSIsImluZm9WYWx1ZVN0eWxlIiwidGV4dEFsaWduIiwiZGVzY3JpcHRpb25TdHlsZSIsIndoaXRlU3BhY2UiLCJmb3JtYXREYXRlIiwiZGF0ZSIsImlzTmFOIiwiZ2V0VGltZSIsIlN0cmluZyIsImRhdGVTdHlsZSIsInRpbWVTdHlsZSIsIlByb2R1Y3RTaG93Iiwic2t1IiwiZGVzY3JpcHRpb24iLCJ1cGRhdGVkQXQiLCJjZWxsU3R5bGUiLCJmbGV4U2hyaW5rIiwiZmFsbGJhY2tTdHlsZSIsInRleHRTdHlsZSIsImZsZXhEaXJlY3Rpb24iLCJQcm9kdWN0SW1hZ2UiLCJwcm9wZXJ0eSIsInBhdGgiLCJoYXNFcnJvciIsInNldEhhc0Vycm9yIiwidGFyZ2V0IiwicmVsIiwib25FcnJvciIsIndyYXBwZXJTdHlsZSIsInByZXZpZXdTdHlsZSIsImhpbnRTdHlsZSIsIlByb2R1Y3RJbWFnZVVwbG9hZCIsIm9uQ2hhbmdlIiwiY3VycmVudFZhbHVlIiwiY3VycmVudFB1YmxpY0lkIiwiaW1hZ2VQdWJsaWNJZCIsInByZXZpZXdVcmwiLCJzZXRQcmV2aWV3VXJsIiwicHVibGljSWQiLCJzZXRQdWJsaWNJZCIsInVwbG9hZGluZyIsInNldFVwbG9hZGluZyIsInNldEVycm9yIiwiaGFuZGxlVXBsb2FkIiwiZmlsZSIsImZpbGVzIiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsImFwcGVuZCIsIm1ldGhvZCIsImJvZHkiLCJ1cGxvYWRlZFVybCIsInVybCIsInVwbG9hZGVkUHVibGljSWQiLCJ1cGxvYWRFcnJvciIsImhhbmRsZVJlbW92ZSIsInR5cGUiLCJhY2NlcHQiLCJGcmFnbWVudCIsInJlYWRPbmx5IiwiQ2F0ZWdvcnlTaG93Iiwic2V0Q2F0ZWdvcnkiLCJ5ZWFyIiwibW9udGgiLCJkYXkiLCJob3VyIiwibWludXRlIiwiZm9udEZhbWlseSIsInNsdWciLCJPcmRlclNob3ciLCJvcmRlciIsInNldE9yZGVyIiwiZ2V0U3RhdHVzQ29sb3IiLCJzdGF0dXMiLCJjb2xvcnMiLCJwZW5kaW5nIiwiYmciLCJwYWlkIiwicHJvY2Vzc2luZyIsInNoaXBwZWQiLCJjb21wbGV0ZWQiLCJjYW5jZWxsZWQiLCJzdGF0dXNDb2xvcnMiLCJ0b1VwcGVyQ2FzZSIsInRvdGFsQW1vdW50IiwicGF5bWVudE1ldGhvZCIsImNoYXJBdCIsInNsaWNlIiwidXNlcklkIiwic2hpcHBpbmdBZGRyZXNzIiwiT3JkZXJJdGVtU2hvdyIsInNldEl0ZW0iLCJ1bml0UHJpY2UiLCJxdWFudGl0eSIsInRvdGFsUHJpY2UiLCJzYXZpbmdzUGVySXRlbSIsInRvRml4ZWQiLCJvcmRlcklkIiwicHJvZHVjdElkIiwicGFkZGluZ1RvcCIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyJd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QSxFQUFBLElBQUEsRUFBUTtBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtB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RUFBRSxTQUFTO0VBQ2ZDLFFBQUFBLE1BQU0sRUFBRTtFQUNWLE9BQUMsQ0FBQztFQUNKLElBQUEsQ0FBQyxDQUFDLE1BQU07RUFDTixNQUFBLE9BQU8sR0FBRztFQUNaLElBQUE7SUFDRixDQUFDO0lBRUQsb0JBQ0UzTCxzQkFBQSxDQUFBQyxhQUFBLENBQUEsS0FBQSxFQUFBO0VBQUtDLElBQUFBLFNBQVMsRUFBQztLQUF5QixlQUN0Q0Ysc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLE9BQUEsRUFBQSxJQUFBLEVBQVE7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7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QUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUEsQ0FBZSxDQUFDLGVBRVZELHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsSUFBQUEsU0FBUyxFQUFDO0tBQWtCLGVB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QTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUEsQ0FBZSxDQUFDLGVBRVZELHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsSUFBQUEsU0FBUyxFQUFDO0tBQXVCLGVBQ3BDRixzQkFBQSxDQUFBQyxhQUFBLENBQUEsS0FBQSxFQUFBO0VBQUtD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
