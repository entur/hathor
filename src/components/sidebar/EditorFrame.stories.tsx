import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import { Box, Typography } from '@mui/material';
import EditorFrame, { type EditorCopy } from './EditorFrame';
import { EditingProvider } from '../../contexts/EditingContext';
import type { EntityEditor } from '../../hooks/useEntityEditor';

/** Mock sidebar width; the rail docks on its left edge via `--sidebar-width`. */
const PANE_W = 420,
  HEADER_H = 16,
  SKELETON_ROWS = 5;

const ID = 'ENT:Vehicle:1234',
  NAME = 'Solaris Urbino 12 — ATB 4021';

type Entity = { id?: string; version?: number; name?: { value?: string } };
type Editor = EntityEditor<Entity, Entity>;

const COPY: EditorCopy = {
  title: 'vehicles.detailsTitle',
  notFound: 'vehicles.notFound',
  saved: 'vehicles.saveSuccess',
  deactivated: 'vehicles.deactivateSuccess',
  deactivateTitle: 'vehicle.deactivateConfirmTitle',
  deactivateMessage: 'vehicle.deactivateConfirmMessage',
};

/** A loaded, clean editor in view mode; stories override what they show. */
const mkEditor = (
  over: Partial<Omit<Editor, 'rail'>> = {},
  rail: Partial<Editor['rail']> = {}
): Editor => {
  const record = { id: ID, version: 3, name: { value: NAME } };
  return {
    id: ID,
    isCreate: false,
    record,
    loading: false,
    fetchError: null,
    refetch: fn(async () => record),
    notFound: false,
    form: record,
    setForm: fn(),
    saveError: null,
    clearSaveError: fn(),
    warning: null,
    clearWarning: fn(),
    saved: false,
    clearSaved: fn(),
    deactivated: false,
    isDeactivated: false,
    ...over,
    rail: {
      onCollapse: fn(),
      mode: 'view',
      isDirty: false,
      saving: false,
      onCancelEdit: fn(),
      onSave: fn(),
      onEnterEdit: fn(),
      onDeactivate: fn(),
      ...rail,
    },
  };
};

const Body = () => (
  <Typography variant="body2" color="text.secondary">
    Feature form goes here.
  </Typography>
);

const meta: Meta<typeof EditorFrame<Entity, Entity>> = {
  title: 'components/editorFrame/modal',
  component: EditorFrame,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Chrome every entity editor shares (#238), in the sidebar; the form page is `components/editorFrame/fullpage`: skeleton while the first read is in flight, the not-found body, title + NetexId, the read-error body with Retry, the save / deactivate snackbars and the `EditorRail`. The feature passes only its body as children.',
      },
    },
  },
  args: {
    editor: mkEditor(),
    entity: { id: ID, version: 3, name: { value: NAME } },
    testId: 'vehicle',
    copy: COPY,
    skeleton: SKELETON_ROWS,
    children: <Body />,
  },
  decorators: [
    Story => (
      <EditingProvider>
        <Box
          sx={{
            '--sidebar-width': `${PANE_W}px`,
            '--app-header-height': `${HEADER_H}px`,
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: PANE_W,
            borderLeft: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Story />
        </Box>
      </EditingProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Loaded: Story = {};

/** Blank typed name → `[ unnamed ]` placeholder in the title. */
export const Unnamed: Story = {
  args: { entity: { id: ID, version: 3, name: { value: '   ' } } },
  play: async ({ canvasElement }) => {
    const title = within(canvasElement).getByTestId('vehicle-details-title');
    await expect(title).toHaveTextContent('[ unnamed ]');
  },
};

/** Create pane: no id yet, so no NetexId badge and no deactivate. */
export const Create: Story = {
  args: {
    editor: mkEditor(
      { id: '', isCreate: true, record: null },
      { mode: 'edit', onDeactivate: undefined }
    ),
    entity: {},
  },
};

/** First read in flight: skeleton + collapse-only rail. */
export const Loading: Story = {
  args: { editor: mkEditor({ loading: true, record: null }) },
};

export const NotFound: Story = {
  args: { editor: mkEditor({ record: null, notFound: true }) },
};

/** First read failed: alert + Retry in place of the body; nothing to edit or deactivate. */
export const FetchError: Story = {
  args: {
    editor: mkEditor(
      { record: null, fetchError: 'Could not load the vehicle (503).' },
      { onEnterEdit: undefined, onDeactivate: undefined }
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('vehicle-record-fetch-error')).toBeVisible();
    await expect(canvas.queryByTestId('editor-rail-edit')).toBeNull();
  },
};

export const EditDirty: Story = {
  args: {
    editor: mkEditor({}, { mode: 'edit', isDirty: true }),
  },
};

/** Saved, but the list reload failed: the stale-list warning snackbar. */
export const SavedStaleList: Story = {
  args: {
    editor: mkEditor({
      warning: 'Saved — but the list could not refresh; it may be stale.',
    }),
  },
};
