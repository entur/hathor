import { test, expect, type Page } from '@playwright/test';
import { IS_LIVE, seedAuth } from './live-auth-helpers';

const POST_CLICK_SETTLE_MS = 500;

/**
 * Three rows wired so every sortable column orders them differently. Each
 * column's asc-leader is a distinct row, so a click on any sortable header
 * provably changes the first-row identity when sort is permitted. (`version`
 * is no longer a column — it renders as the `vN` badge inside the id chip — so
 * it is not a sort target; the fixture still carries a version per row only to
 * feed that badge.)
 *
 *   name    | reg       | op    | vtype name | mode
 *   ------- | --------- | ----- | ---------- | -----
 *   Gamma   | AAA-001   | OP-9  | Charlie    | water
 *   Alpha   | MID-001   | OP-1  | Alpha      | bus
 *   Beta    | ZZZ-001   | OP-5  | Bravo      | rail
 *
 *   sort                       first row after click   (changes from AAA-001?)
 *   ------------------------- ----------------------- -------------------------
 *   name               → asc   MID-001 (Alpha)         yes
 *   registrationNumber → desc  ZZZ-001                 yes
 *   operationalNumber  → asc   MID-001                 yes
 *   transportTypeName  → asc   MID-001 (Alpha)         yes
 *   transportTypeMode  → asc   MID-001 (bus)           yes
 */
interface Row {
  id: string;
  name: string;
  reg: string;
  op: string | null;
  vehicleType: { id: string; name: string; mode: string };
  version: number;
}

const ROWS: Row[] = [
  {
    id: 'NMR:Vehicle:aaa-1',
    name: 'Gamma',
    reg: 'AAA-001',
    op: 'OP-9',
    vehicleType: { id: 'NMR:VehicleType:charlie', name: 'Charlie Type', mode: 'water' },
    version: 3,
  },
  {
    id: 'NMR:Vehicle:mid-1',
    name: 'Alpha',
    reg: 'MID-001',
    op: 'OP-1',
    vehicleType: { id: 'NMR:VehicleType:alpha', name: 'Alpha Type', mode: 'bus' },
    version: 2,
  },
  {
    id: 'NMR:Vehicle:zzz-1',
    name: 'Beta',
    reg: 'ZZZ-001',
    op: 'OP-5',
    vehicleType: { id: 'NMR:VehicleType:bravo', name: 'Bravo Type', mode: 'rail' },
    version: 1,
  },
];

const DEFAULT_FIRST_REG = 'AAA-001';

interface SortTarget {
  key: string;
  headerName: RegExp;
  /** First row after clicking this column's header, assuming sort is permitted
   *  (sidebar closed). When sort is locked, this should NOT become the first
   *  row — the default leader stays. */
  expectedFirstReg: string;
}

const SORT_TARGETS: SortTarget[] = [
  { key: 'name', headerName: /^name$/i, expectedFirstReg: 'MID-001' },
  { key: 'registrationNumber', headerName: /registration number/i, expectedFirstReg: 'ZZZ-001' },
  { key: 'operationalNumber', headerName: /operational number/i, expectedFirstReg: 'MID-001' },
  { key: 'transportTypeName', headerName: /vehicle type/i, expectedFirstReg: 'MID-001' },
  { key: 'transportTypeMode', headerName: /transport mode/i, expectedFirstReg: 'MID-001' },
];

const mockVehiclesPayload = () => ({
  data: {
    vehicles: {
      content: ROWS.map(r => ({
        netexId: r.id,
        version: r.version,
        name: { value: r.name },
        registrationNumber: r.reg,
        operationalNumber: r.op,
        transportType: {
          netexId: r.vehicleType.id,
          version: 1,
          name: { value: r.vehicleType.name },
          transportMode: r.vehicleType.mode,
        },
      })),
      totalElements: ROWS.length,
      page: 0,
      size: 10000,
    },
  },
});

const interceptVehiclesList = (page: Page) =>
  page.route('**/graphql', async route => {
    const q: string = route.request().postDataJSON()?.query ?? '';
    if (q.includes('vehicles(')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockVehiclesPayload()),
      });
    } else {
      // fallback so the mock `organisations` query reaches seedAuth's route.
      await route.fallback();
    }
  });

/**
 * Parameterized sort-stability driver for projected list views. Emits one
 * test per sortable column: clicking a header toggles sort, the new first-row
 * identity matches `target.expectedFirstReg`, and the order persists after a
 * settle wait (no flicker/revert). While an editor is open the list sits
 * behind the modal details Drawer's scrim (`details-modal.spec.ts`), so there
 * is no open-sidebar sort mode to cover here.
 *
 * The shape is intentionally view-agnostic — pass a different `targets` table
 * and route to reuse for `/vehicle-types`, `/deck-plans`, etc.
 */
const runSortStabilityTests = (params: {
  describe: string;
  route: string;
  defaultFirstReg: string;
  targets: SortTarget[];
}) => {
  test.describe(params.describe, () => {
    // Per-column asc-leader identities are bound to the synthetic 3-row
    // distinct-leader fixture; live data has no predictable per-column leader.
    test.skip(
      IS_LIVE,
      'per-column asc-leader identity needs the synthetic distinct-leader fixture'
    );

    for (const target of params.targets) {
      test(`sort by "${target.key}" toggles and persists (no flicker/revert)`, async ({ page }) => {
        const firstRow = page.locator('table tbody tr').first();
        const header = page.getByRole('button', { name: target.headerName });

        await page.goto(params.route);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('table')).toBeVisible();
        await expect(firstRow).toContainText(params.defaultFirstReg);

        await header.click();
        await expect(firstRow).toContainText(target.expectedFirstReg);

        // Stability check — a flicker-then-revert glitch would pass the
        // line above (the desc frame briefly renders) but fail here once
        // latent effects snap state back.
        await page.waitForTimeout(POST_CLICK_SETTLE_MS);
        await expect(firstRow).toContainText(target.expectedFirstReg);
      });
    }
  });
};

/**
 * /vehicles sort stability — each header sort toggles cleanly and persists.
 *
 * Workflow:
 *   1. seedAuth (config + auth) → (mock) intercept `vehicles(` list with the 3-row distinct-leader fixture.
 *   2. Per column: goto /vehicles → click header → assert first row becomes target.expectedFirstReg → settle 500ms → still that leader (no flicker/revert).
 * Covers:
 *   - Each sortable column (name, registrationNumber, operationalNumber, transportTypeName, transportTypeMode) toggles to its distinct asc-leader and persists.
 * Modes:
 *   - mock (E2E_BACKEND unset): self-contained `vehicles(` intercept with a 3-row fixture (NMR:Vehicle:aaa-1/mid-1/zzz-1, totalElements 3) whose per-column asc-leaders are provably distinct; asserts exact expectedFirstReg per column.
 *   - skip-live: whole spec — per-column asc-leader identity is bound to the synthetic distinct-leader fixture; live AtB data has no predictable per-column leader.
 */

test.beforeEach(async ({ page, context }) => {
  await seedAuth(context);
  if (!IS_LIVE) {
    await interceptVehiclesList(page);
  }
});

runSortStabilityTests({
  describe: '/vehicles sort: each column header toggles and persists',
  route: '/vehicles',
  defaultFirstReg: DEFAULT_FIRST_REG,
  targets: SORT_TARGETS,
});
