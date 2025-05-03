import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

function AdminRestaurants() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurantes();
  }, []);

  const fetchRestaurantes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('restaurantes').select('*');
    if (!error) {
      setRestaurantes(data);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Gestionar Restaurantes</h2>
      <button onClick={() => navigate('/admin/create-restaurant')} className="button-primary" style={{ marginBottom: '1rem' }}>
        + Crear nuevo restaurante
      </button>
      {loading ? (
        <p>Cargando restaurantes...</p>
      ) : restaurantes.length > 0 ? (
        <ul>
          {restaurantes.map((rest) => (
            <li key={rest.id} style={{ marginBottom: '1rem' }}>
              <strong>{rest.nombre}</strong>{' '}
              <button onClick={() => navigate(`/admin/restaurante/${rest.id}`)}>
                Ver detalles
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay restaurantes registrados.</p>
      )}
    </div>
  );
}

export default AdminRestaurants;
