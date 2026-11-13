import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

// ESM doesn't expose __dirname; derive once from import.meta.url. Used by the
// storybook plugin's configDir.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5000,
  },
  publicDir: 'public',
  optimizeDeps: {
    // The deck renderer is reached only through a dynamic import inside a
    // lazily-loaded module, so Vite's initial scan misses it and the first
    // import races re-optimization ("Failed to fetch dynamically imported
    // module"). Pre-bundle it at startup instead.
    include: ['@opentrainticketing/netex-deckplan-editor/webcomponent'],
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          globals: true,
          environment: 'node',
          include: ['src/**/*.test.{ts,tsx}'],
          // Initialise i18next once for the whole project (as
          // `.storybook/preview.tsx` and `src/main.tsx` do for their entries),
          // pinned to English so the host locale can't change assertions.
          // Without it `i18next.t()` is unbound and returns `undefined`, so
          // every module that localises a string would need a guarded wrapper.
          setupFiles: ['src/vitest.setup.ts'],
          // The DataGrid collection tests (first `import('@mui/x-data-grid')`,
          // jsdom + MUI renders) overrun the 5s/10s defaults on a cold Windows
          // machine where every file runs in parallel.
          testTimeout: 30_000,
          hookTimeout: 30_000,
          // vitest's worker start-up timeout is hard-coded, and a many-core
          // dev machine starting a fork per core trips it ("Failed to start
          // forks worker"), silently skipping files. Cap locally; CI keeps the
          // default.
          maxWorkers: process.env.CI ? undefined : 4,
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(__dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
});
