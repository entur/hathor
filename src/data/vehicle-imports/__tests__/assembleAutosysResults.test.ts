import { describe, expect, it } from 'vitest';
import { assembleAutosysResults } from '../assembleAutosysResults';
import type { AutosysFetchResult } from '../assembleAutosysResults';
import type { ParsedXml } from '../types';
import { pubDeliveryFromListV2 } from '../pubDeliveryFromList';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { makeXml } from './__fixtures__/makeXml';

describe('assembleAutosysResults', () => {
  it('parses a single successful XML', () => {
    const results: AutosysFetchResult[] = [{ regNumber: 'AB1234', xml: makeXml(), error: null }];

    const { summary, xmlList } = assembleAutosysResults(results);

    expect(summary.vehicleCount).toBe(1);
    expect(summary.vehicleTypeIds.size).toBe(1);
    expect(summary.vehicleTypeIds.has('NMR:VehicleType:1')).toBe(true);
    expect(summary.deckPlanIds.size).toBe(1);
    expect(summary.deckPlanIds.has('NMR:DeckPlan:1')).toBe(true);
    expect(summary.vehicleModelIds.size).toBe(1);
    expect(summary.vehicleModelIds.has('NMR:VehicleModel:1')).toBe(true);
    expect(summary.errors).toEqual([]);
    expect(xmlList).toHaveLength(1);
    expect(xmlList[0]).toHaveProperty('PublicationDelivery');
  });

  it('deduplicates shared VehicleType, DeckPlan, and VehicleModel ids', () => {
    const results: AutosysFetchResult[] = [
      { regNumber: 'AB1234', xml: makeXml({ vehicleReg: 'AB1234' }), error: null },
      {
        regNumber: 'CD5678',
        xml: makeXml({
          vehicleReg: 'CD5678',
          vehicleTypeId: 'NMR:VehicleType:1',
          deckPlanId: 'NMR:DeckPlan:1',
          vehicleModelId: 'NMR:VehicleModel:1',
        }),
        error: null,
      },
      {
        regNumber: 'EF9012',
        xml: makeXml({
          vehicleReg: 'EF9012',
          vehicleTypeId: 'NMR:VehicleType:2',
          deckPlanId: 'NMR:DeckPlan:2',
          vehicleModelId: 'NMR:VehicleModel:2',
        }),
        error: null,
      },
    ];

    const { summary, xmlList } = assembleAutosysResults(results);

    expect(summary.vehicleCount).toBe(3);
    expect(summary.vehicleTypeIds.size).toBe(2);
    expect(summary.deckPlanIds.size).toBe(2);
    expect(summary.vehicleModelIds.size).toBe(2);
    expect(summary.errors).toEqual([]);
    expect(xmlList).toHaveLength(3);
  });

  it('collects errors for failed fetches and still processes successes', () => {
    const results: AutosysFetchResult[] = [
      { regNumber: 'AB1234', xml: makeXml({ vehicleReg: 'AB1234' }), error: null },
      { regNumber: 'FAIL1', xml: '', error: 'Network error' },
      { regNumber: 'FAIL2', xml: '', error: '404 Not Found' },
    ];

    const { summary, xmlList } = assembleAutosysResults(results);

    expect(summary.vehicleCount).toBe(1);
    expect(summary.vehicleTypeIds.size).toBe(1);
    expect(summary.errors).toHaveLength(2);
    expect(summary.errors[0]).toEqual({ regNumber: 'FAIL1', message: 'Network error' });
    expect(summary.errors[1]).toEqual({ regNumber: 'FAIL2', message: '404 Not Found' });
    expect(xmlList).toHaveLength(1);
  });

  it('returns empty result for empty input', () => {
    const { summary, xmlList } = assembleAutosysResults([]);

    expect(summary.vehicleCount).toBe(0);
    expect(summary.vehicleTypeIds.size).toBe(0);
    expect(summary.deckPlanIds.size).toBe(0);
    expect(summary.vehicleModelIds.size).toBe(0);
    expect(summary.errors).toEqual([]);
    expect(xmlList).toEqual([]);
  });

  it('reports error when XML has no ResourceFrame', () => {
    const badXml = `<?xml version="1.0"?><PublicationDelivery><dataObjects></dataObjects></PublicationDelivery>`;
    const results: AutosysFetchResult[] = [{ regNumber: 'AB1234', xml: badXml, error: null }];

    const { summary, xmlList } = assembleAutosysResults(results);

    expect(summary.vehicleCount).toBe(0);
    expect(summary.errors).toHaveLength(1);
    expect(summary.errors[0].message).toBe('No ResourceFrame found in response');
    expect(xmlList).toEqual([]);
  });

  it('handles XML without optional vehicleModels section', () => {
    const results: AutosysFetchResult[] = [
      {
        regNumber: 'AB1234',
        xml: makeXml({ includeVehicleModel: false }),
        error: null,
      },
    ];

    const { summary } = assembleAutosysResults(results);

    expect(summary.vehicleCount).toBe(1);
    expect(summary.vehicleTypeIds.size).toBe(1);
    expect(summary.deckPlanIds.size).toBe(1);
    expect(summary.vehicleModelIds.size).toBe(0);
    expect(summary.errors).toEqual([]);
  });

  it('translates known autosys error responses', () => {
    const results: AutosysFetchResult[] = [
      {
        regNumber: 'AA1111',
        xml: '',
        error:
          'Cannot invoke "org.entur.autosys.model.KjoretoyData.getKjoretoyId()" because the return value is null',
      },
      {
        regNumber: 'BB2222',
        xml: '',
        error: '400 Bad Request: "{"feilmelding":"UGYLDIG_FORMAT_UNR_ELLER_KJENNEMERKE"}"',
      },
    ];

    const { summary } = assembleAutosysResults(results);

    expect(summary.errors).toHaveLength(2);
    expect(summary.errors[0]).toEqual({
      regNumber: 'AA1111',
      message: 'Incomplete vehicle data in Autosys',
    });
    expect(summary.errors[1]).toEqual({
      regNumber: 'BB2222',
      message: 'Invalid format or unknown registration number',
    });
  });

  it('reports error for malformed XML', () => {
    const results: AutosysFetchResult[] = [
      { regNumber: 'AB1234', xml: 'not xml at all <<<>>>', error: null },
    ];

    const { summary, xmlList } = assembleAutosysResults(results);

    expect(summary.errors).toHaveLength(1);
    expect(summary.errors[0].regNumber).toBe('AB1234');
    expect(xmlList).toEqual([]);
  });
});

