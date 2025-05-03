import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
<ImagenesCarrusel restauranteId={restaurante.id} />


function ImagenesCarrusel({ restauranteId }) {
  const [imagenes, setImagenes] = useState([]);
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    cargarImagenes();
  }, [restauranteId]);

  const cargarImagenes = async () => {
    const { data, error } = await supabase
      .storage
      .from('imagenes')
      .list(`${restauranteId}/`, { limit: 100, sortBy: { column: 'name', order: 'asc' } });

    if (data) {
      const urls = await Promise.all(
        data.map(async (file) => {
          const { data: url } = await supabase
            .storage
            .from('imagenes')
            .getPublicUrl(`${restauranteId}/${file.name}`);
          return { nombre: file.name, url: url.publicUrl };
        })
      );
      setImagenes(urls);
      setIndiceActivo(0);
    } else {
      console.error('Error cargando imágenes:', error.message);
    }
  };

  const manejarSubida = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setSubiendo(true);
    const { error } = await supabase
      .storage
      .from('imagenes')
      .upload(`${restauranteId}/${Date.now()}_${archivo.name}`, archivo);

    setSubiendo(false);
    if (error) {
      alert('Error subiendo imagen');
    } else {
      await cargarImagenes();
    }
  };

  const eliminarImagen = async (nombreArchivo) => {
    const confirmacion = confirm('¿Eliminar esta imagen?');
    if (!confirmacion) return;

    const { error } = await supabase
      .storage
      .from('imagenes')
      .remove([`${restauranteId}/${nombreArchivo}`]);

    if (error) {
      alert('Error al eliminar imagen');
    } else {
      await cargarImagenes();
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Galería de Imágenes</h3>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <input type="file" accept="image/*" onChange={manejarSubida} disabled={subiendo} />
      </div>

      {imagenes.length > 0 ? (
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={imagenes[indiceActivo].url}
              alt="imagen"
              style={{ width: '100%', maxWidth: '500px', borderRadius: '1rem' }}
            />
            <button
              onClick={() => eliminarImagen(imagenes[indiceActivo].nombre)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#c00',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {imagenes.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt="miniatura"
                onClick={() => setIndiceActivo(i)}
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  border: i === indiceActivo ? '3px solid #007bff' : '1px solid #ccc',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'border 0.2s',
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <p>No hay imágenes disponibles.</p>
      )}
    </div>
  );
}

export default ImagenesCarrusel;


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
