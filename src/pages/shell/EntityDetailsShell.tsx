import { Fragment, type ReactNode } from 'react';
import { Box } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useOrganisationsContext } from '../../contexts/useOrganisationsContext.ts';
import {
  NEW_SELECTION,
  type EditorMode,
  type EntityEditorHostProps,
} from '../../hooks/useEntityEditor.ts';
import { SEGMENT_SIZE as EDITOR_RAIL_WIDTH_PX } from '../../components/sidebar/EditorRail.tsx';

/** Router state a link may carry to open the record straight in edit mode. */
export interface DetailsLinkState {
  initialMode?: EditorMode;
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
 * create pane (edit mode); a record opens in view mode unless the link's
 * {@link DetailsLinkState} says `edit`. Close navigates to `listPath`; a create
 * replaces the URL with the minted id.
 *
 * @param {EntityDetailsShellProps} props The list route and the editor renderer.
 * @returns {JSX.Element} The editor, padded clear of the fixed `EditorRail`.
 */
export default function EntityDetailsShell({ listPath, renderEditor }: EntityDetailsShellProps) {
  const { id = NEW_SELECTION } = useParams();
  const state = useLocation().state as DetailsLinkState | null;
  const navigate = useNavigate();
  const orgId = useOrganisationsContext().currentOrganisation?.id;
  const isNew = id === NEW_SELECTION;

  return (
    <Box sx={{ height: '100%', pr: `${EDITOR_RAIL_WIDTH_PX}px` }}>
      {/* Keyed like useUrlEditorSelection: an org switch re-mounts a record's
          editor; the create pane keeps its draft. */}
      <Fragment key={isNew ? NEW_SELECTION : `${orgId}:${id}`}>
        {renderEditor({
          id: isNew ? '' : id,
          initialMode: isNew ? 'edit' : (state?.initialMode ?? 'view'),
          onClose: () => navigate(listPath),
          onCreated: newId =>
            navigate(`${listPath}/${encodeURIComponent(newId)}`, { replace: true }),
        })}
      </Fragment>
    </Box>
  );
}
