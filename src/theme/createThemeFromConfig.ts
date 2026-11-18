import {
  alpha,
  createTheme,
  getContrastRatio,
  type Components,
  type Theme,
  type TypographyVariantsOptions,
} from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type { ThemeConfig } from './theme-config';
import { REDUCED_MOTION_MEDIA, STILL_SKELETON } from '../utils/motion';

// Linje focus ring (WCAG 2.4.7, #256): `outlines.focus` / `outlineOffsets.focus` 2 px, in
// `--stroke-focus-standard` (primary) on light surfaces and `--stroke-focus-contrast`
// (Lavender 40) on the navy header.
export const FOCUS_PX = 2;
const FOCUS_CONTRAST = '#aeb7e2';
// Linje's accent (`Text/Accent`, Lavender/90): tooltip fill, alert text, pressed icons.
const ACCENT = '#181c56';
// Linje's legacy `border-radiuses-medium`: icon buttons, tooltips, alert boxes.
const LEGACY_RADIUS_PX = 4;
// Linje `--font-weights-*` (#258): Nationale ships only these two.
const BODY_WEIGHT = 500,
  HEADING_WEIGHT = 600;
// Linje corners, standard density (#258): cards `--border-radiuses-large`, buttons
// `--components-button-radius-*`; small fields keep `shape.borderRadius` 4, chips stay pills.
const CARD_RADIUS_PX = 8;
export const BUTTON_RADIUS_PX = 8,
  BUTTON_RADIUS_SMALL_PX = 6;
// Linje field border, `--components-form-baseform-standard-border-default`; navy on hover/focus.
export const FIELD_BORDER_PX = 2,
  FIELD_BORDER = '#8284ab';
// Linje TextField / Dropdown, standard density (`@entur/form` BaseFormControl.scss,
// InputGroupLabel.scss): one 48 px box with the label inside, resting mid-field and moving to
// the top once focused or filled. That is MUI's small `filled` field (48 px, value 21 / 4 px
// in, ADR 2026-11-17); hathor adds the white fill, the border, radius 8 and Linje's 16 px
// indent (MUI's is 12).
const FIELD_PAD_X_PX = 16,
  FIELD_INDENT_SHIFT_PX = 4;
export const FIELD_RADIUS_PX = 8;
// Linje `Text/Subdued`, 5.6:1 on white.
const LABEL_COLOR = '#626493';
// Linje disabled field (`BaseFormControl.scss` `--disabled`): grey fill, no border, grey text.
const DISABLED_FILL = '#cfd2d4',
  DISABLED_TEXT = '#6e6f73';
// Linje `Text/SubduedAlt` (Blue 30), 11.3:1 on the navy: the header picker's label.
const HEADER_LABEL = '#d9dae8';
// MUI's filled Autocomplete input keeps 4 px of its own left padding; the root adds the rest.
// Linje MultiSelect (`dropdown/src/Dropdown.scss`, `--filled`): 8 px between chips, 4 px clear
// below them. MUI's chips carry a 2 px margin each side, and the 2 px border is inset.
const AC_INPUT_PAD_LEFT_PX = 4,
  CHIP_GAP_PX = 4, // + 2 × 2 px chip margin = 8
  AC_PAD_BOTTOM_PX = 4; // + 2 px chip margin − 2 px inset border = 4 clear
// Linje opens every dropdown below its field, `offset(space.extraSmall2)` (`Dropdown.tsx`,
// `MultiSelect.tsx`): clear of the 2 px focus ring, which a flush popup cuts off.
const POPUP_OFFSET_PX = 4,
  LIST_MAX_HEIGHT = '15rem'; // Linje `DropdownList.scss` `--list-max-height`; fits below the field
// Linje buttons, `button/height/horizontal content` Small / Medium / Large.
export const BUTTON_HEIGHT_SMALL_PX = 32,
  BUTTON_HEIGHT_PX = 48;
