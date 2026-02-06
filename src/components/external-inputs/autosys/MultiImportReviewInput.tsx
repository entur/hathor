import { type KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { RegNumbersStatus } from '../../../data/vehicle-imports/regNumbersTextTransformer';

interface MultiImportReviewInputProps {
  regNumbers: string[];
  status: RegNumbersStatus | null;
  fetching: boolean;
  fetchProgress: { completed: number; total: number };
  onDeleteRegNumber: (value: string) => void;
  onAddRegNumber: (value: string) => void;
}

export default function MultiImportReviewInput({
  regNumbers,
  status,
  fetching,
  fetchProgress,
  onDeleteRegNumber,
  onAddRegNumber,
}: MultiImportReviewInputProps) {
  const { t } = useTranslation();
  const [newEntry, setNewEntry] = useState('');

  const progressPercent =
    fetchProgress.total > 0 ? Math.round((fetchProgress.completed / fetchProgress.total) * 100) : 0;

  const handleAddEntry = () => {
    const trimmed = newEntry.trim();
    if (trimmed) {
      onAddRegNumber(trimmed);
    }
    setNewEntry('');
  };

  const handleEntryKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEntry();
    }
  };

  if (fetching) {
    return (
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
    );
  }

  return (
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
          <Chip key={rn} label={rn} onDelete={() => onDeleteRegNumber(rn)} size="small" />
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
  );
}
