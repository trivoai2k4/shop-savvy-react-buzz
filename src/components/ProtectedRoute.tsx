
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  redirectTo?: string;
  requireAuth?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  isAuthenticated = false, 
  redirectTo = '/login',
  requireAuth = true 
}: ProtectedRouteProps) => {
  const location = useLocation();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page while preserving the attempted location
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated but shouldn't access this route (e.g., login page)
  if (!requireAuth && isAuthenticated) {
    // Redirect to home or the location they came from
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
