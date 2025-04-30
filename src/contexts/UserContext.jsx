// src/context/UserContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener sesión inicial
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        // Opcional: fetch de perfil desde tabla usuarios
        const { data: perfil } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (perfil) {
          setUser(perfil); // contiene id, nombre, rol, etc.
        }
      }
    };

    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
