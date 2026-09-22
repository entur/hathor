import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './index';
import { useLocation, useNavigate } from 'react-router-dom';
import { useConfig } from '../contexts/configContext.ts';

const LoginRedirect = () => {
  const { t } = useTranslation();
  const { oidcConfig } = useConfig();
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const returnUrl = useLocation().pathname;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      login(oidcConfig?.redirect_uri || window.location.origin + returnUrl);
    } else if (isAuthenticated) {
      navigate(returnUrl);
    }
  }, [isLoading, isAuthenticated, login, navigate, returnUrl, oidcConfig?.redirect_uri]);

  // Same wording as ProtectedRoute's pre-auth gate — one key, both places.
  if (isLoading)
    return <div>{t('protectedRoute.loadingAuthStatus', 'Checking authentication status...')}</div>;

  return <div>{t('auth.redirecting', 'Redirecting to login provider...')}</div>;
};

export default LoginRedirect;
