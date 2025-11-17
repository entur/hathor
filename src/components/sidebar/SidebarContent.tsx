import { useEditing } from '../../contexts/EditingContext.tsx';
import WorkAreaContent from './WorkAreaContent.tsx';

export default function SidebarContent() {
  const { editingItem } = useEditing();
  if (editingItem) {
    const { EditorComponent, id } = editingItem;
    return <EditorComponent itemId={id} />;
  }
  return <WorkAreaContent />;
}
