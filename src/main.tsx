import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, useRouteError } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { applyFavicon } from './config/applyFavicon.ts';
import { fetchConfig } from './config/fetchConfig.ts';
import { ConfigContext } from './contexts/configContext.ts';
import { AuthProvider } from './auth';
import { CustomizationProvider } from './contexts/CustomizationContext.tsx';
import { OrganisationsProvider } from './contexts/OrganisationsContext.tsx';

import ErrorPage from './components/common/ErrorPage.tsx';
import './i18n';
import { SessionProvider } from './contexts/SessionContext.tsx';

/** A render error anywhere in the app, in place of React Router's developer page. */
function RouteError() {
  const error = useRouteError();
  return <ErrorPage message={error instanceof Error ? error.message : String(error)} />;
}

fetchConfig().then(config => {
  applyFavicon(config.faviconPath);
  // A data router, so a form page can hold an in-app navigation for its discard dialog
  // (`useBlocker`, #282). One splat route: App's own <Routes> stay descendant routes.
  // The providers sit inside it so the signin callback can navigate (#31).
  const router = createBrowserRouter([
    {
      path: '*',
      errorElement: <RouteError />,
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
