import { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase';
import ConfirmationMessage from '../components/ConfirmationMessage';

function CreateRestaurant() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoriaExtra, setCategoriaExtra] = useState('');
  const [socios, setSocios] = useState([]);
  const [asistentes, setAsistentes] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Obtener lista de socios
  useEffect(() => {
    const fetchSocios = async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email')
        .eq('rol', 'socio');

      if (!error) setSocios(data);
    };

    fetchSocios();
  }, []);

  const toggleAsistente = (id) => {
    if (asistentes.includes(id)) {
      setAsistentes(asistentes.filter((a) => a !== id));
    } else {
      setAsistentes([...asistentes, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const { data: restaurante, error: insertError } = await supabase
      .from('restaurantes')
      .insert([{ nombre, fecha, asistentes }])
      .select()
      .single();

    if (insertError) {
      setError('Error al crear el restaurante.');
      console.error(insertError);
      return;
    }

    // Insertar categoría extra si se indicó
    if (categoriaExtra.trim()) {
      const { error: extraError } = await supabase.from('categorias_extra').insert([
        {
          restaurante_id: restaurante.id,
          nombre_extra: categoriaExtra.trim(),
        },
      ]);

      if (extraError) {
        setError('Restaurante creado, pero error en categoría extra.');
        return;
      }
    }

    setMessage('Restaurante creado con éxito.');
    setNombre('');
    setFecha('');
    setCategoriaExtra('');
    setAsistentes([]);
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '3rem auto' }}>
      <h2>Crear nuevo restaurante</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Nombre del restaurante"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Categoría extra (opcional)"
          value={categoriaExtra}
          onChange={(e) => setCategoriaExtra(e.target.value)}
        />
        <fieldset style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <legend>Seleccionar asistentes (socios):</legend>
          {socios.map((socio) => (
            <label key={socio.id} style={{ display: 'block', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={asistentes.includes(socio.id)}
                onChange={() => toggleAsistente(socio.id)}
              />{' '}
              {socio.nombre} ({socio.email})
            </label>
          ))}
        </fieldset>
        <button className="button-primary" type="submit">
          Crear restaurante
        </button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <ConfirmationMessage message={message} />
      </form>
    </div>
  );
}

export default CreateRestaurant;