const BUTTON_HEIGHT_LARGE_PX = 64;
// Heading sizes (rem) on Linje's 32 / 24 / 20 px steps, one line height for all.
const HEADING_LINE_HEIGHT = 1.25,
  H1_REM = 2,
  H_PAGE_REM = 1.5,
  H_SECTION_REM = 1.25;
// Linje secondary fills (`Fill/Secondary/{Hover,Active}/Light`, `.../Contrast`): icon button and
// chip hover / pressed, light ground and the navy header. Named here rather than read from
// `action.*`, which installations set differently.
export const HOVER_FILL = '#d9ddf2',
  PRESSED_FILL = '#aeb7e2';
const HOVER_FILL_CONTRAST = '#626493',
  PRESSED_FILL_CONTRAST = '#8794d4';
// Linje Tooltip (`tooltip/Tooltip.scss`): accent fill, 14 px text, 5 / 10 px padding, radius 4.
const TOOLTIP_PAD = '5px 10px';
// Linje Skeleton (`loader/BaseSkeleton.scss`, `loader/skeleton/Standard/*`): fill, shimmer.
const SKELETON_FILL = '#eaeaf1',
  SKELETON_HIGHLIGHT = '#f6f6f9';
// Linje AlertBox (`@entur/alert` BaseAlertBox.scss, `alert/AlertBox/<severity>/Standard/*`):
// a light fill, Linje text, a coloured border and icon; 1 px border, legacy radius 4.
const ALERT_BORDER_PX = 1;
const ALERT_COLOURS = {
  Success: { fill: '#d0f1e3', border: '#1a8e60', icon: '#1a8e60' },
  Info: { fill: '#e1eff8', border: '#067eb2', icon: '#067eb2' },
  Error: { fill: '#ffcece', border: '#d31b1b', icon: '#d31b1b' },
  Warning: { fill: '#fff4cd', border: '#e9b10c', icon: ACCENT },
};
// Table row tint: hover, selected, selected + hover (primary alpha); selected row's left stripe.
const ROW_HOVER_ALPHA = 0.08,
  ROW_SELECTED_ALPHA = 0.18,
  ROW_SELECTED_HOVER_ALPHA = 0.24,
  ROW_STRIPE_PX = 3;

// WCAG minimum contrast: text (1.4.3), borders and focus rings (1.4.11, 2.4.11).
const TEXT_MIN = 4.5,
  NON_TEXT_MIN = 3;

/** A colour on the header (`primary.main`), or its contrast text where the colour fails `min`. */
const onBar = (theme: Theme, color: string, min: number) =>
  getContrastRatio(color, theme.palette.primary.main) >= min
    ? color
    : theme.palette.primary.contrastText;

/**
 * Linje's focus ring: a 2 px outline, 2 px off the box unless `offset` says otherwise.
 *
 * @param {string} color the ring colour, a CSS colour
 * @param {number} [offset] its distance from the box, px
 * @returns {object} the outline style
 */
export const ring = (color: string, offset = FOCUS_PX) => ({
  outline: `${FOCUS_PX}px solid ${color}`,
  outlineOffset: offset,
});

const heading = (rem: number) => ({
  fontSize: `${rem}rem`,
  fontWeight: HEADING_WEIGHT,
  lineHeight: HEADING_LINE_HEIGHT,
});

/**
 * Linje's type scale (#258), 12 · 14 · 16 · 20 · 24 · 32 px: MUI's body, subtitle, button,
 * caption and overline sizes already sit on it; headings step 32 / 24 / 20. A page title is
 * `h5` (24), a section `h6` (20), the Home hero `h1` (32).
 */
const TYPE_SCALE: TypographyVariantsOptions = {
  fontWeightLight: BODY_WEIGHT,
  fontWeightRegular: BODY_WEIGHT,
  fontWeightMedium: BODY_WEIGHT,
  fontWeightBold: HEADING_WEIGHT,
  h1: heading(H1_REM),
  h2: heading(H_PAGE_REM),
  h3: heading(H_PAGE_REM),
  h4: heading(H_PAGE_REM),
  h5: heading(H_PAGE_REM),
  h6: heading(H_SECTION_REM),
};

