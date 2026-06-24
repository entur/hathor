# Mapping a spec JSDoc keynote → mermaid `flowchart TD`

You are turning ONE Playwright spec's file-level JSDoc into ONE top-down mermaid
flowchart. The JSDoc has a predictable shape — a title line, a `Workflow`
section, a `Covers` section, and a `Modes` section. Map them as follows.

## Target structure

The **Mode branch sits at the top** — the mode (mock / live / skip-live) is the
run *context* that is decided before anything happens, so it bubbles up as the
entry point and flows *down* into the shared workflow. Reading top-to-bottom you
see "which mode am I in?" first, then the steps that mode drives. (Putting Mode
at the bottom reads backwards — as if the workflow produces the mode.)

```
%% spec: <relative/path/to/the.spec.ts>
%% title: <the JSDoc title line, verbatim>
flowchart TD
  M{"Mode"}
  M -->|mock| MK["what the mock mode does"]
  M -->|live| LV["what the live mode does"]
  M -->|skip-live| SK["what is skipped live and why"]
  MK --> F1
  LV --> F1
  subgraph Flow["Workflow"]
    direction TB
    F1["first action"] --> F2["next action"]
    F2 --> F3["..."]
  end
  subgraph Covers["Covers"]
    C1["assertion 1"]
    C2["assertion 2"]
  end
```

Both runnable modes (`mock`, `live`) enter the workflow at its first node
(`MK --> F1`, `LV --> F1`), since they share the same flow and only differ in
setup/assertions. **`skip-live` is terminal** — it lists what does *not* run
under live, so it dangles off the Mode diamond and never points into the Flow.
The last Flow node is terminal too; nothing follows the workflow.

## Section-by-section rules

- **Title** → the two `%%` header comment lines only. Mermaid ignores `%%`
  comments, so they never affect rendering; the build script reads them for the
  page heading. Copy the title line verbatim.
- **Modes** → a single `{"Mode"}` diamond **at the top**, fanning to one node per
  mode present (`mock`, `live`, `skip-live`). Omit a branch if that mode isn't
  mentioned. The runnable modes flow *into* the workflow (`MK --> F1`,
  `LV --> F1`); `skip-live` stays terminal. For `mode-agnostic` specs (no
  E2E_BACKEND branching), drop the Mode diamond entirely and put one node
  `MA["mode-agnostic - same under mock and live"]` at the top, feeding the
  workflow (`MA --> F1`).
- **Workflow** → the `Flow` subgraph. Split the arrow-chained (`→`) action
  sequence into one node per step, wired with `-->`. The Workflow notation
  already uses `→` for "then" — turn each `→` into a `-->` edge.
  - If the Workflow branches (a `{decision}` like "clean vs dirty form",
    "config present vs absent"), model it with a `{"..."}` diamond node and
    labelled edges (`-->|clean| ...`, `-->|dirty| ...`).
  - If the file has **two describes / two workflows**, give each its own `Flow`
    subgraph (`Flow1["Workflow — describe 1"]`, `Flow2[...]`). The Mode branches
    enter `Flow1` at its first node; link the last node of `Flow1` to the first
    node of `Flow2` by node id (`F8 --> F9`) so they read top-to-bottom. Don't
    cram both into one chain, and don't link the subgraphs with a re-labelled
    edge.
- **Covers** → the `Covers` subgraph: one leaf node per bullet. These are claims,
  not steps, so leave them unconnected (no edges between `C*` nodes). Keep each
  to a short paraphrase — the goal is a glanceable checklist, not the full
  sentence. If a bullet is flagged `RED` (failing/incomplete coverage), prefix
  its label with `RED: `.

## Escaping rules — follow these or the chart won't render

Mermaid's parser is fussy. Keep every label safe:

- **Always wrap node labels in double quotes**: `F1["goto /vehicles/new"]`.
  Quoting lets you keep slashes, spaces, colons, and `?selected=`-style text.
- Inside a quoted label, **replace any literal `"` with `'`**.
- **Avoid these characters inside labels**: backtick `` ` ``, `#`, `;`, `<`, `>`,
  and the em-dash `—` (use a plain hyphen `-`). They trip the parser or get
  interpreted as HTML/entities.
