import { Stack } from '@mui/material';
import EditorFrame, { type EditorCopy } from '../../../components/sidebar/EditorFrame.tsx';
import { useEntityEditor, type EntityEditorHostProps } from '../../../hooks/useEntityEditor.ts';
import { createFormState } from '../../../hooks/useFormState.ts';
import { deactivateVehicleTypeRequest } from '../../../graphql/vehicles/mutations/deactivateVehicleType.ts';
import { fetchVehicleType } from '../api/fetchVehicleTypes.ts';
import { useVehicleTypeSave } from '../hooks/useVehicleTypeSave.ts';
import VehicleTypeForm from './VehicleTypeForm.tsx';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';
import { useCodeValues } from '../../code-values/hooks/useCodeValues.ts';
import { EMISSION_STANDARD } from '../../code-values/types/codeValueTypes.ts';

const EMPTY_VTYPE: VehicleType = { id: '', version: 0 };
const SKELETON_ROWS = 8;

const COPY: EditorCopy = {
  title: 'vehicleType.detailsTitle',
  notFound: 'vehicleType.notFound',
  saved: 'vehicleType.saveSuccess',
  deactivated: 'vehicleType.deactivateSuccess',
  deactivateTitle: 'vehicleType.deactivateConfirmTitle',
  deactivateMessage: 'vehicleType.deactivateConfirmMessage',
};

/**
 * Coerce flag booleans so a Switch's `false` (off) compares equal to an absent
 * baseline (a null-backed flag projects to `undefined`). Without this, toggling
 * a null-baseline `lowFloor`/`selfPropelled` on then off reads as dirty.
 */
const vehicleTypeForm = createFormState<VehicleType, VehicleType>({
  blank: EMPTY_VTYPE,
  formFromSource: vt => vt ?? EMPTY_VTYPE,
  normalise: vt => ({
    ...vt,
    lowFloor: vt.lowFloor || undefined,
    selfPropelled: vt.selfPropelled || undefined,
  }),
});

/**
 * Editable sidebar for a VehicleType, opened via `/vehicle-types?selected=<id>`:
 * the shared {@link useEntityEditor} + {@link EditorFrame} around a tabbed
 * {@link VehicleTypeForm}. Save fires `createOrUpdateVehicleType` via
 * {@link useVehicleTypeSave}.
 *
 * @param host Id, initial mode and the host's list reload / URL writes.
 */
export default function VehicleTypeDetails(host: EntityEditorHostProps) {
  const { save } = useVehicleTypeSave();
  // Fetched on the first editor open of the session, cached for every later one.
  const euroClasses = useCodeValues(EMISSION_STANDARD);
  const editor = useEntityEditor({
    ...host,
    fetchById: fetchVehicleType,
    formState: vehicleTypeForm,
    write: form => save(form),
    withNewId: (form, newId) => ({ ...form, id: newId, version: 1 }),
    deactivateRequest: deactivateVehicleTypeRequest,
  });
  const { form } = editor;

  return (
    <EditorFrame
      editor={editor}
      entity={form}
      testId="vehicle-type"
      copy={COPY}
      skeleton={SKELETON_ROWS}
    >
      <Stack data-testid="vehicle-type-context">
        <VehicleTypeForm
          value={form}
          onChange={editor.setForm}
          mode={editor.rail.mode}
          euroClasses={euroClasses}
        />
      </Stack>
    </EditorFrame>
  );
}
