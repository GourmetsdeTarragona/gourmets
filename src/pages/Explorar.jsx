import { useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import GastroniaChatbot from '../components/GastroniaChatbot';

const fondoEvento =
  'https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/imagenes/forti-evento.jpg';

function Explorar() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        backgroundImage: `url(${fondoEvento})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Filtro oscuro */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
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
            width: '100%',
            maxWidth: '400px',
            borderTopLeftRadius: '2rem',
            borderTopRightRadius: '2rem',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
            position: 'relative',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#222', marginBottom: '2rem' }}>
            Explora nuestra comunidad gourmet
          </h2>

          <button
            onClick={() => navigate('/ranking')}
            style={estiloBotonPrimario}
          >
            Ver cenas destacadas
          </button>

          <button
            onClick={() => navigate('/restaurants')}
            style={estiloBotonPrimario}
          >
            Ver todos los restaurantes
          </button>

          <button
            onClick={() => navigate('/contacto')}
            style={estiloBotonSecundario}
          >
            Quiero ser socio
          </button>

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
            <GastroniaChatbot modo="invitado" />
          </div>
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

const estiloBotonPrimario = {
  ...cajaBase,
  backgroundColor: '#0070b8',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

const estiloBotonSecundario = {
  ...cajaBase,
  backgroundColor: '#f1f1f1',
  border: '1px solid #ccc',
  cursor: 'pointer',
};

export default Explorar;






