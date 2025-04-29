import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [asistentes, setAsistentes] = useState([]);
  const [categoriaExtra, setCategoriaExtra] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      console.log("ID recibido:", id);

      const { data: rData, error: rError } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('id', id)
        .single();

      if (rError) {
        console.error('Error restaurante:', rError);
        setError('No se pudo cargar el restaurante.');
        return;
      }

      if (!rData) {
        setError('Restaurante no encontrado.');
        return;
      }

      setRestaurante(rData);
      console.log('Restaurante:', rData);

      if (rData.asistentes?.length) {
        const { data: socios, error: sociosError } = await supabase
          .from('usuarios')
          .select('id, nombre, email')
          .in('id', rData.asistentes);

        if (!sociosError) {
          setAsistentes(socios);
        } else {
          console.error('Error asistentes:', sociosError);
        }
      }

      const { data: extras } = await supabase
        .from('categorias_extra')
        .select('nombre_extra')
        .eq('restaurante_id', id)
        .maybeSingle();

      if (extras) {
        setCategoriaExtra(extras.nombre_extra);
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return <p style={{ textAlign: 'center', marginTop: '5rem', color: 'red' }}>{error}</p>;
  }

  if (!restaurante) {
    return <p style={{ textAlign: 'center', marginTop: '5rem' }}>Cargando detalles del restaurante...</p>;
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
