import '../styles.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import '../styles.css';

const RestauranteDetalle = () => {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [votaciones, setVotaciones] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      const { data: rest } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('id', id)
        .single();
      setRestaurante(rest);

      const { data: votos } = await supabase
        .from('votaciones')
        .select('*')
        .eq('restaurante_id', id);
      setVotaciones(votos || []);

      if (rest && rest.fotos && rest.fotos.length > 0) {
        setFotos(rest.fotos);
      }
    };

    obtenerDatos();
  }, [id]);

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Detalles del Restaurante</h2>

      {restaurante ? (
        <div className="section">
          <h3>{restaurante.nombre}</h3>
          <p>Fecha de la cena: {restaurante.fecha}</p>

          <h4>Votaciones:</h4>
          {votaciones.length === 0 ? (
            <p>Aún no hay votos registrados.</p>
          ) : (
            <ul>
              {votaciones.map((v, i) => (
                <li key={i}>
                  {v.categoria}: {v.puntuacion}
                </li>
              ))}
            </ul>
          )}

          <h4>Fotos:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {fotos.map((url, i) => (
              <img key={i} src={url} alt={`Foto ${i}`} style={{ width: '100px', borderRadius: '8px' }} />
            ))}
          </div>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default RestauranteDetalle;
