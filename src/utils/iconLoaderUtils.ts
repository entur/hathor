/**
 * Icon URL resolver.
 *
 * Vite's import.meta.glob yields static `fullPath -> url` maps at build time,
 * so we flatten them **once** into a single index keyed by bare icon name,
 * each name carrying up to four candidate URLs (custom/default × svg/png).
 * getIconUrl() then resolves via a fixed priority ladder — no per-call linear
 * scan, no per-call path parsing.
 */

const CUSTOM_FEATURES_LOCAL_STORAGE_KEY = 'useCustomFeatures';
const FALLBACK_NAME = 'default';
// path tail -> (custom|default)Icons/<name>.(svg|png)[?query]
const ICON_PATH = /\/(custom|default)Icons\/([^/]+)\.(svg|png)(?:\?.*)?$/;

type Source = 'custom' | 'default';
type Format = 'svg' | 'png';
type Tier = 'customSvg' | 'customPng' | 'defaultSvg' | 'defaultPng';
/** Candidate URLs for one icon name, by source × format. */
type IconEntry = Partial<Record<Tier, string>>;
type IconIndex = Map<string, IconEntry>;

/** Maps a (source, format) pair to its tier key — keeps tier strings type-safe. */
const TIER: Record<Source, Record<Format, Tier>> = {
  custom: { svg: 'customSvg', png: 'customPng' },
  default: { svg: 'defaultSvg', png: 'defaultPng' },
};

const modules = import.meta.glob(
  ['../static/customIcons/*.{svg,png}', '../static/defaultIcons/*.{svg,png}'],
  { eager: true, import: 'default' }
) as Record<string, string>;

/** name -> candidate URLs, built once at module load. */
const index: IconIndex = new Map();
for (const [path, url] of Object.entries(modules)) {
  const m = ICON_PATH.exec(path);
  if (!m) continue;
  const [, src, name, ext] = m;
  const source: Source = src === 'custom' ? 'custom' : 'default';
  const format: Format = ext === 'svg' ? 'svg' : 'png';
  index.set(name, { ...index.get(name), [TIER[source][format]]: url });
}

/** Last-resort `default.*` entry, resolved once. */
const fallback = index.get(FALLBACK_NAME);

function areCustomFeaturesEnabled(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return true;
  const v = localStorage.getItem(CUSTOM_FEATURES_LOCAL_STORAGE_KEY);
  return v ? JSON.parse(v) : true;
}

/**
 * Resolve an icon's URL by bare name (no extension).
 * Priority: custom svg → custom png → default svg → default png →
 * `default.*` fallback → '' (never throws / returns undefined).
 *
 * @param name - bare icon name, e.g. 'menu', 'train'
 * @param useCustom - override the custom-features flag (defaults to localStorage)
 * @returns resolved asset URL, or '' if nothing (incl. fallback) is found
 */
export function getIconUrl(name: string, useCustom = areCustomFeaturesEnabled()): string {
  const e = index.get(name);
  return (
    (useCustom && e?.customSvg) ||
    (useCustom && e?.customPng) ||
    e?.defaultSvg ||
    e?.defaultPng ||
    fallback?.defaultSvg ||
    fallback?.defaultPng ||
    ''
  );
}
