"use client";
import { signIn, signOut, signUp, getCurrentUser, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

interface UserAttributes {
  email: string;
  [key: string]: string;
}

interface CodeDeliveryDetails {
  destination?: string;
  deliveryMedium?: string;
  attributeName?: string;
}

interface AuthSignInStep {
  signInStep: string;
  codeDeliveryDetails?: CodeDeliveryDetails;
}

interface SignInResponse {
  isSignedIn?: boolean;
  nextStep?: AuthSignInStep;
}

interface SignUpResponse {
  isSignUpComplete?: boolean;
  userId?: string;
  nextStep?: {
    signUpStep: string;
    codeDeliveryDetails?: CodeDeliveryDetails;
  };
}

interface CognitoUser {
  username: string;
  userId: string;
  signInDetails?: Record<string, unknown>;
  attributes?: {
    name?: string;
    email?: string;
    address?: string;
    phone_number?: string;
    [key: string]: string | undefined;
  };
}

interface AuthContextType {
  user: CognitoUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResponse>;
  signUp: (email: string, password: string, attributes: UserAttributes) => Promise<SignUpResponse>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ nextStep: { resetPasswordStep: string } }>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      console.log('Current user:', currentUser);
      setUser(currentUser as CognitoUser);
    } catch (error) {
      console.log('Error getting current user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(email: string, password: string): Promise<SignInResponse> {
    try {
      const result = await signIn({ username: email, password });
      if (result.isSignedIn) {
        const currentUser = await getCurrentUser();
        setUser(currentUser as CognitoUser);
      }
      return result as SignInResponse;
    } catch (error) {
      throw error;
    }
  }

  async function handleSignUp(email: string, password: string, attributes: UserAttributes) {
    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: attributes,
        },
      });
      return result as SignUpResponse;
    } catch (error) {
      throw error;
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      throw error;
    }
  }

  async function handleForgotPassword(email: string) {
    try {
      return await resetPassword({ username: email });
    } catch (error) {
      throw error;
    }
  }

  async function handleResetPassword(email: string, code: string, newPassword: string) {
    try {
      return await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
    } catch (error) {
      throw error;
    }
  }

  if (!mounted) {
    return null;
  }

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 