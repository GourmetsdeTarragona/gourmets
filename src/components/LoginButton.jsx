import { useNavigate } from 'react-router-dom';

function LoginButton() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Aquí después pondremos la lógica real de login
    navigate('/restaurants'); // Simulamos que al iniciar sesión va a restaurantes
  };

  return (
    <button className="button-primary" onClick={handleLogin}>
      Iniciar sesión
    </button>
  );
}

export default LoginButton;
