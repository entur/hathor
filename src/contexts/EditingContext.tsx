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

interface EditingContextType {
  editingItem: EditingItem | null;
  setEditingItem: (item: EditingItem | null) => void;
  /**
   * Whether the currently-mounted sidebar editor has unsaved changes.
   * Owned by the editor (push via `setEditorDirty`), consumed by chrome
   * that needs to guard navigation / sort / pagination (#91).
   */
  isEditorDirty: boolean;
  setEditorDirty: (dirty: boolean) => void;
}

const EditingContext = createContext<EditingContextType | undefined>(undefined);

interface EditingProviderProps {
  children: ReactNode;
}

export function EditingProvider({ children }: EditingProviderProps) {
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [isEditorDirty, setEditorDirty] = useState<boolean>(false);

  const value = useMemo(
    () => ({ editingItem, setEditingItem, isEditorDirty, setEditorDirty }),
    [editingItem, isEditorDirty]
  );

  return <EditingContext.Provider value={value}>{children}</EditingContext.Provider>;
}

export function useEditing() {
  const context = useContext(EditingContext);
  if (context === undefined) {
    throw new Error('useEditing must be used within an EditingProvider');
  }
  return context;
}
