import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1>Panel de Administración</h1>

      <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <button className="button-primary" onClick={() => navigate('/admin/register-user')}>
          Registrar nuevo usuario
        </button>
        <button className="button-primary" onClick={() => navigate('/admin/create-restaurant')}>
          Crear restaurante
        </button>
        <button className="button-primary" disabled style={{ opacity: 0.5 }}>
          Gestionar cenas (próximamente)
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
