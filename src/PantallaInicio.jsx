
import React from 'react'
import logo from './logo.png'

export default function PantallaInicio({ onLogin, onInvitado }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center space-y-6 p-4">
      <img src={logo} alt="Logo" className="w-40 h-40 object-contain" />
      <h1 className="text-2xl font-bold">Gourmets Tarragona</h1>
      <div className="space-y-2 w-full max-w-xs">
        <button onClick={onLogin} className="w-full bg-blue-600 text-white py-2 rounded">Iniciar sesión</button>
        <button onClick={onInvitado} className="w-full border border-gray-400 py-2 rounded">Explorar como invitado</button>
      </div>
    </div>
  )
}
