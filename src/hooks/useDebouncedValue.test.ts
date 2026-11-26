// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDebouncedValue } from './useDebouncedValue.ts';

const MS = 300;

describe('useDebouncedValue', () => {
  it('starts at the value and follows it only after a pause', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v, MS), {
      initialProps: { v: 1 },
    });
    expect(result.current).toBe(1);
    rerender({ v: 2 });
    act(() => vi.advanceTimersByTime(MS - 1));
    rerender({ v: 3 });
    act(() => vi.advanceTimersByTime(MS - 1));
    expect(result.current).toBe(1);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe(3);
    vi.useRealTimers();
  });
});
