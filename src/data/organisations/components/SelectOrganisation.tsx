import { useTranslation } from 'react-i18next';
import { useOrganisations } from '../hooks/useOrganisations.ts';
import { Autocomplete, TextField } from '@mui/material';
import { useAuth } from '../../../auth/index.ts';
import type { Organisation } from '../types/organisationTypes.ts';

export default function SelectOrganisation() {
  const { t } = useTranslation();
  const { data, currentOrganisation, setCurrentOrganisation } = useOrganisations();
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && data !== undefined && (
        <Autocomplete<Organisation, false>
          options={data}
          title={t('organisations.select.label', 'Select organisation')}
          getOptionLabel={option => (option.name?.value ?? '-') + ' (' + option.type + ')'}
          noOptionsText={t('organisations.select.noOptions', 'No organisations available')}
          value={currentOrganisation}
          onChange={(_e, v) => setCurrentOrganisation(v)}
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
              aria-label={t('organisations.select.label', 'Select organisation')}
              variant="outlined"
              sx={{ bgcolor: 'common.white', borderRadius: 1 }}
            />
          )}
        />
      )}
    </>
  );
}
