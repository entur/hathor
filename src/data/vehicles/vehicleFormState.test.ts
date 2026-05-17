import { describe, expect, it } from 'vitest';
import { edit, hydrate, initialFormState, isDirty, type FormState } from './vehicleFormState';
import { BLANK_FORM, MISSING_MODEL } from './vehicleFormDefaults';
import type { Vehicle } from './xml/Vehicle';
import type { VehicleEditFormValue } from './VehicleEditForm';

const aVehicle: Partial<Vehicle> = {
  $id: 'NMR:Vehicle:bus-1',
  $version: '1',
  RegistrationNumber: 'BUS-001',
  Name: [{ value: 'Bus One' }],
};

const editFor = (s: FormState, mutate: (v: VehicleEditFormValue) => VehicleEditFormValue) =>
  edit(s, mutate(s.form));

describe('vehicleFormState — dirty tracking through load/edit/cancel cycles', () => {
  it('initial blank state is not dirty', () => {
    expect(isDirty(initialFormState)).toBe(false);
    expect(initialFormState.form).toEqual(BLANK_FORM);
  });

  it('M2: hydrating from xmlVehicle does NOT flip dirty=true', () => {
    // Reproducer of M2 (PR #74 review). The previous VehicleDetails inlined
    // `initialFormKey = useMemo(...xmlVehicle...)` *and* `setForm(hydrate)`
    // in a separate effect — non-atomic. On the render between the memo
    // recompute and the effect commit, form was still BLANK_FORM while the
    // baseline key was already the hydrated snapshot, so `isDirty` blipped
    // true and `useDirtyFormBlock` armed `beforeunload` on a freshly-loaded
    // vehicle. This module makes the two updates atomic: `hydrate` advances
    // form AND baseline in a single returned state, so dirty stays false.
    const loaded = hydrate(initialFormState, aVehicle);
    expect(isDirty(loaded)).toBe(false);
  });

  it('user edit after hydrate flips dirty=true', () => {
    const loaded = hydrate(initialFormState, aVehicle);
    const edited = editFor(loaded, v => ({
      ...v,
      vehicle: { ...v.vehicle, RegistrationNumber: 'BUS-NEW' },
    }));
    expect(isDirty(edited)).toBe(true);
  });

  it('reverting an edit back to the loaded baseline clears dirty', () => {
    const loaded = hydrate(initialFormState, aVehicle);
    const edited = editFor(loaded, v => ({
      ...v,
      vehicle: { ...v.vehicle, RegistrationNumber: 'BUS-NEW' },
    }));
    const reverted = edit(edited, loaded.form);
    expect(isDirty(reverted)).toBe(false);
  });

  it('re-hydrate with the same xmlVehicle resets dirty (cancel-edit path)', () => {
    const loaded = hydrate(initialFormState, aVehicle);
    const edited = editFor(loaded, v => ({
      ...v,
      vehicle: { ...v.vehicle, RegistrationNumber: 'BUS-NEW' },
    }));
    expect(isDirty(edited)).toBe(true);
    const cancelled = hydrate(edited, aVehicle);
    expect(isDirty(cancelled)).toBe(false);
  });

  it('hydrate(undefined) collapses back to BLANK_FORM and clean baseline', () => {
    const loaded = hydrate(initialFormState, aVehicle);
    const cleared = hydrate(loaded, undefined);
    expect(cleared.form).toEqual(BLANK_FORM);
    expect(isDirty(cleared)).toBe(false);
  });

  it('hydrated form preserves MISSING_MODEL until issue #69 brings a real model fetch', () => {
    const loaded = hydrate(initialFormState, aVehicle);
    expect(loaded.form.model).toEqual(MISSING_MODEL);
    expect(loaded.form.vehicle).toBe(aVehicle);
  });
});
