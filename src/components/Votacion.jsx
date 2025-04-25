import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const categoriasFijas = [
  'Comida',
  'Servicio',
  'Ambiente',
  'Presentación',
  'Precio',
  'Postres',
  'Originalidad'
];

const Votacion = () => {
  const { id } = useParams(); // ID del restaurante
  const [votos, setVotos] = useState({});
  const [yaVotado, setYaVotado] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener usuarioId desde localStorage
    const uid = localStorage.getItem('usuario_id');
    if (!uid) {
      setMensaje('Error de sesión. Por favor vuelve a iniciar sesión.');
      return;
    }
    setUsuarioId(parseInt(uid));

    // Verificar si ya ha votado
    const verificar = async () => {
      const { data } = await supabase
        .from('votaciones')
        .select('id')
        .eq('usuario_id', uid)
        .eq('restaurante_id', id);

      if (data && data.length > 0) setYaVotado(true);
    };

    verificar();
  }, [id]);

  const guardarVoto = async () => {
    const entradas = Object.entries(votos);

    if (entradas.length < categoriasFijas.length) {
      setMensaje('Debes votar todas las categorías.');
      return;
    }

    const registros = entradas.map(([categoria, puntuacion]) => ({
      usuario_id: usuarioId,
      restaurante_id: parseInt(id),
      categoria,
      puntuacion: parseInt(puntuacion)
    }));

    const { error } = await supabase.from('votaciones').insert(registros);

    if (!error) {
      setMensaje('¡Votación registrada con éxito!');
      setYaVotado(true);
    } else {
      setMensaje('Error al guardar votación.');
    }
  };

  if (yaVotado) {
    return (
      <div className="page-container">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h2 className="page-title">Votación</h2>
        <div className="section">
          <p>Ya has votado en este restaurante.</p>
          <button onClick={() => navigate('/')}>Volver a inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Votar restaurante</h2>

      <div className="section">
        {categoriasFijas.map((cat) => (
          <div key={cat} style={{ marginBottom: '10px' }}>
            <label><strong>{cat}</strong></label>
            <select
              value={votos[cat] || ''}
              onChange={(e) => setVotos({ ...votos, [cat]: e.target.value })}
            >
              <option value="">Elige una puntuación</option>
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        ))}
        <button onClick={guardarVoto}>Guardar votación</button>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
};

export default Votacion;
