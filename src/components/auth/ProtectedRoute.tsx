import React from 'react';
import { useAuth } from '../../auth';
import { useConfig } from '../../contexts/configContext.ts';
import LoginRedirect from '../../auth/LoginRedirect';
import { useOrganisationsContext } from '../../contexts/useOrganisationsContext.ts';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { oidcConfig } = useConfig();
  const { currentOrganisation, loading: organisationsLoading } = useOrganisationsContext();

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

  if (!currentOrganisation) {
    return <Navigate to="/" replace />;
  }

  return element;
};
