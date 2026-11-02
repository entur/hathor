import { test, expect } from '@playwright/test';
import { setConfig } from './live-auth-helpers';

/**
 * Localised browser title — `<title>` follows the active language via the
 * `app.title` key (src/i18n.ts `syncDoc`), on load and on language change.
 *
 * Workflow:
 *   browser locale → setConfig 'auth-off' → goto / and wait for `.app-content`
 *   → assert the title (and, for the switch, change language in Settings)
 * Covers:
 *   - load: `en` and `nb` locales get their own title
 *   - fallback: `no` / `nn` locales get the Bokmål title, not English
 *   - switch: changing language in Settings retitles the tab
 * Modes:
 *   - mock and live alike: the title is client-side i18n, no backend involved
 */

const EN_TITLE = 'National Vehicle Registry',
  NB_TITLE = 'Nasjonalt Materiellregister';

const LOAD_CASES = [
  { locale: 'en-US', title: EN_TITLE },
  { locale: 'nb-NO', title: NB_TITLE },
  { locale: 'no', title: NB_TITLE },
  { locale: 'nn-NO', title: NB_TITLE },
];

test.describe('Localised browser title', () => {
  LOAD_CASES.forEach(({ locale, title }) =>
    test.describe(`locale ${locale}`, () => {
      test.use({ locale });

      test(`loads with "${title}"`, async ({ page }) => {
        await setConfig(page, 'auth-off');
        await page.goto('/');
        await expect(page.locator('.app-content')).toBeVisible();
        await expect(page).toHaveTitle(title);
      });
    })
  );

  test.describe('language switch', () => {
    test.use({ locale: 'en-US' });

    test('switching to Norsk retitles the tab', async ({ page }) => {
      await setConfig(page, 'auth-off');
      await page.goto('/');
      await expect(page).toHaveTitle(EN_TITLE);

      await page.getByRole('button', { name: 'settings' }).click();
      await page.getByRole('combobox').click();
      await page.getByRole('option', { name: 'Norsk (Bokmål)' }).click();

      await expect(page).toHaveTitle(NB_TITLE);
      await expect(page.locator('html')).toHaveAttribute('lang', 'nb');
    });
  });
});
