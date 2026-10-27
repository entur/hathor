import { describe, expect, it } from 'vitest';
import { assembleAutosysResults } from './assembleAutosysResults';
import type { ImportEntry } from '../types/importTypes';
import { NO_AUTOSYS_DATA, makeBulkXml } from './__fixtures__/makeXml';

const entries = (...regs: string[]): ImportEntry[] =>
  regs.map(queryRegNumber => ({ queryRegNumber }));

describe('assembleAutosysResults', () => {
  it('summarises a single vehicle and passes the XML through as payload', () => {
    const xml = makeBulkXml({ vehicles: [{ reg: 'AB1234' }] });

    const { summary, postPayload } = assembleAutosysResults(xml, entries('AB1234'));

    expect(summary.vehicleCount).toBe(1);
    expect([...summary.vehicleTypeIds]).toEqual(['NMR:VehicleType:1']);
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

  // A response without a ResourceFrame means the whole request failed, not one plate.
  it('throws when the response has no ResourceFrame', () => {
    const badXml = `<?xml version="1.0"?><PublicationDelivery><dataObjects></dataObjects></PublicationDelivery>`;

    expect(() => assembleAutosysResults(badXml, entries('AB1234'))).toThrow(
      'No ResourceFrame found in response'
    );
  });

  // The payload goes to Sobek as shepet sent it — never re-serialised, so `0080` stays `0080`.
  it('sends numeric-looking text back verbatim', () => {
    const xml = makeBulkXml({ vehicles: [{ reg: '0080' }] });

    const { postPayload } = assembleAutosysResults(xml, entries('0080'));

    expect(postPayload).toContain('<RegistrationNumber>0080</RegistrationNumber>');
  });
});
