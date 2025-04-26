import './styles.css';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Cabecera() {
  const location = useLocation()
  const navigate = useNavigate()
  const esInicio = location.pathname === '/'

  return (
    <div className="flex items-center justify-center bg-white shadow-md relative py-4">
      {!esInicio && (
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 text-blue-600 font-semibold"
        >
          ← Atrás
        </button>
      )}
      <img
        src="/logo.png"
        alt="Logo"
        className={`w-24 h-24 object-contain transition-all duration-300 ${
          esInicio ? 'animate-bounce' : ''
        }`}
      />
    </div>
  )
}

