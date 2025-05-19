import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';
import logo from '/logo.png';
import GastroniaChatbot from '../components/GastroniaChatbot'; // ⬅️ NUEVO

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
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0070b8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem 0 1rem',
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{ width: '140px', marginBottom: '1.5rem', objectFit: 'contain' }}
      />

      <div
        style={{
          backgroundColor: '#fff',
          height: 'auto',
          width: '100%',
          maxWidth: '420px',
          borderTopLeftRadius: '2rem',
          borderTopRightRadius: '2rem',
          padding: '2rem 1.5rem',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#222' }}>
            Restaurantes
          </h2>
          <button
            onClick={handleRanking}
            style={{
              backgroundColor: '#B48C59',
              padding: '0.4rem 0.9rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontWeight: 'bold',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Ver ranking
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {loading ? (
            <p>Cargando restaurantes...</p>
          ) : (
            restaurantes.map((r) => {
              const yaVotado = votaciones.includes(r.id);
              const puedeVotar = r.asistentes?.includes(user.id);
              const imagenesRest = imagenes[r.id] || [];

              return (
                <div
                  key={r.id}
                  style={{
                    backgroundColor: '#f9f9f9',
                    borderRadius: '1rem',
                    padding: '1rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    borderLeft: `5px solid ${
                      yaVotado ? '#28a745' : puedeVotar ? '#ffc107' : '#ccc'
                    }`,
                  }}
                >
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '600' }}>
                    {r.nombre}
                  </h3>
                  <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    Fecha: {r.fecha ? new Date(r.fecha).toLocaleDateString() : 'Sin asignar'}
                  </p>

                  {(r.carta_url || r.minuta_url) && (
                    <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.8rem' }}>
                      {r.carta_url && (
                        <a href={r.carta_url} target="_blank" rel="noopener noreferrer" style={miniBoton}>
                          Carta
                        </a>
                      )}
                      {r.minuta_url && (
                        <a href={r.minuta_url} target="_blank" rel="noopener noreferrer" style={miniBoton}>
                          Minuta
                        </a>
                      )}
                    </div>
                  )}

                  {imagenesRest.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
                      {imagenesRest.slice(0, 3).map((img) => (
                        <img
                          key={img.name}
                          src={`https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/${r.id}/${img.name}`}
                          alt={img.name}
                          style={{
                            width: '70px',
                            height: '55px',
                            objectFit: 'cover',
                            borderRadius: '0.4rem',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => !yaVotado && puedeVotar && handleVote(r.id)}
                    disabled={yaVotado || !puedeVotar}
                    style={{
                      width: '100%',
                      height: '48px',
                      backgroundColor: yaVotado
                        ? '#6c757d'
                        : puedeVotar
                        ? '#0070b8'
                        : '#ccc',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: yaVotado || !puedeVotar ? 'not-allowed' : 'pointer',
                      opacity: yaVotado || !puedeVotar ? 0.6 : 1,
                      transition: 'all 0.3s',
                    }}
                  >
                    {yaVotado ? 'Ya votado' : puedeVotar ? 'Votar' : 'No asististe'}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* ⬇️ Chatbot insertado aquí */}
        <div style={{ marginTop: '2rem' }}>
          <GastroniaChatbot />
        </div>
      </div>
    </div>
  );
}

const miniBoton = {
  backgroundColor: '#B48C59',
  color: '#fff',
  padding: '0.4rem 0.8rem',
  borderRadius: '0.4rem',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '0.9rem',
};

export default Restaurants;


