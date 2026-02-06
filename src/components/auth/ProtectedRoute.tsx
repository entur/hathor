import React from 'react';
import { useAuth } from '../../auth';
import { useConfig } from '../../contexts/configContext.ts';
import LoginRedirect from '../../auth/LoginRedirect';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { oidcConfig } = useConfig();

  if (!oidcConfig) {
    return element;
  }

  if (isLoading) {
    return <div>Loading authentication status...</div>;
  }

  if (!isAuthenticated) {
    return <LoginRedirect />;
  }

  return element;
};
