# AutoCheck Docs — Static Site

A static, multi-page documentation site for AutoCheck, in the style of DeepWiki:
left sidebar navigation, right "on this page" rail, and a ⌘K command-palette
search. Light mode only, built with the slate/graphite palette from the brand
assets — no build step, no dependencies.

## Running locally

Any static file server works. From this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`.

You can also just double-click `index.html` to open it directly in a browser
— the only caveat is that some browsers restrict `fetch`-like behavior on
`file://` URLs, but this site doesn't use any, so it works fine either way.

## Structure

```
index.html              Homepage / overview
getting-started.html    Installation + first run
architecture.html       Threading model + diagram
cli-orchestration.html
cli-reference.html
runnerscript.html
controller.html
checkpoint-loop.html
signal-handling.html
configuration.html
config-manager.html
config-schema.html
state-tracking.html
ml-state-tracker.html
hpc-state-tracker.html
provider-layers.html
trace-layer.html
signal-layer.html
checkpoint-managers.html
pytorch-manager.html
keras-manager.html
notifications.html
utilities.html
testing-examples.html
glossary.html

css/
  tokens.css     Design tokens — colors, type scale, spacing, shadows
  base.css       Reset + global typography
  layout.css     Topbar, sidebar, content grid, right rail, responsive rules
  content.css    Prose styles, code blocks, tables, callouts, cards, pager
  search.css     Search trigger + command palette
  home.css       Homepage hero, pillars, quicklinks

js/
  nav-data.js      Single source of truth for the sidebar tree + page order
  search-index.js  Client-side search index + fuzzy-ish matching
  app.js           Sidebar render, palette logic, scroll-spy, mobile nav, copy buttons

assets/
  logo-mark.png  The AutoCheck bookmark mark, used in the topbar and favicon
```

## Editing content

Every page shares the same shell (topbar, sidebar mount point, right rail
mount point) and only differs in the `<article class="content">` body.
To add a new page:

1. Copy the `<body>` structure from an existing page (e.g. `glossary.html`)
2. Add an entry to `NAV_TREE` in `js/nav-data.js` — this drives the sidebar
   link, its active state, and the prev/next pager automatically
3. Add a corresponding entry to `SEARCH_INDEX` in `js/search-index.js` so the
   page is reachable from ⌘K search
4. Set `data-page="your-id"` on `<body>` to match the `id` you used in step 2

## Notes

- This is intentionally light-mode only — no dark mode toggle.
- The right-hand "on this page" rail is generated automatically from `h2`/`h3`
  elements inside `.prose` — just write headings normally.
- Code blocks use a small set of hand-applied syntax-highlight spans
  (`tok-key`, `tok-str`, `tok-num`, `tok-com`, `tok-kw`, `tok-fn`) rather than
  a JS highlighter, to keep the site dependency-free.
