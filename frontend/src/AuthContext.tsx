import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  title?: string;
  department?: string;
  phone?: string;
  location?: string;
  avatar?: string;
  bio?: string;
  joinedDate?: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    department?: string;
    phone?: string;
    location?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (
    data: Partial<User> & { currentPassword?: string; newPassword?: string }
  ) => Promise<{ success: boolean; error?: string }>;
}

const DEFAULT_USER: User = {
  id: 1,
  name: "Kiran",
  email: "kiran@clientra.com",
  role: "Admin",
  title: "Lead System Administrator",
  department: "Management & Tech",
  phone: "+1 (555) 234-5678",
  location: "San Francisco, CA",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  bio: "Clientra Administrator overseeing CRM configuration, user roles, deal workflows, and company analytics.",
  joinedDate: "2024-01-15",
  status: "Active"
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = 'http://localhost:3000/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('crm_user');
      const hasLoggedOut = localStorage.getItem('crm_logged_out');
      if (hasLoggedOut === 'true') {
        return null;
      }
      return savedUser ? JSON.parse(savedUser) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('crm_token') || 'token_1_default';
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('crm_user', JSON.stringify(user));
      localStorage.removeItem('crm_logged_out');
    } else {
      localStorage.removeItem('crm_user');
      localStorage.setItem('crm_logged_out', 'true');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('crm_token', token);
    } else {
      localStorage.removeItem('crm_token');
    }
  }, [token]);

  const login = async (email: string, password = ''): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || 'Failed to log in' };
      }
      setUser(data.user);
      setToken(data.token);
      setIsLoading(false);
      return { success: true };
    } catch {
      // Fallback for offline/demo if backend is unreachable
      if (email.toLowerCase().includes('kiran')) {
        setUser(DEFAULT_USER);
        setToken('token_1_demo');
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: 'Cannot connect to backend server. Ensure backend is running.' };
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    department?: string;
    phone?: string;
    location?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || 'Registration failed' };
      }
      setUser(data.user);
      setToken(data.token);
      setIsLoading(false);
      return { success: true };
    } catch {
      setIsLoading(false);
      return { success: false, error: 'Cannot connect to backend server.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('crm_user');
    localStorage.removeItem('crm_token');
    localStorage.setItem('crm_logged_out', 'true');
  };

  const updateProfile = async (
    data: Partial<User> & { currentPassword?: string; newPassword?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || 'token_1'}`,
        },
        body: JSON.stringify({ ...data, id: user?.id }),
      });
      const updatedUser = await res.json();
      if (!res.ok) {
        return { success: false, error: updatedUser.error || 'Failed to update profile' };
      }
      setUser(updatedUser);
      return { success: true };
    } catch {
      // Offline fallback update in memory
      if (user) {
        const localUpdated = { ...user, ...data };
        setUser(localUpdated);
        return { success: true };
      }
      return { success: false, error: 'Network error updating profile' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
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
