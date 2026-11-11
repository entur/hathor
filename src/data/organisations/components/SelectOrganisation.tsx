import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOrganisationsContext } from '../../../contexts/useOrganisationsContext.ts';
import { Autocomplete, TextField } from '@mui/material';
import { useAuth } from '../../../auth/index.ts';
import { useEditorDirty } from '../../../contexts/EditingContext.tsx';
import DiscardDialog from '../../../components/dialogs/DiscardDialog.tsx';
import type { Organisation } from '../types/organisationTypes.ts';

/**
 * The header's organisation picker. An open editor re-mounts on a switch without a
 * navigation its `LeaveGuard` could catch, so with unsaved edits the switch asks first.
 *
 * @returns {JSX.Element} The picker, once signed in and the organisations have loaded.
 */
export default function SelectOrganisation() {
  const { t } = useTranslation();
  const { data, currentOrganisation, setCurrentOrganisation } = useOrganisationsContext();
  const { isAuthenticated } = useAuth();
  const { isEditorDirty } = useEditorDirty();
  // The switch waiting on the dialog; `undefined` = none (`null` clears the org).
  const [pending, setPending] = useState<Organisation | null>();

  return (
    <>
      {isAuthenticated && data !== undefined && (
        <Autocomplete<Organisation, false>
          options={data}
          title={t('organisations.select.label')}
          getOptionLabel={option => (option.name?.value ?? '-') + ' (' + option.type + ')'}
          noOptionsText={t('organisations.select.noOptions')}
          value={currentOrganisation}
          onChange={(_e, v) => (isEditorDirty ? setPending(v) : setCurrentOrganisation(v))}
          size="small"
          sx={{
            width: { xs: 'clamp(8rem, 36vw, 11rem)', sm: '14rem', md: '16rem' },
            mr: 1,
          }}
          renderInput={params => (
            <TextField
              {...params}
              id="organisation-select"
              size="small"
              aria-label={t('organisations.select.label')}
              variant="outlined"
              sx={{ bgcolor: 'common.white', borderRadius: 1 }}
            />
          )}
        />
      )}
      <DiscardDialog
        open={pending !== undefined}
        onCancel={() => setPending(undefined)}
        onDiscard={() => {
          setCurrentOrganisation(pending ?? null);
          setPending(undefined);
        }}
      />
    </>
  );
}
