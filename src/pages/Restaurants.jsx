import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';
import RestaurantCard from '../components/RestaurantCard';

function Restaurants() {
  const [restaurantes, setRestaurantes] = useState([]);

  useEffect(() => {
    fetchRestaurantes();
  }, []);

  const fetchRestaurantes = async () => {
    const { data, error } = await supabase.from('restaurantes').select('*');
    if (!error) {
      setRestaurantes(data);
    } else {
      console.error('Error al cargar restaurantes:', error.message);
    }
  };

  return (
    <div className="container">
      <h1>Restaurantes</h1>
      {restaurantes.length > 0 ? (
        restaurantes.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))
      ) : (
        <p>No hay restaurantes disponibles.</p>
      )}
    </div>
  );
}

export default Restaurants;
