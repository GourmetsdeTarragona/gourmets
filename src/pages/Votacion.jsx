import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function Votacion() {
  const { restauranteId } = useParams();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [nombreRestaurante, setNombreRestaurante] = useState("");
  const [valores, setValores] = useState({});
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [asistente, setAsistente] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/");

      setUsuario(user);

      // Verificar si ya votó
      const { data: votoExistente } = await supabase
        .from("votaciones")
        .select("*")
        .eq("restaurante_id", restauranteId)
        .eq("usuario_id", user.id)
        .maybeSingle();

      if (votoExistente) {
        toast.warning("Ya has votado este restaurante.");
        return navigate(`/restaurante/${restauranteId}`);
      }

      // Verificar si fue asistente
      const { data: asistencia } = await supabase
        .from("asistencias")
        .select("*")
        .eq("restaurante_id", restauranteId)
        .eq("usuario_id", user.id)
        .maybeSingle();

      if (!asistencia) {
        toast.error("No estás autorizado a votar este restaurante.");
        return navigate("/");
      }

      setAsistente(true);

      // Obtener nombre del restaurante
      const { data: rest } = await supabase
        .from("restaurantes")
        .select("nombre")
        .eq("id", restauranteId)
        .single();

      setNombreRestaurante(rest?.nombre || "");

      // Obtener categorías (fijas + extra)
      const { data: cats } = await supabase
        .from("categorias")
        .select("*")
        .eq("restaurante_id", restauranteId);

      setCategorias(cats);
      setLoading(false);
    }

    cargarDatos();
  }, [restauranteId, navigate]);

  const actualizarValor = (categoria_id, valor) => {
    setValores(prev => ({ ...prev, [categoria_id]: valor }));
  };

  const enviarVoto = async () => {
    if (categorias.some(cat => !valores[cat.id])) {
      toast.error("Debes puntuar todas las categorías.");
      return;
    }

    const votos = categorias.map(cat => ({
      restaurante_id: restauranteId,
      usuario_id: usuario.id,
      categoria_id: cat.id,
      puntuacion: valores[cat.id]
    }));

    const { error } = await supabase.from("votaciones").insert(votos);
    if (error) {
      toast.error("Error al guardar tu voto.");
      return;
    }

    // (Opcional) insertar en votos_emitidos
    await supabase.from("votos_emitidos").insert({
      restaurante_id: restauranteId,
      usuario_id: usuario.id
    });

    toast.success("Voto registrado correctamente.");
    navigate(`/restaurante/${restauranteId}`);
  };

  if (loading || !asistente) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Votación: {nombreRestaurante}</h1>
      <div className="space-y-4">
        {categorias.map(cat => (
          <Card key={cat.id}>
            <CardContent className="p-4">
              <label className="font-semibold block mb-2">{cat.nombre}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={valores[cat.id] || 5}
                onChange={(e) => actualizarValor(cat.id, parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-center mt-2">Puntuación: {valores[cat.id] || 5}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Button onClick={enviarVoto} className="text-lg px-6 py-2 rounded-2xl shadow">
          Enviar voto
        </Button>
      </div>
    </div>
  );
}
