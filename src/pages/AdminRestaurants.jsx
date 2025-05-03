import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function AdminRestaurants() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurantes')
          .select('id, nombre, fecha');

        if (error) throw error;
        setRestaurantes(data || []);
      } catch (err) {
        console.error('Error al cargar restaurantes:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantes();
  }, []);

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1.5rem' }}>Restaurantes registrados</h1>

      {loading ? (
        <p>Cargando restaurantes...</p>
      ) : restaurantes.length === 0 ? (
        <p>No hay restaurantes registrados.</p>
      ) : (
        <div className="restaurant-list">
          {restaurantes.map((r) => (
            <div key={r.id} className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{r.nombre}</h3>
              <p style={{ fontStyle: 'italic' }}>
                Fecha: {r.fecha ? new Date(r.fecha).toLocaleDateString() : 'Sin asignar'}
              </p>
              <button
                className="button-primary"
                onClick={() => navigate(`/admin/restaurante/${r.id}`)}
              >
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminRestaurants;
