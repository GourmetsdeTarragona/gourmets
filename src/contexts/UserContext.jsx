import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined mientras carga

  useEffect(() => {
    const id = localStorage.getItem('usuario_id');
    const rol = localStorage.getItem('usuario_rol');
    if (id && rol) {
      setUser({ id, rol });
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
