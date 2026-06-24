import { test, expect } from '@playwright/test';
import { interceptDeckPlansQuery } from './autosys-helpers';
import { IS_LIVE, seedAuth } from './live-auth-helpers';

/**
 * /deck-plans — Name-column sort orders blank/null names last (regression #63).
 *
 * Workflow:
 *   load /deck-plans → assert table → assert named rows sort before null-name
 *   rows on initial asc load → click the "Deck Plan" header to flip asc→desc →
 *   assert null-name rows stay last (not flipped to top)
 *   (fix: src/data/deck-plans/utils/deckPlanSortValue.ts via compareWithEmptyLast)
 * Covers:
 *   - first load (name asc): 5 named rows ("Plan Alpha".."Plan Echo") in lex
 *     order before any null-name row; row 0 is "Plan Alpha"
 *   - desc toggle keeps null-name rows last; row 0 becomes "Plan Echo"
 * Modes:
 *   - mock (E2E_BACKEND unset): intercepts `deckPlans` with the 10-row fixture
 *     (5 named + 5 null-name); asserts exact count 10 and the named ordering
 *   - skip-live: whole describe skips under live — AtB deck plans are all
 *     blank-named, so blanks-last can't be exercised (would be vacuously green)
 */
test.describe('Deck-plan sort: blanks last (regression for issue #63)', () => {
  test.beforeEach(async ({ context }) => seedAuth(context));

  // Blanks-last ordering needs a mix of named and unnamed rows. Live AtB deck
  // plans are *all* blank-named, so the comparator can't be exercised against
  // real data — assertions would be vacuously green. Kept mock-only (honest
  // data limitation, not a hidden defect).
  test.skip(IS_LIVE, 'AtB deck plans are all blank-named; blanks-last needs named rows');

  test('first load by name asc puts rows with names first', async ({ page }) => {
    if (!IS_LIVE) {
      await interceptDeckPlansQuery(page);
    }

    await page.goto('/deck-plans');

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
    if (!IS_LIVE) {
      await interceptDeckPlansQuery(page);
    }

    await page.goto('/deck-plans');
    await page.waitForLoadState('networkidle');

    // Header label for the name column is "Name" (deckPlans.field.name).
    // First click flips orderBy='name' from asc → desc. Exact match: avoids
    // colliding with the "New Deck Plan" action-row button.
    await page.getByRole('button', { name: 'Name', exact: true }).click();

    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow).toContainText('Plan Echo');
  });
});
