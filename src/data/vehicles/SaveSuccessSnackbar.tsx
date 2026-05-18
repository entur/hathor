import { Alert, Snackbar } from '@mui/material';

interface SaveSuccessSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

/**
 * Positive confirmation toast shown after a successful save. Mirrors
 * `SaveErrorSnackbar` (filled Alert, bottom-center, manual close) but with
 * a shorter 4s timeout — success doesn't need to linger like an error.
 */
export default function SaveSuccessSnackbar({ open, message, onClose }: SaveSuccessSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity="success" onClose={onClose} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
