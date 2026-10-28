// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSelectionGuard } from './useSelectionGuard';

const mocks = vi.hoisted(() => ({ org: { id: 'ORG:1' } as { id: string } | null }));

vi.mock('../contexts/useOrganisationsContext.ts', () => ({
  useOrganisationsContext: () => ({ currentOrganisation: mocks.org }),
}));

const renderGuard = (id: string) =>
  renderHook(({ id }) => useSelectionGuard(id).captureSelection, { initialProps: { id } });

describe('useSelectionGuard', () => {
  beforeEach(() => {
    mocks.org = { id: 'ORG:1' };
  });

  it('stays current while the selection is unchanged', () => {
    const { result, rerender } = renderGuard('A');
    const isCurrent = result.current();
    rerender({ id: 'A' });
    expect(isCurrent()).toBe(true);
  });

  it('goes stale when the id changes', () => {
    const { result, rerender } = renderGuard('A');
    const isCurrent = result.current();
    rerender({ id: 'B' });
    expect(isCurrent()).toBe(false);
  });

  it('stays stale after a round trip back to the same id', () => {
    const { result, rerender } = renderGuard('A');
    const isCurrent = result.current();
    rerender({ id: 'B' });
    rerender({ id: 'A' });
    expect(isCurrent()).toBe(false);
    expect(result.current()()).toBe(true);
  });

  it('goes stale when the organisation changes', () => {
    const { result, rerender } = renderGuard('A');
    const isCurrent = result.current();
    mocks.org = { id: 'ORG:2' };
    rerender({ id: 'A' });
    expect(isCurrent()).toBe(false);
  });

  it('goes stale when the editor unmounts (the pane closed)', () => {
    const { result, unmount } = renderGuard('A');
    const isCurrent = result.current();
    unmount();
    expect(isCurrent()).toBe(false);
  });

  it('returns a stable capture function', () => {
    const { result, rerender } = renderGuard('A');
    const capture = result.current;
    rerender({ id: 'B' });
    expect(result.current).toBe(capture);
  });

  it('exposes the org + id selection key the guard follows', () => {
    const { result, rerender } = renderHook(({ id }) => useSelectionGuard(id).selection, {
      initialProps: { id: 'A' },
    });
    expect(result.current).toEqual({ id: 'A', orgId: 'ORG:1', key: 'ORG:1|A' });
    const first = result.current;
    rerender({ id: 'A' });
    expect(result.current).toBe(first);
    mocks.org = null;
    rerender({ id: 'A' });
    expect(result.current.key).toBe('null|A');
  });
});
