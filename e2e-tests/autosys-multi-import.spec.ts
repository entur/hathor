import { test, expect, type Page } from '@playwright/test';
import { REG_NR, interceptAutosysQuery, interceptVehicleTypesQuery } from './autosys-helpers';
import { IS_LIVE, seedAuth, selectFirstOrg } from './live-auth-helpers';

/** A plate Autosys has no data for: shepet reports it per plate, inside a 200. */
const UNKNOWN_REG_NR = 'XX0000000';

/** Home's SVV bulk-import button — the import flow's only entry point. */
const IMPORT_BTN = 'home-bulk-import-svv';

/**
 * Home (/) Autosys multi-import dialog — drive the multi-vehicle import wizard to its 1/1/1 confirm summary.
 *
 * Workflow:
 *   copy config-no-auth.json → (mock) intercept VehicleTypes + Autosys queries → goto / (org auto-selected)
 *   → click home-bulk-import-svv → dialog opens
 *   → Step 0: click "Skip" (no file upload)
 *   → Step 1 (Review): fill multi-import-add-input = REG_NR → click add-button → assert chip in multi-import-tags
 *   → click "Next" (triggers one bulk POST to shepet's …/autosys/vehicles)
 *   → Step 2 (Confirm): wait for success Alert → assert "1 of 1" and counts Vehicles 1 / Vehicle types 1 / Vehicle models 1
 * Covers:
 *   - Three-step wizard navigation (Skip → add reg-nr → Next → Confirm).
 *   - Summary parsed from shepet's bulk response for REG_NR (1/1/1).
 *   - A plate Autosys does not know: shepet's per-plate KeyList error code → "1 of 2" + a translated error row (#214).
 *   - (mock only) The whole bulk request fails: one error on Review, no advance to Confirm (#214).
 *   - sandboxFeatures.AutosysImport off (#202): Home has no import button.
 * Modes:
 *   - mock (E2E_BACKEND unset): intercepts the VehicleTypes query + the shepet bulk POST with fixtures; full dialog flow runs offline.
 *   - live (E2E_BACKEND=true): fetches real Autosys data via shepet on :37998 (no query intercepts).
 *     Needs a real plate — set E2E_AUTOSYS_REG_NR (the fixture "A-1" is not a real Autosys plate);
 *     the 1/1/1 summary is plate-dependent under live.
 *     The unknown-plate test is fixme under live until shepet maps a plate Autosys has no
 *     data for to NOT_FOUND (entur/shepet#39); mock serves NOT_FOUND.
 */
/**
 * Drive the wizard from Home to its Review step with `regNrs` added, ready for "Next".
 *
 * @param page The test page, already seeded via `seedAuth`.
 * @param regNrs Plates to add.
 * @returns The dialog locator.
 */
const openReview = async (page: Page, regNrs: string[]) => {
  if (!IS_LIVE) {
    await interceptVehicleTypesQuery(page);
    await interceptAutosysQuery(page);
  }

  await page.goto('/');
  await selectFirstOrg(page); // the button renders only once an organisation is selected
  await page.waitForLoadState('networkidle');

  // Open the multi-import dialog
  const multiButton = page.getByTestId(IMPORT_BTN);
  await expect(multiButton).toBeVisible();
  await multiButton.click();

  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible();

  // Step 0: skip the file upload
  const nextButton = dialog.getByRole('button', { name: /skip/i });
  await nextButton.click();

  // Step 1 (Review): type each registration number and add it
  const addInput = page.getByTestId('multi-import-add-input').locator('input');
  const addButton = page.getByTestId('multi-import-add-button');
  const tags = page.getByTestId('multi-import-tags');
  await expect(addInput).toBeVisible();
  for (const reg of regNrs) {
    await addInput.fill(reg);
    await addButton.click();
    await expect(tags.getByText(reg)).toBeVisible();
  }
  return dialog;
};

/**
 * Drive the wizard from Home to its Confirm step.
 *
 * @param page The test page, already seeded via `seedAuth`.
 * @param regNrs Plates to import; defaults to {@link REG_NR}.
 * @returns The dialog content's text once the summary shows.
 */
const openConfirm = async (page: Page, regNrs: string[] = [REG_NR]): Promise<string> => {
  const dialog = await openReview(page, regNrs);

  // Click Next to trigger fetch
  const fetchNext = dialog.getByRole('button', { name: /next/i });
  await fetchNext.click();

  // Step 2 (Confirm): the summary alert is a warning when any plate failed
  const summaryAlert = dialog.locator('.MuiAlert-standardSuccess, .MuiAlert-standardWarning');
  await expect(summaryAlert).toBeVisible({ timeout: 15_000 });
  await expect(summaryAlert).toContainText(`1 of ${regNrs.length}`);

  return (await dialog.locator('.MuiDialogContent-root').textContent()) ?? '';
};

test.describe('Autosys multi-import dialog', () => {
  // Runs in BOTH modes now that shepet (:37998) is available locally: mock serves the
  // Autosys fixture; live fetches real Autosys via shepet. The shepet-not-running guard
  // was a temporary skip and has been removed.

  test(`skip upload, add "${REG_NR}", confirm shows 1/1/1`, async ({ context, page }) => {
    await seedAuth(context);
    const contentText = await openConfirm(page);

    // Verify each label is followed by its count in the text content
    expect(contentText).toMatch(/Vehicles\s*1/);
    expect(contentText).toMatch(/Vehicle types\s*1/);
    expect(contentText).toMatch(/Vehicle models\s*1/);
  });

  test(`unknown plate "${UNKNOWN_REG_NR}" is reported per plate`, async ({ context, page }) => {
    test.fixme(
      IS_LIVE,
      'shepet reports unknown plates as UPSTREAM_ERROR, not NOT_FOUND — https://github.com/entur/shepet/pull/39#discussion_r4389992039'
    );
    await seedAuth(context);
    const contentText = await openConfirm(page, [REG_NR, UNKNOWN_REG_NR]);

    expect(contentText).toMatch(/Vehicles\s*1/);
    expect(contentText).toContain('1 failed');
    expect(contentText).toContain(
      `${UNKNOWN_REG_NR}: Invalid format or unknown registration number`
    );
  });

  test('whole bulk request fails: one error, stays on Review', async ({ context, page }) => {
    test.skip(IS_LIVE, 'needs a shepet failure only a mock can force');
    await seedAuth(context);
    const dialog = await openReview(page, [REG_NR]);
    // registered last, so it wins over the fixture route from openReview
    await page.route('**/autosys/vehicles?**', route =>
      route.fulfill({ status: 502, contentType: 'text/plain', body: 'shepet unavailable' })
    );

    await dialog.getByRole('button', { name: /next/i }).click();

    await expect(dialog.locator('.MuiAlert-standardError')).toHaveText('shepet unavailable');
    await expect(page.getByTestId('multi-import-tags')).toBeVisible();
  });

  test('AutosysImport off: no import button', async ({ context, page }) => {
    await seedAuth(context, { sandboxFeatures: { DeckPlans: true, AutosysImport: false } });
    await page.goto('/');
    await selectFirstOrg(page);
    // the org-gated cards mark Home as rendered, so the count below isn't vacuous
    await expect(page.locator('.app-content a[href="/vehicles"]')).toBeVisible();
    await expect(page.getByTestId(IMPORT_BTN)).toHaveCount(0);
  });
});
