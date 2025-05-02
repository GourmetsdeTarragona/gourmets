import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';
import ConfirmationMessage from '../components/ConfirmationMessage';

function RestaurantVoting() {
  const { restaurantId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [puntuaciones, setPuntuaciones] = useState({});
  const [yaVotado, setYaVotado] = useState(false);
  const [confirmacion, setConfirmacion] = useState('');

  useEffect(() => {
    if (!user) return;

    const cargarDatos = async () => {
      const { data: restaurante, error: err1 } = await supabase
        .from('restaurantes')
        .select('id, nombre')
        .eq('id', restaurantId)
        .single();

      const { data: cats, error: err2 } = await supabase
        .from('categorias')
        .select('*')
        .eq('restaurante_id', restaurantId);

      const { data: votoExistente } = await supabase
        .from('votaciones')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('restaurante_id', restaurantId)
        .maybeSingle();

      if (votoExistente) {
        setYaVotado(true);
      }

      if (restaurante) setRestaurant(restaurante);
      if (cats) setCategorias(cats);
    };

    cargarDatos();
  }, [restaurantId, user]);

  const handleVoteChange = (categoriaId, valor) => {
    setPuntuaciones((prev) => ({ ...prev, [categoriaId]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const votos = categorias.map((cat) => ({
      usuario_id: user.id,
      restaurante_id: restaurantId,
      categoria_id: cat.id,
      valor: puntuaciones[cat.id] || 0,
    }));

    const { error } = await supabase.from('votaciones').insert(votos);

    if (!error) {
      setConfirmacion('¡Gracias por votar! Redirigiendo al ranking...');
      setTimeout(() => navigate('/ranking'), 2000);
    } else {
      setConfirmacion('Ocurrió un error al guardar los votos.');
    }
  };

  if (!restaurant) return <p style={{ padding: '2rem' }}>Cargando detalles del restaurante...</p>;

  if (yaVotado) {
    return <p style={{ padding: '2rem' }}>Ya has votado en este restaurante. Puedes ver los resultados en el ranking.</p>;
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '1rem' }}>Votación: {restaurant.nombre}</h2>

      <form onSubmit={handleSubmit}>
        {categorias.map((categoria) => (
          <div key={categoria.id} style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>{categoria.nombre}</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleVoteChange(categoria.id, num)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: puntuaciones[categoria.id] === num ? '#000' : '#eee',
                    color: puntuaciones[categoria.id] === num ? '#fff' : '#000',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button type="submit" className="button-primary" style={{ width: '100%' }}>
          Enviar votación
        </button>
      </form>

      {confirmacion && <ConfirmationMessage message={confirmacion} />}
    </div>
  );
}

export default RestaurantVoting;
