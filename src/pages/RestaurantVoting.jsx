// Archivo: RestaurantVoting.jsx con scroll lateral de fotos ampliadas

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';
import ConfirmationMessage from '../components/ConfirmationMessage';
import GastroniaChatbot from '../components/GastroniaChatbot';
import logo from '/logo.png';

function RestaurantVoting() {
  const { restaurantId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [puntuaciones, setPuntuaciones] = useState({});
  const [yaVotado, setYaVotado] = useState(false);
  const [asiste, setAsiste] = useState(false);
  const [confirmacion, setConfirmacion] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [fotoSeleccionadaIndex, setFotoSeleccionadaIndex] = useState(null);

  useEffect(() => {
    const desbloquearSonido = () => {
      const audio = new Audio();
      audio.play().catch(() => {});
      document.removeEventListener('click', desbloquearSonido);
    };
    document.addEventListener('click', desbloquearSonido);
  }, []);

  useEffect(() => {
    if (!user) return;

    const cargarDatos = async () => {
      const { data: restaurante } = await supabase
        .from('restaurantes')
        .select('id, nombre, asistentes, carta_url, minuta_url')
        .eq('id', restaurantId)
        .single();

      if (!restaurante) return;

      setRestaurant(restaurante);
      setAsiste(restaurante.asistentes?.includes(user.id));

      const { data: fijas } = await supabase.from('categorias_fijas').select('id, nombre_categoria');
      const { data: extras } = await supabase
        .from('categorias_extra')
        .select('id, nombre_extra')
        .eq('restaurante_id', restaurantId);

      const { count: votosPrevios } = await supabase
        .from('votaciones')
        .select('*', { count: 'exact', head: true })
        .eq('usuario_id', user.id)
        .eq('restaurante_id', restaurantId);

      if (votosPrevios > 0) setYaVotado(true);

      const todas = [
        ...(fijas || []).map((cat) => ({ ...cat, tipo: 'fija', nombre: cat.nombre_categoria })),
        ...(extras || []).map((cat) => ({ ...cat, tipo: 'extra', nombre: cat.nombre_extra })),
      ];
      setCategorias(todas);

      const { data: fotos } = await supabase.storage.from('imagenes').list(`${restaurantId}`);
      const rutas = fotos ? fotos.map((f) => `${restaurantId}/${f.name}`) : [];
      setImagenes(rutas);
    };

    cargarDatos();
  }, [restaurantId, user]);

  const handleVoteChange = async (categoriaId, valor) => {
    setPuntuaciones((prev) => ({ ...prev, [categoriaId]: valor }));
    try {
      const audio = new Audio('/ding-voto.mp3');
      audio.volume = 0.3;
      await audio.play();
    } catch (e) {
      console.log('No se pudo reproducir sonido:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (categorias.length === 0) return setConfirmacion('Error: No hay categorías definidas para votar.');
    const faltan = categorias.some((cat) => !puntuaciones[cat.id]);
    if (faltan) return setConfirmacion('Debes puntuar todas las categorías.');

    const { count: votosAntes } = await supabase
      .from('votaciones')
      .select('*', { count: 'exact', head: true })
      .eq('usuario_id', user.id)
      .eq('restaurante_id', restaurantId);

    if (votosAntes > 0) return setConfirmacion('Ya has votado previamente para este restaurante.');

    const votos = categorias.map((cat) => ({
      usuario_id: user.id,
      restaurante_id: restaurantId,
      categoria_fija_id: cat.tipo === 'fija' ? cat.id : null,
      categoria_extra_id: cat.tipo === 'extra' ? cat.id : null,
      valor: puntuaciones[cat.id],
    }));

    try {
      const aplausos = new Audio('/aplausos-final.mp3');
      aplausos.volume = 0.6;
      await aplausos.play();
    } catch (e) {
      console.log('No se pudo reproducir aplausos:', e);
    }

    const { error } = await supabase.from('votaciones').insert(votos, { returning: 'minimal' });
    if (!error) {
      setConfirmacion('¡Gracias por votar! Redirigiendo al ranking...');
      setTimeout(() => navigate('/ranking'), 2000);
    } else {
      console.error('Error al insertar votos:', error);
      setConfirmacion(`Error al votar: ${error.message || 'desconocido'}`);
    }
  };

  if (!restaurant) return <Cargando texto="Cargando datos del restaurante..." />;
  if (!asiste) return <Cargando texto="Solo los asistentes pueden votar en este restaurante." />;
  if (yaVotado) return <Cargando texto="Ya has votado. Puedes ver los resultados en el ranking." />;

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0070b8', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem 0 1rem' }}>
      <img src={logo} alt="Logo" style={{ width: '140px', marginBottom: '1.5rem' }} />

      <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '420px', borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem', padding: '2rem 1.5rem', boxShadow: '0 -4px 20px rgba(0,0,0,0.15)', flexGrow: 1, overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.4rem', fontWeight: '700' }}>Votación: {restaurant.nombre}</h2>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {restaurant.carta_url && <a href={restaurant.carta_url} target="_blank" rel="noreferrer" style={miniBoton}>Carta</a>}
          {restaurant.minuta_url && <a href={restaurant.minuta_url} target="_blank" rel="noreferrer" style={miniBoton}>Minuta</a>}
        </div>

        {imagenes.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {imagenes.map((ruta, index) => (
              <img
                key={ruta}
                src={`https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/${ruta}`}
                alt={ruta}
                style={{ width: '90px', height: '60px', objectFit: 'cover', borderRadius: '0.5rem', cursor: 'pointer' }}
                onClick={() => setFotoSeleccionadaIndex(index)}
              />
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {categorias.map((categoria) => (
            <div key={categoria.id} style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>{categoria.nombre}</h4>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map((valor) => (
                  <label key={valor} style={{ textAlign: 'center' }}>
                    <input type="radio" name={`categoria-${categoria.id}`} value={valor} checked={puntuaciones[categoria.id] === valor} onChange={() => handleVoteChange(categoria.id, valor)} style={{ display: 'none' }} />
                    <span style={{ fontSize: '2rem', color: puntuaciones[categoria.id] >= valor ? '#FFD700' : '#ccc', cursor: 'pointer', display: 'inline-block', transform: puntuaciones[categoria.id] === valor ? 'scale(1.3)' : 'scale(1)', transition: 'transform 0.2s ease' }}>★</span>
                    <div style={{ fontSize: '0.8rem' }}>{valor}</div>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button type="submit" style={{ width: '100%', height: '48px', backgroundColor: '#0070b8', color: '#fff', fontWeight: 'bold', borderRadius: '0.5rem', border: 'none', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' }}>Enviar votación</button>
        </form>

        {confirmacion && <div style={{ marginTop: '1.5rem' }}><ConfirmationMessage message={confirmacion} /></div>}
        <div style={{ marginTop: '2rem' }}><GastroniaChatbot /></div>
      </div>

      {fotoSeleccionadaIndex !== null && (
        <div style={fullscreenOverlay} onClick={() => setFotoSeleccionadaIndex(null)}>
          <button onClick={(e) => { e.stopPropagation(); setFotoSeleccionadaIndex((prev) => Math.max(0, prev - 1)); }} style={navButtonLeft}>‹</button>
          <img src={`https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/${imagenes[fotoSeleccionadaIndex]}`} alt="foto" style={imagenGrande} />
          <button onClick={(e) => { e.stopPropagation(); setFotoSeleccionadaIndex((prev) => Math.min(imagenes.length - 1, prev + 1)); }} style={navButtonRight}>›</button>
        </div>
      )}
    </div>
  );
}

function Cargando({ texto }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0070b8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', padding: '2rem', textAlign: 'center' }}>{texto}</div>
  );
}

const miniBoton = {
  backgroundColor: '#B48C59',
  color: '#fff',
  padding: '0.5rem 0.8rem',
  borderRadius: '0.5rem',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '0.9rem',
};

const fullscreenOverlay = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100,
};

const imagenGrande = {
  maxWidth: '95%', maxHeight: '90%', borderRadius: '1rem',
};

const navButtonLeft = {
  position: 'absolute', left: '1rem', fontSize: '2rem', color: '#fff', background: 'none', border: 'none', cursor: 'pointer', zIndex: 1200,
};

const navButtonRight = {
  position: 'absolute', right: '1rem', fontSize: '2rem', color: '#fff', background: 'none', border: 'none', cursor: 'pointer', zIndex: 1200,
};

export default RestaurantVoting;







