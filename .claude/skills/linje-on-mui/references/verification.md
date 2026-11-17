# Verifying in Storybook

Code reading misses specificity outcomes, so measure computed styles. State as of MUI 9.5.

## Setup

- Storybook usually runs at http://127.0.0.1:6006. If it doesn't, run `npm run storybook` in
  the main checkout. Vitest browser mode breaks in worktrees, but plain Storybook is fine.
- Story ids: `curl -s http://127.0.0.1:6006/index.json | jq -r '.entries|keys[]'`.
  Load a story through `/iframe.html?id=<id>&viewMode=story`.
- Playwright: `import { chromium } from 'playwright'` in a script under the repo; a scratchpad
  script sits outside it, so it imports `<checkout>/node_modules/playwright/index.mjs`. Put
  scripts and screenshots in the session scratchpad, never in the repo. For the e2e suite
  (version skew on main), run `node node_modules/@playwright/test/cli.js test`.
- `node scripts/measure-fields.mjs <story-id>…`: one JSON line per text field (filled or
  outlined). Set `OUT=<dir>` for full-page screenshots, and `SB=` to point at another
  Storybook.

## Stories that cover the matrix

| Story id | Covers |
|---|---|
| `components-form-layout-formfields--editable` | text, date (pinned label), number, Select |
| `components-form-layout-formfields--read-only` | `readOnly` (`.MuiInputBase-readOnly` / `.Mui-readOnly`) |
| `components-editorframe-fullpage-vehicle-types--edit` | Autocomplete with chips, Selects, switches, empty vs filled labels |
| `components-editorframe-fullpage-vehicle-types--deactivated` | read-only throughout a whole form page |
| `components-editorframe-fullpage-vehicles--edit` / `--create` | vehicle form, required VehicleType picker, the `required` star |
| `components-form-layout-formsections--vehicle-type` | gaps and ≤ 2 per row (`[data-width]`, `[data-section]`, `h2`) |
| `components-entitycollection-vehicles--grid` | small outlined fields: toolbar search and sort, filter panel |
| `pages-home--complete` | header org picker on the navy |

To reach disabled, error or focus states that no story renders, add the state class just
before reading (see Gotchas), or call `locator.focus()` / `hover()`.

## What to measure

Field root: `.MuiFilledInput-root` for form fields, `.MuiOutlinedInput-root` for small ones.
The label is `.MuiInputLabel-root` inside the FormControl.
- **Root**: height, border-radius, padding, background. Border: the filled `box-shadow`
  (`edge()`), or the outlined notch's colour, width and `legend` max-width.
- **Label**: x/y offset from the root, transform, colour, shrink class, overflow.
- **Input**: padding, top and bottom offsets, colour, `-webkit-text-fill-color` (disabled).
- **Select**: text box right edge minus padding vs the `.MuiSelect-icon` left edge. Negative
  means the text clears the arrow.
- **Autocomplete**: chip rects vs the label, and the root height with one row and when
  wrapped. Force wrapping by setting the root's `style.width` to about 230 px.
- **Focus and hover**: `outline-*` on the root, shadow or notch colour. Read-only must not
  change on hover.
- **Gaps**: consecutive `[data-width]` rects (same top means a column gap, otherwise a row
  gap), `h2` to its next sibling, and between `[data-section]` blocks.

Report each measured number with the Linje number next to it, and say "matches" when it does.

## Gotchas

- **Label colour transitions over 200 ms**, unless reduced motion is on. Wait about
  500–800 ms after focusing or adding a class before reading `color`.
- **Injected state classes** (`classList.add('Mui-error')`) last only until React's next render
  (focus or blur). Read right after injecting, wait for the transition, and don't touch
  another field in between.
- MUI 9 renders a **Select's label as a `<div>`**. Query by class, not by `label`.
- An Autocomplete listbox may not mark options `aria-selected=false`, so picking "the first
  unselected" can stall. Force wrapping by width instead.
