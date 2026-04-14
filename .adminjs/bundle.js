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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9hZG1pbi9kYXNoYm9hcmQuanN4IiwiLi4vYWRtaW4vcmVnaXN0ZXIuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1jYXJkcy1saXN0LmpzeCIsIi4uL2FkbWluL3Byb2R1Y3Qtc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1jcmVhdGUuanN4IiwiLi4vYWRtaW4vb3JkZXItc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1pdGVtLXNob3cuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS5qc3giLCIuLi9hZG1pbi9wcm9kdWN0LWltYWdlLXVwbG9hZC5qc3giLCIuLi9hZG1pbi9jYXRlZ29yeS1zaG93LmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBmb3JtYXRDdXJyZW5jeSA9ICh2YWx1ZSkgPT4ge1xyXG4gIHJldHVybiBgUnMuJHtOdW1iZXIodmFsdWUgfHwgMCkudG9Mb2NhbGVTdHJpbmcoKX1gO1xyXG59O1xyXG5cclxuY29uc3QgRGFzaGJvYXJkID0gKCkgPT4ge1xyXG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKHtcclxuICAgIHVzZXJzOiAwLFxyXG4gICAgY2F0ZWdvcmllczogMCxcclxuICAgIHByb2R1Y3RzOiAwLFxyXG4gICAgb3JkZXJzOiAwLFxyXG4gICAgcmV2ZW51ZTogMCxcclxuICAgIGZlYXR1cmVkR2VtczogMCxcclxuICAgIGNyaXRpY2FsU3RvY2s6IDAsXHJcbiAgICByZWNlbnRQcm9kdWN0czogW10sXHJcbiAgICBjYXRlZ29yeURpc3RyaWJ1dGlvbjogW10sXHJcbiAgfSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBsb2FkRGFzaGJvYXJkID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL2FkbWluL2FwaS9kYXNoYm9hcmRcIik7XHJcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIHNldERhdGEocGF5bG9hZCB8fCB7fSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWREYXNoYm9hcmQoKTtcclxuICB9LCBbXSk7XHJcblxyXG4gIGNvbnN0IHRvcENhdGVnb3JpZXMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IGRhdGEuY2F0ZWdvcnlEaXN0cmlidXRpb24gfHwgW107XHJcbiAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi5kaXN0cmlidXRpb24ubWFwKChpdGVtKSA9PiBpdGVtLmNvdW50KSwgMSk7XHJcblxyXG4gICAgcmV0dXJuIGRpc3RyaWJ1dGlvbi5tYXAoKGl0ZW0pID0+ICh7XHJcbiAgICAgIC4uLml0ZW0sXHJcbiAgICAgIHdpZHRoOiBgJHtNYXRoLm1heCg4LCBNYXRoLnJvdW5kKChpdGVtLmNvdW50IC8gbWF4KSAqIDEwMCkpfSVgLFxyXG4gICAgfSkpO1xyXG4gIH0sIFtkYXRhLmNhdGVnb3J5RGlzdHJpYnV0aW9uXSk7XHJcblxyXG4gIGNvbnN0IGNvbXBsZXRpb25SYXRlID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBjb25zdCB0b3RhbCA9IE51bWJlcihkYXRhLnByb2R1Y3RzIHx8IDApO1xyXG4gICAgaWYgKHRvdGFsID09PSAwKSB7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGhlYWx0aHkgPSBNYXRoLm1heCh0b3RhbCAtIE51bWJlcihkYXRhLmNyaXRpY2FsU3RvY2sgfHwgMCksIDApO1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQoKGhlYWx0aHkgLyB0b3RhbCkgKiAxMDApO1xyXG4gIH0sIFtkYXRhLnByb2R1Y3RzLCBkYXRhLmNyaXRpY2FsU3RvY2tdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1kYXNoYm9hcmRcIj5cclxuICAgICAgPHN0eWxlPntgXHJcbiAgICAgICAgLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgIC0tYmctMTogdmFyKC0tY2hhbmdlOC1iZy0xLCAjMDUwOTE0KTtcclxuICAgICAgICAgIC0tYmctMjogdmFyKC0tY2hhbmdlOC1iZy0yLCAjMGIxYTM4KTtcclxuICAgICAgICAgIC0tZ3JhZC1lbmQ6IHZhcigtLWNoYW5nZTgtZ3JhZC1lbmQsICMwNDA3MGYpO1xyXG4gICAgICAgICAgLS1nb2xkOiB2YXIoLS1jaGFuZ2U4LWdvbGQsICNlMmJmNjYpO1xyXG4gICAgICAgICAgLS10ZXh0LW1haW46IHZhcigtLWNoYW5nZTgtdGV4dC1tYWluLCAjZjhmYWZjKTtcclxuICAgICAgICAgIC0tdGV4dC1tdXRlZDogdmFyKC0tY2hhbmdlOC10ZXh0LW11dGVkLCAjOWFhOGMxKTtcclxuICAgICAgICAgIC0tbGluZTogdmFyKC0tY2hhbmdlOC1saW5lLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMjIpKTtcclxuICAgICAgICAgIC0tY2FyZC1iZzogdmFyKC0tY2hhbmdlOC1jYXJkLWJnLCBsaW5lYXItZ3JhZGllbnQoMTYwZGVnLCByZ2JhKDIxLCAzNCwgNjYsIDAuOTYpIDAlLCByZ2JhKDEwLCAxOCwgMzYsIDAuOTYpIDEwMCUpKTtcclxuICAgICAgICAgIC0tc2hhZG93OiB2YXIoLS1jaGFuZ2U4LXNoYWRvdywgMCA4cHggMjZweCByZ2JhKDAsIDAsIDAsIDAuMykpO1xyXG4gICAgICAgICAgLS1yYWRpYWwtMTogdmFyKC0tY2hhbmdlOC1yYWRpYWwtMSwgcmdiYSgzNCwgOTMsIDE4MCwgMC4zNSkpO1xyXG4gICAgICAgICAgLS1yYWRpYWwtMjogdmFyKC0tY2hhbmdlOC1yYWRpYWwtMiwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjE2KSk7XHJcblxyXG4gICAgICAgICAgbWluLWhlaWdodDogMTAwdmg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAzNnB4O1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbWFpbik7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOlxyXG4gICAgICAgICAgICByYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDglIDAlLCB2YXIoLS1yYWRpYWwtMSkgMCUsIHJnYmEoMzQsIDkzLCAxODAsIDApIDM4JSksXHJcbiAgICAgICAgICAgIHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgODUlIDEyJSwgdmFyKC0tcmFkaWFsLTIpIDAlLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDApIDQyJSksXHJcbiAgICAgICAgICAgIGxpbmVhci1ncmFkaWVudCgxMjBkZWcsIHZhcigtLWJnLTEpIDAlLCB2YXIoLS1iZy0yKSA0OCUsIHZhcigtLWdyYWQtZW5kKSAxMDAlKTtcclxuICAgICAgICAgIGZvbnQtZmFtaWx5OiBcIlBvcHBpbnNcIiwgXCJTZWdvZSBVSVwiLCBzYW5zLXNlcmlmO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jaGFuZ2U4LWRhc2hib2FyZCB7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtYmctMTogI2YwZjZmZjtcclxuICAgICAgICAgIC0tY2hhbmdlOC1iZy0yOiAjZmZmZmZmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWdyYWQtZW5kOiAjZjhmYmZmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWdvbGQ6ICNjMDhiMGY7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtdGV4dC1tYWluOiAjMGYxNzJhO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXRleHQtbXV0ZWQ6ICM0NzU1Njk7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtbGluZTogcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgICAgICAgIC0tY2hhbmdlOC1jYXJkLWJnOiAjZmZmZmZmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXNoYWRvdzogMCA0cHggMjBweCByZ2JhKDE1LCAyMywgNDIsIDAuMDYpO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXJhZGlhbC0xOiByZ2JhKDM0LCA5MywgMTgwLCAwLjA4KTtcclxuICAgICAgICAgIC0tY2hhbmdlOC1yYWRpYWwtMjogcmdiYSgxOTIsIDEzOSwgMTUsIDAuMDUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtZGFzaGJvYXJkLWlubmVyIHtcclxuICAgICAgICAgIHdpZHRoOiBtaW4oMTAwJSwgMTQ0MHB4KTtcclxuICAgICAgICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtaGVhZGVyIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XHJcbiAgICAgICAgICBhbmltYXRpb246IGZhZGUtdXAgNTIwbXMgZWFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWtpY2tlciB7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4zNmVtO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC10aXRsZSB7XHJcbiAgICAgICAgICBtYXJnaW46IDhweCAwIDZweDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjA2O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogY2xhbXAoMzJweCwgNXZ3LCA1NnB4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXN1YnRpdGxlIHtcclxuICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LW1ldHJpYy1ncmlkIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCg0LCBtaW5tYXgoMTcwcHgsIDFmcikpO1xyXG4gICAgICAgICAgZ2FwOiAyMnB4O1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMjRweDtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDQ4cHg7XHJcbiAgICAgICAgICBwYWRkaW5nLWJvdHRvbTogMjBweDtcclxuICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMTIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jaGFuZ2U4LW1ldHJpYy1ncmlkIHtcclxuICAgICAgICAgIGJvcmRlci1ib3R0b20tY29sb3I6IHJnYmEoMTUsIDIzLCA0MiwgMC4xKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQge1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAyNHB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMjRweCAyNHB4IDIycHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jYXJkLWJnKTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IHZhcigtLXNoYWRvdyk7XHJcbiAgICAgICAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoNHB4KTtcclxuICAgICAgICAgIGFuaW1hdGlvbjogZmFkZS11cCA1NjBtcyBlYXNlO1xyXG4gICAgICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDE4MG1zIGVhc2UsIGJvcmRlci1jb2xvciAxODBtcyBlYXNlLCBib3gtc2hhZG93IDE4MG1zIGVhc2U7XHJcbiAgICAgICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQ6aG92ZXIge1xyXG4gICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00cHgpO1xyXG4gICAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMzQpO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCAxNnB4IDM0cHggcmdiYSgwLCAwLCAwLCAwLjM0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQtbGFiZWwge1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjE4ZW07XHJcbiAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiA4cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1jYXJkLXZhbHVlIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogY2xhbXAoMjRweCwgMi44dncsIDM4cHgpO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAwLjk1O1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IC0wLjAzZW07XHJcbiAgICAgICAgICBvdmVyZmxvdy13cmFwOiBhbnl3aGVyZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQtaGludCB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAxMnB4O1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDEuNTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQtLXN0YWNrZWQge1xyXG4gICAgICAgICAgZ2FwOiAycHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1jYXJkLS1zdGFja2VkIC5jaGFuZ2U4LWNhcmQtaGludCB7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiA2cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1sYXlvdXQge1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcclxuICAgICAgICAgIGdhcDogMjhweDtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDMycHg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogc3RhcnQ7XHJcbiAgICAgICAgICBwYWRkaW5nLXRvcDogMTJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWZ1bGwtd2lkdGgtc2VjdGlvbiB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtY2FyZC0tdGFsbCB7XHJcbiAgICAgICAgICBtaW4taGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgcGFkZGluZy1ib3R0b206IDI0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zZWN0aW9uLWRpdmlkZXIge1xyXG4gICAgICAgICAgaGVpZ2h0OiAxcHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjI2LCAxOTEsIDEwMiwgMCksIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4yOCksIHJnYmEoMjI2LCAxOTEsIDEwMiwgMCkpO1xyXG4gICAgICAgICAgbWFyZ2luOiAyMHB4IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9ncmVzcy13cmFwIHtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDE2cHg7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZ3Jlc3MtaGVhZCB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDZweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2dyZXNzLXRyYWNrIHtcclxuICAgICAgICAgIGhlaWdodDogMTJweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEyKTtcclxuICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNoYW5nZTgtcHJvZ3Jlc3MtdHJhY2sge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNSwgMjMsIDQyLCAwLjEyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2dyZXNzLWZpbGwge1xyXG4gICAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsICNmNWRmOTAgMCUsICNlMmJmNjYgMTAwJSk7XHJcbiAgICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCAzMjBtcyBlYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcmVjZW50LWxpc3Qge1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMTRweDtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBnYXA6IDEwcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1yZWNlbnQtaXRlbSB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGdhcDogMTZweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDE0cHggMDtcclxuICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNoYW5nZTgtcmVjZW50LWl0ZW0ge1xyXG4gICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4xMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1yZWNlbnQtaXRlbTpsYXN0LWNoaWxkIHtcclxuICAgICAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1uYW1lIHtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1kYXRlIHtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByaWNlIHtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQGtleWZyYW1lcyBmYWRlLXVwIHtcclxuICAgICAgICAgIGZyb20ge1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoOHB4KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRvIHtcclxuICAgICAgICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDExODBweCkge1xyXG4gICAgICAgICAgLmNoYW5nZTgtbWV0cmljLWdyaWQge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCBtaW5tYXgoMTgwcHgsIDFmcikpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWxheW91dCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA3MjBweCkge1xyXG4gICAgICAgICAgLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMjBweCAxNnB4IDI4cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbWV0cmljLWdyaWQge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgICAgICAgICAgZ2FwOiAxNnB4O1xyXG4gICAgICAgICAgICBtYXJnaW4tdG9wOiAxOHB4O1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWxheW91dCB7XHJcbiAgICAgICAgICAgIGdhcDogMTZweDtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMThweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMjBweCAxOHB4IDE4cHg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBgfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtZGFzaGJvYXJkLWlubmVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWhlYWRlclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWtpY2tlclwiPlNlY3Rpb24gVmlldzwvZGl2PlxyXG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImNoYW5nZTgtdGl0bGVcIj5EYXNoYm9hcmQ8L2gxPlxyXG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiY2hhbmdlOC1zdWJ0aXRsZVwiPlxyXG4gICAgICAgICAgICBUcmFjayB5b3VyIGNvbW1lcmNlIGhlYWx0aCBhdCBhIGdsYW5jZSB3aXRoIGxpdmUgaW52ZW50b3J5IGFuZCBvcmRlclxyXG4gICAgICAgICAgICBzaWduYWxzLlxyXG4gICAgICAgICAgPC9wPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbWV0cmljLWdyaWRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkIGNoYW5nZTgtY2FyZC0tc3RhY2tlZFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPlJldmVudWUgU3RyZWFtPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+XHJcbiAgICAgICAgICAgICAge2Zvcm1hdEN1cnJlbmN5KGRhdGEucmV2ZW51ZSl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+QWNyb3NzIGFsbCBvcmRlcnM8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkIGNoYW5nZTgtY2FyZC0tc3RhY2tlZFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPkludmVudG9yeSBTaXplPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+e2RhdGEucHJvZHVjdHMgfHwgMH08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPlRvdGFsIGFjdGl2ZSBjYXRhbG9nIGl0ZW1zPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZCBjaGFuZ2U4LWNhcmQtLXN0YWNrZWRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5GZWF0dXJlZCBHZW1zPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+e2RhdGEuZmVhdHVyZWRHZW1zIHx8IDB9PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5DdXJyZW50bHkgdmlzaWJsZSBwcm9kdWN0czwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQgY2hhbmdlOC1jYXJkLS1zdGFja2VkXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+Q3JpdGljYWwgU3RvY2s8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtdmFsdWVcIj57ZGF0YS5jcml0aWNhbFN0b2NrIHx8IDB9PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5JdGVtcyBuZWVkaW5nIHVyZ2VudCByZWZpbGw8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbGF5b3V0XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZCBjaGFuZ2U4LWNhcmQtLXRhbGxcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5DYXRlZ29yeSBEaXN0cmlidXRpb248L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPkludmVudG9yeSBzcGxpdCBieSBzZWdtZW50PC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtc2VjdGlvbi1kaXZpZGVyXCIgLz5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9ncmVzcy13cmFwXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWhlYWRcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuPkhlYWx0aHkgc3RvY2sgbGV2ZWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3Ryb25nPntjb21wbGV0aW9uUmF0ZX0lPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLXRyYWNrXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtZmlsbFwiXHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBgJHtjb21wbGV0aW9uUmF0ZX0lYCB9fVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICB7KHRvcENhdGVnb3JpZXMgfHwgW10pLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+Tm8gY2F0ZWdvcnkgZGF0YSB5ZXQuPC9kaXY+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgKHRvcENhdGVnb3JpZXMgfHwgW10pLm1hcCgoY2F0ZWdvcnkpID0+IChcclxuICAgICAgICAgICAgICAgIDxkaXYga2V5PXtjYXRlZ29yeS5uYW1lfSBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLXdyYXBcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWhlYWRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57Y2F0ZWdvcnkubmFtZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz57Y2F0ZWdvcnkuY291bnR9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtdHJhY2tcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWZpbGxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IGNhdGVnb3J5LndpZHRoIH19XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApKVxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQgY2hhbmdlOC1jYXJkLS10YWxsXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+UmVjZW50IEFkZGl0aW9uczwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+XHJcbiAgICAgICAgICAgICAgTGF0ZXN0IHByb2R1Y3RzIGVudGVyaW5nIHRoZSBjYXRhbG9nXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXNlY3Rpb24tZGl2aWRlclwiIC8+XHJcblxyXG4gICAgICAgICAgICB7KGRhdGEucmVjZW50UHJvZHVjdHMgfHwgW10pLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCIgc3R5bGU9e3sgbWFyZ2luVG9wOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICAgIE5vIHByb2R1Y3RzIGFkZGVkIHlldC5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcmVjZW50LWxpc3RcIj5cclxuICAgICAgICAgICAgICAgIHsoZGF0YS5yZWNlbnRQcm9kdWN0cyB8fCBbXSkubWFwKChwcm9kdWN0KSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1yZWNlbnQtaXRlbVwiIGtleT17cHJvZHVjdC5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1uYW1lXCI+e3Byb2R1Y3QubmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1kYXRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtuZXcgRGF0ZShwcm9kdWN0LmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJpY2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIHtmb3JtYXRDdXJyZW5jeShwcm9kdWN0LnByaWNlKX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtZnVsbC13aWR0aC1zZWN0aW9uXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZCBjaGFuZ2U4LWNhcmQtLXRhbGxcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5PcmRlcnMgT3ZlcnZpZXc8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPlxyXG4gICAgICAgICAgICAgIFN1bW1hcnkgb2YgYWxsIG9yZGVycyBhbmQgdHJhbnNhY3Rpb25zXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXNlY3Rpb24tZGl2aWRlclwiIC8+XHJcblxyXG4gICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gICAgICAgICAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJyZXBlYXQoYXV0by1maXQsIG1pbm1heCgyMDBweCwgMWZyKSlcIixcclxuICAgICAgICAgICAgICAgIGdhcDogXCIyMHB4XCIsXHJcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IFwiMTJweFwiLFxyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5Ub3RhbCBPcmRlcnM8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCJcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgbWFyZ2luVG9wOiBcIjhweFwiIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtkYXRhLm9yZGVycyB8fCAwfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+VG90YWwgVXNlcnM8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCJcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgbWFyZ2luVG9wOiBcIjhweFwiIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtkYXRhLnVzZXJzIHx8IDB9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5Ub3RhbCBSZXZlbnVlPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC12YWx1ZVwiXHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IG1hcmdpblRvcDogXCI4cHhcIiwgY29sb3I6IFwidmFyKC0tZ29sZClcIiB9fVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICB7Zm9ybWF0Q3VycmVuY3koZGF0YS5yZXZlbnVlKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmQ7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBSZWdpc3RlciA9ICgpID0+IHtcclxuICBjb25zdCBbZm9ybVN0YXRlLCBzZXRGb3JtU3RhdGVdID0gdXNlU3RhdGUoe1xyXG4gICAgbmFtZTogXCJcIixcclxuICAgIGVtYWlsOiBcIlwiLFxyXG4gICAgcGFzc3dvcmQ6IFwiXCIsXHJcbiAgfSk7XHJcbiAgY29uc3QgW21lc3NhZ2UsIHNldE1lc3NhZ2VdID0gdXNlU3RhdGUoeyB0eXBlOiBcIlwiLCB0ZXh0OiBcIlwiIH0pO1xyXG4gIGNvbnN0IFtpc1N1Ym1pdHRpbmcsIHNldElzU3VibWl0dGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm1hcmdpbiA9IFwiMFwiO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlQ2hhbmdlID0gKGV2ZW50KSA9PiB7XHJcbiAgICBzZXRGb3JtU3RhdGUoKGN1cnJlbnQpID0+ICh7XHJcbiAgICAgIC4uLmN1cnJlbnQsXHJcbiAgICAgIFtldmVudC50YXJnZXQubmFtZV06IGV2ZW50LnRhcmdldC52YWx1ZSxcclxuICAgIH0pKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBoYW5kbGVTdWJtaXQgPSBhc3luYyAoZXZlbnQpID0+IHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBzZXRNZXNzYWdlKHsgdHlwZTogXCJcIiwgdGV4dDogXCJcIiB9KTtcclxuICAgIHNldElzU3VibWl0dGluZyh0cnVlKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL2FwaS9yZWdpc3RlclwiLCB7XHJcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGZvcm1TdGF0ZSksXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YS5tZXNzYWdlIHx8IFwiUmVnaXN0cmF0aW9uIGZhaWxlZFwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0TWVzc2FnZSh7XHJcbiAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgdGV4dDogXCJBY2NvdW50IGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5ISBSZWRpcmVjdGluZy4uLlwiLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvYWRtaW4vbG9naW5cIjtcclxuICAgICAgfSwgMjAwMCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBzZXRNZXNzYWdlKHsgdHlwZTogXCJlcnJvclwiLCB0ZXh0OiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgICBzZXRJc1N1Ym1pdHRpbmcoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLXBhZ2VcIj5cclxuICAgICAgPHN0eWxlPntgXHJcbiAgICAgICAgLnJlZ2lzdGVyLXBhZ2Uge1xyXG4gICAgICAgICAgbWluLWhlaWdodDogMTAwdmg7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgICAgcGFkZGluZzogMjRweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6XHJcbiAgICAgICAgICAgIGxpbmVhci1ncmFkaWVudChyZ2JhKDE1LCAyMywgNDIsIDAuMzUpLCByZ2JhKDE1LCAyMywgNDIsIDAuMzUpKSxcclxuICAgICAgICAgICAgdXJsKCcvcHVibGljL2ltZzIuanBnJykgY2VudGVyIC8gY292ZXIgZml4ZWQ7XHJcbiAgICAgICAgICBmb250LWZhbWlseTogXCJQbHVzIEpha2FydGEgU2Fuc1wiLCBcIlNlZ29lIFVJXCIsIHNhbnMtc2VyaWY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItY2FyZCB7XHJcbiAgICAgICAgICB3aWR0aDogbWluKDEwMCUsIDUyMHB4KTtcclxuICAgICAgICAgIHBhZGRpbmc6IDYwcHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAyOHB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNSwgMjMsIDQyLCAwLjgyKTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgNTBweCAxMDBweCAtMjBweCByZ2JhKDAsIDAsIDAsIDAuOCk7XHJcbiAgICAgICAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMzBweCk7XHJcbiAgICAgICAgICBjb2xvcjogI2ZmZjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1sb2dvIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XHJcbiAgICAgICAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IC0wLjAxZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbG9nbyBzcGFuIHtcclxuICAgICAgICAgIGNvbG9yOiAjNjM2NmYxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWZpZWxkIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbGFiZWwge1xyXG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFlbTtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWlucHV0IHtcclxuICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgcGFkZGluZzogMTRweCAxOHB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSk7XHJcbiAgICAgICAgICBjb2xvcjogI2ZmZjtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWlucHV0OmZvY3VzIHtcclxuICAgICAgICAgIGJvcmRlci1jb2xvcjogIzYzNjZmMTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wOCk7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDAgMCA0cHggcmdiYSg5OSwgMTAyLCAyNDEsIDAuMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItYnV0dG9uIHtcclxuICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMTBweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDE2cHg7XHJcbiAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzYzNjZmMSwgI2E4NTVmNyk7XHJcbiAgICAgICAgICBjb2xvcjogI2ZmZjtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMjVweCAtNXB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWJ1dHRvbjpkaXNhYmxlZCB7XHJcbiAgICAgICAgICBvcGFjaXR5OiAwLjY7XHJcbiAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLW1lc3NhZ2Uge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDEycHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxM3B4O1xyXG4gICAgICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1tZXNzYWdlLmlzLXZpc2libGUge1xyXG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbWVzc2FnZS5lcnJvciB7XHJcbiAgICAgICAgICBjb2xvcjogI2Y4NzE3MTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjM5LCA2OCwgNjgsIDAuMSk7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDIzOSwgNjgsIDY4LCAwLjIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLW1lc3NhZ2Uuc3VjY2VzcyB7XHJcbiAgICAgICAgICBjb2xvcjogIzRhZGU4MDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMzQsIDE5NywgOTQsIDAuMSk7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDM0LCAxOTcsIDk0LCAwLjIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWZvb3RlciB7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAyNXB4O1xyXG4gICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC42KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1mb290ZXIgYSB7XHJcbiAgICAgICAgICBjb2xvcjogIzYzNjZmMTtcclxuICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItZm9vdGVyIGE6aG92ZXIge1xyXG4gICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogODUwcHgpIHtcclxuICAgICAgICAgIC5yZWdpc3Rlci1jYXJkIHtcclxuICAgICAgICAgICAgcGFkZGluZzogNDBweDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIGB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItY2FyZFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItbG9nb1wiPlJlZ2lzdGVyIG91ciBzaXRlPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgIGNsYXNzTmFtZT17YHJlZ2lzdGVyLW1lc3NhZ2UgJHttZXNzYWdlLnR5cGV9ICR7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UudGV4dCA/IFwiaXMtdmlzaWJsZVwiIDogXCJcIlxyXG4gICAgICAgICAgfWB9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge21lc3NhZ2UudGV4dH1cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLWZpZWxkXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJyZWdpc3Rlci1sYWJlbFwiIGh0bWxGb3I9XCJuYW1lXCI+XHJcbiAgICAgICAgICAgICAgRnVsbCBOYW1lXHJcbiAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWlucHV0XCJcclxuICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgICAgaWQ9XCJuYW1lXCJcclxuICAgICAgICAgICAgICBuYW1lPVwibmFtZVwiXHJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciB5b3VyIGZ1bGwgbmFtZVwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1TdGF0ZS5uYW1lfVxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XHJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItZmllbGRcIj5cclxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWxhYmVsXCIgaHRtbEZvcj1cImVtYWlsXCI+XHJcbiAgICAgICAgICAgICAgRW1haWwgQWRkcmVzc1xyXG4gICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyZWdpc3Rlci1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgdHlwZT1cImVtYWlsXCJcclxuICAgICAgICAgICAgICBpZD1cImVtYWlsXCJcclxuICAgICAgICAgICAgICBuYW1lPVwiZW1haWxcIlxyXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZXhhbXBsZUBlbWFpbC5jb21cIlxyXG4gICAgICAgICAgICAgIHZhbHVlPXtmb3JtU3RhdGUuZW1haWx9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cclxuICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWdpc3Rlci1maWVsZFwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwicmVnaXN0ZXItbGFiZWxcIiBodG1sRm9yPVwicGFzc3dvcmRcIj5cclxuICAgICAgICAgICAgICBQYXNzd29yZFxyXG4gICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyZWdpc3Rlci1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcclxuICAgICAgICAgICAgICBpZD1cInBhc3N3b3JkXCJcclxuICAgICAgICAgICAgICBuYW1lPVwicGFzc3dvcmRcIlxyXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQXQgbGVhc3QgNiBjaGFyYWN0ZXJzXCJcclxuICAgICAgICAgICAgICBtaW5MZW5ndGg9ezZ9XHJcbiAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1TdGF0ZS5wYXNzd29yZH1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxyXG4gICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWJ1dHRvblwiXHJcbiAgICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIlxyXG4gICAgICAgICAgICBkaXNhYmxlZD17aXNTdWJtaXR0aW5nfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7aXNTdWJtaXR0aW5nID8gXCJDcmVhdGluZyBhY2NvdW50Li4uXCIgOiBcIkNyZWF0ZSBBY2NvdW50XCJ9XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8L2Zvcm0+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItZm9vdGVyXCI+XHJcbiAgICAgICAgICBBbHJlYWR5IGhhdmUgYW4gYWNjb3VudD8gPGEgaHJlZj1cIi9hZG1pbi9sb2dpblwiPkxvZyBpbjwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0ZXI7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBncmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMjQwcHgsIDFmcikpXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMTZweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjI4KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwibGluZWFyLWdyYWRpZW50KDE2MGRlZywgIzBiMWEzOCAwJSwgIzA5MTYyZiAxMDAlKVwiLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBvdmVyZmxvdzogXCJoaWRkZW5cIixcclxuICBib3hTaGFkb3c6IFwiMCAxMnB4IDIycHggcmdiYSgyLCA2LCAyMywgMC4yNSlcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlV3JhcFN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBoZWlnaHQ6IFwiMjAwcHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gIHBhZGRpbmc6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gIG9iamVjdEZpdDogXCJjb250YWluXCIsXHJcbn07XHJcblxyXG5jb25zdCBib2R5U3R5bGUgPSB7XHJcbiAgcGFkZGluZzogXCIxNHB4XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgbWV0YVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDFmclwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IChpc0FjdGl2ZSkgPT4gKHtcclxuICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjA1ZW1cIixcclxuICBwYWRkaW5nOiBcIjVweCAxMHB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgY29sb3I6IGlzQWN0aXZlID8gXCIjMTQ1MzJkXCIgOiBcIiM3ZjFkMWRcIixcclxuICBiYWNrZ3JvdW5kOiBpc0FjdGl2ZSA/IFwiI2JiZjdkMFwiIDogXCIjZmVjYWNhXCIsXHJcbn0pO1xyXG5cclxuY29uc3QgbGlua1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiaW5saW5lLWJsb2NrXCIsXHJcbiAgbWFyZ2luVG9wOiBcIjRweFwiLFxyXG4gIGNvbG9yOiBcIiM5M2M1ZmRcIixcclxuICB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDYwMCxcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgZW1wdHlTdHlsZSA9IHtcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggZGFzaGVkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC40NSlcIixcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXRQcmljZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IGFtb3VudCA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICBpZiAoIU51bWJlci5pc0Zpbml0ZShhbW91bnQpKSB7XHJcbiAgICByZXR1cm4gXCIwLjAwXCI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYW1vdW50LnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0UmVjb3JkSWQgPSAocmVjb3JkKSA9PiB7XHJcbiAgcmV0dXJuIHJlY29yZD8ucGFyYW1zPy5pZCB8fCByZWNvcmQ/LmlkIHx8IHJlY29yZD8ucGFyYW0/LmlkIHx8IFwiXCI7XHJcbn07XHJcblxyXG5jb25zdCBnZXRTaG93SHJlZiA9IChyZWNvcmQsIHJlc291cmNlSWQpID0+IHtcclxuICBjb25zdCByZWNvcmRBY3Rpb25zID0gcmVjb3JkPy5yZWNvcmRBY3Rpb25zIHx8IHJlY29yZD8uYWN0aW9ucyB8fCBbXTtcclxuICBjb25zdCBzaG93QWN0aW9uID0gcmVjb3JkQWN0aW9ucy5maW5kKChhY3Rpb24pID0+IGFjdGlvbj8ubmFtZSA9PT0gXCJzaG93XCIpO1xyXG4gIGNvbnN0IHJhd0hyZWYgPSBzaG93QWN0aW9uPy5ocmVmIHx8IHJlY29yZD8uaHJlZiB8fCBcIlwiO1xyXG5cclxuICBpZiAocmF3SHJlZikge1xyXG4gICAgcmV0dXJuIHJhd0hyZWY7XHJcbiAgfVxyXG5cclxuICBjb25zdCBpZCA9IGdldFJlY29yZElkKHJlY29yZCk7XHJcbiAgcmV0dXJuIGlkXHJcbiAgICA/IGAvYWRtaW4vcmVzb3VyY2VzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KHJlc291cmNlSWQpfS9yZWNvcmRzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KGlkKX0vc2hvd2BcclxuICAgIDogXCJcIjtcclxufTtcclxuXHJcbmNvbnN0IFByb2R1Y3RDYXJkc0xpc3QgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCBbYXBpUmVjb3Jkcywgc2V0QXBpUmVjb3Jkc10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IFtsb2FkRXJyb3IsIHNldExvYWRFcnJvcl0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgY29uc3QgcmVzb3VyY2VJZCA9XHJcbiAgICBwcm9wcz8ucmVzb3VyY2U/LmlkID09PSBcIlByb2R1Y3RcIlxyXG4gICAgICA/IFwiUHJvZHVjdHNcIlxyXG4gICAgICA6IHByb3BzPy5yZXNvdXJjZT8uaWQgfHwgXCJQcm9kdWN0c1wiO1xyXG4gIGNvbnN0IHByb3BSZWNvcmRzID0gcHJvcHM/LnJlY29yZHMgfHwgW107XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAocHJvcFJlY29yZHMubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBsb2FkUmVjb3JkcyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgc2V0TG9hZGluZyh0cnVlKTtcclxuICAgICAgc2V0TG9hZEVycm9yKFwiXCIpO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9hcGkvcmVzb3VyY2VzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KHJlc291cmNlSWQpfS9hY3Rpb25zL2xpc3RgLFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZD8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIHByb2R1Y3RzXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0QXBpUmVjb3JkcyhwYXlsb2FkPy5yZWNvcmRzIHx8IFtdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0TG9hZEVycm9yKGVycm9yPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgcHJvZHVjdHNcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkUmVjb3JkcygpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIGlzTW91bnRlZCA9IGZhbHNlO1xyXG4gICAgfTtcclxuICB9LCBbcHJvcFJlY29yZHMubGVuZ3RoLCByZXNvdXJjZUlkXSk7XHJcblxyXG4gIGNvbnN0IHJlY29yZHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiBwcm9wUmVjb3Jkcy5sZW5ndGggPyBwcm9wUmVjb3JkcyA6IGFwaVJlY29yZHM7XHJcbiAgfSwgW3Byb3BSZWNvcmRzLCBhcGlSZWNvcmRzXSk7XHJcblxyXG4gIGlmIChsb2FkaW5nKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+TG9hZGluZyBwcm9kdWN0cy4uLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChsb2FkRXJyb3IpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT57bG9hZEVycm9yfTwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmICghcmVjb3Jkcy5sZW5ndGgpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5ObyBwcm9kdWN0cyBmb3VuZC48L2Rpdj47XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17Z3JpZFN0eWxlfT5cclxuICAgICAge3JlY29yZHMubWFwKChyZWNvcmQpID0+IHtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fTtcclxuICAgICAgICBjb25zdCBpZCA9IGdldFJlY29yZElkKHJlY29yZCk7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHBhcmFtcz8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwiO1xyXG4gICAgICAgIGNvbnN0IGNhdGVnb3J5ID0gcGFyYW1zPy5jYXRlZ29yeUlkIHx8IFwiLVwiO1xyXG4gICAgICAgIGNvbnN0IGltYWdlVXJsID0gcGFyYW1zPy5pbWFnZVVybCB8fCBcIlwiO1xyXG4gICAgICAgIGNvbnN0IHN0b2NrID0gTnVtYmVyKHBhcmFtcz8uc3RvY2sgfHwgMCk7XHJcbiAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBCb29sZWFuKHBhcmFtcz8uaXNBY3RpdmUpO1xyXG4gICAgICAgIGNvbnN0IGRldGFpbHNIcmVmID0gZ2V0U2hvd0hyZWYocmVjb3JkLCByZXNvdXJjZUlkKTtcclxuICAgICAgICBjb25zdCBvcGVuRGV0YWlscyA9ICgpID0+IHtcclxuICAgICAgICAgIGlmIChkZXRhaWxzSHJlZikge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKGRldGFpbHNIcmVmKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgPGFydGljbGUga2V5PXtpZH0gc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2ltYWdlV3JhcFN0eWxlfT5cclxuICAgICAgICAgICAgICB7aW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2VVcmx9IGFsdD17bmFtZX0gc3R5bGU9e2ltYWdlU3R5bGV9IC8+XHJcbiAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgTm8gaW1hZ2VcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Ym9keVN0eWxlfT5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiBcIjE4cHhcIiwgZm9udFdlaWdodDogNzAwIH19PntuYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e21ldGFTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PkNhdGVnb3J5OiB7Y2F0ZWdvcnl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlN0b2NrOiB7c3RvY2t9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlByaWNlOiBScy4ge2Zvcm1hdFByaWNlKHBhcmFtcz8ucHJpY2UpfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtiYWRnZVN0eWxlKGlzQWN0aXZlKX0+XHJcbiAgICAgICAgICAgICAgICB7aXNBY3RpdmUgPyBcIkFDVElWRVwiIDogXCJJTkFDVElWRVwifVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgICAgaHJlZj17ZGV0YWlsc0hyZWYgfHwgXCIjXCJ9XHJcbiAgICAgICAgICAgICAgICBzdHlsZT17bGlua1N0eWxlfVxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17KGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgIG9wZW5EZXRhaWxzKCk7XHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgYXJpYS1kaXNhYmxlZD17IWRldGFpbHNIcmVmfVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIFZpZXcgZGV0YWlsc1xyXG4gICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgKTtcclxuICAgICAgfSl9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdENhcmRzTGlzdDtcclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgcGFnZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxOHB4XCIsXHJcbiAgY29sb3I6IFwiI2UyZThmMFwiLFxyXG59O1xyXG5cclxuY29uc3QgaGVyb1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwibWlubWF4KDI4MHB4LCAzNjBweCkgMWZyXCIsXHJcbiAgZ2FwOiBcIjE4cHhcIixcclxuICBhbGlnbkl0ZW1zOiBcInN0cmV0Y2hcIixcclxufTtcclxuXHJcbmNvbnN0IHBhbmVsU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjIwcHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xOClcIixcclxuICBiYWNrZ3JvdW5kOlxyXG4gICAgXCJsaW5lYXItZ3JhZGllbnQoMTYwZGVnLCByZ2JhKDExLCAyNiwgNTYsIDAuOTYpIDAlLCByZ2JhKDksIDIyLCA0NywgMC45NikgMTAwJSlcIixcclxuICBib3hTaGFkb3c6IFwiMCAyMHB4IDQwcHggcmdiYSgyLCA2LCAyMywgMC4yNClcIixcclxuICBvdmVyZmxvdzogXCJoaWRkZW5cIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlV3JhcFN0eWxlID0ge1xyXG4gIG1pbkhlaWdodDogXCIzNjBweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBkaXNwbGF5OiBcImJsb2NrXCIsXHJcbn07XHJcblxyXG5jb25zdCBoZXJvQm9keVN0eWxlID0ge1xyXG4gIHBhZGRpbmc6IFwiMjJweFwiLFxyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBmb250U2l6ZTogXCJjbGFtcCgyOHB4LCA0dncsIDQ2cHgpXCIsXHJcbiAgbGluZUhlaWdodDogMS4wNSxcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBzdWJ0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgZm9udFNpemU6IFwiMTRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IChhY3RpdmUpID0+ICh7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICBwYWRkaW5nOiBcIjZweCAxMnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxyXG4gIGNvbG9yOiBhY3RpdmUgPyBcIiMxNDUzMmRcIiA6IFwiIzdmMWQxZFwiLFxyXG4gIGJhY2tncm91bmQ6IGFjdGl2ZSA/IFwiI2JiZjdkMFwiIDogXCIjZmVjYWNhXCIsXHJcbn0pO1xyXG5cclxuY29uc3Qgc3RhdHNHcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJyZXBlYXQoMywgbWlubWF4KDE2MHB4LCAxZnIpKVwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzdGF0Q2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxNnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTUpXCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNTgpXCIsXHJcbiAgcGFkZGluZzogXCIxNHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzdGF0TGFiZWxTdHlsZSA9IHtcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTZlbVwiLFxyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBtYXJnaW5Cb3R0b206IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzdGF0VmFsdWVTdHlsZSA9IHtcclxuICBmb250U2l6ZTogXCIxNnB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICB3b3JkQnJlYWs6IFwiYnJlYWstd29yZFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdGlvbkdyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgwLCAxLjRmcikgbWlubWF4KDI4MHB4LCAwLjlmcilcIixcclxuICBnYXA6IFwiMThweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdGlvblRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjEyZW1cIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gIGNvbG9yOiBcIiNmNWRmOTBcIixcclxufTtcclxuXHJcbmNvbnN0IGNvbnRlbnRDYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjIwcHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xOClcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTEsIDI2LCA1NiwgMC45KVwiLFxyXG4gIHBhZGRpbmc6IFwiMThweFwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDE2cHggMjhweCByZ2JhKDIsIDYsIDIzLCAwLjE2KVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0xpc3RTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb1Jvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiMTBweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0xhYmVsU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9WYWx1ZVN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgdGV4dEFsaWduOiBcInJpZ2h0XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgZGVzY3JpcHRpb25TdHlsZSA9IHtcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbiAgbGluZUhlaWdodDogMS43LFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxuICB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIsXHJcbn07XHJcblxyXG5jb25zdCBidXR0b25TdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImlubGluZS1mbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIHBhZGRpbmc6IFwiMTRweCAxOHB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE0cHhcIixcclxuICBib3JkZXI6IFwibm9uZVwiLFxyXG4gIGJhY2tncm91bmQ6IFwibGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzYzNjZmMSAwJSwgIzhiNWNmNiAxMDAlKVwiLFxyXG4gIGNvbG9yOiBcIiNmZmZmZmZcIixcclxuICBmb250U2l6ZTogXCIxNXB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgdHJhbnNpdGlvbjogXCJhbGwgMC4zcyBlYXNlXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgOHB4IDE2cHggcmdiYSg5OSwgMTAyLCAyNDEsIDAuMylcIixcclxufTtcclxuXHJcbmNvbnN0IGJ1dHRvbkhvdmVyU3R5bGUgPSB7XHJcbiAgLi4uYnV0dG9uU3R5bGUsXHJcbiAgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoLTJweClcIixcclxuICBib3hTaGFkb3c6IFwiMCAxMnB4IDI0cHggcmdiYSg5OSwgMTAyLCAyNDEsIDAuNClcIixcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdEN1cnJlbmN5ID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgYW1vdW50ID0gTnVtYmVyKHZhbHVlIHx8IDApO1xyXG4gIHJldHVybiBgUnMuICR7YW1vdW50LnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gIH0pfWA7XHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXREYXRlID0gKHZhbHVlKSA9PiB7XHJcbiAgaWYgKCF2YWx1ZSkge1xyXG4gICAgcmV0dXJuIFwiLVwiO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKTtcclxuICBpZiAoTnVtYmVyLmlzTmFOKGRhdGUuZ2V0VGltZSgpKSkge1xyXG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0ZS50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIGRhdGVTdHlsZTogXCJtZWRpdW1cIixcclxuICAgIHRpbWVTdHlsZTogXCJzaG9ydFwiLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgUHJvZHVjdFNob3cgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCByZWNvcmQgPSBwcm9wcz8ucmVjb3JkO1xyXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9O1xyXG5cclxuICBjb25zdCBuYW1lID0gcGFyYW1zPy5uYW1lIHx8IFwiVW5uYW1lZCBwcm9kdWN0XCI7XHJcbiAgY29uc3Qgc2t1ID0gcGFyYW1zPy5za3UgfHwgXCItXCI7XHJcbiAgY29uc3QgY2F0ZWdvcnkgPSBwYXJhbXM/LmNhdGVnb3J5SWQgfHwgXCItXCI7XHJcbiAgY29uc3QgaW1hZ2VVcmwgPSBwYXJhbXM/LmltYWdlVXJsIHx8IFwiXCI7XHJcbiAgY29uc3Qgc3RvY2sgPSBOdW1iZXIocGFyYW1zPy5zdG9jayB8fCAwKTtcclxuICBjb25zdCBpc0FjdGl2ZSA9IEJvb2xlYW4ocGFyYW1zPy5pc0FjdGl2ZSk7XHJcbiAgY29uc3QgcHJpY2UgPSBmb3JtYXRDdXJyZW5jeShwYXJhbXM/LnByaWNlKTtcclxuICBjb25zdCBkZXNjcmlwdGlvbiA9XHJcbiAgICBwYXJhbXM/LmRlc2NyaXB0aW9uIHx8IFwiTm8gZGVzY3JpcHRpb24gYXZhaWxhYmxlIGZvciB0aGlzIHByb2R1Y3QuXCI7XHJcblxyXG4gIGNvbnN0IFtidXR0b25Ib3ZlcmVkLCBzZXRCdXR0b25Ib3ZlcmVkXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlT3JkZXJDbGljayA9ICgpID0+IHtcclxuICAgIGNvbnN0IHByb2R1Y3RJZCA9IHBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZCB8fCBcIlwiO1xyXG4gICAgY29uc3QgbmV3T3JkZXJVcmwgPSBgL2FkbWluL3Jlc291cmNlcy9PcmRlcnMvYWN0aW9ucy9uZXc/cHJvZHVjdElkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhwcm9kdWN0SWQpKX1gO1xyXG4gICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihuZXdPcmRlclVybCk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3BhZ2VTdHlsZX0+XHJcbiAgICAgIDxzdHlsZT5cclxuICAgICAgICB7YFxyXG4gICAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDk4MHB4KSB7XHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1oZXJvLFxyXG4gICAgICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LXNob3ctc2VjdGlvbnMge1xyXG4gICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICBgfVxyXG4gICAgICA8L3N0eWxlPlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3Qtc2hvdy1oZXJvXCIgc3R5bGU9e2hlcm9TdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17cGFuZWxTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbWFnZVdyYXBTdHlsZX0+XHJcbiAgICAgICAgICAgIHtpbWFnZVVybCA/IChcclxuICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2VVcmx9IGFsdD17bmFtZX0gc3R5bGU9e2ltYWdlU3R5bGV9IC8+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIE5vIGltYWdlIGF2YWlsYWJsZVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3BhbmVsU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aGVyb0JvZHlTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGgxIHN0eWxlPXt0aXRsZVN0eWxlfT57bmFtZX08L2gxPlxyXG4gICAgICAgICAgICAgIDxwIHN0eWxlPXtzdWJ0aXRsZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIENsZWFuIHByb2R1Y3Qgb3ZlcnZpZXcgZm9yIHF1aWNrIHJldmlldyBhbmQgbWFuYWdlbWVudC5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17YmFkZ2VTdHlsZShpc0FjdGl2ZSl9PlxyXG4gICAgICAgICAgICAgIHtpc0FjdGl2ZSA/IFwiQUNUSVZFXCIgOiBcIklOQUNUSVZFXCJ9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdHNHcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRDYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdExhYmVsU3R5bGV9PlByaWNlPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0VmFsdWVTdHlsZX0+e3ByaWNlfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRDYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdExhYmVsU3R5bGV9PlN0b2NrPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17YnV0dG9uSG92ZXJlZCA/IGJ1dHRvbkhvdmVyU3R5bGUgOiBidXR0b25TdHlsZX1cclxuICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiBzZXRCdXR0b25Ib3ZlcmVkKHRydWUpfVxyXG4gICAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHNldEJ1dHRvbkhvdmVyZWQoZmFsc2UpfVxyXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVPcmRlckNsaWNrfVxyXG4gICAgICAgICAgICAgICAgICB0aXRsZT1cIkNsaWNrIHRvIGNyZWF0ZSBhIG5ldyBvcmRlciBmb3IgdGhpcyBwcm9kdWN0XCJcclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPHN2Z1xyXG4gICAgICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiMThcIlxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjE4XCJcclxuICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcclxuICAgICAgICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjIuNVwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCI5XCIgY3k9XCIyMVwiIHI9XCIxXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PVwiMjBcIiBjeT1cIjIxXCIgcj1cIjFcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMSAxaDRsMi42OCAxMy4zOWEyIDIgMCAwIDAgMiAxLjYxaDkuNzJhMiAyIDAgMCAwIDItMS42MUwyMyA2SDZcIiAvPlxyXG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgT3JkZXIgTm93XHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRWYWx1ZVN0eWxlfT57c3RvY2t9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdENhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0TGFiZWxTdHlsZX0+U0tVPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0VmFsdWVTdHlsZX0+e3NrdX08L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdC1zaG93LXNlY3Rpb25zXCIgc3R5bGU9e3NlY3Rpb25HcmlkU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NvbnRlbnRDYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+RGVzY3JpcHRpb248L2gyPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtkZXNjcmlwdGlvblN0eWxlfT57ZGVzY3JpcHRpb259PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NvbnRlbnRDYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UHJvZHVjdCBEZXRhaWxzPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMiB9fSAvPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0xpc3RTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9MYWJlbFN0eWxlfT5DYXRlZ29yeTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb1ZhbHVlU3R5bGV9PntjYXRlZ29yeX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvTGFiZWxTdHlsZX0+Q3JlYXRlZCBBdDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb1ZhbHVlU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAge2Zvcm1hdERhdGUocGFyYW1zPy5jcmVhdGVkQXQpfVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9MYWJlbFN0eWxlfT5VcGRhdGVkIEF0PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvVmFsdWVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShwYXJhbXM/LnVwZGF0ZWRBdCl9XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PlJlY29yZCBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb1ZhbHVlU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAge3BhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZCB8fCBcIi1cIn1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RTaG93O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgcGFnZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIyMHB4XCIsXHJcbiAgY29sb3I6IFwiI2UyZThmMFwiLFxyXG59O1xyXG5cclxuY29uc3QgaGVhZGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgdGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgZm9udFNpemU6IFwiMzRweFwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuMDgsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3QgZGVzY1N0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgZm9udFNpemU6IFwiMTRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgY2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxOHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMilcIixcclxuICBiYWNrZ3JvdW5kOlxyXG4gICAgXCJsaW5lYXItZ3JhZGllbnQoMTUwZGVnLCByZ2JhKDEwLCAyMywgNDgsIDAuOTQpIDAlLCByZ2JhKDgsIDE4LCAzOCwgMC45NCkgMTAwJSlcIixcclxuICBib3hTaGFkb3c6IFwiMCAxNHB4IDI4cHggcmdiYSgyLCA2LCAyMywgMC4yMilcIixcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHNlY3Rpb25UaXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogXCIwIDAgMTRweCAwXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjEyZW1cIixcclxuICBjb2xvcjogXCIjZjVkZjkwXCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG59O1xyXG5cclxuY29uc3QgbGF5b3V0U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJtaW5tYXgoMzAwcHgsIDAuOTVmcikgbWlubWF4KDQyMHB4LCAxLjI1ZnIpXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHN0YWNrU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGxhYmVsU3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMWVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbnB1dFN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBtaW5XaWR0aDogMCxcclxuICBib3hTaXppbmc6IFwiYm9yZGVyLWJveFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjYpXCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNjIpXCIsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG4gIHBhZGRpbmc6IFwiMTFweCAxM3B4XCIsXHJcbiAgZm9udFNpemU6IFwiMTRweFwiLFxyXG4gIGZvbnRGYW1pbHk6IFwiaW5oZXJpdFwiLFxyXG59O1xyXG5cclxuY29uc3Qgcm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIG1pbldpZHRoOiAwLFxyXG59O1xyXG5cclxuY29uc3QgZ3JpZDJTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcInJlcGVhdCgyLCBtaW5tYXgoMCwgMWZyKSlcIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwic3RhcnRcIixcclxufTtcclxuXHJcbmNvbnN0IGN1c3RvbWVySW5mb1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBjdXN0b21lclJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjhweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG59O1xyXG5cclxuY29uc3QgbXV0ZWRTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzdHJvbmdTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIHRleHRBbGlnbjogXCJyaWdodFwiLFxyXG59O1xyXG5cclxuY29uc3QgbGluZUl0ZW1Sb3dTdHlsZSA9IHtcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yKVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgcGFkZGluZzogXCIxMnB4XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTUsIDIzLCA0MiwgMC40NClcIixcclxufTtcclxuXHJcbmNvbnN0IGxpbmVJdGVtVG9wU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgYXV0b1wiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IHByb2R1Y3RQcmV2aWV3U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCI1NnB4IDFmclwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiNTZweFwiLFxyXG4gIGhlaWdodDogXCI1NnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yNSlcIixcclxufTtcclxuXHJcbmNvbnN0IGFkZEJ1dHRvblN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgcGFkZGluZzogXCI5cHggMTJweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSg5OSwgMTAyLCAyNDEsIDAuMTgpXCIsXHJcbiAgY29sb3I6IFwiI2RiZWFmZVwiLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG59O1xyXG5cclxuY29uc3QgcmVtb3ZlQnV0dG9uU3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDIzOSwgNjgsIDY4LCAwLjUpXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBwYWRkaW5nOiBcIjhweCAxMHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDEyNywgMjksIDI5LCAwLjI1KVwiLFxyXG4gIGNvbG9yOiBcIiNmZWNhY2FcIixcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbn07XHJcblxyXG5jb25zdCB0b3RhbHNSb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgcGFkZGluZzogXCI3cHggMFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxufTtcclxuXHJcbmNvbnN0IHRvdGFsU3R5bGUgPSB7XHJcbiAgLi4udG90YWxzUm93U3R5bGUsXHJcbiAgZm9udFNpemU6IFwiMTdweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIm5vbmVcIixcclxuICBwYWRkaW5nVG9wOiBcIjEycHhcIixcclxufTtcclxuXHJcbmNvbnN0IGFjdGlvbkJhclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDFmclwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBhY3Rpb25CdXR0b25TdHlsZSA9IChwcmltYXJ5KSA9PiAoe1xyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYm9yZGVyOiBwcmltYXJ5ID8gXCJub25lXCIgOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjgpXCIsXHJcbiAgcGFkZGluZzogXCIxMnB4IDE0cHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxuICBiYWNrZ3JvdW5kOiBwcmltYXJ5XHJcbiAgICA/IFwibGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzYzNjZmMSAwJSwgIzhiNWNmNiAxMDAlKVwiXHJcbiAgICA6IFwicmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG4gIGNvbG9yOiBwcmltYXJ5ID8gXCIjZmZmXCIgOiBcIiNkMWQ1ZGJcIixcclxufSk7XHJcblxyXG5jb25zdCBtYXBMaW5rU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiIzkzYzVmZFwiLFxyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsXHJcbn07XHJcblxyXG5jb25zdCBwYXltZW50T3B0aW9uR3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDFmclwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBwYXltZW50T3B0aW9uU3R5bGUgPSAoYWN0aXZlKSA9PiAoe1xyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYm9yZGVyOiBhY3RpdmVcclxuICAgID8gXCIxcHggc29saWQgcmdiYSg5OSwgMTAyLCAyNDEsIDAuOSlcIlxyXG4gICAgOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjQpXCIsXHJcbiAgYmFja2dyb3VuZDogYWN0aXZlID8gXCJyZ2JhKDk5LCAxMDIsIDI0MSwgMC4yMilcIiA6IFwicmdiYSgxNSwgMjMsIDQyLCAwLjQ4KVwiLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBwYWRkaW5nOiBcIjEwcHggMTJweFwiLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgdGV4dEFsaWduOiBcImxlZnRcIixcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbn0pO1xyXG5cclxuY29uc3Qgc2VjdXJpdHlDaGlwV3JhcFN0eWxlID0ge1xyXG4gIG1hcmdpblRvcDogXCIxMnB4XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdXJpdHlDaGlwU3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDM0LCAxOTcsIDk0LCAwLjQyKVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSgyMCwgODMsIDQ1LCAwLjI0KVwiLFxyXG4gIGNvbG9yOiBcIiM4NmVmYWNcIixcclxuICBwYWRkaW5nOiBcIjdweCAxMHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDNlbVwiLFxyXG59O1xyXG5cclxuY29uc3QgcmVzcG9uc2l2ZUNzcyA9IGBcclxuLmNoYW5nZTgtb3JkZXItZ3JpZC0yIHtcclxuICBkaXNwbGF5OiBncmlkICFpbXBvcnRhbnQ7XHJcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDAsIDFmcikpICFpbXBvcnRhbnQ7XHJcbiAgZ2FwOiAxMHB4ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5jaGFuZ2U4LW9yZGVyLWdyaWQtMiA+ICoge1xyXG4gIG1pbi13aWR0aDogMCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4uY2hhbmdlOC1vcmRlci1ncmlkLTIgaW5wdXQsXHJcbi5jaGFuZ2U4LW9yZGVyLWdyaWQtMiBzZWxlY3QsXHJcbi5jaGFuZ2U4LW9yZGVyLWdyaWQtMiB0ZXh0YXJlYSB7XHJcbiAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxuICBtaW4td2lkdGg6IDAgIWltcG9ydGFudDtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbkBtZWRpYSAobWF4LXdpZHRoOiAxMDI0cHgpIHtcclxuICAuY2hhbmdlOC1vcmRlci1sYXlvdXQge1xyXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgIWltcG9ydGFudDtcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSAobWF4LXdpZHRoOiA3NjBweCkge1xyXG4gIC5jaGFuZ2U4LW9yZGVyLWdyaWQtMiB7XHJcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gIH1cclxufVxyXG5gO1xyXG5cclxuY29uc3QgcGF5bWVudE9wdGlvbnMgPSBbXHJcbiAgeyB2YWx1ZTogXCJDYXJkXCIsIGxhYmVsOiBcIkNhcmQgUGF5bWVudFwiLCBpY29uOiBcIvCfkrNcIiB9LFxyXG4gIHsgdmFsdWU6IFwiQ2FzaCBvbiBEZWxpdmVyeVwiLCBsYWJlbDogXCJDYXNoIG9uIERlbGl2ZXJ5XCIsIGljb246IFwi8J+TplwiIH0sXHJcbl07XHJcblxyXG5jb25zdCBpdGVtU2l6ZU9wdGlvbnMgPSBbXCJYU1wiLCBcIlNcIiwgXCJNXCIsIFwiTFwiLCBcIlhMXCIsIFwiWFhMXCJdO1xyXG5jb25zdCBzaGlwcGluZ01ldGhvZHMgPSBbXHJcbiAgXCJQaWNrTWUgRmxhc2hcIixcclxuICBcIlByb250b1wiLFxyXG4gIFwiRG9tZXhcIixcclxuICBcIlJlZ2lzdGVyZWQgQ291cmllclwiLFxyXG5dO1xyXG5cclxuY29uc3QgdG9OdW1iZXIgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBudW0gPSBOdW1iZXIodmFsdWUgfHwgMCk7XHJcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShudW0pID8gbnVtIDogMDtcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdE1vbmV5ID0gKHZhbHVlKSA9PiB7XHJcbiAgcmV0dXJuIGBScy4gJHt0b051bWJlcih2YWx1ZSkudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSl9YDtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZUVtcHR5SXRlbSA9ICgpID0+ICh7XHJcbiAgcHJvZHVjdElkOiBcIlwiLFxyXG4gIHNpemU6IFwiTVwiLFxyXG4gIHF1YW50aXR5OiAxLFxyXG4gIHVuaXRQcmljZTogMCxcclxufSk7XHJcblxyXG5jb25zdCBPcmRlckNyZWF0ZSA9ICgpID0+IHtcclxuICBjb25zdCBbdXNlcnMsIHNldFVzZXJzXSA9IHVzZVN0YXRlKFtdKTtcclxuICBjb25zdCBbcHJvZHVjdHMsIHNldFByb2R1Y3RzXSA9IHVzZVN0YXRlKFtdKTtcclxuICBjb25zdCBbb3JkZXJDb3VudEJ5VXNlciwgc2V0T3JkZXJDb3VudEJ5VXNlcl0gPSB1c2VTdGF0ZSh7fSk7XHJcbiAgY29uc3QgW3Nlc3Npb25Vc2VyLCBzZXRTZXNzaW9uVXNlcl0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICBjb25zdCBbc3VibWl0dGluZywgc2V0U3VibWl0dGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIGNvbnN0IFtmb3JtRGF0YSwgc2V0Rm9ybURhdGFdID0gdXNlU3RhdGUoe1xyXG4gICAgdXNlcklkOiBcIlwiLFxyXG4gICAgc3RhdHVzOiBcInBlbmRpbmdcIixcclxuICAgIHBheW1lbnRNZXRob2Q6IFwiQ2FyZFwiLFxyXG4gICAgcGF5bWVudFN0YXR1czogXCJwZW5kaW5nXCIsXHJcbiAgICB0cmFuc2FjdGlvbklkOiBcIlwiLFxyXG4gICAgc2hpcHBpbmdOYW1lOiBcIlwiLFxyXG4gICAgc2hpcHBpbmdQaG9uZTogXCJcIixcclxuICAgIHNoaXBwaW5nQWRkcmVzczogXCJcIixcclxuICAgIHNoaXBwaW5nTWV0aG9kOiBcIlBpY2tNZSBGbGFzaFwiLFxyXG4gICAgdHJhY2tpbmdOdW1iZXI6IFwiXCIsXHJcbiAgICBzaGlwcGluZ0ZlZTogMCxcclxuICAgIHRheDogMCxcclxuICAgIGRpc2NvdW50OiAwLFxyXG4gIH0pO1xyXG5cclxuICBjb25zdCBbbGluZUl0ZW1zLCBzZXRMaW5lSXRlbXNdID0gdXNlU3RhdGUoW2NyZWF0ZUVtcHR5SXRlbSgpXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xyXG4gICAgY29uc3QgcHJlUHJvZHVjdElkID0gcGFyYW1zLmdldChcInByb2R1Y3RJZFwiKSB8fCBcIlwiO1xyXG5cclxuICAgIGNvbnN0IGZldGNoRGF0YSA9IGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBjb250ZXh0UmVzID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgICAgICBgL2FkbWluL2NvbnRleHQvb3JkZXItY3JlYXRlJHtcclxuICAgICAgICAgICAgcHJlUHJvZHVjdElkID8gYD9wcm9kdWN0SWQ9JHtlbmNvZGVVUklDb21wb25lbnQocHJlUHJvZHVjdElkKX1gIDogXCJcIlxyXG4gICAgICAgICAgfWAsXHJcbiAgICAgICAgICB7IGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZXh0RGF0YSA9IGNvbnRleHRSZXMub2sgPyBhd2FpdCBjb250ZXh0UmVzLmpzb24oKSA6IHt9O1xyXG5cclxuICAgICAgICBjb25zdCB1c2Vyc0RhdGEgPSBBcnJheS5pc0FycmF5KGNvbnRleHREYXRhPy51c2VycylcclxuICAgICAgICAgID8gY29udGV4dERhdGEudXNlcnNcclxuICAgICAgICAgIDogW107XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdHNMaXN0ID0gQXJyYXkuaXNBcnJheShjb250ZXh0RGF0YT8ucHJvZHVjdHMpXHJcbiAgICAgICAgICA/IGNvbnRleHREYXRhLnByb2R1Y3RzXHJcbiAgICAgICAgICA6IFtdO1xyXG5cclxuICAgICAgICBzZXRVc2Vycyh1c2Vyc0RhdGEpO1xyXG4gICAgICAgIHNldFByb2R1Y3RzKHByb2R1Y3RzTGlzdCk7XHJcbiAgICAgICAgc2V0T3JkZXJDb3VudEJ5VXNlcihjb250ZXh0RGF0YT8ub3JkZXJDb3VudEJ5VXNlciB8fCB7fSk7XHJcbiAgICAgICAgc2V0U2Vzc2lvblVzZXIoY29udGV4dERhdGE/LmN1cnJlbnRVc2VyIHx8IG51bGwpO1xyXG5cclxuICAgICAgICBpZiAoY29udGV4dERhdGE/LmN1cnJlbnRVc2VyPy5pZCkge1xyXG4gICAgICAgICAgc2V0Rm9ybURhdGEoKHByZXYpID0+ICh7XHJcbiAgICAgICAgICAgIC4uLnByZXYsXHJcbiAgICAgICAgICAgIHVzZXJJZDogcHJldi51c2VySWQgfHwgU3RyaW5nKGNvbnRleHREYXRhLmN1cnJlbnRVc2VyLmlkKSxcclxuICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb250ZXh0RGF0YT8uc2VsZWN0ZWRQcm9kdWN0Py5pZCkge1xyXG4gICAgICAgICAgc2V0TGluZUl0ZW1zKFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHByb2R1Y3RJZDogU3RyaW5nKGNvbnRleHREYXRhLnNlbGVjdGVkUHJvZHVjdC5pZCksXHJcbiAgICAgICAgICAgICAgc2l6ZTogXCJNXCIsXHJcbiAgICAgICAgICAgICAgcXVhbnRpdHk6IDEsXHJcbiAgICAgICAgICAgICAgdW5pdFByaWNlOiB0b051bWJlcihjb250ZXh0RGF0YS5zZWxlY3RlZFByb2R1Y3QucHJpY2UpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgXSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICBwcmVQcm9kdWN0SWQgJiZcclxuICAgICAgICAgIHByb2R1Y3RzTGlzdC5zb21lKChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhwcmVQcm9kdWN0SWQpKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBwcm9kdWN0c0xpc3QuZmluZChcclxuICAgICAgICAgICAgKHApID0+IFN0cmluZyhwLmlkKSA9PT0gU3RyaW5nKHByZVByb2R1Y3RJZCksXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgc2V0TGluZUl0ZW1zKFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHByb2R1Y3RJZDogU3RyaW5nKHByZVByb2R1Y3RJZCksXHJcbiAgICAgICAgICAgICAgc2l6ZTogXCJNXCIsXHJcbiAgICAgICAgICAgICAgcXVhbnRpdHk6IDEsXHJcbiAgICAgICAgICAgICAgdW5pdFByaWNlOiB0b051bWJlcihzZWxlY3RlZD8ucHJpY2UpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZldGNoRGF0YSgpO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgY29uc3Qgc2VsZWN0ZWRDdXN0b21lciA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgcmV0dXJuIHVzZXJzLmZpbmQoKHUpID0+IFN0cmluZyh1LmlkKSA9PT0gU3RyaW5nKGZvcm1EYXRhLnVzZXJJZCkpIHx8IG51bGw7XHJcbiAgfSwgW3VzZXJzLCBmb3JtRGF0YS51c2VySWRdKTtcclxuXHJcbiAgY29uc3QgY3VzdG9tZXJPcmRlckNvdW50ID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBpZiAoIXNlbGVjdGVkQ3VzdG9tZXIpIHtcclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIE51bWJlcihvcmRlckNvdW50QnlVc2VyW1N0cmluZyhzZWxlY3RlZEN1c3RvbWVyLmlkKV0gfHwgMCk7XHJcbiAgfSwgW29yZGVyQ291bnRCeVVzZXIsIHNlbGVjdGVkQ3VzdG9tZXJdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghc2VsZWN0ZWRDdXN0b21lcikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Rm9ybURhdGEoKHByZXYpID0+ICh7XHJcbiAgICAgIC4uLnByZXYsXHJcbiAgICAgIHNoaXBwaW5nTmFtZTogcHJldi5zaGlwcGluZ05hbWUgfHwgc2VsZWN0ZWRDdXN0b21lci5uYW1lIHx8IFwiXCIsXHJcbiAgICAgIHNoaXBwaW5nUGhvbmU6XHJcbiAgICAgICAgcHJldi5zaGlwcGluZ1Bob25lIHx8XHJcbiAgICAgICAgc2VsZWN0ZWRDdXN0b21lci5waG9uZSB8fFxyXG4gICAgICAgIHNlbGVjdGVkQ3VzdG9tZXIubW9iaWxlIHx8XHJcbiAgICAgICAgXCJcIixcclxuICAgIH0pKTtcclxuICB9LCBbc2VsZWN0ZWRDdXN0b21lcl0pO1xyXG5cclxuICBjb25zdCBsaW5lVG90YWxzID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBjb25zdCBzdWJ0b3RhbCA9IGxpbmVJdGVtcy5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4ge1xyXG4gICAgICByZXR1cm4gc3VtICsgdG9OdW1iZXIoaXRlbS5xdWFudGl0eSkgKiB0b051bWJlcihpdGVtLnVuaXRQcmljZSk7XHJcbiAgICB9LCAwKTtcclxuXHJcbiAgICBjb25zdCBzaGlwcGluZ0ZlZSA9IHRvTnVtYmVyKGZvcm1EYXRhLnNoaXBwaW5nRmVlKTtcclxuICAgIGNvbnN0IHRheCA9IHRvTnVtYmVyKGZvcm1EYXRhLnRheCk7XHJcbiAgICBjb25zdCBkaXNjb3VudCA9IHRvTnVtYmVyKGZvcm1EYXRhLmRpc2NvdW50KTtcclxuICAgIGNvbnN0IGdyYW5kVG90YWwgPSBNYXRoLm1heChzdWJ0b3RhbCArIHNoaXBwaW5nRmVlICsgdGF4IC0gZGlzY291bnQsIDApO1xyXG5cclxuICAgIHJldHVybiB7IHN1YnRvdGFsLCBzaGlwcGluZ0ZlZSwgdGF4LCBkaXNjb3VudCwgZ3JhbmRUb3RhbCB9O1xyXG4gIH0sIFtsaW5lSXRlbXMsIGZvcm1EYXRhLnNoaXBwaW5nRmVlLCBmb3JtRGF0YS50YXgsIGZvcm1EYXRhLmRpc2NvdW50XSk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZUZvcm1DaGFuZ2UgPSAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IHsgbmFtZSwgdmFsdWUgfSA9IGV2ZW50LnRhcmdldDtcclxuICAgIHNldEZvcm1EYXRhKChwcmV2KSA9PiAoeyAuLi5wcmV2LCBbbmFtZV06IHZhbHVlIH0pKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBoYW5kbGVMaW5lSXRlbUNoYW5nZSA9IChpbmRleCwga2V5LCB2YWx1ZSkgPT4ge1xyXG4gICAgc2V0TGluZUl0ZW1zKChwcmV2KSA9PiB7XHJcbiAgICAgIGNvbnN0IG5leHQgPSBbLi4ucHJldl07XHJcbiAgICAgIGNvbnN0IGl0ZW0gPSB7IC4uLm5leHRbaW5kZXhdIH07XHJcblxyXG4gICAgICBpZiAoa2V5ID09PSBcInByb2R1Y3RJZFwiKSB7XHJcbiAgICAgICAgaXRlbS5wcm9kdWN0SWQgPSB2YWx1ZTtcclxuICAgICAgICBjb25zdCBwcm9kdWN0ID0gcHJvZHVjdHMuZmluZCgocCkgPT4gU3RyaW5nKHAuaWQpID09PSBTdHJpbmcodmFsdWUpKTtcclxuICAgICAgICBpdGVtLnVuaXRQcmljZSA9IHRvTnVtYmVyKHByb2R1Y3Q/LnByaWNlKTtcclxuICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwic2l6ZVwiKSB7XHJcbiAgICAgICAgaXRlbS5zaXplID0gdmFsdWU7XHJcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInF1YW50aXR5XCIpIHtcclxuICAgICAgICBpdGVtLnF1YW50aXR5ID0gTWF0aC5tYXgoMSwgdG9OdW1iZXIodmFsdWUpKTtcclxuICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwidW5pdFByaWNlXCIpIHtcclxuICAgICAgICBpdGVtLnVuaXRQcmljZSA9IE1hdGgubWF4KDAsIHRvTnVtYmVyKHZhbHVlKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG5leHRbaW5kZXhdID0gaXRlbTtcclxuICAgICAgcmV0dXJuIG5leHQ7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBhZGRMaW5lSXRlbSA9ICgpID0+IHtcclxuICAgIHNldExpbmVJdGVtcygocHJldikgPT4gWy4uLnByZXYsIGNyZWF0ZUVtcHR5SXRlbSgpXSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVtb3ZlTGluZUl0ZW0gPSAoaW5kZXgpID0+IHtcclxuICAgIHNldExpbmVJdGVtcygocHJldikgPT4ge1xyXG4gICAgICBpZiAocHJldi5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gcHJldjtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHByZXYuZmlsdGVyKChfLCBpKSA9PiBpICE9PSBpbmRleCk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBtYXBzSHJlZiA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgaWYgKCFmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3M/LnRyaW0oKSkge1xyXG4gICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9zZWFyY2gvP2FwaT0xJnF1ZXJ5PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGZvcm1EYXRhLnNoaXBwaW5nQWRkcmVzcy50cmltKCkpfWA7XHJcbiAgfSwgW2Zvcm1EYXRhLnNoaXBwaW5nQWRkcmVzc10pO1xyXG5cclxuICBjb25zdCBoYW5kbGVTdWJtaXQgPSBhc3luYyAoZXZlbnQpID0+IHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgY29uc3QgdmFsaWRJdGVtcyA9IGxpbmVJdGVtcy5maWx0ZXIoXHJcbiAgICAgIChpdGVtKSA9PiBpdGVtLnByb2R1Y3RJZCAmJiB0b051bWJlcihpdGVtLnF1YW50aXR5KSA+IDAsXHJcbiAgICApO1xyXG5cclxuICAgIGlmICghZm9ybURhdGEudXNlcklkKSB7XHJcbiAgICAgIGFsZXJ0KFwiUGxlYXNlIHNlbGVjdCBhIGN1c3RvbWVyLlwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YWxpZEl0ZW1zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBhbGVydChcIkF0IGxlYXN0IG9uZSBwcm9kdWN0IGxpbmUgaXRlbSBpcyByZXF1aXJlZC5cIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTdWJtaXR0aW5nKHRydWUpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IG9yZGVyUGF5bG9hZCA9IHtcclxuICAgICAgICB1c2VySWQ6IE51bWJlcihmb3JtRGF0YS51c2VySWQpLFxyXG4gICAgICAgIHN0YXR1czogZm9ybURhdGEuc3RhdHVzLFxyXG4gICAgICAgIHBheW1lbnRNZXRob2Q6IGZvcm1EYXRhLnBheW1lbnRNZXRob2QsXHJcbiAgICAgICAgcGF5bWVudFN0YXR1czogZm9ybURhdGEucGF5bWVudFN0YXR1cyxcclxuICAgICAgICB0cmFuc2FjdGlvbklkOiBmb3JtRGF0YS50cmFuc2FjdGlvbklkIHx8IG51bGwsXHJcbiAgICAgICAgc2hpcHBpbmdOYW1lOiBmb3JtRGF0YS5zaGlwcGluZ05hbWUgfHwgbnVsbCxcclxuICAgICAgICBzaGlwcGluZ1Bob25lOiBmb3JtRGF0YS5zaGlwcGluZ1Bob25lIHx8IG51bGwsXHJcbiAgICAgICAgc2hpcHBpbmdNZXRob2Q6IGZvcm1EYXRhLnNoaXBwaW5nTWV0aG9kLFxyXG4gICAgICAgIHRyYWNraW5nTnVtYmVyOiBmb3JtRGF0YS50cmFja2luZ051bWJlciB8fCBudWxsLFxyXG4gICAgICAgIHN1YnRvdGFsOiBsaW5lVG90YWxzLnN1YnRvdGFsLnRvRml4ZWQoMiksXHJcbiAgICAgICAgc2hpcHBpbmdGZWU6IGxpbmVUb3RhbHMuc2hpcHBpbmdGZWUudG9GaXhlZCgyKSxcclxuICAgICAgICB0YXg6IGxpbmVUb3RhbHMudGF4LnRvRml4ZWQoMiksXHJcbiAgICAgICAgZGlzY291bnQ6IGxpbmVUb3RhbHMuZGlzY291bnQudG9GaXhlZCgyKSxcclxuICAgICAgICB0b3RhbEFtb3VudDogbGluZVRvdGFscy5ncmFuZFRvdGFsLnRvRml4ZWQoMiksXHJcbiAgICAgICAgc2hpcHBpbmdBZGRyZXNzOiBmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3MgfHwgbnVsbCxcclxuICAgICAgICBsaW5lSXRlbXM6IHZhbGlkSXRlbXMubWFwKChpdGVtKSA9PiAoe1xyXG4gICAgICAgICAgcHJvZHVjdElkOiBOdW1iZXIoaXRlbS5wcm9kdWN0SWQpLFxyXG4gICAgICAgICAgc2l6ZTogaXRlbS5zaXplIHx8IG51bGwsXHJcbiAgICAgICAgICBxdWFudGl0eTogTWF0aC5tYXgoMSwgdG9OdW1iZXIoaXRlbS5xdWFudGl0eSkpLFxyXG4gICAgICAgICAgdW5pdFByaWNlOiBNYXRoLm1heCgwLCB0b051bWJlcihpdGVtLnVuaXRQcmljZSkpLnRvRml4ZWQoMiksXHJcbiAgICAgICAgfSkpLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3Qgc3VibWl0Rm9ybSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICBzdWJtaXRGb3JtLmFwcGVuZChcInBheWxvYWRcIiwgSlNPTi5zdHJpbmdpZnkob3JkZXJQYXlsb2FkKSk7XHJcblxyXG4gICAgICBjb25zdCBvcmRlclJlcyA9IGF3YWl0IGZldGNoKFwiL2FkbWluL2NvbnRleHQvb3JkZXItY3JlYXRlL3N1Ym1pdFwiLCB7XHJcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxyXG4gICAgICAgIGJvZHk6IHN1Ym1pdEZvcm0sXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3Qgb3JkZXJEYXRhID0gYXdhaXQgb3JkZXJSZXMuanNvbigpO1xyXG4gICAgICBpZiAoIW9yZGVyUmVzLm9rKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG9yZGVyRGF0YT8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBjcmVhdGUgb3JkZXJcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oXHJcbiAgICAgICAgYC9hZG1pbi9yZXNvdXJjZXMvT3JkZXJzL3JlY29yZHMvJHtvcmRlckRhdGEuaWR9L3Nob3dgLFxyXG4gICAgICApO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgYWxlcnQoZXJyb3IubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBjcmVhdGUgb3JkZXJcIik7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRTdWJtaXR0aW5nKGZhbHNlKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17cGFnZVN0eWxlfT5cclxuICAgICAgPHN0eWxlPntyZXNwb25zaXZlQ3NzfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtoZWFkZXJTdHlsZX0+XHJcbiAgICAgICAgPGgxIHN0eWxlPXt0aXRsZVN0eWxlfT5DcmVhdGUgTmV3IE9yZGVyPC9oMT5cclxuICAgICAgICA8cCBzdHlsZT17ZGVzY1N0eWxlfT5cclxuICAgICAgICAgIEN1c3RvbWVyIGRldGFpbHMsIGxpbmUgaXRlbXMsIHBheW1lbnQsIHNoaXBwaW5nLCBhbmQgdG90YWxzIGluIG9uZVxyXG4gICAgICAgICAgZ3VpZGVkIGZsb3cuXHJcbiAgICAgICAgPC9wPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxmb3JtIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9IHN0eWxlPXt7IGRpc3BsYXk6IFwiZ3JpZFwiLCBnYXA6IFwiMTZweFwiIH19PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1sYXlvdXRcIiBzdHlsZT17bGF5b3V0U3R5bGV9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17c3RhY2tTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+Q3VzdG9tZXIgRGV0YWlsczwvaDI+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+U2VsZWN0IEN1c3RvbWVyICo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICBuYW1lPVwidXNlcklkXCJcclxuICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnVzZXJJZH1cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17bG9hZGluZyB8fCBzZXNzaW9uVXNlcj8ucm9sZSA9PT0gXCJ1c2VyXCJ9XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5cclxuICAgICAgICAgICAgICAgICAgICB7bG9hZGluZyA/IFwiTG9hZGluZyBjdXN0b21lcnMuLi5cIiA6IFwiU2VsZWN0IGEgY3VzdG9tZXJcIn1cclxuICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIHt1c2Vycy5tYXAoKHVzZXIpID0+IChcclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17dXNlci5pZH0gdmFsdWU9e3VzZXIuaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAge3VzZXIubmFtZX0gKCN7dXNlci5pZH0pXHJcbiAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMiB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtjdXN0b21lckluZm9TdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtjdXN0b21lclJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PkN1c3RvbWVyIE5hbWUgJiBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0cm9uZ1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRDdXN0b21lclxyXG4gICAgICAgICAgICAgICAgICAgICAgPyBgJHtzZWxlY3RlZEN1c3RvbWVyLm5hbWV9ICgjJHtzZWxlY3RlZEN1c3RvbWVyLmlkfSlgXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IFwiLVwifVxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVyUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+RW1haWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtzdHJvbmdTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkQ3VzdG9tZXI/LmVtYWlsIHx8IFwiLVwifVxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVyUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+UGhvbmUgTnVtYmVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17c3Ryb25nU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZEN1c3RvbWVyPy5waG9uZSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRDdXN0b21lcj8ubW9iaWxlIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICBcIk5vdCBhdmFpbGFibGVcIn1cclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtjdXN0b21lclJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9Pk9yZGVyIEhpc3Rvcnk8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtzdHJvbmdTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAge2N1c3RvbWVyT3JkZXJDb3VudH0gcHJldmlvdXMgb3JkZXJzXHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UGF5bWVudCAmIEJpbGxpbmc8L2gyPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlBheW1lbnQgT3B0aW9uczwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtwYXltZW50T3B0aW9uR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAge3BheW1lbnRPcHRpb25zLm1hcCgob3B0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlID0gZm9ybURhdGEucGF5bWVudE1ldGhvZCA9PT0gb3B0aW9uLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e29wdGlvbi52YWx1ZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtwYXltZW50T3B0aW9uU3R5bGUoYWN0aXZlKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRGb3JtRGF0YSgocHJldikgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnByZXYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXltZW50TWV0aG9kOiBvcHRpb24udmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e29wdGlvbi5pY29ufTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e29wdGlvbi5sYWJlbH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWdyaWQtMlwiIHN0eWxlPXtncmlkMlN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TZWxlY3RlZCBNZXRob2Q8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEucGF5bWVudE1ldGhvZH1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICByZWFkT25seVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlBheW1lbnQgU3RhdHVzPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJwYXltZW50U3RhdHVzXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEucGF5bWVudFN0YXR1c31cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwZW5kaW5nXCI+UGVuZGluZzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwYWlkXCI+UGFpZDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5UcmFuc2FjdGlvbiBJRDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgbmFtZT1cInRyYW5zYWN0aW9uSWRcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudHJhbnNhY3Rpb25JZH1cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gVFhOLTIwMjYtMDAwMTI0XCJcclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17c3RhY2tTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgZ2FwOiBcIjhweFwiLFxyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3sgLi4uc2VjdGlvblRpdGxlU3R5bGUsIG1hcmdpbkJvdHRvbTogMCB9fT5cclxuICAgICAgICAgICAgICAgICAgUHJvZHVjdCBMaW5lIEl0ZW1zIChSZXF1aXJlZClcclxuICAgICAgICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXthZGRMaW5lSXRlbX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2FkZEJ1dHRvblN0eWxlfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICArIEFkZCBJdGVtXHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCIxMHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICB7bGluZUl0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRQcm9kdWN0ID0gcHJvZHVjdHMuZmluZChcclxuICAgICAgICAgICAgICAgICAgICAocCkgPT4gU3RyaW5nKHAuaWQpID09PSBTdHJpbmcoaXRlbS5wcm9kdWN0SWQpLFxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICBjb25zdCBpdGVtVG90YWwgPVxyXG4gICAgICAgICAgICAgICAgICAgIHRvTnVtYmVyKGl0ZW0ucXVhbnRpdHkpICogdG9OdW1iZXIoaXRlbS51bml0UHJpY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17YGxpbmUtaXRlbS0ke2luZGV4fWB9IHN0eWxlPXtsaW5lSXRlbVJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2xpbmVJdGVtVG9wU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5Qcm9kdWN0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aXRlbS5wcm9kdWN0SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVMaW5lSXRlbUNoYW5nZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInByb2R1Y3RJZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3QgcHJvZHVjdDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3Byb2R1Y3RzLm1hcCgocHJvZHVjdCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17cHJvZHVjdC5pZH0gdmFsdWU9e3Byb2R1Y3QuaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwcm9kdWN0Lm5hbWV9IChTS1U6IHtwcm9kdWN0LnNrdX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtyZW1vdmVCdXR0b25TdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByZW1vdmVMaW5lSXRlbShpbmRleCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBSZW1vdmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtwcm9kdWN0UHJldmlld1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkUHJvZHVjdD8uaW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXtzZWxlY3RlZFByb2R1Y3QuaW1hZ2VVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHQ9e3NlbGVjdGVkUHJvZHVjdC5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5pbWFnZVN0eWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBObyBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZ3JpZFwiLCBnYXA6IFwiM3B4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IFwiMTRweFwiLCBjb2xvcjogXCIjZjhmYWZjXCIgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRQcm9kdWN0Py5uYW1lIHx8IFwiU2VsZWN0IGEgcHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiBcIjEycHhcIiwgY29sb3I6IFwiIzk0YTNiOFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU0tVL0lEOntcIiBcIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZFByb2R1Y3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBgJHtzZWxlY3RlZFByb2R1Y3Quc2t1fSAvICMke3NlbGVjdGVkUHJvZHVjdC5pZH1gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCItXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiBcIjEycHhcIiwgY29sb3I6IFwiI2NiZDVlMVwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2l6ZToge2l0ZW0uc2l6ZSB8fCBcIi1cIn0gfCBRdHk6IHtpdGVtLnF1YW50aXR5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+U2l6ZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aXRlbS5zaXplIHx8IFwiTVwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVMaW5lSXRlbUNoYW5nZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2l6ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQudmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW1TaXplT3B0aW9ucy5tYXAoKHNpemVPcHRpb24pID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtzaXplT3B0aW9ufSB2YWx1ZT17c2l6ZU9wdGlvbn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzaXplT3B0aW9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWdyaWQtMlwiIHN0eWxlPXtncmlkMlN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+UXVhbnRpdHk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIxXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnF1YW50aXR5fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTGluZUl0ZW1DaGFuZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJxdWFudGl0eVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5Vbml0IFByaWNlPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aXRlbS51bml0UHJpY2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVMaW5lSXRlbUNoYW5nZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInVuaXRQcmljZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnRvdGFsc1Jvd1N0eWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogXCJub25lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ0JvdHRvbTogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PkxpbmUgVG90YWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtmb3JtYXRNb25leShpdGVtVG90YWwpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5TaGlwcGluZyAmIFRyYWNraW5nPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWdyaWQtMlwiIHN0eWxlPXtncmlkMlN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TaGlwcGluZyBDb250YWN0IE5hbWUgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJzaGlwcGluZ05hbWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5zaGlwcGluZ05hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJSZWNlaXZlciBmdWxsIG5hbWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TaGlwcGluZyBQaG9uZSBOdW1iZXIgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJzaGlwcGluZ1Bob25lXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuc2hpcHBpbmdQaG9uZX1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjA3WCBYWFggWFhYWFwiXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TaGlwcGluZyBBZGRyZXNzICo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHRleHRhcmVhXHJcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJzaGlwcGluZ0FkZHJlc3NcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuc2hpcHBpbmdBZGRyZXNzfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAuLi5pbnB1dFN0eWxlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1pbkhlaWdodDogXCI4NnB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzaXplOiBcInZlcnRpY2FsXCIsXHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiSG91c2UgbnVtYmVyLCBzdHJlZXQsIGNpdHksIHBvc3RhbCBjb2RlXCJcclxuICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICB7bWFwc0hyZWYgPyAoXHJcbiAgICAgICAgICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgICAgICAgICAgaHJlZj17bWFwc0hyZWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcclxuICAgICAgICAgICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17bWFwTGlua1N0eWxlfVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgT3BlbiBvbiBHb29nbGUgTWFwc1xyXG4gICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICApIDogbnVsbH1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEwIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1ncmlkLTJcIiBzdHlsZT17Z3JpZDJTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+U2hpcHBpbmcgTWV0aG9kPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJzaGlwcGluZ01ldGhvZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnNoaXBwaW5nTWV0aG9kfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAge3NoaXBwaW5nTWV0aG9kcy5tYXAoKGl0ZW0pID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtpdGVtfSB2YWx1ZT17aXRlbX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+VHJhY2tpbmcgTnVtYmVyPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInRyYWNraW5nTnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudHJhY2tpbmdOdW1iZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJUUkstWFhYWFhYXCJcclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+T3JkZXIgU3VtbWFyeSAvIFRvdGFsczwvaDI+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1ncmlkLTJcIiBzdHlsZT17Z3JpZDJTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+U2hpcHBpbmcgRmVlPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxyXG4gICAgICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJzaGlwcGluZ0ZlZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnNoaXBwaW5nRmVlfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+VGF4IC8gVkFUPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxyXG4gICAgICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJ0YXhcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS50YXh9XHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEwIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+RGlzY291bnQgLyBDb3Vwb248L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXHJcbiAgICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxyXG4gICAgICAgICAgICAgICAgICBuYW1lPVwiZGlzY291bnRcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuZGlzY291bnR9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMiB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbHNSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+U3VidG90YWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leShsaW5lVG90YWxzLnN1YnRvdGFsKX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbHNSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+U2hpcHBpbmcgRmVlPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkobGluZVRvdGFscy5zaGlwcGluZ0ZlZSl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxzUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PlRheCAvIFZBVDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGxpbmVUb3RhbHMudGF4KX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbHNSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+RGlzY291bnQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3Ryb25nPi0ge2Zvcm1hdE1vbmV5KGxpbmVUb3RhbHMuZGlzY291bnQpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+R3JhbmQgVG90YWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57Zm9ybWF0TW9uZXkobGluZVRvdGFscy5ncmFuZFRvdGFsKX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3NlY3VyaXR5Q2hpcFdyYXBTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzZWN1cml0eUNoaXBTdHlsZX0+U2VjdXJlIFBheW1lbnQgUHJvdGVjdGVkPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzZWN1cml0eUNoaXBTdHlsZX0+RW5jcnlwdGVkIENoZWNrb3V0IENoYW5uZWw8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3NlY3VyaXR5Q2hpcFN0eWxlfT5UcnVzdGVkIERlbGl2ZXJ5IFRyYWNraW5nPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgLi4uY2FyZFN0eWxlLCBwYWRkaW5nVG9wOiBcIjE0cHhcIiB9fT5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2FjdGlvbkJhclN0eWxlfT5cclxuICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgIHN0eWxlPXthY3Rpb25CdXR0b25TdHlsZShmYWxzZSl9XHJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gd2luZG93Lmhpc3RvcnkuYmFjaygpfVxyXG4gICAgICAgICAgICAgIGRpc2FibGVkPXtzdWJtaXR0aW5nfVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgQ2FuY2VsXHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgdHlwZT1cInN1Ym1pdFwiXHJcbiAgICAgICAgICAgICAgc3R5bGU9e2FjdGlvbkJ1dHRvblN0eWxlKHRydWUpfVxyXG4gICAgICAgICAgICAgIGRpc2FibGVkPXtzdWJtaXR0aW5nfVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAge3N1Ym1pdHRpbmcgPyBcIkNyZWF0aW5nIE9yZGVyLi4uXCIgOiBcIkNyZWF0ZSBPcmRlclwifVxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Zvcm0+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgT3JkZXJDcmVhdGU7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBwYWdlU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxuICBjb2xvcjogXCIjZTJlOGYwXCIsXHJcbn07XHJcblxyXG5jb25zdCBjYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE4cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yKVwiLFxyXG4gIGJhY2tncm91bmQ6XHJcbiAgICBcImxpbmVhci1ncmFkaWVudCgxNTVkZWcsIHJnYmEoMTAsIDIzLCA0OCwgMC45NCkgMCUsIHJnYmEoOCwgMTgsIDM4LCAwLjk0KSAxMDAlKVwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDE0cHggMzBweCByZ2JhKDIsIDYsIDIzLCAwLjIpXCIsXHJcbiAgcGFkZGluZzogXCIxOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBoZWFkZXJTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgaGVhZGluZ1N0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgZm9udFNpemU6IFwiMzRweFwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuMSxcclxufTtcclxuXHJcbmNvbnN0IHN1YlRleHRTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIG1hcmdpblRvcDogXCI0cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGJhZGdlU3R5bGUgPSAoc3RhdHVzKSA9PiB7XHJcbiAgY29uc3QgdmFsID0gU3RyaW5nKHN0YXR1cyB8fCBcInBlbmRpbmdcIikudG9Mb3dlckNhc2UoKTtcclxuICBjb25zdCBzdHlsZUJ5U3RhdHVzID0ge1xyXG4gICAgcGVuZGluZzogeyBiZzogXCIjZmVmM2M3XCIsIGZnOiBcIiM3YzJkMTJcIiB9LFxyXG4gICAgcGFpZDogeyBiZzogXCIjYmJmN2QwXCIsIGZnOiBcIiMxNDUzMmRcIiB9LFxyXG4gICAgcHJvY2Vzc2luZzogeyBiZzogXCIjYmZkYmZlXCIsIGZnOiBcIiMxZTNhOGFcIiB9LFxyXG4gICAgc2hpcHBlZDogeyBiZzogXCIjZGRkNmZlXCIsIGZnOiBcIiM0YzFkOTVcIiB9LFxyXG4gICAgY29tcGxldGVkOiB7IGJnOiBcIiNhN2YzZDBcIiwgZmc6IFwiIzA2NGUzYlwiIH0sXHJcbiAgICBjYW5jZWxsZWQ6IHsgYmc6IFwiI2ZlY2FjYVwiLCBmZzogXCIjN2YxZDFkXCIgfSxcclxuICB9O1xyXG5cclxuICBjb25zdCBzZWxlY3RlZCA9IHN0eWxlQnlTdGF0dXNbdmFsXSB8fCBzdHlsZUJ5U3RhdHVzLnBlbmRpbmc7XHJcbiAgcmV0dXJuIHtcclxuICAgIGRpc3BsYXk6IFwiaW5saW5lLWZsZXhcIixcclxuICAgIHBhZGRpbmc6IFwiNnB4IDEycHhcIixcclxuICAgIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gICAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gICAgZm9udFdlaWdodDogODAwLFxyXG4gICAgbGV0dGVyU3BhY2luZzogXCIwLjA4ZW1cIixcclxuICAgIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgICBiYWNrZ3JvdW5kOiBzZWxlY3RlZC5iZyxcclxuICAgIGNvbG9yOiBzZWxlY3RlZC5mZyxcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3Qgc2VjdGlvblRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiBcIjAgMCAxMnB4IDBcIixcclxuICBjb2xvcjogXCIjZjVkZjkwXCIsXHJcbiAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTFlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbn07XHJcblxyXG5jb25zdCBncmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJtaW5tYXgoMzAwcHgsIDFmcikgbWlubWF4KDMyMHB4LCAxZnIpXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9HcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb1Jvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiOHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgdGFibGVTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG59O1xyXG5cclxuY29uc3QgbGluZUl0ZW1TdHlsZSA9IHtcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yMilcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTRweFwiLFxyXG4gIHBhZGRpbmc6IFwiMTBweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSgxNSwgMjMsIDQyLCAwLjQ0KVwiLFxyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiNjBweCAxZnIgYXV0b1wiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiNjBweFwiLFxyXG4gIGhlaWdodDogXCI2MHB4XCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yMilcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxufTtcclxuXHJcbmNvbnN0IHRvdGFsQm94U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgdG90YWxSb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiN3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCBncmFuZFN0eWxlID0ge1xyXG4gIC4uLnRvdGFsUm93U3R5bGUsXHJcbiAgYm9yZGVyQm90dG9tOiBcIm5vbmVcIixcclxuICBwYWRkaW5nVG9wOiBcIjZweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBmb250U2l6ZTogXCIxOHB4XCIsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3QgZW1wdHlTdHlsZSA9IHtcclxuICBib3JkZXI6IFwiMXB4IGRhc2hlZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMzUpXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBwYWRkaW5nOiBcIjE0cHhcIixcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXRNb25leSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IG4gPSBOdW1iZXIodmFsdWUgfHwgMCk7XHJcbiAgcmV0dXJuIGBScy4gJHtuLnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gIH0pfWA7XHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXREYXRlID0gKHZhbHVlKSA9PiB7XHJcbiAgaWYgKCF2YWx1ZSkge1xyXG4gICAgcmV0dXJuIFwiLVwiO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZHQgPSBuZXcgRGF0ZSh2YWx1ZSk7XHJcbiAgaWYgKE51bWJlci5pc05hTihkdC5nZXRUaW1lKCkpKSB7XHJcbiAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkdC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIGRhdGVTdHlsZTogXCJtZWRpdW1cIixcclxuICAgIHRpbWVTdHlsZTogXCJzaG9ydFwiLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgT3JkZXJTaG93ID0gKHsgcmVjb3JkIH0pID0+IHtcclxuICBjb25zdCBbZGV0YWlscywgc2V0RGV0YWlsc10gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG5cclxuICBjb25zdCBvcmRlcklkID0gcmVjb3JkPy5wYXJhbXM/LmlkIHx8IHJlY29yZD8uaWQ7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoIW9yZGVySWQpIHtcclxuICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIHNldEVycm9yKFwiT3JkZXIgaWQgbm90IGZvdW5kXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbG9hZERldGFpbHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgc2V0RXJyb3IoXCJcIik7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgICAgIGAvYWRtaW4vY29udGV4dC9vcmRlcnMvJHtlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKG9yZGVySWQpKX0vZGV0YWlsc2AsXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBheWxvYWQ/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gbG9hZCBvcmRlciBkZXRhaWxzXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0RGV0YWlscyhwYXlsb2FkKTtcclxuICAgICAgfSBjYXRjaCAoZmV0Y2hFcnJvcikge1xyXG4gICAgICAgIHNldEVycm9yKGZldGNoRXJyb3I/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gbG9hZCBvcmRlciBkZXRhaWxzXCIpO1xyXG4gICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWREZXRhaWxzKCk7XHJcbiAgfSwgW29yZGVySWRdKTtcclxuXHJcbiAgY29uc3QgdG90YWxzID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBjb25zdCBzdWJ0b3RhbCA9IE51bWJlcihkZXRhaWxzPy5zdWJ0b3RhbCB8fCAwKTtcclxuICAgIGNvbnN0IHNoaXBwaW5nRmVlID0gTnVtYmVyKGRldGFpbHM/LnNoaXBwaW5nRmVlIHx8IDApO1xyXG4gICAgY29uc3QgdGF4ID0gTnVtYmVyKGRldGFpbHM/LnRheCB8fCAwKTtcclxuICAgIGNvbnN0IGRpc2NvdW50ID0gTnVtYmVyKGRldGFpbHM/LmRpc2NvdW50IHx8IDApO1xyXG4gICAgY29uc3QgdG90YWxBbW91bnQgPSBOdW1iZXIoZGV0YWlscz8udG90YWxBbW91bnQgfHwgMCk7XHJcblxyXG4gICAgcmV0dXJuIHsgc3VidG90YWwsIHNoaXBwaW5nRmVlLCB0YXgsIGRpc2NvdW50LCB0b3RhbEFtb3VudCB9O1xyXG4gIH0sIFtkZXRhaWxzXSk7XHJcblxyXG4gIGlmIChsb2FkaW5nKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+TG9hZGluZyBvcmRlciBkZXRhaWxzLi4uPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+e2Vycm9yfTwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmICghZGV0YWlscykge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9Pk9yZGVyIGRldGFpbHMgbm90IGF2YWlsYWJsZS48L2Rpdj47XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17cGFnZVN0eWxlfT5cclxuICAgICAgPHN0eWxlPntgQG1lZGlhIChtYXgtd2lkdGg6IDEwNDBweCkgeyAuY2hhbmdlOC1vcmRlci1zaG93LWdyaWQgeyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50OyB9IH1gfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2hlYWRlclN0eWxlfT5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxoMSBzdHlsZT17aGVhZGluZ1N0eWxlfT5PcmRlciAje2RldGFpbHMuaWR9PC9oMT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17c3ViVGV4dFN0eWxlfT5cclxuICAgICAgICAgICAgICBDcmVhdGVkIHtmb3JtYXREYXRlKGRldGFpbHMuY3JlYXRlZEF0KX0gfCBVcGRhdGVke1wiIFwifVxyXG4gICAgICAgICAgICAgIHtmb3JtYXREYXRlKGRldGFpbHMudXBkYXRlZEF0KX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxzcGFuIHN0eWxlPXtiYWRnZVN0eWxlKGRldGFpbHMuc3RhdHVzKX0+XHJcbiAgICAgICAgICAgIHtkZXRhaWxzLnN0YXR1cyB8fCBcInBlbmRpbmdcIn1cclxuICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItc2hvdy1ncmlkXCIgc3R5bGU9e2dyaWRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PkN1c3RvbWVyICYgU2hpcHBpbmc8L2gyPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0dyaWRTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkN1c3RvbWVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnVzZXI/Lm5hbWUgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5TaGlwcGluZyBDb250YWN0PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnNoaXBwaW5nTmFtZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlNoaXBwaW5nIFBob25lPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnNoaXBwaW5nUGhvbmUgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5FbWFpbDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy51c2VyPy5lbWFpbCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlBheW1lbnQgTWV0aG9kPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnBheW1lbnRNZXRob2QgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5QYXltZW50IFN0YXR1czwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy5wYXltZW50U3RhdHVzIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VHJhbnNhY3Rpb24gSUQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8udHJhbnNhY3Rpb25JZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlNoaXBwaW5nIE1ldGhvZDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy5zaGlwcGluZ01ldGhvZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlRyYWNraW5nIE51bWJlcjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy50cmFja2luZ051bWJlciB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogXCIxM3B4XCIsIGNvbG9yOiBcIiNjYmQ1ZTFcIiwgbGluZUhlaWdodDogMS42IH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiwgbWFyZ2luQm90dG9tOiBcIjRweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgU2hpcHBpbmcgQWRkcmVzc1xyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2hpdGVTcGFjZTogXCJwcmUtd3JhcFwiIH19PlxyXG4gICAgICAgICAgICAgICAge2RldGFpbHM/LnNoaXBwaW5nQWRkcmVzcyB8fCBcIi1cIn1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9Pk9yZGVyIFN1bW1hcnkgLyBUb3RhbHM8L2gyPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxCb3hTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5TdWJ0b3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leSh0b3RhbHMuc3VidG90YWwpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlNoaXBwaW5nIEZlZTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leSh0b3RhbHMuc2hpcHBpbmdGZWUpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlRheCAvIFZBVDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leSh0b3RhbHMudGF4KX08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5EaXNjb3VudDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPi0ge2Zvcm1hdE1vbmV5KHRvdGFscy5kaXNjb3VudCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtncmFuZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8c3Bhbj5HcmFuZCBUb3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Bhbj57Zm9ybWF0TW9uZXkodG90YWxzLnRvdGFsQW1vdW50KX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5Qcm9kdWN0IExpbmUgSXRlbXM8L2gyPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3RhYmxlU3R5bGV9PlxyXG4gICAgICAgICAgeyhkZXRhaWxzPy5pdGVtcyB8fCBbXSkubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5ObyBsaW5lIGl0ZW1zIGluIHRoaXMgb3JkZXIuPC9kaXY+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAoZGV0YWlscy5pdGVtcyB8fCBbXSkubWFwKChpdGVtKSA9PiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e2l0ZW0uaWR9IHN0eWxlPXtsaW5lSXRlbVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIHtpdGVtPy5wcm9kdWN0Py5pbWFnZVVybCA/IChcclxuICAgICAgICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYz17aXRlbS5wcm9kdWN0LmltYWdlVXJsfVxyXG4gICAgICAgICAgICAgICAgICAgIGFsdD17aXRlbT8ucHJvZHVjdD8ubmFtZSB8fCBcIlByb2R1Y3RcIn1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgLi4uaW1hZ2VTdHlsZSxcclxuICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICBObyBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ2FwOiBcIjRweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGNvbG9yOiBcIiNmOGZhZmNcIiwgZm9udFNpemU6IFwiMTRweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIHtpdGVtPy5wcm9kdWN0Py5uYW1lIHx8IFwiVW5uYW1lZCBwcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICBTS1U6IHtpdGVtPy5wcm9kdWN0Py5za3UgfHwgXCItXCJ9IHwgUHJvZHVjdCBJRDogI1xyXG4gICAgICAgICAgICAgICAgICAgIHtpdGVtPy5wcm9kdWN0SWR9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiI2NiZDVlMVwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgU2l6ZToge2l0ZW0/LnNpemUgfHwgXCItXCJ9IHwgUXR5OiB7aXRlbS5xdWFudGl0eX0geHtcIiBcIn1cclxuICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0TW9uZXkoaXRlbS51bml0UHJpY2UpfVxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGNvbG9yOiBcIiNmOGZhZmNcIiwgZm9udFNpemU6IFwiMTVweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICB7Zm9ybWF0TW9uZXkoaXRlbS50b3RhbFByaWNlKX1cclxuICAgICAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApKVxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgT3JkZXJTaG93O1xyXG4iLCJcclxuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHBhZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG4gIGNvbG9yOiBcIiNlMmU4ZjBcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMThweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIpXCIsXHJcbiAgYmFja2dyb3VuZDpcclxuICAgIFwibGluZWFyLWdyYWRpZW50KDE1NWRlZywgcmdiYSgxMCwgMjMsIDQ4LCAwLjk0KSAwJSwgcmdiYSg4LCAxOCwgMzgsIDAuOTQpIDEwMCUpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTRweCAzMHB4IHJnYmEoMiwgNiwgMjMsIDAuMilcIixcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGhlYWRlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCB0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBmb250U2l6ZTogXCIzNHB4XCIsXHJcbiAgbGluZUhlaWdodDogMS4xLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IHN1YnRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiBcIjZweCAwIDAgMFwiLFxyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCBiYWRnZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiaW5saW5lLWZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIHdpZHRoOiBcImZpdC1jb250ZW50XCIsXHJcbiAgcGFkZGluZzogXCI2cHggMTJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjA4ZW1cIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gIGNvbG9yOiBcIiMxNDUzMmRcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNiYmY3ZDBcIixcclxufTtcclxuXHJcbmNvbnN0IGdyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgzMDBweCwgMC45NWZyKSBtaW5tYXgoMzIwcHgsIDEuMDVmcilcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdGlvblRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiBcIjAgMCAxMnB4IDBcIixcclxuICBjb2xvcjogXCIjZjVkZjkwXCIsXHJcbiAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTFlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvR3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9Sb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjhweFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIGhlaWdodDogXCIyODBweFwiLFxyXG4gIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjMGYxNzJhXCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjIpXCIsXHJcbn07XHJcblxyXG5jb25zdCBsaW5lSXRlbVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiODRweCAxZnIgYXV0b1wiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBwYWRkaW5nOiBcIjEycHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTRweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIpXCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNDQpXCIsXHJcbn07XHJcblxyXG5jb25zdCBlbXB0eUltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiODRweFwiLFxyXG4gIGhlaWdodDogXCI4NHB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yMilcIixcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0b3RhbFJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI3cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGdyYW5kU3R5bGUgPSB7XHJcbiAgLi4udG90YWxSb3dTdHlsZSxcclxuICBib3JkZXJCb3R0b206IFwibm9uZVwiLFxyXG4gIHBhZGRpbmdUb3A6IFwiNnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGZvbnRTaXplOiBcIjE4cHhcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBlbXB0eVN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggZGFzaGVkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdE1vbmV5ID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgbiA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gYFJzLiAke24udG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSl9YDtcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUpID0+IHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gXCItXCI7XHJcbiAgfVxyXG5cclxuICBjb25zdCBkdCA9IG5ldyBEYXRlKHZhbHVlKTtcclxuICBpZiAoTnVtYmVyLmlzTmFOKGR0LmdldFRpbWUoKSkpIHtcclxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGR0LnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgZGF0ZVN0eWxlOiBcIm1lZGl1bVwiLFxyXG4gICAgdGltZVN0eWxlOiBcInNob3J0XCIsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBPcmRlckl0ZW1TaG93ID0gKHsgcmVjb3JkIH0pID0+IHtcclxuICBjb25zdCBbZGV0YWlscywgc2V0RGV0YWlsc10gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG5cclxuICBjb25zdCBvcmRlckl0ZW1JZCA9IHJlY29yZD8ucGFyYW1zPy5pZCB8fCByZWNvcmQ/LmlkO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKCFvcmRlckl0ZW1JZCkge1xyXG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgc2V0RXJyb3IoXCJPcmRlciBpdGVtIGlkIG5vdCBmb3VuZFwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxvYWREZXRhaWxzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHNldEVycm9yKFwiXCIpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgICAgICBgL2FkbWluL2NvbnRleHQvb3JkZXItaXRlbXMvJHtlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKG9yZGVySXRlbUlkKSl9L2RldGFpbHNgLFxyXG4gICAgICAgICAgeyBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgIHBheWxvYWQ/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gbG9hZCBvcmRlciBpdGVtIGRldGFpbHNcIixcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXREZXRhaWxzKHBheWxvYWQpO1xyXG4gICAgICB9IGNhdGNoIChmZXRjaEVycm9yKSB7XHJcbiAgICAgICAgc2V0RXJyb3IoZmV0Y2hFcnJvcj8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGl0ZW0gZGV0YWlsc1wiKTtcclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkRGV0YWlscygpO1xyXG4gIH0sIFtvcmRlckl0ZW1JZF0pO1xyXG5cclxuICBjb25zdCBjYWxjdWxhdGVkVG90YWwgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiBOdW1iZXIoZGV0YWlscz8udG90YWxQcmljZSB8fCAwKTtcclxuICB9LCBbZGV0YWlsc10pO1xyXG5cclxuICBpZiAobG9hZGluZykge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9PkxvYWRpbmcgb3JkZXIgaXRlbSBkZXRhaWxzLi4uPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+e2Vycm9yfTwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmICghZGV0YWlscykge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9Pk9yZGVyIGl0ZW0gZGV0YWlscyBub3QgYXZhaWxhYmxlLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIGNvbnN0IHByb2R1Y3QgPSBkZXRhaWxzPy5wcm9kdWN0IHx8IHt9O1xyXG4gIGNvbnN0IG9yZGVyID0gZGV0YWlscz8ub3JkZXIgfHwge307XHJcbiAgY29uc3QgY3VzdG9tZXIgPSBvcmRlcj8udXNlciB8fCB7fTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3BhZ2VTdHlsZX0+XHJcbiAgICAgIDxzdHlsZT57YEBtZWRpYSAobWF4LXdpZHRoOiAxMDQwcHgpIHsgLmNoYW5nZTgtb3JkZXItaXRlbS1ncmlkIHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgIWltcG9ydGFudDsgfSB9YH08L3N0eWxlPlxyXG5cclxuICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtoZWFkZXJTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8aDEgc3R5bGU9e3RpdGxlU3R5bGV9Pntwcm9kdWN0Py5uYW1lIHx8IFwiT3JkZXIgSXRlbVwifTwvaDE+XHJcbiAgICAgICAgICAgIDxwIHN0eWxlPXtzdWJ0aXRsZVN0eWxlfT5cclxuICAgICAgICAgICAgICBPcmRlciAje29yZGVyPy5pZCB8fCBcIi1cIn0g4oCiIEl0ZW0gI3tkZXRhaWxzPy5pZCB8fCBcIi1cIn1cclxuICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8c3BhbiBzdHlsZT17YmFkZ2VTdHlsZX0+QWN0aXZlIEl0ZW08L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWl0ZW0tZ3JpZFwiIHN0eWxlPXtncmlkU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICB7cHJvZHVjdD8uaW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICBzcmM9e3Byb2R1Y3QuaW1hZ2VVcmx9XHJcbiAgICAgICAgICAgICAgYWx0PXtwcm9kdWN0Py5uYW1lIHx8IFwiUHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgIHN0eWxlPXtpbWFnZVN0eWxlfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAuLi5pbWFnZVN0eWxlLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIE5vIGltYWdlIGF2YWlsYWJsZVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDE0IH19IC8+XHJcblxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UHJvZHVjdCBTbmFwc2hvdDwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UHJvZHVjdCBOYW1lPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e3Byb2R1Y3Q/Lm5hbWUgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5TS1U8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57cHJvZHVjdD8uc2t1IHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UHJvZHVjdCBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPiN7cHJvZHVjdD8uaWQgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5DdXJyZW50IFN0b2NrPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e3Byb2R1Y3Q/LnN0b2NrID8/IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+T3JkZXIgJiBDdXN0b21lcjwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+Q3VzdG9tZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Y3VzdG9tZXI/Lm5hbWUgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5FbWFpbDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntjdXN0b21lcj8uZW1haWwgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5PcmRlciBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPiN7b3JkZXI/LmlkIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+T3JkZXIgU3RhdHVzPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e29yZGVyPy5zdGF0dXMgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5QYXltZW50IE1ldGhvZDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntvcmRlcj8ucGF5bWVudE1ldGhvZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlNoaXBwaW5nIE1ldGhvZDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntvcmRlcj8uc2hpcHBpbmdNZXRob2QgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5UcmFja2luZyBOdW1iZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57b3JkZXI/LnRyYWNraW5nTnVtYmVyIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+Q3JlYXRlZCBBdDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntmb3JtYXREYXRlKGRldGFpbHMuY3JlYXRlZEF0KX08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlByaWNpbmcgRGV0YWlsczwvaDI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17aW5mb0dyaWRTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UXVhbnRpdHk8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHMucXVhbnRpdHl9PC9zdHJvbmc+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5Vbml0IFByaWNlPC9zcGFuPlxyXG4gICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leShkZXRhaWxzLnVuaXRQcmljZSl9PC9zdHJvbmc+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5MaW5lIFRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leShjYWxjdWxhdGVkVG90YWwpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5RdWljayBTdW1tYXJ5PC9oMj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtsaW5lSXRlbVN0eWxlfT5cclxuICAgICAgICAgIHtwcm9kdWN0Py5pbWFnZVVybCA/IChcclxuICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgIHNyYz17cHJvZHVjdC5pbWFnZVVybH1cclxuICAgICAgICAgICAgICBhbHQ9e3Byb2R1Y3Q/Lm5hbWUgfHwgXCJQcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBcIjg0cHhcIixcclxuICAgICAgICAgICAgICAgIGhlaWdodDogXCI4NHB4XCIsXHJcbiAgICAgICAgICAgICAgICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2VtcHR5SW1hZ2VTdHlsZX0+Tm8gaW1hZ2U8L2Rpdj5cclxuICAgICAgICAgICl9XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZ3JpZFwiLCBnYXA6IFwiNHB4XCIgfX0+XHJcbiAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAge3Byb2R1Y3Q/Lm5hbWUgfHwgXCJVbm5hbWVkIHByb2R1Y3RcIn1cclxuICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgIFNLVToge3Byb2R1Y3Q/LnNrdSB8fCBcIi1cIn1cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjY2JkNWUxXCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICBRdHkge2RldGFpbHMucXVhbnRpdHl9IHgge2Zvcm1hdE1vbmV5KGRldGFpbHMudW5pdFByaWNlKX1cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGNvbG9yOiBcIiNmOGZhZmNcIiwgZm9udFNpemU6IFwiMTZweFwiIH19PlxyXG4gICAgICAgICAgICB7Zm9ybWF0TW9uZXkoY2FsY3VsYXRlZFRvdGFsKX1cclxuICAgICAgICAgIDwvc3Ryb25nPlxyXG5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgT3JkZXJJdGVtU2hvdztcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IGNlbGxTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgbWluSGVpZ2h0OiBcIjU2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiNjRweFwiLFxyXG4gIGhlaWdodDogXCI0MnB4XCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmOGZhZmNcIixcclxuICBmbGV4U2hyaW5rOiAwLFxyXG59O1xyXG5cclxuY29uc3QgZmFsbGJhY2tTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2NHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjQycHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggZGFzaGVkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC42KVwiLFxyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGNvbG9yOiBcIiM2NDc0OGJcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmOGZhZmNcIixcclxuICBmbGV4U2hyaW5rOiAwLFxyXG59O1xyXG5cclxuY29uc3QgdGV4dFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXHJcbiAgZ2FwOiBcIjJweFwiLFxyXG59O1xyXG5cclxuY29uc3QgUHJvZHVjdEltYWdlID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgaW1hZ2VVcmwgPSBwcm9wcz8ucmVjb3JkPy5wYXJhbXM/Lltwcm9wcz8ucHJvcGVydHk/LnBhdGhdO1xyXG4gIGNvbnN0IFtoYXNFcnJvciwgc2V0SGFzRXJyb3JdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgc2V0SGFzRXJyb3IoZmFsc2UpO1xyXG4gIH0sIFtpbWFnZVVybF0pO1xyXG5cclxuICBpZiAoIWltYWdlVXJsKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZmFsbGJhY2tTdHlsZX0+Tm8gaW1hZ2U8L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoaGFzRXJyb3IpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NlbGxTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17ZmFsbGJhY2tTdHlsZX0+SW52YWxpZDwvZGl2PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3RleHRTdHlsZX0+XHJcbiAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBcIiMwZjE3MmFcIiB9fT5JbWFnZSBVUkw8L3NwYW4+XHJcbiAgICAgICAgICA8YVxyXG4gICAgICAgICAgICBocmVmPXtpbWFnZVVybH1cclxuICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcclxuICAgICAgICAgICAgcmVsPVwibm9yZWZlcnJlclwiXHJcbiAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiIzI1NjNlYlwiLFxyXG4gICAgICAgICAgICAgIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIE9wZW4gbGlua1xyXG4gICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17Y2VsbFN0eWxlfT5cclxuICAgICAgPGltZ1xyXG4gICAgICAgIHNyYz17aW1hZ2VVcmx9XHJcbiAgICAgICAgYWx0PVwiUHJvZHVjdFwiXHJcbiAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9XHJcbiAgICAgICAgb25FcnJvcj17KCkgPT4gc2V0SGFzRXJyb3IodHJ1ZSl9XHJcbiAgICAgIC8+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3RleHRTdHlsZX0+XHJcbiAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogNjAwLCBjb2xvcjogXCIjMGYxNzJhXCIgfX0+UHJldmlldzwvc3Bhbj5cclxuICAgICAgICA8YVxyXG4gICAgICAgICAgaHJlZj17aW1hZ2VVcmx9XHJcbiAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgcmVsPVwibm9yZWZlcnJlclwiXHJcbiAgICAgICAgICBzdHlsZT17eyBjb2xvcjogXCIjMjU2M2ViXCIsIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIiwgZm9udFNpemU6IFwiMTJweFwiIH19XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgT3BlbiBpbWFnZVxyXG4gICAgICAgIDwvYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdEltYWdlO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3Qgd3JhcHBlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IHByZXZpZXdTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxNDBweFwiLFxyXG4gIGhlaWdodDogXCI5NnB4XCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IGhpbnRTdHlsZSA9IHtcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgY29sb3I6IFwiIzY0NzQ4YlwiLFxyXG59O1xyXG5cclxuY29uc3QgUHJvZHVjdEltYWdlVXBsb2FkID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgeyBvbkNoYW5nZSwgcmVjb3JkIH0gPSBwcm9wcztcclxuICBjb25zdCBjdXJyZW50VmFsdWUgPSByZWNvcmQ/LnBhcmFtcz8uaW1hZ2VVcmwgfHwgXCJcIjtcclxuICBjb25zdCBjdXJyZW50UHVibGljSWQgPSByZWNvcmQ/LnBhcmFtcz8uaW1hZ2VQdWJsaWNJZCB8fCBcIlwiO1xyXG4gIGNvbnN0IFtwcmV2aWV3VXJsLCBzZXRQcmV2aWV3VXJsXSA9IHVzZVN0YXRlKGN1cnJlbnRWYWx1ZSk7XHJcbiAgY29uc3QgW3B1YmxpY0lkLCBzZXRQdWJsaWNJZF0gPSB1c2VTdGF0ZShjdXJyZW50UHVibGljSWQpO1xyXG4gIGNvbnN0IFt1cGxvYWRpbmcsIHNldFVwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIHNldFByZXZpZXdVcmwoY3VycmVudFZhbHVlKTtcclxuICAgIHNldFB1YmxpY0lkKGN1cnJlbnRQdWJsaWNJZCk7XHJcbiAgfSwgW2N1cnJlbnRWYWx1ZSwgY3VycmVudFB1YmxpY0lkXSk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZVVwbG9hZCA9IGFzeW5jIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdO1xyXG5cclxuICAgIGlmICghZmlsZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VXBsb2FkaW5nKHRydWUpO1xyXG4gICAgc2V0RXJyb3IoXCJcIik7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgZm9ybURhdGEuYXBwZW5kKFwiaW1hZ2VcIiwgZmlsZSk7XHJcblxyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL2FwaS91cGxvYWRzL2ltYWdlXCIsIHtcclxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBheWxvYWQubWVzc2FnZSB8fCBcIkltYWdlIHVwbG9hZCBmYWlsZWRcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHVwbG9hZGVkVXJsID0gcGF5bG9hZC51cmwgfHwgXCJcIjtcclxuICAgICAgY29uc3QgdXBsb2FkZWRQdWJsaWNJZCA9IHBheWxvYWQucHVibGljSWQgfHwgXCJcIjtcclxuICAgICAgc2V0UHJldmlld1VybCh1cGxvYWRlZFVybCk7XHJcbiAgICAgIHNldFB1YmxpY0lkKHVwbG9hZGVkUHVibGljSWQpO1xyXG4gICAgICBvbkNoYW5nZT8uKFwiaW1hZ2VVcmxcIiwgdXBsb2FkZWRVcmwpO1xyXG4gICAgICBvbkNoYW5nZT8uKFwiaW1hZ2VQdWJsaWNJZFwiLCB1cGxvYWRlZFB1YmxpY0lkKTtcclxuICAgICAgb25DaGFuZ2U/LihcInVwbG9hZEltYWdlXCIsIHVwbG9hZGVkVXJsKTtcclxuICAgIH0gY2F0Y2ggKHVwbG9hZEVycm9yKSB7XHJcbiAgICAgIHNldEVycm9yKHVwbG9hZEVycm9yLm1lc3NhZ2UpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0VXBsb2FkaW5nKGZhbHNlKTtcclxuICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gXCJcIjtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBoYW5kbGVSZW1vdmUgPSAoKSA9PiB7XHJcbiAgICBzZXRQcmV2aWV3VXJsKFwiXCIpO1xyXG4gICAgc2V0UHVibGljSWQoXCJcIik7XHJcbiAgICBvbkNoYW5nZT8uKFwiaW1hZ2VVcmxcIiwgXCJcIik7XHJcbiAgICBvbkNoYW5nZT8uKFwiaW1hZ2VQdWJsaWNJZFwiLCBcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJ1cGxvYWRJbWFnZVwiLCBcIlwiKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17d3JhcHBlclN0eWxlfT5cclxuICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgYWNjZXB0PVwiaW1hZ2UvKlwiIG9uQ2hhbmdlPXtoYW5kbGVVcGxvYWR9IC8+XHJcbiAgICAgIDxkaXYgc3R5bGU9e2hpbnRTdHlsZX0+XHJcbiAgICAgICAge3VwbG9hZGluZ1xyXG4gICAgICAgICAgPyBcIlVwbG9hZGluZyB0byBDbG91ZGluYXJ5Li4uXCJcclxuICAgICAgICAgIDogXCJDaG9vc2UgYW4gaW1hZ2UgZmlsZSB0byB1cGxvYWRcIn1cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICB7cHJldmlld1VybCA/IChcclxuICAgICAgICA8PlxyXG4gICAgICAgICAgPGltZyBzcmM9e3ByZXZpZXdVcmx9IGFsdD1cIlByb2R1Y3QgcHJldmlld1wiIHN0eWxlPXtwcmV2aWV3U3R5bGV9IC8+XHJcbiAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVSZW1vdmV9XHJcbiAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICAgICAgICAgICAgICBwYWRkaW5nOiBcIjZweCAxMHB4XCIsXHJcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjhweFwiLFxyXG4gICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgI2VmNDQ0NFwiLFxyXG4gICAgICAgICAgICAgIGNvbG9yOiBcIiNlZjQ0NDRcIixcclxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcIiNmZmZcIixcclxuICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBSZW1vdmUgaW1hZ2VcclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvPlxyXG4gICAgICApIDogbnVsbH1cclxuXHJcbiAgICAgIHtlcnJvciA/IChcclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IC4uLmhpbnRTdHlsZSwgY29sb3I6IFwiI2RjMjYyNlwiIH19PntlcnJvcn08L2Rpdj5cclxuICAgICAgKSA6IG51bGx9XHJcblxyXG4gICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJpbWFnZVVybFwiIHZhbHVlPXtwcmV2aWV3VXJsfSByZWFkT25seSAvPlxyXG4gICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJpbWFnZVB1YmxpY0lkXCIgdmFsdWU9e3B1YmxpY0lkfSByZWFkT25seSAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RJbWFnZVVwbG9hZDtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IENhdGVnb3J5U2hvdyA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnN0IHsgcmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW2NhdGVnb3J5LCBzZXRDYXRlZ29yeV0gPSB1c2VTdGF0ZShudWxsKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChyZWNvcmQgJiYgcmVjb3JkLnBhcmFtcykge1xyXG4gICAgICBzZXRDYXRlZ29yeShyZWNvcmQucGFyYW1zKTtcclxuICAgIH1cclxuICB9LCBbcmVjb3JkXSk7XHJcblxyXG4gIGlmICghY2F0ZWdvcnkpIHtcclxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctbG9hZGluZ1wiPkxvYWRpbmcuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBjb25zdCBmb3JtYXREYXRlID0gKGRhdGUpID0+IHtcclxuICAgIGlmICghZGF0ZSkgcmV0dXJuIFwi4oCUXCI7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gbmV3IERhdGUoZGF0ZSkudG9Mb2NhbGVEYXRlU3RyaW5nKFwiZW4tVVNcIiwge1xyXG4gICAgICAgIHllYXI6IFwibnVtZXJpY1wiLFxyXG4gICAgICAgIG1vbnRoOiBcImxvbmdcIixcclxuICAgICAgICBkYXk6IFwibnVtZXJpY1wiLFxyXG4gICAgICAgIGhvdXI6IFwiMi1kaWdpdFwiLFxyXG4gICAgICAgIG1pbnV0ZTogXCIyLWRpZ2l0XCIsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIHJldHVybiBcIuKAlFwiO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctY29udGFpbmVyXCI+XHJcbiAgICAgIDxzdHlsZT57YFxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAtLWJnLTE6IHZhcigtLWNoYW5nZTgtYmctMSwgIzA1MDkxNCk7XHJcbiAgICAgICAgICAtLWdvbGQ6IHZhcigtLWNoYW5nZTgtZ29sZCwgI2UyYmY2Nik7XHJcbiAgICAgICAgICAtLXRleHQtbWFpbjogdmFyKC0tY2hhbmdlOC10ZXh0LW1haW4sICNmOGZhZmMpO1xyXG4gICAgICAgICAgLS10ZXh0LW11dGVkOiB2YXIoLS1jaGFuZ2U4LXRleHQtbXV0ZWQsICM5YWE4YzEpO1xyXG4gICAgICAgICAgLS1saW5lOiB2YXIoLS1jaGFuZ2U4LWxpbmUsIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4yMikpO1xyXG4gICAgICAgICAgLS1jYXJkLWJnOiB2YXIoLS1jaGFuZ2U4LWNhcmQtYmcsIGxpbmVhci1ncmFkaWVudCgxNjBkZWcsIHJnYmEoMjEsIDM0LCA2NiwgMC45NikgMCUsIHJnYmEoMTAsIDE4LCAzNiwgMC45NikgMTAwJSkpO1xyXG4gICAgICAgICAgLS1zaGFkb3c6IHZhcigtLWNoYW5nZTgtc2hhZG93LCAwIDhweCAyNnB4IHJnYmEoMCwgMCwgMCwgMC4zKSk7XHJcblxyXG4gICAgICAgICAgcGFkZGluZzogMzJweDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW1haW4pO1xyXG4gICAgICAgICAgZm9udC1mYW1pbHk6IFwiUG9wcGluc1wiLCBcIlNlZ29lIFVJXCIsIHNhbnMtc2VyaWY7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTIwZGVnLCB2YXIoLS1iZy0xKSAwJSwgcmdiYSgxMSwgMjYsIDU2LCAwLjgpIDUwJSwgdmFyKC0tYmctMSkgMTAwJSk7XHJcbiAgICAgICAgICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT0nbGlnaHQnXSAuY2F0ZWdvcnktc2hvdy1jb250YWluZXIge1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWJnLTE6ICNmMGY2ZmY7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtZ29sZDogI2MwOGIwZjtcclxuICAgICAgICAgIC0tY2hhbmdlOC10ZXh0LW1haW46ICMwZjE3MmE7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtdGV4dC1tdXRlZDogIzQ3NTU2OTtcclxuICAgICAgICAgIC0tY2hhbmdlOC1saW5lOiByZ2JhKDE1LCAyMywgNDIsIDAuMDgpO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWNhcmQtYmc6ICNmZmZmZmY7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtc2hhZG93OiAwIDRweCAyMHB4IHJnYmEoMTUsIDIzLCA0MiwgMC4wNik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1pbm5lciB7XHJcbiAgICAgICAgICBtYXgtd2lkdGg6IDkwMHB4O1xyXG4gICAgICAgICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1oZWFkZXIge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMzJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWtpY2tlciB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLWdvbGQpO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjM2ZW07XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxMnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctdGl0bGUge1xyXG4gICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgzMnB4LCA1dncsIDQ4cHgpO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjE7XHJcbiAgICAgICAgICBtYXJnaW46IDAgMCA4cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1zdGF0dXMge1xyXG4gICAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgZ2FwOiA4cHg7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAxMnB4O1xyXG4gICAgICAgICAgcGFkZGluZzogNnB4IDEycHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xMmVtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctc3RhdHVzLmFjdGl2ZSB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDM0LCAxOTcsIDk0LCAwLjIpO1xyXG4gICAgICAgICAgY29sb3I6ICMyMmM1NWU7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDM0LCAxOTcsIDk0LCAwLjQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctc3RhdHVzLmluYWN0aXZlIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjM5LCA2OCwgNjgsIDAuMik7XHJcbiAgICAgICAgICBjb2xvcjogI2VmNDQ0NDtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjM5LCA2OCwgNjgsIDAuNCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1jYXJkIHtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxpbmUpO1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMjRweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDMycHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jYXJkLWJnKTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IHZhcigtLXNoYWRvdyk7XHJcbiAgICAgICAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoNHB4KTtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDI0cHg7XHJcbiAgICAgICAgICBhbmltYXRpb246IGZhZGUtdXAgNTYwbXMgZWFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXNlY3Rpb24tdGl0bGUge1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xOGVtO1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLWdvbGQpO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1zZWN0aW9uIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDI4cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1zZWN0aW9uOmxhc3QtY2hpbGQge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWZpZWxkIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1maWVsZDpsYXN0LWNoaWxkIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1sYWJlbCB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjE4ZW07XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiA4cHg7XHJcbiAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXZhbHVlIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW1haW4pO1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDEuNjtcclxuICAgICAgICAgIHdvcmQtYnJlYWs6IGJyZWFrLXdvcmQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy12YWx1ZS5nb2xkIHtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1kZXNjcmlwdGlvbiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMik7XHJcbiAgICAgICAgICBib3JkZXItbGVmdDogM3B4IHNvbGlkIHZhcigtLWdvbGQpO1xyXG4gICAgICAgICAgcGFkZGluZzogMTZweCAyMHB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDEuNztcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT0nbGlnaHQnXSAuY2F0ZWdvcnktc2hvdy1kZXNjcmlwdGlvbiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDE1LCAyMywgNDIsIDAuMDUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctZGV0YWlscy1ncmlkIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpdCwgbWlubWF4KDIwMHB4LCAxZnIpKTtcclxuICAgICAgICAgIGdhcDogMjRweDtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDE2cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1kZXRhaWwtaXRlbSB7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxNnB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjEpO1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxpbmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMTUsIDIzLCA0MiwgMC4wMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1kaXZpZGVyIHtcclxuICAgICAgICAgIGhlaWdodDogMXB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDApLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMjgpLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDApKTtcclxuICAgICAgICAgIG1hcmdpbjogMjRweCAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQGtleWZyYW1lcyBmYWRlLXVwIHtcclxuICAgICAgICAgIGZyb20ge1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoOHB4KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRvIHtcclxuICAgICAgICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDcyMHB4KSB7XHJcbiAgICAgICAgICAuY2F0ZWdvcnktc2hvdy1jb250YWluZXIge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAyMHB4IDE2cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNhdGVnb3J5LXNob3ctY2FyZCB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDI0cHggMjBweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2F0ZWdvcnktc2hvdy1kZXRhaWxzLWdyaWQge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIGB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1pbm5lclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1oZWFkZXJcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1raWNrZXJcIj5DYXRlZ29yeSBPdmVydmlldzwvZGl2PlxyXG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctdGl0bGVcIj57Y2F0ZWdvcnkubmFtZSB8fCBcIuKAlFwifTwvaDE+XHJcbiAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17YGNhdGVnb3J5LXNob3ctc3RhdHVzICR7Y2F0ZWdvcnkuaXNBY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJpbmFjdGl2ZVwifWB9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIDxzcGFuPuKXjzwvc3Bhbj5cclxuICAgICAgICAgICAge2NhdGVnb3J5LmlzQWN0aXZlID8gXCJBY3RpdmVcIiA6IFwiSW5hY3RpdmVcIn1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctY2FyZFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXNlY3Rpb25cIj5cclxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctc2VjdGlvbi10aXRsZVwiPkRlc2NyaXB0aW9uPC9oMz5cclxuICAgICAgICAgICAge2NhdGVnb3J5LmRlc2NyaXB0aW9uID8gKFxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kZXNjcmlwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAge2NhdGVnb3J5LmRlc2NyaXB0aW9ufVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctdmFsdWVcIlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tdGV4dC1tdXRlZClcIiB9fVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIE5vIGRlc2NyaXB0aW9uIHByb3ZpZGVkXHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGl2aWRlclwiIC8+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXNlY3Rpb25cIj5cclxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctc2VjdGlvbi10aXRsZVwiPkRldGFpbHM8L2gzPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRldGFpbHMtZ3JpZFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kZXRhaWwtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctbGFiZWxcIj5DYXRlZ29yeSBJRDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctdmFsdWUgZ29sZFwiXHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwibW9ub3NwYWNlXCIsIGZvbnRTaXplOiBcIjE0cHhcIiB9fVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICB7Y2F0ZWdvcnkuaWQgfHwgXCLigJRcIn1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGV0YWlsLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWxhYmVsXCI+U2x1ZzwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctdmFsdWVcIj5cclxuICAgICAgICAgICAgICAgICAge2NhdGVnb3J5LnNsdWcgfHwgXCLigJRcIn1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kaXZpZGVyXCIgLz5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctc2VjdGlvblwiPlxyXG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1zZWN0aW9uLXRpdGxlXCI+VGltZWxpbmU8L2gzPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRldGFpbHMtZ3JpZFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kZXRhaWwtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctbGFiZWxcIj5DcmVhdGVkPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy12YWx1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShjYXRlZ29yeS5jcmVhdGVkQXQpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kZXRhaWwtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctbGFiZWxcIj5MYXN0IFVwZGF0ZWQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXZhbHVlXCI+XHJcbiAgICAgICAgICAgICAgICAgIHtmb3JtYXREYXRlKGNhdGVnb3J5LnVwZGF0ZWRBdCl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2F0ZWdvcnlTaG93O1xyXG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi4vYWRtaW4vZGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmRcbmltcG9ydCBSZWdpc3RlciBmcm9tICcuLi9hZG1pbi9yZWdpc3RlcidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUmVnaXN0ZXIgPSBSZWdpc3RlclxuaW1wb3J0IFByb2R1Y3RDYXJkc0xpc3QgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1jYXJkcy1saXN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0Q2FyZHNMaXN0ID0gUHJvZHVjdENhcmRzTGlzdFxuaW1wb3J0IFByb2R1Y3RTaG93IGZyb20gJy4uL2FkbWluL3Byb2R1Y3Qtc2hvdydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdFNob3cgPSBQcm9kdWN0U2hvd1xuaW1wb3J0IE9yZGVyQ3JlYXRlIGZyb20gJy4uL2FkbWluL29yZGVyLWNyZWF0ZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuT3JkZXJDcmVhdGUgPSBPcmRlckNyZWF0ZVxuaW1wb3J0IE9yZGVyU2hvdyBmcm9tICcuLi9hZG1pbi9vcmRlci1zaG93J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlclNob3cgPSBPcmRlclNob3dcbmltcG9ydCBPcmRlckl0ZW1TaG93IGZyb20gJy4uL2FkbWluL29yZGVyLWl0ZW0tc2hvdydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuT3JkZXJJdGVtU2hvdyA9IE9yZGVySXRlbVNob3dcbmltcG9ydCBQcm9kdWN0SW1hZ2UgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1pbWFnZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdEltYWdlID0gUHJvZHVjdEltYWdlXG5pbXBvcnQgUHJvZHVjdEltYWdlVXBsb2FkIGZyb20gJy4uL2FkbWluL3Byb2R1Y3QtaW1hZ2UtdXBsb2FkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0SW1hZ2VVcGxvYWQgPSBQcm9kdWN0SW1hZ2VVcGxvYWRcbmltcG9ydCBDYXRlZ29yeVNob3cgZnJvbSAnLi4vYWRtaW4vY2F0ZWdvcnktc2hvdydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ2F0ZWdvcnlTaG93ID0gQ2F0ZWdvcnlTaG93Il0sIm5hbWVzIjpbImZvcm1hdEN1cnJlbmN5IiwidmFsdWUiLCJOdW1iZXIiLCJ0b0xvY2FsZVN0cmluZyIsIkRhc2hib2FyZCIsImRhdGEiLCJzZXREYXRhIiwidXNlU3RhdGUiLCJ1c2VycyIsImNhdGVnb3JpZXMiLCJwcm9kdWN0cyIsIm9yZGVycyIsInJldmVudWUiLCJmZWF0dXJlZEdlbXMiLCJjcml0aWNhbFN0b2NrIiwicmVjZW50UHJvZHVjdHMiLCJjYXRlZ29yeURpc3RyaWJ1dGlvbiIsInVzZUVmZmVjdCIsImxvYWREYXNoYm9hcmQiLCJyZXNwb25zZSIsImZldGNoIiwicGF5bG9hZCIsImpzb24iLCJ0b3BDYXRlZ29yaWVzIiwidXNlTWVtbyIsImRpc3RyaWJ1dGlvbiIsIm1heCIsIk1hdGgiLCJtYXAiLCJpdGVtIiwiY291bnQiLCJ3aWR0aCIsInJvdW5kIiwiY29tcGxldGlvblJhdGUiLCJ0b3RhbCIsImhlYWx0aHkiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJzdHlsZSIsImxlbmd0aCIsImNhdGVnb3J5Iiwia2V5IiwibmFtZSIsIm1hcmdpblRvcCIsInByb2R1Y3QiLCJpZCIsIkRhdGUiLCJjcmVhdGVkQXQiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJwcmljZSIsImRpc3BsYXkiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwiZ2FwIiwiY29sb3IiLCJSZWdpc3RlciIsImZvcm1TdGF0ZSIsInNldEZvcm1TdGF0ZSIsImVtYWlsIiwicGFzc3dvcmQiLCJtZXNzYWdlIiwic2V0TWVzc2FnZSIsInR5cGUiLCJ0ZXh0IiwiaXNTdWJtaXR0aW5nIiwic2V0SXNTdWJtaXR0aW5nIiwiZG9jdW1lbnQiLCJib2R5IiwibWFyZ2luIiwiaGFuZGxlQ2hhbmdlIiwiZXZlbnQiLCJjdXJyZW50IiwidGFyZ2V0IiwiaGFuZGxlU3VibWl0IiwicHJldmVudERlZmF1bHQiLCJtZXRob2QiLCJoZWFkZXJzIiwiSlNPTiIsInN0cmluZ2lmeSIsIm9rIiwiRXJyb3IiLCJzZXRUaW1lb3V0Iiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiZXJyb3IiLCJvblN1Ym1pdCIsImh0bWxGb3IiLCJwbGFjZWhvbGRlciIsIm9uQ2hhbmdlIiwicmVxdWlyZWQiLCJtaW5MZW5ndGgiLCJkaXNhYmxlZCIsImdyaWRTdHlsZSIsImNhcmRTdHlsZSIsImJvcmRlclJhZGl1cyIsImJvcmRlciIsImJhY2tncm91bmQiLCJvdmVyZmxvdyIsImJveFNoYWRvdyIsImltYWdlV3JhcFN0eWxlIiwiaGVpZ2h0IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwicGFkZGluZyIsImltYWdlU3R5bGUiLCJvYmplY3RGaXQiLCJib2R5U3R5bGUiLCJtZXRhU3R5bGUiLCJmb250U2l6ZSIsImJhZGdlU3R5bGUiLCJpc0FjdGl2ZSIsImZvbnRXZWlnaHQiLCJsZXR0ZXJTcGFjaW5nIiwibGlua1N0eWxlIiwidGV4dERlY29yYXRpb24iLCJjdXJzb3IiLCJlbXB0eVN0eWxlIiwiZm9ybWF0UHJpY2UiLCJhbW91bnQiLCJpc0Zpbml0ZSIsInVuZGVmaW5lZCIsIm1pbmltdW1GcmFjdGlvbkRpZ2l0cyIsIm1heGltdW1GcmFjdGlvbkRpZ2l0cyIsImdldFJlY29yZElkIiwicmVjb3JkIiwicGFyYW1zIiwicGFyYW0iLCJnZXRTaG93SHJlZiIsInJlc291cmNlSWQiLCJyZWNvcmRBY3Rpb25zIiwiYWN0aW9ucyIsInNob3dBY3Rpb24iLCJmaW5kIiwiYWN0aW9uIiwicmF3SHJlZiIsImVuY29kZVVSSUNvbXBvbmVudCIsIlByb2R1Y3RDYXJkc0xpc3QiLCJwcm9wcyIsImFwaVJlY29yZHMiLCJzZXRBcGlSZWNvcmRzIiwibG9hZGluZyIsInNldExvYWRpbmciLCJsb2FkRXJyb3IiLCJzZXRMb2FkRXJyb3IiLCJyZXNvdXJjZSIsInByb3BSZWNvcmRzIiwicmVjb3JkcyIsImlzTW91bnRlZCIsImxvYWRSZWNvcmRzIiwiY3JlZGVudGlhbHMiLCJjYXRlZ29yeUlkIiwiaW1hZ2VVcmwiLCJzdG9jayIsIkJvb2xlYW4iLCJkZXRhaWxzSHJlZiIsIm9wZW5EZXRhaWxzIiwiYXNzaWduIiwic3JjIiwiYWx0Iiwib25DbGljayIsInBhZ2VTdHlsZSIsImhlcm9TdHlsZSIsInBhbmVsU3R5bGUiLCJtaW5IZWlnaHQiLCJoZXJvQm9keVN0eWxlIiwidGl0bGVTdHlsZSIsImxpbmVIZWlnaHQiLCJzdWJ0aXRsZVN0eWxlIiwiYWN0aXZlIiwic3RhdHNHcmlkU3R5bGUiLCJzdGF0Q2FyZFN0eWxlIiwic3RhdExhYmVsU3R5bGUiLCJ0ZXh0VHJhbnNmb3JtIiwibWFyZ2luQm90dG9tIiwic3RhdFZhbHVlU3R5bGUiLCJ3b3JkQnJlYWsiLCJzZWN0aW9uR3JpZFN0eWxlIiwic2VjdGlvblRpdGxlU3R5bGUiLCJjb250ZW50Q2FyZFN0eWxlIiwiaW5mb0xpc3RTdHlsZSIsImluZm9Sb3dTdHlsZSIsInBhZGRpbmdCb3R0b20iLCJib3JkZXJCb3R0b20iLCJpbmZvTGFiZWxTdHlsZSIsImluZm9WYWx1ZVN0eWxlIiwidGV4dEFsaWduIiwiZGVzY3JpcHRpb25TdHlsZSIsIndoaXRlU3BhY2UiLCJidXR0b25TdHlsZSIsInRyYW5zaXRpb24iLCJidXR0b25Ib3ZlclN0eWxlIiwidHJhbnNmb3JtIiwiZm9ybWF0RGF0ZSIsImRhdGUiLCJpc05hTiIsImdldFRpbWUiLCJTdHJpbmciLCJkYXRlU3R5bGUiLCJ0aW1lU3R5bGUiLCJQcm9kdWN0U2hvdyIsInNrdSIsImRlc2NyaXB0aW9uIiwiYnV0dG9uSG92ZXJlZCIsInNldEJ1dHRvbkhvdmVyZWQiLCJoYW5kbGVPcmRlckNsaWNrIiwicHJvZHVjdElkIiwibmV3T3JkZXJVcmwiLCJvbk1vdXNlRW50ZXIiLCJvbk1vdXNlTGVhdmUiLCJ0aXRsZSIsInhtbG5zIiwidmlld0JveCIsImZpbGwiLCJzdHJva2UiLCJzdHJva2VXaWR0aCIsInN0cm9rZUxpbmVjYXAiLCJzdHJva2VMaW5lam9pbiIsImN4IiwiY3kiLCJyIiwiZCIsInVwZGF0ZWRBdCIsImhlYWRlclN0eWxlIiwiZGVzY1N0eWxlIiwibGF5b3V0U3R5bGUiLCJzdGFja1N0eWxlIiwibGFiZWxTdHlsZSIsImlucHV0U3R5bGUiLCJtaW5XaWR0aCIsImJveFNpemluZyIsImZvbnRGYW1pbHkiLCJyb3dTdHlsZSIsImdyaWQyU3R5bGUiLCJjdXN0b21lckluZm9TdHlsZSIsImN1c3RvbWVyUm93U3R5bGUiLCJtdXRlZFN0eWxlIiwic3Ryb25nU3R5bGUiLCJsaW5lSXRlbVJvd1N0eWxlIiwibGluZUl0ZW1Ub3BTdHlsZSIsInByb2R1Y3RQcmV2aWV3U3R5bGUiLCJhZGRCdXR0b25TdHlsZSIsInJlbW92ZUJ1dHRvblN0eWxlIiwidG90YWxzUm93U3R5bGUiLCJ0b3RhbFN0eWxlIiwicGFkZGluZ1RvcCIsImFjdGlvbkJhclN0eWxlIiwiYWN0aW9uQnV0dG9uU3R5bGUiLCJwcmltYXJ5IiwibWFwTGlua1N0eWxlIiwicGF5bWVudE9wdGlvbkdyaWRTdHlsZSIsInBheW1lbnRPcHRpb25TdHlsZSIsInNlY3VyaXR5Q2hpcFdyYXBTdHlsZSIsInNlY3VyaXR5Q2hpcFN0eWxlIiwicmVzcG9uc2l2ZUNzcyIsInBheW1lbnRPcHRpb25zIiwibGFiZWwiLCJpY29uIiwiaXRlbVNpemVPcHRpb25zIiwic2hpcHBpbmdNZXRob2RzIiwidG9OdW1iZXIiLCJudW0iLCJmb3JtYXRNb25leSIsImNyZWF0ZUVtcHR5SXRlbSIsInNpemUiLCJxdWFudGl0eSIsInVuaXRQcmljZSIsIk9yZGVyQ3JlYXRlIiwic2V0VXNlcnMiLCJzZXRQcm9kdWN0cyIsIm9yZGVyQ291bnRCeVVzZXIiLCJzZXRPcmRlckNvdW50QnlVc2VyIiwic2Vzc2lvblVzZXIiLCJzZXRTZXNzaW9uVXNlciIsInN1Ym1pdHRpbmciLCJzZXRTdWJtaXR0aW5nIiwiZm9ybURhdGEiLCJzZXRGb3JtRGF0YSIsInVzZXJJZCIsInN0YXR1cyIsInBheW1lbnRNZXRob2QiLCJwYXltZW50U3RhdHVzIiwidHJhbnNhY3Rpb25JZCIsInNoaXBwaW5nTmFtZSIsInNoaXBwaW5nUGhvbmUiLCJzaGlwcGluZ0FkZHJlc3MiLCJzaGlwcGluZ01ldGhvZCIsInRyYWNraW5nTnVtYmVyIiwic2hpcHBpbmdGZWUiLCJ0YXgiLCJkaXNjb3VudCIsImxpbmVJdGVtcyIsInNldExpbmVJdGVtcyIsIlVSTFNlYXJjaFBhcmFtcyIsInNlYXJjaCIsInByZVByb2R1Y3RJZCIsImdldCIsImZldGNoRGF0YSIsImNvbnRleHRSZXMiLCJjb250ZXh0RGF0YSIsInVzZXJzRGF0YSIsIkFycmF5IiwiaXNBcnJheSIsInByb2R1Y3RzTGlzdCIsImN1cnJlbnRVc2VyIiwicHJldiIsInNlbGVjdGVkUHJvZHVjdCIsInNvbWUiLCJwIiwic2VsZWN0ZWQiLCJzZWxlY3RlZEN1c3RvbWVyIiwidSIsImN1c3RvbWVyT3JkZXJDb3VudCIsInBob25lIiwibW9iaWxlIiwibGluZVRvdGFscyIsInN1YnRvdGFsIiwicmVkdWNlIiwic3VtIiwiZ3JhbmRUb3RhbCIsImhhbmRsZUZvcm1DaGFuZ2UiLCJoYW5kbGVMaW5lSXRlbUNoYW5nZSIsImluZGV4IiwibmV4dCIsImFkZExpbmVJdGVtIiwicmVtb3ZlTGluZUl0ZW0iLCJmaWx0ZXIiLCJfIiwiaSIsIm1hcHNIcmVmIiwidHJpbSIsInZhbGlkSXRlbXMiLCJhbGVydCIsIm9yZGVyUGF5bG9hZCIsInRvRml4ZWQiLCJ0b3RhbEFtb3VudCIsInN1Ym1pdEZvcm0iLCJGb3JtRGF0YSIsImFwcGVuZCIsIm9yZGVyUmVzIiwib3JkZXJEYXRhIiwicm9sZSIsInVzZXIiLCJvcHRpb24iLCJyZWFkT25seSIsIml0ZW1Ub3RhbCIsInNpemVPcHRpb24iLCJtaW4iLCJzdGVwIiwicmVzaXplIiwicmVsIiwiaGlzdG9yeSIsImJhY2siLCJoZWFkaW5nU3R5bGUiLCJzdWJUZXh0U3R5bGUiLCJ2YWwiLCJ0b0xvd2VyQ2FzZSIsInN0eWxlQnlTdGF0dXMiLCJwZW5kaW5nIiwiYmciLCJmZyIsInBhaWQiLCJwcm9jZXNzaW5nIiwic2hpcHBlZCIsImNvbXBsZXRlZCIsImNhbmNlbGxlZCIsImluZm9HcmlkU3R5bGUiLCJ0YWJsZVN0eWxlIiwibGluZUl0ZW1TdHlsZSIsInRvdGFsQm94U3R5bGUiLCJ0b3RhbFJvd1N0eWxlIiwiZ3JhbmRTdHlsZSIsIm4iLCJkdCIsIk9yZGVyU2hvdyIsImRldGFpbHMiLCJzZXREZXRhaWxzIiwic2V0RXJyb3IiLCJvcmRlcklkIiwibG9hZERldGFpbHMiLCJmZXRjaEVycm9yIiwidG90YWxzIiwiaXRlbXMiLCJ0b3RhbFByaWNlIiwiZW1wdHlJbWFnZVN0eWxlIiwiT3JkZXJJdGVtU2hvdyIsIm9yZGVySXRlbUlkIiwiY2FsY3VsYXRlZFRvdGFsIiwib3JkZXIiLCJjdXN0b21lciIsImNlbGxTdHlsZSIsImZsZXhTaHJpbmsiLCJmYWxsYmFja1N0eWxlIiwidGV4dFN0eWxlIiwiZmxleERpcmVjdGlvbiIsIlByb2R1Y3RJbWFnZSIsInByb3BlcnR5IiwicGF0aCIsImhhc0Vycm9yIiwic2V0SGFzRXJyb3IiLCJvbkVycm9yIiwid3JhcHBlclN0eWxlIiwicHJldmlld1N0eWxlIiwiaGludFN0eWxlIiwiUHJvZHVjdEltYWdlVXBsb2FkIiwiY3VycmVudFZhbHVlIiwiY3VycmVudFB1YmxpY0lkIiwiaW1hZ2VQdWJsaWNJZCIsInByZXZpZXdVcmwiLCJzZXRQcmV2aWV3VXJsIiwicHVibGljSWQiLCJzZXRQdWJsaWNJZCIsInVwbG9hZGluZyIsInNldFVwbG9hZGluZyIsImhhbmRsZVVwbG9hZCIsImZpbGUiLCJmaWxlcyIsInVwbG9hZGVkVXJsIiwidXJsIiwidXBsb2FkZWRQdWJsaWNJZCIsInVwbG9hZEVycm9yIiwiaGFuZGxlUmVtb3ZlIiwiYWNjZXB0IiwiRnJhZ21lbnQiLCJDYXRlZ29yeVNob3ciLCJzZXRDYXRlZ29yeSIsInllYXIiLCJtb250aCIsImRheSIsImhvdXIiLCJtaW51dGUiLCJzbHVnIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBRUEsTUFBTUEsZ0JBQWMsR0FBSUMsS0FBSyxJQUFLO0lBQ2hDLE9BQU8sQ0FBQSxHQUFBLEVBQU1DLE1BQU0sQ0FBQ0QsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDRSxjQUFjLEVBQUUsQ0FBQSxDQUFFO0VBQ3BELENBQUM7RUFFRCxNQUFNQyxTQUFTLEdBQUdBLE1BQU07RUFDdEIsRUFBQSxNQUFNLENBQUNDLElBQUksRUFBRUMsT0FBTyxDQUFDLEdBQUdDLGNBQVEsQ0FBQztFQUMvQkMsSUFBQUEsS0FBSyxFQUFFLENBQUM7RUFDUkMsSUFBQUEsVUFBVSxFQUFFLENBQUM7RUFDYkMsSUFBQUEsUUFBUSxFQUFFLENBQUM7RUFDWEMsSUFBQUEs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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1B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
