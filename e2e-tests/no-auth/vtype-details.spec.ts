import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import {
  fixturesDir,
  targetConfig,
  interceptVehicleTypeDetailQuery,
  interceptVehicleTypesQuery,
  captureGqlResponse,
} from './autosys-helpers';

const URL = '/vehicle-type/NMR:VehicleType:1';

test.describe('VehicleType detail page', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(() => {
    fs.copyFileSync(`${fixturesDir}/config-no-auth.json`, targetConfig);
  });

  test.describe('with mocked API', () => {
    test.beforeEach(async ({ page }) => {
      if (process.env.E2E_BACKEND !== 'true') {
        await interceptVehicleTypeDetailQuery(page);
      }
    });

    test('edit page populates fields from mock', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { level: 4 })).toContainText('Type Alpha');
      await expect(page.getByRole('textbox', { name: 'Id', exact: true })).toHaveValue(
        'NMR:VehicleType:1'
      );
      await expect(page.getByRole('textbox', { name: 'Name', exact: true })).toHaveValue(
        'Type Alpha'
      );
      await expect(page.getByRole('tab', { name: 'Edit' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
    });

    test('dimensions accordion shows values', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      // Summary text before expanding
      await expect(page.getByText('(L: 10, W: 2.5, H: 3)')).toBeVisible();

      // Expand accordion
      const summary = page.locator('.MuiAccordionSummary-root').filter({ hasText: 'Dimensions' });
      await summary.click();

      await expect(page.getByLabel('Length')).toHaveValue('10');
      await expect(page.getByLabel('Width')).toHaveValue('2.5');
      await expect(page.getByLabel('Height')).toHaveValue('3');
    });

    test('XML Preview tab renders XML', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      await page.getByRole('tab', { name: 'XML Preview' }).click();
      const pre = page.locator('pre');
      await expect(pre).toBeVisible();
      await expect(pre).toContainText('<VehicleType');
      await expect(pre).toContainText('Type Alpha');
    });

    test('Vehicles extra tab shows vehicle table', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      await page.getByRole('tab', { name: /Vehicles/ }).click();
      await expect(page.getByText('NMR:Vehicle:101')).toBeVisible();
      await expect(page.getByText('AA-101')).toBeVisible();
    });

    test('Deck Plan extra tab shows table', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      await page.getByRole('tab', { name: 'Deck Plan' }).click();
      await expect(page.getByText('NMR:DeckPlan:1')).toBeVisible();
      await expect(page.getByText('Plan A')).toBeVisible();
    });

    test('new page shows empty form and disabled save', async ({ page }) => {
      await page.goto('/vehicle-type/new');
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('heading', { level: 4 })).toHaveText('New VehicleType');
      await expect(page.getByRole('textbox', { name: 'Id', exact: true })).toHaveValue('');
      await expect(page.getByRole('textbox', { name: 'Name', exact: true })).toHaveValue('');
      await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();

      // Only Environmental extras tab — no Vehicles or Deck Plan
      await expect(page.getByRole('tab', { name: 'Environmental extras' })).toBeVisible();
      await expect(page.getByRole('tab', { name: /Vehicles/ })).not.toBeVisible();
      await expect(page.getByRole('tab', { name: 'Deck Plan' })).not.toBeVisible();
    });
  });

  test.describe('with live backend', () => {
    test.skip(() => process.env.E2E_BACKEND !== 'true', 'Requires local Sobek backend');

    test('list response has correct vehicles shape', async ({ page }) => {
      const captured = captureGqlResponse(page);
      await page.goto('/vehicle-type');
      const json = (await captured) as {
        data: {
          vehicleTypes: {
            content: {
              vehicles?: { id: string; registrationNumber: string }[];
              deckPlan?: { id: string; name?: { value: string } };
            }[];
          };
        };
      };

      const items = json.data.vehicleTypes.content;
      expect(items.length).toBeGreaterThan(0);

      const withVehicles = items.find(vt => vt.vehicles && vt.vehicles.length > 0);
      if (withVehicles) {
        const v = withVehicles.vehicles![0];
        expect(typeof v.id).toBe('string');
        expect(typeof v.registrationNumber).toBe('string');
      }

      const withDeck = items.find(vt => vt.deckPlan);
      if (withDeck) {
        expect(typeof withDeck.deckPlan!.id).toBe('string');
      }
    });

    test('detail response has correct vehicles shape', async ({ page }) => {
      await page.goto('/vehicle-type');
      await page.waitForLoadState('networkidle');

      const firstLink = page.locator('table tbody tr').first().getByRole('link');
      await expect(firstLink).toBeVisible({ timeout: 10_000 });

      const captured = captureGqlResponse(page);
      await firstLink.click();

      const json = (await captured) as {
        data: {
          vehicleTypes: {
            content: {
              vehicles?: { id: string; registrationNumber: string }[];
              deckPlan?: { id: string; name?: { value: string } };
            }[];
          };
        };
      };

      const vt = json.data.vehicleTypes.content[0];
      expect(vt).toBeTruthy();

      if (vt.vehicles && vt.vehicles.length > 0) {
        const v = vt.vehicles[0];
        expect(typeof v.id).toBe('string');
        expect(typeof v.registrationNumber).toBe('string');
      }

      if (vt.deckPlan) {
        expect(typeof vt.deckPlan.id).toBe('string');
      }
    });

    test('create new vehicle type', async ({ page }) => {
      await page.goto('/vehicle-type/new');
      await page.waitForLoadState('networkidle');

      const uid = `TST:VehicleType:e2e-${Date.now()}`;
      await page.getByRole('textbox', { name: 'Id', exact: true }).fill(uid);
      await page.getByRole('textbox', { name: 'Name', exact: true }).fill('E2E Test Bus');

      // Open Dimensions accordion and fill Length
      const dimSummary = page
        .locator('.MuiAccordionSummary-root')
        .filter({ hasText: 'Dimensions' });
      await dimSummary.click();
      await page.getByLabel('Length').fill('12');

      await page.getByRole('button', { name: 'Save' }).click();

      // Wait for save to complete
      await expect(page.getByRole('button', { name: 'Save' })).toBeVisible({
        timeout: 15_000,
      });
      await expect(page.getByText('Validation errors:')).not.toBeVisible();
    });

    // Issue #50: paged resolver returns null for vehicles/deckPlan associations.
    test('detail page shows Vehicles & Deck Plan tabs (#50)', async ({ page }) => {
      await page.goto('/vehicle-type');
      await page.waitForLoadState('networkidle');

      const firstLink = page.locator('table tbody tr').first().getByRole('link');
      await expect(firstLink).toBeVisible({ timeout: 10_000 });
      await firstLink.click();
      await page.waitForLoadState('networkidle');

      await expect(page.getByRole('tab', { name: /Vehicles/ })).toBeVisible({ timeout: 5_000 });
      await expect(page.getByRole('tab', { name: 'Deck Plan' })).toBeVisible();
    });

    test('edit existing vehicle type name', async ({ page }) => {
      await interceptVehicleTypesQuery(page);
      await page.goto('/vehicle-type');
      await page.waitForLoadState('networkidle');

      // Navigate to the first VehicleType detail page
      const firstLink = page.locator('table tbody tr').first().getByRole('link');
      await expect(firstLink).toBeVisible({ timeout: 10_000 });
      await firstLink.click();
      await page.waitForLoadState('networkidle');

      const nameInput = page.getByRole('textbox', { name: 'Name', exact: true });
      await expect(nameInput).toBeVisible({ timeout: 10_000 });

      const newName = `Renamed ${Date.now()}`;
      await nameInput.clear();
      await nameInput.fill(newName);

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByRole('button', { name: 'Save' })).toBeVisible({
        timeout: 15_000,
      });

      // Reload and verify persistence
      await page.reload();
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('textbox', { name: 'Name', exact: true })).toHaveValue(newName, {
        timeout: 10_000,
      });
    });
  });
});
