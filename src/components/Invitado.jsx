import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import '../styles.css';
import { useNavigate } from 'react-router-dom';

const Invitado = () => {
  const [restaurantes, setRestaurantes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarRestaurantes = async () => {
      const { data, error } = await supabase.from('restaurantes').select('*');
      if (data) setRestaurantes(data);
    };
    cargarRestaurantes();
  }, []);

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Explorador de Restaurantes</h2>

      <div className="section">
        {restaurantes.length === 0 ? (
          <p>No hay restaurantes disponibles.</p>
        ) : (
          restaurantes.map((rest) => (
            <div key={rest.id} style={{ marginBottom: '20px' }}>
              <h3>{rest.nombre}</h3>
              <p>Fecha de visita: {rest.fecha}</p>
              <button onClick={() => navigate(`/restaurante/${rest.id}`)}>
                Ver detalles
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Invitado;
