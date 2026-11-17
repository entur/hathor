import { createContext, useCallback, useState, useContext, type ReactNode } from 'react';
import { useConfig } from './configContext.ts';

const LOCAL_STORAGE_KEY = 'themeConfig';

interface CustomizationContextType {
  /** The deployment's `themeConfigs`; Settings shows a picker when there are two or more. */
  themes: string[];
  /** The active theme: the stored pick while the deployment still lists it, else `themes[0]`. */
  themePath: string | undefined;
  /** Picks a theme and remembers it in localStorage. */
  setThemePath: (path: string) => void;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider = ({ children }: { children: ReactNode }) => {
  const themes = useConfig().themeConfigs ?? [];
  const [stored, setStored] = useState(() => localStorage.getItem(LOCAL_STORAGE_KEY));

  // Stable: `useAppTheme` calls it back when a switch fails.
  const setThemePath = useCallback((path: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, path);
    setStored(path);
  }, []);

  const themePath = stored && themes.includes(stored) ? stored : themes[0];

  return (
    <CustomizationContext.Provider value={{ themes, themePath, setThemePath }}>
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};
