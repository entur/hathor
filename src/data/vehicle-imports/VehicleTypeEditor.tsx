import { Box, Typography, Button, Divider } from '@mui/material';
import { useEditing } from '../../contexts/EditingContext.tsx';
import { useTranslation } from 'react-i18next';

interface StopPlaceEditorProps {
  itemId: string;
}

export default function StopPlaceEditor({ itemId }: StopPlaceEditorProps) {
  const { t } = useTranslation();
  const { setEditingItem } = useEditing();

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t('sidebar.editor.title', 'Edit Stop Place')}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body1">
        <strong>ID:</strong> {itemId}
      </Typography>
      {/* A real stop place form would go here */}
      <Button sx={{ mt: 2 }} variant="outlined" onClick={() => setEditingItem(null)}>
        {t('close', 'Close')}
      </Button>
    </Box>
  );
}
