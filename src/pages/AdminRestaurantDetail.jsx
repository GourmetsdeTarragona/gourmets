import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [asistentes, setAsistentes] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchRestaurante();
    fetchUsuarios();
    fetchImagenes();
  }, []);

  const fetchRestaurante = async () => {
    const { data, error } = await supabase.from('restaurantes').select('*').eq('id', id).single();
    if (error) return console.error('Error cargando restaurante:', error.message);
    setRestaurante(data);
    setAsistentes(data.asistentes || []);
  };

  const fetchUsuarios = async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, rol')
      .neq('rol', 'admin');
    if (error) return console.error('Error cargando usuarios:', error.message);
    setUsuarios(data);
  };

  const toggleAsistente = async (usuarioId) => {
    const { data: yaHaVotado } = await supabase
      .from('votaciones')
      .select('id')
      .eq('usuario_id', usuarioId)
      .eq('restaurante_id', id)
      .maybeSingle();

    if (yaHaVotado) {
      alert('Este usuario ya ha votado y no se puede eliminar.');
      return;
    }

    const nuevosAsistentes = asistentes.includes(usuarioId)
      ? asistentes.filter((uid) => uid !== usuarioId)
      : [...asistentes, usuarioId];

    const { error } = await supabase
      .from('restaurantes')
      .update({ asistentes: nuevosAsistentes })
      .eq('id', id);

    if (error) return console.error('Error actualizando asistentes:', error.message);
    setAsistentes(nuevosAsistentes);
  };

  const fetchImagenes = async () => {
    const { data, error } = await supabase.storage.from('imagenes').list(`${id}`);
    if (error) return console.error('Error listando imágenes:', error.message);
    setImagenes(data || []);
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of files) {
      const filename = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('imagenes').upload(`${id}/${filename}`, file);
      if (error) console.error('Error subiendo imagen:', error.message);
    }
    fetchImagenes();
  };

  const handleDelete = async (path) => {
    const { error } = await supabase.storage.from('imagenes').remove([`${id}/${path}`]);
    if (error) return console.error('Error borrando imagen:', error.message);
    fetchImagenes();
  };

  if (!restaurante) return <p>Cargando detalles...</p>;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(/logo.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundColor: '#d0e4fa',
        padding: '2rem',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        }}
      >
        <h2>{restaurante.nombre}</h2>
        <p>Fecha: {restaurante.fecha ? new Date(restaurante.fecha).toLocaleDateString() : 'Sin asignar'}</p>

        <h3>Asistentes</h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '2rem' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {usuarios.map((user) => {
              const haVotado = asistentes.includes(user.id)
                ? supabase
                    .from('votaciones')
                    .select('id')
                    .eq('usuario_id', user.id)
                    .eq('restaurante_id', id)
                : null;

              return (
                <li key={user.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={asistentes.includes(user.id)}
                      onChange={() => toggleAsistente(user.id)}
                    />{' '}
                    {user.nombre}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <h3>Imágenes del restaurante</h3>
        <button
          className="button-primary"
          style={{ marginBottom: '1rem' }}
          onClick={() => fileInputRef.current.click()}
        >
          Subir imágenes
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          multiple
          onChange={handleUpload}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {imagenes.length === 0 && <p>No hay imágenes.</p>}
          {imagenes.map((img) => (
            <div key={img.name} style={{ textAlign: 'center' }}>
              <img
                src={`https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/${id}/${img.name}`}
                alt={img.name}
                style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem' }}
              />
              <button onClick={() => handleDelete(img.name)} style={{ marginTop: '0.5rem' }}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminRestaurantDetail;
