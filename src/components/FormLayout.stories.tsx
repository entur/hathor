import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, TextField } from '@mui/material';
import { FormLayout, FormStack, MetaRow } from './FormLayout';

const meta: Meta<typeof FormLayout> = {
  title: 'components/FormLayout',
  component: FormLayout,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Form containers. `FormLayout` is the container-query-aware two-column grid for read-only label/value rows; it stacks when the nearest inline-size container is narrower than 22rem. `FormStack` is the single-column stack for editable fields that carry their own floating label.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof FormLayout>;

export const ReadOnly: Story = {
  render: () => (
    <FormLayout>
      <MetaRow label="Codespace">NSR</MetaRow>
      <MetaRow label="Type">VehicleType</MetaRow>
      <MetaRow label="Created">2026-05-29</MetaRow>
    </FormLayout>
  ),
};

/**
 * Constrains the wrapping Box to 20rem so FormLayout's container query
 * (`@container (min-width: 22rem)`) misses and the grid collapses to a
 * single column. Only the wrapping Box's width matters, not the canvas's.
 */
export const NarrowContainer: Story = {
  render: () => (
    <Box sx={{ width: '20rem', border: '1px dashed', borderColor: 'divider', p: 2 }}>
      <FormLayout>
        <MetaRow label="Codespace">NSR</MetaRow>
        <MetaRow label="Registration number">EW 12345</MetaRow>
      </FormLayout>
    </Box>
  ),
};

/** Editable fields: labels sit on the field, every field spans the full width. */
export const Stack: Story = {
  render: () => (
    <FormStack>
      <TextField id="f-name" label="Name" size="small" fullWidth defaultValue="ER34-001" />
      <TextField id="f-reg" label="Registration number" size="small" fullWidth />
      <TextField id="f-notes" label="Notes" size="small" fullWidth multiline rows={3} />
    </FormStack>
  ),
};

/** Read-only context rows above an editable stack, as the sidebar editors lay them out. */
export const Mixed: Story = {
  render: () => (
    <>
      <FormLayout sx={{ mb: 2 }}>
        <MetaRow label="Id">NSR:VehicleType:1234</MetaRow>
        <MetaRow label="Read-only field">cannot edit</MetaRow>
      </FormLayout>
      <FormStack>
        <TextField id="m-name" label="Name" size="small" fullWidth defaultValue="Type 73" />
      </FormStack>
    </>
  ),
};
