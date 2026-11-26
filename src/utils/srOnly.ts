/** `sx` for screen-reader-only text (as @mui/utils `visuallyHidden` — a transitive dep, not ours). */
export const SR_ONLY = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
} as const;
