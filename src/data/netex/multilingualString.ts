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

/**
 * Read a NeTEx text value that arrived from an XML parser, in whichever shape
 * the document produced.
 *
 * `trimName`'s counterpart on the read side. NeTEx types most name-ish
 * elements as `MultilingualString`, so `<Name>Lower</Name>` and
 * `<Name><Text>Lower</Text></Name>` are both valid for the same field and the
 * deck-renderer bundle stores whichever it got verbatim (`this.Name = o ?? ''`
 * — unlike its own equipment classes, which unwrap). Rendering that object as
 * a React child throws, so every read of such a value goes through here. The
 * three accepted shapes are the ones the package's own tree view unwraps.
 *
 * Blank is decided after trimming, as in {@link trimName}: Sobek writes an
 * empty Name as whitespace, and a truthy `'  '` would suppress a caller's
 * fallback label.
 *
 * @param {unknown} [v] - value as parsed: a string, `{Text}` (what the
 *   deck-renderer's parser yields), `{text_value}`, `{value}`, or nothing
 * @returns {string | undefined} the trimmed text, or `undefined` when blank
 */
export const netexText = (v?: unknown): string | undefined => {
  const o = v as { Text?: string; text_value?: string; value?: string } | null;
  const s = typeof v === 'string' ? v : (o?.Text ?? o?.text_value ?? o?.value);
  return s?.trim() || undefined;
};
