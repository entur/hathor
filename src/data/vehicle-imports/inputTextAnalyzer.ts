import Papa from 'papaparse';
import {
  type RegNumbersResult as FlatResult,
  regNumbersTextTransformer,
} from './regNumbersTextTransformer';

/** Structured metadata for multi-column CSV input with detected headers. */
export interface TableMeta {
  kind: 'table';
  /** Column names from the first (header) row. */
  headers: string[];
  /** Data rows keyed by header name. */
  rows: Record<string, string>[];
  /** Number of data rows (excluding the header). */
  rowCount: number;
}

/** Flat list result, extending the base result with a discriminant tag. */
export interface RegNumbersResult extends FlatResult {
  kind: 'list';
}

/**
 * Discriminated union returned by {@link inputTextAnalyzer}.
 * `'table'` when the input looks like a multi-column CSV with headers,
 * `'list'` when it is a plain list of registration numbers.
 */
export type AnalyzerResult = TableMeta | RegNumbersResult;

/**
 * Heuristic: returns true if the value does NOT look like a typical
 * registration number (pure digits, or letter-prefix + digits like "AB123").
 */
function looksLikeHeader(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  // Pure numeric → data, not a header
  if (/^\d+$/.test(trimmed)) return false;
  // Typical reg-number patterns: "AB1234", "AB 1234"
  if (/^[A-Za-z]{1,3}\s?\d+$/.test(trimmed)) return false;
  return true;
}

/**
 * Analyze pasted/uploaded text. If it looks like a multi-column CSV with
 * headers, return structured table metadata so the UI can offer column
 * mapping. Otherwise fall back to the flat registration-number list.
 */
export function inputTextAnalyzer(text: string): AnalyzerResult {
  // First pass: parse without headers to inspect structure
  const probe = Papa.parse<string[]>(text.trim(), {
    header: false,
    skipEmptyLines: true,
  });

  const rows = probe.data;
  const colCount = rows.length > 0 ? rows[0].length : 0;

  // If >=2 columns AND the first row values look non-numeric → treat as CSV with headers
  if (rows.length >= 2 && colCount >= 2) {
    const firstRow = rows[0];
    const headerish = firstRow.every(cell => looksLikeHeader(cell));

    if (headerish) {
      const parsed = Papa.parse<Record<string, string>>(text.trim(), {
        header: true,
        skipEmptyLines: true,
      });

      return {
        kind: 'table',
        headers: parsed.meta.fields ?? [],
        rows: parsed.data,
        rowCount: parsed.data.length,
      };
    }
  }

  // Fall back to flat list
  const flat = regNumbersTextTransformer(text);
  return {
    kind: 'list',
    ...flat,
  };
}
