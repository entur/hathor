/**
 * Section/field resolution — the form's *shape*, independent of rendering.
 * One source of truth: the stacked form and its table of contents derive from
 * the same call, so they can never disagree.
 */
import { humanize } from '../../collection/utils/humanize.ts';
import type { FieldSpec } from '../../collection/types.ts';
import type {
  FieldWidth,
  KindWidths,
  Layout,
  LayoutEntry,
  LayoutItem,
  PatchedDisplay,
} from '../types.ts';

/** Fewest sections worth a table of contents: with two, it only repeats two
 *  headings already in view. */
const TOC_MIN_SECTIONS = 3;

/** A field resolved for rendering: its mapped key, display label and share of the row. */
export interface ResolvedField {
  key: string;
  label: string;
  width: FieldWidth;
}

/** A named group of resolved fields. `label` is `''` for the layout-less case. */
export interface Section {
  label: string;
  fields: ResolvedField[];
}

/** Default share of a row per control kind: a number or a date doesn't need a
 *  name's width, so narrow kinds pack side by side. */
export const KIND_WIDTH: Record<FieldSpec['kind'], FieldWidth> = {
  number: '1/3',
  date: '1/2',
  datetime: '1/2',
  switch: '1/2',
  text: 'full',
  name: 'full',
  enum: 'full',
  enumMulti: 'full',
  reference: 'full',
  grid: 'full',
};

/** Columns a width spans on the default 12-column MUI `Grid`. */
const WIDTH_SPAN: Record<FieldWidth, number> = { full: 12, '1/2': 6, '1/3': 4, '1/4': 3 };

/**
 * The responsive `Grid` `size` for a width: full below `sm`, the fraction from
 * there up.
 *
 * @param {FieldWidth} width the field's resolved width
 * @returns {{ xs: number, sm: number }} a `size` prop for an MUI `Grid` item
 */
export const gridSize = (width: FieldWidth): { xs: number; sm: number } => ({
  xs: WIDTH_SPAN.full,
  sm: WIDTH_SPAN[width],
});

const norm = (item: LayoutItem): LayoutEntry => (typeof item === 'string' ? { field: item } : item);

/**
 * Resolve a field mapping + optional layout into the sections to render.
 *
 * No layout → one unnamed section holding every mapped field, in mapping
 * order. With a layout it is a whitelist: unknown keys are dropped, a key
 * repeated across sections lands only in the first, and empty sections are
 * removed so no heading is drawn over nothing. `patched: 'hide'` drops patched
 * fields on both paths, before the empty-section rule. Each field's width is
 * the layout entry's, else `widths` for its kind, else `KIND_WIDTH`.
 *
 * @param {Record<string, FieldSpec>} fields the entity's field mapping
 * @param {Layout} [layout] optional section whitelist
 * @param {PatchedDisplay} [patched] how patched fields are shown; only `hide` changes the shape
 * @param {KindWidths} [widths] form-level width per kind, over `KIND_WIDTH`
 * @returns {Section[]} non-empty sections, in layout order
 */
export function resolveSections(
  fields: Record<string, FieldSpec>,
  layout?: Layout,
  patched: PatchedDisplay = 'mark',
  widths?: KindWidths
): Section[] {
  const shown = (key: string) => !!fields[key] && !(patched === 'hide' && fields[key].patched);
  const widthOf = (key: string, own?: FieldWidth): FieldWidth =>
    own ?? widths?.[fields[key].kind] ?? KIND_WIDTH[fields[key].kind];
  if (!layout) {
    const all = Object.keys(fields)
      .filter(shown)
      .map(key => ({ key, label: humanize(key), width: widthOf(key) }));
    return all.length ? [{ label: '', fields: all }] : [];
  }
  const seen = new Set<string>();
  return Object.entries(layout)
    .map(([label, items]) => ({
      label,
      fields: items
        .map(norm)
        .filter(e => shown(e.field) && !seen.has(e.field) && (seen.add(e.field), true))
        .map(e => ({
          key: e.field,
          label: e.label ?? humanize(e.field),
          width: widthOf(e.field, e.width),
        })),
    }))
    .filter(s => s.fields.length > 0);
}

/**
 * The section labels a table of contents can navigate: only a stacked form with
 * at least {@link TOC_MIN_SECTIONS} sections gets one, so anything else yields `[]`.
 *
 * @param {Section[]} sections from {@link resolveSections}
 * @returns {string[]} the labels in page order, or `[]`
 */
export const tocSections = (sections: readonly Section[]): string[] =>
  sections.length >= TOC_MIN_SECTIONS ? sections.map(s => s.label) : [];
