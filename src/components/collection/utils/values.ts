/**
 * Read and format one field of one row. Shared by both views, the search and
 * the sort, so a value reads the same wherever it shows up.
 */
import {
  DEFAULT_LABELS,
  type CollectionLabels,
  type Column,
  type FieldSpec,
  type KeyedRow,
} from '../types.ts';

/** The identity field: captioned "Id" and shown compact (`::1004`). */
export const ID_FIELD = 'netexId';
const ID_KEYS = [ID_FIELD, 'id'] as const; // first present → row identity
const VERSION_KEY = 'version',
  VERSION_SEP = '@';
const POSITION_PREFIX = 'row:'; // id-less rows; a real id never starts with it
const REPEAT_SEP = '#'; // a repeated identity's 2nd, 3rd… occurrence
const ID_SEP = ':',
  COMPACT_MARK = '::';
const VERSION_MARK = '/ver'; // `::1004/ver3` on a card
const DATE_LEN = 10,
  MINUTE_LEN = 16; // 'YYYY-MM-DD', 'YYYY-MM-DDTHH:mm'
/** Shown for a missing value, in every view. */
export const EMPTY_TEXT = '—';
/** Joins a list value for display (multi-enums, filter chips). */
export const LIST_SEP = ', ';

/** The value at `path`; `undefined` if any segment is missing. */
const getPath = (obj: unknown, path: readonly string[]): unknown =>
  path.reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string, unknown>)[k]), obj);

/**
 * The field's value in `row`, with a `name` (MultilingualString) unwrapped to
 * its `value` leaf.
 *
 * @param row  one entity
 * @param spec the field's registry entry
 * @returns the raw value; `undefined` when any path segment is missing
 */
export const rawValue = (row: unknown, spec: FieldSpec): unknown => {
  const v = getPath(row, spec.path);
  return spec.kind === 'name'
    ? ((v as { value?: unknown } | null | undefined)?.value ?? undefined)
    : v;
};

/**
 * The field's value as a list of strings: a list value without its null
 * members, a single value as a one-item list, nothing as an empty list.
 *
 * @param row  one entity
 * @param spec the field's registry entry
 * @returns the values
 */
export const valueList = (row: unknown, spec: FieldSpec): string[] => {
  const v = rawValue(row, spec);
  return Array.isArray(v) ? v.filter(x => x != null).map(String) : v == null ? [] : [String(v)];
};

/**
 * The field's display text. Empty string for a missing value; `0` and `false`
 * stay visible.
 *
 * @param row    one entity
 * @param spec   the field's registry entry
 * @param labels yes/no wording for `switch` fields (English default)
 * @returns display text
 */
export const formatValue = (
  row: unknown,
  spec: FieldSpec,
  labels: Pick<CollectionLabels, 'yes' | 'no'> = DEFAULT_LABELS
): string => {
  if (spec.kind === 'enumMulti') return valueList(row, spec).join(LIST_SEP);
  const v = rawValue(row, spec);
  if (v == null) return '';
  if (spec.kind === 'switch') return v ? labels.yes : labels.no;
  if (spec.kind === 'date') return String(v).slice(0, DATE_LEN);
  if (spec.kind === 'datetime') return String(v).slice(0, MINUTE_LEN).replace('T', ' ');
  return String(v);
};

/**
 * A stable, unique key per row, for the grid's row ids and the cards' React
 * keys. The NeTEx identity is `netexId` + `version`, so two versions of one
 * entity are two rows: `id@version`, or the bare id when there is no version.
 * A row with no id is keyed by its position across pages (`offset + index`),
 * prefixed so it can never equal a real id.
 *
 * A repeated identity is a data error, so it is reported with a console
 * warning. Its repeats still get unique keys (`A@1#2`), because React and the
 * grid both need one key per row; otherwise a row would show twice or vanish.
 *
 * @param rows   the rows being rendered
 * @param offset position of `rows[0]` in the whole result (page × page size)
 * @returns one key per row, in order
 */
export const rowKeys = (rows: readonly unknown[], offset = 0): string[] => {
  const base = rows.map((row, i) => {
    const id = rowId(row);
    if (id === undefined) return `${POSITION_PREFIX}${offset + i}`;
    const version = (row as Record<string, unknown>)[VERSION_KEY];
    return version == null || version === '' ? id : `${id}${VERSION_SEP}${String(version)}`;
  });
  const taken = new Set(base);
  const seen = new Set<string>();
  const repeated = new Set<string>();
  const keys = base.map(k => {
    if (!seen.has(k)) return (seen.add(k), k);
    repeated.add(k);
    let n = 2;
    while (taken.has(`${k}${REPEAT_SEP}${n}`)) n++;
    const unique = `${k}${REPEAT_SEP}${n}`;
    taken.add(unique);
    return unique;
  });
  if (repeated.size) {
    console.warn(
      `[EntityCollection] rows share an identity (netexId + version): ${[...repeated].join(', ')}`
    );
  }
  return keys;
};

