import { useConfig, type SandboxFeatures } from '../contexts/configContext.ts';

/** A feature flag: a `sandboxFeatures` key in config.json. */
export type FeatureFlag = keyof SandboxFeatures;

/**
 * Reads `sandboxFeatures` from the runtime config. A missing key is off, so each
 * environment opts in explicitly.
 *
 * @returns {(flag?: FeatureFlag) => boolean} Whether `flag` is on; no flag means ungated.
 */
export const useIsFeatureOn = (): ((flag?: FeatureFlag) => boolean) => {
  const { sandboxFeatures } = useConfig();
  return flag => !flag || sandboxFeatures?.[flag] === true;
};
