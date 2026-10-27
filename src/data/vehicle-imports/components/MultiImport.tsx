import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
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
import { type AutosysAssembledResult, assembleAutosysResults } from '../api/assembleAutosysResults';
import type { TableMeta } from '../utils/inputTextAnalyzer';
import { type RegNumbersStatus, deduplicateEntries } from '../utils/regNumbersTextTransformer';
import type { ImportEntry } from '../types/importTypes';
import { fetchVehiclesFromAutosys, importAsNetexToBackend } from '../api/vehicleImportServices';
import { extractVehicleTypeIds } from '../api/xmlUtils';
import MultiImportColumnMapper, { type ColumnMapping } from './MultiImportColumnMapper';
import MultiImportConfirm from './MultiImportConfirm';
import MultiImportFileInput from './MultiImportFileInput';
import MultiImportReviewInput from './MultiImportReviewInput';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext';

/** Steps when a CSV table is detected (includes column mapping) */
const TABLE_STEPS = ['Upload file', 'Map columns', 'Review', 'Confirm'] as const;
/** Steps for plain text / single-column input */
const LIST_STEPS = ['Upload file', 'Review', 'Confirm'] as const;

interface MultiImportProps {
  onClose: () => void;
  onImportComplete?: (vehicleTypeIds: string[]) => void;
}

