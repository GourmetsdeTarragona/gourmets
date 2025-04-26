import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cabecera from './components/Cabecera'; // 👈 Importamos Cabecera

const Home = () => (
  <div className="page-container">
    <img src="/logo.png" alt="Logo Gourmets Tarragona" className="logo" />
    <h1>Bienvenidos a Gourmets Tarragona</h1>
    <p>Explora como invitado o inicia sesión.</p>
    <Link to="/login">
      <button>Iniciar Sesión</button>
    </Link>
    <Link to="/invitado">
      <button>Explorar como Invitado</button>
    </Link>
  </div>
);

const Login = () => (
  <div className="page-container">
    <h2>Login</h2>
    <p>Formulario de acceso para socios.</p>
    <Link to="/">Volver al Inicio</Link>
  </div>
);

const Invitado = () => (
  <div className="page-container">
    <h2>Modo Invitado</h2>
    <p>Visualizando restaurantes como invitado.</p>
    <Link to="/">Volver al Inicio</Link>
  </div>
);

function App() {
  return (
    <Router>
      <Cabecera /> {/* 👈 Aquí mostramos siempre la cabecera */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/invitado" element={<Invitado />} />
      </Routes>
    </Router>
  );
}

export default App;
