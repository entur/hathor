import { type DragEvent, type KeyboardEvent, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloudUpload } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  type RegNumbersStatus,
  regNumbersTextTransformer,
} from '../../../data/vehicle-imports/regNumbersTextTransformer';

interface AutosysMultiImportProps {
  onClose: () => void;
}

export default function AutosysMultiImport({ onClose }: AutosysMultiImportProps) {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [regNumbers, setRegNumbers] = useState<string[]>([]);
  const [status, setStatus] = useState<RegNumbersStatus | null>(null);
  const [newEntry, setNewEntry] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          {activeStep === 0 ? t('import.multi.skip', 'Skip') : t('import.multi.next', 'Next')}
        </Button>
      </DialogActions>
    </>
  );
}
