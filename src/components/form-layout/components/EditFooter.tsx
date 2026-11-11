/**
 * Save/Cancel footer for an edit session, at the end of the form in normal flow
 * (#293: sticky, it hid the focused field — WCAG 2.4.11).
 *
 * Purely presentational: it owns no state and performs no save. A host feeds it
 * from `useFormSession()`'s `footer`, or from its own state when it drives the
 * presentational form directly.
 *
 * Lit when there is something to act on — the signal that distinguishes
 * "nothing to lose" from "unsaved work" without the host having to read the
 * form's internals. Save stays enabled (Linje Button): a click with nothing to
 * save, or a required field missing, says so instead of saving.
 */
import { useState } from 'react';
import { Box, Button, Stack, Typography, type ButtonProps } from '@mui/material';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';

// Status dot geometry + the halo it pulses out to while dirty.
const DOT_PX = 8,
  PULSE_SCALE = 2.8,
  PULSE_MS = 1600;
// Keyframe names are global in Emotion — prefix to avoid colliding with a host's.
const PULSE_KEYFRAMES = 'hathorEditFooterPulse';
// Tint strength for the dirty footer band.
const DIRTY_TINT = 0.08;

/** Every user-visible string, so a host can localize without an i18n dep here. */
export interface EditFooterLabels {
  save?: string;
  cancel?: string;
  /** Status shown after a successful save (`saved`); a fresh, untouched form shows none. */
  saved?: string;
  /** Status shown while the form has unsaved edits. */
  dirty?: string;
  /** Status shown while a save is in flight. */
  saving?: string;
  /** Status shown while dirty but `canSubmit` is false. */
  missing?: string;
  /** Status shown after a Save click with nothing to save. */
  nothing?: string;
}

const DEFAULT_LABELS: Required<EditFooterLabels> = {
  save: 'Save',
  cancel: 'Cancel',
  saved: 'All changes saved',
  dirty: 'Unsaved changes',
  saving: 'Saving…',
  missing: 'Required fields missing',
  nothing: 'No changes to save',
};

/** Per-button MUI overrides. The controlled props — `disabled`, `onClick` and
 *  the label — are applied after these, so the footer's contract holds whatever a
 *  host passes. */
export interface EditFooterSlotProps {
  save?: ButtonProps;
  cancel?: ButtonProps;
}

export interface EditFooterProps {
  /** Whether the form diverges from the entity the server last returned. */
  dirty: boolean;
  /** A save is in flight — locks both actions. */
  saving?: boolean;
  /** Lock both actions regardless of `dirty` (e.g. the form is still loading). */
  disabled?: boolean;
  /** Extra Save gate, as `EditorActions.canSubmit`: false while a required field is
   *  missing. Save then says so instead of saving; Cancel can still discard. Default `true`. */
  canSubmit?: boolean;
  /** The last save succeeded and nothing changed since — e.g. `useEntityEditor().saved`.
   *  Without it a clean form stays silent: no status on entering a form. */
  saved?: boolean;
  /** Fired only with something to save and nothing missing. */
  onSave: () => void;
  /** Discard edits. Fired only when there is something to discard. */
  onCancel: () => void;
  labels?: EditFooterLabels;
  /** Per-button MUI overrides (variant, colour, size…). */
  slotProps?: EditFooterSlotProps;
  /** Applied after every default, so a host can restyle the band — including
   *  `backgroundImage: 'none'` to drop the dirty tint. */
  sx?: SxProps<Theme>;
}

/**
 * Render the action footer for an edit session.
 *
 * @param props see {@link EditFooterProps}
 * @returns a status line paired with Cancel (inert unless `dirty`) and Save
 */
export function EditFooter({
  dirty,
  saving = false,
  disabled = false,
  canSubmit = true,
  saved = false,
  onSave,
  onCancel,
  labels,
  slotProps,
  sx,
}: EditFooterProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  // While saving, a discard would restore a baseline the in-flight request is about to replace.
  const locked = saving || disabled;
  // Nothing to discard while clean.
  const inert = !dirty || locked;
  // A clean Save click says "nothing to save" until the form changes.
  const [nothing, setNothing] = useState(false);
  if (dirty && nothing) setNothing(false);
  const save = () => {
    if (!dirty) setNothing(true);
    else if (canSubmit) onSave();
  };
  const status = saving
    ? l.saving
    : nothing
      ? l.nothing
      : dirty
        ? canSubmit
          ? l.dirty
          : l.missing
        : saved
          ? l.saved
          : '';

  return (
    <Box
      sx={[
        {
          mt: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          px: { xs: 2, sm: 3 },
          py: 1.5,
          borderTop: 1,
          borderColor: dirty ? 'warning.main' : 'divider',
          // The dirty tint rides on the surface as a flat gradient — the same trick MUI
          // uses for dark-mode elevation overlays — so a host's background shows through
          // the same whatever the state.
          backgroundColor: 'background.paper',
          backgroundImage: theme => {
            if (!dirty) return 'none';
            const tint = alpha(theme.palette.warning.main, DIRTY_TINT);
            return `linear-gradient(${tint}, ${tint})`;
          },
          transition: theme =>
            theme.transitions.create(['background-color', 'border-color'], {
              duration: theme.transitions.duration.short,
            }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* `role=status` so the dirty/saving transition is announced, not just drawn. */}
      <Stack direction="row" alignItems="center" spacing={1} role="status">
        {/* The live region stays mounted while silent, so the first status is still announced. */}
        <Box
          sx={{
            display: status ? 'inline-flex' : 'none',
            position: 'relative',
            width: DOT_PX,
            height: DOT_PX,
          }}
        >
          <Box
            sx={{
              width: DOT_PX,
              height: DOT_PX,
              borderRadius: '50%',
              // `main` is where the Linje status tokens land (#259); `light`/`dark` are MUI-derived.
              bgcolor: dirty ? 'warning.main' : 'success.main',
              transition: theme => theme.transitions.create('background-color'),
            }}
          />
          {dirty && !saving && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                bgcolor: 'warning.main',
                animation: `${PULSE_KEYFRAMES} ${PULSE_MS}ms ease-out infinite`,
                [`@keyframes ${PULSE_KEYFRAMES}`]: {
                  '0%': { transform: 'scale(1)', opacity: 0.6 },
                  '70%, 100%': { transform: `scale(${PULSE_SCALE})`, opacity: 0 },
                },
                '@media (prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0 },
              }}
            />
          )}
        </Box>
        <Typography
          variant="caption"
          // Linje has no warning text colour (Canary text fails contrast) — the dot carries it.
          sx={{ color: dirty ? 'text.primary' : 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          {status}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          {...slotProps?.cancel}
          disabled={inert}
          onClick={onCancel}
        >
          {l.cancel}
        </Button>
        <Button
          variant="contained"
          size="small"
          {...slotProps?.save}
          disabled={locked}
          onClick={save}
        >
          {l.save}
        </Button>
      </Stack>
    </Box>
  );
}
