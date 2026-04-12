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
    button.title = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
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
      const topbar = document.querySelector('.adminjs_TopBar') || 
                     document.querySelector('[data-css="topbar"]') || 
                     document.querySelector('[data-testid="topbar"]') || 
                     document.querySelector('header');
                     
      if (topbar) {
        // Find the right section (usually has currentUser or is the last div)
        const rightSection = document.querySelector('[data-testid="currentUser"]') || 
                             topbar.querySelector('div:last-child') || 
                             topbar;
                             
        if (rightSection && !rightSection.contains(button)) {
           // Insert as the first child of the right section to stay next to profile
           rightSection.insertBefore(button, rightSection.firstChild);
        }
      } else if (!document.body.contains(button)) {
        document.body.appendChild(button);
      }
    };

    relocate();
    // Keep trying to relocate as AdminJS might re-render the header
    setInterval(relocate, 2000);
  };

  applyTheme(getInitialTheme());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountToggle);
  } else {
    mountToggle();
  }
})();
