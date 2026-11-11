import type { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Navigate, useSearchParams } from 'react-router-dom';
import NewEntityFab from '../../components/NewEntityFab.tsx';
import { useOrganisationsContext } from '../../contexts/useOrganisationsContext.ts';
import { NEW_SELECTION } from '../../hooks/useEntityEditor.ts';
import { netexText } from '../../data/netex/multilingualString.ts';
import CollectionShell from './CollectionShell.tsx';

/** The old list's deep link, `?selected=<id>` (`new` = create): bookmarks and shared links. */
const LEGACY_SELECTED_PARAM = 'selected';

interface CollectionPageProps {
  /** The entity's collection route; New opens `<listPath>/new`. */
  listPath: string;
  /** i18n keys: page title, New's label, the empty state (gets `{{org}}`). */
  keys: { title: string; new: string; empty: string };
  /** Test id of the New action. */
  newTestId: string;
  /** Rows in the org's list: the subtitle's count; 0 → the empty state. */
  count: number;
  loading: boolean;
  error: string | null;
  /** The entity's collection. */
  children: ReactNode;
}

/**
 * An entity's collection page: {@link CollectionShell} with the org · count
 * subtitle, a New action, and an empty state that repeats New (#271, #285, #287). The old
 * list's `?selected=<id>` deep link redirects to the record's form page.
 *
 * @param {CollectionPageProps} props route, keys, New's test id, row count, load state and
 *   the collection
 * @returns {JSX.Element} The collection page.
 */
export default function CollectionPage({
  listPath,
  keys,
  newTestId,
  count,
  loading,
  error,
  children,
}: CollectionPageProps) {
  const { t } = useTranslation();
  const orgName = netexText(useOrganisationsContext().currentOrganisation?.name) ?? '';
  const selected = useSearchParams()[0].get(LEGACY_SELECTED_PARAM);
  if (selected) return <Navigate to={`${listPath}/${encodeURIComponent(selected)}`} replace />;
  const newAction = (
    <NewEntityFab
      label={t(keys.new)}
      shortLabel={t('common.new')}
      to={`${listPath}/${NEW_SELECTION}`}
      testid={newTestId}
    />
  );

  return (
    <CollectionShell
      titleKey={keys.title}
      loading={loading}
      error={error}
      subtitle={[orgName, t('data.totalEntries', { count })].filter(Boolean).join(' · ')}
      actions={newAction}
      empty={
        count === 0 ? (
          <Stack spacing={2} alignItems="flex-start" data-testid="collection-empty">
            <Typography color="text.secondary">{t(keys.empty, { org: orgName })}</Typography>
            {newAction}
          </Stack>
        ) : undefined
      }
    >
      {children}
    </CollectionShell>
  );
}
