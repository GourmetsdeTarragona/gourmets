import { useNavigate } from 'react-router-dom';
import logo from '/logo.png';

function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundImage: 'url(https://YOUR-SUPABASE-URL/storage/v1/object/public/imagenes/demo.jpg)', // Cambia por tu imagen real
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(0px)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Fondo difuminado por encima */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        }}
      ></div>

      <div style={{ zIndex: 2, textAlign: 'center', color: 'white' }}>
        <img
          src={logo}
          alt="Logo Gourmets"
          style={{
            width: '130px',
            marginBottom: '2rem',
            animation: 'fadeIn 2s ease-in-out',
          }}
        />
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
          Bienvenido a Gourmets Tarragona
        </h1>
        <p style={{ marginBottom: '2rem' }}>¿Cómo quieres continuar?</p>

        <div>
          <button
            onClick={() => navigate('/login')}
            style={{
              margin: '0 1rem',
              padding: '0.7rem 1.5rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: '#ffffffcc',
              color: '#000',
            }}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate('/ranking')}
            style={{
              margin: '0 1rem',
              padding: '0.7rem 1.5rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: '#ffffffcc',
              color: '#000',
            }}
          >
            Explorar como invitado
          </button>
        </div>
      </div>

      {/* Animación opcional */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}

export default Home;

