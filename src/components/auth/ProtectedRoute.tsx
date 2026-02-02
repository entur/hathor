import React from 'react';
import { Alert } from '@mui/material';
import { useAuth } from '../../auth';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import LoginRedirect from '../../auth/LoginRedirect';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { oidcConfig } = useConfig();

  if (!oidcConfig) {
    return (
      <>
        <Alert severity="warning" data-testid="auth-not-configured-warning">
          Auth not configured, assumed server is in TEST state; continue without auth
        </Alert>
        {element}
      </>
    );
  }

  if (isLoading) {
    return <div>Loading authentication status...</div>;
  }

  if (!isAuthenticated) {
    return <LoginRedirect />;
  }

  return element;
};
