import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [asistentes, setAsistentes] = useState([]);
  const [categoriaExtra, setCategoriaExtra] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const { data: rData, error: rError } = await supabase
      .from('restaurantes')
      .select('*')
      .eq('id', id)
      .single();

    if (rError || !rData) {
      setError('Error cargando restaurante');
      return;
    }

    setRestaurante(rData);

    if (rData.asistentes?.length) {
      const { data: socios } = await supabase
        .from('usuarios')
        .select('id, nombre, email')
        .in('id', rData.asistentes);

      setAsistentes(socios || []);
    }

    const { data: extra } = await supabase
      .from('categorias_extra')
      .select('nombre_extra')
      .eq('restaurante_id', id)
      .maybeSingle();

    if (extra) {
      setCategoriaExtra(extra.nombre_extra);
    }

    fetchFotos();
  };

  const fetchFotos = async () => {
    const { data, error } = await supabase.storage
      .from('imagenes')
      .list(`${id}/`, { limit: 100 });

    if (error) {
      console.error('Error cargando fotos:', error);
      return;
    }

    const urls = data.map((file) =>
      supabase.storage.from('imagenes').getPublicUrl(`${id}/${file.name}`).data.publicUrl
    );
    setFotos(urls);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("No se seleccionó ningún archivo");
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Tipo de archivo no válido. Usa JPG, PNG o WebP.");
      return;
    }

    const filePath = `${id}/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from('imagenes')
      .upload(filePath, file, {
        contentType: file.type
      });

    if (error) {
      console.error("🚨 Error subiendo imagen:", error);
      alert("Error subiendo imagen: " + error.message);
      return;
    }

    await fetchFotos();
    alert("Imagen subida correctamente");
  };

  const handleDelete = async (url) => {
    const filePath = url.split('/imagenes/')[1];

    if (!filePath) {
      alert("No se pudo determinar la ruta del archivo");
      return;
    }

    const { error } = await supabase.storage
      .from('imagenes')
      .remove([filePath]);

    if (error) {
      alert("Error al eliminar imagen en Supabase");
      console.error(error);
      return;
    }

    setFotos((prev) => prev.filter((foto) => foto !== url));
    alert("Imagen eliminada correctamente");
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!restaurante) return <p>Cargando...</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '3rem auto' }}>
      <h2>Detalles del restaurante</h2>

      <div style={{ marginBottom: '2rem' }}>
        <p><strong>Nombre:</strong> {restaurante.nombre}</p>
        <p><strong>Fecha:</strong> {restaurante.fecha}</p>
        <p><strong>Categoría extra:</strong> {categoriaExtra || '—'}</p>
      </div>

      <h3>Asistentes</h3>
      {asistentes.length === 0 ? (
        <p>No hay asistentes registrados.</p>
      ) : (
        <ul style={{ paddingLeft: '1rem' }}>
          {asistentes.map((socio) => (
            <li key={socio.id}>
              {socio.nombre} ({socio.email})
            </li>
          ))}
        </ul>
      )}

      <h3 style={{ marginTop: '2rem' }}>Fotos del evento</h3>
      <input type="file" accept="image/*" onChange={handleUpload} />
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1rem', gap: '1rem' }}>
        {fotos.map((url, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            <img
              src={url}
              alt={`foto-${idx}`}
              style={{ width: '150px', borderRadius: '8px', objectFit: 'cover' }}
            />
            <button
              onClick={() => handleDelete(url)}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: 'red',
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
  );
}

export default AdminRestaurantDetail;
