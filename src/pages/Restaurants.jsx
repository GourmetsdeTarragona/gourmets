import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabase';
import { useUser } from '../contexts/UserContext';

function Restaurants() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [restaurantes, setRestaurantes] = useState([]);
  const [votos, setVotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);

      // Restaurantes donde este socio fue asistente
      const { data: rData, error: rError } = await supabase
        .from('restaurantes')
        .select('*')
        .contains('asistentes', [user.id]);

      if (rError) {
        console.error('Error cargando restaurantes:', rError);
        setLoading(false);
        return;
      }

      setRestaurantes(rData || []);

      // Votos ya emitidos por este socio
      const { data: votosData } = await supabase
        .from('votos')
        .select('restaurante_id')
        .eq('socio_id', user.id);

      setVotos(votosData.map(v => v.restaurante_id));
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const haVotado = (restauranteId) => votos.includes(restauranteId);

  if (loading) return <p>Cargando restaurantes...</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <h2>Restaurantes visitados</h2>

      {restaurantes.length === 0 && (
        <p>No hay restaurantes asignados a tu perfil.</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {restaurantes.map((r) => (
          <li key={r.id} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            <h3>{r.nombre}</h3>
            <p><strong>Fecha:</strong> {r.fecha}</p>
            {haVotado(r.id) ? (
              <p style={{ color: 'green' }}>✅ Ya has votado</p>
            ) : (
              <button onClick={() => navigate(`/vote/${r.id}`)}>
                Votar ahora
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Restaurants;
