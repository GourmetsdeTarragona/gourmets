import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';
import ConfirmationMessage from '../components/ConfirmationMessage';
import logoMarcaAgua from '/logo.png';

function RestaurantVoting() {
  const { restaurantId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [puntuaciones, setPuntuaciones] = useState({});
  const [yaVotado, setYaVotado] = useState(false);
  const [asiste, setAsiste] = useState(false);
  const [confirmacion, setConfirmacion] = useState('');
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    if (!user) return;

    const cargarDatos = async () => {
      const { data: restaurante } = await supabase
        .from('restaurantes')
        .select('id, nombre, asistentes, carta_url, minuta_url')
        .eq('id', restaurantId)
        .single();

      if (!restaurante) return;

      setRestaurant(restaurante);
      setAsiste(restaurante.asistentes?.includes(user.id));

      const { data: fijas } = await supabase.from('categorias_fijas').select('id, nombre_categoria');
      const { data: extras } = await supabase
        .from('categorias_extra')
        .select('id, nombre_extra')
        .eq('restaurante_id', restaurantId);

      const { data: votoExistente } = await supabase
        .from('votaciones')
        .select('id')
        .eq('usuario_id', user.id)
        .eq('restaurante_id', restaurantId)
        .maybeSingle();

      if (votoExistente) setYaVotado(true);

      const todas = [
        ...fijas.map((cat) => ({ ...cat, tipo: 'fija', nombre: cat.nombre_categoria })),
        ...extras.map((cat) => ({ ...cat, tipo: 'extra', nombre: cat.nombre_extra }))
      ];
      setCategorias(todas);

      const { data: fotos } = await supabase.storage.from('imagenes').list(`${restaurantId}`);
      setImagenes(fotos || []);
    };

    cargarDatos();
  }, [restaurantId, user]);

  const handleVoteChange = (categoriaId, valor) => {
    setPuntuaciones((prev) => ({ ...prev, [categoriaId]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const faltan = categorias.some((cat) => !puntuaciones[cat.id]);
    if (faltan) {
      setConfirmacion('Debes puntuar todas las categorías.');
      return;
    }

    const votos = categorias.map((cat) => ({
      usuario_id: user.id,
      restaurante_id: restaurantId,
      categoria_fija_id: cat.tipo === 'fija' ? cat.id : null,
      categoria_extra_id: cat.tipo === 'extra' ? cat.id : null,
      valor: puntuaciones[cat.id],
    }));

    const { error } = await supabase.from('votaciones').insert(votos);

    if (!error) {
      setConfirmacion('¡Gracias por votar! Redirigiendo al ranking...');
      setTimeout(() => navigate('/ranking'), 2000);
    } else {
      setConfirmacion('Ya has votado o ha ocurrido un error al guardar los votos.');
    }
  };

  if (!restaurant) return <p className="container">Cargando datos del restaurante...</p>;
  if (!asiste) return <p className="container">Solo los asistentes pueden votar en este restaurante.</p>;
  if (yaVotado) return <p className="container">Ya has votado. Puedes ver los resultados en el ranking.</p>;

  return (
    <div className="min-h-screen bg-[#d0e4fa] flex items-center justify-center relative px-4 py-8">
      <img
        src={logoMarcaAgua}
        alt="Fondo logo"
        className="absolute inset-0 mx-auto my-auto w-[60%] opacity-10 object-contain pointer-events-none"
      />

      <div className="relative bg-white bg-opacity-95 rounded-2xl p-6 shadow-xl max-w-2xl w-full z-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">Votación: {restaurant.nombre}</h2>

        <div className="flex flex-wrap gap-4 justify-center mb-6">
          {restaurant.carta_url && (
            <a
              href={restaurant.carta_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700"
            >
              Ver Carta
            </a>
          )}
          {restaurant.minuta_url && (
            <a
              href={restaurant.minuta_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700"
            >
              Ver Minuta
            </a>
          )}
        </div>

        {imagenes.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {imagenes.map((img) => (
              <img
                key={img.name}
                src={`https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/${restaurantId}/${img.name}`}
                alt={img.name}
                className="w-28 h-20 object-cover rounded-md shadow-sm"
              />
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {categorias.map((categoria) => (
            <div key={categoria.id} className="mb-8">
              <h4 className="text-lg font-medium mb-2 text-center">{categoria.nombre}</h4>
              <div className="flex justify-center gap-2">
                {[5, 6, 7, 8, 9, 10].map((valor) => (
                  <label key={valor} className="text-center cursor-pointer">
                    <input
                      type="radio"
                      name={`categoria-${categoria.id}`}
                      value={valor}
                      checked={puntuaciones[categoria.id] === valor}
                      onChange={() => handleVoteChange(categoria.id, valor)}
                      className="hidden"
                    />
                    <span
                      className="text-3xl"
                      style={{ color: puntuaciones[categoria.id] >= valor ? '#FFD700' : '#ccc' }}
                    >
                      ★
                    </span>
                    <div className="text-sm">{valor}</div>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full mt-4 py-2 bg-green-600 text-white font-semibold rounded-xl shadow hover:bg-green-700"
          >
            Enviar votación
          </button>
        </form>

        {confirmacion && <ConfirmationMessage message={confirmacion} />}
      </div>
    </div>
  );
}

export default RestaurantVoting;


