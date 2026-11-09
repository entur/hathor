import type { Theme } from '@mui/material/styles';

/** Linje TextField: at most 500px wide (#283) — the form column's field width. */
const FIELD_MAX_PX = 500;
/** Column 3 (picture + TOC); Linje docs TOC: `max-width: 15rem`. */
export const TOC_WIDTH = '15rem';
// Theme spacing: between the form and column 3 (and between sections), and right of the
// fields — room for the form column's own scrollbar from `lg` (#293).
export const SECTION_GAP = 4,
  SCROLL_PAD = 2;

/**
 * The form column: fields at most {@link FIELD_MAX_PX}, plus the scrollbar's room.
 *
 * @param {Theme} t the theme, for its spacing
 * @returns {string} a CSS length
 */
export const formColumnWidth = (t: Theme): string =>
  `calc(${FIELD_MAX_PX}px + ${t.spacing(SCROLL_PAD)})`;

/**
 * A form page's width — form column, gap, column 3 — so its title row ends where column 3 does.
 *
 * @param {Theme} t the theme, for its spacing
 * @returns {string} a CSS length
 */
export const formPageWidth = (t: Theme): string =>
  `calc(${formColumnWidth(t)} + ${t.spacing(SECTION_GAP)} + ${TOC_WIDTH})`;
