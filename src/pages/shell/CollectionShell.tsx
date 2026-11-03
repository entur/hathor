import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LoadingPage from '../../components/common/LoadingPage.tsx';
import ErrorPage from '../../components/common/ErrorPage.tsx';

interface CollectionShellProps {
  /** i18n key of the page title. */
  titleKey: string;
  loading: boolean;
  error: string | null;
  /** Host buttons at the end of the title row (e.g. a New action). */
  actions?: ReactNode;
  /** The entity's list body. */
  children: ReactNode;
}

/**
 * Frame of an entity's collection page, inside {@link PageShell}: title row
 * with actions, then the list body — or the loading / error page in its place.
 *
 * @param {CollectionShellProps} props Title, load state, actions and the list body.
 * @returns {JSX.Element} The collection page frame.
 */
export default function CollectionShell({
  titleKey,
  loading,
  error,
  actions,
  children,
}: CollectionShellProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          {t(titleKey)}
        </Typography>
        {actions}
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
        {error ? <ErrorPage message={error} /> : loading ? <LoadingPage /> : children}
      </Box>
    </Box>
  );
}
