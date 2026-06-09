---
name: spec-flowchart-viz
description: >-
  Generate a browsable top-down mermaid flowchart for every Playwright e2e spec
  by reading each spec's file-level JSDoc, then assemble them into one tmp
  index.html you can open in a browser. Use this whenever the user wants to
  visualize, diagram, map out, or "see" the e2e test suite / spec flows — e.g.
  "draw flowcharts for the e2e specs", "visualize the test workflows", "make a
  diagram of what each spec does", "render the spec JSDoc as charts", or any
  request to turn the e2e-tests/**/*.spec.ts keynote JSDoc into mermaid
  diagrams. Fans the work out across cheap (haiku) subagents — one per spec —
  so it stays fast and low-cost even on a large suite.
---

# Spec Flowchart Visualizer

Turn the e2e suite's documentation into a picture. Each Playwright spec in this
repo carries a structured file-level JSDoc "keynote" — a `Workflow` action
chain, a `Covers` list of assertions, and a `Modes` (mock / live / skip-live)
section. That structure maps almost perfectly onto a top-down flowchart. This
skill reads those JSDoc blocks (never the test bodies), renders one
`flowchart TD` per spec, and stitches them into a single HTML page.

## Why fan out to cheap subagents

Each spec is independent — reading one JSDoc and emitting one mermaid block is a
small, well-bounded task with no shared state. That's the ideal shape for a
fleet of cheap (`haiku`) subagents running in parallel: the suite has ~15 specs,
and doing them one at a time in the main context would be slow and wasteful. The
main agent only orchestrates and assembles; the per-spec drawing is delegated.

## Workflow

Follow these steps in order. The only model-heavy decision is delegated to the
subagents; your job is orchestration.

### 1. Resolve the spec list and a scratch dir

```bash
# Default scope — all e2e specs. (Accept an optional dir/glob from the user.)
specs=$(cd <repo-root> && ls e2e-tests/**/*.spec.ts 2>/dev/null || \
        find e2e-tests -name '*.spec.ts')
work=$(mktemp -d -t spec-flowcharts-XXXXXX)
echo "$work"
```

Keep the absolute path of each spec and the `$work` dir. Derive a filesystem
slug per spec from its path (e.g. `no-auth/vehicle-create-form.spec.ts` →
`no-auth__vehicle-create-form`).

### 2. Fan out one `haiku` subagent per spec — in a single batch

Spawn them together (multiple Agent tool calls in one message, or a
parallel/pipeline workflow) so they run concurrently. Each subagent gets the
**same prompt template**, varying only the spec path, slug, and `$work` dir.

Use this exact subagent prompt (fill the `<...>` placeholders), and set the
subagent **model to `haiku`** (the cheap tier — this is the whole point):

```
Generate ONE mermaid flowchart from a Playwright e2e spec's file-level JSDoc.

Spec file:   <ABS_SPEC_PATH>
Output file: <WORK>/<SLUG>.mmd
Format guide: <SKILL_DIR>/references/mermaid-from-jsdoc.md

Steps:
1. Find the file-level JSDoc *keynote* and read ONLY that — do NOT read or
   diagram the test bodies. The keynote is the `/** ... */` block whose body has
   the Title / Workflow / Covers / Modes shape, sitting directly above the first
   `test.describe(`/`test(`. Watch out: some specs also have a license header or
   a helper-function JSDoc near the top — the keynote is the LAST `/** */` before
   the first test/describe, the one with the Workflow/Covers/Modes sections, not
   an import-adjacent or helper comment. If you truly find no keynote, see the
   fallback note below rather than diagramming the code.
2. Read the format guide for the exact target shape and escaping rules. Follow
   it precisely — invalid mermaid will fail to render in the browser.
3. Emit a `flowchart TD`: a Mode diamond at the **top** (mock / live / skip-live)
   that flows *down* into the `Flow` subgraph (the Workflow action chain), plus a
   `Covers` cluster of the listed assertions. The mode is the run context, so it
   leads; the format guide shows the exact placement. Keep node labels short; put
   detail in the label, not new nodes.
4. Write ONLY the mermaid to the output file, starting with the two header
   comment lines:
       %% spec: <SPEC_RELPATH>
       %% title: <the JSDoc title line, verbatim>
   Then the `flowchart TD` body. Write nothing to stdout except a one-line
   confirmation.
```

If a spec has **no** file-level JSDoc, the subagent should still write a minimal
`.mmd` with the title set to the spec path and a single node noting "no JSDoc
keynote" — so the gap is visible in the final page rather than silently dropped.

### 3. Build the page

Once every subagent has written its `.mmd`, assemble the HTML with the bundled
script (it reads every `*.mmd` in `$work`, parses the `%% spec:` / `%% title:`
headers, and emits `index.html` with client-side Mermaid via CDN):

```bash
node <SKILL_DIR>/scripts/build_index.mjs "$work"
```

The script prints the path to the generated `index.html`.

### 4. Open it

```bash
xdg-open "$work/index.html" 2>/dev/null &   # Linux
# or: open "$work/index.html"   (macOS)
```

Then tell the user the path and a one-line summary (how many specs charted, any
that lacked a JSDoc keynote).

## Notes

- **Mermaid renders client-side from a CDN**, so opening the page needs network
  access the first time. The raw mermaid source is embedded in the page and is
  shown under a collapsible "source" toggle per spec, so it's still readable
  offline / copy-pasteable even if the CDN is unreachable.
- **Don't read test bodies.** The JSDoc keynote is the intended, curated summary;
  diagramming the implementation instead produces noisy, low-value charts and
  defeats the point of keeping the keynote machine-readable.
- **Re-run is cheap and idempotent** — a fresh `mktemp` dir each time; nothing in
  the repo is modified.
