/**
 * Steps `parse-routes` and `resolve-imports` — read src/App.tsx for the route
 * table and resolve each routed component to its source file. Both fail hard:
 * the route -> component -> file backbone must be correct or not emitted at all.
 */
import ts from 'typescript';
import { fail, walk, resolveImport, importMap } from './ts-ast.mjs';

/** JSX tag text of an opening/self-closing element. */
export function tagOf(node) {
  return node.tagName ? node.tagName.getText() : '';
}

/** Whether a node is a JSX opening or self-closing element. */
export function isJsxEl(n) {
  return ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n);
}

/** First JSX element nested anywhere inside a node, or null. */
export function firstJsxEl(node) {
  let found = null;
  if (node)
    walk(node, n => {
      if (!found && isJsxEl(n)) found = n;
    });
  return found;
}

/** A named JSX attribute node from an element, or null. */
export function jsxAttr(el, name) {
  const props = el.attributes?.properties ?? [];
  return props.find(p => ts.isJsxAttribute(p) && p.name.getText() === name) ?? null;
}

/**
 * Step `parse-routes` — every <Route> in App.tsx as {path, protected, component}.
 * @returns {{path:string,protected:boolean,component:string}[]}
 */
export function parseRoutes(sf, text, rel) {
  const routes = [];
  walk(sf, node => {
    if (!isJsxEl(node) || tagOf(node) !== 'Route') return;
    const pathAttr = jsxAttr(node, 'path');
    const elemAttr = jsxAttr(node, 'element');
    if (!pathAttr || !elemAttr)
      fail(
        'parse-routes',
        rel,
        sf,
        text,
        node,
        'expected every <Route> to have both a `path` and an `element` prop',
        'add the missing prop — this route cannot be mapped without it'
      );
    const routePath = ts.isStringLiteral(pathAttr.initializer) ? pathAttr.initializer.text : null;
    const inner = firstJsxEl(elemAttr.initializer);
    if (routePath == null || !inner)
      fail(
        'parse-routes',
        rel,
        sf,
        text,
        node,
        'expected `path` to be a string literal and `element` to wrap a JSX element',
        'dynamic route paths/elements are not supported by the generator'
      );
    let isProtected = false;
    let compEl = inner;
    if (tagOf(inner) === 'ProtectedRoute') {
      isProtected = true;
      const protectedElem = jsxAttr(inner, 'element');
      compEl = protectedElem ? firstJsxEl(protectedElem.initializer) : null;
      if (!compEl)
        fail(
          'parse-routes',
          rel,
          sf,
          text,
          inner,
          'expected <ProtectedRoute> to carry an `element` prop wrapping a JSX element',
          'ProtectedRoute must wrap the routed component via its `element` prop'
        );
    }
    routes.push({ path: routePath, protected: isProtected, component: tagOf(compEl) });
  });
  if (routes.length === 0)
    fail(
      'parse-routes',
      rel,
      sf,
      text,
      null,
      'expected at least one <Route> in App.tsx, found none',
      'the router markup changed — the generator looks for <Route path element>'
    );
  return routes;
}

/**
 * Step `resolve-imports` — collapse routes to unique components and resolve each
 * to a source file via App.tsx's import declarations.
 * @returns {{id,name,file,featureDir,routes:{path,protected}[],abs}[]}
 */
export function resolveRouteImports(routes, sf, text, appAbs, rel, repoRoot) {
  const imports = importMap(sf);
  const byComp = new Map();
  for (const r of routes) {
    if (!byComp.has(r.component)) byComp.set(r.component, []);
    byComp.get(r.component).push({ path: r.path, protected: r.protected });
  }
  return [...byComp.entries()].map(([name, rs]) => {
    const spec = imports.get(name);
    if (!spec)
      fail(
        'resolve-imports',
        rel,
        sf,
        text,
        null,
        `expected an import for the routed component <${name}>, found none`,
        `import ${name} in App.tsx, or fix the route element — the generator unwraps only <ProtectedRoute>, so any other element wrapper is mis-read as the routed component`
      );
    const abs = resolveImport(appAbs, spec);
    if (!abs)
      fail(
        'resolve-imports',
        rel,
        sf,
        text,
        null,
        `could not resolve the import "${spec}" for <${name}> to a file on disk`,
        'check the import path (it may be stale after a src/pages vs src/data move); also note the generator unwraps only <ProtectedRoute>, so another element wrapper is mis-read as the routed component'
      );
    const file = abs.slice(repoRoot.length + 1).replaceAll('\\', '/');
    return { id: name, name, file, featureDir: featureDirOf(file), routes: rs, abs };
  });
}

/** Feature directory a view file belongs to: `vehicle-types`, `pages`, ... */
function featureDirOf(file) {
  const parts = file.split('/');
  if (parts[0] === 'src' && parts[1] === 'data') return parts[2];
  return parts[1] ?? '(root)';
}
