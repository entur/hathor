import { Box, IconButton, Badge, Button, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getIconUrl } from '../../utils/iconLoaderUtils.ts';
import { useTranslation } from 'react-i18next';

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
          aria-label={t('header.actions.search', 'search')}
        >
          <SearchIcon />
        </IconButton>
      )}

      {isAuthenticated ? (
        <IconButton
          color="inherit"
          onClick={onUserIconClick}
          aria-label={t('header.actions.userAccount', 'user account')}
        >
          <Badge color="success" overlap="circular" variant="dot">
            {renderHeaderIcon('user')}
          </Badge>
        </IconButton>
      ) : authConfigured ? (
        <Button variant="outlined" color="inherit" onClick={onUserIconClick}>
          {t('header.actions.login', 'Log in')}
        </Button>
      ) : (
        <Chip
          label={t('header.actions.authDisabled', 'Auth off')}
          variant="outlined"
          size="small"
          data-testid="auth-disabled-label"
          sx={{ color: 'inherit', borderColor: 'rgba(255,255,255,0.5)' }}
        />
      )}

      <IconButton
        color="inherit"
        onClick={onSettingsIconClick}
        aria-label={t('header.actions.settings', 'settings')}
      >
        {renderHeaderIcon('settings')}
      </IconButton>
      <IconButton
        color="inherit"
        onClick={onMenuIconClick}
        aria-label={t('header.actions.menu', 'menu')}
      >
        {renderHeaderIcon('menu')}
      </IconButton>
    </Box>
  );
}
