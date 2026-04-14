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
  AdminJS.UserComponents.Register = Register;
  AdminJS.UserComponents.ProductCardsList = ProductCardsList;
  AdminJS.UserComponents.ProductShow = ProductShow;
  AdminJS.UserComponents.OrderCreate = OrderCreate;
  AdminJS.UserComponents.OrderShow = OrderShow;
  AdminJS.UserComponents.OrderItemShow = OrderItemShow;
  AdminJS.UserComponents.ProductImage = ProductImage;
  AdminJS.UserComponents.ProductImageUpload = ProductImageUpload;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9hZG1pbi9kYXNoYm9hcmQuanN4IiwiLi4vYWRtaW4vcmVnaXN0ZXIuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1jYXJkcy1saXN0LmpzeCIsIi4uL2FkbWluL3Byb2R1Y3Qtc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1jcmVhdGUuanN4IiwiLi4vYWRtaW4vb3JkZXItc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1pdGVtLXNob3cuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS5qc3giLCIuLi9hZG1pbi9wcm9kdWN0LWltYWdlLXVwbG9hZC5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgZm9ybWF0Q3VycmVuY3kgPSAodmFsdWUpID0+IHtcclxuICByZXR1cm4gYFJzLiR7TnVtYmVyKHZhbHVlIHx8IDApLnRvTG9jYWxlU3RyaW5nKCl9YDtcclxufTtcclxuXHJcbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcclxuICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZSh7XHJcbiAgICB1c2VyczogMCxcclxuICAgIGNhdGVnb3JpZXM6IDAsXHJcbiAgICBwcm9kdWN0czogMCxcclxuICAgIG9yZGVyczogMCxcclxuICAgIHJldmVudWU6IDAsXHJcbiAgICBmZWF0dXJlZEdlbXM6IDAsXHJcbiAgICBjcml0aWNhbFN0b2NrOiAwLFxyXG4gICAgcmVjZW50UHJvZHVjdHM6IFtdLFxyXG4gICAgY2F0ZWdvcnlEaXN0cmlidXRpb246IFtdLFxyXG4gIH0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgbG9hZERhc2hib2FyZCA9IGFzeW5jICgpID0+IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hZG1pbi9hcGkvZGFzaGJvYXJkXCIpO1xyXG4gICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBzZXREYXRhKHBheWxvYWQgfHwge30pO1xyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkRGFzaGJvYXJkKCk7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCB0b3BDYXRlZ29yaWVzID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBkYXRhLmNhdGVnb3J5RGlzdHJpYnV0aW9uIHx8IFtdO1xyXG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZGlzdHJpYnV0aW9uLm1hcCgoaXRlbSkgPT4gaXRlbS5jb3VudCksIDEpO1xyXG5cclxuICAgIHJldHVybiBkaXN0cmlidXRpb24ubWFwKChpdGVtKSA9PiAoe1xyXG4gICAgICAuLi5pdGVtLFxyXG4gICAgICB3aWR0aDogYCR7TWF0aC5tYXgoOCwgTWF0aC5yb3VuZCgoaXRlbS5jb3VudCAvIG1heCkgKiAxMDApKX0lYCxcclxuICAgIH0pKTtcclxuICB9LCBbZGF0YS5jYXRlZ29yeURpc3RyaWJ1dGlvbl0pO1xyXG5cclxuICBjb25zdCBjb21wbGV0aW9uUmF0ZSA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3QgdG90YWwgPSBOdW1iZXIoZGF0YS5wcm9kdWN0cyB8fCAwKTtcclxuICAgIGlmICh0b3RhbCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBoZWFsdGh5ID0gTWF0aC5tYXgodG90YWwgLSBOdW1iZXIoZGF0YS5jcml0aWNhbFN0b2NrIHx8IDApLCAwKTtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKChoZWFsdGh5IC8gdG90YWwpICogMTAwKTtcclxuICB9LCBbZGF0YS5wcm9kdWN0cywgZGF0YS5jcml0aWNhbFN0b2NrXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtZGFzaGJvYXJkXCI+XHJcbiAgICAgIDxzdHlsZT5cclxuICAgICAgICB7YFxyXG4gICAgICAgICAgLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgICAgLS1iZy0xOiB2YXIoLS1jaGFuZ2U4LWJnLTEsICMwNTA5MTQpO1xyXG4gICAgICAgICAgICAtLWJnLTI6IHZhcigtLWNoYW5nZTgtYmctMiwgIzBiMWEzOCk7XHJcbiAgICAgICAgICAgIC0tYmctMzogdmFyKC0tY2hhbmdlOC1iZy0zLCAjMTIxZjNhKTtcclxuICAgICAgICAgICAgLS1nb2xkOiB2YXIoLS1jaGFuZ2U4LWdvbGQsICNlMmJmNjYpO1xyXG4gICAgICAgICAgICAtLXRleHQtbWFpbjogdmFyKC0tY2hhbmdlOC10ZXh0LW1haW4sICNmOGZhZmMpO1xyXG4gICAgICAgICAgICAtLXRleHQtbXV0ZWQ6IHZhcigtLWNoYW5nZTgtdGV4dC1tdXRlZCwgIzlhYThjMSk7XHJcbiAgICAgICAgICAgIC0tbGluZTogdmFyKC0tY2hhbmdlOC1saW5lLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMjIpKTtcclxuICAgICAgICAgICAgLS1jYXJkLWJnOiB2YXIoLS1jaGFuZ2U4LWNhcmQtYmcsIGxpbmVhci1ncmFkaWVudCgxNjBkZWcsIHJnYmEoMjEsIDM0LCA2NiwgMC45NSkgMCUsIHJnYmEoMTAsIDE4LCAzNiwgMC45NSkgMTAwJSkpO1xyXG4gICAgICAgICAgICAtLWdyYWQtZW5kOiB2YXIoLS1jaGFuZ2U4LWdyYWQtZW5kLCAjMDQwNzBmKTtcclxuICAgICAgICAgICAgLS1zaGFkb3c6IHZhcigtLWNoYW5nZTgtc2hhZG93LCAwIDhweCAyNnB4IHJnYmEoMCwgMCwgMCwgMC4zKSk7XHJcbiAgICAgICAgICAgIC0tcmFkaWFsLTE6IHZhcigtLWNoYW5nZTgtcmFkaWFsLTEsIHJnYmEoMzQsIDkzLCAxODAsIDAuMzUpKTtcclxuICAgICAgICAgICAgLS1yYWRpYWwtMjogdmFyKC0tY2hhbmdlOC1yYWRpYWwtMiwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjE2KSk7XHJcblxyXG4gICAgICAgICAgICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICAgICAgICAgICAgcGFkZGluZzogMzBweDtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbWFpbik7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6XHJcbiAgICAgICAgICAgICAgcmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCA4JSAwJSwgdmFyKC0tcmFkaWFsLTEpIDAlLCByZ2JhKDM0LCA5MywgMTgwLCAwKSAzOCUpLFxyXG4gICAgICAgICAgICAgIHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgODUlIDEyJSwgdmFyKC0tcmFkaWFsLTIpIDAlLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDApIDQyJSksXHJcbiAgICAgICAgICAgICAgbGluZWFyLWdyYWRpZW50KDEyMGRlZywgdmFyKC0tYmctMSkgMCUsIHZhcigtLWJnLTIpIDQ4JSwgdmFyKC0tZ3JhZC1lbmQpIDEwMCUpO1xyXG4gICAgICAgICAgICBmb250LWZhbWlseTogXCJQb3BwaW5zXCIsIFwiU2Vnb2UgVUlcIiwgc2Fucy1zZXJpZjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LWJnLTE6ICNmMGY2ZmY7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC1iZy0yOiAjZmZmZmZmO1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtYmctMzogI2VlZjVmZjtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LWdvbGQ6ICNjMDhiMGY7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC10ZXh0LW1haW46ICMwZjE3MmE7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC10ZXh0LW11dGVkOiAjNDc1NTY5O1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtbGluZTogcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LWNhcmQtYmc6ICNmZmZmZmY7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC1ncmFkLWVuZDogI2Y4ZmJmZjtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LXNoYWRvdzogMCA0cHggMjBweCByZ2JhKDE1LCAyMywgNDIsIDAuMDYpO1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtcmFkaWFsLTE6IHJnYmEoMzQsIDkzLCAxODAsIDAuMDgpO1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtcmFkaWFsLTI6IHJnYmEoMTkyLCAxMzksIDE1LCAwLjA1KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1oZWFkZXIge1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgICAgICAgICBhbmltYXRpb246IGZhZGUtdXAgNTIwbXMgZWFzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1raWNrZXIge1xyXG4gICAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4zNmVtO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC10aXRsZSB7XHJcbiAgICAgICAgICAgIG1hcmdpbjogOHB4IDAgNnB4O1xyXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMS4wNjtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgzMnB4LCA1dncsIDU2cHgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXN1YnRpdGxlIHtcclxuICAgICAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1tZXRyaWMtZ3JpZCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDQsIG1pbm1heCgxNzBweCwgMWZyKSk7XHJcbiAgICAgICAgICAgIGdhcDogMTRweDtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogMThweDtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkIHtcclxuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDE2cHggMThweDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tY2FyZC1iZyk7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IHZhcigtLXNoYWRvdyk7XHJcbiAgICAgICAgICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xyXG4gICAgICAgICAgICBhbmltYXRpb246IGZhZGUtdXAgNTYwbXMgZWFzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkLWxhYmVsIHtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xOGVtO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkLXZhbHVlIHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgzNHB4LCA0dncsIDUycHgpO1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkLWhpbnQge1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogOHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWxheW91dCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogbWlubWF4KDMwMHB4LCAxLjhmcikgbWlubWF4KDI2MHB4LCAxZnIpO1xyXG4gICAgICAgICAgICBnYXA6IDE2cHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZ3Jlc3Mtd3JhcCB7XHJcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZ3Jlc3MtaGVhZCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1wcm9ncmVzcy10cmFjayB7XHJcbiAgICAgICAgICAgIGhlaWdodDogMTBweDtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xMik7XHJcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jaGFuZ2U4LXByb2dyZXNzLXRyYWNrIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNSwgMjMsIDQyLCAwLjEyKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1wcm9ncmVzcy1maWxsIHtcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLCAjZjVkZjkwIDAlLCAjZTJiZjY2IDEwMCUpO1xyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCAzMjBtcyBlYXNlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXJlY2VudC1saXN0IHtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogNnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXJlY2VudC1pdGVtIHtcclxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4IDA7XHJcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jaGFuZ2U4LXJlY2VudC1pdGVtIHtcclxuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4xMik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcmVjZW50LWl0ZW06bGFzdC1jaGlsZCB7XHJcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbmFtZSB7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1kYXRlIHtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJpY2Uge1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBAa2V5ZnJhbWVzIGZhZGUtdXAge1xyXG4gICAgICAgICAgICBmcm9tIHtcclxuICAgICAgICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg4cHgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRvIHtcclxuICAgICAgICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAxMTgwcHgpIHtcclxuICAgICAgICAgICAgLmNoYW5nZTgtbWV0cmljLWdyaWQge1xyXG4gICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgxODBweCwgMWZyKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LWxheW91dCB7XHJcbiAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNzIwcHgpIHtcclxuICAgICAgICAgICAgLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgICAgICBwYWRkaW5nOiAyMHB4IDE2cHg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LW1ldHJpYy1ncmlkIHtcclxuICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGB9XHJcbiAgICAgIDwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtaGVhZGVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWtpY2tlclwiPlNlY3Rpb24gVmlldzwvZGl2PlxyXG4gICAgICAgIDxoMSBjbGFzc05hbWU9XCJjaGFuZ2U4LXRpdGxlXCI+RGFzaGJvYXJkPC9oMT5cclxuICAgICAgICA8cCBjbGFzc05hbWU9XCJjaGFuZ2U4LXN1YnRpdGxlXCI+XHJcbiAgICAgICAgICBUcmFjayB5b3VyIGNvbW1lcmNlIGhlYWx0aCBhdCBhIGdsYW5jZSB3aXRoIGxpdmUgaW52ZW50b3J5IGFuZCBvcmRlclxyXG4gICAgICAgICAgc2lnbmFscy5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW1ldHJpYy1ncmlkXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+UmV2ZW51ZSBTdHJlYW08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+XHJcbiAgICAgICAgICAgIHtmb3JtYXRDdXJyZW5jeShkYXRhLnJldmVudWUpfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+QWNyb3NzIGFsbCBvcmRlcnM8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+SW52ZW50b3J5IFNpemU8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+e2RhdGEucHJvZHVjdHMgfHwgMH08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5Ub3RhbCBhY3RpdmUgY2F0YWxvZyBpdGVtczwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5GZWF0dXJlZCBHZW1zPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC12YWx1ZVwiPntkYXRhLmZlYXR1cmVkR2VtcyB8fCAwfTwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPkN1cnJlbnRseSB2aXNpYmxlIHByb2R1Y3RzPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPkNyaXRpY2FsIFN0b2NrPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC12YWx1ZVwiPntkYXRhLmNyaXRpY2FsU3RvY2sgfHwgMH08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5JdGVtcyBuZWVkaW5nIHVyZ2VudCByZWZpbGw8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbGF5b3V0XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+Q2F0ZWdvcnkgRGlzdHJpYnV0aW9uPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+SW52ZW50b3J5IHNwbGl0IGJ5IHNlZ21lbnQ8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3Mtd3JhcFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtaGVhZFwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuPkhlYWx0aHkgc3RvY2sgbGV2ZWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Y29tcGxldGlvblJhdGV9JTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLXRyYWNrXCI+XHJcbiAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9ncmVzcy1maWxsXCJcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBgJHtjb21wbGV0aW9uUmF0ZX0lYCB9fVxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgeyh0b3BDYXRlZ29yaWVzIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5ObyBjYXRlZ29yeSBkYXRhIHlldC48L2Rpdj5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICh0b3BDYXRlZ29yaWVzIHx8IFtdKS5tYXAoKGNhdGVnb3J5KSA9PiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e2NhdGVnb3J5Lm5hbWV9IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3Mtd3JhcFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWhlYWRcIj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4+e2NhdGVnb3J5Lm5hbWV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPntjYXRlZ29yeS5jb3VudH08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLXRyYWNrXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWZpbGxcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBjYXRlZ29yeS53aWR0aCB9fVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5SZWNlbnQgQWRkaXRpb25zPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+XHJcbiAgICAgICAgICAgIExhdGVzdCBwcm9kdWN0cyBlbnRlcmluZyB0aGUgY2F0YWxvZ1xyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgeyhkYXRhLnJlY2VudFByb2R1Y3RzIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIiBzdHlsZT17eyBtYXJnaW5Ub3A6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgIE5vIHByb2R1Y3RzIGFkZGVkIHlldC5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcmVjZW50LWxpc3RcIj5cclxuICAgICAgICAgICAgICB7KGRhdGEucmVjZW50UHJvZHVjdHMgfHwgW10pLm1hcCgocHJvZHVjdCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXJlY2VudC1pdGVtXCIga2V5PXtwcm9kdWN0LmlkfT5cclxuICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbmFtZVwiPntwcm9kdWN0Lm5hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWRhdGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIHtuZXcgRGF0ZShwcm9kdWN0LmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJpY2VcIj5cclxuICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0Q3VycmVuY3kocHJvZHVjdC5wcmljZSl9XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGFzaGJvYXJkO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgUmVnaXN0ZXIgPSAoKSA9PiB7XHJcbiAgY29uc3QgW2Zvcm1TdGF0ZSwgc2V0Rm9ybVN0YXRlXSA9IHVzZVN0YXRlKHtcclxuICAgIG5hbWU6IFwiXCIsXHJcbiAgICBlbWFpbDogXCJcIixcclxuICAgIHBhc3N3b3JkOiBcIlwiLFxyXG4gIH0pO1xyXG4gIGNvbnN0IFttZXNzYWdlLCBzZXRNZXNzYWdlXSA9IHVzZVN0YXRlKHsgdHlwZTogXCJcIiwgdGV4dDogXCJcIiB9KTtcclxuICBjb25zdCBbaXNTdWJtaXR0aW5nLCBzZXRJc1N1Ym1pdHRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5tYXJnaW4gPSBcIjBcIjtcclxuICB9LCBbXSk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZUNoYW5nZSA9IChldmVudCkgPT4ge1xyXG4gICAgc2V0Rm9ybVN0YXRlKChjdXJyZW50KSA9PiAoe1xyXG4gICAgICAuLi5jdXJyZW50LFxyXG4gICAgICBbZXZlbnQudGFyZ2V0Lm5hbWVdOiBldmVudC50YXJnZXQudmFsdWUsXHJcbiAgICB9KSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlU3VibWl0ID0gYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgc2V0TWVzc2FnZSh7IHR5cGU6IFwiXCIsIHRleHQ6IFwiXCIgfSk7XHJcbiAgICBzZXRJc1N1Ym1pdHRpbmcodHJ1ZSk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hcGkvcmVnaXN0ZXJcIiwge1xyXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShmb3JtU3RhdGUpLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGEubWVzc2FnZSB8fCBcIlJlZ2lzdHJhdGlvbiBmYWlsZWRcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNldE1lc3NhZ2Uoe1xyXG4gICAgICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgIHRleHQ6IFwiQWNjb3VudCBjcmVhdGVkIHN1Y2Nlc3NmdWxseSEgUmVkaXJlY3RpbmcuLi5cIixcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2FkbWluL2xvZ2luXCI7XHJcbiAgICAgIH0sIDIwMDApO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgc2V0TWVzc2FnZSh7IHR5cGU6IFwiZXJyb3JcIiwgdGV4dDogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgICAgc2V0SXNTdWJtaXR0aW5nKGZhbHNlKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyZWdpc3Rlci1wYWdlXCI+XHJcbiAgICAgIDxzdHlsZT57YFxyXG4gICAgICAgIC5yZWdpc3Rlci1wYWdlIHtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICAgIHBhZGRpbmc6IDI0cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOlxyXG4gICAgICAgICAgICBsaW5lYXItZ3JhZGllbnQocmdiYSgxNSwgMjMsIDQyLCAwLjM1KSwgcmdiYSgxNSwgMjMsIDQyLCAwLjM1KSksXHJcbiAgICAgICAgICAgIHVybCgnL3B1YmxpYy9pbWcyLmpwZycpIGNlbnRlciAvIGNvdmVyIGZpeGVkO1xyXG4gICAgICAgICAgZm9udC1mYW1pbHk6IFwiUGx1cyBKYWthcnRhIFNhbnNcIiwgXCJTZWdvZSBVSVwiLCBzYW5zLXNlcmlmO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWNhcmQge1xyXG4gICAgICAgICAgd2lkdGg6IG1pbigxMDAlLCA1MjBweCk7XHJcbiAgICAgICAgICBwYWRkaW5nOiA2MHB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMjhweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMTUsIDIzLCA0MiwgMC44Mik7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDUwcHggMTAwcHggLTIwcHggcmdiYSgwLCAwLCAwLCAwLjgpO1xyXG4gICAgICAgICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDMwcHgpO1xyXG4gICAgICAgICAgY29sb3I6ICNmZmY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbG9nbyB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAtMC4wMWVtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWxvZ28gc3BhbiB7XHJcbiAgICAgICAgICBjb2xvcjogIzYzNjZmMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1maWVsZCB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWxhYmVsIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xZW07XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1pbnB1dCB7XHJcbiAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgIHBhZGRpbmc6IDE0cHggMThweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpO1xyXG4gICAgICAgICAgY29sb3I6ICNmZmY7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICAgICAgICBvdXRsaW5lOiBub25lO1xyXG4gICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1pbnB1dDpmb2N1cyB7XHJcbiAgICAgICAgICBib3JkZXItY29sb3I6ICM2MzY2ZjE7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDgpO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCAwIDAgNHB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWJ1dHRvbiB7XHJcbiAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxNnB4O1xyXG4gICAgICAgICAgYm9yZGVyOiBub25lO1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICM2MzY2ZjEsICNhODU1ZjcpO1xyXG4gICAgICAgICAgY29sb3I6ICNmZmY7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDI1cHggLTVweCByZ2JhKDk5LCAxMDIsIDI0MSwgMC40KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1idXR0b246ZGlzYWJsZWQge1xyXG4gICAgICAgICAgb3BhY2l0eTogMC42O1xyXG4gICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1tZXNzYWdlIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxMnB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTNweDtcclxuICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbWVzc2FnZS5pcy12aXNpYmxlIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLW1lc3NhZ2UuZXJyb3Ige1xyXG4gICAgICAgICAgY29sb3I6ICNmODcxNzE7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDIzOSwgNjgsIDY4LCAwLjEpO1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyMzksIDY4LCA2OCwgMC4yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1tZXNzYWdlLnN1Y2Nlc3Mge1xyXG4gICAgICAgICAgY29sb3I6ICM0YWRlODA7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDM0LCAxOTcsIDk0LCAwLjEpO1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgzNCwgMTk3LCA5NCwgMC4yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1mb290ZXIge1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMjVweDtcclxuICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItZm9vdGVyIGEge1xyXG4gICAgICAgICAgY29sb3I6ICM2MzY2ZjE7XHJcbiAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWZvb3RlciBhOmhvdmVyIHtcclxuICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDg1MHB4KSB7XHJcbiAgICAgICAgICAucmVnaXN0ZXItY2FyZCB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDQwcHg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBgfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLWNhcmRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLWxvZ29cIj5SZWdpc3RlciBvdXIgc2l0ZTwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2ByZWdpc3Rlci1tZXNzYWdlICR7bWVzc2FnZS50eXBlfSAke1xyXG4gICAgICAgICAgICBtZXNzYWdlLnRleHQgPyBcImlzLXZpc2libGVcIiA6IFwiXCJcclxuICAgICAgICAgIH1gfVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHttZXNzYWdlLnRleHR9XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxmb3JtIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWdpc3Rlci1maWVsZFwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwicmVnaXN0ZXItbGFiZWxcIiBodG1sRm9yPVwibmFtZVwiPlxyXG4gICAgICAgICAgICAgIEZ1bGwgTmFtZVxyXG4gICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyZWdpc3Rlci1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgICAgIGlkPVwibmFtZVwiXHJcbiAgICAgICAgICAgICAgbmFtZT1cIm5hbWVcIlxyXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRW50ZXIgeW91ciBmdWxsIG5hbWVcIlxyXG4gICAgICAgICAgICAgIHZhbHVlPXtmb3JtU3RhdGUubmFtZX1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxyXG4gICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLWZpZWxkXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJyZWdpc3Rlci1sYWJlbFwiIGh0bWxGb3I9XCJlbWFpbFwiPlxyXG4gICAgICAgICAgICAgIEVtYWlsIEFkZHJlc3NcclxuICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmVnaXN0ZXItaW5wdXRcIlxyXG4gICAgICAgICAgICAgIHR5cGU9XCJlbWFpbFwiXHJcbiAgICAgICAgICAgICAgaWQ9XCJlbWFpbFwiXHJcbiAgICAgICAgICAgICAgbmFtZT1cImVtYWlsXCJcclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImV4YW1wbGVAZW1haWwuY29tXCJcclxuICAgICAgICAgICAgICB2YWx1ZT17Zm9ybVN0YXRlLmVtYWlsfVxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XHJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItZmllbGRcIj5cclxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWxhYmVsXCIgaHRtbEZvcj1cInBhc3N3b3JkXCI+XHJcbiAgICAgICAgICAgICAgUGFzc3dvcmRcclxuICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmVnaXN0ZXItaW5wdXRcIlxyXG4gICAgICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXHJcbiAgICAgICAgICAgICAgaWQ9XCJwYXNzd29yZFwiXHJcbiAgICAgICAgICAgICAgbmFtZT1cInBhc3N3b3JkXCJcclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkF0IGxlYXN0IDYgY2hhcmFjdGVyc1wiXHJcbiAgICAgICAgICAgICAgbWluTGVuZ3RoPXs2fVxyXG4gICAgICAgICAgICAgIHZhbHVlPXtmb3JtU3RhdGUucGFzc3dvcmR9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cclxuICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJyZWdpc3Rlci1idXR0b25cIlxyXG4gICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcclxuICAgICAgICAgICAgZGlzYWJsZWQ9e2lzU3VibWl0dGluZ31cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge2lzU3VibWl0dGluZyA/IFwiQ3JlYXRpbmcgYWNjb3VudC4uLlwiIDogXCJDcmVhdGUgQWNjb3VudFwifVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9mb3JtPlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLWZvb3RlclwiPlxyXG4gICAgICAgICAgQWxyZWFkeSBoYXZlIGFuIGFjY291bnQ/IDxhIGhyZWY9XCIvYWRtaW4vbG9naW5cIj5Mb2cgaW48L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdGVyO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgZ3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwicmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDI0MHB4LCAxZnIpKVwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBjYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE2cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yOClcIixcclxuICBiYWNrZ3JvdW5kOiBcImxpbmVhci1ncmFkaWVudCgxNjBkZWcsICMwYjFhMzggMCUsICMwOTE2MmYgMTAwJSlcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTJweCAyMnB4IHJnYmEoMiwgNiwgMjMsIDAuMjUpXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVdyYXBTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjIwMHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjMGYxNzJhXCIsXHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBwYWRkaW5nOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICBvYmplY3RGaXQ6IFwiY29udGFpblwiLFxyXG59O1xyXG5cclxuY29uc3QgYm9keVN0eWxlID0ge1xyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IG1ldGFTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjFmciAxZnJcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGJhZGdlU3R5bGUgPSAoaXNBY3RpdmUpID0+ICh7XHJcbiAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4wNWVtXCIsXHJcbiAgcGFkZGluZzogXCI1cHggMTBweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gIGNvbG9yOiBpc0FjdGl2ZSA/IFwiIzE0NTMyZFwiIDogXCIjN2YxZDFkXCIsXHJcbiAgYmFja2dyb3VuZDogaXNBY3RpdmUgPyBcIiNiYmY3ZDBcIiA6IFwiI2ZlY2FjYVwiLFxyXG59KTtcclxuXHJcbmNvbnN0IGxpbmtTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImlubGluZS1ibG9ja1wiLFxyXG4gIG1hcmdpblRvcDogXCI0cHhcIixcclxuICBjb2xvcjogXCIjOTNjNWZkXCIsXHJcbiAgdGV4dERlY29yYXRpb246IFwibm9uZVwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IGVtcHR5U3R5bGUgPSB7XHJcbiAgcGFkZGluZzogXCIxOHB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IFwiMXB4IGRhc2hlZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuNDUpXCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0UHJpY2UgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBhbW91bnQgPSBOdW1iZXIodmFsdWUgfHwgMCk7XHJcbiAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoYW1vdW50KSkge1xyXG4gICAgcmV0dXJuIFwiMC4wMFwiO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFtb3VudC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IGdldFJlY29yZElkID0gKHJlY29yZCkgPT4ge1xyXG4gIHJldHVybiByZWNvcmQ/LnBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZCB8fCByZWNvcmQ/LnBhcmFtPy5pZCB8fCBcIlwiO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0U2hvd0hyZWYgPSAocmVjb3JkLCByZXNvdXJjZUlkKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkQWN0aW9ucyA9IHJlY29yZD8ucmVjb3JkQWN0aW9ucyB8fCByZWNvcmQ/LmFjdGlvbnMgfHwgW107XHJcbiAgY29uc3Qgc2hvd0FjdGlvbiA9IHJlY29yZEFjdGlvbnMuZmluZCgoYWN0aW9uKSA9PiBhY3Rpb24/Lm5hbWUgPT09IFwic2hvd1wiKTtcclxuICBjb25zdCByYXdIcmVmID0gc2hvd0FjdGlvbj8uaHJlZiB8fCByZWNvcmQ/LmhyZWYgfHwgXCJcIjtcclxuXHJcbiAgaWYgKHJhd0hyZWYpIHtcclxuICAgIHJldHVybiByYXdIcmVmO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgaWQgPSBnZXRSZWNvcmRJZChyZWNvcmQpO1xyXG4gIHJldHVybiBpZFxyXG4gICAgPyBgL2FkbWluL3Jlc291cmNlcy8ke2VuY29kZVVSSUNvbXBvbmVudChyZXNvdXJjZUlkKX0vcmVjb3Jkcy8ke2VuY29kZVVSSUNvbXBvbmVudChpZCl9L3Nob3dgXHJcbiAgICA6IFwiXCI7XHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0Q2FyZHNMaXN0ID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgW2FwaVJlY29yZHMsIHNldEFwaVJlY29yZHNdID0gdXNlU3RhdGUoW10pO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbbG9hZEVycm9yLCBzZXRMb2FkRXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIGNvbnN0IHJlc291cmNlSWQgPVxyXG4gICAgcHJvcHM/LnJlc291cmNlPy5pZCA9PT0gXCJQcm9kdWN0XCJcclxuICAgICAgPyBcIlByb2R1Y3RzXCJcclxuICAgICAgOiBwcm9wcz8ucmVzb3VyY2U/LmlkIHx8IFwiUHJvZHVjdHNcIjtcclxuICBjb25zdCBwcm9wUmVjb3JkcyA9IHByb3BzPy5yZWNvcmRzIHx8IFtdO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHByb3BSZWNvcmRzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGlzTW91bnRlZCA9IHRydWU7XHJcblxyXG4gICAgY29uc3QgbG9hZFJlY29yZHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHNldExvYWRpbmcodHJ1ZSk7XHJcbiAgICAgIHNldExvYWRFcnJvcihcIlwiKTtcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgICAgIGAvYWRtaW4vYXBpL3Jlc291cmNlcy8ke2VuY29kZVVSSUNvbXBvbmVudChyZXNvdXJjZUlkKX0vYWN0aW9ucy9saXN0YCxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBheWxvYWQ/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gbG9hZCBwcm9kdWN0c1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldEFwaVJlY29yZHMocGF5bG9hZD8ucmVjb3JkcyB8fCBbXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldExvYWRFcnJvcihlcnJvcj8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIHByb2R1Y3RzXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBpZiAoaXNNb3VudGVkKSB7XHJcbiAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbG9hZFJlY29yZHMoKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBpc01vdW50ZWQgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgfSwgW3Byb3BSZWNvcmRzLmxlbmd0aCwgcmVzb3VyY2VJZF0pO1xyXG5cclxuICBjb25zdCByZWNvcmRzID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICByZXR1cm4gcHJvcFJlY29yZHMubGVuZ3RoID8gcHJvcFJlY29yZHMgOiBhcGlSZWNvcmRzO1xyXG4gIH0sIFtwcm9wUmVjb3JkcywgYXBpUmVjb3Jkc10pO1xyXG5cclxuICBpZiAobG9hZGluZykge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9PkxvYWRpbmcgcHJvZHVjdHMuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAobG9hZEVycm9yKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+e2xvYWRFcnJvcn08L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoIXJlY29yZHMubGVuZ3RoKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+Tm8gcHJvZHVjdHMgZm91bmQuPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e2dyaWRTdHlsZX0+XHJcbiAgICAgIHtyZWNvcmRzLm1hcCgocmVjb3JkKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge307XHJcbiAgICAgICAgY29uc3QgaWQgPSBnZXRSZWNvcmRJZChyZWNvcmQpO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBwYXJhbXM/Lm5hbWUgfHwgXCJVbm5hbWVkIHByb2R1Y3RcIjtcclxuICAgICAgICBjb25zdCBjYXRlZ29yeSA9IHBhcmFtcz8uY2F0ZWdvcnlJZCB8fCBcIi1cIjtcclxuICAgICAgICBjb25zdCBpbWFnZVVybCA9IHBhcmFtcz8uaW1hZ2VVcmwgfHwgXCJcIjtcclxuICAgICAgICBjb25zdCBzdG9jayA9IE51bWJlcihwYXJhbXM/LnN0b2NrIHx8IDApO1xyXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gQm9vbGVhbihwYXJhbXM/LmlzQWN0aXZlKTtcclxuICAgICAgICBjb25zdCBkZXRhaWxzSHJlZiA9IGdldFNob3dIcmVmKHJlY29yZCwgcmVzb3VyY2VJZCk7XHJcbiAgICAgICAgY29uc3Qgb3BlbkRldGFpbHMgPSAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZGV0YWlsc0hyZWYpIHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihkZXRhaWxzSHJlZik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgIDxhcnRpY2xlIGtleT17aWR9IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbWFnZVdyYXBTdHlsZX0+XHJcbiAgICAgICAgICAgICAge2ltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICAgICAgPGltZyBzcmM9e2ltYWdlVXJsfSBhbHQ9e25hbWV9IHN0eWxlPXtpbWFnZVN0eWxlfSAvPlxyXG4gICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIE5vIGltYWdlXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2JvZHlTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogXCIxOHB4XCIsIGZvbnRXZWlnaHQ6IDcwMCB9fT57bmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXttZXRhU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5DYXRlZ29yeToge2NhdGVnb3J5fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5TdG9jazoge3N0b2NrfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5QcmljZTogUnMuIHtmb3JtYXRQcmljZShwYXJhbXM/LnByaWNlKX08L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17YmFkZ2VTdHlsZShpc0FjdGl2ZSl9PlxyXG4gICAgICAgICAgICAgICAge2lzQWN0aXZlID8gXCJBQ1RJVkVcIiA6IFwiSU5BQ1RJVkVcIn1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgIGhyZWY9e2RldGFpbHNIcmVmIHx8IFwiI1wifVxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e2xpbmtTdHlsZX1cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICBvcGVuRGV0YWlscygpO1xyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgIGFyaWEtZGlzYWJsZWQ9eyFkZXRhaWxzSHJlZn1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICBWaWV3IGRldGFpbHNcclxuICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RDYXJkc0xpc3Q7XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHBhZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMThweFwiLFxyXG4gIGNvbG9yOiBcIiNlMmU4ZjBcIixcclxufTtcclxuXHJcbmNvbnN0IGhlcm9TdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgyODBweCwgMzYwcHgpIDFmclwiLFxyXG4gIGdhcDogXCIxOHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJzdHJldGNoXCIsXHJcbn07XHJcblxyXG5jb25zdCBwYW5lbFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIyMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTgpXCIsXHJcbiAgYmFja2dyb3VuZDpcclxuICAgIFwibGluZWFyLWdyYWRpZW50KDE2MGRlZywgcmdiYSgxMSwgMjYsIDU2LCAwLjk2KSAwJSwgcmdiYSg5LCAyMiwgNDcsIDAuOTYpIDEwMCUpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMjBweCA0MHB4IHJnYmEoMiwgNiwgMjMsIDAuMjQpXCIsXHJcbiAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVdyYXBTdHlsZSA9IHtcclxuICBtaW5IZWlnaHQ6IFwiMzYwcHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgZGlzcGxheTogXCJibG9ja1wiLFxyXG59O1xyXG5cclxuY29uc3QgaGVyb0JvZHlTdHlsZSA9IHtcclxuICBwYWRkaW5nOiBcIjIycHhcIixcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgdGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgZm9udFNpemU6IFwiY2xhbXAoMjhweCwgNHZ3LCA0NnB4KVwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuMDUsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3Qgc3VidGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGJhZGdlU3R5bGUgPSAoYWN0aXZlKSA9PiAoe1xyXG4gIGRpc3BsYXk6IFwiaW5saW5lLWZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIHdpZHRoOiBcImZpdC1jb250ZW50XCIsXHJcbiAgcGFkZGluZzogXCI2cHggMTJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjA4ZW1cIixcclxuICBjb2xvcjogYWN0aXZlID8gXCIjMTQ1MzJkXCIgOiBcIiM3ZjFkMWRcIixcclxuICBiYWNrZ3JvdW5kOiBhY3RpdmUgPyBcIiNiYmY3ZDBcIiA6IFwiI2ZlY2FjYVwiLFxyXG59KTtcclxuXHJcbmNvbnN0IHN0YXRzR3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwicmVwZWF0KDMsIG1pbm1heCgxNjBweCwgMWZyKSlcIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc3RhdENhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMTZweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjE1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSgxNSwgMjMsIDQyLCAwLjU4KVwiLFxyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc3RhdExhYmVsU3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjE2ZW1cIixcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgbWFyZ2luQm90dG9tOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc3RhdFZhbHVlU3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTZweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgd29yZEJyZWFrOiBcImJyZWFrLXdvcmRcIixcclxufTtcclxuXHJcbmNvbnN0IHNlY3Rpb25HcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJtaW5tYXgoMCwgMS40ZnIpIG1pbm1heCgyODBweCwgMC45ZnIpXCIsXHJcbiAgZ2FwOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHNlY3Rpb25UaXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMmVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBjb2xvcjogXCIjZjVkZjkwXCIsXHJcbn07XHJcblxyXG5jb25zdCBjb250ZW50Q2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIyMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTgpXCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDExLCAyNiwgNTYsIDAuOSlcIixcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxuICBib3hTaGFkb3c6IFwiMCAxNnB4IDI4cHggcmdiYSgyLCA2LCAyMywgMC4xNilcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9MaXN0U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9Sb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjEwcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9MYWJlbFN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvVmFsdWVTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgZm9udFdlaWdodDogNjAwLFxyXG4gIHRleHRBbGlnbjogXCJyaWdodFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGRlc2NyaXB0aW9uU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuNyxcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbiAgd2hpdGVTcGFjZTogXCJwcmUtd3JhcFwiLFxyXG59O1xyXG5cclxuY29uc3QgYnV0dG9uU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBwYWRkaW5nOiBcIjE0cHggMThweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgYm9yZGVyOiBcIm5vbmVcIixcclxuICBiYWNrZ3JvdW5kOiBcImxpbmVhci1ncmFkaWVudCgxMzVkZWcsICM2MzY2ZjEgMCUsICM4YjVjZjYgMTAwJSlcIixcclxuICBjb2xvcjogXCIjZmZmZmZmXCIsXHJcbiAgZm9udFNpemU6IFwiMTVweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIHRyYW5zaXRpb246IFwiYWxsIDAuM3MgZWFzZVwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDhweCAxNnB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjMpXCIsXHJcbn07XHJcblxyXG5jb25zdCBidXR0b25Ib3ZlclN0eWxlID0ge1xyXG4gIC4uLmJ1dHRvblN0eWxlLFxyXG4gIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVZKC0ycHgpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTJweCAyNHB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjQpXCIsXHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXRDdXJyZW5jeSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IGFtb3VudCA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gYFJzLiAke2Ftb3VudC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiBcIi1cIjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSk7XHJcbiAgaWYgKE51bWJlci5pc05hTihkYXRlLmdldFRpbWUoKSkpIHtcclxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBkYXRlU3R5bGU6IFwibWVkaXVtXCIsXHJcbiAgICB0aW1lU3R5bGU6IFwic2hvcnRcIixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IFByb2R1Y3RTaG93ID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkID0gcHJvcHM/LnJlY29yZDtcclxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fTtcclxuXHJcbiAgY29uc3QgbmFtZSA9IHBhcmFtcz8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwiO1xyXG4gIGNvbnN0IHNrdSA9IHBhcmFtcz8uc2t1IHx8IFwiLVwiO1xyXG4gIGNvbnN0IGNhdGVnb3J5ID0gcGFyYW1zPy5jYXRlZ29yeUlkIHx8IFwiLVwiO1xyXG4gIGNvbnN0IGltYWdlVXJsID0gcGFyYW1zPy5pbWFnZVVybCB8fCBcIlwiO1xyXG4gIGNvbnN0IHN0b2NrID0gTnVtYmVyKHBhcmFtcz8uc3RvY2sgfHwgMCk7XHJcbiAgY29uc3QgaXNBY3RpdmUgPSBCb29sZWFuKHBhcmFtcz8uaXNBY3RpdmUpO1xyXG4gIGNvbnN0IHByaWNlID0gZm9ybWF0Q3VycmVuY3kocGFyYW1zPy5wcmljZSk7XHJcbiAgY29uc3QgZGVzY3JpcHRpb24gPVxyXG4gICAgcGFyYW1zPy5kZXNjcmlwdGlvbiB8fCBcIk5vIGRlc2NyaXB0aW9uIGF2YWlsYWJsZSBmb3IgdGhpcyBwcm9kdWN0LlwiO1xyXG5cclxuICBjb25zdCBbYnV0dG9uSG92ZXJlZCwgc2V0QnV0dG9uSG92ZXJlZF0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZU9yZGVyQ2xpY2sgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBwcm9kdWN0SWQgPSBwYXJhbXM/LmlkIHx8IHJlY29yZD8uaWQgfHwgXCJcIjtcclxuICAgIGNvbnN0IG5ld09yZGVyVXJsID0gYC9hZG1pbi9yZXNvdXJjZXMvT3JkZXJzL2FjdGlvbnMvbmV3P3Byb2R1Y3RJZD0ke2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcocHJvZHVjdElkKSl9YDtcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24obmV3T3JkZXJVcmwpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+XHJcbiAgICAgICAge2BcclxuICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA5ODBweCkge1xyXG4gICAgICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LXNob3ctaGVybyxcclxuICAgICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LXNlY3Rpb25zIHtcclxuICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgYH1cclxuICAgICAgPC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LXNob3ctaGVyb1wiIHN0eWxlPXtoZXJvU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3BhbmVsU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW1hZ2VXcmFwU3R5bGV9PlxyXG4gICAgICAgICAgICB7aW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgPGltZyBzcmM9e2ltYWdlVXJsfSBhbHQ9e25hbWV9IHN0eWxlPXtpbWFnZVN0eWxlfSAvPlxyXG4gICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICBObyBpbWFnZSBhdmFpbGFibGVcclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtwYW5lbFN0eWxlfT5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2hlcm9Cb2R5U3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxoMSBzdHlsZT17dGl0bGVTdHlsZX0+e25hbWV9PC9oMT5cclxuICAgICAgICAgICAgICA8cCBzdHlsZT17c3VidGl0bGVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICBDbGVhbiBwcm9kdWN0IG92ZXJ2aWV3IGZvciBxdWljayByZXZpZXcgYW5kIG1hbmFnZW1lbnQuXHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2JhZGdlU3R5bGUoaXNBY3RpdmUpfT5cclxuICAgICAgICAgICAgICB7aXNBY3RpdmUgPyBcIkFDVElWRVwiIDogXCJJTkFDVElWRVwifVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRzR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0Q2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRMYWJlbFN0eWxlfT5QcmljZTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdFZhbHVlU3R5bGV9PntwcmljZX08L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0Q2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRMYWJlbFN0eWxlfT5TdG9jazwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2J1dHRvbkhvdmVyZWQgPyBidXR0b25Ib3ZlclN0eWxlIDogYnV0dG9uU3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0QnV0dG9uSG92ZXJlZCh0cnVlKX1cclxuICAgICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRCdXR0b25Ib3ZlcmVkKGZhbHNlKX1cclxuICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlT3JkZXJDbGlja31cclxuICAgICAgICAgICAgICAgICAgdGl0bGU9XCJDbGljayB0byBjcmVhdGUgYSBuZXcgb3JkZXIgZm9yIHRoaXMgcHJvZHVjdFwiXHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIDxzdmdcclxuICAgICAgICAgICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjE4XCJcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCIxOFwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIyLjVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMjFcIiByPVwiMVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjIwXCIgY3k9XCIyMVwiIHI9XCIxXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEgMWg0bDIuNjggMTMuMzlhMiAyIDAgMCAwIDIgMS42MWg5LjcyYTIgMiAwIDAgMCAyLTEuNjFMMjMgNkg2XCIgLz5cclxuICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgIE9yZGVyIE5vd1xyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0VmFsdWVTdHlsZX0+e3N0b2NrfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRDYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdExhYmVsU3R5bGV9PlNLVTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdFZhbHVlU3R5bGV9Pntza3V9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3Qtc2hvdy1zZWN0aW9uc1wiIHN0eWxlPXtzZWN0aW9uR3JpZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjb250ZW50Q2FyZFN0eWxlfT5cclxuICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PkRlc2NyaXB0aW9uPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMiB9fSAvPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17ZGVzY3JpcHRpb25TdHlsZX0+e2Rlc2NyaXB0aW9ufTwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjb250ZW50Q2FyZFN0eWxlfT5cclxuICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlByb2R1Y3QgRGV0YWlsczwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTIgfX0gLz5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9MaXN0U3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvTGFiZWxTdHlsZX0+Q2F0ZWdvcnk8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT57Y2F0ZWdvcnl9PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PkNyZWF0ZWQgQXQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIHtmb3JtYXREYXRlKHBhcmFtcz8uY3JlYXRlZEF0KX1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvTGFiZWxTdHlsZX0+VXBkYXRlZCBBdDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb1ZhbHVlU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAge2Zvcm1hdERhdGUocGFyYW1zPy51cGRhdGVkQXQpfVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9MYWJlbFN0eWxlfT5SZWNvcmQgSUQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIHtwYXJhbXM/LmlkIHx8IHJlY29yZD8uaWQgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0U2hvdztcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHBhZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMjBweFwiLFxyXG4gIGNvbG9yOiBcIiNlMmU4ZjBcIixcclxufTtcclxuXHJcbmNvbnN0IGhlYWRlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCI2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcIjM0cHhcIixcclxuICBsaW5lSGVpZ2h0OiAxLjA4LFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IGRlc2NTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMThweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIpXCIsXHJcbiAgYmFja2dyb3VuZDpcclxuICAgIFwibGluZWFyLWdyYWRpZW50KDE1MGRlZywgcmdiYSgxMCwgMjMsIDQ4LCAwLjk0KSAwJSwgcmdiYSg4LCAxOCwgMzgsIDAuOTQpIDEwMCUpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTRweCAyOHB4IHJnYmEoMiwgNiwgMjMsIDAuMjIpXCIsXHJcbiAgcGFkZGluZzogXCIxOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uVGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiMCAwIDE0cHggMFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMmVtXCIsXHJcbiAgY29sb3I6IFwiI2Y1ZGY5MFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxufTtcclxuXHJcbmNvbnN0IGxheW91dFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwibWlubWF4KDMwMHB4LCAwLjk1ZnIpIG1pbm1heCg0MjBweCwgMS4yNWZyKVwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzdGFja1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBsYWJlbFN0eWxlID0ge1xyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5wdXRTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yNilcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTUsIDIzLCA0MiwgMC42MilcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgcGFkZGluZzogXCIxMXB4IDEzcHhcIixcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbiAgZm9udEZhbWlseTogXCJpbmhlcml0XCIsXHJcbn07XHJcblxyXG5jb25zdCByb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBncmlkMlN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDFmclwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBjdXN0b21lckluZm9TdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG59O1xyXG5cclxuY29uc3QgY3VzdG9tZXJSb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI4cHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxufTtcclxuXHJcbmNvbnN0IG11dGVkU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc3Ryb25nU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICB0ZXh0QWxpZ246IFwicmlnaHRcIixcclxufTtcclxuXHJcbmNvbnN0IGxpbmVJdGVtUm93U3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMilcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTRweFwiLFxyXG4gIHBhZGRpbmc6IFwiMTJweFwiLFxyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNDQpXCIsXHJcbn07XHJcblxyXG5jb25zdCBsaW5lSXRlbVRvcFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIGF1dG9cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBwcm9kdWN0UHJldmlld1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiNTZweCAxZnJcIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjU2cHhcIixcclxuICBoZWlnaHQ6IFwiNTZweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjMGYxNzJhXCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjUpXCIsXHJcbn07XHJcblxyXG5jb25zdCBhZGRCdXR0b25TdHlsZSA9IHtcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIHBhZGRpbmc6IFwiOXB4IDEycHhcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoOTksIDEwMiwgMjQxLCAwLjE4KVwiLFxyXG4gIGNvbG9yOiBcIiNkYmVhZmVcIixcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxufTtcclxuXHJcbmNvbnN0IHJlbW92ZUJ1dHRvblN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgyMzksIDY4LCA2OCwgMC41KVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgcGFkZGluZzogXCI4cHggMTBweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSgxMjcsIDI5LCAyOSwgMC4yNSlcIixcclxuICBjb2xvcjogXCIjZmVjYWNhXCIsXHJcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG59O1xyXG5cclxuY29uc3QgdG90YWxzUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIHBhZGRpbmc6IFwiN3B4IDBcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbn07XHJcblxyXG5jb25zdCB0b3RhbFN0eWxlID0ge1xyXG4gIC4uLnRvdGFsc1Jvd1N0eWxlLFxyXG4gIGZvbnRTaXplOiBcIjE3cHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG4gIGJvcmRlckJvdHRvbTogXCJub25lXCIsXHJcbiAgcGFkZGluZ1RvcDogXCIxMnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBhY3Rpb25CYXJTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjFmciAxZnJcIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYWN0aW9uQnV0dG9uU3R5bGUgPSAocHJpbWFyeSkgPT4gKHtcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJvcmRlcjogcHJpbWFyeSA/IFwibm9uZVwiIDogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjI4KVwiLFxyXG4gIHBhZGRpbmc6IFwiMTJweCAxNHB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgYmFja2dyb3VuZDogcHJpbWFyeVxyXG4gICAgPyBcImxpbmVhci1ncmFkaWVudCgxMzVkZWcsICM2MzY2ZjEgMCUsICM4YjVjZjYgMTAwJSlcIlxyXG4gICAgOiBcInJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxuICBjb2xvcjogcHJpbWFyeSA/IFwiI2ZmZlwiIDogXCIjZDFkNWRiXCIsXHJcbn0pO1xyXG5cclxuY29uc3QgbWFwTGlua1N0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiM5M2M1ZmRcIixcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgdGV4dERlY29yYXRpb246IFwibm9uZVwiLFxyXG59O1xyXG5cclxuY29uc3QgcmVzcG9uc2l2ZUNzcyA9IGBcclxuQG1lZGlhIChtYXgtd2lkdGg6IDEwMjRweCkge1xyXG4gIC5jaGFuZ2U4LW9yZGVyLWxheW91dCB7XHJcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gIH1cclxufVxyXG5gO1xyXG5cclxuY29uc3QgcGF5bWVudE9wdGlvbnMgPSBbXCJDYXJkXCIsIFwiQ2FzaCBvbiBEZWxpdmVyeVwiLCBcIkJhbmsgVHJhbnNmZXJcIiwgXCJXYWxsZXRcIl07XHJcbmNvbnN0IHNoaXBwaW5nTWV0aG9kcyA9IFtcclxuICBcIlBpY2tNZSBGbGFzaFwiLFxyXG4gIFwiUHJvbnRvXCIsXHJcbiAgXCJEb21leFwiLFxyXG4gIFwiUmVnaXN0ZXJlZCBDb3VyaWVyXCIsXHJcbl07XHJcblxyXG5jb25zdCB0b051bWJlciA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IG51bSA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG51bSkgPyBudW0gOiAwO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0TW9uZXkgPSAodmFsdWUpID0+IHtcclxuICByZXR1cm4gYFJzLiAke3RvTnVtYmVyKHZhbHVlKS50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlRW1wdHlJdGVtID0gKCkgPT4gKHtcclxuICBwcm9kdWN0SWQ6IFwiXCIsXHJcbiAgcXVhbnRpdHk6IDEsXHJcbiAgdW5pdFByaWNlOiAwLFxyXG59KTtcclxuXHJcbmNvbnN0IE9yZGVyQ3JlYXRlID0gKCkgPT4ge1xyXG4gIGNvbnN0IFt1c2Vycywgc2V0VXNlcnNdID0gdXNlU3RhdGUoW10pO1xyXG4gIGNvbnN0IFtwcm9kdWN0cywgc2V0UHJvZHVjdHNdID0gdXNlU3RhdGUoW10pO1xyXG4gIGNvbnN0IFtvcmRlckNvdW50QnlVc2VyLCBzZXRPcmRlckNvdW50QnlVc2VyXSA9IHVzZVN0YXRlKHt9KTtcclxuICBjb25zdCBbc2Vzc2lvblVzZXIsIHNldFNlc3Npb25Vc2VyXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gIGNvbnN0IFtzdWJtaXR0aW5nLCBzZXRTdWJtaXR0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgY29uc3QgW2Zvcm1EYXRhLCBzZXRGb3JtRGF0YV0gPSB1c2VTdGF0ZSh7XHJcbiAgICB1c2VySWQ6IFwiXCIsXHJcbiAgICBzdGF0dXM6IFwicGVuZGluZ1wiLFxyXG4gICAgcGF5bWVudE1ldGhvZDogXCJDYXJkXCIsXHJcbiAgICBwYXltZW50U3RhdHVzOiBcInBlbmRpbmdcIixcclxuICAgIHRyYW5zYWN0aW9uSWQ6IFwiXCIsXHJcbiAgICBzaGlwcGluZ0FkZHJlc3M6IFwiXCIsXHJcbiAgICBzaGlwcGluZ01ldGhvZDogXCJQaWNrTWUgRmxhc2hcIixcclxuICAgIHRyYWNraW5nTnVtYmVyOiBcIlwiLFxyXG4gICAgc2hpcHBpbmdGZWU6IDAsXHJcbiAgICB0YXg6IDAsXHJcbiAgICBkaXNjb3VudDogMCxcclxuICB9KTtcclxuXHJcbiAgY29uc3QgW2xpbmVJdGVtcywgc2V0TGluZUl0ZW1zXSA9IHVzZVN0YXRlKFtjcmVhdGVFbXB0eUl0ZW0oKV0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcclxuICAgIGNvbnN0IHByZVByb2R1Y3RJZCA9IHBhcmFtcy5nZXQoXCJwcm9kdWN0SWRcIikgfHwgXCJcIjtcclxuXHJcbiAgICBjb25zdCBmZXRjaERhdGEgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgY29udGV4dFJlcyA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9jb250ZXh0L29yZGVyLWNyZWF0ZSR7XHJcbiAgICAgICAgICAgIHByZVByb2R1Y3RJZCA/IGA/cHJvZHVjdElkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHByZVByb2R1Y3RJZCl9YCA6IFwiXCJcclxuICAgICAgICAgIH1gLFxyXG4gICAgICAgICAgeyBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGV4dERhdGEgPSBjb250ZXh0UmVzLm9rID8gYXdhaXQgY29udGV4dFJlcy5qc29uKCkgOiB7fTtcclxuXHJcbiAgICAgICAgY29uc3QgdXNlcnNEYXRhID0gQXJyYXkuaXNBcnJheShjb250ZXh0RGF0YT8udXNlcnMpXHJcbiAgICAgICAgICA/IGNvbnRleHREYXRhLnVzZXJzXHJcbiAgICAgICAgICA6IFtdO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RzTGlzdCA9IEFycmF5LmlzQXJyYXkoY29udGV4dERhdGE/LnByb2R1Y3RzKVxyXG4gICAgICAgICAgPyBjb250ZXh0RGF0YS5wcm9kdWN0c1xyXG4gICAgICAgICAgOiBbXTtcclxuXHJcbiAgICAgICAgc2V0VXNlcnModXNlcnNEYXRhKTtcclxuICAgICAgICBzZXRQcm9kdWN0cyhwcm9kdWN0c0xpc3QpO1xyXG4gICAgICAgIHNldE9yZGVyQ291bnRCeVVzZXIoY29udGV4dERhdGE/Lm9yZGVyQ291bnRCeVVzZXIgfHwge30pO1xyXG4gICAgICAgIHNldFNlc3Npb25Vc2VyKGNvbnRleHREYXRhPy5jdXJyZW50VXNlciB8fCBudWxsKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHREYXRhPy5jdXJyZW50VXNlcj8uaWQpIHtcclxuICAgICAgICAgIHNldEZvcm1EYXRhKChwcmV2KSA9PiAoe1xyXG4gICAgICAgICAgICAuLi5wcmV2LFxyXG4gICAgICAgICAgICB1c2VySWQ6IHByZXYudXNlcklkIHx8IFN0cmluZyhjb250ZXh0RGF0YS5jdXJyZW50VXNlci5pZCksXHJcbiAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY29udGV4dERhdGE/LnNlbGVjdGVkUHJvZHVjdD8uaWQpIHtcclxuICAgICAgICAgIHNldExpbmVJdGVtcyhbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBwcm9kdWN0SWQ6IFN0cmluZyhjb250ZXh0RGF0YS5zZWxlY3RlZFByb2R1Y3QuaWQpLFxyXG4gICAgICAgICAgICAgIHF1YW50aXR5OiAxLFxyXG4gICAgICAgICAgICAgIHVuaXRQcmljZTogdG9OdW1iZXIoY29udGV4dERhdGEuc2VsZWN0ZWRQcm9kdWN0LnByaWNlKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgcHJlUHJvZHVjdElkICYmXHJcbiAgICAgICAgICBwcm9kdWN0c0xpc3Quc29tZSgocCkgPT4gU3RyaW5nKHAuaWQpID09PSBTdHJpbmcocHJlUHJvZHVjdElkKSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnN0IHNlbGVjdGVkID0gcHJvZHVjdHNMaXN0LmZpbmQoXHJcbiAgICAgICAgICAgIChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhwcmVQcm9kdWN0SWQpLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIHNldExpbmVJdGVtcyhbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBwcm9kdWN0SWQ6IFN0cmluZyhwcmVQcm9kdWN0SWQpLFxyXG4gICAgICAgICAgICAgIHF1YW50aXR5OiAxLFxyXG4gICAgICAgICAgICAgIHVuaXRQcmljZTogdG9OdW1iZXIoc2VsZWN0ZWQ/LnByaWNlKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmZXRjaERhdGEoKTtcclxuICB9LCBbXSk7XHJcblxyXG4gIGNvbnN0IHNlbGVjdGVkQ3VzdG9tZXIgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiB1c2Vycy5maW5kKCh1KSA9PiBTdHJpbmcodS5pZCkgPT09IFN0cmluZyhmb3JtRGF0YS51c2VySWQpKSB8fCBudWxsO1xyXG4gIH0sIFt1c2VycywgZm9ybURhdGEudXNlcklkXSk7XHJcblxyXG4gIGNvbnN0IGN1c3RvbWVyT3JkZXJDb3VudCA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgaWYgKCFzZWxlY3RlZEN1c3RvbWVyKSB7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBOdW1iZXIob3JkZXJDb3VudEJ5VXNlcltTdHJpbmcoc2VsZWN0ZWRDdXN0b21lci5pZCldIHx8IDApO1xyXG4gIH0sIFtvcmRlckNvdW50QnlVc2VyLCBzZWxlY3RlZEN1c3RvbWVyXSk7XHJcblxyXG4gIGNvbnN0IGxpbmVUb3RhbHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IHN1YnRvdGFsID0gbGluZUl0ZW1zLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiB7XHJcbiAgICAgIHJldHVybiBzdW0gKyB0b051bWJlcihpdGVtLnF1YW50aXR5KSAqIHRvTnVtYmVyKGl0ZW0udW5pdFByaWNlKTtcclxuICAgIH0sIDApO1xyXG5cclxuICAgIGNvbnN0IHNoaXBwaW5nRmVlID0gdG9OdW1iZXIoZm9ybURhdGEuc2hpcHBpbmdGZWUpO1xyXG4gICAgY29uc3QgdGF4ID0gdG9OdW1iZXIoZm9ybURhdGEudGF4KTtcclxuICAgIGNvbnN0IGRpc2NvdW50ID0gdG9OdW1iZXIoZm9ybURhdGEuZGlzY291bnQpO1xyXG4gICAgY29uc3QgZ3JhbmRUb3RhbCA9IE1hdGgubWF4KHN1YnRvdGFsICsgc2hpcHBpbmdGZWUgKyB0YXggLSBkaXNjb3VudCwgMCk7XHJcblxyXG4gICAgcmV0dXJuIHsgc3VidG90YWwsIHNoaXBwaW5nRmVlLCB0YXgsIGRpc2NvdW50LCBncmFuZFRvdGFsIH07XHJcbiAgfSwgW2xpbmVJdGVtcywgZm9ybURhdGEuc2hpcHBpbmdGZWUsIGZvcm1EYXRhLnRheCwgZm9ybURhdGEuZGlzY291bnRdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlRm9ybUNoYW5nZSA9IChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgeyBuYW1lLCB2YWx1ZSB9ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgc2V0Rm9ybURhdGEoKHByZXYpID0+ICh7IC4uLnByZXYsIFtuYW1lXTogdmFsdWUgfSkpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZUxpbmVJdGVtQ2hhbmdlID0gKGluZGV4LCBrZXksIHZhbHVlKSA9PiB7XHJcbiAgICBzZXRMaW5lSXRlbXMoKHByZXYpID0+IHtcclxuICAgICAgY29uc3QgbmV4dCA9IFsuLi5wcmV2XTtcclxuICAgICAgY29uc3QgaXRlbSA9IHsgLi4ubmV4dFtpbmRleF0gfTtcclxuXHJcbiAgICAgIGlmIChrZXkgPT09IFwicHJvZHVjdElkXCIpIHtcclxuICAgICAgICBpdGVtLnByb2R1Y3RJZCA9IHZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyh2YWx1ZSkpO1xyXG4gICAgICAgIGl0ZW0udW5pdFByaWNlID0gdG9OdW1iZXIocHJvZHVjdD8ucHJpY2UpO1xyXG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJxdWFudGl0eVwiKSB7XHJcbiAgICAgICAgaXRlbS5xdWFudGl0eSA9IE1hdGgubWF4KDEsIHRvTnVtYmVyKHZhbHVlKSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInVuaXRQcmljZVwiKSB7XHJcbiAgICAgICAgaXRlbS51bml0UHJpY2UgPSBNYXRoLm1heCgwLCB0b051bWJlcih2YWx1ZSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBuZXh0W2luZGV4XSA9IGl0ZW07XHJcbiAgICAgIHJldHVybiBuZXh0O1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYWRkTGluZUl0ZW0gPSAoKSA9PiB7XHJcbiAgICBzZXRMaW5lSXRlbXMoKHByZXYpID0+IFsuLi5wcmV2LCBjcmVhdGVFbXB0eUl0ZW0oKV0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlbW92ZUxpbmVJdGVtID0gKGluZGV4KSA9PiB7XHJcbiAgICBzZXRMaW5lSXRlbXMoKHByZXYpID0+IHtcclxuICAgICAgaWYgKHByZXYubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIHByZXY7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBwcmV2LmZpbHRlcigoXywgaSkgPT4gaSAhPT0gaW5kZXgpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgbWFwc0hyZWYgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGlmICghZm9ybURhdGEuc2hpcHBpbmdBZGRyZXNzPy50cmltKCkpIHtcclxuICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGBodHRwczovL3d3dy5nb29nbGUuY29tL21hcHMvc2VhcmNoLz9hcGk9MSZxdWVyeT0ke2VuY29kZVVSSUNvbXBvbmVudChmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3MudHJpbSgpKX1gO1xyXG4gIH0sIFtmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3NdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlU3VibWl0ID0gYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGNvbnN0IHZhbGlkSXRlbXMgPSBsaW5lSXRlbXMuZmlsdGVyKFxyXG4gICAgICAoaXRlbSkgPT4gaXRlbS5wcm9kdWN0SWQgJiYgdG9OdW1iZXIoaXRlbS5xdWFudGl0eSkgPiAwLFxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoIWZvcm1EYXRhLnVzZXJJZCkge1xyXG4gICAgICBhbGVydChcIlBsZWFzZSBzZWxlY3QgYSBjdXN0b21lci5cIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmFsaWRJdGVtcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgYWxlcnQoXCJBdCBsZWFzdCBvbmUgcHJvZHVjdCBsaW5lIGl0ZW0gaXMgcmVxdWlyZWQuXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U3VibWl0dGluZyh0cnVlKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBvcmRlclBheWxvYWQgPSB7XHJcbiAgICAgICAgdXNlcklkOiBOdW1iZXIoZm9ybURhdGEudXNlcklkKSxcclxuICAgICAgICBzdGF0dXM6IGZvcm1EYXRhLnN0YXR1cyxcclxuICAgICAgICBwYXltZW50TWV0aG9kOiBmb3JtRGF0YS5wYXltZW50TWV0aG9kLFxyXG4gICAgICAgIHBheW1lbnRTdGF0dXM6IGZvcm1EYXRhLnBheW1lbnRTdGF0dXMsXHJcbiAgICAgICAgdHJhbnNhY3Rpb25JZDogZm9ybURhdGEudHJhbnNhY3Rpb25JZCB8fCBudWxsLFxyXG4gICAgICAgIHNoaXBwaW5nTWV0aG9kOiBmb3JtRGF0YS5zaGlwcGluZ01ldGhvZCxcclxuICAgICAgICB0cmFja2luZ051bWJlcjogZm9ybURhdGEudHJhY2tpbmdOdW1iZXIgfHwgbnVsbCxcclxuICAgICAgICBzdWJ0b3RhbDogbGluZVRvdGFscy5zdWJ0b3RhbC50b0ZpeGVkKDIpLFxyXG4gICAgICAgIHNoaXBwaW5nRmVlOiBsaW5lVG90YWxzLnNoaXBwaW5nRmVlLnRvRml4ZWQoMiksXHJcbiAgICAgICAgdGF4OiBsaW5lVG90YWxzLnRheC50b0ZpeGVkKDIpLFxyXG4gICAgICAgIGRpc2NvdW50OiBsaW5lVG90YWxzLmRpc2NvdW50LnRvRml4ZWQoMiksXHJcbiAgICAgICAgdG90YWxBbW91bnQ6IGxpbmVUb3RhbHMuZ3JhbmRUb3RhbC50b0ZpeGVkKDIpLFxyXG4gICAgICAgIHNoaXBwaW5nQWRkcmVzczogZm9ybURhdGEuc2hpcHBpbmdBZGRyZXNzIHx8IG51bGwsXHJcbiAgICAgICAgbGluZUl0ZW1zOiB2YWxpZEl0ZW1zLm1hcCgoaXRlbSkgPT4gKHtcclxuICAgICAgICAgIHByb2R1Y3RJZDogTnVtYmVyKGl0ZW0ucHJvZHVjdElkKSxcclxuICAgICAgICAgIHF1YW50aXR5OiBNYXRoLm1heCgxLCB0b051bWJlcihpdGVtLnF1YW50aXR5KSksXHJcbiAgICAgICAgICB1bml0UHJpY2U6IE1hdGgubWF4KDAsIHRvTnVtYmVyKGl0ZW0udW5pdFByaWNlKSkudG9GaXhlZCgyKSxcclxuICAgICAgICB9KSksXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBzdWJtaXRGb3JtID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgIHN1Ym1pdEZvcm0uYXBwZW5kKFwicGF5bG9hZFwiLCBKU09OLnN0cmluZ2lmeShvcmRlclBheWxvYWQpKTtcclxuXHJcbiAgICAgIGNvbnN0IG9yZGVyUmVzID0gYXdhaXQgZmV0Y2goXCIvYWRtaW4vY29udGV4dC9vcmRlci1jcmVhdGUvc3VibWl0XCIsIHtcclxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXHJcbiAgICAgICAgYm9keTogc3VibWl0Rm9ybSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBvcmRlckRhdGEgPSBhd2FpdCBvcmRlclJlcy5qc29uKCk7XHJcbiAgICAgIGlmICghb3JkZXJSZXMub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3Iob3JkZXJEYXRhPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGNyZWF0ZSBvcmRlclwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihcclxuICAgICAgICBgL2FkbWluL3Jlc291cmNlcy9PcmRlcnMvcmVjb3Jkcy8ke29yZGVyRGF0YS5pZH0vc2hvd2AsXHJcbiAgICAgICk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBhbGVydChlcnJvci5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGNyZWF0ZSBvcmRlclwiKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNldFN1Ym1pdHRpbmcoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+e3Jlc3BvbnNpdmVDc3N9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2hlYWRlclN0eWxlfT5cclxuICAgICAgICA8aDEgc3R5bGU9e3RpdGxlU3R5bGV9PkNyZWF0ZSBOZXcgT3JkZXI8L2gxPlxyXG4gICAgICAgIDxwIHN0eWxlPXtkZXNjU3R5bGV9PlxyXG4gICAgICAgICAgQ3VzdG9tZXIgZGV0YWlscywgbGluZSBpdGVtcywgcGF5bWVudCwgc2hpcHBpbmcsIGFuZCB0b3RhbHMgaW4gb25lXHJcbiAgICAgICAgICBndWlkZWQgZmxvdy5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0gc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCIxNnB4XCIgfX0+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWxheW91dFwiIHN0eWxlPXtsYXlvdXRTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGFja1N0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5DdXN0b21lciBEZXRhaWxzPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TZWxlY3QgQ3VzdG9tZXIgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJ1c2VySWRcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudXNlcklkfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtsb2FkaW5nIHx8IHNlc3Npb25Vc2VyPy5yb2xlID09PSBcInVzZXJcIn1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtsb2FkaW5nID8gXCJMb2FkaW5nIGN1c3RvbWVycy4uLlwiIDogXCJTZWxlY3QgYSBjdXN0b21lclwifVxyXG4gICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAge3VzZXJzLm1hcCgodXNlcikgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXt1c2VyLmlkfSB2YWx1ZT17dXNlci5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICB7dXNlci5uYW1lfSAoI3t1c2VyLmlkfSlcclxuICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVySW5mb1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVyUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+Q3VzdG9tZXIgTmFtZSAmIElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17c3Ryb25nU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZEN1c3RvbWVyXHJcbiAgICAgICAgICAgICAgICAgICAgICA/IGAke3NlbGVjdGVkQ3VzdG9tZXIubmFtZX0gKCMke3NlbGVjdGVkQ3VzdG9tZXIuaWR9KWBcclxuICAgICAgICAgICAgICAgICAgICAgIDogXCItXCJ9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5FbWFpbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0cm9uZ1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRDdXN0b21lcj8uZW1haWwgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5QaG9uZSBOdW1iZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtzdHJvbmdTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkQ3VzdG9tZXI/LnBob25lIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEN1c3RvbWVyPy5tb2JpbGUgfHxcclxuICAgICAgICAgICAgICAgICAgICAgIFwiTm90IGF2YWlsYWJsZVwifVxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVyUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+T3JkZXIgSGlzdG9yeTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0cm9uZ1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICB7Y3VzdG9tZXJPcmRlckNvdW50fSBwcmV2aW91cyBvcmRlcnNcclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5QYXltZW50ICYgQmlsbGluZzwvaDI+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlBheW1lbnQgTWV0aG9kPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJwYXltZW50TWV0aG9kXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEucGF5bWVudE1ldGhvZH1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIHtwYXltZW50T3B0aW9ucy5tYXAoKGl0ZW0pID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtpdGVtfSB2YWx1ZT17aXRlbX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlBheW1lbnQgU3RhdHVzPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJwYXltZW50U3RhdHVzXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEucGF5bWVudFN0YXR1c31cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwZW5kaW5nXCI+UGVuZGluZzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwYWlkXCI+UGFpZDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5UcmFuc2FjdGlvbiBJRDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgbmFtZT1cInRyYW5zYWN0aW9uSWRcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudHJhbnNhY3Rpb25JZH1cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gVFhOLTIwMjYtMDAwMTI0XCJcclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17c3RhY2tTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgZ2FwOiBcIjhweFwiLFxyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3sgLi4uc2VjdGlvblRpdGxlU3R5bGUsIG1hcmdpbkJvdHRvbTogMCB9fT5cclxuICAgICAgICAgICAgICAgICAgUHJvZHVjdCBMaW5lIEl0ZW1zIChSZXF1aXJlZClcclxuICAgICAgICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXthZGRMaW5lSXRlbX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2FkZEJ1dHRvblN0eWxlfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICArIEFkZCBJdGVtXHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCIxMHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICB7bGluZUl0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRQcm9kdWN0ID0gcHJvZHVjdHMuZmluZChcclxuICAgICAgICAgICAgICAgICAgICAocCkgPT4gU3RyaW5nKHAuaWQpID09PSBTdHJpbmcoaXRlbS5wcm9kdWN0SWQpLFxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICBjb25zdCBpdGVtVG90YWwgPVxyXG4gICAgICAgICAgICAgICAgICAgIHRvTnVtYmVyKGl0ZW0ucXVhbnRpdHkpICogdG9OdW1iZXIoaXRlbS51bml0UHJpY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17YGxpbmUtaXRlbS0ke2luZGV4fWB9IHN0eWxlPXtsaW5lSXRlbVJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2xpbmVJdGVtVG9wU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5Qcm9kdWN0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aXRlbS5wcm9kdWN0SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVMaW5lSXRlbUNoYW5nZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInByb2R1Y3RJZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QgcHJvZHVjdDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3Byb2R1Y3RzLm1hcCgocHJvZHVjdCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17cHJvZHVjdC5pZH0gdmFsdWU9e3Byb2R1Y3QuaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwcm9kdWN0Lm5hbWV9IChTS1U6IHtwcm9kdWN0LnNrdX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtyZW1vdmVCdXR0b25TdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByZW1vdmVMaW5lSXRlbShpbmRleCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBSZW1vdmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtwcm9kdWN0UHJldmlld1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkUHJvZHVjdD8uaW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXtzZWxlY3RlZFByb2R1Y3QuaW1hZ2VVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHQ9e3NlbGVjdGVkUHJvZHVjdC5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5pbWFnZVN0eWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBObyBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZ3JpZFwiLCBnYXA6IFwiM3B4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IFwiMTRweFwiLCBjb2xvcjogXCIjZjhmYWZjXCIgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRQcm9kdWN0Py5uYW1lIHx8IFwiU2VsZWN0IGEgcHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiBcIjEycHhcIiwgY29sb3I6IFwiIzk0YTNiOFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU0tVL0lEOntcIiBcIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZFByb2R1Y3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBgJHtzZWxlY3RlZFByb2R1Y3Quc2t1fSAvICMke3NlbGVjdGVkUHJvZHVjdC5pZH1gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCItXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5RdWFudGl0eTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2l0ZW0ucXVhbnRpdHl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVMaW5lSXRlbUNoYW5nZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInF1YW50aXR5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlVuaXQgUHJpY2U8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnVuaXRQcmljZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxpbmVJdGVtQ2hhbmdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidW5pdFByaWNlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLi4udG90YWxzUm93U3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nQm90dG9tOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+TGluZSBUb3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdE1vbmV5KGl0ZW1Ub3RhbCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlNoaXBwaW5nICYgVHJhY2tpbmc8L2gyPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIEFkZHJlc3M8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHRleHRhcmVhXHJcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJzaGlwcGluZ0FkZHJlc3NcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuc2hpcHBpbmdBZGRyZXNzfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAuLi5pbnB1dFN0eWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1pbkhlaWdodDogXCI4NnB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzaXplOiBcInZlcnRpY2FsXCIsXHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiSG91c2UgbnVtYmVyLCBzdHJlZXQsIGNpdHksIHBvc3RhbCBjb2RlXCJcclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICB7bWFwc0hyZWYgPyAoXHJcbiAgICAgICAgICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgICAgICAgICAgaHJlZj17bWFwc0hyZWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcclxuICAgICAgICAgICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17bWFwTGlua1N0eWxlfVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgT3BlbiBvbiBHb29nbGUgTWFwc1xyXG4gICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICApIDogbnVsbH1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEwIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIE1ldGhvZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxzZWxlY3RcclxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2hpcHBpbmdNZXRob2RcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5zaGlwcGluZ01ldGhvZH1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIHtzaGlwcGluZ01ldGhvZHMubWFwKChpdGVtKSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17aXRlbX0gdmFsdWU9e2l0ZW19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7aXRlbX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlRyYWNraW5nIE51bWJlcjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJ0cmFja2luZ051bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnRyYWNraW5nTnVtYmVyfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVFJLLVhYWFhYWFwiXHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9Pk9yZGVyIFN1bW1hcnkgLyBUb3RhbHM8L2gyPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtncmlkMlN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TaGlwcGluZyBGZWU8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nRmVlXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuc2hpcHBpbmdGZWV9XHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5UYXggLyBWQVQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInRheFwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnRheH1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5EaXNjb3VudCAvIENvdXBvbjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcclxuICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJkaXNjb3VudFwiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5kaXNjb3VudH1cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5TdWJ0b3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGxpbmVUb3RhbHMuc3VidG90YWwpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5TaGlwcGluZyBGZWU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leShsaW5lVG90YWxzLnNoaXBwaW5nRmVlKX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbHNSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+VGF4IC8gVkFUPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkobGluZVRvdGFscy50YXgpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5EaXNjb3VudDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmc+LSB7Zm9ybWF0TW9uZXkobGluZVRvdGFscy5kaXNjb3VudCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj5HcmFuZCBUb3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuPntmb3JtYXRNb25leShsaW5lVG90YWxzLmdyYW5kVG90YWwpfTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyAuLi5jYXJkU3R5bGUsIHBhZGRpbmdUb3A6IFwiMTRweFwiIH19PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17YWN0aW9uQmFyU3R5bGV9PlxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgc3R5bGU9e2FjdGlvbkJ1dHRvblN0eWxlKGZhbHNlKX1cclxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB3aW5kb3cuaGlzdG9yeS5iYWNrKCl9XHJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICBDYW5jZWxcclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcclxuICAgICAgICAgICAgICBzdHlsZT17YWN0aW9uQnV0dG9uU3R5bGUodHJ1ZSl9XHJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICB7c3VibWl0dGluZyA/IFwiQ3JlYXRpbmcgT3JkZXIuLi5cIiA6IFwiQ3JlYXRlIE9yZGVyXCJ9XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZm9ybT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlckNyZWF0ZTtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHBhZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG4gIGNvbG9yOiBcIiNlMmU4ZjBcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMThweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIpXCIsXHJcbiAgYmFja2dyb3VuZDpcclxuICAgIFwibGluZWFyLWdyYWRpZW50KDE1NWRlZywgcmdiYSgxMCwgMjMsIDQ4LCAwLjk0KSAwJSwgcmdiYSg4LCAxOCwgMzgsIDAuOTQpIDEwMCUpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTRweCAzMHB4IHJnYmEoMiwgNiwgMjMsIDAuMilcIixcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGhlYWRlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBoZWFkaW5nU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBmb250U2l6ZTogXCIzNHB4XCIsXHJcbiAgbGluZUhlaWdodDogMS4xLFxyXG59O1xyXG5cclxuY29uc3Qgc3ViVGV4dFN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgbWFyZ2luVG9wOiBcIjRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IChzdGF0dXMpID0+IHtcclxuICBjb25zdCB2YWwgPSBTdHJpbmcoc3RhdHVzIHx8IFwicGVuZGluZ1wiKS50b0xvd2VyQ2FzZSgpO1xyXG4gIGNvbnN0IHN0eWxlQnlTdGF0dXMgPSB7XHJcbiAgICBwZW5kaW5nOiB7IGJnOiBcIiNmZWYzYzdcIiwgZmc6IFwiIzdjMmQxMlwiIH0sXHJcbiAgICBwYWlkOiB7IGJnOiBcIiNiYmY3ZDBcIiwgZmc6IFwiIzE0NTMyZFwiIH0sXHJcbiAgICBwcm9jZXNzaW5nOiB7IGJnOiBcIiNiZmRiZmVcIiwgZmc6IFwiIzFlM2E4YVwiIH0sXHJcbiAgICBzaGlwcGVkOiB7IGJnOiBcIiNkZGQ2ZmVcIiwgZmc6IFwiIzRjMWQ5NVwiIH0sXHJcbiAgICBjb21wbGV0ZWQ6IHsgYmc6IFwiI2E3ZjNkMFwiLCBmZzogXCIjMDY0ZTNiXCIgfSxcclxuICAgIGNhbmNlbGxlZDogeyBiZzogXCIjZmVjYWNhXCIsIGZnOiBcIiM3ZjFkMWRcIiB9LFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNlbGVjdGVkID0gc3R5bGVCeVN0YXR1c1t2YWxdIHx8IHN0eWxlQnlTdGF0dXMucGVuZGluZztcclxuICByZXR1cm4ge1xyXG4gICAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gICAgcGFkZGluZzogXCI2cHggMTJweFwiLFxyXG4gICAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxyXG4gICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICAgIGJhY2tncm91bmQ6IHNlbGVjdGVkLmJnLFxyXG4gICAgY29sb3I6IHNlbGVjdGVkLmZnLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uVGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiMCAwIDEycHggMFwiLFxyXG4gIGNvbG9yOiBcIiNmNWRmOTBcIixcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMWVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxufTtcclxuXHJcbmNvbnN0IGdyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgzMDBweCwgMWZyKSBtaW5tYXgoMzIwcHgsIDFmcilcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0dyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI4cHhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0YWJsZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBsaW5lSXRlbVN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgcGFkZGluZzogXCIxMHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNDQpXCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCI2MHB4IDFmciBhdXRvXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2MHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjYwcHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG59O1xyXG5cclxuY29uc3QgdG90YWxCb3hTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0b3RhbFJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI3cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGdyYW5kU3R5bGUgPSB7XHJcbiAgLi4udG90YWxSb3dTdHlsZSxcclxuICBib3JkZXJCb3R0b206IFwibm9uZVwiLFxyXG4gIHBhZGRpbmdUb3A6IFwiNnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGZvbnRTaXplOiBcIjE4cHhcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBlbXB0eVN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggZGFzaGVkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdE1vbmV5ID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgbiA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gYFJzLiAke24udG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSl9YDtcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUpID0+IHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gXCItXCI7XHJcbiAgfVxyXG5cclxuICBjb25zdCBkdCA9IG5ldyBEYXRlKHZhbHVlKTtcclxuICBpZiAoTnVtYmVyLmlzTmFOKGR0LmdldFRpbWUoKSkpIHtcclxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGR0LnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgZGF0ZVN0eWxlOiBcIm1lZGl1bVwiLFxyXG4gICAgdGltZVN0eWxlOiBcInNob3J0XCIsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBPcmRlclNob3cgPSAoeyByZWNvcmQgfSkgPT4ge1xyXG4gIGNvbnN0IFtkZXRhaWxzLCBzZXREZXRhaWxzXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIGNvbnN0IG9yZGVySWQgPSByZWNvcmQ/LnBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZDtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghb3JkZXJJZCkge1xyXG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgc2V0RXJyb3IoXCJPcmRlciBpZCBub3QgZm91bmRcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsb2FkRGV0YWlscyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBzZXRFcnJvcihcIlwiKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9jb250ZXh0L29yZGVycy8ke2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcob3JkZXJJZCkpfS9kZXRhaWxzYCxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZD8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGRldGFpbHNcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXREZXRhaWxzKHBheWxvYWQpO1xyXG4gICAgICB9IGNhdGNoIChmZXRjaEVycm9yKSB7XHJcbiAgICAgICAgc2V0RXJyb3IoZmV0Y2hFcnJvcj8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGRldGFpbHNcIik7XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbG9hZERldGFpbHMoKTtcclxuICB9LCBbb3JkZXJJZF0pO1xyXG5cclxuICBjb25zdCB0b3RhbHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IHN1YnRvdGFsID0gTnVtYmVyKGRldGFpbHM/LnN1YnRvdGFsIHx8IDApO1xyXG4gICAgY29uc3Qgc2hpcHBpbmdGZWUgPSBOdW1iZXIoZGV0YWlscz8uc2hpcHBpbmdGZWUgfHwgMCk7XHJcbiAgICBjb25zdCB0YXggPSBOdW1iZXIoZGV0YWlscz8udGF4IHx8IDApO1xyXG4gICAgY29uc3QgZGlzY291bnQgPSBOdW1iZXIoZGV0YWlscz8uZGlzY291bnQgfHwgMCk7XHJcbiAgICBjb25zdCB0b3RhbEFtb3VudCA9IE51bWJlcihkZXRhaWxzPy50b3RhbEFtb3VudCB8fCAwKTtcclxuXHJcbiAgICByZXR1cm4geyBzdWJ0b3RhbCwgc2hpcHBpbmdGZWUsIHRheCwgZGlzY291bnQsIHRvdGFsQW1vdW50IH07XHJcbiAgfSwgW2RldGFpbHNdKTtcclxuXHJcbiAgaWYgKGxvYWRpbmcpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5Mb2FkaW5nIG9yZGVyIGRldGFpbHMuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT57ZXJyb3J9PC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKCFkZXRhaWxzKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+T3JkZXIgZGV0YWlscyBub3QgYXZhaWxhYmxlLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+e2BAbWVkaWEgKG1heC13aWR0aDogMTA0MHB4KSB7IC5jaGFuZ2U4LW9yZGVyLXNob3ctZ3JpZCB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7IH0gfWB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17aGVhZGVyU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGgxIHN0eWxlPXtoZWFkaW5nU3R5bGV9Pk9yZGVyICN7ZGV0YWlscy5pZH08L2gxPlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdWJUZXh0U3R5bGV9PlxyXG4gICAgICAgICAgICAgIENyZWF0ZWQge2Zvcm1hdERhdGUoZGV0YWlscy5jcmVhdGVkQXQpfSB8IFVwZGF0ZWR7XCIgXCJ9XHJcbiAgICAgICAgICAgICAge2Zvcm1hdERhdGUoZGV0YWlscy51cGRhdGVkQXQpfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9e2JhZGdlU3R5bGUoZGV0YWlscy5zdGF0dXMpfT5cclxuICAgICAgICAgICAge2RldGFpbHMuc3RhdHVzIHx8IFwicGVuZGluZ1wifVxyXG4gICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1zaG93LWdyaWRcIiBzdHlsZT17Z3JpZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+Q3VzdG9tZXIgJiBTaGlwcGluZzwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+Q3VzdG9tZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8udXNlcj8ubmFtZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkVtYWlsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnVzZXI/LmVtYWlsIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UGF5bWVudCBNZXRob2Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8ucGF5bWVudE1ldGhvZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlBheW1lbnQgU3RhdHVzPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnBheW1lbnRTdGF0dXMgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5UcmFuc2FjdGlvbiBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy50cmFuc2FjdGlvbklkIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgTWV0aG9kPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnNoaXBwaW5nTWV0aG9kIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VHJhY2tpbmcgTnVtYmVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnRyYWNraW5nTnVtYmVyIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiBcIjEzcHhcIiwgY29sb3I6IFwiI2NiZDVlMVwiLCBsaW5lSGVpZ2h0OiAxLjYgfX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiLCBtYXJnaW5Cb3R0b206IFwiNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICBTaGlwcGluZyBBZGRyZXNzXHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIgfX0+XHJcbiAgICAgICAgICAgICAgICB7ZGV0YWlscz8uc2hpcHBpbmdBZGRyZXNzIHx8IFwiLVwifVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+T3JkZXIgU3VtbWFyeSAvIFRvdGFsczwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbEJveFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlN1YnRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KHRvdGFscy5zdWJ0b3RhbCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgRmVlPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KHRvdGFscy5zaGlwcGluZ0ZlZSl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VGF4IC8gVkFUPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KHRvdGFscy50YXgpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkRpc2NvdW50PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+LSB7Zm9ybWF0TW9uZXkodG90YWxzLmRpc2NvdW50KX08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2dyYW5kU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuPkdyYW5kIFRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuPntmb3JtYXRNb25leSh0b3RhbHMudG90YWxBbW91bnQpfTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlByb2R1Y3QgTGluZSBJdGVtczwvaDI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17dGFibGVTdHlsZX0+XHJcbiAgICAgICAgICB7KGRldGFpbHM/Lml0ZW1zIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9Pk5vIGxpbmUgaXRlbXMgaW4gdGhpcyBvcmRlci48L2Rpdj5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgIChkZXRhaWxzLml0ZW1zIHx8IFtdKS5tYXAoKGl0ZW0pID0+IChcclxuICAgICAgICAgICAgICA8ZGl2IGtleT17aXRlbS5pZH0gc3R5bGU9e2xpbmVJdGVtU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAge2l0ZW0/LnByb2R1Y3Q/LmltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjPXtpdGVtLnByb2R1Y3QuaW1hZ2VVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgYWx0PXtpdGVtPy5wcm9kdWN0Py5uYW1lIHx8IFwiUHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbWFnZVN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAuLi5pbWFnZVN0eWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIE5vIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZ3JpZFwiLCBnYXA6IFwiNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAge2l0ZW0/LnByb2R1Y3Q/Lm5hbWUgfHwgXCJVbm5hbWVkIHByb2R1Y3RcIn1cclxuICAgICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIFNLVToge2l0ZW0/LnByb2R1Y3Q/LnNrdSB8fCBcIi1cIn0gfCBQcm9kdWN0IElEOiAjXHJcbiAgICAgICAgICAgICAgICAgICAge2l0ZW0/LnByb2R1Y3RJZH1cclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjY2JkNWUxXCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICBRdHk6IHtpdGVtLnF1YW50aXR5fSB4IHtmb3JtYXRNb25leShpdGVtLnVuaXRQcmljZSl9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNXB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgIHtmb3JtYXRNb25leShpdGVtLnRvdGFsUHJpY2UpfVxyXG4gICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlclNob3c7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBwYWdlU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxuICBjb2xvcjogXCIjZTJlOGYwXCIsXHJcbn07XHJcblxyXG5jb25zdCBjYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE4cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yKVwiLFxyXG4gIGJhY2tncm91bmQ6XHJcbiAgICBcImxpbmVhci1ncmFkaWVudCgxNTVkZWcsIHJnYmEoMTAsIDIzLCA0OCwgMC45NCkgMCUsIHJnYmEoOCwgMTgsIDM4LCAwLjk0KSAxMDAlKVwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDE0cHggMzBweCByZ2JhKDIsIDYsIDIzLCAwLjIpXCIsXHJcbiAgcGFkZGluZzogXCIxOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBoZWFkZXJTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgdGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgZm9udFNpemU6IFwiMzRweFwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuMSxcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBzdWJ0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogXCI2cHggMCAwIDBcIixcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImlubGluZS1mbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gIHBhZGRpbmc6IFwiNnB4IDEycHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiOTk5cHhcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4wOGVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBjb2xvcjogXCIjMTQ1MzJkXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjYmJmN2QwXCIsXHJcbn07XHJcblxyXG5jb25zdCBncmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJtaW5tYXgoMzAwcHgsIDAuOTVmcikgbWlubWF4KDMyMHB4LCAxLjA1ZnIpXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHNlY3Rpb25UaXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogXCIwIDAgMTJweCAwXCIsXHJcbiAgY29sb3I6IFwiI2Y1ZGY5MFwiLFxyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjExZW1cIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0dyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI4cHhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBoZWlnaHQ6IFwiMjgwcHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTRweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG59O1xyXG5cclxuY29uc3QgbGluZUl0ZW1TdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjg0cHggMWZyIGF1dG9cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgcGFkZGluZzogXCIxMnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE0cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yKVwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSgxNSwgMjMsIDQyLCAwLjQ0KVwiLFxyXG59O1xyXG5cclxuY29uc3QgZW1wdHlJbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjg0cHhcIixcclxuICBoZWlnaHQ6IFwiODRweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjMGYxNzJhXCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjIpXCIsXHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG59O1xyXG5cclxuY29uc3QgdG90YWxSb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiN3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCBncmFuZFN0eWxlID0ge1xyXG4gIC4uLnRvdGFsUm93U3R5bGUsXHJcbiAgYm9yZGVyQm90dG9tOiBcIm5vbmVcIixcclxuICBwYWRkaW5nVG9wOiBcIjZweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBmb250U2l6ZTogXCIxOHB4XCIsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3QgZW1wdHlTdHlsZSA9IHtcclxuICBib3JkZXI6IFwiMXB4IGRhc2hlZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMzUpXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBwYWRkaW5nOiBcIjE0cHhcIixcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXRNb25leSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IG4gPSBOdW1iZXIodmFsdWUgfHwgMCk7XHJcbiAgcmV0dXJuIGBScy4gJHtuLnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gIH0pfWA7XHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXREYXRlID0gKHZhbHVlKSA9PiB7XHJcbiAgaWYgKCF2YWx1ZSkge1xyXG4gICAgcmV0dXJuIFwiLVwiO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZHQgPSBuZXcgRGF0ZSh2YWx1ZSk7XHJcbiAgaWYgKE51bWJlci5pc05hTihkdC5nZXRUaW1lKCkpKSB7XHJcbiAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkdC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIGRhdGVTdHlsZTogXCJtZWRpdW1cIixcclxuICAgIHRpbWVTdHlsZTogXCJzaG9ydFwiLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgT3JkZXJJdGVtU2hvdyA9ICh7IHJlY29yZCB9KSA9PiB7XHJcbiAgY29uc3QgW2RldGFpbHMsIHNldERldGFpbHNdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XHJcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgY29uc3Qgb3JkZXJJdGVtSWQgPSByZWNvcmQ/LnBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZDtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghb3JkZXJJdGVtSWQpIHtcclxuICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIHNldEVycm9yKFwiT3JkZXIgaXRlbSBpZCBub3QgZm91bmRcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsb2FkRGV0YWlscyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBzZXRFcnJvcihcIlwiKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9jb250ZXh0L29yZGVyLWl0ZW1zLyR7ZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhvcmRlckl0ZW1JZCkpfS9kZXRhaWxzYCxcclxuICAgICAgICAgIHsgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiB9LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICBwYXlsb2FkPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgb3JkZXIgaXRlbSBkZXRhaWxzXCIsXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0RGV0YWlscyhwYXlsb2FkKTtcclxuICAgICAgfSBjYXRjaCAoZmV0Y2hFcnJvcikge1xyXG4gICAgICAgIHNldEVycm9yKGZldGNoRXJyb3I/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gbG9hZCBvcmRlciBpdGVtIGRldGFpbHNcIik7XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbG9hZERldGFpbHMoKTtcclxuICB9LCBbb3JkZXJJdGVtSWRdKTtcclxuXHJcbiAgY29uc3QgY2FsY3VsYXRlZFRvdGFsID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICByZXR1cm4gTnVtYmVyKGRldGFpbHM/LnRvdGFsUHJpY2UgfHwgMCk7XHJcbiAgfSwgW2RldGFpbHNdKTtcclxuXHJcbiAgaWYgKGxvYWRpbmcpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5Mb2FkaW5nIG9yZGVyIGl0ZW0gZGV0YWlscy4uLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9PntlcnJvcn08L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoIWRldGFpbHMpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5PcmRlciBpdGVtIGRldGFpbHMgbm90IGF2YWlsYWJsZS48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBjb25zdCBwcm9kdWN0ID0gZGV0YWlscz8ucHJvZHVjdCB8fCB7fTtcclxuICBjb25zdCBvcmRlciA9IGRldGFpbHM/Lm9yZGVyIHx8IHt9O1xyXG4gIGNvbnN0IGN1c3RvbWVyID0gb3JkZXI/LnVzZXIgfHwge307XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+e2BAbWVkaWEgKG1heC13aWR0aDogMTA0MHB4KSB7IC5jaGFuZ2U4LW9yZGVyLWl0ZW0tZ3JpZCB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7IH0gfWB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17aGVhZGVyU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGgxIHN0eWxlPXt0aXRsZVN0eWxlfT57cHJvZHVjdD8ubmFtZSB8fCBcIk9yZGVyIEl0ZW1cIn08L2gxPlxyXG4gICAgICAgICAgICA8cCBzdHlsZT17c3VidGl0bGVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgT3JkZXIgI3tvcmRlcj8uaWQgfHwgXCItXCJ9IOKAoiBJdGVtICN7ZGV0YWlscz8uaWQgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9e2JhZGdlU3R5bGV9PkFjdGl2ZSBJdGVtPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1pdGVtLWdyaWRcIiBzdHlsZT17Z3JpZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAge3Byb2R1Y3Q/LmltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgc3JjPXtwcm9kdWN0LmltYWdlVXJsfVxyXG4gICAgICAgICAgICAgIGFsdD17cHJvZHVjdD8ubmFtZSB8fCBcIlByb2R1Y3RcIn1cclxuICAgICAgICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgLi4uaW1hZ2VTdHlsZSxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICBObyBpbWFnZSBhdmFpbGFibGVcclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxNCB9fSAvPlxyXG5cclxuICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlByb2R1Y3QgU25hcHNob3Q8L2gyPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0dyaWRTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlByb2R1Y3QgTmFtZTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntwcm9kdWN0Py5uYW1lIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U0tVPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e3Byb2R1Y3Q/LnNrdSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlByb2R1Y3QgSUQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz4je3Byb2R1Y3Q/LmlkIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+Q3VycmVudCBTdG9jazwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntwcm9kdWN0Py5zdG9jayA/PyBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9Pk9yZGVyICYgQ3VzdG9tZXI8L2gyPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0dyaWRTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkN1c3RvbWVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2N1c3RvbWVyPy5uYW1lIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+RW1haWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Y3VzdG9tZXI/LmVtYWlsIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+T3JkZXIgSUQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz4je29yZGVyPy5pZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19Pk9yZGVyIFN0YXR1czwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntvcmRlcj8uc3RhdHVzIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UGF5bWVudCBNZXRob2Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57b3JkZXI/LnBheW1lbnRNZXRob2QgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5TaGlwcGluZyBNZXRob2Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57b3JkZXI/LnNoaXBwaW5nTWV0aG9kIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VHJhY2tpbmcgTnVtYmVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e29yZGVyPy50cmFja2luZ051bWJlciB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkNyZWF0ZWQgQXQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0RGF0ZShkZXRhaWxzLmNyZWF0ZWRBdCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5QcmljaW5nIERldGFpbHM8L2gyPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2luZm9HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlF1YW50aXR5PC9zcGFuPlxyXG4gICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzLnF1YW50aXR5fTwvc3Ryb25nPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VW5pdCBQcmljZTwvc3Bhbj5cclxuICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkoZGV0YWlscy51bml0UHJpY2UpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+TGluZSBUb3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkoY2FsY3VsYXRlZFRvdGFsKX08L3N0cm9uZz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UXVpY2sgU3VtbWFyeTwvaDI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17bGluZUl0ZW1TdHlsZX0+XHJcbiAgICAgICAgICB7cHJvZHVjdD8uaW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICBzcmM9e3Byb2R1Y3QuaW1hZ2VVcmx9XHJcbiAgICAgICAgICAgICAgYWx0PXtwcm9kdWN0Py5uYW1lIHx8IFwiUHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogXCI4NHB4XCIsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiODRweFwiLFxyXG4gICAgICAgICAgICAgICAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtlbXB0eUltYWdlU3R5bGV9Pk5vIGltYWdlPC9kaXY+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ2FwOiBcIjRweFwiIH19PlxyXG4gICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGNvbG9yOiBcIiNmOGZhZmNcIiwgZm9udFNpemU6IFwiMTZweFwiIH19PlxyXG4gICAgICAgICAgICAgIHtwcm9kdWN0Py5uYW1lIHx8IFwiVW5uYW1lZCBwcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICBTS1U6IHtwcm9kdWN0Py5za3UgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiI2NiZDVlMVwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgUXR5IHtkZXRhaWxzLnF1YW50aXR5fSB4IHtmb3JtYXRNb25leShkZXRhaWxzLnVuaXRQcmljZSl9XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIsIGZvbnRTaXplOiBcIjE2cHhcIiB9fT5cclxuICAgICAgICAgICAge2Zvcm1hdE1vbmV5KGNhbGN1bGF0ZWRUb3RhbCl9XHJcbiAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgT3JkZXJJdGVtU2hvdztcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IGNlbGxTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgbWluSGVpZ2h0OiBcIjU2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiNjRweFwiLFxyXG4gIGhlaWdodDogXCI0MnB4XCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmOGZhZmNcIixcclxuICBmbGV4U2hyaW5rOiAwLFxyXG59O1xyXG5cclxuY29uc3QgZmFsbGJhY2tTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2NHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjQycHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggZGFzaGVkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC42KVwiLFxyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGNvbG9yOiBcIiM2NDc0OGJcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmOGZhZmNcIixcclxuICBmbGV4U2hyaW5rOiAwLFxyXG59O1xyXG5cclxuY29uc3QgdGV4dFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXHJcbiAgZ2FwOiBcIjJweFwiLFxyXG59O1xyXG5cclxuY29uc3QgUHJvZHVjdEltYWdlID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgaW1hZ2VVcmwgPSBwcm9wcz8ucmVjb3JkPy5wYXJhbXM/Lltwcm9wcz8ucHJvcGVydHk/LnBhdGhdO1xyXG4gIGNvbnN0IFtoYXNFcnJvciwgc2V0SGFzRXJyb3JdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgc2V0SGFzRXJyb3IoZmFsc2UpO1xyXG4gIH0sIFtpbWFnZVVybF0pO1xyXG5cclxuICBpZiAoIWltYWdlVXJsKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZmFsbGJhY2tTdHlsZX0+Tm8gaW1hZ2U8L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoaGFzRXJyb3IpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NlbGxTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17ZmFsbGJhY2tTdHlsZX0+SW52YWxpZDwvZGl2PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3RleHRTdHlsZX0+XHJcbiAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBcIiMwZjE3MmFcIiB9fT5JbWFnZSBVUkw8L3NwYW4+XHJcbiAgICAgICAgICA8YVxyXG4gICAgICAgICAgICBocmVmPXtpbWFnZVVybH1cclxuICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcclxuICAgICAgICAgICAgcmVsPVwibm9yZWZlcnJlclwiXHJcbiAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiIzI1NjNlYlwiLFxyXG4gICAgICAgICAgICAgIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIE9wZW4gbGlua1xyXG4gICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17Y2VsbFN0eWxlfT5cclxuICAgICAgPGltZ1xyXG4gICAgICAgIHNyYz17aW1hZ2VVcmx9XHJcbiAgICAgICAgYWx0PVwiUHJvZHVjdFwiXHJcbiAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9XHJcbiAgICAgICAgb25FcnJvcj17KCkgPT4gc2V0SGFzRXJyb3IodHJ1ZSl9XHJcbiAgICAgIC8+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3RleHRTdHlsZX0+XHJcbiAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogNjAwLCBjb2xvcjogXCIjMGYxNzJhXCIgfX0+UHJldmlldzwvc3Bhbj5cclxuICAgICAgICA8YVxyXG4gICAgICAgICAgaHJlZj17aW1hZ2VVcmx9XHJcbiAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgcmVsPVwibm9yZWZlcnJlclwiXHJcbiAgICAgICAgICBzdHlsZT17eyBjb2xvcjogXCIjMjU2M2ViXCIsIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIiwgZm9udFNpemU6IFwiMTJweFwiIH19XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgT3BlbiBpbWFnZVxyXG4gICAgICAgIDwvYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdEltYWdlO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3Qgd3JhcHBlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IHByZXZpZXdTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxNDBweFwiLFxyXG4gIGhlaWdodDogXCI5NnB4XCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IGhpbnRTdHlsZSA9IHtcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgY29sb3I6IFwiIzY0NzQ4YlwiLFxyXG59O1xyXG5cclxuY29uc3QgUHJvZHVjdEltYWdlVXBsb2FkID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgeyBvbkNoYW5nZSwgcmVjb3JkIH0gPSBwcm9wcztcclxuICBjb25zdCBjdXJyZW50VmFsdWUgPSByZWNvcmQ/LnBhcmFtcz8uaW1hZ2VVcmwgfHwgXCJcIjtcclxuICBjb25zdCBjdXJyZW50UHVibGljSWQgPSByZWNvcmQ/LnBhcmFtcz8uaW1hZ2VQdWJsaWNJZCB8fCBcIlwiO1xyXG4gIGNvbnN0IFtwcmV2aWV3VXJsLCBzZXRQcmV2aWV3VXJsXSA9IHVzZVN0YXRlKGN1cnJlbnRWYWx1ZSk7XHJcbiAgY29uc3QgW3B1YmxpY0lkLCBzZXRQdWJsaWNJZF0gPSB1c2VTdGF0ZShjdXJyZW50UHVibGljSWQpO1xyXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIHNldFByZXZpZXdVcmwoY3VycmVudFZhbHVlKTtcclxuICAgIHNldFB1YmxpY0lkKGN1cnJlbnRQdWJsaWNJZCk7XHJcbiAgfSwgW2N1cnJlbnRWYWx1ZSwgY3VycmVudFB1YmxpY0lkXSk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZVVwbG9hZCA9IGFzeW5jIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdO1xyXG5cclxuICAgIGlmICghZmlsZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VXBsb2FkaW5nKHRydWUpO1xyXG4gICAgc2V0RXJyb3IoXCJcIik7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgZm9ybURhdGEuYXBwZW5kKFwiaW1hZ2VcIiwgZmlsZSk7XHJcblxyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL2FwaS91cGxvYWRzL2ltYWdlXCIsIHtcclxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBheWxvYWQubWVzc2FnZSB8fCBcIkltYWdlIHVwbG9hZCBmYWlsZWRcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHVwbG9hZGVkVXJsID0gcGF5bG9hZC51cmwgfHwgXCJcIjtcclxuICAgICAgY29uc3QgdXBsb2FkZWRQdWJsaWNJZCA9IHBheWxvYWQucHVibGljSWQgfHwgXCJcIjtcclxuICAgICAgc2V0UHJldmlld1VybCh1cGxvYWRlZFVybCk7XHJcbiAgICAgIHNldFB1YmxpY0lkKHVwbG9hZGVkUHVibGljSWQpO1xyXG4gICAgICBvbkNoYW5nZT8uKFwiaW1hZ2VVcmxcIiwgdXBsb2FkZWRVcmwpO1xyXG4gICAgICBvbkNoYW5nZT8uKFwiaW1hZ2VQdWJsaWNJZFwiLCB1cGxvYWRlZFB1YmxpY0lkKTtcclxuICAgICAgb25DaGFuZ2U/LihcInVwbG9hZEltYWdlXCIsIHVwbG9hZGVkVXJsKTtcclxuICAgIH0gY2F0Y2ggKHVwbG9hZEVycm9yKSB7XHJcbiAgICAgIHNldEVycm9yKHVwbG9hZEVycm9yLm1lc3NhZ2UpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0VXBsb2FkaW5nKGZhbHNlKTtcclxuICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gXCJcIjtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBoYW5kbGVSZW1vdmUgPSAoKSA9PiB7XHJcbiAgICBzZXRQcmV2aWV3VXJsKFwiXCIpO1xyXG4gICAgc2V0UHVibGljSWQoXCJcIik7XHJcbiAgICBvbkNoYW5nZT8uKFwiaW1hZ2VVcmxcIiwgXCJcIik7XHJcbiAgICBvbkNoYW5nZT8uKFwiaW1hZ2VQdWJsaWNJZFwiLCBcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJ1cGxvYWRJbWFnZVwiLCBcIlwiKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17d3JhcHBlclN0eWxlfT5cclxuICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiIG9uQ2hhbmdlPXtoYW5kbGVVcGxvYWR9IC8+XHJcbiAgICAgIDxkaXYgc3R5bGU9e2hpbnRTdHlsZX0+XHJcbiAgICAgICAge3VwbG9hZGluZ1xyXG4gICAgICAgICAgPyBcIlVwbG9hZGluZyB0byBDbG91ZGluYXJ5Li4uXCJcclxuICAgICAgICAgIDogXCJDaG9vc2UgYW4gaW1hZ2UgZmlsZSB0byB1cGxvYWRcIn1cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICB7cHJldmlld1VybCA/IChcclxuICAgICAgICA8PlxyXG4gICAgICAgICAgPGltZyBzcmM9e3ByZXZpZXdVcmx9IGFsdD1cIlByb2R1Y3QgcHJldmlld1wiIHN0eWxlPXtwcmV2aWV3U3R5bGV9IC8+XHJcbiAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVSZW1vdmV9XHJcbiAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICAgICAgICAgICAgICBwYWRkaW5nOiBcIjZweCAxMHB4XCIsXHJcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjhweFwiLFxyXG4gICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgI2VmNDQ0NFwiLFxyXG4gICAgICAgICAgICAgIGNvbG9yOiBcIiNlZjQ0NDRcIixcclxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcIiNmZmZcIixcclxuICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBSZW1vdmUgaW1hZ2VcclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvPlxyXG4gICAgICApIDogbnVsbH1cclxuXHJcbiAgICAgIHtlcnJvciA/IChcclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IC4uLmhpbnRTdHlsZSwgY29sb3I6IFwiI2RjMjYyNlwiIH19PntlcnJvcn08L2Rpdj5cclxuICAgICAgKSA6IG51bGx9XHJcblxyXG4gICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJpbWFnZVVybFwiIHZhbHVlPXtwcmV2aWV3VXJsfSByZWFkT25seSAvPlxyXG4gICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJpbWFnZVB1YmxpY0lkXCIgdmFsdWU9e3B1YmxpY0lkfSByZWFkT25seSAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RJbWFnZVVwbG9hZDtcclxuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgRGFzaGJvYXJkIGZyb20gJy4uL2FkbWluL2Rhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGFzaGJvYXJkID0gRGFzaGJvYXJkXG5pbXBvcnQgUmVnaXN0ZXIgZnJvbSAnLi4vYWRtaW4vcmVnaXN0ZXInXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlJlZ2lzdGVyID0gUmVnaXN0ZXJcbmltcG9ydCBQcm9kdWN0Q2FyZHNMaXN0IGZyb20gJy4uL2FkbWluL3Byb2R1Y3QtY2FyZHMtbGlzdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdENhcmRzTGlzdCA9IFByb2R1Y3RDYXJkc0xpc3RcbmltcG9ydCBQcm9kdWN0U2hvdyBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LXNob3cnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RTaG93ID0gUHJvZHVjdFNob3dcbmltcG9ydCBPcmRlckNyZWF0ZSBmcm9tICcuLi9hZG1pbi9vcmRlci1jcmVhdGUnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLk9yZGVyQ3JlYXRlID0gT3JkZXJDcmVhdGVcbmltcG9ydCBPcmRlclNob3cgZnJvbSAnLi4vYWRtaW4vb3JkZXItc2hvdydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuT3JkZXJTaG93ID0gT3JkZXJTaG93XG5pbXBvcnQgT3JkZXJJdGVtU2hvdyBmcm9tICcuLi9hZG1pbi9vcmRlci1pdGVtLXNob3cnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLk9yZGVySXRlbVNob3cgPSBPcmRlckl0ZW1TaG93XG5pbXBvcnQgUHJvZHVjdEltYWdlIGZyb20gJy4uL2FkbWluL3Byb2R1Y3QtaW1hZ2UnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RJbWFnZSA9IFByb2R1Y3RJbWFnZVxuaW1wb3J0IFByb2R1Y3RJbWFnZVVwbG9hZCBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LWltYWdlLXVwbG9hZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdEltYWdlVXBsb2FkID0gUHJvZHVjdEltYWdlVXBsb2FkIl0sIm5hbWVzIjpbImZvcm1hdEN1cnJlbmN5IiwidmFsdWUiLCJOdW1iZXIiLCJ0b0xvY2FsZVN0cmluZyIsIkRhc2hib2FyZCIsImRhdGEiLCJzZXREYXRhIiwidXNlU3RhdGUiLCJ1c2VycyIsImNhdGVnb3JpZXMiLCJwcm9kdWN0cyIsIm9yZGVycyIsInJldmVudWUiLCJmZWF0dXJlZEdlbXMiLCJjcml0aWNhbFN0b2NrIiwicmVjZW50UHJvZHVjdHMiLCJjYXRlZ29yeURpc3RyaWJ1dGlvbiIsInVzZUVmZmVjdCIsImxvYWREYXNoYm9hcmQiLCJyZXNwb25zZSIsImZldGNoIiwicGF5bG9hZCIsImpzb24iLCJ0b3BDYXRlZ29yaWVzIiwidXNlTWVtbyIsImRpc3RyaWJ1dGlvbiIsIm1heCIsIk1hdGgiLCJtYXAiLCJpdGVtIiwiY291bnQiLCJ3aWR0aCIsInJvdW5kIiwiY29tcGxldGlvblJhdGUiLCJ0b3RhbCIsImhlYWx0aHkiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJzdHlsZSIsImxlbmd0aCIsImNhdGVnb3J5Iiwia2V5IiwibmFtZSIsIm1hcmdpblRvcCIsInByb2R1Y3QiLCJpZCIsIkRhdGUiLCJjcmVhdGVkQXQiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJwcmljZSIsIlJlZ2lzdGVyIiwiZm9ybVN0YXRlIiwic2V0Rm9ybVN0YXRlIiwiZW1haWwiLCJwYXNzd29yZCIsIm1lc3NhZ2UiLCJzZXRNZXNzYWdlIiwidHlwZSIsInRleHQiLCJpc1N1Ym1pdHRpbmciLCJzZXRJc1N1Ym1pdHRpbmciLCJkb2N1bWVudCIsImJvZHkiLCJtYXJnaW4iLCJoYW5kbGVDaGFuZ2UiLCJldmVudCIsImN1cnJlbnQiLCJ0YXJnZXQiLCJoYW5kbGVTdWJtaXQiLCJwcmV2ZW50RGVmYXVsdCIsIm1ldGhvZCIsImhlYWRlcnMiLCJKU09OIiwic3RyaW5naWZ5Iiwib2siLCJFcnJvciIsInNldFRpbWVvdXQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJlcnJvciIsIm9uU3VibWl0IiwiaHRtbEZvciIsInBsYWNlaG9sZGVyIiwib25DaGFuZ2UiLCJyZXF1aXJlZCIsIm1pbkxlbmd0aCIsImRpc2FibGVkIiwiZ3JpZFN0eWxlIiwiZGlzcGxheSIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJnYXAiLCJjYXJkU3R5bGUiLCJib3JkZXJSYWRpdXMiLCJib3JkZXIiLCJiYWNrZ3JvdW5kIiwiY29sb3IiLCJvdmVyZmxvdyIsImJveFNoYWRvdyIsImltYWdlV3JhcFN0eWxlIiwiaGVpZ2h0IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwicGFkZGluZyIsImltYWdlU3R5bGUiLCJvYmplY3RGaXQiLCJib2R5U3R5bGUiLCJtZXRhU3R5bGUiLCJmb250U2l6ZSIsImJhZGdlU3R5bGUiLCJpc0FjdGl2ZSIsImZvbnRXZWlnaHQiLCJsZXR0ZXJTcGFjaW5nIiwibGlua1N0eWxlIiwidGV4dERlY29yYXRpb24iLCJjdXJzb3IiLCJlbXB0eVN0eWxlIiwiZm9ybWF0UHJpY2UiLCJhbW91bnQiLCJpc0Zpbml0ZSIsInVuZGVmaW5lZCIsIm1pbmltdW1GcmFjdGlvbkRpZ2l0cyIsIm1heGltdW1GcmFjdGlvbkRpZ2l0cyIsImdldFJlY29yZElkIiwicmVjb3JkIiwicGFyYW1zIiwicGFyYW0iLCJnZXRTaG93SHJlZiIsInJlc291cmNlSWQiLCJyZWNvcmRBY3Rpb25zIiwiYWN0aW9ucyIsInNob3dBY3Rpb24iLCJmaW5kIiwiYWN0aW9uIiwicmF3SHJlZiIsImVuY29kZVVSSUNvbXBvbmVudCIsIlByb2R1Y3RDYXJkc0xpc3QiLCJwcm9wcyIsImFwaVJlY29yZHMiLCJzZXRBcGlSZWNvcmRzIiwibG9hZGluZyIsInNldExvYWRpbmciLCJsb2FkRXJyb3IiLCJzZXRMb2FkRXJyb3IiLCJyZXNvdXJjZSIsInByb3BSZWNvcmRzIiwicmVjb3JkcyIsImlzTW91bnRlZCIsImxvYWRSZWNvcmRzIiwiY3JlZGVudGlhbHMiLCJjYXRlZ29yeUlkIiwiaW1hZ2VVcmwiLCJzdG9jayIsIkJvb2xlYW4iLCJkZXRhaWxzSHJlZiIsIm9wZW5EZXRhaWxzIiwiYXNzaWduIiwic3JjIiwiYWx0Iiwib25DbGljayIsInBhZ2VTdHlsZSIsImhlcm9TdHlsZSIsInBhbmVsU3R5bGUiLCJtaW5IZWlnaHQiLCJoZXJvQm9keVN0eWxlIiwidGl0bGVTdHlsZSIsImxpbmVIZWlnaHQiLCJzdWJ0aXRsZVN0eWxlIiwiYWN0aXZlIiwic3RhdHNHcmlkU3R5bGUiLCJzdGF0Q2FyZFN0eWxlIiwic3RhdExhYmVsU3R5bGUiLCJ0ZXh0VHJhbnNmb3JtIiwibWFyZ2luQm90dG9tIiwic3RhdFZhbHVlU3R5bGUiLCJ3b3JkQnJlYWsiLCJzZWN0aW9uR3JpZFN0eWxlIiwic2VjdGlvblRpdGxlU3R5bGUiLCJjb250ZW50Q2FyZFN0eWxlIiwiaW5mb0xpc3RTdHlsZSIsImluZm9Sb3dTdHlsZSIsInBhZGRpbmdCb3R0b20iLCJib3JkZXJCb3R0b20iLCJpbmZvTGFiZWxTdHlsZSIsImluZm9WYWx1ZVN0eWxlIiwidGV4dEFsaWduIiwiZGVzY3JpcHRpb25TdHlsZSIsIndoaXRlU3BhY2UiLCJidXR0b25TdHlsZSIsInRyYW5zaXRpb24iLCJidXR0b25Ib3ZlclN0eWxlIiwidHJhbnNmb3JtIiwiZm9ybWF0RGF0ZSIsImRhdGUiLCJpc05hTiIsImdldFRpbWUiLCJTdHJpbmciLCJkYXRlU3R5bGUiLCJ0aW1lU3R5bGUiLCJQcm9kdWN0U2hvdyIsInNrdSIsImRlc2NyaXB0aW9uIiwiYnV0dG9uSG92ZXJlZCIsInNldEJ1dHRvbkhvdmVyZWQiLCJoYW5kbGVPcmRlckNsaWNrIiwicHJvZHVjdElkIiwibmV3T3JkZXJVcmwiLCJvbk1vdXNlRW50ZXIiLCJvbk1vdXNlTGVhdmUiLCJ0aXRsZSIsInhtbG5zIiwidmlld0JveCIsImZpbGwiLCJzdHJva2UiLCJzdHJva2VXaWR0aCIsInN0cm9rZUxpbmVjYXAiLCJzdHJva2VMaW5lam9pbiIsImN4IiwiY3kiLCJyIiwiZCIsInVwZGF0ZWRBdCIsImhlYWRlclN0eWxlIiwiZGVzY1N0eWxlIiwibGF5b3V0U3R5bGUiLCJzdGFja1N0eWxlIiwibGFiZWxTdHlsZSIsImlucHV0U3R5bGUiLCJmb250RmFtaWx5Iiwicm93U3R5bGUiLCJncmlkMlN0eWxlIiwiY3VzdG9tZXJJbmZvU3R5bGUiLCJjdXN0b21lclJvd1N0eWxlIiwibXV0ZWRTdHlsZSIsInN0cm9uZ1N0eWxlIiwibGluZUl0ZW1Sb3dTdHlsZSIsImxpbmVJdGVtVG9wU3R5bGUiLCJwcm9kdWN0UHJldmlld1N0eWxlIiwiYWRkQnV0dG9uU3R5bGUiLCJyZW1vdmVCdXR0b25TdHlsZSIsInRvdGFsc1Jvd1N0eWxlIiwidG90YWxTdHlsZSIsInBhZGRpbmdUb3AiLCJhY3Rpb25CYXJTdHlsZSIsImFjdGlvbkJ1dHRvblN0eWxlIiwicHJpbWFyeSIsIm1hcExpbmtTdHlsZSIsInJlc3BvbnNpdmVDc3MiLCJwYXltZW50T3B0aW9ucyIsInNoaXBwaW5nTWV0aG9kcyIsInRvTnVtYmVyIiwibnVtIiwiZm9ybWF0TW9uZXkiLCJjcmVhdGVFbXB0eUl0ZW0iLCJxdWFudGl0eSIsInVuaXRQcmljZSIsIk9yZGVyQ3JlYXRlIiwic2V0VXNlcnMiLCJzZXRQcm9kdWN0cyIsIm9yZGVyQ291bnRCeVVzZXIiLCJzZXRPcmRlckNvdW50QnlVc2VyIiwic2Vzc2lvblVzZXIiLCJzZXRTZXNzaW9uVXNlciIsInN1Ym1pdHRpbmciLCJzZXRTdWJtaXR0aW5nIiwiZm9ybURhdGEiLCJzZXRGb3JtRGF0YSIsInVzZXJJZCIsInN0YXR1cyIsInBheW1lbnRNZXRob2QiLCJwYXltZW50U3RhdHVzIiwidHJhbnNhY3Rpb25JZCIsInNoaXBwaW5nQWRkcmVzcyIsInNoaXBwaW5nTWV0aG9kIiwidHJhY2tpbmdOdW1iZXIiLCJzaGlwcGluZ0ZlZSIsInRheCIsImRpc2NvdW50IiwibGluZUl0ZW1zIiwic2V0TGluZUl0ZW1zIiwiVVJMU2VhcmNoUGFyYW1zIiwic2VhcmNoIiwicHJlUHJvZHVjdElkIiwiZ2V0IiwiZmV0Y2hEYXRhIiwiY29udGV4dFJlcyIsImNvbnRleHREYXRhIiwidXNlcnNEYXRhIiwiQXJyYXkiLCJpc0FycmF5IiwicHJvZHVjdHNMaXN0IiwiY3VycmVudFVzZXIiLCJwcmV2Iiwic2VsZWN0ZWRQcm9kdWN0Iiwic29tZSIsInAiLCJzZWxlY3RlZCIsInNlbGVjdGVkQ3VzdG9tZXIiLCJ1IiwiY3VzdG9tZXJPcmRlckNvdW50IiwibGluZVRvdGFscyIsInN1YnRvdGFsIiwicmVkdWNlIiwic3VtIiwiZ3JhbmRUb3RhbCIsImhhbmRsZUZvcm1DaGFuZ2UiLCJoYW5kbGVMaW5lSXRlbUNoYW5nZSIsImluZGV4IiwibmV4dCIsImFkZExpbmVJdGVtIiwicmVtb3ZlTGluZUl0ZW0iLCJmaWx0ZXIiLCJfIiwiaSIsIm1hcHNIcmVmIiwidHJpbSIsInZhbGlkSXRlbXMiLCJhbGVydCIsIm9yZGVyUGF5bG9hZCIsInRvRml4ZWQiLCJ0b3RhbEFtb3VudCIsInN1Ym1pdEZvcm0iLCJGb3JtRGF0YSIsImFwcGVuZCIsIm9yZGVyUmVzIiwib3JkZXJEYXRhIiwicm9sZSIsInVzZXIiLCJwaG9uZSIsIm1vYmlsZSIsIml0ZW1Ub3RhbCIsIm1pbiIsInN0ZXAiLCJyZXNpemUiLCJyZWwiLCJoaXN0b3J5IiwiYmFjayIsImhlYWRpbmdTdHlsZSIsInN1YlRleHRTdHlsZSIsInZhbCIsInRvTG93ZXJDYXNlIiwic3R5bGVCeVN0YXR1cyIsInBlbmRpbmciLCJiZyIsImZnIiwicGFpZCIsInByb2Nlc3NpbmciLCJzaGlwcGVkIiwiY29tcGxldGVkIiwiY2FuY2VsbGVkIiwiaW5mb0dyaWRTdHlsZSIsInRhYmxlU3R5bGUiLCJsaW5lSXRlbVN0eWxlIiwidG90YWxCb3hTdHlsZSIsInRvdGFsUm93U3R5bGUiLCJncmFuZFN0eWxlIiwibiIsImR0IiwiT3JkZXJTaG93IiwiZGV0YWlscyIsInNldERldGFpbHMiLCJzZXRFcnJvciIsIm9yZGVySWQiLCJsb2FkRGV0YWlscyIsImZldGNoRXJyb3IiLCJ0b3RhbHMiLCJpdGVtcyIsInRvdGFsUHJpY2UiLCJlbXB0eUltYWdlU3R5bGUiLCJPcmRlckl0ZW1TaG93Iiwib3JkZXJJdGVtSWQiLCJjYWxjdWxhdGVkVG90YWwiLCJvcmRlciIsImN1c3RvbWVyIiwiY2VsbFN0eWxlIiwiZmxleFNocmluayIsImZhbGxiYWNrU3R5bGUiLCJ0ZXh0U3R5bGUiLCJmbGV4RGlyZWN0aW9uIiwiUHJvZHVjdEltYWdlIiwicHJvcGVydHkiLCJwYXRoIiwiaGFzRXJyb3IiLCJzZXRIYXNFcnJvciIsIm9uRXJyb3IiLCJ3cmFwcGVyU3R5bGUiLCJwcmV2aWV3U3R5bGUiLCJoaW50U3R5bGUiLCJQcm9kdWN0SW1hZ2VVcGxvYWQiLCJjdXJyZW50VmFsdWUiLCJjdXJyZW50UHVibGljSWQiLCJpbWFnZVB1YmxpY0lkIiwicHJldmlld1VybCIsInNldFByZXZpZXdVcmwiLCJwdWJsaWNJZCIsInNldFB1YmxpY0lkIiwidXBsb2FkaW5nIiwic2V0VXBsb2FkaW5nIiwiaGFuZGxlVXBsb2FkIiwiZmlsZSIsImZpbGVzIiwidXBsb2FkZWRVcmwiLCJ1cmwiLCJ1cGxvYWRlZFB1YmxpY0lkIiwidXBsb2FkRXJyb3IiLCJoYW5kbGVSZW1vdmUiLCJhY2NlcHQiLCJGcmFnbWVudCIsInJlYWRPbmx5IiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBRUEsTUFBTUEsZ0JBQWMsR0FBSUMsS0FBSyxJQUFLO0lBQ2hDLE9BQU8sQ0FBQSxHQUFBLEVBQU1DLE1BQU0sQ0FBQ0QsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDRSxjQUFjLEVBQUUsQ0FBQSxDQUFFO0VBQ3BELENBQUM7RUFFRCxNQUFNQyxTQUFTLEdBQUdBLE1BQU07RUFDdEIsRUFBQSxNQUFNLENBQUNDLElBQUksRUFBRUMsT0FBTyxDQUFDLEdBQUdDLGNBQVEsQ0FBQztFQUMvQkMsSUFBQUEsS0FBSyxFQUFFLENBQUM7RUFDUkMsSUFBQUEsVUFBVSxFQUFFLENBQUM7RUFDYkMsSUFBQUEsUUFBUSxFQUFFLENBQUM7RUFDWEMsSUFBQUEsTUFBTSxFQUFFLENBQUM7RUFDVEMsSUFBQUEsT0FBTyxFQUFFLENBQUM7RUFDVkMsSUFBQUEsWUFBWSxFQUFFLENBQUM7RUFDZkMsSUFBQUEsYUFBYSxFQUFFLENBQUM7RUFDaEJDLElBQUFBLGNBQWMsRUFBRSxFQUFFO0VBQ2xCQyxJQUFBQSxvQkFBb0IsRUFBRTtFQUN4QixHQUFDLENBQUM7RUFFRkMsRUFBQUEsZUFBUyxDQUFDLE1BQU07RUFDZCxJQUFBLE1BQU1DLGFBQWEsR0FBRyxZQUFZO0VBQ2hDLE1BQUEsTUFBTUMsUUFBUSxHQUFHLE1BQU1DLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQztFQUNwRCxNQUFBLE1BQU1DLE9BQU8sR0FBRyxNQUFNRixRQUFRLENBQUNHLElBQUksRUFBRTtFQUNyQ2hCLE1BQUFBLE9B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RUFBUSxPQUFDLENBQUM7UUFDbERLLGVBQWUsQ0FBQyxLQUFLLENBQUM7RUFDeEIsSUFBQTtJQUNGLENBQUM7SUFFRCxvQkFDRXpCLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsSUFBQUEsU0FBUyxFQUFDO0tBQWUsZUFDNUJGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxPQUFBLEVBQUEsSUFBQSxFQUFRO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFBLENBQWUsQ0FBQyxlQUVWRCxzQkFBQSxDQUFBQyxhQUFBLENBQUEsS0FBQSxFQUFBO0VBQUtDLElBQUFBLFNBQVMsRUFBQztLQUFlLGVBQzVCRixzQkFBQSxDQUFBQyxhQUFBLENBQUEsS0FBQSxFQUFBO0VBQUtD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
