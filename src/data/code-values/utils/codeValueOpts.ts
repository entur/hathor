import type { CodeValue } from '../types/codeValueTypes.ts';

/**
 * Dropdown options for a code-list-backed free `String` field: the code list,
 * led by the stored value when it falls outside the list so it stays selected
 * instead of blanking — Sobek's full-document save would otherwise null it.
 *
 * @param codes Code list, in display order.
 * @param cur   Stored field value, if any.
 * @returns Options in display order.
 */
export const codeValueOpts = (codes: readonly CodeValue[], cur?: string): readonly CodeValue[] =>
  cur && !codes.some(c => c.value === cur) ? [{ value: cur, label: cur }, ...codes] : codes;
