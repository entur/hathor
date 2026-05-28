# Architecture-doc L5 — slot bindings

**Date:** 2026-05-26
**Scope:** `docs/architecture.html` + `docs/architecture-data.js` + `scripts/gen-arch-metafile.mjs` + `scripts/arch-gen/*` + `docs/arch/*`
**Status:** design approved, ready for plan

## 1. Context

`docs/architecture.html` is a four-layer, top-down map of Hathor:

| Layer | Kind | Visibility |
|---|---|---|
| L1 | App root (`src/App.tsx`) | always |
| L2 | Generic wrappers (`GenericDataViewPage`, `GenericDetailsPage`) | always |
| L3 | Opt-in widgets (`floatingAction`, `filters`, …) | shown when chip clicked |
| L4 | Feature views (`VehicleView`, `VehicleTypeView`, …) | always |

Today the L4 card tells you *which wrapper a view renders*. It does **not** tell you *what concrete component the view plugs into each wrapper slot*. Concretely:

- `VehicleTypeView.tsx` spreads `floatingAction: <AutosysImportFloatingMenu />` over its viewConfig.
- `VehicleView.tsx` spreads `floatingAction: <NewVehicleFab />` over its viewConfig.
- Every viewConfig sets `PageContentComponent: DataPageContent` — a required slot with a uniform default — and the doc shows nothing of this.

Goal: introduce an **L5 "slot binding" rank** that surfaces these per-view component/hook/function bindings.

## 2. Resolved decisions

| # | Decision | Rationale |
|---|---|---|
| D1 | L5 = **slot binding** (view → wrapper-slot → concrete value). One L5 node per binding. | Mirrors the user's two motivating examples (`DataPageContent`, `AutosysImportFloatingMenu`) exactly. |
| D2 | L5 nodes parent off **L3 widget** (not L4 view). | Groups bindings by slot: "what fills `floatingAction`?" is one click. Slot metadata isn't duplicated across views. |
| D3 | Slot scope: **components + hooks + functions**. | `floatingAction`, `PageContentComponent`, `EditorComponent`, `detailsChildren`, `useData`, `useSearchRegistration`, `useUrlEffect`, `useRowClick`, `getFilterKey`, `handleColumnEvent`, `getSortValue`. Strings/objects/arrays (`title`, `urlFilterInfo`, `filters`) keep their existing `usedBy` list and get no L5 cards. |
| D4 | `PageContentComponent`, `EditorComponent`, `useData`, `useSearchRegistration`, `detailsChildren` are **structural slots** (every view fills them) — modelled as widgets with `structural: true`. | Lets a single rendering pipeline cover both opt-in and structural surfaces. The chip styling differs to keep the visual distinction. |
| ~~D5~~ | ~~Cross-repo embed surfaces…package-badge rendering~~ — **withdrawn**. Bare-package imports are treated like any other unresolved identifier: `file: null`, card shows the binding without a path line. No `pkg:` prefix, no badge. | Out of scope for v1. |
| D6 | L5 visibility = parent widget's expand state. **No second click required.** | Matches the existing single-chip-click interaction model. |
| D7 | Cross-edge binding → view: **default on**, dashed/faint, runtime opt-out via `?bindings=off`. | Helps the eye link a binding card to the view it belongs to without committing to it permanently. |
| D8 | The generator step `derive-widget-bindings` is **enrichment-grade**: any single-view failure logs a warning and contributes `bindings: []` for that slot. The metafile is never partially written. | Same contract as the existing `derive-widget-usage` step — no regression in the fail-early guarantees. |

## 3. Data shape

### 3.1 `WRAPPERS` additions in `scripts/arch-gen/wrappers-data.mjs`

```js
// GenericDataViewPage.widgets += …
{ key: 'PageContentComponent', type: 'ComponentType<PageContentComponentProps<T,K>>',
  desc: 'Concrete component rendering the table body. Today every view supplies DataPageContent.',
  structural: true },
{ key: 'EditorComponent', type: 'ComponentType<{itemId:string}>',
  desc: 'Sidebar editor body for the selected row. Set via EditingContext.setEditingItem.',
  structural: true, source: 'editing-context' },
{ key: 'useData', type: '() => UseDataReturn<T,K>',
  desc: 'Per-entity dataset hook.', structural: true },
{ key: 'useSearchRegistration', type: '(allData, dataLoading) => void',
  desc: 'Per-entity search-context wiring.', structural: true },

// GenericDetailsPage.widgets += …
{ key: 'detailsChildren', type: 'ReactNode (JSX child)',
  desc: 'Form / editor body the detail view passes as <GenericDetailsPage>…</GenericDetailsPage> child.',
  structural: true, source: 'jsx-child' },
```

