import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ErrorPage from '../components/common/ErrorPage';

interface GenericDetailsPageProps {
  title: string;
  onSave: () => Promise<void>;
  saveDisabled?: boolean;
  /** Optional back affordance. When set, an IconButton renders left of the title.
   *  Caller is responsible for any dirty-form confirmation before navigating. */
  onBack?: () => void;
  children: React.ReactNode;
}

export default function GenericDetailsPage({
  title,
  onSave,
  saveDisabled,
  onBack,
  children,
}: GenericDetailsPageProps) {
  const { t } = useTranslation();
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
          gap: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
          {onBack && (
            <IconButton
              onClick={onBack}
              aria-label={t('vehicles.actions.back', 'Back to list')}
              edge="start"
              size="small"
            >
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="h4">{title}</Typography>
        </Stack>
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
