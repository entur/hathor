import { describe, expect, it } from 'vitest';
import { ClientError } from 'graphql-request';
import { graphqlErrMsg } from './graphqlErrMsg';

const mkClientErr = (status: number, message?: string) =>
  new ClientError(
    {
      status,
      headers: new Headers(),
      body: '',
      errors: message ? [{ message }] : [],
    } as never,
    { query: '' }
  );

/**
 * Moved here from `fetchVehiclesAndApply.test.ts` when the three duplicate
 * error switches collapsed onto `graphqlErrMsg` (hathor#119). Same assertions,
 * now covering the one implementation all three list fetches share.
 */
describe('graphqlErrMsg — error message mapping', () => {
  it('401 → "Not authenticated"', () => {
    expect(graphqlErrMsg(mkClientErr(401))).toContain('Not authenticated');
  });

  it('403 → "Access denied"', () => {
    expect(graphqlErrMsg(mkClientErr(403))).toContain('Access denied');
  });

  it('other ClientError → server error with status or first GraphQL error message', () => {
    expect(graphqlErrMsg(mkClientErr(500))).toContain('500');
    expect(graphqlErrMsg(mkClientErr(500, 'oops'))).toBe('oops');
  });

  it('TypeError → "Unable to reach server"', () => {
    expect(graphqlErrMsg(new TypeError('fetch failed'))).toContain('Unable to reach server');
  });

  it('generic Error → error.message', () => {
    expect(graphqlErrMsg(new Error('boom'))).toBe('boom');
  });

  it('non-Error → "An unexpected error occurred"', () => {
    expect(graphqlErrMsg({ weird: true })).toBe('An unexpected error occurred');
    expect(graphqlErrMsg('string-thrown')).toBe('An unexpected error occurred');
  });
});
