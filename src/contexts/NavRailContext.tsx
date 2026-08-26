import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'hathor:navRailExpanded';

/** Rail width in pixels when collapsed (icons only). */
export const RAIL_COLLAPSED_W = 64;
/** Rail width in pixels when expanded (icons + labels). */
export const RAIL_EXPANDED_W = 280;

interface NavRailContextType {
  /** Desktop rail expanded state; persisted to localStorage. */
  expanded: boolean;
  /** Toggle the desktop rail's expanded/collapsed state. */
  toggleExpanded: () => void;
  /** Mobile temporary-Drawer open state; session-only. */
  mobileOpen: boolean;
  /** Toggle the mobile drawer's open/closed state. */
  toggleMobile: () => void;
  /** Close the mobile drawer (used by nav-item click for nav-and-close). */
  closeMobile: () => void;
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
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Skip the first effect run so we don't write the just-read value back
  // to localStorage on every fresh mount (would pollute storage with
  // 'false' for users who never toggled).
  const skipInitialPersist = useRef(true);
  useEffect(() => {
    if (skipInitialPersist.current) {
      skipInitialPersist.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, String(expanded));
    } catch {
      /* swallow — quota / private-mode failures are non-critical */
    }
  }, [expanded]);

  const toggleExpanded = useCallback(() => {
    setExpanded(v => !v);
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen(v => !v);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const value = useMemo(
    () => ({ expanded, toggleExpanded, mobileOpen, toggleMobile, closeMobile }),
    [expanded, toggleExpanded, mobileOpen, toggleMobile, closeMobile]
  );

  return <NavRailContext.Provider value={value}>{children}</NavRailContext.Provider>;
}

/**
 * Read the nav-rail's state and actions. `expanded` controls icon-only
 * (false, 64px) vs icons-and-labels (true, 280px) on desktop, and is
 * persisted in localStorage. `mobileOpen` controls the temporary Drawer
 * on mobile and is session-only — persisted desktop state must not leak
 * into the mobile UX.
 */
export function useNavRail(): NavRailContextType {
  const ctx = useContext(NavRailContext);
  if (ctx === undefined) {
    throw new Error('useNavRail must be used within a NavRailProvider');
  }
  return ctx;
}
