'use client';

import { useState, useEffect } from 'react';
import AuthContext, { User } from './AuthContext';
import { fetchAuthSession, signIn, signOut, getCurrentUser } from 'aws-amplify/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const session = await fetchAuthSession();
      if (session.tokens?.accessToken) {
        const currentUser = await getCurrentUser();
        setUser(currentUser as User);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleSignIn = async (username: string, password: string) => {
    try {
      await signIn({ username, password });
      await checkAuth();
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 