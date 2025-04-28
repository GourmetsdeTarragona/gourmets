import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase/supabase';
import VoteForm from '../components/VoteForm';
import ConfirmationMessage from '../components/ConfirmationMessage';

function RestaurantVoting() {
  const { restaurantId } = useParams();
  const [categorias, setCategorias] = useState([]);
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    const { data: fijas, error: errorFijas } = await supabase.from('categorias_fijas').select('*');
    const { data: extras, error: errorExtras } = await supabase
      .from('categorias_extra')
      .select('*')
      .eq('restaurante_id', restaurantId);

    if (!errorFijas && !errorExtras) {
      setCategorias([...fijas, ...extras]);
    } else {
      console.error('Error al cargar categorías.');
    }
  };

  const handleVoteSubmit = async (votos) => {
    const votosArray = Object.entries(votos).map(([categoriaId, puntuacion]) => ({
      usuario_id: 'USER_ID_PLACEHOLDER', // Aquí luego pondremos el ID real del usuario
      restaurante_id: restaurantId,
      categoria_id: categoriaId,
      puntuacion,
    }));

    const { error } = await supabase.from('votos').insert(votosArray);

    if (!error) {
      setConfirmation('Votación registrada con éxito.');
    } else {
      console.error('Error al registrar votos:', error.message);
    }
  };

  return (
    <div className="container">
      <h1>Votar Restaurante</h1>
      <VoteForm categorias={categorias} onSubmit={handleVoteSubmit} />
      <ConfirmationMessage message={confirmation} />
    </div>
  );
}

export default RestaurantVoting;
