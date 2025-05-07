import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';

function Restaurants() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [votados, setVotados] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);

    const { data: restData, error: restError } = await supabase
      .from('restaurantes')
      .select('*')
      .order('fecha', { ascending: false });

    const { data: votosData, error: votosError } = await supabase
      .from('votaciones')
      .select('restaurante_id')
      .eq('usuario_id', user.id);

    if (restError) {
      console.error('Error cargando restaurantes:', restError.message);
    } else {
      setRestaurantes(restData || []);
    }

    if (votosError) {
      console.error('Error verificando votos:', votosError.message);
    } else {
      const idsVotados = votosData.map((v) => v.restaurante_id);
      setVotados(idsVotados);
    }

    setLoading(false);
  };

  const handleVotar = (id) => {
    navigate(`/vote/${id}`);
  };

  return (
    <div className="container">
      <h1>Restaurantes disponibles</h1>
      {loading ? (
        <p>Cargando restaurantes...</p>
      ) : restaurantes.length === 0 ? (
        <p>No hay restaurantes disponibles.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {restaurantes.map((r) => (
            <li
              key={r.id}
              style={{
                background: '#fff',
                padding: '1rem',
                borderRadius: '1rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                marginBottom: '1rem',
              }}
            >
              <strong>{r.nombre}</strong> —{' '}
              {r.fecha ? new Date(r.fecha).toLocaleDateString() : 'Sin fecha'}
              <br />
              <button
                className="button-primary"
                style={{
                  marginTop: '0.5rem',
                  backgroundColor: votados.includes(r.id) ? '#ccc' : '#000',
                  cursor: votados.includes(r.id) ? 'not-allowed' : 'pointer',
                }}
                disabled={votados.includes(r.id)}
                onClick={() => handleVotar(r.id)}
              >
                {votados.includes(r.id) ? 'Ya votado' : 'Votar'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Restaurants;
