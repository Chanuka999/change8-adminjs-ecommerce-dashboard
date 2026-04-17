import express from "express";
import sequelize from "./config/database.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import orderItemRoutes from "./routes/orderItemRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import "./model/index.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let adminRouter = express.Router();

try {
  const adminModule = await import("./admin/admin.js");
  adminRouter = adminModule.default;
} catch (error) {
  console.error(
    "AdminJS router initialization failed:",
    error?.message || error,
  );

  adminRouter.get("*", (_req, res) => {
    return res
      .status(503)
      .send("Admin panel is temporarily unavailable. Check server logs.");
  });
}

app.use(express.json());
app.use("/custom", express.static(path.join(__dirname, "admin-assets")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/admin/frontend/assets/components.bundle.js", (_req, res) => {
  const bundlePath = path.join(__dirname, ".adminjs", "bundle.js");

  try {
    if (fs.existsSync(bundlePath)) {
      const bundleContent = fs.readFileSync(bundlePath, "utf8");
      return res.type("application/javascript").send(bundleContent);
    }
  } catch (error) {
    console.warn("Failed to serve components bundle fallback:", error.message);
  }

  return res
    .type("application/javascript")
    .send("window.AdminJS = window.AdminJS || {}; ");
});

app.use("/admin", (req, res, next) => {
  const rawSessionAdmin = req?.session?.adminUser;
  const sessionAdmin =
    typeof rawSessionAdmin === "string"
      ? (() => {
          try {
            return JSON.parse(rawSessionAdmin);
          } catch (error) {
            return null;
          }
        })()
      : rawSessionAdmin;

  const role = String(sessionAdmin?.role || "").toLowerCase();

  if (role === "admin" || role === "user") {
    res.cookie("change8_admin_role", role, {
      httpOnly: false,
      sameSite: "lax",
      path: "/admin",
    });
  } else {
    res.clearCookie("change8_admin_role", { path: "/admin" });
  }

  next();
});

// AdminJS route
app.get("/admin/register", (req, res) => {
  res.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Register | Shop Management</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <style>
      :root {
        --primary: #6366f1;
        --primary-dark: #4f46e5;
        --secondary: #a855f7;
        --bg-dark: #0f172a;
        --glass-bg: rgba(15, 23, 42, 0.8);
        --glass-border: rgba(255, 255, 255, 0.1);
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Plus Jakarta Sans", sans-serif;
      }

      body {
        background-color: var(--bg-dark);
        background-image: url("/public/img2.jpg");
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        padding: 20px;
      }

      .container {
        width: 100%;
        max-width: 520px;
        display: flex;
        justify-content: center;
        background: var(--glass-bg);
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        border: 1px solid var(--glass-border);
        border-radius: 28px;
        overflow: hidden;
        box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.8);
        animation: fadeIn 0.8s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .form-panel {
        width: 100%;
        padding: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .logo {
        margin-bottom: 30px;
        font-size: 24px;
        font-weight: 800;
        letter-spacing: -0.01em;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .logo span {
        color: var(--primary);
      }

      .form-group {
        margin-bottom: 20px;
      }

      label {
        display: block;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: rgba(255, 255, 255, 0.5);
        margin-bottom: 10px;
      }

      input {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        padding: 14px 18px;
        color: white;
        font-size: 15px;
        transition: all 0.3s ease;
      }

      input:focus {
        outline: none;
        border-color: var(--primary);
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
      }

      .btn {
        width: 100%;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        border: none;
        border-radius: 12px;
        padding: 16px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 10px;
        box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
      }

      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.5);
        filter: brightness(1.1);
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .footer {
        margin-top: 25px;
        text-align: center;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
      }

      .footer a {
        color: var(--primary);
        text-decoration: none;
        font-weight: 600;
      }

      .footer a:hover {
        text-decoration: underline;
      }

      .error-message {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.2);
        color: #f87171;
        padding: 12px;
        border-radius: 10px;
        font-size: 13px;
        margin-bottom: 20px;
        display: none;
      }

      .success-message {
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.2);
        color: #4ade80;
        padding: 12px;
        border-radius: 10px;
        font-size: 13px;
        margin-bottom: 20px;
        display: none;
      }

      @media (max-width: 850px) {
        .container {
          max-width: 100%;
        }

        .form-panel {
          padding: 40px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="form-panel">
        <div class="logo">Register our site</div>
        <div id="error" class="error-message"></div>
        <div id="success" class="success-message"></div>

        <form id="registerForm" autocomplete="off">
          <input
            type="text"
            name="fake_username"
            autocomplete="username"
            style="display: none"
            tabindex="-1"
          />
          <input
            type="password"
            name="fake_password"
            autocomplete="current-password"
            style="display: none"
            tabindex="-1"
          />
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              autocomplete="off"
              required
            />
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@email.com"
              autocomplete="off"
              autocapitalize="none"
              spellcheck="false"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="At least 6 characters"
              autocomplete="new-password"
              minlength="6"
              required
            />
          </div>
          <button type="submit" id="submitBtn" class="btn">
            Create Account
          </button>
        </form>

        <div class="footer">
          Already have an account? <a href="/admin/login">Log in</a>
        </div>
      </div>
    </div>

    <script>
      const form = document.getElementById("registerForm");
      const submitBtn = document.getElementById("submitBtn");
      const errorDiv = document.getElementById("error");
      const successDiv = document.getElementById("success");

      const clearRegisterInputs = () => {
        ["name", "email", "password"].forEach((id) => {
          const el = document.getElementById(id);
          if (el) {
            el.value = "";
          }
        });
      };

      window.addEventListener("pageshow", () => {
        clearRegisterInputs();
        setTimeout(clearRegisterInputs, 80);
      });

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        errorDiv.style.display = "none";
        successDiv.style.display = "none";
        submitBtn.disabled = true;
        submitBtn.textContent = "Creating account...";

        const formData = {
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          password: document.getElementById("password").value,
        };

        try {
          const response = await fetch("/api/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          const data = await response.json();

          if (response.ok) {
            successDiv.textContent =
              "Account created successfully! Redirecting...";
            successDiv.style.display = "block";
            form.reset();

            setTimeout(() => {
              window.location.href = "/admin/login";
            }, 2000);
          } else {
            throw new Error(data.message || "Registration failed");
          }
        } catch (err) {
          errorDiv.textContent = err.message;
          errorDiv.style.display = "block";
          submitBtn.disabled = false;
          submitBtn.textContent = "Create Account";
        }
      });
    </script>
  </body>
</html>`);
});
app.use("/admin", adminRouter);
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/uploads", uploadRoutes);

const isServerlessRuntime =
  process.env.VERCEL === "1" ||
  String(process.env.AWS_REGION || "").trim().length > 0;

if (!isServerlessRuntime) {
  sequelize
    .sync({ alter: { drop: false } })
    .then(() => {
      app.listen(5000, () => {
        console.log("Server running on http://localhost:5000");
        console.log("AdminJS: http://localhost:5000/admin");
      });
    })
    .catch((error) => {
      console.error("Database sync failed:", error);
      process.exit(1);
    });
}

export default app;
