// src/pages/AdminRestaurantDetail.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function AdminRestaurantDetail() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [asistentes, setAsistentes] = useState([]);
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: restData } = await supabase
        .from('restaurantes')
        .select('*')
        .eq('id', id)
        .single();

      const { data: usersData } = await supabase
        .from('usuarios')
        .select('id, nombre')
        .order('nombre');

      if (restData) {
        setRestaurante(restData);
        setAsistentes(restData.asistentes || []);
        setFecha(restData.fecha || '');
      }

      if (usersData) {
        setUsuarios(usersData);
      }
    };

    fetchData();
  }, [id]);

  const handleCheckboxChange = (userId) => {
    if (asistentes.includes(userId)) {
      setAsistentes(asistentes.filter((id) => id !== userId));
    } else {
      setAsistentes([...asistentes, userId]);
    }
  };

  const handleGuardar = async () => {
    const { error } = await supabase
      .from('restaurantes')
      .update({ asistentes, fecha })
      .eq('id', id);

    if (!error) {
      alert('Datos actualizados correctamente');
    } else {
      alert('Error al guardar cambios');
      console.error(error);
    }
  };

  if (!restaurante) return <p>Cargando detalles...</p>;

  return (
    <div className="container">
      <h2>{restaurante.nombre}</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Fecha de la cena: </label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <h3>Asistentes</h3>
      <ul>
        {usuarios.map((user) => (
          <li key={user.id}>
            <label>
              <input
                type="checkbox"
                checked={asistentes.includes(user.id)}
                onChange={() => handleCheckboxChange(user.id)}
              />
              {user.nombre}
            </label>
          </li>
        ))}
      </ul>

      <button onClick={handleGuardar}>Guardar cambios</button>
    </div>
  );
}

export default AdminRestaurantDetail;
