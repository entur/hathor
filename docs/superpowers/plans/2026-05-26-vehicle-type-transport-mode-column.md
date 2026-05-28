# VehicleType TransportMode Column Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an icon-only `TransportMode` column to the `/vehicle-types` list and surface the same icons inside the header filter dropdown for transport-mode filters.

**Architecture:** A new inline SVG sprite (lifted from `concept-sandbox/claude-design.html` on the `ui-sandboxing` branch) mounts once at app root. A `TransportModeIcon` component renders `<svg><use>` against the sprite, applies a per-mode CSS color variable, and gains a single optional `iconPosition: 'left' | 'right'` prop that toggles inline-label rendering. The VehicleType list's view config gains a sortable `transportMode` column; `SearchFilterControl` swaps the plain text label for the icon variant when the filter id is a NeTEx `TransportMode`. Sort and pure-helper logic are unit-tested (vitest); rendered behaviour is covered by a focused Playwright spec.

**Tech Stack:** React 19, TypeScript, MUI v7, Vite, vitest (no jsdom — test env is `node`), Playwright, i18next, graphql-request (not touched here).

---

## Project conventions to honour

- **Pre-commit hook** (`.husky/pre-commit`) runs `npm run check` (Prettier) + `npx lint-staged`. Run `npm run format` after large changes to avoid hook failures.
- **Commit-message gate** (user memory): the executing agent must ask the user "Do you want to scan the diffs in an nvim window first?" before invoking `git commit`. Do not commit silently.
- **Never stage `docs/superpowers/`** — this plan file is working-only; do not include it in any commit.
- **Folder semantics**: new icon primitives belong in `src/components/icons/`. New data-domain code stays under `src/data/vehicle-types/` (Inanna feature-folder convention).
- **Test pattern** (`feedback_evaluate_e2e_per_comment`): UI-visible behaviour → Playwright (`e2e-tests/no-auth/`); pure logic → vitest. There is no React component test infra; do not introduce jsdom.
- **Test env**: `vite.config.ts` sets `test.environment = 'node'`. Vitest tests run under node — keep them React-free.

---

## File structure

| File | Responsibility |
|---|---|
| `src/components/icons/TransportModeSprite.tsx` (NEW) | Hidden `<svg>` block at app root holding 8 `<symbol id="tm-*">` definitions. Mounted once. |
| `src/components/icons/transportModeIconHelpers.ts` (NEW) | Pure helpers: `symbolIdFor(mode)`, `colorVarFor(mode)`. Plain TS — vitest-friendly. |
| `src/components/icons/__tests__/transportModeIconHelpers.test.ts` (NEW) | Vitest unit tests for the helpers. |
| `src/components/icons/TransportModeIcon.tsx` (NEW) | Renders `<svg><use>` with optional inline label; MUI `<Tooltip>` for icon-only mode. |
| `src/theme/transportModeTokens.css` (NEW) | `:root { --tm-bus: …; --tm-tram: …; … --tm-unknown: …; }`. |
| `src/App.tsx` (MODIFY) | Import CSS file; mount `<TransportModeSprite />` adjacent to `<Routes>`. |
| `src/data/vehicle-types/vehicleTypeViewConfig.tsx` (MODIFY) | New column between `name` and `dimensions`. |
| `src/data/vehicle-types/useVehicleTypes.ts` (MODIFY) | `OrderBy` gains `'transportMode'`. |
| `src/data/vehicle-types/vehicleTypeSortValue.ts` (MODIFY) | `getVehicleTypeSortValue` gains `case 'transportMode'`. |
| `src/data/vehicle-types/vehicleTypeSortValue.test.ts` (MODIFY) | New describe block: transportMode sort, blanks-last, alphabetical. |
| `src/components/search/SearchFilterControl.tsx` (MODIFY) | Branch on `isTransportMode(filter.id)` when composing `FormControlLabel.label`. |
| `e2e-tests/no-auth/vehicle-type-transport-mode.spec.ts` (NEW) | Playwright: column renders SVG; filter dropdown shows icon for transport-mode filters. |
| `FORK_DECISIONS.md` (MODIFY) | Append ADR section. |
| `concept-sandbox/README.md` (NEW) | Short stub flagging the sprite mirror to `src/components/icons/TransportModeSprite.tsx`. |

---

### Task 1: Sprite component + color tokens

**Files:**
- Create: `src/components/icons/TransportModeSprite.tsx`
- Create: `src/theme/transportModeTokens.css`

- [ ] **Step 1: Create the color-token CSS file**

Write `src/theme/transportModeTokens.css`:

```css
/**
 * Per-mode color tokens for transport-mode icons.
 *
 * Lifted from concept-sandbox/claude-design.html on the ui-sandboxing branch.
 * Mirror point: src/components/icons/TransportModeSprite.tsx. See
 * FORK_DECISIONS.md → "Transport-mode icon strategy".
 *
 * `--tm-unknown` is the catch-all fallback used by `colorVarFor(mode)` when a
 * mode has no specific token.
 */
:root {
  --tm-bus: #c5044e;
  --tm-tram: #642e88;
  --tm-coach: #8a1414;
  --tm-rail: #00367f;
  --tm-metro: #bf5826;
  --tm-water: #0c6693;
  --tm-air: #800664;
  --tm-trolleyBus: #a11440;
  --tm-cableway: #642e88;
  --tm-funicular: #78469a;
  --tm-taxi: #181c56;
  --tm-unknown: #6a6b78;
}
```

