import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';
import { Box } from '@mui/material';
import LoginPanel from './LoginPanel';

// Alignment probe tunables. EN_CAP_* are the `EN` capitals' band inside the
// MARK_PX-tall provider asset (`public/assets/en-mark.png`).
const MARK_PX = 192,
  EN_CAP_TOP = 47,
  EN_CAP_BOT = 119;
const ALIGN_TOL = 1.5; // px; sub-pixel drift is the browser rounding, not a bug

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

/**
 * Default: Entur Partner mark on the button.
 *
 * The play function pins the mark's vertical alignment against the label, on
 * both measures that matter. Box centring alone is not enough: the asset's
 * coral rule sits low in the plate (y 138..149 of 192) and drags its geometric
 * centre below the letterforms, so the `EN` capitals can read high even when
 * the image box is perfectly centred. The second assertion compares the `EN`
 * cap band with the label's own cap band, derived from canvas text metrics
 * rather than the line box (which includes descender leading).
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector<HTMLElement>('[data-testid="login-panel-button"]')!;
    const mark = btn.querySelector('img')!;
    await waitFor(() => expect(mark.getBoundingClientRect().height).toBeGreaterThan(0));

    const text = [...btn.childNodes].find(n => n.nodeType === Node.TEXT_NODE)!;
    const range = document.createRange();
    range.selectNodeContents(text);
    const m = mark.getBoundingClientRect();
    const l = range.getBoundingClientRect();

    expect(Math.abs((m.top + m.bottom) / 2 - (l.top + l.bottom) / 2)).toBeLessThan(ALIGN_TOL);

    const cs = getComputedStyle(btn);
    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const tm = ctx.measureText(text.textContent!);
    const capTop =
      l.top + (l.height - (tm.actualBoundingBoxAscent + tm.actualBoundingBoxDescent)) / 2;
    const enCentre = m.top + ((EN_CAP_TOP + EN_CAP_BOT) / 2) * (m.height / MARK_PX);
    expect(Math.abs(enCentre - (capTop + tm.actualBoundingBoxAscent / 2))).toBeLessThan(ALIGN_TOL);
  },
};

/** Mobile layout: the band is a left-aligned column at any width, so it only narrows. */
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
