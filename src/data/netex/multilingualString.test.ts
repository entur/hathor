import { describe, it, expect } from 'vitest';
import { mergeNameText, trimName } from './multilingualString.ts';

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

/**
 * Canonical home for the trim-drop-blank-keep-lang rule. Three call sites
 * spell the emptiness decision differently on the way out — GQL wants an
 * explicit `null`, the form store wants `undefined`, the XML patcher wants a
 * `<Text>` node — but they share this one.
 */
describe('trimName', () => {
  it('trims the value and keeps lang', () => {
    expect(trimName({ value: '  Plan Alpha  ', lang: 'nb' })).toEqual({
      value: 'Plan Alpha',
      lang: 'nb',
    });
  });

  it('omits lang when there was none', () => {
    expect(trimName({ value: ' Plan Alpha ' })).toEqual({ value: 'Plan Alpha' });
  });

  // Sobek serializes an empty Name as a whitespace string, not null — so
  // emptiness has to be decided after trimming, not before.
  it('drops a name that is only whitespace', () => {
    expect(trimName({ value: '   ' })).toBeUndefined();
    expect(trimName({ value: '\n  \t ', lang: 'nb' })).toBeUndefined();
  });

  it('drops an empty, missing or null name', () => {
    expect(trimName({ value: '' })).toBeUndefined();
    expect(trimName(undefined)).toBeUndefined();
    expect(trimName(null)).toBeUndefined();
  });
});
