import { describe, it, expect, vi, beforeEach } from 'vitest';
import { request } from 'graphql-request';
import { fetchDeckPlansRequest } from './fetchDeckPlans.ts';

vi.mock('graphql-request', async importOriginal => {
  const actual = await importOriginal<typeof import('graphql-request')>();
  return { ...actual, request: vi.fn().mockResolvedValue({}) };
});

/** The document handed to `request` — what the wire actually asks Sobek for. */
const doc = (): string => {
  fetchDeckPlansRequest('http://x', null);
  return vi.mocked(request).mock.calls[0][1] as unknown as string;
};

/** Body of a field's selection set, e.g. `name { value lang }` → ` value lang `. */
const selection = (d: string, field: string) =>
  new RegExp(`\\b${field}\\s*\\{([^}]*)\\}`).exec(d)?.[1] ?? '';

/**
 * A NeTEx `MultilingualString` is `{value, lang}`. `patchDeckPlanXml` rebuilds
 * `<Name>` from the domain object wholesale, so anything the query does not
 * select is dropped from the persisted document on the first save through the
 * sidebar — an unselected `lang` silently strips `lang="nb"`.
 */
describe('DeckPlans query selection', () => {
  beforeEach(() => vi.mocked(request).mockClear());

  it('selects lang alongside value for name', () => {
    expect(selection(doc(), 'name')).toMatch(/\blang\b/);
  });

  it('selects lang alongside value for description', () => {
    expect(selection(doc(), 'description')).toMatch(/\blang\b/);
  });

  it('still selects value and the row identity', () => {
    const d = doc();
    expect(selection(d, 'name')).toMatch(/\bvalue\b/);
    expect(d).toMatch(/\bnetexId\b/);
    expect(d).toMatch(/\bversion\b/);
  });
});
