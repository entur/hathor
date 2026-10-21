import { describe, it, expect } from 'vitest';
import { isFeatureOn } from './featureFlags.ts';

describe('isFeatureOn', () => {
  it('is on when the caller passes no flag', () => {
    expect(isFeatureOn({})).toBe(true);
  });

  it('is off when the key is missing', () => {
    expect(isFeatureOn({}, 'DeckPlans')).toBe(false);
    expect(isFeatureOn({ sandboxFeatures: {} }, 'DeckPlans')).toBe(false);
    expect(isFeatureOn({}, 'enableDeckPlanRefs')).toBe(false);
  });

  it('reads sandboxFeatures keys from sandboxFeatures', () => {
    expect(isFeatureOn({ sandboxFeatures: { DeckPlans: true } }, 'DeckPlans')).toBe(true);
    expect(isFeatureOn({ sandboxFeatures: { DeckPlans: false } }, 'DeckPlans')).toBe(false);
  });

  it('reads enable* flags from the top level', () => {
    expect(isFeatureOn({ enableDeckPlanRefs: true }, 'enableDeckPlanRefs')).toBe(true);
    expect(isFeatureOn({ enableDeckPlanRefs: false }, 'enableDeckPlanRefs')).toBe(false);
  });

  it('keeps the two flags independent', () => {
    expect(isFeatureOn({ enableDeckPlanRefs: true }, 'DeckPlans')).toBe(false);
    expect(isFeatureOn({ sandboxFeatures: { DeckPlans: true } }, 'enableDeckPlanRefs')).toBe(false);
  });
});
