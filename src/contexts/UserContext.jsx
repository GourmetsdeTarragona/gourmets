import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error al obtener usuario:', error);
        return;
      }

      if (data?.user) {
        const { data: perfil, error: perfilError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (perfilError) {
          console.error('Error cargando perfil:', perfilError);
          return;
        }

        setUser(perfil);
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
