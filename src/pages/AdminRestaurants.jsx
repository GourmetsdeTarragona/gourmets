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
    const { data, error } = await supabase.from('restaurantes').select('*').order('fecha', { ascending: false });
    if (error) {
      console.error('Error al cargar restaurantes:', error.message);
    } else {
      setRestaurantes(data);
    }
    setLoading(false);
  };

  const handleVerDetalle = (id) => {
    navigate(`/admin/restaurante/${id}`);
  };

  return (
    <div className="container">
      <h1>Gestionar Restaurantes</h1>
      {loading ? (
        <p>Cargando restaurantes...</p>
      ) : restaurantes.length === 0 ? (
        <p>No hay restaurantes registrados.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {restaurantes.map((r) => (
            <li
              key={r.id}
              style={{
                background: '#fff',
                padding: '1rem',
                borderRadius: '1rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                marginBottom: '1rem',
              }}
            >
              <strong>{r.nombre}</strong> – {r.fecha ? new Date(r.fecha).toLocaleDateString() : 'Sin fecha'}
              <br />
              <button
                className="button-primary"
                style={{ marginTop: '0.5rem' }}
                onClick={() => handleVerDetalle(r.id)}
              >
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
