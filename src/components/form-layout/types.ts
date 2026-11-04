/**
 * A form's shape: which fields show, in which section, at what width. Ported
 * from the sandbox `EntityDetailsForm/types.ts` (#267); the controls themselves
 * stay host-drawn, so only placement is described here.
 */
import type { FieldEntry, FieldSpec } from '../collection/types.ts';

/** Share of a form row a control takes. Consecutive narrow controls pack onto
 *  one row; `full` always starts its own. */
export type FieldWidth = 'full' | '1/2' | '1/3' | '1/4';

/** Form-level width per control kind, over the defaults (`KIND_WIDTH`). */
export type KindWidths = Partial<Record<FieldSpec['kind'], FieldWidth>>;

/** A field's placement within a section: the collection's entry plus its width. */
export interface LayoutEntry<K extends string = string> extends Pick<
  FieldEntry<K>,
  'field' | 'label'
> {
  /** Share of the row from `sm` up (below it, every field is full width). Wins
   *  over the form's `widths` and the kind default — e.g. a short code at `1/2`,
   *  so the box hints at how much the user types. */
  width?: FieldWidth;
}

/** A layout item is a bare field key or an entry object. */
export type LayoutItem<K extends string = string> = K | LayoutEntry<K>;

/** Whitelist of sections: only listed fields render. Object-key order = section
 *  order; array order = field order within the section. A single section renders
 *  flat (label unused). */
export type Layout<K extends string = string> = Record<string, LayoutItem<K>[]>;

/** How `patched` fields are shown: `mark` / `plain` keep them, `hide` leaves them
 *  out like a field omitted from the layout. */
export type PatchedDisplay = 'mark' | 'plain' | 'hide';
