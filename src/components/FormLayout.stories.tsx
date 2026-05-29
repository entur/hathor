import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, TextField } from '@mui/material';
import { FormLayout, FieldRow, MetaRow } from './FormLayout';

const meta: Meta<typeof FormLayout> = {
  title: 'components/FormLayout',
  component: FormLayout,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Container-query-aware two-column form grid. Stacks (single column) when the nearest inline-size container is narrower than 22rem.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof FormLayout>;

export const Editable: Story = {
  render: () => (
    <FormLayout>
      <FieldRow id="f-name" label="Name">
        <TextField id="f-name" size="small" fullWidth defaultValue="ER34-001" />
      </FieldRow>
      <FieldRow id="f-reg" label="Registration number">
        <TextField id="f-reg" size="small" fullWidth defaultValue="EW 12345" />
      </FieldRow>
      <FieldRow id="f-notes" label="Notes" alignTop>
        <TextField id="f-notes" size="small" fullWidth multiline rows={3} />
      </FieldRow>
    </FormLayout>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <FormLayout>
      <MetaRow label="Codespace">NSR</MetaRow>
      <MetaRow label="Type">VehicleType</MetaRow>
      <MetaRow label="Created">2026-05-29</MetaRow>
    </FormLayout>
  ),
};

export const Mixed: Story = {
  render: () => (
    <FormLayout>
      <MetaRow label="Id">NSR:VehicleType:1234</MetaRow>
      <FieldRow id="m-name" label="Name">
        <TextField id="m-name" size="small" fullWidth defaultValue="Type 73" />
      </FieldRow>
      <MetaRow label="Read-only field">cannot edit</MetaRow>
    </FormLayout>
  ),
};

/**
 * Constrains the wrapping Box to 20rem so FormLayout's container query
 * (`@container (min-width: 22rem)`) misses and the grid collapses to a
 * single column. Resize your browser — the canvas-level layout doesn't
 * matter; only the wrapping Box's width does.
 */
export const NarrowContainer: Story = {
  render: () => (
    <Box sx={{ width: '20rem', border: '1px dashed', borderColor: 'divider', p: 2 }}>
      <FormLayout>
        <FieldRow id="n-name" label="Name">
          <TextField id="n-name" size="small" fullWidth defaultValue="ER34-001" />
        </FieldRow>
        <FieldRow id="n-reg" label="Registration number">
          <TextField id="n-reg" size="small" fullWidth defaultValue="EW 12345" />
        </FieldRow>
      </FormLayout>
    </Box>
  ),
};
