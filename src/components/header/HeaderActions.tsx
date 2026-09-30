import { Box, IconButton, Badge, Button, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getIconUrl } from '../../utils/iconLoaderUtils.ts';
import { useTranslation } from 'react-i18next';
import { useNavRail } from '../../contexts/NavRailContext.tsx';
import SelectOrganisation from '../../data/organisations/components/SelectOrganisation.tsx';

interface HeaderActionsProps {
  isMobile: boolean;
  isHomePage: boolean;
  onSearchIconClick: () => void;
  onUserIconClick: () => void;
  onSettingsIconClick: () => void;
  onMenuIconClick: () => void;
  isAuthenticated: boolean;
  authConfigured: boolean;
}

export default function HeaderActions({
  isMobile,
  isHomePage,
  onSearchIconClick,
  onUserIconClick,
  onSettingsIconClick,
  onMenuIconClick,
  isAuthenticated,
  authConfigured,
}: HeaderActionsProps) {
  const { t } = useTranslation();
  const { mobileOpen } = useNavRail();

  const renderHeaderIcon = (key: string, size = 28) => (
    <Box
      component="img"
      src={getIconUrl(key)}
      alt={t(`header.actions.${key}IconAlt`, `${key} icon`)}
      sx={{ width: size, height: size }}
    />
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
      {isMobile && !isHomePage && (
        <IconButton
          color="inherit"
          onClick={onSearchIconClick}
          aria-label={t('header.actions.search')}
        >
          <SearchIcon />
        </IconButton>
      )}

      {isAuthenticated ? (
        <>
          <SelectOrganisation />
          <IconButton
            color="inherit"
            onClick={onUserIconClick}
            aria-label={t('header.actions.userAccount')}
          >
            <Badge color="success" overlap="circular" variant="dot">
              {renderHeaderIcon('user')}
            </Badge>
          </IconButton>
        </>
      ) : authConfigured ? (
        <Button variant="outlined" color="inherit" onClick={onUserIconClick}>
          {t('header.actions.login')}
        </Button>
      ) : (
        <Chip
          label={t('header.actions.authDisabled')}
          color="warning"
          size="small"
          data-testid="auth-disabled-label"
        />
      )}

      <IconButton
        color="inherit"
        onClick={onSettingsIconClick}
        aria-label={t('header.actions.settings')}
      >
        {renderHeaderIcon('settings')}
      </IconButton>
      {isMobile && (
        <IconButton
          color="inherit"
          onClick={onMenuIconClick}
          aria-label={mobileOpen ? t('rail.collapse') : t('rail.expand')}
          aria-expanded={mobileOpen}
        >
          {renderHeaderIcon('menu')}
        </IconButton>
      )}
    </Box>
  );
}
