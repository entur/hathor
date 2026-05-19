import { fetchVehicles } from './projection/fetchVehicles';
import type { AccessToken } from '../../auth';

const DEFAULT_ATTEMPTS = 5;
const DEFAULT_DELAY_MS = 250;

/**
 * Poll Sobek's vehicles list until the given id appears or attempts are
 * exhausted. Resolves with `true` on hit, `false` on timeout. Errors during
 * a single attempt are swallowed so transient network blips don't abort the
 * wait — the caller treats false the same way it treats success: navigate
 * anyway and let the slider's not-found body explain.
 *
 * The poll exists because the freshly-created vehicle from the import
 * endpoint isn't guaranteed to be in the next `vehicles(...)` GraphQL
 * response — without the wait, the slider deep-link from
 * `/vehicles?selected=<newId>` can land on the not-found body even when the
 * write has succeeded.
 */
export async function waitForVehicleInList(
  id: string,
  applicationBaseUrl: string,
  getAccessToken: () => Promise<AccessToken>,
  attempts: number = DEFAULT_ATTEMPTS,
  delayMs: number = DEFAULT_DELAY_MS
): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    try {
      const token = await getAccessToken();
      const rows = await fetchVehicles(applicationBaseUrl, token);
      if (rows.some(r => r.id === id)) return true;
    } catch {
      // transient — try again
    }
    if (i < attempts - 1) await new Promise(r => setTimeout(r, delayMs));
  }
  return false;
}
