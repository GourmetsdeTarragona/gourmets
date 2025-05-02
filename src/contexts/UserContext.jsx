import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const id = localStorage.getItem('usuario_id');
      const rol = localStorage.getItem('usuario_rol');
      if (id && rol) {
        setUser({ id, rol });
      } else {
        setUser(null);
      }
    };

    handleStorageChange(); // inicial
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('usuario_rol');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
