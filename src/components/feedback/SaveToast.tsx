import { Alert, Slide, Snackbar } from '@mui/material';

const TOAST_MS = 6000; // Linje ToastProvider's `delay` default
const SLIDE = { transition: Slide } as const,
  SLIDE_UP = { transition: { direction: 'up' } } as const; // a const: MUI's slot type lacks `direction`

interface SaveToastProps {
  open: boolean;
  message: string;
  /** `success` hides after Linje's 6 s, paused while hovered or focused. An error or a
   *  warning (saved, but the list could not refresh) stays until closed or the next save,
   *  and a click elsewhere doesn't close it: a timed one is gone before it's read (WCAG 2.2.1). */
  severity: 'success' | 'error' | 'warning';
  onClose: () => void;
  /** The centre line (viewport px), e.g. the form column's, clear of the footer's Cancel /
   *  Save; from `sm` only, below it the toast spans the screen. The viewport's when omitted. */
  centerX?: number;
}

/**
 * A save's toast (#435 E1): an Alert sliding up at the bottom, centred on `centerX`.
 *
 * @param {SaveToastProps} props open, message, severity, close and centre line
 * @returns {JSX.Element} the toast
 */
export default function SaveToast({ open, message, severity, onClose, centerX }: SaveToastProps) {
  const timed = severity === 'success';
  return (
    <Snackbar
      open={open}
      autoHideDuration={timed ? TOAST_MS : null}
      onClose={(_, reason) => (timed || reason !== 'clickaway') && onClose()}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      slots={SLIDE}
      slotProps={SLIDE_UP}
      sx={centerX === undefined ? undefined : { left: { sm: `${centerX}px` } }}
    >
      <Alert severity={severity} onClose={onClose} sx={{ py: 1.5 }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
