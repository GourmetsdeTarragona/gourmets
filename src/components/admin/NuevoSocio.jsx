import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const NuevoSocio = () => {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [rol, setRol] = useState('socio');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const registrar = async () => {
    if (!usuario || !clave) {
      setMensaje('Faltan campos por completar.');
      return;
    }

    const { error } = await supabase.from('usuarios').insert([
      { usuario, clave, rol }
    ]);

    if (error) {
      setMensaje('Error al guardar el usuario.');
    } else {
      setMensaje('Usuario registrado con éxito.');
      setUsuario('');
      setClave('');
      setRol('socio');
    }
  };

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Registrar nuevo usuario</h2>

      <div className="section">
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="socio">Socio</option>
          <option value="admin">Administrador</option>
        </select>
        <button onClick={registrar}>Guardar usuario</button>
        {mensaje && <p>{mensaje}</p>}
        <button onClick={() => navigate('/admin')}>Volver</button>
      </div>
    </div>
  );
};

export default NuevoSocio;
