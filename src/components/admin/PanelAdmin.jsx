import React from 'react';
import { useNavigate } from 'react-router-dom';

const PanelAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Panel de administración</h2>

      <div className="section">
        <button onClick={() => navigate('/admin/nuevo-socio')}>
          Añadir nuevo socio / administrador
        </button>
        <button onClick={() => navigate('/admin/nuevo-restaurante')}>
          Añadir nuevo restaurante
        </button>
        <button onClick={() => navigate('/admin/categorias')}>
          Añadir categorías especiales (vinos, etc.)
        </button>
      </div>
    </div>
  );
};

export default PanelAdmin;
