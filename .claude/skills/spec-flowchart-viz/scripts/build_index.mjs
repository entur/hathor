#!/usr/bin/env node
/**
 * build_index.mjs — assemble a browsable HTML page from a directory of `.mmd`
 * mermaid files (one per e2e spec, written by the per-spec subagents).
 *
 * Reads every `*.mmd` in the given work dir, parses the `%% spec:` / `%% title:`
 * header comments each carries, and emits `index.html` rendering all diagrams
 * client-side via Mermaid (loaded from a CDN). Each spec becomes a card: a
 * heading, its `flowchart TD`, and a collapsible raw-source `<details>`.
 *
 * Usage:  node build_index.mjs <work-dir>
 * Prints the absolute path of the generated index.html on success.
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';

// ── Tunables ────────────────────────────────────────────────────────────────
const MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
const OUT_NAME = 'index.html';
const SPEC_RE = /^%%\s*spec:\s*(.+)$/m, TITLE_RE = /^%%\s*title:\s*(.+)$/m;

/**
 * Escape the three characters that are unsafe in HTML text/attribute content.
 * Quotes are intentionally left alone — mermaid needs literal `"` in labels and
 * they are valid inside element text; the browser hands them back verbatim.
 * @param {string} s
 * @returns {string}
 */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Slug → stable DOM id/anchor (alphanumerics and dashes only).
 * @param {string} s
 * @returns {string}
 */
const anchorOf = (s) => s.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();

/**
 * Parse one `.mmd` file into its display metadata + raw mermaid body.
 * @param {string} dir  work dir
 * @param {string} file basename of the .mmd
 * @returns {{spec: string, title: string, code: string}}
 */
const parseMmd = (dir, file) => {
  const code = readFileSync(join(dir, file), 'utf8').trim();
  const spec = (code.match(SPEC_RE)?.[1] ?? basename(file, '.mmd')).trim();
  const title = (code.match(TITLE_RE)?.[1] ?? spec).trim();
  return { spec, title, code };
};

/**
 * Render one spec card (TOC entry returned alongside for the sidebar).
 * @param {{spec: string, title: string, code: string}} d
 * @returns {{card: string, toc: string}}
 */
const card = (d) => {
  const id = anchorOf(d.spec);
  const body = esc(d.code);
  return {
    toc: `<li><a href="#${id}">${esc(d.title)}</a><span class="path">${esc(d.spec)}</span></li>`,
    card: `<section class="card" id="${id}">
  <h2>${esc(d.title)}</h2>
  <p class="path">${esc(d.spec)}</p>
  <pre class="mermaid">${body}</pre>
  <details><summary>mermaid source</summary><pre class="src"><code>${body}</code></pre></details>
</section>`,
  };
};

/**
 * Build the full HTML document.
 * @param {Array<{spec,title,code}>} diagrams
 * @returns {string}
 */
const page = (diagrams) => {
  const parts = diagrams.map(card);
  const stamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>E2E spec flowcharts (${diagrams.length})</title>
<style>
  :root { --bg:#0f1115; --panel:#171a21; --line:#272c38; --fg:#e6e9ef; --mut:#8b93a7; --acc:#5aa9ff; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); font:14px/1.5 ui-sans-serif,system-ui,sans-serif; }
  .wrap { display:grid; grid-template-columns:280px 1fr; min-height:100vh; }
  nav { position:sticky; top:0; align-self:start; height:100vh; overflow:auto; padding:20px 16px; border-right:1px solid var(--line); background:var(--panel); }
  nav h1 { font-size:14px; margin:0 0 4px; }
  nav .meta { color:var(--mut); font-size:12px; margin:0 0 16px; }
  nav ol { list-style:none; margin:0; padding:0; }
  nav li { margin:0 0 10px; }
  nav a { color:var(--fg); text-decoration:none; display:block; }
  nav a:hover { color:var(--acc); }
  nav .path { display:block; color:var(--mut); font-size:11px; font-family:ui-monospace,monospace; }
  main { padding:24px 28px; max-width:1100px; }
  .card { background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:18px 20px; margin:0 0 22px; scroll-margin-top:16px; }
  .card h2 { margin:0 0 2px; font-size:16px; }
  .card .path { margin:0 0 14px; color:var(--mut); font-size:12px; font-family:ui-monospace,monospace; }
  .mermaid { background:#fff; border-radius:8px; padding:14px; overflow:auto; }
  details { margin-top:12px; }
  summary { cursor:pointer; color:var(--mut); font-size:12px; }
  pre.src { background:#0b0d11; border:1px solid var(--line); border-radius:8px; padding:12px; overflow:auto; font:12px/1.45 ui-monospace,monospace; color:#cdd3e0; }
</style>
</head>
<body>
<div class="wrap">
  <nav>
    <h1>E2E spec flowcharts</h1>
    <p class="meta">${diagrams.length} specs · ${stamp}</p>
    <ol>${parts.map((p) => p.toc).join('\n')}</ol>
  </nav>
  <main>${parts.map((p) => p.card).join('\n')}</main>
</div>
<script type="module">
  import mermaid from '${MERMAID_CDN}';
  mermaid.initialize({ startOnLoad: true, theme: 'default', flowchart: { useMaxWidth: true } });
</script>
</body>
</html>
`;
};

// ── Main ─────────────────────────────────────────────────────────────────────
const dir = resolve(process.argv[2] ?? '.');
const files = readdirSync(dir).filter((f) => f.endsWith('.mmd'));
if (files.length === 0) {
  console.error(`No .mmd files found in ${dir}`);
  process.exit(1);
}
const diagrams = files
  .map((f) => parseMmd(dir, f))
  .sort((a, b) => a.spec.localeCompare(b.spec));
const out = join(dir, OUT_NAME);
writeFileSync(out, page(diagrams));
console.log(out);
