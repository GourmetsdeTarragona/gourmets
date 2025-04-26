import React from 'react';
import { Link } from 'react-router-dom';

const Cabecera = () => {
  return (
    <header className="cabecera">
      <div className="logo-container">
        <Link to="/">
          <img src="/logo.png" alt="Logo Gourmets Tarragona" className="logo-pequeño" />
        </Link>
      </div>
      <nav className="navegacion">
        <Link to="/">Inicio</Link>
        <Link to="/login">Login</Link>
        <Link to="/invitado">Explorar</Link>
      </nav>
    </header>
  );
};

export default Cabecera;

