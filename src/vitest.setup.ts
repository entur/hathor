import i18n from './i18n';

// Pin the unit-test language. i18n.ts auto-detects from `navigator.language`,
// which Node 21+ exposes from the host OS locale — so on a Norwegian machine
// every test asserting an English string failed while CI (en-US) passed.
await i18n.changeLanguage('en');
