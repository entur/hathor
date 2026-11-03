/**
 * Filter conditions: value coercion, emptiness, client-side matching, the
 * edits the toolbar makes to them, and the translation to sobek's
 * `<Entity>Filter` argument shape.
 */
import type { CollectionFilters, Column, FilterFields, FilterOp, FilterValue } from '../types.ts';
import { formatValue, LIST_SEP, valueList } from './values.ts';

/** Separates entries in a string given where a list is expected ("1004, 1007"). */
const ENTRY_SEP = /[\s,]+/;

/**
 * A filter value as a string list, whatever shape it arrived in. A string is
 * split on commas and whitespace — ids and enum values contain neither.
 *
 * @param value a `contains` string or an `anyOf` list
 * @returns the list; empty for an empty or missing value
 */
export const asList = (value: FilterValue | undefined): string[] =>
  value == null
    ? []
    : typeof value === 'string'
      ? value.split(ENTRY_SEP).filter(Boolean)
      : [...value];

/**
 * A filter value as text, whatever shape it arrived in. A list becomes one
 * space-joined phrase — the single string sobek's `contains` argument takes,
 * so client and server match the same rows.
 *
 * @param value a `contains` string or an `anyOf` list
 * @returns the text; a list is space-joined
 */
export const asText = (value: FilterValue | undefined): string =>
  value == null ? '' : typeof value === 'string' ? value : value.join(' ');

/**
 * Does a condition restrict nothing? Read the way its op reads it: `anyOf`
 * splits into entries (a list of only blanks, or " , ", is empty), `contains`
 * takes the trimmed text (a lone "," still looks for a comma). The one rule for
 * "is this filter active" — matching, chips and the sobek translation all use it.
 *
 * @param value the condition
 * @param op    the field's operator
 * @returns whether it is empty
 */
export const isEmptyCondition = (value: FilterValue | undefined, op: FilterOp): boolean =>
  op === 'anyOf' ? asList(value).every(v => v.trim() === '') : asText(value).trim() === '';

/**
 * Does `row` satisfy one condition? An empty condition matches every row.
 * Approximates sobek: `contains` is a case-insensitive substring; `anyOf`
 * uses the column's own `matches` rule (the identity matches on its last
 * segment).
 *
 * @param row   one entity
 * @param col   resolved column of the filtered field
 * @param op    the field's operator
 * @param value the condition's value
 * @returns whether the row passes
 */
export const matchesFilter = (
  row: unknown,
  col: Column,
  op: FilterOp,
  value: FilterValue
): boolean => {
  if (isEmptyCondition(value, op)) return true;
  if (op === 'contains')
    return formatValue(row, col.spec).toLowerCase().includes(asText(value).trim().toLowerCase());
  const wanted = asList(value);
  return valueList(row, col.spec).some(have => wanted.some(typed => col.matches(have, typed)));
};

/**
 * `filters` with `key` set, or removed when the new value is `undefined`.
 *
 * @param filters current conditions
 * @param key     field key
 * @param value   new condition; `undefined` removes it
 * @returns the next conditions
 */
export const withFilter = (
  filters: CollectionFilters,
  key: string,
  value: FilterValue | undefined
): CollectionFilters => {
  const { [key]: _dropped, ...rest } = filters;
  return value === undefined ? rest : { ...rest, [key]: value };
};

/**
 * Typed list entries split, trimmed, blanks and repeats dropped: a pasted
 * "1004, 1007" becomes two entries, and a stray space can't make an id that
 * matches nothing.
 *
 * @param values entries as typed or picked
 * @returns the clean entries
 */
export const cleanList = (values: readonly string[]): string[] => [
  ...new Set(values.flatMap(v => v.split(ENTRY_SEP)).filter(Boolean)),
];

/**
 * A condition as display text: trimmed text, or the list joined.
 *
 * @param value      the condition
 * @param entryLabel how one entry is shown (the column's rule)
 * @returns display text; empty for an empty condition
 */
export const chipText = (
  value: FilterValue,
  entryLabel: (typed: string) => string = v => v
): string =>
  typeof value === 'string'
    ? entryLabel(value.trim())
    : asList(value).map(entryLabel).join(LIST_SEP);

/**
 * The filterable columns carrying a non-empty condition, in column order.
 *
 * @param columns      resolved columns
 * @param filterFields the entity's `<Entity>FilterFields`
 * @param filters      current conditions
 * @returns the filtered-on columns
 */
export const activeFilterColumns = (
  columns: readonly Column[],
  filterFields: FilterFields,
  filters: CollectionFilters
): Column[] =>
  columns.filter(
    c => filterFields[c.key] && !isEmptyCondition(filters[c.key], filterFields[c.key].op)
  );

/**
 * Translate the query's filters into the object sobek's list query takes as
 * `filter` (minus `dataOwnerRef`, which the host stamps from its session).
 *
 * @param filters      `CollectionQuery.filters`
 * @param filterFields the entity's `<Entity>FilterFields`
 * @returns filter args; empty conditions and non-filterable fields are omitted
 */
export const toSobekFilter = (
  filters: CollectionFilters,
  filterFields: FilterFields
): Record<string, string | string[]> =>
  Object.fromEntries(
    Object.entries(filters).flatMap(([field, value]): [string, string | string[]][] => {
      const target = filterFields[field];
      if (!target || isEmptyCondition(value, target.op)) return [];
      return [
        [target.arg, target.op === 'anyOf' ? cleanList(asList(value)) : asText(value).trim()],
      ];
    })
  );
