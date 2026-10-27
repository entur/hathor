import { afterAll, describe, expect, it } from 'vitest';
import i18next from 'i18next';
import { translateAutosysError } from './autosysErrorTranslator';
import { NOT_FOUND, UPSTREAM_ERROR } from '../api/__fixtures__/makeXml';

/**
 * The bug the nb case guards: every entry carried a `key` that the lookup
 * never used, so the English `defaultMessage` was returned verbatim in every
 * language. Asserting against `nb` is the only way to see the difference —
 * an `en` assertion passes either way.
 */
describe('translateAutosysError', () => {
  afterAll(async () => {
    await i18next.changeLanguage('en');
  });

  it('resolves each shepet error code against the en bundle', () => {
    expect(translateAutosysError(NOT_FOUND)).toBe('Invalid format or unknown registration number');
    expect(translateAutosysError(UPSTREAM_ERROR)).toBe('Autosys lookup failed');
  });

  it('resolves the same codes against the nb bundle', async () => {
    await i18next.changeLanguage('nb');

    expect(translateAutosysError(NOT_FOUND)).toBe(
      'Ugyldig format eller ukjent registreringsnummer'
    );
    expect(translateAutosysError(UPSTREAM_ERROR)).toBe('Oppslag i Autosys feilet');
  });

  it('returns the raw value when the code is unknown', () => {
    const raw = 'Some other unexpected error';
    expect(translateAutosysError(raw)).toBe(raw);
  });
});
