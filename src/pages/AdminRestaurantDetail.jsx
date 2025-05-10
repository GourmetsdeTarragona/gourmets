import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [asistentes, setAsistentes] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [files, setFiles] = useState([]);
  const [documentos, setDocumentos] = useState({ carta: null, minuta: null });

  useEffect(() => {
    fetchRestaurante();
    fetchUsuarios();
    fetchImagenes();
    fetchDocumentos();
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
    setUsuarios(data.filter((u) => u.rol !== 'admin'));
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

  const handleUpload = async (event) => {
    const selected = Array.from(event.target.files);
    for (const file of selected) {
      const filename = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('imagenes').upload(`${id}/${filename}`, file);
      if (error) console.error('Error subiendo imagen:', error.message);
    }
    fetchImagenes();
  };

  const handleDeleteImage = async (path) => {
    const { error } = await supabase.storage.from('imagenes').remove([`${id}/${path}`]);
    if (error) return console.error('Error borrando imagen:', error.message);
    fetchImagenes();
  };

  const fetchDocumentos = async () => {
    const { data } = await supabase.from('restaurantes').select('carta_url, minuta_url').eq('id', id).single();
    setDocumentos({ carta: data.carta_url, minuta: data.minuta_url });
  };

  const handlePdfUpload = async (event, tipo) => {
    const file = event.target.files[0];
    if (!file) return;
    const filename = `${tipo}_${Date.now()}.pdf`;
    const { data, error } = await supabase.storage.from('documentos').upload(`${id}/${filename}`, file);
    if (error) return console.error(`Error subiendo ${tipo}:`, error.message);

    const publicUrl = `https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/documentos/${id}/${filename}`;
    await supabase.from('restaurantes').update({ [`${tipo}_url`]: publicUrl }).eq('id', id);
    fetchDocumentos();
  };

  const handleDeletePdf = async (tipo) => {
    const url = documentos[tipo];
    const path = url.split('/documentos/')[1];
    await supabase.storage.from('documentos').remove([path]);
    await supabase.from('restaurantes').update({ [`${tipo}_url`]: null }).eq('id', id);
    fetchDocumentos();
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
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '800px',
        margin: 'auto',
      }}>
        <h2>{restaurante.nombre}</h2>
        <p>Fecha: {restaurante.fecha ? new Date(restaurante.fecha).toLocaleDateString() : 'Sin asignar'}</p>

        <h3>Asistentes</h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '2rem' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {usuarios.map((user) => (
              <li key={user.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={asistentes.includes(user.id)}
                    onChange={() => toggleAsistente(user.id)}
                    disabled={false}
                  />{' '}
                  {user.nombre}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <h3>Imágenes del restaurante</h3>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          style={{ marginBottom: '1rem' }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {imagenes.map((img) => (
            <div key={img.name} style={{ textAlign: 'center' }}>
              <img
                src={`https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/${id}/${img.name}`}
                alt={img.name}
                style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem' }}
              />
              <button onClick={() => handleDeleteImage(img.name)} style={{ marginTop: '0.5rem' }}>Eliminar</button>
            </div>
          ))}
        </div>

        <h3>Documentos PDF</h3>
        {['carta', 'minuta'].map((tipo) => (
          <div key={tipo} style={{ marginBottom: '1rem' }}>
            <p>{tipo === 'carta' ? 'Carta de invitación' : 'Minuta del restaurante'}</p>
            {documentos[tipo] ? (
              <div>
                <a href={documentos[tipo]} target="_blank" rel="noopener noreferrer">
                  Ver documento
                </a>
                <button onClick={() => handleDeletePdf(tipo)} style={{ marginLeft: '1rem' }}>Eliminar</button>
              </div>
            ) : (
              <input type="file" accept="application/pdf" onChange={(e) => handlePdfUpload(e, tipo)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminRestaurantDetail;
