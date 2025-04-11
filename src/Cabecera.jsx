
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Cabecera() {
  const location = useLocation()
  const navigate = useNavigate()

  const esInicio = location.pathname === '/'

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      {!esInicio && (
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 font-semibold"
        >
          ← Atrás
        </button>
      )}
      <div className="flex-grow text-center">
        <img
          src="/logo.png"
          alt="Logo"
          className={`mx-auto ${esInicio ? 'animate-bounce' : ''} w-20 h-20 object-contain`}
        />
      </div>
      {!esInicio && <div style={{ width: '60px' }} />} {/* espacio para equilibrar */}
    </div>
  )
}
