import { useEffect } from 'react';
import { useEditorDirty } from '../contexts/EditingContext.tsx';

/**
 * Lift a feature editor's dirty signal onto EditingContext so app chrome
 * (sort / pagination guards, #91) can react without reaching into the
 * feature. Clears the signal on unmount so it never leaks across routes.
 *
 * @param isDirty Whether the editor form currently diverges from its baseline.
 */
export function useLiftEditorDirty(isDirty: boolean): void {
  const { setEditorDirty } = useEditorDirty();
  useEffect(() => {
    setEditorDirty(isDirty);
  }, [isDirty, setEditorDirty]);
  useEffect(() => () => setEditorDirty(false), [setEditorDirty]);
}
