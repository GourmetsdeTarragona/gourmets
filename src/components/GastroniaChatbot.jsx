import { useState } from 'react';

const opciones = [
  '¿Cómo puedo votar un restaurante?',
  '¿Qué representa la asociación?',
  '¿Qué pasa si ya voté?',
  '¿Puedo asistir si no soy socio?',
  '¿Dónde veo el ranking gourmet?'
];

const respuestas = {
  '¿Cómo puedo votar un restaurante?': 'Si estás marcado como asistente, verás el restaurante en tu sección de votación. Puedes valorar del 5 al 10 cada categoría.',
  '¿Qué representa la asociación?': 'Somos Gourmets Tarragona, un grupo que valora con elegancia y rigor experiencias gastronómicas únicas.',
  '¿Qué pasa si ya voté?': 'No puedes volver a votar. Cada socio solo emite una valoración por restaurante.',
  '¿Puedo asistir si no soy socio?': 'Sí, puedes asistir como invitado si un socio te inscribe y hay plazas disponibles.',
  '¿Dónde veo el ranking gourmet?': 'En la sección de ranking puedes ver los restaurantes mejor puntuados, tanto globalmente como por categoría.'
};

export default function GastroniaChatbot() {
  const [chat, setChat] = useState([
    { tipo: 'gastronia', texto: 'Saludos, comensal. ¿Qué deseas saber?' }
  ]);

  const handlePregunta = (pregunta) => {
    setChat([
      { tipo: 'usuario', texto: pregunta },
      { tipo: 'gastronia', texto: respuestas[pregunta] || 'Aún no tengo respuesta para eso.' }
    ]);
  };

  return (
    <div className="max-w-lg mx-auto bg-yellow-50 border border-yellow-300 rounded-xl p-4 mt-4 shadow-2xl backdrop-blur-sm bg-opacity-90">
      <div className="flex items-center gap-3 mb-3">
        <img src="/gastronia-avatar-mini.png" className="w-10 h-10 rounded-full border border-yellow-400" />
        <h2 className="font-semibold text-yellow-900">Gastronia</h2>
      </div>
      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-md text-sm ${
              msg.tipo === 'gastronia'
                ? 'bg-yellow-100 text-yellow-900'
                : 'bg-blue-100 text-blue-900 ml-auto w-fit'
            }`}
          >
            {msg.texto}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {opciones.map((op, i) => (
          <button
            key={i}
            onClick={() => handlePregunta(op)}
            className="text-sm bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-medium px-3 py-1 rounded transition"
          >
            {op}
          </button>
        ))}
      </div>
    </div>
  );
}
