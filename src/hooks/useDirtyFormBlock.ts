import { useEffect } from 'react';

/**
 * Prompt before page unload (tab close, refresh, URL bar) when `isDirty` is
 * true. Modern browsers ignore custom messages and show their own native
 * dialog — we only need to set `returnValue` for the prompt to appear.
 *
 * In-app navigation is not this hook's: a form page holds it with `useBlocker`
 * (`EditorFrame`'s `LeaveGuard`, #282). The sidebar editors stay unguarded
 * there until the cut-over retires them.
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
