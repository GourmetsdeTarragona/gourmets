import '../styles.css';

import React from 'react'
import Cabecera from './Cabecera'

export default function PantallaInicio({ onLogin, onInvitado }) {
  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center justify-center space-y-6">
      <Cabecera />
      <h1 className="text-2xl font-bold mt-4">Gourmets Tarragona</h1>
      <div className="space-y-2 w-full max-w-xs">
        <button onClick={onLogin} className="w-full bg-blue-600 text-white py-2 rounded">Iniciar sesión</button>
        <button onClick={onInvitado} className="w-full border border-gray-400 py-2 rounded">Explorar como invitado</button>
      </div>
    </div>
  )
}
