import { useEffect, useRef } from 'react';
import { useEditorClose } from '../contexts/EditingContext.tsx';

/**
 * Lift an editor's guarded close flow onto EditingContext so chrome close
 * paths (mobile Drawer backdrop / Escape) run the same dirty-guard + URL
 * clear as the editor's own collapse control. Always calls the latest `fn`;
 * unregisters on unmount.
 *
 * @param fn The editor's collapse handler (confirms when dirty, then closes).
 */
export function useLiftEditorClose(fn: () => void): void {
  const { setCloseHandler } = useEditorClose();
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    setCloseHandler(() => fnRef.current());
    return () => setCloseHandler(null);
  }, [setCloseHandler]);
}
