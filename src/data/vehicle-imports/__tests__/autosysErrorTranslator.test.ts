import { afterAll, describe, expect, it } from 'vitest';
import i18next from 'i18next';
import { translateAutosysError } from '../autosysErrorTranslator';
import en from '../../../locales/en/translation.json';
import nb from '../../../locales/nb/translation.json';

describe('translateAutosysError', () => {
  it('translates incomplete autosys data error', () => {
    const raw =
      'Cannot invoke "org.entur.autosys.model.KjoretoyData.getKjoretoyId()" because the return value of something is null';
    expect(translateAutosysError(raw)).toBe('Incomplete vehicle data in Autosys');
  });

  it('translates bad format / unknown registration number error', () => {
    const raw = '400 Bad Request: "{"feilmelding":"UGYLDIG_FORMAT_UNR_ELLER_KJENNEMERKE"}"';
    expect(translateAutosysError(raw)).toBe('Invalid format or unknown registration number');
  });

  it('returns the raw message when no pattern matches', () => {
    const raw = 'Some other unexpected error';
    expect(translateAutosysError(raw)).toBe(raw);
  });
});

/**
 * The bug this guards: every pattern carried a `key` that the lookup never
 * used, so the English `defaultMessage` was returned verbatim in every
 * language. Asserting against `nb` is the only way to see the difference —
 * an `en` assertion passes either way.
 */
describe('translateAutosysError (i18n initialised)', () => {
  const INCOMPLETE =
    'Cannot invoke "org.entur.autosys.model.KjoretoyData.getKjoretoyId()" because the return value of something is null';
  const BAD_FORMAT = '400 Bad Request: "{"feilmelding":"UGYLDIG_FORMAT_UNR_ELLER_KJENNEMERKE"}"';

  afterAll(() => {
    void i18next.changeLanguage('en');
  });

  it('resolves each pattern key against the nb bundle', async () => {
    await i18next.init({
      lng: 'nb',
      fallbackLng: 'en',
      resources: { en: { translation: en }, nb: { translation: nb } },
    });

    expect(translateAutosysError(INCOMPLETE)).toBe('Ufullstendig kjøretøydata i Autosys');
    expect(translateAutosysError(BAD_FORMAT)).toBe(
      'Ugyldig format eller ukjent registreringsnummer'
    );
  });

  it('resolves the same keys against the en bundle', async () => {
    await i18next.changeLanguage('en');

    expect(translateAutosysError(INCOMPLETE)).toBe('Incomplete vehicle data in Autosys');
    expect(translateAutosysError(BAD_FORMAT)).toBe('Invalid format or unknown registration number');
  });

  it('still passes through an unmatched message untouched', () => {
    expect(translateAutosysError('Some other unexpected error')).toBe(
      'Some other unexpected error'
    );
  });
});
