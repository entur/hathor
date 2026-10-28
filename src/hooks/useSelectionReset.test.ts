// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { isCreateAdvance, useSelectionReset } from './useSelectionReset';
import { selectionKeyOf, type Selection } from './useSelectionGuard';
import { NEW_SELECTION } from './useUrlEditorSelection';

const sel = (orgId: string | null, id: string): Selection => ({
  id,
  orgId,
  key: selectionKeyOf(orgId, id),
});

const renderReset = (initial: Selection, bridgeId: string | null = null) => {
  const reset = vi.fn();
  const hook = renderHook(
    ({ selection, bridgeId }) => useSelectionReset(selection, bridgeId, reset),
    { initialProps: { selection: initial, bridgeId } }
  );
  return { reset, ...hook };
};

describe('isCreateAdvance', () => {
  it('is true for new → the bridged id in the same org', () => {
    expect(isCreateAdvance(sel('O1', NEW_SELECTION), sel('O1', 'X:1'), 'X:1')).toBe(true);
  });

  it('is false for another id, another org, no bridge, or a non-create origin', () => {
    expect(isCreateAdvance(sel('O1', NEW_SELECTION), sel('O1', 'X:2'), 'X:1')).toBe(false);
    expect(isCreateAdvance(sel('O1', NEW_SELECTION), sel('O2', 'X:1'), 'X:1')).toBe(false);
    expect(isCreateAdvance(sel('O1', NEW_SELECTION), sel('O1', 'X:1'), null)).toBe(false);
    expect(isCreateAdvance(sel('O1', 'X:0'), sel('O1', 'X:1'), 'X:1')).toBe(false);
  });
});

describe('useSelectionReset', () => {
  it('does not reset while the selection is unchanged', () => {
    const { reset, rerender } = renderReset(sel('O1', 'A'));
    rerender({ selection: sel('O1', 'A'), bridgeId: null });
    expect(reset).not.toHaveBeenCalled();
  });

  it('resets, dropping the form, when the id changes', () => {
    const { reset, rerender } = renderReset(sel('O1', 'A'));
    rerender({ selection: sel('O1', 'B'), bridgeId: null });
    expect(reset).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('resets on an organisation change with the same id, and again on the way back', () => {
    const { reset, rerender } = renderReset(sel('O1', 'A'));
    rerender({ selection: sel('O2', 'A'), bridgeId: null });
    rerender({ selection: sel('O1', 'A'), bridgeId: null });
    expect(reset.mock.calls).toEqual([[false], [false]]);
  });

  it('keeps the form for the create-advance', () => {
    const { reset, rerender } = renderReset(sel('O1', NEW_SELECTION));
    rerender({ selection: sel('O1', 'X:1'), bridgeId: 'X:1' });
    expect(reset).toHaveBeenCalledExactlyOnceWith(true);
  });
});
