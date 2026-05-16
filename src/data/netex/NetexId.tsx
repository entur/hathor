import { type MouseEvent, useEffect, useRef, useState } from 'react';
import { Box, Chip, type ChipProps, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';

const COPY_FEEDBACK_MS = 1500;
const COPY_CLS = 'netex-id-copy';
const SEP = ':';
const MISSING = '???';
const RADIUS_FACTOR = 3;

export type NetexIdSize = 'xsmall' | 'small' | 'medium' | 'large';

interface SizeSpec {
  idFont: string;
  verFont: string;
  outer: number;
  ver: number;
  btn: number;
  icon: number;
  gap: number;
}

const SIZES: Record<NetexIdSize, SizeSpec> = {
  xsmall: {
    idFont: '0.625rem',
    verFont: '0.5rem',
    outer: 20,
    ver: 13,
    btn: 14,
    icon: 9,
    gap: 0.375,
  },
  small: {
    idFont: '0.75rem',
    verFont: '0.625rem',
    outer: 24,
    ver: 16,
    btn: 16,
    icon: 11,
    gap: 0.5,
  },
  medium: {
    idFont: '0.875rem',
    verFont: '0.6875rem',
    outer: 32,
    ver: 20,
    btn: 20,
    icon: 14,
    gap: 0.75,
  },
  large: { idFont: '1rem', verFont: '0.8125rem', outer: 40, ver: 26, btn: 26, icon: 17, gap: 1 },
};

const CHIP_GRADIENT_LIGHT = 'linear-gradient(180deg, #ffffff 0%, #f0f1f3 55%, #e3e5e9 100%)';
const CHIP_GRADIENT_DARK =
  'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 55%, rgba(0,0,0,0.18) 100%)';
const CHIP_SHADOW_LIGHT =
  'inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.12)';
const CHIP_SHADOW_DARK =
  'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.5)';

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

/**
 * Controls the copy-to-clipboard button.
 * - `'hide'` (default) renders nothing.
 * - `'show'` renders the button always.
 * - `'onHover'` reveals the button on hover/focus, so the chip expands then.
 */
export type NetexIdCopy = 'show' | 'hide' | 'onHover';

interface NetexIdProps extends Omit<ChipProps, 'label' | 'size'> {
  /** Full NeTEx id of the form `CODESPACE:TYPE:VALUE`, e.g. `NMR:Vehicle:abc-123`. */
  id: string;
  /** Optional version; rendered as a nested chip labelled `vN`. */
  version?: string | number;
  /** Copy-button visibility toggle. Defaults to `'hide'`. */
  copy?: NetexIdCopy;
  /** Scales the chip and all sub-elements proportionally. Defaults to `'medium'`. */
  size?: NetexIdSize;
}

/**
 * Read-only chip rendering a NeTEx id, with the optional version surfaced as
 * a small nested chip (`vN`) inside the outer chip. Monospace label for
 * legibility; outlined outer + filled inner so the version reads as a badge.
 */
export default function NetexId({
  id,
  version,
  copy = 'hide',
  size = 'medium',
  sx,
  variant = 'outlined',
  ...rest
}: NetexIdProps) {
  const { t } = useTranslation();
  const { code, type, value } = partsFor(id);
  const dim = SIZES[size];
  const showCopy = copy !== 'hide';
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    []
  );
  const onCopyClick = (e: MouseEvent) => {
    e.stopPropagation();
    void navigator.clipboard.writeText(id);
    setCopied(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
  };
  const copyTooltip = t(copied ? 'netex.copied' : 'netex.copyId', copied ? 'Copied!' : 'Copy id');
  const labelNode = (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: dim.gap }}>
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
            height: dim.ver,
            borderRadius: dim.ver / 2,
            fontFamily: 'monospace',
            fontSize: dim.verFont,
            '& .MuiChip-label': { px: 0.75 },
          }}
        />
      )}
      {showCopy && (
        <Tooltip title={copyTooltip}>
          <IconButton
            size="small"
            onClick={onCopyClick}
            className={COPY_CLS}
            data-testid="netex-id-copy"
            aria-label={copyTooltip}
            sx={{
              width: dim.btn,
              height: dim.btn,
              p: 0,
              '& svg': { fontSize: dim.icon },
            }}
          >
            {copied ? <CheckIcon fontSize="inherit" /> : <ContentCopyIcon fontSize="inherit" />}
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
  const hoverSx =
    copy === 'onHover'
      ? {
          [`& .${COPY_CLS}`]: { display: 'none' },
          [`&:hover .${COPY_CLS}, &:focus-within .${COPY_CLS}`]: { display: 'inline-flex' },
        }
      : {};
  return (
    <Chip
      label={labelNode}
      variant={variant}
      data-testid="netex-id"
      sx={{
        height: dim.outer,
        borderRadius: dim.outer / RADIUS_FACTOR,
        fontFamily: 'monospace',
        fontSize: dim.idFont,
        maxWidth: '100%',
        background: theme =>
          theme.palette.mode === 'dark' ? CHIP_GRADIENT_DARK : CHIP_GRADIENT_LIGHT,
        boxShadow: theme => (theme.palette.mode === 'dark' ? CHIP_SHADOW_DARK : CHIP_SHADOW_LIGHT),
        '& .MuiChip-label': { display: 'flex', alignItems: 'center' },
        ...hoverSx,
        ...sx,
      }}
      {...rest}
    />
  );
}
