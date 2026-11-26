import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Stack } from '@mui/material';
import MultiImportColumnMapper from './MultiImportColumnMapper.tsx';
import MultiImportReviewInput from './MultiImportReviewInput.tsx';
import type { ImportEntry } from '../types/importTypes.ts';
import type { WarnLevel } from '../utils/regNumbersTextTransformer.ts';

/** A pasted sheet: the column mapper picks the registration and operational-id columns. */
const TABLE = {
  kind: 'table' as const,
  headers: ['Regnr', 'Internnr', 'Modell'],
  rows: [
    { Regnr: 'EB12345', Internnr: 'OP-001', Modell: 'Solaris Urbino 12 electric' },
    { Regnr: 'EB12346', Internnr: 'OP-002', Modell: 'Solaris Urbino 12 electric' },
    { Regnr: 'EL23456', Internnr: 'OP-003', Modell: 'Volvo 8900' },
  ],
  rowCount: 3,
};
const ENTRIES: ImportEntry[] = [
  { queryRegNumber: 'EB12345', operationalRef: 'OP-001' },
  { queryRegNumber: 'EB12346' },
];
const LEVELS: WarnLevel[] = ['success', 'info', 'warning', 'error'];

const meta: Meta = {
  title: 'vehicle-imports/MultiImport',
  parameters: {
    docs: {
      description: {
        component:
          "The Statens vegvesen import dialog's steps: the column mapper's Linje pickers, and the review list with its add field level with the Add button.",
      },
    },
  },
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 720, p: 2 }}>
        <Story />
      </Box>
    ),
  ],
};
export default meta;
type Story = StoryObj;

export const ColumnMapper: Story = {
  render: () => <MultiImportColumnMapper tableMeta={TABLE} onConfirm={() => {}} />,
};

function Review({ level }: { level: WarnLevel }) {
  const [entries, setEntries] = useState(ENTRIES);
  return (
    <MultiImportReviewInput
      entries={entries}
      status={{
        uniqueCount: entries.length,
        message: `${level}: 2 registration numbers`,
        warnLevel: level,
      }}
      fetching={false}
      onDeleteEntry={reg => setEntries(es => es.filter(e => e.queryRegNumber !== reg))}
      onAddEntry={e => setEntries(es => [...es, e])}
    />
  );
}

export const ReviewInput: Story = {
  render: () => (
    <Stack spacing={4}>
      {LEVELS.map(level => (
        <Review key={level} level={level} />
      ))}
    </Stack>
  ),
};
