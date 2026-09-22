import { beforeAll, describe, expect, it } from 'vitest';
import i18next from 'i18next';
import { regNumbersTextTransformer } from '../regNumbersTextTransformer';
import en from '../../../locales/en/translation.json';
import nb from '../../../locales/nb/translation.json';

// Status messages now resolve through i18next, so initialise it here rather
// than asserting the uninitialised fallback — otherwise these tests would
// never exercise the plural forms they exist to pin down.
beforeAll(async () => {
  await i18next.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: { en: { translation: en }, nb: { translation: nb } },
  });
});

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
    expect(result.status.message).toBe('3 unique registration numbers (2 duplicates removed)');
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
    // Was '1 registration numbers' — the hand-rolled template had no singular.
    expect(result.status.message).toBe('1 registration number');
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

describe('regNumbersTextTransformer — plural forms', () => {
  // The two counts inflect independently, so all four combinations matter —
  // a single plural key driven by one count gets the other noun wrong.
  it.each([
    ['AB1234\nAB1234', '1 unique registration number (1 duplicate removed)'],
    ['AB1234\nAB1234\nAB1234', '1 unique registration number (2 duplicates removed)'],
    ['AB1234\nCD5678\nAB1234', '2 unique registration numbers (1 duplicate removed)'],
    ['AB1234\nCD5678\nAB1234\nCD5678', '2 unique registration numbers (2 duplicates removed)'],
  ])('inflects both counts independently: %s', (input, expected) => {
    expect(regNumbersTextTransformer(input).status.message).toBe(expected);
  });

  it('renders nb forms, singular and plural', async () => {
    await i18next.changeLanguage('nb');
    expect(regNumbersTextTransformer('AB1234').status.message).toBe('1 registreringsnummer');
    expect(regNumbersTextTransformer('AB1234\nCD5678').status.message).toBe('2 registreringsnumre');
    expect(regNumbersTextTransformer('AB1234\nAB1234').status.message).toBe(
      '1 unikt registreringsnummer (1 duplikat fjernet)'
    );
    await i18next.changeLanguage('en');
  });
});
