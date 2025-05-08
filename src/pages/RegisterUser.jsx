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
    setMessage('');
    setError('');

    const { error: insertError } = await supabase.from('usuarios').insert([
      { nombre, email, password, rol },
    ]);

    if (insertError) {
      setError('Error al registrar el usuario.');
      console.error(insertError);
    } else {
      setMessage('Usuario registrado con éxito.');
      setNombre('');
      setEmail('');
      setPassword('');
      setRol('socio');
    }
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
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Registrar nuevo usuario</h2>

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
          placeholder="Correo electrónico"
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
          style={inputStyle}
        >
          <option value="socio">Socio</option>
          <option value="admin">Administrador</option>
        </select>

        <button className="button-primary" type="submit" style={{ width: '100%' }}>
          Registrar usuario
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

export default RegisterUser;
