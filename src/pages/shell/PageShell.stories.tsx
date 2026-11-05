import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Paper, Typography } from '@mui/material';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PageShell from './PageShell.tsx';
import CollectionShell from './CollectionShell.tsx';
import EntityDetailsShell from './EntityDetailsShell.tsx';
import { withOrganisations } from '../../contexts/mockOrganisations.tsx';

const LIST = '/next/things';

/** Stand-in for whatever a route renders into a shell slot. */
function Standin({ text }: { text: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, flex: 1, height: '100%', boxSizing: 'border-box' }}>
      <Typography variant="caption" color="text.secondary">
        {text}
      </Typography>
    </Paper>
  );
}

/** Mount `child` under the `/next` layout route at `entry`. */
function AtRoute({ entry, path, child }: { entry: string; path: string; child: React.ReactNode }) {
  return (
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/next" element={<PageShell />}>
          <Route path={path} element={child} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

const meta: Meta<typeof PageShell> = {
  title: 'pages/shell',
  component: PageShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Page shell (#253): `PageShell` is the `/next` layout route — full height, left-aligned `lg` Container, `<Outlet/>`. `CollectionShell` and `EntityDetailsShell` fill the outlet. Grey papers are stand-ins for the slot content.',
      },
    },
  },
  // EntityDetailsShell keys its editor on the current organisation.
  decorators: [withOrganisations()],
};
export default meta;

type Story = StoryObj<typeof PageShell>;

/** The outer frame alone: the Outlet holds a stand-in page. */
export const Outer: Story = {
  render: () => (
    <AtRoute
      entry="/next/things"
      path="things"
      child={<Standin text="<Outlet/> — routed page" />}
    />
  ),
};

const collection = (state: { loading?: boolean; error?: string | null; empty?: boolean }) => (
  <AtRoute
    entry={LIST}
    path="things"
    child={
      <CollectionShell
        titleKey="vehicleType.title"
        subtitle="Mock Org · Total entries: 3"
        loading={state.loading ?? false}
        error={state.error ?? null}
        actions={<Button variant="contained">New</Button>}
        empty={state.empty ? <Standin text="empty state — message + New" /> : undefined}
      >
        <Standin text="collection body — EntityCollection (#252 pri 2)" />
      </CollectionShell>
    }
  />
);

/** CollectionShell with its body: title row + actions, list stand-in. */
export const Collection: Story = { render: () => collection({}) };

/** CollectionShell while the list loads. */
export const CollectionLoading: Story = { render: () => collection({ loading: true }) };

/** CollectionShell with no rows: the host's empty state replaces the body. */
export const CollectionEmpty: Story = { render: () => collection({ empty: true }) };

/** CollectionShell when the list read failed. */
export const CollectionError: Story = {
  render: () => collection({ error: 'Network request failed' }),
};

const details = (entry: string) => (
  <AtRoute
    entry={entry}
    path="things/:id"
    child={
      <EntityDetailsShell
        listPath={LIST}
        renderEditor={host => (
          <Standin
            text={`entity editor — id: ${host.id || '(create)'} · editOnly: ${String(host.editOnly)}`}
          />
        )}
      />
    }
  />
);

/** EntityDetailsShell on a record deep link: view mode. */
export const Details: Story = { render: () => details(`${LIST}/NMR:Thing:1`) };

/** EntityDetailsShell at `/new`: the create pane, edit mode. */
export const DetailsCreate: Story = { render: () => details(`${LIST}/new`) };
