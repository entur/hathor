import { Alert, Box, Button, Typography } from '@mui/material';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SiteNavCards from '../components/site-nav-cards/SiteNavCards.tsx';
import AutosysImportFloatingMenu from '../data/vehicle-imports/components/AutosysImportFloatingMenu.tsx';
import type { CountCtx } from '../components/site-nav-cards/siteTypes.ts';
import { useConfig } from '../contexts/configContext.ts';
import { useOrganisationsContext } from '../contexts/useOrganisationsContext.ts';
import { useAuth } from '../auth/index.ts';

/**
 * Home — the registry dashboard. A flat, left-aligned layout: a typographic
 * hero band, then the {@link SiteNavCards} per-type cards (count, browse
 * link, create action) once an organisation is selected, or a login /
 * choose-organisation prompt otherwise. No elevated/bordered Paper, no
 * centered text.
 */

// Layout tunables — bubbled per repo style.
const CONTENT_MAX = 1180; // px; content measure for the whole dashboard
const SVV_LOGO_SRC = '/assets/statens-vegvesen-emblem.svg',
  SVV_LOGO_H = 28; // px; emblem-only crop (wordmark is white-on-white), width follows

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
  const { isAuthenticated, getAccessToken, login } = useAuth();
  const { applicationBaseUrl, oidcConfig } = useConfig();
  // getAccessToken's identity changes on every OIDC silent renew; read it through a
  // ref so a token refresh doesn't rebuild ctx and re-run every card's count fetch.
  const tokenRef = useRef(getAccessToken);
  useEffect(() => {
    tokenRef.current = getAccessToken;
  }, [getAccessToken]);
  const ctx = useMemo<CountCtx>(
    () => ({
      apiUrl: applicationBaseUrl,
      getToken: () => tokenRef.current(),
      org: currentOrganisation?.id,
    }),
    [applicationBaseUrl, currentOrganisation?.id]
  );

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

        {isAuthenticated && currentOrganisation && (
          <Box sx={{ mb: 3 }}>
            <AutosysImportFloatingMenu
              variant="outlined"
              label={t('home.bulkImportSvv')}
              startIcon={null}
              endIcon={
                <Box
                  component="img"
                  src={SVV_LOGO_SRC}
                  alt=""
                  sx={{ display: 'block', height: SVV_LOGO_H, width: 'auto' }}
                />
              }
              testId="home-bulk-import-svv"
            />
          </Box>
        )}
        {currentOrganisation && <SiteNavCards ctx={ctx} />}
        {/* Signed out — only when OIDC is configured; without it login() is a no-op */}
        {!isAuthenticated && oidcConfig && (
          <Box
            component="section"
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}
          >
            <Typography variant="body1" color="text.secondary">
              {t('home.login.body')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => void login()}
              data-testid="home-login-button"
            >
              {t('header.actions.login')}
            </Button>
            <Typography variant="caption" color="text.secondary">
              {t('home.login.provider')}
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
