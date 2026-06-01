import { useEffect, useReducer, useState } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import NetexId from '../../netex/NetexId.tsx';
import EditorRail from '../../../components/sidebar/EditorRail.tsx';
import { FormLayout } from '../../../components/FormLayout.tsx';
import SaveSuccessSnackbar from '../../../components/feedback/SaveSuccessSnackbar.tsx';
import { useDirtyFormBlock } from '../../../hooks/useDirtyFormBlock.ts';
import { useEditorDirty } from '../../../contexts/EditingContext.tsx';
import { VEHICLE_TYPE_SELECTED_PARAM } from '../utils/vehicleTypeUrlParams.ts';
import VehicleTypeForm from './VehicleTypeForm.tsx';
import type { VehicleType } from '../types/vehicleTypeTypes.ts';

const BLANK_NAME = 'unnamed';
const RAIL_SIDE = 'right' as const;
const EMPTY_VTYPE: VehicleType = { id: '', version: 0 };

interface VehicleTypeDetailsProps {
  /** Resolved row, or `null` when the deep-link `?selected=…` id was not found. */
  vehicleType: VehicleType | null;
}

type FormState = { form: VehicleType; baseline: VehicleType };
type FormAction = { type: 'hydrate'; row: VehicleType } | { type: 'edit'; form: VehicleType };

function formReducer(state: FormState, action: FormAction): FormState {
  return action.type === 'hydrate'
    ? { form: action.row, baseline: action.row }
    : { ...state, form: action.form };
}

/**
 * Editable sidebar for a VehicleType, opened via `/vehicle-types?selected=<id>`.
 * Hydrates straight from the resolved list row (the list query carries every
 * field) into a tabbed {@link VehicleTypeForm}. The full {@link EditorRail}
 * drives view↔edit, and **save is mocked** — it advances the dirty baseline and
 * shows a success snackbar without calling any mutation.
 *
 * @param vehicleType Resolved row, or `null` for a not-found deep link.
 */
export default function VehicleTypeDetails({ vehicleType }: VehicleTypeDetailsProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [state, dispatch] = useReducer(formReducer, { form: EMPTY_VTYPE, baseline: EMPTY_VTYPE });

  // Re-hydrate (and drop back to view) whenever the deep-link resolves a new row.
  useEffect(() => {
    if (vehicleType) {
      dispatch({ type: 'hydrate', row: vehicleType });
      setMode('view');
      setSavedAt(null); // don't let a prior "saved" snackbar bleed into the next row
    }
  }, [vehicleType]);

  const isDirty = !!vehicleType && JSON.stringify(state.form) !== JSON.stringify(state.baseline);
  useDirtyFormBlock(isDirty);

  // Lift the dirty signal onto EditingContext so chrome (sort/pagination guards)
  // can react without reaching into the feature; clear on unmount.
  const { setEditorDirty } = useEditorDirty();
  useEffect(() => {
    setEditorDirty(isDirty);
  }, [isDirty, setEditorDirty]);
  useEffect(() => () => setEditorDirty(false), [setEditorDirty]);

  const closeSlider = () =>
    setSearchParams(
      params => {
        params.delete(VEHICLE_TYPE_SELECTED_PARAM);
        return params;
      },
      { replace: true }
    );

  // Mock save: advance the baseline so the form goes pristine, no mutation fired.
  const handleSave = () => {
    dispatch({ type: 'hydrate', row: state.form });
    setSavedAt(Date.now());
    setMode('view');
  };

  if (!vehicleType) {
    const requestedId = searchParams.get(VEHICLE_TYPE_SELECTED_PARAM);
    return (
      <>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t('vehicleType.detailsTitle', 'Vehicle Type Details')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('vehicleType.notFound', 'Vehicle type not found')}
          </Typography>
          {requestedId && (
            <Typography variant="caption" color="text.disabled" sx={{ wordBreak: 'break-all' }}>
              {requestedId}
            </Typography>
          )}
        </Box>
        <EditorRail onCollapse={closeSlider} side={RAIL_SIDE} />
      </>
    );
  }

  const name = state.form.name?.value?.trim();

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <FormLayout sx={{ mb: 1 }}>
        <Typography
          variant="h6"
          noWrap
          title={name || undefined}
          data-testid="vehicle-type-details-title"
          sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {name || (
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
        <NetexId
          id={vehicleType.id}
          version={vehicleType.version}
          copy="onHover"
          size="small"
          sx={{ justifySelf: 'start' }}
        />
      </FormLayout>
      <Divider sx={{ mb: 2 }} />

      <Stack data-testid="vehicle-type-context">
        <VehicleTypeForm
          value={state.form}
          onChange={form => dispatch({ type: 'edit', form })}
          mode={mode}
        />
      </Stack>

      <SaveSuccessSnackbar
        open={savedAt !== null}
        message={t('vehicleType.saveSuccess', 'Vehicle type saved')}
        onClose={() => setSavedAt(null)}
      />
      <EditorRail
        side={RAIL_SIDE}
        onCollapse={closeSlider}
        mode={mode}
        onEnterEdit={() => setMode('edit')}
        onCancelEdit={() => {
          dispatch({ type: 'hydrate', row: vehicleType });
          setMode('view');
        }}
        onSave={handleSave}
        isDirty={isDirty}
        saving={false}
      />
    </Box>
  );
}
