import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const CategoriasDinamicas = () => {
  const [restaurantes, setRestaurantes] = useState([]);
  const [restauranteId, setRestauranteId] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const cargarRestaurantes = async () => {
      const { data, error } = await supabase.from('restaurantes').select('id, nombre');
      if (!error) setRestaurantes(data);
    };
    cargarRestaurantes();
  }, []);

  const guardarCategoria = async () => {
    if (!restauranteId || !nuevaCategoria) {
      setMensaje('Selecciona un restaurante y escribe una categoría.');
      return;
    }

    const { error } = await supabase
      .from('categorias_dinamicas')
      .insert([{ restaurante_id: parseInt(restauranteId), nombre: nuevaCategoria }]);

    if (error) {
      setMensaje('Error al guardar la categoría.');
    } else {
      setMensaje('Categoría añadida correctamente.');
      setNuevaCategoria('');
    }
  };

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Categorías especiales</h2>

      <div className="section">
        <label>Restaurante:</label>
        <select value={restauranteId} onChange={(e) => setRestauranteId(e.target.value)}>
          <option value="">Selecciona uno</option>
          {restaurantes.map((r) => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nombre de la categoría (ej. Vino tinto)"
          value={nuevaCategoria}
          onChange={(e) => setNuevaCategoria(e.target.value)}
        />

        <button onClick={guardarCategoria}>Guardar categoría</button>
        {mensaje && <p>{mensaje}</p>}
        <button onClick={() => navigate('/admin')}>Volver</button>
      </div>
    </div>
  );
};

export default CategoriasDinamicas;

