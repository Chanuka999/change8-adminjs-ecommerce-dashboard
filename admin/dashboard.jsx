import React, { useEffect, useMemo, useState } from "react";

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `Rs. ${amount.toLocaleString(undefined, {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

const getOptimizedImageUrl = (url, width = 960, quality = "auto") => {
  const source = String(url || "").trim();
  if (!source) {
    return "";
  }

  if (!source.includes("res.cloudinary.com") || !source.includes("/upload/")) {
    return source;
  }

  return source.replace(
    "/upload/",
    `/upload/f_auto,q_${quality},w_${width},c_limit,dpr_auto/`,
  );
};

const productImage = (product) => {
  const resolved =
    product?.image ||
    product?.imageUrl ||
    product?.thumbnail ||
    product?.cover ||
    "/public/img3.png";

  const normalized = String(resolved || "").toLowerCase();
  if (normalized.includes("img1") || normalized.includes("img2")) {
    return "/public/img3.png";
  }

  return resolved;
};

const productLabel = (product) => {
  const name = String(product?.name || "product");
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const normalizeProduct = (item) => {
  const record = item?.params ? item.params : item || {};

  return {
    id: record.id ?? item?.id,
    name: record.name || "Untitled product",
    price: Number(record.price || 0),
    imageUrl: record.imageUrl || "",
    isActive: Boolean(record.isActive),
    stock: Number(record.stock || 0),
    categoryName:
      record?.category?.name ||
      record?.categoryName ||
      record?.categoryId ||
      "Shop",
    recordActions: item?.recordActions || item?.actions || [],
  };
};

const normalizeOrder = (item) => {
  const record = item?.params ? item.params : item || {};

  return {
    id: record.id ?? item?.id,
    status: String(record.status || "pending"),
    totalAmount: Number(record.totalAmount || 0),
    createdAt: record.createdAt || item?.createdAt || null,
    userName:
      record?.user?.name ||
      record?.customerName ||
      record?.shippingName ||
      "Order",
    recordActions: item?.recordActions || item?.actions || [],
  };
};

const getShowHref = (product) => {
  const recordActions = product?.recordActions || [];
  const showAction = recordActions.find((action) => action?.name === "show");
  if (showAction?.href) {
    return showAction.href;
  }

  return product?.id
    ? `/admin/resources/Products/records/${encodeURIComponent(product.id)}/show`
    : "";
};

const getCookieValue = (name) => {
  if (typeof document === "undefined") {
    return "";
  }

  const encodedName = `${name}=`;
  return (
    document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(encodedName))
      ?.slice(encodedName.length) || ""
  );
};

const Dashboard = () => {
  const [summary, setSummary] = useState({
    users: 0,
    products: 0,
    categories: 0,
    orders: 0,
  });
  const [records, setRecords] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [isRoleResolved, setIsRoleResolved] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.add("change8-storefront-dashboard-page");
    body?.classList.add("change8-storefront-dashboard-page");

    return () => {
      root.classList.remove("change8-storefront-dashboard-page");
      body?.classList.remove("change8-storefront-dashboard-page");
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);

      try {
        const [summaryResponse, productsResponse, ordersResponse] =
          await Promise.all([
            fetch("/admin/api/dashboard", { credentials: "same-origin" }),
            fetch("/api/products?lean=true&limit=24", {
              credentials: "same-origin",
            }),
            fetch("/admin/api/resources/Orders/actions/list", {
              credentials: "same-origin",
            }),
          ]);

        const summaryPayload = summaryResponse.ok
          ? await summaryResponse.json()
          : {};
        const productPayload = productsResponse.ok
          ? await productsResponse.json()
          : [];
        const orderPayload = ordersResponse.ok
          ? await ordersResponse.json()
          : {};

        if (!isMounted) {
          return;
        }

        const loadedRecords = Array.isArray(productPayload)
          ? productPayload.map(normalizeProduct)
          : [];

        const loadedOrders = Array.isArray(orderPayload?.records)
          ? orderPayload.records.map(normalizeOrder)
          : [];

        setSummary({
          users: Number(summaryPayload?.users || 0),
          products: Number(
            summaryPayload?.products || loadedRecords.length || 0,
          ),
          categories: Number(summaryPayload?.categories || 0),
          orders: Number(summaryPayload?.orders || 0),
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

  useEffect(() => {
    const closeUserMenu = () => {
      setIsUserMenuOpen(false);
    };

    document.addEventListener("click", closeUserMenu);

    return () => {
      document.removeEventListener("click", closeUserMenu);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      try {
        const response = await fetch("/admin/context/current-user", {
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();

        if (isMounted) {
          setCurrentUserName(String(payload?.name || "").trim());
          const resolvedRole = String(payload?.role || "")
            .trim()
            .toLowerCase();

          if (resolvedRole) {
            setCurrentUserRole(resolvedRole);
          }

          setIsRoleResolved(true);
        }
      } catch (error) {
        if (isMounted) {
          setCurrentUserName("");
          setIsRoleResolved(true);
        }
      }
    };

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeProducts = useMemo(() => {
    return records.filter((product) => product.isActive !== false);
  }, [records]);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return activeProducts;
    }

    return activeProducts.filter((product) => {
      return [
        product.name,
        String(product.categoryName || ""),
        String(product.stock || ""),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [activeProducts, searchTerm]);

  const heroSlides = useMemo(() => {
    return [
      {
        id: "img3-static",
        name: "New Collection",
        categoryName: "Featured",
        imageUrl: "/public/img3.png",
        isActive: true,
        stock: 0,
        price: 0,
        recordActions: [],
      },
      {
        id: "img4-static",
        name: "Latest Drop",
        categoryName: "Featured",
        imageUrl: "/public/img4.png",
        isActive: true,
        stock: 0,
        price: 0,
        recordActions: [],
      },
      {
        id: "img5-static",
        name: "Latest Drop",
        categoryName: "Featured",
        imageUrl: "/public/img5.png",
        isActive: true,
        stock: 0,
        price: 0,
        recordActions: [],
      },
    ];
  }, []);

  useEffect(() => {
    if (heroSlides.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % heroSlides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (currentSlide >= heroSlides.length) {
      setCurrentSlide(0);
    }
  }, [currentSlide, heroSlides.length]);

  const featuredProduct =
    heroSlides[currentSlide] || activeProducts[0] || records[0] || null;
  const heroImage = getOptimizedImageUrl(productImage(featuredProduct), 1400);
  const heroTitle = featuredProduct?.name || "Revive Me Jett";
  const heroSubtitle = featuredProduct?.categoryName || "Oversize Tee";
  const heroHref = getShowHref(featuredProduct);
  const ordersListHref = "/admin/resources/Orders/actions/list";

  const displayedProducts = useMemo(() => {
    return filteredProducts;
  }, [filteredProducts]);

  const categories = useMemo(() => {
    const bucket = new Map();

    records.forEach((product) => {
      const name = String(product.categoryName || "Shop");
      bucket.set(name, (bucket.get(name) || 0) + 1);
    });

    return Array.from(bucket.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [records]);

  const isAdminUser = currentUserRole === "admin";
  const adminProductRows = Array.isArray(records) ? records.slice(0, 12) : [];
  const categoryPreview = categories.slice(0, 6);

  if (!isRoleResolved) {
    return (
      <div
        className="change8-admin-dashboard"
        style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "14px",
            border: "1px solid rgba(15, 23, 42, 0.08)",
            background: "#ffffff",
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
            color: "#0f172a",
            fontWeight: 700,
          }}
        >
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (isAdminUser) {
    return (
      <div className="change8-admin-dashboard">
        <style>{`
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

          .change8-admin-action--logout {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
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
            padding: 22px 20px 20px 20px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            position: relative;
            overflow: hidden;
            transition: box-shadow 0.2s, transform 0.2s;
            box-shadow: 0 8px 24px rgba(99,102,241,0.08);
          }

          .change8-admin-card:hover {
            box-shadow: 0 16px 32px rgba(99,102,241,0.16);
            transform: translateY(-2px) scale(1.025);
          }

          .change8-admin-card .dashboard-card-icon {
            font-size: 2.2rem;
            margin-bottom: 10px;
            opacity: 0.85;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: #fff;
            border-radius: 12px;
            padding: 10px;
            box-shadow: 0 2px 8px rgba(139,92,246,0.10);
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .change8-admin-card.users .dashboard-card-icon {
            background: linear-gradient(135deg, #38bdf8 0%, #6366f1 100%);
          }
          .change8-admin-card.products .dashboard-card-icon {
            background: linear-gradient(135deg, #fbbf24 0%, #f472b6 100%);
          }
          .change8-admin-card.orders .dashboard-card-icon {
            background: linear-gradient(135deg, #34d399 0%, #38bdf8 100%);
          }
          .change8-admin-card.categories .dashboard-card-icon {
            background: linear-gradient(135deg, #f472b6 0%, #a78bfa 100%);
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
        `}</style>

        <div className="change8-admin-dashboard-grid">
          <div className="change8-admin-dashboard-header">
            <div>
              <h1 className="change8-admin-dashboard-title">Admin Dashboard</h1>
              <p className="change8-admin-dashboard-subtitle">
                Manage your shop data, products, orders, and users from here.
              </p>
            </div>

            <div className="change8-admin-actions">
              <a
                className="change8-admin-action change8-admin-action--logout"
                href="/admin/logout"
              >
                Logout
              </a>
              <a
                className="change8-admin-action change8-admin-action--primary"
                href="/admin/resources/Products/actions/new"
              >
                + Add Product
              </a>
              <a
                className="change8-admin-action"
                href="/admin/resources/Categories/actions/new"
              >
                + Add Category
              </a>
            </div>
          </div>

          <div className="change8-admin-dashboard-cards">
            <div className="change8-admin-card users">
              <span
                className="dashboard-card-icon"
                role="img"
                aria-label="Users"
              >
                👥
              </span>
              <div className="change8-admin-card-label">Users</div>
              <div className="change8-admin-card-value">{summary.users}</div>
            </div>
            <div className="change8-admin-card products">
              <span
                className="dashboard-card-icon"
                role="img"
                aria-label="Products"
              >
                🛒
              </span>
              <div className="change8-admin-card-label">Products</div>
              <div className="change8-admin-card-value">{summary.products}</div>
            </div>
            <div className="change8-admin-card orders">
              <span
                className="dashboard-card-icon"
                role="img"
                aria-label="Orders"
              >
                📦
              </span>
              <div className="change8-admin-card-label">Orders</div>
              <div className="change8-admin-card-value">{summary.orders}</div>
            </div>
            <div className="change8-admin-card categories">
              <span
                className="dashboard-card-icon"
                role="img"
                aria-label="Categories"
              >
                🏷️
              </span>
              <div className="change8-admin-card-label">Categories</div>
              <div className="change8-admin-card-value">
                {summary.categories}
              </div>
            </div>
          </div>

          <div className="change8-admin-dashboard-links">
            <a
              className="change8-admin-link"
              href="/admin/resources/Products/actions/list"
            >
              <strong>Products</strong>
              Open product list and manage inventory.
            </a>
            <a
              className="change8-admin-link"
              href="/admin/resources/Orders/actions/list"
            >
              <strong>Orders</strong>
              Review and process customer orders.
            </a>
            <a
              className="change8-admin-link"
              href="/admin/resources/Users/actions/list"
            >
              <strong>Users</strong>
              View registered users and roles.
            </a>
          </div>

          <div className="change8-admin-panel" style={{ padding: "20px" }}>
            <h2 className="change8-admin-section-title">Products Table</h2>
            <div className="change8-admin-table-wrap">
              <table className="change8-admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {adminProductRows.length ? (
                    adminProductRows.map((product) => (
                      <tr key={product.id}>
                        <td className="change8-admin-thumb-cell">
                          <img
                            className="change8-admin-thumb"
                            src={getOptimizedImageUrl(
                              productImage(product),
                              320,
                            )}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.categoryName || "-"}</td>
                        <td>{Number(product.stock || 0)}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>
                          <span
                            className={`change8-admin-status-pill ${
                              product.isActive
                                ? "change8-admin-status-pill--active"
                                : "change8-admin-status-pill--inactive"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <a href={getShowHref(product)}>View</a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ color: "#64748b" }}>
                        No products available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="change8-admin-panel" style={{ padding: "20px" }}>
            <h2 className="change8-admin-section-title">Categories</h2>
            <div className="change8-admin-category-list">
              {categoryPreview.map((category) => (
                <div
                  key={category.name}
                  className="change8-admin-category-item"
                >
                  <span>
                    <strong className="change8-admin-category-name">
                      {category.name}
                    </strong>
                    <span className="change8-admin-category-meta">
                      Products in category
                    </span>
                  </span>
                  <span style={{ fontWeight: 700 }}>{category.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="change8-storefront-dashboard">
      <style>{`
        .change8-storefront-dashboard {
          --bg: #ffffff;
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

        .change8-nav,
        .change8-search,
        .change8-user-toggle,
        .change8-logout-button,
        .change8-hero-button,
        .change8-product-card {
          -webkit-tap-highlight-color: transparent;
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

        .change8-nav-links a,
        .change8-nav-links a:visited {
          padding: 6px 0;
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

        .change8-product-card {
          display: block;
          border-radius: 18px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease;
        }

        .change8-product-card:active {
          transform: scale(0.985);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.1);
        }

        .change8-product-card:focus-visible,
        .change8-hero-button:focus-visible,
        .change8-search input:focus-visible,
        .change8-user-toggle:focus-visible,
        .change8-logout-button:focus-visible,
        .change8-slider-arrow:focus-visible,
        .change8-slider-dot:focus-visible {
          outline: 2px solid rgba(255, 45, 139, 0.55);
          outline-offset: 2px;
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

        .change8-styleflow-zone {
          margin: 10px 14px 24px;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: #ffffff;
          box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
        }

        .change8-styleflow-hero {
          min-height: 165px;
          padding: 28px 24px;
          display: grid;
          place-items: center;
          text-align: center;
          color: #f8fafc;
          background:
            linear-gradient(rgba(16, 33, 61, 0.64), rgba(16, 33, 61, 0.64)),
            url("/public/img4.png") center / cover no-repeat;
        }

        .change8-styleflow-hero h2 {
          margin: 0;
          font-size: clamp(30px, 4vw, 56px);
          line-height: 1.06;
          letter-spacing: -0.03em;
        }

        .change8-styleflow-content {
          padding: 18px;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 14px;
        }

        .change8-styleflow-card {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 14px;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
          padding: 16px;
        }

        .change8-styleflow-card h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
        }

        .change8-recent-row {
          margin-top: 12px;
          display: grid;
          grid-template-columns: auto repeat(4, minmax(0, 1fr)) auto;
          gap: 10px;
          align-items: center;
        }

        .change8-mini-arrow {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: 1px solid rgba(15, 23, 42, 0.16);
          display: grid;
          place-items: center;
          color: #334155;
          font-size: 22px;
        }

        .change8-recent-item {
          height: 76px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(15, 23, 42, 0.1);
          background: #f2f5fb;
        }

        .change8-recent-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .change8-flow-list {
          margin-top: 12px;
          display: grid;
          gap: 10px;
        }

        .change8-flow-row {
          display: grid;
          gap: 6px;
        }

        .change8-flow-row strong {
          font-size: 17px;
        }

        .change8-flow-track {
          height: 8px;
          border-radius: 999px;
          overflow: hidden;
          background: #d7deea;
        }

        .change8-flow-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #123676, #41a1b0);
        }

        .change8-quick-links {
          margin: 10px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 8px;
        }

        .change8-quick-links li {
          font-size: 20px;
          font-weight: 600;
        }

        .change8-fav-list {
          margin: 12px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 10px;
        }

        .change8-fav-list li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .change8-fav-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .change8-fav-avatar {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          overflow: hidden;
          border: 1px solid rgba(15, 23, 42, 0.16);
        }

        .change8-fav-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .change8-fav-heart {
          font-size: 17px;
          color: #1d4c82;
        }

        .change8-reward-points {
          margin-top: 6px;
          font-size: 42px;
          line-height: 1;
          font-weight: 800;
        }

        .change8-reward-row {
          margin-top: 10px;
          display: grid;
          gap: 4px;
        }

        .change8-reward-row span {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
        }

        .change8-styleflow-footer {
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          background: rgba(255, 255, 255, 0.7);
          padding: 18px 18px 12px;
        }

        .change8-styleflow-footer-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1fr;
          gap: 14px;
        }

        .change8-styleflow-footer h4 {
          margin: 0;
          font-size: 19px;
        }

        .change8-styleflow-footer p,
        .change8-styleflow-footer li {
          margin: 6px 0 0;
          color: #334155;
          font-size: 14px;
        }

        .change8-styleflow-footer ul {
          margin: 6px 0 0;
          padding: 0;
          list-style: none;
        }

        .change8-styleflow-copy {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          font-size: 12px;
          color: #475569;
        }

        @media (max-width: 1200px) {
          .change8-product-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .change8-styleflow-content {
            grid-template-columns: 1fr;
          }

          .change8-styleflow-footer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .change8-nav {
            grid-template-columns: 1fr;
            justify-items: stretch;
            gap: 12px;
            padding: 16px 16px 14px;
          }

          .change8-nav-links {
            justify-content: flex-start;
            gap: 12px;
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
          }

          .change8-nav-links a {
            white-space: nowrap;
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.08);
          }

          .change8-nav-actions {
            width: 100%;
            justify-content: stretch;
            flex-wrap: wrap;
            gap: 10px;
          }

          .change8-nav-user-display {
            width: 100%;
            justify-content: center;
          }

          .change8-search {
            width: 100%;
            min-width: 0;
          }

          .change8-user-menu,
          .change8-user-fallback,
          .change8-icon,
          .change8-cart-button {
            flex: 0 0 auto;
          }

          .change8-user-dropdown {
            left: 0;
            right: auto;
            width: min(100%, 240px);
          }

          .change8-hero-copy {
            width: 100%;
            padding: 22px 16px 46px;
            align-items: flex-start;
            text-align: left;
          }

          .change8-hero-button {
            width: min(100%, 220px);
            font-size: 16px;
          }

          .change8-product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            padding: 0 12px 12px;
          }

          .change8-recent-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .change8-mini-arrow {
            display: none;
          }

          .change8-quick-links li {
            font-size: 18px;
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
            padding: 12px 12px 12px;
          }

          .change8-top-strip {
            font-size: 12px;
            padding: 6px 10px;
          }

          .change8-brand {
            width: 64px;
            height: 64px;
            font-size: 13px;
          }

          .change8-search {
            width: 100%;
            padding: 11px 14px;
          }

          .change8-hero {
            min-height: 380px;
          }

          .change8-hero-copy {
            padding: 18px 14px 42px;
          }

          .change8-hero-title {
            font-size: clamp(30px, 11vw, 42px);
          }

          .change8-hero-subtitle {
            font-size: 14px;
            letter-spacing: 0.18em;
            margin-top: 8px;
          }

          .change8-hero-button {
            width: 100%;
            min-width: 0;
            margin-top: 22px;
            padding: 14px 18px;
          }

          .change8-product-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .change8-product-name {
            font-size: 16px;
            min-height: auto;
          }

          .change8-product-price {
            font-size: 13px;
          }

          .change8-favorite {
            font-size: 18px;
            top: 8px;
            left: 8px;
          }

          .change8-slider-arrow {
            display: none;
          }

          .change8-slider-dots {
            bottom: 10px;
            gap: 8px;
          }

          .change8-slider-dot {
            width: 12px;
            height: 12px;
          }

          .change8-products-title {
            font-size: 22px;
          }

          .change8-styleflow-zone {
            margin: 6px 12px 16px;
          }

          .change8-styleflow-content,
          .change8-styleflow-footer {
            padding: 12px;
          }

          .change8-styleflow-footer-grid {
            grid-template-columns: 1fr;
          }

          .change8-recent-row {
            grid-template-columns: 1fr;
          }

          .change8-products-head {
            padding: 6px 12px 14px;
          }

          .change8-loading,
          .change8-empty {
            margin: 0 12px 14px;
            padding: 18px;
            border-radius: 14px;
          }
        }

        @media (max-width: 420px) {
          .change8-nav-links {
            gap: 8px;
          }

          .change8-nav-links a {
            padding: 7px 10px;
            font-size: 13px;
          }

          .change8-brand {
            width: 58px;
            height: 58px;
          }

          .change8-hero {
            min-height: 350px;
          }

          .change8-hero-title {
            font-size: clamp(28px, 10vw, 38px);
          }

          .change8-hero-subtitle {
            letter-spacing: 0.12em;
          }

          .change8-product-card {
            border-radius: 16px;
          }
        }
      `}</style>

      <div className="change8-shell">
        <div className="change8-top-strip">
          FREE SHIPPING now available in Sri Lanka
        </div>
        <header className="change8-nav">
          <div className="change8-nav-links" aria-label="Primary">
            <a href="#hero" className="is-active">
              Home
            </a>
            <a href="#products">Product</a>
            <a href="/admin/pages/About">About</a>
            <a href="/admin/pages/Contact">Contact Us</a>
          </div>

          <div className="change8-brand" aria-label="Store brand">
            <img src="/public/icon.png" alt="Store logo" />
          </div>

          <div className="change8-nav-actions">
            <label className="change8-search" htmlFor="change8-search-input">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                id="change8-search-input"
                type="search"
                placeholder="Search Products"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            {currentUserName ? (
              <div className="change8-user-menu">
                <button
                  type="button"
                  className="change8-user-toggle"
                  aria-label="Logged in user menu"
                  aria-expanded={isUserMenuOpen}
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsUserMenuOpen((previous) => !previous);
                  }}
                >
                  {currentUserName}
                </button>

                {isUserMenuOpen ? (
                  <div
                    className="change8-user-dropdown"
                    role="menu"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="change8-logout-button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        window.location.href = "/admin/logout";
                      }}
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="change8-user-fallback" aria-label="Account">
                <div className="change8-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c1.8-4.2 5-6 8-6s6.2 1.8 8 6" />
                  </svg>
                </div>
              </div>
            )}

            <div className="change8-icon" aria-label="Wishlist">
              <svg viewBox="0 0 24 24">
                <path d="M12 21s-7-4.6-9.2-9.2C.8 8.2 2.4 5 5.8 5c1.8 0 3.2 1 4.2 2.2C11 6 12.5 5 14.2 5c3.4 0 5 3.2 3 6.8C19 16.4 12 21 12 21z" />
              </svg>
            </div>

            <button
              type="button"
              className="change8-icon change8-cart-button"
              aria-label="Cart"
              onClick={() => {
                window.location.assign(ordersListHref);
              }}
            >
              <svg viewBox="0 0 24 24">
                <path d="M3 4h2l2.2 11.3A2 2 0 0 0 9.2 17H18a2 2 0 0 0 2-1.6l1.1-6.4H6.1" />
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="17" cy="20" r="1.5" />
              </svg>
              <span className="change8-badge">
                {Math.max(0, Number(summary?.orders || 0))}
              </span>
            </button>
          </div>
        </header>
        <main className="change8-content">
          <section className="change8-hero" id="hero">
            <div className="change8-hero-image" />

            <button
              type="button"
              className="change8-slider-arrow change8-slider-arrow--left"
              aria-label="Previous slide"
              onClick={() => {
                if (!heroSlides.length) {
                  return;
                }

                setCurrentSlide((previous) =>
                  previous === 0 ? heroSlides.length - 1 : previous - 1,
                );
              }}
            >
              ‹
            </button>

            <button
              type="button"
              className="change8-slider-arrow change8-slider-arrow--right"
              aria-label="Next slide"
              onClick={() => {
                if (!heroSlides.length) {
                  return;
                }

                setCurrentSlide(
                  (previous) => (previous + 1) % heroSlides.length,
                );
              }}
            >
              ›
            </button>

            <div className="change8-hero-copy">
              <div className="change8-hero-eyebrow">New season drop</div>
              <h1 className="change8-hero-title">{heroTitle}</h1>
              <p className="change8-hero-subtitle">{heroSubtitle}</p>
              <a
                href={heroHref || "#products"}
                className="change8-hero-button"
                onClick={(event) => {
                  if (!heroHref) {
                    event.preventDefault();
                  }
                }}
              >
                Shop Now
              </a>
            </div>

            <div
              className="change8-slider-dots"
              aria-label="Carousel navigation"
            >
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id || `${slide.name}-${index}`}
                  type="button"
                  className={`change8-slider-dot ${index === currentSlide ? "is-active" : ""}`}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </section>

          <section className="change8-products" id="products">
            <div className="change8-products-head">
              <h2 className="change8-products-title">Our Products</h2>
            </div>

            {loading ? (
              <div className="change8-loading">Loading products...</div>
            ) : displayedProducts.length === 0 ? (
              <div className="change8-empty">No products found.</div>
            ) : (
              <div className="change8-product-grid">
                {displayedProducts.map((product) => {
                  const href = getShowHref(product);
                  const image = productImage(product);

                  return (
                    <article key={product.id}>
                      <a
                        className="change8-product-card"
                        href={href || "#"}
                        onClick={(event) => {
                          if (!href) {
                            event.preventDefault();
                          }
                        }}
                      >
                        <div className="change8-product-media">
                          {image ? (
                            <img src={image} alt={product.name} />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "grid",
                                placeItems: "center",
                                color: "#111",
                                fontWeight: 800,
                                fontSize: "22px",
                                background:
                                  "linear-gradient(135deg, #dbeafe, #fce7f3)",
                              }}
                            >
                              {productLabel(product)}
                            </div>
                          )}
                          <span className="change8-favorite">♡</span>
                        </div>

                        <h3 className="change8-product-name">{product.name}</h3>
                        <div className="change8-product-price">
                          <s>{formatCurrency(product.price * 1.14)}</s>
                          {formatCurrency(product.price)}
                        </div>
                      </a>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section
            className="change8-styleflow-zone"
            aria-label="Personalized style dashboard"
          >
            <div className="change8-styleflow-hero">
              <h2>Your Style Journey Starts Here. Manage Your Flows.</h2>
            </div>

            <div className="change8-styleflow-content">
              <div>
                <article className="change8-styleflow-card">
                  <h3>Recently Viewed</h3>
                  <div className="change8-recent-row">
                    <div className="change8-mini-arrow">&#8249;</div>
                    <div className="change8-recent-item">
                      <img
                        src="/public/img3.png"
                        alt="Recently viewed item one"
                      />
                    </div>
                    <div className="change8-recent-item">
                      <img
                        src="/public/img4.png"
                        alt="Recently viewed item two"
                      />
                    </div>
                    <div className="change8-recent-item">
                      <img
                        src="/public/img5.png"
                        alt="Recently viewed item three"
                      />
                    </div>
                    <div className="change8-recent-item">
                      <img
                        src="/public/img6.png"
                        alt="Recently viewed item four"
                      />
                    </div>
                    <div className="change8-mini-arrow">&#8250;</div>
                  </div>
                </article>

                <article
                  className="change8-styleflow-card"
                  style={{ marginTop: "12px" }}
                >
                  <h3>Flows in Progress</h3>
                  <div className="change8-flow-list">
                    <div className="change8-flow-row">
                      <strong>Spring Edit (80%)</strong>
                      <div className="change8-flow-track">
                        <div
                          className="change8-flow-fill"
                          style={{ width: "80%" }}
                        />
                      </div>
                    </div>
                    <div className="change8-flow-row">
                      <strong>Activewear V2 (35%)</strong>
                      <div className="change8-flow-track">
                        <div
                          className="change8-flow-fill"
                          style={{ width: "35%" }}
                        />
                      </div>
                    </div>
                  </div>
                </article>

                <article
                  className="change8-styleflow-card"
                  style={{ marginTop: "12px" }}
                >
                  <h3>Quick Links</h3>
                  <ul className="change8-quick-links">
                    <li>Order History</li>
                    <li>Account Settings</li>
                    <li>Loyalty Points</li>
                  </ul>
                </article>
              </div>

              <div>
                <article className="change8-styleflow-card">
                  <h3>My Favorites</h3>
                  <ul className="change8-fav-list">
                    <li>
                      <span className="change8-fav-meta">
                        <span className="change8-fav-avatar">
                          <img src="/public/img7.png" alt="Coastal Blazer" />
                        </span>
                        <span>Coastal Blazer</span>
                      </span>
                      <span className="change8-fav-heart">&#9829;</span>
                    </li>
                    <li>
                      <span className="change8-fav-meta">
                        <span className="change8-fav-avatar">
                          <img src="/public/img8.png" alt="Recomive Pant" />
                        </span>
                        <span>Recomive Pant</span>
                      </span>
                      <span className="change8-fav-heart">&#9829;</span>
                    </li>
                    <li>
                      <span className="change8-fav-meta">
                        <span className="change8-fav-avatar">
                          <img src="/public/img6.png" alt="Activewear V2" />
                        </span>
                        <span>Activewear V2</span>
                      </span>
                      <span className="change8-fav-heart">&#9829;</span>
                    </li>
                    <li>
                      <span className="change8-fav-meta">
                        <span className="change8-fav-avatar">
                          <img src="/public/img5.png" alt="Hevartitos" />
                        </span>
                        <span>Hevartitos</span>
                      </span>
                      <span className="change8-fav-heart">&#9829;</span>
                    </li>
                  </ul>
                </article>

                <article
                  className="change8-styleflow-card"
                  style={{ marginTop: "12px" }}
                >
                  <h3>StyleFlow Rewards</h3>
                  <div className="change8-reward-points">240 pts</div>
                  <div className="change8-reward-row">
                    <span>
                      <em>Style Flow Master</em>
                      <em>240 pts</em>
                    </span>
                    <div className="change8-flow-track">
                      <div
                        className="change8-flow-fill"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                  <div className="change8-reward-row">
                    <span>
                      <em>Style Flow Tier</em>
                      <em>60 pts</em>
                    </span>
                    <div className="change8-flow-track">
                      <div
                        className="change8-flow-fill"
                        style={{ width: "40%" }}
                      />
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <footer className="change8-styleflow-footer">
              <div className="change8-styleflow-footer-grid">
                <div>
                  <h4>StyleFlow</h4>
                  <p>
                    StyleFlow curates modern fashion with guided discovery and
                    smooth checkout journeys.
                  </p>
                </div>
                <div>
                  <h4>Products</h4>
                  <ul>
                    <li>Product</li>
                    <li>About Us</li>
                    <li>Contact</li>
                  </ul>
                </div>
                <div>
                  <h4>Links</h4>
                  <ul>
                    <li>Stories</li>
                    <li>Blog</li>
                    <li>Support</li>
                  </ul>
                </div>
                <div>
                  <h4>Social Media</h4>
                  <ul>
                    <li>Facebook</li>
                    <li>Instagram</li>
                    <li>Twitter</li>
                  </ul>
                </div>
              </div>
              <div className="change8-styleflow-copy">
                Copyright &#169; StyleFlow.com
              </div>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
