/**
 * Step `derive-widget-bindings` — enrichment-grade.
 *
 * For every routed view, captures the *concrete value* it plugs into each
 * wrapper slot (component / hook / function). Output drives architecture-doc
 * L5 cards (one binding per view → slot pair).
 *
 * Four extraction sites, run per view:
 *   A. Spread override   — `<wrapper viewConfig={{ ...cfg, slot: X }}>` in the
 *                          view file. Captures rhs per property.
 *   B. ViewConfig literal — exported config object's property assignments.
 *   C. EditingContext   — `setEditingItem({ EditorComponent: X, ... })` in the
 *                          view file *or* any one-hop `use*` hook imported by
 *                          view or viewConfig. Fills the `EditorComponent` slot.
 *   D. Details child    — first meaningful JSX child of `<GenericDetailsPage>`,
 *                          skipping MUI layout primitives. Fills `detailsChildren`.
 *
 * Soft-fail contract: any single-view extraction error is `console.warn`-ed and
 * that view contributes nothing for the affected slot. Output is never partial
 * at the wrapper level — a slot with no harvested bindings emits `[]`.
 */
import path from 'node:path';
import ts from 'typescript';
import { loadSourceFile, walk, importMap, resolveImport } from './ts-ast.mjs';
import { WRAPPERS } from './wrappers-data.mjs';
import { isJsxEl, jsxAttr } from './extract-routes.mjs';

// ---------------------------------------------------------------------------
// Slot taxonomy. Mirrored from wrappers-data.mjs widget keys.
// ---------------------------------------------------------------------------
const COMPONENT_SLOTS = new Set([
  'floatingAction',
  'PageContentComponent',
  'EditorComponent',
  'detailsChildren',
]);
const HOOK_SLOTS = new Set(['useData', 'useSearchRegistration', 'useUrlEffect', 'useRowClick']);
const FN_SLOTS = new Set(['getFilterKey', 'handleColumnEvent', 'getSortValue']);
const VIEWCONFIG_SLOTS = new Set(
  [...COMPONENT_SLOTS, ...HOOK_SLOTS, ...FN_SLOTS].filter(
    k => k !== 'EditorComponent' && k !== 'detailsChildren'
  )
);
const LAYOUT_SKIP = new Set(['Paper', 'Box', 'Stack', 'Container', 'Grid', 'Card', 'CardContent']);

/** slot key -> wrapperId. Built lazily from WRAPPERS. */
const SLOT_WRAPPER = (() => {
  const m = new Map();
  for (const w of WRAPPERS) for (const x of w.widgets) m.set(x.key, w.id);
  return m;
})();

/**
 * Drive all four sites and return `Map<widgetNodeId, Binding[]>` keyed by
 * `<wrapperId>::<slotKey>`. Enrichment-grade: per-view failures are warned.
 *
 * @param {{id:string,name:string,file:string,abs:string,wrapperId:string|null}[]} views
 * @param {string} repoRoot - absolute path of the repo root
 * @returns {Map<string, Array<{viewId,value,kind,file,source}>>}
 */
