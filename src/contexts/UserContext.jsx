import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error('Error al obtener sesión:', authError.message);
        return;
      }

      const authUser = authData?.user;
      if (!authUser?.id) return;

      const { data: perfil, error: perfilError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (perfilError) {
        console.error('Error al cargar perfil:', perfilError.message);
        return;
      }

      setUser(perfil);
    };

    cargarUsuario();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
