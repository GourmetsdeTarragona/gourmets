import { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase';
import ConfirmationMessage from '../components/ConfirmationMessage';

function CreateRestaurant() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoriasExtra, setCategoriasExtra] = useState(['']);
  const [socios, setSocios] = useState([]);
  const [asistentes, setAsistentes] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSocios = async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, rol')
        .neq('rol', 'admin');

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

  const handleCategoriaChange = (index, value) => {
    const nuevasCategorias = [...categoriasExtra];
    nuevasCategorias[index] = value;
    setCategoriasExtra(nuevasCategorias);
  };

  const agregarCategoria = () => {
    setCategoriasExtra([...categoriasExtra, '']);
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

    for (const cat of categoriasExtra) {
      if (cat.trim()) {
        await supabase.from('categorias_extra').insert([
          { restaurante_id: restaurante.id, nombre_extra: cat.trim() },
        ]);
      }
    }

    setMessage('Restaurante creado con éxito.');
    setNombre('');
    setFecha('');
    setCategoriasExtra(['']);
    setAsistentes([]);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(/logo.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundColor: '#d0e4fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '2rem',
          borderRadius: '1rem',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Crear nuevo restaurante</h2>

        <input
          type="text"
          placeholder="Nombre del restaurante"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
          style={inputStyle}
        />

        <fieldset style={{ marginBottom: '1rem' }}>
          <legend>Categorías extra:</legend>
          {categoriasExtra.map((cat, index) => (
            <input
              key={index}
              type="text"
              value={cat}
              onChange={(e) => handleCategoriaChange(index, e.target.value)}
              placeholder={`Categoría extra ${index + 1}`}
              style={{ ...inputStyle, marginBottom: '0.5rem' }}
            />
          ))}
          <button type="button" onClick={agregarCategoria} style={buttonLight}>
            Añadir otra categoría
          </button>
        </fieldset>

        <fieldset style={{ marginBottom: '1rem' }}>
          <legend>Seleccionar asistentes (socios):</legend>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {socios.map((socio) => (
              <label key={socio.id} style={{ display: 'block', marginBottom: '0.3rem' }}>
                <input
                  type="checkbox"
                  checked={asistentes.includes(socio.id)}
                  onChange={() => toggleAsistente(socio.id)}
                />{' '}
                {socio.nombre} ({socio.email})
              </label>
            ))}
          </div>
        </fieldset>

        <button className="button-primary" type="submit" style={{ width: '100%' }}>
          Crear restaurante
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ConfirmationMessage message={message} />
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  borderRadius: '0.5rem',
  border: '1px solid #ccc',
};

const buttonLight = {
  padding: '0.5rem 1rem',
  backgroundColor: '#f0f0f0',
  border: '1px solid #aaa',
  borderRadius: '0.5rem',
  cursor: 'pointer',
};

export default CreateRestaurant;
