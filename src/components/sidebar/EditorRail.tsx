import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Side } from './Sidebar.tsx';

const SEGMENT_SIZE = 40;
const SPINNER_SIZE = 18;
const RESIZER_WIDTH_PX = 3;
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
  /** Omit to hide the Save segment. Save is also hidden when `mode !== 'edit'`. */
  onSave?: () => void | Promise<void>;
  isDirty?: boolean;
  saving?: boolean;
  /** Sidebar side this rail decorates. Drives positioning and chevron direction. */
  side?: Side;
}

/**
 * Composite sidebar-edge control: vertical segmented rail anchored at the
 * sidebar's content-facing edge. View mode shows collapse + pen; edit mode
 * shows collapse + cancel + save. Replaces the standalone chrome
 * ToggleButton + per-feature Edit chip + Save button + Close button trio.
 * Reads `--sidebar-width` and `--app-header-height` CSS variables (set by
 * the chrome) to position itself outside the sidebar's overflow context via
 * `position: fixed`.
 */
export default function EditorRail({
  onCollapse,
  mode,
  onEnterEdit,
  onCancelEdit,
  onSave,
  isDirty = false,
  saving = false,
  side = 'left',
}: EditorRailProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState<'collapse' | 'cancel' | null>(null);

  const isEdit = mode === 'edit';
  const showPen = mode === 'view' && onEnterEdit != null;
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
    : isDirty
      ? t('save', 'Save')
      : t('vehicles.rail.saveDisabled', 'Save (no changes)');

  return (
    <>
      <Box
        data-testid="editor-rail"
        sx={{
          position: 'fixed',
          top: 'var(--app-header-height, 64px)',
          [side]: `calc(var(--sidebar-width, 0px) + ${RESIZER_WIDTH_PX}px)`,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          boxShadow: theme.shadows[3],
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
                sx={{ width: SEGMENT_SIZE, height: SEGMENT_SIZE, borderRadius: 0 }}
              >
                <EditIcon />
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
                sx={{ width: SEGMENT_SIZE, height: SEGMENT_SIZE, borderRadius: 0 }}
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
                  disabled={!isDirty || saving}
                  sx={{ width: SEGMENT_SIZE, height: SEGMENT_SIZE, borderRadius: 0 }}
                >
                  {saving ? <CircularProgress size={SPINNER_SIZE} color="inherit" /> : <SaveIcon />}
                </IconButton>
              </span>
            </Tooltip>
          </>
        )}
      </Box>

      <Dialog open={confirming != null} onClose={() => setConfirming(null)}>
        <DialogTitle>{t('vehicles.discardTitle', 'Discard unsaved changes?')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('vehicles.discardBody', 'You have unsaved edits on this vehicle.')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirming(null)}>{t('cancel', 'Cancel')}</Button>
          <Button color="error" onClick={handleDiscard}>
            {t('discard', 'Discard')}
          </Button>
          {onSave && (
            <Button variant="contained" onClick={handleSaveFromDialog}>
              {t('save', 'Save')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
