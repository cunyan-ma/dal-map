# DAL Map — UI & Interaction Specification

An interactive dark-themed world map that visualizes the **data-annotation labor (DAL) supply chain**: worker delivery centers → the platforms that employ them → the customers those platforms serve. Built as a single-page React app on top of Leaflet.

This README is written as a **replication spec**. It documents the exact visual system, layout, interaction model, and effects so the same UI can be reproduced in another project. Where a value matters (color, size, opacity, breakpoint), it is given literally.

---

## 1. Concept & node model

Three node types form a chain: **Customer → Platform → Worker**.

| Node | Meaning | Color | Shape | Source data |
|------|---------|-------|-------|-------------|
| **Red** | Worker delivery center (a city where annotation labor happens) | `#e5312e` | **Circle** | `worker-location.csv` |
| **Orange** | Platform HQ (the BPO company) | `#FF9500` | **Square** | `dal-platforms.csv` |
| **White** | Customer (the company buying annotation) | `#ffffff` | **Triangle** | `platform-customer.csv` |

Two relationship edges:
- **Red solid line**: Worker ↔ Platform ("affiliation") — worker centers belong to a platform.
- **White dotted line**: Platform ↔ Customer ("customer contract").

The three shapes exist so the node types remain distinguishable for color-blind viewers (never rely on color alone). Same reason the two edge types differ by **line style** (solid vs. dotted), not only color.

---

## 2. Tech stack

- **React 19** + **Vite** (SPA, `type: module`).
- **Leaflet 1.9** for the map (raw Leaflet imperative API inside a React component ref — NOT react-leaflet components, even though react-leaflet is a dependency).
- **react-router-dom 7** with `HashRouter` (works on GitHub Pages).
- **papaparse** for loading CSV data at runtime via `download: true`.
- Deployed with `gh-pages` to a subpath (asset/base paths include `/dal-map/`).

Scripts: `npm run dev`, `npm run build`, `npm run deploy`, `npm run lint`.

There is **no CSS framework**. All styling is plain per-component CSS files (`Component.jsx` + `Component.css`) plus a global `index.css`.

---

## 3. Design system

### Colors
```
Backgrounds:   #0a0a0a (page / bottom bar / map letterbox)
               #111111 (floating panels)
               #1a1a1a (search box, story box)
               #222222 (list hover)
Text:          #ffffff (headings / active)
               #e0e0e0 (body prose)
               #cccccc (panel text, secondary)
               #888888 / #999999 (muted)
Brand accent:  #f2572d (orange-red, links & active accents)  ← AA-safe on dark
               #e0432a (older accent; ~4.5:1 — avoid on #1a1a1a)
Node red:      #e5312e     Node orange: #FF9500     Node white: #ffffff
```

### Typography
- Global font: `Helvetica, Arial, sans-serif`.
- The giant bottom-bar title uses `Impact, Helvetica`, `font-weight: 900`, `font-size: 50px`, `text-transform: uppercase`, with the middle line ("DATA WORKERS") in accent `#e0432a`.
- Panel titles: 14px / 700. Panel body: 11–13px. Legend: 12px.

### Floating panel style (shared visual language)
All floating UI (legend, view-mode, info panels, filter list) share:
```
background: #111111;
border-radius: 2px  (control panels)  or  8px  (info/filter panels);
box-shadow: 0 8px 20px rgba(0,0,0,0.5);
color: #cccccc;
```

### Z-index layers
```
map tiles / markers ....... Leaflet default panes
view-mode panel ........... 1000
legend .................... 1099
info + filter panels ...... 1200
bottom bar ................ 1200
sticky panel headers ...... 2 (within their panel)
mobile intro overlay ...... above all
```

---

## 4. App layout & routes

`HashRouter` with a persistent `<NavBar/>` and four routes:

| Path | Page |
|------|------|
| `/` | **SupplyChain** (the map — the main experience) |
| `/about` | AboutPage |
| `/methodology` | Methodology |
| `/database` | Database (the raw data as an accessible table) |

**NavBar**: fixed top links `Map · About · Methodology · Database`. When on About or Methodology, the active item expands an inline sub-item list that smooth-scrolls to section anchors. Clicking the link for the current page scrolls to top instead of re-navigating (avoids tearing down the sub-item list). Links use accent `#f2572d`; active/hover states brighten.

**SupplyChain page layout** (`display: flex; height: 100vh`):
- Left/main flex child: the map (`<MapView/>`), with `padding-bottom: 150px` reserved for the bottom bar (0 while in story mode). The `<ViewModePanel/>` floats over the top-left of the map.
- Overlaid fixed elements: `<Legend/>` (top-right), the active info panel (bottom-left), `<BottomBar/>` (full-width bottom), and `<MobileIntro/>` (mobile only).
- Story mode swaps the bottom bar for `<StoryPanel/>`.

