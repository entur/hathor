import { useEffect } from 'react';
import { useAuth } from './index';
import { useLocation, useNavigate } from 'react-router-dom';

const LoginRedirect = () => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const returnUrl = useLocation().pathname;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      login(returnUrl);
    } else if (isAuthenticated) {
      navigate(returnUrl);
    }
  }, [isLoading, isAuthenticated, login, navigate, returnUrl]);

  if (isLoading) return <div>Checking authentication status...</div>;

  return <div>Redirecting to login provider...</div>;
};

export default LoginRedirect;
