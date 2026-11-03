import { useEffect, useReducer, useState } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NetexId from '../../../components/NetexId.tsx';
import TransportModeIcon from '../../../components/icons/TransportModeIcon.tsx';
import EditorRail from '../../../components/sidebar/EditorRail.tsx';
import { FormLayout, MetaRow } from '../../../components/FormLayout.tsx';
import { VEHICLE_SELECTED_PARAM } from '../utils/vehicleUrlParams.ts';
import { vehicleMode, type Vehicle } from '../types/vehicle.ts';
import VehicleEditForm from './VehicleEditForm.tsx';
import VehicleDetailsSkeleton from './VehicleDetailsSkeleton.tsx';
import SaveErrorSnackbar from '../../../components/feedback/SaveErrorSnackbar.tsx';
import SaveSuccessSnackbar from '../../../components/feedback/SaveSuccessSnackbar.tsx';
import { useEntityRecord } from '../../../hooks/useEntityRecord.ts';
import { fetchVehicle } from '../api/fetchVehicles.ts';
import { useVehiclePairSave } from '../hooks/useVehiclePairSave.ts';
import { useDirtyFormBlock } from '../../../hooks/useDirtyFormBlock.ts';
import { useLiftEditorDirty } from '../../../hooks/useLiftEditorDirty.ts';
import { useCloseSliderParam } from '../../../hooks/useCloseSliderParam.ts';
import { useSidebarCreateAdvance } from '../../../hooks/useSidebarCreateAdvance.ts';
import {
  edit,
  hydrate,
  initialFormState,
  isDirty as isFormDirty,
  canSubmit,
  type FormState,
} from '../stores/vehicleFormState.ts';
import type { VehicleEditFormValue } from './VehicleEditForm.tsx';
import { useVehicleDeactivate } from '../hooks/useVehicleDeactivate.ts';

const BLANK_NAME = 'unnamed';
const RAIL_SIDE = 'right' as const;

interface VehicleDetailsProps {
  /** NeTEx id to edit; `''` is the create pane. The editor reads the record itself. */
  id: string;
  /**
   * List-side refetch fired after a successful save or deactivate so the row
   * on `/vehicles` is fresh before the success snackbar appears; a rejection
   * shows a stale-list warning instead. Optional — hosts without a list omit it.
   */
  onSaved?: () => Promise<void>;
  mode?: 'view' | 'edit';
}

