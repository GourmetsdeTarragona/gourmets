import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabase';
import { useUser } from '../context/UserContext';

function RestaurantVoting() {
  const { restaurantId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [restaurante, setRestaurante] = useState(null);
  const [categorias, setCategorias] = useState({
    categoria_1: 7,
    categoria_2: 7,
    categoria_3: 7,
    categoria_4: 7,
    categoria_5: 7,
    categoria_6: 7,
    categoria_7: 7,
    categoria_extra: 7
  });
  const [votoExistente, setVotoExistente] = useState(false);
  const [error, setError] = useState('');
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchRestaurante = async () => {
      const { data, error } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('id', restaurantId)
        .single();

      if (error || !data) {
        setError('Error cargando restaurante');
        return;
      }

      setRestaurante(data);

      // ¿Este usuario ya ha votado?
      const { data: voto } = await supabase
        .from('votos')
        .select('id')
        .eq('socio_id', user.id)
        .eq('restaurante_id', restaurantId)
        .maybeSingle();

      if (voto) {
        setVotoExistente(true);
      }
    };

    fetchRestaurante();
  }, [restaurantId, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategorias((prev) => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const voto = {
      socio_id: user.id,
      restaurante_id: restaurantId,
      ...categorias
    };

    const { error } = await supabase.from('votos').insert(voto);

    if (error) {
      setError('Error al guardar tu voto.');
      console.error(error);
    } else {
      setGuardado(true);
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!restaurante) return <p>Cargando...</p>;
  if (votoExistente) return <p>Ya has votado para esta cena. ¡Gracias!</p>;
  if (guardado) return <p>✅ Tu voto se ha guardado correctamente. ¡Gracias!</p>;

  const categoriasLabels = [
    'Entrantes',
    'Plato principal',
    'Postres',
    'Servicio',
    'Ambiente',
    'Presentación',
    'Relación calidad-precio',
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>Votar restaurante: {restaurante.nombre}</h2>
      <p><strong>Fecha:</strong> {restaurante.fecha}</p>

      <form onSubmit={handleSubmit}>
        {categoriasLabels.map((label, i) => {
          const key = `categoria_${i + 1}`;
          return (
            <div key={key} style={{ marginBottom: '1.5rem' }}>
              <label>{label}: {categorias[key]}</label>
              <input
                type="range"
                min="5"
                max="10"
                name={key}
                value={categorias[key]}
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </div>
          );
        })}

        {restaurante.categoria_extra && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label>{restaurante.categoria_extra}: {categorias.categoria_extra}</label>
            <input
              type="range"
              min="5"
              max="10"
              name="categoria_extra"
              value={categorias.categoria_extra}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          </div>
        )}

        <button type="submit" className="button-primary">Enviar voto</button>
      </form>
    </div>
  );
}

export default RestaurantVoting;
