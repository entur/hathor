import type { OidcClientSettings } from 'oidc-client-ts';
import React, { useContext } from 'react';

/**
 * Per-environment feature switches, enki's `sandboxFeatures` convention: one
 * key per feature, PascalCase. A missing key is off.
 */
export interface SandboxFeatures {
  /** `/deck-plans` route, nav-rail item, Home cards, deck-plan grid, details and renderer. */
  DeckPlans?: boolean;
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
  /**
   * Deck-plan references outside `/deck-plans`: the vehicle-type list column and
   * the multi-import deck-plan count. Independent of `sandboxFeatures.DeckPlans`.
   */
  enableDeckPlanRefs?: boolean;
}

/**
 * Every `Config` key. Typed as a full record so adding a key to `Config` without
 * listing it here fails `tsc`; `configKeys.test.ts` rejects config files with
 * keys not listed here.
 */
export const CONFIG_KEYS: Record<keyof Config, true> = {
  applicationBaseUrl: true,
  applicationImportBaseUrl: true,
  applicationGetAutosysUrl: true,
  applicationEnv: true,
  preferredNameNamespace: true,
  claimsNamespace: true,
  oidcConfig: true,
  themeFilePath: true,
  sandboxFeatures: true,
  enableDeckPlanRefs: true,
};

/** Every `SandboxFeatures` key; same contract as {@link CONFIG_KEYS}. */
export const SANDBOX_FEATURE_KEYS: Record<keyof SandboxFeatures, true> = {
  DeckPlans: true,
};

export const ConfigContext = React.createContext<Config>({});

export const useConfig = () => {
  return useContext(ConfigContext);
};
