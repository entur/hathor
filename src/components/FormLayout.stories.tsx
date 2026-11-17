import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '@mui/material';
import { FormLayout, MetaRow } from './FormLayout';

const meta: Meta<typeof FormLayout> = {
  title: 'components/form-layout/FormLayout',
  component: FormLayout,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Form containers. `FormLayout` is the container-query-aware two-column grid for read-only label/value rows; it stacks when the nearest inline-size container is narrower than 22rem. Editable fields are laid out by `FormSections` and drawn by `FormFields`.',
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
