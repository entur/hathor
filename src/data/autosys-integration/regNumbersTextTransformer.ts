import type { ImportEntry } from './types';

/** Severity level for the status message returned after parsing. */
export type WarnLevel = 'success' | 'info' | 'warning' | 'error';

/** Summary of the parsing outcome (count, human-readable message, severity). */
export interface RegNumbersStatus {
  uniqueCount: number;
  message: string;
  warnLevel: WarnLevel;
}

/** Deduplicated registration numbers together with a parsing status summary. */
export interface RegNumbersResult {
  status: RegNumbersStatus;
  registrationNumbers: string[];
}

/** Build a status summary from unique/total counts. */
function buildStatus(uniqueCount: number, totalCount: number): RegNumbersStatus {
  const duplicateCount = totalCount - uniqueCount;
  if (uniqueCount === 0) {
    return { uniqueCount, message: 'No registration numbers found', warnLevel: 'error' };
  }
  if (duplicateCount > 0) {
    return {
      uniqueCount,
      message: `${uniqueCount} unique registration numbers (${duplicateCount} duplicate(s) removed)`,
      warnLevel: 'warning',
    };
  }
  return { uniqueCount, message: `${uniqueCount} registration numbers`, warnLevel: 'success' };
}

/**
 * Parse a raw text blob (CSV, TXT, or pasted content) into a deduplicated
 * list of registration numbers.  Splits on commas, semicolons, tabs, and
 * newlines, trims whitespace, and drops empty entries.
 */
export function regNumbersTextTransformer(text: string): RegNumbersResult {
  const all = text
    .split(/[,;\t\n\r]+/)
    .map(s => s.trim())
    .filter(Boolean);

  const registrationNumbers = [...new Set(all)];
  return { status: buildStatus(registrationNumbers.length, all.length), registrationNumbers };
}

/** Deduplicated import entries together with a status summary. */
export interface DeduplicatedEntriesResult {
  entries: ImportEntry[];
  status: RegNumbersStatus;
}

/** Deduplicate ImportEntry[] by queryRegNumber, preserving first occurrence. */
export function deduplicateEntries(entries: ImportEntry[]): DeduplicatedEntriesResult {
  const seen = new Set<string>();
  const deduped: ImportEntry[] = [];
  for (const e of entries) {
    if (!seen.has(e.queryRegNumber)) {
      seen.add(e.queryRegNumber);
      deduped.push(e);
    }
  }
  return { entries: deduped, status: buildStatus(deduped.length, entries.length) };
}
