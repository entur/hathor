import { useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { useBlocker } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import NetexId from '../NetexId.tsx';
import BodyState from '../feedback/BodyState.tsx';
import SaveToast from '../feedback/SaveToast.tsx';
import { PAGE_GUTTER_VAR } from '../Menu.tsx';
import type { EntityEditor } from '../../hooks/useEntityEditor.ts';
import { useDiscardConfirm } from '../dialogs/useDiscardConfirm.tsx';
import DeactivateDialog from '../dialogs/DeactivateDialog.tsx';
import DiscardDialog from '../dialogs/DiscardDialog.tsx';
import {
  EditFooter,
  FormFooterContext,
  FORM_COLUMN_ATTR,
  FORM_PAGE_MAX_WIDTH,
  FORM_SIDE_VAR,
  RING_GUTTER,
  formColumnWidth,
  NARROW_ATTR,
} from '../form-layout/index.ts';

/** The i18n keys a feature's editor copy lives under. */
export interface EditorCopy {
  title: string;
  notFound: string;
  saved: string;
  deactivateTitle: string;
  deactivateMessage: string;
}

/** A page heading takes focus as it appears (a skeleton until the record loads), so a
 *  screen reader lands on the record. Module-level: a stable ref fires once per mount. */
const focusOnMount = (el: HTMLElement | null) => el?.focus();
// Not in the tab order, so no focus ring — clipped by the frame, it showed as a stray edge.
const HEADING_NO_RING = { '&:focus': { outline: 'none' } };
// Below this the title block takes the whole row and the actions wrap under it.
const TITLE_MIN = '16rem';
// The loading title row: the loaded one's height (40 px buttons), a name and an id badge.
const TITLE_ROW_PX = 40,
  TITLE_SKELETON_W = '40%',
  ID_SKELETON_PX = 160,
  ID_SKELETON_H_PX = 24;

/** The middle of the form column's content (viewport px), under `root`; undefined without one. */
const formColumnCenter = (root: HTMLElement | null): number | undefined => {
  const col = root?.querySelector(`[${FORM_COLUMN_ATTR}]`);
  if (!col) return undefined;
  const r = col.getBoundingClientRect(),
    cs = getComputedStyle(col);
  // Its padding, not its box: from `lg` the box reaches out over the page's side (#435).
  const left = r.left + parseFloat(cs.paddingLeft),
    right = r.right - parseFloat(cs.paddingRight);
  return (left + right) / 2;
};

/** The form page's width cap: {@link FORM_PAGE_MAX_WIDTH}, or a narrow form's. */
const CAP_VAR = '--form-cap';
/** PageShell's gutter; 0 outside it. */
const GUTTER = `var(${PAGE_GUTTER_VAR}, 0px)`;

/** The page: from `lg` it stays put and the form column scrolls itself (`FormSections`, #293). */
const FRAME_SX = (t: Theme) => ({
  height: '100%',
  // Capped, and centred in the page; the title row's actions end above column 3.
  [CAP_VAR]: FORM_PAGE_MAX_WIDTH,
  // A body with no column 3 (`FormSections`) is one narrow column: the page shrinks to it.
  [`&:has([${NARROW_ATTR}])`]: { [CAP_VAR]: formColumnWidth(t) },
  // Out over PageShell's gutters to the page's edges and padded back in, so the side strips
  // are inside the scroller (#435). The ring's room: it clips, and fields and buttons line its edges.
  [FORM_SIDE_VAR]: `calc(${GUTTER} + ${t.spacing(RING_GUTTER)} + max(0px, (100cqw - var(${CAP_VAR})) / 2))`,
  mx: `calc(-1 * ${GUTTER})`,
  px: `var(${FORM_SIDE_VAR})`,
  py: RING_GUTTER,
  display: 'flex',
  flexDirection: 'column',
  overflowY: { xs: 'auto', lg: 'hidden' },
});
/** The body fills the rest from `lg`, so the form column can scroll inside it. */
const BODY_SX = {
  flex: { lg: '1 1 0' },
  minHeight: { lg: 0 },
  display: { lg: 'flex' },
  flexDirection: 'column',
} as const;

interface EditorFrameProps<T, F> {
  editor: EntityEditor<T, F>;
  /** The form's entity: its typed name heads the pane unless `title` is set (blank →
   *  `[ unnamed ]`), its id the NetexId badge. */
  entity: { id?: string; version?: number; name?: { value?: string } };
  /** The record's display name (#290), the feature's `<entity>Title(form)`. */
  title?: string;
  /** Test-id stem: `<testId>-details-title`, `<testId>-record-fetch-error`. */
  testId: string;
  copy: EditorCopy;
  /** The form's shape while the first read is in flight, drawn in the frame below a title
   *  skeleton: the feature's `FormSkeleton` (`<Entity>SectionsSkeleton`). */
  skeleton: ReactElement;
  /** The feature's form (and any context rows above it). */
  children: ReactNode;
}

/**
 * Holds an in-app navigation away from a dirty form page (Menu, browser Back, the page's
 * own Back) for the {@link DiscardDialog}: Discard lets it through, Cancel stays, Save
 * saves and stays. A replace is the app re-addressing the record (a create's redirect to
 * its minted id), not the reader leaving, so it passes. Needs the data router (#282).
 * shortcut: any replace off a dirty page skips the dialog; move a create's `onCreated` past
 * its clean re-render if another replace ever leaves a form page.
 */
function LeaveGuard({ dirty, onSave }: { dirty: boolean; onSave?: () => void | Promise<void> }) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation, historyAction }) =>
      dirty && historyAction !== 'REPLACE' && currentLocation.pathname !== nextLocation.pathname
  );
  return (
    <DiscardDialog
      open={blocker.state === 'blocked'}
      onCancel={() => blocker.reset?.()}
      onDiscard={() => blocker.proceed?.()}
      onSave={
        onSave &&
        (async () => {
          blocker.reset?.();
          await onSave();
        })
      }
    />
  );
}

