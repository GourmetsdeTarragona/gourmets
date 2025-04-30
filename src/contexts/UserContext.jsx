import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('❌ Error al obtener usuario:', error.message);
        return;
      }

      if (data?.user?.id) {
        const { data: perfil, error: errPerfil } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (errPerfil) {
          console.warn('⚠️ Error cargando perfil:', errPerfil.message);
          return;
        }

        setUser(perfil);
      } else {
        console.log('ℹ️ Usuario no logueado');
      }
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
