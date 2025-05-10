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
  const [cartaFile, setCartaFile] = useState(null);
  const [minutaFile, setMinutaFile] = useState(null);

  useEffect(() => {
    fetchRestaurante();
    fetchUsuarios();
    fetchImagenes();
  }, []);

  const fetchRestaurante = async () => {
    const { data, error } = await supabase
      .from('restaurantes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return console.error('Error cargando restaurante:', error.message);
    setRestaurante(data);
    setAsistentes(data.asistentes || []);
  };

  const fetchUsuarios = async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, rol');
    if (error) return console.error('Error cargando usuarios:', error.message);
    const socios = data.filter(u => u.rol !== 'admin');
    setUsuarios(socios);
  };

  const fetchImagenes = async () => {
    const { data, error } = await supabase.storage.from('imagenes').list(`${id}`);
    if (error) return console.error('Error listando imágenes:', error.message);
    setImagenes(data || []);
  };

  const toggleAsistente = async (usuarioId) => {
    const { data: voto } = await supabase
      .from('votaciones')
      .select('id')
      .eq('usuario_id', usuarioId)
      .eq('restaurante_id', id)
      .maybeSingle();

    if (voto) {
      alert('Este usuario ya ha votado y no se puede eliminar.');
      return;
    }

    const nuevosAsistentes = asistentes.includes(usuarioId)
      ? asistentes.filter(uid => uid !== usuarioId)
      : [...asistentes, usuarioId];

    const { error } = await supabase
      .from('restaurantes')
      .update({ asistentes: nuevosAsistentes })
      .eq('id', id);

    if (error) return console.error('Error actualizando asistentes:', error.message);
    setAsistentes(nuevosAsistentes);
  };

  const handleImageUpload = async () => {
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

  const handlePDFUpload = async (type) => {
    const fileToUpload = type === 'carta' ? cartaFile : minutaFile;
    if (!fileToUpload) return;
    const filename = `${type}_${Date.now()}.pdf`;
    const { data, error } = await supabase.storage
      .from('documentos')
      .upload(`${id}/${filename}`, fileToUpload, { contentType: 'application/pdf', upsert: true });

    if (error) return console.error(`Error subiendo ${type}:`, error.message);

    const fileUrl = `https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/documentos/${id}/${filename}`;
    const updateField = type === 'carta' ? { carta_url: fileUrl } : { minuta_url: fileUrl };

    const { error: updateError } = await supabase
      .from('restaurantes')
      .update(updateField)
      .eq('id', id);

    if (updateError) return console.error('Error actualizando URL:', updateError.message);

    fetchRestaurante();
    if (type === 'carta') setCartaFile(null);
    else setMinutaFile(null);
  };

  if (!restaurante) return <p className="container">Cargando detalles...</p>;

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <h2>{restaurante.nombre}</h2>
      <p>Fecha: {restaurante.fecha ? new Date(restaurante.fecha).toLocaleDateString() : 'Sin asignar'}</p>

      <h3>Asistentes</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {usuarios.map((user) => (
          <li key={user.id}>
            <label>
              <input
                type="checkbox"
                checked={asistentes.includes(user.id)}
                onChange={() => toggleAsistente(user.id)}
                disabled={
                  asistentes.includes(user.id) &&
                  restaurante &&
                  restaurante.id &&
                  supabase
                    .from('votaciones')
                    .select('id')
                    .eq('usuario_id', user.id)
                    .eq('restaurante_id', restaurante.id)
                }
              />{' '}
              {user.nombre}
            </label>
          </li>
        ))}
      </ul>

      <h3>Imágenes del restaurante</h3>
      <button
        className="button-primary"
        onClick={() => document.getElementById('upload-image').click()}
        style={{ marginBottom: '1rem' }}
      >
        Seleccionar imagen
      </button>
      <input
        id="upload-image"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          setFile(e.target.files[0]);
          setTimeout(() => handleImageUpload(), 300);
        }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
        {imagenes.length === 0 && <p>No hay imágenes.</p>}
        {imagenes.map((img) => (
          <div key={img.name} style={{ textAlign: 'center' }}>
            <img
              src={`https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/${id}/${img.name}`}
              alt={img.name}
              style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem' }}
            />
            <button onClick={() => handleDelete(img.name)} style={{ marginTop: '0.5rem' }}>Eliminar</button>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: '2rem' }}>Documentos adjuntos</h3>
      <div style={{ marginBottom: '1rem' }}>
        {restaurante.carta_url ? (
          <p>
            📄 <strong>Carta de invitación:</strong>{' '}
            <a href={restaurante.carta_url} target="_blank" rel="noopener noreferrer">
              Descargar PDF
            </a>
          </p>
        ) : (
          <p>No se ha subido la carta de invitación.</p>
        )}
        <input type="file" accept="application/pdf" onChange={(e) => setCartaFile(e.target.files[0])} />
        <button onClick={() => handlePDFUpload('carta')} className="button-primary" style={{ marginBottom: '1rem' }}>
          Subir carta
        </button>

        {restaurante.minuta_url ? (
          <p>
            📄 <strong>Minuta del restaurante:</strong>{' '}
            <a href={restaurante.minuta_url} target="_blank" rel="noopener noreferrer">
              Descargar PDF
            </a>
          </p>
        ) : (
          <p>No se ha subido la minuta.</p>
        )}
        <input type="file" accept="application/pdf" onChange={(e) => setMinutaFile(e.target.files[0])} />
        <button onClick={() => handlePDFUpload('minuta')} className="button-primary">
          Subir minuta
        </button>
      </div>
    </div>
  );
}

export default AdminRestaurantDetail;
