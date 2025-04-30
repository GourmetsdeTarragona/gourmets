import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabase';

function AdminRestaurants() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurantes();
  }, []);

  const fetchRestaurantes = async () => {
    const { data, error } = await supabase
      .from('restaurantes')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) {
      setError('Error al obtener restaurantes.');
      console.error(error);
      return;
    }

    const restaurantesConFotos = await Promise.all(
      data.map(async (r) => {
        let fotoPortada = null;

        const { data: fotos, error: errorFotos } = await supabase.storage
          .from('imagenes')
          .list(`${r.id}/`, { limit: 1 });

        if (!errorFotos && fotos.length > 0) {
          const { publicUrl } = supabase.storage
            .from('imagenes')
            .getPublicUrl(`${r.id}/${fotos[0].name}`).data;
          fotoPortada = publicUrl;
        }

        return { ...r, fotoPortada };
      })
    );

    setRestaurantes(restaurantesConFotos);
  };

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '3rem auto' }}>
      <h2>Cenas creadas</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

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
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              {r.fotoPortada ? (
                <img
                  src={r.fotoPortada}
                  alt="Portada"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
              ) : (
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#eee',
                    borderRadius: '8px'
                  }}
                />
              )}
              <div style={{ flexGrow: 1 }}>
                <h3>{r.nombre}</h3>
                <p><strong>Fecha:</strong> {r.fecha}</p>
                <button
                  className="button-primary"
                  onClick={() => navigate(`/admin/restaurante/${r.id}`)}
                >
                  Ver detalles
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminRestaurants;
