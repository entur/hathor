# Reading Linje's sources

Use this file to find a number that `components.md` doesn't have yet, or to re-check one.
Linje moves: quote the checkout SHA with any value.

## Where

- **Local checkout**: `~/entur/linje/design-system`. Read at `907aa8a8b` (2026-08); run
  `git log -1` to see the current SHA, and `git pull` when it's stale.
  - Components: `packages/<pkg>/src/*.scss|tsx` (form, dropdown, datepicker, button, chip,
    loader, tooltip, menu, typography…).
  - Docs (Norwegian; "Retningslinjer" = guidelines):
    `apps/documentation/src/pages/komponenter/<group>/<component>.mdx`. Groups: skjemaelementer,
    knapper, feedback, navigasjon, layout-og-flater, reise. Token docs live under
    `apps/documentation/src/pages/tokens/`.
- **Online**: linje.entur.no, and https://linje.entur.no/llms-full.txt for agents.
- **Upstream skills**: https://github.com/entur/design-system/tree/main/skills (installed as
  `entur-linje:*`).

## Tokens (`packages/tokens/src/`)

The files are `primitive.json`, `base.json`, `semantic.json`, `component.json` (515 kB),
`primitiveSize.json` and `legacy-tokens.ts`.
- **Format**: an array of collections, each with `values[]`, and each value has
  `mode.name`.
  - Colour collections: the first mode is **Light**, so the first match of a semantic name is
    light mode.
  - Size collections: modes are Standard / Compact.
- Use `jq`. A recursive Python walk over `component.json` was too slow (it timed out).

```bash
cd ~/entur/linje/design-system/packages/tokens/src
# component colours, light mode
jq -r '.[0].values[0].color[] | select(.name|test("form/Base form";"i")) | "\(.name) = \(.value) (\(.var))"' component.json
# component sizes (height, radius, padding, gap) per density
jq -r '.[] | .values[] | .mode.name as $m | (.number // [])[] | select(.name|test("button|form|chip";"i")) | "\($m)|\(.name) = \(.value)"' component.json
# focus strokes
grep -n -A3 'Stroke/Focus' base.json
```

The CSS variable for a token is the lowercased path with dashes, e.g.
`Components/form/Base form/Standard/Border-Default` → `--components-form-baseform-standard-border-default`.
Each package's `componentVariables.scss` confirms the spelling.

## Two scales that disagree

- **Radius**: the SCSS uses legacy `t.$border-radiuses-medium` = **4 px**
  (`legacy-tokens.ts`). The Figma component tokens (`form/base form/radius/Medium`,
  `button/radius/*`) say **8 / 6 px**. Hathor follows Figma. Say which one you quote.
- **Space** (`legacy-tokens.ts` `spaceScale`): 0 4 8 12 16 24 32 40 48 56 64…
  - `extraSmall2` 4, `extraSmall` 8, `small` 12, `default` / `medium` 16, `large` 24,
    `extraLarge` 32.
  - The spacing doc (`tokens/ovrige-tokens/spacing.mdx`) says M = 16 is the default.
- **Font sizes**: small 12, medium 14, large 16, extraLarge 20, extraLarge2 24.
- **Line heights**: small 16, medium 20, large 22, extraLarge 24.

## Colours used most (light mode)

| Name | Hex |
|---|---|
| Lavender/90 = `Text/Accent`, `Stroke/Accent`, `Fill/Primary/Default/Light` | #181c56 |
| `Fill/Primary/Hover/Light` / `Active/Light` | #393d79 / #11143c |
| `Stroke/Subdued` (field and secondary borders) | #8284ab |
| `Text/Subdued` (field label) | #626493 |
| `Fill/Secondary/Hover/Light` / `Active/Light` | #d9ddf2 / #aeb7e2 |
| `Stroke/Contrast` = focus on navy (Lavender/40) | #aeb7e2 |
| `Text/SubduedAlt` (Blue 30) | #d9dae8 |
| `Stroke/Negative` / on contrast | #d31b1b / #ff9494 |
| `Fill/Disabled/Light` / `Text/Neutral` | #cfd2d4 / #6e6f73 |
