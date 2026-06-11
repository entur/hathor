import { describe, it, expect } from 'vitest';
import { intToRef, refToInt, TRANSPORT_TYPE_PREFIX } from './transportTypeRef';

/**
 * Unit coverage for the bare-numeric ⟷ full-netex-ref mapping the VehicleEditForm
 * applies to the TransportType field. This is the home for the "save sends a
 * prefixed `NMR:VehicleType:<int>` ref" contract that `vehicle-create-form.spec`
 * used to assert by spying on the mutation input — a pure function belongs in a
 * unit test, not an e2e request-spy.
 */
describe('transportTypeRef', () => {
  describe('intToRef — splices the codespace prefix onto a typed number', () => {
    it('prefixes a plain integer', () => {
      expect(intToRef('2')).toBe('NMR:VehicleType:2');
      expect(intToRef('24')).toBe(`${TRANSPORT_TYPE_PREFIX}24`);
    });

    it('trims surrounding whitespace before prefixing', () => {
      expect(intToRef('  7 ')).toBe('NMR:VehicleType:7');
    });

    it('returns undefined for non-numeric input (gate stays disabled)', () => {
      expect(intToRef('')).toBeUndefined();
      expect(intToRef('abc')).toBeUndefined();
      expect(intToRef('2a')).toBeUndefined();
      expect(intToRef('NMR:VehicleType:2')).toBeUndefined();
    });
  });

  describe('refToInt — strips the prefix back to the bare numeric input', () => {
    it('extracts the integer from a well-formed ref', () => {
      expect(refToInt('NMR:VehicleType:2')).toBe('2');
      expect(refToInt('NMR:VehicleType:24')).toBe('24');
    });

    it('returns empty string for absent or non-numeric refs (raw display fallback)', () => {
      expect(refToInt(undefined)).toBe('');
      expect(refToInt('NMR:VehicleType:rail')).toBe('');
      expect(refToInt('something-else')).toBe('');
    });
  });

  it('round-trips int → ref → int', () => {
    expect(refToInt(intToRef('13'))).toBe('13');
  });
});
