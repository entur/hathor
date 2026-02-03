import { describe, expect, it } from 'vitest';
import { regNumbersTextTransformer } from './regNumbersTextTransformer';

describe('regNumbersTextTransformer', () => {
  it('parses newline-separated registration numbers', () => {
    const result = regNumbersTextTransformer('AB1234\nCD5678\nEF9012');
    expect(result.registrationNumbers).toEqual(['AB1234', 'CD5678', 'EF9012']);
    expect(result.status.uniqueCount).toBe(3);
    expect(result.status.warnLevel).toBe('success');
  });

  it('parses comma-separated registration numbers', () => {
    const result = regNumbersTextTransformer('AB1234,CD5678,EF9012');
    expect(result.registrationNumbers).toEqual(['AB1234', 'CD5678', 'EF9012']);
  });

  it('handles mixed delimiters', () => {
    const result = regNumbersTextTransformer('AB1234,CD5678\nEF9012;GH3456\tIJ7890');
    expect(result.registrationNumbers).toEqual(['AB1234', 'CD5678', 'EF9012', 'GH3456', 'IJ7890']);
    expect(result.status.uniqueCount).toBe(5);
  });

  it('trims whitespace around entries', () => {
    const result = regNumbersTextTransformer('  AB1234 , CD5678 \n  EF9012  ');
    expect(result.registrationNumbers).toEqual(['AB1234', 'CD5678', 'EF9012']);
  });

  it('removes duplicates and reports warning', () => {
    const result = regNumbersTextTransformer('AB1234\nCD5678\nAB1234\nCD5678\nEF9012');
    expect(result.registrationNumbers).toEqual(['AB1234', 'CD5678', 'EF9012']);
    expect(result.status.uniqueCount).toBe(3);
    expect(result.status.warnLevel).toBe('warning');
    expect(result.status.message).toContain('2 duplicate(s) removed');
  });

  it('returns error status for empty input', () => {
    const result = regNumbersTextTransformer('');
    expect(result.registrationNumbers).toEqual([]);
    expect(result.status.uniqueCount).toBe(0);
    expect(result.status.warnLevel).toBe('error');
  });

  it('returns error status for whitespace-only input', () => {
    const result = regNumbersTextTransformer('   \n  \t  ');
    expect(result.registrationNumbers).toEqual([]);
    expect(result.status.warnLevel).toBe('error');
  });

  it('returns success for a single entry', () => {
    const result = regNumbersTextTransformer('AB1234');
    expect(result.registrationNumbers).toEqual(['AB1234']);
    expect(result.status.uniqueCount).toBe(1);
    expect(result.status.warnLevel).toBe('success');
    expect(result.status.message).toBe('1 registration numbers');
  });

  it('handles Windows-style line endings (CRLF)', () => {
    const result = regNumbersTextTransformer('AB1234\r\nCD5678\r\nEF9012');
    expect(result.registrationNumbers).toEqual(['AB1234', 'CD5678', 'EF9012']);
  });

  it('preserves order of first occurrence when deduplicating', () => {
    const result = regNumbersTextTransformer('ZZ999\nAA111\nZZ999\nBB222');
    expect(result.registrationNumbers).toEqual(['ZZ999', 'AA111', 'BB222']);
  });
});
