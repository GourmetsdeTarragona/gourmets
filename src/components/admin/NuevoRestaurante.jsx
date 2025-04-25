import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const NuevoRestaurante = () => {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [fotos, setFotos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [asistentes, setAsistentes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const cargarUsuarios = async () => {
      const { data, error } = await supabase.from('usuarios').select('*');
      if (!error) setUsuarios(data);
    };
    cargarUsuarios();
  }, []);

  const subirFotos = async (files) => {
    const urls = [];
    for (let file of files) {
      const nombreArchivo = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('fotos')
        .upload(nombreArchivo, file);

      if (!error) {
        const { data: publicUrl } = supabase
          .storage
          .from('fotos')
          .getPublicUrl(nombreArchivo);
        urls.push(publicUrl.publicUrl);
      }
    }
    setFotos(urls);
  };

  const guardarRestaurante = async () => {
    if (!nombre || !fecha) {
      setMensaje('Nombre y fecha son obligatorios.');
      return;
    }

    const { data, error } = await supabase
      .from('restaurantes')
      .insert([{ nombre, fecha, fotos }])
      .select()
      .single();

    if (error || !data) {
      setMensaje('Error al guardar restaurante.');
      return;
    }

    const registrosAsistentes = asistentes.map((id) => ({
      restaurante_id: data.id,
      usuario_id: id
    }));

    if (registrosAsistentes.length > 0) {
      await supabase.from('asistentes').insert(registrosAsistentes);
    }

    setMensaje('Restaurante registrado con éxito.');
    setNombre('');
    setFecha('');
    setFotos([]);
    setAsistentes([]);
  };

  const toggleAsistente = (id) => {
    if (asistentes.includes(id)) {
      setAsistentes(asistentes.filter((uid) => uid !== id));
    } else {
      setAsistentes([...asistentes, id]);
    }
  };

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Nuevo restaurante</h2>

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
        <label>Fotos (opcional):</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => subirFotos(e.target.files)}
        />

        <h4>Seleccionar asistentes:</h4>
        {usuarios.map((u) => (
          <div key={u.id}>
            <label>
              <input
                type="checkbox"
                checked={asistentes.includes(u.id)}
                onChange={() => toggleAsistente(u.id)}
              />
              {u.usuario}
            </label>
          </div>
        ))}

        <button onClick={guardarRestaurante}>Guardar restaurante</button>
        {mensaje && <p>{mensaje}</p>}
        <button onClick={() => navigate('/admin')}>Volver</button>
      </div>
    </div>
  );
};

export default NuevoRestaurante;
