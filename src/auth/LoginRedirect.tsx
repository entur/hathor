import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './index';
import { useLocation } from 'react-router-dom';

const LoginRedirect = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading, login } = useAuth();
  const { pathname, search, hash } = useLocation();
  // Full location, not just the path — `?selected=<id>` deep links must survive login.
  const returnUrl = pathname + search + hash;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      login(returnUrl);
    }
  }, [isLoading, isAuthenticated, login, returnUrl]);

  // Same wording as ProtectedRoute's pre-auth gate — one key, both places.
  if (isLoading) return <div>{t('protectedRoute.loadingAuthStatus')}</div>;

  return <div>{t('auth.redirecting')}</div>;
};

export default LoginRedirect;
