import { useState } from 'react';
import { supabase } from '../supabase/supabase';
import ConfirmationMessage from '../components/ConfirmationMessage';

function RegisterUser() {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('socio');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Comprobar si el correo ya existe
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      setError('Este correo ya está registrado.');
      return;
    }

    const { error } = await supabase.from('usuarios').insert([
      {
        email,
        nombre,
        password,
        rol,
      },
    ]);

    if (error) {
      setError('Error al registrar el usuario.');
      console.error(error);
    } else {
      setMessage('Usuario registrado con éxito.');
      setEmail('');
      setNombre('');
      setPassword('');
      setRol('socio');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '3rem auto' }}>
      <h2>Registrar nuevo usuario</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="socio">Socio</option>
          <option value="admin">Administrador</option>
        </select>
        <button className="button-primary" type="submit">
          Registrar usuario
        </button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <ConfirmationMessage message={message} />
      </form>
    </div>
  );
}

export default RegisterUser;
