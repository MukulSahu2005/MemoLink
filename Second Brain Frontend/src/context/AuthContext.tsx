import { createContext, useContext, useState,useEffect} from 'react';
import type{ReactNode} from 'react';
import { authAPI } from '../api/endpoints';
import type{ User, AuthContextType } from '../types';


// Auth Contxt Data will be there in the all the components of the authContext => Saving Prop Drilling Mess

const AuthContext = createContext<AuthContextType | null>(null);

// AUTH PROVIDER COMPONENT => JISME MERI POORI WEBSITE HOGI
// USE AUTH => WILL BE USED ONLY INSIDE AUTH PROVIDER 



export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // DATA 

  // lazy initialization
  const [user, setUser] = useState<User | null>(() => {
    // 1. First check URL parameters (e.g. for Google OAuth callback redirect)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const userParam = params.get('user');
      if (userParam) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(userParam));
          // Save to local storage synchronously!
          localStorage.setItem('memolink_user', JSON.stringify(parsedUser));
          return parsedUser;
        } catch (error) {
          console.error("Failed to parse Google user from URL params", error);
        }
      }
    }
    // 2. Fall back to local storage
    const saved = localStorage.getItem('memolink_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    // 1. First check URL parameters (e.g. for Google OAuth callback redirect)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const googleToken = params.get('token');
      if (googleToken) {
        // Save to local storage synchronously!
        localStorage.setItem('memolink_token', googleToken);
        return googleToken;
      }
    }
    // 2. Fall back to local storage
    return localStorage.getItem('memolink_token');
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // --- 2. ADD THIS NEW BLOCK: The Google Catcher ---
  // --- ADD THIS GOOGLE CATCHER ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleToken = params.get('token');
    const userParam = params.get('user');

    if (googleToken && userParam) {
      // Clean the URL so it looks nice
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);
  // ---------------------------------
  
  // Functions
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
// avoids prop drilling , to use everywhere inside the function 
export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  
  return ctx;
};
