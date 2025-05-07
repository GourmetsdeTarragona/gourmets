import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#d0e4fa',
        backgroundImage: 'url(/logo.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        textAlign: 'center',
      }}>
        <h2 style={{
          marginBottom: '2rem',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#003366',
        }}>
          Panel del Administrador
        </h2>

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
  backgroundColor: '#003366',
  color: '#fff',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

export default AdminDashboard;
