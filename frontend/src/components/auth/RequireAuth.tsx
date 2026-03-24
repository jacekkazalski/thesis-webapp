import useAuth from '../../hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface RequireAuthProps {
  allowedRoles?: string[];
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth?.accessToken) {
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(auth.role ?? '')) {
    return <Navigate to={'/'} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
