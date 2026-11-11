import { describe, expect, it } from 'vitest';
import { addDataOwnerRefToFrame, toArray } from './xmlUtils';

describe('toArray', () => {
  it('wraps a single value', () => {
    expect(toArray('a')).toEqual(['a']);
  });

  it('returns an array as-is', () => {
    expect(toArray([1, 2])).toEqual([1, 2]);
  });

  it('returns empty array for undefined', () => {
    expect(toArray(undefined)).toEqual([]);
  });

  it('returns empty array for null', () => {
    expect(toArray(null)).toEqual([]);
  });
});

describe('addDataOwnerRefToFrame', () => {
  it('puts DefaultResponsibilitySetRef before a stored DefaultLocale (XSD sequence)', () => {
    const frame = {
      FrameDefaults: {
        DefaultCodespaceRef: { '@_ref': 'NMR' },
        DefaultLocale: { TimeZone: 'Europe/Oslo' },
      },
    };
    addDataOwnerRefToFrame(frame, {}, 'ATB');
    expect(Object.keys(frame.FrameDefaults)).toEqual([
      'DefaultCodespaceRef',
      'DefaultResponsibilitySetRef',
      'DefaultLocale',
    ]);
  });

  it('puts responsibilitySets after the frame head, before the entity collections', () => {
    const composite = { Description: 'c', FrameDefaults: {}, frames: {} };
    const resourceFrame = { '@_id': 'NMR:ResourceFrame:1', Description: 'r', deckPlans: {} };
    addDataOwnerRefToFrame(composite, resourceFrame, 'ATB');
    expect(Object.keys(resourceFrame)).toEqual([
      '@_id',
      'Description',
      'responsibilitySets',
      'deckPlans',
    ]);
    expect(JSON.stringify(resourceFrame)).toContain('"ResponsibleOrganisationRef":{"@_ref":"ATB"}');
  });

  it('adds FrameDefaults after the head, before frames, when absent', () => {
    const composite = { '@_id': 'NMR:CompositeFrame:1', Description: 'c', frames: {} };
    addDataOwnerRefToFrame(composite, {}, 'ATB');
    expect(Object.keys(composite)).toEqual(['@_id', 'Description', 'FrameDefaults', 'frames']);
    expect(composite).toMatchObject({
      FrameDefaults: { DefaultResponsibilitySetRef: { '@_ref': 'NMR:ResponsibilitySet:1' } },
    });
  });
});
