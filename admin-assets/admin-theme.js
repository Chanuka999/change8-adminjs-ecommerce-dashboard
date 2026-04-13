(() => {
  const THEME_KEY = "change8-admin-theme";
  const root = document.documentElement;

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

  const mountToggle = () => {
    if (document.getElementById("change8-theme-toggle")) {
      return;
    }

    const button = document.createElement("button");
    button.id = "change8-theme-toggle";
    button.className = "change8-theme-toggle";

    let currentTheme = getInitialTheme();
    applyTheme(currentTheme);
    updateButtonIcon(button, currentTheme);

    button.addEventListener("click", () => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_KEY, currentTheme);
      applyTheme(currentTheme);
      updateButtonIcon(button, currentTheme);
    });

    // Try to append to header/topbar, otherwise fallback to body
    const relocate = () => {
      const topbar =
        document.querySelector(".adminjs_TopBar") ||
        document.querySelector('[data-css="topbar"]') ||
        document.querySelector('[data-testid="topbar"]') ||
        document.querySelector("header");

      if (topbar) {
        // Find the right section (usually has currentUser or is the last div)
        const rightSection =
          document.querySelector('[data-testid="currentUser"]') ||
          topbar.querySelector("div:last-child") ||
          topbar;

        if (rightSection && !rightSection.contains(button)) {
          // Insert as the first child of the right section to stay next to profile
          rightSection.insertBefore(button, rightSection.firstChild);
        }
      } else if (!document.body.contains(button)) {
        document.body.appendChild(button);
      }
    };

    // Detect login page and apply logic
    if (window.location.pathname.includes("/login")) {
      const injectLoginInputStyles = () => {
        if (document.getElementById("change8-login-input-styles")) {
          return;
        }

        const style = document.createElement("style");
        style.id = "change8-login-input-styles";
        style.textContent = `
          #app input[type="email"],
          #app input[type="text"],
          #app input[type="password"] {
            color: #f8fafc !important;
            -webkit-text-fill-color: #f8fafc !important;
            caret-color: #f8fafc !important;
          }

          #app input[type="email"]::placeholder,
          #app input[type="text"]::placeholder,
          #app input[type="password"]::placeholder {
            color: rgba(248, 250, 252, 0.55) !important;
            -webkit-text-fill-color: rgba(248, 250, 252, 0.55) !important;
          }

          #app input[type="email"]:-webkit-autofill,
          #app input[type="text"]:-webkit-autofill,
          #app input[type="password"]:-webkit-autofill,
          #app input[type="email"]:-webkit-autofill:hover,
          #app input[type="text"]:-webkit-autofill:hover,
          #app input[type="password"]:-webkit-autofill:hover,
          #app input[type="email"]:-webkit-autofill:focus,
          #app input[type="text"]:-webkit-autofill:focus,
          #app input[type="password"]:-webkit-autofill:focus {
            -webkit-text-fill-color: #f8fafc !important;
            caret-color: #f8fafc !important;
            -webkit-box-shadow: 0 0 0 1000px #14274b inset !important;
            box-shadow: 0 0 0 1000px #14274b inset !important;
            transition: background-color 5000s ease-in-out 0s;
          }
        `;
        document.head.appendChild(style);
      };

      const ensureLoginImageBackground = () => {
        const appRoot =
          document.getElementById("app") || document.querySelector("#root");

        if (!appRoot) {
          return;
        }

        appRoot.style.position = "relative";
        appRoot.style.minHeight = "100vh";
        appRoot.style.background = "transparent";

        const oldVideoBg = document.getElementById("change8-login-video-bg");
        if (oldVideoBg) {
          oldVideoBg.remove();
        }

        if (!document.getElementById("change8-login-image-bg")) {
          const wrapper = document.createElement("div");
          wrapper.id = "change8-login-image-bg";
          wrapper.style.position = "absolute";
          wrapper.style.inset = "0";
          wrapper.style.zIndex = "1";
          wrapper.style.overflow = "hidden";
          wrapper.style.pointerEvents = "none";
          wrapper.style.backgroundImage = "url('/public/img1.jpg')";
          wrapper.style.backgroundSize = "cover";
          wrapper.style.backgroundPosition = "center";
          wrapper.style.backgroundRepeat = "no-repeat";

          const overlay = document.createElement("div");
          overlay.style.position = "absolute";
          overlay.style.inset = "0";
          overlay.style.background =
            "linear-gradient(135deg, rgba(2, 6, 23, 0.28) 0%, rgba(15, 23, 42, 0.36) 55%, rgba(30, 41, 59, 0.26) 100%)";

          wrapper.appendChild(overlay);
          appRoot.prepend(wrapper);
        }
      };

      const styleLoginPage = () => {
        document.body.style.background =
          "radial-gradient(circle at 10% 10%, rgba(56, 189, 248, 0.14), transparent 45%), radial-gradient(circle at 90% 90%, rgba(99, 102, 241, 0.18), transparent 40%), linear-gradient(135deg, #0b1220 0%, #101a33 50%, #071026 100%)";
        document.body.style.minHeight = "100vh";
        document.body.style.position = "relative";

        const transparentLayers = document.querySelectorAll(
          "#app, .adminjs_Layout, [data-testid='layout'], [data-css='layout'], .adminjs_Box",
        );
        transparentLayers.forEach((layer) => {
          layer.style.background = "transparent";
          layer.style.backgroundColor = "transparent";
          layer.style.position = layer.style.position || "relative";
          if (!layer.style.zIndex) {
            layer.style.zIndex = "2";
          }
        });

        const loginBtn =
          document.querySelector('button[type="submit"]') ||
          document.querySelector("button") ||
          document.querySelector(".adminjs_Button");

        if (!loginBtn) {
          return;
        }

        const loginContainer = loginBtn.parentElement;
        const formPanel = loginContainer ? loginContainer.parentElement : null;
        const card = formPanel ? formPanel.parentElement : null;
        const heroPanel = formPanel ? formPanel.previousElementSibling : null;

        if (card) {
          card.style.position = "relative";
          card.style.zIndex = "2";
        }

        if (card) {
          card.style.maxWidth = "560px";
          card.style.width = "min(92vw, 560px)";
          card.style.borderRadius = "22px";
          card.style.overflow = "hidden";
          card.style.border = "1px solid rgba(148, 163, 184, 0.24)";
          card.style.boxShadow = "0 30px 70px rgba(2, 6, 23, 0.5)";
          card.style.background = "rgba(15, 23, 42, 0.72)";
          card.style.backdropFilter = "blur(14px)";
          card.style.WebkitBackdropFilter = "blur(14px)";
        }

        if (heroPanel) {
          heroPanel.style.display = "none";
          heroPanel.style.width = "0";
          heroPanel.style.minWidth = "0";
          heroPanel.style.flex = "0 0 0";
        }

        if (formPanel) {
          formPanel.style.background = "rgba(8, 15, 32, 0.92)";
          formPanel.style.color = "#e2e8f0";
          formPanel.style.width = "100%";
          formPanel.style.flex = "1 1 auto";
        }

        const inputs = document.querySelectorAll(
          'input[type="email"], input[type="text"], input[type="password"]',
        );

        inputs.forEach((input) => {
          input.style.background = "#14274b";
          input.style.border = "1px solid rgba(148, 163, 184, 0.3)";
          input.style.borderRadius = "12px";
          input.style.color = "#f8fafc";
          input.style.webkitTextFillColor = "#f8fafc";
          input.style.caretColor = "#f8fafc";
          input.style.padding = "13px 16px";
          input.style.fontSize = "15px";
          input.style.boxShadow = "none";
        });

        loginBtn.style.background =
          "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)";
        loginBtn.style.color = "#ffffff";
        loginBtn.style.border = "none";
        loginBtn.style.borderRadius = "12px";
        loginBtn.style.padding = "12px 28px";
        loginBtn.style.fontWeight = "700";
        loginBtn.style.boxShadow = "0 10px 25px rgba(59, 130, 246, 0.35)";

        const labels = document.querySelectorAll("label");
        labels.forEach((label) => {
          label.style.color = "#cbd5e1";
          label.style.fontWeight = "600";
        });
      };

      const injectRegisterLink = () => {
        const loginBtn =
          document.querySelector('button[type="submit"]') ||
          document.querySelector("button") ||
          document.querySelector(".adminjs_Button");
        const loginContainer = loginBtn ? loginBtn.parentElement : null;

        if (
          loginContainer &&
          !document.getElementById("change8-register-link")
        ) {
          const footer = document.createElement("div");
          footer.id = "change8-register-link";
          footer.style.marginTop = "20px";
          footer.style.textAlign = "center";
          footer.innerHTML = `
            <div style="font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif;">
              <span style="color: #64748b;">Need an account?</span>
              <a href="/admin/register" style="color: #6366f1; text-decoration: none; font-weight: 600; margin-left: 5px;">Register here</a>
            </div>
          `;
          loginContainer.after(footer);
        }
      };

      const applyLoginEnhancements = () => {
        injectLoginInputStyles();
        ensureLoginImageBackground();
        styleLoginPage();
        injectRegisterLink();
      };

      applyLoginEnhancements();

      if (!window.__change8LoginObserver) {
        const observer = new MutationObserver(() => {
          applyLoginEnhancements();
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        window.__change8LoginObserver = observer;
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
