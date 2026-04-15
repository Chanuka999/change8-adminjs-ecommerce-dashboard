import React from "react";

const wrapperStyle = {
  minHeight: "100%",
  padding: "28px",
  background: "#ffffff",
  color: "#111827",
  display: "grid",
  gap: "18px",
};

const cardStyle = {
  borderRadius: "20px",
  border: "1px solid rgba(17, 24, 39, 0.08)",
  background: "#ffffff",
  boxShadow: "0 18px 34px rgba(15, 23, 42, 0.08)",
  padding: "24px",
};

const titleStyle = {
  margin: 0,
  fontSize: "clamp(28px, 4vw, 44px)",
  lineHeight: 1,
  fontWeight: 800,
};

const textStyle = {
  margin: 0,
  color: "#475569",
  lineHeight: 1.8,
  fontSize: "15px",
};

const About = () => {
  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>About</h1>
        <p style={textStyle}>
          This admin dashboard is used to manage shop products, orders, order
          items, categories, and settings in one place.
        </p>
      </div>

      <div style={cardStyle}>
        <h2 style={{ ...titleStyle, fontSize: "24px", marginBottom: "12px" }}>
          What you can do here
        </h2>
        <p style={textStyle}>
          Browse products, open product details, create orders, and manage the
          store data from the AdminJS interface.
        </p>
      </div>
    </div>
  );
};

export default About;
