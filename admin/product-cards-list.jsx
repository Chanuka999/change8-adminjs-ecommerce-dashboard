import React, { useEffect, useMemo, useState } from "react";

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "16px",
};

const cardStyle = {
  borderRadius: "16px",
  border: "1px solid rgba(148, 163, 184, 0.28)",
  background: "linear-gradient(160deg, #0b1a38 0%, #09162f 100%)",
  color: "#f8fafc",
  overflow: "hidden",
  boxShadow: "0 12px 22px rgba(2, 6, 23, 0.25)",
};

const imageWrapStyle = {
  width: "100%",
  height: "200px",
  background: "#0f172a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

const bodyStyle = {
  padding: "14px",
  display: "grid",
  gap: "8px",
};

const metaStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "8px",
  fontSize: "13px",
  color: "#cbd5e1",
};

const badgeStyle = (isActive) => ({
  width: "fit-content",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.05em",
  padding: "5px 10px",
  borderRadius: "999px",
  color: isActive ? "#14532d" : "#7f1d1d",
  background: isActive ? "#bbf7d0" : "#fecaca",
});

const linkStyle = {
  display: "inline-block",
  marginTop: "4px",
  color: "#93c5fd",
  textDecoration: "none",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
};

const emptyStyle = {
  padding: "18px",
  borderRadius: "12px",
  border: "1px dashed rgba(148, 163, 184, 0.45)",
  color: "#cbd5e1",
};

const formatPrice = (value) => {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount)) {
    return "0.00";
  }

  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getRecordId = (record) => {
  return record?.params?.id || record?.id || record?.param?.id || "";
};

const getShowHref = (record, resourceId) => {
  const recordActions = record?.recordActions || record?.actions || [];
  const showAction = recordActions.find((action) => action?.name === "show");
  const rawHref = showAction?.href || record?.href || "";

  if (rawHref) {
    return rawHref;
  }

  const id = getRecordId(record);
  return id
    ? `/admin/resources/${encodeURIComponent(resourceId)}/records/${encodeURIComponent(id)}/show`
    : "";
};

const ProductCardsList = (props) => {
  const [apiRecords, setApiRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const resourceId =
    props?.resource?.id === "Product"
      ? "Products"
      : props?.resource?.id || "Products";
  const propRecords = props?.records || [];

  useEffect(() => {
    if (propRecords.length) {
      return;
    }

    let isMounted = true;

    const loadRecords = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const response = await fetch(
          `/admin/api/resources/${encodeURIComponent(resourceId)}/actions/list`,
          {
            credentials: "same-origin",
          },
        );

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

  const records = useMemo(() => {
    return propRecords.length ? propRecords : apiRecords;
  }, [propRecords, apiRecords]);

  if (loading) {
    return <div style={emptyStyle}>Loading products...</div>;
  }

  if (loadError) {
    return <div style={emptyStyle}>{loadError}</div>;
  }

  if (!records.length) {
    return <div style={emptyStyle}>No products found.</div>;
  }

  return (
    <div style={gridStyle}>
      {records.map((record) => {
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

        return (
          <article key={id} style={cardStyle}>
            <div style={imageWrapStyle}>
              {imageUrl ? (
                <img src={imageUrl} alt={name} style={imageStyle} />
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                    fontSize: "13px",
                  }}
                >
                  No image
                </div>
              )}
            </div>

            <div style={bodyStyle}>
              <div style={{ fontSize: "18px", fontWeight: 700 }}>{name}</div>
              <div style={metaStyle}>
                <div>Category: {category}</div>
                <div>Stock: {stock}</div>
                <div>Price: Rs. {formatPrice(params?.price)}</div>
              </div>
              <span style={badgeStyle(isActive)}>
                {isActive ? "ACTIVE" : "INACTIVE"}
              </span>
              <a
                href={detailsHref || "#"}
                style={linkStyle}
                onClick={(event) => {
                  event.preventDefault();
                  openDetails();
                }}
                aria-disabled={!detailsHref}
              >
                View details
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ProductCardsList;
