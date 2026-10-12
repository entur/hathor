/** One entry of a Sobek code list: the stored `value` and its display `label`. */
export interface CodeValue {
  value: string;
  label: string;
}

/**
 * Sobek `CodeValue.valueType` keys hathor reads. The wire type is a free
 * `String`, not an enum — these name the lists seeded in Sobek's `code_value` table.
 */
export const EMISSION_STANDARD = 'EMISSION_STANDARD';

/** A code list key hathor knows about. */
export type CodeValueType = typeof EMISSION_STANDARD;
