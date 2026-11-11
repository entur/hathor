/** `prefers-reduced-motion`, as a media query (for `matchMedia`) and as an
 *  `sx` / CSS-in-JS at-rule key. */
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const REDUCED_MOTION_MEDIA = `@media ${REDUCED_MOTION_QUERY}`;

/** `sx` that stops every MUI `Skeleton` wave inside under reduced motion — MUI
 *  ships no guard of its own. The wave runs on the skeleton's `::after`, and
 *  `animation` is not inherited, so the root alone is not enough. */
export const STILL_SKELETONS = {
  [REDUCED_MOTION_MEDIA]: {
    '& .MuiSkeleton-root, & .MuiSkeleton-root::after': { animation: 'none' },
  },
};
