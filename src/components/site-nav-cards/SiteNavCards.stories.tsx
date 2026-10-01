import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '@mui/material';
import { expect, waitFor } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import SiteNavCards, { BUS_SRC, ComboStrip, CreateRow, NavGrid, StatStrip } from './SiteNavCards';
import { TYPES, type CountCtx, type SiteType } from './siteTypes';

/**
 * Stories for the Home dashboard's per-type cards, free of the page hero and
 * the login/organisation gate. A MemoryRouter decorator supplies the routing
 * context the cards' <Link>s need; counts get a dummy {@link CountCtx} (the
 * sample fetchers ignore it), so no auth/org mocks are required. The padded
 * frame mirrors Home's content gutter. Domain glyphs come from the nav-rail
 * MenuIcon sprite, mounted globally in `.storybook/preview.tsx`.
 */

// Stable module-level ctx — a fresh object per render would re-run every count fetch.
const CTX: CountCtx = { getToken: () => Promise.resolve(null) };

// Count-state fixtures: never-resolving (pending) and rejecting (error) fetchers.
const PENDING: SiteType[] = TYPES.map(x => ({ ...x, count: () => new Promise<number>(() => {}) }));
const FAILING: SiteType[] = TYPES.map(x => ({
  ...x,
  count: () => Promise.reject(new Error('count unavailable')),
}));

const meta: Meta<typeof SiteNavCards> = {
  title: 'components/SiteNavCards',
  component: SiteNavCards,
  args: { ctx: CTX },
  argTypes: {
    variant: { control: 'inline-radio', options: ['combo', 'rows'] },
    counts: { control: 'boolean' },
    iconSize: { control: { type: 'range', min: 16, max: 72, step: 2 } },
    bgURL: { control: 'inline-radio', options: ['none', BUS_SRC] },
    ink: { control: 'inline-radio', options: ['black', 'white'] },
    createAlign: { control: 'inline-radio', options: ['right', 'left'] },
    busOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    halo: { control: 'boolean' },
    bg: { control: 'text' },
    hoverBg: { control: 'text' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The Home dashboard cards. `variant="combo"` (default) shows one card per type — browse link (optional count via `counts`), create footer; `variant="rows"` stacks the metric strip, browse tiles and create-new actions. Each layout is exported separately (`ComboStrip`, `StatStrip`, `NavGrid`, `CreateRow`). Sample counts resolve after a staggered fake delay.',
      },
    },
  },
  decorators: [
    Story => (
      <MemoryRouter>
        <Box sx={{ p: { xs: 2, sm: 3, md: 5 } }}>
          <Story />
        </Box>
      </MemoryRouter>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SiteNavCards>;

/** Combo layout, as on Home — 40px glyph, no counts, no backdrop (`bgURL='none'`). */
export const Combo: Story = {};

/** Combo layout with per-type counts — they resolve one by one. */
export const ComboCounts: Story = { args: { counts: true } };

/** Combo layout with the opt-in bus backdrop — black ink (faint watermark). */
export const ComboBus: Story = { args: { bgURL: BUS_SRC } };

/** Combo layout with the opt-in white-ink (embossed-negative) bus backdrop. */
export const ComboWhiteInk: Story = { args: { bgURL: BUS_SRC, ink: 'white' } };

/** Legacy three-row layout. */
export const Rows: Story = { args: { variant: 'rows' } };

/** Combo cards while every count is still pending (Skeleton). */
export const Loading: Story = {
  render: () => <ComboStrip ctx={CTX} types={PENDING} counts />,
};

/** Combo cards when every count fetch fails (muted dash + tooltip; screen-reader text). */
export const Failed: Story = {
  render: () => <ComboStrip ctx={CTX} types={FAILING} counts />,
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(canvasElement.querySelectorAll('[data-testid="site-count-err"]')).toHaveLength(
        TYPES.length
      )
    );
    canvasElement.querySelectorAll('[data-testid="site-count-err"]').forEach(el => {
      // dash hidden from AT; the visually-hidden label carries the meaning
      expect(el.querySelector('[aria-hidden="true"]')?.textContent).toBe('—');
      expect(el.textContent?.replace('—', '').trim()).not.toBe('');
    });
  },
};

/** Overview metric strip only (sample figures). */
export const Stats: Story = { render: () => <StatStrip ctx={CTX} /> };

/** Browse tiles only — links to the three list views. */
export const Browse: Story = { render: () => <NavGrid /> };

/** Create-new action row only — `?selected=new` deep links. */
export const Create: Story = { render: () => <CreateRow /> };

/**
 * Mobile layout: the `mobile1` viewport narrows the canvas below the `sm`
 * breakpoint, so the combo cards stack in a single column.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
