/* ==========================================================================
   Cox AI Content Hub — central configuration
   Edit the values below to brand the hub and wire up the request form.
   No build step required — just change a string and reload.
   ========================================================================== */

window.HUB_CONFIG = {
  // Shown in the header and footer.
  brandName: "Cox AI Hub",
  brandTagline: "Self-serve learning for the marketing team",

  // ---- AI Tool Request form ----
  // Paste the *embed* URL of your Microsoft Form here (Form > Share >
  // "Embed" </> > copy the src="..." value out of the iframe snippet).
  // Leave blank ("") to show a friendly placeholder until it's ready.
  FORM_EMBED_URL: "",

  // Inbox that receives requests via the mailto fallback button
  // (used when the embedded form is unavailable or blocked).
  REQUEST_INBOX: "ai-tools@cox.example.com",

  // Where to send general questions about the hub.
  SUPPORT_CONTACT: "ai-enablement@cox.example.com",
};
