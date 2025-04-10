
import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

export default function Votacion({ usuario, nombreCompleto, categoriasFijas }) {
  const [restauranteActual, setRestauranteActual] = useState(null)
  const [valores, setValores] = useState({})
  const [comentario, setComentario] = useState('')
  const [yaVotado, setYaVotado] = useState(false)
  const [permitidoVotar, setPermitidoVotar] = useState(false)
  const [categoriasExtra, setCategoriasExtra] = useState([])

  useEffect(() => {
    async function cargarRestauranteYPermisos() {
      const { data: restaurantes } = await supabase.from('restaurantes').select('*').order('id', { ascending: false }).limit(1)
      const restaurante = restaurantes?.[0]
      setRestauranteActual(restaurante)

      const { data: votoExistente } = await supabase.from('votaciones')
        .select('*')
        .eq('usuario', nombreCompleto)
        .eq('restaurante', restaurante?.nombre)
        .single()

      setYaVotado(!!votoExistente)

      const { data: asistencia } = await supabase.from('asistencias')
        .select('*')
        .eq('usuario', usuario)
        .eq('restaurante', restaurante?.nombre)
        .single()

      setPermitidoVotar(!!asistencia)
      setCategoriasExtra(restaurante?.categorias_extra || [])
    }

    cargarRestauranteYPermisos()
  }, [usuario, nombreCompleto])

  const enviarVoto = async () => {
    const nuevaVotacion = {
      usuario: nombreCompleto,
      restaurante: restauranteActual.nombre,
      fecha: new Date().toISOString(),
      comentario,
      ...categoriasFijas.reduce((acc, cat) => ({ ...acc, [cat.toLowerCase().replace(/ /g, '_')]: valores[cat] || 0 }), {}),
      ...categoriasExtra.reduce((acc, cat) => ({ ...acc, [cat.toLowerCase().replace(/ /g, '_')]: valores[cat] || 0 }), {})
    }

    const { error } = await supabase.from('votaciones').insert(nuevaVotacion)
    if (!error) {
      alert('Voto guardado. ¡Gracias!')
      setYaVotado(true)
    } else {
      alert('Error al guardar voto.')
    }
  }

  if (!restauranteActual) return <p>Cargando restaurante...</p>
  if (!permitidoVotar) return <p>No estás marcado como asistente a {restauranteActual.nombre}.</p>
  if (yaVotado) return <p>Ya has votado por {restauranteActual.nombre}. ¡Gracias!</p>

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Votación: {restauranteActual.nombre}</h2>

      {[...categoriasFijas, ...categoriasExtra].map(cat => (
        <div key={cat}>
          <label className="block font-medium mb-1">{cat}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={valores[cat] || 3}
            onChange={(e) => setValores({ ...valores, [cat]: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-gray-600">Valor: {valores[cat] || 3}</div>
        </div>
      ))}

      <textarea
        placeholder="Comentario (opcional)"
        className="w-full border p-2 rounded"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />

      <button onClick={enviarVoto} className="bg-green-600 text-white p-2 w-full rounded">Enviar voto</button>
    </div>
  )
}
