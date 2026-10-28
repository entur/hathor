// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSelectionGuard } from './useSelectionGuard';

const mocks = vi.hoisted(() => ({ org: { id: 'ORG:1' } as { id: string } | null }));

vi.mock('../contexts/useOrganisationsContext.ts', () => ({
  useOrganisationsContext: () => ({ currentOrganisation: mocks.org }),
}));

const renderGuard = (id: string) =>
  renderHook(({ id }) => useSelectionGuard(id), { initialProps: { id } });

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

  it('returns a stable capture function', () => {
    const { result, rerender } = renderGuard('A');
    const capture = result.current;
    rerender({ id: 'B' });
    expect(result.current).toBe(capture);
  });
});
