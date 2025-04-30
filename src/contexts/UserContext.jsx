import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.warn('⚠️ No se pudo obtener usuario:', error.message);
          return;
        }

        if (data?.user?.id) {
          const { data: perfil, error: errPerfil } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (errPerfil) {
            console.warn('⚠️ Error al cargar perfil:', errPerfil.message);
            return;
          }

          setUser(perfil);
        } else {
          console.log('ℹ️ Usuario no logueado');
        }
      } catch (err) {
        console.error('❌ Error general en UserContext:', err);
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
