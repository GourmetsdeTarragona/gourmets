// src/pages/AdminRestaurants.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function AdminRestaurants() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantes = async () => {
      const { data, error } = await supabase.from('restaurantes').select('*').order('fecha', { ascending: false });
      if (error) {
        console.error('Error al cargar restaurantes:', error.message);
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
      <h2>Gestionar Restaurantes</h2>

      {loading ? (
        <p>Cargando restaurantes...</p>
      ) : restaurantes.length === 0 ? (
        <p>No hay restaurantes registrados.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {restaurantes.map((rest) => (
            <li key={rest.id} style={{ marginBottom: '1rem', background: '#fff', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <h3>{rest.nombre}</h3>
              <p>Fecha: {rest.fecha || 'Sin fecha asignada'}</p>
              <button className="button-primary" onClick={() => handleVerDetalle(rest.id)}>
                Ver detalle
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminRestaurants;
