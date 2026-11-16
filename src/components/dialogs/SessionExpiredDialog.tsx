import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useSession } from '../../contexts/SessionContext';
import { useTranslation } from 'react-i18next';

export default function SessionExpiredDialog() {
  const { isSessionExpired, relogin } = useSession();
  const { t } = useTranslation();

  const handleRelogin = () => {
    relogin().catch(err => {
      console.error('Failed to redirect to login page', err);
    });
  };

  return (
    <Dialog
      open={isSessionExpired}
      // Not dismissible: ignore Escape and backdrop closes (disableEscapeKeyDown was removed in v9).
      onClose={() => {}}
      slotProps={{
        backdrop: { style: { pointerEvents: 'none' } },
      }}
    >
      <DialogTitle>{t('session.expired.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('session.expired.message')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRelogin} variant="contained" color="primary">
          {t('session.expired.reloginButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
