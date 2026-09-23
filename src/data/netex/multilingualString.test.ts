import { describe, it, expect } from 'vitest';
import { mergeNameText, netexText, netexName } from './multilingualString.ts';

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
 * `<Text>` node — but they share this one. Hence absent rather than `''`: a
 * blank that survives as a value has to be re-judged at all three.
 */
describe('netexName', () => {
  it('trims the value and keeps lang', () => {
    expect(netexName({ value: '  Plan Alpha  ', lang: 'nb' })).toEqual({
      value: 'Plan Alpha',
      lang: 'nb',
    });
  });

  it('omits lang when there was none', () => {
    expect(netexName({ value: ' Plan Alpha ' })).toEqual({ value: 'Plan Alpha' });
  });

  // Sobek serializes an empty Name as a whitespace string, not null — so
  // emptiness has to be decided after trimming, not before.
  it('drops a name that is only whitespace', () => {
    expect(netexName({ value: '   ' })).toBeUndefined();
    expect(netexName({ value: '\n  \t ', lang: 'nb' })).toBeUndefined();
  });

  it('drops an empty, missing or null name', () => {
    expect(netexName({ value: '' })).toBeUndefined();
    expect(netexName(undefined)).toBeUndefined();
    expect(netexName(null)).toBeUndefined();
  });
});

/**
 * netexText — the read-side counterpart to `netexName`, for values that came
 * out of an XML parser rather than GQL. The deck-renderer bundle stores
 * `Deck.Name` verbatim (`this.Name = o ?? ''`), so whichever shape the document
 * carried reaches the caption unchanged: a `MultilingualString` arrives as
 * `{text_value}` and would render as `[object Object]` — in React, it throws.
 * The upstream package's own tree view unwraps exactly these three shapes.
 */
describe('netexText', () => {
  // What the deck-renderer's own parser hands back for a `<Name><Text>` deck
  // name — verified by the EditTabDeckNames story, which crashed on exactly
  // this shape ("found: object with keys {Text}").
  it('unwraps a <Name><Text> node parsed to Text', () => {
    expect(netexText({ Text: 'Lower' })).toBe('Lower');
  });

  it('unwraps the text_value spelling the package uses elsewhere', () => {
    expect(netexText({ text_value: 'Lower' })).toBe('Lower');
  });

  it('unwraps the GQL-shaped value field too', () => {
    expect(netexText({ value: 'Lower' })).toBe('Lower');
  });

  it('passes a plain string through', () => {
    expect(netexText('Lower')).toBe('Lower');
  });

  // Same rule as netexName: Sobek writes an empty Name as whitespace, and a
  // truthy '  ' would suppress the caller's ordinal fallback.
  it('drops a blank, whitespace, missing or null value in every shape', () => {
    expect(netexText({ Text: '  \n' })).toBeUndefined();
    expect(netexText({ text_value: '  \n' })).toBeUndefined();
    expect(netexText({ value: '' })).toBeUndefined();
    expect(netexText('   ')).toBeUndefined();
    expect(netexText(undefined)).toBeUndefined();
    expect(netexText(null)).toBeUndefined();
    expect(netexText({})).toBeUndefined();
  });
});