### 3.2 Per-widget `bindings` array in `window.ARCH_DATA`

```js
widgets: [{
  key: 'floatingAction',
  type: 'ReactNode',
  desc: '...',
  usedBy: ['VehicleTypeView', 'VehicleView'],   // unchanged
  bindings: [
    { viewId: 'VehicleTypeView',
      value:  'AutosysImportFloatingMenu',
      kind:   'component',                       // 'component' | 'hook' | 'function' | 'inline'
      file:   'src/data/vehicle-imports/components/AutosysImportFloatingMenu.tsx',
      source: 'view' },                          // 'view' | 'config' | 'editing-context' | 'jsx-child'
    { viewId: 'VehicleView',
      value:  'NewVehicleFab',
      kind:   'component',
      file:   'src/data/vehicles/components/NewVehicleFab.tsx',
      source: 'view' },
  ],
}]
```

`bindings: []` for any widget where extraction yielded nothing. `bindings: undefined` is not emitted — the renderer treats missing and empty identically.

## 4. Generator extraction

New step `derive-widget-bindings`, soft-fail, lives in **`scripts/arch-gen/extract-bindings.mjs`** (~150 lines — keeps `extract-wrappers.mjs` under the 200-line house rule).

Output: `Map<widgetNodeId, Binding[]>` consumed by `gen-arch-metafile.mjs`.

### 4.1 Four extraction sites, per view

| Site | Source file | What we read | Slot keys filled |
|---|---|---|---|
| A. Spread override | `VehicleTypeView.tsx`, `VehicleView.tsx`, … | `<GenericDataViewPage viewConfig={{ …cfg, slot: X }}>` — walk the object literal, capture rhs per property | `floatingAction`, any slot the view spreads |
| B. ViewConfig literal | `vehicleTypeViewConfig.tsx`, … | The exported config object literal — capture rhs of every property matching a known slot key | `PageContentComponent`, `useData`, `useSearchRegistration`, `useUrlEffect`, `useRowClick`, `getFilterKey`, `getSortValue`, `handleColumnEvent` |
| C. EditingContext mount | view file + any `use*.tsx` hook it imports (single hop) | `setEditingItem({ EditorComponent: X, … })` | `EditorComponent` |
| D. Details body child | `VehicleTypeDetails.tsx`, `DeckPlanDetailsView.tsx`, `VehicleCreatePage.tsx` | First JSX child of `<GenericDetailsPage>…</GenericDetailsPage>` | `detailsChildren` |

### 4.2 Classifier

```js
function classify(expr) {
  if (ts.isJsxSelfClosingElement(expr) || ts.isJsxElement(expr)) {
    const tag = ts.isJsxElement(expr) ? expr.openingElement.tagName : expr.tagName;
    return { value: tag.getText(), kind: 'component', identForImportLookup: tag.getText() };
  }
  if (ts.isArrowFunction(expr) || ts.isFunctionExpression(expr)) {
    const inner = peekJsxFromArrow(expr);            // look one level into arrow body for <X .../>
    if (inner) return { value: inner, kind: 'component', identForImportLookup: inner };
    return { value: '(inline arrow)', kind: 'inline', identForImportLookup: null };
  }
  if (ts.isIdentifier(expr)) {
    const t = expr.text;
    const kind = t.startsWith('use') ? 'hook'
               : /^[A-Z]/.test(t)    ? 'component'
                                     : 'function';
    return { value: t, kind, identForImportLookup: t };
  }
  return { value: expr.getText().slice(0, 40), kind: 'inline', identForImportLookup: null };
}
```

The arrow-peek branch is what makes `EditorComponent: () => <VehicleDetails …/>` (the canonical pattern in `useVehicleUrlSelection.tsx`) render as `VehicleDetails` rather than `(inline arrow)`.

### 4.3 File / package resolution

Reuse `importMap()` + `resolveImport()` from `scripts/arch-gen/ts-ast.mjs`:

```js
function resolveBindingFile(sf, viewAbs, identForImportLookup) {
  if (!identForImportLookup) return null;
  const spec = importMap(sf).get(identForImportLookup);
  if (!spec) return null;
  if (spec.startsWith('.') || spec.startsWith('/'))
    return path.relative(REPO_ROOT, resolveImport(viewAbs, spec));
  return null;                                            // bare package — leave unresolved (D5 withdrawn)
}
```

### 4.4 Wiring in `scripts/gen-arch-metafile.mjs` (~6 added lines)

