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
    const { data, error } = await supabase
      .from('restaurantes')
      .select('*')
      .order('fecha', { ascending: false });

    if (!error) setRestaurantes(data);
    setLoading(false);
  };

  const handleVerDetalle = (id) => {
    navigate(`/admin/restaurante/${id}`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(/logo.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundColor: '#d0e4fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '2rem',
          borderRadius: '1rem',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Gestionar Restaurantes</h2>

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
                  background: '#f9f9f9',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  marginBottom: '1rem',
                }}
              >
                <strong>{r.nombre}</strong> —{' '}
                {r.fecha ? new Date(r.fecha).toLocaleDateString() : 'Sin fecha'}
                <br />
                <button
                  onClick={() => handleVerDetalle(r.id)}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  Ver detalle
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminRestaurants;
