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
      {/* Capa oscura para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pt-8 pb-24 space-y-6 text-white text-center">

        {/* Logo centrado */}
        <img src={logo} alt="Logo" className="w-24 mx-auto drop-shadow-lg" />

        {/* Título y subtítulo */}
        <h1 className="text-3xl font-bold mt-2">GOURMETS TARRAGONA</h1>
        <p className="text-lg italic">Una asociación única donde cada cena es una experiencia</p>

        {/* Bloque: Quiénes somos */}
        <div className="bg-white bg-opacity-90 text-black rounded-2xl p-5 shadow-lg text-left">
          <h2 className="text-xl font-semibold mb-2">¿Quiénes somos?</h2>
          <p>
            Somos una comunidad de amantes de la buena mesa que visitan restaurantes selectos,
            votan con criterio y celebran la gastronomía con elegancia y amistad.
          </p>
        </div>

        {/* Bloque: Ranking */}
        <div className="bg-white bg-opacity-90 text-black rounded-2xl p-5 shadow-lg text-left">
          <h2 className="text-xl font-semibold mb-2">Ranking destacado</h2>
          <p>
            Consulta los restaurantes mejor valorados por nuestros socios en cenas inolvidables.
          </p>
          <button
            onClick={() => navigate('/ranking')}
            className="mt-3 bg-blue-800 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
          >
            Ver ranking completo
          </button>
        </div>

        {/* Bloque: Unirse */}
        <div className="bg-white bg-opacity-90 text-black rounded-2xl p-5 shadow-lg text-left">
          <h2 className="text-xl font-semibold mb-2">¿Te gustaría unirte?</h2>
          <p>
            Si compartes nuestra pasión por la alta cocina y el buen gusto, estás a un paso de formar parte.
          </p>
          <button
            onClick={() => navigate('/contacto')}
            className="mt-3 bg-blue-800 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
          >
            Hazte socio
          </button>
        </div>
      </div>

      {/* Chatbot flotante */}
      <div className="absolute bottom-4 right-4 z-20">
        <GastroniaChatbot modo="invitado" />
      </div>
    </div>
  );
}

export default Explorar;