---

## 5. The map (MapView)

### Setup
- `L.map(container)` with a **Stadia Maps "stamen_toner_dark"** raster tile layer (dark, high-contrast, label-light): `https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.png`, `minZoom 0`, `maxZoom 20`.
- Map container background is forced to `#0a0a0a !important` so letterboxed areas outside the world tiles blend into the page (Leaflet's default grey is hidden).
- **World view**: desktop `setView([20, 0], 2)`. Mobile (short screen) instead `fitBounds([[-58,-170],[78,170]])` so the whole world fits the available height. A `resize`/`orientationchange` handler re-fits the world view (unless a story/selection is active).

### Node rendering
- **Red (circle)**: `L.circleMarker([lat,lng], { radius: 10, fillColor:'#e5312e', color:'#e5312e', weight:1 })`.
- **Orange (square)** and **White (triangle)**: Leaflet `circleMarker` can only draw circles, so these are **`L.marker` with an SVG `L.divIcon`**. The divIcon uses a custom `className: 'node-marker'` (which drops Leaflet's default white box), an inline `<svg viewBox="0 0 20 20">` containing:
  - square: `<rect class="node-shape" x="2" y="2" width="16" height="16">`
  - triangle: `<polygon class="node-shape" points="10,2.5 18.5,18 1.5,18">`
  - both with `fill`/`stroke` = the node color, and `iconSize:[20,20]`, `iconAnchor:[10,10]` so the shape is centered on its coordinate like a circleMarker.

### Opacity states (highlight / dim)
Each node type has three style states, applied as `{ fillOpacity, opacity }`:
```
             DEFAULT          HIGHLIGHT         DIMMED
red     {0.5 , 0.7}      {0.95, 1}        {0.04, 0.04}
orange  {0.5 , 1}        {0.95, 1}        {0.03, 0.04}
white   {0.5 , 0.5}      {0.9 , 1}        {0.04, 0.04}
```
A single `applyStyle(marker, state)` helper handles both shapes: circleMarkers use `setStyle`; divIcon shapes have their `.node-shape` element's `fill-opacity`/`stroke-opacity` updated in place (no icon rebuild, so event listeners survive).

### Edges
- `L.polyline([from, to], { color, weight: 1.5, opacity: 0.75, smoothFactor: 1, dashArray })`.
- **White edges are dotted** via `dashArray: '2 5'` (Leaflet's default round line caps render these dashes as dots). **Red edges are solid** (`dashArray: null`).
- Permanent view-mode edges are thinner/fainter: `weight: 1`, `opacity` 0.25 (white) / 0.4 (red), white still dotted.

---

## 6. Interaction model (this is the heart of the effect)

### Hover
Hovering any node **highlights its whole connected sub-graph and dims everything else**, and draws the connecting edges:
- Hover a **red** worker → its platform (orange) highlights, that platform's customers (white) highlight, red line worker→platform + white dotted lines platform→customers are drawn. All unrelated nodes dim to ~0.04 opacity.
- Hover an **orange** platform → all its worker centers + all its customers highlight, with all connecting edges.
- Hover a **white** customer → its platform(s) highlight, and those platforms' worker centers highlight, with edges.
- On `mouseout`, hover edges are removed and styles revert to the current **selection** state (see below), not necessarily to default.

Edges are transient layers stored in a `hoverEdgesRef` and cleared on mouseout.

### Click = selection (persistent)
Clicking a node selects it and the highlight/edges **persist** until cleared:
- Click red worker → selects its **country** (opens `CountryInfo`, zooms to that country's bounds).
- Click orange platform → selects the **platform** (opens `PlatformInfo`).
- Click white customer → selects the **customer** (opens `CustomerInfo`).
Selecting one type clears the others. Selection re-applies the same highlight/dim logic as hover, plus persistent edges (`selectionEdgesRef`). Hovering while a selection is active temporarily overrides, then restores the selection view on mouseout.

### Relationship maps
On data load, precompute lookup maps once (`relRef`): `redByPlatform` (platform → worker rows), `orangeByName` (platform → [lat,lng]), `custEdgesBySource` (platform → customers), `custEdgesByTarget` (customer → platforms). All hover/selection logic reads these.

### Camera
- Selecting a country flies to its worker bounds (`flyToBounds`, `maxZoom 10`, `padding 60`).
- Clearing selection flies back to world view.
- All animated camera moves respect **reduced motion** (see §10).

---

## 7. View-mode panel (top-left of map)

Title "Show relationship" + three toggle options, each with a small ring dot that fills white when active:
```
Customer - Platform - Worker   → draws ALL red + ALL white edges permanently
Customer - Platform            → draws ALL white edges
Platform - Worker              → draws ALL red edges
```
Clicking an active option toggles it off. These permanent edges are separate from hover/selection edges (`viewModeEdgesRef`) and are **not** given any highlight styling — they're the faint always-on layer. (Design note: keep view-mode edges plain; only hover/selection edges get the emphasis treatment.)

---

## 8. Info panels (Platform / Country / Customer)

Fixed, bottom-left, `width: 280px`, `left: 16px`, `bottom: 269px`, `max-height: calc(100vh - 269px - 80px)`, `overflow-y: auto`. `#111111`, radius 8px, `padding: 0 16px 16px` (see sticky-header note).

Each has: a **header row** (title + `×` close button, `justify-content: space-between`), description lines, and lists. `PlatformInfo`/`CountryInfo` also show stat rows with accent-colored values.

**Sticky close button (important effect):** the panels scroll, and the `×` must stay reachable. The header is made sticky WITHOUT letting content peek above it:
- Remove the container's **top** padding (`padding: 0 16px 16px`).
- Give the header `position: sticky; top: 0; z-index: 2; background: #111111; padding: 16px 0 8px;`.
This moves the top spacing into the header itself, so the pinned header fully covers scrolling content (a plain `sticky; top:0` with container top padding lets content show above the header — avoid that).

`CustomerInfo` lists the platforms a customer sources from. `PlatformInfo` lists worker countries/customers. `CountryInfo` lists the platforms/centers in that country.

---

## 9. Bottom bar, search, legend, story

### BottomBar (desktop)
Full-width, fixed bottom, `#0a0a0a`, fixed `height: 230px`, `pointer-events: none` on the wrapper / `auto` on the inner bar. Three zones left→right:
1. Giant title block: "WHERE ARE THE / **DATA WORKERS** / BEHIND AI?" (Impact 50px, middle line accent).
2. A ~500px description blurb (`#e0e0e0`, 15px, line-height 145%).
3. Right column: a `StoryBox` ("Explore the story" trigger) above the `SearchBox`.

### SearchBox
Small `#1a1a1a` box, title "Search by:", three buttons: `Worker Location (n)`, `Platforms (n)`, `Customers (n)` (counts from data). Clicking one opens the **FilterPanel** for that category. Active/hover item color = accent `#f2572d`. Items are left-aligned.

### FilterPanel (the "search window")
Fixed near bottom-right, `#111111`, radius 8px, scrollable list of all names in the category. Same **sticky header** technique as the info panels. List items:
- full-width rows, `text-align: left` (critical: the app's `#root` sets `text-align: center`, which would center long wrapped names — override to left), `padding: 1px 4px`, tight `gap: 1px`, hover background `#222222`, selected color accent.
- Clicking a name selects that entity (drives the same map highlight/zoom as clicking its node). Selecting again deselects.
- **Ungeocoded entries still appear here** (searchable) even though they have no map node — see §11.

### Legend (top-right)
Rows, each a swatch + label:
- Customer = translucent white **triangle** (inline SVG).
- Customer contract = dotted white line (dotted `repeating-linear-gradient`).
- Platform = translucent orange **square** (inline SVG).
- Affiliation = solid red line.
- Worker Location = solid red **circle**.
Swatches that are shapes must cancel the circular clip (`.legend-swatch` uses `border-radius:50%; overflow:hidden` by default; shape swatches set `border-radius:0; overflow:visible`).

### Story mode
Triggered from the StoryBox. Replaces the bottom bar with a `StoryPanel` (sticky `×`, prose, `← Back / n / N / Next →` nav). Story beats live in `data/storyBeats.js`; each beat sets:
- `nodeFilter`: `'red' | 'white' | 'all'` (which node types to draw),
- `highlightCountries`: array (others dim to ~0.05) or `null` for all,
- `autoFly`: `null` or `{ center, zoom, delayMs }` for a timed animated zoom.
Story mode hides the normal-mode markers/edges and renders its own layer set; exiting restores them. Each beat resets to world view first.

---

## 10. Responsive & accessibility

### Breakpoint
Single breakpoint at **`max-width: 900px`** = "mobile". On mobile:
- Panels shrink (padding 8px, smaller fonts, `width: 130–150px`), positioned top/bottom-anchored.
- The bottom bar collapses to just the story + search controls, pinned bottom-left, transparent background.
- The big title/blurb move to a **MobileIntro** overlay.

### MobileIntro
Full-screen overlay shown only on mobile. Portrait → shows a "rotate your device" prompt with an animated phone-rotate SVG. Landscape → shows title + blurb + "Enter the map →" button; once entered (and while landscape), it hides. Also carries a "some features limited on mobile" disclaimer.

### Accessibility features (all intentional — replicate them)
1. **Shape-coded nodes** (circle/square/triangle) so type survives color-blindness.
2. **Line-style-coded edges** (solid vs dotted) so edge type survives color-blindness.
3. **Reduced motion**: `window.matchMedia('(prefers-reduced-motion: reduce)')` — when set, every animated `flyTo`/`flyToBounds` becomes an instant `setView`/`fitBounds` (`animate:false`). Applies to world reset, country zoom, and story auto-fly.
4. **Focus-visible ring**: global rule — `a/button/input/[tabindex]:focus-visible { outline: 2px solid #f2572d; outline-offset: 2px; }`. Keyboard focus is visible; mouse clicks don't trigger it.
5. **Contrast**: body text runs 11–19:1 on the dark bg. Accent text must clear AA — use `#f2572d` (not `#e0432a`) on `#1a1a1a`. Node red is `#e5312e` (≈4.5:1 on black) rather than a darker red.

---

## 11. Data model

Three CSVs loaded at runtime (served from `public/`, parsed with papaparse `download: true`).

**`dal-platforms.csv`** — orange nodes:
```
name, country, city, lat, lng, notes
```

**`worker-location.csv`** — red nodes + red edges (each worker row joins to its platform HQ by name):
```
country, platform, city, lat, lng, method, source, notes
```

**`platform-customer.csv`** — white nodes + white edges:
```
platform, customer, country, city, lat, lng
```

**Geocoding rule:** a row with empty `lat`/`lng` is **not drawn on the map**, but the entity **is still listed in the search/filter panel**. So ungeocoded customers are searchable but show no node and draw no edges when selected (expected behavior, not a bug).

Rendering ownership:
- Red nodes + red (worker↔platform) edges ← `worker-location.csv`.
- Orange nodes ← `dal-platforms.csv`.
- White nodes + white (platform↔customer) edges ← `platform-customer.csv`.

---

## 12. Implementation gotchas (learned the hard way)

- **Shapes as divIcons**: use a single `applyStyle()` that branches on `marker instanceof L.CircleMarker` vs. updating the SVG `.node-shape` element — don't `setIcon` on every hover (destroys perf/events).
- **Dotted lines**: `dashArray: '2 5'` + Leaflet's default round caps = dots. Larger like `'5 6'` reads as dashes, not dots.
- **Sticky header**: move container top-padding into the header; a naive `sticky; top:0` with container padding lets content peek above the pinned header.
- **`text-align` inheritance**: `#root { text-align: center }` silently centers wrapped list lines — force `text-align: left` on any list of names.
- **Projected midpoints / line simplification**: if you ever add mid-line decorations, note Leaflet's `smoothFactor` (default 1) drops collinear vertices — set `smoothFactor: 0` to keep them.
- **StrictMode remount race**: guard camera moves with `if (map.getSize().x === 0) return` so Leaflet doesn't project to `(NaN, NaN)` before the container is measured.
- Keep refs (`relRef`, `selected*Ref`, `customerCoordsRef`) in sync via effects so stale closures in Leaflet event handlers read current values.

---

## 13. Project structure

```
src/
  main.jsx                 # React root (StrictMode)
  App.jsx                  # HashRouter + NavBar + routes
  index.css                # globals, focus-visible, #root, .leaflet-container bg
  App.css                  # (mostly Vite leftovers)
  pages/
    SupplyChain.jsx        # the map page: loads CSVs, owns selection state
    AboutPage / Methodology / Database (.jsx/.css)
  components/
    MapView.jsx            # ALL Leaflet rendering, hover/selection/story/view-mode
    BottomBar / SearchBox / FilterPanel
    Legend / ViewModePanel
    PlatformInfo / CountryInfo / CustomerInfo   # bottom-left info panels
    StoryBox / StoryPanel                       # story mode
    NavBar / MobileIntro
  data/
    storyBeats.js          # story script
public/
  dal-platforms.csv  worker-location.csv  platform-customer.csv
  icons.svg  favicon.svg
```

State ownership: `SupplyChain.jsx` holds `selectedPlatform/Country/Customer`, `viewMode`, `storyStep`, and the parsed data; everything else is presentational and driven by props/callbacks. `MapView.jsx` holds all imperative Leaflet code.
