/* ==========================================================================
   AI Guides & Tutorials — load, filter, and render learning resources.
   ========================================================================== */

let GUIDES = [];
let activeType = "All";
let activeLevel = "All";
let searchTerm = "";

const grid = document.getElementById("grid");
const typeFilters = document.getElementById("type-filters");
const levelFilters = document.getElementById("level-filters");
const searchInput = document.getElementById("search");
const countEl = document.getElementById("count");

const TYPE_ICON = { Article: "📄", Video: "🎬", Walkthrough: "🧭" };

function renderTypeFilters() {
  const types = ["All", ...Array.from(new Set(GUIDES.map(g => g.type).filter(Boolean))).sort((a, b) => a.localeCompare(b))];
  typeFilters.innerHTML = types.map(t =>
    `<button class="chip${t === activeType ? " active" : ""}" data-type="${escapeHtml(t)}">${escapeHtml(t)}</button>`
  ).join("");
}

function renderLevelFilters() {
  const order = { Beginner: 0, Intermediate: 1, Advanced: 2 };
  const levels = ["All", ...Array.from(new Set(GUIDES.map(g => g.level).filter(Boolean)))
    .sort((a, b) => (order[a] ?? 9) - (order[b] ?? 9))];
  levelFilters.innerHTML = levels.map(l =>
    `<button class="chip${l === activeLevel ? " active" : ""}" data-level="${escapeHtml(l)}">${escapeHtml(l)}</button>`
  ).join("");
}

function render() {
  const visible = GUIDES.filter(g => {
    const matchesType = activeType === "All" || g.type === activeType;
    const matchesLevel = activeLevel === "All" || g.level === activeLevel;
    const matchesSearch = matchesTerm([g.title, g.summary, g.type, g.level, (g.tags || []).join(" ")], searchTerm);
    return matchesType && matchesLevel && matchesSearch;
  });

  countEl.textContent = GUIDES.length === 0 ? "" :
    `Showing ${visible.length} of ${GUIDES.length} guide${GUIDES.length === 1 ? "" : "s"}`;

  if (visible.length === 0) {
    renderEmpty(grid, "No guides match your search or filters.");
    return;
  }

  grid.innerHTML = visible.map(g => {
    const tags = (g.tags || []).map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("");
    return `
      <div class="card">
        <div class="card-head">
          <div class="card-icon">${escapeHtml(TYPE_ICON[g.type] || "📘")}</div>
          <div style="min-width:0">
            <a class="card-title" href="${escapeHtml(g.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(g.title)}</a>
            <span class="card-url">${escapeHtml(g.type || "")}${g.level ? " · " + escapeHtml(g.level) : ""}</span>
          </div>
        </div>
        ${g.summary ? `<p class="card-notes">${escapeHtml(g.summary)}</p>` : ""}
        ${tags ? `<div class="badges">${tags}</div>` : ""}
      </div>`;
  }).join("");
}

typeFilters.addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  activeType = btn.dataset.type;
  renderTypeFilters();
  render();
});

levelFilters.addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  activeLevel = btn.dataset.level;
  renderLevelFilters();
  render();
});

searchInput.addEventListener("input", e => {
  searchTerm = e.target.value;
  render();
});

(async function init() {
  renderChrome("guides");
  try {
    GUIDES = await fetchData("data/guides.json");
    renderTypeFilters();
    renderLevelFilters();
    render();
  } catch (err) {
    renderError(grid, "Couldn't load the guides.");
  }
})();
