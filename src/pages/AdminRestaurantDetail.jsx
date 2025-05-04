import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [socios, setSocios] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: rest, error } = await supabase
      .from('restaurantes')
      .select('*')
      .eq('id', id)
      .single();

    const { data: sociosData } = await supabase.from('usuarios').select('id, nombre, rol');
    const { data: votosData } = await supabase
      .from('votaciones')
      .select('usuario_id')
      .eq('restaurante_id', id);

    const yaHanVotado = votosData?.map(v => v.usuario_id) || [];

    setRestaurante(rest);
    setSocios(
      sociosData.map(s => ({
        ...s,
        seleccionado: rest.asistentes?.includes(s.id) || false,
        yaHaVotado: yaHanVotado.includes(s.id),
      }))
    );

    const { data: files } = await supabase.storage
      .from('imagenes')
      .list(`${id}`, { limit: 100 });

    const urls = await Promise.all(
      (files || []).map(async (file) => {
        const { data } = await supabase.storage
          .from('imagenes')
          .getPublicUrl(`${id}/${file.name}`);
        return { url: data.publicUrl, name: file.name };
      })
    );

    setImagenes(urls);
    setLoading(false);
  };

  const handleCheckboxChange = async (userId) => {
    const nuevosAsistentes = restaurante.asistentes.includes(userId)
      ? restaurante.asistentes.filter(id => id !== userId)
      : [...restaurante.asistentes, userId];

    await supabase
      .from('restaurantes')
      .update({ asistentes: nuevosAsistentes })
      .eq('id', restaurante.id);

    fetchData();
  };

  const handleDeleteImage = async (fileName) => {
    await supabase.storage.from('imagenes').remove([`${id}/${fileName}`]);
    fetchData();
  };

  if (loading) return <p>Cargando detalles...</p>;

  return (
    <div className="container">
      <h2>{restaurante.nombre}</h2>

      <h3>Socios asistentes</h3>
      <ul>
        {socios.map(socio => (
          <li key={socio.id}>
            <label>
              <input
                type="checkbox"
                checked={socio.seleccionado}
                disabled={socio.yaHaVotado}
                onChange={() => handleCheckboxChange(socio.id)}
              />
              {socio.nombre} {socio.yaHaVotado && '(ya ha votado)'}
            </label>
          </li>
        ))}
      </ul>

      <h3>Imágenes del restaurante</h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {imagenes.map((img) => (
          <div key={img.name} style={{ position: 'relative' }}>
            <img
              src={img.url}
              alt={img.name}
              style={{ width: '120px', borderRadius: '8px' }}
            />
            <button
              onClick={() => handleDeleteImage(img.name)}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '0 0 0 5px',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminRestaurantDetail;
