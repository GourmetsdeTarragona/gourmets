import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [imagenActiva, setImagenActiva] = useState('');
  const [usuariosConVoto, setUsuariosConVoto] = useState([]);

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    const { data: rest } = await supabase.from('restaurantes').select('*').eq('id', id).single();
    setRestaurante(rest);

    const { data: allUsers } = await supabase.from('usuarios').select('id, nombre');
    setUsuarios(allUsers || []);

    const { data: votos } = await supabase.from('votaciones').select('usuario_id').eq('restaurante_id', id);
    setUsuariosConVoto(votos?.map(v => v.usuario_id) || []);

    const { data: imageList } = await supabase.storage.from('imagenes').list(`imagenes/${id}`);
    if (imageList?.length) {
      const urls = await Promise.all(
        imageList.map(img =>
          supabase.storage.from('imagenes').getPublicUrl(`imagenes/${id}/${img.name}`).data.publicUrl
        )
      );
      setImagenes(urls);
      setImagenActiva(urls[0]);
    }
  };

  const toggleAsistente = async (userId) => {
    if (usuariosConVoto.includes(userId)) return;
    const nuevosAsistentes = restaurante.asistentes.includes(userId)
      ? restaurante.asistentes.filter(id => id !== userId)
      : [...restaurante.asistentes, userId];

    await supabase.from('restaurantes').update({ asistentes: nuevosAsistentes }).eq('id', restaurante.id);
    setRestaurante({ ...restaurante, asistentes: nuevosAsistentes });
  };

  const handleImagenChange = (img) => setImagenActiva(img);

  const handleEliminarImagen = async () => {
    const nombreArchivo = imagenActiva.split('/').pop();
    const { error } = await supabase.storage.from('imagenes').remove([`imagenes/${id}/${nombreArchivo}`]);
    if (!error) {
      const nuevas = imagenes.filter(img => img !== imagenActiva);
      setImagenes(nuevas);
      setImagenActiva(nuevas[0] || '');
    }
  };

  const handleSubida = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const { error } = await supabase.storage.from('imagenes').upload(`imagenes/${id}/${Date.now()}_${archivo.name}`, archivo);
    if (!error) {
      fetchDatos();
    }
  };

  if (!restaurante) return <p>Cargando detalles...</p>;

  return (
    <div className="container">
      <h1>{restaurante.nombre}</h1>

      <h2>Asistentes</h2>
      <ul>
        {usuarios.map(user => (
          <li key={user.id}>
            <label>
              <input
                type="checkbox"
                checked={restaurante.asistentes.includes(user.id)}
                disabled={usuariosConVoto.includes(user.id)}
                onChange={() => toggleAsistente(user.id)}
              />
              {user.nombre}
            </label>
            {usuariosConVoto.includes(user.id) && <span style={{ color: 'gray' }}> (ya votó)</span>}
          </li>
        ))}
      </ul>

      <h2>Imágenes</h2>
      {imagenActiva && (
        <div style={{ marginBottom: '1rem' }}>
          <img src={imagenActiva} alt="Principal" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
          <button onClick={handleEliminarImagen} className="button-primary" style={{ marginTop: '0.5rem' }}>
            Eliminar esta imagen
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1rem' }}>
        {imagenes.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Miniatura ${idx}`}
            onClick={() => handleImagenChange(img)}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              border: img === imagenActiva ? '3px solid #007bff' : '1px solid #ccc',
              borderRadius: '0.25rem',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      <input type="file" accept="image/*" onChange={handleSubida} />
    </div>
  );
}

export default AdminRestaurantDetail;
