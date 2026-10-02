# enki shell and theme — the visual reference

Read from enki `0.710.0` (`3f8d31cb`). These are the values hathor aligns its header and theme to
(hathor#185). Re-read the cited enki file before copying a number — this is a snapshot.

## Contents

- [Header anatomy](#header-anatomy)
- [Provider select on the navy bar](#provider-select-on-the-navy-bar)
- [Branding](#branding)
- [Content frame](#content-frame)
- [Theme tokens](#theme-tokens)
- [MUI 9 → 7 when porting](#mui-9--7-when-porting)

## Header anatomy

`src/scenes/App/Header/index.tsx`

```
AppBar position="fixed"  bg = palette.primary.main  color = primary.contrastText
└─ Toolbar  minHeight 64px, flex, align center, default gutters
   ├─ <Link to="/"> logo + app title                      (left)
   ├─ <Box flex=1/>                                        (spacer)
   └─ <Box display=flex align=center gap=0.5>              (right cluster)
      ├─ SelectProvider      minWidth 180, maxWidth 280    (hidden until a provider is selectable)
      ├─ LanguagePickerMenu  IconButton <Language/>        (hidden < sm)
      ├─ user                IconButton <PersonOutlined/>  (hidden < sm) → Popover: name + Logout
      └─ menu                IconButton <Menu/>            → right-side MenuDrawer
```

- Icons are `@mui/icons-material` components at the default 24px inside `IconButton color="inherit"`
  — no badges, no `<img>` icons.
- Order: select → language → user → menu.
- Below `sm` only the select and the menu button remain; language and user move into the drawer.
- The user popover is a `Popover` anchored bottom-right: bold `body2` name, then a full-width
  left-aligned text `Button` with `startIcon={<Logout/>}`.
- The page reserves the bar's height with a sibling `<Toolbar sx={{ minHeight: '64px' }} />`
  (`src/scenes/App/index.tsx`).

## Provider select on the navy bar

The select is a plain `Autocomplete size="small"` + outlined `TextField` **with a visible floating
label** (`src/scenes/App/SelectProvider/SelectProvider.tsx`). The header restyles it from outside
through a wrapper `Box` — the component itself carries no colour:

```ts
sx={{
  minWidth: 180,
  maxWidth: 280,
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.7)' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
  '& .MuiSvgIcon-root': { color: 'white' },
}}
```

Transparent field, light outline/text/caret, label at 70% white going to 100% on focus. Label text:
`navBarDataProvider` = "Choose data provider" / "Velg dataleverandør".

Hathor's counterpart (`src/data/organisations/components/SelectOrganisation.tsx`) differs in three
ways: white-filled field, no visible label (`aria-label` only), colour set inside the component.
e2e depends on `#organisation-select` — keep that id.

## Branding

`src/ext/Entur/CustomLogo/EnturLogo.tsx` — logo `<img>` at `height: 28`, then
`Typography variant="h6"` with `ml: 1`, `fontWeight: 'bold'`, `color: 'inherit'`, text = `appTitle`
("Nplan"). Fallback without an extension is the title alone (`src/scenes/App/DefaultLogo.tsx`).

Hathor's `HeaderBranding.tsx` has the same structure; the deltas are data: `theme.logoHeight` is 20
and `applicationName` is `"App"` in `.github/environments/theme-*.json`.

## Content frame

`src/scenes/App/styles.scss`

| Selector | Rule |
| --- | --- |
| `.app-root` | column flex, `height: calc(100vh - 64px)`, `overflow: hidden` |
| `.app-content` | `flex: 1`, `overflow: auto`, `padding: 24px 32px` |

Detail pages wrap in `components/Page`: text back-button (`ArrowBack`, `mb: 2`), then
`Box mx: 6, my: 3` holding an `h1` title (`mb: 3`) and the body. List scenes are a `Typography`
heading + `Add` button + MUI `Table`; rows are clickable (hover `grey90`, pointer cursor) and
navigate to the editor.

## Theme tokens

`src/ext/Entur/CustomTheme/theme.ts`

| Token | Value |
| --- | --- |
| `primary.main` / `light` / `dark` | `#181c56` / `#8285a8` / `#292b6a`, contrast `#ffffff` |
| `secondary.main` / `light` / `dark` | `#aeb7e2` (lavender) / `#d1d4e3` / `#54568c`, contrast `#181c56` |
| `error.main` / `light` | `#d31b1b` / `#ffcece` |
| `warning.main` / `light` | `#ffca28` / `#fff4cd`, contrast `#121212` |
| `success.main` / `light` | `#1a8e60` / `#d0f1e3` |
| `info.main` / `light` | `#0082b9` / `#e1eff8` |
| `background.default` / `paper` | `#ffffff` |
| `text.primary` / `secondary` / `disabled` | `#121212` / `#646464` / `#949494` |
| `divider` | `#d1d3d3` |
| `shape.borderRadius` | `4` |
| `spacing` | `8` |

Typography — same `"Nationale", Arial, …` stack as hathor. Scale is fixed px:

| Variant | size / weight / line-height |
| --- | --- |
| `h1` | 34 / 600 / 42 |
| `h2` | 28 / 600 / 36 |
| `h3` | 22 / 600 / 30 |
| `h4` | 16 / 600 / 24 |
| `h5`, `subtitle1` | 14 / 600 / 22 |
| `body1` | 16 / 500 / 22 |
| `body2` | 14 / 500 / 22 |
| `caption` | 12 / 500 / 18 |

Component overrides: `MuiButton` `textTransform: none`; `MuiTextField` default `outlined`;
`MuiAppBar` bg `#181c56`; `MuiToolbar` `minHeight: 64`; `MuiTableCell` head `fontWeight: 600`;
`MuiTableRow` hover `#f8f8f8` + pointer.

Where hathor's `theme-dev.json` already disagrees: `secondary.main` is coral `#ff5959` (enki:
lavender, coral is unused in the palette), `info.main` is coral (enki: sky `#0082b9`), `h1` is
`3rem` (enki: 34px), and there are no error/success/warning/text tokens. In hathor these values go
in `.github/environments/theme-*.json`, not in a TS theme file.

## MUI 9 → 7 when porting

enki is on `@mui/material` 9, hathor on 7. Code copied from enki mostly compiles, with these
exceptions (from enki's own upgrade, PR entur/enki#2124):

- **Autocomplete `renderInput`** — enki may read `params.slotProps.input`; MUI 7 exposes
  `params.InputProps`. Translate when the snippet touches input adornments.
- **Theme per-colour Button slots** — enki uses the `variants` API where v7 code would use
  `styleOverrides.containedPrimary` etc. Either works in v7; prefer `variants` so it survives an
  upgrade.
- **System shorthand props** — enki puts `justifyContent`, `fontWeight` and friends in `sx` because
  v9 removed the shorthand props on `Stack`/`Typography`. Keep them in `sx`; it is valid in v7 too.
- **Icon names** — v9 dropped the `*Outline` aliases; use the `*Outlined` names
  (`PersonOutlined`, `HelpOutlined`), which exist in both.
