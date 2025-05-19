import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';
import ConfirmationMessage from '../components/ConfirmationMessage';
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

      const { data: votoExistente } = await supabase
        .from('votaciones')
        .select('id')
        .eq('usuario_id', user.id)
        .eq('restaurante_id', restaurantId)
        .maybeSingle();

      if (votoExistente) setYaVotado(true);

      const todas = [
        ...fijas.map((cat) => ({ ...cat, tipo: 'fija', nombre: cat.nombre_categoria })),
        ...extras.map((cat) => ({ ...cat, tipo: 'extra', nombre: cat.nombre_extra })),
      ];
      setCategorias(todas);

      const { data: fotos } = await supabase.storage.from('imagenes').list(`${restaurantId}`);
      setImagenes(fotos || []);
    };

    cargarDatos();
  }, [restaurantId, user]);

  const handleVoteChange = (categoriaId, valor) => {
    setPuntuaciones((prev) => ({ ...prev, [categoriaId]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const faltan = categorias.some((cat) => !puntuaciones[cat.id]);
    if (faltan) {
      setConfirmacion('Debes puntuar todas las categorías.');
      return;
    }

    const votos = categorias.map((cat) => ({
      usuario_id: user.id,
      restaurante_id: restaurantId,
      categoria_fija_id: cat.tipo === 'fija' ? cat.id : null,
      categoria_extra_id: cat.tipo === 'extra' ? cat.id : null,
      valor: puntuaciones[cat.id],
    }));

    const { error } = await supabase.from('votaciones').insert(votos);

    if (!error) {
      setConfirmacion('¡Gracias por votar! Redirigiendo al ranking...');
      setTimeout(() => navigate('/ranking'), 2000);
    } else {
      setConfirmacion('Ya has votado o ha ocurrido un error.');
    }
  };

  if (!restaurant) return <Cargando texto="Cargando datos del restaurante..." />;
  if (!asiste) return <Cargando texto="Solo los asistentes pueden votar en este restaurante." />;
  if (yaVotado) return <Cargando texto="Ya has votado. Puedes ver los resultados en el ranking." />;

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
      <img src={logo} alt="Logo" style={{ width: '140px', marginBottom: '1.5rem' }} />

      <div
        style={{
          backgroundColor: '#fff',
          width: '100%',
          maxWidth: '420px',
          borderTopLeftRadius: '2rem',
          borderTopRightRadius: '2rem',
          padding: '2rem 1.5rem',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
          flexGrow: 1,
          overflowY: 'auto',
        }}
      >
        <h2 style={{ marginBottom: '1rem', fontSize: '1.4rem', fontWeight: '700' }}>
          Votación: {restaurant.nombre}
        </h2>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {restaurant.carta_url && (
            <a href={restaurant.carta_url} target="_blank" rel="noreferrer" style={miniBoton}>
              Carta
            </a>
          )}
          {restaurant.minuta_url && (
            <a href={restaurant.minuta_url} target="_blank" rel="noreferrer" style={miniBoton}>
              Minuta
            </a>
          )}
        </div>

        {imagenes.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {imagenes.slice(0, 4).map((img) => (
              <img
                key={img.name}
                src={`https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/${restaurantId}/${img.name}`}
                alt={img.name}
                style={{
                  width: '90px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '0.5rem',
                }}
              />
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {categorias.map((categoria) => (
            <div key={categoria.id} style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>
                {categoria.nombre}
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {[5, 6, 7, 8, 9, 10].map((valor) => (
                  <label key={valor} style={{ textAlign: 'center' }}>
                    <input
                      type="radio"
                      name={`categoria-${categoria.id}`}
                      value={valor}
                      checked={puntuaciones[categoria.id] === valor}
                      onChange={() => handleVoteChange(categoria.id, valor)}
                      style={{ display: 'none' }}
                    />
                    <span
                      style={{
                        fontSize: '2rem',
                        color: puntuaciones[categoria.id] >= valor ? '#FFD700' : '#ccc',
                        cursor: 'pointer',
                      }}
                    >
                      ★
                    </span>
                    <div style={{ fontSize: '0.8rem' }}>{valor}</div>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: '#0070b8',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Enviar votación
          </button>
        </form>

        {confirmacion && (
          <div style={{ marginTop: '1.5rem' }}>
            <ConfirmationMessage message={confirmacion} />
          </div>
        )}
      </div>
    </div>
  );
}

function Cargando({ texto }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0070b8',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      {texto}
    </div>
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

export default RestaurantVoting;

