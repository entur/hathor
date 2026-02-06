import { type DragEvent, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloudUpload } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  type AnalyzerResult,
  type TableMeta,
  inputTextAnalyzer,
} from '../../../data/vehicle-imports/inputTextAnalyzer';
import type { RegNumbersStatus } from '../../../data/vehicle-imports/regNumbersTextTransformer';

interface MultiImportFileInputProps {
  onParsed: (regNumbers: string[], status: RegNumbersStatus) => void;
  onTableDetected: (tableMeta: TableMeta) => void;
}

export default function MultiImportFileInput({
  onParsed,
  onTableDetected,
}: MultiImportFileInputProps) {
  const { t } = useTranslation();
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileContent = useCallback(
    (text: string) => {
      const result: AnalyzerResult = inputTextAnalyzer(text);
      if (result.kind === 'table') {
        onTableDetected(result);
      } else {
        onParsed(result.registrationNumbers, result.status);
      }
    },
    [onParsed, onTableDetected]
  );

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
  );
}
