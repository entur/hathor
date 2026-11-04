import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Box, TextField } from '@mui/material';
import type { FieldSpec } from '../collection/types.ts';
import { EditFooter, FormSections, resolveSections, type Layout } from './index.ts';

const FORM_MAX_W = 1140; // PageShell's `lg` container
const SAVE_MS = 900; // fake round trip, long enough to see the Saving state

/** Story-local registry: enough sections that the form outgrows the viewport. */
const fields = Object.fromEntries(
  Array.from({ length: 24 }, (_, i) => [`field${i + 1}`, { kind: 'text', path: [`field${i + 1}`] }])
) as Record<string, FieldSpec>;
const keys = Object.keys(fields);
const layout: Layout = Object.fromEntries(
  ['General', 'Dimensions', 'Capacity', 'Environment'].map((title, i) => [
    title,
    keys.slice(i * 6, i * 6 + 6),
  ])
);
const sections = resolveSections(fields, layout);

/** A host in miniature: owns values + baseline, so typing dirties, Cancel reverts, Save settles. */
const LongForm = () => {
  const [baseline, setBaseline] = useState<Record<string, string>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const dirty = keys.some(k => (values[k] ?? '') !== (baseline[k] ?? ''));
  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setBaseline(values);
      setSaving(false);
      setSaved(true);
    }, SAVE_MS);
  };

  return (
    <Box sx={{ maxWidth: FORM_MAX_W, mx: 'auto', p: 2 }}>
      <FormSections
        sections={sections}
        renderField={({ key, label }) => (
          <TextField
            size="small"
            fullWidth
            label={label}
            value={values[key] ?? ''}
            onChange={e => {
              setSaved(false);
              setValues(v => ({ ...v, [key]: e.target.value }));
            }}
          />
        )}
      />
      <EditFooter
        dirty={dirty}
        saving={saving}
        saved={saved}
        onSave={save}
        onCancel={() => setValues(baseline)}
        sx={{ mt: 3 }}
      />
    </Box>
  );
};

const meta: Meta<typeof EditFooter> = {
  title: 'components/EditFooter',
  component: EditFooter,
  args: {
    dirty: false,
    saving: false,
    disabled: false,
    canSubmit: true,
    saved: false,
    onSave: fn(),
    onCancel: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          'Sticky Save/Cancel for an edit session (#269). Presentational: the host owns state and the save. Both actions are inert while clean; `canSubmit` locks Save only.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof EditFooter>;

/** Entering a form — nothing to lose and nothing to say: both actions inert, no status. */
export const Clean: Story = {};

/** Clean again after a successful save — green dot, "All changes saved". */
export const SavedOk: Story = { args: { saved: true } };

/** Unsaved work — tinted band, pulsing dot, both actions live. */
export const Dirty: Story = { args: { dirty: true } };

/** A save in flight locks both: a discard would restore a baseline about to be replaced. */
export const Saving: Story = { args: { dirty: true, saving: true } };

/** Dirty but a required field is empty — Save locked, Cancel still discards. */
export const MissingFields: Story = { args: { dirty: true, canSubmit: false } };

/** Type in any field, scroll: the footer stays at the bottom of the viewport until the form ends. */
export const OnLongForm: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <LongForm />,
};
