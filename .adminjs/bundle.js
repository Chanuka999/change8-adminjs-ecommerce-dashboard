(function (React) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const cardStyle = {
    background: "linear-gradient(160deg, #1a2235 0%, #0f172a 100%)",
    border: "1px solid rgba(214, 174, 70, 0.18)",
    borderRadius: "18px",
    padding: "20px",
    color: "#f8fafc",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)"
  };
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
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        minHeight: "100vh",
        padding: "30px",
        color: "#f8fafc",
        background: "radial-gradient(circle at 10% 0%, #1f2e56 0%, #0b1222 45%, #080d19 100%)",
        fontFamily: "'Segoe UI', sans-serif"
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        letterSpacing: "0.3em",
        fontSize: "11px",
        fontWeight: 600,
        color: "#d6ae46",
        marginBottom: "10px"
      }
    }, "SECTION VIEW"), /*#__PURE__*/React__default.default.createElement("h1", {
      style: {
        marginTop: 0,
        fontSize: "42px",
        marginBottom: "26px"
      }
    }, "Dashboard"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        marginBottom: "20px"
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: "#98a2b3",
        fontSize: "12px",
        letterSpacing: "0.2em"
      }
    }, "REVENUE STREAM"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: "42px",
        fontWeight: 700,
        marginTop: "8px"
      }
    }, formatCurrency(data.revenue))), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: "#98a2b3",
        fontSize: "12px",
        letterSpacing: "0.2em"
      }
    }, "INVENTORY SIZE"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: "42px",
        fontWeight: 700,
        marginTop: "8px"
      }
    }, data.products || 0)), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: "#98a2b3",
        fontSize: "12px",
        letterSpacing: "0.2em"
      }
    }, "FEATURED GEMS"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: "42px",
        fontWeight: 700,
        marginTop: "8px"
      }
    }, data.featuredGems || 0)), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: "#98a2b3",
        fontSize: "12px",
        letterSpacing: "0.2em"
      }
    }, "CRITICAL STOCK"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: "42px",
        fontWeight: 700,
        marginTop: "8px"
      }
    }, data.criticalStock || 0))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "minmax(280px, 2fr) minmax(260px, 1fr)",
        gap: "16px"
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: {
        marginTop: 0,
        marginBottom: "6px"
      }
    }, "Category Distribution"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: "#98a2b3",
        marginBottom: "16px"
      }
    }, "Inventory breakdown by segment"), (topCategories || []).length === 0 ? /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: "#98a2b3"
      }
    }, "No category data yet.") : (topCategories || []).map(category => /*#__PURE__*/React__default.default.createElement("div", {
      key: category.name,
      style: {
        marginBottom: "14px"
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "6px",
        color: "#e2e8f0"
      }
    }, /*#__PURE__*/React__default.default.createElement("span", null, category.name), /*#__PURE__*/React__default.default.createElement("span", null, category.count)), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        height: "10px",
        background: "rgba(255, 255, 255, 0.08)",
        borderRadius: "999px"
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: category.width,
        height: "100%",
        borderRadius: "999px",
        background: "linear-gradient(90deg, #d6ae46 0%, #f6db81 100%)"
      }
    }))))), /*#__PURE__*/React__default.default.createElement("div", {
      style: cardStyle
    }, /*#__PURE__*/React__default.default.createElement("h2", {
      style: {
        marginTop: 0,
        marginBottom: "14px"
      }
    }, "Recent Additions"), (data.recentProducts || []).length === 0 ? /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: "#98a2b3"
      }
    }, "No products added yet.") : (data.recentProducts || []).map(product => /*#__PURE__*/React__default.default.createElement("div", {
      key: product.id,
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "14px",
        paddingBottom: "12px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontWeight: 600
      }
    }, product.name), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: "#98a2b3",
        fontSize: "13px"
      }
    }, new Date(product.createdAt).toLocaleDateString())), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: "#d6ae46",
        fontWeight: 700
      }
    }, formatCurrency(product.price)))))));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9hZG1pbi9kYXNoYm9hcmQuanN4IiwiLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS5qc3giLCIuLi9hZG1pbi9wcm9kdWN0LWltYWdlLXVwbG9hZC5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgY2FyZFN0eWxlID0ge1xyXG4gIGJhY2tncm91bmQ6IFwibGluZWFyLWdyYWRpZW50KDE2MGRlZywgIzFhMjIzNSAwJSwgIzBmMTcyYSAxMDAlKVwiLFxyXG4gIGJvcmRlcjogXCIxcHggc29saWQgcmdiYSgyMTQsIDE3NCwgNzAsIDAuMTgpXCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjE4cHhcIixcclxuICBwYWRkaW5nOiBcIjIwcHhcIixcclxuICBjb2xvcjogXCIjZjhmYWZjXCIsXHJcbiAgYm94U2hhZG93OiBcIjAgMTJweCA0MHB4IHJnYmEoMCwgMCwgMCwgMC4zKVwiLFxyXG59O1xyXG5cclxuY29uc3QgZm9ybWF0Q3VycmVuY3kgPSAodmFsdWUpID0+IHtcclxuICByZXR1cm4gYFJzLiR7TnVtYmVyKHZhbHVlIHx8IDApLnRvTG9jYWxlU3RyaW5nKCl9YDtcclxufTtcclxuXHJcbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcclxuICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZSh7XHJcbiAgICB1c2VyczogMCxcclxuICAgIGNhdGVnb3JpZXM6IDAsXHJcbiAgICBwcm9kdWN0czogMCxcclxuICAgIG9yZGVyczogMCxcclxuICAgIHJldmVudWU6IDAsXHJcbiAgICBmZWF0dXJlZEdlbXM6IDAsXHJcbiAgICBjcml0aWNhbFN0b2NrOiAwLFxyXG4gICAgcmVjZW50UHJvZHVjdHM6IFtdLFxyXG4gICAgY2F0ZWdvcnlEaXN0cmlidXRpb246IFtdLFxyXG4gIH0pO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgbG9hZERhc2hib2FyZCA9IGFzeW5jICgpID0+IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hZG1pbi9hcGkvZGFzaGJvYXJkXCIpO1xyXG4gICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICBzZXREYXRhKHBheWxvYWQgfHwge30pO1xyXG4gICAgfTtcclxuXHJcbiAgICBsb2FkRGFzaGJvYXJkKCk7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCB0b3BDYXRlZ29yaWVzID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBkYXRhLmNhdGVnb3J5RGlzdHJpYnV0aW9uIHx8IFtdO1xyXG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZGlzdHJpYnV0aW9uLm1hcCgoaXRlbSkgPT4gaXRlbS5jb3VudCksIDEpO1xyXG5cclxuICAgIHJldHVybiBkaXN0cmlidXRpb24ubWFwKChpdGVtKSA9PiAoe1xyXG4gICAgICAuLi5pdGVtLFxyXG4gICAgICB3aWR0aDogYCR7TWF0aC5tYXgoOCwgTWF0aC5yb3VuZCgoaXRlbS5jb3VudCAvIG1heCkgKiAxMDApKX0lYCxcclxuICAgIH0pKTtcclxuICB9LCBbZGF0YS5jYXRlZ29yeURpc3RyaWJ1dGlvbl0pO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIG1pbkhlaWdodDogXCIxMDB2aFwiLFxyXG4gICAgICAgIHBhZGRpbmc6IFwiMzBweFwiLFxyXG4gICAgICAgIGNvbG9yOiBcIiNmOGZhZmNcIixcclxuICAgICAgICBiYWNrZ3JvdW5kOlxyXG4gICAgICAgICAgXCJyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDEwJSAwJSwgIzFmMmU1NiAwJSwgIzBiMTIyMiA0NSUsICMwODBkMTkgMTAwJSlcIixcclxuICAgICAgICBmb250RmFtaWx5OiBcIidTZWdvZSBVSScsIHNhbnMtc2VyaWZcIixcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAgPGRpdlxyXG4gICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuM2VtXCIsXHJcbiAgICAgICAgICBmb250U2l6ZTogXCIxMXB4XCIsXHJcbiAgICAgICAgICBmb250V2VpZ2h0OiA2MDAsXHJcbiAgICAgICAgICBjb2xvcjogXCIjZDZhZTQ2XCIsXHJcbiAgICAgICAgICBtYXJnaW5Cb3R0b206IFwiMTBweFwiLFxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICBTRUNUSU9OIFZJRVdcclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxoMSBzdHlsZT17eyBtYXJnaW5Ub3A6IDAsIGZvbnRTaXplOiBcIjQycHhcIiwgbWFyZ2luQm90dG9tOiBcIjI2cHhcIiB9fT5cclxuICAgICAgICBEYXNoYm9hcmRcclxuICAgICAgPC9oMT5cclxuXHJcbiAgICAgIDxkaXZcclxuICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcInJlcGVhdChhdXRvLWZpdCwgbWlubWF4KDIyMHB4LCAxZnIpKVwiLFxyXG4gICAgICAgICAgZ2FwOiBcIjE2cHhcIixcclxuICAgICAgICAgIG1hcmdpbkJvdHRvbTogXCIyMHB4XCIsXHJcbiAgICAgICAgfX1cclxuICAgICAgPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiIzk4YTJiM1wiLFxyXG4gICAgICAgICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcclxuICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMmVtXCIsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIFJFVkVOVUUgU1RSRUFNXHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6IFwiNDJweFwiLCBmb250V2VpZ2h0OiA3MDAsIG1hcmdpblRvcDogXCI4cHhcIiB9fT5cclxuICAgICAgICAgICAge2Zvcm1hdEN1cnJlbmN5KGRhdGEucmV2ZW51ZSl9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBzdHlsZT17Y2FyZFN0eWxlfT5cclxuICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICBjb2xvcjogXCIjOThhMmIzXCIsXHJcbiAgICAgICAgICAgICAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4yZW1cIixcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgSU5WRU5UT1JZIFNJWkVcclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogXCI0MnB4XCIsIGZvbnRXZWlnaHQ6IDcwMCwgbWFyZ2luVG9wOiBcIjhweFwiIH19PlxyXG4gICAgICAgICAgICB7ZGF0YS5wcm9kdWN0cyB8fCAwfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiIzk4YTJiM1wiLFxyXG4gICAgICAgICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcclxuICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMmVtXCIsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIEZFQVRVUkVEIEdFTVNcclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogXCI0MnB4XCIsIGZvbnRXZWlnaHQ6IDcwMCwgbWFyZ2luVG9wOiBcIjhweFwiIH19PlxyXG4gICAgICAgICAgICB7ZGF0YS5mZWF0dXJlZEdlbXMgfHwgMH1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBcIiM5OGEyYjNcIixcclxuICAgICAgICAgICAgICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjJlbVwiLFxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBDUklUSUNBTCBTVE9DS1xyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiBcIjQycHhcIiwgZm9udFdlaWdodDogNzAwLCBtYXJnaW5Ub3A6IFwiOHB4XCIgfX0+XHJcbiAgICAgICAgICAgIHtkYXRhLmNyaXRpY2FsU3RvY2sgfHwgMH1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXZcclxuICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgZGlzcGxheTogXCJncmlkXCIsXHJcbiAgICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIm1pbm1heCgyODBweCwgMmZyKSBtaW5tYXgoMjYwcHgsIDFmcilcIixcclxuICAgICAgICAgIGdhcDogXCIxNnB4XCIsXHJcbiAgICAgICAgfX1cclxuICAgICAgPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2NhcmRTdHlsZX0+XHJcbiAgICAgICAgICA8aDIgc3R5bGU9e3sgbWFyZ2luVG9wOiAwLCBtYXJnaW5Cb3R0b206IFwiNnB4XCIgfX0+XHJcbiAgICAgICAgICAgIENhdGVnb3J5IERpc3RyaWJ1dGlvblxyXG4gICAgICAgICAgPC9oMj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6IFwiIzk4YTJiM1wiLCBtYXJnaW5Cb3R0b206IFwiMTZweFwiIH19PlxyXG4gICAgICAgICAgICBJbnZlbnRvcnkgYnJlYWtkb3duIGJ5IHNlZ21lbnRcclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIHsodG9wQ2F0ZWdvcmllcyB8fCBbXSkubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiBcIiM5OGEyYjNcIiB9fT5ObyBjYXRlZ29yeSBkYXRhIHlldC48L2Rpdj5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICh0b3BDYXRlZ29yaWVzIHx8IFtdKS5tYXAoKGNhdGVnb3J5KSA9PiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e2NhdGVnb3J5Lm5hbWV9IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogXCIxNHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogXCI2cHhcIixcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjZTJlOGYwXCIsXHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuPntjYXRlZ29yeS5uYW1lfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4+e2NhdGVnb3J5LmNvdW50fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogXCIxMHB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDgpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjk5OXB4XCIsXHJcbiAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNhdGVnb3J5LndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCI5OTlweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsaW5lYXItZ3JhZGllbnQoOTBkZWcsICNkNmFlNDYgMCUsICNmNmRiODEgMTAwJSlcIixcclxuICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXtjYXJkU3R5bGV9PlxyXG4gICAgICAgICAgPGgyIHN0eWxlPXt7IG1hcmdpblRvcDogMCwgbWFyZ2luQm90dG9tOiBcIjE0cHhcIiB9fT5cclxuICAgICAgICAgICAgUmVjZW50IEFkZGl0aW9uc1xyXG4gICAgICAgICAgPC9oMj5cclxuXHJcbiAgICAgICAgICB7KGRhdGEucmVjZW50UHJvZHVjdHMgfHwgW10pLmxlbmd0aCA9PT0gMCA/IChcclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogXCIjOThhMmIzXCIgfX0+Tm8gcHJvZHVjdHMgYWRkZWQgeWV0LjwvZGl2PlxyXG4gICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgKGRhdGEucmVjZW50UHJvZHVjdHMgfHwgW10pLm1hcCgocHJvZHVjdCkgPT4gKFxyXG4gICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIGtleT17cHJvZHVjdC5pZH1cclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxyXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXHJcbiAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogXCIxNHB4XCIsXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdCb3R0b206IFwiMTJweFwiLFxyXG4gICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wOClcIixcclxuICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250V2VpZ2h0OiA2MDAgfX0+e3Byb2R1Y3QubmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogXCIjOThhMmIzXCIsIGZvbnRTaXplOiBcIjEzcHhcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICB7bmV3IERhdGUocHJvZHVjdC5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZygpfVxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogXCIjZDZhZTQ2XCIsIGZvbnRXZWlnaHQ6IDcwMCB9fT5cclxuICAgICAgICAgICAgICAgICAge2Zvcm1hdEN1cnJlbmN5KHByb2R1Y3QucHJpY2UpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmQ7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBjZWxsU3R5bGUgPSB7XHJcbiAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICBnYXA6IFwiMTJweFwiLFxyXG4gIG1pbkhlaWdodDogXCI1NnB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBpbWFnZVN0eWxlID0ge1xyXG4gIHdpZHRoOiBcIjY0cHhcIixcclxuICBoZWlnaHQ6IFwiNDJweFwiLFxyXG4gIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMHB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMzUpXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZjhmYWZjXCIsXHJcbiAgZmxleFNocmluazogMCxcclxufTtcclxuXHJcbmNvbnN0IGZhbGxiYWNrU3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiNjRweFwiLFxyXG4gIGhlaWdodDogXCI0MnB4XCIsXHJcbiAgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIixcclxuICBib3JkZXI6IFwiMXB4IGRhc2hlZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuNilcIixcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxyXG4gIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gIGZvbnRTaXplOiBcIjExcHhcIixcclxuICBjb2xvcjogXCIjNjQ3NDhiXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZjhmYWZjXCIsXHJcbiAgZmxleFNocmluazogMCxcclxufTtcclxuXHJcbmNvbnN0IHRleHRTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLFxyXG4gIGdhcDogXCIycHhcIixcclxufTtcclxuXHJcbmNvbnN0IFByb2R1Y3RJbWFnZSA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnN0IGltYWdlVXJsID0gcHJvcHM/LnJlY29yZD8ucGFyYW1zPy5bcHJvcHM/LnByb3BlcnR5Py5wYXRoXTtcclxuICBjb25zdCBbaGFzRXJyb3IsIHNldEhhc0Vycm9yXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIHNldEhhc0Vycm9yKGZhbHNlKTtcclxuICB9LCBbaW1hZ2VVcmxdKTtcclxuXHJcbiAgaWYgKCFpbWFnZVVybCkge1xyXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e2ZhbGxiYWNrU3R5bGV9Pk5vIGltYWdlPC9kaXY+O1xyXG4gIH1cclxuXHJcbiAgaWYgKGhhc0Vycm9yKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IHN0eWxlPXtjZWxsU3R5bGV9PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e2ZhbGxiYWNrU3R5bGV9PkludmFsaWQ8L2Rpdj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt0ZXh0U3R5bGV9PlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogNjAwLCBjb2xvcjogXCIjMGYxNzJhXCIgfX0+SW1hZ2UgVVJMPC9zcGFuPlxyXG4gICAgICAgICAgPGFcclxuICAgICAgICAgICAgaHJlZj17aW1hZ2VVcmx9XHJcbiAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXHJcbiAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxyXG4gICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBcIiMyNTYzZWJcIixcclxuICAgICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsXHJcbiAgICAgICAgICAgICAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBPcGVuIGxpbmtcclxuICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e2NlbGxTdHlsZX0+XHJcbiAgICAgIDxpbWdcclxuICAgICAgICBzcmM9e2ltYWdlVXJsfVxyXG4gICAgICAgIGFsdD1cIlByb2R1Y3RcIlxyXG4gICAgICAgIHN0eWxlPXtpbWFnZVN0eWxlfVxyXG4gICAgICAgIG9uRXJyb3I9eygpID0+IHNldEhhc0Vycm9yKHRydWUpfVxyXG4gICAgICAvPlxyXG4gICAgICA8ZGl2IHN0eWxlPXt0ZXh0U3R5bGV9PlxyXG4gICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDYwMCwgY29sb3I6IFwiIzBmMTcyYVwiIH19PlByZXZpZXc8L3NwYW4+XHJcbiAgICAgICAgPGFcclxuICAgICAgICAgIGhyZWY9e2ltYWdlVXJsfVxyXG4gICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcclxuICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxyXG4gICAgICAgICAgc3R5bGU9e3sgY29sb3I6IFwiIzI1NjNlYlwiLCB0ZXh0RGVjb3JhdGlvbjogXCJub25lXCIsIGZvbnRTaXplOiBcIjEycHhcIiB9fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIE9wZW4gaW1hZ2VcclxuICAgICAgICA8L2E+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3RJbWFnZTtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IHdyYXBwZXJTdHlsZSA9IHtcclxuICBkaXNwbGF5OiBcImZsZXhcIixcclxuICBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLFxyXG4gIGdhcDogXCIxMHB4XCIsXHJcbn07XHJcblxyXG5jb25zdCBwcmV2aWV3U3R5bGUgPSB7XHJcbiAgd2lkdGg6IFwiMTQwcHhcIixcclxuICBoZWlnaHQ6IFwiOTZweFwiLFxyXG4gIG9iamVjdEZpdDogXCJjb3ZlclwiLFxyXG4gIGJvcmRlclJhZGl1czogXCIxMnB4XCIsXHJcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCByZ2JhKDE0OCwgMTYzLCAxODQsIDAuMzUpXCIsXHJcbiAgYmFja2dyb3VuZDogXCIjZjhmYWZjXCIsXHJcbn07XHJcblxyXG5jb25zdCBoaW50U3R5bGUgPSB7XHJcbiAgZm9udFNpemU6IFwiMTJweFwiLFxyXG4gIGNvbG9yOiBcIiM2NDc0OGJcIixcclxufTtcclxuXHJcbmNvbnN0IFByb2R1Y3RJbWFnZVVwbG9hZCA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnN0IHsgb25DaGFuZ2UsIHJlY29yZCB9ID0gcHJvcHM7XHJcbiAgY29uc3QgY3VycmVudFZhbHVlID0gcmVjb3JkPy5wYXJhbXM/LmltYWdlVXJsIHx8IFwiXCI7XHJcbiAgY29uc3QgY3VycmVudFB1YmxpY0lkID0gcmVjb3JkPy5wYXJhbXM/LmltYWdlUHVibGljSWQgfHwgXCJcIjtcclxuICBjb25zdCBbcHJldmlld1VybCwgc2V0UHJldmlld1VybF0gPSB1c2VTdGF0ZShjdXJyZW50VmFsdWUpO1xyXG4gIGNvbnN0IFtwdWJsaWNJZCwgc2V0UHVibGljSWRdID0gdXNlU3RhdGUoY3VycmVudFB1YmxpY0lkKTtcclxuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoXCJcIik7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBzZXRQcmV2aWV3VXJsKGN1cnJlbnRWYWx1ZSk7XHJcbiAgICBzZXRQdWJsaWNJZChjdXJyZW50UHVibGljSWQpO1xyXG4gIH0sIFtjdXJyZW50VmFsdWUsIGN1cnJlbnRQdWJsaWNJZF0pO1xyXG5cclxuICBjb25zdCBoYW5kbGVVcGxvYWQgPSBhc3luYyAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGZpbGUgPSBldmVudC50YXJnZXQuZmlsZXM/LlswXTtcclxuXHJcbiAgICBpZiAoIWZpbGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFVwbG9hZGluZyh0cnVlKTtcclxuICAgIHNldEVycm9yKFwiXCIpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgIGZvcm1EYXRhLmFwcGVuZChcImltYWdlXCIsIGZpbGUpO1xyXG5cclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hcGkvdXBsb2Fkcy9pbWFnZVwiLCB7XHJcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihwYXlsb2FkLm1lc3NhZ2UgfHwgXCJJbWFnZSB1cGxvYWQgZmFpbGVkXCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB1cGxvYWRlZFVybCA9IHBheWxvYWQudXJsIHx8IFwiXCI7XHJcbiAgICAgIGNvbnN0IHVwbG9hZGVkUHVibGljSWQgPSBwYXlsb2FkLnB1YmxpY0lkIHx8IFwiXCI7XHJcbiAgICAgIHNldFByZXZpZXdVcmwodXBsb2FkZWRVcmwpO1xyXG4gICAgICBzZXRQdWJsaWNJZCh1cGxvYWRlZFB1YmxpY0lkKTtcclxuICAgICAgb25DaGFuZ2U/LihcImltYWdlVXJsXCIsIHVwbG9hZGVkVXJsKTtcclxuICAgICAgb25DaGFuZ2U/LihcImltYWdlUHVibGljSWRcIiwgdXBsb2FkZWRQdWJsaWNJZCk7XHJcbiAgICAgIG9uQ2hhbmdlPy4oXCJ1cGxvYWRJbWFnZVwiLCB1cGxvYWRlZFVybCk7XHJcbiAgICB9IGNhdGNoICh1cGxvYWRFcnJvcikge1xyXG4gICAgICBzZXRFcnJvcih1cGxvYWRFcnJvci5tZXNzYWdlKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNldFVwbG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9IFwiXCI7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlUmVtb3ZlID0gKCkgPT4ge1xyXG4gICAgc2V0UHJldmlld1VybChcIlwiKTtcclxuICAgIHNldFB1YmxpY0lkKFwiXCIpO1xyXG4gICAgb25DaGFuZ2U/LihcImltYWdlVXJsXCIsIFwiXCIpO1xyXG4gICAgb25DaGFuZ2U/LihcImltYWdlUHVibGljSWRcIiwgXCJcIik7XHJcbiAgICBvbkNoYW5nZT8uKFwidXBsb2FkSW1hZ2VcIiwgXCJcIik7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3dyYXBwZXJTdHlsZX0+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGFjY2VwdD1cImltYWdlLypcIiBvbkNoYW5nZT17aGFuZGxlVXBsb2FkfSAvPlxyXG4gICAgICA8ZGl2IHN0eWxlPXtoaW50U3R5bGV9PlxyXG4gICAgICAgIHt1cGxvYWRpbmdcclxuICAgICAgICAgID8gXCJVcGxvYWRpbmcgdG8gQ2xvdWRpbmFyeS4uLlwiXHJcbiAgICAgICAgICA6IFwiQ2hvb3NlIGFuIGltYWdlIGZpbGUgdG8gdXBsb2FkXCJ9XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAge3ByZXZpZXdVcmwgPyAoXHJcbiAgICAgICAgPD5cclxuICAgICAgICAgIDxpbWcgc3JjPXtwcmV2aWV3VXJsfSBhbHQ9XCJQcm9kdWN0IHByZXZpZXdcIiBzdHlsZT17cHJldmlld1N0eWxlfSAvPlxyXG4gICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgb25DbGljaz17aGFuZGxlUmVtb3ZlfVxyXG4gICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgIHdpZHRoOiBcImZpdC1jb250ZW50XCIsXHJcbiAgICAgICAgICAgICAgcGFkZGluZzogXCI2cHggMTBweFwiLFxyXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCI4cHhcIixcclxuICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkICNlZjQ0NDRcIixcclxuICAgICAgICAgICAgICBjb2xvcjogXCIjZWY0NDQ0XCIsXHJcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCIjZmZmXCIsXHJcbiAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgUmVtb3ZlIGltYWdlXHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8Lz5cclxuICAgICAgKSA6IG51bGx9XHJcblxyXG4gICAgICB7ZXJyb3IgPyAoXHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyAuLi5oaW50U3R5bGUsIGNvbG9yOiBcIiNkYzI2MjZcIiB9fT57ZXJyb3J9PC9kaXY+XHJcbiAgICAgICkgOiBudWxsfVxyXG5cclxuICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiaW1hZ2VVcmxcIiB2YWx1ZT17cHJldmlld1VybH0gcmVhZE9ubHkgLz5cclxuICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiaW1hZ2VQdWJsaWNJZFwiIHZhbHVlPXtwdWJsaWNJZH0gcmVhZE9ubHkgLz5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9kdWN0SW1hZ2VVcGxvYWQ7XHJcbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IERhc2hib2FyZCBmcm9tICcuLi9hZG1pbi9kYXNoYm9hcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRhc2hib2FyZCA9IERhc2hib2FyZFxuaW1wb3J0IFByb2R1Y3RJbWFnZSBmcm9tICcuLi9hZG1pbi9wcm9kdWN0LWltYWdlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9kdWN0SW1hZ2UgPSBQcm9kdWN0SW1hZ2VcbmltcG9ydCBQcm9kdWN0SW1hZ2VVcGxvYWQgZnJvbSAnLi4vYWRtaW4vcHJvZHVjdC1pbWFnZS11cGxvYWQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb2R1Y3RJbWFnZVVwbG9hZCA9IFByb2R1Y3RJbWFnZVVwbG9hZCJdLCJuYW1lcyI6WyJjYXJkU3R5bGUiLCJiYWNrZ3JvdW5kIiwiYm9yZGVyIiwiYm9yZGVyUmFkaXVzIiwicGFkZGluZyIsImNvbG9yIiwiYm94U2hhZG93IiwiZm9ybWF0Q3VycmVuY3kiLCJ2YWx1ZSIsIk51bWJlciIsInRvTG9jYWxlU3RyaW5nIiwiRGFzaGJvYXJkIiwiZGF0YSIsInNldERhdGEiLCJ1c2VTdGF0ZSIsInVzZXJzIiwiY2F0ZWdvcmllcyIsInByb2R1Y3RzIiwib3JkZXJzIiwicmV2ZW51ZSIsImZlYXR1cmVkR2VtcyIsImNyaXRpY2FsU3RvY2siLCJyZWNlbnRQcm9kdWN0cyIsImNhdGVnb3J5RGlzdHJpYnV0aW9uIiwidXNlRWZmZWN0IiwibG9hZERhc2hib2FyZCIsInJlc3BvbnNlIiwiZmV0Y2giLCJwYXlsb2FkIiwianNvbiIsInRvcENhdGVnb3JpZXMiLCJ1c2VNZW1vIiwiZGlzdHJpYnV0aW9uIiwibWF4IiwiTWF0aCIsIm1hcCIsIml0ZW0iLCJjb3VudCIsIndpZHRoIiwicm91bmQiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsIm1pbkhlaWdodCIsImZvbnRGYW1pbHkiLCJsZXR0ZXJTcGFjaW5nIiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwibWFyZ2luQm90dG9tIiwibWFyZ2luVG9wIiwiZGlzcGxheSIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJnYXAiLCJsZW5ndGgiLCJjYXRlZ29yeSIsImtleSIsIm5hbWUiLCJqdXN0aWZ5Q29udGVudCIsImhlaWdodCIsInByb2R1Y3QiLCJpZCIsImFsaWduSXRlbXMiLCJwYWRkaW5nQm90dG9tIiwiYm9yZGVyQm90dG9tIiwiRGF0ZSIsImNyZWF0ZWRBdCIsInRvTG9jYWxlRGF0ZVN0cmluZyIsInByaWNlIiwiY2VsbFN0eWxlIiwiaW1hZ2VTdHlsZSIsIm9iamVjdEZpdCIsImZsZXhTaHJpbmsiLCJmYWxsYmFja1N0eWxlIiwidGV4dFN0eWxlIiwiZmxleERpcmVjdGlvbiIsIlByb2R1Y3RJbWFnZSIsInByb3BzIiwiaW1hZ2VVcmwiLCJyZWNvcmQiLCJwYXJhbXMiLCJwcm9wZXJ0eSIsInBhdGgiLCJoYXNFcnJvciIsInNldEhhc0Vycm9yIiwiaHJlZiIsInRhcmdldCIsInJlbCIsInRleHREZWNvcmF0aW9uIiwic3JjIiwiYWx0Iiwib25FcnJvciIsIndyYXBwZXJTdHlsZSIsInByZXZpZXdTdHlsZSIsImhpbnRTdHlsZSIsIlByb2R1Y3RJbWFnZVVwbG9hZCIsIm9uQ2hhbmdlIiwiY3VycmVudFZhbHVlIiwiY3VycmVudFB1YmxpY0lkIiwiaW1hZ2VQdWJsaWNJZCIsInByZXZpZXdVcmwiLCJzZXRQcmV2aWV3VXJsIiwicHVibGljSWQiLCJzZXRQdWJsaWNJZCIsInVwbG9hZGluZyIsInNldFVwbG9hZGluZyIsImVycm9yIiwic2V0RXJyb3IiLCJoYW5kbGVVcGxvYWQiLCJldmVudCIsImZpbGUiLCJmaWxlcyIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJtZXRob2QiLCJib2R5Iiwib2siLCJFcnJvciIsIm1lc3NhZ2UiLCJ1cGxvYWRlZFVybCIsInVybCIsInVwbG9hZGVkUHVibGljSWQiLCJ1cGxvYWRFcnJvciIsImhhbmRsZVJlbW92ZSIsInR5cGUiLCJhY2NlcHQiLCJGcmFnbWVudCIsIm9uQ2xpY2siLCJjdXJzb3IiLCJyZWFkT25seSIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUVBLE1BQU1BLFNBQVMsR0FBRztFQUNoQkMsRUFBQUEsVUFBVSxFQUFFLG1EQUFtRDtFQUMvREMsRUFBQUEsTUFBTSxFQUFFLG9DQUFvQztFQUM1Q0MsRUFBQUEsWUFBWSxFQUFFLE1BQU07RUFDcEJDLEVBQUFBLE9BQU8sRUFBRSxNQUFNO0VBQ2ZDLEVBQUFBLEtBQUssRUFBRSxTQUFTO0VBQ2hCQyxFQUFBQSxTQUFTLEVBQUU7RUFDYixDQUFDO0VBRUQsTUFBTUMsY0FBYyxHQUFJQyxLQUFLLElBQUs7SUFDaEMsT0FBTyxDQUFBLEdBQUEsRUFBTUMsTUFBTSxDQUFDRCxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUNFLGNBQWMsRUFBRSxDQUFBLENBQUU7RUFDcEQsQ0FBQztFQUVELE1BQU1DLFNBQVMsR0FBR0EsTUFBTTtFQUN0QixFQUFBLE1BQU0sQ0FBQ0MsSUFBSSxFQUFFQyxPQUFPLENBQUMsR0FBR0MsY0FBUSxDQUFDO0VBQy9CQyxJQUFBQSxLQUFLLEVBQUUsQ0FBQztFQUNSQyxJQUFBQSxV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
