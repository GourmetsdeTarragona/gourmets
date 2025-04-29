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
      // 1. Obtener restaurante
      const { data: rData, error: rError } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('id', id)
        .single();

      if (!rError && rData) {
        setRestaurante(rData);

        // 2. Obtener asistentes (usuarios)
        if (rData.asistentes && rData.asistentes.length > 0) {
          const { data: socios } = await supabase
            .from('usuarios')
            .select('id, nombre, email')
            .in('id', rData.asistentes);
          setAsistentes(socios || []);
        }

        // 3. Obtener categoría extra
        const { data: extras } = await supabase
          .from('categorias_extra')
          .select('*')
          .eq('restaurante_id', id)
          .maybeSingle();

        if (extras) {
          setCategoriaExtra(extras.nombre_extra);
        }
      }
    };

    fetchData();
  }, [id]);

  if (!restaurante) return <p style={{ textAlign: 'center', marginTop: '5rem' }}>Cargando...</p>;

  return (
    <div className="container" style={{ maxWidth: '700px', margin: '3rem auto' }}>
      <h2>Detalles del restaurante</h2>

      <div style={{ marginBottom
