import { Alert, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ErrorPage({ message }: { message?: string }) {
  const { t } = useTranslation();
  return (
    <Box sx={{ p: 2 }}>
      <Alert severity="error">
        {t('data.errorPrefix')}: {message}
      </Alert>
    </Box>
  );
}
