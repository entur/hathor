import { useConfig, type Config, type SandboxFeatures } from '../contexts/configContext.ts';

/** A top-level `enable*` boolean in `Config`. */
type EnableFlag = Extract<keyof Config, `enable${string}`>;

/** A flag that gates UI: a `sandboxFeatures` key or a top-level `enable*` boolean. */
export type FeatureFlag = keyof SandboxFeatures | EnableFlag;

const isEnableFlag = (flag: FeatureFlag): flag is EnableFlag => flag.startsWith('enable');

/**
 * Whether `flag` is on in `config`. A missing key is off, so each environment
 * opts in explicitly.
 *
 * @param {Config} config - Runtime config from `config.json`.
 * @param {FeatureFlag} [flag] - The gating flag; omitted means the caller is not gated.
 * @returns {boolean} `true` when `flag` is omitted or set to `true`.
 */
export const isFeatureOn = (config: Config, flag?: FeatureFlag): boolean =>
  flag === undefined ||
  (isEnableFlag(flag) ? config[flag] : config.sandboxFeatures?.[flag]) === true;

/**
 * {@link isFeatureOn} bound to the runtime config, for components that gate UI.
 *
 * @returns {(flag?: FeatureFlag) => boolean} Whether `flag` is on (omitted → on).
 */
export const useIsFeatureOn = (): ((flag?: FeatureFlag) => boolean) => {
  const config = useConfig();
  return flag => isFeatureOn(config, flag);
};
