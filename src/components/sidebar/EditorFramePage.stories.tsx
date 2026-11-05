import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, within } from 'storybook/test';
import EditorFrame from './EditorFrame.tsx';
import { FormPage, STORY_SAVE_MS } from './formPageStory.tsx';
import { withOrganisations } from '../../contexts/mockOrganisations.tsx';
import { withSobekUrl } from '../../contexts/mockSobek.tsx';
import { useEntityEditor, type EntityEditorHostProps } from '../../hooks/useEntityEditor.ts';
import { createFormState } from '../../hooks/useFormState.ts';
import VehicleTypeSections from '../../data/vehicle-types/components/VehicleTypeSections.tsx';
import type { VehicleType } from '../../data/vehicle-types/types/vehicleTypeTypes.ts';

const CREATED_ID = 'NMR:VehicleType:2';

const meta: Meta = {
  title: 'components/editorFrame/fullpage/vehicle-types',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '`EditorFrame` on a form page (#280): `PageShell` → `EntityDetailsShell` (`EditorHostContext` = page) → the frame around the real `VehicleTypeSections`. The record read and save hit an in-memory store, not Sobek. Vehicles: `…/fullpage/vehicles`; the sidebar version is `components/editorFrame/modal`.',
      },
    },
  },
  // EntityDetailsShell keys its editor on the current organisation; the read needs a base URL.
  decorators: [withSobekUrl(), withOrganisations()],
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
        }, STORY_SAVE_MS)
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

const vtEditor = (host: EntityEditorHostProps) => <StoryVehicleTypeDetails {...host} />;

/** A record opens ready to edit: Back / Deactivate in the title row, Save / Cancel inert in the
 *  sticky footer until a field changes; Save settles after a beat and keeps editing. */
export const Edit: Story = {
  render: () => <FormPage entity="vehicle-types" id={VT.id} renderEditor={vtEditor} />,
};

/** After a confirmed Deactivate: red "Deactivated" in the title row, fields frozen, no footer. */
export const Deactivated: Story = {
  render: () => <FormPage entity="vehicle-types" id={VT.id} renderEditor={vtEditor} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByTestId('editor-page-deactivate'));
    const dialog = within(await screen.findByRole('dialog'));
    await userEvent.click(dialog.getByRole('button', { name: 'Deactivate' }));
    await expect(await canvas.findByTestId('editor-page-deactivated')).toBeVisible();
  },
};

/** A create at `/new`: blank form, no Vehicles section, no NetexId; Save redirects to the new id. */
export const Create: Story = {
  render: () => <FormPage entity="vehicle-types" id="new" renderEditor={vtEditor} />,
};
