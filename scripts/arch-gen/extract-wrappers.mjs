/**
 * Steps `detect-wrapper` and `derive-widget-usage`.
 *
 * `detect-wrapper` decides, per routed view, which generic wrapper it renders —
 * by which wrapper module it imports. A view importing both wrappers fails hard
 * (genuinely ambiguous). A view importing neither is treated as a leaf
 * (wrapperId null), like Home: visibly a leaf in the doc, never silently wrong.
 *
 * `derive-widget-usage` scans each view (and its viewConfig) for the opt-in
 * widget keys, to fill each L3 widget's `usedBy` list. It fails soft — an
 * unresolvable viewConfig is warned and skipped, leaving `usedBy` partial.
 */
import ts from 'typescript';
import { loadSourceFile, walk, importMap, resolveImport, fail } from './ts-ast.mjs';
import { WRAPPER_ID_BY_BASENAME, WRAPPERS } from './wrappers-data.mjs';
import { isJsxEl, jsxAttr } from './extract-routes.mjs';

/** Basename of a module specifier, without extension. */
function baseOf(spec) {
  return (spec.split('/').pop() ?? spec).replace(/\.tsx?$/, '');
}

/**
 * Step `detect-wrapper` — the wrapper id a view renders, or null for a leaf.
 * @param {{name:string,file:string,abs:string}} view
 * @returns {string|null}
 */
export function detectWrapper(view) {
  const { sf, text } = loadSourceFile(view.abs, view.file, 'detect-wrapper');
  const hits = new Set();
  for (const spec of importMap(sf).values()) {
    const id = WRAPPER_ID_BY_BASENAME.get(baseOf(spec));
    if (id) hits.add(id);
  }
  if (hits.size > 1)
    fail(
      'detect-wrapper',
      view.file,
      sf,
      text,
      null,
      `view <${view.name}> imports more than one generic wrapper: ${[...hits].join(', ')}`,
      'a view must render exactly one wrapper — remove the unused import'
    );
  return hits.size === 1 ? [...hits][0] : null;
}

/**
 * Step `derive-widget-usage` — map every opt-in widget key to the views using it.
 * @returns {Map<string,string[]>} widget key -> view names
 */
export function deriveWidgetUsage(views) {
  const keys = WRAPPERS.flatMap(w => w.widgets.map(x => x.key));
  const usage = new Map(keys.map(k => [k, []]));
  for (const v of views) {
    if (!v.wrapperId) continue;
    try {
      const tokens = collectViewTokens(v);
      for (const k of keys) if (tokens.has(k)) usage.get(k).push(v.name);
    } catch (err) {
      console.warn(`⚠ [derive-widget-usage] ${v.file} — ${err.message} (usedBy left partial)`);
    }
  }
  return usage;
}

/** Configured field/prop names in a view file plus its viewConfig (if resolvable). */
function collectViewTokens(view) {
  const { sf } = loadSourceFile(view.abs, view.file, 'derive-widget-usage');
  const tokens = declaredNames(sf);
  const cfgAbs = viewConfigPath(sf, view.abs);
  if (cfgAbs) {
    const cfg = loadSourceFile(cfgAbs, cfgAbs.split(/[/\\]/).pop(), 'derive-widget-usage');
    for (const t of declaredNames(cfg.sf)) tokens.add(t);
  }
  return tokens;
}

/**
 * Object-literal property keys, method names, and JSX-attribute names in an
 * AST — names that denote a *configured* field or prop. Matching widget keys
 * against this set, rather than against every identifier, keeps `usedBy` from
 * collecting unrelated look-alike names (a local `title`, an import, a type).
 */
function declaredNames(sf) {
  const names = new Set();
  walk(sf, n => {
    if (
      ts.isPropertyAssignment(n) ||
      ts.isShorthandPropertyAssignment(n) ||
      ts.isMethodDeclaration(n)
    ) {
      const nm = n.name;
      if (nm && (ts.isIdentifier(nm) || ts.isStringLiteral(nm))) names.add(nm.text);
    } else if (ts.isJsxAttribute(n)) {
      names.add(n.name.getText());
    }
  });
  return names;
}

/** Resolve the viewConfig file a view passes to <GenericDataViewPage viewConfig=...>. */
function viewConfigPath(sf, viewAbs) {
  let ident = null;
  walk(sf, n => {
    if (ident || !isJsxEl(n)) return;
    const attr = jsxAttr(n, 'viewConfig');
    if (attr && attr.initializer && ts.isJsxExpression(attr.initializer))
      ident = configIdent(attr.initializer.expression);
  });
  if (!ident) return null;
  const spec = importMap(sf).get(ident);
  return spec ? resolveImport(viewAbs, spec) : null;
}

/**
 * The base viewConfig identifier from a `viewConfig=` expression. Handles a
 * bare identifier, an object literal that spreads one (`{ ...cfg, extra }`),
 * and a factory call (`getCfg(navigate)`).
 */
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

/** Leftmost identifier of an expression: `a`, `a.b`, `f(x)`, `f(x).b` -> `a`/`f`. */
function rootIdent(expr) {
  let e = expr;
  while (e) {
    if (ts.isIdentifier(e)) return e.text;
    if (ts.isCallExpression(e) || ts.isPropertyAccessExpression(e)) e = e.expression;
    else return null;
  }
  return null;
}
