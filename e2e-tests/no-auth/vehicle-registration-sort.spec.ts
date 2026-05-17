import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixturesDir = path.join(__dirname, '..', 'fixtures');
const targetConfig = path.join(__dirname, '..', '..', 'public', 'config.json');

const POST_CLICK_SETTLE_MS = 500;

/** Visible body of the lock tooltip rendered on locked sort headers. Kept in
 *  lockstep with the production string so the test anchors on the same text
 *  the user sees. */
const LOCK_TOOLTIP_TEXT = 'Close details to change sort';

/**
 * Three rows wired so every sortable column orders them differently. Each
 * column's asc-leader is a distinct row, so a click on any column header
 * provably changes the first-row identity when sort is permitted.
 *
 *   reg       | op    | vtype name | mode  | version
 *   ---------- | ----- | ---------- | ----- | -------
 *   AAA-001    | OP-9  | Charlie    | water | 3
 *   MID-001    | OP-1  | Alpha      | bus   | 2
 *   ZZZ-001    | OP-5  | Bravo      | rail  | 1
 *
 *   sort                       first row after click   (changes from AAA-001?)
 *   ------------------------- ----------------------- -------------------------
 *   registrationNumber → desc  ZZZ-001                 yes
 *   operationalNumber  → asc   MID-001                 yes
 *   transportTypeName  → asc   MID-001 (Alpha)         yes
 *   transportTypeMode  → asc   MID-001 (bus)           yes
 *   version            → asc   ZZZ-001 (v1)            yes
 */
interface Row {
  id: string;
  reg: string;
  op: string | null;
  vehicleType: { id: string; name: string; mode: string };
  version: number;
}

const ROWS: Row[] = [
  {
    id: 'NMR:Vehicle:aaa-1',
    reg: 'AAA-001',
    op: 'OP-9',
    vehicleType: { id: 'NMR:VehicleType:charlie', name: 'Charlie Type', mode: 'water' },
    version: 3,
  },
  {
    id: 'NMR:Vehicle:mid-1',
    reg: 'MID-001',
    op: 'OP-1',
    vehicleType: { id: 'NMR:VehicleType:alpha', name: 'Alpha Type', mode: 'bus' },
    version: 2,
  },
  {
    id: 'NMR:Vehicle:zzz-1',
    reg: 'ZZZ-001',
    op: 'OP-5',
    vehicleType: { id: 'NMR:VehicleType:bravo', name: 'Bravo Type', mode: 'rail' },
    version: 1,
  },
];

const SELECTED_ROW_ID = ROWS[1].id;
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
  { key: 'registrationNumber', headerName: /registration number/i, expectedFirstReg: 'ZZZ-001' },
  { key: 'operationalNumber', headerName: /operational number/i, expectedFirstReg: 'MID-001' },
  { key: 'transportTypeName', headerName: /vehicle type/i, expectedFirstReg: 'MID-001' },
  { key: 'transportTypeMode', headerName: /transport mode/i, expectedFirstReg: 'MID-001' },
  { key: 'version', headerName: /version/i, expectedFirstReg: 'ZZZ-001' },
];

const mockVehiclesPayload = () => ({
  data: {
    vehicles: {
      content: ROWS.map(r => ({
        id: r.id,
        version: r.version,
        registrationNumber: r.reg,
        operationalNumber: r.op,
        transportType: {
          id: r.vehicleType.id,
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
      await route.continue();
    }
  });

/**
 * Parameterized sort-stability driver for projected list views. Emits one
 * test per sortable column. Two modes:
 *
 *   - `locked: false` → sidebar is closed; clicking a header toggles sort,
 *     the new first-row identity matches `target.expectedFirstReg`, and the
 *     order persists after a settle wait (no flicker/revert).
 *
 *   - `locked: true`  → sidebar is open (route includes `?selected=…`);
 *     clicking a header is a no-op (first-row identity does NOT change), and
 *     hovering surfaces a tooltip explaining why ({@link LOCK_TOOLTIP_TEXT}).
 *
 * The shape is intentionally view-agnostic — pass a different `targets` table
 * and route to reuse for `/vehicle-types`, `/deck-plans`, etc.
 */
const runSortStabilityTests = (params: {
  describe: string;
  route: string;
  defaultFirstReg: string;
  targets: SortTarget[];
  locked: boolean;
}) => {
  test.describe(params.describe, () => {
    for (const target of params.targets) {
      const title = params.locked
        ? `sort by "${target.key}" is locked while sidebar is open (click no-op, hover surfaces tooltip)`
        : `sort by "${target.key}" toggles and persists (no flicker/revert)`;

      test(title, async ({ page }) => {
        await page.goto(params.route);
        await page.waitForLoadState('networkidle');

        if (params.locked) {
          await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
        }
        await expect(page.locator('table')).toBeVisible();

        const firstRow = page.locator('table tbody tr').first();
        await expect(firstRow).toContainText(params.defaultFirstReg);

        const header = page.getByRole('button', { name: target.headerName });

        if (params.locked) {
          // Hover surfaces the lock affordance tooltip.
          await header.hover();
          await expect(page.getByText(LOCK_TOOLTIP_TEXT)).toBeVisible();

          // Click is a no-op: table order does NOT change.
          await header.click();
          await expect(firstRow).toContainText(params.defaultFirstReg);

          // Stability check — locked state holds across a settle window.
          await page.waitForTimeout(POST_CLICK_SETTLE_MS);
          await expect(firstRow).toContainText(params.defaultFirstReg);
        } else {
          await header.click();
          await expect(firstRow).toContainText(target.expectedFirstReg);

          // Stability check — a flicker-then-revert glitch would pass the
          // line above (the desc frame briefly renders) but fail here once
          // latent effects (URL→editor→setPage cascades) snap state back.
          await page.waitForTimeout(POST_CLICK_SETTLE_MS);
          await expect(firstRow).toContainText(target.expectedFirstReg);
        }
      });
    }
  });
};

/**
 * Regression spec for sort behaviour on projected list views.
 *
 *   - Sidebar closed: header click toggles sort cleanly, order persists.
 *   - Sidebar open  : sort is LOCKED on every sortable column — clicks are
 *                     no-ops and hover surfaces a "Close details to change
 *                     sort" tooltip with a lock icon. Decision: sorting under
 *                     an open selection caused observable flicker/revert
 *                     (sort interacts with `useVehicleUrlSelection`'s
 *                     URL→editor→setPage cascade), so the UX call is to lock
 *                     sort while a row is being edited.
 *
 * Self-contained `vehicles(` intercept rather than the shared
 * `vehicle-list-helpers.ts` (still keyed on the legacy `vehicleTypes` query
 * shape) — keeps this spec independent of that drift.
 */
test.beforeAll(() => {
  fs.copyFileSync(path.join(fixturesDir, 'config-no-auth.json'), targetConfig);
});

test.beforeEach(async ({ page }) => {
  if (process.env.E2E_BACKEND !== 'true') {
    await interceptVehiclesList(page);
  }
});

runSortStabilityTests({
  describe: '/vehicles sort, sidebar CLOSED: each column header toggles and persists',
  route: '/vehicles',
  defaultFirstReg: DEFAULT_FIRST_REG,
  targets: SORT_TARGETS,
  locked: false,
});

runSortStabilityTests({
  describe: '/vehicles sort, sidebar OPEN: each column header is locked + tooltip on hover',
  route: `/vehicles?selected=${encodeURIComponent(SELECTED_ROW_ID)}`,
  defaultFirstReg: DEFAULT_FIRST_REG,
  targets: SORT_TARGETS,
  locked: true,
});
