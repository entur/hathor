import { afterAll, describe, expect, it } from 'vitest';
import i18next from 'i18next';
import { tOutside } from './tOutside';

describe('tOutside — uninitialised i18next', () => {
  it('returns the fallback rather than undefined', () => {
    // Before init this is `undefined`, not `false` — the guard relies on
    // falsiness, so assert that rather than a specific value.
    expect(i18next.isInitialized).toBeFalsy();
    expect(tOutside('error.unexpected', 'An unexpected error occurred')).toBe(
      'An unexpected error occurred'
    );
  });

  it('interpolates the fallback by hand so no {{placeholder}} leaks', () => {
    expect(tOutside('error.serverError', 'Server error ({{status}})', { status: 500 })).toBe(
      'Server error (500)'
    );
  });

  it('leaves a placeholder alone when no value is supplied for it', () => {
    expect(tOutside('x', 'Server error ({{status}})', { other: 1 })).toBe(
      'Server error ({{status}})'
    );
  });
});

describe('tOutside — initialised i18next', () => {
  afterAll(() => {
    void i18next.changeLanguage('en');
  });

  it('resolves the key and interpolates through i18next', async () => {
    await i18next.init({
      lng: 'nb',
      resources: {
        nb: { translation: { 'error.serverError': 'Serverfeil ({{status}})' } },
      },
    });

    expect(tOutside('error.serverError', 'Server error ({{status}})', { status: 503 })).toBe(
      'Serverfeil (503)'
    );
  });

  it('falls back to the default value for a key the bundle lacks', () => {
    expect(tOutside('error.notInBundle', 'Some default')).toBe('Some default');
  });
});
