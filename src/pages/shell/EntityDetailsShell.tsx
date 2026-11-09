import { Fragment, type ReactNode } from 'react';
import { Box } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useOrganisationsContext } from '../../contexts/useOrganisationsContext.ts';
import { NEW_SELECTION, type EntityEditorHostProps } from '../../hooks/useEntityEditor.ts';
import { EditorHostContext } from '../../components/sidebar/editorHost.ts';
import type { CollectionLinkState } from './CollectionShell.tsx';

/** Router state a create's own redirect carries. */
export interface DetailsLinkState {
  /** The re-mounted editor shows its "saved" toast. */
  created?: boolean;
}

interface EntityDetailsShellProps {
  /** The entity's collection route; close returns here, a create advances under it. */
  listPath: string;
  /** Render the entity editor from the host props this route derives. */
  renderEditor: (host: EntityEditorHostProps) => ReactNode;
}

/**
 * Full-page host for one entity editor at `<listPath>/:id` — the route
 * counterpart of the sidebar's `useUrlEditorSelection`. `:id` = `new` is the
 * create pane; a record, like it, opens ready to edit (#282). Back navigates to `listPath` and asks it
 * to refocus this record's Edit link (New, from the create pane); a create
 * replaces the URL with the minted id and hands its "saved" toast across the re-mount.
 * The editor's page heading takes focus as it renders (`EditorFrame`).
 *
 * @param {EntityDetailsShellProps} props The list route and the editor renderer.
 * @returns {JSX.Element} The editor, as a form page (`EditorHostContext`).
 */
export default function EntityDetailsShell({ listPath, renderEditor }: EntityDetailsShellProps) {
  const { id = NEW_SELECTION } = useParams();
  const state = useLocation().state as DetailsLinkState | null;
  const navigate = useNavigate();
  const orgId = useOrganisationsContext().currentOrganisation?.id;
  const isNew = id === NEW_SELECTION;
  return (
    <Box sx={{ height: '100%' }}>
      {/* Keyed like useUrlEditorSelection: an org switch re-mounts a record's
          editor; the create pane keeps its draft. */}
      <EditorHostContext.Provider value="page">
        <Fragment key={isNew ? NEW_SELECTION : `${orgId}:${id}`}>
          {renderEditor({
            id: isNew ? '' : id,
            // shortcut: the flag stays in this history entry, so a reload re-shows the toast; clear it if that bothers.
            initialSaved: state?.created,
            onClose: () =>
              navigate(listPath, { state: { focusEditId: id } satisfies CollectionLinkState }),
            onCreated: newId =>
              navigate(`${listPath}/${encodeURIComponent(newId)}`, {
                replace: true,
                state: { created: true } satisfies DetailsLinkState,
              }),
          })}
        </Fragment>
      </EditorHostContext.Provider>
    </Box>
  );
}
