import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const RestauranteDetalle = () => {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [votaciones, setVotaciones] = useState([]);

  useEffect(() => {
    const fetchRestaurante = async () => {
      const { data, error } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) setRestaurante(data);
    };

    const fetchVotaciones = async () => {
      const { data, error } = await supabase
        .from('votaciones')
        .select('categoria, puntuacion')
        .eq('restaurante_id', id);

      if (!error) setVotaciones(data);
    };

    fetchRestaurante();
    fetchVotaciones();
  }, [id]);

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Detalle del restaurante</h2>

      {restaurante && (
        <div className="section">
          <h3>{restaurante.nombre}</h3>
          <p><strong>Fecha:</strong> {restaurante.fecha}</p>
          {restaurante.fotos?.map((foto, index) => (
            <img key={index} src={foto} alt={`Foto ${index + 1}`} style={{ width: '100%', borderRadius: '8px', margin: '10px 0' }} />
          ))}
        </div>
      )}

      {votaciones.length > 0 && (
        <div className="section">
          <h4>Puntuaciones</h4>
          <ul>
            {votaciones.map((v, i) => (
              <li key={i}><strong>{v.categoria}</strong>: {v.puntuacion}/5</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RestauranteDetalle;
