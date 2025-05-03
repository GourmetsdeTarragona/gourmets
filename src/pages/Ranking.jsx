import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';
import RankingList from '../components/RankingList';

function Ranking() {
  const [rankingGlobal, setRankingGlobal] = useState([]);
  const [rankingPorCategoria, setRankingPorCategoria] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetchRankingGlobal();
    fetchCategorias();
  }, []);

  const fetchRankingGlobal = async () => {
    const { data, error } = await supabase.rpc('calcular_ranking_global');
    if (error) {
      console.error('Error al cargar ranking global:', error.message);
      return;
    }
    setRankingGlobal(data);
  };

  const fetchCategorias = async () => {
    const { data: fijas } = await supabase.from('categorias_fijas').select('*');
    const { data: extras } = await supabase.from('categorias_extra').select('id, nombre');

    const todas = [
      ...fijas.map((cat) => ({ ...cat, tipo: 'fija' })),
      ...extras.map((cat) => ({ ...cat, tipo: 'extra' }))
    ];

    setCategorias(todas);
  };

  const fetchRankingCategoria = async (categoriaId, tipo) => {
    let query = supabase
      .from('votaciones')
      .select('restaurante_id, valor, restaurantes(nombre)')
      .eq(tipo === 'fija' ? 'categoria_fija_id' : 'categoria_extra_id', categoriaId);

    const { data, error } = await query;
    if (error) {
      console.error(`Error en ranking por categoría ${categoriaId}:`, error.message);
      return;
    }

    const agrupado = data.reduce((acc, voto) => {
      const key = voto.restaurante_id;
      if (!acc[key]) {
        acc[key] = { restaurante_id: key, nombre: voto.restaurantes.nombre, total: 0, count: 0 };
      }
      acc[key].total += voto.valor;
      acc[key].count += 1;
      return acc;
    }, {});

    const resultado = Object.values(agrupado)
      .map((r) => ({
        restaurante_id: r.restaurante_id,
        nombre: r.nombre,
        promedio: (r.total / r.count).toFixed(2)
      }))
      .sort((a, b) => b.promedio - a.promedio || a.nombre.localeCompare(b.nombre));

    setRankingPorCategoria((prev) => [...prev, { categoriaId, tipo, datos: resultado }]);
  };

  useEffect(() => {
    if (categorias.length > 0) {
      categorias.forEach((cat) => {
        fetchRankingCategoria(cat.id, cat.tipo);
      });
    }
  }, [categorias]);

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>Ranking Gourmet</h1>

      {rankingGlobal.length > 0 && (
        <RankingList
          restaurantes={rankingGlobal}
          titulo="⭐ Ranking Global"
        />
      )}

      {rankingPorCategoria.map((r) => {
        const categoria = categorias.find((c) => c.id === r.categoriaId);
        return (
          <RankingList
            key={r.categoriaId}
            restaurantes={r.datos}
            titulo={`🏅 Mejor en ${categoria?.nombre || 'Categoría'}`}
          />
        );
      })}
    </div>
  );
}

export default Ranking;
