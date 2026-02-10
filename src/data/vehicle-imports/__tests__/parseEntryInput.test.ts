import { describe, expect, it } from 'vitest';
import { parseEntryInput } from '../parseEntryInput';

describe('parseEntryInput', () => {
  it('parses a plain registration number', () => {
    expect(parseEntryInput('AB1234')).toEqual({ queryRegNumber: 'AB1234' });
  });

  it('parses reg number with operational ref separated by colon', () => {
    expect(parseEntryInput('AB1234:OP-001')).toEqual({
      queryRegNumber: 'AB1234',
      operationalRef: 'OP-001',
    });
  });

  it('trims whitespace around input', () => {
    expect(parseEntryInput('  AB1234  ')).toEqual({ queryRegNumber: 'AB1234' });
  });

  it('trims whitespace around both parts', () => {
    expect(parseEntryInput(' AB1234 : OP-001 ')).toEqual({
      queryRegNumber: 'AB1234',
      operationalRef: 'OP-001',
    });
  });

  it('returns null for empty string', () => {
    expect(parseEntryInput('')).toBeNull();
  });

  it('returns null for whitespace-only input', () => {
    expect(parseEntryInput('   ')).toBeNull();
  });

  it('returns null when colon is first character (no reg number)', () => {
    expect(parseEntryInput(':OP-001')).toBeNull();
  });

  it('omits operationalRef when colon has empty right side', () => {
    expect(parseEntryInput('AB1234:')).toEqual({ queryRegNumber: 'AB1234' });
  });

  it('uses only the first colon as separator', () => {
    expect(parseEntryInput('AB1234:OP:extra')).toEqual({
      queryRegNumber: 'AB1234',
      operationalRef: 'OP:extra',
    });
  });
});
