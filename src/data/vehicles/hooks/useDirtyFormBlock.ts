import { useEffect } from 'react';

/**
 * Prompt before page unload (tab close, refresh, URL bar) when `isDirty` is
 * true. Modern browsers ignore custom messages and show their own native
 * dialog — we only need to set `returnValue` for the prompt to appear.
 *
 * **Limitation:** does not block in-app React Router navigation. A proper
 * in-app guard requires `react-router-dom`'s `useBlocker`, which only
 * works under data routers (`createBrowserRouter`). The app currently
 * mounts the legacy `<BrowserRouter>` component, so `useBlocker` throws
 * an invariant at render time. A follow-up can migrate the router and
 * upgrade this hook in one go.
 */
export function useDirtyFormBlock(isDirty: boolean): void {
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);
}
