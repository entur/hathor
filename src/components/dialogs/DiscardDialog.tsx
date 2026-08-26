import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DiscardDialogProps {
  /** Open/closed binding. Caller owns this state. */
  open: boolean;
  /** Fired for the cancel-the-dialog action (X/backdrop/Cancel button). */
  onCancel: () => void;
  /** Fired when the user accepts losing the in-progress edits. */
  onDiscard: () => void;
  /** Optional: when provided, a Save button appears that fires this. The
   *  dialog does not self-close — the caller closes it by flipping `open`. */
  onSave?: () => void;
}

/**
 * Reusable confirm-discard dialog for any flow that wants to interrupt a
 * dirty-form action (back nav, sidebar collapse, edit-mode cancel). Mirrors
 * the prior inline dialog in EditorRail so the two consumers stay in lockstep.
 * Translations reuse the existing `vehicles.discardTitle` / `vehicles.discardBody`
 * keys — generic enough to live outside the vehicles namespace if a non-vehicle
 * consumer appears.
 */
export default function DiscardDialog({ open, onCancel, onDiscard, onSave }: DiscardDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{t('vehicles.discardTitle', 'Discard unsaved changes?')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('vehicles.discardBody', 'You have unsaved edits on this vehicle.')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('cancel', 'Cancel')}</Button>
        <Button color="error" onClick={onDiscard}>
          {t('discard', 'Discard')}
        </Button>
        {onSave && (
          <Button variant="contained" onClick={onSave}>
            {t('save', 'Save')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
