import { describe, it, expect } from 'vitest';
import { mergeNameText } from './multilingualString.ts';

/**
 * mergeNameText — a name field edits only `value`; the existing `lang` tag must
 * survive (else a full-document save rebuilds `{ value }` and drops it). Shared
 * across vehicle-types + vehicles; pins the logic formerly spied via the
 * vehicle-type-sidebar e2e "preserves lang tag" test.
 */
describe('mergeNameText', () => {
  it('preserves the existing lang tag when editing the text', () => {
    expect(mergeNameText({ value: 'Type Beta', lang: 'nb' }, 'Type Beta X')).toEqual({
      value: 'Type Beta X',
      lang: 'nb',
    });
  });

  it('sets the value with no lang when there was none', () => {
    expect(mergeNameText({ value: 'Type Alpha' }, 'Type Alpha X')).toEqual({
      value: 'Type Alpha X',
    });
  });

  it('handles an undefined baseline (new name)', () => {
    expect(mergeNameText(undefined, 'Fresh')).toEqual({ value: 'Fresh' });
  });

  it('clears the name to undefined on a blank field', () => {
    expect(mergeNameText({ value: 'Type Beta', lang: 'nb' }, '')).toBeUndefined();
  });
});
