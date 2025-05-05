import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchRestaurante();
    fetchImagenes();
  }, []);

  const fetchRestaurante = async () => {
    const { data, error } = await supabase
      .from('restaurantes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al cargar restaurante:', error.message);
    } else {
      setRestaurante(data);
    }
  };

  const fetchImagenes = async () => {
    const { data, error } = await supabase
      .storage
      .from('imagenes')
      .list(`${id}`);

    if (error) {
      console.error('Error al listar imágenes:', error.message);
    } else {
      setImagenes(data || []);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const filename = `${Date.now()}_${file.name}`;
    const { error } = await supabase
      .storage
      .from('imagenes')
      .upload(`${id}/${filename}`, file);

    if (error) {
      console.error('Error subiendo imagen:', error.message);
    } else {
      setFile(null);
      fetchImagenes();
    }
  };

  const handleDelete = async (filename) => {
    const { error } = await supabase
      .storage
      .from('imagenes')
      .remove([`${id}/${filename}`]);

    if (error) {
      console.error('Error al eliminar imagen:', error.message);
    } else {
      fetchImagenes();
    }
  };

  if (!restaurante) return <p>Cargando detalles...</p>;

  return (
    <div className="container">
      <h2>{restaurante.nombre}</h2>
      <p>Fecha: {restaurante.fecha ? new Date(restaurante.fecha).toLocaleDateString() : 'Sin asignar'}</p>

      <h3>Imágenes del restaurante</h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        onClick={handleUpload}
        className="button-primary"
        style={{ marginLeft: '1rem' }}
      >
        Subir imagen
      </button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
        {imagenes.length === 0 ? (
          <p>No hay imágenes disponibles.</p>
        ) : (
          imagenes.map((img) => (
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
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.3rem 0.6rem',
                  cursor: 'pointer',
                }}
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminRestaurantDetail;
