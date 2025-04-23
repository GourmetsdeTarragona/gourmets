import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import '../../styles.css';

const NuevoSocio = () => {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [rol, setRol] = useState('socio');
  const [mensaje, setMensaje] = useState('');

  const crearUsuario = async () => {
    if (!usuario || !clave) {
      setMensaje('Completa todos los campos');
      return;
    }

    const { error } = await supabase.from('usuarios').insert({
      usuario,
      clave,
      rol
    });

    if (error) {
      setMensaje('Error al crear usuario.');
    } else {
      setMensaje('Usuario creado correctamente.');
      setUsuario('');
      setClave('');
      setRol('socio');
    }
  };

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Nuevo Socio o Administrador</h2>

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
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="socio">Socio</option>
          <option value="admin">Administrador</option>
        </select>

        <button onClick={crearUsuario}>Registrar</button>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
};

export default NuevoSocio;
