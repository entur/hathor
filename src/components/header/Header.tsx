import { useState } from 'react';
import { AppBar, Link, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import SettingsDialog from '../dialogs/SettingsDialog.tsx';
import UserDialog from '../dialogs/UserDialog.tsx';
import { useAuth } from '../../auth';
import { useConfig } from '../../contexts/configContext.ts';
import { useNavRail } from '../../contexts/NavRailContext.tsx';
import { useTranslation } from 'react-i18next';
import HeaderBranding from './HeaderBranding.tsx';
import DesktopSearchBar from '../search/DesktopSearchBar.tsx';
import MobileSearchBar from '../search/MobileSearchBar.tsx';
import HeaderActions from './HeaderActions.tsx';
import { matchPath, useLocation } from 'react-router-dom';

/** Id of the app's `<main>`; the header's skip link jumps to it. */
export const MAIN_CONTENT_ID = 'main-content';

// Routes whose page registers into the header search (the legacy list views, #252).
const SEARCH_ROUTES = ['/vehicle-types', '/vehicles', '/deck-plans'];

export default function Header() {
  const { toggleMobile } = useNavRail();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const auth = useAuth();
  const { oidcConfig } = useConfig();
  const { t } = useTranslation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  // matchPath, like the router: trailing slash and case don't matter.
  const hideSearch = !SEARCH_ROUTES.some(path => matchPath(path, location.pathname));

  // const handleMobileSearchUIClose = () => {
  //   setSearchActive(false);
  // };

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
          {isMobile && searchActive && !hideSearch ? (
            <MobileSearchBar
            // onCloseRequest={handleMobileSearchUIClose}
            // placeholder={t('search.searchPlaceholder')}
            />
          ) : (
            <>
              <HeaderBranding />
              {!hideSearch && !isMobile && <DesktopSearchBar />}
              <HeaderActions
                isMobile={isMobile}
                hideSearch={hideSearch}
                onSearchIconClick={() => setSearchActive(true)}
                onUserIconClick={() => (auth.isAuthenticated ? setUserOpen(true) : auth.login())}
                onSettingsIconClick={() => setSettingsOpen(true)}
                onMenuIconClick={toggleMobile}
                isAuthenticated={auth.isAuthenticated}
                authConfigured={!!oidcConfig}
              />
            </>
          )}
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
