import { useEffect, useReducer, useRef, useState } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NetexId from '../../netex/NetexId.tsx';
import TransportModeIcon from '../../../components/icons/TransportModeIcon.tsx';
import EditorRail from '../../../components/sidebar/EditorRail.tsx';
import { FormLayout, MetaRow } from '../../../components/FormLayout.tsx';
import { VEHICLE_SELECTED_PARAM } from '../utils/vehicleUrlParams.ts';
import { vehicleMode, type Vehicle } from '../types/vehicle.ts';
import { UNKNOWN_TRANSPORT_MODE } from '../../netex/transportMode.ts';
import { fetchVehicleById } from '../api/fetchVehicles.ts';
import VehicleEditForm from './VehicleEditForm.tsx';
import VehicleDetailsSkeleton from './VehicleDetailsSkeleton.tsx';
import SaveErrorSnackbar from '../../../components/feedback/SaveErrorSnackbar.tsx';
import SaveSuccessSnackbar from '../../../components/feedback/SaveSuccessSnackbar.tsx';
import { useVehiclePairSave } from '../hooks/useVehiclePairSave.ts';
import { useDirtyFormBlock } from '../../../hooks/useDirtyFormBlock.ts';
import { useLiftEditorDirty } from '../../../hooks/useLiftEditorDirty.ts';
import { useCloseSliderParam } from '../../../hooks/useCloseSliderParam.ts';
import { useSidebarCreateAdvance } from '../../../hooks/useSidebarCreateAdvance.ts';
import { useEntityRecord } from '../../../hooks/useEntityRecord.ts';
import { NEW_SELECTION } from '../../../hooks/useUrlEditorSelection.tsx';
import { graphqlErrMsg } from '../../graphqlErrMsg.ts';
import { commitSave } from '../../../utils/commitSave.ts';
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
  /** Vehicle netexId to load, or `NEW_SELECTION` for the create pane. */
  id: string;
  /**
   * List-side refetch fired after a successful save so the row on `/vehicles`
   * reflects the new registrationNumber/name/version before the success
   * snackbar appears. Optional — callers without a list channel can omit.
   */
  onSaved?: () => Promise<void>;
  mode?: 'view' | 'edit';
}

/**
 * Sidebar editor for a Vehicle, opened via `/vehicles?selected=<id>`. Loads
 * its record from Sobek by id ({@link useEntityRecord}) — on open and again
 * after a save — and stays mounted across `?selected=` changes, resetting
 * itself whenever the id moves.
 *
 * @param {string} id Vehicle netexId, or `NEW_SELECTION` for the create pane.
 * @param {() => Promise<void>} [onSaved] Optional list refetch run after a successful save.
 * @param {'view' | 'edit'} [mode] Initial mode.
 * @returns {JSX.Element} The editor, its loading skeleton, or the not-found body.
 */
