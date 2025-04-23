import '../styles.css';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import '../styles.css';

const categorias = [
  'Comida',
  'Servicio',
  'Ambiente',
  'Presentación',
  'Precio',
  'Postres',
  'Originalidad',
];

const Votacion = () => {
  const { id } = useParams(); // ID del usuario o restaurante según estructura
  const [votos, setVotos] = useState({});
  const [mensaje, setMensaje] = useState('');

  const votar = async () => {
    const entradas = Object.entries(votos);
    if (entradas.length < categorias.length) {
      setMensaje('Debes votar en todas las categorías.');
      return;
    }

    try {
      for (const [categoria, puntuacion] of entradas) {
        await supabase.from('votaciones').insert({
          usuario_id: id,
          restaurante_id: id, // ajustar si el restaurante_id es diferente
          categoria,
          puntuacion,
        });
      }
      setMensaje('¡Gracias por votar!');
    } catch (error) {
      setMensaje('Error al enviar votos.');
    }
  };

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Votación</h2>

      <div className="section">
        {categorias.map((cat) => (
          <div key={cat} style={{ marginBottom: '15px' }}>
            <label>{cat}:</label>
            <select
              value={votos[cat] || ''}
              onChange={(e) => setVotos({ ...votos, [cat]: Number(e.target.value) })}
            >
              <option value="">Selecciona</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        ))}

        {mensaje && <p>{mensaje}</p>}
        <button onClick={votar}>Enviar votos</button>
      </div>
    </div>
  );
};

export default Votacion;
