import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Definimos el tipo para el contexto de autenticación
interface AuthContextType {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

// Creamos el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  // Cargar el usuario desde localStorage cuando el contexto se inicializa
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Función para iniciar sesión, guarda el usuario en el estado y en localStorage
  const login = (username: string) => {
    setUser(username);
    localStorage.setItem("user", username); // Guardar el usuario en localStorage
  };

  // Función para cerrar sesión, elimina el usuario del estado y de localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Eliminar el usuario de localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
