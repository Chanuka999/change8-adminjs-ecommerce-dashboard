(function (React) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const formatCurrency = value => {
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
    }, formatCurrency(data.revenue)), /*#__PURE__*/React__default.default.createElement("div", {
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
    }, formatCurrency(product.price))))))));
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
  AdminJS.UserComponents.ProductImage = ProductImage;
  AdminJS.UserComponents.ProductImageUpload = ProductImageUpload;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9hZG1pbi9kYXNoYm9hcmQuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS5qc3giLCIuLi9hZG1pbi9wcm9kdWN0LWltYWdlLXVwbG9hZC5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgZm9ybWF0Q3VycmVuY3kgPSAodmFsdWUpID0+IHtcclxuICByZXR1cm4gYFJzLiR7TnVtYmVyKHZhbHVlIHx8IDApLnRvTG9jYWxlU3RyaW5nKCl9YDtcclxufTtcclxuXHJcbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcclxuICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZSh7XHJcbiAgICB1c2VyczogMCxcclxuICAgIGNhdGVnb3JpZXM6IDAsXHJcbiAgICBwcm9kdWN0czogMCxcclxuICAgIG9yZGVyczogMCxcclxuICAgIHJldmVudWU6IDAsXHJcbiAgICBmZWF0dXJlZEdlbXM6IDAsXHJcbiAgICBjcml0aWNhbFN0b2NrOiAwLFxyXG4gICAgcmVjZW50UHJvZHVjdHM6IFtdLFxyXG4gICAgY2F0ZWdvcnlEaXN0cmlidXRpb246IFtdLFxyXG4gIH0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgbG9hZERhc2hib2FyZCA9IGFzeW5jICgpID0+IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hZG1pbi9hcGkvZGFzaGJvYXJkXCIpO1xyXG4gICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBzZXREYXRhKHBheWxvYWQgfHwge30pO1xyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkRGFzaGJvYXJkKCk7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCB0b3BDYXRlZ29yaWVzID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBkYXRhLmNhdGVnb3J5RGlzdHJpYnV0aW9uIHx8IFtdO1xyXG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZGlzdHJpYnV0aW9uLm1hcCgoaXRlbSkgPT4gaXRlbS5jb3VudCksIDEpO1xyXG5cclxuICAgIHJldHVybiBkaXN0cmlidXRpb24ubWFwKChpdGVtKSA9PiAoe1xyXG4gICAgICAuLi5pdGVtLFxyXG4gICAgICB3aWR0aDogYCR7TWF0aC5tYXgoOCwgTWF0aC5yb3VuZCgoaXRlbS5jb3VudCAvIG1heCkgKiAxMDApKX0lYCxcclxuICAgIH0pKTtcclxuICB9LCBbZGF0YS5jYXRlZ29yeURpc3RyaWJ1dGlvbl0pO1xyXG5cclxuICBjb25zdCBjb21wbGV0aW9uUmF0ZSA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3QgdG90YWwgPSBOdW1iZXIoZGF0YS5wcm9kdWN0cyB8fCAwKTtcclxuICAgIGlmICh0b3RhbCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBoZWFsdGh5ID0gTWF0aC5tYXgodG90YWwgLSBOdW1iZXIoZGF0YS5jcml0aWNhbFN0b2NrIHx8IDApLCAwKTtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKChoZWFsdGh5IC8gdG90YWwpICogMTAwKTtcclxuICB9LCBbZGF0YS5wcm9kdWN0cywgZGF0YS5jcml0aWNhbFN0b2NrXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtZGFzaGJvYXJkXCI+XHJcbiAgICAgIDxzdHlsZT5cclxuICAgICAgICB7YFxyXG4gICAgICAgICAgLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgICAgLS1iZy0xOiB2YXIoLS1jaGFuZ2U4LWJnLTEsICMwNTA5MTQpO1xyXG4gICAgICAgICAgICAtLWJnLTI6IHZhcigtLWNoYW5nZTgtYmctMiwgIzBiMWEzOCk7XHJcbiAgICAgICAgICAgIC0tYmctMzogdmFyKC0tY2hhbmdlOC1iZy0zLCAjMTIxZjNhKTtcclxuICAgICAgICAgICAgLS1nb2xkOiB2YXIoLS1jaGFuZ2U4LWdvbGQsICNlMmJmNjYpO1xyXG4gICAgICAgICAgICAtLXRleHQtbWFpbjogdmFyKC0tY2hhbmdlOC10ZXh0LW1haW4sICNmOGZhZmMpO1xyXG4gICAgICAgICAgICAtLXRleHQtbXV0ZWQ6IHZhcigtLWNoYW5nZTgtdGV4dC1tdXRlZCwgIzlhYThjMSk7XHJcbiAgICAgICAgICAgIC0tbGluZTogdmFyKC0tY2hhbmdlOC1saW5lLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDAuMjIpKTtcclxuICAgICAgICAgICAgLS1jYXJkLWJnOiB2YXIoLS1jaGFuZ2U4LWNhcmQtYmcsIGxpbmVhci1ncmFkaWVudCgxNjBkZWcsIHJnYmEoMjEsIDM0LCA2NiwgMC45NSkgMCUsIHJnYmEoMTAsIDE4LCAzNiwgMC45NSkgMTAwJSkpO1xyXG4gICAgICAgICAgICAtLWdyYWQtZW5kOiB2YXIoLS1jaGFuZ2U4LWdyYWQtZW5kLCAjMDQwNzBmKTtcclxuICAgICAgICAgICAgLS1zaGFkb3c6IHZhcigtLWNoYW5nZTgtc2hhZG93LCAwIDhweCAyNnB4IHJnYmEoMCwgMCwgMCwgMC4zKSk7XHJcbiAgICAgICAgICAgIC0tcmFkaWFsLTE6IHZhcigtLWNoYW5nZTgtcmFkaWFsLTEsIHJnYmEoMzQsIDkzLCAxODAsIDAuMzUpKTtcclxuICAgICAgICAgICAgLS1yYWRpYWwtMjogdmFyKC0tY2hhbmdlOC1yYWRpYWwtMiwgcmdiYSgyMjYsIDE5MSwgMTAyLCAwLjE2KSk7XHJcblxyXG4gICAgICAgICAgICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICAgICAgICAgICAgcGFkZGluZzogMzBweDtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbWFpbik7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6XHJcbiAgICAgICAgICAgICAgcmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCA4JSAwJSwgdmFyKC0tcmFkaWFsLTEpIDAlLCByZ2JhKDM0LCA5MywgMTgwLCAwKSAzOCUpLFxyXG4gICAgICAgICAgICAgIHJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgODUlIDEyJSwgdmFyKC0tcmFkaWFsLTIpIDAlLCByZ2JhKDIyNiwgMTkxLCAxMDIsIDApIDQyJSksXHJcbiAgICAgICAgICAgICAgbGluZWFyLWdyYWRpZW50KDEyMGRlZywgdmFyKC0tYmctMSkgMCUsIHZhcigtLWJnLTIpIDQ4JSwgdmFyKC0tZ3JhZC1lbmQpIDEwMCUpO1xyXG4gICAgICAgICAgICBmb250LWZhbWlseTogXCJQb3BwaW5zXCIsIFwiU2Vnb2UgVUlcIiwgc2Fucy1zZXJpZjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBodG1sW2RhdGEtYWRtaW4tdGhlbWU9J2xpZ2h0J10gLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LWJnLTE6ICNmMGY2ZmY7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC1iZy0yOiAjZmZmZmZmO1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtYmctMzogI2VlZjVmZjtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LWdvbGQ6ICNjMDhiMGY7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC10ZXh0LW1haW46ICMwZjE3MmE7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC10ZXh0LW11dGVkOiAjNDc1NTY5O1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtbGluZTogcmdiYSgxNSwgMjMsIDQyLCAwLjA4KTtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LWNhcmQtYmc6ICNmZmZmZmY7XHJcbiAgICAgICAgICAgIC0tY2hhbmdlOC1ncmFkLWVuZDogI2Y4ZmJmZjtcclxuICAgICAgICAgICAgLS1jaGFuZ2U4LXNoYWRvdzogMCA0cHggMjBweCByZ2JhKDE1LCAyMywgNDIsIDAuMDYpO1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtcmFkaWFsLTE6IHJnYmEoMzQsIDkzLCAxODAsIDAuMDgpO1xyXG4gICAgICAgICAgICAtLWNoYW5nZTgtcmFkaWFsLTI6IHJnYmEoMTkyLCAxMzksIDE1LCAwLjA1KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1oZWFkZXIge1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgICAgICAgICBhbmltYXRpb246IGZhZGUtdXAgNTIwbXMgZWFzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1raWNrZXIge1xyXG4gICAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4zNmVtO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1nb2xkKTtcclxuICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC10aXRsZSB7XHJcbiAgICAgICAgICAgIG1hcmdpbjogOHB4IDAgNnB4O1xyXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMS4wNjtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgzMnB4LCA1dncsIDU2cHgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXN1YnRpdGxlIHtcclxuICAgICAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1tZXRyaWMtZ3JpZCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDQsIG1pbm1heCgxNzBweCwgMWZyKSk7XHJcbiAgICAgICAgICAgIGdhcDogMTRweDtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogMThweDtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkIHtcclxuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDE2cHggMThweDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tY2FyZC1iZyk7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IHZhcigtLXNoYWRvdyk7XHJcbiAgICAgICAgICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xyXG4gICAgICAgICAgICBhbmltYXRpb246IGZhZGUtdXAgNTYwbXMgZWFzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkLWxhYmVsIHtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xOGVtO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkLXZhbHVlIHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiBjbGFtcCgzNHB4LCA0dncsIDUycHgpO1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1jYXJkLWhpbnQge1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogOHB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LWxheW91dCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogbWlubWF4KDMwMHB4LCAxLjhmcikgbWlubWF4KDI2MHB4LCAxZnIpO1xyXG4gICAgICAgICAgICBnYXA6IDE2cHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZ3Jlc3Mtd3JhcCB7XHJcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJvZ3Jlc3MtaGVhZCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDZweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1wcm9ncmVzcy10cmFjayB7XHJcbiAgICAgICAgICAgIGhlaWdodDogMTBweDtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xMik7XHJcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jaGFuZ2U4LXByb2dyZXNzLXRyYWNrIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgxNSwgMjMsIDQyLCAwLjEyKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1wcm9ncmVzcy1maWxsIHtcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLCAjZjVkZjkwIDAlLCAjZTJiZjY2IDEwMCUpO1xyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCAzMjBtcyBlYXNlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXJlY2VudC1saXN0IHtcclxuICAgICAgICAgICAgbWFyZ2luLXRvcDogNnB4O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC5jaGFuZ2U4LXJlY2VudC1pdGVtIHtcclxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4IDA7XHJcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaHRtbFtkYXRhLWFkbWluLXRoZW1lPSdsaWdodCddIC5jaGFuZ2U4LXJlY2VudC1pdGVtIHtcclxuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMTUsIDIzLCA0MiwgMC4xMik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcmVjZW50LWl0ZW06bGFzdC1jaGlsZCB7XHJcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtbmFtZSB7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAuY2hhbmdlOC1kYXRlIHtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLmNoYW5nZTgtcHJpY2Uge1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tZ29sZCk7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBAa2V5ZnJhbWVzIGZhZGUtdXAge1xyXG4gICAgICAgICAgICBmcm9tIHtcclxuICAgICAgICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg4cHgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRvIHtcclxuICAgICAgICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAxMTgwcHgpIHtcclxuICAgICAgICAgICAgLmNoYW5nZTgtbWV0cmljLWdyaWQge1xyXG4gICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgxODBweCwgMWZyKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LWxheW91dCB7XHJcbiAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNzIwcHgpIHtcclxuICAgICAgICAgICAgLmNoYW5nZTgtZGFzaGJvYXJkIHtcclxuICAgICAgICAgICAgICBwYWRkaW5nOiAyMHB4IDE2cHg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC5jaGFuZ2U4LW1ldHJpYy1ncmlkIHtcclxuICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGB9XHJcbiAgICAgIDwvc3R5bGU+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtaGVhZGVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWtpY2tlclwiPlNlY3Rpb24gVmlldzwvZGl2PlxyXG4gICAgICAgIDxoMSBjbGFzc05hbWU9XCJjaGFuZ2U4LXRpdGxlXCI+RGFzaGJvYXJkPC9oMT5cclxuICAgICAgICA8cCBjbGFzc05hbWU9XCJjaGFuZ2U4LXN1YnRpdGxlXCI+XHJcbiAgICAgICAgICBUcmFjayB5b3VyIGNvbW1lcmNlIGhlYWx0aCBhdCBhIGdsYW5jZSB3aXRoIGxpdmUgaW52ZW50b3J5IGFuZCBvcmRlclxyXG4gICAgICAgICAgc2lnbmFscy5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LW1ldHJpYy1ncmlkXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+UmV2ZW51ZSBTdHJlYW08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+XHJcbiAgICAgICAgICAgIHtmb3JtYXRDdXJyZW5jeShkYXRhLnJldmVudWUpfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+QWNyb3NzIGFsbCBvcmRlcnM8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+SW52ZW50b3J5IFNpemU8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLXZhbHVlXCI+e2RhdGEucHJvZHVjdHMgfHwgMH08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5Ub3RhbCBhY3RpdmUgY2F0YWxvZyBpdGVtczwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5GZWF0dXJlZCBHZW1zPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC12YWx1ZVwiPntkYXRhLmZlYXR1cmVkR2VtcyB8fCAwfTwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtaGludFwiPkN1cnJlbnRseSB2aXNpYmxlIHByb2R1Y3RzPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1sYWJlbFwiPkNyaXRpY2FsIFN0b2NrPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC12YWx1ZVwiPntkYXRhLmNyaXRpY2FsU3RvY2sgfHwgMH08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5JdGVtcyBuZWVkaW5nIHVyZ2VudCByZWZpbGw8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbGF5b3V0XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWxhYmVsXCI+Q2F0ZWdvcnkgRGlzdHJpYnV0aW9uPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+SW52ZW50b3J5IHNwbGl0IGJ5IHNlZ21lbnQ8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3Mtd3JhcFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3MtaGVhZFwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuPkhlYWx0aHkgc3RvY2sgbGV2ZWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN0cm9uZz57Y29tcGxldGlvblJhdGV9JTwvc3Ryb25nPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLXRyYWNrXCI+XHJcbiAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2hhbmdlOC1wcm9ncmVzcy1maWxsXCJcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBgJHtjb21wbGV0aW9uUmF0ZX0lYCB9fVxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgeyh0b3BDYXRlZ29yaWVzIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIj5ObyBjYXRlZ29yeSBkYXRhIHlldC48L2Rpdj5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICh0b3BDYXRlZ29yaWVzIHx8IFtdKS5tYXAoKGNhdGVnb3J5KSA9PiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e2NhdGVnb3J5Lm5hbWV9IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJvZ3Jlc3Mtd3JhcFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWhlYWRcIj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4+e2NhdGVnb3J5Lm5hbWV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPntjYXRlZ29yeS5jb3VudH08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLXRyYWNrXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjaGFuZ2U4LXByb2dyZXNzLWZpbGxcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBjYXRlZ29yeS53aWR0aCB9fVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWNhcmQtbGFiZWxcIj5SZWNlbnQgQWRkaXRpb25zPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtY2FyZC1oaW50XCI+XHJcbiAgICAgICAgICAgIExhdGVzdCBwcm9kdWN0cyBlbnRlcmluZyB0aGUgY2F0YWxvZ1xyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgeyhkYXRhLnJlY2VudFByb2R1Y3RzIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhbmdlOC1jYXJkLWhpbnRcIiBzdHlsZT17eyBtYXJnaW5Ub3A6IFwiMTJweFwiIH19PlxyXG4gICAgICAgICAgICAgIE5vIHByb2R1Y3RzIGFkZGVkIHlldC5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcmVjZW50LWxpc3RcIj5cclxuICAgICAgICAgICAgICB7KGRhdGEucmVjZW50UHJvZHVjdHMgfHwgW10pLm1hcCgocHJvZHVjdCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LXJlY2VudC1pdGVtXCIga2V5PXtwcm9kdWN0LmlkfT5cclxuICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtbmFtZVwiPntwcm9kdWN0Lm5hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFuZ2U4LWRhdGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIHtuZXcgRGF0ZShwcm9kdWN0LmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYW5nZTgtcHJpY2VcIj5cclxuICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0Q3VycmVuY3kocHJvZHVjdC5wcmljZSl9XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGFzaGJvYXJkO1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgY2VsbFN0eWxlID0ge1xyXG4gIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgZ2FwOiBcIjEycHhcIixcclxuICBtaW5IZWlnaHQ6IFwiNTZweFwiLFxyXG59O1xyXG5cclxuY29uc3QgaW1hZ2VTdHlsZSA9IHtcclxuICB3aWR0aDogXCI2NHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjQycHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTBweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZsZXhTaHJpbms6IDAsXHJcbn07XHJcblxyXG5jb25zdCBmYWxsYmFja1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjY0cHhcIixcclxuICBoZWlnaHQ6IFwiNDJweFwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBkYXNoZWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjYpXCIsXHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgY29sb3I6IFwiIzY0NzQ4YlwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG4gIGZsZXhTaHJpbms6IDAsXHJcbn07XHJcblxyXG5jb25zdCB0ZXh0U3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcclxuICBnYXA6IFwiMnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0SW1hZ2UgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCBpbWFnZVVybCA9IHByb3BzPy5yZWNvcmQ/LnBhcmFtcz8uW3Byb3BzPy5wcm9wZXJ0eT8ucGF0aF07XHJcbiAgY29uc3QgW2hhc0Vycm9yLCBzZXRIYXNFcnJvcl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBzZXRIYXNFcnJvcihmYWxzZSk7XHJcbiAgfSwgW2ltYWdlVXJsXSk7XHJcblxyXG4gIGlmICghaW1hZ2VVcmwpIHtcclxuICAgIHJldHVybiA8ZGl2IHN0eWxlPXtmYWxsYmFja1N0eWxlfT5ObyBpbWFnZTwvZGl2PjtcclxuICB9XHJcblxyXG4gIGlmIChoYXNFcnJvcikge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBzdHlsZT17Y2VsbFN0eWxlfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtmYWxsYmFja1N0eWxlfT5JbnZhbGlkPC9kaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IFwiIzBmMTcyYVwiIH19PkltYWdlIFVSTDwvc3Bhbj5cclxuICAgICAgICAgIDxhXHJcbiAgICAgICAgICAgIGhyZWY9e2ltYWdlVXJsfVxyXG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICBjb2xvcjogXCIjMjU2M2ViXCIsXHJcbiAgICAgICAgICAgICAgdGV4dERlY29yYXRpb246IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgT3BlbiBsaW5rXHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXtjZWxsU3R5bGV9PlxyXG4gICAgICA8aW1nXHJcbiAgICAgICAgc3JjPXtpbWFnZVVybH1cclxuICAgICAgICBhbHQ9XCJQcm9kdWN0XCJcclxuICAgICAgICBzdHlsZT17aW1hZ2VTdHlsZX1cclxuICAgICAgICBvbkVycm9yPXsoKSA9PiBzZXRIYXNFcnJvcih0cnVlKX1cclxuICAgICAgLz5cclxuICAgICAgPGRpdiBzdHlsZT17dGV4dFN0eWxlfT5cclxuICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiA2MDAsIGNvbG9yOiBcIiMwZjE3MmFcIiB9fT5QcmV2aWV3PC9zcGFuPlxyXG4gICAgICAgIDxhXHJcbiAgICAgICAgICBocmVmPXtpbWFnZVVybH1cclxuICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXHJcbiAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcclxuICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiBcIiMyNTYzZWJcIiwgdGV4dERlY29yYXRpb246IFwibm9uZVwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICBPcGVuIGltYWdlXHJcbiAgICAgICAgPC9hPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0SW1hZ2U7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCB3cmFwcGVyU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcclxuICBnYXA6IFwiMTBweFwiLFxyXG59O1xyXG5cclxuY29uc3QgcHJldmlld1N0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjE0MHB4XCIsXHJcbiAgaGVpZ2h0OiBcIjk2cHhcIixcclxuICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICBib3JkZXJSYWRpdXM6IFwiMTJweFwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgxNDgsIDE2MywgMTg0LCAwLjM1KVwiLFxyXG4gIGJhY2tncm91bmQ6IFwiI2Y4ZmFmY1wiLFxyXG59O1xyXG5cclxuY29uc3QgaGludFN0eWxlID0ge1xyXG4gIGZvbnRTaXplOiBcIjEycHhcIixcclxuICBjb2xvcjogXCIjNjQ3NDhiXCIsXHJcbn07XHJcblxyXG5jb25zdCBQcm9kdWN0SW1hZ2VVcGxvYWQgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCB7IG9uQ2hhbmdlLCByZWNvcmQgfSA9IHByb3BzO1xyXG4gIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHJlY29yZD8ucGFyYW1zPy5pbWFnZVVybCB8fCBcIlwiO1xyXG4gIGNvbnN0IGN1cnJlbnRQdWJsaWNJZCA9IHJlY29yZD8ucGFyYW1zPy5pbWFnZVB1YmxpY0lkIHx8IFwiXCI7XHJcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoY3VycmVudFZhbHVlKTtcclxuICBjb25zdCBbcHVibGljSWQsIHNldFB1YmxpY0lkXSA9IHVzZVN0YXRlKGN1cnJlbnRQdWJsaWNJZCk7XHJcbiAgY29uc3QgW3VwbG9hZGluZywgc2V0VXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgc2V0UHJldmlld1VybChjdXJyZW50VmFsdWUpO1xyXG4gICAgc2V0UHVibGljSWQoY3VycmVudFB1YmxpY0lkKTtcclxuICB9LCBbY3VycmVudFZhbHVlLCBjdXJyZW50UHVibGljSWRdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlVXBsb2FkID0gYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF07XHJcblxyXG4gICAgaWYgKCFmaWxlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRVcGxvYWRpbmcodHJ1ZSk7XHJcbiAgICBzZXRFcnJvcihcIlwiKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXCJpbWFnZVwiLCBmaWxlKTtcclxuXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvYXBpL3VwbG9hZHMvaW1hZ2VcIiwge1xyXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgYm9keTogZm9ybURhdGEsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF5bG9hZC5tZXNzYWdlIHx8IFwiSW1hZ2UgdXBsb2FkIGZhaWxlZFwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdXBsb2FkZWRVcmwgPSBwYXlsb2FkLnVybCB8fCBcIlwiO1xyXG4gICAgICBjb25zdCB1cGxvYWRlZFB1YmxpY0lkID0gcGF5bG9hZC5wdWJsaWNJZCB8fCBcIlwiO1xyXG4gICAgICBzZXRQcmV2aWV3VXJsKHVwbG9hZGVkVXJsKTtcclxuICAgICAgc2V0UHVibGljSWQodXBsb2FkZWRQdWJsaWNJZCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVVybFwiLCB1cGxvYWRlZFVybCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVB1YmxpY0lkXCIsIHVwbG9hZGVkUHVibGljSWQpO1xyXG4gICAgICBvbkNoYW5nZT8uKFwidXBsb2FkSW1hZ2VcIiwgdXBsb2FkZWRVcmwpO1xyXG4gICAgfSBjYXRjaCAodXBsb2FkRXJyb3IpIHtcclxuICAgICAgc2V0RXJyb3IodXBsb2FkRXJyb3IubWVzc2FnZSk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRVcGxvYWRpbmcoZmFsc2UpO1xyXG4gICAgICBldmVudC50YXJnZXQudmFsdWUgPSBcIlwiO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZVJlbW92ZSA9ICgpID0+IHtcclxuICAgIHNldFByZXZpZXdVcmwoXCJcIik7XHJcbiAgICBzZXRQdWJsaWNJZChcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVVybFwiLCBcIlwiKTtcclxuICAgIG9uQ2hhbmdlPy4oXCJpbWFnZVB1YmxpY0lkXCIsIFwiXCIpO1xyXG4gICAgb25DaGFuZ2U/LihcInVwbG9hZEltYWdlXCIsIFwiXCIpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt3cmFwcGVyU3R5bGV9PlxyXG4gICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgb25DaGFuZ2U9e2hhbmRsZVVwbG9hZH0gLz5cclxuICAgICAgPGRpdiBzdHlsZT17aGludFN0eWxlfT5cclxuICAgICAgICB7dXBsb2FkaW5nXHJcbiAgICAgICAgICA/IFwiVXBsb2FkaW5nIHRvIENsb3VkaW5hcnkuLi5cIlxyXG4gICAgICAgICAgOiBcIkNob29zZSBhbiBpbWFnZSBmaWxlIHRvIHVwbG9hZFwifVxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHtwcmV2aWV3VXJsID8gKFxyXG4gICAgICAgIDw+XHJcbiAgICAgICAgICA8aW1nIHNyYz17cHJldmlld1VybH0gYWx0PVwiUHJvZHVjdCBwcmV2aWV3XCIgc3R5bGU9e3ByZXZpZXdTdHlsZX0gLz5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVJlbW92ZX1cclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICB3aWR0aDogXCJmaXQtY29udGVudFwiLFxyXG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwiNnB4IDEwcHhcIixcclxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IFwiOHB4XCIsXHJcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCAjZWY0NDQ0XCIsXHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiI2VmNDQ0NFwiLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiI2ZmZlwiLFxyXG4gICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIFJlbW92ZSBpbWFnZVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC8+XHJcbiAgICAgICkgOiBudWxsfVxyXG5cclxuICAgICAge2Vycm9yID8gKFxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgLi4uaGludFN0eWxlLCBjb2xvcjogXCIjZGMyNjI2XCIgfX0+e2Vycm9yfTwvZGl2PlxyXG4gICAgICApIDogbnVsbH1cclxuXHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImltYWdlVXJsXCIgdmFsdWU9e3ByZXZpZXdVcmx9IHJlYWRPbmx5IC8+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImltYWdlUHVibGljSWRcIiB2YWx1ZT17cHVibGljSWR9IHJlYWRPbmx5IC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdEltYWdlVXBsb2FkO1xyXG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi4vYWRtaW4vZGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmRcbmltcG9ydCBQcm9kdWN0SW1hZ2UgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1pbWFnZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvZHVjdEltYWdlID0gUHJvZHVjdEltYWdlXG5pbXBvcnQgUHJvZHVjdEltYWdlVXBsb2FkIGZyb20gJy4uL2FkbWluL3Byb2R1Y3QtaW1hZ2UtdXBsb2FkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0SW1hZ2VVcGxvYWQgPSBQcm9kdWN0SW1hZ2VVcGxvYWQiXSwibmFtZXMiOlsiZm9ybWF0Q3VycmVuY3kiLCJ2YWx1ZSIsIk51bWJlciIsInRvTG9jYWxlU3RyaW5nIiwiRGFzaGJvYXJkIiwiZGF0YSIsInNldERhdGEiLCJ1c2VTdGF0ZSIsInVzZXJzIiwiY2F0ZWdvcmllcyIsInByb2R1Y3RzIiwib3JkZXJzIiwicmV2ZW51ZSIsImZlYXR1cmVkR2VtcyIsImNyaXRpY2FsU3RvY2siLCJyZWNlbnRQcm9kdWN0cyIsImNhdGVnb3J5RGlzdHJpYnV0aW9uIiwidXNlRWZmZWN0IiwibG9hZERhc2hib2FyZCIsInJlc3BvbnNlIiwiZmV0Y2giLCJwYXlsb2FkIiwianNvbiIsInRvcENhdGVnb3JpZXMiLCJ1c2VNZW1vIiwiZGlzdHJpYnV0aW9uIiwibWF4IiwiTWF0aCIsIm1hcCIsIml0ZW0iLCJjb3VudCIsIndpZHRoIiwicm91bmQiLCJjb21wbGV0aW9uUmF0ZSIsInRvdGFsIiwiaGVhbHRoeSIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsInN0eWxlIiwibGVuZ3RoIiwiY2F0ZWdvcnkiLCJrZXkiLCJuYW1lIiwibWFyZ2luVG9wIiwicHJvZHVjdCIsImlkIiwiRGF0ZSIsImNyZWF0ZWRBdCIsInRvTG9jYWxlRGF0ZVN0cmluZyIsInByaWNlIiwiY2VsbFN0eWxlIiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJnYXAiLCJtaW5IZWlnaHQiLCJpbWFnZVN0eWxlIiwiaGVpZ2h0Iiwib2JqZWN0Rml0IiwiYm9yZGVyUmFkaXVzIiwiYm9yZGVyIiwiYmFja2dyb3VuZCIsImZsZXhTaHJpbmsiLCJmYWxsYmFja1N0eWxlIiwianVzdGlmeUNvbnRlbnQiLCJmb250U2l6ZSIsImNvbG9yIiwidGV4dFN0eWxlIiwiZmxleERpcmVjdGlvbiIsIlByb2R1Y3RJbWFnZSIsInByb3BzIiwiaW1hZ2VVcmwiLCJyZWNvcmQiLCJwYXJhbXMiLCJwcm9wZXJ0eSIsInBhdGgiLCJoYXNFcnJvciIsInNldEhhc0Vycm9yIiwiZm9udFdlaWdodCIsImhyZWYiLCJ0YXJnZXQiLCJyZWwiLCJ0ZXh0RGVjb3JhdGlvbiIsInNyYyIsImFsdCIsIm9uRXJyb3IiLCJ3cmFwcGVyU3R5bGUiLCJwcmV2aWV3U3R5bGUiLCJoaW50U3R5bGUiLCJQcm9kdWN0SW1hZ2VVcGxvYWQiLCJvbkNoYW5nZSIsImN1cnJlbnRWYWx1ZSIsImN1cnJlbnRQdWJsaWNJZCIsImltYWdlUHVibGljSWQiLCJwcmV2aWV3VXJsIiwic2V0UHJldmlld1VybCIsInB1YmxpY0lkIiwic2V0UHVibGljSWQiLCJ1cGxvYWRpbmciLCJzZXRVcGxvYWRpbmciLCJlcnJvciIsInNldEVycm9yIiwiaGFuZGxlVXBsb2FkIiwiZXZlbnQiLCJmaWxlIiwiZmlsZXMiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiYXBwZW5kIiwibWV0aG9kIiwiYm9keSIsIm9rIiwiRXJyb3IiLCJtZXNzYWdlIiwidXBsb2FkZWRVcmwiLCJ1cmwiLCJ1cGxvYWRlZFB1YmxpY0lkIiwidXBsb2FkRXJyb3IiLCJoYW5kbGVSZW1vdmUiLCJ0eXBlIiwiYWNjZXB0IiwiRnJhZ21lbnQiLCJvbkNsaWNrIiwicGFkZGluZyIsImN1cnNvciIsInJlYWRPbmx5IiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBRUEsTUFBTUEsY0FBYyxHQUFJQyxLQUFLLElBQUs7SUFDaEMsT0FBTyxDQUFBLEdBQUEsRUFBTUMsTUFBTSxDQUFDRCxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUNFLGNBQWMsRUFBRSxDQUFBLENBQUU7RUFDcEQsQ0FBQztFQUVELE1BQU1DLFNBQVMsR0FBR0EsTUFBTTtFQUN0QixFQUFBLE1BQU0sQ0FBQ0MsSUFBSSxFQUFFQyxPQUFPLENBQUMsR0FBR0MsY0FBUSxDQUFDO0VBQy9CQyxJQUFBQSxLQUFLLEVBQUUsQ0FBQztFQUNSQyxJQUFBQSxVQUFVLEVBQUUsQ0FBQztFQUNiQyxJQUFBQSxRQUFRLEVBQUUsQ0FBQztFQUNYQyxJQUFBQSxNQUFNLEVBQUUsQ0FBQztFQUNUQyxJQUFBQSxPQUFPLEVBQUUsQ0FBQztFQUNWQyxJQUFBQSxZQUFZLEVBQUUsQ0FBQztFQUNmQyxJQUFBQSxhQUFhLEVBQUUsQ0FBQztFQUNoQkMsSUFBQUEsY0FB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
