import { Alert, Box, CircularProgress, Stack, Button, TextareaAutosize } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DeckPlanFormProps {
  /** NeTEx XML — current form value (controlled). */
  value: string;
  /** Called on every textarea edit. */
  onChange: (next: string) => void;
  /** When true, textarea is read-only. */
  mode: 'view' | 'edit';
  /** Fetch-in-flight; renders a spinner instead of the textarea. */
  loading: boolean;
  /** Fetch error string; renders an alert + retry instead of the textarea. */
  fetchError: string | null;
  /** Refetch trigger from the parent hook. */
  onRetry: () => void;
}

/**
 * Sidebar body for the deck-plan editor — the NeTEx XML textarea (matches
 * the pre-sidebar route view's UX 1:1) plus loading and fetch-error states.
 * Hosted by `DeckPlanDetails`; chrome (title, EditorRail, snackbars,
 * dirty tracking) lives in the parent.
 */
export default function DeckPlanForm({
  value,
  onChange,
  mode,
  loading,
  fetchError,
  onRetry,
}: DeckPlanFormProps) {
  const { t } = useTranslation();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress data-testid="deck-plan-xml-loading" />
      </Box>
    );
  }
  if (fetchError) {
    return (
      <Stack spacing={1}>
        <Alert severity="error" data-testid="deck-plan-xml-fetch-error">
          {fetchError}
        </Alert>
        <Box>
          <Button onClick={onRetry} size="small" variant="outlined">
            {t('common.retry', 'Retry')}
          </Button>
        </Box>
      </Stack>
    );
  }
  return (
    <TextareaAutosize
      aria-label="deck plan data"
      data-testid="deck-plan-xml-textarea"
      readOnly={mode !== 'edit'}
      value={value}
      onChange={e => onChange(e.target.value)}
      minRows={10}
      style={{
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        borderColor: 'rgba(0, 0, 0, 0.23)',
        borderWidth: '1px',
        borderStyle: 'solid',
        fontSize: '14px',
        fontFamily: 'monospace',
        boxSizing: 'border-box',
      }}
    />
  );
}
