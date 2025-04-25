import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Invitado = () => {
  const [restaurantes, setRestaurantes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarRestaurantes = async () => {
      const { data, error } = await supabase
        .from('restaurantes')
        .select('*')
        .order('fecha', { ascending: false });

      if (!error) setRestaurantes(data);
    };

    cargarRestaurantes();
  }, []);

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Restaurantes visitados</h2>

      {restaurantes.length === 0 ? (
        <p>No hay restaurantes disponibles aún.</p>
      ) : (
        restaurantes.map((r) => (
          <div key={r.id} className="section" onClick={() => navigate(`/restaurante/${r.id}`)} style={{ cursor: 'pointer' }}>
            <h3>{r.nombre}</h3>
            <p><strong>Fecha:</strong> {r.fecha}</p>
            {r.fotos?.length > 0 && (
              <img src={r.fotos[0]} alt="Plato" style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Invitado;
