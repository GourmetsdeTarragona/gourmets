import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import logo from '/logo.png';
import GastroniaChatbot from '../components/GastroniaChatbot';

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0070b8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem 0 1rem',
      }}
    >
      {/* Logo sin borde, centrado arriba */}
      <img
        src={logo}
        alt="Logo"
        style={{
          width: '100px',
          marginTop: '1rem',
          marginBottom: '1.5rem',
          objectFit: 'contain',
        }}
      />

      {/* Contenedor blanco que ocupa toda la altura restante */}
      <div
        style={{
          backgroundColor: '#fff',
          flex: 1,
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

        <button onClick={() => navigate('/ranking')} style={estiloBotonSecundario}>
          Explorar como invitado
        </button>

        {errorMsg && <p style={{ color: 'red', marginTop: '1rem' }}>{errorMsg}</p>}

        {/* Chatbot compacto, bajo el botón */}
        <div style={{ marginTop: '1.5rem', width: '100%', maxWidth: '320px' }}>
          <GastroniaChatbot modoForzado="publico" />
        </div>
      </div>
    </div>
  );
}

// Estilos reutilizables
const estiloInput = {
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  borderRadius: '0.5rem',
  border: '1px solid #ccc',
  fontSize: '1rem',
  transition: 'border 0.3s',
};

const estiloBotonPrimario = {
  backgroundColor: '#0070b8',
  color: '#fff',
  padding: '0.75rem',
  borderRadius: '0.5rem',
  border: 'none',
  fontSize: '1rem',
  width: '100%',
  cursor: 'pointer',
  marginBottom: '1rem',
  transition: 'background 0.3s',
};

const estiloBotonSecundario = {
  backgroundColor: '#f1f1f1',
  border: '1px solid #ccc',
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '0.5rem',
  width: '100%',
  cursor: 'pointer',
  transition: 'all 0.3s',
};

export default Home;
