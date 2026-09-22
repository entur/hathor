import { afterAll, describe, expect, it } from 'vitest';
import i18next from 'i18next';
import { translateAutosysError } from '../autosysErrorTranslator';

const INCOMPLETE =
  'Cannot invoke "org.entur.autosys.model.KjoretoyData.getKjoretoyId()" because the return value of something is null';
const BAD_FORMAT = '400 Bad Request: "{"feilmelding":"UGYLDIG_FORMAT_UNR_ELLER_KJENNEMERKE"}"';

/**
 * The bug the nb case guards: every pattern carried a `key` that the lookup
 * never used, so the English `defaultMessage` was returned verbatim in every
 * language. Asserting against `nb` is the only way to see the difference —
 * an `en` assertion passes either way.
 */
describe('translateAutosysError', () => {
  afterAll(async () => {
    await i18next.changeLanguage('en');
  });

  it('resolves each pattern key against the en bundle', () => {
    expect(translateAutosysError(INCOMPLETE)).toBe('Incomplete vehicle data in Autosys');
    expect(translateAutosysError(BAD_FORMAT)).toBe('Invalid format or unknown registration number');
  });

  it('resolves the same keys against the nb bundle', async () => {
    await i18next.changeLanguage('nb');

    expect(translateAutosysError(INCOMPLETE)).toBe('Ufullstendig kjøretøydata i Autosys');
    expect(translateAutosysError(BAD_FORMAT)).toBe(
      'Ugyldig format eller ukjent registreringsnummer'
    );
  });

  it('returns the raw message when no pattern matches', () => {
    const raw = 'Some other unexpected error';
    expect(translateAutosysError(raw)).toBe(raw);
  });
});
