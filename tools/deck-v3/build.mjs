/**
 * Build `<deck-rendering-v3>` (see `entry.js`) from a local checkout of the v3
 * deck-plan editor into `concept-sandbox/vendor/deckplan-v3/`.
 *
 * v3 is not on npm, so the build borrows the checkout's own toolchain: it links
 * this directory's `node_modules` to the checkout's, which makes `vite`, `vue`
 * and Tailwind resolve to exactly the versions v3 develops against.
 *
 * Setup, once per checkout: `npm install --no-package-lock` at its root (it is a
 * bun workspace; npm reads the same `workspaces` field).
 * Run: `DECKPLAN_V3=<checkout> node concept-sandbox/tools/deck-v3/build.mjs`.
 * Defaults to a sibling `NeTEx-Deckplan-Editor` of the hathor checkout.
 */
import { copyFileSync, existsSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const SANDBOX = resolve(HERE, '../..');
const V3 = resolve(process.env.DECKPLAN_V3 ?? join(SANDBOX, '../../NeTEx-Deckplan-Editor'));
const OUT_DIR = join(SANDBOX, 'vendor/deckplan-v3');
const OUT_NAME = 'deck-rendering-v3';

const v3Modules = join(V3, 'node_modules');
if (!existsSync(join(v3Modules, 'vite')))
  throw new Error(
    `No v3 toolchain in ${v3Modules}: run \`npm install --no-package-lock\` in ${V3}`
  );
const link = join(HERE, 'node_modules');
if (!existsSync(link)) symlinkSync(v3Modules, link, 'dir');

const [{ build }, { default: vue }, { default: tailwindcss }] = await Promise.all([
  import('vite'),
  import('@vitejs/plugin-vue'),
  import('@tailwindcss/vite'),
]);

await build({
  // Tailwind detects class candidates from the root: v3's components, not hathor.
  root: join(V3, 'components'),
  configFile: false,
  logLevel: 'warn',
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@v3': V3,
      // Source, not dist: no v3 build step, and one copy of every model class
      // so the renderer's `instanceof` checks see what `loadNeTEx` made.
      'netex-deckplan-library': join(V3, 'library/src/library.ts'),
    },
    dedupe: ['vue'],
  },
  // Vue's dev branches read `process.env.NODE_ENV`; a raw-ESM page has no `process`.
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    outDir: OUT_DIR,
    emptyOutDir: true,
    lib: { entry: join(HERE, 'entry.js'), formats: ['es'], fileName: () => `${OUT_NAME}.js` },
  },
});

// MIT: the notice travels with the bundled copy.
copyFileSync(join(V3, 'LICENSE'), join(OUT_DIR, 'LICENSE'));

const git = args => execFileSync('git', ['-C', V3, ...args], { encoding: 'utf8' }).trim();
const stamp = {
  source: git(['remote', 'get-url', 'origin']),
  branch: git(['rev-parse', '--abbrev-ref', 'HEAD']),
  commit: git(['rev-parse', 'HEAD']),
  dirty: git(['status', '--porcelain', '--untracked-files=no']) !== '',
};
writeFileSync(join(OUT_DIR, 'BUILD.json'), `${JSON.stringify(stamp, null, 2)}\n`);
console.log(
  `${OUT_NAME}.js ← ${stamp.branch} @ ${stamp.commit.slice(0, 8)}${stamp.dirty ? ' (dirty)' : ''}`
);
