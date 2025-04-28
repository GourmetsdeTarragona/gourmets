import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Panel de Administración</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <button className="button-primary" onClick={() => navigate('/admin/add-user')}>
          Registrar nuevo socio o admin
        </button>
        <button className="button-primary" onClick={() => navigate('/admin/add-restaurant')}>
          Añadir nuevo restaurante
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;
