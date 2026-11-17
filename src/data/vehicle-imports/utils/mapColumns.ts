import type { ImportEntry } from '../types/importTypes';

/** Which sheet columns hold the registration number and, optionally, the operational id.
 *  A key is the column's header text, which may be blank (''). */
export interface ColumnMapping {
  regNumberCol: string;
  operationalRefCol: string | null;
}

/**
 * Reads import entries out of a pasted sheet's rows by the chosen columns. Rows with no
 * registration are dropped; a blank operational id is left out.
 *
 * @param {Record<string, string>[]} rows the sheet's data rows, keyed by header
 * @param {ColumnMapping} mapping the chosen columns; `null` = no operational-id column
 * @returns {ImportEntry[]} one entry per row that has a registration
 */
export const mapColumns = (
  rows: readonly Record<string, string>[],
  { regNumberCol, operationalRefCol }: ColumnMapping
): ImportEntry[] =>
  rows
    .map(row => ({
      queryRegNumber: (row[regNumberCol] ?? '').trim(),
      // A blank header is a real column: test for null, not truthiness.
      operationalRef:
        operationalRefCol === null ? undefined : (row[operationalRefCol] ?? '').trim() || undefined,
    }))
    .filter(e => e.queryRegNumber);
