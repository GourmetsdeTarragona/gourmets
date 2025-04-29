import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    // Si no está logueado, enviarlo al inicio
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Si está logueado pero no tiene permiso, mandarlo al Home
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
