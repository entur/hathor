import { test, expect, type Page } from '@playwright/test';
import { setConfig } from './live-auth-helpers';

/**
 * Theme roll-up — `config.json` `themeConfigs` (#202): the first theme is the default,
 * two or more give a picker in Settings, and a theme's `fonts.faces` become `@font-face`.
 *
 * Workflow:
 *   setConfig 'auth-off' (+ a second theme, served by route) → goto / → open Settings
 *   → assert the picker, pick the second theme, assert header colour + font, reload
 * Covers:
 *   - one theme: Settings has no theme picker
 *   - two themes: picking the second recolours the header and sets its font stack;
 *     the pick survives a reload (the @font-face text is unit-tested: themeFonts.test.ts)
 *   - while the theme JSON loads: a neutral loader, no header in MUI's default blue; the
 *     loader holds still under reduced motion
 * Modes:
 *   - mock and live alike: themes are static files, no backend involved
 */

const BASE_THEME = '/theme-dev.json',
  ALT_THEME = '/alt-theme.json';
const ALT_PRIMARY = 'rgb(0, 128, 0)',
  ENTUR_PRIMARY = 'rgb(24, 28, 86)';
const ALT_FAMILY = 'AltFace';
const ALT_THEME_BODY = {
  applicationName: 'Alt',
  companyName: 'Alt',
  palette: { primary: { main: '#008000' } },
  fonts: {
    faces: [{ family: ALT_FAMILY, src: '/fonts/alt.woff2', format: 'woff2', weight: '500' }],
  },
  typography: { fontFamily: `"${ALT_FAMILY}", Arial, sans-serif` },
  logoUrl: '/assets/entur-logo.png',
  logoHeight: 20,
};

const themePicker = (page: Page) => page.getByRole('combobox', { name: /^Theme/ });

const openSettings = async (page: Page) => {
  await page.goto('/');
  await expect(page.locator('.app-content')).toBeVisible();
  await page.getByRole('button', { name: 'settings' }).click();
};

test.describe('Theme picker', () => {
  test.use({ locale: 'en-US' });

  test('one theme: no picker', async ({ page }) => {
    await setConfig(page, 'auth-off');
    await openSettings(page);
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(themePicker(page)).toHaveCount(0);
  });

  test('two themes: picking the second applies it and survives a reload', async ({ page }) => {
    await setConfig(page, 'auth-off', { themeConfigs: [BASE_THEME, ALT_THEME] });
    await page.route(`**${ALT_THEME}`, route => route.fulfill({ json: ALT_THEME_BODY }));
    await openSettings(page);

    await themePicker(page).click();
    await page.getByRole('option', { name: 'Alt Theme' }).click();
    await page.keyboard.press('Escape');

    const header = page.locator('header').first();
    await expect(header).toHaveCSS('background-color', ALT_PRIMARY);
    await expect(page.locator('body')).toHaveCSS('font-family', new RegExp(ALT_FAMILY));

    await page.reload();
    await expect(header).toHaveCSS('background-color', ALT_PRIMARY);
  });

  test('until the theme loads: a loader, never a default-blue header', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await setConfig(page, 'auth-off');
    let release!: () => void;
    const held = new Promise<void>(resolve => (release = resolve));
    await page.route(`**${BASE_THEME}`, async route => {
      await held;
      await route.continue();
    });
    await page.goto('/');

    await expect(page.getByRole('status')).toHaveText('Loading…');
    await expect(page.locator('header')).toHaveCount(0);
    await expect(page.getByRole('status').locator('animateTransform')).toHaveCount(0);

    release();
    await expect(page.locator('header').first()).toHaveCSS('background-color', ENTUR_PRIMARY);
    await expect(page.getByRole('status')).toHaveCount(0);
  });
});
