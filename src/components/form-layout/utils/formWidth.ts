import type { Theme } from '@mui/material/styles';

/** Linje TextField: at most 500px wide (#283). */
const FIELD_MAX_PX = 500;
/** Column 3 (picture + TOC); Linje docs TOC: `max-width: 15rem`. */
export const TOC_WIDTH = '15rem';
/** A form page's width cap — form column, gap, column 3; the page centres within it. The
 *  form column takes what column 3 leaves, so fields grow past Linje's 500px (#283). */
export const FORM_PAGE_MAX_WIDTH = '75rem';
// Theme spacing: between the form and column 3 (and between sections), and right of the
// fields — room for the form column's own scrollbar from `lg` (#293).
export const SECTION_GAP = 4,
  SCROLL_PAD = 2;

/**
 * The width of a form with no column 3: fields at most {@link FIELD_MAX_PX}, plus the
 * scrollbar's room. Its page is this wide too, centred.
 *
 * @param {Theme} t the theme, for its spacing
 * @returns {string} a CSS length
 */
export const formColumnWidth = (t: Theme): string =>
  `calc(${FIELD_MAX_PX}px + ${t.spacing(SCROLL_PAD)})`;
