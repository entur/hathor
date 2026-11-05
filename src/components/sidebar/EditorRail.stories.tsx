import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import { Box } from '@mui/material';
import EditorRail from './EditorRail';
import { EditingProvider } from '../../contexts/EditingContext';

/** Mock sidebar the rail docks against; feeds the CSS vars the rail reads. */
const PANE_W = 360,
  HEADER_H = 16;

const meta: Meta<typeof EditorRail> = {
  title: 'components/sidebar/EditorRail',
  component: EditorRail,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Segmented control docked on the editor pane’s content-facing edge. Segments appear per prop: pen needs `mode="view"` + `onEnterEdit`, deactivate needs `onDeactivate`, cancel/save need `mode="edit"`. Editors pass neither pen nor deactivate when there is no record to act on (#237).',
      },
    },
  },
  args: {
    side: 'right',
    onCollapse: fn(),
    onEnterEdit: fn(),
    onDeactivate: fn(),
    onCancelEdit: fn(),
    onSave: fn(),
    deactivateConfirmTitle: 'Deactivate vehicle?',
    deactivateConfirmMessage: 'The vehicle is hidden from lists.',
  },
  decorators: [
    Story => (
      <EditingProvider>
        <Box
          sx={{
            '--sidebar-width': `${PANE_W}px`,
            '--app-header-height': `${HEADER_H}px`,
            minHeight: 320,
          }}
        >
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: PANE_W,
              borderLeft: '1px solid',
              borderColor: 'divider',
            }}
          />
          <Story />
        </Box>
      </EditingProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof EditorRail>;

/** A loaded record in view mode: collapse · edit · deactivate. */
export const View: Story = { args: { mode: 'view' } };

/**
 * View mode with no record to act on — the first read failed, or the post-save
 * re-read has not settled yet (#237). Only collapse remains.
 */
export const ViewWithoutRecord: Story = {
  args: { mode: 'view', onEnterEdit: undefined, onDeactivate: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('editor-rail-collapse')).toBeVisible();
    await expect(canvas.queryByTestId('editor-rail-edit')).toBeNull();
  },
};

/** Loading / not-found bodies: the rail gets `onCollapse` only (degraded mode). */
export const CollapseOnly: Story = {
  args: {
    mode: undefined,
    onEnterEdit: undefined,
    onDeactivate: undefined,
    onCancelEdit: undefined,
    onSave: undefined,
  },
};

/** Edit mode, nothing changed yet: Save is disabled. */
export const EditPristine: Story = { args: { mode: 'edit' } };

export const EditDirty: Story = { args: { mode: 'edit', isDirty: true } };

/** Dirty but a structurally required field is missing (`canSubmit={false}`). */
export const EditMissingFields: Story = {
  args: { mode: 'edit', isDirty: true, canSubmit: false },
};

export const Saving: Story = { args: { mode: 'edit', isDirty: true, saving: true } };
