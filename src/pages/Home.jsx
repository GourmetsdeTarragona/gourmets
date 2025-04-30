import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1>🍷 Bienvenido a Gourmets Tarragona</h1>
      <p>Selecciona cómo quieres continuar:</p>
      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => navigate('/login')} style={{ marginRight: '1rem' }}>
          Iniciar sesión
        </button>
        <button onClick={() => navigate('/ranking')}>
          Explorar como invitado
        </button>
      </div>
    </div>
  );
}

export default Home;
