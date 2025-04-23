import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles.css';

const PanelAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Panel del Administrador</h2>

      <div className="section">
        <button onClick={() => navigate('/admin/nuevo-socio')}>Registrar nuevo socio/administrador</button>
        <button onClick={() => navigate('/admin/nuevo-restaurante')}>Añadir nuevo restaurante</button>
        <button onClick={() => navigate('/admin/categorias')}>Añadir categorías únicas (como vinos)</button>
      </div>
    </div>
  );
};

export default PanelAdmin;
