
import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://redojogbxdtqxqzxvyhp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbmp6bXducnhzc2VlZGJnZXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODIwMDcsImV4cCI6MjA1OTg1ODAwN30.iv49ULwrJzrXHHDEgCbaR6WRfGOoY4GvQStKVvMbBwg'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Login({ onSuccess }) {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    if (!usuario || !clave || !nombre) {
      setError('Rellena todos los campos')
      return
    }

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('usuario', usuario)
      .eq('clave', clave)
      .single()

    if (error || !data) {
      setError('Credenciales incorrectas')
    } else {
      onSuccess(usuario, nombre, data.rol)
    }
  }

  return (
    <div className="p-4 space-y-4 max-w-xs mx-auto">
      <h2 className="text-lg font-bold text-center">Iniciar sesión</h2>
      <input type="text" placeholder="Usuario" value={usuario} onChange={e => setUsuario(e.target.value)} className="w-full border px-2 py-1 rounded" />
      <input type="password" placeholder="Contraseña" value={clave} onChange={e => setClave(e.target.value)} className="w-full border px-2 py-1 rounded" />
      <input type="text" placeholder="Tu nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border px-2 py-1 rounded" />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded">Entrar</button>
    </div>
  )
}
