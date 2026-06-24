import { test, expect } from '@playwright/test';
import { IS_LIVE, seedAuth } from './live-auth-helpers';

const ORG_ONE = {
  netexId: 'NMR:Organisation:1',
  name: { value: 'First Org' },
  type: 'AUTHORITY',
};

const ORG_TWO = {
  netexId: 'NMR:Organisation:2',
  name: { value: 'Second Org' },
  type: 'OPERATOR',
};

/**
 * Current-organisation persistence guard.
 *
 * Workflow:
 *   1) Seed authenticated session (mock OIDC in mock mode).
 *   2) Mock organisations query with two orgs.
 *   3) Select the second org in the header picker.
 *   4) Reload page and assert the same org stays selected.
 *   5) Assert localStorage key mirrors the selected org id.
 */
test.describe('Current organisation persistence', () => {
  test.beforeEach(async ({ context }) => {
    test.skip(IS_LIVE, 'Mock-only: pins deterministic multi-org persistence behavior');
    await seedAuth(context);
  });

  test('selected organisation is restored after reload', async ({ page }) => {
    await page.route('**/graphql', async route => {
      const query: string = route.request().postDataJSON()?.query ?? '';
      if (!query.includes('organisations(')) {
        await route.fallback();
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            organisations: {
              content: [ORG_ONE, ORG_TWO],
              totalElements: 2,
              page: 0,
              size: 10000,
            },
          },
        }),
      });
    });

    await page.goto('/');
    const orgPicker = page.getByRole('banner').getByRole('combobox').first();

    await expect(orgPicker).toBeVisible();
    await expect(orgPicker).toHaveValue('First Org (AUTHORITY)');

    await orgPicker.click();
    await page.getByRole('option', { name: 'Second Org (OPERATOR)' }).click();
    await expect(orgPicker).toHaveValue('Second Org (OPERATOR)');

    const selectedIdBeforeReload = await page.evaluate(() =>
      window.localStorage.getItem('hathor:currentOrganisationId')
    );
    expect(selectedIdBeforeReload).toBe('NMR:Organisation:2');

    await page.reload();
    await expect(orgPicker).toBeVisible();
    await expect(orgPicker).toHaveValue('Second Org (OPERATOR)');

    const selectedIdAfterReload = await page.evaluate(() =>
      window.localStorage.getItem('hathor:currentOrganisationId')
    );
    expect(selectedIdAfterReload).toBe('NMR:Organisation:2');
  });
});
