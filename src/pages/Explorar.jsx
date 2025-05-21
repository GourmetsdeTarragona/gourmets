import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import GastroniaChatbot from '../components/GastroniaChatbot';

function Explorar() {
  const [top3, setTop3] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarTop = async () => {
      const { data, error } = await supabase.rpc('calcular_ranking_general');
      if (!error) setTop3(data);
    };

    cargarTop();
  }, []);

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-start p-4">
      <img src={logo} alt="Logo" className="w-32 mt-4 mb-2" />

      <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-center mb-4">Bienvenido a Gourmets Tarragona</h1>
        <p className="text-center text-gray-700 mb-6">
          Esta es una comunidad privada de amantes de la gastronomía. Aquí encontrarás los restaurantes visitados, los vinos catados y las valoraciones gourmet.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition text-sm"
          >
            Ver cenas de los gourmets
          </button>
          <button
            onClick={() => window.open('mailto:info@gourmetstarragona.org?subject=Solicitud para ser socio')}
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition text-sm"
          >
            Enviar solicitud para ser socio
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white/80 rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">🏆 Top 3 Restaurantes</h2>
        <ol className="list-decimal pl-6 space-y-2 text-gray-800">
          {top3.map((r, i) => (
            <li key={r.id}>
              <strong>{r.nombre}</strong> – nota media: <strong>{r.nota_media.toFixed(2)}</strong>
            </li>
          ))}
        </ol>
      </div>

      <GastroniaChatbot modo="invitado" />
    </div>
  );
}

export default Explorar;





