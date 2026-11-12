import EditorFrame, { type EditorCopy } from '../../../components/sidebar/EditorFrame.tsx';
import { useEntityEditor, type EntityEditorHostProps } from '../../../hooks/useEntityEditor.ts';
import { createFormState } from '../../../hooks/useFormState.ts';
import { deactivateVehicleTypeRequest } from '../../../graphql/vehicles/mutations/deactivateVehicleType.ts';
import { fetchVehicleType } from '../api/fetchVehicleTypes.ts';
import { useVehicleTypeSave } from '../hooks/useVehicleTypeSave.ts';
import VehicleTypeSections from './VehicleTypeSections.tsx';
import type { VehicleType, VehicleTypeKind } from '../types/vehicleTypeTypes.ts';
import { VEHICLE_TYPE_KIND_CONFIG } from '../utils/vehicleTypeKindConfig.ts';
import { useCodeValues } from '../../code-values/hooks/useCodeValues.ts';
import { EMISSION_STANDARD } from '../../code-values/types/codeValueTypes.ts';
import { vehicleTypeTitle } from '../utils/vehicleTypeTitle.ts';

const EMPTY_VTYPE: VehicleType = { id: '', version: 0 };
const SKELETON_ROWS = 8;

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
 * VehicleType editor: the shared {@link useEntityEditor} + {@link EditorFrame}
 * around {@link VehicleTypeSections} (#280). Save fires `createOrUpdateVehicleType` via
 * {@link useVehicleTypeSave}.
 *
 * @param {EntityEditorHostProps & { kind: VehicleTypeKind }} props Id and the host's list reload / URL writes, plus
 *   the kind (PHYSICAL or CONTRACTUAL) this editor reads and writes.
 * @returns {JSX.Element} The vehicle-type editor pane.
 */
export default function VehicleTypeDetails({
  kind,
  ...host
}: EntityEditorHostProps & { kind: VehicleTypeKind }) {
  const { copy, editorTestId, showVehicles } = VEHICLE_TYPE_KIND_CONFIG[kind];
  const { save } = useVehicleTypeSave(kind);
  // Fetched on the first editor open of the session, cached for every later one.
  const euroClasses = useCodeValues(EMISSION_STANDARD);
  const editor = useEntityEditor({
    ...host,
    fetchById: (id, baseUrl, dataOwnerRef, token) =>
      fetchVehicleType(id, baseUrl, dataOwnerRef, token, kind),
    formState: vehicleTypeForm,
    write: form => save(form),
    withNewId: (form, newId) => ({ ...form, id: newId, version: 1 }),
    deactivateRequest: deactivateVehicleTypeRequest,
  });
  const { form } = editor;
  const body = {
    value: form,
    onChange: editor.setForm,
    mode: editor.actions.mode,
    euroClasses,
  };

  return (
    <EditorFrame
      editor={editor}
      entity={form}
      title={vehicleTypeTitle(form)}
      testId={editorTestId}
      copy={copy satisfies EditorCopy}
      skeleton={SKELETON_ROWS}
    >
      {/* Bare: from `lg` its columns fill the page's height (#293). */}
      <VehicleTypeSections {...body} isCreate={editor.isCreate} showVehicles={showVehicles} />
    </EditorFrame>
  );
}
