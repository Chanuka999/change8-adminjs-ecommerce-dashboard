import React, { useEffect, useMemo, useState } from "react";

const wrapperStyle = {
  display: "grid",
  gap: "10px",
};

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 140px auto",
  gap: "8px",
  alignItems: "center",
};

const inputStyle = {
  border: "1px solid rgba(148, 163, 184, 0.45)",
  borderRadius: "10px",
  padding: "8px 10px",
  fontSize: "13px",
  background: "#fff",
};

const hintStyle = {
  fontSize: "12px",
  color: "#64748b",
};

const addButtonStyle = {
  width: "fit-content",
  padding: "7px 12px",
  borderRadius: "9px",
  border: "1px solid #6366f1",
  color: "#3730a3",
  background: "#eef2ff",
  cursor: "pointer",
  fontWeight: 700,
};

const removeButtonStyle = {
  padding: "7px 9px",
  borderRadius: "9px",
  border: "1px solid #fca5a5",
  color: "#991b1b",
  background: "#fee2e2",
  cursor: "pointer",
  fontWeight: 700,
};

const parseInitialValue = (value) => {
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
    size: String(size || "")
      .trim()
      .toUpperCase(),
    stock: String(Number(qty || 0)),
  }));
};

const ProductSizeStockInput = (props) => {
  const { record, onChange } = props;
  const initialRows = useMemo(
    () => parseInitialValue(record?.params?.sizeStock),
    [record?.params?.sizeStock],
  );

  const [rows, setRows] = useState(
    initialRows.length ? initialRows : [{ size: "", stock: "" }],
  );

  useEffect(() => {
    setRows(initialRows.length ? initialRows : [{ size: "", stock: "" }]);
  }, [initialRows]);

  useEffect(() => {
    const sizeStock = {};

    rows.forEach((row) => {
      const size = String(row.size || "")
        .trim()
        .toUpperCase();
      if (!size) {
        return;
      }

      const stock = Math.max(0, Math.trunc(Number(row.stock || 0)));
      sizeStock[size] = stock;
    });

    const totalStock = Object.values(sizeStock).reduce(
      (sum, qty) => sum + Number(qty || 0),
      0,
    );

    onChange?.("sizeStockText", JSON.stringify(sizeStock));
    onChange?.("stock", totalStock);
  }, [rows, onChange]);

  const updateRow = (index, key, value) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [key]: value,
      };
      return next;
    });
  };

  const addRow = () => {
    setRows((prev) => [...prev, { size: "", stock: "" }]);
  };

  const removeRow = (index) => {
    setRows((prev) => {
      if (prev.length <= 1) {
        return [{ size: "", stock: "" }];
      }

      return prev.filter((_, rowIndex) => rowIndex !== index);
    });
  };

  return (
    <div style={wrapperStyle}>
      <div style={hintStyle}>
        Add product sizes and stock per size. Total stock is auto-calculated.
      </div>

      {rows.map((row, index) => (
        <div key={`${index}-${row.size}`} style={rowStyle}>
          <input
            type="text"
            placeholder="Size (e.g. S, M, L, XL)"
            value={row.size}
            onChange={(event) => updateRow(index, "size", event.target.value)}
            style={inputStyle}
          />

          <input
            type="number"
            min="0"
            step="1"
            placeholder="Stock"
            value={row.stock}
            onChange={(event) => updateRow(index, "stock", event.target.value)}
            style={inputStyle}
          />

          <button
            type="button"
            onClick={() => removeRow(index)}
            style={removeButtonStyle}
            aria-label="Remove size"
          >
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={addRow} style={addButtonStyle}>
        + Add Size
      </button>

      <input
        type="hidden"
        name="sizeStock"
        value={JSON.stringify(
          rows.reduce((acc, row) => {
            const size = String(row.size || "")
              .trim()
              .toUpperCase();
            if (!size) {
              return acc;
            }

            acc[size] = Math.max(0, Math.trunc(Number(row.stock || 0)));
            return acc;
          }, {}),
        )}
        readOnly
      />
    </div>
  );
};

export default ProductSizeStockInput;