```js
import { deriveWidgetBindings } from './arch-gen/extract-bindings.mjs';

const usage    = deriveWidgetUsage(views);
const bindings = deriveWidgetBindings(views);

// …widgets map…
widgets: w.widgets.map(x => ({
  ...x,
  usedBy:   (usage.get(x.key) ?? []).filter(n => viewWrapper.get(n) === w.id),
  bindings: (bindings.get(w.id + '::' + x.key) ?? []),
})),
```

### 4.5 Failure modes

| Case | Behaviour |
|---|---|
| View has no `<wrapper viewConfig={…}>` JSX | Site A produces nothing; Site B may still fill via the viewConfig file |
| ViewConfig file cannot be resolved | Site B logs warn, returns nothing for that view |
| `setEditingItem` not present | Site C contributes nothing — matches reality (VehicleTypeView/DeckPlanView route to a full page) |
| `detailsChildren` JSX child is text / fragment / multiple elements | Capture first `JsxElement` only; otherwise `(inline)` |
| Identifier declared locally (no import) | `file: null`; card shows identifier without a path line |
| Inline arrow with no peekable JSX | `value: '(inline arrow)', file: null` |

## 5. Renderer changes

### 5.1 `docs/arch/model.js`

New constants:

```js
const CARD_W = { 1: 300, 2: 340, 3: 244, 4: 220, 5: 184 };
const CARD_H = { 1: 192, 2: 374, 3: 198, 4: 150, 5: 96 };
const BIND_GAP = 12;
```

`buildModel()` emits one L5 node per binding, `parent = widget.id`:

```js
for (const w of data.wrappers)
  for (const widget of w.widgets)
    for (const b of (widget.bindings ?? []))
      nodes.push({
        id: w.id + '::' + widget.key + '::' + b.viewId,
        layer: 5, kind: 'binding',
        parent: w.id + '::' + widget.key,
        data: b,
      });
```

`layout()`:

```js
const vis = model.nodes.filter(n =>
  (n.layer !== 3 || expanded.has(n.id)) &&
  (n.layer !== 5 || expanded.has(n.parent))
);
const l5 = vis.filter(n => n.layer === 5);

const y1 = MARGIN;
const y2 = y1 + CARD_H[1] + BAND_GAP;
const y3 = y2 + CARD_H[2] + BAND_GAP;
const y5 = y3 + CARD_H[3] + BAND_GAP;
const y4 = l5.length ? y5 + CARD_H[5] + BAND_GAP
         : l3.length ? y3 + CARD_H[3] + BAND_GAP
                     : y2 + CARD_H[2] + BAND_GAP;

for (const [pid, kids] of groupBy(l5, n => n.parent)) {
  const p = model.byId.get(pid);
  const span = kids.length * CARD_W[5] + (kids.length - 1) * BIND_GAP;
  let x = p.x + CARD_W[3] / 2 - span / 2;
  for (const k of kids) { k.w = CARD_W[5]; k.x = x; x += CARD_W[5] + BIND_GAP; }
}
l5.forEach(n => { n.y = y5; n.h = CARD_H[5]; });
```

**Known limitation:** two adjacent expanded widgets with wide L5 rows can overlap horizontally. Accepted in v1 — the current dataset never triggers it; the data shape supports a v2 wrap-row pass without change.

### 5.2 `docs/arch/cards.js`

New dispatcher branch + `bindingCard()`:

```js
NS.card = function (n, expanded) {
  if (n.kind === 'app')     return appCard(n.data);
  if (n.kind === 'wrapper') return wrapperCard(n, expanded);
  if (n.kind === 'widget')  return widgetCard(n.data);
  if (n.kind === 'binding') return bindingCard(n.data);
  return viewCard(n.data);
};

function bindingCard(b) {
  const fileLine = b.file ? '<div class="path">' + esc(b.file) + '</div>' : '';
  return (
    '<div class="card c5">' +
      '<div class="ttl mono">' + esc(b.value) + '</div>' +
      '<div class="kind kind-' + esc(b.kind) + '">' + esc(b.kind) + '</div>' +
      fileLine +
      '<div class="for-view">→ ' + esc(b.viewId) + '</div>' +
    '</div>'
  );
}
```

Wrapper card's widget chips gain a `structural` class when `widget.structural === true`:

```js
const cls = 'chip' + (expanded.has(…) ? ' on' : '') + (x.structural ? ' structural' : '');
```

### 5.3 `docs/arch/render.js` — edges

Primary widget→binding edges are emitted by the existing `drawEdges()` with no change (they pick up class `edge-l5` from `'edge edge-l' + e.layer`).

Optional **cross-edge** binding → view: new helper `drawCrossEdges()` driven by a `?bindings=on|off` query-string param (default on):

