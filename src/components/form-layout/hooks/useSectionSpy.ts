import { useEffect, useRef, type RefCallback } from 'react';
import { REDUCED_MOTION_QUERY } from '../../../utils/motion.ts';

/** The band a section must cross to count as "in view": the top 40% of the
 *  viewport. Narrower than the whole viewport so a section only takes over once
 *  it is actually being read, not when its heading peeks in at the bottom. */
const SPY_ROOT_MARGIN = '0px 0px -60% 0px';
/** Released by `scrollend` in practice; the timer covers a request that needs no
 *  scrolling at all (already in place), where that event never fires. */
const SCROLL_SETTLE_MS = 1000;
/** Sub-pixel scroll positions: "at the end" within this many pixels. */
const END_SLACK_PX = 1;
const SCROLLABLE = /auto|scroll|overlay/;

/** Nearest ancestor that scrolls vertically, else the document's own scroller. */
const scrollerOf = (el: Element | null): Element =>
  !el || el === document.body || el === document.documentElement
    ? (document.scrollingElement ?? document.documentElement)
    : SCROLLABLE.test(getComputedStyle(el).overflowY)
      ? el
      : scrollerOf(el.parentElement);

export interface SectionSpyOptions {
  /** Section labels, in document order. */
  labels: readonly string[];
  /** Off → no observer, no scrolling (the variants that aren't a scroll surface). */
  enabled: boolean;
  /** The section the host wants in view. */
  active?: string;
  /** Reports the section the reader has scrolled to. */
  onActiveChange?: (label: string) => void;
}

/**
 * Two-way link between stacked sections and whatever navigates them (a table of
 * contents, typically). Out: an `IntersectionObserver` reports the first section
 * inside the reading band — or the last one once the scroller is at its end,
 * since a short final section can never climb into the band. In: a changed
 * `active` scrolls that section into view.
 *
 * The two would feed each other — a requested scroll passes every section on the
 * way, and each would be reported back as the new `active` — so the observer is
 * muted until the scroll settles, and an `active` the hook itself reported is
 * never scrolled to.
 *
 * @param {SectionSpyOptions} options labels, the enabled flag, and the controlled pair
 * @returns {(label: string) => RefCallback<HTMLElement>} `register(label)` — the ref callback for that section's element
 */
export function useSectionSpy({
  labels,
  enabled,
  active,
  onActiveChange,
}: SectionSpyOptions): (label: string) => RefCallback<HTMLElement> {
  const nodes = useRef(new Map<string, HTMLElement>());
  // Seeded with the mount-time `active`, so mounting never scrolls the page: the
  // prop is a request only once it *changes*.
  const reported = useRef(active);
  const muted = useRef(false);
  // Set by the live observer, so a settled requested scroll can re-check the band.
  const reconcile = useRef<() => void>(() => {});
  const onActiveChangeRef = useRef(onActiveChange);
  useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
  }, [onActiveChange]);

  // JSON, not a delimiter: a layout key is any string, so no character is free
  // to separate them with.
  const order = JSON.stringify(labels);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return;
    const ordered = JSON.parse(order) as string[];
    const inBand = new Set<string>();
    const first = nodes.current.get(ordered[0]);
    const scroller = first && scrollerOf(first.parentElement);
    // `scrollTop > 0` keeps a view that does not scroll at all from counting as
    // "at its end" — there the band alone decides.
    const atEnd = (): boolean =>
      !!scroller &&
      scroller.scrollTop > 0 &&
      scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - END_SLACK_PX;
    const report = (): void => {
      if (muted.current) return;
      const next = atEnd() ? ordered.at(-1) : ordered.find(l => inBand.has(l));
      if (next === undefined || next === reported.current) return;
      reported.current = next;
      onActiveChangeRef.current?.(next);
    };
    // Only when the reader left the requested section: a pick that stays in the band
    // (say, near the page end, where the at-end rule would pick the last) is kept.
    reconcile.current = () => {
      if (!inBand.has(reported.current ?? '')) report();
    };
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          const label = (e.target as HTMLElement).dataset.section ?? '';
          if (e.isIntersecting) inBand.add(label);
          else inBand.delete(label);
        });
        report();
      },
      { rootMargin: SPY_ROOT_MARGIN }
    );
    ordered.map(l => nodes.current.get(l)).forEach(n => n && observer.observe(n));
    // Reaching the end changes no intersection, so the observer alone would
    // never notice it. Capture: `scroll` does not bubble out of a nested scroller.
    window.addEventListener('scroll', report, { capture: true, passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', report, { capture: true });
      reconcile.current = () => {};
    };
  }, [enabled, order]);

  useEffect(() => {
    if (!enabled || active === undefined || active === reported.current) return;
    const node = nodes.current.get(active);
    if (!node) return;
    reported.current = active;
    muted.current = true;
    const release = () => {
      muted.current = false;
    };
    // Settled: the reader may have stopped the scroll elsewhere, so report what is in view now.
    const settle = () => {
      release();
      reconcile.current();
    };
    // Capture: `scrollend` does not bubble out of a nested scroll container.
    window.addEventListener('scrollend', settle, { capture: true, once: true });
    const timer = setTimeout(settle, SCROLL_SETTLE_MS);
    node.scrollIntoView?.({
      behavior: window.matchMedia?.(REDUCED_MOTION_QUERY).matches ? 'auto' : 'smooth',
      block: 'start',
    });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scrollend', settle, { capture: true });
      // Torn down mid-scroll (a second request, or StrictMode's replay): forget
      // the claim, so whatever `active` holds next is honoured rather than
      // mistaken for something already in view.
      if (muted.current) reported.current = undefined;
      release();
    };
  }, [enabled, active]);

  return label => node => {
    if (node) nodes.current.set(label, node);
    else nodes.current.delete(label);
  };
}
