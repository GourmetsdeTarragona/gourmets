import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/imagenes/foto-defecto.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1,
      }} />

      <div style={{
        zIndex: 2,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '2rem',
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        textAlign: 'center',
      }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Panel del Administrador</h2>

        <button onClick={() => navigate('/admin/register-user')} style={buttonStyle}>
          Registrar nuevo socio o administrador
        </button>

        <button onClick={() => navigate('/admin/create-restaurant')} style={buttonStyle}>
          Crear nuevo restaurante
        </button>

        <button onClick={() => navigate('/admin/restaurantes')} style={buttonStyle}>
          Gestionar restaurantes
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  marginBottom: '1rem',
  border: 'none',
  borderRadius: '0.5rem',
  backgroundColor: '#000',
  color: '#fff',
  fontSize: '1rem',
  cursor: 'pointer',
};

export default AdminDashboard;
