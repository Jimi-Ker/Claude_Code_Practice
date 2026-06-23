/* ==========================================================================
   AI Glossary Station — searchable, A–Z grouped term list.
   ========================================================================== */

let TERMS = [];
let searchTerm = "";

const list = document.getElementById("glossary-list");
const azBar = document.getElementById("az-bar");
const searchInput = document.getElementById("search");
const countEl = document.getElementById("count");

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function firstLetter(term) {
  const m = (term || "").trim().toUpperCase().match(/[A-Z]/);
  return m ? m[0] : "#";
}

// Build a lookup so "see also" links can jump to the right anchor.
function slug(term) {
  return "term-" + (term || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function render() {
  const visible = TERMS.filter(t =>
    matchesTerm([t.term, t.definition, t.category, (t.seeAlso || []).join(" ")], searchTerm)
  ).sort((a, b) => (a.term || "").localeCompare(b.term || ""));

  countEl.textContent = TERMS.length === 0 ? "" :
    `Showing ${visible.length} of ${TERMS.length} term${TERMS.length === 1 ? "" : "s"}`;

  // Group by first letter.
  const groups = {};
  visible.forEach(t => {
    const letter = firstLetter(t.term);
    (groups[letter] = groups[letter] || []).push(t);
  });
  const presentLetters = Object.keys(groups);

  // A–Z jump bar (letters with no terms are dimmed).
  azBar.innerHTML = ALPHABET.map(L =>
    presentLetters.includes(L)
      ? `<a href="#letter-${L}">${L}</a>`
      : `<a class="disabled">${L}</a>`
  ).join("");

  if (visible.length === 0) {
    renderEmpty(list, "No terms match your search.");
    return;
  }

  list.innerHTML = presentLetters.sort().map(L => `
    <section class="glossary-section" id="letter-${L}">
      <h3 class="glossary-letter">${L}</h3>
      ${groups[L].map(t => `
        <div class="term-card" id="${slug(t.term)}">
          <h4>${escapeHtml(t.term)}</h4>
          <p>${escapeHtml(t.definition)}</p>
          ${t.category ? `<div class="badges"><span class="badge">${escapeHtml(t.category)}</span></div>` : ""}
          ${(t.seeAlso && t.seeAlso.length) ? `<div class="see-also">See also: ${t.seeAlso.map(s =>
            `<a href="#${slug(s)}">${escapeHtml(s)}</a>`).join(", ")}</div>` : ""}
        </div>`).join("")}
    </section>`).join("");
}

searchInput.addEventListener("input", e => {
  searchTerm = e.target.value;
  render();
});

(async function init() {
  renderChrome("glossary");
  try {
    TERMS = await fetchData("data/glossary.json");
    render();
  } catch (err) {
    renderError(list, "Couldn't load the glossary.");
  }
})();
