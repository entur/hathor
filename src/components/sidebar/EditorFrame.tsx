import { useState, type ReactNode } from 'react';
import { useBlocker } from 'react-router-dom';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NetexId from '../NetexId.tsx';
import { FormLayout } from '../FormLayout.tsx';
import FormLayoutSkeleton from '../FormLayoutSkeleton.tsx';
import BodyState from '../feedback/BodyState.tsx';
import SaveErrorSnackbar from '../feedback/SaveErrorSnackbar.tsx';
import SaveSuccessSnackbar from '../feedback/SaveSuccessSnackbar.tsx';
import type { EntityEditor } from '../../hooks/useEntityEditor.ts';
import { useDiscardConfirm } from '../dialogs/useDiscardConfirm.tsx';
import DeactivateDialog from '../dialogs/DeactivateDialog.tsx';
import DiscardDialog from '../dialogs/DiscardDialog.tsx';
import { EditFooter, FormFooterContext, formPageWidth } from '../form-layout/index.ts';
import EditorRail from './EditorRail.tsx';
import { useEditorOnPage } from './editorHost.ts';

const RAIL_SIDE = 'right' as const;

/** The i18n keys a feature's editor copy lives under. */
export interface EditorCopy {
  title: string;
  notFound: string;
  saved: string;
  deactivated: string;
  deactivateTitle: string;
  deactivateMessage: string;
}

/** A page heading takes focus as it appears (a skeleton until the record loads), so a
 *  screen reader lands on the record. Module-level: a stable ref fires once per mount. */
const focusOnMount = (el: HTMLElement | null) => el?.focus();
// Not in the tab order, so no focus ring — clipped by the frame, it showed as a stray edge.
const HEADING_NO_RING = { '&:focus': { outline: 'none' } };

