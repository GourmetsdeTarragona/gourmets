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
  const { user } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      navigate('/restaurants');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
          <p style={{ marginTop: '2rem' }}>Ya estás logueado.</p>
          <button className="button-primary" onClick={handleLogout} style={{ marginTop: '1rem' }}>
            Cerrar sesión
          </button>
        </>
      )}
    </div>
  );
}

export default Home;
