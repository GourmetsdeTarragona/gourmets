import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts/UserContext';
import logoMarcaAgua from '/logo.png';

function Restaurants() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [restaurantes, setRestaurantes] = useState([]);
  const [votaciones, setVotaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagenes, setImagenes] = useState({});

  useEffect(() => {
    if (!user) return;

    const cargarDatos = async () => {
      setLoading(true);

      const { data: restData, error: restError } = await supabase
        .from('restaurantes')
        .select('id, nombre, fecha, asistentes, carta_url, minuta_url')
        .order('fecha', { ascending: false });

      const { data: votosData } = await supabase
        .from('votaciones')
        .select('restaurante_id')
        .eq('usuario_id', user.id);

      if (!restError) {
        setRestaurantes(restData || []);
        setVotaciones(votosData?.map((v) => v.restaurante_id) ||
