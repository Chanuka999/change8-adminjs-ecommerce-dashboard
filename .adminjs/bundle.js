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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9hZG1pbi9kYXNoYm9hcmQuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1jYXJkcy1saXN0LmpzeCIsIi4uL2FkbWluL3Byb2R1Y3Qtc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1jcmVhdGUuanN4IiwiLi4vYWRtaW4vb3JkZXItc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1pdGVtLXNob3cuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS5qc3giLCIuLi9hZG1pbi9wcm9kdWN0LWltYWdlLXVwbG9hZC5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgZm9ybWF0Q3VycmVuY3kgPSAodmFsdWUpID0+IHtcclxuICByZXR1cm4gYFJzLiR7TnVtYmVyKHZhbHVlIHx8IDApLnRvTG9jYWxlU3RyaW5nKCl9YDtcclxufTtcclxuXHJcbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcclxuICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZSh7XHJcbiAgICB1c2VyczogMCxcclxuICAgIGNhdGVnb3JpZXM6IDAsXHJcbiAgICBwcm9kdWN0czogMCxcclxuICAgIG9yZGVyczogMCxcclxuICAgIHJldmVudWU6IDAsXHJcbiAgICBmZWF0dXJlZEdlbXM6IDAsXHJcbiAgICBjcml0aWNhbFN0b2NrOiAwLFxyXG4gICAgcmVjZW50UHJvZHVjdHM6IFtdLFxyXG4gICAgY2F0ZWdvcnlEaXN0cmlidXRpb246IFtdLFxyXG4gIH0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgbG9hZERhc2hib2FyZCA9IGFzeW5jICgpID0+IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hZG1pbi9hcGkvZGFzaGJvYXJkXCIpO1xyXG4gICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBzZXREYXRhKHBheWxvYWQgfHwge30pO1xyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkRGFzaGJvYXJkKCk7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCB0b3BDYXRlZ29yaWVzID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBkYXRhLmNhdGVnb3J5RGlzdHJpYnV0aW9uIHx8IFtdO1xyXG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZGlzdHJpYnV0aW9uLm1hcCgoaXRlbSkgPT4gaXRlbS5jb3VudCksIDEpO1xyXG5cclxuICAgIHJldHVybiBkaXN0cmlidXRpb24ubWFwKChpdGVtKSA9PiAoe1xyXG4gICAgICAuLi5pdGVtLFxyXG4gICAgICB3aWR0aDogYCR7TWF0aC5tYXgoOCwgTWF0aC5yb3VuZCgoaXRlbS5jb3VudCAvIG1heCkgKiAxMDApKX0lYCxcclxuICAgIH0pKTtcclxuICB9LCBbZGF0YS5jYXRlZ29yeURpc3RyaWJ1dGlvbl0pO1xyXG5cclxuICBjb25zdCBjb21wbGV0aW9uUmF0ZSA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3QgdG90YWwgPSBOdW1iZXIoZGF0YS5wcm9kdWN0cyB8fCAwKTtcclxuICAgIGlmICh0b3RhbCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBoZWFsdGh5ID0gTWF0aC5tYXgodG90YWwgLSBOdW1iZXIoZGF0YS5jcml0aWNhbFN0b2NrIHx8IDApLCAwKTtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKChoZWFsdGh5IC8gdG90YWwpICogMTAwKTtcclxuICB9LCBbZGF0YS5wcm9kdWN0cywgZGF0YS5jcml0aWNhbFN0b2NrXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtZGFzaGJvYXJkXCI+XHJcbiAgICAgIDxzdHlsZT5cclxuICAgICAgICB7YFxyXG4gICAgICAgICAgLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgICAgLS1iZy0xOiB2YXIoLS1jaGFuZ2U4LWJnLTEsICMwNTA5MTQpO1xyXG4gICAgICAgICAgICAtLWJnLTI6IHZhcigtLWNoYW5nZTgtYmctMiwgIzBiMWEzOCk7XHJcbiAgICAgICAgICAgIC0tYmctMzogdmFyKC0tY2hhbmdlOC1iZy0zLCAjMTIxZjNhKTtcclxuICAgICAgICAgICAgLS1nb2xkOiB2YXIoLS1jaGFuZ2U4LWdvbGQsICNlMmJmNjYpO1xyXG4gICAgICAgICAgICAtLXRleHQtbWFpbjogdmFyKC0tY2hhbmdlOC10ZXh0LW1haW4sICNmOGZhZmMpO1xyXG4gICAgICAgICAgICAtLXRleHQtbXV0ZWQ6IHZhcigtLWNoYW5nZTgtdGV4dC1tdXRlZCwgIzlhYThjMSk7XHJcbiAgICAgICAgICAgIC0tbGluZTogdmFyKC0tY2hhbmdlOC1saW5lLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMjIpKTtcclxuICAgICAgICAgICAgLS1jYXJkLWJnOiB2YXIoLS1jaGFuZ2U4LWNhcmQtYmcsIGxpbmVhci1ncmFkaWVudCgxNjBkZWcsIHJnYmEoMjEsIDM0LCA2NiwgMC45NSkgMCUsIHJnYmEoMTAsIDE4LCAzNiwgMC45NSkgMTAwJSkpO1xyXG4gICAgICAgICAgICAtLWdyYWQtZW5kOiB2YXIoLS1jaGFuZ2U4LWdyYWQtZW5kLCAjMDQwNzBmKTtcclxuICAgICAgICAgICAgLS1zaGFkb3c6IHZhcigtLWNoYW5nZTgtc2hhZG93LCAwIDhweCAyNnB4IHJnYmEoMCwgMCwgMCwgMC4zKSk7XHJcbiAgICAgICAgICAgIC0tcmFkaWFsLTE6IHZhcigtLWNoYW5nZTgtcmFkaWFsLTEsIHJnYmEoMzQsIDkzLCAxODAsIDAuMzUpKTtcclxuICAgICAgICAgICAgLS1yYWRpYWwtMjogdmFyKC0tY2hhbmdlOC1yYWRpYWwtMiwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjE2KSk7XHJcblxyXG4gICAgICAgICAgICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICAgICAgICAgICAgcGFkZGluZzogMzBweDtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbWFpbik7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6XHJcbiAgICAgICAgICAgICAgcmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCA4JSAwJSwgdmFyKC0tcmFkaWFsLTEpIDAlLCByZ2JhKDM0LCA5MywgMTgwLCAwKSAzOCUpLFxyXG4gICAgICAgICAgICAgIHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgODUlIDEyJSwgdmFyKC0tcmFkaWFsLTIpIDAlLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDApIDQyJSksXHJcbiAgICAgICAgICAgICAgbGluZWFyLWdyYWRpZW50KDEyMGRlZywgdmFyKC0tYmctMSkgMCUsIHZhcigtLWJnLTIpIDQ4JSwgdmFyKC0tZ3JhZC1lbmQpIDEwMCUpO1xyXG4gICAgICAgICAgICBmb250LWZhbWlseTogXCJQb3BwaW5zXCIsIFwiU2Vnb2UgVUlcIiwgc2Fucy1zZXJpZjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LWJnLTE6ICNmMGY2ZmY7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC1iZy0yOiAjZmZmZmZmO1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtYmctMzogI2VlZjVmZjtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LWdvbGQ6ICNjMDhiMGY7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC10ZXh0LW1haW46ICMwZjE3MmE7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC10ZXh0LW11dGVkOiAjNDc1NTY5O1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtbGluZTogcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LWNhcmQtYmc6ICNmZmZmZmY7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC1ncmFkLWVuZDogI2Y4ZmJmZjtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LXNoYWRvdzogMCA0cHggMjBweCByZ2JhKDE1LCAyMywgNDIsIDAuMDYpO1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtcmFkaWFsLTE6IHJnYmEoMzQsIDkzLCAxODAsIDAuMDgpO1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtcmFkaWFsLTI6IHJnYmEoMTkyLCAxMzksIDE1LCAwLjA1KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1oZWFkZXIge1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgICAgICAgICBhbmltYXRpb246IGZhZGUtdXAgNTIwbXMgZWFzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1raWNrZXIge1xyXG4gICAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4zNmVtO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC10aXRsZSB7XHJcbiAgICAgICAgICAgIG1hcmdpbjogOHB4IDAgNnB4O1xyXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMS4wNjtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgzMnB4LCA1dncsIDU2cHgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXN1YnRpdGxlIHtcclxuICAgICAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1tZXRyaWMtZ3JpZCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDQsIG1pbm1heCgxNzBweCwgMWZyKSk7XHJcbiAgICAgICAgICAgIGdhcDogMTRweDtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogMThweDtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkIHtcclxuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDE2cHggMThweDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tY2FyZC1iZyk7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IHZhcigtLXNoYWRvdyk7XHJcbiAgICAgICAgICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xyXG4gICAgICAgICAgICBhbmltYXRpb246IGZhZGUtdXAgNTYwbXMgZWFzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkLWxhYmVsIHtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xOGVtO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkLXZhbHVlIHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgzNHB4LCA0dncsIDUycHgpO1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkLWhpbnQge1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogOHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWxheW91dCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogbWlubWF4KDMwMHB4LCAxLjhmcikgbWlubWF4KDI2MHB4LCAxZnIpO1xyXG4gICAgICAgICAgICBnYXA6IDE2cHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZ3Jlc3Mtd3JhcCB7XHJcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZ3Jlc3MtaGVhZCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1wcm9ncmVzcy10cmFjayB7XHJcbiAgICAgICAgICAgIGhlaWdodDogMTBweDtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xMik7XHJcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jaGFuZ2U4LXByb2dyZXNzLXRyYWNrIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNSwgMjMsIDQyLCAwLjEyKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1wcm9ncmVzcy1maWxsIHtcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLCAjZjVkZjkwIDAlLCAjZTJiZjY2IDEwMCUpO1xyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCAzMjBtcyBlYXNlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXJlY2VudC1saXN0IHtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogNnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXJlY2VudC1pdGVtIHtcclxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4IDA7XHJcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jaGFuZ2U4LXJlY2VudC1pdGVtIHtcclxuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4xMik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcmVjZW50LWl0ZW06bGFzdC1jaGlsZCB7XHJcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbmFtZSB7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1kYXRlIHtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJpY2Uge1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBAa2V5ZnJhbWVzIGZhZGUtdXAge1xyXG4gICAgICAgICAgICBmcm9tIHtcclxuICAgICAgICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg4cHgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRvIHtcclxuICAgICAgICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAxMTgwcHgpIHtcclxuICAgICAgICAgICAgLmNoYW5nZTgtbWV0cmljLWdyaWQge1xyXG4gICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgxODBweCwgMWZyKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LWxheW91dCB7XHJcbiAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNzIwcHgpIHtcclxuICAgICAgICAgICAgLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgICAgICBwYWRkaW5nOiAyMHB4IDE2cHg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LW1ldHJpYy1ncmlkIHtcclxuICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGB9XHJcbiAgICAgIDwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtaGVhZGVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWtpY2tlclwiPlNlY3Rpb24gVmlldzwvZGl2PlxyXG4gICAgICAgIDxoMSBjbGFzc05hbWU9XCJjaGFuZ2U4LXRpdGxlXCI+RGFzaGJvYXJkPC9oMT5cclxuICAgICAgICA8cCBjbGFzc05hbWU9XCJjaGFuZ2U4LXN1YnRpdGxlXCI+XHJcbiAgICAgICAgICBUcmFjayB5b3VyIGNvbW1lcmNlIGhlYWx0aCBhdCBhIGdsYW5jZSB3aXRoIGxpdmUgaW52ZW50b3J5IGFuZCBvcmRlclxyXG4gICAgICAgICAgc2lnbmFscy5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW1ldHJpYy1ncmlkXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+UmV2ZW51ZSBTdHJlYW08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+XHJcbiAgICAgICAgICAgIHtmb3JtYXRDdXJyZW5jeShkYXRhLnJldmVudWUpfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+QWNyb3NzIGFsbCBvcmRlcnM8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+SW52ZW50b3J5IFNpemU8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+e2RhdGEucHJvZHVjdHMgfHwgMH08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5Ub3RhbCBhY3RpdmUgY2F0YWxvZyBpdGVtczwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5GZWF0dXJlZCBHZW1zPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC12YWx1ZVwiPntkYXRhLmZlYXR1cmVkR2VtcyB8fCAwfTwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPkN1cnJlbnRseSB2aXNpYmxlIHByb2R1Y3RzPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPkNyaXRpY2FsIFN0b2NrPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC12YWx1ZVwiPntkYXRhLmNyaXRpY2FsU3RvY2sgfHwgMH08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5JdGVtcyBuZWVkaW5nIHVyZ2VudCByZWZpbGw8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbGF5b3V0XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+Q2F0ZWdvcnkgRGlzdHJpYnV0aW9uPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+SW52ZW50b3J5IHNwbGl0IGJ5IHNlZ21lbnQ8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3Mtd3JhcFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtaGVhZFwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuPkhlYWx0aHkgc3RvY2sgbGV2ZWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Y29tcGxldGlvblJhdGV9JTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLXRyYWNrXCI+XHJcbiAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9ncmVzcy1maWxsXCJcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBgJHtjb21wbGV0aW9uUmF0ZX0lYCB9fVxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgeyh0b3BDYXRlZ29yaWVzIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5ObyBjYXRlZ29yeSBkYXRhIHlldC48L2Rpdj5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICh0b3BDYXRlZ29yaWVzIHx8IFtdKS5tYXAoKGNhdGVnb3J5KSA9PiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e2NhdGVnb3J5Lm5hbWV9IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3Mtd3JhcFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWhlYWRcIj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4+e2NhdGVnb3J5Lm5hbWV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPntjYXRlZ29yeS5jb3VudH08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLXRyYWNrXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWZpbGxcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBjYXRlZ29yeS53aWR0aCB9fVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5SZWNlbnQgQWRkaXRpb25zPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+XHJcbiAgICAgICAgICAgIExhdGVzdCBwcm9kdWN0cyBlbnRlcmluZyB0aGUgY2F0YWxvZ1xyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgeyhkYXRhLnJlY2VudFByb2R1Y3RzIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIiBzdHlsZT17eyBtYXJnaW5Ub3A6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgIE5vIHByb2R1Y3RzIGFkZGVkIHlldC5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcmVjZW50LWxpc3RcIj5cclxuICAgICAgICAgICAgICB7KGRhdGEucmVjZW50UHJvZHVjdHMgfHwgW10pLm1hcCgocHJvZHVjdCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXJlY2VudC1pdGVtXCIga2V5PXtwcm9kdWN0LmlkfT5cclxuICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbmFtZVwiPntwcm9kdWN0Lm5hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWRhdGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIHtuZXcgRGF0ZShwcm9kdWN0LmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJpY2VcIj5cclxuICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0Q3VycmVuY3kocHJvZHVjdC5wcmljZSl9XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGFzaGJvYXJkO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgZ3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwicmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDI0MHB4LCAxZnIpKVwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBjYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE2cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yOClcIixcclxuICBiYWNrZ3JvdW5kOiBcImxpbmVhci1ncmFkaWVudCgxNjBkZWcsICMwYjFhMzggMCUsICMwOTE2MmYgMTAwJSlcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTJweCAyMnB4IHJnYmEoMiwgNiwgMjMsIDAuMjUpXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVdyYXBTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjIwMHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjMGYxNzJhXCIsXHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBwYWRkaW5nOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICBvYmplY3RGaXQ6IFwiY29udGFpblwiLFxyXG59O1xyXG5cclxuY29uc3QgYm9keVN0eWxlID0ge1xyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IG1ldGFTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjFmciAxZnJcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGJhZGdlU3R5bGUgPSAoaXNBY3RpdmUpID0+ICh7XHJcbiAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4wNWVtXCIsXHJcbiAgcGFkZGluZzogXCI1cHggMTBweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gIGNvbG9yOiBpc0FjdGl2ZSA/IFwiIzE0NTMyZFwiIDogXCIjN2YxZDFkXCIsXHJcbiAgYmFja2dyb3VuZDogaXNBY3RpdmUgPyBcIiNiYmY3ZDBcIiA6IFwiI2ZlY2FjYVwiLFxyXG59KTtcclxuXHJcbmNvbnN0IGxpbmtTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImlubGluZS1ibG9ja1wiLFxyXG4gIG1hcmdpblRvcDogXCI0cHhcIixcclxuICBjb2xvcjogXCIjOTNjNWZkXCIsXHJcbiAgdGV4dERlY29yYXRpb246IFwibm9uZVwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IGVtcHR5U3R5bGUgPSB7XHJcbiAgcGFkZGluZzogXCIxOHB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IFwiMXB4IGRhc2hlZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuNDUpXCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0UHJpY2UgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBhbW91bnQgPSBOdW1iZXIodmFsdWUgfHwgMCk7XHJcbiAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoYW1vdW50KSkge1xyXG4gICAgcmV0dXJuIFwiMC4wMFwiO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFtb3VudC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IGdldFJlY29yZElkID0gKHJlY29yZCkgPT4ge1xyXG4gIHJldHVybiByZWNvcmQ/LnBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZCB8fCByZWNvcmQ/LnBhcmFtPy5pZCB8fCBcIlwiO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0U2hvd0hyZWYgPSAocmVjb3JkLCByZXNvdXJjZUlkKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkQWN0aW9ucyA9IHJlY29yZD8ucmVjb3JkQWN0aW9ucyB8fCByZWNvcmQ/LmFjdGlvbnMgfHwgW107XHJcbiAgY29uc3Qgc2hvd0FjdGlvbiA9IHJlY29yZEFjdGlvbnMuZmluZCgoYWN0aW9uKSA9PiBhY3Rpb24/Lm5hbWUgPT09IFwic2hvd1wiKTtcclxuICBjb25zdCByYXdIcmVmID0gc2hvd0FjdGlvbj8uaHJlZiB8fCByZWNvcmQ/LmhyZWYgfHwgXCJcIjtcclxuXHJcbiAgaWYgKHJhd0hyZWYpIHtcclxuICAgIHJldHVybiByYXdIcmVmO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgaWQgPSBnZXRSZWNvcmRJZChyZWNvcmQpO1xyXG4gIHJldHVybiBpZFxyXG4gICAgPyBgL2FkbWluL3Jlc291cmNlcy8ke2VuY29kZVVSSUNvbXBvbmVudChyZXNvdXJjZUlkKX0vcmVjb3Jkcy8ke2VuY29kZVVSSUNvbXBvbmVudChpZCl9L3Nob3dgXHJcbiAgICA6IFwiXCI7XHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0Q2FyZHNMaXN0ID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgW2FwaVJlY29yZHMsIHNldEFwaVJlY29yZHNdID0gdXNlU3RhdGUoW10pO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbbG9hZEVycm9yLCBzZXRMb2FkRXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIGNvbnN0IHJlc291cmNlSWQgPVxyXG4gICAgcHJvcHM/LnJlc291cmNlPy5pZCA9PT0gXCJQcm9kdWN0XCJcclxuICAgICAgPyBcIlByb2R1Y3RzXCJcclxuICAgICAgOiBwcm9wcz8ucmVzb3VyY2U/LmlkIHx8IFwiUHJvZHVjdHNcIjtcclxuICBjb25zdCBwcm9wUmVjb3JkcyA9IHByb3BzPy5yZWNvcmRzIHx8IFtdO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHByb3BSZWNvcmRzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGlzTW91bnRlZCA9IHRydWU7XHJcblxyXG4gICAgY29uc3QgbG9hZFJlY29yZHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHNldExvYWRpbmcodHJ1ZSk7XHJcbiAgICAgIHNldExvYWRFcnJvcihcIlwiKTtcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgICAgIGAvYWRtaW4vYXBpL3Jlc291cmNlcy8ke2VuY29kZVVSSUNvbXBvbmVudChyZXNvdXJjZUlkKX0vYWN0aW9ucy9saXN0YCxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBheWxvYWQ/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gbG9hZCBwcm9kdWN0c1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldEFwaVJlY29yZHMocGF5bG9hZD8ucmVjb3JkcyB8fCBbXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldExvYWRFcnJvcihlcnJvcj8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIHByb2R1Y3RzXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBpZiAoaXNNb3VudGVkKSB7XHJcbiAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbG9hZFJlY29yZHMoKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBpc01vdW50ZWQgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgfSwgW3Byb3BSZWNvcmRzLmxlbmd0aCwgcmVzb3VyY2VJZF0pO1xyXG5cclxuICBjb25zdCByZWNvcmRzID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICByZXR1cm4gcHJvcFJlY29yZHMubGVuZ3RoID8gcHJvcFJlY29yZHMgOiBhcGlSZWNvcmRzO1xyXG4gIH0sIFtwcm9wUmVjb3JkcywgYXBpUmVjb3Jkc10pO1xyXG5cclxuICBpZiAobG9hZGluZykge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9PkxvYWRpbmcgcHJvZHVjdHMuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAobG9hZEVycm9yKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+e2xvYWRFcnJvcn08L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoIXJlY29yZHMubGVuZ3RoKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+Tm8gcHJvZHVjdHMgZm91bmQuPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e2dyaWRTdHlsZX0+XHJcbiAgICAgIHtyZWNvcmRzLm1hcCgocmVjb3JkKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge307XHJcbiAgICAgICAgY29uc3QgaWQgPSBnZXRSZWNvcmRJZChyZWNvcmQpO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBwYXJhbXM/Lm5hbWUgfHwgXCJVbm5hbWVkIHByb2R1Y3RcIjtcclxuICAgICAgICBjb25zdCBjYXRlZ29yeSA9IHBhcmFtcz8uY2F0ZWdvcnlJZCB8fCBcIi1cIjtcclxuICAgICAgICBjb25zdCBpbWFnZVVybCA9IHBhcmFtcz8uaW1hZ2VVcmwgfHwgXCJcIjtcclxuICAgICAgICBjb25zdCBzdG9jayA9IE51bWJlcihwYXJhbXM/LnN0b2NrIHx8IDApO1xyXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gQm9vbGVhbihwYXJhbXM/LmlzQWN0aXZlKTtcclxuICAgICAgICBjb25zdCBkZXRhaWxzSHJlZiA9IGdldFNob3dIcmVmKHJlY29yZCwgcmVzb3VyY2VJZCk7XHJcbiAgICAgICAgY29uc3Qgb3BlbkRldGFpbHMgPSAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZGV0YWlsc0hyZWYpIHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihkZXRhaWxzSHJlZik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgIDxhcnRpY2xlIGtleT17aWR9IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbWFnZVdyYXBTdHlsZX0+XHJcbiAgICAgICAgICAgICAge2ltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICAgICAgPGltZyBzcmM9e2ltYWdlVXJsfSBhbHQ9e25hbWV9IHN0eWxlPXtpbWFnZVN0eWxlfSAvPlxyXG4gICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIE5vIGltYWdlXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2JvZHlTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogXCIxOHB4XCIsIGZvbnRXZWlnaHQ6IDcwMCB9fT57bmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXttZXRhU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5DYXRlZ29yeToge2NhdGVnb3J5fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5TdG9jazoge3N0b2NrfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5QcmljZTogUnMuIHtmb3JtYXRQcmljZShwYXJhbXM/LnByaWNlKX08L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17YmFkZ2VTdHlsZShpc0FjdGl2ZSl9PlxyXG4gICAgICAgICAgICAgICAge2lzQWN0aXZlID8gXCJBQ1RJVkVcIiA6IFwiSU5BQ1RJVkVcIn1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgIGhyZWY9e2RldGFpbHNIcmVmIHx8IFwiI1wifVxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e2xpbmtTdHlsZX1cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICBvcGVuRGV0YWlscygpO1xyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgIGFyaWEtZGlzYWJsZWQ9eyFkZXRhaWxzSHJlZn1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICBWaWV3IGRldGFpbHNcclxuICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RDYXJkc0xpc3Q7XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHBhZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMThweFwiLFxyXG4gIGNvbG9yOiBcIiNlMmU4ZjBcIixcclxufTtcclxuXHJcbmNvbnN0IGhlcm9TdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgyODBweCwgMzYwcHgpIDFmclwiLFxyXG4gIGdhcDogXCIxOHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJzdHJldGNoXCIsXHJcbn07XHJcblxyXG5jb25zdCBwYW5lbFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIyMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTgpXCIsXHJcbiAgYmFja2dyb3VuZDpcclxuICAgIFwibGluZWFyLWdyYWRpZW50KDE2MGRlZywgcmdiYSgxMSwgMjYsIDU2LCAwLjk2KSAwJSwgcmdiYSg5LCAyMiwgNDcsIDAuOTYpIDEwMCUpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMjBweCA0MHB4IHJnYmEoMiwgNiwgMjMsIDAuMjQpXCIsXHJcbiAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVdyYXBTdHlsZSA9IHtcclxuICBtaW5IZWlnaHQ6IFwiMzYwcHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgZGlzcGxheTogXCJibG9ja1wiLFxyXG59O1xyXG5cclxuY29uc3QgaGVyb0JvZHlTdHlsZSA9IHtcclxuICBwYWRkaW5nOiBcIjIycHhcIixcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgdGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgZm9udFNpemU6IFwiY2xhbXAoMjhweCwgNHZ3LCA0NnB4KVwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuMDUsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3Qgc3VidGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGJhZGdlU3R5bGUgPSAoYWN0aXZlKSA9PiAoe1xyXG4gIGRpc3BsYXk6IFwiaW5saW5lLWZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIHdpZHRoOiBcImZpdC1jb250ZW50XCIsXHJcbiAgcGFkZGluZzogXCI2cHggMTJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjA4ZW1cIixcclxuICBjb2xvcjogYWN0aXZlID8gXCIjMTQ1MzJkXCIgOiBcIiM3ZjFkMWRcIixcclxuICBiYWNrZ3JvdW5kOiBhY3RpdmUgPyBcIiNiYmY3ZDBcIiA6IFwiI2ZlY2FjYVwiLFxyXG59KTtcclxuXHJcbmNvbnN0IHN0YXRzR3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwicmVwZWF0KDMsIG1pbm1heCgxNjBweCwgMWZyKSlcIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc3RhdENhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMTZweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjE1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSgxNSwgMjMsIDQyLCAwLjU4KVwiLFxyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc3RhdExhYmVsU3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjE2ZW1cIixcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgbWFyZ2luQm90dG9tOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc3RhdFZhbHVlU3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTZweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgd29yZEJyZWFrOiBcImJyZWFrLXdvcmRcIixcclxufTtcclxuXHJcbmNvbnN0IHNlY3Rpb25HcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJtaW5tYXgoMCwgMS40ZnIpIG1pbm1heCgyODBweCwgMC45ZnIpXCIsXHJcbiAgZ2FwOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHNlY3Rpb25UaXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMmVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBjb2xvcjogXCIjZjVkZjkwXCIsXHJcbn07XHJcblxyXG5jb25zdCBjb250ZW50Q2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIyMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTgpXCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDExLCAyNiwgNTYsIDAuOSlcIixcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxuICBib3hTaGFkb3c6IFwiMCAxNnB4IDI4cHggcmdiYSgyLCA2LCAyMywgMC4xNilcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9MaXN0U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9Sb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjEwcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9MYWJlbFN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvVmFsdWVTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgZm9udFdlaWdodDogNjAwLFxyXG4gIHRleHRBbGlnbjogXCJyaWdodFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGRlc2NyaXB0aW9uU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuNyxcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbiAgd2hpdGVTcGFjZTogXCJwcmUtd3JhcFwiLFxyXG59O1xyXG5cclxuY29uc3QgYnV0dG9uU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBwYWRkaW5nOiBcIjE0cHggMThweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgYm9yZGVyOiBcIm5vbmVcIixcclxuICBiYWNrZ3JvdW5kOiBcImxpbmVhci1ncmFkaWVudCgxMzVkZWcsICM2MzY2ZjEgMCUsICM4YjVjZjYgMTAwJSlcIixcclxuICBjb2xvcjogXCIjZmZmZmZmXCIsXHJcbiAgZm9udFNpemU6IFwiMTVweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIHRyYW5zaXRpb246IFwiYWxsIDAuM3MgZWFzZVwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDhweCAxNnB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjMpXCIsXHJcbn07XHJcblxyXG5jb25zdCBidXR0b25Ib3ZlclN0eWxlID0ge1xyXG4gIC4uLmJ1dHRvblN0eWxlLFxyXG4gIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVZKC0ycHgpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTJweCAyNHB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjQpXCIsXHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXRDdXJyZW5jeSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IGFtb3VudCA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gYFJzLiAke2Ftb3VudC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiBcIi1cIjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSk7XHJcbiAgaWYgKE51bWJlci5pc05hTihkYXRlLmdldFRpbWUoKSkpIHtcclxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBkYXRlU3R5bGU6IFwibWVkaXVtXCIsXHJcbiAgICB0aW1lU3R5bGU6IFwic2hvcnRcIixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IFByb2R1Y3RTaG93ID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkID0gcHJvcHM/LnJlY29yZDtcclxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fTtcclxuXHJcbiAgY29uc3QgbmFtZSA9IHBhcmFtcz8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwiO1xyXG4gIGNvbnN0IHNrdSA9IHBhcmFtcz8uc2t1IHx8IFwiLVwiO1xyXG4gIGNvbnN0IGNhdGVnb3J5ID0gcGFyYW1zPy5jYXRlZ29yeUlkIHx8IFwiLVwiO1xyXG4gIGNvbnN0IGltYWdlVXJsID0gcGFyYW1zPy5pbWFnZVVybCB8fCBcIlwiO1xyXG4gIGNvbnN0IHN0b2NrID0gTnVtYmVyKHBhcmFtcz8uc3RvY2sgfHwgMCk7XHJcbiAgY29uc3QgaXNBY3RpdmUgPSBCb29sZWFuKHBhcmFtcz8uaXNBY3RpdmUpO1xyXG4gIGNvbnN0IHByaWNlID0gZm9ybWF0Q3VycmVuY3kocGFyYW1zPy5wcmljZSk7XHJcbiAgY29uc3QgZGVzY3JpcHRpb24gPVxyXG4gICAgcGFyYW1zPy5kZXNjcmlwdGlvbiB8fCBcIk5vIGRlc2NyaXB0aW9uIGF2YWlsYWJsZSBmb3IgdGhpcyBwcm9kdWN0LlwiO1xyXG5cclxuICBjb25zdCBbYnV0dG9uSG92ZXJlZCwgc2V0QnV0dG9uSG92ZXJlZF0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZU9yZGVyQ2xpY2sgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBwcm9kdWN0SWQgPSBwYXJhbXM/LmlkIHx8IHJlY29yZD8uaWQgfHwgXCJcIjtcclxuICAgIGNvbnN0IG5ld09yZGVyVXJsID0gYC9hZG1pbi9yZXNvdXJjZXMvT3JkZXJzL2FjdGlvbnMvbmV3P3Byb2R1Y3RJZD0ke2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcocHJvZHVjdElkKSl9YDtcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24obmV3T3JkZXJVcmwpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+XHJcbiAgICAgICAge2BcclxuICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA5ODBweCkge1xyXG4gICAgICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LXNob3ctaGVybyxcclxuICAgICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LXNlY3Rpb25zIHtcclxuICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgYH1cclxuICAgICAgPC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LXNob3ctaGVyb1wiIHN0eWxlPXtoZXJvU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3BhbmVsU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW1hZ2VXcmFwU3R5bGV9PlxyXG4gICAgICAgICAgICB7aW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgPGltZyBzcmM9e2ltYWdlVXJsfSBhbHQ9e25hbWV9IHN0eWxlPXtpbWFnZVN0eWxlfSAvPlxyXG4gICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICBObyBpbWFnZSBhdmFpbGFibGVcclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtwYW5lbFN0eWxlfT5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2hlcm9Cb2R5U3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxoMSBzdHlsZT17dGl0bGVTdHlsZX0+e25hbWV9PC9oMT5cclxuICAgICAgICAgICAgICA8cCBzdHlsZT17c3VidGl0bGVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICBDbGVhbiBwcm9kdWN0IG92ZXJ2aWV3IGZvciBxdWljayByZXZpZXcgYW5kIG1hbmFnZW1lbnQuXHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2JhZGdlU3R5bGUoaXNBY3RpdmUpfT5cclxuICAgICAgICAgICAgICB7aXNBY3RpdmUgPyBcIkFDVElWRVwiIDogXCJJTkFDVElWRVwifVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRzR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0Q2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRMYWJlbFN0eWxlfT5QcmljZTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdFZhbHVlU3R5bGV9PntwcmljZX08L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0Q2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRMYWJlbFN0eWxlfT5TdG9jazwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2J1dHRvbkhvdmVyZWQgPyBidXR0b25Ib3ZlclN0eWxlIDogYnV0dG9uU3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0QnV0dG9uSG92ZXJlZCh0cnVlKX1cclxuICAgICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRCdXR0b25Ib3ZlcmVkKGZhbHNlKX1cclxuICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlT3JkZXJDbGlja31cclxuICAgICAgICAgICAgICAgICAgdGl0bGU9XCJDbGljayB0byBjcmVhdGUgYSBuZXcgb3JkZXIgZm9yIHRoaXMgcHJvZHVjdFwiXHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIDxzdmdcclxuICAgICAgICAgICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjE4XCJcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIxOFwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIyLjVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMjFcIiByPVwiMVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjIwXCIgY3k9XCIyMVwiIHI9XCIxXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEgMWg0bDIuNjggMTMuMzlhMiAyIDAgMCAwIDIgMS42MWg5LjcyYTIgMiAwIDAgMCAyLTEuNjFMMjMgNkg2XCIgLz5cclxuICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgIE9yZGVyIE5vd1xyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0VmFsdWVTdHlsZX0+e3N0b2NrfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRDYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdExhYmVsU3R5bGV9PlNLVTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdFZhbHVlU3R5bGV9Pntza3V9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3Qtc2hvdy1zZWN0aW9uc1wiIHN0eWxlPXtzZWN0aW9uR3JpZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjb250ZW50Q2FyZFN0eWxlfT5cclxuICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PkRlc2NyaXB0aW9uPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMiB9fSAvPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17ZGVzY3JpcHRpb25TdHlsZX0+e2Rlc2NyaXB0aW9ufTwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjb250ZW50Q2FyZFN0eWxlfT5cclxuICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlByb2R1Y3QgRGV0YWlsczwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTIgfX0gLz5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9MaXN0U3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvTGFiZWxTdHlsZX0+Q2F0ZWdvcnk8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT57Y2F0ZWdvcnl9PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PkNyZWF0ZWQgQXQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIHtmb3JtYXREYXRlKHBhcmFtcz8uY3JlYXRlZEF0KX1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvTGFiZWxTdHlsZX0+VXBkYXRlZCBBdDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb1ZhbHVlU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAge2Zvcm1hdERhdGUocGFyYW1zPy51cGRhdGVkQXQpfVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9MYWJlbFN0eWxlfT5SZWNvcmQgSUQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIHtwYXJhbXM/LmlkIHx8IHJlY29yZD8uaWQgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0U2hvdztcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHBhZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMjBweFwiLFxyXG4gIGNvbG9yOiBcIiNlMmU4ZjBcIixcclxufTtcclxuXHJcbmNvbnN0IGhlYWRlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCI2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcIjM0cHhcIixcclxuICBsaW5lSGVpZ2h0OiAxLjA4LFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IGRlc2NTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMThweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIpXCIsXHJcbiAgYmFja2dyb3VuZDpcclxuICAgIFwibGluZWFyLWdyYWRpZW50KDE1MGRlZywgcmdiYSgxMCwgMjMsIDQ4LCAwLjk0KSAwJSwgcmdiYSg4LCAxOCwgMzgsIDAuOTQpIDEwMCUpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTRweCAyOHB4IHJnYmEoMiwgNiwgMjMsIDAuMjIpXCIsXHJcbiAgcGFkZGluZzogXCIxOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uVGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiMCAwIDE0cHggMFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMmVtXCIsXHJcbiAgY29sb3I6IFwiI2Y1ZGY5MFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxufTtcclxuXHJcbmNvbnN0IGxheW91dFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwibWlubWF4KDMwMHB4LCAwLjk1ZnIpIG1pbm1heCg0MjBweCwgMS4yNWZyKVwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzdGFja1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBsYWJlbFN0eWxlID0ge1xyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5wdXRTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yNilcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTUsIDIzLCA0MiwgMC42MilcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgcGFkZGluZzogXCIxMXB4IDEzcHhcIixcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbiAgZm9udEZhbWlseTogXCJpbmhlcml0XCIsXHJcbn07XHJcblxyXG5jb25zdCByb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBncmlkMlN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDFmclwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBjdXN0b21lckluZm9TdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG59O1xyXG5cclxuY29uc3QgY3VzdG9tZXJSb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI4cHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxufTtcclxuXHJcbmNvbnN0IG11dGVkU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc3Ryb25nU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICB0ZXh0QWxpZ246IFwicmlnaHRcIixcclxufTtcclxuXHJcbmNvbnN0IGxpbmVJdGVtUm93U3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMilcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTRweFwiLFxyXG4gIHBhZGRpbmc6IFwiMTJweFwiLFxyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNDQpXCIsXHJcbn07XHJcblxyXG5jb25zdCBsaW5lSXRlbVRvcFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIGF1dG9cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBwcm9kdWN0UHJldmlld1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiNTZweCAxZnJcIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjU2cHhcIixcclxuICBoZWlnaHQ6IFwiNTZweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjMGYxNzJhXCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjUpXCIsXHJcbn07XHJcblxyXG5jb25zdCBhZGRCdXR0b25TdHlsZSA9IHtcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIHBhZGRpbmc6IFwiOXB4IDEycHhcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoOTksIDEwMiwgMjQxLCAwLjE4KVwiLFxyXG4gIGNvbG9yOiBcIiNkYmVhZmVcIixcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxufTtcclxuXHJcbmNvbnN0IHJlbW92ZUJ1dHRvblN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgyMzksIDY4LCA2OCwgMC41KVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgcGFkZGluZzogXCI4cHggMTBweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSgxMjcsIDI5LCAyOSwgMC4yNSlcIixcclxuICBjb2xvcjogXCIjZmVjYWNhXCIsXHJcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG59O1xyXG5cclxuY29uc3QgdG90YWxzUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIHBhZGRpbmc6IFwiN3B4IDBcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbn07XHJcblxyXG5jb25zdCB0b3RhbFN0eWxlID0ge1xyXG4gIC4uLnRvdGFsc1Jvd1N0eWxlLFxyXG4gIGZvbnRTaXplOiBcIjE3cHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG4gIGJvcmRlckJvdHRvbTogXCJub25lXCIsXHJcbiAgcGFkZGluZ1RvcDogXCIxMnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBhY3Rpb25CYXJTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjFmciAxZnJcIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYWN0aW9uQnV0dG9uU3R5bGUgPSAocHJpbWFyeSkgPT4gKHtcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJvcmRlcjogcHJpbWFyeSA/IFwibm9uZVwiIDogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjI4KVwiLFxyXG4gIHBhZGRpbmc6IFwiMTJweCAxNHB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgYmFja2dyb3VuZDogcHJpbWFyeVxyXG4gICAgPyBcImxpbmVhci1ncmFkaWVudCgxMzVkZWcsICM2MzY2ZjEgMCUsICM4YjVjZjYgMTAwJSlcIlxyXG4gICAgOiBcInJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxuICBjb2xvcjogcHJpbWFyeSA/IFwiI2ZmZlwiIDogXCIjZDFkNWRiXCIsXHJcbn0pO1xyXG5cclxuY29uc3QgbWFwTGlua1N0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiM5M2M1ZmRcIixcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgdGV4dERlY29yYXRpb246IFwibm9uZVwiLFxyXG59O1xyXG5cclxuY29uc3QgcmVzcG9uc2l2ZUNzcyA9IGBcclxuQG1lZGlhIChtYXgtd2lkdGg6IDEwMjRweCkge1xyXG4gIC5jaGFuZ2U4LW9yZGVyLWxheW91dCB7XHJcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gIH1cclxufVxyXG5gO1xyXG5cclxuY29uc3QgcGF5bWVudE9wdGlvbnMgPSBbXCJDYXJkXCIsIFwiQ2FzaCBvbiBEZWxpdmVyeVwiLCBcIkJhbmsgVHJhbnNmZXJcIiwgXCJXYWxsZXRcIl07XHJcbmNvbnN0IHNoaXBwaW5nTWV0aG9kcyA9IFtcclxuICBcIlBpY2tNZSBGbGFzaFwiLFxyXG4gIFwiUHJvbnRvXCIsXHJcbiAgXCJEb21leFwiLFxyXG4gIFwiUmVnaXN0ZXJlZCBDb3VyaWVyXCIsXHJcbl07XHJcblxyXG5jb25zdCB0b051bWJlciA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IG51bSA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG51bSkgPyBudW0gOiAwO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0TW9uZXkgPSAodmFsdWUpID0+IHtcclxuICByZXR1cm4gYFJzLiAke3RvTnVtYmVyKHZhbHVlKS50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlRW1wdHlJdGVtID0gKCkgPT4gKHtcclxuICBwcm9kdWN0SWQ6IFwiXCIsXHJcbiAgcXVhbnRpdHk6IDEsXHJcbiAgdW5pdFByaWNlOiAwLFxyXG59KTtcclxuXHJcbmNvbnN0IE9yZGVyQ3JlYXRlID0gKCkgPT4ge1xyXG4gIGNvbnN0IFt1c2Vycywgc2V0VXNlcnNdID0gdXNlU3RhdGUoW10pO1xyXG4gIGNvbnN0IFtwcm9kdWN0cywgc2V0UHJvZHVjdHNdID0gdXNlU3RhdGUoW10pO1xyXG4gIGNvbnN0IFtvcmRlckNvdW50QnlVc2VyLCBzZXRPcmRlckNvdW50QnlVc2VyXSA9IHVzZVN0YXRlKHt9KTtcclxuICBjb25zdCBbc2Vzc2lvblVzZXIsIHNldFNlc3Npb25Vc2VyXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gIGNvbnN0IFtzdWJtaXR0aW5nLCBzZXRTdWJtaXR0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgY29uc3QgW2Zvcm1EYXRhLCBzZXRGb3JtRGF0YV0gPSB1c2VTdGF0ZSh7XHJcbiAgICB1c2VySWQ6IFwiXCIsXHJcbiAgICBzdGF0dXM6IFwicGVuZGluZ1wiLFxyXG4gICAgcGF5bWVudE1ldGhvZDogXCJDYXJkXCIsXHJcbiAgICBwYXltZW50U3RhdHVzOiBcInBlbmRpbmdcIixcclxuICAgIHRyYW5zYWN0aW9uSWQ6IFwiXCIsXHJcbiAgICBzaGlwcGluZ0FkZHJlc3M6IFwiXCIsXHJcbiAgICBzaGlwcGluZ01ldGhvZDogXCJQaWNrTWUgRmxhc2hcIixcclxuICAgIHRyYWNraW5nTnVtYmVyOiBcIlwiLFxyXG4gICAgc2hpcHBpbmdGZWU6IDAsXHJcbiAgICB0YXg6IDAsXHJcbiAgICBkaXNjb3VudDogMCxcclxuICB9KTtcclxuXHJcbiAgY29uc3QgW2xpbmVJdGVtcywgc2V0TGluZUl0ZW1zXSA9IHVzZVN0YXRlKFtjcmVhdGVFbXB0eUl0ZW0oKV0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcclxuICAgIGNvbnN0IHByZVByb2R1Y3RJZCA9IHBhcmFtcy5nZXQoXCJwcm9kdWN0SWRcIikgfHwgXCJcIjtcclxuXHJcbiAgICBjb25zdCBmZXRjaERhdGEgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgY29udGV4dFJlcyA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9jb250ZXh0L29yZGVyLWNyZWF0ZSR7XHJcbiAgICAgICAgICAgIHByZVByb2R1Y3RJZCA/IGA/cHJvZHVjdElkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHByZVByb2R1Y3RJZCl9YCA6IFwiXCJcclxuICAgICAgICAgIH1gLFxyXG4gICAgICAgICAgeyBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGV4dERhdGEgPSBjb250ZXh0UmVzLm9rID8gYXdhaXQgY29udGV4dFJlcy5qc29uKCkgOiB7fTtcclxuXHJcbiAgICAgICAgY29uc3QgdXNlcnNEYXRhID0gQXJyYXkuaXNBcnJheShjb250ZXh0RGF0YT8udXNlcnMpXHJcbiAgICAgICAgICA/IGNvbnRleHREYXRhLnVzZXJzXHJcbiAgICAgICAgICA6IFtdO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RzTGlzdCA9IEFycmF5LmlzQXJyYXkoY29udGV4dERhdGE/LnByb2R1Y3RzKVxyXG4gICAgICAgICAgPyBjb250ZXh0RGF0YS5wcm9kdWN0c1xyXG4gICAgICAgICAgOiBbXTtcclxuXHJcbiAgICAgICAgc2V0VXNlcnModXNlcnNEYXRhKTtcclxuICAgICAgICBzZXRQcm9kdWN0cyhwcm9kdWN0c0xpc3QpO1xyXG4gICAgICAgIHNldE9yZGVyQ291bnRCeVVzZXIoY29udGV4dERhdGE/Lm9yZGVyQ291bnRCeVVzZXIgfHwge30pO1xyXG4gICAgICAgIHNldFNlc3Npb25Vc2VyKGNvbnRleHREYXRhPy5jdXJyZW50VXNlciB8fCBudWxsKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHREYXRhPy5jdXJyZW50VXNlcj8uaWQpIHtcclxuICAgICAgICAgIHNldEZvcm1EYXRhKChwcmV2KSA9PiAoe1xyXG4gICAgICAgICAgICAuLi5wcmV2LFxyXG4gICAgICAgICAgICB1c2VySWQ6IHByZXYudXNlcklkIHx8IFN0cmluZyhjb250ZXh0RGF0YS5jdXJyZW50VXNlci5pZCksXHJcbiAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY29udGV4dERhdGE/LnNlbGVjdGVkUHJvZHVjdD8uaWQpIHtcclxuICAgICAgICAgIHNldExpbmVJdGVtcyhbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBwcm9kdWN0SWQ6IFN0cmluZyhjb250ZXh0RGF0YS5zZWxlY3RlZFByb2R1Y3QuaWQpLFxyXG4gICAgICAgICAgICAgIHF1YW50aXR5OiAxLFxyXG4gICAgICAgICAgICAgIHVuaXRQcmljZTogdG9OdW1iZXIoY29udGV4dERhdGEuc2VsZWN0ZWRQcm9kdWN0LnByaWNlKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgcHJlUHJvZHVjdElkICYmXHJcbiAgICAgICAgICBwcm9kdWN0c0xpc3Quc29tZSgocCkgPT4gU3RyaW5nKHAuaWQpID09PSBTdHJpbmcocHJlUHJvZHVjdElkKSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnN0IHNlbGVjdGVkID0gcHJvZHVjdHNMaXN0LmZpbmQoXHJcbiAgICAgICAgICAgIChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhwcmVQcm9kdWN0SWQpLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIHNldExpbmVJdGVtcyhbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBwcm9kdWN0SWQ6IFN0cmluZyhwcmVQcm9kdWN0SWQpLFxyXG4gICAgICAgICAgICAgIHF1YW50aXR5OiAxLFxyXG4gICAgICAgICAgICAgIHVuaXRQcmljZTogdG9OdW1iZXIoc2VsZWN0ZWQ/LnByaWNlKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmZXRjaERhdGEoKTtcclxuICB9LCBbXSk7XHJcblxyXG4gIGNvbnN0IHNlbGVjdGVkQ3VzdG9tZXIgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiB1c2Vycy5maW5kKCh1KSA9PiBTdHJpbmcodS5pZCkgPT09IFN0cmluZyhmb3JtRGF0YS51c2VySWQpKSB8fCBudWxsO1xyXG4gIH0sIFt1c2VycywgZm9ybURhdGEudXNlcklkXSk7XHJcblxyXG4gIGNvbnN0IGN1c3RvbWVyT3JkZXJDb3VudCA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgaWYgKCFzZWxlY3RlZEN1c3RvbWVyKSB7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBOdW1iZXIob3JkZXJDb3VudEJ5VXNlcltTdHJpbmcoc2VsZWN0ZWRDdXN0b21lci5pZCldIHx8IDApO1xyXG4gIH0sIFtvcmRlckNvdW50QnlVc2VyLCBzZWxlY3RlZEN1c3RvbWVyXSk7XHJcblxyXG4gIGNvbnN0IGxpbmVUb3RhbHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IHN1YnRvdGFsID0gbGluZUl0ZW1zLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiB7XHJcbiAgICAgIHJldHVybiBzdW0gKyB0b051bWJlcihpdGVtLnF1YW50aXR5KSAqIHRvTnVtYmVyKGl0ZW0udW5pdFByaWNlKTtcclxuICAgIH0sIDApO1xyXG5cclxuICAgIGNvbnN0IHNoaXBwaW5nRmVlID0gdG9OdW1iZXIoZm9ybURhdGEuc2hpcHBpbmdGZWUpO1xyXG4gICAgY29uc3QgdGF4ID0gdG9OdW1iZXIoZm9ybURhdGEudGF4KTtcclxuICAgIGNvbnN0IGRpc2NvdW50ID0gdG9OdW1iZXIoZm9ybURhdGEuZGlzY291bnQpO1xyXG4gICAgY29uc3QgZ3JhbmRUb3RhbCA9IE1hdGgubWF4KHN1YnRvdGFsICsgc2hpcHBpbmdGZWUgKyB0YXggLSBkaXNjb3VudCwgMCk7XHJcblxyXG4gICAgcmV0dXJuIHsgc3VidG90YWwsIHNoaXBwaW5nRmVlLCB0YXgsIGRpc2NvdW50LCBncmFuZFRvdGFsIH07XHJcbiAgfSwgW2xpbmVJdGVtcywgZm9ybURhdGEuc2hpcHBpbmdGZWUsIGZvcm1EYXRhLnRheCwgZm9ybURhdGEuZGlzY291bnRdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlRm9ybUNoYW5nZSA9IChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgeyBuYW1lLCB2YWx1ZSB9ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgc2V0Rm9ybURhdGEoKHByZXYpID0+ICh7IC4uLnByZXYsIFtuYW1lXTogdmFsdWUgfSkpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZUxpbmVJdGVtQ2hhbmdlID0gKGluZGV4LCBrZXksIHZhbHVlKSA9PiB7XHJcbiAgICBzZXRMaW5lSXRlbXMoKHByZXYpID0+IHtcclxuICAgICAgY29uc3QgbmV4dCA9IFsuLi5wcmV2XTtcclxuICAgICAgY29uc3QgaXRlbSA9IHsgLi4ubmV4dFtpbmRleF0gfTtcclxuXHJcbiAgICAgIGlmIChrZXkgPT09IFwicHJvZHVjdElkXCIpIHtcclxuICAgICAgICBpdGVtLnByb2R1Y3RJZCA9IHZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyh2YWx1ZSkpO1xyXG4gICAgICAgIGl0ZW0udW5pdFByaWNlID0gdG9OdW1iZXIocHJvZHVjdD8ucHJpY2UpO1xyXG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJxdWFudGl0eVwiKSB7XHJcbiAgICAgICAgaXRlbS5xdWFudGl0eSA9IE1hdGgubWF4KDEsIHRvTnVtYmVyKHZhbHVlKSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInVuaXRQcmljZVwiKSB7XHJcbiAgICAgICAgaXRlbS51bml0UHJpY2UgPSBNYXRoLm1heCgwLCB0b051bWJlcih2YWx1ZSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBuZXh0W2luZGV4XSA9IGl0ZW07XHJcbiAgICAgIHJldHVybiBuZXh0O1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYWRkTGluZUl0ZW0gPSAoKSA9PiB7XHJcbiAgICBzZXRMaW5lSXRlbXMoKHByZXYpID0+IFsuLi5wcmV2LCBjcmVhdGVFbXB0eUl0ZW0oKV0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlbW92ZUxpbmVJdGVtID0gKGluZGV4KSA9PiB7XHJcbiAgICBzZXRMaW5lSXRlbXMoKHByZXYpID0+IHtcclxuICAgICAgaWYgKHByZXYubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIHByZXY7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBwcmV2LmZpbHRlcigoXywgaSkgPT4gaSAhPT0gaW5kZXgpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgbWFwc0hyZWYgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGlmICghZm9ybURhdGEuc2hpcHBpbmdBZGRyZXNzPy50cmltKCkpIHtcclxuICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGBodHRwczovL3d3dy5nb29nbGUuY29tL21hcHMvc2VhcmNoLz9hcGk9MSZxdWVyeT0ke2VuY29kZVVSSUNvbXBvbmVudChmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3MudHJpbSgpKX1gO1xyXG4gIH0sIFtmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3NdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlU3VibWl0ID0gYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGNvbnN0IHZhbGlkSXRlbXMgPSBsaW5lSXRlbXMuZmlsdGVyKFxyXG4gICAgICAoaXRlbSkgPT4gaXRlbS5wcm9kdWN0SWQgJiYgdG9OdW1iZXIoaXRlbS5xdWFudGl0eSkgPiAwLFxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoIWZvcm1EYXRhLnVzZXJJZCkge1xyXG4gICAgICBhbGVydChcIlBsZWFzZSBzZWxlY3QgYSBjdXN0b21lci5cIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmFsaWRJdGVtcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgYWxlcnQoXCJBdCBsZWFzdCBvbmUgcHJvZHVjdCBsaW5lIGl0ZW0gaXMgcmVxdWlyZWQuXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U3VibWl0dGluZyh0cnVlKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBvcmRlclBheWxvYWQgPSB7XHJcbiAgICAgICAgdXNlcklkOiBOdW1iZXIoZm9ybURhdGEudXNlcklkKSxcclxuICAgICAgICBzdGF0dXM6IGZvcm1EYXRhLnN0YXR1cyxcclxuICAgICAgICBwYXltZW50TWV0aG9kOiBmb3JtRGF0YS5wYXltZW50TWV0aG9kLFxyXG4gICAgICAgIHBheW1lbnRTdGF0dXM6IGZvcm1EYXRhLnBheW1lbnRTdGF0dXMsXHJcbiAgICAgICAgdHJhbnNhY3Rpb25JZDogZm9ybURhdGEudHJhbnNhY3Rpb25JZCB8fCBudWxsLFxyXG4gICAgICAgIHNoaXBwaW5nTWV0aG9kOiBmb3JtRGF0YS5zaGlwcGluZ01ldGhvZCxcclxuICAgICAgICB0cmFja2luZ051bWJlcjogZm9ybURhdGEudHJhY2tpbmdOdW1iZXIgfHwgbnVsbCxcclxuICAgICAgICBzdWJ0b3RhbDogbGluZVRvdGFscy5zdWJ0b3RhbC50b0ZpeGVkKDIpLFxyXG4gICAgICAgIHNoaXBwaW5nRmVlOiBsaW5lVG90YWxzLnNoaXBwaW5nRmVlLnRvRml4ZWQoMiksXHJcbiAgICAgICAgdGF4OiBsaW5lVG90YWxzLnRheC50b0ZpeGVkKDIpLFxyXG4gICAgICAgIGRpc2NvdW50OiBsaW5lVG90YWxzLmRpc2NvdW50LnRvRml4ZWQoMiksXHJcbiAgICAgICAgdG90YWxBbW91bnQ6IGxpbmVUb3RhbHMuZ3JhbmRUb3RhbC50b0ZpeGVkKDIpLFxyXG4gICAgICAgIHNoaXBwaW5nQWRkcmVzczogZm9ybURhdGEuc2hpcHBpbmdBZGRyZXNzIHx8IG51bGwsXHJcbiAgICAgICAgbGluZUl0ZW1zOiB2YWxpZEl0ZW1zLm1hcCgoaXRlbSkgPT4gKHtcclxuICAgICAgICAgIHByb2R1Y3RJZDogTnVtYmVyKGl0ZW0ucHJvZHVjdElkKSxcclxuICAgICAgICAgIHF1YW50aXR5OiBNYXRoLm1heCgxLCB0b051bWJlcihpdGVtLnF1YW50aXR5KSksXHJcbiAgICAgICAgICB1bml0UHJpY2U6IE1hdGgubWF4KDAsIHRvTnVtYmVyKGl0ZW0udW5pdFByaWNlKSkudG9GaXhlZCgyKSxcclxuICAgICAgICB9KSksXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBzdWJtaXRGb3JtID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgIHN1Ym1pdEZvcm0uYXBwZW5kKFwicGF5bG9hZFwiLCBKU09OLnN0cmluZ2lmeShvcmRlclBheWxvYWQpKTtcclxuXHJcbiAgICAgIGNvbnN0IG9yZGVyUmVzID0gYXdhaXQgZmV0Y2goXCIvYWRtaW4vY29udGV4dC9vcmRlci1jcmVhdGUvc3VibWl0XCIsIHtcclxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXHJcbiAgICAgICAgYm9keTogc3VibWl0Rm9ybSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBvcmRlckRhdGEgPSBhd2FpdCBvcmRlclJlcy5qc29uKCk7XHJcbiAgICAgIGlmICghb3JkZXJSZXMub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3Iob3JkZXJEYXRhPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGNyZWF0ZSBvcmRlclwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihcclxuICAgICAgICBgL2FkbWluL3Jlc291cmNlcy9PcmRlcnMvcmVjb3Jkcy8ke29yZGVyRGF0YS5pZH0vc2hvd2AsXHJcbiAgICAgICk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBhbGVydChlcnJvci5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGNyZWF0ZSBvcmRlclwiKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNldFN1Ym1pdHRpbmcoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+e3Jlc3BvbnNpdmVDc3N9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2hlYWRlclN0eWxlfT5cclxuICAgICAgICA8aDEgc3R5bGU9e3RpdGxlU3R5bGV9PkNyZWF0ZSBOZXcgT3JkZXI8L2gxPlxyXG4gICAgICAgIDxwIHN0eWxlPXtkZXNjU3R5bGV9PlxyXG4gICAgICAgICAgQ3VzdG9tZXIgZGV0YWlscywgbGluZSBpdGVtcywgcGF5bWVudCwgc2hpcHBpbmcsIGFuZCB0b3RhbHMgaW4gb25lXHJcbiAgICAgICAgICBndWlkZWQgZmxvdy5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0gc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCIxNnB4XCIgfX0+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWxheW91dFwiIHN0eWxlPXtsYXlvdXRTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGFja1N0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5DdXN0b21lciBEZXRhaWxzPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TZWxlY3QgQ3VzdG9tZXIgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJ1c2VySWRcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudXNlcklkfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtsb2FkaW5nIHx8IHNlc3Npb25Vc2VyPy5yb2xlID09PSBcInVzZXJcIn1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtsb2FkaW5nID8gXCJMb2FkaW5nIGN1c3RvbWVycy4uLlwiIDogXCJTZWxlY3QgYSBjdXN0b21lclwifVxyXG4gICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAge3VzZXJzLm1hcCgodXNlcikgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXt1c2VyLmlkfSB2YWx1ZT17dXNlci5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICB7dXNlci5uYW1lfSAoI3t1c2VyLmlkfSlcclxuICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVySW5mb1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVyUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+Q3VzdG9tZXIgTmFtZSAmIElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17c3Ryb25nU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZEN1c3RvbWVyXHJcbiAgICAgICAgICAgICAgICAgICAgICA/IGAke3NlbGVjdGVkQ3VzdG9tZXIubmFtZX0gKCMke3NlbGVjdGVkQ3VzdG9tZXIuaWR9KWBcclxuICAgICAgICAgICAgICAgICAgICAgIDogXCItXCJ9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5FbWFpbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0cm9uZ1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRDdXN0b21lcj8uZW1haWwgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5QaG9uZSBOdW1iZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtzdHJvbmdTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkQ3VzdG9tZXI/LnBob25lIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEN1c3RvbWVyPy5tb2JpbGUgfHxcclxuICAgICAgICAgICAgICAgICAgICAgIFwiTm90IGF2YWlsYWJsZVwifVxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVyUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+T3JkZXIgSGlzdG9yeTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0cm9uZ1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICB7Y3VzdG9tZXJPcmRlckNvdW50fSBwcmV2aW91cyBvcmRlcnNcclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5QYXltZW50ICYgQmlsbGluZzwvaDI+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlBheW1lbnQgTWV0aG9kPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJwYXltZW50TWV0aG9kXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEucGF5bWVudE1ldGhvZH1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIHtwYXltZW50T3B0aW9ucy5tYXAoKGl0ZW0pID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtpdGVtfSB2YWx1ZT17aXRlbX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlBheW1lbnQgU3RhdHVzPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJwYXltZW50U3RhdHVzXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEucGF5bWVudFN0YXR1c31cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwZW5kaW5nXCI+UGVuZGluZzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwYWlkXCI+UGFpZDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5UcmFuc2FjdGlvbiBJRDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgbmFtZT1cInRyYW5zYWN0aW9uSWRcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudHJhbnNhY3Rpb25JZH1cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gVFhOLTIwMjYtMDAwMTI0XCJcclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17c3RhY2tTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgZ2FwOiBcIjhweFwiLFxyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3sgLi4uc2VjdGlvblRpdGxlU3R5bGUsIG1hcmdpbkJvdHRvbTogMCB9fT5cclxuICAgICAgICAgICAgICAgICAgUHJvZHVjdCBMaW5lIEl0ZW1zIChSZXF1aXJlZClcclxuICAgICAgICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXthZGRMaW5lSXRlbX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2FkZEJ1dHRvblN0eWxlfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICArIEFkZCBJdGVtXHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCIxMHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICB7bGluZUl0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRQcm9kdWN0ID0gcHJvZHVjdHMuZmluZChcclxuICAgICAgICAgICAgICAgICAgICAocCkgPT4gU3RyaW5nKHAuaWQpID09PSBTdHJpbmcoaXRlbS5wcm9kdWN0SWQpLFxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICBjb25zdCBpdGVtVG90YWwgPVxyXG4gICAgICAgICAgICAgICAgICAgIHRvTnVtYmVyKGl0ZW0ucXVhbnRpdHkpICogdG9OdW1iZXIoaXRlbS51bml0UHJpY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17YGxpbmUtaXRlbS0ke2luZGV4fWB9IHN0eWxlPXtsaW5lSXRlbVJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2xpbmVJdGVtVG9wU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5Qcm9kdWN0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aXRlbS5wcm9kdWN0SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVMaW5lSXRlbUNoYW5nZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInByb2R1Y3RJZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QgcHJvZHVjdDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3Byb2R1Y3RzLm1hcCgocHJvZHVjdCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17cHJvZHVjdC5pZH0gdmFsdWU9e3Byb2R1Y3QuaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwcm9kdWN0Lm5hbWV9IChTS1U6IHtwcm9kdWN0LnNrdX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtyZW1vdmVCdXR0b25TdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByZW1vdmVMaW5lSXRlbShpbmRleCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBSZW1vdmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtwcm9kdWN0UHJldmlld1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkUHJvZHVjdD8uaW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXtzZWxlY3RlZFByb2R1Y3QuaW1hZ2VVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHQ9e3NlbGVjdGVkUHJvZHVjdC5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5pbWFnZVN0eWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBObyBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZ3JpZFwiLCBnYXA6IFwiM3B4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IFwiMTRweFwiLCBjb2xvcjogXCIjZjhmYWZjXCIgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRQcm9kdWN0Py5uYW1lIHx8IFwiU2VsZWN0IGEgcHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiBcIjEycHhcIiwgY29sb3I6IFwiIzk0YTNiOFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU0tVL0lEOntcIiBcIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZFByb2R1Y3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBgJHtzZWxlY3RlZFByb2R1Y3Quc2t1fSAvICMke3NlbGVjdGVkUHJvZHVjdC5pZH1gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCItXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5RdWFudGl0eTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2l0ZW0ucXVhbnRpdHl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVMaW5lSXRlbUNoYW5nZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInF1YW50aXR5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlVuaXQgUHJpY2U8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnVuaXRQcmljZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxpbmVJdGVtQ2hhbmdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidW5pdFByaWNlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLi4udG90YWxzUm93U3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nQm90dG9tOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+TGluZSBUb3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdE1vbmV5KGl0ZW1Ub3RhbCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlNoaXBwaW5nICYgVHJhY2tpbmc8L2gyPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIEFkZHJlc3M8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHRleHRhcmVhXHJcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJzaGlwcGluZ0FkZHJlc3NcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuc2hpcHBpbmdBZGRyZXNzfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAuLi5pbnB1dFN0eWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1pbkhlaWdodDogXCI4NnB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzaXplOiBcInZlcnRpY2FsXCIsXHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiSG91c2UgbnVtYmVyLCBzdHJlZXQsIGNpdHksIHBvc3RhbCBjb2RlXCJcclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICB7bWFwc0hyZWYgPyAoXHJcbiAgICAgICAgICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgICAgICAgICAgaHJlZj17bWFwc0hyZWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcclxuICAgICAgICAgICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17bWFwTGlua1N0eWxlfVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgT3BlbiBvbiBHb29nbGUgTWFwc1xyXG4gICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICApIDogbnVsbH1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEwIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIE1ldGhvZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxzZWxlY3RcclxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2hpcHBpbmdNZXRob2RcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5zaGlwcGluZ01ldGhvZH1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIHtzaGlwcGluZ01ldGhvZHMubWFwKChpdGVtKSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17aXRlbX0gdmFsdWU9e2l0ZW19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7aXRlbX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlRyYWNraW5nIE51bWJlcjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJ0cmFja2luZ051bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnRyYWNraW5nTnVtYmVyfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVFJLLVhYWFhYWFwiXHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9Pk9yZGVyIFN1bW1hcnkgLyBUb3RhbHM8L2gyPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtncmlkMlN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TaGlwcGluZyBGZWU8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nRmVlXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuc2hpcHBpbmdGZWV9XHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5UYXggLyBWQVQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInRheFwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnRheH1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5EaXNjb3VudCAvIENvdXBvbjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcclxuICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJkaXNjb3VudFwiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5kaXNjb3VudH1cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5TdWJ0b3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGxpbmVUb3RhbHMuc3VidG90YWwpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5TaGlwcGluZyBGZWU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leShsaW5lVG90YWxzLnNoaXBwaW5nRmVlKX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbHNSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+VGF4IC8gVkFUPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkobGluZVRvdGFscy50YXgpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5EaXNjb3VudDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmc+LSB7Zm9ybWF0TW9uZXkobGluZVRvdGFscy5kaXNjb3VudCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj5HcmFuZCBUb3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuPntmb3JtYXRNb25leShsaW5lVG90YWxzLmdyYW5kVG90YWwpfTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyAuLi5jYXJkU3R5bGUsIHBhZGRpbmdUb3A6IFwiMTRweFwiIH19PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17YWN0aW9uQmFyU3R5bGV9PlxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgc3R5bGU9e2FjdGlvbkJ1dHRvblN0eWxlKGZhbHNlKX1cclxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB3aW5kb3cuaGlzdG9yeS5iYWNrKCl9XHJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICBDYW5jZWxcclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcclxuICAgICAgICAgICAgICBzdHlsZT17YWN0aW9uQnV0dG9uU3R5bGUodHJ1ZSl9XHJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICB7c3VibWl0dGluZyA/IFwiQ3JlYXRpbmcgT3JkZXIuLi5cIiA6IFwiQ3JlYXRlIE9yZGVyXCJ9XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZm9ybT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlckNyZWF0ZTtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHBhZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG4gIGNvbG9yOiBcIiNlMmU4ZjBcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMThweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIpXCIsXHJcbiAgYmFja2dyb3VuZDpcclxuICAgIFwibGluZWFyLWdyYWRpZW50KDE1NWRlZywgcmdiYSgxMCwgMjMsIDQ4LCAwLjk0KSAwJSwgcmdiYSg4LCAxOCwgMzgsIDAuOTQpIDEwMCUpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTRweCAzMHB4IHJnYmEoMiwgNiwgMjMsIDAuMilcIixcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGhlYWRlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBoZWFkaW5nU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBmb250U2l6ZTogXCIzNHB4XCIsXHJcbiAgbGluZUhlaWdodDogMS4xLFxyXG59O1xyXG5cclxuY29uc3Qgc3ViVGV4dFN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgbWFyZ2luVG9wOiBcIjRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IChzdGF0dXMpID0+IHtcclxuICBjb25zdCB2YWwgPSBTdHJpbmcoc3RhdHVzIHx8IFwicGVuZGluZ1wiKS50b0xvd2VyQ2FzZSgpO1xyXG4gIGNvbnN0IHN0eWxlQnlTdGF0dXMgPSB7XHJcbiAgICBwZW5kaW5nOiB7IGJnOiBcIiNmZWYzYzdcIiwgZmc6IFwiIzdjMmQxMlwiIH0sXHJcbiAgICBwYWlkOiB7IGJnOiBcIiNiYmY3ZDBcIiwgZmc6IFwiIzE0NTMyZFwiIH0sXHJcbiAgICBwcm9jZXNzaW5nOiB7IGJnOiBcIiNiZmRiZmVcIiwgZmc6IFwiIzFlM2E4YVwiIH0sXHJcbiAgICBzaGlwcGVkOiB7IGJnOiBcIiNkZGQ2ZmVcIiwgZmc6IFwiIzRjMWQ5NVwiIH0sXHJcbiAgICBjb21wbGV0ZWQ6IHsgYmc6IFwiI2E3ZjNkMFwiLCBmZzogXCIjMDY0ZTNiXCIgfSxcclxuICAgIGNhbmNlbGxlZDogeyBiZzogXCIjZmVjYWNhXCIsIGZnOiBcIiM3ZjFkMWRcIiB9LFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNlbGVjdGVkID0gc3R5bGVCeVN0YXR1c1t2YWxdIHx8IHN0eWxlQnlTdGF0dXMucGVuZGluZztcclxuICByZXR1cm4ge1xyXG4gICAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gICAgcGFkZGluZzogXCI2cHggMTJweFwiLFxyXG4gICAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxyXG4gICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICAgIGJhY2tncm91bmQ6IHNlbGVjdGVkLmJnLFxyXG4gICAgY29sb3I6IHNlbGVjdGVkLmZnLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uVGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiMCAwIDEycHggMFwiLFxyXG4gIGNvbG9yOiBcIiNmNWRmOTBcIixcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMWVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxufTtcclxuXHJcbmNvbnN0IGdyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgzMDBweCwgMWZyKSBtaW5tYXgoMzIwcHgsIDFmcilcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0dyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI4cHhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0YWJsZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBsaW5lSXRlbVN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgcGFkZGluZzogXCIxMHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNDQpXCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCI2MHB4IDFmciBhdXRvXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2MHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjYwcHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG59O1xyXG5cclxuY29uc3QgdG90YWxCb3hTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0b3RhbFJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI3cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGdyYW5kU3R5bGUgPSB7XHJcbiAgLi4udG90YWxSb3dTdHlsZSxcclxuICBib3JkZXJCb3R0b206IFwibm9uZVwiLFxyXG4gIHBhZGRpbmdUb3A6IFwiNnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGZvbnRTaXplOiBcIjE4cHhcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBlbXB0eVN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggZGFzaGVkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdE1vbmV5ID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgbiA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gYFJzLiAke24udG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSl9YDtcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUpID0+IHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gXCItXCI7XHJcbiAgfVxyXG5cclxuICBjb25zdCBkdCA9IG5ldyBEYXRlKHZhbHVlKTtcclxuICBpZiAoTnVtYmVyLmlzTmFOKGR0LmdldFRpbWUoKSkpIHtcclxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGR0LnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgZGF0ZVN0eWxlOiBcIm1lZGl1bVwiLFxyXG4gICAgdGltZVN0eWxlOiBcInNob3J0XCIsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBPcmRlclNob3cgPSAoeyByZWNvcmQgfSkgPT4ge1xyXG4gIGNvbnN0IFtkZXRhaWxzLCBzZXREZXRhaWxzXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIGNvbnN0IG9yZGVySWQgPSByZWNvcmQ/LnBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZDtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghb3JkZXJJZCkge1xyXG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgc2V0RXJyb3IoXCJPcmRlciBpZCBub3QgZm91bmRcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsb2FkRGV0YWlscyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBzZXRFcnJvcihcIlwiKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9jb250ZXh0L29yZGVycy8ke2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcob3JkZXJJZCkpfS9kZXRhaWxzYCxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZD8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGRldGFpbHNcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXREZXRhaWxzKHBheWxvYWQpO1xyXG4gICAgICB9IGNhdGNoIChmZXRjaEVycm9yKSB7XHJcbiAgICAgICAgc2V0RXJyb3IoZmV0Y2hFcnJvcj8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGRldGFpbHNcIik7XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbG9hZERldGFpbHMoKTtcclxuICB9LCBbb3JkZXJJZF0pO1xyXG5cclxuICBjb25zdCB0b3RhbHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IHN1YnRvdGFsID0gTnVtYmVyKGRldGFpbHM/LnN1YnRvdGFsIHx8IDApO1xyXG4gICAgY29uc3Qgc2hpcHBpbmdGZWUgPSBOdW1iZXIoZGV0YWlscz8uc2hpcHBpbmdGZWUgfHwgMCk7XHJcbiAgICBjb25zdCB0YXggPSBOdW1iZXIoZGV0YWlscz8udGF4IHx8IDApO1xyXG4gICAgY29uc3QgZGlzY291bnQgPSBOdW1iZXIoZGV0YWlscz8uZGlzY291bnQgfHwgMCk7XHJcbiAgICBjb25zdCB0b3RhbEFtb3VudCA9IE51bWJlcihkZXRhaWxzPy50b3RhbEFtb3VudCB8fCAwKTtcclxuXHJcbiAgICByZXR1cm4geyBzdWJ0b3RhbCwgc2hpcHBpbmdGZWUsIHRheCwgZGlzY291bnQsIHRvdGFsQW1vdW50IH07XHJcbiAgfSwgW2RldGFpbHNdKTtcclxuXHJcbiAgaWYgKGxvYWRpbmcpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5Mb2FkaW5nIG9yZGVyIGRldGFpbHMuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT57ZXJyb3J9PC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKCFkZXRhaWxzKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+T3JkZXIgZGV0YWlscyBub3QgYXZhaWxhYmxlLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+e2BAbWVkaWEgKG1heC13aWR0aDogMTA0MHB4KSB7IC5jaGFuZ2U4LW9yZGVyLXNob3ctZ3JpZCB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7IH0gfWB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17aGVhZGVyU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGgxIHN0eWxlPXtoZWFkaW5nU3R5bGV9Pk9yZGVyICN7ZGV0YWlscy5pZH08L2gxPlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdWJUZXh0U3R5bGV9PlxyXG4gICAgICAgICAgICAgIENyZWF0ZWQge2Zvcm1hdERhdGUoZGV0YWlscy5jcmVhdGVkQXQpfSB8IFVwZGF0ZWR7XCIgXCJ9XHJcbiAgICAgICAgICAgICAge2Zvcm1hdERhdGUoZGV0YWlscy51cGRhdGVkQXQpfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9e2JhZGdlU3R5bGUoZGV0YWlscy5zdGF0dXMpfT5cclxuICAgICAgICAgICAge2RldGFpbHMuc3RhdHVzIHx8IFwicGVuZGluZ1wifVxyXG4gICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1zaG93LWdyaWRcIiBzdHlsZT17Z3JpZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+Q3VzdG9tZXIgJiBTaGlwcGluZzwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+Q3VzdG9tZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8udXNlcj8ubmFtZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkVtYWlsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnVzZXI/LmVtYWlsIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UGF5bWVudCBNZXRob2Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8ucGF5bWVudE1ldGhvZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlBheW1lbnQgU3RhdHVzPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnBheW1lbnRTdGF0dXMgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5UcmFuc2FjdGlvbiBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy50cmFuc2FjdGlvbklkIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgTWV0aG9kPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnNoaXBwaW5nTWV0aG9kIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VHJhY2tpbmcgTnVtYmVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnRyYWNraW5nTnVtYmVyIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiBcIjEzcHhcIiwgY29sb3I6IFwiI2NiZDVlMVwiLCBsaW5lSGVpZ2h0OiAxLjYgfX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiLCBtYXJnaW5Cb3R0b206IFwiNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICBTaGlwcGluZyBBZGRyZXNzXHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIgfX0+XHJcbiAgICAgICAgICAgICAgICB7ZGV0YWlscz8uc2hpcHBpbmdBZGRyZXNzIHx8IFwiLVwifVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+T3JkZXIgU3VtbWFyeSAvIFRvdGFsczwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbEJveFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlN1YnRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KHRvdGFscy5zdWJ0b3RhbCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgRmVlPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KHRvdGFscy5zaGlwcGluZ0ZlZSl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VGF4IC8gVkFUPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KHRvdGFscy50YXgpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkRpc2NvdW50PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+LSB7Zm9ybWF0TW9uZXkodG90YWxzLmRpc2NvdW50KX08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2dyYW5kU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuPkdyYW5kIFRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuPntmb3JtYXRNb25leSh0b3RhbHMudG90YWxBbW91bnQpfTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlByb2R1Y3QgTGluZSBJdGVtczwvaDI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17dGFibGVTdHlsZX0+XHJcbiAgICAgICAgICB7KGRldGFpbHM/Lml0ZW1zIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9Pk5vIGxpbmUgaXRlbXMgaW4gdGhpcyBvcmRlci48L2Rpdj5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgIChkZXRhaWxzLml0ZW1zIHx8IFtdKS5tYXAoKGl0ZW0pID0+IChcclxuICAgICAgICAgICAgICA8ZGl2IGtleT17aXRlbS5pZH0gc3R5bGU9e2xpbmVJdGVtU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAge2l0ZW0/LnByb2R1Y3Q/LmltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjPXtpdGVtLnByb2R1Y3QuaW1hZ2VVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgYWx0PXtpdGVtPy5wcm9kdWN0Py5uYW1lIHx8IFwiUHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbWFnZVN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAuLi5pbWFnZVN0eWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIE5vIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZ3JpZFwiLCBnYXA6IFwiNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAge2l0ZW0/LnByb2R1Y3Q/Lm5hbWUgfHwgXCJVbm5hbWVkIHByb2R1Y3RcIn1cclxuICAgICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIFNLVToge2l0ZW0/LnByb2R1Y3Q/LnNrdSB8fCBcIi1cIn0gfCBQcm9kdWN0IElEOiAjXHJcbiAgICAgICAgICAgICAgICAgICAge2l0ZW0/LnByb2R1Y3RJZH1cclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjY2JkNWUxXCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICBRdHk6IHtpdGVtLnF1YW50aXR5fSB4IHtmb3JtYXRNb25leShpdGVtLnVuaXRQcmljZSl9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNXB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgIHtmb3JtYXRNb25leShpdGVtLnRvdGFsUHJpY2UpfVxyXG4gICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlclNob3c7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBwYWdlU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxuICBjb2xvcjogXCIjZTJlOGYwXCIsXHJcbn07XHJcblxyXG5jb25zdCBjYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE4cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yKVwiLFxyXG4gIGJhY2tncm91bmQ6XHJcbiAgICBcImxpbmVhci1ncmFkaWVudCgxNTVkZWcsIHJnYmEoMTAsIDIzLCA0OCwgMC45NCkgMCUsIHJnYmEoOCwgMTgsIDM4LCAwLjk0KSAxMDAlKVwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDE0cHggMzBweCByZ2JhKDIsIDYsIDIzLCAwLjIpXCIsXHJcbiAgcGFkZGluZzogXCIxOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBoZWFkZXJTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgdGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgZm9udFNpemU6IFwiMzRweFwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuMSxcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBzdWJ0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogXCI2cHggMCAwIDBcIixcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImlubGluZS1mbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gIHBhZGRpbmc6IFwiNnB4IDEycHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiOTk5cHhcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4wOGVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBjb2xvcjogXCIjMTQ1MzJkXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjYmJmN2QwXCIsXHJcbn07XHJcblxyXG5jb25zdCBncmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJtaW5tYXgoMzAwcHgsIDAuOTVmcikgbWlubWF4KDMyMHB4LCAxLjA1ZnIpXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHNlY3Rpb25UaXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogXCIwIDAgMTJweCAwXCIsXHJcbiAgY29sb3I6IFwiI2Y1ZGY5MFwiLFxyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjExZW1cIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0dyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI4cHhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBoZWlnaHQ6IFwiMjgwcHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTRweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG59O1xyXG5cclxuY29uc3QgbGluZUl0ZW1TdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjg0cHggMWZyIGF1dG9cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgcGFkZGluZzogXCIxMnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE0cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yKVwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSgxNSwgMjMsIDQyLCAwLjQ0KVwiLFxyXG59O1xyXG5cclxuY29uc3QgZW1wdHlJbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjg0cHhcIixcclxuICBoZWlnaHQ6IFwiODRweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjMGYxNzJhXCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjIpXCIsXHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG59O1xyXG5cclxuY29uc3QgdG90YWxSb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiN3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCBncmFuZFN0eWxlID0ge1xyXG4gIC4uLnRvdGFsUm93U3R5bGUsXHJcbiAgYm9yZGVyQm90dG9tOiBcIm5vbmVcIixcclxuICBwYWRkaW5nVG9wOiBcIjZweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBmb250U2l6ZTogXCIxOHB4XCIsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3QgZW1wdHlTdHlsZSA9IHtcclxuICBib3JkZXI6IFwiMXB4IGRhc2hlZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMzUpXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBwYWRkaW5nOiBcIjE0cHhcIixcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXRNb25leSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IG4gPSBOdW1iZXIodmFsdWUgfHwgMCk7XHJcbiAgcmV0dXJuIGBScy4gJHtuLnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gIH0pfWA7XHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXREYXRlID0gKHZhbHVlKSA9PiB7XHJcbiAgaWYgKCF2YWx1ZSkge1xyXG4gICAgcmV0dXJuIFwiLVwiO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZHQgPSBuZXcgRGF0ZSh2YWx1ZSk7XHJcbiAgaWYgKE51bWJlci5pc05hTihkdC5nZXRUaW1lKCkpKSB7XHJcbiAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkdC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIGRhdGVTdHlsZTogXCJtZWRpdW1cIixcclxuICAgIHRpbWVTdHlsZTogXCJzaG9ydFwiLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgT3JkZXJJdGVtU2hvdyA9ICh7IHJlY29yZCB9KSA9PiB7XHJcbiAgY29uc3QgW2RldGFpbHMsIHNldERldGFpbHNdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XHJcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgY29uc3Qgb3JkZXJJdGVtSWQgPSByZWNvcmQ/LnBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZDtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghb3JkZXJJdGVtSWQpIHtcclxuICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIHNldEVycm9yKFwiT3JkZXIgaXRlbSBpZCBub3QgZm91bmRcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsb2FkRGV0YWlscyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBzZXRFcnJvcihcIlwiKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9jb250ZXh0L29yZGVyLWl0ZW1zLyR7ZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhvcmRlckl0ZW1JZCkpfS9kZXRhaWxzYCxcclxuICAgICAgICAgIHsgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiB9LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICBwYXlsb2FkPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgb3JkZXIgaXRlbSBkZXRhaWxzXCIsXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0RGV0YWlscyhwYXlsb2FkKTtcclxuICAgICAgfSBjYXRjaCAoZmV0Y2hFcnJvcikge1xyXG4gICAgICAgIHNldEVycm9yKGZldGNoRXJyb3I/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gbG9hZCBvcmRlciBpdGVtIGRldGFpbHNcIik7XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbG9hZERldGFpbHMoKTtcclxuICB9LCBbb3JkZXJJdGVtSWRdKTtcclxuXHJcbiAgY29uc3QgY2FsY3VsYXRlZFRvdGFsID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICByZXR1cm4gTnVtYmVyKGRldGFpbHM/LnRvdGFsUHJpY2UgfHwgMCk7XHJcbiAgfSwgW2RldGFpbHNdKTtcclxuXHJcbiAgaWYgKGxvYWRpbmcpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5Mb2FkaW5nIG9yZGVyIGl0ZW0gZGV0YWlscy4uLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9PntlcnJvcn08L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoIWRldGFpbHMpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5PcmRlciBpdGVtIGRldGFpbHMgbm90IGF2YWlsYWJsZS48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBjb25zdCBwcm9kdWN0ID0gZGV0YWlscz8ucHJvZHVjdCB8fCB7fTtcclxuICBjb25zdCBvcmRlciA9IGRldGFpbHM/Lm9yZGVyIHx8IHt9O1xyXG4gIGNvbnN0IGN1c3RvbWVyID0gb3JkZXI/LnVzZXIgfHwge307XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+e2BAbWVkaWEgKG1heC13aWR0aDogMTA0MHB4KSB7IC5jaGFuZ2U4LW9yZGVyLWl0ZW0tZ3JpZCB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7IH0gfWB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17aGVhZGVyU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGgxIHN0eWxlPXt0aXRsZVN0eWxlfT57cHJvZHVjdD8ubmFtZSB8fCBcIk9yZGVyIEl0ZW1cIn08L2gxPlxyXG4gICAgICAgICAgICA8cCBzdHlsZT17c3VidGl0bGVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgT3JkZXIgI3tvcmRlcj8uaWQgfHwgXCItXCJ9IOKAoiBJdGVtICN7ZGV0YWlscz8uaWQgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9e2JhZGdlU3R5bGV9PkFjdGl2ZSBJdGVtPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1pdGVtLWdyaWRcIiBzdHlsZT17Z3JpZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAge3Byb2R1Y3Q/LmltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgc3JjPXtwcm9kdWN0LmltYWdlVXJsfVxyXG4gICAgICAgICAgICAgIGFsdD17cHJvZHVjdD8ubmFtZSB8fCBcIlByb2R1Y3RcIn1cclxuICAgICAgICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgLi4uaW1hZ2VTdHlsZSxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICBObyBpbWFnZSBhdmFpbGFibGVcclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxNCB9fSAvPlxyXG5cclxuICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlByb2R1Y3QgU25hcHNob3Q8L2gyPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0dyaWRTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlByb2R1Y3QgTmFtZTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntwcm9kdWN0Py5uYW1lIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U0tVPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e3Byb2R1Y3Q/LnNrdSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlByb2R1Y3QgSUQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz4je3Byb2R1Y3Q/LmlkIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+Q3VycmVudCBTdG9jazwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntwcm9kdWN0Py5zdG9jayA/PyBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9Pk9yZGVyICYgQ3VzdG9tZXI8L2gyPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0dyaWRTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkN1c3RvbWVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2N1c3RvbWVyPy5uYW1lIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+RW1haWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Y3VzdG9tZXI/LmVtYWlsIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+T3JkZXIgSUQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz4je29yZGVyPy5pZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19Pk9yZGVyIFN0YXR1czwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntvcmRlcj8uc3RhdHVzIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UGF5bWVudCBNZXRob2Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57b3JkZXI/LnBheW1lbnRNZXRob2QgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5TaGlwcGluZyBNZXRob2Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57b3JkZXI/LnNoaXBwaW5nTWV0aG9kIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VHJhY2tpbmcgTnVtYmVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e29yZGVyPy50cmFja2luZ051bWJlciB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkNyZWF0ZWQgQXQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0RGF0ZShkZXRhaWxzLmNyZWF0ZWRBdCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5QcmljaW5nIERldGFpbHM8L2gyPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2luZm9HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlF1YW50aXR5PC9zcGFuPlxyXG4gICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzLnF1YW50aXR5fTwvc3Ryb25nPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VW5pdCBQcmljZTwvc3Bhbj5cclxuICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkoZGV0YWlscy51bml0UHJpY2UpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+TGluZSBUb3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkoY2FsY3VsYXRlZFRvdGFsKX08L3N0cm9uZz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UXVpY2sgU3VtbWFyeTwvaDI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17bGluZUl0ZW1TdHlsZX0+XHJcbiAgICAgICAgICB7cHJvZHVjdD8uaW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICBzcmM9e3Byb2R1Y3QuaW1hZ2VVcmx9XHJcbiAgICAgICAgICAgICAgYWx0PXtwcm9kdWN0Py5uYW1lIHx8IFwiUHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogXCI4NHB4XCIsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiODRweFwiLFxyXG4gICAgICAgICAgICAgICAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtlbXB0eUltYWdlU3R5bGV9Pk5vIGltYWdlPC9kaXY+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ2FwOiBcIjRweFwiIH19PlxyXG4gICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGNvbG9yOiBcIiNmOGZhZmNcIiwgZm9udFNpemU6IFwiMTZweFwiIH19PlxyXG4gICAgICAgICAgICAgIHtwcm9kdWN0Py5uYW1lIHx8IFwiVW5uYW1lZCBwcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICBTS1U6IHtwcm9kdWN0Py5za3UgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiI2NiZDVlMVwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgUXR5IHtkZXRhaWxzLnF1YW50aXR5fSB4IHtmb3JtYXRNb25leShkZXRhaWxzLnVuaXRQcmljZSl9XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIsIGZvbnRTaXplOiBcIjE2cHhcIiB9fT5cclxuICAgICAgICAgICAge2Zvcm1hdE1vbmV5KGNhbGN1bGF0ZWRUb3RhbCl9XHJcbiAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgT3JkZXJJdGVtU2hvdztcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IGNlbGxTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgbWluSGVpZ2h0OiBcIjU2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiNjRweFwiLFxyXG4gIGhlaWdodDogXCI0MnB4XCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmOGZhZmNcIixcclxuICBmbGV4U2hyaW5rOiAwLFxyXG59O1xyXG5cclxuY29uc3QgZmFsbGJhY2tTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2NHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjQycHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggZGFzaGVkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC42KVwiLFxyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGNvbG9yOiBcIiM2NDc0OGJcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmOGZhZmNcIixcclxuICBmbGV4U2hyaW5rOiAwLFxyXG59O1xyXG5cclxuY29uc3QgdGV4dFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXHJcbiAgZ2FwOiBcIjJweFwiLFxyXG59O1xyXG5cclxuY29uc3QgUHJvZHVjdEltYWdlID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgaW1hZ2VVcmwgPSBwcm9wcz8ucmVjb3JkPy5wYXJhbXM/Lltwcm9wcz8ucHJvcGVydHk/LnBhdGhdO1xyXG4gIGNvbnN0IFtoYXNFcnJvciwgc2V0SGFzRXJyb3JdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgc2V0SGFzRXJyb3IoZmFsc2UpO1xyXG4gIH0sIFtpbWFnZVVybF0pO1xyXG5cclxuICBpZiAoIWltYWdlVXJsKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZmFsbGJhY2tTdHlsZX0+Tm8gaW1hZ2U8L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoaGFzRXJyb3IpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NlbGxTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17ZmFsbGJhY2tTdHlsZX0+SW52YWxpZDwvZGl2PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3RleHRTdHlsZX0+XHJcbiAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBcIiMwZjE3MmFcIiB9fT5JbWFnZSBVUkw8L3NwYW4+XHJcbiAgICAgICAgICA8YVxyXG4gICAgICAgICAgICBocmVmPXtpbWFnZVVybH1cclxuICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcclxuICAgICAgICAgICAgcmVsPVwibm9yZWZlcnJlclwiXHJcbiAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiIzI1NjNlYlwiLFxyXG4gICAgICAgICAgICAgIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIE9wZW4gbGlua1xyXG4gICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17Y2VsbFN0eWxlfT5cclxuICAgICAgPGltZ1xyXG4gICAgICAgIHNyYz17aW1hZ2VVcmx9XHJcbiAgICAgICAgYWx0PVwiUHJvZHVjdFwiXHJcbiAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9XHJcbiAgICAgICAgb25FcnJvcj17KCkgPT4gc2V0SGFzRXJyb3IodHJ1ZSl9XHJcbiAgICAgIC8+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3RleHRTdHlsZX0+XHJcbiAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogNjAwLCBjb2xvcjogXCIjMGYxNzJhXCIgfX0+UHJldmlldzwvc3Bhbj5cclxuICAgICAgICA8YVxyXG4gICAgICAgICAgaHJlZj17aW1hZ2VVcmx9XHJcbiAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgcmVsPVwibm9yZWZlcnJlclwiXHJcbiAgICAgICAgICBzdHlsZT17eyBjb2xvcjogXCIjMjU2M2ViXCIsIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIiwgZm9udFNpemU6IFwiMTJweFwiIH19XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgT3BlbiBpbWFnZVxyXG4gICAgICAgIDwvYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdEltYWdlO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3Qgd3JhcHBlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IHByZXZpZXdTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxNDBweFwiLFxyXG4gIGhlaWdodDogXCI5NnB4XCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IGhpbnRTdHlsZSA9IHtcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgY29sb3I6IFwiIzY0NzQ4YlwiLFxyXG59O1xyXG5cclxuY29uc3QgUHJvZHVjdEltYWdlVXBsb2FkID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgeyBvbkNoYW5nZSwgcmVjb3JkIH0gPSBwcm9wcztcclxuICBjb25zdCBjdXJyZW50VmFsdWUgPSByZWNvcmQ/LnBhcmFtcz8uaW1hZ2VVcmwgfHwgXCJcIjtcclxuICBjb25zdCBjdXJyZW50UHVibGljSWQgPSByZWNvcmQ/LnBhcmFtcz8uaW1hZ2VQdWJsaWNJZCB8fCBcIlwiO1xyXG4gIGNvbnN0IFtwcmV2aWV3VXJsLCBzZXRQcmV2aWV3VXJsXSA9IHVzZVN0YXRlKGN1cnJlbnRWYWx1ZSk7XHJcbiAgY29uc3QgW3B1YmxpY0lkLCBzZXRQdWJsaWNJZF0gPSB1c2VTdGF0ZShjdXJyZW50UHVibGljSWQpO1xyXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIHNldFByZXZpZXdVcmwoY3VycmVudFZhbHVlKTtcclxuICAgIHNldFB1YmxpY0lkKGN1cnJlbnRQdWJsaWNJZCk7XHJcbiAgfSwgW2N1cnJlbnRWYWx1ZSwgY3VycmVudFB1YmxpY0lkXSk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZVVwbG9hZCA9IGFzeW5jIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdO1xyXG5cclxuICAgIGlmICghZmlsZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VXBsb2FkaW5nKHRydWUpO1xyXG4gICAgc2V0RXJyb3IoXCJcIik7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgZm9ybURhdGEuYXBwZW5kKFwiaW1hZ2VcIiwgZmlsZSk7XHJcblxyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL2FwaS91cGxvYWRzL2ltYWdlXCIsIHtcclxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBheWxvYWQubWVzc2FnZSB8fCBcIkltYWdlIHVwbG9hZCBmYWlsZWRcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHVwbG9hZGVkVXJsID0gcGF5bG9hZC51cmwgfHwgXCJcIjtcclxuICAgICAgY29uc3QgdXBsb2FkZWRQdWJsaWNJZCA9IHBheWxvYWQucHVibGljSWQgfHwgXCJcIjtcclxuICAgICAgc2V0UHJldmlld1VybCh1cGxvYWRlZFVybCk7XHJcbiAgICAgIHNldFB1YmxpY0lkKHVwbG9hZGVkUHVibGljSWQpO1xyXG4gICAgICBvbkNoYW5nZT8uKFwiaW1hZ2VVcmxcIiwgdXBsb2FkZWRVcmwpO1xyXG4gICAgICBvbkNoYW5nZT8uKFwiaW1hZ2VQdWJsaWNJZFwiLCB1cGxvYWRlZFB1YmxpY0lkKTtcclxuICAgICAgb25DaGFuZ2U/LihcInVwbG9hZEltYWdlXCIsIHVwbG9hZGVkVXJsKTtcclxuICAgIH0gY2F0Y2ggKHVwbG9hZEVycm9yKSB7XHJcbiAgICAgIHNldEVycm9yKHVwbG9hZEVycm9yLm1lc3NhZ2UpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0VXBsb2FkaW5nKGZhbHNlKTtcclxuICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gXCJcIjtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBoYW5kbGVSZW1vdmUgPSAoKSA9PiB7XHJcbiAgICBzZXRQcmV2aWV3VXJsKFwiXCIpO1xyXG4gICAgc2V0UHVibGljSWQoXCJcIik7XHJcbiAgICBvbkNoYW5nZT8uKFwiaW1hZ2VVcmxcIiwgXCJcIik7XHJcbiAgICBvbkNoYW5nZT8uKFwiaW1hZ2VQdWJsaWNJZFwiLCBcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJ1cGxvYWRJbWFnZVwiLCBcIlwiKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17d3JhcHBlclN0eWxlfT5cclxuICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiIG9uQ2hhbmdlPXtoYW5kbGVVcGxvYWR9IC8+XHJcbiAgICAgIDxkaXYgc3R5bGU9e2hpbnRTdHlsZX0+XHJcbiAgICAgICAge3VwbG9hZGluZ1xyXG4gICAgICAgICAgPyBcIlVwbG9hZGluZyB0byBDbG91ZGluYXJ5Li4uXCJcclxuICAgICAgICAgIDogXCJDaG9vc2UgYW4gaW1hZ2UgZmlsZSB0byB1cGxvYWRcIn1cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICB7cHJldmlld1VybCA/IChcclxuICAgICAgICA8PlxyXG4gICAgICAgICAgPGltZyBzcmM9e3ByZXZpZXdVcmx9IGFsdD1cIlByb2R1Y3QgcHJldmlld1wiIHN0eWxlPXtwcmV2aWV3U3R5bGV9IC8+XHJcbiAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVSZW1vdmV9XHJcbiAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICAgICAgICAgICAgICBwYWRkaW5nOiBcIjZweCAxMHB4XCIsXHJcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjhweFwiLFxyXG4gICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgI2VmNDQ0NFwiLFxyXG4gICAgICAgICAgICAgIGNvbG9yOiBcIiNlZjQ0NDRcIixcclxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcIiNmZmZcIixcclxuICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBSZW1vdmUgaW1hZ2VcclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvPlxyXG4gICAgICApIDogbnVsbH1cclxuXHJcbiAgICAgIHtlcnJvciA/IChcclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IC4uLmhpbnRTdHlsZSwgY29sb3I6IFwiI2RjMjYyNlwiIH19PntlcnJvcn08L2Rpdj5cclxuICAgICAgKSA6IG51bGx9XHJcblxyXG4gICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJpbWFnZVVybFwiIHZhbHVlPXtwcmV2aWV3VXJsfSByZWFkT25seSAvPlxyXG4gICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJpbWFnZVB1YmxpY0lkXCIgdmFsdWU9e3B1YmxpY0lkfSByZWFkT25seSAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RJbWFnZVVwbG9hZDtcclxuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgRGFzaGJvYXJkIGZyb20gJy4uL2FkbWluL2Rhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGFzaGJvYXJkID0gRGFzaGJvYXJkXG5pbXBvcnQgUHJvZHVjdENhcmRzTGlzdCBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LWNhcmRzLWxpc3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RDYXJkc0xpc3QgPSBQcm9kdWN0Q2FyZHNMaXN0XG5pbXBvcnQgUHJvZHVjdFNob3cgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1zaG93J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0U2hvdyA9IFByb2R1Y3RTaG93XG5pbXBvcnQgT3JkZXJDcmVhdGUgZnJvbSAnLi4vYWRtaW4vb3JkZXItY3JlYXRlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlckNyZWF0ZSA9IE9yZGVyQ3JlYXRlXG5pbXBvcnQgT3JkZXJTaG93IGZyb20gJy4uL2FkbWluL29yZGVyLXNob3cnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLk9yZGVyU2hvdyA9IE9yZGVyU2hvd1xuaW1wb3J0IE9yZGVySXRlbVNob3cgZnJvbSAnLi4vYWRtaW4vb3JkZXItaXRlbS1zaG93J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlckl0ZW1TaG93ID0gT3JkZXJJdGVtU2hvd1xuaW1wb3J0IFByb2R1Y3RJbWFnZSBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LWltYWdlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0SW1hZ2UgPSBQcm9kdWN0SW1hZ2VcbmltcG9ydCBQcm9kdWN0SW1hZ2VVcGxvYWQgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS11cGxvYWQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RJbWFnZVVwbG9hZCA9IFByb2R1Y3RJbWFnZVVwbG9hZCJdLCJuYW1lcyI6WyJmb3JtYXRDdXJyZW5jeSIsInZhbHVlIiwiTnVtYmVyIiwidG9Mb2NhbGVTdHJpbmciLCJEYXNoYm9hcmQiLCJkYXRhIiwic2V0RGF0YSIsInVzZVN0YXRlIiwidXNlcnMiLCJjYXRlZ29yaWVzIiwicHJvZHVjdHMiLCJvcmRlcnMiLCJyZXZlbnVlIiwiZmVhdHVyZWRHZW1zIiwiY3JpdGljYWxTdG9jayIsInJlY2VudFByb2R1Y3RzIiwiY2F0ZWdvcnlEaXN0cmlidXRpb24iLCJ1c2VFZmZlY3QiLCJsb2FkRGFzaGJvYXJkIiwicmVzcG9uc2UiLCJmZXRjaCIsInBheWxvYWQiLCJqc29uIiwidG9wQ2F0ZWdvcmllcyIsInVzZU1lbW8iLCJkaXN0cmlidXRpb24iLCJtYXgiLCJNYXRoIiwibWFwIiwiaXRlbSIsImNvdW50Iiwid2lkdGgiLCJyb3VuZCIsImNvbXBsZXRpb25SYXRlIiwidG90YWwiLCJoZWFsdGh5IiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwic3R5bGUiLCJsZW5ndGgiLCJjYXRlZ29yeSIsImtleSIsIm5hbWUiLCJtYXJnaW5Ub3AiLCJwcm9kdWN0IiwiaWQiLCJEYXRlIiwiY3JlYXRlZEF0IiwidG9Mb2NhbGVEYXRlU3RyaW5nIiwicHJpY2UiLCJncmlkU3R5bGUiLCJkaXNwbGF5IiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsImdhcCIsImNhcmRTdHlsZSIsImJvcmRlclJhZGl1cyIsImJvcmRlciIsImJhY2tncm91bmQiLCJjb2xvciIsIm92ZXJmbG93IiwiYm94U2hhZG93IiwiaW1hZ2VXcmFwU3R5bGUiLCJoZWlnaHQiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJwYWRkaW5nIiwiaW1hZ2VTdHlsZSIsIm9iamVjdEZpdCIsImJvZHlTdHlsZSIsIm1ldGFTdHlsZSIsImZvbnRTaXplIiwiYmFkZ2VTdHlsZSIsImlzQWN0aXZlIiwiZm9udFdlaWdodCIsImxldHRlclNwYWNpbmciLCJsaW5rU3R5bGUiLCJ0ZXh0RGVjb3JhdGlvbiIsImN1cnNvciIsImVtcHR5U3R5bGUiLCJmb3JtYXRQcmljZSIsImFtb3VudCIsImlzRmluaXRlIiwidW5kZWZpbmVkIiwibWluaW11bUZyYWN0aW9uRGlnaXRzIiwibWF4aW11bUZyYWN0aW9uRGlnaXRzIiwiZ2V0UmVjb3JkSWQiLCJyZWNvcmQiLCJwYXJhbXMiLCJwYXJhbSIsImdldFNob3dIcmVmIiwicmVzb3VyY2VJZCIsInJlY29yZEFjdGlvbnMiLCJhY3Rpb25zIiwic2hvd0FjdGlvbiIsImZpbmQiLCJhY3Rpb24iLCJyYXdIcmVmIiwiaHJlZiIsImVuY29kZVVSSUNvbXBvbmVudCIsIlByb2R1Y3RDYXJkc0xpc3QiLCJwcm9wcyIsImFwaVJlY29yZHMiLCJzZXRBcGlSZWNvcmRzIiwibG9hZGluZyIsInNldExvYWRpbmciLCJsb2FkRXJyb3IiLCJzZXRMb2FkRXJyb3IiLCJyZXNvdXJjZSIsInByb3BSZWNvcmRzIiwicmVjb3JkcyIsImlzTW91bnRlZCIsImxvYWRSZWNvcmRzIiwiY3JlZGVudGlhbHMiLCJvayIsIkVycm9yIiwibWVzc2FnZSIsImVycm9yIiwiY2F0ZWdvcnlJZCIsImltYWdlVXJsIiwic3RvY2siLCJCb29sZWFuIiwiZGV0YWlsc0hyZWYiLCJvcGVuRGV0YWlscyIsIndpbmRvdyIsImxvY2F0aW9uIiwiYXNzaWduIiwic3JjIiwiYWx0Iiwib25DbGljayIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJwYWdlU3R5bGUiLCJoZXJvU3R5bGUiLCJwYW5lbFN0eWxlIiwibWluSGVpZ2h0IiwiaGVyb0JvZHlTdHlsZSIsInRpdGxlU3R5bGUiLCJtYXJnaW4iLCJsaW5lSGVpZ2h0Iiwic3VidGl0bGVTdHlsZSIsImFjdGl2ZSIsInN0YXRzR3JpZFN0eWxlIiwic3RhdENhcmRTdHlsZSIsInN0YXRMYWJlbFN0eWxlIiwidGV4dFRyYW5zZm9ybSIsIm1hcmdpbkJvdHRvbSIsInN0YXRWYWx1ZVN0eWxlIiwid29yZEJyZWFrIiwic2VjdGlvbkdyaWRTdHlsZSIsInNlY3Rpb25UaXRsZVN0eWxlIiwiY29udGVudENhcmRTdHlsZSIsImluZm9MaXN0U3R5bGUiLCJpbmZvUm93U3R5bGUiLCJwYWRkaW5nQm90dG9tIiwiYm9yZGVyQm90dG9tIiwiaW5mb0xhYmVsU3R5bGUiLCJpbmZvVmFsdWVTdHlsZSIsInRleHRBbGlnbiIsImRlc2NyaXB0aW9uU3R5bGUiLCJ3aGl0ZVNwYWNlIiwiYnV0dG9uU3R5bGUiLCJ0cmFuc2l0aW9uIiwiYnV0dG9uSG92ZXJTdHlsZSIsInRyYW5zZm9ybSIsImZvcm1hdERhdGUiLCJkYXRlIiwiaXNOYU4iLCJnZXRUaW1lIiwiU3RyaW5nIiwiZGF0ZVN0eWxlIiwidGltZVN0eWxlIiwiUHJvZHVjdFNob3ciLCJza3UiLCJkZXNjcmlwdGlvbiIsImJ1dHRvbkhvdmVyZWQiLCJzZXRCdXR0b25Ib3ZlcmVkIiwiaGFuZGxlT3JkZXJDbGljayIsInByb2R1Y3RJZCIsIm5ld09yZGVyVXJsIiwib25Nb3VzZUVudGVyIiwib25Nb3VzZUxlYXZlIiwidGl0bGUiLCJ4bWxucyIsInZpZXdCb3giLCJmaWxsIiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VMaW5lY2FwIiwic3Ryb2tlTGluZWpvaW4iLCJjeCIsImN5IiwiciIsImQiLCJ1cGRhdGVkQXQiLCJoZWFkZXJTdHlsZSIsImRlc2NTdHlsZSIsImxheW91dFN0eWxlIiwic3RhY2tTdHlsZSIsImxhYmVsU3R5bGUiLCJpbnB1dFN0eWxlIiwiZm9udEZhbWlseSIsInJvd1N0eWxlIiwiZ3JpZDJTdHlsZSIsImN1c3RvbWVySW5mb1N0eWxlIiwiY3VzdG9tZXJSb3dTdHlsZSIsIm11dGVkU3R5bGUiLCJzdHJvbmdTdHlsZSIsImxpbmVJdGVtUm93U3R5bGUiLCJsaW5lSXRlbVRvcFN0eWxlIiwicHJvZHVjdFByZXZpZXdTdHlsZSIsImFkZEJ1dHRvblN0eWxlIiwicmVtb3ZlQnV0dG9uU3R5bGUiLCJ0b3RhbHNSb3dTdHlsZSIsInRvdGFsU3R5bGUiLCJwYWRkaW5nVG9wIiwiYWN0aW9uQmFyU3R5bGUiLCJhY3Rpb25CdXR0b25TdHlsZSIsInByaW1hcnkiLCJtYXBMaW5rU3R5bGUiLCJyZXNwb25zaXZlQ3NzIiwicGF5bWVudE9wdGlvbnMiLCJzaGlwcGluZ01ldGhvZHMiLCJ0b051bWJlciIsIm51bSIsImZvcm1hdE1vbmV5IiwiY3JlYXRlRW1wdHlJdGVtIiwicXVhbnRpdHkiLCJ1bml0UHJpY2UiLCJPcmRlckNyZWF0ZSIsInNldFVzZXJzIiwic2V0UHJvZHVjdHMiLCJvcmRlckNvdW50QnlVc2VyIiwic2V0T3JkZXJDb3VudEJ5VXNlciIsInNlc3Npb25Vc2VyIiwic2V0U2Vzc2lvblVzZXIiLCJzdWJtaXR0aW5nIiwic2V0U3VibWl0dGluZyIsImZvcm1EYXRhIiwic2V0Rm9ybURhdGEiLCJ1c2VySWQiLCJzdGF0dXMiLCJwYXltZW50TWV0aG9kIiwicGF5bWVudFN0YXR1cyIsInRyYW5zYWN0aW9uSWQiLCJzaGlwcGluZ0FkZHJlc3MiLCJzaGlwcGluZ01ldGhvZCIsInRyYWNraW5nTnVtYmVyIiwic2hpcHBpbmdGZWUiLCJ0YXgiLCJkaXNjb3VudCIsImxpbmVJdGVtcyIsInNldExpbmVJdGVtcyIsIlVSTFNlYXJjaFBhcmFtcyIsInNlYXJjaCIsInByZVByb2R1Y3RJZCIsImdldCIsImZldGNoRGF0YSIsImNvbnRleHRSZXMiLCJjb250ZXh0RGF0YSIsInVzZXJzRGF0YSIsIkFycmF5IiwiaXNBcnJheSIsInByb2R1Y3RzTGlzdCIsImN1cnJlbnRVc2VyIiwicHJldiIsInNlbGVjdGVkUHJvZHVjdCIsInNvbWUiLCJwIiwic2VsZWN0ZWQiLCJzZWxlY3RlZEN1c3RvbWVyIiwidSIsImN1c3RvbWVyT3JkZXJDb3VudCIsImxpbmVUb3RhbHMiLCJzdWJ0b3RhbCIsInJlZHVjZSIsInN1bSIsImdyYW5kVG90YWwiLCJoYW5kbGVGb3JtQ2hhbmdlIiwidGFyZ2V0IiwiaGFuZGxlTGluZUl0ZW1DaGFuZ2UiLCJpbmRleCIsIm5leHQiLCJhZGRMaW5lSXRlbSIsInJlbW92ZUxpbmVJdGVtIiwiZmlsdGVyIiwiXyIsImkiLCJtYXBzSHJlZiIsInRyaW0iLCJoYW5kbGVTdWJtaXQiLCJ2YWxpZEl0ZW1zIiwiYWxlcnQiLCJvcmRlclBheWxvYWQiLCJ0b0ZpeGVkIiwidG90YWxBbW91bnQiLCJzdWJtaXRGb3JtIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJKU09OIiwic3RyaW5naWZ5Iiwib3JkZXJSZXMiLCJtZXRob2QiLCJib2R5Iiwib3JkZXJEYXRhIiwib25TdWJtaXQiLCJvbkNoYW5nZSIsInJlcXVpcmVkIiwiZGlzYWJsZWQiLCJyb2xlIiwidXNlciIsImVtYWlsIiwicGhvbmUiLCJtb2JpbGUiLCJwbGFjZWhvbGRlciIsInR5cGUiLCJpdGVtVG90YWwiLCJtaW4iLCJzdGVwIiwicmVzaXplIiwicmVsIiwiaGlzdG9yeSIsImJhY2siLCJoZWFkaW5nU3R5bGUiLCJzdWJUZXh0U3R5bGUiLCJ2YWwiLCJ0b0xvd2VyQ2FzZSIsInN0eWxlQnlTdGF0dXMiLCJwZW5kaW5nIiwiYmciLCJmZyIsInBhaWQiLCJwcm9jZXNzaW5nIiwic2hpcHBlZCIsImNvbXBsZXRlZCIsImNhbmNlbGxlZCIsImluZm9HcmlkU3R5bGUiLCJ0YWJsZVN0eWxlIiwibGluZUl0ZW1TdHlsZSIsInRvdGFsQm94U3R5bGUiLCJ0b3RhbFJvd1N0eWxlIiwiZ3JhbmRTdHlsZSIsIm4iLCJkdCIsIk9yZGVyU2hvdyIsImRldGFpbHMiLCJzZXREZXRhaWxzIiwic2V0RXJyb3IiLCJvcmRlcklkIiwibG9hZERldGFpbHMiLCJmZXRjaEVycm9yIiwidG90YWxzIiwiaXRlbXMiLCJ0b3RhbFByaWNlIiwiZW1wdHlJbWFnZVN0eWxlIiwiT3JkZXJJdGVtU2hvdyIsIm9yZGVySXRlbUlkIiwiY2FsY3VsYXRlZFRvdGFsIiwib3JkZXIiLCJjdXN0b21lciIsImNlbGxTdHlsZSIsImZsZXhTaHJpbmsiLCJmYWxsYmFja1N0eWxlIiwidGV4dFN0eWxlIiwiZmxleERpcmVjdGlvbiIsIlByb2R1Y3RJbWFnZSIsInByb3BlcnR5IiwicGF0aCIsImhhc0Vycm9yIiwic2V0SGFzRXJyb3IiLCJvbkVycm9yIiwid3JhcHBlclN0eWxlIiwicHJldmlld1N0eWxlIiwiaGludFN0eWxlIiwiUHJvZHVjdEltYWdlVXBsb2FkIiwiY3VycmVudFZhbHVlIiwiY3VycmVudFB1YmxpY0lkIiwiaW1hZ2VQdWJsaWNJZCIsInByZXZpZXdVcmwiLCJzZXRQcmV2aWV3VXJsIiwicHVibGljSWQiLCJzZXRQdWJsaWNJZCIsInVwbG9hZGluZyIsInNldFVwbG9hZGluZyIsImhhbmRsZVVwbG9hZCIsImZpbGUiLCJmaWxlcyIsInVwbG9hZGVkVXJsIiwidXJsIiwidXBsb2FkZWRQdWJsaWNJZCIsInVwbG9hZEVycm9yIiwiaGFuZGxl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LEVBQUE7RUFBS0MsSUFBQUEsU0FBUyxFQUFDO0tBQW1CLGVBQ2hDRixzQkFBQSxDQUFBQyxhQUFBLENBQUEsT0FBQSxFQUFBLElBQUEsRUFDRztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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
