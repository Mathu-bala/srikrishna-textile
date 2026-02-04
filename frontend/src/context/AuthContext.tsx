import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister } from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  returnUrl: string | null;
  setReturnUrl: (url: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    setUser({
      id: data._id,
      email: data.email,
      name: data.name,
      isAdmin: data.isAdmin,
      token: data.token,
    });
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await apiRegister(name, email, password);
    setUser({
      id: data._id,
      email: data.email,
      name: data.name,
      isAdmin: data.isAdmin,
      token: data.token,
    });
  };

  const logout = () => {
    setUser(null);
    setReturnUrl(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        returnUrl,
        setReturnUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
