import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { AutosysAssembledResult } from '../../../data/vehicle-imports/assembleAutosysResults';

interface MultiImportConfirmProps {
  assembledResult: AutosysAssembledResult;
  submitError: string | null;
}

export default function MultiImportConfirm({
  assembledResult,
  submitError,
}: MultiImportConfirmProps) {
  const { t } = useTranslation();

  return (
    <>
      <Alert
        severity={assembledResult.summary.errors.length > 0 ? 'warning' : 'success'}
        sx={{ mb: 2 }}
      >
        {t('import.multi.summaryFetched', 'Fetched {{success}} of {{total}} vehicles', {
          success: assembledResult.summary.successCount,
          total: assembledResult.summary.successCount + assembledResult.summary.errors.length,
        })}
      </Alert>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 1,
          mb: 2,
        }}
      >
        <Typography color="text.secondary">{t('import.multi.vehicles', 'Vehicles')}</Typography>
        <Typography>{assembledResult.summary.vehicleCount}</Typography>

        <Typography color="text.secondary">
          {t('import.multi.vehicleTypes', 'Vehicle types')}
        </Typography>
        <Typography>{assembledResult.summary.vehicleTypeIds.size}</Typography>

        <Typography color="text.secondary">{t('import.multi.deckPlans', 'Deck plans')}</Typography>
        <Typography>{assembledResult.summary.deckPlanIds.size}</Typography>

        <Typography color="text.secondary">
          {t('import.multi.vehicleModels', 'Vehicle models')}
        </Typography>
        <Typography>{assembledResult.summary.vehicleModelIds.size}</Typography>
      </Box>
      {assembledResult.summary.errors.length > 0 && (
        <Alert severity="error" sx={{ mt: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            {t('import.multi.errorCount', '{{count}} failed', {
              count: assembledResult.summary.errors.length,
            })}
          </Typography>
          {assembledResult.summary.errors.map(err => (
            <Typography key={err.queryRegNumber} variant="body2">
              {err.queryRegNumber}: {err.message}
            </Typography>
          ))}
        </Alert>
      )}
      {submitError && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {submitError}
        </Alert>
      )}
    </>
  );
}
