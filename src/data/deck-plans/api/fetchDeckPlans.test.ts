import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchDeckPlans, fetchDeckPlanById } from './fetchDeckPlans.ts';
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

describe('fetchDeckPlanById', () => {
  const ctx = { applicationBaseUrl: 'http://x', dataOwnerRef: 'NMR', token: null };
  const row = { netexId: 'NMR:DeckPlan:1', version: 4, name: { value: 'Standard' } };
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('sends netexIds + dataOwnerRef', async () => {
    mockedRequest.mockResolvedValue(mkPage([row]));
    await fetchDeckPlanById('NMR:DeckPlan:1', ctx);
    expect(mockedRequest).toHaveBeenCalledWith('http://x', null, {
      size: 1,
      filter: { netexIds: ['NMR:DeckPlan:1'], dataOwnerRef: 'NMR' },
    });
  });

  it('projects the first row', async () => {
    mockedRequest.mockResolvedValue(mkPage([row]));
    expect(await fetchDeckPlanById('NMR:DeckPlan:1', ctx)).toMatchObject({
      id: 'NMR:DeckPlan:1',
      version: 4,
      name: { value: 'Standard' },
    });
  });

  it('returns null on empty content', async () => {
    mockedRequest.mockResolvedValue(mkPage([]));
    expect(await fetchDeckPlanById('NMR:DeckPlan:9', ctx)).toBeNull();
  });
});
