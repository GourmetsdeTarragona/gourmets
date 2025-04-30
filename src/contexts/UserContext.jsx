import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      console.log('🔍 Buscando sesión de usuario...');
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('❌ Error al obtener usuario:', error);
        return;
      }

      if (!data?.user) {
        console.log('⚠️ No hay sesión activa');
        return;
      }

      console.log('✅ Usuario autenticado:', data.user);

      const { data: perfil, error: perfilError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (perfilError) {
        console.error('❌ Error cargando perfil desde "usuarios":', perfilError);
        return;
      }

      console.log('✅ Perfil cargado:', perfil);
      setUser(perfil);
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
