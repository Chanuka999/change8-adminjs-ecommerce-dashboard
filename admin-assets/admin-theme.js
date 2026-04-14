(() => {
  const THEME_KEY = "change8-admin-theme";
  const root = document.documentElement;
  const isLoginPage = window.location.pathname.includes("/login");

  if (isLoginPage) {
    root.classList.add("change8-login-page");
  } else {
    root.classList.remove("change8-login-page");
  }

  const applyLoginBackground = () => {
    if (!isLoginPage || !document.body) {
      return;
    }

    document.body.style.backgroundImage =
      'linear-gradient(rgba(8, 18, 37, 0.66), rgba(8, 18, 37, 0.66)), url("/public/img1.jpg")';
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
  };

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
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  };

  const updateButtonIcon = (button, theme) => {
    button.innerHTML = theme === "dark" ? SUN_ICON : MOON_ICON;
    button.title =
      theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
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
    if (!isLoginPage) {
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

  const mountLoginBackgroundLayer = () => {
    if (!isLoginPage || !document.body) {
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
        'linear-gradient(rgba(8, 18, 37, 0.66), rgba(8, 18, 37, 0.66)), url("/public/img1.jpg")';
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

    const buttons = Array.from(document.querySelectorAll("button"));
    const loginBtn = buttons.find((btn) => {
      const text = (btn.textContent || "").trim().toLowerCase();
      return text === "login" || text === "sign in";
    });

    if (!loginBtn) {
      return;
    }

    let current = loginBtn.parentElement;
    let depth = 0;
    while (current && current !== document.body && depth < 12) {
      // Keep the immediate form card visible with a glass look.
      if (depth <= 1) {
        current.style.background = "rgba(10, 22, 44, 0.78)";
        current.style.backgroundColor = "rgba(10, 22, 44, 0.78)";
        current.style.backdropFilter = "blur(10px)";
        current.style.webkitBackdropFilter = "blur(10px)";
      } else {
        current.style.background = "transparent";
        current.style.backgroundColor = "transparent";
        current.style.boxShadow = "none";
      }

      current = current.parentElement;
      depth += 1;
    }
  };

  const mountToggle = () => {
    if (document.getElementById("change8-theme-toggle")) {
      return;
    }

    const button = document.createElement("button");
    button.id = "change8-theme-toggle";
    button.className = "change8-theme-toggle";
    button.type = "button";
    button.style.position = "static";
    button.style.marginRight = "12px";
    button.style.flex = "0 0 auto";

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
      // Use a fixed wrapper at bottom-left of screen so it
      // always shows regardless of sidebar CSS overrides.
      let wrapper = document.getElementById("change8-toggle-wrapper");
      if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.id = "change8-toggle-wrapper";
        wrapper.style.cssText = [
          "position: fixed",
          "bottom: 24px",
          "left: 50%",
          "transform: translateX(-50%)",
          // Get the actual sidebar width to center inside it
          "z-index: 9999",
          "display: flex",
          "align-items: center",
          "justify-content: center",
          "pointer-events: none",
        ].join(" !important;") + " !important;";
        document.body.appendChild(wrapper);
      }

      // Position it inside sidebar width
      const sidebar =
        document.querySelector(".adminjs_Sidebar") ||
        document.querySelector("aside") ||
        document.querySelector('[data-testid="sidebar"]');

      if (sidebar) {
        const rect = sidebar.getBoundingClientRect();
        wrapper.style.left = (rect.left + rect.width / 2) + "px";
        wrapper.style.transform = "translateX(-50%)";
      }

      button.style.cssText = [
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
      ].join(" !important;") + " !important;";

      if (!wrapper.contains(button)) {
        wrapper.appendChild(button);
      }
    };

    // Detect login page and place Register link under Login button
    if (isLoginPage) {
      applyLoginBackground();
      mountLoginBackgroundLayer();
      hideLoginWelcomePanel();
      mountRegisterLinkOnLogin();

      if (!window.__change8LoginBgObserver) {
        const bgObserver = new MutationObserver(() => {
          mountLoginBackgroundLayer();
          hideLoginWelcomePanel();
          mountRegisterLinkOnLogin();
        });

        bgObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });

        window.__change8LoginBgObserver = bgObserver;
      }

      return;
    }

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
