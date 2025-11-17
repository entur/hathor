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
}

const EditingContext = createContext<EditingContextType | undefined>(undefined);

interface EditingProviderProps {
  children: ReactNode;
}

export function EditingProvider({ children }: EditingProviderProps) {
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);

  const value = useMemo(() => ({ editingItem, setEditingItem }), [editingItem]);

  return <EditingContext.Provider value={value}>{children}</EditingContext.Provider>;
}

export function useEditing() {
  const context = useContext(EditingContext);
  if (context === undefined) {
    throw new Error('useEditing must be used within an EditingProvider');
  }
  return context;
}
