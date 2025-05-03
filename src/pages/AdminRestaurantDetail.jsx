import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurante();
  }, [id]);

  const fetchRestaurante = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('restaurantes').select('*').eq('id', id).single();
    if (error) {
      console.error('Error al obtener restaurante:', error.message);
    } else {
      setRestaurante(data);
    }
    setLoading(false);
  };

  if (loading) return <p>Cargando detalles...</p>;
  if (!restaurante) return <p>No se encontró el restaurante.</p>;

  return (
    <div className="container">
      <h1>{restaurante.nombre}</h1>
      <p><strong>Fecha:</strong> {restaurante.fecha ? new Date(restaurante.fecha).toLocaleDateString() : 'Sin asignar'}</p>
      <p><strong>Descripción:</strong> {restaurante.descripcion || '—'}</p>
    </div>
  );
}

export default AdminRestaurantDetail;
