import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '@mui/material';
import { FormStack } from './FormLayout';
import { FormNumberField, FormSelectField, FormSwitchField, FormTextField } from './FormFields';

const NARROW_WIDTH = '20rem';
const MODES = [
  { value: 'bus', label: 'Bus' },
  { value: 'rail', label: 'Rail' },
  { value: 'water', label: 'Water' },
] as const;

type Mode = (typeof MODES)[number]['value'];

const meta: Meta = {
  title: 'components/FormFields',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Field primitives for sidebar editor forms — text, number, select-with-none and switch. Each takes plain values and reports plain values; no feature types.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

function AllFields({ disabled }: { disabled?: boolean }) {
  const [name, setName] = useState('Turvogn 1');
  const [built, setBuilt] = useState('2026-05-29');
  const [length, setLength] = useState<number | undefined>(12.5);
  const [mode, setMode] = useState<Mode | undefined>('bus');
  const [lowFloor, setLowFloor] = useState(true);
  return (
    <FormStack>
      <FormTextField id="s-name" label="Name" value={name} onChange={setName} disabled={disabled} />
      <FormTextField
        id="s-built"
        label="Build date"
        type="date"
        value={built}
        onChange={setBuilt}
        disabled={disabled}
      />
      <FormNumberField
        id="s-length"
        label="Length (m)"
        value={length}
        onChange={setLength}
        disabled={disabled}
      />
      <FormSelectField
        id="s-mode"
        label="Transport mode"
        value={mode}
        options={MODES}
        noneLabel="None"
        onChange={setMode}
        disabled={disabled}
      />
      <FormSwitchField
        id="s-low-floor"
        label="Low floor"
        checked={lowFloor}
        onChange={setLowFloor}
        disabled={disabled}
      />
    </FormStack>
  );
}

export const Editable: Story = { render: () => <AllFields /> };

export const ReadOnly: Story = { render: () => <AllFields disabled /> };

/** A narrow rail: fields keep the full width. */
export const NarrowContainer: Story = {
  render: () => (
    <Box sx={{ width: NARROW_WIDTH, border: '1px dashed', borderColor: 'divider', p: 2 }}>
      <AllFields />
    </Box>
  ),
};
