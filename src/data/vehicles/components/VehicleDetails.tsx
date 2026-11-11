import EditorFrame, { type EditorCopy } from '../../../components/sidebar/EditorFrame.tsx';
import { useEntityEditor, type EntityEditorHostProps } from '../../../hooks/useEntityEditor.ts';
import { deactivateVehicleRequest } from '../../../graphql/vehicles/mutations/deactivateVehicle.ts';
import VehicleSections from './VehicleSections.tsx';
import VehicleDetailsSkeleton from './VehicleDetailsSkeleton.tsx';
import { fetchVehicle } from '../api/fetchVehicles.ts';
import { useVehiclePairSave } from '../hooks/useVehiclePairSave.ts';
import { canSubmit, vehicleForm } from '../stores/vehicleFormState.ts';
import { vehicleTitle } from '../utils/vehicleTitle.ts';

const COPY: EditorCopy = {
  title: 'vehicles.detailsTitle',
  notFound: 'vehicles.notFound',
  saved: 'vehicles.saveSuccess',
  deactivateTitle: 'vehicle.deactivateConfirmTitle',
  deactivateMessage: 'vehicle.deactivateConfirmMessage',
};

/**
 * Vehicle editor: the shared {@link useEntityEditor} + {@link EditorFrame} around
 * {@link VehicleSections} — the type in the form, and the picture (#285).
 *
 * @param {EntityEditorHostProps} host Id and the host's list reload / URL writes.
 * @returns {JSX.Element} The vehicle editor pane.
 */
export default function VehicleDetails(host: EntityEditorHostProps) {
  const { save } = useVehiclePairSave();
  const editor = useEntityEditor({
    ...host,
    fetchById: fetchVehicle,
    formState: vehicleForm,
    write: form => save(form),
    withNewId: (form, newId) => ({ vehicle: { ...form.vehicle, id: newId, version: 1 } }),
    deactivateRequest: deactivateVehicleRequest,
    // Block create-with-no-TransportTypeRef: Sobek's vehicles() resolver
    // silently excludes refless vehicles from the list (create-but-invisible).
    // Existing rows already carry a ref, so only the create flow needs the gate.
    canSubmit: (form, isCreate) => !isCreate || canSubmit(form),
  });
  const { form } = editor;

  return (
    <EditorFrame
      editor={editor}
      entity={form.vehicle}
      title={vehicleTitle(form.vehicle)}
      testId="vehicle"
      copy={COPY}
      skeleton={<VehicleDetailsSkeleton />}
    >
      <VehicleSections
        value={form.vehicle}
        onChange={vehicle => editor.setForm({ ...form, vehicle })}
        mode={editor.actions.mode}
      />
    </EditorFrame>
  );
}
