import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';

function AdminRestaurants() {
  const [restaurantes, setRestaurantes] = useState([]);

  useEffect(() => {
    const fetchRestaurantes = async () => {
      const { data, error } = await supabase
        .from('restaurantes')
        .select('*')
        .order('fecha', { ascending: false });

      if (!error) setRestaurantes(data);
    };

    fetchRestaurantes();
  }, []);

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '3rem auto' }}>
      <h2>Cenas creadas</h2>

      {restaurantes.length === 0 ? (
        <p>No hay restaurantes registrados aún.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {restaurantes.map((r) => (
            <li
              key={r.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <h3>{r.nombre}</h3>
              <p><strong>Fecha:</strong> {r.fecha}</p>
              <p><strong>Asistentes:</strong> {r.asistentes.length}</p>
              <button className="button-primary" disabled>
                Ver detalles (próximamente)
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminRestaurants;