Note: lifted verbatim from POC except `--tm-ferry` renamed to `--tm-water` (NeTEx alignment). `--tm-snowAndIce`, `--tm-lift`: not in POC; covered by the `--tm-unknown` fallback at render time.

- [ ] **Step 2: Create the sprite component**

Write `src/components/icons/TransportModeSprite.tsx`. The `<symbol>` content is mirrored from `concept-sandbox/claude-design.html` lines 2079–2167 on the `ui-sandboxing` branch, with `id="tm-ferry"` renamed to `id="tm-water"` and a new `tm-unknown` symbol appended.

```tsx
/**
 * Hidden SVG sprite holding all `<symbol id="tm-*">` definitions used by
 * `TransportModeIcon`. Mount once at app root.
 *
 * Symbols mirrored from `concept-sandbox/claude-design.html` (lines
 * 2079–2167) on the `ui-sandboxing` branch, with two edits:
 * - `id="tm-ferry"` renamed to `id="tm-water"` to match NeTEx
 *   `TransportModeEnumeration`.
 * - `tm-unknown` symbol added as catch-all fallback for the 6 NeTEx modes
 *   the sandbox sprite never drew (taxi, cableway, funicular, lift,
 *   trolleyBus, snowAndIce) and for the synthetic `'unknown'` mode.
 *
 * Edits to either side of the mirror must be kept in lockstep. See
 * `concept-sandbox/README.md` and `FORK_DECISIONS.md` → "Transport-mode
 * icon strategy".
 */
export default function TransportModeSprite() {
  return (
    <svg style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <symbol id="tm-bus" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 5.4C2 5.18 2.18 5 2.4 5h11.2c.22 0 .4.18.4.4v5.2a.4.4 0 0 1-.4.4h-1.04a1.8 1.8 0 0 0-3.52 0H6.46a1.8 1.8 0 0 0-3.52 0H2.4a.4.4 0 0 1-.4-.4V5.4Zm2 .9a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3H6a.3.3 0 0 0 .3-.3V6.6A.3.3 0 0 0 6 6.3H4Zm3 0a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3H9a.3.3 0 0 0 .3-.3V6.6A.3.3 0 0 0 9 6.3H7Zm3 0a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3H12a.3.3 0 0 0 .3-.3V6.6a.3.3 0 0 0-.3-.3h-2Z"
          />
          <circle cx="4.7" cy="12" r="1" fill="currentColor" />
          <circle cx="11.3" cy="12" r="1" fill="currentColor" />
        </symbol>
        <symbol id="tm-coach" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.4 4.6C1.4 4.27 1.67 4 2 4h12c.33 0 .6.27.6.6v6.4a.4.4 0 0 1-.4.4h-1.04a1.8 1.8 0 0 0-3.52 0H6.46a1.8 1.8 0 0 0-3.52 0H1.8a.4.4 0 0 1-.4-.4V4.6Zm1.9.7a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3h1.9a.3.3 0 0 0 .3-.3V5.6a.3.3 0 0 0-.3-.3H3.3Zm3.25 0a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3h1.9a.3.3 0 0 0 .3-.3V5.6a.3.3 0 0 0-.3-.3h-1.9Zm3.25 0a.3.3 0 0 0-.3.3v1.3c0 .166.134.3.3.3h2a.3.3 0 0 0 .3-.3V5.6a.3.3 0 0 0-.3-.3h-2ZM1.8 9h12.4v.7H1.8V9Z"
          />
          <circle cx="4.5" cy="12" r="1" fill="currentColor" />
          <circle cx="11.5" cy="12" r="1" fill="currentColor" />
        </symbol>
        <symbol id="tm-rail" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 4.6C3 4.27 3.27 4 3.6 4h7.4c.19 0 .37.08.5.21l2.35 2.4c.12.12.19.29.19.46V11.1a.4.4 0 0 1-.4.4h-.94a1.5 1.5 0 0 1-2.94 0H6.84a1.5 1.5 0 0 1-2.94 0H3.4a.4.4 0 0 1-.4-.4V4.6Zm.9.8a.3.3 0 0 1 .3-.3h2.4a.3.3 0 0 1 .3.3v2a.3.3 0 0 1-.3.3H4.2a.3.3 0 0 1-.3-.3v-2Zm4.4 0a.3.3 0 0 1 .3-.3H10c.1 0 .19.05.24.12l1.55 1.9c.11.13.02.34-.15.34H8.6a.3.3 0 0 1-.3-.3v-1.76Z"
          />
          <path fill="currentColor" d="M2 13h12v.6H2z" />
        </symbol>
        <symbol id="tm-tram" viewBox="0 0 16 16">
          <path fill="currentColor" d="M7.7 1.5h.6v1.2h-.6z" />
          <path fill="currentColor" d="M5.5 2.7h5v.6h-5z" />
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.6 4C3.27 4 3 4.27 3 4.6v6.4c0 .22.18.4.4.4h.54a1.8 1.8 0 0 0 3.52 0H8.54a1.8 1.8 0 0 0 3.52 0h.54a.4.4 0 0 0 .4-.4V4.6c0-.33-.27-.6-.6-.6H3.6Zm.7 1.7a.3.3 0 0 1 .3-.3H7a.3.3 0 0 1 .3.3v1.8A.3.3 0 0 1 7 7.8H4.6a.3.3 0 0 1-.3-.3V5.7Zm5 0a.3.3 0 0 1 .3-.3h2.1a.3.3 0 0 1 .3.3v1.8a.3.3 0 0 1-.3.3H9.6a.3.3 0 0 1-.3-.3V5.7Z"
          />
          <circle cx="5.7" cy="11.5" r=".9" fill="currentColor" />
          <circle cx="10.3" cy="11.5" r=".9" fill="currentColor" />
          <path fill="currentColor" d="M2 13.6h12v.5H2z" />
        </symbol>
        <symbol id="tm-metro" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2Z"
          />
          <path fill="currentColor" d="M5 5h6v1.2H8.6V12H7.4V6.2H5z" />
        </symbol>
        <symbol id="tm-water" viewBox="0 0 16 16">
          <path fill="currentColor" d="M7 3.2h2v1.6H7z" />
          <path fill="currentColor" d="M5.5 5h5l.5 1.5h-6z" />
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.5 7h11l-.6 1.8a.5.5 0 0 1-.47.34H3.57a.5.5 0 0 1-.47-.34L2.5 7Z"
          />
          <path
            fill="currentColor"
            d="M1.5 10.3l.25.55c.26.56.85.9 1.46.84.5-.05.98-.29 1.34-.66.2-.21.54-.21.74 0 .36.37.84.61 1.34.66.5.05 1.01-.09 1.4-.4a.55.55 0 0 1 .66 0c.4.31.9.45 1.4.4.5-.05.98-.29 1.34-.66.2-.21.54-.21.74 0 .36.37.84.61 1.34.66.61.06 1.2-.28 1.46-.84l.25-.55-1-.35-.1.24c-.1.22-.33.35-.56.32a.8.8 0 0 1-.57-.28 1.32 1.32 0 0 0-1.86 0 .8.8 0 0 1-.57.28c-.22.03-.45-.07-.58-.24a1.57 1.57 0 0 0-1.78 0c-.13.17-.36.27-.58.24a.8.8 0 0 1-.57-.28 1.32 1.32 0 0 0-1.86 0 .8.8 0 0 1-.57.28c-.23.03-.46-.1-.56-.32l-.1-.24-1 .35Z"
          />
        </symbol>
        <symbol id="tm-air" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.6 6.3a.6.6 0 0 1-.36.56L5.1 10.6a.4.4 0 0 1-.43-.08L2.3 8.2c-.24-.23-.1-.63.24-.65l1.2-.07 1.8.8L7.7 7.44l-3.1-1.5a.2.2 0 0 1 .04-.37l.9-.22c.12-.03.25 0 .35.06L9 7.05l4.2-1.86c.51-.23 1.1-.05 1.4.4.03.05.05.12.05.2v.51Z"
          />
          <path fill="currentColor" d="M2 13h12v.6H2z" />
        </symbol>
        <symbol id="tm-unknown" viewBox="0 0 16 16">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2Z"
          />
          <path
            fill="currentColor"
            d="M6.2 6.4c0-1 .8-1.8 1.9-1.8s1.9.8 1.9 1.8c0 .7-.4 1.2-1 1.5-.6.3-.9.6-.9 1v.5H7v-.6c0-.7.4-1.1 1-1.4.4-.2.7-.5.7-.9 0-.5-.4-.9-.9-.9s-.9.4-.9.9H6.2Zm1.3 4.5h1.1V12H7.5v-1.1Z"
          />
        </symbol>
      </defs>
    </svg>
  );
}
```

