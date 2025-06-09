// Archivo: Restaurants.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';
import logo from '/logo.png';
import GastroniaChatbot from '../components/GastroniaChatbot';

function Restaurants() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [restaurantes, setRestaurantes] = useState([]);
  const [votaciones, setVotaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagenes, setImagenes] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [imagenesModal, setImagenesModal] = useState([]);
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);

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
        if (data) {
          nuevoEstado[r.id] = data.map((img) => `${r.id}/${img.name}`);
        }
      }
      setImagenes(nuevoEstado);
    };

    cargarDatos();
  }, [user]);

  const handleVote = (id) => navigate(`/vote/${id}`);
  const handleRanking = () => navigate('/ranking');

  const abrirModalImagenes = (id) => {
    setImagenesModal(imagenes[id] || []);
    setModalVisible(true);
  };

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0070b8', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem 0 1rem' }}>
      <img src={logo} alt="Logo" style={{ width: '140px', marginBottom: '1.5rem', objectFit: 'contain' }} />

      <div style={{ backgroundColor: '#fff', height: 'auto', width: '100%', maxWidth: '420px', borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem', padding: '2rem 1.5rem', boxShadow: '0 -4px 20px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#222' }}>Restaurantes</h2>
          <button onClick={handleRanking} style={miniBoton}>Ver ranking</button>
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
                <div key={r.id} style={{ backgroundColor: '#f9f9f9', borderRadius: '1rem', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', borderLeft: `5px solid ${yaVotado ? '#28a745' : puedeVotar ? '#ffc107' : '#ccc'}` }}>
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '600' }}>{r.nombre}</h3>
                  <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>Fecha: {r.fecha ? new Date(r.fecha).toLocaleDateString() : 'Sin asignar'}</p>

                  {(r.carta_url || r.minuta_url || imagenesRest.length > 0) && (
                    <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                      {r.carta_url && <a href={r.carta_url} target="_blank" rel="noopener noreferrer" style={miniBoton}>Carta</a>}
                      {r.minuta_url && <a href={r.minuta_url} target="_blank" rel="noopener noreferrer" style={miniBoton}>Minuta</a>}
                      {imagenesRest.length > 0 && <button onClick={() => abrirModalImagenes(r.id)} style={miniBoton}>Ver fotos</button>}
                    </div>
                  )}

                  <button onClick={() => !yaVotado && puedeVotar && handleVote(r.id)} disabled={yaVotado || !puedeVotar} style={{ width: '100%', height: '48px', backgroundColor: yaVotado ? '#6c757d' : puedeVotar ? '#0070b8' : '#ccc', color: '#fff', fontWeight: 'bold', fontSize: '1rem', border: 'none', borderRadius: '0.5rem', cursor: yaVotado || !puedeVotar ? 'not-allowed' : 'pointer', opacity: yaVotado || !puedeVotar ? 0.6 : 1, transition: 'all 0.3s' }}>{yaVotado ? 'Ya votado' : puedeVotar ? 'Votar' : 'No asististe'}</button>
                </div>
              );
            })
          )}
        </div>

        {modalVisible && (
          <div style={modalOverlay} onClick={() => setModalVisible(false)}>
            <div style={modalContenido} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setModalVisible(false)} style={botonCerrar}>✕</button>
              <div style={galeriaMiniaturas}>
                {imagenesModal.map((rutaCompleta) => (
                  <img
                    key={rutaCompleta}
                    src={`https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/${rutaCompleta}`}
                    alt={rutaCompleta}
                    style={miniatura}
                    onClick={() => setFotoSeleccionada(rutaCompleta)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {fotoSeleccionada && (
          <div style={fullscreenOverlay} onClick={() => setFotoSeleccionada(null)}>
            <img
              src={`https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/${fotoSeleccionada}`}
              alt="foto"
              style={imagenGrande}
            />
          </div>
        )}

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

const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalContenido = {
  backgroundColor: '#fff',
  padding: '1rem',
  borderRadius: '1rem',
  maxWidth: '90vw',
  maxHeight: '80vh',
  overflowY: 'auto',
  position: 'relative',
};

const botonCerrar = {
  position: 'absolute',
  top: '0.5rem',
  right: '0.5rem',
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
};

const galeriaMiniaturas = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  justifyContent: 'center',
};

const miniatura = {
  width: '90px',
  height: '60px',
  objectFit: 'cover',
  borderRadius: '0.5rem',
  cursor: 'pointer',
};

const fullscreenOverlay = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1100,
};

const imagenGrande = {
  maxWidth: '95%',
  maxHeight: '90%',
  borderRadius: '1rem',
};

export default Restaurants;





