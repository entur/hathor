import { type DragEvent, type KeyboardEvent, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { XMLBuilder } from 'fast-xml-parser';
import { CloudUpload } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useAuth } from '../../../auth';
import { useConfig } from '../../../contexts/configContext';
import {
  type RegNumbersStatus,
  regNumbersTextTransformer,
} from '../../../data/vehicle-imports/regNumbersTextTransformer';
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

interface AutosysMultiImportProps {
  onClose: () => void;
  onImportComplete?: (vehicleTypeIds: string[]) => void;
}

export default function AutosysMultiImport({ onClose, onImportComplete }: AutosysMultiImportProps) {
  const { t } = useTranslation();
  const { applicationGetAutosysUrl, applicationImportBaseUrl } = useConfig();
  const { getAccessToken } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [regNumbers, setRegNumbers] = useState<string[]>([]);
  const [status, setStatus] = useState<RegNumbersStatus | null>(null);
  const [newEntry, setNewEntry] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch progress state
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

  const handleFileContent = useCallback((text: string) => {
    const result = regNumbersTextTransformer(text);
    setRegNumbers(result.registrationNumbers);
    setStatus(result.status);
    setActiveStep(1);
  }, []);

  const handleDeleteRegNumber = (value: string) => {
    setRegNumbers(prev => prev.filter(r => r !== value));
  };

  const handleAddEntry = () => {
    const trimmed = newEntry.trim();
    if (trimmed && !regNumbers.includes(trimmed)) {
      setRegNumbers(prev => [...prev, trimmed]);
    }
    setNewEntry('');
  };

  const handleEntryKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEntry();
    }
  };

  const readFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => handleFileContent(reader.result as string);
      reader.readAsText(file);
    },
    [handleFileContent]
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) readFile(file);
    },
    [readFile]
  );

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setDragOver(false), []);

  const onClickUpload = () => fileInputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    e.target.value = '';
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

  const progressPercent =
    fetchProgress.total > 0 ? Math.round((fetchProgress.completed / fetchProgress.total) * 100) : 0;

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
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                hidden
                onChange={onFileChange}
                data-testid="multi-import-file-input"
              />
              <Box
                onClick={onClickUpload}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                sx={{
                  border: '2px dashed',
                  borderColor: dragOver ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  bgcolor: dragOver ? 'action.hover' : 'transparent',
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, background-color 0.2s',
                }}
                data-testid="multi-import-dropzone"
              >
                <CloudUpload sx={{ fontSize: 48, color: 'action.active', mb: 1 }} />
                <Typography>
                  {t(
                    'import.multi.dropzoneLabel',
                    'Drag and drop a CSV or TXT file here, or click to upload'
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t(
                    'import.multi.dropzoneHint',
                    'One registration number per line, or separated by commas'
                  )}
                </Typography>
              </Box>
            </>
          )}
          {activeStep === 1 && (
            <>
              {fetching ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography sx={{ mb: 2 }}>
                    {t('import.multi.fetching', 'Fetching {{completed}} of {{total}}...', {
                      completed: fetchProgress.completed,
                      total: fetchProgress.total,
                    })}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>
              ) : (
                <>
                  {status && (
                    <Alert severity={status.warnLevel} sx={{ mb: 2 }}>
                      {status.message}
                    </Alert>
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      p: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      minHeight: 80,
                      maxHeight: 240,
                      overflowY: 'auto',
                      alignContent: 'flex-start',
                    }}
                    data-testid="multi-import-tags"
                  >
                    {regNumbers.map(rn => (
                      <Chip
                        key={rn}
                        label={rn}
                        onDelete={() => handleDeleteRegNumber(rn)}
                        size="small"
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                    <TextField
                      size="small"
                      value={newEntry}
                      onChange={e => setNewEntry(e.target.value)}
                      onKeyDown={handleEntryKeyDown}
                      placeholder={t('import.multi.addPlaceholder', 'Add registration number...')}
                      fullWidth
                      data-testid="multi-import-add-input"
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddEntry}
                      disabled={!newEntry.trim()}
                      data-testid="multi-import-add-button"
                    >
                      {t('import.multi.add', 'Add')}
                    </Button>
                  </Box>
                </>
              )}
            </>
          )}
          {activeStep === 2 && assembledResult && (
            <>
              <Alert
                severity={assembledResult.summary.errors.length > 0 ? 'warning' : 'success'}
                sx={{ mb: 2 }}
              >
                {t('import.multi.summaryFetched', 'Fetched {{success}} of {{total}} vehicles', {
                  success: assembledResult.xmlList.length,
                  total: assembledResult.xmlList.length + assembledResult.summary.errors.length,
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
                <Typography color="text.secondary">
                  {t('import.multi.vehicles', 'Vehicles')}
                </Typography>
                <Typography>{assembledResult.summary.vehicleCount}</Typography>

                <Typography color="text.secondary">
                  {t('import.multi.vehicleTypes', 'Vehicle types')}
                </Typography>
                <Typography>{assembledResult.summary.vehicleTypeIds.size}</Typography>

                <Typography color="text.secondary">
                  {t('import.multi.deckPlans', 'Deck plans')}
                </Typography>
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
                    <Typography key={err.regNumber} variant="body2">
                      {err.regNumber}: {err.message}
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
