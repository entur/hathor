import { useState } from 'react';
import { Box, CircularProgress, Divider, IconButton, Tooltip, useTheme } from '@mui/material';
import DiscardDialog from '../dialogs/DiscardDialog.tsx';
import {
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  Edit as EditIcon,
  Save as SaveIcon,
  Block as BlockIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Side } from './Sidebar.tsx';

const SEGMENT_SIZE = 40;
const SPINNER_SIZE = 18;
const DIVIDER_OPACITY = 0.35;

interface EditorRailProps {
  /** Always required; called when the user requests pane collapse (and confirms when dirty). */
  onCollapse: () => void;
  /** Current form mode. Omit to hide both pen and cancel segments (degraded mode). */
  mode?: 'view' | 'edit';
  /** Shown in view mode as the pen segment. Switches the host into edit mode. */
  onEnterEdit?: () => void;
  /** Shown in edit mode as the cancel segment. Host should revert form + return to view mode. Rail confirms when dirty. */
  onCancelEdit?: () => void;
  /** Shown in view mode as the deactivate segment. Fires the deactivation flow (which includes its own confirmation). */
  onDeactivate?: () => void;
  /** Omit to hide the Save segment. Save is also hidden when `mode !== 'edit'`. */
  onSave?: () => void | Promise<void>;
  isDirty?: boolean;
  saving?: boolean;
  /**
   * Additional Save gate (AND'd with `isDirty && !saving`). Default `true`.
   * Set to `false` when the form is dirty but missing a structurally required
   * field — e.g. a new Vehicle without a TransportTypeRef, which Sobek's
   * `vehicles()` resolver silently excludes from listings (create-but-invisible).
   */
  canSubmit?: boolean;
  /** Sidebar side this rail decorates. Drives positioning and chevron direction. */
  side?: Side;
}

/**
 * Composite sidebar-edge control: vertical segmented rail anchored at the
 * sidebar's content-facing edge. View mode shows collapse + pen; edit mode
 * shows collapse + cancel + save. Replaces the per-feature Edit chip +
 * Save button + Close button trio. Reads `--sidebar-width` and
 * `--app-header-height` CSS variables (set by the chrome) to position
 * itself outside the sidebar's overflow context via `position: fixed`.
 */
