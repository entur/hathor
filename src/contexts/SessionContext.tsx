import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth as useOidcAuth, type AuthContextProps } from 'react-oidc-context';
import { useAuth } from '../auth';

interface SessionContextType {
  isSessionExpired: boolean;
  relogin: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [isSessionExpired, setSessionExpired] = useState(false);
  const oidcAuth = useOidcAuth() as AuthContextProps | undefined;
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!oidcAuth?.events) return;
    const { events } = oidcAuth;

    const onAccessTokenExpired = () => {
      console.log('Access token expired, user session is considered expired.');
      if (isAuthenticated) {
        setSessionExpired(true);
      }
    };

    const onSilentRenewError = (error: Error) => {
      console.error('Silent renew failed, user session is considered expired.', error);
      if (isAuthenticated) {
        setSessionExpired(true);
      }
    };

    events.addAccessTokenExpired(onAccessTokenExpired);
    events.addSilentRenewError(onSilentRenewError);

    return () => {
      events.removeAccessTokenExpired(onAccessTokenExpired);
      events.removeSilentRenewError(onSilentRenewError);
    };
  }, [oidcAuth?.events, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && isSessionExpired) {
      setSessionExpired(false);
    }
  }, [isAuthenticated, isSessionExpired]);

  const relogin = useCallback(async () => {
    await login(window.location.href);
  }, [login]);

  return (
    <SessionContext.Provider value={{ isSessionExpired, relogin }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
