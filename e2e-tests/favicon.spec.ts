import { test, expect, type Page } from '@playwright/test';
import { setConfig } from './live-auth-helpers';

/**
 * Per-environment favicon — config.json's `faviconPath` picks which
 * `M-favicon*.svg` the tab shows (dev green, stage amber, prod coral).
 *
 * Workflow:
 *   setConfig 'auth-off' with / without a `faviconPath` override
 *   → goto / and wait for `.app-content` (config applied) → assert the icon link's href
 * Covers:
 *   - set: the icon link points at the configured SVG
 *   - unset: the icon link keeps index.html's default
 * Modes:
 *   - mock and live alike: the favicon is client-side config, served by route interception
 */

const DEFAULT_FAVICON = '/assets/M-favicon.svg';
const PROD_FAVICON = '/assets/M-favicon-prod.svg';

/** The icon link's href once the app has rendered (and so applied the config). */
const faviconHref = async (page: Page) => {
  await page.goto('/');
  await expect(page.locator('.app-content')).toBeVisible();
  return page.locator('link[rel="icon"]').getAttribute('href');
};

test.describe('Per-environment favicon', () => {
  test('faviconPath in config selects the icon', async ({ page }) => {
    await setConfig(page, 'auth-off', { faviconPath: PROD_FAVICON });
    expect(await faviconHref(page)).toBe(PROD_FAVICON);
  });

  test('no faviconPath keeps the index.html default', async ({ page }) => {
    await setConfig(page, 'auth-off');
    expect(await faviconHref(page)).toBe(DEFAULT_FAVICON);
  });
});
