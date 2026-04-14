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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9hZG1pbi9kYXNoYm9hcmQuanN4IiwiLi4vYWRtaW4vcmVnaXN0ZXIuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1jYXJkcy1saXN0LmpzeCIsIi4uL2FkbWluL3Byb2R1Y3Qtc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1jcmVhdGUuanN4IiwiLi4vYWRtaW4vb3JkZXItc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1pdGVtLXNob3cuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS5qc3giLCIuLi9hZG1pbi9wcm9kdWN0LWltYWdlLXVwbG9hZC5qc3giLCIuLi9hZG1pbi9jYXRlZ29yeS1zaG93LmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBmb3JtYXRDdXJyZW5jeSA9ICh2YWx1ZSkgPT4ge1xyXG4gIHJldHVybiBgUnMuJHtOdW1iZXIodmFsdWUgfHwgMCkudG9Mb2NhbGVTdHJpbmcoKX1gO1xyXG59O1xyXG5cclxuY29uc3QgRGFzaGJvYXJkID0gKCkgPT4ge1xyXG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKHtcclxuICAgIHVzZXJzOiAwLFxyXG4gICAgY2F0ZWdvcmllczogMCxcclxuICAgIHByb2R1Y3RzOiAwLFxyXG4gICAgb3JkZXJzOiAwLFxyXG4gICAgcmV2ZW51ZTogMCxcclxuICAgIGZlYXR1cmVkR2VtczogMCxcclxuICAgIGNyaXRpY2FsU3RvY2s6IDAsXHJcbiAgICByZWNlbnRQcm9kdWN0czogW10sXHJcbiAgICBjYXRlZ29yeURpc3RyaWJ1dGlvbjogW10sXHJcbiAgfSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBsb2FkRGFzaGJvYXJkID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL2FkbWluL2FwaS9kYXNoYm9hcmRcIik7XHJcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIHNldERhdGEocGF5bG9hZCB8fCB7fSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWREYXNoYm9hcmQoKTtcclxuICB9LCBbXSk7XHJcblxyXG4gIGNvbnN0IHRvcENhdGVnb3JpZXMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IGRhdGEuY2F0ZWdvcnlEaXN0cmlidXRpb24gfHwgW107XHJcbiAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi5kaXN0cmlidXRpb24ubWFwKChpdGVtKSA9PiBpdGVtLmNvdW50KSwgMSk7XHJcblxyXG4gICAgcmV0dXJuIGRpc3RyaWJ1dGlvbi5tYXAoKGl0ZW0pID0+ICh7XHJcbiAgICAgIC4uLml0ZW0sXHJcbiAgICAgIHdpZHRoOiBgJHtNYXRoLm1heCg4LCBNYXRoLnJvdW5kKChpdGVtLmNvdW50IC8gbWF4KSAqIDEwMCkpfSVgLFxyXG4gICAgfSkpO1xyXG4gIH0sIFtkYXRhLmNhdGVnb3J5RGlzdHJpYnV0aW9uXSk7XHJcblxyXG4gIGNvbnN0IGNvbXBsZXRpb25SYXRlID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBjb25zdCB0b3RhbCA9IE51bWJlcihkYXRhLnByb2R1Y3RzIHx8IDApO1xyXG4gICAgaWYgKHRvdGFsID09PSAwKSB7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGhlYWx0aHkgPSBNYXRoLm1heCh0b3RhbCAtIE51bWJlcihkYXRhLmNyaXRpY2FsU3RvY2sgfHwgMCksIDApO1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQoKGhlYWx0aHkgLyB0b3RhbCkgKiAxMDApO1xyXG4gIH0sIFtkYXRhLnByb2R1Y3RzLCBkYXRhLmNyaXRpY2FsU3RvY2tdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1kYXNoYm9hcmRcIj5cclxuICAgICAgPHN0eWxlPntgXHJcbiAgICAgICAgLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgIC0tYmctMTogdmFyKC0tY2hhbmdlOC1iZy0xLCAjMDUwOTE0KTtcclxuICAgICAgICAgIC0tYmctMjogdmFyKC0tY2hhbmdlOC1iZy0yLCAjMGIxYTM4KTtcclxuICAgICAgICAgIC0tZ3JhZC1lbmQ6IHZhcigtLWNoYW5nZTgtZ3JhZC1lbmQsICMwNDA3MGYpO1xyXG4gICAgICAgICAgLS1nb2xkOiB2YXIoLS1jaGFuZ2U4LWdvbGQsICNlMmJmNjYpO1xyXG4gICAgICAgICAgLS10ZXh0LW1haW46IHZhcigtLWNoYW5nZTgtdGV4dC1tYWluLCAjZjhmYWZjKTtcclxuICAgICAgICAgIC0tdGV4dC1tdXRlZDogdmFyKC0tY2hhbmdlOC10ZXh0LW11dGVkLCAjOWFhOGMxKTtcclxuICAgICAgICAgIC0tbGluZTogdmFyKC0tY2hhbmdlOC1saW5lLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMjIpKTtcclxuICAgICAgICAgIC0tY2FyZC1iZzogdmFyKC0tY2hhbmdlOC1jYXJkLWJnLCBsaW5lYXItZ3JhZGllbnQoMTYwZGVnLCByZ2JhKDIxLCAzNCwgNjYsIDAuOTYpIDAlLCByZ2JhKDEwLCAxOCwgMzYsIDAuOTYpIDEwMCUpKTtcclxuICAgICAgICAgIC0tc2hhZG93OiB2YXIoLS1jaGFuZ2U4LXNoYWRvdywgMCA4cHggMjZweCByZ2JhKDAsIDAsIDAsIDAuMykpO1xyXG4gICAgICAgICAgLS1yYWRpYWwtMTogdmFyKC0tY2hhbmdlOC1yYWRpYWwtMSwgcmdiYSgzNCwgOTMsIDE4MCwgMC4zNSkpO1xyXG4gICAgICAgICAgLS1yYWRpYWwtMjogdmFyKC0tY2hhbmdlOC1yYWRpYWwtMiwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjE2KSk7XHJcblxyXG4gICAgICAgICAgbWluLWhlaWdodDogMTAwdmg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAzNnB4O1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbWFpbik7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOlxyXG4gICAgICAgICAgICByYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDglIDAlLCB2YXIoLS1yYWRpYWwtMSkgMCUsIHJnYmEoMzQsIDkzLCAxODAsIDApIDM4JSksXHJcbiAgICAgICAgICAgIHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgODUlIDEyJSwgdmFyKC0tcmFkaWFsLTIpIDAlLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDApIDQyJSksXHJcbiAgICAgICAgICAgIGxpbmVhci1ncmFkaWVudCgxMjBkZWcsIHZhcigtLWJnLTEpIDAlLCB2YXIoLS1iZy0yKSA0OCUsIHZhcigtLWdyYWQtZW5kKSAxMDAlKTtcclxuICAgICAgICAgIGZvbnQtZmFtaWx5OiBcIlBvcHBpbnNcIiwgXCJTZWdvZSBVSVwiLCBzYW5zLXNlcmlmO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jaGFuZ2U4LWRhc2hib2FyZCB7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtYmctMTogI2YwZjZmZjtcclxuICAgICAgICAgIC0tY2hhbmdlOC1iZy0yOiAjZmZmZmZmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWdyYWQtZW5kOiAjZjhmYmZmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWdvbGQ6ICNjMDhiMGY7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtdGV4dC1tYWluOiAjMGYxNzJhO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXRleHQtbXV0ZWQ6ICM0NzU1Njk7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtbGluZTogcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgICAgICAgIC0tY2hhbmdlOC1jYXJkLWJnOiAjZmZmZmZmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXNoYWRvdzogMCA0cHggMjBweCByZ2JhKDE1LCAyMywgNDIsIDAuMDYpO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXJhZGlhbC0xOiByZ2JhKDM0LCA5MywgMTgwLCAwLjA4KTtcclxuICAgICAgICAgIC0tY2hhbmdlOC1yYWRpYWwtMjogcmdiYSgxOTIsIDEzOSwgMTUsIDAuMDUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtZGFzaGJvYXJkLWlubmVyIHtcclxuICAgICAgICAgIHdpZHRoOiBtaW4oMTAwJSwgMTQ0MHB4KTtcclxuICAgICAgICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtaGVhZGVyIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XHJcbiAgICAgICAgICBhbmltYXRpb246IGZhZGUtdXAgNTIwbXMgZWFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWtpY2tlciB7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4zNmVtO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC10aXRsZSB7XHJcbiAgICAgICAgICBtYXJnaW46IDhweCAwIDZweDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjA2O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogY2xhbXAoMzJweCwgNXZ3LCA1NnB4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXN1YnRpdGxlIHtcclxuICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LW1ldHJpYy1ncmlkIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCg0LCBtaW5tYXgoMTcwcHgsIDFmcikpO1xyXG4gICAgICAgICAgZ2FwOiAyMnB4O1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMjRweDtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDQ4cHg7XHJcbiAgICAgICAgICBwYWRkaW5nLWJvdHRvbTogMjBweDtcclxuICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMTIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jaGFuZ2U4LW1ldHJpYy1ncmlkIHtcclxuICAgICAgICAgIGJvcmRlci1ib3R0b20tY29sb3I6IHJnYmEoMTUsIDIzLCA0MiwgMC4xKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQge1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAyNHB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMjRweCAyNHB4IDIycHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jYXJkLWJnKTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IHZhcigtLXNoYWRvdyk7XHJcbiAgICAgICAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoNHB4KTtcclxuICAgICAgICAgIGFuaW1hdGlvbjogZmFkZS11cCA1NjBtcyBlYXNlO1xyXG4gICAgICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDE4MG1zIGVhc2UsIGJvcmRlci1jb2xvciAxODBtcyBlYXNlLCBib3gtc2hhZG93IDE4MG1zIGVhc2U7XHJcbiAgICAgICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQ6aG92ZXIge1xyXG4gICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00cHgpO1xyXG4gICAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMzQpO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCAxNnB4IDM0cHggcmdiYSgwLCAwLCAwLCAwLjM0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQtbGFiZWwge1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjE4ZW07XHJcbiAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiA4cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1jYXJkLXZhbHVlIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogY2xhbXAoMjRweCwgMi44dncsIDM4cHgpO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAwLjk1O1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IC0wLjAzZW07XHJcbiAgICAgICAgICBvdmVyZmxvdy13cmFwOiBhbnl3aGVyZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQtaGludCB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAxMnB4O1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDEuNTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcmQtLXN0YWNrZWQge1xyXG4gICAgICAgICAgZ2FwOiAycHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1jYXJkLS1zdGFja2VkIC5jaGFuZ2U4LWNhcmQtaGludCB7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiA2cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1sYXlvdXQge1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcclxuICAgICAgICAgIGdhcDogMjhweDtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDMycHg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogc3RhcnQ7XHJcbiAgICAgICAgICBwYWRkaW5nLXRvcDogMTJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWZ1bGwtd2lkdGgtc2VjdGlvbiB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtY2FyZC0tdGFsbCB7XHJcbiAgICAgICAgICBtaW4taGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgcGFkZGluZy1ib3R0b206IDI0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zZWN0aW9uLWRpdmlkZXIge1xyXG4gICAgICAgICAgaGVpZ2h0OiAxcHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjI2LCAxOTEsIDEwMiwgMCksIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4yOCksIHJnYmEoMjI2LCAxOTEsIDEwMiwgMCkpO1xyXG4gICAgICAgICAgbWFyZ2luOiAyMHB4IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9ncmVzcy13cmFwIHtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDE2cHg7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZ3Jlc3MtaGVhZCB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDZweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2dyZXNzLXRyYWNrIHtcclxuICAgICAgICAgIGhlaWdodDogMTJweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEyKTtcclxuICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNoYW5nZTgtcHJvZ3Jlc3MtdHJhY2sge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNSwgMjMsIDQyLCAwLjEyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2dyZXNzLWZpbGwge1xyXG4gICAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsICNmNWRmOTAgMCUsICNlMmJmNjYgMTAwJSk7XHJcbiAgICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCAzMjBtcyBlYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcmVjZW50LWxpc3Qge1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMTRweDtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBnYXA6IDEwcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1yZWNlbnQtaXRlbSB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGdhcDogMTZweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDE0cHggMDtcclxuICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNoYW5nZTgtcmVjZW50LWl0ZW0ge1xyXG4gICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4xMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1yZWNlbnQtaXRlbTpsYXN0LWNoaWxkIHtcclxuICAgICAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1uYW1lIHtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1kYXRlIHtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByaWNlIHtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQGtleWZyYW1lcyBmYWRlLXVwIHtcclxuICAgICAgICAgIGZyb20ge1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoOHB4KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRvIHtcclxuICAgICAgICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDExODBweCkge1xyXG4gICAgICAgICAgLmNoYW5nZTgtbWV0cmljLWdyaWQge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCBtaW5tYXgoMTgwcHgsIDFmcikpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWxheW91dCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA3MjBweCkge1xyXG4gICAgICAgICAgLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMjBweCAxNnB4IDI4cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbWV0cmljLWdyaWQge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgICAgICAgICAgZ2FwOiAxNnB4O1xyXG4gICAgICAgICAgICBtYXJnaW4tdG9wOiAxOHB4O1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWxheW91dCB7XHJcbiAgICAgICAgICAgIGdhcDogMTZweDtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMThweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMjBweCAxOHB4IDE4cHg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBgfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtZGFzaGJvYXJkLWlubmVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWhlYWRlclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWtpY2tlclwiPlNlY3Rpb24gVmlldzwvZGl2PlxyXG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImNoYW5nZTgtdGl0bGVcIj5EYXNoYm9hcmQ8L2gxPlxyXG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiY2hhbmdlOC1zdWJ0aXRsZVwiPlxyXG4gICAgICAgICAgICBUcmFjayB5b3VyIGNvbW1lcmNlIGhlYWx0aCBhdCBhIGdsYW5jZSB3aXRoIGxpdmUgaW52ZW50b3J5IGFuZCBvcmRlclxyXG4gICAgICAgICAgICBzaWduYWxzLlxyXG4gICAgICAgICAgPC9wPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbWV0cmljLWdyaWRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkIGNoYW5nZTgtY2FyZC0tc3RhY2tlZFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPlJldmVudWUgU3RyZWFtPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+XHJcbiAgICAgICAgICAgICAge2Zvcm1hdEN1cnJlbmN5KGRhdGEucmV2ZW51ZSl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+QWNyb3NzIGFsbCBvcmRlcnM8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkIGNoYW5nZTgtY2FyZC0tc3RhY2tlZFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPkludmVudG9yeSBTaXplPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+e2RhdGEucHJvZHVjdHMgfHwgMH08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPlRvdGFsIGFjdGl2ZSBjYXRhbG9nIGl0ZW1zPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZCBjaGFuZ2U4LWNhcmQtLXN0YWNrZWRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5GZWF0dXJlZCBHZW1zPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+e2RhdGEuZmVhdHVyZWRHZW1zIHx8IDB9PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5DdXJyZW50bHkgdmlzaWJsZSBwcm9kdWN0czwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQgY2hhbmdlOC1jYXJkLS1zdGFja2VkXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+Q3JpdGljYWwgU3RvY2s8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtdmFsdWVcIj57ZGF0YS5jcml0aWNhbFN0b2NrIHx8IDB9PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5JdGVtcyBuZWVkaW5nIHVyZ2VudCByZWZpbGw8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbGF5b3V0XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZCBjaGFuZ2U4LWNhcmQtLXRhbGxcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5DYXRlZ29yeSBEaXN0cmlidXRpb248L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPkludmVudG9yeSBzcGxpdCBieSBzZWdtZW50PC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtc2VjdGlvbi1kaXZpZGVyXCIgLz5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9ncmVzcy13cmFwXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWhlYWRcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuPkhlYWx0aHkgc3RvY2sgbGV2ZWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3Ryb25nPntjb21wbGV0aW9uUmF0ZX0lPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLXRyYWNrXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtZmlsbFwiXHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBgJHtjb21wbGV0aW9uUmF0ZX0lYCB9fVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICB7KHRvcENhdGVnb3JpZXMgfHwgW10pLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+Tm8gY2F0ZWdvcnkgZGF0YSB5ZXQuPC9kaXY+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgKHRvcENhdGVnb3JpZXMgfHwgW10pLm1hcCgoY2F0ZWdvcnkpID0+IChcclxuICAgICAgICAgICAgICAgIDxkaXYga2V5PXtjYXRlZ29yeS5uYW1lfSBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLXdyYXBcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWhlYWRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57Y2F0ZWdvcnkubmFtZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz57Y2F0ZWdvcnkuY291bnR9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtdHJhY2tcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWZpbGxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IGNhdGVnb3J5LndpZHRoIH19XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApKVxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQgY2hhbmdlOC1jYXJkLS10YWxsXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+UmVjZW50IEFkZGl0aW9uczwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+XHJcbiAgICAgICAgICAgICAgTGF0ZXN0IHByb2R1Y3RzIGVudGVyaW5nIHRoZSBjYXRhbG9nXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXNlY3Rpb24tZGl2aWRlclwiIC8+XHJcblxyXG4gICAgICAgICAgICB7KGRhdGEucmVjZW50UHJvZHVjdHMgfHwgW10pLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCIgc3R5bGU9e3sgbWFyZ2luVG9wOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICAgIE5vIHByb2R1Y3RzIGFkZGVkIHlldC5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcmVjZW50LWxpc3RcIj5cclxuICAgICAgICAgICAgICAgIHsoZGF0YS5yZWNlbnRQcm9kdWN0cyB8fCBbXSkubWFwKChwcm9kdWN0KSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1yZWNlbnQtaXRlbVwiIGtleT17cHJvZHVjdC5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1uYW1lXCI+e3Byb2R1Y3QubmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1kYXRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtuZXcgRGF0ZShwcm9kdWN0LmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJpY2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIHtmb3JtYXRDdXJyZW5jeShwcm9kdWN0LnByaWNlKX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtZnVsbC13aWR0aC1zZWN0aW9uXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZCBjaGFuZ2U4LWNhcmQtLXRhbGxcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5PcmRlcnMgT3ZlcnZpZXc8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPlxyXG4gICAgICAgICAgICAgIFN1bW1hcnkgb2YgYWxsIG9yZGVycyBhbmQgdHJhbnNhY3Rpb25zXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXNlY3Rpb24tZGl2aWRlclwiIC8+XHJcblxyXG4gICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gICAgICAgICAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJyZXBlYXQoYXV0by1maXQsIG1pbm1heCgyMDBweCwgMWZyKSlcIixcclxuICAgICAgICAgICAgICAgIGdhcDogXCIyMHB4XCIsXHJcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IFwiMTJweFwiLFxyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5Ub3RhbCBPcmRlcnM8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCJcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgbWFyZ2luVG9wOiBcIjhweFwiIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtkYXRhLm9yZGVycyB8fCAwfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+VG90YWwgVXNlcnM8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCJcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgbWFyZ2luVG9wOiBcIjhweFwiIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtkYXRhLnVzZXJzIHx8IDB9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5Ub3RhbCBSZXZlbnVlPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC12YWx1ZVwiXHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IG1hcmdpblRvcDogXCI4cHhcIiwgY29sb3I6IFwidmFyKC0tZ29sZClcIiB9fVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICB7Zm9ybWF0Q3VycmVuY3koZGF0YS5yZXZlbnVlKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmQ7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBSZWdpc3RlciA9ICgpID0+IHtcclxuICBjb25zdCBbZm9ybVN0YXRlLCBzZXRGb3JtU3RhdGVdID0gdXNlU3RhdGUoe1xyXG4gICAgbmFtZTogXCJcIixcclxuICAgIGVtYWlsOiBcIlwiLFxyXG4gICAgcGFzc3dvcmQ6IFwiXCIsXHJcbiAgfSk7XHJcbiAgY29uc3QgW21lc3NhZ2UsIHNldE1lc3NhZ2VdID0gdXNlU3RhdGUoeyB0eXBlOiBcIlwiLCB0ZXh0OiBcIlwiIH0pO1xyXG4gIGNvbnN0IFtpc1N1Ym1pdHRpbmcsIHNldElzU3VibWl0dGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm1hcmdpbiA9IFwiMFwiO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlQ2hhbmdlID0gKGV2ZW50KSA9PiB7XHJcbiAgICBzZXRGb3JtU3RhdGUoKGN1cnJlbnQpID0+ICh7XHJcbiAgICAgIC4uLmN1cnJlbnQsXHJcbiAgICAgIFtldmVudC50YXJnZXQubmFtZV06IGV2ZW50LnRhcmdldC52YWx1ZSxcclxuICAgIH0pKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBoYW5kbGVTdWJtaXQgPSBhc3luYyAoZXZlbnQpID0+IHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBzZXRNZXNzYWdlKHsgdHlwZTogXCJcIiwgdGV4dDogXCJcIiB9KTtcclxuICAgIHNldElzU3VibWl0dGluZyh0cnVlKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL2FwaS9yZWdpc3RlclwiLCB7XHJcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGZvcm1TdGF0ZSksXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YS5tZXNzYWdlIHx8IFwiUmVnaXN0cmF0aW9uIGZhaWxlZFwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0TWVzc2FnZSh7XHJcbiAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgdGV4dDogXCJBY2NvdW50IGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5ISBSZWRpcmVjdGluZy4uLlwiLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvYWRtaW4vbG9naW5cIjtcclxuICAgICAgfSwgMjAwMCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBzZXRNZXNzYWdlKHsgdHlwZTogXCJlcnJvclwiLCB0ZXh0OiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgICBzZXRJc1N1Ym1pdHRpbmcoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLXBhZ2VcIj5cclxuICAgICAgPHN0eWxlPntgXHJcbiAgICAgICAgLnJlZ2lzdGVyLXBhZ2Uge1xyXG4gICAgICAgICAgbWluLWhlaWdodDogMTAwdmg7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgICAgcGFkZGluZzogMjRweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6XHJcbiAgICAgICAgICAgIGxpbmVhci1ncmFkaWVudChyZ2JhKDE1LCAyMywgNDIsIDAuMzUpLCByZ2JhKDE1LCAyMywgNDIsIDAuMzUpKSxcclxuICAgICAgICAgICAgdXJsKCcvcHVibGljL2ltZzIuanBnJykgY2VudGVyIC8gY292ZXIgZml4ZWQ7XHJcbiAgICAgICAgICBmb250LWZhbWlseTogXCJQbHVzIEpha2FydGEgU2Fuc1wiLCBcIlNlZ29lIFVJXCIsIHNhbnMtc2VyaWY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItY2FyZCB7XHJcbiAgICAgICAgICB3aWR0aDogbWluKDEwMCUsIDUyMHB4KTtcclxuICAgICAgICAgIHBhZGRpbmc6IDYwcHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAyOHB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNSwgMjMsIDQyLCAwLjgyKTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgNTBweCAxMDBweCAtMjBweCByZ2JhKDAsIDAsIDAsIDAuOCk7XHJcbiAgICAgICAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMzBweCk7XHJcbiAgICAgICAgICBjb2xvcjogI2ZmZjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1sb2dvIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XHJcbiAgICAgICAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IC0wLjAxZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbG9nbyBzcGFuIHtcclxuICAgICAgICAgIGNvbG9yOiAjNjM2NmYxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWZpZWxkIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbGFiZWwge1xyXG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFlbTtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWlucHV0IHtcclxuICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgcGFkZGluZzogMTRweCAxOHB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSk7XHJcbiAgICAgICAgICBjb2xvcjogI2ZmZjtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWlucHV0OmZvY3VzIHtcclxuICAgICAgICAgIGJvcmRlci1jb2xvcjogIzYzNjZmMTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wOCk7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDAgMCA0cHggcmdiYSg5OSwgMTAyLCAyNDEsIDAuMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItYnV0dG9uIHtcclxuICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMTBweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDE2cHg7XHJcbiAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzYzNjZmMSwgI2E4NTVmNyk7XHJcbiAgICAgICAgICBjb2xvcjogI2ZmZjtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMjVweCAtNXB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWJ1dHRvbjpkaXNhYmxlZCB7XHJcbiAgICAgICAgICBvcGFjaXR5OiAwLjY7XHJcbiAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLW1lc3NhZ2Uge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDEycHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxM3B4O1xyXG4gICAgICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1tZXNzYWdlLmlzLXZpc2libGUge1xyXG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbWVzc2FnZS5lcnJvciB7XHJcbiAgICAgICAgICBjb2xvcjogI2Y4NzE3MTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjM5LCA2OCwgNjgsIDAuMSk7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDIzOSwgNjgsIDY4LCAwLjIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLW1lc3NhZ2Uuc3VjY2VzcyB7XHJcbiAgICAgICAgICBjb2xvcjogIzRhZGU4MDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMzQsIDE5NywgOTQsIDAuMSk7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDM0LCAxOTcsIDk0LCAwLjIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWZvb3RlciB7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAyNXB4O1xyXG4gICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC42KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1mb290ZXIgYSB7XHJcbiAgICAgICAgICBjb2xvcjogIzYzNjZmMTtcclxuICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItZm9vdGVyIGE6aG92ZXIge1xyXG4gICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogODUwcHgpIHtcclxuICAgICAgICAgIC5yZWdpc3Rlci1jYXJkIHtcclxuICAgICAgICAgICAgcGFkZGluZzogNDBweDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIGB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItY2FyZFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItbG9nb1wiPlJlZ2lzdGVyIG91ciBzaXRlPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgIGNsYXNzTmFtZT17YHJlZ2lzdGVyLW1lc3NhZ2UgJHttZXNzYWdlLnR5cGV9ICR7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UudGV4dCA/IFwiaXMtdmlzaWJsZVwiIDogXCJcIlxyXG4gICAgICAgICAgfWB9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge21lc3NhZ2UudGV4dH1cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLWZpZWxkXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJyZWdpc3Rlci1sYWJlbFwiIGh0bWxGb3I9XCJuYW1lXCI+XHJcbiAgICAgICAgICAgICAgRnVsbCBOYW1lXHJcbiAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWlucHV0XCJcclxuICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgICAgaWQ9XCJuYW1lXCJcclxuICAgICAgICAgICAgICBuYW1lPVwibmFtZVwiXHJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciB5b3VyIGZ1bGwgbmFtZVwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1TdGF0ZS5uYW1lfVxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XHJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItZmllbGRcIj5cclxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWxhYmVsXCIgaHRtbEZvcj1cImVtYWlsXCI+XHJcbiAgICAgICAgICAgICAgRW1haWwgQWRkcmVzc1xyXG4gICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyZWdpc3Rlci1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgdHlwZT1cImVtYWlsXCJcclxuICAgICAgICAgICAgICBpZD1cImVtYWlsXCJcclxuICAgICAgICAgICAgICBuYW1lPVwiZW1haWxcIlxyXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZXhhbXBsZUBlbWFpbC5jb21cIlxyXG4gICAgICAgICAgICAgIHZhbHVlPXtmb3JtU3RhdGUuZW1haWx9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cclxuICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWdpc3Rlci1maWVsZFwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwicmVnaXN0ZXItbGFiZWxcIiBodG1sRm9yPVwicGFzc3dvcmRcIj5cclxuICAgICAgICAgICAgICBQYXNzd29yZFxyXG4gICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyZWdpc3Rlci1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcclxuICAgICAgICAgICAgICBpZD1cInBhc3N3b3JkXCJcclxuICAgICAgICAgICAgICBuYW1lPVwicGFzc3dvcmRcIlxyXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQXQgbGVhc3QgNiBjaGFyYWN0ZXJzXCJcclxuICAgICAgICAgICAgICBtaW5MZW5ndGg9ezZ9XHJcbiAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1TdGF0ZS5wYXNzd29yZH1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxyXG4gICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWJ1dHRvblwiXHJcbiAgICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIlxyXG4gICAgICAgICAgICBkaXNhYmxlZD17aXNTdWJtaXR0aW5nfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7aXNTdWJtaXR0aW5nID8gXCJDcmVhdGluZyBhY2NvdW50Li4uXCIgOiBcIkNyZWF0ZSBBY2NvdW50XCJ9XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8L2Zvcm0+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItZm9vdGVyXCI+XHJcbiAgICAgICAgICBBbHJlYWR5IGhhdmUgYW4gYWNjb3VudD8gPGEgaHJlZj1cIi9hZG1pbi9sb2dpblwiPkxvZyBpbjwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0ZXI7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBncmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMjQwcHgsIDFmcikpXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMTZweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjI4KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwibGluZWFyLWdyYWRpZW50KDE2MGRlZywgIzBiMWEzOCAwJSwgIzA5MTYyZiAxMDAlKVwiLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBvdmVyZmxvdzogXCJoaWRkZW5cIixcclxuICBib3hTaGFkb3c6IFwiMCAxMnB4IDIycHggcmdiYSgyLCA2LCAyMywgMC4yNSlcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlV3JhcFN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBoZWlnaHQ6IFwiMjAwcHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gIHBhZGRpbmc6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gIG9iamVjdEZpdDogXCJjb250YWluXCIsXHJcbn07XHJcblxyXG5jb25zdCBib2R5U3R5bGUgPSB7XHJcbiAgcGFkZGluZzogXCIxNHB4XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgbWV0YVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDFmclwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IChpc0FjdGl2ZSkgPT4gKHtcclxuICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjA1ZW1cIixcclxuICBwYWRkaW5nOiBcIjVweCAxMHB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgY29sb3I6IGlzQWN0aXZlID8gXCIjMTQ1MzJkXCIgOiBcIiM3ZjFkMWRcIixcclxuICBiYWNrZ3JvdW5kOiBpc0FjdGl2ZSA/IFwiI2JiZjdkMFwiIDogXCIjZmVjYWNhXCIsXHJcbn0pO1xyXG5cclxuY29uc3QgbGlua1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiaW5saW5lLWJsb2NrXCIsXHJcbiAgbWFyZ2luVG9wOiBcIjRweFwiLFxyXG4gIGNvbG9yOiBcIiM5M2M1ZmRcIixcclxuICB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDYwMCxcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgZW1wdHlTdHlsZSA9IHtcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggZGFzaGVkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC40NSlcIixcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXRQcmljZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IGFtb3VudCA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICBpZiAoIU51bWJlci5pc0Zpbml0ZShhbW91bnQpKSB7XHJcbiAgICByZXR1cm4gXCIwLjAwXCI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYW1vdW50LnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0UmVjb3JkSWQgPSAocmVjb3JkKSA9PiB7XHJcbiAgcmV0dXJuIHJlY29yZD8ucGFyYW1zPy5pZCB8fCByZWNvcmQ/LmlkIHx8IHJlY29yZD8ucGFyYW0/LmlkIHx8IFwiXCI7XHJcbn07XHJcblxyXG5jb25zdCBnZXRTaG93SHJlZiA9IChyZWNvcmQsIHJlc291cmNlSWQpID0+IHtcclxuICBjb25zdCByZWNvcmRBY3Rpb25zID0gcmVjb3JkPy5yZWNvcmRBY3Rpb25zIHx8IHJlY29yZD8uYWN0aW9ucyB8fCBbXTtcclxuICBjb25zdCBzaG93QWN0aW9uID0gcmVjb3JkQWN0aW9ucy5maW5kKChhY3Rpb24pID0+IGFjdGlvbj8ubmFtZSA9PT0gXCJzaG93XCIpO1xyXG4gIGNvbnN0IHJhd0hyZWYgPSBzaG93QWN0aW9uPy5ocmVmIHx8IHJlY29yZD8uaHJlZiB8fCBcIlwiO1xyXG5cclxuICBpZiAocmF3SHJlZikge1xyXG4gICAgcmV0dXJuIHJhd0hyZWY7XHJcbiAgfVxyXG5cclxuICBjb25zdCBpZCA9IGdldFJlY29yZElkKHJlY29yZCk7XHJcbiAgcmV0dXJuIGlkXHJcbiAgICA/IGAvYWRtaW4vcmVzb3VyY2VzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KHJlc291cmNlSWQpfS9yZWNvcmRzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KGlkKX0vc2hvd2BcclxuICAgIDogXCJcIjtcclxufTtcclxuXHJcbmNvbnN0IFByb2R1Y3RDYXJkc0xpc3QgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCBbYXBpUmVjb3Jkcywgc2V0QXBpUmVjb3Jkc10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IFtsb2FkRXJyb3IsIHNldExvYWRFcnJvcl0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgY29uc3QgcmVzb3VyY2VJZCA9XHJcbiAgICBwcm9wcz8ucmVzb3VyY2U/LmlkID09PSBcIlByb2R1Y3RcIlxyXG4gICAgICA/IFwiUHJvZHVjdHNcIlxyXG4gICAgICA6IHByb3BzPy5yZXNvdXJjZT8uaWQgfHwgXCJQcm9kdWN0c1wiO1xyXG4gIGNvbnN0IHByb3BSZWNvcmRzID0gcHJvcHM/LnJlY29yZHMgfHwgW107XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAocHJvcFJlY29yZHMubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBsb2FkUmVjb3JkcyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgc2V0TG9hZGluZyh0cnVlKTtcclxuICAgICAgc2V0TG9hZEVycm9yKFwiXCIpO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9hcGkvcmVzb3VyY2VzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KHJlc291cmNlSWQpfS9hY3Rpb25zL2xpc3RgLFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZD8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIHByb2R1Y3RzXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0QXBpUmVjb3JkcyhwYXlsb2FkPy5yZWNvcmRzIHx8IFtdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0TG9hZEVycm9yKGVycm9yPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgcHJvZHVjdHNcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkUmVjb3JkcygpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIGlzTW91bnRlZCA9IGZhbHNlO1xyXG4gICAgfTtcclxuICB9LCBbcHJvcFJlY29yZHMubGVuZ3RoLCByZXNvdXJjZUlkXSk7XHJcblxyXG4gIGNvbnN0IHJlY29yZHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiBwcm9wUmVjb3Jkcy5sZW5ndGggPyBwcm9wUmVjb3JkcyA6IGFwaVJlY29yZHM7XHJcbiAgfSwgW3Byb3BSZWNvcmRzLCBhcGlSZWNvcmRzXSk7XHJcblxyXG4gIGlmIChsb2FkaW5nKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+TG9hZGluZyBwcm9kdWN0cy4uLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChsb2FkRXJyb3IpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT57bG9hZEVycm9yfTwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmICghcmVjb3Jkcy5sZW5ndGgpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5ObyBwcm9kdWN0cyBmb3VuZC48L2Rpdj47XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17Z3JpZFN0eWxlfT5cclxuICAgICAge3JlY29yZHMubWFwKChyZWNvcmQpID0+IHtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fTtcclxuICAgICAgICBjb25zdCBpZCA9IGdldFJlY29yZElkKHJlY29yZCk7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHBhcmFtcz8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwiO1xyXG4gICAgICAgIGNvbnN0IGNhdGVnb3J5ID0gcGFyYW1zPy5jYXRlZ29yeUlkIHx8IFwiLVwiO1xyXG4gICAgICAgIGNvbnN0IGltYWdlVXJsID0gcGFyYW1zPy5pbWFnZVVybCB8fCBcIlwiO1xyXG4gICAgICAgIGNvbnN0IHN0b2NrID0gTnVtYmVyKHBhcmFtcz8uc3RvY2sgfHwgMCk7XHJcbiAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBCb29sZWFuKHBhcmFtcz8uaXNBY3RpdmUpO1xyXG4gICAgICAgIGNvbnN0IGRldGFpbHNIcmVmID0gZ2V0U2hvd0hyZWYocmVjb3JkLCByZXNvdXJjZUlkKTtcclxuICAgICAgICBjb25zdCBvcGVuRGV0YWlscyA9ICgpID0+IHtcclxuICAgICAgICAgIGlmIChkZXRhaWxzSHJlZikge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKGRldGFpbHNIcmVmKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgPGFydGljbGUga2V5PXtpZH0gc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2ltYWdlV3JhcFN0eWxlfT5cclxuICAgICAgICAgICAgICB7aW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2VVcmx9IGFsdD17bmFtZX0gc3R5bGU9e2ltYWdlU3R5bGV9IC8+XHJcbiAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgTm8gaW1hZ2VcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Ym9keVN0eWxlfT5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiBcIjE4cHhcIiwgZm9udFdlaWdodDogNzAwIH19PntuYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e21ldGFTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PkNhdGVnb3J5OiB7Y2F0ZWdvcnl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlN0b2NrOiB7c3RvY2t9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlByaWNlOiBScy4ge2Zvcm1hdFByaWNlKHBhcmFtcz8ucHJpY2UpfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtiYWRnZVN0eWxlKGlzQWN0aXZlKX0+XHJcbiAgICAgICAgICAgICAgICB7aXNBY3RpdmUgPyBcIkFDVElWRVwiIDogXCJJTkFDVElWRVwifVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgICAgaHJlZj17ZGV0YWlsc0hyZWYgfHwgXCIjXCJ9XHJcbiAgICAgICAgICAgICAgICBzdHlsZT17bGlua1N0eWxlfVxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17KGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgIG9wZW5EZXRhaWxzKCk7XHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgYXJpYS1kaXNhYmxlZD17IWRldGFpbHNIcmVmfVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIFZpZXcgZGV0YWlsc1xyXG4gICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgKTtcclxuICAgICAgfSl9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdENhcmRzTGlzdDtcclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgcGFnZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxOHB4XCIsXHJcbiAgY29sb3I6IFwiI2UyZThmMFwiLFxyXG59O1xyXG5cclxuY29uc3QgaGVyb1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwibWlubWF4KDI4MHB4LCAzNjBweCkgMWZyXCIsXHJcbiAgZ2FwOiBcIjE4cHhcIixcclxuICBhbGlnbkl0ZW1zOiBcInN0cmV0Y2hcIixcclxufTtcclxuXHJcbmNvbnN0IHBhbmVsU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjIwcHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xOClcIixcclxuICBiYWNrZ3JvdW5kOlxyXG4gICAgXCJsaW5lYXItZ3JhZGllbnQoMTYwZGVnLCByZ2JhKDExLCAyNiwgNTYsIDAuOTYpIDAlLCByZ2JhKDksIDIyLCA0NywgMC45NikgMTAwJSlcIixcclxuICBib3hTaGFkb3c6IFwiMCAyMHB4IDQwcHggcmdiYSgyLCA2LCAyMywgMC4yNClcIixcclxuICBvdmVyZmxvdzogXCJoaWRkZW5cIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlV3JhcFN0eWxlID0ge1xyXG4gIG1pbkhlaWdodDogXCIzNjBweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBkaXNwbGF5OiBcImJsb2NrXCIsXHJcbn07XHJcblxyXG5jb25zdCBoZXJvQm9keVN0eWxlID0ge1xyXG4gIHBhZGRpbmc6IFwiMjJweFwiLFxyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBmb250U2l6ZTogXCJjbGFtcCgyOHB4LCA0dncsIDQ2cHgpXCIsXHJcbiAgbGluZUhlaWdodDogMS4wNSxcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBzdWJ0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgZm9udFNpemU6IFwiMTRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IChhY3RpdmUpID0+ICh7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICBwYWRkaW5nOiBcIjZweCAxMnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxyXG4gIGNvbG9yOiBhY3RpdmUgPyBcIiMxNDUzMmRcIiA6IFwiIzdmMWQxZFwiLFxyXG4gIGJhY2tncm91bmQ6IGFjdGl2ZSA/IFwiI2JiZjdkMFwiIDogXCIjZmVjYWNhXCIsXHJcbn0pO1xyXG5cclxuY29uc3Qgc3RhdHNHcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJyZXBlYXQoMywgbWlubWF4KDE2MHB4LCAxZnIpKVwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzdGF0Q2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxNnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTUpXCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNTgpXCIsXHJcbiAgcGFkZGluZzogXCIxNHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzdGF0TGFiZWxTdHlsZSA9IHtcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTZlbVwiLFxyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBtYXJnaW5Cb3R0b206IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzdGF0VmFsdWVTdHlsZSA9IHtcclxuICBmb250U2l6ZTogXCIxNnB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICB3b3JkQnJlYWs6IFwiYnJlYWstd29yZFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdGlvbkdyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgwLCAxLjRmcikgbWlubWF4KDI4MHB4LCAwLjlmcilcIixcclxuICBnYXA6IFwiMThweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdGlvblRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjEyZW1cIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gIGNvbG9yOiBcIiNmNWRmOTBcIixcclxufTtcclxuXHJcbmNvbnN0IGNvbnRlbnRDYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjIwcHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xOClcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTEsIDI2LCA1NiwgMC45KVwiLFxyXG4gIHBhZGRpbmc6IFwiMThweFwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDE2cHggMjhweCByZ2JhKDIsIDYsIDIzLCAwLjE2KVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0xpc3RTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb1Jvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiMTBweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0xhYmVsU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9WYWx1ZVN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgdGV4dEFsaWduOiBcInJpZ2h0XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgZGVzY3JpcHRpb25TdHlsZSA9IHtcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbiAgbGluZUhlaWdodDogMS43LFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxuICB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIsXHJcbn07XHJcblxyXG5jb25zdCBidXR0b25TdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImlubGluZS1mbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIHBhZGRpbmc6IFwiMTRweCAxOHB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE0cHhcIixcclxuICBib3JkZXI6IFwibm9uZVwiLFxyXG4gIGJhY2tncm91bmQ6IFwibGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzYzNjZmMSAwJSwgIzhiNWNmNiAxMDAlKVwiLFxyXG4gIGNvbG9yOiBcIiNmZmZmZmZcIixcclxuICBmb250U2l6ZTogXCIxNXB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgdHJhbnNpdGlvbjogXCJhbGwgMC4zcyBlYXNlXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgOHB4IDE2cHggcmdiYSg5OSwgMTAyLCAyNDEsIDAuMylcIixcclxufTtcclxuXHJcbmNvbnN0IGJ1dHRvbkhvdmVyU3R5bGUgPSB7XHJcbiAgLi4uYnV0dG9uU3R5bGUsXHJcbiAgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoLTJweClcIixcclxuICBib3hTaGFkb3c6IFwiMCAxMnB4IDI0cHggcmdiYSg5OSwgMTAyLCAyNDEsIDAuNClcIixcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdEN1cnJlbmN5ID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgYW1vdW50ID0gTnVtYmVyKHZhbHVlIHx8IDApO1xyXG4gIHJldHVybiBgUnMuICR7YW1vdW50LnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gIH0pfWA7XHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXREYXRlID0gKHZhbHVlKSA9PiB7XHJcbiAgaWYgKCF2YWx1ZSkge1xyXG4gICAgcmV0dXJuIFwiLVwiO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHZhbHVlKTtcclxuICBpZiAoTnVtYmVyLmlzTmFOKGRhdGUuZ2V0VGltZSgpKSkge1xyXG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0ZS50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIGRhdGVTdHlsZTogXCJtZWRpdW1cIixcclxuICAgIHRpbWVTdHlsZTogXCJzaG9ydFwiLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgUHJvZHVjdFNob3cgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCByZWNvcmQgPSBwcm9wcz8ucmVjb3JkO1xyXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9O1xyXG5cclxuICBjb25zdCBuYW1lID0gcGFyYW1zPy5uYW1lIHx8IFwiVW5uYW1lZCBwcm9kdWN0XCI7XHJcbiAgY29uc3Qgc2t1ID0gcGFyYW1zPy5za3UgfHwgXCItXCI7XHJcbiAgY29uc3QgY2F0ZWdvcnkgPSBwYXJhbXM/LmNhdGVnb3J5SWQgfHwgXCItXCI7XHJcbiAgY29uc3QgaW1hZ2VVcmwgPSBwYXJhbXM/LmltYWdlVXJsIHx8IFwiXCI7XHJcbiAgY29uc3Qgc3RvY2sgPSBOdW1iZXIocGFyYW1zPy5zdG9jayB8fCAwKTtcclxuICBjb25zdCBpc0FjdGl2ZSA9IEJvb2xlYW4ocGFyYW1zPy5pc0FjdGl2ZSk7XHJcbiAgY29uc3QgcHJpY2UgPSBmb3JtYXRDdXJyZW5jeShwYXJhbXM/LnByaWNlKTtcclxuICBjb25zdCBkZXNjcmlwdGlvbiA9XHJcbiAgICBwYXJhbXM/LmRlc2NyaXB0aW9uIHx8IFwiTm8gZGVzY3JpcHRpb24gYXZhaWxhYmxlIGZvciB0aGlzIHByb2R1Y3QuXCI7XHJcblxyXG4gIGNvbnN0IFtidXR0b25Ib3ZlcmVkLCBzZXRCdXR0b25Ib3ZlcmVkXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlT3JkZXJDbGljayA9ICgpID0+IHtcclxuICAgIGNvbnN0IHByb2R1Y3RJZCA9IHBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZCB8fCBcIlwiO1xyXG4gICAgY29uc3QgbmV3T3JkZXJVcmwgPSBgL2FkbWluL3Jlc291cmNlcy9PcmRlcnMvYWN0aW9ucy9uZXc/cHJvZHVjdElkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhwcm9kdWN0SWQpKX1gO1xyXG4gICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihuZXdPcmRlclVybCk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3BhZ2VTdHlsZX0+XHJcbiAgICAgIDxzdHlsZT5cclxuICAgICAgICB7YFxyXG4gICAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDk4MHB4KSB7XHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1oZXJvLFxyXG4gICAgICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LXNob3ctc2VjdGlvbnMge1xyXG4gICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICBgfVxyXG4gICAgICA8L3N0eWxlPlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3Qtc2hvdy1oZXJvXCIgc3R5bGU9e2hlcm9TdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17cGFuZWxTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbWFnZVdyYXBTdHlsZX0+XHJcbiAgICAgICAgICAgIHtpbWFnZVVybCA/IChcclxuICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2VVcmx9IGFsdD17bmFtZX0gc3R5bGU9e2ltYWdlU3R5bGV9IC8+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIE5vIGltYWdlIGF2YWlsYWJsZVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3BhbmVsU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aGVyb0JvZHlTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGgxIHN0eWxlPXt0aXRsZVN0eWxlfT57bmFtZX08L2gxPlxyXG4gICAgICAgICAgICAgIDxwIHN0eWxlPXtzdWJ0aXRsZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIENsZWFuIHByb2R1Y3Qgb3ZlcnZpZXcgZm9yIHF1aWNrIHJldmlldyBhbmQgbWFuYWdlbWVudC5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17YmFkZ2VTdHlsZShpc0FjdGl2ZSl9PlxyXG4gICAgICAgICAgICAgIHtpc0FjdGl2ZSA/IFwiQUNUSVZFXCIgOiBcIklOQUNUSVZFXCJ9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdHNHcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRDYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdExhYmVsU3R5bGV9PlByaWNlPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0VmFsdWVTdHlsZX0+e3ByaWNlfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRDYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdExhYmVsU3R5bGV9PlN0b2NrPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17YnV0dG9uSG92ZXJlZCA/IGJ1dHRvbkhvdmVyU3R5bGUgOiBidXR0b25TdHlsZX1cclxuICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiBzZXRCdXR0b25Ib3ZlcmVkKHRydWUpfVxyXG4gICAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHNldEJ1dHRvbkhvdmVyZWQoZmFsc2UpfVxyXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVPcmRlckNsaWNrfVxyXG4gICAgICAgICAgICAgICAgICB0aXRsZT1cIkNsaWNrIHRvIGNyZWF0ZSBhIG5ldyBvcmRlciBmb3IgdGhpcyBwcm9kdWN0XCJcclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPHN2Z1xyXG4gICAgICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiMThcIlxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjE4XCJcclxuICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcclxuICAgICAgICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjIuNVwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCI5XCIgY3k9XCIyMVwiIHI9XCIxXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PVwiMjBcIiBjeT1cIjIxXCIgcj1cIjFcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMSAxaDRsMi42OCAxMy4zOWEyIDIgMCAwIDAgMiAxLjYxaDkuNzJhMiAyIDAgMCAwIDItMS42MUwyMyA2SDZcIiAvPlxyXG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgT3JkZXIgTm93XHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YXRWYWx1ZVN0eWxlfT57c3RvY2t9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3RhdENhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0TGFiZWxTdHlsZX0+U0tVPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGF0VmFsdWVTdHlsZX0+e3NrdX08L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdC1zaG93LXNlY3Rpb25zXCIgc3R5bGU9e3NlY3Rpb25HcmlkU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NvbnRlbnRDYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+RGVzY3JpcHRpb248L2gyPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtkZXNjcmlwdGlvblN0eWxlfT57ZGVzY3JpcHRpb259PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NvbnRlbnRDYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UHJvZHVjdCBEZXRhaWxzPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMiB9fSAvPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0xpc3RTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9MYWJlbFN0eWxlfT5DYXRlZ29yeTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb1ZhbHVlU3R5bGV9PntjYXRlZ29yeX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvTGFiZWxTdHlsZX0+Q3JlYXRlZCBBdDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb1ZhbHVlU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAge2Zvcm1hdERhdGUocGFyYW1zPy5jcmVhdGVkQXQpfVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2luZm9MYWJlbFN0eWxlfT5VcGRhdGVkIEF0PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtpbmZvVmFsdWVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShwYXJhbXM/LnVwZGF0ZWRBdCl9XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PlJlY29yZCBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17aW5mb1ZhbHVlU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAge3BhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZCB8fCBcIi1cIn1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RTaG93O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgcGFnZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIyMHB4XCIsXHJcbiAgY29sb3I6IFwiI2UyZThmMFwiLFxyXG59O1xyXG5cclxuY29uc3QgaGVhZGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgdGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgZm9udFNpemU6IFwiMzRweFwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuMDgsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3QgZGVzY1N0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgZm9udFNpemU6IFwiMTRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgY2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxOHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMilcIixcclxuICBiYWNrZ3JvdW5kOlxyXG4gICAgXCJsaW5lYXItZ3JhZGllbnQoMTUwZGVnLCByZ2JhKDEwLCAyMywgNDgsIDAuOTQpIDAlLCByZ2JhKDgsIDE4LCAzOCwgMC45NCkgMTAwJSlcIixcclxuICBib3hTaGFkb3c6IFwiMCAxNHB4IDI4cHggcmdiYSgyLCA2LCAyMywgMC4yMilcIixcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHNlY3Rpb25UaXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogXCIwIDAgMTRweCAwXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjEyZW1cIixcclxuICBjb2xvcjogXCIjZjVkZjkwXCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG59O1xyXG5cclxuY29uc3QgbGF5b3V0U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJtaW5tYXgoMzAwcHgsIDAuOTVmcikgbWlubWF4KDQyMHB4LCAxLjI1ZnIpXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHN0YWNrU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGxhYmVsU3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMWVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbnB1dFN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjI2KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSgxNSwgMjMsIDQyLCAwLjYyKVwiLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBwYWRkaW5nOiBcIjExcHggMTNweFwiLFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxuICBmb250RmFtaWx5OiBcImluaGVyaXRcIixcclxufTtcclxuXHJcbmNvbnN0IHJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGdyaWQyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGN1c3RvbWVySW5mb1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBjdXN0b21lclJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjhweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG59O1xyXG5cclxuY29uc3QgbXV0ZWRTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzdHJvbmdTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIHRleHRBbGlnbjogXCJyaWdodFwiLFxyXG59O1xyXG5cclxuY29uc3QgbGluZUl0ZW1Sb3dTdHlsZSA9IHtcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yKVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgcGFkZGluZzogXCIxMnB4XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTUsIDIzLCA0MiwgMC40NClcIixcclxufTtcclxuXHJcbmNvbnN0IGxpbmVJdGVtVG9wU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgYXV0b1wiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IHByb2R1Y3RQcmV2aWV3U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCI1NnB4IDFmclwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiNTZweFwiLFxyXG4gIGhlaWdodDogXCI1NnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yNSlcIixcclxufTtcclxuXHJcbmNvbnN0IGFkZEJ1dHRvblN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgcGFkZGluZzogXCI5cHggMTJweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSg5OSwgMTAyLCAyNDEsIDAuMTgpXCIsXHJcbiAgY29sb3I6IFwiI2RiZWFmZVwiLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG59O1xyXG5cclxuY29uc3QgcmVtb3ZlQnV0dG9uU3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDIzOSwgNjgsIDY4LCAwLjUpXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBwYWRkaW5nOiBcIjhweCAxMHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDEyNywgMjksIDI5LCAwLjI1KVwiLFxyXG4gIGNvbG9yOiBcIiNmZWNhY2FcIixcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbn07XHJcblxyXG5jb25zdCB0b3RhbHNSb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgcGFkZGluZzogXCI3cHggMFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxufTtcclxuXHJcbmNvbnN0IHRvdGFsU3R5bGUgPSB7XHJcbiAgLi4udG90YWxzUm93U3R5bGUsXHJcbiAgZm9udFNpemU6IFwiMTdweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIm5vbmVcIixcclxuICBwYWRkaW5nVG9wOiBcIjEycHhcIixcclxufTtcclxuXHJcbmNvbnN0IGFjdGlvbkJhclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDFmclwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBhY3Rpb25CdXR0b25TdHlsZSA9IChwcmltYXJ5KSA9PiAoe1xyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYm9yZGVyOiBwcmltYXJ5ID8gXCJub25lXCIgOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjgpXCIsXHJcbiAgcGFkZGluZzogXCIxMnB4IDE0cHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxuICBiYWNrZ3JvdW5kOiBwcmltYXJ5XHJcbiAgICA/IFwibGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzYzNjZmMSAwJSwgIzhiNWNmNiAxMDAlKVwiXHJcbiAgICA6IFwicmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG4gIGNvbG9yOiBwcmltYXJ5ID8gXCIjZmZmXCIgOiBcIiNkMWQ1ZGJcIixcclxufSk7XHJcblxyXG5jb25zdCBtYXBMaW5rU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiIzkzYzVmZFwiLFxyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsXHJcbn07XHJcblxyXG5jb25zdCByZXNwb25zaXZlQ3NzID0gYFxyXG5AbWVkaWEgKG1heC13aWR0aDogMTAyNHB4KSB7XHJcbiAgLmNoYW5nZTgtb3JkZXItbGF5b3V0IHtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7XHJcbiAgfVxyXG59XHJcbmA7XHJcblxyXG5jb25zdCBwYXltZW50T3B0aW9ucyA9IFtcIkNhcmRcIiwgXCJDYXNoIG9uIERlbGl2ZXJ5XCIsIFwiQmFuayBUcmFuc2ZlclwiLCBcIldhbGxldFwiXTtcclxuY29uc3Qgc2hpcHBpbmdNZXRob2RzID0gW1xyXG4gIFwiUGlja01lIEZsYXNoXCIsXHJcbiAgXCJQcm9udG9cIixcclxuICBcIkRvbWV4XCIsXHJcbiAgXCJSZWdpc3RlcmVkIENvdXJpZXJcIixcclxuXTtcclxuXHJcbmNvbnN0IHRvTnVtYmVyID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgbnVtID0gTnVtYmVyKHZhbHVlIHx8IDApO1xyXG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobnVtKSA/IG51bSA6IDA7XHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXRNb25leSA9ICh2YWx1ZSkgPT4ge1xyXG4gIHJldHVybiBgUnMuICR7dG9OdW1iZXIodmFsdWUpLnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gIH0pfWA7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVFbXB0eUl0ZW0gPSAoKSA9PiAoe1xyXG4gIHByb2R1Y3RJZDogXCJcIixcclxuICBxdWFudGl0eTogMSxcclxuICB1bml0UHJpY2U6IDAsXHJcbn0pO1xyXG5cclxuY29uc3QgT3JkZXJDcmVhdGUgPSAoKSA9PiB7XHJcbiAgY29uc3QgW3VzZXJzLCBzZXRVc2Vyc10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgY29uc3QgW3Byb2R1Y3RzLCBzZXRQcm9kdWN0c10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgY29uc3QgW29yZGVyQ291bnRCeVVzZXIsIHNldE9yZGVyQ291bnRCeVVzZXJdID0gdXNlU3RhdGUoe30pO1xyXG4gIGNvbnN0IFtzZXNzaW9uVXNlciwgc2V0U2Vzc2lvblVzZXJdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XHJcbiAgY29uc3QgW3N1Ym1pdHRpbmcsIHNldFN1Ym1pdHRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICBjb25zdCBbZm9ybURhdGEsIHNldEZvcm1EYXRhXSA9IHVzZVN0YXRlKHtcclxuICAgIHVzZXJJZDogXCJcIixcclxuICAgIHN0YXR1czogXCJwZW5kaW5nXCIsXHJcbiAgICBwYXltZW50TWV0aG9kOiBcIkNhcmRcIixcclxuICAgIHBheW1lbnRTdGF0dXM6IFwicGVuZGluZ1wiLFxyXG4gICAgdHJhbnNhY3Rpb25JZDogXCJcIixcclxuICAgIHNoaXBwaW5nQWRkcmVzczogXCJcIixcclxuICAgIHNoaXBwaW5nTWV0aG9kOiBcIlBpY2tNZSBGbGFzaFwiLFxyXG4gICAgdHJhY2tpbmdOdW1iZXI6IFwiXCIsXHJcbiAgICBzaGlwcGluZ0ZlZTogMCxcclxuICAgIHRheDogMCxcclxuICAgIGRpc2NvdW50OiAwLFxyXG4gIH0pO1xyXG5cclxuICBjb25zdCBbbGluZUl0ZW1zLCBzZXRMaW5lSXRlbXNdID0gdXNlU3RhdGUoW2NyZWF0ZUVtcHR5SXRlbSgpXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xyXG4gICAgY29uc3QgcHJlUHJvZHVjdElkID0gcGFyYW1zLmdldChcInByb2R1Y3RJZFwiKSB8fCBcIlwiO1xyXG5cclxuICAgIGNvbnN0IGZldGNoRGF0YSA9IGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBjb250ZXh0UmVzID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgICAgICBgL2FkbWluL2NvbnRleHQvb3JkZXItY3JlYXRlJHtcclxuICAgICAgICAgICAgcHJlUHJvZHVjdElkID8gYD9wcm9kdWN0SWQ9JHtlbmNvZGVVUklDb21wb25lbnQocHJlUHJvZHVjdElkKX1gIDogXCJcIlxyXG4gICAgICAgICAgfWAsXHJcbiAgICAgICAgICB7IGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZXh0RGF0YSA9IGNvbnRleHRSZXMub2sgPyBhd2FpdCBjb250ZXh0UmVzLmpzb24oKSA6IHt9O1xyXG5cclxuICAgICAgICBjb25zdCB1c2Vyc0RhdGEgPSBBcnJheS5pc0FycmF5KGNvbnRleHREYXRhPy51c2VycylcclxuICAgICAgICAgID8gY29udGV4dERhdGEudXNlcnNcclxuICAgICAgICAgIDogW107XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdHNMaXN0ID0gQXJyYXkuaXNBcnJheShjb250ZXh0RGF0YT8ucHJvZHVjdHMpXHJcbiAgICAgICAgICA/IGNvbnRleHREYXRhLnByb2R1Y3RzXHJcbiAgICAgICAgICA6IFtdO1xyXG5cclxuICAgICAgICBzZXRVc2Vycyh1c2Vyc0RhdGEpO1xyXG4gICAgICAgIHNldFByb2R1Y3RzKHByb2R1Y3RzTGlzdCk7XHJcbiAgICAgICAgc2V0T3JkZXJDb3VudEJ5VXNlcihjb250ZXh0RGF0YT8ub3JkZXJDb3VudEJ5VXNlciB8fCB7fSk7XHJcbiAgICAgICAgc2V0U2Vzc2lvblVzZXIoY29udGV4dERhdGE/LmN1cnJlbnRVc2VyIHx8IG51bGwpO1xyXG5cclxuICAgICAgICBpZiAoY29udGV4dERhdGE/LmN1cnJlbnRVc2VyPy5pZCkge1xyXG4gICAgICAgICAgc2V0Rm9ybURhdGEoKHByZXYpID0+ICh7XHJcbiAgICAgICAgICAgIC4uLnByZXYsXHJcbiAgICAgICAgICAgIHVzZXJJZDogcHJldi51c2VySWQgfHwgU3RyaW5nKGNvbnRleHREYXRhLmN1cnJlbnRVc2VyLmlkKSxcclxuICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb250ZXh0RGF0YT8uc2VsZWN0ZWRQcm9kdWN0Py5pZCkge1xyXG4gICAgICAgICAgc2V0TGluZUl0ZW1zKFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHByb2R1Y3RJZDogU3RyaW5nKGNvbnRleHREYXRhLnNlbGVjdGVkUHJvZHVjdC5pZCksXHJcbiAgICAgICAgICAgICAgcXVhbnRpdHk6IDEsXHJcbiAgICAgICAgICAgICAgdW5pdFByaWNlOiB0b051bWJlcihjb250ZXh0RGF0YS5zZWxlY3RlZFByb2R1Y3QucHJpY2UpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgXSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICBwcmVQcm9kdWN0SWQgJiZcclxuICAgICAgICAgIHByb2R1Y3RzTGlzdC5zb21lKChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhwcmVQcm9kdWN0SWQpKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBwcm9kdWN0c0xpc3QuZmluZChcclxuICAgICAgICAgICAgKHApID0+IFN0cmluZyhwLmlkKSA9PT0gU3RyaW5nKHByZVByb2R1Y3RJZCksXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgc2V0TGluZUl0ZW1zKFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHByb2R1Y3RJZDogU3RyaW5nKHByZVByb2R1Y3RJZCksXHJcbiAgICAgICAgICAgICAgcXVhbnRpdHk6IDEsXHJcbiAgICAgICAgICAgICAgdW5pdFByaWNlOiB0b051bWJlcihzZWxlY3RlZD8ucHJpY2UpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZldGNoRGF0YSgpO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgY29uc3Qgc2VsZWN0ZWRDdXN0b21lciA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgcmV0dXJuIHVzZXJzLmZpbmQoKHUpID0+IFN0cmluZyh1LmlkKSA9PT0gU3RyaW5nKGZvcm1EYXRhLnVzZXJJZCkpIHx8IG51bGw7XHJcbiAgfSwgW3VzZXJzLCBmb3JtRGF0YS51c2VySWRdKTtcclxuXHJcbiAgY29uc3QgY3VzdG9tZXJPcmRlckNvdW50ID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBpZiAoIXNlbGVjdGVkQ3VzdG9tZXIpIHtcclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIE51bWJlcihvcmRlckNvdW50QnlVc2VyW1N0cmluZyhzZWxlY3RlZEN1c3RvbWVyLmlkKV0gfHwgMCk7XHJcbiAgfSwgW29yZGVyQ291bnRCeVVzZXIsIHNlbGVjdGVkQ3VzdG9tZXJdKTtcclxuXHJcbiAgY29uc3QgbGluZVRvdGFscyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3Qgc3VidG90YWwgPSBsaW5lSXRlbXMucmVkdWNlKChzdW0sIGl0ZW0pID0+IHtcclxuICAgICAgcmV0dXJuIHN1bSArIHRvTnVtYmVyKGl0ZW0ucXVhbnRpdHkpICogdG9OdW1iZXIoaXRlbS51bml0UHJpY2UpO1xyXG4gICAgfSwgMCk7XHJcblxyXG4gICAgY29uc3Qgc2hpcHBpbmdGZWUgPSB0b051bWJlcihmb3JtRGF0YS5zaGlwcGluZ0ZlZSk7XHJcbiAgICBjb25zdCB0YXggPSB0b051bWJlcihmb3JtRGF0YS50YXgpO1xyXG4gICAgY29uc3QgZGlzY291bnQgPSB0b051bWJlcihmb3JtRGF0YS5kaXNjb3VudCk7XHJcbiAgICBjb25zdCBncmFuZFRvdGFsID0gTWF0aC5tYXgoc3VidG90YWwgKyBzaGlwcGluZ0ZlZSArIHRheCAtIGRpc2NvdW50LCAwKTtcclxuXHJcbiAgICByZXR1cm4geyBzdWJ0b3RhbCwgc2hpcHBpbmdGZWUsIHRheCwgZGlzY291bnQsIGdyYW5kVG90YWwgfTtcclxuICB9LCBbbGluZUl0ZW1zLCBmb3JtRGF0YS5zaGlwcGluZ0ZlZSwgZm9ybURhdGEudGF4LCBmb3JtRGF0YS5kaXNjb3VudF0pO1xyXG5cclxuICBjb25zdCBoYW5kbGVGb3JtQ2hhbmdlID0gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCB7IG5hbWUsIHZhbHVlIH0gPSBldmVudC50YXJnZXQ7XHJcbiAgICBzZXRGb3JtRGF0YSgocHJldikgPT4gKHsgLi4ucHJldiwgW25hbWVdOiB2YWx1ZSB9KSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlTGluZUl0ZW1DaGFuZ2UgPSAoaW5kZXgsIGtleSwgdmFsdWUpID0+IHtcclxuICAgIHNldExpbmVJdGVtcygocHJldikgPT4ge1xyXG4gICAgICBjb25zdCBuZXh0ID0gWy4uLnByZXZdO1xyXG4gICAgICBjb25zdCBpdGVtID0geyAuLi5uZXh0W2luZGV4XSB9O1xyXG5cclxuICAgICAgaWYgKGtleSA9PT0gXCJwcm9kdWN0SWRcIikge1xyXG4gICAgICAgIGl0ZW0ucHJvZHVjdElkID0gdmFsdWU7XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdCA9IHByb2R1Y3RzLmZpbmQoKHApID0+IFN0cmluZyhwLmlkKSA9PT0gU3RyaW5nKHZhbHVlKSk7XHJcbiAgICAgICAgaXRlbS51bml0UHJpY2UgPSB0b051bWJlcihwcm9kdWN0Py5wcmljZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInF1YW50aXR5XCIpIHtcclxuICAgICAgICBpdGVtLnF1YW50aXR5ID0gTWF0aC5tYXgoMSwgdG9OdW1iZXIodmFsdWUpKTtcclxuICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwidW5pdFByaWNlXCIpIHtcclxuICAgICAgICBpdGVtLnVuaXRQcmljZSA9IE1hdGgubWF4KDAsIHRvTnVtYmVyKHZhbHVlKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG5leHRbaW5kZXhdID0gaXRlbTtcclxuICAgICAgcmV0dXJuIG5leHQ7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBhZGRMaW5lSXRlbSA9ICgpID0+IHtcclxuICAgIHNldExpbmVJdGVtcygocHJldikgPT4gWy4uLnByZXYsIGNyZWF0ZUVtcHR5SXRlbSgpXSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVtb3ZlTGluZUl0ZW0gPSAoaW5kZXgpID0+IHtcclxuICAgIHNldExpbmVJdGVtcygocHJldikgPT4ge1xyXG4gICAgICBpZiAocHJldi5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gcHJldjtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHByZXYuZmlsdGVyKChfLCBpKSA9PiBpICE9PSBpbmRleCk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBtYXBzSHJlZiA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgaWYgKCFmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3M/LnRyaW0oKSkge1xyXG4gICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9zZWFyY2gvP2FwaT0xJnF1ZXJ5PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGZvcm1EYXRhLnNoaXBwaW5nQWRkcmVzcy50cmltKCkpfWA7XHJcbiAgfSwgW2Zvcm1EYXRhLnNoaXBwaW5nQWRkcmVzc10pO1xyXG5cclxuICBjb25zdCBoYW5kbGVTdWJtaXQgPSBhc3luYyAoZXZlbnQpID0+IHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgY29uc3QgdmFsaWRJdGVtcyA9IGxpbmVJdGVtcy5maWx0ZXIoXHJcbiAgICAgIChpdGVtKSA9PiBpdGVtLnByb2R1Y3RJZCAmJiB0b051bWJlcihpdGVtLnF1YW50aXR5KSA+IDAsXHJcbiAgICApO1xyXG5cclxuICAgIGlmICghZm9ybURhdGEudXNlcklkKSB7XHJcbiAgICAgIGFsZXJ0KFwiUGxlYXNlIHNlbGVjdCBhIGN1c3RvbWVyLlwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YWxpZEl0ZW1zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBhbGVydChcIkF0IGxlYXN0IG9uZSBwcm9kdWN0IGxpbmUgaXRlbSBpcyByZXF1aXJlZC5cIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTdWJtaXR0aW5nKHRydWUpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IG9yZGVyUGF5bG9hZCA9IHtcclxuICAgICAgICB1c2VySWQ6IE51bWJlcihmb3JtRGF0YS51c2VySWQpLFxyXG4gICAgICAgIHN0YXR1czogZm9ybURhdGEuc3RhdHVzLFxyXG4gICAgICAgIHBheW1lbnRNZXRob2Q6IGZvcm1EYXRhLnBheW1lbnRNZXRob2QsXHJcbiAgICAgICAgcGF5bWVudFN0YXR1czogZm9ybURhdGEucGF5bWVudFN0YXR1cyxcclxuICAgICAgICB0cmFuc2FjdGlvbklkOiBmb3JtRGF0YS50cmFuc2FjdGlvbklkIHx8IG51bGwsXHJcbiAgICAgICAgc2hpcHBpbmdNZXRob2Q6IGZvcm1EYXRhLnNoaXBwaW5nTWV0aG9kLFxyXG4gICAgICAgIHRyYWNraW5nTnVtYmVyOiBmb3JtRGF0YS50cmFja2luZ051bWJlciB8fCBudWxsLFxyXG4gICAgICAgIHN1YnRvdGFsOiBsaW5lVG90YWxzLnN1YnRvdGFsLnRvRml4ZWQoMiksXHJcbiAgICAgICAgc2hpcHBpbmdGZWU6IGxpbmVUb3RhbHMuc2hpcHBpbmdGZWUudG9GaXhlZCgyKSxcclxuICAgICAgICB0YXg6IGxpbmVUb3RhbHMudGF4LnRvRml4ZWQoMiksXHJcbiAgICAgICAgZGlzY291bnQ6IGxpbmVUb3RhbHMuZGlzY291bnQudG9GaXhlZCgyKSxcclxuICAgICAgICB0b3RhbEFtb3VudDogbGluZVRvdGFscy5ncmFuZFRvdGFsLnRvRml4ZWQoMiksXHJcbiAgICAgICAgc2hpcHBpbmdBZGRyZXNzOiBmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3MgfHwgbnVsbCxcclxuICAgICAgICBsaW5lSXRlbXM6IHZhbGlkSXRlbXMubWFwKChpdGVtKSA9PiAoe1xyXG4gICAgICAgICAgcHJvZHVjdElkOiBOdW1iZXIoaXRlbS5wcm9kdWN0SWQpLFxyXG4gICAgICAgICAgcXVhbnRpdHk6IE1hdGgubWF4KDEsIHRvTnVtYmVyKGl0ZW0ucXVhbnRpdHkpKSxcclxuICAgICAgICAgIHVuaXRQcmljZTogTWF0aC5tYXgoMCwgdG9OdW1iZXIoaXRlbS51bml0UHJpY2UpKS50b0ZpeGVkKDIpLFxyXG4gICAgICAgIH0pKSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IHN1Ym1pdEZvcm0gPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgc3VibWl0Rm9ybS5hcHBlbmQoXCJwYXlsb2FkXCIsIEpTT04uc3RyaW5naWZ5KG9yZGVyUGF5bG9hZCkpO1xyXG5cclxuICAgICAgY29uc3Qgb3JkZXJSZXMgPSBhd2FpdCBmZXRjaChcIi9hZG1pbi9jb250ZXh0L29yZGVyLWNyZWF0ZS9zdWJtaXRcIiwge1xyXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICBib2R5OiBzdWJtaXRGb3JtLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IG9yZGVyRGF0YSA9IGF3YWl0IG9yZGVyUmVzLmpzb24oKTtcclxuICAgICAgaWYgKCFvcmRlclJlcy5vaykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihvcmRlckRhdGE/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gY3JlYXRlIG9yZGVyXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKFxyXG4gICAgICAgIGAvYWRtaW4vcmVzb3VyY2VzL09yZGVycy9yZWNvcmRzLyR7b3JkZXJEYXRhLmlkfS9zaG93YCxcclxuICAgICAgKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGFsZXJ0KGVycm9yLm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gY3JlYXRlIG9yZGVyXCIpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0U3VibWl0dGluZyhmYWxzZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3BhZ2VTdHlsZX0+XHJcbiAgICAgIDxzdHlsZT57cmVzcG9uc2l2ZUNzc308L3N0eWxlPlxyXG5cclxuICAgICAgPGRpdiBzdHlsZT17aGVhZGVyU3R5bGV9PlxyXG4gICAgICAgIDxoMSBzdHlsZT17dGl0bGVTdHlsZX0+Q3JlYXRlIE5ldyBPcmRlcjwvaDE+XHJcbiAgICAgICAgPHAgc3R5bGU9e2Rlc2NTdHlsZX0+XHJcbiAgICAgICAgICBDdXN0b21lciBkZXRhaWxzLCBsaW5lIGl0ZW1zLCBwYXltZW50LCBzaGlwcGluZywgYW5kIHRvdGFscyBpbiBvbmVcclxuICAgICAgICAgIGd1aWRlZCBmbG93LlxyXG4gICAgICAgIDwvcD5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlU3VibWl0fSBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ2FwOiBcIjE2cHhcIiB9fT5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItbGF5b3V0XCIgc3R5bGU9e2xheW91dFN0eWxlfT5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3N0YWNrU3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PkN1c3RvbWVyIERldGFpbHM8L2gyPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNlbGVjdCBDdXN0b21lciAqPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxzZWxlY3RcclxuICAgICAgICAgICAgICAgICAgbmFtZT1cInVzZXJJZFwiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS51c2VySWR9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2xvYWRpbmcgfHwgc2Vzc2lvblVzZXI/LnJvbGUgPT09IFwidXNlclwifVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+XHJcbiAgICAgICAgICAgICAgICAgICAge2xvYWRpbmcgPyBcIkxvYWRpbmcgY3VzdG9tZXJzLi4uXCIgOiBcIlNlbGVjdCBhIGN1c3RvbWVyXCJ9XHJcbiAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICB7dXNlcnMubWFwKCh1c2VyKSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e3VzZXIuaWR9IHZhbHVlPXt1c2VyLmlkfT5cclxuICAgICAgICAgICAgICAgICAgICAgIHt1c2VyLm5hbWV9ICgje3VzZXIuaWR9KVxyXG4gICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTIgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJJbmZvU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5DdXN0b21lciBOYW1lICYgSUQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtzdHJvbmdTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkQ3VzdG9tZXJcclxuICAgICAgICAgICAgICAgICAgICAgID8gYCR7c2VsZWN0ZWRDdXN0b21lci5uYW1lfSAoIyR7c2VsZWN0ZWRDdXN0b21lci5pZH0pYFxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBcIi1cIn1cclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtjdXN0b21lclJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PkVtYWlsPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17c3Ryb25nU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZEN1c3RvbWVyPy5lbWFpbCB8fCBcIi1cIn1cclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtjdXN0b21lclJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PlBob25lIE51bWJlcjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0cm9uZ1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRDdXN0b21lcj8ucGhvbmUgfHxcclxuICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ3VzdG9tZXI/Lm1vYmlsZSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgXCJOb3QgYXZhaWxhYmxlXCJ9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5PcmRlciBIaXN0b3J5PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17c3Ryb25nU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtjdXN0b21lck9yZGVyQ291bnR9IHByZXZpb3VzIG9yZGVyc1xyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlBheW1lbnQgJiBCaWxsaW5nPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Z3JpZDJTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+UGF5bWVudCBNZXRob2Q8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInBheW1lbnRNZXRob2RcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5wYXltZW50TWV0aG9kfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAge3BheW1lbnRPcHRpb25zLm1hcCgoaXRlbSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2l0ZW19IHZhbHVlPXtpdGVtfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW19XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+UGF5bWVudCBTdGF0dXM8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInBheW1lbnRTdGF0dXNcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5wYXltZW50U3RhdHVzfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBlbmRpbmdcIj5QZW5kaW5nPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBhaWRcIj5QYWlkPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMCB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlRyYW5zYWN0aW9uIElEPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICBuYW1lPVwidHJhbnNhY3Rpb25JZFwiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS50cmFuc2FjdGlvbklkfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZS5nLiBUWE4tMjAyNi0wMDAxMjRcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGFja1N0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICBnYXA6IFwiOHB4XCIsXHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxoMiBzdHlsZT17eyAuLi5zZWN0aW9uVGl0bGVTdHlsZSwgbWFyZ2luQm90dG9tOiAwIH19PlxyXG4gICAgICAgICAgICAgICAgICBQcm9kdWN0IExpbmUgSXRlbXMgKFJlcXVpcmVkKVxyXG4gICAgICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2FkZExpbmVJdGVtfVxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17YWRkQnV0dG9uU3R5bGV9XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICsgQWRkIEl0ZW1cclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTIgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ2FwOiBcIjEwcHhcIiB9fT5cclxuICAgICAgICAgICAgICAgIHtsaW5lSXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZFByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKFxyXG4gICAgICAgICAgICAgICAgICAgIChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhpdGVtLnByb2R1Y3RJZCksXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1Ub3RhbCA9XHJcbiAgICAgICAgICAgICAgICAgICAgdG9OdW1iZXIoaXRlbS5xdWFudGl0eSkgKiB0b051bWJlcihpdGVtLnVuaXRQcmljZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtgbGluZS1pdGVtLSR7aW5kZXh9YH0gc3R5bGU9e2xpbmVJdGVtUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17bGluZUl0ZW1Ub3BTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlByb2R1Y3Q8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnByb2R1Y3RJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxpbmVJdGVtQ2hhbmdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicHJvZHVjdElkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjdCBwcm9kdWN0PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdHMubWFwKChwcm9kdWN0KSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtwcm9kdWN0LmlkfSB2YWx1ZT17cHJvZHVjdC5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3Byb2R1Y3QubmFtZX0gKFNLVToge3Byb2R1Y3Quc2t1fSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3JlbW92ZUJ1dHRvblN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHJlbW92ZUxpbmVJdGVtKGluZGV4KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlbW92ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Byb2R1Y3RQcmV2aWV3U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRQcm9kdWN0Py5pbWFnZVVybCA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM9e3NlbGVjdGVkUHJvZHVjdC5pbWFnZVVybH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdD17c2VsZWN0ZWRQcm9kdWN0Lm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmltYWdlU3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCIzcHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogXCIxNHB4XCIsIGNvbG9yOiBcIiNmOGZhZmNcIiB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZFByb2R1Y3Q/Lm5hbWUgfHwgXCJTZWxlY3QgYSBwcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IFwiMTJweFwiLCBjb2xvcjogXCIjOTRhM2I4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTS1UvSUQ6e1wiIFwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGAke3NlbGVjdGVkUHJvZHVjdC5za3V9IC8gIyR7c2VsZWN0ZWRQcm9kdWN0LmlkfWBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIi1cIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Z3JpZDJTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlF1YW50aXR5PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluPVwiMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aXRlbS5xdWFudGl0eX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxpbmVJdGVtQ2hhbmdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicXVhbnRpdHlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQudmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+VW5pdCBQcmljZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2l0ZW0udW5pdFByaWNlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTGluZUl0ZW1DaGFuZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1bml0UHJpY2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQudmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAuLi50b3RhbHNSb3dTdHlsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdCb3R0b206IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5MaW5lIFRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGNvbG9yOiBcIiNmOGZhZmNcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0TW9uZXkoaXRlbVRvdGFsKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+U2hpcHBpbmcgJiBUcmFja2luZzwvaDI+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+U2hpcHBpbmcgQWRkcmVzczwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWFcclxuICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nQWRkcmVzc1wiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3N9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLmlucHV0U3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWluSGVpZ2h0OiBcIjg2cHhcIixcclxuICAgICAgICAgICAgICAgICAgICByZXNpemU6IFwidmVydGljYWxcIixcclxuICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJIb3VzZSBudW1iZXIsIHN0cmVldCwgY2l0eSwgcG9zdGFsIGNvZGVcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIHttYXBzSHJlZiA/IChcclxuICAgICAgICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgICAgICBocmVmPXttYXBzSHJlZn1cclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXttYXBMaW5rU3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICBPcGVuIG9uIEdvb2dsZSBNYXBzXHJcbiAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICkgOiBudWxsfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Z3JpZDJTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+U2hpcHBpbmcgTWV0aG9kPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJzaGlwcGluZ01ldGhvZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnNoaXBwaW5nTWV0aG9kfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAge3NoaXBwaW5nTWV0aG9kcy5tYXAoKGl0ZW0pID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtpdGVtfSB2YWx1ZT17aXRlbX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+VHJhY2tpbmcgTnVtYmVyPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInRyYWNraW5nTnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudHJhY2tpbmdOdW1iZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJUUkstWFhYWFhYXCJcclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+T3JkZXIgU3VtbWFyeSAvIFRvdGFsczwvaDI+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIEZlZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcclxuICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcclxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2hpcHBpbmdGZWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5zaGlwcGluZ0ZlZX1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlRheCAvIFZBVDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcclxuICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcclxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwidGF4XCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudGF4fVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMCB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PkRpc2NvdW50IC8gQ291cG9uPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxyXG4gICAgICAgICAgICAgICAgICBtaW49XCIwXCJcclxuICAgICAgICAgICAgICAgICAgbmFtZT1cImRpc2NvdW50XCJcclxuICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLmRpc2NvdW50fVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTIgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxzUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PlN1YnRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkobGluZVRvdGFscy5zdWJ0b3RhbCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxzUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PlNoaXBwaW5nIEZlZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGxpbmVUb3RhbHMuc2hpcHBpbmdGZWUpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5UYXggLyBWQVQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leShsaW5lVG90YWxzLnRheCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxzUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PkRpc2NvdW50PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHN0cm9uZz4tIHtmb3JtYXRNb25leShsaW5lVG90YWxzLmRpc2NvdW50KX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuPkdyYW5kIFRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e2Zvcm1hdE1vbmV5KGxpbmVUb3RhbHMuZ3JhbmRUb3RhbCl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IC4uLmNhcmRTdHlsZSwgcGFkZGluZ1RvcDogXCIxNHB4XCIgfX0+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXthY3Rpb25CYXJTdHlsZX0+XHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICBzdHlsZT17YWN0aW9uQnV0dG9uU3R5bGUoZmFsc2UpfVxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHdpbmRvdy5oaXN0b3J5LmJhY2soKX1cclxuICAgICAgICAgICAgICBkaXNhYmxlZD17c3VibWl0dGluZ31cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIENhbmNlbFxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIlxyXG4gICAgICAgICAgICAgIHN0eWxlPXthY3Rpb25CdXR0b25TdHlsZSh0cnVlKX1cclxuICAgICAgICAgICAgICBkaXNhYmxlZD17c3VibWl0dGluZ31cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIHtzdWJtaXR0aW5nID8gXCJDcmVhdGluZyBPcmRlci4uLlwiIDogXCJDcmVhdGUgT3JkZXJcIn1cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9mb3JtPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9yZGVyQ3JlYXRlO1xyXG4iLCJcclxuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHBhZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG4gIGNvbG9yOiBcIiNlMmU4ZjBcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMThweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIpXCIsXHJcbiAgYmFja2dyb3VuZDpcclxuICAgIFwibGluZWFyLWdyYWRpZW50KDE1NWRlZywgcmdiYSgxMCwgMjMsIDQ4LCAwLjk0KSAwJSwgcmdiYSg4LCAxOCwgMzgsIDAuOTQpIDEwMCUpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTRweCAzMHB4IHJnYmEoMiwgNiwgMjMsIDAuMilcIixcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGhlYWRlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBoZWFkaW5nU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBmb250U2l6ZTogXCIzNHB4XCIsXHJcbiAgbGluZUhlaWdodDogMS4xLFxyXG59O1xyXG5cclxuY29uc3Qgc3ViVGV4dFN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgbWFyZ2luVG9wOiBcIjRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IChzdGF0dXMpID0+IHtcclxuICBjb25zdCB2YWwgPSBTdHJpbmcoc3RhdHVzIHx8IFwicGVuZGluZ1wiKS50b0xvd2VyQ2FzZSgpO1xyXG4gIGNvbnN0IHN0eWxlQnlTdGF0dXMgPSB7XHJcbiAgICBwZW5kaW5nOiB7IGJnOiBcIiNmZWYzYzdcIiwgZmc6IFwiIzdjMmQxMlwiIH0sXHJcbiAgICBwYWlkOiB7IGJnOiBcIiNiYmY3ZDBcIiwgZmc6IFwiIzE0NTMyZFwiIH0sXHJcbiAgICBwcm9jZXNzaW5nOiB7IGJnOiBcIiNiZmRiZmVcIiwgZmc6IFwiIzFlM2E4YVwiIH0sXHJcbiAgICBzaGlwcGVkOiB7IGJnOiBcIiNkZGQ2ZmVcIiwgZmc6IFwiIzRjMWQ5NVwiIH0sXHJcbiAgICBjb21wbGV0ZWQ6IHsgYmc6IFwiI2E3ZjNkMFwiLCBmZzogXCIjMDY0ZTNiXCIgfSxcclxuICAgIGNhbmNlbGxlZDogeyBiZzogXCIjZmVjYWNhXCIsIGZnOiBcIiM3ZjFkMWRcIiB9LFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNlbGVjdGVkID0gc3R5bGVCeVN0YXR1c1t2YWxdIHx8IHN0eWxlQnlTdGF0dXMucGVuZGluZztcclxuICByZXR1cm4ge1xyXG4gICAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gICAgcGFkZGluZzogXCI2cHggMTJweFwiLFxyXG4gICAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxyXG4gICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICAgIGJhY2tncm91bmQ6IHNlbGVjdGVkLmJnLFxyXG4gICAgY29sb3I6IHNlbGVjdGVkLmZnLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uVGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiMCAwIDEycHggMFwiLFxyXG4gIGNvbG9yOiBcIiNmNWRmOTBcIixcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMWVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxufTtcclxuXHJcbmNvbnN0IGdyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgzMDBweCwgMWZyKSBtaW5tYXgoMzIwcHgsIDFmcilcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0dyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI4cHhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0YWJsZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBsaW5lSXRlbVN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgcGFkZGluZzogXCIxMHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNDQpXCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCI2MHB4IDFmciBhdXRvXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2MHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjYwcHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG59O1xyXG5cclxuY29uc3QgdG90YWxCb3hTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0b3RhbFJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI3cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGdyYW5kU3R5bGUgPSB7XHJcbiAgLi4udG90YWxSb3dTdHlsZSxcclxuICBib3JkZXJCb3R0b206IFwibm9uZVwiLFxyXG4gIHBhZGRpbmdUb3A6IFwiNnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGZvbnRTaXplOiBcIjE4cHhcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBlbXB0eVN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggZGFzaGVkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdE1vbmV5ID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgbiA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gYFJzLiAke24udG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSl9YDtcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUpID0+IHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gXCItXCI7XHJcbiAgfVxyXG5cclxuICBjb25zdCBkdCA9IG5ldyBEYXRlKHZhbHVlKTtcclxuICBpZiAoTnVtYmVyLmlzTmFOKGR0LmdldFRpbWUoKSkpIHtcclxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGR0LnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgZGF0ZVN0eWxlOiBcIm1lZGl1bVwiLFxyXG4gICAgdGltZVN0eWxlOiBcInNob3J0XCIsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBPcmRlclNob3cgPSAoeyByZWNvcmQgfSkgPT4ge1xyXG4gIGNvbnN0IFtkZXRhaWxzLCBzZXREZXRhaWxzXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIGNvbnN0IG9yZGVySWQgPSByZWNvcmQ/LnBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZDtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghb3JkZXJJZCkge1xyXG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgc2V0RXJyb3IoXCJPcmRlciBpZCBub3QgZm91bmRcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsb2FkRGV0YWlscyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBzZXRFcnJvcihcIlwiKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9jb250ZXh0L29yZGVycy8ke2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcob3JkZXJJZCkpfS9kZXRhaWxzYCxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZD8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGRldGFpbHNcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXREZXRhaWxzKHBheWxvYWQpO1xyXG4gICAgICB9IGNhdGNoIChmZXRjaEVycm9yKSB7XHJcbiAgICAgICAgc2V0RXJyb3IoZmV0Y2hFcnJvcj8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGRldGFpbHNcIik7XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbG9hZERldGFpbHMoKTtcclxuICB9LCBbb3JkZXJJZF0pO1xyXG5cclxuICBjb25zdCB0b3RhbHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IHN1YnRvdGFsID0gTnVtYmVyKGRldGFpbHM/LnN1YnRvdGFsIHx8IDApO1xyXG4gICAgY29uc3Qgc2hpcHBpbmdGZWUgPSBOdW1iZXIoZGV0YWlscz8uc2hpcHBpbmdGZWUgfHwgMCk7XHJcbiAgICBjb25zdCB0YXggPSBOdW1iZXIoZGV0YWlscz8udGF4IHx8IDApO1xyXG4gICAgY29uc3QgZGlzY291bnQgPSBOdW1iZXIoZGV0YWlscz8uZGlzY291bnQgfHwgMCk7XHJcbiAgICBjb25zdCB0b3RhbEFtb3VudCA9IE51bWJlcihkZXRhaWxzPy50b3RhbEFtb3VudCB8fCAwKTtcclxuXHJcbiAgICByZXR1cm4geyBzdWJ0b3RhbCwgc2hpcHBpbmdGZWUsIHRheCwgZGlzY291bnQsIHRvdGFsQW1vdW50IH07XHJcbiAgfSwgW2RldGFpbHNdKTtcclxuXHJcbiAgaWYgKGxvYWRpbmcpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5Mb2FkaW5nIG9yZGVyIGRldGFpbHMuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT57ZXJyb3J9PC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKCFkZXRhaWxzKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+T3JkZXIgZGV0YWlscyBub3QgYXZhaWxhYmxlLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+e2BAbWVkaWEgKG1heC13aWR0aDogMTA0MHB4KSB7IC5jaGFuZ2U4LW9yZGVyLXNob3ctZ3JpZCB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7IH0gfWB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17aGVhZGVyU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGgxIHN0eWxlPXtoZWFkaW5nU3R5bGV9Pk9yZGVyICN7ZGV0YWlscy5pZH08L2gxPlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdWJUZXh0U3R5bGV9PlxyXG4gICAgICAgICAgICAgIENyZWF0ZWQge2Zvcm1hdERhdGUoZGV0YWlscy5jcmVhdGVkQXQpfSB8IFVwZGF0ZWR7XCIgXCJ9XHJcbiAgICAgICAgICAgICAge2Zvcm1hdERhdGUoZGV0YWlscy51cGRhdGVkQXQpfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9e2JhZGdlU3R5bGUoZGV0YWlscy5zdGF0dXMpfT5cclxuICAgICAgICAgICAge2RldGFpbHMuc3RhdHVzIHx8IFwicGVuZGluZ1wifVxyXG4gICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1zaG93LWdyaWRcIiBzdHlsZT17Z3JpZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+Q3VzdG9tZXIgJiBTaGlwcGluZzwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+Q3VzdG9tZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8udXNlcj8ubmFtZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkVtYWlsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnVzZXI/LmVtYWlsIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UGF5bWVudCBNZXRob2Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8ucGF5bWVudE1ldGhvZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlBheW1lbnQgU3RhdHVzPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnBheW1lbnRTdGF0dXMgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5UcmFuc2FjdGlvbiBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy50cmFuc2FjdGlvbklkIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgTWV0aG9kPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnNoaXBwaW5nTWV0aG9kIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VHJhY2tpbmcgTnVtYmVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnRyYWNraW5nTnVtYmVyIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiBcIjEzcHhcIiwgY29sb3I6IFwiI2NiZDVlMVwiLCBsaW5lSGVpZ2h0OiAxLjYgfX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiLCBtYXJnaW5Cb3R0b206IFwiNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICBTaGlwcGluZyBBZGRyZXNzXHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIgfX0+XHJcbiAgICAgICAgICAgICAgICB7ZGV0YWlscz8uc2hpcHBpbmdBZGRyZXNzIHx8IFwiLVwifVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5PcmRlciBTdW1tYXJ5IC8gVG90YWxzPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsQm94U3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U3VidG90YWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkodG90YWxzLnN1YnRvdGFsKX08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5TaGlwcGluZyBGZWU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkodG90YWxzLnNoaXBwaW5nRmVlKX08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5UYXggLyBWQVQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkodG90YWxzLnRheCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+RGlzY291bnQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz4tIHtmb3JtYXRNb25leSh0b3RhbHMuZGlzY291bnQpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Z3JhbmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4+R3JhbmQgVG90YWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4+e2Zvcm1hdE1vbmV5KHRvdGFscy50b3RhbEFtb3VudCl9PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UHJvZHVjdCBMaW5lIEl0ZW1zPC9oMj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt0YWJsZVN0eWxlfT5cclxuICAgICAgICAgIHsoZGV0YWlscz8uaXRlbXMgfHwgW10pLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+Tm8gbGluZSBpdGVtcyBpbiB0aGlzIG9yZGVyLjwvZGl2PlxyXG4gICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgKGRldGFpbHMuaXRlbXMgfHwgW10pLm1hcCgoaXRlbSkgPT4gKFxyXG4gICAgICAgICAgICAgIDxkaXYga2V5PXtpdGVtLmlkfSBzdHlsZT17bGluZUl0ZW1TdHlsZX0+XHJcbiAgICAgICAgICAgICAgICB7aXRlbT8ucHJvZHVjdD8uaW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICAgICAgICBzcmM9e2l0ZW0ucHJvZHVjdC5pbWFnZVVybH1cclxuICAgICAgICAgICAgICAgICAgICBhbHQ9e2l0ZW0/LnByb2R1Y3Q/Lm5hbWUgfHwgXCJQcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgIC4uLmltYWdlU3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBcIjExcHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgTm8gaW1hZ2VcclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCI0cHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIsIGZvbnRTaXplOiBcIjE0cHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICB7aXRlbT8ucHJvZHVjdD8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgU0tVOiB7aXRlbT8ucHJvZHVjdD8uc2t1IHx8IFwiLVwifSB8IFByb2R1Y3QgSUQ6ICNcclxuICAgICAgICAgICAgICAgICAgICB7aXRlbT8ucHJvZHVjdElkfVxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiNjYmQ1ZTFcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIFF0eToge2l0ZW0ucXVhbnRpdHl9IHgge2Zvcm1hdE1vbmV5KGl0ZW0udW5pdFByaWNlKX1cclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIsIGZvbnRTaXplOiBcIjE1cHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAge2Zvcm1hdE1vbmV5KGl0ZW0udG90YWxQcmljZSl9XHJcbiAgICAgICAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgICl9XHJcblxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlclNob3c7XHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgcGFnZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbiAgY29sb3I6IFwiI2UyZThmMFwiLFxyXG59O1xyXG5cclxuY29uc3QgY2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxOHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMilcIixcclxuICBiYWNrZ3JvdW5kOlxyXG4gICAgXCJsaW5lYXItZ3JhZGllbnQoMTU1ZGVnLCByZ2JhKDEwLCAyMywgNDgsIDAuOTQpIDAlLCByZ2JhKDgsIDE4LCAzOCwgMC45NCkgMTAwJSlcIixcclxuICBib3hTaGFkb3c6IFwiMCAxNHB4IDMwcHggcmdiYSgyLCA2LCAyMywgMC4yKVwiLFxyXG4gIHBhZGRpbmc6IFwiMThweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaGVhZGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IHRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcIjM0cHhcIixcclxuICBsaW5lSGVpZ2h0OiAxLjEsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3Qgc3VidGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiNnB4IDAgMCAwXCIsXHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGJhZGdlU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICBwYWRkaW5nOiBcIjZweCAxMnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgY29sb3I6IFwiIzE0NTMyZFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2JiZjdkMFwiLFxyXG59O1xyXG5cclxuY29uc3QgZ3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwibWlubWF4KDMwMHB4LCAwLjk1ZnIpIG1pbm1heCgzMjBweCwgMS4wNWZyKVwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uVGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiMCAwIDEycHggMFwiLFxyXG4gIGNvbG9yOiBcIiNmNWRmOTBcIixcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMWVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9HcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb1Jvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiOHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjI4MHB4XCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE0cHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yMilcIixcclxufTtcclxuXHJcbmNvbnN0IGxpbmVJdGVtU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCI4NHB4IDFmciBhdXRvXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIHBhZGRpbmc6IFwiMTJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMilcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTUsIDIzLCA0MiwgMC40NClcIixcclxufTtcclxuXHJcbmNvbnN0IGVtcHR5SW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI4NHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjg0cHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxufTtcclxuXHJcbmNvbnN0IHRvdGFsUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjdweFwiLFxyXG59O1xyXG5cclxuY29uc3QgZ3JhbmRTdHlsZSA9IHtcclxuICAuLi50b3RhbFJvd1N0eWxlLFxyXG4gIGJvcmRlckJvdHRvbTogXCJub25lXCIsXHJcbiAgcGFkZGluZ1RvcDogXCI2cHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgZm9udFNpemU6IFwiMThweFwiLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IGVtcHR5U3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgcGFkZGluZzogXCIxNHB4XCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0TW9uZXkgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBuID0gTnVtYmVyKHZhbHVlIHx8IDApO1xyXG4gIHJldHVybiBgUnMuICR7bi50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiBcIi1cIjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGR0ID0gbmV3IERhdGUodmFsdWUpO1xyXG4gIGlmIChOdW1iZXIuaXNOYU4oZHQuZ2V0VGltZSgpKSkge1xyXG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZHQudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBkYXRlU3R5bGU6IFwibWVkaXVtXCIsXHJcbiAgICB0aW1lU3R5bGU6IFwic2hvcnRcIixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IE9yZGVySXRlbVNob3cgPSAoeyByZWNvcmQgfSkgPT4ge1xyXG4gIGNvbnN0IFtkZXRhaWxzLCBzZXREZXRhaWxzXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIGNvbnN0IG9yZGVySXRlbUlkID0gcmVjb3JkPy5wYXJhbXM/LmlkIHx8IHJlY29yZD8uaWQ7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoIW9yZGVySXRlbUlkKSB7XHJcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICBzZXRFcnJvcihcIk9yZGVyIGl0ZW0gaWQgbm90IGZvdW5kXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbG9hZERldGFpbHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgc2V0RXJyb3IoXCJcIik7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgICAgIGAvYWRtaW4vY29udGV4dC9vcmRlci1pdGVtcy8ke2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcob3JkZXJJdGVtSWQpKX0vZGV0YWlsc2AsXHJcbiAgICAgICAgICB7IGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgcGF5bG9hZD8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGl0ZW0gZGV0YWlsc1wiLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldERldGFpbHMocGF5bG9hZCk7XHJcbiAgICAgIH0gY2F0Y2ggKGZldGNoRXJyb3IpIHtcclxuICAgICAgICBzZXRFcnJvcihmZXRjaEVycm9yPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgb3JkZXIgaXRlbSBkZXRhaWxzXCIpO1xyXG4gICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWREZXRhaWxzKCk7XHJcbiAgfSwgW29yZGVySXRlbUlkXSk7XHJcblxyXG4gIGNvbnN0IGNhbGN1bGF0ZWRUb3RhbCA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgcmV0dXJuIE51bWJlcihkZXRhaWxzPy50b3RhbFByaWNlIHx8IDApO1xyXG4gIH0sIFtkZXRhaWxzXSk7XHJcblxyXG4gIGlmIChsb2FkaW5nKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+TG9hZGluZyBvcmRlciBpdGVtIGRldGFpbHMuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT57ZXJyb3J9PC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKCFkZXRhaWxzKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+T3JkZXIgaXRlbSBkZXRhaWxzIG5vdCBhdmFpbGFibGUuPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcHJvZHVjdCA9IGRldGFpbHM/LnByb2R1Y3QgfHwge307XHJcbiAgY29uc3Qgb3JkZXIgPSBkZXRhaWxzPy5vcmRlciB8fCB7fTtcclxuICBjb25zdCBjdXN0b21lciA9IG9yZGVyPy51c2VyIHx8IHt9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17cGFnZVN0eWxlfT5cclxuICAgICAgPHN0eWxlPntgQG1lZGlhIChtYXgtd2lkdGg6IDEwNDBweCkgeyAuY2hhbmdlOC1vcmRlci1pdGVtLWdyaWQgeyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50OyB9IH1gfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2hlYWRlclN0eWxlfT5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxoMSBzdHlsZT17dGl0bGVTdHlsZX0+e3Byb2R1Y3Q/Lm5hbWUgfHwgXCJPcmRlciBJdGVtXCJ9PC9oMT5cclxuICAgICAgICAgICAgPHAgc3R5bGU9e3N1YnRpdGxlU3R5bGV9PlxyXG4gICAgICAgICAgICAgIE9yZGVyICN7b3JkZXI/LmlkIHx8IFwiLVwifSDigKIgSXRlbSAje2RldGFpbHM/LmlkIHx8IFwiLVwifVxyXG4gICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxzcGFuIHN0eWxlPXtiYWRnZVN0eWxlfT5BY3RpdmUgSXRlbTwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItaXRlbS1ncmlkXCIgc3R5bGU9e2dyaWRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgIHtwcm9kdWN0Py5pbWFnZVVybCA/IChcclxuICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgIHNyYz17cHJvZHVjdC5pbWFnZVVybH1cclxuICAgICAgICAgICAgICBhbHQ9e3Byb2R1Y3Q/Lm5hbWUgfHwgXCJQcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIC4uLmltYWdlU3R5bGUsXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgTm8gaW1hZ2UgYXZhaWxhYmxlXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTQgfX0gLz5cclxuXHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5Qcm9kdWN0IFNuYXBzaG90PC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5Qcm9kdWN0IE5hbWU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57cHJvZHVjdD8ubmFtZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlNLVTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntwcm9kdWN0Py5za3UgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5Qcm9kdWN0IElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+I3twcm9kdWN0Py5pZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkN1cnJlbnQgU3RvY2s8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57cHJvZHVjdD8uc3RvY2sgPz8gXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5PcmRlciAmIEN1c3RvbWVyPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5DdXN0b21lcjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntjdXN0b21lcj8ubmFtZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkVtYWlsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2N1c3RvbWVyPy5lbWFpbCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19Pk9yZGVyIElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+I3tvcmRlcj8uaWQgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5PcmRlciBTdGF0dXM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57b3JkZXI/LnN0YXR1cyB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlBheW1lbnQgTWV0aG9kPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e29yZGVyPy5wYXltZW50TWV0aG9kIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgTWV0aG9kPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e29yZGVyPy5zaGlwcGluZ01ldGhvZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlRyYWNraW5nIE51bWJlcjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntvcmRlcj8udHJhY2tpbmdOdW1iZXIgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5DcmVhdGVkIEF0PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdERhdGUoZGV0YWlscy5jcmVhdGVkQXQpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UHJpY2luZyBEZXRhaWxzPC9oMj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvR3JpZFN0eWxlfT5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5RdWFudGl0eTwvc3Bhbj5cclxuICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscy5xdWFudGl0eX08L3N0cm9uZz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlVuaXQgUHJpY2U8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGRldGFpbHMudW5pdFByaWNlKX08L3N0cm9uZz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkxpbmUgVG90YWw8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGNhbGN1bGF0ZWRUb3RhbCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlF1aWNrIFN1bW1hcnk8L2gyPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2xpbmVJdGVtU3R5bGV9PlxyXG4gICAgICAgICAge3Byb2R1Y3Q/LmltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgc3JjPXtwcm9kdWN0LmltYWdlVXJsfVxyXG4gICAgICAgICAgICAgIGFsdD17cHJvZHVjdD8ubmFtZSB8fCBcIlByb2R1Y3RcIn1cclxuICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiODRweFwiLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjg0cHhcIixcclxuICAgICAgICAgICAgICAgIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17ZW1wdHlJbWFnZVN0eWxlfT5ObyBpbWFnZTwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCI0cHhcIiB9fT5cclxuICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIsIGZvbnRTaXplOiBcIjE2cHhcIiB9fT5cclxuICAgICAgICAgICAgICB7cHJvZHVjdD8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwifVxyXG4gICAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgU0tVOiB7cHJvZHVjdD8uc2t1IHx8IFwiLVwifVxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiNjYmQ1ZTFcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgIFF0eSB7ZGV0YWlscy5xdWFudGl0eX0geCB7Zm9ybWF0TW9uZXkoZGV0YWlscy51bml0UHJpY2UpfVxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNnB4XCIgfX0+XHJcbiAgICAgICAgICAgIHtmb3JtYXRNb25leShjYWxjdWxhdGVkVG90YWwpfVxyXG4gICAgICAgICAgPC9zdHJvbmc+XHJcblxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlckl0ZW1TaG93O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgY2VsbFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBtaW5IZWlnaHQ6IFwiNTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2NHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjQycHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZsZXhTaHJpbms6IDAsXHJcbn07XHJcblxyXG5jb25zdCBmYWxsYmFja1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjY0cHhcIixcclxuICBoZWlnaHQ6IFwiNDJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjYpXCIsXHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgY29sb3I6IFwiIzY0NzQ4YlwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZsZXhTaHJpbms6IDAsXHJcbn07XHJcblxyXG5jb25zdCB0ZXh0U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcclxuICBnYXA6IFwiMnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0SW1hZ2UgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCBpbWFnZVVybCA9IHByb3BzPy5yZWNvcmQ/LnBhcmFtcz8uW3Byb3BzPy5wcm9wZXJ0eT8ucGF0aF07XHJcbiAgY29uc3QgW2hhc0Vycm9yLCBzZXRIYXNFcnJvcl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBzZXRIYXNFcnJvcihmYWxzZSk7XHJcbiAgfSwgW2ltYWdlVXJsXSk7XHJcblxyXG4gIGlmICghaW1hZ2VVcmwpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtmYWxsYmFja1N0eWxlfT5ObyBpbWFnZTwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChoYXNFcnJvcikge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBzdHlsZT17Y2VsbFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtmYWxsYmFja1N0eWxlfT5JbnZhbGlkPC9kaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IFwiIzBmMTcyYVwiIH19PkltYWdlIFVSTDwvc3Bhbj5cclxuICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgIGhyZWY9e2ltYWdlVXJsfVxyXG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICBjb2xvcjogXCIjMjU2M2ViXCIsXHJcbiAgICAgICAgICAgICAgdGV4dERlY29yYXRpb246IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgT3BlbiBsaW5rXHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtjZWxsU3R5bGV9PlxyXG4gICAgICA8aW1nXHJcbiAgICAgICAgc3JjPXtpbWFnZVVybH1cclxuICAgICAgICBhbHQ9XCJQcm9kdWN0XCJcclxuICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX1cclxuICAgICAgICBvbkVycm9yPXsoKSA9PiBzZXRIYXNFcnJvcih0cnVlKX1cclxuICAgICAgLz5cclxuICAgICAgPGRpdiBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBcIiMwZjE3MmFcIiB9fT5QcmV2aWV3PC9zcGFuPlxyXG4gICAgICAgIDxhXHJcbiAgICAgICAgICBocmVmPXtpbWFnZVVybH1cclxuICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXHJcbiAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiBcIiMyNTYzZWJcIiwgdGV4dERlY29yYXRpb246IFwibm9uZVwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICBPcGVuIGltYWdlXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0SW1hZ2U7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCB3cmFwcGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG59O1xyXG5cclxuY29uc3QgcHJldmlld1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjE0MHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjk2cHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3QgaGludFN0eWxlID0ge1xyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBjb2xvcjogXCIjNjQ3NDhiXCIsXHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0SW1hZ2VVcGxvYWQgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCB7IG9uQ2hhbmdlLCByZWNvcmQgfSA9IHByb3BzO1xyXG4gIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHJlY29yZD8ucGFyYW1zPy5pbWFnZVVybCB8fCBcIlwiO1xyXG4gIGNvbnN0IGN1cnJlbnRQdWJsaWNJZCA9IHJlY29yZD8ucGFyYW1zPy5pbWFnZVB1YmxpY0lkIHx8IFwiXCI7XHJcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoY3VycmVudFZhbHVlKTtcclxuICBjb25zdCBbcHVibGljSWQsIHNldFB1YmxpY0lkXSA9IHVzZVN0YXRlKGN1cnJlbnRQdWJsaWNJZCk7XHJcbiAgY29uc3QgW3VwbG9hZGluZywgc2V0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgc2V0UHJldmlld1VybChjdXJyZW50VmFsdWUpO1xyXG4gICAgc2V0UHVibGljSWQoY3VycmVudFB1YmxpY0lkKTtcclxuICB9LCBbY3VycmVudFZhbHVlLCBjdXJyZW50UHVibGljSWRdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlVXBsb2FkID0gYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF07XHJcblxyXG4gICAgaWYgKCFmaWxlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSk7XHJcbiAgICBzZXRFcnJvcihcIlwiKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXCJpbWFnZVwiLCBmaWxlKTtcclxuXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvYXBpL3VwbG9hZHMvaW1hZ2VcIiwge1xyXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgYm9keTogZm9ybURhdGEsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZC5tZXNzYWdlIHx8IFwiSW1hZ2UgdXBsb2FkIGZhaWxlZFwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdXBsb2FkZWRVcmwgPSBwYXlsb2FkLnVybCB8fCBcIlwiO1xyXG4gICAgICBjb25zdCB1cGxvYWRlZFB1YmxpY0lkID0gcGF5bG9hZC5wdWJsaWNJZCB8fCBcIlwiO1xyXG4gICAgICBzZXRQcmV2aWV3VXJsKHVwbG9hZGVkVXJsKTtcclxuICAgICAgc2V0UHVibGljSWQodXBsb2FkZWRQdWJsaWNJZCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVVybFwiLCB1cGxvYWRlZFVybCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVB1YmxpY0lkXCIsIHVwbG9hZGVkUHVibGljSWQpO1xyXG4gICAgICBvbkNoYW5nZT8uKFwidXBsb2FkSW1hZ2VcIiwgdXBsb2FkZWRVcmwpO1xyXG4gICAgfSBjYXRjaCAodXBsb2FkRXJyb3IpIHtcclxuICAgICAgc2V0RXJyb3IodXBsb2FkRXJyb3IubWVzc2FnZSk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpO1xyXG4gICAgICBldmVudC50YXJnZXQudmFsdWUgPSBcIlwiO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZVJlbW92ZSA9ICgpID0+IHtcclxuICAgIHNldFByZXZpZXdVcmwoXCJcIik7XHJcbiAgICBzZXRQdWJsaWNJZChcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVVybFwiLCBcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVB1YmxpY0lkXCIsIFwiXCIpO1xyXG4gICAgb25DaGFuZ2U/LihcInVwbG9hZEltYWdlXCIsIFwiXCIpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt3cmFwcGVyU3R5bGV9PlxyXG4gICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e2hhbmRsZVVwbG9hZH0gLz5cclxuICAgICAgPGRpdiBzdHlsZT17aGludFN0eWxlfT5cclxuICAgICAgICB7dXBsb2FkaW5nXHJcbiAgICAgICAgICA/IFwiVXBsb2FkaW5nIHRvIENsb3VkaW5hcnkuLi5cIlxyXG4gICAgICAgICAgOiBcIkNob29zZSBhbiBpbWFnZSBmaWxlIHRvIHVwbG9hZFwifVxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHtwcmV2aWV3VXJsID8gKFxyXG4gICAgICAgIDw+XHJcbiAgICAgICAgICA8aW1nIHNyYz17cHJldmlld1VybH0gYWx0PVwiUHJvZHVjdCBwcmV2aWV3XCIgc3R5bGU9e3ByZXZpZXdTdHlsZX0gLz5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVJlbW92ZX1cclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwiNnB4IDEwcHhcIixcclxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IFwiOHB4XCIsXHJcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjZWY0NDQ0XCIsXHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiI2VmNDQ0NFwiLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiI2ZmZlwiLFxyXG4gICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIFJlbW92ZSBpbWFnZVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC8+XHJcbiAgICAgICkgOiBudWxsfVxyXG5cclxuICAgICAge2Vycm9yID8gKFxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgLi4uaGludFN0eWxlLCBjb2xvcjogXCIjZGMyNjI2XCIgfX0+e2Vycm9yfTwvZGl2PlxyXG4gICAgICApIDogbnVsbH1cclxuXHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImltYWdlVXJsXCIgdmFsdWU9e3ByZXZpZXdVcmx9IHJlYWRPbmx5IC8+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImltYWdlUHVibGljSWRcIiB2YWx1ZT17cHVibGljSWR9IHJlYWRPbmx5IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdEltYWdlVXBsb2FkO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgQ2F0ZWdvcnlTaG93ID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgeyByZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wcztcclxuICBjb25zdCBbY2F0ZWdvcnksIHNldENhdGVnb3J5XSA9IHVzZVN0YXRlKG51bGwpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHJlY29yZCAmJiByZWNvcmQucGFyYW1zKSB7XHJcbiAgICAgIHNldENhdGVnb3J5KHJlY29yZC5wYXJhbXMpO1xyXG4gICAgfVxyXG4gIH0sIFtyZWNvcmRdKTtcclxuXHJcbiAgaWYgKCFjYXRlZ29yeSkge1xyXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1sb2FkaW5nXCI+TG9hZGluZy4uLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGZvcm1hdERhdGUgPSAoZGF0ZSkgPT4ge1xyXG4gICAgaWYgKCFkYXRlKSByZXR1cm4gXCLigJRcIjtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlKS50b0xvY2FsZURhdGVTdHJpbmcoXCJlbi1VU1wiLCB7XHJcbiAgICAgICAgeWVhcjogXCJudW1lcmljXCIsXHJcbiAgICAgICAgbW9udGg6IFwibG9uZ1wiLFxyXG4gICAgICAgIGRheTogXCJudW1lcmljXCIsXHJcbiAgICAgICAgaG91cjogXCIyLWRpZ2l0XCIsXHJcbiAgICAgICAgbWludXRlOiBcIjItZGlnaXRcIixcclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgcmV0dXJuIFwi4oCUXCI7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1jb250YWluZXJcIj5cclxuICAgICAgPHN0eWxlPntgXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctY29udGFpbmVyIHtcclxuICAgICAgICAgIC0tYmctMTogdmFyKC0tY2hhbmdlOC1iZy0xLCAjMDUwOTE0KTtcclxuICAgICAgICAgIC0tZ29sZDogdmFyKC0tY2hhbmdlOC1nb2xkLCAjZTJiZjY2KTtcclxuICAgICAgICAgIC0tdGV4dC1tYWluOiB2YXIoLS1jaGFuZ2U4LXRleHQtbWFpbiwgI2Y4ZmFmYyk7XHJcbiAgICAgICAgICAtLXRleHQtbXV0ZWQ6IHZhcigtLWNoYW5nZTgtdGV4dC1tdXRlZCwgIzlhYThjMSk7XHJcbiAgICAgICAgICAtLWxpbmU6IHZhcigtLWNoYW5nZTgtbGluZSwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjIyKSk7XHJcbiAgICAgICAgICAtLWNhcmQtYmc6IHZhcigtLWNoYW5nZTgtY2FyZC1iZywgbGluZWFyLWdyYWRpZW50KDE2MGRlZywgcmdiYSgyMSwgMzQsIDY2LCAwLjk2KSAwJSwgcmdiYSgxMCwgMTgsIDM2LCAwLjk2KSAxMDAlKSk7XHJcbiAgICAgICAgICAtLXNoYWRvdzogdmFyKC0tY2hhbmdlOC1zaGFkb3csIDAgOHB4IDI2cHggcmdiYSgwLCAwLCAwLCAwLjMpKTtcclxuXHJcbiAgICAgICAgICBwYWRkaW5nOiAzMnB4O1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbWFpbik7XHJcbiAgICAgICAgICBmb250LWZhbWlseTogXCJQb3BwaW5zXCIsIFwiU2Vnb2UgVUlcIiwgc2Fucy1zZXJpZjtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMjBkZWcsIHZhcigtLWJnLTEpIDAlLCByZ2JhKDExLCAyNiwgNTYsIDAuOCkgNTAlLCB2YXIoLS1iZy0xKSAxMDAlKTtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jYXRlZ29yeS1zaG93LWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtYmctMTogI2YwZjZmZjtcclxuICAgICAgICAgIC0tY2hhbmdlOC1nb2xkOiAjYzA4YjBmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXRleHQtbWFpbjogIzBmMTcyYTtcclxuICAgICAgICAgIC0tY2hhbmdlOC10ZXh0LW11dGVkOiAjNDc1NTY5O1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWxpbmU6IHJnYmEoMTUsIDIzLCA0MiwgMC4wOCk7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtY2FyZC1iZzogI2ZmZmZmZjtcclxuICAgICAgICAgIC0tY2hhbmdlOC1zaGFkb3c6IDAgNHB4IDIwcHggcmdiYSgxNSwgMjMsIDQyLCAwLjA2KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWlubmVyIHtcclxuICAgICAgICAgIG1heC13aWR0aDogOTAwcHg7XHJcbiAgICAgICAgICBtYXJnaW46IDAgYXV0bztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWhlYWRlciB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAzMnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3cta2lja2VyIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMzZlbTtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEycHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy10aXRsZSB7XHJcbiAgICAgICAgICBmb250LXNpemU6IGNsYW1wKDMycHgsIDV2dywgNDhweCk7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDEuMTtcclxuICAgICAgICAgIG1hcmdpbjogMCAwIDhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXN0YXR1cyB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBnYXA6IDhweDtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDEycHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiA2cHggMTJweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjEyZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1zdGF0dXMuYWN0aXZlIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMzQsIDE5NywgOTQsIDAuMik7XHJcbiAgICAgICAgICBjb2xvcjogIzIyYzU1ZTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMzQsIDE5NywgOTQsIDAuNCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1zdGF0dXMuaW5hY3RpdmUge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyMzksIDY4LCA2OCwgMC4yKTtcclxuICAgICAgICAgIGNvbG9yOiAjZWY0NDQ0O1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyMzksIDY4LCA2OCwgMC40KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWNhcmQge1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAyNHB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMzJweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWNhcmQtYmcpO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogdmFyKC0tc2hhZG93KTtcclxuICAgICAgICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjRweDtcclxuICAgICAgICAgIGFuaW1hdGlvbjogZmFkZS11cCA1NjBtcyBlYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctc2VjdGlvbi10aXRsZSB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjE4ZW07XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXNlY3Rpb24ge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXNlY3Rpb246bGFzdC1jaGlsZCB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctZmllbGQge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWZpZWxkOmxhc3QtY2hpbGQge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWxhYmVsIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMThlbTtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDhweDtcclxuICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctdmFsdWUge1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbWFpbik7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMS42O1xyXG4gICAgICAgICAgd29yZC1icmVhazogYnJlYWstd29yZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXZhbHVlLmdvbGQge1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLWdvbGQpO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWRlc2NyaXB0aW9uIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4yKTtcclxuICAgICAgICAgIGJvcmRlci1sZWZ0OiAzcHggc29saWQgdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxNnB4IDIwcHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMS43O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jYXRlZ29yeS1zaG93LWRlc2NyaXB0aW9uIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMTUsIDIzLCA0MiwgMC4wNSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1kZXRhaWxzLWdyaWQge1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMjAwcHgsIDFmcikpO1xyXG4gICAgICAgICAgZ2FwOiAyNHB4O1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMTZweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtIHtcclxuICAgICAgICAgIHBhZGRpbmc6IDE2cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMSk7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNhdGVnb3J5LXNob3ctZGV0YWlsLWl0ZW0ge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNSwgMjMsIDQyLCAwLjAzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWRpdmlkZXIge1xyXG4gICAgICAgICAgaGVpZ2h0OiAxcHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjI2LCAxOTEsIDEwMiwgMCksIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4yOCksIHJnYmEoMjI2LCAxOTEsIDEwMiwgMCkpO1xyXG4gICAgICAgICAgbWFyZ2luOiAyNHB4IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAa2V5ZnJhbWVzIGZhZGUtdXAge1xyXG4gICAgICAgICAgZnJvbSB7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg4cHgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdG8ge1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNzIwcHgpIHtcclxuICAgICAgICAgIC5jYXRlZ29yeS1zaG93LWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDIwcHggMTZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2F0ZWdvcnktc2hvdy1jYXJkIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMjRweCAyMHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jYXRlZ29yeS1zaG93LWRldGFpbHMtZ3JpZCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgYH08L3N0eWxlPlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWlubmVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWhlYWRlclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWtpY2tlclwiPkNhdGVnb3J5IE92ZXJ2aWV3PC9kaXY+XHJcbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy10aXRsZVwiPntjYXRlZ29yeS5uYW1lIHx8IFwi4oCUXCJ9PC9oMT5cclxuICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgY2F0ZWdvcnktc2hvdy1zdGF0dXMgJHtjYXRlZ29yeS5pc0FjdGl2ZSA/IFwiYWN0aXZlXCIgOiBcImluYWN0aXZlXCJ9YH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPHNwYW4+4pePPC9zcGFuPlxyXG4gICAgICAgICAgICB7Y2F0ZWdvcnkuaXNBY3RpdmUgPyBcIkFjdGl2ZVwiIDogXCJJbmFjdGl2ZVwifVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1jYXJkXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctc2VjdGlvblwiPlxyXG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1zZWN0aW9uLXRpdGxlXCI+RGVzY3JpcHRpb248L2gzPlxyXG4gICAgICAgICAgICB7Y2F0ZWdvcnkuZGVzY3JpcHRpb24gPyAoXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRlc2NyaXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICB7Y2F0ZWdvcnkuZGVzY3JpcHRpb259XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy12YWx1ZVwiXHJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS10ZXh0LW11dGVkKVwiIH19XHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgTm8gZGVzY3JpcHRpb24gcHJvdmlkZWRcclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kaXZpZGVyXCIgLz5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctc2VjdGlvblwiPlxyXG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1zZWN0aW9uLXRpdGxlXCI+RGV0YWlsczwvaDM+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGV0YWlscy1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1sYWJlbFwiPkNhdGVnb3J5IElEPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy12YWx1ZSBnb2xkXCJcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogXCJtb25vc3BhY2VcIiwgZm9udFNpemU6IFwiMTRweFwiIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtjYXRlZ29yeS5pZCB8fCBcIuKAlFwifVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kZXRhaWwtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctbGFiZWxcIj5TbHVnPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy12YWx1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICB7Y2F0ZWdvcnkuc2x1ZyB8fCBcIuKAlFwifVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRpdmlkZXJcIiAvPlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXNlY3Rpb24tdGl0bGVcIj5UaW1lbGluZTwvaDM+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGV0YWlscy1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1sYWJlbFwiPkNyZWF0ZWQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXZhbHVlXCI+XHJcbiAgICAgICAgICAgICAgICAgIHtmb3JtYXREYXRlKGNhdGVnb3J5LmNyZWF0ZWRBdCl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1sYWJlbFwiPkxhc3QgVXBkYXRlZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctdmFsdWVcIj5cclxuICAgICAgICAgICAgICAgICAge2Zvcm1hdERhdGUoY2F0ZWdvcnkudXBkYXRlZEF0KX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDYXRlZ29yeVNob3c7XHJcbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IERhc2hib2FyZCBmcm9tICcuLi9hZG1pbi9kYXNoYm9hcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRhc2hib2FyZCA9IERhc2hib2FyZFxuaW1wb3J0IFJlZ2lzdGVyIGZyb20gJy4uL2FkbWluL3JlZ2lzdGVyJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5SZWdpc3RlciA9IFJlZ2lzdGVyXG5pbXBvcnQgUHJvZHVjdENhcmRzTGlzdCBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LWNhcmRzLWxpc3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RDYXJkc0xpc3QgPSBQcm9kdWN0Q2FyZHNMaXN0XG5pbXBvcnQgUHJvZHVjdFNob3cgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1zaG93J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0U2hvdyA9IFByb2R1Y3RTaG93XG5pbXBvcnQgT3JkZXJDcmVhdGUgZnJvbSAnLi4vYWRtaW4vb3JkZXItY3JlYXRlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlckNyZWF0ZSA9IE9yZGVyQ3JlYXRlXG5pbXBvcnQgT3JkZXJTaG93IGZyb20gJy4uL2FkbWluL29yZGVyLXNob3cnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLk9yZGVyU2hvdyA9IE9yZGVyU2hvd1xuaW1wb3J0IE9yZGVySXRlbVNob3cgZnJvbSAnLi4vYWRtaW4vb3JkZXItaXRlbS1zaG93J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlckl0ZW1TaG93ID0gT3JkZXJJdGVtU2hvd1xuaW1wb3J0IFByb2R1Y3RJbWFnZSBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LWltYWdlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0SW1hZ2UgPSBQcm9kdWN0SW1hZ2VcbmltcG9ydCBQcm9kdWN0SW1hZ2VVcGxvYWQgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS11cGxvYWQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RJbWFnZVVwbG9hZCA9IFByb2R1Y3RJbWFnZVVwbG9hZFxuaW1wb3J0IENhdGVnb3J5U2hvdyBmcm9tICcuLi9hZG1pbi9jYXRlZ29yeS1zaG93J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DYXRlZ29yeVNob3cgPSBDYXRlZ29yeVNob3ciXSwibmFtZXMiOlsiZm9ybWF0Q3VycmVuY3kiLCJ2YWx1ZSIsIk51bWJlciIsInRvTG9jYWxlU3RyaW5nIiwiRGFzaGJvYXJkIiwiZGF0YSIsInNldERhdGEiLCJ1c2VTdGF0ZSIsInVzZXJzIiwiY2F0ZWdvcmllcyIsInByb2R1Y3RzIiwib3JkZXJzIiwicmV2ZW51ZSIsImZlYXR1cmVkR2VtcyIsImNyaXRpY2FsU3RvY2siLCJyZWNlbnRQcm9kdWN0cyIsImNhdGVnb3J5RGlzdHJpYnV0aW9uIiwidXNlRWZmZWN0IiwibG9hZERhc2hib2FyZCIsInJlc3BvbnNlIiwiZmV0Y2giLCJwYXlsb2FkIiwianNvbiIsInRvcENhdGVnb3JpZXMiLCJ1c2VNZW1vIiwiZGlzdHJpYnV0aW9uIiwibWF4IiwiTWF0aCIsIm1hcCIsIml0ZW0iLCJjb3VudCIsIndpZHRoIiwicm91bmQiLCJjb21wbGV0aW9uUmF0ZSIsInRvdGFsIiwiaGVhbHRoeSIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsInN0eWxlIiwibGVuZ3RoIiwiY2F0ZWdvcnkiLCJrZXkiLCJuYW1lIiwibWFyZ2luVG9wIiwicHJvZHVjdCIsImlkIiwiRGF0ZSIsImNyZWF0ZWRBdCIsInRvTG9jYWxlRGF0ZVN0cmluZyIsInByaWNlIiwiZGlzcGxheSIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJnYXAiLCJjb2xvciIsIlJlZ2lzdGVyIiwiZm9ybVN0YXRlIiwic2V0Rm9ybVN0YXRlIiwiZW1haWwiLCJwYXNzd29yZCIsIm1lc3NhZ2UiLCJzZXRNZXNzYWdlIiwidHlwZSIsInRleHQiLCJpc1N1Ym1pdHRpbmciLCJzZXRJc1N1Ym1pdHRpbmciLCJkb2N1bWVudCIsImJvZHkiLCJtYXJnaW4iLCJoYW5kbGVDaGFuZ2UiLCJldmVudCIsImN1cnJlbnQiLCJ0YXJnZXQiLCJoYW5kbGVTdWJtaXQiLCJwcmV2ZW50RGVmYXVsdCIsIm1ldGhvZCIsImhlYWRlcnMiLCJKU09OIiwic3RyaW5naWZ5Iiwib2siLCJFcnJvciIsInNldFRpbWVvdXQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJlcnJvciIsIm9uU3VibWl0IiwiaHRtbEZvciIsInBsYWNlaG9sZGVyIiwib25DaGFuZ2UiLCJyZXF1aXJlZCIsIm1pbkxlbmd0aCIsImRpc2FibGVkIiwiZ3JpZFN0eWxlIiwiY2FyZFN0eWxlIiwiYm9yZGVyUmFkaXVzIiwiYm9yZGVyIiwiYmFja2dyb3VuZCIsIm92ZXJmbG93IiwiYm94U2hhZG93IiwiaW1hZ2VXcmFwU3R5bGUiLCJoZWlnaHQiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJwYWRkaW5nIiwiaW1hZ2VTdHlsZSIsIm9iamVjdEZpdCIsImJvZHlTdHlsZSIsIm1ldGFTdHlsZSIsImZvbnRTaXplIiwiYmFkZ2VTdHlsZSIsImlzQWN0aXZlIiwiZm9udFdlaWdodCIsImxldHRlclNwYWNpbmciLCJsaW5rU3R5bGUiLCJ0ZXh0RGVjb3JhdGlvbiIsImN1cnNvciIsImVtcHR5U3R5bGUiLCJmb3JtYXRQcmljZSIsImFtb3VudCIsImlzRmluaXRlIiwidW5kZWZpbmVkIiwibWluaW11bUZyYWN0aW9uRGlnaXRzIiwibWF4aW11bUZyYWN0aW9uRGlnaXRzIiwiZ2V0UmVjb3JkSWQiLCJyZWNvcmQiLCJwYXJhbXMiLCJwYXJhbSIsImdldFNob3dIcmVmIiwicmVzb3VyY2VJZCIsInJlY29yZEFjdGlvbnMiLCJhY3Rpb25zIiwic2hvd0FjdGlvbiIsImZpbmQiLCJhY3Rpb24iLCJyYXdIcmVmIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiUHJvZHVjdENhcmRzTGlzdCIsInByb3BzIiwiYXBpUmVjb3JkcyIsInNldEFwaVJlY29yZHMiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImxvYWRFcnJvciIsInNldExvYWRFcnJvciIsInJlc291cmNlIiwicHJvcFJlY29yZHMiLCJyZWNvcmRzIiwiaXNNb3VudGVkIiwibG9hZFJlY29yZHMiLCJjcmVkZW50aWFscyIsImNhdGVnb3J5SWQiLCJpbWFnZVVybCIsInN0b2NrIiwiQm9vbGVhbiIsImRldGFpbHNIcmVmIiwib3BlbkRldGFpbHMiLCJhc3NpZ24iLCJzcmMiLCJhbHQiLCJvbkNsaWNrIiwicGFnZVN0eWxlIiwiaGVyb1N0eWxlIiwicGFuZWxTdHlsZSIsIm1pbkhlaWdodCIsImhlcm9Cb2R5U3R5bGUiLCJ0aXRsZVN0eWxlIiwibGluZUhlaWdodCIsInN1YnRpdGxlU3R5bGUiLCJhY3RpdmUiLCJzdGF0c0dyaWRTdHlsZSIsInN0YXRDYXJkU3R5bGUiLCJzdGF0TGFiZWxTdHlsZSIsInRleHRUcmFuc2Zvcm0iLCJtYXJnaW5Cb3R0b20iLCJzdGF0VmFsdWVTdHlsZSIsIndvcmRCcmVhayIsInNlY3Rpb25HcmlkU3R5bGUiLCJzZWN0aW9uVGl0bGVTdHlsZSIsImNvbnRlbnRDYXJkU3R5bGUiLCJpbmZvTGlzdFN0eWxlIiwiaW5mb1Jvd1N0eWxlIiwicGFkZGluZ0JvdHRvbSIsImJvcmRlckJvdHRvbSIsImluZm9MYWJlbFN0eWxlIiwiaW5mb1ZhbHVlU3R5bGUiLCJ0ZXh0QWxpZ24iLCJkZXNjcmlwdGlvblN0eWxlIiwid2hpdGVTcGFjZSIsImJ1dHRvblN0eWxlIiwidHJhbnNpdGlvbiIsImJ1dHRvbkhvdmVyU3R5bGUiLCJ0cmFuc2Zvcm0iLCJmb3JtYXREYXRlIiwiZGF0ZSIsImlzTmFOIiwiZ2V0VGltZSIsIlN0cmluZyIsImRhdGVTdHlsZSIsInRpbWVTdHlsZSIsIlByb2R1Y3RTaG93Iiwic2t1IiwiZGVzY3JpcHRpb24iLCJidXR0b25Ib3ZlcmVkIiwic2V0QnV0dG9uSG92ZXJlZCIsImhhbmRsZU9yZGVyQ2xpY2siLCJwcm9kdWN0SWQiLCJuZXdPcmRlclVybCIsIm9uTW91c2VFbnRlciIsIm9uTW91c2VMZWF2ZSIsInRpdGxlIiwieG1sbnMiLCJ2aWV3Qm94IiwiZmlsbCIsInN0cm9rZSIsInN0cm9rZVdpZHRoIiwic3Ryb2tlTGluZWNhcCIsInN0cm9rZUxpbmVqb2luIiwiY3giLCJjeSIsInIiLCJkIiwidXBkYXRlZEF0IiwiaGVhZGVyU3R5bGUiLCJkZXNjU3R5bGUiLCJsYXlvdXRTdHlsZSIsInN0YWNrU3R5bGUiLCJsYWJlbFN0eWxlIiwiaW5wdXRTdHlsZSIsImZvbnRGYW1pbHkiLCJyb3dTdHlsZSIsImdyaWQyU3R5bGUiLCJjdXN0b21lckluZm9TdHlsZSIsImN1c3RvbWVyUm93U3R5bGUiLCJtdXRlZFN0eWxlIiwic3Ryb25nU3R5bGUiLCJsaW5lSXRlbVJvd1N0eWxlIiwibGluZUl0ZW1Ub3BTdHlsZSIsInByb2R1Y3RQcmV2aWV3U3R5bGUiLCJhZGRCdXR0b25TdHlsZSIsInJlbW92ZUJ1dHRvblN0eWxlIiwidG90YWxzUm93U3R5bGUiLCJ0b3RhbFN0eWxlIiwicGFkZGluZ1RvcCIsImFjdGlvbkJhclN0eWxlIiwiYWN0aW9uQnV0dG9uU3R5bGUiLCJwcmltYXJ5IiwibWFwTGlua1N0eWxlIiwicmVzcG9uc2l2ZUNzcyIsInBheW1lbnRPcHRpb25zIiwic2hpcHBpbmdNZXRob2RzIiwidG9OdW1iZXIiLCJudW0iLCJmb3JtYXRNb25leSIsImNyZWF0ZUVtcHR5SXRlbSIsInF1YW50aXR5IiwidW5pdFByaWNlIiwiT3JkZXJDcmVhdGUiLCJzZXRVc2VycyIsInNldFByb2R1Y3RzIiwib3JkZXJDb3VudEJ5VXNlciIsInNldE9yZGVyQ291bnRCeVVzZXIiLCJzZXNzaW9uVXNlciIsInNldFNlc3Npb25Vc2VyIiwic3VibWl0dGluZyIsInNldFN1Ym1pdHRpbmciLCJmb3JtRGF0YSIsInNldEZvcm1EYXRhIiwidXNlcklkIiwic3RhdHVzIiwicGF5bWVudE1ldGhvZCIsInBheW1lbnRTdGF0dXMiLCJ0cmFuc2FjdGlvbklkIiwic2hpcHBpbmdBZGRyZXNzIiwic2hpcHBpbmdNZXRob2QiLCJ0cmFja2luZ051bWJlciIsInNoaXBwaW5nRmVlIiwidGF4IiwiZGlzY291bnQiLCJsaW5lSXRlbXMiLCJzZXRMaW5lSXRlbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJzZWFyY2giLCJwcmVQcm9kdWN0SWQiLCJnZXQiLCJmZXRjaERhdGEiLCJjb250ZXh0UmVzIiwiY29udGV4dERhdGEiLCJ1c2Vyc0RhdGEiLCJBcnJheSIsImlzQXJyYXkiLCJwcm9kdWN0c0xpc3QiLCJjdXJyZW50VXNlciIsInByZXYiLCJzZWxlY3RlZFByb2R1Y3QiLCJzb21lIiwicCIsInNlbGVjdGVkIiwic2VsZWN0ZWRDdXN0b21lciIsInUiLCJjdXN0b21lck9yZGVyQ291bnQiLCJsaW5lVG90YWxzIiwic3VidG90YWwiLCJyZWR1Y2UiLCJzdW0iLCJncmFuZFRvdGFsIiwiaGFuZGxlRm9ybUNoYW5nZSIsImhhbmRsZUxpbmVJdGVtQ2hhbmdlIiwiaW5kZXgiLCJuZXh0IiwiYWRkTGluZUl0ZW0iLCJyZW1vdmVMaW5lSXRlbSIsImZpbHRlciIsIl8iLCJpIiwibWFwc0hyZWYiLCJ0cmltIiwidmFsaWRJdGVtcyIsImFsZXJ0Iiwib3JkZXJQYXlsb2FkIiwidG9GaXhlZCIsInRvdGFsQW1vdW50Iiwic3VibWl0Rm9ybSIsIkZvcm1EYXRhIiwiYXBwZW5kIiwib3JkZXJSZXMiLCJvcmRlckRhdGEiLCJyb2xlIiwidXNlciIsInBob25lIiwibW9iaWxlIiwiaXRlbVRvdGFsIiwibWluIiwic3RlcCIsInJlc2l6ZSIsInJlbCIsImhpc3RvcnkiLCJiYWNrIiwiaGVhZGluZ1N0eWxlIiwic3ViVGV4dFN0eWxlIiwidmFsIiwidG9Mb3dlckNhc2UiLCJzdHlsZUJ5U3RhdHVzIiwicGVuZGluZyIsImJnIiwiZmciLCJwYWlkIiwicHJvY2Vzc2luZyIsInNoaXBwZWQiLCJjb21wbGV0ZWQiLCJjYW5jZWxsZWQiLCJpbmZvR3JpZFN0eWxlIiwidGFibGVTdHlsZSIsImxpbmVJdGVtU3R5bGUiLCJ0b3RhbEJveFN0eWxlIiwidG90YWxSb3dTdHlsZSIsImdyYW5kU3R5bGUiLCJuIiwiZHQiLCJPcmRlclNob3ciLCJkZXRhaWxzIiwic2V0RGV0YWlscyIsInNldEVycm9yIiwib3JkZXJJZCIsImxvYWREZXRhaWxzIiwiZmV0Y2hFcnJvciIsInRvdGFscyIsIml0ZW1zIiwidG90YWxQcmljZSIsImVtcHR5SW1hZ2VTdHlsZSIsIk9yZGVySXRlbVNob3ciLCJvcmRlckl0ZW1JZCIsImNhbGN1bGF0ZWRUb3RhbCIsIm9yZGVyIiwiY3VzdG9tZXIiLCJjZWxsU3R5bGUiLCJmbGV4U2hyaW5rIiwiZmFsbGJhY2tTdHlsZSIsInRleHRTdHlsZSIsImZsZXhEaXJlY3Rpb24iLCJQcm9kdWN0SW1hZ2UiLCJwcm9wZXJ0eSIsInBhdGgiLCJoYXNFcnJvciIsInNldEhhc0Vycm9yIiwib25FcnJvciIsIndyYXBwZXJTdHlsZSIsInByZXZpZXdTdHlsZSIsImhpbnRTdHlsZSIsIlByb2R1Y3RJbWFnZVVwbG9hZCIsImN1cnJlbnRWYWx1ZSIsImN1cnJlbnRQdWJsaWNJZCIsImltYWdlUHVibGljSWQiLCJwcmV2aWV3VXJsIiwic2V0UHJldmlld1VybCIsInB1YmxpY0lkIiwic2V0UHVibGljSWQiLCJ1cGxvYWRpbmciLCJzZXRVcGxvYWRpbmciLCJoYW5kbGVVcGxvYWQiLCJmaWxlIiwiZmlsZXMiLCJ1cGxvYWRlZFVybCIsInVybCIsInVwbG9hZGVkUHVibGljSWQiLCJ1cGxvYWRFcnJvciIsImhhbmRsZVJlbW92ZSIsImFjY2VwdCIsIkZyYWdtZW50IiwicmVhZE9ubHkiLCJDYXRlZ29yeVNob3ciLCJzZXRDYXRlZ29yeSIsInllYXIiLCJtb250aCIsImRheSIsImhvdXIiLCJtaW51dGUiLCJzbHVn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aENGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxPQUFBLEVBQUEsSUFBQSxFQUFRO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFD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QSxJQUFJLEVBQUUsT0FBTztVQUFFQyxJQUFJLEVBQUVzQixLQUFLLENBQUN6QjtFQUFRLE9BQUMsQ0FBQztRQUNsREssZUFBZSxDQUFDLEtBQUssQ0FBQztFQUN4QixJQUFBO0lBQ0YsQ0FBQztJQUVELG9CQUNFN0Isc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUFLQyxJQUFBQSxTQUFTLEVBQUM7S0FBZSxlQUM1QkYsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLE9BQUEsRUFBQSxJQUFBLEVBQVE7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUEsQ0FBZSxDQUFDLGVBRVZELHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsSUFBQUEsU0FBUyxFQUFDO0tB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUEsQ0FBZSxDQUFDLGVBRVZELHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsSUFBQUEsU0FBUyxFQUFDO0tBQXFCLGVBQ2xDRixzQkFBQSxDQUFBQyxhQUFBLENBQUEsS0FBQSxFQUFBO0VBQUtDLElBQUFBLFNBQVMsRUFBQztLQUFzQixlQUNuQ0Ysc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUFLQyxJQUFBQSxTQUFTLEVBQUM7RUFBc0IsR0FBQSxFQUFDLG1CQUFzQixDQUFDLGVBQzdERixzQkFBQSxDQUFBQyxhQUFBLENBQUEsSUFBQSxFQUFBO0VBQUlDLElBQUFBLFNBQVMsRUFBQztLQUFxQixFQUFFRyxRQUFRLENBQUNFLElBQUksSUFBSSxHQUFRLENBQUMsZUFDL0RQLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7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
