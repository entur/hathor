import { describe, expect, it } from 'vitest';
import { translateAutosysError } from './autosysErrorTranslator';

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
