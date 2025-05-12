import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import logo from '/logo.png';
import GastroniaChatbot from '../components/GastroniaChatbot';

const IMAGEN_DEFECTO =
  'https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/imagenes/foto-defecto.jpg';

function Home() {
  const navigate = useNavigate();
  const [imagenActual, setImagenActual] = useState(IMAGEN_DEFECTO);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const obtenerImagenAleatoria = async () => {
      const { data, error } = await supabase.storage.from('imagenes').list('imagenes', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' },
      });

      if (!error && data.length > 0) {
        const imagenesValidas = data.filter((item) => item.name.match(/\.(jpg|jpeg|png)$/i));
        const seleccion = imagenesValidas[Math.floor(Math.random() * imagenesValidas.length)];

        if (seleccion) {
          const { data: urlData } = supabase.storage
            .from('imagenes')
            .getPublicUrl(`imagenes/${seleccion.name}`);
          setImagenActual(urlData.publicUrl);
        }
      }
    };

    obtenerImagenAleatoria();
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
    <div
      style={{
        backgroundImage: `url(${imagenActual})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        }}
      />

      <div style={{ zIndex: 2, textAlign: 'center' }}>
        <img src={logo} alt="Logo Gourmets" style={{ width: '140px', marginBottom: '1.5rem' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            className="button-primary"
            style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}
            onClick={() => setMostrarLogin(true)}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate('/ranking')}
            className="button-light"
            style={{
              backgroundColor: '#eee',
              border: '1px solid #ccc',
              padding: '0.75rem 2rem',
              fontSize: '1.1rem',
              borderRadius: '0.5rem',
            }}
          >
            Explorar como invitado
          </button>
        </div>

        <div style={{ marginTop: '3rem', maxWidth: '480px', marginInline: 'auto' }}>
          <GastroniaChatbot />
        </div>
      </div>

      {mostrarLogin && (
        <div
          style={{
            zIndex: 3,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setMostrarLogin(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '1rem',
              padding: '2rem',
              width: '90%',
              maxWidth: '400px',
              textAlign: 'center',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMostrarLogin(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                fontSize: '1.2rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            <h2>Iniciar sesión</h2>
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
                  fontSize: '1rem',
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
                  fontSize: '1rem',
                }}
              />
              <button type="submit" className="button-primary" style={{ width: '100%' }}>
                Entrar
              </button>
            </form>
            {errorMsg && <p style={{ color: 'red', marginTop: '1rem' }}>{errorMsg}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
