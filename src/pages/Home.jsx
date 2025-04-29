import { useState } from 'react';
import { supabase } from '../supabase/supabase';
import LoginButton from '../components/LoginButton';
import GuestExploreButton from '../components/GuestExploreButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function Home() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { data, error: queryError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (queryError || !data) {
      setError('Correo no encontrado.');
      return;
    }

    if (data.password !== password) {
      setError('Contraseña incorrecta.');
      return;
    }

    // Login correcto
    login({
      id: data.id,
      email: data.email,
      nombre: data.nombre,
      rol: data.rol,
    });

    // Redirigir según el rol
    if (data.rol === 'admin') {
      navigate('/admin');
    } else {
      navigate('/restaurants');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
      <img src="/logo.png" alt="Gourmets Tarragona" style={{ width: '150px', marginBottom: '2rem' }} />
      <h1>Bienvenido a Gourmets Tarragona</h1>

      {!user ? (
        <>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <LoginButton onClick={() => setShowLoginForm(true)} />
            <GuestExploreButton />
          </div>

          {showLoginForm && (
            <form onSubmit={handleLogin} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: '0.5rem', width: '250px', borderRadius: '0.5rem', border: '1px solid #ccc' }}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ padding: '0.5rem', width: '250px', borderRadius: '0.5rem', border: '1px solid #ccc' }}
              />
              {error && <div style={{ color: 'red' }}>{error}</div>}
              <button type="submit" className="button-primary">
                Entrar
              </button>
            </form>
          )}
        </>
      ) : (
        <>
          <p style={{ marginTop: '2rem' }}>Hola, {user.nombre}.</p>
          <button className="button-primary" onClick={handleLogout} style={{ marginTop: '1rem' }}>
            Cerrar sesión
          </button>
        </>
      )}
    </div>
  );
}

export default Home;
