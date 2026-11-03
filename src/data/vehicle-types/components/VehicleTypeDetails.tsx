import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditorFrame, { type EditorCopy } from '../../../components/sidebar/EditorFrame.tsx';
import FormLayoutSkeleton from '../../../components/FormLayoutSkeleton.tsx';
import { useEntityEditor, type EditorMode } from '../../../hooks/useEntityEditor.ts';
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

interface VehicleTypeDetailsProps {
  /** NeTEx id to edit; `''` is the create pane. The editor reads the record itself. */
  id: string;
  /**
   * List-side refetch fired after a successful save or deactivate so the row
   * on `/vehicle-types` is fresh before the success snackbar appears; a
   * rejection shows a stale-list warning instead. Optional.
   */
  onSaved?: () => Promise<void>;
  mode?: EditorMode;
  /** Host: collapse the editor. */
  onClose: () => void;
  /** Host: move the selection from the create pane to the new id. */
  onCreated: (newId: string) => void;
}

/**
 * Editable sidebar for a VehicleType, opened via `/vehicle-types?selected=<id>`:
 * the shared {@link useEntityEditor} + {@link EditorFrame} around a tabbed
 * {@link VehicleTypeForm}. Save fires `createOrUpdateVehicleType` via
 * {@link useVehicleTypeSave}.
 *
 * @param props {@link VehicleTypeDetailsProps}
 */
export default function VehicleTypeDetails({
  id,
  onSaved,
  mode,
  onClose,
  onCreated,
}: VehicleTypeDetailsProps) {
  const { t } = useTranslation();
  const { save } = useVehicleTypeSave();
  // Fetched on the first editor open of the session, cached for every later one.
  const euroClasses = useCodeValues(EMISSION_STANDARD);
  const editor = useEntityEditor({
    id,
    initialMode: mode,
    fetchById: fetchVehicleType,
    formState: vehicleTypeForm,
    write: form => save(form),
    withNewId: (form, newId) => ({ ...form, id: newId, version: 1 }),
    deactivateRequest: deactivateVehicleTypeRequest,
    onSaved,
    onClose,
    onCreated,
  });
  const { form } = editor;

  return (
    <EditorFrame
      editor={editor}
      name={form.name?.value}
      netexId={form.id ? { id: form.id, version: form.version } : undefined}
      testId="vehicle-type"
      copy={COPY}
      skeleton={
        <FormLayoutSkeleton
          ariaLabel={t('data.loading')}
          showTitle
          sections={[{ rowCount: SKELETON_ROWS, stacked: true }]}
        />
      }
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
