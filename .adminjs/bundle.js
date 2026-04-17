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
    const displayedProducts = React.useMemo(() => {
      return filteredProducts;
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
      href: "#products"
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
    }, "Loading products...") : displayedProducts.length === 0 ? /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-empty"
    }, "No products found.") : /*#__PURE__*/React__default.default.createElement("div", {
      className: "change8-product-grid"
    }, displayedProducts.map(product => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9hZG1pbi9kYXNoYm9hcmQuanN4IiwiLi4vYWRtaW4vcmVnaXN0ZXIuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1jYXJkcy1saXN0LmpzeCIsIi4uL2FkbWluL3Byb2R1Y3Qtc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1jcmVhdGUuanN4IiwiLi4vYWRtaW4vb3JkZXItc2hvdy5qc3giLCIuLi9hZG1pbi9vcmRlci1pdGVtLXNob3cuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS5qc3giLCIuLi9hZG1pbi9wcm9kdWN0LWltYWdlLXVwbG9hZC5qc3giLCIuLi9hZG1pbi9wcm9kdWN0LXNpemUtc3RvY2staW5wdXQuanN4IiwiLi4vYWRtaW4vY2F0ZWdvcnktc2hvdy5qc3giLCIuLi9hZG1pbi9hYm91dC5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgZm9ybWF0Q3VycmVuY3kgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBhbW91bnQgPSBOdW1iZXIodmFsdWUgfHwgMCk7XHJcbiAgcmV0dXJuIGBScy4gJHthbW91bnQudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IGFtb3VudCAlIDEgPT09IDAgPyAwIDogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgcHJvZHVjdEltYWdlID0gKHByb2R1Y3QpID0+IHtcclxuICBjb25zdCByZXNvbHZlZCA9XHJcbiAgICBwcm9kdWN0Py5pbWFnZSB8fFxyXG4gICAgcHJvZHVjdD8uaW1hZ2VVcmwgfHxcclxuICAgIHByb2R1Y3Q/LnRodW1ibmFpbCB8fFxyXG4gICAgcHJvZHVjdD8uY292ZXIgfHxcclxuICAgIFwiL3B1YmxpYy9pbWczLnBuZ1wiO1xyXG5cclxuICBjb25zdCBub3JtYWxpemVkID0gU3RyaW5nKHJlc29sdmVkIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCk7XHJcbiAgaWYgKG5vcm1hbGl6ZWQuaW5jbHVkZXMoXCJpbWcxXCIpIHx8IG5vcm1hbGl6ZWQuaW5jbHVkZXMoXCJpbWcyXCIpKSB7XHJcbiAgICByZXR1cm4gXCIvcHVibGljL2ltZzMucG5nXCI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzb2x2ZWQ7XHJcbn07XHJcblxyXG5jb25zdCBwcm9kdWN0TGFiZWwgPSAocHJvZHVjdCkgPT4ge1xyXG4gIGNvbnN0IG5hbWUgPSBTdHJpbmcocHJvZHVjdD8ubmFtZSB8fCBcInByb2R1Y3RcIik7XHJcbiAgcmV0dXJuIG5hbWVcclxuICAgIC5zcGxpdChcIiBcIilcclxuICAgIC5zbGljZSgwLCAyKVxyXG4gICAgLm1hcCgocGFydCkgPT4gcGFydFswXSlcclxuICAgIC5qb2luKFwiXCIpXHJcbiAgICAudG9VcHBlckNhc2UoKTtcclxufTtcclxuXHJcbmNvbnN0IG5vcm1hbGl6ZVByb2R1Y3QgPSAoaXRlbSkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZCA9IGl0ZW0/LnBhcmFtcyA/IGl0ZW0ucGFyYW1zIDogaXRlbSB8fCB7fTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGlkOiByZWNvcmQuaWQgPz8gaXRlbT8uaWQsXHJcbiAgICBuYW1lOiByZWNvcmQubmFtZSB8fCBcIlVudGl0bGVkIHByb2R1Y3RcIixcclxuICAgIHByaWNlOiBOdW1iZXIocmVjb3JkLnByaWNlIHx8IDApLFxyXG4gICAgaW1hZ2VVcmw6IHJlY29yZC5pbWFnZVVybCB8fCBcIlwiLFxyXG4gICAgaXNBY3RpdmU6IEJvb2xlYW4ocmVjb3JkLmlzQWN0aXZlKSxcclxuICAgIHN0b2NrOiBOdW1iZXIocmVjb3JkLnN0b2NrIHx8IDApLFxyXG4gICAgY2F0ZWdvcnlOYW1lOlxyXG4gICAgICByZWNvcmQ/LmNhdGVnb3J5Py5uYW1lIHx8XHJcbiAgICAgIHJlY29yZD8uY2F0ZWdvcnlOYW1lIHx8XHJcbiAgICAgIHJlY29yZD8uY2F0ZWdvcnlJZCB8fFxyXG4gICAgICBcIlNob3BcIixcclxuICAgIHJlY29yZEFjdGlvbnM6IGl0ZW0/LnJlY29yZEFjdGlvbnMgfHwgaXRlbT8uYWN0aW9ucyB8fCBbXSxcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3Qgbm9ybWFsaXplT3JkZXIgPSAoaXRlbSkgPT4ge1xyXG4gIGNvbnN0IHJlY29yZCA9IGl0ZW0/LnBhcmFtcyA/IGl0ZW0ucGFyYW1zIDogaXRlbSB8fCB7fTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGlkOiByZWNvcmQuaWQgPz8gaXRlbT8uaWQsXHJcbiAgICBzdGF0dXM6IFN0cmluZyhyZWNvcmQuc3RhdHVzIHx8IFwicGVuZGluZ1wiKSxcclxuICAgIHRvdGFsQW1vdW50OiBOdW1iZXIocmVjb3JkLnRvdGFsQW1vdW50IHx8IDApLFxyXG4gICAgY3JlYXRlZEF0OiByZWNvcmQuY3JlYXRlZEF0IHx8IGl0ZW0/LmNyZWF0ZWRBdCB8fCBudWxsLFxyXG4gICAgdXNlck5hbWU6XHJcbiAgICAgIHJlY29yZD8udXNlcj8ubmFtZSB8fFxyXG4gICAgICByZWNvcmQ/LmN1c3RvbWVyTmFtZSB8fFxyXG4gICAgICByZWNvcmQ/LnNoaXBwaW5nTmFtZSB8fFxyXG4gICAgICBcIk9yZGVyXCIsXHJcbiAgICByZWNvcmRBY3Rpb25zOiBpdGVtPy5yZWNvcmRBY3Rpb25zIHx8IGl0ZW0/LmFjdGlvbnMgfHwgW10sXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IGdldFNob3dIcmVmID0gKHByb2R1Y3QpID0+IHtcclxuICBjb25zdCByZWNvcmRBY3Rpb25zID0gcHJvZHVjdD8ucmVjb3JkQWN0aW9ucyB8fCBbXTtcclxuICBjb25zdCBzaG93QWN0aW9uID0gcmVjb3JkQWN0aW9ucy5maW5kKChhY3Rpb24pID0+IGFjdGlvbj8ubmFtZSA9PT0gXCJzaG93XCIpO1xyXG4gIGlmIChzaG93QWN0aW9uPy5ocmVmKSB7XHJcbiAgICByZXR1cm4gc2hvd0FjdGlvbi5ocmVmO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHByb2R1Y3Q/LmlkXHJcbiAgICA/IGAvYWRtaW4vcmVzb3VyY2VzL1Byb2R1Y3RzL3JlY29yZHMvJHtlbmNvZGVVUklDb21wb25lbnQocHJvZHVjdC5pZCl9L3Nob3dgXHJcbiAgICA6IFwiXCI7XHJcbn07XHJcblxyXG5jb25zdCBEYXNoYm9hcmQgPSAoKSA9PiB7XHJcbiAgY29uc3QgW3N1bW1hcnksIHNldFN1bW1hcnldID0gdXNlU3RhdGUoe1xyXG4gICAgdXNlcnM6IDAsXHJcbiAgICBwcm9kdWN0czogMCxcclxuICAgIGNhdGVnb3JpZXM6IDAsXHJcbiAgICBvcmRlcnM6IDAsXHJcbiAgfSk7XHJcbiAgY29uc3QgW3JlY29yZHMsIHNldFJlY29yZHNdID0gdXNlU3RhdGUoW10pO1xyXG4gIGNvbnN0IFtyZWNlbnRPcmRlcnMsIHNldFJlY2VudE9yZGVyc10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XHJcbiAgY29uc3QgW3NlYXJjaFRlcm0sIHNldFNlYXJjaFRlcm1dID0gdXNlU3RhdGUoXCJcIik7XHJcbiAgY29uc3QgW2N1cnJlbnRTbGlkZSwgc2V0Q3VycmVudFNsaWRlXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtjdXJyZW50VXNlck5hbWUsIHNldEN1cnJlbnRVc2VyTmFtZV0gPSB1c2VTdGF0ZShcIlwiKTtcclxuICBjb25zdCBbY3VycmVudFVzZXJSb2xlLCBzZXRDdXJyZW50VXNlclJvbGVdID0gdXNlU3RhdGUoXCJcIik7XHJcbiAgY29uc3QgW2lzVXNlck1lbnVPcGVuLCBzZXRJc1VzZXJNZW51T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcblxyXG4gICAgcm9vdC5jbGFzc0xpc3QuYWRkKFwiY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlXCIpO1xyXG4gICAgYm9keT8uY2xhc3NMaXN0LmFkZChcImNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQtcGFnZVwiKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICByb290LmNsYXNzTGlzdC5yZW1vdmUoXCJjaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2VcIik7XHJcbiAgICAgIGJvZHk/LmNsYXNzTGlzdC5yZW1vdmUoXCJjaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2VcIik7XHJcbiAgICB9O1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGxldCBpc01vdW50ZWQgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IGxvYWREYXNoYm9hcmQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHNldExvYWRpbmcodHJ1ZSk7XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IFtzdW1tYXJ5UmVzcG9uc2UsIHByb2R1Y3RzUmVzcG9uc2UsIG9yZGVyc1Jlc3BvbnNlXSA9XHJcbiAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgICAgIGZldGNoKFwiL2FkbWluL2FwaS9kYXNoYm9hcmRcIiwgeyBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiIH0pLFxyXG4gICAgICAgICAgICBmZXRjaChcIi9hcGkvcHJvZHVjdHNcIiwge1xyXG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBmZXRjaChcIi9hZG1pbi9hcGkvcmVzb3VyY2VzL09yZGVycy9hY3Rpb25zL2xpc3RcIiwge1xyXG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHN1bW1hcnlQYXlsb2FkID0gc3VtbWFyeVJlc3BvbnNlLm9rXHJcbiAgICAgICAgICA/IGF3YWl0IHN1bW1hcnlSZXNwb25zZS5qc29uKClcclxuICAgICAgICAgIDoge307XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdFBheWxvYWQgPSBwcm9kdWN0c1Jlc3BvbnNlLm9rXHJcbiAgICAgICAgICA/IGF3YWl0IHByb2R1Y3RzUmVzcG9uc2UuanNvbigpXHJcbiAgICAgICAgICA6IFtdO1xyXG4gICAgICAgIGNvbnN0IG9yZGVyUGF5bG9hZCA9IG9yZGVyc1Jlc3BvbnNlLm9rXHJcbiAgICAgICAgICA/IGF3YWl0IG9yZGVyc1Jlc3BvbnNlLmpzb24oKVxyXG4gICAgICAgICAgOiB7fTtcclxuXHJcbiAgICAgICAgaWYgKCFpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRlZFJlY29yZHMgPSBBcnJheS5pc0FycmF5KHByb2R1Y3RQYXlsb2FkKVxyXG4gICAgICAgICAgPyBwcm9kdWN0UGF5bG9hZC5tYXAobm9ybWFsaXplUHJvZHVjdClcclxuICAgICAgICAgIDogW107XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRlZE9yZGVycyA9IEFycmF5LmlzQXJyYXkob3JkZXJQYXlsb2FkPy5yZWNvcmRzKVxyXG4gICAgICAgICAgPyBvcmRlclBheWxvYWQucmVjb3Jkcy5tYXAobm9ybWFsaXplT3JkZXIpXHJcbiAgICAgICAgICA6IFtdO1xyXG5cclxuICAgICAgICBzZXRTdW1tYXJ5KHtcclxuICAgICAgICAgIHVzZXJzOiBOdW1iZXIoc3VtbWFyeVBheWxvYWQ/LnVzZXJzIHx8IDApLFxyXG4gICAgICAgICAgcHJvZHVjdHM6IE51bWJlcihcclxuICAgICAgICAgICAgc3VtbWFyeVBheWxvYWQ/LnByb2R1Y3RzIHx8IGxvYWRlZFJlY29yZHMubGVuZ3RoIHx8IDAsXHJcbiAgICAgICAgICApLFxyXG4gICAgICAgICAgY2F0ZWdvcmllczogTnVtYmVyKHN1bW1hcnlQYXlsb2FkPy5jYXRlZ29yaWVzIHx8IDApLFxyXG4gICAgICAgICAgb3JkZXJzOiBOdW1iZXIoc3VtbWFyeVBheWxvYWQ/Lm9yZGVycyB8fCAwKSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBzZXRSZWNvcmRzKGxvYWRlZFJlY29yZHMpO1xyXG4gICAgICAgIHNldFJlY2VudE9yZGVycyhsb2FkZWRPcmRlcnMpO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldFJlY29yZHMoW10pO1xyXG4gICAgICAgICAgc2V0UmVjZW50T3JkZXJzKFtdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWREYXNoYm9hcmQoKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBpc01vdW50ZWQgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgY2xvc2VVc2VyTWVudSA9ICgpID0+IHtcclxuICAgICAgc2V0SXNVc2VyTWVudU9wZW4oZmFsc2UpO1xyXG4gICAgfTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VVc2VyTWVudSk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlVXNlck1lbnUpO1xyXG4gICAgfTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBsb2FkQ3VycmVudFVzZXIgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hZG1pbi9jb250ZXh0L2N1cnJlbnQtdXNlclwiLCB7XHJcbiAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxyXG4gICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0Q3VycmVudFVzZXJOYW1lKFN0cmluZyhwYXlsb2FkPy5uYW1lIHx8IFwiXCIpLnRyaW0oKSk7XHJcbiAgICAgICAgICBzZXRDdXJyZW50VXNlclJvbGUoXHJcbiAgICAgICAgICAgIFN0cmluZyhwYXlsb2FkPy5yb2xlIHx8IFwiXCIpXHJcbiAgICAgICAgICAgICAgLnRyaW0oKVxyXG4gICAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0Q3VycmVudFVzZXJOYW1lKFwiXCIpO1xyXG4gICAgICAgICAgc2V0Q3VycmVudFVzZXJSb2xlKFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkQ3VycmVudFVzZXIoKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBpc01vdW50ZWQgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCBhY3RpdmVQcm9kdWN0cyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgcmV0dXJuIHJlY29yZHMuZmlsdGVyKChwcm9kdWN0KSA9PiBwcm9kdWN0LmlzQWN0aXZlICE9PSBmYWxzZSk7XHJcbiAgfSwgW3JlY29yZHNdKTtcclxuXHJcbiAgY29uc3QgZmlsdGVyZWRQcm9kdWN0cyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3QgcXVlcnkgPSBzZWFyY2hUZXJtLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgIGlmICghcXVlcnkpIHtcclxuICAgICAgcmV0dXJuIGFjdGl2ZVByb2R1Y3RzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhY3RpdmVQcm9kdWN0cy5maWx0ZXIoKHByb2R1Y3QpID0+IHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBwcm9kdWN0Lm5hbWUsXHJcbiAgICAgICAgU3RyaW5nKHByb2R1Y3QuY2F0ZWdvcnlOYW1lIHx8IFwiXCIpLFxyXG4gICAgICAgIFN0cmluZyhwcm9kdWN0LnN0b2NrIHx8IFwiXCIpLFxyXG4gICAgICBdXHJcbiAgICAgICAgLmpvaW4oXCIgXCIpXHJcbiAgICAgICAgLnRvTG93ZXJDYXNlKClcclxuICAgICAgICAuaW5jbHVkZXMocXVlcnkpO1xyXG4gICAgfSk7XHJcbiAgfSwgW2FjdGl2ZVByb2R1Y3RzLCBzZWFyY2hUZXJtXSk7XHJcblxyXG4gIGNvbnN0IGhlcm9TbGlkZXMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogXCJpbWczLXN0YXRpY1wiLFxyXG4gICAgICAgIG5hbWU6IFwiTmV3IENvbGxlY3Rpb25cIixcclxuICAgICAgICBjYXRlZ29yeU5hbWU6IFwiRmVhdHVyZWRcIixcclxuICAgICAgICBpbWFnZVVybDogXCIvcHVibGljL2ltZzMucG5nXCIsXHJcbiAgICAgICAgaXNBY3RpdmU6IHRydWUsXHJcbiAgICAgICAgc3RvY2s6IDAsXHJcbiAgICAgICAgcHJpY2U6IDAsXHJcbiAgICAgICAgcmVjb3JkQWN0aW9uczogW10sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogXCJpbWc0LXN0YXRpY1wiLFxyXG4gICAgICAgIG5hbWU6IFwiTGF0ZXN0IERyb3BcIixcclxuICAgICAgICBjYXRlZ29yeU5hbWU6IFwiRmVhdHVyZWRcIixcclxuICAgICAgICBpbWFnZVVybDogXCIvcHVibGljL2ltZzQucG5nXCIsXHJcbiAgICAgICAgaXNBY3RpdmU6IHRydWUsXHJcbiAgICAgICAgc3RvY2s6IDAsXHJcbiAgICAgICAgcHJpY2U6IDAsXHJcbiAgICAgICAgcmVjb3JkQWN0aW9uczogW10sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogXCJpbWc1LXN0YXRpY1wiLFxyXG4gICAgICAgIG5hbWU6IFwiTGF0ZXN0IERyb3BcIixcclxuICAgICAgICBjYXRlZ29yeU5hbWU6IFwiRmVhdHVyZWRcIixcclxuICAgICAgICBpbWFnZVVybDogXCIvcHVibGljL2ltZzUucG5nXCIsXHJcbiAgICAgICAgaXNBY3RpdmU6IHRydWUsXHJcbiAgICAgICAgc3RvY2s6IDAsXHJcbiAgICAgICAgcHJpY2U6IDAsXHJcbiAgICAgICAgcmVjb3JkQWN0aW9uczogW10sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChoZXJvU2xpZGVzLmxlbmd0aCA8PSAxKSB7XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBzZXRDdXJyZW50U2xpZGUoKHByZXZpb3VzKSA9PiAocHJldmlvdXMgKyAxKSAlIGhlcm9TbGlkZXMubGVuZ3RoKTtcclxuICAgIH0sIDQyMDApO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aW1lcik7XHJcbiAgfSwgW2hlcm9TbGlkZXMubGVuZ3RoXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoY3VycmVudFNsaWRlID49IGhlcm9TbGlkZXMubGVuZ3RoKSB7XHJcbiAgICAgIHNldEN1cnJlbnRTbGlkZSgwKTtcclxuICAgIH1cclxuICB9LCBbY3VycmVudFNsaWRlLCBoZXJvU2xpZGVzLmxlbmd0aF0pO1xyXG5cclxuICBjb25zdCBmZWF0dXJlZFByb2R1Y3QgPVxyXG4gICAgaGVyb1NsaWRlc1tjdXJyZW50U2xpZGVdIHx8IGFjdGl2ZVByb2R1Y3RzWzBdIHx8IHJlY29yZHNbMF0gfHwgbnVsbDtcclxuICBjb25zdCBoZXJvSW1hZ2UgPSBwcm9kdWN0SW1hZ2UoZmVhdHVyZWRQcm9kdWN0KTtcclxuICBjb25zdCBoZXJvVGl0bGUgPSBmZWF0dXJlZFByb2R1Y3Q/Lm5hbWUgfHwgXCJSZXZpdmUgTWUgSmV0dFwiO1xyXG4gIGNvbnN0IGhlcm9TdWJ0aXRsZSA9IGZlYXR1cmVkUHJvZHVjdD8uY2F0ZWdvcnlOYW1lIHx8IFwiT3ZlcnNpemUgVGVlXCI7XHJcbiAgY29uc3QgaGVyb0hyZWYgPSBnZXRTaG93SHJlZihmZWF0dXJlZFByb2R1Y3QpO1xyXG4gIGNvbnN0IG9yZGVyc0xpc3RIcmVmID0gXCIvYWRtaW4vcmVzb3VyY2VzL09yZGVycy9hY3Rpb25zL2xpc3RcIjtcclxuXHJcbiAgY29uc3QgZGlzcGxheWVkUHJvZHVjdHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiBmaWx0ZXJlZFByb2R1Y3RzO1xyXG4gIH0sIFtmaWx0ZXJlZFByb2R1Y3RzXSk7XHJcblxyXG4gIGNvbnN0IGNhdGVnb3JpZXMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICByZWNvcmRzLmZvckVhY2goKHByb2R1Y3QpID0+IHtcclxuICAgICAgY29uc3QgbmFtZSA9IFN0cmluZyhwcm9kdWN0LmNhdGVnb3J5TmFtZSB8fCBcIlNob3BcIik7XHJcbiAgICAgIGJ1Y2tldC5zZXQobmFtZSwgKGJ1Y2tldC5nZXQobmFtZSkgfHwgMCkgKyAxKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBBcnJheS5mcm9tKGJ1Y2tldC5lbnRyaWVzKCkpLm1hcCgoW25hbWUsIGNvdW50XSkgPT4gKHtcclxuICAgICAgbmFtZSxcclxuICAgICAgY291bnQsXHJcbiAgICB9KSk7XHJcbiAgfSwgW3JlY29yZHNdKTtcclxuXHJcbiAgY29uc3QgaXNBZG1pblVzZXIgPSBjdXJyZW50VXNlclJvbGUgPT09IFwiYWRtaW5cIjtcclxuICBjb25zdCBhZG1pblByb2R1Y3RSb3dzID0gQXJyYXkuaXNBcnJheShyZWNvcmRzKSA/IHJlY29yZHMuc2xpY2UoMCwgMTIpIDogW107XHJcbiAgY29uc3QgY2F0ZWdvcnlQcmV2aWV3ID0gY2F0ZWdvcmllcy5zbGljZSgwLCA2KTtcclxuXHJcbiAgaWYgKGlzQWRtaW5Vc2VyKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkXCI+XHJcbiAgICAgICAgPHN0eWxlPntgXHJcbiAgICAgICAgICBodG1sLmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQtcGFnZSxcclxuICAgICAgICAgIGh0bWwuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlIGJvZHksXHJcbiAgICAgICAgICBodG1sLmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQtcGFnZSAjYXBwLFxyXG4gICAgICAgICAgaHRtbC5jaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2UgLmFkbWluanNfTGF5b3V0LFxyXG4gICAgICAgICAgaHRtbC5jaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2UgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdLFxyXG4gICAgICAgICAgaHRtbC5jaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2UgW2RhdGEtY3NzPVwibGF5b3V0XCJdLFxyXG4gICAgICAgICAgaHRtbC5jaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2UgbWFpbixcclxuICAgICAgICAgIGJvZHkuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlLFxyXG4gICAgICAgICAgYm9keS5jaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2UgI2FwcCxcclxuICAgICAgICAgIGJvZHkuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlIC5hZG1pbmpzX0xheW91dCxcclxuICAgICAgICAgIGJvZHkuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlIFtkYXRhLXRlc3RpZD1cImxheW91dFwiXSxcclxuICAgICAgICAgIGJvZHkuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlIFtkYXRhLWNzcz1cImxheW91dFwiXSxcclxuICAgICAgICAgIGJvZHkuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlIG1haW4ge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmYgIWltcG9ydGFudDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGh0bWwuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlIGJvZHk6OmJlZm9yZSxcclxuICAgICAgICAgIGh0bWwuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlOjpiZWZvcmUsXHJcbiAgICAgICAgICBib2R5LmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQtcGFnZTo6YmVmb3JlIHtcclxuICAgICAgICAgICAgY29udGVudDogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWRhc2hib2FyZCB7XHJcbiAgICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAyOHB4O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZjhmYWZjO1xyXG4gICAgICAgICAgICBjb2xvcjogIzBmMTcyYTtcclxuICAgICAgICAgICAgZm9udC1mYW1pbHk6IFwiUG9wcGluc1wiLCBcIlNlZ29lIFVJXCIsIHNhbnMtc2VyaWY7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLWdyaWQge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICBnYXA6IDE4cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLWhlYWRlciB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgICAgICAgICAgZ2FwOiAxNnB4O1xyXG4gICAgICAgICAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tYWN0aW9ucyB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIGZsZXgtd3JhcDogd3JhcDtcclxuICAgICAgICAgICAgZ2FwOiAxMHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWFjdGlvbiB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICAgICAgZ2FwOiA4cHg7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDEycHggMTZweDtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTRweDtcclxuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgxNSwgMjMsIDQyLCAwLjEpO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xyXG4gICAgICAgICAgICBjb2xvcjogIzBmMTcyYTtcclxuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMjRweCByZ2JhKDE1LCAyMywgNDIsIDAuMDYpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWFjdGlvbi0tcHJpbWFyeSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICM2MzY2ZjEgMCUsICM4YjVjZjYgMTAwJSk7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjZmZmZmZmO1xyXG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLXRpdGxlIHtcclxuICAgICAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IGNsYW1wKDI4cHgsIDR2dywgNDZweCk7XHJcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWRhc2hib2FyZC1zdWJ0aXRsZSB7XHJcbiAgICAgICAgICAgIG1hcmdpbjogOHB4IDAgMDtcclxuICAgICAgICAgICAgY29sb3I6ICM2NDc0OGI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLWNhcmRzIHtcclxuICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoNCwgbWlubWF4KDAsIDFmcikpO1xyXG4gICAgICAgICAgICBnYXA6IDE2cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tY2FyZCxcclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLXBhbmVsIHtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMjBweDtcclxuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogI2ZmZmZmZjtcclxuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAxNnB4IDMwcHggcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1jYXJkIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMThweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1jYXJkLWxhYmVsIHtcclxuICAgICAgICAgICAgY29sb3I6ICM2NDc0OGI7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMTRlbTtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1jYXJkLXZhbHVlIHtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogMTBweDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAzMnB4O1xyXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1kYXNoYm9hcmQtbGlua3Mge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgzLCBtaW5tYXgoMCwgMWZyKSk7XHJcbiAgICAgICAgICAgIGdhcDogMTZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1saW5rIHtcclxuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDE4cHg7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4wOCk7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmZmZmY7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjMGYxNzJhO1xyXG4gICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMTBweCAyNHB4IHJnYmEoMTUsIDIzLCA0MiwgMC4wNik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tbGluayBzdHJvbmcge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiA2cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tc2VjdGlvbi10aXRsZSB7XHJcbiAgICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWNhdGVnb3J5LWxpc3Qge1xyXG4gICAgICAgICAgICBtYXJnaW4tdG9wOiAxNHB4O1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgICBnYXA6IDEycHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tY2F0ZWdvcnktaXRlbSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgICAgICAgICAgZ2FwOiAxMnB4O1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxNHB4IDE2cHg7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4wOCk7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmOGZhZmM7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tY2F0ZWdvcnktbmFtZSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiA0cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tY2F0ZWdvcnktbWV0YSB7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjNjQ3NDhiO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tdGFibGUtd3JhcCB7XHJcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDE0cHg7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgICBvdmVyZmxvdy14OiBhdXRvO1xyXG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDE1LCAyMywgNDIsIDAuMDgpO1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLXRhYmxlIHtcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XHJcbiAgICAgICAgICAgIG1pbi13aWR0aDogNzYwcHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tdGFibGUgdGgsXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi10YWJsZSB0ZCB7XHJcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDEycHggMTRweDtcclxuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4wNyk7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi10YWJsZSB0aCB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmOGZhZmM7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjNDc1NTY5O1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLXRhYmxlIHRkIHtcclxuICAgICAgICAgICAgY29sb3I6ICMwZjE3MmE7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tdGFibGUgdHI6bGFzdC1jaGlsZCB0ZCB7XHJcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tdGh1bWItY2VsbCB7XHJcbiAgICAgICAgICAgIHdpZHRoOiA3NnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLXRodW1iIHtcclxuICAgICAgICAgICAgd2lkdGg6IDQ0cHg7XHJcbiAgICAgICAgICAgIGhlaWdodDogNDRweDtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgICAgICAgICAgb2JqZWN0LWZpdDogY292ZXI7XHJcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4wOCk7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmOGZhZmM7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLXN0YXR1cy1waWxsIHtcclxuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgICAgICAgICAgcGFkZGluZzogNHB4IDEwcHg7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1zdGF0dXMtcGlsbC0tYWN0aXZlIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogI2RjZmNlNztcclxuICAgICAgICAgICAgY29sb3I6ICMxNjY1MzQ7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtYWRtaW4tc3RhdHVzLXBpbGwtLWluYWN0aXZlIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogI2ZlZTJlMjtcclxuICAgICAgICAgICAgY29sb3I6ICM5OTFiMWI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDExMDBweCkge1xyXG4gICAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1kYXNoYm9hcmQtY2FyZHMsXHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWRhc2hib2FyZC1saW5rcyB7XHJcbiAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDAsIDFmcikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDcyMHB4KSB7XHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LWFkbWluLWRhc2hib2FyZCB7XHJcbiAgICAgICAgICAgICAgcGFkZGluZzogMThweDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLmNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLWNhcmRzLFxyXG4gICAgICAgICAgICAuY2hhbmdlOC1hZG1pbi1kYXNoYm9hcmQtbGlua3Mge1xyXG4gICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgYH08L3N0eWxlPlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLWdyaWRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1kYXNoYm9hcmQtaGVhZGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tZGFzaGJvYXJkLXRpdGxlXCI+QWRtaW4gRGFzaGJvYXJkPC9oMT5cclxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWRhc2hib2FyZC1zdWJ0aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgTWFuYWdlIHlvdXIgc2hvcCBkYXRhLCBwcm9kdWN0cywgb3JkZXJzLCBhbmQgdXNlcnMgZnJvbSBoZXJlLlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tYWN0aW9uc1wiPlxyXG4gICAgICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWFjdGlvbiBjaGFuZ2U4LWFkbWluLWFjdGlvbi0tcHJpbWFyeVwiXHJcbiAgICAgICAgICAgICAgICBocmVmPVwiL2FkbWluL3Jlc291cmNlcy9Qcm9kdWN0cy9hY3Rpb25zL25ld1wiXHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgKyBBZGQgUHJvZHVjdFxyXG4gICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1hY3Rpb25cIlxyXG4gICAgICAgICAgICAgICAgaHJlZj1cIi9hZG1pbi9yZXNvdXJjZXMvQ2F0ZWdvcmllcy9hY3Rpb25zL25ld1wiXHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgKyBBZGQgQ2F0ZWdvcnlcclxuICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWRhc2hib2FyZC1jYXJkc1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tY2FyZFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXJkLWxhYmVsXCI+VXNlcnM8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tY2FyZC12YWx1ZVwiPntzdW1tYXJ5LnVzZXJzfTwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhcmRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tY2FyZC1sYWJlbFwiPlByb2R1Y3RzPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhcmQtdmFsdWVcIj57c3VtbWFyeS5wcm9kdWN0c308L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXJkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhcmQtbGFiZWxcIj5PcmRlcnM8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tY2FyZC12YWx1ZVwiPntzdW1tYXJ5Lm9yZGVyc308L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXJkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhcmQtbGFiZWxcIj5DYXRlZ29yaWVzPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhcmQtdmFsdWVcIj5cclxuICAgICAgICAgICAgICAgIHtzdW1tYXJ5LmNhdGVnb3JpZXN9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWRhc2hib2FyZC1saW5rc1wiPlxyXG4gICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tbGlua1wiXHJcbiAgICAgICAgICAgICAgaHJlZj1cIi9hZG1pbi9yZXNvdXJjZXMvUHJvZHVjdHMvYWN0aW9ucy9saXN0XCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+UHJvZHVjdHM8L3N0cm9uZz5cclxuICAgICAgICAgICAgICBPcGVuIHByb2R1Y3QgbGlzdCBhbmQgbWFuYWdlIGludmVudG9yeS5cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tbGlua1wiXHJcbiAgICAgICAgICAgICAgaHJlZj1cIi9hZG1pbi9yZXNvdXJjZXMvT3JkZXJzL2FjdGlvbnMvbGlzdFwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8c3Ryb25nPk9yZGVyczwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIFJldmlldyBhbmQgcHJvY2VzcyBjdXN0b21lciBvcmRlcnMuXHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWxpbmtcIlxyXG4gICAgICAgICAgICAgIGhyZWY9XCIvYWRtaW4vcmVzb3VyY2VzL1VzZXJzL2FjdGlvbnMvbGlzdFwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8c3Ryb25nPlVzZXJzPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgVmlldyByZWdpc3RlcmVkIHVzZXJzIGFuZCByb2xlcy5cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLXBhbmVsXCIgc3R5bGU9e3sgcGFkZGluZzogXCIyMHB4XCIgfX0+XHJcbiAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLXNlY3Rpb24tdGl0bGVcIj5Qcm9kdWN0cyBUYWJsZTwvaDI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi10YWJsZS13cmFwXCI+XHJcbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tdGFibGVcIj5cclxuICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aD5JbWFnZTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRoPk5hbWU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aD5DYXRlZ29yeTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRoPlN0b2NrPC90aD5cclxuICAgICAgICAgICAgICAgICAgICA8dGg+UHJpY2U8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aD5TdGF0dXM8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aD5BY3Rpb248L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAge2FkbWluUHJvZHVjdFJvd3MubGVuZ3RoID8gKFxyXG4gICAgICAgICAgICAgICAgICAgIGFkbWluUHJvZHVjdFJvd3MubWFwKChwcm9kdWN0KSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtwcm9kdWN0LmlkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tdGh1bWItY2VsbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tdGh1bWJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXtwcm9kdWN0SW1hZ2UocHJvZHVjdCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHQ9e3Byb2R1Y3QubmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Byb2R1Y3QubmFtZX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3Byb2R1Y3QuY2F0ZWdvcnlOYW1lIHx8IFwiLVwifTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57TnVtYmVyKHByb2R1Y3Quc3RvY2sgfHwgMCl9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPntmb3JtYXRDdXJyZW5jeShwcm9kdWN0LnByaWNlKX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGNoYW5nZTgtYWRtaW4tc3RhdHVzLXBpbGwgJHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdC5pc0FjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJjaGFuZ2U4LWFkbWluLXN0YXR1cy1waWxsLS1hY3RpdmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJjaGFuZ2U4LWFkbWluLXN0YXR1cy1waWxsLS1pbmFjdGl2ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9YH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdC5pc0FjdGl2ZSA/IFwiQWN0aXZlXCIgOiBcIkluYWN0aXZlXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17Z2V0U2hvd0hyZWYocHJvZHVjdCl9PlZpZXc8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICkpXHJcbiAgICAgICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezd9IHN0eWxlPXt7IGNvbG9yOiBcIiM2NDc0OGJcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgTm8gcHJvZHVjdHMgYXZhaWxhYmxlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1wYW5lbFwiIHN0eWxlPXt7IHBhZGRpbmc6IFwiMjBweFwiIH19PlxyXG4gICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1zZWN0aW9uLXRpdGxlXCI+Q2F0ZWdvcmllczwvaDI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXRlZ29yeS1saXN0XCI+XHJcbiAgICAgICAgICAgICAge2NhdGVnb3J5UHJldmlldy5tYXAoKGNhdGVnb3J5KSA9PiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIGtleT17Y2F0ZWdvcnkubmFtZX1cclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1hZG1pbi1jYXRlZ29yeS1pdGVtXCJcclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBjbGFzc05hbWU9XCJjaGFuZ2U4LWFkbWluLWNhdGVnb3J5LW5hbWVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIHtjYXRlZ29yeS5uYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNoYW5nZTgtYWRtaW4tY2F0ZWdvcnktbWV0YVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgUHJvZHVjdHMgaW4gY2F0ZWdvcnlcclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogNzAwIH19PntjYXRlZ29yeS5jb3VudH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZFwiPlxyXG4gICAgICA8c3R5bGU+e2BcclxuICAgICAgICAuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZCB7XHJcbiAgICAgICAgICAtLWJnOiAjZjdmN2Y3O1xyXG4gICAgICAgICAgLS10ZXh0OiAjMTExMTExO1xyXG4gICAgICAgICAgLS1tdXRlZDogIzY2NjY2NjtcclxuICAgICAgICAgIC0tbGluZTogcmdiYSgxNywgMTcsIDE3LCAwLjA4KTtcclxuICAgICAgICAgIC0tYWNjZW50OiAjZmYyZDhiO1xyXG4gICAgICAgICAgLS1zdWNjZXNzOiAjNDVkMjU1O1xyXG4gICAgICAgICAgbWluLWhlaWdodDogMTAwdmg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZyk7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dCk7XHJcbiAgICAgICAgICBmb250LWZhbWlseTogXCJQb3BwaW5zXCIsIFwiU2Vnb2UgVUlcIiwgc2Fucy1zZXJpZjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNoZWxsIHtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC10b3Atc3RyaXAge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDojMEVBNUU5O1xyXG4gICAgICAgICAgY29sb3I6ICMwMDA7XHJcbiAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiA3cHggMTJweDtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjAxZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1uYXYge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogIzA1MDUwNTtcclxuICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciBhdXRvIDFmcjtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBnYXA6IDE2cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxOHB4IDI4cHg7XHJcbiAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgICB6LWluZGV4OiAzMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LW5hdi1saW5rcyB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgZmxleC13cmFwOiB3cmFwO1xyXG4gICAgICAgICAgZ2FwOiAyOHB4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1uYXYtdXNlci1kaXNwbGF5IHtcclxuICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGdhcDogMTBweDtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDM0cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiA4cHggMTRweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA4KTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xMik7XHJcbiAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMDJlbTtcclxuICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1uYXYtdXNlci1kaXNwbGF5OjpiZWZvcmUge1xyXG4gICAgICAgICAgY29udGVudDogXCJcIjtcclxuICAgICAgICAgIHdpZHRoOiA4cHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDhweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tYWNjZW50KTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDRweCByZ2JhKDI1NSwgNDUsIDEzOSwgMC4xNik7XHJcbiAgICAgICAgICBmbGV4OiAwIDAgYXV0bztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LW5hdi1saW5rcyBhIHtcclxuICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LW5hdi1saW5rcyBhLmlzLWFjdGl2ZSB7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tYWNjZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWJyYW5kIHtcclxuICAgICAgICAgIHdpZHRoOiA4NnB4O1xyXG4gICAgICAgICAgaGVpZ2h0OiA4NnB4O1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDM1JSAyOCUsICNmN2ZmNTkgMCUsICMxZWM2M2EgMzQlLCAjMTExIDEwMCUpO1xyXG4gICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDgwMDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTdweDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAwLjk1O1xyXG4gICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDI1cHggcmdiYSgwLCAwLCAwLCAwLjM1KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWJyYW5kIGltZyB7XHJcbiAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICAgIG9iamVjdC1maXQ6IGNvdmVyO1xyXG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1icmFuZCBzbWFsbCB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTBweDtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjEyZW07XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiA0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1uYXYtYWN0aW9ucyB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XHJcbiAgICAgICAgICBnYXA6IDE0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zZWFyY2gge1xyXG4gICAgICAgICAgd2lkdGg6IG1pbigxMDAlLCAyODBweCk7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGdhcDogMTJweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDEycHggMThweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogd2hpdGU7XHJcbiAgICAgICAgICBjb2xvcjogIzExMTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4wOCk7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMjBweCByZ2JhKDAsIDAsIDAsIDAuMTIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc2VhcmNoIHN2ZyB7XHJcbiAgICAgICAgICBmbGV4OiAwIDAgYXV0bztcclxuICAgICAgICAgIHN0cm9rZTogIzY2NjtcclxuICAgICAgICAgIG9wYWNpdHk6IDAuNztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNlYXJjaCBpbnB1dCB7XHJcbiAgICAgICAgICBib3JkZXI6IDA7XHJcbiAgICAgICAgICBvdXRsaW5lOiAwO1xyXG4gICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAtd2Via2l0LWJveC1zaGFkb3c6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGNvbG9yOiAjMTExO1xyXG4gICAgICAgICAgZm9udDogaW5oZXJpdDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIG1pbi13aWR0aDogMDtcclxuICAgICAgICAgIGFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgICAgICAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgICAgICAgICBjYXJldC1jb2xvcjogIzExMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNlYXJjaCBpbnB1dDo6cGxhY2Vob2xkZXIge1xyXG4gICAgICAgICAgY29sb3I6ICM5OTk7XHJcbiAgICAgICAgICBvcGFjaXR5OiAwLjg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zZWFyY2ggaW5wdXQ6LXdlYmtpdC1hdXRvZmlsbCxcclxuICAgICAgICAuY2hhbmdlOC1zZWFyY2ggaW5wdXQ6LXdlYmtpdC1hdXRvZmlsbDpob3ZlcixcclxuICAgICAgICAuY2hhbmdlOC1zZWFyY2ggaW5wdXQ6LXdlYmtpdC1hdXRvZmlsbDpmb2N1cyxcclxuICAgICAgICAuY2hhbmdlOC1zZWFyY2ggaW5wdXQ6LXdlYmtpdC1hdXRvZmlsbDphY3RpdmUge1xyXG4gICAgICAgICAgLXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6ICMxMTEgIWltcG9ydGFudDtcclxuICAgICAgICAgIC13ZWJraXQtYm94LXNoYWRvdzogMCAwIDAgMTAwMHB4ICNmZmYgaW5zZXQgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDEwMDBweCAjZmZmIGluc2V0ICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBjYXJldC1jb2xvcjogIzExMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWljb24ge1xyXG4gICAgICAgICAgd2lkdGg6IDM0cHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDM0cHg7XHJcbiAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYm9yZGVyOiAycHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkyKTtcclxuICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNhcnQtYnV0dG9uIHtcclxuICAgICAgICAgIHBhZGRpbmc6IDA7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXVzZXItZmFsbGJhY2sge1xyXG4gICAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgZ2FwOiAxMHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtdXNlci1mYWxsYmFjayAuY2hhbmdlOC1pY29uIHtcclxuICAgICAgICAgIGZsZXg6IDAgMCBhdXRvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtdXNlci1tZW51IHtcclxuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXVzZXItdG9nZ2xlIHtcclxuICAgICAgICAgIGFwcGVhcmFuY2U6IG5vbmU7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMTIpO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA4KTtcclxuICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgcGFkZGluZzogOHB4IDE0cHg7XHJcbiAgICAgICAgICBtaW4taGVpZ2h0OiAzNHB4O1xyXG4gICAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XHJcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgZ2FwOiAxMHB4O1xyXG4gICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgICAgZm9udDogaW5oZXJpdDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTNweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4wMmVtO1xyXG4gICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXVzZXItdG9nZ2xlOjpiZWZvcmUge1xyXG4gICAgICAgICAgY29udGVudDogXCJcIjtcclxuICAgICAgICAgIHdpZHRoOiA4cHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDhweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tYWNjZW50KTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDRweCByZ2JhKDI1NSwgNDUsIDEzOSwgMC4xNik7XHJcbiAgICAgICAgICBmbGV4OiAwIDAgYXV0bztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXVzZXItZHJvcGRvd24ge1xyXG4gICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgdG9wOiBjYWxjKDEwMCUgKyAxMHB4KTtcclxuICAgICAgICAgIHJpZ2h0OiAwO1xyXG4gICAgICAgICAgbWluLXdpZHRoOiAxNzBweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDE0cHggMTJweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjMGQxMzIwO1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEyKTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMThweCAzMHB4IHJnYmEoMCwgMCwgMCwgMC4zMik7XHJcbiAgICAgICAgICB6LWluZGV4OiAyMDtcclxuICAgICAgICAgIG92ZXJmbG93OiB2aXNpYmxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtbG9nb3V0LWJ1dHRvbiB7XHJcbiAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgIGJvcmRlcjogMDtcclxuICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICNmZjJkOGI7XHJcbiAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMTNweCAxNnB4O1xyXG4gICAgICAgICAgZm9udDogaW5oZXJpdDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTNweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4wMmVtO1xyXG4gICAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZCAwLjJzIGVhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1sb2dvdXQtYnV0dG9uOmhvdmVyIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICNmZjRhOWI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1sb2dvdXQtYnV0dG9uOmFjdGl2ZSB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmYxYTdjO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtaWNvbiBzdmcge1xyXG4gICAgICAgICAgd2lkdGg6IDE4cHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDE4cHg7XHJcbiAgICAgICAgICBzdHJva2U6IGN1cnJlbnRDb2xvcjtcclxuICAgICAgICAgIGZpbGw6IG5vbmU7XHJcbiAgICAgICAgICBzdHJva2Utd2lkdGg6IDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1iYWRnZSB7XHJcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICB0b3A6IC03cHg7XHJcbiAgICAgICAgICByaWdodDogLTdweDtcclxuICAgICAgICAgIG1pbi13aWR0aDogMTdweDtcclxuICAgICAgICAgIGhlaWdodDogMTdweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDAgNHB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmY2YjZiO1xyXG4gICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMHB4O1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPVwibGlnaHRcIl0gLmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQgLmNoYW5nZTgtbmF2IHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICNmM2Y0ZjY7XHJcbiAgICAgICAgICBjb2xvcjogIzExMTgyNztcclxuICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMDgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPVwibGlnaHRcIl0gLmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQgLmNoYW5nZTgtbmF2LWxpbmtzIGEge1xyXG4gICAgICAgICAgY29sb3I6ICMxMTE4Mjc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9XCJsaWdodFwiXSAuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZCAuY2hhbmdlOC1uYXYtbGlua3MgYS5pcy1hY3RpdmUge1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLWFjY2VudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9XCJsaWdodFwiXSAuY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZCAuY2hhbmdlOC1pY29uIHtcclxuICAgICAgICAgIGNvbG9yOiAjMTExODI3O1xyXG4gICAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2JhKDE3LCAyNCwgMzksIDAuMik7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPVwibGlnaHRcIl0gLmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQgLmNoYW5nZTgtdXNlci10b2dnbGUge1xyXG4gICAgICAgICAgY29sb3I6ICMxMTE4Mjc7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xyXG4gICAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2JhKDE3LCAyNCwgMzksIDAuMTUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPVwibGlnaHRcIl0gLmNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQgLmNoYW5nZTgtdXNlci1kcm9wZG93biB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xyXG4gICAgICAgICAgYm9yZGVyLWNvbG9yOiByZ2JhKDE3LCAyNCwgMzksIDAuMTIpO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCAxMnB4IDI2cHggcmdiYSgxNSwgMjMsIDQyLCAwLjEyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWNvbnRlbnQge1xyXG4gICAgICAgICAgZmxleDogMTtcclxuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgIHotaW5kZXg6IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1oZXJvIHtcclxuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgIG1pbi1oZWlnaHQ6IDQ3MHB4O1xyXG4gICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmZmZmY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1oZXJvOjpiZWZvcmUge1xyXG4gICAgICAgICAgY29udGVudDogXCJcIjtcclxuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgIGluc2V0OiAwO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLCByZ2JhKDAsIDAsIDAsIDAuMDgpIDAlLCByZ2JhKDAsIDAsIDAsIDAuMDMpIDQ2JSwgcmdiYSgwLCAwLCAwLCAwKSAxMDAlKTtcclxuICAgICAgICAgIHotaW5kZXg6IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1oZXJvLWltYWdlIHtcclxuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgIGluc2V0OiAwO1xyXG4gICAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiJHtoZXJvSW1hZ2V9XCIpO1xyXG4gICAgICAgICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcclxuICAgICAgICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcclxuICAgICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtaGVyby1jb3B5IHtcclxuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICAgIHotaW5kZXg6IDE7XHJcbiAgICAgICAgICB3aWR0aDogbWluKDEwMCUsIDU2MHB4KTtcclxuICAgICAgICAgIG1hcmdpbi1sZWZ0OiBhdXRvO1xyXG4gICAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgICBwYWRkaW5nOiAyNHB4IDM4cHggNTZweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWhlcm8tZXllYnJvdyB7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xOGVtO1xyXG4gICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBvcGFjaXR5OiAwLjk1O1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWhlcm8tdGl0bGUge1xyXG4gICAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgICAgZm9udC1zaXplOiBjbGFtcCg0MHB4LCA0Ljh2dywgNjZweCk7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMC45NTtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IC0wLjAzZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1oZXJvLXN1YnRpdGxlIHtcclxuICAgICAgICAgIG1hcmdpbjogMTJweCAwIDA7XHJcbiAgICAgICAgICBmb250LXNpemU6IGNsYW1wKDE4cHgsIDIuMnZ3LCAyOHB4KTtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjM0ZW07XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgb3BhY2l0eTogMC45NTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LWhlcm8tYnV0dG9uIHtcclxuICAgICAgICAgIG1hcmdpbi10b3A6IDMwcHg7XHJcbiAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcclxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICAgIG1pbi13aWR0aDogMTcwcHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxNnB4IDIycHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgICAgICAgIGJvcmRlcjogMDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gICAgICAgICAgY29sb3I6ICMxMTE7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE4cHg7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xNGVtO1xyXG4gICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDI1cHggcmdiYSgwLCAwLCAwLCAwLjIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc2xpZGVyLWFycm93IHtcclxuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgIHRvcDogNTAlO1xyXG4gICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xyXG4gICAgICAgICAgd2lkdGg6IDU0cHg7XHJcbiAgICAgICAgICBoZWlnaHQ6IDU0cHg7XHJcbiAgICAgICAgICBib3JkZXI6IDA7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICAgICAgICAgIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuODgpO1xyXG4gICAgICAgICAgZm9udC1zaXplOiA2NHB4O1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDE7XHJcbiAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICB6LWluZGV4OiAyO1xyXG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICAgIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zbGlkZXItYXJyb3c6aG92ZXIge1xyXG4gICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc2xpZGVyLWFycm93LS1sZWZ0IHtcclxuICAgICAgICAgIGxlZnQ6IDhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNsaWRlci1hcnJvdy0tcmlnaHQge1xyXG4gICAgICAgICAgcmlnaHQ6IDhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXNsaWRlci1kb3RzIHtcclxuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICAgIGxlZnQ6IDUwJTtcclxuICAgICAgICAgIGJvdHRvbTogMTJweDtcclxuICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcclxuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICBnYXA6IDEwcHg7XHJcbiAgICAgICAgICB6LWluZGV4OiAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtc2xpZGVyLWRvdCB7XHJcbiAgICAgICAgICB3aWR0aDogMTZweDtcclxuICAgICAgICAgIGhlaWdodDogMTZweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgICAgICAgIGJvcmRlcjogMDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45Mik7XHJcbiAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1zbGlkZXItZG90LmlzLWFjdGl2ZSB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjMzlkMzUzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZHVjdHMge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogd2hpdGU7XHJcbiAgICAgICAgICBwYWRkaW5nOiAxMnB4IDAgMTBweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3RzLWhlYWQge1xyXG4gICAgICAgICAgcGFkZGluZzogMTBweCAxNHB4IDIwcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9kdWN0cy10aXRsZSB7XHJcbiAgICAgICAgICBtYXJnaW46IDA7XHJcbiAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICBmb250LXNpemU6IGNsYW1wKDI4cHgsIDN2dywgNDJweCk7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMTtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA4MDA7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1ncmlkIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCg1LCBtaW5tYXgoMCwgMWZyKSk7XHJcbiAgICAgICAgICBnYXA6IDE4cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAwIDE0cHggMThweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3QtY2FyZCB7XHJcbiAgICAgICAgICBjb2xvcjogIzExMTtcclxuICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3QtbWVkaWEge1xyXG4gICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgICAgYXNwZWN0LXJhdGlvOiAwLjk1O1xyXG4gICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICAgIGJhY2tncm91bmQ6ICNlNWU3ZWI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LW1lZGlhIGltZyB7XHJcbiAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICAgIG9iamVjdC1maXQ6IGNvdmVyO1xyXG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1mYXZvcml0ZSB7XHJcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICB0b3A6IDEwcHg7XHJcbiAgICAgICAgICBsZWZ0OiAxMHB4O1xyXG4gICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAyMXB4O1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDE7XHJcbiAgICAgICAgICB0ZXh0LXNoYWRvdzogMCAxcHggNHB4IHJnYmEoMCwgMCwgMCwgMC4zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3QtbmFtZSB7XHJcbiAgICAgICAgICBtYXJnaW46IDEwcHggMCAwO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xyXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDEuMTI7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgbWluLWhlaWdodDogNDBweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3QtcHJpY2Uge1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogOHB4O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3QtcHJpY2UgcyB7XHJcbiAgICAgICAgICBjb2xvcjogIzY2NjtcclxuICAgICAgICAgIG1hcmdpbi1yaWdodDogNnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtZW1wdHksXHJcbiAgICAgICAgLmNoYW5nZTgtbG9hZGluZyB7XHJcbiAgICAgICAgICBtYXJnaW46IDAgMTRweCAxOHB4O1xyXG4gICAgICAgICAgcGFkZGluZzogMjJweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBkYXNoZWQgcmdiYSgxNywgMTcsIDE3LCAwLjE4KTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC43KTtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1tdXRlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogMTIwMHB4KSB7XHJcbiAgICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LWdyaWQge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgzLCBtaW5tYXgoMCwgMWZyKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogODIwcHgpIHtcclxuICAgICAgICAgIC5jaGFuZ2U4LW5hdiB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gICAgICAgICAgICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbmF2LWxpbmtzIHtcclxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGdhcDogMThweDtcclxuICAgICAgICAgICAgZmxleC13cmFwOiB3cmFwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LW5hdi1hY3Rpb25zIHtcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgICAgICBmbGV4LXdyYXA6IHdyYXA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbmF2LXVzZXItZGlzcGxheSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1oZXJvLWNvcHkge1xyXG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgICAgcGFkZGluZzogMjJweCAyMHB4IDU2cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1ncmlkIHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDAsIDFmcikpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXNsaWRlci1hcnJvdyB7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogNDRweDtcclxuICAgICAgICAgICAgd2lkdGg6IDQwcHg7XHJcbiAgICAgICAgICAgIGhlaWdodDogNDBweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1zbGlkZXItYXJyb3ctLWxlZnQge1xyXG4gICAgICAgICAgICBsZWZ0OiA0cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtc2xpZGVyLWFycm93LS1yaWdodCB7XHJcbiAgICAgICAgICAgIHJpZ2h0OiA0cHg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNTYwcHgpIHtcclxuICAgICAgICAgIC5jaGFuZ2U4LW5hdiB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDE0cHggMTZweCAxNnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWJyYW5kIHtcclxuICAgICAgICAgICAgd2lkdGg6IDcycHg7XHJcbiAgICAgICAgICAgIGhlaWdodDogNzJweDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXNlYXJjaCB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWhlcm8ge1xyXG4gICAgICAgICAgICBtaW4taGVpZ2h0OiA0MjBweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1oZXJvLXRpdGxlIHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgzMnB4LCAxMnZ3LCA0OHB4KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1oZXJvLXN1YnRpdGxlIHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4yNGVtO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWhlcm8tYnV0dG9uIHtcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1ncmlkIHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBgfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtc2hlbGxcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtdG9wLXN0cmlwXCI+XHJcbiAgICAgICAgICBGUkVFIFNISVBQSU5HIG5vdyBhdmFpbGFibGUgaW4gU3JpIExhbmthXHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJjaGFuZ2U4LW5hdlwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW5hdi1saW5rc1wiIGFyaWEtbGFiZWw9XCJQcmltYXJ5XCI+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCIjaGVyb1wiIGNsYXNzTmFtZT1cImlzLWFjdGl2ZVwiPlxyXG4gICAgICAgICAgICAgIEhvbWVcclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI3Byb2R1Y3RzXCI+UHJvZHVjdDwvYT5cclxuICAgICAgICAgICAgPGEgaHJlZj1cIi9hZG1pbi9wYWdlcy9BYm91dFwiPkFib3V0PC9hPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI2NvbnRhY3RcIj5Db250YWN0IFVzPC9hPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWJyYW5kXCIgYXJpYS1sYWJlbD1cIlN0b3JlIGJyYW5kXCI+XHJcbiAgICAgICAgICAgIDxpbWcgc3JjPVwiL3B1YmxpYy9pY29uLnBuZ1wiIGFsdD1cIlN0b3JlIGxvZ29cIiAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW5hdi1hY3Rpb25zXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjaGFuZ2U4LXNlYXJjaFwiIGh0bWxGb3I9XCJjaGFuZ2U4LXNlYXJjaC1pbnB1dFwiPlxyXG4gICAgICAgICAgICAgIDxzdmdcclxuICAgICAgICAgICAgICAgIHdpZHRoPVwiMThcIlxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0PVwiMThcIlxyXG4gICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXHJcbiAgICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiXHJcbiAgICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxyXG4gICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIyXCJcclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PVwiMTFcIiBjeT1cIjExXCIgcj1cIjdcIiAvPlxyXG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yMCAyMGwtMy41LTMuNVwiIC8+XHJcbiAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICBpZD1cImNoYW5nZTgtc2VhcmNoLWlucHV0XCJcclxuICAgICAgICAgICAgICAgIHR5cGU9XCJzZWFyY2hcIlxyXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2ggUHJvZHVjdHNcIlxyXG4gICAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaFRlcm19XHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiBzZXRTZWFyY2hUZXJtKGV2ZW50LnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPC9sYWJlbD5cclxuXHJcbiAgICAgICAgICAgIHtjdXJyZW50VXNlck5hbWUgPyAoXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXVzZXItbWVudVwiPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC11c2VyLXRvZ2dsZVwiXHJcbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJMb2dnZWQgaW4gdXNlciBtZW51XCJcclxuICAgICAgICAgICAgICAgICAgYXJpYS1leHBhbmRlZD17aXNVc2VyTWVudU9wZW59XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldElzVXNlck1lbnVPcGVuKChwcmV2aW91cykgPT4gIXByZXZpb3VzKTtcclxuICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAge2N1cnJlbnRVc2VyTmFtZX1cclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICAgICAgICAgIHtpc1VzZXJNZW51T3BlbiA/IChcclxuICAgICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtdXNlci1kcm9wZG93blwiXHJcbiAgICAgICAgICAgICAgICAgICAgcm9sZT1cIm1lbnVcIlxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4gZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCl9XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtbG9nb3V0LWJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldElzVXNlck1lbnVPcGVuKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9hZG1pbi9sb2dvdXRcIjtcclxuICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgTG9nb3V0XHJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgKSA6IG51bGx9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXVzZXItZmFsbGJhY2tcIiBhcmlhLWxhYmVsPVwiQWNjb3VudFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWljb25cIj5cclxuICAgICAgICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCI4XCIgcj1cIjRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNCAyMGMxLjgtNC4yIDUtNiA4LTZzNi4yIDEuOCA4IDZcIiAvPlxyXG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWljb25cIiBhcmlhLWxhYmVsPVwiV2lzaGxpc3RcIj5cclxuICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cclxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTIgMjFzLTctNC42LTkuMi05LjJDLjggOC4yIDIuNCA1IDUuOCA1YzEuOCAwIDMuMiAxIDQuMiAyLjJDMTEgNiAxMi41IDUgMTQuMiA1YzMuNCAwIDUgMy4yIDMgNi44QzE5IDE2LjQgMTIgMjEgMTIgMjF6XCIgLz5cclxuICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1pY29uIGNoYW5nZTgtY2FydC1idXR0b25cIlxyXG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJDYXJ0XCJcclxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKG9yZGVyc0xpc3RIcmVmKTtcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XHJcbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTMgNGgybDIuMiAxMS4zQTIgMiAwIDAgMCA5LjIgMTdIMThhMiAyIDAgMCAwIDItMS42bDEuMS02LjRINi4xXCIgLz5cclxuICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCI5XCIgY3k9XCIyMFwiIHI9XCIxLjVcIiAvPlxyXG4gICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjE3XCIgY3k9XCIyMFwiIHI9XCIxLjVcIiAvPlxyXG4gICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNoYW5nZTgtYmFkZ2VcIj5cclxuICAgICAgICAgICAgICAgIHtNYXRoLm1heCgwLCBOdW1iZXIoc3VtbWFyeT8ub3JkZXJzIHx8IDApKX1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9oZWFkZXI+XHJcbiAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwiY2hhbmdlOC1jb250ZW50XCI+XHJcbiAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjaGFuZ2U4LWhlcm9cIiBpZD1cImhlcm9cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWhlcm8taW1hZ2VcIiAvPlxyXG5cclxuICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtc2xpZGVyLWFycm93IGNoYW5nZTgtc2xpZGVyLWFycm93LS1sZWZ0XCJcclxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiUHJldmlvdXMgc2xpZGVcIlxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghaGVyb1NsaWRlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHNldEN1cnJlbnRTbGlkZSgocHJldmlvdXMpID0+XHJcbiAgICAgICAgICAgICAgICAgIHByZXZpb3VzID09PSAwID8gaGVyb1NsaWRlcy5sZW5ndGggLSAxIDogcHJldmlvdXMgLSAxLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAg4oC5XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtc2xpZGVyLWFycm93IGNoYW5nZTgtc2xpZGVyLWFycm93LS1yaWdodFwiXHJcbiAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk5leHQgc2xpZGVcIlxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghaGVyb1NsaWRlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHNldEN1cnJlbnRTbGlkZShcclxuICAgICAgICAgICAgICAgICAgKHByZXZpb3VzKSA9PiAocHJldmlvdXMgKyAxKSAlIGhlcm9TbGlkZXMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAg4oC6XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWhlcm8tY29weVwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1oZXJvLWV5ZWJyb3dcIj5OZXcgc2Vhc29uIGRyb3A8L2Rpdj5cclxuICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwiY2hhbmdlOC1oZXJvLXRpdGxlXCI+e2hlcm9UaXRsZX08L2gxPlxyXG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImNoYW5nZTgtaGVyby1zdWJ0aXRsZVwiPntoZXJvU3VidGl0bGV9PC9wPlxyXG4gICAgICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgICAgICBocmVmPXtoZXJvSHJlZiB8fCBcIiNwcm9kdWN0c1wifVxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1oZXJvLWJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKCFoZXJvSHJlZikge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgU2hvcCBOb3dcclxuICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtc2xpZGVyLWRvdHNcIlxyXG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJDYXJvdXNlbCBuYXZpZ2F0aW9uXCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIHtoZXJvU2xpZGVzLm1hcCgoc2xpZGUsIGluZGV4KSA9PiAoXHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgIGtleT17c2xpZGUuaWQgfHwgYCR7c2xpZGUubmFtZX0tJHtpbmRleH1gfVxyXG4gICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgY2hhbmdlOC1zbGlkZXItZG90ICR7aW5kZXggPT09IGN1cnJlbnRTbGlkZSA/IFwiaXMtYWN0aXZlXCIgOiBcIlwifWB9XHJcbiAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2BHbyB0byBzbGlkZSAke2luZGV4ICsgMX1gfVxyXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDdXJyZW50U2xpZGUoaW5kZXgpfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L3NlY3Rpb24+XHJcblxyXG4gICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0c1wiIGlkPVwicHJvZHVjdHNcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3RzLWhlYWRcIj5cclxuICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0cy10aXRsZVwiPk91ciBQcm9kdWN0czwvaDI+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAge2xvYWRpbmcgPyAoXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWxvYWRpbmdcIj5Mb2FkaW5nIHByb2R1Y3RzLi4uPC9kaXY+XHJcbiAgICAgICAgICAgICkgOiBkaXNwbGF5ZWRQcm9kdWN0cy5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWVtcHR5XCI+Tm8gcHJvZHVjdHMgZm91bmQuPC9kaXY+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2R1Y3QtZ3JpZFwiPlxyXG4gICAgICAgICAgICAgICAge2Rpc3BsYXllZFByb2R1Y3RzLm1hcCgocHJvZHVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBjb25zdCBocmVmID0gZ2V0U2hvd0hyZWYocHJvZHVjdCk7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlID0gcHJvZHVjdEltYWdlKHByb2R1Y3QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICA8YXJ0aWNsZSBrZXk9e3Byb2R1Y3QuaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LWNhcmRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmPXtocmVmIHx8IFwiI1wifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWhyZWYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdC1tZWRpYVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtpbWFnZSA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtpbWFnZX0gYWx0PXtwcm9kdWN0Lm5hbWV9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImdyaWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZUl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiMxMTFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IFwiMjJweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImxpbmVhci1ncmFkaWVudCgxMzVkZWcsICNkYmVhZmUsICNmY2U3ZjMpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwcm9kdWN0TGFiZWwocHJvZHVjdCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNoYW5nZTgtZmF2b3JpdGVcIj7imaE8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdC1uYW1lXCI+e3Byb2R1Y3QubmFtZX08L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdC1wcmljZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzPntmb3JtYXRDdXJyZW5jeShwcm9kdWN0LnByaWNlICogMS4xNCl9PC9zPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtmb3JtYXRDdXJyZW5jeShwcm9kdWN0LnByaWNlKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgPC9tYWluPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmQ7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBSZWdpc3RlciA9ICgpID0+IHtcclxuICBjb25zdCBbZm9ybVN0YXRlLCBzZXRGb3JtU3RhdGVdID0gdXNlU3RhdGUoe1xyXG4gICAgbmFtZTogXCJcIixcclxuICAgIGVtYWlsOiBcIlwiLFxyXG4gICAgcGFzc3dvcmQ6IFwiXCIsXHJcbiAgfSk7XHJcbiAgY29uc3QgW21lc3NhZ2UsIHNldE1lc3NhZ2VdID0gdXNlU3RhdGUoeyB0eXBlOiBcIlwiLCB0ZXh0OiBcIlwiIH0pO1xyXG4gIGNvbnN0IFtpc1N1Ym1pdHRpbmcsIHNldElzU3VibWl0dGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm1hcmdpbiA9IFwiMFwiO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlQ2hhbmdlID0gKGV2ZW50KSA9PiB7XHJcbiAgICBzZXRGb3JtU3RhdGUoKGN1cnJlbnQpID0+ICh7XHJcbiAgICAgIC4uLmN1cnJlbnQsXHJcbiAgICAgIFtldmVudC50YXJnZXQubmFtZV06IGV2ZW50LnRhcmdldC52YWx1ZSxcclxuICAgIH0pKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBoYW5kbGVTdWJtaXQgPSBhc3luYyAoZXZlbnQpID0+IHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBzZXRNZXNzYWdlKHsgdHlwZTogXCJcIiwgdGV4dDogXCJcIiB9KTtcclxuICAgIHNldElzU3VibWl0dGluZyh0cnVlKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL2FwaS9yZWdpc3RlclwiLCB7XHJcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGZvcm1TdGF0ZSksXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YS5tZXNzYWdlIHx8IFwiUmVnaXN0cmF0aW9uIGZhaWxlZFwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0TWVzc2FnZSh7XHJcbiAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgdGV4dDogXCJBY2NvdW50IGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5ISBSZWRpcmVjdGluZy4uLlwiLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvYWRtaW4vbG9naW5cIjtcclxuICAgICAgfSwgMjAwMCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBzZXRNZXNzYWdlKHsgdHlwZTogXCJlcnJvclwiLCB0ZXh0OiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgICBzZXRJc1N1Ym1pdHRpbmcoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLXBhZ2VcIj5cclxuICAgICAgPHN0eWxlPntgXHJcbiAgICAgICAgLnJlZ2lzdGVyLXBhZ2Uge1xyXG4gICAgICAgICAgbWluLWhlaWdodDogMTAwdmg7XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgICAgcGFkZGluZzogMjRweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6XHJcbiAgICAgICAgICAgIGxpbmVhci1ncmFkaWVudChyZ2JhKDE1LCAyMywgNDIsIDAuMzUpLCByZ2JhKDE1LCAyMywgNDIsIDAuMzUpKSxcclxuICAgICAgICAgICAgdXJsKCcvcHVibGljL2ltZzIuanBnJykgY2VudGVyIC8gY292ZXIgZml4ZWQ7XHJcbiAgICAgICAgICBmb250LWZhbWlseTogXCJQbHVzIEpha2FydGEgU2Fuc1wiLCBcIlNlZ29lIFVJXCIsIHNhbnMtc2VyaWY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItY2FyZCB7XHJcbiAgICAgICAgICB3aWR0aDogbWluKDEwMCUsIDUyMHB4KTtcclxuICAgICAgICAgIHBhZGRpbmc6IDYwcHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAyOHB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNSwgMjMsIDQyLCAwLjgyKTtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKTtcclxuICAgICAgICAgIGJveC1zaGFkb3c6IDAgNTBweCAxMDBweCAtMjBweCByZ2JhKDAsIDAsIDAsIDAuOCk7XHJcbiAgICAgICAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMzBweCk7XHJcbiAgICAgICAgICBjb2xvcjogI2ZmZjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1sb2dvIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XHJcbiAgICAgICAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogODAwO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IC0wLjAxZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbG9nbyBzcGFuIHtcclxuICAgICAgICAgIGNvbG9yOiAjNjM2NmYxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWZpZWxkIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbGFiZWwge1xyXG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFlbTtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWlucHV0IHtcclxuICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgcGFkZGluZzogMTRweCAxOHB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcclxuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSk7XHJcbiAgICAgICAgICBjb2xvcjogI2ZmZjtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWlucHV0OmZvY3VzIHtcclxuICAgICAgICAgIGJvcmRlci1jb2xvcjogIzYzNjZmMTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wOCk7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDAgMCA0cHggcmdiYSg5OSwgMTAyLCAyNDEsIDAuMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItYnV0dG9uIHtcclxuICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMTBweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDE2cHg7XHJcbiAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzYzNjZmMSwgI2E4NTVmNyk7XHJcbiAgICAgICAgICBjb2xvcjogI2ZmZjtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMjVweCAtNXB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWJ1dHRvbjpkaXNhYmxlZCB7XHJcbiAgICAgICAgICBvcGFjaXR5OiAwLjY7XHJcbiAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLW1lc3NhZ2Uge1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDEycHg7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxM3B4O1xyXG4gICAgICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1tZXNzYWdlLmlzLXZpc2libGUge1xyXG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItbWVzc2FnZS5lcnJvciB7XHJcbiAgICAgICAgICBjb2xvcjogI2Y4NzE3MTtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjM5LCA2OCwgNjgsIDAuMSk7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDIzOSwgNjgsIDY4LCAwLjIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLW1lc3NhZ2Uuc3VjY2VzcyB7XHJcbiAgICAgICAgICBjb2xvcjogIzRhZGU4MDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMzQsIDE5NywgOTQsIDAuMSk7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDM0LCAxOTcsIDk0LCAwLjIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnJlZ2lzdGVyLWZvb3RlciB7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAyNXB4O1xyXG4gICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC42KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5yZWdpc3Rlci1mb290ZXIgYSB7XHJcbiAgICAgICAgICBjb2xvcjogIzYzNjZmMTtcclxuICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAucmVnaXN0ZXItZm9vdGVyIGE6aG92ZXIge1xyXG4gICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogODUwcHgpIHtcclxuICAgICAgICAgIC5yZWdpc3Rlci1jYXJkIHtcclxuICAgICAgICAgICAgcGFkZGluZzogNDBweDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIGB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItY2FyZFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItbG9nb1wiPlJlZ2lzdGVyIG91ciBzaXRlPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgIGNsYXNzTmFtZT17YHJlZ2lzdGVyLW1lc3NhZ2UgJHttZXNzYWdlLnR5cGV9ICR7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UudGV4dCA/IFwiaXMtdmlzaWJsZVwiIDogXCJcIlxyXG4gICAgICAgICAgfWB9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge21lc3NhZ2UudGV4dH1cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlZ2lzdGVyLWZpZWxkXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJyZWdpc3Rlci1sYWJlbFwiIGh0bWxGb3I9XCJuYW1lXCI+XHJcbiAgICAgICAgICAgICAgRnVsbCBOYW1lXHJcbiAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWlucHV0XCJcclxuICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgICAgaWQ9XCJuYW1lXCJcclxuICAgICAgICAgICAgICBuYW1lPVwibmFtZVwiXHJcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciB5b3VyIGZ1bGwgbmFtZVwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1TdGF0ZS5uYW1lfVxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XHJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItZmllbGRcIj5cclxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWxhYmVsXCIgaHRtbEZvcj1cImVtYWlsXCI+XHJcbiAgICAgICAgICAgICAgRW1haWwgQWRkcmVzc1xyXG4gICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyZWdpc3Rlci1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgdHlwZT1cImVtYWlsXCJcclxuICAgICAgICAgICAgICBpZD1cImVtYWlsXCJcclxuICAgICAgICAgICAgICBuYW1lPVwiZW1haWxcIlxyXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZXhhbXBsZUBlbWFpbC5jb21cIlxyXG4gICAgICAgICAgICAgIHZhbHVlPXtmb3JtU3RhdGUuZW1haWx9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cclxuICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWdpc3Rlci1maWVsZFwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwicmVnaXN0ZXItbGFiZWxcIiBodG1sRm9yPVwicGFzc3dvcmRcIj5cclxuICAgICAgICAgICAgICBQYXNzd29yZFxyXG4gICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyZWdpc3Rlci1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcclxuICAgICAgICAgICAgICBpZD1cInBhc3N3b3JkXCJcclxuICAgICAgICAgICAgICBuYW1lPVwicGFzc3dvcmRcIlxyXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQXQgbGVhc3QgNiBjaGFyYWN0ZXJzXCJcclxuICAgICAgICAgICAgICBtaW5MZW5ndGg9ezZ9XHJcbiAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1TdGF0ZS5wYXNzd29yZH1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxyXG4gICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlZ2lzdGVyLWJ1dHRvblwiXHJcbiAgICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIlxyXG4gICAgICAgICAgICBkaXNhYmxlZD17aXNTdWJtaXR0aW5nfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7aXNTdWJtaXR0aW5nID8gXCJDcmVhdGluZyBhY2NvdW50Li4uXCIgOiBcIkNyZWF0ZSBBY2NvdW50XCJ9XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8L2Zvcm0+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVnaXN0ZXItZm9vdGVyXCI+XHJcbiAgICAgICAgICBBbHJlYWR5IGhhdmUgYW4gYWNjb3VudD8gPGEgaHJlZj1cIi9hZG1pbi9sb2dpblwiPkxvZyBpbjwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0ZXI7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBncmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMjQwcHgsIDFmcikpXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMTZweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjI4KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwibGluZWFyLWdyYWRpZW50KDE2MGRlZywgIzBiMWEzOCAwJSwgIzA5MTYyZiAxMDAlKVwiLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBvdmVyZmxvdzogXCJoaWRkZW5cIixcclxuICBib3hTaGFkb3c6IFwiMCAxMnB4IDIycHggcmdiYSgyLCA2LCAyMywgMC4yNSlcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlV3JhcFN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBoZWlnaHQ6IFwiMjAwcHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gIHBhZGRpbmc6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gIG9iamVjdEZpdDogXCJjb250YWluXCIsXHJcbn07XHJcblxyXG5jb25zdCBib2R5U3R5bGUgPSB7XHJcbiAgcGFkZGluZzogXCIxNHB4XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgbWV0YVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDFmclwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IChpc0FjdGl2ZSkgPT4gKHtcclxuICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjA1ZW1cIixcclxuICBwYWRkaW5nOiBcIjVweCAxMHB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgY29sb3I6IGlzQWN0aXZlID8gXCIjMTQ1MzJkXCIgOiBcIiM3ZjFkMWRcIixcclxuICBiYWNrZ3JvdW5kOiBpc0FjdGl2ZSA/IFwiI2JiZjdkMFwiIDogXCIjZmVjYWNhXCIsXHJcbn0pO1xyXG5cclxuY29uc3QgbGlua1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiaW5saW5lLWJsb2NrXCIsXHJcbiAgbWFyZ2luVG9wOiBcIjRweFwiLFxyXG4gIGNvbG9yOiBcIiM5M2M1ZmRcIixcclxuICB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDYwMCxcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgZW1wdHlTdHlsZSA9IHtcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggZGFzaGVkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC40NSlcIixcclxuICBjb2xvcjogXCIjY2JkNWUxXCIsXHJcbn07XHJcblxyXG5jb25zdCBmb3JtYXRQcmljZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IGFtb3VudCA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICBpZiAoIU51bWJlci5pc0Zpbml0ZShhbW91bnQpKSB7XHJcbiAgICByZXR1cm4gXCIwLjAwXCI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYW1vdW50LnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0UmVjb3JkSWQgPSAocmVjb3JkKSA9PiB7XHJcbiAgcmV0dXJuIHJlY29yZD8ucGFyYW1zPy5pZCB8fCByZWNvcmQ/LmlkIHx8IHJlY29yZD8ucGFyYW0/LmlkIHx8IFwiXCI7XHJcbn07XHJcblxyXG5jb25zdCBnZXRTaG93SHJlZiA9IChyZWNvcmQsIHJlc291cmNlSWQpID0+IHtcclxuICBjb25zdCByZWNvcmRBY3Rpb25zID0gcmVjb3JkPy5yZWNvcmRBY3Rpb25zIHx8IHJlY29yZD8uYWN0aW9ucyB8fCBbXTtcclxuICBjb25zdCBzaG93QWN0aW9uID0gcmVjb3JkQWN0aW9ucy5maW5kKChhY3Rpb24pID0+IGFjdGlvbj8ubmFtZSA9PT0gXCJzaG93XCIpO1xyXG4gIGNvbnN0IHJhd0hyZWYgPSBzaG93QWN0aW9uPy5ocmVmIHx8IHJlY29yZD8uaHJlZiB8fCBcIlwiO1xyXG5cclxuICBpZiAocmF3SHJlZikge1xyXG4gICAgcmV0dXJuIHJhd0hyZWY7XHJcbiAgfVxyXG5cclxuICBjb25zdCBpZCA9IGdldFJlY29yZElkKHJlY29yZCk7XHJcbiAgcmV0dXJuIGlkXHJcbiAgICA/IGAvYWRtaW4vcmVzb3VyY2VzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KHJlc291cmNlSWQpfS9yZWNvcmRzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KGlkKX0vc2hvd2BcclxuICAgIDogXCJcIjtcclxufTtcclxuXHJcbmNvbnN0IFByb2R1Y3RDYXJkc0xpc3QgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCBbYXBpUmVjb3Jkcywgc2V0QXBpUmVjb3Jkc10gPSB1c2VTdGF0ZShbXSk7XHJcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IFtsb2FkRXJyb3IsIHNldExvYWRFcnJvcl0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgY29uc3QgcmVzb3VyY2VJZCA9XHJcbiAgICBwcm9wcz8ucmVzb3VyY2U/LmlkID09PSBcIlByb2R1Y3RcIlxyXG4gICAgICA/IFwiUHJvZHVjdHNcIlxyXG4gICAgICA6IHByb3BzPy5yZXNvdXJjZT8uaWQgfHwgXCJQcm9kdWN0c1wiO1xyXG4gIGNvbnN0IHByb3BSZWNvcmRzID0gcHJvcHM/LnJlY29yZHMgfHwgW107XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAocHJvcFJlY29yZHMubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBsb2FkUmVjb3JkcyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgc2V0TG9hZGluZyh0cnVlKTtcclxuICAgICAgc2V0TG9hZEVycm9yKFwiXCIpO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9hcGkvcmVzb3VyY2VzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KHJlc291cmNlSWQpfS9hY3Rpb25zL2xpc3RgLFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZD8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIHByb2R1Y3RzXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0QXBpUmVjb3JkcyhwYXlsb2FkPy5yZWNvcmRzIHx8IFtdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgICAgc2V0TG9hZEVycm9yKGVycm9yPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgcHJvZHVjdHNcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkUmVjb3JkcygpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIGlzTW91bnRlZCA9IGZhbHNlO1xyXG4gICAgfTtcclxuICB9LCBbcHJvcFJlY29yZHMubGVuZ3RoLCByZXNvdXJjZUlkXSk7XHJcblxyXG4gIGNvbnN0IHJlY29yZHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIHJldHVybiBwcm9wUmVjb3Jkcy5sZW5ndGggPyBwcm9wUmVjb3JkcyA6IGFwaVJlY29yZHM7XHJcbiAgfSwgW3Byb3BSZWNvcmRzLCBhcGlSZWNvcmRzXSk7XHJcblxyXG4gIGlmIChsb2FkaW5nKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+TG9hZGluZyBwcm9kdWN0cy4uLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChsb2FkRXJyb3IpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT57bG9hZEVycm9yfTwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmICghcmVjb3Jkcy5sZW5ndGgpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5ObyBwcm9kdWN0cyBmb3VuZC48L2Rpdj47XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17Z3JpZFN0eWxlfT5cclxuICAgICAge3JlY29yZHMubWFwKChyZWNvcmQpID0+IHtcclxuICAgICAgICBjb25zdCBwYXJhbXMgPSByZWNvcmQ/LnBhcmFtcyB8fCB7fTtcclxuICAgICAgICBjb25zdCBpZCA9IGdldFJlY29yZElkKHJlY29yZCk7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHBhcmFtcz8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwiO1xyXG4gICAgICAgIGNvbnN0IGNhdGVnb3J5ID0gcGFyYW1zPy5jYXRlZ29yeUlkIHx8IFwiLVwiO1xyXG4gICAgICAgIGNvbnN0IGltYWdlVXJsID0gcGFyYW1zPy5pbWFnZVVybCB8fCBcIlwiO1xyXG4gICAgICAgIGNvbnN0IHN0b2NrID0gTnVtYmVyKHBhcmFtcz8uc3RvY2sgfHwgMCk7XHJcbiAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBCb29sZWFuKHBhcmFtcz8uaXNBY3RpdmUpO1xyXG4gICAgICAgIGNvbnN0IGRldGFpbHNIcmVmID0gZ2V0U2hvd0hyZWYocmVjb3JkLCByZXNvdXJjZUlkKTtcclxuICAgICAgICBjb25zdCBvcGVuRGV0YWlscyA9ICgpID0+IHtcclxuICAgICAgICAgIGlmIChkZXRhaWxzSHJlZikge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKGRldGFpbHNIcmVmKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgPGFydGljbGUga2V5PXtpZH0gc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2ltYWdlV3JhcFN0eWxlfT5cclxuICAgICAgICAgICAgICB7aW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2VVcmx9IGFsdD17bmFtZX0gc3R5bGU9e2ltYWdlU3R5bGV9IC8+XHJcbiAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgTm8gaW1hZ2VcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Ym9keVN0eWxlfT5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiBcIjE4cHhcIiwgZm9udFdlaWdodDogNzAwIH19PntuYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e21ldGFTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PkNhdGVnb3J5OiB7Y2F0ZWdvcnl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlN0b2NrOiB7c3RvY2t9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlByaWNlOiBScy4ge2Zvcm1hdFByaWNlKHBhcmFtcz8ucHJpY2UpfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtiYWRnZVN0eWxlKGlzQWN0aXZlKX0+XHJcbiAgICAgICAgICAgICAgICB7aXNBY3RpdmUgPyBcIkFDVElWRVwiIDogXCJJTkFDVElWRVwifVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgICAgaHJlZj17ZGV0YWlsc0hyZWYgfHwgXCIjXCJ9XHJcbiAgICAgICAgICAgICAgICBzdHlsZT17bGlua1N0eWxlfVxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17KGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgIG9wZW5EZXRhaWxzKCk7XHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgYXJpYS1kaXNhYmxlZD17IWRldGFpbHNIcmVmfVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIFZpZXcgZGV0YWlsc1xyXG4gICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgKTtcclxuICAgICAgfSl9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdENhcmRzTGlzdDtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHBhZ2VTdHlsZSA9IHtcclxuICBtaW5IZWlnaHQ6IFwiMTAwJVwiLFxyXG4gIHBhZGRpbmc6IFwiMjRweFwiLFxyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmZmZmZmZcIixcclxufTtcclxuXHJcbmNvbnN0IHRvcEJhclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbiAgbWFyZ2luQm90dG9tOiBcIjE4cHhcIixcclxuICBmbGV4V3JhcDogXCJ3cmFwXCIsXHJcbn07XHJcblxyXG5jb25zdCBiYWNrTGlua1N0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxuICB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsXHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbn07XHJcblxyXG5jb25zdCBsYXlvdXRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgzMjBweCwgMS4wNWZyKSBtaW5tYXgoMzYwcHgsIDAuOTVmcilcIixcclxuICBnYXA6IFwiMThweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwic3RhcnRcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMjJweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjA4KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2ZmZmZmZlwiLFxyXG4gIGJveFNoYWRvdzogXCIwIDE4cHggMzRweCByZ2JhKDE1LCAyMywgNDIsIDAuMDgpXCIsXHJcbiAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZUNhcmRTdHlsZSA9IHtcclxuICAuLi5jYXJkU3R5bGUsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlUm93czogXCIxZnIgYXV0b1wiLFxyXG4gIG1pbkhlaWdodDogXCI1MDBweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VXcmFwU3R5bGUgPSB7XHJcbiAgYmFja2dyb3VuZDogXCIjZjhmYWZjXCIsXHJcbiAgbWluSGVpZ2h0OiBcIjM0MHB4XCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgcGxhY2VJdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IGltYWdlU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgZGlzcGxheTogXCJibG9ja1wiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VGYWxsYmFja1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIHBsYWNlSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgY29sb3I6IFwiIzY0NzQ4YlwiLFxyXG4gIGJhY2tncm91bmQ6IFwibGluZWFyLWdyYWRpZW50KDEzNWRlZywgI2Y4ZmFmYyAwJSwgI2VlZjJmZiAxMDAlKVwiLFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZUZvb3RlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgcGFkZGluZzogXCIxNnB4IDE4cHggMThweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2ZmZmZmZlwiLFxyXG4gIGJvcmRlclRvcDogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjA4KVwiLFxyXG4gIGZsZXhXcmFwOiBcIndyYXBcIixcclxufTtcclxuXHJcbmNvbnN0IHRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcImNsYW1wKDMwcHgsIDR2dywgNTRweClcIixcclxuICBsaW5lSGVpZ2h0OiAxLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJjYXBpdGFsaXplXCIsXHJcbn07XHJcblxyXG5jb25zdCBzdWJ0aXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogXCI4cHggMCAwXCIsXHJcbiAgY29sb3I6IFwiIzZiNzI4MFwiLFxyXG4gIGZvbnRTaXplOiBcIjE0cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHBpbGxTdHlsZSA9IChhY3RpdmUpID0+ICh7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIHdpZHRoOiBcImZpdC1jb250ZW50XCIsXHJcbiAgcGFkZGluZzogXCI3cHggMTJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgY29sb3I6IGFjdGl2ZSA/IFwiIzE0NTMyZFwiIDogXCIjN2YxZDFkXCIsXHJcbiAgYmFja2dyb3VuZDogYWN0aXZlID8gXCIjYmJmN2QwXCIgOiBcIiNmZWNhY2FcIixcclxufSk7XHJcblxyXG5jb25zdCBwaWxsRG90U3R5bGUgPSAoYWN0aXZlKSA9PiAoe1xyXG4gIHdpZHRoOiBcIjhweFwiLFxyXG4gIGhlaWdodDogXCI4cHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiOTk5cHhcIixcclxuICBiYWNrZ3JvdW5kOiBhY3RpdmUgPyBcIiMyMmM1NWVcIiA6IFwiI2VmNDQ0NFwiLFxyXG59KTtcclxuXHJcbmNvbnN0IGluZm9HcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJyZXBlYXQoMywgbWlubWF4KDAsIDFmcikpXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBtYXJnaW5Ub3A6IFwiMThweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0NhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMTZweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjA4KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0xhYmVsU3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjE4ZW1cIixcclxuICBjb2xvcjogXCIjNmI3MjgwXCIsXHJcbiAgbWFyZ2luQm90dG9tOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb1ZhbHVlU3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTdweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgd29yZEJyZWFrOiBcImJyZWFrLXdvcmRcIixcclxufTtcclxuXHJcbmNvbnN0IGNvbnRlbnRDYXJkU3R5bGUgPSB7XHJcbiAgLi4uY2FyZFN0eWxlLFxyXG4gIHBhZGRpbmc6IFwiMjBweFwiLFxyXG59O1xyXG5cclxuY29uc3Qgc2VjdGlvblRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjE4ZW1cIixcclxuICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxyXG4gIGNvbG9yOiBcIiMxMTE4MjdcIixcclxufTtcclxuXHJcbmNvbnN0IGRlc2NyaXB0aW9uU3R5bGUgPSB7XHJcbiAgbWFyZ2luVG9wOiBcIjEycHhcIixcclxuICBjb2xvcjogXCIjMzc0MTUxXCIsXHJcbiAgZm9udFNpemU6IFwiMTVweFwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuOCxcclxuICB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIsXHJcbn07XHJcblxyXG5jb25zdCBkZXRhaWxzR3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgbWFyZ2luVG9wOiBcIjEycHhcIixcclxufTtcclxuXHJcbmNvbnN0IGRldGFpbFJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiMTBweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjA4KVwiLFxyXG59O1xyXG5cclxuY29uc3QgZGV0YWlsTGFiZWxTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjNmI3MjgwXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgZGV0YWlsVmFsdWVTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgZm9udFdlaWdodDogNjAwLFxyXG4gIHRleHRBbGlnbjogXCJyaWdodFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGFjdGlvblJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgZmxleFdyYXA6IFwid3JhcFwiLFxyXG4gIG1hcmdpblRvcDogXCIxOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBwcmltYXJ5QnV0dG9uU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIG1pbldpZHRoOiBcIjE4MHB4XCIsXHJcbiAgcGFkZGluZzogXCIxNHB4IDE4cHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTRweFwiLFxyXG4gIGJvcmRlcjogXCJub25lXCIsXHJcbiAgYmFja2dyb3VuZDogXCJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNjM2NmYxIDAlLCAjOGI1Y2Y2IDEwMCUpXCIsXHJcbiAgY29sb3I6IFwiI2ZmZmZmZlwiLFxyXG4gIGZvbnRTaXplOiBcIjE1cHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxuICBib3hTaGFkb3c6IFwiMCAxMHB4IDE4cHggcmdiYSg5OSwgMTAyLCAyNDEsIDAuMylcIixcclxufTtcclxuXHJcbmNvbnN0IHNlY29uZGFyeUJ1dHRvblN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiaW5saW5lLWZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxuICBtaW5XaWR0aDogXCIxODBweFwiLFxyXG4gIHBhZGRpbmc6IFwiMTRweCAxOHB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE0cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTcsIDI0LCAzOSwgMC4xMilcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmZmZmZmZcIixcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgZm9udFNpemU6IFwiMTVweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0Q3VycmVuY3kgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBhbW91bnQgPSBOdW1iZXIodmFsdWUgfHwgMCk7XHJcbiAgcmV0dXJuIGBScy4gJHthbW91bnQudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSl9YDtcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUpID0+IHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gXCItXCI7XHJcbiAgfVxyXG5cclxuICBjb25zdCBkYXRlID0gbmV3IERhdGUodmFsdWUpO1xyXG4gIGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSB7XHJcbiAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgZGF0ZVN0eWxlOiBcIm1lZGl1bVwiLFxyXG4gICAgdGltZVN0eWxlOiBcInNob3J0XCIsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBnZXRQcm9kdWN0SW1hZ2UgPSAocGFyYW1zKSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIHBhcmFtcz8uaW1hZ2VVcmwgfHxcclxuICAgIHBhcmFtcz8uaW1hZ2UgfHxcclxuICAgIHBhcmFtcz8udGh1bWJuYWlsIHx8XHJcbiAgICBwYXJhbXM/LmNvdmVyIHx8XHJcbiAgICBcIlwiXHJcbiAgKTtcclxufTtcclxuXHJcbmNvbnN0IHBhcnNlU2l6ZVN0b2NrID0gKHZhbHVlKSA9PiB7XHJcbiAgaWYgKCF2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHt9O1xyXG4gIH1cclxuXHJcbiAgbGV0IHNvdXJjZSA9IHZhbHVlO1xyXG4gIGlmICh0eXBlb2Ygc291cmNlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBzb3VyY2UgPSBKU09OLnBhcnNlKHNvdXJjZSk7XHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgcmV0dXJuIHt9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKCFzb3VyY2UgfHwgdHlwZW9mIHNvdXJjZSAhPT0gXCJvYmplY3RcIiB8fCBBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcclxuICAgIHJldHVybiB7fTtcclxuICB9XHJcblxyXG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSB7fTtcclxuICBmb3IgKGNvbnN0IFtyYXdTaXplLCByYXdRdHldIG9mIE9iamVjdC5lbnRyaWVzKHNvdXJjZSkpIHtcclxuICAgIGNvbnN0IHNpemUgPSBTdHJpbmcocmF3U2l6ZSB8fCBcIlwiKVxyXG4gICAgICAudHJpbSgpXHJcbiAgICAgIC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgaWYgKCFzaXplKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHF0eSA9IE51bWJlcihyYXdRdHkpO1xyXG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUocXR5KSkge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICBub3JtYWxpemVkW3NpemVdID0gTWF0aC5tYXgoMCwgTWF0aC50cnVuYyhxdHkpKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBub3JtYWxpemVkO1xyXG59O1xyXG5cclxuY29uc3QgUHJvZHVjdFNob3cgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCByZWNvcmQgPSBwcm9wcz8ucmVjb3JkO1xyXG4gIGNvbnN0IHBhcmFtcyA9IHJlY29yZD8ucGFyYW1zIHx8IHt9O1xyXG4gIGNvbnN0IFtjdXJyZW50VXNlclJvbGUsIHNldEN1cnJlbnRVc2VyUm9sZV0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbcHJvZHVjdERhdGEsIHNldFByb2R1Y3REYXRhXSA9IHVzZVN0YXRlKHBhcmFtcyk7XHJcblxyXG4gIGNvbnN0IHByb2R1Y3RJZCA9IHBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZCB8fCBcIlwiO1xyXG4gIGNvbnN0IG5hbWUgPSBwcm9kdWN0RGF0YT8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwiO1xyXG4gIGNvbnN0IHNrdSA9IHByb2R1Y3REYXRhPy5za3UgfHwgXCItXCI7XHJcbiAgY29uc3QgY2F0ZWdvcnkgPSBwcm9kdWN0RGF0YT8uY2F0ZWdvcnlJZCB8fCBcIi1cIjtcclxuICBjb25zdCBpbWFnZVVybCA9IGdldFByb2R1Y3RJbWFnZShwcm9kdWN0RGF0YSk7XHJcbiAgY29uc3Qgc3RvY2sgPSBOdW1iZXIocHJvZHVjdERhdGE/LnN0b2NrIHx8IDApO1xyXG4gIGNvbnN0IHNpemVTdG9jayA9IHBhcnNlU2l6ZVN0b2NrKHByb2R1Y3REYXRhPy5zaXplU3RvY2spO1xyXG4gIGNvbnN0IHNpemVTdG9ja0VudHJpZXMgPSBPYmplY3QuZW50cmllcyhzaXplU3RvY2spO1xyXG4gIGNvbnN0IGlzQWN0aXZlID0gQm9vbGVhbihwcm9kdWN0RGF0YT8uaXNBY3RpdmUpO1xyXG4gIGNvbnN0IHByaWNlID0gZm9ybWF0Q3VycmVuY3kocHJvZHVjdERhdGE/LnByaWNlKTtcclxuICBjb25zdCBkZXNjcmlwdGlvbiA9XHJcbiAgICBwcm9kdWN0RGF0YT8uZGVzY3JpcHRpb24gfHwgXCJObyBkZXNjcmlwdGlvbiBhdmFpbGFibGUgZm9yIHRoaXMgcHJvZHVjdC5cIjtcclxuXHJcbiAgY29uc3QgZWRpdFVybCA9IHByb2R1Y3RJZFxyXG4gICAgPyBgL2FkbWluL3Jlc291cmNlcy9Qcm9kdWN0cy9yZWNvcmRzLyR7ZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhwcm9kdWN0SWQpKX0vZWRpdGBcclxuICAgIDogXCJcIjtcclxuXHJcbiAgY29uc3Qgb3JkZXJVcmwgPSBwcm9kdWN0SWRcclxuICAgID8gYC9hZG1pbi9yZXNvdXJjZXMvT3JkZXJzL2FjdGlvbnMvbmV3P3Byb2R1Y3RJZD0ke2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcocHJvZHVjdElkKSl9YFxyXG4gICAgOiBcIlwiO1xyXG5cclxuICBjb25zdCBoYW5kbGVPcmRlckNsaWNrID0gKCkgPT4ge1xyXG4gICAgaWYgKG9yZGVyVXJsKSB7XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24ob3JkZXJVcmwpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZUVkaXRDbGljayA9ICgpID0+IHtcclxuICAgIGlmIChlZGl0VXJsKSB7XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oZWRpdFVybCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIC8vIEZldGNoIGZyZXNoIHByb2R1Y3QgZGF0YSB3aXRoIHNpemVTdG9ja1xyXG4gICAgaWYgKHByb2R1Y3RJZCkge1xyXG4gICAgICBmZXRjaChgL2FwaS9wcm9kdWN0cy8ke3Byb2R1Y3RJZH1gLCB7XHJcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcclxuICAgICAgfSlcclxuICAgICAgICAudGhlbigocmVzKSA9PiAocmVzLm9rID8gcmVzLmpzb24oKSA6IG51bGwpKVxyXG4gICAgICAgIC5jYXRjaCgoKSA9PiBudWxsKVxyXG4gICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZGF0YT8uaWQpIHtcclxuICAgICAgICAgICAgc2V0UHJvZHVjdERhdGEoZGF0YSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRmV0Y2ggY3VycmVudCB1c2VyIHJvbGVcclxuICAgIGZldGNoKFwiL2FkbWluL2NvbnRleHQvY3VycmVudC11c2VyXCIsIHtcclxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXHJcbiAgICB9KVxyXG4gICAgICAudGhlbigocmVzKSA9PiAocmVzLm9rID8gcmVzLmpzb24oKSA6IG51bGwpKVxyXG4gICAgICAuY2F0Y2goKCkgPT4gbnVsbClcclxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICBpZiAoZGF0YT8ucm9sZSkge1xyXG4gICAgICAgICAgc2V0Q3VycmVudFVzZXJSb2xlKGRhdGEucm9sZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcblxyXG4gICAgcm9vdC5jbGFzc0xpc3QuYWRkKFwiY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlXCIpO1xyXG4gICAgYm9keT8uY2xhc3NMaXN0LmFkZChcImNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZVwiKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICByb290LmNsYXNzTGlzdC5yZW1vdmUoXCJjaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmVcIik7XHJcbiAgICAgIGJvZHk/LmNsYXNzTGlzdC5yZW1vdmUoXCJjaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmVcIik7XHJcbiAgICB9O1xyXG4gIH0sIFtwcm9kdWN0SWRdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3BhZ2VTdHlsZX0+XHJcbiAgICAgIDxzdHlsZT57YFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIGJvZHksXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgI2FwcCxcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSAuYWRtaW5qc19MYXlvdXQsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIFtkYXRhLWNzcz1cImxheW91dFwiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBtYWluLFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlLFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlICNhcHAsXHJcbiAgICAgICAgYm9keS5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgLmFkbWluanNfTGF5b3V0LFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIFtkYXRhLXRlc3RpZD1cImxheW91dFwiXSxcclxuICAgICAgICBib2R5LmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBbZGF0YS1jc3M9XCJsYXlvdXRcIl0sXHJcbiAgICAgICAgYm9keS5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgbWFpbiB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBib2R5OjpiZWZvcmUsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmU6OmJlZm9yZSxcclxuICAgICAgICBib2R5LmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZTo6YmVmb3JlIHtcclxuICAgICAgICAgIGNvbnRlbnQ6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJhY2tncm91bmQtaW1hZ2U6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIFtkYXRhLXRlc3RpZD1cInNpZGViYXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgLmFkbWluanNfU2lkZWJhcixcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBzZWN0aW9uW2RhdGEtY3NzPVwic2lkZWJhclwiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBhc2lkZVtkYXRhLWNzcz1cInNpZGViYXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgbmF2W2RhdGEtY3NzPVwic2lkZWJhclwiXSB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICB3aWR0aDogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgbWluLXdpZHRoOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBtYXgtd2lkdGg6IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYm9yZGVyOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSAuYWRtaW5qc19MYXlvdXQsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIFtkYXRhLWNzcz1cImxheW91dFwiXSB7XHJcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgLmFkbWluanNfTGF5b3V0ID4gKjpub3QoW2RhdGEtdGVzdGlkPVwic2lkZWJhclwiXSksXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdID4gKjpub3QoW2RhdGEtdGVzdGlkPVwic2lkZWJhclwiXSksXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgW2RhdGEtY3NzPVwibGF5b3V0XCJdID4gKjpub3QoW2RhdGEtdGVzdGlkPVwic2lkZWJhclwiXSkge1xyXG4gICAgICAgICAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxuICAgICAgICAgIG1heC13aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgW2RhdGEtdGVzdGlkPVwidG9wYmFyXCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1wcm9kdWN0LXNob3ctYWN0aXZlIC5hZG1pbmpzX1RvcEJhcixcclxuICAgICAgICBodG1sLmNoYW5nZTgtcHJvZHVjdC1zaG93LWFjdGl2ZSBoZWFkZXJbZGF0YS1jc3M9XCJ0b3BiYXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1hY3RpdmUgc2VjdGlvbltkYXRhLWNzcz1cInRvcGJhclwiXSB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSksXHJcbiAgICAgICAgYm9keTpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpLFxyXG4gICAgICAgICNhcHA6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSxcclxuICAgICAgICAuYWRtaW5qc19MYXlvdXQ6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSxcclxuICAgICAgICBbZGF0YS10ZXN0aWQ9XCJsYXlvdXRcIl06aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSxcclxuICAgICAgICBbZGF0YS1jc3M9XCJsYXlvdXRcIl06aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSxcclxuICAgICAgICBtYWluOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSkge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogI2ZmZmZmZiAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZiAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIFtkYXRhLXRlc3RpZD1cInNpZGViYXJcIl0sXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIC5hZG1pbmpzX1NpZGViYXIsXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIHNlY3Rpb25bZGF0YS1jc3M9XCJzaWRlYmFyXCJdLFxyXG4gICAgICAgIGh0bWw6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSBhc2lkZVtkYXRhLWNzcz1cInNpZGViYXJcIl0sXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIG5hdltkYXRhLWNzcz1cInNpZGViYXJcIl0ge1xyXG4gICAgICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgd2lkdGg6IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIG1pbi13aWR0aDogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgbWF4LXdpZHRoOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJvcmRlcjogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbiAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIC5hZG1pbmpzX0xheW91dCxcclxuICAgICAgICBodG1sOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSkgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdLFxyXG4gICAgICAgIGh0bWw6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSBbZGF0YS1jc3M9XCJsYXlvdXRcIl0ge1xyXG4gICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWw6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSAuYWRtaW5qc19MYXlvdXQgPiAqOm5vdChbZGF0YS10ZXN0aWQ9XCJzaWRlYmFyXCJdKSxcclxuICAgICAgICBodG1sOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSkgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdID4gKjpub3QoW2RhdGEtdGVzdGlkPVwic2lkZWJhclwiXSksXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIFtkYXRhLWNzcz1cImxheW91dFwiXSA+ICo6bm90KFtkYXRhLXRlc3RpZD1cInNpZGViYXJcIl0pIHtcclxuICAgICAgICAgIHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBtYXgtd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWw6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSBbZGF0YS10ZXN0aWQ9XCJ0b3BiYXJcIl0sXHJcbiAgICAgICAgaHRtbDpoYXMoLmNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2UpIC5hZG1pbmpzX1RvcEJhcixcclxuICAgICAgICBodG1sOmhhcyguY2hhbmdlOC1wcm9kdWN0LXNob3ctcGFnZSkgaGVhZGVyW2RhdGEtY3NzPVwidG9wYmFyXCJdLFxyXG4gICAgICAgIGh0bWw6aGFzKC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlKSBzZWN0aW9uW2RhdGEtY3NzPVwidG9wYmFyXCJdIHtcclxuICAgICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1zaGVsbCB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgZ2FwOiAxOHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LW1ldGEtc2Nyb2xsIHtcclxuICAgICAgICAgIG1heC1oZWlnaHQ6IDMyMHB4O1xyXG4gICAgICAgICAgb3ZlcmZsb3cteTogYXV0bztcclxuICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDZweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1tZXRhLXNjcm9sbDo6LXdlYmtpdC1zY3JvbGxiYXIge1xyXG4gICAgICAgICAgd2lkdGg6IDhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1tZXRhLXNjcm9sbDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNDgsIDE2MywgMTg0LCAwLjgpO1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2hhbmdlOC1wcm9kdWN0LXNob3ctbWV0YS1zY3JvbGw6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjQxLCAyNDUsIDI0OSwgMC45KTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDExMDBweCkge1xyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LWxheW91dCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZHVjdC1zaG93LWluZm8tZ3JpZCB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgwLCAxZnIpKSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1tZXRhLXNjcm9sbCB7XHJcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IG5vbmU7XHJcbiAgICAgICAgICAgIG92ZXJmbG93LXk6IHZpc2libGU7XHJcbiAgICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNzIwcHgpIHtcclxuICAgICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1pbmZvLWdyaWQge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXByb2R1Y3Qtc2hvdy1wYWdlIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMTZweCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBgfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdC1zaG93LXNoZWxsIGNoYW5nZTgtcHJvZHVjdC1zaG93LXBhZ2VcIj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt0b3BCYXJTdHlsZX0+XHJcbiAgICAgICAgICA8YVxyXG4gICAgICAgICAgICBocmVmPVwiL2FkbWluL3Jlc291cmNlcy9Qcm9kdWN0cy9hY3Rpb25zL2xpc3RcIlxyXG4gICAgICAgICAgICBzdHlsZT17YmFja0xpbmtTdHlsZX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+4oC5PC9zcGFuPlxyXG4gICAgICAgICAgICBCYWNrIHRvIFByb2R1Y3RzXHJcbiAgICAgICAgICA8L2E+XHJcblxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17cGlsbFN0eWxlKGlzQWN0aXZlKX0+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtwaWxsRG90U3R5bGUoaXNBY3RpdmUpfSAvPlxyXG4gICAgICAgICAgICB7aXNBY3RpdmUgPyBcIkFjdGl2ZVwiIDogXCJJbmFjdGl2ZVwifVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LXNob3ctbGF5b3V0XCIgc3R5bGU9e2xheW91dFN0eWxlfT5cclxuICAgICAgICAgIDxzZWN0aW9uIHN0eWxlPXtpbWFnZUNhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2ltYWdlV3JhcFN0eWxlfT5cclxuICAgICAgICAgICAgICB7aW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2VVcmx9IGFsdD17bmFtZX0gc3R5bGU9e2ltYWdlU3R5bGV9IC8+XHJcbiAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2ltYWdlRmFsbGJhY2tTdHlsZX0+Tm8gaW1hZ2UgYXZhaWxhYmxlPC9kaXY+XHJcbiAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbWFnZUZvb3RlclN0eWxlfT5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogXCIjNjQ3NDhiXCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgUHJvZHVjdCBJRFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiBcIiMxMTE4MjdcIiwgZm9udFdlaWdodDogNzAwIH19PlxyXG4gICAgICAgICAgICAgICAgICB7cHJvZHVjdElkIHx8IFwiLVwifVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiBcIiM2NDc0OGJcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlByaWNlPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiBcIiMxMTE4MjdcIiwgZm9udFdlaWdodDogNzAwIH19PntwcmljZX08L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L3NlY3Rpb24+XHJcblxyXG4gICAgICAgICAgPHNlY3Rpb24gc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogXCIyMnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgPGgxIHN0eWxlPXt0aXRsZVN0eWxlfT57bmFtZX08L2gxPlxyXG4gICAgICAgICAgICAgIDxwIHN0eWxlPXtzdWJ0aXRsZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgIENsZWFuIHByb2R1Y3QgZGV0YWlsIHZpZXcgd2l0aCBxdWljayBhY3Rpb25zIGFuZCByZWNvcmQgaW5mby5cclxuICAgICAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZHVjdC1zaG93LWluZm8tZ3JpZFwiXHJcbiAgICAgICAgICAgICAgICBzdHlsZT17aW5mb0dyaWRTdHlsZX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvQ2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PlByaWNlPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT57cHJpY2V9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvQ2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PlN0b2NrPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9WYWx1ZVN0eWxlfT57c3RvY2t9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvQ2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb0xhYmVsU3R5bGV9PlNLVTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvVmFsdWVTdHlsZX0+e3NrdX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9DYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvTGFiZWxTdHlsZX0+U2l6ZXM8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1ZhbHVlU3R5bGV9PntzaXplU3RvY2tFbnRyaWVzLmxlbmd0aH08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXthY3Rpb25Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICB7Y3VycmVudFVzZXJSb2xlICE9PSBcImFkbWluXCIgJiYgKFxyXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3ByaW1hcnlCdXR0b25TdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVPcmRlckNsaWNrfVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgQ3JlYXRlIE9yZGVyXHJcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17c2Vjb25kYXJ5QnV0dG9uU3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUVkaXRDbGlja31cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgRWRpdCBQcm9kdWN0XHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9kdWN0LXNob3ctbWV0YS1zY3JvbGxcIlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgbWFyZ2luVG9wOiBcIjIycHhcIixcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogXCIyMHB4XCIsXHJcbiAgICAgICAgICAgICAgICAgIGJvcmRlclRvcDogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjA4KVwiLFxyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImdyaWRcIixcclxuICAgICAgICAgICAgICAgICAgZ2FwOiBcIjE4cHhcIixcclxuICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+RGVzY3JpcHRpb248L2gyPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtkZXNjcmlwdGlvblN0eWxlfT57ZGVzY3JpcHRpb259PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5Qcm9kdWN0IERldGFpbHM8L2gyPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtkZXRhaWxzR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtkZXRhaWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17ZGV0YWlsTGFiZWxTdHlsZX0+Q2F0ZWdvcnk8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17ZGV0YWlsVmFsdWVTdHlsZX0+e2NhdGVnb3J5fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17ZGV0YWlsUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2RldGFpbExhYmVsU3R5bGV9PlNpemUgU3RvY2s8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17ZGV0YWlsVmFsdWVTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtzaXplU3RvY2tFbnRyaWVzLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8gc2l6ZVN0b2NrRW50cmllc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKChbc2l6ZSwgcXR5XSkgPT4gYCR7c2l6ZX06ICR7cXR5fWApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKFwiIHwgXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIk5vIHNpemUtd2lzZSBzdG9ja1wifVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtkZXRhaWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17ZGV0YWlsTGFiZWxTdHlsZX0+Q3JlYXRlZCBBdDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtkZXRhaWxWYWx1ZVN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdERhdGUocHJvZHVjdERhdGE/LmNyZWF0ZWRBdCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2RldGFpbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtkZXRhaWxMYWJlbFN0eWxlfT5VcGRhdGVkIEF0PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2RldGFpbFZhbHVlU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShwcm9kdWN0RGF0YT8udXBkYXRlZEF0KX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17ZGV0YWlsUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e2RldGFpbExhYmVsU3R5bGV9PlJlY29yZCBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtkZXRhaWxWYWx1ZVN0eWxlfT57cHJvZHVjdElkIHx8IFwiLVwifTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RTaG93O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgcGFnZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIyMHB4XCIsXHJcbiAgY29sb3I6IFwiIzExMTgyN1wiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2ZmZmZmZlwiLFxyXG59O1xyXG5cclxuY29uc3QgaGVhZGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgdGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgZm9udFNpemU6IFwiMzRweFwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEuMDgsXHJcbiAgY29sb3I6IFwiIzExMTgyN1wiLFxyXG59O1xyXG5cclxuY29uc3QgZGVzY1N0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBjb2xvcjogXCIjNjQ3NDhiXCIsXHJcbiAgZm9udFNpemU6IFwiMTRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgY2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxOHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMDgpXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZmZmZmZmXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTRweCAyOHB4IHJnYmEoMTUsIDIzLCA0MiwgMC4wOClcIixcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHNlY3Rpb25UaXRsZVN0eWxlID0ge1xyXG4gIG1hcmdpbjogXCIwIDAgMTRweCAwXCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjEyZW1cIixcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG59O1xyXG5cclxuY29uc3QgbGF5b3V0U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJtaW5tYXgoMzAwcHgsIDAuOTVmcikgbWlubWF4KDQyMHB4LCAxLjI1ZnIpXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHN0YWNrU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjE2cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGxhYmVsU3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMWVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICBjb2xvcjogXCIjNDc1NTY5XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbnB1dFN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjEwMCVcIixcclxuICBtaW5XaWR0aDogMCxcclxuICBib3hTaXppbmc6IFwiYm9yZGVyLWJveFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMTIpXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZmZmZmZmXCIsXHJcbiAgY29sb3I6IFwiIzExMTgyN1wiLFxyXG4gIHBhZGRpbmc6IFwiMTFweCAxM3B4XCIsXHJcbiAgZm9udFNpemU6IFwiMTRweFwiLFxyXG4gIGZvbnRGYW1pbHk6IFwiaW5oZXJpdFwiLFxyXG59O1xyXG5cclxuY29uc3Qgcm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIG1pbldpZHRoOiAwLFxyXG59O1xyXG5cclxuY29uc3QgZ3JpZDJTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcInJlcGVhdCgyLCBtaW5tYXgoMCwgMWZyKSlcIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwic3RhcnRcIixcclxufTtcclxuXHJcbmNvbnN0IGN1c3RvbWVySW5mb1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBjdXN0b21lclJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjhweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNywgMjQsIDM5LCAwLjA4KVwiLFxyXG59O1xyXG5cclxuY29uc3QgbXV0ZWRTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjNjQ3NDhiXCIsXHJcbn07XHJcblxyXG5jb25zdCBzdHJvbmdTdHlsZSA9IHtcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG4gIHRleHRBbGlnbjogXCJyaWdodFwiLFxyXG59O1xyXG5cclxuY29uc3QgbGluZUl0ZW1Sb3dTdHlsZSA9IHtcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTcsIDI0LCAzOSwgMC4xMilcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTRweFwiLFxyXG4gIHBhZGRpbmc6IFwiMTJweFwiLFxyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBsaW5lSXRlbVRvcFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIGF1dG9cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBwcm9kdWN0UHJldmlld1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiNTZweCAxZnJcIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjU2cHhcIixcclxuICBoZWlnaHQ6IFwiNTZweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZTVlN2ViXCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMTIpXCIsXHJcbn07XHJcblxyXG5jb25zdCBhZGRCdXR0b25TdHlsZSA9IHtcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoOTksIDEwMiwgMjQxLCAwLjM1KVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgcGFkZGluZzogXCI5cHggMTJweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2VlZjJmZlwiLFxyXG4gIGNvbG9yOiBcIiMzNzMwYTNcIixcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxufTtcclxuXHJcbmNvbnN0IHJlbW92ZUJ1dHRvblN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgI2ZjYTVhNVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgcGFkZGluZzogXCI4cHggMTBweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2ZlZTJlMlwiLFxyXG4gIGNvbG9yOiBcIiM5OTFiMWJcIixcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbn07XHJcblxyXG5jb25zdCB0b3RhbHNSb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgcGFkZGluZzogXCI3cHggMFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTcsIDI0LCAzOSwgMC4wOClcIixcclxufTtcclxuXHJcbmNvbnN0IHRvdGFsU3R5bGUgPSB7XHJcbiAgLi4udG90YWxzUm93U3R5bGUsXHJcbiAgZm9udFNpemU6IFwiMTdweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIm5vbmVcIixcclxuICBwYWRkaW5nVG9wOiBcIjEycHhcIixcclxufTtcclxuXHJcbmNvbnN0IGFjdGlvbkJhclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDFmclwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBhY3Rpb25CdXR0b25TdHlsZSA9IChwcmltYXJ5KSA9PiAoe1xyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYm9yZGVyOiBwcmltYXJ5ID8gXCJub25lXCIgOiBcIjFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMTIpXCIsXHJcbiAgcGFkZGluZzogXCIxMnB4IDE0cHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxuICBiYWNrZ3JvdW5kOiBwcmltYXJ5XHJcbiAgICA/IFwibGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzYzNjZmMSAwJSwgIzhiNWNmNiAxMDAlKVwiXHJcbiAgICA6IFwiI2ZmZmZmZlwiLFxyXG4gIGNvbG9yOiBwcmltYXJ5ID8gXCIjZmZmXCIgOiBcIiMxMTE4MjdcIixcclxufSk7XHJcblxyXG5jb25zdCBtYXBMaW5rU3R5bGUgPSB7XHJcbiAgY29sb3I6IFwiIzI1NjNlYlwiLFxyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsXHJcbn07XHJcblxyXG5jb25zdCBwYXltZW50T3B0aW9uR3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDFmclwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBwYXltZW50T3B0aW9uU3R5bGUgPSAoYWN0aXZlKSA9PiAoe1xyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYm9yZGVyOiBhY3RpdmVcclxuICAgID8gXCIxcHggc29saWQgcmdiYSg5OSwgMTAyLCAyNDEsIDAuOSlcIlxyXG4gICAgOiBcIjFweCBzb2xpZCByZ2JhKDE3LCAyNCwgMzksIDAuMTIpXCIsXHJcbiAgYmFja2dyb3VuZDogYWN0aXZlID8gXCIjZWVmMmZmXCIgOiBcIiNmZmZmZmZcIixcclxuICBjb2xvcjogXCIjMTExODI3XCIsXHJcbiAgcGFkZGluZzogXCIxMHB4IDEycHhcIixcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIHRleHRBbGlnbjogXCJsZWZ0XCIsXHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbiAgZm9udFdlaWdodDogNzAwLFxyXG59KTtcclxuXHJcbmNvbnN0IHNlY3VyaXR5Q2hpcFdyYXBTdHlsZSA9IHtcclxuICBtYXJnaW5Ub3A6IFwiMTJweFwiLFxyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCI4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IHNlY3VyaXR5Q2hpcFN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgzNCwgMTk3LCA5NCwgMC40MilcIixcclxuICBib3JkZXJSYWRpdXM6IFwiOTk5cHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNlY2ZkZjNcIixcclxuICBjb2xvcjogXCIjMTY2NTM0XCIsXHJcbiAgcGFkZGluZzogXCI3cHggMTBweFwiLFxyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbiAgbGV0dGVyU3BhY2luZzogXCIwLjAzZW1cIixcclxufTtcclxuXHJcbmNvbnN0IHJlc3BvbnNpdmVDc3MgPSBgXHJcbi5jaGFuZ2U4LW9yZGVyLWdyaWQtMiB7XHJcbiAgZGlzcGxheTogZ3JpZCAhaW1wb3J0YW50O1xyXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgwLCAxZnIpKSAhaW1wb3J0YW50O1xyXG4gIGdhcDogMTBweCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4uY2hhbmdlOC1vcmRlci1ncmlkLTIgPiAqIHtcclxuICBtaW4td2lkdGg6IDAgIWltcG9ydGFudDtcclxufVxyXG5cclxuLmNoYW5nZTgtb3JkZXItZ3JpZC0yIGlucHV0LFxyXG4uY2hhbmdlOC1vcmRlci1ncmlkLTIgc2VsZWN0LFxyXG4uY2hhbmdlOC1vcmRlci1ncmlkLTIgdGV4dGFyZWEge1xyXG4gIHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XHJcbiAgbWluLXdpZHRoOiAwICFpbXBvcnRhbnQ7XHJcbiAgYm94LXNpemluZzogYm9yZGVyLWJveCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG5AbWVkaWEgKG1heC13aWR0aDogMTAyNHB4KSB7XHJcbiAgLmNoYW5nZTgtb3JkZXItbGF5b3V0IHtcclxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7XHJcbiAgfVxyXG59XHJcblxyXG5AbWVkaWEgKG1heC13aWR0aDogNzYwcHgpIHtcclxuICAuY2hhbmdlOC1vcmRlci1ncmlkLTIge1xyXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgIWltcG9ydGFudDtcclxuICB9XHJcbn1cclxuYDtcclxuXHJcbmNvbnN0IHBheW1lbnRPcHRpb25zID0gW1xyXG4gIHsgdmFsdWU6IFwiQ2FyZFwiLCBsYWJlbDogXCJDYXJkIFBheW1lbnRcIiwgaWNvbjogXCLwn5KzXCIgfSxcclxuICB7IHZhbHVlOiBcIkNhc2ggb24gRGVsaXZlcnlcIiwgbGFiZWw6IFwiQ2FzaCBvbiBEZWxpdmVyeVwiLCBpY29uOiBcIvCfk6ZcIiB9LFxyXG5dO1xyXG5cclxuY29uc3QgZmFsbGJhY2tTaXplT3B0aW9ucyA9IFtcIlhTXCIsIFwiU1wiLCBcIk1cIiwgXCJMXCIsIFwiWExcIiwgXCJYWExcIl07XHJcbmNvbnN0IHNoaXBwaW5nTWV0aG9kcyA9IFtcclxuICBcIlBpY2tNZSBGbGFzaFwiLFxyXG4gIFwiUHJvbnRvXCIsXHJcbiAgXCJEb21leFwiLFxyXG4gIFwiUmVnaXN0ZXJlZCBDb3VyaWVyXCIsXHJcbl07XHJcblxyXG5jb25zdCB0b051bWJlciA9ICh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IG51bSA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG51bSkgPyBudW0gOiAwO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0TW9uZXkgPSAodmFsdWUpID0+IHtcclxuICByZXR1cm4gYFJzLiAke3RvTnVtYmVyKHZhbHVlKS50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgcGFyc2VTaXplU3RvY2sgPSAodmFsdWUpID0+IHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4ge307XHJcbiAgfVxyXG5cclxuICBsZXQgc291cmNlID0gdmFsdWU7XHJcbiAgaWYgKHR5cGVvZiBzb3VyY2UgPT09IFwic3RyaW5nXCIpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHNvdXJjZSA9IEpTT04ucGFyc2Uoc291cmNlKTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICByZXR1cm4ge307XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoIXNvdXJjZSB8fCB0eXBlb2Ygc291cmNlICE9PSBcIm9iamVjdFwiIHx8IEFycmF5LmlzQXJyYXkoc291cmNlKSkge1xyXG4gICAgcmV0dXJuIHt9O1xyXG4gIH1cclxuXHJcbiAgY29uc3Qgbm9ybWFsaXplZCA9IHt9O1xyXG4gIGZvciAoY29uc3QgW3Jhd1NpemUsIHJhd1F0eV0gb2YgT2JqZWN0LmVudHJpZXMoc291cmNlKSkge1xyXG4gICAgY29uc3Qgc2l6ZSA9IFN0cmluZyhyYXdTaXplIHx8IFwiXCIpXHJcbiAgICAgIC50cmltKClcclxuICAgICAgLnRvVXBwZXJDYXNlKCk7XHJcbiAgICBpZiAoIXNpemUpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcXR5ID0gTWF0aC5tYXgoMCwgTWF0aC50cnVuYyhOdW1iZXIocmF3UXR5IHx8IDApKSk7XHJcbiAgICBub3JtYWxpemVkW3NpemVdID0gcXR5O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5vcm1hbGl6ZWQ7XHJcbn07XHJcblxyXG5jb25zdCBnZXRTaXplRW50cmllcyA9IChwcm9kdWN0KSA9PiB7XHJcbiAgY29uc3Qgc2l6ZVN0b2NrID0gcGFyc2VTaXplU3RvY2socHJvZHVjdD8uc2l6ZVN0b2NrKTtcclxuICByZXR1cm4gT2JqZWN0LmVudHJpZXMoc2l6ZVN0b2NrKVxyXG4gICAgLnNvcnQoKFthXSwgW2JdKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpXHJcbiAgICAubWFwKChbc2l6ZSwgcXR5XSkgPT4gKHsgc2l6ZSwgcXR5IH0pKTtcclxufTtcclxuXHJcbmNvbnN0IGdldFNpemVPcHRpb25zID0gKHByb2R1Y3QpID0+IHtcclxuICBjb25zdCBlbnRyaWVzID0gZ2V0U2l6ZUVudHJpZXMocHJvZHVjdCk7XHJcbiAgaWYgKGVudHJpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgcmV0dXJuIGVudHJpZXM7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmFsbGJhY2tTaXplT3B0aW9ucy5tYXAoKHNpemUpID0+ICh7IHNpemUsIHF0eTogbnVsbCB9KSk7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVFbXB0eUl0ZW0gPSAoKSA9PiAoe1xyXG4gIHByb2R1Y3RJZDogXCJcIixcclxuICBzaXplOiBcIlwiLFxyXG4gIHF1YW50aXR5OiAxLFxyXG4gIHVuaXRQcmljZTogMCxcclxufSk7XHJcblxyXG5jb25zdCBPcmRlckNyZWF0ZSA9ICgpID0+IHtcclxuICBjb25zdCBbdXNlcnMsIHNldFVzZXJzXSA9IHVzZVN0YXRlKFtdKTtcclxuICBjb25zdCBbcHJvZHVjdHMsIHNldFByb2R1Y3RzXSA9IHVzZVN0YXRlKFtdKTtcclxuICBjb25zdCBbb3JkZXJDb3VudEJ5VXNlciwgc2V0T3JkZXJDb3VudEJ5VXNlcl0gPSB1c2VTdGF0ZSh7fSk7XHJcbiAgY29uc3QgW3Nlc3Npb25Vc2VyLCBzZXRTZXNzaW9uVXNlcl0gPSB1c2VTdGF0ZShudWxsKTtcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICBjb25zdCBbc3VibWl0dGluZywgc2V0U3VibWl0dGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIGNvbnN0IFtmb3JtRGF0YSwgc2V0Rm9ybURhdGFdID0gdXNlU3RhdGUoe1xyXG4gICAgdXNlcklkOiBcIlwiLFxyXG4gICAgc3RhdHVzOiBcInBlbmRpbmdcIixcclxuICAgIHBheW1lbnRNZXRob2Q6IFwiQ2FyZFwiLFxyXG4gICAgcGF5bWVudFN0YXR1czogXCJwZW5kaW5nXCIsXHJcbiAgICB0cmFuc2FjdGlvbklkOiBcIlwiLFxyXG4gICAgc2hpcHBpbmdOYW1lOiBcIlwiLFxyXG4gICAgc2hpcHBpbmdQaG9uZTogXCJcIixcclxuICAgIHNoaXBwaW5nQWRkcmVzczogXCJcIixcclxuICAgIHNoaXBwaW5nTWV0aG9kOiBcIlBpY2tNZSBGbGFzaFwiLFxyXG4gICAgdHJhY2tpbmdOdW1iZXI6IFwiXCIsXHJcbiAgICBzaGlwcGluZ0ZlZTogMCxcclxuICAgIHRheDogMCxcclxuICAgIGRpc2NvdW50OiAwLFxyXG4gIH0pO1xyXG5cclxuICBjb25zdCBbbGluZUl0ZW1zLCBzZXRMaW5lSXRlbXNdID0gdXNlU3RhdGUoW2NyZWF0ZUVtcHR5SXRlbSgpXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICBjb25zdCBoYWRMb2dpbkNsYXNzT25Sb290ID0gcm9vdC5jbGFzc0xpc3QuY29udGFpbnMoXCJjaGFuZ2U4LWxvZ2luLXBhZ2VcIik7XHJcbiAgICBjb25zdCBoYWRMb2dpbkNsYXNzT25Cb2R5ID0gYm9keT8uY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2hhbmdlOC1sb2dpbi1wYWdlXCIpO1xyXG4gICAgY29uc3QgaGFkRGFzaGJvYXJkQ2xhc3NPblJvb3QgPSByb290LmNsYXNzTGlzdC5jb250YWlucyhcclxuICAgICAgXCJjaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2VcIixcclxuICAgICk7XHJcbiAgICBjb25zdCBoYWREYXNoYm9hcmRDbGFzc09uQm9keSA9IGJvZHk/LmNsYXNzTGlzdC5jb250YWlucyhcclxuICAgICAgXCJjaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2VcIixcclxuICAgICk7XHJcbiAgICBjb25zdCBsb2dpbkJnTGF5ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYW5nZTgtbG9naW4tYmctbGF5ZXJcIik7XHJcbiAgICBjb25zdCBwcmV2aW91c0xheWVyRGlzcGxheSA9IGxvZ2luQmdMYXllcj8uc3R5bGUuZGlzcGxheSB8fCBcIlwiO1xyXG5cclxuICAgIGNvbnN0IHNoZWxsTm9kZXMgPSBBcnJheS5mcm9tKFxyXG4gICAgICBuZXcgU2V0KFxyXG4gICAgICAgIFtcclxuICAgICAgICAgIHJvb3QsXHJcbiAgICAgICAgICBib2R5LFxyXG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcHBcIiksXHJcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10ZXN0aWQ9XCJsYXlvdXRcIl0nKSxcclxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWNzcz1cImxheW91dFwiXScpLFxyXG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hZG1pbmpzX0xheW91dFwiKSxcclxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpLFxyXG4gICAgICAgICAgLi4uQXJyYXkuZnJvbShcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICAgICAgICAgICAnW2RhdGEtY3NzKj1cImFjdGlvbi1jb250ZW50XCJdLCBbZGF0YS10ZXN0aWQqPVwiY29udGVudFwiXSwgLmFkbWluanNfTWFpbiwgLmFkbWluanNfTWFpbiA+IGRpdiwgLmFkbWluanNfTWFpbiA+IGRpdiA+IGRpdiwgW2RhdGEtY3NzJD1cIi1jb250ZW50XCJdJyxcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICksXHJcbiAgICAgICAgXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgICAgICksXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHByZXZpb3VzSW5saW5lQmFja2dyb3VuZHMgPSBuZXcgTWFwKFxyXG4gICAgICBzaGVsbE5vZGVzLm1hcCgobm9kZSkgPT4gW1xyXG4gICAgICAgIG5vZGUsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogbm9kZS5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiYmFja2dyb3VuZFwiKSxcclxuICAgICAgICAgIGJhY2tncm91bmRQcmlvcml0eTogbm9kZS5zdHlsZS5nZXRQcm9wZXJ0eVByaW9yaXR5KFwiYmFja2dyb3VuZFwiKSxcclxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogbm9kZS5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwiYmFja2dyb3VuZC1jb2xvclwiKSxcclxuICAgICAgICAgIGJhY2tncm91bmRDb2xvclByaW9yaXR5OlxyXG4gICAgICAgICAgICBub2RlLnN0eWxlLmdldFByb3BlcnR5UHJpb3JpdHkoXCJiYWNrZ3JvdW5kLWNvbG9yXCIpLFxyXG4gICAgICAgICAgYmFja2dyb3VuZEltYWdlOiBub2RlLnN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCJiYWNrZ3JvdW5kLWltYWdlXCIpLFxyXG4gICAgICAgICAgYmFja2dyb3VuZEltYWdlUHJpb3JpdHk6XHJcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuZ2V0UHJvcGVydHlQcmlvcml0eShcImJhY2tncm91bmQtaW1hZ2VcIiksXHJcbiAgICAgICAgfSxcclxuICAgICAgXSksXHJcbiAgICApO1xyXG5cclxuICAgIHJvb3QuY2xhc3NMaXN0LnJlbW92ZShcclxuICAgICAgXCJjaGFuZ2U4LWxvZ2luLXBhZ2VcIixcclxuICAgICAgXCJjaGFuZ2U4LXN0b3JlZnJvbnQtZGFzaGJvYXJkLXBhZ2VcIixcclxuICAgICk7XHJcbiAgICBib2R5Py5jbGFzc0xpc3QucmVtb3ZlKFxyXG4gICAgICBcImNoYW5nZTgtbG9naW4tcGFnZVwiLFxyXG4gICAgICBcImNoYW5nZTgtc3RvcmVmcm9udC1kYXNoYm9hcmQtcGFnZVwiLFxyXG4gICAgKTtcclxuICAgIGlmIChsb2dpbkJnTGF5ZXIpIHtcclxuICAgICAgbG9naW5CZ0xheWVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH1cclxuXHJcbiAgICBzaGVsbE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcclxuICAgICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShcImJhY2tncm91bmRcIiwgXCIjZmZmZmZmXCIsIFwiaW1wb3J0YW50XCIpO1xyXG4gICAgICBub2RlLnN0eWxlLnNldFByb3BlcnR5KFwiYmFja2dyb3VuZC1jb2xvclwiLCBcIiNmZmZmZmZcIiwgXCJpbXBvcnRhbnRcIik7XHJcbiAgICAgIG5vZGUuc3R5bGUuc2V0UHJvcGVydHkoXCJiYWNrZ3JvdW5kLWltYWdlXCIsIFwibm9uZVwiLCBcImltcG9ydGFudFwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJvb3QuY2xhc3NMaXN0LmFkZChcImNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZVwiKTtcclxuICAgIGJvZHk/LmNsYXNzTGlzdC5hZGQoXCJjaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmVcIik7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgcm9vdC5jbGFzc0xpc3QucmVtb3ZlKFwiY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlXCIpO1xyXG4gICAgICBib2R5Py5jbGFzc0xpc3QucmVtb3ZlKFwiY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlXCIpO1xyXG5cclxuICAgICAgaWYgKGhhZExvZ2luQ2xhc3NPblJvb3QpIHtcclxuICAgICAgICByb290LmNsYXNzTGlzdC5hZGQoXCJjaGFuZ2U4LWxvZ2luLXBhZ2VcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChoYWRMb2dpbkNsYXNzT25Cb2R5KSB7XHJcbiAgICAgICAgYm9keT8uY2xhc3NMaXN0LmFkZChcImNoYW5nZTgtbG9naW4tcGFnZVwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGhhZERhc2hib2FyZENsYXNzT25Sb290KSB7XHJcbiAgICAgICAgcm9vdC5jbGFzc0xpc3QuYWRkKFwiY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaGFkRGFzaGJvYXJkQ2xhc3NPbkJvZHkpIHtcclxuICAgICAgICBib2R5Py5jbGFzc0xpc3QuYWRkKFwiY2hhbmdlOC1zdG9yZWZyb250LWRhc2hib2FyZC1wYWdlXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobG9naW5CZ0xheWVyKSB7XHJcbiAgICAgICAgbG9naW5CZ0xheWVyLnN0eWxlLmRpc3BsYXkgPSBwcmV2aW91c0xheWVyRGlzcGxheTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcHJldmlvdXNJbmxpbmVCYWNrZ3JvdW5kcy5mb3JFYWNoKChzdHlsZXMsIG5vZGUpID0+IHtcclxuICAgICAgICBpZiAoIXN0eWxlcy5iYWNrZ3JvdW5kKSB7XHJcbiAgICAgICAgICBub2RlLnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZFwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kXCIsXHJcbiAgICAgICAgICAgIHN0eWxlcy5iYWNrZ3JvdW5kLFxyXG4gICAgICAgICAgICBzdHlsZXMuYmFja2dyb3VuZFByaW9yaXR5IHx8IFwiXCIsXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzdHlsZXMuYmFja2dyb3VuZENvbG9yKSB7XHJcbiAgICAgICAgICBub2RlLnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiYmFja2dyb3VuZC1jb2xvclwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCIsXHJcbiAgICAgICAgICAgIHN0eWxlcy5iYWNrZ3JvdW5kQ29sb3IsXHJcbiAgICAgICAgICAgIHN0eWxlcy5iYWNrZ3JvdW5kQ29sb3JQcmlvcml0eSB8fCBcIlwiLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghc3R5bGVzLmJhY2tncm91bmRJbWFnZSkge1xyXG4gICAgICAgICAgbm9kZS5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImJhY2tncm91bmQtaW1hZ2VcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5vZGUuc3R5bGUuc2V0UHJvcGVydHkoXHJcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZC1pbWFnZVwiLFxyXG4gICAgICAgICAgICBzdHlsZXMuYmFja2dyb3VuZEltYWdlLFxyXG4gICAgICAgICAgICBzdHlsZXMuYmFja2dyb3VuZEltYWdlUHJpb3JpdHkgfHwgXCJcIixcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcclxuICAgIGNvbnN0IHByZVByb2R1Y3RJZCA9IHBhcmFtcy5nZXQoXCJwcm9kdWN0SWRcIikgfHwgXCJcIjtcclxuXHJcbiAgICBjb25zdCBmZXRjaERhdGEgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgY29udGV4dFJlcyA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9jb250ZXh0L29yZGVyLWNyZWF0ZSR7XHJcbiAgICAgICAgICAgIHByZVByb2R1Y3RJZCA/IGA/cHJvZHVjdElkPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHByZVByb2R1Y3RJZCl9YCA6IFwiXCJcclxuICAgICAgICAgIH1gLFxyXG4gICAgICAgICAgeyBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGV4dERhdGEgPSBjb250ZXh0UmVzLm9rID8gYXdhaXQgY29udGV4dFJlcy5qc29uKCkgOiB7fTtcclxuXHJcbiAgICAgICAgY29uc3QgdXNlcnNEYXRhID0gQXJyYXkuaXNBcnJheShjb250ZXh0RGF0YT8udXNlcnMpXHJcbiAgICAgICAgICA/IGNvbnRleHREYXRhLnVzZXJzXHJcbiAgICAgICAgICA6IFtdO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RzTGlzdCA9IEFycmF5LmlzQXJyYXkoY29udGV4dERhdGE/LnByb2R1Y3RzKVxyXG4gICAgICAgICAgPyBjb250ZXh0RGF0YS5wcm9kdWN0c1xyXG4gICAgICAgICAgOiBbXTtcclxuXHJcbiAgICAgICAgc2V0VXNlcnModXNlcnNEYXRhKTtcclxuICAgICAgICBzZXRQcm9kdWN0cyhwcm9kdWN0c0xpc3QpO1xyXG4gICAgICAgIHNldE9yZGVyQ291bnRCeVVzZXIoY29udGV4dERhdGE/Lm9yZGVyQ291bnRCeVVzZXIgfHwge30pO1xyXG4gICAgICAgIHNldFNlc3Npb25Vc2VyKGNvbnRleHREYXRhPy5jdXJyZW50VXNlciB8fCBudWxsKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHREYXRhPy5jdXJyZW50VXNlcj8uaWQpIHtcclxuICAgICAgICAgIHNldEZvcm1EYXRhKChwcmV2KSA9PiAoe1xyXG4gICAgICAgICAgICAuLi5wcmV2LFxyXG4gICAgICAgICAgICB1c2VySWQ6IHByZXYudXNlcklkIHx8IFN0cmluZyhjb250ZXh0RGF0YS5jdXJyZW50VXNlci5pZCksXHJcbiAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY29udGV4dERhdGE/LnNlbGVjdGVkUHJvZHVjdD8uaWQpIHtcclxuICAgICAgICAgIGNvbnN0IHNlbGVjdGVkUHJvZHVjdFNpemVPcHRpb25zID0gZ2V0U2l6ZU9wdGlvbnMoXHJcbiAgICAgICAgICAgIGNvbnRleHREYXRhLnNlbGVjdGVkUHJvZHVjdCxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBzZXRMaW5lSXRlbXMoW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgcHJvZHVjdElkOiBTdHJpbmcoY29udGV4dERhdGEuc2VsZWN0ZWRQcm9kdWN0LmlkKSxcclxuICAgICAgICAgICAgICBzaXplOiBzZWxlY3RlZFByb2R1Y3RTaXplT3B0aW9uc1swXT8uc2l6ZSB8fCBcIlwiLFxyXG4gICAgICAgICAgICAgIHF1YW50aXR5OiAxLFxyXG4gICAgICAgICAgICAgIHVuaXRQcmljZTogdG9OdW1iZXIoY29udGV4dERhdGEuc2VsZWN0ZWRQcm9kdWN0LnByaWNlKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgcHJlUHJvZHVjdElkICYmXHJcbiAgICAgICAgICBwcm9kdWN0c0xpc3Quc29tZSgocCkgPT4gU3RyaW5nKHAuaWQpID09PSBTdHJpbmcocHJlUHJvZHVjdElkKSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnN0IHNlbGVjdGVkID0gcHJvZHVjdHNMaXN0LmZpbmQoXHJcbiAgICAgICAgICAgIChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhwcmVQcm9kdWN0SWQpLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIGNvbnN0IHNlbGVjdGVkUHJvZHVjdFNpemVPcHRpb25zID0gZ2V0U2l6ZU9wdGlvbnMoc2VsZWN0ZWQpO1xyXG4gICAgICAgICAgc2V0TGluZUl0ZW1zKFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHByb2R1Y3RJZDogU3RyaW5nKHByZVByb2R1Y3RJZCksXHJcbiAgICAgICAgICAgICAgc2l6ZTogc2VsZWN0ZWRQcm9kdWN0U2l6ZU9wdGlvbnNbMF0/LnNpemUgfHwgXCJcIixcclxuICAgICAgICAgICAgICBxdWFudGl0eTogMSxcclxuICAgICAgICAgICAgICB1bml0UHJpY2U6IHRvTnVtYmVyKHNlbGVjdGVkPy5wcmljZSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZmV0Y2hEYXRhKCk7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCBzZWxlY3RlZEN1c3RvbWVyID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICByZXR1cm4gdXNlcnMuZmluZCgodSkgPT4gU3RyaW5nKHUuaWQpID09PSBTdHJpbmcoZm9ybURhdGEudXNlcklkKSkgfHwgbnVsbDtcclxuICB9LCBbdXNlcnMsIGZvcm1EYXRhLnVzZXJJZF0pO1xyXG5cclxuICBjb25zdCBjdXN0b21lck9yZGVyQ291bnQgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGlmICghc2VsZWN0ZWRDdXN0b21lcikge1xyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gTnVtYmVyKG9yZGVyQ291bnRCeVVzZXJbU3RyaW5nKHNlbGVjdGVkQ3VzdG9tZXIuaWQpXSB8fCAwKTtcclxuICB9LCBbb3JkZXJDb3VudEJ5VXNlciwgc2VsZWN0ZWRDdXN0b21lcl0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKCFzZWxlY3RlZEN1c3RvbWVyKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRGb3JtRGF0YSgocHJldikgPT4gKHtcclxuICAgICAgLi4ucHJldixcclxuICAgICAgc2hpcHBpbmdOYW1lOiBwcmV2LnNoaXBwaW5nTmFtZSB8fCBzZWxlY3RlZEN1c3RvbWVyLm5hbWUgfHwgXCJcIixcclxuICAgICAgc2hpcHBpbmdQaG9uZTpcclxuICAgICAgICBwcmV2LnNoaXBwaW5nUGhvbmUgfHxcclxuICAgICAgICBzZWxlY3RlZEN1c3RvbWVyLnBob25lIHx8XHJcbiAgICAgICAgc2VsZWN0ZWRDdXN0b21lci5tb2JpbGUgfHxcclxuICAgICAgICBcIlwiLFxyXG4gICAgfSkpO1xyXG4gIH0sIFtzZWxlY3RlZEN1c3RvbWVyXSk7XHJcblxyXG4gIGNvbnN0IGxpbmVUb3RhbHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IHN1YnRvdGFsID0gbGluZUl0ZW1zLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiB7XHJcbiAgICAgIHJldHVybiBzdW0gKyB0b051bWJlcihpdGVtLnF1YW50aXR5KSAqIHRvTnVtYmVyKGl0ZW0udW5pdFByaWNlKTtcclxuICAgIH0sIDApO1xyXG5cclxuICAgIGNvbnN0IHNoaXBwaW5nRmVlID0gdG9OdW1iZXIoZm9ybURhdGEuc2hpcHBpbmdGZWUpO1xyXG4gICAgY29uc3QgdGF4ID0gdG9OdW1iZXIoZm9ybURhdGEudGF4KTtcclxuICAgIGNvbnN0IGRpc2NvdW50ID0gdG9OdW1iZXIoZm9ybURhdGEuZGlzY291bnQpO1xyXG4gICAgY29uc3QgZ3JhbmRUb3RhbCA9IE1hdGgubWF4KHN1YnRvdGFsICsgc2hpcHBpbmdGZWUgKyB0YXggLSBkaXNjb3VudCwgMCk7XHJcblxyXG4gICAgcmV0dXJuIHsgc3VidG90YWwsIHNoaXBwaW5nRmVlLCB0YXgsIGRpc2NvdW50LCBncmFuZFRvdGFsIH07XHJcbiAgfSwgW2xpbmVJdGVtcywgZm9ybURhdGEuc2hpcHBpbmdGZWUsIGZvcm1EYXRhLnRheCwgZm9ybURhdGEuZGlzY291bnRdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlRm9ybUNoYW5nZSA9IChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgeyBuYW1lLCB2YWx1ZSB9ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgc2V0Rm9ybURhdGEoKHByZXYpID0+ICh7IC4uLnByZXYsIFtuYW1lXTogdmFsdWUgfSkpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZUxpbmVJdGVtQ2hhbmdlID0gKGluZGV4LCBrZXksIHZhbHVlKSA9PiB7XHJcbiAgICBzZXRMaW5lSXRlbXMoKHByZXYpID0+IHtcclxuICAgICAgY29uc3QgbmV4dCA9IFsuLi5wcmV2XTtcclxuICAgICAgY29uc3QgaXRlbSA9IHsgLi4ubmV4dFtpbmRleF0gfTtcclxuXHJcbiAgICAgIGlmIChrZXkgPT09IFwicHJvZHVjdElkXCIpIHtcclxuICAgICAgICBpdGVtLnByb2R1Y3RJZCA9IHZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyh2YWx1ZSkpO1xyXG4gICAgICAgIGNvbnN0IHNpemVPcHRpb25zID0gZ2V0U2l6ZU9wdGlvbnMocHJvZHVjdCk7XHJcbiAgICAgICAgaXRlbS51bml0UHJpY2UgPSB0b051bWJlcihwcm9kdWN0Py5wcmljZSk7XHJcbiAgICAgICAgaXRlbS5zaXplID0gc2l6ZU9wdGlvbnNbMF0/LnNpemUgfHwgXCJcIjtcclxuICAgICAgICBjb25zdCBtYXhRdHlGb3JTaXplID1cclxuICAgICAgICAgIHNpemVPcHRpb25zWzBdPy5xdHkgPT09IG51bGxcclxuICAgICAgICAgICAgPyBudWxsXHJcbiAgICAgICAgICAgIDogTWF0aC5tYXgoMSwgTnVtYmVyKHNpemVPcHRpb25zWzBdPy5xdHkgfHwgMCkpO1xyXG4gICAgICAgIGlmIChtYXhRdHlGb3JTaXplICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBpdGVtLnF1YW50aXR5ID0gTWF0aC5tYXgoXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIE1hdGgubWluKHRvTnVtYmVyKGl0ZW0ucXVhbnRpdHkpLCBtYXhRdHlGb3JTaXplKSxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJzaXplXCIpIHtcclxuICAgICAgICBpdGVtLnNpemUgPSB2YWx1ZTtcclxuICAgICAgICBjb25zdCBwcm9kdWN0ID0gcHJvZHVjdHMuZmluZChcclxuICAgICAgICAgIChwKSA9PiBTdHJpbmcocC5pZCkgPT09IFN0cmluZyhpdGVtLnByb2R1Y3RJZCksXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBzaXplT3B0aW9ucyA9IGdldFNpemVPcHRpb25zKHByb2R1Y3QpO1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkU2l6ZU9wdGlvbiA9IHNpemVPcHRpb25zLmZpbmQoXHJcbiAgICAgICAgICAob3B0aW9uKSA9PiBvcHRpb24uc2l6ZSA9PT0gdmFsdWUsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAoc2VsZWN0ZWRTaXplT3B0aW9uICYmIHNlbGVjdGVkU2l6ZU9wdGlvbi5xdHkgIT09IG51bGwpIHtcclxuICAgICAgICAgIGNvbnN0IG1heFF0eUZvclNpemUgPSBNYXRoLm1heChcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgTnVtYmVyKHNlbGVjdGVkU2l6ZU9wdGlvbi5xdHkgfHwgMCksXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgaXRlbS5xdWFudGl0eSA9IE1hdGgubWF4KFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICBNYXRoLm1pbih0b051bWJlcihpdGVtLnF1YW50aXR5KSwgbWF4UXR5Rm9yU2l6ZSksXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwicXVhbnRpdHlcIikge1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKFxyXG4gICAgICAgICAgKHApID0+IFN0cmluZyhwLmlkKSA9PT0gU3RyaW5nKGl0ZW0ucHJvZHVjdElkKSxcclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IHNpemVPcHRpb25zID0gZ2V0U2l6ZU9wdGlvbnMocHJvZHVjdCk7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRTaXplT3B0aW9uID0gc2l6ZU9wdGlvbnMuZmluZChcclxuICAgICAgICAgIChvcHRpb24pID0+IG9wdGlvbi5zaXplID09PSBpdGVtLnNpemUsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBwYXJzZWRRdHkgPSBNYXRoLm1heCgxLCB0b051bWJlcih2YWx1ZSkpO1xyXG4gICAgICAgIGlmIChzZWxlY3RlZFNpemVPcHRpb24gJiYgc2VsZWN0ZWRTaXplT3B0aW9uLnF0eSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgY29uc3QgbWF4UXR5Rm9yU2l6ZSA9IE1hdGgubWF4KFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICBOdW1iZXIoc2VsZWN0ZWRTaXplT3B0aW9uLnF0eSB8fCAwKSxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBpdGVtLnF1YW50aXR5ID0gTWF0aC5taW4ocGFyc2VkUXR5LCBtYXhRdHlGb3JTaXplKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbS5xdWFudGl0eSA9IHBhcnNlZFF0eTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInVuaXRQcmljZVwiKSB7XHJcbiAgICAgICAgaXRlbS51bml0UHJpY2UgPSBNYXRoLm1heCgwLCB0b051bWJlcih2YWx1ZSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBuZXh0W2luZGV4XSA9IGl0ZW07XHJcbiAgICAgIHJldHVybiBuZXh0O1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYWRkTGluZUl0ZW0gPSAoKSA9PiB7XHJcbiAgICBzZXRMaW5lSXRlbXMoKHByZXYpID0+IFsuLi5wcmV2LCBjcmVhdGVFbXB0eUl0ZW0oKV0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlbW92ZUxpbmVJdGVtID0gKGluZGV4KSA9PiB7XHJcbiAgICBzZXRMaW5lSXRlbXMoKHByZXYpID0+IHtcclxuICAgICAgaWYgKHByZXYubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIHByZXY7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBwcmV2LmZpbHRlcigoXywgaSkgPT4gaSAhPT0gaW5kZXgpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgbWFwc0hyZWYgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGlmICghZm9ybURhdGEuc2hpcHBpbmdBZGRyZXNzPy50cmltKCkpIHtcclxuICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGBodHRwczovL3d3dy5nb29nbGUuY29tL21hcHMvc2VhcmNoLz9hcGk9MSZxdWVyeT0ke2VuY29kZVVSSUNvbXBvbmVudChmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3MudHJpbSgpKX1gO1xyXG4gIH0sIFtmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3NdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlU3VibWl0ID0gYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGNvbnN0IHZhbGlkSXRlbXMgPSBsaW5lSXRlbXMuZmlsdGVyKFxyXG4gICAgICAoaXRlbSkgPT4gaXRlbS5wcm9kdWN0SWQgJiYgdG9OdW1iZXIoaXRlbS5xdWFudGl0eSkgPiAwLFxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoIWZvcm1EYXRhLnVzZXJJZCkge1xyXG4gICAgICBhbGVydChcIlBsZWFzZSBzZWxlY3QgYSBjdXN0b21lci5cIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmFsaWRJdGVtcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgYWxlcnQoXCJBdCBsZWFzdCBvbmUgcHJvZHVjdCBsaW5lIGl0ZW0gaXMgcmVxdWlyZWQuXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHZhbGlkSXRlbXMpIHtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRQcm9kdWN0ID0gcHJvZHVjdHMuZmluZChcclxuICAgICAgICAocHJvZHVjdCkgPT4gU3RyaW5nKHByb2R1Y3QuaWQpID09PSBTdHJpbmcoaXRlbS5wcm9kdWN0SWQpLFxyXG4gICAgICApO1xyXG4gICAgICBjb25zdCBzaXplRW50cmllcyA9IGdldFNpemVFbnRyaWVzKHNlbGVjdGVkUHJvZHVjdCk7XHJcblxyXG4gICAgICBpZiAoc2l6ZUVudHJpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGlmICghaXRlbS5zaXplKSB7XHJcbiAgICAgICAgICBhbGVydChcIlBsZWFzZSBzZWxlY3QgYSBzaXplIGZvciBhbGwgcHJvZHVjdHMuXCIpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRTaXplID0gc2l6ZUVudHJpZXMuZmluZChcclxuICAgICAgICAgIChlbnRyeSkgPT4gZW50cnkuc2l6ZSA9PT0gU3RyaW5nKGl0ZW0uc2l6ZSkudG9VcHBlckNhc2UoKSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoIXNlbGVjdGVkU2l6ZSkge1xyXG4gICAgICAgICAgYWxlcnQoXHJcbiAgICAgICAgICAgIGBTZWxlY3RlZCBzaXplIGlzIG5vdCBhdmFpbGFibGUgZm9yICR7c2VsZWN0ZWRQcm9kdWN0Py5uYW1lIHx8IFwidGhpcyBwcm9kdWN0XCJ9LmAsXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRvTnVtYmVyKGl0ZW0ucXVhbnRpdHkpID4gc2VsZWN0ZWRTaXplLnF0eSkge1xyXG4gICAgICAgICAgYWxlcnQoXHJcbiAgICAgICAgICAgIGAke3NlbGVjdGVkUHJvZHVjdD8ubmFtZSB8fCBcIlByb2R1Y3RcIn0gKCR7c2VsZWN0ZWRTaXplLnNpemV9KSBoYXMgb25seSAke3NlbGVjdGVkU2l6ZS5xdHl9IGluIHN0b2NrLmAsXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldFN1Ym1pdHRpbmcodHJ1ZSk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgb3JkZXJQYXlsb2FkID0ge1xyXG4gICAgICAgIHVzZXJJZDogTnVtYmVyKGZvcm1EYXRhLnVzZXJJZCksXHJcbiAgICAgICAgc3RhdHVzOiBmb3JtRGF0YS5zdGF0dXMsXHJcbiAgICAgICAgcGF5bWVudE1ldGhvZDogZm9ybURhdGEucGF5bWVudE1ldGhvZCxcclxuICAgICAgICBwYXltZW50U3RhdHVzOiBmb3JtRGF0YS5wYXltZW50U3RhdHVzLFxyXG4gICAgICAgIHRyYW5zYWN0aW9uSWQ6IGZvcm1EYXRhLnRyYW5zYWN0aW9uSWQgfHwgbnVsbCxcclxuICAgICAgICBzaGlwcGluZ05hbWU6IGZvcm1EYXRhLnNoaXBwaW5nTmFtZSB8fCBudWxsLFxyXG4gICAgICAgIHNoaXBwaW5nUGhvbmU6IGZvcm1EYXRhLnNoaXBwaW5nUGhvbmUgfHwgbnVsbCxcclxuICAgICAgICBzaGlwcGluZ01ldGhvZDogZm9ybURhdGEuc2hpcHBpbmdNZXRob2QsXHJcbiAgICAgICAgdHJhY2tpbmdOdW1iZXI6IGZvcm1EYXRhLnRyYWNraW5nTnVtYmVyIHx8IG51bGwsXHJcbiAgICAgICAgc3VidG90YWw6IGxpbmVUb3RhbHMuc3VidG90YWwudG9GaXhlZCgyKSxcclxuICAgICAgICBzaGlwcGluZ0ZlZTogbGluZVRvdGFscy5zaGlwcGluZ0ZlZS50b0ZpeGVkKDIpLFxyXG4gICAgICAgIHRheDogbGluZVRvdGFscy50YXgudG9GaXhlZCgyKSxcclxuICAgICAgICBkaXNjb3VudDogbGluZVRvdGFscy5kaXNjb3VudC50b0ZpeGVkKDIpLFxyXG4gICAgICAgIHRvdGFsQW1vdW50OiBsaW5lVG90YWxzLmdyYW5kVG90YWwudG9GaXhlZCgyKSxcclxuICAgICAgICBzaGlwcGluZ0FkZHJlc3M6IGZvcm1EYXRhLnNoaXBwaW5nQWRkcmVzcyB8fCBudWxsLFxyXG4gICAgICAgIGxpbmVJdGVtczogdmFsaWRJdGVtcy5tYXAoKGl0ZW0pID0+ICh7XHJcbiAgICAgICAgICBwcm9kdWN0SWQ6IE51bWJlcihpdGVtLnByb2R1Y3RJZCksXHJcbiAgICAgICAgICBzaXplOiBpdGVtLnNpemUgfHwgbnVsbCxcclxuICAgICAgICAgIHF1YW50aXR5OiBNYXRoLm1heCgxLCB0b051bWJlcihpdGVtLnF1YW50aXR5KSksXHJcbiAgICAgICAgICB1bml0UHJpY2U6IE1hdGgubWF4KDAsIHRvTnVtYmVyKGl0ZW0udW5pdFByaWNlKSkudG9GaXhlZCgyKSxcclxuICAgICAgICB9KSksXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBzdWJtaXRGb3JtID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgIHN1Ym1pdEZvcm0uYXBwZW5kKFwicGF5bG9hZFwiLCBKU09OLnN0cmluZ2lmeShvcmRlclBheWxvYWQpKTtcclxuXHJcbiAgICAgIGNvbnN0IG9yZGVyUmVzID0gYXdhaXQgZmV0Y2goXCIvYWRtaW4vY29udGV4dC9vcmRlci1jcmVhdGUvc3VibWl0XCIsIHtcclxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXHJcbiAgICAgICAgYm9keTogc3VibWl0Rm9ybSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBvcmRlckRhdGEgPSBhd2FpdCBvcmRlclJlcy5qc29uKCk7XHJcbiAgICAgIGlmICghb3JkZXJSZXMub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3Iob3JkZXJEYXRhPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGNyZWF0ZSBvcmRlclwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbihcclxuICAgICAgICBgL2FkbWluL3Jlc291cmNlcy9PcmRlcnMvcmVjb3Jkcy8ke29yZGVyRGF0YS5pZH0vc2hvd2AsXHJcbiAgICAgICk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBhbGVydChlcnJvci5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGNyZWF0ZSBvcmRlclwiKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNldFN1Ym1pdHRpbmcoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+e2BcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBib2R5LFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlICNhcHAsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgLmFkbWluanNfTGF5b3V0LFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLXRlc3RpZD1cImxheW91dFwiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS1jc3M9XCJsYXlvdXRcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgbWFpbixcclxuICAgICAgICBib2R5LmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSxcclxuICAgICAgICBib2R5LmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSAjYXBwLFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIC5hZG1pbmpzX0xheW91dCxcclxuICAgICAgICBib2R5LmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS10ZXN0aWQ9XCJsYXlvdXRcIl0sXHJcbiAgICAgICAgYm9keS5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtY3NzPVwibGF5b3V0XCJdLFxyXG4gICAgICAgIGJvZHkuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIG1haW4ge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogI2ZmZmZmZiAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZiAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgI2FwcCA+IGRpdixcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSAjYXBwID4gZGl2ID4gZGl2LFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlICNhcHAgPiBkaXYgPiBkaXYgPiBkaXYsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgLmFkbWluanNfTWFpbixcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSAuYWRtaW5qc19NYWluID4gZGl2LFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIC5hZG1pbmpzX01haW4gPiBkaXYgPiBkaXYsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtY3NzKj1cImFjdGlvbi1jb250ZW50XCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLXRlc3RpZCo9XCJjb250ZW50XCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLWNzcyQ9XCItY29udGVudFwiXSB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS10ZXN0aWQ9XCJzaWRlYmFyXCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIC5hZG1pbmpzX1NpZGViYXIsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgc2VjdGlvbltkYXRhLWNzcz1cInNpZGViYXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgYXNpZGVbZGF0YS1jc3M9XCJzaWRlYmFyXCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIG5hdltkYXRhLWNzcz1cInNpZGViYXJcIl0ge1xyXG4gICAgICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgd2lkdGg6IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIG1pbi13aWR0aDogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgbWF4LXdpZHRoOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcclxuICAgICAgICAgIGJvcmRlcjogMCAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbiAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgYm94LXNoYWRvdzogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtdGVzdGlkPVwidG9wYmFyXCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIC5hZG1pbmpzX1RvcEJhcixcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBoZWFkZXJbZGF0YS1jc3M9XCJ0b3BiYXJcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgc2VjdGlvbltkYXRhLWNzcz1cInRvcGJhclwiXSB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS10ZXN0aWQ9XCJhY3Rpb24taGVhZGVyXCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLWNzcyo9XCJhY3Rpb24taGVhZGVyXCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLXRlc3RpZCo9XCJicmVhZGNydW1ic1wiXSxcclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSBbZGF0YS1jc3MqPVwiYnJlYWRjcnVtYnNcIl0sXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgLmFkbWluanNfQnJlYWRjcnVtYiB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sLmNoYW5nZTgtb3JkZXItY3JlYXRlLWFjdGl2ZSAuYWRtaW5qc19MYXlvdXQsXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlIFtkYXRhLWNzcz1cImxheW91dFwiXSB7XHJcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgLmFkbWluanNfTGF5b3V0ID4gKjpub3QoW2RhdGEtdGVzdGlkPVwic2lkZWJhclwiXSksXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtdGVzdGlkPVwibGF5b3V0XCJdID4gKjpub3QoW2RhdGEtdGVzdGlkPVwic2lkZWJhclwiXSksXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgW2RhdGEtY3NzPVwibGF5b3V0XCJdID4gKjpub3QoW2RhdGEtdGVzdGlkPVwic2lkZWJhclwiXSkge1xyXG4gICAgICAgICAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxuICAgICAgICAgIG1heC13aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbC5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmUgYm9keTo6YmVmb3JlLFxyXG4gICAgICAgIGh0bWwuY2hhbmdlOC1vcmRlci1jcmVhdGUtYWN0aXZlOjpiZWZvcmUsXHJcbiAgICAgICAgYm9keS5jaGFuZ2U4LW9yZGVyLWNyZWF0ZS1hY3RpdmU6OmJlZm9yZSB7XHJcbiAgICAgICAgICBjb250ZW50OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiBub25lICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAke3Jlc3BvbnNpdmVDc3N9XHJcbiAgICAgIGB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxmb3JtIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9IHN0eWxlPXt7IGRpc3BsYXk6IFwiZ3JpZFwiLCBnYXA6IFwiMTZweFwiIH19PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1sYXlvdXRcIiBzdHlsZT17bGF5b3V0U3R5bGV9PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17c3RhY2tTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+Q3VzdG9tZXIgRGV0YWlsczwvaDI+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+U2VsZWN0IEN1c3RvbWVyICo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICBuYW1lPVwidXNlcklkXCJcclxuICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnVzZXJJZH1cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17bG9hZGluZyB8fCBzZXNzaW9uVXNlcj8ucm9sZSA9PT0gXCJ1c2VyXCJ9XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5cclxuICAgICAgICAgICAgICAgICAgICB7bG9hZGluZyA/IFwiTG9hZGluZyBjdXN0b21lcnMuLi5cIiA6IFwiU2VsZWN0IGEgY3VzdG9tZXJcIn1cclxuICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIHt1c2Vycy5tYXAoKHVzZXIpID0+IChcclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17dXNlci5pZH0gdmFsdWU9e3VzZXIuaWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAge3VzZXIubmFtZX0gKCN7dXNlci5pZH0pXHJcbiAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMiB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtjdXN0b21lckluZm9TdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtjdXN0b21lclJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9PkN1c3RvbWVyIE5hbWUgJiBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0cm9uZ1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRDdXN0b21lclxyXG4gICAgICAgICAgICAgICAgICAgICAgPyBgJHtzZWxlY3RlZEN1c3RvbWVyLm5hbWV9ICgjJHtzZWxlY3RlZEN1c3RvbWVyLmlkfSlgXHJcbiAgICAgICAgICAgICAgICAgICAgICA6IFwiLVwifVxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVyUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+RW1haWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtzdHJvbmdTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkQ3VzdG9tZXI/LmVtYWlsIHx8IFwiLVwifVxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e2N1c3RvbWVyUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+UGhvbmUgTnVtYmVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17c3Ryb25nU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZEN1c3RvbWVyPy5waG9uZSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRDdXN0b21lcj8ubW9iaWxlIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICBcIk5vdCBhdmFpbGFibGVcIn1cclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtjdXN0b21lclJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e211dGVkU3R5bGV9Pk9yZGVyIEhpc3Rvcnk8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtzdHJvbmdTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAge2N1c3RvbWVyT3JkZXJDb3VudH0gcHJldmlvdXMgb3JkZXJzXHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UGF5bWVudCAmIEJpbGxpbmc8L2gyPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlBheW1lbnQgT3B0aW9uczwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtwYXltZW50T3B0aW9uR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAge3BheW1lbnRPcHRpb25zLm1hcCgob3B0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlID0gZm9ybURhdGEucGF5bWVudE1ldGhvZCA9PT0gb3B0aW9uLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e29wdGlvbi52YWx1ZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXtwYXltZW50T3B0aW9uU3R5bGUoYWN0aXZlKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRGb3JtRGF0YSgocHJldikgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnByZXYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXltZW50TWV0aG9kOiBvcHRpb24udmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e29wdGlvbi5pY29ufTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e29wdGlvbi5sYWJlbH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWdyaWQtMlwiIHN0eWxlPXtncmlkMlN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TZWxlY3RlZCBNZXRob2Q8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEucGF5bWVudE1ldGhvZH1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICByZWFkT25seVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlBheW1lbnQgU3RhdHVzPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU9XCJwYXltZW50U3RhdHVzXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEucGF5bWVudFN0YXR1c31cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwZW5kaW5nXCI+UGVuZGluZzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwYWlkXCI+UGFpZDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5UcmFuc2FjdGlvbiBJRDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgbmFtZT1cInRyYW5zYWN0aW9uSWRcIlxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudHJhbnNhY3Rpb25JZH1cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gVFhOLTIwMjYtMDAwMTI0XCJcclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17c3RhY2tTdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgZ2FwOiBcIjhweFwiLFxyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3sgLi4uc2VjdGlvblRpdGxlU3R5bGUsIG1hcmdpbkJvdHRvbTogMCB9fT5cclxuICAgICAgICAgICAgICAgICAgUHJvZHVjdCBMaW5lIEl0ZW1zIChSZXF1aXJlZClcclxuICAgICAgICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXthZGRMaW5lSXRlbX1cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e2FkZEJ1dHRvblN0eWxlfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICArIEFkZCBJdGVtXHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCIxMHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICB7bGluZUl0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRQcm9kdWN0ID0gcHJvZHVjdHMuZmluZChcclxuICAgICAgICAgICAgICAgICAgICAocCkgPT4gU3RyaW5nKHAuaWQpID09PSBTdHJpbmcoaXRlbS5wcm9kdWN0SWQpLFxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICBjb25zdCBzaXplT3B0aW9ucyA9IGdldFNpemVPcHRpb25zKHNlbGVjdGVkUHJvZHVjdCk7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkU2l6ZU9wdGlvbiA9IHNpemVPcHRpb25zLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAgICAgKG9wdGlvbikgPT4gb3B0aW9uLnNpemUgPT09IGl0ZW0uc2l6ZSxcclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgY29uc3Qgc2l6ZVN0b2NrVGV4dCA9IGdldFNpemVFbnRyaWVzKHNlbGVjdGVkUHJvZHVjdClcclxuICAgICAgICAgICAgICAgICAgICAubWFwKChlbnRyeSkgPT4gYCR7ZW50cnkuc2l6ZX06ICR7ZW50cnkucXR5fWApXHJcbiAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCIgfCBcIik7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1Ub3RhbCA9XHJcbiAgICAgICAgICAgICAgICAgICAgdG9OdW1iZXIoaXRlbS5xdWFudGl0eSkgKiB0b051bWJlcihpdGVtLnVuaXRQcmljZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtgbGluZS1pdGVtLSR7aW5kZXh9YH0gc3R5bGU9e2xpbmVJdGVtUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17bGluZUl0ZW1Ub3BTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlByb2R1Y3Q8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnByb2R1Y3RJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxpbmVJdGVtQ2hhbmdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicHJvZHVjdElkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjdCBwcm9kdWN0PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdHMubWFwKChwcm9kdWN0KSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtwcm9kdWN0LmlkfSB2YWx1ZT17cHJvZHVjdC5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3Byb2R1Y3QubmFtZX0gKFNLVToge3Byb2R1Y3Quc2t1fSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3JlbW92ZUJ1dHRvblN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHJlbW92ZUxpbmVJdGVtKGluZGV4KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlbW92ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Byb2R1Y3RQcmV2aWV3U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRQcm9kdWN0Py5pbWFnZVVybCA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM9e3NlbGVjdGVkUHJvZHVjdC5pbWFnZVVybH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdD17c2VsZWN0ZWRQcm9kdWN0Lm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmltYWdlU3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCIzcHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogXCIxNHB4XCIsIGNvbG9yOiBcIiNmOGZhZmNcIiB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZFByb2R1Y3Q/Lm5hbWUgfHwgXCJTZWxlY3QgYSBwcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IFwiMTJweFwiLCBjb2xvcjogXCIjOTRhM2I4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTS1UvSUQ6e1wiIFwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkUHJvZHVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGAke3NlbGVjdGVkUHJvZHVjdC5za3V9IC8gIyR7c2VsZWN0ZWRQcm9kdWN0LmlkfWBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIi1cIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IFwiMTJweFwiLCBjb2xvcjogXCIjY2JkNWUxXCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaXplOiB7aXRlbS5zaXplIHx8IFwiLVwifSB8IFF0eToge2l0ZW0ucXVhbnRpdHl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtzaXplU3RvY2tUZXh0ID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IFwiMTFweFwiLCBjb2xvcjogXCIjZmFjYzE1XCIgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXZhaWxhYmxlOiB7c2l6ZVN0b2NrVGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+U2l6ZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aXRlbS5zaXplIHx8IFwiXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxpbmVJdGVtQ2hhbmdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaXplXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5TZWxlY3Qgc2l6ZTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtzaXplT3B0aW9ucy5tYXAoKHNpemVPcHRpb24pID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtzaXplT3B0aW9uLnNpemV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzaXplT3B0aW9uLnNpemV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzaXplT3B0aW9uLnF0eSA9PT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gc2l6ZU9wdGlvbi5zaXplXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBgJHtzaXplT3B0aW9uLnNpemV9ICgke3NpemVPcHRpb24ucXR5fSlgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWdyaWQtMlwiIHN0eWxlPXtncmlkMlN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBzdHlsZT17bGFiZWxTdHlsZX0+UXVhbnRpdHk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIxXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heD17XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkU2l6ZU9wdGlvbj8ucXR5ID09PSBudWxsIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkU2l6ZU9wdGlvbj8ucXR5ID09PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogTWF0aC5tYXgoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE51bWJlcihzZWxlY3RlZFNpemVPcHRpb24ucXR5IHx8IDApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2l0ZW0ucXVhbnRpdHl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVMaW5lSXRlbUNoYW5nZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInF1YW50aXR5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlVuaXQgUHJpY2U8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLnVuaXRQcmljZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxpbmVJdGVtQ2hhbmdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidW5pdFByaWNlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLi4udG90YWxzUm93U3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nQm90dG9tOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+TGluZSBUb3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdE1vbmV5KGl0ZW1Ub3RhbCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlNoaXBwaW5nICYgVHJhY2tpbmc8L2gyPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItZ3JpZC0yXCIgc3R5bGU9e2dyaWQyU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIENvbnRhY3QgTmFtZSAqPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nTmFtZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnNoaXBwaW5nTmFtZX1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlJlY2VpdmVyIGZ1bGwgbmFtZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIFBob25lIE51bWJlciAqPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nUGhvbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5zaGlwcGluZ1Bob25lfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMDdYIFhYWCBYWFhYXCJcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxMCB9fSAvPlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtyb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgc3R5bGU9e2xhYmVsU3R5bGV9PlNoaXBwaW5nIEFkZHJlc3MgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWFcclxuICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nQWRkcmVzc1wiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5zaGlwcGluZ0FkZHJlc3N9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLmlucHV0U3R5bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWluSGVpZ2h0OiBcIjg2cHhcIixcclxuICAgICAgICAgICAgICAgICAgICByZXNpemU6IFwidmVydGljYWxcIixcclxuICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJIb3VzZSBudW1iZXIsIHN0cmVldCwgY2l0eSwgcG9zdGFsIGNvZGVcIlxyXG4gICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIHttYXBzSHJlZiA/IChcclxuICAgICAgICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgICAgICBocmVmPXttYXBzSHJlZn1cclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXttYXBMaW5rU3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICBPcGVuIG9uIEdvb2dsZSBNYXBzXHJcbiAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICkgOiBudWxsfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWdyaWQtMlwiIHN0eWxlPXtncmlkMlN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TaGlwcGluZyBNZXRob2Q8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nTWV0aG9kXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuc2hpcHBpbmdNZXRob2R9XHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICB7c2hpcHBpbmdNZXRob2RzLm1hcCgoaXRlbSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2l0ZW19IHZhbHVlPXtpdGVtfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW19XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5UcmFja2luZyBOdW1iZXI8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICBuYW1lPVwidHJhY2tpbmdOdW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS50cmFja2luZ051bWJlcn1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlRSSy1YWFhYWFhcIlxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5PcmRlciBTdW1tYXJ5IC8gVG90YWxzPC9oMj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW9yZGVyLWdyaWQtMlwiIHN0eWxlPXtncmlkMlN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5TaGlwcGluZyBGZWU8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInNoaXBwaW5nRmVlXCJcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuc2hpcHBpbmdGZWV9XHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5UYXggLyBWQVQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICBzdGVwPVwiMC4wMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cInRheFwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2Zvcm1EYXRhLnRheH1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRm9ybUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTAgfX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXtsYWJlbFN0eWxlfT5EaXNjb3VudCAvIENvdXBvbjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjAxXCJcclxuICAgICAgICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgICAgICAgIG5hbWU9XCJkaXNjb3VudFwiXHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5kaXNjb3VudH1cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZvcm1DaGFuZ2V9XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbnB1dFN0eWxlfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDEyIH19IC8+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5TdWJ0b3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGxpbmVUb3RhbHMuc3VidG90YWwpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5TaGlwcGluZyBGZWU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3Ryb25nPntmb3JtYXRNb25leShsaW5lVG90YWxzLnNoaXBwaW5nRmVlKX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbHNSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17bXV0ZWRTdHlsZX0+VGF4IC8gVkFUPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHN0cm9uZz57Zm9ybWF0TW9uZXkobGluZVRvdGFscy50YXgpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RvdGFsc1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXttdXRlZFN0eWxlfT5EaXNjb3VudDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmc+LSB7Zm9ybWF0TW9uZXkobGluZVRvdGFscy5kaXNjb3VudCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj5HcmFuZCBUb3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuPntmb3JtYXRNb25leShsaW5lVG90YWxzLmdyYW5kVG90YWwpfTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c2VjdXJpdHlDaGlwV3JhcFN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3NlY3VyaXR5Q2hpcFN0eWxlfT5TZWN1cmUgUGF5bWVudCBQcm90ZWN0ZWQ8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3NlY3VyaXR5Q2hpcFN0eWxlfT5FbmNyeXB0ZWQgQ2hlY2tvdXQgQ2hhbm5lbDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c2VjdXJpdHlDaGlwU3R5bGV9PlRydXN0ZWQgRGVsaXZlcnkgVHJhY2tpbmc8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyAuLi5jYXJkU3R5bGUsIHBhZGRpbmdUb3A6IFwiMTRweFwiIH19PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17YWN0aW9uQmFyU3R5bGV9PlxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgc3R5bGU9e2FjdGlvbkJ1dHRvblN0eWxlKGZhbHNlKX1cclxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB3aW5kb3cuaGlzdG9yeS5iYWNrKCl9XHJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICBDYW5jZWxcclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcclxuICAgICAgICAgICAgICBzdHlsZT17YWN0aW9uQnV0dG9uU3R5bGUodHJ1ZSl9XHJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICB7c3VibWl0dGluZyA/IFwiQ3JlYXRpbmcgT3JkZXIuLi5cIiA6IFwiQ3JlYXRlIE9yZGVyXCJ9XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZm9ybT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlckNyZWF0ZTtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHBhZ2VTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG4gIGNvbG9yOiBcIiNlMmU4ZjBcIixcclxufTtcclxuXHJcbmNvbnN0IGNhcmRTdHlsZSA9IHtcclxuICBib3JkZXJSYWRpdXM6IFwiMThweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIpXCIsXHJcbiAgYmFja2dyb3VuZDpcclxuICAgIFwibGluZWFyLWdyYWRpZW50KDE1NWRlZywgcmdiYSgxMCwgMjMsIDQ4LCAwLjk0KSAwJSwgcmdiYSg4LCAxOCwgMzgsIDAuOTQpIDEwMCUpXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTRweCAzMHB4IHJnYmEoMiwgNiwgMjMsIDAuMilcIixcclxuICBwYWRkaW5nOiBcIjE4cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGhlYWRlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBoZWFkaW5nU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICBmb250U2l6ZTogXCIzNHB4XCIsXHJcbiAgbGluZUhlaWdodDogMS4xLFxyXG59O1xyXG5cclxuY29uc3Qgc3ViVGV4dFN0eWxlID0ge1xyXG4gIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgbWFyZ2luVG9wOiBcIjRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgYmFkZ2VTdHlsZSA9IChzdGF0dXMpID0+IHtcclxuICBjb25zdCB2YWwgPSBTdHJpbmcoc3RhdHVzIHx8IFwicGVuZGluZ1wiKS50b0xvd2VyQ2FzZSgpO1xyXG4gIGNvbnN0IHN0eWxlQnlTdGF0dXMgPSB7XHJcbiAgICBwZW5kaW5nOiB7IGJnOiBcIiNmZWYzYzdcIiwgZmc6IFwiIzdjMmQxMlwiIH0sXHJcbiAgICBwYWlkOiB7IGJnOiBcIiNiYmY3ZDBcIiwgZmc6IFwiIzE0NTMyZFwiIH0sXHJcbiAgICBwcm9jZXNzaW5nOiB7IGJnOiBcIiNiZmRiZmVcIiwgZmc6IFwiIzFlM2E4YVwiIH0sXHJcbiAgICBzaGlwcGVkOiB7IGJnOiBcIiNkZGQ2ZmVcIiwgZmc6IFwiIzRjMWQ5NVwiIH0sXHJcbiAgICBjb21wbGV0ZWQ6IHsgYmc6IFwiI2E3ZjNkMFwiLCBmZzogXCIjMDY0ZTNiXCIgfSxcclxuICAgIGNhbmNlbGxlZDogeyBiZzogXCIjZmVjYWNhXCIsIGZnOiBcIiM3ZjFkMWRcIiB9LFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNlbGVjdGVkID0gc3R5bGVCeVN0YXR1c1t2YWxdIHx8IHN0eWxlQnlTdGF0dXMucGVuZGluZztcclxuICByZXR1cm4ge1xyXG4gICAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gICAgcGFkZGluZzogXCI2cHggMTJweFwiLFxyXG4gICAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxyXG4gICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxuICAgIGJhY2tncm91bmQ6IHNlbGVjdGVkLmJnLFxyXG4gICAgY29sb3I6IHNlbGVjdGVkLmZnLFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uVGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiMCAwIDEycHggMFwiLFxyXG4gIGNvbG9yOiBcIiNmNWRmOTBcIixcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMWVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxufTtcclxuXHJcbmNvbnN0IGdyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgzMDBweCwgMWZyKSBtaW5tYXgoMzIwcHgsIDFmcilcIixcclxuICBnYXA6IFwiMTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb0dyaWRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbmZvUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI4cHhcIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0YWJsZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBsaW5lSXRlbVN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgcGFkZGluZzogXCIxMHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCJyZ2JhKDE1LCAyMywgNDIsIDAuNDQpXCIsXHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCI2MHB4IDFmciBhdXRvXCIsXHJcbiAgZ2FwOiBcIjEwcHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2MHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjYwcHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG59O1xyXG5cclxuY29uc3QgdG90YWxCb3hTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBnYXA6IFwiOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCB0b3RhbFJvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBmb250U2l6ZTogXCIxM3B4XCIsXHJcbiAgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMTIpXCIsXHJcbiAgcGFkZGluZ0JvdHRvbTogXCI3cHhcIixcclxufTtcclxuXHJcbmNvbnN0IGdyYW5kU3R5bGUgPSB7XHJcbiAgLi4udG90YWxSb3dTdHlsZSxcclxuICBib3JkZXJCb3R0b206IFwibm9uZVwiLFxyXG4gIHBhZGRpbmdUb3A6IFwiNnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGZvbnRTaXplOiBcIjE4cHhcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBlbXB0eVN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggZGFzaGVkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4zNSlcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIHBhZGRpbmc6IFwiMTRweFwiLFxyXG4gIGNvbG9yOiBcIiNjYmQ1ZTFcIixcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdE1vbmV5ID0gKHZhbHVlKSA9PiB7XHJcbiAgY29uc3QgbiA9IE51bWJlcih2YWx1ZSB8fCAwKTtcclxuICByZXR1cm4gYFJzLiAke24udG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgfSl9YDtcclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdERhdGUgPSAodmFsdWUpID0+IHtcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gXCItXCI7XHJcbiAgfVxyXG5cclxuICBjb25zdCBkdCA9IG5ldyBEYXRlKHZhbHVlKTtcclxuICBpZiAoTnVtYmVyLmlzTmFOKGR0LmdldFRpbWUoKSkpIHtcclxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGR0LnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge1xyXG4gICAgZGF0ZVN0eWxlOiBcIm1lZGl1bVwiLFxyXG4gICAgdGltZVN0eWxlOiBcInNob3J0XCIsXHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBPcmRlclNob3cgPSAoeyByZWNvcmQgfSkgPT4ge1xyXG4gIGNvbnN0IFtkZXRhaWxzLCBzZXREZXRhaWxzXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIGNvbnN0IG9yZGVySWQgPSByZWNvcmQ/LnBhcmFtcz8uaWQgfHwgcmVjb3JkPy5pZDtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghb3JkZXJJZCkge1xyXG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgc2V0RXJyb3IoXCJPcmRlciBpZCBub3QgZm91bmRcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsb2FkRGV0YWlscyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBzZXRFcnJvcihcIlwiKTtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxyXG4gICAgICAgICAgYC9hZG1pbi9jb250ZXh0L29yZGVycy8ke2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcob3JkZXJJZCkpfS9kZXRhaWxzYCxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZD8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGRldGFpbHNcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXREZXRhaWxzKHBheWxvYWQpO1xyXG4gICAgICB9IGNhdGNoIChmZXRjaEVycm9yKSB7XHJcbiAgICAgICAgc2V0RXJyb3IoZmV0Y2hFcnJvcj8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGRldGFpbHNcIik7XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbG9hZERldGFpbHMoKTtcclxuICB9LCBbb3JkZXJJZF0pO1xyXG5cclxuICBjb25zdCB0b3RhbHMgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IHN1YnRvdGFsID0gTnVtYmVyKGRldGFpbHM/LnN1YnRvdGFsIHx8IDApO1xyXG4gICAgY29uc3Qgc2hpcHBpbmdGZWUgPSBOdW1iZXIoZGV0YWlscz8uc2hpcHBpbmdGZWUgfHwgMCk7XHJcbiAgICBjb25zdCB0YXggPSBOdW1iZXIoZGV0YWlscz8udGF4IHx8IDApO1xyXG4gICAgY29uc3QgZGlzY291bnQgPSBOdW1iZXIoZGV0YWlscz8uZGlzY291bnQgfHwgMCk7XHJcbiAgICBjb25zdCB0b3RhbEFtb3VudCA9IE51bWJlcihkZXRhaWxzPy50b3RhbEFtb3VudCB8fCAwKTtcclxuXHJcbiAgICByZXR1cm4geyBzdWJ0b3RhbCwgc2hpcHBpbmdGZWUsIHRheCwgZGlzY291bnQsIHRvdGFsQW1vdW50IH07XHJcbiAgfSwgW2RldGFpbHNdKTtcclxuXHJcbiAgaWYgKGxvYWRpbmcpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT5Mb2FkaW5nIG9yZGVyIGRldGFpbHMuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT57ZXJyb3J9PC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKCFkZXRhaWxzKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+T3JkZXIgZGV0YWlscyBub3QgYXZhaWxhYmxlLjwvZGl2PjtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtwYWdlU3R5bGV9PlxyXG4gICAgICA8c3R5bGU+e2BAbWVkaWEgKG1heC13aWR0aDogMTA0MHB4KSB7IC5jaGFuZ2U4LW9yZGVyLXNob3ctZ3JpZCB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7IH0gfWB9PC9zdHlsZT5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17aGVhZGVyU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGgxIHN0eWxlPXtoZWFkaW5nU3R5bGV9Pk9yZGVyICN7ZGV0YWlscy5pZH08L2gxPlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdWJUZXh0U3R5bGV9PlxyXG4gICAgICAgICAgICAgIENyZWF0ZWQge2Zvcm1hdERhdGUoZGV0YWlscy5jcmVhdGVkQXQpfSB8IFVwZGF0ZWR7XCIgXCJ9XHJcbiAgICAgICAgICAgICAge2Zvcm1hdERhdGUoZGV0YWlscy51cGRhdGVkQXQpfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9e2JhZGdlU3R5bGUoZGV0YWlscy5zdGF0dXMpfT5cclxuICAgICAgICAgICAge2RldGFpbHMuc3RhdHVzIHx8IFwicGVuZGluZ1wifVxyXG4gICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1vcmRlci1zaG93LWdyaWRcIiBzdHlsZT17Z3JpZFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+Q3VzdG9tZXIgJiBTaGlwcGluZzwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvR3JpZFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+Q3VzdG9tZXI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8udXNlcj8ubmFtZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlNoaXBwaW5nIENvbnRhY3Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8uc2hpcHBpbmdOYW1lIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgUGhvbmU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8uc2hpcHBpbmdQaG9uZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkVtYWlsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnVzZXI/LmVtYWlsIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+UGF5bWVudCBNZXRob2Q8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscz8ucGF5bWVudE1ldGhvZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlBheW1lbnQgU3RhdHVzPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnBheW1lbnRTdGF0dXMgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5UcmFuc2FjdGlvbiBJRDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntkZXRhaWxzPy50cmFuc2FjdGlvbklkIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgTWV0aG9kPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnNoaXBwaW5nTWV0aG9kIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VHJhY2tpbmcgTnVtYmVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2RldGFpbHM/LnRyYWNraW5nTnVtYmVyIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiBcIjEzcHhcIiwgY29sb3I6IFwiI2NiZDVlMVwiLCBsaW5lSGVpZ2h0OiAxLjYgfX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiLCBtYXJnaW5Cb3R0b206IFwiNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICBTaGlwcGluZyBBZGRyZXNzXHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIgfX0+XHJcbiAgICAgICAgICAgICAgICB7ZGV0YWlscz8uc2hpcHBpbmdBZGRyZXNzIHx8IFwiLVwifVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+T3JkZXIgU3VtbWFyeSAvIFRvdGFsczwvaDI+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbEJveFN0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlN1YnRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KHRvdGFscy5zdWJ0b3RhbCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgRmVlPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KHRvdGFscy5zaGlwcGluZ0ZlZSl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt0b3RhbFJvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+VGF4IC8gVkFUPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KHRvdGFscy50YXgpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17dG90YWxSb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkRpc2NvdW50PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+LSB7Zm9ybWF0TW9uZXkodG90YWxzLmRpc2NvdW50KX08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2dyYW5kU3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuPkdyYW5kIFRvdGFsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuPntmb3JtYXRNb25leSh0b3RhbHMudG90YWxBbW91bnQpfTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlByb2R1Y3QgTGluZSBJdGVtczwvaDI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17dGFibGVTdHlsZX0+XHJcbiAgICAgICAgICB7KGRldGFpbHM/Lml0ZW1zIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2VtcHR5U3R5bGV9Pk5vIGxpbmUgaXRlbXMgaW4gdGhpcyBvcmRlci48L2Rpdj5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgIChkZXRhaWxzLml0ZW1zIHx8IFtdKS5tYXAoKGl0ZW0pID0+IChcclxuICAgICAgICAgICAgICA8ZGl2IGtleT17aXRlbS5pZH0gc3R5bGU9e2xpbmVJdGVtU3R5bGV9PlxyXG4gICAgICAgICAgICAgICAge2l0ZW0/LnByb2R1Y3Q/LmltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjPXtpdGVtLnByb2R1Y3QuaW1hZ2VVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgYWx0PXtpdGVtPy5wcm9kdWN0Py5uYW1lIHx8IFwiUHJvZHVjdFwifVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtpbWFnZVN0eWxlfVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAuLi5pbWFnZVN0eWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjOTRhM2I4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIE5vIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZ3JpZFwiLCBnYXA6IFwiNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAge2l0ZW0/LnByb2R1Y3Q/Lm5hbWUgfHwgXCJVbm5hbWVkIHByb2R1Y3RcIn1cclxuICAgICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIFNLVToge2l0ZW0/LnByb2R1Y3Q/LnNrdSB8fCBcIi1cIn0gfCBQcm9kdWN0IElEOiAjXHJcbiAgICAgICAgICAgICAgICAgICAge2l0ZW0/LnByb2R1Y3RJZH1cclxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjY2JkNWUxXCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICBTaXplOiB7aXRlbT8uc2l6ZSB8fCBcIi1cIn0gfCBRdHk6IHtpdGVtLnF1YW50aXR5fSB4e1wiIFwifVxyXG4gICAgICAgICAgICAgICAgICAgIHtmb3JtYXRNb25leShpdGVtLnVuaXRQcmljZSl9XHJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNXB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICAgIHtmb3JtYXRNb25leShpdGVtLnRvdGFsUHJpY2UpfVxyXG4gICAgICAgICAgICAgICAgPC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlclNob3c7XHJcbiIsIlxyXG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgcGFnZVN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbiAgY29sb3I6IFwiI2UyZThmMFwiLFxyXG59O1xyXG5cclxuY29uc3QgY2FyZFN0eWxlID0ge1xyXG4gIGJvcmRlclJhZGl1czogXCIxOHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMilcIixcclxuICBiYWNrZ3JvdW5kOlxyXG4gICAgXCJsaW5lYXItZ3JhZGllbnQoMTU1ZGVnLCByZ2JhKDEwLCAyMywgNDgsIDAuOTQpIDAlLCByZ2JhKDgsIDE4LCAzOCwgMC45NCkgMTAwJSlcIixcclxuICBib3hTaGFkb3c6IFwiMCAxNHB4IDMwcHggcmdiYSgyLCA2LCAyMywgMC4yKVwiLFxyXG4gIHBhZGRpbmc6IFwiMThweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaGVhZGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGdhcDogXCIxMnB4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxufTtcclxuXHJcbmNvbnN0IHRpdGxlU3R5bGUgPSB7XHJcbiAgbWFyZ2luOiAwLFxyXG4gIGZvbnRTaXplOiBcIjM0cHhcIixcclxuICBsaW5lSGVpZ2h0OiAxLjEsXHJcbiAgY29sb3I6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3Qgc3VidGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiNnB4IDAgMCAwXCIsXHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxufTtcclxuXHJcbmNvbnN0IGJhZGdlU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJpbmxpbmUtZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICBwYWRkaW5nOiBcIjZweCAxMnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTFweFwiLFxyXG4gIGZvbnRXZWlnaHQ6IDgwMCxcclxuICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxyXG4gIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXHJcbiAgY29sb3I6IFwiIzE0NTMyZFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2JiZjdkMFwiLFxyXG59O1xyXG5cclxuY29uc3QgZ3JpZFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwibWlubWF4KDMwMHB4LCAwLjk1ZnIpIG1pbm1heCgzMjBweCwgMS4wNWZyKVwiLFxyXG4gIGdhcDogXCIxNnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBzZWN0aW9uVGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IFwiMCAwIDEycHggMFwiLFxyXG4gIGNvbG9yOiBcIiNmNWRmOTBcIixcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG4gIGxldHRlclNwYWNpbmc6IFwiMC4xMWVtXCIsXHJcbiAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcclxufTtcclxuXHJcbmNvbnN0IGluZm9HcmlkU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW5mb1Jvd1N0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG4gIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjEyKVwiLFxyXG4gIHBhZGRpbmdCb3R0b206IFwiOHB4XCIsXHJcbiAgZm9udFNpemU6IFwiMTNweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgaGVpZ2h0OiBcIjI4MHB4XCIsXHJcbiAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE0cHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiMwZjE3MmFcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4yMilcIixcclxufTtcclxuXHJcbmNvbnN0IGxpbmVJdGVtU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCI4NHB4IDFmciBhdXRvXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIHBhZGRpbmc6IFwiMTJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxNHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMilcIixcclxuICBiYWNrZ3JvdW5kOiBcInJnYmEoMTUsIDIzLCA0MiwgMC40NClcIixcclxufTtcclxuXHJcbmNvbnN0IGVtcHR5SW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI4NHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjg0cHhcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJhY2tncm91bmQ6IFwiIzBmMTcyYVwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjIyKVwiLFxyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXHJcbiAgY29sb3I6IFwiIzk0YTNiOFwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxufTtcclxuXHJcbmNvbnN0IHRvdGFsUm93U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xMilcIixcclxuICBwYWRkaW5nQm90dG9tOiBcIjdweFwiLFxyXG59O1xyXG5cclxuY29uc3QgZ3JhbmRTdHlsZSA9IHtcclxuICAuLi50b3RhbFJvd1N0eWxlLFxyXG4gIGJvcmRlckJvdHRvbTogXCJub25lXCIsXHJcbiAgcGFkZGluZ1RvcDogXCI2cHhcIixcclxuICBmb250V2VpZ2h0OiA4MDAsXHJcbiAgZm9udFNpemU6IFwiMThweFwiLFxyXG4gIGNvbG9yOiBcIiNmOGZhZmNcIixcclxufTtcclxuXHJcbmNvbnN0IGVtcHR5U3R5bGUgPSB7XHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgcGFkZGluZzogXCIxNHB4XCIsXHJcbiAgY29sb3I6IFwiI2NiZDVlMVwiLFxyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0TW9uZXkgPSAodmFsdWUpID0+IHtcclxuICBjb25zdCBuID0gTnVtYmVyKHZhbHVlIHx8IDApO1xyXG4gIHJldHVybiBgUnMuICR7bi50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHtcclxuICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICAgIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMixcclxuICB9KX1gO1xyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0RGF0ZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiBcIi1cIjtcclxuICB9XHJcblxyXG4gIGNvbnN0IGR0ID0gbmV3IERhdGUodmFsdWUpO1xyXG4gIGlmIChOdW1iZXIuaXNOYU4oZHQuZ2V0VGltZSgpKSkge1xyXG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZHQudG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7XHJcbiAgICBkYXRlU3R5bGU6IFwibWVkaXVtXCIsXHJcbiAgICB0aW1lU3R5bGU6IFwic2hvcnRcIixcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IE9yZGVySXRlbVNob3cgPSAoeyByZWNvcmQgfSkgPT4ge1xyXG4gIGNvbnN0IFtkZXRhaWxzLCBzZXREZXRhaWxzXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIGNvbnN0IG9yZGVySXRlbUlkID0gcmVjb3JkPy5wYXJhbXM/LmlkIHx8IHJlY29yZD8uaWQ7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoIW9yZGVySXRlbUlkKSB7XHJcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICBzZXRFcnJvcihcIk9yZGVyIGl0ZW0gaWQgbm90IGZvdW5kXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbG9hZERldGFpbHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgc2V0RXJyb3IoXCJcIik7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcclxuICAgICAgICAgIGAvYWRtaW4vY29udGV4dC9vcmRlci1pdGVtcy8ke2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcob3JkZXJJdGVtSWQpKX0vZGV0YWlsc2AsXHJcbiAgICAgICAgICB7IGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgICAgICAgcGF5bG9hZD8ubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIG9yZGVyIGl0ZW0gZGV0YWlsc1wiLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldERldGFpbHMocGF5bG9hZCk7XHJcbiAgICAgIH0gY2F0Y2ggKGZldGNoRXJyb3IpIHtcclxuICAgICAgICBzZXRFcnJvcihmZXRjaEVycm9yPy5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgb3JkZXIgaXRlbSBkZXRhaWxzXCIpO1xyXG4gICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWREZXRhaWxzKCk7XHJcbiAgfSwgW29yZGVySXRlbUlkXSk7XHJcblxyXG4gIGNvbnN0IGNhbGN1bGF0ZWRUb3RhbCA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgcmV0dXJuIE51bWJlcihkZXRhaWxzPy50b3RhbFByaWNlIHx8IDApO1xyXG4gIH0sIFtkZXRhaWxzXSk7XHJcblxyXG4gIGlmIChsb2FkaW5nKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+TG9hZGluZyBvcmRlciBpdGVtIGRldGFpbHMuLi48L2Rpdj47XHJcbiAgfVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtlbXB0eVN0eWxlfT57ZXJyb3J9PC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKCFkZXRhaWxzKSB7XHJcbiAgICByZXR1cm4gPGRpdiBzdHlsZT17ZW1wdHlTdHlsZX0+T3JkZXIgaXRlbSBkZXRhaWxzIG5vdCBhdmFpbGFibGUuPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcHJvZHVjdCA9IGRldGFpbHM/LnByb2R1Y3QgfHwge307XHJcbiAgY29uc3Qgb3JkZXIgPSBkZXRhaWxzPy5vcmRlciB8fCB7fTtcclxuICBjb25zdCBjdXN0b21lciA9IG9yZGVyPy51c2VyIHx8IHt9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17cGFnZVN0eWxlfT5cclxuICAgICAgPHN0eWxlPntgQG1lZGlhIChtYXgtd2lkdGg6IDEwNDBweCkgeyAuY2hhbmdlOC1vcmRlci1pdGVtLWdyaWQgeyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50OyB9IH1gfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2hlYWRlclN0eWxlfT5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxoMSBzdHlsZT17dGl0bGVTdHlsZX0+e3Byb2R1Y3Q/Lm5hbWUgfHwgXCJPcmRlciBJdGVtXCJ9PC9oMT5cclxuICAgICAgICAgICAgPHAgc3R5bGU9e3N1YnRpdGxlU3R5bGV9PlxyXG4gICAgICAgICAgICAgIE9yZGVyICN7b3JkZXI/LmlkIHx8IFwiLVwifSDigKIgSXRlbSAje2RldGFpbHM/LmlkIHx8IFwiLVwifVxyXG4gICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxzcGFuIHN0eWxlPXtiYWRnZVN0eWxlfT5BY3RpdmUgSXRlbTwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtb3JkZXItaXRlbS1ncmlkXCIgc3R5bGU9e2dyaWRTdHlsZX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgIHtwcm9kdWN0Py5pbWFnZVVybCA/IChcclxuICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgIHNyYz17cHJvZHVjdC5pbWFnZVVybH1cclxuICAgICAgICAgICAgICBhbHQ9e3Byb2R1Y3Q/Lm5hbWUgfHwgXCJQcm9kdWN0XCJ9XHJcbiAgICAgICAgICAgICAgc3R5bGU9e2ltYWdlU3R5bGV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIC4uLmltYWdlU3R5bGUsXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM5NGEzYjhcIixcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgTm8gaW1hZ2UgYXZhaWxhYmxlXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTQgfX0gLz5cclxuXHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5Qcm9kdWN0IFNuYXBzaG90PC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5Qcm9kdWN0IE5hbWU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57cHJvZHVjdD8ubmFtZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlNLVTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntwcm9kdWN0Py5za3UgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5Qcm9kdWN0IElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+I3twcm9kdWN0Py5pZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkN1cnJlbnQgU3RvY2s8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57cHJvZHVjdD8uc3RvY2sgPz8gXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3NlY3Rpb25UaXRsZVN0eWxlfT5PcmRlciAmIEN1c3RvbWVyPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9HcmlkU3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5DdXN0b21lcjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntjdXN0b21lcj8ubmFtZSB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkVtYWlsPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2N1c3RvbWVyPy5lbWFpbCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19Pk9yZGVyIElEPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+I3tvcmRlcj8uaWQgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5PcmRlciBTdGF0dXM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57b3JkZXI/LnN0YXR1cyB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlBheW1lbnQgTWV0aG9kPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e29yZGVyPy5wYXltZW50TWV0aG9kIHx8IFwiLVwifTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCIjOTRhM2I4XCIgfX0+U2hpcHBpbmcgTWV0aG9kPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e29yZGVyPy5zaGlwcGluZ01ldGhvZCB8fCBcIi1cIn08L3N0cm9uZz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlRyYWNraW5nIE51bWJlcjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3Ryb25nPntvcmRlcj8udHJhY2tpbmdOdW1iZXIgfHwgXCItXCJ9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvUm93U3R5bGV9PlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5DcmVhdGVkIEF0PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdERhdGUoZGV0YWlscy5jcmVhdGVkQXQpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGgyIHN0eWxlPXtzZWN0aW9uVGl0bGVTdHlsZX0+UHJpY2luZyBEZXRhaWxzPC9oMj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtpbmZvR3JpZFN0eWxlfT5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e2luZm9Sb3dTdHlsZX0+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiM5NGEzYjhcIiB9fT5RdWFudGl0eTwvc3Bhbj5cclxuICAgICAgICAgICAgPHN0cm9uZz57ZGV0YWlscy5xdWFudGl0eX08L3N0cm9uZz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PlVuaXQgUHJpY2U8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGRldGFpbHMudW5pdFByaWNlKX08L3N0cm9uZz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17aW5mb1Jvd1N0eWxlfT5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiIH19PkxpbmUgVG90YWw8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdE1vbmV5KGNhbGN1bGF0ZWRUb3RhbCl9PC9zdHJvbmc+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxoMiBzdHlsZT17c2VjdGlvblRpdGxlU3R5bGV9PlF1aWNrIFN1bW1hcnk8L2gyPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2xpbmVJdGVtU3R5bGV9PlxyXG4gICAgICAgICAge3Byb2R1Y3Q/LmltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICA8aW1nXHJcbiAgICAgICAgICAgICAgc3JjPXtwcm9kdWN0LmltYWdlVXJsfVxyXG4gICAgICAgICAgICAgIGFsdD17cHJvZHVjdD8ubmFtZSB8fCBcIlByb2R1Y3RcIn1cclxuICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiODRweFwiLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjg0cHhcIixcclxuICAgICAgICAgICAgICAgIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjEycHhcIixcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17ZW1wdHlJbWFnZVN0eWxlfT5ObyBpbWFnZTwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdhcDogXCI0cHhcIiB9fT5cclxuICAgICAgICAgICAgPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogXCIjZjhmYWZjXCIsIGZvbnRTaXplOiBcIjE2cHhcIiB9fT5cclxuICAgICAgICAgICAgICB7cHJvZHVjdD8ubmFtZSB8fCBcIlVubmFtZWQgcHJvZHVjdFwifVxyXG4gICAgICAgICAgICA8L3N0cm9uZz5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFwiIzk0YTNiOFwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgU0tVOiB7cHJvZHVjdD8uc2t1IHx8IFwiLVwifVxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcIiNjYmQ1ZTFcIiwgZm9udFNpemU6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgIFF0eSB7ZGV0YWlscy5xdWFudGl0eX0geCB7Zm9ybWF0TW9uZXkoZGV0YWlscy51bml0UHJpY2UpfVxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFwiI2Y4ZmFmY1wiLCBmb250U2l6ZTogXCIxNnB4XCIgfX0+XHJcbiAgICAgICAgICAgIHtmb3JtYXRNb25leShjYWxjdWxhdGVkVG90YWwpfVxyXG4gICAgICAgICAgPC9zdHJvbmc+XHJcblxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmRlckl0ZW1TaG93O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgY2VsbFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBtaW5IZWlnaHQ6IFwiNTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2NHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjQycHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZsZXhTaHJpbms6IDAsXHJcbn07XHJcblxyXG5jb25zdCBmYWxsYmFja1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjY0cHhcIixcclxuICBoZWlnaHQ6IFwiNDJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjYpXCIsXHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgY29sb3I6IFwiIzY0NzQ4YlwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZsZXhTaHJpbms6IDAsXHJcbn07XHJcblxyXG5jb25zdCB0ZXh0U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcclxuICBnYXA6IFwiMnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0SW1hZ2UgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCBpbWFnZVVybCA9IHByb3BzPy5yZWNvcmQ/LnBhcmFtcz8uW3Byb3BzPy5wcm9wZXJ0eT8ucGF0aF07XHJcbiAgY29uc3QgW2hhc0Vycm9yLCBzZXRIYXNFcnJvcl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBzZXRIYXNFcnJvcihmYWxzZSk7XHJcbiAgfSwgW2ltYWdlVXJsXSk7XHJcblxyXG4gIGlmICghaW1hZ2VVcmwpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtmYWxsYmFja1N0eWxlfT5ObyBpbWFnZTwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChoYXNFcnJvcikge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBzdHlsZT17Y2VsbFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtmYWxsYmFja1N0eWxlfT5JbnZhbGlkPC9kaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IFwiIzBmMTcyYVwiIH19PkltYWdlIFVSTDwvc3Bhbj5cclxuICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgIGhyZWY9e2ltYWdlVXJsfVxyXG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICBjb2xvcjogXCIjMjU2M2ViXCIsXHJcbiAgICAgICAgICAgICAgdGV4dERlY29yYXRpb246IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgT3BlbiBsaW5rXHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtjZWxsU3R5bGV9PlxyXG4gICAgICA8aW1nXHJcbiAgICAgICAgc3JjPXtpbWFnZVVybH1cclxuICAgICAgICBhbHQ9XCJQcm9kdWN0XCJcclxuICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX1cclxuICAgICAgICBvbkVycm9yPXsoKSA9PiBzZXRIYXNFcnJvcih0cnVlKX1cclxuICAgICAgLz5cclxuICAgICAgPGRpdiBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBcIiMwZjE3MmFcIiB9fT5QcmV2aWV3PC9zcGFuPlxyXG4gICAgICAgIDxhXHJcbiAgICAgICAgICBocmVmPXtpbWFnZVVybH1cclxuICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXHJcbiAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiBcIiMyNTYzZWJcIiwgdGV4dERlY29yYXRpb246IFwibm9uZVwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICBPcGVuIGltYWdlXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0SW1hZ2U7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCB3cmFwcGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG59O1xyXG5cclxuY29uc3QgcHJldmlld1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjE0MHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjk2cHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3QgaGludFN0eWxlID0ge1xyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBjb2xvcjogXCIjNjQ3NDhiXCIsXHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0SW1hZ2VVcGxvYWQgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCB7IG9uQ2hhbmdlLCByZWNvcmQgfSA9IHByb3BzO1xyXG4gIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHJlY29yZD8ucGFyYW1zPy5pbWFnZVVybCB8fCBcIlwiO1xyXG4gIGNvbnN0IGN1cnJlbnRQdWJsaWNJZCA9IHJlY29yZD8ucGFyYW1zPy5pbWFnZVB1YmxpY0lkIHx8IFwiXCI7XHJcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoY3VycmVudFZhbHVlKTtcclxuICBjb25zdCBbcHVibGljSWQsIHNldFB1YmxpY0lkXSA9IHVzZVN0YXRlKGN1cnJlbnRQdWJsaWNJZCk7XHJcbiAgY29uc3QgW3VwbG9hZGluZywgc2V0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgc2V0UHJldmlld1VybChjdXJyZW50VmFsdWUpO1xyXG4gICAgc2V0UHVibGljSWQoY3VycmVudFB1YmxpY0lkKTtcclxuICB9LCBbY3VycmVudFZhbHVlLCBjdXJyZW50UHVibGljSWRdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlVXBsb2FkID0gYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF07XHJcblxyXG4gICAgaWYgKCFmaWxlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSk7XHJcbiAgICBzZXRFcnJvcihcIlwiKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXCJpbWFnZVwiLCBmaWxlKTtcclxuXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvYXBpL3VwbG9hZHMvaW1hZ2VcIiwge1xyXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgYm9keTogZm9ybURhdGEsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZC5tZXNzYWdlIHx8IFwiSW1hZ2UgdXBsb2FkIGZhaWxlZFwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdXBsb2FkZWRVcmwgPSBwYXlsb2FkLnVybCB8fCBcIlwiO1xyXG4gICAgICBjb25zdCB1cGxvYWRlZFB1YmxpY0lkID0gcGF5bG9hZC5wdWJsaWNJZCB8fCBcIlwiO1xyXG4gICAgICBzZXRQcmV2aWV3VXJsKHVwbG9hZGVkVXJsKTtcclxuICAgICAgc2V0UHVibGljSWQodXBsb2FkZWRQdWJsaWNJZCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVVybFwiLCB1cGxvYWRlZFVybCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVB1YmxpY0lkXCIsIHVwbG9hZGVkUHVibGljSWQpO1xyXG4gICAgfSBjYXRjaCAodXBsb2FkRXJyb3IpIHtcclxuICAgICAgc2V0RXJyb3IodXBsb2FkRXJyb3IubWVzc2FnZSk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpO1xyXG4gICAgICBldmVudC50YXJnZXQudmFsdWUgPSBcIlwiO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZVJlbW92ZSA9ICgpID0+IHtcclxuICAgIHNldFByZXZpZXdVcmwoXCJcIik7XHJcbiAgICBzZXRQdWJsaWNJZChcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVVybFwiLCBcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVB1YmxpY0lkXCIsIFwiXCIpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt3cmFwcGVyU3R5bGV9PlxyXG4gICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e2hhbmRsZVVwbG9hZH0gLz5cclxuICAgICAgPGRpdiBzdHlsZT17aGludFN0eWxlfT5cclxuICAgICAgICB7dXBsb2FkaW5nXHJcbiAgICAgICAgICA/IFwiVXBsb2FkaW5nIHRvIENsb3VkaW5hcnkuLi5cIlxyXG4gICAgICAgICAgOiBcIkNob29zZSBhbiBpbWFnZSBmaWxlIHRvIHVwbG9hZFwifVxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHtwcmV2aWV3VXJsID8gKFxyXG4gICAgICAgIDw+XHJcbiAgICAgICAgICA8aW1nIHNyYz17cHJldmlld1VybH0gYWx0PVwiUHJvZHVjdCBwcmV2aWV3XCIgc3R5bGU9e3ByZXZpZXdTdHlsZX0gLz5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVJlbW92ZX1cclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwiNnB4IDEwcHhcIixcclxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IFwiOHB4XCIsXHJcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjZWY0NDQ0XCIsXHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiI2VmNDQ0NFwiLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiI2ZmZlwiLFxyXG4gICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIFJlbW92ZSBpbWFnZVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC8+XHJcbiAgICAgICkgOiBudWxsfVxyXG5cclxuICAgICAge2Vycm9yID8gKFxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgLi4uaGludFN0eWxlLCBjb2xvcjogXCIjZGMyNjI2XCIgfX0+e2Vycm9yfTwvZGl2PlxyXG4gICAgICApIDogbnVsbH1cclxuXHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImltYWdlVXJsXCIgdmFsdWU9e3ByZXZpZXdVcmx9IHJlYWRPbmx5IC8+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImltYWdlUHVibGljSWRcIiB2YWx1ZT17cHVibGljSWR9IHJlYWRPbmx5IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdEltYWdlVXBsb2FkO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3Qgd3JhcHBlclN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCByb3dTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImdyaWRcIixcclxuICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjFmciAxNDBweCBhdXRvXCIsXHJcbiAgZ2FwOiBcIjhweFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbn07XHJcblxyXG5jb25zdCBpbnB1dFN0eWxlID0ge1xyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjQ1KVwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgcGFkZGluZzogXCI4cHggMTBweFwiLFxyXG4gIGZvbnRTaXplOiBcIjEzcHhcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmZmZcIixcclxufTtcclxuXHJcbmNvbnN0IGhpbnRTdHlsZSA9IHtcclxuICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgY29sb3I6IFwiIzY0NzQ4YlwiLFxyXG59O1xyXG5cclxuY29uc3QgYWRkQnV0dG9uU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiZml0LWNvbnRlbnRcIixcclxuICBwYWRkaW5nOiBcIjdweCAxMnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjlweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgIzYzNjZmMVwiLFxyXG4gIGNvbG9yOiBcIiMzNzMwYTNcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNlZWYyZmZcIixcclxuICBjdXJzb3I6IFwicG9pbnRlclwiLFxyXG4gIGZvbnRXZWlnaHQ6IDcwMCxcclxufTtcclxuXHJcbmNvbnN0IHJlbW92ZUJ1dHRvblN0eWxlID0ge1xyXG4gIHBhZGRpbmc6IFwiN3B4IDlweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCI5cHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkICNmY2E1YTVcIixcclxuICBjb2xvcjogXCIjOTkxYjFiXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZmVlMmUyXCIsXHJcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxuICBmb250V2VpZ2h0OiA3MDAsXHJcbn07XHJcblxyXG5jb25zdCBwYXJzZUluaXRpYWxWYWx1ZSA9ICh2YWx1ZSkgPT4ge1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIGxldCBzb3VyY2UgPSB2YWx1ZTtcclxuICBpZiAodHlwZW9mIHNvdXJjZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgc291cmNlID0gSlNPTi5wYXJzZShzb3VyY2UpO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICghc291cmNlIHx8IHR5cGVvZiBzb3VyY2UgIT09IFwib2JqZWN0XCIgfHwgQXJyYXkuaXNBcnJheShzb3VyY2UpKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICByZXR1cm4gT2JqZWN0LmVudHJpZXMoc291cmNlKS5tYXAoKFtzaXplLCBxdHldKSA9PiAoe1xyXG4gICAgc2l6ZTogU3RyaW5nKHNpemUgfHwgXCJcIilcclxuICAgICAgLnRyaW0oKVxyXG4gICAgICAudG9VcHBlckNhc2UoKSxcclxuICAgIHN0b2NrOiBTdHJpbmcoTnVtYmVyKHF0eSB8fCAwKSksXHJcbiAgfSkpO1xyXG59O1xyXG5cclxuY29uc3QgUHJvZHVjdFNpemVTdG9ja0lucHV0ID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgeyByZWNvcmQsIG9uQ2hhbmdlIH0gPSBwcm9wcztcclxuICBjb25zdCBpbml0aWFsUm93cyA9IHVzZU1lbW8oXHJcbiAgICAoKSA9PiBwYXJzZUluaXRpYWxWYWx1ZShyZWNvcmQ/LnBhcmFtcz8uc2l6ZVN0b2NrKSxcclxuICAgIFtyZWNvcmQ/LnBhcmFtcz8uc2l6ZVN0b2NrXSxcclxuICApO1xyXG5cclxuICBjb25zdCBbcm93cywgc2V0Um93c10gPSB1c2VTdGF0ZShcclxuICAgIGluaXRpYWxSb3dzLmxlbmd0aCA/IGluaXRpYWxSb3dzIDogW3sgc2l6ZTogXCJcIiwgc3RvY2s6IFwiXCIgfV0sXHJcbiAgKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIHNldFJvd3MoaW5pdGlhbFJvd3MubGVuZ3RoID8gaW5pdGlhbFJvd3MgOiBbeyBzaXplOiBcIlwiLCBzdG9jazogXCJcIiB9XSk7XHJcbiAgfSwgW2luaXRpYWxSb3dzXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBzaXplU3RvY2sgPSB7fTtcclxuXHJcbiAgICByb3dzLmZvckVhY2goKHJvdykgPT4ge1xyXG4gICAgICBjb25zdCBzaXplID0gU3RyaW5nKHJvdy5zaXplIHx8IFwiXCIpXHJcbiAgICAgICAgLnRyaW0oKVxyXG4gICAgICAgIC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICBpZiAoIXNpemUpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHN0b2NrID0gTWF0aC5tYXgoMCwgTWF0aC50cnVuYyhOdW1iZXIocm93LnN0b2NrIHx8IDApKSk7XHJcbiAgICAgIHNpemVTdG9ja1tzaXplXSA9IHN0b2NrO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgdG90YWxTdG9jayA9IE9iamVjdC52YWx1ZXMoc2l6ZVN0b2NrKS5yZWR1Y2UoXHJcbiAgICAgIChzdW0sIHF0eSkgPT4gc3VtICsgTnVtYmVyKHF0eSB8fCAwKSxcclxuICAgICAgMCxcclxuICAgICk7XHJcblxyXG4gICAgb25DaGFuZ2U/LihcInNpemVTdG9ja1RleHRcIiwgSlNPTi5zdHJpbmdpZnkoc2l6ZVN0b2NrKSk7XHJcbiAgICBvbkNoYW5nZT8uKFwic3RvY2tcIiwgdG90YWxTdG9jayk7XHJcbiAgfSwgW3Jvd3MsIG9uQ2hhbmdlXSk7XHJcblxyXG4gIGNvbnN0IHVwZGF0ZVJvdyA9IChpbmRleCwga2V5LCB2YWx1ZSkgPT4ge1xyXG4gICAgc2V0Um93cygocHJldikgPT4ge1xyXG4gICAgICBjb25zdCBuZXh0ID0gWy4uLnByZXZdO1xyXG4gICAgICBuZXh0W2luZGV4XSA9IHtcclxuICAgICAgICAuLi5uZXh0W2luZGV4XSxcclxuICAgICAgICBba2V5XTogdmFsdWUsXHJcbiAgICAgIH07XHJcbiAgICAgIHJldHVybiBuZXh0O1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgYWRkUm93ID0gKCkgPT4ge1xyXG4gICAgc2V0Um93cygocHJldikgPT4gWy4uLnByZXYsIHsgc2l6ZTogXCJcIiwgc3RvY2s6IFwiXCIgfV0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlbW92ZVJvdyA9IChpbmRleCkgPT4ge1xyXG4gICAgc2V0Um93cygocHJldikgPT4ge1xyXG4gICAgICBpZiAocHJldi5sZW5ndGggPD0gMSkge1xyXG4gICAgICAgIHJldHVybiBbeyBzaXplOiBcIlwiLCBzdG9jazogXCJcIiB9XTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHByZXYuZmlsdGVyKChfLCByb3dJbmRleCkgPT4gcm93SW5kZXggIT09IGluZGV4KTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt3cmFwcGVyU3R5bGV9PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtoaW50U3R5bGV9PlxyXG4gICAgICAgIEFkZCBwcm9kdWN0IHNpemVzIGFuZCBzdG9jayBwZXIgc2l6ZS4gVG90YWwgc3RvY2sgaXMgYXV0by1jYWxjdWxhdGVkLlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHtyb3dzLm1hcCgocm93LCBpbmRleCkgPT4gKFxyXG4gICAgICAgIDxkaXYga2V5PXtgJHtpbmRleH0tJHtyb3cuc2l6ZX1gfSBzdHlsZT17cm93U3R5bGV9PlxyXG4gICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTaXplIChlLmcuIFMsIE0sIEwsIFhMKVwiXHJcbiAgICAgICAgICAgIHZhbHVlPXtyb3cuc2l6ZX1cclxuICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gdXBkYXRlUm93KGluZGV4LCBcInNpemVcIiwgZXZlbnQudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAgICAgc3R5bGU9e2lucHV0U3R5bGV9XHJcbiAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgbWluPVwiMFwiXHJcbiAgICAgICAgICAgIHN0ZXA9XCIxXCJcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTdG9ja1wiXHJcbiAgICAgICAgICAgIHZhbHVlPXtyb3cuc3RvY2t9XHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHVwZGF0ZVJvdyhpbmRleCwgXCJzdG9ja1wiLCBldmVudC50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgICBzdHlsZT17aW5wdXRTdHlsZX1cclxuICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcmVtb3ZlUm93KGluZGV4KX1cclxuICAgICAgICAgICAgc3R5bGU9e3JlbW92ZUJ1dHRvblN0eWxlfVxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiUmVtb3ZlIHNpemVcIlxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBSZW1vdmVcclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApKX1cclxuXHJcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e2FkZFJvd30gc3R5bGU9e2FkZEJ1dHRvblN0eWxlfT5cclxuICAgICAgICArIEFkZCBTaXplXHJcbiAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgPGlucHV0XHJcbiAgICAgICAgdHlwZT1cImhpZGRlblwiXHJcbiAgICAgICAgbmFtZT1cInNpemVTdG9ja1wiXHJcbiAgICAgICAgdmFsdWU9e0pTT04uc3RyaW5naWZ5KFxyXG4gICAgICAgICAgcm93cy5yZWR1Y2UoKGFjYywgcm93KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpemUgPSBTdHJpbmcocm93LnNpemUgfHwgXCJcIilcclxuICAgICAgICAgICAgICAudHJpbSgpXHJcbiAgICAgICAgICAgICAgLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGlmICghc2l6ZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBhY2M7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGFjY1tzaXplXSA9IE1hdGgubWF4KDAsIE1hdGgudHJ1bmMoTnVtYmVyKHJvdy5zdG9jayB8fCAwKSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYWNjO1xyXG4gICAgICAgICAgfSwge30pLFxyXG4gICAgICAgICl9XHJcbiAgICAgICAgcmVhZE9ubHlcclxuICAgICAgLz5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0U2l6ZVN0b2NrSW5wdXQ7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBDYXRlZ29yeVNob3cgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCB7IHJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzO1xyXG4gIGNvbnN0IFtjYXRlZ29yeSwgc2V0Q2F0ZWdvcnldID0gdXNlU3RhdGUobnVsbCk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAocmVjb3JkICYmIHJlY29yZC5wYXJhbXMpIHtcclxuICAgICAgc2V0Q2F0ZWdvcnkocmVjb3JkLnBhcmFtcyk7XHJcbiAgICB9XHJcbiAgfSwgW3JlY29yZF0pO1xyXG5cclxuICBpZiAoIWNhdGVnb3J5KSB7XHJcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWxvYWRpbmdcIj5Mb2FkaW5nLi4uPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZm9ybWF0RGF0ZSA9IChkYXRlKSA9PiB7XHJcbiAgICBpZiAoIWRhdGUpIHJldHVybiBcIuKAlFwiO1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUpLnRvTG9jYWxlRGF0ZVN0cmluZyhcImVuLVVTXCIsIHtcclxuICAgICAgICB5ZWFyOiBcIm51bWVyaWNcIixcclxuICAgICAgICBtb250aDogXCJsb25nXCIsXHJcbiAgICAgICAgZGF5OiBcIm51bWVyaWNcIixcclxuICAgICAgICBob3VyOiBcIjItZGlnaXRcIixcclxuICAgICAgICBtaW51dGU6IFwiMi1kaWdpdFwiLFxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICByZXR1cm4gXCLigJRcIjtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWNvbnRhaW5lclwiPlxyXG4gICAgICA8c3R5bGU+e2BcclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1jb250YWluZXIge1xyXG4gICAgICAgICAgLS1iZy0xOiB2YXIoLS1jaGFuZ2U4LWJnLTEsICMwNTA5MTQpO1xyXG4gICAgICAgICAgLS1nb2xkOiB2YXIoLS1jaGFuZ2U4LWdvbGQsICNlMmJmNjYpO1xyXG4gICAgICAgICAgLS10ZXh0LW1haW46IHZhcigtLWNoYW5nZTgtdGV4dC1tYWluLCAjZjhmYWZjKTtcclxuICAgICAgICAgIC0tdGV4dC1tdXRlZDogdmFyKC0tY2hhbmdlOC10ZXh0LW11dGVkLCAjOWFhOGMxKTtcclxuICAgICAgICAgIC0tbGluZTogdmFyKC0tY2hhbmdlOC1saW5lLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMjIpKTtcclxuICAgICAgICAgIC0tY2FyZC1iZzogdmFyKC0tY2hhbmdlOC1jYXJkLWJnLCBsaW5lYXItZ3JhZGllbnQoMTYwZGVnLCByZ2JhKDIxLCAzNCwgNjYsIDAuOTYpIDAlLCByZ2JhKDEwLCAxOCwgMzYsIDAuOTYpIDEwMCUpKTtcclxuICAgICAgICAgIC0tc2hhZG93OiB2YXIoLS1jaGFuZ2U4LXNoYWRvdywgMCA4cHggMjZweCByZ2JhKDAsIDAsIDAsIDAuMykpO1xyXG5cclxuICAgICAgICAgIHBhZGRpbmc6IDMycHg7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tYWluKTtcclxuICAgICAgICAgIGZvbnQtZmFtaWx5OiBcIlBvcHBpbnNcIiwgXCJTZWdvZSBVSVwiLCBzYW5zLXNlcmlmO1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEyMGRlZywgdmFyKC0tYmctMSkgMCUsIHJnYmEoMTEsIDI2LCA1NiwgMC44KSA1MCUsIHZhcigtLWJnLTEpIDEwMCUpO1xyXG4gICAgICAgICAgbWluLWhlaWdodDogMTAwdmg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNhdGVnb3J5LXNob3ctY29udGFpbmVyIHtcclxuICAgICAgICAgIC0tY2hhbmdlOC1iZy0xOiAjZjBmNmZmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LWdvbGQ6ICNjMDhiMGY7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtdGV4dC1tYWluOiAjMGYxNzJhO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXRleHQtbXV0ZWQ6ICM0NzU1Njk7XHJcbiAgICAgICAgICAtLWNoYW5nZTgtbGluZTogcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgICAgICAgIC0tY2hhbmdlOC1jYXJkLWJnOiAjZmZmZmZmO1xyXG4gICAgICAgICAgLS1jaGFuZ2U4LXNoYWRvdzogMCA0cHggMjBweCByZ2JhKDE1LCAyMywgNDIsIDAuMDYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctaW5uZXIge1xyXG4gICAgICAgICAgbWF4LXdpZHRoOiA5MDBweDtcclxuICAgICAgICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctaGVhZGVyIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDMycHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1raWNrZXIge1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4zNmVtO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXRpdGxlIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogY2xhbXAoMzJweCwgNXZ3LCA0OHB4KTtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICBsaW5lLWhlaWdodDogMS4xO1xyXG4gICAgICAgICAgbWFyZ2luOiAwIDAgOHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctc3RhdHVzIHtcclxuICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgIGdhcDogOHB4O1xyXG4gICAgICAgICAgbWFyZ2luLXRvcDogMTJweDtcclxuICAgICAgICAgIHBhZGRpbmc6IDZweCAxMnB4O1xyXG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogMjBweDtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMTJlbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXN0YXR1cy5hY3RpdmUge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgzNCwgMTk3LCA5NCwgMC4yKTtcclxuICAgICAgICAgIGNvbG9yOiAjMjJjNTVlO1xyXG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgzNCwgMTk3LCA5NCwgMC40KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LXN0YXR1cy5pbmFjdGl2ZSB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDIzOSwgNjgsIDY4LCAwLjIpO1xyXG4gICAgICAgICAgY29sb3I6ICNlZjQ0NDQ7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDIzOSwgNjgsIDY4LCAwLjQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctY2FyZCB7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saW5lKTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDI0cHg7XHJcbiAgICAgICAgICBwYWRkaW5nOiAzMnB4O1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tY2FyZC1iZyk7XHJcbiAgICAgICAgICBib3gtc2hhZG93OiB2YXIoLS1zaGFkb3cpO1xyXG4gICAgICAgICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDRweCk7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xyXG4gICAgICAgICAgYW5pbWF0aW9uOiBmYWRlLXVwIDU2MG1zIGVhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1zZWN0aW9uLXRpdGxlIHtcclxuICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMThlbTtcclxuICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctc2VjdGlvbiB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyOHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctc2VjdGlvbjpsYXN0LWNoaWxkIHtcclxuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy1maWVsZCB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctZmllbGQ6bGFzdC1jaGlsZCB7XHJcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctbGFiZWwge1xyXG4gICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xOGVtO1xyXG4gICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogOHB4O1xyXG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuY2F0ZWdvcnktc2hvdy12YWx1ZSB7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tYWluKTtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjY7XHJcbiAgICAgICAgICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctdmFsdWUuZ29sZCB7XHJcbiAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctZGVzY3JpcHRpb24ge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjIpO1xyXG4gICAgICAgICAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgIHBhZGRpbmc6IDE2cHggMjBweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjc7XHJcbiAgICAgICAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNhdGVnb3J5LXNob3ctZGVzY3JpcHRpb24ge1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNSwgMjMsIDQyLCAwLjA1KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5jYXRlZ29yeS1zaG93LWRldGFpbHMtZ3JpZCB7XHJcbiAgICAgICAgICBkaXNwbGF5OiBncmlkO1xyXG4gICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoYXV0by1maXQsIG1pbm1heCgyMDBweCwgMWZyKSk7XHJcbiAgICAgICAgICBnYXA6IDI0cHg7XHJcbiAgICAgICAgICBtYXJnaW4tdG9wOiAxNnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctZGV0YWlsLWl0ZW0ge1xyXG4gICAgICAgICAgcGFkZGluZzogMTZweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xKTtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saW5lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGh0bWxbZGF0YS1hZG1pbi10aGVtZT0nbGlnaHQnXSAuY2F0ZWdvcnktc2hvdy1kZXRhaWwtaXRlbSB7XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDE1LCAyMywgNDIsIDAuMDMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmNhdGVnb3J5LXNob3ctZGl2aWRlciB7XHJcbiAgICAgICAgICBoZWlnaHQ6IDFweDtcclxuICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgyMjYsIDE5MSwgMTAyLCAwKSwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjI4KSwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwKSk7XHJcbiAgICAgICAgICBtYXJnaW46IDI0cHggMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBrZXlmcmFtZXMgZmFkZS11cCB7XHJcbiAgICAgICAgICBmcm9tIHtcclxuICAgICAgICAgICAgb3BhY2l0eTogMDtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDhweCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0byB7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA3MjBweCkge1xyXG4gICAgICAgICAgLmNhdGVnb3J5LXNob3ctY29udGFpbmVyIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMjBweCAxNnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jYXRlZ29yeS1zaG93LWNhcmQge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAyNHB4IDIwcHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNhdGVnb3J5LXNob3ctZGV0YWlscy1ncmlkIHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBgfTwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctaW5uZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctaGVhZGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3cta2lja2VyXCI+Q2F0ZWdvcnkgT3ZlcnZpZXc8L2Rpdj5cclxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXRpdGxlXCI+e2NhdGVnb3J5Lm5hbWUgfHwgXCLigJRcIn08L2gxPlxyXG4gICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICBjbGFzc05hbWU9e2BjYXRlZ29yeS1zaG93LXN0YXR1cyAke2NhdGVnb3J5LmlzQWN0aXZlID8gXCJhY3RpdmVcIiA6IFwiaW5hY3RpdmVcIn1gfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICA8c3Bhbj7il488L3NwYW4+XHJcbiAgICAgICAgICAgIHtjYXRlZ29yeS5pc0FjdGl2ZSA/IFwiQWN0aXZlXCIgOiBcIkluYWN0aXZlXCJ9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXNlY3Rpb24tdGl0bGVcIj5EZXNjcmlwdGlvbjwvaDM+XHJcbiAgICAgICAgICAgIHtjYXRlZ29yeS5kZXNjcmlwdGlvbiA/IChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGVzY3JpcHRpb25cIj5cclxuICAgICAgICAgICAgICAgIHtjYXRlZ29yeS5kZXNjcmlwdGlvbn1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXZhbHVlXCJcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLXRleHQtbXV0ZWQpXCIgfX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICBObyBkZXNjcmlwdGlvbiBwcm92aWRlZFxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRpdmlkZXJcIiAvPlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1zZWN0aW9uXCI+XHJcbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXNlY3Rpb24tdGl0bGVcIj5EZXRhaWxzPC9oMz5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kZXRhaWxzLWdyaWRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGV0YWlsLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWxhYmVsXCI+Q2F0ZWdvcnkgSUQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXZhbHVlIGdvbGRcIlxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiBcIm1vbm9zcGFjZVwiLCBmb250U2l6ZTogXCIxNHB4XCIgfX1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAge2NhdGVnb3J5LmlkIHx8IFwi4oCUXCJ9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWRldGFpbC1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1sYWJlbFwiPlNsdWc8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXZhbHVlXCI+XHJcbiAgICAgICAgICAgICAgICAgIHtjYXRlZ29yeS5zbHVnIHx8IFwi4oCUXCJ9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGl2aWRlclwiIC8+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LXNlY3Rpb25cIj5cclxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctc2VjdGlvbi10aXRsZVwiPlRpbWVsaW5lPC9oMz5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy1kZXRhaWxzLWdyaWRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGV0YWlsLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWxhYmVsXCI+Q3JlYXRlZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctdmFsdWVcIj5cclxuICAgICAgICAgICAgICAgICAge2Zvcm1hdERhdGUoY2F0ZWdvcnkuY3JlYXRlZEF0KX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhdGVnb3J5LXNob3ctZGV0YWlsLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjYXRlZ29yeS1zaG93LWxhYmVsXCI+TGFzdCBVcGRhdGVkPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktc2hvdy12YWx1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICB7Zm9ybWF0RGF0ZShjYXRlZ29yeS51cGRhdGVkQXQpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IENhdGVnb3J5U2hvdztcclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3Qgd3JhcHBlclN0eWxlID0ge1xyXG4gIG1pbkhlaWdodDogXCIxMDAlXCIsXHJcbiAgcGFkZGluZzogXCIyOHB4XCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZmZmZmZmXCIsXHJcbiAgY29sb3I6IFwiIzExMTgyN1wiLFxyXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLFxyXG4gIGdhcDogXCIxOHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBjYXJkU3R5bGUgPSB7XHJcbiAgYm9yZGVyUmFkaXVzOiBcIjIwcHhcIixcclxuICBib3JkZXI6IFwiMXB4IHNvbGlkIHJnYmEoMTcsIDI0LCAzOSwgMC4wOClcIixcclxuICBiYWNrZ3JvdW5kOiBcIiNmZmZmZmZcIixcclxuICBib3hTaGFkb3c6IFwiMCAxOHB4IDM0cHggcmdiYSgxNSwgMjMsIDQyLCAwLjA4KVwiLFxyXG4gIHBhZGRpbmc6IFwiMjRweFwiLFxyXG59O1xyXG5cclxuY29uc3QgdGl0bGVTdHlsZSA9IHtcclxuICBtYXJnaW46IDAsXHJcbiAgZm9udFNpemU6IFwiY2xhbXAoMjhweCwgNHZ3LCA0NHB4KVwiLFxyXG4gIGxpbmVIZWlnaHQ6IDEsXHJcbiAgZm9udFdlaWdodDogODAwLFxyXG59O1xyXG5cclxuY29uc3QgdGV4dFN0eWxlID0ge1xyXG4gIG1hcmdpbjogMCxcclxuICBjb2xvcjogXCIjNDc1NTY5XCIsXHJcbiAgbGluZUhlaWdodDogMS44LFxyXG4gIGZvbnRTaXplOiBcIjE1cHhcIixcclxufTtcclxuXHJcbmNvbnN0IEFib3V0ID0gKCkgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt3cmFwcGVyU3R5bGV9PlxyXG4gICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgIDxoMSBzdHlsZT17dGl0bGVTdHlsZX0+QWJvdXQ8L2gxPlxyXG4gICAgICAgIDxwIHN0eWxlPXt0ZXh0U3R5bGV9PlxyXG4gICAgICAgICAgVGhpcyBhZG1pbiBkYXNoYm9hcmQgaXMgdXNlZCB0byBtYW5hZ2Ugc2hvcCBwcm9kdWN0cywgb3JkZXJzLCBvcmRlclxyXG4gICAgICAgICAgaXRlbXMsIGNhdGVnb3JpZXMsIGFuZCBzZXR0aW5ncyBpbiBvbmUgcGxhY2UuXHJcbiAgICAgICAgPC9wPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgPGgyIHN0eWxlPXt7IC4uLnRpdGxlU3R5bGUsIGZvbnRTaXplOiBcIjI0cHhcIiwgbWFyZ2luQm90dG9tOiBcIjEycHhcIiB9fT5cclxuICAgICAgICAgIFdoYXQgeW91IGNhbiBkbyBoZXJlXHJcbiAgICAgICAgPC9oMj5cclxuICAgICAgICA8cCBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICAgIEJyb3dzZSBwcm9kdWN0cywgb3BlbiBwcm9kdWN0IGRldGFpbHMsIGNyZWF0ZSBvcmRlcnMsIGFuZCBtYW5hZ2UgdGhlXHJcbiAgICAgICAgICBzdG9yZSBkYXRhIGZyb20gdGhlIEFkbWluSlMgaW50ZXJmYWNlLlxyXG4gICAgICAgIDwvcD5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWJvdXQ7XHJcbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IERhc2hib2FyZCBmcm9tICcuLi9hZG1pbi9kYXNoYm9hcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRhc2hib2FyZCA9IERhc2hib2FyZFxuaW1wb3J0IFJlZ2lzdGVyIGZyb20gJy4uL2FkbWluL3JlZ2lzdGVyJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5SZWdpc3RlciA9IFJlZ2lzdGVyXG5pbXBvcnQgUHJvZHVjdENhcmRzTGlzdCBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LWNhcmRzLWxpc3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RDYXJkc0xpc3QgPSBQcm9kdWN0Q2FyZHNMaXN0XG5pbXBvcnQgUHJvZHVjdFNob3cgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1zaG93J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0U2hvdyA9IFByb2R1Y3RTaG93XG5pbXBvcnQgT3JkZXJDcmVhdGUgZnJvbSAnLi4vYWRtaW4vb3JkZXItY3JlYXRlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlckNyZWF0ZSA9IE9yZGVyQ3JlYXRlXG5pbXBvcnQgT3JkZXJTaG93IGZyb20gJy4uL2FkbWluL29yZGVyLXNob3cnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLk9yZGVyU2hvdyA9IE9yZGVyU2hvd1xuaW1wb3J0IE9yZGVySXRlbVNob3cgZnJvbSAnLi4vYWRtaW4vb3JkZXItaXRlbS1zaG93J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5PcmRlckl0ZW1TaG93ID0gT3JkZXJJdGVtU2hvd1xuaW1wb3J0IFByb2R1Y3RJbWFnZSBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LWltYWdlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0SW1hZ2UgPSBQcm9kdWN0SW1hZ2VcbmltcG9ydCBQcm9kdWN0SW1hZ2VVcGxvYWQgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS11cGxvYWQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RJbWFnZVVwbG9hZCA9IFByb2R1Y3RJbWFnZVVwbG9hZFxuaW1wb3J0IFByb2R1Y3RTaXplU3RvY2tJbnB1dCBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LXNpemUtc3RvY2staW5wdXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RTaXplU3RvY2tJbnB1dCA9IFByb2R1Y3RTaXplU3RvY2tJbnB1dFxuaW1wb3J0IENhdGVnb3J5U2hvdyBmcm9tICcuLi9hZG1pbi9jYXRlZ29yeS1zaG93J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5DYXRlZ29yeVNob3cgPSBDYXRlZ29yeVNob3dcbmltcG9ydCBBYm91dCBmcm9tICcuLi9hZG1pbi9hYm91dCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuQWJvdXQgPSBBYm91dCJdLCJuYW1lcyI6WyJmb3JtYXRDdXJyZW5jeSIsInZhbHVlIiwiYW1vdW50IiwiTnVtYmVyIiwidG9Mb2NhbGVTdHJpbmciLCJ1bmRlZmluZWQiLCJtaW5pbXVtRnJhY3Rpb25EaWdpdHMiLCJtYXhpbXVtRnJhY3Rpb25EaWdpdHMiLCJwcm9kdWN0SW1hZ2UiLCJwcm9kdWN0IiwicmVzb2x2ZWQiLCJpbWFnZSIsImltYWdlVXJsIiwidGh1bWJuYWlsIiwiY292ZXIiLCJub3JtYWxpemVkIiwiU3RyaW5nIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsInByb2R1Y3RMYWJlbCIsIm5hbWUiLCJzcGxpdCIsInNsaWNlIiwibWFwIiwicGFydCIsImpvaW4iLCJ0b1VwcGVyQ2FzZSIsIm5vcm1hbGl6ZVByb2R1Y3QiLCJpdGVtIiwicmVjb3JkIiwicGFyYW1zIiwiaWQiLCJwcmljZSIsImlzQWN0aXZlIiwiQm9vbGVhbiIsInN0b2NrIiwiY2F0ZWdvcnlOYW1lIiwiY2F0ZWdvcnkiLCJjYXRlZ29yeUlkIiwicmVjb3JkQWN0aW9ucyIsImFjdGlvbnMiLCJub3JtYWxpemVPcmRlciIsInN0YXR1cyIsInRvdGFsQW1vdW50IiwiY3JlYXRlZEF0IiwidXNlck5hbWUiLCJ1c2VyIiwiY3VzdG9tZXJOYW1lIiwic2hpcHBpbmdOYW1lIiwiZ2V0U2hvd0hyZWYiLCJzaG93QWN0aW9uIiwiZmluZCIsImFjdGlvbiIsImhyZWYiLCJlbmNvZGVVUklDb21wb25lbnQiLCJEYXNoYm9hcmQiLCJzdW1tYXJ5Iiwic2V0U3VtbWFyeSIsInVzZVN0YXRlIiwidXNlcnMiLCJwcm9kdWN0cyIsImNhdGVnb3JpZXMiLCJvcmRlcnMiLCJyZWNvcmRzIiwic2V0UmVjb3JkcyIsInJlY2VudE9yZGVycyIsInNldFJlY2VudE9yZGVycyIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwic2VhcmNoVGVybSIsInNldFNlYXJjaFRlcm0iLCJjdXJyZW50U2xpZGUiLCJzZXRDdXJyZW50U2xpZGUiLCJjdXJyZW50VXNlck5hbWUiLCJzZXRDdXJyZW50VXNlck5hbWUiLCJjdXJyZW50VXNlclJvbGUiLCJzZXRDdXJyZW50VXNlclJvbGUiLCJpc1VzZXJNZW51T3BlbiIsInNldElzVXNlck1lbnVPcGVuIiwidXNlRWZmZWN0Iiwicm9vdCIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsImlzTW91bnRlZCIsImxvYWREYXNoYm9hcmQiLCJzdW1tYXJ5UmVzcG9uc2UiLCJwcm9kdWN0c1Jlc3BvbnNlIiwib3JkZXJzUmVzcG9uc2UiLCJQcm9taXNlIiwiYWxsIiwiZmV0Y2giLCJjcmVkZW50aWFscyIsInN1bW1hcnlQYXlsb2FkIiwib2siLCJqc29uIiwicHJvZHVjdFBheWxvYWQiLCJvcmRlclBheWxvYWQiLCJsb2FkZWRSZWNvcmRzIiwiQXJyYXkiLCJpc0FycmF5IiwibG9hZGVkT3JkZXJzIiwibGVuZ3RoIiwiZXJyb3IiLCJjbG9zZVVzZXJNZW51IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJsb2FkQ3VycmVudFVzZXIiLCJyZXNwb25zZSIsImhlYWRlcnMiLCJBY2NlcHQiLCJwYXlsb2FkIiwidHJpbSIsInJvbGUiLCJhY3RpdmVQcm9kdWN0cyIsInVzZU1lbW8iLCJmaWx0ZXIiLCJmaWx0ZXJlZFByb2R1Y3RzIiwicXVlcnkiLCJoZXJvU2xpZGVzIiwidGltZXIiLCJ3aW5kb3ciLCJzZXRJbnRlcnZhbCIsInByZXZpb3VzIiwiY2xlYXJJbnRlcnZhbCIsImZlYXR1cmVkUHJvZHVjdCIsImhlcm9JbWFnZSIsImhlcm9UaXRsZSIsImhlcm9TdWJ0aXRsZSIsImhlcm9IcmVmIiwib3JkZXJzTGlzdEhyZWYiLCJkaXNwbGF5ZWRQcm9kdWN0cyIsImJ1Y2tldCIsIk1hcCIsImZvckVhY2giLCJzZXQiLCJnZXQiLCJmcm9tIiwiZW50cmllcyIsImNvdW50IiwiaXNBZG1pblVzZXIiLCJhZG1pblByb2R1Y3RSb3dzIiwiY2F0ZWdvcnlQcmV2aWV3IiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwic3R5bGUiLCJwYWRkaW5nIiwia2V5Iiwic3JjIiwiYWx0IiwiY29sU3BhbiIsImNvbG9yIiwiZm9udFdlaWdodCIsImh0bWxGb3IiLCJ3aWR0aCIsImhlaWdodCIsInZpZXdCb3giLCJmaWxsIiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiLCJjeCIsImN5IiwiciIsImQiLCJ0eXBlIiwicGxhY2Vob2xkZXIiLCJvbkNoYW5nZSIsImV2ZW50IiwidGFyZ2V0Iiwib25DbGljayIsInN0b3BQcm9wYWdhdGlvbiIsImxvY2F0aW9uIiwiYXNzaWduIiwiTWF0aCIsIm1heCIsInByZXZlbnREZWZhdWx0Iiwic2xpZGUiLCJpbmRleCIsImRpc3BsYXkiLCJwbGFjZUl0ZW1zIiwiZm9udFNpemUiLCJiYWNrZ3JvdW5kIiwiUmVnaXN0ZXIiLCJmb3JtU3RhdGUiLCJzZXRGb3JtU3RhdGUiLCJlbWFpbCIsInBhc3N3b3JkIiwibWVzc2FnZSIsInNldE1lc3NhZ2UiLCJ0ZXh0IiwiaXNTdWJtaXR0aW5nIiwic2V0SXNTdWJtaXR0aW5nIiwibWFyZ2luIiwiaGFuZGxlQ2hhbmdlIiwiY3VycmVudCIsImhhbmRsZVN1Ym1pdCIsIm1ldGhvZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJkYXRhIiwiRXJyb3IiLCJzZXRUaW1lb3V0Iiwib25TdWJtaXQiLCJyZXF1aXJlZCIsIm1pbkxlbmd0aCIsImRpc2FibGVkIiwiZ3JpZFN0eWxlIiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsImdhcCIsImNhcmRTdHlsZSIsImJvcmRlclJhZGl1cyIsImJvcmRlciIsIm92ZXJmbG93IiwiYm94U2hhZG93IiwiaW1hZ2VXcmFwU3R5bGUiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJpbWFnZVN0eWxlIiwib2JqZWN0Rml0IiwiYm9keVN0eWxlIiwibWV0YVN0eWxlIiwiYmFkZ2VTdHlsZSIsImxldHRlclNwYWNpbmciLCJsaW5rU3R5bGUiLCJtYXJnaW5Ub3AiLCJ0ZXh0RGVjb3JhdGlvbiIsImN1cnNvciIsImVtcHR5U3R5bGUiLCJmb3JtYXRQcmljZSIsImlzRmluaXRlIiwiZ2V0UmVjb3JkSWQiLCJwYXJhbSIsInJlc291cmNlSWQiLCJyYXdIcmVmIiwiUHJvZHVjdENhcmRzTGlzdCIsInByb3BzIiwiYXBpUmVjb3JkcyIsInNldEFwaVJlY29yZHMiLCJsb2FkRXJyb3IiLCJzZXRMb2FkRXJyb3IiLCJyZXNvdXJjZSIsInByb3BSZWNvcmRzIiwibG9hZFJlY29yZHMiLCJkZXRhaWxzSHJlZiIsIm9wZW5EZXRhaWxzIiwicGFnZVN0eWxlIiwibWluSGVpZ2h0IiwidG9wQmFyU3R5bGUiLCJtYXJnaW5Cb3R0b20iLCJmbGV4V3JhcCIsImJhY2tMaW5rU3R5bGUiLCJsYXlvdXRTdHlsZSIsImltYWdlQ2FyZFN0eWxlIiwiZ3JpZFRlbXBsYXRlUm93cyIsImltYWdlRmFsbGJhY2tTdHlsZSIsInRleHRUcmFuc2Zvcm0iLCJpbWFnZUZvb3RlclN0eWxlIiwiYm9yZGVyVG9wIiwidGl0bGVTdHlsZSIsImxpbmVIZWlnaHQiLCJzdWJ0aXRsZVN0eWxlIiwicGlsbFN0eWxlIiwiYWN0aXZlIiwicGlsbERvdFN0eWxlIiwiaW5mb0dyaWRTdHlsZSIsImluZm9DYXJkU3R5bGUiLCJpbmZvTGFiZWxTdHlsZSIsImluZm9WYWx1ZVN0eWxlIiwid29yZEJyZWFrIiwic2VjdGlvblRpdGxlU3R5bGUiLCJkZXNjcmlwdGlvblN0eWxlIiwid2hpdGVTcGFjZSIsImRldGFpbHNHcmlkU3R5bGUiLCJkZXRhaWxSb3dTdHlsZSIsInBhZGRpbmdCb3R0b20iLCJib3JkZXJCb3R0b20iLCJkZXRhaWxMYWJlbFN0eWxlIiwiZGV0YWlsVmFsdWVTdHlsZSIsInRleHRBbGlnbiIsImFjdGlvblJvd1N0eWxlIiwicHJpbWFyeUJ1dHRvblN0eWxlIiwibWluV2lkdGgiLCJzZWNvbmRhcnlCdXR0b25TdHlsZSIsImZvcm1hdERhdGUiLCJkYXRlIiwiRGF0ZSIsImlzTmFOIiwiZ2V0VGltZSIsImRhdGVTdHlsZSIsInRpbWVTdHlsZSIsImdldFByb2R1Y3RJbWFnZSIsInBhcnNlU2l6ZVN0b2NrIiwic291cmNlIiwicGFyc2UiLCJyYXdTaXplIiwicmF3UXR5IiwiT2JqZWN0Iiwic2l6ZSIsInF0eSIsInRydW5jIiwiUHJvZHVjdFNob3ciLCJwcm9kdWN0RGF0YSIsInNldFByb2R1Y3REYXRhIiwicHJvZHVjdElkIiwic2t1Iiwic2l6ZVN0b2NrIiwic2l6ZVN0b2NrRW50cmllcyIsImRlc2NyaXB0aW9uIiwiZWRpdFVybCIsIm9yZGVyVXJsIiwiaGFuZGxlT3JkZXJDbGljayIsImhhbmRsZUVkaXRDbGljayIsInRoZW4iLCJyZXMiLCJjYXRjaCIsInBhZGRpbmdUb3AiLCJ1cGRhdGVkQXQiLCJzdGFja1N0eWxlIiwibGFiZWxTdHlsZSIsImlucHV0U3R5bGUiLCJib3hTaXppbmciLCJmb250RmFtaWx5Iiwicm93U3R5bGUiLCJncmlkMlN0eWxlIiwiY3VzdG9tZXJJbmZvU3R5bGUiLCJjdXN0b21lclJvd1N0eWxlIiwibXV0ZWRTdHlsZSIsInN0cm9uZ1N0eWxlIiwibGluZUl0ZW1Sb3dTdHlsZSIsImxpbmVJdGVtVG9wU3R5bGUiLCJwcm9kdWN0UHJldmlld1N0eWxlIiwiYWRkQnV0dG9uU3R5bGUiLCJyZW1vdmVCdXR0b25TdHlsZSIsInRvdGFsc1Jvd1N0eWxlIiwidG90YWxTdHlsZSIsImFjdGlvbkJhclN0eWxlIiwiYWN0aW9uQnV0dG9uU3R5bGUiLCJwcmltYXJ5IiwibWFwTGlua1N0eWxlIiwicGF5bWVudE9wdGlvbkdyaWRTdHlsZSIsInBheW1lbnRPcHRpb25TdHlsZSIsInNlY3VyaXR5Q2hpcFdyYXBTdHlsZSIsInNlY3VyaXR5Q2hpcFN0eWxlIiwicmVzcG9uc2l2ZUNzcyIsInBheW1lbnRPcHRpb25zIiwibGFiZWwiLCJpY29uIiwiZmFsbGJhY2tTaXplT3B0aW9ucyIsInNoaXBwaW5nTWV0aG9kcyIsInRvTnVtYmVyIiwibnVtIiwiZm9ybWF0TW9uZXkiLCJnZXRTaXplRW50cmllcyIsInNvcnQiLCJhIiwiYiIsImxvY2FsZUNvbXBhcmUiLCJnZXRTaXplT3B0aW9ucyIsImNyZWF0ZUVtcHR5SXRlbSIsInF1YW50aXR5IiwidW5pdFByaWNlIiwiT3JkZXJDcmVhdGUiLCJzZXRVc2VycyIsInNldFByb2R1Y3RzIiwib3JkZXJDb3VudEJ5VXNlciIsInNldE9yZGVyQ291bnRCeVVzZXIiLCJzZXNzaW9uVXNlciIsInNldFNlc3Npb25Vc2VyIiwic3VibWl0dGluZyIsInNldFN1Ym1pdHRpbmciLCJmb3JtRGF0YSIsInNldEZvcm1EYXRhIiwidXNlcklkIiwicGF5bWVudE1ldGhvZCIsInBheW1lbnRTdGF0dXMiLCJ0cmFuc2FjdGlvbklkIiwic2hpcHBpbmdQaG9uZSIsInNoaXBwaW5nQWRkcmVzcyIsInNoaXBwaW5nTWV0aG9kIiwidHJhY2tpbmdOdW1iZXIiLCJzaGlwcGluZ0ZlZSIsInRheCIsImRpc2NvdW50IiwibGluZUl0ZW1zIiwic2V0TGluZUl0ZW1zIiwiaGFkTG9naW5DbGFzc09uUm9vdCIsImNvbnRhaW5zIiwiaGFkTG9naW5DbGFzc09uQm9keSIsImhhZERhc2hib2FyZENsYXNzT25Sb290IiwiaGFkRGFzaGJvYXJkQ2xhc3NPbkJvZHkiLCJsb2dpbkJnTGF5ZXIiLCJnZXRFbGVtZW50QnlJZCIsInByZXZpb3VzTGF5ZXJEaXNwbGF5Iiwic2hlbGxOb2RlcyIsIlNldCIsInF1ZXJ5U2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yQWxsIiwicHJldmlvdXNJbmxpbmVCYWNrZ3JvdW5kcyIsIm5vZGUiLCJnZXRQcm9wZXJ0eVZhbHVlIiwiYmFja2dyb3VuZFByaW9yaXR5IiwiZ2V0UHJvcGVydHlQcmlvcml0eSIsImJhY2tncm91bmRDb2xvciIsImJhY2tncm91bmRDb2xvclByaW9yaXR5IiwiYmFja2dyb3VuZEltYWdlIiwiYmFja2dyb3VuZEltYWdlUHJpb3JpdHkiLCJzZXRQcm9wZXJ0eSIsInN0eWxlcyIsInJlbW92ZVByb3BlcnR5IiwiVVJMU2VhcmNoUGFyYW1zIiwic2VhcmNoIiwicHJlUHJvZHVjdElkIiwiZmV0Y2hEYXRhIiwiY29udGV4dFJlcyIsImNvbnRleHREYXRhIiwidXNlcnNEYXRhIiwicHJvZHVjdHNMaXN0IiwiY3VycmVudFVzZXIiLCJwcmV2Iiwic2VsZWN0ZWRQcm9kdWN0Iiwic2VsZWN0ZWRQcm9kdWN0U2l6ZU9wdGlvbnMiLCJzb21lIiwicCIsInNlbGVjdGVkIiwic2VsZWN0ZWRDdXN0b21lciIsInUiLCJjdXN0b21lck9yZGVyQ291bnQiLCJwaG9uZSIsIm1vYmlsZSIsImxpbmVUb3RhbHMiLCJzdWJ0b3RhbCIsInJlZHVjZSIsInN1bSIsImdyYW5kVG90YWwiLCJoYW5kbGVGb3JtQ2hhbmdlIiwiaGFuZGxlTGluZUl0ZW1DaGFuZ2UiLCJuZXh0Iiwic2l6ZU9wdGlvbnMiLCJtYXhRdHlGb3JTaXplIiwibWluIiwic2VsZWN0ZWRTaXplT3B0aW9uIiwib3B0aW9uIiwicGFyc2VkUXR5IiwiYWRkTGluZUl0ZW0iLCJyZW1vdmVMaW5lSXRlbSIsIl8iLCJpIiwibWFwc0hyZWYiLCJ2YWxpZEl0ZW1zIiwiYWxlcnQiLCJzaXplRW50cmllcyIsInNlbGVjdGVkU2l6ZSIsImVudHJ5IiwidG9GaXhlZCIsInN1Ym1pdEZvcm0iLCJGb3JtRGF0YSIsImFwcGVuZCIsIm9yZGVyUmVzIiwib3JkZXJEYXRhIiwicmVhZE9ubHkiLCJzaXplU3RvY2tUZXh0IiwiaXRlbVRvdGFsIiwic2l6ZU9wdGlvbiIsInN0ZXAiLCJyZXNpemUiLCJyZWwiLCJoaXN0b3J5IiwiYmFjayIsImhlYWRlclN0eWxlIiwiaGVhZGluZ1N0eWxlIiwic3ViVGV4dFN0eWxlIiwidmFsIiwic3R5bGVCeVN0YXR1cyIsInBlbmRpbmciLCJiZyIsImZnIiwicGFpZCIsInByb2Nlc3NpbmciLCJzaGlwcGVkIiwiY29tcGxldGVkIiwiY2FuY2VsbGVkIiwiaW5mb1Jvd1N0eWxlIiwidGFibGVTdHlsZSIsImxpbmVJdGVtU3R5bGUiLCJ0b3RhbEJveFN0eWxlIiwidG90YWxSb3dTdHlsZSIsImdyYW5kU3R5bGUiLCJuIiwiZHQiLCJPcmRlclNob3ciLCJkZXRhaWxzIiwic2V0RGV0YWlscyIsInNldEVycm9yIiwib3JkZXJJZCIsImxvYWREZXRhaWxzIiwiZmV0Y2hFcnJvciIsInRvdGFscyIsIml0ZW1zIiwidG90YWxQcmljZSIsImVtcHR5SW1hZ2VTdHlsZSIsIk9yZGVySXRlbVNob3ciLCJvcmRlckl0ZW1JZCIsImNhbGN1bGF0ZWRUb3RhbCIsIm9yZGVyIiwiY3VzdG9tZXIiLCJjZWxsU3R5bGUiLCJmbGV4U2hyaW5rIiwiZmFsbGJhY2tTdHlsZSIsInRleHRTdHlsZSIsImZsZXhEaXJlY3Rpb24iLCJQcm9kdWN0SW1hZ2UiLCJwcm9wZXJ0eSIsInBhdGgiLCJoYXNFcnJvciIsInNldEhhc0Vycm9yIiwib25FcnJvciIsIndyYXBwZXJTdHlsZSIsInByZXZpZXdTdHlsZSIsImhpbnRTdHlsZSIsIlByb2R1Y3RJbWFnZVVwbG9hZCIsImN1cnJlbnRWYWx1ZSIsImN1cnJlbnRQdWJsaWNJZCIsImltYWdlUHVibGljSWQiLCJwcmV2aWV3VXJsIiwic2V0UHJldmlld1VybCIsInB1YmxpY0lkIiwic2V0UHVibGljSWQiLCJ1cGxvYWRpbmciLCJzZXRVcGxvYWRpbmciLCJoYW5kbGVVcGxvYWQiLCJmaWxlIiwiZmlsZXMiLCJ1cGxvYWRlZFVybCIsInVybCIsInVwbG9hZGVkUHVibGljSWQiLCJ1cGxvYWRFcnJvciIsImhhbmRsZVJlbW92ZSIsImFjY2VwdCIsIkZyYWdtZW50IiwicGFyc2VJbml0aWFsVmFsdWUiLCJQcm9kdWN0U2l6ZVN0b2NrSW5wdXQiLCJpbml0aWFsUm93cyIsInJvd3MiLCJzZXRSb3dzIiwicm93IiwidG90YWxTdG9jayIsInZhbHVlcyIsInVwZGF0ZVJvdyIsImFkZFJvdyIsInJlbW92ZVJvdyIsInJvd0luZGV4IiwiYWNjIiwiQ2F0ZWdvcnlTaG93Iiwic2V0Q2F0ZWdvcnkiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJ5ZWFyIiwibW9udGgiLCJkYXkiLCJob3VyIiwibWludXRlIiwic2x1ZyIsIkFib3V0IiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBRUEsTUFBTUEsZ0JBQWMsR0FBSUMsS0FBSyxJQUFLO0VBQ2hDLEVBQUEsTUFBTUMsTUFBTSxHQUFHQyxNQUFNLENBQUNGLEtBQUssSUFBSSxDQUFDLENBQUM7RUFDakMsRUFBQSxPQUFPLE9BQU9DLE1BQU0sQ0FBQ0UsY0FBYyxDQUFDQyxTQUFTLEVBQUU7SUFDN0NDLHFCQUFxQixFQUFFSixNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztBQUMvQ0ssSUFBQUEscUJBQXFCLEVBQUU7QUFDekIsR0FBQyxDQUFDLENBQUEsQ0FBRTtFQUNOLENBQUM7RUFFRCxNQUFNQyxZQUFZLEdBQUlDLE9BQU8sSUFBSztFQUNoQyxFQUFBLE1BQU1DLFFBQVEsR0FDWkQsT0FBTyxFQUFFRSxLQUFLLElBQ2RGLE9BQU8sRUFBRUcsUUFBUSxJQUNqQkgsT0FBTyxFQUFFSSxTQUFTLElBQ2xCSixPQUFPLEVBQUVLLEtBQUssSUFDZCxrQkFBa0I7SUFFcEIsTUFBTUMsVUFBVSxHQUFHQyxNQUFNLENBQUNOLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQ08sV0FBVyxFQUFFO0VBQ3ZELEVBQUEsSUFBSUYsVUFBVSxDQUFDRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUlILFVBQVUsQ0FBQ0csUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0VBQzlELElBQUEsT0FBTyxrQkFBa0I7RUFDM0IsRUFBQTtFQUVBLEVBQUEsT0FBT1IsUUFBUTtFQUNqQixDQUFDO0VBRUQsTUFBTVMsWUFB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUNBQUEsRUFBbUNsQixTQUFTLENBQUE7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBQSxDQUFlLENBQUMsZUFFVmlCLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7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
