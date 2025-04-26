import './styles.css';

import React, { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Cabecera from './Cabecera'

export default function Votacion({ usuario, nombreCompleto, modoInvitado }) {
  const [restaurantes, setRestaurantes] = useState([])

  useEffect(() => {
    if (modoInvitado) {
      supabase
        .from('restaurantes')
        .select('*')
        .then(({ data, error }) => {
          if (!error) setRestaurantes(data)
        })
    } else {
      supabase
        .from('asistencias')
        .select('restaurante')
        .eq('usuario', usuario)
        .then(async ({ data }) => {
          const nombres = data.map(r => r.restaurante)
          const { data: restaurantes } = await supabase
            .from('restaurantes')
            .select('*')
            .in('nombre', nombres)
          setRestaurantes(restaurantes)
        })
    }
  }, [])

  return (
    <div className="space-y-4">
      <Cabecera />
      <h2 className="text-xl font-bold text-center mt-4">
        {modoInvitado ? 'Explorando restaurantes' : `Hola, ${nombreCompleto}`}
      </h2>

      {restaurantes.length === 0 && (
        <p className="text-center text-gray-600">No hay restaurantes disponibles.</p>
      )}

      {restaurantes.map((r) => (
        <div key={r.id} className="border p-4 rounded shadow">
          <h3 className="text-lg font-semibold">{r.nombre}</h3>
          <p>Categorías extra: {(r.categorias_extra || []).join(', ')}</p>
          {modoInvitado && <p className="text-sm text-gray-500 mt-2">Modo solo lectura</p>}
        </div>
      ))}
    </div>
  )
}
