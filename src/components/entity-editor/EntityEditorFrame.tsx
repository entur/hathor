import type { ReactNode } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { FormLayout } from '../FormLayout.tsx';
import NetexId from '../../data/netex/NetexId.tsx';
import SaveErrorSnackbar from '../feedback/SaveErrorSnackbar.tsx';
import SaveSuccessSnackbar from '../feedback/SaveSuccessSnackbar.tsx';
import type { EntityEditorApi, EntityWrite } from '../../hooks/useEntityEditor.ts';
import type { EntityRecord } from '../../hooks/useEntityRecord.ts';

const BLANK_NAME = 'unnamed';

/** The props every host-agnostic entity editor takes from its host. */
export interface EntityEditorProps<R, F> {
  /** The record's netexId, or `NEW_SELECTION` for the create form. */
  id: string;
  /** Leave the editor (after a deactivate's success is dismissed). */
  onClose: () => void;
  /** Move the editor to the id a create just minted. */
  onCreated: (newId: string) => void;
  /** Fire-and-forget report of each committed write (e.g. to refresh a list). */
  onWritten?: (write: EntityWrite<R>) => void;
  /** The host's controls (e.g. the sidebar rail), rendered after the body. */
  actions: (api: EntityEditorApi<F>) => ReactNode;
}

interface EntityEditorFrameProps<R, F> {
  id: string;
  api: EntityEditorApi<F>;
  record: Pick<EntityRecord<R>, 'error' | 'notFound'>;
  /** Translated copy: load-failure heading + not-found body, and the two success snackbars. */
  labels: { detailsTitle: string; notFound: string; saved: string; deactivated: string };
  /** Shown while there is no record yet and the load has not failed. */
  skeleton: ReactNode;
  actions: (api: EntityEditorApi<F>) => ReactNode;
  /** The editor body; rendered only while `api.hasRecord`. */
  children: ReactNode;
}

/**
 * The shell shared by every entity editor: the body (or its load-failure /
 * skeleton fallback), the save / deactivate snackbars and the host's
 * `actions(api)`.
 *
 * A failed same-key reload keeps `record.data` (and sets `record.error`): the
 * form stays up with the stale warning. Only an editor with nothing to show
 * renders the load error, not-found, or the skeleton. The snackbars and
 * `actions(api)` sit outside that branch, so a write's outcome shows whatever
 * the body (e.g. a record gone after its save) and the rail keeps its state.
 *
 * @param {EntityEditorFrameProps<R, F>} props - Editor api, record load state, copy, skeleton, actions and body.
 * @returns {JSX.Element} The framed editor.
 */
export function EntityEditorFrame<R, F>({
  id,
  api,
  record,
  labels,
  skeleton,
  actions,
  children,
}: EntityEditorFrameProps<R, F>) {
  return (
    <>
      {api.hasRecord ? (
        children
      ) : record.error || record.notFound ? (
        <EntityLoadFailure
          id={id}
          error={record.error}
          title={labels.detailsTitle}
          notFound={labels.notFound}
        />
      ) : (
        skeleton
      )}
      <SaveErrorSnackbar error={api.saveError} onClose={api.clearSaveError} />
      <SaveErrorSnackbar error={api.warning} severity="warning" onClose={api.clearWarning} />
      <SaveSuccessSnackbar open={api.savedOpen} message={labels.saved} onClose={api.closeSaved} />
      <SaveSuccessSnackbar
        open={api.deactivatedOpen}
        message={labels.deactivated}
        onClose={api.closeDeactivated}
      />
      {actions(api)}
    </>
  );
}

interface EntityEditorBodyProps {
  /** The form's name; blank shows `[ unnamed ]`. Mirrors typing, so it updates as the user edits. */
  name: string | undefined;
  /** The form's netexId; the chip is hidden while blank (create). */
  netexId: string | undefined;
  version?: number;
  titleTestId: string;
  children: ReactNode;
}

/**
 * An editor body with a form: the name heading, NetexId chip, a divider, then
 * the feature's own content.
 *
 * @param {EntityEditorBodyProps} props - Name, id + version, the title's test id and the content.
 * @returns {JSX.Element} The scrollable body.
 */
export function EntityEditorBody({
  name,
  netexId,
  version,
  titleTestId,
  children,
}: EntityEditorBodyProps) {
  const trimmed = name?.trim();
  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <FormLayout sx={{ mb: 1 }}>
        <Typography
          variant="h6"
          noWrap
          title={trimmed || undefined}
          data-testid={titleTestId}
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
                {BLANK_NAME}
              </Box>
              {' ]'}
            </>
          )}
        </Typography>
        {netexId && (
          <NetexId
            id={netexId}
            version={version}
            copy="onHover"
            size="small"
            sx={{ justifySelf: 'start' }}
          />
        )}
      </FormLayout>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Box>
  );
}

interface EntityLoadFailureProps {
  id: string;
  error: string | null;
  title: string;
  notFound: string;
}

/** The editor body for a by-id load that failed (`error`) or found nothing. */
function EntityLoadFailure({ id, error, title, notFound }: EntityLoadFailureProps) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {/* A failed request is not a missing record: show why it failed. */}
      {error ? (
        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {notFound}
        </Typography>
      )}
      <Typography variant="caption" color="text.disabled" sx={{ wordBreak: 'break-all' }}>
        {id}
      </Typography>
    </Box>
  );
}
