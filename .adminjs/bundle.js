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
            --bg-3: var(--change8-bg-3, #121f3a);
            --gold: var(--change8-gold, #e2bf66);
            --text-main: var(--change8-text-main, #f8fafc);
            --text-muted: var(--change8-text-muted, #9aa8c1);
            --line: var(--change8-line, rgba(226, 191, 102, 0.22));
            --card-bg: var(--change8-card-bg, linear-gradient(160deg, rgba(21, 34, 66, 0.95) 0%, rgba(10, 18, 36, 0.95) 100%));
            --grad-end: var(--change8-grad-end, #04070f);
            --shadow: var(--change8-shadow, 0 8px 26px rgba(0, 0, 0, 0.3));
            --radial-1: var(--change8-radial-1, rgba(34, 93, 180, 0.35));
            --radial-2: var(--change8-radial-2, rgba(226, 191, 102, 0.16));

            min-height: 100vh;
            padding: 30px;
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
            --change8-bg-3: #eef5ff;
            --change8-gold: #c08b0f;
            --change8-text-main: #0f172a;
            --change8-text-muted: #475569;
            --change8-line: rgba(15, 23, 42, 0.08);
            --change8-card-bg: #ffffff;
            --change8-grad-end: #f8fbff;
            --change8-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
            --change8-radial-1: rgba(34, 93, 180, 0.08);
            --change8-radial-2: rgba(192, 139, 15, 0.05);
          }

          .change8-header {
            margin-bottom: 20px;
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
            gap: 14px;
            margin-top: 18px;
            margin-bottom: 16px;
          }

          .change8-card {
            border: 1px solid var(--line);
            border-radius: 18px;
            padding: 16px 18px;
            background: var(--card-bg);
            box-shadow: var(--shadow);
            backdrop-filter: blur(4px);
            animation: fade-up 560ms ease;
          }

          .change8-card-label {
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.18em;
            font-size: 11px;
            margin-bottom: 6px;
          }

          .change8-card-value {
            font-size: clamp(34px, 4vw, 52px);
            font-weight: 700;
            line-height: 1;
          }

          .change8-card-hint {
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 8px;
          }

          .change8-layout {
            display: grid;
            grid-template-columns: minmax(300px, 1.8fr) minmax(260px, 1fr);
            gap: 16px;
            margin-bottom: 16px;
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
            height: 10px;
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
            margin-top: 6px;
          }

          .change8-recent-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
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
          }

          .change8-price {
            color: var(--gold);
            font-weight: 700;
            font-size: 15px;
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
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 720px) {
            .change8-dashboard {
              padding: 20px 16px;
            }

            .change8-metric-grid {
              grid-template-columns: 1fr;
            }
          }
        `), /*#__PURE__*/React__default.default.createElement("div", {
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
      className: "change8-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Revenue Stream"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value"
    }, formatCurrency$1(data.revenue)), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Across all orders")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Inventory Size"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value"
    }, data.products || 0), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Total active catalog items")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Featured Gems"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value"
    }, data.featuredGems || 0), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Currently visible products")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Critical Stock"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-value"
    }, data.criticalStock || 0), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Items needing urgent refill"))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-layout"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Category Distribution"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Inventory split by segment"), /*#__PURE__*/React__default.default.createElement("div", {
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
      className: "change8-card"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-label"
    }, "Recent Additions"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-card-hint"
    }, "Latest products entering the catalog"), (data.recentProducts || []).length === 0 ? /*#__PURE__*/React__default.default.createElement("div", {
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
    }, formatCurrency$1(product.price))))))));
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
    gap: "8px"
  };
  const grid2Style = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px"
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
  const responsiveCss = `
@media (max-width: 1024px) {
  .change8-order-layout {
    grid-template-columns: 1fr !important;
  }
}
`;
  const paymentOptions = ["Card", "Cash on Delivery", "Bank Transfer", "Wallet"];
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
              quantity: 1,
              unitPrice: toNumber(contextData.selectedProduct.price)
            }]);
            return;
          }
          if (preProductId && productsList.some(p => String(p.id) === String(preProductId))) {
            const selected = productsList.find(p => String(p.id) === String(preProductId));
            setLineItems([{
              productId: String(preProductId),
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
      style: grid2Style
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Payment Method"), /*#__PURE__*/React__default.default.createElement("select", {
      name: "paymentMethod",
      value: formData.paymentMethod,
      onChange: handleFormChange,
      style: inputStyle
    }, paymentOptions.map(item => /*#__PURE__*/React__default.default.createElement("option", {
      key: item,
      value: item
    }, item)))), /*#__PURE__*/React__default.default.createElement("div", {
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
      }, "SKU/ID:", " ", selectedProduct ? `${selectedProduct.sku} / #${selectedProduct.id}` : "-"))), /*#__PURE__*/React__default.default.createElement("div", {
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
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Shipping Address"), /*#__PURE__*/React__default.default.createElement("textarea", {
      name: "shippingAddress",
      value: formData.shippingAddress,
      onChange: handleFormChange,
      style: {
        ...inputStyle,
        minHeight: "86px",
        resize: "vertical"
      },
      placeholder: "House number, street, city, postal code"
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
    }, /*#__PURE__*/React__default.default.createElement("span", null, "Grand Total"), /*#__PURE__*/React__default.default.createElement("span", null, formatMoney$2(lineTotals.grandTotal)))))), /*#__PURE__*/React__default.default.createElement("div", {
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
    }, "Qty: ", item.quantity, " x ", formatMoney$1(item.unitPrice))), /*#__PURE__*/React__default.default.createElement("strong", {
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

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.Dashboard = Dashboard;
  AdminJS.UserComponents.ProductCardsList = ProductCardsList;
  AdminJS.UserComponents.ProductShow = ProductShow;
  AdminJS.UserComponents.OrderCreate = OrderCreate;
  AdminJS.UserComponents.OrderShow = OrderShow;
  AdminJS.UserComponents.OrderItemShow = OrderItemShow;
  AdminJS.UserComponents.ProductImage = ProductImage;
  AdminJS.UserComponents.ProductImageUpload = ProductImageUpload;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9hZG1pbi9kYXNoYm9hcmQuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1jYXJkcy1saXN0LmpzeCIsIi4uL2FkbWluL3Byb2R1Y3Qtc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1jcmVhdGUuanN4IiwiLi4vYWRtaW4vb3JkZXItc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1pdGVtLXNob3cuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS5qc3giLCIuLi9hZG1pbi9wcm9kdWN0LWltYWdlLXVwbG9hZC5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgZm9ybWF0Q3VycmVuY3kgPSAodmFsdWUpID0+IHtcclxuICByZXR1cm4gYFJzLiR7TnVtYmVyKHZhbHVlIHx8IDApLnRvTG9jYWxlU3RyaW5nKCl9YDtcclxufTtcclxuXHJcbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcclxuICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZSh7XHJcbiAgICB1c2VyczogMCxcclxuICAgIGNhdGVnb3JpZXM6IDAsXHJcbiAgICBwcm9kdWN0czogMCxcclxuICAgIG9yZGVyczogMCxcclxuICAgIHJldmVudWU6IDAsXHJcbiAgICBmZWF0dXJlZEdlbXM6IDAsXHJcbiAgICBjcml0aWNhbFN0b2NrOiAwLFxyXG4gICAgcmVjZW50UHJvZHVjdHM6IFtdLFxyXG4gICAgY2F0ZWdvcnlEaXN0cmlidXRpb246IFtdLFxyXG4gIH0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgbG9hZERhc2hib2FyZCA9IGFzeW5jICgpID0+IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hZG1pbi9hcGkvZGFzaGJvYXJkXCIpO1xyXG4gICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBzZXREYXRhKHBheWxvYWQgfHwge30pO1xyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkRGFzaGJvYXJkKCk7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCB0b3BDYXRlZ29yaWVzID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBkYXRhLmNhdGVnb3J5RGlzdHJpYnV0aW9uIHx8IFtdO1xyXG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZGlzdHJpYnV0aW9uLm1hcCgoaXRlbSkgPT4gaXRlbS5jb3VudCksIDEpO1xyXG5cclxuICAgIHJldHVybiBkaXN0cmlidXRpb24ubWFwKChpdGVtKSA9PiAoe1xyXG4gICAgICAuLi5pdGVtLFxyXG4gICAgICB3aWR0aDogYCR7TWF0aC5tYXgoOCwgTWF0aC5yb3VuZCgoaXRlbS5jb3VudCAvIG1heCkgKiAxMDApKX0lYCxcclxuICAgIH0pKTtcclxuICB9LCBbZGF0YS5jYXRlZ29yeURpc3RyaWJ1dGlvbl0pO1xyXG5cclxuICBjb25zdCBjb21wbGV0aW9uUmF0ZSA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3QgdG90YWwgPSBOdW1iZXIoZGF0YS5wcm9kdWN0cyB8fCAwKTtcclxuICAgIGlmICh0b3RhbCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBoZWFsdGh5ID0gTWF0aC5tYXgodG90YWwgLSBOdW1iZXIoZGF0YS5jcml0aWNhbFN0b2NrIHx8IDApLCAwKTtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKChoZWFsdGh5IC8gdG90YWwpICogMTAwKTtcclxuICB9LCBbZGF0YS5wcm9kdWN0cywgZGF0YS5jcml0aWNhbFN0b2NrXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtZGFzaGJvYXJkXCI+XHJcbiAgICAgIDxzdHlsZT5cclxuICAgICAgICB7YFxyXG4gICAgICAgICAgLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgICAgLS1iZy0xOiB2YXIoLS1jaGFuZ2U4LWJnLTEsICMwNTA5MTQpO1xyXG4gICAgICAgICAgICAtLWJnLTI6IHZhcigtLWNoYW5nZTgtYmctMiwgIzBiMWEzOCk7XHJcbiAgICAgICAgICAgIC0tYmctMzogdmFyKC0tY2hhbmdlOC1iZy0zLCAjMTIxZjNhKTtcclxuICAgICAgICAgICAgLS1nb2xkOiB2YXIoLS1jaGFuZ2U4LWdvbGQsICNlMmJmNjYpO1xyXG4gICAgICAgICAgICAtLXRleHQtbWFpbjogdmFyKC0tY2hhbmdlOC10ZXh0LW1haW4sICNmOGZhZmMpO1xyXG4gICAgICAgICAgICAtLXRleHQtbXV0ZWQ6IHZhcigtLWNoYW5nZTgtdGV4dC1tdXRlZCwgIzlhYThjMSk7XHJcbiAgICAgICAgICAgIC0tbGluZTogdmFyKC0tY2hhbmdlOC1saW5lLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMjIpKTtcclxuICAgICAgICAgICAgLS1jYXJkLWJnOiB2YXIoLS1jaGFuZ2U4LWNhcmQtYmcsIGxpbmVhci1ncmFkaWVudCgxNjBkZWcsIHJnYmEoMjEsIDM0LCA2NiwgMC45NSkgMCUsIHJnYmEoMTAsIDE4LCAzNiwgMC45NSkgMTAwJSkpO1xyXG4gICAgICAgICAgICAtLWdyYWQtZW5kOiB2YXIoLS1jaGFuZ2U4LWdyYWQtZW5kLCAjMDQwNzBmKTtcclxuICAgICAgICAgICAgLS1zaGFkb3c6IHZhcigtLWNoYW5nZTgtc2hhZG93LCAwIDhweCAyNnB4IHJnYmEoMCwgMCwgMCwgMC4zKSk7XHJcbiAgICAgICAgICAgIC0tcmFkaWFsLTE6IHZhcigtLWNoYW5nZTgtcmFkaWFsLTEsIHJnYmEoMzQsIDkzLCAxODAsIDAuMzUpKTtcclxuICAgICAgICAgICAgLS1yYWRpYWwtMjogdmFyKC0tY2hhbmdlOC1yYWRpYWwtMiwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjE2KSk7XHJcblxyXG4gICAgICAgICAgICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICAgICAgICAgICAgcGFkZGluZzogMzBweDtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbWFpbik7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6XHJcbiAgICAgICAgICAgICAgcmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCA4JSAwJSwgdmFyKC0tcmFkaWFsLTEpIDAlLCByZ2JhKDM0LCA5MywgMTgwLCAwKSAzOCUpLFxyXG4gICAgICAgICAgICAgIHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgODUlIDEyJSwgdmFyKC0tcmFkaWFsLTIpIDAlLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDApIDQyJSksXHJcbiAgICAgICAgICAgICAgbGluZWFyLWdyYWRpZW50KDEyMGRlZywgdmFyKC0tYmctMSkgMCUsIHZhcigtLWJnLTIpIDQ4JSwgdmFyKC0tZ3JhZC1lbmQpIDEwMCUpO1xyXG4gICAgICAgICAgICBmb250LWZhbWlseTogXCJQb3BwaW5zXCIsIFwiU2Vnb2UgVUlcIiwgc2Fucy1zZXJpZjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LWJnLTE6ICNmMGY2ZmY7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC1iZy0yOiAjZmZmZmZmO1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtYmctMzogI2VlZjVmZjtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LWdvbGQ6ICNjMDhiMGY7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC10ZXh0LW1haW46ICMwZjE3MmE7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC10ZXh0LW11dGVkOiAjNDc1NTY5O1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtbGluZTogcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LWNhcmQtYmc6ICNmZmZmZmY7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC1ncmFkLWVuZDogI2Y4ZmJmZjtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LXNoYWRvdzogMCA0cHggMjBweCByZ2JhKDE1LCAyMywgNDIsIDAuMDYpO1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtcmFkaWFsLTE6IHJnYmEoMzQsIDkzLCAxODAsIDAuMDgpO1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtcmFkaWFsLTI6IHJnYmEoMTkyLCAxMzksIDE1LCAwLjA1KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1oZWFkZXIge1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgICAgICAgICBhbmltYXRpb246IGZhZGUtdXAgNTIwbXMgZWFzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1raWNrZXIge1xyXG4gICAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4zNmVtO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC10aXRsZSB7XHJcbiAgICAgICAgICAgIG1hcmdpbjogOHB4IDAgNnB4O1xyXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMS4wNjtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgzMnB4LCA1dncsIDU2cHgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXN1YnRpdGxlIHtcclxuICAgICAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1tZXRyaWMtZ3JpZCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDQsIG1pbm1heCgxNzBweCwgMWZyKSk7XHJcbiAgICAgICAgICAgIGdhcDogMTRweDtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogMThweDtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkIHtcclxuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDE2cHggMThweDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tY2FyZC1iZyk7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IHZhcigtLXNoYWRvdyk7XHJcbiAgICAgICAgICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xyXG4gICAgICAgICAgICBhbmltYXRpb246IGZhZGUtdXAgNTYwbXMgZWFzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkLWxhYmVsIHtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xOGVtO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkLXZhbHVlIHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgzNHB4LCA0dncsIDUycHgpO1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkLWhpbnQge1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogOHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWxheW91dCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogbWlubWF4KDMwMHB4LCAxLjhmcikgbWlubWF4KDI2MHB4LCAxZnIpO1xyXG4gICAgICAgICAgICBnYXA6IDE2cHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZ3Jlc3Mtd3JhcCB7XHJcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZ3Jlc3MtaGVhZCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1wcm9ncmVzcy10cmFjayB7XHJcbiAgICAgICAgICAgIGhlaWdodDogMTBweDtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xMik7XHJcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jaGFuZ2U4LXByb2dyZXNzLXRyYWNrIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNSwgMjMsIDQyLCAwLjEyKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1wcm9ncmVzcy1maWxsIHtcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLCAjZjVkZjkwIDAlLCAjZTJiZjY2IDEwMCUpO1xyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCAzMjBtcyBlYXNlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXJlY2VudC1saXN0IHtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogNnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXJlY2VudC1pdGVtIHtcclxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4IDA7XHJcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jaGFuZ2U4LXJlY2VudC1pdGVtIHtcclxuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4xMik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcmVjZW50LWl0ZW06bGFzdC1jaGlsZCB7XHJcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbmFtZSB7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1kYXRlIHtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJpY2Uge1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBAa2V5ZnJhbWVzIGZhZGUtdXAge1xyXG4gICAgICAgICAgICBmcm9tIHtcclxuICAgICAgICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg4cHgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRvIHtcclxuICAgICAgICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAxMTgwcHgpIHtcclxuICAgICAgICAgICAgLmNoYW5nZTgtbWV0cmljLWdyaWQge1xyXG4gICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgxODBweCwgMWZyKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LWxheW91dCB7XHJcbiAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNzIwcHgpIHtcclxuICAgICAgICAgICAgLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgICAgICBwYWRkaW5nOiAyMHB4IDE2cHg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LW1ldHJpYy1ncmlkIHtcclxuICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGB9XHJcbiAgICAgIDwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtaGVhZGVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWtpY2tlclwiPlNlY3Rpb24gVmlldzwvZGl2PlxyXG4gICAgICAgIDxoMSBjbGFzc05hbWU9XCJjaGFuZ2U4LXRpdGxlXCI+RGFzaGJvYXJkPC9oMT5cclxuICAgICAgICA8cCBjbGFzc05hbWU9XCJjaGFuZ2U4LXN1YnRpdGxlXCI+XHJcbiAgICAgICAgICBUcmFjayB5b3VyIGNvbW1lcmNlIGhlYWx0aCBhdCBhIGdsYW5jZSB3aXRoIGxpdmUgaW52ZW50b3J5IGFuZCBvcmRlclxyXG4gICAgICAgICAgc2lnbmFscy5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW1ldHJpYy1ncmlkXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+UmV2ZW51ZSBTdHJlYW08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+XHJcbiAgICAgICAgICAgIHtmb3JtYXRDdXJyZW5jeShkYXRhLnJldmVudWUpfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+QWNyb3NzIGFsbCBvcmRlcnM8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+SW52ZW50b3J5IFNpemU8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+e2RhdGEucHJvZHVjdHMgfHwgMH08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5Ub3RhbCBhY3RpdmUgY2F0YWxvZyBpdGVtczwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5GZWF0dXJlZCBHZW1zPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC12YWx1ZVwiPntkYXRhLmZlYXR1cmVkR2VtcyB8fCAwfTwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPkN1cnJlbnRseSB2aXNpYmxlIHByb2R1Y3RzPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPkNyaXRpY2FsIFN0b2NrPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC12YWx1ZVwiPntkYXRhLmNyaXRpY2FsU3RvY2sgfHwgMH08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5JdGVtcyBuZWVkaW5nIHVyZ2VudCByZWZpbGw8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbGF5b3V0XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+Q2F0ZWdvcnkgRGlzdHJpYnV0aW9uPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+SW52ZW50b3J5IHNwbGl0IGJ5IHNlZ21lbnQ8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3Mtd3JhcFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtaGVhZFwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuPkhlYWx0aHkgc3RvY2sgbGV2ZWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Y29tcGxldGlvblJhdGV9JTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLXRyYWNrXCI+XHJcbiAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9ncmVzcy1maWxsXCJcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBgJHtjb21wbGV0aW9uUmF0ZX0lYCB9fVxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgeyh0b3BDYXRlZ29yaWVzIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5ObyBjYXRlZ29yeSBkYXRhIHlldC48L2Rpdj5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICh0b3BDYXRlZ29yaWVzIHx8IFtdKS5tYXAoKGNhdGVnb3J5KSA9PiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e2NhdGVnb3J5Lm5hbWV9IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3Mtd3JhcFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWhlYWRcIj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4+e2NhdGVnb3J5Lm5hbWV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPntjYXRlZ29yeS5jb3VudH08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLXRyYWNrXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWZpbGxcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBjYXRlZ29yeS53aWR0aCB9fVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5SZWNlbnQgQWRkaXRpb25zPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+XHJcbiAgICAgICAgICAgIExhdGVzdCBwcm9kdWN0cyBlbnRlcmluZyB0aGUgY2F0YWxvZ1xyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgeyhkYXRhLnJlY2VudFByb2R1Y3RzIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIiBzdHlsZT17eyBtYXJnaW5Ub3A6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgIE5vIHByb2R1Y3RzIGFkZGVkIHlldC5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcmVjZW50LWxpc3RcIj5cclxuICAgICAgICAgICAgICB7KGRhdGEucmVjZW50UHJvZHVjdHMgfHwgW10pLm1hcCgocHJvZHVjdCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXJlY2VudC1pdGVtXCIga2V5PXtwcm9kdWN0LmlkfT5cclxuICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbmFtZVwiPntwcm9kdWN0Lm5hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWRhdGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIHtuZXcgRGF0ZShwcm9kdWN0LmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJpY2VcIj5cclxuICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0Q3VycmVuY3kocHJvZHVjdC5wcmljZSl9XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGFzaGJvYXJkO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgZ3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwicmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDI0MHB4LCAxZnIpKVwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBjYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE2cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yOClcIixcclxuICBiYWNrZ3JvdW5kOiBcImxpbmVhci1ncmFkaWVudCgxNjBkZWcsICMwYjFhMzggMCUsICMwOTE2MmYgMTAwJSlcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTJweCAyMnB4IHJnYmEoMiwgNiwgMjMsIDAuMjUpXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVdyYXBTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjIwMHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjMGYxNzJhXCIsXHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBwYWRkaW5nOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICBvYmplY3RGaXQ6IFwiY29udGFpblwiLFxyXG59O1xyXG5cclxuY29uc3QgYm9keVN0eWxlID0ge1xyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IG1ldGFTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjFmciAxZnJcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGJhZGdlU3R5bGUgPSAoaXNBY3RpdmUpID0+ICh7XHJcbiAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4wNWVtXCIsXHJcbiAgcGFkZGluZzogXCI1cHggMTBweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gIGNvbG9yOiBpc0FjdGl2ZSA/IFwiIzE0NTMyZFwiIDogXCIjN2YxZDFkXCIsXHJcbiAgYmFja2dyb3VuZDogaXNBY3RpdmUgPyBcIiNiYmY3ZDBcIiA6IFwiI2ZlY2FjYVwiLFxyXG59KTtcclxuXHJcbmNvbnN0IGxpbmtTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImlubGluZS1ibG9ja1wiLFxyXG4gIG1hcmdpblRvcDogXCI0cHhcIixcclxuICBjb2xvcjogXCIjOTNjNWZkXCIsXHJcbiAgdGV4dERlY29yYXRpb246IFwibm9uZVwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IGVtcHR5U3R5bGUgPSB7XHJcbiAgcGFkZGluZzogXCIxOHB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IFwiMXB4IGRhc2hlZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuNDUpXCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0UHJpY2UgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBhbW91bnQgPSBOdW1iZXIodmFsdWUgfHwgMCk7XHJcbiAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoYW1vdW50KSkge1xyXG4gICAgcmV0dXJuIFwiMC4wMFwiO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFtb3VudC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IGdldFJlY29yZElkID0gKHJlY29yZCkgPT4ge1xyXG4gIHJldHVybiByZWNvcmQ/LnBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZCB8fCByZWNvcmQ/LnBhcmFtPy5pZCB8fCBcIlwiO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0U2hvd0hyZWYgPSAocmVjb3JkLCByZXNvdXJjZUlkKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkQWN0aW9ucyA9IHJlY29yZD8ucmVjb3JkQWN0aW9ucyB8fCByZWNvcmQ/LmFjdGlvbnMgfHwgW107XHJcbiAgY29uc3Qgc2hvd0FjdGlvbiA9IHJlY29yZEFjdGlvbnMuZmluZCgoYWN0aW9uKSA9PiBhY3Rpb24/Lm5hbWUgPT09IFwic2hvd1wiKTtcclxuICBjb25zdCByYXdIcmVmID0gc2hvd0FjdGlvbj8uaHJlZiB8fCByZWNvcmQ/LmhyZWYgfHwgXCJcIjtcclxuXHJcbiAgaWYgKHJhd0hyZWYpIHtcclxuICAgIHJldHVybiByYXdIcmVmO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgaWQgPSBnZXRSZWNvcmRJZChyZWNvcmQpO1xyXG4gIHJldHVybiBpZFxyXG4gICAgPyBgL2FkbWluL3Jlc291cmNlcy8ke2VuY29kZVVSSUNvbXBvbmVudChyZXNvdXJjZUlkKX0vcmVjb3Jkcy8ke2VuY29kZVVSSUNvbXBvbmVudChpZCl9L3Nob3dgXHJcbiAgICA6IFwiXCI7XHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0Q2FyZHNMaXN0ID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgW2FwaVJlY29yZHMsIHNldEFwaVJlY29yZHNdID0gdXNlU3RhdGUoW10pO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbbG9hZEVycm9yLCBzZXRMb2FkRXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIGNvbnN0IHJlc291cmNlSWQgPVxyXG4gICAgcHJvcHM/LnJlc291cmNlPy5pZCA9PT0gXCJQcm9kdWN0XCJcclxuICAgICAgPyBcIlByb2R1Y3RzXCJcclxuICAgICAgOiBwcm9wcz8ucmVzb3VyY2U/LmlkIHx8IFwiUHJvZHVjdHNcIjtcclxuICBjb25zdCBwcm9wUmVjb3JkcyA9IHByb3BzPy5yZWNvcmRzIHx8IFtdO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHByb3BSZWNvcmRzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGlzTW91bnRlZCA9IHRydWU7XHJcblxyXG4gICAgY29uc3QgbG9hZFJlY29yZHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHNldExvYWRpbmcodHJ1ZSk7XHJcbiAgICAgIHNldExvYWRFcnJvcihcIlwiKTtcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgICAgIGAvYWRtaW4vYXBpL3Jlc291cmNlcy8ke2VuY29kZVVSSUNvbXBvbmVudChyZXNvdXJjZUlkKX0vYWN0aW9ucy9saXN0YCxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBheWxvYWQ/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gbG9hZCBwcm9kdWN0c1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldEFwaVJlY29yZHMocGF5bG9hZD8ucmVjb3JkcyB8fCBbXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldExvYWRFcnJvcihlcnJvcj8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIHByb2R1Y3RzXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBpZiAoaXNNb3VudGVkKSB7XHJcbiAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbG9hZFJlY29yZHMoKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBpc01vdW50ZWQgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgfSwgW3Byb3BSZWNvcmRzLmxlbmd0aCwgcmVzb3VyY2VJZF0pO1xyXG5cclxuICBjb25zdCByZWNvcmRzID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICByZXR1cm4gcHJvcFJlY29yZHMubGVuZ3RoID8gcHJvcFJlY29yZHMgOiBhcGlSZWNvcmRzO1xyXG4gIH0sIFtwcm9wUmVjb3JkcywgYXBpUmVjb3Jkc10pO1xyXG5cclxuICBpZiAobG9hZGluZykge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9PkxvYWRpbmcgcHJvZHVjdHMuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAobG9hZEVycm9yKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+e2xvYWRFcnJvcn08L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoIXJlY29yZHMubGVuZ3RoKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+Tm8gcHJvZHVjdHMgZm91bmQuPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e2dyaWRTdHlsZX0+XHJcbiAgICAgIHtyZWNvcmRzLm1hcCgocmVjb3JkKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge307XHJcbiAgICAgICAgY29uc3QgaWQgPSBnZXRSZWNvcmRJZChyZWNvcmQpO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBwYXJhbXM/Lm5hbWUgfHwgXCJVbm5hbWVkIHByb2R1Y3RcIjtcclxuICAgICAgICBjb25zdCBjYXRlZ29yeSA9IHBhcmFtcz8uY2F0ZWdvcnlJZCB8fCBcIi1cIjtcclxuICAgICAgICBjb25zdCBpbWFnZVVybCA9IHBhcmFtcz8uaW1hZ2VVcmwgfHwgXCJcIjtcclxuICAgICAgICBjb25zdCBzdG9jayA9IE51bWJlcihwYXJhbXM/LnN0b2NrIHx8IDApO1xyXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gQm9vbGVhbihwYXJhbXM/LmlzQWN0aXZlKTtcclxuICAgICAgICBjb25zdCBkZXRhaWxzSHJlZiA9IGdldFNob3dIcmVmKHJlY29yZCwgcmVzb3VyY2VJZCk7XHJcbiAgICAgICAgY29uc3Qgb3BlbkRldGFpbHMgPSAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZGV0YWlsc0hyZWYpIHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihkZXRhaWxzSHJlZik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgIDxhcnRpY2xlIGtleT17aWR9IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbWFnZVdyYXBTdHlsZX0+XHJcbiAgICAgICAgICAgICAge2ltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICAgICAgPGltZyBzcmM9e2ltYWdlVXJsfSBhbHQ9e25hbWV9IHN0eWxlPXtpbWFnZVN0eWxlfSAvPlxyXG4gICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIE5vIGltYWdlXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2JvZHlTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogXCIxOHB4XCIsIGZvbnRXZWlnaHQ6IDcwMCB9fT57bmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXttZXRhU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5DYXRlZ29yeToge2NhdGVnb3J5fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5TdG9jazoge3N0b2NrfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5QcmljZTogUnMuIHtmb3JtYXRQcmljZShwYXJhbXM/LnByaWNlKX08L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17YmFkZ2VTdHlsZShpc0FjdGl2ZSl9PlxyXG4gICAgICAgICAgICAgICAge2lzQWN0aXZlID8gXCJBQ1RJVkVcIiA6IFwiSU5BQ1RJVkVcIn1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgIGhyZWY9e2RldGFpbHNIcmVmIHx8IFwiI1wifVxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e2xpbmtTdHlsZX1cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICBvcGVuRGV0YWlscygpO1xyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgIGFyaWEtZGlzYWJsZWQ9eyFkZXRhaWxzSHJlZn1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICBWaWV3IGRldGFpbHNcclxuICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RDYXJkc0xpc3Q7XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHBhZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMThweFwiLFxyXG4gIGNvbG9yOiBcIiNlMmU4ZjBcIixcclxufTtcclxuXHJcbmNvbnN0IGhlcm9TdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgyODBweCwgMzYwcHgpIDFmclwiLFxyXG4gIGdhcDogXCIxOHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJzdHJldGNoXCIsXHJcbn07XHJcblxyXG5jb25zdCBwYW5lbFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIyMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTgpXCIsXHJcbiAgYmFja2dyb3VuZDpcclxuICAgIFwibGluZWFyLWdyYWRpZW50KDE2MGRlZywgcmdiYSgxMSwgMjYsIDU2LCAwLjk2KSAwJSwgcmdiYSg5LCAyMiwgNDcsIDAuOTYpIDEwMCUpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMjBweCA0MHB4IHJnYmEoMiwgNiwgMjMsIDAuMjQpXCIsXHJcbiAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVdyYXBTdHlsZSA9IHtcclxuICBtaW5IZWlnaHQ6IFwiMzYwcHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgZGlzcGxheTogXCJibG9ja1wiLFxyXG59O1xyXG5cclxuY29uc3QgaGVyb0JvZHlTdHlsZSA9IHtcclxuICBwYWRkaW5nOiBcIjIycHhcIixcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgdGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgZm9udFNpemU6IFwiY2xhbXAoMjhweCwgNHZ3LCA0NnB4KVwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuMDUsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3Qgc3VidGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGJhZGdlU3R5bGUgPSAoYWN0aXZlKSA9PiAoe1xyXG4gIGRpc3BsYXk6IFwiaW5saW5lLWZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIHdpZHRoOiBcImZpdC1jb250ZW50XCIsXHJcbiAgcGFkZGluZzogXCI2cHggMTJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjA4ZW1cIixcclxuICBjb2xvcjogYWN0aXZlID8gXCIjMTQ1MzJkXCIgOiBcIiM3ZjFkMWRcIixcclxuICBiYWNrZ3JvdW5kOiBhY3RpdmUgPyBcIiNiYmY3ZDBcIiA6IFwiI2ZlY2FjYVwiLFxyXG59KTtcclxuXHJcbmNvbnN0IHN0YXRzR3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwicmVwZWF0KDMsIG1pbm1heCgxNjBweCwgMWZyKSlcIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc3RhdENhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMTZweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjE1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSgxNSwgMjMsIDQyLCAwLjU4KVwiLFxyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc3RhdExhYmVsU3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjE2ZW1cIixcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgbWFyZ2luQm90dG9tOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc3RhdFZhbHVlU3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTZweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgd29yZEJyZWFrOiBcImJyZWFrLXdvcmRcIixcclxufTtcclxuXHJcbmNvbnN0IHNlY3Rpb25HcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJtaW5tYXgoMCwgMS40ZnIpIG1pbm1heCgyODBweCwgMC45ZnIpXCIsXHJcbiAgZ2FwOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHNlY3Rpb25UaXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMmVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBjb2xvcjogXCIjZjVkZjkwXCIsXHJcbn07XHJcblxyXG5jb25zdCBjb250ZW50Q2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIyMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTgpXCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDExLCAyNiwgNTYsIDAuOSlcIixcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxuICBib3hTaGFkb3c6IFwiMCAxNnB4IDI4cHggcmdiYSgyLCA2LCAyMywgMC4xNilcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9MaXN0U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9Sb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjEwcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9MYWJlbFN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvVmFsdWVTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgZm9udFdlaWdodDogNjAwLFxyXG4gIHRleHRBbGlnbjogXCJyaWdodFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGRlc2NyaXB0aW9uU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuNyxcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbiAgd2hpdGVTcGFjZTogXCJwcmUtd3JhcFwiLFxyXG59O1xyXG5cclxuY29uc3QgYnV0dG9uU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBwYWRkaW5nOiBcIjE0cHggMThweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgYm9yZGVyOiBcIm5vbmVcIixcclxuICBiYWNrZ3JvdW5kOiBcImxpbmVhci1ncmFkaWVudCgxMzVkZWcsICM2MzY2ZjEgMCUsICM4YjVjZjYgMTAwJSlcIixcclxuICBjb2xvcjogXCIjZmZmZmZmXCIsXHJcbiAgZm9udFNpemU6IFwiMTVweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIHRyYW5zaXRpb246IFwiYWxsIDAuM3MgZWFzZVwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDhweCAxNnB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjMpXCIsXHJcbn07XHJcblxyXG5jb25zdCBidXR0b25Ib3ZlclN0eWxlID0ge1xyXG4gIC4uLmJ1dHRvblN0eWxlLFxyXG4gIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVZKC0ycHgpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTJweCAyNHB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjQpXCIsXHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXRDdXJyZW5jeSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IGFtb3VudCA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gYFJzLiAke2Ftb3VudC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiBcIi1cIjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSk7XHJcbiAgaWYgKE51bWJlci5pc05hTihkYXRlLmdldFRpbWUoKSkpIHtcclxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBkYXRlU3R5bGU6IFwibWVkaXVtXCIsXHJcbiAgICB0aW1lU3R5bGU6IFwic2hvcnRcIixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IFByb2R1Y3RTaG93ID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkID0gcHJvcHM/LnJlY29yZDtcclxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fTtcclxuXHJcbiAgY29uc3QgbmFtZSA9IHBhcmFtcz8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwiO1xyXG4gIGNvbnN0IHNrdSA9IHBhcmFtcz8uc2t1IHx8IFwiLVwiO1xyXG4gIGNvbnN0IGNhdGVnb3J5ID0gcGFyYW1zPy5jYXRlZ29yeUlkIHx8IFwiLVwiO1xyXG4gIGNvbnN0IGltYWdlVXJsID0gcGFyYW1zPy5pbWFnZVVybCB8fCBcIlwiO1xyXG4gIGNvbnN0IHN0b2NrID0gTnVtYmVyKHBhcmFtcz8uc3RvY2sgfHwgMCk7XHJcbiAgY29uc3QgaXNBY3RpdmUgPSBCb29sZWFuKHBhcmFtcz8uaXNBY3RpdmUpO1xyXG4gIGNvbnN0IHByaWNlID0gZm9ybWF0Q3VycmVuY3kocGFyYW1zPy5wcmljZSk7XHJcbiAgY29uc3QgZGVzY3JpcHRpb24gPVxyXG4gICAgcGFyYW1zPy5kZXNjcmlwdGlvbiB8fCBcIk5vIGRlc2NyaXB0aW9uIGF2YWlsYWJsZSBmb3IgdGhpcyBwcm9kdWN0LlwiO1xyXG5cclxuICBjb25zdCBbYnV0dG9uSG92ZXJlZCwgc2V0QnV0dG9uSG92ZXJlZF0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZU9yZGVyQ2xpY2sgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBwcm9kdWN0SWQgPSBwYXJhbXM/LmlkIHx8IHJlY29yZD8uaWQgfHwgXCJcIjtcclxuICAgIGNvbnN0IG5ld09yZGVyVXJsID0gYC9hZG1pbi9yZXNvdXJjZXMvT3JkZXJzL2FjdGlvbnMvbmV3P3Byb2R1Y3RJZD0ke2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcocHJvZHVjdElkKSl9YDtcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24obmV3T3JkZXJVcmwpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+XHJcbiAgICAgICAge2BcclxuICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA5ODBweCkge1xyXG4gICAgICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LXNob3ctaGVybyxcclxuICAgICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LXNlY3Rpb25zIHtcclxuICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgYH1cclxuICAgICAgPC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LXNob3ctaGVyb1wiIHN0eWxlPXtoZXJvU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3BhbmVsU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW1hZ2VXcmFwU3R5bGV9PlxyXG4gICAgICAgICAgICB7aW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgPGltZyBzcmM9e2ltYWdlVXJsfSBhbHQ9e25hbWV9IHN0eWxlPXtpbWFnZVN0eWxlfSAvPlxyXG4gICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICBObyBpbWFnZSBhdmFpbGFibGVcclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtwYW5lbFN0eWxlfT5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2hlcm9Cb2R5U3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxoMSBzdHlsZT17dGl0bGVTdHlsZX0+e25hbWV9PC9oMT5cclxuICAgICAgICAgICAgICA8cCBzdHlsZT17c3VidGl0bGVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICBDbGVhbiBwcm9kdWN0IG92ZXJ2aWV3IGZvciBxdWljayByZXZpZXcgYW5kIG1hbmFnZW1lbnQuXHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2JhZGdlU3R5bGUoaXNBY3RpdmUpfT5cclxuICAgICAgICAgICAgICB7aXNBY3RpdmUgPyBcIkFDVElWRVwiIDogXCJJTkFDVElWRVwifVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRzR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0Q2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRMYWJlbFN0eWxlfT5QcmljZTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdFZhbHVlU3R5bGV9PntwcmljZX08L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0Q2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRMYWJlbFN0eWxlfT5TdG9jazwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2J1dHRvbkhvdmVyZWQgPyBidXR0b25Ib3ZlclN0eWxlIDogYnV0dG9uU3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0QnV0dG9uSG92ZXJlZCh0cnVlKX1cclxuICAgICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRCdXR0b25Ib3ZlcmVkKGZhbHNlKX1cclxuICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlT3JkZXJDbGlja31cclxuICAgICAgICAgICAgICAgICAgdGl0bGU9XCJDbGljayB0byBjcmVhdGUgYSBuZXcgb3JkZXIgZm9yIHRoaXMgcHJvZHVjdFwiXHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIDxzdmdcclxuICAgICAgICAgICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjE4XCJcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIxOFwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIyLjVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMjFcIiByPVwiMVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjIwXCIgY3k9XCIyMVwiIHI9XCIxXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEgMWg0bDIuNjggMTMuMzlhMiAyIDAgMCAwIDIgMS42MWg5LjcyYTIgMiAwIDAgMCAyLTEuNjFMMjMgNkg2XCIgLz5cclxuICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgIE9yZGVyIE5vd1xyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0VmFsdWVTdHlsZX0+e3N0b2NrfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRDYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdExhYmVsU3R5bGV9PlNLVTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdFZhbHVlU3R5bGV9Pntza3V9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3Qtc2hvdy1zZWN0aW9uc1wiIHN0eWxlPXtzZWN0aW9uR3JpZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjb250ZW50Q2FyZFN0eWxlfT5cclxuICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PkRlc2NyaXB0aW9uPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMiB9fSAvPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17ZGVzY3JpcHRpb25TdHlsZX0+e2Rlc2NyaXB0aW9ufTwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjb250ZW50Q2FyZFN0eWxlfT5cclxuICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlByb2R1Y3QgRGV0YWlsczwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTIgfX0gLz5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9MaXN0U3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvTGFiZWxTdHlsZX0+Q2F0ZWdvcnk8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT57Y2F0ZWdvcnl9PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PkNyZWF0ZWQgQXQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIHtmb3JtYXREYXRlKHBhcmFtcz8uY3JlYXRlZEF0KX1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvTGFiZWxTdHlsZX0+VXBkYXRlZCBBdDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb1ZhbHVlU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAge2Zvcm1hdERhdGUocGFyYW1zPy51cGRhdGVkQXQpfVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9MYWJlbFN0eWxlfT5SZWNvcmQgSUQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIHtwYXJhbXM/LmlkIHx8IHJlY29yZD8uaWQgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0U2hvdztcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcblxuY29uc3QgcGFnZVN0eWxlID0ge1xuICBkaXNwbGF5OiBcImdyaWRcIixcbiAgZ2FwOiBcIjIwcHhcIixcbiAgY29sb3I6IFwiI2UyZThmMFwiLFxufTtcblxuY29uc3QgaGVhZGVyU3R5bGUgPSB7XG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxuICBnYXA6IFwiNnB4XCIsXG59O1xuXG5jb25zdCB0aXRsZVN0eWxlID0ge1xuICBtYXJnaW46IDAsXG4gIGZvbnRTaXplOiBcIjM0cHhcIixcbiAgbGluZUhlaWdodDogMS4wOCxcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxufTtcblxuY29uc3QgZGVzY1N0eWxlID0ge1xuICBtYXJnaW46IDAsXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcbiAgZm9udFNpemU6IFwiMTRweFwiLFxufTtcblxuY29uc3QgY2FyZFN0eWxlID0ge1xuICBib3JkZXJSYWRpdXM6IFwiMThweFwiLFxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yKVwiLFxuICBiYWNrZ3JvdW5kOlxuICAgIFwibGluZWFyLWdyYWRpZW50KDE1MGRlZywgcmdiYSgxMCwgMjMsIDQ4LCAwLjk0KSAwJSwgcmdiYSg4LCAxOCwgMzgsIDAuOTQpIDEwMCUpXCIsXG4gIGJveFNoYWRvdzogXCIwIDE0cHggMjhweCByZ2JhKDIsIDYsIDIzLCAwLjIyKVwiLFxuICBwYWRkaW5nOiBcIjE4cHhcIixcbn07XG5cbmNvbnN0IHNlY3Rpb25UaXRsZVN0eWxlID0ge1xuICBtYXJnaW46IFwiMCAwIDE0cHggMFwiLFxuICBmb250U2l6ZTogXCIxM3B4XCIsXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMmVtXCIsXG4gIGNvbG9yOiBcIiNmNWRmOTBcIixcbiAgZm9udFdlaWdodDogODAwLFxufTtcblxuY29uc3QgbGF5b3V0U3R5bGUgPSB7XG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgzMDBweCwgMC45NWZyKSBtaW5tYXgoNDIwcHgsIDEuMjVmcilcIixcbiAgZ2FwOiBcIjE2cHhcIixcbn07XG5cbmNvbnN0IHN0YWNrU3R5bGUgPSB7XG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxuICBnYXA6IFwiMTZweFwiLFxufTtcblxuY29uc3QgbGFiZWxTdHlsZSA9IHtcbiAgZm9udFNpemU6IFwiMTFweFwiLFxuICBmb250V2VpZ2h0OiA3MDAsXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xZW1cIixcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxufTtcblxuY29uc3QgaW5wdXRTdHlsZSA9IHtcbiAgd2lkdGg6IFwiMTAwJVwiLFxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yNilcIixcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNjIpXCIsXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcbiAgcGFkZGluZzogXCIxMXB4IDEzcHhcIixcbiAgZm9udFNpemU6IFwiMTRweFwiLFxuICBmb250RmFtaWx5OiBcImluaGVyaXRcIixcbn07XG5cbmNvbnN0IHJvd1N0eWxlID0ge1xuICBkaXNwbGF5OiBcImdyaWRcIixcbiAgZ2FwOiBcIjhweFwiLFxufTtcblxuY29uc3QgZ3JpZDJTdHlsZSA9IHtcbiAgZGlzcGxheTogXCJncmlkXCIsXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDFmclwiLFxuICBnYXA6IFwiMTBweFwiLFxufTtcblxuY29uc3QgY3VzdG9tZXJJbmZvU3R5bGUgPSB7XG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxuICBnYXA6IFwiMTBweFwiLFxufTtcblxuY29uc3QgY3VzdG9tZXJSb3dTdHlsZSA9IHtcbiAgZGlzcGxheTogXCJmbGV4XCIsXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcbiAgZ2FwOiBcIjEwcHhcIixcbiAgZm9udFNpemU6IFwiMTNweFwiLFxuICBwYWRkaW5nQm90dG9tOiBcIjhweFwiLFxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcbn07XG5cbmNvbnN0IG11dGVkU3R5bGUgPSB7XG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcbn07XG5cbmNvbnN0IHN0cm9uZ1N0eWxlID0ge1xuICBjb2xvcjogXCIjZjhmYWZjXCIsXG4gIGZvbnRXZWlnaHQ6IDcwMCxcbiAgdGV4dEFsaWduOiBcInJpZ2h0XCIsXG59O1xuXG5jb25zdCBsaW5lSXRlbVJvd1N0eWxlID0ge1xuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yKVwiLFxuICBib3JkZXJSYWRpdXM6IFwiMTRweFwiLFxuICBwYWRkaW5nOiBcIjEycHhcIixcbiAgZGlzcGxheTogXCJncmlkXCIsXG4gIGdhcDogXCIxMnB4XCIsXG4gIGJhY2tncm91bmQ6IFwicmdiYSgxNSwgMjMsIDQyLCAwLjQ0KVwiLFxufTtcblxuY29uc3QgbGluZUl0ZW1Ub3BTdHlsZSA9IHtcbiAgZGlzcGxheTogXCJncmlkXCIsXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIGF1dG9cIixcbiAgZ2FwOiBcIjEwcHhcIixcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbn07XG5cbmNvbnN0IHByb2R1Y3RQcmV2aWV3U3R5bGUgPSB7XG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjU2cHggMWZyXCIsXG4gIGdhcDogXCIxMHB4XCIsXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXG59O1xuXG5jb25zdCBpbWFnZVN0eWxlID0ge1xuICB3aWR0aDogXCI1NnB4XCIsXG4gIGhlaWdodDogXCI1NnB4XCIsXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXG4gIG9iamVjdEZpdDogXCJjb3ZlclwiLFxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjUpXCIsXG59O1xuXG5jb25zdCBhZGRCdXR0b25TdHlsZSA9IHtcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMzUpXCIsXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXG4gIHBhZGRpbmc6IFwiOXB4IDEycHhcIixcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDk5LCAxMDIsIDI0MSwgMC4xOClcIixcbiAgY29sb3I6IFwiI2RiZWFmZVwiLFxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxuICBmb250V2VpZ2h0OiA3MDAsXG59O1xuXG5jb25zdCByZW1vdmVCdXR0b25TdHlsZSA9IHtcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDIzOSwgNjgsIDY4LCAwLjUpXCIsXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXG4gIHBhZGRpbmc6IFwiOHB4IDEwcHhcIixcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDEyNywgMjksIDI5LCAwLjI1KVwiLFxuICBjb2xvcjogXCIjZmVjYWNhXCIsXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gIGZvbnRTaXplOiBcIjEycHhcIixcbiAgZm9udFdlaWdodDogNzAwLFxufTtcblxuY29uc3QgdG90YWxzUm93U3R5bGUgPSB7XG4gIGRpc3BsYXk6IFwiZmxleFwiLFxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXG4gIHBhZGRpbmc6IFwiN3B4IDBcIixcbiAgZm9udFNpemU6IFwiMTNweFwiLFxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcbn07XG5cbmNvbnN0IHRvdGFsU3R5bGUgPSB7XG4gIC4uLnRvdGFsc1Jvd1N0eWxlLFxuICBmb250U2l6ZTogXCIxN3B4XCIsXG4gIGZvbnRXZWlnaHQ6IDgwMCxcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxuICBib3JkZXJCb3R0b206IFwibm9uZVwiLFxuICBwYWRkaW5nVG9wOiBcIjEycHhcIixcbn07XG5cbmNvbnN0IGFjdGlvbkJhclN0eWxlID0ge1xuICBkaXNwbGF5OiBcImdyaWRcIixcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyXCIsXG4gIGdhcDogXCIxMHB4XCIsXG59O1xuXG5jb25zdCBhY3Rpb25CdXR0b25TdHlsZSA9IChwcmltYXJ5KSA9PiAoe1xuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxuICBib3JkZXI6IHByaW1hcnkgPyBcIm5vbmVcIiA6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yOClcIixcbiAgcGFkZGluZzogXCIxMnB4IDE0cHhcIixcbiAgZm9udFdlaWdodDogNzAwLFxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxuICBiYWNrZ3JvdW5kOiBwcmltYXJ5XG4gICAgPyBcImxpbmVhci1ncmFkaWVudCgxMzVkZWcsICM2MzY2ZjEgMCUsICM4YjVjZjYgMTAwJSlcIlxuICAgIDogXCJyZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXG4gIGNvbG9yOiBwcmltYXJ5ID8gXCIjZmZmXCIgOiBcIiNkMWQ1ZGJcIixcbn0pO1xuXG5jb25zdCBtYXBMaW5rU3R5bGUgPSB7XG4gIGNvbG9yOiBcIiM5M2M1ZmRcIixcbiAgZm9udFNpemU6IFwiMTJweFwiLFxuICB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsXG59O1xuXG5jb25zdCByZXNwb25zaXZlQ3NzID0gYFxuQG1lZGlhIChtYXgtd2lkdGg6IDEwMjRweCkge1xuICAuY2hhbmdlOC1vcmRlci1sYXlvdXQge1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7XG4gIH1cbn1cbmA7XG5cbmNvbnN0IHBheW1lbnRPcHRpb25zID0gW1wiQ2FyZFwiLCBcIkNhc2ggb24gRGVsaXZlcnlcIiwgXCJCYW5rIFRyYW5zZmVyXCIsIFwiV2FsbGV0XCJdO1xuY29uc3Qgc2hpcHBpbmdNZXRob2RzID0gW1xuICBcIlBpY2tNZSBGbGFzaFwiLFxuICBcIlByb250b1wiLFxuICBcIkRvbWV4XCIsXG4gIFwiUmVnaXN0ZXJlZCBDb3VyaWVyXCIsXG5dO1xuXG5jb25zdCB0b051bWJlciA9ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBudW0gPSBOdW1iZXIodmFsdWUgfHwgMCk7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobnVtKSA/IG51bSA6IDA7XG59O1xuXG5jb25zdCBmb3JtYXRNb25leSA9ICh2YWx1ZSkgPT4ge1xuICByZXR1cm4gYFJzLiAke3RvTnVtYmVyKHZhbHVlKS50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxuICB9KX1gO1xufTtcblxuY29uc3QgY3JlYXRlRW1wdHlJdGVtID0gKCkgPT4gKHtcbiAgcHJvZHVjdElkOiBcIlwiLFxuICBxdWFudGl0eTogMSxcbiAgdW5pdFByaWNlOiAwLFxufSk7XG5cbmNvbnN0IE9yZGVyQ3JlYXRlID0gKCkgPT4ge1xuICBjb25zdCBbdXNlcnMsIHNldFVzZXJzXSA9IHVzZVN0YXRlKFtdKTtcbiAgY29uc3QgW3Byb2R1Y3RzLCBzZXRQcm9kdWN0c10gPSB1c2VTdGF0ZShbXSk7XG4gIGNvbnN0IFtvcmRlckNvdW50QnlVc2VyLCBzZXRPcmRlckNvdW50QnlVc2VyXSA9IHVzZVN0YXRlKHt9KTtcbiAgY29uc3QgW3Nlc3Npb25Vc2VyLCBzZXRTZXNzaW9uVXNlcl0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IFtzdWJtaXR0aW5nLCBzZXRTdWJtaXR0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCBbZm9ybURhdGEsIHNldEZvcm1EYXRhXSA9IHVzZVN0YXRlKHtcbiAgICB1c2VySWQ6IFwiXCIsXG4gICAgc3RhdHVzOiBcInBlbmRpbmdcIixcbiAgICBwYXltZW50TWV0aG9kOiBcIkNhcmRcIixcbiAgICBwYXltZW50U3RhdHVzOiBcInBlbmRpbmdcIixcbiAgICB0cmFuc2FjdGlvbklkOiBcIlwiLFxuICAgIHNoaXBwaW5nQWRkcmVzczogXCJcIixcbiAgICBzaGlwcGluZ01ldGhvZDogXCJQaWNrTWUgRmxhc2hcIixcbiAgICB0cmFja2luZ051bWJlcjogXCJcIixcbiAgICBzaGlwcGluZ0ZlZTogMCxcbiAgICB0YXg6IDAsXG4gICAgZGlzY291bnQ6IDAsXG4gIH0pO1xuXG4gIGNvbnN0IFtsaW5lSXRlbXMsIHNldExpbmVJdGVtc10gPSB1c2VTdGF0ZShbY3JlYXRlRW1wdHlJdGVtKCldKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gICAgY29uc3QgcHJlUHJvZHVjdElkID0gcGFyYW1zLmdldChcInByb2R1Y3RJZFwiKSB8fCBcIlwiO1xuXG4gICAgY29uc3QgZmV0Y2hEYXRhID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY29udGV4dFJlcyA9IGF3YWl0IGZldGNoKFxuICAgICAgICAgIGAvYWRtaW4vY29udGV4dC9vcmRlci1jcmVhdGUke1xuICAgICAgICAgICAgcHJlUHJvZHVjdElkID8gYD9wcm9kdWN0SWQ9JHtlbmNvZGVVUklDb21wb25lbnQocHJlUHJvZHVjdElkKX1gIDogXCJcIlxuICAgICAgICAgIH1gLFxuICAgICAgICAgIHsgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiB9LFxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGNvbnRleHREYXRhID0gY29udGV4dFJlcy5vayA/IGF3YWl0IGNvbnRleHRSZXMuanNvbigpIDoge307XG5cbiAgICAgICAgY29uc3QgdXNlcnNEYXRhID0gQXJyYXkuaXNBcnJheShjb250ZXh0RGF0YT8udXNlcnMpXG4gICAgICAgICAgPyBjb250ZXh0RGF0YS51c2Vyc1xuICAgICAgICAgIDogW107XG4gICAgICAgIGNvbnN0IHByb2R1Y3RzTGlzdCA9IEFycmF5LmlzQXJyYXkoY29udGV4dERhdGE/LnByb2R1Y3RzKVxuICAgICAgICAgID8gY29udGV4dERhdGEucHJvZHVjdHNcbiAgICAgICAgICA6IFtdO1xuXG4gICAgICAgIHNldFVzZXJzKHVzZXJzRGF0YSk7XG4gICAgICAgIHNldFByb2R1Y3RzKHByb2R1Y3RzTGlzdCk7XG4gICAgICAgIHNldE9yZGVyQ291bnRCeVVzZXIoY29udGV4dERhdGE/Lm9yZGVyQ291bnRCeVVzZXIgfHwge30pO1xuICAgICAgICBzZXRTZXNzaW9uVXNlcihjb250ZXh0RGF0YT8uY3VycmVudFVzZXIgfHwgbnVsbCk7XG5cbiAgICAgICAgaWYgKGNvbnRleHREYXRhPy5jdXJyZW50VXNlcj8uaWQpIHtcbiAgICAgICAgICBzZXRGb3JtRGF0YSgocHJldikgPT4gKHtcbiAgICAgICAgICAgIC4uLnByZXYsXG4gICAgICAgICAgICB1c2VySWQ6IHByZXYudXNlcklkIHx8IFN0cmluZyhjb250ZXh0RGF0YS5jdXJyZW50VXNlci5pZCksXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHREYXRhPy5zZWxlY3RlZFByb2R1Y3Q/LmlkKSB7XG4gICAgICAgICAgc2V0TGluZUl0ZW1zKFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcHJvZHVjdElkOiBTdHJpbmcoY29udGV4dERhdGEuc2VsZWN0ZWRQcm9kdWN0LmlkKSxcbiAgICAgICAgICAgICAgcXVhbnRpdHk6IDEsXG4gICAgICAgICAgICAgIHVuaXRQcmljZTogdG9OdW1iZXIoY29udGV4dERhdGEuc2VsZWN0ZWRQcm9kdWN0LnByaWNlKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIHByZVByb2R1Y3RJZCAmJlxuICAgICAgICAgIHByb2R1Y3RzTGlzdC5zb21lKChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhwcmVQcm9kdWN0SWQpKVxuICAgICAgICApIHtcbiAgICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHByb2R1Y3RzTGlzdC5maW5kKFxuICAgICAgICAgICAgKHApID0+IFN0cmluZyhwLmlkKSA9PT0gU3RyaW5nKHByZVByb2R1Y3RJZCksXG4gICAgICAgICAgKTtcbiAgICAgICAgICBzZXRMaW5lSXRlbXMoW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBwcm9kdWN0SWQ6IFN0cmluZyhwcmVQcm9kdWN0SWQpLFxuICAgICAgICAgICAgICBxdWFudGl0eTogMSxcbiAgICAgICAgICAgICAgdW5pdFByaWNlOiB0b051bWJlcihzZWxlY3RlZD8ucHJpY2UpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZldGNoRGF0YSgpO1xuICB9LCBbXSk7XG5cbiAgY29uc3Qgc2VsZWN0ZWRDdXN0b21lciA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiB1c2Vycy5maW5kKCh1KSA9PiBTdHJpbmcodS5pZCkgPT09IFN0cmluZyhmb3JtRGF0YS51c2VySWQpKSB8fCBudWxsO1xuICB9LCBbdXNlcnMsIGZvcm1EYXRhLnVzZXJJZF0pO1xuXG4gIGNvbnN0IGN1c3RvbWVyT3JkZXJDb3VudCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghc2VsZWN0ZWRDdXN0b21lcikge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIE51bWJlcihvcmRlckNvdW50QnlVc2VyW1N0cmluZyhzZWxlY3RlZEN1c3RvbWVyLmlkKV0gfHwgMCk7XG4gIH0sIFtvcmRlckNvdW50QnlVc2VyLCBzZWxlY3RlZEN1c3RvbWVyXSk7XG5cbiAgY29uc3QgbGluZVRvdGFscyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHN1YnRvdGFsID0gbGluZUl0ZW1zLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gc3VtICsgdG9OdW1iZXIoaXRlbS5xdWFudGl0eSkgKiB0b051bWJlcihpdGVtLnVuaXRQcmljZSk7XG4gICAgfSwgMCk7XG5cbiAgICBjb25zdCBzaGlwcGluZ0ZlZSA9IHRvTnVtYmVyKGZvcm1EYXRhLnNoaXBwaW5nRmVlKTtcbiAgICBjb25zdCB0YXggPSB0b051bWJlcihmb3JtRGF0YS50YXgpO1xuICAgIGNvbnN0IGRpc2NvdW50ID0gdG9OdW1iZXIoZm9ybURhdGEuZGlzY291bnQpO1xuICAgIGNvbnN0IGdyYW5kVG90YWwgPSBNYXRoLm1heChzdWJ0b3RhbCArIHNoaXBwaW5nRmVlICsgdGF4IC0gZGlzY291bnQsIDApO1xuXG4gICAgcmV0dXJuIHsgc3VidG90YWwsIHNoaXBwaW5nRmVlLCB0YXgsIGRpc2NvdW50LCBncmFuZFRvdGFsIH07XG4gIH0sIFtsaW5lSXRlbXMsIGZvcm1EYXRhLnNoaXBwaW5nRmVlLCBmb3JtRGF0YS50YXgsIGZvcm1EYXRhLmRpc2NvdW50XSk7XG5cbiAgY29uc3QgaGFuZGxlRm9ybUNoYW5nZSA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHsgbmFtZSwgdmFsdWUgfSA9IGV2ZW50LnRhcmdldDtcbiAgICBzZXRGb3JtRGF0YSgocHJldikgPT4gKHsgLi4ucHJldiwgW25hbWVdOiB2YWx1ZSB9KSk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlTGluZUl0ZW1DaGFuZ2UgPSAoaW5kZXgsIGtleSwgdmFsdWUpID0+IHtcbiAgICBzZXRMaW5lSXRlbXMoKHByZXYpID0+IHtcbiAgICAgIGNvbnN0IG5leHQgPSBbLi4ucHJldl07XG4gICAgICBjb25zdCBpdGVtID0geyAuLi5uZXh0W2luZGV4XSB9O1xuXG4gICAgICBpZiAoa2V5ID09PSBcInByb2R1Y3RJZFwiKSB7XG4gICAgICAgIGl0ZW0ucHJvZHVjdElkID0gdmFsdWU7XG4gICAgICAgIGNvbnN0IHByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyh2YWx1ZSkpO1xuICAgICAgICBpdGVtLnVuaXRQcmljZSA9IHRvTnVtYmVyKHByb2R1Y3Q/LnByaWNlKTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInF1YW50aXR5XCIpIHtcbiAgICAgICAgaXRlbS5xdWFudGl0eSA9IE1hdGgubWF4KDEsIHRvTnVtYmVyKHZhbHVlKSk7XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJ1bml0UHJpY2VcIikge1xuICAgICAgICBpdGVtLnVuaXRQcmljZSA9IE1hdGgubWF4KDAsIHRvTnVtYmVyKHZhbHVlKSk7XG4gICAgICB9XG5cbiAgICAgIG5leHRbaW5kZXhdID0gaXRlbTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGFkZExpbmVJdGVtID0gKCkgPT4ge1xuICAgIHNldExpbmVJdGVtcygocHJldikgPT4gWy4uLnByZXYsIGNyZWF0ZUVtcHR5SXRlbSgpXSk7XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlTGluZUl0ZW0gPSAoaW5kZXgpID0+IHtcbiAgICBzZXRMaW5lSXRlbXMoKHByZXYpID0+IHtcbiAgICAgIGlmIChwcmV2Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXYuZmlsdGVyKChfLCBpKSA9PiBpICE9PSBpbmRleCk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgbWFwc0hyZWYgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIWZvcm1EYXRhLnNoaXBwaW5nQWRkcmVzcz8udHJpbSgpKSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gYGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9zZWFyY2gvP2FwaT0xJnF1ZXJ5PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGZvcm1EYXRhLnNoaXBwaW5nQWRkcmVzcy50cmltKCkpfWA7XG4gIH0sIFtmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3NdKTtcblxuICBjb25zdCBoYW5kbGVTdWJtaXQgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgdmFsaWRJdGVtcyA9IGxpbmVJdGVtcy5maWx0ZXIoXG4gICAgICAoaXRlbSkgPT4gaXRlbS5wcm9kdWN0SWQgJiYgdG9OdW1iZXIoaXRlbS5xdWFudGl0eSkgPiAwLFxuICAgICk7XG5cbiAgICBpZiAoIWZvcm1EYXRhLnVzZXJJZCkge1xuICAgICAgYWxlcnQoXCJQbGVhc2Ugc2VsZWN0IGEgY3VzdG9tZXIuXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh2YWxpZEl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYWxlcnQoXCJBdCBsZWFzdCBvbmUgcHJvZHVjdCBsaW5lIGl0ZW0gaXMgcmVxdWlyZWQuXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNldFN1Ym1pdHRpbmcodHJ1ZSk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3Qgb3JkZXJQYXlsb2FkID0ge1xuICAgICAgICB1c2VySWQ6IE51bWJlcihmb3JtRGF0YS51c2VySWQpLFxuICAgICAgICBzdGF0dXM6IGZvcm1EYXRhLnN0YXR1cyxcbiAgICAgICAgcGF5bWVudE1ldGhvZDogZm9ybURhdGEucGF5bWVudE1ldGhvZCxcbiAgICAgICAgcGF5bWVudFN0YXR1czogZm9ybURhdGEucGF5bWVudFN0YXR1cyxcbiAgICAgICAgdHJhbnNhY3Rpb25JZDogZm9ybURhdGEudHJhbnNhY3Rpb25JZCB8fCBudWxsLFxuICAgICAgICBzaGlwcGluZ01ldGhvZDogZm9ybURhdGEuc2hpcHBpbmdNZXRob2QsXG4gICAgICAgIHRyYWNraW5nTnVtYmVyOiBmb3JtRGF0YS50cmFja2luZ051bWJlciB8fCBudWxsLFxuICAgICAgICBzdWJ0b3RhbDogbGluZVRvdGFscy5zdWJ0b3RhbC50b0ZpeGVkKDIpLFxuICAgICAgICBzaGlwcGluZ0ZlZTogbGluZVRvdGFscy5zaGlwcGluZ0ZlZS50b0ZpeGVkKDIpLFxuICAgICAgICB0YXg6IGxpbmVUb3RhbHMudGF4LnRvRml4ZWQoMiksXG4gICAgICAgIGRpc2NvdW50OiBsaW5lVG90YWxzLmRpc2NvdW50LnRvRml4ZWQoMiksXG4gICAgICAgIHRvdGFsQW1vdW50OiBsaW5lVG90YWxzLmdyYW5kVG90YWwudG9GaXhlZCgyKSxcbiAgICAgICAgc2hpcHBpbmdBZGRyZXNzOiBmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3MgfHwgbnVsbCxcbiAgICAgICAgbGluZUl0ZW1zOiB2YWxpZEl0ZW1zLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgICBwcm9kdWN0SWQ6IE51bWJlcihpdGVtLnByb2R1Y3RJZCksXG4gICAgICAgICAgcXVhbnRpdHk6IE1hdGgubWF4KDEsIHRvTnVtYmVyKGl0ZW0ucXVhbnRpdHkpKSxcbiAgICAgICAgICB1bml0UHJpY2U6IE1hdGgubWF4KDAsIHRvTnVtYmVyKGl0ZW0udW5pdFByaWNlKSkudG9GaXhlZCgyKSxcbiAgICAgICAgfSkpLFxuICAgICAgfTtcblxuICAgICAgY29uc3Qgc3VibWl0Rm9ybSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgc3VibWl0Rm9ybS5hcHBlbmQoXCJwYXlsb2FkXCIsIEpTT04uc3RyaW5naWZ5KG9yZGVyUGF5bG9hZCkpO1xuXG4gICAgICBjb25zdCBvcmRlclJlcyA9IGF3YWl0IGZldGNoKFwiL2FkbWluL2NvbnRleHQvb3JkZXItY3JlYXRlL3N1Ym1pdFwiLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICAgIGJvZHk6IHN1Ym1pdEZvcm0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgb3JkZXJEYXRhID0gYXdhaXQgb3JkZXJSZXMuanNvbigpO1xuICAgICAgaWYgKCFvcmRlclJlcy5vaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3Iob3JkZXJEYXRhPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGNyZWF0ZSBvcmRlclwiKTtcbiAgICAgIH1cblxuICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihcbiAgICAgICAgYC9hZG1pbi9yZXNvdXJjZXMvT3JkZXJzL3JlY29yZHMvJHtvcmRlckRhdGEuaWR9L3Nob3dgLFxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYWxlcnQoZXJyb3IubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBjcmVhdGUgb3JkZXJcIik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFN1Ym1pdHRpbmcoZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3BhZ2VTdHlsZX0+XG4gICAgICA8c3R5bGU+e3Jlc3BvbnNpdmVDc3N9PC9zdHlsZT5cblxuICAgICAgPGRpdiBzdHlsZT17aGVhZGVyU3R5bGV9PlxuICAgICAgICA8aDEgc3R5bGU9e3RpdGxlU3R5bGV9PkNyZWF0ZSBOZXcgT3JkZXI8L2gxPlxuICAgICAgICA8cCBzdHlsZT17ZGVzY1N0eWxlfT5cbiAgICAgICAgICBDdXN0b21lciBkZXRhaWxzLCBsaW5lIGl0ZW1zLCBwYXltZW50LCBzaGlwcGluZywgYW5kIHRvdGFscyBpbiBvbmVcbiAgICAgICAgICBndWlkZWQgZmxvdy5cbiAgICAgICAgPC9wPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxmb3JtIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9IHN0eWxlPXt7IGRpc3BsYXk6IFwiZ3JpZFwiLCBnYXA6IFwiMTZweFwiIH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItbGF5b3V0XCIgc3R5bGU9e2xheW91dFN0eWxlfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGFja1N0eWxlfT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XG4gICAgICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PkN1c3RvbWVyIERldGFpbHM8L2gyPlxuXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNlbGVjdCBDdXN0b21lciAqPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICAgICAgICBuYW1lPVwidXNlcklkXCJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS51c2VySWR9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxuICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtsb2FkaW5nIHx8IHNlc3Npb25Vc2VyPy5yb2xlID09PSBcInVzZXJcIn1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+XG4gICAgICAgICAgICAgICAgICAgIHtsb2FkaW5nID8gXCJMb2FkaW5nIGN1c3RvbWVycy4uLlwiIDogXCJTZWxlY3QgYSBjdXN0b21lclwifVxuICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICB7dXNlcnMubWFwKCh1c2VyKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXt1c2VyLmlkfSB2YWx1ZT17dXNlci5pZH0+XG4gICAgICAgICAgICAgICAgICAgICAge3VzZXIubmFtZX0gKCN7dXNlci5pZH0pXG4gICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMiB9fSAvPlxuXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVySW5mb1N0eWxlfT5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtjdXN0b21lclJvd1N0eWxlfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5DdXN0b21lciBOYW1lICYgSUQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17c3Ryb25nU3R5bGV9PlxuICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRDdXN0b21lclxuICAgICAgICAgICAgICAgICAgICAgID8gYCR7c2VsZWN0ZWRDdXN0b21lci5uYW1lfSAoIyR7c2VsZWN0ZWRDdXN0b21lci5pZH0pYFxuICAgICAgICAgICAgICAgICAgICAgIDogXCItXCJ9XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJSb3dTdHlsZX0+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+RW1haWw8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17c3Ryb25nU3R5bGV9PlxuICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRDdXN0b21lcj8uZW1haWwgfHwgXCItXCJ9XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJSb3dTdHlsZX0+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+UGhvbmUgTnVtYmVyPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0cm9uZ1N0eWxlfT5cbiAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkQ3VzdG9tZXI/LnBob25lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRDdXN0b21lcj8ubW9iaWxlIHx8XG4gICAgICAgICAgICAgICAgICAgICAgXCJOb3QgYXZhaWxhYmxlXCJ9XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJSb3dTdHlsZX0+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+T3JkZXIgSGlzdG9yeTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtzdHJvbmdTdHlsZX0+XG4gICAgICAgICAgICAgICAgICAgIHtjdXN0b21lck9yZGVyQ291bnR9IHByZXZpb3VzIG9yZGVyc1xuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5QYXltZW50ICYgQmlsbGluZzwvaDI+XG5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Z3JpZDJTdHlsZX0+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5QYXltZW50IE1ldGhvZDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJwYXltZW50TWV0aG9kXCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnBheW1lbnRNZXRob2R9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge3BheW1lbnRPcHRpb25zLm1hcCgoaXRlbSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtpdGVtfSB2YWx1ZT17aXRlbX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7aXRlbX1cbiAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+UGF5bWVudCBTdGF0dXM8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwicGF5bWVudFN0YXR1c1wiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5wYXltZW50U3RhdHVzfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwZW5kaW5nXCI+UGVuZGluZzwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicGFpZFwiPlBhaWQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cblxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5UcmFuc2FjdGlvbiBJRDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICBuYW1lPVwidHJhbnNhY3Rpb25JZFwiXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudHJhbnNhY3Rpb25JZH1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gVFhOLTIwMjYtMDAwMTI0XCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBzdHlsZT17c3RhY2tTdHlsZX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICAgICAgICAgICAgICAgIGdhcDogXCI4cHhcIixcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGgyIHN0eWxlPXt7IC4uLnNlY3Rpb25UaXRsZVN0eWxlLCBtYXJnaW5Cb3R0b206IDAgfX0+XG4gICAgICAgICAgICAgICAgICBQcm9kdWN0IExpbmUgSXRlbXMgKFJlcXVpcmVkKVxuICAgICAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXthZGRMaW5lSXRlbX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXthZGRCdXR0b25TdHlsZX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICArIEFkZCBJdGVtXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMiB9fSAvPlxuXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCIxMHB4XCIgfX0+XG4gICAgICAgICAgICAgICAge2xpbmVJdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZFByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKFxuICAgICAgICAgICAgICAgICAgICAocCkgPT4gU3RyaW5nKHAuaWQpID09PSBTdHJpbmcoaXRlbS5wcm9kdWN0SWQpLFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1Ub3RhbCA9XG4gICAgICAgICAgICAgICAgICAgIHRvTnVtYmVyKGl0ZW0ucXVhbnRpdHkpICogdG9OdW1iZXIoaXRlbS51bml0UHJpY2UpO1xuXG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17YGxpbmUtaXRlbS0ke2luZGV4fWB9IHN0eWxlPXtsaW5lSXRlbVJvd1N0eWxlfT5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtsaW5lSXRlbVRvcFN0eWxlfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5Qcm9kdWN0PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnByb2R1Y3RJZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTGluZUl0ZW1DaGFuZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInByb2R1Y3RJZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+U2VsZWN0IHByb2R1Y3Q8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdHMubWFwKChwcm9kdWN0KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17cHJvZHVjdC5pZH0gdmFsdWU9e3Byb2R1Y3QuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdC5uYW1lfSAoU0tVOiB7cHJvZHVjdC5za3V9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtyZW1vdmVCdXR0b25TdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcmVtb3ZlTGluZUl0ZW0oaW5kZXgpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICBSZW1vdmVcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cHJvZHVjdFByZXZpZXdTdHlsZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRQcm9kdWN0Py5pbWFnZVVybCA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17c2VsZWN0ZWRQcm9kdWN0LmltYWdlVXJsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdD17c2VsZWN0ZWRQcm9kdWN0Lm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmltYWdlU3R5bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBcIjExcHhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gaW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ2FwOiBcIjNweFwiIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IFwiMTRweFwiLCBjb2xvcjogXCIjZjhmYWZjXCIgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZFByb2R1Y3Q/Lm5hbWUgfHwgXCJTZWxlY3QgYSBwcm9kdWN0XCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogXCIxMnB4XCIsIGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTS1UvSUQ6e1wiIFwifVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZFByb2R1Y3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYCR7c2VsZWN0ZWRQcm9kdWN0LnNrdX0gLyAjJHtzZWxlY3RlZFByb2R1Y3QuaWR9YFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIi1cIn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtncmlkMlN0eWxlfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5RdWFudGl0eTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnF1YW50aXR5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVMaW5lSXRlbUNoYW5nZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicXVhbnRpdHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+VW5pdCBQcmljZTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aXRlbS51bml0UHJpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxpbmVJdGVtQ2hhbmdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1bml0UHJpY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAuLi50b3RhbHNSb3dTdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ0JvdHRvbTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PkxpbmUgVG90YWw8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGNvbG9yOiBcIiNmOGZhZmNcIiB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdE1vbmV5KGl0ZW1Ub3RhbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5TaGlwcGluZyAmIFRyYWNraW5nPC9oMj5cblxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TaGlwcGluZyBBZGRyZXNzPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJzaGlwcGluZ0FkZHJlc3NcIlxuICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnNoaXBwaW5nQWRkcmVzc31cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgLi4uaW5wdXRTdHlsZSxcbiAgICAgICAgICAgICAgICAgICAgbWluSGVpZ2h0OiBcIjg2cHhcIixcbiAgICAgICAgICAgICAgICAgICAgcmVzaXplOiBcInZlcnRpY2FsXCIsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJIb3VzZSBudW1iZXIsIHN0cmVldCwgY2l0eSwgcG9zdGFsIGNvZGVcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAge21hcHNIcmVmID8gKFxuICAgICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgaHJlZj17bWFwc0hyZWZ9XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17bWFwTGlua1N0eWxlfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICBPcGVuIG9uIEdvb2dsZSBNYXBzXG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMCB9fSAvPlxuXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2dyaWQyU3R5bGV9PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+U2hpcHBpbmcgTWV0aG9kPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxzZWxlY3RcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nTWV0aG9kXCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnNoaXBwaW5nTWV0aG9kfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtzaGlwcGluZ01ldGhvZHMubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2l0ZW19IHZhbHVlPXtpdGVtfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtfVxuICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+VHJhY2tpbmcgTnVtYmVyPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwidHJhY2tpbmdOdW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudHJhY2tpbmdOdW1iZXJ9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJUUkstWFhYWFhYXCJcbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XG4gICAgICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9Pk9yZGVyIFN1bW1hcnkgLyBUb3RhbHM8L2gyPlxuXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2dyaWQyU3R5bGV9PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+U2hpcHBpbmcgRmVlPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nRmVlXCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnNoaXBwaW5nRmVlfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+VGF4IC8gVkFUPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInRheFwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS50YXh9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMCB9fSAvPlxuXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PkRpc2NvdW50IC8gQ291cG9uPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxuICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXG4gICAgICAgICAgICAgICAgICBuYW1lPVwiZGlzY291bnRcIlxuICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLmRpc2NvdW50fVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTIgfX0gLz5cblxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbHNSb3dTdHlsZX0+XG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PlN1YnRvdGFsPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGxpbmVUb3RhbHMuc3VidG90YWwpfTwvc3Ryb25nPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxzUm93U3R5bGV9PlxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5TaGlwcGluZyBGZWU8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkobGluZVRvdGFscy5zaGlwcGluZ0ZlZSl9PC9zdHJvbmc+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbHNSb3dTdHlsZX0+XG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PlRheCAvIFZBVDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leShsaW5lVG90YWxzLnRheCl9PC9zdHJvbmc+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbHNSb3dTdHlsZX0+XG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PkRpc2NvdW50PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzdHJvbmc+LSB7Zm9ybWF0TW9uZXkobGluZVRvdGFscy5kaXNjb3VudCl9PC9zdHJvbmc+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFN0eWxlfT5cbiAgICAgICAgICAgICAgICA8c3Bhbj5HcmFuZCBUb3RhbDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3Bhbj57Zm9ybWF0TW9uZXkobGluZVRvdGFscy5ncmFuZFRvdGFsKX08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgLi4uY2FyZFN0eWxlLCBwYWRkaW5nVG9wOiBcIjE0cHhcIiB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXthY3Rpb25CYXJTdHlsZX0+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBzdHlsZT17YWN0aW9uQnV0dG9uU3R5bGUoZmFsc2UpfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB3aW5kb3cuaGlzdG9yeS5iYWNrKCl9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtzdWJtaXR0aW5nfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcbiAgICAgICAgICAgICAgc3R5bGU9e2FjdGlvbkJ1dHRvblN0eWxlKHRydWUpfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17c3VibWl0dGluZ31cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3N1Ym1pdHRpbmcgPyBcIkNyZWF0aW5nIE9yZGVyLi4uXCIgOiBcIkNyZWF0ZSBPcmRlclwifVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9mb3JtPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgT3JkZXJDcmVhdGU7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgcGFnZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbiAgY29sb3I6IFwiI2UyZThmMFwiLFxyXG59O1xyXG5cclxuY29uc3QgY2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxOHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMilcIixcclxuICBiYWNrZ3JvdW5kOlxyXG4gICAgXCJsaW5lYXItZ3JhZGllbnQoMTU1ZGVnLCByZ2JhKDEwLCAyMywgNDgsIDAuOTQpIDAlLCByZ2JhKDgsIDE4LCAzOCwgMC45NCkgMTAwJSlcIixcclxuICBib3hTaGFkb3c6IFwiMCAxNHB4IDMwcHggcmdiYSgyLCA2LCAyMywgMC4yKVwiLFxyXG4gIHBhZGRpbmc6IFwiMThweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaGVhZGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IGhlYWRpbmdTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZvbnRTaXplOiBcIjM0cHhcIixcclxuICBsaW5lSGVpZ2h0OiAxLjEsXHJcbn07XHJcblxyXG5jb25zdCBzdWJUZXh0U3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBtYXJnaW5Ub3A6IFwiNHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBiYWRnZVN0eWxlID0gKHN0YXR1cykgPT4ge1xyXG4gIGNvbnN0IHZhbCA9IFN0cmluZyhzdGF0dXMgfHwgXCJwZW5kaW5nXCIpLnRvTG93ZXJDYXNlKCk7XHJcbiAgY29uc3Qgc3R5bGVCeVN0YXR1cyA9IHtcclxuICAgIHBlbmRpbmc6IHsgYmc6IFwiI2ZlZjNjN1wiLCBmZzogXCIjN2MyZDEyXCIgfSxcclxuICAgIHBhaWQ6IHsgYmc6IFwiI2JiZjdkMFwiLCBmZzogXCIjMTQ1MzJkXCIgfSxcclxuICAgIHByb2Nlc3Npbmc6IHsgYmc6IFwiI2JmZGJmZVwiLCBmZzogXCIjMWUzYThhXCIgfSxcclxuICAgIHNoaXBwZWQ6IHsgYmc6IFwiI2RkZDZmZVwiLCBmZzogXCIjNGMxZDk1XCIgfSxcclxuICAgIGNvbXBsZXRlZDogeyBiZzogXCIjYTdmM2QwXCIsIGZnOiBcIiMwNjRlM2JcIiB9LFxyXG4gICAgY2FuY2VsbGVkOiB7IGJnOiBcIiNmZWNhY2FcIiwgZmc6IFwiIzdmMWQxZFwiIH0sXHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgc2VsZWN0ZWQgPSBzdHlsZUJ5U3RhdHVzW3ZhbF0gfHwgc3R5bGVCeVN0YXR1cy5wZW5kaW5nO1xyXG4gIHJldHVybiB7XHJcbiAgICBkaXNwbGF5OiBcImlubGluZS1mbGV4XCIsXHJcbiAgICBwYWRkaW5nOiBcIjZweCAxMnB4XCIsXHJcbiAgICBib3JkZXJSYWRpdXM6IFwiOTk5cHhcIixcclxuICAgIGZvbnRTaXplOiBcIjExcHhcIixcclxuICAgIGZvbnRXZWlnaHQ6IDgwMCxcclxuICAgIGxldHRlclNwYWNpbmc6IFwiMC4wOGVtXCIsXHJcbiAgICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gICAgYmFja2dyb3VuZDogc2VsZWN0ZWQuYmcsXHJcbiAgICBjb2xvcjogc2VsZWN0ZWQuZmcsXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IHNlY3Rpb25UaXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogXCIwIDAgMTJweCAwXCIsXHJcbiAgY29sb3I6IFwiI2Y1ZGY5MFwiLFxyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjExZW1cIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG59O1xyXG5cclxuY29uc3QgZ3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwibWlubWF4KDMwMHB4LCAxZnIpIG1pbm1heCgzMjBweCwgMWZyKVwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvR3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9Sb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjhweFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IHRhYmxlU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGxpbmVJdGVtU3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjIpXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE0cHhcIixcclxuICBwYWRkaW5nOiBcIjEwcHhcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTUsIDIzLCA0MiwgMC40NClcIixcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjYwcHggMWZyIGF1dG9cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjYwcHhcIixcclxuICBoZWlnaHQ6IFwiNjBweFwiLFxyXG4gIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjIpXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjMGYxNzJhXCIsXHJcbn07XHJcblxyXG5jb25zdCB0b3RhbEJveFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHRvdGFsUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjdweFwiLFxyXG59O1xyXG5cclxuY29uc3QgZ3JhbmRTdHlsZSA9IHtcclxuICAuLi50b3RhbFJvd1N0eWxlLFxyXG4gIGJvcmRlckJvdHRvbTogXCJub25lXCIsXHJcbiAgcGFkZGluZ1RvcDogXCI2cHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgZm9udFNpemU6IFwiMThweFwiLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IGVtcHR5U3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgcGFkZGluZzogXCIxNHB4XCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0TW9uZXkgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBuID0gTnVtYmVyKHZhbHVlIHx8IDApO1xyXG4gIHJldHVybiBgUnMuICR7bi50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiBcIi1cIjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGR0ID0gbmV3IERhdGUodmFsdWUpO1xyXG4gIGlmIChOdW1iZXIuaXNOYU4oZHQuZ2V0VGltZSgpKSkge1xyXG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZHQudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBkYXRlU3R5bGU6IFwibWVkaXVtXCIsXHJcbiAgICB0aW1lU3R5bGU6IFwic2hvcnRcIixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IE9yZGVyU2hvdyA9ICh7IHJlY29yZCB9KSA9PiB7XHJcbiAgY29uc3QgW2RldGFpbHMsIHNldERldGFpbHNdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XHJcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgY29uc3Qgb3JkZXJJZCA9IHJlY29yZD8ucGFyYW1zPy5pZCB8fCByZWNvcmQ/LmlkO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKCFvcmRlcklkKSB7XHJcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICBzZXRFcnJvcihcIk9yZGVyIGlkIG5vdCBmb3VuZFwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxvYWREZXRhaWxzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHNldEVycm9yKFwiXCIpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgICAgICBgL2FkbWluL2NvbnRleHQvb3JkZXJzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhvcmRlcklkKSl9L2RldGFpbHNgLFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihwYXlsb2FkPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgb3JkZXIgZGV0YWlsc1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldERldGFpbHMocGF5bG9hZCk7XHJcbiAgICAgIH0gY2F0Y2ggKGZldGNoRXJyb3IpIHtcclxuICAgICAgICBzZXRFcnJvcihmZXRjaEVycm9yPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgb3JkZXIgZGV0YWlsc1wiKTtcclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkRGV0YWlscygpO1xyXG4gIH0sIFtvcmRlcklkXSk7XHJcblxyXG4gIGNvbnN0IHRvdGFscyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3Qgc3VidG90YWwgPSBOdW1iZXIoZGV0YWlscz8uc3VidG90YWwgfHwgMCk7XHJcbiAgICBjb25zdCBzaGlwcGluZ0ZlZSA9IE51bWJlcihkZXRhaWxzPy5zaGlwcGluZ0ZlZSB8fCAwKTtcclxuICAgIGNvbnN0IHRheCA9IE51bWJlcihkZXRhaWxzPy50YXggfHwgMCk7XHJcbiAgICBjb25zdCBkaXNjb3VudCA9IE51bWJlcihkZXRhaWxzPy5kaXNjb3VudCB8fCAwKTtcclxuICAgIGNvbnN0IHRvdGFsQW1vdW50ID0gTnVtYmVyKGRldGFpbHM/LnRvdGFsQW1vdW50IHx8IDApO1xyXG5cclxuICAgIHJldHVybiB7IHN1YnRvdGFsLCBzaGlwcGluZ0ZlZSwgdGF4LCBkaXNjb3VudCwgdG90YWxBbW91bnQgfTtcclxuICB9LCBbZGV0YWlsc10pO1xyXG5cclxuICBpZiAobG9hZGluZykge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9PkxvYWRpbmcgb3JkZXIgZGV0YWlscy4uLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9PntlcnJvcn08L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoIWRldGFpbHMpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5PcmRlciBkZXRhaWxzIG5vdCBhdmFpbGFibGUuPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3BhZ2VTdHlsZX0+XHJcbiAgICAgIDxzdHlsZT57YEBtZWRpYSAobWF4LXdpZHRoOiAxMDQwcHgpIHsgLmNoYW5nZTgtb3JkZXItc2hvdy1ncmlkIHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgIWltcG9ydGFudDsgfSB9YH08L3N0eWxlPlxyXG5cclxuICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtoZWFkZXJTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8aDEgc3R5bGU9e2hlYWRpbmdTdHlsZX0+T3JkZXIgI3tkZXRhaWxzLmlkfTwvaDE+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N1YlRleHRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgQ3JlYXRlZCB7Zm9ybWF0RGF0ZShkZXRhaWxzLmNyZWF0ZWRBdCl9IHwgVXBkYXRlZHtcIiBcIn1cclxuICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShkZXRhaWxzLnVwZGF0ZWRBdCl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8c3BhbiBzdHlsZT17YmFkZ2VTdHlsZShkZXRhaWxzLnN0YXR1cyl9PlxyXG4gICAgICAgICAgICB7ZGV0YWlscy5zdGF0dXMgfHwgXCJwZW5kaW5nXCJ9XHJcbiAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLXNob3ctZ3JpZFwiIHN0eWxlPXtncmlkU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5DdXN0b21lciAmIFNoaXBwaW5nPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5DdXN0b21lcjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy51c2VyPy5uYW1lIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+RW1haWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8udXNlcj8uZW1haWwgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5QYXltZW50IE1ldGhvZDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy5wYXltZW50TWV0aG9kIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UGF5bWVudCBTdGF0dXM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8ucGF5bWVudFN0YXR1cyB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlRyYW5zYWN0aW9uIElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnRyYW5zYWN0aW9uSWQgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5TaGlwcGluZyBNZXRob2Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8uc2hpcHBpbmdNZXRob2QgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5UcmFja2luZyBOdW1iZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8udHJhY2tpbmdOdW1iZXIgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IFwiMTNweFwiLCBjb2xvcjogXCIjY2JkNWUxXCIsIGxpbmVIZWlnaHQ6IDEuNiB9fVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIsIG1hcmdpbkJvdHRvbTogXCI0cHhcIiB9fT5cclxuICAgICAgICAgICAgICAgIFNoaXBwaW5nIEFkZHJlc3NcclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdoaXRlU3BhY2U6IFwicHJlLXdyYXBcIiB9fT5cclxuICAgICAgICAgICAgICAgIHtkZXRhaWxzPy5zaGlwcGluZ0FkZHJlc3MgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5PcmRlciBTdW1tYXJ5IC8gVG90YWxzPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsQm94U3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U3VidG90YWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkodG90YWxzLnN1YnRvdGFsKX08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5TaGlwcGluZyBGZWU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkodG90YWxzLnNoaXBwaW5nRmVlKX08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5UYXggLyBWQVQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkodG90YWxzLnRheCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+RGlzY291bnQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz4tIHtmb3JtYXRNb25leSh0b3RhbHMuZGlzY291bnQpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Z3JhbmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4+R3JhbmQgVG90YWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4+e2Zvcm1hdE1vbmV5KHRvdGFscy50b3RhbEFtb3VudCl9PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UHJvZHVjdCBMaW5lIEl0ZW1zPC9oMj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt0YWJsZVN0eWxlfT5cclxuICAgICAgICAgIHsoZGV0YWlscz8uaXRlbXMgfHwgW10pLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+Tm8gbGluZSBpdGVtcyBpbiB0aGlzIG9yZGVyLjwvZGl2PlxyXG4gICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgKGRldGFpbHMuaXRlbXMgfHwgW10pLm1hcCgoaXRlbSkgPT4gKFxyXG4gICAgICAgICAgICAgIDxkaXYga2V5PXtpdGVtLmlkfSBzdHlsZT17bGluZUl0ZW1TdHlsZX0+XHJcbiAgICAgICAgICAgICAgICB7aXRlbT8ucHJvZHVjdD8uaW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICAgICAgICBzcmM9e2l0ZW0ucHJvZHVjdC5pbWFnZVVybH1cclxuICAgICAgICAgICAgICAgICAgICBhbHQ9e2l0ZW0/LnByb2R1Y3Q/Lm5hbWUgfHwgXCJQcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgIC4uLmltYWdlU3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBcIjExcHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgTm8gaW1hZ2VcclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCI0cHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIsIGZvbnRTaXplOiBcIjE0cHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICB7aXRlbT8ucHJvZHVjdD8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgU0tVOiB7aXRlbT8ucHJvZHVjdD8uc2t1IHx8IFwiLVwifSB8IFByb2R1Y3QgSUQ6ICNcclxuICAgICAgICAgICAgICAgICAgICB7aXRlbT8ucHJvZHVjdElkfVxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiNjYmQ1ZTFcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIFF0eToge2l0ZW0ucXVhbnRpdHl9IHgge2Zvcm1hdE1vbmV5KGl0ZW0udW5pdFByaWNlKX1cclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIsIGZvbnRTaXplOiBcIjE1cHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAge2Zvcm1hdE1vbmV5KGl0ZW0udG90YWxQcmljZSl9XHJcbiAgICAgICAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9yZGVyU2hvdztcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHBhZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG4gIGNvbG9yOiBcIiNlMmU4ZjBcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMThweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIpXCIsXHJcbiAgYmFja2dyb3VuZDpcclxuICAgIFwibGluZWFyLWdyYWRpZW50KDE1NWRlZywgcmdiYSgxMCwgMjMsIDQ4LCAwLjk0KSAwJSwgcmdiYSg4LCAxOCwgMzgsIDAuOTQpIDEwMCUpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTRweCAzMHB4IHJnYmEoMiwgNiwgMjMsIDAuMilcIixcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGhlYWRlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCB0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBmb250U2l6ZTogXCIzNHB4XCIsXHJcbiAgbGluZUhlaWdodDogMS4xLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IHN1YnRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiBcIjZweCAwIDAgMFwiLFxyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCBiYWRnZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiaW5saW5lLWZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIHdpZHRoOiBcImZpdC1jb250ZW50XCIsXHJcbiAgcGFkZGluZzogXCI2cHggMTJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjA4ZW1cIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gIGNvbG9yOiBcIiMxNDUzMmRcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNiYmY3ZDBcIixcclxufTtcclxuXHJcbmNvbnN0IGdyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgzMDBweCwgMC45NWZyKSBtaW5tYXgoMzIwcHgsIDEuMDVmcilcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdGlvblRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiBcIjAgMCAxMnB4IDBcIixcclxuICBjb2xvcjogXCIjZjVkZjkwXCIsXHJcbiAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTFlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvR3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9Sb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjhweFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIGhlaWdodDogXCIyODBweFwiLFxyXG4gIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjMGYxNzJhXCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjIpXCIsXHJcbn07XHJcblxyXG5jb25zdCBsaW5lSXRlbVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiODRweCAxZnIgYXV0b1wiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBwYWRkaW5nOiBcIjEycHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTRweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIpXCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNDQpXCIsXHJcbn07XHJcblxyXG5jb25zdCBlbXB0eUltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiODRweFwiLFxyXG4gIGhlaWdodDogXCI4NHB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yMilcIixcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0b3RhbFJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI3cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGdyYW5kU3R5bGUgPSB7XHJcbiAgLi4udG90YWxSb3dTdHlsZSxcclxuICBib3JkZXJCb3R0b206IFwibm9uZVwiLFxyXG4gIHBhZGRpbmdUb3A6IFwiNnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGZvbnRTaXplOiBcIjE4cHhcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBlbXB0eVN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggZGFzaGVkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdE1vbmV5ID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgbiA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gYFJzLiAke24udG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSl9YDtcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUpID0+IHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gXCItXCI7XHJcbiAgfVxyXG5cclxuICBjb25zdCBkdCA9IG5ldyBEYXRlKHZhbHVlKTtcclxuICBpZiAoTnVtYmVyLmlzTmFOKGR0LmdldFRpbWUoKSkpIHtcclxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGR0LnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgZGF0ZVN0eWxlOiBcIm1lZGl1bVwiLFxyXG4gICAgdGltZVN0eWxlOiBcInNob3J0XCIsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBPcmRlckl0ZW1TaG93ID0gKHsgcmVjb3JkIH0pID0+IHtcclxuICBjb25zdCBbZGV0YWlscywgc2V0RGV0YWlsc10gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG5cclxuICBjb25zdCBvcmRlckl0ZW1JZCA9IHJlY29yZD8ucGFyYW1zPy5pZCB8fCByZWNvcmQ/LmlkO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKCFvcmRlckl0ZW1JZCkge1xyXG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgc2V0RXJyb3IoXCJPcmRlciBpdGVtIGlkIG5vdCBmb3VuZFwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxvYWREZXRhaWxzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHNldEVycm9yKFwiXCIpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgICAgICBgL2FkbWluL2NvbnRleHQvb3JkZXItaXRlbXMvJHtlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKG9yZGVySXRlbUlkKSl9L2RldGFpbHNgLFxyXG4gICAgICAgICAgeyBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgIHBheWxvYWQ/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gbG9hZCBvcmRlciBpdGVtIGRldGFpbHNcIixcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXREZXRhaWxzKHBheWxvYWQpO1xyXG4gICAgICB9IGNhdGNoIChmZXRjaEVycm9yKSB7XHJcbiAgICAgICAgc2V0RXJyb3IoZmV0Y2hFcnJvcj8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGl0ZW0gZGV0YWlsc1wiKTtcclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkRGV0YWlscygpO1xyXG4gIH0sIFtvcmRlckl0ZW1JZF0pO1xyXG5cclxuICBjb25zdCBjYWxjdWxhdGVkVG90YWwgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiBOdW1iZXIoZGV0YWlscz8udG90YWxQcmljZSB8fCAwKTtcclxuICB9LCBbZGV0YWlsc10pO1xyXG5cclxuICBpZiAobG9hZGluZykge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9PkxvYWRpbmcgb3JkZXIgaXRlbSBkZXRhaWxzLi4uPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+e2Vycm9yfTwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmICghZGV0YWlscykge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9Pk9yZGVyIGl0ZW0gZGV0YWlscyBub3QgYXZhaWxhYmxlLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIGNvbnN0IHByb2R1Y3QgPSBkZXRhaWxzPy5wcm9kdWN0IHx8IHt9O1xyXG4gIGNvbnN0IG9yZGVyID0gZGV0YWlscz8ub3JkZXIgfHwge307XHJcbiAgY29uc3QgY3VzdG9tZXIgPSBvcmRlcj8udXNlciB8fCB7fTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3BhZ2VTdHlsZX0+XHJcbiAgICAgIDxzdHlsZT57YEBtZWRpYSAobWF4LXdpZHRoOiAxMDQwcHgpIHsgLmNoYW5nZTgtb3JkZXItaXRlbS1ncmlkIHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgIWltcG9ydGFudDsgfSB9YH08L3N0eWxlPlxyXG5cclxuICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtoZWFkZXJTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8aDEgc3R5bGU9e3RpdGxlU3R5bGV9Pntwcm9kdWN0Py5uYW1lIHx8IFwiT3JkZXIgSXRlbVwifTwvaDE+XHJcbiAgICAgICAgICAgIDxwIHN0eWxlPXtzdWJ0aXRsZVN0eWxlfT5cclxuICAgICAgICAgICAgICBPcmRlciAje29yZGVyPy5pZCB8fCBcIi1cIn0g4oCiIEl0ZW0gI3tkZXRhaWxzPy5pZCB8fCBcIi1cIn1cclxuICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8c3BhbiBzdHlsZT17YmFkZ2VTdHlsZX0+QWN0aXZlIEl0ZW08L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWl0ZW0tZ3JpZFwiIHN0eWxlPXtncmlkU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICB7cHJvZHVjdD8uaW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICBzcmM9e3Byb2R1Y3QuaW1hZ2VVcmx9XHJcbiAgICAgICAgICAgICAgYWx0PXtwcm9kdWN0Py5uYW1lIHx8IFwiUHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgIHN0eWxlPXtpbWFnZVN0eWxlfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAuLi5pbWFnZVN0eWxlLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIE5vIGltYWdlIGF2YWlsYWJsZVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDE0IH19IC8+XHJcblxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UHJvZHVjdCBTbmFwc2hvdDwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UHJvZHVjdCBOYW1lPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e3Byb2R1Y3Q/Lm5hbWUgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5TS1U8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57cHJvZHVjdD8uc2t1IHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UHJvZHVjdCBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPiN7cHJvZHVjdD8uaWQgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5DdXJyZW50IFN0b2NrPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e3Byb2R1Y3Q/LnN0b2NrID8/IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+T3JkZXIgJiBDdXN0b21lcjwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+Q3VzdG9tZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Y3VzdG9tZXI/Lm5hbWUgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5FbWFpbDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntjdXN0b21lcj8uZW1haWwgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5PcmRlciBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPiN7b3JkZXI/LmlkIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+T3JkZXIgU3RhdHVzPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e29yZGVyPy5zdGF0dXMgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5QYXltZW50IE1ldGhvZDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntvcmRlcj8ucGF5bWVudE1ldGhvZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlNoaXBwaW5nIE1ldGhvZDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntvcmRlcj8uc2hpcHBpbmdNZXRob2QgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5UcmFja2luZyBOdW1iZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57b3JkZXI/LnRyYWNraW5nTnVtYmVyIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+Q3JlYXRlZCBBdDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntmb3JtYXREYXRlKGRldGFpbHMuY3JlYXRlZEF0KX08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlByaWNpbmcgRGV0YWlsczwvaDI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17aW5mb0dyaWRTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UXVhbnRpdHk8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHMucXVhbnRpdHl9PC9zdHJvbmc+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5Vbml0IFByaWNlPC9zcGFuPlxyXG4gICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leShkZXRhaWxzLnVuaXRQcmljZSl9PC9zdHJvbmc+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5MaW5lIFRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leShjYWxjdWxhdGVkVG90YWwpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5RdWljayBTdW1tYXJ5PC9oMj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtsaW5lSXRlbVN0eWxlfT5cclxuICAgICAgICAgIHtwcm9kdWN0Py5pbWFnZVVybCA/IChcclxuICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgIHNyYz17cHJvZHVjdC5pbWFnZVVybH1cclxuICAgICAgICAgICAgICBhbHQ9e3Byb2R1Y3Q/Lm5hbWUgfHwgXCJQcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBcIjg0cHhcIixcclxuICAgICAgICAgICAgICAgIGhlaWdodDogXCI4NHB4XCIsXHJcbiAgICAgICAgICAgICAgICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2VtcHR5SW1hZ2VTdHlsZX0+Tm8gaW1hZ2U8L2Rpdj5cclxuICAgICAgICAgICl9XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZ3JpZFwiLCBnYXA6IFwiNHB4XCIgfX0+XHJcbiAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAge3Byb2R1Y3Q/Lm5hbWUgfHwgXCJVbm5hbWVkIHByb2R1Y3RcIn1cclxuICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgIFNLVToge3Byb2R1Y3Q/LnNrdSB8fCBcIi1cIn1cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjY2JkNWUxXCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICBRdHkge2RldGFpbHMucXVhbnRpdHl9IHgge2Zvcm1hdE1vbmV5KGRldGFpbHMudW5pdFByaWNlKX1cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGNvbG9yOiBcIiNmOGZhZmNcIiwgZm9udFNpemU6IFwiMTZweFwiIH19PlxyXG4gICAgICAgICAgICB7Zm9ybWF0TW9uZXkoY2FsY3VsYXRlZFRvdGFsKX1cclxuICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlckl0ZW1TaG93O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgY2VsbFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBtaW5IZWlnaHQ6IFwiNTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2NHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjQycHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZsZXhTaHJpbms6IDAsXHJcbn07XHJcblxyXG5jb25zdCBmYWxsYmFja1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjY0cHhcIixcclxuICBoZWlnaHQ6IFwiNDJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjYpXCIsXHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgY29sb3I6IFwiIzY0NzQ4YlwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZsZXhTaHJpbms6IDAsXHJcbn07XHJcblxyXG5jb25zdCB0ZXh0U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcclxuICBnYXA6IFwiMnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0SW1hZ2UgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCBpbWFnZVVybCA9IHByb3BzPy5yZWNvcmQ/LnBhcmFtcz8uW3Byb3BzPy5wcm9wZXJ0eT8ucGF0aF07XHJcbiAgY29uc3QgW2hhc0Vycm9yLCBzZXRIYXNFcnJvcl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBzZXRIYXNFcnJvcihmYWxzZSk7XHJcbiAgfSwgW2ltYWdlVXJsXSk7XHJcblxyXG4gIGlmICghaW1hZ2VVcmwpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtmYWxsYmFja1N0eWxlfT5ObyBpbWFnZTwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChoYXNFcnJvcikge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBzdHlsZT17Y2VsbFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtmYWxsYmFja1N0eWxlfT5JbnZhbGlkPC9kaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IFwiIzBmMTcyYVwiIH19PkltYWdlIFVSTDwvc3Bhbj5cclxuICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgIGhyZWY9e2ltYWdlVXJsfVxyXG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICBjb2xvcjogXCIjMjU2M2ViXCIsXHJcbiAgICAgICAgICAgICAgdGV4dERlY29yYXRpb246IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgT3BlbiBsaW5rXHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtjZWxsU3R5bGV9PlxyXG4gICAgICA8aW1nXHJcbiAgICAgICAgc3JjPXtpbWFnZVVybH1cclxuICAgICAgICBhbHQ9XCJQcm9kdWN0XCJcclxuICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX1cclxuICAgICAgICBvbkVycm9yPXsoKSA9PiBzZXRIYXNFcnJvcih0cnVlKX1cclxuICAgICAgLz5cclxuICAgICAgPGRpdiBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBcIiMwZjE3MmFcIiB9fT5QcmV2aWV3PC9zcGFuPlxyXG4gICAgICAgIDxhXHJcbiAgICAgICAgICBocmVmPXtpbWFnZVVybH1cclxuICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXHJcbiAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiBcIiMyNTYzZWJcIiwgdGV4dERlY29yYXRpb246IFwibm9uZVwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICBPcGVuIGltYWdlXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0SW1hZ2U7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCB3cmFwcGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG59O1xyXG5cclxuY29uc3QgcHJldmlld1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjE0MHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjk2cHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3QgaGludFN0eWxlID0ge1xyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBjb2xvcjogXCIjNjQ3NDhiXCIsXHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0SW1hZ2VVcGxvYWQgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCB7IG9uQ2hhbmdlLCByZWNvcmQgfSA9IHByb3BzO1xyXG4gIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHJlY29yZD8ucGFyYW1zPy5pbWFnZVVybCB8fCBcIlwiO1xyXG4gIGNvbnN0IGN1cnJlbnRQdWJsaWNJZCA9IHJlY29yZD8ucGFyYW1zPy5pbWFnZVB1YmxpY0lkIHx8IFwiXCI7XHJcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoY3VycmVudFZhbHVlKTtcclxuICBjb25zdCBbcHVibGljSWQsIHNldFB1YmxpY0lkXSA9IHVzZVN0YXRlKGN1cnJlbnRQdWJsaWNJZCk7XHJcbiAgY29uc3QgW3VwbG9hZGluZywgc2V0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgc2V0UHJldmlld1VybChjdXJyZW50VmFsdWUpO1xyXG4gICAgc2V0UHVibGljSWQoY3VycmVudFB1YmxpY0lkKTtcclxuICB9LCBbY3VycmVudFZhbHVlLCBjdXJyZW50UHVibGljSWRdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlVXBsb2FkID0gYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF07XHJcblxyXG4gICAgaWYgKCFmaWxlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSk7XHJcbiAgICBzZXRFcnJvcihcIlwiKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXCJpbWFnZVwiLCBmaWxlKTtcclxuXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvYXBpL3VwbG9hZHMvaW1hZ2VcIiwge1xyXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgYm9keTogZm9ybURhdGEsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZC5tZXNzYWdlIHx8IFwiSW1hZ2UgdXBsb2FkIGZhaWxlZFwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdXBsb2FkZWRVcmwgPSBwYXlsb2FkLnVybCB8fCBcIlwiO1xyXG4gICAgICBjb25zdCB1cGxvYWRlZFB1YmxpY0lkID0gcGF5bG9hZC5wdWJsaWNJZCB8fCBcIlwiO1xyXG4gICAgICBzZXRQcmV2aWV3VXJsKHVwbG9hZGVkVXJsKTtcclxuICAgICAgc2V0UHVibGljSWQodXBsb2FkZWRQdWJsaWNJZCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVVybFwiLCB1cGxvYWRlZFVybCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVB1YmxpY0lkXCIsIHVwbG9hZGVkUHVibGljSWQpO1xyXG4gICAgICBvbkNoYW5nZT8uKFwidXBsb2FkSW1hZ2VcIiwgdXBsb2FkZWRVcmwpO1xyXG4gICAgfSBjYXRjaCAodXBsb2FkRXJyb3IpIHtcclxuICAgICAgc2V0RXJyb3IodXBsb2FkRXJyb3IubWVzc2FnZSk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpO1xyXG4gICAgICBldmVudC50YXJnZXQudmFsdWUgPSBcIlwiO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZVJlbW92ZSA9ICgpID0+IHtcclxuICAgIHNldFByZXZpZXdVcmwoXCJcIik7XHJcbiAgICBzZXRQdWJsaWNJZChcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVVybFwiLCBcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVB1YmxpY0lkXCIsIFwiXCIpO1xyXG4gICAgb25DaGFuZ2U/LihcInVwbG9hZEltYWdlXCIsIFwiXCIpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt3cmFwcGVyU3R5bGV9PlxyXG4gICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e2hhbmRsZVVwbG9hZH0gLz5cclxuICAgICAgPGRpdiBzdHlsZT17aGludFN0eWxlfT5cclxuICAgICAgICB7dXBsb2FkaW5nXHJcbiAgICAgICAgICA/IFwiVXBsb2FkaW5nIHRvIENsb3VkaW5hcnkuLi5cIlxyXG4gICAgICAgICAgOiBcIkNob29zZSBhbiBpbWFnZSBmaWxlIHRvIHVwbG9hZFwifVxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHtwcmV2aWV3VXJsID8gKFxyXG4gICAgICAgIDw+XHJcbiAgICAgICAgICA8aW1nIHNyYz17cHJldmlld1VybH0gYWx0PVwiUHJvZHVjdCBwcmV2aWV3XCIgc3R5bGU9e3ByZXZpZXdTdHlsZX0gLz5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVJlbW92ZX1cclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwiNnB4IDEwcHhcIixcclxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IFwiOHB4XCIsXHJcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjZWY0NDQ0XCIsXHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiI2VmNDQ0NFwiLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiI2ZmZlwiLFxyXG4gICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIFJlbW92ZSBpbWFnZVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC8+XHJcbiAgICAgICkgOiBudWxsfVxyXG5cclxuICAgICAge2Vycm9yID8gKFxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgLi4uaGludFN0eWxlLCBjb2xvcjogXCIjZGMyNjI2XCIgfX0+e2Vycm9yfTwvZGl2PlxyXG4gICAgICApIDogbnVsbH1cclxuXHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImltYWdlVXJsXCIgdmFsdWU9e3ByZXZpZXdVcmx9IHJlYWRPbmx5IC8+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImltYWdlUHVibGljSWRcIiB2YWx1ZT17cHVibGljSWR9IHJlYWRPbmx5IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdEltYWdlVXBsb2FkO1xyXG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi4vYWRtaW4vZGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmRcbmltcG9ydCBQcm9kdWN0Q2FyZHNMaXN0IGZyb20gJy4uL2FkbWluL3Byb2R1Y3QtY2FyZHMtbGlzdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdENhcmRzTGlzdCA9IFByb2R1Y3RDYXJkc0xpc3RcbmltcG9ydCBQcm9kdWN0U2hvdyBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LXNob3cnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RTaG93ID0gUHJvZHVjdFNob3dcbmltcG9ydCBPcmRlckNyZWF0ZSBmcm9tICcuLi9hZG1pbi9vcmRlci1jcmVhdGUnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLk9yZGVyQ3JlYXRlID0gT3JkZXJDcmVhdGVcbmltcG9ydCBPcmRlclNob3cgZnJvbSAnLi4vYWRtaW4vb3JkZXItc2hvdydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuT3JkZXJTaG93ID0gT3JkZXJTaG93XG5pbXBvcnQgT3JkZXJJdGVtU2hvdyBmcm9tICcuLi9hZG1pbi9vcmRlci1pdGVtLXNob3cnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLk9yZGVySXRlbVNob3cgPSBPcmRlckl0ZW1TaG93XG5pbXBvcnQgUHJvZHVjdEltYWdlIGZyb20gJy4uL2FkbWluL3Byb2R1Y3QtaW1hZ2UnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RJbWFnZSA9IFByb2R1Y3RJbWFnZVxuaW1wb3J0IFByb2R1Y3RJbWFnZVVwbG9hZCBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LWltYWdlLXVwbG9hZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdEltYWdlVXBsb2FkID0gUHJvZHVjdEltYWdlVXBsb2FkIl0sIm5hbWVzIjpbImZvcm1hdEN1cnJlbmN5IiwidmFsdWUiLCJOdW1iZXIiLCJ0b0xvY2FsZVN0cmluZyIsIkRhc2hib2FyZCIsImRhdGEiLCJzZXREYXRhIiwidXNlU3RhdGUiLCJ1c2VycyIsImNhdGVnb3JpZXMiLCJwcm9kdWN0cyIsIm9yZGVycyIsInJldmVudWUiLCJmZWF0dXJlZEdlbXMiLCJjcml0aWNhbFN0b2NrIiwicmVjZW50UHJvZHVjdHMiLCJjYXRlZ29yeURpc3RyaWJ1dGlvbiIsInVzZUVmZmVjdCIsImxvYWREYXNoYm9hcmQiLCJyZXNwb25zZSIsImZldGNoIiwicGF5bG9hZCIsImpzb24iLCJ0b3BDYXRlZ29yaWVzIiwidXNlTWVtbyIsImRpc3RyaWJ1dGlvbiIsIm1heCIsIk1hdGgiLCJtYXAiLCJpdGVtIiwiY291bnQiLCJ3aWR0aCIsInJvdW5kIiwiY29tcGxldGlvblJhdGUiLCJ0b3RhbCIsImhlYWx0aHkiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJzdHlsZSIsImxlbmd0aCIsImNhdGVnb3J5Iiwia2V5IiwibmFtZSIsIm1hcmdpblRvcCIsInByb2R1Y3QiLCJpZCIsIkRhdGUiLCJjcmVhdGVkQXQiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJwcmljZSIsImdyaWRTdHlsZSIsImRpc3BsYXkiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwiZ2FwIiwiY2FyZFN0eWxlIiwiYm9yZGVyUmFkaXVzIiwiYm9yZGVyIiwiYmFja2dyb3VuZCIsImNvbG9yIiwib3ZlcmZsb3ciLCJib3hTaGFkb3ciLCJpbWFnZVdyYXBTdHlsZSIsImhlaWdodCIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsInBhZGRpbmciLCJpbWFnZVN0eWxlIiwib2JqZWN0Rml0IiwiYm9keVN0eWxlIiwibWV0YVN0eWxlIiwiZm9udFNpemUiLCJiYWRnZVN0eWxlIiwiaXNBY3RpdmUiLCJmb250V2VpZ2h0IiwibGV0dGVyU3BhY2luZyIsImxpbmtTdHlsZSIsInRleHREZWNvcmF0aW9uIiwiY3Vyc29yIiwiZW1wdHlTdHlsZSIsImZvcm1hdFByaWNlIiwiYW1vdW50IiwiaXNGaW5pdGUiLCJ1bmRlZmluZWQiLCJtaW5pbXVtRnJhY3Rpb25EaWdpdHMiLCJtYXhpbXVtRnJhY3Rpb25EaWdpdHMiLCJnZXRSZWNvcmRJZCIsInJlY29yZCIsInBhcmFtcyIsInBhcmFtIiwiZ2V0U2hvd0hyZWYiLCJyZXNvdXJjZUlkIiwicmVjb3JkQWN0aW9ucyIsImFjdGlvbnMiLCJzaG93QWN0aW9uIiwiZmluZCIsImFjdGlvbiIsInJhd0hyZWYiLCJocmVmIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiUHJvZHVjdENhcmRzTGlzdCIsInByb3BzIiwiYXBpUmVjb3JkcyIsInNldEFwaVJlY29yZHMiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImxvYWRFcnJvciIsInNldExvYWRFcnJvciIsInJlc291cmNlIiwicHJvcFJlY29yZHMiLCJyZWNvcmRzIiwiaXNNb3VudGVkIiwibG9hZFJlY29yZHMiLCJjcmVkZW50aWFscyIsIm9rIiwiRXJyb3IiLCJtZXNzYWdlIiwiZXJyb3IiLCJjYXRlZ29yeUlkIiwiaW1hZ2VVcmwiLCJzdG9jayIsIkJvb2xlYW4iLCJkZXRhaWxzSHJlZiIsIm9wZW5EZXRhaWxzIiwid2luZG93IiwibG9jYXRpb24iLCJhc3NpZ24iLCJzcmMiLCJhbHQiLCJvbkNsaWNrIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInBhZ2VTdHlsZSIsImhlcm9TdHlsZSIsInBhbmVsU3R5bGUiLCJtaW5IZWlnaHQiLCJoZXJvQm9keVN0eWxlIiwidGl0bGVTdHlsZSIsIm1hcmdpbiIsImxpbmVIZWlnaHQiLCJzdWJ0aXRsZVN0eWxlIiwiYWN0aXZlIiwic3RhdHNHcmlkU3R5bGUiLCJzdGF0Q2FyZFN0eWxlIiwic3RhdExhYmVsU3R5bGUiLCJ0ZXh0VHJhbnNmb3JtIiwibWFyZ2luQm90dG9tIiwic3RhdFZhbHVlU3R5bGUiLCJ3b3JkQnJlYWsiLCJzZWN0aW9uR3JpZFN0eWxlIiwic2VjdGlvblRpdGxlU3R5bGUiLCJjb250ZW50Q2FyZFN0eWxlIiwiaW5mb0xpc3RTdHlsZSIsImluZm9Sb3dTdHlsZSIsInBhZGRpbmdCb3R0b20iLCJib3JkZXJCb3R0b20iLCJpbmZvTGFiZWxTdHlsZSIsImluZm9WYWx1ZVN0eWxlIiwidGV4dEFsaWduIiwiZGVzY3JpcHRpb25TdHlsZSIsIndoaXRlU3BhY2UiLCJidXR0b25TdHlsZSIsInRyYW5zaXRpb24iLCJidXR0b25Ib3ZlclN0eWxlIiwidHJhbnNmb3JtIiwiZm9ybWF0RGF0ZSIsImRhdGUiLCJpc05hTiIsImdldFRpbWUiLCJTdHJpbmciLCJkYXRlU3R5bGUiLCJ0aW1lU3R5bGUiLCJQcm9kdWN0U2hvdyIsInNrdSIsImRlc2NyaXB0aW9uIiwiYnV0dG9uSG92ZXJlZCIsInNldEJ1dHRvbkhvdmVyZWQiLCJoYW5kbGVPcmRlckNsaWNrIiwicHJvZHVjdElkIiwibmV3T3JkZXJVcmwiLCJvbk1vdXNlRW50ZXIiLCJvbk1vdXNlTGVhdmUiLCJ0aXRsZSIsInhtbG5zIiwidmlld0JveCIsImZpbGwiLCJzdHJva2UiLCJzdHJva2VXaWR0aCIsInN0cm9rZUxpbmVjYXAiLCJzdHJva2VMaW5lam9pbiIsImN4IiwiY3kiLCJyIiwiZCIsInVwZGF0ZWRBdCIsImhlYWRlclN0eWxlIiwiZGVzY1N0eWxlIiwibGF5b3V0U3R5bGUiLCJzdGFja1N0eWxlIiwibGFiZWxTdHlsZSIsImlucHV0U3R5bGUiLCJmb250RmFtaWx5Iiwicm93U3R5bGUiLCJncmlkMlN0eWxlIiwiY3VzdG9tZXJJbmZvU3R5bGUiLCJjdXN0b21lclJvd1N0eWxlIiwibXV0ZWRTdHlsZSIsInN0cm9uZ1N0eWxlIiwibGluZUl0ZW1Sb3dTdHlsZSIsImxpbmVJdGVtVG9wU3R5bGUiLCJwcm9kdWN0UHJldmlld1N0eWxlIiwiYWRkQnV0dG9uU3R5bGUiLCJyZW1vdmVCdXR0b25TdHlsZSIsInRvdGFsc1Jvd1N0eWxlIiwidG90YWxTdHlsZSIsInBhZGRpbmdUb3AiLCJhY3Rpb25CYXJTdHlsZSIsImFjdGlvbkJ1dHRvblN0eWxlIiwicHJpbWFyeSIsIm1hcExpbmtTdHlsZSIsInJlc3BvbnNpdmVDc3MiLCJwYXltZW50T3B0aW9ucyIsInNoaXBwaW5nTWV0aG9kcyIsInRvTnVtYmVyIiwibnVtIiwiZm9ybWF0TW9uZXkiLCJjcmVhdGVFbXB0eUl0ZW0iLCJxdWFudGl0eSIsInVuaXRQcmljZSIsIk9yZGVyQ3JlYXRlIiwic2V0VXNlcnMiLCJzZXRQcm9kdWN0cyIsIm9yZGVyQ291bnRCeVVzZXIiLCJzZXRPcmRlckNvdW50QnlVc2VyIiwic2Vzc2lvblVzZXIiLCJzZXRTZXNzaW9uVXNlciIsInN1Ym1pdHRpbmciLCJzZXRTdWJtaXR0aW5nIiwiZm9ybURhdGEiLCJzZXRGb3JtRGF0YSIsInVzZXJJZCIsInN0YXR1cyIsInBheW1lbnRNZXRob2QiLCJwYXltZW50U3RhdHVzIiwidHJhbnNhY3Rpb25JZCIsInNoaXBwaW5nQWRkcmVzcyIsInNoaXBwaW5nTWV0aG9kIiwidHJhY2tpbmdOdW1iZXIiLCJzaGlwcGluZ0ZlZSIsInRheCIsImRpc2NvdW50IiwibGluZUl0ZW1zIiwic2V0TGluZUl0ZW1zIiwiVVJMU2VhcmNoUGFyYW1zIiwic2VhcmNoIiwicHJlUHJvZHVjdElkIiwiZ2V0IiwiZmV0Y2hEYXRhIiwiY29udGV4dFJlcyIsImNvbnRleHREYXRhIiwidXNlcnNEYXRhIiwiQXJyYXkiLCJpc0FycmF5IiwicHJvZHVjdHNMaXN0IiwiY3VycmVudFVzZXIiLCJwcmV2Iiwic2VsZWN0ZWRQcm9kdWN0Iiwic29tZSIsInAiLCJzZWxlY3RlZCIsInNlbGVjdGVkQ3VzdG9tZXIiLCJ1IiwiY3VzdG9tZXJPcmRlckNvdW50IiwibGluZVRvdGFscyIsInN1YnRvdGFsIiwicmVkdWNlIiwic3VtIiwiZ3JhbmRUb3RhbCIsImhhbmRsZUZvcm1DaGFuZ2UiLCJ0YXJnZXQiLCJoYW5kbGVMaW5lSXRlbUNoYW5nZSIsImluZGV4IiwibmV4dCIsImFkZExpbmVJdGVtIiwicmVtb3ZlTGluZUl0ZW0iLCJmaWx0ZXIiLCJfIiwiaSIsIm1hcHNIcmVmIiwidHJpbSIsImhhbmRsZVN1Ym1pdCIsInZhbGlkSXRlbXMiLCJhbGVydCIsIm9yZGVyUGF5bG9hZCIsInRvRml4ZWQiLCJ0b3RhbEFtb3VudCIsInN1Ym1pdEZvcm0iLCJGb3JtRGF0YSIsImFwcGVuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJvcmRlclJlcyIsIm1ldGhvZCIsImJvZHkiLCJvcmRlckRhdGEiLCJvblN1Ym1pdCIsIm9uQ2hhbmdlIiwicmVxdWlyZWQiLCJkaXNhYmxlZCIsInJvbGUiLCJ1c2VyIiwiZW1haWwiLCJwaG9uZSIsIm1vYmlsZSIsInBsYWNlaG9sZGVyIiwidHlwZSIsIml0ZW1Ub3RhbCIsIm1pbiIsInN0ZXAiLCJyZXNpemUiLCJyZWwiLCJoaXN0b3J5IiwiYmFjayIsImhlYWRpbmdTdHlsZSIsInN1YlRleHRTdHlsZSIsInZhbCIsInRvTG93ZXJDYXNlIiwic3R5bGVCeVN0YXR1cyIsInBlbmRpbmciLCJiZyIsImZnIiwicGFpZCIsInByb2Nlc3NpbmciLCJzaGlwcGVkIiwiY29tcGxldGVkIiwiY2FuY2VsbGVkIiwiaW5mb0dyaWRTdHlsZSIsInRhYmxlU3R5bGUiLCJsaW5lSXRlbVN0eWxlIiwidG90YWxCb3hTdHlsZSIsInRvdGFsUm93U3R5bGUiLCJncmFuZFN0eWxlIiwibiIsImR0IiwiT3JkZXJTaG93IiwiZGV0YWlscyIsInNldERldGFpbHMiLCJzZXRFcnJvciIsIm9yZGVySWQiLCJsb2FkRGV0YWlscyIsImZldGNoRXJyb3IiLCJ0b3RhbHMiLCJpdGVtcyIsInRvdGFsUHJpY2UiLCJlbXB0eUltYWdlU3R5bGUiLCJPcmRlckl0ZW1TaG93Iiwib3JkZXJJdGVtSWQiLCJjYWxjdWxhdGVkVG90YWwiLCJvcmRlciIsImN1c3RvbWVyIiwiY2VsbFN0eWxlIiwiZmxleFNocmluayIsImZhbGxiYWNrU3R5bGUiLCJ0ZXh0U3R5bGUiLCJmbGV4RGlyZWN0aW9uIiwiUHJvZHVjdEltYWdlIiwicHJvcGVydHkiLCJwYXRoIiwiaGFzRXJyb3IiLCJzZXRIYXNFcnJvciIsIm9uRXJyb3IiLCJ3cmFwcGVyU3R5bGUiLCJwcmV2aWV3U3R5bGUiLCJoaW50U3R5bGUiLCJQcm9kdWN0SW1hZ2VVcGxvYWQiLCJjdXJyZW50VmFsdWUiLCJjdXJyZW50UHVibGljSWQiLCJpbWFnZVB1YmxpY0lkIiwicHJldmlld1VybCIsInNldFByZXZpZXdVcmwiLCJwdWJsaWNJZCIsInNldFB1YmxpY0lkIiwidXBsb2FkaW5nIiwic2V0VXBsb2FkaW5nIiwiaGFuZGxlVXBsb2FkIiwiZmlsZSIsImZpbGVzIiwidXBsb2FkZWRVcmwiLCJ1cmwiLCJ1cGxvYWRlZFB1YmxpY0lkIiwidXBsb2FkRXJyb3IiLCJoYW5kbGVSZW1vdmUiLCJhY2NlcHQiLCJGcmFnbWVudCIsInJlYWRPbmx5IiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBRUEsTUFBTUEsZ0JBQWMsR0FBSUMsS0FBSyxJQUFLO0lBQ2hDLE9BQU8sQ0FBQSxHQUFBLEVBQU1DLE1BQU0sQ0FBQ0QsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDRSxjQUFjLEVBQUUsQ0FBQSxDQUFFO0VBQ3BELENBQUM7RUFFRCxNQUFNQyxTQUFTLEdBQUdBLE1BQU07RUFDdEIsRUFBQSxNQUFNLENBQUNDLElBQUksRUFBRUMsT0FBTyxDQUFDLEdBQUdDLGNBQVEsQ0FBQztFQUMvQkMsSUFBQUEsS0FBSyxFQUFFLENBQUM7RUFDUkMsSUFBQUEsVUFBVSxFQUFFLENBQUM7RUFDYkMsSUFBQUEsUUFBUSxFQUFFLENBQUM7RUFDWEMsSUFBQUEsTUFBTSxFQUFFLENBQUM7RUFDVEMsSUFBQUEsT0FBTyxFQUFFLENBQUM7RUFDVkMsSUFBQUEsWUFBWSxFQUFFLENBQUM7RUFDZkMsSUFBQUEsYUFBYSxFQUFFLENBQUM7RUFDaEJDLElBQUFBLGNBQWMsRUFBRSxFQUFFO0VBQ2xCQyxJQUFBQSxvQkFBb0IsRUFBRTtFQUN4QixHQUFDLENBQUM7RUFFRkMsRUFBQUEsZUFBUyxDQUFDLE1BQU07RUFDZCxJQUFBLE1BQU1DLGFBQWEsR0FBRyxZQUFZO0VBQ2hDLE1BQUEsTUFBTUMsUUFBUSxHQUFHLE1BQU1DLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQztFQUNwRCxNQUFBLE1BQU1DLE9BQU8sR0FBRyxNQUFNRixRQUFRLENBQUNHLElBQUksRUFBRTtFQUNyQ2hCLE1BQUFBLE9BQU8sQ0FBQ2UsT0FBTyxJQUFJLEVBQUUsQ0FBQztNQUN4QixDQUFDO0VBRURILElBQUFBLGFBQWEsRUFBRTtJQUNqQixDQUFDLEVBQUUsRUFBRSxDQUFDO0VBRU4sRUFBQSxNQUFNSyxhQUFhLEdBQUdDLGFBQU8sQ0FBQyxNQUFNO0VBQ2xDLElBQUEsTUFBTUMsWUFBWSxHQUFHcEIsSUFBSSxDQUFDVyxvQkFBb0IsSUFBSSxFQUFFO0VBQ3BELElBQUEsTUFBTVUsR0FBRyxHQUFHQyxJQUFJLENBQUNELEdBQUcsQ0FBQyxHQUFHRCxZQUFZLENBQUNHLEdBQUcsQ0FBRUMsSUFBSSxJQUFLQSxJQUFJLENBQUNDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUVsRSxJQUFBLE9BQU9MLFlBQVksQ0FBQ0csR0FBRyxDQUFFQyxJQUFJLEtBQU07RUFDakMsTUFBQSxHQUFHQSxJQUFJO1FBQ1BFLEtBQUssRUFBRSxHQUFHSixJQUFJLENBQUNELEdBQUcsQ0FBQyxDQUFDLEVBQUVDLElBQUksQ0FBQ0ssS0FBSyxDQUFFSCxJQUFJLENBQUNDLEtBQUssR0FBR0osR0FBRyxHQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUEsQ0FBQTtFQUM3RCxLQUFDLENBQUMsQ0FBQztFQUNMLEVBQUEsQ0FBQyxFQUFFLENBQUNyQixJQUFJLENBQUNXLG9CQUFvQixDQUFDLENBQUM7RUFFL0IsRUFBQSxNQUFNaUIsY0FBYyxHQUFHVCxhQUFPLENBQUMsTUFBTTtNQUNuQyxNQUFNVSxLQUFLLEdBQUdoQyxNQUFNLENBQUNHLElBQUksQ0FBQ0ssUUFBUSxJQUFJLENBQUMsQ0FBQztNQUN4QyxJQUFJd0IsS0FBSyxLQUFLLENBQUMsRUFBRTtFQUNmLE1BQUEsT0FBTyxDQUFDO0VBQ1YsSUFBQTtFQUVBLElBQUEsTUFBTUMsT0FBTyxHQUFHUixJQUFJLENBQUNELEdBQUcsQ0FBQ1EsS0FBSyxHQUFHaEMsTUFBTSxDQUFDRyxJQUFJLENBQUNTLGFBQWEsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDcEUsT0FBT2EsSUFBSSxDQUFDSyxLQUFLLENBQUVHLE9BQU8sR0FBR0QsS0FBSyxHQUFJLEdBQUcsQ0FBQztJQUM1QyxDQUFDLEVBQUUsQ0FBQzdCLElBQUksQ0FBQ0ssUUFBUSxFQUFFTCxJQUFJLENBQUNTLGFBQWEsQ0FBQyxDQUFDO0lBRXZDLG9CQUNFc0Isc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUFLQyxJQUFBQSxTQUFTLEVBQUM7S0FBbUIsZUFDaENGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxPQUFBLEVBQUEsSUFBQSxFQUNHO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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
