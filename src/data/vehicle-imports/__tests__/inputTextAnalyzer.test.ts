import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { inputTextAnalyzer } from '../inputTextAnalyzer';

const multiColCsv = readFileSync(new URL('./__fixtures__/multi-col.csv', import.meta.url), 'utf-8');

describe('inputTextAnalyzer', () => {
  it('returns kind "list" for plain newline-separated values', () => {
    const result = inputTextAnalyzer('AB1234\nCD5678\nEF9012');
    expect(result.kind).toBe('list');
    if (result.kind === 'list') {
      expect(result.registrationNumbers).toEqual(['AB1234', 'CD5678', 'EF9012']);
      expect(result.status.warnLevel).toBe('success');
    }
  });

  it('returns kind "list" for comma-separated single values', () => {
    const result = inputTextAnalyzer('AB1234,CD5678,EF9012');
    expect(result.kind).toBe('list');
    if (result.kind === 'list') {
      expect(result.registrationNumbers).toEqual(['AB1234', 'CD5678', 'EF9012']);
    }
  });

  it('returns kind "table" for CSV with header row', () => {
    const result = inputTextAnalyzer('regNumber,operationalId\nAB123,OP1\nCD456,OP2');
    expect(result.kind).toBe('table');
    if (result.kind === 'table') {
      expect(result.headers).toEqual(['regNumber', 'operationalId']);
      expect(result.rowCount).toBe(2);
      expect(result.rows[0]).toEqual({ regNumber: 'AB123', operationalId: 'OP1' });
      expect(result.rows[1]).toEqual({ regNumber: 'CD456', operationalId: 'OP2' });
    }
  });

  it('returns kind "list" for CSV without header (all rows look like data)', () => {
    const result = inputTextAnalyzer('AB123,CD456\nEF789,GH012');
    expect(result.kind).toBe('list');
    if (result.kind === 'list') {
      expect(result.registrationNumbers).toContain('AB123');
      expect(result.registrationNumbers).toContain('CD456');
    }
  });

  it('returns kind "table" for TSV with headers', () => {
    const result = inputTextAnalyzer('regNumber\toperationalId\nAB123\tOP1\nCD456\tOP2');
    expect(result.kind).toBe('table');
    if (result.kind === 'table') {
      expect(result.headers).toEqual(['regNumber', 'operationalId']);
      expect(result.rowCount).toBe(2);
    }
  });

  it('returns kind "list" with error status for empty input', () => {
    const result = inputTextAnalyzer('');
    expect(result.kind).toBe('list');
    if (result.kind === 'list') {
      expect(result.registrationNumbers).toEqual([]);
      expect(result.status.warnLevel).toBe('error');
    }
  });

  it('returns kind "list" for single-column CSV with header', () => {
    // Single column — even if first row looks like a header, we treat as flat list
    // because there's no second column to map
    const result = inputTextAnalyzer('regNumber\nAB123\nCD456');
    expect(result.kind).toBe('list');
    if (result.kind === 'list') {
      expect(result.registrationNumbers).toContain('regNumber');
      expect(result.registrationNumbers).toContain('AB123');
    }
  });

  it('returns kind "table" for CSV with three columns', () => {
    const result = inputTextAnalyzer(
      'regNumber,operationalId,depot\nAB123,OP1,Oslo\nCD456,OP2,Bergen'
    );
    expect(result.kind).toBe('table');
    if (result.kind === 'table') {
      expect(result.headers).toEqual(['regNumber', 'operationalId', 'depot']);
      expect(result.rowCount).toBe(2);
      expect(result.rows[0]).toEqual({ regNumber: 'AB123', operationalId: 'OP1', depot: 'Oslo' });
    }
  });

  it('handles semicolon-delimited CSV with headers', () => {
    const result = inputTextAnalyzer('regNumber;operationalId\nAB123;OP1');
    expect(result.kind).toBe('table');
    if (result.kind === 'table') {
      expect(result.headers).toEqual(['regNumber', 'operationalId']);
      expect(result.rows[0]).toEqual({ regNumber: 'AB123', operationalId: 'OP1' });
    }
  });

  it('parses real multi-column fleet CSV from fixture', () => {
    const result = inputTextAnalyzer(multiColCsv);
    expect(result.kind).toBe('table');
    if (result.kind === 'table') {
      expect(result.headers).toContain('Int.nr');
      expect(result.headers).toContain('Reg.nr');
      expect(result.headers).toContain('Merke');
      expect(result.headers).toContain('Type');
      expect(result.headers).toContain('Chassis nr.');
      expect(result.rowCount).toBe(10);
      expect(result.rows[0]['Reg.nr']).toBe('AA11111');
      expect(result.rows[0]['Merke']).toBe('Van Hool');
      expect(result.rows[1]['Merke']).toBe('');
    }
  });
});