The `attribute`-style props in TSX use camelCase (`fillRule`, `clipRule`, `viewBox`, `fillRule`). React's JSX SVG dialect requires this — the lifted strings from the HTML source must be transliterated. Double-check every `fill-rule` → `fillRule`, every `clip-rule` → `clipRule`, every `fill-` and `clip-` attribute on every path.

- [ ] **Step 3: Sanity-check the files compile**

Run: `npm run build`
Expected: PASS (Vite TS compile + bundle). No new files are referenced yet from the app, so the build proves only that the new files type-check.

- [ ] **Step 4: Commit**

```bash
git add src/components/icons/TransportModeSprite.tsx src/theme/transportModeTokens.css
git commit -m "transport-mode: add inline SVG sprite + color tokens (#23)"
```

---

### Task 2: Pure helpers for symbol id + color var

**Files:**
- Create: `src/components/icons/transportModeIconHelpers.ts`
- Create: `src/components/icons/__tests__/transportModeIconHelpers.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/components/icons/__tests__/transportModeIconHelpers.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { symbolIdFor, colorVarFor, SPRITE_MODES } from '../transportModeIconHelpers.ts';

describe('symbolIdFor', () => {
  it('returns the mode unchanged when the sprite has a matching <symbol>', () => {
    expect(symbolIdFor('bus')).toBe('bus');
    expect(symbolIdFor('rail')).toBe('rail');
    expect(symbolIdFor('water')).toBe('water');
    expect(symbolIdFor('unknown')).toBe('unknown');
  });

  it('falls back to "unknown" for modes the sprite has not drawn yet', () => {
    expect(symbolIdFor('taxi')).toBe('unknown');
    expect(symbolIdFor('cableway')).toBe('unknown');
    expect(symbolIdFor('funicular')).toBe('unknown');
    expect(symbolIdFor('lift')).toBe('unknown');
    expect(symbolIdFor('trolleyBus')).toBe('unknown');
    expect(symbolIdFor('snowAndIce')).toBe('unknown');
  });
});

describe('colorVarFor', () => {
  it('returns a var() CSS expression with --tm-unknown as fallback', () => {
    expect(colorVarFor('bus')).toBe('var(--tm-bus, var(--tm-unknown))');
    expect(colorVarFor('rail')).toBe('var(--tm-rail, var(--tm-unknown))');
    expect(colorVarFor('snowAndIce')).toBe('var(--tm-snowAndIce, var(--tm-unknown))');
    expect(colorVarFor('unknown')).toBe('var(--tm-unknown, var(--tm-unknown))');
  });
});

describe('SPRITE_MODES', () => {
  it('contains exactly the 8 modes drawn in TransportModeSprite.tsx', () => {
    expect(SPRITE_MODES).toEqual(
      new Set(['bus', 'coach', 'rail', 'tram', 'metro', 'water', 'air', 'unknown'])
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/icons/__tests__/transportModeIconHelpers.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the helpers**

Create `src/components/icons/transportModeIconHelpers.ts`:

```ts
/**
 * Pure helpers backing `TransportModeIcon`. Extracted so the resolution
 * logic is testable under vitest's `node` environment without dragging in
 * a DOM. See FORK_DECISIONS.md → "Transport-mode icon strategy".
 */
