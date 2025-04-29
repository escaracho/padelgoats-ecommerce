import { createContext, useContext, ReactNode } from 'react';
import { fetchAuthSession, signIn, signOut, getCurrentUser } from 'aws-amplify/auth';

interface User {
  username: string;
  attributes: {
    email: string;
    email_verified: boolean;
    sub: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext; 