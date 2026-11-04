import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DeactivateDialogProps {
  /** Open/closed binding. Caller owns this state. */
  open: boolean;
  /** Fired for the cancel-the-dialog action (X/backdrop/Cancel button). */
  onCancel: () => void;
  /** Fired when the user confirms; the caller closes the dialog. */
  onConfirm: () => void;
  /** Heading; defaults to `common.deactivateConfirmTitle`. */
  title?: string;
  /** Body text; defaults to `common.deactivateConfirmMessage`. */
  message?: string;
  /** The confirm button's label; defaults to `common.deactivate`. */
  actionLabel?: string;
}

/**
 * Confirm before deactivating a record — shared by the sidebar's `EditorRail`
 * and the form page's Deactivate button.
 *
 * @param {DeactivateDialogProps} props open state, the two outcomes and the copy
 * @returns {JSX.Element} the confirm dialog
 */
export default function DeactivateDialog({
  open,
  onCancel,
  onConfirm,
  title,
  message,
  actionLabel,
}: DeactivateDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title ?? t('common.deactivateConfirmTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message ?? t('common.deactivateConfirmMessage')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('cancel')}</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          {actionLabel ?? t('common.deactivate')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