import type { TransportMode } from '../../data/netex/transportMode.ts';

/**
 * The set of modes `TransportModeSprite.tsx` actually draws. Any mode
 * outside this set falls back to the `tm-unknown` placeholder symbol.
 * Keep in lockstep with `TransportModeSprite.tsx`.
 */
export const SPRITE_MODES: ReadonlySet<TransportMode> = new Set<TransportMode>([
  'bus',
  'coach',
  'rail',
  'tram',
  'metro',
  'water',
  'air',
  'unknown',
]);

/** Resolve the `<symbol>` id for a mode. Returns `'unknown'` for any mode not yet in the sprite. */
export const symbolIdFor = (mode: TransportMode): TransportMode =>
  SPRITE_MODES.has(mode) ? mode : 'unknown';

/**
 * CSS color expression for a mode. The two-tier `var()` chain lets a missing
 * `--tm-<mode>` token fall through to `--tm-unknown` without forcing every
 * NeTEx mode to ship its own color.
 */
export const colorVarFor = (mode: TransportMode): string =>
  `var(--tm-${mode}, var(--tm-unknown))`;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/icons/__tests__/transportModeIconHelpers.test.ts`
Expected: PASS — all three describe blocks green.

- [ ] **Step 5: Commit**

```bash
git add src/components/icons/transportModeIconHelpers.ts \
        src/components/icons/__tests__/transportModeIconHelpers.test.ts
git commit -m "transport-mode: add pure helpers for icon resolution (#23)"
```

---

### Task 3: TransportModeIcon component

**Files:**
- Create: `src/components/icons/TransportModeIcon.tsx`

This component is rendered code — no DOM-level vitest because the project does not run jsdom. Coverage is the Playwright spec in Task 8 plus the unit-tested helpers from Task 2.

- [ ] **Step 1: Write the component**

Create `src/components/icons/TransportModeIcon.tsx`:

```tsx
import { Tooltip, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  transportModeLabelKey,
  type TransportMode,
} from '../../data/netex/transportMode.ts';
import { symbolIdFor, colorVarFor } from './transportModeIconHelpers.ts';

const ICON_SIZE = 16;

type TransportModeIconProps = {
  mode: TransportMode;
  /**
   * When set, render the localized label inline with the icon on the given
   * side. When omitted, render icon only — the label is exposed as
   * `aria-label` and surfaced via a MUI tooltip on hover.
   */
  iconPosition?: 'left' | 'right';
};

/**
 * Render a NeTEx TransportMode glyph. Backed by the inline SVG sprite in
 * `TransportModeSprite.tsx`. Three rendering modes:
 *
 * - `iconPosition` omitted → icon only with tooltip + `aria-label`
 * - `iconPosition === 'left'`  → `[icon] [label]`
 * - `iconPosition === 'right'` → `[label] [icon]`
 *
 * The visible/tooltip label comes from the existing `transportMode.*` i18n
 * keys via `transportModeLabelKey(mode)`. No `label` prop override — the
 * locale is the single source of truth.
 */
