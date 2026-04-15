(function (React) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const formatCurrency$1 = value => {
    const amount = Number(value || 0);
    return `Rs. ${amount.toLocaleString(undefined, {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  })}`;
  };
  const productImage = product => {
    const resolved = product?.image || product?.imageUrl || product?.thumbnail || product?.cover || "/public/img3.png";
    const normalized = String(resolved || "").toLowerCase();
    if (normalized.includes("img1") || normalized.includes("img2")) {
      return "/public/img3.png";
    }
    return resolved;
  };
  const productLabel = product => {
    const name = String(product?.name || "product");
    return name.split(" ").slice(0, 2).map(part => part[0]).join("").toUpperCase();
  };
  const normalizeProduct = item => {
    const record = item?.params ? item.params : item || {};
    return {
      id: record.id ?? item?.id,
      name: record.name || "Untitled product",
      price: Number(record.price || 0),
      imageUrl: record.imageUrl || "",
      isActive: Boolean(record.isActive),
      stock: Number(record.stock || 0),
      categoryName: record?.category?.name || record?.categoryName || record?.categoryId || "Shop",
      recordActions: item?.recordActions || item?.actions || []
    };
  };
  const normalizeOrder = item => {
    const record = item?.params ? item.params : item || {};
    return {
      id: record.id ?? item?.id,
      status: String(record.status || "pending"),
      totalAmount: Number(record.totalAmount || 0),
      createdAt: record.createdAt || item?.createdAt || null,
      userName: record?.user?.name || record?.customerName || record?.shippingName || "Order",
      recordActions: item?.recordActions || item?.actions || []
    };
  };
  const getShowHref$1 = product => {
    const recordActions = product?.recordActions || [];
    const showAction = recordActions.find(action => action?.name === "show");
    if (showAction?.href) {
      return showAction.href;
    }
    return product?.id ? `/admin/resources/Products/records/${encodeURIComponent(product.id)}/show` : "";
  };
  const Dashboard = () => {
    const [summary, setSummary] = React.useState({
      users: 0,
      products: 0,
      categories: 0,
      orders: 0
    });
    const [records, setRecords] = React.useState([]);
    const [recentOrders, setRecentOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [currentUserName, setCurrentUserName] = React.useState("");
    const [currentUserRole, setCurrentUserRole] = React.useState("");
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
    React.useEffect(() => {
      const root = document.documentElement;
      const body = document.body;
      root.classList.add("change8-storefront-dashboard-page");
      body?.classList.add("change8-storefront-dashboard-page");
      return () => {
        root.classList.remove("change8-storefront-dashboard-page");
        body?.classList.remove("change8-storefront-dashboard-page");
      };
    }, []);
    React.useEffect(() => {
      let isMounted = true;
      const loadDashboard = async () => {
        setLoading(true);
        try {
          const [summaryResponse, productsResponse, ordersResponse] = await Promise.all([fetch("/admin/api/dashboard", {
            credentials: "same-origin"
          }), fetch("/admin/api/resources/Products/actions/list", {
            credentials: "same-origin"
          }), fetch("/admin/api/resources/Orders/actions/list", {
            credentials: "same-origin"
          })]);
          const summaryPayload = summaryResponse.ok ? await summaryResponse.json() : {};
          const productPayload = productsResponse.ok ? await productsResponse.json() : {};
          const orderPayload = ordersResponse.ok ? await ordersResponse.json() : {};
          if (!isMounted) {
            return;
          }
          const loadedRecords = Array.isArray(productPayload?.records) ? productPayload.records.map(normalizeProduct) : [];
          const loadedOrders = Array.isArray(orderPayload?.records) ? orderPayload.records.map(normalizeOrder) : [];
          setSummary({
            users: Number(summaryPayload?.users || 0),
            products: Number(summaryPayload?.products || loadedRecords.length || 0),
            categories: Number(summaryPayload?.categories || 0),
            orders: Number(summaryPayload?.orders || 0)
          });
          setRecords(loadedRecords);
          setRecentOrders(loadedOrders);
        } catch (error) {
          if (isMounted) {
            setRecords([]);
            setRecentOrders([]);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
      loadDashboard();
      return () => {
        isMounted = false;
      };
    }, []);
    React.useEffect(() => {
      const closeUserMenu = () => {
        setIsUserMenuOpen(false);
      };
      document.addEventListener("click", closeUserMenu);
      return () => {
        document.removeEventListener("click", closeUserMenu);
      };
    }, []);
    React.useEffect(() => {
      let isMounted = true;
      const loadCurrentUser = async () => {
        try {
          const response = await fetch("/admin/context/current-user", {
            credentials: "same-origin",
            headers: {
              Accept: "application/json"
            }
          });
          if (!response.ok) {
            return;
          }
          const payload = await response.json();
          if (isMounted) {
            setCurrentUserName(String(payload?.name || "").trim());
            setCurrentUserRole(String(payload?.role || "").trim().toLowerCase());
          }
        } catch (error) {
          if (isMounted) {
            setCurrentUserName("");
            setCurrentUserRole("");
          }
        }
      };
      loadCurrentUser();
      return () => {
        isMounted = false;
      };
    }, []);
    const activeProducts = React.useMemo(() => {
      return records.filter(product => product.isActive !== false);
    }, [records]);
    const filteredProducts = React.useMemo(() => {
      const query = searchTerm.trim().toLowerCase();
      if (!query) {
        return activeProducts;
      }
      return activeProducts.filter(product => {
        return [product.name, String(product.categoryName || ""), String(product.stock || "")].join(" ").toLowerCase().includes(query);
      });
    }, [activeProducts, searchTerm]);
    const heroSlides = React.useMemo(() => {
      return [{
        id: "img3-static",
        name: "New Collection",
        categoryName: "Featured",
        imageUrl: "/public/img3.png",
        isActive: true,
        stock: 0,
        price: 0,
        recordActions: []
      }, {
        id: "img4-static",
        name: "Latest Drop",
        categoryName: "Featured",
        imageUrl: "/public/img4.png",
        isActive: true,
        stock: 0,
        price: 0,
        recordActions: []
      }, {
        id: "img5-static",
        name: "Latest Drop",
        categoryName: "Featured",
        imageUrl: "/public/img5.png",
        isActive: true,
        stock: 0,
        price: 0,
        recordActions: []
      }];
    }, []);
    React.useEffect(() => {
      if (heroSlides.length <= 1) {
        return undefined;
      }
      const timer = window.setInterval(() => {
        setCurrentSlide(previous => (previous + 1) % heroSlides.length);
      }, 4200);
      return () => window.clearInterval(timer);
    }, [heroSlides.length]);
    React.useEffect(() => {
      if (currentSlide >= heroSlides.length) {
        setCurrentSlide(0);
      }
    }, [currentSlide, heroSlides.length]);
    const featuredProduct = heroSlides[currentSlide] || activeProducts[0] || records[0] || null;
    const heroImage = productImage(featuredProduct);
    const heroTitle = featuredProduct?.name || "Revive Me Jett";
    const heroSubtitle = featuredProduct?.categoryName || "Oversize Tee";
    const heroHref = getShowHref$1(featuredProduct);
    const ordersListHref = "/admin/resources/Orders/actions/list";
    const spotlightProducts = React.useMemo(() => {
      return filteredProducts.slice(0, 5);
    }, [filteredProducts]);
    const categories = React.useMemo(() => {
      const bucket = new Map();
      records.forEach(product => {
        const name = String(product.categoryName || "Shop");
        bucket.set(name, (bucket.get(name) || 0) + 1);
      });
      return Array.from(bucket.entries()).map(([name, count]) => ({
        name,
        count
      }));
    }, [records]);
    const isAdminUser = currentUserRole === "admin";
    const recentProducts = Array.isArray(records) ? records.slice(0, 5) : [];
    const categoryPreview = categories.slice(0, 6);
    if (isAdminUser) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-dashboard"
      }, /*#__PURE__*/React__default.default.createElement("style", null, `
          .change8-admin-dashboard {
            min-height: 100vh;
            padding: 28px;
            background: #f8fafc;
            color: #0f172a;
            font-family: "Poppins", "Segoe UI", sans-serif;
          }

          .change8-admin-dashboard-grid {
            display: grid;
            gap: 18px;
          }

          .change8-admin-dashboard-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
          }

          .change8-admin-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .change8-admin-action {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 16px;
            border-radius: 14px;
            border: 1px solid rgba(15, 23, 42, 0.1);
            background: #ffffff;
            color: #0f172a;
            text-decoration: none;
            font-weight: 700;
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
          }

          .change8-admin-action--primary {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: #ffffff;
            border: none;
          }

          .change8-admin-dashboard-title {
            margin: 0;
            font-size: clamp(28px, 4vw, 46px);
            line-height: 1;
            font-weight: 800;
          }

          .change8-admin-dashboard-subtitle {
            margin: 8px 0 0;
            color: #64748b;
          }

          .change8-admin-dashboard-cards {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
          }

          .change8-admin-card,
          .change8-admin-panel {
            border-radius: 20px;
            border: 1px solid rgba(15, 23, 42, 0.08);
            background: #ffffff;
            box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
          }

          .change8-admin-card {
            padding: 18px;
          }

          .change8-admin-card-label {
            color: #64748b;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            font-weight: 700;
          }

          .change8-admin-card-value {
            margin-top: 10px;
            font-size: 32px;
            line-height: 1;
            font-weight: 800;
          }

          .change8-admin-dashboard-links {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .change8-admin-link {
            display: block;
            padding: 18px;
            border-radius: 18px;
            border: 1px solid rgba(15, 23, 42, 0.08);
            background: #ffffff;
            color: #0f172a;
            text-decoration: none;
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
          }

          .change8-admin-link strong {
            display: block;
            font-size: 18px;
            margin-bottom: 6px;
          }

          .change8-admin-section-title {
            margin: 0;
            font-size: 20px;
            font-weight: 800;
          }

          .change8-admin-category-list {
            margin-top: 14px;
            display: grid;
            gap: 12px;
          }

          .change8-admin-category-item {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding: 14px 16px;
            border-radius: 14px;
            border: 1px solid rgba(15, 23, 42, 0.08);
            background: #f8fafc;
          }

          .change8-admin-category-name {
            display: block;
            font-weight: 700;
            margin-bottom: 4px;
          }

          .change8-admin-category-meta {
            color: #64748b;
            font-size: 13px;
          }

          @media (max-width: 1100px) {
            .change8-admin-dashboard-cards,
            .change8-admin-dashboard-links {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 720px) {
            .change8-admin-dashboard {
              padding: 18px;
            }

            .change8-admin-dashboard-cards,
            .change8-admin-dashboard-links {
              grid-template-columns: 1fr;
            }
          }
        `), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-dashboard-grid"
      }, /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-dashboard-header"
      }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("h1", {
        className: "change8-admin-dashboard-title"
      }, "Admin Dashboard"), /*#__PURE__*/React__default.default.createElement("p", {
        className: "change8-admin-dashboard-subtitle"
      }, "Manage your shop data, products, orders, and users from here.")), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-actions"
      }, /*#__PURE__*/React__default.default.createElement("a", {
        className: "change8-admin-action change8-admin-action--primary",
        href: "/admin/resources/Products/actions/new"
      }, "+ Add Product"), /*#__PURE__*/React__default.default.createElement("a", {
        className: "change8-admin-action",
        href: "/admin/resources/Categories/actions/new"
      }, "+ Add Category"))), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-dashboard-cards"
      }, /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-card"
      }, /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-card-label"
      }, "Users"), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-card-value"
      }, summary.users)), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-card"
      }, /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-card-label"
      }, "Products"), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-card-value"
      }, summary.products)), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-card"
      }, /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-card-label"
      }, "Orders"), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-card-value"
      }, summary.orders)), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-card"
      }, /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-card-label"
      }, "Categories"), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-card-value"
      }, summary.categories))), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-dashboard-links"
      }, /*#__PURE__*/React__default.default.createElement("a", {
        className: "change8-admin-link",
        href: "/admin/resources/Products/actions/list"
      }, /*#__PURE__*/React__default.default.createElement("strong", null, "Products"), "Open product list and manage inventory."), /*#__PURE__*/React__default.default.createElement("a", {
        className: "change8-admin-link",
        href: "/admin/resources/Orders/actions/list"
      }, /*#__PURE__*/React__default.default.createElement("strong", null, "Orders"), "Review and process customer orders."), /*#__PURE__*/React__default.default.createElement("a", {
        className: "change8-admin-link",
        href: "/admin/resources/Users/actions/list"
      }, /*#__PURE__*/React__default.default.createElement("strong", null, "Users"), "View registered users and roles.")), /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "16px"
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-panel",
        style: {
          padding: "20px"
        }
      }, /*#__PURE__*/React__default.default.createElement("h2", {
        className: "change8-admin-section-title"
      }, "Recent Products"), /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          marginTop: "14px",
          display: "grid",
          gap: "12px"
        }
      }, recentProducts.map(product => /*#__PURE__*/React__default.default.createElement("a", {
        key: product.id,
        href: getShowHref$1(product),
        style: {
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          padding: "14px 16px",
          borderRadius: "14px",
          border: "1px solid rgba(15, 23, 42, 0.08)",
          textDecoration: "none",
          color: "#0f172a",
          background: "#f8fafc"
        }
      }, /*#__PURE__*/React__default.default.createElement("span", null, /*#__PURE__*/React__default.default.createElement("strong", {
        style: {
          display: "block",
          marginBottom: "4px"
        }
      }, product.name), /*#__PURE__*/React__default.default.createElement("span", {
        style: {
          color: "#64748b",
          fontSize: "13px"
        }
      }, "Stock: ", product.stock, " | ", product.categoryName)), /*#__PURE__*/React__default.default.createElement("span", {
        style: {
          fontWeight: 700
        }
      }, formatCurrency$1(product.price)))))), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-panel",
        style: {
          padding: "20px"
        }
      }, /*#__PURE__*/React__default.default.createElement("h2", {
        className: "change8-admin-section-title"
      }, "Recent Orders"), /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          marginTop: "14px",
          display: "grid",
          gap: "12px"
        }
      }, recentOrders.map(order => /*#__PURE__*/React__default.default.createElement("a", {
        key: order.id,
        href: `/admin/resources/Orders/records/${encodeURIComponent(String(order.id))}/show`,
        style: {
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          padding: "14px 16px",
          borderRadius: "14px",
          border: "1px solid rgba(15, 23, 42, 0.08)",
          textDecoration: "none",
          color: "#0f172a",
          background: "#f8fafc"
        }
      }, /*#__PURE__*/React__default.default.createElement("span", null, /*#__PURE__*/React__default.default.createElement("strong", {
        style: {
          display: "block",
          marginBottom: "4px"
        }
      }, order.userName), /*#__PURE__*/React__default.default.createElement("span", {
        style: {
          color: "#64748b",
          fontSize: "13px"
        }
      }, order.status, " |", " ", order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "New")), /*#__PURE__*/React__default.default.createElement("span", {
        style: {
          fontWeight: 700
        }
      }, formatCurrency$1(order.totalAmount))))))), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-panel",
        style: {
          padding: "20px"
        }
      }, /*#__PURE__*/React__default.default.createElement("h2", {
        className: "change8-admin-section-title"
      }, "Categories"), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-category-list"
      }, categoryPreview.map(category => /*#__PURE__*/React__default.default.createElement("div", {
        key: category.name,
        className: "change8-admin-category-item"
      }, /*#__PURE__*/React__default.default.createElement("span", null, /*#__PURE__*/React__default.default.createElement("strong", {
        className: "change8-admin-category-name"
      }, category.name), /*#__PURE__*/React__default.default.createElement("span", {
        className: "change8-admin-category-meta"
      }, "Products in category")), /*#__PURE__*/React__default.default.createElement("span", {
        style: {
          fontWeight: 700
        }
      }, category.count)))))));
    }
    return /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-storefront-dashboard"
    }, /*#__PURE__*/React__default.default.createElement("style", null, `
        .change8-storefront-dashboard {
          --bg: #f7f7f7;
          --text: #111111;
          --muted: #666666;
          --line: rgba(17, 17, 17, 0.08);
          --accent: #ff2d8b;
          --success: #45d255;
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: "Poppins", "Segoe UI", sans-serif;
        }

        .change8-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .change8-top-strip {
          background: var(--success);
          color: #000;
          text-align: center;
          font-size: 13px;
          padding: 7px 12px;
          letter-spacing: 0.01em;
        }

        .change8-nav {
          background: #050505;
          color: white;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          padding: 18px 28px;
          position: relative;
          z-index: 30;
        }

        .change8-nav-links {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          align-items: center;
          font-weight: 700;
        }

        .change8-nav-user-display {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-height: 34px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: white;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .change8-nav-user-display::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--accent);
          box-shadow: 0 0 0 4px rgba(255, 45, 139, 0.16);
          flex: 0 0 auto;
        }

        .change8-nav-links a {
          color: white;
          text-decoration: none;
        }

        .change8-nav-links a.is-active {
          color: var(--accent);
        }

        .change8-brand {
          width: 86px;
          height: 86px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 28%, #f7ff59 0%, #1ec63a 34%, #111 100%);
          color: white;
          font-weight: 800;
          font-size: 17px;
          line-height: 0.95;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
        }

        .change8-brand small {
          display: block;
          font-size: 10px;
          letter-spacing: 0.12em;
          margin-top: 4px;
        }

        .change8-nav-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 14px;
        }

        .change8-search {
          width: min(100%, 280px);
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          border-radius: 999px;
          background: white;
          color: #111;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
        }

        .change8-search svg {
          flex: 0 0 auto;
          stroke: #666;
          opacity: 0.7;
        }

        .change8-search input {
          border: 0;
          outline: 0;
          width: 100%;
          background: #fff !important;
          -webkit-box-shadow: none !important;
          box-shadow: none !important;
          color: #111;
          font: inherit;
          font-size: 14px;
          min-width: 0;
          appearance: none;
          -webkit-appearance: none;
          caret-color: #111;
        }

        .change8-search input::placeholder {
          color: #999;
          opacity: 0.8;
        }

        .change8-search input:-webkit-autofill,
        .change8-search input:-webkit-autofill:hover,
        .change8-search input:-webkit-autofill:focus,
        .change8-search input:-webkit-autofill:active {
          -webkit-text-fill-color: #111 !important;
          -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
          box-shadow: 0 0 0 1000px #fff inset !important;
          caret-color: #111;
        }

        .change8-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          border: 2px solid rgba(255, 255, 255, 0.92);
          color: white;
          position: relative;
        }

        .change8-cart-button {
          padding: 0;
          background: transparent;
          cursor: pointer;
        }

        .change8-user-fallback {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .change8-user-fallback .change8-icon {
          flex: 0 0 auto;
        }

        .change8-user-menu {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .change8-user-toggle {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border-radius: 999px;
          padding: 8px 14px;
          min-height: 34px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .change8-user-toggle::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--accent);
          box-shadow: 0 0 0 4px rgba(255, 45, 139, 0.16);
          flex: 0 0 auto;
        }

        .change8-user-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 170px;
          padding: 14px 12px;
          border-radius: 16px;
          background: #0d1320;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 18px 30px rgba(0, 0, 0, 0.32);
          z-index: 20;
          overflow: visible;
        }

        .change8-logout-button {
          width: 100%;
          border: 0;
          cursor: pointer;
          background: #ff2d8b;
          color: white;
          border-radius: 14px;
          padding: 13px 16px;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
          letter-spacing: 0.02em;
          transition: background 0.2s ease;
        }

        .change8-logout-button:hover {
          background: #ff4a9b;
        }

        .change8-logout-button:active {
          background: #ff1a7c;
        }

        .change8-icon svg {
          width: 18px;
          height: 18px;
          stroke: currentColor;
          fill: none;
          stroke-width: 2;
        }

        .change8-badge {
          position: absolute;
          top: -7px;
          right: -7px;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          border-radius: 999px;
          background: #ff6b6b;
          color: white;
          font-size: 10px;
          display: grid;
          place-items: center;
          font-weight: 700;
        }

        html[data-admin-theme="light"] .change8-storefront-dashboard .change8-nav {
          background: #f3f4f6;
          color: #111827;
          border-bottom: 1px solid rgba(17, 24, 39, 0.08);
        }

        html[data-admin-theme="light"] .change8-storefront-dashboard .change8-nav-links a {
          color: #111827;
        }

        html[data-admin-theme="light"] .change8-storefront-dashboard .change8-nav-links a.is-active {
          color: var(--accent);
        }

        html[data-admin-theme="light"] .change8-storefront-dashboard .change8-icon {
          color: #111827;
          border-color: rgba(17, 24, 39, 0.2);
          background: #ffffff;
        }

        html[data-admin-theme="light"] .change8-storefront-dashboard .change8-user-toggle {
          color: #111827;
          background: #ffffff;
          border-color: rgba(17, 24, 39, 0.15);
        }

        html[data-admin-theme="light"] .change8-storefront-dashboard .change8-user-dropdown {
          background: #ffffff;
          border-color: rgba(17, 24, 39, 0.12);
          box-shadow: 0 12px 26px rgba(15, 23, 42, 0.12);
        }

        .change8-content {
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .change8-hero {
          position: relative;
          min-height: 470px;
          overflow: hidden;
          background: #ffffff;
        }

        .change8-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.03) 46%, rgba(0, 0, 0, 0) 100%);
          z-index: 0;
        }

        .change8-hero-image {
          position: absolute;
          inset: 0;
          background-image: url("${heroImage}");
          background-size: cover;
          background-position: center;
          opacity: 1;
          transform: scale(1.01);
        }

        .change8-hero-copy {
          position: relative;
          z-index: 1;
          width: min(100%, 560px);
          margin-left: auto;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          padding: 24px 38px 56px;
        }

        .change8-hero-eyebrow {
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 700;
          opacity: 0.95;
          margin-bottom: 12px;
        }

        .change8-hero-title {
          margin: 0;
          font-size: clamp(40px, 4.8vw, 66px);
          line-height: 0.95;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .change8-hero-subtitle {
          margin: 12px 0 0;
          font-size: clamp(18px, 2.2vw, 28px);
          letter-spacing: 0.34em;
          text-transform: uppercase;
          opacity: 0.95;
        }

        .change8-hero-button {
          margin-top: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 170px;
          padding: 16px 22px;
          border-radius: 999px;
          border: 0;
          background: white;
          color: #111;
          font-size: 18px;
          letter-spacing: 0.14em;
          text-decoration: none;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .change8-slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 54px;
          height: 54px;
          border: 0;
          background: transparent;
          color: rgba(255, 255, 255, 0.88);
          font-size: 64px;
          line-height: 1;
          cursor: pointer;
          z-index: 2;
          display: grid;
          place-items: center;
        }

        .change8-slider-arrow:hover {
          color: white;
        }

        .change8-slider-arrow--left {
          left: 8px;
        }

        .change8-slider-arrow--right {
          right: 8px;
        }

        .change8-slider-dots {
          position: absolute;
          left: 50%;
          bottom: 12px;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 2;
        }

        .change8-slider-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 0;
          background: rgba(255, 255, 255, 0.92);
          cursor: pointer;
        }

        .change8-slider-dot.is-active {
          background: #39d353;
        }

        .change8-products {
          background: white;
          padding: 12px 0 10px;
        }

        .change8-products-head {
          padding: 10px 14px 20px;
        }

        .change8-products-title {
          margin: 0;
          text-align: center;
          font-size: clamp(28px, 3vw, 42px);
          line-height: 1;
          font-weight: 800;
          text-transform: uppercase;
        }

        .change8-product-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 18px;
          padding: 0 14px 18px;
        }

        .change8-product-card {
          color: #111;
          text-decoration: none;
        }

        .change8-product-media {
          position: relative;
          aspect-ratio: 0.95;
          overflow: hidden;
          background: #e5e7eb;
        }

        .change8-product-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .change8-favorite {
          position: absolute;
          top: 10px;
          left: 10px;
          color: white;
          font-size: 21px;
          line-height: 1;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }

        .change8-product-name {
          margin: 10px 0 0;
          font-size: 18px;
          line-height: 1.12;
          font-weight: 700;
          min-height: 40px;
        }

        .change8-product-price {
          margin-top: 8px;
          font-size: 14px;
          font-weight: 600;
        }

        .change8-product-price s {
          color: #666;
          margin-right: 6px;
        }

        .change8-empty,
        .change8-loading {
          margin: 0 14px 18px;
          padding: 22px;
          border-radius: 18px;
          border: 1px dashed rgba(17, 17, 17, 0.18);
          background: rgba(255, 255, 255, 0.7);
          color: var(--muted);
        }

        @media (max-width: 1200px) {
          .change8-product-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .change8-nav {
            grid-template-columns: 1fr;
            justify-items: center;
          }

          .change8-nav-links {
            justify-content: center;
            gap: 18px;
            flex-wrap: wrap;
          }

          .change8-nav-actions {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }

          .change8-nav-user-display {
            width: 100%;
            justify-content: center;
          }

          .change8-hero-copy {
            width: 100%;
            padding: 22px 20px 56px;
          }

          .change8-product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .change8-slider-arrow {
            font-size: 44px;
            width: 40px;
            height: 40px;
          }

          .change8-slider-arrow--left {
            left: 4px;
          }

          .change8-slider-arrow--right {
            right: 4px;
          }
        }

        @media (max-width: 560px) {
          .change8-nav {
            padding: 14px 16px 16px;
          }

          .change8-brand {
            width: 72px;
            height: 72px;
            font-size: 14px;
          }

          .change8-search {
            width: 100%;
          }

          .change8-hero {
            min-height: 420px;
          }

          .change8-hero-title {
            font-size: clamp(32px, 12vw, 48px);
          }

          .change8-hero-subtitle {
            font-size: 16px;
            letter-spacing: 0.24em;
          }

          .change8-hero-button {
            width: 100%;
          }

          .change8-product-grid {
            grid-template-columns: 1fr;
          }
        }
      `), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-shell"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-top-strip"
    }, "FREE SHIPPING now available in Sri Lanka"), /*#__PURE__*/React__default.default.createElement("header", {
      className: "change8-nav"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-nav-links",
      "aria-label": "Primary"
    }, /*#__PURE__*/React__default.default.createElement("a", {
      href: "#hero",
      className: "is-active"
    }, "Home"), /*#__PURE__*/React__default.default.createElement("a", {
      href: "/admin/resources/Products/actions/list"
    }, "Product"), /*#__PURE__*/React__default.default.createElement("a", {
      href: "/admin/pages/About"
    }, "About"), /*#__PURE__*/React__default.default.createElement("a", {
      href: "#contact"
    }, "Contact Us")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-brand",
      "aria-label": "Store brand"
    }, "chanuka"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-nav-actions"
    }, /*#__PURE__*/React__default.default.createElement("label", {
      className: "change8-search",
      htmlFor: "change8-search-input"
    }, /*#__PURE__*/React__default.default.createElement("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2"
    }, /*#__PURE__*/React__default.default.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "7"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M20 20l-3.5-3.5"
    })), /*#__PURE__*/React__default.default.createElement("input", {
      id: "change8-search-input",
      type: "search",
      placeholder: "Search Products",
      value: searchTerm,
      onChange: event => setSearchTerm(event.target.value)
    })), currentUserName ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-user-menu"
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "change8-user-toggle",
      "aria-label": "Logged in user menu",
      "aria-expanded": isUserMenuOpen,
      onClick: event => {
        event.stopPropagation();
        setIsUserMenuOpen(previous => !previous);
      }
    }, currentUserName), isUserMenuOpen ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-user-dropdown",
      role: "menu",
      onClick: event => event.stopPropagation()
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "change8-logout-button",
      onClick: () => {
        setIsUserMenuOpen(false);
        window.location.href = "/admin/logout";
      }
    }, "Logout")) : null) : /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-user-fallback",
      "aria-label": "Account"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-icon"
    }, /*#__PURE__*/React__default.default.createElement("svg", {
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React__default.default.createElement("circle", {
      cx: "12",
      cy: "8",
      r: "4"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M4 20c1.8-4.2 5-6 8-6s6.2 1.8 8 6"
    })))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-icon",
      "aria-label": "Wishlist"
    }, /*#__PURE__*/React__default.default.createElement("svg", {
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M12 21s-7-4.6-9.2-9.2C.8 8.2 2.4 5 5.8 5c1.8 0 3.2 1 4.2 2.2C11 6 12.5 5 14.2 5c3.4 0 5 3.2 3 6.8C19 16.4 12 21 12 21z"
    }))), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "change8-icon change8-cart-button",
      "aria-label": "Cart",
      onClick: () => {
        window.location.assign(ordersListHref);
      }
    }, /*#__PURE__*/React__default.default.createElement("svg", {
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React__default.default.createElement("path", {
      d: "M3 4h2l2.2 11.3A2 2 0 0 0 9.2 17H18a2 2 0 0 0 2-1.6l1.1-6.4H6.1"
    }), /*#__PURE__*/React__default.default.createElement("circle", {
      cx: "9",
      cy: "20",
      r: "1.5"
    }), /*#__PURE__*/React__default.default.createElement("circle", {
      cx: "17",
      cy: "20",
      r: "1.5"
    })), /*#__PURE__*/React__default.default.createElement("span", {
      className: "change8-badge"
    }, Math.max(0, Number(summary?.orders || 0)))))), /*#__PURE__*/React__default.default.createElement("main", {
      className: "change8-content"
    }, /*#__PURE__*/React__default.default.createElement("section", {
      className: "change8-hero",
      id: "hero"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-hero-image"
    }), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "change8-slider-arrow change8-slider-arrow--left",
      "aria-label": "Previous slide",
      onClick: () => {
        if (!heroSlides.length) {
          return;
        }
        setCurrentSlide(previous => previous === 0 ? heroSlides.length - 1 : previous - 1);
      }
    }, "\u2039"), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      className: "change8-slider-arrow change8-slider-arrow--right",
      "aria-label": "Next slide",
      onClick: () => {
        if (!heroSlides.length) {
          return;
        }
        setCurrentSlide(previous => (previous + 1) % heroSlides.length);
      }
    }, "\u203A"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-hero-copy"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-hero-eyebrow"
    }, "New season drop"), /*#__PURE__*/React__default.default.createElement("h1", {
      className: "change8-hero-title"
    }, heroTitle), /*#__PURE__*/React__default.default.createElement("p", {
      className: "change8-hero-subtitle"
    }, heroSubtitle), /*#__PURE__*/React__default.default.createElement("a", {
      href: heroHref || "#products",
      className: "change8-hero-button",
      onClick: event => {
        if (!heroHref) {
          event.preventDefault();
        }
      }
    }, "Shop Now")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-slider-dots",
      "aria-label": "Carousel navigation"
    }, heroSlides.map((slide, index) => /*#__PURE__*/React__default.default.createElement("button", {
      key: slide.id || `${slide.name}-${index}`,
      type: "button",
      className: `change8-slider-dot ${index === currentSlide ? "is-active" : ""}`,
      "aria-label": `Go to slide ${index + 1}`,
      onClick: () => setCurrentSlide(index)
    })))), /*#__PURE__*/React__default.default.createElement("section", {
      className: "change8-products",
      id: "products"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-products-head"
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      className: "change8-products-title"
    }, "Our Products")), loading ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-loading"
    }, "Loading products...") : spotlightProducts.length === 0 ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-empty"
    }, "No products found.") : /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-product-grid"
    }, spotlightProducts.map(product => {
      const href = getShowHref$1(product);
      const image = productImage(product);
      return /*#__PURE__*/React__default.default.createElement("article", {
        key: product.id
      }, /*#__PURE__*/React__default.default.createElement("a", {
        className: "change8-product-card",
        href: href || "#",
        onClick: event => {
          if (!href) {
            event.preventDefault();
          }
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-product-media"
      }, image ? /*#__PURE__*/React__default.default.createElement("img", {
        src: image,
        alt: product.name
      }) : /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center",
          color: "#111",
          fontWeight: 800,
          fontSize: "22px",
          background: "linear-gradient(135deg, #dbeafe, #fce7f3)"
        }
      }, productLabel(product)), /*#__PURE__*/React__default.default.createElement("span", {
        className: "change8-favorite"
      }, "\u2661")), /*#__PURE__*/React__default.default.createElement("h3", {
        className: "change8-product-name"
      }, product.name), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-product-price"
      }, /*#__PURE__*/React__default.default.createElement("s", null, formatCurrency$1(product.price * 1.14)), formatCurrency$1(product.price))));
    }))))));
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
  const cardStyle$5 = {
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
  const badgeStyle$2 = isActive => ({
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
        style: cardStyle$5
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
        style: badgeStyle$2(isActive)
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
    minHeight: "100%",
    padding: "24px",
    color: "#111827",
    background: "#ffffff"
  };
  const topBarStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "18px",
    flexWrap: "wrap"
  };
  const backLinkStyle = {
    color: "#111827",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 700
  };
  const layoutStyle$1 = {
    display: "grid",
    gridTemplateColumns: "minmax(320px, 1.05fr) minmax(360px, 0.95fr)",
    gap: "18px",
    alignItems: "start"
  };
  const cardStyle$4 = {
    borderRadius: "22px",
    border: "1px solid rgba(17, 24, 39, 0.08)",
    background: "#ffffff",
    boxShadow: "0 18px 34px rgba(15, 23, 42, 0.08)",
    overflow: "hidden"
  };
  const imageCardStyle = {
    ...cardStyle$4,
    display: "grid",
    gridTemplateRows: "1fr auto",
    minHeight: "500px"
  };
  const imageWrapStyle = {
    background: "#f8fafc",
    minHeight: "340px",
    display: "grid",
    placeItems: "center"
  };
  const imageStyle$4 = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block"
  };
  const imageFallbackStyle = {
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
    color: "#64748b",
    background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
    fontSize: "14px",
    letterSpacing: "0.08em",
    textTransform: "uppercase"
  };
  const imageFooterStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "16px 18px 18px",
    background: "#ffffff",
    borderTop: "1px solid rgba(17, 24, 39, 0.08)",
    flexWrap: "wrap"
  };
  const titleStyle$2 = {
    margin: 0,
    fontSize: "clamp(30px, 4vw, 54px)",
    lineHeight: 1,
    fontWeight: 800,
    color: "#111827",
    textTransform: "capitalize"
  };
  const subtitleStyle$1 = {
    margin: "8px 0 0",
    color: "#6b7280",
    fontSize: "14px"
  };
  const pillStyle = active => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    width: "fit-content",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: active ? "#14532d" : "#7f1d1d",
    background: active ? "#bbf7d0" : "#fecaca"
  });
  const pillDotStyle = active => ({
    width: "8px",
    height: "8px",
    borderRadius: "999px",
    background: active ? "#22c55e" : "#ef4444"
  });
  const infoGridStyle$2 = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px",
    marginTop: "18px"
  };
  const infoCardStyle = {
    borderRadius: "16px",
    border: "1px solid rgba(17, 24, 39, 0.08)",
    background: "#f8fafc",
    padding: "14px"
  };
  const infoLabelStyle = {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: "#6b7280",
    marginBottom: "8px"
  };
  const infoValueStyle = {
    fontSize: "17px",
    fontWeight: 700,
    color: "#111827",
    wordBreak: "break-word"
  };
  ({
    ...cardStyle$4});
  const sectionTitleStyle$3 = {
    margin: 0,
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#111827"
  };
  const descriptionStyle = {
    marginTop: "12px",
    color: "#374151",
    fontSize: "15px",
    lineHeight: 1.8,
    whiteSpace: "pre-wrap"
  };
  const detailsGridStyle = {
    display: "grid",
    gap: "10px",
    marginTop: "12px"
  };
  const detailRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    paddingBottom: "10px",
    borderBottom: "1px solid rgba(17, 24, 39, 0.08)"
  };
  const detailLabelStyle = {
    color: "#6b7280",
    fontSize: "13px"
  };
  const detailValueStyle = {
    color: "#111827",
    fontWeight: 600,
    textAlign: "right",
    fontSize: "13px"
  };
  const actionRowStyle = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "18px"
  };
  const primaryButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    minWidth: "180px",
    padding: "14px 18px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 18px rgba(99, 102, 241, 0.3)"
  };
  const secondaryButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    minWidth: "180px",
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid rgba(17, 24, 39, 0.12)",
    background: "#ffffff",
    color: "#111827",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer"
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
  const getProductImage = params => {
    return params?.imageUrl || params?.image || params?.thumbnail || params?.cover || "";
  };
  const ProductShow = props => {
    const record = props?.record;
    const params = record?.params || {};
    const productId = params?.id || record?.id || "";
    const name = params?.name || "Unnamed product";
    const sku = params?.sku || "-";
    const category = params?.categoryId || "-";
    const imageUrl = getProductImage(params);
    const stock = Number(params?.stock || 0);
    const isActive = Boolean(params?.isActive);
    const price = formatCurrency(params?.price);
    const description = params?.description || "No description available for this product.";
    const editUrl = productId ? `/admin/resources/Products/records/${encodeURIComponent(String(productId))}/edit` : "";
    const orderUrl = productId ? `/admin/resources/Orders/actions/new?productId=${encodeURIComponent(String(productId))}` : "";
    const handleOrderClick = () => {
      if (orderUrl) {
        window.location.assign(orderUrl);
      }
    };
    const handleEditClick = () => {
      if (editUrl) {
        window.location.assign(editUrl);
      }
    };
    React.useEffect(() => {
      const root = document.documentElement;
      const body = document.body;
      root.classList.add("change8-product-show-active");
      body?.classList.add("change8-product-show-active");
      return () => {
        root.classList.remove("change8-product-show-active");
        body?.classList.remove("change8-product-show-active");
      };
    }, []);
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: pageStyle$3
    }, /*#__PURE__*/React__default.default.createElement("style", null, `
        html.change8-product-show-active,
        html.change8-product-show-active body,
        html.change8-product-show-active #app,
        html.change8-product-show-active .adminjs_Layout,
        html.change8-product-show-active [data-testid="layout"],
        html.change8-product-show-active [data-css="layout"],
        html.change8-product-show-active main,
        body.change8-product-show-active,
        body.change8-product-show-active #app,
        body.change8-product-show-active .adminjs_Layout,
        body.change8-product-show-active [data-testid="layout"],
        body.change8-product-show-active [data-css="layout"],
        body.change8-product-show-active main {
          background: #ffffff !important;
          background-color: #ffffff !important;
          background-image: none !important;
        }

        html.change8-product-show-active body::before,
        html.change8-product-show-active::before,
        body.change8-product-show-active::before {
          content: none !important;
          display: none !important;
          background: none !important;
          background-image: none !important;
        }

        html.change8-product-show-active [data-testid="sidebar"],
        html.change8-product-show-active .adminjs_Sidebar,
        html.change8-product-show-active section[data-css="sidebar"],
        html.change8-product-show-active aside[data-css="sidebar"],
        html.change8-product-show-active nav[data-css="sidebar"] {
          display: none !important;
          width: 0 !important;
          min-width: 0 !important;
          max-width: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          border: 0 !important;
          overflow: hidden !important;
          box-shadow: none !important;
        }

        html.change8-product-show-active .adminjs_Layout,
        html.change8-product-show-active [data-testid="layout"],
        html.change8-product-show-active [data-css="layout"] {
          grid-template-columns: 1fr !important;
        }

        html.change8-product-show-active .adminjs_Layout > *:not([data-testid="sidebar"]),
        html.change8-product-show-active [data-testid="layout"] > *:not([data-testid="sidebar"]),
        html.change8-product-show-active [data-css="layout"] > *:not([data-testid="sidebar"]) {
          width: 100% !important;
          max-width: 100% !important;
        }

        html.change8-product-show-active [data-testid="topbar"],
        html.change8-product-show-active .adminjs_TopBar,
        html.change8-product-show-active header[data-css="topbar"],
        html.change8-product-show-active section[data-css="topbar"] {
          display: none !important;
        }

        html:has(.change8-product-show-page),
        body:has(.change8-product-show-page),
        #app:has(.change8-product-show-page),
        .adminjs_Layout:has(.change8-product-show-page),
        [data-testid="layout"]:has(.change8-product-show-page),
        [data-css="layout"]:has(.change8-product-show-page),
        main:has(.change8-product-show-page) {
          background: #ffffff !important;
          background-color: #ffffff !important;
          background-image: none !important;
        }

        html:has(.change8-product-show-page) [data-testid="sidebar"],
        html:has(.change8-product-show-page) .adminjs_Sidebar,
        html:has(.change8-product-show-page) section[data-css="sidebar"],
        html:has(.change8-product-show-page) aside[data-css="sidebar"],
        html:has(.change8-product-show-page) nav[data-css="sidebar"] {
          display: none !important;
          width: 0 !important;
          min-width: 0 !important;
          max-width: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          border: 0 !important;
          overflow: hidden !important;
          box-shadow: none !important;
        }

        html:has(.change8-product-show-page) .adminjs_Layout,
        html:has(.change8-product-show-page) [data-testid="layout"],
        html:has(.change8-product-show-page) [data-css="layout"] {
          grid-template-columns: 1fr !important;
        }

        html:has(.change8-product-show-page) .adminjs_Layout > *:not([data-testid="sidebar"]),
        html:has(.change8-product-show-page) [data-testid="layout"] > *:not([data-testid="sidebar"]),
        html:has(.change8-product-show-page) [data-css="layout"] > *:not([data-testid="sidebar"]) {
          width: 100% !important;
          max-width: 100% !important;
        }

        html:has(.change8-product-show-page) [data-testid="topbar"],
        html:has(.change8-product-show-page) .adminjs_TopBar,
        html:has(.change8-product-show-page) header[data-css="topbar"],
        html:has(.change8-product-show-page) section[data-css="topbar"] {
          display: none !important;
        }

        .change8-product-show-shell {
          display: grid;
          gap: 18px;
        }

        .change8-product-show-meta-scroll {
          max-height: 320px;
          overflow-y: auto;
          padding-right: 6px;
        }

        .change8-product-show-meta-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .change8-product-show-meta-scroll::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.8);
          border-radius: 999px;
        }

        .change8-product-show-meta-scroll::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.9);
          border-radius: 999px;
        }

        @media (max-width: 1100px) {
          .change8-product-show-layout {
            grid-template-columns: 1fr !important;
          }

          .change8-product-show-info-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .change8-product-show-meta-scroll {
            max-height: none;
            overflow-y: visible;
            padding-right: 0;
          }
        }

        @media (max-width: 720px) {
          .change8-product-show-info-grid {
            grid-template-columns: 1fr !important;
          }

          .change8-product-show-page {
            padding: 16px !important;
            background: #ffffff !important;
          }
        }
      `), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-product-show-shell change8-product-show-page"
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: topBarStyle
    }, /*#__PURE__*/React__default.default.createElement("a", {
      href: "/admin/resources/Products/actions/list",
      style: backLinkStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      "aria-hidden": "true"
    }, "\u2039"), "Back to Products"), /*#__PURE__*/React__default.default.createElement("div", {
      style: pillStyle(isActive)
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: pillDotStyle(isActive)
    }), isActive ? "Active" : "Inactive")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-product-show-layout",
      style: layoutStyle$1
    }, /*#__PURE__*/React__default.default.createElement("section", {
      style: imageCardStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: imageWrapStyle
    }, imageUrl ? /*#__PURE__*/React__default.default.createElement("img", {
      src: imageUrl,
      alt: name,
      style: imageStyle$4
    }) : /*#__PURE__*/React__default.default.createElement("div", {
      style: imageFallbackStyle
    }, "No image available")), /*#__PURE__*/React__default.default.createElement("div", {
      style: imageFooterStyle
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: "#64748b",
        fontSize: "12px"
      }
    }, "Product ID"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: "#111827",
        fontWeight: 700
      }
    }, productId || "-")), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: "#64748b",
        fontSize: "12px"
      }
    }, "Price"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: "#111827",
        fontWeight: 700
      }
    }, price)))), /*#__PURE__*/React__default.default.createElement("section", {
      style: cardStyle$4
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        padding: "22px"
      }
    }, /*#__PURE__*/React__default.default.createElement("h1", {
      style: titleStyle$2
    }, name), /*#__PURE__*/React__default.default.createElement("p", {
      style: subtitleStyle$1
    }, "Clean product detail view with quick actions and record info."), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-product-show-info-grid",
      style: infoGridStyle$2
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: infoCardStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: infoLabelStyle
    }, "Price"), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoValueStyle
    }, price)), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoCardStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: infoLabelStyle
    }, "Stock"), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoValueStyle
    }, stock)), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoCardStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: infoLabelStyle
    }, "SKU"), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoValueStyle
    }, sku))), /*#__PURE__*/React__default.default.createElement("div", {
      style: actionRowStyle
    }, /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      style: primaryButtonStyle,
      onClick: handleOrderClick
    }, "Create Order"), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      style: secondaryButtonStyle,
      onClick: handleEditClick
    }, "Edit Product")), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-product-show-meta-scroll",
      style: {
        marginTop: "22px",
        paddingTop: "20px",
        borderTop: "1px solid rgba(17, 24, 39, 0.08)",
        display: "grid",
        gap: "18px"
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle$3
    }, "Description"), /*#__PURE__*/React__default.default.createElement("div", {
      style: descriptionStyle
    }, description)), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle$3
    }, "Product Details"), /*#__PURE__*/React__default.default.createElement("div", {
      style: detailsGridStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: detailRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: detailLabelStyle
    }, "Category"), /*#__PURE__*/React__default.default.createElement("span", {
      style: detailValueStyle
    }, category)), /*#__PURE__*/React__default.default.createElement("div", {
      style: detailRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: detailLabelStyle
    }, "Created At"), /*#__PURE__*/React__default.default.createElement("span", {
      style: detailValueStyle
    }, formatDate$2(params?.createdAt))), /*#__PURE__*/React__default.default.createElement("div", {
      style: detailRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: detailLabelStyle
    }, "Updated At"), /*#__PURE__*/React__default.default.createElement("span", {
      style: detailValueStyle
    }, formatDate$2(params?.updatedAt))), /*#__PURE__*/React__default.default.createElement("div", {
      style: detailRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: detailLabelStyle
    }, "Record ID"), /*#__PURE__*/React__default.default.createElement("span", {
      style: detailValueStyle
    }, productId || "-"))))))))));
  };

  const pageStyle$2 = {
    display: "grid",
    gap: "20px",
    color: "#111827",
    background: "#ffffff"
  };
  const cardStyle$3 = {
    borderRadius: "18px",
    border: "1px solid rgba(17, 24, 39, 0.08)",
    background: "#ffffff",
    boxShadow: "0 14px 28px rgba(15, 23, 42, 0.08)",
    padding: "18px"
  };
  const sectionTitleStyle$2 = {
    margin: "0 0 14px 0",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#111827",
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
    color: "#475569"
  };
  const inputStyle = {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    borderRadius: "12px",
    border: "1px solid rgba(17, 24, 39, 0.12)",
    background: "#ffffff",
    color: "#111827",
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
    borderBottom: "1px solid rgba(17, 24, 39, 0.08)"
  };
  const mutedStyle = {
    color: "#64748b"
  };
  const strongStyle = {
    color: "#111827",
    fontWeight: 700,
    textAlign: "right"
  };
  const lineItemRowStyle = {
    border: "1px solid rgba(17, 24, 39, 0.12)",
    borderRadius: "14px",
    padding: "12px",
    display: "grid",
    gap: "12px",
    background: "#f8fafc"
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
    background: "#e5e7eb",
    border: "1px solid rgba(17, 24, 39, 0.12)"
  };
  const addButtonStyle = {
    border: "1px solid rgba(99, 102, 241, 0.35)",
    borderRadius: "10px",
    padding: "9px 12px",
    background: "#eef2ff",
    color: "#3730a3",
    cursor: "pointer",
    fontWeight: 700
  };
  const removeButtonStyle = {
    border: "1px solid #fca5a5",
    borderRadius: "10px",
    padding: "8px 10px",
    background: "#fee2e2",
    color: "#991b1b",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700
  };
  const totalsRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "7px 0",
    fontSize: "13px",
    borderBottom: "1px solid rgba(17, 24, 39, 0.08)"
  };
  const totalStyle = {
    ...totalsRowStyle,
    fontSize: "17px",
    fontWeight: 800,
    color: "#111827",
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
    border: primary ? "none" : "1px solid rgba(17, 24, 39, 0.12)",
    padding: "12px 14px",
    fontWeight: 700,
    cursor: "pointer",
    background: primary ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "#ffffff",
    color: primary ? "#fff" : "#111827"
  });
  const mapLinkStyle = {
    color: "#2563eb",
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
    border: active ? "1px solid rgba(99, 102, 241, 0.9)" : "1px solid rgba(17, 24, 39, 0.12)",
    background: active ? "#eef2ff" : "#ffffff",
    color: "#111827",
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
    background: "#ecfdf3",
    color: "#166534",
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
      const root = document.documentElement;
      const body = document.body;
      const hadLoginClassOnRoot = root.classList.contains("change8-login-page");
      const hadLoginClassOnBody = body?.classList.contains("change8-login-page");
      const hadDashboardClassOnRoot = root.classList.contains("change8-storefront-dashboard-page");
      const hadDashboardClassOnBody = body?.classList.contains("change8-storefront-dashboard-page");
      const loginBgLayer = document.getElementById("change8-login-bg-layer");
      const previousLayerDisplay = loginBgLayer?.style.display || "";
      const shellNodes = Array.from(new Set([root, body, document.getElementById("app"), document.querySelector('[data-testid="layout"]'), document.querySelector('[data-css="layout"]'), document.querySelector(".adminjs_Layout"), document.querySelector("main"), ...Array.from(document.querySelectorAll('[data-css*="action-content"], [data-testid*="content"], .adminjs_Main, .adminjs_Main > div, .adminjs_Main > div > div, [data-css$="-content"]'))].filter(Boolean)));
      const previousInlineBackgrounds = new Map(shellNodes.map(node => [node, {
        background: node.style.getPropertyValue("background"),
        backgroundPriority: node.style.getPropertyPriority("background"),
        backgroundColor: node.style.getPropertyValue("background-color"),
        backgroundColorPriority: node.style.getPropertyPriority("background-color"),
        backgroundImage: node.style.getPropertyValue("background-image"),
        backgroundImagePriority: node.style.getPropertyPriority("background-image")
      }]));
      root.classList.remove("change8-login-page", "change8-storefront-dashboard-page");
      body?.classList.remove("change8-login-page", "change8-storefront-dashboard-page");
      if (loginBgLayer) {
        loginBgLayer.style.display = "none";
      }
      shellNodes.forEach(node => {
        node.style.setProperty("background", "#ffffff", "important");
        node.style.setProperty("background-color", "#ffffff", "important");
        node.style.setProperty("background-image", "none", "important");
      });
      root.classList.add("change8-order-create-active");
      body?.classList.add("change8-order-create-active");
      return () => {
        root.classList.remove("change8-order-create-active");
        body?.classList.remove("change8-order-create-active");
        if (hadLoginClassOnRoot) {
          root.classList.add("change8-login-page");
        }
        if (hadLoginClassOnBody) {
          body?.classList.add("change8-login-page");
        }
        if (hadDashboardClassOnRoot) {
          root.classList.add("change8-storefront-dashboard-page");
        }
        if (hadDashboardClassOnBody) {
          body?.classList.add("change8-storefront-dashboard-page");
        }
        if (loginBgLayer) {
          loginBgLayer.style.display = previousLayerDisplay;
        }
        previousInlineBackgrounds.forEach((styles, node) => {
          if (!styles.background) {
            node.style.removeProperty("background");
          } else {
            node.style.setProperty("background", styles.background, styles.backgroundPriority || "");
          }
          if (!styles.backgroundColor) {
            node.style.removeProperty("background-color");
          } else {
            node.style.setProperty("background-color", styles.backgroundColor, styles.backgroundColorPriority || "");
          }
          if (!styles.backgroundImage) {
            node.style.removeProperty("background-image");
          } else {
            node.style.setProperty("background-image", styles.backgroundImage, styles.backgroundImagePriority || "");
          }
        });
      };
    }, []);
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
    }, /*#__PURE__*/React__default.default.createElement("style", null, `
        html.change8-order-create-active,
        html.change8-order-create-active body,
        html.change8-order-create-active #app,
        html.change8-order-create-active .adminjs_Layout,
        html.change8-order-create-active [data-testid="layout"],
        html.change8-order-create-active [data-css="layout"],
        html.change8-order-create-active main,
        body.change8-order-create-active,
        body.change8-order-create-active #app,
        body.change8-order-create-active .adminjs_Layout,
        body.change8-order-create-active [data-testid="layout"],
        body.change8-order-create-active [data-css="layout"],
        body.change8-order-create-active main {
          background: #ffffff !important;
          background-color: #ffffff !important;
          background-image: none !important;
        }

        html.change8-order-create-active #app > div,
        html.change8-order-create-active #app > div > div,
        html.change8-order-create-active #app > div > div > div,
        html.change8-order-create-active .adminjs_Main,
        html.change8-order-create-active .adminjs_Main > div,
        html.change8-order-create-active .adminjs_Main > div > div,
        html.change8-order-create-active [data-css*="action-content"],
        html.change8-order-create-active [data-testid*="content"],
        html.change8-order-create-active [data-css$="-content"] {
          background: #ffffff !important;
          background-color: #ffffff !important;
          background-image: none !important;
        }

        html.change8-order-create-active [data-testid="sidebar"],
        html.change8-order-create-active .adminjs_Sidebar,
        html.change8-order-create-active section[data-css="sidebar"],
        html.change8-order-create-active aside[data-css="sidebar"],
        html.change8-order-create-active nav[data-css="sidebar"] {
          display: none !important;
          width: 0 !important;
          min-width: 0 !important;
          max-width: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          border: 0 !important;
          overflow: hidden !important;
          box-shadow: none !important;
        }

        html.change8-order-create-active [data-testid="topbar"],
        html.change8-order-create-active .adminjs_TopBar,
        html.change8-order-create-active header[data-css="topbar"],
        html.change8-order-create-active section[data-css="topbar"] {
          display: none !important;
        }

        html.change8-order-create-active [data-testid="action-header"],
        html.change8-order-create-active [data-css*="action-header"],
        html.change8-order-create-active [data-testid*="breadcrumbs"],
        html.change8-order-create-active [data-css*="breadcrumbs"],
        html.change8-order-create-active .adminjs_Breadcrumb {
          display: none !important;
        }

        html.change8-order-create-active .adminjs_Layout,
        html.change8-order-create-active [data-testid="layout"],
        html.change8-order-create-active [data-css="layout"] {
          grid-template-columns: 1fr !important;
        }

        html.change8-order-create-active .adminjs_Layout > *:not([data-testid="sidebar"]),
        html.change8-order-create-active [data-testid="layout"] > *:not([data-testid="sidebar"]),
        html.change8-order-create-active [data-css="layout"] > *:not([data-testid="sidebar"]) {
          width: 100% !important;
          max-width: 100% !important;
        }

        html.change8-order-create-active body::before,
        html.change8-order-create-active::before,
        body.change8-order-create-active::before {
          content: none !important;
          display: none !important;
          background: none !important;
          background-image: none !important;
        }

        ${responsiveCss}
      `), /*#__PURE__*/React__default.default.createElement("form", {
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
      style: cardStyle$3
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
      style: cardStyle$3
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
      style: cardStyle$3
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
      style: cardStyle$3
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
      style: cardStyle$3
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
        ...cardStyle$3,
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
  const cardStyle$2 = {
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
      style: cardStyle$2
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
      style: cardStyle$2
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
      style: cardStyle$2
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
      style: cardStyle$2
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
  const cardStyle$1 = {
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
  const titleStyle$1 = {
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
      style: cardStyle$1
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: headerStyle
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("h1", {
      style: titleStyle$1
    }, product?.name || "Order Item"), /*#__PURE__*/React__default.default.createElement("p", {
      style: subtitleStyle
    }, "Order #", order?.id || "-", " \u2022 Item #", details?.id || "-")), /*#__PURE__*/React__default.default.createElement("span", {
      style: badgeStyle
    }, "Active Item"))), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-order-item-grid",
      style: gridStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle$1
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
      style: cardStyle$1
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
      style: cardStyle$1
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
      style: cardStyle$1
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
  const textStyle$1 = {
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
        style: textStyle$1
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
      style: textStyle$1
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

  const wrapperStyle$1 = {
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
      style: wrapperStyle$1
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

  const wrapperStyle = {
    minHeight: "100%",
    padding: "28px",
    background: "#ffffff",
    color: "#111827",
    display: "grid",
    gap: "18px"
  };
  const cardStyle = {
    borderRadius: "20px",
    border: "1px solid rgba(17, 24, 39, 0.08)",
    background: "#ffffff",
    boxShadow: "0 18px 34px rgba(15, 23, 42, 0.08)",
    padding: "24px"
  };
  const titleStyle = {
    margin: 0,
    fontSize: "clamp(28px, 4vw, 44px)",
    lineHeight: 1,
    fontWeight: 800
  };
  const textStyle = {
    margin: 0,
    color: "#475569",
    lineHeight: 1.8,
    fontSize: "15px"
  };
  const About = () => {
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: wrapperStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle
    }, /*#__PURE__*/React__default.default.createElement("h1", {
      style: titleStyle
    }, "About"), /*#__PURE__*/React__default.default.createElement("p", {
      style: textStyle
    }, "This admin dashboard is used to manage shop products, orders, order items, categories, and settings in one place.")), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: {
        ...titleStyle,
        fontSize: "24px",
        marginBottom: "12px"
      }
    }, "What you can do here"), /*#__PURE__*/React__default.default.createElement("p", {
      style: textStyle
    }, "Browse products, open product details, create orders, and manage the store data from the AdminJS interface.")));
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
  AdminJS.UserComponents.About = About;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9hZG1pbi9kYXNoYm9hcmQuanN4IiwiLi4vYWRtaW4vcmVnaXN0ZXIuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1jYXJkcy1saXN0LmpzeCIsIi4uL2FkbWluL3Byb2R1Y3Qtc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1jcmVhdGUuanN4IiwiLi4vYWRtaW4vb3JkZXItc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1pdGVtLXNob3cuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS5qc3giLCIuLi9hZG1pbi9wcm9kdWN0LWltYWdlLXVwbG9hZC5qc3giLCIuLi9hZG1pbi9jYXRlZ29yeS1zaG93LmpzeCIsIi4uL2FkbWluL2Fib3V0LmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBmb3JtYXRDdXJyZW5jeSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IGFtb3VudCA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gYFJzLiAke2Ftb3VudC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogYW1vdW50ICUgMSA9PT0gMCA/IDAgOiAyLFxyXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gIH0pfWA7XHJcbn07XHJcblxyXG5jb25zdCBwcm9kdWN0SW1hZ2UgPSAocHJvZHVjdCkgPT4ge1xyXG4gIGNvbnN0IHJlc29sdmVkID1cclxuICAgIHByb2R1Y3Q/LmltYWdlIHx8XHJcbiAgICBwcm9kdWN0Py5pbWFnZVVybCB8fFxyXG4gICAgcHJvZHVjdD8udGh1bWJuYWlsIHx8XHJcbiAgICBwcm9kdWN0Py5jb3ZlciB8fFxyXG4gICAgXCIvcHVibGljL2ltZzMucG5nXCI7XHJcblxyXG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSBTdHJpbmcocmVzb2x2ZWQgfHwgXCJcIikudG9Mb3dlckNhc2UoKTtcclxuICBpZiAobm9ybWFsaXplZC5pbmNsdWRlcyhcImltZzFcIikgfHwgbm9ybWFsaXplZC5pbmNsdWRlcyhcImltZzJcIikpIHtcclxuICAgIHJldHVybiBcIi9wdWJsaWMvaW1nMy5wbmdcIjtcclxuICB9XHJcblxyXG4gIHJldHVybiByZXNvbHZlZDtcclxufTtcclxuXHJcbmNvbnN0IHByb2R1Y3RMYWJlbCA9IChwcm9kdWN0KSA9PiB7XHJcbiAgY29uc3QgbmFtZSA9IFN0cmluZyhwcm9kdWN0Py5uYW1lIHx8IFwicHJvZHVjdFwiKTtcclxuICByZXR1cm4gbmFtZVxyXG4gICAgLnNwbGl0KFwiIFwiKVxyXG4gICAgLnNsaWNlKDAsIDIpXHJcbiAgICAubWFwKChwYXJ0KSA9PiBwYXJ0WzBdKVxyXG4gICAgLmpvaW4oXCJcIilcclxuICAgIC50b1VwcGVyQ2FzZSgpO1xyXG59O1xyXG5cclxuY29uc3Qgbm9ybWFsaXplUHJvZHVjdCA9IChpdGVtKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkID0gaXRlbT8ucGFyYW1zID8gaXRlbS5wYXJhbXMgOiBpdGVtIHx8IHt9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaWQ6IHJlY29yZC5pZCA/PyBpdGVtPy5pZCxcclxuICAgIG5hbWU6IHJlY29yZC5uYW1lIHx8IFwiVW50aXRsZWQgcHJvZHVjdFwiLFxyXG4gICAgcHJpY2U6IE51bWJlcihyZWNvcmQucHJpY2UgfHwgMCksXHJcbiAgICBpbWFnZVVybDogcmVjb3JkLmltYWdlVXJsIHx8IFwiXCIsXHJcbiAgICBpc0FjdGl2ZTogQm9vbGVhbihyZWNvcmQuaXNBY3RpdmUpLFxyXG4gICAgc3RvY2s6IE51bWJlcihyZWNvcmQuc3RvY2sgfHwgMCksXHJcbiAgICBjYXRlZ29yeU5hbWU6XHJcbiAgICAgIHJlY29yZD8uY2F0ZWdvcnk/Lm5hbWUgfHxcclxuICAgICAgcmVjb3JkPy5jYXRlZ29yeU5hbWUgfHxcclxuICAgICAgcmVjb3JkPy5jYXRlZ29yeUlkIHx8XHJcbiAgICAgIFwiU2hvcFwiLFxyXG4gICAgcmVjb3JkQWN0aW9uczogaXRlbT8ucmVjb3JkQWN0aW9ucyB8fCBpdGVtPy5hY3Rpb25zIHx8IFtdLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBub3JtYWxpemVPcmRlciA9IChpdGVtKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkID0gaXRlbT8ucGFyYW1zID8gaXRlbS5wYXJhbXMgOiBpdGVtIHx8IHt9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaWQ6IHJlY29yZC5pZCA/PyBpdGVtPy5pZCxcclxuICAgIHN0YXR1czogU3RyaW5nKHJlY29yZC5zdGF0dXMgfHwgXCJwZW5kaW5nXCIpLFxyXG4gICAgdG90YWxBbW91bnQ6IE51bWJlcihyZWNvcmQudG90YWxBbW91bnQgfHwgMCksXHJcbiAgICBjcmVhdGVkQXQ6IHJlY29yZC5jcmVhdGVkQXQgfHwgaXRlbT8uY3JlYXRlZEF0IHx8IG51bGwsXHJcbiAgICB1c2VyTmFtZTpcclxuICAgICAgcmVjb3JkPy51c2VyPy5uYW1lIHx8XHJcbiAgICAgIHJlY29yZD8uY3VzdG9tZXJOYW1lIHx8XHJcbiAgICAgIHJlY29yZD8uc2hpcHBpbmdOYW1lIHx8XHJcbiAgICAgIFwiT3JkZXJcIixcclxuICAgIHJlY29yZEFjdGlvbnM6IGl0ZW0/LnJlY29yZEFjdGlvbnMgfHwgaXRlbT8uYWN0aW9ucyB8fCBbXSxcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3QgZ2V0U2hvd0hyZWYgPSAocHJvZHVjdCkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZEFjdGlvbnMgPSBwcm9kdWN0Py5yZWNvcmRBY3Rpb25zIHx8IFtdO1xyXG4gIGNvbnN0IHNob3dBY3Rpb24gPSByZWNvcmRBY3Rpb25zLmZpbmQoKGFjdGlvbikgPT4gYWN0aW9uPy5uYW1lID09PSBcInNob3dcIik7XHJcbiAgaWYgKHNob3dBY3Rpb24/LmhyZWYpIHtcclxuICAgIHJldHVybiBzaG93QWN0aW9uLmhyZWY7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcHJvZHVjdD8uaWRcclxuICAgID8gYC9hZG1pbi9yZXNvdXJjZXMvUHJvZHVjdHMvcmVjb3Jkcy8ke2VuY29kZVVSSUNvbXBvbmVudChwcm9kdWN0LmlkKX0vc2hvd2BcclxuICAgIDogXCJcIjtcclxufTtcclxuXHJcbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcclxuICBjb25zdCBbc3VtbWFyeSwgc2V0U3VtbWFyeV0gPSB1c2VTdGF0ZSh7XHJcbiAgICB1c2VyczogMCxcclxuICAgIHByb2R1Y3RzOiAwLFxyXG4gICAgY2F0ZWdvcmllczogMCxcclxuICAgIG9yZGVyczogMCxcclxuICB9KTtcclxuICBjb25zdCBbcmVjb3Jkcywgc2V0UmVjb3Jkc10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgY29uc3QgW3JlY2VudE9yZGVycywgc2V0UmVjZW50T3JkZXJzXSA9IHVzZVN0YXRlKFtdKTtcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICBjb25zdCBbc2VhcmNoVGVybSwgc2V0U2VhcmNoVGVybV0gPSB1c2VTdGF0ZShcIlwiKTtcclxuICBjb25zdCBbY3VycmVudFNsaWRlLCBzZXRDdXJyZW50U2xpZGVdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW2N1cnJlbnRVc2VyTmFtZSwgc2V0Q3VycmVudFVzZXJOYW1lXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG4gIGNvbnN0IFtjdXJyZW50VXNlclJvbGUsIHNldEN1cnJlbnRVc2VyUm9sZV0gPSB1c2VTdGF0ZShcIlwiKTtcclxuICBjb25zdCBbaXNVc2VyTWVudU9wZW4sIHNldElzVXNlck1lbnVPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuXHJcbiAgICByb290LmNsYXNzTGlzdC5hZGQoXCJjaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2VcIik7XHJcbiAgICBib2R5Py5jbGFzc0xpc3QuYWRkKFwiY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlXCIpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIHJvb3QuY2xhc3NMaXN0LnJlbW92ZShcImNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQtcGFnZVwiKTtcclxuICAgICAgYm9keT8uY2xhc3NMaXN0LnJlbW92ZShcImNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQtcGFnZVwiKTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgbGV0IGlzTW91bnRlZCA9IHRydWU7XHJcblxyXG4gICAgY29uc3QgbG9hZERhc2hib2FyZCA9IGFzeW5jICgpID0+IHtcclxuICAgICAgc2V0TG9hZGluZyh0cnVlKTtcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgW3N1bW1hcnlSZXNwb25zZSwgcHJvZHVjdHNSZXNwb25zZSwgb3JkZXJzUmVzcG9uc2VdID1cclxuICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgICAgICAgZmV0Y2goXCIvYWRtaW4vYXBpL2Rhc2hib2FyZFwiLCB7IGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIgfSksXHJcbiAgICAgICAgICAgIGZldGNoKFwiL2FkbWluL2FwaS9yZXNvdXJjZXMvUHJvZHVjdHMvYWN0aW9ucy9saXN0XCIsIHtcclxuICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgZmV0Y2goXCIvYWRtaW4vYXBpL3Jlc291cmNlcy9PcmRlcnMvYWN0aW9ucy9saXN0XCIsIHtcclxuICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICBjb25zdCBzdW1tYXJ5UGF5bG9hZCA9IHN1bW1hcnlSZXNwb25zZS5va1xyXG4gICAgICAgICAgPyBhd2FpdCBzdW1tYXJ5UmVzcG9uc2UuanNvbigpXHJcbiAgICAgICAgICA6IHt9O1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RQYXlsb2FkID0gcHJvZHVjdHNSZXNwb25zZS5va1xyXG4gICAgICAgICAgPyBhd2FpdCBwcm9kdWN0c1Jlc3BvbnNlLmpzb24oKVxyXG4gICAgICAgICAgOiB7fTtcclxuICAgICAgICBjb25zdCBvcmRlclBheWxvYWQgPSBvcmRlcnNSZXNwb25zZS5va1xyXG4gICAgICAgICAgPyBhd2FpdCBvcmRlcnNSZXNwb25zZS5qc29uKClcclxuICAgICAgICAgIDoge307XHJcblxyXG4gICAgICAgIGlmICghaXNNb3VudGVkKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBsb2FkZWRSZWNvcmRzID0gQXJyYXkuaXNBcnJheShwcm9kdWN0UGF5bG9hZD8ucmVjb3JkcylcclxuICAgICAgICAgID8gcHJvZHVjdFBheWxvYWQucmVjb3Jkcy5tYXAobm9ybWFsaXplUHJvZHVjdClcclxuICAgICAgICAgIDogW107XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRlZE9yZGVycyA9IEFycmF5LmlzQXJyYXkob3JkZXJQYXlsb2FkPy5yZWNvcmRzKVxyXG4gICAgICAgICAgPyBvcmRlclBheWxvYWQucmVjb3Jkcy5tYXAobm9ybWFsaXplT3JkZXIpXHJcbiAgICAgICAgICA6IFtdO1xyXG5cclxuICAgICAgICBzZXRTdW1tYXJ5KHtcclxuICAgICAgICAgIHVzZXJzOiBOdW1iZXIoc3VtbWFyeVBheWxvYWQ/LnVzZXJzIHx8IDApLFxyXG4gICAgICAgICAgcHJvZHVjdHM6IE51bWJlcihcclxuICAgICAgICAgICAgc3VtbWFyeVBheWxvYWQ/LnByb2R1Y3RzIHx8IGxvYWRlZFJlY29yZHMubGVuZ3RoIHx8IDAsXHJcbiAgICAgICAgICApLFxyXG4gICAgICAgICAgY2F0ZWdvcmllczogTnVtYmVyKHN1bW1hcnlQYXlsb2FkPy5jYXRlZ29yaWVzIHx8IDApLFxyXG4gICAgICAgICAgb3JkZXJzOiBOdW1iZXIoc3VtbWFyeVBheWxvYWQ/Lm9yZGVycyB8fCAwKSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBzZXRSZWNvcmRzKGxvYWRlZFJlY29yZHMpO1xyXG4gICAgICAgIHNldFJlY2VudE9yZGVycyhsb2FkZWRPcmRlcnMpO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldFJlY29yZHMoW10pO1xyXG4gICAgICAgICAgc2V0UmVjZW50T3JkZXJzKFtdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWREYXNoYm9hcmQoKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBpc01vdW50ZWQgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgY2xvc2VVc2VyTWVudSA9ICgpID0+IHtcclxuICAgICAgc2V0SXNVc2VyTWVudU9wZW4oZmFsc2UpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VVc2VyTWVudSk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlVXNlck1lbnUpO1xyXG4gICAgfTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBsb2FkQ3VycmVudFVzZXIgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hZG1pbi9jb250ZXh0L2N1cnJlbnQtdXNlclwiLCB7XHJcbiAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxyXG4gICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0Q3VycmVudFVzZXJOYW1lKFN0cmluZyhwYXlsb2FkPy5uYW1lIHx8IFwiXCIpLnRyaW0oKSk7XHJcbiAgICAgICAgICBzZXRDdXJyZW50VXNlclJvbGUoXHJcbiAgICAgICAgICAgIFN0cmluZyhwYXlsb2FkPy5yb2xlIHx8IFwiXCIpXHJcbiAgICAgICAgICAgICAgLnRyaW0oKVxyXG4gICAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0Q3VycmVudFVzZXJOYW1lKFwiXCIpO1xyXG4gICAgICAgICAgc2V0Q3VycmVudFVzZXJSb2xlKFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkQ3VycmVudFVzZXIoKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBpc01vdW50ZWQgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCBhY3RpdmVQcm9kdWN0cyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgcmV0dXJuIHJlY29yZHMuZmlsdGVyKChwcm9kdWN0KSA9PiBwcm9kdWN0LmlzQWN0aXZlICE9PSBmYWxzZSk7XHJcbiAgfSwgW3JlY29yZHNdKTtcclxuXHJcbiAgY29uc3QgZmlsdGVyZWRQcm9kdWN0cyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3QgcXVlcnkgPSBzZWFyY2hUZXJtLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgIGlmICghcXVlcnkpIHtcclxuICAgICAgcmV0dXJuIGFjdGl2ZVByb2R1Y3RzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhY3RpdmVQcm9kdWN0cy5maWx0ZXIoKHByb2R1Y3QpID0+IHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBwcm9kdWN0Lm5hbWUsXHJcbiAgICAgICAgU3RyaW5nKHByb2R1Y3QuY2F0ZWdvcnlOYW1lIHx8IFwiXCIpLFxyXG4gICAgICAgIFN0cmluZyhwcm9kdWN0LnN0b2NrIHx8IFwiXCIpLFxyXG4gICAgICBdXHJcbiAgICAgICAgLmpvaW4oXCIgXCIpXHJcbiAgICAgICAgLnRvTG93ZXJDYXNlKClcclxuICAgICAgICAuaW5jbHVkZXMocXVlcnkpO1xyXG4gICAgfSk7XHJcbiAgfSwgW2FjdGl2ZVByb2R1Y3RzLCBzZWFyY2hUZXJtXSk7XHJcblxyXG4gIGNvbnN0IGhlcm9TbGlkZXMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogXCJpbWczLXN0YXRpY1wiLFxyXG4gICAgICAgIG5hbWU6IFwiTmV3IENvbGxlY3Rpb25cIixcclxuICAgICAgICBjYXRlZ29yeU5hbWU6IFwiRmVhdHVyZWRcIixcclxuICAgICAgICBpbWFnZVVybDogXCIvcHVibGljL2ltZzMucG5nXCIsXHJcbiAgICAgICAgaXNBY3RpdmU6IHRydWUsXHJcbiAgICAgICAgc3RvY2s6IDAsXHJcbiAgICAgICAgcHJpY2U6IDAsXHJcbiAgICAgICAgcmVjb3JkQWN0aW9uczogW10sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogXCJpbWc0LXN0YXRpY1wiLFxyXG4gICAgICAgIG5hbWU6IFwiTGF0ZXN0IERyb3BcIixcclxuICAgICAgICBjYXRlZ29yeU5hbWU6IFwiRmVhdHVyZWRcIixcclxuICAgICAgICBpbWFnZVVybDogXCIvcHVibGljL2ltZzQucG5nXCIsXHJcbiAgICAgICAgaXNBY3RpdmU6IHRydWUsXHJcbiAgICAgICAgc3RvY2s6IDAsXHJcbiAgICAgICAgcHJpY2U6IDAsXHJcbiAgICAgICAgcmVjb3JkQWN0aW9uczogW10sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogXCJpbWc1LXN0YXRpY1wiLFxyXG4gICAgICAgIG5hbWU6IFwiTGF0ZXN0IERyb3BcIixcclxuICAgICAgICBjYXRlZ29yeU5hbWU6IFwiRmVhdHVyZWRcIixcclxuICAgICAgICBpbWFnZVVybDogXCIvcHVibGljL2ltZzUucG5nXCIsXHJcbiAgICAgICAgaXNBY3RpdmU6IHRydWUsXHJcbiAgICAgICAgc3RvY2s6IDAsXHJcbiAgICAgICAgcHJpY2U6IDAsXHJcbiAgICAgICAgcmVjb3JkQWN0aW9uczogW10sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChoZXJvU2xpZGVzLmxlbmd0aCA8PSAxKSB7XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBzZXRDdXJyZW50U2xpZGUoKHByZXZpb3VzKSA9PiAocHJldmlvdXMgKyAxKSAlIGhlcm9TbGlkZXMubGVuZ3RoKTtcclxuICAgIH0sIDQyMDApO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aW1lcik7XHJcbiAgfSwgW2hlcm9TbGlkZXMubGVuZ3RoXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoY3VycmVudFNsaWRlID49IGhlcm9TbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgIHNldEN1cnJlbnRTbGlkZSgwKTtcclxuICAgIH1cclxuICB9LCBbY3VycmVudFNsaWRlLCBoZXJvU2xpZGVzLmxlbmd0aF0pO1xyXG5cclxuICBjb25zdCBmZWF0dXJlZFByb2R1Y3QgPVxyXG4gICAgaGVyb1NsaWRlc1tjdXJyZW50U2xpZGVdIHx8IGFjdGl2ZVByb2R1Y3RzWzBdIHx8IHJlY29yZHNbMF0gfHwgbnVsbDtcclxuICBjb25zdCBoZXJvSW1hZ2UgPSBwcm9kdWN0SW1hZ2UoZmVhdHVyZWRQcm9kdWN0KTtcclxuICBjb25zdCBoZXJvVGl0bGUgPSBmZWF0dXJlZFByb2R1Y3Q/Lm5hbWUgfHwgXCJSZXZpdmUgTWUgSmV0dFwiO1xyXG4gIGNvbnN0IGhlcm9TdWJ0aXRsZSA9IGZlYXR1cmVkUHJvZHVjdD8uY2F0ZWdvcnlOYW1lIHx8IFwiT3ZlcnNpemUgVGVlXCI7XHJcbiAgY29uc3QgaGVyb0hyZWYgPSBnZXRTaG93SHJlZihmZWF0dXJlZFByb2R1Y3QpO1xyXG4gIGNvbnN0IG9yZGVyc0xpc3RIcmVmID0gXCIvYWRtaW4vcmVzb3VyY2VzL09yZGVycy9hY3Rpb25zL2xpc3RcIjtcclxuXHJcbiAgY29uc3Qgc3BvdGxpZ2h0UHJvZHVjdHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiBmaWx0ZXJlZFByb2R1Y3RzLnNsaWNlKDAsIDUpO1xyXG4gIH0sIFtmaWx0ZXJlZFByb2R1Y3RzXSk7XHJcblxyXG4gIGNvbnN0IGNhdGVnb3JpZXMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICByZWNvcmRzLmZvckVhY2goKHByb2R1Y3QpID0+IHtcclxuICAgICAgY29uc3QgbmFtZSA9IFN0cmluZyhwcm9kdWN0LmNhdGVnb3J5TmFtZSB8fCBcIlNob3BcIik7XHJcbiAgICAgIGJ1Y2tldC5zZXQobmFtZSwgKGJ1Y2tldC5nZXQobmFtZSkgfHwgMCkgKyAxKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBBcnJheS5mcm9tKGJ1Y2tldC5lbnRyaWVzKCkpLm1hcCgoW25hbWUsIGNvdW50XSkgPT4gKHtcclxuICAgICAgbmFtZSxcclxuICAgICAgY291bnQsXHJcbiAgICB9KSk7XHJcbiAgfSwgW3JlY29yZHNdKTtcclxuXHJcbiAgY29uc3QgaXNBZG1pblVzZXIgPSBjdXJyZW50VXNlclJvbGUgPT09IFwiYWRtaW5cIjtcclxuICBjb25zdCByZWNlbnRQcm9kdWN0cyA9IEFycmF5LmlzQXJyYXkocmVjb3JkcykgPyByZWNvcmRzLnNsaWNlKDAsIDUpIDogW107XHJcbiAgY29uc3QgY2F0ZWdvcnlQcmV2aWV3ID0gY2F0ZWdvcmllcy5zbGljZSgwLCA2KTtcclxuXHJcbiAgaWYgKGlzQWRtaW5Vc2VyKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkXCI+XHJcbiAgICAgICAgPHN0eWxlPntgXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1kYXNoYm9hcmQge1xyXG4gICAgICAgICAgICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICAgICAgICAgICAgcGFkZGluZzogMjhweDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogI2Y4ZmFmYztcclxuICAgICAgICAgICAgY29sb3I6ICMwZjE3MmE7XHJcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBcIlBvcHBpbnNcIiwgXCJTZWdvZSBVSVwiLCBzYW5zLXNlcmlmO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWRhc2hib2FyZC1ncmlkIHtcclxuICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgZ2FwOiAxOHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWRhc2hib2FyZC1oZWFkZXIge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICAgICAgICAgIGdhcDogMTZweDtcclxuICAgICAgICAgICAgZmxleC13cmFwOiB3cmFwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWFjdGlvbnMge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbiAgICAgICAgICAgIGdhcDogMTBweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1hY3Rpb24ge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcclxuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGdhcDogOHB4O1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxMnB4IDE2cHg7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4xKTtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogI2ZmZmZmZjtcclxuICAgICAgICAgICAgY29sb3I6ICMwZjE3MmE7XHJcbiAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDI0cHggcmdiYSgxNSwgMjMsIDQyLCAwLjA2KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1hY3Rpb24tLXByaW1hcnkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNjM2NmYxIDAlLCAjOGI1Y2Y2IDEwMCUpO1xyXG4gICAgICAgICAgICBjb2xvcjogI2ZmZmZmZjtcclxuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWRhc2hib2FyZC10aXRsZSB7XHJcbiAgICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgyOHB4LCA0dncsIDQ2cHgpO1xyXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1kYXNoYm9hcmQtc3VidGl0bGUge1xyXG4gICAgICAgICAgICBtYXJnaW46IDhweCAwIDA7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjNjQ3NDhiO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWRhc2hib2FyZC1jYXJkcyB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDQsIG1pbm1heCgwLCAxZnIpKTtcclxuICAgICAgICAgICAgZ2FwOiAxNnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWNhcmQsXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1wYW5lbCB7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4wOCk7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmZmZmY7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMTZweCAzMHB4IHJnYmEoMTUsIDIzLCA0MiwgMC4wOCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tY2FyZCB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDE4cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tY2FyZC1sYWJlbCB7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjNjQ3NDhiO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjE0ZW07XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tY2FyZC12YWx1ZSB7XHJcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMzJweDtcclxuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDE7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA4MDA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLWxpbmtzIHtcclxuICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMywgbWlubWF4KDAsIDFmcikpO1xyXG4gICAgICAgICAgICBnYXA6IDE2cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tbGluayB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxOHB4O1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxOHB4O1xyXG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDE1LCAyMywgNDIsIDAuMDgpO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xyXG4gICAgICAgICAgICBjb2xvcjogIzBmMTcyYTtcclxuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMjRweCByZ2JhKDE1LCAyMywgNDIsIDAuMDYpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWxpbmsgc3Ryb25nIHtcclxuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMThweDtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogNnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLXNlY3Rpb24tdGl0bGUge1xyXG4gICAgICAgICAgICBtYXJnaW46IDA7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1jYXRlZ29yeS1saXN0IHtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogMTRweDtcclxuICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgZ2FwOiAxMnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWNhdGVnb3J5LWl0ZW0ge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICAgICAgICAgIGdhcDogMTJweDtcclxuICAgICAgICAgICAgcGFkZGluZzogMTRweCAxNnB4O1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xyXG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDE1LCAyMywgNDIsIDAuMDgpO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZjhmYWZjO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWNhdGVnb3J5LW5hbWUge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogNHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWNhdGVnb3J5LW1ldGEge1xyXG4gICAgICAgICAgICBjb2xvcjogIzY0NzQ4YjtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxM3B4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAxMTAwcHgpIHtcclxuICAgICAgICAgICAgLmNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLWNhcmRzLFxyXG4gICAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1kYXNoYm9hcmQtbGlua3Mge1xyXG4gICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgwLCAxZnIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA3MjBweCkge1xyXG4gICAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1kYXNoYm9hcmQge1xyXG4gICAgICAgICAgICAgIHBhZGRpbmc6IDE4cHg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWRhc2hib2FyZC1jYXJkcyxcclxuICAgICAgICAgICAgLmNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLWxpbmtzIHtcclxuICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGB9PC9zdHlsZT5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWRhc2hib2FyZC1ncmlkXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLWhlYWRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWRhc2hib2FyZC10aXRsZVwiPkFkbWluIERhc2hib2FyZDwvaDE+XHJcbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1kYXNoYm9hcmQtc3VidGl0bGVcIj5cclxuICAgICAgICAgICAgICAgIE1hbmFnZSB5b3VyIHNob3AgZGF0YSwgcHJvZHVjdHMsIG9yZGVycywgYW5kIHVzZXJzIGZyb20gaGVyZS5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWFjdGlvbnNcIj5cclxuICAgICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1hY3Rpb24gY2hhbmdlOC1hZG1pbi1hY3Rpb24tLXByaW1hcnlcIlxyXG4gICAgICAgICAgICAgICAgaHJlZj1cIi9hZG1pbi9yZXNvdXJjZXMvUHJvZHVjdHMvYWN0aW9ucy9uZXdcIlxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICsgQWRkIFByb2R1Y3RcclxuICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tYWN0aW9uXCJcclxuICAgICAgICAgICAgICAgIGhyZWY9XCIvYWRtaW4vcmVzb3VyY2VzL0NhdGVnb3JpZXMvYWN0aW9ucy9uZXdcIlxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICsgQWRkIENhdGVnb3J5XHJcbiAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1kYXNoYm9hcmQtY2FyZHNcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhcmRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tY2FyZC1sYWJlbFwiPlVzZXJzPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhcmQtdmFsdWVcIj57c3VtbWFyeS51c2Vyc308L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXJkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhcmQtbGFiZWxcIj5Qcm9kdWN0czwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXJkLXZhbHVlXCI+e3N1bW1hcnkucHJvZHVjdHN9PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tY2FyZFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXJkLWxhYmVsXCI+T3JkZXJzPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhcmQtdmFsdWVcIj57c3VtbWFyeS5vcmRlcnN9PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tY2FyZFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXJkLWxhYmVsXCI+Q2F0ZWdvcmllczwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXJkLXZhbHVlXCI+XHJcbiAgICAgICAgICAgICAgICB7c3VtbWFyeS5jYXRlZ29yaWVzfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1kYXNoYm9hcmQtbGlua3NcIj5cclxuICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWxpbmtcIlxyXG4gICAgICAgICAgICAgIGhyZWY9XCIvYWRtaW4vcmVzb3VyY2VzL1Byb2R1Y3RzL2FjdGlvbnMvbGlzdFwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8c3Ryb25nPlByb2R1Y3RzPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgT3BlbiBwcm9kdWN0IGxpc3QgYW5kIG1hbmFnZSBpbnZlbnRvcnkuXHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWxpbmtcIlxyXG4gICAgICAgICAgICAgIGhyZWY9XCIvYWRtaW4vcmVzb3VyY2VzL09yZGVycy9hY3Rpb25zL2xpc3RcIlxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz5PcmRlcnM8L3N0cm9uZz5cclxuICAgICAgICAgICAgICBSZXZpZXcgYW5kIHByb2Nlc3MgY3VzdG9tZXIgb3JkZXJzLlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1saW5rXCJcclxuICAgICAgICAgICAgICBocmVmPVwiL2FkbWluL3Jlc291cmNlcy9Vc2Vycy9hY3Rpb25zL2xpc3RcIlxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz5Vc2Vyczwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIFZpZXcgcmVnaXN0ZXJlZCB1c2VycyBhbmQgcm9sZXMuXHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICBkaXNwbGF5OiBcImdyaWRcIixcclxuICAgICAgICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcInJlcGVhdCgyLCBtaW5tYXgoMCwgMWZyKSlcIixcclxuICAgICAgICAgICAgICBnYXA6IFwiMTZweFwiLFxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tcGFuZWxcIiBzdHlsZT17eyBwYWRkaW5nOiBcIjIwcHhcIiB9fT5cclxuICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1zZWN0aW9uLXRpdGxlXCI+UmVjZW50IFByb2R1Y3RzPC9oMj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogXCIxNHB4XCIsIGRpc3BsYXk6IFwiZ3JpZFwiLCBnYXA6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgICAge3JlY2VudFByb2R1Y3RzLm1hcCgocHJvZHVjdCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgICAgICAgIGtleT17cHJvZHVjdC5pZH1cclxuICAgICAgICAgICAgICAgICAgICBocmVmPXtnZXRTaG93SHJlZihwcm9kdWN0KX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBnYXA6IFwiMTJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogXCIxNHB4IDE2cHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4wOClcIixcclxuICAgICAgICAgICAgICAgICAgICAgIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiMwZjE3MmFcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgZGlzcGxheTogXCJibG9ja1wiLCBtYXJnaW5Cb3R0b206IFwiNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtwcm9kdWN0Lm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM2NDc0OGJcIiwgZm9udFNpemU6IFwiMTNweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBTdG9jazoge3Byb2R1Y3Quc3RvY2t9IHwge3Byb2R1Y3QuY2F0ZWdvcnlOYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiA3MDAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0Q3VycmVuY3kocHJvZHVjdC5wcmljZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tcGFuZWxcIiBzdHlsZT17eyBwYWRkaW5nOiBcIjIwcHhcIiB9fT5cclxuICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1zZWN0aW9uLXRpdGxlXCI+UmVjZW50IE9yZGVyczwvaDI+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6IFwiMTRweFwiLCBkaXNwbGF5OiBcImdyaWRcIiwgZ2FwOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICAgIHtyZWNlbnRPcmRlcnMubWFwKChvcmRlcikgPT4gKFxyXG4gICAgICAgICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgICAgICAgIGtleT17b3JkZXIuaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgaHJlZj17YC9hZG1pbi9yZXNvdXJjZXMvT3JkZXJzL3JlY29yZHMvJHtlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKG9yZGVyLmlkKSl9L3Nob3dgfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICAgICAgICAgICAgICAgICAgICAgIGdhcDogXCIxMnB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjE0cHggMTZweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjE0cHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNSwgMjMsIDQyLCAwLjA4KVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dERlY29yYXRpb246IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzBmMTcyYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCIjZjhmYWZjXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBkaXNwbGF5OiBcImJsb2NrXCIsIG1hcmdpbkJvdHRvbTogXCI0cHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge29yZGVyLnVzZXJOYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjNjQ3NDhiXCIsIGZvbnRTaXplOiBcIjEzcHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge29yZGVyLnN0YXR1c30gfHtcIiBcIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAge29yZGVyLmNyZWF0ZWRBdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8gbmV3IERhdGUob3JkZXIuY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJOZXdcIn1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogNzAwIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdEN1cnJlbmN5KG9yZGVyLnRvdGFsQW1vdW50KX1cclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1wYW5lbFwiIHN0eWxlPXt7IHBhZGRpbmc6IFwiMjBweFwiIH19PlxyXG4gICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1zZWN0aW9uLXRpdGxlXCI+Q2F0ZWdvcmllczwvaDI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXRlZ29yeS1saXN0XCI+XHJcbiAgICAgICAgICAgICAge2NhdGVnb3J5UHJldmlldy5tYXAoKGNhdGVnb3J5KSA9PiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIGtleT17Y2F0ZWdvcnkubmFtZX1cclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXRlZ29yeS1pdGVtXCJcclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhdGVnb3J5LW5hbWVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIHtjYXRlZ29yeS5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tY2F0ZWdvcnktbWV0YVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgUHJvZHVjdHMgaW4gY2F0ZWdvcnlcclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogNzAwIH19PntjYXRlZ29yeS5jb3VudH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZFwiPlxyXG4gICAgICA8c3R5bGU+e2BcclxuICAgICAgICAuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZCB7XHJcbiAgICAgICAgICAtLWJnOiAjZjdmN2Y3O1xyXG4gICAgICAgICAgLS10ZXh0OiAjMTExMTExO1xyXG4gICAgICAgICAgLS1tdXRlZDogIzY2NjY2NjtcclxuICAgICAgICAgIC0tbGluZTogcmdiYSgxNywgMTcsIDE3LCAwLjA4KTtcclxuICAgICAgICAgIC0tYWNjZW50OiAjZmYyZDhiO1xyXG4gICAgICAgICAgLS1zdWNjZXNzOiAjNDVkMjU1O1xyXG4gICAgICAgICAgbWluLWhlaWdodDogMTAwdmg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZyk7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dCk7XHJcbiAgICAgICAgICBmb250LWZhbWlseTogXCJQb3BwaW5zXCIsIFwiU2Vnb2UgVUlcIiwgc2Fucy1zZXJpZjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNoZWxsIHtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC10b3Atc3RyaXAge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tc3VjY2Vzcyk7XHJcbiAgICAgICAgICBjb2xvcjogIzAwMDtcclxuICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTNweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDdweCAxMnB4O1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMDFlbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LW5hdiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjMDUwNTA1O1xyXG4gICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIGF1dG8gMWZyO1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGdhcDogMTZweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDE4cHggMjhweDtcclxuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgIHotaW5kZXg6IDMwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtbmF2LWxpbmtzIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbiAgICAgICAgICBnYXA6IDI4cHg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LW5hdi11c2VyLWRpc3BsYXkge1xyXG4gICAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgZ2FwOiAxMHB4O1xyXG4gICAgICAgICAgbWluLWhlaWdodDogMzRweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDhweCAxNHB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDgpO1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEyKTtcclxuICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTNweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4wMmVtO1xyXG4gICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LW5hdi11c2VyLWRpc3BsYXk6OmJlZm9yZSB7XHJcbiAgICAgICAgICBjb250ZW50OiBcIlwiO1xyXG4gICAgICAgICAgd2lkdGg6IDhweDtcclxuICAgICAgICAgIGhlaWdodDogOHB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1hY2NlbnQpO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCAwIDAgNHB4IHJnYmEoMjU1LCA0NSwgMTM5LCAwLjE2KTtcclxuICAgICAgICAgIGZsZXg6IDAgMCBhdXRvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtbmF2LWxpbmtzIGEge1xyXG4gICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtbmF2LWxpbmtzIGEuaXMtYWN0aXZlIHtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1hY2NlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtYnJhbmQge1xyXG4gICAgICAgICAgd2lkdGg6IDg2cHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDg2cHg7XHJcbiAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgMzUlIDI4JSwgI2Y3ZmY1OSAwJSwgIzFlYzYzYSAzNCUsICMxMTEgMTAwJSk7XHJcbiAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxN3B4O1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDAuOTU7XHJcbiAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMjVweCByZ2JhKDAsIDAsIDAsIDAuMzUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtYnJhbmQgc21hbGwge1xyXG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEwcHg7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xMmVtO1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogNHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtbmF2LWFjdGlvbnMge1xyXG4gICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xyXG4gICAgICAgICAgZ2FwOiAxNHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc2VhcmNoIHtcclxuICAgICAgICAgIHdpZHRoOiBtaW4oMTAwJSwgMjgwcHgpO1xyXG4gICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBnYXA6IDEycHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxMnB4IDE4cHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gICAgICAgICAgY29sb3I6ICMxMTE7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMDgpO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDIwcHggcmdiYSgwLCAwLCAwLCAwLjEyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNlYXJjaCBzdmcge1xyXG4gICAgICAgICAgZmxleDogMCAwIGF1dG87XHJcbiAgICAgICAgICBzdHJva2U6ICM2NjY7XHJcbiAgICAgICAgICBvcGFjaXR5OiAwLjc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zZWFyY2ggaW5wdXQge1xyXG4gICAgICAgICAgYm9yZGVyOiAwO1xyXG4gICAgICAgICAgb3V0bGluZTogMDtcclxuICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogI2ZmZiAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgLXdlYmtpdC1ib3gtc2hhZG93OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBjb2xvcjogIzExMTtcclxuICAgICAgICAgIGZvbnQ6IGluaGVyaXQ7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgICBtaW4td2lkdGg6IDA7XHJcbiAgICAgICAgICBhcHBlYXJhbmNlOiBub25lO1xyXG4gICAgICAgICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xyXG4gICAgICAgICAgY2FyZXQtY29sb3I6ICMxMTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zZWFyY2ggaW5wdXQ6OnBsYWNlaG9sZGVyIHtcclxuICAgICAgICAgIGNvbG9yOiAjOTk5O1xyXG4gICAgICAgICAgb3BhY2l0eTogMC44O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc2VhcmNoIGlucHV0Oi13ZWJraXQtYXV0b2ZpbGwsXHJcbiAgICAgICAgLmNoYW5nZTgtc2VhcmNoIGlucHV0Oi13ZWJraXQtYXV0b2ZpbGw6aG92ZXIsXHJcbiAgICAgICAgLmNoYW5nZTgtc2VhcmNoIGlucHV0Oi13ZWJraXQtYXV0b2ZpbGw6Zm9jdXMsXHJcbiAgICAgICAgLmNoYW5nZTgtc2VhcmNoIGlucHV0Oi13ZWJraXQtYXV0b2ZpbGw6YWN0aXZlIHtcclxuICAgICAgICAgIC13ZWJraXQtdGV4dC1maWxsLWNvbG9yOiAjMTExICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAtd2Via2l0LWJveC1zaGFkb3c6IDAgMCAwIDEwMDBweCAjZmZmIGluc2V0ICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDAgMCAxMDAwcHggI2ZmZiBpbnNldCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgY2FyZXQtY29sb3I6ICMxMTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1pY29uIHtcclxuICAgICAgICAgIHdpZHRoOiAzNHB4O1xyXG4gICAgICAgICAgaGVpZ2h0OiAzNHB4O1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgICAgICAgIGJvcmRlcjogMnB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45Mik7XHJcbiAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1jYXJ0LWJ1dHRvbiB7XHJcbiAgICAgICAgICBwYWRkaW5nOiAwO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XHJcbiAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC11c2VyLWZhbGxiYWNrIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGdhcDogMTBweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXVzZXItZmFsbGJhY2sgLmNoYW5nZTgtaWNvbiB7XHJcbiAgICAgICAgICBmbGV4OiAwIDAgYXV0bztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXVzZXItbWVudSB7XHJcbiAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC11c2VyLXRvZ2dsZSB7XHJcbiAgICAgICAgICBhcHBlYXJhbmNlOiBub25lO1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEyKTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wOCk7XHJcbiAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDhweCAxNHB4O1xyXG4gICAgICAgICAgbWluLWhlaWdodDogMzRweDtcclxuICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGdhcDogMTBweDtcclxuICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICAgIGZvbnQ6IGluaGVyaXQ7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMDJlbTtcclxuICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC11c2VyLXRvZ2dsZTo6YmVmb3JlIHtcclxuICAgICAgICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICAgICAgICB3aWR0aDogOHB4O1xyXG4gICAgICAgICAgaGVpZ2h0OiA4cHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWFjY2VudCk7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDAgMCA0cHggcmdiYSgyNTUsIDQ1LCAxMzksIDAuMTYpO1xyXG4gICAgICAgICAgZmxleDogMCAwIGF1dG87XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC11c2VyLWRyb3Bkb3duIHtcclxuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgIHRvcDogY2FsYygxMDAlICsgMTBweCk7XHJcbiAgICAgICAgICByaWdodDogMDtcclxuICAgICAgICAgIG1pbi13aWR0aDogMTcwcHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxNHB4IDEycHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogIzBkMTMyMDtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xMik7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDE4cHggMzBweCByZ2JhKDAsIDAsIDAsIDAuMzIpO1xyXG4gICAgICAgICAgei1pbmRleDogMjA7XHJcbiAgICAgICAgICBvdmVyZmxvdzogdmlzaWJsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWxvZ291dC1idXR0b24ge1xyXG4gICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICBib3JkZXI6IDA7XHJcbiAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmYyZDhiO1xyXG4gICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMTRweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDEzcHggMTZweDtcclxuICAgICAgICAgIGZvbnQ6IGluaGVyaXQ7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMDJlbTtcclxuICAgICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQgMC4ycyBlYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtbG9nb3V0LWJ1dHRvbjpob3ZlciB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmY0YTliO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtbG9nb3V0LWJ1dHRvbjphY3RpdmUge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogI2ZmMWE3YztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWljb24gc3ZnIHtcclxuICAgICAgICAgIHdpZHRoOiAxOHB4O1xyXG4gICAgICAgICAgaGVpZ2h0OiAxOHB4O1xyXG4gICAgICAgICAgc3Ryb2tlOiBjdXJyZW50Q29sb3I7XHJcbiAgICAgICAgICBmaWxsOiBub25lO1xyXG4gICAgICAgICAgc3Ryb2tlLXdpZHRoOiAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtYmFkZ2Uge1xyXG4gICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgdG9wOiAtN3B4O1xyXG4gICAgICAgICAgcmlnaHQ6IC03cHg7XHJcbiAgICAgICAgICBtaW4td2lkdGg6IDE3cHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDE3cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAwIDRweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogI2ZmNmI2YjtcclxuICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTBweDtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBwbGFjZS1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT1cImxpZ2h0XCJdIC5jaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkIC5jaGFuZ2U4LW5hdiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZjNmNGY2O1xyXG4gICAgICAgICAgY29sb3I6ICMxMTE4Mjc7XHJcbiAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjA4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT1cImxpZ2h0XCJdIC5jaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkIC5jaGFuZ2U4LW5hdi1saW5rcyBhIHtcclxuICAgICAgICAgIGNvbG9yOiAjMTExODI3O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPVwibGlnaHRcIl0gLmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQgLmNoYW5nZTgtbmF2LWxpbmtzIGEuaXMtYWN0aXZlIHtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1hY2NlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPVwibGlnaHRcIl0gLmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQgLmNoYW5nZTgtaWNvbiB7XHJcbiAgICAgICAgICBjb2xvcjogIzExMTgyNztcclxuICAgICAgICAgIGJvcmRlci1jb2xvcjogcmdiYSgxNywgMjQsIDM5LCAwLjIpO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogI2ZmZmZmZjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT1cImxpZ2h0XCJdIC5jaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkIC5jaGFuZ2U4LXVzZXItdG9nZ2xlIHtcclxuICAgICAgICAgIGNvbG9yOiAjMTExODI3O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogI2ZmZmZmZjtcclxuICAgICAgICAgIGJvcmRlci1jb2xvcjogcmdiYSgxNywgMjQsIDM5LCAwLjE1KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT1cImxpZ2h0XCJdIC5jaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkIC5jaGFuZ2U4LXVzZXItZHJvcGRvd24ge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogI2ZmZmZmZjtcclxuICAgICAgICAgIGJvcmRlci1jb2xvcjogcmdiYSgxNywgMjQsIDM5LCAwLjEyKTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMTJweCAyNnB4IHJnYmEoMTUsIDIzLCA0MiwgMC4xMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1jb250ZW50IHtcclxuICAgICAgICAgIGZsZXg6IDE7XHJcbiAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgICB6LWluZGV4OiAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtaGVybyB7XHJcbiAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgICBtaW4taGVpZ2h0OiA0NzBweDtcclxuICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtaGVybzo6YmVmb3JlIHtcclxuICAgICAgICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICBpbnNldDogMDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgwLCAwLCAwLCAwLjA4KSAwJSwgcmdiYSgwLCAwLCAwLCAwLjAzKSA0NiUsIHJnYmEoMCwgMCwgMCwgMCkgMTAwJSk7XHJcbiAgICAgICAgICB6LWluZGV4OiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtaGVyby1pbWFnZSB7XHJcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICBpbnNldDogMDtcclxuICAgICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcIiR7aGVyb0ltYWdlfVwiKTtcclxuICAgICAgICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XHJcbiAgICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWhlcm8tY29weSB7XHJcbiAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgICB6LWluZGV4OiAxO1xyXG4gICAgICAgICAgd2lkdGg6IG1pbigxMDAlLCA1NjBweCk7XHJcbiAgICAgICAgICBtYXJnaW4tbGVmdDogYXV0bztcclxuICAgICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgcGFkZGluZzogMjRweCAzOHB4IDU2cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1oZXJvLWV5ZWJyb3cge1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMThlbTtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgb3BhY2l0eTogMC45NTtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEycHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1oZXJvLXRpdGxlIHtcclxuICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogY2xhbXAoNDBweCwgNC44dncsIDY2cHgpO1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDAuOTU7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAtMC4wM2VtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtaGVyby1zdWJ0aXRsZSB7XHJcbiAgICAgICAgICBtYXJnaW46IDEycHggMCAwO1xyXG4gICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgxOHB4LCAyLjJ2dywgMjhweCk7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4zNGVtO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIG9wYWNpdHk6IDAuOTU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1oZXJvLWJ1dHRvbiB7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAzMHB4O1xyXG4gICAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgICBtaW4td2lkdGg6IDE3MHB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMTZweCAyMnB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgICBib3JkZXI6IDA7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcclxuICAgICAgICAgIGNvbG9yOiAjMTExO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMTRlbTtcclxuICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMTBweCAyNXB4IHJnYmEoMCwgMCwgMCwgMC4yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNsaWRlci1hcnJvdyB7XHJcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICB0b3A6IDUwJTtcclxuICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcclxuICAgICAgICAgIHdpZHRoOiA1NHB4O1xyXG4gICAgICAgICAgaGVpZ2h0OiA1NHB4O1xyXG4gICAgICAgICAgYm9yZGVyOiAwO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XHJcbiAgICAgICAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjg4KTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogNjRweDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xyXG4gICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgICAgei1pbmRleDogMjtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBwbGFjZS1pdGVtczogY2VudGVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc2xpZGVyLWFycm93OmhvdmVyIHtcclxuICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNsaWRlci1hcnJvdy0tbGVmdCB7XHJcbiAgICAgICAgICBsZWZ0OiA4cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zbGlkZXItYXJyb3ctLXJpZ2h0IHtcclxuICAgICAgICAgIHJpZ2h0OiA4cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zbGlkZXItZG90cyB7XHJcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICBsZWZ0OiA1MCU7XHJcbiAgICAgICAgICBib3R0b206IDEycHg7XHJcbiAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgZ2FwOiAxMHB4O1xyXG4gICAgICAgICAgei1pbmRleDogMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNsaWRlci1kb3Qge1xyXG4gICAgICAgICAgd2lkdGg6IDE2cHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDE2cHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgICAgICAgICBib3JkZXI6IDA7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOTIpO1xyXG4gICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc2xpZGVyLWRvdC5pcy1hY3RpdmUge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogIzM5ZDM1MztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3RzIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gICAgICAgICAgcGFkZGluZzogMTJweCAwIDEwcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9kdWN0cy1oZWFkIHtcclxuICAgICAgICAgIHBhZGRpbmc6IDEwcHggMTRweCAyMHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZHVjdHMtdGl0bGUge1xyXG4gICAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgyOHB4LCAzdncsIDQycHgpO1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDE7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3QtZ3JpZCB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoNSwgbWlubWF4KDAsIDFmcikpO1xyXG4gICAgICAgICAgZ2FwOiAxOHB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMCAxNHB4IDE4cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LWNhcmQge1xyXG4gICAgICAgICAgY29sb3I6ICMxMTE7XHJcbiAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LW1lZGlhIHtcclxuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgIGFzcGVjdC1yYXRpbzogMC45NTtcclxuICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZTVlN2ViO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1tZWRpYSBpbWcge1xyXG4gICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgICBvYmplY3QtZml0OiBjb3ZlcjtcclxuICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtZmF2b3JpdGUge1xyXG4gICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgdG9wOiAxMHB4O1xyXG4gICAgICAgICAgbGVmdDogMTBweDtcclxuICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMjFweDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xyXG4gICAgICAgICAgdGV4dC1zaGFkb3c6IDAgMXB4IDRweCByZ2JhKDAsIDAsIDAsIDAuMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LW5hbWUge1xyXG4gICAgICAgICAgbWFyZ2luOiAxMHB4IDAgMDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMThweDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjEyO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDQwcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LXByaWNlIHtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDhweDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LXByaWNlIHMge1xyXG4gICAgICAgICAgY29sb3I6ICM2NjY7XHJcbiAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDZweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWVtcHR5LFxyXG4gICAgICAgIC5jaGFuZ2U4LWxvYWRpbmcge1xyXG4gICAgICAgICAgbWFyZ2luOiAwIDE0cHggMThweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDIycHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxOHB4O1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggZGFzaGVkIHJnYmEoMTcsIDE3LCAxNywgMC4xOCk7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNyk7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tbXV0ZWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDEyMDBweCkge1xyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1ncmlkIHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMywgbWlubWF4KDAsIDFmcikpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDgyMHB4KSB7XHJcbiAgICAgICAgICAuY2hhbmdlOC1uYXYge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgICAgICAgICAganVzdGlmeS1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LW5hdi1saW5rcyB7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgICAgICBnYXA6IDE4cHg7XHJcbiAgICAgICAgICAgIGZsZXgtd3JhcDogd3JhcDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1uYXYtYWN0aW9ucyB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICAgICAgZmxleC13cmFwOiB3cmFwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LW5hdi11c2VyLWRpc3BsYXkge1xyXG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtaGVyby1jb3B5IHtcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDIycHggMjBweCA1NnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXByb2R1Y3QtZ3JpZCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgwLCAxZnIpKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1zbGlkZXItYXJyb3cge1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDQ0cHg7XHJcbiAgICAgICAgICAgIHdpZHRoOiA0MHB4O1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwcHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtc2xpZGVyLWFycm93LS1sZWZ0IHtcclxuICAgICAgICAgICAgbGVmdDogNHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXNsaWRlci1hcnJvdy0tcmlnaHQge1xyXG4gICAgICAgICAgICByaWdodDogNHB4O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDU2MHB4KSB7XHJcbiAgICAgICAgICAuY2hhbmdlOC1uYXYge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxNHB4IDE2cHggMTZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1icmFuZCB7XHJcbiAgICAgICAgICAgIHdpZHRoOiA3MnB4O1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDcycHg7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1zZWFyY2gge1xyXG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1oZXJvIHtcclxuICAgICAgICAgICAgbWluLWhlaWdodDogNDIwcHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtaGVyby10aXRsZSB7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogY2xhbXAoMzJweCwgMTJ2dywgNDhweCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtaGVyby1zdWJ0aXRsZSB7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMjRlbTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1oZXJvLWJ1dHRvbiB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXByb2R1Y3QtZ3JpZCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgYH08L3N0eWxlPlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXNoZWxsXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXRvcC1zdHJpcFwiPlxyXG4gICAgICAgICAgRlJFRSBTSElQUElORyBub3cgYXZhaWxhYmxlIGluIFNyaSBMYW5rYVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiY2hhbmdlOC1uYXZcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1uYXYtbGlua3NcIiBhcmlhLWxhYmVsPVwiUHJpbWFyeVwiPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI2hlcm9cIiBjbGFzc05hbWU9XCJpcy1hY3RpdmVcIj5cclxuICAgICAgICAgICAgICBIb21lXHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPGEgaHJlZj1cIi9hZG1pbi9yZXNvdXJjZXMvUHJvZHVjdHMvYWN0aW9ucy9saXN0XCI+UHJvZHVjdDwvYT5cclxuICAgICAgICAgICAgPGEgaHJlZj1cIi9hZG1pbi9wYWdlcy9BYm91dFwiPkFib3V0PC9hPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI2NvbnRhY3RcIj5Db250YWN0IFVzPC9hPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWJyYW5kXCIgYXJpYS1sYWJlbD1cIlN0b3JlIGJyYW5kXCI+XHJcbiAgICAgICAgICAgIGNoYW51a2FcclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1uYXYtYWN0aW9uc1wiPlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2hhbmdlOC1zZWFyY2hcIiBodG1sRm9yPVwiY2hhbmdlOC1zZWFyY2gtaW5wdXRcIj5cclxuICAgICAgICAgICAgICA8c3ZnXHJcbiAgICAgICAgICAgICAgICB3aWR0aD1cIjE4XCJcclxuICAgICAgICAgICAgICAgIGhlaWdodD1cIjE4XCJcclxuICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxyXG4gICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxyXG4gICAgICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcclxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMlwiXHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjExXCIgY3k9XCIxMVwiIHI9XCI3XCIgLz5cclxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjAgMjBsLTMuNS0zLjVcIiAvPlxyXG4gICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgaWQ9XCJjaGFuZ2U4LXNlYXJjaC1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICB0eXBlPVwic2VhcmNoXCJcclxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoIFByb2R1Y3RzXCJcclxuICAgICAgICAgICAgICAgIHZhbHVlPXtzZWFyY2hUZXJtfVxyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0U2VhcmNoVGVybShldmVudC50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvbGFiZWw+XHJcblxyXG4gICAgICAgICAgICB7Y3VycmVudFVzZXJOYW1lID8gKFxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC11c2VyLW1lbnVcIj5cclxuICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtdXNlci10b2dnbGVcIlxyXG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiTG9nZ2VkIGluIHVzZXIgbWVudVwiXHJcbiAgICAgICAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9e2lzVXNlck1lbnVPcGVufVxyXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRJc1VzZXJNZW51T3BlbigocHJldmlvdXMpID0+ICFwcmV2aW91cyk7XHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtjdXJyZW50VXNlck5hbWV9XHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuXHJcbiAgICAgICAgICAgICAgICB7aXNVc2VyTWVudU9wZW4gPyAoXHJcbiAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LXVzZXItZHJvcGRvd25cIlxyXG4gICAgICAgICAgICAgICAgICAgIHJvbGU9XCJtZW51XCJcclxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpfVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LWxvZ291dC1idXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRJc1VzZXJNZW51T3BlbihmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvYWRtaW4vbG9nb3V0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgIExvZ291dFxyXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICkgOiBudWxsfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC11c2VyLWZhbGxiYWNrXCIgYXJpYS1sYWJlbD1cIkFjY291bnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1pY29uXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiOFwiIHI9XCI0XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTQgMjBjMS44LTQuMiA1LTYgOC02czYuMiAxLjggOCA2XCIgLz5cclxuICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1pY29uXCIgYXJpYS1sYWJlbD1cIldpc2hsaXN0XCI+XHJcbiAgICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XHJcbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEyIDIxcy03LTQuNi05LjItOS4yQy44IDguMiAyLjQgNSA1LjggNWMxLjggMCAzLjIgMSA0LjIgMi4yQzExIDYgMTIuNSA1IDE0LjIgNWMzLjQgMCA1IDMuMiAzIDYuOEMxOSAxNi40IDEyIDIxIDEyIDIxelwiIC8+XHJcbiAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtaWNvbiBjaGFuZ2U4LWNhcnQtYnV0dG9uXCJcclxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiQ2FydFwiXHJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihvcmRlcnNMaXN0SHJlZik7XHJcbiAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxyXG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk0zIDRoMmwyLjIgMTEuM0EyIDIgMCAwIDAgOS4yIDE3SDE4YTIgMiAwIDAgMCAyLTEuNmwxLjEtNi40SDYuMVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PVwiOVwiIGN5PVwiMjBcIiByPVwiMS41XCIgLz5cclxuICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCIxN1wiIGN5PVwiMjBcIiByPVwiMS41XCIgLz5cclxuICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjaGFuZ2U4LWJhZGdlXCI+XHJcbiAgICAgICAgICAgICAgICB7TWF0aC5tYXgoMCwgTnVtYmVyKHN1bW1hcnk/Lm9yZGVycyB8fCAwKSl9XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgIDxtYWluIGNsYXNzTmFtZT1cImNoYW5nZTgtY29udGVudFwiPlxyXG4gICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY2hhbmdlOC1oZXJvXCIgaWQ9XCJoZXJvXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1oZXJvLWltYWdlXCIgLz5cclxuXHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LXNsaWRlci1hcnJvdyBjaGFuZ2U4LXNsaWRlci1hcnJvdy0tbGVmdFwiXHJcbiAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlByZXZpb3VzIHNsaWRlXCJcclxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWhlcm9TbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZXRDdXJyZW50U2xpZGUoKHByZXZpb3VzKSA9PlxyXG4gICAgICAgICAgICAgICAgICBwcmV2aW91cyA9PT0gMCA/IGhlcm9TbGlkZXMubGVuZ3RoIC0gMSA6IHByZXZpb3VzIC0gMSxcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIOKAuVxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuXHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LXNsaWRlci1hcnJvdyBjaGFuZ2U4LXNsaWRlci1hcnJvdy0tcmlnaHRcIlxyXG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJOZXh0IHNsaWRlXCJcclxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWhlcm9TbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZXRDdXJyZW50U2xpZGUoXHJcbiAgICAgICAgICAgICAgICAgIChwcmV2aW91cykgPT4gKHByZXZpb3VzICsgMSkgJSBoZXJvU2xpZGVzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIOKAulxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1oZXJvLWNvcHlcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtaGVyby1leWVicm93XCI+TmV3IHNlYXNvbiBkcm9wPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImNoYW5nZTgtaGVyby10aXRsZVwiPntoZXJvVGl0bGV9PC9oMT5cclxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjaGFuZ2U4LWhlcm8tc3VidGl0bGVcIj57aGVyb1N1YnRpdGxlfTwvcD5cclxuICAgICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgICAgaHJlZj17aGVyb0hyZWYgfHwgXCIjcHJvZHVjdHNcIn1cclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtaGVyby1idXR0b25cIlxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17KGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICghaGVyb0hyZWYpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIFNob3AgTm93XHJcbiAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LXNsaWRlci1kb3RzXCJcclxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiQ2Fyb3VzZWwgbmF2aWdhdGlvblwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICB7aGVyb1NsaWRlcy5tYXAoKHNsaWRlLCBpbmRleCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICBrZXk9e3NsaWRlLmlkIHx8IGAke3NsaWRlLm5hbWV9LSR7aW5kZXh9YH1cclxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGNoYW5nZTgtc2xpZGVyLWRvdCAke2luZGV4ID09PSBjdXJyZW50U2xpZGUgPyBcImlzLWFjdGl2ZVwiIDogXCJcIn1gfVxyXG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgR28gdG8gc2xpZGUgJHtpbmRleCArIDF9YH1cclxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q3VycmVudFNsaWRlKGluZGV4KX1cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9zZWN0aW9uPlxyXG5cclxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdHNcIiBpZD1cInByb2R1Y3RzXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0cy1oZWFkXCI+XHJcbiAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdHMtdGl0bGVcIj5PdXIgUHJvZHVjdHM8L2gyPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIHtsb2FkaW5nID8gKFxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1sb2FkaW5nXCI+TG9hZGluZyBwcm9kdWN0cy4uLjwvZGl2PlxyXG4gICAgICAgICAgICApIDogc3BvdGxpZ2h0UHJvZHVjdHMubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1lbXB0eVwiPk5vIHByb2R1Y3RzIGZvdW5kLjwvZGl2PlxyXG4gICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LWdyaWRcIj5cclxuICAgICAgICAgICAgICAgIHtzcG90bGlnaHRQcm9kdWN0cy5tYXAoKHByb2R1Y3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgY29uc3QgaHJlZiA9IGdldFNob3dIcmVmKHByb2R1Y3QpO1xyXG4gICAgICAgICAgICAgICAgICBjb25zdCBpbWFnZSA9IHByb2R1Y3RJbWFnZShwcm9kdWN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGFydGljbGUga2V5PXtwcm9kdWN0LmlkfT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdC1jYXJkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHJlZj17aHJlZiB8fCBcIiNcIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFocmVmKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3QtbWVkaWFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7aW1hZ2UgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2V9IGFsdD17cHJvZHVjdC5uYW1lfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VJdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjMTExXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogODAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBcIjIycHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjZGJlYWZlLCAjZmNlN2YzKVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdExhYmVsKHByb2R1Y3QpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjaGFuZ2U4LWZhdm9yaXRlXCI+4pmhPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3QtbmFtZVwiPntwcm9kdWN0Lm5hbWV9PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3QtcHJpY2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8cz57Zm9ybWF0Q3VycmVuY3kocHJvZHVjdC5wcmljZSAqIDEuMTQpfTwvcz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0Q3VycmVuY3kocHJvZHVjdC5wcmljZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgIDwvbWFpbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGFzaGJvYXJkO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgUmVnaXN0ZXIgPSAoKSA9PiB7XHJcbiAgY29uc3QgW2Zvcm1TdGF0ZSwgc2V0Rm9ybVN0YXRlXSA9IHVzZVN0YXRlKHtcclxuICAgIG5hbWU6IFwiXCIsXHJcbiAgICBlbWFpbDogXCJcIixcclxuICAgIHBhc3N3b3JkOiBcIlwiLFxyXG4gIH0pO1xyXG4gIGNvbnN0IFttZXNzYWdlLCBzZXRNZXNzYWdlXSA9IHVzZVN0YXRlKHsgdHlwZTogXCJcIiwgdGV4dDogXCJcIiB9KTtcclxuICBjb25zdCBbaXNTdWJtaXR0aW5nLCBzZXRJc1N1Ym1pdHRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5tYXJnaW4gPSBcIjBcIjtcclxuICB9LCBbXSk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZUNoYW5nZSA9IChldmVudCkgPT4ge1xyXG4gICAgc2V0Rm9ybVN0YXRlKChjdXJyZW50KSA9PiAoe1xyXG4gICAgICAuLi5jdXJyZW50LFxyXG4gICAgICBbZXZlbnQudGFyZ2V0Lm5hbWVdOiBldmVudC50YXJnZXQudmFsdWUsXHJcbiAgICB9KSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlU3VibWl0ID0gYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgc2V0TWVzc2FnZSh7IHR5cGU6IFwiXCIsIHRleHQ6IFwiXCIgfSk7XHJcbiAgICBzZXRJc1N1Ym1pdHRpbmcodHJ1ZSk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hcGkvcmVnaXN0ZXJcIiwge1xyXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShmb3JtU3RhdGUpLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGEubWVzc2FnZSB8fCBcIlJlZ2lzdHJhdGlvbiBmYWlsZWRcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNldE1lc3NhZ2Uoe1xyXG4gICAgICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgIHRleHQ6IFwiQWNjb3VudCBjcmVhdGVkIHN1Y2Nlc3NmdWxseSEgUmVkaXJlY3RpbmcuLi5cIixcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2FkbWluL2xvZ2luXCI7XHJcbiAgICAgIH0sIDIwMDApO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgc2V0TWVzc2FnZSh7IHR5cGU6IFwiZXJyb3JcIiwgdGV4dDogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgICAgc2V0SXNTdWJtaXR0aW5nKGZhbHNlKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyZWdpc3Rlci1wYWdlXCI+XHJcbiAgICAgIDxzdHlsZT57YFxyXG4gICAgICAgIC5yZWdpc3Rlci1wYWdlIHtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICAgIHBhZGRpbmc6IDI0cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOlxyXG4gICAgICAgICAgICBsaW5lYXItZ3JhZGllbnQocmdiYSgxNSwgMjMsIDQyLCAwLjM1KSwgcmdiYSgxNSwgMjMsIDQyLCAwLjM1KSksXHJcbiAgICAgICAgICAgIHVybCgnL3B1YmxpYy9pbWcyLmpwZycpIGNlbnRlciAvIGNvdmVyIGZpeGVkO1xyXG4gICAgICAgICAgZm9udC1mYW1pbHk6IFwiUGx1cyBKYWthcnRhIFNhbnNcIiwgXCJTZWdvZSBVSVwiLCBzYW5zLXNlcmlmO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWNhcmQge1xyXG4gICAgICAgICAgd2lkdGg6IG1pbigxMDAlLCA1MjBweCk7XHJcbiAgICAgICAgICBwYWRkaW5nOiA2MHB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMjhweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMTUsIDIzLCA0MiwgMC44Mik7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDUwcHggMTAwcHggLTIwcHggcmdiYSgwLCAwLCAwLCAwLjgpO1xyXG4gICAgICAgICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDMwcHgpO1xyXG4gICAgICAgICAgY29sb3I6ICNmZmY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbG9nbyB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAtMC4wMWVtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWxvZ28gc3BhbiB7XHJcbiAgICAgICAgICBjb2xvcjogIzYzNjZmMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1maWVsZCB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWxhYmVsIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xZW07XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1pbnB1dCB7XHJcbiAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgIHBhZGRpbmc6IDE0cHggMThweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpO1xyXG4gICAgICAgICAgY29sb3I6ICNmZmY7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICAgICAgICBvdXRsaW5lOiBub25lO1xyXG4gICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1pbnB1dDpmb2N1cyB7XHJcbiAgICAgICAgICBib3JkZXItY29sb3I6ICM2MzY2ZjE7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDgpO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCAwIDAgNHB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWJ1dHRvbiB7XHJcbiAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxNnB4O1xyXG4gICAgICAgICAgYm9yZGVyOiBub25lO1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICM2MzY2ZjEsICNhODU1ZjcpO1xyXG4gICAgICAgICAgY29sb3I6ICNmZmY7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDI1cHggLTVweCByZ2JhKDk5LCAxMDIsIDI0MSwgMC40KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1idXR0b246ZGlzYWJsZWQge1xyXG4gICAgICAgICAgb3BhY2l0eTogMC42O1xyXG4gICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1tZXNzYWdlIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxMnB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTNweDtcclxuICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbWVzc2FnZS5pcy12aXNpYmxlIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLW1lc3NhZ2UuZXJyb3Ige1xyXG4gICAgICAgICAgY29sb3I6ICNmODcxNzE7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDIzOSwgNjgsIDY4LCAwLjEpO1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyMzksIDY4LCA2OCwgMC4yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1tZXNzYWdlLnN1Y2Nlc3Mge1xyXG4gICAgICAgICAgY29sb3I6ICM0YWRlODA7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDM0LCAxOTcsIDk0LCAwLjEpO1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgzNCwgMTk3LCA5NCwgMC4yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1mb290ZXIge1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMjVweDtcclxuICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItZm9vdGVyIGEge1xyXG4gICAgICAgICAgY29sb3I6ICM2MzY2ZjE7XHJcbiAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWZvb3RlciBhOmhvdmVyIHtcclxuICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDg1MHB4KSB7XHJcbiAgICAgICAgICAucmVnaXN0ZXItY2FyZCB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDQwcHg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBgfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLWNhcmRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLWxvZ29cIj5SZWdpc3RlciBvdXIgc2l0ZTwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2ByZWdpc3Rlci1tZXNzYWdlICR7bWVzc2FnZS50eXBlfSAke1xyXG4gICAgICAgICAgICBtZXNzYWdlLnRleHQgPyBcImlzLXZpc2libGVcIiA6IFwiXCJcclxuICAgICAgICAgIH1gfVxyXG4gICAgICAgID5cclxuICAgICAgICAgIHttZXNzYWdlLnRleHR9XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxmb3JtIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWdpc3Rlci1maWVsZFwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwicmVnaXN0ZXItbGFiZWxcIiBodG1sRm9yPVwibmFtZVwiPlxyXG4gICAgICAgICAgICAgIEZ1bGwgTmFtZVxyXG4gICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyZWdpc3Rlci1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgICAgIGlkPVwibmFtZVwiXHJcbiAgICAgICAgICAgICAgbmFtZT1cIm5hbWVcIlxyXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRW50ZXIgeW91ciBmdWxsIG5hbWVcIlxyXG4gICAgICAgICAgICAgIHZhbHVlPXtmb3JtU3RhdGUubmFtZX1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxyXG4gICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLWZpZWxkXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJyZWdpc3Rlci1sYWJlbFwiIGh0bWxGb3I9XCJlbWFpbFwiPlxyXG4gICAgICAgICAgICAgIEVtYWlsIEFkZHJlc3NcclxuICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmVnaXN0ZXItaW5wdXRcIlxyXG4gICAgICAgICAgICAgIHR5cGU9XCJlbWFpbFwiXHJcbiAgICAgICAgICAgICAgaWQ9XCJlbWFpbFwiXHJcbiAgICAgICAgICAgICAgbmFtZT1cImVtYWlsXCJcclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImV4YW1wbGVAZW1haWwuY29tXCJcclxuICAgICAgICAgICAgICB2YWx1ZT17Zm9ybVN0YXRlLmVtYWlsfVxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XHJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItZmllbGRcIj5cclxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWxhYmVsXCIgaHRtbEZvcj1cInBhc3N3b3JkXCI+XHJcbiAgICAgICAgICAgICAgUGFzc3dvcmRcclxuICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmVnaXN0ZXItaW5wdXRcIlxyXG4gICAgICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXHJcbiAgICAgICAgICAgICAgaWQ9XCJwYXNzd29yZFwiXHJcbiAgICAgICAgICAgICAgbmFtZT1cInBhc3N3b3JkXCJcclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkF0IGxlYXN0IDYgY2hhcmFjdGVyc1wiXHJcbiAgICAgICAgICAgICAgbWluTGVuZ3RoPXs2fVxyXG4gICAgICAgICAgICAgIHZhbHVlPXtmb3JtU3RhdGUucGFzc3dvcmR9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cclxuICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJyZWdpc3Rlci1idXR0b25cIlxyXG4gICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcclxuICAgICAgICAgICAgZGlzYWJsZWQ9e2lzU3VibWl0dGluZ31cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge2lzU3VibWl0dGluZyA/IFwiQ3JlYXRpbmcgYWNjb3VudC4uLlwiIDogXCJDcmVhdGUgQWNjb3VudFwifVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9mb3JtPlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLWZvb3RlclwiPlxyXG4gICAgICAgICAgQWxyZWFkeSBoYXZlIGFuIGFjY291bnQ/IDxhIGhyZWY9XCIvYWRtaW4vbG9naW5cIj5Mb2cgaW48L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdGVyO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgZ3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwicmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDI0MHB4LCAxZnIpKVwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBjYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE2cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yOClcIixcclxuICBiYWNrZ3JvdW5kOiBcImxpbmVhci1ncmFkaWVudCgxNjBkZWcsICMwYjFhMzggMCUsICMwOTE2MmYgMTAwJSlcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTJweCAyMnB4IHJnYmEoMiwgNiwgMjMsIDAuMjUpXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVdyYXBTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjIwMHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjMGYxNzJhXCIsXHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBwYWRkaW5nOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICBvYmplY3RGaXQ6IFwiY29udGFpblwiLFxyXG59O1xyXG5cclxuY29uc3QgYm9keVN0eWxlID0ge1xyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IG1ldGFTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjFmciAxZnJcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGJhZGdlU3R5bGUgPSAoaXNBY3RpdmUpID0+ICh7XHJcbiAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4wNWVtXCIsXHJcbiAgcGFkZGluZzogXCI1cHggMTBweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gIGNvbG9yOiBpc0FjdGl2ZSA/IFwiIzE0NTMyZFwiIDogXCIjN2YxZDFkXCIsXHJcbiAgYmFja2dyb3VuZDogaXNBY3RpdmUgPyBcIiNiYmY3ZDBcIiA6IFwiI2ZlY2FjYVwiLFxyXG59KTtcclxuXHJcbmNvbnN0IGxpbmtTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImlubGluZS1ibG9ja1wiLFxyXG4gIG1hcmdpblRvcDogXCI0cHhcIixcclxuICBjb2xvcjogXCIjOTNjNWZkXCIsXHJcbiAgdGV4dERlY29yYXRpb246IFwibm9uZVwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IGVtcHR5U3R5bGUgPSB7XHJcbiAgcGFkZGluZzogXCIxOHB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IFwiMXB4IGRhc2hlZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuNDUpXCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0UHJpY2UgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBhbW91bnQgPSBOdW1iZXIodmFsdWUgfHwgMCk7XHJcbiAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoYW1vdW50KSkge1xyXG4gICAgcmV0dXJuIFwiMC4wMFwiO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFtb3VudC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IGdldFJlY29yZElkID0gKHJlY29yZCkgPT4ge1xyXG4gIHJldHVybiByZWNvcmQ/LnBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZCB8fCByZWNvcmQ/LnBhcmFtPy5pZCB8fCBcIlwiO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0U2hvd0hyZWYgPSAocmVjb3JkLCByZXNvdXJjZUlkKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkQWN0aW9ucyA9IHJlY29yZD8ucmVjb3JkQWN0aW9ucyB8fCByZWNvcmQ/LmFjdGlvbnMgfHwgW107XHJcbiAgY29uc3Qgc2hvd0FjdGlvbiA9IHJlY29yZEFjdGlvbnMuZmluZCgoYWN0aW9uKSA9PiBhY3Rpb24/Lm5hbWUgPT09IFwic2hvd1wiKTtcclxuICBjb25zdCByYXdIcmVmID0gc2hvd0FjdGlvbj8uaHJlZiB8fCByZWNvcmQ/LmhyZWYgfHwgXCJcIjtcclxuXHJcbiAgaWYgKHJhd0hyZWYpIHtcclxuICAgIHJldHVybiByYXdIcmVmO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgaWQgPSBnZXRSZWNvcmRJZChyZWNvcmQpO1xyXG4gIHJldHVybiBpZFxyXG4gICAgPyBgL2FkbWluL3Jlc291cmNlcy8ke2VuY29kZVVSSUNvbXBvbmVudChyZXNvdXJjZUlkKX0vcmVjb3Jkcy8ke2VuY29kZVVSSUNvbXBvbmVudChpZCl9L3Nob3dgXHJcbiAgICA6IFwiXCI7XHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0Q2FyZHNMaXN0ID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgW2FwaVJlY29yZHMsIHNldEFwaVJlY29yZHNdID0gdXNlU3RhdGUoW10pO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbbG9hZEVycm9yLCBzZXRMb2FkRXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIGNvbnN0IHJlc291cmNlSWQgPVxyXG4gICAgcHJvcHM/LnJlc291cmNlPy5pZCA9PT0gXCJQcm9kdWN0XCJcclxuICAgICAgPyBcIlByb2R1Y3RzXCJcclxuICAgICAgOiBwcm9wcz8ucmVzb3VyY2U/LmlkIHx8IFwiUHJvZHVjdHNcIjtcclxuICBjb25zdCBwcm9wUmVjb3JkcyA9IHByb3BzPy5yZWNvcmRzIHx8IFtdO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHByb3BSZWNvcmRzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGlzTW91bnRlZCA9IHRydWU7XHJcblxyXG4gICAgY29uc3QgbG9hZFJlY29yZHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHNldExvYWRpbmcodHJ1ZSk7XHJcbiAgICAgIHNldExvYWRFcnJvcihcIlwiKTtcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgICAgIGAvYWRtaW4vYXBpL3Jlc291cmNlcy8ke2VuY29kZVVSSUNvbXBvbmVudChyZXNvdXJjZUlkKX0vYWN0aW9ucy9saXN0YCxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBheWxvYWQ/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gbG9hZCBwcm9kdWN0c1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldEFwaVJlY29yZHMocGF5bG9hZD8ucmVjb3JkcyB8fCBbXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldExvYWRFcnJvcihlcnJvcj8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIHByb2R1Y3RzXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBpZiAoaXNNb3VudGVkKSB7XHJcbiAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbG9hZFJlY29yZHMoKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBpc01vdW50ZWQgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgfSwgW3Byb3BSZWNvcmRzLmxlbmd0aCwgcmVzb3VyY2VJZF0pO1xyXG5cclxuICBjb25zdCByZWNvcmRzID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICByZXR1cm4gcHJvcFJlY29yZHMubGVuZ3RoID8gcHJvcFJlY29yZHMgOiBhcGlSZWNvcmRzO1xyXG4gIH0sIFtwcm9wUmVjb3JkcywgYXBpUmVjb3Jkc10pO1xyXG5cclxuICBpZiAobG9hZGluZykge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9PkxvYWRpbmcgcHJvZHVjdHMuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAobG9hZEVycm9yKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+e2xvYWRFcnJvcn08L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoIXJlY29yZHMubGVuZ3RoKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+Tm8gcHJvZHVjdHMgZm91bmQuPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e2dyaWRTdHlsZX0+XHJcbiAgICAgIHtyZWNvcmRzLm1hcCgocmVjb3JkKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge307XHJcbiAgICAgICAgY29uc3QgaWQgPSBnZXRSZWNvcmRJZChyZWNvcmQpO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBwYXJhbXM/Lm5hbWUgfHwgXCJVbm5hbWVkIHByb2R1Y3RcIjtcclxuICAgICAgICBjb25zdCBjYXRlZ29yeSA9IHBhcmFtcz8uY2F0ZWdvcnlJZCB8fCBcIi1cIjtcclxuICAgICAgICBjb25zdCBpbWFnZVVybCA9IHBhcmFtcz8uaW1hZ2VVcmwgfHwgXCJcIjtcclxuICAgICAgICBjb25zdCBzdG9jayA9IE51bWJlcihwYXJhbXM/LnN0b2NrIHx8IDApO1xyXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gQm9vbGVhbihwYXJhbXM/LmlzQWN0aXZlKTtcclxuICAgICAgICBjb25zdCBkZXRhaWxzSHJlZiA9IGdldFNob3dIcmVmKHJlY29yZCwgcmVzb3VyY2VJZCk7XHJcbiAgICAgICAgY29uc3Qgb3BlbkRldGFpbHMgPSAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZGV0YWlsc0hyZWYpIHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihkZXRhaWxzSHJlZik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgIDxhcnRpY2xlIGtleT17aWR9IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbWFnZVdyYXBTdHlsZX0+XHJcbiAgICAgICAgICAgICAge2ltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICAgICAgPGltZyBzcmM9e2ltYWdlVXJsfSBhbHQ9e25hbWV9IHN0eWxlPXtpbWFnZVN0eWxlfSAvPlxyXG4gICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIE5vIGltYWdlXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2JvZHlTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogXCIxOHB4XCIsIGZvbnRXZWlnaHQ6IDcwMCB9fT57bmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXttZXRhU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5DYXRlZ29yeToge2NhdGVnb3J5fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5TdG9jazoge3N0b2NrfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5QcmljZTogUnMuIHtmb3JtYXRQcmljZShwYXJhbXM/LnByaWNlKX08L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17YmFkZ2VTdHlsZShpc0FjdGl2ZSl9PlxyXG4gICAgICAgICAgICAgICAge2lzQWN0aXZlID8gXCJBQ1RJVkVcIiA6IFwiSU5BQ1RJVkVcIn1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgIGhyZWY9e2RldGFpbHNIcmVmIHx8IFwiI1wifVxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e2xpbmtTdHlsZX1cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICBvcGVuRGV0YWlscygpO1xyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgIGFyaWEtZGlzYWJsZWQ9eyFkZXRhaWxzSHJlZn1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICBWaWV3IGRldGFpbHNcclxuICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RDYXJkc0xpc3Q7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHBhZ2VTdHlsZSA9IHtcclxuICBtaW5IZWlnaHQ6IFwiMTAwJVwiLFxyXG4gIHBhZGRpbmc6IFwiMjRweFwiLFxyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmZmZmZmZcIixcclxufTtcclxuXHJcbmNvbnN0IHRvcEJhclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbiAgbWFyZ2luQm90dG9tOiBcIjE4cHhcIixcclxuICBmbGV4V3JhcDogXCJ3cmFwXCIsXHJcbn07XHJcblxyXG5jb25zdCBiYWNrTGlua1N0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsXHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbn07XHJcblxyXG5jb25zdCBsYXlvdXRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgzMjBweCwgMS4wNWZyKSBtaW5tYXgoMzYwcHgsIDAuOTVmcilcIixcclxuICBnYXA6IFwiMThweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwic3RhcnRcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMjJweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjA4KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2ZmZmZmZlwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDE4cHggMzRweCByZ2JhKDE1LCAyMywgNDIsIDAuMDgpXCIsXHJcbiAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZUNhcmRTdHlsZSA9IHtcclxuICAuLi5jYXJkU3R5bGUsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlUm93czogXCIxZnIgYXV0b1wiLFxyXG4gIG1pbkhlaWdodDogXCI1MDBweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VXcmFwU3R5bGUgPSB7XHJcbiAgYmFja2dyb3VuZDogXCIjZjhmYWZjXCIsXHJcbiAgbWluSGVpZ2h0OiBcIjM0MHB4XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgcGxhY2VJdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgZGlzcGxheTogXCJibG9ja1wiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VGYWxsYmFja1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIHBsYWNlSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgY29sb3I6IFwiIzY0NzQ4YlwiLFxyXG4gIGJhY2tncm91bmQ6IFwibGluZWFyLWdyYWRpZW50KDEzNWRlZywgI2Y4ZmFmYyAwJSwgI2VlZjJmZiAxMDAlKVwiLFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZUZvb3RlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgcGFkZGluZzogXCIxNnB4IDE4cHggMThweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2ZmZmZmZlwiLFxyXG4gIGJvcmRlclRvcDogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjA4KVwiLFxyXG4gIGZsZXhXcmFwOiBcIndyYXBcIixcclxufTtcclxuXHJcbmNvbnN0IHRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcImNsYW1wKDMwcHgsIDR2dywgNTRweClcIixcclxuICBsaW5lSGVpZ2h0OiAxLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJjYXBpdGFsaXplXCIsXHJcbn07XHJcblxyXG5jb25zdCBzdWJ0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogXCI4cHggMCAwXCIsXHJcbiAgY29sb3I6IFwiIzZiNzI4MFwiLFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHBpbGxTdHlsZSA9IChhY3RpdmUpID0+ICh7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIHdpZHRoOiBcImZpdC1jb250ZW50XCIsXHJcbiAgcGFkZGluZzogXCI3cHggMTJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgY29sb3I6IGFjdGl2ZSA/IFwiIzE0NTMyZFwiIDogXCIjN2YxZDFkXCIsXHJcbiAgYmFja2dyb3VuZDogYWN0aXZlID8gXCIjYmJmN2QwXCIgOiBcIiNmZWNhY2FcIixcclxufSk7XHJcblxyXG5jb25zdCBwaWxsRG90U3R5bGUgPSAoYWN0aXZlKSA9PiAoe1xyXG4gIHdpZHRoOiBcIjhweFwiLFxyXG4gIGhlaWdodDogXCI4cHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiOTk5cHhcIixcclxuICBiYWNrZ3JvdW5kOiBhY3RpdmUgPyBcIiMyMmM1NWVcIiA6IFwiI2VmNDQ0NFwiLFxyXG59KTtcclxuXHJcbmNvbnN0IGluZm9HcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJyZXBlYXQoMywgbWlubWF4KDAsIDFmcikpXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBtYXJnaW5Ub3A6IFwiMThweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0NhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMTZweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjA4KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0xhYmVsU3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjE4ZW1cIixcclxuICBjb2xvcjogXCIjNmI3MjgwXCIsXHJcbiAgbWFyZ2luQm90dG9tOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb1ZhbHVlU3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTdweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgd29yZEJyZWFrOiBcImJyZWFrLXdvcmRcIixcclxufTtcclxuXHJcbmNvbnN0IGNvbnRlbnRDYXJkU3R5bGUgPSB7XHJcbiAgLi4uY2FyZFN0eWxlLFxyXG4gIHBhZGRpbmc6IFwiMjBweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdGlvblRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjE4ZW1cIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxufTtcclxuXHJcbmNvbnN0IGRlc2NyaXB0aW9uU3R5bGUgPSB7XHJcbiAgbWFyZ2luVG9wOiBcIjEycHhcIixcclxuICBjb2xvcjogXCIjMzc0MTUxXCIsXHJcbiAgZm9udFNpemU6IFwiMTVweFwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuOCxcclxuICB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIsXHJcbn07XHJcblxyXG5jb25zdCBkZXRhaWxzR3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgbWFyZ2luVG9wOiBcIjEycHhcIixcclxufTtcclxuXHJcbmNvbnN0IGRldGFpbFJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiMTBweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjA4KVwiLFxyXG59O1xyXG5cclxuY29uc3QgZGV0YWlsTGFiZWxTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjNmI3MjgwXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgZGV0YWlsVmFsdWVTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgZm9udFdlaWdodDogNjAwLFxyXG4gIHRleHRBbGlnbjogXCJyaWdodFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGFjdGlvblJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgZmxleFdyYXA6IFwid3JhcFwiLFxyXG4gIG1hcmdpblRvcDogXCIxOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBwcmltYXJ5QnV0dG9uU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIG1pbldpZHRoOiBcIjE4MHB4XCIsXHJcbiAgcGFkZGluZzogXCIxNHB4IDE4cHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTRweFwiLFxyXG4gIGJvcmRlcjogXCJub25lXCIsXHJcbiAgYmFja2dyb3VuZDogXCJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNjM2NmYxIDAlLCAjOGI1Y2Y2IDEwMCUpXCIsXHJcbiAgY29sb3I6IFwiI2ZmZmZmZlwiLFxyXG4gIGZvbnRTaXplOiBcIjE1cHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxuICBib3hTaGFkb3c6IFwiMCAxMHB4IDE4cHggcmdiYSg5OSwgMTAyLCAyNDEsIDAuMylcIixcclxufTtcclxuXHJcbmNvbnN0IHNlY29uZGFyeUJ1dHRvblN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiaW5saW5lLWZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxuICBtaW5XaWR0aDogXCIxODBweFwiLFxyXG4gIHBhZGRpbmc6IFwiMTRweCAxOHB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE0cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTcsIDI0LCAzOSwgMC4xMilcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmZmZmZmZcIixcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgZm9udFNpemU6IFwiMTVweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0Q3VycmVuY3kgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBhbW91bnQgPSBOdW1iZXIodmFsdWUgfHwgMCk7XHJcbiAgcmV0dXJuIGBScy4gJHthbW91bnQudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSl9YDtcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUpID0+IHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gXCItXCI7XHJcbiAgfVxyXG5cclxuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpO1xyXG4gIGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSB7XHJcbiAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgZGF0ZVN0eWxlOiBcIm1lZGl1bVwiLFxyXG4gICAgdGltZVN0eWxlOiBcInNob3J0XCIsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBnZXRQcm9kdWN0SW1hZ2UgPSAocGFyYW1zKSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIHBhcmFtcz8uaW1hZ2VVcmwgfHxcclxuICAgIHBhcmFtcz8uaW1hZ2UgfHxcclxuICAgIHBhcmFtcz8udGh1bWJuYWlsIHx8XHJcbiAgICBwYXJhbXM/LmNvdmVyIHx8XHJcbiAgICBcIlwiXHJcbiAgKTtcclxufTtcclxuXHJcbmNvbnN0IFByb2R1Y3RTaG93ID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgcmVjb3JkID0gcHJvcHM/LnJlY29yZDtcclxuICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fTtcclxuXHJcbiAgY29uc3QgcHJvZHVjdElkID0gcGFyYW1zPy5pZCB8fCByZWNvcmQ/LmlkIHx8IFwiXCI7XHJcbiAgY29uc3QgbmFtZSA9IHBhcmFtcz8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwiO1xyXG4gIGNvbnN0IHNrdSA9IHBhcmFtcz8uc2t1IHx8IFwiLVwiO1xyXG4gIGNvbnN0IGNhdGVnb3J5ID0gcGFyYW1zPy5jYXRlZ29yeUlkIHx8IFwiLVwiO1xyXG4gIGNvbnN0IGltYWdlVXJsID0gZ2V0UHJvZHVjdEltYWdlKHBhcmFtcyk7XHJcbiAgY29uc3Qgc3RvY2sgPSBOdW1iZXIocGFyYW1zPy5zdG9jayB8fCAwKTtcclxuICBjb25zdCBpc0FjdGl2ZSA9IEJvb2xlYW4ocGFyYW1zPy5pc0FjdGl2ZSk7XHJcbiAgY29uc3QgcHJpY2UgPSBmb3JtYXRDdXJyZW5jeShwYXJhbXM/LnByaWNlKTtcclxuICBjb25zdCBkZXNjcmlwdGlvbiA9XHJcbiAgICBwYXJhbXM/LmRlc2NyaXB0aW9uIHx8IFwiTm8gZGVzY3JpcHRpb24gYXZhaWxhYmxlIGZvciB0aGlzIHByb2R1Y3QuXCI7XHJcblxyXG4gIGNvbnN0IGVkaXRVcmwgPSBwcm9kdWN0SWRcclxuICAgID8gYC9hZG1pbi9yZXNvdXJjZXMvUHJvZHVjdHMvcmVjb3Jkcy8ke2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcocHJvZHVjdElkKSl9L2VkaXRgXHJcbiAgICA6IFwiXCI7XHJcblxyXG4gIGNvbnN0IG9yZGVyVXJsID0gcHJvZHVjdElkXHJcbiAgICA/IGAvYWRtaW4vcmVzb3VyY2VzL09yZGVycy9hY3Rpb25zL25ldz9wcm9kdWN0SWQ9JHtlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKHByb2R1Y3RJZCkpfWBcclxuICAgIDogXCJcIjtcclxuXHJcbiAgY29uc3QgaGFuZGxlT3JkZXJDbGljayA9ICgpID0+IHtcclxuICAgIGlmIChvcmRlclVybCkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKG9yZGVyVXJsKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBoYW5kbGVFZGl0Q2xpY2sgPSAoKSA9PiB7XHJcbiAgICBpZiAoZWRpdFVybCkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKGVkaXRVcmwpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcblxyXG4gICAgcm9vdC5jbGFzc0xpc3QuYWRkKFwiY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlXCIpO1xyXG4gICAgYm9keT8uY2xhc3NMaXN0LmFkZChcImNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZVwiKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICByb290LmNsYXNzTGlzdC5yZW1vdmUoXCJjaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmVcIik7XHJcbiAgICAgIGJvZHk/LmNsYXNzTGlzdC5yZW1vdmUoXCJjaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmVcIik7XHJcbiAgICB9O1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3BhZ2VTdHlsZX0+XHJcbiAgICAgIDxzdHlsZT57YFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIGJvZHksXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgI2FwcCxcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSAuYWRtaW5qc19MYXlvdXQsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIFtkYXRhLWNzcz1cImxheW91dFwiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBtYWluLFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlLFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlICNhcHAsXHJcbiAgICAgICAgYm9keS5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgLmFkbWluanNfTGF5b3V0LFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIFtkYXRhLXRlc3RpZD1cImxheW91dFwiXSxcclxuICAgICAgICBib2R5LmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBbZGF0YS1jc3M9XCJsYXlvdXRcIl0sXHJcbiAgICAgICAgYm9keS5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgbWFpbiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBib2R5OjpiZWZvcmUsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmU6OmJlZm9yZSxcclxuICAgICAgICBib2R5LmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZTo6YmVmb3JlIHtcclxuICAgICAgICAgIGNvbnRlbnQ6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIFtkYXRhLXRlc3RpZD1cInNpZGViYXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgLmFkbWluanNfU2lkZWJhcixcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBzZWN0aW9uW2RhdGEtY3NzPVwic2lkZWJhclwiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBhc2lkZVtkYXRhLWNzcz1cInNpZGViYXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgbmF2W2RhdGEtY3NzPVwic2lkZWJhclwiXSB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICB3aWR0aDogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgbWluLXdpZHRoOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBtYXgtd2lkdGg6IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYm9yZGVyOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSAuYWRtaW5qc19MYXlvdXQsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIFtkYXRhLWNzcz1cImxheW91dFwiXSB7XHJcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgLmFkbWluanNfTGF5b3V0ID4gKjpub3QoW2RhdGEtdGVzdGlkPVwic2lkZWJhclwiXSksXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdID4gKjpub3QoW2RhdGEtdGVzdGlkPVwic2lkZWJhclwiXSksXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgW2RhdGEtY3NzPVwibGF5b3V0XCJdID4gKjpub3QoW2RhdGEtdGVzdGlkPVwic2lkZWJhclwiXSkge1xyXG4gICAgICAgICAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxuICAgICAgICAgIG1heC13aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgW2RhdGEtdGVzdGlkPVwidG9wYmFyXCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIC5hZG1pbmpzX1RvcEJhcixcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBoZWFkZXJbZGF0YS1jc3M9XCJ0b3BiYXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgc2VjdGlvbltkYXRhLWNzcz1cInRvcGJhclwiXSB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSksXHJcbiAgICAgICAgYm9keTpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpLFxyXG4gICAgICAgICNhcHA6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSxcclxuICAgICAgICAuYWRtaW5qc19MYXlvdXQ6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSxcclxuICAgICAgICBbZGF0YS10ZXN0aWQ9XCJsYXlvdXRcIl06aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSxcclxuICAgICAgICBbZGF0YS1jc3M9XCJsYXlvdXRcIl06aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSxcclxuICAgICAgICBtYWluOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSkge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogI2ZmZmZmZiAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZiAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIFtkYXRhLXRlc3RpZD1cInNpZGViYXJcIl0sXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIC5hZG1pbmpzX1NpZGViYXIsXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIHNlY3Rpb25bZGF0YS1jc3M9XCJzaWRlYmFyXCJdLFxyXG4gICAgICAgIGh0bWw6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSBhc2lkZVtkYXRhLWNzcz1cInNpZGViYXJcIl0sXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIG5hdltkYXRhLWNzcz1cInNpZGViYXJcIl0ge1xyXG4gICAgICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgd2lkdGg6IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIG1pbi13aWR0aDogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgbWF4LXdpZHRoOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJvcmRlcjogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbiAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIC5hZG1pbmpzX0xheW91dCxcclxuICAgICAgICBodG1sOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSkgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdLFxyXG4gICAgICAgIGh0bWw6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSBbZGF0YS1jc3M9XCJsYXlvdXRcIl0ge1xyXG4gICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWw6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSAuYWRtaW5qc19MYXlvdXQgPiAqOm5vdChbZGF0YS10ZXN0aWQ9XCJzaWRlYmFyXCJdKSxcclxuICAgICAgICBodG1sOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSkgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdID4gKjpub3QoW2RhdGEtdGVzdGlkPVwic2lkZWJhclwiXSksXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIFtkYXRhLWNzcz1cImxheW91dFwiXSA+ICo6bm90KFtkYXRhLXRlc3RpZD1cInNpZGViYXJcIl0pIHtcclxuICAgICAgICAgIHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBtYXgtd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWw6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSBbZGF0YS10ZXN0aWQ9XCJ0b3BiYXJcIl0sXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIC5hZG1pbmpzX1RvcEJhcixcclxuICAgICAgICBodG1sOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSkgaGVhZGVyW2RhdGEtY3NzPVwidG9wYmFyXCJdLFxyXG4gICAgICAgIGh0bWw6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSBzZWN0aW9uW2RhdGEtY3NzPVwidG9wYmFyXCJdIHtcclxuICAgICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1zaGVsbCB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgZ2FwOiAxOHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LW1ldGEtc2Nyb2xsIHtcclxuICAgICAgICAgIG1heC1oZWlnaHQ6IDMyMHB4O1xyXG4gICAgICAgICAgb3ZlcmZsb3cteTogYXV0bztcclxuICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDZweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1tZXRhLXNjcm9sbDo6LXdlYmtpdC1zY3JvbGxiYXIge1xyXG4gICAgICAgICAgd2lkdGg6IDhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1tZXRhLXNjcm9sbDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNDgsIDE2MywgMTg0LCAwLjgpO1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LXNob3ctbWV0YS1zY3JvbGw6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjQxLCAyNDUsIDI0OSwgMC45KTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDExMDBweCkge1xyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LWxheW91dCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LWluZm8tZ3JpZCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgwLCAxZnIpKSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1tZXRhLXNjcm9sbCB7XHJcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IG5vbmU7XHJcbiAgICAgICAgICAgIG92ZXJmbG93LXk6IHZpc2libGU7XHJcbiAgICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNzIwcHgpIHtcclxuICAgICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1pbmZvLWdyaWQge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMTZweCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBgfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdC1zaG93LXNoZWxsIGNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2VcIj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt0b3BCYXJTdHlsZX0+XHJcbiAgICAgICAgICA8YVxyXG4gICAgICAgICAgICBocmVmPVwiL2FkbWluL3Jlc291cmNlcy9Qcm9kdWN0cy9hY3Rpb25zL2xpc3RcIlxyXG4gICAgICAgICAgICBzdHlsZT17YmFja0xpbmtTdHlsZX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+4oC5PC9zcGFuPlxyXG4gICAgICAgICAgICBCYWNrIHRvIFByb2R1Y3RzXHJcbiAgICAgICAgICA8L2E+XHJcblxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17cGlsbFN0eWxlKGlzQWN0aXZlKX0+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtwaWxsRG90U3R5bGUoaXNBY3RpdmUpfSAvPlxyXG4gICAgICAgICAgICB7aXNBY3RpdmUgPyBcIkFjdGl2ZVwiIDogXCJJbmFjdGl2ZVwifVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LXNob3ctbGF5b3V0XCIgc3R5bGU9e2xheW91dFN0eWxlfT5cclxuICAgICAgICAgIDxzZWN0aW9uIHN0eWxlPXtpbWFnZUNhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2ltYWdlV3JhcFN0eWxlfT5cclxuICAgICAgICAgICAgICB7aW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2VVcmx9IGFsdD17bmFtZX0gc3R5bGU9e2ltYWdlU3R5bGV9IC8+XHJcbiAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2ltYWdlRmFsbGJhY2tTdHlsZX0+Tm8gaW1hZ2UgYXZhaWxhYmxlPC9kaXY+XHJcbiAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbWFnZUZvb3RlclN0eWxlfT5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogXCIjNjQ3NDhiXCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgUHJvZHVjdCBJRFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiBcIiMxMTE4MjdcIiwgZm9udFdlaWdodDogNzAwIH19PlxyXG4gICAgICAgICAgICAgICAgICB7cHJvZHVjdElkIHx8IFwiLVwifVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiBcIiM2NDc0OGJcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlByaWNlPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiBcIiMxMTE4MjdcIiwgZm9udFdlaWdodDogNzAwIH19PntwcmljZX08L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L3NlY3Rpb24+XHJcblxyXG4gICAgICAgICAgPHNlY3Rpb24gc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogXCIyMnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgPGgxIHN0eWxlPXt0aXRsZVN0eWxlfT57bmFtZX08L2gxPlxyXG4gICAgICAgICAgICAgIDxwIHN0eWxlPXtzdWJ0aXRsZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIENsZWFuIHByb2R1Y3QgZGV0YWlsIHZpZXcgd2l0aCBxdWljayBhY3Rpb25zIGFuZCByZWNvcmQgaW5mby5cclxuICAgICAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdC1zaG93LWluZm8tZ3JpZFwiXHJcbiAgICAgICAgICAgICAgICBzdHlsZT17aW5mb0dyaWRTdHlsZX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvQ2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PlByaWNlPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT57cHJpY2V9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvQ2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PlN0b2NrPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT57c3RvY2t9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvQ2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PlNLVTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvVmFsdWVTdHlsZX0+e3NrdX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXthY3Rpb25Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17cHJpbWFyeUJ1dHRvblN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVPcmRlckNsaWNrfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICBDcmVhdGUgT3JkZXJcclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtzZWNvbmRhcnlCdXR0b25TdHlsZX1cclxuICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlRWRpdENsaWNrfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICBFZGl0IFByb2R1Y3RcclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3Qtc2hvdy1tZXRhLXNjcm9sbFwiXHJcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IFwiMjJweFwiLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBcIjIwcHhcIixcclxuICAgICAgICAgICAgICAgICAgYm9yZGVyVG9wOiBcIjFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMDgpXCIsXHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gICAgICAgICAgICAgICAgICBnYXA6IFwiMThweFwiLFxyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5EZXNjcmlwdGlvbjwvaDI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2Rlc2NyaXB0aW9uU3R5bGV9PntkZXNjcmlwdGlvbn08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlByb2R1Y3QgRGV0YWlsczwvaDI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2RldGFpbHNHcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2RldGFpbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtkZXRhaWxMYWJlbFN0eWxlfT5DYXRlZ29yeTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtkZXRhaWxWYWx1ZVN0eWxlfT57Y2F0ZWdvcnl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtkZXRhaWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17ZGV0YWlsTGFiZWxTdHlsZX0+Q3JlYXRlZCBBdDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtkZXRhaWxWYWx1ZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdERhdGUocGFyYW1zPy5jcmVhdGVkQXQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtkZXRhaWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17ZGV0YWlsTGFiZWxTdHlsZX0+VXBkYXRlZCBBdDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtkZXRhaWxWYWx1ZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdERhdGUocGFyYW1zPy51cGRhdGVkQXQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtkZXRhaWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17ZGV0YWlsTGFiZWxTdHlsZX0+UmVjb3JkIElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2RldGFpbFZhbHVlU3R5bGV9Pntwcm9kdWN0SWQgfHwgXCItXCJ9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdFNob3c7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBwYWdlU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjIwcHhcIixcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZmZmZmZmXCIsXHJcbn07XHJcblxyXG5jb25zdCBoZWFkZXJTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBmb250U2l6ZTogXCIzNHB4XCIsXHJcbiAgbGluZUhlaWdodDogMS4wOCxcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbn07XHJcblxyXG5jb25zdCBkZXNjU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGNvbG9yOiBcIiM2NDc0OGJcIixcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBjYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE4cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTcsIDI0LCAzOSwgMC4wOClcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmZmZmZmZcIixcclxuICBib3hTaGFkb3c6IFwiMCAxNHB4IDI4cHggcmdiYSgxNSwgMjMsIDQyLCAwLjA4KVwiLFxyXG4gIHBhZGRpbmc6IFwiMThweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdGlvblRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiBcIjAgMCAxNHB4IDBcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTJlbVwiLFxyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbn07XHJcblxyXG5jb25zdCBsYXlvdXRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgzMDBweCwgMC45NWZyKSBtaW5tYXgoNDIwcHgsIDEuMjVmcilcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc3RhY2tTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgbGFiZWxTdHlsZSA9IHtcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xZW1cIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gIGNvbG9yOiBcIiM0NzU1NjlcIixcclxufTtcclxuXHJcbmNvbnN0IGlucHV0U3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIG1pbldpZHRoOiAwLFxyXG4gIGJveFNpemluZzogXCJib3JkZXItYm94XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTcsIDI0LCAzOSwgMC4xMilcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmZmZmZmZcIixcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgcGFkZGluZzogXCIxMXB4IDEzcHhcIixcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbiAgZm9udEZhbWlseTogXCJpbmhlcml0XCIsXHJcbn07XHJcblxyXG5jb25zdCByb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbiAgbWluV2lkdGg6IDAsXHJcbn07XHJcblxyXG5jb25zdCBncmlkMlN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwicmVwZWF0KDIsIG1pbm1heCgwLCAxZnIpKVwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJzdGFydFwiLFxyXG59O1xyXG5cclxuY29uc3QgY3VzdG9tZXJJbmZvU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGN1c3RvbWVyUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiOHB4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMDgpXCIsXHJcbn07XHJcblxyXG5jb25zdCBtdXRlZFN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiM2NDc0OGJcIixcclxufTtcclxuXHJcbmNvbnN0IHN0cm9uZ1N0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgdGV4dEFsaWduOiBcInJpZ2h0XCIsXHJcbn07XHJcblxyXG5jb25zdCBsaW5lSXRlbVJvd1N0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjEyKVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgcGFkZGluZzogXCIxMnB4XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IGxpbmVJdGVtVG9wU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgYXV0b1wiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IHByb2R1Y3RQcmV2aWV3U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCI1NnB4IDFmclwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiNTZweFwiLFxyXG4gIGhlaWdodDogXCI1NnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNlNWU3ZWJcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTcsIDI0LCAzOSwgMC4xMilcIixcclxufTtcclxuXHJcbmNvbnN0IGFkZEJ1dHRvblN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSg5OSwgMTAyLCAyNDEsIDAuMzUpXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBwYWRkaW5nOiBcIjlweCAxMnB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZWVmMmZmXCIsXHJcbiAgY29sb3I6IFwiIzM3MzBhM1wiLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG59O1xyXG5cclxuY29uc3QgcmVtb3ZlQnV0dG9uU3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCAjZmNhNWE1XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBwYWRkaW5nOiBcIjhweCAxMHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZmVlMmUyXCIsXHJcbiAgY29sb3I6IFwiIzk5MWIxYlwiLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxufTtcclxuXHJcbmNvbnN0IHRvdGFsc1Jvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBwYWRkaW5nOiBcIjdweCAwXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjA4KVwiLFxyXG59O1xyXG5cclxuY29uc3QgdG90YWxTdHlsZSA9IHtcclxuICAuLi50b3RhbHNSb3dTdHlsZSxcclxuICBmb250U2l6ZTogXCIxN3B4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICBib3JkZXJCb3R0b206IFwibm9uZVwiLFxyXG4gIHBhZGRpbmdUb3A6IFwiMTJweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYWN0aW9uQmFyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGFjdGlvbkJ1dHRvblN0eWxlID0gKHByaW1hcnkpID0+ICh7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IHByaW1hcnkgPyBcIm5vbmVcIiA6IFwiMXB4IHNvbGlkIHJnYmEoMTcsIDI0LCAzOSwgMC4xMilcIixcclxuICBwYWRkaW5nOiBcIjEycHggMTRweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIGJhY2tncm91bmQ6IHByaW1hcnlcclxuICAgID8gXCJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNjM2NmYxIDAlLCAjOGI1Y2Y2IDEwMCUpXCJcclxuICAgIDogXCIjZmZmZmZmXCIsXHJcbiAgY29sb3I6IHByaW1hcnkgPyBcIiNmZmZcIiA6IFwiIzExMTgyN1wiLFxyXG59KTtcclxuXHJcbmNvbnN0IG1hcExpbmtTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjMjU2M2ViXCIsXHJcbiAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIixcclxufTtcclxuXHJcbmNvbnN0IHBheW1lbnRPcHRpb25HcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IHBheW1lbnRPcHRpb25TdHlsZSA9IChhY3RpdmUpID0+ICh7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IGFjdGl2ZVxyXG4gICAgPyBcIjFweCBzb2xpZCByZ2JhKDk5LCAxMDIsIDI0MSwgMC45KVwiXHJcbiAgICA6IFwiMXB4IHNvbGlkIHJnYmEoMTcsIDI0LCAzOSwgMC4xMilcIixcclxuICBiYWNrZ3JvdW5kOiBhY3RpdmUgPyBcIiNlZWYyZmZcIiA6IFwiI2ZmZmZmZlwiLFxyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICBwYWRkaW5nOiBcIjEwcHggMTJweFwiLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgdGV4dEFsaWduOiBcImxlZnRcIixcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbn0pO1xyXG5cclxuY29uc3Qgc2VjdXJpdHlDaGlwV3JhcFN0eWxlID0ge1xyXG4gIG1hcmdpblRvcDogXCIxMnB4XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdXJpdHlDaGlwU3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDM0LCAxOTcsIDk0LCAwLjQyKVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2VjZmRmM1wiLFxyXG4gIGNvbG9yOiBcIiMxNjY1MzRcIixcclxuICBwYWRkaW5nOiBcIjdweCAxMHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDNlbVwiLFxyXG59O1xyXG5cclxuY29uc3QgcmVzcG9uc2l2ZUNzcyA9IGBcclxuLmNoYW5nZTgtb3JkZXItZ3JpZC0yIHtcclxuICBkaXNwbGF5OiBncmlkICFpbXBvcnRhbnQ7XHJcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDAsIDFmcikpICFpbXBvcnRhbnQ7XHJcbiAgZ2FwOiAxMHB4ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5jaGFuZ2U4LW9yZGVyLWdyaWQtMiA+ICoge1xyXG4gIG1pbi13aWR0aDogMCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4uY2hhbmdlOC1vcmRlci1ncmlkLTIgaW5wdXQsXHJcbi5jaGFuZ2U4LW9yZGVyLWdyaWQtMiBzZWxlY3QsXHJcbi5jaGFuZ2U4LW9yZGVyLWdyaWQtMiB0ZXh0YXJlYSB7XHJcbiAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxuICBtaW4td2lkdGg6IDAgIWltcG9ydGFudDtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbkBtZWRpYSAobWF4LXdpZHRoOiAxMDI0cHgpIHtcclxuICAuY2hhbmdlOC1vcmRlci1sYXlvdXQge1xyXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgIWltcG9ydGFudDtcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSAobWF4LXdpZHRoOiA3NjBweCkge1xyXG4gIC5jaGFuZ2U4LW9yZGVyLWdyaWQtMiB7XHJcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gIH1cclxufVxyXG5gO1xyXG5cclxuY29uc3QgcGF5bWVudE9wdGlvbnMgPSBbXHJcbiAgeyB2YWx1ZTogXCJDYXJkXCIsIGxhYmVsOiBcIkNhcmQgUGF5bWVudFwiLCBpY29uOiBcIvCfkrNcIiB9LFxyXG4gIHsgdmFsdWU6IFwiQ2FzaCBvbiBEZWxpdmVyeVwiLCBsYWJlbDogXCJDYXNoIG9uIERlbGl2ZXJ5XCIsIGljb246IFwi8J+TplwiIH0sXHJcbl07XHJcblxyXG5jb25zdCBpdGVtU2l6ZU9wdGlvbnMgPSBbXCJYU1wiLCBcIlNcIiwgXCJNXCIsIFwiTFwiLCBcIlhMXCIsIFwiWFhMXCJdO1xyXG5jb25zdCBzaGlwcGluZ01ldGhvZHMgPSBbXHJcbiAgXCJQaWNrTWUgRmxhc2hcIixcclxuICBcIlByb250b1wiLFxyXG4gIFwiRG9tZXhcIixcclxuICBcIlJlZ2lzdGVyZWQgQ291cmllclwiLFxyXG5dO1xyXG5cclxuY29uc3QgdG9OdW1iZXIgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBudW0gPSBOdW1iZXIodmFsdWUgfHwgMCk7XHJcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShudW0pID8gbnVtIDogMDtcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdE1vbmV5ID0gKHZhbHVlKSA9PiB7XHJcbiAgcmV0dXJuIGBScy4gJHt0b051bWJlcih2YWx1ZSkudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSl9YDtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZUVtcHR5SXRlbSA9ICgpID0+ICh7XHJcbiAgcHJvZHVjdElkOiBcIlwiLFxyXG4gIHNpemU6IFwiTVwiLFxyXG4gIHF1YW50aXR5OiAxLFxyXG4gIHVuaXRQcmljZTogMCxcclxufSk7XHJcblxyXG5jb25zdCBPcmRlckNyZWF0ZSA9ICgpID0+IHtcclxuICBjb25zdCBbdXNlcnMsIHNldFVzZXJzXSA9IHVzZVN0YXRlKFtdKTtcclxuICBjb25zdCBbcHJvZHVjdHMsIHNldFByb2R1Y3RzXSA9IHVzZVN0YXRlKFtdKTtcclxuICBjb25zdCBbb3JkZXJDb3VudEJ5VXNlciwgc2V0T3JkZXJDb3VudEJ5VXNlcl0gPSB1c2VTdGF0ZSh7fSk7XHJcbiAgY29uc3QgW3Nlc3Npb25Vc2VyLCBzZXRTZXNzaW9uVXNlcl0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICBjb25zdCBbc3VibWl0dGluZywgc2V0U3VibWl0dGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIGNvbnN0IFtmb3JtRGF0YSwgc2V0Rm9ybURhdGFdID0gdXNlU3RhdGUoe1xyXG4gICAgdXNlcklkOiBcIlwiLFxyXG4gICAgc3RhdHVzOiBcInBlbmRpbmdcIixcclxuICAgIHBheW1lbnRNZXRob2Q6IFwiQ2FyZFwiLFxyXG4gICAgcGF5bWVudFN0YXR1czogXCJwZW5kaW5nXCIsXHJcbiAgICB0cmFuc2FjdGlvbklkOiBcIlwiLFxyXG4gICAgc2hpcHBpbmdOYW1lOiBcIlwiLFxyXG4gICAgc2hpcHBpbmdQaG9uZTogXCJcIixcclxuICAgIHNoaXBwaW5nQWRkcmVzczogXCJcIixcclxuICAgIHNoaXBwaW5nTWV0aG9kOiBcIlBpY2tNZSBGbGFzaFwiLFxyXG4gICAgdHJhY2tpbmdOdW1iZXI6IFwiXCIsXHJcbiAgICBzaGlwcGluZ0ZlZTogMCxcclxuICAgIHRheDogMCxcclxuICAgIGRpc2NvdW50OiAwLFxyXG4gIH0pO1xyXG5cclxuICBjb25zdCBbbGluZUl0ZW1zLCBzZXRMaW5lSXRlbXNdID0gdXNlU3RhdGUoW2NyZWF0ZUVtcHR5SXRlbSgpXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICBjb25zdCBoYWRMb2dpbkNsYXNzT25Sb290ID0gcm9vdC5jbGFzc0xpc3QuY29udGFpbnMoXCJjaGFuZ2U4LWxvZ2luLXBhZ2VcIik7XHJcbiAgICBjb25zdCBoYWRMb2dpbkNsYXNzT25Cb2R5ID0gYm9keT8uY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2hhbmdlOC1sb2dpbi1wYWdlXCIpO1xyXG4gICAgY29uc3QgaGFkRGFzaGJvYXJkQ2xhc3NPblJvb3QgPSByb290LmNsYXNzTGlzdC5jb250YWlucyhcclxuICAgICAgXCJjaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2VcIixcclxuICAgICk7XHJcbiAgICBjb25zdCBoYWREYXNoYm9hcmRDbGFzc09uQm9keSA9IGJvZHk/LmNsYXNzTGlzdC5jb250YWlucyhcclxuICAgICAgXCJjaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2VcIixcclxuICAgICk7XHJcbiAgICBjb25zdCBsb2dpbkJnTGF5ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYW5nZTgtbG9naW4tYmctbGF5ZXJcIik7XHJcbiAgICBjb25zdCBwcmV2aW91c0xheWVyRGlzcGxheSA9IGxvZ2luQmdMYXllcj8uc3R5bGUuZGlzcGxheSB8fCBcIlwiO1xyXG5cclxuICAgIGNvbnN0IHNoZWxsTm9kZXMgPSBBcnJheS5mcm9tKFxyXG4gICAgICBuZXcgU2V0KFxyXG4gICAgICAgIFtcclxuICAgICAgICAgIHJvb3QsXHJcbiAgICAgICAgICBib2R5LFxyXG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcHBcIiksXHJcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10ZXN0aWQ9XCJsYXlvdXRcIl0nKSxcclxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWNzcz1cImxheW91dFwiXScpLFxyXG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hZG1pbmpzX0xheW91dFwiKSxcclxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpLFxyXG4gICAgICAgICAgLi4uQXJyYXkuZnJvbShcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICAgICAgICAgICAnW2RhdGEtY3NzKj1cImFjdGlvbi1jb250ZW50XCJdLCBbZGF0YS10ZXN0aWQqPVwiY29udGVudFwiXSwgLmFkbWluanNfTWFpbiwgLmFkbWluanNfTWFpbiA+IGRpdiwgLmFkbWluanNfTWFpbiA+IGRpdiA+IGRpdiwgW2RhdGEtY3NzJD1cIi1jb250ZW50XCJdJyxcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICksXHJcbiAgICAgICAgXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgICAgICksXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHByZXZpb3VzSW5saW5lQmFja2dyb3VuZHMgPSBuZXcgTWFwKFxyXG4gICAgICBzaGVsbE5vZGVzLm1hcCgobm9kZSkgPT4gW1xyXG4gICAgICAgIG5vZGUsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogbm9kZS5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiYmFja2dyb3VuZFwiKSxcclxuICAgICAgICAgIGJhY2tncm91bmRQcmlvcml0eTogbm9kZS5zdHlsZS5nZXRQcm9wZXJ0eVByaW9yaXR5KFwiYmFja2dyb3VuZFwiKSxcclxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogbm9kZS5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiYmFja2dyb3VuZC1jb2xvclwiKSxcclxuICAgICAgICAgIGJhY2tncm91bmRDb2xvclByaW9yaXR5OlxyXG4gICAgICAgICAgICBub2RlLnN0eWxlLmdldFByb3BlcnR5UHJpb3JpdHkoXCJiYWNrZ3JvdW5kLWNvbG9yXCIpLFxyXG4gICAgICAgICAgYmFja2dyb3VuZEltYWdlOiBub2RlLnN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCJiYWNrZ3JvdW5kLWltYWdlXCIpLFxyXG4gICAgICAgICAgYmFja2dyb3VuZEltYWdlUHJpb3JpdHk6XHJcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuZ2V0UHJvcGVydHlQcmlvcml0eShcImJhY2tncm91bmQtaW1hZ2VcIiksXHJcbiAgICAgICAgfSxcclxuICAgICAgXSksXHJcbiAgICApO1xyXG5cclxuICAgIHJvb3QuY2xhc3NMaXN0LnJlbW92ZShcclxuICAgICAgXCJjaGFuZ2U4LWxvZ2luLXBhZ2VcIixcclxuICAgICAgXCJjaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2VcIixcclxuICAgICk7XHJcbiAgICBib2R5Py5jbGFzc0xpc3QucmVtb3ZlKFxyXG4gICAgICBcImNoYW5nZTgtbG9naW4tcGFnZVwiLFxyXG4gICAgICBcImNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQtcGFnZVwiLFxyXG4gICAgKTtcclxuICAgIGlmIChsb2dpbkJnTGF5ZXIpIHtcclxuICAgICAgbG9naW5CZ0xheWVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH1cclxuXHJcbiAgICBzaGVsbE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcclxuICAgICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShcImJhY2tncm91bmRcIiwgXCIjZmZmZmZmXCIsIFwiaW1wb3J0YW50XCIpO1xyXG4gICAgICBub2RlLnN0eWxlLnNldFByb3BlcnR5KFwiYmFja2dyb3VuZC1jb2xvclwiLCBcIiNmZmZmZmZcIiwgXCJpbXBvcnRhbnRcIik7XHJcbiAgICAgIG5vZGUuc3R5bGUuc2V0UHJvcGVydHkoXCJiYWNrZ3JvdW5kLWltYWdlXCIsIFwibm9uZVwiLCBcImltcG9ydGFudFwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJvb3QuY2xhc3NMaXN0LmFkZChcImNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZVwiKTtcclxuICAgIGJvZHk/LmNsYXNzTGlzdC5hZGQoXCJjaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmVcIik7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgcm9vdC5jbGFzc0xpc3QucmVtb3ZlKFwiY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlXCIpO1xyXG4gICAgICBib2R5Py5jbGFzc0xpc3QucmVtb3ZlKFwiY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlXCIpO1xyXG5cclxuICAgICAgaWYgKGhhZExvZ2luQ2xhc3NPblJvb3QpIHtcclxuICAgICAgICByb290LmNsYXNzTGlzdC5hZGQoXCJjaGFuZ2U4LWxvZ2luLXBhZ2VcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChoYWRMb2dpbkNsYXNzT25Cb2R5KSB7XHJcbiAgICAgICAgYm9keT8uY2xhc3NMaXN0LmFkZChcImNoYW5nZTgtbG9naW4tcGFnZVwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGhhZERhc2hib2FyZENsYXNzT25Sb290KSB7XHJcbiAgICAgICAgcm9vdC5jbGFzc0xpc3QuYWRkKFwiY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaGFkRGFzaGJvYXJkQ2xhc3NPbkJvZHkpIHtcclxuICAgICAgICBib2R5Py5jbGFzc0xpc3QuYWRkKFwiY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobG9naW5CZ0xheWVyKSB7XHJcbiAgICAgICAgbG9naW5CZ0xheWVyLnN0eWxlLmRpc3BsYXkgPSBwcmV2aW91c0xheWVyRGlzcGxheTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcHJldmlvdXNJbmxpbmVCYWNrZ3JvdW5kcy5mb3JFYWNoKChzdHlsZXMsIG5vZGUpID0+IHtcclxuICAgICAgICBpZiAoIXN0eWxlcy5iYWNrZ3JvdW5kKSB7XHJcbiAgICAgICAgICBub2RlLnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZFwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kXCIsXHJcbiAgICAgICAgICAgIHN0eWxlcy5iYWNrZ3JvdW5kLFxyXG4gICAgICAgICAgICBzdHlsZXMuYmFja2dyb3VuZFByaW9yaXR5IHx8IFwiXCIsXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzdHlsZXMuYmFja2dyb3VuZENvbG9yKSB7XHJcbiAgICAgICAgICBub2RlLnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZC1jb2xvclwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCIsXHJcbiAgICAgICAgICAgIHN0eWxlcy5iYWNrZ3JvdW5kQ29sb3IsXHJcbiAgICAgICAgICAgIHN0eWxlcy5iYWNrZ3JvdW5kQ29sb3JQcmlvcml0eSB8fCBcIlwiLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghc3R5bGVzLmJhY2tncm91bmRJbWFnZSkge1xyXG4gICAgICAgICAgbm9kZS5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmQtaW1hZ2VcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5vZGUuc3R5bGUuc2V0UHJvcGVydHkoXHJcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZC1pbWFnZVwiLFxyXG4gICAgICAgICAgICBzdHlsZXMuYmFja2dyb3VuZEltYWdlLFxyXG4gICAgICAgICAgICBzdHlsZXMuYmFja2dyb3VuZEltYWdlUHJpb3JpdHkgfHwgXCJcIixcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcclxuICAgIGNvbnN0IHByZVByb2R1Y3RJZCA9IHBhcmFtcy5nZXQoXCJwcm9kdWN0SWRcIikgfHwgXCJcIjtcclxuXHJcbiAgICBjb25zdCBmZXRjaERhdGEgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgY29udGV4dFJlcyA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9jb250ZXh0L29yZGVyLWNyZWF0ZSR7XHJcbiAgICAgICAgICAgIHByZVByb2R1Y3RJZCA/IGA/cHJvZHVjdElkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHByZVByb2R1Y3RJZCl9YCA6IFwiXCJcclxuICAgICAgICAgIH1gLFxyXG4gICAgICAgICAgeyBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGV4dERhdGEgPSBjb250ZXh0UmVzLm9rID8gYXdhaXQgY29udGV4dFJlcy5qc29uKCkgOiB7fTtcclxuXHJcbiAgICAgICAgY29uc3QgdXNlcnNEYXRhID0gQXJyYXkuaXNBcnJheShjb250ZXh0RGF0YT8udXNlcnMpXHJcbiAgICAgICAgICA/IGNvbnRleHREYXRhLnVzZXJzXHJcbiAgICAgICAgICA6IFtdO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RzTGlzdCA9IEFycmF5LmlzQXJyYXkoY29udGV4dERhdGE/LnByb2R1Y3RzKVxyXG4gICAgICAgICAgPyBjb250ZXh0RGF0YS5wcm9kdWN0c1xyXG4gICAgICAgICAgOiBbXTtcclxuXHJcbiAgICAgICAgc2V0VXNlcnModXNlcnNEYXRhKTtcclxuICAgICAgICBzZXRQcm9kdWN0cyhwcm9kdWN0c0xpc3QpO1xyXG4gICAgICAgIHNldE9yZGVyQ291bnRCeVVzZXIoY29udGV4dERhdGE/Lm9yZGVyQ291bnRCeVVzZXIgfHwge30pO1xyXG4gICAgICAgIHNldFNlc3Npb25Vc2VyKGNvbnRleHREYXRhPy5jdXJyZW50VXNlciB8fCBudWxsKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHREYXRhPy5jdXJyZW50VXNlcj8uaWQpIHtcclxuICAgICAgICAgIHNldEZvcm1EYXRhKChwcmV2KSA9PiAoe1xyXG4gICAgICAgICAgICAuLi5wcmV2LFxyXG4gICAgICAgICAgICB1c2VySWQ6IHByZXYudXNlcklkIHx8IFN0cmluZyhjb250ZXh0RGF0YS5jdXJyZW50VXNlci5pZCksXHJcbiAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY29udGV4dERhdGE/LnNlbGVjdGVkUHJvZHVjdD8uaWQpIHtcclxuICAgICAgICAgIHNldExpbmVJdGVtcyhbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBwcm9kdWN0SWQ6IFN0cmluZyhjb250ZXh0RGF0YS5zZWxlY3RlZFByb2R1Y3QuaWQpLFxyXG4gICAgICAgICAgICAgIHNpemU6IFwiTVwiLFxyXG4gICAgICAgICAgICAgIHF1YW50aXR5OiAxLFxyXG4gICAgICAgICAgICAgIHVuaXRQcmljZTogdG9OdW1iZXIoY29udGV4dERhdGEuc2VsZWN0ZWRQcm9kdWN0LnByaWNlKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgcHJlUHJvZHVjdElkICYmXHJcbiAgICAgICAgICBwcm9kdWN0c0xpc3Quc29tZSgocCkgPT4gU3RyaW5nKHAuaWQpID09PSBTdHJpbmcocHJlUHJvZHVjdElkKSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnN0IHNlbGVjdGVkID0gcHJvZHVjdHNMaXN0LmZpbmQoXHJcbiAgICAgICAgICAgIChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhwcmVQcm9kdWN0SWQpLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIHNldExpbmVJdGVtcyhbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBwcm9kdWN0SWQ6IFN0cmluZyhwcmVQcm9kdWN0SWQpLFxyXG4gICAgICAgICAgICAgIHNpemU6IFwiTVwiLFxyXG4gICAgICAgICAgICAgIHF1YW50aXR5OiAxLFxyXG4gICAgICAgICAgICAgIHVuaXRQcmljZTogdG9OdW1iZXIoc2VsZWN0ZWQ/LnByaWNlKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmZXRjaERhdGEoKTtcclxuICB9LCBbXSk7XHJcblxyXG4gIGNvbnN0IHNlbGVjdGVkQ3VzdG9tZXIgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiB1c2Vycy5maW5kKCh1KSA9PiBTdHJpbmcodS5pZCkgPT09IFN0cmluZyhmb3JtRGF0YS51c2VySWQpKSB8fCBudWxsO1xyXG4gIH0sIFt1c2VycywgZm9ybURhdGEudXNlcklkXSk7XHJcblxyXG4gIGNvbnN0IGN1c3RvbWVyT3JkZXJDb3VudCA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgaWYgKCFzZWxlY3RlZEN1c3RvbWVyKSB7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBOdW1iZXIob3JkZXJDb3VudEJ5VXNlcltTdHJpbmcoc2VsZWN0ZWRDdXN0b21lci5pZCldIHx8IDApO1xyXG4gIH0sIFtvcmRlckNvdW50QnlVc2VyLCBzZWxlY3RlZEN1c3RvbWVyXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoIXNlbGVjdGVkQ3VzdG9tZXIpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEZvcm1EYXRhKChwcmV2KSA9PiAoe1xyXG4gICAgICAuLi5wcmV2LFxyXG4gICAgICBzaGlwcGluZ05hbWU6IHByZXYuc2hpcHBpbmdOYW1lIHx8IHNlbGVjdGVkQ3VzdG9tZXIubmFtZSB8fCBcIlwiLFxyXG4gICAgICBzaGlwcGluZ1Bob25lOlxyXG4gICAgICAgIHByZXYuc2hpcHBpbmdQaG9uZSB8fFxyXG4gICAgICAgIHNlbGVjdGVkQ3VzdG9tZXIucGhvbmUgfHxcclxuICAgICAgICBzZWxlY3RlZEN1c3RvbWVyLm1vYmlsZSB8fFxyXG4gICAgICAgIFwiXCIsXHJcbiAgICB9KSk7XHJcbiAgfSwgW3NlbGVjdGVkQ3VzdG9tZXJdKTtcclxuXHJcbiAgY29uc3QgbGluZVRvdGFscyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3Qgc3VidG90YWwgPSBsaW5lSXRlbXMucmVkdWNlKChzdW0sIGl0ZW0pID0+IHtcclxuICAgICAgcmV0dXJuIHN1bSArIHRvTnVtYmVyKGl0ZW0ucXVhbnRpdHkpICogdG9OdW1iZXIoaXRlbS51bml0UHJpY2UpO1xyXG4gICAgfSwgMCk7XHJcblxyXG4gICAgY29uc3Qgc2hpcHBpbmdGZWUgPSB0b051bWJlcihmb3JtRGF0YS5zaGlwcGluZ0ZlZSk7XHJcbiAgICBjb25zdCB0YXggPSB0b051bWJlcihmb3JtRGF0YS50YXgpO1xyXG4gICAgY29uc3QgZGlzY291bnQgPSB0b051bWJlcihmb3JtRGF0YS5kaXNjb3VudCk7XHJcbiAgICBjb25zdCBncmFuZFRvdGFsID0gTWF0aC5tYXgoc3VidG90YWwgKyBzaGlwcGluZ0ZlZSArIHRheCAtIGRpc2NvdW50LCAwKTtcclxuXHJcbiAgICByZXR1cm4geyBzdWJ0b3RhbCwgc2hpcHBpbmdGZWUsIHRheCwgZGlzY291bnQsIGdyYW5kVG90YWwgfTtcclxuICB9LCBbbGluZUl0ZW1zLCBmb3JtRGF0YS5zaGlwcGluZ0ZlZSwgZm9ybURhdGEudGF4LCBmb3JtRGF0YS5kaXNjb3VudF0pO1xyXG5cclxuICBjb25zdCBoYW5kbGVGb3JtQ2hhbmdlID0gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCB7IG5hbWUsIHZhbHVlIH0gPSBldmVudC50YXJnZXQ7XHJcbiAgICBzZXRGb3JtRGF0YSgocHJldikgPT4gKHsgLi4ucHJldiwgW25hbWVdOiB2YWx1ZSB9KSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlTGluZUl0ZW1DaGFuZ2UgPSAoaW5kZXgsIGtleSwgdmFsdWUpID0+IHtcclxuICAgIHNldExpbmVJdGVtcygocHJldikgPT4ge1xyXG4gICAgICBjb25zdCBuZXh0ID0gWy4uLnByZXZdO1xyXG4gICAgICBjb25zdCBpdGVtID0geyAuLi5uZXh0W2luZGV4XSB9O1xyXG5cclxuICAgICAgaWYgKGtleSA9PT0gXCJwcm9kdWN0SWRcIikge1xyXG4gICAgICAgIGl0ZW0ucHJvZHVjdElkID0gdmFsdWU7XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdCA9IHByb2R1Y3RzLmZpbmQoKHApID0+IFN0cmluZyhwLmlkKSA9PT0gU3RyaW5nKHZhbHVlKSk7XHJcbiAgICAgICAgaXRlbS51bml0UHJpY2UgPSB0b051bWJlcihwcm9kdWN0Py5wcmljZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInNpemVcIikge1xyXG4gICAgICAgIGl0ZW0uc2l6ZSA9IHZhbHVlO1xyXG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJxdWFudGl0eVwiKSB7XHJcbiAgICAgICAgaXRlbS5xdWFudGl0eSA9IE1hdGgubWF4KDEsIHRvTnVtYmVyKHZhbHVlKSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInVuaXRQcmljZVwiKSB7XHJcbiAgICAgICAgaXRlbS51bml0UHJpY2UgPSBNYXRoLm1heCgwLCB0b051bWJlcih2YWx1ZSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBuZXh0W2luZGV4XSA9IGl0ZW07XHJcbiAgICAgIHJldHVybiBuZXh0O1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYWRkTGluZUl0ZW0gPSAoKSA9PiB7XHJcbiAgICBzZXRMaW5lSXRlbXMoKHByZXYpID0+IFsuLi5wcmV2LCBjcmVhdGVFbXB0eUl0ZW0oKV0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlbW92ZUxpbmVJdGVtID0gKGluZGV4KSA9PiB7XHJcbiAgICBzZXRMaW5lSXRlbXMoKHByZXYpID0+IHtcclxuICAgICAgaWYgKHByZXYubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIHByZXY7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBwcmV2LmZpbHRlcigoXywgaSkgPT4gaSAhPT0gaW5kZXgpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgbWFwc0hyZWYgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGlmICghZm9ybURhdGEuc2hpcHBpbmdBZGRyZXNzPy50cmltKCkpIHtcclxuICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGBodHRwczovL3d3dy5nb29nbGUuY29tL21hcHMvc2VhcmNoLz9hcGk9MSZxdWVyeT0ke2VuY29kZVVSSUNvbXBvbmVudChmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3MudHJpbSgpKX1gO1xyXG4gIH0sIFtmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3NdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlU3VibWl0ID0gYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGNvbnN0IHZhbGlkSXRlbXMgPSBsaW5lSXRlbXMuZmlsdGVyKFxyXG4gICAgICAoaXRlbSkgPT4gaXRlbS5wcm9kdWN0SWQgJiYgdG9OdW1iZXIoaXRlbS5xdWFudGl0eSkgPiAwLFxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoIWZvcm1EYXRhLnVzZXJJZCkge1xyXG4gICAgICBhbGVydChcIlBsZWFzZSBzZWxlY3QgYSBjdXN0b21lci5cIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmFsaWRJdGVtcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgYWxlcnQoXCJBdCBsZWFzdCBvbmUgcHJvZHVjdCBsaW5lIGl0ZW0gaXMgcmVxdWlyZWQuXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U3VibWl0dGluZyh0cnVlKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBvcmRlclBheWxvYWQgPSB7XHJcbiAgICAgICAgdXNlcklkOiBOdW1iZXIoZm9ybURhdGEudXNlcklkKSxcclxuICAgICAgICBzdGF0dXM6IGZvcm1EYXRhLnN0YXR1cyxcclxuICAgICAgICBwYXltZW50TWV0aG9kOiBmb3JtRGF0YS5wYXltZW50TWV0aG9kLFxyXG4gICAgICAgIHBheW1lbnRTdGF0dXM6IGZvcm1EYXRhLnBheW1lbnRTdGF0dXMsXHJcbiAgICAgICAgdHJhbnNhY3Rpb25JZDogZm9ybURhdGEudHJhbnNhY3Rpb25JZCB8fCBudWxsLFxyXG4gICAgICAgIHNoaXBwaW5nTmFtZTogZm9ybURhdGEuc2hpcHBpbmdOYW1lIHx8IG51bGwsXHJcbiAgICAgICAgc2hpcHBpbmdQaG9uZTogZm9ybURhdGEuc2hpcHBpbmdQaG9uZSB8fCBudWxsLFxyXG4gICAgICAgIHNoaXBwaW5nTWV0aG9kOiBmb3JtRGF0YS5zaGlwcGluZ01ldGhvZCxcclxuICAgICAgICB0cmFja2luZ051bWJlcjogZm9ybURhdGEudHJhY2tpbmdOdW1iZXIgfHwgbnVsbCxcclxuICAgICAgICBzdWJ0b3RhbDogbGluZVRvdGFscy5zdWJ0b3RhbC50b0ZpeGVkKDIpLFxyXG4gICAgICAgIHNoaXBwaW5nRmVlOiBsaW5lVG90YWxzLnNoaXBwaW5nRmVlLnRvRml4ZWQoMiksXHJcbiAgICAgICAgdGF4OiBsaW5lVG90YWxzLnRheC50b0ZpeGVkKDIpLFxyXG4gICAgICAgIGRpc2NvdW50OiBsaW5lVG90YWxzLmRpc2NvdW50LnRvRml4ZWQoMiksXHJcbiAgICAgICAgdG90YWxBbW91bnQ6IGxpbmVUb3RhbHMuZ3JhbmRUb3RhbC50b0ZpeGVkKDIpLFxyXG4gICAgICAgIHNoaXBwaW5nQWRkcmVzczogZm9ybURhdGEuc2hpcHBpbmdBZGRyZXNzIHx8IG51bGwsXHJcbiAgICAgICAgbGluZUl0ZW1zOiB2YWxpZEl0ZW1zLm1hcCgoaXRlbSkgPT4gKHtcclxuICAgICAgICAgIHByb2R1Y3RJZDogTnVtYmVyKGl0ZW0ucHJvZHVjdElkKSxcclxuICAgICAgICAgIHNpemU6IGl0ZW0uc2l6ZSB8fCBudWxsLFxyXG4gICAgICAgICAgcXVhbnRpdHk6IE1hdGgubWF4KDEsIHRvTnVtYmVyKGl0ZW0ucXVhbnRpdHkpKSxcclxuICAgICAgICAgIHVuaXRQcmljZTogTWF0aC5tYXgoMCwgdG9OdW1iZXIoaXRlbS51bml0UHJpY2UpKS50b0ZpeGVkKDIpLFxyXG4gICAgICAgIH0pKSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IHN1Ym1pdEZvcm0gPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgc3VibWl0Rm9ybS5hcHBlbmQoXCJwYXlsb2FkXCIsIEpTT04uc3RyaW5naWZ5KG9yZGVyUGF5bG9hZCkpO1xyXG5cclxuICAgICAgY29uc3Qgb3JkZXJSZXMgPSBhd2FpdCBmZXRjaChcIi9hZG1pbi9jb250ZXh0L29yZGVyLWNyZWF0ZS9zdWJtaXRcIiwge1xyXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICBib2R5OiBzdWJtaXRGb3JtLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IG9yZGVyRGF0YSA9IGF3YWl0IG9yZGVyUmVzLmpzb24oKTtcclxuICAgICAgaWYgKCFvcmRlclJlcy5vaykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihvcmRlckRhdGE/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gY3JlYXRlIG9yZGVyXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKFxyXG4gICAgICAgIGAvYWRtaW4vcmVzb3VyY2VzL09yZGVycy9yZWNvcmRzLyR7b3JkZXJEYXRhLmlkfS9zaG93YCxcclxuICAgICAgKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGFsZXJ0KGVycm9yLm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gY3JlYXRlIG9yZGVyXCIpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0U3VibWl0dGluZyhmYWxzZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3BhZ2VTdHlsZX0+XHJcbiAgICAgIDxzdHlsZT57YFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIGJvZHksXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgI2FwcCxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSAuYWRtaW5qc19MYXlvdXQsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLWNzcz1cImxheW91dFwiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBtYWluLFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlLFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlICNhcHAsXHJcbiAgICAgICAgYm9keS5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgLmFkbWluanNfTGF5b3V0LFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLXRlc3RpZD1cImxheW91dFwiXSxcclxuICAgICAgICBib2R5LmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS1jc3M9XCJsYXlvdXRcIl0sXHJcbiAgICAgICAgYm9keS5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgbWFpbiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSAjYXBwID4gZGl2LFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlICNhcHAgPiBkaXYgPiBkaXYsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgI2FwcCA+IGRpdiA+IGRpdiA+IGRpdixcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSAuYWRtaW5qc19NYWluLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIC5hZG1pbmpzX01haW4gPiBkaXYsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgLmFkbWluanNfTWFpbiA+IGRpdiA+IGRpdixcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS1jc3MqPVwiYWN0aW9uLWNvbnRlbnRcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtdGVzdGlkKj1cImNvbnRlbnRcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtY3NzJD1cIi1jb250ZW50XCJdIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmZmZmYgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmYgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLXRlc3RpZD1cInNpZGViYXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgLmFkbWluanNfU2lkZWJhcixcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBzZWN0aW9uW2RhdGEtY3NzPVwic2lkZWJhclwiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBhc2lkZVtkYXRhLWNzcz1cInNpZGViYXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgbmF2W2RhdGEtY3NzPVwic2lkZWJhclwiXSB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICB3aWR0aDogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgbWluLXdpZHRoOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBtYXgtd2lkdGg6IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYm9yZGVyOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS10ZXN0aWQ9XCJ0b3BiYXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgLmFkbWluanNfVG9wQmFyLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIGhlYWRlcltkYXRhLWNzcz1cInRvcGJhclwiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBzZWN0aW9uW2RhdGEtY3NzPVwidG9wYmFyXCJdIHtcclxuICAgICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLXRlc3RpZD1cImFjdGlvbi1oZWFkZXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtY3NzKj1cImFjdGlvbi1oZWFkZXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtdGVzdGlkKj1cImJyZWFkY3J1bWJzXCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLWNzcyo9XCJicmVhZGNydW1ic1wiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSAuYWRtaW5qc19CcmVhZGNydW1iIHtcclxuICAgICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIC5hZG1pbmpzX0xheW91dCxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS10ZXN0aWQ9XCJsYXlvdXRcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtY3NzPVwibGF5b3V0XCJdIHtcclxuICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSAuYWRtaW5qc19MYXlvdXQgPiAqOm5vdChbZGF0YS10ZXN0aWQ9XCJzaWRlYmFyXCJdKSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS10ZXN0aWQ9XCJsYXlvdXRcIl0gPiAqOm5vdChbZGF0YS10ZXN0aWQ9XCJzaWRlYmFyXCJdKSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS1jc3M9XCJsYXlvdXRcIl0gPiAqOm5vdChbZGF0YS10ZXN0aWQ9XCJzaWRlYmFyXCJdKSB7XHJcbiAgICAgICAgICB3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgbWF4LXdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBib2R5OjpiZWZvcmUsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmU6OmJlZm9yZSxcclxuICAgICAgICBib2R5LmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZTo6YmVmb3JlIHtcclxuICAgICAgICAgIGNvbnRlbnQ6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICR7cmVzcG9uc2l2ZUNzc31cclxuICAgICAgYH08L3N0eWxlPlxyXG5cclxuICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0gc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCIxNnB4XCIgfX0+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWxheW91dFwiIHN0eWxlPXtsYXlvdXRTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGFja1N0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5DdXN0b21lciBEZXRhaWxzPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TZWxlY3QgQ3VzdG9tZXIgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJ1c2VySWRcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudXNlcklkfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtsb2FkaW5nIHx8IHNlc3Npb25Vc2VyPy5yb2xlID09PSBcInVzZXJcIn1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtsb2FkaW5nID8gXCJMb2FkaW5nIGN1c3RvbWVycy4uLlwiIDogXCJTZWxlY3QgYSBjdXN0b21lclwifVxyXG4gICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAge3VzZXJzLm1hcCgodXNlcikgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXt1c2VyLmlkfSB2YWx1ZT17dXNlci5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICB7dXNlci5uYW1lfSAoI3t1c2VyLmlkfSlcclxuICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVySW5mb1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVyUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+Q3VzdG9tZXIgTmFtZSAmIElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17c3Ryb25nU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZEN1c3RvbWVyXHJcbiAgICAgICAgICAgICAgICAgICAgICA/IGAke3NlbGVjdGVkQ3VzdG9tZXIubmFtZX0gKCMke3NlbGVjdGVkQ3VzdG9tZXIuaWR9KWBcclxuICAgICAgICAgICAgICAgICAgICAgIDogXCItXCJ9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5FbWFpbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0cm9uZ1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRDdXN0b21lcj8uZW1haWwgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5QaG9uZSBOdW1iZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtzdHJvbmdTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkQ3VzdG9tZXI/LnBob25lIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEN1c3RvbWVyPy5tb2JpbGUgfHxcclxuICAgICAgICAgICAgICAgICAgICAgIFwiTm90IGF2YWlsYWJsZVwifVxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVyUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+T3JkZXIgSGlzdG9yeTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0cm9uZ1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICB7Y3VzdG9tZXJPcmRlckNvdW50fSBwcmV2aW91cyBvcmRlcnNcclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5QYXltZW50ICYgQmlsbGluZzwvaDI+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+UGF5bWVudCBPcHRpb25zPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3BheW1lbnRPcHRpb25HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICB7cGF5bWVudE9wdGlvbnMubWFwKChvcHRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmUgPSBmb3JtRGF0YS5wYXltZW50TWV0aG9kID09PSBvcHRpb24udmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17b3B0aW9uLnZhbHVlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3BheW1lbnRPcHRpb25TdHlsZShhY3RpdmUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNldEZvcm1EYXRhKChwcmV2KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ucHJldixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheW1lbnRNZXRob2Q6IG9wdGlvbi52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57b3B0aW9uLmljb259PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57b3B0aW9uLmxhYmVsfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMCB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItZ3JpZC0yXCIgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNlbGVjdGVkIE1ldGhvZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5wYXltZW50TWV0aG9kfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlYWRPbmx5XHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+UGF5bWVudCBTdGF0dXM8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInBheW1lbnRTdGF0dXNcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5wYXltZW50U3RhdHVzfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBlbmRpbmdcIj5QZW5kaW5nPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBhaWRcIj5QYWlkPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMCB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlRyYW5zYWN0aW9uIElEPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICBuYW1lPVwidHJhbnNhY3Rpb25JZFwiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS50cmFuc2FjdGlvbklkfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZS5nLiBUWE4tMjAyNi0wMDAxMjRcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGFja1N0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICBnYXA6IFwiOHB4XCIsXHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxoMiBzdHlsZT17eyAuLi5zZWN0aW9uVGl0bGVTdHlsZSwgbWFyZ2luQm90dG9tOiAwIH19PlxyXG4gICAgICAgICAgICAgICAgICBQcm9kdWN0IExpbmUgSXRlbXMgKFJlcXVpcmVkKVxyXG4gICAgICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2FkZExpbmVJdGVtfVxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17YWRkQnV0dG9uU3R5bGV9XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICsgQWRkIEl0ZW1cclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTIgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ2FwOiBcIjEwcHhcIiB9fT5cclxuICAgICAgICAgICAgICAgIHtsaW5lSXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZFByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKFxyXG4gICAgICAgICAgICAgICAgICAgIChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhpdGVtLnByb2R1Y3RJZCksXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1Ub3RhbCA9XHJcbiAgICAgICAgICAgICAgICAgICAgdG9OdW1iZXIoaXRlbS5xdWFudGl0eSkgKiB0b051bWJlcihpdGVtLnVuaXRQcmljZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtgbGluZS1pdGVtLSR7aW5kZXh9YH0gc3R5bGU9e2xpbmVJdGVtUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17bGluZUl0ZW1Ub3BTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlByb2R1Y3Q8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnByb2R1Y3RJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxpbmVJdGVtQ2hhbmdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicHJvZHVjdElkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjdCBwcm9kdWN0PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdHMubWFwKChwcm9kdWN0KSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtwcm9kdWN0LmlkfSB2YWx1ZT17cHJvZHVjdC5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3Byb2R1Y3QubmFtZX0gKFNLVToge3Byb2R1Y3Quc2t1fSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3JlbW92ZUJ1dHRvblN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHJlbW92ZUxpbmVJdGVtKGluZGV4KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlbW92ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Byb2R1Y3RQcmV2aWV3U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRQcm9kdWN0Py5pbWFnZVVybCA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM9e3NlbGVjdGVkUHJvZHVjdC5pbWFnZVVybH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdD17c2VsZWN0ZWRQcm9kdWN0Lm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmltYWdlU3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCIzcHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogXCIxNHB4XCIsIGNvbG9yOiBcIiNmOGZhZmNcIiB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZFByb2R1Y3Q/Lm5hbWUgfHwgXCJTZWxlY3QgYSBwcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IFwiMTJweFwiLCBjb2xvcjogXCIjOTRhM2I4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTS1UvSUQ6e1wiIFwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGAke3NlbGVjdGVkUHJvZHVjdC5za3V9IC8gIyR7c2VsZWN0ZWRQcm9kdWN0LmlkfWBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIi1cIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IFwiMTJweFwiLCBjb2xvcjogXCIjY2JkNWUxXCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaXplOiB7aXRlbS5zaXplIHx8IFwiLVwifSB8IFF0eToge2l0ZW0ucXVhbnRpdHl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TaXplPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnNpemUgfHwgXCJNXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxpbmVJdGVtQ2hhbmdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaXplXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7aXRlbVNpemVPcHRpb25zLm1hcCgoc2l6ZU9wdGlvbikgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e3NpemVPcHRpb259IHZhbHVlPXtzaXplT3B0aW9ufT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NpemVPcHRpb259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItZ3JpZC0yXCIgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5RdWFudGl0eTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2l0ZW0ucXVhbnRpdHl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVMaW5lSXRlbUNoYW5nZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInF1YW50aXR5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlVuaXQgUHJpY2U8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnVuaXRQcmljZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxpbmVJdGVtQ2hhbmdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidW5pdFByaWNlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLi4udG90YWxzUm93U3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nQm90dG9tOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+TGluZSBUb3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdE1vbmV5KGl0ZW1Ub3RhbCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlNoaXBwaW5nICYgVHJhY2tpbmc8L2gyPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItZ3JpZC0yXCIgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIENvbnRhY3QgTmFtZSAqPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nTmFtZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnNoaXBwaW5nTmFtZX1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlJlY2VpdmVyIGZ1bGwgbmFtZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIFBob25lIE51bWJlciAqPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nUGhvbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5zaGlwcGluZ1Bob25lfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMDdYIFhYWCBYWFhYXCJcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMCB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIEFkZHJlc3MgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWFcclxuICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nQWRkcmVzc1wiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3N9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLmlucHV0U3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWluSGVpZ2h0OiBcIjg2cHhcIixcclxuICAgICAgICAgICAgICAgICAgICByZXNpemU6IFwidmVydGljYWxcIixcclxuICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJIb3VzZSBudW1iZXIsIHN0cmVldCwgY2l0eSwgcG9zdGFsIGNvZGVcIlxyXG4gICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIHttYXBzSHJlZiA/IChcclxuICAgICAgICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgICAgICBocmVmPXttYXBzSHJlZn1cclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXttYXBMaW5rU3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICBPcGVuIG9uIEdvb2dsZSBNYXBzXHJcbiAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICkgOiBudWxsfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWdyaWQtMlwiIHN0eWxlPXtncmlkMlN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TaGlwcGluZyBNZXRob2Q8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nTWV0aG9kXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuc2hpcHBpbmdNZXRob2R9XHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICB7c2hpcHBpbmdNZXRob2RzLm1hcCgoaXRlbSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2l0ZW19IHZhbHVlPXtpdGVtfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW19XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5UcmFja2luZyBOdW1iZXI8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwidHJhY2tpbmdOdW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS50cmFja2luZ051bWJlcn1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlRSSy1YWFhYWFhcIlxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5PcmRlciBTdW1tYXJ5IC8gVG90YWxzPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWdyaWQtMlwiIHN0eWxlPXtncmlkMlN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TaGlwcGluZyBGZWU8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nRmVlXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuc2hpcHBpbmdGZWV9XHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5UYXggLyBWQVQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInRheFwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnRheH1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5EaXNjb3VudCAvIENvdXBvbjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcclxuICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJkaXNjb3VudFwiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5kaXNjb3VudH1cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5TdWJ0b3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGxpbmVUb3RhbHMuc3VidG90YWwpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5TaGlwcGluZyBGZWU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leShsaW5lVG90YWxzLnNoaXBwaW5nRmVlKX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbHNSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+VGF4IC8gVkFUPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkobGluZVRvdGFscy50YXgpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5EaXNjb3VudDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmc+LSB7Zm9ybWF0TW9uZXkobGluZVRvdGFscy5kaXNjb3VudCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj5HcmFuZCBUb3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuPntmb3JtYXRNb25leShsaW5lVG90YWxzLmdyYW5kVG90YWwpfTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c2VjdXJpdHlDaGlwV3JhcFN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3NlY3VyaXR5Q2hpcFN0eWxlfT5TZWN1cmUgUGF5bWVudCBQcm90ZWN0ZWQ8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3NlY3VyaXR5Q2hpcFN0eWxlfT5FbmNyeXB0ZWQgQ2hlY2tvdXQgQ2hhbm5lbDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c2VjdXJpdHlDaGlwU3R5bGV9PlRydXN0ZWQgRGVsaXZlcnkgVHJhY2tpbmc8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyAuLi5jYXJkU3R5bGUsIHBhZGRpbmdUb3A6IFwiMTRweFwiIH19PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17YWN0aW9uQmFyU3R5bGV9PlxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgc3R5bGU9e2FjdGlvbkJ1dHRvblN0eWxlKGZhbHNlKX1cclxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB3aW5kb3cuaGlzdG9yeS5iYWNrKCl9XHJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICBDYW5jZWxcclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcclxuICAgICAgICAgICAgICBzdHlsZT17YWN0aW9uQnV0dG9uU3R5bGUodHJ1ZSl9XHJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICB7c3VibWl0dGluZyA/IFwiQ3JlYXRpbmcgT3JkZXIuLi5cIiA6IFwiQ3JlYXRlIE9yZGVyXCJ9XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZm9ybT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlckNyZWF0ZTtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHBhZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG4gIGNvbG9yOiBcIiNlMmU4ZjBcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMThweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIpXCIsXHJcbiAgYmFja2dyb3VuZDpcclxuICAgIFwibGluZWFyLWdyYWRpZW50KDE1NWRlZywgcmdiYSgxMCwgMjMsIDQ4LCAwLjk0KSAwJSwgcmdiYSg4LCAxOCwgMzgsIDAuOTQpIDEwMCUpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTRweCAzMHB4IHJnYmEoMiwgNiwgMjMsIDAuMilcIixcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGhlYWRlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBoZWFkaW5nU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBmb250U2l6ZTogXCIzNHB4XCIsXHJcbiAgbGluZUhlaWdodDogMS4xLFxyXG59O1xyXG5cclxuY29uc3Qgc3ViVGV4dFN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgbWFyZ2luVG9wOiBcIjRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IChzdGF0dXMpID0+IHtcclxuICBjb25zdCB2YWwgPSBTdHJpbmcoc3RhdHVzIHx8IFwicGVuZGluZ1wiKS50b0xvd2VyQ2FzZSgpO1xyXG4gIGNvbnN0IHN0eWxlQnlTdGF0dXMgPSB7XHJcbiAgICBwZW5kaW5nOiB7IGJnOiBcIiNmZWYzYzdcIiwgZmc6IFwiIzdjMmQxMlwiIH0sXHJcbiAgICBwYWlkOiB7IGJnOiBcIiNiYmY3ZDBcIiwgZmc6IFwiIzE0NTMyZFwiIH0sXHJcbiAgICBwcm9jZXNzaW5nOiB7IGJnOiBcIiNiZmRiZmVcIiwgZmc6IFwiIzFlM2E4YVwiIH0sXHJcbiAgICBzaGlwcGVkOiB7IGJnOiBcIiNkZGQ2ZmVcIiwgZmc6IFwiIzRjMWQ5NVwiIH0sXHJcbiAgICBjb21wbGV0ZWQ6IHsgYmc6IFwiI2E3ZjNkMFwiLCBmZzogXCIjMDY0ZTNiXCIgfSxcclxuICAgIGNhbmNlbGxlZDogeyBiZzogXCIjZmVjYWNhXCIsIGZnOiBcIiM3ZjFkMWRcIiB9LFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNlbGVjdGVkID0gc3R5bGVCeVN0YXR1c1t2YWxdIHx8IHN0eWxlQnlTdGF0dXMucGVuZGluZztcclxuICByZXR1cm4ge1xyXG4gICAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gICAgcGFkZGluZzogXCI2cHggMTJweFwiLFxyXG4gICAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxyXG4gICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICAgIGJhY2tncm91bmQ6IHNlbGVjdGVkLmJnLFxyXG4gICAgY29sb3I6IHNlbGVjdGVkLmZnLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uVGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiMCAwIDEycHggMFwiLFxyXG4gIGNvbG9yOiBcIiNmNWRmOTBcIixcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMWVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxufTtcclxuXHJcbmNvbnN0IGdyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgzMDBweCwgMWZyKSBtaW5tYXgoMzIwcHgsIDFmcilcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0dyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI4cHhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0YWJsZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBsaW5lSXRlbVN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgcGFkZGluZzogXCIxMHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNDQpXCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCI2MHB4IDFmciBhdXRvXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2MHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjYwcHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG59O1xyXG5cclxuY29uc3QgdG90YWxCb3hTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0b3RhbFJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI3cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGdyYW5kU3R5bGUgPSB7XHJcbiAgLi4udG90YWxSb3dTdHlsZSxcclxuICBib3JkZXJCb3R0b206IFwibm9uZVwiLFxyXG4gIHBhZGRpbmdUb3A6IFwiNnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGZvbnRTaXplOiBcIjE4cHhcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBlbXB0eVN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggZGFzaGVkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdE1vbmV5ID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgbiA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gYFJzLiAke24udG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSl9YDtcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUpID0+IHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gXCItXCI7XHJcbiAgfVxyXG5cclxuICBjb25zdCBkdCA9IG5ldyBEYXRlKHZhbHVlKTtcclxuICBpZiAoTnVtYmVyLmlzTmFOKGR0LmdldFRpbWUoKSkpIHtcclxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGR0LnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgZGF0ZVN0eWxlOiBcIm1lZGl1bVwiLFxyXG4gICAgdGltZVN0eWxlOiBcInNob3J0XCIsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBPcmRlclNob3cgPSAoeyByZWNvcmQgfSkgPT4ge1xyXG4gIGNvbnN0IFtkZXRhaWxzLCBzZXREZXRhaWxzXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIGNvbnN0IG9yZGVySWQgPSByZWNvcmQ/LnBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZDtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghb3JkZXJJZCkge1xyXG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgc2V0RXJyb3IoXCJPcmRlciBpZCBub3QgZm91bmRcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsb2FkRGV0YWlscyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBzZXRFcnJvcihcIlwiKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9jb250ZXh0L29yZGVycy8ke2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcob3JkZXJJZCkpfS9kZXRhaWxzYCxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZD8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGRldGFpbHNcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXREZXRhaWxzKHBheWxvYWQpO1xyXG4gICAgICB9IGNhdGNoIChmZXRjaEVycm9yKSB7XHJcbiAgICAgICAgc2V0RXJyb3IoZmV0Y2hFcnJvcj8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGRldGFpbHNcIik7XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbG9hZERldGFpbHMoKTtcclxuICB9LCBbb3JkZXJJZF0pO1xyXG5cclxuICBjb25zdCB0b3RhbHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IHN1YnRvdGFsID0gTnVtYmVyKGRldGFpbHM/LnN1YnRvdGFsIHx8IDApO1xyXG4gICAgY29uc3Qgc2hpcHBpbmdGZWUgPSBOdW1iZXIoZGV0YWlscz8uc2hpcHBpbmdGZWUgfHwgMCk7XHJcbiAgICBjb25zdCB0YXggPSBOdW1iZXIoZGV0YWlscz8udGF4IHx8IDApO1xyXG4gICAgY29uc3QgZGlzY291bnQgPSBOdW1iZXIoZGV0YWlscz8uZGlzY291bnQgfHwgMCk7XHJcbiAgICBjb25zdCB0b3RhbEFtb3VudCA9IE51bWJlcihkZXRhaWxzPy50b3RhbEFtb3VudCB8fCAwKTtcclxuXHJcbiAgICByZXR1cm4geyBzdWJ0b3RhbCwgc2hpcHBpbmdGZWUsIHRheCwgZGlzY291bnQsIHRvdGFsQW1vdW50IH07XHJcbiAgfSwgW2RldGFpbHNdKTtcclxuXHJcbiAgaWYgKGxvYWRpbmcpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5Mb2FkaW5nIG9yZGVyIGRldGFpbHMuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT57ZXJyb3J9PC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKCFkZXRhaWxzKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+T3JkZXIgZGV0YWlscyBub3QgYXZhaWxhYmxlLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+e2BAbWVkaWEgKG1heC13aWR0aDogMTA0MHB4KSB7IC5jaGFuZ2U4LW9yZGVyLXNob3ctZ3JpZCB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7IH0gfWB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17aGVhZGVyU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGgxIHN0eWxlPXtoZWFkaW5nU3R5bGV9Pk9yZGVyICN7ZGV0YWlscy5pZH08L2gxPlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdWJUZXh0U3R5bGV9PlxyXG4gICAgICAgICAgICAgIENyZWF0ZWQge2Zvcm1hdERhdGUoZGV0YWlscy5jcmVhdGVkQXQpfSB8IFVwZGF0ZWR7XCIgXCJ9XHJcbiAgICAgICAgICAgICAge2Zvcm1hdERhdGUoZGV0YWlscy51cGRhdGVkQXQpfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9e2JhZGdlU3R5bGUoZGV0YWlscy5zdGF0dXMpfT5cclxuICAgICAgICAgICAge2RldGFpbHMuc3RhdHVzIHx8IFwicGVuZGluZ1wifVxyXG4gICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1zaG93LWdyaWRcIiBzdHlsZT17Z3JpZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+Q3VzdG9tZXIgJiBTaGlwcGluZzwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+Q3VzdG9tZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8udXNlcj8ubmFtZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlNoaXBwaW5nIENvbnRhY3Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8uc2hpcHBpbmdOYW1lIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgUGhvbmU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8uc2hpcHBpbmdQaG9uZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkVtYWlsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnVzZXI/LmVtYWlsIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UGF5bWVudCBNZXRob2Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8ucGF5bWVudE1ldGhvZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlBheW1lbnQgU3RhdHVzPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnBheW1lbnRTdGF0dXMgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5UcmFuc2FjdGlvbiBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy50cmFuc2FjdGlvbklkIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgTWV0aG9kPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnNoaXBwaW5nTWV0aG9kIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VHJhY2tpbmcgTnVtYmVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnRyYWNraW5nTnVtYmVyIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiBcIjEzcHhcIiwgY29sb3I6IFwiI2NiZDVlMVwiLCBsaW5lSGVpZ2h0OiAxLjYgfX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiLCBtYXJnaW5Cb3R0b206IFwiNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICBTaGlwcGluZyBBZGRyZXNzXHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIgfX0+XHJcbiAgICAgICAgICAgICAgICB7ZGV0YWlscz8uc2hpcHBpbmdBZGRyZXNzIHx8IFwiLVwifVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+T3JkZXIgU3VtbWFyeSAvIFRvdGFsczwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbEJveFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlN1YnRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KHRvdGFscy5zdWJ0b3RhbCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgRmVlPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KHRvdGFscy5zaGlwcGluZ0ZlZSl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VGF4IC8gVkFUPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KHRvdGFscy50YXgpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkRpc2NvdW50PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+LSB7Zm9ybWF0TW9uZXkodG90YWxzLmRpc2NvdW50KX08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2dyYW5kU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuPkdyYW5kIFRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuPntmb3JtYXRNb25leSh0b3RhbHMudG90YWxBbW91bnQpfTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlByb2R1Y3QgTGluZSBJdGVtczwvaDI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17dGFibGVTdHlsZX0+XHJcbiAgICAgICAgICB7KGRldGFpbHM/Lml0ZW1zIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9Pk5vIGxpbmUgaXRlbXMgaW4gdGhpcyBvcmRlci48L2Rpdj5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgIChkZXRhaWxzLml0ZW1zIHx8IFtdKS5tYXAoKGl0ZW0pID0+IChcclxuICAgICAgICAgICAgICA8ZGl2IGtleT17aXRlbS5pZH0gc3R5bGU9e2xpbmVJdGVtU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAge2l0ZW0/LnByb2R1Y3Q/LmltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjPXtpdGVtLnByb2R1Y3QuaW1hZ2VVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgYWx0PXtpdGVtPy5wcm9kdWN0Py5uYW1lIHx8IFwiUHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbWFnZVN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAuLi5pbWFnZVN0eWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIE5vIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZ3JpZFwiLCBnYXA6IFwiNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAge2l0ZW0/LnByb2R1Y3Q/Lm5hbWUgfHwgXCJVbm5hbWVkIHByb2R1Y3RcIn1cclxuICAgICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIFNLVToge2l0ZW0/LnByb2R1Y3Q/LnNrdSB8fCBcIi1cIn0gfCBQcm9kdWN0IElEOiAjXHJcbiAgICAgICAgICAgICAgICAgICAge2l0ZW0/LnByb2R1Y3RJZH1cclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjY2JkNWUxXCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICBTaXplOiB7aXRlbT8uc2l6ZSB8fCBcIi1cIn0gfCBRdHk6IHtpdGVtLnF1YW50aXR5fSB4e1wiIFwifVxyXG4gICAgICAgICAgICAgICAgICAgIHtmb3JtYXRNb25leShpdGVtLnVuaXRQcmljZSl9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNXB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgIHtmb3JtYXRNb25leShpdGVtLnRvdGFsUHJpY2UpfVxyXG4gICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlclNob3c7XHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgcGFnZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbiAgY29sb3I6IFwiI2UyZThmMFwiLFxyXG59O1xyXG5cclxuY29uc3QgY2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxOHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMilcIixcclxuICBiYWNrZ3JvdW5kOlxyXG4gICAgXCJsaW5lYXItZ3JhZGllbnQoMTU1ZGVnLCByZ2JhKDEwLCAyMywgNDgsIDAuOTQpIDAlLCByZ2JhKDgsIDE4LCAzOCwgMC45NCkgMTAwJSlcIixcclxuICBib3hTaGFkb3c6IFwiMCAxNHB4IDMwcHggcmdiYSgyLCA2LCAyMywgMC4yKVwiLFxyXG4gIHBhZGRpbmc6IFwiMThweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaGVhZGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IHRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcIjM0cHhcIixcclxuICBsaW5lSGVpZ2h0OiAxLjEsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3Qgc3VidGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiNnB4IDAgMCAwXCIsXHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGJhZGdlU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICBwYWRkaW5nOiBcIjZweCAxMnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgY29sb3I6IFwiIzE0NTMyZFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2JiZjdkMFwiLFxyXG59O1xyXG5cclxuY29uc3QgZ3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwibWlubWF4KDMwMHB4LCAwLjk1ZnIpIG1pbm1heCgzMjBweCwgMS4wNWZyKVwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uVGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiMCAwIDEycHggMFwiLFxyXG4gIGNvbG9yOiBcIiNmNWRmOTBcIixcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMWVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9HcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb1Jvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiOHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjI4MHB4XCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE0cHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yMilcIixcclxufTtcclxuXHJcbmNvbnN0IGxpbmVJdGVtU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCI4NHB4IDFmciBhdXRvXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIHBhZGRpbmc6IFwiMTJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMilcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTUsIDIzLCA0MiwgMC40NClcIixcclxufTtcclxuXHJcbmNvbnN0IGVtcHR5SW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI4NHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjg0cHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxufTtcclxuXHJcbmNvbnN0IHRvdGFsUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjdweFwiLFxyXG59O1xyXG5cclxuY29uc3QgZ3JhbmRTdHlsZSA9IHtcclxuICAuLi50b3RhbFJvd1N0eWxlLFxyXG4gIGJvcmRlckJvdHRvbTogXCJub25lXCIsXHJcbiAgcGFkZGluZ1RvcDogXCI2cHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgZm9udFNpemU6IFwiMThweFwiLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IGVtcHR5U3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgcGFkZGluZzogXCIxNHB4XCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0TW9uZXkgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBuID0gTnVtYmVyKHZhbHVlIHx8IDApO1xyXG4gIHJldHVybiBgUnMuICR7bi50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiBcIi1cIjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGR0ID0gbmV3IERhdGUodmFsdWUpO1xyXG4gIGlmIChOdW1iZXIuaXNOYU4oZHQuZ2V0VGltZSgpKSkge1xyXG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZHQudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBkYXRlU3R5bGU6IFwibWVkaXVtXCIsXHJcbiAgICB0aW1lU3R5bGU6IFwic2hvcnRcIixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IE9yZGVySXRlbVNob3cgPSAoeyByZWNvcmQgfSkgPT4ge1xyXG4gIGNvbnN0IFtkZXRhaWxzLCBzZXREZXRhaWxzXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIGNvbnN0IG9yZGVySXRlbUlkID0gcmVjb3JkPy5wYXJhbXM/LmlkIHx8IHJlY29yZD8uaWQ7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoIW9yZGVySXRlbUlkKSB7XHJcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICBzZXRFcnJvcihcIk9yZGVyIGl0ZW0gaWQgbm90IGZvdW5kXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbG9hZERldGFpbHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgc2V0RXJyb3IoXCJcIik7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgICAgIGAvYWRtaW4vY29udGV4dC9vcmRlci1pdGVtcy8ke2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcob3JkZXJJdGVtSWQpKX0vZGV0YWlsc2AsXHJcbiAgICAgICAgICB7IGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgcGF5bG9hZD8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGl0ZW0gZGV0YWlsc1wiLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldERldGFpbHMocGF5bG9hZCk7XHJcbiAgICAgIH0gY2F0Y2ggKGZldGNoRXJyb3IpIHtcclxuICAgICAgICBzZXRFcnJvcihmZXRjaEVycm9yPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgb3JkZXIgaXRlbSBkZXRhaWxzXCIpO1xyXG4gICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWREZXRhaWxzKCk7XHJcbiAgfSwgW29yZGVySXRlbUlkXSk7XHJcblxyXG4gIGNvbnN0IGNhbGN1bGF0ZWRUb3RhbCA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgcmV0dXJuIE51bWJlcihkZXRhaWxzPy50b3RhbFByaWNlIHx8IDApO1xyXG4gIH0sIFtkZXRhaWxzXSk7XHJcblxyXG4gIGlmIChsb2FkaW5nKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+TG9hZGluZyBvcmRlciBpdGVtIGRldGFpbHMuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT57ZXJyb3J9PC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKCFkZXRhaWxzKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+T3JkZXIgaXRlbSBkZXRhaWxzIG5vdCBhdmFpbGFibGUuPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcHJvZHVjdCA9IGRldGFpbHM/LnByb2R1Y3QgfHwge307XHJcbiAgY29uc3Qgb3JkZXIgPSBkZXRhaWxzPy5vcmRlciB8fCB7fTtcclxuICBjb25zdCBjdXN0b21lciA9IG9yZGVyPy51c2VyIHx8IHt9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17cGFnZVN0eWxlfT5cclxuICAgICAgPHN0eWxlPntgQG1lZGlhIChtYXgtd2lkdGg6IDEwNDBweCkgeyAuY2hhbmdlOC1vcmRlci1pdGVtLWdyaWQgeyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50OyB9IH1gfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2hlYWRlclN0eWxlfT5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxoMSBzdHlsZT17dGl0bGVTdHlsZX0+e3Byb2R1Y3Q/Lm5hbWUgfHwgXCJPcmRlciBJdGVtXCJ9PC9oMT5cclxuICAgICAgICAgICAgPHAgc3R5bGU9e3N1YnRpdGxlU3R5bGV9PlxyXG4gICAgICAgICAgICAgIE9yZGVyICN7b3JkZXI/LmlkIHx8IFwiLVwifSDigKIgSXRlbSAje2RldGFpbHM/LmlkIHx8IFwiLVwifVxyXG4gICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxzcGFuIHN0eWxlPXtiYWRnZVN0eWxlfT5BY3RpdmUgSXRlbTwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItaXRlbS1ncmlkXCIgc3R5bGU9e2dyaWRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgIHtwcm9kdWN0Py5pbWFnZVVybCA/IChcclxuICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgIHNyYz17cHJvZHVjdC5pbWFnZVVybH1cclxuICAgICAgICAgICAgICBhbHQ9e3Byb2R1Y3Q/Lm5hbWUgfHwgXCJQcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIC4uLmltYWdlU3R5bGUsXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgTm8gaW1hZ2UgYXZhaWxhYmxlXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTQgfX0gLz5cclxuXHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5Qcm9kdWN0IFNuYXBzaG90PC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5Qcm9kdWN0IE5hbWU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57cHJvZHVjdD8ubmFtZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlNLVTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntwcm9kdWN0Py5za3UgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5Qcm9kdWN0IElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+I3twcm9kdWN0Py5pZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkN1cnJlbnQgU3RvY2s8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57cHJvZHVjdD8uc3RvY2sgPz8gXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5PcmRlciAmIEN1c3RvbWVyPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5DdXN0b21lcjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntjdXN0b21lcj8ubmFtZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkVtYWlsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2N1c3RvbWVyPy5lbWFpbCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19Pk9yZGVyIElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+I3tvcmRlcj8uaWQgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5PcmRlciBTdGF0dXM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57b3JkZXI/LnN0YXR1cyB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlBheW1lbnQgTWV0aG9kPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e29yZGVyPy5wYXltZW50TWV0aG9kIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgTWV0aG9kPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e29yZGVyPy5zaGlwcGluZ01ldGhvZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlRyYWNraW5nIE51bWJlcjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntvcmRlcj8udHJhY2tpbmdOdW1iZXIgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5DcmVhdGVkIEF0PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdERhdGUoZGV0YWlscy5jcmVhdGVkQXQpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UHJpY2luZyBEZXRhaWxzPC9oMj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvR3JpZFN0eWxlfT5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5RdWFudGl0eTwvc3Bhbj5cclxuICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscy5xdWFudGl0eX08L3N0cm9uZz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlVuaXQgUHJpY2U8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGRldGFpbHMudW5pdFByaWNlKX08L3N0cm9uZz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkxpbmUgVG90YWw8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGNhbGN1bGF0ZWRUb3RhbCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlF1aWNrIFN1bW1hcnk8L2gyPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2xpbmVJdGVtU3R5bGV9PlxyXG4gICAgICAgICAge3Byb2R1Y3Q/LmltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgc3JjPXtwcm9kdWN0LmltYWdlVXJsfVxyXG4gICAgICAgICAgICAgIGFsdD17cHJvZHVjdD8ubmFtZSB8fCBcIlByb2R1Y3RcIn1cclxuICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiODRweFwiLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjg0cHhcIixcclxuICAgICAgICAgICAgICAgIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17ZW1wdHlJbWFnZVN0eWxlfT5ObyBpbWFnZTwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCI0cHhcIiB9fT5cclxuICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIsIGZvbnRTaXplOiBcIjE2cHhcIiB9fT5cclxuICAgICAgICAgICAgICB7cHJvZHVjdD8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwifVxyXG4gICAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgU0tVOiB7cHJvZHVjdD8uc2t1IHx8IFwiLVwifVxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiNjYmQ1ZTFcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgIFF0eSB7ZGV0YWlscy5xdWFudGl0eX0geCB7Zm9ybWF0TW9uZXkoZGV0YWlscy51bml0UHJpY2UpfVxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNnB4XCIgfX0+XHJcbiAgICAgICAgICAgIHtmb3JtYXRNb25leShjYWxjdWxhdGVkVG90YWwpfVxyXG4gICAgICAgICAgPC9zdHJvbmc+XHJcblxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlckl0ZW1TaG93O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgY2VsbFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBtaW5IZWlnaHQ6IFwiNTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2NHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjQycHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZsZXhTaHJpbms6IDAsXHJcbn07XHJcblxyXG5jb25zdCBmYWxsYmFja1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjY0cHhcIixcclxuICBoZWlnaHQ6IFwiNDJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjYpXCIsXHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgY29sb3I6IFwiIzY0NzQ4YlwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZsZXhTaHJpbms6IDAsXHJcbn07XHJcblxyXG5jb25zdCB0ZXh0U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcclxuICBnYXA6IFwiMnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0SW1hZ2UgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCBpbWFnZVVybCA9IHByb3BzPy5yZWNvcmQ/LnBhcmFtcz8uW3Byb3BzPy5wcm9wZXJ0eT8ucGF0aF07XHJcbiAgY29uc3QgW2hhc0Vycm9yLCBzZXRIYXNFcnJvcl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBzZXRIYXNFcnJvcihmYWxzZSk7XHJcbiAgfSwgW2ltYWdlVXJsXSk7XHJcblxyXG4gIGlmICghaW1hZ2VVcmwpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtmYWxsYmFja1N0eWxlfT5ObyBpbWFnZTwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChoYXNFcnJvcikge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBzdHlsZT17Y2VsbFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtmYWxsYmFja1N0eWxlfT5JbnZhbGlkPC9kaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IFwiIzBmMTcyYVwiIH19PkltYWdlIFVSTDwvc3Bhbj5cclxuICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgIGhyZWY9e2ltYWdlVXJsfVxyXG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICBjb2xvcjogXCIjMjU2M2ViXCIsXHJcbiAgICAgICAgICAgICAgdGV4dERlY29yYXRpb246IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgT3BlbiBsaW5rXHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtjZWxsU3R5bGV9PlxyXG4gICAgICA8aW1nXHJcbiAgICAgICAgc3JjPXtpbWFnZVVybH1cclxuICAgICAgICBhbHQ9XCJQcm9kdWN0XCJcclxuICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX1cclxuICAgICAgICBvbkVycm9yPXsoKSA9PiBzZXRIYXNFcnJvcih0cnVlKX1cclxuICAgICAgLz5cclxuICAgICAgPGRpdiBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBcIiMwZjE3MmFcIiB9fT5QcmV2aWV3PC9zcGFuPlxyXG4gICAgICAgIDxhXHJcbiAgICAgICAgICBocmVmPXtpbWFnZVVybH1cclxuICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXHJcbiAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiBcIiMyNTYzZWJcIiwgdGV4dERlY29yYXRpb246IFwibm9uZVwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICBPcGVuIGltYWdlXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0SW1hZ2U7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCB3cmFwcGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG59O1xyXG5cclxuY29uc3QgcHJldmlld1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjE0MHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjk2cHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3QgaGludFN0eWxlID0ge1xyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBjb2xvcjogXCIjNjQ3NDhiXCIsXHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0SW1hZ2VVcGxvYWQgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCB7IG9uQ2hhbmdlLCByZWNvcmQgfSA9IHByb3BzO1xyXG4gIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHJlY29yZD8ucGFyYW1zPy5pbWFnZVVybCB8fCBcIlwiO1xyXG4gIGNvbnN0IGN1cnJlbnRQdWJsaWNJZCA9IHJlY29yZD8ucGFyYW1zPy5pbWFnZVB1YmxpY0lkIHx8IFwiXCI7XHJcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoY3VycmVudFZhbHVlKTtcclxuICBjb25zdCBbcHVibGljSWQsIHNldFB1YmxpY0lkXSA9IHVzZVN0YXRlKGN1cnJlbnRQdWJsaWNJZCk7XHJcbiAgY29uc3QgW3VwbG9hZGluZywgc2V0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgc2V0UHJldmlld1VybChjdXJyZW50VmFsdWUpO1xyXG4gICAgc2V0UHVibGljSWQoY3VycmVudFB1YmxpY0lkKTtcclxuICB9LCBbY3VycmVudFZhbHVlLCBjdXJyZW50UHVibGljSWRdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlVXBsb2FkID0gYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF07XHJcblxyXG4gICAgaWYgKCFmaWxlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSk7XHJcbiAgICBzZXRFcnJvcihcIlwiKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXCJpbWFnZVwiLCBmaWxlKTtcclxuXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvYXBpL3VwbG9hZHMvaW1hZ2VcIiwge1xyXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgYm9keTogZm9ybURhdGEsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZC5tZXNzYWdlIHx8IFwiSW1hZ2UgdXBsb2FkIGZhaWxlZFwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdXBsb2FkZWRVcmwgPSBwYXlsb2FkLnVybCB8fCBcIlwiO1xyXG4gICAgICBjb25zdCB1cGxvYWRlZFB1YmxpY0lkID0gcGF5bG9hZC5wdWJsaWNJZCB8fCBcIlwiO1xyXG4gICAgICBzZXRQcmV2aWV3VXJsKHVwbG9hZGVkVXJsKTtcclxuICAgICAgc2V0UHVibGljSWQodXBsb2FkZWRQdWJsaWNJZCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVVybFwiLCB1cGxvYWRlZFVybCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVB1YmxpY0lkXCIsIHVwbG9hZGVkUHVibGljSWQpO1xyXG4gICAgICBvbkNoYW5nZT8uKFwidXBsb2FkSW1hZ2VcIiwgdXBsb2FkZWRVcmwpO1xyXG4gICAgfSBjYXRjaCAodXBsb2FkRXJyb3IpIHtcclxuICAgICAgc2V0RXJyb3IodXBsb2FkRXJyb3IubWVzc2FnZSk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpO1xyXG4gICAgICBldmVudC50YXJnZXQudmFsdWUgPSBcIlwiO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZVJlbW92ZSA9ICgpID0+IHtcclxuICAgIHNldFByZXZpZXdVcmwoXCJcIik7XHJcbiAgICBzZXRQdWJsaWNJZChcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVVybFwiLCBcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVB1YmxpY0lkXCIsIFwiXCIpO1xyXG4gICAgb25DaGFuZ2U/LihcInVwbG9hZEltYWdlXCIsIFwiXCIpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt3cmFwcGVyU3R5bGV9PlxyXG4gICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e2hhbmRsZVVwbG9hZH0gLz5cclxuICAgICAgPGRpdiBzdHlsZT17aGludFN0eWxlfT5cclxuICAgICAgICB7dXBsb2FkaW5nXHJcbiAgICAgICAgICA/IFwiVXBsb2FkaW5nIHRvIENsb3VkaW5hcnkuLi5cIlxyXG4gICAgICAgICAgOiBcIkNob29zZSBhbiBpbWFnZSBmaWxlIHRvIHVwbG9hZFwifVxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHtwcmV2aWV3VXJsID8gKFxyXG4gICAgICAgIDw+XHJcbiAgICAgICAgICA8aW1nIHNyYz17cHJldmlld1VybH0gYWx0PVwiUHJvZHVjdCBwcmV2aWV3XCIgc3R5bGU9e3ByZXZpZXdTdHlsZX0gLz5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVJlbW92ZX1cclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwiNnB4IDEwcHhcIixcclxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IFwiOHB4XCIsXHJcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjZWY0NDQ0XCIsXHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiI2VmNDQ0NFwiLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiI2ZmZlwiLFxyXG4gICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIFJlbW92ZSBpbWFnZVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC8+XHJcbiAgICAgICkgOiBudWxsfVxyXG5cclxuICAgICAge2Vycm9yID8gKFxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgLi4uaGludFN0eWxlLCBjb2xvcjogXCIjZGMyNjI2XCIgfX0+e2Vycm9yfTwvZGl2PlxyXG4gICAgICApIDogbnVsbH1cclxuXHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImltYWdlVXJsXCIgdmFsdWU9e3ByZXZpZXdVcmx9IHJlYWRPbmx5IC8+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImltYWdlUHVibGljSWRcIiB2YWx1ZT17cHVibGljSWR9IHJlYWRPbmx5IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdEltYWdlVXBsb2FkO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgQ2F0ZWdvcnlTaG93ID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgeyByZWNvcmQsIHJlc291cmNlIH0gPSBwcm9wcztcclxuICBjb25zdCBbY2F0ZWdvcnksIHNldENhdGVnb3J5XSA9IHVzZVN0YXRlKG51bGwpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHJlY29yZCAmJiByZWNvcmQucGFyYW1zKSB7XHJcbiAgICAgIHNldENhdGVnb3J5KHJlY29yZC5wYXJhbXMpO1xyXG4gICAgfVxyXG4gIH0sIFtyZWNvcmRdKTtcclxuXHJcbiAgaWYgKCFjYXRlZ29yeSkge1xyXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1sb2FkaW5nXCI+TG9hZGluZy4uLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGZvcm1hdERhdGUgPSAoZGF0ZSkgPT4ge1xyXG4gICAgaWYgKCFkYXRlKSByZXR1cm4gXCLigJRcIjtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlKS50b0xvY2FsZURhdGVTdHJpbmcoXCJlbi1VU1wiLCB7XHJcbiAgICAgICAgeWVhcjogXCJudW1lcmljXCIsXHJcbiAgICAgICAgbW9udGg6IFwibG9uZ1wiLFxyXG4gICAgICAgIGRheTogXCJudW1lcmljXCIsXHJcbiAgICAgICAgaG91cjogXCIyLWRpZ2l0XCIsXHJcbiAgICAgICAgbWludXRlOiBcIjItZGlnaXRcIixcclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgcmV0dXJuIFwi4oCUXCI7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1jb250YWluZXJcIj5cclxuICAgICAgPHN0eWxlPntgXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctY29udGFpbmVyIHtcclxuICAgICAgICAgIC0tYmctMTogdmFyKC0tY2hhbmdlOC1iZy0xLCAjMDUwOTE0KTtcclxuICAgICAgICAgIC0tZ29sZDogdmFyKC0tY2hhbmdlOC1nb2xkLCAjZTJiZjY2KTtcclxuICAgICAgICAgIC0tdGV4dC1tYWluOiB2YXIoLS1jaGFuZ2U4LXRleHQtbWFpbiwgI2Y4ZmFmYyk7XHJcbiAgICAgICAgICAtLXRleHQtbXV0ZWQ6IHZhcigtLWNoYW5nZTgtdGV4dC1tdXRlZCwgIzlhYThjMSk7XHJcbiAgICAgICAgICAtLWxpbmU6IHZhcigtLWNoYW5nZTgtbGluZSwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjIyKSk7XHJcbiAgICAgICAgICAtLWNhcmQtYmc6IHZhcigtLWNoYW5nZTgtY2FyZC1iZywgbGluZWFyLWdyYWRpZW50KDE2MGRlZywgcmdiYSgyMSwgMzQsIDY2LCAwLjk2KSAwJSwgcmdiYSgxMCwgMTgsIDM2LCAwLjk2KSAxMDAlKSk7XHJcbiAgICAgICAgICAtLXNoYWRvdzogdmFyKC0tY2hhbmdlOC1zaGFkb3csIDAgOHB4IDI2cHggcmdiYSgwLCAwLCAwLCAwLjMpKTtcclxuXHJcbiAgICAgICAgICBwYWRkaW5nOiAzMnB4O1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbWFpbik7XHJcbiAgICAgICAgICBmb250LWZhbWlseTogXCJQb3BwaW5zXCIsIFwiU2Vnb2UgVUlcIiwgc2Fucy1zZXJpZjtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMjBkZWcsIHZhcigtLWJnLTEpIDAlLCByZ2JhKDExLCAyNiwgNTYsIDAuOCkgNTAlLCB2YXIoLS1iZy0xKSAxMDAlKTtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jYXRlZ29yeS1zaG93LWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtYmctMTogI2YwZjZmZjtcclxuICAgICAgICAgIC0tY2hhbmdlOC1nb2xkOiAjYzA4YjBmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXRleHQtbWFpbjogIzBmMTcyYTtcclxuICAgICAgICAgIC0tY2hhbmdlOC10ZXh0LW11dGVkOiAjNDc1NTY5O1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWxpbmU6IHJnYmEoMTUsIDIzLCA0MiwgMC4wOCk7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtY2FyZC1iZzogI2ZmZmZmZjtcclxuICAgICAgICAgIC0tY2hhbmdlOC1zaGFkb3c6IDAgNHB4IDIwcHggcmdiYSgxNSwgMjMsIDQyLCAwLjA2KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWlubmVyIHtcclxuICAgICAgICAgIG1heC13aWR0aDogOTAwcHg7XHJcbiAgICAgICAgICBtYXJnaW46IDAgYXV0bztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWhlYWRlciB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAzMnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3cta2lja2VyIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMzZlbTtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEycHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy10aXRsZSB7XHJcbiAgICAgICAgICBmb250LXNpemU6IGNsYW1wKDMycHgsIDV2dywgNDhweCk7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDEuMTtcclxuICAgICAgICAgIG1hcmdpbjogMCAwIDhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXN0YXR1cyB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBnYXA6IDhweDtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDEycHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiA2cHggMTJweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjEyZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1zdGF0dXMuYWN0aXZlIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMzQsIDE5NywgOTQsIDAuMik7XHJcbiAgICAgICAgICBjb2xvcjogIzIyYzU1ZTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMzQsIDE5NywgOTQsIDAuNCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1zdGF0dXMuaW5hY3RpdmUge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyMzksIDY4LCA2OCwgMC4yKTtcclxuICAgICAgICAgIGNvbG9yOiAjZWY0NDQ0O1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyMzksIDY4LCA2OCwgMC40KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWNhcmQge1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAyNHB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMzJweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWNhcmQtYmcpO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogdmFyKC0tc2hhZG93KTtcclxuICAgICAgICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjRweDtcclxuICAgICAgICAgIGFuaW1hdGlvbjogZmFkZS11cCA1NjBtcyBlYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctc2VjdGlvbi10aXRsZSB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjE4ZW07XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXNlY3Rpb24ge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXNlY3Rpb246bGFzdC1jaGlsZCB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctZmllbGQge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWZpZWxkOmxhc3QtY2hpbGQge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWxhYmVsIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMThlbTtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDhweDtcclxuICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctdmFsdWUge1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbWFpbik7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMS42O1xyXG4gICAgICAgICAgd29yZC1icmVhazogYnJlYWstd29yZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXZhbHVlLmdvbGQge1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLWdvbGQpO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWRlc2NyaXB0aW9uIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4yKTtcclxuICAgICAgICAgIGJvcmRlci1sZWZ0OiAzcHggc29saWQgdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxNnB4IDIwcHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMS43O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jYXRlZ29yeS1zaG93LWRlc2NyaXB0aW9uIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMTUsIDIzLCA0MiwgMC4wNSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1kZXRhaWxzLWdyaWQge1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMjAwcHgsIDFmcikpO1xyXG4gICAgICAgICAgZ2FwOiAyNHB4O1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMTZweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtIHtcclxuICAgICAgICAgIHBhZGRpbmc6IDE2cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMSk7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNhdGVnb3J5LXNob3ctZGV0YWlsLWl0ZW0ge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNSwgMjMsIDQyLCAwLjAzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWRpdmlkZXIge1xyXG4gICAgICAgICAgaGVpZ2h0OiAxcHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHJnYmEoMjI2LCAxOTEsIDEwMiwgMCksIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4yOCksIHJnYmEoMjI2LCAxOTEsIDEwMiwgMCkpO1xyXG4gICAgICAgICAgbWFyZ2luOiAyNHB4IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAa2V5ZnJhbWVzIGZhZGUtdXAge1xyXG4gICAgICAgICAgZnJvbSB7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg4cHgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdG8ge1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNzIwcHgpIHtcclxuICAgICAgICAgIC5jYXRlZ29yeS1zaG93LWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDIwcHggMTZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2F0ZWdvcnktc2hvdy1jYXJkIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMjRweCAyMHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jYXRlZ29yeS1zaG93LWRldGFpbHMtZ3JpZCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgYH08L3N0eWxlPlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWlubmVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWhlYWRlclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWtpY2tlclwiPkNhdGVnb3J5IE92ZXJ2aWV3PC9kaXY+XHJcbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy10aXRsZVwiPntjYXRlZ29yeS5uYW1lIHx8IFwi4oCUXCJ9PC9oMT5cclxuICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgY2F0ZWdvcnktc2hvdy1zdGF0dXMgJHtjYXRlZ29yeS5pc0FjdGl2ZSA/IFwiYWN0aXZlXCIgOiBcImluYWN0aXZlXCJ9YH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPHNwYW4+4pePPC9zcGFuPlxyXG4gICAgICAgICAgICB7Y2F0ZWdvcnkuaXNBY3RpdmUgPyBcIkFjdGl2ZVwiIDogXCJJbmFjdGl2ZVwifVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1jYXJkXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctc2VjdGlvblwiPlxyXG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1zZWN0aW9uLXRpdGxlXCI+RGVzY3JpcHRpb248L2gzPlxyXG4gICAgICAgICAgICB7Y2F0ZWdvcnkuZGVzY3JpcHRpb24gPyAoXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRlc2NyaXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICB7Y2F0ZWdvcnkuZGVzY3JpcHRpb259XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy12YWx1ZVwiXHJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS10ZXh0LW11dGVkKVwiIH19XHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgTm8gZGVzY3JpcHRpb24gcHJvdmlkZWRcclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kaXZpZGVyXCIgLz5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctc2VjdGlvblwiPlxyXG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1zZWN0aW9uLXRpdGxlXCI+RGV0YWlsczwvaDM+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGV0YWlscy1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1sYWJlbFwiPkNhdGVnb3J5IElEPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy12YWx1ZSBnb2xkXCJcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogXCJtb25vc3BhY2VcIiwgZm9udFNpemU6IFwiMTRweFwiIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIHtjYXRlZ29yeS5pZCB8fCBcIuKAlFwifVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kZXRhaWwtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctbGFiZWxcIj5TbHVnPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy12YWx1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICB7Y2F0ZWdvcnkuc2x1ZyB8fCBcIuKAlFwifVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRpdmlkZXJcIiAvPlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXNlY3Rpb24tdGl0bGVcIj5UaW1lbGluZTwvaDM+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGV0YWlscy1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1sYWJlbFwiPkNyZWF0ZWQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXZhbHVlXCI+XHJcbiAgICAgICAgICAgICAgICAgIHtmb3JtYXREYXRlKGNhdGVnb3J5LmNyZWF0ZWRBdCl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1sYWJlbFwiPkxhc3QgVXBkYXRlZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctdmFsdWVcIj5cclxuICAgICAgICAgICAgICAgICAge2Zvcm1hdERhdGUoY2F0ZWdvcnkudXBkYXRlZEF0KX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDYXRlZ29yeVNob3c7XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHdyYXBwZXJTdHlsZSA9IHtcclxuICBtaW5IZWlnaHQ6IFwiMTAwJVwiLFxyXG4gIHBhZGRpbmc6IFwiMjhweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2ZmZmZmZlwiLFxyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMThweFwiLFxyXG59O1xyXG5cclxuY29uc3QgY2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIyMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMDgpXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZmZmZmZmXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMThweCAzNHB4IHJnYmEoMTUsIDIzLCA0MiwgMC4wOClcIixcclxuICBwYWRkaW5nOiBcIjI0cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcImNsYW1wKDI4cHgsIDR2dywgNDRweClcIixcclxuICBsaW5lSGVpZ2h0OiAxLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxufTtcclxuXHJcbmNvbnN0IHRleHRTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgY29sb3I6IFwiIzQ3NTU2OVwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuOCxcclxuICBmb250U2l6ZTogXCIxNXB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBBYm91dCA9ICgpID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17d3JhcHBlclN0eWxlfT5cclxuICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICA8aDEgc3R5bGU9e3RpdGxlU3R5bGV9PkFib3V0PC9oMT5cclxuICAgICAgICA8cCBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICAgIFRoaXMgYWRtaW4gZGFzaGJvYXJkIGlzIHVzZWQgdG8gbWFuYWdlIHNob3AgcHJvZHVjdHMsIG9yZGVycywgb3JkZXJcclxuICAgICAgICAgIGl0ZW1zLCBjYXRlZ29yaWVzLCBhbmQgc2V0dGluZ3MgaW4gb25lIHBsYWNlLlxyXG4gICAgICAgIDwvcD5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxoMiBzdHlsZT17eyAuLi50aXRsZVN0eWxlLCBmb250U2l6ZTogXCIyNHB4XCIsIG1hcmdpbkJvdHRvbTogXCIxMnB4XCIgfX0+XHJcbiAgICAgICAgICBXaGF0IHlvdSBjYW4gZG8gaGVyZVxyXG4gICAgICAgIDwvaDI+XHJcbiAgICAgICAgPHAgc3R5bGU9e3RleHRTdHlsZX0+XHJcbiAgICAgICAgICBCcm93c2UgcHJvZHVjdHMsIG9wZW4gcHJvZHVjdCBkZXRhaWxzLCBjcmVhdGUgb3JkZXJzLCBhbmQgbWFuYWdlIHRoZVxyXG4gICAgICAgICAgc3RvcmUgZGF0YSBmcm9tIHRoZSBBZG1pbkpTIGludGVyZmFjZS5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFib3V0O1xyXG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi4vYWRtaW4vZGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmRcbmltcG9ydCBSZWdpc3RlciBmcm9tICcuLi9hZG1pbi9yZWdpc3RlcidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUmVnaXN0ZXIgPSBSZWdpc3RlclxuaW1wb3J0IFByb2R1Y3RDYXJkc0xpc3QgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1jYXJkcy1saXN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0Q2FyZHNMaXN0ID0gUHJvZHVjdENhcmRzTGlzdFxuaW1wb3J0IFByb2R1Y3RTaG93IGZyb20gJy4uL2FkbWluL3Byb2R1Y3Qtc2hvdydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdFNob3cgPSBQcm9kdWN0U2hvd1xuaW1wb3J0IE9yZGVyQ3JlYXRlIGZyb20gJy4uL2FkbWluL29yZGVyLWNyZWF0ZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuT3JkZXJDcmVhdGUgPSBPcmRlckNyZWF0ZVxuaW1wb3J0IE9yZGVyU2hvdyBmcm9tICcuLi9hZG1pbi9vcmRlci1zaG93J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlclNob3cgPSBPcmRlclNob3dcbmltcG9ydCBPcmRlckl0ZW1TaG93IGZyb20gJy4uL2FkbWluL29yZGVyLWl0ZW0tc2hvdydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuT3JkZXJJdGVtU2hvdyA9IE9yZGVySXRlbVNob3dcbmltcG9ydCBQcm9kdWN0SW1hZ2UgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1pbWFnZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdEltYWdlID0gUHJvZHVjdEltYWdlXG5pbXBvcnQgUHJvZHVjdEltYWdlVXBsb2FkIGZyb20gJy4uL2FkbWluL3Byb2R1Y3QtaW1hZ2UtdXBsb2FkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0SW1hZ2VVcGxvYWQgPSBQcm9kdWN0SW1hZ2VVcGxvYWRcbmltcG9ydCBDYXRlZ29yeVNob3cgZnJvbSAnLi4vYWRtaW4vY2F0ZWdvcnktc2hvdydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQ2F0ZWdvcnlTaG93ID0gQ2F0ZWdvcnlTaG93XG5pbXBvcnQgQWJvdXQgZnJvbSAnLi4vYWRtaW4vYWJvdXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkFib3V0ID0gQWJvdXQiXSwibmFtZXMiOlsiZm9ybWF0Q3VycmVuY3kiLCJ2YWx1ZSIsImFtb3VudCIsIk51bWJlciIsInRvTG9jYWxlU3RyaW5nIiwidW5kZWZpbmVkIiwibWluaW11bUZyYWN0aW9uRGlnaXRzIiwibWF4aW11bUZyYWN0aW9uRGlnaXRzIiwicHJvZHVjdEltYWdlIiwicHJvZHVjdCIsInJlc29sdmVkIiwiaW1hZ2UiLCJpbWFnZVVybCIsInRodW1ibmFpbCIsImNvdmVyIiwibm9ybWFsaXplZCIsIlN0cmluZyIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJwcm9kdWN0TGFiZWwiLCJuYW1lIiwic3BsaXQiLCJzbGljZSIsIm1hcCIsInBhcnQiLCJqb2luIiwidG9VcHBlckNhc2UiLCJub3JtYWxpemVQcm9kdWN0IiwiaXRlbSIsInJlY29yZCIsInBhcmFtcyIsImlkIiwicHJpY2UiLCJpc0FjdGl2ZSIsIkJvb2xlYW4iLCJzdG9jayIsImNhdGVnb3J5TmFtZSIsImNhdGVnb3J5IiwiY2F0ZWdvcnlJZCIsInJlY29yZEFjdGlvbnMiLCJhY3Rpb25zIiwibm9ybWFsaXplT3JkZXIiLCJzdGF0dXMiLCJ0b3RhbEFtb3VudCIsImNyZWF0ZWRBdCIsInVzZXJOYW1lIiwidXNlciIsImN1c3RvbWVyTmFtZSIsInNoaXBwaW5nTmFtZSIsImdldFNob3dIcmVmIiwic2hvd0FjdGlvbiIsImZpbmQiLCJhY3Rpb24iLCJocmVmIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiRGFzaGJvYXJkIiwic3VtbWFyeSIsInNldFN1bW1hcnkiLCJ1c2VTdGF0ZSIsInVzZXJzIiwicHJvZHVjdHMiLCJjYXRlZ29yaWVzIiwib3JkZXJzIiwicmVjb3JkcyIsInNldFJlY29yZHMiLCJyZWNlbnRPcmRlcnMiLCJzZXRSZWNlbnRPcmRlcnMiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsInNlYXJjaFRlcm0iLCJzZXRTZWFyY2hUZXJtIiwiY3VycmVudFNsaWRlIiwic2V0Q3VycmVudFNsaWRlIiwiY3VycmVudFVzZXJOYW1lIiwic2V0Q3VycmVudFVzZXJOYW1lIiwiY3VycmVudFVzZXJSb2xlIiwic2V0Q3VycmVudFVzZXJSb2xlIiwiaXNVc2VyTWVudU9wZW4iLCJzZXRJc1VzZXJNZW51T3BlbiIsInVzZUVmZmVjdCIsInJvb3QiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImJvZHkiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZW1vdmUiLCJpc01vdW50ZWQiLCJsb2FkRGFzaGJvYXJkIiwic3VtbWFyeVJlc3BvbnNlIiwicHJvZHVjdHNSZXNwb25zZSIsIm9yZGVyc1Jlc3BvbnNlIiwiUHJvbWlzZSIsImFsbCIsImZldGNoIiwiY3JlZGVudGlhbHMiLCJzdW1tYXJ5UGF5bG9hZCIsIm9rIiwianNvbiIsInByb2R1Y3RQYXlsb2FkIiwib3JkZXJQYXlsb2FkIiwibG9hZGVkUmVjb3JkcyIsIkFycmF5IiwiaXNBcnJheSIsImxvYWRlZE9yZGVycyIsImxlbmd0aCIsImVycm9yIiwiY2xvc2VVc2VyTWVudSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibG9hZEN1cnJlbnRVc2VyIiwicmVzcG9uc2UiLCJoZWFkZXJzIiwiQWNjZXB0IiwicGF5bG9hZCIsInRyaW0iLCJyb2xlIiwiYWN0aXZlUHJvZHVjdHMiLCJ1c2VNZW1vIiwiZmlsdGVyIiwiZmlsdGVyZWRQcm9kdWN0cyIsInF1ZXJ5IiwiaGVyb1NsaWRlcyIsInRpbWVyIiwid2luZG93Iiwic2V0SW50ZXJ2YWwiLCJwcmV2aW91cyIsImNsZWFySW50ZXJ2YWwiLCJmZWF0dXJlZFByb2R1Y3QiLCJoZXJvSW1hZ2UiLCJoZXJvVGl0bGUiLCJoZXJvU3VidGl0bGUiLCJoZXJvSHJlZiIsIm9yZGVyc0xpc3RIcmVmIiwic3BvdGxpZ2h0UHJvZHVjdHMiLCJidWNrZXQiLCJNYXAiLCJmb3JFYWNoIiwic2V0IiwiZ2V0IiwiZnJvbSIsImVudHJpZXMiLCJjb3VudCIsImlzQWRtaW5Vc2VyIiwicmVjZW50UHJvZHVjdHMiLCJjYXRlZ29yeVByZXZpZXciLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJzdHlsZSIsImRpc3BsYXkiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwiZ2FwIiwicGFkZGluZyIsIm1hcmdpblRvcCIsImtleSIsImp1c3RpZnlDb250ZW50IiwiYm9yZGVyUmFkaXVzIiwiYm9yZGVyIiwidGV4dERlY29yYXRpb24iLCJjb2xvciIsImJhY2tncm91bmQiLCJtYXJnaW5Cb3R0b20iLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJvcmRlciIsIkRhdGUiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJodG1sRm9yIiwid2lkdGgiLCJoZWlnaHQiLCJ2aWV3Qm94IiwiZmlsbCIsInN0cm9rZSIsInN0cm9rZVdpZHRoIiwiY3giLCJjeSIsInIiLCJkIiwidHlwZSIsInBsYWNlaG9sZGVyIiwib25DaGFuZ2UiLCJldmVudCIsInRhcmdldCIsIm9uQ2xpY2siLCJzdG9wUHJvcGFnYXRpb24iLCJsb2NhdGlvbiIsImFzc2lnbiIsIk1hdGgiLCJtYXgiLCJwcmV2ZW50RGVmYXVsdCIsInNsaWRlIiwiaW5kZXgiLCJzcmMiLCJhbHQiLCJwbGFjZUl0ZW1zIiwiUmVnaXN0ZXIiLCJmb3JtU3RhdGUiLCJzZXRGb3JtU3RhdGUiLCJlbWFpbCIsInBhc3N3b3JkIiwibWVzc2FnZSIsInNldE1lc3NhZ2UiLCJ0ZXh0IiwiaXNTdWJtaXR0aW5nIiwic2V0SXNTdWJtaXR0aW5nIiwibWFyZ2luIiwiaGFuZGxlQ2hhbmdlIiwiY3VycmVudCIsImhhbmRsZVN1Ym1pdCIsIm1ldGhvZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJkYXRhIiwiRXJyb3IiLCJzZXRUaW1lb3V0Iiwib25TdWJtaXQiLCJyZXF1aXJlZCIsIm1pbkxlbmd0aCIsImRpc2FibGVkIiwiZ3JpZFN0eWxlIiwiY2FyZFN0eWxlIiwib3ZlcmZsb3ciLCJib3hTaGFkb3ciLCJpbWFnZVdyYXBTdHlsZSIsImFsaWduSXRlbXMiLCJpbWFnZVN0eWxlIiwib2JqZWN0Rml0IiwiYm9keVN0eWxlIiwibWV0YVN0eWxlIiwiYmFkZ2VTdHlsZSIsImxldHRlclNwYWNpbmciLCJsaW5rU3R5bGUiLCJjdXJzb3IiLCJlbXB0eVN0eWxlIiwiZm9ybWF0UHJpY2UiLCJpc0Zpbml0ZSIsImdldFJlY29yZElkIiwicGFyYW0iLCJyZXNvdXJjZUlkIiwicmF3SHJlZiIsIlByb2R1Y3RDYXJkc0xpc3QiLCJwcm9wcyIsImFwaVJlY29yZHMiLCJzZXRBcGlSZWNvcmRzIiwibG9hZEVycm9yIiwic2V0TG9hZEVycm9yIiwicmVzb3VyY2UiLCJwcm9wUmVjb3JkcyIsImxvYWRSZWNvcmRzIiwiZGV0YWlsc0hyZWYiLCJvcGVuRGV0YWlscyIsInBhZ2VTdHlsZSIsIm1pbkhlaWdodCIsInRvcEJhclN0eWxlIiwiZmxleFdyYXAiLCJiYWNrTGlua1N0eWxlIiwibGF5b3V0U3R5bGUiLCJpbWFnZUNhcmRTdHlsZSIsImdyaWRUZW1wbGF0ZVJvd3MiLCJpbWFnZUZhbGxiYWNrU3R5bGUiLCJ0ZXh0VHJhbnNmb3JtIiwiaW1hZ2VGb290ZXJTdHlsZSIsImJvcmRlclRvcCIsInRpdGxlU3R5bGUiLCJsaW5lSGVpZ2h0Iiwic3VidGl0bGVTdHlsZSIsInBpbGxTdHlsZSIsImFjdGl2ZSIsInBpbGxEb3RTdHlsZSIsImluZm9HcmlkU3R5bGUiLCJpbmZvQ2FyZFN0eWxlIiwiaW5mb0xhYmVsU3R5bGUiLCJpbmZvVmFsdWVTdHlsZSIsIndvcmRCcmVhayIsInNlY3Rpb25UaXRsZVN0eWxlIiwiZGVzY3JpcHRpb25TdHlsZSIsIndoaXRlU3BhY2UiLCJkZXRhaWxzR3JpZFN0eWxlIiwiZGV0YWlsUm93U3R5bGUiLCJwYWRkaW5nQm90dG9tIiwiYm9yZGVyQm90dG9tIiwiZGV0YWlsTGFiZWxTdHlsZSIsImRldGFpbFZhbHVlU3R5bGUiLCJ0ZXh0QWxpZ24iLCJhY3Rpb25Sb3dTdHlsZSIsInByaW1hcnlCdXR0b25TdHlsZSIsIm1pbldpZHRoIiwic2Vjb25kYXJ5QnV0dG9uU3R5bGUiLCJmb3JtYXREYXRlIiwiZGF0ZSIsImlzTmFOIiwiZ2V0VGltZSIsImRhdGVTdHlsZSIsInRpbWVTdHlsZSIsImdldFByb2R1Y3RJbWFnZSIsIlByb2R1Y3RTaG93IiwicHJvZHVjdElkIiwic2t1IiwiZGVzY3JpcHRpb24iLCJlZGl0VXJsIiwib3JkZXJVcmwiLCJoYW5kbGVPcmRlckNsaWNrIiwiaGFuZGxlRWRpdENsaWNrIiwicGFkZGluZ1RvcCIsInVwZGF0ZWRBdCIsInN0YWNrU3R5bGUiLCJsYWJlbFN0eWxlIiwiaW5wdXRTdHlsZSIsImJveFNpemluZyIsImZvbnRGYW1pbHkiLCJyb3dTdHlsZSIsImdyaWQyU3R5bGUiLCJjdXN0b21lckluZm9TdHlsZSIsImN1c3RvbWVyUm93U3R5bGUiLCJtdXRlZFN0eWxlIiwic3Ryb25nU3R5bGUiLCJsaW5lSXRlbVJvd1N0eWxlIiwibGluZUl0ZW1Ub3BTdHlsZSIsInByb2R1Y3RQcmV2aWV3U3R5bGUiLCJhZGRCdXR0b25TdHlsZSIsInJlbW92ZUJ1dHRvblN0eWxlIiwidG90YWxzUm93U3R5bGUiLCJ0b3RhbFN0eWxlIiwiYWN0aW9uQmFyU3R5bGUiLCJhY3Rpb25CdXR0b25TdHlsZSIsInByaW1hcnkiLCJtYXBMaW5rU3R5bGUiLCJwYXltZW50T3B0aW9uR3JpZFN0eWxlIiwicGF5bWVudE9wdGlvblN0eWxlIiwic2VjdXJpdHlDaGlwV3JhcFN0eWxlIiwic2VjdXJpdHlDaGlwU3R5bGUiLCJyZXNwb25zaXZlQ3NzIiwicGF5bWVudE9wdGlvbnMiLCJsYWJlbCIsImljb24iLCJpdGVtU2l6ZU9wdGlvbnMiLCJzaGlwcGluZ01ldGhvZHMiLCJ0b051bWJlciIsIm51bSIsImZvcm1hdE1vbmV5IiwiY3JlYXRlRW1wdHlJdGVtIiwic2l6ZSIsInF1YW50aXR5IiwidW5pdFByaWNlIiwiT3JkZXJDcmVhdGUiLCJzZXRVc2VycyIsInNldFByb2R1Y3RzIiwib3JkZXJDb3VudEJ5VXNlciIsInNldE9yZGVyQ291bnRCeVVzZXIiLCJzZXNzaW9uVXNlciIsInNldFNlc3Npb25Vc2VyIiwic3VibWl0dGluZyIsInNldFN1Ym1pdHRpbmciLCJmb3JtRGF0YSIsInNldEZvcm1EYXRhIiwidXNlcklkIiwicGF5bWVudE1ldGhvZCIsInBheW1lbnRTdGF0dXMiLCJ0cmFuc2FjdGlvbklkIiwic2hpcHBpbmdQaG9uZSIsInNoaXBwaW5nQWRkcmVzcyIsInNoaXBwaW5nTWV0aG9kIiwidHJhY2tpbmdOdW1iZXIiLCJzaGlwcGluZ0ZlZSIsInRheCIsImRpc2NvdW50IiwibGluZUl0ZW1zIiwic2V0TGluZUl0ZW1zIiwiaGFkTG9naW5DbGFzc09uUm9vdCIsImNvbnRhaW5zIiwiaGFkTG9naW5DbGFzc09uQm9keSIsImhhZERhc2hib2FyZENsYXNzT25Sb290IiwiaGFkRGFzaGJvYXJkQ2xhc3NPbkJvZHkiLCJsb2dpbkJnTGF5ZXIiLCJnZXRFbGVtZW50QnlJZCIsInByZXZpb3VzTGF5ZXJEaXNwbGF5Iiwic2hlbGxOb2RlcyIsIlNldCIsInF1ZXJ5U2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yQWxsIiwicHJldmlvdXNJbmxpbmVCYWNrZ3JvdW5kcyIsIm5vZGUiLCJnZXRQcm9wZXJ0eVZhbHVlIiwiYmFja2dyb3VuZFByaW9yaXR5IiwiZ2V0UHJvcGVydHlQcmlvcml0eSIsImJhY2tncm91bmRDb2xvciIsImJhY2tncm91bmRDb2xvclByaW9yaXR5IiwiYmFja2dyb3VuZEltYWdlIiwiYmFja2dyb3VuZEltYWdlUHJpb3JpdHkiLCJzZXRQcm9wZXJ0eSIsInN0eWxlcyIsInJlbW92ZVByb3BlcnR5IiwiVVJMU2VhcmNoUGFyYW1zIiwic2VhcmNoIiwicHJlUHJvZHVjdElkIiwiZmV0Y2hEYXRhIiwiY29udGV4dFJlcyIsImNvbnRleHREYXRhIiwidXNlcnNEYXRhIiwicHJvZHVjdHNMaXN0IiwiY3VycmVudFVzZXIiLCJwcmV2Iiwic2VsZWN0ZWRQcm9kdWN0Iiwic29tZSIsInAiLCJzZWxlY3RlZCIsInNlbGVjdGVkQ3VzdG9tZXIiLCJ1IiwiY3VzdG9tZXJPcmRlckNvdW50IiwicGhvbmUiLCJtb2JpbGUiLCJsaW5lVG90YWxzIiwic3VidG90YWwiLCJyZWR1Y2UiLCJzdW0iLCJncmFuZFRvdGFsIiwiaGFuZGxlRm9ybUNoYW5nZSIsImhhbmRsZUxpbmVJdGVtQ2hhbmdlIiwibmV4dCIsImFkZExpbmVJdGVtIiwicmVtb3ZlTGluZUl0ZW0iLCJfIiwiaSIsIm1hcHNIcmVmIiwidmFsaWRJdGVtcyIsImFsZXJ0IiwidG9GaXhlZCIsInN1Ym1pdEZvcm0iLCJGb3JtRGF0YSIsImFwcGVuZCIsIm9yZGVyUmVzIiwib3JkZXJEYXRhIiwib3B0aW9uIiwicmVhZE9ubHkiLCJpdGVtVG90YWwiLCJzaXplT3B0aW9uIiwibWluIiwic3RlcCIsInJlc2l6ZSIsInJlbCIsImhpc3RvcnkiLCJiYWNrIiwiaGVhZGVyU3R5bGUiLCJoZWFkaW5nU3R5bGUiLCJzdWJUZXh0U3R5bGUiLCJ2YWwiLCJzdHlsZUJ5U3RhdHVzIiwicGVuZGluZyIsImJnIiwiZmciLCJwYWlkIiwicHJvY2Vzc2luZyIsInNoaXBwZWQiLCJjb21wbGV0ZWQiLCJjYW5jZWxsZWQiLCJpbmZvUm93U3R5bGUiLCJ0YWJsZVN0eWxlIiwibGluZUl0ZW1TdHlsZSIsInRvdGFsQm94U3R5bGUiLCJ0b3RhbFJvd1N0eWxlIiwiZ3JhbmRTdHlsZSIsIm4iLCJkdCIsIk9yZGVyU2hvdyIsImRldGFpbHMiLCJzZXREZXRhaWxzIiwic2V0RXJyb3IiLCJvcmRlcklkIiwibG9hZERldGFpbHMiLCJmZXRjaEVycm9yIiwidG90YWxzIiwiaXRlbXMiLCJ0b3RhbFByaWNlIiwiZW1wdHlJbWFnZVN0eWxlIiwiT3JkZXJJdGVtU2hvdyIsIm9yZGVySXRlbUlkIiwiY2FsY3VsYXRlZFRvdGFsIiwiY3VzdG9tZXIiLCJjZWxsU3R5bGUiLCJmbGV4U2hyaW5rIiwiZmFsbGJhY2tTdHlsZSIsInRleHRTdHlsZSIsImZsZXhEaXJlY3Rpb24iLCJQcm9kdWN0SW1hZ2UiLCJwcm9wZXJ0eSIsInBhdGgiLCJoYXNFcnJvciIsInNldEhhc0Vycm9yIiwib25FcnJvciIsIndyYXBwZXJTdHlsZSIsInByZXZpZXdTdHlsZSIsImhpbnRTdHlsZSIsIlByb2R1Y3RJbWFnZVVwbG9hZCIsImN1cnJlbnRWYWx1ZSIsImN1cnJlbnRQdWJsaWNJZCIsImltYWdlUHVibGljSWQiLCJwcmV2aWV3VXJsIiwic2V0UHJldmlld1VybCIsInB1YmxpY0lkIiwic2V0UHVibGljSWQiLCJ1cGxvYWRpbmciLCJzZXRVcGxvYWRpbmciLCJoYW5kbGVVcGxvYWQiLCJmaWxlIiwiZmlsZXMiLCJ1cGxvYWRlZFVybCIsInVybCIsInVwbG9hZGVkUHVibGljSWQiLCJ1cGxvYWRFcnJvciIsImhhbmRsZVJlbW92ZSIsImFjY2VwdCIsIkZyYWdtZW50IiwiQ2F0ZWdvcnlTaG93Iiwic2V0Q2F0ZWdvcnkiLCJ5ZWFyIiwibW9udGgiLCJkYXkiLCJob3VyIiwibWludXRlIiwic2x1ZyIsIkFib3V0IiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBRUEsTUFBTUEsZ0JBQWMsR0FBSUMsS0FBSyxJQUFLO0VBQ2hDLEVBQUEsTUFBTUMsTUFBTSxHQUFHQyxNQUFNLENBQUNGLEtBQUssSUFBSSxDQUFDLENBQUM7RUFDakMsRUFBQSxPQUFPLE9BQU9DLE1BQU0sQ0FBQ0UsY0FBYyxDQUFDQyxTQUFTLEVBQUU7SUFDN0NDLHFCQUFxQixFQUFFSixNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztBQUMvQ0ssSUFBQUEscUJBQXFCLEVBQUU7QUFDekIsR0FBQyxDQUFDLENBQUEsQ0FBRTtFQUNOLENBQUM7RUFFRCxNQUFNQyxZQUFZLEdBQUlDLE9BQU8sSUFBSztFQUNoQyxFQUFBLE1BQU1DLFFBQVEsR0FDWkQsT0FBTyxFQUFFRSxLQUFLLElBQ2RGLE9B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RUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUNBQUEsRUFBbUNsQixTQUFTLENBQUE7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBQSxDQUFlLENBQUMsZUFFVmlCLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsSUFBQUEsU0FBUyxFQUFDO0tBQWUsZUFDNUJGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsSUFBQUEsU0FBUyxFQUFDO0VBQW1CLEdBQUEsRUFBQywwQ0FFOUIsQ0FBQyxlQUNORixzQkFBQSxDQUFBQyxhQUFBLENBQUEsUUFBQSxF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QTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFBLENBQWUsQ0FBQyxlQUVWRCxzQkFBQSxDQUFBQyxhQUFBLENBQUEsS0FBQSxFQUFBO0VBQUtDLElBQUFBLFNBQVMsRUFBQztLQUFzRCxlQUNuRUYsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUFLRSxJQUFBQSxLQUFLLEVBQUV5RztLQUFZLGVBQ3RCNUcsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEdBQUEsRUFBQTtFQUNFOUYsSUFBQUEsSUFBSSxFQUFDLHdDQUF3QztFQUM3Q2dHLElBQUFBLEtBQUssRUFBRTJHO0tBQWMsZUFFckI5RyxzQkFBQSxDQUFBQyxhQUFB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUEsQ0FBZSxDQUFDLGVBRVZELHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsSUFBQUEsU0FBUyxFQUFDO0tBQXFCLGVBQ2xDRixzQkFBQSxDQUFBQyxhQUFBLENBQUEsS0FBQSxFQUFBO0VBQUtDLElBQUFBLFNBQVMsRUFBQztLQUFzQixlQUNuQ0Ysc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUFLQyxJQUFBQSxT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
