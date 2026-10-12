import { describe, expect, it } from 'vitest';
import { codeValueOpts } from './codeValueOpts.ts';

const CODES = [
  { value: 'Euro5', label: 'Euro 5' },
  { value: 'Euro6', label: 'Euro 6' },
];

describe('codeValueOpts', () => {
  it('returns the code list when nothing is stored', () => {
    expect(codeValueOpts(CODES)).toBe(CODES);
    expect(codeValueOpts(CODES, '')).toBe(CODES);
  });

  it('returns the code list unchanged for a stored value in the list', () => {
    expect(codeValueOpts(CODES, 'Euro6')).toBe(CODES);
  });

  it.each(['EURO6', 'Euro 6', 'U', 'Euro VI'])(
    'leads with the out-of-list stored value %s so it stays selectable',
    cur => {
      expect(codeValueOpts(CODES, cur)).toEqual([{ value: cur, label: cur }, ...CODES]);
    }
  );

  it('keeps the stored value selectable before the code list has loaded', () => {
    expect(codeValueOpts([], 'Euro6')).toEqual([{ value: 'Euro6', label: 'Euro6' }]);
  });
});