export default function VehicleDetails({ id, onSaved, mode: initialMode }: VehicleDetailsProps) {
  const { t } = useTranslation();
  const isCreate = id === NEW_SELECTION;
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode ?? 'view');
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const { form } = formState;
  const setForm = (next: VehicleEditFormValue) => dispatch({ type: 'edit', form: next });
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [commitError, setCommitError] = useState<string | null>(null);
  const { save, saving, error, clearError } = useVehiclePairSave();
  const { deactivate } = useVehicleDeactivate();
  const [deactivatedOK, setDeactivatedOK] = useState(false);

  const record = useEntityRecord(isCreate ? null : id, fetchVehicleById);

  // The editor outlives `?selected=` changes: reset per id. A create advancing
  // to its new id keeps the success snackbar it just raised.
  const prevIdRef = useRef(id);
  useEffect(() => {
    const prevId = prevIdRef.current;
    if (prevId === id) return;
    prevIdRef.current = id;
    setMode(initialMode ?? 'view');
    if (prevId !== NEW_SELECTION) setSavedAt(null);
    setCommitError(null);
    setDeactivatedOK(false);
    if (id === NEW_SELECTION) dispatch({ type: 'hydrate', xmlVehicle: null });
  }, [id, initialMode]);

  // Baseline = Sobek's record, on open and after every post-save re-fetch.
  useEffect(() => {
    if (record.data) dispatch({ type: 'hydrate', xmlVehicle: record.data });
  }, [record.data]);

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
    try {
      setDeactivatedOK(true);
      await onSaved?.();
      setCommitError(null);
    } catch {
      setCommitError(t('vehicle.deactivateStaleList'));
    }
  };

  const handleSave = async () => {
    const wasCreate = (form.vehicle.id ?? '') === '';
    const result = await commitSave(save, form, onSaved);
    if (result.error) return;

    if (wasCreate) {
      // Sobek's mutation must mint a newId on create; null here = invariant
      // break. Re-baselining with id='' would let the next Edit→Save fire
      // CREATE again and mint a duplicate.
      if (!result.newId) {
        setCommitError(t('common.saveNoIdReturned'));
        return;
      }
      // Re-baseline the form with the assigned id so isDirty=false immediately,
      // bridging until the URL advance below fetches the created record.
      dispatch({
        type: 'hydrate',
        xmlVehicle: { ...form.vehicle, id: result.newId, version: 1 },
      });
      // Advance ?selected=new → ?selected=<newId>; the by-id fetch then lands
      // the real version.
      advanceCreated(result.newId);
    } else {
      // Existing row — re-pull the persisted vehicle so the `hydrate` effect
      // advances the dirty baseline (and picks up the bumped version). Without
      // this the form stays dirty after save and `>>` wrongly raises the
      // discard dialog. The write is real even if the re-pull fails.
      try {
        await record.refetch();
      } catch (err) {
        setMode('view');
        setCommitError(graphqlErrMsg(err));
        return;
      }
    }
    setSavedAt(Date.now());
    setMode('view');
  };

  // Until Sobek's record lands, a form that already holds this id (the
  // post-create bridge) stays up; otherwise skeleton, or not-found.
  const hasRecord = isCreate || record.data !== null || (form.vehicle.id ?? '') === id;

  if (!hasRecord && (record.notFound || record.error)) {
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

  if (!hasRecord) {
    return (
      <>
        <VehicleDetailsSkeleton />
        <EditorRail onCollapse={closeSlider} side={RAIL_SIDE} />
      </>
    );
  }

  const trimmedName = form.vehicle.name?.value?.trim();
  const parentType = record.data?.transportType;
  const tmode = record.data ? vehicleMode(record.data) : UNKNOWN_TRANSPORT_MODE;

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
            <span>{parentType?.name?.value ?? '—'}</span>
            {parentType?.id && <NetexId id={parentType.id} copy="only" size="medium" />}
          </Stack>
        </MetaRow>
        <MetaRow label={t('vehicles.field.parentTransportMode')}>
          <TransportModeIcon mode={tmode} iconPosition="left" />
        </MetaRow>
      </FormLayout>
      <Divider sx={{ mb: 2 }} />

      <VehicleEditForm value={form} onChange={setForm} mode={mode} />

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
        open={deactivatedOK}
        message={t('vehicles.deactivateSuccess')}
        onClose={closeSlider}
      />
      <EditorRail
        side={RAIL_SIDE}
        onCollapse={closeSlider}
        mode={mode}
        onEnterEdit={() => !deactivatedOK && setMode('edit')}
        onDeactivate={handleDeactivate}
        deactivateConfirmTitle={t('vehicle.deactivateConfirmTitle')}
        deactivateConfirmMessage={t('vehicle.deactivateConfirmMessage')}
        deactivateConfirmActionLabel={t('common.deactivate')}
        onCancelEdit={() => {
          dispatch({ type: 'hydrate', xmlVehicle: record.data });
          setMode('view');
        }}
        onSave={handleSave}
        isDirty={isDirty}
        saving={saving}
        // Block create-with-no-TransportTypeRef: Sobek's vehicles() resolver
        // silently excludes refless vehicles from the list (create-but-invisible).
        // Existing rows already carry a ref, so only the create flow needs the gate.
        canSubmit={(form.vehicle.id ?? '') !== '' || canSubmit(form)}
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
