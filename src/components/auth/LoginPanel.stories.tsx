import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';
import { Box } from '@mui/material';
import LoginPanel from './LoginPanel';
import { CONTENT_MAX } from '../../pages/Home';

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
          'Signed-out band for the dashboard, full content width: one line of context, a provider-marked sign-in button, then the provider name. The mark identifies the identity provider, not the app, so a theme swapping `logoUrl` does not change it.',
      },
    },
  },
  args: { onLogin: fn() },
  // The panel is full-bleed by design; the app renders it inside Home's
  // padded content measure, so mirror that here instead of letting it sit
  // flush against the canvas edge.
  decorators: [
    Story => (
      <Box sx={{ maxWidth: CONTENT_MAX, mx: 'auto', px: { xs: 2, sm: 3, md: 5 }, py: 4 }}>
        <Story />
      </Box>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof LoginPanel>;

/**
 * Default: Entur Partner mark on the button. The play function only checks the
 * mark actually resolved — its vertical alignment is the component's own
 * business (`LOGO_NUDGE`), and visual drift is Chromatic's job.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const mark = canvasElement.querySelector<HTMLImageElement>(
      '[data-testid="login-panel-button"] img'
    )!;
    await waitFor(() => expect(mark.getBoundingClientRect().height).toBeGreaterThan(0));
  },
};

/**
 * Mobile: the band does not reflow — it is the same left-aligned column at
 * every width, so this only narrows the measure and checks the button and
 * provider line still fit.
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
