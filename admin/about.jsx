import React from "react";

const About = () => {
  return (
    <div className="change8-about-shell">
      <div className="change8-about-top-strip">
        FREE SHIPPING now available in Sri Lanka
      </div>
      <div className="change8-about-shell-inner">
        <div className="change8-about-back-wrap">
          <a
            className="change8-about-back-btn"
            href="/"
            aria-label="Back to user dashboard"
          >
            {"<- Back to User Dashboard"}
          </a>
        </div>

        <section className="change8-about-section">
          <div className="change8-about-row">
            <div>
              <h1 className="change8-about-title">About Us</h1>
              <h2 className="change8-about-sub">Who We Are</h2>
              <p className="change8-about-text">
                styleFlow is a fashion-driven destination for curated modern
                style. We combine thoughtful product choices with a reliable
                platform, helping customers discover quality outfits and helping
                teams manage products and orders with confidence.
              </p>
              <p className="change8-about-text">
                Our focus is simple: quality, speed, and an easy experience from
                browsing to checkout.
              </p>
            </div>
            <div className="change8-about-img-card">
              <img src="/public/img5.png" alt="Fashion collection" />
            </div>
          </div>

          <div className="change8-about-row">
            <div className="change8-about-img-card">
              <img src="/public/img4.png" alt="Mission and platform" />
            </div>
            <div>
              <h2 className="change8-about-sub">Our Mission</h2>
              <h1 className="change8-about-title">
                Streamlined management for modern fashion retail
              </h1>
              <p className="change8-about-text">
                Our mission is to build a fast, dependable eCommerce workflow
                that supports growing fashion teams. The platform is designed
                with AdminJS, Node.js, Express, Sequelize, and PostgreSQL to
                manage products, inventory, and orders in one place.
              </p>
            </div>
          </div>
        </section>

        <section className="change8-about-section change8-about-values">
          <h2>Our Values</h2>
          <div className="change8-about-value-grid">
            <article className="change8-about-value">
              <div className="change8-about-icon quality">&#127919;</div>
              <h3>Quality &amp; Style</h3>
              <p>
                Every product and workflow decision is optimized for clarity,
                consistency, and real-world performance.
              </p>
            </article>

            <article className="change8-about-value">
              <div className="change8-about-icon innovation">&#128161;</div>
              <h3>Innovation</h3>
              <p>
                We use practical technology and thoughtful UI patterns to make
                operations smoother every day.
              </p>
            </article>

            <article className="change8-about-value">
              <div className="change8-about-icon seamless">&#127807;</div>
              <h3>Seamless Experience</h3>
              <p>
                We reduce friction from browsing to fulfillment so customers and
                teams can move faster.
              </p>
            </article>
          </div>
        </section>

        <section className="change8-about-section change8-about-team">
          <h2>Our Team</h2>
          <div className="change8-about-team-grid">
            <article className="change8-about-member">
              <img src="/public/img6.png" alt="Team member one" />
              <div className="meta">
                <h3>Alex Perera</h3>
                <p>Operations Lead</p>
              </div>
            </article>

            <article className="change8-about-member">
              <img src="/public/img8.png" alt="Team member two" />
              <div className="meta">
                <h3>Nimal Silva</h3>
                <p>Product Manager</p>
              </div>
            </article>

            <article className="change8-about-member">
              <img src="/public/img7.png" alt="Team member three" />
              <div className="meta">
                <h3>Savindi Jayasuriya</h3>
                <p>Creative Director</p>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
