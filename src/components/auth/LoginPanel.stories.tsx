import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Box } from '@mui/material';
import LoginPanel from './LoginPanel';

/**
 * Stories for the signed-out login band. The component takes `onLogin` as a
 * prop rather than reaching for `useAuth()`, so no OIDC decorator is needed
 * here — `fn()` stands in for the sign-in redirect and logs to the Actions
 * panel. The provider mark is served from `public/assets/` via Storybook's
 * `staticDirs`.
 */
const meta: Meta<typeof LoginPanel> = {
  title: 'components/auth/LoginPanel',
  component: LoginPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full-width signed-out band for the dashboard: headline + context on the left, a provider-marked sign-in button on the right, stacking below `sm`. The mark identifies the identity provider (Entur Partner, from `oidcConfig.authority`), not the app — so it stays put when the theme swaps `logoUrl`.',
      },
    },
  },
  args: { onLogin: fn() },
  // The panel is full-bleed by design; the app renders it inside Home's
  // padded content measure, so mirror that here instead of letting it sit
  // flush against the canvas edge.
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 2, sm: 3, md: 5 }, py: 4 }}>
        <Story />
      </Box>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof LoginPanel>;

/** Default: Entur Partner mark, side-by-side layout. */
export const Default: Story = {};

/**
 * Mobile layout: below `sm` the band stacks — copy first, then button and
 * provider line left-aligned beneath it.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};

/**
 * Another identity provider. Both mark and name are props, so pointing the app
 * at a different `oidcConfig.authority` needs no change inside the component.
 */
export const OtherProvider: Story = {
  args: { providerName: 'Keycloak', providerLogoUrl: '' },
};
