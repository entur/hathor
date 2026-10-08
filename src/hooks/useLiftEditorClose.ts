import { useEffect, useRef } from 'react';
import { useEditorClose } from '../contexts/EditingContext.tsx';

/**
 * Lift an editor's guarded close flow onto EditingContext so chrome that can
 * dismiss the pane (the mobile Drawer's backdrop / Escape / toolbar) runs the
 * same flow as the editor's own close control. Unregisters on unmount.
 *
 * @param {() => void} close The editor's close flow — confirms when dirty, then clears the selection.
 * @returns {void}
 */
export function useLiftEditorClose(close: () => void): void {
  const { setCloseHandler } = useEditorClose();
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    setCloseHandler(() => closeRef.current());
    return () => setCloseHandler(null);
  }, [setCloseHandler]);
}
