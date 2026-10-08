import {
  createContext,
  useState,
  useMemo,
  useContext,
  useRef,
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
   * Ask the mounted sidebar editor to close itself. Its own flow confirms
   * when dirty and clears the selection — so chrome that can dismiss the pane
   * (the mobile Drawer's backdrop / Escape / toolbar) must call this instead
   * of collapsing the pane directly. No-op while no editor has registered.
   */
  requestClose: () => void;
  /** Owned by the editor: registers its guarded close flow, or clears it with `null`. */
  setCloseHandler: (handler: (() => void) | null) => void;
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

  // A ref, not state: the handler changes with the editor's dirty flag and
  // nothing renders from it.
  const closeHandlerRef = useRef<(() => void) | null>(null);

  const itemValue = useMemo(() => ({ editingItem, setEditingItem }), [editingItem]);
  const dirtyValue = useMemo(() => ({ isEditorDirty, setEditorDirty }), [isEditorDirty]);
  const closeValue = useMemo<EditorCloseContextType>(
    () => ({
      requestClose: () => closeHandlerRef.current?.(),
      setCloseHandler: handler => {
        closeHandlerRef.current = handler;
      },
    }),
    []
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

/**
 * Request, or (from the editor) register, the sidebar editor's guarded close.
 * The value is stable — it never re-renders its consumers.
 *
 * @returns {EditorCloseContextType} `requestClose` for chrome, `setCloseHandler` for the editor.
 */
export function useEditorClose(): EditorCloseContextType {
  const ctx = useContext(EditorCloseContext);
  if (ctx === undefined) {
    throw new Error('useEditorClose must be used within an EditingProvider');
  }
  return ctx;
}
