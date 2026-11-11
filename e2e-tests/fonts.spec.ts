import { test, expect } from '@playwright/test';
import { setConfig } from './live-auth-helpers';

/**
 * Fonts — hathor loads no web font from Google (#255): the index.html link to three unused
 * handwriting fonts is gone, so no user IP goes to Google. Nationale itself is not loaded yet;
 * the theme falls back to Arial, Linje's support font.
 *
 * Workflow:
 *   setConfig 'auth-off' → record requests → goto / and wait for `.app-content`
 * Covers:
 *   - nothing requested from fonts.googleapis.com / fonts.gstatic.com
 * Modes:
 *   - mock and live alike: no backend involved
 */

const GOOGLE_FONTS = /fonts\.(googleapis|gstatic)\.com/;

test.describe('Fonts', () => {
  test('loads no web font from Google', async ({ page }) => {
    const google: string[] = [];
    page.on('request', r => GOOGLE_FONTS.test(r.url()) && google.push(r.url()));
    await setConfig(page, 'auth-off');
    await page.goto('/');
    await expect(page.locator('.app-content')).toBeVisible();
    expect(google).toEqual([]);
  });
});
