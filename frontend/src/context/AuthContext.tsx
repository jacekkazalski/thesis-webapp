import React, { createContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { AuthState } from '../utils/types';

interface AuthContextType {
  auth: AuthState | null;
  authReady: boolean;
  setAuth: React.Dispatch<React.SetStateAction<AuthState | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuthState] = useState<AuthState | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        setAuthState(JSON.parse(storedAuth));
      } catch (error) {
        console.error('Error parsing stored auth:', error);
        localStorage.removeItem('auth');
      }
    }
    setAuthReady(true);
  }, []);

  const setAuth: React.Dispatch<React.SetStateAction<AuthState | null>> = (value) => {
    setAuthState((prev) => {
      const newAuth = typeof value === 'function' ? value(prev) : value;
      if (newAuth) {
        localStorage.setItem('auth', JSON.stringify(newAuth));
      } else {
        localStorage.removeItem('auth');
      }
      return newAuth;
    });
  };

  const value = useMemo(() => ({ auth, authReady, setAuth }), [auth, authReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
