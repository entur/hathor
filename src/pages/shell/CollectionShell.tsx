import { useEffect, useRef, type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingPage from '../../components/common/LoadingPage.tsx';
import ErrorPage from '../../components/common/ErrorPage.tsx';

// How long focus waits for the Edit link to be drawn (the grid loads lazily) before the h1 takes it.
const FOCUS_WAIT_MS = 2000;

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
 * empty state in its place. Back from the details page, focus returns to the
 * Edit link named by {@link CollectionLinkState} — or the title, when that link is gone.
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
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (loading || !focusEditId || !root) return;
    const selector = `[data-edit-id="${CSS.escape(focusEditId)}"]`;
    const focusLink = () => {
      const link = root.querySelector<HTMLElement>(selector);
      link?.focus();
      return !!link;
    };
    if (focusLink()) return;
    const observer = new MutationObserver(() => focusLink() && stop());
    // shortcut: a row off the grid's first page is never drawn, so it waits FOCUS_WAIT_MS
    // and lands on the h1; move to a collection-owned `focusEditId` (finds the row's page)
    // when vehicles / deck-plans adopt the collection.
    const timer = setTimeout(() => {
      stop();
      headingRef.current?.focus();
    }, FOCUS_WAIT_MS);
    const stop = () => {
      observer.disconnect();
      clearTimeout(timer);
    };
    observer.observe(root, { childList: true, subtree: true });
    return stop;
  }, [loading, focusEditId]);

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
      <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
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
