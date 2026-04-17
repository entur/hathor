import { describe, expect, it } from 'vitest';
import { assembleAutosysResults } from '../assembleAutosysResults';
import type { AutosysFetchResult } from '../assembleAutosysResults';
import { makeXml, makeXmlFlat } from './__fixtures__/makeXml';

describe('assembleAutosysResults', () => {
  it('parses a single successful XML', () => {
    const results: AutosysFetchResult[] = [
      { queryRegNumber: 'AB1234', xml: makeXml(), error: null },
    ];

    const { summary, postPayload } = assembleAutosysResults(results);

    expect(summary.vehicleCount).toBe(1);
    expect(summary.vehicleTypeIds.size).toBe(1);
    expect(summary.vehicleTypeIds.has('NMR:VehicleType:1')).toBe(true);
    expect(summary.deckPlanIds.size).toBe(1);
    expect(summary.deckPlanIds.has('NMR:DeckPlan:1')).toBe(true);
    expect(summary.vehicleModelIds.size).toBe(1);
    expect(summary.vehicleModelIds.has('NMR:VehicleModel:1')).toBe(true);
    expect(summary.errors).toEqual([]);
    expect(summary.successCount).toBe(1);
    expect(postPayload).toBeDefined();
    expect(postPayload).toContain('PublicationDelivery');
    expect(postPayload).toContain('VehicleType');
  });

  it('deduplicates shared VehicleType, DeckPlan, and VehicleModel ids', () => {
    const results: AutosysFetchResult[] = [
      { queryRegNumber: 'AB1234', xml: makeXml({ vehicleReg: 'AB1234' }), error: null },
      {
        queryRegNumber: 'CD5678',
        xml: makeXml({
          vehicleReg: 'CD5678',
          vehicleTypeId: 'NMR:VehicleType:1',
          deckPlanId: 'NMR:DeckPlan:1',
          vehicleModelId: 'NMR:VehicleModel:1',
        }),
        error: null,
      },
      {
        queryRegNumber: 'EF9012',
        xml: makeXml({
          vehicleReg: 'EF9012',
          vehicleTypeId: 'NMR:VehicleType:2',
          deckPlanId: 'NMR:DeckPlan:2',
          vehicleModelId: 'NMR:VehicleModel:2',
        }),
        error: null,
      },
    ];

    const { summary } = assembleAutosysResults(results);

    // All 3 vehicles share Vehicle id="NMR:Vehicle:1" so dedup yields 1 unique
    expect(summary.vehicleCount).toBe(1);
    expect(summary.vehicleTypeIds.size).toBe(2);
    expect(summary.deckPlanIds.size).toBe(2);
    expect(summary.vehicleModelIds.size).toBe(2);
    expect(summary.errors).toEqual([]);
    expect(summary.successCount).toBe(3);
  });

  it('collects errors for failed fetches and still processes successes', () => {
    const results: AutosysFetchResult[] = [
      { queryRegNumber: 'AB1234', xml: makeXml({ vehicleReg: 'AB1234' }), error: null },
      { queryRegNumber: 'FAIL1', xml: '', error: 'Network error' },
      { queryRegNumber: 'FAIL2', xml: '', error: '404 Not Found' },
    ];

    const { summary, postPayload } = assembleAutosysResults(results);

    expect(summary.vehicleCount).toBe(1);
    expect(summary.vehicleTypeIds.size).toBe(1);
    expect(summary.errors).toHaveLength(2);
    expect(summary.errors[0]).toEqual({ queryRegNumber: 'FAIL1', message: 'Network error' });
    expect(summary.errors[1]).toEqual({ queryRegNumber: 'FAIL2', message: '404 Not Found' });
    expect(summary.successCount).toBe(1);
    expect(postPayload).toContain('PublicationDelivery');
  });

  it('returns empty result for empty input', () => {
    const { summary, postPayload } = assembleAutosysResults([]);

    expect(summary.vehicleCount).toBe(0);
    expect(summary.vehicleTypeIds.size).toBe(0);
    expect(summary.deckPlanIds.size).toBe(0);
    expect(summary.vehicleModelIds.size).toBe(0);
    expect(summary.errors).toEqual([]);
    expect(summary.successCount).toBe(0);
    expect(postPayload).toBeUndefined();
  });

  it('reports error when XML has no ResourceFrame', () => {
    const badXml = `<?xml version="1.0"?><PublicationDelivery><dataObjects></dataObjects></PublicationDelivery>`;
    const results: AutosysFetchResult[] = [{ queryRegNumber: 'AB1234', xml: badXml, error: null }];

    const { summary, postPayload } = assembleAutosysResults(results);

    expect(summary.vehicleCount).toBe(0);
    expect(summary.errors).toHaveLength(1);
    expect(summary.errors[0].message).toBe('No ResourceFrame found in response');
    expect(summary.successCount).toBe(0);
    expect(postPayload).toBeUndefined();
  });

  it('parses XML with ResourceFrame directly under dataObjects (no CompositeFrame)', () => {
    const results: AutosysFetchResult[] = [
      { queryRegNumber: 'AB1234', xml: makeXmlFlat(), error: null },
    ];

    const { summary, postPayload } = assembleAutosysResults(results);

    expect(summary.vehicleCount).toBe(1);
    expect(summary.vehicleTypeIds.size).toBe(1);
    expect(summary.deckPlanIds.size).toBe(1);
    expect(summary.vehicleModelIds.size).toBe(1);
    expect(summary.errors).toEqual([]);
    expect(summary.successCount).toBe(1);
    expect(postPayload).toContain('PublicationDelivery');
  });

  it('handles XML without optional vehicleModels section', () => {
    const results: AutosysFetchResult[] = [
      {
        queryRegNumber: 'AB1234',
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
        queryRegNumber: 'AA1111',
        xml: '',
        error:
          'Cannot invoke "org.entur.autosys.model.KjoretoyData.getKjoretoyId()" because the return value is null',
      },
      {
        queryRegNumber: 'BB2222',
        xml: '',
        error: '400 Bad Request: "{"feilmelding":"UGYLDIG_FORMAT_UNR_ELLER_KJENNEMERKE"}"',
      },
    ];

    const { summary } = assembleAutosysResults(results);

    expect(summary.errors).toHaveLength(2);
    expect(summary.errors[0]).toEqual({
      queryRegNumber: 'AA1111',
      message: 'Incomplete vehicle data in Autosys',
    });
    expect(summary.errors[1]).toEqual({
      queryRegNumber: 'BB2222',
      message: 'Invalid format or unknown registration number',
    });
  });

  it('reports error for malformed XML', () => {
    const results: AutosysFetchResult[] = [
      { queryRegNumber: 'AB1234', xml: 'not xml at all <<<>>>', error: null },
    ];

    const { summary, postPayload } = assembleAutosysResults(results);

    expect(summary.errors).toHaveLength(1);
    expect(summary.errors[0].queryRegNumber).toBe('AB1234');
    expect(postPayload).toBeUndefined();
  });
});
