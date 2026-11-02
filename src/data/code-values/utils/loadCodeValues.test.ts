import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cachedCodeValues, clearCodeValuesCache, loadCodeValues } from './loadCodeValues.ts';
import { fetchCodeValues } from '../api/fetchCodeValues.ts';
import { EMISSION_STANDARD } from '../types/codeValueTypes.ts';

vi.mock('../api/fetchCodeValues.ts', () => ({ fetchCodeValues: vi.fn() }));

const mockedFetch = vi.mocked(fetchCodeValues);
const EURO_6 = [{ value: 'Euro6', label: 'Euro 6' }];
const getToken = vi.fn(async () => 'tok');

describe('loadCodeValues', () => {
  beforeEach(() => {
    mockedFetch.mockReset();
    getToken.mockClear();
    clearCodeValuesCache();
  });

  it('fetches once and serves later calls from cache', async () => {
    mockedFetch.mockResolvedValue(EURO_6);
    expect(cachedCodeValues(EMISSION_STANDARD)).toBeUndefined();

    const first = await loadCodeValues('http://x', getToken, EMISSION_STANDARD);
    const second = await loadCodeValues('http://x', getToken, EMISSION_STANDARD);

    expect(first).toBe(EURO_6);
    expect(second).toBe(first);
    expect(cachedCodeValues(EMISSION_STANDARD)).toBe(first);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockedFetch).toHaveBeenCalledWith('http://x', 'tok', EMISSION_STANDARD);
    expect(getToken).toHaveBeenCalledTimes(1);
  });

  it('shares one request between concurrent callers', async () => {
    mockedFetch.mockResolvedValue(EURO_6);
    const [a, b] = await Promise.all([
      loadCodeValues('http://x', getToken, EMISSION_STANDARD),
      loadCodeValues('http://x', getToken, EMISSION_STANDARD),
    ]);
    expect(a).toBe(b);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });

  it('does not cache a failure — the next call retries', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('boom'));
    await expect(loadCodeValues('http://x', getToken, EMISSION_STANDARD)).rejects.toThrow('boom');
    expect(cachedCodeValues(EMISSION_STANDARD)).toBeUndefined();

    mockedFetch.mockResolvedValue(EURO_6);
    await expect(loadCodeValues('http://x', getToken, EMISSION_STANDARD)).resolves.toBe(EURO_6);
    expect(mockedFetch).toHaveBeenCalledTimes(2);
  });
});
