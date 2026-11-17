import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LoadingIcon from '../icons/LoadingIcon';

/**
 * enki's loader (`src/components/Loading`): its ring animation over a line of text.
 *
 * @param {object} props
 * @param {string} [props.text] the line under the rings; "Loading data..." when absent
 * @param {string} [props.color] theme colour of rings and text; the boot loader passes a
 *   neutral one, since no theme is loaded yet
 * @returns {JSX.Element} the loader, announced as a status
 */
export default function LoadingPage({
  text,
  color = 'primary.main',
}: {
  text?: string;
  color?: string;
}) {
  const { t } = useTranslation();
  return (
    <Box
      role="status"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        mt: 4,
        p: 2,
        color,
      }}
    >
      <LoadingIcon />
      <Typography sx={{ mt: 1, fontWeight: 'fontWeightMedium' }}>
        {text ?? t('data.loading')}
      </Typography>
    </Box>
  );
}
