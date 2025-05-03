import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [socios, setSocios] = useState([]);
  const [asistentes, setAsistentes] = useState([]);
  const [votantes, setVotantes] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    const { data: rest, error: errRest } = await supabase
      .from('restaurantes')
      .select('*')
      .eq('id', id)
      .single();

    if (errRest) return console.error('Error restaurante:', errRest);

    setRestaurante(rest);
    setAsistentes(rest.asistentes || []);

    const { data: allSocios } = await supabase
      .from('usuarios')
      .select('id, nombre')
      .eq('rol', 'socio');

    setSocios(allSocios);

    const { data: votos } = await supabase
      .from('votaciones')
      .select('usuario_id')
      .eq('restaurante_id', id);

    setVotantes(votos.map(v => v.usuario_id));
  };

  const toggleAsistente = (socioId) => {
    const yaHaVotado = votantes.includes(socioId);
    const estaSeleccionado = asistentes.includes(socioId);

    if (estaSeleccionado && yaHaVotado) {
      setMensaje('No puedes quitar asistentes que ya han votado.');
      setTimeout(() => setMensaje(''), 3000);
      return;
    }

    const nuevos = estaSeleccionado
      ? asistentes.filter(id => id !== socioId)
      : [...asistentes, socioId];

    setAsistentes(nuevos);
  };

  const guardarAsistentes = async () => {
    const { error } = await supabase
      .from('restaurantes')
      .update({ asistentes })
      .eq('id', id);

    if (!error) {
      setMensaje('Asistentes actualizados correctamente.');
      setTimeout(() => setMensaje(''), 3000);
    } else {
      console.error(error);
    }
  };

  if (!restaurante) return <p>Cargando detalles...</p>;

  return (
    <div className="container">
      <h2>Restaurante: {restaurante.nombre}</h2>
      <p><strong>Fecha:</strong> {restaurante.fecha || 'No asignada'}</p>

      <h3>Asistentes</h3>
      <div style={{ marginBottom: '1rem' }}>
        {socios.map((socio) => (
          <label key={socio.id} style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input
              type="checkbox"
              checked={asistentes.includes(socio.id)}
              onChange={() => toggleAsistente(socio.id)}
              disabled={votantes.includes(socio.id) && asistentes.includes(socio.id)}
            />
            {` ${socio.nombre}`}
            {votantes.includes(socio.id) && asistentes.includes(socio.id) && ' (ya votó)'}
          </label>
        ))}
      </div>

      <button className="button-primary" onClick={guardarAsistentes}>
        Guardar cambios
      </button>

      {mensaje && <p style={{ marginTop: '1rem', color: 'green' }}>{mensaje}</p>}
    </div>
  );
}

export default AdminRestaurantDetail;
