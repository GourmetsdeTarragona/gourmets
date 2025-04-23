import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import '../../styles.css';

const NuevoRestaurante = () => {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [socios, setSocios] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarSocios = async () => {
      const { data } = await supabase.from('usuarios').select('*');
      if (data) setSocios(data);
    };
    cargarSocios();
  }, []);

  const manejarSubida = async () => {
    if (!nombre || !fecha) {
      setMensaje('Completa nombre y fecha.');
      return;
    }

    const urls = [];
    for (const foto of fotos) {
      const { data, error } = await supabase.storage
        .from('fotos')
        .upload(`restaurantes/${Date.now()}-${foto.name}`, foto);
      if (data) {
        const url = supabase.storage.from('fotos').getPublicUrl(data.path).data.publicUrl;
        urls.push(url);
      }
    }

    const { data: restaurante, error } = await supabase.from('restaurantes').insert({
      nombre,
      fecha,
      fotos: urls
    }).select().single();

    for (const socioId of seleccionados) {
      await supabase.from('asistentes').insert({
        restaurante_id: restaurante.id,
        usuario_id: socioId
      });
    }

    setMensaje('Restaurante añadido.');
    setNombre('');
    setFecha('');
    setSeleccionados([]);
    setFotos([]);
  };

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Nuevo Restaurante</h2>

      <div className="section">
        <input
          type="text"
          placeholder="Nombre del restaurante"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <h4>Socios asistentes:</h4>
        {socios.map((socio) => (
          <label key={socio.id}>
            <input
              type="checkbox"
              checked={seleccionados.includes(socio.id)}
              onChange={(e) => {
                const updated = e.target.checked
                  ? [...seleccionados, socio.id]
                  : seleccionados.filter((id) => id !== socio.id);
                setSeleccionados(updated);
              }}
            />
            {socio.usuario}
          </label>
        ))}

        <h4>Subir fotos:</h4>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFotos([...e.target.files])}
        />

        <button onClick={manejarSubida}>Guardar restaurante</button>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
};

export default NuevoRestaurante;
