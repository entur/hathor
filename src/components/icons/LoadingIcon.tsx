import type { SVGProps } from 'react';
import { useMediaQuery } from '@mui/material';
import { REDUCED_MOTION_QUERY } from '../../utils/motion';

// enki's loader (`src/components/icons/Loading`): two quarter-dashed rings turning opposite ways.
const SIZE = 100,
  CENTER = 50,
  OUTER_R = 40,
  INNER_R = 35,
  STROKE = 4,
  INNER_OPACITY = 0.4,
  TURN = '2.4s';

/** Half of each ring is dash, half gap: two quarter arcs. */
const quarter = (r: number) => (Math.PI * r) / 2;

function Ring({
  r,
  dir,
  opacity,
  still,
}: {
  r: number;
  dir: 1 | -1;
  opacity?: number;
  still: boolean;
}) {
  return (
    <circle
      cx={CENTER}
      cy={CENTER}
      r={r}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeDasharray={`${quarter(r)} ${quarter(r)}`}
      strokeDashoffset={dir < 0 ? quarter(r) : undefined}
      opacity={opacity}
    >
      {/* SMIL ignores CSS `animation: none`, so reduced motion drops the element */}
      {!still && (
        <animateTransform
          attributeName="transform"
          type="rotate"
          values={`0 ${CENTER} ${CENTER};${dir * 360} ${CENTER} ${CENTER}`}
          dur={TURN}
          repeatCount="indefinite"
        />
      )}
    </circle>
  );
}

/**
 * enki's loading animation, drawn in `currentColor`; still under `prefers-reduced-motion`.
 *
 * @param {SVGProps<SVGSVGElement>} props passed to the `<svg>`
 * @returns {JSX.Element} the animated icon, hidden from assistive tech
 */
export default function LoadingIcon(props: SVGProps<SVGSVGElement>) {
  const still = useMediaQuery(REDUCED_MOTION_QUERY);
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <Ring r={OUTER_R} dir={1} still={still} />
      <Ring r={INNER_R} dir={-1} opacity={INNER_OPACITY} still={still} />
    </svg>
  );
}
