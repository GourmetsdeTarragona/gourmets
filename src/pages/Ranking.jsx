import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';
import logo from '/logo.png';
import { useNavigate } from 'react-router-dom';

function Ranking() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState('general');
  const [general, setGeneral] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [vinos, setVinos] = useState([]);

  useEffect(() => {
    if (user) cargarDatos();
  }, [user]);

  const cargarDatos = async () => {
    const { data: gen } = await supabase.rpc('calcular_ranking_general_personalizado', { uid: user.id });
    const { data: cat } = await supabase.rpc('calcular_ranking_personalizado', { uid: user.id });
    const { data: vin } = await supabase.rpc('calcular_ranking_vinos_personalizado', { uid: user.id });

    setGeneral(gen || []);
    setCategorias(cat || []);
    setVinos(vin || []);
  };

  const renderTabla = (datos, columnas) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
      <thead>
        <tr>
          {columnas.map((col, idx) => (
            <th key={idx} style={thStyle}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {datos.map((item, i) => (
          <tr key={i}>
            <td style={tdStyle}>{i + 1}</td>
            <td style={tdStyle}>{item.nombre || item.nombre_restaurante}</td>
            {item.nombre_vino && <td style={tdStyle}>{item.nombre_vino}</td>}
            <td style={tdStyle}>{parseFloat(item.media).toFixed(2)}</td>
            <td style={tdStyle}>{item.personal ? parseFloat(item.personal).toFixed(2) : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderRankingCategorias = () => {
    const agrupadas = {};
    categorias.forEach((item) => {
      if (!agrupadas[item.categoria]) agrupadas[item.categoria] = [];
      agrupadas[item.categoria].push(item);
    });

    return Object.entries(agrupadas).map(([nombre, datos]) => (
      <div key={nombre} style={bloqueStyle}>
        <h3 style={tituloCat}>{nombre}</h3>
        {renderTabla(datos.sort((a, b) => b.media - a.media), ['#', 'Restaurante', 'Media', 'Mi nota'])}
      </div>
    ));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#d0e4fa', padding: '2rem', position: 'relative' }}>
      <img src={logo} alt="logo" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.06,
        width: '60%',
        zIndex: 0
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Ranking</h1>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => setTab('general')} style={tab === 'general' ? activeTab : tabStyle}>🏆 General</button>
          <button onClick={() => setTab('categorias')} style={tab === 'categorias' ? activeTab : tabStyle}>📊 Por Categorías</button>
          <button onClick={() => setTab('vinos')} style={tab === 'vinos' ? activeTab : tabStyle}>🍷 Vinos</button>
        </div>

        {tab === 'general' && (
          general.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No hay datos de ranking general.</p>
          ) : (
            renderTabla(general.sort((a, b) => b.media - a.media), ['#', 'Restaurante', 'Media', 'Mi nota'])
          )
        )}

        {tab === 'categorias' && (
          categorias.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No hay datos de categorías.</p>
          ) : renderRankingCategorias()
        )}

        {tab === 'vinos' && (
          vinos.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No hay datos de vinos.</p>
          ) : (
            renderTabla(vinos, ['#', 'Restaurante', 'Vino', 'Media', 'Mi nota'])
          )
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="button-primary" onClick={() => navigate('/restaurants')}>
            Volver a restaurantes
          </button>
        </div>
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

const activeTab = {
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

const bloqueStyle = {
  background: '#fff',
  padding: '1.5rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  marginBottom: '2rem',
};

const tituloCat = {
  marginBottom: '1rem',
  color: '#005a8d',
};

export default Ranking;
