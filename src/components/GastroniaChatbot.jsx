import { useEffect, useState, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import avatarGastronia from '/gastronia-avatar-64x64.png';
import gastroniaCara from '/gastronia-cara.png';
import gastroniaEntero from '/gastronia-entero.png';
import { useLocation } from 'react-router-dom';

const RESPUESTAS = {
  home: [
    { pregunta: '¿Qué es Gourmets Tarragona?', respuesta: 'Una asociación de apasionados de la gastronomía que votan y premian los mejores restaurantes.' },
    { pregunta: '¿Quién puede formar parte?', respuesta: 'Cualquier persona con gusto refinado puede unirse, mediante invitación de un socio activo.' },
    { pregunta: '¿Qué funciones tiene esta app?', respuesta: 'Aquí puedes votar restaurantes, consultar rankings y disfrutar del recorrido gastronómico.' },
    { pregunta: '¿Quién es Gastronia?', respuesta: 'Soy la diosa protectora de esta experiencia culinaria. Te guiaré siempre que lo necesites.' }
  ],
  restaurants: [
    { pregunta: '¿Cómo sé si puedo votar un restaurante?', respuesta: 'Si estás marcado como asistente, verás el botón “Votar” activo en ese restaurante.' },
    { pregunta: '¿Por qué no puedo votar en algunos?', respuesta: 'Solo pueden votar los socios que hayan asistido a la cena. Es una regla básica de justicia.' },
    { pregunta: '¿Qué indican los colores laterales?', respuesta: 'Verde: ya votaste. Amarillo: puedes votar. Gris: no asististe, no puedes votar.' },
    { pregunta: '¿Dónde están las fotos y menús?', respuesta: 'Cada restaurante muestra su carta, minuta y fotos si están disponibles.' }
  ],
  voting: [
    { pregunta: '¿Qué categorías tengo que votar?', respuesta: 'Cocina, servicio, presentación, originalidad, calidad-precio, ambiente y cantidad. A veces hay categoría de vinos.' },
    { pregunta: '¿Puedo dejar alguna sin votar?', respuesta: 'No. Debes valorar todas las categorías para enviar tu votación.' },
    { pregunta: '¿Qué valores puedo dar?', respuesta: 'De 1 a 5 estrellas por categoría. Sé justo pero sincero.' },
    { pregunta: '¿Puedo cambiar mi voto después?', respuesta: 'No. Solo puedes votar una vez por restaurante, sin posibilidad de modificar.' }
  ],
  ranking: [
    { pregunta: '¿Qué es el ranking general?', respuesta: 'Es la media global de cada restaurante según todos los socios que votaron.' },
    { pregunta: '¿Qué es el ranking por categorías?', respuesta: 'Se muestra qué restaurante destacó más en cada aspecto: cocina, ambiente, etc.' },
    { pregunta: '¿Qué es el ranking de vinos?', respuesta: 'Recoge las puntuaciones de las categorías extra relacionadas con vinos servidos.' },
    { pregunta: '¿Puedo ver mis puntuaciones?', respuesta: 'Sí. Verás tus notas personales junto a la media general para comparar.' }
  ]
};

function GastroniaChatbot({ modoForzado }) {
  const { user } = useUser();
  const location = useLocation();
  const [modo, setModo] = useState('publico');
  const [visible, setVisible] = useState(false);
  const [mostrarGaleria, setMostrarGaleria] = useState(false);
  const [galeriaIndex, setGaleriaIndex] = useState(0);
  const touchStartY = useRef(null);
  const [chat, setChat] = useState([]);

  const ruta = location.pathname.includes('ranking')
    ? 'ranking'
    : location.pathname.includes('vote')
    ? 'voting'
    : location.pathname.includes('restaurants')
    ? 'restaurants'
    : 'home';

  const preguntas = RESPUESTAS[ruta];

  useEffect(() => {
    if (modoForzado) {
      setModo(modoForzado);
    } else if (!user || !user.id) {
  setModo('publico');
}
;
    } else if (user.rol === 'socio') {
      setModo('socio');
    } else if (user.rol === 'admin') {
      setModo('admin');
    }
  }, [user, modoForzado]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        setMostrarGaleria(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let interval;
    if (mostrarGaleria) {
      interval = setInterval(() => {
        setGaleriaIndex((prev) => (prev + 1) % 2);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [mostrarGaleria]);

  useEffect(() => {
    let index = 0;
    const texto = 'Gastronia os escucha…';
    const interval = setInterval(() => {
      setChat([{ tipo: 'gastronia', texto: texto.slice(0, index + 1) }]);
      index++;
      if (index === texto.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [ruta]);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    if (touchStartY.current - endY > 40) {
      setMostrarGaleria(true);
    }
  };

  const handlePregunta = (pregunta) => {
    const respuesta = preguntas.find((p) => p.pregunta === pregunta)?.respuesta || 'Aún no tengo respuesta para eso.';
    setChat([
      { tipo: 'usuario', texto: pregunta },
      { tipo: 'gastronia', texto: respuesta }
    ]);
  };

  const imagenes = [gastroniaCara, gastroniaEntero];

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 99 }}>
      <div
        onClick={() => setVisible(!visible)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          overflow: 'hidden',
          cursor: 'pointer',
          animation: 'respirar 3s ease-in-out infinite, flotar 5s ease-in-out infinite, resplandor 4s ease-in-out infinite',
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: '0 0 12px rgba(255, 255, 255, 0.3)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            boxShadow: '0 0 25px 5px rgba(255, 255, 255, 0.15)',
            zIndex: 0,
          }}
        ></div>
        <img
          src={avatarGastronia}
          alt="Avatar Gastronia"
          style={{ width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
        />
      </div>

      {visible && (
        <div
          style={{
            marginTop: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '1rem',
            padding: '1.2rem',
            maxWidth: '320px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {chat.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.tipo === 'usuario' ? 'flex-end' : 'flex-start',
                  backgroundColor: '#fff9e6',
                  padding: '0.6rem 1rem',
                  borderRadius: '1rem',
                  maxWidth: '100%',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  fontSize: '0.9rem',
                }}
              >
                {msg.texto}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
            {preguntas.map((item, i) => (
              <button
                key={i}
                onClick={() => handlePregunta(item.pregunta)}
                style={{
                  fontSize: '0.85rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '0.6rem',
                  backgroundColor: '#fff1c4',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                {item.pregunta}
              </button>
            ))}
          </div>
        </div>
      )}

      {mostrarGaleria && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            animation: 'desvanecer 1s ease-in-out',
          }}
          onClick={() => setMostrarGaleria(false)}
        >
          <img
            src={imagenes[galeriaIndex]}
            alt="Gastronia Vision"
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              transition: 'opacity 1s ease-in-out',
              opacity: 1,
              borderRadius: '1rem',
              boxShadow: '0 0 40px rgba(255,255,255,0.25)',
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes respirar {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes flotar {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes resplandor {
          0%, 100% { box-shadow: 0 0 12px rgba(255,255,255,0.2); }
          50% { box-shadow: 0 0 20px rgba(255,255,255,0.6); }
        }

        @keyframes desvanecer {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default GastroniaChatbot;

