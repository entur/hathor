import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NetexId from '../../netex/NetexId.tsx';
import { FormLayout } from '../../../components/FormLayout.tsx';

const TITLE_TESTID = 'vehicle-type-details-title';

interface VehicleTypeHeaderProps {
  /** Display name; blank/absent renders the `[ unnamed ]` placeholder. */
  name?: string;
  /** Full NeTEx id. Absent or blank (a not-yet-saved create) hides the chip. */
  id?: string;
  version?: number;
}

/**
 * Title row shared by both VehicleType sidebar editors: name (or an italic,
 * localized `[ unnamed ]` placeholder) on the left, NetexId chip below-left,
 * then a divider.
 *
 * Takes flat values rather than a `VehicleType` so each editor can feed it
 * from whatever it actually has — the legacy editor passes its live form
 * state, the modern one the row until `VehicleTypeForm`'s first `onChange`
 * and that form's own state thereafter. Either way the title tracks typing.
 *
 * @param name    Display name; blank/absent renders the placeholder.
 * @param id      Full NeTEx id; blank/absent hides the chip.
 * @param version Version, rendered as the `vN` badge on the chip.
 */
export default function VehicleTypeHeader({ name, id, version }: VehicleTypeHeaderProps) {
  const { t } = useTranslation();
  const trimmed = name?.trim();

  return (
    <>
      <FormLayout sx={{ mb: 1 }}>
        <Typography
          variant="h6"
          noWrap
          title={trimmed || undefined}
          data-testid={TITLE_TESTID}
          sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {trimmed || (
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
                {t('common.unnamed')}
              </Box>
              {' ]'}
            </>
          )}
        </Typography>
        {id && (
          <NetexId
            id={id}
            version={version}
            copy="onHover"
            size="small"
            sx={{ justifySelf: 'start' }}
          />
        )}
      </FormLayout>
      <Divider sx={{ mb: 2 }} />
    </>
  );
}
