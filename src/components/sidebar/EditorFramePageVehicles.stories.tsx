import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import EditorFrame, { type EditorCopy } from './EditorFrame.tsx';
import { FormPage, STORY_SAVE_MS } from './formPageStory.tsx';
import { withOrganisations } from '../../contexts/mockOrganisations.tsx';
import { stubSobek, withSobekUrl } from '../../contexts/mockSobek.tsx';
import { useEntityEditor, type EntityEditorHostProps } from '../../hooks/useEntityEditor.ts';
import VehicleSections from '../../data/vehicles/components/VehicleSections.tsx';
import type { VehicleEditFormValue } from '../../data/vehicles/components/VehicleEditForm.tsx';
import { canSubmit, vehicleForm } from '../../data/vehicles/stores/vehicleFormState.ts';
import type { Vehicle } from '../../data/vehicles/types/vehicle.ts';

// Sobek's wire shape, kept in step with the query by the e2e suite. Globbed: the fixture
// sits outside `src`, so the app's TypeScript project can't import it.
const [vehicleTypesMock] = Object.values(
  import.meta.glob('../../../e2e-tests/fixtures/vehicle-types-mock.json', {
    eager: true,
    import: 'default',
  })
);

const CREATED_ID = 'NMR:Vehicle:2';
const SKELETON_ROWS = 6;

const COPY: EditorCopy = {
  title: 'vehicles.detailsTitle',
  notFound: 'vehicles.notFound',
  saved: 'vehicles.saveSuccess',
  deactivated: 'vehicles.deactivateSuccess',
  deactivateTitle: 'vehicle.deactivateConfirmTitle',
  deactivateMessage: 'vehicle.deactivateConfirmMessage',
};

/** A bus of the mock's `Type Alpha` (10 × 2.5 × 3 m). */
const VEHICLE: Vehicle = {
  id: 'NMR:Vehicle:1',
  version: 2,
  name: { value: 'Bus 4021' },
  registrationNumber: 'EL 12345',
  operationalNumber: '4021',
  transportType: { id: 'NMR:VehicleType:1', name: { value: 'Type Alpha' }, transportMode: 'BUS' },
};
/** Stands in for Sobek's vehicles: a save lands here, so a create's redirect reads it back. */
const store = new Map([[VEHICLE.id, VEHICLE]]);

/** `VehicleDetails` on its form page, with the in-memory store in place of Sobek. */
function StoryVehicleDetails(host: EntityEditorHostProps) {
  const editor = useEntityEditor<Vehicle, VehicleEditFormValue>({
    ...host,
    fetchById: async id => store.get(id) ?? null,
    formState: vehicleForm,
    write: form =>
      new Promise(done =>
        setTimeout(() => {
          const id = form.vehicle.id || CREATED_ID;
          store.set(id, { ...form.vehicle, id });
          done({ error: null, newId: id });
        }, STORY_SAVE_MS)
      ),
    withNewId: (form, id) => ({ vehicle: { ...form.vehicle, id, version: 1 } }),
    deactivateRequest: async () => {},
    canSubmit: (form, isCreate) => !isCreate || canSubmit(form),
  });
  const { form } = editor;
  return (
    <EditorFrame
      editor={editor}
      entity={form.vehicle}
      testId="vehicle"
      copy={COPY}
      skeleton={SKELETON_ROWS}
    >
      <VehicleSections
        value={form.vehicle}
        onChange={vehicle => editor.setForm({ ...form, vehicle })}
        mode={editor.rail.mode}
      />
    </EditorFrame>
  );
}

const vehicleEditor = (host: EntityEditorHostProps) => <StoryVehicleDetails {...host} />;

const meta: Meta = {
  title: 'components/editorFrame/fullpage/vehicles',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "`EditorFrame` on the vehicle form page (#285): `PageShell` → `EntityDetailsShell` → the frame around the real `VehicleSections`, a red bus in the picked type's dims. The record read and save hit an in-memory store; the type list is the e2e mock, answered by `stubSobek`.",
      },
    },
  },
  decorators: [withSobekUrl(), withOrganisations()],
  beforeEach: stubSobek({ vehicleTypes: vehicleTypesMock }),
};
export default meta;

type Story = StoryObj;

/** A record opens ready to edit, drawn in its type's dims; "Open vehicle type" under the picker. */
export const Edit: Story = {
  render: () => <FormPage entity="vehicles" id={VEHICLE.id} renderEditor={vehicleEditor} />,
};

/** A create at `/new`: "Select type" in the picture box, and no Save, until a type is picked. */
export const Create: Story = {
  render: () => <FormPage entity="vehicles" id="new" renderEditor={vehicleEditor} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByTestId('bus-picture-placeholder')).toHaveTextContent(
      'Select type'
    );
  },
};