```js
function drawCrossEdges(g, model, visIds) {
  const links = [];
  for (const n of model.nodes) {
    if (n.layer !== 5 || !visIds.has(n.id)) continue;
    const view = model.nodes.find(v => v.kind === 'view' && v.id === n.data.viewId);
    if (view && visIds.has(view.id))
      links.push({ id: n.id + '~' + view.id, from: n, to: view });
  }
  // …enter/update/exit pattern, class 'edge edge-bind'
}
```

### 5.4 `docs/arch/arch.css` — additions

```css
.dot.l5            { background: <l5-hue>; }
.card.c5           { font-size: 12px; padding: 8px 10px; }
.card.c5 .ttl      { font-size: 13px; }
.card.c5 .kind     { display: inline-block; padding: 1px 6px; border-radius: 999px;
                     font-size: 10px; text-transform: uppercase; }
.card.c5 .kind-component { background: <component-tint>; }
.card.c5 .kind-hook      { background: <hook-tint>; }
.card.c5 .kind-function  { background: <fn-tint>; }
.card.c5 .kind-inline    { background: <inline-tint>; color: #666; }
.card.c5 .for-view       { font-size: 10px; opacity: 0.7; text-align: right; }
.edge.edge-l5            { stroke: <l5-hue>; }
.edge.edge-bind          { stroke: <l5-hue>; stroke-dasharray: 3 3; opacity: 0.4; }
.chip.structural         { border-style: solid; border-width: 1.5px; }
```

Concrete colour values land at implementation time, picked from the existing `.dot.l1`/`.l2`/`.l3`/`.l4` palette in `arch.css`.

### 5.5 `docs/architecture.html`

One added legend item, one sentence tweak:

```html
<span class="legend"><i class="dot l5"></i> Slot binding</span>
```

Header copy: "…click a widget chip to expand its detail **and the per-view bindings beneath it**."

## 6. Verification

| Layer | How to verify |
|---|---|
| Generator | `npm run gen:arch` produces a metafile whose every wrapper widget has a `bindings` array. Spot-check `floatingAction` for the two known views, `PageContentComponent` for all three list views, `EditorComponent` for `VehicleView` only, `detailsChildren` for the three detail views. |
| Renderer | Open `docs/architecture.html` in a browser. Click `floatingAction` chip on `GenericDataViewPage` — two L5 cards appear (AutosysImportFloatingMenu, NewVehicleFab) with cross-edges to their respective L4 view cards. Click `PageContentComponent` — three identical `DataPageContent` bindings appear (today's reality). Click `EditorComponent` — one binding (`VehicleDetails`, off `VehicleView`). Click `detailsChildren` on `GenericDetailsPage` — three bindings; `@entur/vtype-details::Editor` resolves to `file: null` (no path line) because it's a bare-package import. |
| Failure modes | Temporarily rename one viewConfig export; re-run `gen:arch`; confirm warn line, valid metafile, that view's slots contribute `[]`. |

No automated tests for the renderer (matches the doc's existing stance — it's a hand-authored visualisation, not part of the app build). The extractor is testable via a small AST fixture if we judge it worthwhile during implementation; tabled until then.

## 7. Out of scope

- Wrapping overflow when many widgets are expanded at once (deferred — v2).
- L5 cards for non-component slot types (`title`, `urlFilterInfo`, `filters`) — deferred; their `usedBy` list stays as-is.
- Promoting `HeaderActions` or other L1-shell internals to chips on the app card — deferred; no per-view variance to surface.
- `columns: ColumnDefinition[]` rendering — deferred; needs its own card variant.
- Per-binding click-to-collapse — explicitly rejected (single expand state on the widget chip).

## 8. File touch list

| File | Change |
|---|---|
| `scripts/arch-gen/wrappers-data.mjs` | Add 5 structural widget entries (`PageContentComponent`, `EditorComponent`, `useData`, `useSearchRegistration`, `detailsChildren`). |
| `scripts/arch-gen/extract-bindings.mjs` | **New** (~150 lines) — the 4 extraction sites + classifier + file resolver. |
| `scripts/gen-arch-metafile.mjs` | Import `deriveWidgetBindings`; thread its result into the widgets map. |
| `docs/arch/model.js` | New L5 constants; L5 node construction; L5 visibility filter; y5 band; L5 x-centreing. |
| `docs/arch/cards.js` | `bindingCard()`; dispatcher branch; `structural` chip class. |
| `docs/arch/render.js` | Optional `drawCrossEdges()` + `?bindings=on/off` URL param. |
| `docs/arch/arch.css` | `.c5`, `.dot.l5`, `.edge-bind`, `.chip.structural` rules. |
| `docs/architecture.html` | One new legend `<span>`; one sentence in the header `<p>`. |
