import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'hathor:navRailExpanded';

/** Rail width in pixels when collapsed (icons only). */
export const RAIL_COLLAPSED_W = 64;
/** Rail width in pixels when expanded (icons + labels). */
export const RAIL_EXPANDED_W = 280;

interface NavRailContextType {
  expanded: boolean;
  toggle: () => void;
}

const NavRailContext = createContext<NavRailContextType | undefined>(undefined);

function readPersisted(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

interface NavRailProviderProps {
  children: ReactNode;
}

export function NavRailProvider({ children }: NavRailProviderProps) {
  const [expanded, setExpanded] = useState<boolean>(readPersisted);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(expanded));
    } catch {
      /* swallow — quota / private-mode failures are non-critical */
    }
  }, [expanded]);

  const toggle = useCallback(() => {
    setExpanded(v => !v);
  }, []);

  const value = useMemo(() => ({ expanded, toggle }), [expanded, toggle]);

  return <NavRailContext.Provider value={value}>{children}</NavRailContext.Provider>;
}

/**
 * Read the nav-rail's expanded state and its toggle action.
 * `expanded` controls icon-only (false, 64px) vs icons-and-labels (true, 280px)
 * on desktop, and mobile temporary-Drawer open/closed.
 */
export function useNavRail(): NavRailContextType {
  const ctx = useContext(NavRailContext);
  if (ctx === undefined) {
    throw new Error('useNavRail must be used within a NavRailProvider');
  }
  return ctx;
}
