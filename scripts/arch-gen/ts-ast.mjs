/**
 * TypeScript-AST helpers for the architecture-doc generator.
 *
 * All source reading goes through the TypeScript Compiler API
 * (`ts.createSourceFile`) — never regex. `typescript` is already a Hathor
 * dependency, so this adds nothing to package.json.
 */
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';

const SNIPPET_RADIUS = 1; // source lines of context shown around an error

/**
 * A fatal, AI-patchable extraction failure. Carries enough location and intent
 * for a person or an agent to jump straight to the fix.
 */
export class ExtractionError extends Error {
  /**
   * @param {{step:string,file:string,line:number,col:number,expected:string,
   *          snippet?:string,hint?:string}} info
   */
  constructor(info) {
    super(`[${info.step}] ${info.file}:${info.line}:${info.col} — ${info.expected}`);
    this.name = 'ExtractionError';
    Object.assign(this, info);
  }

  /** Render as a formatted stderr block. */
  format() {
    const out = [`✗ [${this.step}] ${this.file}:${this.line}:${this.col}`, `  ${this.expected}`];
    if (this.snippet)
      out.push(
        this.snippet
          .split('\n')
          .map(l => `  ${l}`)
          .join('\n')
      );
    if (this.hint) out.push(`  hint: ${this.hint}`);
    return out.join('\n');
  }
}

/**
 * Read and parse a source file into a TSX AST.
 * @param {string} absPath - Absolute path on disk.
 * @param {string} relPath - Repo-relative path, used in messages.
 * @param {string} step - Owning extraction step, used in messages.
 * @returns {{sf: import('typescript').SourceFile, text: string}}
 */
export function loadSourceFile(absPath, relPath, step) {
  if (!fs.existsSync(absPath))
    throw new ExtractionError({
      step,
      file: relPath,
      line: 0,
      col: 0,
      expected: 'expected this source file to exist, but it was not found',
      hint: 'a stale import resolved here — check the importing file',
    });
  const text = fs.readFileSync(absPath, 'utf8');
  const sf = ts.createSourceFile(relPath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  return { sf, text };
}

/**
 * Depth-first walk of every node in an AST.
 * @param {import('typescript').Node} node
 * @param {(n: import('typescript').Node) => void} visit
 */
export function walk(node, visit) {
  visit(node);
  node.forEachChild(child => walk(child, visit));
}

/**
 * 1-based line/column for a node's start, plus a source snippet around it.
 * @returns {{line:number,col:number,snippet:string}}
 */
export function posOf(sf, text, node) {
  const { line, character } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
  const all = text.split('\n');
  const from = Math.max(0, line - SNIPPET_RADIUS);
  const to = Math.min(all.length - 1, line + SNIPPET_RADIUS);
  const snippet = all
    .slice(from, to + 1)
    .map((l, i) => `${String(from + i + 1).padStart(4)} | ${l}`)
    .join('\n');
  return { line: line + 1, col: character + 1, snippet };
}

/**
 * Build and throw an {@link ExtractionError} anchored at an AST node.
 * @param {import('typescript').SourceFile|null} sf
 * @param {string|null} text
 * @param {import('typescript').Node|null} node - null anchors at line 0.
 * @returns {never}
 */
export function fail(step, file, sf, text, node, expected, hint) {
  const p = node && sf && text ? posOf(sf, text, node) : { line: 0, col: 0, snippet: '' };
  throw new ExtractionError({
    step,
    file,
    line: p.line,
    col: p.col,
    snippet: p.snippet,
    expected,
    hint,
  });
}

/**
 * Resolve a relative import specifier to an absolute file on disk.
 * @returns {string|null} Absolute path, or null for bare/package imports or misses.
 */
export function resolveImport(fromAbs, spec) {
  if (!spec.startsWith('.')) return null;
  const base = path.resolve(path.dirname(fromAbs), spec);
  const candidates = /\.tsx?$/.test(base)
    ? [base]
    : [`${base}.tsx`, `${base}.ts`, path.join(base, 'index.tsx'), path.join(base, 'index.ts')];
  return candidates.find(c => fs.existsSync(c)) ?? null;
}

/**
 * Map of imported binding name -> module specifier, for one source file.
 * Captures both default and named imports.
 * @returns {Map<string,string>}
 */
export function importMap(sf) {
  const map = new Map();
  for (const stmt of sf.statements) {
    if (!ts.isImportDeclaration(stmt) || !ts.isStringLiteral(stmt.moduleSpecifier)) continue;
    const spec = stmt.moduleSpecifier.text;
    const clause = stmt.importClause;
    if (!clause) continue;
    if (clause.name) map.set(clause.name.text, spec);
    const named = clause.namedBindings;
    if (named && ts.isNamedImports(named))
      for (const el of named.elements) map.set(el.name.text, spec);
  }
  return map;
}
