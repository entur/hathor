import { describe, it, expect, vi, afterEach } from 'vitest';
import { importAsNetexToBackend } from './vehicleImportServices.ts';

const IMPORT_URL = 'http://sobek/services/vehicles/netex';

describe('importAsNetexToBackend', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('sends the vehicleTypeKind Sobek requires (entur/sobek#234)', async () => {
    const fetchMock = vi.fn(async (_url: URL) => ({ ok: true, text: async () => '<xml/>' }));
    vi.stubGlobal('fetch', fetchMock);
    await importAsNetexToBackend(IMPORT_URL, '<xml/>', null);
    const url = fetchMock.mock.calls[0][0];
    expect(url.origin + url.pathname).toBe(IMPORT_URL);
    expect(url.searchParams.get('vehicleTypeKind')).toBe('PHYSICAL');
  });

  it("throws Sobek's error body, not the often empty statusText", async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        statusText: '',
        text: async () => 'vehicleTypeKind is required',
      }))
    );
    await expect(importAsNetexToBackend(IMPORT_URL, '<xml/>', null)).rejects.toThrow(
      'vehicleTypeKind is required'
    );
  });
});
