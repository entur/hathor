import { useState, type ReactNode } from 'react';
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
import { EditFooter } from '../form-layout/index.ts';
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

interface EditorFrameProps<T, F> {
  editor: EntityEditor<T, F>;
  /** The form's entity: its typed name heads the pane (blank → `[ unnamed ]`), its id the NetexId badge. */
  entity: { id?: string; version?: number; name?: { value?: string } };
  /** Test-id stem: `<testId>-details-title`, `<testId>-record-fetch-error`. */
  testId: string;
  copy: EditorCopy;
  /** Shown while the first read is in flight: a node, or a stacked-row count for the default. */
  skeleton: ReactNode | number;
  /** Extra Save gate, AND'd with dirty + not saving. */
  canSubmit?: boolean;
  /** The feature's form (and any context rows above it). */
  children: ReactNode;
}

/**
 * The chrome every entity editor shares: skeleton, not-found body, title +
 * {@link NetexId}, the read-error body and the save / deactivate snackbars. The
 * feature supplies only its body. In the sidebar the actions are the
 * {@link EditorRail}; on a form page (`EditorHostContext`) they are text buttons
 * in the title row — Edit, Close, Deactivate apart — and a sticky Save / Cancel
 * {@link EditFooter} while editing (F5, #280). A create's Cancel leaves the page.
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
  canSubmit,
  children,
}: EditorFrameProps<T, F>) {
  const { t } = useTranslation();
  const { rail } = editor;
  const page = useEditorOnPage();
  const heading = page ? 'h1' : 'h6';
  // The page's own confirms; the sidebar's live in its rail. Cancel on a create has no
  // record to fall back to: it leaves, as Close does.
  const discard = useDiscardConfirm(
    rail.isDirty,
    { close: rail.onCollapse, cancel: editor.isCreate ? rail.onCollapse : rail.onCancelEdit },
    rail.onSave
  );
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  // Before the record is shown, the sidebar keeps only its collapse.
  const bareRail = !page && <EditorRail onCollapse={rail.onCollapse} side={RAIL_SIDE} />;
  const closeButton = (
    <Button size="small" onClick={() => discard.ask('close')} data-testid="editor-page-close">
      {t('close')}
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
          <Typography variant="h6" component={heading} sx={{ mb: 1 }}>
            {t(copy.title)}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t(copy.notFound)}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ wordBreak: 'break-all' }}>
            {editor.id}
          </Typography>
          {page && <Box sx={{ mt: 2 }}>{closeButton}</Box>}
        </Box>
        {bareRail}
      </>
    );
  }

  const trimmed = entity.name?.value?.trim();

  return (
    <Box sx={{ p: page ? 0 : 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1 }}>
        <FormLayout sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            component={heading}
            noWrap
            title={trimmed || undefined}
            data-testid={`${testId}-details-title`}
            sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
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
            {rail.mode === 'view' && rail.onEnterEdit && (
              <Button
                variant="contained"
                size="small"
                onClick={rail.onEnterEdit}
                data-testid="editor-page-edit"
              >
                {t('edit')}
              </Button>
            )}
            {closeButton}
            {rail.mode === 'view' && rail.onDeactivate && (
              <>
                <Divider orientation="vertical" flexItem />
                <Button
                  size="small"
                  color="error"
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

      <BodyState
        error={editor.fetchError}
        onRetry={() => void editor.refetch().catch(() => {})}
        testIdPrefix={`${testId}-record`}
      >
        {children}
      </BodyState>

      <SaveErrorSnackbar error={editor.saveError} onClose={editor.clearSaveError} />
      <SaveErrorSnackbar error={editor.warning} severity="warning" onClose={editor.clearWarning} />
      <SaveSuccessSnackbar
        open={editor.saved}
        message={t(copy.saved)}
        onClose={editor.clearSaved}
      />
      <SaveSuccessSnackbar
        open={editor.deactivated}
        message={t(copy.deactivated)}
        onClose={rail.onCollapse}
      />
      {page ? (
        <>
          {rail.mode === 'edit' && (
            <EditFooter
              dirty={rail.isDirty}
              saving={rail.saving}
              canSubmit={canSubmit}
              onSave={() => void rail.onSave()}
              onCancel={() => discard.ask('cancel')}
              cancelWhenClean
              labels={{
                save: t('save'),
                cancel: t('cancel'),
                dirty: t('editFooter.dirty'),
                saving: t('saving'),
                missing: t('editFooter.missing'),
              }}
            />
          )}
          {discard.dialog}
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
        <EditorRail
          side={RAIL_SIDE}
          {...rail}
          deactivateConfirmTitle={t(copy.deactivateTitle)}
          deactivateConfirmMessage={t(copy.deactivateMessage)}
          canSubmit={canSubmit}
        />
      )}
    </Box>
  );
}
