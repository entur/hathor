import { test, expect } from '@playwright/test';
import { interceptVehicleListQuery } from './vehicle-list-helpers';
import { IS_LIVE, writeConfig, seedAuth, selectFirstOrg } from './live-auth-helpers';

/**
 * /vehicles compact (narrow-width) overflow row — the expandable detail box must
 * render TRANSLATED column labels, never raw i18n keys.
 *
 * At a container width below COMPACT_VIEW_THRESHOLD (700px) the `desktop-only`
 * columns (operationalNumber, transportTypeMode, version) drop out of the table
 * and into a per-row expandable detail box (`MobileDetailRow`). That box printed
 * `col.headerLabel` verbatim, but the Vehicles config sets `headerLabel` to i18n
 * KEYS (`vehicles.field.*`) — so the raw keys leaked on screen instead of the
 * translated text the header row shows via `t(col.headerLabel)`.
 *
 * Workflow:
 *   narrow the viewport (< 700 container) → goto /vehicles → select org → wait
 *   for rows → click the first row's expand chevron → assert the table shows the
 *   translated label ("Operational Number") and contains NO `vehicles.field.` key.
 * Covers:
 *   - MobileDetailRow runs `headerLabel` through i18next (parity with
 *     DataTableHeader); no raw key text reaches the user in compact mode.
 * Modes:
 *   - mock (E2E_SUITE=no-auth): seedAuth + interceptVehicleListQuery serve the
 *     15-row fixture; the overflow row is a pure client-render concern.
 *   - live (E2E_BACKEND=true): same flow against real rows; selectFirstOrg picks
 *     the org, the fixture intercept is not registered.
 */
test.describe('/vehicles compact detail row shows translated labels, not raw i18n keys (no-auth)', () => {
  test.beforeAll(() => writeConfig());

  test.beforeEach(async ({ page, context }) => {
    await seedAuth(context);
    if (!IS_LIVE) await interceptVehicleListQuery(page);
  });

  test('expanding a row at narrow width renders the i18n-resolved column label', async ({
    page,
  }) => {
    // Below COMPACT_VIEW_THRESHOLD (700) so the table container goes compact and
    // the desktop-only columns move into the expandable detail box.
    await page.setViewportSize({ width: 500, height: 900 });

    await page.goto('/vehicles');
    await selectFirstOrg(page);
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow).toBeVisible();

    // Compact-mode precondition: the expand chevron is rendered ONLY in the
    // compact leading cell (DataTableRow.tsx:58-70). Asserting it visible proves
    // the container went compact — so the regression check below cannot pass
    // vacuously off a desktop header that still shows the desktop-only column.
    const expandBtn = firstRow.locator('td').first().getByRole('button');
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();

    // Scope to the overflow detail box (only exists in compact view) so the
    // assertions can't be satisfied by the desktop header's translated label.
    const detail = page.getByTestId('mobile-detail-row').first();
    await expect(detail).toBeVisible();

    // RED before the fix: the box printed `vehicles.field.operationalNumber` etc.
    // Locale-independent — the raw key is the bug regardless of language.
    await expect(detail).not.toContainText('vehicles.field.');
    // GREEN signal: the key resolved to a real label. Browser locale is not
    // pinned (i18n LanguageDetector, fallback 'en'), so accept en or nb.
    await expect(detail).toContainText(/Operational Number|Driftsnummer/);
  });
});
