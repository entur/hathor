import { useState, useEffect, type RefObject } from 'react';

const COMPACT_THRESHOLD = 700;

export function useCompactView(
  ref: RefObject<HTMLDivElement | null>,
  disabled: boolean = false
): boolean {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (disabled || !el) {
      if (width !== 0) setWidth(0);
      return;
    }

    const obs = new ResizeObserver(entries => {
      for (const e of entries) setWidth(e.contentRect.width);
    });

    obs.observe(el);
    setWidth(el.offsetWidth);

    return () => {
      obs.unobserve(el);
      obs.disconnect();
    };
  }, [ref, width, disabled]);

  return width > 0 && width < COMPACT_THRESHOLD;
}
