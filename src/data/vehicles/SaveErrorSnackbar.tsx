import { Alert, Snackbar } from '@mui/material';

interface SaveErrorSnackbarProps {
  error: string | null;
  onClose: () => void;
}

export default function SaveErrorSnackbar({ error, onClose }: SaveErrorSnackbarProps) {
  return (
    <Snackbar
      open={!!error}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity="error" onClose={onClose} variant="filled">
        {error}
      </Alert>
    </Snackbar>
  );
}