interface EditorFrameProps<T, F> {
  editor: EntityEditor<T, F>;
  /** The form's entity: its typed name heads the pane (blank → `[ unnamed ]`), its id the NetexId badge. */
  entity: { id?: string; version?: number; name?: { value?: string } };
  /** Test-id stem: `<testId>-details-title`, `<testId>-record-fetch-error`. */
  testId: string;
  copy: EditorCopy;
  /** Shown while the first read is in flight: a node, or a stacked-row count for the default. */
  skeleton: ReactNode | number;
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
 * The chrome every entity editor shares: skeleton, not-found body, title +
 * {@link NetexId}, the read-error body and the save / deactivate snackbars. The
 * feature supplies only its body. In the sidebar the actions are the
 * {@link EditorRail}. On a form page (`EditorHostContext`, #282) the form opens
 * ready to edit: Back and Deactivate are text buttons in the title row, Save /
 * Cancel a sticky {@link EditFooter}, and a {@link LeaveGuard} asks before
 * unsaved edits are left behind. A confirmed Deactivate freezes the page under a
 * red "Deactivated" for the rest of the visit.
 *
 * @param {EditorFrameProps<T, F>} props Editor state, entity, copy keys, skeleton and body.
 * @returns {JSX.Element} The editor pane.
 */
export default function EditorFrame<T, F>({
  editor,
  entity,
  testId,
  copy,
  skeleton,
  children,
}: EditorFrameProps<T, F>) {
  const { t } = useTranslation();
  const { rail } = editor;
  const page = useEditorOnPage();
  const heading = page ? 'h1' : 'h6';
  const headingFocus = page ? { ref: focusOnMount, tabIndex: -1 } : {};
  // The page's Cancel reverts in place; the sidebar's confirms live in its rail.
  // The dialogs' Save follows the footer's gates: none while clean (a save that landed with
  // the leave dialog open), while a save runs, or with a required field missing.
  const dialogSave = !rail.isDirty || rail.saving || !rail.canSubmit ? undefined : rail.onSave;
  const discard = useDiscardConfirm(rail.isDirty, { cancel: rail.onCancelEdit }, dialogSave);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const frozen = page && editor.isDeactivated;
  // Before the record is shown, the sidebar keeps only its collapse.
  const bareRail = !page && <EditorRail onCollapse={rail.onCollapse} side={RAIL_SIDE} />;
  // Leaves outright: with unsaved edits the LeaveGuard asks first.
  const backButton = (
    <Button size="small" onClick={rail.onCollapse} data-testid="editor-page-back">
      {t('back')}
    </Button>
  );

  if (editor.loading && !editor.record) {
    return (
      <>
        {typeof skeleton === 'number' ? (
          <FormLayoutSkeleton
            ariaLabel={t('data.loading')}
            showTitle
            sections={[{ rowCount: skeleton, stacked: true }]}
          />
        ) : (
          skeleton
        )}
        {bareRail}
      </>
    );
  }

  if (editor.notFound) {
    return (
      <>
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            component={heading}
            {...headingFocus}
            sx={{ mb: 1, ...HEADING_NO_RING }}
          >
            {t(copy.title)}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t(copy.notFound)}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ wordBreak: 'break-all' }}>
            {editor.id}
          </Typography>
          {page && <Box sx={{ mt: 2 }}>{backButton}</Box>}
        </Box>
        {bareRail}
      </>
    );
  }

  const trimmed = entity.name?.value?.trim();
  // Drawn by the body's `FormSections`, last in its form column.
  const footer = (
    <EditFooter
      dirty={rail.isDirty}
      saving={rail.saving}
      saved={editor.saved}
      canSubmit={rail.canSubmit}
      onSave={() => void rail.onSave()}
      // A create has no baseline to revert to: it leaves, and the LeaveGuard asks.
      onCancel={editor.isCreate ? rail.onCollapse : () => discard.ask('cancel')}
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
    <Box
      sx={
        page
          ? // From `lg` the page stays put; the form column scrolls itself (`FormSections`, #293).
            {
              height: '100%',
              // As wide as the form and column 3, so the title row's actions end above the picture.
              maxWidth: formPageWidth,
              display: 'flex',
              flexDirection: 'column',
              overflowY: { xs: 'auto', lg: 'hidden' },
            }
          : { p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }
      }
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1, flexShrink: 0 }}>
        <FormLayout sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            component={heading}
            {...headingFocus}
            noWrap
            title={trimmed || undefined}
            data-testid={`${testId}-details-title`}
            sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', ...HEADING_NO_RING }}
          >
            {trimmed || (
              <>
                {'[ '}
                <Box
                  component="span"
                  sx={{
                    color: 'text.disabled',
                    fontStyle: 'italic',
                    fontWeight: 400,
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
              sx={{ justifySelf: 'start' }}
            />
          )}
        </FormLayout>
        {page && (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
            {frozen && (
              <Typography
                variant="subtitle2"
                color="error"
                sx={{ fontWeight: 700, textTransform: 'uppercase' }}
                data-testid="editor-page-deactivated"
              >
                {t('common.deactivated')}
              </Typography>
            )}
            {backButton}
            {!frozen && editor.record && !editor.isCreate && (
              <>
                <Divider orientation="vertical" flexItem />
                <Button
                  size="small"
                  color="error"
                  // Unsaved edits first: a deactivate would leave them in limbo. No handler
                  // while a save or deactivate settles.
                  disabled={!rail.onDeactivate || rail.isDirty}
                  onClick={() => setConfirmDeactivate(true)}
                  data-testid="editor-page-deactivate"
                >
                  {t('common.deactivate')}
                </Button>
              </>
            )}
          </Stack>
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />

      <FormFooterContext.Provider value={page && !frozen ? footer : null}>
        {/* A page's body fills the rest from `lg`, so the form column can scroll inside it. */}
        <Box
          sx={
            page
              ? {
                  flex: { lg: '1 1 0' },
                  minHeight: { lg: 0 },
                  display: { lg: 'flex' },
                  flexDirection: 'column',
                }
              : undefined
          }
        >
          <BodyState
            error={editor.fetchError}
            onRetry={() => void editor.refetch().catch(() => {})}
            testIdPrefix={`${testId}-record`}
          >
            {children}
          </BodyState>
        </Box>
      </FormFooterContext.Provider>

      <SaveErrorSnackbar error={editor.saveError} onClose={editor.clearSaveError} />
      <SaveErrorSnackbar error={editor.warning} severity="warning" onClose={editor.clearWarning} />
      <SaveSuccessSnackbar
        open={editor.saved}
        message={t(copy.saved)}
        onClose={editor.clearSaved}
      />
      {page ? (
        <>
          {discard.dialog}
          <LeaveGuard dirty={rail.isDirty} onSave={dialogSave} />
          <DeactivateDialog
            open={confirmDeactivate}
            onCancel={() => setConfirmDeactivate(false)}
            onConfirm={() => {
              setConfirmDeactivate(false);
              rail.onDeactivate?.();
            }}
            title={t(copy.deactivateTitle)}
            message={t(copy.deactivateMessage)}
          />
        </>
      ) : (
        <>
          {/* The page says "Deactivated" in its title row and stays; the sidebar toasts and closes. */}
          <SaveSuccessSnackbar
            open={editor.deactivated}
            message={t(copy.deactivated)}
            onClose={rail.onCollapse}
          />
          <EditorRail
            side={RAIL_SIDE}
            {...rail}
            deactivateConfirmTitle={t(copy.deactivateTitle)}
            deactivateConfirmMessage={t(copy.deactivateMessage)}
          />
        </>
      )}
    </Box>
  );
}
