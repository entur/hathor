---
name: enki
description: >-
  Reference for aligning hathor with enki — Entur's NPlan frontend (github.com/entur/enki), the
  sibling app hathor's code and design are being brought in line with. Tells you where enki lives
  (local `../enki` checkout or online), where its AGENTS.md is, and how its layout maps onto
  hathor's (`src/scenes` there ≈ `src/data` here, Provider ≈ Organisation, Redux ≈ Context,
  react-intl ≈ i18next, MUI 9 ≈ MUI 7). Use this whenever a task mentions enki, NPlan / Nplan,
  Uttu's frontend, "align with NPlan", "like NPlan does it", "match the other Entur tools", or a
  hathor issue that cites NPlan as the reference (e.g. #185 header alignment) — and also before
  restyling hathor's header, org select, theme tokens, page frame or list/editor layout, since enki
  is the reference for those even when the request doesn't name it.
---

# enki — hathor's alignment reference

Hathor is being aligned to **enki**, the frontend for **Nplan** (Entur's timetable editor for
flexible lines, backed by Uttu). "enki" is the repo, "Nplan" is the product name users see — issues
say NPlan, code says enki. The goal is that Entur's internal tools read as one family, so when a
hathor task says "like NPlan", enki's source is the specification: read it, don't recall it.

## Find enki

```bash
.claude/skills/enki/scripts/enki.sh where          # local checkout path, or the raw GitHub base URL
.claude/skills/enki/scripts/enki.sh ver            # local HEAD vs origin/master — is the checkout stale?
.claude/skills/enki/scripts/enki.sh cat AGENTS.md  # read any repo-relative file
.claude/skills/enki/scripts/enki.sh ls src/scenes  # list any repo-relative dir
```

The script prefers the sibling checkout (`../enki` relative to hathor's main checkout, so it also
works from a `.claude/worktrees/*` session; override with `ENKI_DIR`) and falls back to GitHub when
there is none. With a local checkout, plain `Read`/grep on `../enki/...` is fine and faster.

| | Local | Online |
| --- | --- | --- |
| Repo | `../enki` | <https://github.com/entur/enki> (default branch `master`) |
| Agent guide | `../enki/AGENTS.md` | <https://raw.githubusercontent.com/entur/enki/master/AGENTS.md> |
| Any file | `../enki/<path>` | `https://raw.githubusercontent.com/entur/enki/master/<path>` |
| Extension system | `../enki/src/ext/README.md` | same path under the raw base |

**Start with enki's `AGENTS.md`.** It is that repo's own map (commands, architecture, key concepts)
and is maintained there; this skill only adds the hathor-side translation. Run `enki.sh ver` first
when the answer depends on current enki behaviour — the checkout is a snapshot someone pulled, and
enki ships often.

enki is read-only from a hathor session: it is another team's repo. Changes wanted in enki become
an issue on `entur/enki`, not an edit in `../enki`.

## How the two repos relate

The two are cousins, not strangers. Hathor is a fork of Inanna; enki predates Inanna (2018, as a
stripped-down OP-UI) but was migrated from Entur's `@entur/*` design system to MUI in February 2026
with Inanna as the stated target — commit `c37fc0ec`, "Align layout and design with Inanna/MUI
conventions", which introduced the top `AppBar`, the `Header` component and the theme overrides.
So the shell enki has today is Inanna's shell as refined by the NPlan team, and aligning hathor to
it is mostly closing drift between two descendants of the same design — expect small deltas
(colours, a label, icon style), not a rewrite.

What enki did *not* take from Inanna is its code architecture: no `ViewConfig` /
`GenericDataViewPage`, no Context-based state, no JSON theme. It kept its own Redux + Apollo +
react-intl stack and its `scenes/` layout.

## Translate, don't transplant

Alignment means hathor ends up looking and behaving like enki, written in hathor's idiom. Enki's
`useAppSelector`, `formatMessage`, Apollo hooks, `baseUrl` imports and `Foo/index.tsx` folders have
hathor equivalents — use those. Three things make a straight copy wrong:

- **Different stack.** See the idiom table in `references/map.md`.
- **Different MUI major** (9 vs 7). See `references/shell-and-theme.md` § MUI 9 → 7.
- **Theme lives in JSON here.** An enki theme change in `src/ext/Entur/CustomTheme/theme.ts`
  becomes an edit to `.github/environments/theme-*.json` (plus `src/theme/theme-config.d.ts` if a
  new custom field is needed), not a new TS theme.

Where hathor deliberately differs, the difference stays unless the task says otherwise: the
persistent left Nav Rail (#65) instead of enki's right-side hamburger drawer, the `?selected=`
sidebar editor instead of `/edit/:id` pages, `ViewConfig` tables instead of hand-written ones.
Check `FORK_DECISIONS.md` before "fixing" such a difference — and when an alignment task settles a
non-obvious call (adopt enki's way, or keep hathor's), record it there as an ADR.

## The quick map

| enki | hathor |
| --- | --- |
| `src/scenes/<Entity>/` | `src/data/<feature>/` + `src/pages/GenericDataViewPage.tsx` |
| `src/scenes/App/` (Header, MenuDrawer, Routes, SelectProvider) | `src/App.tsx`, `src/components/header/`, Nav Rail, `SelectOrganisation` |
| `src/model/` | `src/data/<feature>/types/`, `src/data/netex/` |
| `src/api/uttu/` (Apollo) | `src/graphql/vehicles/` (graphql-request) |
| `src/actions/` + `src/reducers/` + `src/store/` | `src/contexts/` + feature `hooks/` |
| `src/ext/Entur/CustomTheme/theme.ts` | `.github/environments/theme-*.json` → `src/theme/createThemeFromConfig.ts` |
| `src/i18n/translations/<loc>.ts` (react-intl) | `src/locales/<loc>/translation.json` (i18next) |
| `public/bootstrap.json` | `public/config.json` |
| `e2e/` (MSW mocks, `:3001`) | `e2e-tests/` (route interception, `:5000`) |
| Provider | Organisation |
| `AGENTS.md` | `CLAUDE.md` |

Full tables — folders, idioms, vocabulary, routes, config, commands, and what has no counterpart —
are in **`references/map.md`**. Read it when the quick map doesn't cover the path in question.

## Aligning a piece of UI

1. Read the hathor issue; note what it scopes out (e.g. #185 excludes enki's hamburger menu).
2. Find the enki counterpart via the map and read the actual source. For the header, select, page
   frame and theme, **`references/shell-and-theme.md`** has the anatomy and values already
   extracted — use it to orient, then confirm against the file it cites.
3. List the deltas as enki-file → hathor-file pairs before editing. Deltas that are data (a logo
   height, an `applicationName`, a palette value) belong in the theme JSON, not in component code.
4. Port in hathor's idiom. Keep hathor's e2e contract intact — `data-testid`s, `#organisation-select`,
   the "Log in" text — because the suite asserts on them and enki's selectors are not ours.
5. New visible strings need both `en` and `nb` keys; reuse an existing hathor key when the value
   matches. Enki's Norwegian wording is a good source for the `nb` text.
6. Verify visually against enki, not just against the diff: run both dev servers (enki `npm start`
   → `:3001` after `cp .github/environments/local.json public/bootstrap.json`; hathor
   `npm run dev` → `:5000`) and compare at desktop and `<sm` widths.

## Keeping this skill true

The tables were verified against enki `0.710.0` (`3f8d31cb`) and hathor `0.103.0`. When you find a
row that no longer holds — a moved file, a new MUI major on either side, a hathor decision that
supersedes a "deliberately differs" note — fix the row in the same change. A stale map is worse
than none, because it gets trusted.
