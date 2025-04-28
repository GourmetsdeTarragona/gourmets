import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';
import RankingList from '../components/RankingList';

function Ranking() {
  const [restaurantes, setRestaurantes] = useState([]);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    const { data, error } = await supabase.rpc('calcular_ranking_global');
    if (!error) {
      setRestaurantes(data);
    } else {
      console.error('Error al cargar ranking:', error.message);
    }
  };

  return (
    <div className="container">
      <h1>Ranking de Restaurantes</h1>
      {restaurantes.length > 0 ? (
        <RankingList restaurantes={restaurantes} />
      ) : (
        <p>No hay datos de ranking disponibles.</p>
      )}
    </div>
  );
}

export default Ranking;
