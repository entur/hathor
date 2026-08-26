import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchDeckPlans } from './fetchDeckPlans.ts';
import { fetchDeckPlansRequest } from '../../../graphql/vehicles/queries/fetchDeckPlans.ts';

vi.mock('../../../graphql/vehicles/queries/fetchDeckPlans.ts', () => ({
  fetchDeckPlansRequest: vi.fn(),
}));

const mockedRequest = vi.mocked(fetchDeckPlansRequest);

const mkPage = (content: Array<Record<string, unknown>>, totalElements = content.length) => ({
  deckPlans: { content, totalElements, page: 0, size: content.length },
});

describe('fetchDeckPlans', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('returns an empty array when content is empty', async () => {
    mockedRequest.mockResolvedValue(mkPage([]));
    const ctx = await fetchDeckPlans('http://x', null);
    expect(ctx.deckPlans).toEqual([]);
  });

  it('projects a deck plan with a name into the internal shape', async () => {
    mockedRequest.mockResolvedValue(
      mkPage([{ netexId: 'NMR:DeckPlan:DP1', name: { value: 'Standard' } }])
    );
    const ctx = await fetchDeckPlans('http://x', null);
    expect(ctx.deckPlans).toEqual([{ id: 'NMR:DeckPlan:DP1', name: { value: 'Standard' } }]);
  });

  it('omits name when the server returns no name', async () => {
    mockedRequest.mockResolvedValue(mkPage([{ netexId: 'NMR:DeckPlan:DP2' }]));
    const [dp] = (await fetchDeckPlans('http://x', null)).deckPlans;
    expect(dp.name).toBeUndefined();
  });
});
