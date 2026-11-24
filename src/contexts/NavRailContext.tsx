import { createContext, useState, useCallback, useMemo, useContext, type ReactNode } from 'react';

// Linje SideNavigation (#418): always open on desktop. 21 rem (336 px at 16 px) fits the
// longest label, nb "Kontraktuelle kjøretøytyper" in bold (209 px Nationale, 208 px Arial)
// + 40 + 16 icon + 16 gap + 40 = 321 px, under Linje's 26 rem max; in rem it grows with the
// font size, and a longer label wraps. Re-measure when a menu label grows.
/** Side navigation width (desktop rail and mobile drawer). */
export const RAIL_W = '21rem';
/** Linje's desktop breakpoint (`breakpoints.large`): below it the side navigation is a drawer. */
export const NAV_DESKTOP_PX = 800;

interface NavRailContextType {
  /** Mobile temporary-Drawer open state; session-only. */
  mobileOpen: boolean;
  /** Toggle the mobile drawer's open/closed state. */
  toggleMobile: () => void;
  /** Close the mobile drawer (used by nav-item click for nav-and-close). */
  closeMobile: () => void;
}

const NavRailContext = createContext<NavRailContextType | undefined>(undefined);

interface NavRailProviderProps {
  children: ReactNode;
}

export function NavRailProvider({ children }: NavRailProviderProps) {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const toggleMobile = useCallback(() => {
    setMobileOpen(v => !v);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const value = useMemo(
    () => ({ mobileOpen, toggleMobile, closeMobile }),
    [mobileOpen, toggleMobile, closeMobile]
  );

  return <NavRailContext.Provider value={value}>{children}</NavRailContext.Provider>;
}

/**
 * Read the side navigation's state. Desktop shows it always open; `mobileOpen`
 * controls the temporary Drawer on mobile and is session-only.
 */
export function useNavRail(): NavRailContextType {
  const ctx = useContext(NavRailContext);
  if (ctx === undefined) {
    throw new Error('useNavRail must be used within a NavRailProvider');
  }
  return ctx;
}
