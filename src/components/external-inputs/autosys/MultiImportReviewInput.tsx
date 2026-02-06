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
import type { ImportEntry } from '../../../data/vehicle-imports/types';

interface MultiImportReviewInputProps {
  entries: ImportEntry[];
  status: RegNumbersStatus | null;
  fetching: boolean;
  fetchProgress: { completed: number; total: number };
  onDeleteEntry: (regNumber: string) => void;
  onAddEntry: (entry: ImportEntry) => void;
}

/** Parse "AB1234:OP-001" into an ImportEntry. Colon separates reg from ref. */
function parseEntryInput(raw: string): ImportEntry | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const colonIdx = trimmed.indexOf(':');
  if (colonIdx === -1) {
    return { regNumber: trimmed };
  }

  const regNumber = trimmed.slice(0, colonIdx).trim();
  const operationalRef = trimmed.slice(colonIdx + 1).trim() || undefined;
  if (!regNumber) return null;

  return { regNumber, operationalRef };
}

function EntryChipLabel({ entry }: { entry: ImportEntry }) {
  if (!entry.operationalRef) {
    return <span>{entry.regNumber}</span>;
  }

  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <span>{entry.regNumber}</span>
      <Box
        component="span"
        sx={{
          bgcolor: 'secondary.main',
          color: 'secondary.contrastText',
          fontSize: '0.7rem',
          fontWeight: 600,
          px: 0.75,
          py: 0.125,
          borderRadius: 1,
          lineHeight: 1.4,
        }}
      >
        {entry.operationalRef}
      </Box>
    </Box>
  );
}

export default function MultiImportReviewInput({
  entries,
  status,
  fetching,
  fetchProgress,
  onDeleteEntry,
  onAddEntry,
}: MultiImportReviewInputProps) {
  const { t } = useTranslation();
  const [newEntry, setNewEntry] = useState('');

  const progressPercent =
    fetchProgress.total > 0 ? Math.round((fetchProgress.completed / fetchProgress.total) * 100) : 0;

  const handleAddEntry = () => {
    const parsed = parseEntryInput(newEntry);
    if (parsed) {
      onAddEntry(parsed);
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
        {entries.map(entry => (
          <Chip
            key={entry.regNumber}
            label={<EntryChipLabel entry={entry} />}
            onDelete={() => onDeleteEntry(entry.regNumber)}
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
          placeholder={t('import.multi.addPlaceholder', 'AB1234 or AB1234:OP-001')}
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
