import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * LoginPanel — the full-width band shown on the dashboard while signed out.
 * Replaces the bare "you need to log in" sentence with an actual affordance:
 * one line of context, a provider-marked sign-in button, and the provider name
 * under it. No headline — the hero above already says where the user is.
 *
 * The button carries the identity provider's mark, not the app logo — the app
 * logo is theme-driven (`theme.logoUrl`, which the default theme points at
 * hathor's own mark), whereas the IdP is fixed by `config.json`'s
 * `oidcConfig.authority` (`partner.*.entur.org` = Entur Partner). Callers can
 * still override both mark and name for another IdP.
 *
 * Deliberately auth-agnostic: it takes an `onLogin` callback rather than
 * calling `useAuth()` itself, so it renders in Storybook and tests with no OIDC
 * provider mounted.
 */

// Layout tunables — bubbled per repo style.
const LOGO_H = 22; // px; provider mark inside the button
const BODY_MEASURE = '56ch';

// Default identity provider: Entur Partner. The mark is the IdP's own squared
// EN badge, lifted verbatim from its Auth0 universal-login page
// (auth-resources.entur.org/icons/logo-192x192.png, 2026-09-29) — NOT the
// `entur-logo.png` wordmark the header uses. It carries its own navy plate, so
// the button stays `outlined` (a `contained` primary button is the same navy
// and would swallow it).
const PROVIDER_NAME = 'Entur Partner';
const PROVIDER_LOGO = `${import.meta.env.BASE_URL}assets/en-mark.png`;

export interface LoginPanelProps {
  /** Starts the sign-in redirect. Wire to `useAuth().login` at the call site. */
  onLogin: () => void;
  /** Identity provider name, rendered under the button. */
  providerName?: string;
  /** Identity provider mark shown on the button; omit the prop for Entur Partner, pass `''` for none. */
  providerLogoUrl?: string;
}

/**
 * Signed-out sign-in band for the dashboard.
 *
 * @param onLogin - invoked when the sign-in button is pressed.
 * @param providerName - identity provider name (default `Entur Partner`).
 * @param providerLogoUrl - provider mark URL; `''` renders the button unmarked.
 * @returns the wide login panel.
 */
export default function LoginPanel({
  onLogin,
  providerName = PROVIDER_NAME,
  providerLogoUrl = PROVIDER_LOGO,
}: LoginPanelProps) {
  const { t } = useTranslation();

  return (
    <Box
      component="section"
      data-testid="login-panel"
      aria-label={t('header.actions.login', 'Log in')}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 0.75,
        width: '100%',
        // Square, unfilled band: a single hairline rule across the top is the
        // whole frame — no tile fill, no rounded corners, nothing on the other
        // three sides.
        px: 0,
        pt: { xs: 3, md: 4 },
        pb: 0,
        borderTop: 1,
        borderColor: 'divider',
        borderRadius: 0,
        bgcolor: 'transparent',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, maxWidth: BODY_MEASURE }}>
        {t('home.login.body', 'Sign in to browse and edit vehicles, vehicle types and deck plans.')}
      </Typography>
      <Button
        variant="outlined"
        size="large"
        onClick={onLogin}
        data-testid="login-panel-button"
        startIcon={
          providerLogoUrl ? (
            <Box
              component="img"
              src={providerLogoUrl}
              alt=""
              // MUI's startIcon already centres this against the label; the
              // Default story asserts both the box and cap-height centres, so
              // no alignment override is carried here.
              sx={{ height: LOGO_H, width: 'auto' }}
            />
          ) : undefined
        }
      >
        {t('header.actions.login', 'Log in')}
      </Button>
      <Typography variant="caption" color="text.secondary">
        {t('home.login.provider', 'via {{provider}}', { provider: providerName })}
      </Typography>
    </Box>
  );
}
