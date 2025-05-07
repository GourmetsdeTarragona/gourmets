import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import RankingList from '../components/RankingList';
import logo from '/logo.png';
import { useNavigate } from 'react-router-dom';

function Ranking() {
  const [restaurantes, setRestaurantes] = useState([]);
  const navigate = useNavigate();

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
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#d0e4fa',
        padding: '2rem',
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.07,
          width: '60%',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Ranking de Restaurantes
        </h1>

        {restaurantes.length > 0 ? (
          <RankingList restaurantes={restaurantes} />
        ) : (
          <p style={{ textAlign: 'center' }}>
            No hay datos de ranking disponibles.
          </p>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            className="button-primary"
            onClick={() => navigate('/restaurants')}
          >
            Volver a restaurantes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ranking;
