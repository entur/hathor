import { describe, it, expect, vi } from 'vitest';
import { fetchCodeValues } from './fetchCodeValues.ts';
import { fetchCodeValuesRequest } from '../../../graphql/vehicles/queries/fetchCodeValues.ts';
import { EMISSION_STANDARD } from '../types/codeValueTypes.ts';

vi.mock('../../../graphql/vehicles/queries/fetchCodeValues.ts', () => ({
  fetchCodeValuesRequest: vi.fn(),
}));

const mockedRequest = vi.mocked(fetchCodeValuesRequest);

describe('fetchCodeValues', () => {
  it('asks for the whole list of one valueType and returns its { value, label } entries', async () => {
    // Sobek seeds value `Euro1` / label `Euro 1`… (V13__AddCodeValues.sql).
    const content = [
      { label: 'Euro 1', value: 'Euro1' },
      { label: 'Euro 2', value: 'Euro2' },
    ];
    mockedRequest.mockResolvedValue({ codeValues: { content } });

    const codes = await fetchCodeValues('http://x', 'tok', EMISSION_STANDARD);

    expect(mockedRequest).toHaveBeenCalledWith('http://x', 'tok', {
      filter: { valueType: EMISSION_STANDARD },
      size: 10000,
    });
    expect(codes).toEqual(content);
  });
});
