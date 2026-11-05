import { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import '../index.css'; // main.tsx's global styles: the nav-rail gutter
import App from '../App.tsx';
import { ConfigContext, useConfig } from '../contexts/configContext.ts';
import { CustomizationProvider } from '../contexts/CustomizationContext.tsx';
import { SessionProvider } from '../contexts/SessionContext.tsx';
import { withAuth } from '../auth/mockAuth.tsx';
import { withOrganisations } from '../contexts/mockOrganisations.tsx';
import { stubSobek, withSobekUrl } from '../contexts/mockSobek.tsx';

// Sobek's wire shape, kept in step with the queries by the e2e suite. Globbed: the
// fixtures sit outside `src`, so the app's TypeScript project can't import them.
const FIXTURES = Object.fromEntries(
  Object.entries(
    import.meta.glob('../../e2e-tests/fixtures/*-mock.json', { eager: true, import: 'default' })
  ).map(([path, body]) => [path.split('/').pop()!.replace('-mock.json', ''), body])
);

// The deployed Entur ("custom") theme, served as a URL; `public/theme-*.json` are
// gitignored copies that exist only after `npm run dev`.
const [ENTUR_THEME_URL] = Object.values(
  import.meta.glob<string>('../../.github/environments/theme-dev.json', {
    eager: true,
    query: '?url',
    import: 'default',
  })
);

/**
 * The whole app — Header, Menu and every route — at `path`, in a memory data router
 * as `main.tsx` mounts it, in the Entur theme. Links work, so a story walks Home →
 * collection → form page.
 *
 * @param {{ path: string }} props the route to open
 * @returns {JSX.Element} the routed app
 */
export function AppAt({ path }: { path: string }) {
  const config = useConfig();
  const [router] = useState(() =>
    createMemoryRouter(
      [
        {
          path: '*',
          element: (
            <SessionProvider>
              <CustomizationProvider>
                <App />
              </CustomizationProvider>
            </SessionProvider>
          ),
        },
      ],
      { initialEntries: [path] }
    )
  );
  return (
    <ConfigContext.Provider value={{ ...config, themeFilePath: ENTUR_THEME_URL }}>
      <RouterProvider router={router} />
    </ConfigContext.Provider>
  );
}

/**
 * The meta of the whole-app story (`pages/Home/Complete`): signed in, an organisation
 * picked, and Sobek's list reads (a form page reads its record through the same query)
 * answered from the e2e fixtures. Deck-plan XML has no stub: a deck plan's form shows no decks.
 */
export const APP_STORY_META = {
  parameters: { layout: 'fullscreen' },
  decorators: [withSobekUrl(), withOrganisations(), withAuth()],
  beforeEach: stubSobek({
    'query VehicleTypes': FIXTURES['vehicle-types'],
    'query Vehicles': FIXTURES['vehicles-list'],
    'query DeckPlans': FIXTURES['deck-plans'],
    'query CodeValues': { data: { codeValues: { content: [] } } },
  }),
} satisfies Meta;
