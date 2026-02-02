import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';

interface AutosysMultiImportProps {
  onClose: () => void;
}

export default function AutosysMultiImport({ onClose }: AutosysMultiImportProps) {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    t('import.multi.stepUpload', 'Upload file'),
    t('import.multi.stepReview', 'Review'),
    t('import.multi.stepConfirm', 'Confirm'),
  ];

  return (
    <>
      <DialogTitle>{t('import.multi.title', 'Bulk Import Vehicles')}</DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 120 }}>
          {activeStep === 0 && (
            <Typography color="text.secondary">
              {t('import.multi.uploadPlaceholder', 'File upload will go here.')}
            </Typography>
          )}
          {activeStep === 1 && (
            <Typography color="text.secondary">
              {t('import.multi.reviewPlaceholder', 'Review parsed data will go here.')}
            </Typography>
          )}
          {activeStep === 2 && (
            <Typography color="text.secondary">
              {t('import.multi.confirmPlaceholder', 'Confirm and import will go here.')}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {t('close')}
        </Button>
        <Button disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)}>
          {t('import.multi.back', 'Back')}
        </Button>
        <Button
          variant="contained"
          onClick={() => setActiveStep(s => s + 1)}
          disabled={activeStep === steps.length - 1}
        >
          {t('import.multi.next', 'Next')}
        </Button>
      </DialogActions>
    </>
  );
}