export default function VehicleDetails({ id, onSaved, mode: initialMode }: VehicleDetailsProps) {
  const { t } = useTranslation();
  const isCreate = id === '';
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode ?? 'view');
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const { form } = formState;
  const setForm = (next: VehicleEditFormValue) => dispatch({ type: 'edit', form: next });
  const [savedAt, setSavedAt] = useState<number | null>(null);
  // True from Save until the post-save re-read + list refresh land; Edit stays
  // hidden so typing can't be overwritten by the re-read's re-baseline.
  const [settling, setSettling] = useState(false);
  const [commitError, setCommitError] = useState<string | null>(null);
  const { save, saving, error, clearError } = useVehiclePairSave();
  const { deactivate } = useVehicleDeactivate();
  // 'stale' = deactivated, list not refreshed (yet): Edit blocked, no green.
  const [deactivated, setDeactivated] = useState<'ok' | 'stale' | null>(null);

  const { data: record, loading, error: fetchError, refetch } = useEntityRecord(id, fetchVehicle);

  // Re-baseline on every read of the record — the first one and each post-save re-read.
  useEffect(() => {
    dispatch({ type: 'hydrate', xmlVehicle: record });
  }, [record]);

  const isDirty = isFormDirty(formState);
  useDirtyFormBlock(isDirty);
  useLiftEditorDirty(isDirty);

  const closeSlider = useCloseSliderParam(VEHICLE_SELECTED_PARAM);
  const advanceCreated = useSidebarCreateAdvance(VEHICLE_SELECTED_PARAM);

  const handleDeactivate = async () => {
    const result = await deactivate(form.vehicle);
    if (result.error) {
      setCommitError(result.error);
      return;
    }
    setMode('view');
    setDeactivated('stale'); // blocks Edit while the list refreshes
    try {
      await onSaved?.();
      setDeactivated('ok');
    } catch {
      setCommitError(t('vehicle.deactivateStaleList'));
    }
  };

  const handleSave = async () => {
    setCommitError(null);
    const result = await save(form);
    if (result.error) return;

    if (isCreate) {
      // Sobek's mutation must mint a newId on create; null here = invariant
      // break. Re-baselining with id='' would let the next Edit→Save fire
      // CREATE again and mint a duplicate.
      if (!result.newId) {
        setCommitError(t('common.saveNoIdReturned'));
        return;
      }
      // Re-baseline on the write so a failing list refresh can't strand the
      // editor dirty.
      dispatch({
        type: 'hydrate',
        xmlVehicle: { ...form.vehicle, id: result.newId, version: 1 },
      });
      setMode('view');
      try {
        await onSaved?.();
        // ?selected=new → ?selected=<newId>: the editor re-mounts on the new id
        // and reads the created record.
        advanceCreated(result.newId);
        setSavedAt(Date.now());
      } catch {
        setCommitError(t('vehicles.saveStaleList'));
      }
      return;
    }

    // Re-baseline on the write too, so a failing re-read can't strand the
    // editor dirty over a persisted save.
    dispatch({ type: 'hydrate', xmlVehicle: form.vehicle });
    setMode('view');
    // "Saved" means the record was re-read: the re-read re-baselines the form
    // (bumped version included). The list refresh runs alongside.
    const [reread, list] = await Promise.allSettled([refetch(), onSaved?.()]);
    if (reread.status === 'rejected') return; // the body shows `fetchError`
    if (list.status === 'rejected') setCommitError(t('vehicles.saveStaleList'));
    else setSavedAt(Date.now());
  };

  if (!isCreate && !record && !loading && !fetchError) {
    return (
      <>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="h6">{t('vehicles.detailsTitle')}</Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('vehicles.notFound')}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ wordBreak: 'break-all' }}>
            {id}
          </Typography>
        </Box>
        <EditorRail onCollapse={closeSlider} side={RAIL_SIDE} />
      </>
    );
  }

  if (loading && !record) {
    return (
      <>
        <VehicleDetailsSkeleton />
        <EditorRail onCollapse={closeSlider} side={RAIL_SIDE} />
      </>
    );
  }

  const trimmedName = form.vehicle.name?.value?.trim();
  const tmode = vehicleMode(record ?? { id: '' });

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <FormLayout sx={{ mb: 1 }}>
        <Typography
          variant="h6"
          noWrap
          title={trimmedName || undefined}
          data-testid="vehicle-details-title"
          sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {trimmedName || (
            <>
              {'[ '}
              <Box
                component="span"
                sx={{
                  color: 'text.disabled',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                }}
              >
                {BLANK_NAME}
              </Box>
              {' ]'}
            </>
          )}
        </Typography>
        {form.vehicle.id && (
          <NetexId
            id={form.vehicle.id}
            version={form.vehicle.version}
            copy="onHover"
            size="small"
            sx={{ justifySelf: 'start' }}
          />
        )}
      </FormLayout>
      <Divider sx={{ mb: 2 }} />

      <FormLayout rowGap={0.5} sx={{ mb: 2 }} data-testid="vehicle-context">
        <MetaRow label={t('vehicles.field.parentVehicleType')}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <span>{record?.transportType?.name?.value ?? '—'}</span>
            {record?.transportType?.id && (
              <NetexId id={record.transportType.id} copy="only" size="medium" />
            )}
          </Stack>
        </MetaRow>
        <MetaRow label={t('vehicles.field.parentTransportMode')}>
          <TransportModeIcon mode={tmode} iconPosition="left" />
        </MetaRow>
      </FormLayout>
      <Divider sx={{ mb: 2 }} />

      {fetchError ? (
        <Typography variant="body2" color="error" sx={{ py: 2 }}>
          {fetchError}
        </Typography>
      ) : (
        <VehicleEditForm value={form} onChange={setForm} mode={mode} />
      )}

      <SaveErrorSnackbar error={error} onClose={clearError} />
      <SaveErrorSnackbar
        error={commitError}
        severity="warning"
        onClose={() => setCommitError(null)}
      />
      <SaveSuccessSnackbar
        open={savedAt !== null}
        message={t('vehicles.saveSuccess')}
        onClose={() => setSavedAt(null)}
      />
      <SaveSuccessSnackbar
        open={deactivated === 'ok'}
        message={t('vehicles.deactivateSuccess')}
        onClose={closeSlider}
      />
      <EditorRail
        side={RAIL_SIDE}
        onCollapse={closeSlider}
        mode={mode}
        // No record (first read failed) → nothing to edit or deactivate.
        onEnterEdit={
          (isCreate || record) && !settling ? () => !deactivated && setMode('edit') : undefined
        }
        onDeactivate={record ? handleDeactivate : undefined}
        deactivateConfirmTitle={t('vehicle.deactivateConfirmTitle')}
        deactivateConfirmMessage={t('vehicle.deactivateConfirmMessage')}
        deactivateConfirmActionLabel={t('common.deactivate')}
        onCancelEdit={() => {
          // Restore the committed baseline, not `record`: after a create whose
          // list reload failed there is no record yet, and re-hydrating from
          // null would drop the assigned id (the next save would mint a duplicate).
          // shortcut: baseline read back from `hydratedKey`; #238 adds a real restore.
          const baseline = JSON.parse(formState.hydratedKey) as VehicleEditFormValue;
          dispatch({ type: 'hydrate', xmlVehicle: baseline.vehicle });
          setMode('view');
        }}
        onSave={() => {
          setSettling(true);
          return handleSave().finally(() => setSettling(false));
        }}
        isDirty={isDirty}
        saving={saving}
        // Block create-with-no-TransportTypeRef: Sobek's vehicles() resolver
        // silently excludes refless vehicles from the list (create-but-invisible).
        // Existing rows already carry a ref, so only the create flow needs the gate.
        canSubmit={!isCreate || canSubmit(form)}
      />
    </Box>
  );
}

type FormAction =
  | { type: 'hydrate'; xmlVehicle: Partial<Vehicle> | null | undefined }
  | { type: 'edit'; form: VehicleEditFormValue };

function formReducer(state: FormState, action: FormAction): FormState {
  return action.type === 'hydrate' ? hydrate(state, action.xmlVehicle) : edit(state, action.form);
}
