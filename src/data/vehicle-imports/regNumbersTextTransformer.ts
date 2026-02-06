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
  const uniqueCount = registrationNumbers.length;
  const duplicateCount = all.length - uniqueCount;

  let message: string;
  let warnLevel: WarnLevel;

  if (uniqueCount === 0) {
    message = 'No registration numbers found';
    warnLevel = 'error';
  } else if (duplicateCount > 0) {
    message = `${uniqueCount} unique registration numbers (${duplicateCount} duplicate(s) removed)`;
    warnLevel = 'warning';
  } else {
    message = `${uniqueCount} registration numbers`;
    warnLevel = 'success';
  }

  return {
    status: { uniqueCount, message, warnLevel },
    registrationNumbers,
  };
}
