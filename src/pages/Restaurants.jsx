import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';

function Restaurants() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [restaurantes, setRestaurantes] = useState([]);
  const [votaciones, setVotaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const cargarDatos = async () => {
      setLoading(true);

      const { data: restData, error: restError } = await supabase
        .from('restaurantes')
        .select('id, nombre, fecha, asistentes')
        .order('fecha', { ascending: false });

      const { data: votosData } = await supabase
        .from('votaciones')
        .select('restaurante_id')
        .eq('usuario_id', user.id);

      if (restError) console.error('Error al cargar restaurantes:', restError.message);
      else {
        setRestaurantes(restData || []);
        setVotaciones(votosData?.map((v) => v.restaurante_id) || []);
      }

      setLoading(false);
    };

    cargarDatos();
  }, [user]);

  const handleVote = (id) => {
    navigate(`/vote/${id}`);
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Lista de Restaurantes</h1>
      {loading ? (
        <p>Cargando restaurantes...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {restaurantes.map((r) => {
            const yaVotado = votaciones.includes(r.id);
            const puedeVotar = r.asistentes?.includes(user.id);

            return (
              <div
                key={r.id}
                style={{
                  background: '#fffdf8',
                  borderLeft: `6px solid ${yaVotado ? '#28a745' : puedeVotar ? '#ffc107' : '#dee2e6'}`,
                  borderRadius: '1rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                }}
              >
                <h2 style={{ marginBottom: '0.5rem', fontSize: '1.4rem', color: '#111' }}>{r.nombre}</h2>
                <p style={{ marginBottom: '1rem', color: '#555' }}>
                  Fecha: {r.fecha ? new Date(r.fecha).toLocaleDateString() : 'Sin asignar'}
                </p>

                <button
                  className="button-primary"
                  style={{
                    backgroundColor: yaVotado ? '#6c757d' : '#000',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: yaVotado || !puedeVotar ? 'not-allowed' : 'pointer',
                    opacity: yaVotado || !puedeVotar ? 0.6 : 1,
                  }}
                  onClick={() => !yaVotado && puedeVotar && handleVote(r.id)}
                  disabled={yaVotado || !puedeVotar}
                >
                  {yaVotado ? 'Ya votado' : puedeVotar ? 'Votar' : 'No asististe'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Restaurants;
