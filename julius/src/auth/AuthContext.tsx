import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  usuarioId: number | null;
  setToken: (token: string | null, usuarioId?: number | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'));
  const [usuarioId, setUsuarioId] = useState<number | null>(() => {
    const stored = localStorage.getItem('usuarioId');
    return stored ? parseInt(stored, 10) : null;
  });

  const setToken = (newToken: string | null, newUsuarioId?: number | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
    
    if (newUsuarioId !== undefined) {
      setUsuarioId(newUsuarioId);
      if (newUsuarioId) {
        localStorage.setItem('usuarioId', newUsuarioId.toString());
      } else {
        localStorage.removeItem('usuarioId');
      }
    }
  };

  const logout = () => {
    setToken(null, null);
  };

  return (
    <AuthContext.Provider value={{ token, usuarioId, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
