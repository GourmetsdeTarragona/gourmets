import './styles.css';

import React, { useState } from 'react'
import { supabase } from './supabase'
import Cabecera from './Cabecera'

export default function Login({ onSuccess }) {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    setError(null)

    if (!usuario.trim() || !clave.trim() || !nombre.trim()) {
      setError('Rellena todos los campos correctamente')
      return
    }

    const { data, error: loginError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('usuario', usuario.trim())
      .eq('clave', clave.trim())
      .single()

    if (loginError || !data) {
      console.error('Error de login:', loginError)
      setError('Credenciales incorrectas o usuario no existe')
    } else {
      onSuccess(usuario.trim(), nombre.trim(), data.rol)
    }
  }

  return (
    <div className="min-h-screen bg-white p-4 space-y-4">
      <Cabecera />
      <div className="max-w-xs mx-auto space-y-4 mt-6">
        <h2 className="text-lg font-bold text-center">Iniciar sesión</h2>
        <input type="text" placeholder="Usuario" value={usuario} onChange={e => setUsuario(e.target.value)} className="w-full border px-2 py-1 rounded" />
        <input type="password" placeholder="Contraseña" value={clave} onChange={e => setClave(e.target.value)} className="w-full border px-2 py-1 rounded" />
        <input type="text" placeholder="Tu nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border px-2 py-1 rounded" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded">Entrar</button>
      </div>
    </div>
  )
}
