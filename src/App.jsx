
import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Votacion from './Votacion'
import AdminPanel from './AdminPanel'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

const categoriasFijas = ['Comida', 'Servicio', 'Ambiente', 'Presentación', 'Originalidad', 'Relación calidad/precio', 'Postres']

export default function App() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [logueado, setLogueado] = useState(false)
  const [rol, setRol] = useState('')
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [nombreGuardado, setNombreGuardado] = useState(false)
  const [mostrarAdmin, setMostrarAdmin] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('gourmetUser')
    const savedRol = localStorage.getItem('gourmetRol')
    const savedNombre = localStorage.getItem('gourmetNombre')
    if (savedUser) {
      setUsuario(savedUser)
      setRol(savedRol)
      setLogueado(true)
      if (savedNombre) {
        setNombreCompleto(savedNombre)
        setNombreGuardado(true)
      }
    }
  }, [])

  const login = async () => {
    const { data } = await supabase.from('usuarios').select('*').eq('usuario', usuario).eq('clave', password).single()
    if (data) {
      localStorage.setItem('gourmetUser', usuario)
      localStorage.setItem('gourmetRol', data.rol)
      setRol(data.rol)
      setLogueado(true)
    } else {
      alert('Usuario o contraseña incorrectos')
    }
  }

  const guardarNombre = () => {
    if (!nombreCompleto.trim()) return alert('Escribe tu nombre completo')
    localStorage.setItem('gourmetNombre', nombreCompleto)
    setNombreGuardado(true)
  }

  if (!logueado) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2">Iniciar sesión</h2>
        <input placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} className="w-full border p-2 mb-2" />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 mb-4" />
        <button onClick={login} className="bg-blue-600 text-white w-full p-2 rounded">Entrar</button>
      </div>
    )
  }

  if (!nombreGuardado) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-2">Bienvenido</h2>
        <p>Introduce tu nombre completo para usarlo en las votaciones.</p>
        <input type="text" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} placeholder="Tu nombre completo" className="w-full border p-2 my-4" />
        <button onClick={guardarNombre} className="bg-green-600 text-white w-full p-2 rounded">Guardar</button>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gourmets Tarragona</h1>
        <div>
          {rol === 'admin' && (
            <button onClick={() => setMostrarAdmin(!mostrarAdmin)} className="text-sm underline text-blue-700">
              {mostrarAdmin ? 'Volver' : 'Panel admin'}
            </button>
          )}
        </div>
      </div>

      {mostrarAdmin ? (
        <AdminPanel usuario={usuario} />
      ) : (
        <Votacion
          usuario={usuario}
          nombreCompleto={nombreCompleto}
          categoriasFijas={categoriasFijas}
        />
      )}
    </div>
  )
}
