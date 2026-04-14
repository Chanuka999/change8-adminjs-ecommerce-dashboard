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
  AdminJS.UserComponents.Register = Register;
  AdminJS.UserComponents.ProductCardsList = ProductCardsList;
  AdminJS.UserComponents.ProductShow = ProductShow;
  AdminJS.UserComponents.OrderCreate = OrderCreate;
  AdminJS.UserComponents.OrderShow = OrderShow;
  AdminJS.UserComponents.OrderItemShow = OrderItemShow;
  AdminJS.UserComponents.ProductImage = ProductImage;
  AdminJS.UserComponents.ProductImageUpload = ProductImageUpload;
  AdminJS.UserComponents.CategoryShow = CategoryShow;
  AdminJS.UserComponents.OrderShow = OrderShow;
  AdminJS.UserComponents.OrderItemShow = OrderItemShow;

})(React);

