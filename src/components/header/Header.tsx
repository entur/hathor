import { useState } from 'react';
import { AppBar, Link, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import SettingsDialog from '../dialogs/SettingsDialog.tsx';
import UserDialog from '../dialogs/UserDialog.tsx';
import { useAuth } from '../../auth';
import { useConfig } from '../../contexts/configContext.ts';
import { useNavRail } from '../../contexts/NavRailContext.tsx';
import { useTranslation } from 'react-i18next';
import HeaderBranding from './HeaderBranding.tsx';
import HeaderActions from './HeaderActions.tsx';

/** Id of the app's `<main>`; the header's skip link jumps to it. */
export const MAIN_CONTENT_ID = 'main-content';

export default function Header() {
  const { toggleMobile } = useNavRail();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const auth = useAuth();
  const { oidcConfig } = useConfig();
  const { t } = useTranslation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <Link
        href={`#${MAIN_CONTENT_ID}`}
        data-testid="skip-to-content"
        sx={{
          position: 'fixed',
          left: 8,
          top: -48,
          zIndex: theme.zIndex.appBar + 1,
          p: 1,
          bgcolor: 'background.paper',
          '&:focus': { top: 8 },
        }}
      >
        {t('header.skipToContent')}
      </Link>
      <AppBar position="fixed">
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            minHeight: { xs: '64px' },
          }}
        >
          <HeaderBranding />
          <HeaderActions
            isMobile={isMobile}
            onUserIconClick={() => (auth.isAuthenticated ? setUserOpen(true) : auth.login())}
            onSettingsIconClick={() => setSettingsOpen(true)}
            onMenuIconClick={toggleMobile}
            isAuthenticated={auth.isAuthenticated}
            authConfigured={!!oidcConfig}
          />
        </Toolbar>
      </AppBar>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <UserDialog
        open={userOpen}
        onLogout={() =>
          auth
            .logout({ returnTo: `${window.location.origin}${import.meta.env.BASE_URL}` })
            .then(() => {
              setUserOpen(false);
            })
        }
        onClose={() => setUserOpen(false)}
      />
    </>
  );
}
