import type { ImportEntry } from './types';

/** Parse "AB1234:OP-001" into an ImportEntry. Colon separates reg from ref. */
export function parseEntryInput(raw: string): ImportEntry | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const colonIdx = trimmed.indexOf(':');
  if (colonIdx === -1) {
    return { queryRegNumber: trimmed };
  }

  const queryRegNumber = trimmed.slice(0, colonIdx).trim();
  const operationalRef = trimmed.slice(colonIdx + 1).trim() || undefined;
  if (!queryRegNumber) return null;

  return { queryRegNumber, operationalRef };
}
