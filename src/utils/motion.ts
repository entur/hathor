/** `prefers-reduced-motion`, as a media query (for `matchMedia`) and as an
 *  `sx` / CSS-in-JS at-rule key. */
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const REDUCED_MOTION_MEDIA = `@media ${REDUCED_MOTION_QUERY}`;

/** A `MuiSkeleton` root style that stops its wave under reduced motion — MUI ships no guard of
 *  its own. The wave runs on the skeleton's `::after`, which `animation` doesn't reach from the
 *  root, so the shimmer is hidden. Every theme the app builds carries it. */
export const STILL_SKELETON = {
  [REDUCED_MOTION_MEDIA]: { animation: 'none', '&::after': { display: 'none' } },
};
