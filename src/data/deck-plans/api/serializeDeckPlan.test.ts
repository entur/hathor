import { describe, it, expect } from 'vitest';
import { serializeDeckPlan } from './fetchDeckPlans.ts';
import type { DeckPlan } from '../../vehicle-types/types/vehicleTypeTypes.ts';

/** Owning-organisation ref threaded into every serialize call (required input field). */
const OWNER = 'NMR:Organisation:1';

/**
 * serializeDeckPlan is the domain→input inverse of projectDeckPlan.
 * It must (a) rename id→netexId, (b) emit the full document with blanks
 * as explicit null (full-replace, not omit-blank — Sobek's
 * createOrUpdateDeckPlan nulls absent input fields), and (c) drop the
 * server-managed `version` field the input contract does not accept.
 */
describe('serializeDeckPlan', () => {
  it('renames id→netexId and keeps populated name + description', () => {
    const dp: DeckPlan = {
      id: 'NMR:DeckPlan:DP1',
      version: 3,
      name: { value: 'Standard' },
      description: { value: 'Two-deck commuter' },
    };
    const input = serializeDeckPlan(dp, OWNER);
    expect(input.netexId).toBe('NMR:DeckPlan:DP1');
    expect(input.dataOwnerRef).toBe(OWNER);
    expect(input.name).toEqual({ value: 'Standard' });
    expect(input.description).toEqual({ value: 'Two-deck commuter' });
    // `version` is server-managed and not part of DeckPlanInput.
    expect(input).not.toHaveProperty('version');
  });

  it('emits explicit null (not omit-blank) for absent name and description', () => {
    // Sobek's createOrUpdateDeckPlan is a full-replace: an omitted field nulls
    // the persisted value. Sending explicit null mirrors the empty-domain
    // state so a round-trip is faithful (does not destroy data on re-save).
    const dp: DeckPlan = { id: 'NMR:DeckPlan:DP2', version: 1 };
    const input = serializeDeckPlan(dp, OWNER);
    expect(input.name).toBeNull();
    expect(input.description).toBeNull();
  });

  it('omits netexId when id is empty (the create-flow signature)', () => {
    // The blank-id factory marks a row not-yet-persisted. Sending `netexId:
    // ""` would attempt update against a nonexistent id; omitting it tells
    // Sobek to mint a fresh one.
    const dp: DeckPlan = { id: '', name: { value: 'New plan' } };
    const input = serializeDeckPlan(dp, OWNER);
    expect(input.netexId).toBeUndefined();
    expect(input.name).toEqual({ value: 'New plan' });
    expect(input.description).toBeNull();
  });

  it('threads the caller-supplied dataOwnerRef onto the input', () => {
    const dp: DeckPlan = { id: 'NMR:DeckPlan:DP3' };
    expect(serializeDeckPlan(dp, 'NMR:Organisation:42').dataOwnerRef).toBe('NMR:Organisation:42');
  });
});
