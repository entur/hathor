import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { buildSchema, GraphQLObjectType } from 'graphql';

/**
 * Contract: every Playwright JSON fixture under e2e-tests/fixtures/ that
 * simulates a Sobek GraphQL response MUST mirror the wire shape the matching
 * `src/graphql/vehicles/queries/*.ts` query selects. The CLAUDE.md rule "GQL
 * fixtures must stay in sync with the GQL fetcher code" is enforced here.
 *
 * For `vehicles-list-mock` this is validated against the committed Sobek SDL
 * (`src/graphql/sobek.schema.graphqls`, kept in sync by the CI drift guard in
 * `.github/workflows/playwright.yml`): every key on a fixture row must be a
 * real field of the GQL type, AND every field the query selects must be
 * present on the row. RED when the fixture drifts from the query selection.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = resolve(__dirname, '../../../e2e-tests/fixtures');
const SCHEMA_PATH = resolve(__dirname, '../../graphql/sobek.schema.graphqls');

const schema = buildSchema(readFileSync(SCHEMA_PATH, 'utf8'));

/** Field-name set of a GQL object type in the Sobek schema. */
const fieldsOf = (typeName: string): Set<string> => {
  const t = schema.getType(typeName);
  if (!(t instanceof GraphQLObjectType)) {
    throw new Error(`Sobek schema has no object type "${typeName}"`);
  }
  return new Set(Object.keys(t.getFields()));
};

/** Mirror of the `Vehicles` query selection in queries/fetchVehicles.ts. */
const VEHICLE_SELECTED = [
  'netexId',
  'version',
  'registrationNumber',
  'operationalNumber',
  'buildDate',
  'chassisNumber',
  'description',
  'registrationDate',
  'name',
  'transportType',
] as const;
const TRANSPORT_TYPE_SELECTED = ['netexId', 'version', 'name', 'transportMode'] as const;

const loadFixture = (file: string): unknown =>
  JSON.parse(readFileSync(resolve(FIXTURES_DIR, file), 'utf8'));

const hasNetexId = (item: Record<string, unknown>): boolean =>
  typeof item.netexId === 'string' && !('id' in item);

describe('e2e Playwright fixtures contract (post-#135 wire shape)', () => {
  it('vehicles-list-mock: rows match the Sobek Vehicle schema and the query selection', () => {
    const vehicleFields = fieldsOf('Vehicle');
    const transportTypeFields = fieldsOf('VehicleType');
    const fx = loadFixture('vehicles-list-mock.json') as {
      data: { vehicles: { content: Array<Record<string, unknown>> } };
    };
    for (const v of fx.data.vehicles.content) {
      expect(hasNetexId(v), `vehicle row ${JSON.stringify(v)} must use netexId`).toBe(true);

      // (a) no unknown fields — every fixture key is a real Vehicle field.
      for (const k of Object.keys(v)) {
        expect(vehicleFields.has(k), `vehicle field "${k}" is not in Sobek type Vehicle`).toBe(
          true
        );
      }
      // (b) selection coverage — every query-selected field is present.
      for (const f of VEHICLE_SELECTED) {
        expect(v, `vehicle row missing query-selected field "${f}"`).toHaveProperty(f);
      }
      if (v.name != null) expect(v.name).toHaveProperty('value');
      if (v.description != null) expect(v.description).toHaveProperty('value');

      const tt = v.transportType as Record<string, unknown> | null | undefined;
      if (tt) {
        expect(hasNetexId(tt), `nested transportType ${JSON.stringify(tt)} must use netexId`).toBe(
          true
        );
        for (const k of Object.keys(tt)) {
          expect(
            transportTypeFields.has(k),
            `transportType field "${k}" is not in Sobek type VehicleType`
          ).toBe(true);
        }
        for (const f of TRANSPORT_TYPE_SELECTED) {
          expect(tt, `transportType missing query-selected field "${f}"`).toHaveProperty(f);
        }
        if (tt.name != null) expect(tt.name).toHaveProperty('value');
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