export function deriveWidgetBindings(views, repoRoot) {
  const out = new Map();
  for (const v of views) {
    if (!v.wrapperId) continue;
    try {
      if (v.wrapperId === 'GenericDataViewPage') {
        harvestSpreadOverride(v, out, repoRoot);
        harvestViewConfigLiteral(v, out, repoRoot);
        harvestEditorComponent(v, out, repoRoot);
      } else if (v.wrapperId === 'GenericDetailsPage') {
        harvestDetailsChild(v, out, repoRoot);
      }
    } catch (err) {
      console.warn(`⚠ [derive-widget-bindings] ${v.file} — ${err.message} (bindings left partial)`);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Site A — spread override in the view file
// ---------------------------------------------------------------------------
/** Walk a view file for `<wrapper viewConfig={{ ...cfg, slot: X }}>` and harvest. */
function harvestSpreadOverride(view, out, repoRoot) {
  const { sf } = loadSourceFile(view.abs, view.file, 'derive-widget-bindings');
  walk(sf, n => {
    if (!isJsxEl(n)) return;
    const attr = jsxAttr(n, 'viewConfig');
    if (!attr || !attr.initializer || !ts.isJsxExpression(attr.initializer)) return;
    const expr = attr.initializer.expression;
    if (!expr || !ts.isObjectLiteralExpression(expr)) return;
    for (const p of expr.properties) {
      if (!ts.isPropertyAssignment(p) || !p.name) continue;
      const key = ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) ? p.name.text : null;
      if (!key || !VIEWCONFIG_SLOTS.has(key)) continue;
      pushBinding(out, view, sf, view.abs, key, unwrap(p.initializer), 'view', repoRoot);
    }
  });
}

// ---------------------------------------------------------------------------
// Site B — ViewConfig literal
// ---------------------------------------------------------------------------
/**
 * Open the viewConfig file the view points at, find the exported binding the
 * view spread-imports, and harvest its config object literal's property
 * assignments. Handles both patterns:
 *
 *   1. `export const fooViewConfig = { … }`           (bare object literal)
 *   2. `export const getFooViewConfig = (…) => ({ … })` (factory arrow)
 *
 * The viewConfig identifier is whichever name the view spreads — captured by
 * {@link configIdentFromView}. Locating the named export and walking only its
 * initializer keeps nested object literals (column defs, filter arrays) from
 * being misread as the config.
 */
function harvestViewConfigLiteral(view, out, repoRoot) {
  const ident = configIdentFromView(view);
  if (!ident) return;
  const cfgAbs = viewConfigPath(view);
  if (!cfgAbs) return;
  const rel = path.relative(repoRoot, cfgAbs);
  const { sf } = loadSourceFile(cfgAbs, rel, 'derive-widget-bindings');
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    if (!(stmt.modifiers ?? []).some(m => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
    for (const d of stmt.declarationList.declarations) {
      if (!d.name || !ts.isIdentifier(d.name) || d.name.text !== ident) continue;
      const objLit = firstObjectLiteralIn(d.initializer);
      if (!objLit) continue;
      for (const p of objLit.properties) {
        if (!ts.isPropertyAssignment(p) || !p.name) continue;
        const key = ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) ? p.name.text : null;
        if (!key || !VIEWCONFIG_SLOTS.has(key)) continue;
        pushBinding(out, view, sf, cfgAbs, key, unwrap(p.initializer), 'config', repoRoot);
      }
    }
  }
}

/** First ObjectLiteralExpression in an AST subtree (depth-first, parent before children). */
function firstObjectLiteralIn(node) {
  if (!node) return null;
  let found = null;
  walk(node, n => {
    if (!found && ts.isObjectLiteralExpression(n)) found = n;
  });
  return found;
}

/** The identifier the view spread-imports as its viewConfig source — `vehicleTypeViewConfig` or `getDeckPlanViewConfig`. */
function configIdentFromView(view) {
  const { sf } = loadSourceFile(view.abs, view.file, 'derive-widget-bindings');
  let ident = null;
  walk(sf, n => {
    if (ident || !isJsxEl(n)) return;
    const attr = jsxAttr(n, 'viewConfig');
    if (!attr || !attr.initializer || !ts.isJsxExpression(attr.initializer)) return;
    ident = configIdent(attr.initializer.expression);
  });
  return ident;
}

// ---------------------------------------------------------------------------
// Site C — EditingContext.setEditingItem in view + any one-hop use* hook
// ---------------------------------------------------------------------------
/** Find `setEditingItem({ EditorComponent: X, ... })` reachable from the view. */
function harvestEditorComponent(view, out, repoRoot) {
  const seen = new Set();
  const queue = [view.abs];
  const cfgAbs = viewConfigPath(view);
  if (cfgAbs) queue.push(cfgAbs);
  while (queue.length) {
    const abs = queue.shift();
    if (seen.has(abs)) continue;
    seen.add(abs);
    const rel = path.relative(repoRoot, abs);
    const { sf } = loadSourceFile(abs, rel, 'derive-widget-bindings');
    let hit = null;
    walk(sf, n => {
      if (hit || !ts.isCallExpression(n)) return;
      if (!ts.isIdentifier(n.expression) || n.expression.text !== 'setEditingItem') return;
      const arg = n.arguments[0];
      if (!arg || !ts.isObjectLiteralExpression(arg)) return;
      for (const p of arg.properties) {
        if (!ts.isPropertyAssignment(p) || !p.name) continue;
        const k = ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) ? p.name.text : null;
        if (k === 'EditorComponent') hit = unwrap(p.initializer);
      }
    });
    if (hit) {
      pushBinding(out, view, sf, abs, 'EditorComponent', hit, 'editing-context', repoRoot);
      return; // first hit wins
    }
    // hop one level — follow local `use*` imports
    for (const [ident, spec] of importMap(sf).entries()) {
      if (!ident.startsWith('use')) continue;
      const nextAbs = resolveImport(abs, spec);
      if (nextAbs && !seen.has(nextAbs)) queue.push(nextAbs);
    }
  }
}

// ---------------------------------------------------------------------------
// Site D — first meaningful JSX child of <GenericDetailsPage>
// ---------------------------------------------------------------------------
/** Capture the first non-layout JSX child of `<GenericDetailsPage>…</…>`. */
function harvestDetailsChild(view, out, repoRoot) {
  const { sf } = loadSourceFile(view.abs, view.file, 'derive-widget-bindings');
  let found = null;
  walk(sf, n => {
    if (found || !ts.isJsxElement(n)) return;
    if (n.openingElement.tagName.getText() !== 'GenericDetailsPage') return;
    found = firstMeaningfulJsxChild(n);
  });
  if (found) pushBinding(out, view, sf, view.abs, 'detailsChildren', found, 'jsx-child', repoRoot);
}

/** Descend through MUI layout primitives, return the first concrete JSX tag. */
function firstMeaningfulJsxChild(parent) {
  const queue = [...(parent.children ?? [])];
  while (queue.length) {
    const c = queue.shift();
    if (ts.isJsxText(c)) continue;
    if (ts.isJsxExpression(c)) {
      if (c.expression) queue.unshift(c.expression);
      continue;
    }
    if (ts.isJsxElement(c)) {
      const tag = c.openingElement.tagName.getText();
      if (LAYOUT_SKIP.has(tag)) {
        queue.unshift(...(c.children ?? []));
        continue;
      }
      return c.openingElement;
    }
    if (ts.isJsxSelfClosingElement(c)) {
      if (LAYOUT_SKIP.has(c.tagName.getText())) continue;
      return c;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Shared — classify rhs, resolve file, push into the output map
// ---------------------------------------------------------------------------
/**
 * Push one binding for `<wrapperId>::<slotKey>` keyed by the view.
 *
 * `fromAbs` is the absolute path of the file whose `importMap(sf)` will be
 * consulted to resolve the binding's identifier — must match the `sf` the
 * binding was harvested from (NOT `view.abs`, which can differ when the
 * binding lives in a sibling viewConfig or a hook).
 */
function pushBinding(out, view, sf, fromAbs, slotKey, rhs, source, repoRoot) {
  const wrapperId = SLOT_WRAPPER.get(slotKey);
  if (!wrapperId) return;
  const cls = classify(rhs);
  const file = resolveBindingFile(sf, fromAbs, cls.identForImportLookup, repoRoot);
  const key = wrapperId + '::' + slotKey;
  if (!out.has(key)) out.set(key, []);
  // dedupe per (view, slot) — view+config can both report the same value; first wins
  if (out.get(key).some(b => b.viewId === view.id)) return;
  out.get(key).push({
    viewId: view.id,
    value: cls.value,
    kind: cls.kind,
    file,
    source,
  });
}

/**
 * Strip type/syntax wrappers that aren't the binding's identity:
 *   - `(X)`                  — ParenthesizedExpression
 *   - `X as T` / `<T>X`      — As / TypeAssertion
 *   - `X<T>`                 — instantiation expressions (TS 4.7+)
 */
function unwrap(expr) {
  let e = expr;
  while (
    e &&
    (ts.isParenthesizedExpression(e) ||
      ts.isAsExpression(e) ||
      ts.isTypeAssertionExpression(e) ||
      ts.isExpressionWithTypeArguments(e))
  )
    e = e.expression;
  return e;
}

/** Classify an rhs expression into `{value, kind, identForImportLookup}`. */
function classify(expr) {
  if (!expr) return { value: '(none)', kind: 'inline', identForImportLookup: null };
  if (ts.isJsxSelfClosingElement(expr)) {
    const tag = expr.tagName.getText();
    return { value: tag, kind: 'component', identForImportLookup: tag };
  }
  if (ts.isJsxOpeningElement(expr)) {
    const tag = expr.tagName.getText();
    return { value: tag, kind: 'component', identForImportLookup: tag };
  }
  if (ts.isJsxElement(expr)) {
    const tag = expr.openingElement.tagName.getText();
    return { value: tag, kind: 'component', identForImportLookup: tag };
  }
  if (ts.isArrowFunction(expr) || ts.isFunctionExpression(expr)) {
    const inner = peekJsxFromBody(expr.body);
    if (inner) return classify(inner);
    return { value: '(inline arrow)', kind: 'inline', identForImportLookup: null };
  }
  if (ts.isIdentifier(expr)) {
    const t = expr.text;
    const kind = t.startsWith('use') ? 'hook' : /^[A-Z]/.test(t) ? 'component' : 'function';
    return { value: t, kind, identForImportLookup: t };
  }
  const text = expr.getText().replace(/\s+/g, ' ').slice(0, 40);
  return { value: text, kind: 'inline', identForImportLookup: null };
}

/** Find the first JsxElement/Self-closing nested in a function/arrow body. */
function peekJsxFromBody(body) {
  let found = null;
  if (!body) return null;
  walk(body, n => {
    if (found) return;
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) found = n;
  });
  return found;
}

/** Resolve a binding's identifier to a repo-relative file, or null. */
function resolveBindingFile(sf, fromAbs, ident, repoRoot) {
  if (!ident) return null;
  const spec = importMap(sf).get(ident);
  if (!spec) return null;
  if (!spec.startsWith('.') && !spec.startsWith('/')) return null; // D5 withdrawn
  const abs = resolveImport(fromAbs, spec);
  if (!abs) return null;
  return path.relative(repoRoot, abs).replaceAll('\\', '/');
}

/**
 * Mirror of extract-wrappers.viewConfigPath — resolve the `viewConfig=` attr
 * of `<GenericDataViewPage>` in a view file to the viewConfig source file.
 */
function viewConfigPath(view) {
  const { sf } = loadSourceFile(view.abs, view.file, 'derive-widget-bindings');
  let ident = null;
  walk(sf, n => {
    if (ident || !isJsxEl(n)) return;
    const attr = jsxAttr(n, 'viewConfig');
    if (!attr || !attr.initializer || !ts.isJsxExpression(attr.initializer)) return;
    ident = configIdent(attr.initializer.expression);
  });
  if (!ident) return null;
  const spec = importMap(sf).get(ident);
  return spec ? resolveImport(view.abs, spec) : null;
}

/** Leftmost identifier in a `viewConfig=` rhs (bare id, spread root, or call root). */
function configIdent(expr) {
  if (expr && ts.isObjectLiteralExpression(expr)) {
    for (const p of expr.properties)
      if (ts.isSpreadAssignment(p)) {
        const id = rootIdent(p.expression);
        if (id) return id;
      }
    return null;
  }
  return rootIdent(expr);
}

/** Innermost identifier of an expression chain: `a`, `a.b`, `f(x)` -> `a`/`f`. */
function rootIdent(expr) {
  let e = expr;
  while (e) {
    if (ts.isIdentifier(e)) return e.text;
    if (ts.isCallExpression(e) || ts.isPropertyAccessExpression(e)) e = e.expression;
    else return null;
  }
  return null;
}
