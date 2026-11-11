import { useEffect, useRef, type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingPage from '../../components/common/LoadingPage.tsx';
import ErrorPage from '../../components/common/ErrorPage.tsx';
import { useFocusEditId } from './useFocusEditId.ts';

/** Router state the details page hands back on close: the record whose Edit link regains focus
 *  (`new` = the New action). */
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
  /** Shown instead of the body (and `actions`) when set — the host sets it for an empty
   *  list, with its own New. */
  empty?: ReactNode;
  /** The entity's list body. Edit links (and New, as `new`) carry `data-edit-id` so focus can return to them. */
  children: ReactNode;
}

/**
 * Frame of an entity's collection page, inside {@link PageShell}: title row
 * with actions and subtitle, then the list body — or the loading / error /
 * empty state in its place. Back from the details page, focus goes to New when that
 * was the way in, else to the title — which the record's Edit link takes over as the
 * collection draws it (`focusEditId`, #291).
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
  const focusEditId = useFocusEditId();
  const location = useLocation();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (loading || !focusEditId) return;
    // Unless the reader moved on while the list loaded: a link already drawn (New, a card's)
    // has focus or takes it now; the title holds it otherwise.
    const active = document.activeElement;
    if (!active || active === document.body) {
      const link = rootRef.current?.querySelector<HTMLElement>(
        `[data-edit-id="${CSS.escape(focusEditId)}"]`
      );
      (link ?? headingRef.current)?.focus();
    }
    // Read once per arrival: a later load (org switch, refetch) remounts the list and must
    // not pull focus back. The mounted collection keeps its own copy for a late-drawn link.
    navigate(location, { replace: true, state: null });
  }, [loading, focusEditId, location, navigate]);

  const loaded = !loading && !error;
  const showEmpty = loaded && empty != null;

  return (
    <Box ref={rootRef} sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h5" component="h1" ref={headingRef} tabIndex={-1}>
            {t(titleKey)}
          </Typography>
          {subtitle && loaded && (
            <Typography variant="body2" color="text.secondary" data-testid="collection-subtitle">
              {subtitle}
            </Typography>
          )}
        </Box>
        {!showEmpty && actions}
      </Box>
      {/* A flex column, so the collection fills it and scrolls its own rows (#278). */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {error ? (
          <ErrorPage message={error} />
        ) : loading ? (
          <LoadingPage />
        ) : showEmpty ? (
          empty
        ) : (
          children
        )}
      </Box>
    </Box>
  );
}
