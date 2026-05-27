import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/**
 * Contract: every Playwright JSON fixture under e2e-tests/fixtures/ that
 * simulates a Sobek GraphQL response MUST mirror the post-#135 wire shape
 * the matching `src/graphql/vehicles/queries/*.ts` query selects — i.e.
 * `netexId` (not `id`) at every nesting level. The CLAUDE.md rule "GQL
 * fixtures must stay in sync with the GQL fetcher code" is enforced here.
 *
 * RED if any fixture still uses the pre-#135 `id` key. GREEN once renamed.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = resolve(__dirname, '../../../e2e-tests/fixtures');

const loadFixture = (file: string): unknown =>
  JSON.parse(readFileSync(resolve(FIXTURES_DIR, file), 'utf8'));

const hasNetexId = (item: Record<string, unknown>): boolean =>
  typeof item.netexId === 'string' && !('id' in item);

describe('e2e Playwright fixtures contract (post-#135 wire shape)', () => {
  it('vehicles-list-mock: every vehicle and nested transportType uses netexId', () => {
    const fx = loadFixture('vehicles-list-mock.json') as {
      data: { vehicles: { content: Array<Record<string, unknown>> } };
    };
    for (const v of fx.data.vehicles.content) {
      expect(hasNetexId(v), `vehicle row ${JSON.stringify(v)} must use netexId`).toBe(true);
      const tt = v.transportType as Record<string, unknown> | undefined;
      if (tt) {
        expect(hasNetexId(tt), `nested transportType ${JSON.stringify(tt)} must use netexId`).toBe(
          true
        );
      }
    }
  });

  it('vehicle-types-mock: every type, nested deckPlan, and nested vehicles[] use netexId', () => {
    const fx = loadFixture('vehicle-types-mock.json') as {
      data: { vehicleTypes: { content: Array<Record<string, unknown>> } };
    };
    for (const vt of fx.data.vehicleTypes.content) {
      expect(hasNetexId(vt), `vehicleType row ${JSON.stringify(vt)} must use netexId`).toBe(true);
      const dp = vt.deckPlan as Record<string, unknown> | null | undefined;
      if (dp) {
        expect(hasNetexId(dp), `nested deckPlan ${JSON.stringify(dp)} must use netexId`).toBe(true);
      }
      const vs = vt.vehicles as Array<Record<string, unknown>> | null | undefined;
      if (vs) {
        for (const v of vs) {
          expect(
            hasNetexId(v),
            `nested vehicles[] entry ${JSON.stringify(v)} must use netexId`
          ).toBe(true);
        }
      }
    }
  });

  it('deck-plans-mock: every deckPlan uses netexId', () => {
    const fx = loadFixture('deck-plans-mock.json') as {
      data: { deckPlans: { content: Array<Record<string, unknown>> } };
    };
    for (const dp of fx.data.deckPlans.content) {
      expect(hasNetexId(dp), `deckPlan row ${JSON.stringify(dp)} must use netexId`).toBe(true);
    }
  });
});
