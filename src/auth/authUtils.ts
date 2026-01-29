import { useCallback } from 'react';
import { useAuth as useOidcAuth, type AuthContextProps } from 'react-oidc-context';
import { useConfig } from '../contexts/ConfigContext.tsx';

export type AccessToken = string | null;

export function authHeader(token: AccessToken): Record<string, string> {
  return token !== null ? { Authorization: `Bearer ${token}` } : {};
}

export interface Auth {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: {
    name?: string;
  };
  roleAssignments?: string[] | null;
  getAccessToken: () => Promise<AccessToken>;
  logout: ({ returnTo }: { returnTo?: string }) => Promise<void>;
  login: (redirectUri?: string) => Promise<void>;
}

export const useAuth = (): Auth => {
  const oidcAuth = useOidcAuth() as AuthContextProps | undefined;

  const { claimsNamespace, preferredNameNamespace } = useConfig();

  const getAccessToken = useCallback((): Promise<AccessToken> => {
    return Promise.resolve(oidcAuth?.user?.access_token ?? null);
  }, [oidcAuth?.user]);

  const logout = useCallback(
    ({ returnTo }: { returnTo?: string }) => {
      if (!oidcAuth) return Promise.resolve();
      return oidcAuth.signoutRedirect({ post_logout_redirect_uri: returnTo });
    },
    [oidcAuth],
  );

  const login = useCallback(
    (redirectUri?: string) => {
      if (!oidcAuth) return Promise.resolve();
      return oidcAuth.signinRedirect({ redirect_uri: redirectUri });
    },
    [oidcAuth],
  );

  return {
    isLoading: oidcAuth?.isLoading ?? false,
    isAuthenticated: oidcAuth?.isAuthenticated ?? false,
    user: {
      name: oidcAuth?.user?.profile[preferredNameNamespace!] as string,
    },
    roleAssignments: oidcAuth?.user?.profile[claimsNamespace!] as string[],
    getAccessToken,
    logout,
    login,
  };
};
