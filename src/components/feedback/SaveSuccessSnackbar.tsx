import { Alert, Button, Snackbar } from '@mui/material';
import { TOAST_ALERT_SX, TOAST_SLOTS, TOAST_SLOT_PROPS, toastSx } from './toast.ts';

const TOAST_MS = 6000; // Linje ToastProvider's `delay` default

interface SaveSuccessSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
  /**
   * Optional call-to-action rendered inside the Alert. When provided the
   * snackbar stays open until the user clicks the action or the dismiss
   * button — `autoHideDuration` is suppressed so the affordance isn't lost
   * to the timeout.
   */
  action?: { label: string; onClick: () => void };
  /** The toast's centre line (viewport px), e.g. the form column's; the viewport's when omitted. */
  centerX?: number;
}

/**
 * Positive confirmation toast shown after a successful save. Mirrors
 * `SaveErrorSnackbar` (filled Alert, bottom-center, manual close) but with
 * Linje's 6 s timeout, paused while hovered or focused; an error stays until closed.
 * When an `action` is provided, autoHide is disabled so the user has time
 * to act on it (e.g. "View in list" after creating a new entity).
 */
export default function SaveSuccessSnackbar({
  open,
  message,
  onClose,
  action,
  centerX,
}: SaveSuccessSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={action ? null : TOAST_MS}
      onClose={(_, reason) => {
        // With an action present, a stray outside click must not dismiss the
        // affordance — only the action button or the explicit close button do.
        if (action && reason === 'clickaway') return;
        onClose();
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      slots={TOAST_SLOTS}
      slotProps={TOAST_SLOT_PROPS}
      sx={toastSx(centerX)}
    >
      <Alert
        severity="success"
        onClose={onClose}
        sx={TOAST_ALERT_SX}
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
