import type { ReactNode } from 'react';
import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface BodyStateProps {
  /** Show a spinner in place of the body. */
  loading?: boolean;
  /** Show an alert + Retry in place of the body. */
  error?: string | null;
  onRetry: () => void;
  /** `<prefix>-loading` / `<prefix>-fetch-error` test ids. */
  testIdPrefix: string;
  children: ReactNode;
}

/**
 * Loading / fetch-error chrome around a fetched body: spinner while loading,
 * an error alert with Retry on failure, otherwise the children.
 *
 * @param props {@link BodyStateProps}
 * @returns The body, or its loading / error state.
 */
export default function BodyState({
  loading,
  error,
  onRetry,
  testIdPrefix,
  children,
}: BodyStateProps) {
  const { t } = useTranslation();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress data-testid={`${testIdPrefix}-loading`} />
      </Box>
    );
  }
  if (error) {
    return (
      <Stack spacing={1}>
        <Alert severity="error" data-testid={`${testIdPrefix}-fetch-error`}>
          {error}
        </Alert>
        <Box>
          <Button onClick={onRetry} size="small" variant="outlined">
            {t('common.retry')}
          </Button>
        </Box>
      </Stack>
    );
  }
  return children;
}
