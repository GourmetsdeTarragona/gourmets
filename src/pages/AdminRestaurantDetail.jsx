import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);

  useEffect(() => {
    fetchRestaurante();
  }, []);

  const fetchRestaurante = async () => {
    const { data, error } = await supabase
      .from('restaurantes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error obteniendo restaurante:', error.message);
    } else {
      setRestaurante(data);
    }
  };

  if (!restaurante) {
    return <p>Cargando detalles del restaurante...</p>;
  }

  return (
    <div className="container">
      <h2>{restaurante.nombre}</h2>
      <p>{restaurante.fecha ? `Cena el ${restaurante.fecha}` : 'Fecha no asignada'}</p>
      <p>Categorías extra: {restaurante.categorias_extra || 'Ninguna'}</p>
    </div>
  );
}

export default AdminRestaurantDetail;
