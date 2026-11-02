/**
 * Map a cleared input to an absent field, so `''` never reads as a value.
 *
 * @param s Raw input string.
 * @returns `undefined` for the empty string, otherwise `s` unchanged.
 */
export const blankToUndefined = (s: string): string | undefined => (s === '' ? undefined : s);
