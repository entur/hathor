import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../contexts/configContext.ts';
import { returnTo } from './authUtils.ts';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { oidcConfig } = useConfig();
  const navigate = useNavigate();

  if (!oidcConfig) {
    return <>{children}</>;
  }

  return (
    <OidcAuthProvider
      {...oidcConfig}
      // Back to where login started (#31); `replace` also drops the ?code&state callback query.
      onSigninCallback={user => navigate(returnTo(user?.state), { replace: true })}
      redirect_uri={oidcConfig.redirect_uri || window.location.origin + import.meta.env.BASE_URL}
    >
      {children}
    </OidcAuthProvider>
  );
};
