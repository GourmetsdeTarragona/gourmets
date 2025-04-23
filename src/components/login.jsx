import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import '../styles.css';

const Login = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const manejarLogin = async () => {
    setError('');
    if (!usuario || !clave) {
      setError('Por favor completa ambos campos.');
      return;
    }

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('usuario', usuario)
      .eq('clave', clave)
      .single();

    if (error || !data) {
      setError('Credenciales incorrectas.');
    } else {
      if (data.rol === 'admin') {
        navigate('/admin');
      } else {
        navigate(`/votacion/${data.id}`);
      }
    }
  };

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Iniciar sesión</h2>

      <div className="section">
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={manejarLogin}>Entrar</button>
      </div>
    </div>
  );
};

export default Login;
