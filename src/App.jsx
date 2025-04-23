import '../styles.css';

import React, { useState } from 'react'
import PantallaInicio from './PantallaInicio'
import Login from './Login'
import Votacion from './Votacion'
import AdminPanel from './AdminPanel'

export default function App() {
  const [pantalla, setPantalla] = useState('inicio')
  const [usuario, setUsuario] = useState(null)
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [rol, setRol] = useState('')

  const entrarComoInvitado = () => {
    setUsuario('invitado')
    setPantalla('votacion')
  }

  if (pantalla === 'inicio') {
    return <PantallaInicio onLogin={() => setPantalla('login')} onInvitado={entrarComoInvitado} />
  }

  if (pantalla === 'login') {
    return <Login onSuccess={(u, nombre, r) => {
      setUsuario(u)
      setNombreCompleto(nombre)
      setRol(r)
      setPantalla('votacion')
    }} />
  }

  if (pantalla === 'votacion') {
    return (
      <div className="p-4 max-w-xl mx-auto">
        {usuario === 'admin' && <AdminPanel usuario={usuario} />}
        {usuario !== 'admin' && <Votacion usuario={usuario} nombreCompleto={nombreCompleto} modoInvitado={usuario === 'invitado'} />}
      </div>
    )
  }

  return <p>Pantalla no encontrada</p>
}
