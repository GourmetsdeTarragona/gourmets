// Estructura base de archivos clave para la app Gourmets Tarragona
// Estilo Dami: refinado, centrado, limpio, robusto y con logo presente

// public/logo.png
// Imagen ya ubicada correctamente en public

// src/styles.css
/* Estilos Dami */
.logo {
  width: 180px;
  margin: 20px auto;
  display: block;
  animation: flotar 3s ease-in-out infinite;
}

@keyframes flotar {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  font-family: 'Segoe UI', sans-serif;
}

.page-title {
  font-size: 1.8rem;
  color: #a02040;
  margin-bottom: 20px;
  text-align: center;
}

.section {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

button {
  background-color: #a02040;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}

// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Invitado from './components/Invitado';
import Votacion from './components/Votacion';
import RestauranteDetalle from './components/RestauranteDetalle';
import PanelAdmin from './components/admin/PanelAdmin';
import NuevoSocio from './components/admin/NuevoSocio';
import NuevoRestaurante from './components/admin/NuevoRestaurante';
import CategoriasDinamicas from './components/admin/CategoriasDinamicas';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/invitado" element={<Invitado />} />
      <Route path="/votacion/:id" element={<Votacion />} />
      <Route path="/restaurante/:id" element={<RestauranteDetalle />} />
      <Route path="/admin" element={<PanelAdmin />} />
      <Route path="/admin/nuevo-socio" element={<NuevoSocio />} />
      <Route path="/admin/nuevo-restaurante" element={<NuevoRestaurante />} />
      <Route path="/admin/categorias" element={<CategoriasDinamicas />} />
    </Routes>
  </Router>
);

export default App;

// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://redojogbxdtqxqzxvyhp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
export const supabase = createClient(supabaseUrl, supabaseKey);

// src/components/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2 className="page-title">Bienvenido a Gourmets Tarragona</h2>

      <div className="section">
        <button onClick={() => navigate('/login')}>Iniciar sesión</button>
        <button onClick={() => navigate('/invitado')}>Explorar como invitado</button>
      </div>
    </div>
  );
};

export default Home;

