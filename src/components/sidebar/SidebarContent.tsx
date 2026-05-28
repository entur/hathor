import { useEditingItem } from '../../contexts/EditingContext.tsx';
import WorkAreaContent from './WorkAreaContent.tsx';

export default function SidebarContent() {
  const { editingItem } = useEditingItem();
  if (editingItem) {
    const { EditorComponent, id } = editingItem;
    return <EditorComponent itemId={id} />;
  }
  return <WorkAreaContent />;
}