- Keep `:` only inside quoted labels (e.g. `NMR:VehicleType:int` is fine quoted).
- **Node ids are short and alphanumeric**: `F1..Fn` (flow), `M` (mode diamond),
  `MK`/`LV`/`SK` (modes), `C1..Cn` (covers). Subgraph ids `Flow`, `Covers` (and
  `Flow1`/`Flow2` when two describes). Ids must not collide.
- **Declare each decision/diamond node's shape ONCE, then reference it by bare
  id.** A diamond is `outcome{"dialog closed or error?"}` *one time*; every edge
  after that uses just `outcome` (`F8 --> outcome`, `outcome -->|success| F9`).
  Writing `{outcome}` in an edge is a syntax error — the `{...}` shape braces
  belong only at the single declaration, never when referring back to the node.
  Same rule for the Mode diamond: declare `M{"Mode"}` once, then use bare `M`.
- Prefer fewer, denser nodes: put detail **in** the label rather than spawning
  extra nodes. A good chart is ~6-12 flow nodes, not 30.

## Worked example

Given this real JSDoc keynote (`e2e-tests/vehicle-create-form.spec.ts`):

```
/**
 * /vehicles/new — VehicleEditForm save gates + dirty-form back-nav ...
 * Workflow:
 *   /vehicles/new → fill Registration Number (Save disabled) → fill Vehicle Type ID
 *   (Save enabled) → Save → "View in list" → ?selected= slider resolves → editor-rail
 *   Edit → read back reg + bare transport-type int.
 * Covers:
 *   - Save stays disabled until both reg + Vehicle Type ID are filled
 *   - transportType ref round-trips as prefixed NMR:VehicleType:<int>
 *   - Back on a clean form navigates straight to /vehicles
 *   - Back on a dirty form opens the discard dialog (Cancel stays, Discard navigates)
 *   - Back after a successful save re-baselines → no discard dialog
 *   - A non-numeric existing TransportTypeRef shows raw + read-only
 * Modes:
 *   - mock: wireCreateFlow intercepts createOrUpdateVehicle + stateful list + by-id;
 *     asserts transportType.netexId === EXPECTED_REF
 *   - live: seedAuth JWT + org auto-select (AtB) → real create with unique reg E2E-<ts>
 *   - skip-live: 'non-numeric TransportTypeRef' — fixture-pinned, not reproducible live
 */
```

Produce exactly this (Mode diamond at the top, flowing down into the workflow):

```
%% spec: e2e-tests/vehicle-create-form.spec.ts
%% title: /vehicles/new — VehicleEditForm save gates + dirty-form back-nav
flowchart TD
  M{"Mode"}
  M -->|mock| MK["mock: wireCreateFlow intercepts createOrUpdateVehicle; assert transportType.netexId equals EXPECTED_REF"]
  M -->|live| LV["live: seedAuth + org AtB; real create reg E2E-ts; read back via slider"]
  M -->|skip-live| SK["skip-live: non-numeric TransportTypeRef - fixture-pinned, not run live"]
  MK --> F1
  LV --> F1
  subgraph Flow["Workflow"]
    direction TB
    F1["goto /vehicles/new"] --> F2["fill Registration Number - Save disabled"]
    F2 --> F3["fill Vehicle Type ID - Save enabled"]
    F3 --> F4["Save"]
    F4 --> F5["View in list"]
    F5 --> F6["?selected= slider resolves"]
    F6 --> F7["editor-rail Edit"]
    F7 --> F8["read back reg + transport-type int"]
  end
  subgraph Covers["Covers"]
    C1["Save disabled until reg + Vehicle Type ID filled"]
    C2["transportType round-trips as NMR:VehicleType:int"]
    C3["Back on clean form goes to /vehicles"]
    C4["Back on dirty form opens discard dialog"]
    C5["Back after save re-baselines, no dialog"]
    C6["Non-numeric ref shows raw + read-only"]
  end
```

Write that block (and nothing else) to your output file.
