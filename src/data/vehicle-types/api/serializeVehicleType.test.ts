import { describe, it, expect } from 'vitest';
import {
  serializeVehicleType,
  projectVehicleType,
  type VehicleTypeWire,
} from './fetchVehicleTypes.ts';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';

/**
 * serializeVehicleType is the domain→input inverse of projectVehicleType.
 * It must (a) rename id→netexId at every level, (b) emit the full document
 * with blanks as explicit null (full-replace, not omit-blank), and (c) drop
 * the server-managed fields the input contract does not accept.
 */
describe('serializeVehicleType', () => {
  it('renames id→netexId (top-level + deckPlan) and keeps populated fields', () => {
    const vt: VehicleType = {
      id: 'NMR:VehicleType:1',
      version: 7,
      name: { value: 'Type Alpha' },
      shortName: { value: 'TA' },
      transportMode: 'bus',
      euroClass: 'EURO6',
      maximumEngineEffectKW: 250,
      propulsionTypes: ['ELECTRIC'],
      fuelTypes: ['ELECTRICITY'],
      passengerCapacity: { totalCapacity: 90, seatingCapacity: 40 },
      deckPlan: { id: 'NMR:DeckPlan:DP1', name: { value: 'Standard' } },
    };
    const input = serializeVehicleType(vt);
    expect(input.netexId).toBe('NMR:VehicleType:1');
    expect(input.name).toEqual({ value: 'Type Alpha' });
    expect(input.euroClass).toBe('EURO6');
    expect(input.maximumEngineEffectKW).toBe(250);
    expect(input.passengerCapacity).toEqual({ totalCapacity: 90, seatingCapacity: 40 });
    expect(input.deckPlan).toEqual({ netexId: 'NMR:DeckPlan:DP1', name: { value: 'Standard' } });
  });

  it('passes the Sobek enum value through unchanged (model already holds it)', () => {
    // The model carries Sobek's UPPER_CASE enum verbatim, so serialize is a
    // passthrough — no SCREAMING_SNAKE re-mapping.
    expect(serializeVehicleType({ id: 'x', version: 1, transportMode: 'BUS' }).transportMode).toBe(
      'BUS'
    );
    expect(
      serializeVehicleType({ id: 'x', version: 1, transportMode: 'TROLLEY_BUS' }).transportMode
    ).toBe('TROLLEY_BUS');
    expect(
      serializeVehicleType({ id: 'x', version: 1, transportMode: 'SNOW_AND_ICE' }).transportMode
    ).toBe('SNOW_AND_ICE');
    // No mode → null (the input contract omits it rather than send a blank).
    expect(serializeVehicleType({ id: 'x', version: 1 }).transportMode).toBeNull();
  });

  it('emits blanked optionals as explicit null, not absent (full-replace)', () => {
    const input = serializeVehicleType({ id: 'NMR:VehicleType:2', version: 1 });
    // Untouched optionals are present and null so Sobek clears them on replace.
    expect(input.name).toBeNull();
    expect(input.euroClass).toBeNull();
    expect(input.passengerCapacity).toBeNull();
    expect(input.deckPlan).toBeNull();
    expect('euroClass' in input).toBe(true);
    expect('deckPlan' in input).toBe(true);
  });

  it('drops server-managed fields the input contract rejects', () => {
    const input = serializeVehicleType({
      id: 'NMR:VehicleType:3',
      version: 9,
      created: '2026-01-01',
      changed: '2026-01-02',
      changedBy: 'kdm',
      vehicles: [{ id: 'NMR:Vehicle:1', registrationNumber: 'R1', version: 1 }],
    });
    expect('version' in input).toBe(false);
    expect('created' in input).toBe(false);
    expect('changed' in input).toBe(false);
    expect('changedBy' in input).toBe(false);
    expect('vehicles' in input).toBe(false);
  });

  it('round-trips netexId through project∘serialize', () => {
    const wire: VehicleTypeWire = {
      netexId: 'NMR:VehicleType:rail',
      version: 1,
      name: { value: 'Rail Type' },
      euroClass: 'EURO6',
      deckPlan: { netexId: 'NMR:DeckPlan:DP1', name: { value: 'Standard' } },
    };
    const input = serializeVehicleType(projectVehicleType(wire));
    expect(input.netexId).toBe('NMR:VehicleType:rail');
    expect(input.name).toEqual({ value: 'Rail Type' });
    expect(input.deckPlan).toEqual({ netexId: 'NMR:DeckPlan:DP1', name: { value: 'Standard' } });
  });

  // Full-document-replace contract: a no-op edit (project → serialize) must NOT
  // drop any field Sobek sent, else the next save nulls it. These pin the
  // must-fix data-loss bugs from the code review.
  describe('full-document round-trip preserves fetched fields (no silent wipe)', () => {
    it('preserves description (query selects it; must survive project∘serialize)', () => {
      // The list query selects `description { value }`, so the wire carries it.
      const wire = {
        netexId: 'NMR:VehicleType:9',
        version: 1,
        name: { value: 'Has description' },
        description: { value: 'Long-form description' },
      } as VehicleTypeWire;
      const input = serializeVehicleType(projectVehicleType(wire));
      expect(input.description).toEqual({ value: 'Long-form description' });
    });

    it('preserves a transportMode outside the chip-filter set (FERRY)', () => {
      // Sobek's TransportMode enum has modes hathor does not chip-filter
      // (FERRY, INTERCITY_RAIL, URBAN_RAIL, SELF_DRIVE, …). Editing such a VT
      // must not reclassify it.
      const wire: VehicleTypeWire = {
        netexId: 'NMR:VehicleType:ferry',
        version: 1,
        name: { value: 'Ferry Type' },
        transportMode: 'FERRY',
      };
      const input = serializeVehicleType(projectVehicleType(wire));
      expect(input.transportMode).toBe('FERRY');
    });

    // Sobek's VehicleTypeInput accepts privateCode/keyValues, but neither is
    // selected by the query, modelled in VehicleTypeWire, mapped in
    // projectVehicleType, nor emitted by serializeVehicleType — so a
    // full-document-replace save nulls them. RED until they round-trip.
    it('preserves privateCode + keyValues through project∘serialize', () => {
      const wire = {
        netexId: 'NMR:VehicleType:pc',
        version: 1,
        privateCode: { type: 'internal', value: 'PC-1' },
        keyValues: [{ key: 'fleet', values: ['A', 'B'] }],
      } as unknown as VehicleTypeWire;
      const input = serializeVehicleType(projectVehicleType(wire)) as Record<string, unknown>;
      expect(input.privateCode).toEqual({ type: 'internal', value: 'PC-1' });
      expect(input.keyValues).toEqual([{ key: 'fleet', values: ['A', 'B'] }]);
    });
  });
});
