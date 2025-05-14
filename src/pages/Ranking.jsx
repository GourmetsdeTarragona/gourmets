import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';
import logo from '/logo.png';
import { useNavigate } from 'react-router-dom';

function Ranking() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState('general');
  const [rankingGeneral, setRankingGeneral] = useState([]);
  const [rankingPorCategoria, setRankingPorCategoria] = useState([]);
  const [rankingVinos, setRankingVinos] = useState([]);

  useEffect(() => {
    if (user) cargarDatos();
  }, [user]);

  const cargarDatos = async () => {
    const { data: general } = await supabase.rpc('calcular_ranking_global');
    const { data: categorias } = await supabase.rpc('calcular_ranking_personalizado', { uid: user.id });
    const { data: vinos } = await supabase.rpc('calcular_ranking_vinos_personalizado', { uid: user.id });

    if (general) setRankingGeneral(general);
    if (categorias) setRankingPorCategoria(categorias);
    if (vinos) setRankingVinos(vinos);
  };

  const renderGeneral = () => (
    <div style={sectionStyle}>
      <h2 style={{ marginBottom: '1rem' }}>Ranking global por restaurante</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Restaurante</th>
            <th style={thStyle}>Nota media</th>
          </tr>
        </thead>
        <tbody>
          {[...rankingGeneral]
            .sort((a, b) => b.promedio - a.promedio)
            .map((r, i) => (
              <tr key={r.nombre}>
                <td style={tdStyle}>{i + 1}</td>
                <td style={tdStyle}>{r.nombre}</td>
                <td style={tdStyle}>{parseFloat(r.promedio).toFixed(2)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  const renderBloqueCategoria = (categoria, datos) => (
    <div key={categoria} style={sectionStyle}>
      <h3 style={{ marginBottom: '1rem', color: '#005a8d' }}>{categoria}</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Restaurante</th>
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
    <div style={pageStyle}>
      <img src={logo} alt="Logo" style={logoStyle} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Ranking</h1>

        <div style={tabsContainerStyle}>
          <button onClick={() => setTab('general')} style={tab === 'general' ? activeTabStyle : tabStyle}>
            General
          </button>
          <button onClick={() => setTab('categorias')} style={tab === 'categorias' ? activeTabStyle : tabStyle}>
            Por categorías
          </button>
          <button onClick={() => setTab('vinos')} style={tab === 'vinos' ? activeTabStyle : tabStyle}>
            Vinos
          </button>
        </div>

        {tab === 'general' && (rankingGeneral.length > 0 ? renderGeneral() : <p>No hay datos disponibles.</p>)}

        {tab === 'categorias' &&
          (rankingPorCategoria.length > 0 ? (
            [...new Set(rankingPorCategoria.map((r) => r.categoria))].map((cat) =>
              renderBloqueCategoria(cat, rankingPorCategoria.filter((r) => r.categoria === cat))
            )
          ) : (
            <p>No hay datos disponibles.</p>
          ))}

        {tab === 'vinos' &&
          (rankingVinos.length > 0 ? (
            [...new Set(rankingVinos.map((v) => v.categoria))].map((cat) =>
              renderBloqueCategoria(cat, rankingVinos.filter((v) => v.categoria === cat))
            )
          ) : (
            <p>No hay datos disponibles.</p>
          ))}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={() => navigate('/restaurants')} className="button-primary">
            Volver a restaurantes
          </button>
        </div>
      </div>
    </div>
  );
}

// Estilos
const pageStyle = {
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
  opacity: 0.05,
  width: '60%',
  zIndex: 0,
};

const tabsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginBottom: '2rem',
};

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

const sectionStyle = {
  background: '#fff',
  padding: '1.5rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  marginBottom: '2rem',
};

export default Ranking;
