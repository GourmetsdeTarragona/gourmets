import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [asistentes, setAsistentes] = useState([]);
  const [categoriaExtra, setCategoriaExtra] = useState(null);

 useEffect(() => {
  const fetchData = async () => {
    console.log('ID recibido:', id); // DEBUG

    const { data: rData, error: rError } = await supabase
      .from('restaurantes')
      .select('*')
      .eq('id', id)
      .single();

    console.log('Restaurante recibido:', rData); // DEBUG
    if (rError) console.error('Error restaurante:', rError);

    if (!rError && rData) {
      setRestaurante(rData);

      if (rData.asistentes?.length) {
        const { data: socios } = await supabase
          .from('usuarios')
          .select('id, nombre, email')
          .in('id', rData.asistentes);
        setAsistentes(socios || []);
      }

      const { data: extras } = await supabase
        .from('categorias_extra')
        .select('nombre_extra')
        .eq('restaurante_id', id)
        .maybeSingle();

      if (extras) {
        setCategoriaExtra(extras.nombre_extra);
      }
    }
  };

  fetchData();
}, [id]);

  if (!restaurante) {
    return <p style={{ textAlign: 'center', marginTop: '5rem' }}>Cargando detalles...</p>;
  }

  return (
    <div className="container" style={{ maxWidth: '700px', margin: '3rem auto' }}>
      <h2>Detalles del restaurante</h2>

      <div style={{ marginBottom: '2rem' }}>
        <p><strong>Nombre:</strong> {restaurante.nombre}</p>
        <p><strong>Fecha:</strong> {restaurante.fecha}</p>
        <p><strong>Categoría extra:</strong> {categoriaExtra || '—'}</p>
      </div>

      <h3>Asistentes</h3>
      {asistentes.length === 0 ? (
        <p>No hay asistentes registrados.</p>
      ) : (
        <ul style={{ paddingLeft: '1rem' }}>
          {asistentes.map((socio) => (
            <li key={socio.id}>
              {socio.nombre} ({socio.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminRestaurantDetail;
