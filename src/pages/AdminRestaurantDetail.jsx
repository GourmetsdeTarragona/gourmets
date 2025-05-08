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
  const [search, setSearch] = useState('');
  const [votaciones, setVotaciones] = useState([]);

  useEffect(() => {
    fetchRestaurante();
    fetchUsuarios();
    fetchImagenes();
    fetchVotaciones();
  }, []);

  const fetchRestaurante = async () => {
    const { data, error } = await supabase.from('restaurantes').select('*').eq('id', id).single();
    if (error) return console.error('Error cargando restaurante:', error.message);
    setRestaurante(data);
    setAsistentes(data.asistentes || []);
  };

  const fetchUsuarios = async () => {
    const { data, error } = await supabase.from('usuarios').select('id, nombre, rol');
    if (error) return console.error('Error cargando usuarios:', error.message);
    const socios = data.filter(u => u.rol !== 'admin');
    setUsuarios(socios);
  };

  const fetchVotaciones = async () => {
    const { data, error } = await supabase
      .from('votaciones')
      .select('usuario_id')
      .eq('restaurante_id', id);
    if (error) return console.error('Error votaciones:', error.message);
    setVotaciones(data.map(v => v.usuario_id));
  };

  const toggleAsistente = async (usuarioId) => {
    if (votaciones.includes(usuarioId)) {
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

  if (!restaurante) return <p>Cargando detalles...</p>;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#e6f0fa',
        padding: '2rem',
      }}
    >
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '1000px',
        margin: '0 auto',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
      }}>
        <h2>{restaurante.nombre}</h2>
        <p>Fecha: {restaurante.fecha ? new Date(restaurante.fecha).toLocaleDateString() : 'Sin asignar'}</p>

        <h3 style={{ marginTop: '2rem' }}>Asistentes</h3>
        <input
          type="text"
          placeholder="Buscar socio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
        />
        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '1rem', borderRadius: '0.5rem' }}>
          {usuarios
            .filter(u => u.nombre.toLowerCase().includes(search.toLowerCase()))
            .map((user) => (
              <label key={user.id} style={{ display: 'block', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={asistentes.includes(user.id)}
                  onChange={() => toggleAsistente(user.id)}
                  disabled={votaciones.includes(user.id)}
                />{' '}
                {user.nombre} {votaciones.includes(user.id) && '(Ya ha votado)'}
              </label>
            ))}
        </div>

        <h3 style={{ marginTop: '2rem' }}>Imágenes</h3>
        <div>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button className="button-primary" onClick={handleUpload}>Subir imagen</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
          {imagenes.map((img) => (
            <div key={img.name} style={{ position: 'relative' }}>
              <img
                src={`https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/${id}/${img.name}`}
                alt={img.name}
                style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem' }}
              />
              <button
                onClick={() => handleDelete(img.name)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminRestaurantDetail;
