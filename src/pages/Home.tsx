import { Alert, Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SiteNavCards from '../components/site-nav-cards/SiteNavCards.tsx';
import { useOrganisationsContext } from '../contexts/useOrganisationsContext.ts';
import { useAuth } from '../auth/index.ts';

/**
 * Home — the registry dashboard. A flat, left-aligned layout: a typographic
 * hero band, then the {@link SiteNavCards} rows (overview metrics, browse
 * tiles, create actions) once an organisation is selected, or a login /
 * choose-organisation prompt otherwise. No elevated/bordered Paper, no
 * centered text.
 */

// Layout tunables — bubbled per repo style.
const CONTENT_MAX = 1180; // px; content measure for the whole dashboard

/**
 * Registry dashboard home page.
 * @returns the flat Home dashboard view.
 */
export default function HomePage() {
  const { t } = useTranslation();
  const {
    currentOrganisation,
    error: organisationsError,
    refetch: refetchOrganisations,
  } = useOrganisationsContext();
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%' }}>
      <Box
        sx={{
          maxWidth: CONTENT_MAX,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 5 },
          py: { xs: 3, md: 5 },
        }}
      >
        {/* Hero band — left aligned, no card */}
        <Box component="header" sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', letterSpacing: '0.12em', fontWeight: 700 }}
          >
            {t('home.eyebrow')}
          </Typography>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 800, lineHeight: 1.1, mt: 0.5, mb: 2 }}
          >
            {t('home.welcomeMessage')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '64ch' }}>
            {t('home.description')}
          </Typography>
        </Box>

        {currentOrganisation && <SiteNavCards />}
        {!isAuthenticated && (
          <Box component="section">
            <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
              {t('home.notLoggedIn')}
            </Typography>
          </Box>
        )}
        {!currentOrganisation && isAuthenticated && (
          <Box component="section">
            <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
              {t('home.noOrganisation')}
            </Typography>
            {organisationsError && (
              <Alert
                severity="error"
                data-testid="home-organisations-load-error"
                action={
                  <Button color="inherit" size="small" onClick={() => void refetchOrganisations()}>
                    {t('common.retry')}
                  </Button>
                }
              >
                {t('organisations.loadError')} {organisationsError}
              </Alert>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
