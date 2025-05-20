import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import logo from '/logo.png';
import GastroniaChatbot from '../components/GastroniaChatbot';

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !usuario) {
      setErrorMsg('Correo o contraseña incorrectos.');
      return;
    }

    localStorage.setItem('usuario_id', usuario.id);
    localStorage.setItem('usuario_rol', usuario.rol);

    if (usuario.rol === 'admin') navigate('/admin', { replace: true });
    else if (usuario.rol === 'socio') navigate('/restaurants', { replace: true });
    else navigate('/ranking', { replace: true });

    window.location.reload();
  };

  const explorarComoInvitado = () => {
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('usuario_rol');
    navigate('/ranking');
    window.location.reload();
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0070b8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem 0 1rem',
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{
          width: '140px',
          marginTop: '1rem',
          marginBottom: '1.5rem',
          objectFit: 'contain',
        }}
      />

      <div
        style={{
          backgroundColor: '#fff',
          height: '55vh',
          width: '100%',
          maxWidth: '400px',
          borderTopLeftRadius: '2rem',
          borderTopRightRadius: '2rem',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
          position: 'relative',
        }}
      >
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700', color: '#222' }}>
          Iniciar sesión
        </h2>

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={estiloInput}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={estiloInput}
          />
          <button type="submit" style={estiloBotonPrimario}>
            Entrar
          </button>
        </form>

        <button onClick={explorarComoInvitado} style={estiloBotonSecundario}>
          Explorar como invitado
        </button>

        {errorMsg && <p style={{ color: 'red', marginTop: '1rem' }}>{errorMsg}</p>}

        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '320px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <GastroniaChatbot modoForzado="publico" />
        </div>
      </div>
    </div>
  );
}

const cajaBase = {
  width: '100%',
  height: '48px',
  boxSizing: 'border-box',
  padding: '0 0.75rem',
  marginBottom: '1rem',
  borderRadius: '0.5rem',
  fontSize: '1rem',
};

const estiloInput = {
  ...cajaBase,
  border: '1px solid #ccc',
};

const estiloBotonPrimario = {
  ...cajaBase,
  backgroundColor: '#0070b8',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  marginBottom: '1rem',
};

const estiloBotonSecundario = {
  ...cajaBase,
  backgroundColor: '#f1f1f1',
  border: '1px solid #ccc',
  cursor: 'pointer',
};

export default Home;

