import '../styles.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo Gourmets Tarragona" className="logo" />
      <h1 className="page-title">Bienvenidos a Gourmets Tarragona</h1>

      <div className="section">
        <button onClick={() => navigate('/login')}>Iniciar sesión</button>
        <button onClick={() => navigate('/invitado')}>Explorar como invitado</button>
      </div>
    </div>
  );
};

export default Home;
