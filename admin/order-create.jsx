import React, { useEffect, useMemo, useState } from "react";

const pageStyle = {
  display: "grid",
  gap: "20px",
  color: "#e2e8f0",
};

const headerStyle = {
  display: "grid",
  gap: "6px",
};

const titleStyle = {
  margin: 0,
  fontSize: "34px",
  lineHeight: 1.08,
  color: "#f8fafc",
};

const descStyle = {
  margin: 0,
  color: "#94a3b8",
  fontSize: "14px",
};

const cardStyle = {
  borderRadius: "18px",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  background:
    "linear-gradient(150deg, rgba(10, 23, 48, 0.94) 0%, rgba(8, 18, 38, 0.94) 100%)",
  boxShadow: "0 14px 28px rgba(2, 6, 23, 0.22)",
  padding: "18px",
};

const sectionTitleStyle = {
  margin: "0 0 14px 0",
  fontSize: "13px",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  color: "#f5df90",
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
  color: "#cbd5e1",
};

const inputStyle = {
  width: "100%",
  borderRadius: "12px",
  border: "1px solid rgba(148, 163, 184, 0.26)",
  background: "rgba(15, 23, 42, 0.62)",
  color: "#f8fafc",
  padding: "11px 13px",
  fontSize: "14px",
  fontFamily: "inherit",
};

const rowStyle = {
  display: "grid",
  gap: "8px",
};

const grid2Style = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
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
  borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
};

const mutedStyle = {
  color: "#94a3b8",
};

const strongStyle = {
  color: "#f8fafc",
  fontWeight: 700,
  textAlign: "right",
};

const lineItemRowStyle = {
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "14px",
  padding: "12px",
  display: "grid",
  gap: "12px",
  background: "rgba(15, 23, 42, 0.44)",
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
  background: "#0f172a",
  border: "1px solid rgba(148, 163, 184, 0.25)",
};

const addButtonStyle = {
  border: "1px solid rgba(148, 163, 184, 0.35)",
  borderRadius: "10px",
  padding: "9px 12px",
  background: "rgba(99, 102, 241, 0.18)",
  color: "#dbeafe",
  cursor: "pointer",
  fontWeight: 700,
};

const removeButtonStyle = {
  border: "1px solid rgba(239, 68, 68, 0.5)",
  borderRadius: "10px",
  padding: "8px 10px",
  background: "rgba(127, 29, 29, 0.25)",
  color: "#fecaca",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 700,
};

const totalsRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "7px 0",
  fontSize: "13px",
  borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
};

const totalStyle = {
  ...totalsRowStyle,
  fontSize: "17px",
  fontWeight: 800,
  color: "#f8fafc",
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
  border: primary ? "none" : "1px solid rgba(148, 163, 184, 0.28)",
  padding: "12px 14px",
  fontWeight: 700,
  cursor: "pointer",
  background: primary
    ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
    : "rgba(148, 163, 184, 0.12)",
  color: primary ? "#fff" : "#d1d5db",
});

const mapLinkStyle = {
  color: "#93c5fd",
  fontSize: "12px",
  textDecoration: "none",
};

const responsiveCss = `
@media (max-width: 1024px) {
  .change8-order-layout {
    grid-template-columns: 1fr !important;
  }
}
`;

const paymentOptions = ["Card", "Cash on Delivery", "Bank Transfer", "Wallet"];
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

const createEmptyItem = () => ({
  productId: "",
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
    shippingAddress: "",
    shippingMethod: "PickMe Flash",
    trackingNumber: "",
    shippingFee: 0,
    tax: 0,
    discount: 0,
  });

  const [lineItems, setLineItems] = useState([createEmptyItem()]);

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
          setLineItems([
            {
              productId: String(contextData.selectedProduct.id),
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
          setLineItems([
            {
              productId: String(preProductId),
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
        lineItems: validItems.map((item) => ({
          productId: Number(item.productId),
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
      <style>{responsiveCss}</style>

      <div style={headerStyle}>
        <h1 style={titleStyle}>Create New Order</h1>
        <p style={descStyle}>
          Customer details, line items, payment, shipping, and totals in one
          guided flow.
        </p>
      </div>

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

              <div style={grid2Style}>
                <div style={rowStyle}>
                  <label style={labelStyle}>Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleFormChange}
                    style={inputStyle}
                  >
                    {paymentOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
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
                        </div>
                      </div>

                      <div style={grid2Style}>
                        <div style={rowStyle}>
                          <label style={labelStyle}>Quantity</label>
                          <input
                            type="number"
                            min="1"
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

              <div style={rowStyle}>
                <label style={labelStyle}>Shipping Address</label>
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

              <div style={grid2Style}>
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

              <div style={grid2Style}>
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
