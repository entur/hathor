// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useLatestRequest } from './useLatestRequest.ts';

describe('useLatestRequest', () => {
  it('only the newest ticket is current', () => {
    const { result } = renderHook(() => useLatestRequest());
    const first = result.current();
    expect(first()).toBe(true);
    const second = result.current();
    expect(first()).toBe(false);
    expect(second()).toBe(true);
  });

  it('begin is stable across renders', () => {
    const { result, rerender } = renderHook(() => useLatestRequest());
    const begin = result.current;
    rerender();
    expect(result.current).toBe(begin);
  });
});
