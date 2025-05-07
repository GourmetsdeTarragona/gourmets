
import { useState } from 'react';
import { supabase } from '../supabase/supabase';
import ConfirmationMessage from '../components/ConfirmationMessage';

function RegisterUser() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('socio');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const { error: insertError } = await supabase.from('usuarios').insert([
      {
        nombre,
        email,
        password,
        rol,
      },
    ]);

    if (insertError) {
      setError('Error al registrar el usuario.');
      return;
    }

    setMessage('Usuario registrado con éxito.');
    setNombre('');
    setEmail('');
    setPassword('');
    setRol('socio');
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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }}
      />
      <form
        onSubmit={handleSubmit}
        style={{
          zIndex: 2,
          backgroundColor: 'rgba(255,255,255,0.95)',
          padding: '2rem',
          borderRadius: '1rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '1.5rem' }}>Registrar usuario</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          required
          style={{ ...inputStyle, fontSize: '1rem' }}
        >
          <option value="socio">Socio</option>
          <option value="admin">Administrador</option>
        </select>

        <button type="submit" style={buttonStyle}>Registrar</button>
        {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
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
  fontSize: '1rem',
};

const buttonStyle = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  cursor: 'pointer',
};

export default RegisterUser;
