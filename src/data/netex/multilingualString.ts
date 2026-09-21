/** A NeTEx MultilingualString: a localised `value` with an optional `lang` tag.
 *  The GQL `Name` type is structurally this shape. */
export type MultilingualString = { value: string; lang?: string };

/**
 * Read the first localised value from a NeTEx `MultilingualString[]` array.
 * Returns `''` when the array is missing or empty. NeTEx schemas express
 * localised strings as an array of `{ value, lang? }` entries; we don't
 * yet branch on `lang`, so consuming the first entry is the standard
 * "primary value" accessor.
 */
export const firstText = (arr?: { value?: string }[]): string => arr?.[0]?.value ?? '';

/**
 * Merge edited field text into an existing MultilingualString (`Name`),
 * preserving its `lang` tag.
 *
 * A name field edits only the `value`; rebuilding `{ value }` from scratch would
 * drop the language tag (and a full-document save then clears it). Spreading
 * `cur` keeps `lang`. Shared across every feature that edits a NeTEx Name
 * (vehicle-types, vehicles, …) so the rule lives in one tested place.
 *
 * @param {MultilingualString | undefined} cur - current value (may carry `lang`)
 * @param {string} text - new text from the field
 * @returns {MultilingualString | undefined} `{ ...cur, value: text }` for
 *   non-blank text, else `undefined` — a blank field clears the name.
 */
export const mergeNameText = (
  cur: MultilingualString | undefined,
  text: string
): MultilingualString | undefined => (text === '' ? undefined : { ...cur, value: text });

/**
 * Trim a NeTEx Name, dropping it entirely when nothing survives, keeping `lang`.
 *
 * Emptiness is decided *after* trimming because Sobek serializes an empty Name
 * as a whitespace string rather than null, so a fetched value arrives
 * whitespace-wrapped while `fast-xml-parser` hands back the same field trimmed.
 * Callers that must emit an explicit `null` (a full-replace input) spell that
 * at the call site with `?? null`.
 *
 * @param {MultilingualString | null} [n] - name as read from GQL or parsed XML
 * @returns {MultilingualString | undefined} trimmed name, or `undefined` when
 *   blank
 */
export const trimName = (
  n?: { value?: string; lang?: string } | null
): MultilingualString | undefined => {
  const value = n?.value?.trim();
  if (!value) return undefined;
  return n?.lang ? { value, lang: n.lang } : { value };
};
