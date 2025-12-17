import React, { createContext, useState, ReactNode, useMemo, useEffect } from "react";
import { AuthState } from "../utils/types";

interface AuthContextType {
  auth: AuthState | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthState | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuthState] = useState<AuthState | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        setAuthState(JSON.parse(storedAuth));
      } catch (error) {
        console.error("Error parsing stored auth:", error);
        localStorage.removeItem("auth");
      }
    }
  }, []);

  const setAuth: React.Dispatch<React.SetStateAction<AuthState | null>> = (value) => {
    setAuthState((prev) => {
      const newAuth = typeof value === 'function' ? value(prev) : value;
      if (newAuth) {
        localStorage.setItem("auth", JSON.stringify(newAuth));
      } else {
        localStorage.removeItem("auth");
      }
      return newAuth;
    });
  };

  const value = useMemo(() => ({ auth, setAuth }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
