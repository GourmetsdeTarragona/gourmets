import { useNavigate } from 'react-router-dom';

function RankingList({ restaurantes }) {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Ranking Gourmet</h2>
      {restaurantes.map((restaurante) => (
        <div
          key={restaurante.id}
          className="card"
          style={{ marginBottom: '1rem', cursor: 'pointer' }}
          onClick={() => navigate(`/vote/${restaurante.id}`)}
        >
          <h3>{restaurante.nombre}</h3>
          <p>Nota global: {restaurante.nota_global?.toFixed(2) || 'Sin datos'}</p>
        </div>
      ))}
    </div>
  );
}

export default RankingList;