export default function MultiImport({ onClose, onImportComplete }: MultiImportProps) {
  const { t } = useTranslation();
  const { officialMotorVehicleRegistryProxy, applicationImportBaseUrl } = useConfig();
  const { getAccessToken } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [entries, setEntries] = useState<ImportEntry[]>([]);
  const [status, setStatus] = useState<RegNumbersStatus | null>(null);
  const [tableMeta, setTableMeta] = useState<TableMeta | null>(null);
  const columnMappingRef = useRef<ColumnMapping | null>(null);

  const [fetching, setFetching] = useState(false);
  const [assembledResult, setAssembledResult] = useState<AutosysAssembledResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { currentOrganisation } = useOrganisationsContext();

  const isTableFlow = tableMeta !== null;
  const steps = isTableFlow ? TABLE_STEPS : LIST_STEPS;

  // Compute logical step names for readability
  const stepName = (idx: number): string => steps[idx] ?? '';

  const translatedSteps = isTableFlow
    ? [
        t('import.multi.stepUpload'),
        t('import.multi.stepMapColumns'),
        t('import.multi.stepReview'),
        t('import.multi.stepConfirm'),
      ]
    : [t('import.multi.stepUpload'), t('import.multi.stepReview'), t('import.multi.stepConfirm')];

  // --- Upload step callbacks ---

  const handleParsed = (parsed: string[], parsedStatus: RegNumbersStatus) => {
    setTableMeta(null);
    setEntries(parsed.map(rn => ({ queryRegNumber: rn })));
    setStatus(parsedStatus);
    setActiveStep(1); // goes to Review (list flow)
  };

  const handleTableDetected = (meta: TableMeta) => {
    setTableMeta(meta);
    setActiveStep(1); // goes to Map Columns (table flow)
  };

  // --- Column mapping step callback ---

  const handleColumnMappingChange = (mapping: ColumnMapping) => {
    columnMappingRef.current = mapping;
  };

  const applyColumnMapping = () => {
    if (!tableMeta || !columnMappingRef.current) return;
    const { regNumberCol, operationalRefCol } = columnMappingRef.current;
    const mapped: ImportEntry[] = tableMeta.rows
      .map(row => ({
        queryRegNumber: (row[regNumberCol] ?? '').trim(),
        operationalRef: operationalRefCol
          ? (row[operationalRefCol] ?? '').trim() || undefined
          : undefined,
      }))
      .filter(e => e.queryRegNumber);

    const result = deduplicateEntries(mapped);
    setEntries(result.entries);
    setStatus(result.status);
  };

  // --- Review step callbacks ---

  const handleDeleteEntry = (regNumber: string) => {
    setEntries(prev => prev.filter(e => e.queryRegNumber !== regNumber));
  };

  const handleAddEntry = (entry: ImportEntry) => {
    if (!entries.some(e => e.queryRegNumber === entry.queryRegNumber)) {
      setEntries(prev => [...prev, entry]);
    }
  };

  // --- Fetch + submit ---

  const startFetch = async () => {
    if (currentOrganisation?.id === undefined) {
      setSubmitError(t('import.multi.noOrganisation'));
      return;
    }
    setFetching(true);
    setSubmitError(null);
    try {
      const token = await getAccessToken();
      const xml = await fetchVehiclesFromAutosys(
        officialMotorVehicleRegistryProxy || '',
        currentOrganisation.id,
        entries,
        token
      );
      setAssembledResult(assembleAutosysResults(xml, entries));
      setActiveStep(prev => prev + 1); // advance to Confirm
    } catch (e) {
      // the whole request failed — stay on Review with one error
      setSubmitError(e instanceof Error ? e.message : t('import.multi.importFailed'));
    } finally {
      setFetching(false);
    }
  };

  const startSubmit = async () => {
    if (!assembledResult?.postPayload) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const xml = assembledResult.postPayload;
      const token = await getAccessToken();
      const responseXml = await importAsNetexToBackend(applicationImportBaseUrl || '', xml, token);
      if (onImportComplete) {
        const newIds = extractVehicleTypeIds(responseXml);
        onImportComplete(
          newIds.length > 0 ? newIds : Array.from(assembledResult.summary.vehicleTypeIds)
        );
      }
      onClose();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : t('import.multi.importFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  // --- Navigation ---

  const handleNext = () => {
    const current = stepName(activeStep);
    if (current === 'Map columns') {
      applyColumnMapping();
      setActiveStep(s => s + 1); // advance to Review
    } else if (current === 'Review') {
      startFetch();
    } else if (current === 'Confirm') {
      startSubmit();
    } else {
      setActiveStep(s => s + 1);
    }
  };

  const handleBack = () => {
    const current = stepName(activeStep);
    if (current === 'Confirm') {
      setAssembledResult(null);
    }
    setSubmitError(null);
    setActiveStep(s => s - 1);
  };

  // --- Determine which step content to show ---

  const currentStepName = stepName(activeStep);

  const isNextDisabled =
    fetching ||
    submitting ||
    (currentStepName === 'Review' && entries.length === 0) ||
    (currentStepName === 'Confirm' && !assembledResult?.postPayload);

  const nextLabel = (() => {
    switch (currentStepName) {
      case 'Upload file':
        return t('import.multi.skip');
      case 'Map columns':
        return t('import.multi.next');
      case 'Review':
        return t('import.multi.next');
      case 'Confirm':
        return t('import.multi.submit');
      default:
        return t('import.multi.next');
    }
  })();

  return (
    <>
      <DialogTitle>{t('import.multi.title')}</DialogTitle>
      <DialogContent dividers>
        <Stepper
          activeStep={activeStep}
          sx={{
            mb: 3,
            '& .MuiStepIcon-root.Mui-active': { color: 'secondary.main' },
          }}
        >
          {translatedSteps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 120 }}>
          {currentStepName === 'Upload file' && (
            <MultiImportFileInput onParsed={handleParsed} onTableDetected={handleTableDetected} />
          )}
          {currentStepName === 'Map columns' && tableMeta && (
            <MultiImportColumnMapper tableMeta={tableMeta} onConfirm={handleColumnMappingChange} />
          )}
          {currentStepName === 'Review' && (
            <>
              <MultiImportReviewInput
                entries={entries}
                status={status}
                fetching={fetching}
                onDeleteEntry={handleDeleteEntry}
                onAddEntry={handleAddEntry}
              />
              {submitError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {submitError}
                </Alert>
              )}
            </>
          )}
          {currentStepName === 'Confirm' && assembledResult && (
            <MultiImportConfirm assembledResult={assembledResult} submitError={submitError} />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {t('close')}
        </Button>
        <Button disabled={activeStep === 0 || fetching || submitting} onClick={handleBack}>
          {t('import.multi.back')}
        </Button>
        <Button variant="contained" onClick={handleNext} disabled={isNextDisabled}>
          {nextLabel}
        </Button>
      </DialogActions>
    </>
  );
}
