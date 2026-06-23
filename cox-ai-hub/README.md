# Cox AI Content Hub

A self-serve learning hub for the Cox marketing team, covering four areas:

| Area | Page | Content file |
|---|---|---|
| 🛍️ **AI Tool Shop** | `tools.html` | `data/tools.json` |
| 📚 **Guides & Tutorials** | `guides.html` | `data/guides.json` |
| 📖 **Glossary Station** | `glossary.html` | `data/glossary.json` |
| 📨 **Request a Tool** | `request.html` | (Microsoft Form — see config) |

It is a **dependency-free static site** — plain HTML, CSS, and JavaScript. There
is no build step and nothing to install. The design system and interaction
patterns were harvested from the original `my-bookmarks-app/index.html`.

---

## Running / hosting it

The pages load content from the `data/*.json` files using `fetch()`, so the site
must be **served over a web address (`http://…`)**, not opened from a `file://`
path (browsers block `fetch` on local files).

**View it locally:**

```bash
cd cox-ai-hub
python -m http.server 8000
# then open http://localhost:8000/
```

**Host it internally (any of these work, no changes needed):**

- An internal web server / intranet directory
- A SharePoint site (upload the folder, link to `index.html`)
- GitHub Pages (Enterprise) — point Pages at this folder

Share access via repo links or the hosted URL.

---

## Editing content (no code required)

All content lives in `data/*.json`. Each file is a **JSON array of objects**.
To add an entry, copy an existing object, change the values, and keep the commas
between objects. To remove one, delete its object. You can edit these right in
the GitHub web UI and commit.

**Rules that keep the file valid:**
- Wrap every value and field name in **double quotes** (`"like this"`).
- Put a **comma** between objects, but **not after the last one**.
- JSON does **not** allow `//` comments — the field guides below live here, not
  in the files.

### `data/tools.json` — AI Tool Shop

| Field | Required | What it does |
|---|---|---|
| `name` | ✅ | Tool name shown on the card |
| `url` | ✅ | Where the card links to |
| `category` | ✅ | Drives the category filter chips (e.g. Writing, Images, Research, Productivity, Video) |
| `status` | ✅ | `Approved`, `Pilot`, or `Restricted` — controls the colored badge |
| `description` | ✅ | One or two sentences |
| `owner` | optional | Internal owner / point of contact |
| `cost` | optional | e.g. `Free`, `Licensed`, `Paid` |

```json
{
  "name": "ChatGPT Enterprise",
  "url": "https://chat.openai.com",
  "category": "Writing",
  "status": "Approved",
  "description": "Drafting, summarizing, and brainstorming.",
  "owner": "Marketing Ops",
  "cost": "Licensed"
}
```

### `data/guides.json` — Guides & Tutorials

| Field | Required | What it does |
|---|---|---|
| `title` | ✅ | Guide title |
| `type` | ✅ | `Article`, `Video`, or `Walkthrough` — drives the format filter |
| `level` | ✅ | `Beginner`, `Intermediate`, or `Advanced` |
| `url` | ✅ | Link to the internal doc or video |
| `summary` | ✅ | Short blurb |
| `tags` | optional | Array of keywords, also searchable |

```json
{
  "title": "Writing better prompts",
  "type": "Article",
  "level": "Beginner",
  "url": "https://intranet.cox.example.com/ai/prompting-basics",
  "summary": "Five patterns for clearer AI prompts.",
  "tags": ["prompting", "basics"]
}
```

### `data/glossary.json` — Glossary Station

| Field | Required | What it does |
|---|---|---|
| `term` | ✅ | The term (drives A–Z sorting and grouping) |
| `definition` | ✅ | Plain-English explanation |
| `category` | optional | Tag shown on the entry |
| `seeAlso` | optional | Array of related terms — rendered as links that jump to those entries |

```json
{
  "term": "LLM",
  "definition": "A large language model that predicts text based on patterns it learned from training data.",
  "category": "Core concept",
  "seeAlso": ["Token", "Prompt"]
}
```

> **Tip:** after editing, paste the file into a JSON validator (or just reload the
> page — a broken file shows an error state) to confirm it's still valid.

---

## Configuring the hub (`config.js`)

Open `config.js` and edit the strings:

| Setting | Purpose |
|---|---|
| `brandName` / `brandTagline` | Header and footer text |
| `FORM_EMBED_URL` | The Microsoft Form **embed** URL for the request page. In the Form, choose **Share → Embed `</>`** and copy the `src="…"` value. Leave blank to show a placeholder. |
| `REQUEST_INBOX` | Inbox used by the "Email your request" fallback button |
| `SUPPORT_CONTACT` | Shown in the footer for general questions |

The request form needs **no custom backend** — submissions flow through Microsoft
Forms / Power Automate into your existing SharePoint list or inbox.

---

## File structure

```
cox-ai-hub/
  index.html         # Hub landing — four area cards with live counts
  tools.html         # AI Tool Shop
  guides.html        # Guides & Tutorials
  glossary.html      # Glossary Station
  request.html       # AI Tool Request (embeds Microsoft Form)
  config.js          # Brand + form configuration
  assets/
    css/styles.css   # Shared design system
    js/common.js     # Theme, nav, escaping, data loading, search helpers
    js/home.js       # Landing page
    js/tools.js      # Tool Shop logic
    js/guides.js     # Guides logic
    js/glossary.js   # Glossary logic
    js/request.js    # Request form / mailto fallback
  data/
    tools.json
    guides.json
    glossary.json
```

---

## Future state: a centralized hub

The structured JSON data layer keeps a future migration cheap:

- **Short term:** host this folder internally and share via repo links.
- **Medium term:** promote to a single internal URL behind Cox SSO — the same
  static files drop onto any host unchanged.
- **Long term:** if a centralized hub is funded, migrate to a static framework
  (Astro / Next.js) with a headless CMS for richer authoring and analytics.
  Because content is already structured JSON, that move is a data import rather
  than a rewrite, and the request form can graduate from Microsoft Forms to an
  internal API by swapping `config.js` and `request.html`.
