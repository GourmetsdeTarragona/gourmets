import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';
import logo from '/logo.png';
import { useNavigate } from 'react-router-dom';

function Ranking() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRanking = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('calcular_ranking_personalizado', {
        user_id_param: user.id,
      });

      if (!error) {
        setRanking(data);
      } else {
        console.error('Error al cargar ranking:', error.message);
      }
      setLoading(false);
    };

    fetchRanking();
  }, [user]);

  const agrupadoPorRestaurante = ranking.reduce((acc, fila) => {
    if (!acc[fila.restaurante_id]) {
      acc[fila.restaurante_id] = {
        nombre: fila.nombre,
        categorias: [],
      };
    }
    acc[fila.restaurante_id].categorias.push({
      categoria: fila.categoria,
      puntuacion_usuario: fila.puntuacion_usuario,
      media_otros: fila.media_otros,
    });
    return acc;
  }, {});

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
          Mi Ranking Personal
        </h1>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Cargando ranking...</p>
        ) : Object.keys(agrupadoPorRestaurante).length === 0 ? (
          <p style={{ textAlign: 'center' }}>No hay datos de ranking disponibles.</p>
        ) : (
          Object.entries(agrupadoPorRestaurante).map(([restId, rest]) => (
            <div
              key={restId}
              style={{
                backgroundColor: '#fff',
                padding: '1.5rem',
                borderRadius: '1rem',
                marginBottom: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              <h2 style={{ marginBottom: '1rem' }}>{rest.nombre}</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={thStyle}>Categoría</th>
                    <th style={thStyle}>Tu nota</th>
                    <th style={thStyle}>Media de los demás</th>
                  </tr>
                </thead>
                <tbody>
                  {rest.categorias.map((cat, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{cat.categoria}</td>
                      <td style={tdStyle}>
                        {cat.puntuacion_usuario ? parseFloat(cat.puntuacion_usuario).toFixed(1) : '—'}
                      </td>
                      <td style={tdStyle}>
                        {cat.media_otros ? parseFloat(cat.media_otros).toFixed(1) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            className="button-primary"
            onClick={() => navigate('/restaurants')}
          >
            Volver a restaurantes
          </button>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #ccc',
  fontWeight: 'bold',
  textAlign: 'left',
};

const tdStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #eee',
};

export default Ranking;
