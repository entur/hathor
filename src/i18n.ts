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
