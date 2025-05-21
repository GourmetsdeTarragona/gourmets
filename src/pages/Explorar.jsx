import { useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import GastroniaChatbot from '../components/GastroniaChatbot';

const fondoEvento =
  'https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/imagenes/forti-evento.jpg';

function Explorar() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start bg-cover bg-center relative"
      style={{ backgroundImage: `url(${fondoEvento})` }}
    >
      {/* Filtro oscuro y difuminado para fondo */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Contenido principal centrado */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6 pt-8">
        {/* Contenedor blanco con estilo Dami */}
        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6 text-center">
          {/* Logo */}
          <img src={logo} alt="Logo" className="w-24 mx-auto" />

          {/* Encabezado */}
          <h1 className="text-2xl font-bold text-gray-800">GOURMETS TARRAGONA</h1>
          <p className="text-base text-gray-600 italic">
            Una asociación única donde cada cena es una experiencia
          </p>

          {/* Sección: Quiénes somos */}
          <div className="text-left space-y-1">
            <h2 className="text-lg font-semibold text-gray-800">¿Quiénes somos?</h2>
            <p className="text-sm text-gray-700">
              Somos una comunidad de amantes de la buena mesa que visitan restaurantes selectos,
              votan con criterio y celebran la gastronomía con elegancia y amistad.
            </p>
          </div>

          {/* Sección: Ranking */}
          <div className="text-left space-y-1">
            <h2 className="text-lg font-semibold text-gray-800">Ranking destacado</h2>
            <p className="text-sm text-gray-700">
              Consulta los restaurantes mejor valorados por nuestros socios en cenas inolvidables.
            </p>
            <button
              onClick={() => navigate('/ranking')}
              className="w-full mt-2 bg-blue-800 text-white py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Ver ranking completo
            </button>
          </div>

          {/* Sección: Hazte socio */}
          <div className="text-left space-y-1">
            <h2 className="text-lg font-semibold text-gray-800">¿Te gustaría unirte?</h2>
            <p className="text-sm text-gray-700">
              Si compartes nuestra pasión por la alta cocina y el buen gusto, estás a un paso de formar parte.
            </p>
            <button
              onClick={() => navigate('/contacto')}
              className="w-full mt-2 bg-blue-800 text-white py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Hazte socio
            </button>
          </div>
        </div>
      </div>

      {/* Chatbot Gastronia */}
      <div className="absolute bottom-4 right-4 z-20">
        <GastroniaChatbot modo="invitado" />
      </div>
    </div>
  );
}

export default Explorar;

export default Explorar;