export default function EditorRail({
  onCollapse,
  mode,
  onEnterEdit,
  onDeactivate,
  onCancelEdit,
  onSave,
  isDirty = false,
  saving = false,
  canSubmit = true,
  side = 'left',
}: EditorRailProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState<'collapse' | 'cancel' | null>(null);

  const isEdit = mode === 'edit';
  const showPen = mode === 'view' && onEnterEdit != null;
  const showDeactivate = mode === 'view' && onDeactivate != null;
  const showCancel = isEdit && onCancelEdit != null;
  const showSave = onSave != null && isEdit;
  const collapseIcon =
    side === 'right' ? <KeyboardDoubleArrowRight /> : <KeyboardDoubleArrowLeft />;

  const handleCollapseClick = () => {
    if (isDirty) setConfirming('collapse');
    else onCollapse();
  };

  const handleCancelClick = () => {
    if (isDirty) setConfirming('cancel');
    else onCancelEdit?.();
  };

  const handleDiscard = () => {
    const which = confirming;
    setConfirming(null);
    if (which === 'collapse') onCollapse();
    else if (which === 'cancel') onCancelEdit?.();
  };

  const handleSaveFromDialog = async () => {
    setConfirming(null);
    if (onSave) await onSave();
  };

  const saveLabel = saving
    ? t('saving', 'Saving…')
    : !isDirty
      ? t('vehicles.rail.saveDisabled', 'Save (no changes)')
      : !canSubmit
        ? t('vehicles.rail.saveMissingFields', 'Save (required fields missing)')
        : t('save', 'Save');
  const saveDisabled = !isDirty || saving || !canSubmit;

  return (
    <>
      <Box
        data-testid="editor-rail"
        sx={{
          position: 'fixed',
          top: 'var(--app-header-height, 64px)',
          [side]: 'var(--sidebar-width, 0px)',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          boxShadow:
            side === 'right'
              ? '-3px 3px 6px rgba(0,0,0,0.12), -1px 1px 2px rgba(0,0,0,0.08)'
              : '3px 3px 6px rgba(0,0,0,0.12), 1px 1px 2px rgba(0,0,0,0.08)',
          borderRadius: side === 'right' ? '6px 0 0 6px' : '0 6px 6px 0',
          overflow: 'hidden',
          zIndex: theme.zIndex.fab,
        }}
      >
        <Tooltip title={t('vehicles.rail.collapse', 'Collapse')} placement="left" arrow>
          <IconButton
            onClick={handleCollapseClick}
            aria-label={t('vehicles.rail.collapseAria', 'Collapse pane')}
            data-testid="editor-rail-collapse"
            sx={{ width: SEGMENT_SIZE, height: SEGMENT_SIZE, borderRadius: 0 }}
          >
            {collapseIcon}
          </IconButton>
        </Tooltip>

        {showPen && (
          <>
            <Divider sx={{ opacity: DIVIDER_OPACITY }} />
            <Tooltip title={t('vehicles.rail.editTooltip', 'Edit')} placement="left" arrow>
              <IconButton
                onClick={onEnterEdit}
                aria-label={t('edit', 'Edit')}
                data-testid="editor-rail-edit"
                sx={{
                  width: SEGMENT_SIZE,
                  height: SEGMENT_SIZE,
                  borderRadius: 0,
                  color: 'primary.main',
                  '&:hover': { color: 'primary.dark' },
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </>
        )}

        {showDeactivate && (
          <>
            <Divider sx={{ opacity: DIVIDER_OPACITY }} />
            <Tooltip
              title={t('vehicles.rail.deactivateTooltip', 'Deactivate')}
              placement="left"
              arrow
            >
              <IconButton
                onClick={onDeactivate}
                aria-label={t('vehicles.rail.deactivateAria', 'Deactivate')}
                data-testid="editor-rail-deactivate"
                sx={{
                  width: SEGMENT_SIZE,
                  height: SEGMENT_SIZE,
                  borderRadius: 0,
                  color: 'primary.main',
                  '&:hover': { color: 'primary.dark' },
                }}
              >
                <BlockIcon />
              </IconButton>
            </Tooltip>
          </>
        )}

        {showCancel && (
          <>
            <Divider sx={{ opacity: DIVIDER_OPACITY }} />
            <Tooltip title={t('vehicles.rail.cancelTooltip', 'Cancel edit')} placement="left" arrow>
              <IconButton
                onClick={handleCancelClick}
                aria-label={t('vehicles.rail.cancelAria', 'Cancel edit')}
                data-testid="editor-rail-cancel"
                sx={{
                  width: SEGMENT_SIZE,
                  height: SEGMENT_SIZE,
                  borderRadius: 0,
                  color: isDirty ? 'primary.main' : 'inherit',
                  '&:hover': { color: isDirty ? 'primary.dark' : undefined },
                }}
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </>
        )}

        {showSave && (
          <>
            <Divider sx={{ opacity: DIVIDER_OPACITY }} />
            <Tooltip title={saveLabel} placement="left" arrow>
              <span>
                <IconButton
                  onClick={onSave}
                  aria-label={saveLabel}
                  data-testid="editor-rail-save"
                  disabled={saveDisabled}
                  sx={{
                    width: SEGMENT_SIZE,
                    height: SEGMENT_SIZE,
                    borderRadius: 0,
                    color: !saveDisabled ? 'primary.main' : 'inherit',
                    '&:hover': { color: !saveDisabled ? 'primary.dark' : undefined },
                  }}
                >
                  {saving ? <CircularProgress size={SPINNER_SIZE} color="inherit" /> : <SaveIcon />}
                </IconButton>
              </span>
            </Tooltip>
          </>
        )}
      </Box>

      <DiscardDialog
        open={confirming != null}
        onCancel={() => setConfirming(null)}
        onDiscard={handleDiscard}
        onSave={onSave ? handleSaveFromDialog : undefined}
      />
    </>
  );
}
