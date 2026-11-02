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
 * Copy comes from `common.discardTitle` / `common.discardBody`, shared by all
 * three editors.
 */
export default function DiscardDialog({ open, onCancel, onDiscard, onSave }: DiscardDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{t('common.discardTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('common.discardBody')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('cancel')}</Button>
        <Button color="error" onClick={onDiscard}>
          {t('discard')}
        </Button>
        {onSave && (
          <Button variant="contained" onClick={onSave}>
            {t('save')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
