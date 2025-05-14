import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import logo from '/logo.png';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function Ranking() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [vinos, setVinos] = useState([]);
  const [tab, setTab] = useState('restaurantes');
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetchRankingRestaurantes();
    fetchRankingVinos();
  }, [user]);

  const fetchRankingRestaurantes = async () => {
    const { data, error } = await supabase.rpc('calcular_ranking_personalizado_v2', {
      uid: user.id,
    });
    if (!error) setRestaurantes(data);
    else console.error('Error ranking restaurantes:', error.message);
  };

  const fetchRankingVinos = async () => {
    const { data, error } = await supabase.rpc('ranking_vinos_v2');
    if (!error) setVinos(data);
    else console.error('Error ranking vinos:', error.message);
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#d0e4fa',
        padding: '2rem',
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.07,
          width: '60%',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Ranking
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setTab('restaurantes')}
            style={{
              backgroundColor: tab === 'restaurantes' ? '#000' : '#ccc',
              color: '#fff',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
            }}
          >
            🥘 Restaurantes
          </button>
          <button
            onClick={() => setTab('vinos')}
            style={{
              backgroundColor: tab === 'vinos' ? '#000' : '#ccc',
              color: '#fff',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
            }}
          >
            🍷 Vinos
          </button>
        </div>

        {tab === 'restaurantes' && (
          <>
            {restaurantes.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {restaurantes.map((r, idx) => (
                  <li
                    key={r.id}
                    style={{
                      background: '#fff',
                      marginBottom: '1rem',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    }}
                  >
                    <h3 style={{ marginBottom: '0.5rem' }}>
                      #{idx + 1} – {r.nombre}
                    </h3>
                    <p>
                      Tu media: <strong>{r.tu_media ? parseFloat(r.tu_media).toFixed(2) : '—'}</strong> | Media global:{' '}
                      <strong>{r.promedio ? parseFloat(r.promedio).toFixed(2) : '—'}</strong>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ textAlign: 'center' }}>No hay datos de ranking.</p>
            )}
          </>
        )}

        {tab === 'vinos' && (
          <>
            {vinos.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {vinos.map((vino, idx) => (
                  <li
                    key={vino.restaurante_id}
                    style={{
                      background: '#fffaf2',
                      marginBottom: '1rem',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    }}
                  >
                    <h3 style={{ marginBottom: '0.5rem' }}>
                      #{idx + 1} – {vino.nombre_restaurante}
                    </h3>
                    <p>
                      Categoría: <strong>{vino.nombre_extra}</strong><br />
                      Media: <strong>{parseFloat(vino.promedio).toFixed(2)}</strong>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ textAlign: 'center' }}>No hay datos de vinos disponibles.</p>
            )}
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            className="button-primary"
            onClick={() => navigate('/restaurants')}
            style={{ backgroundColor: '#000', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}
          >
            Volver a restaurantes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ranking;
