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
      return;
    }

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
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/imagenes/foto-defecto.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '2rem',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
      }} />
      <div style={{
        zIndex: 2,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '2rem',
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      }}>
        <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Crear nuevo restaurante</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
          <input
            type="text"
            placeholder="Categoría extra (opcional)"
            value={categoriaExtra}
            onChange={(e) => setCategoriaExtra(e.target.value)}
            style={inputStyle}
          />

          <fieldset style={{
            border: '1px solid #ccc',
            borderRadius: '0.5rem',
            padding: '1rem',
          }}>
            <legend style={{ fontWeight: 'bold' }}>Seleccionar asistentes (socios):</legend>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {socios.map((socio) => (
                <label key={socio.id} style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={asistentes.includes(socio.id)}
                    onChange={() => toggleAsistente(socio.id)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {socio.nombre} ({socio.email})
                </label>
              ))}
            </div>
          </fieldset>

          <button className="button-primary" type="submit" style={buttonStyle}>
            Crear restaurante
          </button>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <ConfirmationMessage message={message} />
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '0.5rem',
  border: '1px solid #ccc',
  width: '100%',
};

const buttonStyle = {
  padding: '0.75rem',
  backgroundColor: '#004080',
  color: '#fff',
  border: 'none',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  cursor: 'pointer',
};

export default CreateRestaurant;
