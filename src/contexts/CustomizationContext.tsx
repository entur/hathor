import { createContext, useState, useContext, useEffect, type ReactNode, useCallback } from 'react';

const LOCAL_STORAGE_KEY = 'useCustomFeatures';
const EXPERIMENTAL_LOCAL_STORAGE_KEY = 'useExperimental';
const CUSTOM_FEATURES_DEFAULT = true,
  EXPERIMENTAL_DEFAULT = false;

interface CustomizationContextType {
  useCustomFeatures: boolean;
  toggleCustomFeatures: () => void;
  setCustomFeatures: (enabled: boolean) => void;
  useExperimental: boolean;
  toggleExperimental: () => void;
  setExperimental: (enabled: boolean) => void;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

/**
 * Reads a persisted boolean flag, falling back to `def` when absent, unparseable,
 * or not actually a boolean — localStorage is user-writable, so a hand-edited or
 * legacy `"1"`/`"null"` must not reach a Switch's `checked`.
 *
 * @param key localStorage key.
 * @param def Value used when nothing usable is stored.
 * @returns The stored boolean, or `def`.
 */
const readFlag = (key: string, def: boolean): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) return def;
  const stored = localStorage.getItem(key);
  if (stored === null) return def;
  try {
    const v: unknown = JSON.parse(stored);
    return typeof v === 'boolean' ? v : def;
  } catch {
    return def;
  }
};

export const CustomizationProvider = ({ children }: { children: ReactNode }) => {
  const [useCustomFeatures, setUseCustomFeaturesState] = useState<boolean>(() =>
    readFlag(LOCAL_STORAGE_KEY, CUSTOM_FEATURES_DEFAULT)
  );
  const [useExperimental, setUseExperimentalState] = useState<boolean>(() =>
    readFlag(EXPERIMENTAL_LOCAL_STORAGE_KEY, EXPERIMENTAL_DEFAULT)
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(useCustomFeatures));
    }
  }, [useCustomFeatures]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(EXPERIMENTAL_LOCAL_STORAGE_KEY, JSON.stringify(useExperimental));
    }
  }, [useExperimental]);

  const toggleCustomFeatures = useCallback(() => {
    setUseCustomFeaturesState(prev => !prev);
  }, []);

  const setCustomFeatures = useCallback((enabled: boolean) => {
    setUseCustomFeaturesState(enabled);
  }, []);

  const toggleExperimental = useCallback(() => {
    setUseExperimentalState(prev => !prev);
  }, []);

  const setExperimental = useCallback((enabled: boolean) => {
    setUseExperimentalState(enabled);
  }, []);

  return (
    <CustomizationContext.Provider
      value={{
        useCustomFeatures,
        toggleCustomFeatures,
        setCustomFeatures,
        useExperimental,
        toggleExperimental,
        setExperimental,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

/**
 * Access the customization flags (custom theme/icons, experimental features).
 *
 * @returns Flags plus their toggle/set actions.
 * @throws When called outside a `CustomizationProvider`.
 */
export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};