// Spelled out: emotion splits selectors on every comma, inside `:is()` / `:not()` too.
const INSET_RING = ['.MuiMenuItem-root', '.MuiListItemButton-root', '.MuiTab-root']
  .map(c => `&.Mui-focusVisible${c}`)
  .concat('.MuiDataGrid-root &.Mui-focusVisible')
  .join(', ');
const NOTCH = '.MuiOutlinedInput-notchedOutline';
// A field that takes hover: not disabled, in error or read-only (view mode).
const HOVERABLE = ':not(.Mui-disabled):not(.Mui-error):not(.MuiInputBase-readOnly)';
// MUI's own field-hover selector, outranking it; on touch, a stuck `:hover` that isn't focus.
const HOVER = `:hover${HOVERABLE} ${NOTCH}`,
  STUCK_HOVER = `:hover:not(.Mui-focused)${HOVERABLE} ${NOTCH}`;
// Hover only where a pointer hovers: a tap leaves `:hover` stuck (MUI gates its own the same way).
export const CAN_HOVER = '@media (hover: hover)';
const CANNOT_HOVER = '@media (hover: none)',
  FORCED_COLORS = '@media (forced-colors: active)';

/**
 * `sx` that moves a control's focus ring from its root to an inner part, as Linje draws it on
 * a SquareButton's square or a Checkbox's box.
 *
 * @param {string} part the inner part's class name
 * @returns {object} the root's and the part's focus styles
 */
export const ringOn = (part: string) => ({
  '&.Mui-focusVisible': { outline: 'none' },
  // `sx` resolves a palette path in `outlineColor`, not inside the `outline` shorthand.
  [`&.Mui-focusVisible .${part}`]: {
    outline: `${FOCUS_PX}px solid`,
    outlineColor: 'primary.main',
    outlineOffset: FOCUS_PX,
  },
});

/** A filled field's border, as an inset shadow: it keeps MUI's 48 px box 48 px. */
const edge = (color: string) => ({ boxShadow: `inset 0 0 0 ${FIELD_BORDER_PX}px ${color}` });

/**
 * Linje's component look on MUI: corners, chip text, field borders, and one focus ring for
 * the whole app. Buttons and links ring on `:focus-visible` only (no ring on a mouse click);
 * a text field rings whenever it has focus, as browsers treat any text-field focus as
 * focus-visible. Items flush in a clipping box (menus, the nav rail, tabs, grid cells) draw
 * the ring inset.
 */
