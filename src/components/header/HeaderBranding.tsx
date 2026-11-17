import { Link } from 'react-router-dom';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * The header's logo and title, a link home named by the title. The title is the app's own,
 * translated, unless the theme names the installation (`applicationName`); below `sm` only the
 * logo shows, so the header's actions stay on screen (WCAG 1.4.10).
 *
 * @returns {JSX.Element} the branding link
 */
export default function HeaderBranding() {
  const theme = useTheme();
  const { t } = useTranslation();
  const title = theme.applicationName || t('app.shortTitle');

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Link
        to="/"
        aria-label={title}
        style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <img src={theme.logoUrl} alt="" height={theme.logoHeight} />
        <Typography variant="h6" sx={{ ml: 1, mr: 1, display: { xs: 'none', sm: 'block' } }}>
          {title}
        </Typography>
      </Link>
    </Box>
  );
}
