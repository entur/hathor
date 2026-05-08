import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { fixturesDir, targetConfig, interceptDeckPlansQuery } from './autosys-helpers';

/**
 * Regression spec for issue #63: /deck-plan must show rows with a NeTEx Name
 * before rows missing one, so the Name column isn't visually empty on first
 * load. The fix lives in src/data/deck-plans/deckPlanSortValue.ts via the
 * shared compareWithEmptyLast helper.
 */
test.describe('Deck-plan sort: blanks last (regression for issue #63)', () => {
  test.beforeAll(() => {
    fs.copyFileSync(`${fixturesDir}/config-no-auth.json`, targetConfig);
  });

  test('first load by name asc puts rows with names first', async ({ page }) => {
    if (process.env.E2E_BACKEND !== 'true') {
      await interceptDeckPlansQuery(page);
    }

    await page.goto('/deck-plan');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('table')).toBeVisible();
    await expect(page.getByTestId('total-entries')).toHaveAttribute('data-count', '10');

    // Page 1 must show all 5 named rows in lex order before any null-name rows.
    const namedInOrder = ['Plan Alpha', 'Plan Bravo', 'Plan Charlie', 'Plan Delta', 'Plan Echo'];
    for (let i = 0; i < namedInOrder.length; i++) {
      const row = page.locator('table tbody tr').nth(i);
      await expect(row).toContainText(namedInOrder[i]);
    }

    // The first row's Name cell must carry "Plan Alpha". If the comparator
    // regressed to blanks-first, the first row would be one of the null-name
    // rows (e.g. NMR:DeckPlan:2) and "Plan Alpha" would appear at row index 5.
    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow).toContainText('Plan Alpha');
  });

  test('toggling to desc keeps null-name rows last (not flipped to top)', async ({ page }) => {
    if (process.env.E2E_BACKEND !== 'true') {
      await interceptDeckPlansQuery(page);
    }

    await page.goto('/deck-plan');
    await page.waitForLoadState('networkidle');

    // Header label for the name column is "Deck Plan" (deckPlanViewConfig.ts:28).
    // First click flips orderBy='name' from asc → desc.
    await page.getByRole('button', { name: /deck plan/i }).click();

    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow).toContainText('Plan Echo');
  });
});
