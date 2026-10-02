import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { fetchConfig } from './config/fetchConfig.ts';
import { ConfigContext } from './contexts/configContext.ts';
import { AuthProvider } from './auth';
import { CustomizationProvider } from './contexts/CustomizationContext.tsx';
import { OrganisationsProvider } from './contexts/OrganisationsContext.tsx';

import './i18n';
import { SessionProvider } from './contexts/SessionContext.tsx';

fetchConfig().then(config => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ConfigContext.Provider value={config}>
        {/* Router sits above AuthProvider so the signin callback can navigate (#31). */}
        <BrowserRouter>
          <AuthProvider>
            <SessionProvider>
              <OrganisationsProvider>
                <CustomizationProvider>
                  <App />
                </CustomizationProvider>
              </OrganisationsProvider>
            </SessionProvider>
          </AuthProvider>
        </BrowserRouter>
      </ConfigContext.Provider>
    </StrictMode>
  );
});
