import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import logo from '/logo.png';

const IMAGEN_DEFECTO = 'https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/ef2f188f-ad15-45b1-9bff-639f9546502c/1746031063124_IMG-20250420-WA0009.jpg';

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [imagenes, setImagenes] = useState([IMAGEN_DEFECTO]);
  const [imagenActual, setImagenActual] = useState(IMAGEN_DEFECTO);

  useEffect(() => {
    const obtenerImagenes = async () => {
      const { data, error } = await supabase
        .storage
        .from('imagenes')
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

      if (!error && data.length > 0) {
        const urls = data
          .filter(item => item.name.endsWith('.jpg') || item.name.endsWith('.png'))
          .map(item =>
            supabase.storage.from('imagenes').getPublicUrl(item.name).data.publicUrl
          );
        setImagenes(urls);
        setImagenActual(urls[0]);
      }
    };

    obtenerImagenes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setImagenActual(prev => {
        const idx = imagenes.indexOf(prev);
        return imagenes[(idx + 1) % imagenes.length] || IMAGEN_DEFECTO;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [imagenes]);

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

    if (usuario.rol === 'admin') {
      navigate('/admin', { replace: true });
    } else if (usuario.rol === 'socio') {
      navigate('/restaurants', { replace: true });
    } else {
      navigate('/ranking', { replace: true });
    }

    window.location.reload();
  };

  return (
    <div style={{
      backgroundImage: `url(${imagenActual})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'background-image 1.5s ease-in-out',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1
      }}></div>

      <div style={{
        zIndex: 2,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        textAlign: 'center'
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
