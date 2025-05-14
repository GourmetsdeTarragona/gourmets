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
    const { data: rankingR } = await supabase.rpc('calcular_ranking_personalizado', { uid: user.id });
    const { data: rankingV } = await supabase.rpc('calcular_ranking_vinos_personalizado', { uid: user.id });

    setRankingRestaurantes(rankingR || []);
    setRankingVinos(rankingV || []);
  };

  const renderCategoria = (categoria, datos) => (
    <div key={categoria} style={categoriaBlockStyle}>
      <h3 style={categoriaTitleStyle}>{categoria}</h3>
      <table style={tableStyle}>
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
              <tr key={`${fila.nombre}-${fila.media}`}>
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
    <div style={backgroundStyle}>
      <img src={logo} alt="Marca" style={logoStyle} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={tituloStyle}>Ranking</h1>

        <div style={tabContainerStyle}>
          <button onClick={() => setTab('restaurantes')} style={tab === 'restaurantes' ? activeTab : tabBase}>
            Restaurantes
          </button>
          <button onClick={() => setTab('vinos')} style={tab === 'vinos' ? activeTab : tabBase}>
            Vinos
          </button>
        </div>

        {tab === 'restaurantes' &&
          (rankingRestaurantes.length === 0 ? (
            <p style={noDataStyle}>No hay datos disponibles.</p>
          ) : (
            [...new Set(rankingRestaurantes.map((r) => r.categoria))].map((cat) =>
              renderCategoria(cat, rankingRestaurantes.filter((r) => r.categoria === cat))
            )
          ))}

        {tab === 'vinos' &&
          (rankingVinos.length === 0 ? (
            <p style={noDataStyle}>No hay datos disponibles.</p>
          ) : (
            [...new Set(rankingVinos.map((v) => v.categoria))].map((cat) =>
              renderCategoria(cat, rankingVinos.filter((v) => v.categoria === cat))
            )
          ))}
      </div>
    </div>
  );
}

const backgroundStyle = {
  position: 'relative',
  minHeight: '100vh',
  backgroundColor: '#d0e4fa',
  padding: '2rem',
};

const logoStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  opacity: 0.06,
  width: '60%',
  zIndex: 0,
};

const tituloStyle = {
  textAlign: 'center',
  marginBottom: '2rem',
};

const tabContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginBottom: '2rem',
};

const tabBase = {
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  backgroundColor: '#fff',
  border: '1px solid #aaa',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const activeTab = {
  ...tabBase,
  backgroundColor: '#005a8d',
  color: '#fff',
  border: '1px solid #005a8d',
};

const noDataStyle = {
  textAlign: 'center',
  fontSize: '1rem',
};

const categoriaBlockStyle = {
  background: '#fff',
  padding: '1.5rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  marginBottom: '2rem',
};

const categoriaTitleStyle = {
  marginBottom: '1rem',
  color: '#005a8d',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
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
