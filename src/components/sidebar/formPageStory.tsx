import { useState, type ReactNode } from 'react';
import { Typography } from '@mui/material';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import PageShell from '../../pages/shell/PageShell.tsx';
import EntityDetailsShell from '../../pages/shell/EntityDetailsShell.tsx';
import { EditingProvider } from '../../contexts/EditingContext.tsx';
import type { EntityEditorHostProps } from '../../hooks/useEntityEditor.ts';

/** Fake round trip of a story's in-memory save, long enough to see the Saving state. */
export const STORY_SAVE_MS = 900;

interface FormPageProps {
  /** The entity's route segment, e.g. `vehicles`. */
  entity: string;
  /** The record to open, or `new`. */
  id: string;
  /** The entity's editor, as its details page renders it. */
  renderEditor: (host: EntityEditorHostProps) => ReactNode;
}

/**
 * A form page for stories: `/<entity>/:id` under the real page shell, in a data
 * router (the page's `LeaveGuard` needs one); `/<entity>` stands in for the
 * collection that Back returns to. The story supplies Sobek (`withSobekUrl`, a store).
 *
 * @param {FormPageProps} props the entity's route segment, the record id and its editor
 * @returns {JSX.Element} the routed form page
 */
export function FormPage({ entity, id, renderEditor }: FormPageProps) {
  const list = `/${entity}`;
  const [router] = useState(() =>
    createMemoryRouter(
      [
        {
          path: '/',
          element: <PageShell />,
          children: [
            { path: entity, element: <Typography>Collection page</Typography> },
            {
              path: `${entity}/:id`,
              element: <EntityDetailsShell listPath={list} renderEditor={renderEditor} />,
            },
          ],
        },
      ],
      { initialEntries: [`${list}/${encodeURIComponent(id)}`] }
    )
  );
  return (
    <EditingProvider>
      <RouterProvider router={router} />
    </EditingProvider>
  );
}
