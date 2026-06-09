import { test, expect, type Page } from '@playwright/test';
import { IS_LIVE, writeConfig, seedAuth, selectFirstOrg } from './live-auth-helpers';

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
        netexId: r.id,
        version: r.version,
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

      // The per-column asc-leader identities (expectedFirstReg) are bound to the
      // synthetic 3-row distinct-leader fixture; live AtB data has no predictable
      // per-column leader, so the unlocked toggle-identity check can't be made
      // honest against the backend. The locked check is data-agnostic (sort must
      // NOT change while a row is selected) and runs live against a real row.
      test.skip(
        IS_LIVE && !params.locked,
        'per-column asc-leader identity needs the synthetic distinct-leader fixture'
      );

      test(title, async ({ page }) => {
        const firstRow = page.locator('table tbody tr').first();
        const header = page.getByRole('button', { name: target.headerName });

        // Live: only the locked case runs (unlocked leaders are fixture-bound,
        // skipped above). Open a real row's sidebar, then assert the sort lock
        // by row-identity stability — compare the first row's own innerText
        // before/after the click (avoids fixture ids and whitespace-normalization
        // pitfalls of cross-source text matching).
        if (IS_LIVE) {
          await page.goto('/vehicles');
          await selectFirstOrg(page);
          await page.waitForLoadState('networkidle');
          await expect(page.locator('table')).toBeVisible();

          await firstRow.click();
          await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
          const baseline = await firstRow.innerText();

          await header.hover();
          await expect(page.getByText(LOCK_TOOLTIP_TEXT)).toBeVisible();

          await header.click();
          expect(await firstRow.innerText()).toBe(baseline);

          await page.waitForTimeout(POST_CLICK_SETTLE_MS);
          expect(await firstRow.innerText()).toBe(baseline);
          return;
        }

        await page.goto(params.route);
        await page.waitForLoadState('networkidle');

        if (params.locked) {
          await expect(page.getByTestId('vehicle-details-title')).toBeVisible();
        }
        await expect(page.locator('table')).toBeVisible();
        await expect(firstRow).toContainText(params.defaultFirstReg);

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
 * /vehicles sort stability — header sort toggles cleanly when closed, is locked while the sidebar editor is open.
 *
 * Workflow:
 *   1. writeConfig (auth/no-auth) → seedAuth → (mock) intercept `vehicles(` list with the 3-row distinct-leader fixture.
 *   2. Sidebar CLOSED, per column: goto /vehicles → click header → assert first row becomes target.expectedFirstReg → settle 500ms → still that leader (no flicker/revert).
 *   3. Sidebar OPEN, per column: goto /vehicles?selected=<row> → assert vehicle-details-title visible → hover header surfaces "Close details to change sort" tooltip → click is a no-op (first row stays defaultFirstReg) → settle 500ms → still unchanged.
 * Covers:
 *   - Closed: each sortable column (registrationNumber, operationalNumber, transportTypeName, transportTypeMode, version) toggles to its distinct asc-leader and persists.
 *   - Open: sort LOCKED on every column — click no-op + hover tooltip (UX call: sorting under an open selection caused flicker/revert via useVehicleUrlSelection's URL→editor→setPage cascade).
 * Modes:
 *   - mock (E2E_SUITE=no-auth): self-contained `vehicles(` intercept with a 3-row fixture (NMR:Vehicle:aaa-1/mid-1/zzz-1, totalElements 3) whose per-column asc-leaders are provably distinct; asserts exact expectedFirstReg per column.
 *   - live (E2E_BACKEND=true): only the LOCKED cases run — seedAuth JWT + selectFirstOrg (AtB), open a real first row, assert lock by row-identity stability (firstRow.innerText unchanged before/after click), data-agnostic so no fixture ids needed.
 *   - skip-live: all sidebar-CLOSED (unlocked) cases — per-column asc-leader identity is bound to the synthetic distinct-leader fixture; live AtB data has no predictable per-column leader.
 */
test.beforeAll(() => writeConfig());

test.beforeEach(async ({ page, context }) => {
  await seedAuth(context);
  if (!IS_LIVE) {
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
