import { describe, expect, it } from 'vitest';
import { canSubmit } from './vehicleCanSubmit';
import { BLANK_FORM } from './vehicleFormDefaults';

describe('canSubmit (Vehicle create gate)', () => {
  it('is false for the blank create form', () => {
    expect(canSubmit(BLANK_FORM)).toBe(false);
  });

  it('is false for a transportType without an id', () => {
    expect(canSubmit({ vehicle: { id: '', transportType: { id: '' } } })).toBe(false);
  });

  it('is true once a VehicleType is picked', () => {
    expect(canSubmit({ vehicle: { id: '', transportType: { id: 'NMR:VehicleType:1' } } })).toBe(
      true
    );
  });
});
