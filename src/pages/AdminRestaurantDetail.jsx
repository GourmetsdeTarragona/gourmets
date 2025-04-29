import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [estado, setEstado] = useState('inicial');
  const [restaurante, setRestaurante] = useState(null);

  useEffect(() => {
    console.log("CARGANDO DETALLE: id =", id);
    setEstado('consultando');

    const fetchData = async () => {
      const { data, error } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("❌ Error Supabase:", error);
        setEstado('error');
      } else {
        console.log("✅ Restaurante encontrado:", data);
        setRestaurante(data);
        setEstado('ok');
      }
    };

    fetchData();
  }, [id]);

  if (estado === 'inicial') return <p>Preparando...</p>;
  if (estado === 'consultando') return <p>Consultando Supabase...</p>;
  if (estado === 'error') return <p style={{ color: 'red' }}>Error cargando datos.</p>;
  if (estado === 'ok' && !restaurante) return <p>No se encontró el restaurante.</p>;

  return (
    <div style={{ margin: '4rem auto', maxWidth: '600px' }}>
      <h2>Detalle del restaurante</h2>
      <p><strong>Nombre:</strong> {restaurante.nombre}</p>
      <p><strong>Fecha:</strong> {restaurante.fecha}</p>
    </div>
  );
}

export default AdminRestaurantDetail;
