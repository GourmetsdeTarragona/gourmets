import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('usuario_id');
    const storedRol = localStorage.getItem('usuario_rol');

    if (storedId && storedRol) {
      setUser({ id: storedId, rol: storedRol });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
