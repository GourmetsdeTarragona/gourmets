import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Asegúrate que el path es correcto
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('usuario', usuario)
        .eq('clave', clave)
        .single();

      if (error || !data) {
        setError('Usuario o contraseña incorrectos.');
      } else {
        if (data.rol === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      }
    } catch (err) {
      console.error('Error de login:', err.message);
      setError('Error inesperado.');
    }
  };

  return (
    <div className="page-container">
      <h2>Iniciar Sesión</h2>
      <form className="formulario-login" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
