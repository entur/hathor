import { useRef, useState } from 'react';
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
import type { TableMeta } from '../../../data/vehicle-imports/inputTextAnalyzer';
import type { RegNumbersStatus } from '../../../data/vehicle-imports/regNumbersTextTransformer';
import {
  type AutosysAssembledResult,
  type AutosysFetchResult,
  assembleAutosysResults,
} from '../../../data/vehicle-imports/assembleAutosysResults';
import { pubDeliveryFromListV2 } from '../../../data/vehicle-imports/pubDeliveryFromList';
import type { ImportEntry } from '../../../data/vehicle-imports/types';
import {
  fetchVehicleFromAutosys,
  importAsNetexToBackend,
} from '../../../data/vehicle-imports/vehicleImportServices';
import MultiImportColumnMapper, { type ColumnMapping } from './MultiImportColumnMapper';
import MultiImportConfirm from './MultiImportConfirm';
import MultiImportFileInput from './MultiImportFileInput';
import MultiImportReviewInput from './MultiImportReviewInput';

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
  const { applicationGetAutosysUrl, applicationImportBaseUrl } = useConfig();
  const { getAccessToken } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [entries, setEntries] = useState<ImportEntry[]>([]);
  const [status, setStatus] = useState<RegNumbersStatus | null>(null);
  const [tableMeta, setTableMeta] = useState<TableMeta | null>(null);
  const columnMappingRef = useRef<ColumnMapping | null>(null);

  const [fetching, setFetching] = useState(false);
  const [fetchProgress, setFetchProgress] = useState({ completed: 0, total: 0 });
  const [assembledResult, setAssembledResult] = useState<AutosysAssembledResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isTableFlow = tableMeta !== null;
  const steps = isTableFlow ? TABLE_STEPS : LIST_STEPS;

  // Compute logical step names for readability
  const stepName = (idx: number): string => steps[idx] ?? '';

  const translatedSteps = isTableFlow
    ? [
        t('import.multi.stepUpload', 'Upload file'),
        t('import.multi.stepMapColumns', 'Map columns'),
        t('import.multi.stepReview', 'Review'),
        t('import.multi.stepConfirm', 'Confirm'),
      ]
    : [
        t('import.multi.stepUpload', 'Upload file'),
        t('import.multi.stepReview', 'Review'),
        t('import.multi.stepConfirm', 'Confirm'),
      ];

  // --- Upload step callbacks ---

  const handleParsed = (parsed: string[], parsedStatus: RegNumbersStatus) => {
    setTableMeta(null);
    setEntries(parsed.map(rn => ({ regNumber: rn })));
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
        regNumber: (row[regNumberCol] ?? '').trim(),
        operationalRef: operationalRefCol
          ? (row[operationalRefCol] ?? '').trim() || undefined
          : undefined,
      }))
      .filter(e => e.regNumber);

    // Deduplicate by regNumber
    const seen = new Set<string>();
    const deduped: ImportEntry[] = [];
    for (const e of mapped) {
      if (!seen.has(e.regNumber)) {
        seen.add(e.regNumber);
        deduped.push(e);
      }
    }

    const duplicateCount = mapped.length - deduped.length;
    const uniqueCount = deduped.length;

    let message: string;
    let warnLevel: 'success' | 'warning' | 'error';
    if (uniqueCount === 0) {
      message = 'No registration numbers found';
      warnLevel = 'error';
    } else if (duplicateCount > 0) {
      message = `${uniqueCount} unique registration numbers (${duplicateCount} duplicate(s) removed)`;
      warnLevel = 'warning';
    } else {
      message = `${uniqueCount} registration numbers`;
      warnLevel = 'success';
    }

    setEntries(deduped);
    setStatus({ uniqueCount, message, warnLevel });
  };

  // --- Review step callbacks ---

  const handleDeleteEntry = (regNumber: string) => {
    setEntries(prev => prev.filter(e => e.regNumber !== regNumber));
  };

  const handleAddEntry = (entry: ImportEntry) => {
    if (!entries.some(e => e.regNumber === entry.regNumber)) {
      setEntries(prev => [...prev, entry]);
    }
  };

  // --- Fetch + submit ---

  const startFetch = async () => {
    const regNumbers = entries.map(e => e.regNumber);
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
    setActiveStep(prev => prev + 1); // advance to Confirm
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
    setActiveStep(s => s - 1);
  };

  // --- Determine which step content to show ---

  const currentStepName = stepName(activeStep);

  const isNextDisabled =
    fetching ||
    submitting ||
    (currentStepName === 'Review' && entries.length === 0) ||
    (currentStepName === 'Confirm' && (!assembledResult || assembledResult.xmlList.length === 0));

  const nextLabel = (() => {
    switch (currentStepName) {
      case 'Upload file':
        return t('import.multi.skip', 'Skip');
      case 'Map columns':
        return t('import.multi.next', 'Next');
      case 'Review':
        return t('import.multi.next', 'Next');
      case 'Confirm':
        return t('import.multi.submit', 'Submit');
      default:
        return t('import.multi.next', 'Next');
    }
  })();

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
            <MultiImportReviewInput
              entries={entries}
              status={status}
              fetching={fetching}
              fetchProgress={fetchProgress}
              onDeleteEntry={handleDeleteEntry}
              onAddEntry={handleAddEntry}
            />
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
          {t('import.multi.back', 'Back')}
        </Button>
        <Button variant="contained" onClick={handleNext} disabled={isNextDisabled}>
          {nextLabel}
        </Button>
      </DialogActions>
    </>
  );
}
