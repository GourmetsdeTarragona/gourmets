import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function Navbar() {
  const { user, logout } = useUser();

  if (!user) return null;

  return (
    <nav
      style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div>
        <strong>Gourmets Tarragona</strong>
        {user.rol && <span style={{ marginLeft: '1rem', fontStyle: 'italic' }}>({user.rol})</span>}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {user.rol === 'admin' && (
          <>
            <Link to="/admin">Panel</Link>
            <Link to="/admin/restaurantes">Restaurantes</Link>
            <Link to="/admin/create-restaurant">Nuevo restaurante</Link>
          </>
        )}

        {user.rol === 'socio' && (
          <>
            <Link to="/restaurants">Restaurantes</Link>
            <Link to="/ranking">Ranking</Link>
          </>
        )}

        <button
          onClick={logout}
          className="button-light"
          style={{ marginLeft: '1rem' }}
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
