import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

/**
 * Prompt before in-app navigation when `isDirty` is true. Uses
 * `window.confirm`; for a custom modal, factor the confirm step out to
 * a UI component and wire it to `blocker.proceed()` / `blocker.reset()`.
 *
 * Blocks only cross-pathname navigation; same-route changes (e.g.
 * `?selected=` toggling) are allowed without a prompt — the sidebar's
 * own form state shadows the URL there, not the other way around.
 */
export function useDirtyFormBlock(isDirty: boolean, message?: string): void {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    const ok = window.confirm(message ?? 'You have unsaved changes. Discard?');
    if (ok) blocker.proceed();
    else blocker.reset();
  }, [blocker, message]);
}
