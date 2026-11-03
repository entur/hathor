import { useContext, type ReactNode } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NetexId from '../NetexId.tsx';
import { FormLayout } from '../FormLayout.tsx';
import FormLayoutSkeleton from '../FormLayoutSkeleton.tsx';
import BodyState from '../feedback/BodyState.tsx';
import SaveErrorSnackbar from '../feedback/SaveErrorSnackbar.tsx';
import SaveSuccessSnackbar from '../feedback/SaveSuccessSnackbar.tsx';
import type { EntityEditor } from '../../hooks/useEntityEditor.ts';
import EditorRail from './EditorRail.tsx';
import { EditorHeadingContext } from './editorHeading.ts';

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
 * {@link NetexId}, the read-error body, the save / deactivate snackbars and the
 * {@link EditorRail}. The feature supplies only its body.
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
  const heading = useContext(EditorHeadingContext);

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
        <EditorRail onCollapse={rail.onCollapse} side={RAIL_SIDE} />
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
        </Box>
        <EditorRail onCollapse={rail.onCollapse} side={RAIL_SIDE} />
      </>
    );
  }

  const trimmed = entity.name?.value?.trim();

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <FormLayout sx={{ mb: 1 }}>
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
      <EditorRail
        side={RAIL_SIDE}
        {...rail}
        deactivateConfirmTitle={t(copy.deactivateTitle)}
        deactivateConfirmMessage={t(copy.deactivateMessage)}
        deactivateConfirmActionLabel={t('common.deactivate')}
        canSubmit={canSubmit}
      />
    </Box>
  );
}