/**
 * The form page every entity editor shares (#282): skeleton, not-found body, title +
 * {@link NetexId}, the read-error body and the save snackbars. The feature supplies only
 * its body. The form opens ready to edit: Back and Deactivate are text buttons in the
 * title row, Save / Cancel a sticky {@link EditFooter}, and a {@link LeaveGuard} asks
 * before unsaved edits are left behind. A confirmed Deactivate freezes the page under a
 * red "Deactivated" for the rest of the visit.
 *
 * @param {EditorFrameProps<T, F>} props Editor state, entity, copy keys, skeleton and body.
 * @returns {JSX.Element} The editor pane.
 */
export default function EditorFrame<T, F>({
  editor,
  entity,
  title,
  testId,
  copy,
  skeleton,
  children,
}: EditorFrameProps<T, F>) {
  const { t } = useTranslation();
  const { actions } = editor;
  const heading = 'h1';
  const headingFocus = { ref: focusOnMount, tabIndex: -1 };
  // Cancel reverts in place, once confirmed. The dialogs' Save follows the footer's gates: none while clean (a save that landed with
  // the leave dialog open), while a save runs, or with a required field missing.
  const dialogSave =
    !actions.isDirty || actions.saving || !actions.canSubmit ? undefined : actions.onSave;
  const discard = useDiscardConfirm(actions.isDirty, { cancel: actions.onCancel }, dialogSave);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const frozen = editor.isDeactivated;
  // The save toasts sit on the form column's centre line, clear of the footer's Cancel / Save.
  const frameRef = useRef<HTMLDivElement>(null);
  const [toastX, setToastX] = useState<number>();
  const toastOpen = !!(editor.saveError || editor.warning || editor.saved);
  // Re-run once the record lands: the loading skeleton has no frame to measure (a create's
  // "saved" toast opens before it).
  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!toastOpen || !frame) return;
    const measure = () => setToastX(formColumnCenter(frame));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    // The frame follows the window and the nav rail; the column, an aside or TOC coming or going.
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    const col = frame.querySelector(`[${FORM_COLUMN_ATTR}]`);
    if (col) ro.observe(col);
    return () => ro.disconnect();
  }, [toastOpen, editor.loading]);
  // Leaves outright: with unsaved edits the LeaveGuard asks first. Linje's IconButton with
  // its label beside the arrow (`< Back`), so the name is the visible text (WCAG 2.5.3).
  const backButton = (
    <IconButton
      onClick={actions.onClose}
      data-testid="editor-page-back"
      sx={{ gap: 0.5, typography: 'body1' }}
    >
      <ArrowBackIcon />
      {t('back')}
    </IconButton>
  );

  if (editor.loading && !editor.record) {
    // The loaded page's frame, title row and body, so nothing jumps when the record lands.
    return (
      <Box sx={FRAME_SX} role="status" aria-label={t('data.loading')}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, minHeight: TITLE_ROW_PX }}>
          <Skeleton variant="text" sx={{ typography: 'h5', width: TITLE_SKELETON_W }} />
          <Skeleton variant="rounded" width={ID_SKELETON_PX} height={ID_SKELETON_H_PX} />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={BODY_SX}>{skeleton}</Box>
      </Box>
    );
  }

  if (editor.notFound) {
    return (
      <>
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h5"
            component={heading}
            {...headingFocus}
            sx={{ mb: 1, ...HEADING_NO_RING }}
          >
            {t(copy.title)}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            {t(copy.notFound)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled', wordBreak: 'break-all' }}>
            {editor.id}
          </Typography>
          <Box sx={{ mt: 2 }}>{backButton}</Box>
        </Box>
      </>
    );
  }

  const trimmed = (title ?? entity.name?.value)?.trim();
  // Drawn by the body's `FormSections`, last in its form column.
  const footer = (
    <EditFooter
      dirty={actions.isDirty}
      saving={actions.saving}
      saved={editor.saved}
      canSubmit={actions.canSubmit}
      onSave={() => void actions.onSave()}
      // A create has no baseline to revert to: it leaves, and the LeaveGuard asks.
      onCancel={editor.isCreate ? actions.onClose : () => discard.ask('cancel')}
      labels={{
        save: t('save'),
        cancel: t('cancel'),
        dirty: t('editFooter.dirty'),
        saving: t('saving'),
        missing: t('editFooter.missing'),
        nothing: t('editFooter.nothing'),
        saved: t('editFooter.saved'),
      }}
    />
  );

  return (
    <Box ref={frameRef} sx={FRAME_SX}>
      {/* On a narrow page the actions wrap onto their own line. */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 2,
          mb: 1,
          flexShrink: 0,
        }}
      >
        {/* The name takes the room it needs, the id badge what is left; on a narrow row the
            badge wraps below. Only a name wider than the row is cut, and below `md` it wraps
            instead (WCAG 1.4.10, #389). */}
        <Box
          sx={{
            flex: `1 1 ${TITLE_MIN}`,
            minWidth: 0,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            columnGap: 2,
            rowGap: 0.5,
          }}
        >
          <Typography
            variant="h5"
            component={heading}
            {...headingFocus}
            noWrap
            title={trimmed || undefined}
            data-testid={`${testId}-details-title`}
            sx={{
              minWidth: 0,
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: { xs: 'normal', md: 'nowrap' },
              overflowWrap: 'anywhere',
              ...HEADING_NO_RING,
            }}
          >
            {trimmed || (
              <>
                {'[ '}
                <Box
                  component="span"
                  sx={{
                    color: 'text.disabled',
                    fontStyle: 'italic',
                    fontWeight: 'fontWeightRegular',
                    letterSpacing: '0.02em',
                  }}
                >
                  {t('common.unnamed')}
                </Box>
                {' ]'}
              </>
            )}
          </Typography>
          {entity.id && (
            <NetexId
              id={entity.id}
              version={entity.version}
              copy="onHover"
              size="small"
              sx={{ flexShrink: 0, maxWidth: '100%' }}
            />
          )}
        </Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexShrink: 0 }}>
          {frozen && (
            <Typography
              variant="subtitle2"
              color="error"
              sx={{ fontWeight: 'fontWeightBold', textTransform: 'uppercase' }}
              data-testid="editor-page-deactivated"
            >
              {t('common.deactivated')}
            </Typography>
          )}
          {backButton}
          {!frozen && editor.record && !editor.isCreate && (
            <>
              <Divider orientation="vertical" flexItem />
              {/* The span takes the hover and focus a disabled button doesn't; the tooltip says why. */}
              <Tooltip describeChild title={actions.isDirty ? t('common.deactivateDirty') : ''}>
                <span tabIndex={actions.isDirty ? 0 : undefined}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    // Unsaved edits first: a deactivate would leave them in limbo. No handler
                    // while a save or deactivate settles.
                    disabled={!actions.onDeactivate || actions.isDirty}
                    onClick={() => setConfirmDeactivate(true)}
                    data-testid="editor-page-deactivate"
                  >
                    {t('common.deactivate')}
                  </Button>
                </span>
              </Tooltip>
            </>
          )}
        </Stack>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <FormFooterContext.Provider value={frozen ? null : footer}>
        <Box sx={BODY_SX}>
          <BodyState
            error={editor.fetchError}
            onRetry={() => void editor.refetch().catch(() => {})}
            testIdPrefix={`${testId}-record`}
          >
            {children}
          </BodyState>
        </Box>
      </FormFooterContext.Provider>

      <SaveToast
        open={!!editor.saveError}
        message={editor.saveError ?? ''}
        severity="error"
        onClose={editor.clearSaveError}
        centerX={toastX}
      />
      <SaveToast
        open={!!editor.warning}
        message={editor.warning ?? ''}
        severity="warning"
        onClose={editor.clearWarning}
        centerX={toastX}
      />
      <SaveToast
        open={editor.saved}
        message={t(copy.saved)}
        severity="success"
        onClose={editor.clearSaved}
        centerX={toastX}
      />
      {discard.dialog}
      <LeaveGuard dirty={actions.isDirty} onSave={dialogSave} />
      <DeactivateDialog
        open={confirmDeactivate}
        onCancel={() => setConfirmDeactivate(false)}
        onConfirm={() => {
          setConfirmDeactivate(false);
          actions.onDeactivate?.();
        }}
        title={t(copy.deactivateTitle)}
        message={t(copy.deactivateMessage)}
      />
    </Box>
  );
}
