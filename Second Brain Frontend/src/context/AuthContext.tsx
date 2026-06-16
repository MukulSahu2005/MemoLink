import { createContext, useContext, useState} from 'react';
import type{ReactNode} from 'react';
import { authAPI } from '../api/endpoints';
import type{ User, AuthContextType } from '../types';


const AuthContext = createContext<AuthContextType | null>(null);

// AUTH PROVIDER COMPONENT => JISME MERI POORI WEBSITE HOGI
// USE AUTH => WILL BE USED ONLY INSIDE AUTH PROVIDER 

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  // lazy initialization
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('memolink_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('memolink_token');
  });

  
  const [isLoading, setIsLoading] = useState(false);


  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      
      const res = await authAPI.signin({ identifier, password });
      const { user: userData, accessToken } = res.data.data;
      
      localStorage.setItem('memolink_token', accessToken);
      localStorage.setItem('memolink_user', JSON.stringify(userData));
      
      setToken(accessToken);
      setUser(userData);
    } 
    finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, password: string, email?: string) => {
    setIsLoading(true);

    try {
      await authAPI.signup({ username, password, email });
    } 
    finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authAPI.logout().catch(() => {});
    } 
    finally {
      localStorage.removeItem('memolink_token');
      localStorage.removeItem('memolink_user');

      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


// USE AUTH FUNCTION => TO CHECK FOR AUTH
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  
  return ctx;
};