export default function TransportModeIcon({ mode, iconPosition }: TransportModeIconProps) {
  const { t } = useTranslation();
  const label = t(transportModeLabelKey(mode), mode);

  const svg = (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      aria-hidden={iconPosition !== undefined ? true : undefined}
      aria-label={iconPosition === undefined ? label : undefined}
      role="img"
      style={{ color: colorVarFor(mode), flexShrink: 0 }}
    >
      <use href={`#tm-${symbolIdFor(mode)}`} />
    </svg>
  );

  if (iconPosition === undefined) {
    return <Tooltip title={label}>{svg}</Tooltip>;
  }

  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      {iconPosition === 'left' ? svg : null}
      <span>{label}</span>
      {iconPosition === 'right' ? svg : null}
    </Box>
  );
}
```

Notes for the implementer:
- The `aria-label` toggle: icon-only carries the label (a11y); inline-label hides the icon from screen readers because the adjacent text already carries the semantics.
- `flexShrink: 0` on the SVG prevents collapse in narrow flex containers (filter dropdown row).
- `role="img"` keeps the SVG announceable even when wrapped in MUI Tooltip's `<button>` sometimes-added wrapper.
- `Tooltip` requires its child to forward `ref`. Native `<svg>` does — no `<span>` wrap needed.

- [ ] **Step 2: Verify the component type-checks**

Run: `npx tsc -b`
Expected: PASS. No new TS errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/icons/TransportModeIcon.tsx
git commit -m "transport-mode: TransportModeIcon component with iconPosition prop (#23)"
```

---

### Task 4: Mount the sprite and the CSS in the app

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add the imports and mount the sprite**

In `src/App.tsx`, add the import and CSS side-effect:

Top of the file, after the existing imports:

```tsx
import TransportModeSprite from './components/icons/TransportModeSprite.tsx';
import './theme/transportModeTokens.css';
```

Inside the JSX, place `<TransportModeSprite />` adjacent to `<Routes>`. The cleanest spot is right above the `<Routes>` opening tag, inside the same `<Box className="app-content">`:

Find this block (currently at `src/App.tsx:36-65`):

```tsx
<Box className="app-content">
  <Routes>
    ...
  </Routes>
</Box>
```

Replace with:

```tsx
<Box className="app-content">
  <TransportModeSprite />
  <Routes>
    ...
  </Routes>
</Box>
```

The `<TransportModeSprite />` renders an invisible `<svg style="display:none">`, so its position in the layout tree is purely structural — it just needs to be in the DOM before any `<use href="#tm-…">` reference resolves.

- [ ] **Step 2: Run the dev server and visually smoke-check**

