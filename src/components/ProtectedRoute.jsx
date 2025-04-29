import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import AccessDenied from '../pages/AccessDenied';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <AccessDenied />;
  }

  return children;
}

export default ProtectedRoute;
