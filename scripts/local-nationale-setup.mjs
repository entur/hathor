// Sets up Nationale for local dev the way entur/hathor-deployment-config deploys it:
// its fonts/*.woff2 → public/fonts/v1/, and its theme's `fonts` + `fontFamily` laid over
// theme-localhost.json → public/theme-nationale.json, listed first in public/config.json.
// Every file it writes is gitignored: Nationale is licensed, this repo is public (FORK_DECISIONS 2026-11-16).
//
// Usage: node scripts/local-nationale-setup.mjs          fetch (needs `gh` with entur access) + link
//        node scripts/local-nationale-setup.mjs --link   only re-list the theme (predev/prelocal; no-op without setup)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const REPO = 'repos/entur/hathor-deployment-config/contents',
  REF = 'main';
const FONT_DIR = 'public/fonts/v1', // the deploy's path: theme `src`s point here
  THEME_FILE = 'public/theme-nationale.json',
  THEME_PATH = '/theme-nationale.json',
  CONFIG_FILE = 'public/config.json',
  BASE_THEME = '.github/environments/theme-localhost.json',
  DEPLOY_THEME = '.github/environments/theme-dev.json';

const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
const gh = (path, raw) =>
  execFileSync('gh', [
    'api',
    ...(raw ? ['-H', 'Accept: application/vnd.github.raw'] : []),
    `${REPO}/${path}?ref=${REF}`,
  ]);

/** Lists the Nationale theme first in public/config.json, once. */
const link = () => {
  if (!existsSync(THEME_FILE) || !existsSync(CONFIG_FILE)) return;
  const config = readJson(CONFIG_FILE);
  const themes = config.themeConfigs ?? [];
  if (themes.includes(THEME_PATH)) return;
  writeFileSync(
    CONFIG_FILE,
    `${JSON.stringify({ ...config, themeConfigs: [THEME_PATH, ...themes] }, null, 2)}\n`
  );
};

if (process.argv[2] === '--link') {
  link();
  process.exit(0);
}

const BAR = '='.repeat(78);
console.warn(
  [
    BAR,
    '  Nationale (Playtype) — LICENSED FONT',
    '  The files this writes are gitignored and must NEVER be added to git:',
    `    ${FONT_DIR}/*.woff2, ${THEME_FILE}`,
    '  The licence allows Nationale only on Entur sites (entur.org / entur.no).',
    '  Do not ship, publish or share it from this repo or any fork.',
    BAR,
  ].join('\n')
);

const fonts = JSON.parse(gh('fonts'))
  .map(entry => entry.name)
  .filter(name => name.endsWith('.woff2'));
if (!fonts.length) throw new Error(`No .woff2 under fonts/ in hathor-deployment-config@${REF}`);
mkdirSync(FONT_DIR, { recursive: true });
fonts.forEach(name => writeFileSync(`${FONT_DIR}/${name}`, gh(`fonts/${name}`, true)));

// Only the font bits: palette, logo and type scale stay hathor's own.
const deploy = JSON.parse(gh(DEPLOY_THEME, true));
const base = readJson(BASE_THEME);
const theme = {
  ...base,
  fonts: deploy.fonts,
  typography: { ...base.typography, fontFamily: deploy.typography.fontFamily },
};
writeFileSync(THEME_FILE, `${JSON.stringify(theme, null, 2)}\n`);
link();

console.log(
  `Wrote ${fonts.length} font(s) to ${FONT_DIR}/ and ${THEME_FILE}; listed first in ${CONFIG_FILE}.`
);
