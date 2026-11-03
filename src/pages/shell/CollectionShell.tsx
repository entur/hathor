import { useEffect, useRef, type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingPage from '../../components/common/LoadingPage.tsx';
import ErrorPage from '../../components/common/ErrorPage.tsx';

/** Router state the details page hands back on close: the record whose Edit link regains focus. */
export interface CollectionLinkState {
  focusEditId?: string;
}

interface CollectionShellProps {
  /** i18n key of the page title. */
  titleKey: string;
  /** Muted line under the title (e.g. organisation · count). */
  subtitle?: ReactNode;
  loading: boolean;
  error: string | null;
  /** Host buttons at the end of the title row (e.g. a New action). */
  actions?: ReactNode;
  /** Shown instead of the body when set — the host sets it for an empty list. */
  empty?: ReactNode;
  /** The entity's list body. Edit links carry `data-edit-id` so focus can return to them. */
  children: ReactNode;
}

/**
 * Frame of an entity's collection page, inside {@link PageShell}: title row
 * with actions and subtitle, then the list body — or the loading / error /
 * empty state in its place. Back from the details page, focus returns to the
 * Edit link named by {@link CollectionLinkState}.
 *
 * @param {CollectionShellProps} props Title, load state, actions and the list body.
 * @returns {JSX.Element} The collection page frame.
 */
export default function CollectionShell({
  titleKey,
  subtitle,
  loading,
  error,
  actions,
  empty,
  children,
}: CollectionShellProps) {
  const { t } = useTranslation();
  const focusEditId = (useLocation().state as CollectionLinkState | null)?.focusEditId;
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || !focusEditId) return;
    bodyRef.current
      ?.querySelector<HTMLElement>(`[data-edit-id="${CSS.escape(focusEditId)}"]`)
      ?.focus();
  }, [loading, focusEditId]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h5" component="h1">
            {t(titleKey)}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" data-testid="collection-subtitle">
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions}
      </Box>
      <Box ref={bodyRef} sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
        {error ? <ErrorPage message={error} /> : loading ? <LoadingPage /> : (empty ?? children)}
      </Box>
    </Box>
  );
}
