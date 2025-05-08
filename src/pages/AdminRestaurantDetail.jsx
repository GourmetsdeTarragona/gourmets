import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [asistentes, setAsistentes] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [file, setFile] = useState(null);

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
    const { data, error } = await supabase.from('usuarios').select('id, nombre');
    if (error) return console.error('Error cargando usuarios:', error.message);
    setUsuarios(data);
  };

  const toggleAsistente = async (usuarioId) => {
    const yaHaVotado = await supabase
      .from('votaciones')
      .select('id')
      .eq('usuario_id', usuarioId)
      .eq('restaurante_id', id)
      .maybeSingle();

    if (yaHaVotado.data) {
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

  const handleUpload = async () => {
    if (!file) return;
    const filename = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('imagenes').upload(`${id}/${filename}`, file);
    if (error) return console.error('Error subiendo imagen:', error.message);
    setFile(null);
    fetchImagenes();
  };

  const handleDelete = async (path) => {
    const { error } = await supabase.storage.from('imagenes').remove([`${id}/${path}`]);
    if (error) return console.error('Error borrando imagen:', error.message);
    fetchImagenes();
  };

  if (!restaurante) return <p style={{ padding: '2rem' }}>Cargando detalles...</p>;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(/logo.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundColor: '#d0e4fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '2rem',
          borderRadius: '1rem',
          maxWidth: '700px',
          width: '100%',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>{restaurante.nombre}</h2>
        <p>Fecha: {restaurante.fecha ? new Date(restaurante.fecha).toLocaleDateString() : 'Sin asignar'}</p>

        <h3 style={{ marginTop: '2rem' }}>Asistentes</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '2rem' }}>
          {usuarios.map((user) => (
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
          ))}
        </ul>

        <h3>Imágenes del restaurante</h3>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button
          onClick={handleUpload}
          style={{
            marginTop: '1rem',
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
          }}
        >
          Subir imagen
        </button>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {imagenes.length === 0 && <p>No hay imágenes.</p>}
          {imagenes.map((img) => (
            <div key={img.name} style={{ textAlign: 'center' }}>
              <img
                src={`https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/${id}/${img.name}`}
                alt={img.name}
                style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem' }}
              />
              <button
                onClick={() => handleDelete(img.name)}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#c00',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                }}
              >
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
