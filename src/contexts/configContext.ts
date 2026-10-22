import type { OidcClientSettings } from 'oidc-client-ts';
import React, { useContext } from 'react';

/**
 * Per-environment feature flags, enki's `sandboxFeatures` convention: one key per
 * feature, PascalCase. A missing key is off.
 */
export interface SandboxFeatures {
  /**
   * Deck plans everywhere: the `/deck-plans` route, nav-rail item and Home cards,
   * plus the deck-plan column on /vehicle-types and the multi-import deck-plan count.
   */
  DeckPlans?: boolean;
  /** The SVV (Autosys) bulk import on Home. */
  AutosysImport?: boolean;
}

export interface Config {
  applicationBaseUrl?: string;
  applicationImportBaseUrl?: string;
  applicationGetAutosysUrl?: string;
  applicationEnv?: string;
  preferredNameNamespace?: string;
  claimsNamespace?: string;
  oidcConfig?: OidcClientSettings;
  themeFilePath?: string;
  sandboxFeatures?: SandboxFeatures;
}

export const ConfigContext = React.createContext<Config>({});

export const useConfig = () => {
  return useContext(ConfigContext);
};
