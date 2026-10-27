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
  /**
   * Shepet's bulk endpoint (`POST …/autosys/vehicles`): takes the plates as JSON and returns one
   * NeTEx `PublicationDelivery` for all of them (entur/shepet#39).
   */
  officialMotorVehicleRegistryProxy?: string;
  applicationEnv?: string;
  preferredNameNamespace?: string;
  claimsNamespace?: string;
  oidcConfig?: OidcClientSettings;
  themeFilePath?: string;
  /** Per-environment favicon, e.g. `/assets/M-favicon-prod.svg`; unset keeps index.html's. */
  faviconPath?: string;
  sandboxFeatures?: SandboxFeatures;
}

export const ConfigContext = React.createContext<Config>({});

export const useConfig = () => {
  return useContext(ConfigContext);
};
