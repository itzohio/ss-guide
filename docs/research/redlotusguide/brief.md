# RedLotus Guide — clone brief

Source: `https://itzicehere.gitbook.io/redlotusguide` (GitBook site)
Local entry route: `/` — `src/app/page.tsx` → `src/components/sites/redlotusguide/*`
Cloned: 2026-11-13

## Route map

| Local | Source | Notes |
| --- | --- | --- |
| `/` | `/redlotusguide` | Introduction page with cover, cards, next card |
| `/<page path>` | `/redlotusguide/<page path>` | All 214 other guide pages, e.g. `/screensharing-general-knowledge/third-section-windows-fundamentals` |
| Sidebar / breadcrumb / Previous / Next | — | All resolved to local routes; links to pages that were not cloned (and external links) keep their source URL |

Routes are generated from `https://itzicehere.gitbook.io/redlotusguide/llms.txt` (215 entries) and statically prerendered by `src/app/[...slug]/page.tsx`.

## How the clone is generated

- `scripts/fetch-redlotus-assets.mjs` — cover image, 34 card images, chrome and theme icons (home page).
- `scripts/fetch-redlotus-pages.mjs` — fetches the 215 markdown pages plus each page's HTML for its h1/sidebar icon, converts markdown to a small block model (headings, paragraphs, nested lists, quotes, code, rules, images, inline bold/italic/code/links), rewrites internal links to local routes, and writes `src/content/redlotusguide/pages.json` (≈1.8 MB) and `public/sites/redlotusguide/pages/*` (3 images).
- `scripts/translate-redlotus-pages.mjs` — pre-translates every page title, heading and text run into French, keeps a string cache (`translations.json`), and writes `pages.fr.json` (same block structure, links and code spans untouched).
- `src/components/sites/redlotusguide/pages-data.ts` — typed access to the pages, the 6-section navigation tree, breadcrumbs, prev/next and table-of-contents entries, with the French mirror attached per page.
- `blocks.tsx` — renders the block model; `doc-page.tsx` — breadcrumb, title with page icon, prose, Previous/Next.

## Layout measurements

- Header 64 px, sticky, `rgba(250,252,255,.88)` + blur; logo 18 px/600.
- Sidebar 288 px at x=32, nav column 257 px offset −12 px, "Powered by GitBook" pill 257×56 radius 12.
- Cover (home only) from the sidebar edge to the viewport edge, aspect ≈4.15:1, bottom-left radius 12.
- Content column 751 px at 1440, 591 px at 1280; the TOC column (256 px) is reserved even when a page has no headings, exactly like the source.
- Home cards: 3/2/1 columns by container width (700/430 px), gap 16; card 16:9 cover + 15/15/17 label padding.
- Pager: two 298×72 cards, 12 px gap, radius 12, 1 px `#dbe6f9` border, 12 px "Previous/Next" label.
- Inner pages: breadcrumb 12/19.5, h1 36/45 with 36 px icon, body 16/26, h3 20/28, h4 20/28 with 20 px top padding, links `#346ddb`.

## Type and colour

- Inter via `next/font/google` (`--font-inter`).
- Light: bg `#f8fafe`, text `#1a1d23`, muted `#606f89`, border `#dbe6f9`, primary `#346ddb`.
- Dark: bg `#212325`, text `#fbffff`, muted `#b0c1df`, border `#313a49`, primary `#7ba7f7`, card `#1d1d1d`.

## Behaviour

- Language: an EN / FR switcher sits at the bottom of the sidebar (bottom-left, floating on mobile). The choice is stored as `redlotus-lang`, updates `<html lang>`, the document title, the sidebar, breadcrumbs, page content, TOC, pager labels and footer chrome. English is the default; the source's ChatGPT/AI control has been removed from the title bar.
- Sidebar: six collapsible sections; every item with children has a working chevron; the current page's ancestors are expanded automatically and the active row is scrolled into view and highlighted.
- Theme switcher: light / system / dark, persisted as `redlotus-theme`, applied before paint.
- Mobile (<1024 px): hamburger opens the full navigation drawer, "On this page" opens the TOC drawer, overlay/Escape close them, body scroll locks while open.
- TOC: scroll-spy over the page's h2/h3 headings; hidden when a page has none.

## Known gaps

- Search is visual only (GitBook platform feature with no local backend).
- French copy is machine-translated (Google Translate endpoint, cached in `translations.json`) and reads literal in a few technical passages; ~1% of short fragments stayed in English. Home-page prose is hand-written in both languages.
- French never says « partage d'écran »: the English word `screenshare` (and `screenshares`) is enforced by a terminology rule in the translation script, so regenerating keeps it. « Contrôle de piratage » becomes `hack check` the same way.
- Pages can be rewritten by hand in French: drop a markdown file in `src/content/redlotusguide/fr/` starting with `<!-- route: /page/path -->`, and the translation script parses it with the same markdown parser and overrides the machine output for that route. Done so far: the home page, the three introduction pages, Red Lotus Principles and Windows Fundamentals.
- Markdown edge cases: a handful of list lines keep a literal `*` or lose an inline marker where GitBook's export is malformed; 215 pages render, none empty.
- GitBook renders the two YouTube previews at 300 px wide; here they fill the content column (clickable, opens the video).
- Google's Inter is slightly narrower than GitBook's, so a few long sidebar labels wrap one line differently.
- The `fadedmc` partner banner on the home page is a 38 MB GIF kept at source resolution (no local image encoder available).
- Inner pages omit the "Last updated" line because the source does not expose per-page dates in markdown.
