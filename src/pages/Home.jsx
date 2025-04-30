import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import logo from '/logo.png';

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg('Correo o contraseña incorrectos.');
      return;
    }

    // Buscar el perfil y redirigir según rol
    const { data: perfil, error: perfilError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', data.user.id)
      .single();

    if (perfilError || !perfil) {
      setErrorMsg('Error al cargar el perfil del usuario.');
      return;
    }

    const rol = perfil.rol;

    if (rol === 'admin') navigate('/admin');
    else if (rol === 'socio') navigate('/restaurants');
    else navigate('/ranking');
  };

  return (
    <div
      style={{
        backgroundImage:
          'url(https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/ef2f188f-ad15-45b1-9bff-639f9546502c/1746031063124_IMG-20250420-WA0009.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        }}
      ></div>

      <div
        style={{
          zIndex: 2,
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: '2rem',
          borderRadius: '1rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          textAlign: 'center',
        }}
      >
        <img src={logo} alt="Logo Gourmets" style={{ width: '120px', marginBottom: '1.5rem' }} />
        <h2 style={{ marginBottom: '1rem' }}>Iniciar sesión</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />

          <button
            type="submit"
            className="button-primary"
            style={{ width: '100%' }}
          >
            Entrar
          </button>

          {errorMsg && (
            <p style={{ color: 'red', marginTop: '1rem' }}>{errorMsg}</p>
          )}
        </form>

        <button
          onClick={() => navigate('/ranking')}
          className="button-light"
          style={{ marginTop: '1.5rem', width: '100%' }}
        >
          Explorar como invitado
        </button>
      </div>
    </div>
  );
}

export default Home;
