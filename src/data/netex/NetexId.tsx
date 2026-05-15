import { Box, Chip, type ChipProps } from '@mui/material';

const ID_FONT_SIZE = '0.875rem';
const VER_FONT_SIZE = '0.6875rem';
const OUTER_HEIGHT = 32;
const VER_HEIGHT = 20;
const SEP = ':';
const MISSING = '???';

interface NetexParts {
  code: string;
  type: string;
  value: string;
}

/**
 * Split a NeTEx id into `CODESPACE:TYPE:VALUE`. When fewer than 3 segments
 * are present, missing leftmost segments are filled with `???` — the
 * rightmost segment is always treated as VALUE. Empty CODESPACE or TYPE
 * inside a 3-segment id also render as `???`. Colons inside VALUE are
 * preserved.
 */
function partsFor(id: string): NetexParts {
  const segs = id.split(SEP);
  if (segs.length >= 3) {
    return {
      code: segs[0] || MISSING,
      type: segs[1] || MISSING,
      value: segs.slice(2).join(SEP),
    };
  }
  if (segs.length === 2) {
    return { code: MISSING, type: segs[0] || MISSING, value: segs[1] };
  }
  return { code: MISSING, type: MISSING, value: segs[0] ?? '' };
}

interface NetexIdProps extends Omit<ChipProps, 'label' | 'size'> {
  /** Full NeTEx id of the form `CODESPACE:TYPE:VALUE`, e.g. `NMR:Vehicle:abc-123`. */
  id: string;
  /** Optional version; rendered as a nested chip labelled `vN`. */
  version?: string | number;
}

/**
 * Read-only chip rendering a NeTEx id, with the optional version surfaced as
 * a small nested chip (`vN`) inside the outer chip. Monospace label for
 * legibility; outlined outer + filled inner so the version reads as a badge.
 */
export default function NetexId({ id, version, sx, variant = 'outlined', ...rest }: NetexIdProps) {
  const { code, type, value } = partsFor(id);
  const labelNode = (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
      <span>
        {`${code}${SEP}${type}${SEP}`}
        <Box component="strong" sx={{ fontWeight: 700 }}>
          {value}
        </Box>
      </span>
      {version != null && (
        <Chip
          label={`v${version}`}
          size="small"
          variant="filled"
          data-testid="netex-id-version"
          sx={{
            height: VER_HEIGHT,
            fontFamily: 'monospace',
            fontSize: VER_FONT_SIZE,
            '& .MuiChip-label': { px: 0.75 },
          }}
        />
      )}
    </Box>
  );
  return (
    <Chip
      label={labelNode}
      variant={variant}
      data-testid="netex-id"
      sx={{
        height: OUTER_HEIGHT,
        fontFamily: 'monospace',
        fontSize: ID_FONT_SIZE,
        maxWidth: '100%',
        '& .MuiChip-label': { display: 'flex', alignItems: 'center' },
        ...sx,
      }}
      {...rest}
    />
  );
}
