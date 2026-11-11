import { describe, it, expect } from 'vitest';
import { serializeVehicleType, projectVehicleType } from './fetchVehicleTypes.ts';
import type { VehicleTypesQuery } from '../../../graphql/vehicles/queries/fetchVehicleTypes.ts';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';

/** Owning-organisation ref threaded into every serialize call (required input field). */
const OWNER = 'NMR:Organisation:1';

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
      transportMode: 'BUS',
      euroClass: 'EURO6',
      maximumEngineEffectKW: 250,
      propulsionTypes: ['ELECTRIC'],
      fuelTypes: ['ELECTRICITY'],
      passengerCapacity: { totalCapacity: 90, seatingCapacity: 40 },
      deckPlan: { id: 'NMR:DeckPlan:DP1', name: { value: 'Standard' } },
    };
    const input = serializeVehicleType(vt, OWNER);
    expect(input.netexId).toBe('NMR:VehicleType:1');
    expect(input.dataOwnerRef).toBe(OWNER);
    expect(input.name).toEqual({ value: 'Type Alpha' });
    expect(input.euroClass).toBe('EURO6');
    expect(input.maximumEngineEffectKW).toBe(250);
    expect(input.passengerCapacity).toEqual({ totalCapacity: 90, seatingCapacity: 40 });
    // deckPlan is a DeckPlanReferenceInput — netexId only, no name.
    expect(input.deckPlan).toEqual({ netexId: 'NMR:DeckPlan:DP1' });
  });

  it('passes the Sobek enum value through unchanged (model already holds it)', () => {
    // The model carries Sobek's UPPER_CASE enum verbatim, so serialize is a
    // passthrough — no SCREAMING_SNAKE re-mapping.
    expect(
      serializeVehicleType({ id: 'x', version: 1, transportMode: 'BUS' }, OWNER).transportMode
    ).toBe('BUS');
    expect(
      serializeVehicleType({ id: 'x', version: 1, transportMode: 'TROLLEY_BUS' }, OWNER)
        .transportMode
    ).toBe('TROLLEY_BUS');
    expect(
      serializeVehicleType({ id: 'x', version: 1, transportMode: 'SNOW_AND_ICE' }, OWNER)
        .transportMode
    ).toBe('SNOW_AND_ICE');
    // No mode → null (the input contract omits it rather than send a blank).
    expect(serializeVehicleType({ id: 'x', version: 1 }, OWNER).transportMode).toBeNull();
  });

  it('emits blanked optionals as explicit null, not absent (full-replace)', () => {
    const input = serializeVehicleType({ id: 'NMR:VehicleType:2', version: 1 }, OWNER);
    // Untouched optionals are present and null so Sobek clears them on replace.
    expect(input.name).toBeNull();
    expect(input.euroClass).toBeNull();
    expect(input.passengerCapacity).toBeNull();
    expect(input.deckPlan).toBeNull();
    expect('euroClass' in input).toBe(true);
    expect('deckPlan' in input).toBe(true);
  });

  it('drops server-managed fields the input contract rejects', () => {
    const input = serializeVehicleType(
      {
        id: 'NMR:VehicleType:3',
        version: 9,
        created: '2026-01-01',
        changed: '2026-01-02',
        changedBy: 'kdm',
        vehicles: [{ id: 'NMR:Vehicle:1', registrationNumber: 'R1', version: 1 }],
      },
      OWNER
    );
    expect('version' in input).toBe(false);
    expect('created' in input).toBe(false);
    expect('changed' in input).toBe(false);
    expect('changedBy' in input).toBe(false);
    expect('vehicles' in input).toBe(false);
  });

  it('sends vehicleTypeKind PHYSICAL on create and update (hathor handles PHYSICAL only)', () => {
    // Sobek requires the kind on create and rejects a changed kind on update.
    expect(serializeVehicleType({ id: '', version: 0 }, OWNER).vehicleTypeKind).toBe('PHYSICAL');
    expect(
      serializeVehicleType({ id: 'NMR:VehicleType:4', version: 1 }, OWNER).vehicleTypeKind
    ).toBe('PHYSICAL');
  });

  it('round-trips netexId through project∘serialize', () => {
    const wire: VehicleTypesQuery['vehicleTypes']['content'][number] = {
      netexId: 'NMR:VehicleType:rail',
      version: 1,
      name: { value: 'Rail Type' },
      euroClass: 'EURO6',
      deckPlan: { netexId: 'NMR:DeckPlan:DP1', name: { value: 'Standard' } },
    };
    const input = serializeVehicleType(projectVehicleType(wire), OWNER);
    expect(input.netexId).toBe('NMR:VehicleType:rail');
    expect(input.name).toEqual({ value: 'Rail Type' });
    expect(input.deckPlan).toEqual({ netexId: 'NMR:DeckPlan:DP1' });
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
      } as VehicleTypesQuery['vehicleTypes']['content'][number];
      const input = serializeVehicleType(projectVehicleType(wire), OWNER);
      expect(input.description).toEqual({ value: 'Long-form description' });
    });

    it('preserves a transportMode outside the chip-filter set (FERRY)', () => {
      // Sobek's TransportMode enum has modes hathor does not chip-filter
      // (FERRY, INTERCITY_RAIL, URBAN_RAIL, SELF_DRIVE, …). Editing such a VT
      // must not reclassify it.
      const wire: VehicleTypesQuery['vehicleTypes']['content'][number] = {
        netexId: 'NMR:VehicleType:ferry',
        version: 1,
        name: { value: 'Ferry Type' },
        transportMode: 'FERRY',
      };
      const input = serializeVehicleType(projectVehicleType(wire), OWNER);
      expect(input.transportMode).toBe('FERRY');
    });

    // Sobek: subtype "omitted means VEHICLE_TYPE, so it must be repeated when updating a train";
    // the component lists replace the previous version's.
    it('sends a train back as a train, its components as read', () => {
      const wire: VehicleTypesQuery['vehicleTypes']['content'][number] = {
        netexId: 'NMR:VehicleType:T1',
        version: 2,
        subtype: 'TRAIN',
        numberOfCars: 2,
        trainSizeType: 'SHORT',
        trainElementType: null,
        trainComponents: [
          {
            netexId: 'NMR:TrainComponent:1',
            label: { value: 'A', lang: 'nb' },
            description: null,
            trainElement: { netexId: 'NMR:VehicleType:E1' },
            operationalOrientation: 'FORWARDS',
            forwardCouplingThroughAccess: 'DOOR',
          },
          // Sobek returned no element: the input requires one, so it can't go back.
          { netexId: 'NMR:TrainComponent:2', trainElement: null },
        ],
        compoundTrainComponents: null,
      };
      const input = serializeVehicleType(projectVehicleType(wire), OWNER);
      expect(input).toMatchObject({
        subtype: 'TRAIN',
        numberOfCars: 2,
        trainSizeType: 'SHORT',
        trainElementType: null,
        trainComponents: [
          {
            netexId: 'NMR:TrainComponent:1',
            label: { value: 'A', lang: 'nb' },
            description: null,
            trainElement: { netexId: 'NMR:VehicleType:E1' },
            operationalOrientation: 'FORWARDS',
            forwardCouplingThroughAccess: 'DOOR',
          },
        ],
        compoundTrainComponents: null,
      });
      expect(input.trainComponents).toHaveLength(1);
    });

    it('repeats a plain subtype; a create sends none (Sobek defaults it)', () => {
      const plain = projectVehicleType({
        netexId: 'NMR:VehicleType:B',
        version: 1,
        subtype: 'VEHICLE_TYPE',
      });
      expect(plain.train).toBeUndefined();
      expect(serializeVehicleType(plain, OWNER)).toMatchObject({
        subtype: 'VEHICLE_TYPE',
        trainComponents: null,
      });
      expect(serializeVehicleType({ id: '', version: 0 }, OWNER).subtype).toBeNull();
    });
  });
});
