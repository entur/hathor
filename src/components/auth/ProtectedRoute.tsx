import React from 'react';
import { useAuth } from '../../auth';
import { useConfig } from '../../contexts/configContext.ts';
import LoginRedirect from '../../auth/LoginRedirect';
import { useOrganisations } from '../../data/organisations/hooks/useOrganisations.ts';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { oidcConfig } = useConfig();
  const { currentOrganisation } = useOrganisations();
  const navigate = useNavigate();

  if (!oidcConfig) {
    return element;
  }

  if (isLoading) {
    return <div>Loading authentication status...</div>;
  }

  if (!isAuthenticated) {
    return <LoginRedirect />;
  }

  if (!currentOrganisation) {
    navigate('/');
    return <div>Redirecting to home...</div>;
  }

  return element;
};
