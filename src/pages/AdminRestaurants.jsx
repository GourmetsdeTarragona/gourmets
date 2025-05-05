import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchRestaurante();
    fetchUsuarios();
    fetchImagenes();
  }, []);

  const fetchRestaurante = async () => {
    const { data } = await supabase.from('restaurantes').select('*').eq('id', id).single();
    setRestaurante(data);
  };

  const fetchUsuarios = async () => {
    const { data } = await supabase.from('usuarios').select('*');
    setUsuarios(data);
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
    <div className="container">
      <h2>{restaurante.nombre}</h2>
      <p>Fecha: {restaurante.fecha ? new Date(restaurante.fecha).toLocaleDateString() : 'Sin asignar'}</p>

      <h3>Imágenes del restaurante</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="button-primary" onClick={handleUpload}>Subir imagen</button>

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
    </div>
  );
}

export default AdminRestaurantDetail;
