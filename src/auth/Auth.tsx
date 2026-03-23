import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import { useConfig } from '../contexts/configContext.ts';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { oidcConfig } = useConfig();

  if (!oidcConfig) {
    return <>{children}</>;
  }

  return (
    <OidcAuthProvider
      {...oidcConfig}
      onSigninCallback={user => {
        const returnPath = (user?.state as { returnPath?: string })?.returnPath;
        window.history.replaceState({}, document.title, returnPath || window.location.pathname);
      }}
      redirect_uri={oidcConfig.redirect_uri || window.location.origin + import.meta.env.BASE_URL}
    >
      {children}
    </OidcAuthProvider>
  );
};
