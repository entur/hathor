import type { MenuIconName } from '../icons/MenuIcon.tsx';

/**
 * siteTypes — the registry entity types the Home dashboard cards render, plus
 * the count-fetcher contract. Kept apart from SiteNavCards.tsx so that file
 * exports only components (fast refresh).
 */

const FAKE_DELAY_MS = 600; // sample-count latency, staggered per type; drop when wired

/** What a count fetcher needs from the host — built by the caller (Home), not read from context. */
export type CountCtx = {
  apiUrl?: string;
  getToken: () => Promise<string | null>;
  org?: string;
};

/** One registry entity type as shown on the dashboard. */
export type SiteType = {
  id: string;
  icon: MenuIconName;
  path: string;
  titleKey: string;
  descKey: string;
  statKey: string;
  createKey: string;
  count: (ctx: CountCtx) => Promise<number>;
};

/** Resolves `n` after a staggered fake latency — placeholder for a real count query. */
const fakeCount = (n: number, i: number) => (): Promise<number> =>
  new Promise(r => setTimeout(() => r(n), FAKE_DELAY_MS * (i + 1)));

// Entity types — paths + glyphs mirror Menu.tsx (the nav rail). Counts are sample figures.
export const TYPES: SiteType[] = [
  {
    id: 'vehicleTypes',
    icon: 'vehicleTypes',
    path: '/vehicle-types',
    titleKey: 'home.features.vehicletypes.headline',
    descKey: 'home.features.vehicletypes.description',
    statKey: 'home.stat.vehicleTypes',
    createKey: 'home.createNew.vehicleType',
    count: fakeCount(142, 0),
  },
  {
    id: 'vehicles',
    icon: 'vehicles',
    path: '/vehicles',
    titleKey: 'vehicles.title',
    descKey: 'home.nav.vehicles.desc',
    statKey: 'home.stat.vehicles',
    createKey: 'home.createNew.vehicle',
    count: fakeCount(3870, 1),
  },
  {
    id: 'deckPlans',
    icon: 'deckPlans',
    path: '/deck-plans',
    titleKey: 'home.features.deckplans.headline',
    descKey: 'home.features.deckplans.description',
    statKey: 'home.stat.deckPlans',
    createKey: 'home.createNew.deckPlan',
    count: fakeCount(58, 2),
  },
];
