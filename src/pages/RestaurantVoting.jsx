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
  const [asiste, setAsiste] = useState(false);
  const [confirmacion, setConfirmacion] = useState('');

  useEffect(() => {
    if (!user) return;

    const cargarDatos = async () => {
      const { data: restaurante } = await supabase
        .from('restaurantes')
        .select('id, nombre, asistentes')
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
        ...extras.map((cat) => ({ ...cat, tipo: 'extra', nombre: cat.nombre_extra }))
      ];
      setCategorias(todas);
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
      setConfirmacion('Ya has votado o ha ocurrido un error al guardar los votos.');
    }
  };

  if (!restaurant) return <p className="container">Cargando datos del restaurante...</p>;
  if (!asiste) return <p className="container">Solo los asistentes pueden votar en este restaurante.</p>;
  if (yaVotado) return <p className="container">Ya has votado. Puedes ver los resultados en el ranking.</p>;

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>Votación: {restaurant.nombre}</h2>
      <form onSubmit={handleSubmit}>
        {categorias.map((categoria) => (
          <div key={categoria.id} style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>{categoria.nombre}</h4>
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

        <button type="submit" className="button-primary" style={{ width: '100%' }}>
          Enviar votación
        </button>
      </form>

      {confirmacion && <ConfirmationMessage message={confirmacion} />}
    </div>
  );
}

export default RestaurantVoting;
