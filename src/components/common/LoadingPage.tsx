import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LoadingIcon from '../icons/LoadingIcon';

// Linje Loader (`loader/src/Loader.scss`): centred, at most 20 rem wide.
const MAX_WIDTH = '20rem';

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
        mx: 'auto',
        maxWidth: MAX_WIDTH,
        textAlign: 'center',
        color,
      }}
    >
      <LoadingIcon />
      {/* Linje's label is a Heading5 at heading weight; 16 px on hathor's scale. */}
      <Typography variant="subtitle1" component="p" sx={{ mt: 1, fontWeight: 'fontWeightBold' }}>
        {text ?? t('data.loading')}
      </Typography>
    </Box>
  );
}
