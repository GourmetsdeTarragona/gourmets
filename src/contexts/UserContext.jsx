import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const id = localStorage.getItem('usuario_id');
    const rol = localStorage.getItem('usuario_rol');

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (id && rol && isUUID.test(id.trim())) {
      setUser({ id: id.trim(), rol: rol.trim() });
    } else {
      setUser(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('usuario_rol');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {user === undefined
        ? <p style={{ padding: '2rem', textAlign: 'center' }}>Cargando sesión...</p>
        : children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
