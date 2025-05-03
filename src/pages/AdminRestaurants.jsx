// src/pages/AdminRestaurants.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

function AdminRestaurants() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantes = async () => {
      const { data, error } = await supabase
        .from('restaurantes')
        .select('id, nombre, fecha')
        .order('fecha', { ascending: false });

      if (error) {
        console.error('Error cargando restaurantes:', error);
      } else {
        setRestaurantes(data);
      }
      setLoading(false);
    };

    fetchRestaurantes();
  }, []);

  const handleVerDetalle = (id) => {
    navigate(`/admin/restaurante/${id}`);
  };

  return (
    <div className="container">
      <h2>Restaurantes Registrados</h2>
      {loading ? (
        <p>Cargando restaurantes...</p>
      ) : restaurantes.length === 0 ? (
        <p>No hay restaurantes registrados.</p>
      ) : (
        <ul>
          {restaurantes.map((rest) => (
            <li key={rest.id} style={{ marginBottom: '1rem' }}>
              <strong>{rest.nombre}</strong> – {rest.fecha || 'Sin fecha'}
              <br />
              <button onClick={() => handleVerDetalle(rest.id)}>Ver detalle</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminRestaurants;
