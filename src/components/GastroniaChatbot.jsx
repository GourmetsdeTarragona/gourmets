import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import avatarGastronia from '/gastronia-avatar-64x64.png';

function GastroniaChatbot({ modoForzado }) {
  const { user } = useUser();
  const [modo, setModo] = useState('publico');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (modoForzado) {
      setModo(modoForzado);
    } else if (!user) {
      setModo('publico');
    } else if (user.rol === 'socio') {
      setModo('socio');
    } else if (user.rol === 'admin') {
      setModo('admin');
    }
  }, [user, modoForzado]);

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 99 }}>
      <div
        onClick={() => setVisible(!visible)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.2)',
          cursor: 'pointer',
          animation: 'respirar 3s ease-in-out infinite, flotar 5s ease-in-out infinite',
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={avatarGastronia}
          alt="Avatar Gastronia"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
          {modo === 'publico' && (
            <div>
              <h3 style={{ marginTop: 0 }}>✨ Bienvenido a Gourmets Tarragona</h3>
              <p>
                Somos una asociación apasionada por la alta gastronomía. Cada mes visitamos un restaurante
                diferente, valoramos su propuesta y compartimos nuestras experiencias.
              </p>
              <p>
                Gastronia, nuestra musa simbólica, será tu guía si decides unirte a esta experiencia gourmet.
              </p>
              <p>
                ¿Quieres formar parte? Inicia sesión si ya eres socio, o contáctanos para descubrir cómo participar.
              </p>
            </div>
          )}

          {modo === 'socio' && (
            <div>
              <h3 style={{ marginTop: 0 }}>🍷 Hola socio gourmet</h3>
              <p>
                Recuerda valorar tu experiencia tras cada cena. Puedes hacerlo una sola vez, y tus votos ayudan
                a construir nuestro ranking gourmet.
              </p>
              <p>
                Puedes ver tus votaciones pasadas, explorar restaurantes visitados y disfrutar del ranking actualizado.
              </p>
            </div>
          )}

          {modo === 'admin' && (
            <div>
              <h3 style={{ marginTop: 0 }}>🛠️ Bienvenido, administrador</h3>
              <p>
                Aquí podrás gestionar las cenas, los socios asistentes, añadir fotos y configurar las categorías especiales
                de cada restaurante.
              </p>
              <p>
                Gastronia también te recuerda mantener la experiencia tan elegante como deliciosa 🍽️.
              </p>
            </div>
          )}
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
      `}</style>
    </div>
  );
}

export default GastroniaChatbot;
