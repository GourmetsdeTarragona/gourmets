import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurante();
  }, []);

  const fetchRestaurante = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('restaurantes').select('*').eq('id', id).single();
    if (!error) {
      setRestaurante(data);
    }
    setLoading(false);
  };

  if (loading) return <p>Cargando detalles del restaurante...</p>;
  if (!restaurante) return <p>No se encontró el restaurante.</p>;

  return (
    <div className="container">
      <h2>{restaurante.nombre}</h2>
      <p><strong>Descripción:</strong> {restaurante.descripcion || '—'}</p>
      <p><strong>Fecha:</strong> {restaurante.fecha || 'Sin definir'}</p>
    </div>
  );
}

export default AdminRestaurantDetail;
