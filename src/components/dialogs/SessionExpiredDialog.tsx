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
      disableEscapeKeyDown
      slotProps={{
        backdrop: { style: { pointerEvents: 'none' } },
      }}
    >
      <DialogTitle>{t('session.expired.title', 'Session Expired')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t(
            'session.expired.message',
            'Your session has expired. To protect your information, you have been logged out. Please log in again to continue.'
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRelogin} variant="contained" color="primary">
          {t('session.expired.reloginButton', 'Log In Again')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