const baseComponents = (theme: Theme): Components<Theme> => ({
  MuiCard: { styleOverrides: { root: { borderRadius: CARD_RADIUS_PX } } },
  MuiButton: {
    styleOverrides: {
      root: { borderRadius: BUTTON_RADIUS_PX, minHeight: BUTTON_HEIGHT_PX },
      sizeSmall: { borderRadius: BUTTON_RADIUS_SMALL_PX, minHeight: BUTTON_HEIGHT_SMALL_PX },
      sizeLarge: { minHeight: BUTTON_HEIGHT_LARGE_PX },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: LABEL_COLOR,
        '&.Mui-disabled': { color: DISABLED_TEXT },
        // MUI's own moves, nudged to Linje's indent: `translate` adds to its `transform`.
        '&.MuiInputLabel-filled': { translate: `${FIELD_INDENT_SHIFT_PX}px 0` },
        [REDUCED_MOTION_MEDIA]: { transition: 'none' },
      },
    },
  },
  // MUI's standard alert, as Linje's AlertBox; MUI's own tints put white or dark-tinted text
  // on status colours (white on success is 4.1:1).
  MuiAlert: {
    styleOverrides: {
      root: Object.fromEntries(
        Object.entries(ALERT_COLOURS).map(([severity, c]) => [
          `&.MuiAlert-standard.MuiAlert-color${severity}`,
          {
            color: ACCENT,
            backgroundColor: c.fill,
            border: `${ALERT_BORDER_PX}px solid ${c.border}`,
            borderRadius: LEGACY_RADIUS_PX,
            '& .MuiAlert-icon': { color: c.icon },
          },
        ])
      ),
    },
  },
  // Linje IconButton (`button/IconButton.scss`): square-ish, accent icon (`action.active`),
  // secondary fills on hover / press; MUI's sizes stay (medium 8 px padding = Linje's).
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: LEGACY_RADIUS_PX,
        [CAN_HOVER]: { '&:hover': { backgroundColor: HOVER_FILL } },
        '&:active': { backgroundColor: PRESSED_FILL },
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: ACCENT,
        color: theme.palette.common.white,
        fontSize: theme.typography.body2.fontSize,
        padding: TOOLTIP_PAD,
        borderRadius: LEGACY_RADIUS_PX,
      },
      arrow: { color: ACCENT },
    },
  },
  // Linje's skeleton: its fill and shimmer; still under reduced motion.
  MuiSkeleton: {
    defaultProps: { animation: 'wave' },
    styleOverrides: {
      root: {
        backgroundColor: SKELETON_FILL,
        ...STILL_SKELETON,
      },
      wave: {
        '&::after': {
          background: `linear-gradient(90deg, transparent, ${SKELETON_HIGHLIGHT}, transparent)`,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { fontSize: theme.typography.body2.fontSize },
      sizeSmall: { fontSize: theme.typography.caption.fontSize },
      // Linje TagChip's close button (`chip/TagChip.scss`): the chip's own text colour (MUI's
      // 26 % black is 1.9:1, WCAG 1.4.11), a round hover fill.
      deleteIcon: {
        color: 'inherit',
        borderRadius: '50%',
        '&:hover': { color: 'inherit', backgroundColor: HOVER_FILL },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      // Outlined fields are the small ones — toolbar, filters, the header picker — the label
      // in the outline's notch. Focus and error keep MUI's colours: focus is the 2 px border
      // turning primary. No ring: an outline is a plain box and would strike the label.
      root: {
        [`& ${NOTCH}`]: { borderWidth: FIELD_BORDER_PX, borderColor: FIELD_BORDER },
        [CAN_HOVER]: { [`&${HOVER}`]: { borderColor: theme.palette.primary.main } },
        // Touch: MUI's own reset paints a stuck `:hover` 0.23 black (1.7:1, WCAG 1.4.11); keep ours.
        [CANNOT_HOVER]: { [`&${STUCK_HOVER}`]: { borderColor: FIELD_BORDER } },
        // Linje read-only (view mode, #267): no border, no hover — an error still shows, and
        // focus does (view-mode fields stay in the tab order, WCAG 2.4.7).
        [`&.MuiInputBase-readOnly:not(.Mui-error):not(.Mui-focused) ${NOTCH}`]: {
          borderColor: 'transparent',
        },
        '&.Mui-disabled': { backgroundColor: DISABLED_FILL },
        [`&.Mui-disabled ${NOTCH}`]: { borderColor: 'transparent' },
      },
    },
  },
  // Form fields (`FormFields.tsx`): MUI's small filled field, dressed as Linje's.
  MuiFilledInput: {
    defaultProps: { disableUnderline: true },
    styleOverrides: {
      root: {
        backgroundColor: theme.palette.common.white,
        borderRadius: FIELD_RADIUS_PX,
        ...edge(FIELD_BORDER),
        // Forced colours (Windows High Contrast) drop box-shadows but paint a transparent
        // outline in the system colour, so the field keeps a visible edge there.
        outline: `${FIELD_BORDER_PX}px solid transparent`,
        outlineOffset: -FIELD_BORDER_PX,
        '&:hover': {
          backgroundColor: theme.palette.common.white,
          ...edge(theme.palette.primary.main),
        },
        // Read-only too, unlike Linje: view-mode fields stay in the tab order (WCAG 2.4.7).
        '&.Mui-focused': {
          backgroundColor: theme.palette.common.white,
          ...edge(theme.palette.primary.main),
          ...ring(theme.palette.primary.main, 0),
        },
        '&.Mui-error': edge(theme.palette.error.main),
        '&.Mui-error.Mui-focused': ring(theme.palette.error.main, 0),
        // Linje read-only (view mode, #267): no border, no hover — an error still shows.
        '&.MuiInputBase-readOnly:not(.Mui-error)': { boxShadow: 'none' },
        '&.Mui-disabled': { backgroundColor: DISABLED_FILL, boxShadow: 'none' },
        // Forced colours: focus must differ from the edge by more than its offset — a thicker
        // Highlight ring. Last in the slot, so it beats the focus rings above.
        [FORCED_COLORS]: {
          '&.Mui-focused, &.Mui-error.Mui-focused': {
            outlineWidth: 2 * FIELD_BORDER_PX,
            outlineOffset: -FIELD_BORDER_PX,
            outlineColor: 'Highlight',
          },
          '&.Mui-disabled': { outlineColor: 'GrayText' },
        },
      },
      // A Select's own `&&&` right padding still wins, keeping its text off the arrow.
      input: { paddingInline: FIELD_PAD_X_PX },
    },
  },
  // Linje disabled text, either field variant (MUI's own is ~2.6:1).
  MuiInputBase: {
    styleOverrides: {
      // Linje placeholder, `Base form/Standard/Text-Label` (BaseFormControl.scss:51-53): MUI's
      // 0.42 opacity is 2.6:1, and a placeholder may carry the format (the import's add
      // field). MUI's own `!important` still hides it under a resting label.
      // Linje has no stepper: a number is a plain text field, so drop the browser's spin
      // buttons (squashed by the label-inside padding). Arrow keys still step.
      input: {
        '&::placeholder': { color: LABEL_COLOR, opacity: 1 },
        '&[type=number]': { MozAppearance: 'textfield' },
        '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
        },
      },
      root: {
        '& .MuiInputBase-input.Mui-disabled': {
          color: DISABLED_TEXT,
          WebkitTextFillColor: DISABLED_TEXT,
        },
      },
    },
  },
  // MUI pads its filled Autocomplete itself; only Linje's indent and the chip-row gap differ.
  MuiAutocomplete: {
    styleOverrides: {
      root: {
        '& .MuiFilledInput-root': {
          paddingLeft: FIELD_PAD_X_PX - AC_INPUT_PAD_LEFT_PX,
          gap: CHIP_GAP_PX,
        },
        // Same selector weight as MUI's own small `paddingBottom: 1`, so this one wins.
        '& .MuiFilledInput-root.MuiInputBase-sizeSmall': { paddingBottom: AC_PAD_BOTTOM_PX },
      },
      popper: {
        '&[data-popper-placement^="bottom"] .MuiAutocomplete-paper': { marginTop: POPUP_OFFSET_PX },
        '&[data-popper-placement^="top"] .MuiAutocomplete-paper': {
          marginBottom: POPUP_OFFSET_PX,
        },
      },
    },
  },
  // A Select's menu: below the field like Linje's Dropdown, not MUI's overlay on top of it.
  MuiSelect: {
    defaultProps: {
      MenuProps: {
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        transformOrigin: { vertical: 'top', horizontal: 'left' },
        slotProps: { paper: { sx: { mt: `${POPUP_OFFSET_PX}px`, maxHeight: LIST_MAX_HEIGHT } } },
      },
    },
  },
  // Helper text lines up with the field's edge, under a label that does too.
  MuiFormHelperText: { styleOverrides: { contained: { marginInline: 0 } } },
  MuiButtonBase: {
    styleOverrides: {
      root: {
        '&.Mui-focusVisible': ring(theme.palette.primary.main),
        [INSET_RING]: { outlineOffset: -FOCUS_PX },
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: { '&:focus-visible': ring(theme.palette.primary.main) },
    },
  },
  MuiAppBar: {
    // One class more specific than each ring, which its component inserts later. A field
    // sits on the navy itself (the org picker), enki-style: MUI's small field, its label in
    // the outline's notch; Blue 30 label, Lavender 40 outline, white text. Each falls back to
    // the bar's contrast text where it would fail on another installation's header colour.
    styleOverrides: {
      root: {
        '& .MuiButtonBase-root.Mui-focusVisible, & .MuiLink-root:focus-visible': {
          outlineColor: onBar(theme, FOCUS_CONTRAST, NON_TEXT_MIN),
        },
        '& .MuiInputLabel-root': { color: onBar(theme, HEADER_LABEL, TEXT_MIN) },
        '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.contrastText },
        '& .MuiOutlinedInput-root, & .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator':
          { color: theme.palette.primary.contrastText },
        [`& .MuiOutlinedInput-root ${NOTCH}`]: {
          borderColor: onBar(theme, FOCUS_CONTRAST, NON_TEXT_MIN),
        },
        [CANNOT_HOVER]: {
          [`& .MuiOutlinedInput-root${STUCK_HOVER}`]: {
            borderColor: onBar(theme, FOCUS_CONTRAST, NON_TEXT_MIN),
          },
        },
        // The picker's focus: the outline turning white, as in enki.
        [`& .MuiOutlinedInput-root.Mui-focused ${NOTCH}`]: {
          borderColor: theme.palette.primary.contrastText,
        },
        [CAN_HOVER]: {
          '& .MuiIconButton-root:hover': { backgroundColor: HOVER_FILL_CONTRAST },
          [`& .MuiOutlinedInput-root${HOVER}`]: { borderColor: theme.palette.primary.contrastText },
        },
        // Linje IconButton on a contrast surface; after hover, so a press shows while hovered.
        '& .MuiIconButton-root:active': {
          backgroundColor: PRESSED_FILL_CONTRAST,
          color: ACCENT,
        },
        // The header's own icons are installation images (`getIconUrl`), white and not
        // recolourable: white on the pressed fill is 2.9:1, so they keep the hover fill (6:1).
        '& .MuiIconButton-root:active:has(img)': { backgroundColor: HOVER_FILL_CONTRAST },
      },
    },
  },
  MuiDataGrid: {
    styleOverrides: {
      root: {
        '& .MuiDataGrid-columnHeader:focus-visible, & .MuiDataGrid-cell:focus-visible': ring(
          theme.palette.primary.main,
          -FOCUS_PX
        ),
      },
    },
  },
  // A subtle primary tint for row hover: the opaque action.hover drowns out Chip/Button
  // hover states in rows. Selected sits two stops above hover with a left accent stripe;
  // hover-while-selected nudges one stop further, never back to an unselected look.
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&.MuiTableRow-hover:hover': {
          backgroundColor: alpha(theme.palette.primary.main, ROW_HOVER_ALPHA),
        },
        '&.Mui-selected': {
          backgroundColor: alpha(theme.palette.primary.main, ROW_SELECTED_ALPHA),
          borderLeft: `${ROW_STRIPE_PX}px solid ${theme.palette.primary.main}`,
        },
        '&.Mui-selected.MuiTableRow-hover:hover': {
          backgroundColor: alpha(theme.palette.primary.main, ROW_SELECTED_HOVER_ALPHA),
        },
      },
    },
  },
});

/**
 * The app theme for a theme file, in MUI's two steps: the palette and type scale first, then
 * the base component styles resolved against it, the theme file's `components` laid over them.
 * Both merges are deep, so a theme's `h1: { fontSize }` keeps the scale's weight and its
 * `MuiButton.root` adds to the base corners.
 *
 * @param {ThemeConfig} cfg the theme file
 * @returns {Theme} the MUI theme
 */
export function createThemeFromConfig(cfg: ThemeConfig): Theme {
  const { components, typography, ...options } = cfg;
  const theme = createTheme({
    ...options,
    typography: deepmerge(TYPE_SCALE, (typography ?? {}) as TypographyVariantsOptions),
  });
  return createTheme(theme, {
    // Icons (icon buttons, Select / Autocomplete arrows) in Linje's accent, not MUI's 54 % black.
    palette: { action: { active: options.palette?.action?.active ?? theme.palette.primary.main } },
    components: deepmerge(baseComponents(theme), (components ?? {}) as Components<Theme>),
  });
}
