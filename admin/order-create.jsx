import React, { useEffect, useMemo, useState } from "react";

const pageStyle = {
  display: "grid",
  gap: "20px",
  color: "#111827",
  background: "#ffffff",
};

const headerStyle = {
  display: "grid",
  gap: "6px",
};

const titleStyle = {
  margin: 0,
  fontSize: "34px",
  lineHeight: 1.08,
  color: "#111827",
};

const descStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "14px",
};

const cardStyle = {
  borderRadius: "18px",
  border: "1px solid rgba(17, 24, 39, 0.08)",
  background: "#ffffff",
  boxShadow: "0 14px 28px rgba(15, 23, 42, 0.08)",
  padding: "18px",
};

const sectionTitleStyle = {
  margin: "0 0 14px 0",
  fontSize: "13px",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  color: "#111827",
  fontWeight: 800,
};

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(300px, 0.95fr) minmax(420px, 1.25fr)",
  gap: "16px",
};

const stackStyle = {
  display: "grid",
  gap: "16px",
};

const labelStyle = {
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#475569",
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
  fontFamily: "inherit",
};

const rowStyle = {
  display: "grid",
  gap: "8px",
  minWidth: 0,
};

const grid2Style = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "10px",
  alignItems: "start",
};

const customerInfoStyle = {
  display: "grid",
  gap: "10px",
};

const customerRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  fontSize: "13px",
  paddingBottom: "8px",
  borderBottom: "1px solid rgba(17, 24, 39, 0.08)",
};

const mutedStyle = {
  color: "#64748b",
};

const strongStyle = {
  color: "#111827",
  fontWeight: 700,
  textAlign: "right",
};

const lineItemRowStyle = {
  border: "1px solid rgba(17, 24, 39, 0.12)",
  borderRadius: "14px",
  padding: "12px",
  display: "grid",
  gap: "12px",
  background: "#f8fafc",
};

const lineItemTopStyle = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "10px",
  alignItems: "center",
};

const productPreviewStyle = {
  display: "grid",
  gridTemplateColumns: "56px 1fr",
  gap: "10px",
  alignItems: "center",
};

const imageStyle = {
  width: "56px",
  height: "56px",
  borderRadius: "10px",
  objectFit: "cover",
  background: "#e5e7eb",
  border: "1px solid rgba(17, 24, 39, 0.12)",
};

const addButtonStyle = {
  border: "1px solid rgba(99, 102, 241, 0.35)",
  borderRadius: "10px",
  padding: "9px 12px",
  background: "#eef2ff",
  color: "#3730a3",
  cursor: "pointer",
  fontWeight: 700,
};

const removeButtonStyle = {
  border: "1px solid #fca5a5",
  borderRadius: "10px",
  padding: "8px 10px",
  background: "#fee2e2",
  color: "#991b1b",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 700,
};

const totalsRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "7px 0",
  fontSize: "13px",
  borderBottom: "1px solid rgba(17, 24, 39, 0.08)",
};

const totalStyle = {
  ...totalsRowStyle,
  fontSize: "17px",
  fontWeight: 800,
  color: "#111827",
  borderBottom: "none",
  paddingTop: "12px",
};

const actionBarStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
};

const actionButtonStyle = (primary) => ({
  borderRadius: "12px",
  border: primary ? "none" : "1px solid rgba(17, 24, 39, 0.12)",
  padding: "12px 14px",
  fontWeight: 700,
  cursor: "pointer",
  background: primary
    ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
    : "#ffffff",
  color: primary ? "#fff" : "#111827",
});

const mapLinkStyle = {
  color: "#2563eb",
  fontSize: "12px",
  textDecoration: "none",
};

const paymentOptionGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
};

const paymentOptionStyle = (active) => ({
  borderRadius: "12px",
  border: active
    ? "1px solid rgba(99, 102, 241, 0.9)"
    : "1px solid rgba(17, 24, 39, 0.12)",
  background: active ? "#eef2ff" : "#ffffff",
  color: "#111827",
  padding: "10px 12px",
  cursor: "pointer",
  textAlign: "left",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: 700,
});

const securityChipWrapStyle = {
  marginTop: "12px",
  display: "grid",
  gap: "8px",
};

