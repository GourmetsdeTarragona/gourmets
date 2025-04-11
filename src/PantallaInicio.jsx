
import React from 'react'

export default function PantallaInicio({ onLogin, onInvitado }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4 space-y-6">
      <img src="/logo.png" alt="Logo" className="w-40 h-40 object-contain" />
      <h1 className="text-2xl font-bold">Gourmets Tarragona</h1>
      <button onClick={onLogin} className="bg-blue-600 text-white py-2 px-4 rounded">Iniciar sesión</button>
      <button onClick={onInvitado} className="border border-gray-600 py-2 px-4 rounded">Explorar como invitado</button>
    </div>
  )
}
