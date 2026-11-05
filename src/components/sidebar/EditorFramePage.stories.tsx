import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, within } from 'storybook/test';
import { Typography } from '@mui/material';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import EditorFrame from './EditorFrame.tsx';
import PageShell from '../../pages/shell/PageShell.tsx';
import EntityDetailsShell from '../../pages/shell/EntityDetailsShell.tsx';
import { withOrganisations } from '../../contexts/mockOrganisations.tsx';
import { ConfigContext, useConfig } from '../../contexts/configContext.ts';
import { EditingProvider } from '../../contexts/EditingContext.tsx';
import { useEntityEditor, type EntityEditorHostProps } from '../../hooks/useEntityEditor.ts';
import { createFormState } from '../../hooks/useFormState.ts';
import VehicleTypeSections from '../../data/vehicle-types/components/VehicleTypeSections.tsx';
import type { VehicleType } from '../../data/vehicle-types/types/vehicleTypeTypes.ts';

const LIST = '/next/things';
const SAVE_MS = 900; // fake round trip, long enough to see the Saving state
const CREATED_ID = 'NMR:VehicleType:2';

const meta: Meta = {
  title: 'components/editorFrame/fullpage',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '`EditorFrame` on a form page (#280): `PageShell` → `EntityDetailsShell` (`EditorHostContext` = page) → the frame around the real `VehicleTypeSections`. The record read and save hit an in-memory store, not Sobek. The sidebar version is `components/editorFrame/modal`.',
      },
    },
  },
  // EntityDetailsShell keys its editor on the current organisation.
  decorators: [withOrganisations()],
};
export default meta;

type Story = StoryObj;

const VT: VehicleType = {
  id: 'NMR:VehicleType:1',
  version: 3,
  name: { value: 'Solaris Urbino 12 electric' },
  shortName: { value: 'Urbino 12e' },
  transportMode: 'BUS',
  length: 12,
  width: 2.55,
  height: 3.3,
  lowFloor: true,
  propulsionTypes: ['ELECTRIC'],
  fuelTypes: ['BATTERY'],
  passengerCapacity: { totalCapacity: 90, seatingCapacity: 30, standingCapacity: 60 },
};
/** Stands in for Sobek: a save lands here, so a create's redirect reads it back. */
const store = new Map([[VT.id, VT]]);

const vtForm = createFormState<VehicleType, VehicleType>({
  blank: { id: '', version: 0 },
  formFromSource: vt => vt ?? { id: '', version: 0 },
});

/** `VehicleTypeDetails` on its form page, with the in-memory store in place of Sobek. */
function StoryVehicleTypeDetails(host: EntityEditorHostProps) {
  const editor = useEntityEditor({
    ...host,
    fetchById: async id => store.get(id) ?? null,
    formState: vtForm,
    write: form =>
      new Promise(done =>
        setTimeout(() => {
          const id = form.id || CREATED_ID;
          store.set(id, { ...form, id });
          done({ error: null, newId: id });
        }, SAVE_MS)
      ),
    withNewId: (form, id) => ({ ...form, id, version: 1 }),
    deactivateRequest: async () => {},
  });
  const { form } = editor;
  return (
    <EditorFrame
      editor={editor}
      entity={form}
      testId="vehicle-type"
      copy={{
        title: 'vehicleType.detailsTitle',
        notFound: 'vehicleType.notFound',
        saved: 'vehicleType.saveSuccess',
        deactivated: 'vehicleType.deactivateSuccess',
        deactivateTitle: 'vehicleType.deactivateConfirmTitle',
        deactivateMessage: 'vehicleType.deactivateConfirmMessage',
      }}
      skeleton={8}
    >
      <VehicleTypeSections
        value={form}
        onChange={editor.setForm}
        mode={editor.rail.mode}
        euroClasses={[]}
        isCreate={editor.isCreate}
      />
    </EditorFrame>
  );
}

/** The record read needs a base URL; the store ignores it. */
function WithBaseUrl({ children }: { children: ReactNode }) {
  return (
    <ConfigContext.Provider value={{ ...useConfig(), applicationBaseUrl: 'story://sobek' }}>
      {children}
    </ConfigContext.Provider>
  );
}

/** `/next/things/:id` under the real page shell, in a data router (the page's
 *  `LeaveGuard` needs one); `/next/things` stands in for the collection Back returns to. */
function FormPage({ entry }: { entry: string }) {
  const [router] = useState(() =>
    createMemoryRouter(
      [
        {
          path: '/next',
          element: <PageShell />,
          children: [
            { path: 'things', element: <Typography>Collection page</Typography> },
            {
              path: 'things/:id',
              element: (
                <EntityDetailsShell
                  listPath={LIST}
                  renderEditor={host => <StoryVehicleTypeDetails {...host} />}
                />
              ),
            },
          ],
        },
      ],
      { initialEntries: [entry] }
    )
  );
  return (
    <WithBaseUrl>
      <EditingProvider>
        <RouterProvider router={router} />
      </EditingProvider>
    </WithBaseUrl>
  );
}

/** A record opens ready to edit: Back / Deactivate in the title row, Save / Cancel inert in the
 *  sticky footer until a field changes; Save settles after a beat and keeps editing. */
export const Edit: Story = { render: () => <FormPage entry={`${LIST}/${VT.id}`} /> };

/** After a confirmed Deactivate: red "Deactivated" in the title row, fields frozen, no footer. */
export const Deactivated: Story = {
  render: () => <FormPage entry={`${LIST}/${VT.id}`} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByTestId('editor-page-deactivate'));
    const dialog = within(await screen.findByRole('dialog'));
    await userEvent.click(dialog.getByRole('button', { name: 'Deactivate' }));
    await expect(await canvas.findByTestId('editor-page-deactivated')).toBeVisible();
  },
};

/** A create at `/new`: blank form, no Vehicles section, no NetexId; Save redirects to the new id. */
export const Create: Story = { render: () => <FormPage entry={`${LIST}/new`} /> };
