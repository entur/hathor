import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FormLayoutSkeleton from '../../../components/FormLayoutSkeleton.tsx';
import {
  EntityEditorBody,
  EntityEditorFrame,
  type EntityEditorProps,
} from '../../../components/entity-editor/EntityEditorFrame.tsx';
import { useEntityRecord } from '../../../hooks/useEntityRecord.ts';
import { useEntityEditor, type EntityEditorApi } from '../../../hooks/useEntityEditor.ts';
import { fetchVehicleTypeById } from '../api/fetchVehicleTypes.ts';
import { useVehicleTypeSave } from '../hooks/useVehicleTypeSave.ts';
import { useVehicleTypeDeactivate } from '../hooks/useVehicleTypeDeactivate.ts';
import { useCodeValues } from '../../code-values/hooks/useCodeValues.ts';
import { EMISSION_STANDARD, type CodeValue } from '../../code-values/types/codeValueTypes.ts';
import VehicleTypeForm from './VehicleTypeForm.tsx';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';

const EMPTY_VTYPE: VehicleType = { id: '', version: 0 };
// A created vehicle type's first version, shown until Sobek's record lands.
const CREATED_VERSION = 1;
const SKELETON_ROWS = 6;

const toForm = (record: VehicleType | null): VehicleType => record ?? EMPTY_VTYPE;

const withNewId = (form: VehicleType, newId: string): VehicleType => ({
  ...form,
  id: newId,
  version: CREATED_VERSION,
});

/**
 * Coerce flag booleans so a Switch's `false` (off) compares equal to an absent
 * baseline (a null-backed flag projects to `undefined`). Without this, toggling
 * a null-baseline `lowFloor`/`selfPropelled` on then off reads as dirty.
 */
const normalizeForDirty = (vt: VehicleType): VehicleType => ({
  ...vt,
  lowFloor: vt.lowFloor || undefined,
  selfPropelled: vt.selfPropelled || undefined,
});

/**
 * Host-agnostic VehicleType editor: loads the record by id
 * ({@link useEntityRecord}) and drives the tabbed {@link VehicleTypeForm} with
 * {@link useEntityEditor} inside the shared {@link EntityEditorFrame} — title,
 * the form and its save / deactivate snackbars. Save fires
 * `createOrUpdateVehicleType` ({@link useVehicleTypeSave}). The host supplies
 * navigation (`onClose`, `onCreated`) and its controls through `actions(api)`.
 *
 * @param {EntityEditorProps<VehicleType, VehicleType>} props - Id, host callbacks and `actions`.
 * @returns {JSX.Element} The editor, its loading skeleton, or the load-error / not-found body.
 */
export default function VehicleTypeEditor({
  id,
  onClose,
  onCreated,
  onWritten,
  actions,
}: EntityEditorProps<VehicleType, VehicleType>) {
  const { t } = useTranslation();
  const record = useEntityRecord(id, fetchVehicleTypeById);
  const { save } = useVehicleTypeSave();
  const { deactivate } = useVehicleTypeDeactivate();
  // Fetched on the first editor open of the session, cached for every later one.
  const euroClasses = useCodeValues(EMISSION_STANDARD);

  const api = useEntityEditor<VehicleType, VehicleType>({
    id,
    record,
    toForm,
    normalise: normalizeForDirty,
    withNewId,
    save,
    deactivate,
    onClose,
    onCreated,
    onWritten,
  });

  return (
    <EntityEditorFrame
      id={id}
      api={api}
      record={record}
      labels={{
        detailsTitle: t('vehicleType.detailsTitle'),
        notFound: t('vehicleType.notFound'),
        saved: t('vehicleType.saveSuccess'),
        deactivated: t('vehicleType.deactivateSuccess'),
      }}
      skeleton={
        <FormLayoutSkeleton
          ariaLabel={t('data.loading')}
          showTitle
          sections={[{ rowCount: SKELETON_ROWS }]}
        />
      }
      actions={actions}
    >
      <VehicleTypeFormBody api={api} euroClasses={euroClasses} />
    </EntityEditorFrame>
  );
}

interface VehicleTypeFormBodyProps {
  api: EntityEditorApi<VehicleType>;
  /** Emission-class choices (Sobek `EMISSION_STANDARD` code list). */
  euroClasses: readonly CodeValue[];
}

/** The editor body with a form: title, NeTEx id and the tabbed fields. */
function VehicleTypeFormBody({ api, euroClasses }: VehicleTypeFormBodyProps) {
  const { form } = api;
  return (
    <EntityEditorBody
      name={form.name?.value}
      netexId={form.id}
      version={form.version}
      titleTestId="vehicle-type-details-title"
    >
      <Stack data-testid="vehicle-type-context">
        <VehicleTypeForm
          value={form}
          onChange={api.setForm}
          mode={api.mode}
          euroClasses={euroClasses}
        />
      </Stack>
    </EntityEditorBody>
  );
}
