import { useState } from 'react';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import ErrorPage from '../components/common/ErrorPage';

interface GenericDetailsPageProps {
  title: string;
  onSave: () => Promise<void>;
  saveDisabled?: boolean;
  children: React.ReactNode;
}

export default function GenericDetailsPage({
  title,
  onSave,
  saveDisabled,
  children,
}: GenericDetailsPageProps) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaveError(null);
    setSaving(true);
    try {
      await onSave();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h4">{title}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving || saveDisabled}
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : undefined}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </Box>
      {children}
      {saveError && <ErrorPage message={saveError} />}
    </Container>
  );
}
