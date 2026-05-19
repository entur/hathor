import { Alert, Button, Snackbar } from '@mui/material';

interface SaveSuccessSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
  /**
   * Optional call-to-action rendered inside the Alert. When provided the
   * snackbar stays open until the user clicks the action or the dismiss
   * button — `autoHideDuration` is suppressed so the affordance isn't lost
   * to a 4s timeout.
   */
  action?: { label: string; onClick: () => void };
}

/**
 * Positive confirmation toast shown after a successful save. Mirrors
 * `SaveErrorSnackbar` (filled Alert, bottom-center, manual close) but with
 * a shorter 4s timeout — success doesn't need to linger like an error.
 * When an `action` is provided, autoHide is disabled so the user has time
 * to act on it (e.g. "View in list" after creating a new entity).
 */
export default function SaveSuccessSnackbar({
  open,
  message,
  onClose,
  action,
}: SaveSuccessSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={action ? null : 4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity="success"
        onClose={onClose}
        variant="filled"
        action={
          action ? (
            <Button color="inherit" size="small" onClick={action.onClick}>
              {action.label}
            </Button>
          ) : undefined
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
