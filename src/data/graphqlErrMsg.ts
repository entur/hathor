import { ClientError } from 'graphql-request';

export function graphqlErrMsg(err: unknown): string {
  if (err instanceof ClientError) {
    const status = err.response.status;
    if (status === 401) return 'Not authenticated — please log in to access this data';
    if (status === 403) return 'Access denied — you do not have permission to view this data';
    return err.response.errors?.[0]?.message ?? `Server error (${status})`;
  }
  if (err instanceof TypeError) return 'Unable to reach server — check that the backend is running';
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
}
