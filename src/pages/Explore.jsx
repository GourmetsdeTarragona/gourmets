import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import logo from '/logo.png';
import GastroniaChatbot from '../components/GastroniaChatbot';

function Explore() {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const cargarResumenRanking = async () => {
      const { data } = await supabase.rpc('calcular_ranking_general');
      setRanking((data || []).sort((a, b) => b.media - a.media).slice(0, 3));
    };
    cargarResumenRanking();
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
      <img src={logo} alt="Logo" style={{ width: '140px', marginBottom: '1.5rem' }} />

      <div
        style={{
          backgroundColor: '#fff',
          width: '100%',
          maxWidth: '420px',
          borderTopLeftRadius: '2rem',
          borderTopRightRadius: '2rem',
          padding: '2rem 1.5rem',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
          flexGrow: 1,
          overflowY: 'auto',
        }}
      >
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', textAlign: 'center' }}>
          Bienvenido a Gourmets Tarragona
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Descubre nuestra experiencia gastronómica. Cada mes votamos el mejor restaurante. Aquí puedes ver los más destacados.
        </p>

        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>🏆 Top 3 Restaurantes</h3>
        {ranking.length === 0 ? (
          <p>No hay datos disponibles.</p>
        ) : (
          <ol style={{ paddingLeft: '1rem', marginBottom: '1.5rem' }}>
            {ranking.map((r, i) => (
              <li key={r.nombre} style={{ marginBottom: '0.5rem' }}>
                <strong>{i + 1}. {r.nombre}</strong> — Media: {parseFloat(r.media).toFixed(2)}
              </li>
            ))}
          </ol>
        )}

        <button
          onClick={() => navigate('/ranking')}
          style={botonPrincipal}
        >
          Ver ranking completo
        </button>

        <button
          onClick={() => navigate('/')}
          style={botonSecundario}
        >
          Hazte socio
        </button>

        <div style={{ marginTop: '2rem' }}>
          <GastroniaChatbot modoForzado="publico" />
        </div>
      </div>
    </div>
  );
}

const botonPrincipal = {
  width: '100%',
  height: '48px',
  backgroundColor: '#0070b8',
  color: '#fff',
  fontWeight: 'bold',
  borderRadius: '0.5rem',
  border: 'none',
  fontSize: '1rem',
  cursor: 'pointer',
  marginBottom: '1rem',
};

const botonSecundario = {
  ...botonPrincipal,
  backgroundColor: '#f1f1f1',
  color: '#000',
  border: '1px solid #ccc',
};

export default Explore;
