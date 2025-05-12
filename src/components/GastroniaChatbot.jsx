import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';

function GastroniaChatbot() {
  const { user } = useUser();
  const [modo, setModo] = useState('publico');

  useEffect(() => {
    if (!user) {
      setModo('publico');
    } else if (user.rol === 'socio') {
      setModo('socio');
    } else if (user.rol === 'admin') {
      setModo('admin');
    }
  }, [user]);

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderRadius: '1rem',
      padding: '1.5rem',
      textAlign: 'left',
      boxShadow: '0 0 12px rgba(0,0,0,0.1)',
    }}>
      {modo === 'publico' && (
        <div>
          <h3>✨ Bienvenido a Gourmets Tarragona</h3>
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
          <h3>🍷 Hola socio gourmet</h3>
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
          <h3>🛠️ Bienvenido, administrador</h3>
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
  );
}

export default GastroniaChatbot;