describe('pubDeliveryFromListV2', () => {
  const parser = new XMLParser({ ignoreAttributes: false });
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
  });

  function makeParsed(overrides: { vehicleTypeId?: string; vehicleReg?: string } = {}): ParsedXml {
    const xml = makeXml({
      vehicleTypeId: overrides.vehicleTypeId ?? 'NMR:VehicleType:1',
      vehicleReg: overrides.vehicleReg ?? 'AB1234',
    });
    return parser.parse(xml);
  }

  it('merges all entities into a single ResourceFrame', () => {
    const list = [
      makeParsed({ vehicleReg: 'AB1234', vehicleTypeId: 'NMR:VehicleType:1' }),
      makeParsed({ vehicleReg: 'CD5678', vehicleTypeId: 'NMR:VehicleType:2' }),
    ];

    const result = pubDeliveryFromListV2(list);

    const rf = result.PublicationDelivery?.dataObjects?.CompositeFrame?.frames?.ResourceFrame;
    expect(rf).not.toBeInstanceOf(Array);
    expect(rf.vehicleTypes.VehicleType).toHaveLength(2);
    expect(rf.deckPlans.DeckPlan).toHaveLength(2);
    expect(rf.vehicleModels.VehicleModel).toHaveLength(2);
    expect(rf.vehicles.Vehicle).toHaveLength(2);
  });

  it('preserves entity IDs when merging', () => {
    const list = [
      makeParsed({ vehicleReg: 'AB1234', vehicleTypeId: 'NMR:VehicleType:1' }),
      makeParsed({ vehicleReg: 'CD5678', vehicleTypeId: 'NMR:VehicleType:2' }),
    ];

    const result = pubDeliveryFromListV2(list);

    const rf = result.PublicationDelivery?.dataObjects?.CompositeFrame?.frames?.ResourceFrame;
    const vtIds = rf.vehicleTypes.VehicleType.map((vt: ParsedXml) => vt['@_id']);
    expect(vtIds).toContain('NMR:VehicleType:1');
    expect(vtIds).toContain('NMR:VehicleType:2');
  });

  it('returns single ResourceFrame with single item', () => {
    const list = [makeParsed()];
    const result = pubDeliveryFromListV2(list);

    const rf = result.PublicationDelivery?.dataObjects?.CompositeFrame?.frames?.ResourceFrame;
    expect(rf).not.toBeInstanceOf(Array);
    expect(rf['@_id']).toBe('NMR:ResourceFrame:multi-import');
  });

  it('builds to valid XML string', () => {
    const list = [makeParsed()];
    const result = pubDeliveryFromListV2(list);
    const xmlString = builder.build(result);

    expect(xmlString).toContain('PublicationDelivery');
    expect(xmlString).toContain('ResourceFrame');
    expect(xmlString).toContain('VehicleType');
  });

  it('returns empty ResourceFrame for empty list', () => {
    const result = pubDeliveryFromListV2([]);

    const rf = result.PublicationDelivery?.dataObjects?.CompositeFrame?.frames?.ResourceFrame;
    expect(rf).toBeDefined();
    expect(rf.vehicleTypes).toBeUndefined();
    expect(rf.deckPlans).toBeUndefined();
    expect(rf.vehicleModels).toBeUndefined();
    expect(rf.vehicles).toBeUndefined();
  });
});
