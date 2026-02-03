import { describe, expect, it } from 'vitest';
import { assembleAutosysResults } from './assembleAutosysResults';
import type { AutosysFetchResult } from './assembleAutosysResults';

function makeXml({
  vehicleReg = 'AB1234',
  vehicleTypeId = 'NMR:VehicleType:1',
  deckPlanId = 'NMR:DeckPlan:1',
  vehicleModelId = 'NMR:VehicleModel:1',
  includeVehicleModel = true,
}: {
  vehicleReg?: string;
  vehicleTypeId?: string;
  deckPlanId?: string;
  vehicleModelId?: string;
  includeVehicleModel?: boolean;
} = {}): string {
  const vehicleModelBlock = includeVehicleModel
    ? `<vehicleModels><VehicleModel id="${vehicleModelId}"><Name>Model X</Name></VehicleModel></vehicleModels>`
    : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery>
  <dataObjects>
    <CompositeFrame>
      <frames>
        <ResourceFrame id="NMR:ResourceFrame:1">
          <vehicleTypes>
            <VehicleType id="${vehicleTypeId}">
              <Name>Bus Type A</Name>
              <Length>12</Length>
              <Width>2.5</Width>
              <Height>3.2</Height>
              <PassengerCapacity>
                <SeatingCapacity>45</SeatingCapacity>
                <StandingCapacity>30</StandingCapacity>
              </PassengerCapacity>
            </VehicleType>
          </vehicleTypes>
          <deckPlans>
            <DeckPlan id="${deckPlanId}">
              <Name>Standard Layout</Name>
            </DeckPlan>
          </deckPlans>
          ${vehicleModelBlock}
          <vehicles>
            <Vehicle id="NMR:Vehicle:1">
              <RegistrationNumber>${vehicleReg}</RegistrationNumber>
            </Vehicle>
          </vehicles>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`;
}

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
