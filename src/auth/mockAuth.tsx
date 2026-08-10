import type { Decorator } from '@storybook/react-vite';
import { AuthContext, type AuthContextProps } from 'react-oidc-context';

// Only the fields hathor's useAuth() reads; cast because AuthContextProps
// carries the full oidc-client-ts surface a story never exercises.
const SIGNED_IN = {
  isLoading: false,
  isAuthenticated: true,
  user: {
    access_token: 'story-token',
    profile: { sub: 'story-user', name: 'Story User' },
  },
  signinRedirect: () => Promise.resolve(),
  signoutRedirect: () => Promise.resolve(),
} as unknown as AuthContextProps;

/**
 * Decorator supplying a signed-in OIDC context to a story. Without it
 * react-oidc-context yields undefined, so useAuth() reports isAuthenticated
 * false and auth-gated branches render their logged-out state.
 *
 * @param over - context fields overriding the signed-in default.
 * @returns a decorator wrapping the story in the mocked auth context.
 */
export const withAuth =
  (over: Partial<AuthContextProps> = {}): Decorator =>
  Story => (
    <AuthContext.Provider value={{ ...SIGNED_IN, ...over }}>
      <Story />
    </AuthContext.Provider>
  );
