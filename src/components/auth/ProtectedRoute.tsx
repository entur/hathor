import React from 'react';
import { Alert, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth';
import { useConfig } from '../../contexts/configContext.ts';
import LoginRedirect from '../../auth/LoginRedirect';
import { useOrganisationsContext } from '../../contexts/useOrganisationsContext.ts';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();
  const { oidcConfig } = useConfig();
  const {
    currentOrganisation,
    loading: organisationsLoading,
    error: organisationsError,
    refetch,
  } = useOrganisationsContext();

  if (!oidcConfig) {
    return element;
  }

  if (isLoading) {
    return <div>Loading authentication status...</div>;
  }

  if (!isAuthenticated) {
    return <LoginRedirect />;
  }

  if (organisationsLoading) {
    return <div>Loading organisations...</div>;
  }

  if (organisationsError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert
          severity="error"
          data-testid="organisations-load-error"
          action={
            <Button color="inherit" size="small" onClick={() => void refetch()}>
              {t('common.retry', 'Retry')}
            </Button>
          }
        >
          {t('organisations.loadError', 'Could not load organisations.')} {organisationsError}
        </Alert>
      </Box>
    );
  }

  if (!currentOrganisation) {
    return <Navigate to="/" replace />;
  }

  return element;
};
