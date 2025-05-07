import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';
import logoMarcaAgua from '/logo.png'; // asegúrate que esté en /public y bien importado

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

      if (!restError) {
        setRestaurantes(restData || []);
        setVotaciones(votosData?.map((v) => v.restaurante_id) || []);
      } else {
        console.error('Error al cargar restaurantes:', restError.message);
      }

      setLoading(false);
    };

    cargarDatos();
  }, [user]);

  const handleVote = (id) => navigate(`/vote/${id}`);
  const handleRanking = () => navigate('/ranking');

  return (
    <div
      className="container"
      style={{
        position: 'relative',
        paddingTop: '2rem',
        backgroundColor: '#fdf6e4', // tono suave basado en el logo
        minHeight: '100vh',
      }}
    >
      <img
        src={logoMarcaAgua}
        alt="Marca de agua"
        style={{
          position: 'fixed',
          opacity: 0.05,
          zIndex: 0,
          width: '60%',
          top: '25%',
          left: '20%',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ marginBottom: '2rem', fontSize: '2rem', color: '#222' }}>
            Restaurantes disponibles
          </h1>
          <button
            className="button-primary"
            onClick={handleRanking}
            style={{
              backgroundColor: '#B48C59',
              padding: '0.5rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontWeight: 'bold',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Ver Ranking
          </button>
        </div>

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
                    background: '#fff',
                    borderLeft: `6px solid ${yaVotado ? '#28a745' : puedeVotar ? '#ffc107' : '#dee2e6'}`,
                    borderRadius: '1rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <h2 style={{ marginBottom: '0.5rem', fontSize: '1.4rem' }}>{r.nombre}</h2>
                  <p style={{ marginBottom: '1rem' }}>
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
    </div>
  );
}

export default Restaurants;
