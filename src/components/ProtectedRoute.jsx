import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useUser();

  if (!user) {
    return <p>Cargando...</p>;
  }

  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}

export default ProtectedRoute;

