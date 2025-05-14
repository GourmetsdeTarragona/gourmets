import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';
import logo from '/logo.png';

function Ranking() {
  const { user } = useUser();
  const [tab, setTab] = useState('restaurantes');
  const [rankingRestaurantes, setRankingRestaurantes] = useState([]);
  const [rankingVinos, setRankingVinos] = useState([]);

  useEffect(() => {
    if (user) {
      cargarRanking();
    }
  }, [user]);

  const cargarRanking = async () => {
    const { data: rankingR, error: errorR } = await supabase.rpc(
      'calcular_ranking_personalizado',
      { uid: user.id }
    );
    const { data: rankingV, error: errorV } = await supabase.rpc(
      'calcular_ranking_vinos_personalizado',
      { uid: user.id }
    );

    if (!errorR) setRankingRestaurantes(rankingR || []);
    if (!errorV) setRankingVinos(rankingV || []);
  };

  const renderBloqueCategoria = (categoria, datos) => (
    <div key={categoria} style={{
      background: '#fff',
      padding: '1.5rem',
      borderRadius: '1rem',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <h3 style={{ marginBottom: '1rem', color: '#005a8d' }}>{categoria}</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Media</th>
            <th style={thStyle}>Mi nota</th>
          </tr>
        </thead>
        <tbody>
          {datos
            .sort((a, b) => b.media - a.media)
            .map((fila, i) => (
              <tr key={fila.nombre}>
                <td style={tdStyle}>{i + 1}</td>
                <td style={tdStyle}>{fila.nombre}</td>
                <td style={tdStyle}>{parseFloat(fila.media).toFixed(2)}</td>
                <td style={tdStyle}>{fila.personal ? parseFloat(fila.personal).toFixed(2) : '—'}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundColor: '#d0e4fa',
      padding: '2rem'
    }}>
      <img
        src={logo}
        alt="Logo"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.06,
          width: '60%',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Ranking</h1>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => setTab('restaurantes')}
            style={tab === 'restaurantes' ? activeTabStyle : tabStyle}
          >
            Restaurantes
          </button>
          <button
            onClick={() => setTab('vinos')}
            style={tab === 'vinos' ? activeTabStyle : tabStyle}
          >
            Vinos
          </button>
        </div>

        {tab === 'restaurantes' && (
          <>
            {rankingRestaurantes.length === 0 ? (
              <p style={{ textAlign: 'center' }}>No hay datos disponibles.</p>
            ) : (
              [...new Set(rankingRestaurantes.map((r) => r.categoria))].map((cat) =>
                renderBloqueCategoria(cat, rankingRestaurantes.filter((r) => r.categoria === cat))
              )
            )}
          </>
        )}

        {tab === 'vinos' && (
          <>
            {rankingVinos.length === 0 ? (
              <p style={{ textAlign: 'center' }}>No hay datos de vinos.</p>
            ) : (
              [...new Set(rankingVinos.map((v) => v.categoria))].map((cat) =>
                renderBloqueCategoria(cat, rankingVinos.filter((v) => v.categoria === cat))
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

const tabStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  backgroundColor: '#fff',
  border: '1px solid #aaa',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const activeTabStyle = {
  ...tabStyle,
  backgroundColor: '#005a8d',
  color: '#fff',
  border: '1px solid #005a8d',
};

const thStyle = {
  padding: '0.75rem',
  textAlign: 'left',
  backgroundColor: '#f0f0f0',
  borderBottom: '1px solid #ccc',
};

const tdStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #e0e0e0',
};

export default Ranking;
