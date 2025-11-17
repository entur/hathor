import type { OidcClientSettings } from 'oidc-client-ts';
import React, { useContext } from 'react';

export interface Config {
  applicationBaseUrl?: string;
  applicationImportBaseUrl?: string;
  applicationGetAutosysUrl?: string;
  applicationEnv?: string;
  preferredNameNamespace?: string;
  claimsNamespace?: string;
  oidcConfig?: OidcClientSettings;
  themeFilePath?: string;
}

export const ConfigContext = React.createContext<Config>({});

export const useConfig = () => {
  return useContext(ConfigContext);
};
