/* ==========================================================================
   AI Tool Shop — load, filter, and render the tool catalogue.
   ========================================================================== */

let TOOLS = [];
let activeCategory = "All";
let activeStatus = "All";
let searchTerm = "";

const grid = document.getElementById("grid");
const catFilters = document.getElementById("cat-filters");
const statusFilters = document.getElementById("status-filters");
const searchInput = document.getElementById("search");
const countEl = document.getElementById("count");

function statusClass(status) {
  const key = (status || "").toLowerCase();
  if (key === "approved") return "badge-status-approved";
  if (key === "pilot") return "badge-status-pilot";
  if (key === "restricted") return "badge-status-restricted";
  return "";
}

function renderCatFilters() {
  const cats = ["All", ...Array.from(new Set(TOOLS.map(t => t.category).filter(Boolean))).sort((a, b) => a.localeCompare(b))];
  catFilters.innerHTML = cats.map(c =>
    `<button class="chip${c === activeCategory ? " active" : ""}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`
  ).join("");
}

function renderStatusFilters() {
  const statuses = ["All", "Approved", "Pilot", "Restricted"];
  statusFilters.innerHTML = statuses.map(s =>
    `<button class="chip${s === activeStatus ? " active" : ""}" data-status="${escapeHtml(s)}">${escapeHtml(s)}</button>`
  ).join("");
}

function render() {
  const visible = TOOLS.filter(t => {
    const matchesCat = activeCategory === "All" || t.category === activeCategory;
    const matchesStatus = activeStatus === "All" || (t.status || "") === activeStatus;
    const matchesSearch = matchesTerm([t.name, t.category, t.description, t.owner], searchTerm);
    return matchesCat && matchesStatus && matchesSearch;
  });

  countEl.textContent = TOOLS.length === 0 ? "" :
    `Showing ${visible.length} of ${TOOLS.length} tool${TOOLS.length === 1 ? "" : "s"}`;

  if (visible.length === 0) {
    renderEmpty(grid, "No tools match your search or filters.");
    return;
  }

  grid.innerHTML = visible.map(t => {
    const favicon = faviconFor(t.url);
    const meta = [
      t.owner ? `<span><strong>Owner:</strong> ${escapeHtml(t.owner)}</span>` : "",
      t.cost ? `<span><strong>Cost:</strong> ${escapeHtml(t.cost)}</span>` : "",
    ].join("");
    return `
      <div class="card">
        <div class="card-head">
          ${favicon ? `<img src="${escapeHtml(favicon)}" alt="" onerror="this.style.display='none'" />` : ""}
          <div style="min-width:0">
            <a class="card-title" href="${escapeHtml(t.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t.name)}</a>
            <a class="card-url" href="${escapeHtml(t.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(hostOf(t.url) || t.url)}</a>
          </div>
        </div>
        ${t.description ? `<p class="card-notes">${escapeHtml(t.description)}</p>` : ""}
        ${meta ? `<div class="card-meta">${meta}</div>` : ""}
        <div class="badges">
          ${t.status ? `<span class="badge ${statusClass(t.status)}">${escapeHtml(t.status)}</span>` : ""}
          ${t.category ? `<span class="badge">${escapeHtml(t.category)}</span>` : ""}
        </div>
      </div>`;
  }).join("");
}

catFilters.addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  activeCategory = btn.dataset.cat;
  renderCatFilters();
  render();
});

statusFilters.addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  activeStatus = btn.dataset.status;
  renderStatusFilters();
  render();
});

searchInput.addEventListener("input", e => {
  searchTerm = e.target.value;
  render();
});

(async function init() {
  renderChrome("tools");
  try {
    TOOLS = await fetchData("data/tools.json");
    renderCatFilters();
    renderStatusFilters();
    render();
  } catch (err) {
    renderError(grid, "Couldn't load the tool catalogue.");
  }
})();
