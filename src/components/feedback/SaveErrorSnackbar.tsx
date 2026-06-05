import { Alert, Snackbar } from '@mui/material';

interface SaveErrorSnackbarProps {
  error: string | null;
  onClose: () => void;
  /** Alert severity — `'warning'` for partial success (e.g. saved but the list
   * could not refresh), so it isn't mistaken for a hard save failure. */
  severity?: 'error' | 'warning';
}

export default function SaveErrorSnackbar({
  error,
  onClose,
  severity = 'error',
}: SaveErrorSnackbarProps) {
  return (
    <Snackbar
      open={!!error}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity={severity} onClose={onClose} variant="filled">
        {error}
      </Alert>
    </Snackbar>
  );
}
