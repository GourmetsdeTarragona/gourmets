import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';
import logoMarcaAgua from '/logo.png';

function Restaurants() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [restaurantes, setRestaurantes] = useState([]);
  const [votaciones, setVotaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagenes, setImagenes] = useState({});

  useEffect(() => {
    if (!user) return;

    const cargarDatos = async () => {
      setLoading(true);

      const { data: restData, error: restError } = await supabase
        .from('restaurantes')
        .select('id, nombre, fecha, asistentes, carta_url, minuta_url')
        .order('fecha', { ascending: false });

      const { data: votosData } = await supabase
        .from('votaciones')
        .select('restaurante_id')
        .eq('usuario_id', user.id);

      if (!restError) {
        setRestaurantes(restData || []);
        setVotaciones(votosData?.map((v) => v.restaurante_id) || []);
        await cargarImagenes(restData);
      } else {
        console.error('Error al cargar restaurantes:', restError.message);
      }

      setLoading(false);
    };

    const cargarImagenes = async (restaurantes) => {
      const nuevoEstado = {};
      for (const r of restaurantes) {
        const { data } = await supabase.storage.from('imagenes').list(`${r.id}`);
        nuevoEstado[r.id] = data || [];
      }
      setImagenes(nuevoEstado);
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
        backgroundColor: '#d0e4fa',
        minHeight: '100vh',
      }}
    >
      <img
        src={logoMarcaAgua}
        alt="Marca de agua"
        style={{
          position: 'fixed',
          opacity: 0.08,
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {restaurantes.map((r) => {
              const yaVotado = votaciones.includes(r.id);
              const puedeVotar = r.asistentes?.includes(user.id);
              const imagenesRest = imagenes[r.id] || [];

              return (
                <div
                  key={r.id}
                  style={{
                    background: '#fff',
                    borderLeft: `6px solid ${yaVotado ? '#28a745' : puedeVotar ? '#ffc107' : '#dee2e6'}`,
                    borderRadius: '1rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    padding: '1.5rem',
                  }}
                >
                  <h2 style={{ marginBottom: '0.5rem', fontSize: '1.4rem' }}>{r.nombre}</h2>
                  <p style={{ marginBottom: '1rem' }}>
                    Fecha: {r.fecha ? new Date(r.fecha).toLocaleDateString() : 'Sin asignar'}
                  </p>

                  {(r.carta_url || r.minuta_url) && (
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      {r.carta_url && (
                        <a
                          href={r.carta_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={buttonMini}
                        >
                          Ver Carta
                        </a>
                      )}
                      {r.minuta_url && (
                        <a
                          href={r.minuta_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={buttonMini}
                        >
                          Ver Minuta
                        </a>
                      )}
                    </div>
                  )}

                  {imagenesRest.length > 0 && (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {imagenesRest.slice(0, 3).map((img) => (
                        <img
                          key={img.name}
                          src={`https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/${r.id}/${img.name}`}
                          alt={img.name}
                          style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '0.5rem' }}
                        />
                      ))}
                    </div>
                  )}

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

const buttonMini = {
  backgroundColor: '#B48C59',
  color: '#fff',
  padding: '0.4rem 0.8rem',
  borderRadius: '0.4rem',
  textDecoration: 'none',
  fontWeight: 'bold',
};

export default Restaurants;
