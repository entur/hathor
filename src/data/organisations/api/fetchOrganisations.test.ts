import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchOrganisations } from './fetchOrganisations.ts';
import { fetchOrganisationsRequest } from '../../../graphql/vehicles/queries/fetchOrganisations.ts';

vi.mock('../../../graphql/vehicles/queries/fetchOrganisations.ts', () => ({
  fetchOrganisationsRequest: vi.fn(),
}));

const mockedRequest = vi.mocked(fetchOrganisationsRequest);

const mkPage = (content: Array<Record<string, unknown>>, totalElements = content.length) => ({
  organisations: { content, totalElements, page: 0, size: content.length },
});

describe('fetchOrganisations', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('returns an empty array when content is empty', async () => {
    mockedRequest.mockResolvedValue(mkPage([]));
    const organisations = await fetchOrganisations('http://x', null);
    expect(organisations).toEqual([]);
  });

  it('projects an organisation with a name into the internal shape', async () => {
    mockedRequest.mockResolvedValue(
      mkPage([{ netexId: 'NMR:Organisation:DP1', name: { value: 'Standard' } }])
    );
    const organisations = await fetchOrganisations('http://x', null);
    expect(organisations).toEqual([{ id: 'NMR:Organisation:DP1', name: { value: 'Standard' } }]);
  });

  it('omits name when the server returns no name', async () => {
    mockedRequest.mockResolvedValue(mkPage([{ netexId: 'NMR:Organisation:DP2' }]));
    const [dp] = await fetchOrganisations('http://x', null);
    expect(dp.name).toBeUndefined();
  });
});
