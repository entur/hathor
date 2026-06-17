import { useState, useEffect, useCallback } from 'react';
import type { Side } from '../components/sidebar/Sidebar.tsx';

const MIN_W = 100,
  MAX_W_RATIO = 0.8;

export function useResizableSidebar(
  initialWidth: number | (() => number) = 300,
  initialCollapsed = false,
  side: Side = 'left'
) {
  // Accepts a lazy initialiser so callers can defer a `window.innerWidth`
  // read to first mount instead of recomputing it every render (#77 N8).
  const [width, setWidth] = useState<number>(initialWidth);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || collapsed) return;
      const newW = side === 'left' ? e.clientX : window.innerWidth - e.clientX;
      const max = window.innerWidth * MAX_W_RATIO;
      if (newW > MIN_W && newW < max) setWidth(newW);
    },
    [isResizing, collapsed, side]
  );

  const handleMouseUp = useCallback(() => setIsResizing(false), []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const toggle = useCallback(() => setCollapsed(prev => !prev), []);

  return {
    width,
    collapsed,
    isResizing,
    setIsResizing,
    toggle,
  };
}
