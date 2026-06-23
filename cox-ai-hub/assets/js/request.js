/* ==========================================================================
   AI Tool Request — embed the Microsoft Form, with a mailto fallback.
   ========================================================================== */

const formMount = document.getElementById("form-mount");
const fallbackMount = document.getElementById("fallback-mount");

function renderForm() {
  const cfg = window.HUB_CONFIG || {};
  const url = (cfg.FORM_EMBED_URL || "").trim();

  if (url) {
    formMount.innerHTML = `
      <iframe class="form-frame" src="${escapeHtml(url)}"
        title="AI Tool Request form" frameborder="0" allowfullscreen></iframe>`;
  } else {
    formMount.innerHTML = `
      <div class="form-placeholder">
        <div style="font-size:34px;margin-bottom:8px">📨</div>
        <strong>The request form isn't connected yet.</strong>
        <p style="margin:8px 0 0">
          An admin can paste the Microsoft Form embed URL into
          <code>config.js</code> (<code>FORM_EMBED_URL</code>) to display it here.
          In the meantime, use the email button below.
        </p>
      </div>`;
  }

  // Mailto fallback (always shown).
  const inbox = (cfg.REQUEST_INBOX || "").trim();
  if (inbox) {
    const subject = encodeURIComponent("AI Tool Request");
    const body = encodeURIComponent(
      "Tool name:\nWebsite / link:\nWhat would you use it for?:\nHow many people need it?:\nAny cost / licensing info?:\n\nSubmitted via the Cox AI Hub."
    );
    fallbackMount.innerHTML = `
      <p style="margin:0 0 12px;color:var(--muted)">Prefer email, or the form won't load?</p>
      <a class="btn-primary" href="mailto:${escapeHtml(inbox)}?subject=${subject}&body=${body}">
        Email your request
      </a>`;
  }
}

(function init() {
  renderChrome("request");
  renderForm();
})();
