import { describe, it, expect } from 'vitest';
import { parseVehicleImportResponse } from './parseVehicleImportResponse';

const RESP_FLAT = `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex" version="1.0">
  <PublicationTimestamp>2026-05-13T00:00:00Z</PublicationTimestamp>
  <dataObjects>
    <ResourceFrame id="RF:1" version="1">
      <vehicles>
        <Vehicle id="NMR:Vehicle:42" version="1"/>
      </vehicles>
    </ResourceFrame>
  </dataObjects>
</PublicationDelivery>`;

const RESP_COMPOSITE = `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex">
  <dataObjects>
    <CompositeFrame id="NMR:CompositeFrame:99" version="1">
      <frames>
        <ResourceFrame id="NMR:ResourceFrame:7" version="1">
          <vehicles>
            <Vehicle id="NMR:Vehicle:777" version="2"/>
          </vehicles>
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`;

const RESP_MANY = `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery xmlns="http://www.netex.org.uk/netex">
  <dataObjects>
    <ResourceFrame id="RF:1" version="1">
      <vehicles>
        <Vehicle id="NMR:Vehicle:A" version="1"/>
        <Vehicle id="NMR:Vehicle:B" version="1"/>
      </vehicles>
    </ResourceFrame>
  </dataObjects>
</PublicationDelivery>`;

describe('parseVehicleImportResponse', () => {
  it('extracts Vehicle/@id from a flat ResourceFrame layout', () => {
    expect(parseVehicleImportResponse(RESP_FLAT)).toBe('NMR:Vehicle:42');
  });

  it('extracts Vehicle/@id from a CompositeFrame-wrapped layout', () => {
    expect(parseVehicleImportResponse(RESP_COMPOSITE)).toBe('NMR:Vehicle:777');
  });

  it('returns the first Vehicle when multiple are present', () => {
    expect(parseVehicleImportResponse(RESP_MANY)).toBe('NMR:Vehicle:A');
  });

  it('returns null for an empty body', () => {
    expect(parseVehicleImportResponse('')).toBeNull();
    expect(parseVehicleImportResponse('   ')).toBeNull();
  });

  it('returns null when the body is not XML', () => {
    expect(parseVehicleImportResponse('OK')).toBeNull();
    expect(parseVehicleImportResponse('{"status":"ok"}')).toBeNull();
  });

  it('returns null when there is no Vehicle in the response', () => {
    const noVehicle = `<?xml version="1.0"?><PublicationDelivery><dataObjects><ResourceFrame><vehicleTypes><VehicleType id="X" version="1"/></vehicleTypes></ResourceFrame></dataObjects></PublicationDelivery>`;
    expect(parseVehicleImportResponse(noVehicle)).toBeNull();
  });
});
