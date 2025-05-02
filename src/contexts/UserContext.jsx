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

    // Guardamos datos mínimos del usuario
    localStorage.setItem('usuario_id', usuario.id);
    localStorage.setItem('usuario_rol', usuario.rol);

    // Redirige inmediatamente según rol
    if (usuario.rol === 'admin') {
      navigate('/admin', { replace: true });
    } else if (usuario.rol === 'socio') {
      navigate('/restaurants', { replace: true });
    } else {
      navigate('/ranking', { replace: true });
    }

    // Forzamos recarga del contexto (por si acaso)
    window.location.reload();
  };

  return (
    <div style={{
      backgroundImage:
        'url(https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/ef2f188f-ad15-45b1-9bff-639f9546502c/1746031063124_IMG-20250420-WA0009.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1,
      }}></div>

      <div style={{
        zIndex: 2,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        textAlign: 'center',
      }}>
        <img src={logo} alt="Logo Gourmets" style={{ width: '120px', marginBottom: '1.5rem' }} />
        <h2 style={{ marginBottom: '1rem' }}>Iniciar sesión</h2>

        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required style={{
            width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem', border: '1px solid #ccc'
          }} />

          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{
            width: '100%', padding: '0.75rem', marginBottom: '1.5rem', borderRadius: '0.5rem', border: '1px solid #ccc'
          }} />

          <button type="submit" className="button-primary" style={{ width: '100%' }}>
            Entrar
          </button>

          {errorMsg && <p style={{ color: 'red', marginTop: '1rem' }}>{errorMsg}</p>}
        </form>

        <button onClick={() => navigate('/ranking')} className="button-light" style={{ marginTop: '1.5rem', width: '100%' }}>
          Explorar como invitado
        </button>
      </div>
    </div>
  );
}

export default Home;
