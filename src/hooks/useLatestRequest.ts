import { useCallback, useRef } from 'react';

/** Whether the request a {@link useLatestRequest} ticket was issued for is still the newest. */
export type IsLatestRequest = () => boolean;

/**
 * Latest-request-wins guard for a hook that can have several fetches in
 * flight — e.g. a list refetch fired, not awaited, after each write. Call the
 * returned `begin()` as a request starts; apply its response only while the
 * ticket it hands back is still the newest, so an older response finishing
 * last cannot overwrite a newer one.
 *
 * @returns {() => IsLatestRequest} Stable `begin()`; each call supersedes every earlier ticket.
 */
export function useLatestRequest(): () => IsLatestRequest {
  const latest = useRef(0);
  return useCallback(() => {
    const ticket = ++latest.current;
    return () => ticket === latest.current;
  }, []);
}
