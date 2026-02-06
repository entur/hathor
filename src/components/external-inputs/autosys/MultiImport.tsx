import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { XMLBuilder } from 'fast-xml-parser';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { useAuth } from '../../../auth';
import { useConfig } from '../../../contexts/configContext';
import type { RegNumbersStatus } from '../../../data/vehicle-imports/regNumbersTextTransformer';
import {
  type AutosysAssembledResult,
  type AutosysFetchResult,
  assembleAutosysResults,
} from '../../../data/vehicle-imports/assembleAutosysResults';
import { pubDeliveryFromListV2 } from '../../../data/vehicle-imports/pubDeliveryFromList';
import {
  fetchVehicleFromAutosys,
  importAsNetexToBackend,
} from '../../../data/vehicle-imports/vehicleImportServices';
import MultiImportFileInput from './MultiImportFileInput';
import MultiImportReviewInput from './MultiImportReviewInput';
import MultiImportConfirm from './MultiImportConfirm';

const CONCURRENCY_LIMIT = 5;

async function fetchAllWithConcurrency(
  regNumbers: string[],
  fetchFn: (rn: string) => Promise<string>,
  concurrency: number,
  onProgress: (completed: number) => void
): Promise<AutosysFetchResult[]> {
  const results: AutosysFetchResult[] = [];
  let completed = 0;
  let index = 0;

  async function worker() {
    while (index < regNumbers.length) {
      const i = index++;
      const regNumber = regNumbers[i];
      try {
        const xml = await fetchFn(regNumber);
        results[i] = { regNumber, xml, error: null };
      } catch (e) {
        results[i] = {
          regNumber,
          xml: '',
          error: e instanceof Error ? e.message : 'Unknown error',
        };
      }
      completed++;
      onProgress(completed);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, regNumbers.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

interface MultiImportProps {
  onClose: () => void;
  onImportComplete?: (vehicleTypeIds: string[]) => void;
}

export default function MultiImport({ onClose, onImportComplete }: MultiImportProps) {
  const { t } = useTranslation();
  const { applicationGetAutosysUrl, applicationImportBaseUrl } = useConfig();
  const { getAccessToken } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [regNumbers, setRegNumbers] = useState<string[]>([]);
  const [status, setStatus] = useState<RegNumbersStatus | null>(null);

  const [fetching, setFetching] = useState(false);
  const [fetchProgress, setFetchProgress] = useState({ completed: 0, total: 0 });
  const [assembledResult, setAssembledResult] = useState<AutosysAssembledResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const steps = [
    t('import.multi.stepUpload', 'Upload file'),
    t('import.multi.stepReview', 'Review'),
    t('import.multi.stepConfirm', 'Confirm'),
  ];

  const handleParsed = (parsed: string[], parsedStatus: RegNumbersStatus) => {
    setRegNumbers(parsed);
    setStatus(parsedStatus);
    setActiveStep(1);
  };

  const handleDeleteRegNumber = (value: string) => {
    setRegNumbers(prev => prev.filter(r => r !== value));
  };

  const handleAddRegNumber = (value: string) => {
    if (!regNumbers.includes(value)) {
      setRegNumbers(prev => [...prev, value]);
    }
  };

  const startFetch = async () => {
    setFetching(true);
    setFetchProgress({ completed: 0, total: regNumbers.length });

    const token = await getAccessToken();
    const results = await fetchAllWithConcurrency(
      regNumbers,
      rn => fetchVehicleFromAutosys(applicationGetAutosysUrl || '', rn, token),
      CONCURRENCY_LIMIT,
      completed => setFetchProgress({ completed, total: regNumbers.length })
    );

    const assembled = assembleAutosysResults(results);
    setAssembledResult(assembled);
    setFetching(false);
    setActiveStep(2);
  };

  const startSubmit = async () => {
    if (!assembledResult) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const combined = pubDeliveryFromListV2(assembledResult.xmlList);
      const builder = new XMLBuilder({
        ignoreAttributes: false,
        format: true,
        suppressEmptyNode: true,
      });
      const xml = builder.build(combined);
      const token = await getAccessToken();
      await importAsNetexToBackend(applicationImportBaseUrl || '', xml, token);
      if (onImportComplete) {
        onImportComplete(Array.from(assembledResult.summary.vehicleTypeIds));
      }
      onClose();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Import failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 1) {
      startFetch();
    } else if (activeStep === 2) {
      startSubmit();
    } else {
      setActiveStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 2) {
      setAssembledResult(null);
    }
    setActiveStep(s => s - 1);
  };

  return (
    <>
      <DialogTitle>{t('import.multi.title', 'Bulk Import Vehicles')}</DialogTitle>
      <DialogContent dividers>
        <Stepper
          activeStep={activeStep}
          sx={{
            mb: 3,
            '& .MuiStepIcon-root.Mui-active': { color: 'secondary.main' },
          }}
        >
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 120 }}>
          {activeStep === 0 && <MultiImportFileInput onParsed={handleParsed} />}
          {activeStep === 1 && (
            <MultiImportReviewInput
              regNumbers={regNumbers}
              status={status}
              fetching={fetching}
              fetchProgress={fetchProgress}
              onDeleteRegNumber={handleDeleteRegNumber}
              onAddRegNumber={handleAddRegNumber}
            />
          )}
          {activeStep === 2 && assembledResult && (
            <MultiImportConfirm assembledResult={assembledResult} submitError={submitError} />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {t('close')}
        </Button>
        <Button disabled={activeStep === 0 || fetching || submitting} onClick={handleBack}>
          {t('import.multi.back', 'Back')}
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={
            fetching ||
            submitting ||
            (activeStep === 1 && regNumbers.length === 0) ||
            (activeStep === 2 && (!assembledResult || assembledResult.xmlList.length === 0))
          }
        >
          {activeStep === 0 && t('import.multi.skip', 'Skip')}
          {activeStep === 1 && t('import.multi.next', 'Next')}
          {activeStep === 2 && t('import.multi.submit', 'Submit')}
        </Button>
      </DialogActions>
    </>
  );
}
