import { useCallback } from 'react';
import { useAuth as useOidcAuth, type AuthContextProps } from 'react-oidc-context';
import { useConfig } from '../contexts/configContext.ts';

/** Landing path when no usable return path survives the login round trip. */
const HOME = '/';
/** Same-origin relative path: one leading slash, never `//` or `/\` (protocol-relative). */
const LOCAL_PATH = /^\/(?![/\\])/;

export type AccessToken = string | null;

/** Custom data round-tripped through the OIDC `state` across the login redirect. */
interface LoginState {
  returnTo: string;
}

/** Path + query + hash of the current location. */
const here = (): string => {
  const { pathname, search, hash } = window.location;
  return pathname + search + hash;
};

/**
 * Resolve where to land after the OIDC signin callback.
 *
 * @param state - `user.state` from the signin callback (set by `login`).
 * @returns the stored return path when it is a same-origin relative path, else `/`.
 */
export function returnTo(state: unknown): string {
  const to = (state as Partial<LoginState> | null | undefined)?.returnTo;
  return typeof to === 'string' && LOCAL_PATH.test(to) ? to : HOME;
}

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
  /** Start the OIDC login; `to` is the in-app path to land on afterwards (default: current location). */
  login: (to?: string) => Promise<void>;
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
    [oidcAuth]
  );

  const login = useCallback(
    (to: string = here()) => {
      if (!oidcAuth) return Promise.resolve();
      // redirect_uri stays the configured (IdP-registered) one; the return
      // path rides in `state` and is read back by AuthProvider's signin callback.
      const state: LoginState = { returnTo: to };
      return oidcAuth.signinRedirect({ state });
    },
    [oidcAuth]
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
