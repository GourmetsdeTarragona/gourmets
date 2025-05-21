import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import logo from '/logo.png';
import GastroniaChatbot from '../components/GastroniaChatbot';

function Explorar() {
  const navigate = useNavigate();
  const [top3, setTop3] = useState([]);

  useEffect(() => {
    const cargarTop = async () => {
      const { data, error } = await supabase.rpc('calcular_ranking_general');
      if (!error) setTop3(data.slice(0, 3));
    };

    cargarTop();
  }, []);

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
      {/* Logo centrado */}
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

      {/* Contenedor blanco */}
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
          justifyContent: 'flex-start',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
          position: 'relative',
        }}
      >
        {/* Título */}
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700', color: '#222' }}>
          Bienvenido a Gourmets Tarragona
        </h2>

        {/* Sección: Quiénes somos */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'left', width: '100%' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>¿Quiénes somos?</h3>
          <p style={{ fontSize: '0.95rem', color: '#444' }}>
            Somos una comunidad que celebra la gastronomía en cenas únicas, donde se valora la cocina con elegancia y amistad.
          </p>
        </div>

        {/* Sección: Ranking */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'left', width: '100%' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Ranking destacado</h3>
          <p style={{ fontSize: '0.95rem', color: '#444', marginBottom: '0.5rem' }}>
            Consulta los restaurantes mejor valorados por nuestros socios:
          </p>
          <ol style={{ paddingLeft: '1.25rem', marginBottom: '1rem', fontSize: '0.95rem', color: '#333' }}>
            {top3.map((r, i) => (
              <li key={r.id}>
                <strong>{r.nombre}</strong> – nota media: {r.nota_media.toFixed(2)}
              </li>
            ))}
          </ol>
          <button
            onClick={() => navigate('/ranking')}
            style={estiloBotonPrimario}
          >
            Ver ranking completo
          </button>
        </div>

        {/* Sección: Hazte socio */}
        <div style={{ marginBottom: '1rem', textAlign: 'left', width: '100%' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>¿Te gustaría unirte?</h3>
          <p style={{ fontSize: '0.95rem', color: '#444' }}>
            Si compartes nuestra pasión por la alta cocina, estás a un paso de formar parte.
          </p>
          <button
            onClick={() => navigate('/contacto')}
            style={estiloBotonSecundario}
          >
            Hazte socio
          </button>
        </div>

        {/* Chatbot */}
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






