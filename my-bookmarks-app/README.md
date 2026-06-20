# Bookmark Test — Personal Bookmark Dashboard

A single-file, dependency-free bookmark dashboard. Open `index.html` in any browser — no build step, no server, nothing to install.

## Features
- **Add bookmarks** with title, URL, category, and optional notes
- **Card grid** with favicons, clickable links, and category badges
- **Live search** by title or category
- **Category filter** buttons (auto-generated, combine with search)
- **Edit in place** — load any bookmark back into the form and save
- **Delete** with confirmation
- **Dark mode** toggle (preference remembered)
- **Duplicate guard** when adding a URL that already exists, plus a "showing X of Y" count
- **Persistent** — everything is saved to the browser's `localStorage`
- **Mobile responsive** — collapses to a single column on small screens

## Usage
Double-click `index.html`, or set it as your browser's startup page via:
`file:///C:/Users/Jker6/Claude_Code_Practice/my-bookmarks-app/index.html`

## Notes
- Data is stored per-browser in `localStorage` (key `bookmarks_v2`); it does not sync across devices.
- Favicons load from Google's favicon service, so they only appear when online. Everything else works fully offline.
