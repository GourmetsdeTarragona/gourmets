import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import logo from '/logo.png';

function Ranking() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState('general');
  const [rankingGeneral, setRankingGeneral] = useState([]);
  const [rankingCategorias, setRankingCategorias] = useState([]);
  const [rankingVinos, setRankingVinos] = useState([]);

  useEffect(() => {
    if (user) cargarDatos();
  }, [user]);

  const cargarDatos = async () => {
    const { data: general } = await supabase.rpc('calcular_ranking_personalizado', { uid: user.id });
    const { data: vinos } = await supabase.rpc('calcular_ranking_vinos_personalizado', { uid: user.id });
    const { data: categorias } = await supabase.rpc('calcular_ranking_categorias_personalizado', { uid: user.id });

    setRankingGeneral(general || []);
    setRankingCategorias(categorias || []);
    setRankingVinos(vinos || []);
  };

  const renderBloqueCategoria = (titulo, datos) => (
    <div key={titulo} style={bloqueStyle}>
      <h3 style={categoriaTituloStyle}>{titulo}</h3>
      <table style={tablaStyle}>
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
              <tr key={`${fila.restaurante}-${i}`}>
                <td style={tdStyle}>{i + 1}</td>
                <td style={tdStyle}>{fila.restaurante}</td>
                <td style={tdStyle}>{parseFloat(fila.media).toFixed(2)}</td>
                <td style={tdStyle}>{fila.personal ? parseFloat(fila.personal).toFixed(2) : '—'}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  const renderVinos = () => (
    <div style={bloqueStyle}>
      <h3 style={categoriaTituloStyle}>Ranking de vinos</h3>
      <table style={tablaStyle}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Vino</th>
            <th style={thStyle}>Restaurante</th>
            <th style={thStyle}>Media</th>
            <th style={thStyle}>Mi nota</th>
          </tr>
        </thead>
        <tbody>
          {rankingVinos
            .sort((a, b) => b.media - a.media)
            .map((v, i) => (
              <tr key={`${v.nombre}-${i}`}>
                <td style={tdStyle}>{i + 1}</td>
                <td style={tdStyle}>{v.nombre}</td>
                <td style={tdStyle}>{v.restaurante}</td>
                <td style={tdStyle}>{parseFloat(v.media).toFixed(2)}</td>
                <td style={tdStyle}>{v.personal ? parseFloat(v.personal).toFixed(2) : '—'}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={fondoGeneral}>
      <img src={logo} alt="logo" style={marcaAguaStyle} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Ranking de Restaurantes</h1>

        <div style={tabsContainer}>
          <button onClick={() => setTab('general')} style={tab === 'general' ? activeTabStyle : tabStyle}>General</button>
          <button onClick={() => setTab('categorias')} style={tab === 'categorias' ? activeTabStyle : tabStyle}>Por categorías</button>
          <button onClick={() => setTab('vinos')} style={tab === 'vinos' ? activeTabStyle : tabStyle}>Vinos</button>
        </div>

        {tab === 'general' && renderBloqueCategoria('Media Global', rankingGeneral)}

        {tab === 'categorias' &&
          [...new Set(rankingCategorias.map((r) => r.categoria))].map((cat) =>
            renderBloqueCategoria(cat, rankingCategorias.filter((r) => r.categoria === cat))
          )}

        {tab === 'vinos' && renderVinos()}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="button-primary" onClick={() => navigate('/restaurants')}>
            Volver a restaurantes
          </button>
        </div>
      </div>
    </div>
  );
}

const fondoGeneral = {
  position: 'relative',
  minHeight: '100vh',
  backgroundColor: '#d0e4fa',
  padding: '2rem',
};

const marcaAguaStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  opacity: 0.06,
  width: '60%',
  zIndex: 0,
};

const tabsContainer = {
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

const bloqueStyle = {
  background: '#fff',
  padding: '1.5rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  marginBottom: '2rem',
};

const categoriaTituloStyle = {
  marginBottom: '1rem',
  color: '#005a8d',
};

const tablaStyle = {
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
