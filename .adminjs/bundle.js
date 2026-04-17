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
          }), fetch("/api/products", {
            credentials: "same-origin"
          }), fetch("/admin/api/resources/Orders/actions/list", {
            credentials: "same-origin"
          })]);
          const summaryPayload = summaryResponse.ok ? await summaryResponse.json() : {};
          const productPayload = productsResponse.ok ? await productsResponse.json() : [];
          const orderPayload = ordersResponse.ok ? await ordersResponse.json() : {};
          if (!isMounted) {
            return;
          }
          const loadedRecords = Array.isArray(productPayload) ? productPayload.map(normalizeProduct) : [];
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
    const adminProductRows = Array.isArray(records) ? records.slice(0, 12) : [];
    const categoryPreview = categories.slice(0, 6);
    if (isAdminUser) {
      return /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-dashboard"
      }, /*#__PURE__*/React__default.default.createElement("style", null, `
          html.change8-storefront-dashboard-page,
          html.change8-storefront-dashboard-page body,
          html.change8-storefront-dashboard-page #app,
          html.change8-storefront-dashboard-page .adminjs_Layout,
          html.change8-storefront-dashboard-page [data-testid="layout"],
          html.change8-storefront-dashboard-page [data-css="layout"],
          html.change8-storefront-dashboard-page main,
          body.change8-storefront-dashboard-page,
          body.change8-storefront-dashboard-page #app,
          body.change8-storefront-dashboard-page .adminjs_Layout,
          body.change8-storefront-dashboard-page [data-testid="layout"],
          body.change8-storefront-dashboard-page [data-css="layout"],
          body.change8-storefront-dashboard-page main {
            background: #ffffff !important;
            background-color: #ffffff !important;
            background-image: none !important;
          }

          html.change8-storefront-dashboard-page body::before,
          html.change8-storefront-dashboard-page::before,
          body.change8-storefront-dashboard-page::before {
            content: none !important;
            display: none !important;
            background: none !important;
            background-image: none !important;
          }

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

          .change8-admin-table-wrap {
            margin-top: 14px;
            width: 100%;
            overflow-x: auto;
            border: 1px solid rgba(15, 23, 42, 0.08);
            border-radius: 14px;
            background: #ffffff;
          }

          .change8-admin-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 760px;
          }

          .change8-admin-table th,
          .change8-admin-table td {
            text-align: left;
            padding: 12px 14px;
            border-bottom: 1px solid rgba(15, 23, 42, 0.07);
            font-size: 14px;
          }

          .change8-admin-table th {
            background: #f8fafc;
            color: #475569;
            font-weight: 700;
            white-space: nowrap;
          }

          .change8-admin-table td {
            color: #0f172a;
          }

          .change8-admin-table tr:last-child td {
            border-bottom: 0;
          }

          .change8-admin-thumb-cell {
            width: 76px;
          }

          .change8-admin-thumb {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            object-fit: cover;
            border: 1px solid rgba(15, 23, 42, 0.08);
            background: #f8fafc;
            display: block;
          }

          .change8-admin-status-pill {
            display: inline-block;
            border-radius: 999px;
            padding: 4px 10px;
            font-size: 12px;
            font-weight: 700;
          }

          .change8-admin-status-pill--active {
            background: #dcfce7;
            color: #166534;
          }

          .change8-admin-status-pill--inactive {
            background: #fee2e2;
            color: #991b1b;
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
        className: "change8-admin-panel",
        style: {
          padding: "20px"
        }
      }, /*#__PURE__*/React__default.default.createElement("h2", {
        className: "change8-admin-section-title"
      }, "Products Table"), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-admin-table-wrap"
      }, /*#__PURE__*/React__default.default.createElement("table", {
        className: "change8-admin-table"
      }, /*#__PURE__*/React__default.default.createElement("thead", null, /*#__PURE__*/React__default.default.createElement("tr", null, /*#__PURE__*/React__default.default.createElement("th", null, "Image"), /*#__PURE__*/React__default.default.createElement("th", null, "Name"), /*#__PURE__*/React__default.default.createElement("th", null, "Category"), /*#__PURE__*/React__default.default.createElement("th", null, "Stock"), /*#__PURE__*/React__default.default.createElement("th", null, "Price"), /*#__PURE__*/React__default.default.createElement("th", null, "Status"), /*#__PURE__*/React__default.default.createElement("th", null, "Action"))), /*#__PURE__*/React__default.default.createElement("tbody", null, adminProductRows.length ? adminProductRows.map(product => /*#__PURE__*/React__default.default.createElement("tr", {
        key: product.id
      }, /*#__PURE__*/React__default.default.createElement("td", {
        className: "change8-admin-thumb-cell"
      }, /*#__PURE__*/React__default.default.createElement("img", {
        className: "change8-admin-thumb",
        src: productImage(product),
        alt: product.name
      })), /*#__PURE__*/React__default.default.createElement("td", null, product.name), /*#__PURE__*/React__default.default.createElement("td", null, product.categoryName || "-"), /*#__PURE__*/React__default.default.createElement("td", null, Number(product.stock || 0)), /*#__PURE__*/React__default.default.createElement("td", null, formatCurrency$1(product.price)), /*#__PURE__*/React__default.default.createElement("td", null, /*#__PURE__*/React__default.default.createElement("span", {
        className: `change8-admin-status-pill ${product.isActive ? "change8-admin-status-pill--active" : "change8-admin-status-pill--inactive"}`
      }, product.isActive ? "Active" : "Inactive")), /*#__PURE__*/React__default.default.createElement("td", null, /*#__PURE__*/React__default.default.createElement("a", {
        href: getShowHref$1(product)
      }, "View")))) : /*#__PURE__*/React__default.default.createElement("tr", null, /*#__PURE__*/React__default.default.createElement("td", {
        colSpan: 7,
        style: {
          color: "#64748b"
        }
      }, "No products available.")))))), /*#__PURE__*/React__default.default.createElement("div", {
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
          background:#0EA5E9;
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

        .change8-brand img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 50%;
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
    }, /*#__PURE__*/React__default.default.createElement("img", {
      src: "/public/icon.png",
      alt: "Store logo"
    })), /*#__PURE__*/React__default.default.createElement("div", {
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
  const parseSizeStock$1 = value => {
    if (!value) {
      return {};
    }
    let source = value;
    if (typeof source === "string") {
      try {
        source = JSON.parse(source);
      } catch {
        return {};
      }
    }
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      return {};
    }
    const normalized = {};
    for (const [rawSize, rawQty] of Object.entries(source)) {
      const size = String(rawSize || "").trim().toUpperCase();
      if (!size) {
        continue;
      }
      const qty = Number(rawQty);
      if (!Number.isFinite(qty)) {
        continue;
      }
      normalized[size] = Math.max(0, Math.trunc(qty));
    }
    return normalized;
  };
  const ProductShow = props => {
    const record = props?.record;
    const params = record?.params || {};
    const [currentUserRole, setCurrentUserRole] = React.useState(null);
    const [productData, setProductData] = React.useState(params);
    const productId = params?.id || record?.id || "";
    const name = productData?.name || "Unnamed product";
    const sku = productData?.sku || "-";
    const category = productData?.categoryId || "-";
    const imageUrl = getProductImage(productData);
    const stock = Number(productData?.stock || 0);
    const sizeStock = parseSizeStock$1(productData?.sizeStock);
    const sizeStockEntries = Object.entries(sizeStock);
    const isActive = Boolean(productData?.isActive);
    const price = formatCurrency(productData?.price);
    const description = productData?.description || "No description available for this product.";
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
      // Fetch fresh product data with sizeStock
      if (productId) {
        fetch(`/api/products/${productId}`, {
          method: "GET",
          credentials: "include"
        }).then(res => res.ok ? res.json() : null).catch(() => null).then(data => {
          if (data?.id) {
            setProductData(data);
          }
        });
      }

      // Fetch current user role
      fetch("/admin/context/current-user", {
        method: "GET",
        credentials: "include"
      }).then(res => res.ok ? res.json() : null).catch(() => null).then(data => {
        if (data?.role) {
          setCurrentUserRole(data.role);
        }
      });
      const root = document.documentElement;
      const body = document.body;
      root.classList.add("change8-product-show-active");
      body?.classList.add("change8-product-show-active");
      return () => {
        root.classList.remove("change8-product-show-active");
        body?.classList.remove("change8-product-show-active");
      };
    }, [productId]);
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
    }, sku)), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoCardStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: infoLabelStyle
    }, "Sizes"), /*#__PURE__*/React__default.default.createElement("div", {
      style: infoValueStyle
    }, sizeStockEntries.length))), /*#__PURE__*/React__default.default.createElement("div", {
      style: actionRowStyle
    }, currentUserRole !== "admin" && /*#__PURE__*/React__default.default.createElement("button", {
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
    }, "Size Stock"), /*#__PURE__*/React__default.default.createElement("span", {
      style: detailValueStyle
    }, sizeStockEntries.length ? sizeStockEntries.map(([size, qty]) => `${size}: ${qty}`).join(" | ") : "No size-wise stock")), /*#__PURE__*/React__default.default.createElement("div", {
      style: detailRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: detailLabelStyle
    }, "Created At"), /*#__PURE__*/React__default.default.createElement("span", {
      style: detailValueStyle
    }, formatDate$2(productData?.createdAt))), /*#__PURE__*/React__default.default.createElement("div", {
      style: detailRowStyle
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: detailLabelStyle
    }, "Updated At"), /*#__PURE__*/React__default.default.createElement("span", {
      style: detailValueStyle
    }, formatDate$2(productData?.updatedAt))), /*#__PURE__*/React__default.default.createElement("div", {
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
  const inputStyle$1 = {
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
  const rowStyle$1 = {
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
  const addButtonStyle$1 = {
    border: "1px solid rgba(99, 102, 241, 0.35)",
    borderRadius: "10px",
    padding: "9px 12px",
    background: "#eef2ff",
    color: "#3730a3",
    cursor: "pointer",
    fontWeight: 700
  };
  const removeButtonStyle$1 = {
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
  const fallbackSizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
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
  const parseSizeStock = value => {
    if (!value) {
      return {};
    }
    let source = value;
    if (typeof source === "string") {
      try {
        source = JSON.parse(source);
      } catch {
        return {};
      }
    }
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      return {};
    }
    const normalized = {};
    for (const [rawSize, rawQty] of Object.entries(source)) {
      const size = String(rawSize || "").trim().toUpperCase();
      if (!size) {
        continue;
      }
      const qty = Math.max(0, Math.trunc(Number(rawQty || 0)));
      normalized[size] = qty;
    }
    return normalized;
  };
  const getSizeEntries = product => {
    const sizeStock = parseSizeStock(product?.sizeStock);
    return Object.entries(sizeStock).sort(([a], [b]) => a.localeCompare(b)).map(([size, qty]) => ({
      size,
      qty
    }));
  };
  const getSizeOptions = product => {
    const entries = getSizeEntries(product);
    if (entries.length > 0) {
      return entries;
    }
    return fallbackSizeOptions.map(size => ({
      size,
      qty: null
    }));
  };
  const createEmptyItem = () => ({
    productId: "",
    size: "",
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
            const selectedProductSizeOptions = getSizeOptions(contextData.selectedProduct);
            setLineItems([{
              productId: String(contextData.selectedProduct.id),
              size: selectedProductSizeOptions[0]?.size || "",
              quantity: 1,
              unitPrice: toNumber(contextData.selectedProduct.price)
            }]);
            return;
          }
          if (preProductId && productsList.some(p => String(p.id) === String(preProductId))) {
            const selected = productsList.find(p => String(p.id) === String(preProductId));
            const selectedProductSizeOptions = getSizeOptions(selected);
            setLineItems([{
              productId: String(preProductId),
              size: selectedProductSizeOptions[0]?.size || "",
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
          const sizeOptions = getSizeOptions(product);
          item.unitPrice = toNumber(product?.price);
          item.size = sizeOptions[0]?.size || "";
          const maxQtyForSize = sizeOptions[0]?.qty === null ? null : Math.max(1, Number(sizeOptions[0]?.qty || 0));
          if (maxQtyForSize !== null) {
            item.quantity = Math.max(1, Math.min(toNumber(item.quantity), maxQtyForSize));
          }
        } else if (key === "size") {
          item.size = value;
          const product = products.find(p => String(p.id) === String(item.productId));
          const sizeOptions = getSizeOptions(product);
          const selectedSizeOption = sizeOptions.find(option => option.size === value);
          if (selectedSizeOption && selectedSizeOption.qty !== null) {
            const maxQtyForSize = Math.max(1, Number(selectedSizeOption.qty || 0));
            item.quantity = Math.max(1, Math.min(toNumber(item.quantity), maxQtyForSize));
          }
        } else if (key === "quantity") {
          const product = products.find(p => String(p.id) === String(item.productId));
          const sizeOptions = getSizeOptions(product);
          const selectedSizeOption = sizeOptions.find(option => option.size === item.size);
          const parsedQty = Math.max(1, toNumber(value));
          if (selectedSizeOption && selectedSizeOption.qty !== null) {
            const maxQtyForSize = Math.max(1, Number(selectedSizeOption.qty || 0));
            item.quantity = Math.min(parsedQty, maxQtyForSize);
          } else {
            item.quantity = parsedQty;
          }
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
      for (const item of validItems) {
        const selectedProduct = products.find(product => String(product.id) === String(item.productId));
        const sizeEntries = getSizeEntries(selectedProduct);
        if (sizeEntries.length > 0) {
          if (!item.size) {
            alert("Please select a size for all products.");
            return;
          }
          const selectedSize = sizeEntries.find(entry => entry.size === String(item.size).toUpperCase());
          if (!selectedSize) {
            alert(`Selected size is not available for ${selectedProduct?.name || "this product"}.`);
            return;
          }
          if (toNumber(item.quantity) > selectedSize.qty) {
            alert(`${selectedProduct?.name || "Product"} (${selectedSize.size}) has only ${selectedSize.qty} in stock.`);
            return;
          }
        }
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
      style: rowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Select Customer *"), /*#__PURE__*/React__default.default.createElement("select", {
      name: "userId",
      value: formData.userId,
      onChange: handleFormChange,
      style: inputStyle$1,
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
      style: rowStyle$1
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
      style: rowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Selected Method"), /*#__PURE__*/React__default.default.createElement("input", {
      value: formData.paymentMethod,
      style: inputStyle$1,
      readOnly: true
    })), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Payment Status"), /*#__PURE__*/React__default.default.createElement("select", {
      name: "paymentStatus",
      value: formData.paymentStatus,
      onChange: handleFormChange,
      style: inputStyle$1
    }, /*#__PURE__*/React__default.default.createElement("option", {
      value: "pending"
    }, "Pending"), /*#__PURE__*/React__default.default.createElement("option", {
      value: "paid"
    }, "Paid")))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 10
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Transaction ID"), /*#__PURE__*/React__default.default.createElement("input", {
      name: "transactionId",
      value: formData.transactionId,
      onChange: handleFormChange,
      style: inputStyle$1,
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
      style: addButtonStyle$1
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
      const sizeOptions = getSizeOptions(selectedProduct);
      const selectedSizeOption = sizeOptions.find(option => option.size === item.size);
      const sizeStockText = getSizeEntries(selectedProduct).map(entry => `${entry.size}: ${entry.qty}`).join(" | ");
      const itemTotal = toNumber(item.quantity) * toNumber(item.unitPrice);
      return /*#__PURE__*/React__default.default.createElement("div", {
        key: `line-item-${index}`,
        style: lineItemRowStyle
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: lineItemTopStyle
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: rowStyle$1
      }, /*#__PURE__*/React__default.default.createElement("label", {
        style: labelStyle
      }, "Product"), /*#__PURE__*/React__default.default.createElement("select", {
        value: item.productId,
        onChange: event => handleLineItemChange(index, "productId", event.target.value),
        style: inputStyle$1,
        required: true
      }, /*#__PURE__*/React__default.default.createElement("option", {
        value: ""
      }, "Select product"), products.map(product => /*#__PURE__*/React__default.default.createElement("option", {
        key: product.id,
        value: product.id
      }, product.name, " (SKU: ", product.sku, ")")))), /*#__PURE__*/React__default.default.createElement("button", {
        type: "button",
        style: removeButtonStyle$1,
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
      }, "Size: ", item.size || "-", " | Qty: ", item.quantity), sizeStockText ? /*#__PURE__*/React__default.default.createElement("span", {
        style: {
          fontSize: "11px",
          color: "#facc15"
        }
      }, "Available: ", sizeStockText) : null)), /*#__PURE__*/React__default.default.createElement("div", {
        style: rowStyle$1
      }, /*#__PURE__*/React__default.default.createElement("label", {
        style: labelStyle
      }, "Size"), /*#__PURE__*/React__default.default.createElement("select", {
        value: item.size || "",
        onChange: event => handleLineItemChange(index, "size", event.target.value),
        style: inputStyle$1,
        required: true
      }, /*#__PURE__*/React__default.default.createElement("option", {
        value: ""
      }, "Select size"), sizeOptions.map(sizeOption => /*#__PURE__*/React__default.default.createElement("option", {
        key: sizeOption.size,
        value: sizeOption.size
      }, sizeOption.qty === null ? sizeOption.size : `${sizeOption.size} (${sizeOption.qty})`)))), /*#__PURE__*/React__default.default.createElement("div", {
        className: "change8-order-grid-2",
        style: grid2Style
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: rowStyle$1
      }, /*#__PURE__*/React__default.default.createElement("label", {
        style: labelStyle
      }, "Quantity"), /*#__PURE__*/React__default.default.createElement("input", {
        type: "number",
        min: "1",
        max: selectedSizeOption?.qty === null || selectedSizeOption?.qty === undefined ? undefined : Math.max(1, Number(selectedSizeOption.qty || 0)),
        value: item.quantity,
        onChange: event => handleLineItemChange(index, "quantity", event.target.value),
        style: inputStyle$1,
        required: true
      })), /*#__PURE__*/React__default.default.createElement("div", {
        style: rowStyle$1
      }, /*#__PURE__*/React__default.default.createElement("label", {
        style: labelStyle
      }, "Unit Price"), /*#__PURE__*/React__default.default.createElement("input", {
        type: "number",
        min: "0",
        step: "0.01",
        value: item.unitPrice,
        onChange: event => handleLineItemChange(index, "unitPrice", event.target.value),
        style: inputStyle$1,
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
      style: rowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Shipping Contact Name *"), /*#__PURE__*/React__default.default.createElement("input", {
      name: "shippingName",
      value: formData.shippingName,
      onChange: handleFormChange,
      style: inputStyle$1,
      placeholder: "Receiver full name",
      required: true
    })), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Shipping Phone Number *"), /*#__PURE__*/React__default.default.createElement("input", {
      name: "shippingPhone",
      value: formData.shippingPhone,
      onChange: handleFormChange,
      style: inputStyle$1,
      placeholder: "07X XXX XXXX",
      required: true
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 10
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Shipping Address *"), /*#__PURE__*/React__default.default.createElement("textarea", {
      name: "shippingAddress",
      value: formData.shippingAddress,
      onChange: handleFormChange,
      style: {
        ...inputStyle$1,
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
      style: rowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Shipping Method"), /*#__PURE__*/React__default.default.createElement("select", {
      name: "shippingMethod",
      value: formData.shippingMethod,
      onChange: handleFormChange,
      style: inputStyle$1
    }, shippingMethods.map(item => /*#__PURE__*/React__default.default.createElement("option", {
      key: item,
      value: item
    }, item)))), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Tracking Number"), /*#__PURE__*/React__default.default.createElement("input", {
      name: "trackingNumber",
      value: formData.trackingNumber,
      onChange: handleFormChange,
      style: inputStyle$1,
      placeholder: "TRK-XXXXXX"
    })))), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle$3
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: sectionTitleStyle$2
    }, "Order Summary / Totals"), /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-order-grid-2",
      style: grid2Style
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Shipping Fee"), /*#__PURE__*/React__default.default.createElement("input", {
      type: "number",
      step: "0.01",
      min: "0",
      name: "shippingFee",
      value: formData.shippingFee,
      onChange: handleFormChange,
      style: inputStyle$1
    })), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Tax / VAT"), /*#__PURE__*/React__default.default.createElement("input", {
      type: "number",
      step: "0.01",
      min: "0",
      name: "tax",
      value: formData.tax,
      onChange: handleFormChange,
      style: inputStyle$1
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: 10
      }
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: rowStyle$1
    }, /*#__PURE__*/React__default.default.createElement("label", {
      style: labelStyle
    }, "Discount / Coupon"), /*#__PURE__*/React__default.default.createElement("input", {
      type: "number",
      step: "0.01",
      min: "0",
      name: "discount",
      value: formData.discount,
      onChange: handleFormChange,
      style: inputStyle$1
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

  const wrapperStyle$2 = {
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
  const hintStyle$1 = {
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
    };
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: wrapperStyle$2
    }, /*#__PURE__*/React__default.default.createElement("input", {
      type: "file",
      accept: "image/*",
      onChange: handleUpload
    }), /*#__PURE__*/React__default.default.createElement("div", {
      style: hintStyle$1
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
        ...hintStyle$1,
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

  const wrapperStyle$1 = {
    display: "grid",
    gap: "10px"
  };
  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 140px auto",
    gap: "8px",
    alignItems: "center"
  };
  const inputStyle = {
    border: "1px solid rgba(148, 163, 184, 0.45)",
    borderRadius: "10px",
    padding: "8px 10px",
    fontSize: "13px",
    background: "#fff"
  };
  const hintStyle = {
    fontSize: "12px",
    color: "#64748b"
  };
  const addButtonStyle = {
    width: "fit-content",
    padding: "7px 12px",
    borderRadius: "9px",
    border: "1px solid #6366f1",
    color: "#3730a3",
    background: "#eef2ff",
    cursor: "pointer",
    fontWeight: 700
  };
  const removeButtonStyle = {
    padding: "7px 9px",
    borderRadius: "9px",
    border: "1px solid #fca5a5",
    color: "#991b1b",
    background: "#fee2e2",
    cursor: "pointer",
    fontWeight: 700
  };
  const parseInitialValue = value => {
    if (!value) {
      return [];
    }
    let source = value;
    if (typeof source === "string") {
      try {
        source = JSON.parse(source);
      } catch {
        return [];
      }
    }
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      return [];
    }
    return Object.entries(source).map(([size, qty]) => ({
      size: String(size || "").trim().toUpperCase(),
      stock: String(Number(qty || 0))
    }));
  };
  const ProductSizeStockInput = props => {
    const {
      record,
      onChange
    } = props;
    const initialRows = React.useMemo(() => parseInitialValue(record?.params?.sizeStock), [record?.params?.sizeStock]);
    const [rows, setRows] = React.useState(initialRows.length ? initialRows : [{
      size: "",
      stock: ""
    }]);
    React.useEffect(() => {
      setRows(initialRows.length ? initialRows : [{
        size: "",
        stock: ""
      }]);
    }, [initialRows]);
    React.useEffect(() => {
      const sizeStock = {};
      rows.forEach(row => {
        const size = String(row.size || "").trim().toUpperCase();
        if (!size) {
          return;
        }
        const stock = Math.max(0, Math.trunc(Number(row.stock || 0)));
        sizeStock[size] = stock;
      });
      const totalStock = Object.values(sizeStock).reduce((sum, qty) => sum + Number(qty || 0), 0);
      onChange?.("sizeStockText", JSON.stringify(sizeStock));
      onChange?.("stock", totalStock);
    }, [rows, onChange]);
    const updateRow = (index, key, value) => {
      setRows(prev => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          [key]: value
        };
        return next;
      });
    };
    const addRow = () => {
      setRows(prev => [...prev, {
        size: "",
        stock: ""
      }]);
    };
    const removeRow = index => {
      setRows(prev => {
        if (prev.length <= 1) {
          return [{
            size: "",
            stock: ""
          }];
        }
        return prev.filter((_, rowIndex) => rowIndex !== index);
      });
    };
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: wrapperStyle$1
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: hintStyle
    }, "Add product sizes and stock per size. Total stock is auto-calculated."), rows.map((row, index) => /*#__PURE__*/React__default.default.createElement("div", {
      key: `${index}-${row.size}`,
      style: rowStyle
    }, /*#__PURE__*/React__default.default.createElement("input", {
      type: "text",
      placeholder: "Size (e.g. S, M, L, XL)",
      value: row.size,
      onChange: event => updateRow(index, "size", event.target.value),
      style: inputStyle
    }), /*#__PURE__*/React__default.default.createElement("input", {
      type: "number",
      min: "0",
      step: "1",
      placeholder: "Stock",
      value: row.stock,
      onChange: event => updateRow(index, "stock", event.target.value),
      style: inputStyle
    }), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      onClick: () => removeRow(index),
      style: removeButtonStyle,
      "aria-label": "Remove size"
    }, "Remove"))), /*#__PURE__*/React__default.default.createElement("button", {
      type: "button",
      onClick: addRow,
      style: addButtonStyle
    }, "+ Add Size"), /*#__PURE__*/React__default.default.createElement("input", {
      type: "hidden",
      name: "sizeStock",
      value: JSON.stringify(rows.reduce((acc, row) => {
        const size = String(row.size || "").trim().toUpperCase();
        if (!size) {
          return acc;
        }
        acc[size] = Math.max(0, Math.trunc(Number(row.stock || 0)));
        return acc;
      }, {})),
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
  AdminJS.UserComponents.ProductSizeStockInput = ProductSizeStockInput;
  AdminJS.UserComponents.CategoryShow = CategoryShow;
  AdminJS.UserComponents.About = About;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9hZG1pbi9kYXNoYm9hcmQuanN4IiwiLi4vYWRtaW4vcmVnaXN0ZXIuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1jYXJkcy1saXN0LmpzeCIsIi4uL2FkbWluL3Byb2R1Y3Qtc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1jcmVhdGUuanN4IiwiLi4vYWRtaW4vb3JkZXItc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1pdGVtLXNob3cuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS5qc3giLCIuLi9hZG1pbi9wcm9kdWN0LWltYWdlLXVwbG9hZC5qc3giLCIuLi9hZG1pbi9wcm9kdWN0LXNpemUtc3RvY2staW5wdXQuanN4IiwiLi4vYWRtaW4vY2F0ZWdvcnktc2hvdy5qc3giLCIuLi9hZG1pbi9hYm91dC5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgZm9ybWF0Q3VycmVuY3kgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBhbW91bnQgPSBOdW1iZXIodmFsdWUgfHwgMCk7XHJcbiAgcmV0dXJuIGBScy4gJHthbW91bnQudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IGFtb3VudCAlIDEgPT09IDAgPyAwIDogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgcHJvZHVjdEltYWdlID0gKHByb2R1Y3QpID0+IHtcclxuICBjb25zdCByZXNvbHZlZCA9XHJcbiAgICBwcm9kdWN0Py5pbWFnZSB8fFxyXG4gICAgcHJvZHVjdD8uaW1hZ2VVcmwgfHxcclxuICAgIHByb2R1Y3Q/LnRodW1ibmFpbCB8fFxyXG4gICAgcHJvZHVjdD8uY292ZXIgfHxcclxuICAgIFwiL3B1YmxpYy9pbWczLnBuZ1wiO1xyXG5cclxuICBjb25zdCBub3JtYWxpemVkID0gU3RyaW5nKHJlc29sdmVkIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCk7XHJcbiAgaWYgKG5vcm1hbGl6ZWQuaW5jbHVkZXMoXCJpbWcxXCIpIHx8IG5vcm1hbGl6ZWQuaW5jbHVkZXMoXCJpbWcyXCIpKSB7XHJcbiAgICByZXR1cm4gXCIvcHVibGljL2ltZzMucG5nXCI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzb2x2ZWQ7XHJcbn07XHJcblxyXG5jb25zdCBwcm9kdWN0TGFiZWwgPSAocHJvZHVjdCkgPT4ge1xyXG4gIGNvbnN0IG5hbWUgPSBTdHJpbmcocHJvZHVjdD8ubmFtZSB8fCBcInByb2R1Y3RcIik7XHJcbiAgcmV0dXJuIG5hbWVcclxuICAgIC5zcGxpdChcIiBcIilcclxuICAgIC5zbGljZSgwLCAyKVxyXG4gICAgLm1hcCgocGFydCkgPT4gcGFydFswXSlcclxuICAgIC5qb2luKFwiXCIpXHJcbiAgICAudG9VcHBlckNhc2UoKTtcclxufTtcclxuXHJcbmNvbnN0IG5vcm1hbGl6ZVByb2R1Y3QgPSAoaXRlbSkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZCA9IGl0ZW0/LnBhcmFtcyA/IGl0ZW0ucGFyYW1zIDogaXRlbSB8fCB7fTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGlkOiByZWNvcmQuaWQgPz8gaXRlbT8uaWQsXHJcbiAgICBuYW1lOiByZWNvcmQubmFtZSB8fCBcIlVudGl0bGVkIHByb2R1Y3RcIixcclxuICAgIHByaWNlOiBOdW1iZXIocmVjb3JkLnByaWNlIHx8IDApLFxyXG4gICAgaW1hZ2VVcmw6IHJlY29yZC5pbWFnZVVybCB8fCBcIlwiLFxyXG4gICAgaXNBY3RpdmU6IEJvb2xlYW4ocmVjb3JkLmlzQWN0aXZlKSxcclxuICAgIHN0b2NrOiBOdW1iZXIocmVjb3JkLnN0b2NrIHx8IDApLFxyXG4gICAgY2F0ZWdvcnlOYW1lOlxyXG4gICAgICByZWNvcmQ/LmNhdGVnb3J5Py5uYW1lIHx8XHJcbiAgICAgIHJlY29yZD8uY2F0ZWdvcnlOYW1lIHx8XHJcbiAgICAgIHJlY29yZD8uY2F0ZWdvcnlJZCB8fFxyXG4gICAgICBcIlNob3BcIixcclxuICAgIHJlY29yZEFjdGlvbnM6IGl0ZW0/LnJlY29yZEFjdGlvbnMgfHwgaXRlbT8uYWN0aW9ucyB8fCBbXSxcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3Qgbm9ybWFsaXplT3JkZXIgPSAoaXRlbSkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZCA9IGl0ZW0/LnBhcmFtcyA/IGl0ZW0ucGFyYW1zIDogaXRlbSB8fCB7fTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGlkOiByZWNvcmQuaWQgPz8gaXRlbT8uaWQsXHJcbiAgICBzdGF0dXM6IFN0cmluZyhyZWNvcmQuc3RhdHVzIHx8IFwicGVuZGluZ1wiKSxcclxuICAgIHRvdGFsQW1vdW50OiBOdW1iZXIocmVjb3JkLnRvdGFsQW1vdW50IHx8IDApLFxyXG4gICAgY3JlYXRlZEF0OiByZWNvcmQuY3JlYXRlZEF0IHx8IGl0ZW0/LmNyZWF0ZWRBdCB8fCBudWxsLFxyXG4gICAgdXNlck5hbWU6XHJcbiAgICAgIHJlY29yZD8udXNlcj8ubmFtZSB8fFxyXG4gICAgICByZWNvcmQ/LmN1c3RvbWVyTmFtZSB8fFxyXG4gICAgICByZWNvcmQ/LnNoaXBwaW5nTmFtZSB8fFxyXG4gICAgICBcIk9yZGVyXCIsXHJcbiAgICByZWNvcmRBY3Rpb25zOiBpdGVtPy5yZWNvcmRBY3Rpb25zIHx8IGl0ZW0/LmFjdGlvbnMgfHwgW10sXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IGdldFNob3dIcmVmID0gKHByb2R1Y3QpID0+IHtcclxuICBjb25zdCByZWNvcmRBY3Rpb25zID0gcHJvZHVjdD8ucmVjb3JkQWN0aW9ucyB8fCBbXTtcclxuICBjb25zdCBzaG93QWN0aW9uID0gcmVjb3JkQWN0aW9ucy5maW5kKChhY3Rpb24pID0+IGFjdGlvbj8ubmFtZSA9PT0gXCJzaG93XCIpO1xyXG4gIGlmIChzaG93QWN0aW9uPy5ocmVmKSB7XHJcbiAgICByZXR1cm4gc2hvd0FjdGlvbi5ocmVmO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHByb2R1Y3Q/LmlkXHJcbiAgICA/IGAvYWRtaW4vcmVzb3VyY2VzL1Byb2R1Y3RzL3JlY29yZHMvJHtlbmNvZGVVUklDb21wb25lbnQocHJvZHVjdC5pZCl9L3Nob3dgXHJcbiAgICA6IFwiXCI7XHJcbn07XHJcblxyXG5jb25zdCBEYXNoYm9hcmQgPSAoKSA9PiB7XHJcbiAgY29uc3QgW3N1bW1hcnksIHNldFN1bW1hcnldID0gdXNlU3RhdGUoe1xyXG4gICAgdXNlcnM6IDAsXHJcbiAgICBwcm9kdWN0czogMCxcclxuICAgIGNhdGVnb3JpZXM6IDAsXHJcbiAgICBvcmRlcnM6IDAsXHJcbiAgfSk7XHJcbiAgY29uc3QgW3JlY29yZHMsIHNldFJlY29yZHNdID0gdXNlU3RhdGUoW10pO1xyXG4gIGNvbnN0IFtyZWNlbnRPcmRlcnMsIHNldFJlY2VudE9yZGVyc10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XHJcbiAgY29uc3QgW3NlYXJjaFRlcm0sIHNldFNlYXJjaFRlcm1dID0gdXNlU3RhdGUoXCJcIik7XHJcbiAgY29uc3QgW2N1cnJlbnRTbGlkZSwgc2V0Q3VycmVudFNsaWRlXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtjdXJyZW50VXNlck5hbWUsIHNldEN1cnJlbnRVc2VyTmFtZV0gPSB1c2VTdGF0ZShcIlwiKTtcclxuICBjb25zdCBbY3VycmVudFVzZXJSb2xlLCBzZXRDdXJyZW50VXNlclJvbGVdID0gdXNlU3RhdGUoXCJcIik7XHJcbiAgY29uc3QgW2lzVXNlck1lbnVPcGVuLCBzZXRJc1VzZXJNZW51T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcblxyXG4gICAgcm9vdC5jbGFzc0xpc3QuYWRkKFwiY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlXCIpO1xyXG4gICAgYm9keT8uY2xhc3NMaXN0LmFkZChcImNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQtcGFnZVwiKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICByb290LmNsYXNzTGlzdC5yZW1vdmUoXCJjaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2VcIik7XHJcbiAgICAgIGJvZHk/LmNsYXNzTGlzdC5yZW1vdmUoXCJjaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2VcIik7XHJcbiAgICB9O1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGxldCBpc01vdW50ZWQgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IGxvYWREYXNoYm9hcmQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHNldExvYWRpbmcodHJ1ZSk7XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IFtzdW1tYXJ5UmVzcG9uc2UsIHByb2R1Y3RzUmVzcG9uc2UsIG9yZGVyc1Jlc3BvbnNlXSA9XHJcbiAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgICAgIGZldGNoKFwiL2FkbWluL2FwaS9kYXNoYm9hcmRcIiwgeyBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiIH0pLFxyXG4gICAgICAgICAgICBmZXRjaChcIi9hcGkvcHJvZHVjdHNcIiwge1xyXG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBmZXRjaChcIi9hZG1pbi9hcGkvcmVzb3VyY2VzL09yZGVycy9hY3Rpb25zL2xpc3RcIiwge1xyXG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHN1bW1hcnlQYXlsb2FkID0gc3VtbWFyeVJlc3BvbnNlLm9rXHJcbiAgICAgICAgICA/IGF3YWl0IHN1bW1hcnlSZXNwb25zZS5qc29uKClcclxuICAgICAgICAgIDoge307XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdFBheWxvYWQgPSBwcm9kdWN0c1Jlc3BvbnNlLm9rXHJcbiAgICAgICAgICA/IGF3YWl0IHByb2R1Y3RzUmVzcG9uc2UuanNvbigpXHJcbiAgICAgICAgICA6IFtdO1xyXG4gICAgICAgIGNvbnN0IG9yZGVyUGF5bG9hZCA9IG9yZGVyc1Jlc3BvbnNlLm9rXHJcbiAgICAgICAgICA/IGF3YWl0IG9yZGVyc1Jlc3BvbnNlLmpzb24oKVxyXG4gICAgICAgICAgOiB7fTtcclxuXHJcbiAgICAgICAgaWYgKCFpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRlZFJlY29yZHMgPSBBcnJheS5pc0FycmF5KHByb2R1Y3RQYXlsb2FkKVxyXG4gICAgICAgICAgPyBwcm9kdWN0UGF5bG9hZC5tYXAobm9ybWFsaXplUHJvZHVjdClcclxuICAgICAgICAgIDogW107XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRlZE9yZGVycyA9IEFycmF5LmlzQXJyYXkob3JkZXJQYXlsb2FkPy5yZWNvcmRzKVxyXG4gICAgICAgICAgPyBvcmRlclBheWxvYWQucmVjb3Jkcy5tYXAobm9ybWFsaXplT3JkZXIpXHJcbiAgICAgICAgICA6IFtdO1xyXG5cclxuICAgICAgICBzZXRTdW1tYXJ5KHtcclxuICAgICAgICAgIHVzZXJzOiBOdW1iZXIoc3VtbWFyeVBheWxvYWQ/LnVzZXJzIHx8IDApLFxyXG4gICAgICAgICAgcHJvZHVjdHM6IE51bWJlcihcclxuICAgICAgICAgICAgc3VtbWFyeVBheWxvYWQ/LnByb2R1Y3RzIHx8IGxvYWRlZFJlY29yZHMubGVuZ3RoIHx8IDAsXHJcbiAgICAgICAgICApLFxyXG4gICAgICAgICAgY2F0ZWdvcmllczogTnVtYmVyKHN1bW1hcnlQYXlsb2FkPy5jYXRlZ29yaWVzIHx8IDApLFxyXG4gICAgICAgICAgb3JkZXJzOiBOdW1iZXIoc3VtbWFyeVBheWxvYWQ/Lm9yZGVycyB8fCAwKSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBzZXRSZWNvcmRzKGxvYWRlZFJlY29yZHMpO1xyXG4gICAgICAgIHNldFJlY2VudE9yZGVycyhsb2FkZWRPcmRlcnMpO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldFJlY29yZHMoW10pO1xyXG4gICAgICAgICAgc2V0UmVjZW50T3JkZXJzKFtdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWREYXNoYm9hcmQoKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBpc01vdW50ZWQgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgY2xvc2VVc2VyTWVudSA9ICgpID0+IHtcclxuICAgICAgc2V0SXNVc2VyTWVudU9wZW4oZmFsc2UpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VVc2VyTWVudSk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlVXNlck1lbnUpO1xyXG4gICAgfTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBsb2FkQ3VycmVudFVzZXIgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hZG1pbi9jb250ZXh0L2N1cnJlbnQtdXNlclwiLCB7XHJcbiAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxyXG4gICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0Q3VycmVudFVzZXJOYW1lKFN0cmluZyhwYXlsb2FkPy5uYW1lIHx8IFwiXCIpLnRyaW0oKSk7XHJcbiAgICAgICAgICBzZXRDdXJyZW50VXNlclJvbGUoXHJcbiAgICAgICAgICAgIFN0cmluZyhwYXlsb2FkPy5yb2xlIHx8IFwiXCIpXHJcbiAgICAgICAgICAgICAgLnRyaW0oKVxyXG4gICAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0Q3VycmVudFVzZXJOYW1lKFwiXCIpO1xyXG4gICAgICAgICAgc2V0Q3VycmVudFVzZXJSb2xlKFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkQ3VycmVudFVzZXIoKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBpc01vdW50ZWQgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCBhY3RpdmVQcm9kdWN0cyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgcmV0dXJuIHJlY29yZHMuZmlsdGVyKChwcm9kdWN0KSA9PiBwcm9kdWN0LmlzQWN0aXZlICE9PSBmYWxzZSk7XHJcbiAgfSwgW3JlY29yZHNdKTtcclxuXHJcbiAgY29uc3QgZmlsdGVyZWRQcm9kdWN0cyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3QgcXVlcnkgPSBzZWFyY2hUZXJtLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgIGlmICghcXVlcnkpIHtcclxuICAgICAgcmV0dXJuIGFjdGl2ZVByb2R1Y3RzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhY3RpdmVQcm9kdWN0cy5maWx0ZXIoKHByb2R1Y3QpID0+IHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBwcm9kdWN0Lm5hbWUsXHJcbiAgICAgICAgU3RyaW5nKHByb2R1Y3QuY2F0ZWdvcnlOYW1lIHx8IFwiXCIpLFxyXG4gICAgICAgIFN0cmluZyhwcm9kdWN0LnN0b2NrIHx8IFwiXCIpLFxyXG4gICAgICBdXHJcbiAgICAgICAgLmpvaW4oXCIgXCIpXHJcbiAgICAgICAgLnRvTG93ZXJDYXNlKClcclxuICAgICAgICAuaW5jbHVkZXMocXVlcnkpO1xyXG4gICAgfSk7XHJcbiAgfSwgW2FjdGl2ZVByb2R1Y3RzLCBzZWFyY2hUZXJtXSk7XHJcblxyXG4gIGNvbnN0IGhlcm9TbGlkZXMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogXCJpbWczLXN0YXRpY1wiLFxyXG4gICAgICAgIG5hbWU6IFwiTmV3IENvbGxlY3Rpb25cIixcclxuICAgICAgICBjYXRlZ29yeU5hbWU6IFwiRmVhdHVyZWRcIixcclxuICAgICAgICBpbWFnZVVybDogXCIvcHVibGljL2ltZzMucG5nXCIsXHJcbiAgICAgICAgaXNBY3RpdmU6IHRydWUsXHJcbiAgICAgICAgc3RvY2s6IDAsXHJcbiAgICAgICAgcHJpY2U6IDAsXHJcbiAgICAgICAgcmVjb3JkQWN0aW9uczogW10sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogXCJpbWc0LXN0YXRpY1wiLFxyXG4gICAgICAgIG5hbWU6IFwiTGF0ZXN0IERyb3BcIixcclxuICAgICAgICBjYXRlZ29yeU5hbWU6IFwiRmVhdHVyZWRcIixcclxuICAgICAgICBpbWFnZVVybDogXCIvcHVibGljL2ltZzQucG5nXCIsXHJcbiAgICAgICAgaXNBY3RpdmU6IHRydWUsXHJcbiAgICAgICAgc3RvY2s6IDAsXHJcbiAgICAgICAgcHJpY2U6IDAsXHJcbiAgICAgICAgcmVjb3JkQWN0aW9uczogW10sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogXCJpbWc1LXN0YXRpY1wiLFxyXG4gICAgICAgIG5hbWU6IFwiTGF0ZXN0IERyb3BcIixcclxuICAgICAgICBjYXRlZ29yeU5hbWU6IFwiRmVhdHVyZWRcIixcclxuICAgICAgICBpbWFnZVVybDogXCIvcHVibGljL2ltZzUucG5nXCIsXHJcbiAgICAgICAgaXNBY3RpdmU6IHRydWUsXHJcbiAgICAgICAgc3RvY2s6IDAsXHJcbiAgICAgICAgcHJpY2U6IDAsXHJcbiAgICAgICAgcmVjb3JkQWN0aW9uczogW10sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChoZXJvU2xpZGVzLmxlbmd0aCA8PSAxKSB7XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBzZXRDdXJyZW50U2xpZGUoKHByZXZpb3VzKSA9PiAocHJldmlvdXMgKyAxKSAlIGhlcm9TbGlkZXMubGVuZ3RoKTtcclxuICAgIH0sIDQyMDApO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aW1lcik7XHJcbiAgfSwgW2hlcm9TbGlkZXMubGVuZ3RoXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoY3VycmVudFNsaWRlID49IGhlcm9TbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgIHNldEN1cnJlbnRTbGlkZSgwKTtcclxuICAgIH1cclxuICB9LCBbY3VycmVudFNsaWRlLCBoZXJvU2xpZGVzLmxlbmd0aF0pO1xyXG5cclxuICBjb25zdCBmZWF0dXJlZFByb2R1Y3QgPVxyXG4gICAgaGVyb1NsaWRlc1tjdXJyZW50U2xpZGVdIHx8IGFjdGl2ZVByb2R1Y3RzWzBdIHx8IHJlY29yZHNbMF0gfHwgbnVsbDtcclxuICBjb25zdCBoZXJvSW1hZ2UgPSBwcm9kdWN0SW1hZ2UoZmVhdHVyZWRQcm9kdWN0KTtcclxuICBjb25zdCBoZXJvVGl0bGUgPSBmZWF0dXJlZFByb2R1Y3Q/Lm5hbWUgfHwgXCJSZXZpdmUgTWUgSmV0dFwiO1xyXG4gIGNvbnN0IGhlcm9TdWJ0aXRsZSA9IGZlYXR1cmVkUHJvZHVjdD8uY2F0ZWdvcnlOYW1lIHx8IFwiT3ZlcnNpemUgVGVlXCI7XHJcbiAgY29uc3QgaGVyb0hyZWYgPSBnZXRTaG93SHJlZihmZWF0dXJlZFByb2R1Y3QpO1xyXG4gIGNvbnN0IG9yZGVyc0xpc3RIcmVmID0gXCIvYWRtaW4vcmVzb3VyY2VzL09yZGVycy9hY3Rpb25zL2xpc3RcIjtcclxuXHJcbiAgY29uc3Qgc3BvdGxpZ2h0UHJvZHVjdHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiBmaWx0ZXJlZFByb2R1Y3RzLnNsaWNlKDAsIDUpO1xyXG4gIH0sIFtmaWx0ZXJlZFByb2R1Y3RzXSk7XHJcblxyXG4gIGNvbnN0IGNhdGVnb3JpZXMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICByZWNvcmRzLmZvckVhY2goKHByb2R1Y3QpID0+IHtcclxuICAgICAgY29uc3QgbmFtZSA9IFN0cmluZyhwcm9kdWN0LmNhdGVnb3J5TmFtZSB8fCBcIlNob3BcIik7XHJcbiAgICAgIGJ1Y2tldC5zZXQobmFtZSwgKGJ1Y2tldC5nZXQobmFtZSkgfHwgMCkgKyAxKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBBcnJheS5mcm9tKGJ1Y2tldC5lbnRyaWVzKCkpLm1hcCgoW25hbWUsIGNvdW50XSkgPT4gKHtcclxuICAgICAgbmFtZSxcclxuICAgICAgY291bnQsXHJcbiAgICB9KSk7XHJcbiAgfSwgW3JlY29yZHNdKTtcclxuXHJcbiAgY29uc3QgaXNBZG1pblVzZXIgPSBjdXJyZW50VXNlclJvbGUgPT09IFwiYWRtaW5cIjtcclxuICBjb25zdCBhZG1pblByb2R1Y3RSb3dzID0gQXJyYXkuaXNBcnJheShyZWNvcmRzKSA/IHJlY29yZHMuc2xpY2UoMCwgMTIpIDogW107XHJcbiAgY29uc3QgY2F0ZWdvcnlQcmV2aWV3ID0gY2F0ZWdvcmllcy5zbGljZSgwLCA2KTtcclxuXHJcbiAgaWYgKGlzQWRtaW5Vc2VyKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkXCI+XHJcbiAgICAgICAgPHN0eWxlPntgXHJcbiAgICAgICAgICBodG1sLmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQtcGFnZSxcclxuICAgICAgICAgIGh0bWwuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlIGJvZHksXHJcbiAgICAgICAgICBodG1sLmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQtcGFnZSAjYXBwLFxyXG4gICAgICAgICAgaHRtbC5jaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2UgLmFkbWluanNfTGF5b3V0LFxyXG4gICAgICAgICAgaHRtbC5jaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2UgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdLFxyXG4gICAgICAgICAgaHRtbC5jaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2UgW2RhdGEtY3NzPVwibGF5b3V0XCJdLFxyXG4gICAgICAgICAgaHRtbC5jaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2UgbWFpbixcclxuICAgICAgICAgIGJvZHkuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlLFxyXG4gICAgICAgICAgYm9keS5jaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2UgI2FwcCxcclxuICAgICAgICAgIGJvZHkuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlIC5hZG1pbmpzX0xheW91dCxcclxuICAgICAgICAgIGJvZHkuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlIFtkYXRhLXRlc3RpZD1cImxheW91dFwiXSxcclxuICAgICAgICAgIGJvZHkuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlIFtkYXRhLWNzcz1cImxheW91dFwiXSxcclxuICAgICAgICAgIGJvZHkuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlIG1haW4ge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmYgIWltcG9ydGFudDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGh0bWwuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlIGJvZHk6OmJlZm9yZSxcclxuICAgICAgICAgIGh0bWwuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlOjpiZWZvcmUsXHJcbiAgICAgICAgICBib2R5LmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQtcGFnZTo6YmVmb3JlIHtcclxuICAgICAgICAgICAgY29udGVudDogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWRhc2hib2FyZCB7XHJcbiAgICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAyOHB4O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZjhmYWZjO1xyXG4gICAgICAgICAgICBjb2xvcjogIzBmMTcyYTtcclxuICAgICAgICAgICAgZm9udC1mYW1pbHk6IFwiUG9wcGluc1wiLCBcIlNlZ29lIFVJXCIsIHNhbnMtc2VyaWY7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLWdyaWQge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICBnYXA6IDE4cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLWhlYWRlciB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgICAgICAgICAgZ2FwOiAxNnB4O1xyXG4gICAgICAgICAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tYWN0aW9ucyB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIGZsZXgtd3JhcDogd3JhcDtcclxuICAgICAgICAgICAgZ2FwOiAxMHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWFjdGlvbiB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICAgICAgZ2FwOiA4cHg7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDEycHggMTZweDtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTRweDtcclxuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgxNSwgMjMsIDQyLCAwLjEpO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xyXG4gICAgICAgICAgICBjb2xvcjogIzBmMTcyYTtcclxuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMjRweCByZ2JhKDE1LCAyMywgNDIsIDAuMDYpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWFjdGlvbi0tcHJpbWFyeSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICM2MzY2ZjEgMCUsICM4YjVjZjYgMTAwJSk7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjZmZmZmZmO1xyXG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLXRpdGxlIHtcclxuICAgICAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IGNsYW1wKDI4cHgsIDR2dywgNDZweCk7XHJcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWRhc2hib2FyZC1zdWJ0aXRsZSB7XHJcbiAgICAgICAgICAgIG1hcmdpbjogOHB4IDAgMDtcclxuICAgICAgICAgICAgY29sb3I6ICM2NDc0OGI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLWNhcmRzIHtcclxuICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoNCwgbWlubWF4KDAsIDFmcikpO1xyXG4gICAgICAgICAgICBnYXA6IDE2cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tY2FyZCxcclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLXBhbmVsIHtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMjBweDtcclxuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogI2ZmZmZmZjtcclxuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAxNnB4IDMwcHggcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1jYXJkIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMThweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1jYXJkLWxhYmVsIHtcclxuICAgICAgICAgICAgY29sb3I6ICM2NDc0OGI7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMTRlbTtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1jYXJkLXZhbHVlIHtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogMTBweDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAzMnB4O1xyXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1kYXNoYm9hcmQtbGlua3Mge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgzLCBtaW5tYXgoMCwgMWZyKSk7XHJcbiAgICAgICAgICAgIGdhcDogMTZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1saW5rIHtcclxuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDE4cHg7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4wOCk7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmZmZmY7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjMGYxNzJhO1xyXG4gICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMTBweCAyNHB4IHJnYmEoMTUsIDIzLCA0MiwgMC4wNik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tbGluayBzdHJvbmcge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiA2cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tc2VjdGlvbi10aXRsZSB7XHJcbiAgICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWNhdGVnb3J5LWxpc3Qge1xyXG4gICAgICAgICAgICBtYXJnaW4tdG9wOiAxNHB4O1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICBnYXA6IDEycHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tY2F0ZWdvcnktaXRlbSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgICAgICAgICAgZ2FwOiAxMnB4O1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxNHB4IDE2cHg7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4wOCk7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmOGZhZmM7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tY2F0ZWdvcnktbmFtZSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiA0cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tY2F0ZWdvcnktbWV0YSB7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjNjQ3NDhiO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tdGFibGUtd3JhcCB7XHJcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDE0cHg7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgICBvdmVyZmxvdy14OiBhdXRvO1xyXG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDE1LCAyMywgNDIsIDAuMDgpO1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLXRhYmxlIHtcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XHJcbiAgICAgICAgICAgIG1pbi13aWR0aDogNzYwcHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tdGFibGUgdGgsXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi10YWJsZSB0ZCB7XHJcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDEycHggMTRweDtcclxuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4wNyk7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi10YWJsZSB0aCB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmOGZhZmM7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjNDc1NTY5O1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLXRhYmxlIHRkIHtcclxuICAgICAgICAgICAgY29sb3I6ICMwZjE3MmE7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tdGFibGUgdHI6bGFzdC1jaGlsZCB0ZCB7XHJcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tdGh1bWItY2VsbCB7XHJcbiAgICAgICAgICAgIHdpZHRoOiA3NnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLXRodW1iIHtcclxuICAgICAgICAgICAgd2lkdGg6IDQ0cHg7XHJcbiAgICAgICAgICAgIGhlaWdodDogNDRweDtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgICAgICAgICAgb2JqZWN0LWZpdDogY292ZXI7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4wOCk7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmOGZhZmM7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLXN0YXR1cy1waWxsIHtcclxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgICAgICAgICAgcGFkZGluZzogNHB4IDEwcHg7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1zdGF0dXMtcGlsbC0tYWN0aXZlIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogI2RjZmNlNztcclxuICAgICAgICAgICAgY29sb3I6ICMxNjY1MzQ7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tc3RhdHVzLXBpbGwtLWluYWN0aXZlIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogI2ZlZTJlMjtcclxuICAgICAgICAgICAgY29sb3I6ICM5OTFiMWI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDExMDBweCkge1xyXG4gICAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1kYXNoYm9hcmQtY2FyZHMsXHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWRhc2hib2FyZC1saW5rcyB7XHJcbiAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDAsIDFmcikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDcyMHB4KSB7XHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWRhc2hib2FyZCB7XHJcbiAgICAgICAgICAgICAgcGFkZGluZzogMThweDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLmNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLWNhcmRzLFxyXG4gICAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1kYXNoYm9hcmQtbGlua3Mge1xyXG4gICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgYH08L3N0eWxlPlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLWdyaWRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1kYXNoYm9hcmQtaGVhZGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLXRpdGxlXCI+QWRtaW4gRGFzaGJvYXJkPC9oMT5cclxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWRhc2hib2FyZC1zdWJ0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgTWFuYWdlIHlvdXIgc2hvcCBkYXRhLCBwcm9kdWN0cywgb3JkZXJzLCBhbmQgdXNlcnMgZnJvbSBoZXJlLlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tYWN0aW9uc1wiPlxyXG4gICAgICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWFjdGlvbiBjaGFuZ2U4LWFkbWluLWFjdGlvbi0tcHJpbWFyeVwiXHJcbiAgICAgICAgICAgICAgICBocmVmPVwiL2FkbWluL3Jlc291cmNlcy9Qcm9kdWN0cy9hY3Rpb25zL25ld1wiXHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgKyBBZGQgUHJvZHVjdFxyXG4gICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1hY3Rpb25cIlxyXG4gICAgICAgICAgICAgICAgaHJlZj1cIi9hZG1pbi9yZXNvdXJjZXMvQ2F0ZWdvcmllcy9hY3Rpb25zL25ld1wiXHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgKyBBZGQgQ2F0ZWdvcnlcclxuICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWRhc2hib2FyZC1jYXJkc1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tY2FyZFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXJkLWxhYmVsXCI+VXNlcnM8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tY2FyZC12YWx1ZVwiPntzdW1tYXJ5LnVzZXJzfTwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhcmRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tY2FyZC1sYWJlbFwiPlByb2R1Y3RzPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhcmQtdmFsdWVcIj57c3VtbWFyeS5wcm9kdWN0c308L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXJkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhcmQtbGFiZWxcIj5PcmRlcnM8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tY2FyZC12YWx1ZVwiPntzdW1tYXJ5Lm9yZGVyc308L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXJkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhcmQtbGFiZWxcIj5DYXRlZ29yaWVzPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhcmQtdmFsdWVcIj5cclxuICAgICAgICAgICAgICAgIHtzdW1tYXJ5LmNhdGVnb3JpZXN9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWRhc2hib2FyZC1saW5rc1wiPlxyXG4gICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tbGlua1wiXHJcbiAgICAgICAgICAgICAgaHJlZj1cIi9hZG1pbi9yZXNvdXJjZXMvUHJvZHVjdHMvYWN0aW9ucy9saXN0XCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+UHJvZHVjdHM8L3N0cm9uZz5cclxuICAgICAgICAgICAgICBPcGVuIHByb2R1Y3QgbGlzdCBhbmQgbWFuYWdlIGludmVudG9yeS5cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tbGlua1wiXHJcbiAgICAgICAgICAgICAgaHJlZj1cIi9hZG1pbi9yZXNvdXJjZXMvT3JkZXJzL2FjdGlvbnMvbGlzdFwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8c3Ryb25nPk9yZGVyczwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIFJldmlldyBhbmQgcHJvY2VzcyBjdXN0b21lciBvcmRlcnMuXHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWxpbmtcIlxyXG4gICAgICAgICAgICAgIGhyZWY9XCIvYWRtaW4vcmVzb3VyY2VzL1VzZXJzL2FjdGlvbnMvbGlzdFwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8c3Ryb25nPlVzZXJzPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgVmlldyByZWdpc3RlcmVkIHVzZXJzIGFuZCByb2xlcy5cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLXBhbmVsXCIgc3R5bGU9e3sgcGFkZGluZzogXCIyMHB4XCIgfX0+XHJcbiAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLXNlY3Rpb24tdGl0bGVcIj5Qcm9kdWN0cyBUYWJsZTwvaDI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi10YWJsZS13cmFwXCI+XHJcbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tdGFibGVcIj5cclxuICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aD5JbWFnZTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aD5DYXRlZ29yeTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRoPlN0b2NrPC90aD5cclxuICAgICAgICAgICAgICAgICAgICA8dGg+UHJpY2U8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aD5TdGF0dXM8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aD5BY3Rpb248L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAge2FkbWluUHJvZHVjdFJvd3MubGVuZ3RoID8gKFxyXG4gICAgICAgICAgICAgICAgICAgIGFkbWluUHJvZHVjdFJvd3MubWFwKChwcm9kdWN0KSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtwcm9kdWN0LmlkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tdGh1bWItY2VsbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tdGh1bWJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXtwcm9kdWN0SW1hZ2UocHJvZHVjdCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHQ9e3Byb2R1Y3QubmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Byb2R1Y3QubmFtZX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Byb2R1Y3QuY2F0ZWdvcnlOYW1lIHx8IFwiLVwifTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57TnVtYmVyKHByb2R1Y3Quc3RvY2sgfHwgMCl9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntmb3JtYXRDdXJyZW5jeShwcm9kdWN0LnByaWNlKX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGNoYW5nZTgtYWRtaW4tc3RhdHVzLXBpbGwgJHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdC5pc0FjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJjaGFuZ2U4LWFkbWluLXN0YXR1cy1waWxsLS1hY3RpdmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJjaGFuZ2U4LWFkbWluLXN0YXR1cy1waWxsLS1pbmFjdGl2ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9YH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdC5pc0FjdGl2ZSA/IFwiQWN0aXZlXCIgOiBcIkluYWN0aXZlXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17Z2V0U2hvd0hyZWYocHJvZHVjdCl9PlZpZXc8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICkpXHJcbiAgICAgICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezd9IHN0eWxlPXt7IGNvbG9yOiBcIiM2NDc0OGJcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgTm8gcHJvZHVjdHMgYXZhaWxhYmxlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1wYW5lbFwiIHN0eWxlPXt7IHBhZGRpbmc6IFwiMjBweFwiIH19PlxyXG4gICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1zZWN0aW9uLXRpdGxlXCI+Q2F0ZWdvcmllczwvaDI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXRlZ29yeS1saXN0XCI+XHJcbiAgICAgICAgICAgICAge2NhdGVnb3J5UHJldmlldy5tYXAoKGNhdGVnb3J5KSA9PiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIGtleT17Y2F0ZWdvcnkubmFtZX1cclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXRlZ29yeS1pdGVtXCJcclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhdGVnb3J5LW5hbWVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIHtjYXRlZ29yeS5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tY2F0ZWdvcnktbWV0YVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgUHJvZHVjdHMgaW4gY2F0ZWdvcnlcclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogNzAwIH19PntjYXRlZ29yeS5jb3VudH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZFwiPlxyXG4gICAgICA8c3R5bGU+e2BcclxuICAgICAgICAuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZCB7XHJcbiAgICAgICAgICAtLWJnOiAjZjdmN2Y3O1xyXG4gICAgICAgICAgLS10ZXh0OiAjMTExMTExO1xyXG4gICAgICAgICAgLS1tdXRlZDogIzY2NjY2NjtcclxuICAgICAgICAgIC0tbGluZTogcmdiYSgxNywgMTcsIDE3LCAwLjA4KTtcclxuICAgICAgICAgIC0tYWNjZW50OiAjZmYyZDhiO1xyXG4gICAgICAgICAgLS1zdWNjZXNzOiAjNDVkMjU1O1xyXG4gICAgICAgICAgbWluLWhlaWdodDogMTAwdmg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZyk7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dCk7XHJcbiAgICAgICAgICBmb250LWZhbWlseTogXCJQb3BwaW5zXCIsIFwiU2Vnb2UgVUlcIiwgc2Fucy1zZXJpZjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNoZWxsIHtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC10b3Atc3RyaXAge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDojMEVBNUU5O1xyXG4gICAgICAgICAgY29sb3I6ICMwMDA7XHJcbiAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiA3cHggMTJweDtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjAxZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1uYXYge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogIzA1MDUwNTtcclxuICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciBhdXRvIDFmcjtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBnYXA6IDE2cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxOHB4IDI4cHg7XHJcbiAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgICB6LWluZGV4OiAzMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LW5hdi1saW5rcyB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgZmxleC13cmFwOiB3cmFwO1xyXG4gICAgICAgICAgZ2FwOiAyOHB4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1uYXYtdXNlci1kaXNwbGF5IHtcclxuICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGdhcDogMTBweDtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDM0cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiA4cHggMTRweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA4KTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xMik7XHJcbiAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMDJlbTtcclxuICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1uYXYtdXNlci1kaXNwbGF5OjpiZWZvcmUge1xyXG4gICAgICAgICAgY29udGVudDogXCJcIjtcclxuICAgICAgICAgIHdpZHRoOiA4cHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDhweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tYWNjZW50KTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDRweCByZ2JhKDI1NSwgNDUsIDEzOSwgMC4xNik7XHJcbiAgICAgICAgICBmbGV4OiAwIDAgYXV0bztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LW5hdi1saW5rcyBhIHtcclxuICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LW5hdi1saW5rcyBhLmlzLWFjdGl2ZSB7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tYWNjZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWJyYW5kIHtcclxuICAgICAgICAgIHdpZHRoOiA4NnB4O1xyXG4gICAgICAgICAgaGVpZ2h0OiA4NnB4O1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDM1JSAyOCUsICNmN2ZmNTkgMCUsICMxZWM2M2EgMzQlLCAjMTExIDEwMCUpO1xyXG4gICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTdweDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAwLjk1O1xyXG4gICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDI1cHggcmdiYSgwLCAwLCAwLCAwLjM1KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWJyYW5kIGltZyB7XHJcbiAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICAgIG9iamVjdC1maXQ6IGNvdmVyO1xyXG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1icmFuZCBzbWFsbCB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTBweDtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjEyZW07XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiA0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1uYXYtYWN0aW9ucyB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XHJcbiAgICAgICAgICBnYXA6IDE0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zZWFyY2gge1xyXG4gICAgICAgICAgd2lkdGg6IG1pbigxMDAlLCAyODBweCk7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGdhcDogMTJweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDEycHggMThweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogd2hpdGU7XHJcbiAgICAgICAgICBjb2xvcjogIzExMTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4wOCk7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMjBweCByZ2JhKDAsIDAsIDAsIDAuMTIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc2VhcmNoIHN2ZyB7XHJcbiAgICAgICAgICBmbGV4OiAwIDAgYXV0bztcclxuICAgICAgICAgIHN0cm9rZTogIzY2NjtcclxuICAgICAgICAgIG9wYWNpdHk6IDAuNztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNlYXJjaCBpbnB1dCB7XHJcbiAgICAgICAgICBib3JkZXI6IDA7XHJcbiAgICAgICAgICBvdXRsaW5lOiAwO1xyXG4gICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAtd2Via2l0LWJveC1zaGFkb3c6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGNvbG9yOiAjMTExO1xyXG4gICAgICAgICAgZm9udDogaW5oZXJpdDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIG1pbi13aWR0aDogMDtcclxuICAgICAgICAgIGFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgICAgICAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgICAgICAgICBjYXJldC1jb2xvcjogIzExMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNlYXJjaCBpbnB1dDo6cGxhY2Vob2xkZXIge1xyXG4gICAgICAgICAgY29sb3I6ICM5OTk7XHJcbiAgICAgICAgICBvcGFjaXR5OiAwLjg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zZWFyY2ggaW5wdXQ6LXdlYmtpdC1hdXRvZmlsbCxcclxuICAgICAgICAuY2hhbmdlOC1zZWFyY2ggaW5wdXQ6LXdlYmtpdC1hdXRvZmlsbDpob3ZlcixcclxuICAgICAgICAuY2hhbmdlOC1zZWFyY2ggaW5wdXQ6LXdlYmtpdC1hdXRvZmlsbDpmb2N1cyxcclxuICAgICAgICAuY2hhbmdlOC1zZWFyY2ggaW5wdXQ6LXdlYmtpdC1hdXRvZmlsbDphY3RpdmUge1xyXG4gICAgICAgICAgLXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6ICMxMTEgIWltcG9ydGFudDtcclxuICAgICAgICAgIC13ZWJraXQtYm94LXNoYWRvdzogMCAwIDAgMTAwMHB4ICNmZmYgaW5zZXQgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDEwMDBweCAjZmZmIGluc2V0ICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBjYXJldC1jb2xvcjogIzExMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWljb24ge1xyXG4gICAgICAgICAgd2lkdGg6IDM0cHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDM0cHg7XHJcbiAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYm9yZGVyOiAycHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkyKTtcclxuICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcnQtYnV0dG9uIHtcclxuICAgICAgICAgIHBhZGRpbmc6IDA7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXVzZXItZmFsbGJhY2sge1xyXG4gICAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgZ2FwOiAxMHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtdXNlci1mYWxsYmFjayAuY2hhbmdlOC1pY29uIHtcclxuICAgICAgICAgIGZsZXg6IDAgMCBhdXRvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtdXNlci1tZW51IHtcclxuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXVzZXItdG9nZ2xlIHtcclxuICAgICAgICAgIGFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMTIpO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA4KTtcclxuICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgcGFkZGluZzogOHB4IDE0cHg7XHJcbiAgICAgICAgICBtaW4taGVpZ2h0OiAzNHB4O1xyXG4gICAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgZ2FwOiAxMHB4O1xyXG4gICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgICAgZm9udDogaW5oZXJpdDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTNweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4wMmVtO1xyXG4gICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXVzZXItdG9nZ2xlOjpiZWZvcmUge1xyXG4gICAgICAgICAgY29udGVudDogXCJcIjtcclxuICAgICAgICAgIHdpZHRoOiA4cHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDhweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tYWNjZW50KTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDRweCByZ2JhKDI1NSwgNDUsIDEzOSwgMC4xNik7XHJcbiAgICAgICAgICBmbGV4OiAwIDAgYXV0bztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXVzZXItZHJvcGRvd24ge1xyXG4gICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgdG9wOiBjYWxjKDEwMCUgKyAxMHB4KTtcclxuICAgICAgICAgIHJpZ2h0OiAwO1xyXG4gICAgICAgICAgbWluLXdpZHRoOiAxNzBweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDE0cHggMTJweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjMGQxMzIwO1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEyKTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMThweCAzMHB4IHJnYmEoMCwgMCwgMCwgMC4zMik7XHJcbiAgICAgICAgICB6LWluZGV4OiAyMDtcclxuICAgICAgICAgIG92ZXJmbG93OiB2aXNpYmxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtbG9nb3V0LWJ1dHRvbiB7XHJcbiAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgIGJvcmRlcjogMDtcclxuICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICNmZjJkOGI7XHJcbiAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMTNweCAxNnB4O1xyXG4gICAgICAgICAgZm9udDogaW5oZXJpdDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTNweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4wMmVtO1xyXG4gICAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZCAwLjJzIGVhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1sb2dvdXQtYnV0dG9uOmhvdmVyIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICNmZjRhOWI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1sb2dvdXQtYnV0dG9uOmFjdGl2ZSB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmYxYTdjO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtaWNvbiBzdmcge1xyXG4gICAgICAgICAgd2lkdGg6IDE4cHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDE4cHg7XHJcbiAgICAgICAgICBzdHJva2U6IGN1cnJlbnRDb2xvcjtcclxuICAgICAgICAgIGZpbGw6IG5vbmU7XHJcbiAgICAgICAgICBzdHJva2Utd2lkdGg6IDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1iYWRnZSB7XHJcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICB0b3A6IC03cHg7XHJcbiAgICAgICAgICByaWdodDogLTdweDtcclxuICAgICAgICAgIG1pbi13aWR0aDogMTdweDtcclxuICAgICAgICAgIGhlaWdodDogMTdweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDAgNHB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmY2YjZiO1xyXG4gICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMHB4O1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPVwibGlnaHRcIl0gLmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQgLmNoYW5nZTgtbmF2IHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICNmM2Y0ZjY7XHJcbiAgICAgICAgICBjb2xvcjogIzExMTgyNztcclxuICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMDgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPVwibGlnaHRcIl0gLmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQgLmNoYW5nZTgtbmF2LWxpbmtzIGEge1xyXG4gICAgICAgICAgY29sb3I6ICMxMTE4Mjc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9XCJsaWdodFwiXSAuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZCAuY2hhbmdlOC1uYXYtbGlua3MgYS5pcy1hY3RpdmUge1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLWFjY2VudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9XCJsaWdodFwiXSAuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZCAuY2hhbmdlOC1pY29uIHtcclxuICAgICAgICAgIGNvbG9yOiAjMTExODI3O1xyXG4gICAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2JhKDE3LCAyNCwgMzksIDAuMik7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPVwibGlnaHRcIl0gLmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQgLmNoYW5nZTgtdXNlci10b2dnbGUge1xyXG4gICAgICAgICAgY29sb3I6ICMxMTE4Mjc7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xyXG4gICAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2JhKDE3LCAyNCwgMzksIDAuMTUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPVwibGlnaHRcIl0gLmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQgLmNoYW5nZTgtdXNlci1kcm9wZG93biB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xyXG4gICAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2JhKDE3LCAyNCwgMzksIDAuMTIpO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCAxMnB4IDI2cHggcmdiYSgxNSwgMjMsIDQyLCAwLjEyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNvbnRlbnQge1xyXG4gICAgICAgICAgZmxleDogMTtcclxuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgIHotaW5kZXg6IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1oZXJvIHtcclxuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDQ3MHB4O1xyXG4gICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmZmZmY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1oZXJvOjpiZWZvcmUge1xyXG4gICAgICAgICAgY29udGVudDogXCJcIjtcclxuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgIGluc2V0OiAwO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDAsIDAsIDAsIDAuMDgpIDAlLCByZ2JhKDAsIDAsIDAsIDAuMDMpIDQ2JSwgcmdiYSgwLCAwLCAwLCAwKSAxMDAlKTtcclxuICAgICAgICAgIHotaW5kZXg6IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1oZXJvLWltYWdlIHtcclxuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgIGluc2V0OiAwO1xyXG4gICAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiJHtoZXJvSW1hZ2V9XCIpO1xyXG4gICAgICAgICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcclxuICAgICAgICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcclxuICAgICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtaGVyby1jb3B5IHtcclxuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgIHotaW5kZXg6IDE7XHJcbiAgICAgICAgICB3aWR0aDogbWluKDEwMCUsIDU2MHB4KTtcclxuICAgICAgICAgIG1hcmdpbi1sZWZ0OiBhdXRvO1xyXG4gICAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgICBwYWRkaW5nOiAyNHB4IDM4cHggNTZweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWhlcm8tZXllYnJvdyB7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xOGVtO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBvcGFjaXR5OiAwLjk1O1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWhlcm8tdGl0bGUge1xyXG4gICAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgICAgZm9udC1zaXplOiBjbGFtcCg0MHB4LCA0Ljh2dywgNjZweCk7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMC45NTtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IC0wLjAzZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1oZXJvLXN1YnRpdGxlIHtcclxuICAgICAgICAgIG1hcmdpbjogMTJweCAwIDA7XHJcbiAgICAgICAgICBmb250LXNpemU6IGNsYW1wKDE4cHgsIDIuMnZ3LCAyOHB4KTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjM0ZW07XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgb3BhY2l0eTogMC45NTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWhlcm8tYnV0dG9uIHtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDMwcHg7XHJcbiAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICAgIG1pbi13aWR0aDogMTcwcHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxNnB4IDIycHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgICAgICAgIGJvcmRlcjogMDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gICAgICAgICAgY29sb3I6ICMxMTE7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE4cHg7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xNGVtO1xyXG4gICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDI1cHggcmdiYSgwLCAwLCAwLCAwLjIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc2xpZGVyLWFycm93IHtcclxuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgIHRvcDogNTAlO1xyXG4gICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xyXG4gICAgICAgICAgd2lkdGg6IDU0cHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDU0cHg7XHJcbiAgICAgICAgICBib3JkZXI6IDA7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICAgICAgICAgIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuODgpO1xyXG4gICAgICAgICAgZm9udC1zaXplOiA2NHB4O1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDE7XHJcbiAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICB6LWluZGV4OiAyO1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zbGlkZXItYXJyb3c6aG92ZXIge1xyXG4gICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc2xpZGVyLWFycm93LS1sZWZ0IHtcclxuICAgICAgICAgIGxlZnQ6IDhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNsaWRlci1hcnJvdy0tcmlnaHQge1xyXG4gICAgICAgICAgcmlnaHQ6IDhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNsaWRlci1kb3RzIHtcclxuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgIGxlZnQ6IDUwJTtcclxuICAgICAgICAgIGJvdHRvbTogMTJweDtcclxuICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcclxuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICBnYXA6IDEwcHg7XHJcbiAgICAgICAgICB6LWluZGV4OiAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc2xpZGVyLWRvdCB7XHJcbiAgICAgICAgICB3aWR0aDogMTZweDtcclxuICAgICAgICAgIGhlaWdodDogMTZweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgICAgICAgIGJvcmRlcjogMDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45Mik7XHJcbiAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zbGlkZXItZG90LmlzLWFjdGl2ZSB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjMzlkMzUzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZHVjdHMge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogd2hpdGU7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxMnB4IDAgMTBweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3RzLWhlYWQge1xyXG4gICAgICAgICAgcGFkZGluZzogMTBweCAxNHB4IDIwcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9kdWN0cy10aXRsZSB7XHJcbiAgICAgICAgICBtYXJnaW46IDA7XHJcbiAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICBmb250LXNpemU6IGNsYW1wKDI4cHgsIDN2dywgNDJweCk7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMTtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA4MDA7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1ncmlkIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCg1LCBtaW5tYXgoMCwgMWZyKSk7XHJcbiAgICAgICAgICBnYXA6IDE4cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAwIDE0cHggMThweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3QtY2FyZCB7XHJcbiAgICAgICAgICBjb2xvcjogIzExMTtcclxuICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3QtbWVkaWEge1xyXG4gICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgICAgYXNwZWN0LXJhdGlvOiAwLjk1O1xyXG4gICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICNlNWU3ZWI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LW1lZGlhIGltZyB7XHJcbiAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICAgIG9iamVjdC1maXQ6IGNvdmVyO1xyXG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1mYXZvcml0ZSB7XHJcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICB0b3A6IDEwcHg7XHJcbiAgICAgICAgICBsZWZ0OiAxMHB4O1xyXG4gICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAyMXB4O1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDE7XHJcbiAgICAgICAgICB0ZXh0LXNoYWRvdzogMCAxcHggNHB4IHJnYmEoMCwgMCwgMCwgMC4zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3QtbmFtZSB7XHJcbiAgICAgICAgICBtYXJnaW46IDEwcHggMCAwO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDEuMTI7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgbWluLWhlaWdodDogNDBweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3QtcHJpY2Uge1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogOHB4O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3QtcHJpY2UgcyB7XHJcbiAgICAgICAgICBjb2xvcjogIzY2NjtcclxuICAgICAgICAgIG1hcmdpbi1yaWdodDogNnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtZW1wdHksXHJcbiAgICAgICAgLmNoYW5nZTgtbG9hZGluZyB7XHJcbiAgICAgICAgICBtYXJnaW46IDAgMTRweCAxOHB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMjJweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBkYXNoZWQgcmdiYSgxNywgMTcsIDE3LCAwLjE4KTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC43KTtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1tdXRlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogMTIwMHB4KSB7XHJcbiAgICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LWdyaWQge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgzLCBtaW5tYXgoMCwgMWZyKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogODIwcHgpIHtcclxuICAgICAgICAgIC5jaGFuZ2U4LW5hdiB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gICAgICAgICAgICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbmF2LWxpbmtzIHtcclxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGdhcDogMThweDtcclxuICAgICAgICAgICAgZmxleC13cmFwOiB3cmFwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LW5hdi1hY3Rpb25zIHtcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgICAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbmF2LXVzZXItZGlzcGxheSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1oZXJvLWNvcHkge1xyXG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgICAgcGFkZGluZzogMjJweCAyMHB4IDU2cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1ncmlkIHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDAsIDFmcikpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXNsaWRlci1hcnJvdyB7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogNDRweDtcclxuICAgICAgICAgICAgd2lkdGg6IDQwcHg7XHJcbiAgICAgICAgICAgIGhlaWdodDogNDBweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1zbGlkZXItYXJyb3ctLWxlZnQge1xyXG4gICAgICAgICAgICBsZWZ0OiA0cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtc2xpZGVyLWFycm93LS1yaWdodCB7XHJcbiAgICAgICAgICAgIHJpZ2h0OiA0cHg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNTYwcHgpIHtcclxuICAgICAgICAgIC5jaGFuZ2U4LW5hdiB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDE0cHggMTZweCAxNnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWJyYW5kIHtcclxuICAgICAgICAgICAgd2lkdGg6IDcycHg7XHJcbiAgICAgICAgICAgIGhlaWdodDogNzJweDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXNlYXJjaCB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWhlcm8ge1xyXG4gICAgICAgICAgICBtaW4taGVpZ2h0OiA0MjBweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1oZXJvLXRpdGxlIHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgzMnB4LCAxMnZ3LCA0OHB4KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1oZXJvLXN1YnRpdGxlIHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4yNGVtO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWhlcm8tYnV0dG9uIHtcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1ncmlkIHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBgfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtc2hlbGxcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtdG9wLXN0cmlwXCI+XHJcbiAgICAgICAgICBGUkVFIFNISVBQSU5HIG5vdyBhdmFpbGFibGUgaW4gU3JpIExhbmthXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJjaGFuZ2U4LW5hdlwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW5hdi1saW5rc1wiIGFyaWEtbGFiZWw9XCJQcmltYXJ5XCI+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCIjaGVyb1wiIGNsYXNzTmFtZT1cImlzLWFjdGl2ZVwiPlxyXG4gICAgICAgICAgICAgIEhvbWVcclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiL2FkbWluL3Jlc291cmNlcy9Qcm9kdWN0cy9hY3Rpb25zL2xpc3RcIj5Qcm9kdWN0PC9hPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiL2FkbWluL3BhZ2VzL0Fib3V0XCI+QWJvdXQ8L2E+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCIjY29udGFjdFwiPkNvbnRhY3QgVXM8L2E+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYnJhbmRcIiBhcmlhLWxhYmVsPVwiU3RvcmUgYnJhbmRcIj5cclxuICAgICAgICAgICAgPGltZyBzcmM9XCIvcHVibGljL2ljb24ucG5nXCIgYWx0PVwiU3RvcmUgbG9nb1wiIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbmF2LWFjdGlvbnNcIj5cclxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNoYW5nZTgtc2VhcmNoXCIgaHRtbEZvcj1cImNoYW5nZTgtc2VhcmNoLWlucHV0XCI+XHJcbiAgICAgICAgICAgICAgPHN2Z1xyXG4gICAgICAgICAgICAgICAgd2lkdGg9XCIxOFwiXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ9XCIxOFwiXHJcbiAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcclxuICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcclxuICAgICAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXHJcbiAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjJcIlxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCIxMVwiIGN5PVwiMTFcIiByPVwiN1wiIC8+XHJcbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTIwIDIwbC0zLjUtMy41XCIgLz5cclxuICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgIGlkPVwiY2hhbmdlOC1zZWFyY2gtaW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgdHlwZT1cInNlYXJjaFwiXHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBQcm9kdWN0c1wiXHJcbiAgICAgICAgICAgICAgICB2YWx1ZT17c2VhcmNoVGVybX1cclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldFNlYXJjaFRlcm0oZXZlbnQudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L2xhYmVsPlxyXG5cclxuICAgICAgICAgICAge2N1cnJlbnRVc2VyTmFtZSA/IChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtdXNlci1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LXVzZXItdG9nZ2xlXCJcclxuICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIkxvZ2dlZCBpbiB1c2VyIG1lbnVcIlxyXG4gICAgICAgICAgICAgICAgICBhcmlhLWV4cGFuZGVkPXtpc1VzZXJNZW51T3Blbn1cclxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0SXNVc2VyTWVudU9wZW4oKHByZXZpb3VzKSA9PiAhcHJldmlvdXMpO1xyXG4gICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICB7Y3VycmVudFVzZXJOYW1lfVxyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgICAgICAgICAge2lzVXNlck1lbnVPcGVuID8gKFxyXG4gICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC11c2VyLWRyb3Bkb3duXCJcclxuICAgICAgICAgICAgICAgICAgICByb2xlPVwibWVudVwiXHJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGV2ZW50KSA9PiBldmVudC5zdG9wUHJvcGFnYXRpb24oKX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1sb2dvdXQtYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0SXNVc2VyTWVudU9wZW4oZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2FkbWluL2xvZ291dFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICBMb2dvdXRcclxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApIDogbnVsbH1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtdXNlci1mYWxsYmFja1wiIGFyaWEtbGFiZWw9XCJBY2NvdW50XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtaWNvblwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjhcIiByPVwiNFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk00IDIwYzEuOC00LjIgNS02IDgtNnM2LjIgMS44IDggNlwiIC8+XHJcbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtaWNvblwiIGFyaWEtbGFiZWw9XCJXaXNobGlzdFwiPlxyXG4gICAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiPlxyXG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xMiAyMXMtNy00LjYtOS4yLTkuMkMuOCA4LjIgMi40IDUgNS44IDVjMS44IDAgMy4yIDEgNC4yIDIuMkMxMSA2IDEyLjUgNSAxNC4yIDVjMy40IDAgNSAzLjIgMyA2LjhDMTkgMTYuNCAxMiAyMSAxMiAyMXpcIiAvPlxyXG4gICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LWljb24gY2hhbmdlOC1jYXJ0LWJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIkNhcnRcIlxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24ob3JkZXJzTGlzdEhyZWYpO1xyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cclxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMyA0aDJsMi4yIDExLjNBMiAyIDAgMCAwIDkuMiAxN0gxOGEyIDIgMCAwIDAgMi0xLjZsMS4xLTYuNEg2LjFcIiAvPlxyXG4gICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjlcIiBjeT1cIjIwXCIgcj1cIjEuNVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PVwiMTdcIiBjeT1cIjIwXCIgcj1cIjEuNVwiIC8+XHJcbiAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY2hhbmdlOC1iYWRnZVwiPlxyXG4gICAgICAgICAgICAgICAge01hdGgubWF4KDAsIE51bWJlcihzdW1tYXJ5Py5vcmRlcnMgfHwgMCkpfVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2hlYWRlcj5cclxuICAgICAgICA8bWFpbiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNvbnRlbnRcIj5cclxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNoYW5nZTgtaGVyb1wiIGlkPVwiaGVyb1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtaGVyby1pbWFnZVwiIC8+XHJcblxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1zbGlkZXItYXJyb3cgY2hhbmdlOC1zbGlkZXItYXJyb3ctLWxlZnRcIlxyXG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJQcmV2aW91cyBzbGlkZVwiXHJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFoZXJvU2xpZGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2V0Q3VycmVudFNsaWRlKChwcmV2aW91cykgPT5cclxuICAgICAgICAgICAgICAgICAgcHJldmlvdXMgPT09IDAgPyBoZXJvU2xpZGVzLmxlbmd0aCAtIDEgOiBwcmV2aW91cyAtIDEsXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICDigLlcclxuICAgICAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1zbGlkZXItYXJyb3cgY2hhbmdlOC1zbGlkZXItYXJyb3ctLXJpZ2h0XCJcclxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmV4dCBzbGlkZVwiXHJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFoZXJvU2xpZGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2V0Q3VycmVudFNsaWRlKFxyXG4gICAgICAgICAgICAgICAgICAocHJldmlvdXMpID0+IChwcmV2aW91cyArIDEpICUgaGVyb1NsaWRlcy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICDigLpcclxuICAgICAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtaGVyby1jb3B5XCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWhlcm8tZXllYnJvd1wiPk5ldyBzZWFzb24gZHJvcDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJjaGFuZ2U4LWhlcm8tdGl0bGVcIj57aGVyb1RpdGxlfTwvaDE+XHJcbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiY2hhbmdlOC1oZXJvLXN1YnRpdGxlXCI+e2hlcm9TdWJ0aXRsZX08L3A+XHJcbiAgICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgIGhyZWY9e2hlcm9IcmVmIHx8IFwiI3Byb2R1Y3RzXCJ9XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LWhlcm8tYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoIWhlcm9IcmVmKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICBTaG9wIE5vd1xyXG4gICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1zbGlkZXItZG90c1wiXHJcbiAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIkNhcm91c2VsIG5hdmlnYXRpb25cIlxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAge2hlcm9TbGlkZXMubWFwKChzbGlkZSwgaW5kZXgpID0+IChcclxuICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAga2V5PXtzbGlkZS5pZCB8fCBgJHtzbGlkZS5uYW1lfS0ke2luZGV4fWB9XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BjaGFuZ2U4LXNsaWRlci1kb3QgJHtpbmRleCA9PT0gY3VycmVudFNsaWRlID8gXCJpcy1hY3RpdmVcIiA6IFwiXCJ9YH1cclxuICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YEdvIHRvIHNsaWRlICR7aW5kZXggKyAxfWB9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEN1cnJlbnRTbGlkZShpbmRleCl9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvc2VjdGlvbj5cclxuXHJcbiAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3RzXCIgaWQ9XCJwcm9kdWN0c1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdHMtaGVhZFwiPlxyXG4gICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3RzLXRpdGxlXCI+T3VyIFByb2R1Y3RzPC9oMj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICB7bG9hZGluZyA/IChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbG9hZGluZ1wiPkxvYWRpbmcgcHJvZHVjdHMuLi48L2Rpdj5cclxuICAgICAgICAgICAgKSA6IHNwb3RsaWdodFByb2R1Y3RzLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtZW1wdHlcIj5ObyBwcm9kdWN0cyBmb3VuZC48L2Rpdj5cclxuICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdC1ncmlkXCI+XHJcbiAgICAgICAgICAgICAgICB7c3BvdGxpZ2h0UHJvZHVjdHMubWFwKChwcm9kdWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGhyZWYgPSBnZXRTaG93SHJlZihwcm9kdWN0KTtcclxuICAgICAgICAgICAgICAgICAgY29uc3QgaW1hZ2UgPSBwcm9kdWN0SW1hZ2UocHJvZHVjdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxhcnRpY2xlIGtleT17cHJvZHVjdC5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3QtY2FyZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY9e2hyZWYgfHwgXCIjXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaHJlZikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LW1lZGlhXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge2ltYWdlID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e2ltYWdlfSBhbHQ9e3Byb2R1Y3QubmFtZX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzExMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDgwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIyMnB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGluZWFyLWdyYWRpZW50KDEzNWRlZywgI2RiZWFmZSwgI2ZjZTdmMylcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3Byb2R1Y3RMYWJlbChwcm9kdWN0KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY2hhbmdlOC1mYXZvcml0ZVwiPuKZoTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LW5hbWVcIj57cHJvZHVjdC5uYW1lfTwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LXByaWNlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHM+e2Zvcm1hdEN1cnJlbmN5KHByb2R1Y3QucHJpY2UgKiAxLjE0KX08L3M+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdEN1cnJlbmN5KHByb2R1Y3QucHJpY2UpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICA8L21haW4+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZDtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IFJlZ2lzdGVyID0gKCkgPT4ge1xyXG4gIGNvbnN0IFtmb3JtU3RhdGUsIHNldEZvcm1TdGF0ZV0gPSB1c2VTdGF0ZSh7XHJcbiAgICBuYW1lOiBcIlwiLFxyXG4gICAgZW1haWw6IFwiXCIsXHJcbiAgICBwYXNzd29yZDogXCJcIixcclxuICB9KTtcclxuICBjb25zdCBbbWVzc2FnZSwgc2V0TWVzc2FnZV0gPSB1c2VTdGF0ZSh7IHR5cGU6IFwiXCIsIHRleHQ6IFwiXCIgfSk7XHJcbiAgY29uc3QgW2lzU3VibWl0dGluZywgc2V0SXNTdWJtaXR0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUubWFyZ2luID0gXCIwXCI7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCBoYW5kbGVDaGFuZ2UgPSAoZXZlbnQpID0+IHtcclxuICAgIHNldEZvcm1TdGF0ZSgoY3VycmVudCkgPT4gKHtcclxuICAgICAgLi4uY3VycmVudCxcclxuICAgICAgW2V2ZW50LnRhcmdldC5uYW1lXTogZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgfSkpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZVN1Ym1pdCA9IGFzeW5jIChldmVudCkgPT4ge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIHNldE1lc3NhZ2UoeyB0eXBlOiBcIlwiLCB0ZXh0OiBcIlwiIH0pO1xyXG4gICAgc2V0SXNTdWJtaXR0aW5nKHRydWUpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvYXBpL3JlZ2lzdGVyXCIsIHtcclxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZm9ybVN0YXRlKSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLm1lc3NhZ2UgfHwgXCJSZWdpc3RyYXRpb24gZmFpbGVkXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZXRNZXNzYWdlKHtcclxuICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcclxuICAgICAgICB0ZXh0OiBcIkFjY291bnQgY3JlYXRlZCBzdWNjZXNzZnVsbHkhIFJlZGlyZWN0aW5nLi4uXCIsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9hZG1pbi9sb2dpblwiO1xyXG4gICAgICB9LCAyMDAwKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHNldE1lc3NhZ2UoeyB0eXBlOiBcImVycm9yXCIsIHRleHQ6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICAgIHNldElzU3VibWl0dGluZyhmYWxzZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItcGFnZVwiPlxyXG4gICAgICA8c3R5bGU+e2BcclxuICAgICAgICAucmVnaXN0ZXItcGFnZSB7XHJcbiAgICAgICAgICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgICBwYWRkaW5nOiAyNHB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDpcclxuICAgICAgICAgICAgbGluZWFyLWdyYWRpZW50KHJnYmEoMTUsIDIzLCA0MiwgMC4zNSksIHJnYmEoMTUsIDIzLCA0MiwgMC4zNSkpLFxyXG4gICAgICAgICAgICB1cmwoJy9wdWJsaWMvaW1nMi5qcGcnKSBjZW50ZXIgLyBjb3ZlciBmaXhlZDtcclxuICAgICAgICAgIGZvbnQtZmFtaWx5OiBcIlBsdXMgSmFrYXJ0YSBTYW5zXCIsIFwiU2Vnb2UgVUlcIiwgc2Fucy1zZXJpZjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1jYXJkIHtcclxuICAgICAgICAgIHdpZHRoOiBtaW4oMTAwJSwgNTIwcHgpO1xyXG4gICAgICAgICAgcGFkZGluZzogNjBweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDI4cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDE1LCAyMywgNDIsIDAuODIpO1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCA1MHB4IDEwMHB4IC0yMHB4IHJnYmEoMCwgMCwgMCwgMC44KTtcclxuICAgICAgICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cigzMHB4KTtcclxuICAgICAgICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWxvZ28ge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMzBweDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMjRweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA4MDA7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogLTAuMDFlbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1sb2dvIHNwYW4ge1xyXG4gICAgICAgICAgY29sb3I6ICM2MzY2ZjE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItZmllbGQge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1sYWJlbCB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcbiAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMWVtO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItaW5wdXQge1xyXG4gICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxNHB4IDE4cHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KTtcclxuICAgICAgICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgICAgICAgb3V0bGluZTogbm9uZTtcclxuICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItaW5wdXQ6Zm9jdXMge1xyXG4gICAgICAgICAgYm9yZGVyLWNvbG9yOiAjNjM2NmYxO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA4KTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDRweCByZ2JhKDk5LCAxMDIsIDI0MSwgMC4yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1idXR0b24ge1xyXG4gICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAxMHB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMTZweDtcclxuICAgICAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNjM2NmYxLCAjYTg1NWY3KTtcclxuICAgICAgICAgIGNvbG9yOiAjZmZmO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMTBweCAyNXB4IC01cHggcmdiYSg5OSwgMTAyLCAyNDEsIDAuNCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItYnV0dG9uOmRpc2FibGVkIHtcclxuICAgICAgICAgIG9wYWNpdHk6IDAuNjtcclxuICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbWVzc2FnZSB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMTJweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLW1lc3NhZ2UuaXMtdmlzaWJsZSB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1tZXNzYWdlLmVycm9yIHtcclxuICAgICAgICAgIGNvbG9yOiAjZjg3MTcxO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyMzksIDY4LCA2OCwgMC4xKTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjM5LCA2OCwgNjgsIDAuMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbWVzc2FnZS5zdWNjZXNzIHtcclxuICAgICAgICAgIGNvbG9yOiAjNGFkZTgwO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgzNCwgMTk3LCA5NCwgMC4xKTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMzQsIDE5NywgOTQsIDAuMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItZm9vdGVyIHtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDI1cHg7XHJcbiAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWZvb3RlciBhIHtcclxuICAgICAgICAgIGNvbG9yOiAjNjM2NmYxO1xyXG4gICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1mb290ZXIgYTpob3ZlciB7XHJcbiAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA4NTBweCkge1xyXG4gICAgICAgICAgLnJlZ2lzdGVyLWNhcmQge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiA0MHB4O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgYH08L3N0eWxlPlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWdpc3Rlci1jYXJkXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWdpc3Rlci1sb2dvXCI+UmVnaXN0ZXIgb3VyIHNpdGU8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdlxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtgcmVnaXN0ZXItbWVzc2FnZSAke21lc3NhZ2UudHlwZX0gJHtcclxuICAgICAgICAgICAgbWVzc2FnZS50ZXh0ID8gXCJpcy12aXNpYmxlXCIgOiBcIlwiXHJcbiAgICAgICAgICB9YH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7bWVzc2FnZS50ZXh0fVxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlU3VibWl0fT5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItZmllbGRcIj5cclxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWxhYmVsXCIgaHRtbEZvcj1cIm5hbWVcIj5cclxuICAgICAgICAgICAgICBGdWxsIE5hbWVcclxuICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmVnaXN0ZXItaW5wdXRcIlxyXG4gICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICBpZD1cIm5hbWVcIlxyXG4gICAgICAgICAgICAgIG5hbWU9XCJuYW1lXCJcclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIHlvdXIgZnVsbCBuYW1lXCJcclxuICAgICAgICAgICAgICB2YWx1ZT17Zm9ybVN0YXRlLm5hbWV9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cclxuICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWdpc3Rlci1maWVsZFwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwicmVnaXN0ZXItbGFiZWxcIiBodG1sRm9yPVwiZW1haWxcIj5cclxuICAgICAgICAgICAgICBFbWFpbCBBZGRyZXNzXHJcbiAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWlucHV0XCJcclxuICAgICAgICAgICAgICB0eXBlPVwiZW1haWxcIlxyXG4gICAgICAgICAgICAgIGlkPVwiZW1haWxcIlxyXG4gICAgICAgICAgICAgIG5hbWU9XCJlbWFpbFwiXHJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJleGFtcGxlQGVtYWlsLmNvbVwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1TdGF0ZS5lbWFpbH1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxyXG4gICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLWZpZWxkXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJyZWdpc3Rlci1sYWJlbFwiIGh0bWxGb3I9XCJwYXNzd29yZFwiPlxyXG4gICAgICAgICAgICAgIFBhc3N3b3JkXHJcbiAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWlucHV0XCJcclxuICAgICAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxyXG4gICAgICAgICAgICAgIGlkPVwicGFzc3dvcmRcIlxyXG4gICAgICAgICAgICAgIG5hbWU9XCJwYXNzd29yZFwiXHJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJBdCBsZWFzdCA2IGNoYXJhY3RlcnNcIlxyXG4gICAgICAgICAgICAgIG1pbkxlbmd0aD17Nn1cclxuICAgICAgICAgICAgICB2YWx1ZT17Zm9ybVN0YXRlLnBhc3N3b3JkfVxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XHJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicmVnaXN0ZXItYnV0dG9uXCJcclxuICAgICAgICAgICAgdHlwZT1cInN1Ym1pdFwiXHJcbiAgICAgICAgICAgIGRpc2FibGVkPXtpc1N1Ym1pdHRpbmd9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHtpc1N1Ym1pdHRpbmcgPyBcIkNyZWF0aW5nIGFjY291bnQuLi5cIiA6IFwiQ3JlYXRlIEFjY291bnRcIn1cclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZm9ybT5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWdpc3Rlci1mb290ZXJcIj5cclxuICAgICAgICAgIEFscmVhZHkgaGF2ZSBhbiBhY2NvdW50PyA8YSBocmVmPVwiL2FkbWluL2xvZ2luXCI+TG9nIGluPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RlcjtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IGdyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcInJlcGVhdChhdXRvLWZpbGwsIG1pbm1heCgyNDBweCwgMWZyKSlcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgY2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxNnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjgpXCIsXHJcbiAgYmFja2dyb3VuZDogXCJsaW5lYXItZ3JhZGllbnQoMTYwZGVnLCAjMGIxYTM4IDAlLCAjMDkxNjJmIDEwMCUpXCIsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG4gIG92ZXJmbG93OiBcImhpZGRlblwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDEycHggMjJweCByZ2JhKDIsIDYsIDIzLCAwLjI1KVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VXcmFwU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIGhlaWdodDogXCIyMDBweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgcGFkZGluZzogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvbnRhaW5cIixcclxufTtcclxuXHJcbmNvbnN0IGJvZHlTdHlsZSA9IHtcclxuICBwYWRkaW5nOiBcIjE0cHhcIixcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBtZXRhU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbn07XHJcblxyXG5jb25zdCBiYWRnZVN0eWxlID0gKGlzQWN0aXZlKSA9PiAoe1xyXG4gIHdpZHRoOiBcImZpdC1jb250ZW50XCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDVlbVwiLFxyXG4gIHBhZGRpbmc6IFwiNXB4IDEwcHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiOTk5cHhcIixcclxuICBjb2xvcjogaXNBY3RpdmUgPyBcIiMxNDUzMmRcIiA6IFwiIzdmMWQxZFwiLFxyXG4gIGJhY2tncm91bmQ6IGlzQWN0aXZlID8gXCIjYmJmN2QwXCIgOiBcIiNmZWNhY2FcIixcclxufSk7XHJcblxyXG5jb25zdCBsaW5rU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtYmxvY2tcIixcclxuICBtYXJnaW5Ub3A6IFwiNHB4XCIsXHJcbiAgY29sb3I6IFwiIzkzYzVmZFwiLFxyXG4gIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgZm9udFdlaWdodDogNjAwLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBlbXB0eVN0eWxlID0ge1xyXG4gIHBhZGRpbmc6IFwiMThweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjQ1KVwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdFByaWNlID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgYW1vdW50ID0gTnVtYmVyKHZhbHVlIHx8IDApO1xyXG4gIGlmICghTnVtYmVyLmlzRmluaXRlKGFtb3VudCkpIHtcclxuICAgIHJldHVybiBcIjAuMDBcIjtcclxuICB9XHJcblxyXG4gIHJldHVybiBhbW91bnQudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBnZXRSZWNvcmRJZCA9IChyZWNvcmQpID0+IHtcclxuICByZXR1cm4gcmVjb3JkPy5wYXJhbXM/LmlkIHx8IHJlY29yZD8uaWQgfHwgcmVjb3JkPy5wYXJhbT8uaWQgfHwgXCJcIjtcclxufTtcclxuXHJcbmNvbnN0IGdldFNob3dIcmVmID0gKHJlY29yZCwgcmVzb3VyY2VJZCkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZEFjdGlvbnMgPSByZWNvcmQ/LnJlY29yZEFjdGlvbnMgfHwgcmVjb3JkPy5hY3Rpb25zIHx8IFtdO1xyXG4gIGNvbnN0IHNob3dBY3Rpb24gPSByZWNvcmRBY3Rpb25zLmZpbmQoKGFjdGlvbikgPT4gYWN0aW9uPy5uYW1lID09PSBcInNob3dcIik7XHJcbiAgY29uc3QgcmF3SHJlZiA9IHNob3dBY3Rpb24/LmhyZWYgfHwgcmVjb3JkPy5ocmVmIHx8IFwiXCI7XHJcblxyXG4gIGlmIChyYXdIcmVmKSB7XHJcbiAgICByZXR1cm4gcmF3SHJlZjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGlkID0gZ2V0UmVjb3JkSWQocmVjb3JkKTtcclxuICByZXR1cm4gaWRcclxuICAgID8gYC9hZG1pbi9yZXNvdXJjZXMvJHtlbmNvZGVVUklDb21wb25lbnQocmVzb3VyY2VJZCl9L3JlY29yZHMvJHtlbmNvZGVVUklDb21wb25lbnQoaWQpfS9zaG93YFxyXG4gICAgOiBcIlwiO1xyXG59O1xyXG5cclxuY29uc3QgUHJvZHVjdENhcmRzTGlzdCA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnN0IFthcGlSZWNvcmRzLCBzZXRBcGlSZWNvcmRzXSA9IHVzZVN0YXRlKFtdKTtcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgW2xvYWRFcnJvciwgc2V0TG9hZEVycm9yXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG5cclxuICBjb25zdCByZXNvdXJjZUlkID1cclxuICAgIHByb3BzPy5yZXNvdXJjZT8uaWQgPT09IFwiUHJvZHVjdFwiXHJcbiAgICAgID8gXCJQcm9kdWN0c1wiXHJcbiAgICAgIDogcHJvcHM/LnJlc291cmNlPy5pZCB8fCBcIlByb2R1Y3RzXCI7XHJcbiAgY29uc3QgcHJvcFJlY29yZHMgPSBwcm9wcz8ucmVjb3JkcyB8fCBbXTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChwcm9wUmVjb3Jkcy5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBpc01vdW50ZWQgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IGxvYWRSZWNvcmRzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICBzZXRMb2FkaW5nKHRydWUpO1xyXG4gICAgICBzZXRMb2FkRXJyb3IoXCJcIik7XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgICAgICBgL2FkbWluL2FwaS9yZXNvdXJjZXMvJHtlbmNvZGVVUklDb21wb25lbnQocmVzb3VyY2VJZCl9L2FjdGlvbnMvbGlzdGAsXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihwYXlsb2FkPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgcHJvZHVjdHNcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXNNb3VudGVkKSB7XHJcbiAgICAgICAgICBzZXRBcGlSZWNvcmRzKHBheWxvYWQ/LnJlY29yZHMgfHwgW10pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBpZiAoaXNNb3VudGVkKSB7XHJcbiAgICAgICAgICBzZXRMb2FkRXJyb3IoZXJyb3I/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gbG9hZCBwcm9kdWN0c1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWRSZWNvcmRzKCk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgaXNNb3VudGVkID0gZmFsc2U7XHJcbiAgICB9O1xyXG4gIH0sIFtwcm9wUmVjb3Jkcy5sZW5ndGgsIHJlc291cmNlSWRdKTtcclxuXHJcbiAgY29uc3QgcmVjb3JkcyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgcmV0dXJuIHByb3BSZWNvcmRzLmxlbmd0aCA/IHByb3BSZWNvcmRzIDogYXBpUmVjb3JkcztcclxuICB9LCBbcHJvcFJlY29yZHMsIGFwaVJlY29yZHNdKTtcclxuXHJcbiAgaWYgKGxvYWRpbmcpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5Mb2FkaW5nIHByb2R1Y3RzLi4uPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKGxvYWRFcnJvcikge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9Pntsb2FkRXJyb3J9PC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKCFyZWNvcmRzLmxlbmd0aCkge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9Pk5vIHByb2R1Y3RzIGZvdW5kLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtncmlkU3R5bGV9PlxyXG4gICAgICB7cmVjb3Jkcy5tYXAoKHJlY29yZCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9O1xyXG4gICAgICAgIGNvbnN0IGlkID0gZ2V0UmVjb3JkSWQocmVjb3JkKTtcclxuICAgICAgICBjb25zdCBuYW1lID0gcGFyYW1zPy5uYW1lIHx8IFwiVW5uYW1lZCBwcm9kdWN0XCI7XHJcbiAgICAgICAgY29uc3QgY2F0ZWdvcnkgPSBwYXJhbXM/LmNhdGVnb3J5SWQgfHwgXCItXCI7XHJcbiAgICAgICAgY29uc3QgaW1hZ2VVcmwgPSBwYXJhbXM/LmltYWdlVXJsIHx8IFwiXCI7XHJcbiAgICAgICAgY29uc3Qgc3RvY2sgPSBOdW1iZXIocGFyYW1zPy5zdG9jayB8fCAwKTtcclxuICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IEJvb2xlYW4ocGFyYW1zPy5pc0FjdGl2ZSk7XHJcbiAgICAgICAgY29uc3QgZGV0YWlsc0hyZWYgPSBnZXRTaG93SHJlZihyZWNvcmQsIHJlc291cmNlSWQpO1xyXG4gICAgICAgIGNvbnN0IG9wZW5EZXRhaWxzID0gKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGRldGFpbHNIcmVmKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oZGV0YWlsc0hyZWYpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICA8YXJ0aWNsZSBrZXk9e2lkfSBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW1hZ2VXcmFwU3R5bGV9PlxyXG4gICAgICAgICAgICAgIHtpbWFnZVVybCA/IChcclxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtpbWFnZVVybH0gYWx0PXtuYW1lfSBzdHlsZT17aW1hZ2VTdHlsZX0gLz5cclxuICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICBObyBpbWFnZVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtib2R5U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6IFwiMThweFwiLCBmb250V2VpZ2h0OiA3MDAgfX0+e25hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17bWV0YVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXY+Q2F0ZWdvcnk6IHtjYXRlZ29yeX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXY+U3RvY2s6IHtzdG9ja308L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXY+UHJpY2U6IFJzLiB7Zm9ybWF0UHJpY2UocGFyYW1zPy5wcmljZSl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2JhZGdlU3R5bGUoaXNBY3RpdmUpfT5cclxuICAgICAgICAgICAgICAgIHtpc0FjdGl2ZSA/IFwiQUNUSVZFXCIgOiBcIklOQUNUSVZFXCJ9XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgICAgICBocmVmPXtkZXRhaWxzSHJlZiB8fCBcIiNcIn1cclxuICAgICAgICAgICAgICAgIHN0eWxlPXtsaW5rU3R5bGV9XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgb3BlbkRldGFpbHMoKTtcclxuICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICBhcmlhLWRpc2FibGVkPXshZGV0YWlsc0hyZWZ9XHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgVmlldyBkZXRhaWxzXHJcbiAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICApO1xyXG4gICAgICB9KX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0Q2FyZHNMaXN0O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgcGFnZVN0eWxlID0ge1xyXG4gIG1pbkhlaWdodDogXCIxMDAlXCIsXHJcbiAgcGFkZGluZzogXCIyNHB4XCIsXHJcbiAgY29sb3I6IFwiIzExMTgyN1wiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2ZmZmZmZlwiLFxyXG59O1xyXG5cclxuY29uc3QgdG9wQmFyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxuICBtYXJnaW5Cb3R0b206IFwiMThweFwiLFxyXG4gIGZsZXhXcmFwOiBcIndyYXBcIixcclxufTtcclxuXHJcbmNvbnN0IGJhY2tMaW5rU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiIzExMTgyN1wiLFxyXG4gIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIixcclxuICBkaXNwbGF5OiBcImlubGluZS1mbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTRweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxufTtcclxuXHJcbmNvbnN0IGxheW91dFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwibWlubWF4KDMyMHB4LCAxLjA1ZnIpIG1pbm1heCgzNjBweCwgMC45NWZyKVwiLFxyXG4gIGdhcDogXCIxOHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJzdGFydFwiLFxyXG59O1xyXG5cclxuY29uc3QgY2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIyMnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMDgpXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZmZmZmZmXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMThweCAzNHB4IHJnYmEoMTUsIDIzLCA0MiwgMC4wOClcIixcclxuICBvdmVyZmxvdzogXCJoaWRkZW5cIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlQ2FyZFN0eWxlID0ge1xyXG4gIC4uLmNhcmRTdHlsZSxcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVSb3dzOiBcIjFmciBhdXRvXCIsXHJcbiAgbWluSGVpZ2h0OiBcIjUwMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVdyYXBTdHlsZSA9IHtcclxuICBiYWNrZ3JvdW5kOiBcIiNmOGZhZmNcIixcclxuICBtaW5IZWlnaHQ6IFwiMzQwcHhcIixcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBwbGFjZUl0ZW1zOiBcImNlbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBkaXNwbGF5OiBcImJsb2NrXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZUZhbGxiYWNrU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgcGxhY2VJdGVtczogXCJjZW50ZXJcIixcclxuICBjb2xvcjogXCIjNjQ3NDhiXCIsXHJcbiAgYmFja2dyb3VuZDogXCJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjZjhmYWZjIDAlLCAjZWVmMmZmIDEwMCUpXCIsXHJcbiAgZm9udFNpemU6IFwiMTRweFwiLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4wOGVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlRm9vdGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBwYWRkaW5nOiBcIjE2cHggMThweCAxOHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZmZmZmZmXCIsXHJcbiAgYm9yZGVyVG9wOiBcIjFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMDgpXCIsXHJcbiAgZmxleFdyYXA6IFwid3JhcFwiLFxyXG59O1xyXG5cclxuY29uc3QgdGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgZm9udFNpemU6IFwiY2xhbXAoMzBweCwgNHZ3LCA1NHB4KVwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcImNhcGl0YWxpemVcIixcclxufTtcclxuXHJcbmNvbnN0IHN1YnRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiBcIjhweCAwIDBcIixcclxuICBjb2xvcjogXCIjNmI3MjgwXCIsXHJcbiAgZm9udFNpemU6IFwiMTRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgcGlsbFN0eWxlID0gKGFjdGl2ZSkgPT4gKHtcclxuICBkaXNwbGF5OiBcImlubGluZS1mbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbiAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICBwYWRkaW5nOiBcIjdweCAxMnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMWVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBjb2xvcjogYWN0aXZlID8gXCIjMTQ1MzJkXCIgOiBcIiM3ZjFkMWRcIixcclxuICBiYWNrZ3JvdW5kOiBhY3RpdmUgPyBcIiNiYmY3ZDBcIiA6IFwiI2ZlY2FjYVwiLFxyXG59KTtcclxuXHJcbmNvbnN0IHBpbGxEb3RTdHlsZSA9IChhY3RpdmUpID0+ICh7XHJcbiAgd2lkdGg6IFwiOHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjhweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gIGJhY2tncm91bmQ6IGFjdGl2ZSA/IFwiIzIyYzU1ZVwiIDogXCIjZWY0NDQ0XCIsXHJcbn0pO1xyXG5cclxuY29uc3QgaW5mb0dyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcInJlcGVhdCgzLCBtaW5tYXgoMCwgMWZyKSlcIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIG1hcmdpblRvcDogXCIxOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvQ2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxNnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMDgpXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZjhmYWZjXCIsXHJcbiAgcGFkZGluZzogXCIxNHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvTGFiZWxTdHlsZSA9IHtcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMThlbVwiLFxyXG4gIGNvbG9yOiBcIiM2YjcyODBcIixcclxuICBtYXJnaW5Cb3R0b206IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvVmFsdWVTdHlsZSA9IHtcclxuICBmb250U2l6ZTogXCIxN3B4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICB3b3JkQnJlYWs6IFwiYnJlYWstd29yZFwiLFxyXG59O1xyXG5cclxuY29uc3QgY29udGVudENhcmRTdHlsZSA9IHtcclxuICAuLi5jYXJkU3R5bGUsXHJcbiAgcGFkZGluZzogXCIyMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uVGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMThlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgY29sb3I6IFwiIzExMTgyN1wiLFxyXG59O1xyXG5cclxuY29uc3QgZGVzY3JpcHRpb25TdHlsZSA9IHtcclxuICBtYXJnaW5Ub3A6IFwiMTJweFwiLFxyXG4gIGNvbG9yOiBcIiMzNzQxNTFcIixcclxuICBmb250U2l6ZTogXCIxNXB4XCIsXHJcbiAgbGluZUhlaWdodDogMS44LFxyXG4gIHdoaXRlU3BhY2U6IFwicHJlLXdyYXBcIixcclxufTtcclxuXHJcbmNvbnN0IGRldGFpbHNHcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxuICBtYXJnaW5Ub3A6IFwiMTJweFwiLFxyXG59O1xyXG5cclxuY29uc3QgZGV0YWlsUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCIxMHB4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMDgpXCIsXHJcbn07XHJcblxyXG5jb25zdCBkZXRhaWxMYWJlbFN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiM2YjcyODBcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCBkZXRhaWxWYWx1ZVN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgdGV4dEFsaWduOiBcInJpZ2h0XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYWN0aW9uUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBmbGV4V3JhcDogXCJ3cmFwXCIsXHJcbiAgbWFyZ2luVG9wOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHByaW1hcnlCdXR0b25TdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImlubGluZS1mbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbiAgbWluV2lkdGg6IFwiMTgwcHhcIixcclxuICBwYWRkaW5nOiBcIjE0cHggMThweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgYm9yZGVyOiBcIm5vbmVcIixcclxuICBiYWNrZ3JvdW5kOiBcImxpbmVhci1ncmFkaWVudCgxMzVkZWcsICM2MzY2ZjEgMCUsICM4YjVjZjYgMTAwJSlcIixcclxuICBjb2xvcjogXCIjZmZmZmZmXCIsXHJcbiAgZm9udFNpemU6IFwiMTVweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDEwcHggMThweCByZ2JhKDk5LCAxMDIsIDI0MSwgMC4zKVwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2Vjb25kYXJ5QnV0dG9uU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIG1pbldpZHRoOiBcIjE4MHB4XCIsXHJcbiAgcGFkZGluZzogXCIxNHB4IDE4cHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTRweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjEyKVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2ZmZmZmZlwiLFxyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICBmb250U2l6ZTogXCIxNXB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXRDdXJyZW5jeSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IGFtb3VudCA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gYFJzLiAke2Ftb3VudC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiBcIi1cIjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSk7XHJcbiAgaWYgKE51bWJlci5pc05hTihkYXRlLmdldFRpbWUoKSkpIHtcclxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBkYXRlU3R5bGU6IFwibWVkaXVtXCIsXHJcbiAgICB0aW1lU3R5bGU6IFwic2hvcnRcIixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IGdldFByb2R1Y3RJbWFnZSA9IChwYXJhbXMpID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgcGFyYW1zPy5pbWFnZVVybCB8fFxyXG4gICAgcGFyYW1zPy5pbWFnZSB8fFxyXG4gICAgcGFyYW1zPy50aHVtYm5haWwgfHxcclxuICAgIHBhcmFtcz8uY292ZXIgfHxcclxuICAgIFwiXCJcclxuICApO1xyXG59O1xyXG5cclxuY29uc3QgcGFyc2VTaXplU3RvY2sgPSAodmFsdWUpID0+IHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4ge307XHJcbiAgfVxyXG5cclxuICBsZXQgc291cmNlID0gdmFsdWU7XHJcbiAgaWYgKHR5cGVvZiBzb3VyY2UgPT09IFwic3RyaW5nXCIpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHNvdXJjZSA9IEpTT04ucGFyc2Uoc291cmNlKTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICByZXR1cm4ge307XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoIXNvdXJjZSB8fCB0eXBlb2Ygc291cmNlICE9PSBcIm9iamVjdFwiIHx8IEFycmF5LmlzQXJyYXkoc291cmNlKSkge1xyXG4gICAgcmV0dXJuIHt9O1xyXG4gIH1cclxuXHJcbiAgY29uc3Qgbm9ybWFsaXplZCA9IHt9O1xyXG4gIGZvciAoY29uc3QgW3Jhd1NpemUsIHJhd1F0eV0gb2YgT2JqZWN0LmVudHJpZXMoc291cmNlKSkge1xyXG4gICAgY29uc3Qgc2l6ZSA9IFN0cmluZyhyYXdTaXplIHx8IFwiXCIpXHJcbiAgICAgIC50cmltKClcclxuICAgICAgLnRvVXBwZXJDYXNlKCk7XHJcbiAgICBpZiAoIXNpemUpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcXR5ID0gTnVtYmVyKHJhd1F0eSk7XHJcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShxdHkpKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIG5vcm1hbGl6ZWRbc2l6ZV0gPSBNYXRoLm1heCgwLCBNYXRoLnRydW5jKHF0eSkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5vcm1hbGl6ZWQ7XHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0U2hvdyA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnN0IHJlY29yZCA9IHByb3BzPy5yZWNvcmQ7XHJcbiAgY29uc3QgcGFyYW1zID0gcmVjb3JkPy5wYXJhbXMgfHwge307XHJcbiAgY29uc3QgW2N1cnJlbnRVc2VyUm9sZSwgc2V0Q3VycmVudFVzZXJSb2xlXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtwcm9kdWN0RGF0YSwgc2V0UHJvZHVjdERhdGFdID0gdXNlU3RhdGUocGFyYW1zKTtcclxuXHJcbiAgY29uc3QgcHJvZHVjdElkID0gcGFyYW1zPy5pZCB8fCByZWNvcmQ/LmlkIHx8IFwiXCI7XHJcbiAgY29uc3QgbmFtZSA9IHByb2R1Y3REYXRhPy5uYW1lIHx8IFwiVW5uYW1lZCBwcm9kdWN0XCI7XHJcbiAgY29uc3Qgc2t1ID0gcHJvZHVjdERhdGE/LnNrdSB8fCBcIi1cIjtcclxuICBjb25zdCBjYXRlZ29yeSA9IHByb2R1Y3REYXRhPy5jYXRlZ29yeUlkIHx8IFwiLVwiO1xyXG4gIGNvbnN0IGltYWdlVXJsID0gZ2V0UHJvZHVjdEltYWdlKHByb2R1Y3REYXRhKTtcclxuICBjb25zdCBzdG9jayA9IE51bWJlcihwcm9kdWN0RGF0YT8uc3RvY2sgfHwgMCk7XHJcbiAgY29uc3Qgc2l6ZVN0b2NrID0gcGFyc2VTaXplU3RvY2socHJvZHVjdERhdGE/LnNpemVTdG9jayk7XHJcbiAgY29uc3Qgc2l6ZVN0b2NrRW50cmllcyA9IE9iamVjdC5lbnRyaWVzKHNpemVTdG9jayk7XHJcbiAgY29uc3QgaXNBY3RpdmUgPSBCb29sZWFuKHByb2R1Y3REYXRhPy5pc0FjdGl2ZSk7XHJcbiAgY29uc3QgcHJpY2UgPSBmb3JtYXRDdXJyZW5jeShwcm9kdWN0RGF0YT8ucHJpY2UpO1xyXG4gIGNvbnN0IGRlc2NyaXB0aW9uID1cclxuICAgIHByb2R1Y3REYXRhPy5kZXNjcmlwdGlvbiB8fCBcIk5vIGRlc2NyaXB0aW9uIGF2YWlsYWJsZSBmb3IgdGhpcyBwcm9kdWN0LlwiO1xyXG5cclxuICBjb25zdCBlZGl0VXJsID0gcHJvZHVjdElkXHJcbiAgICA/IGAvYWRtaW4vcmVzb3VyY2VzL1Byb2R1Y3RzL3JlY29yZHMvJHtlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKHByb2R1Y3RJZCkpfS9lZGl0YFxyXG4gICAgOiBcIlwiO1xyXG5cclxuICBjb25zdCBvcmRlclVybCA9IHByb2R1Y3RJZFxyXG4gICAgPyBgL2FkbWluL3Jlc291cmNlcy9PcmRlcnMvYWN0aW9ucy9uZXc/cHJvZHVjdElkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhwcm9kdWN0SWQpKX1gXHJcbiAgICA6IFwiXCI7XHJcblxyXG4gIGNvbnN0IGhhbmRsZU9yZGVyQ2xpY2sgPSAoKSA9PiB7XHJcbiAgICBpZiAob3JkZXJVcmwpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihvcmRlclVybCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlRWRpdENsaWNrID0gKCkgPT4ge1xyXG4gICAgaWYgKGVkaXRVcmwpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihlZGl0VXJsKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgLy8gRmV0Y2ggZnJlc2ggcHJvZHVjdCBkYXRhIHdpdGggc2l6ZVN0b2NrXHJcbiAgICBpZiAocHJvZHVjdElkKSB7XHJcbiAgICAgIGZldGNoKGAvYXBpL3Byb2R1Y3RzLyR7cHJvZHVjdElkfWAsIHtcclxuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxyXG4gICAgICB9KVxyXG4gICAgICAgIC50aGVuKChyZXMpID0+IChyZXMub2sgPyByZXMuanNvbigpIDogbnVsbCkpXHJcbiAgICAgICAgLmNhdGNoKCgpID0+IG51bGwpXHJcbiAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgIGlmIChkYXRhPy5pZCkge1xyXG4gICAgICAgICAgICBzZXRQcm9kdWN0RGF0YShkYXRhKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGZXRjaCBjdXJyZW50IHVzZXIgcm9sZVxyXG4gICAgZmV0Y2goXCIvYWRtaW4vY29udGV4dC9jdXJyZW50LXVzZXJcIiwge1xyXG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcclxuICAgIH0pXHJcbiAgICAgIC50aGVuKChyZXMpID0+IChyZXMub2sgPyByZXMuanNvbigpIDogbnVsbCkpXHJcbiAgICAgIC5jYXRjaCgoKSA9PiBudWxsKVxyXG4gICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgIGlmIChkYXRhPy5yb2xlKSB7XHJcbiAgICAgICAgICBzZXRDdXJyZW50VXNlclJvbGUoZGF0YS5yb2xlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuXHJcbiAgICByb290LmNsYXNzTGlzdC5hZGQoXCJjaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmVcIik7XHJcbiAgICBib2R5Py5jbGFzc0xpc3QuYWRkKFwiY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlXCIpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIHJvb3QuY2xhc3NMaXN0LnJlbW92ZShcImNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZVwiKTtcclxuICAgICAgYm9keT8uY2xhc3NMaXN0LnJlbW92ZShcImNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZVwiKTtcclxuICAgIH07XHJcbiAgfSwgW3Byb2R1Y3RJZF0pO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17cGFnZVN0eWxlfT5cclxuICAgICAgPHN0eWxlPntgXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgYm9keSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSAjYXBwLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIC5hZG1pbmpzX0xheW91dCxcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBbZGF0YS10ZXN0aWQ9XCJsYXlvdXRcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgW2RhdGEtY3NzPVwibGF5b3V0XCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIG1haW4sXHJcbiAgICAgICAgYm9keS5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUsXHJcbiAgICAgICAgYm9keS5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgI2FwcCxcclxuICAgICAgICBib2R5LmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSAuYWRtaW5qc19MYXlvdXQsXHJcbiAgICAgICAgYm9keS5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdLFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIFtkYXRhLWNzcz1cImxheW91dFwiXSxcclxuICAgICAgICBib2R5LmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBtYWluIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmZmZmYgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmYgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIGJvZHk6OmJlZm9yZSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZTo6YmVmb3JlLFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlOjpiZWZvcmUge1xyXG4gICAgICAgICAgY29udGVudDogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgW2RhdGEtdGVzdGlkPVwic2lkZWJhclwiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSAuYWRtaW5qc19TaWRlYmFyLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIHNlY3Rpb25bZGF0YS1jc3M9XCJzaWRlYmFyXCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIGFzaWRlW2RhdGEtY3NzPVwic2lkZWJhclwiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBuYXZbZGF0YS1jc3M9XCJzaWRlYmFyXCJdIHtcclxuICAgICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIHdpZHRoOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBtaW4td2lkdGg6IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIG1heC13aWR0aDogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgcGFkZGluZzogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBib3JkZXI6IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW4gIWltcG9ydGFudDtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIC5hZG1pbmpzX0xheW91dCxcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBbZGF0YS10ZXN0aWQ9XCJsYXlvdXRcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgW2RhdGEtY3NzPVwibGF5b3V0XCJdIHtcclxuICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSAuYWRtaW5qc19MYXlvdXQgPiAqOm5vdChbZGF0YS10ZXN0aWQ9XCJzaWRlYmFyXCJdKSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBbZGF0YS10ZXN0aWQ9XCJsYXlvdXRcIl0gPiAqOm5vdChbZGF0YS10ZXN0aWQ9XCJzaWRlYmFyXCJdKSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBbZGF0YS1jc3M9XCJsYXlvdXRcIl0gPiAqOm5vdChbZGF0YS10ZXN0aWQ9XCJzaWRlYmFyXCJdKSB7XHJcbiAgICAgICAgICB3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgbWF4LXdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBbZGF0YS10ZXN0aWQ9XCJ0b3BiYXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgLmFkbWluanNfVG9wQmFyLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIGhlYWRlcltkYXRhLWNzcz1cInRvcGJhclwiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBzZWN0aW9uW2RhdGEtY3NzPVwidG9wYmFyXCJdIHtcclxuICAgICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWw6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSxcclxuICAgICAgICBib2R5OmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSksXHJcbiAgICAgICAgI2FwcDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpLFxyXG4gICAgICAgIC5hZG1pbmpzX0xheW91dDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpLFxyXG4gICAgICAgIFtkYXRhLXRlc3RpZD1cImxheW91dFwiXTpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpLFxyXG4gICAgICAgIFtkYXRhLWNzcz1cImxheW91dFwiXTpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpLFxyXG4gICAgICAgIG1haW46aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSkgW2RhdGEtdGVzdGlkPVwic2lkZWJhclwiXSxcclxuICAgICAgICBodG1sOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSkgLmFkbWluanNfU2lkZWJhcixcclxuICAgICAgICBodG1sOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSkgc2VjdGlvbltkYXRhLWNzcz1cInNpZGViYXJcIl0sXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIGFzaWRlW2RhdGEtY3NzPVwic2lkZWJhclwiXSxcclxuICAgICAgICBodG1sOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSkgbmF2W2RhdGEtY3NzPVwic2lkZWJhclwiXSB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICB3aWR0aDogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgbWluLXdpZHRoOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBtYXgtd2lkdGg6IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYm9yZGVyOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSkgLmFkbWluanNfTGF5b3V0LFxyXG4gICAgICAgIGh0bWw6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSBbZGF0YS10ZXN0aWQ9XCJsYXlvdXRcIl0sXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIFtkYXRhLWNzcz1cImxheW91dFwiXSB7XHJcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIC5hZG1pbmpzX0xheW91dCA+ICo6bm90KFtkYXRhLXRlc3RpZD1cInNpZGViYXJcIl0pLFxyXG4gICAgICAgIGh0bWw6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSBbZGF0YS10ZXN0aWQ9XCJsYXlvdXRcIl0gPiAqOm5vdChbZGF0YS10ZXN0aWQ9XCJzaWRlYmFyXCJdKSxcclxuICAgICAgICBodG1sOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSkgW2RhdGEtY3NzPVwibGF5b3V0XCJdID4gKjpub3QoW2RhdGEtdGVzdGlkPVwic2lkZWJhclwiXSkge1xyXG4gICAgICAgICAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxuICAgICAgICAgIG1heC13aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIFtkYXRhLXRlc3RpZD1cInRvcGJhclwiXSxcclxuICAgICAgICBodG1sOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSkgLmFkbWluanNfVG9wQmFyLFxyXG4gICAgICAgIGh0bWw6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSBoZWFkZXJbZGF0YS1jc3M9XCJ0b3BiYXJcIl0sXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIHNlY3Rpb25bZGF0YS1jc3M9XCJ0b3BiYXJcIl0ge1xyXG4gICAgICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LXNoZWxsIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBnYXA6IDE4cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LXNob3ctbWV0YS1zY3JvbGwge1xyXG4gICAgICAgICAgbWF4LWhlaWdodDogMzIwcHg7XHJcbiAgICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xyXG4gICAgICAgICAgcGFkZGluZy1yaWdodDogNnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LW1ldGEtc2Nyb2xsOjotd2Via2l0LXNjcm9sbGJhciB7XHJcbiAgICAgICAgICB3aWR0aDogOHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LW1ldGEtc2Nyb2xsOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDE0OCwgMTYzLCAxODQsIDAuOCk7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1tZXRhLXNjcm9sbDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNDEsIDI0NSwgMjQ5LCAwLjkpO1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogMTEwMHB4KSB7XHJcbiAgICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LXNob3ctbGF5b3V0IHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgIWltcG9ydGFudDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LXNob3ctaW5mby1ncmlkIHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDAsIDFmcikpICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LW1ldGEtc2Nyb2xsIHtcclxuICAgICAgICAgICAgbWF4LWhlaWdodDogbm9uZTtcclxuICAgICAgICAgICAgb3ZlcmZsb3cteTogdmlzaWJsZTtcclxuICAgICAgICAgICAgcGFkZGluZy1yaWdodDogMDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA3MjBweCkge1xyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LWluZm8tZ3JpZCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2Uge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxNnB4ICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmZmZmYgIWltcG9ydGFudDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIGB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LXNob3ctc2hlbGwgY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZVwiPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3RvcEJhclN0eWxlfT5cclxuICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgIGhyZWY9XCIvYWRtaW4vcmVzb3VyY2VzL1Byb2R1Y3RzL2FjdGlvbnMvbGlzdFwiXHJcbiAgICAgICAgICAgIHN0eWxlPXtiYWNrTGlua1N0eWxlfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7igLk8L3NwYW4+XHJcbiAgICAgICAgICAgIEJhY2sgdG8gUHJvZHVjdHNcclxuICAgICAgICAgIDwvYT5cclxuXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtwaWxsU3R5bGUoaXNBY3RpdmUpfT5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3BpbGxEb3RTdHlsZShpc0FjdGl2ZSl9IC8+XHJcbiAgICAgICAgICAgIHtpc0FjdGl2ZSA/IFwiQWN0aXZlXCIgOiBcIkluYWN0aXZlXCJ9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3Qtc2hvdy1sYXlvdXRcIiBzdHlsZT17bGF5b3V0U3R5bGV9PlxyXG4gICAgICAgICAgPHNlY3Rpb24gc3R5bGU9e2ltYWdlQ2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW1hZ2VXcmFwU3R5bGV9PlxyXG4gICAgICAgICAgICAgIHtpbWFnZVVybCA/IChcclxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtpbWFnZVVybH0gYWx0PXtuYW1lfSBzdHlsZT17aW1hZ2VTdHlsZX0gLz5cclxuICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17aW1hZ2VGYWxsYmFja1N0eWxlfT5ObyBpbWFnZSBhdmFpbGFibGU8L2Rpdj5cclxuICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2ltYWdlRm9vdGVyU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiBcIiM2NDc0OGJcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICBQcm9kdWN0IElEXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6IFwiIzExMTgyN1wiLCBmb250V2VpZ2h0OiA3MDAgfX0+XHJcbiAgICAgICAgICAgICAgICAgIHtwcm9kdWN0SWQgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6IFwiIzY0NzQ4YlwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX0+UHJpY2U8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6IFwiIzExMTgyN1wiLCBmb250V2VpZ2h0OiA3MDAgfX0+e3ByaWNlfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvc2VjdGlvbj5cclxuXHJcbiAgICAgICAgICA8c2VjdGlvbiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiBcIjIycHhcIiB9fT5cclxuICAgICAgICAgICAgICA8aDEgc3R5bGU9e3RpdGxlU3R5bGV9PntuYW1lfTwvaDE+XHJcbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3N1YnRpdGxlU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgQ2xlYW4gcHJvZHVjdCBkZXRhaWwgdmlldyB3aXRoIHF1aWNrIGFjdGlvbnMgYW5kIHJlY29yZCBpbmZvLlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LXNob3ctaW5mby1ncmlkXCJcclxuICAgICAgICAgICAgICAgIHN0eWxlPXtpbmZvR3JpZFN0eWxlfVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9DYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvTGFiZWxTdHlsZX0+UHJpY2U8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1ZhbHVlU3R5bGV9PntwcmljZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9DYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvTGFiZWxTdHlsZX0+U3RvY2s8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1ZhbHVlU3R5bGV9PntzdG9ja308L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9DYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvTGFiZWxTdHlsZX0+U0tVPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT57c2t1fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9MYWJlbFN0eWxlfT5TaXplczwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvVmFsdWVTdHlsZX0+e3NpemVTdG9ja0VudHJpZXMubGVuZ3RofTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2FjdGlvblJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIHtjdXJyZW50VXNlclJvbGUgIT09IFwiYWRtaW5cIiAmJiAoXHJcbiAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17cHJpbWFyeUJ1dHRvblN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZU9yZGVyQ2xpY2t9XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICBDcmVhdGUgT3JkZXJcclxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtzZWNvbmRhcnlCdXR0b25TdHlsZX1cclxuICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlRWRpdENsaWNrfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICBFZGl0IFByb2R1Y3RcclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3Qtc2hvdy1tZXRhLXNjcm9sbFwiXHJcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IFwiMjJweFwiLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBcIjIwcHhcIixcclxuICAgICAgICAgICAgICAgICAgYm9yZGVyVG9wOiBcIjFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMDgpXCIsXHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gICAgICAgICAgICAgICAgICBnYXA6IFwiMThweFwiLFxyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5EZXNjcmlwdGlvbjwvaDI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2Rlc2NyaXB0aW9uU3R5bGV9PntkZXNjcmlwdGlvbn08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlByb2R1Y3QgRGV0YWlsczwvaDI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2RldGFpbHNHcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2RldGFpbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtkZXRhaWxMYWJlbFN0eWxlfT5DYXRlZ29yeTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtkZXRhaWxWYWx1ZVN0eWxlfT57Y2F0ZWdvcnl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtkZXRhaWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17ZGV0YWlsTGFiZWxTdHlsZX0+U2l6ZSBTdG9jazwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtkZXRhaWxWYWx1ZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3NpemVTdG9ja0VudHJpZXMubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPyBzaXplU3RvY2tFbnRyaWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKFtzaXplLCBxdHldKSA9PiBgJHtzaXplfTogJHtxdHl9YClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCIgfCBcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiTm8gc2l6ZS13aXNlIHN0b2NrXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2RldGFpbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtkZXRhaWxMYWJlbFN0eWxlfT5DcmVhdGVkIEF0PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2RldGFpbFZhbHVlU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShwcm9kdWN0RGF0YT8uY3JlYXRlZEF0KX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17ZGV0YWlsUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2RldGFpbExhYmVsU3R5bGV9PlVwZGF0ZWQgQXQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17ZGV0YWlsVmFsdWVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtmb3JtYXREYXRlKHByb2R1Y3REYXRhPy51cGRhdGVkQXQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtkZXRhaWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17ZGV0YWlsTGFiZWxTdHlsZX0+UmVjb3JkIElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2RldGFpbFZhbHVlU3R5bGV9Pntwcm9kdWN0SWQgfHwgXCItXCJ9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdFNob3c7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBwYWdlU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjIwcHhcIixcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZmZmZmZmXCIsXHJcbn07XHJcblxyXG5jb25zdCBoZWFkZXJTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBmb250U2l6ZTogXCIzNHB4XCIsXHJcbiAgbGluZUhlaWdodDogMS4wOCxcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbn07XHJcblxyXG5jb25zdCBkZXNjU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGNvbG9yOiBcIiM2NDc0OGJcIixcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBjYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE4cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTcsIDI0LCAzOSwgMC4wOClcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmZmZmZmZcIixcclxuICBib3hTaGFkb3c6IFwiMCAxNHB4IDI4cHggcmdiYSgxNSwgMjMsIDQyLCAwLjA4KVwiLFxyXG4gIHBhZGRpbmc6IFwiMThweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdGlvblRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiBcIjAgMCAxNHB4IDBcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTJlbVwiLFxyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbn07XHJcblxyXG5jb25zdCBsYXlvdXRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgzMDBweCwgMC45NWZyKSBtaW5tYXgoNDIwcHgsIDEuMjVmcilcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc3RhY2tTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgbGFiZWxTdHlsZSA9IHtcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xZW1cIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gIGNvbG9yOiBcIiM0NzU1NjlcIixcclxufTtcclxuXHJcbmNvbnN0IGlucHV0U3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIG1pbldpZHRoOiAwLFxyXG4gIGJveFNpemluZzogXCJib3JkZXItYm94XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTcsIDI0LCAzOSwgMC4xMilcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmZmZmZmZcIixcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgcGFkZGluZzogXCIxMXB4IDEzcHhcIixcclxuICBmb250U2l6ZTogXCIxNHB4XCIsXHJcbiAgZm9udEZhbWlseTogXCJpbmhlcml0XCIsXHJcbn07XHJcblxyXG5jb25zdCByb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbiAgbWluV2lkdGg6IDAsXHJcbn07XHJcblxyXG5jb25zdCBncmlkMlN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwicmVwZWF0KDIsIG1pbm1heCgwLCAxZnIpKVwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJzdGFydFwiLFxyXG59O1xyXG5cclxuY29uc3QgY3VzdG9tZXJJbmZvU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGN1c3RvbWVyUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiOHB4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMDgpXCIsXHJcbn07XHJcblxyXG5jb25zdCBtdXRlZFN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiM2NDc0OGJcIixcclxufTtcclxuXHJcbmNvbnN0IHN0cm9uZ1N0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgdGV4dEFsaWduOiBcInJpZ2h0XCIsXHJcbn07XHJcblxyXG5jb25zdCBsaW5lSXRlbVJvd1N0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjEyKVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgcGFkZGluZzogXCIxMnB4XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IGxpbmVJdGVtVG9wU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgYXV0b1wiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IHByb2R1Y3RQcmV2aWV3U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCI1NnB4IDFmclwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiNTZweFwiLFxyXG4gIGhlaWdodDogXCI1NnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNlNWU3ZWJcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTcsIDI0LCAzOSwgMC4xMilcIixcclxufTtcclxuXHJcbmNvbnN0IGFkZEJ1dHRvblN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSg5OSwgMTAyLCAyNDEsIDAuMzUpXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBwYWRkaW5nOiBcIjlweCAxMnB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZWVmMmZmXCIsXHJcbiAgY29sb3I6IFwiIzM3MzBhM1wiLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG59O1xyXG5cclxuY29uc3QgcmVtb3ZlQnV0dG9uU3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCAjZmNhNWE1XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBwYWRkaW5nOiBcIjhweCAxMHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZmVlMmUyXCIsXHJcbiAgY29sb3I6IFwiIzk5MWIxYlwiLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxufTtcclxuXHJcbmNvbnN0IHRvdGFsc1Jvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBwYWRkaW5nOiBcIjdweCAwXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjA4KVwiLFxyXG59O1xyXG5cclxuY29uc3QgdG90YWxTdHlsZSA9IHtcclxuICAuLi50b3RhbHNSb3dTdHlsZSxcclxuICBmb250U2l6ZTogXCIxN3B4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICBib3JkZXJCb3R0b206IFwibm9uZVwiLFxyXG4gIHBhZGRpbmdUb3A6IFwiMTJweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYWN0aW9uQmFyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGFjdGlvbkJ1dHRvblN0eWxlID0gKHByaW1hcnkpID0+ICh7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IHByaW1hcnkgPyBcIm5vbmVcIiA6IFwiMXB4IHNvbGlkIHJnYmEoMTcsIDI0LCAzOSwgMC4xMilcIixcclxuICBwYWRkaW5nOiBcIjEycHggMTRweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIGJhY2tncm91bmQ6IHByaW1hcnlcclxuICAgID8gXCJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNjM2NmYxIDAlLCAjOGI1Y2Y2IDEwMCUpXCJcclxuICAgIDogXCIjZmZmZmZmXCIsXHJcbiAgY29sb3I6IHByaW1hcnkgPyBcIiNmZmZcIiA6IFwiIzExMTgyN1wiLFxyXG59KTtcclxuXHJcbmNvbnN0IG1hcExpbmtTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjMjU2M2ViXCIsXHJcbiAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIixcclxufTtcclxuXHJcbmNvbnN0IHBheW1lbnRPcHRpb25HcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IHBheW1lbnRPcHRpb25TdHlsZSA9IChhY3RpdmUpID0+ICh7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBib3JkZXI6IGFjdGl2ZVxyXG4gICAgPyBcIjFweCBzb2xpZCByZ2JhKDk5LCAxMDIsIDI0MSwgMC45KVwiXHJcbiAgICA6IFwiMXB4IHNvbGlkIHJnYmEoMTcsIDI0LCAzOSwgMC4xMilcIixcclxuICBiYWNrZ3JvdW5kOiBhY3RpdmUgPyBcIiNlZWYyZmZcIiA6IFwiI2ZmZmZmZlwiLFxyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICBwYWRkaW5nOiBcIjEwcHggMTJweFwiLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgdGV4dEFsaWduOiBcImxlZnRcIixcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbn0pO1xyXG5cclxuY29uc3Qgc2VjdXJpdHlDaGlwV3JhcFN0eWxlID0ge1xyXG4gIG1hcmdpblRvcDogXCIxMnB4XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdXJpdHlDaGlwU3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDM0LCAxOTcsIDk0LCAwLjQyKVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2VjZmRmM1wiLFxyXG4gIGNvbG9yOiBcIiMxNjY1MzRcIixcclxuICBwYWRkaW5nOiBcIjdweCAxMHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDNlbVwiLFxyXG59O1xyXG5cclxuY29uc3QgcmVzcG9uc2l2ZUNzcyA9IGBcclxuLmNoYW5nZTgtb3JkZXItZ3JpZC0yIHtcclxuICBkaXNwbGF5OiBncmlkICFpbXBvcnRhbnQ7XHJcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDAsIDFmcikpICFpbXBvcnRhbnQ7XHJcbiAgZ2FwOiAxMHB4ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5jaGFuZ2U4LW9yZGVyLWdyaWQtMiA+ICoge1xyXG4gIG1pbi13aWR0aDogMCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4uY2hhbmdlOC1vcmRlci1ncmlkLTIgaW5wdXQsXHJcbi5jaGFuZ2U4LW9yZGVyLWdyaWQtMiBzZWxlY3QsXHJcbi5jaGFuZ2U4LW9yZGVyLWdyaWQtMiB0ZXh0YXJlYSB7XHJcbiAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxuICBtaW4td2lkdGg6IDAgIWltcG9ydGFudDtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbkBtZWRpYSAobWF4LXdpZHRoOiAxMDI0cHgpIHtcclxuICAuY2hhbmdlOC1vcmRlci1sYXlvdXQge1xyXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgIWltcG9ydGFudDtcclxuICB9XHJcbn1cclxuXHJcbkBtZWRpYSAobWF4LXdpZHRoOiA3NjBweCkge1xyXG4gIC5jaGFuZ2U4LW9yZGVyLWdyaWQtMiB7XHJcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gIH1cclxufVxyXG5gO1xyXG5cclxuY29uc3QgcGF5bWVudE9wdGlvbnMgPSBbXHJcbiAgeyB2YWx1ZTogXCJDYXJkXCIsIGxhYmVsOiBcIkNhcmQgUGF5bWVudFwiLCBpY29uOiBcIvCfkrNcIiB9LFxyXG4gIHsgdmFsdWU6IFwiQ2FzaCBvbiBEZWxpdmVyeVwiLCBsYWJlbDogXCJDYXNoIG9uIERlbGl2ZXJ5XCIsIGljb246IFwi8J+TplwiIH0sXHJcbl07XHJcblxyXG5jb25zdCBmYWxsYmFja1NpemVPcHRpb25zID0gW1wiWFNcIiwgXCJTXCIsIFwiTVwiLCBcIkxcIiwgXCJYTFwiLCBcIlhYTFwiXTtcclxuY29uc3Qgc2hpcHBpbmdNZXRob2RzID0gW1xyXG4gIFwiUGlja01lIEZsYXNoXCIsXHJcbiAgXCJQcm9udG9cIixcclxuICBcIkRvbWV4XCIsXHJcbiAgXCJSZWdpc3RlcmVkIENvdXJpZXJcIixcclxuXTtcclxuXHJcbmNvbnN0IHRvTnVtYmVyID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgbnVtID0gTnVtYmVyKHZhbHVlIHx8IDApO1xyXG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobnVtKSA/IG51bSA6IDA7XHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXRNb25leSA9ICh2YWx1ZSkgPT4ge1xyXG4gIHJldHVybiBgUnMuICR7dG9OdW1iZXIodmFsdWUpLnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gIH0pfWA7XHJcbn07XHJcblxyXG5jb25zdCBwYXJzZVNpemVTdG9jayA9ICh2YWx1ZSkgPT4ge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiB7fTtcclxuICB9XHJcblxyXG4gIGxldCBzb3VyY2UgPSB2YWx1ZTtcclxuICBpZiAodHlwZW9mIHNvdXJjZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgc291cmNlID0gSlNPTi5wYXJzZShzb3VyY2UpO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIHJldHVybiB7fTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICghc291cmNlIHx8IHR5cGVvZiBzb3VyY2UgIT09IFwib2JqZWN0XCIgfHwgQXJyYXkuaXNBcnJheShzb3VyY2UpKSB7XHJcbiAgICByZXR1cm4ge307XHJcbiAgfVxyXG5cclxuICBjb25zdCBub3JtYWxpemVkID0ge307XHJcbiAgZm9yIChjb25zdCBbcmF3U2l6ZSwgcmF3UXR5XSBvZiBPYmplY3QuZW50cmllcyhzb3VyY2UpKSB7XHJcbiAgICBjb25zdCBzaXplID0gU3RyaW5nKHJhd1NpemUgfHwgXCJcIilcclxuICAgICAgLnRyaW0oKVxyXG4gICAgICAudG9VcHBlckNhc2UoKTtcclxuICAgIGlmICghc2l6ZSkge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBxdHkgPSBNYXRoLm1heCgwLCBNYXRoLnRydW5jKE51bWJlcihyYXdRdHkgfHwgMCkpKTtcclxuICAgIG5vcm1hbGl6ZWRbc2l6ZV0gPSBxdHk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbm9ybWFsaXplZDtcclxufTtcclxuXHJcbmNvbnN0IGdldFNpemVFbnRyaWVzID0gKHByb2R1Y3QpID0+IHtcclxuICBjb25zdCBzaXplU3RvY2sgPSBwYXJzZVNpemVTdG9jayhwcm9kdWN0Py5zaXplU3RvY2spO1xyXG4gIHJldHVybiBPYmplY3QuZW50cmllcyhzaXplU3RvY2spXHJcbiAgICAuc29ydCgoW2FdLCBbYl0pID0+IGEubG9jYWxlQ29tcGFyZShiKSlcclxuICAgIC5tYXAoKFtzaXplLCBxdHldKSA9PiAoeyBzaXplLCBxdHkgfSkpO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0U2l6ZU9wdGlvbnMgPSAocHJvZHVjdCkgPT4ge1xyXG4gIGNvbnN0IGVudHJpZXMgPSBnZXRTaXplRW50cmllcyhwcm9kdWN0KTtcclxuICBpZiAoZW50cmllcy5sZW5ndGggPiAwKSB7XHJcbiAgICByZXR1cm4gZW50cmllcztcclxuICB9XHJcblxyXG4gIHJldHVybiBmYWxsYmFja1NpemVPcHRpb25zLm1hcCgoc2l6ZSkgPT4gKHsgc2l6ZSwgcXR5OiBudWxsIH0pKTtcclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZUVtcHR5SXRlbSA9ICgpID0+ICh7XHJcbiAgcHJvZHVjdElkOiBcIlwiLFxyXG4gIHNpemU6IFwiXCIsXHJcbiAgcXVhbnRpdHk6IDEsXHJcbiAgdW5pdFByaWNlOiAwLFxyXG59KTtcclxuXHJcbmNvbnN0IE9yZGVyQ3JlYXRlID0gKCkgPT4ge1xyXG4gIGNvbnN0IFt1c2Vycywgc2V0VXNlcnNdID0gdXNlU3RhdGUoW10pO1xyXG4gIGNvbnN0IFtwcm9kdWN0cywgc2V0UHJvZHVjdHNdID0gdXNlU3RhdGUoW10pO1xyXG4gIGNvbnN0IFtvcmRlckNvdW50QnlVc2VyLCBzZXRPcmRlckNvdW50QnlVc2VyXSA9IHVzZVN0YXRlKHt9KTtcclxuICBjb25zdCBbc2Vzc2lvblVzZXIsIHNldFNlc3Npb25Vc2VyXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gIGNvbnN0IFtzdWJtaXR0aW5nLCBzZXRTdWJtaXR0aW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgY29uc3QgW2Zvcm1EYXRhLCBzZXRGb3JtRGF0YV0gPSB1c2VTdGF0ZSh7XHJcbiAgICB1c2VySWQ6IFwiXCIsXHJcbiAgICBzdGF0dXM6IFwicGVuZGluZ1wiLFxyXG4gICAgcGF5bWVudE1ldGhvZDogXCJDYXJkXCIsXHJcbiAgICBwYXltZW50U3RhdHVzOiBcInBlbmRpbmdcIixcclxuICAgIHRyYW5zYWN0aW9uSWQ6IFwiXCIsXHJcbiAgICBzaGlwcGluZ05hbWU6IFwiXCIsXHJcbiAgICBzaGlwcGluZ1Bob25lOiBcIlwiLFxyXG4gICAgc2hpcHBpbmdBZGRyZXNzOiBcIlwiLFxyXG4gICAgc2hpcHBpbmdNZXRob2Q6IFwiUGlja01lIEZsYXNoXCIsXHJcbiAgICB0cmFja2luZ051bWJlcjogXCJcIixcclxuICAgIHNoaXBwaW5nRmVlOiAwLFxyXG4gICAgdGF4OiAwLFxyXG4gICAgZGlzY291bnQ6IDAsXHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IFtsaW5lSXRlbXMsIHNldExpbmVJdGVtc10gPSB1c2VTdGF0ZShbY3JlYXRlRW1wdHlJdGVtKCldKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuICAgIGNvbnN0IGhhZExvZ2luQ2xhc3NPblJvb3QgPSByb290LmNsYXNzTGlzdC5jb250YWlucyhcImNoYW5nZTgtbG9naW4tcGFnZVwiKTtcclxuICAgIGNvbnN0IGhhZExvZ2luQ2xhc3NPbkJvZHkgPSBib2R5Py5jbGFzc0xpc3QuY29udGFpbnMoXCJjaGFuZ2U4LWxvZ2luLXBhZ2VcIik7XHJcbiAgICBjb25zdCBoYWREYXNoYm9hcmRDbGFzc09uUm9vdCA9IHJvb3QuY2xhc3NMaXN0LmNvbnRhaW5zKFxyXG4gICAgICBcImNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQtcGFnZVwiLFxyXG4gICAgKTtcclxuICAgIGNvbnN0IGhhZERhc2hib2FyZENsYXNzT25Cb2R5ID0gYm9keT8uY2xhc3NMaXN0LmNvbnRhaW5zKFxyXG4gICAgICBcImNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQtcGFnZVwiLFxyXG4gICAgKTtcclxuICAgIGNvbnN0IGxvZ2luQmdMYXllciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhbmdlOC1sb2dpbi1iZy1sYXllclwiKTtcclxuICAgIGNvbnN0IHByZXZpb3VzTGF5ZXJEaXNwbGF5ID0gbG9naW5CZ0xheWVyPy5zdHlsZS5kaXNwbGF5IHx8IFwiXCI7XHJcblxyXG4gICAgY29uc3Qgc2hlbGxOb2RlcyA9IEFycmF5LmZyb20oXHJcbiAgICAgIG5ldyBTZXQoXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgcm9vdCxcclxuICAgICAgICAgIGJvZHksXHJcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFwcFwiKSxcclxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRlc3RpZD1cImxheW91dFwiXScpLFxyXG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtY3NzPVwibGF5b3V0XCJdJyksXHJcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFkbWluanNfTGF5b3V0XCIpLFxyXG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIiksXHJcbiAgICAgICAgICAuLi5BcnJheS5mcm9tKFxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgICAgICAgICAgICdbZGF0YS1jc3MqPVwiYWN0aW9uLWNvbnRlbnRcIl0sIFtkYXRhLXRlc3RpZCo9XCJjb250ZW50XCJdLCAuYWRtaW5qc19NYWluLCAuYWRtaW5qc19NYWluID4gZGl2LCAuYWRtaW5qc19NYWluID4gZGl2ID4gZGl2LCBbZGF0YS1jc3MkPVwiLWNvbnRlbnRcIl0nLFxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgKSxcclxuICAgICAgICBdLmZpbHRlcihCb29sZWFuKSxcclxuICAgICAgKSxcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgcHJldmlvdXNJbmxpbmVCYWNrZ3JvdW5kcyA9IG5ldyBNYXAoXHJcbiAgICAgIHNoZWxsTm9kZXMubWFwKChub2RlKSA9PiBbXHJcbiAgICAgICAgbm9kZSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBub2RlLnN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCJiYWNrZ3JvdW5kXCIpLFxyXG4gICAgICAgICAgYmFja2dyb3VuZFByaW9yaXR5OiBub2RlLnN0eWxlLmdldFByb3BlcnR5UHJpb3JpdHkoXCJiYWNrZ3JvdW5kXCIpLFxyXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBub2RlLnN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCJiYWNrZ3JvdW5kLWNvbG9yXCIpLFxyXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yUHJpb3JpdHk6XHJcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuZ2V0UHJvcGVydHlQcmlvcml0eShcImJhY2tncm91bmQtY29sb3JcIiksXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6IG5vZGUuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcImJhY2tncm91bmQtaW1hZ2VcIiksXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2VQcmlvcml0eTpcclxuICAgICAgICAgICAgbm9kZS5zdHlsZS5nZXRQcm9wZXJ0eVByaW9yaXR5KFwiYmFja2dyb3VuZC1pbWFnZVwiKSxcclxuICAgICAgICB9LFxyXG4gICAgICBdKSxcclxuICAgICk7XHJcblxyXG4gICAgcm9vdC5jbGFzc0xpc3QucmVtb3ZlKFxyXG4gICAgICBcImNoYW5nZTgtbG9naW4tcGFnZVwiLFxyXG4gICAgICBcImNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQtcGFnZVwiLFxyXG4gICAgKTtcclxuICAgIGJvZHk/LmNsYXNzTGlzdC5yZW1vdmUoXHJcbiAgICAgIFwiY2hhbmdlOC1sb2dpbi1wYWdlXCIsXHJcbiAgICAgIFwiY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlXCIsXHJcbiAgICApO1xyXG4gICAgaWYgKGxvZ2luQmdMYXllcikge1xyXG4gICAgICBsb2dpbkJnTGF5ZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHNoZWxsTm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xyXG4gICAgICBub2RlLnN0eWxlLnNldFByb3BlcnR5KFwiYmFja2dyb3VuZFwiLCBcIiNmZmZmZmZcIiwgXCJpbXBvcnRhbnRcIik7XHJcbiAgICAgIG5vZGUuc3R5bGUuc2V0UHJvcGVydHkoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIFwiI2ZmZmZmZlwiLCBcImltcG9ydGFudFwiKTtcclxuICAgICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShcImJhY2tncm91bmQtaW1hZ2VcIiwgXCJub25lXCIsIFwiaW1wb3J0YW50XCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcm9vdC5jbGFzc0xpc3QuYWRkKFwiY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlXCIpO1xyXG4gICAgYm9keT8uY2xhc3NMaXN0LmFkZChcImNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZVwiKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICByb290LmNsYXNzTGlzdC5yZW1vdmUoXCJjaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmVcIik7XHJcbiAgICAgIGJvZHk/LmNsYXNzTGlzdC5yZW1vdmUoXCJjaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmVcIik7XHJcblxyXG4gICAgICBpZiAoaGFkTG9naW5DbGFzc09uUm9vdCkge1xyXG4gICAgICAgIHJvb3QuY2xhc3NMaXN0LmFkZChcImNoYW5nZTgtbG9naW4tcGFnZVwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGhhZExvZ2luQ2xhc3NPbkJvZHkpIHtcclxuICAgICAgICBib2R5Py5jbGFzc0xpc3QuYWRkKFwiY2hhbmdlOC1sb2dpbi1wYWdlXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaGFkRGFzaGJvYXJkQ2xhc3NPblJvb3QpIHtcclxuICAgICAgICByb290LmNsYXNzTGlzdC5hZGQoXCJjaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2VcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChoYWREYXNoYm9hcmRDbGFzc09uQm9keSkge1xyXG4gICAgICAgIGJvZHk/LmNsYXNzTGlzdC5hZGQoXCJjaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2VcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChsb2dpbkJnTGF5ZXIpIHtcclxuICAgICAgICBsb2dpbkJnTGF5ZXIuc3R5bGUuZGlzcGxheSA9IHByZXZpb3VzTGF5ZXJEaXNwbGF5O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBwcmV2aW91c0lubGluZUJhY2tncm91bmRzLmZvckVhY2goKHN0eWxlcywgbm9kZSkgPT4ge1xyXG4gICAgICAgIGlmICghc3R5bGVzLmJhY2tncm91bmQpIHtcclxuICAgICAgICAgIG5vZGUuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBub2RlLnN0eWxlLnNldFByb3BlcnR5KFxyXG4gICAgICAgICAgICBcImJhY2tncm91bmRcIixcclxuICAgICAgICAgICAgc3R5bGVzLmJhY2tncm91bmQsXHJcbiAgICAgICAgICAgIHN0eWxlcy5iYWNrZ3JvdW5kUHJpb3JpdHkgfHwgXCJcIixcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXN0eWxlcy5iYWNrZ3JvdW5kQ29sb3IpIHtcclxuICAgICAgICAgIG5vZGUuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJiYWNrZ3JvdW5kLWNvbG9yXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBub2RlLnN0eWxlLnNldFByb3BlcnR5KFxyXG4gICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIixcclxuICAgICAgICAgICAgc3R5bGVzLmJhY2tncm91bmRDb2xvcixcclxuICAgICAgICAgICAgc3R5bGVzLmJhY2tncm91bmRDb2xvclByaW9yaXR5IHx8IFwiXCIsXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzdHlsZXMuYmFja2dyb3VuZEltYWdlKSB7XHJcbiAgICAgICAgICBub2RlLnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZC1pbWFnZVwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWltYWdlXCIsXHJcbiAgICAgICAgICAgIHN0eWxlcy5iYWNrZ3JvdW5kSW1hZ2UsXHJcbiAgICAgICAgICAgIHN0eWxlcy5iYWNrZ3JvdW5kSW1hZ2VQcmlvcml0eSB8fCBcIlwiLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xyXG4gICAgY29uc3QgcHJlUHJvZHVjdElkID0gcGFyYW1zLmdldChcInByb2R1Y3RJZFwiKSB8fCBcIlwiO1xyXG5cclxuICAgIGNvbnN0IGZldGNoRGF0YSA9IGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBjb250ZXh0UmVzID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgICAgICBgL2FkbWluL2NvbnRleHQvb3JkZXItY3JlYXRlJHtcclxuICAgICAgICAgICAgcHJlUHJvZHVjdElkID8gYD9wcm9kdWN0SWQ9JHtlbmNvZGVVUklDb21wb25lbnQocHJlUHJvZHVjdElkKX1gIDogXCJcIlxyXG4gICAgICAgICAgfWAsXHJcbiAgICAgICAgICB7IGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBjb250ZXh0RGF0YSA9IGNvbnRleHRSZXMub2sgPyBhd2FpdCBjb250ZXh0UmVzLmpzb24oKSA6IHt9O1xyXG5cclxuICAgICAgICBjb25zdCB1c2Vyc0RhdGEgPSBBcnJheS5pc0FycmF5KGNvbnRleHREYXRhPy51c2VycylcclxuICAgICAgICAgID8gY29udGV4dERhdGEudXNlcnNcclxuICAgICAgICAgIDogW107XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdHNMaXN0ID0gQXJyYXkuaXNBcnJheShjb250ZXh0RGF0YT8ucHJvZHVjdHMpXHJcbiAgICAgICAgICA/IGNvbnRleHREYXRhLnByb2R1Y3RzXHJcbiAgICAgICAgICA6IFtdO1xyXG5cclxuICAgICAgICBzZXRVc2Vycyh1c2Vyc0RhdGEpO1xyXG4gICAgICAgIHNldFByb2R1Y3RzKHByb2R1Y3RzTGlzdCk7XHJcbiAgICAgICAgc2V0T3JkZXJDb3VudEJ5VXNlcihjb250ZXh0RGF0YT8ub3JkZXJDb3VudEJ5VXNlciB8fCB7fSk7XHJcbiAgICAgICAgc2V0U2Vzc2lvblVzZXIoY29udGV4dERhdGE/LmN1cnJlbnRVc2VyIHx8IG51bGwpO1xyXG5cclxuICAgICAgICBpZiAoY29udGV4dERhdGE/LmN1cnJlbnRVc2VyPy5pZCkge1xyXG4gICAgICAgICAgc2V0Rm9ybURhdGEoKHByZXYpID0+ICh7XHJcbiAgICAgICAgICAgIC4uLnByZXYsXHJcbiAgICAgICAgICAgIHVzZXJJZDogcHJldi51c2VySWQgfHwgU3RyaW5nKGNvbnRleHREYXRhLmN1cnJlbnRVc2VyLmlkKSxcclxuICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb250ZXh0RGF0YT8uc2VsZWN0ZWRQcm9kdWN0Py5pZCkge1xyXG4gICAgICAgICAgY29uc3Qgc2VsZWN0ZWRQcm9kdWN0U2l6ZU9wdGlvbnMgPSBnZXRTaXplT3B0aW9ucyhcclxuICAgICAgICAgICAgY29udGV4dERhdGEuc2VsZWN0ZWRQcm9kdWN0LFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIHNldExpbmVJdGVtcyhbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBwcm9kdWN0SWQ6IFN0cmluZyhjb250ZXh0RGF0YS5zZWxlY3RlZFByb2R1Y3QuaWQpLFxyXG4gICAgICAgICAgICAgIHNpemU6IHNlbGVjdGVkUHJvZHVjdFNpemVPcHRpb25zWzBdPy5zaXplIHx8IFwiXCIsXHJcbiAgICAgICAgICAgICAgcXVhbnRpdHk6IDEsXHJcbiAgICAgICAgICAgICAgdW5pdFByaWNlOiB0b051bWJlcihjb250ZXh0RGF0YS5zZWxlY3RlZFByb2R1Y3QucHJpY2UpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgXSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICBwcmVQcm9kdWN0SWQgJiZcclxuICAgICAgICAgIHByb2R1Y3RzTGlzdC5zb21lKChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhwcmVQcm9kdWN0SWQpKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBwcm9kdWN0c0xpc3QuZmluZChcclxuICAgICAgICAgICAgKHApID0+IFN0cmluZyhwLmlkKSA9PT0gU3RyaW5nKHByZVByb2R1Y3RJZCksXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgY29uc3Qgc2VsZWN0ZWRQcm9kdWN0U2l6ZU9wdGlvbnMgPSBnZXRTaXplT3B0aW9ucyhzZWxlY3RlZCk7XHJcbiAgICAgICAgICBzZXRMaW5lSXRlbXMoW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgcHJvZHVjdElkOiBTdHJpbmcocHJlUHJvZHVjdElkKSxcclxuICAgICAgICAgICAgICBzaXplOiBzZWxlY3RlZFByb2R1Y3RTaXplT3B0aW9uc1swXT8uc2l6ZSB8fCBcIlwiLFxyXG4gICAgICAgICAgICAgIHF1YW50aXR5OiAxLFxyXG4gICAgICAgICAgICAgIHVuaXRQcmljZTogdG9OdW1iZXIoc2VsZWN0ZWQ/LnByaWNlKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmZXRjaERhdGEoKTtcclxuICB9LCBbXSk7XHJcblxyXG4gIGNvbnN0IHNlbGVjdGVkQ3VzdG9tZXIgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiB1c2Vycy5maW5kKCh1KSA9PiBTdHJpbmcodS5pZCkgPT09IFN0cmluZyhmb3JtRGF0YS51c2VySWQpKSB8fCBudWxsO1xyXG4gIH0sIFt1c2VycywgZm9ybURhdGEudXNlcklkXSk7XHJcblxyXG4gIGNvbnN0IGN1c3RvbWVyT3JkZXJDb3VudCA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgaWYgKCFzZWxlY3RlZEN1c3RvbWVyKSB7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBOdW1iZXIob3JkZXJDb3VudEJ5VXNlcltTdHJpbmcoc2VsZWN0ZWRDdXN0b21lci5pZCldIHx8IDApO1xyXG4gIH0sIFtvcmRlckNvdW50QnlVc2VyLCBzZWxlY3RlZEN1c3RvbWVyXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoIXNlbGVjdGVkQ3VzdG9tZXIpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEZvcm1EYXRhKChwcmV2KSA9PiAoe1xyXG4gICAgICAuLi5wcmV2LFxyXG4gICAgICBzaGlwcGluZ05hbWU6IHByZXYuc2hpcHBpbmdOYW1lIHx8IHNlbGVjdGVkQ3VzdG9tZXIubmFtZSB8fCBcIlwiLFxyXG4gICAgICBzaGlwcGluZ1Bob25lOlxyXG4gICAgICAgIHByZXYuc2hpcHBpbmdQaG9uZSB8fFxyXG4gICAgICAgIHNlbGVjdGVkQ3VzdG9tZXIucGhvbmUgfHxcclxuICAgICAgICBzZWxlY3RlZEN1c3RvbWVyLm1vYmlsZSB8fFxyXG4gICAgICAgIFwiXCIsXHJcbiAgICB9KSk7XHJcbiAgfSwgW3NlbGVjdGVkQ3VzdG9tZXJdKTtcclxuXHJcbiAgY29uc3QgbGluZVRvdGFscyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3Qgc3VidG90YWwgPSBsaW5lSXRlbXMucmVkdWNlKChzdW0sIGl0ZW0pID0+IHtcclxuICAgICAgcmV0dXJuIHN1bSArIHRvTnVtYmVyKGl0ZW0ucXVhbnRpdHkpICogdG9OdW1iZXIoaXRlbS51bml0UHJpY2UpO1xyXG4gICAgfSwgMCk7XHJcblxyXG4gICAgY29uc3Qgc2hpcHBpbmdGZWUgPSB0b051bWJlcihmb3JtRGF0YS5zaGlwcGluZ0ZlZSk7XHJcbiAgICBjb25zdCB0YXggPSB0b051bWJlcihmb3JtRGF0YS50YXgpO1xyXG4gICAgY29uc3QgZGlzY291bnQgPSB0b051bWJlcihmb3JtRGF0YS5kaXNjb3VudCk7XHJcbiAgICBjb25zdCBncmFuZFRvdGFsID0gTWF0aC5tYXgoc3VidG90YWwgKyBzaGlwcGluZ0ZlZSArIHRheCAtIGRpc2NvdW50LCAwKTtcclxuXHJcbiAgICByZXR1cm4geyBzdWJ0b3RhbCwgc2hpcHBpbmdGZWUsIHRheCwgZGlzY291bnQsIGdyYW5kVG90YWwgfTtcclxuICB9LCBbbGluZUl0ZW1zLCBmb3JtRGF0YS5zaGlwcGluZ0ZlZSwgZm9ybURhdGEudGF4LCBmb3JtRGF0YS5kaXNjb3VudF0pO1xyXG5cclxuICBjb25zdCBoYW5kbGVGb3JtQ2hhbmdlID0gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCB7IG5hbWUsIHZhbHVlIH0gPSBldmVudC50YXJnZXQ7XHJcbiAgICBzZXRGb3JtRGF0YSgocHJldikgPT4gKHsgLi4ucHJldiwgW25hbWVdOiB2YWx1ZSB9KSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlTGluZUl0ZW1DaGFuZ2UgPSAoaW5kZXgsIGtleSwgdmFsdWUpID0+IHtcclxuICAgIHNldExpbmVJdGVtcygocHJldikgPT4ge1xyXG4gICAgICBjb25zdCBuZXh0ID0gWy4uLnByZXZdO1xyXG4gICAgICBjb25zdCBpdGVtID0geyAuLi5uZXh0W2luZGV4XSB9O1xyXG5cclxuICAgICAgaWYgKGtleSA9PT0gXCJwcm9kdWN0SWRcIikge1xyXG4gICAgICAgIGl0ZW0ucHJvZHVjdElkID0gdmFsdWU7XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdCA9IHByb2R1Y3RzLmZpbmQoKHApID0+IFN0cmluZyhwLmlkKSA9PT0gU3RyaW5nKHZhbHVlKSk7XHJcbiAgICAgICAgY29uc3Qgc2l6ZU9wdGlvbnMgPSBnZXRTaXplT3B0aW9ucyhwcm9kdWN0KTtcclxuICAgICAgICBpdGVtLnVuaXRQcmljZSA9IHRvTnVtYmVyKHByb2R1Y3Q/LnByaWNlKTtcclxuICAgICAgICBpdGVtLnNpemUgPSBzaXplT3B0aW9uc1swXT8uc2l6ZSB8fCBcIlwiO1xyXG4gICAgICAgIGNvbnN0IG1heFF0eUZvclNpemUgPVxyXG4gICAgICAgICAgc2l6ZU9wdGlvbnNbMF0/LnF0eSA9PT0gbnVsbFxyXG4gICAgICAgICAgICA/IG51bGxcclxuICAgICAgICAgICAgOiBNYXRoLm1heCgxLCBOdW1iZXIoc2l6ZU9wdGlvbnNbMF0/LnF0eSB8fCAwKSk7XHJcbiAgICAgICAgaWYgKG1heFF0eUZvclNpemUgIT09IG51bGwpIHtcclxuICAgICAgICAgIGl0ZW0ucXVhbnRpdHkgPSBNYXRoLm1heChcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgTWF0aC5taW4odG9OdW1iZXIoaXRlbS5xdWFudGl0eSksIG1heFF0eUZvclNpemUpLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInNpemVcIikge1xyXG4gICAgICAgIGl0ZW0uc2l6ZSA9IHZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKFxyXG4gICAgICAgICAgKHApID0+IFN0cmluZyhwLmlkKSA9PT0gU3RyaW5nKGl0ZW0ucHJvZHVjdElkKSxcclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IHNpemVPcHRpb25zID0gZ2V0U2l6ZU9wdGlvbnMocHJvZHVjdCk7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRTaXplT3B0aW9uID0gc2l6ZU9wdGlvbnMuZmluZChcclxuICAgICAgICAgIChvcHRpb24pID0+IG9wdGlvbi5zaXplID09PSB2YWx1ZSxcclxuICAgICAgICApO1xyXG4gICAgICAgIGlmIChzZWxlY3RlZFNpemVPcHRpb24gJiYgc2VsZWN0ZWRTaXplT3B0aW9uLnF0eSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgY29uc3QgbWF4UXR5Rm9yU2l6ZSA9IE1hdGgubWF4KFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICBOdW1iZXIoc2VsZWN0ZWRTaXplT3B0aW9uLnF0eSB8fCAwKSxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBpdGVtLnF1YW50aXR5ID0gTWF0aC5tYXgoXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIE1hdGgubWluKHRvTnVtYmVyKGl0ZW0ucXVhbnRpdHkpLCBtYXhRdHlGb3JTaXplKSxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJxdWFudGl0eVwiKSB7XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdCA9IHByb2R1Y3RzLmZpbmQoXHJcbiAgICAgICAgICAocCkgPT4gU3RyaW5nKHAuaWQpID09PSBTdHJpbmcoaXRlbS5wcm9kdWN0SWQpLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29uc3Qgc2l6ZU9wdGlvbnMgPSBnZXRTaXplT3B0aW9ucyhwcm9kdWN0KTtcclxuICAgICAgICBjb25zdCBzZWxlY3RlZFNpemVPcHRpb24gPSBzaXplT3B0aW9ucy5maW5kKFxyXG4gICAgICAgICAgKG9wdGlvbikgPT4gb3B0aW9uLnNpemUgPT09IGl0ZW0uc2l6ZSxcclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IHBhcnNlZFF0eSA9IE1hdGgubWF4KDEsIHRvTnVtYmVyKHZhbHVlKSk7XHJcbiAgICAgICAgaWYgKHNlbGVjdGVkU2l6ZU9wdGlvbiAmJiBzZWxlY3RlZFNpemVPcHRpb24ucXR5ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBjb25zdCBtYXhRdHlGb3JTaXplID0gTWF0aC5tYXgoXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIE51bWJlcihzZWxlY3RlZFNpemVPcHRpb24ucXR5IHx8IDApLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIGl0ZW0ucXVhbnRpdHkgPSBNYXRoLm1pbihwYXJzZWRRdHksIG1heFF0eUZvclNpemUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpdGVtLnF1YW50aXR5ID0gcGFyc2VkUXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwidW5pdFByaWNlXCIpIHtcclxuICAgICAgICBpdGVtLnVuaXRQcmljZSA9IE1hdGgubWF4KDAsIHRvTnVtYmVyKHZhbHVlKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG5leHRbaW5kZXhdID0gaXRlbTtcclxuICAgICAgcmV0dXJuIG5leHQ7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBhZGRMaW5lSXRlbSA9ICgpID0+IHtcclxuICAgIHNldExpbmVJdGVtcygocHJldikgPT4gWy4uLnByZXYsIGNyZWF0ZUVtcHR5SXRlbSgpXSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVtb3ZlTGluZUl0ZW0gPSAoaW5kZXgpID0+IHtcclxuICAgIHNldExpbmVJdGVtcygocHJldikgPT4ge1xyXG4gICAgICBpZiAocHJldi5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gcHJldjtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHByZXYuZmlsdGVyKChfLCBpKSA9PiBpICE9PSBpbmRleCk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBtYXBzSHJlZiA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgaWYgKCFmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3M/LnRyaW0oKSkge1xyXG4gICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9zZWFyY2gvP2FwaT0xJnF1ZXJ5PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGZvcm1EYXRhLnNoaXBwaW5nQWRkcmVzcy50cmltKCkpfWA7XHJcbiAgfSwgW2Zvcm1EYXRhLnNoaXBwaW5nQWRkcmVzc10pO1xyXG5cclxuICBjb25zdCBoYW5kbGVTdWJtaXQgPSBhc3luYyAoZXZlbnQpID0+IHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgY29uc3QgdmFsaWRJdGVtcyA9IGxpbmVJdGVtcy5maWx0ZXIoXHJcbiAgICAgIChpdGVtKSA9PiBpdGVtLnByb2R1Y3RJZCAmJiB0b051bWJlcihpdGVtLnF1YW50aXR5KSA+IDAsXHJcbiAgICApO1xyXG5cclxuICAgIGlmICghZm9ybURhdGEudXNlcklkKSB7XHJcbiAgICAgIGFsZXJ0KFwiUGxlYXNlIHNlbGVjdCBhIGN1c3RvbWVyLlwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YWxpZEl0ZW1zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBhbGVydChcIkF0IGxlYXN0IG9uZSBwcm9kdWN0IGxpbmUgaXRlbSBpcyByZXF1aXJlZC5cIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdmFsaWRJdGVtcykge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZFByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKFxyXG4gICAgICAgIChwcm9kdWN0KSA9PiBTdHJpbmcocHJvZHVjdC5pZCkgPT09IFN0cmluZyhpdGVtLnByb2R1Y3RJZCksXHJcbiAgICAgICk7XHJcbiAgICAgIGNvbnN0IHNpemVFbnRyaWVzID0gZ2V0U2l6ZUVudHJpZXMoc2VsZWN0ZWRQcm9kdWN0KTtcclxuXHJcbiAgICAgIGlmIChzaXplRW50cmllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgaWYgKCFpdGVtLnNpemUpIHtcclxuICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIHNlbGVjdCBhIHNpemUgZm9yIGFsbCBwcm9kdWN0cy5cIik7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzZWxlY3RlZFNpemUgPSBzaXplRW50cmllcy5maW5kKFxyXG4gICAgICAgICAgKGVudHJ5KSA9PiBlbnRyeS5zaXplID09PSBTdHJpbmcoaXRlbS5zaXplKS50b1VwcGVyQ2FzZSgpLFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICghc2VsZWN0ZWRTaXplKSB7XHJcbiAgICAgICAgICBhbGVydChcclxuICAgICAgICAgICAgYFNlbGVjdGVkIHNpemUgaXMgbm90IGF2YWlsYWJsZSBmb3IgJHtzZWxlY3RlZFByb2R1Y3Q/Lm5hbWUgfHwgXCJ0aGlzIHByb2R1Y3RcIn0uYCxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodG9OdW1iZXIoaXRlbS5xdWFudGl0eSkgPiBzZWxlY3RlZFNpemUucXR5KSB7XHJcbiAgICAgICAgICBhbGVydChcclxuICAgICAgICAgICAgYCR7c2VsZWN0ZWRQcm9kdWN0Py5uYW1lIHx8IFwiUHJvZHVjdFwifSAoJHtzZWxlY3RlZFNpemUuc2l6ZX0pIGhhcyBvbmx5ICR7c2VsZWN0ZWRTaXplLnF0eX0gaW4gc3RvY2suYCxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U3VibWl0dGluZyh0cnVlKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBvcmRlclBheWxvYWQgPSB7XHJcbiAgICAgICAgdXNlcklkOiBOdW1iZXIoZm9ybURhdGEudXNlcklkKSxcclxuICAgICAgICBzdGF0dXM6IGZvcm1EYXRhLnN0YXR1cyxcclxuICAgICAgICBwYXltZW50TWV0aG9kOiBmb3JtRGF0YS5wYXltZW50TWV0aG9kLFxyXG4gICAgICAgIHBheW1lbnRTdGF0dXM6IGZvcm1EYXRhLnBheW1lbnRTdGF0dXMsXHJcbiAgICAgICAgdHJhbnNhY3Rpb25JZDogZm9ybURhdGEudHJhbnNhY3Rpb25JZCB8fCBudWxsLFxyXG4gICAgICAgIHNoaXBwaW5nTmFtZTogZm9ybURhdGEuc2hpcHBpbmdOYW1lIHx8IG51bGwsXHJcbiAgICAgICAgc2hpcHBpbmdQaG9uZTogZm9ybURhdGEuc2hpcHBpbmdQaG9uZSB8fCBudWxsLFxyXG4gICAgICAgIHNoaXBwaW5nTWV0aG9kOiBmb3JtRGF0YS5zaGlwcGluZ01ldGhvZCxcclxuICAgICAgICB0cmFja2luZ051bWJlcjogZm9ybURhdGEudHJhY2tpbmdOdW1iZXIgfHwgbnVsbCxcclxuICAgICAgICBzdWJ0b3RhbDogbGluZVRvdGFscy5zdWJ0b3RhbC50b0ZpeGVkKDIpLFxyXG4gICAgICAgIHNoaXBwaW5nRmVlOiBsaW5lVG90YWxzLnNoaXBwaW5nRmVlLnRvRml4ZWQoMiksXHJcbiAgICAgICAgdGF4OiBsaW5lVG90YWxzLnRheC50b0ZpeGVkKDIpLFxyXG4gICAgICAgIGRpc2NvdW50OiBsaW5lVG90YWxzLmRpc2NvdW50LnRvRml4ZWQoMiksXHJcbiAgICAgICAgdG90YWxBbW91bnQ6IGxpbmVUb3RhbHMuZ3JhbmRUb3RhbC50b0ZpeGVkKDIpLFxyXG4gICAgICAgIHNoaXBwaW5nQWRkcmVzczogZm9ybURhdGEuc2hpcHBpbmdBZGRyZXNzIHx8IG51bGwsXHJcbiAgICAgICAgbGluZUl0ZW1zOiB2YWxpZEl0ZW1zLm1hcCgoaXRlbSkgPT4gKHtcclxuICAgICAgICAgIHByb2R1Y3RJZDogTnVtYmVyKGl0ZW0ucHJvZHVjdElkKSxcclxuICAgICAgICAgIHNpemU6IGl0ZW0uc2l6ZSB8fCBudWxsLFxyXG4gICAgICAgICAgcXVhbnRpdHk6IE1hdGgubWF4KDEsIHRvTnVtYmVyKGl0ZW0ucXVhbnRpdHkpKSxcclxuICAgICAgICAgIHVuaXRQcmljZTogTWF0aC5tYXgoMCwgdG9OdW1iZXIoaXRlbS51bml0UHJpY2UpKS50b0ZpeGVkKDIpLFxyXG4gICAgICAgIH0pKSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IHN1Ym1pdEZvcm0gPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgc3VibWl0Rm9ybS5hcHBlbmQoXCJwYXlsb2FkXCIsIEpTT04uc3RyaW5naWZ5KG9yZGVyUGF5bG9hZCkpO1xyXG5cclxuICAgICAgY29uc3Qgb3JkZXJSZXMgPSBhd2FpdCBmZXRjaChcIi9hZG1pbi9jb250ZXh0L29yZGVyLWNyZWF0ZS9zdWJtaXRcIiwge1xyXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICBib2R5OiBzdWJtaXRGb3JtLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IG9yZGVyRGF0YSA9IGF3YWl0IG9yZGVyUmVzLmpzb24oKTtcclxuICAgICAgaWYgKCFvcmRlclJlcy5vaykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihvcmRlckRhdGE/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gY3JlYXRlIG9yZGVyXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKFxyXG4gICAgICAgIGAvYWRtaW4vcmVzb3VyY2VzL09yZGVycy9yZWNvcmRzLyR7b3JkZXJEYXRhLmlkfS9zaG93YCxcclxuICAgICAgKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGFsZXJ0KGVycm9yLm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gY3JlYXRlIG9yZGVyXCIpO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0U3VibWl0dGluZyhmYWxzZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3BhZ2VTdHlsZX0+XHJcbiAgICAgIDxzdHlsZT57YFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIGJvZHksXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgI2FwcCxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSAuYWRtaW5qc19MYXlvdXQsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLWNzcz1cImxheW91dFwiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBtYWluLFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlLFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlICNhcHAsXHJcbiAgICAgICAgYm9keS5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgLmFkbWluanNfTGF5b3V0LFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLXRlc3RpZD1cImxheW91dFwiXSxcclxuICAgICAgICBib2R5LmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS1jc3M9XCJsYXlvdXRcIl0sXHJcbiAgICAgICAgYm9keS5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgbWFpbiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSAjYXBwID4gZGl2LFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlICNhcHAgPiBkaXYgPiBkaXYsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgI2FwcCA+IGRpdiA+IGRpdiA+IGRpdixcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSAuYWRtaW5qc19NYWluLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIC5hZG1pbmpzX01haW4gPiBkaXYsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgLmFkbWluanNfTWFpbiA+IGRpdiA+IGRpdixcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS1jc3MqPVwiYWN0aW9uLWNvbnRlbnRcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtdGVzdGlkKj1cImNvbnRlbnRcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtY3NzJD1cIi1jb250ZW50XCJdIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmZmZmYgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmYgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLXRlc3RpZD1cInNpZGViYXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgLmFkbWluanNfU2lkZWJhcixcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBzZWN0aW9uW2RhdGEtY3NzPVwic2lkZWJhclwiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBhc2lkZVtkYXRhLWNzcz1cInNpZGViYXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgbmF2W2RhdGEtY3NzPVwic2lkZWJhclwiXSB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICB3aWR0aDogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgbWluLXdpZHRoOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBtYXgtd2lkdGg6IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYm9yZGVyOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS10ZXN0aWQ9XCJ0b3BiYXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgLmFkbWluanNfVG9wQmFyLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIGhlYWRlcltkYXRhLWNzcz1cInRvcGJhclwiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBzZWN0aW9uW2RhdGEtY3NzPVwidG9wYmFyXCJdIHtcclxuICAgICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLXRlc3RpZD1cImFjdGlvbi1oZWFkZXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtY3NzKj1cImFjdGlvbi1oZWFkZXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtdGVzdGlkKj1cImJyZWFkY3J1bWJzXCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLWNzcyo9XCJicmVhZGNydW1ic1wiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSAuYWRtaW5qc19CcmVhZGNydW1iIHtcclxuICAgICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIC5hZG1pbmpzX0xheW91dCxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS10ZXN0aWQ9XCJsYXlvdXRcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtY3NzPVwibGF5b3V0XCJdIHtcclxuICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSAuYWRtaW5qc19MYXlvdXQgPiAqOm5vdChbZGF0YS10ZXN0aWQ9XCJzaWRlYmFyXCJdKSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS10ZXN0aWQ9XCJsYXlvdXRcIl0gPiAqOm5vdChbZGF0YS10ZXN0aWQ9XCJzaWRlYmFyXCJdKSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS1jc3M9XCJsYXlvdXRcIl0gPiAqOm5vdChbZGF0YS10ZXN0aWQ9XCJzaWRlYmFyXCJdKSB7XHJcbiAgICAgICAgICB3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgbWF4LXdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBib2R5OjpiZWZvcmUsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmU6OmJlZm9yZSxcclxuICAgICAgICBib2R5LmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZTo6YmVmb3JlIHtcclxuICAgICAgICAgIGNvbnRlbnQ6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICR7cmVzcG9uc2l2ZUNzc31cclxuICAgICAgYH08L3N0eWxlPlxyXG5cclxuICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0gc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCIxNnB4XCIgfX0+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWxheW91dFwiIHN0eWxlPXtsYXlvdXRTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGFja1N0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5DdXN0b21lciBEZXRhaWxzPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TZWxlY3QgQ3VzdG9tZXIgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJ1c2VySWRcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudXNlcklkfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtsb2FkaW5nIHx8IHNlc3Npb25Vc2VyPy5yb2xlID09PSBcInVzZXJcIn1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtsb2FkaW5nID8gXCJMb2FkaW5nIGN1c3RvbWVycy4uLlwiIDogXCJTZWxlY3QgYSBjdXN0b21lclwifVxyXG4gICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAge3VzZXJzLm1hcCgodXNlcikgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXt1c2VyLmlkfSB2YWx1ZT17dXNlci5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICB7dXNlci5uYW1lfSAoI3t1c2VyLmlkfSlcclxuICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVySW5mb1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVyUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+Q3VzdG9tZXIgTmFtZSAmIElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17c3Ryb25nU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZEN1c3RvbWVyXHJcbiAgICAgICAgICAgICAgICAgICAgICA/IGAke3NlbGVjdGVkQ3VzdG9tZXIubmFtZX0gKCMke3NlbGVjdGVkQ3VzdG9tZXIuaWR9KWBcclxuICAgICAgICAgICAgICAgICAgICAgIDogXCItXCJ9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5FbWFpbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0cm9uZ1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRDdXN0b21lcj8uZW1haWwgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17Y3VzdG9tZXJSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5QaG9uZSBOdW1iZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtzdHJvbmdTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkQ3VzdG9tZXI/LnBob25lIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEN1c3RvbWVyPy5tb2JpbGUgfHxcclxuICAgICAgICAgICAgICAgICAgICAgIFwiTm90IGF2YWlsYWJsZVwifVxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVyUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+T3JkZXIgSGlzdG9yeTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0cm9uZ1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICB7Y3VzdG9tZXJPcmRlckNvdW50fSBwcmV2aW91cyBvcmRlcnNcclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5QYXltZW50ICYgQmlsbGluZzwvaDI+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+UGF5bWVudCBPcHRpb25zPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3BheW1lbnRPcHRpb25HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICB7cGF5bWVudE9wdGlvbnMubWFwKChvcHRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmUgPSBmb3JtRGF0YS5wYXltZW50TWV0aG9kID09PSBvcHRpb24udmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17b3B0aW9uLnZhbHVlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3BheW1lbnRPcHRpb25TdHlsZShhY3RpdmUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNldEZvcm1EYXRhKChwcmV2KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ucHJldixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheW1lbnRNZXRob2Q6IG9wdGlvbi52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57b3B0aW9uLmljb259PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57b3B0aW9uLmxhYmVsfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMCB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItZ3JpZC0yXCIgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNlbGVjdGVkIE1ldGhvZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5wYXltZW50TWV0aG9kfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlYWRPbmx5XHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+UGF5bWVudCBTdGF0dXM8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInBheW1lbnRTdGF0dXNcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5wYXltZW50U3RhdHVzfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBlbmRpbmdcIj5QZW5kaW5nPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInBhaWRcIj5QYWlkPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMCB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlRyYW5zYWN0aW9uIElEPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICBuYW1lPVwidHJhbnNhY3Rpb25JZFwiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS50cmFuc2FjdGlvbklkfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZS5nLiBUWE4tMjAyNi0wMDAxMjRcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdGFja1N0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICBnYXA6IFwiOHB4XCIsXHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxoMiBzdHlsZT17eyAuLi5zZWN0aW9uVGl0bGVTdHlsZSwgbWFyZ2luQm90dG9tOiAwIH19PlxyXG4gICAgICAgICAgICAgICAgICBQcm9kdWN0IExpbmUgSXRlbXMgKFJlcXVpcmVkKVxyXG4gICAgICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2FkZExpbmVJdGVtfVxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17YWRkQnV0dG9uU3R5bGV9XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICsgQWRkIEl0ZW1cclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTIgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ2FwOiBcIjEwcHhcIiB9fT5cclxuICAgICAgICAgICAgICAgIHtsaW5lSXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZFByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKFxyXG4gICAgICAgICAgICAgICAgICAgIChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhpdGVtLnByb2R1Y3RJZCksXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHNpemVPcHRpb25zID0gZ2V0U2l6ZU9wdGlvbnMoc2VsZWN0ZWRQcm9kdWN0KTtcclxuICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRTaXplT3B0aW9uID0gc2l6ZU9wdGlvbnMuZmluZChcclxuICAgICAgICAgICAgICAgICAgICAob3B0aW9uKSA9PiBvcHRpb24uc2l6ZSA9PT0gaXRlbS5zaXplLFxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICBjb25zdCBzaXplU3RvY2tUZXh0ID0gZ2V0U2l6ZUVudHJpZXMoc2VsZWN0ZWRQcm9kdWN0KVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoKGVudHJ5KSA9PiBgJHtlbnRyeS5zaXplfTogJHtlbnRyeS5xdHl9YClcclxuICAgICAgICAgICAgICAgICAgICAuam9pbihcIiB8IFwiKTtcclxuICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbVRvdGFsID1cclxuICAgICAgICAgICAgICAgICAgICB0b051bWJlcihpdGVtLnF1YW50aXR5KSAqIHRvTnVtYmVyKGl0ZW0udW5pdFByaWNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2BsaW5lLWl0ZW0tJHtpbmRleH1gfSBzdHlsZT17bGluZUl0ZW1Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtsaW5lSXRlbVRvcFN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+UHJvZHVjdDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2l0ZW0ucHJvZHVjdElkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTGluZUl0ZW1DaGFuZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwcm9kdWN0SWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQudmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+U2VsZWN0IHByb2R1Y3Q8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwcm9kdWN0cy5tYXAoKHByb2R1Y3QpID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e3Byb2R1Y3QuaWR9IHZhbHVlPXtwcm9kdWN0LmlkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdC5uYW1lfSAoU0tVOiB7cHJvZHVjdC5za3V9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17cmVtb3ZlQnV0dG9uU3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcmVtb3ZlTGluZUl0ZW0oaW5kZXgpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVtb3ZlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cHJvZHVjdFByZXZpZXdTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZFByb2R1Y3Q/LmltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17c2VsZWN0ZWRQcm9kdWN0LmltYWdlVXJsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0PXtzZWxlY3RlZFByb2R1Y3QubmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbWFnZVN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uaW1hZ2VTdHlsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBcIjExcHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gaW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ2FwOiBcIjNweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiBcIjE0cHhcIiwgY29sb3I6IFwiI2Y4ZmFmY1wiIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkUHJvZHVjdD8ubmFtZSB8fCBcIlNlbGVjdCBhIHByb2R1Y3RcIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogXCIxMnB4XCIsIGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNLVS9JRDp7XCIgXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRQcm9kdWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYCR7c2VsZWN0ZWRQcm9kdWN0LnNrdX0gLyAjJHtzZWxlY3RlZFByb2R1Y3QuaWR9YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiLVwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogXCIxMnB4XCIsIGNvbG9yOiBcIiNjYmQ1ZTFcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNpemU6IHtpdGVtLnNpemUgfHwgXCItXCJ9IHwgUXR5OiB7aXRlbS5xdWFudGl0eX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge3NpemVTdG9ja1RleHQgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogXCIxMXB4XCIsIGNvbG9yOiBcIiNmYWNjMTVcIiB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBdmFpbGFibGU6IHtzaXplU3RvY2tUZXh0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICkgOiBudWxsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TaXplPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnNpemUgfHwgXCJcIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTGluZUl0ZW1DaGFuZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNpemVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjdCBzaXplPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge3NpemVPcHRpb25zLm1hcCgoc2l6ZU9wdGlvbikgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3NpemVPcHRpb24uc2l6ZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NpemVPcHRpb24uc2l6ZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NpemVPcHRpb24ucXR5ID09PSBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBzaXplT3B0aW9uLnNpemVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGAke3NpemVPcHRpb24uc2l6ZX0gKCR7c2l6ZU9wdGlvbi5xdHl9KWB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItZ3JpZC0yXCIgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5RdWFudGl0eTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4PXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRTaXplT3B0aW9uPy5xdHkgPT09IG51bGwgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRTaXplT3B0aW9uPy5xdHkgPT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBNYXRoLm1heChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTnVtYmVyKHNlbGVjdGVkU2l6ZU9wdGlvbi5xdHkgfHwgMCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aXRlbS5xdWFudGl0eX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxpbmVJdGVtQ2hhbmdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicXVhbnRpdHlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQudmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+VW5pdCBQcmljZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2l0ZW0udW5pdFByaWNlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTGluZUl0ZW1DaGFuZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1bml0UHJpY2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQudmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAuLi50b3RhbHNSb3dTdHlsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdCb3R0b206IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5MaW5lIFRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGNvbG9yOiBcIiNmOGZhZmNcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0TW9uZXkoaXRlbVRvdGFsKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+U2hpcHBpbmcgJiBUcmFja2luZzwvaDI+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1ncmlkLTJcIiBzdHlsZT17Z3JpZDJTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+U2hpcHBpbmcgQ29udGFjdCBOYW1lICo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2hpcHBpbmdOYW1lXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuc2hpcHBpbmdOYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiUmVjZWl2ZXIgZnVsbCBuYW1lXCJcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+U2hpcHBpbmcgUGhvbmUgTnVtYmVyICo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2hpcHBpbmdQaG9uZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnNoaXBwaW5nUGhvbmV9XHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCIwN1ggWFhYIFhYWFhcIlxyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEwIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+U2hpcHBpbmcgQWRkcmVzcyAqPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDx0ZXh0YXJlYVxyXG4gICAgICAgICAgICAgICAgICBuYW1lPVwic2hpcHBpbmdBZGRyZXNzXCJcclxuICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnNoaXBwaW5nQWRkcmVzc31cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgLi4uaW5wdXRTdHlsZSxcclxuICAgICAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6IFwiODZweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc2l6ZTogXCJ2ZXJ0aWNhbFwiLFxyXG4gICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkhvdXNlIG51bWJlciwgc3RyZWV0LCBjaXR5LCBwb3N0YWwgY29kZVwiXHJcbiAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAge21hcHNIcmVmID8gKFxyXG4gICAgICAgICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgICAgICAgIGhyZWY9e21hcHNIcmVmfVxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXHJcbiAgICAgICAgICAgICAgICAgICAgcmVsPVwibm9yZWZlcnJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e21hcExpbmtTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIE9wZW4gb24gR29vZ2xlIE1hcHNcclxuICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgKSA6IG51bGx9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMCB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItZ3JpZC0yXCIgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIE1ldGhvZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxzZWxlY3RcclxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2hpcHBpbmdNZXRob2RcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5zaGlwcGluZ01ldGhvZH1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIHtzaGlwcGluZ01ldGhvZHMubWFwKChpdGVtKSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17aXRlbX0gdmFsdWU9e2l0ZW19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7aXRlbX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlRyYWNraW5nIE51bWJlcjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJ0cmFja2luZ051bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnRyYWNraW5nTnVtYmVyfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVFJLLVhYWFhYWFwiXHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9Pk9yZGVyIFN1bW1hcnkgLyBUb3RhbHM8L2gyPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItZ3JpZC0yXCIgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIEZlZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcclxuICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcclxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwic2hpcHBpbmdGZWVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5zaGlwcGluZ0ZlZX1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlRheCAvIFZBVDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcclxuICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcclxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwidGF4XCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudGF4fVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMCB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PkRpc2NvdW50IC8gQ291cG9uPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuMDFcIlxyXG4gICAgICAgICAgICAgICAgICBtaW49XCIwXCJcclxuICAgICAgICAgICAgICAgICAgbmFtZT1cImRpc2NvdW50XCJcclxuICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLmRpc2NvdW50fVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTIgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxzUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PlN1YnRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkobGluZVRvdGFscy5zdWJ0b3RhbCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxzUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PlNoaXBwaW5nIEZlZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGxpbmVUb3RhbHMuc2hpcHBpbmdGZWUpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5UYXggLyBWQVQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leShsaW5lVG90YWxzLnRheCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxzUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PkRpc2NvdW50PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHN0cm9uZz4tIHtmb3JtYXRNb25leShsaW5lVG90YWxzLmRpc2NvdW50KX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuPkdyYW5kIFRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e2Zvcm1hdE1vbmV5KGxpbmVUb3RhbHMuZ3JhbmRUb3RhbCl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzZWN1cml0eUNoaXBXcmFwU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c2VjdXJpdHlDaGlwU3R5bGV9PlNlY3VyZSBQYXltZW50IFByb3RlY3RlZDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c2VjdXJpdHlDaGlwU3R5bGV9PkVuY3J5cHRlZCBDaGVja291dCBDaGFubmVsPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzZWN1cml0eUNoaXBTdHlsZX0+VHJ1c3RlZCBEZWxpdmVyeSBUcmFja2luZzwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IC4uLmNhcmRTdHlsZSwgcGFkZGluZ1RvcDogXCIxNHB4XCIgfX0+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXthY3Rpb25CYXJTdHlsZX0+XHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICBzdHlsZT17YWN0aW9uQnV0dG9uU3R5bGUoZmFsc2UpfVxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHdpbmRvdy5oaXN0b3J5LmJhY2soKX1cclxuICAgICAgICAgICAgICBkaXNhYmxlZD17c3VibWl0dGluZ31cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIENhbmNlbFxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIlxyXG4gICAgICAgICAgICAgIHN0eWxlPXthY3Rpb25CdXR0b25TdHlsZSh0cnVlKX1cclxuICAgICAgICAgICAgICBkaXNhYmxlZD17c3VibWl0dGluZ31cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIHtzdWJtaXR0aW5nID8gXCJDcmVhdGluZyBPcmRlci4uLlwiIDogXCJDcmVhdGUgT3JkZXJcIn1cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9mb3JtPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9yZGVyQ3JlYXRlO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgcGFnZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbiAgY29sb3I6IFwiI2UyZThmMFwiLFxyXG59O1xyXG5cclxuY29uc3QgY2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxOHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMilcIixcclxuICBiYWNrZ3JvdW5kOlxyXG4gICAgXCJsaW5lYXItZ3JhZGllbnQoMTU1ZGVnLCByZ2JhKDEwLCAyMywgNDgsIDAuOTQpIDAlLCByZ2JhKDgsIDE4LCAzOCwgMC45NCkgMTAwJSlcIixcclxuICBib3hTaGFkb3c6IFwiMCAxNHB4IDMwcHggcmdiYSgyLCA2LCAyMywgMC4yKVwiLFxyXG4gIHBhZGRpbmc6IFwiMThweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaGVhZGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IGhlYWRpbmdTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZvbnRTaXplOiBcIjM0cHhcIixcclxuICBsaW5lSGVpZ2h0OiAxLjEsXHJcbn07XHJcblxyXG5jb25zdCBzdWJUZXh0U3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBtYXJnaW5Ub3A6IFwiNHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBiYWRnZVN0eWxlID0gKHN0YXR1cykgPT4ge1xyXG4gIGNvbnN0IHZhbCA9IFN0cmluZyhzdGF0dXMgfHwgXCJwZW5kaW5nXCIpLnRvTG93ZXJDYXNlKCk7XHJcbiAgY29uc3Qgc3R5bGVCeVN0YXR1cyA9IHtcclxuICAgIHBlbmRpbmc6IHsgYmc6IFwiI2ZlZjNjN1wiLCBmZzogXCIjN2MyZDEyXCIgfSxcclxuICAgIHBhaWQ6IHsgYmc6IFwiI2JiZjdkMFwiLCBmZzogXCIjMTQ1MzJkXCIgfSxcclxuICAgIHByb2Nlc3Npbmc6IHsgYmc6IFwiI2JmZGJmZVwiLCBmZzogXCIjMWUzYThhXCIgfSxcclxuICAgIHNoaXBwZWQ6IHsgYmc6IFwiI2RkZDZmZVwiLCBmZzogXCIjNGMxZDk1XCIgfSxcclxuICAgIGNvbXBsZXRlZDogeyBiZzogXCIjYTdmM2QwXCIsIGZnOiBcIiMwNjRlM2JcIiB9LFxyXG4gICAgY2FuY2VsbGVkOiB7IGJnOiBcIiNmZWNhY2FcIiwgZmc6IFwiIzdmMWQxZFwiIH0sXHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgc2VsZWN0ZWQgPSBzdHlsZUJ5U3RhdHVzW3ZhbF0gfHwgc3R5bGVCeVN0YXR1cy5wZW5kaW5nO1xyXG4gIHJldHVybiB7XHJcbiAgICBkaXNwbGF5OiBcImlubGluZS1mbGV4XCIsXHJcbiAgICBwYWRkaW5nOiBcIjZweCAxMnB4XCIsXHJcbiAgICBib3JkZXJSYWRpdXM6IFwiOTk5cHhcIixcclxuICAgIGZvbnRTaXplOiBcIjExcHhcIixcclxuICAgIGZvbnRXZWlnaHQ6IDgwMCxcclxuICAgIGxldHRlclNwYWNpbmc6IFwiMC4wOGVtXCIsXHJcbiAgICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gICAgYmFja2dyb3VuZDogc2VsZWN0ZWQuYmcsXHJcbiAgICBjb2xvcjogc2VsZWN0ZWQuZmcsXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IHNlY3Rpb25UaXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogXCIwIDAgMTJweCAwXCIsXHJcbiAgY29sb3I6IFwiI2Y1ZGY5MFwiLFxyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjExZW1cIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG59O1xyXG5cclxuY29uc3QgZ3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwibWlubWF4KDMwMHB4LCAxZnIpIG1pbm1heCgzMjBweCwgMWZyKVwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvR3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9Sb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjhweFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IHRhYmxlU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGxpbmVJdGVtU3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjIpXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE0cHhcIixcclxuICBwYWRkaW5nOiBcIjEwcHhcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTUsIDIzLCA0MiwgMC40NClcIixcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjYwcHggMWZyIGF1dG9cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjYwcHhcIixcclxuICBoZWlnaHQ6IFwiNjBweFwiLFxyXG4gIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjIpXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjMGYxNzJhXCIsXHJcbn07XHJcblxyXG5jb25zdCB0b3RhbEJveFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHRvdGFsUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjdweFwiLFxyXG59O1xyXG5cclxuY29uc3QgZ3JhbmRTdHlsZSA9IHtcclxuICAuLi50b3RhbFJvd1N0eWxlLFxyXG4gIGJvcmRlckJvdHRvbTogXCJub25lXCIsXHJcbiAgcGFkZGluZ1RvcDogXCI2cHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgZm9udFNpemU6IFwiMThweFwiLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IGVtcHR5U3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgcGFkZGluZzogXCIxNHB4XCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0TW9uZXkgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBuID0gTnVtYmVyKHZhbHVlIHx8IDApO1xyXG4gIHJldHVybiBgUnMuICR7bi50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiBcIi1cIjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGR0ID0gbmV3IERhdGUodmFsdWUpO1xyXG4gIGlmIChOdW1iZXIuaXNOYU4oZHQuZ2V0VGltZSgpKSkge1xyXG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZHQudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBkYXRlU3R5bGU6IFwibWVkaXVtXCIsXHJcbiAgICB0aW1lU3R5bGU6IFwic2hvcnRcIixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IE9yZGVyU2hvdyA9ICh7IHJlY29yZCB9KSA9PiB7XHJcbiAgY29uc3QgW2RldGFpbHMsIHNldERldGFpbHNdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XHJcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgY29uc3Qgb3JkZXJJZCA9IHJlY29yZD8ucGFyYW1zPy5pZCB8fCByZWNvcmQ/LmlkO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKCFvcmRlcklkKSB7XHJcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICBzZXRFcnJvcihcIk9yZGVyIGlkIG5vdCBmb3VuZFwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxvYWREZXRhaWxzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHNldEVycm9yKFwiXCIpO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXHJcbiAgICAgICAgICBgL2FkbWluL2NvbnRleHQvb3JkZXJzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhvcmRlcklkKSl9L2RldGFpbHNgLFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihwYXlsb2FkPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgb3JkZXIgZGV0YWlsc1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldERldGFpbHMocGF5bG9hZCk7XHJcbiAgICAgIH0gY2F0Y2ggKGZldGNoRXJyb3IpIHtcclxuICAgICAgICBzZXRFcnJvcihmZXRjaEVycm9yPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgb3JkZXIgZGV0YWlsc1wiKTtcclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkRGV0YWlscygpO1xyXG4gIH0sIFtvcmRlcklkXSk7XHJcblxyXG4gIGNvbnN0IHRvdGFscyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3Qgc3VidG90YWwgPSBOdW1iZXIoZGV0YWlscz8uc3VidG90YWwgfHwgMCk7XHJcbiAgICBjb25zdCBzaGlwcGluZ0ZlZSA9IE51bWJlcihkZXRhaWxzPy5zaGlwcGluZ0ZlZSB8fCAwKTtcclxuICAgIGNvbnN0IHRheCA9IE51bWJlcihkZXRhaWxzPy50YXggfHwgMCk7XHJcbiAgICBjb25zdCBkaXNjb3VudCA9IE51bWJlcihkZXRhaWxzPy5kaXNjb3VudCB8fCAwKTtcclxuICAgIGNvbnN0IHRvdGFsQW1vdW50ID0gTnVtYmVyKGRldGFpbHM/LnRvdGFsQW1vdW50IHx8IDApO1xyXG5cclxuICAgIHJldHVybiB7IHN1YnRvdGFsLCBzaGlwcGluZ0ZlZSwgdGF4LCBkaXNjb3VudCwgdG90YWxBbW91bnQgfTtcclxuICB9LCBbZGV0YWlsc10pO1xyXG5cclxuICBpZiAobG9hZGluZykge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9PkxvYWRpbmcgb3JkZXIgZGV0YWlscy4uLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9PntlcnJvcn08L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoIWRldGFpbHMpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5PcmRlciBkZXRhaWxzIG5vdCBhdmFpbGFibGUuPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3BhZ2VTdHlsZX0+XHJcbiAgICAgIDxzdHlsZT57YEBtZWRpYSAobWF4LXdpZHRoOiAxMDQwcHgpIHsgLmNoYW5nZTgtb3JkZXItc2hvdy1ncmlkIHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgIWltcG9ydGFudDsgfSB9YH08L3N0eWxlPlxyXG5cclxuICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtoZWFkZXJTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8aDEgc3R5bGU9e2hlYWRpbmdTdHlsZX0+T3JkZXIgI3tkZXRhaWxzLmlkfTwvaDE+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N1YlRleHRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgQ3JlYXRlZCB7Zm9ybWF0RGF0ZShkZXRhaWxzLmNyZWF0ZWRBdCl9IHwgVXBkYXRlZHtcIiBcIn1cclxuICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShkZXRhaWxzLnVwZGF0ZWRBdCl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8c3BhbiBzdHlsZT17YmFkZ2VTdHlsZShkZXRhaWxzLnN0YXR1cyl9PlxyXG4gICAgICAgICAgICB7ZGV0YWlscy5zdGF0dXMgfHwgXCJwZW5kaW5nXCJ9XHJcbiAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLXNob3ctZ3JpZFwiIHN0eWxlPXtncmlkU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5DdXN0b21lciAmIFNoaXBwaW5nPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5DdXN0b21lcjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy51c2VyPy5uYW1lIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgQ29udGFjdDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy5zaGlwcGluZ05hbWUgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5TaGlwcGluZyBQaG9uZTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy5zaGlwcGluZ1Bob25lIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+RW1haWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8udXNlcj8uZW1haWwgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5QYXltZW50IE1ldGhvZDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy5wYXltZW50TWV0aG9kIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UGF5bWVudCBTdGF0dXM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8ucGF5bWVudFN0YXR1cyB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlRyYW5zYWN0aW9uIElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnRyYW5zYWN0aW9uSWQgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5TaGlwcGluZyBNZXRob2Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8uc2hpcHBpbmdNZXRob2QgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5UcmFja2luZyBOdW1iZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8udHJhY2tpbmdOdW1iZXIgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IFwiMTNweFwiLCBjb2xvcjogXCIjY2JkNWUxXCIsIGxpbmVIZWlnaHQ6IDEuNiB9fVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIsIG1hcmdpbkJvdHRvbTogXCI0cHhcIiB9fT5cclxuICAgICAgICAgICAgICAgIFNoaXBwaW5nIEFkZHJlc3NcclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdoaXRlU3BhY2U6IFwicHJlLXdyYXBcIiB9fT5cclxuICAgICAgICAgICAgICAgIHtkZXRhaWxzPy5zaGlwcGluZ0FkZHJlc3MgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5PcmRlciBTdW1tYXJ5IC8gVG90YWxzPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsQm94U3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U3VidG90YWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkodG90YWxzLnN1YnRvdGFsKX08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5TaGlwcGluZyBGZWU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkodG90YWxzLnNoaXBwaW5nRmVlKX08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5UYXggLyBWQVQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkodG90YWxzLnRheCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+RGlzY291bnQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz4tIHtmb3JtYXRNb25leSh0b3RhbHMuZGlzY291bnQpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Z3JhbmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4+R3JhbmQgVG90YWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4+e2Zvcm1hdE1vbmV5KHRvdGFscy50b3RhbEFtb3VudCl9PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UHJvZHVjdCBMaW5lIEl0ZW1zPC9oMj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt0YWJsZVN0eWxlfT5cclxuICAgICAgICAgIHsoZGV0YWlscz8uaXRlbXMgfHwgW10pLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+Tm8gbGluZSBpdGVtcyBpbiB0aGlzIG9yZGVyLjwvZGl2PlxyXG4gICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgKGRldGFpbHMuaXRlbXMgfHwgW10pLm1hcCgoaXRlbSkgPT4gKFxyXG4gICAgICAgICAgICAgIDxkaXYga2V5PXtpdGVtLmlkfSBzdHlsZT17bGluZUl0ZW1TdHlsZX0+XHJcbiAgICAgICAgICAgICAgICB7aXRlbT8ucHJvZHVjdD8uaW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICAgICAgICBzcmM9e2l0ZW0ucHJvZHVjdC5pbWFnZVVybH1cclxuICAgICAgICAgICAgICAgICAgICBhbHQ9e2l0ZW0/LnByb2R1Y3Q/Lm5hbWUgfHwgXCJQcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgIC4uLmltYWdlU3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBcIjExcHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgTm8gaW1hZ2VcclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCI0cHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIsIGZvbnRTaXplOiBcIjE0cHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICB7aXRlbT8ucHJvZHVjdD8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgU0tVOiB7aXRlbT8ucHJvZHVjdD8uc2t1IHx8IFwiLVwifSB8IFByb2R1Y3QgSUQ6ICNcclxuICAgICAgICAgICAgICAgICAgICB7aXRlbT8ucHJvZHVjdElkfVxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiNjYmQ1ZTFcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIFNpemU6IHtpdGVtPy5zaXplIHx8IFwiLVwifSB8IFF0eToge2l0ZW0ucXVhbnRpdHl9IHh7XCIgXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAge2Zvcm1hdE1vbmV5KGl0ZW0udW5pdFByaWNlKX1cclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIsIGZvbnRTaXplOiBcIjE1cHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAge2Zvcm1hdE1vbmV5KGl0ZW0udG90YWxQcmljZSl9XHJcbiAgICAgICAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9yZGVyU2hvdztcclxuIiwiXHJcbmltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBwYWdlU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxuICBjb2xvcjogXCIjZTJlOGYwXCIsXHJcbn07XHJcblxyXG5jb25zdCBjYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE4cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yKVwiLFxyXG4gIGJhY2tncm91bmQ6XHJcbiAgICBcImxpbmVhci1ncmFkaWVudCgxNTVkZWcsIHJnYmEoMTAsIDIzLCA0OCwgMC45NCkgMCUsIHJnYmEoOCwgMTgsIDM4LCAwLjk0KSAxMDAlKVwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDE0cHggMzBweCByZ2JhKDIsIDYsIDIzLCAwLjIpXCIsXHJcbiAgcGFkZGluZzogXCIxOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBoZWFkZXJTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgdGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgZm9udFNpemU6IFwiMzRweFwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuMSxcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBzdWJ0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogXCI2cHggMCAwIDBcIixcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImlubGluZS1mbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gIHBhZGRpbmc6IFwiNnB4IDEycHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiOTk5cHhcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4wOGVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBjb2xvcjogXCIjMTQ1MzJkXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjYmJmN2QwXCIsXHJcbn07XHJcblxyXG5jb25zdCBncmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJtaW5tYXgoMzAwcHgsIDAuOTVmcikgbWlubWF4KDMyMHB4LCAxLjA1ZnIpXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHNlY3Rpb25UaXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogXCIwIDAgMTJweCAwXCIsXHJcbiAgY29sb3I6IFwiI2Y1ZGY5MFwiLFxyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjExZW1cIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0dyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI4cHhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBoZWlnaHQ6IFwiMjgwcHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTRweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG59O1xyXG5cclxuY29uc3QgbGluZUl0ZW1TdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjg0cHggMWZyIGF1dG9cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgcGFkZGluZzogXCIxMnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE0cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yKVwiLFxyXG4gIGJhY2tncm91bmQ6IFwicmdiYSgxNSwgMjMsIDQyLCAwLjQ0KVwiLFxyXG59O1xyXG5cclxuY29uc3QgZW1wdHlJbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjg0cHhcIixcclxuICBoZWlnaHQ6IFwiODRweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjMGYxNzJhXCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMjIpXCIsXHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG59O1xyXG5cclxuY29uc3QgdG90YWxSb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiN3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCBncmFuZFN0eWxlID0ge1xyXG4gIC4uLnRvdGFsUm93U3R5bGUsXHJcbiAgYm9yZGVyQm90dG9tOiBcIm5vbmVcIixcclxuICBwYWRkaW5nVG9wOiBcIjZweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBmb250U2l6ZTogXCIxOHB4XCIsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3QgZW1wdHlTdHlsZSA9IHtcclxuICBib3JkZXI6IFwiMXB4IGRhc2hlZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMzUpXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICBwYWRkaW5nOiBcIjE0cHhcIixcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXRNb25leSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IG4gPSBOdW1iZXIodmFsdWUgfHwgMCk7XHJcbiAgcmV0dXJuIGBScy4gJHtuLnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gIH0pfWA7XHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXREYXRlID0gKHZhbHVlKSA9PiB7XHJcbiAgaWYgKCF2YWx1ZSkge1xyXG4gICAgcmV0dXJuIFwiLVwiO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZHQgPSBuZXcgRGF0ZSh2YWx1ZSk7XHJcbiAgaWYgKE51bWJlci5pc05hTihkdC5nZXRUaW1lKCkpKSB7XHJcbiAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkdC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIGRhdGVTdHlsZTogXCJtZWRpdW1cIixcclxuICAgIHRpbWVTdHlsZTogXCJzaG9ydFwiLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgT3JkZXJJdGVtU2hvdyA9ICh7IHJlY29yZCB9KSA9PiB7XHJcbiAgY29uc3QgW2RldGFpbHMsIHNldERldGFpbHNdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XHJcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgY29uc3Qgb3JkZXJJdGVtSWQgPSByZWNvcmQ/LnBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZDtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghb3JkZXJJdGVtSWQpIHtcclxuICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIHNldEVycm9yKFwiT3JkZXIgaXRlbSBpZCBub3QgZm91bmRcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsb2FkRGV0YWlscyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBzZXRFcnJvcihcIlwiKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9jb250ZXh0L29yZGVyLWl0ZW1zLyR7ZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhvcmRlckl0ZW1JZCkpfS9kZXRhaWxzYCxcclxuICAgICAgICAgIHsgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIiB9LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgICAgICBwYXlsb2FkPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgb3JkZXIgaXRlbSBkZXRhaWxzXCIsXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0RGV0YWlscyhwYXlsb2FkKTtcclxuICAgICAgfSBjYXRjaCAoZmV0Y2hFcnJvcikge1xyXG4gICAgICAgIHNldEVycm9yKGZldGNoRXJyb3I/Lm1lc3NhZ2UgfHwgXCJGYWlsZWQgdG8gbG9hZCBvcmRlciBpdGVtIGRldGFpbHNcIik7XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbG9hZERldGFpbHMoKTtcclxuICB9LCBbb3JkZXJJdGVtSWRdKTtcclxuXHJcbiAgY29uc3QgY2FsY3VsYXRlZFRvdGFsID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICByZXR1cm4gTnVtYmVyKGRldGFpbHM/LnRvdGFsUHJpY2UgfHwgMCk7XHJcbiAgfSwgW2RldGFpbHNdKTtcclxuXHJcbiAgaWYgKGxvYWRpbmcpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5Mb2FkaW5nIG9yZGVyIGl0ZW0gZGV0YWlscy4uLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9PntlcnJvcn08L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoIWRldGFpbHMpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5PcmRlciBpdGVtIGRldGFpbHMgbm90IGF2YWlsYWJsZS48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBjb25zdCBwcm9kdWN0ID0gZGV0YWlscz8ucHJvZHVjdCB8fCB7fTtcclxuICBjb25zdCBvcmRlciA9IGRldGFpbHM/Lm9yZGVyIHx8IHt9O1xyXG4gIGNvbnN0IGN1c3RvbWVyID0gb3JkZXI/LnVzZXIgfHwge307XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+e2BAbWVkaWEgKG1heC13aWR0aDogMTA0MHB4KSB7IC5jaGFuZ2U4LW9yZGVyLWl0ZW0tZ3JpZCB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7IH0gfWB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17aGVhZGVyU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGgxIHN0eWxlPXt0aXRsZVN0eWxlfT57cHJvZHVjdD8ubmFtZSB8fCBcIk9yZGVyIEl0ZW1cIn08L2gxPlxyXG4gICAgICAgICAgICA8cCBzdHlsZT17c3VidGl0bGVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgT3JkZXIgI3tvcmRlcj8uaWQgfHwgXCItXCJ9IOKAoiBJdGVtICN7ZGV0YWlscz8uaWQgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9e2JhZGdlU3R5bGV9PkFjdGl2ZSBJdGVtPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1pdGVtLWdyaWRcIiBzdHlsZT17Z3JpZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAge3Byb2R1Y3Q/LmltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgc3JjPXtwcm9kdWN0LmltYWdlVXJsfVxyXG4gICAgICAgICAgICAgIGFsdD17cHJvZHVjdD8ubmFtZSB8fCBcIlByb2R1Y3RcIn1cclxuICAgICAgICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgLi4uaW1hZ2VTdHlsZSxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICBObyBpbWFnZSBhdmFpbGFibGVcclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxNCB9fSAvPlxyXG5cclxuICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlByb2R1Y3QgU25hcHNob3Q8L2gyPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0dyaWRTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlByb2R1Y3QgTmFtZTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntwcm9kdWN0Py5uYW1lIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U0tVPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e3Byb2R1Y3Q/LnNrdSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlByb2R1Y3QgSUQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz4je3Byb2R1Y3Q/LmlkIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+Q3VycmVudCBTdG9jazwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntwcm9kdWN0Py5zdG9jayA/PyBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9Pk9yZGVyICYgQ3VzdG9tZXI8L2gyPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0dyaWRTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkN1c3RvbWVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2N1c3RvbWVyPy5uYW1lIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+RW1haWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Y3VzdG9tZXI/LmVtYWlsIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+T3JkZXIgSUQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz4je29yZGVyPy5pZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19Pk9yZGVyIFN0YXR1czwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntvcmRlcj8uc3RhdHVzIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UGF5bWVudCBNZXRob2Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57b3JkZXI/LnBheW1lbnRNZXRob2QgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5TaGlwcGluZyBNZXRob2Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57b3JkZXI/LnNoaXBwaW5nTWV0aG9kIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VHJhY2tpbmcgTnVtYmVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e29yZGVyPy50cmFja2luZ051bWJlciB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkNyZWF0ZWQgQXQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0RGF0ZShkZXRhaWxzLmNyZWF0ZWRBdCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5QcmljaW5nIERldGFpbHM8L2gyPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2luZm9HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlF1YW50aXR5PC9zcGFuPlxyXG4gICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzLnF1YW50aXR5fTwvc3Ryb25nPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VW5pdCBQcmljZTwvc3Bhbj5cclxuICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkoZGV0YWlscy51bml0UHJpY2UpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+TGluZSBUb3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkoY2FsY3VsYXRlZFRvdGFsKX08L3N0cm9uZz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UXVpY2sgU3VtbWFyeTwvaDI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17bGluZUl0ZW1TdHlsZX0+XHJcbiAgICAgICAgICB7cHJvZHVjdD8uaW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICBzcmM9e3Byb2R1Y3QuaW1hZ2VVcmx9XHJcbiAgICAgICAgICAgICAgYWx0PXtwcm9kdWN0Py5uYW1lIHx8IFwiUHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogXCI4NHB4XCIsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiODRweFwiLFxyXG4gICAgICAgICAgICAgICAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtlbXB0eUltYWdlU3R5bGV9Pk5vIGltYWdlPC9kaXY+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ2FwOiBcIjRweFwiIH19PlxyXG4gICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGNvbG9yOiBcIiNmOGZhZmNcIiwgZm9udFNpemU6IFwiMTZweFwiIH19PlxyXG4gICAgICAgICAgICAgIHtwcm9kdWN0Py5uYW1lIHx8IFwiVW5uYW1lZCBwcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICBTS1U6IHtwcm9kdWN0Py5za3UgfHwgXCItXCJ9XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiI2NiZDVlMVwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgUXR5IHtkZXRhaWxzLnF1YW50aXR5fSB4IHtmb3JtYXRNb25leShkZXRhaWxzLnVuaXRQcmljZSl9XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIsIGZvbnRTaXplOiBcIjE2cHhcIiB9fT5cclxuICAgICAgICAgICAge2Zvcm1hdE1vbmV5KGNhbGN1bGF0ZWRUb3RhbCl9XHJcbiAgICAgICAgICA8L3N0cm9uZz5cclxuXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9yZGVySXRlbVNob3c7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBjZWxsU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIG1pbkhlaWdodDogXCI1NnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjY0cHhcIixcclxuICBoZWlnaHQ6IFwiNDJweFwiLFxyXG4gIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMzUpXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZjhmYWZjXCIsXHJcbiAgZmxleFNocmluazogMCxcclxufTtcclxuXHJcbmNvbnN0IGZhbGxiYWNrU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiNjRweFwiLFxyXG4gIGhlaWdodDogXCI0MnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBib3JkZXI6IFwiMXB4IGRhc2hlZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuNilcIixcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBjb2xvcjogXCIjNjQ3NDhiXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZjhmYWZjXCIsXHJcbiAgZmxleFNocmluazogMCxcclxufTtcclxuXHJcbmNvbnN0IHRleHRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLFxyXG4gIGdhcDogXCIycHhcIixcclxufTtcclxuXHJcbmNvbnN0IFByb2R1Y3RJbWFnZSA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnN0IGltYWdlVXJsID0gcHJvcHM/LnJlY29yZD8ucGFyYW1zPy5bcHJvcHM/LnByb3BlcnR5Py5wYXRoXTtcclxuICBjb25zdCBbaGFzRXJyb3IsIHNldEhhc0Vycm9yXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIHNldEhhc0Vycm9yKGZhbHNlKTtcclxuICB9LCBbaW1hZ2VVcmxdKTtcclxuXHJcbiAgaWYgKCFpbWFnZVVybCkge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2ZhbGxiYWNrU3R5bGV9Pk5vIGltYWdlPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKGhhc0Vycm9yKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IHN0eWxlPXtjZWxsU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2ZhbGxiYWNrU3R5bGV9PkludmFsaWQ8L2Rpdj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt0ZXh0U3R5bGV9PlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogNjAwLCBjb2xvcjogXCIjMGYxNzJhXCIgfX0+SW1hZ2UgVVJMPC9zcGFuPlxyXG4gICAgICAgICAgPGFcclxuICAgICAgICAgICAgaHJlZj17aW1hZ2VVcmx9XHJcbiAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXHJcbiAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxyXG4gICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBcIiMyNTYzZWJcIixcclxuICAgICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsXHJcbiAgICAgICAgICAgICAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBPcGVuIGxpbmtcclxuICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e2NlbGxTdHlsZX0+XHJcbiAgICAgIDxpbWdcclxuICAgICAgICBzcmM9e2ltYWdlVXJsfVxyXG4gICAgICAgIGFsdD1cIlByb2R1Y3RcIlxyXG4gICAgICAgIHN0eWxlPXtpbWFnZVN0eWxlfVxyXG4gICAgICAgIG9uRXJyb3I9eygpID0+IHNldEhhc0Vycm9yKHRydWUpfVxyXG4gICAgICAvPlxyXG4gICAgICA8ZGl2IHN0eWxlPXt0ZXh0U3R5bGV9PlxyXG4gICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IFwiIzBmMTcyYVwiIH19PlByZXZpZXc8L3NwYW4+XHJcbiAgICAgICAgPGFcclxuICAgICAgICAgIGhyZWY9e2ltYWdlVXJsfVxyXG4gICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcclxuICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxyXG4gICAgICAgICAgc3R5bGU9e3sgY29sb3I6IFwiIzI1NjNlYlwiLCB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIE9wZW4gaW1hZ2VcclxuICAgICAgICA8L2E+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RJbWFnZTtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHdyYXBwZXJTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBwcmV2aWV3U3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTQwcHhcIixcclxuICBoZWlnaHQ6IFwiOTZweFwiLFxyXG4gIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMzUpXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBoaW50U3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gIGNvbG9yOiBcIiM2NDc0OGJcIixcclxufTtcclxuXHJcbmNvbnN0IFByb2R1Y3RJbWFnZVVwbG9hZCA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnN0IHsgb25DaGFuZ2UsIHJlY29yZCB9ID0gcHJvcHM7XHJcbiAgY29uc3QgY3VycmVudFZhbHVlID0gcmVjb3JkPy5wYXJhbXM/LmltYWdlVXJsIHx8IFwiXCI7XHJcbiAgY29uc3QgY3VycmVudFB1YmxpY0lkID0gcmVjb3JkPy5wYXJhbXM/LmltYWdlUHVibGljSWQgfHwgXCJcIjtcclxuICBjb25zdCBbcHJldmlld1VybCwgc2V0UHJldmlld1VybF0gPSB1c2VTdGF0ZShjdXJyZW50VmFsdWUpO1xyXG4gIGNvbnN0IFtwdWJsaWNJZCwgc2V0UHVibGljSWRdID0gdXNlU3RhdGUoY3VycmVudFB1YmxpY0lkKTtcclxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBzZXRQcmV2aWV3VXJsKGN1cnJlbnRWYWx1ZSk7XHJcbiAgICBzZXRQdWJsaWNJZChjdXJyZW50UHVibGljSWQpO1xyXG4gIH0sIFtjdXJyZW50VmFsdWUsIGN1cnJlbnRQdWJsaWNJZF0pO1xyXG5cclxuICBjb25zdCBoYW5kbGVVcGxvYWQgPSBhc3luYyAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXTtcclxuXHJcbiAgICBpZiAoIWZpbGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFVwbG9hZGluZyh0cnVlKTtcclxuICAgIHNldEVycm9yKFwiXCIpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgIGZvcm1EYXRhLmFwcGVuZChcImltYWdlXCIsIGZpbGUpO1xyXG5cclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hcGkvdXBsb2Fkcy9pbWFnZVwiLCB7XHJcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihwYXlsb2FkLm1lc3NhZ2UgfHwgXCJJbWFnZSB1cGxvYWQgZmFpbGVkXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB1cGxvYWRlZFVybCA9IHBheWxvYWQudXJsIHx8IFwiXCI7XHJcbiAgICAgIGNvbnN0IHVwbG9hZGVkUHVibGljSWQgPSBwYXlsb2FkLnB1YmxpY0lkIHx8IFwiXCI7XHJcbiAgICAgIHNldFByZXZpZXdVcmwodXBsb2FkZWRVcmwpO1xyXG4gICAgICBzZXRQdWJsaWNJZCh1cGxvYWRlZFB1YmxpY0lkKTtcclxuICAgICAgb25DaGFuZ2U/LihcImltYWdlVXJsXCIsIHVwbG9hZGVkVXJsKTtcclxuICAgICAgb25DaGFuZ2U/LihcImltYWdlUHVibGljSWRcIiwgdXBsb2FkZWRQdWJsaWNJZCk7XHJcbiAgICB9IGNhdGNoICh1cGxvYWRFcnJvcikge1xyXG4gICAgICBzZXRFcnJvcih1cGxvYWRFcnJvci5tZXNzYWdlKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNldFVwbG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9IFwiXCI7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlUmVtb3ZlID0gKCkgPT4ge1xyXG4gICAgc2V0UHJldmlld1VybChcIlwiKTtcclxuICAgIHNldFB1YmxpY0lkKFwiXCIpO1xyXG4gICAgb25DaGFuZ2U/LihcImltYWdlVXJsXCIsIFwiXCIpO1xyXG4gICAgb25DaGFuZ2U/LihcImltYWdlUHVibGljSWRcIiwgXCJcIik7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3dyYXBwZXJTdHlsZX0+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17aGFuZGxlVXBsb2FkfSAvPlxyXG4gICAgICA8ZGl2IHN0eWxlPXtoaW50U3R5bGV9PlxyXG4gICAgICAgIHt1cGxvYWRpbmdcclxuICAgICAgICAgID8gXCJVcGxvYWRpbmcgdG8gQ2xvdWRpbmFyeS4uLlwiXHJcbiAgICAgICAgICA6IFwiQ2hvb3NlIGFuIGltYWdlIGZpbGUgdG8gdXBsb2FkXCJ9XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAge3ByZXZpZXdVcmwgPyAoXHJcbiAgICAgICAgPD5cclxuICAgICAgICAgIDxpbWcgc3JjPXtwcmV2aWV3VXJsfSBhbHQ9XCJQcm9kdWN0IHByZXZpZXdcIiBzdHlsZT17cHJldmlld1N0eWxlfSAvPlxyXG4gICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgb25DbGljaz17aGFuZGxlUmVtb3ZlfVxyXG4gICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgIHdpZHRoOiBcImZpdC1jb250ZW50XCIsXHJcbiAgICAgICAgICAgICAgcGFkZGluZzogXCI2cHggMTBweFwiLFxyXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCI4cHhcIixcclxuICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkICNlZjQ0NDRcIixcclxuICAgICAgICAgICAgICBjb2xvcjogXCIjZWY0NDQ0XCIsXHJcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCIjZmZmXCIsXHJcbiAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgUmVtb3ZlIGltYWdlXHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8Lz5cclxuICAgICAgKSA6IG51bGx9XHJcblxyXG4gICAgICB7ZXJyb3IgPyAoXHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyAuLi5oaW50U3R5bGUsIGNvbG9yOiBcIiNkYzI2MjZcIiB9fT57ZXJyb3J9PC9kaXY+XHJcbiAgICAgICkgOiBudWxsfVxyXG5cclxuICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiaW1hZ2VVcmxcIiB2YWx1ZT17cHJldmlld1VybH0gcmVhZE9ubHkgLz5cclxuICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiaW1hZ2VQdWJsaWNJZFwiIHZhbHVlPXtwdWJsaWNJZH0gcmVhZE9ubHkgLz5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0SW1hZ2VVcGxvYWQ7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCB3cmFwcGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxufTtcclxuXHJcbmNvbnN0IHJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDE0MHB4IGF1dG9cIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IGlucHV0U3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuNDUpXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBwYWRkaW5nOiBcIjhweCAxMHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2ZmZlwiLFxyXG59O1xyXG5cclxuY29uc3QgaGludFN0eWxlID0ge1xyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBjb2xvcjogXCIjNjQ3NDhiXCIsXHJcbn07XHJcblxyXG5jb25zdCBhZGRCdXR0b25TdHlsZSA9IHtcclxuICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gIHBhZGRpbmc6IFwiN3B4IDEycHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiOXB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCAjNjM2NmYxXCIsXHJcbiAgY29sb3I6IFwiIzM3MzBhM1wiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2VlZjJmZlwiLFxyXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG59O1xyXG5cclxuY29uc3QgcmVtb3ZlQnV0dG9uU3R5bGUgPSB7XHJcbiAgcGFkZGluZzogXCI3cHggOXB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjlweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgI2ZjYTVhNVwiLFxyXG4gIGNvbG9yOiBcIiM5OTFiMWJcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmZWUyZTJcIixcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxufTtcclxuXHJcbmNvbnN0IHBhcnNlSW5pdGlhbFZhbHVlID0gKHZhbHVlKSA9PiB7XHJcbiAgaWYgKCF2YWx1ZSkge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgbGV0IHNvdXJjZSA9IHZhbHVlO1xyXG4gIGlmICh0eXBlb2Ygc291cmNlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBzb3VyY2UgPSBKU09OLnBhcnNlKHNvdXJjZSk7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKCFzb3VyY2UgfHwgdHlwZW9mIHNvdXJjZSAhPT0gXCJvYmplY3RcIiB8fCBBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIHJldHVybiBPYmplY3QuZW50cmllcyhzb3VyY2UpLm1hcCgoW3NpemUsIHF0eV0pID0+ICh7XHJcbiAgICBzaXplOiBTdHJpbmcoc2l6ZSB8fCBcIlwiKVxyXG4gICAgICAudHJpbSgpXHJcbiAgICAgIC50b1VwcGVyQ2FzZSgpLFxyXG4gICAgc3RvY2s6IFN0cmluZyhOdW1iZXIocXR5IHx8IDApKSxcclxuICB9KSk7XHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0U2l6ZVN0b2NrSW5wdXQgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCB7IHJlY29yZCwgb25DaGFuZ2UgfSA9IHByb3BzO1xyXG4gIGNvbnN0IGluaXRpYWxSb3dzID0gdXNlTWVtbyhcclxuICAgICgpID0+IHBhcnNlSW5pdGlhbFZhbHVlKHJlY29yZD8ucGFyYW1zPy5zaXplU3RvY2spLFxyXG4gICAgW3JlY29yZD8ucGFyYW1zPy5zaXplU3RvY2tdLFxyXG4gICk7XHJcblxyXG4gIGNvbnN0IFtyb3dzLCBzZXRSb3dzXSA9IHVzZVN0YXRlKFxyXG4gICAgaW5pdGlhbFJvd3MubGVuZ3RoID8gaW5pdGlhbFJvd3MgOiBbeyBzaXplOiBcIlwiLCBzdG9jazogXCJcIiB9XSxcclxuICApO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgc2V0Um93cyhpbml0aWFsUm93cy5sZW5ndGggPyBpbml0aWFsUm93cyA6IFt7IHNpemU6IFwiXCIsIHN0b2NrOiBcIlwiIH1dKTtcclxuICB9LCBbaW5pdGlhbFJvd3NdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnN0IHNpemVTdG9jayA9IHt9O1xyXG5cclxuICAgIHJvd3MuZm9yRWFjaCgocm93KSA9PiB7XHJcbiAgICAgIGNvbnN0IHNpemUgPSBTdHJpbmcocm93LnNpemUgfHwgXCJcIilcclxuICAgICAgICAudHJpbSgpXHJcbiAgICAgICAgLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgIGlmICghc2l6ZSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgc3RvY2sgPSBNYXRoLm1heCgwLCBNYXRoLnRydW5jKE51bWJlcihyb3cuc3RvY2sgfHwgMCkpKTtcclxuICAgICAgc2l6ZVN0b2NrW3NpemVdID0gc3RvY2s7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCB0b3RhbFN0b2NrID0gT2JqZWN0LnZhbHVlcyhzaXplU3RvY2spLnJlZHVjZShcclxuICAgICAgKHN1bSwgcXR5KSA9PiBzdW0gKyBOdW1iZXIocXR5IHx8IDApLFxyXG4gICAgICAwLFxyXG4gICAgKTtcclxuXHJcbiAgICBvbkNoYW5nZT8uKFwic2l6ZVN0b2NrVGV4dFwiLCBKU09OLnN0cmluZ2lmeShzaXplU3RvY2spKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJzdG9ja1wiLCB0b3RhbFN0b2NrKTtcclxuICB9LCBbcm93cywgb25DaGFuZ2VdKTtcclxuXHJcbiAgY29uc3QgdXBkYXRlUm93ID0gKGluZGV4LCBrZXksIHZhbHVlKSA9PiB7XHJcbiAgICBzZXRSb3dzKChwcmV2KSA9PiB7XHJcbiAgICAgIGNvbnN0IG5leHQgPSBbLi4ucHJldl07XHJcbiAgICAgIG5leHRbaW5kZXhdID0ge1xyXG4gICAgICAgIC4uLm5leHRbaW5kZXhdLFxyXG4gICAgICAgIFtrZXldOiB2YWx1ZSxcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIG5leHQ7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBhZGRSb3cgPSAoKSA9PiB7XHJcbiAgICBzZXRSb3dzKChwcmV2KSA9PiBbLi4ucHJldiwgeyBzaXplOiBcIlwiLCBzdG9jazogXCJcIiB9XSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVtb3ZlUm93ID0gKGluZGV4KSA9PiB7XHJcbiAgICBzZXRSb3dzKChwcmV2KSA9PiB7XHJcbiAgICAgIGlmIChwcmV2Lmxlbmd0aCA8PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIFt7IHNpemU6IFwiXCIsIHN0b2NrOiBcIlwiIH1dO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcHJldi5maWx0ZXIoKF8sIHJvd0luZGV4KSA9PiByb3dJbmRleCAhPT0gaW5kZXgpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3dyYXBwZXJTdHlsZX0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e2hpbnRTdHlsZX0+XHJcbiAgICAgICAgQWRkIHByb2R1Y3Qgc2l6ZXMgYW5kIHN0b2NrIHBlciBzaXplLiBUb3RhbCBzdG9jayBpcyBhdXRvLWNhbGN1bGF0ZWQuXHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAge3Jvd3MubWFwKChyb3csIGluZGV4KSA9PiAoXHJcbiAgICAgICAgPGRpdiBrZXk9e2Ake2luZGV4fS0ke3Jvdy5zaXplfWB9IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNpemUgKGUuZy4gUywgTSwgTCwgWEwpXCJcclxuICAgICAgICAgICAgdmFsdWU9e3Jvdy5zaXplfVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiB1cGRhdGVSb3coaW5kZXgsIFwic2l6ZVwiLCBldmVudC50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICBtaW49XCIwXCJcclxuICAgICAgICAgICAgc3RlcD1cIjFcIlxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlN0b2NrXCJcclxuICAgICAgICAgICAgdmFsdWU9e3Jvdy5zdG9ja31cclxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gdXBkYXRlUm93KGluZGV4LCBcInN0b2NrXCIsIGV2ZW50LnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByZW1vdmVSb3coaW5kZXgpfVxyXG4gICAgICAgICAgICBzdHlsZT17cmVtb3ZlQnV0dG9uU3R5bGV9XHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJSZW1vdmUgc2l6ZVwiXHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIFJlbW92ZVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICkpfVxyXG5cclxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17YWRkUm93fSBzdHlsZT17YWRkQnV0dG9uU3R5bGV9PlxyXG4gICAgICAgICsgQWRkIFNpemVcclxuICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICA8aW5wdXRcclxuICAgICAgICB0eXBlPVwiaGlkZGVuXCJcclxuICAgICAgICBuYW1lPVwic2l6ZVN0b2NrXCJcclxuICAgICAgICB2YWx1ZT17SlNPTi5zdHJpbmdpZnkoXHJcbiAgICAgICAgICByb3dzLnJlZHVjZSgoYWNjLCByb3cpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IFN0cmluZyhyb3cuc2l6ZSB8fCBcIlwiKVxyXG4gICAgICAgICAgICAgIC50cmltKClcclxuICAgICAgICAgICAgICAudG9VcHBlckNhc2UoKTtcclxuICAgICAgICAgICAgaWYgKCFzaXplKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGFjYztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYWNjW3NpemVdID0gTWF0aC5tYXgoMCwgTWF0aC50cnVuYyhOdW1iZXIocm93LnN0b2NrIHx8IDApKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhY2M7XHJcbiAgICAgICAgICB9LCB7fSksXHJcbiAgICAgICAgKX1cclxuICAgICAgICByZWFkT25seVxyXG4gICAgICAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RTaXplU3RvY2tJbnB1dDtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IENhdGVnb3J5U2hvdyA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnN0IHsgcmVjb3JkLCByZXNvdXJjZSB9ID0gcHJvcHM7XHJcbiAgY29uc3QgW2NhdGVnb3J5LCBzZXRDYXRlZ29yeV0gPSB1c2VTdGF0ZShudWxsKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChyZWNvcmQgJiYgcmVjb3JkLnBhcmFtcykge1xyXG4gICAgICBzZXRDYXRlZ29yeShyZWNvcmQucGFyYW1zKTtcclxuICAgIH1cclxuICB9LCBbcmVjb3JkXSk7XHJcblxyXG4gIGlmICghY2F0ZWdvcnkpIHtcclxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctbG9hZGluZ1wiPkxvYWRpbmcuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBjb25zdCBmb3JtYXREYXRlID0gKGRhdGUpID0+IHtcclxuICAgIGlmICghZGF0ZSkgcmV0dXJuIFwi4oCUXCI7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gbmV3IERhdGUoZGF0ZSkudG9Mb2NhbGVEYXRlU3RyaW5nKFwiZW4tVVNcIiwge1xyXG4gICAgICAgIHllYXI6IFwibnVtZXJpY1wiLFxyXG4gICAgICAgIG1vbnRoOiBcImxvbmdcIixcclxuICAgICAgICBkYXk6IFwibnVtZXJpY1wiLFxyXG4gICAgICAgIGhvdXI6IFwiMi1kaWdpdFwiLFxyXG4gICAgICAgIG1pbnV0ZTogXCIyLWRpZ2l0XCIsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIHJldHVybiBcIuKAlFwiO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctY29udGFpbmVyXCI+XHJcbiAgICAgIDxzdHlsZT57YFxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAtLWJnLTE6IHZhcigtLWNoYW5nZTgtYmctMSwgIzA1MDkxNCk7XHJcbiAgICAgICAgICAtLWdvbGQ6IHZhcigtLWNoYW5nZTgtZ29sZCwgI2UyYmY2Nik7XHJcbiAgICAgICAgICAtLXRleHQtbWFpbjogdmFyKC0tY2hhbmdlOC10ZXh0LW1haW4sICNmOGZhZmMpO1xyXG4gICAgICAgICAgLS10ZXh0LW11dGVkOiB2YXIoLS1jaGFuZ2U4LXRleHQtbXV0ZWQsICM5YWE4YzEpO1xyXG4gICAgICAgICAgLS1saW5lOiB2YXIoLS1jaGFuZ2U4LWxpbmUsIHJnYmEoMjI2LCAxOTEsIDEwMiwgMC4yMikpO1xyXG4gICAgICAgICAgLS1jYXJkLWJnOiB2YXIoLS1jaGFuZ2U4LWNhcmQtYmcsIGxpbmVhci1ncmFkaWVudCgxNjBkZWcsIHJnYmEoMjEsIDM0LCA2NiwgMC45NikgMCUsIHJnYmEoMTAsIDE4LCAzNiwgMC45NikgMTAwJSkpO1xyXG4gICAgICAgICAgLS1zaGFkb3c6IHZhcigtLWNoYW5nZTgtc2hhZG93LCAwIDhweCAyNnB4IHJnYmEoMCwgMCwgMCwgMC4zKSk7XHJcblxyXG4gICAgICAgICAgcGFkZGluZzogMzJweDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW1haW4pO1xyXG4gICAgICAgICAgZm9udC1mYW1pbHk6IFwiUG9wcGluc1wiLCBcIlNlZ29lIFVJXCIsIHNhbnMtc2VyaWY7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTIwZGVnLCB2YXIoLS1iZy0xKSAwJSwgcmdiYSgxMSwgMjYsIDU2LCAwLjgpIDUwJSwgdmFyKC0tYmctMSkgMTAwJSk7XHJcbiAgICAgICAgICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT0nbGlnaHQnXSAuY2F0ZWdvcnktc2hvdy1jb250YWluZXIge1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWJnLTE6ICNmMGY2ZmY7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtZ29sZDogI2MwOGIwZjtcclxuICAgICAgICAgIC0tY2hhbmdlOC10ZXh0LW1haW46ICMwZjE3MmE7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtdGV4dC1tdXRlZDogIzQ3NTU2OTtcclxuICAgICAgICAgIC0tY2hhbmdlOC1saW5lOiByZ2JhKDE1LCAyMywgNDIsIDAuMDgpO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWNhcmQtYmc6ICNmZmZmZmY7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtc2hhZG93OiAwIDRweCAyMHB4IHJnYmEoMTUsIDIzLCA0MiwgMC4wNik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1pbm5lciB7XHJcbiAgICAgICAgICBtYXgtd2lkdGg6IDkwMHB4O1xyXG4gICAgICAgICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1oZWFkZXIge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMzJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWtpY2tlciB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLWdvbGQpO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjM2ZW07XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxMnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctdGl0bGUge1xyXG4gICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgzMnB4LCA1dncsIDQ4cHgpO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjE7XHJcbiAgICAgICAgICBtYXJnaW46IDAgMCA4cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1zdGF0dXMge1xyXG4gICAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgZ2FwOiA4cHg7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAxMnB4O1xyXG4gICAgICAgICAgcGFkZGluZzogNnB4IDEycHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xMmVtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctc3RhdHVzLmFjdGl2ZSB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDM0LCAxOTcsIDk0LCAwLjIpO1xyXG4gICAgICAgICAgY29sb3I6ICMyMmM1NWU7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDM0LCAxOTcsIDk0LCAwLjQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctc3RhdHVzLmluYWN0aXZlIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjM5LCA2OCwgNjgsIDAuMik7XHJcbiAgICAgICAgICBjb2xvcjogI2VmNDQ0NDtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjM5LCA2OCwgNjgsIDAuNCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1jYXJkIHtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxpbmUpO1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMjRweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDMycHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jYXJkLWJnKTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IHZhcigtLXNoYWRvdyk7XHJcbiAgICAgICAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoNHB4KTtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDI0cHg7XHJcbiAgICAgICAgICBhbmltYXRpb246IGZhZGUtdXAgNTYwbXMgZWFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXNlY3Rpb24tdGl0bGUge1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xOGVtO1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLWdvbGQpO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1zZWN0aW9uIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDI4cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1zZWN0aW9uOmxhc3QtY2hpbGQge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWZpZWxkIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1maWVsZDpsYXN0LWNoaWxkIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1sYWJlbCB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjE4ZW07XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiA4cHg7XHJcbiAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXZhbHVlIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW1haW4pO1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDEuNjtcclxuICAgICAgICAgIHdvcmQtYnJlYWs6IGJyZWFrLXdvcmQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy12YWx1ZS5nb2xkIHtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1kZXNjcmlwdGlvbiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMik7XHJcbiAgICAgICAgICBib3JkZXItbGVmdDogM3B4IHNvbGlkIHZhcigtLWdvbGQpO1xyXG4gICAgICAgICAgcGFkZGluZzogMTZweCAyMHB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDEuNztcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT0nbGlnaHQnXSAuY2F0ZWdvcnktc2hvdy1kZXNjcmlwdGlvbiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDE1LCAyMywgNDIsIDAuMDUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctZGV0YWlscy1ncmlkIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpdCwgbWlubWF4KDIwMHB4LCAxZnIpKTtcclxuICAgICAgICAgIGdhcDogMjRweDtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDE2cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1kZXRhaWwtaXRlbSB7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxNnB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjEpO1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxpbmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMTUsIDIzLCA0MiwgMC4wMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1kaXZpZGVyIHtcclxuICAgICAgICAgIGhlaWdodDogMXB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDApLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMjgpLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDApKTtcclxuICAgICAgICAgIG1hcmdpbjogMjRweCAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQGtleWZyYW1lcyBmYWRlLXVwIHtcclxuICAgICAgICAgIGZyb20ge1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoOHB4KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRvIHtcclxuICAgICAgICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDcyMHB4KSB7XHJcbiAgICAgICAgICAuY2F0ZWdvcnktc2hvdy1jb250YWluZXIge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAyMHB4IDE2cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNhdGVnb3J5LXNob3ctY2FyZCB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDI0cHggMjBweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2F0ZWdvcnktc2hvdy1kZXRhaWxzLWdyaWQge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIGB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1pbm5lclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1oZWFkZXJcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1raWNrZXJcIj5DYXRlZ29yeSBPdmVydmlldzwvZGl2PlxyXG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctdGl0bGVcIj57Y2F0ZWdvcnkubmFtZSB8fCBcIuKAlFwifTwvaDE+XHJcbiAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17YGNhdGVnb3J5LXNob3ctc3RhdHVzICR7Y2F0ZWdvcnkuaXNBY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJpbmFjdGl2ZVwifWB9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIDxzcGFuPuKXjzwvc3Bhbj5cclxuICAgICAgICAgICAge2NhdGVnb3J5LmlzQWN0aXZlID8gXCJBY3RpdmVcIiA6IFwiSW5hY3RpdmVcIn1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctY2FyZFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXNlY3Rpb25cIj5cclxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctc2VjdGlvbi10aXRsZVwiPkRlc2NyaXB0aW9uPC9oMz5cclxuICAgICAgICAgICAge2NhdGVnb3J5LmRlc2NyaXB0aW9uID8gKFxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kZXNjcmlwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAge2NhdGVnb3J5LmRlc2NyaXB0aW9ufVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctdmFsdWVcIlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tdGV4dC1tdXRlZClcIiB9fVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIE5vIGRlc2NyaXB0aW9uIHByb3ZpZGVkXHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGl2aWRlclwiIC8+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXNlY3Rpb25cIj5cclxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctc2VjdGlvbi10aXRsZVwiPkRldGFpbHM8L2gzPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRldGFpbHMtZ3JpZFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kZXRhaWwtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctbGFiZWxcIj5DYXRlZ29yeSBJRDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctdmFsdWUgZ29sZFwiXHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwibW9ub3NwYWNlXCIsIGZvbnRTaXplOiBcIjE0cHhcIiB9fVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICB7Y2F0ZWdvcnkuaWQgfHwgXCLigJRcIn1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGV0YWlsLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWxhYmVsXCI+U2x1ZzwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctdmFsdWVcIj5cclxuICAgICAgICAgICAgICAgICAge2NhdGVnb3J5LnNsdWcgfHwgXCLigJRcIn1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kaXZpZGVyXCIgLz5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctc2VjdGlvblwiPlxyXG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1zZWN0aW9uLXRpdGxlXCI+VGltZWxpbmU8L2gzPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRldGFpbHMtZ3JpZFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kZXRhaWwtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctbGFiZWxcIj5DcmVhdGVkPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy12YWx1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShjYXRlZ29yeS5jcmVhdGVkQXQpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kZXRhaWwtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctbGFiZWxcIj5MYXN0IFVwZGF0ZWQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXZhbHVlXCI+XHJcbiAgICAgICAgICAgICAgICAgIHtmb3JtYXREYXRlKGNhdGVnb3J5LnVwZGF0ZWRBdCl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2F0ZWdvcnlTaG93O1xyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCB3cmFwcGVyU3R5bGUgPSB7XHJcbiAgbWluSGVpZ2h0OiBcIjEwMCVcIixcclxuICBwYWRkaW5nOiBcIjI4cHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmZmZmZmZcIixcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMjBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjA4KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2ZmZmZmZlwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDE4cHggMzRweCByZ2JhKDE1LCAyMywgNDIsIDAuMDgpXCIsXHJcbiAgcGFkZGluZzogXCIyNHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBmb250U2l6ZTogXCJjbGFtcCgyOHB4LCA0dncsIDQ0cHgpXCIsXHJcbiAgbGluZUhlaWdodDogMSxcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbn07XHJcblxyXG5jb25zdCB0ZXh0U3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGNvbG9yOiBcIiM0NzU1NjlcIixcclxuICBsaW5lSGVpZ2h0OiAxLjgsXHJcbiAgZm9udFNpemU6IFwiMTVweFwiLFxyXG59O1xyXG5cclxuY29uc3QgQWJvdXQgPSAoKSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3dyYXBwZXJTdHlsZX0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGgxIHN0eWxlPXt0aXRsZVN0eWxlfT5BYm91dDwvaDE+XHJcbiAgICAgICAgPHAgc3R5bGU9e3RleHRTdHlsZX0+XHJcbiAgICAgICAgICBUaGlzIGFkbWluIGRhc2hib2FyZCBpcyB1c2VkIHRvIG1hbmFnZSBzaG9wIHByb2R1Y3RzLCBvcmRlcnMsIG9yZGVyXHJcbiAgICAgICAgICBpdGVtcywgY2F0ZWdvcmllcywgYW5kIHNldHRpbmdzIGluIG9uZSBwbGFjZS5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICA8aDIgc3R5bGU9e3sgLi4udGl0bGVTdHlsZSwgZm9udFNpemU6IFwiMjRweFwiLCBtYXJnaW5Cb3R0b206IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgV2hhdCB5b3UgY2FuIGRvIGhlcmVcclxuICAgICAgICA8L2gyPlxyXG4gICAgICAgIDxwIHN0eWxlPXt0ZXh0U3R5bGV9PlxyXG4gICAgICAgICAgQnJvd3NlIHByb2R1Y3RzLCBvcGVuIHByb2R1Y3QgZGV0YWlscywgY3JlYXRlIG9yZGVycywgYW5kIG1hbmFnZSB0aGVcclxuICAgICAgICAgIHN0b3JlIGRhdGEgZnJvbSB0aGUgQWRtaW5KUyBpbnRlcmZhY2UuXHJcbiAgICAgICAgPC9wPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBYm91dDtcclxuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgRGFzaGJvYXJkIGZyb20gJy4uL2FkbWluL2Rhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGFzaGJvYXJkID0gRGFzaGJvYXJkXG5pbXBvcnQgUmVnaXN0ZXIgZnJvbSAnLi4vYWRtaW4vcmVnaXN0ZXInXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlJlZ2lzdGVyID0gUmVnaXN0ZXJcbmltcG9ydCBQcm9kdWN0Q2FyZHNMaXN0IGZyb20gJy4uL2FkbWluL3Byb2R1Y3QtY2FyZHMtbGlzdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdENhcmRzTGlzdCA9IFByb2R1Y3RDYXJkc0xpc3RcbmltcG9ydCBQcm9kdWN0U2hvdyBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LXNob3cnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RTaG93ID0gUHJvZHVjdFNob3dcbmltcG9ydCBPcmRlckNyZWF0ZSBmcm9tICcuLi9hZG1pbi9vcmRlci1jcmVhdGUnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLk9yZGVyQ3JlYXRlID0gT3JkZXJDcmVhdGVcbmltcG9ydCBPcmRlclNob3cgZnJvbSAnLi4vYWRtaW4vb3JkZXItc2hvdydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuT3JkZXJTaG93ID0gT3JkZXJTaG93XG5pbXBvcnQgT3JkZXJJdGVtU2hvdyBmcm9tICcuLi9hZG1pbi9vcmRlci1pdGVtLXNob3cnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLk9yZGVySXRlbVNob3cgPSBPcmRlckl0ZW1TaG93XG5pbXBvcnQgUHJvZHVjdEltYWdlIGZyb20gJy4uL2FkbWluL3Byb2R1Y3QtaW1hZ2UnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RJbWFnZSA9IFByb2R1Y3RJbWFnZVxuaW1wb3J0IFByb2R1Y3RJbWFnZVVwbG9hZCBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LWltYWdlLXVwbG9hZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdEltYWdlVXBsb2FkID0gUHJvZHVjdEltYWdlVXBsb2FkXG5pbXBvcnQgUHJvZHVjdFNpemVTdG9ja0lucHV0IGZyb20gJy4uL2FkbWluL3Byb2R1Y3Qtc2l6ZS1zdG9jay1pbnB1dCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdFNpemVTdG9ja0lucHV0ID0gUHJvZHVjdFNpemVTdG9ja0lucHV0XG5pbXBvcnQgQ2F0ZWdvcnlTaG93IGZyb20gJy4uL2FkbWluL2NhdGVnb3J5LXNob3cnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkNhdGVnb3J5U2hvdyA9IENhdGVnb3J5U2hvd1xuaW1wb3J0IEFib3V0IGZyb20gJy4uL2FkbWluL2Fib3V0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5BYm91dCA9IEFib3V0Il0sIm5hbWVzIjpbImZvcm1hdEN1cnJlbmN5IiwidmFsdWUiLCJhbW91bnQiLCJOdW1iZXIiLCJ0b0xvY2FsZVN0cmluZyIsInVuZGVmaW5lZCIsIm1pbmltdW1GcmFjdGlvbkRpZ2l0cyIsIm1heGltdW1GcmFjdGlvbkRpZ2l0cyIsInByb2R1Y3RJbWFnZSIsInByb2R1Y3QiLCJyZXNvbHZlZCIsImltYWdlIiwiaW1hZ2VVcmwiLCJ0aHVtYm5haWwiLCJjb3ZlciIsIm5vcm1hbGl6ZWQiLCJTdHJpbmciLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwicHJvZHVjdExhYmVsIiwibmFtZSIsInNwbGl0Iiwic2xpY2UiLCJtYXAiLCJwYXJ0Iiwiam9pbiIsInRvVXBwZXJDYXNlIiwibm9ybWFsaXplUHJvZHVjdCIsIml0ZW0iLCJyZWNvcmQiLCJwYXJhbXMiLCJpZCIsInByaWNlIiwiaXNBY3RpdmUiLCJCb29sZWFuIiwic3RvY2siLCJjYXRlZ29yeU5hbWUiLCJjYXRlZ29yeSIsImNhdGVnb3J5SWQiLCJyZWNvcmRBY3Rpb25zIiwiYWN0aW9ucyIsIm5vcm1hbGl6ZU9yZGVyIiwic3RhdHVzIiwidG90YWxBbW91bnQiLCJjcmVhdGVkQXQiLCJ1c2VyTmFtZSIsInVzZXIiLCJjdXN0b21lck5hbWUiLCJzaGlwcGluZ05hbWUiLCJnZXRTaG93SHJlZiIsInNob3dBY3Rpb24iLCJmaW5kIiwiYWN0aW9uIiwiaHJlZiIsImVuY29kZVVSSUNvbXBvbmVudCIsIkRhc2hib2FyZCIsInN1bW1hcnkiLCJzZXRTdW1tYXJ5IiwidXNlU3RhdGUiLCJ1c2VycyIsInByb2R1Y3RzIiwiY2F0ZWdvcmllcyIsIm9yZGVycyIsInJlY29yZHMiLCJzZXRSZWNvcmRzIiwicmVjZW50T3JkZXJzIiwic2V0UmVjZW50T3JkZXJzIiwibG9hZGluZyIsInNldExvYWRpbmciLCJzZWFyY2hUZXJtIiwic2V0U2VhcmNoVGVybSIsImN1cnJlbnRTbGlkZSIsInNldEN1cnJlbnRTbGlkZSIsImN1cnJlbnRVc2VyTmFtZSIsInNldEN1cnJlbnRVc2VyTmFtZSIsImN1cnJlbnRVc2VyUm9sZSIsInNldEN1cnJlbnRVc2VyUm9sZSIsImlzVXNlck1lbnVPcGVuIiwic2V0SXNVc2VyTWVudU9wZW4iLCJ1c2VFZmZlY3QiLCJyb290IiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJib2R5IiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwiaXNNb3VudGVkIiwibG9hZERhc2hib2FyZCIsInN1bW1hcnlSZXNwb25zZSIsInByb2R1Y3RzUmVzcG9uc2UiLCJvcmRlcnNSZXNwb25zZSIsIlByb21pc2UiLCJhbGwiLCJmZXRjaCIsImNyZWRlbnRpYWxzIiwic3VtbWFyeVBheWxvYWQiLCJvayIsImpzb24iLCJwcm9kdWN0UGF5bG9hZCIsIm9yZGVyUGF5bG9hZCIsImxvYWRlZFJlY29yZHMiLCJBcnJheSIsImlzQXJyYXkiLCJsb2FkZWRPcmRlcnMiLCJsZW5ndGgiLCJlcnJvciIsImNsb3NlVXNlck1lbnUiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImxvYWRDdXJyZW50VXNlciIsInJlc3BvbnNlIiwiaGVhZGVycyIsIkFjY2VwdCIsInBheWxvYWQiLCJ0cmltIiwicm9sZSIsImFjdGl2ZVByb2R1Y3RzIiwidXNlTWVtbyIsImZpbHRlciIsImZpbHRlcmVkUHJvZHVjdHMiLCJxdWVyeSIsImhlcm9TbGlkZXMiLCJ0aW1lciIsIndpbmRvdyIsInNldEludGVydmFsIiwicHJldmlvdXMiLCJjbGVhckludGVydmFsIiwiZmVhdHVyZWRQcm9kdWN0IiwiaGVyb0ltYWdlIiwiaGVyb1RpdGxlIiwiaGVyb1N1YnRpdGxlIiwiaGVyb0hyZWYiLCJvcmRlcnNMaXN0SHJlZiIsInNwb3RsaWdodFByb2R1Y3RzIiwiYnVja2V0IiwiTWFwIiwiZm9yRWFjaCIsInNldCIsImdldCIsImZyb20iLCJlbnRyaWVzIiwiY291bnQiLCJpc0FkbWluVXNlciIsImFkbWluUHJvZHVjdFJvd3MiLCJjYXRlZ29yeVByZXZpZXciLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJzdHlsZSIsInBhZGRpbmciLCJrZXkiLCJzcmMiLCJhbHQiLCJjb2xTcGFuIiwiY29sb3IiLCJmb250V2VpZ2h0IiwiaHRtbEZvciIsIndpZHRoIiwiaGVpZ2h0Iiwidmlld0JveCIsImZpbGwiLCJzdHJva2UiLCJzdHJva2VXaWR0aCIsImN4IiwiY3kiLCJyIiwiZCIsInR5cGUiLCJwbGFjZWhvbGRlciIsIm9uQ2hhbmdlIiwiZXZlbnQiLCJ0YXJnZXQiLCJvbkNsaWNrIiwic3RvcFByb3BhZ2F0aW9uIiwibG9jYXRpb24iLCJhc3NpZ24iLCJNYXRoIiwibWF4IiwicHJldmVudERlZmF1bHQiLCJzbGlkZSIsImluZGV4IiwiZGlzcGxheSIsInBsYWNlSXRlbXMiLCJmb250U2l6ZSIsImJhY2tncm91bmQiLCJSZWdpc3RlciIsImZvcm1TdGF0ZSIsInNldEZvcm1TdGF0ZSIsImVtYWlsIiwicGFzc3dvcmQiLCJtZXNzYWdlIiwic2V0TWVzc2FnZSIsInRleHQiLCJpc1N1Ym1pdHRpbmciLCJzZXRJc1N1Ym1pdHRpbmciLCJtYXJnaW4iLCJoYW5kbGVDaGFuZ2UiLCJjdXJyZW50IiwiaGFuZGxlU3VibWl0IiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsImRhdGEiLCJFcnJvciIsInNldFRpbWVvdXQiLCJvblN1Ym1pdCIsInJlcXVpcmVkIiwibWluTGVuZ3RoIiwiZGlzYWJsZWQiLCJncmlkU3R5bGUiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwiZ2FwIiwiY2FyZFN0eWxlIiwiYm9yZGVyUmFkaXVzIiwiYm9yZGVyIiwib3ZlcmZsb3ciLCJib3hTaGFkb3ciLCJpbWFnZVdyYXBTdHlsZSIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsImltYWdlU3R5bGUiLCJvYmplY3RGaXQiLCJib2R5U3R5bGUiLCJtZXRhU3R5bGUiLCJiYWRnZVN0eWxlIiwibGV0dGVyU3BhY2luZyIsImxpbmtTdHlsZSIsIm1hcmdpblRvcCIsInRleHREZWNvcmF0aW9uIiwiY3Vyc29yIiwiZW1wdHlTdHlsZSIsImZvcm1hdFByaWNlIiwiaXNGaW5pdGUiLCJnZXRSZWNvcmRJZCIsInBhcmFtIiwicmVzb3VyY2VJZCIsInJhd0hyZWYiLCJQcm9kdWN0Q2FyZHNMaXN0IiwicHJvcHMiLCJhcGlSZWNvcmRzIiwic2V0QXBpUmVjb3JkcyIsImxvYWRFcnJvciIsInNldExvYWRFcnJvciIsInJlc291cmNlIiwicHJvcFJlY29yZHMiLCJsb2FkUmVjb3JkcyIsImRldGFpbHNIcmVmIiwib3BlbkRldGFpbHMiLCJwYWdlU3R5bGUiLCJtaW5IZWlnaHQiLCJ0b3BCYXJTdHlsZSIsIm1hcmdpbkJvdHRvbSIsImZsZXhXcmFwIiwiYmFja0xpbmtTdHlsZSIsImxheW91dFN0eWxlIiwiaW1hZ2VDYXJkU3R5bGUiLCJncmlkVGVtcGxhdGVSb3dzIiwiaW1hZ2VGYWxsYmFja1N0eWxlIiwidGV4dFRyYW5zZm9ybSIsImltYWdlRm9vdGVyU3R5bGUiLCJib3JkZXJUb3AiLCJ0aXRsZVN0eWxlIiwibGluZUhlaWdodCIsInN1YnRpdGxlU3R5bGUiLCJwaWxsU3R5bGUiLCJhY3RpdmUiLCJwaWxsRG90U3R5bGUiLCJpbmZvR3JpZFN0eWxlIiwiaW5mb0NhcmRTdHlsZSIsImluZm9MYWJlbFN0eWxlIiwiaW5mb1ZhbHVlU3R5bGUiLCJ3b3JkQnJlYWsiLCJzZWN0aW9uVGl0bGVTdHlsZSIsImRlc2NyaXB0aW9uU3R5bGUiLCJ3aGl0ZVNwYWNlIiwiZGV0YWlsc0dyaWRTdHlsZSIsImRldGFpbFJvd1N0eWxlIiwicGFkZGluZ0JvdHRvbSIsImJvcmRlckJvdHRvbSIsImRldGFpbExhYmVsU3R5bGUiLCJkZXRhaWxWYWx1ZVN0eWxlIiwidGV4dEFsaWduIiwiYWN0aW9uUm93U3R5bGUiLCJwcmltYXJ5QnV0dG9uU3R5bGUiLCJtaW5XaWR0aCIsInNlY29uZGFyeUJ1dHRvblN0eWxlIiwiZm9ybWF0RGF0ZSIsImRhdGUiLCJEYXRlIiwiaXNOYU4iLCJnZXRUaW1lIiwiZGF0ZVN0eWxlIiwidGltZVN0eWxlIiwiZ2V0UHJvZHVjdEltYWdlIiwicGFyc2VTaXplU3RvY2siLCJzb3VyY2UiLCJwYXJzZSIsInJhd1NpemUiLCJyYXdRdHkiLCJPYmplY3QiLCJzaXplIiwicXR5IiwidHJ1bmMiLCJQcm9kdWN0U2hvdyIsInByb2R1Y3REYXRhIiwic2V0UHJvZHVjdERhdGEiLCJwcm9kdWN0SWQiLCJza3UiLCJzaXplU3RvY2siLCJzaXplU3RvY2tFbnRyaWVzIiwiZGVzY3JpcHRpb24iLCJlZGl0VXJsIiwib3JkZXJVcmwiLCJoYW5kbGVPcmRlckNsaWNrIiwiaGFuZGxlRWRpdENsaWNrIiwidGhlbiIsInJlcyIsImNhdGNoIiwicGFkZGluZ1RvcCIsInVwZGF0ZWRBdCIsInN0YWNrU3R5bGUiLCJsYWJlbFN0eWxlIiwiaW5wdXRTdHlsZSIsImJveFNpemluZyIsImZvbnRGYW1pbHkiLCJyb3dTdHlsZSIsImdyaWQyU3R5bGUiLCJjdXN0b21lckluZm9TdHlsZSIsImN1c3RvbWVyUm93U3R5bGUiLCJtdXRlZFN0eWxlIiwic3Ryb25nU3R5bGUiLCJsaW5lSXRlbVJvd1N0eWxlIiwibGluZUl0ZW1Ub3BTdHlsZSIsInByb2R1Y3RQcmV2aWV3U3R5bGUiLCJhZGRCdXR0b25TdHlsZSIsInJlbW92ZUJ1dHRvblN0eWxlIiwidG90YWxzUm93U3R5bGUiLCJ0b3RhbFN0eWxlIiwiYWN0aW9uQmFyU3R5bGUiLCJhY3Rpb25CdXR0b25TdHlsZSIsInByaW1hcnkiLCJtYXBMaW5rU3R5bGUiLCJwYXltZW50T3B0aW9uR3JpZFN0eWxlIiwicGF5bWVudE9wdGlvblN0eWxlIiwic2VjdXJpdHlDaGlwV3JhcFN0eWxlIiwic2VjdXJpdHlDaGlwU3R5bGUiLCJyZXNwb25zaXZlQ3NzIiwicGF5bWVudE9wdGlvbnMiLCJsYWJlbCIsImljb24iLCJmYWxsYmFja1NpemVPcHRpb25zIiwic2hpcHBpbmdNZXRob2RzIiwidG9OdW1iZXIiLCJudW0iLCJmb3JtYXRNb25leSIsImdldFNpemVFbnRyaWVzIiwic29ydCIsImEiLCJiIiwibG9jYWxlQ29tcGFyZSIsImdldFNpemVPcHRpb25zIiwiY3JlYXRlRW1wdHlJdGVtIiwicXVhbnRpdHkiLCJ1bml0UHJpY2UiLCJPcmRlckNyZWF0ZSIsInNldFVzZXJzIiwic2V0UHJvZHVjdHMiLCJvcmRlckNvdW50QnlVc2VyIiwic2V0T3JkZXJDb3VudEJ5VXNlciIsInNlc3Npb25Vc2VyIiwic2V0U2Vzc2lvblVzZXIiLCJzdWJtaXR0aW5nIiwic2V0U3VibWl0dGluZyIsImZvcm1EYXRhIiwic2V0Rm9ybURhdGEiLCJ1c2VySWQiLCJwYXltZW50TWV0aG9kIiwicGF5bWVudFN0YXR1cyIsInRyYW5zYWN0aW9uSWQiLCJzaGlwcGluZ1Bob25lIiwic2hpcHBpbmdBZGRyZXNzIiwic2hpcHBpbmdNZXRob2QiLCJ0cmFja2luZ051bWJlciIsInNoaXBwaW5nRmVlIiwidGF4IiwiZGlzY291bnQiLCJsaW5lSXRlbXMiLCJzZXRMaW5lSXRlbXMiLCJoYWRMb2dpbkNsYXNzT25Sb290IiwiY29udGFpbnMiLCJoYWRMb2dpbkNsYXNzT25Cb2R5IiwiaGFkRGFzaGJvYXJkQ2xhc3NPblJvb3QiLCJoYWREYXNoYm9hcmRDbGFzc09uQm9keSIsImxvZ2luQmdMYXllciIsImdldEVsZW1lbnRCeUlkIiwicHJldmlvdXNMYXllckRpc3BsYXkiLCJzaGVsbE5vZGVzIiwiU2V0IiwicXVlcnlTZWxlY3RvciIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwcmV2aW91c0lubGluZUJhY2tncm91bmRzIiwibm9kZSIsImdldFByb3BlcnR5VmFsdWUiLCJiYWNrZ3JvdW5kUHJpb3JpdHkiLCJnZXRQcm9wZXJ0eVByaW9yaXR5IiwiYmFja2dyb3VuZENvbG9yIiwiYmFja2dyb3VuZENvbG9yUHJpb3JpdHkiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJiYWNrZ3JvdW5kSW1hZ2VQcmlvcml0eSIsInNldFByb3BlcnR5Iiwic3R5bGVzIiwicmVtb3ZlUHJvcGVydHkiLCJVUkxTZWFyY2hQYXJhbXMiLCJzZWFyY2giLCJwcmVQcm9kdWN0SWQiLCJmZXRjaERhdGEiLCJjb250ZXh0UmVzIiwiY29udGV4dERhdGEiLCJ1c2Vyc0RhdGEiLCJwcm9kdWN0c0xpc3QiLCJjdXJyZW50VXNlciIsInByZXYiLCJzZWxlY3RlZFByb2R1Y3QiLCJzZWxlY3RlZFByb2R1Y3RTaXplT3B0aW9ucyIsInNvbWUiLCJwIiwic2VsZWN0ZWQiLCJzZWxlY3RlZEN1c3RvbWVyIiwidSIsImN1c3RvbWVyT3JkZXJDb3VudCIsInBob25lIiwibW9iaWxlIiwibGluZVRvdGFscyIsInN1YnRvdGFsIiwicmVkdWNlIiwic3VtIiwiZ3JhbmRUb3RhbCIsImhhbmRsZUZvcm1DaGFuZ2UiLCJoYW5kbGVMaW5lSXRlbUNoYW5nZSIsIm5leHQiLCJzaXplT3B0aW9ucyIsIm1heFF0eUZvclNpemUiLCJtaW4iLCJzZWxlY3RlZFNpemVPcHRpb24iLCJvcHRpb24iLCJwYXJzZWRRdHkiLCJhZGRMaW5lSXRlbSIsInJlbW92ZUxpbmVJdGVtIiwiXyIsImkiLCJtYXBzSHJlZiIsInZhbGlkSXRlbXMiLCJhbGVydCIsInNpemVFbnRyaWVzIiwic2VsZWN0ZWRTaXplIiwiZW50cnkiLCJ0b0ZpeGVkIiwic3VibWl0Rm9ybSIsIkZvcm1EYXRhIiwiYXBwZW5kIiwib3JkZXJSZXMiLCJvcmRlckRhdGEiLCJyZWFkT25seSIsInNpemVTdG9ja1RleHQiLCJpdGVtVG90YWwiLCJzaXplT3B0aW9uIiwic3RlcCIsInJlc2l6ZSIsInJlbCIsImhpc3RvcnkiLCJiYWNrIiwiaGVhZGVyU3R5bGUiLCJoZWFkaW5nU3R5bGUiLCJzdWJUZXh0U3R5bGUiLCJ2YWwiLCJzdHlsZUJ5U3RhdHVzIiwicGVuZGluZyIsImJnIiwiZmciLCJwYWlkIiwicHJvY2Vzc2luZyIsInNoaXBwZWQiLCJjb21wbGV0ZWQiLCJjYW5jZWxsZWQiLCJpbmZvUm93U3R5bGUiLCJ0YWJsZVN0eWxlIiwibGluZUl0ZW1TdHlsZSIsInRvdGFsQm94U3R5bGUiLCJ0b3RhbFJvd1N0eWxlIiwiZ3JhbmRTdHlsZSIsIm4iLCJkdCIsIk9yZGVyU2hvdyIsImRldGFpbHMiLCJzZXREZXRhaWxzIiwic2V0RXJyb3IiLCJvcmRlcklkIiwibG9hZERldGFpbHMiLCJmZXRjaEVycm9yIiwidG90YWxzIiwiaXRlbXMiLCJ0b3RhbFByaWNlIiwiZW1wdHlJbWFnZVN0eWxlIiwiT3JkZXJJdGVtU2hvdyIsIm9yZGVySXRlbUlkIiwiY2FsY3VsYXRlZFRvdGFsIiwib3JkZXIiLCJjdXN0b21lciIsImNlbGxTdHlsZSIsImZsZXhTaHJpbmsiLCJmYWxsYmFja1N0eWxlIiwidGV4dFN0eWxlIiwiZmxleERpcmVjdGlvbiIsIlByb2R1Y3RJbWFnZSIsInByb3BlcnR5IiwicGF0aCIsImhhc0Vycm9yIiwic2V0SGFzRXJyb3IiLCJvbkVycm9yIiwid3JhcHBlclN0eWxlIiwicHJldmlld1N0eWxlIiwiaGludFN0eWxlIiwiUHJvZHVjdEltYWdlVXBsb2FkIiwiY3VycmVudFZhbHVlIiwiY3VycmVudFB1YmxpY0lkIiwiaW1hZ2VQdWJsaWNJZCIsInByZXZpZXdVcmwiLCJzZXRQcmV2aWV3VXJsIiwicHVibGljSWQiLCJzZXRQdWJsaWNJZCIsInVwbG9hZGluZyIsInNldFVwbG9hZGluZyIsImhhbmRsZVVwbG9hZCIsImZpbGUiLCJmaWxlcyIsInVwbG9hZGVkVXJsIiwidXJsIiwidXBsb2FkZWRQdWJsaWNJZCIsInVwbG9hZEVycm9yIiwiaGFuZGxlUmVtb3ZlIiwiYWNjZXB0IiwiRnJhZ21lbnQiLCJwYXJzZUluaXRpYWxWYWx1ZSIsIlByb2R1Y3RTaXplU3RvY2tJbnB1dCIsImluaXRpYWxSb3dzIiwicm93cyIsInNldFJvd3MiLCJyb3ciLCJ0b3RhbFN0b2NrIiwidmFsdWVzIiwidXBkYXRlUm93IiwiYWRkUm93IiwicmVtb3ZlUm93Iiwicm93SW5kZXgiLCJhY2MiLCJDYXRlZ29yeVNob3ciLCJzZXRDYXRlZ29yeSIsInRvTG9jYWxlRGF0ZVN0cmluZyIsInllYXIiLCJtb250aCIsImRheSIsImhvdXIiLCJtaW51dGUiLCJzbHVnIiwiQWJvdXQiLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7RUFFQSxNQUFNQSxnQkFBYyxHQUFJQyxLQUFLLElBQUs7RUFDaEMsRUFBQSxNQUFNQyxNQUFNLEdBQUdDLE1BQU0sQ0FBQ0YsS0FBSyxJQUFJLENBQUMsQ0FBQztFQUNqQyxFQUFBLE9BQU8sT0FBT0MsTUFBTSxDQUFDRSxjQUFjLENBQUNDLFNBQVMsRUFBRTtJQUM3Q0MscUJBQXFCLEVBQUVKLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0FBQy9DSyxJQUFBQSxxQkFBcUIsRUFBRTtBQUN6QixHQUFDLENBQUMsQ0FBQSxDQUFFO0VBQ04sQ0FBQztFQUVELE1BQU1DLFlBQVksR0FBSUMsT0FBTyxJQUFLO0VBQ2hDLEVBQUEsTUFBTUMsUUFBUSxHQUNaRCxPQUFPLEVBQUVFLEtBQUssSUFDZEYsT0FBTyxFQUFFRyxRQUFRLElBQ2pCSCxPQUFPLEVBQUVJLFNBQVMsSUFDbEJKLE9BQU8sRUFBRUssS0FBSyxJQUNkLGtCQUFrQjtJQUVwQixNQUFNQyxVQUFVLEdBQUdDLE1BQU0sQ0FBQ04sUUFBUSxJQUFJLEVBQUUsQ0FBQyxDQUFDTyxXQUFXLEVBQUU7RUFDdkQsRUFBQSxJQUFJRixVQUFVLENBQUNHLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSUgsVUFBVSxDQUFDRyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7RUFDOUQsSUFBQSxPQUFPLGtCQUFrQjtFQUMzQixFQUFBO0VBRUEs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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFBLENBQWlCLENBQUMsZUFFVkQsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUFLQyxNQUFBQSxTQUFTLEVBQUM7T0FBOEIsZUFDM0NGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsTUFBQUEsU0FBUyxFQUFDO0VBQWdDLEtBQUEsZUFDN0NGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUEsSUFBQSxlQUNFRCxzQkFBQSxDQUFBQyxhQUFBLENBQUEsSUFBQSxFQUFBO0VBQUlDLE1BQUFBLFNBQVMsRUFBQztFQUErQixLQUFBLEVBQUMsaUJBQW1CLENBQUMsZUFDbEVGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxHQUFBLEVBQUE7RUFBR0MsTUFBQUEsU0FBUyxFQUFDO0VBQWtDLEtBQUEsRUFBQywrREFFN0MsQ0FDQSxDQUFDLGVBRU5GLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsTUFBQUEsU0FBUyxFQUFDO09BQXVCLGVBQ3BDRixzQkFBQSxDQUFBQyxhQUFBLENBQUEsR0FBQSxFQUFBO0VBQ0VDLE1BQUFBLFNBQVMsRUFBQyxvREFBb0Q7RUFDOUQvRixNQUFBQSxJQUFJLEVBQUM7RUFBdUMsS0FBQSxFQUM3QyxlQUVFLENBQUMsZUFDSjZGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxHQUFBLEVBQUE7RUFDRUMsTUFBQUEsU0FBUyxFQUFDLHNCQUFzQjtFQUNoQy9GLE1BQUFBLElBQUksRUFBQztFQUF5QyxLQUFBLEVBQy9DLGdCQUVFLENBQ0EsQ0FDRixDQUFDLGVBRU42RixzQkFBQSxDQUFBQyxhQUFBLENBQUEsS0FBQSxFQUFBO0VBQUtDLE1BQUFBLFNBQVMsRUFBQztPQUErQixlQUM1Q0Ysc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUFLQyxNQUFBQSxTQUFTLEVBQUM7T0FBb0IsZUFDakNGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsTUFBQUEsU0FBUyxFQUFDO0VBQTBCLEtBQUEsRUFBQyxPQUFVLENBQUMsZUFDckRGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsTUFBQUEsU0FBUyxFQUFDO09BQTBCLEVBQUU1RixPQUFPLENBQUNHLEtBQVcsQ0FDM0QsQ0FBQyxlQUNOdUYsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUFLQyxNQUFBQSxTQUFTLEVBQUM7T0FBb0IsZUFDakNGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsTUFBQUEsU0FBUyxFQUFDO0VBQTBCLEtBQUEsRUFBQyxVQUFhLENBQUMsZUFDeERGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsTUFBQUEsU0FBUyxFQUFDO09BQTBCLEVBQUU1RixPQUFPLENBQUNJLFFBQWMsQ0FDOUQsQ0FBQyxlQUNOc0Ysc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUFLQyxNQUFBQSxTQUFTLEVBQUM7T0FBb0IsZUFDakNGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsTUFBQUEsU0FBUyxFQUFDO0VBQTBCLEtBQUEsRUFBQyxRQUFXLENBQUMsZUFDdERGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsTUFBQUEsU0FBUyxFQUFDO09BQTBCLEVBQUU1RixPQUFPLENBQUNNLE1BQVksQ0FDNUQsQ0FBQyxlQUNOb0Ysc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUFLQyxNQUFBQSxTQUFTLEVBQUM7T0FBb0IsZUFDakNGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsTUFBQUEsU0FBUyxFQUFDO0VBQTBCLEtBQUEsRUFBQyxZQUFlLENBQUMsZUFDMURGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsTUFBQUEsU0FBUyxFQUFDO09BQTBCLEVBQ3RDNUYsT0FBTyxDQUFDSyxVQUNOLENBQ0YsQ0FDRixDQUFDLGVBRU5xRixzQkFBQSxDQUFBQyxhQUFBLENBQUEsS0FBQSxFQUFBO0VBQUtDLE1BQUFBLFNBQVMsRUFBQztPQUErQixlQUM1Q0Ysc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEdBQUEsRUFBQTtFQUNFQyxNQUFBQSxTQUFTLEVBQUMsb0JBQW9CO0VBQzlCL0YsTUFBQUEsSUFBSSxFQUFDO09BQXdDLGVBRTdDNkYsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLFFBQUEsRUFBQSxJQUFBLEVBQVEsVUFBZ0IsQ0FBQyxFQUFBLHlDQUV4QixDQUFDLGVBQ0pELHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxHQUFBLEVBQUE7RUFDRUMsTUFBQUEsU0FBUyxFQUFDLG9CQUFvQjtFQUM5Qi9GLE1BQUFBLElBQUksRUFBQztPQUFzQyxlQUUzQzZGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxRQUFBLEVBQUEsSUFBQSxFQUFRLFFBQWMsQ0FBQyxFQUFBLHFDQUV0QixDQUFDLGVBQ0pELHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxHQUFBLEVBQUE7RUFDRUMsTUFBQUEsU0FBUyxFQUFDLG9CQUFvQjtFQUM5Qi9GLE1BQUFBLElBQUksRUFBQztFQUFxQyxLQUFBLGVBRTFDNkYsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLFFBQUEsRUFBQSxJQUFBLEVBQVEsT0FBYSxDQUFDLEVBQUEsa0NBRXJCLENBQ0EsQ0FBQyxlQUVORCxzQkFBQSxDQUFBQyxhQUFBLENBQUEsS0FBQSxFQUFBO0VBQUtDLE1BQUFBLFNBQVMsRUFBQyxxQkFBcUI7RUFBQ0MsTUFBQUEsS0FBSyxFQUFFO0VBQUVDLFFBQUFBLE9BQU8sRUFBRTtFQUFPO09BQUUsZUFDOURKLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxJQUFBLEVBQUE7RUFBSUMsTUFBQUEsU0FBUyxFQUFDO0VBQTZCLEtBQUEsRUFBQyxnQkFBa0IsQ0FBQyxlQUMvREYsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUFLQyxNQUFBQSxTQUFTLEVBQUM7T0FBMEIsZUFDdkNGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxPQUFBLEVBQUE7RUFBT0MsTUFBQUEsU0FBUyxFQUFDO0VBQXFCLEtBQUEsZUFDcENGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxPQUFBLEVBQUEsSUFBQSxlQUNFRCxzQkFBQSxDQUFBQyxhQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsZUFDRUQsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLElBQUEsRUFBQSxJQUFBLEVBQUksT0FBUyxDQUFDLGVBQ2RELHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxFQUFJLE1BQVEsQ0FBQyxlQUNiRCxzQkFBQSxDQUFBQyxhQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsRUFBSSxVQUFZLENBQUMsZUFDakJELHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxFQUFJLE9BQVMsQ0FBQyxlQUNkRCxzQkFBQSxDQUFBQyxhQUFBLGFBQUksT0FBUyxDQUFDLGVBQ2RELHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxFQUFJLFFBQVUsQ0FBQyxlQUNmRCxzQkFBQSxDQUFBQyxhQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsRUFBSSxRQUFVLENBQ1osQ0FDQyxDQUFDLGVBQ1JELHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxPQUFBLEVBQUEsSUFBQSxFQUNHSCxnQkFBZ0IsQ0FBQ3ZDLE1BQU0sR0FDdEJ1QyxnQkFBZ0IsQ0FBQ3pILEdBQUcsQ0FBRWQsT0FBTyxpQkFDM0J5SSxzQkFBQSxDQUFBQyxhQUFBLENBQUEsSUFBQSxFQUFBO1FBQUlJLEdBQUcsRUFBRTlJLE9BQU8sQ0FBQ3NCO09BQUcsZUFDbEJtSCxzQkFBQSxDQUFBQyxhQUFBLENBQUEsSUFBQSxFQUFBO0VBQUlDLE1BQUFBLFNBQVMsRUFBQztPQUEwQixlQUN0Q0Ysc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUNFQyxNQUFBQSxTQUFTLEVBQUMscUJBQXFCO0VBQy9CSSxNQUFBQSxHQUFHLEVBQUVoSixZQUFZLENBQUNDLE9BQU8sQ0FBRTtRQUMzQmdKLEdBQUcsRUFBRWhKLE9BQU8sQ0FBQ1c7T0FDZCxDQUNDLENBQUMsZUFDTDhILHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxFQUFLMUksT0FBTyxDQUFDVyxJQUFTLENBQUMsZUFDdkI4SCxzQkFBQSxDQUFBQyxhQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsRUFBSzFJLE9BQU8sQ0FBQzJCLFlBQVksSUFBSSxHQUFRLENBQUMsZUFDdEM4RyxzQkFBQSxDQUFBQyxhQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsRUFBS2hKLE1BQU0sQ0FBQ00sT0FBTyxDQUFDMEIsS0FBSyxJQUFJLENBQUMsQ0FBTSxDQUFDLGVBQ3JDK0csc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLElBQUEsRUFBQSxJQUFBLEVBQUtuSixnQkFBYyxDQUFDUyxPQUFPLENBQUN1QixLQUFLLENBQU0sQ0FBQyxlQUN4Q2tILHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxlQUNFRCxzQkFBQSxDQUFBQyxhQUFBLENBQUEsTUFBQSxFQUFBO1FBQ0VDLFNBQVMsRUFBRSw2QkFDVDNJLE9BQU8sQ0FBQ3dCLFFBQVEsR0FDWixtQ0FBbUMsR0FDbkMscUNBQXFDLENBQUE7RUFDeEMsS0FBQSxFQUVGeEIsT0FBTyxDQUFDd0IsUUFBUSxHQUFHLFFBQVEsR0FBRyxVQUMzQixDQUNKLENBQUMsZUFDTGlILHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxlQUNFRCxzQkFBQSxDQUFBQyxhQUFBLENBQUEsR0FBQSxFQUFBO1FBQUc5RixJQUFJLEVBQUVKLGFBQVcsQ0FBQ3hDLE9BQU87RUFBRSxLQUFBLEVBQUMsTUFBTyxDQUNwQyxDQUNGLENBQ0wsQ0FBQyxnQkFFRnlJLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxlQUNFRCxzQkFBQSxDQUFBQyxhQUFBLENBQUEsSUFBQSxFQUFBO0VBQUlPLE1BQUFBLE9BQU8sRUFBRSxDQUFFO0VBQUNMLE1BQUFBLEtBQUssRUFBRTtFQUFFTSxRQUFBQSxLQUFLLEVBQUU7RUFBVTtPQUFFLEVBQUMsd0JBRXpDLENBQ0YsQ0FFRCxDQUNGLENBQ0osQ0FDRixDQUFDLGVBRU5ULHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsTUFBQUEsU0FBUyxFQUFDLHFCQUFxQjtFQUFDQyxNQUFBQSxLQUFLLEVBQUU7RUFBRUMsUUFBQUEsT0FBTyxFQUFFO0VBQU87T0FBRSxlQUM5REosc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLElBQUEsRUFBQTtFQUFJQyxNQUFBQSxTQUFTLEVBQUM7RUFBNkIsS0FBQSxFQUFDLFlBQWMsQ0FBQyxlQUMzREYsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUFLQyxNQUFBQSxTQUFTLEVBQUM7T0FBNkIsRUFDekNILGVBQWUsQ0FBQzFILEdBQUcsQ0FBRWMsUUFBUSxpQkFDNUI2RyxzQkFBQSxDQUFBQyxhQUFBLENBQUEsS0FBQSxFQUFBO1FBQ0VJLEdBQUcsRUFBRWxILFFBQVEsQ0FBQ2pCLElBQUs7RUFDbkJnSSxNQUFBQSxTQUFTLEVBQUM7RUFBNkIsS0FBQSxlQUV2Q0Ysc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLE1BQUEsRUFBQSxJQUFBLGVBQ0VELHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxRQUFBLEVBQUE7RUFBUUMsTUFBQUEsU0FBUyxFQUFDO0VBQTZCLEtBQUEsRUFDNUMvRyxRQUFRLENBQUNqQixJQUNKLENBQUMsZUFDVDhILHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxNQUFBLEVBQUE7RUFBTUMsTUFBQUEsU0FBUyxFQUFDO0VBQTZCLEtBQUEsRUFBQyxzQkFFeEMsQ0FDRixDQUFDLGVBQ1BGLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxNQUFBLEVBQUE7RUFBTUUsTUFBQUEsS0FBSyxFQUFFO0VBQUVPLFFBQUFBLFVBQVUsRUFBRTtFQUFJO09BQUUsRUFBRXZILFFBQVEsQ0FBQ3lHLEtBQVksQ0FDckQsQ0FDTixDQUNFLENBQ0YsQ0FDRixDQUNGLENBQUM7RUFFVixFQUFBO0lBRUEsb0JBQ0VJLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsSUFBQUEsU0FBUyxFQUFDO0tBQThCLGVBQzNDRixzQkFBQSxDQUFBQyxhQUFBLENBQUEsT0FBQSxFQUFBLElBQUEsRUFBUTtBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlDQUFBLEVBQW1DbEIsU0FBUyxDQUFBO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUEsQ0FBZSxDQUFDLGVBRVZELHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsSUFBQUEsU0FBUyxFQUFDO0tBQXFCLGVBQ2xDRixzQkFBQSxDQUFBQyxhQUFBLENBQUEsS0FBQSxFQUFBO0VBQUtDLElBQUFBLFNBQVMsRUFBQztLQUFzQixlQUNuQ0Ysc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEtBQUEsRUFBQTtFQUFLQyxJQUFBQSxTQUFTLEVBQUM7RUFBc0IsR0FBQSxFQUFDLG1CQUFzQixDQUFDLGVBQzdERixzQkFBQSxDQUFBQyxh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
