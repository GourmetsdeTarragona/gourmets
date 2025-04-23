import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import '../../styles.css';

const CategoriasDinamicas = () => {
  const [restaurantes, setRestaurantes] = useState([]);
  const [restauranteId, setRestauranteId] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarRestaurantes = async () => {
      const { data } = await supabase.from('restaurantes').select('*');
      if (data) setRestaurantes(data);
    };
    cargarRestaurantes();
  }, []);

  const agregarCategoria = async () => {
    if (!restauranteId || !nuevaCategoria) {
      setMensaje('Selecciona un restaurante y escribe una categoría.');
      return;
    }

    const { data: actual } = await supabase
      .from('restaurantes')
      .select('categorias_unicas')
      .eq('id', restauranteId)
      .single();

    const actualizadas = [...(actual?.categorias_unicas || []), nuevaCategoria];

    const { error } = await supabase
      .from('restaurantes')
      .update({ categorias_unicas: actualizadas })
      .eq('id', restauranteId);

    if (error) {
      setMensaje('Error al añadir categoría.');
    } else {
      setMensaje('Categoría añadida con éxito.');
      setNuevaCategoria('');
    }
  };

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Categorías Dinámicas</h2>

      <div className="section">
        <select
          value={restauranteId}
          onChange={(e) => setRestauranteId(e.target.value)}
        >
          <option value="">Selecciona un restaurante</option>
          {restaurantes.map((r) => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nombre de la nueva categoría"
          value={nuevaCategoria}
          onChange={(e) => setNuevaCategoria(e.target.value)}
        />

        <button onClick={agregarCategoria}>Añadir categoría</button>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
};

export default CategoriasDinamicas;
