import React, { useState } from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus({
        type: "success",
        message: "Thank you! Your message has been sent successfully.",
      });
      setFormData({ fullName: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.shell}>
      <style>{`
        .contact-section {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 16px 32px rgba(15, 23, 42, 0.06);
          margin-bottom: 24px;
        }

        .contact-header {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          padding: 40px 28px;
          text-align: left;
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        }

        .contact-header h1 {
          margin: 0;
          font-size: clamp(32px, 3.6vw, 52px);
          line-height: 0.98;
          letter-spacing: -0.04em;
        }

        .contact-header p {
          margin: 8px 0 0;
          color: #475569;
          font-size: 18px;
          line-height: 1.6;
        }

        .contact-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          align-items: stretch;
          min-height: 300px;
        }

        .contact-info {
          padding: 40px 28px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 28px;
        }

        .contact-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .contact-icon {
          width: 48px;
          height: 48px;
          border-radius: 999px;
          background: #dbeafe;
          display: grid;
          place-items: center;
          font-size: 24px;
          flex-shrink: 0;
          color: #0369a1;
        }

        .contact-item-content h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }

        .contact-item-content p {
          margin: 4px 0 0;
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
        }

        .contact-links {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }

        .contact-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: #dbeafe;
          text-decoration: none;
          color: #0369a1;
          font-size: 16px;
          font-weight: 700;
        }

        .contact-map {
          background: #e0e7ff;
          display: grid;
          place-items: center;
          font-size: 14px;
          color: #64748b;
          min-height: 300px;
        }

        .contact-form-section {
          padding: 40px 28px;
        }

        .contact-form-header {
          margin-bottom: 28px;
        }

        .contact-form-header h2 {
          margin: 0;
          font-size: 32px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .contact-form-header p {
          margin: 10px 0 0;
          color: #475569;
          font-size: 16px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 8px;
          font-family: inherit;
          font-size: 14px;
          color: #111827;
          background: #f8fafc;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          background: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 140px;
        }

        .form-submit {
          margin-top: 24px;
          padding: 14px 24px;
          background: #1e3a8a;
          color: #ffffff;
          border: 0;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }

        .form-submit:hover:not(:disabled) {
          background: #1e40af;
          box-shadow: 0 8px 16px rgba(30, 58, 138, 0.3);
        }

        .form-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-status {
          margin-top: 16px;
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
        }

        .form-status.success {
          background: #dcfce7;
          color: #166534;
        }

        .form-status.error {
          background: #fee2e2;
          color: #991b1b;
        }

        .contact-footer {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
          padding: 40px 28px;
          background: #f8fafc;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
        }

        .footer-column h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          text-transform: uppercase;
        }

        .footer-column p {
          margin: 8px 0 0;
          font-size: 13px;
          color: #475569;
          line-height: 1.6;
        }

        .footer-column a {
          display: inline-block;
          margin-top: 6px;
          color: #475569;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s;
        }

        .footer-column a:hover {
          color: #2563eb;
        }

        .footer-socials {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .footer-social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: #e0e7ff;
          color: #2563eb;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
        }

        .footer-copyright {
          padding: 16px 28px;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          font-size: 12px;
          color: #64748b;
          text-align: center;
        }

        @media (max-width: 960px) {
          .contact-hero {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .contact-footer {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 560px) {
          .contact-hero {
            grid-template-columns: 1fr;
          }

          .contact-info {
            padding: 24px;
          }

          .contact-form-section {
            padding: 24px;
          }

          .contact-footer {
            grid-template-columns: 1fr;
          }

          .contact-header {
            padding: 24px;
          }

          .contact-header h1 {
            font-size: 24px;
          }

          .contact-header p {
            font-size: 14px;
          }
        }
      `}</style>

      <div style={styles.container}>
        {/* Header */}
        <div className="contact-section">
          <div className="contact-header">
            <Link
              className="change8-about-back-btn"
              to="/admin"
              aria-label="Back to user dashboard"
            >
              {"<- Back to User Dashboard"}
            </Link>
            <h1>Style Flow</h1>
            <p>We're here to help you flow.</p>
          </div>
        </div>

        {/* Contact Info & Map */}
        <div className="contact-section">
          <div className="contact-hero">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-item-content">
                  <h3>Phone</h3>
                  <p>
                    <a
                      href="tel:+94772849767"
                      style={{ color: "#0369a1", textDecoration: "none" }}
                    >
                      +94 772849767
                    </a>
                  </p>
                  <p>Monday - Friday, 9am - 5pm EST</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div className="contact-item-content">
                  <h3>Email</h3>
                  <p>
                    <a
                      href="mailto:support@change8.com"
                      style={{ color: "#0369a1", textDecoration: "none" }}
                    >
                      chanukaranditha99@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-item-content">
                  <h3>Headquarters Address</h3>
                  <p>
                    <a
                      href="https://maps.google.com/?q=123+Fashion+Ave,+Suite+400,+New+York,+NY+10011"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#0369a1", textDecoration: "none" }}
                    >
                      6 mail post
                      <br />
                      Laxapana
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🌐</div>
                <div className="contact-item-content">
                  <h3>Social Media</h3>
                  <div className="contact-links">
                    <a
                      href="https://twitter.com/change8"
                      className="contact-link"
                      title="Twitter"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      𝕏
                    </a>
                    <a
                      href="https://instagram.com/change8"
                      className="contact-link"
                      title="Instagram"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📷
                    </a>
                    <a
                      href="https://linkedin.com/company/change8"
                      className="contact-link"
                      title="LinkedIn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      💼
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-map">
              <iframe
                title="Change8 HQ Map"
                src="https://www.google.com/maps?q=123+Fashion+Ave,+New+York,+NY+10011&output=embed"
                width="100%"
                height="220"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-section">
          <div className="contact-form-section">
            <div className="contact-form-header">
              <h2>Send Us a Message</h2>
              <p>Drop Us a Line</p>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Your name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  autoFocus
                />
                {submitStatus &&
                  submitStatus.type === "error" &&
                  !formData.fullName && (
                    <span style={{ color: "#991b1b", fontSize: 13 }}>
                      Full name is required.
                    </span>
                  )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g., you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
                {submitStatus &&
                  submitStatus.type === "error" &&
                  (!formData.email ||
                    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) && (
                    <span style={{ color: "#991b1b", fontSize: 13 }}>
                      Valid email is required.
                    </span>
                  )}
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
                {submitStatus &&
                  submitStatus.type === "error" &&
                  !formData.subject && (
                    <span style={{ color: "#991b1b", fontSize: 13 }}>
                      Subject is required.
                    </span>
                  )}
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
                {submitStatus &&
                  submitStatus.type === "error" &&
                  !formData.message && (
                    <span style={{ color: "#991b1b", fontSize: 13 }}>
                      Message is required.
                    </span>
                  )}
              </div>

              <button
                type="submit"
                className="form-submit"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>

              {submitStatus && (
                <div
                  className={`form-status ${submitStatus.type}`}
                  style={{ fontSize: 16, fontWeight: 700 }}
                >
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div className="contact-footer">
            <div className="footer-column">
              <h4>Change8</h4>
              <p>
                Change8 is a fashion-driven destination with curated products
                and streamlined store management.
              </p>
            </div>

            <div className="footer-column">
              <h4>Products</h4>
              <a href="/">Home</a>
              <a href="/#products">Products</a>
              <a href="/#about">About</a>
              <a href="/#contact">Contact</a>
            </div>

            <div className="footer-column">
              <h4>Links</h4>
              <a href="/">Home</a>
              <a href="/#products">Shop</a>
              <a href="/#about">About</a>
              <a href="/#contact">Contact</a>
            </div>

            <div className="footer-column">
              <h4>Social Media</h4>
              <div className="footer-socials">
                <a href="#" className="footer-social-icon" title="Twitter">
                  𝕏
                </a>
                <a href="#" className="footer-social-icon" title="Instagram">
                  📷
                </a>
                <a href="#" className="footer-social-icon" title="LinkedIn">
                  💼
                </a>
                <a href="#" className="footer-social-icon" title="GitHub">
                  🐙
                </a>
              </div>
            </div>
          </div>

          <div className="footer-copyright">
            Copyright © Change8.com | All rights reserved
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  shell: {
    minHeight: "100%",
    padding: "28px 12px",
    background: "#f7f9fc",
    color: "#111827",
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  },
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  footer: {
    marginTop: "24px",
  },
};

export default Contact;
