/* ==========================================================================
   Hub landing — render the four area cards with live item counts.
   ========================================================================== */

const AREAS = [
  { key: "tools",    href: "tools.html",    icon: "🛍️", title: "AI Tool Shop",
    desc: "Browse the approved and pilot AI tools available to the team.", data: "data/tools.json", noun: "tools" },
  { key: "guides",   href: "guides.html",   icon: "📚", title: "Guides & Tutorials",
    desc: "How-tos, walkthroughs, and videos to build your AI skills.", data: "data/guides.json", noun: "guides" },
  { key: "glossary", href: "glossary.html", icon: "📖", title: "Glossary Station",
    desc: "Plain-English definitions of the AI terms you'll hear.", data: "data/glossary.json", noun: "terms" },
  { key: "request",  href: "request.html",  icon: "📨", title: "Request a Tool",
    desc: "Don't see what you need? Ask us to evaluate a new AI tool.", data: null, noun: "" },
];

const hubGrid = document.getElementById("hub-grid");

function render() {
  hubGrid.innerHTML = AREAS.map(a => `
    <a class="card hub-card" href="${a.href}">
      <div class="card-icon">${a.icon}</div>
      <h3>${escapeHtml(a.title)}</h3>
      <p>${escapeHtml(a.desc)}</p>
      <div class="hub-count" data-key="${a.key}">${a.data ? "&nbsp;" : "Open the form →"}</div>
    </a>`).join("");
}

async function loadCounts() {
  await Promise.all(AREAS.filter(a => a.data).map(async a => {
    try {
      const items = await fetchData(a.data);
      const el = hubGrid.querySelector(`.hub-count[data-key="${a.key}"]`);
      if (el) el.textContent = `${items.length} ${a.noun} →`;
    } catch {
      const el = hubGrid.querySelector(`.hub-count[data-key="${a.key}"]`);
      if (el) el.textContent = "Open →";
    }
  }));
}

(async function init() {
  renderChrome("home");
  render();
  loadCounts();
})();
