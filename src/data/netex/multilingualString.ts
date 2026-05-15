/**
 * Read the first localised value from a NeTEx `MultilingualString[]` array.
 * Returns `''` when the array is missing or empty. NeTEx schemas express
 * localised strings as an array of `{ value, lang? }` entries; we don't
 * yet branch on `lang`, so consuming the first entry is the standard
 * "primary value" accessor.
 */
export const firstText = (arr?: { value?: string }[]): string => arr?.[0]?.value ?? '';