const securityChipStyle = {
  border: "1px solid rgba(34, 197, 94, 0.42)",
  borderRadius: "999px",
  background: "#ecfdf3",
  color: "#166534",
  padding: "7px 10px",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.03em",
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

const paymentOptions = [
  { value: "Card", label: "Card Payment", icon: "💳" },
  { value: "Cash on Delivery", label: "Cash on Delivery", icon: "📦" },
];

const fallbackSizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
const shippingMethods = [
  "PickMe Flash",
  "Pronto",
  "Domex",
  "Registered Courier",
];

const toNumber = (value) => {
  const num = Number(value || 0);
  return Number.isFinite(num) ? num : 0;
};

const formatMoney = (value) => {
  return `Rs. ${toNumber(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const parseSizeStock = (value) => {
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
    const size = String(rawSize || "")
      .trim()
      .toUpperCase();
    if (!size) {
      continue;
    }

    const qty = Math.max(0, Math.trunc(Number(rawQty || 0)));
    normalized[size] = qty;
  }

  return normalized;
};

const getSizeEntries = (product) => {
  const sizeStock = parseSizeStock(product?.sizeStock);
  return Object.entries(sizeStock)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([size, qty]) => ({ size, qty }));
};

const getSizeOptions = (product) => {
  const entries = getSizeEntries(product);
  if (entries.length > 0) {
    return entries;
  }

  return fallbackSizeOptions.map((size) => ({ size, qty: null }));
};

const createEmptyItem = () => ({
  productId: "",
  size: "",
  quantity: 1,
  unitPrice: 0,
});

const OrderCreate = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderCountByUser, setOrderCountByUser] = useState({});
  const [sessionUser, setSessionUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
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
    discount: 0,
  });

  const [lineItems, setLineItems] = useState([createEmptyItem()]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const hadLoginClassOnRoot = root.classList.contains("change8-login-page");
    const hadLoginClassOnBody = body?.classList.contains("change8-login-page");
    const hadDashboardClassOnRoot = root.classList.contains(
      "change8-storefront-dashboard-page",
    );
    const hadDashboardClassOnBody = body?.classList.contains(
      "change8-storefront-dashboard-page",
    );
    const loginBgLayer = document.getElementById("change8-login-bg-layer");
    const previousLayerDisplay = loginBgLayer?.style.display || "";

    const shellNodes = Array.from(
      new Set(
        [
          root,
          body,
          document.getElementById("app"),
          document.querySelector('[data-testid="layout"]'),
          document.querySelector('[data-css="layout"]'),
          document.querySelector(".adminjs_Layout"),
          document.querySelector("main"),
          ...Array.from(
            document.querySelectorAll(
              '[data-css*="action-content"], [data-testid*="content"], .adminjs_Main, .adminjs_Main > div, .adminjs_Main > div > div, [data-css$="-content"]',
            ),
          ),
        ].filter(Boolean),
      ),
    );

    const previousInlineBackgrounds = new Map(
      shellNodes.map((node) => [
        node,
        {
          background: node.style.getPropertyValue("background"),
          backgroundPriority: node.style.getPropertyPriority("background"),
          backgroundColor: node.style.getPropertyValue("background-color"),
          backgroundColorPriority:
            node.style.getPropertyPriority("background-color"),
          backgroundImage: node.style.getPropertyValue("background-image"),
          backgroundImagePriority:
            node.style.getPropertyPriority("background-image"),
        },
      ]),
    );

    root.classList.remove(
      "change8-login-page",
      "change8-storefront-dashboard-page",
    );
    body?.classList.remove(
      "change8-login-page",
      "change8-storefront-dashboard-page",
    );
    if (loginBgLayer) {
      loginBgLayer.style.display = "none";
    }

    shellNodes.forEach((node) => {
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
          node.style.setProperty(
            "background",
            styles.background,
            styles.backgroundPriority || "",
          );
        }

        if (!styles.backgroundColor) {
          node.style.removeProperty("background-color");
        } else {
          node.style.setProperty(
            "background-color",
            styles.backgroundColor,
            styles.backgroundColorPriority || "",
          );
        }

        if (!styles.backgroundImage) {
          node.style.removeProperty("background-image");
        } else {
          node.style.setProperty(
            "background-image",
            styles.backgroundImage,
            styles.backgroundImagePriority || "",
          );
        }
      });
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preProductId = params.get("productId") || "";

    const fetchData = async () => {
      try {
        const contextRes = await fetch(
          `/admin/context/order-create${
            preProductId ? `?productId=${encodeURIComponent(preProductId)}` : ""
          }`,
          { credentials: "same-origin" },
        );

        const contextData = contextRes.ok ? await contextRes.json() : {};

        const usersData = Array.isArray(contextData?.users)
          ? contextData.users
          : [];
        const productsList = Array.isArray(contextData?.products)
          ? contextData.products
          : [];

        setUsers(usersData);
        setProducts(productsList);
        setOrderCountByUser(contextData?.orderCountByUser || {});
        setSessionUser(contextData?.currentUser || null);

        if (contextData?.currentUser?.id) {
          setFormData((prev) => ({
            ...prev,
            userId: prev.userId || String(contextData.currentUser.id),
          }));
        }

        if (contextData?.selectedProduct?.id) {
          const selectedProductSizeOptions = getSizeOptions(
            contextData.selectedProduct,
          );
          setLineItems([
            {
              productId: String(contextData.selectedProduct.id),
              size: selectedProductSizeOptions[0]?.size || "",
              quantity: 1,
              unitPrice: toNumber(contextData.selectedProduct.price),
            },
          ]);
          return;
        }

        if (
          preProductId &&
          productsList.some((p) => String(p.id) === String(preProductId))
        ) {
          const selected = productsList.find(
            (p) => String(p.id) === String(preProductId),
          );
          const selectedProductSizeOptions = getSizeOptions(selected);
          setLineItems([
            {
              productId: String(preProductId),
              size: selectedProductSizeOptions[0]?.size || "",
              quantity: 1,
              unitPrice: toNumber(selected?.price),
            },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectedCustomer = useMemo(() => {
    return users.find((u) => String(u.id) === String(formData.userId)) || null;
  }, [users, formData.userId]);

  const customerOrderCount = useMemo(() => {
    if (!selectedCustomer) {
      return 0;
    }

    return Number(orderCountByUser[String(selectedCustomer.id)] || 0);
  }, [orderCountByUser, selectedCustomer]);

  useEffect(() => {
    if (!selectedCustomer) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      shippingName: prev.shippingName || selectedCustomer.name || "",
      shippingPhone:
        prev.shippingPhone ||
        selectedCustomer.phone ||
        selectedCustomer.mobile ||
        "",
    }));
  }, [selectedCustomer]);

  const lineTotals = useMemo(() => {
    const subtotal = lineItems.reduce((sum, item) => {
      return sum + toNumber(item.quantity) * toNumber(item.unitPrice);
    }, 0);

    const shippingFee = toNumber(formData.shippingFee);
    const tax = toNumber(formData.tax);
    const discount = toNumber(formData.discount);
    const grandTotal = Math.max(subtotal + shippingFee + tax - discount, 0);

    return { subtotal, shippingFee, tax, discount, grandTotal };
  }, [lineItems, formData.shippingFee, formData.tax, formData.discount]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLineItemChange = (index, key, value) => {
    setLineItems((prev) => {
      const next = [...prev];
      const item = { ...next[index] };

      if (key === "productId") {
        item.productId = value;
        const product = products.find((p) => String(p.id) === String(value));
        const sizeOptions = getSizeOptions(product);
        item.unitPrice = toNumber(product?.price);
        item.size = sizeOptions[0]?.size || "";
        const maxQtyForSize =
          sizeOptions[0]?.qty === null
            ? null
            : Math.max(1, Number(sizeOptions[0]?.qty || 0));
        if (maxQtyForSize !== null) {
          item.quantity = Math.max(
            1,
            Math.min(toNumber(item.quantity), maxQtyForSize),
          );
        }
      } else if (key === "size") {
        item.size = value;
        const product = products.find(
          (p) => String(p.id) === String(item.productId),
        );
        const sizeOptions = getSizeOptions(product);
        const selectedSizeOption = sizeOptions.find(
          (option) => option.size === value,
        );
        if (selectedSizeOption && selectedSizeOption.qty !== null) {
          const maxQtyForSize = Math.max(
            1,
            Number(selectedSizeOption.qty || 0),
          );
          item.quantity = Math.max(
            1,
            Math.min(toNumber(item.quantity), maxQtyForSize),
          );
        }
      } else if (key === "quantity") {
        const product = products.find(
          (p) => String(p.id) === String(item.productId),
        );
        const sizeOptions = getSizeOptions(product);
        const selectedSizeOption = sizeOptions.find(
          (option) => option.size === item.size,
        );
        const parsedQty = Math.max(1, toNumber(value));
        if (selectedSizeOption && selectedSizeOption.qty !== null) {
          const maxQtyForSize = Math.max(
            1,
            Number(selectedSizeOption.qty || 0),
          );
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
    setLineItems((prev) => [...prev, createEmptyItem()]);
  };

  const removeLineItem = (index) => {
    setLineItems((prev) => {
      if (prev.length === 1) {
        return prev;
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  const mapsHref = useMemo(() => {
    if (!formData.shippingAddress?.trim()) {
      return "";
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.shippingAddress.trim())}`;
  }, [formData.shippingAddress]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validItems = lineItems.filter(
      (item) => item.productId && toNumber(item.quantity) > 0,
    );

    if (!formData.userId) {
      alert("Please select a customer.");
      return;
    }

    if (validItems.length === 0) {
      alert("At least one product line item is required.");
      return;
    }

    for (const item of validItems) {
      const selectedProduct = products.find(
        (product) => String(product.id) === String(item.productId),
      );
      const sizeEntries = getSizeEntries(selectedProduct);

      if (sizeEntries.length > 0) {
        if (!item.size) {
          alert("Please select a size for all products.");
          return;
        }

        const selectedSize = sizeEntries.find(
          (entry) => entry.size === String(item.size).toUpperCase(),
        );

        if (!selectedSize) {
          alert(
            `Selected size is not available for ${selectedProduct?.name || "this product"}.`,
          );
          return;
        }

        if (toNumber(item.quantity) > selectedSize.qty) {
          alert(
            `${selectedProduct?.name || "Product"} (${selectedSize.size}) has only ${selectedSize.qty} in stock.`,
          );
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
        lineItems: validItems.map((item) => ({
          productId: Number(item.productId),
          size: item.size || null,
          quantity: Math.max(1, toNumber(item.quantity)),
          unitPrice: Math.max(0, toNumber(item.unitPrice)).toFixed(2),
        })),
      };

      const submitForm = new FormData();
      submitForm.append("payload", JSON.stringify(orderPayload));

      const orderRes = await fetch("/admin/context/order-create/submit", {
        method: "POST",
        credentials: "same-origin",
        body: submitForm,
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData?.message || "Failed to create order");
      }

      window.location.assign(
        `/admin/resources/Orders/records/${orderData.id}/show`,
      );
    } catch (error) {
      alert(error.message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={pageStyle}>
      <style>{`
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
      `}</style>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
        <div className="change8-order-layout" style={layoutStyle}>
          <div style={stackStyle}>
            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Customer Details</h2>

              <div style={rowStyle}>
                <label style={labelStyle}>Select Customer *</label>
                <select
                  name="userId"
                  value={formData.userId}
                  onChange={handleFormChange}
                  style={inputStyle}
                  required
                  disabled={loading || sessionUser?.role === "user"}
                >
                  <option value="">
                    {loading ? "Loading customers..." : "Select a customer"}
                  </option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} (#{user.id})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ height: 12 }} />

              <div style={customerInfoStyle}>
                <div style={customerRowStyle}>
                  <span style={mutedStyle}>Customer Name & ID</span>
                  <span style={strongStyle}>
                    {selectedCustomer
                      ? `${selectedCustomer.name} (#${selectedCustomer.id})`
                      : "-"}
                  </span>
                </div>
                <div style={customerRowStyle}>
                  <span style={mutedStyle}>Email</span>
                  <span style={strongStyle}>
                    {selectedCustomer?.email || "-"}
                  </span>
                </div>
                <div style={customerRowStyle}>
                  <span style={mutedStyle}>Phone Number</span>
                  <span style={strongStyle}>
                    {selectedCustomer?.phone ||
                      selectedCustomer?.mobile ||
                      "Not available"}
                  </span>
                </div>
                <div style={customerRowStyle}>
                  <span style={mutedStyle}>Order History</span>
                  <span style={strongStyle}>
                    {customerOrderCount} previous orders
                  </span>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Payment & Billing</h2>

              <div style={rowStyle}>
                <label style={labelStyle}>Payment Options</label>
                <div style={paymentOptionGridStyle}>
                  {paymentOptions.map((option) => {
                    const active = formData.paymentMethod === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        style={paymentOptionStyle(active)}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentMethod: option.value,
                          }))
                        }
                      >
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ height: 10 }} />

              <div className="change8-order-grid-2" style={grid2Style}>
                <div style={rowStyle}>
                  <label style={labelStyle}>Selected Method</label>
                  <input
                    value={formData.paymentMethod}
                    style={inputStyle}
                    readOnly
                  />
                </div>

                <div style={rowStyle}>
                  <label style={labelStyle}>Payment Status</label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleFormChange}
                    style={inputStyle}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>

              <div style={{ height: 10 }} />

              <div style={rowStyle}>
                <label style={labelStyle}>Transaction ID</label>
                <input
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleFormChange}
                  style={inputStyle}
                  placeholder="e.g. TXN-2026-000124"
                />
              </div>
            </div>
          </div>

          <div style={stackStyle}>
            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <h2 style={{ ...sectionTitleStyle, marginBottom: 0 }}>
                  Product Line Items (Required)
                </h2>
                <button
                  type="button"
                  onClick={addLineItem}
                  style={addButtonStyle}
                >
                  + Add Item
                </button>
              </div>

              <div style={{ height: 12 }} />

              <div style={{ display: "grid", gap: "10px" }}>
                {lineItems.map((item, index) => {
                  const selectedProduct = products.find(
                    (p) => String(p.id) === String(item.productId),
                  );
                  const sizeOptions = getSizeOptions(selectedProduct);
                  const selectedSizeOption = sizeOptions.find(
                    (option) => option.size === item.size,
                  );
                  const sizeStockText = getSizeEntries(selectedProduct)
                    .map((entry) => `${entry.size}: ${entry.qty}`)
                    .join(" | ");
                  const itemTotal =
                    toNumber(item.quantity) * toNumber(item.unitPrice);

                  return (
                    <div key={`line-item-${index}`} style={lineItemRowStyle}>
                      <div style={lineItemTopStyle}>
                        <div style={rowStyle}>
                          <label style={labelStyle}>Product</label>
                          <select
                            value={item.productId}
                            onChange={(event) =>
                              handleLineItemChange(
                                index,
                                "productId",
                                event.target.value,
                              )
                            }
                            style={inputStyle}
                            required
                          >
                            <option value="">Select product</option>
                            {products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name} (SKU: {product.sku})
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          style={removeButtonStyle}
                          onClick={() => removeLineItem(index)}
                        >
                          Remove
                        </button>
                      </div>

                      <div style={productPreviewStyle}>
                        {selectedProduct?.imageUrl ? (
                          <img
                            src={selectedProduct.imageUrl}
                            alt={selectedProduct.name}
                            style={imageStyle}
                          />
                        ) : (
                          <div
                            style={{
                              ...imageStyle,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#94a3b8",
                              fontSize: "11px",
                            }}
                          >
                            No image
                          </div>
                        )}
                        <div style={{ display: "grid", gap: "3px" }}>
                          <strong
                            style={{ fontSize: "14px", color: "#f8fafc" }}
                          >
                            {selectedProduct?.name || "Select a product"}
                          </strong>
                          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                            SKU/ID:{" "}
                            {selectedProduct
                              ? `${selectedProduct.sku} / #${selectedProduct.id}`
                              : "-"}
                          </span>
                          <span style={{ fontSize: "12px", color: "#cbd5e1" }}>
                            Size: {item.size || "-"} | Qty: {item.quantity}
                          </span>
                          {sizeStockText ? (
                            <span
                              style={{ fontSize: "11px", color: "#facc15" }}
                            >
                              Available: {sizeStockText}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div style={rowStyle}>
                        <label style={labelStyle}>Size</label>
                        <select
                          value={item.size || ""}
                          onChange={(event) =>
                            handleLineItemChange(
                              index,
                              "size",
                              event.target.value,
                            )
                          }
                          style={inputStyle}
                          required
                        >
                          <option value="">Select size</option>
                          {sizeOptions.map((sizeOption) => (
                            <option
                              key={sizeOption.size}
                              value={sizeOption.size}
                            >
                              {sizeOption.qty === null
                                ? sizeOption.size
                                : `${sizeOption.size} (${sizeOption.qty})`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="change8-order-grid-2" style={grid2Style}>
                        <div style={rowStyle}>
                          <label style={labelStyle}>Quantity</label>
                          <input
                            type="number"
                            min="1"
                            max={
                              selectedSizeOption?.qty === null ||
                              selectedSizeOption?.qty === undefined
                                ? undefined
                                : Math.max(
                                    1,
                                    Number(selectedSizeOption.qty || 0),
                                  )
                            }
                            value={item.quantity}
                            onChange={(event) =>
                              handleLineItemChange(
                                index,
                                "quantity",
                                event.target.value,
                              )
                            }
                            style={inputStyle}
                            required
                          />
                        </div>
                        <div style={rowStyle}>
                          <label style={labelStyle}>Unit Price</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(event) =>
                              handleLineItemChange(
                                index,
                                "unitPrice",
                                event.target.value,
                              )
                            }
                            style={inputStyle}
                            required
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          ...totalsRowStyle,
                          borderBottom: "none",
                          paddingBottom: 0,
                        }}
                      >
                        <span style={mutedStyle}>Line Total</span>
                        <strong style={{ color: "#f8fafc" }}>
                          {formatMoney(itemTotal)}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Shipping & Tracking</h2>

              <div className="change8-order-grid-2" style={grid2Style}>
                <div style={rowStyle}>
                  <label style={labelStyle}>Shipping Contact Name *</label>
                  <input
                    name="shippingName"
                    value={formData.shippingName}
                    onChange={handleFormChange}
                    style={inputStyle}
                    placeholder="Receiver full name"
                    required
                  />
                </div>
                <div style={rowStyle}>
                  <label style={labelStyle}>Shipping Phone Number *</label>
                  <input
                    name="shippingPhone"
                    value={formData.shippingPhone}
                    onChange={handleFormChange}
                    style={inputStyle}
                    placeholder="07X XXX XXXX"
                    required
                  />
                </div>
              </div>

              <div style={{ height: 10 }} />

              <div style={rowStyle}>
                <label style={labelStyle}>Shipping Address *</label>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleFormChange}
                  style={{
                    ...inputStyle,
                    minHeight: "86px",
                    resize: "vertical",
                  }}
                  placeholder="House number, street, city, postal code"
                  required
                />
                {mapsHref ? (
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noreferrer"
                    style={mapLinkStyle}
                  >
                    Open on Google Maps
                  </a>
                ) : null}
              </div>

              <div style={{ height: 10 }} />

              <div className="change8-order-grid-2" style={grid2Style}>
                <div style={rowStyle}>
                  <label style={labelStyle}>Shipping Method</label>
                  <select
                    name="shippingMethod"
                    value={formData.shippingMethod}
                    onChange={handleFormChange}
                    style={inputStyle}
                  >
                    {shippingMethods.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={rowStyle}>
                  <label style={labelStyle}>Tracking Number</label>
                  <input
                    name="trackingNumber"
                    value={formData.trackingNumber}
                    onChange={handleFormChange}
                    style={inputStyle}
                    placeholder="TRK-XXXXXX"
                  />
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Order Summary / Totals</h2>

              <div className="change8-order-grid-2" style={grid2Style}>
                <div style={rowStyle}>
                  <label style={labelStyle}>Shipping Fee</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="shippingFee"
                    value={formData.shippingFee}
                    onChange={handleFormChange}
                    style={inputStyle}
                  />
                </div>
                <div style={rowStyle}>
                  <label style={labelStyle}>Tax / VAT</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="tax"
                    value={formData.tax}
                    onChange={handleFormChange}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ height: 10 }} />

              <div style={rowStyle}>
                <label style={labelStyle}>Discount / Coupon</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="discount"
                  value={formData.discount}
                  onChange={handleFormChange}
                  style={inputStyle}
                />
              </div>

              <div style={{ height: 12 }} />

              <div style={totalsRowStyle}>
                <span style={mutedStyle}>Subtotal</span>
                <strong>{formatMoney(lineTotals.subtotal)}</strong>
              </div>
              <div style={totalsRowStyle}>
                <span style={mutedStyle}>Shipping Fee</span>
                <strong>{formatMoney(lineTotals.shippingFee)}</strong>
              </div>
              <div style={totalsRowStyle}>
                <span style={mutedStyle}>Tax / VAT</span>
                <strong>{formatMoney(lineTotals.tax)}</strong>
              </div>
              <div style={totalsRowStyle}>
                <span style={mutedStyle}>Discount</span>
                <strong>- {formatMoney(lineTotals.discount)}</strong>
              </div>
              <div style={totalStyle}>
                <span>Grand Total</span>
                <span>{formatMoney(lineTotals.grandTotal)}</span>
              </div>

              <div style={securityChipWrapStyle}>
                <div style={securityChipStyle}>Secure Payment Protected</div>
                <div style={securityChipStyle}>Encrypted Checkout Channel</div>
                <div style={securityChipStyle}>Trusted Delivery Tracking</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, paddingTop: "14px" }}>
          <div style={actionBarStyle}>
            <button
              type="button"
              style={actionButtonStyle(false)}
              onClick={() => window.history.back()}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={actionButtonStyle(true)}
              disabled={submitting}
            >
              {submitting ? "Creating Order..." : "Create Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderCreate;
