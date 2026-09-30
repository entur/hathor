import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationNB from './locales/nb/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  nb: {
    translation: translationNB,
  },
};

/**
 * Dev-time alarm for a key that resolves in no bundle — `fallbackLng`
 * included. Replaces the inline `t('key', 'Default')` pattern (#176), which
 * silently masked misses instead of surfacing them. Prod behaviour is unchanged.
 *
 * @param {string} key - The unresolved key.
 * @param {string} [def] - Caller-supplied default, if any.
 * @returns {string} `def` when given, else the raw key (i18next's default).
 */
const onMissingKey = (key: string, def?: string) => {
  if (import.meta.env.DEV) console.error(`i18n: missing key "${key}"`);
  return def ?? key;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    parseMissingKeyHandler: onMissingKey,
  });

/**
 * Mirror the active language onto `<html lang>`.
 *
 * `index.html` ships a static `lang="en"` that nothing updated, so a user on
 * Norwegian was served Norwegian text inside an element still claiming to be
 * English — screen readers pick the wrong pronunciation and CSS `:lang()`
 * never matches. The `document` guard keeps this import safe for the
 * node-environment unit tests.
 *
 * @param {string} lng - Language code to publish, e.g. `'nb'`.
 */
const syncDocLang = (lng: string) => {
  if (typeof document !== 'undefined') document.documentElement.lang = lng;
};

syncDocLang(i18n.resolvedLanguage ?? 'en');
i18n.on('languageChanged', syncDocLang);
// The i18next singleton outlives this module under HMR, so drop the listener
// when the module is replaced — otherwise dev accumulates one per reload.
import.meta.hot?.dispose(() => i18n.off('languageChanged', syncDocLang));

export default i18n;
