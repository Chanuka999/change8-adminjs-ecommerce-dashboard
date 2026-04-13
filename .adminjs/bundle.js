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

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.Dashboard = Dashboard;
  AdminJS.UserComponents.ProductCardsList = ProductCardsList;
  AdminJS.UserComponents.ProductShow = ProductShow;
  AdminJS.UserComponents.ProductImage = ProductImage;
  AdminJS.UserComponents.ProductImageUpload = ProductImageUpload;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9hZG1pbi9kYXNoYm9hcmQuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1jYXJkcy1saXN0LmpzeCIsIi4uL2FkbWluL3Byb2R1Y3Qtc2hvdy5qc3giLCIuLi9hZG1pbi9wcm9kdWN0LWltYWdlLmpzeCIsIi4uL2FkbWluL3Byb2R1Y3QtaW1hZ2UtdXBsb2FkLmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBmb3JtYXRDdXJyZW5jeSA9ICh2YWx1ZSkgPT4ge1xyXG4gIHJldHVybiBgUnMuJHtOdW1iZXIodmFsdWUgfHwgMCkudG9Mb2NhbGVTdHJpbmcoKX1gO1xyXG59O1xyXG5cclxuY29uc3QgRGFzaGJvYXJkID0gKCkgPT4ge1xyXG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKHtcclxuICAgIHVzZXJzOiAwLFxyXG4gICAgY2F0ZWdvcmllczogMCxcclxuICAgIHByb2R1Y3RzOiAwLFxyXG4gICAgb3JkZXJzOiAwLFxyXG4gICAgcmV2ZW51ZTogMCxcclxuICAgIGZlYXR1cmVkR2VtczogMCxcclxuICAgIGNyaXRpY2FsU3RvY2s6IDAsXHJcbiAgICByZWNlbnRQcm9kdWN0czogW10sXHJcbiAgICBjYXRlZ29yeURpc3RyaWJ1dGlvbjogW10sXHJcbiAgfSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBsb2FkRGFzaGJvYXJkID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL2FkbWluL2FwaS9kYXNoYm9hcmRcIik7XHJcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIHNldERhdGEocGF5bG9hZCB8fCB7fSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWREYXNoYm9hcmQoKTtcclxuICB9LCBbXSk7XHJcblxyXG4gIGNvbnN0IHRvcENhdGVnb3JpZXMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IGRhdGEuY2F0ZWdvcnlEaXN0cmlidXRpb24gfHwgW107XHJcbiAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi5kaXN0cmlidXRpb24ubWFwKChpdGVtKSA9PiBpdGVtLmNvdW50KSwgMSk7XHJcblxyXG4gICAgcmV0dXJuIGRpc3RyaWJ1dGlvbi5tYXAoKGl0ZW0pID0+ICh7XHJcbiAgICAgIC4uLml0ZW0sXHJcbiAgICAgIHdpZHRoOiBgJHtNYXRoLm1heCg4LCBNYXRoLnJvdW5kKChpdGVtLmNvdW50IC8gbWF4KSAqIDEwMCkpfSVgLFxyXG4gICAgfSkpO1xyXG4gIH0sIFtkYXRhLmNhdGVnb3J5RGlzdHJpYnV0aW9uXSk7XHJcblxyXG4gIGNvbnN0IGNvbXBsZXRpb25SYXRlID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBjb25zdCB0b3RhbCA9IE51bWJlcihkYXRhLnByb2R1Y3RzIHx8IDApO1xyXG4gICAgaWYgKHRvdGFsID09PSAwKSB7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGhlYWx0aHkgPSBNYXRoLm1heCh0b3RhbCAtIE51bWJlcihkYXRhLmNyaXRpY2FsU3RvY2sgfHwgMCksIDApO1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQoKGhlYWx0aHkgLyB0b3RhbCkgKiAxMDApO1xyXG4gIH0sIFtkYXRhLnByb2R1Y3RzLCBkYXRhLmNyaXRpY2FsU3RvY2tdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1kYXNoYm9hcmRcIj5cclxuICAgICAgPHN0eWxlPlxyXG4gICAgICAgIHtgXHJcbiAgICAgICAgICAuY2hhbmdlOC1kYXNoYm9hcmQge1xyXG4gICAgICAgICAgICAtLWJnLTE6IHZhcigtLWNoYW5nZTgtYmctMSwgIzA1MDkxNCk7XHJcbiAgICAgICAgICAgIC0tYmctMjogdmFyKC0tY2hhbmdlOC1iZy0yLCAjMGIxYTM4KTtcclxuICAgICAgICAgICAgLS1iZy0zOiB2YXIoLS1jaGFuZ2U4LWJnLTMsICMxMjFmM2EpO1xyXG4gICAgICAgICAgICAtLWdvbGQ6IHZhcigtLWNoYW5nZTgtZ29sZCwgI2UyYmY2Nik7XHJcbiAgICAgICAgICAgIC0tdGV4dC1tYWluOiB2YXIoLS1jaGFuZ2U4LXRleHQtbWFpbiwgI2Y4ZmFmYyk7XHJcbiAgICAgICAgICAgIC0tdGV4dC1tdXRlZDogdmFyKC0tY2hhbmdlOC10ZXh0LW11dGVkLCAjOWFhOGMxKTtcclxuICAgICAgICAgICAgLS1saW5lOiB2YXIoLS1jaGFuZ2U4LWxpbmUsIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4yMikpO1xyXG4gICAgICAgICAgICAtLWNhcmQtYmc6IHZhcigtLWNoYW5nZTgtY2FyZC1iZywgbGluZWFyLWdyYWRpZW50KDE2MGRlZywgcmdiYSgyMSwgMzQsIDY2LCAwLjk1KSAwJSwgcmdiYSgxMCwgMTgsIDM2LCAwLjk1KSAxMDAlKSk7XHJcbiAgICAgICAgICAgIC0tZ3JhZC1lbmQ6IHZhcigtLWNoYW5nZTgtZ3JhZC1lbmQsICMwNDA3MGYpO1xyXG4gICAgICAgICAgICAtLXNoYWRvdzogdmFyKC0tY2hhbmdlOC1zaGFkb3csIDAgOHB4IDI2cHggcmdiYSgwLCAwLCAwLCAwLjMpKTtcclxuICAgICAgICAgICAgLS1yYWRpYWwtMTogdmFyKC0tY2hhbmdlOC1yYWRpYWwtMSwgcmdiYSgzNCwgOTMsIDE4MCwgMC4zNSkpO1xyXG4gICAgICAgICAgICAtLXJhZGlhbC0yOiB2YXIoLS1jaGFuZ2U4LXJhZGlhbC0yLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMTYpKTtcclxuXHJcbiAgICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAzMHB4O1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tYWluKTtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDpcclxuICAgICAgICAgICAgICByYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDglIDAlLCB2YXIoLS1yYWRpYWwtMSkgMCUsIHJnYmEoMzQsIDkzLCAxODAsIDApIDM4JSksXHJcbiAgICAgICAgICAgICAgcmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCA4NSUgMTIlLCB2YXIoLS1yYWRpYWwtMikgMCUsIHJnYmEoMjI2LCAxOTEsIDEwMiwgMCkgNDIlKSxcclxuICAgICAgICAgICAgICBsaW5lYXItZ3JhZGllbnQoMTIwZGVnLCB2YXIoLS1iZy0xKSAwJSwgdmFyKC0tYmctMikgNDglLCB2YXIoLS1ncmFkLWVuZCkgMTAwJSk7XHJcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBcIlBvcHBpbnNcIiwgXCJTZWdvZSBVSVwiLCBzYW5zLXNlcmlmO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT0nbGlnaHQnXSAuY2hhbmdlOC1kYXNoYm9hcmQge1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtYmctMTogI2YwZjZmZjtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LWJnLTI6ICNmZmZmZmY7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC1iZy0zOiAjZWVmNWZmO1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtZ29sZDogI2MwOGIwZjtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LXRleHQtbWFpbjogIzBmMTcyYTtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LXRleHQtbXV0ZWQ6ICM0NzU1Njk7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC1saW5lOiByZ2JhKDE1LCAyMywgNDIsIDAuMDgpO1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtY2FyZC1iZzogI2ZmZmZmZjtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LWdyYWQtZW5kOiAjZjhmYmZmO1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtc2hhZG93OiAwIDRweCAyMHB4IHJnYmEoMTUsIDIzLCA0MiwgMC4wNik7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC1yYWRpYWwtMTogcmdiYSgzNCwgOTMsIDE4MCwgMC4wOCk7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC1yYWRpYWwtMjogcmdiYSgxOTIsIDEzOSwgMTUsIDAuMDUpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWhlYWRlciB7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogZmFkZS11cCA1MjBtcyBlYXNlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWtpY2tlciB7XHJcbiAgICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjM2ZW07XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLWdvbGQpO1xyXG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXRpdGxlIHtcclxuICAgICAgICAgICAgbWFyZ2luOiA4cHggMCA2cHg7XHJcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjA2O1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IGNsYW1wKDMycHgsIDV2dywgNTZweCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtc3VidGl0bGUge1xyXG4gICAgICAgICAgICBtYXJnaW46IDA7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LW1ldHJpYy1ncmlkIHtcclxuICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoNCwgbWlubWF4KDE3MHB4LCAxZnIpKTtcclxuICAgICAgICAgICAgZ2FwOiAxNHB4O1xyXG4gICAgICAgICAgICBtYXJnaW4tdG9wOiAxOHB4O1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWNhcmQge1xyXG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saW5lKTtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMThweDtcclxuICAgICAgICAgICAgcGFkZGluZzogMTZweCAxOHB4O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jYXJkLWJnKTtcclxuICAgICAgICAgICAgYm94LXNoYWRvdzogdmFyKC0tc2hhZG93KTtcclxuICAgICAgICAgICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDRweCk7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogZmFkZS11cCA1NjBtcyBlYXNlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWNhcmQtbGFiZWwge1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjE4ZW07XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogNnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWNhcmQtdmFsdWUge1xyXG4gICAgICAgICAgICBmb250LXNpemU6IGNsYW1wKDM0cHgsIDR2dywgNTJweCk7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWNhcmQtaGludCB7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgICBtYXJnaW4tdG9wOiA4cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbGF5b3V0IHtcclxuICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBtaW5tYXgoMzAwcHgsIDEuOGZyKSBtaW5tYXgoMjYwcHgsIDFmcik7XHJcbiAgICAgICAgICAgIGdhcDogMTZweDtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1wcm9ncmVzcy13cmFwIHtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogMTBweDtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1wcm9ncmVzcy1oZWFkIHtcclxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogNnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXByb2dyZXNzLXRyYWNrIHtcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMHB4O1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEyKTtcclxuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNoYW5nZTgtcHJvZ3Jlc3MtdHJhY2sge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDE1LCAyMywgNDIsIDAuMTIpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXByb2dyZXNzLWZpbGwge1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsICNmNWRmOTAgMCUsICNlMmJmNjYgMTAwJSk7XHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHdpZHRoIDMyMG1zIGVhc2U7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcmVjZW50LWxpc3Qge1xyXG4gICAgICAgICAgICBtYXJnaW4tdG9wOiA2cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcmVjZW50LWl0ZW0ge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDEwcHggMDtcclxuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNoYW5nZTgtcmVjZW50LWl0ZW0ge1xyXG4gICAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgxNSwgMjMsIDQyLCAwLjEyKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1yZWNlbnQtaXRlbTpsYXN0LWNoaWxkIHtcclxuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1uYW1lIHtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWRhdGUge1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1wcmljZSB7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIEBrZXlmcmFtZXMgZmFkZS11cCB7XHJcbiAgICAgICAgICAgIGZyb20ge1xyXG4gICAgICAgICAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDhweCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdG8ge1xyXG4gICAgICAgICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDExODBweCkge1xyXG4gICAgICAgICAgICAuY2hhbmdlOC1tZXRyaWMtZ3JpZCB7XHJcbiAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDE4MHB4LCAxZnIpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLmNoYW5nZTgtbGF5b3V0IHtcclxuICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA3MjBweCkge1xyXG4gICAgICAgICAgICAuY2hhbmdlOC1kYXNoYm9hcmQge1xyXG4gICAgICAgICAgICAgIHBhZGRpbmc6IDIwcHggMTZweDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLmNoYW5nZTgtbWV0cmljLWdyaWQge1xyXG4gICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgYH1cclxuICAgICAgPC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1oZWFkZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgta2lja2VyXCI+U2VjdGlvbiBWaWV3PC9kaXY+XHJcbiAgICAgICAgPGgxIGNsYXNzTmFtZT1cImNoYW5nZTgtdGl0bGVcIj5EYXNoYm9hcmQ8L2gxPlxyXG4gICAgICAgIDxwIGNsYXNzTmFtZT1cImNoYW5nZTgtc3VidGl0bGVcIj5cclxuICAgICAgICAgIFRyYWNrIHlvdXIgY29tbWVyY2UgaGVhbHRoIGF0IGEgZ2xhbmNlIHdpdGggbGl2ZSBpbnZlbnRvcnkgYW5kIG9yZGVyXHJcbiAgICAgICAgICBzaWduYWxzLlxyXG4gICAgICAgIDwvcD5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbWV0cmljLWdyaWRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5SZXZlbnVlIFN0cmVhbTwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtdmFsdWVcIj5cclxuICAgICAgICAgICAge2Zvcm1hdEN1cnJlbmN5KGRhdGEucmV2ZW51ZSl9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5BY3Jvc3MgYWxsIG9yZGVyczwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5JbnZlbnRvcnkgU2l6ZTwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtdmFsdWVcIj57ZGF0YS5wcm9kdWN0cyB8fCAwfTwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPlRvdGFsIGFjdGl2ZSBjYXRhbG9nIGl0ZW1zPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPkZlYXR1cmVkIEdlbXM8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+e2RhdGEuZmVhdHVyZWRHZW1zIHx8IDB9PC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+Q3VycmVudGx5IHZpc2libGUgcHJvZHVjdHM8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+Q3JpdGljYWwgU3RvY2s8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+e2RhdGEuY3JpdGljYWxTdG9jayB8fCAwfTwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPkl0ZW1zIG5lZWRpbmcgdXJnZW50IHJlZmlsbDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1sYXlvdXRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5DYXRlZ29yeSBEaXN0cmlidXRpb248L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5JbnZlbnRvcnkgc3BsaXQgYnkgc2VnbWVudDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9ncmVzcy13cmFwXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9ncmVzcy1oZWFkXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4+SGVhbHRoeSBzdG9jayBsZXZlbDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntjb21wbGV0aW9uUmF0ZX0lPC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtdHJhY2tcIj5cclxuICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWZpbGxcIlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IGAke2NvbXBsZXRpb25SYXRlfSVgIH19XHJcbiAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICB7KHRvcENhdGVnb3JpZXMgfHwgW10pLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPk5vIGNhdGVnb3J5IGRhdGEgeWV0LjwvZGl2PlxyXG4gICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgKHRvcENhdGVnb3JpZXMgfHwgW10pLm1hcCgoY2F0ZWdvcnkpID0+IChcclxuICAgICAgICAgICAgICA8ZGl2IGtleT17Y2F0ZWdvcnkubmFtZX0gY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9ncmVzcy13cmFwXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtaGVhZFwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3Bhbj57Y2F0ZWdvcnkubmFtZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e2NhdGVnb3J5LmNvdW50fTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtdHJhY2tcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtZmlsbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IGNhdGVnb3J5LndpZHRoIH19XHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPlJlY2VudCBBZGRpdGlvbnM8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5cclxuICAgICAgICAgICAgTGF0ZXN0IHByb2R1Y3RzIGVudGVyaW5nIHRoZSBjYXRhbG9nXHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICB7KGRhdGEucmVjZW50UHJvZHVjdHMgfHwgW10pLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiIHN0eWxlPXt7IG1hcmdpblRvcDogXCIxMnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgTm8gcHJvZHVjdHMgYWRkZWQgeWV0LlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1yZWNlbnQtbGlzdFwiPlxyXG4gICAgICAgICAgICAgIHsoZGF0YS5yZWNlbnRQcm9kdWN0cyB8fCBbXSkubWFwKChwcm9kdWN0KSA9PiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcmVjZW50LWl0ZW1cIiBrZXk9e3Byb2R1Y3QuaWR9PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1uYW1lXCI+e3Byb2R1Y3QubmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtZGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAge25ldyBEYXRlKHByb2R1Y3QuY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoKX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcmljZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtmb3JtYXRDdXJyZW5jeShwcm9kdWN0LnByaWNlKX1cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmQ7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBncmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMjQwcHgsIDFmcikpXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMTZweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjI4KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwibGluZWFyLWdyYWRpZW50KDE2MGRlZywgIzBiMWEzOCAwJSwgIzA5MTYyZiAxMDAlKVwiLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBvdmVyZmxvdzogXCJoaWRkZW5cIixcclxuICBib3hTaGFkb3c6IFwiMCAxMnB4IDIycHggcmdiYSgyLCA2LCAyMywgMC4yNSlcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlV3JhcFN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBoZWlnaHQ6IFwiMTYwcHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBib2R5U3R5bGUgPSB7XHJcbiAgcGFkZGluZzogXCIxNHB4XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgbWV0YVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDFmclwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IChpc0FjdGl2ZSkgPT4gKHtcclxuICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjA1ZW1cIixcclxuICBwYWRkaW5nOiBcIjVweCAxMHB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgY29sb3I6IGlzQWN0aXZlID8gXCIjMTQ1MzJkXCIgOiBcIiM3ZjFkMWRcIixcclxuICBiYWNrZ3JvdW5kOiBpc0FjdGl2ZSA/IFwiI2JiZjdkMFwiIDogXCIjZmVjYWNhXCIsXHJcbn0pO1xyXG5cclxuY29uc3QgbGlua1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiaW5saW5lLWJsb2NrXCIsXHJcbiAgbWFyZ2luVG9wOiBcIjRweFwiLFxyXG4gIGNvbG9yOiBcIiM5M2M1ZmRcIixcclxuICB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDYwMCxcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgZW1wdHlTdHlsZSA9IHtcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggZGFzaGVkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC40NSlcIixcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXRQcmljZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IGFtb3VudCA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICBpZiAoIU51bWJlci5pc0Zpbml0ZShhbW91bnQpKSB7XHJcbiAgICByZXR1cm4gXCIwLjAwXCI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYW1vdW50LnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0UmVjb3JkSWQgPSAocmVjb3JkKSA9PiB7XHJcbiAgcmV0dXJuIHJlY29yZD8ucGFyYW1zPy5pZCB8fCByZWNvcmQ/LmlkIHx8IHJlY29yZD8ucGFyYW0/LmlkIHx8IFwiXCI7XHJcbn07XHJcblxyXG5jb25zdCBnZXRTaG93SHJlZiA9IChyZWNvcmQsIHJlc291cmNlSWQpID0+IHtcclxuICBjb25zdCByZWNvcmRBY3Rpb25zID0gcmVjb3JkPy5yZWNvcmRBY3Rpb25zIHx8IHJlY29yZD8uYWN0aW9ucyB8fCBbXTtcclxuICBjb25zdCBzaG93QWN0aW9uID0gcmVjb3JkQWN0aW9ucy5maW5kKChhY3Rpb24pID0+IGFjdGlvbj8ubmFtZSA9PT0gXCJzaG93XCIpO1xyXG4gIGNvbnN0IHJhd0hyZWYgPSBzaG93QWN0aW9uPy5ocmVmIHx8IHJlY29yZD8uaHJlZiB8fCBcIlwiO1xyXG5cclxuICBpZiAocmF3SHJlZikge1xyXG4gICAgcmV0dXJuIHJhd0hyZWY7XHJcbiAgfVxyXG5cclxuICBjb25zdCBpZCA9IGdldFJlY29yZElkKHJlY29yZCk7XHJcbiAgcmV0dXJuIGlkXHJcbiAgICA/IGAvYWRtaW4vcmVzb3VyY2VzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KHJlc291cmNlSWQpfS9yZWNvcmRzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KGlkKX0vc2hvd2BcclxuICAgIDogXCJcIjtcclxufTtcclxuXHJcbmNvbnN0IFByb2R1Y3RDYXJkc0xpc3QgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCBbYXBpUmVjb3Jkcywgc2V0QXBpUmVjb3Jkc10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IFtsb2FkRXJyb3IsIHNldExvYWRFcnJvcl0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgY29uc3QgcmVzb3VyY2VJZCA9XHJcbiAgICBwcm9wcz8ucmVzb3VyY2U/LmlkID09PSBcIlByb2R1Y3RcIlxyXG4gICAgICA/IFwiUHJvZHVjdHNcIlxyXG4gICAgICA6IHByb3BzPy5yZXNvdXJjZT8uaWQgfHwgXCJQcm9kdWN0c1wiO1xyXG4gIGNvbnN0IHByb3BSZWNvcmRzID0gcHJvcHM/LnJlY29yZHMgfHwgW107XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAocHJvcFJlY29yZHMubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBsb2FkUmVjb3JkcyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgc2V0TG9hZGluZyh0cnVlKTtcclxuICAgICAgc2V0TG9hZEVycm9yKFwiXCIpO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9hcGkvcmVzb3VyY2VzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KHJlc291cmNlSWQpfS9hY3Rpb25zL2xpc3RgLFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZD8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIHByb2R1Y3RzXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0QXBpUmVjb3JkcyhwYXlsb2FkPy5yZWNvcmRzIHx8IFtdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0TG9hZEVycm9yKGVycm9yPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgcHJvZHVjdHNcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkUmVjb3JkcygpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIGlzTW91bnRlZCA9IGZhbHNlO1xyXG4gICAgfTtcclxuICB9LCBbcHJvcFJlY29yZHMubGVuZ3RoLCByZXNvdXJjZUlkXSk7XHJcblxyXG4gIGNvbnN0IHJlY29yZHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiBwcm9wUmVjb3Jkcy5sZW5ndGggPyBwcm9wUmVjb3JkcyA6IGFwaVJlY29yZHM7XHJcbiAgfSwgW3Byb3BSZWNvcmRzLCBhcGlSZWNvcmRzXSk7XHJcblxyXG4gIGlmIChsb2FkaW5nKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+TG9hZGluZyBwcm9kdWN0cy4uLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChsb2FkRXJyb3IpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT57bG9hZEVycm9yfTwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmICghcmVjb3Jkcy5sZW5ndGgpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5ObyBwcm9kdWN0cyBmb3VuZC48L2Rpdj47XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17Z3JpZFN0eWxlfT5cclxuICAgICAge3JlY29yZHMubWFwKChyZWNvcmQpID0+IHtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fTtcclxuICAgICAgICBjb25zdCBpZCA9IGdldFJlY29yZElkKHJlY29yZCk7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHBhcmFtcz8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwiO1xyXG4gICAgICAgIGNvbnN0IGNhdGVnb3J5ID0gcGFyYW1zPy5jYXRlZ29yeUlkIHx8IFwiLVwiO1xyXG4gICAgICAgIGNvbnN0IGltYWdlVXJsID0gcGFyYW1zPy5pbWFnZVVybCB8fCBcIlwiO1xyXG4gICAgICAgIGNvbnN0IHN0b2NrID0gTnVtYmVyKHBhcmFtcz8uc3RvY2sgfHwgMCk7XHJcbiAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBCb29sZWFuKHBhcmFtcz8uaXNBY3RpdmUpO1xyXG4gICAgICAgIGNvbnN0IGRldGFpbHNIcmVmID0gZ2V0U2hvd0hyZWYocmVjb3JkLCByZXNvdXJjZUlkKTtcclxuICAgICAgICBjb25zdCBvcGVuRGV0YWlscyA9ICgpID0+IHtcclxuICAgICAgICAgIGlmIChkZXRhaWxzSHJlZikge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKGRldGFpbHNIcmVmKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgPGFydGljbGUga2V5PXtpZH0gc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2ltYWdlV3JhcFN0eWxlfT5cclxuICAgICAgICAgICAgICB7aW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2VVcmx9IGFsdD17bmFtZX0gc3R5bGU9e2ltYWdlU3R5bGV9IC8+XHJcbiAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgTm8gaW1hZ2VcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Ym9keVN0eWxlfT5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiBcIjE4cHhcIiwgZm9udFdlaWdodDogNzAwIH19PntuYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e21ldGFTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PkNhdGVnb3J5OiB7Y2F0ZWdvcnl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlN0b2NrOiB7c3RvY2t9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlByaWNlOiBScy4ge2Zvcm1hdFByaWNlKHBhcmFtcz8ucHJpY2UpfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtiYWRnZVN0eWxlKGlzQWN0aXZlKX0+XHJcbiAgICAgICAgICAgICAgICB7aXNBY3RpdmUgPyBcIkFDVElWRVwiIDogXCJJTkFDVElWRVwifVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgICAgaHJlZj17ZGV0YWlsc0hyZWYgfHwgXCIjXCJ9XHJcbiAgICAgICAgICAgICAgICBzdHlsZT17bGlua1N0eWxlfVxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17KGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgIG9wZW5EZXRhaWxzKCk7XHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgYXJpYS1kaXNhYmxlZD17IWRldGFpbHNIcmVmfVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIFZpZXcgZGV0YWlsc1xyXG4gICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgKTtcclxuICAgICAgfSl9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdENhcmRzTGlzdDtcclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgcGFnZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxOHB4XCIsXHJcbiAgY29sb3I6IFwiI2UyZThmMFwiLFxyXG59O1xyXG5cclxuY29uc3QgaGVyb1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwibWlubWF4KDI4MHB4LCAzNjBweCkgMWZyXCIsXHJcbiAgZ2FwOiBcIjE4cHhcIixcclxuICBhbGlnbkl0ZW1zOiBcInN0cmV0Y2hcIixcclxufTtcclxuXHJcbmNvbnN0IHBhbmVsU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjIwcHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xOClcIixcclxuICBiYWNrZ3JvdW5kOlxyXG4gICAgXCJsaW5lYXItZ3JhZGllbnQoMTYwZGVnLCByZ2JhKDExLCAyNiwgNTYsIDAuOTYpIDAlLCByZ2JhKDksIDIyLCA0NywgMC45NikgMTAwJSlcIixcclxuICBib3hTaGFkb3c6IFwiMCAyMHB4IDQwcHggcmdiYSgyLCA2LCAyMywgMC4yNClcIixcclxuICBvdmVyZmxvdzogXCJoaWRkZW5cIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlV3JhcFN0eWxlID0ge1xyXG4gIG1pbkhlaWdodDogXCIzNjBweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBkaXNwbGF5OiBcImJsb2NrXCIsXHJcbn07XHJcblxyXG5jb25zdCBoZXJvQm9keVN0eWxlID0ge1xyXG4gIHBhZGRpbmc6IFwiMjJweFwiLFxyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBmb250U2l6ZTogXCJjbGFtcCgyOHB4LCA0dncsIDQ2cHgpXCIsXHJcbiAgbGluZUhlaWdodDogMS4wNSxcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBzdWJ0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgZm9udFNpemU6IFwiMTRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IChhY3RpdmUpID0+ICh7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICBwYWRkaW5nOiBcIjZweCAxMnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxyXG4gIGNvbG9yOiBhY3RpdmUgPyBcIiMxNDUzMmRcIiA6IFwiIzdmMWQxZFwiLFxyXG4gIGJhY2tncm91bmQ6IGFjdGl2ZSA/IFwiI2JiZjdkMFwiIDogXCIjZmVjYWNhXCIsXHJcbn0pO1xyXG5cclxuY29uc3Qgc3RhdHNHcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJyZXBlYXQoMywgbWlubWF4KDE2MHB4LCAxZnIpKVwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzdGF0Q2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxNnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTUpXCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNTgpXCIsXHJcbiAgcGFkZGluZzogXCIxNHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzdGF0TGFiZWxTdHlsZSA9IHtcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTZlbVwiLFxyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBtYXJnaW5Cb3R0b206IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzdGF0VmFsdWVTdHlsZSA9IHtcclxuICBmb250U2l6ZTogXCIxNnB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICB3b3JkQnJlYWs6IFwiYnJlYWstd29yZFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdGlvbkdyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgwLCAxLjRmcikgbWlubWF4KDI4MHB4LCAwLjlmcilcIixcclxuICBnYXA6IFwiMThweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdGlvblRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjEyZW1cIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gIGNvbG9yOiBcIiNmNWRmOTBcIixcclxufTtcclxuXHJcbmNvbnN0IGNvbnRlbnRDYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjIwcHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xOClcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTEsIDI2LCA1NiwgMC45KVwiLFxyXG4gIHBhZGRpbmc6IFwiMThweFwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDE2cHggMjhweCByZ2JhKDIsIDYsIDIzLCAwLjE2KVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0xpc3RTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb1Jvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiMTBweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0xhYmVsU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9WYWx1ZVN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgdGV4dEFsaWduOiBcInJpZ2h0XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgZGVzY3JpcHRpb25TdHlsZSA9IHtcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbiAgbGluZUhlaWdodDogMS43LFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxuICB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIsXHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXRDdXJyZW5jeSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IGFtb3VudCA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gYFJzLiAke2Ftb3VudC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiBcIi1cIjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSk7XHJcbiAgaWYgKE51bWJlci5pc05hTihkYXRlLmdldFRpbWUoKSkpIHtcclxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBkYXRlU3R5bGU6IFwibWVkaXVtXCIsXHJcbiAgICB0aW1lU3R5bGU6IFwic2hvcnRcIixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IFByb2R1Y3RTaG93ID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkID0gcHJvcHM/LnJlY29yZDtcclxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fTtcclxuXHJcbiAgY29uc3QgbmFtZSA9IHBhcmFtcz8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwiO1xyXG4gIGNvbnN0IHNrdSA9IHBhcmFtcz8uc2t1IHx8IFwiLVwiO1xyXG4gIGNvbnN0IGNhdGVnb3J5ID0gcGFyYW1zPy5jYXRlZ29yeUlkIHx8IFwiLVwiO1xyXG4gIGNvbnN0IGltYWdlVXJsID0gcGFyYW1zPy5pbWFnZVVybCB8fCBcIlwiO1xyXG4gIGNvbnN0IHN0b2NrID0gTnVtYmVyKHBhcmFtcz8uc3RvY2sgfHwgMCk7XHJcbiAgY29uc3QgaXNBY3RpdmUgPSBCb29sZWFuKHBhcmFtcz8uaXNBY3RpdmUpO1xyXG4gIGNvbnN0IHByaWNlID0gZm9ybWF0Q3VycmVuY3kocGFyYW1zPy5wcmljZSk7XHJcbiAgY29uc3QgZGVzY3JpcHRpb24gPVxyXG4gICAgcGFyYW1zPy5kZXNjcmlwdGlvbiB8fCBcIk5vIGRlc2NyaXB0aW9uIGF2YWlsYWJsZSBmb3IgdGhpcyBwcm9kdWN0LlwiO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17cGFnZVN0eWxlfT5cclxuICAgICAgPHN0eWxlPlxyXG4gICAgICAgIHtgXHJcbiAgICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogOTgwcHgpIHtcclxuICAgICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LWhlcm8sXHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1zZWN0aW9ucyB7XHJcbiAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgIWltcG9ydGFudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGB9XHJcbiAgICAgIDwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdC1zaG93LWhlcm9cIiBzdHlsZT17aGVyb1N0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtwYW5lbFN0eWxlfT5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2ltYWdlV3JhcFN0eWxlfT5cclxuICAgICAgICAgICAge2ltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICAgIDxpbWcgc3JjPXtpbWFnZVVybH0gYWx0PXtuYW1lfSBzdHlsZT17aW1hZ2VTdHlsZX0gLz5cclxuICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgTm8gaW1hZ2UgYXZhaWxhYmxlXHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17cGFuZWxTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtoZXJvQm9keVN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aDEgc3R5bGU9e3RpdGxlU3R5bGV9PntuYW1lfTwvaDE+XHJcbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3N1YnRpdGxlU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgQ2xlYW4gcHJvZHVjdCBvdmVydmlldyBmb3IgcXVpY2sgcmV2aWV3IGFuZCBtYW5hZ2VtZW50LlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtiYWRnZVN0eWxlKGlzQWN0aXZlKX0+XHJcbiAgICAgICAgICAgICAge2lzQWN0aXZlID8gXCJBQ1RJVkVcIiA6IFwiSU5BQ1RJVkVcIn1cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0c0dyaWRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdENhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0TGFiZWxTdHlsZX0+UHJpY2U8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRWYWx1ZVN0eWxlfT57cHJpY2V9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdENhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0TGFiZWxTdHlsZX0+U3RvY2s8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRWYWx1ZVN0eWxlfT57c3RvY2t9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdENhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0TGFiZWxTdHlsZX0+U0tVPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0VmFsdWVTdHlsZX0+e3NrdX08L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdC1zaG93LXNlY3Rpb25zXCIgc3R5bGU9e3NlY3Rpb25HcmlkU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NvbnRlbnRDYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+RGVzY3JpcHRpb248L2gyPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtkZXNjcmlwdGlvblN0eWxlfT57ZGVzY3JpcHRpb259PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NvbnRlbnRDYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UHJvZHVjdCBEZXRhaWxzPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMiB9fSAvPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0xpc3RTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9MYWJlbFN0eWxlfT5DYXRlZ29yeTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb1ZhbHVlU3R5bGV9PntjYXRlZ29yeX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvTGFiZWxTdHlsZX0+Q3JlYXRlZCBBdDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb1ZhbHVlU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAge2Zvcm1hdERhdGUocGFyYW1zPy5jcmVhdGVkQXQpfVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9MYWJlbFN0eWxlfT5VcGRhdGVkIEF0PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvVmFsdWVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShwYXJhbXM/LnVwZGF0ZWRBdCl9XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PlJlY29yZCBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb1ZhbHVlU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAge3BhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZCB8fCBcIi1cIn1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RTaG93O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgY2VsbFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBtaW5IZWlnaHQ6IFwiNTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2NHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjQycHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZsZXhTaHJpbms6IDAsXHJcbn07XHJcblxyXG5jb25zdCBmYWxsYmFja1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjY0cHhcIixcclxuICBoZWlnaHQ6IFwiNDJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjYpXCIsXHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgY29sb3I6IFwiIzY0NzQ4YlwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZsZXhTaHJpbms6IDAsXHJcbn07XHJcblxyXG5jb25zdCB0ZXh0U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcclxuICBnYXA6IFwiMnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0SW1hZ2UgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCBpbWFnZVVybCA9IHByb3BzPy5yZWNvcmQ/LnBhcmFtcz8uW3Byb3BzPy5wcm9wZXJ0eT8ucGF0aF07XHJcbiAgY29uc3QgW2hhc0Vycm9yLCBzZXRIYXNFcnJvcl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBzZXRIYXNFcnJvcihmYWxzZSk7XHJcbiAgfSwgW2ltYWdlVXJsXSk7XHJcblxyXG4gIGlmICghaW1hZ2VVcmwpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtmYWxsYmFja1N0eWxlfT5ObyBpbWFnZTwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChoYXNFcnJvcikge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBzdHlsZT17Y2VsbFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtmYWxsYmFja1N0eWxlfT5JbnZhbGlkPC9kaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IFwiIzBmMTcyYVwiIH19PkltYWdlIFVSTDwvc3Bhbj5cclxuICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgIGhyZWY9e2ltYWdlVXJsfVxyXG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICBjb2xvcjogXCIjMjU2M2ViXCIsXHJcbiAgICAgICAgICAgICAgdGV4dERlY29yYXRpb246IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgT3BlbiBsaW5rXHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtjZWxsU3R5bGV9PlxyXG4gICAgICA8aW1nXHJcbiAgICAgICAgc3JjPXtpbWFnZVVybH1cclxuICAgICAgICBhbHQ9XCJQcm9kdWN0XCJcclxuICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX1cclxuICAgICAgICBvbkVycm9yPXsoKSA9PiBzZXRIYXNFcnJvcih0cnVlKX1cclxuICAgICAgLz5cclxuICAgICAgPGRpdiBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBcIiMwZjE3MmFcIiB9fT5QcmV2aWV3PC9zcGFuPlxyXG4gICAgICAgIDxhXHJcbiAgICAgICAgICBocmVmPXtpbWFnZVVybH1cclxuICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXHJcbiAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiBcIiMyNTYzZWJcIiwgdGV4dERlY29yYXRpb246IFwibm9uZVwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICBPcGVuIGltYWdlXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0SW1hZ2U7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCB3cmFwcGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG59O1xyXG5cclxuY29uc3QgcHJldmlld1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjE0MHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjk2cHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3QgaGludFN0eWxlID0ge1xyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBjb2xvcjogXCIjNjQ3NDhiXCIsXHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0SW1hZ2VVcGxvYWQgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCB7IG9uQ2hhbmdlLCByZWNvcmQgfSA9IHByb3BzO1xyXG4gIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHJlY29yZD8ucGFyYW1zPy5pbWFnZVVybCB8fCBcIlwiO1xyXG4gIGNvbnN0IGN1cnJlbnRQdWJsaWNJZCA9IHJlY29yZD8ucGFyYW1zPy5pbWFnZVB1YmxpY0lkIHx8IFwiXCI7XHJcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoY3VycmVudFZhbHVlKTtcclxuICBjb25zdCBbcHVibGljSWQsIHNldFB1YmxpY0lkXSA9IHVzZVN0YXRlKGN1cnJlbnRQdWJsaWNJZCk7XHJcbiAgY29uc3QgW3VwbG9hZGluZywgc2V0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgc2V0UHJldmlld1VybChjdXJyZW50VmFsdWUpO1xyXG4gICAgc2V0UHVibGljSWQoY3VycmVudFB1YmxpY0lkKTtcclxuICB9LCBbY3VycmVudFZhbHVlLCBjdXJyZW50UHVibGljSWRdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlVXBsb2FkID0gYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF07XHJcblxyXG4gICAgaWYgKCFmaWxlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSk7XHJcbiAgICBzZXRFcnJvcihcIlwiKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXCJpbWFnZVwiLCBmaWxlKTtcclxuXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvYXBpL3VwbG9hZHMvaW1hZ2VcIiwge1xyXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgYm9keTogZm9ybURhdGEsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZC5tZXNzYWdlIHx8IFwiSW1hZ2UgdXBsb2FkIGZhaWxlZFwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdXBsb2FkZWRVcmwgPSBwYXlsb2FkLnVybCB8fCBcIlwiO1xyXG4gICAgICBjb25zdCB1cGxvYWRlZFB1YmxpY0lkID0gcGF5bG9hZC5wdWJsaWNJZCB8fCBcIlwiO1xyXG4gICAgICBzZXRQcmV2aWV3VXJsKHVwbG9hZGVkVXJsKTtcclxuICAgICAgc2V0UHVibGljSWQodXBsb2FkZWRQdWJsaWNJZCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVVybFwiLCB1cGxvYWRlZFVybCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVB1YmxpY0lkXCIsIHVwbG9hZGVkUHVibGljSWQpO1xyXG4gICAgICBvbkNoYW5nZT8uKFwidXBsb2FkSW1hZ2VcIiwgdXBsb2FkZWRVcmwpO1xyXG4gICAgfSBjYXRjaCAodXBsb2FkRXJyb3IpIHtcclxuICAgICAgc2V0RXJyb3IodXBsb2FkRXJyb3IubWVzc2FnZSk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpO1xyXG4gICAgICBldmVudC50YXJnZXQudmFsdWUgPSBcIlwiO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZVJlbW92ZSA9ICgpID0+IHtcclxuICAgIHNldFByZXZpZXdVcmwoXCJcIik7XHJcbiAgICBzZXRQdWJsaWNJZChcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVVybFwiLCBcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVB1YmxpY0lkXCIsIFwiXCIpO1xyXG4gICAgb25DaGFuZ2U/LihcInVwbG9hZEltYWdlXCIsIFwiXCIpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt3cmFwcGVyU3R5bGV9PlxyXG4gICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e2hhbmRsZVVwbG9hZH0gLz5cclxuICAgICAgPGRpdiBzdHlsZT17aGludFN0eWxlfT5cclxuICAgICAgICB7dXBsb2FkaW5nXHJcbiAgICAgICAgICA/IFwiVXBsb2FkaW5nIHRvIENsb3VkaW5hcnkuLi5cIlxyXG4gICAgICAgICAgOiBcIkNob29zZSBhbiBpbWFnZSBmaWxlIHRvIHVwbG9hZFwifVxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHtwcmV2aWV3VXJsID8gKFxyXG4gICAgICAgIDw+XHJcbiAgICAgICAgICA8aW1nIHNyYz17cHJldmlld1VybH0gYWx0PVwiUHJvZHVjdCBwcmV2aWV3XCIgc3R5bGU9e3ByZXZpZXdTdHlsZX0gLz5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVJlbW92ZX1cclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwiNnB4IDEwcHhcIixcclxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IFwiOHB4XCIsXHJcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjZWY0NDQ0XCIsXHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiI2VmNDQ0NFwiLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiI2ZmZlwiLFxyXG4gICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIFJlbW92ZSBpbWFnZVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC8+XHJcbiAgICAgICkgOiBudWxsfVxyXG5cclxuICAgICAge2Vycm9yID8gKFxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgLi4uaGludFN0eWxlLCBjb2xvcjogXCIjZGMyNjI2XCIgfX0+e2Vycm9yfTwvZGl2PlxyXG4gICAgICApIDogbnVsbH1cclxuXHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImltYWdlVXJsXCIgdmFsdWU9e3ByZXZpZXdVcmx9IHJlYWRPbmx5IC8+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImltYWdlUHVibGljSWRcIiB2YWx1ZT17cHVibGljSWR9IHJlYWRPbmx5IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdEltYWdlVXBsb2FkO1xyXG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi4vYWRtaW4vZGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmRcbmltcG9ydCBQcm9kdWN0Q2FyZHNMaXN0IGZyb20gJy4uL2FkbWluL3Byb2R1Y3QtY2FyZHMtbGlzdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdENhcmRzTGlzdCA9IFByb2R1Y3RDYXJkc0xpc3RcbmltcG9ydCBQcm9kdWN0U2hvdyBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LXNob3cnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RTaG93ID0gUHJvZHVjdFNob3dcbmltcG9ydCBQcm9kdWN0SW1hZ2UgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1pbWFnZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdEltYWdlID0gUHJvZHVjdEltYWdlXG5pbXBvcnQgUHJvZHVjdEltYWdlVXBsb2FkIGZyb20gJy4uL2FkbWluL3Byb2R1Y3QtaW1hZ2UtdXBsb2FkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0SW1hZ2VVcGxvYWQgPSBQcm9kdWN0SW1hZ2VVcGxvYWQiXSwibmFtZXMiOlsiZm9ybWF0Q3VycmVuY3kiLCJ2YWx1ZSIsIk51bWJlciIsInRvTG9jYWxlU3RyaW5nIiwiRGFzaGJvYXJkIiwiZGF0YSIsInNldERhdGEiLCJ1c2VTdGF0ZSIsInVzZXJzIiwiY2F0ZWdvcmllcyIsInByb2R1Y3RzIiwib3JkZXJzIiwicmV2ZW51ZSIsImZlYXR1cmVkR2VtcyIsImNyaXRpY2FsU3RvY2siLCJyZWNlbnRQcm9kdWN0cyIsImNhdGVnb3J5RGlzdHJpYnV0aW9uIiwidXNlRWZmZWN0IiwibG9hZERhc2hib2FyZCIsInJlc3BvbnNlIiwiZmV0Y2giLCJwYXlsb2FkIiwianNvbiIsInRvcENhdGVnb3JpZXMiLCJ1c2VNZW1vIiwiZGlzdHJpYnV0aW9uIiwibWF4IiwiTWF0aCIsIm1hcCIsIml0ZW0iLCJjb3VudCIsIndpZHRoIiwicm91bmQiLCJjb21wbGV0aW9uUmF0ZSIsInRvdGFsIiwiaGVhbHRoeSIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsInN0eWxlIiwibGVuZ3RoIiwiY2F0ZWdvcnkiLCJrZXkiLCJuYW1lIiwibWFyZ2luVG9wIiwicHJvZHVjdCIsImlkIiwiRGF0ZSIsImNyZWF0ZWRBdCIsInRvTG9jYWxlRGF0ZVN0cmluZyIsInByaWNlIiwiZ3JpZFN0eWxlIiwiZGlzcGxheSIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJnYXAiLCJjYXJkU3R5bGUiLCJib3JkZXJSYWRpdXMiLCJib3JkZXIiLCJiYWNrZ3JvdW5kIiwiY29sb3IiLCJvdmVyZmxvdyIsImJveFNoYWRvdyIsImltYWdlV3JhcFN0eWxlIiwiaGVpZ2h0IiwiaW1hZ2VTdHlsZSIsIm9iamVjdEZpdCIsImJvZHlTdHlsZSIsInBhZGRpbmciLCJtZXRhU3R5bGUiLCJmb250U2l6ZSIsImJhZGdlU3R5bGUiLCJpc0FjdGl2ZSIsImZvbnRXZWlnaHQiLCJsZXR0ZXJTcGFjaW5nIiwibGlua1N0eWxlIiwidGV4dERlY29yYXRpb24iLCJjdXJzb3IiLCJlbXB0eVN0eWxlIiwiZm9ybWF0UHJpY2UiLCJhbW91bnQiLCJpc0Zpbml0ZSIsInVuZGVmaW5lZCIsIm1pbmltdW1GcmFjdGlvbkRpZ2l0cyIsIm1heGltdW1GcmFjdGlvbkRpZ2l0cyIsImdldFJlY29yZElkIiwicmVjb3JkIiwicGFyYW1zIiwicGFyYW0iLCJnZXRTaG93SHJlZiIsInJlc291cmNlSWQiLCJyZWNvcmRBY3Rpb25zIiwiYWN0aW9ucyIsInNob3dBY3Rpb24iLCJmaW5kIiwiYWN0aW9uIiwicmF3SHJlZiIsImhyZWYiLCJlbmNvZGVVUklDb21wb25lbnQiLCJQcm9kdWN0Q2FyZHNMaXN0IiwicHJvcHMiLCJhcGlSZWNvcmRzIiwic2V0QXBpUmVjb3JkcyIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwibG9hZEVycm9yIiwic2V0TG9hZEVycm9yIiwicmVzb3VyY2UiLCJwcm9wUmVjb3JkcyIsInJlY29yZHMiLCJpc01vdW50ZWQiLCJsb2FkUmVjb3JkcyIsImNyZWRlbnRpYWxzIiwib2siLCJFcnJvciIsIm1lc3NhZ2UiLCJlcnJvciIsImNhdGVnb3J5SWQiLCJpbWFnZVVybCIsInN0b2NrIiwiQm9vbGVhbiIsImRldGFpbHNIcmVmIiwib3BlbkRldGFpbHMiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImFzc2lnbiIsInNyYyIsImFsdCIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsIm9uQ2xpY2siLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwicGFnZVN0eWxlIiwiaGVyb1N0eWxlIiwicGFuZWxTdHlsZSIsIm1pbkhlaWdodCIsImhlcm9Cb2R5U3R5bGUiLCJ0aXRsZVN0eWxlIiwibWFyZ2luIiwibGluZUhlaWdodCIsInN1YnRpdGxlU3R5bGUiLCJhY3RpdmUiLCJzdGF0c0dyaWRTdHlsZSIsInN0YXRDYXJkU3R5bGUiLCJzdGF0TGFiZWxTdHlsZSIsInRleHRUcmFuc2Zvcm0iLCJtYXJnaW5Cb3R0b20iLCJzdGF0VmFsdWVTdHlsZSIsIndvcmRCcmVhayIsInNlY3Rpb25HcmlkU3R5bGUiLCJzZWN0aW9uVGl0bGVTdHlsZSIsImNvbnRlbnRDYXJkU3R5bGUiLCJpbmZvTGlzdFN0eWxlIiwiaW5mb1Jvd1N0eWxlIiwicGFkZGluZ0JvdHRvbSIsImJvcmRlckJvdHRvbSIsImluZm9MYWJlbFN0eWxlIiwiaW5mb1ZhbHVlU3R5bGUiLCJ0ZXh0QWxpZ24iLCJkZXNjcmlwdGlvblN0eWxlIiwid2hpdGVTcGFjZSIsImZvcm1hdERhdGUiLCJkYXRlIiwiaXNOYU4iLCJnZXRUaW1lIiwiU3RyaW5nIiwiZGF0ZVN0eWxlIiwidGltZVN0eWxlIiwiUHJvZHVjdFNob3ciLCJza3UiLCJkZXNjcmlwdGlvbiIsInVwZGF0ZWRBdCIsImNlbGxTdHlsZSIsImZsZXhTaHJpbmsiLCJmYWxsYmFja1N0eWxlIiwidGV4dFN0eWxlIiwiZmxleERpcmVjdGlvbiIsIlByb2R1Y3RJbWFnZSIsInByb3BlcnR5IiwicGF0aCIsImhhc0Vycm9yIiwic2V0SGFzRXJyb3IiLCJ0YXJnZXQiLCJyZWwiLCJvbkVycm9yIiwid3JhcHBlclN0eWxlIiwicHJldmlld1N0eWxlIiwiaGludFN0eWxlIiwiUHJvZHVjdEltYWdlVXBsb2FkIiwib25DaGFuZ2UiLCJjdXJyZW50VmFsdWUiLCJjdXJyZW50UHVibGljSWQiLCJpbWFnZVB1YmxpY0lkIiwicHJldmlld1VybCIsInNldFByZXZpZXdVcmwiLCJwdWJsaWNJZCIsInNldFB1YmxpY0lkIiwidXBsb2FkaW5nIiwic2V0VXBsb2FkaW5nIiwic2V0RXJyb3IiLCJoYW5kbGVVcGxvYWQiLCJmaWxlIiwiZmlsZXMiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiYXBwZW5kIiwibWV0aG9kIiwiYm9keSIsInVwbG9hZGVkVXJsIiwidXJsIiwidXBsb2FkZWRQdWJsaWNJZCIsInVwbG9hZEVycm9yIiwiaGFuZGxlUmVtb3ZlIiwidHlwZSIsImFjY2VwdCIsIkZyYWdtZW50IiwicmVhZE9ubHkiLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7RUFFQSxNQUFNQSxnQkFBYyxHQUFJQyxLQUFLLElBQUs7SUFDaEMsT0FBTyxDQUFBLEdBQUEsRUFBTUMsTUFBTSxDQUFDRCxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUNFLGNBQWMsRUFBRSxDQUFBLENBQUU7RUFDcEQsQ0FBQztFQUVELE1BQU1DLFNBQVMsR0FBR0EsTUFBTTtFQUN0QixFQUFBLE1BQU0sQ0FBQ0MsSUFBSSxFQUFFQyxPQUFPLENBQUMsR0FBR0MsY0FBUSxDQUFDO0VBQy9CQyxJQUFBQSxLQUFLLEVBQUUsQ0FBQztFQUNSQyxJQUFBQSxVQUFVLEVBQUUsQ0FBQztFQUNiQyxJQUFBQSxRQUFRLEVBQUUsQ0FBQztFQUNYQyxJQUFBQSxNQUFNLEVBQUUsQ0FBQztFQUNUQyxJQUFBQSxPQUFPLEVBQUUsQ0FBQztFQUNWQyxJQUFBQSxZQUFZLEVBQUUsQ0FBQztFQUNmQyxJQUFBQSxhQUFhLEVBQUUsQ0FBQztFQUNoQkMsSUFBQUEsY0FBYyxFQUFFLEVBQUU7RUFDbEJDLElBQUFBLG9CQUFvQixFQUFFO0VBQ3hCLEdBQUMsQ0FBQztFQUVGQyxFQUFBQSxlQUFTLENBQUMsTUFBTTtFQUNkLElBQUEsTUFBTUMsYUFBYSxHQUFHLFlBQVk7RUFDaEMsTUFBQSxNQUFNQyxRQUFRLEdBQUcsTUFBTUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDO0VBQ3BELE1BQUEsTUFBTUMsT0FBTyxHQUFHLE1BQU1GLFFBQVEsQ0FBQ0csSUFBSSxFQUFFO0VBQ3JDaEIsTUFBQUEsT0FBTyxDQUFDZSxPQUFPLElBQUksRUFBRSxDQUFDO01BQ3hCLENBQUM7RUFFREgsSUFBQUEsYUFBYSxFQUFFO0lBQ2pCLENBQUMsRUFBRSxFQUFFLENBQUM7RUFFTixFQUFBLE1BQU1LLGFBQWEsR0FBR0MsYUFBTyxDQUFDLE1BQU07RUFDbEMsSUFBQSxNQUFNQyxZQUFZLEdBQUdwQixJQUFJLENBQUNXLG9CQUFvQixJQUFJLEVBQUU7RUFDcEQsSUFBQSxNQUFNVSxHQUFHLEdBQUdDLElBQUksQ0FBQ0QsR0FBRyxDQUFDLEdBQUdELFlBQVksQ0FBQ0csR0FBRyxDQUFFQyxJQUFJLElBQUtBLElBQUksQ0FBQ0MsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBRWxFLElBQUEsT0FBT0wsWUFBWSxDQUFDRyxHQUFHLENBQUVDLElBQUksS0FBTTtFQUNqQyxNQUFBLEdBQUdBLElBQUk7UUFDUEUsS0FBSyxFQUFFLEdBQUdKLElBQUksQ0FBQ0QsR0FBRyxDQUFDLENBQUMsRUFBRUMsSUFBSSxDQUFDSyxLQUFLLENBQUVILElBQUksQ0FBQ0MsS0FBSyxHQUFHSixHQUFHLEdBQUksR0FBRyxDQUFDLENBQUMsQ0FBQSxDQUFBO0VBQzdELEtBQUMsQ0FBQyxDQUFDO0VBQ0wsRUFBQSxDQUFDLEVBQUUsQ0FBQ3JCLElBQUksQ0FBQ1csb0JBQW9CLENBQUMsQ0FBQztFQUUvQixFQUFBLE1BQU1pQixjQUFjLEdBQUdULGFBQU8sQ0FBQyxNQUFNO01BQ25DLE1BQU1VLEtBQUssR0FBR2hDLE1BQU0sQ0FBQ0csSUFBSSxDQUFDSyxRQUFRLElBQUksQ0FBQyxDQUFDO01BQ3hDLElBQUl3QixLQUFLLEtBQUssQ0FBQyxFQUFFO0VBQ2YsTUFBQSxPQUFPLENBQUM7RUFDVixJQUFBO0VBRUEsSUFBQSxNQUFNQyxPQUFPLEdBQUdSLElBQUksQ0FBQ0QsR0FBRyxDQUFDUSxLQUFLLEdBQUdoQyxNQUFNLENBQUNHLElBQUksQ0FBQ1MsYUFBYSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUNwRSxPQUFPYSxJQUFJLENBQUNLLEtBQUssQ0FBRUcsT0FBTyxHQUFHRCxLQUFLLEdBQUksR0FBRyxDQUFDO0lBQzVDLENBQUMsRUFBRSxDQUFDN0IsSUFBSSxDQUFDSyxRQUFRLEVBQUVMLElBQUksQ0FBQ1MsYUFBYSxDQUFDLENBQUM7SUFFdkMsb0JBQ0VzQixzQkFBQSxDQUFBQyxhQUFBLENBQUEsS0FBQSxFQUFBO0VBQUtDLElBQUFBLFNBQVMsRUFBQztLQUFtQixlQUNoQ0Ysc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLE9BQUEsRUFBQSxJQUFBLEVBQ0c7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FB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
