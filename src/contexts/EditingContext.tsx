import {
  createContext,
  useState,
  useMemo,
  useContext,
  type ReactNode,
  type ComponentType,
} from 'react';

export interface EditingItem {
  id: string;
  EditorComponent: ComponentType<{ itemId: string }>;
}

interface EditingItemContextType {
  editingItem: EditingItem | null;
  setEditingItem: (item: EditingItem | null) => void;
}

interface EditorDirtyContextType {
  /**
   * Whether the currently-mounted sidebar editor has unsaved changes.
   * Owned by the editor (push via `setEditorDirty`), consumed by chrome
   * that needs to guard navigation / sort / pagination (#91).
   */
  isEditorDirty: boolean;
  setEditorDirty: (dirty: boolean) => void;
}

// Split so per-keystroke dirty flips don't re-render consumers that only
// care about `editingItem` (SidebarContent, GenericDataViewPage).
const EditingItemContext = createContext<EditingItemContextType | undefined>(undefined);
const EditorDirtyContext = createContext<EditorDirtyContextType | undefined>(undefined);

interface EditingProviderProps {
  children: ReactNode;
}

export function EditingProvider({ children }: EditingProviderProps) {
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [isEditorDirty, setEditorDirty] = useState<boolean>(false);

  const itemValue = useMemo(() => ({ editingItem, setEditingItem }), [editingItem]);
  const dirtyValue = useMemo(() => ({ isEditorDirty, setEditorDirty }), [isEditorDirty]);

  return (
    <EditingItemContext.Provider value={itemValue}>
      <EditorDirtyContext.Provider value={dirtyValue}>{children}</EditorDirtyContext.Provider>
    </EditingItemContext.Provider>
  );
}

/**
 * Read/write both context halves. Subscribes to dirty-flip re-renders too —
 * prefer the narrower {@link useEditingItem} / {@link useEditorDirty} hooks
 * when you only need one side.
 */
export function useEditing(): EditingItemContextType & EditorDirtyContextType {
  return { ...useEditingItem(), ...useEditorDirty() };
}

/** Read/write `editingItem` only. Stable across dirty-signal flips. */
export function useEditingItem(): EditingItemContextType {
  const ctx = useContext(EditingItemContext);
  if (ctx === undefined) {
    throw new Error('useEditingItem must be used within an EditingProvider');
  }
  return ctx;
}

/** Read/write the editor's dirty flag. Stable across editingItem changes. */
export function useEditorDirty(): EditorDirtyContextType {
  const ctx = useContext(EditorDirtyContext);
  if (ctx === undefined) {
    throw new Error('useEditorDirty must be used within an EditingProvider');
  }
  return ctx;
}
