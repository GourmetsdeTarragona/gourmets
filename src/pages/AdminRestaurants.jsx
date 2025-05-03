// src/pages/AdminRestaurants.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function AdminRestaurants() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantes = async () => {
      const { data, error } = await supabase.from('restaurantes').select('*').order('fecha', { ascending: false });
      if (error) {
        console.error('Error al cargar restaurantes:', error.message);
      } else {
        setRestaurantes(data);
      }
      setLoading(false);
    };

    fetchRestaurantes();
  }, []);

  const handleVerDetalle = (id) => {
    navigate(`/admin/restaurante/${id}`);
  };

  return (
    <div className="container">
      <h2>Gestionar Restaurantes</h2>

      {
