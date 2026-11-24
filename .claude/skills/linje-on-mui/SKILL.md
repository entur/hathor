---
name: linje-on-mui
description: >-
  Hathor's translation layer from Entur Linje (@entur/* design system) to MUI 9 without
  @entur packages. Per Linje component (TextField, Dropdown, DatePicker, Checkbox, Switch,
  Button, IconButton, SquareButton, Loader, Tooltip…), it gives the MUI component used, what
  the theme (`createThemeFromConfig.ts`) or props must change, values with Linje source,
  status/issue and MUI traps. Also covers the local Linje checkout and tokens, and a
  Storybook + Playwright recipe that measures computed styles. Use it whenever a hathor task
  restyles or reviews fields, labels, helper text, buttons, focus rings, checkboxes or switches, loaders, chips, tooltips,
  the header org picker, or FormSections spacing and widths; when it mentions "Linje",
  linje.entur.no, "Entur design system", eds-, or UU for a visual; or when it asks to verify a
  theme commit in Storybook, even without naming Linje. Also use it before hand-writing
  component behaviour (a parser, key handling, focus) that MUI lacks: it points to Base UI.
  Not for enki/NPlan alignment (use the `enki` skill).
---

# Linje on MUI (hathor)

Hathor uses MUI 9.5 and **never installs an `@entur/*` package**. Linje is the **spec**: copy
its numbers and colours from its docs, the local checkout and the token JSON into the MUI theme.
Then prove the result by measuring computed styles in Storybook, because reading the code alone
misses specificity outcomes. The packages ship Nationale and leak Entur into every fork
(`FORK_DECISIONS.md` 2026-11-19).

## Behaviour: MUI first, then Base UI, never invented

Linje gives the look. Keyboard handling, parsing, focus and ARIA come from a library:
1. **An MUI component**, themed (`components.md`).
2. **If MUI has none, Base UI's headless part** (`@base-ui/react`).
   - Style it with the same theme values, through `sx` or `styled()`, so a theme JSON still
     re-colours it.
   - Leave out the parts Linje lacks, e.g. NumberField's increment and decrement buttons.
3. **Own code** only when neither library has the behaviour, with a `shortcut:` comment that
   names the gap.

Before you write a parser, a key handler or focus management, check Base UI's component list
(https://base-ui.com/react/components). First case: `FormNumberField` (#395), Base UI's
NumberField rendered as the form's TextField.

## Upstream

Entur's own Linje skills are the source of truth for Linje itself:
- On GitHub: https://github.com/entur/design-system/tree/main/skills. They are
  `entur-web-development` (packages, tokens, CSS vars), `entur-accessibility` (WCAG / UU),
  `entur-brand-design` (colours, typography, data viz) and `migrate-react-18`.
- Installed locally as the `entur-linje:*` plugin skills (entry point `entur-linje:entur-linje`).

This skill sits on top of them. It covers how a Linje rule lands in hathor's MUI theme, and
where it doesn't yet.

## References

| File | Read when |
|---|---|
| `references/components.md` | **Start here.** Alphabetical by Linje component: the MUI side, what to adjust, values with their Linje source, status and issue, traps. Its first section covers the theme layout and the cross-cutting traps. |
| `references/reading-linje.md` | You need a Linje number that isn't in components.md. Covers the checkout, the token JSON and `jq` recipes, the legacy-SCSS vs Figma radius difference, the space scale and the docs pages. |
| `references/verification.md` | Verifying a change. Covers Storybook story ids, what to measure and the gotchas. |
| `scripts/measure-fields.mjs` | `node scripts/measure-fields.mjs <story-id>…` prints one JSON line per text field (filled or outlined): label, value, border, outline, chips, Select arrow overlap, helper text. |

## Decided deviations (don't flag them; do flag inconsistent ones)

ADRs at the end of `FORK_DECISIONS.md`.
- **2026-11-17**: form fields are Linje's TextField, built as MUI's **small filled** field
  (48 px, label inside).
- Small fields keep MUI's 40 px **outlined** field with the label in the notch. These are the
  toolbar and the header org picker (enki's style). The filter panel uses form-size fields.
- Native date inputs pin their label at the top.
- **2026-11-16**: Arial in the repo. Nationale ships only from the deployment config.
- The label goes navy on focus and red on error (MUI's colours); Linje keeps it subdued.
  Accepted.
- Read-only fields keep the focus ring, unlike Linje, because they stay in the tab order
  (WCAG 2.4.7).

## Reviewing a change

1. Run `git show <sha>`. Find each touched component in `components.md`.
2. Compare it with the Linje value and source, and check the listed traps:
   - specificity
   - small vs form-size fields
   - Select, Autocomplete chips, multiline
   - disabled, readOnly, error
3. Measure in Storybook (`verification.md`, `scripts/measure-fields.mjs`).
4. Report a short ranked list. Give each finding as `file:line`, then the Linje source, what's
   off, and the minimal fix. Say plainly what matches, and name what you didn't check.
5. If the change moves the code, update `components.md` (status, constants, traps) in the same
   session.

Reviewer role: read-only unless asked. Don't commit or post to GitHub.
