/**
 * `t()` for modules that run outside the React tree.
 *
 * Plain functions (error mappers, fetch helpers) have no `useTranslation` to
 * lean on, and reaching for the bare `i18next.t` export is unsafe: unit tests
 * run `environment: 'node'` (`vite.config.ts`) with no setup file, so they
 * import these modules without `src/i18n.ts` ever calling `init()` — an
 * uninitialised `t()` warns and returns `undefined`.
 */
import i18next from 'i18next';

const VAR = /\{\{(\w+)\}\}/g;

/**
 * Translate `key`, falling back to `fallback` when i18next is not initialised.
 *
 * @param {string} key - Bundle key, e.g. `'error.accessDenied'`.
 * @param {string} fallback - English default; also the uninitialised result.
 * @param {Record<string, unknown>} [vars] - Interpolation values. Applied to
 *   `fallback` by hand on the uninitialised path so both paths render the
 *   same shape rather than leaking raw `{{placeholders}}` into the UI.
 * @returns {string} A string safe to render.
 */
export function tOutside(key: string, fallback: string, vars?: Record<string, unknown>): string {
  if (i18next.isInitialized) return i18next.t(key, { defaultValue: fallback, ...vars });
  if (!vars) return fallback;
  return fallback.replace(VAR, (whole, name: string) =>
    name in vars ? String(vars[name]) : whole
  );
}
