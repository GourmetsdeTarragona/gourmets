import { useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import GastroniaChatbot from '../components/GastroniaChatbot';

const fondoEvento =  https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/imagenes/forti-evento.jpg';

function Explorar() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${fondoEvento})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />

      <div className="relative z-10 max-w-3xl w-full mx-auto p-6 text-white text-center space-y-6">
        <img src={logo} alt="Logo" className="w-28 mx-auto mb-4 drop-shadow-lg" />

        <h1 className="text-3xl md:text-4xl font-bold">Gourmets Tarragona</h1>
        <p className="text-lg italic">Una asociación única donde cada cena es una experiencia</p>

        <div className="bg-white bg-opacity-10 rounded-2xl p-4 mt-6 space-y-4 text-left backdrop-blur">
          <h2 className="text-2xl font-semibold text-white">¿Quiénes somos?</h2>
          <p>
            Somos una comunidad de amantes de la buena mesa que visitan restaurantes selectos,
            votan con criterio y celebran la gastronomía con elegancia y amistad.
          </p>
        </div>

        <div className="bg-white bg-opacity-10 rounded-2xl p-4 space-y-4 text-left backdrop-blur">
          <h2 className="text-2xl font-semibold text-white">Ranking destacado</h2>
          <p>
            Consulta los restaurantes mejor valorados por nuestros socios en cenas inolvidables.
          </p>
          <button
            onClick={() => navigate('/ranking')}
            className="bg-white text-blue-900 font-semibold py-2 px-4 rounded-xl hover:bg-blue-100 transition"
          >
            Ver ranking completo
          </button>
        </div>

        <div className="bg-white bg-opacity-10 rounded-2xl p-4 space-y-4 text-left backdrop-blur">
          <h2 className="text-2xl font-semibold text-white">¿Te gustaría unirte?</h2>
          <p>
            Si compartes nuestra pasión por la alta cocina y el buen gusto, estás a un paso de formar parte.
          </p>
          <button
            onClick={() => navigate('/contacto')}
            className="bg-white text-blue-900 font-semibold py-2 px-4 rounded-xl hover:bg-blue-100 transition"
          >
            Hazte socio
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20">
        <GastroniaChatbot modo="invitado" />
      </div>
    </div>
  );
}

export default Explorar;

