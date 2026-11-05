import { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import '../../index.css'; // main.tsx's global styles: the nav-rail gutter
import App from '../../App.tsx';
import { CustomizationProvider } from '../../contexts/CustomizationContext.tsx';
import { SessionProvider } from '../../contexts/SessionContext.tsx';
import { withAuth } from '../../auth/mockAuth.tsx';
import { withOrganisations } from '../../contexts/mockOrganisations.tsx';
import { stubSobek, withSobekUrl } from '../../contexts/mockSobek.tsx';

// Sobek's wire shape, kept in step with the queries by the e2e suite. Globbed: the
// fixtures sit outside `src`, so the app's TypeScript project can't import them.
const FIXTURES = Object.fromEntries(
  Object.entries(
    import.meta.glob('../../../e2e-tests/fixtures/*-mock.json', { eager: true, import: 'default' })
  ).map(([path, body]) => [path.split('/').pop()!.replace('-mock.json', ''), body])
);

/**
 * The whole app — Header, Menu and every route — at `path`, in a memory data router
 * as `main.tsx` mounts it. Links work, so a story walks Home → collection → form page.
 *
 * @param {{ path: string }} props the route to open
 * @returns {JSX.Element} the routed app
 */
export function AppAt({ path }: { path: string }) {
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
  return <RouterProvider router={router} />;
}

/**
 * The meta every complete-page story shares: signed in, an organisation picked, and
 * Sobek's list reads (a form page reads its record through the same query) answered
 * from the e2e fixtures. Deck-plan XML has no stub: a deck plan's form shows no decks.
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
