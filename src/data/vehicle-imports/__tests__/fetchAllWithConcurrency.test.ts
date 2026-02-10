import { describe, expect, it, vi } from 'vitest';
import { fetchAllWithConcurrency } from '../fetchAllWithConcurrency';

describe('fetchAllWithConcurrency', () => {
  it('returns empty array for empty input', async () => {
    const onProgress = vi.fn();
    const results = await fetchAllWithConcurrency([], vi.fn(), 5, onProgress);
    expect(results).toEqual([]);
    expect(onProgress).not.toHaveBeenCalled();
  });

  it('fetches all items and reports progress', async () => {
    const onProgress = vi.fn();
    const fetchFn = vi.fn(async (rn: string) => `<xml>${rn}</xml>`);

    const results = await fetchAllWithConcurrency(['A', 'B', 'C'], fetchFn, 5, onProgress);

    expect(results).toHaveLength(3);
    expect(results[0]).toEqual({ queryRegNumber: 'A', xml: '<xml>A</xml>', error: null });
    expect(results[1]).toEqual({ queryRegNumber: 'B', xml: '<xml>B</xml>', error: null });
    expect(results[2]).toEqual({ queryRegNumber: 'C', xml: '<xml>C</xml>', error: null });
    expect(fetchFn).toHaveBeenCalledTimes(3);
    expect(onProgress).toHaveBeenCalledTimes(3);
    expect(onProgress).toHaveBeenLastCalledWith(3);
  });

  it('captures errors without rejecting', async () => {
    const fetchFn = vi.fn(async (rn: string) => {
      if (rn === 'BAD') throw new Error('Network failure');
      return `<xml>${rn}</xml>`;
    });

    const results = await fetchAllWithConcurrency(['OK', 'BAD'], fetchFn, 5, vi.fn());

    expect(results[0]).toEqual({ queryRegNumber: 'OK', xml: '<xml>OK</xml>', error: null });
    expect(results[1]).toEqual({ queryRegNumber: 'BAD', xml: '', error: 'Network failure' });
  });

  it('captures non-Error throws as "Unknown error"', async () => {
    const fetchFn = vi.fn(async () => {
      throw 'string error';
    });

    const results = await fetchAllWithConcurrency(['A'], fetchFn, 5, vi.fn());
    expect(results[0].error).toBe('Unknown error');
  });

  it('respects concurrency limit', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;

    const fetchFn = vi.fn(async (rn: string) => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise(r => setTimeout(r, 10));
      concurrent--;
      return `<xml>${rn}</xml>`;
    });

    await fetchAllWithConcurrency(['A', 'B', 'C', 'D', 'E'], fetchFn, 2, vi.fn());

    expect(maxConcurrent).toBeLessThanOrEqual(2);
    expect(fetchFn).toHaveBeenCalledTimes(5);
  });

  it('works when concurrency exceeds item count', async () => {
    const fetchFn = vi.fn(async (rn: string) => `<xml>${rn}</xml>`);

    const results = await fetchAllWithConcurrency(['A'], fetchFn, 10, vi.fn());

    expect(results).toHaveLength(1);
    expect(results[0].queryRegNumber).toBe('A');
  });

  it('maintains positional alignment with input', async () => {
    const delays: Record<string, number> = { A: 30, B: 10, C: 20 };
    const fetchFn = vi.fn(async (rn: string) => {
      await new Promise(r => setTimeout(r, delays[rn]));
      return `<xml>${rn}</xml>`;
    });

    const results = await fetchAllWithConcurrency(['A', 'B', 'C'], fetchFn, 3, vi.fn());

    expect(results[0].queryRegNumber).toBe('A');
    expect(results[1].queryRegNumber).toBe('B');
    expect(results[2].queryRegNumber).toBe('C');
  });
});
