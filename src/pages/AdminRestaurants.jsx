import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function AdminRestaurants() {
  const [restaurantes, setRestaurantes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurantes();
  }, []);

  const fetchRestaurantes = async () => {
    const { data, error } = await supabase.from('restaurantes').select('*');
    if (error) {
      console.error('Error al obtener restaurantes:', error.message);
    } else {
      setRestaurantes(data);
    }
  };

  return (
    <div className="container">
      <h1>Restaurantes Registrados</h1>
      {restaurantes.length === 0 ? (
        <p>No hay restaurantes registrados aún.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {restaurantes.map((rest) => (
            <li
              key={rest.id}
              className="card"
              style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>{rest.nombre}</h3>
                <p style={{ margin: 0 }}>
                  {rest.fecha ? `Cena prevista: ${new Date(rest.fecha).toLocaleDateString()}` : 'Fecha no asignada'}
                </p>
              </div>
              <button
                className="button-primary"
                onClick={() => navigate(`/admin/restaurante/${rest.id}`)}
              >
                Ver detalles
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminRestaurants;
