import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { applyFavicon } from './config/applyFavicon.ts';
import { fetchConfig } from './config/fetchConfig.ts';
import { ConfigContext } from './contexts/configContext.ts';
import { AuthProvider } from './auth';
import { CustomizationProvider } from './contexts/CustomizationContext.tsx';
import { OrganisationsProvider } from './contexts/OrganisationsContext.tsx';

import './i18n';
import { SessionProvider } from './contexts/SessionContext.tsx';

fetchConfig().then(config => {
  applyFavicon(config.faviconPath);
  // A data router, so a form page can hold an in-app navigation for its discard dialog
  // (`useBlocker`, #282). One splat route: App's own <Routes> stay descendant routes.
  // The providers sit inside it so the signin callback can navigate (#31).
  const router = createBrowserRouter([
    {
      path: '*',
      element: (
        <AuthProvider>
          <SessionProvider>
            <OrganisationsProvider>
              <CustomizationProvider>
                <App />
              </CustomizationProvider>
            </OrganisationsProvider>
          </SessionProvider>
        </AuthProvider>
      ),
    },
  ]);
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ConfigContext.Provider value={config}>
        <RouterProvider router={router} />
      </ConfigContext.Provider>
    </StrictMode>
  );
});