Run: `npm run dev`
Open `http://localhost:5000/` in a browser, then open DevTools → Elements panel and confirm:
- a `<svg style="display: none">` element exists inside `<div class="app-content">`
- it contains 8 `<symbol>` children with ids `tm-bus, tm-coach, tm-rail, tm-tram, tm-metro, tm-water, tm-air, tm-unknown`
- Computed styles on `:root` include `--tm-bus`, `--tm-tram`, etc.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "transport-mode: mount sprite + tokens in App.tsx (#23)"
```

---

### Task 5: Sort by transportMode (TDD)

**Files:**
- Modify: `src/data/vehicle-types/vehicleTypeSortValue.test.ts`
- Modify: `src/data/vehicle-types/useVehicleTypes.ts`
- Modify: `src/data/vehicle-types/vehicleTypeSortValue.ts`

- [ ] **Step 1: Extend the test file with failing transportMode cases**

At the bottom of the existing `describe('compareVehicleTypes', …)` block in `src/data/vehicle-types/vehicleTypeSortValue.test.ts`, append:

```ts
  it('sorts by transportMode alphabetically by NeTEx id, locale-independent', () => {
    const rows = [
      mk({ id: 'a', transportMode: 'tram' }),
      mk({ id: 'b', transportMode: 'bus' }),
      mk({ id: 'c', transportMode: 'rail' }),
    ];
    const sorted = [...rows].sort(compareVehicleTypes('transportMode', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['b', 'c', 'a']);
  });

  it('parks rows with no transportMode at the end on asc (regression: empty-last)', () => {
    const rows = [
      mk({ id: 'no-mode-1', transportMode: undefined }),
      mk({ id: 'bus', transportMode: 'bus' }),
      mk({ id: 'no-mode-2', transportMode: undefined }),
      mk({ id: 'rail', transportMode: 'rail' }),
    ];
    const sorted = [...rows].sort(compareVehicleTypes('transportMode', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['bus', 'rail', 'no-mode-1', 'no-mode-2']);
  });

  it('parks rows with no transportMode at the end on desc as well', () => {
    const rows = [
      mk({ id: 'no-mode', transportMode: undefined }),
      mk({ id: 'bus', transportMode: 'bus' }),
      mk({ id: 'rail', transportMode: 'rail' }),
    ];
    const sorted = [...rows].sort(compareVehicleTypes('transportMode', 'desc'));
    expect(sorted.map(r => r.id)).toEqual(['rail', 'bus', 'no-mode']);
  });

  it('treats backend strings outside the NeTEx enum as unknown (empty-last)', () => {
    const rows = [
      mk({ id: 'garbage', transportMode: 'not-a-real-mode' }),
      mk({ id: 'bus', transportMode: 'bus' }),
    ];
    const sorted = [...rows].sort(compareVehicleTypes('transportMode', 'asc'));
    expect(sorted.map(r => r.id)).toEqual(['bus', 'garbage']);
  });
```

The existing `mk()` helper already spreads `over` onto the row; passing `transportMode` works without changes.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/data/vehicle-types/vehicleTypeSortValue.test.ts`
Expected: FAIL. Four new tests fail because `compareVehicleTypes` hits the `_exhaustive: never` branch when the key is `'transportMode'`, or because TypeScript flags the literal as not assignable to `OrderBy`.

- [ ] **Step 3: Add `'transportMode'` to the OrderBy union**

In `src/data/vehicle-types/useVehicleTypes.ts`, change:

```ts
export type OrderBy = 'name' | 'id' | 'dimensions' | 'deckPlanName';
```

to:

```ts
export type OrderBy = 'name' | 'id' | 'dimensions' | 'deckPlanName' | 'transportMode';
```

- [ ] **Step 4: Add the sort case**

In `src/data/vehicle-types/vehicleTypeSortValue.ts`, add the imports at the top:

```ts
import { toTransportMode, transportModeSortValue } from '../netex/transportMode.ts';
```

Then insert a new `case` inside the switch, between `'deckPlanName'` and the `default`:

```ts
    case 'transportMode':
      return transportModeSortValue(toTransportMode(item.transportMode));
```

`toTransportMode()` normalises `undefined`/null/non-enum strings to `'unknown'`; `transportModeSortValue()` returns `''` for `'unknown'` and the raw NeTEx id otherwise. `compareWithEmptyLast` handles the empty-last sink.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/data/vehicle-types/vehicleTypeSortValue.test.ts`
Expected: PASS — all describe blocks green, including the new transportMode tests.

- [ ] **Step 6: Commit**

```bash
git add src/data/vehicle-types/useVehicleTypes.ts \
        src/data/vehicle-types/vehicleTypeSortValue.ts \
        src/data/vehicle-types/vehicleTypeSortValue.test.ts
git commit -m "vehicle-types: sort by transportMode (#23)"
```

---

### Task 6: Wire the column into vehicleTypeViewConfig

**Files:**
- Modify: `src/data/vehicle-types/vehicleTypeViewConfig.tsx`

- [ ] **Step 1: Add the imports**

At the top of `src/data/vehicle-types/vehicleTypeViewConfig.tsx`, add:

```tsx
import TransportModeIcon from '../../components/icons/TransportModeIcon.tsx';
import { toTransportMode } from '../netex/transportMode.ts';
```

- [ ] **Step 2: Add the column definition between `name` and `dimensions`**

Find the existing column array (currently `vehicleTypeViewConfig.tsx:23-73`). Insert a new entry between the `'name'` entry and the `'dimensions'` entry:

```tsx
  {
    id: 'transportMode',
    headerLabel: 'Transport Mode',
    isSortable: true,
    renderCell: item => <TransportModeIcon mode={toTransportMode(item.transportMode)} />,
    align: 'center',
    display: 'always',
  },
```

`headerLabel` is a bare English literal to match adjacent columns on this page (`'Name'`, `'Dimensions'`, etc.). `DataTableHeader` runs `t(headerLabel, headerLabel)`, so the literal falls through cleanly.

- [ ] **Step 3: Run the dev server and check the column**

Run: `npm run local` (points at localhost Sobek). Open `http://localhost:5000/vehicle-types`.

Visually confirm:
- A new column `Transport Mode` sits between `Name` and `Dimensions`.
- Each row shows an icon centred in the cell.
- Hovering over an icon shows a tooltip with the localized mode label.
- The column header is clickable and sorts; rows with no `transportMode` (or an unrecognised value) collect at the end on both asc and desc.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/data/vehicle-types/vehicleTypeViewConfig.tsx
git commit -m "vehicle-types: add TransportMode column (#23)"
```

---

### Task 7: Wire the filter dropdown to use icons for transport-mode filters

**Files:**
- Modify: `src/components/search/SearchFilterControl.tsx`

- [ ] **Step 1: Add the imports**

At the top of `src/components/search/SearchFilterControl.tsx`, add:

```tsx
import { isTransportMode } from '../../data/netex/transportMode.ts';
import TransportModeIcon from '../icons/TransportModeIcon.tsx';
```

- [ ] **Step 2: Branch the `FormControlLabel.label` on isTransportMode**

Find the `<FormControlLabel>` block (currently lines 74–84). Replace its `label` prop:

Currently:

```tsx
<FormControlLabel
  key={type.id}
  control={
    <Checkbox
      checked={activeFilters.includes(type.id)}
      onChange={e => handleFilterChange(type.id, e.target.checked)}
      size="small"
    />
  }
  label={t(type.labelKey, type.defaultLabel)}
/>
```

Change to:

```tsx
<FormControlLabel
  key={type.id}
  control={
    <Checkbox
      checked={activeFilters.includes(type.id)}
      onChange={e => handleFilterChange(type.id, e.target.checked)}
      size="small"
    />
  }
  label={
    isTransportMode(type.id)
      ? <TransportModeIcon mode={type.id} iconPosition="left" />
      : t(type.labelKey, type.defaultLabel)
  }
/>
```

`isTransportMode` already narrows `type.id: string` to `TransportMode`, so the prop type-checks.

- [ ] **Step 3: Run the dev server and verify the filter dropdown**

Run: `npm run local`. Open `http://localhost:5000/vehicles` (the page that registers `transportModeFilters`). Click the filter icon in the header.

Visually confirm:
- Each checkbox row shows a coloured icon to the left of the localized label.
- The 6 NeTEx modes the sprite doesn't draw (`taxi, cableway, funicular, lift, trolleyBus, snowAndIce`) show the gray `tm-unknown` icon next to the right label.
- Toggling a checkbox still filters the list as before.

Open `http://localhost:5000/vehicle-types` and re-open the filter dropdown. Confirm that page's filters (which are NOT TransportMode-typed — `parentVehicleType`, `railVehicle`, etc.) still render as plain text labels.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/search/SearchFilterControl.tsx
git commit -m "search: render transport-mode icons in filter dropdown (#23)"
```

---

### Task 8: Playwright spec for column + filter-dropdown icons

**Files:**
- Create: `e2e-tests/no-auth/vehicle-type-transport-mode.spec.ts`

This is a focused regression spec. It runs in the `no-auth` suite and serves two purposes: (a) the column renders an SVG inside each row; (b) the filter dropdown on `/vehicles` shows the icon variant.

- [ ] **Step 1: Inspect an existing no-auth spec to match style and helpers**

Open `e2e-tests/no-auth/vehicle-type-filter.spec.ts` and `e2e-tests/no-auth/no-auth.spec.ts` to confirm:
- the import style for `config-no-auth.json` setup,
- the route-mock / fixture pattern (look for `route()` calls and any `vehicle-types-mock.json` usage),
- the `beforeAll` / `beforeEach` boilerplate that swaps `public/config.json`.

This is just to match conventions before writing the new spec.

- [ ] **Step 2: Write the spec**

Create `e2e-tests/no-auth/vehicle-type-transport-mode.spec.ts`. Use the same fixture-and-mock pattern the sibling specs use. The spec body:

```ts
import { test, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configNoAuth = path.resolve(__dirname, '../fixtures/config-no-auth.json');
const configTarget = path.resolve(__dirname, '../../public/config.json');

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
  fs.copyFileSync(configNoAuth, configTarget);
});

test('TransportMode column renders an SVG per row on /vehicle-types', async ({ page }) => {
  await page.goto('/vehicle-types');
  // Wait for the first data row to appear.
  const firstRow = page.locator('tbody tr').first();
  await expect(firstRow).toBeVisible();

  // The new column shows an <svg> with role="img" inside each row.
  const icon = firstRow.locator('svg[role="img"]').first();
  await expect(icon).toBeVisible();

  // Symbol id is bound via <use href="#tm-…">
  const useEl = icon.locator('use');
  const href = await useEl.getAttribute('href');
  expect(href).toMatch(/^#tm-(bus|coach|rail|tram|metro|water|air|unknown)$/);
});

test('Filter dropdown on /vehicles renders an icon next to each transport-mode label', async ({ page }) => {
  await page.goto('/vehicles');
  await page.getByTestId('search-filter-button').click();

  // Each checkbox row contains a label that's now an <svg> + text.
  const labels = page.locator('label.MuiFormControlLabel-root');
  await expect(labels.first()).toBeVisible();

  // Every visible filter row should expose an <svg> (the TransportModeIcon).
  const count = await labels.count();
  for (let i = 0; i < count; i++) {
    const svg = labels.nth(i).locator('svg[role="img"]');
    await expect(svg).toBeVisible();
  }
});
```

Notes:
- The `data-testid="search-filter-button"` already exists on the filter `IconButton` (see `SearchFilterControl.tsx:54`).
- The `mode: 'serial'` is consistent with other no-auth specs that mutate `public/config.json`.
- No new fixture is needed; the existing `config-no-auth.json` suffices.

- [ ] **Step 3: Run the spec**

Run: `npm run e2e:no-auth -- vehicle-type-transport-mode.spec.ts`
Expected: PASS — both tests green.

If the first test fails because the page lacks a Sobek backend, mock the GraphQL response by adding a `page.route('**/graphql', …)` setup that reads `e2e-tests/fixtures/vehicle-types-mock.json` — follow the exact pattern in `vehicle-type-filter.spec.ts`.

- [ ] **Step 4: Commit**

```bash
git add e2e-tests/no-auth/vehicle-type-transport-mode.spec.ts
git commit -m "e2e: cover transportMode column + filter dropdown icons (#23)"
```

---

### Task 9: ADR + sandbox mirror note

**Files:**
- Modify: `FORK_DECISIONS.md`
- Create: `concept-sandbox/README.md`

- [ ] **Step 1: Append the ADR to `FORK_DECISIONS.md`**

Open `FORK_DECISIONS.md`. Append at the end (after the last section, separated by a `---` rule that matches the existing layout):

```markdown
---

## Transport-mode icon strategy: inline SVG sprite over file-per-icon _(2026-05-26)_

### Context

VehicleType list (#23) and Vehicle list (#24, partially shipped via #26)
both need to render a `TransportMode` cell. Two infrastructures were on
the table:

1. Hathor's existing two-tier icon resolver (`src/utils/iconLoaderUtils.ts`),
   which serves menu/settings/home icons from `defaultIcons/` with optional
   `customIcons/` override.
2. The inline SVG sprite developed in
   `concept-sandbox/claude-design.html` on the `ui-sandboxing` branch, with
   `<symbol id="tm-…">` defs and per-mode `--tm-<mode>` CSS color tokens.

The 2026-05-11 brainstorming on #23 picked option 1. That decision was
never codified here; it lived only in the issue body. As of 2026-05-26,
with the sprite POC visually settled and the per-mode color dimension
confirmed as a UX requirement, we are landing the sprite choice formally
and recording file-per-icon as the considered alternative.

### Decision

Transport-mode icons render via a single inline SVG sprite, mounted once
at app root. The sprite is the **only** rendering primitive for
transport-mode icons; they do not go through `getIconUrl()`.

Concrete contract:

- `src/components/icons/TransportModeSprite.tsx` mounts a hidden
  `<svg style="display:none"><defs><symbol id="tm-…"></defs></svg>` block
  at app root.
- `src/components/icons/TransportModeIcon.tsx` is the rendering primitive:
  `<svg><use href={`#tm-${mode}`}/></svg>` with
  `color: var(--tm-${mode}, var(--tm-unknown))`. Symbol-level fallback maps
  any mode not in the sprite to `#tm-unknown`. The component exposes a
  single optional prop `iconPosition: 'left' | 'right'` that, when set,
  renders the localized label inline.
- Per-mode color tokens (`--tm-bus`, `--tm-tram`, …) live in
  `src/theme/transportModeTokens.css`, imported once. Future move into
  the theme JSON loader is out of scope.
- Norway-specific glyph variants (T-banen, etc.) are modelled as
  alternate symbol ids (`tm-metro-nb`), toggled in the same component by
  the existing `useCustomFeatures` flag. They are NOT served via
  `customIcons/`.
- `iconLoaderUtils.ts` and the `defaultIcons/` + `customIcons/` two-tier
  remain untouched and continue to serve every other icon class (menu,
  settings, home, etc.).

### Alternatives considered

| Option | Why rejected |
|---|---|
| **File-per-icon via `getIconUrl`** (the original 2026-05-11 pick) | Forces hand-tinted SVGs for the 15 NeTEx modes (no `currentColor` route), 15× the asset work for the same visual result. The `customIcons/` two-tier was attractive as Norway-variant mechanism, but alternate `<symbol>` ids do the same job without runtime FS access. |
| **MUI `<DirectionsBus />` etc. inline** | Bypasses the asset pipeline entirely but loses fine control over visual weight and per-mode color tokens. Couples the cell shape to MUI's icon-naming taxonomy. |
| **Lift sprite AND keep `customIcons/<mode>.svg` override** | Double mechanism. The cell would need to choose between sprite and resolver per mode, doubling surface area for no current consumer. YAGNI. |

### Consequences

- Hathor's `iconLoaderUtils.ts` remains byte-identical to Inanna's. The
  divergence is purely additive: a new component class that Inanna doesn't
  yet have.
- Inanna issue #5's `getIconKey` resolver-prop refactor still applies to
  every other icon class; transport modes are simply outside its scope.
- Adding a new transport-mode glyph is a single PR that adds a `<symbol>`
  block to `TransportModeSprite.tsx` plus a `--tm-<mode>` token. No file
  drop into `defaultIcons/`, no resolver change.
- The `concept-sandbox/claude-design.html` POC is now the canonical
  source for the lifted symbol shapes. The sandbox itself is unchanged;
  only its sprite block is mirrored into `src/components/icons/`.
- Future filter chips (#24) reuse `TransportModeIcon` directly, so the
  icon dimension on `/vehicles` can be added later without changing the
  cell layer.

### Out of scope

- Theme integration of `--tm-*`.
- Norway-variant `<symbol>` blocks.
- Reuse on the existing `/vehicles` `TransportModeChip` cell.
```

- [ ] **Step 2: Create the sandbox README stub**

Create `concept-sandbox/README.md`:

```markdown
# concept-sandbox/

Throwaway visual POCs hosted as static HTML. Iterates outside the React app
so design moves can be sketched fast.

## Production mirrors

Some chunks of this directory are **upstream of production code**. Edits to
either side need to be mirrored:

| Source in this dir | Mirrored to (production) |
|---|---|
| `claude-design.html` — `<svg style="display:none">` sprite block (lines ≈ 2079–2167 on the `ui-sandboxing` branch) | `src/components/icons/TransportModeSprite.tsx` |

See `FORK_DECISIONS.md` → "Transport-mode icon strategy" for the rationale
and the rules around adding new transport-mode glyphs.
```

- [ ] **Step 3: Run the full check + test suite**

Run: `npm run check && npm run lint && npm test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add FORK_DECISIONS.md concept-sandbox/README.md
git commit -m "docs: ADR for sprite-based transport-mode icons; sandbox mirror note (#23)"
```

---

## Final verification

After all tasks complete:

- [ ] `npm run check` — Prettier clean
- [ ] `npm run lint` — ESLint clean
- [ ] `npm test` — vitest all-green (existing + new transportMode sort + new helper tests)
- [ ] `npm run build` — Vite build succeeds
- [ ] `npm run e2e:no-auth` — Playwright suite green, including the new spec
- [ ] Manual: open `/vehicle-types` in `npm run local`, confirm the column renders + sorts; open the filter dropdown on `/vehicles`, confirm the icons.

## Out of plan (out of scope for #23)

- **#24 chip filters.** Will reuse `TransportModeIcon` with `iconPosition="left"` inside chips above the table.
- **Norway-specific variants.** Lands when design provides T-banen + national-rail glyphs.
- **Adopt `TransportModeIcon` inside `/vehicles` `TransportModeChip`.** Defer until UX signs off.
- **The 6 missing glyphs** (taxi, cableway, funicular, lift, trolleyBus, snowAndIce). They render as `tm-unknown` until design provides shapes.
