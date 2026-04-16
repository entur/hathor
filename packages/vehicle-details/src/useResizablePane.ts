import { useState, useEffect, useCallback, useRef } from 'react';

export function useResizablePane(initialTopFraction = 0.6) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [topFraction, setTopFraction] = useState(initialTopFraction);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const fraction = (e.clientY - rect.top) / rect.height;
      const clamped = Math.min(Math.max(fraction, 0.15), 0.85);
      setTopFraction(clamped);
    },
    [isResizing]
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

  const onMouseDown = useCallback(() => setIsResizing(true), []);

  return { containerRef, topFraction, isResizing, onMouseDown };
}
