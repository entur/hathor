import { createContext, useState, useMemo, useContext, type ReactNode } from 'react';

interface EditorDirtyContextType {
  /**
   * Whether the mounted editor has unsaved changes. Owned by the editor (push via
   * `setEditorDirty`, `useLiftEditorDirty`), read by chrome that would drop them
   * without a navigation — the header's organisation picker.
   */
  isEditorDirty: boolean;
  setEditorDirty: (dirty: boolean) => void;
}

const EditorDirtyContext = createContext<EditorDirtyContextType | undefined>(undefined);

interface EditingProviderProps {
  children: ReactNode;
}

export function EditingProvider({ children }: EditingProviderProps) {
  const [isEditorDirty, setEditorDirty] = useState<boolean>(false);
  const value = useMemo(() => ({ isEditorDirty, setEditorDirty }), [isEditorDirty]);
  return <EditorDirtyContext.Provider value={value}>{children}</EditorDirtyContext.Provider>;
}

/** Read/write the editor's dirty flag. */
export function useEditorDirty(): EditorDirtyContextType {
  const ctx = useContext(EditorDirtyContext);
  if (ctx === undefined) {
    throw new Error('useEditorDirty must be used within an EditingProvider');
  }
  return ctx;
}
