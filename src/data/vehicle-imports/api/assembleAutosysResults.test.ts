import { describe, expect, it } from 'vitest';
import { assembleAutosysResults, failedAutosysResult } from './assembleAutosysResults';
import type { ImportEntry } from '../types/importTypes';
import { makeBulkXml } from './__fixtures__/makeXml';

const entries = (...regs: string[]): ImportEntry[] =>
  regs.map(queryRegNumber => ({ queryRegNumber }));

/** Verbatim from shepet's bulk response for an unknown plate. */
const NO_AUTOSYS_DATA =
  'Cannot invoke "org.entur.shepet.model.GetKjoretoyResponse.getKjoretoydataListe()" because "autosysData" is null';

describe('assembleAutosysResults', () => {
  it('summarises a single vehicle and passes the XML through as payload', () => {
    const xml = makeBulkXml({ vehicles: [{ reg: 'AB1234', deckPlanId: 'NMR:DeckPlan:1' }] });

    const { summary, postPayload } = assembleAutosysResults(xml, entries('AB1234'));

    expect(summary.vehicleCount).toBe(1);
    expect([...summary.vehicleTypeIds]).toEqual(['NMR:VehicleType:1']);
    expect([...summary.deckPlanIds]).toEqual(['NMR:DeckPlan:1']);
    expect([...summary.vehicleModelIds]).toEqual(['NMR:VehicleModel:1']);
    expect(summary.errors).toEqual([]);
    expect(summary.successCount).toBe(1);
    expect(postPayload).toBe(xml);
  });

  it('counts shared VehicleType and VehicleModel once', () => {
    const xml = makeBulkXml({
      vehicles: [
        { reg: 'AB1234' },
        { reg: 'CD5678' },
        { reg: 'EF9012', vehicleTypeId: 'NMR:VehicleType:2', vehicleModelId: 'NMR:VehicleModel:2' },
      ],
    });

    const { summary } = assembleAutosysResults(xml, entries('AB1234', 'CD5678', 'EF9012'));

    expect(summary.vehicleCount).toBe(3);
    expect(summary.vehicleTypeIds.size).toBe(2);
    expect(summary.vehicleModelIds.size).toBe(2);
    expect(summary.deckPlanIds.size).toBe(0);
    expect(summary.successCount).toBe(3);
  });

  it('reads per-plate errors from the KeyList and translates them', () => {
    const xml = makeBulkXml({
      vehicles: [{ reg: 'AB1234' }],
      errors: [
        { reg: 'XX0000000', message: NO_AUTOSYS_DATA },
        { reg: 'FAIL2', message: 'Network error' },
      ],
    });

    const { summary, postPayload } = assembleAutosysResults(
      xml,
      entries('AB1234', 'XX0000000', 'FAIL2')
    );

    expect(summary.vehicleCount).toBe(1);
    expect(summary.errors).toEqual([
      { queryRegNumber: 'XX0000000', message: 'Invalid format or unknown registration number' },
      { queryRegNumber: 'FAIL2', message: 'Network error' },
    ]);
    expect(summary.successCount).toBe(1);
    expect(postPayload).toBe(xml);
  });

  it('has no payload when every plate failed', () => {
    const xml = makeBulkXml({
      vehicles: [],
      errors: [{ reg: 'XX0000000', message: NO_AUTOSYS_DATA }],
    });

    const { summary, postPayload } = assembleAutosysResults(xml, entries('XX0000000'));

    expect(summary.vehicleCount).toBe(0);
    expect(summary.successCount).toBe(0);
    expect(summary.errors).toHaveLength(1);
    expect(postPayload).toBeUndefined();
  });

  it('fails every plate when the response has no ResourceFrame', () => {
    const badXml = `<?xml version="1.0"?><PublicationDelivery><dataObjects></dataObjects></PublicationDelivery>`;

    const { summary, postPayload } = assembleAutosysResults(badXml, entries('AB1234', 'CD5678'));

    expect(summary.successCount).toBe(0);
    expect(summary.errors).toEqual([
      { queryRegNumber: 'AB1234', message: 'No ResourceFrame found in response' },
      { queryRegNumber: 'CD5678', message: 'No ResourceFrame found in response' },
    ]);
    expect(postPayload).toBeUndefined();
  });

  it('fails every plate when the response is not XML', () => {
    const { summary, postPayload } = assembleAutosysResults(
      'not xml at all <<<>>>',
      entries('AB1234')
    );

    expect(summary.errors).toHaveLength(1);
    expect(summary.errors[0].queryRegNumber).toBe('AB1234');
    expect(postPayload).toBeUndefined();
  });

  // The payload goes to Sobek as shepet sent it — never re-serialised, so `0080` stays `0080`.
  it('sends numeric-looking text back verbatim', () => {
    const xml = makeBulkXml({ vehicles: [{ reg: '0080' }] });

    const { postPayload } = assembleAutosysResults(xml, entries('0080'));

    expect(postPayload).toContain('<RegistrationNumber>0080</RegistrationNumber>');
  });
});

describe('failedAutosysResult', () => {
  it('gives each requested plate the same error and no payload', () => {
    const { summary, postPayload } = failedAutosysResult(entries('A', 'B'), 'boom');

    expect(summary.errors).toEqual([
      { queryRegNumber: 'A', message: 'boom' },
      { queryRegNumber: 'B', message: 'boom' },
    ]);
    expect(summary.successCount).toBe(0);
    expect(postPayload).toBeUndefined();
  });
});