/**
 * The visible page as keyed rows — what both views render.
 *
 * @param rows   the visible page
 * @param offset position of `rows[0]` in the whole result
 * @returns each row with its `rowKeys` key
 */
export const keyRows = (rows: readonly unknown[], offset = 0): KeyedRow[] => {
  const keys = rowKeys(rows, offset);
  return rows.map((entity, i) => ({ key: keys[i], entity }));
};

/**
 * Is this the entity's identity field (top-level `netexId`)? Hoisted relation
 * ids such as `deckPlan.netexId` are not — they name another entity.
 *
 * @param spec a registry entry
 * @returns whether it is the identity field
 */
export const isIdSpec = (spec: FieldSpec): boolean =>
  spec.path.length === 1 && (ID_KEYS as readonly string[]).includes(spec.path[0]);

/**
 * A row's identity: `netexId`, else `id` (hathor's types name it so).
 *
 * @param row one entity
 * @returns the id, or `undefined` for an id-less row
 */
export const rowId = (row: unknown): string | undefined => {
  const obj = (row ?? {}) as Record<string, unknown>;
  const idKey = ID_KEYS.find(k => obj[k] != null);
  return idKey && String(obj[idKey]);
};

const lastSegment = (id: string): string => id.slice(id.lastIndexOf(ID_SEP) + 1);

/**
 * A NeTEx id shortened to its local part: `VEH:VehicleType:1004` → `::1004`.
 * Within one collection the codespace and type repeat on every row, so only
 * the last segment tells rows apart. A value without segments (or with an
 * empty last one) is returned unchanged.
 *
 * @param id a full id
 * @returns the compact form
 */
export const compactId = (id: string): string => {
  const tail = lastSegment(id);
  return id.includes(ID_SEP) && tail ? `${COMPACT_MARK}${tail}` : id;
};

/**
 * Does a typed id pick out a full one? The compact `::1004` and the bare
 * `1004` match on the last segment; a value carrying a namespace must match
 * whole — the full id stays a working fallback.
 *
 * @param full  the row's id
 * @param typed what the user entered
 * @returns whether they denote the same entity
 */
export const idMatches = (full: string, typed: string): boolean => {
  if (typed === full) return true;
  const local = typed.startsWith(COMPACT_MARK) ? typed.slice(COMPACT_MARK.length) : typed;
  return local !== '' && !local.includes(ID_SEP) && local === lastSegment(full);
};

/**
 * A typed id filter entry in the compact form: a full id is compacted, and a
 * bare local part (`1004`) gains the `::` mark, so every entry reads alike.
 *
 * @param typed what the user entered
 * @returns the entry as shown on a chip or tag
 */
export const compactIdEntry = (typed: string): string =>
  typed.includes(ID_SEP) ? compactId(typed) : `${COMPACT_MARK}${typed}`;

/**
 * The text a view shows for one cell: `formatValue` passed through the
 * column's own `display` rule. Search, sort and filtering use the full value.
 *
 * @param row    one entity
 * @param col    the resolved column
 * @param labels yes/no wording for `switch` fields
 * @returns display text
 */
export const displayValue = (
  row: unknown,
  col: Column,
  labels?: Pick<CollectionLabels, 'yes' | 'no'>
): string => col.display(formatValue(row, col.spec, labels));

/**
 * The full text as a hover title, where the shown text is shortened.
 *
 * @param row one entity
 * @param col the resolved column
 * @returns the full text, or `undefined` when nothing is hidden
 */
export const fullTitle = (row: unknown, col: Column): string | undefined => {
  const full = formatValue(row, col.spec);
  return full !== col.display(full) ? full : undefined;
};

/**
 * An identity as a card reads it: the shown id plus the row's version,
 * `::1004/ver3`. Without a version (or without an id) the text is unchanged.
 *
 * @param shown the shown id
 * @param row   the entity
 * @returns the id with its version
 */
export const withVersion = (shown: string, row: unknown): string => {
  const version = (row as Record<string, unknown> | null | undefined)?.[VERSION_KEY];
  return shown && version != null && version !== ''
    ? `${shown}${VERSION_MARK}${String(version)}`
    : shown;
};
