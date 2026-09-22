import { ClientError } from 'graphql-request';
import { tOutside } from '../utils/tOutside';

/**
 * Map a thrown value from any Sobek GraphQL fetch into a user-visible string.
 *
 * Shared by every list fetch (`useVehicleTypes`, `useDeckPlans`,
 * `fetchVehiclesAndApply`), each of which used to inline its own identical
 * copy of this switch — see hathor#119.
 *
 * @param {unknown} err - Value thrown by the fetch; any type, since a `catch`
 *   binding is not guaranteed to be an `Error`.
 * @returns {string} A message safe to render. Sobek's own GraphQL error text
 *   is preferred over a generic one whenever the response carries it.
 */
export function graphqlErrMsg(err: unknown): string {
  if (err instanceof ClientError) {
    const status = err.response.status;
    if (status === 401)
      return tOutside(
        'error.notAuthenticated',
        'Not authenticated — please log in to access this data'
      );
    if (status === 403)
      return tOutside(
        'error.accessDenied',
        'Access denied — you do not have permission to view this data'
      );
    // Sobek's own message is already prose from the backend — passed through
    // untranslated, since only the generic wrapper is ours to localise.
    return (
      err.response.errors?.[0]?.message ??
      tOutside('error.serverError', 'Server error ({{status}})', { status })
    );
  }
  if (err instanceof TypeError)
    return tOutside(
      'error.unreachable',
      'Unable to reach server — check that the backend is running'
    );
  if (err instanceof Error) return err.message;
  return tOutside('error.unexpected', 'An unexpected error occurred');
}
