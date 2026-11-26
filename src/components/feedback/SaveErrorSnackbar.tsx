import { Alert, Snackbar } from '@mui/material';
import { TOAST_ALERT_SX, TOAST_SLOTS, TOAST_SLOT_PROPS, toastSx } from './toast.ts';

interface SaveErrorSnackbarProps {
  error: string | null;
  onClose: () => void;
  /** Alert severity — `'warning'` for partial success (e.g. saved but the list
   * could not refresh), so it isn't mistaken for a hard save failure. */
  severity?: 'error' | 'warning';
  /** The toast's centre line (viewport px), e.g. the form column's; the viewport's when omitted. */
  centerX?: number;
}

/**
 * A save's error or warning as a toast that stays until closed or the next save: a timed one
 * is gone before it's read (WCAG 2.2.1, #435 E1). A click elsewhere doesn't close it either.
 *
 * @param {SaveErrorSnackbarProps} props the message (none → closed), its close and severity
 * @returns {JSX.Element} the toast
 */
export default function SaveErrorSnackbar({
  error,
  onClose,
  severity = 'error',
  centerX,
}: SaveErrorSnackbarProps) {
  return (
    <Snackbar
      open={!!error}
      onClose={(_, reason) => reason !== 'clickaway' && onClose()}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      slots={TOAST_SLOTS}
      slotProps={TOAST_SLOT_PROPS}
      sx={toastSx(centerX)}
    >
      <Alert severity={severity} onClose={onClose} sx={TOAST_ALERT_SX}>
        {error}
      </Alert>
    </Snackbar>
  );
}
