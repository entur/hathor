import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Box, Button, Stack, TextField, Typography, createTheme, useTheme } from '@mui/material';
import { Sidebar, type Side } from './Sidebar.tsx';
import EditorRail, { RAIL_W } from './EditorRail.tsx';
import { EditingProvider, useEditingItem } from '../../contexts/EditingContext.tsx';
import { useResizableSidebar } from '../../hooks/useResizableSidebar.ts';
import { useLiftEditorDirty } from '../../hooks/useLiftEditorDirty.ts';

const SIDE: Side = 'right';
const PANE_W = 420,
  STAGE_H = 560;
const DEMO_ID = 'NMR:VehicleType:1';

/**
 * Breakpoints pushed past any real viewport so `down('sm')` always matches —
 * forces the Drawer branch deterministically in `test:stories`, independent
 * of the iframe width. The `viewport` global only makes it *look* right in
 * the manager.
 */
const MOBILE_THEME = createTheme({
  breakpoints: { values: { xs: 0, sm: 100_000, md: 100_001, lg: 100_002, xl: 100_003 } },
});

type Layout = 'desktop' | 'mobile';

interface StageArgs {
  layout: Layout;
  /** Editor opens with unsaved changes → every close path must prompt. */
  dirty: boolean;
  mode: 'view' | 'edit';
}

/** Stand-in editor: a couple of fields + the real EditorRail, dirty lifted like the features do. */
function DemoEditor({ dirty: initDirty, mode: initMode }: Omit<StageArgs, 'layout'>) {
  const { setEditingItem } = useEditingItem();
  const [mode, setMode] = useState(initMode);
  const [name, setName] = useState(initDirty ? 'FLIRT 74 (edited)' : 'FLIRT 74');
  const isDirty = name !== 'FLIRT 74';
  useLiftEditorDirty(isDirty);

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Typography variant="h6">{DEMO_ID}</Typography>
      <TextField
        label="Name"
        value={name}
        disabled={mode === 'view'}
        onChange={e => setName(e.target.value)}
      />
      <TextField label="Transport mode" value="rail" disabled />
      <EditorRail
        side={SIDE}
        mode={mode}
        isDirty={isDirty}
        onCollapse={() => setEditingItem(null)}
        onEnterEdit={() => setMode('edit')}
        onCancelEdit={() => {
          setName('FLIRT 74');
          setMode('view');
        }}
        onSave={() => setName('FLIRT 74')}
      />
    </Stack>
  );
}

/**
 * Mirrors GenericDataViewPage's chrome: the resizable pane collapse follows
 * `editingItem`, and the rail vars are published on the page box.
 */
function Stage({ layout, dirty, mode }: StageArgs) {
  const base = useTheme();
  const theme = layout === 'mobile' ? MOBILE_THEME : base;
  const { editingItem, setEditingItem } = useEditingItem();
  const { width, collapsed, setIsResizing, toggle } = useResizableSidebar(PANE_W, true, SIDE);

  const open = () =>
    setEditingItem({
      id: DEMO_ID,
      EditorComponent: () => <DemoEditor dirty={dirty} mode={mode} />,
    });

  useEffect(open, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!!editingItem === collapsed) toggle();
  }, [editingItem, collapsed, toggle]);

  return (
    <Box
      sx={{
        position: 'relative',
        height: STAGE_H,
        '--sidebar-width': collapsed ? '0px' : `${width}px`,
        '--app-header-height': '0px',
      }}
    >
      <Sidebar
        width={width}
        collapsed={collapsed}
        onMouseDownResize={() => setIsResizing(true)}
        theme={theme}
        side={SIDE}
      />
      <Stack spacing={2} sx={{ p: 2, mr: editingItem ? `${RAIL_W}px` : 0 }}>
        <Typography data-testid="stage-selection">
          {editingItem ? `Selected: ${editingItem.id}` : 'No selection'}
        </Typography>
        {!editingItem && (
          <Button variant="contained" onClick={open} sx={{ alignSelf: 'start' }}>
            Reopen editor
          </Button>
        )}
      </Stack>
    </Box>
  );
}

const meta = {
  title: 'Sidebar/Sidebar',
  parameters: { layout: 'fullscreen' },
  argTypes: {
    layout: { control: 'inline-radio', options: ['desktop', 'mobile'] },
    mode: { control: 'inline-radio', options: ['view', 'edit'] },
  },
  args: { layout: 'desktop', dirty: false, mode: 'view' },
  render: args => (
    // `key` remounts on arg change so the editor re-seeds from the new args.
    <EditingProvider key={JSON.stringify(args)}>
      <Stage {...args} />
    </EditingProvider>
  ),
} satisfies Meta<StageArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Body lives in a portal on mobile (Drawer) — query the whole document. */
const body = () => within(document.body);

const collapse = () => userEvent.click(body().getByTestId('editor-rail-collapse'));

const expectClosed = () =>
  waitFor(() => expect(body().getByTestId('stage-selection')).toHaveTextContent('No selection'));

/** Waits out the Dialog fade-in — visible, not merely mounted. */
const expectDiscardPrompt = () =>
  waitFor(() => expect(body().getByText('Discard unsaved changes?')).toBeVisible());

/** Resizable inline pane; rail on its content-facing edge. Rail collapse clears the selection. */
export const Desktop: Story = {
  play: async () => {
    await collapse();
    await expectClosed();
  },
};

/** Dirty desktop editor: rail collapse prompts before discarding. */
export const DesktopDirty: Story = {
  args: { dirty: true, mode: 'edit' },
  play: async () => {
    await collapse();
    await expectDiscardPrompt();
    await userEvent.click(body().getByRole('button', { name: 'Discard' }));
    await expectClosed();
  },
};

/**
 * Full-width temporary Drawer. The EditorRail pins to the paper's top edge
 * and is the only close control; Escape runs the same guarded flow.
 */
export const Mobile: Story = {
  args: { layout: 'mobile' },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async () => {
    await userEvent.keyboard('{Escape}');
    await expectClosed();
  },
};

/** Mobile rail collapse — the path Copilot flagged on #179 — clears `selected`. */
export const MobileRailCollapse: Story = {
  args: { layout: 'mobile' },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async () => {
    await collapse();
    await expectClosed();
  },
};

/** Dirty mobile editor: Escape prompts instead of silently closing the Drawer. */
export const MobileDirty: Story = {
  args: { layout: 'mobile', dirty: true, mode: 'edit' },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async () => {
    await userEvent.keyboard('{Escape}');
    await expectDiscardPrompt();
    await userEvent.click(body().getByRole('button', { name: 'Cancel' }));
    await expect(body().getByTestId('stage-selection')).toHaveTextContent(`Selected: ${DEMO_ID}`);
  },
};
