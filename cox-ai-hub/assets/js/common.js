/* ==========================================================================
   Cox AI Content Hub — shared helpers
   Theme, navigation, escaping, data loading, and search utilities.
   Reused on every page. Harvested from my-bookmarks-app/index.html.
   ========================================================================== */

const THEME_KEY = "cox_ai_hub_theme_v1";

/* ---------- Escaping (from bookmarks app) ---------- */
function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ---------- URL helpers (from bookmarks app) ---------- */
function hostOf(url) {
  try { return new URL(url).hostname; }
  catch { return ""; }
}

function faviconFor(url) {
  const host = hostOf(url);
  return host ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64` : "";
}

/* ---------- Theme (from bookmarks app) ---------- */
function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  const toggle = document.getElementById("theme-toggle");
  if (toggle) toggle.textContent = dark ? "☀️" : "🌙";
}

function loadTheme() {
  applyTheme(localStorage.getItem(THEME_KEY) || "dark");
}

function toggleTheme() {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

/* ---------- Shared chrome (header + footer) ---------- */
function renderChrome(activePage) {
  const cfg = window.HUB_CONFIG || {};
  const links = [
    { href: "index.html",    key: "home",     label: "Hub" },
    { href: "tools.html",    key: "tools",    label: "Tool Shop" },
    { href: "guides.html",   key: "guides",   label: "Guides" },
    { href: "glossary.html", key: "glossary", label: "Glossary" },
    { href: "request.html",  key: "request",  label: "Request a Tool" },
  ];

  const header = document.querySelector("header .header-inner");
  if (header) {
    header.innerHTML = `
      <a class="logo" href="index.html" title="${escapeHtml(cfg.brandName || "AI Hub")}">AI</a>
      <div class="brand">
        <div>
          <h1>${escapeHtml(cfg.brandName || "AI Hub")}</h1>
          <p>${escapeHtml(cfg.brandTagline || "")}</p>
        </div>
      </div>
      <nav class="main-nav">
        ${links.map(l => `<a href="${l.href}"${l.key === activePage ? ' class="active"' : ""}>${escapeHtml(l.label)}</a>`).join("")}
      </nav>
      <button type="button" class="theme-toggle" id="theme-toggle" title="Toggle dark mode">☀️</button>
    `;
    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    applyTheme(document.documentElement.getAttribute("data-theme") || "dark");
  }

  const footer = document.querySelector("footer .footer-inner");
  if (footer) {
    const support = cfg.SUPPORT_CONTACT || "";
    footer.innerHTML = `
      <span>${escapeHtml(cfg.brandName || "AI Hub")} · for internal Cox use</span>
      <span>${support ? `Questions? <a href="mailto:${escapeHtml(support)}">${escapeHtml(support)}</a>` : ""}</span>
    `;
  }
}

/* ---------- Data loading ----------
   Loads a JSON file from /data. Requires the site to be *served* over http
   (any internal web host, GitHub Pages, or `python -m http.server`).
   Opening pages directly from file:// will block fetch in most browsers. */
async function fetchData(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
  return res.json();
}

function renderError(container, message) {
  container.innerHTML = `
    <div class="empty">
      <div class="big">⚠️</div>
      <div>${escapeHtml(message)}</div>
      <p style="margin-top:8px;font-size:13px">
        Tip: this hub must be opened from a web address (http://…), not a file path.
        Locally, run <code>python -m http.server</code> in the <code>cox-ai-hub</code> folder.
      </p>
    </div>`;
}

function renderEmpty(container, message) {
  container.innerHTML = `<div class="empty"><div class="big">🔍</div>${escapeHtml(message)}</div>`;
}

/* ---------- Misc ---------- */
function matchesTerm(haystacks, term) {
  if (!term) return true;
  const t = term.trim().toLowerCase();
  return haystacks.some(h => (h || "").toString().toLowerCase().includes(t));
}

/* ---------- Init theme immediately (before paint) ---------- */
loadTheme();
