import {
  createContext,
  useState,
  useMemo,
  useRef,
  useCallback,
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

interface EditorCloseContextType {
  /**
   * Ask the mounted editor to close. Routes through the editor's own
   * collapse flow (dirty → DiscardDialog, else drop `?selected=`), so chrome
   * close paths (mobile Drawer backdrop / Escape) can't strand the URL
   * selection or skip the discard guard. No-op when no editor is registered.
   */
  requestClose: () => void;
  /** Register the editor's close handler; `null` unregisters. Stable. */
  setCloseHandler: (fn: (() => void) | null) => void;
}

// Split so per-keystroke dirty flips don't re-render consumers that only
// care about `editingItem` (Sidebar, GenericDataViewPage).
const EditingItemContext = createContext<EditingItemContextType | undefined>(undefined);
const EditorDirtyContext = createContext<EditorDirtyContextType | undefined>(undefined);
const EditorCloseContext = createContext<EditorCloseContextType | undefined>(undefined);

interface EditingProviderProps {
  children: ReactNode;
}

export function EditingProvider({ children }: EditingProviderProps) {
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [isEditorDirty, setEditorDirty] = useState<boolean>(false);

  const itemValue = useMemo(() => ({ editingItem, setEditingItem }), [editingItem]);
  const dirtyValue = useMemo(() => ({ isEditorDirty, setEditorDirty }), [isEditorDirty]);

  // Ref, not state: the handler is a per-render closure and swapping it must
  // not re-render consumers.
  const closeRef = useRef<(() => void) | null>(null);
  const requestClose = useCallback(() => closeRef.current?.(), []);
  const setCloseHandler = useCallback((fn: (() => void) | null) => {
    closeRef.current = fn;
  }, []);
  const closeValue = useMemo(
    () => ({ requestClose, setCloseHandler }),
    [requestClose, setCloseHandler]
  );

  return (
    <EditingItemContext.Provider value={itemValue}>
      <EditorDirtyContext.Provider value={dirtyValue}>
        <EditorCloseContext.Provider value={closeValue}>{children}</EditorCloseContext.Provider>
      </EditorDirtyContext.Provider>
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

/** Request / register the editor close flow. Stable across all editing changes. */
export function useEditorClose(): EditorCloseContextType {
  const ctx = useContext(EditorCloseContext);
  if (ctx === undefined) {
    throw new Error('useEditorClose must be used within an EditingProvider');
  }
  return ctx;
}
