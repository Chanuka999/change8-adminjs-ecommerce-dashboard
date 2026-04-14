(() => {
  const THEME_KEY = "change8-admin-theme";
  const root = document.documentElement;
  const isLoginPath =
    window.location.pathname.includes("/login") ||
    window.location.pathname === "/admin" ||
    window.location.pathname === "/admin/";
  let stickyLoginMode = false;

  const hasLoginForm = () => {
    return Boolean(
      document.querySelector(
        'form[action*="login"], form[action*="/admin"], input[type="password"]',
      ),
    );
  };

  const isAuthScreen = () => {
    const hasSidebar = Boolean(
      document.querySelector('[data-testid="sidebar"]'),
    );
    const hasCurrentUser = Boolean(
      document.querySelector('[data-testid="currentUser"]'),
    );

    return (
      hasLoginForm() ||
      (!hasSidebar &&
        !hasCurrentUser &&
        window.location.pathname.startsWith("/admin"))
    );
  };

  const isLoginPage = () => isLoginPath || stickyLoginMode || isAuthScreen();

  const syncLoginPageClass = () => {
    if (isLoginPage()) {
      stickyLoginMode = true;
      root.classList.add("change8-login-page");
    } else if (!window.location.pathname.startsWith("/admin")) {
      // Allow cleanup only when leaving admin routes.
      stickyLoginMode = false;
      root.classList.remove("change8-login-page");
    }
  };

  syncLoginPageClass();

  const SUN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const MOON_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  const applyTheme = (theme) => {
    root.setAttribute("data-admin-theme", theme);
  };

  const getInitialTheme = () => {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") {
      return saved;
    }

    return "dark";
  };

  const updateButtonIcon = (button, theme) => {
    button.innerHTML = theme === "dark" ? SUN_ICON : MOON_ICON;
    button.title =
      theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
  };

  const applyLoginBackground = () => {
    if (!isLoginPage() || !document.body) {
      return;
    }

    const bgImage =
      'linear-gradient(rgba(8, 18, 37, 0.66), rgba(8, 18, 37, 0.66)), url("' +
      window.location.origin +
      '/public/img1.jpg")';

    root.style.setProperty("background-image", bgImage, "important");
    root.style.setProperty("background-size", "cover", "important");
    root.style.setProperty("background-position", "center", "important");
    root.style.setProperty("background-repeat", "no-repeat", "important");
    root.style.setProperty("background-attachment", "fixed", "important");

    document.body.style.setProperty("background-image", bgImage, "important");
    document.body.style.setProperty("background-size", "cover", "important");
    document.body.style.setProperty(
      "background-position",
      "center",
      "important",
    );
    document.body.style.setProperty(
      "background-repeat",
      "no-repeat",
      "important",
    );
    document.body.style.setProperty(
      "background-attachment",
      "fixed",
      "important",
    );

    const shellNodes = [
      document.getElementById("app"),
      document.querySelector('[data-testid="layout"]'),
      document.querySelector('[data-css="layout"]'),
      document.querySelector(".adminjs_Layout"),
      document.querySelector("main"),
    ].filter(Boolean);

    shellNodes.forEach((node) => {
      node.style.setProperty("background", "transparent", "important");
      node.style.setProperty("background-color", "transparent", "important");
    });
  };

  const ensureLoginBackgroundStyle = () => {
    if (!isLoginPage() || !document.head) {
      return;
    }

    let style = document.getElementById("change8-login-bg-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "change8-login-bg-style";
      document.head.appendChild(style);
    }

    style.textContent = `
      html.change8-login-page,
      html.change8-login-page body {
        background: transparent !important;
        position: relative !important;
      }

      html.change8-login-page body::before {
        content: "" !important;
        position: fixed !important;
        inset: 0 !important;
        z-index: -1 !important;
        pointer-events: none !important;
        background-image:
          linear-gradient(rgba(8, 18, 37, 0.66), rgba(8, 18, 37, 0.66)),
          url("${window.location.origin}/public/img1.jpg") !important;
        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-attachment: fixed !important;
      }

      html.change8-login-page #app,
      html.change8-login-page [data-testid="layout"],
      html.change8-login-page [data-css="layout"],
      html.change8-login-page .adminjs_Layout,
      html.change8-login-page main {
        position: relative !important;
        z-index: 1 !important;
        background: transparent !important;
        background-color: transparent !important;
      }

      html.change8-login-page #app > div,
      html.change8-login-page #app > div > div,
      html.change8-login-page #app > div > div > div,
      html.change8-login-page [data-testid="layout"] > div,
      html.change8-login-page [data-testid="layout"] > div > div,
      html.change8-login-page [data-css="layout"] > div,
      html.change8-login-page [data-css="layout"] > div > div,
      html.change8-login-page [class*="Layout"] > div,
      html.change8-login-page [class*="Layout"] > div > div {
        background: transparent !important;
        background-color: transparent !important;
      }

      html.change8-login-page .adminjs_Box,
      html.change8-login-page [data-css*="login"],
      html.change8-login-page [class*="Login"] {
        position: relative !important;
        z-index: 2 !important;
        background: rgba(10, 22, 44, 0.78) !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
      }

      html.change8-login-page [class*="Layout"] > *,
      html.change8-login-page [data-testid="layout"] > * {
        background: transparent !important;
        background-color: transparent !important;
      }

      html.change8-login-page input,
      html.change8-login-page textarea,
      html.change8-login-page select {
        background: rgba(63, 63, 70, 0.96) !important;
      }
    `;
  };

  const mountRegisterLinkOnLogin = () => {
    const findLoginButton = () => {
      const candidates = Array.from(document.querySelectorAll("button"));
      return candidates.find((btn) => {
        const text = (btn.textContent || "").trim().toLowerCase();
        return text === "login" || text === "sign in";
      });
    };

    const injectRegisterLink = () => {
      const loginBtn =
        findLoginButton() || document.querySelector(".adminjs_Button");
      const loginContainer = loginBtn ? loginBtn.parentElement : null;

      if (!loginContainer) {
        return;
      }

      const existing = document.getElementById("change8-register-link");
      if (existing) {
        return;
      }

      const footer = document.createElement("div");
      footer.id = "change8-register-link";
      footer.style.marginTop = "14px";
      footer.style.textAlign = "center";
      footer.innerHTML =
        '<div style="font-size: 14px; font-family: \"Plus Jakarta Sans\", sans-serif;">' +
        '<span style="color: #64748b;">Need an account?</span>' +
        '<a href="/admin/register" style="color: #6366f1; text-decoration: none; font-weight: 600; margin-left: 6px;">Register here</a>' +
        "</div>";

      loginContainer.after(footer);
    };

    injectRegisterLink();

    if (!window.__change8LoginObserver) {
      const observer = new MutationObserver(() => {
        injectRegisterLink();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      window.__change8LoginObserver = observer;
    }
  };

  const hideLoginWelcomePanel = () => {
    if (!isLoginPage()) {
      return;
    }

    const candidates = Array.from(
      document.querySelectorAll("h1, h2, h3, h4, div, p, span"),
    );

    const welcomeNode = candidates.find((node) => {
      const text = (node.textContent || "").trim().toLowerCase();
      return text === "welcome";
    });

    if (!welcomeNode) {
      return;
    }

    let panel = welcomeNode.closest("section, article, div");
    let depth = 0;

    while (panel && panel !== document.body && depth < 8) {
      const text = (panel.textContent || "").toLowerCase();

      // Never hide a panel that contains the actual login form fields.
      if (
        panel.querySelector('input[type="password"]') ||
        panel.querySelector("form")
      ) {
        return;
      }

      if (
        text.includes("to adminjs") ||
        text.includes("world's leading") ||
        text.includes("auto-generated admin panel")
      ) {
        panel.style.display = "none";
        panel.style.visibility = "hidden";
        panel.style.width = "0";
        panel.style.maxWidth = "0";
        panel.style.padding = "0";
        panel.style.margin = "0";
        return;
      }

      panel = panel.parentElement;
      depth += 1;
    }
  };

  const ensureLoginFormVisible = () => {
    if (!isLoginPage()) {
      return;
    }

    const passwordInput = document.querySelector('input[type="password"]');
    const loginForm =
      passwordInput?.closest("form") || document.querySelector("form");

    if (!passwordInput && !loginForm) {
      return;
    }

    const nodes = [passwordInput, loginForm].filter(Boolean);
    nodes.forEach((startNode) => {
      let node = startNode;
      let depth = 0;

      while (node && node !== document.body && depth < 8) {
        node.style.removeProperty("display");
        node.style.removeProperty("visibility");
        node.style.removeProperty("width");
        node.style.removeProperty("max-width");
        node.style.removeProperty("padding");
        node.style.removeProperty("margin");
        node.style.setProperty("opacity", "1", "important");
        node = node.parentElement;
        depth += 1;
      }
    });
  };

  const mountLoginBackgroundLayer = () => {
    if (!isLoginPage() || !document.body) {
      return;
    }

    let layer = document.getElementById("change8-login-bg-layer");
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "change8-login-bg-layer";
      layer.style.position = "fixed";
      layer.style.inset = "0";
      layer.style.zIndex = "0";
      layer.style.pointerEvents = "none";
      layer.style.backgroundImage =
        'linear-gradient(rgba(8, 18, 37, 0.66), rgba(8, 18, 37, 0.66)), url("' +
        window.location.origin +
        '/public/img1.jpg")';
      layer.style.backgroundSize = "cover";
      layer.style.backgroundPosition = "center";
      layer.style.backgroundRepeat = "no-repeat";
      document.body.prepend(layer);
    }

    const appRoot = document.getElementById("app");
    if (appRoot) {
      appRoot.style.position = "relative";
      appRoot.style.zIndex = "1";
      appRoot.style.background = "transparent";
      appRoot.style.backgroundColor = "transparent";
    }
  };

  const mountToggle = () => {
    syncLoginPageClass();

    if (isLoginPage()) {
      const enforceLoginBackground = () => {
        syncLoginPageClass();
        applyLoginBackground();
        ensureLoginBackgroundStyle();
        mountLoginBackgroundLayer();
        ensureLoginFormVisible();
        mountRegisterLinkOnLogin();
      };

      enforceLoginBackground();

      // Protect against late AdminJS rerenders that can re-apply gray wrappers.
      if (!window.__change8LoginBgInterval) {
        window.__change8LoginBgInterval = window.setInterval(() => {
          if (!isLoginPage()) {
            return;
          }
          enforceLoginBackground();
        }, 700);
      }

      if (!window.__change8LoginBgObserver) {
        const bgObserver = new MutationObserver(() => {
          enforceLoginBackground();
        });

        bgObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });

        window.__change8LoginBgObserver = bgObserver;
      }

      return;
    }

    if (document.getElementById("change8-theme-toggle")) {
      return;
    }

    const button = document.createElement("button");
    button.id = "change8-theme-toggle";
    button.className = "change8-theme-toggle";
    button.type = "button";

    let currentTheme = getInitialTheme();
    applyTheme(currentTheme);
    updateButtonIcon(button, currentTheme);

    button.addEventListener("click", () => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_KEY, currentTheme);
      applyTheme(currentTheme);
      updateButtonIcon(button, currentTheme);
    });

    const relocate = () => {
      const oldWrapper = document.getElementById("change8-toggle-wrapper");
      if (oldWrapper) {
        oldWrapper.remove();
      }

      const topbar =
        document.querySelector('[data-testid="topbar"]') ||
        document.querySelector(".adminjs_TopBar") ||
        document.querySelector('[data-css="topbar"]');

      const currentUser = topbar
        ? topbar.querySelector('[data-testid="currentUser"]') ||
          topbar.querySelector('[data-css*="current-user"]') ||
          topbar.querySelector('[data-css*="currentUser"]')
        : null;

      const host = currentUser?.parentElement || topbar || document.body;

      button.style.cssText =
        [
          "position: static",
          "pointer-events: auto",
          "width: 36px",
          "height: 36px",
          "min-width: 36px",
          "border-radius: 50%",
          "border: 1px solid rgba(244,244,245,0.2)",
          "background: #3f3f46",
          "color: #f4f4f5",
          "display: flex",
          "align-items: center",
          "justify-content: center",
          "cursor: pointer",
          "box-shadow: 0 4px 14px rgba(0,0,0,0.35)",
          "outline: none",
          "flex-shrink: 0",
          "margin-right: 8px",
        ].join(" !important;") + " !important;";

      if (currentUser && currentUser.parentElement === host) {
        if (button.nextElementSibling !== currentUser) {
          host.insertBefore(button, currentUser);
        }
      } else if (!host.contains(button)) {
        host.appendChild(button);
      }
    };

    relocate();

    if (!window.__change8ThemeObserver) {
      const observer = new MutationObserver(() => {
        relocate();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      window.__change8ThemeObserver = observer;
    }
  };

  applyTheme(getInitialTheme());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountToggle);
  } else {
    mountToggle();
  }
})();
