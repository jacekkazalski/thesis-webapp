import { createContext, useState, ReactNode } from 'react';

interface AuthState {
    email?: string;
    username?: string;
    accessToken?: string;
}

interface AuthContextType {
    auth: AuthState;
    setAuth: (value: AuthState) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthState>({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
