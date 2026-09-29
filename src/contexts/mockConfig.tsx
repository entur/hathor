import type { Decorator } from '@storybook/react-vite';
import { ConfigContext, type Config } from './configContext.ts';

// Enough of an OIDC block for `oidcConfig`-gated UI to switch on. The real one
// is fetched from `public/config.json` at startup, which Storybook never does,
// so ConfigContext would otherwise fall back to its `{}` default.
const CONFIGURED: Config = {
  applicationEnv: 'storybook',
  oidcConfig: {
    authority: 'https://partner.dev.entur.org',
    client_id: 'storybook-client',
    redirect_uri: 'http://localhost:6006',
  },
};

/**
 * Decorator supplying a runtime Config to a story.
 *
 * Without it `useConfig()` yields the context's `{}` default, so anything
 * gated on `oidcConfig` — the signed-out LoginPanel on Home, for one —
 * silently renders nothing and the story looks fine while showing less than
 * it claims.
 *
 * @param over - config fields overriding the auth-configured default; pass
 *   `{ oidcConfig: undefined }` for the auth-off profile.
 * @returns a decorator wrapping the story in the mocked config provider.
 */
export const withConfig =
  (over: Partial<Config> = {}): Decorator =>
  Story => (
    <ConfigContext.Provider value={{ ...CONFIGURED, ...over }}>
      <Story />
    </ConfigContext.Provider>
  );
